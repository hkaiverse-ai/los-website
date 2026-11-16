(function () {
  var EMAIL = 'info@leanovaopexsolutions.com';
  var PHONE = '+91 94918 87419', TEL = '+919491887419';
  var LI = 'https://www.linkedin.com/company/leanova-opex-solutions-pvt-ltd/';
  var IG = 'https://www.instagram.com/leanovaopex/';

  var I = {
    agent: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 16.5h6"/>',
    network: '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M10.7 7.2 6.3 15.8M13.3 7.2l4.4 8.6M7.5 18h9"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9h8M8 12h5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    flow: '<rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="15" width="6" height="5" rx="1"/><path d="M9 6.5h4a2 2 0 0 1 2 2v6.5"/><path d="m13 13 2 2 2-2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m12 8 1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5z"/>',
    lean: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
    gauge: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="m12 17 4-6"/>',
    shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z"/><path d="m9 12 2 2 4-4"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2A5 5 0 0 1 21 19"/>',
    megaphone: '<path d="M3 10v4h4l8 5V5L7 10H3z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
    factory: '<path d="M3 21V10l6 4v-4l6 4V5h6v16H3z"/>',
    health: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
    cap: '<path d="m2 9 10-5 10 5-10 5L2 9z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/>',
    cart: '<path d="M3 4h2l2.4 11h11L21 7H6.2"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
    box: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    bank: '<path d="M3 9 12 4l9 5H3zM5 9v8M9.5 9v8M14.5 9v8M19 9v8M3 20h18"/>',
    code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7 15h10"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 15h6M9 18h4"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 12h.01"/>'
  };
  function icon(n) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + (I[n] || '') + '</svg>'; }
  window.leanovaIcon = icon;
  document.querySelectorAll('[data-icon]').forEach(function (el) { el.innerHTML = icon(el.getAttribute('data-icon')) + el.innerHTML; });

  /* The company's own infinity mark, cut out of its dark background so it sits on the page. */
  function mark(cls) {
    return '<img class="' + cls + '" src="img/logo-mark.png" alt="" width="569" height="224" decoding="async">';
  }
  window.leanovaMark = mark;
  document.querySelectorAll('[data-mark]').forEach(function (el) { el.innerHTML = mark(el.getAttribute('data-mark') || 'mark'); });

  var main = document.getElementById('main');
  var page = main ? main.getAttribute('data-page') : '';
  var NAV = [
    ['home', 'index.html', 'Home'],
    ['founder', 'founder.html', 'Founder'],
    ['about', 'about.html', 'About us'],
    ['services', 'services.html', 'Services'],
    ['asf', 'asf.html', 'ASF\u2122'],
    ['work', 'work.html', 'Our work'],
    ['industries', 'industries.html', 'Industries'],
    ['contact', 'contact.html', 'Contact us']
  ];

  var head = document.getElementById('site-header');
  if (head) {
    head.outerHTML =
      '<a class="skip" href="#main">Skip to main content</a>' +
      '<header class="top"><div class="wrap top-row">' +
      '<a class="brand" href="index.html" aria-label="Leanova Opex Solutions Private Limited, home">' + mark('brand-mark') +
      '<span class="brand-text"><b>LEANOVA OPEX SOLUTIONS</b><small>Private Limited</small></span></a>' +
      '<a class="btn btn-gold btn-sm top-cta" href="contact.html#experts">Talk to our experts</a>' +
      '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button></div>' +
      '<nav class="nav" id="nav" aria-label="Main"><div class="wrap nav-row">' +
      NAV.map(function (n) {
        return '<a href="' + n[1] + '"' + (n[0] === page ? ' aria-current="page"' : '') + (n[0] === 'asf' ? ' class="nav-asf"' : '') + '>' + n[2] + '</a>';
      }).join('') +
      '<a class="btn btn-gold btn-sm nav-cta" href="contact.html#experts">Talk to our experts</a>' +
      '</div></nav></header>';
  }

  var foot = document.getElementById('site-footer');
  if (foot) {
    foot.outerHTML =
      '<footer class="foot"><div class="wrap"><div class="foot-grid">' +
      '<div><a class="foot-brand" href="index.html" aria-label="Leanova Opex Solutions Private Limited, home"><img class="foot-logo" src="img/logo-full.png" alt="Leanova Opex: Optimize. Perform. Excel. Xperience." width="889" height="493"></a>' +
      '<p class="small"><b style="color:var(--text)">Leanova Opex Solutions Private Limited.</b> Automation, AI, websites, software and operations improvement from one team.</p>' +
      '<div class="social"><a href="' + LI + '" target="_blank" rel="noopener" aria-label="Leanova on LinkedIn (opens in a new tab)">' + icon('linkedin') + '</a>' +
      '<a href="' + IG + '" target="_blank" rel="noopener" aria-label="Leanova on Instagram (opens in a new tab)">' + icon('instagram') + '</a></div></div>' +
      '<div><h2>Company</h2><ul><li><a href="index.html">Home</a></li><li><a href="founder.html">Founder</a></li><li><a href="about.html">About us</a></li><li><a href="work.html#capabilities">Capabilities</a></li><li><a href="asf.html">ASF\u2122 Analysis Engine</a></li><li><a href="work.html">Our work</a></li><li><a href="work.html#studio">HKAIVERSE Capability Studio</a></li><li><a href="industries.html">Industries</a></li><li><a href="work.html#ventures">Related ventures</a></li><li><a href="contact.html">Contact</a></li></ul></div>' +
      '<div><h2>Services</h2><ul><li><a href="services.html#automation">Automation &amp; AI</a></li><li><a href="services.html#workflow">Workflow automation</a></li><li><a href="services.html#agents">AI agents &amp; assistants</a></li><li><a href="services.html#websites">Websites &amp; software</a></li><li><a href="services.html#website">Website development</a></li><li><a href="services.html#operations">Operations &amp; people</a></li><li><a href="services.html#lean">Lean transformation</a></li><li><a href="services.html#asf-framework">ASF™ framework</a></li></ul></div>' +
      '<div><h2>Contact</h2><address><b>LEANOVA OPEX SOLUTIONS PRIVATE LIMITED</b><br>Registered office: H.No. 5-12/424 B, Road No. 2, Near Sai Baba Temple, Ameenpur, Hyderabad \u2013 502032, Telangana, India.</address>' +
      '<ul style="margin-top:12px"><li><a href="mailto:' + EMAIL + '">' + EMAIL + '</a></li><li><a href="tel:' + TEL + '">' + PHONE + '</a></li></ul></div>' +
      '</div><div class="foot-base"><span>\u00a9 ' + new Date().getFullYear() + ' Leanova Opex Solutions Private Limited. All rights reserved.</span>' +
      '<nav aria-label="Legal"><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms &amp; Conditions</a></nav></div></div></footer>';
  }

  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  if (btn && nav) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? 'Close' : 'Menu';
  });

  var nb = document.getElementById('notes-btn');
  function setNotes(on) {
    document.body.classList.toggle('notes', on);
    if (nb) { nb.setAttribute('aria-pressed', on ? 'true' : 'false'); nb.textContent = on ? 'Hide review notes' : 'Show review notes'; }
    try { localStorage.setItem('leanova-notes', on ? '1' : '0'); } catch (e) {}
  }
  var saved = false;
  try { saved = localStorage.getItem('leanova-notes') === '1'; } catch (e) {}
  setNotes(saved);
  if (nb) nb.addEventListener('click', function () { setNotes(!document.body.classList.contains('notes')); });

  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy'), label = b.textContent;
      var done = function (m) { b.textContent = m; setTimeout(function () { b.textContent = label; }, 1800); };
      try { navigator.clipboard.writeText(text).then(function () { done('Copied'); }, function () { done('Select and copy'); }); }
      catch (e) { done('Select and copy'); }
    });
  });

  /* Site assistant: chat + ElevenLabs voice agent (see assistant.js). */
  var as = document.createElement('script'); as.src = 'assistant.js?v=5'; as.defer = true; document.body.appendChild(as);
})();
