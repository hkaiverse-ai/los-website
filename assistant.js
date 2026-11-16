/* Leanova site assistant: text chat + ElevenLabs voice agent.
   ------------------------------------------------------------------
   SETUP (one line): paste your ElevenLabs Conversational AI agent ID below.
   ElevenLabs dashboard -> Agents -> your agent -> copy the Agent ID.
   In the agent's Security settings, make it public (no auth) and add
   leanovaopexsolutions.com to the allowed domains.
   ------------------------------------------------------------------ */
(function () {
  var ELEVENLABS_AGENT_ID = window.LEANOVA_ELEVENLABS_AGENT_ID || 'agent_2101m7hfh7t6e97r6zyc4t2p9x8v';

  var PHONE = '+91 94918 87419', TEL = '+919491887419';
  var EMAIL = 'info@leanovaopexsolutions.com';
  var ICONS = {
    chat: '<path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9h8M8 12h5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'
  };
  function ic(n) { return '<svg class="la-ic" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[n] || '') + '</svg>'; }
  var SCRIPT = document.currentScript;
  var LOGO = (SCRIPT && SCRIPT.getAttribute('data-logo')) || 'img/logo-mark.png';

  /* ---------- What the assistant knows (from the site's own pages) ---------- */
  var KB = [
    'Leanova Opex Solutions Private Limited, Hyderabad, India: an operational excellence and technology company. One team for automation & AI, websites & software, and operations & people improvement. Principle: process first, technology second; never automate a broken process; people stay in control (important steps wait for a person to approve).',
    'Founder: Vijay Sekhar Danaboyina, Founder & Principal Consultant. 30+ years in Lean, Six Sigma, Industrial Engineering and Operational Excellence across 6 manufacturing organisations. Lean Six Sigma Master Black Belt / Black Belt, ISO 9001/14001/45001 Lead Auditor, MSME ZED Consultant, IATF 16949 Internal Auditor, M.Tech Industrial Engineering & Management. Page: founder.html',
    'Automation & AI services (services.html#automation): workflow & business process automation (approvals, reminders, hand-offs); CRM systems & integrations; document processing (data from invoices, forms, PDFs, checked against records, exceptions flagged to a person); dashboards & reporting; AI agents & assistants (chat and voice, support reply drafting, knowledge assistants for your documents); AI-enabled operations (demand/downtime forecasting, quality prediction).',
    'Websites & software (services.html#websites): website development, website maintenance & support, custom business software, online payments & bookings, cloud setup & hosting, AI-generated video (explainer, training, marketing clips).',
    'Operations & people (services.html#operations): digital transformation, Lean transformation, operational excellence, productivity improvement, quality excellence, training & capability development. Tools: VSM, 5S, Kaizen, Kanban, TPM, SMED, OEE, line balancing, Six Sigma DMAIC, SPC, Poka-Yoke, root cause analysis.',
    'ASF (Adaptive Systems Framework) improvement cycle, 7 stages: Understand, Diagnose, Prioritise, Design, Implement, Measure, Adapt. ASF Analysis Workspace (pilot, asf.html): sign in with Microsoft, upload company documents and website, ask business questions, get an evidence-backed report as PDF, PowerPoint, CSV or Markdown. Pilot access via contact.html#asf.',
    'Our work (work.html): capabilities include AI agents, multi-agent systems, voice AI agents, LLM solutions, workflow and intelligent process automation. 14 agents in the register, each labelled live, built or prototype. Ventures: HK AIverse (AI learning platform with the HKAIVERSE Capability Studio) and the ASF Universal Analysis Engine.',
    'Industries: manufacturing, logistics & supply chain, healthcare, education, retail, finance, technology (industries.html).',
    'Pricing: depends on scope. After a short conversation Leanova sends a written scope and quote before any work begins, no obligation. Usually no need to change existing software. Works with clients in India and internationally, mostly remote with on-site visits where needed. Replies by email usually within one working day.',
    'Contact: contact.html#experts (general consultation) or contact.html#project (scoped project). Email ' + EMAIL + ', phone/WhatsApp ' + PHONE + '. Registered office: H.No. 5-12/424 B, Road No. 2, Near Sai Baba Temple, Ameenpur, Hyderabad 502032, Telangana.'
  ].join('\n');

  var RULES = 'You are the website assistant for Leanova Opex Solutions. Answer visitor questions using ONLY the facts below. ' +
    'Tone: practical, plain and credible, like someone who understands factory and business operations. No hype, no jargon, no emojis. ' +
    'Keep answers under 110 words. Never invent prices, timelines, client names or results; never promise outcomes. ' +
    'If you do not know, say so and suggest talking to the team. For anything about a specific project, invite them to the contact page. ' +
    'If the question is unrelated to Leanova or business operations, politely steer back. ' +
    'Write plain text (short "- " bullets are fine). At the very end you may add up to two lines in the exact form "LINK: page.html#anchor | Label" pointing to the most useful pages from the facts.';

  /* ---------- Offline answers (used on the live site, where there is no AI backend) ---------- */
  var FAQ = [
    { k: ['price', 'cost', 'quote', 'charge', 'fee', 'budget', 'how much'], a: 'It depends on scope. After a short conversation we send a written scope and quote before any work begins, with no obligation.', l: [['contact.html#project', 'Discuss your project']] },
    { k: ['service', 'offer', 'what do you do', 'help with'], a: 'One team covers three areas:\n- Automation & AI: workflows, CRM, document processing, dashboards, AI agents\n- Websites & software: websites, maintenance, custom software, payments, hosting, AI video\n- Operations & people: Lean, quality, productivity and training\nYou can start with one service and add others as you grow.', l: [['services.html', 'See all services']] },
    { k: ['automat', 'workflow', 'repetitive', 'manual', 'approval'], a: 'We map the process first, remove the waste, then automate the routine steps (approvals, reminders, hand-offs and reports) with a person approving anything important.', l: [['services.html#automation', 'Automation & AI']] },
    { k: ['document', 'invoice', 'pdf', 'paper', 'form'], a: 'We read details from invoices, forms and PDFs, check them against your orders and records, and flag exceptions for a person instead of guessing.', l: [['services.html#automation', 'Document processing']] },
    { k: ['crm', 'lead', 'follow'], a: 'We set up or connect your CRM so leads, customers and follow-ups live in one place, with connections to email and forms and automatic reminders.', l: [['contact.html#project', 'Discuss your CRM']] },
    { k: ['dashboard', 'report', 'kpi', 'oee'], a: 'We build reports and dashboards that pull from one source of truth and send themselves on schedule, including live performance and OEE views.', l: [['services.html#automation', 'Dashboards & reporting']] },
    { k: ['agent', 'chatbot', 'voice', 'assistant', 'ai'], a: 'We build chat and voice agents that answer, draft and route work within clear limits, with a person approving what matters. Our team designs and runs its own agents first, in the HKAIVERSE Capability Studio.', l: [['work.html#built', 'Systems we have built'], ['services.html#agents', 'AI agents & assistants']] },
    { k: ['website', 'web site', 'site', 'hosting', 'payment', 'booking'], a: 'We plan and build business websites around your customers, with enquiry forms to your inbox or CRM, online payments and bookings, hosting, and ongoing maintenance with one contact for every change.', l: [['services.html#websites', 'Websites & software']] },
    { k: ['video'], a: 'We make AI-generated explainer, training and marketing videos, scoped per project. The two films on our home page are examples.', l: [['services.html#video', 'AI-generated video']] },
    { k: ['lean', 'six sigma', 'quality', 'productivity', 'kaizen', '5s', 'tpm', 'iso', 'zed', 'training'], a: 'This is where Leanova began: Lean transformation, quality excellence, productivity improvement and training, led by a founder with 30+ years on the shop floor and ISO Lead Auditor credentials.', l: [['services.html#operations', 'Operations & people']] },
    { k: ['asf', 'analysis', 'framework'], a: 'ASF™ is our Adaptive Systems Framework. The ASF™ Analysis Workspace (pilot) reads your documents and website together and returns an evidence-backed report as PDF, PowerPoint, CSV or Markdown.', l: [['asf.html#demo', 'Try the walkthrough'], ['contact.html#asf', 'Request pilot access']] },
    { k: ['founder', 'founded', 'vijay', 'who ', 'experience', 'team', 'owner', 'started'], a: 'Leanova was founded by Vijay Sekhar Danaboyina: 30+ years in Lean, Six Sigma and industrial engineering, Lean Six Sigma Master Black Belt and ISO 9001/14001/45001 Lead Auditor. Improvement consultants and engineers work as one team.', l: [['founder.html', 'Meet our founder']] },
    { k: ['industr', 'manufactur', 'factory', 'logistic', 'healthcare', 'retail'], a: 'We work across manufacturing, logistics & supply chain, healthcare, education, retail, finance and technology.', l: [['industries.html', 'Industries']] },
    { k: ['replace', 'staff', 'job'], a: 'No. The aim is to take repetitive work off your people so they can focus on customers and decisions. Important steps always wait for a person to approve them.', l: [] },
    { k: ['outside india', 'international', 'remote', 'abroad', 'country'], a: 'Yes. We work with clients internationally; most engagements run remotely, with on-site visits where needed.', l: [['contact.html#experts', 'Talk to our experts']] },
    { k: ['contact', 'call', 'phone', 'email', 'whatsapp', 'address', 'where', 'location', 'office', 'talk'], a: 'Email ' + EMAIL + ' or call/WhatsApp ' + PHONE + '. Our office is in Ameenpur, Hyderabad, Telangana. We usually reply within one working day.', l: [['contact.html#experts', 'Talk to our experts']] }
  ];
  function faqAnswer(q) {
    var s = ' ' + q.toLowerCase().replace(/leanova|opex/g, ' ') + ' ', best = null, score = 0;
    FAQ.forEach(function (f) {
      var n = 0; f.k.forEach(function (k) { if (s.indexOf(k) > -1) n += k.length; });
      if (n > score) { score = n; best = f; }
    });
    if (!best) return { text: 'I can help with our services, how we work, pricing, the ASF™ workspace and how to reach us. For anything specific to your business, our team can answer directly.', links: [['contact.html#experts', 'Talk to our experts']] };
    return { text: best.a, links: best.l };
  }

  /* ---------- Styles ---------- */
  var css = '' +
    '.la-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}.la-dock *,.la-panel,.la-panel *{box-sizing:border-box}.la-panel p{margin:0}' +
    '.la-chips[hidden],.la-panel [hidden]{display:none!important}' +
    '.la-dock{position:fixed;right:max(18px,env(safe-area-inset-right,0px));bottom:max(18px,env(safe-area-inset-bottom,0px));z-index:70;display:flex;flex-direction:column;align-items:flex-end;gap:10px}.la-dock[hidden]{display:none!important}' +
    '.la-fab{display:flex;align-items:center;gap:8px;background:#d6b064;color:#1b1407;border:0;border-radius:999px;padding:12px 18px 12px 14px;font:600 15px system-ui;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.08) inset}' +
    '.la-ic{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}' +
    '.la-fab:hover{background:#ecca86}' +
    '.la-fab-voice{background:#1d1f24;color:#ecca86;box-shadow:0 10px 30px rgba(0,0,0,.45),0 0 0 1px rgba(214,176,100,.55) inset}.la-fab-voice:hover{background:#17181c;color:#fff}' +
    '.la-fab .dot{width:8px;height:8px;border-radius:50%;background:#2f8f5b;box-shadow:0 0 0 3px rgba(47,143,91,.25)}' +
    '.la-panel{position:fixed;right:max(18px,env(safe-area-inset-right,0px));bottom:max(18px,env(safe-area-inset-bottom,0px));z-index:71;width:min(400px,calc(100vw - 24px));height:min(600px,calc(100dvh - 110px));display:flex;flex-direction:column;background:#121316;border:1px solid #383b42;border-radius:16px;box-shadow:0 24px 60px rgba(0,0,0,.6);overflow:hidden;font:400 15px/1.55 system-ui;color:#f3f1ec}' +
    '.la-panel[hidden]{display:none!important}' +
    '.la-head{display:flex;align-items:center;gap:10px;padding:14px 14px 10px;border-bottom:1px solid #2a2c31}' +
    '.la-head img{width:46px;height:auto;max-height:32px;object-fit:contain;border-radius:4px}.la-head b{font:700 15px system-ui;display:block}.la-head small{color:#9a9da4;font-size:12.5px}' +
    '.la-x{margin-left:auto;background:none;border:1px solid #383b42;color:#fff;border-radius:8px;width:34px;height:34px;font-size:18px;cursor:pointer}' +
    '.la-view{flex:1;min-height:0;display:flex;flex-direction:column}.la-view[hidden]{display:none!important}' +
    '.la-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}' +
    '.la-msg{max-width:88%;padding:10px 13px;border-radius:14px;white-space:pre-wrap;word-wrap:break-word;font-size:14.5px}' +
    '.la-msg.bot{background:#1d1f24;color:#c9cacd;border-bottom-left-radius:4px;align-self:flex-start}' +
    '.la-msg.me{background:rgba(214,176,100,.16);border:1px solid rgba(214,176,100,.35);color:#fff;border-bottom-right-radius:4px;align-self:flex-end}' +
    '.la-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.la-links a{font:600 13px system-ui;color:#ecca86;text-decoration:none;border:1px solid rgba(214,176,100,.45);border-radius:999px;padding:3px 10px}' +
    '.la-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}.la-chips button{background:none;border:1px solid #383b42;color:#c9cacd;border-radius:999px;padding:5px 11px;font:500 13px system-ui;cursor:pointer}.la-chips button:hover{border-color:#d6b064;color:#fff}' +
    '.la-form{display:flex;gap:8px;padding:10px 14px 14px;border-top:1px solid #2a2c31}' +
    '.la-form input{flex:1;min-width:0;background:#17181c;border:1px solid #383b42;color:#fff;border-radius:10px;padding:10px 12px;font:400 15px system-ui}' +
    '.la-form button{background:#d6b064;color:#1b1407;border:0;border-radius:10px;padding:0 14px;font:600 14px system-ui;cursor:pointer}.la-form button:disabled{opacity:.5;cursor:default}' +
    '.la-foot{font-size:11.5px;color:#9a9da4;padding:0 14px 10px;margin-top:-6px}' +
    '.la-voice{flex:1;display:flex;flex-direction:column;align-items:center;gap:14px;padding:22px 18px;text-align:center;overflow-y:auto}' +
    '.la-orb{width:132px;height:132px;border-radius:50%;flex:0 0 auto;background:radial-gradient(circle at 35% 30%,#f4dfae,#d6b064 45%,#6d5320 100%);box-shadow:0 0 0 0 rgba(214,176,100,.4);transition:transform .2s}' +
    '.la-orb.live{animation:laPulse 1.6s ease-out infinite}.la-orb.speaking{transform:scale(1.08)}' +
    '@keyframes laPulse{0%{box-shadow:0 0 0 0 rgba(214,176,100,.45)}100%{box-shadow:0 0 0 28px rgba(214,176,100,0)}}' +
    '@media (prefers-reduced-motion:reduce){.la-orb.live{animation:none}}' +
    '.la-status{font:600 15px system-ui}.la-sub{font-size:13.5px;color:#9a9da4;max-width:300px}' +
    '.la-vbtn{background:#d6b064;color:#1b1407;border:0;border-radius:999px;padding:11px 22px;font:600 15px system-ui;cursor:pointer;display:inline-flex;gap:8px;align-items:center}.la-vbtn .la-ic{width:18px;height:18px}' +
    '.la-vbtn.end{background:#b5473a;color:#fff}' +
    '.la-tx{width:100%;text-align:left;display:flex;flex-direction:column;gap:6px;font-size:13.5px}' +
    '.la-note{background:#2a2210;color:#f0d08f;border-left:3px solid #e5b45a;border-radius:6px;padding:8px 12px;font-size:13px;text-align:left}' +
    '.la-panel.la-panel-voice{height:auto;max-height:calc(100dvh - 110px)}.la-panel-voice .la-view{flex:0 1 auto}' +
    '@media (max-width:560px){.la-panel.la-panel-voice{height:auto;max-height:88dvh}.la-panel{right:0;left:0;bottom:0;width:100%;height:min(88dvh,640px);border-radius:16px 16px 0 0}.la-fab span.lbl{display:none}.la-fab{padding:14px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- Markup: two separate launchers, chat and voice, each with its own panel ---------- */
  var dock = document.createElement('div'); dock.className = 'la-dock';
  dock.innerHTML =
    '<button type="button" class="la-fab la-fab-voice" id="la-fab-voice" aria-haspopup="dialog" aria-expanded="false" aria-controls="la-p-voice" aria-label="Talk to the Leanova voice agent">' + ic('mic') + '<span class="lbl">Talk to us</span></button>' +
    '<button type="button" class="la-fab" id="la-fab-chat" aria-haspopup="dialog" aria-expanded="false" aria-controls="la-p-chat" aria-label="Chat with the Leanova assistant"><span class="dot" aria-hidden="true"></span>' + ic('chat') + '<span class="lbl">Chat with us</span></button>';

  function head(title, sub) {
    return '<div class="la-head"><img src="' + LOGO + '" alt=""><div><b>' + title + '</b><small>' + sub + '</small></div>' +
      '<button type="button" class="la-x" aria-label="Close">&times;</button></div>';
  }
  var chatPanel = document.createElement('section');
  chatPanel.className = 'la-panel'; chatPanel.id = 'la-p-chat'; chatPanel.hidden = true; chatPanel.setAttribute('role', 'dialog'); chatPanel.setAttribute('aria-label', 'Leanova chat');
  chatPanel.innerHTML = head('Chat with Leanova', 'Questions about our services, answered') +
    '<div class="la-view" id="la-v-chat">' +
    '<div class="la-log" id="la-log" aria-live="polite"></div>' +
    '<div class="la-chips" id="la-chips"></div>' +
    '<form class="la-form" id="la-form"><label class="la-sr" for="la-in">Your question</label><input id="la-in" autocomplete="off" maxlength="600" placeholder="Ask about services, pricing, ASF™…"><button type="submit" id="la-send">Send</button></form>' +
    '<div class="la-foot">Answers are automated and may be incomplete. For anything specific, our team will confirm.</div></div>';

  var voicePanel = document.createElement('section');
  voicePanel.className = 'la-panel la-panel-voice'; voicePanel.id = 'la-p-voice'; voicePanel.hidden = true; voicePanel.setAttribute('role', 'dialog'); voicePanel.setAttribute('aria-label', 'Leanova voice agent');
  voicePanel.innerHTML = head('Talk to Leanova', 'Voice agent · speak naturally') +
    '<div class="la-view"><div class="la-voice">' +
    '<div class="la-orb" id="la-orb" aria-hidden="true"></div>' +
    '<div class="la-status" id="la-vstatus">Talk to our voice agent</div>' +
    '<p class="la-sub" id="la-vsub">Ask about our services in a natural spoken conversation. Your browser will ask to use your microphone.</p>' +
    '<button type="button" class="la-vbtn" id="la-vbtn">' + ic('mic') + 'Start voice call</button>' +
    '<div id="la-vnote"></div>' +
    '<div class="la-tx" id="la-tx" aria-live="polite"></div>' +
    '<p class="la-sub">Prefer a person? Call or WhatsApp <b style="color:#f3f1ec">' + PHONE + '</b>.</p>' +
    '</div></div>';
  document.body.appendChild(dock); document.body.appendChild(chatPanel); document.body.appendChild(voicePanel);

  var $ = function (id) { return document.getElementById(id); };
  var log = $('la-log'), form = $('la-form'), inp = $('la-in'), send = $('la-send');
  var fabs = { chat: $('la-fab-chat'), voice: $('la-fab-voice') }, panels = { chat: chatPanel, voice: voicePanel };
  var openWhich = null;

  function openPanel(which) {
    which = which === 'voice' ? 'voice' : 'chat';
    if (openWhich && openWhich !== which) panels[openWhich].hidden = true;
    panels[which].hidden = false; dock.hidden = true; openWhich = which;
    fabs[which].setAttribute('aria-expanded', 'true');
    setTimeout(function () { if (which === 'chat') inp.focus(); else $('la-vbtn').focus(); }, 30);
  }
  function closePanel() {
    if (!openWhich) return;
    var w = openWhich; panels[w].hidden = true; dock.hidden = false; openWhich = null;
    fabs[w].setAttribute('aria-expanded', 'false'); fabs[w].focus();
  }
  fabs.chat.addEventListener('click', function () { openPanel('chat'); });
  fabs.voice.addEventListener('click', function () { openPanel('voice'); });
  [chatPanel, voicePanel].forEach(function (p) { p.querySelector('.la-x').addEventListener('click', closePanel); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openWhich) closePanel(); });
  window.leanovaAssistant = { open: openPanel };

  /* ---------- Chat ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* Optional data-pages="index,about,..." lists the pages this site has; links to other pages are remapped. */
  var PAGES = SCRIPT && SCRIPT.getAttribute('data-pages') ? SCRIPT.getAttribute('data-pages').split(',').map(function (x) { return x.trim(); }) : null;
  var REMAP = { founder: 'about', work: 'case-studies', capabilities: 'services', ventures: 'asf' };
  function safeHref(h) {
    h = String(h).trim();
    var m = /^([a-z0-9_-]+)\.html(#[a-z0-9_-]+)?$/i.exec(h); if (!m) return null;
    if (!PAGES || PAGES.indexOf(m[1]) > -1) return h;
    var alt = REMAP[m[1]];
    return (alt && PAGES.indexOf(alt) > -1) ? alt + '.html' : 'contact.html';
  }
  function bubble(cls) { var d = document.createElement('div'); d.className = 'la-msg ' + cls; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
  function renderBot(el, text, links) {
    var parsed = [], body = String(text).replace(/^\s*LINK:\s*(\S+)\s*\|\s*(.+)$/gim, function (m, h, l) { parsed.push([h, l]); return ''; }).trim();
    links = (links || []).concat(parsed);
    var html = esc(body);
    var good = links.map(function (l) { var h = safeHref(l[0]); return h ? '<a href="' + h + '">' + esc(l[1]) + ' &rarr;</a>' : ''; }).join('');
    el.innerHTML = html + (good ? '<div class="la-links">' + good + '</div>' : '');
    log.scrollTop = log.scrollHeight;
  }

  var history = [], busy = false, samplerP = null, aiOff = false;
  function getSampler() {
    if (aiOff) return Promise.resolve(null);
    if (!samplerP) samplerP = (window.claude && typeof window.claude.use === 'function') ? window.claude.use('sample').catch(function () { return null; }) : Promise.resolve(null);
    return samplerP;
  }

  function ask(q) {
    q = String(q || '').trim(); if (!q || busy) return;
    busy = true; send.disabled = true; inp.value = '';
    $('la-chips').hidden = true;
    bubble('me').textContent = q;
    history.push({ who: 'Visitor', text: q });
    var out = bubble('bot'); out.textContent = '…';
    getSampler().then(function (sample) {
      if (!sample) return offline();
      var convo = history.slice(-8).map(function (m) { return m.who + ': ' + m.text; }).join('\n');
      var prompt = RULES + '\n\nFACTS:\n' + KB + '\n\nCONVERSATION SO FAR:\n' + convo + '\n\nReply to the visitor\'s last message.';
      return sample(prompt, {
        cache: false, modelTier: 'quick',
        onText: function (p) { renderBot(out, p.text.replace(/^\s*LINK:.*$/gim, '')); }
      }).then(function (r) {
        renderBot(out, r.text || 'Sorry, I could not answer that. Our team can help directly.', r.text ? [] : [['contact.html#experts', 'Talk to our experts']]);
        history.push({ who: 'Assistant', text: (r.text || '').replace(/^\s*LINK:.*$/gim, '').trim() });
      }, function (err) {
        if (err && (err.code === 'not_granted' || err.code === 'unavailable')) aiOff = true;
        offline();
      });
    }).then(done, function () { offline(); done(); });

    function offline() { var a = faqAnswer(q); renderBot(out, a.text, a.links); history.push({ who: 'Assistant', text: a.text }); }
    function done() { busy = false; send.disabled = false; inp.focus(); }
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(inp.value); });

  renderBot(bubble('bot'), 'Hello. I can answer questions about Leanova: our automation, AI, website and operations services, how we work, and how to get started. What would you like to know?');
  ['What services do you offer?', 'Can you automate our paperwork?', 'How much does it cost?', 'Talk to the voice agent'].forEach(function (t) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = t;
    b.addEventListener('click', function () { if (t.indexOf('voice') > -1) openPanel('voice'); else ask(t); });
    $('la-chips').appendChild(b);
  });

  /* ---------- Voice (ElevenLabs Conversational AI) ---------- */
  var orb = $('la-orb'), vbtn = $('la-vbtn'), vstatus = $('la-vstatus'), vsub = $('la-vsub'), vnote = $('la-vnote'), tx = $('la-tx');
  var convo = null, connecting = false;
  var inPreview = /(^|\.)claude\.ai$|claudeusercontent\.com$|claude\.site$/i.test(location.hostname);

  function note(html) { vnote.innerHTML = html ? '<div class="la-note">' + html + '</div>' : ''; }
  function setIdle(msg, sub) {
    orb.className = 'la-orb'; vstatus.textContent = msg || 'Talk to our voice agent';
    if (sub) vsub.textContent = sub;
    vbtn.className = 'la-vbtn'; vbtn.innerHTML = ic('mic') + 'Start voice call'; vbtn.disabled = false;
  }
  function addTx(who, text) {
    if (!text) return;
    var d = document.createElement('div'); d.className = 'la-msg ' + (who === 'user' ? 'me' : 'bot'); d.textContent = text;
    tx.appendChild(d); while (tx.children.length > 8) tx.removeChild(tx.firstChild);
  }

  if (!ELEVENLABS_AGENT_ID) {
    note('Voice agent not connected yet. Add the ElevenLabs agent ID at the top of <b>assistant.js</b> to switch it on.');
  } else if (inPreview) {
    note('This preview blocks microphone access, so the voice call runs only on the live site (leanovaopexsolutions.com).');
  }

  function loadSdk() {
    return import('https://cdn.jsdelivr.net/npm/@elevenlabs/client@1.36.1/+esm').then(function (m) { return m.Conversation; });
  }

  function startVoice() {
    if (!ELEVENLABS_AGENT_ID) { note('Voice agent not connected yet. Please use chat, or call ' + esc(PHONE) + '.'); return; }
    if (connecting) return;
    connecting = true; vbtn.disabled = true; vstatus.textContent = 'Connecting…'; note('');
    var mic = (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ? navigator.mediaDevices.getUserMedia({ audio: true }) : Promise.reject(new Error('nomic'));
    mic.then(function (stream) {
      stream.getTracks().forEach(function (t) { t.stop(); });
      return loadSdk();
    }).then(function (Conversation) {
      return Conversation.startSession({
        agentId: ELEVENLABS_AGENT_ID,
        onConnect: function () {
          connecting = false; orb.className = 'la-orb live'; vstatus.textContent = 'Listening…';
          vsub.textContent = 'Speak naturally. You can interrupt at any time.';
          vbtn.className = 'la-vbtn end'; vbtn.innerHTML = 'End call'; vbtn.disabled = false;
        },
        onDisconnect: function () { convo = null; connecting = false; setIdle('Call ended', 'Start again any time, or switch to chat.'); },
        onModeChange: function (m) {
          var speaking = m && m.mode === 'speaking';
          orb.className = 'la-orb live' + (speaking ? ' speaking' : '');
          vstatus.textContent = speaking ? 'Leanova is speaking…' : 'Listening…';
        },
        onMessage: function (m) { if (m) addTx((m.role || m.source) === 'user' ? 'user' : 'ai', m.message); },
        onError: function (e) { console.warn('[Leanova voice]', e); }
      });
    }).then(function (c) { convo = c; }, function (err) {
      connecting = false; console.warn('[Leanova voice]', err);
      var denied = err && (err.name === 'NotAllowedError' || err.name === 'SecurityError' || err.message === 'nomic');
      setIdle('Voice call unavailable', denied
        ? 'Microphone access was blocked. Allow the microphone for this site and try again, or use chat.'
        : 'We could not connect the voice agent just now. Please try again, use chat, or call us.');
      if (inPreview) note('This preview blocks microphone access, so the voice call runs only on the live site (leanovaopexsolutions.com).');
    });
  }
  function endVoice() { if (convo) { try { convo.endSession(); } catch (e) {} } convo = null; setIdle('Call ended', 'Start again any time, or switch to chat.'); }
  vbtn.addEventListener('click', function () { if (convo) endVoice(); else startVoice(); });
  window.addEventListener('pagehide', function () { if (convo) { try { convo.endSession(); } catch (e) {} } });

  /* Any element with data-open-assistant="chat|voice" opens the panel. */
  document.querySelectorAll('[data-open-assistant]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); openPanel(el.getAttribute('data-open-assistant') || 'chat'); });
  });
})();
