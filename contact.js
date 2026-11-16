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
  function showForm() { form.hidden = false; $('result').hidden = true; }
  function sendError(text) { var e = $('send-err'); e.textContent = text; e.hidden = !text; }
  form.addEventListener('change', function (e) {
    if (e.target.name === 'service' && services().length) bad(null, 'services-err', false);
  });

  var sending = false;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    sendError('');
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
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().catch(function () { return { success: false }; }); })
      .then(function (res) {
        if (!res || String(res.success) !== 'true') throw new Error((res && res.message) || 'failed');
        $('done-name').textContent = ', ' + name.split(' ')[0];
        form.reset(); setMode(mode);
        form.hidden = true;
        $('result').hidden = false;
        $('result').focus();
      })
      .catch(function () {
        sendError('Sorry, your message could not be sent. Please try again in a moment, or call +91 94918 87419.');
      })
      .then(function () { sending = false; btn.disabled = false; btn.textContent = btnLabel[mode]; });
  });

  $('again').addEventListener('click', function () { showForm(); $('msg').focus(); });
})();
