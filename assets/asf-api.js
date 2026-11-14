// ASF API client. Operations, fields and error shapes follow the ASF OpenAPI
// specification (los-asf-backend PR #2, infra/private-network/docs/asf-api-openapi.yaml,
// version 0.2.0-dev). Every request goes to the configured API Management gateway
// with only `Authorization: Bearer <Entra access token>`; no API or subscription key
// is used. Tokens are requested per call through `getToken` and never stored here.

export const SUPPORTED_EXTENSIONS = Object.freeze([
  '.pdf', '.docx', '.xlsx', '.xlsm', '.xls', '.csv', '.tsv', '.tab', '.txt', '.text', '.md', '.markdown', '.json',
]);
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
export const REPORT_FORMATS = Object.freeze({
  md: { label: 'Markdown', extension: 'md' },
  pdf: { label: 'PDF', extension: 'pdf' },
  csv: { label: 'CSV', extension: 'csv' },
  pptx: { label: 'PowerPoint', extension: 'pptx' },
});
export const OUTPUT_STYLES = Object.freeze(['executive', 'detailed', 'brief']);
export const LIMITS = Object.freeze({
  contextMin: 10, contextMax: 8000, objectiveMax: 2000,
  questionsMax: 20, questionMax: 1000, sourcesMin: 1, sourcesMax: 25,
  urlMin: 8, urlMax: 2048,
});

export class AsfApiError extends Error {
  constructor({ status, code, message, requestId, details, retryable = false }) {
    super(message || code || `HTTP ${status}`);
    this.name = 'AsfApiError';
    this.status = status;
    this.code = code || '';
    this.requestId = requestId || '';
    this.details = details || null;
    this.retryable = retryable;
  }
}

// Normalizes the three documented error bodies:
//   backend   {error: {code, message, request_id, details}}
//   gateway   {statusCode, message}
//   FastAPI   {detail: [{loc, msg, type}]}  (request validation)
async function toApiError(response) {
  let body = null;
  try {
    const type = response.headers.get('content-type') || '';
    if (type.includes('json')) body = await response.json();
  } catch {
    body = null;
  }
  const headerId = response.headers.get('x-request-id') || '';
  let code = '';
  let message = '';
  let details = null;
  let requestId = headerId;
  if (body && typeof body.error === 'object' && body.error) {
    code = String(body.error.code || '');
    message = String(body.error.message || '');
    details = body.error.details || null;
    requestId = String(body.error.request_id || headerId || '');
    // The backend's request-validation shape: details.errors = [{loc, msg}].
    if (details && Array.isArray(details.errors) && details.errors.length) {
      const problems = details.errors.map((e) => (e && e.msg ? String(e.msg) : '')).filter(Boolean);
      if (problems.length) message = problems.join('; ');
    }
  } else if (body && Array.isArray(body.detail)) {
    code = 'validation_error';
    message = body.detail.map((d) => (d && d.msg ? String(d.msg) : '')).filter(Boolean).join('; ');
    details = { fields: body.detail.map((d) => (Array.isArray(d.loc) ? d.loc.join('.') : '')) };
  } else if (body && typeof body.message === 'string') {
    message = body.message;
  }
  const status = response.status;
  return new AsfApiError({ status, code, message, requestId, details, retryable: status === 429 || status >= 500 });
}

export function createAsfClient({ baseUrl, getToken, fetchImpl = (...args) => fetch(...args) }) {
  const base = baseUrl.replace(/\/+$/, '');

  async function send(path, { method = 'GET', json, formData, signal } = {}, attempt = 0) {
    const token = await getToken({ forceRefresh: attempt > 0 });
    const headers = { Authorization: `Bearer ${token}` };
    let body;
    if (json !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(json);
    } else if (formData) {
      body = formData; // the browser sets the multipart boundary
    }
    let response;
    try {
      response = await fetchImpl(`${base}${path}`, {
        method, headers, body, signal,
        mode: 'cors', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer',
      });
    } catch (error) {
      if (error && error.name === 'AbortError') throw error;
      throw new AsfApiError({ status: 0, code: 'network_error', message: 'The ASF service could not be reached.', retryable: true });
    }
    // One retry with a freshly issued token if the gateway rejects the current one.
    if (response.status === 401 && attempt === 0) return send(path, { method, json, formData, signal }, 1);
    if (!response.ok) throw await toApiError(response);
    return response;
  }

  const id = (value) => encodeURIComponent(String(value));

  return {
    // POST /sources: multipart/form-data with one field `file`. 201 -> Source.
    async uploadSource(file, { signal } = {}) {
      const formData = new FormData();
      formData.append('file', file, file.name);
      return (await send('/sources', { method: 'POST', formData, signal })).json();
    },
    // POST /sources/url: JSON {url}. 201 -> Source.
    async addUrlSource(url, { signal } = {}) {
      return (await send('/sources/url', { method: 'POST', json: { url }, signal })).json();
    },
    // GET /sources/{source_id} -> Source (404 when missing or not yours).
    async getSource(sourceId, { signal } = {}) {
      return (await send(`/sources/${id(sourceId)}`, { signal })).json();
    },
    // POST /analyze: AnalysisRequest. 202 -> AnalysisAccepted {analysis_id, status: queued}.
    async startAnalysis(request, { signal } = {}) {
      return (await send('/analyze', { method: 'POST', json: request, signal })).json();
    },
    // GET /analysis/{analysis_id} -> Analysis {status, current_stage, stages, result, error}.
    async getAnalysis(analysisId, { signal } = {}) {
      return (await send(`/analysis/${id(analysisId)}`, { signal })).json();
    },
    // GET /analysis/{analysis_id}/sources -> AnalysisSources {sources[], cited[]}.
    async getAnalysisSources(analysisId, { signal } = {}) {
      return (await send(`/analysis/${id(analysisId)}/sources`, { signal })).json();
    },
    // GET /analysis/{analysis_id}/report.md -> Markdown text (409 until complete).
    async getReportMarkdown(analysisId, { signal } = {}) {
      return (await send(`/analysis/${id(analysisId)}/report.md`, { signal })).text();
    },
    // GET /analysis/{analysis_id}/report?format=md|pdf|csv|pptx -> file contents.
    async getReportFile(analysisId, format, { signal } = {}) {
      if (!Object.hasOwn(REPORT_FORMATS, format)) throw new Error(`Unsupported report format: ${format}`);
      const response = await send(`/analysis/${id(analysisId)}/report?format=${id(format)}`, { signal });
      return response.blob();
    },
  };
}

// Builds the AnalysisRequest body from form values, trimming and dropping empties.
export function buildAnalysisRequest({ businessContext, objective, questionsText, outputStyle, sourceIds }) {
  const questions = String(questionsText || '')
    .split(/\r?\n/)
    .map((q) => q.trim())
    .filter(Boolean);
  const request = {
    business_context: String(businessContext || '').trim(),
    source_ids: [...sourceIds],
    questions,
    output_style: OUTPUT_STYLES.includes(outputStyle) ? outputStyle : 'executive',
  };
  const trimmedObjective = String(objective || '').trim();
  if (trimmedObjective) request.objective = trimmedObjective;
  return request;
}

// Client-side checks mirroring the documented limits. The server remains authoritative.
export function validateAnalysisInputs({ businessContext, objective, questionsText, sourceCount }) {
  const errors = {};
  const context = String(businessContext || '').trim();
  if (context.length < LIMITS.contextMin) errors.businessContext = `Describe the business context in at least ${LIMITS.contextMin} characters.`;
  else if (context.length > LIMITS.contextMax) errors.businessContext = `Shorten the business context to ${LIMITS.contextMax} characters or fewer.`;
  if (String(objective || '').trim().length > LIMITS.objectiveMax) errors.objective = `Shorten the objective to ${LIMITS.objectiveMax} characters or fewer.`;
  const questions = String(questionsText || '').split(/\r?\n/).map((q) => q.trim()).filter(Boolean);
  if (questions.length > LIMITS.questionsMax) errors.questions = `Ask up to ${LIMITS.questionsMax} questions, one per line.`;
  else if (questions.some((q) => q.length > LIMITS.questionMax)) errors.questions = `Keep each question to ${LIMITS.questionMax} characters or fewer.`;
  if (sourceCount < LIMITS.sourcesMin) errors.sources = 'Add at least one document or website URL.';
  else if (sourceCount > LIMITS.sourcesMax) errors.sources = `Use up to ${LIMITS.sourcesMax} sources in one analysis.`;
  return errors;
}

export function fileProblem(file) {
  const name = file.name || '';
  const dot = name.lastIndexOf('.');
  const extension = dot >= 0 ? name.slice(dot).toLowerCase() : '';
  if (!SUPPORTED_EXTENSIONS.includes(extension)) return 'This file type is not supported.';
  if (file.size === 0) return 'This file is empty.';
  if (file.size > MAX_UPLOAD_BYTES) return 'This file is larger than 25 MB.';
  return '';
}

// Plain-language messages for documented status codes and error codes.
export function describeApiError(error, context = '') {
  if (!(error instanceof AsfApiError)) return 'Something went wrong. Try again.';
  const byCode = {
    file_too_large: 'This file is larger than the 25 MB limit.',
    source_too_large: 'The page or file at this address is larger than the 25 MB limit.',
    unsupported_file_type: 'This file type is not accepted.',
    content_type_mismatch: 'The file contents do not match its extension.',
    empty_file: 'This file is empty.',
    extraction_failed: 'The contents could not be read. Scanned PDFs without a text layer and damaged files cannot be analyzed.',
    invalid_filename: 'The file needs a usable name.',
    url_blocked: 'This address cannot be used. Only public http or https addresses are accepted.',
    source_unreachable: 'The address could not be fetched or timed out.',
    source_not_found: 'One or more sources are no longer available. Remove them and add them again.',
    analysis_not_found: 'This analysis could not be found for your account.',
    analysis_not_complete: 'The report is not ready yet.',
    unknown_format: 'That report format is not available.',
  };
  let message;
  if (error.code && byCode[error.code]) message = byCode[error.code];
  else if (error.status === 0) message = 'The ASF service could not be reached. Check your connection and try again.';
  else if (error.status === 401) message = 'Your sign-in was not accepted. Sign out, sign in again and retry.';
  else if (error.status === 403) message = 'Your account is not permitted to use ASF Analysis. Contact Leanova to request access.';
  else if (error.status === 404) message = context === 'analysis' ? byCode.analysis_not_found : 'The requested item was not found for your account.';
  else if (error.status === 409) message = byCode.analysis_not_complete;
  else if (error.status === 413) message = byCode.file_too_large;
  else if (error.status === 415) message = byCode.unsupported_file_type;
  else if (error.status === 422) message = error.message ? `The request was not accepted: ${error.message}` : 'The request was not accepted. Check the inputs and try again.';
  else if (error.status === 429) message = 'You have reached the ASF usage limit (30 requests per minute, 10 analyses per day). Wait a minute, or try again tomorrow if the daily limit is reached.';
  else if (error.status === 503) message = 'The ASF analysis model is not available right now. Try again later.';
  else if (error.status >= 500) message = 'The ASF service had a problem. Try again shortly.';
  else message = error.message || 'The request was not accepted.';
  // Always show what the service actually returned, so a report can be traced in the logs.
  const facts = [error.status ? `HTTP ${error.status}` : '', error.code, error.requestId ? `reference ${error.requestId}` : '']
    .filter(Boolean).join(', ');
  return facts ? `${message} (${facts})` : message;
}
