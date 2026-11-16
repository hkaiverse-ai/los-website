(function () {
  /* FormSubmit: no key needed. The first message triggers a one-time "Activate" email to this inbox. */
  var ENDPOINT = 'https://formsubmit.co/ajax/info@leanovaopexsolutions.com';

  var $ = function (id) { return document.getElementById(id); };
  var form = $('enq');
  if (!form) return;
  var mode = 'experts';
  var btnLabel = { experts: 'Send message', project: 'Send project enquiry' };

  function setMode(m) {
    mode = m;
    $('tab-experts').setAttribute('aria-selected', m === 'experts' ? 'true' : 'false');
    $('tab-project').setAttribute('aria-selected', m === 'project' ? 'true' : 'false');
    form.setAttribute('aria-labelledby', 'tab-' + m);
    $('f-project').hidden = m !== 'project';
    $('msg-label').textContent = m === 'project' ? 'Describe the project' : 'How can we help?';
    $('msg').placeholder = m === 'project'
      ? 'Example: we want a voice agent to handle first-round screening calls, connected to our recruitment system.'
      : 'Example: our assembly line has frequent stoppages and we want to understand the main causes.';
    $('submit-btn').textContent = btnLabel[m];
  }
  $('tab-experts').addEventListener('click', function () { setMode('experts'); });
  $('tab-project').addEventListener('click', function () { setMode('project'); });
  function fromHash() {
    var h = (location.hash || '').slice(1);
    if (h === 'project' || h === 'experts') { setMode(h); showForm(); }
    if (h === 'asf') { setMode('project'); showForm(); var cb = $('svc-asf'); if (cb) cb.checked = true; if (!$('msg').value) $('msg').value = 'I would like pilot access to the ASF Analysis Workspace. Our company and what we want to analyse: '; }
  }
  window.addEventListener('hashchange', fromHash);
  setMode('experts');
  fromHash();

  function bad(input, errId, isBad) {
    if (input) input.setAttribute('aria-invalid', isBad ? 'true' : 'false');
    $(errId).hidden = !isBad;
    return isBad;
  }
  function services() {
    return Array.prototype.map.call(form.querySelectorAll('input[name=service]:checked'), function (x) { return x.value; });
  }
  function showForm() { form.hidden = false; $('result').hidden = true; var o = $('send-ok'); if (o) o.hidden = true; }
  function sendError(text) { var e = $('send-err'); e.textContent = text; e.hidden = !text; }
  form.addEventListener('change', function (e) {
    if (e.target.name === 'service' && services().length) bad(null, 'services-err', false);
  });

  var sending = false;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    sendError('');
    var okNote = $('send-ok'); if (okNote) okNote.hidden = true;
    var first = null, any = false;
    function check(input, errId, cond) { if (bad(input, errId, cond)) { any = true; first = first || input; } }
    check(form.querySelector('input[name=service]'), 'services-err', !services().length);
    check($('msg'), 'msg-err', !$('msg').value.trim());
    check($('name'), 'name-err', !$('name').value.trim());
    check($('email'), 'email-err', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('email').value.trim()));
    if (any) { first.focus(); return; }

    var name = $('name').value.trim(), email = $('email').value.trim(), org = $('org').value.trim();
    var picked = services();
    var data = {
      _subject: (mode === 'experts' ? 'Website enquiry: ' : 'Website project enquiry: ') + picked.join(', ') + (org ? ' (' + org + ')' : ''),
      _template: 'table',
      _captcha: 'false',
      _honey: $('botcheck').checked ? 'bot' : '',
      email: email,
      'Enquiry type': mode === 'experts' ? 'Talk to our experts' : 'Discuss your project',
      'Services': picked.join(', '),
      'Message': $('msg').value.trim(),
      'Name': name,
      'Organisation': org,
      'Country': $('country').value.trim(),
      'Phone': $('phone').value.trim()
    };
    if ($('botcheck').checked) return;   // spam bot filled the hidden box
    if (mode === 'project') {
      data['Preferred timeline'] = $('timeline').value;
      data['Organisation size'] = $('size').value;
    }
    Object.keys(data).forEach(function (k) { if (data[k] === '') delete data[k]; });

    sending = true;
    var btn = $('submit-btn');
    btn.disabled = true; btn.textContent = 'Sending\u2026';

    /* Remember exactly what was sent. If the visitor edits the form while the
       request is in flight, a late reply must not wipe those edits. */
    var fields = Array.prototype.slice.call(form.querySelectorAll('input:not([type=checkbox]):not([type=radio]), textarea, select'));
    var boxes = Array.prototype.slice.call(form.querySelectorAll('input[type=checkbox], input[type=radio]'));
    var sent = fields.map(function (f) { return f.value; }).concat(boxes.map(function (b) { return b.checked; }));
    var sentMode = mode;
    function editedSinceSend() {
      if (mode !== sentMode) return true;
      var now = fields.map(function (f) { return f.value; }).concat(boxes.map(function (b) { return b.checked; }));
      return now.some(function (v, i) { return v !== sent[i]; });
    }

    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (res) {
        /* Success only when the HTTP status is OK AND FormSubmit confirms it.
           FormSubmit answers 200 with success:"false" for problems such as an
           inbox that has not been activated yet, so the status alone is not enough. */
        if (!r.ok || !res || String(res.success) !== 'true') throw new Error((res && res.message) || ('HTTP ' + r.status));
        return res;
      });
    }).then(function () {
      $('done-name').textContent = ', ' + name.split(' ')[0];
      if (editedSinceSend()) {
        /* Sent, but keep what the visitor has typed since. */
        sendError('');
        var ok = $('send-ok');
        ok.textContent = 'Your message was sent. You have changed the form since sending; send it again if you want us to have those changes too.';
        ok.hidden = false;
        return;
      }
      form.reset(); setMode(mode);
      form.hidden = true;
      $('result').hidden = false;
      $('result').focus();
    }).catch(function (err) {
      console.warn('[Leanova contact]', err);
      var timedOut = err && err.name === 'AbortError';
      sendError(timedOut
        ? 'This is taking too long, so we stopped waiting. Your message may not have been sent. Please try again, or call +91 94918 87419.'
        : 'Sorry, your message could not be sent. Your details are still in the form. Please try again in a moment, or call +91 94918 87419.');
    }).then(function () {
      clearTimeout(timer);
      sending = false; btn.disabled = false; btn.textContent = btnLabel[mode];
    });
  });

  $('again').addEventListener('click', function () { showForm(); $('msg').focus(); });
})();
