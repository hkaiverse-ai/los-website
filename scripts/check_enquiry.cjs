// Exercise the real enquiry script with clipboard APIs available, denied or absent.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const script = fs.readFileSync(path.join(__dirname, '../assets/enquiry.js'), 'utf8');

function fixture({ clipboard, legacyCopy = false } = {}) {
  const nodes = new Map();
  function element(id) {
    if (!nodes.has(id)) nodes.set(id, {
      id, value: '', hidden: true, textContent: '', listeners: {}, attributes: {},
      addEventListener(name, handler) { this.listeners[name] = handler; },
      setAttribute(name, value) { this.attributes[name] = value; },
      setCustomValidity(value) { this.validation = value; },
      focus() { this.focused = true; },
      select() { this.selected = true; },
      setSelectionRange(start, end) { this.selection = [start, end]; },
    });
    return nodes.get(id);
  }
  const fields = ['name', 'email', 'company', 'challenge'].map((name) => Object.assign(element(name), {
    name, required: name !== 'company',
  }));
  const radios = ['operations', 'digital-ai', 'asf'].map((value) => Object.assign(element(value), { value }));
  const form = element('enquiry-form');
  form.elements = { namedItem: (name) => fields.find((field) => field.name === name) };
  form.querySelectorAll = () => radios;
  form.reportValidity = () => true;
  let copied;
  const context = {
    URLSearchParams,
    window: { location: { search: '?interest=digital-ai&service=llm' } },
    navigator: { clipboard: clipboard === 'success' ? { writeText: async (text) => { copied = text; } }
      : clipboard === 'denied' ? { writeText: async () => { throw new Error('denied'); } } : undefined },
    document: { getElementById: element, execCommand: () => legacyCopy },
  };
  vm.runInNewContext(script, context);
  return { element, fields, form, getCopied: () => copied };
}

(async () => {
  const success = fixture({ clipboard: 'success' });
  const values = ['QA & Review – ₹', 'reviewer+test@example.com', 'R&D + QA #1 50%', 'First: A&B + 50%? #1\nSecond: café and "quotes".'];
  success.fields.forEach((field, index) => { field.value = values[index]; });
  success.form.listeners.submit({ preventDefault() {} });
  const uri = new URL(success.element('compose-enquiry').attributes.href);
  assert.equal(uri.protocol, 'mailto:');
  assert.equal(uri.pathname, 'contact@leanovaopexsolutions.com');
  assert.equal(uri.searchParams.get('subject'), 'Leanova enquiry: Explore Digital & AI Solutions');
  const body = uri.searchParams.get('body');
  assert.ok(body.includes('Reply email: reviewer+test@example.com'));
  assert.ok(body.includes('Organization: R&D + QA #1 50%'));
  assert.ok(body.endsWith(values[3].replace(/\n/g, '\r\n')));
  assert.ok(!body.replace(/\r\n/g, '').includes('\n'));
  const gmail = new URL(success.element('compose-gmail').attributes.href);
  assert.equal(gmail.origin, 'https://mail.google.com');
  assert.equal(gmail.searchParams.get('view'), 'cm');
  assert.equal(gmail.searchParams.get('to'), uri.pathname);
  assert.equal(gmail.searchParams.get('su'), uri.searchParams.get('subject'));
  assert.equal(gmail.searchParams.get('body'), body);
  for (const [id, origin] of [['compose-outlook', 'https://outlook.live.com'], ['compose-m365', 'https://outlook.office.com']]) {
    const draft = new URL(success.element(id).attributes.href);
    assert.equal(draft.origin, origin);
    assert.equal(draft.searchParams.get('to'), uri.pathname);
    assert.equal(draft.searchParams.get('subject'), uri.searchParams.get('subject'));
    assert.equal(draft.searchParams.get('body'), body);
  }
  await success.element('copy-enquiry').listeners.click();
  assert.equal(success.getCopied(), success.element('enquiry-copy').value);
  assert.match(success.element('enquiry-copy-status').textContent, /^Enquiry text copied/);

  for (const clipboard of ['denied', undefined]) {
    const fallback = fixture({ clipboard });
    fallback.element('prepared-enquiry').hidden = false;
    fallback.element('enquiry-copy').value = 'A prepared enquiry';
    await fallback.element('copy-enquiry').listeners.click();
    assert.equal(fallback.element('enquiry-copy').selected, true);
    assert.match(fallback.element('enquiry-copy-status').textContent, /^Automatic copying is unavailable/);
    assert.doesNotMatch(fallback.element('enquiry-copy-status').textContent, /^Enquiry text copied/);
  }
  const legacy = fixture({ clipboard: 'denied', legacyCopy: true });
  legacy.element('prepared-enquiry').hidden = false;
  legacy.element('enquiry-copy').value = 'A prepared enquiry';
  await legacy.element('copy-enquiry').listeners.click();
  assert.match(legacy.element('enquiry-copy-status').textContent, /^Enquiry text copied/);
  success.element('compose-enquiry').listeners.click();
  assert.match(success.element('enquiry-open-status').textContent, /If no compose window appears/);
  assert.match(success.element('enquiry-open-status').textContent, /No email has been sent/);
  success.element('compose-gmail').listeners.click();
  assert.match(success.element('enquiry-open-status').textContent, /click Send/);
  assert.match(success.element('enquiry-open-status').textContent, /has not sent/);
  success.element('challenge').listeners.input();
  assert.equal(success.element('prepared-enquiry').hidden, true);
  assert.equal(success.element('compose-gmail').attributes.href, 'https://mail.google.com/mail/');
  console.log('PASS: Gmail/Outlook/Microsoft 365 and mailto encoding, CRLF, clipboard success and manual fallbacks, stale-link reset and no-send status.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
