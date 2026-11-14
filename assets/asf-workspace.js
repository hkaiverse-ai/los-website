// ASF workspace interface: Microsoft sign-in, source upload, analysis, progress,
// report display and downloads through the ASF API gateway.
// Files stay in memory on this page; only the latest analysis ID is kept in
// sessionStorage so a refresh can resume it. Tokens are never stored or shown here.
import {
  initAuth, signIn, signOut, getAccount, getTokenStatus, getAccessToken, onRenewal,
  describeAuthError, isSupportedOrigin, SignInRequiredError,
} from './asf-auth.js';
import { ASF_CONFIG } from './asf-config.js';
import {
  createAsfClient, AsfApiError, describeApiError, buildAnalysisRequest, validateAnalysisInputs,
  fileProblem, REPORT_FORMATS, LIMITS,
} from './asf-api.js';
import { renderMarkdown } from './asf-markdown.js';

const api = createAsfClient({
  baseUrl: ASF_CONFIG.gatewayBaseUrl,
  getToken: ({ forceRefresh }) => getAccessToken({ interactive: true, forceRefresh }),
});

const LAST_ANALYSIS_KEY = 'asf.workspace.lastAnalysisId';
const POLL = { fastMs: 4000, slowMs: 8000, fastForMs: 60000, rateLimitedMs: 20000, maxMs: 15 * 60000, maxTransientFailures: 5 };
const STAGES = [
  ['evidence', 'Reading evidence'],
  ['interpret', 'Interpreting business context'],
  ['extract', 'Extracting findings'],
  ['synthesize', 'Synthesizing'],
  ['ground', 'Checking findings against evidence'],
  ['complete', 'Complete'],
];
const STATUS_LABELS = { queued: 'Queued', running: 'Running', complete: 'Complete', failed: 'Failed' };

const $ = (id) => document.getElementById(id);
const ui = {
  authState: $('auth-state'), tokenState: $('token-state'),
  signIn: $('sign-in'), signOut: $('sign-out'), check: $('check-connection'),
  fields: $('analysis-fields'), lock: $('form-lock'), form: $('analysis-form'),
  fileInput: $('source-files'), drop: $('file-drop'), fileList: $('file-list'), sourcesError: $('sources-error'),
  urlInput: $('source-url'), addUrl: $('add-url'), urlError: $('url-error'), urlList: $('url-list'),
  context: $('business-context'), contextError: $('context-error'),
  objective: $('business-objective'), objectiveError: $('objective-error'),
  questions: $('business-question'), questionError: $('question-error'),
  outputStyle: $('output-style'),
  analyze: $('analyze'), newAnalysis: $('new-analysis'), submitState: $('submit-state'),
  progress: $('analysis-progress'), report: $('analysis-report'),
  downloads: [...document.querySelectorAll('[data-report-format]')], downloadState: $('download-state'),
};

const state = {
  authBusy: false,
  phase: 'idle', // idle | uploading | starting | running | complete | failed
  sources: [], // {key, kind, file?, url?, label, status: pending|uploading|ready|error, sourceId, info, message}
  analysisId: '',
  pollTimer: null,
  pollToken: 0,
  downloading: false,
};
let keySeq = 0;

const busy = () => ['uploading', 'starting', 'running'].includes(state.phase);

// ---------- Account ----------

function timeLabel(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderAccount() {
  const account = getAccount();
  const signedIn = Boolean(account);
  ui.signIn.hidden = signedIn;
  ui.signOut.hidden = !signedIn;
  ui.check.hidden = !signedIn;
  ui.signIn.disabled = state.authBusy;
  ui.check.disabled = state.authBusy;
  ui.signOut.disabled = state.authBusy; // signing out also stops any polling
  ui.lock.hidden = signedIn;
  ui.authState.textContent = signedIn
    ? `Signed in as ${account.name || account.username || 'your account'}.`
    : 'You are not signed in.';
  renderControls();
}

function renderControls() {
  const signedIn = Boolean(getAccount());
  ui.fields.disabled = !signedIn || busy();
  ui.analyze.textContent = state.phase === 'uploading' ? 'Preparing sources…'
    : state.phase === 'starting' ? 'Starting analysis…'
    : state.phase === 'running' ? 'Analysis running…'
    : 'Analyze';
  ui.newAnalysis.hidden = !(state.phase === 'complete' || state.phase === 'failed');
  ui.newAnalysis.disabled = busy();
  ui.downloads.forEach((button) => { button.disabled = state.phase !== 'complete' || state.downloading; });
}

async function runAuth(action) {
  if (state.authBusy) return;
  state.authBusy = true;
  renderAccount();
  try {
    await action();
  } catch (error) {
    console.error('ASF sign-in error:', error && error.errorCode ? error.errorCode : error && error.name);
    ui.tokenState.textContent = describeAuthError(error);
  } finally {
    state.authBusy = false;
    renderAccount();
  }
}

async function showTokenStatus(interactive) {
  const status = await getTokenStatus({ interactive });
  ui.tokenState.textContent = `Connected to ASF. Access is valid until ${timeLabel(status.expiresOn)} and renews automatically.`;
}

ui.signIn.addEventListener('click', () => runAuth(async () => {
  ui.tokenState.textContent = 'Complete sign-in in the Microsoft window.';
  await signIn();
  await showTokenStatus(false);
  await resumeLastAnalysis();
}));

ui.signOut.addEventListener('click', () => runAuth(async () => {
  stopPolling();
  await signOut();
  resetWorkspace({ keepInputs: false });
  ui.tokenState.textContent = 'You have signed out.';
}));

ui.check.addEventListener('click', () => runAuth(() => showTokenStatus(true)));

onRenewal((result) => {
  ui.tokenState.textContent = result.ok
    ? `Session renewed. Access is valid until ${timeLabel(result.status.expiresOn)}.`
    : `${describeAuthError(result.error)} Use “Check connection” to continue.`;
});

// ---------- Sources ----------

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function describeSourceInfo(info) {
  const parts = [];
  if (info.source_type) parts.push(String(info.source_type).toUpperCase());
  if (Number.isFinite(info.records)) parts.push(`${info.records} record${info.records === 1 ? '' : 's'}`);
  if (Number.isFinite(info.tables_profiled) && info.tables_profiled > 0) parts.push(`${info.tables_profiled} table${info.tables_profiled === 1 ? '' : 's'} profiled`);
  if (Array.isArray(info.pages_without_text_layer) && info.pages_without_text_layer.length) {
    parts.push(`${info.pages_without_text_layer.length} page(s) without a text layer`);
  }
  return parts.join(' · ');
}

function sourceStatusText(source) {
  if (source.status === 'uploading') return source.kind === 'url' ? 'Fetching and reading…' : 'Uploading and reading…';
  if (source.status === 'ready') return `Ready${source.info ? ` · ${describeSourceInfo(source.info)}` : ''}`;
  if (source.status === 'error' || source.status === 'retry') return source.message;
  return source.detail || 'Not uploaded yet';
}

function sourceItem(source) {
  const li = document.createElement('li');
  li.dataset.status = source.status;
  const text = document.createElement('span');
  text.className = 'workspace-list__name';
  text.textContent = source.label;
  const meta = document.createElement('span');
  meta.className = 'workspace-list__meta';
  meta.textContent = sourceStatusText(source);
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'workspace-list__remove';
  remove.textContent = 'Remove';
  remove.setAttribute('aria-label', `Remove ${source.label}`);
  remove.disabled = busy();
  remove.addEventListener('click', () => {
    state.sources = state.sources.filter((s) => s.key !== source.key);
    renderSources();
    (source.kind === 'url' ? ui.urlInput : ui.fileInput).focus();
  });
  li.append(text, meta, remove);
  return li;
}

function renderSources() {
  ui.fileList.replaceChildren(...state.sources.filter((s) => s.kind === 'file').map(sourceItem));
  ui.urlList.replaceChildren(...state.sources.filter((s) => s.kind === 'url').map(sourceItem));
}

function addFiles(fileList) {
  ui.sourcesError.textContent = '';
  for (const file of fileList) {
    const duplicate = state.sources.some((s) => s.kind === 'file' && s.file.name === file.name
      && s.file.size === file.size && s.file.lastModified === file.lastModified);
    if (duplicate) continue;
    const problem = fileProblem(file);
    state.sources.push({
      key: `s${++keySeq}`, kind: 'file', file, label: file.name,
      detail: formatSize(file.size), status: problem ? 'error' : 'pending', message: problem,
      sourceId: '', info: null,
    });
  }
  renderSources();
}

ui.fileInput.addEventListener('change', () => {
  addFiles(ui.fileInput.files);
  ui.fileInput.value = '';
});

['dragenter', 'dragover'].forEach((type) => ui.drop.addEventListener(type, (event) => {
  event.preventDefault();
  if (!ui.fields.disabled) ui.drop.classList.add('is-over');
}));
['dragleave', 'drop'].forEach((type) => ui.drop.addEventListener(type, (event) => {
  event.preventDefault();
  ui.drop.classList.remove('is-over');
}));
ui.drop.addEventListener('drop', (event) => {
  if (!ui.fields.disabled && event.dataTransfer) addFiles(event.dataTransfer.files);
});

function addUrl() {
  const raw = ui.urlInput.value.trim();
  ui.urlError.textContent = '';
  ui.sourcesError.textContent = '';
  const fail = (message) => { ui.urlError.textContent = message; ui.urlInput.focus(); };
  if (!raw) return fail('Enter a website address.');
  let url;
  try {
    url = new URL(raw);
  } catch {
    return fail('Enter a full address, for example https://example.com/page.');
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return fail('Only web addresses starting with https:// or http:// can be added.');
  if (url.username || url.password) return fail('Remove sign-in details from the address before adding it.');
  const value = url.href;
  if (value.length < LIMITS.urlMin || value.length > LIMITS.urlMax) return fail(`Use an address between ${LIMITS.urlMin} and ${LIMITS.urlMax} characters.`);
  if (!state.sources.some((s) => s.kind === 'url' && s.url === value)) {
    state.sources.push({ key: `s${++keySeq}`, kind: 'url', url: value, label: value, detail: '', status: 'pending', message: '', sourceId: '', info: null });
  }
  ui.urlInput.value = '';
  renderSources();
}

ui.addUrl.addEventListener('click', addUrl);
ui.urlInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addUrl();
  }
});

// ---------- Analyze ----------

// Errors that are not about the file itself (network, sign-in, access, usage
// limit, server or gateway failure). The run stops at the first one instead of
// trying each remaining source, and the source is retried on the next Analyze.
const isBlocking = (error) => error instanceof AsfApiError
  && ([0, 401, 403, 429].includes(error.status) || error.status >= 500);
const isAuthError = (error) => Boolean(error) && !(error instanceof AsfApiError)
  && (Boolean(error.errorCode) || error instanceof SignInRequiredError);

function clearFieldErrors() {
  [ui.sourcesError, ui.contextError, ui.objectiveError, ui.questionError, ui.submitState].forEach((el) => { el.textContent = ''; });
}

async function prepareSources() {
  // Previously uploaded sources are re-checked; a 404 means they must be uploaded again.
  for (const source of state.sources.filter((s) => s.status === 'ready' && s.sourceId)) {
    try {
      source.info = await api.getSource(source.sourceId);
    } catch (error) {
      if (error instanceof AsfApiError && error.status === 404) {
        source.status = 'pending';
        source.sourceId = '';
      } else {
        throw error;
      }
    }
  }
  renderSources();
  for (const source of state.sources.filter((s) => s.status === 'pending' || s.status === 'retry')) {
    source.status = 'uploading';
    source.message = '';
    renderSources();
    try {
      const result = source.kind === 'file' ? await api.uploadSource(source.file) : await api.addUrlSource(source.url);
      source.status = 'ready';
      source.sourceId = result.source_id;
      source.info = result;
    } catch (error) {
      if (isBlocking(error) || isAuthError(error)) {
        // Not the file's fault: keep it, show why, and retry it on the next Analyze.
        source.status = 'retry';
        source.message = `${isAuthError(error) ? describeAuthError(error) : describeApiError(error, 'source')} Select Analyze to try again.`;
        renderSources();
        throw error;
      }
      source.status = 'error';
      source.message = describeApiError(error, 'source');
    }
    renderSources();
  }
}

ui.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy()) return;
  clearFieldErrors();
  if (!getAccount()) {
    ui.submitState.textContent = 'Sign in to prepare an analysis.';
    return;
  }
  const values = {
    businessContext: ui.context.value,
    objective: ui.objective.value,
    questionsText: ui.questions.value,
    outputStyle: ui.outputStyle.value,
  };
  const errors = validateAnalysisInputs({ ...values, sourceCount: state.sources.length });
  if (state.sources.some((s) => s.status === 'error')) {
    errors.sources = 'Remove the sources marked with a problem, then select Analyze again.';
  }
  if (Object.keys(errors).length) {
    ui.sourcesError.textContent = errors.sources || '';
    ui.contextError.textContent = errors.businessContext || '';
    ui.objectiveError.textContent = errors.objective || '';
    ui.questionError.textContent = errors.questions || '';
    ui.submitState.textContent = 'Check the highlighted fields.';
    const first = errors.sources ? ui.fileInput : errors.businessContext ? ui.context : errors.objective ? ui.objective : ui.questions;
    first.focus();
    return;
  }

  stopPolling();
  resetResults();
  setPhase('uploading');
  ui.submitState.textContent = 'Uploading and reading your sources…';
  try {
    await prepareSources();
    const failed = state.sources.filter((s) => s.status === 'error');
    if (failed.length) {
      setPhase('idle');
      ui.sourcesError.textContent = `${failed.length} source${failed.length === 1 ? '' : 's'} could not be used. Remove ${failed.length === 1 ? 'it' : 'them'} or replace ${failed.length === 1 ? 'it' : 'them'}, then select Analyze again.`;
      ui.submitState.textContent = 'The analysis has not started.';
      return;
    }
    setPhase('starting');
    ui.submitState.textContent = 'Starting the analysis…';
    const request = buildAnalysisRequest({ ...values, sourceIds: state.sources.map((s) => s.sourceId) });
    const accepted = await api.startAnalysis(request);
    if (!getAccount()) return; // signed out while the request was in flight
    beginTracking(accepted.analysis_id, accepted.status || 'queued');
  } catch (error) {
    setPhase('idle');
    const retryable = isAuthError(error) || isBlocking(error);
    ui.submitState.textContent = `The analysis has not started. ${isAuthError(error) ? describeAuthError(error) : describeApiError(error)}`
      + (retryable ? ' Sources already uploaded are kept; select Analyze to try again.' : '');
    if (error instanceof AsfApiError && error.code === 'source_not_found') {
      state.sources.forEach((s) => { if (s.status === 'ready') { s.status = 'pending'; s.sourceId = ''; } });
      renderSources();
    }
  }
});

ui.newAnalysis.addEventListener('click', () => {
  stopPolling();
  resetWorkspace({ keepInputs: false });
  ui.fileInput.focus();
});

function setPhase(phase) {
  state.phase = phase;
  renderControls();
  renderSources();
  renderAccount();
}

function resetResults() {
  state.analysisId = '';
  ui.progress.replaceChildren(emptyNote('No analysis has been started.'));
  ui.report.replaceChildren(emptyNote('The report and its cited sources will appear here when an analysis completes.'));
  ui.downloadState.textContent = '';
}

function resetWorkspace({ keepInputs }) {
  state.phase = 'idle';
  resetResults();
  forgetAnalysis();
  if (!keepInputs) {
    state.sources = [];
    ui.form.reset();
    ui.urlError.textContent = '';
    clearFieldErrors();
  }
  renderSources();
  renderAccount();
}

function emptyNote(text) {
  const p = document.createElement('p');
  p.className = 'workspace-empty';
  p.textContent = text;
  return p;
}

function rememberAnalysis(id) {
  try { window.sessionStorage.setItem(LAST_ANALYSIS_KEY, id); } catch { /* storage unavailable */ }
}
function forgetAnalysis() {
  try { window.sessionStorage.removeItem(LAST_ANALYSIS_KEY); } catch { /* storage unavailable */ }
}
function recalledAnalysis() {
  try { return window.sessionStorage.getItem(LAST_ANALYSIS_KEY) || ''; } catch { return ''; }
}

// ---------- Progress ----------

function renderProgress(analysis, note = '') {
  const status = analysis.status || 'queued';
  const wrap = document.createDocumentFragment();

  const head = document.createElement('p');
  head.className = 'workspace-progress__status';
  const badge = document.createElement('span');
  badge.className = `workspace-badge workspace-badge--${status}`;
  badge.textContent = STATUS_LABELS[status] || status;
  head.append(badge);
  const idText = document.createElement('span');
  idText.className = 'workspace-list__meta';
  idText.textContent = `Analysis ${analysis.analysis_id || state.analysisId}`;
  head.append(idText);
  wrap.append(head);

  const current = status === 'complete' ? 'complete' : analysis.current_stage || '';
  const currentIndex = STAGES.findIndex(([key]) => key === current);
  const list = document.createElement('ol');
  list.className = 'workspace-stages';
  STAGES.forEach(([key, label], index) => {
    const li = document.createElement('li');
    let stepState = 'pending';
    if (status === 'complete' || (currentIndex >= 0 && index < currentIndex)) stepState = 'done';
    else if (index === currentIndex) stepState = status === 'failed' ? 'failed' : 'current';
    li.dataset.state = stepState;
    li.textContent = label;
    if (stepState === 'current') li.setAttribute('aria-current', 'step');
    const hidden = document.createElement('span');
    hidden.className = 'sr-only';
    hidden.textContent = { done: ' (done)', current: ' (in progress)', failed: ' (failed)', pending: '' }[stepState];
    li.append(hidden);
    list.append(li);
  });
  wrap.append(list);

  if (current && currentIndex < 0) {
    const stage = document.createElement('p');
    stage.className = 'small';
    stage.textContent = `Current stage: ${current}`;
    wrap.append(stage);
  }
  if (status === 'failed') {
    const err = analysis.error && typeof analysis.error === 'object' ? analysis.error : {};
    const p = document.createElement('p');
    p.className = 'workspace-error';
    const reason = err.message ? `: ${String(err.message).replace(/[.\s]+$/, '')}.` : '.';
    p.textContent = `The analysis failed${reason} You can adjust the inputs and select Analyze again.`;
    wrap.append(p);
  }
  if (note) {
    const p = document.createElement('p');
    p.className = 'small workspace-progress__note';
    p.textContent = note;
    wrap.append(p);
  }
  ui.progress.replaceChildren(wrap);
}

function renderStalled(message, { retry = true } = {}) {
  const p = document.createElement('p');
  p.className = 'workspace-error';
  p.textContent = message;
  const nodes = [p];
  if (retry) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn--quiet';
    button.textContent = 'Check status again';
    button.addEventListener('click', () => beginTracking(state.analysisId, 'queued'));
    nodes.push(button);
  }
  ui.progress.append(...nodes);
}

function stopPolling() {
  state.pollToken += 1;
  if (state.pollTimer) window.clearTimeout(state.pollTimer);
  state.pollTimer = null;
}

function beginTracking(analysisId, initialStatus) {
  stopPolling();
  state.analysisId = analysisId;
  rememberAnalysis(analysisId);
  setPhase('running');
  ui.submitState.textContent = 'The analysis is running. You can keep this page open; it updates automatically.';
  let lastKnown = { analysis_id: analysisId, status: initialStatus };
  renderProgress(lastKnown);
  const token = state.pollToken;
  const startedAt = Date.now();
  let transientFailures = 0;

  const schedule = (ms) => {
    if (token !== state.pollToken) return;
    state.pollTimer = window.setTimeout(tick, ms);
  };

  async function tick() {
    if (token !== state.pollToken) return;
    const elapsed = Date.now() - startedAt;
    if (elapsed > POLL.maxMs) {
      setPhase('idle');
      ui.submitState.textContent = '';
      renderStalled('The analysis is taking longer than expected. It may still finish.');
      return;
    }
    let analysis;
    try {
      analysis = await api.getAnalysis(analysisId);
    } catch (error) {
      if (token !== state.pollToken) return;
      if (error instanceof AsfApiError && error.status === 429) {
        renderProgress(lastKnown, 'Usage limit reached briefly; checking again shortly.');
        schedule(POLL.rateLimitedMs);
        return;
      }
      if (error instanceof AsfApiError && error.retryable && transientFailures < POLL.maxTransientFailures) {
        transientFailures += 1;
        schedule(POLL.slowMs * transientFailures);
        return;
      }
      setPhase('idle');
      ui.submitState.textContent = '';
      if (error instanceof AsfApiError && error.status === 404) {
        forgetAnalysis();
        state.analysisId = '';
        ui.progress.replaceChildren(emptyNote(describeApiError(error, 'analysis')));
      } else {
        renderStalled(isAuthError(error) ? describeAuthError(error) : describeApiError(error, 'analysis'));
      }
      return;
    }
    if (token !== state.pollToken) return;
    transientFailures = 0;
    lastKnown = analysis;
    renderProgress(analysis);
    if (analysis.status === 'complete') {
      await showCompleted(analysisId, token);
      return;
    }
    if (analysis.status === 'failed') {
      setPhase('failed');
      ui.submitState.textContent = 'The analysis did not complete.';
      return;
    }
    schedule(elapsed < POLL.fastForMs ? POLL.fastMs : POLL.slowMs);
  }

  schedule(POLL.fastMs);
}

// ---------- Report ----------

async function showCompleted(analysisId, token) {
  ui.submitState.textContent = 'Analysis complete. Loading the report…';
  try {
    const [markdown, sources] = await Promise.all([
      api.getReportMarkdown(analysisId),
      api.getAnalysisSources(analysisId).catch((error) => ({ error })),
    ]);
    if (token !== state.pollToken) return;
    const article = document.createElement('article');
    article.className = 'asf-report';
    article.setAttribute('aria-label', 'ASF analysis report');
    article.append(renderMarkdown(markdown));
    const nodes = [article];
    if (sources && !sources.error) nodes.push(renderSourceSummary(sources));
    else nodes.push(emptyNote('The list of sources used could not be loaded.'));
    ui.report.replaceChildren(...nodes);
    setPhase('complete');
    ui.submitState.textContent = 'Analysis complete. Review the report below or download it.';
  } catch (error) {
    if (token !== state.pollToken) return;
    setPhase('complete');
    ui.report.replaceChildren(emptyNote(`The report could not be displayed. ${isAuthError(error) ? describeAuthError(error) : describeApiError(error, 'analysis')} You can still try the downloads.`));
    ui.submitState.textContent = 'Analysis complete.';
  }
}

function renderSourceSummary(data) {
  const section = document.createElement('section');
  section.className = 'asf-report__sources';
  section.setAttribute('aria-labelledby', 'report-sources-heading');
  const heading = document.createElement('h3');
  heading.id = 'report-sources-heading';
  heading.textContent = 'Sources';
  section.append(heading);

  const addList = (title, items, describe) => {
    if (!Array.isArray(items) || !items.length) return;
    const h = document.createElement('h4');
    h.textContent = title;
    const ul = document.createElement('ul');
    ul.className = 'workspace-list';
    items.forEach((item) => {
      const li = document.createElement('li');
      const name = document.createElement('span');
      name.className = 'workspace-list__name';
      name.textContent = item.name || item.source_id || 'Source';
      const meta = document.createElement('span');
      meta.className = 'workspace-list__meta';
      meta.textContent = describe(item);
      li.append(name, meta);
      ul.append(li);
    });
    section.append(h, ul);
  };
  addList('Provided for this analysis', data.sources, describeSourceInfo);
  addList('Cited in the findings', data.cited, (item) => {
    const parts = [];
    if (item.source_type) parts.push(String(item.source_type).toUpperCase());
    if (Number.isFinite(item.evidence_units)) parts.push(`${item.evidence_units} evidence unit${item.evidence_units === 1 ? '' : 's'}`);
    return parts.join(' · ');
  });
  return section;
}

ui.downloads.forEach((button) => button.addEventListener('click', async () => {
  const format = button.dataset.reportFormat;
  const meta = REPORT_FORMATS[format];
  if (!meta || !state.analysisId || state.downloading) return;
  state.downloading = true;
  renderControls();
  ui.downloadState.textContent = `Preparing the ${meta.label} report…`;
  try {
    const blob = await api.getReportFile(state.analysisId, format);
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `asf-report-${state.analysisId}.${meta.extension}`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(href), 60000);
    ui.downloadState.textContent = `${meta.label} report downloaded.`;
  } catch (error) {
    ui.downloadState.textContent = isAuthError(error) ? describeAuthError(error) : describeApiError(error, 'analysis');
  } finally {
    state.downloading = false;
    renderControls();
  }
}));

// Resume the latest analysis in this tab after a refresh or a new sign-in.
async function resumeLastAnalysis() {
  const id = recalledAnalysis();
  if (!id || !getAccount() || busy() || state.analysisId) return;
  beginTracking(id, 'queued');
}

// ---------- Start ----------

(async () => {
  renderSources();
  renderControls();
  if (!isSupportedOrigin()) {
    ui.authState.textContent = 'Sign-in is not yet available at this address.';
    ui.tokenState.textContent = 'ASF sign-in is currently enabled for the development environment only.';
    ui.signIn.hidden = true;
    return;
  }
  try {
    await initAuth();
    renderAccount();
    if (getAccount()) {
      try {
        await showTokenStatus(false);
        await resumeLastAnalysis();
      } catch (error) {
        ui.tokenState.textContent = `${describeAuthError(error)} Use “Check connection” to continue.`;
      }
    }
  } catch (error) {
    ui.authState.textContent = describeAuthError(error);
    ui.signIn.hidden = true;
  }
})();
