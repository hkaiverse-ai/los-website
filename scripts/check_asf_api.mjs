// Dependency-free checks for assets/asf-api.js against the ASF OpenAPI contract
// (los-asf-backend PR #2, asf-api-openapi.yaml 0.2.0-dev). Uses a fake fetch with
// spec-shaped responses; no network, tokens or keys are involved.
// Run: node scripts/check_asf_api.mjs
import assert from 'node:assert/strict';
import {
  createAsfClient, AsfApiError, describeApiError, buildAnalysisRequest,
  validateAnalysisInputs, fileProblem, MAX_UPLOAD_BYTES,
} from '../assets/asf-api.js';

const BASE = 'https://gateway.example.test/asf';
const json = (status, body, headers = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json', ...headers },
});

function harness(responder) {
  const calls = [];
  const tokenCalls = [];
  const client = createAsfClient({
    baseUrl: `${BASE}/`,
    getToken: async ({ forceRefresh }) => { tokenCalls.push(forceRefresh); return forceRefresh ? 'fresh-token' : 'test-token'; },
    fetchImpl: async (url, init) => { calls.push({ url, init }); return responder(url, init, calls.length); },
  });
  return { client, calls, tokenCalls };
}

const SOURCE = { source_id: 'src_94fb67d4f6b3632b154cce4d', name: 'sales_2026.xlsx', status: 'extracted', source_type: 'xlsx', records: 12 };
let passed = 0;
const test = async (name, fn) => { await fn(); passed += 1; console.log(`ok - ${name}`); };

await test('POST /sources sends multipart with one field "file" and a bearer token only', async () => {
  const { client, calls } = harness(() => json(201, SOURCE));
  const file = new File(['a,b\n1,2\n'], 'sales.csv', { type: 'text/csv' });
  const result = await client.uploadSource(file);
  assert.equal(result.source_id, SOURCE.source_id);
  const { url, init } = calls[0];
  assert.equal(url, `${BASE}/sources`);
  assert.equal(init.method, 'POST');
  assert.ok(init.body instanceof FormData);
  assert.deepEqual([...init.body.keys()], ['file']);
  assert.equal(init.body.get('file').name, 'sales.csv');
  assert.deepEqual(Object.keys(init.headers), ['Authorization']);
  assert.equal(init.headers.Authorization, 'Bearer test-token');
  assert.equal(init.credentials, 'omit');
});

await test('POST /sources/url sends JSON {url}', async () => {
  const { client, calls } = harness(() => json(201, { ...SOURCE, source_type: 'html' }));
  await client.addUrlSource('https://example.com/report');
  assert.equal(calls[0].url, `${BASE}/sources/url`);
  assert.equal(calls[0].init.headers['Content-Type'], 'application/json');
  assert.deepEqual(JSON.parse(calls[0].init.body), { url: 'https://example.com/report' });
});

await test('GET /sources/{id} encodes the path segment', async () => {
  const { client, calls } = harness(() => json(200, SOURCE));
  await client.getSource('src_a/b');
  assert.equal(calls[0].url, `${BASE}/sources/src_a%2Fb`);
  assert.equal(calls[0].init.method, 'GET');
});

await test('POST /analyze sends AnalysisRequest fields only and returns analysis_id', async () => {
  const { client, calls } = harness(() => json(202, { analysis_id: 'an_1', status: 'queued', links: {} }));
  const request = buildAnalysisRequest({
    businessContext: '  Act as an operations executive. Summarize the biggest operational problems. ',
    objective: '', questionsText: 'Where is downtime highest?\n\n  Which line is late?  ', outputStyle: 'detailed',
    sourceIds: ['src_1', 'src_2'],
  });
  const accepted = await client.startAnalysis(request);
  assert.equal(accepted.analysis_id, 'an_1');
  const body = JSON.parse(calls[0].init.body);
  assert.deepEqual(Object.keys(body).sort(), ['business_context', 'output_style', 'questions', 'source_ids']);
  assert.equal(body.business_context, 'Act as an operations executive. Summarize the biggest operational problems.');
  assert.deepEqual(body.questions, ['Where is downtime highest?', 'Which line is late?']);
  assert.equal(body.output_style, 'detailed');
  assert.deepEqual(body.source_ids, ['src_1', 'src_2']);
  const withObjective = buildAnalysisRequest({ businessContext: 'x'.repeat(20), objective: ' Cut late deliveries ', questionsText: '', outputStyle: 'nope', sourceIds: ['s'] });
  assert.equal(withObjective.objective, 'Cut late deliveries');
  assert.equal(withObjective.output_style, 'executive');
});

await test('GET analysis, sources, report.md and report?format', async () => {
  const { client, calls } = harness((url) => {
    if (url.endsWith('/report.md')) return new Response('# Title\n', { status: 200, headers: { 'content-type': 'text/markdown' } });
    if (url.includes('/report?format=')) return new Response(new Uint8Array([37, 80, 68, 70]), { status: 200, headers: { 'content-type': 'application/pdf' } });
    if (url.endsWith('/sources')) return json(200, { analysis_id: 'an_1', sources: [SOURCE], cited: [] });
    return json(200, { analysis_id: 'an_1', status: 'running', current_stage: 'extract' });
  });
  assert.equal((await client.getAnalysis('an_1')).current_stage, 'extract');
  assert.equal((await client.getAnalysisSources('an_1')).sources.length, 1);
  assert.equal(await client.getReportMarkdown('an_1'), '# Title\n');
  const pdf = await client.getReportFile('an_1', 'pdf');
  assert.equal(pdf.size, 4);
  assert.deepEqual(calls.map((c) => c.url.replace(BASE, '')), [
    '/analysis/an_1', '/analysis/an_1/sources', '/analysis/an_1/report.md', '/analysis/an_1/report?format=pdf',
  ]);
  await assert.rejects(client.getReportFile('an_1', 'docx'), /Unsupported report format/);
});

await test('401 retries once with a force-refreshed token, then surfaces the gateway error', async () => {
  const ok = harness((url, init, n) => (n === 1 ? json(401, { statusCode: 401, message: 'A valid sign-in is required.' }) : json(200, SOURCE)));
  await ok.client.getSource('src_1');
  assert.deepEqual(ok.tokenCalls, [false, true]);
  assert.equal(ok.calls[1].init.headers.Authorization, 'Bearer fresh-token');
  const bad = harness(() => json(401, { statusCode: 401, message: 'A valid sign-in is required.' }));
  const error = await bad.client.getSource('src_1').catch((e) => e);
  assert.ok(error instanceof AsfApiError);
  assert.equal(error.status, 401);
  assert.equal(bad.calls.length, 2);
  assert.match(describeApiError(error), /sign-in was not accepted/);
});

await test('backend Error body: code, message and request_id are kept', async () => {
  const { client } = harness(() => json(415, { error: { code: 'unsupported_file_type', message: "files of type '.exe' are not accepted", request_id: '4a80981520944ba5979a5576d563fff1' } }));
  const error = await client.uploadSource(new File(['x'], 'a.exe')).catch((e) => e);
  assert.equal(error.code, 'unsupported_file_type');
  assert.equal(error.requestId, '4a80981520944ba5979a5576d563fff1');
  assert.equal(describeApiError(error), 'This file type is not accepted. (HTTP 415, unsupported_file_type, reference 4a80981520944ba5979a5576d563fff1)');
});

await test('backend 422 invalid_request lists the field problems; 500 internal_error shows status and code', async () => {
  const invalid = harness(() => json(422, { error: { code: 'invalid_request', message: 'the request is invalid', request_id: 'r1', details: { errors: [{ loc: ['body', 'business_context'], msg: 'String should have at least 10 characters' }] } } }));
  const e422 = await invalid.client.startAnalysis({}).catch((e) => e);
  assert.match(describeApiError(e422), /String should have at least 10 characters.*HTTP 422, invalid_request, reference r1/);
  const crash = harness(() => json(500, { error: { code: 'internal_error', message: 'an internal error occurred', request_id: 'r2' } }));
  const e500 = await crash.client.uploadSource(new File(['a,b\n'], 'x.csv')).catch((e) => e);
  assert.equal(describeApiError(e500), 'The ASF service had a problem. Try again shortly. (HTTP 500, internal_error, reference r2)');
  const gw = harness(() => json(502, { statusCode: 502, message: 'Bad Gateway' }));
  assert.match(describeApiError(await gw.client.getAnalysis('a').catch((e) => e)), /\(HTTP 502\)$/);
});

await test('X-Request-ID header is used when the body has no request_id', async () => {
  const { client } = harness(() => json(404, { error: { code: 'analysis_not_found', message: "no analysis 'an_x'" } }, { 'x-request-id': 'req-123' }));
  const error = await client.getAnalysis('an_x').catch((e) => e);
  assert.equal(error.requestId, 'req-123');
  assert.match(describeApiError(error, 'analysis'), /could not be found for your account/);
});

await test('403, 404, 409, 422, 429 and 503 have plain-language messages', async () => {
  const cases = [
    [403, { statusCode: 403, message: 'Forbidden' }, /not permitted to use ASF Analysis/],
    [404, { error: { code: 'source_not_found', message: 'unknown source id(s)', details: { missing: ['src_x'] } } }, /no longer available/],
    [409, { error: { code: 'analysis_not_complete', message: 'not complete' } }, /not ready yet/],
    [422, { error: { code: 'extraction_failed', message: 'scanned', details: { source: {} } } }, /could not be read/],
    [422, { detail: [{ loc: ['body', 'business_context'], msg: 'String should have at least 10 characters', type: 'string_too_short' }] }, /String should have at least 10 characters/],
    [429, { statusCode: 429, message: 'Rate limit is exceeded.' }, /usage limit/],
    [503, { error: { code: 'model_unavailable', message: 'AI model not configured' } }, /model is not available/],
  ];
  for (const [status, body, pattern] of cases) {
    const { client } = harness(() => json(status, body));
    const error = await client.startAnalysis({}).catch((e) => e);
    assert.equal(error.status, status);
    assert.match(describeApiError(error), pattern, `status ${status}`);
  }
  const rate = await harness(() => json(429, { statusCode: 429, message: 'x' })).client.getAnalysis('a').catch((e) => e);
  assert.equal(rate.retryable, true);
});

await test('network failure becomes a retryable status-0 error', async () => {
  const { client } = harness(() => { throw new TypeError('Failed to fetch'); });
  const error = await client.getAnalysis('an_1').catch((e) => e);
  assert.equal(error.status, 0);
  assert.equal(error.retryable, true);
});

await test('client-side validation mirrors documented limits', async () => {
  assert.deepEqual(validateAnalysisInputs({ businessContext: 'long enough context', objective: '', questionsText: '', sourceCount: 1 }), {});
  const errors = validateAnalysisInputs({ businessContext: 'short', objective: 'o'.repeat(2001), questionsText: Array(21).fill('q').join('\n'), sourceCount: 0 });
  assert.deepEqual(Object.keys(errors).sort(), ['businessContext', 'objective', 'questions', 'sources']);
  assert.ok(validateAnalysisInputs({ businessContext: 'x'.repeat(8001), sourceCount: 26 }).sources);
  assert.equal(fileProblem({ name: 'sales_2026.xlsx', size: 39468 }), '');
  assert.match(fileProblem({ name: 'legacy.doc', size: 10 }), /not supported/);
  assert.match(fileProblem({ name: 'empty.csv', size: 0 }), /empty/);
  assert.match(fileProblem({ name: 'big.pdf', size: MAX_UPLOAD_BYTES + 1 }), /25 MB/);
});

console.log(`PASS: ${passed} ASF API client checks against the OpenAPI contract.`);
