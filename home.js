(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- "See it in action" demo (works with or without motion) ---------- */
  var M = 'manual', A = 'auto', C = 'call', W = 'we';
  var LABEL = { manual: 'Manual', auto: 'Automatic', call: 'Your call', we: 'We handle' };
  var CASES = [
    { kind: 'Automation', title: 'Enquiry to CRM to reply',
      today: 'Enquiries arrive by website form and email, and someone retypes each one before anyone replies.',
      after: 'Every enquiry lands in the CRM within seconds. A manager only approves, and the customer hears back the same day.',
      t: [['Read the enquiry in the inbox', M], ['Type the details into the CRM', M], ['Forward it to a manager for approval', M], ['Chase the manager for an answer', M], ['Write and send the reply', M], ['Update the sales spreadsheet', M]],
      w: [['Enquiry captured from the form and inbox', A], ['Details added to the CRM', A], ['Approval request sent to the right manager', A], ['Manager approves in one click', C], ['Reply drafted from your template and sent', A], ['Sales dashboard updated', A]] },
    { kind: 'Automation', title: 'Approvals and reminders',
      today: 'Requests travel by email and phone, nobody is sure who should approve, and decisions are lost in inboxes.',
      after: 'Each request follows one route, reminders go out on their own, and every decision is recorded.',
      t: [['Fill in a request form or email', M], ['Work out who should approve it', M], ['Email the approver', M], ['Chase by phone when there is no reply', M], ['Record the decision in a spreadsheet', M], ['Tell the requester the outcome', M]],
      w: [['Request submitted through one online form', A], ['Routed to the right approver', A], ['Reminder sent if there is no reply in 24 hours', A], ['Approver decides', C], ['Decision recorded with a full history', A], ['Requester notified', A]] },
    { kind: 'Automation', title: 'Weekly report on autopilot',
      today: 'Every Monday someone spends the morning copying numbers from three systems into a spreadsheet.',
      after: 'The report builds itself overnight from one source of truth. A manager checks the headline and it goes out.',
      t: [['Export data from three systems', M], ['Paste it into a spreadsheet', M], ['Fix formats and missing values', M], ['Rebuild the charts', M], ['Write the summary', M], ['Email it to managers', M]],
      w: [['Data pulled from every system', A], ['Combined and cleaned', A], ['Charts and dashboard refreshed', A], ['Summary drafted by AI', A], ['Manager checks the headline', C], ['Report emailed every Monday at 8 am', A]] },
    { kind: 'Automation', title: 'Supplier invoices',
      today: 'Invoices arrive as PDFs and are typed into accounts by hand, then checked against orders line by line.',
      after: 'Details are read from each PDF and matched to the order. People only look at the exceptions.',
      t: [['Open each PDF invoice', M], ['Type supplier and amounts into accounts', M], ['Check against the purchase order', M], ['Chase mismatches with the supplier', M], ['Get payment approval', M], ['File the PDF', M]],
      w: [['Details read from the PDF', A], ['Matched against the purchase order', A], ['Mismatches flagged for a person', C], ['Approval request sent', A], ['Finance approves payment', C], ['Posted to accounts and filed', A]] },
    { kind: 'Website', title: 'Business website rebuild',
      today: 'The website is out of date, hard to use on a phone, and enquiries sit unanswered in a shared inbox.',
      after: 'A clear site built around your customers, with enquiries going straight to your inbox or CRM and one contact for every change.',
      t: [['Site does not work well on phones', M], ['Enquiries land in a shared inbox and get missed', M], ['Every text change needs a developer', M], ['No backups or security updates', M], ['Nobody knows which pages bring enquiries', M]],
      w: [['Site planned around your customers and content', W], ['Built for phone, tablet and desktop', W], ['You approve every page before launch', C], ['Enquiry form goes straight to your inbox or CRM', A], ['Backups and security updates run on schedule', A], ['Content changes on request, one contact', W]] },
    { kind: 'Operations', title: 'Shop-floor productivity',
      today: 'Downtime is written on paper at the end of the shift, OEE is worked out weekly, and defects are found at final inspection.',
      after: 'Waste is removed first, then the data is captured at the machine so team leaders act on the same day.',
      t: [['Downtime written on paper at shift end', M], ['OEE calculated in a spreadsheet each week', M], ['Long changeovers with no standard method', M], ['Defects found only at final inspection', M], ['Daily meeting held without data', M]],
      w: [['Value stream mapped and waste removed', W], ['Standard changeover method (SMED)', W], ['Downtime captured at the machine', A], ['Live OEE dashboard for each line', A], ['Root causes fixed with 8D and Poka-Yoke', W], ['Team leaders act in the daily review', C]] }
  ];

  var picks = document.getElementById('d-picks');
  if (picks) {
    var cur = 0, mode = 'today';
    var $ = function (id) { return document.getElementById(id); };
    var bToday = $('d-today'), bWith = $('d-with');

    picks.innerHTML = CASES.map(function (c, i) {
      return '<button type="button" class="d-pick" data-i="' + i + '" aria-pressed="' + (i === 0) + '"><small>' + c.kind + '</small>' + c.title + '</button>';
    }).join('');

    function render(animate) {
      var c = CASES[cur], list = mode === 'today' ? c.t : c.w;
      $('d-kind').textContent = 'Example · ' + c.kind;
      $('d-title').textContent = c.title;
      $('d-intro').textContent = mode === 'today' ? c.today : c.after;
      var ol = $('d-steps');
      ol.innerHTML = list.map(function (s) {
        return '<li class="' + (s[1] !== M ? 'is-auto' : '') + (animate && !reduce ? ' enter' : '') + '"><span>' + s[0] + '</span><i class="pill p-' + s[1] + '">' + LABEL[s[1]] + '</i></li>';
      }).join('');
      if (animate && !reduce) {
        [].forEach.call(ol.children, function (li, k) { setTimeout(function () { li.classList.remove('enter'); }, 60 + k * 90); });
      }
      var manual = list.filter(function (s) { return s[1] === M; }).length;
      $('d-count').textContent = manual + ' of ' + list.length;
      $('d-bar').style.width = (list.length ? (manual / list.length) * 100 : 0) + '%';
      $('d-hint').textContent = mode === 'today'
        ? 'Switch to “With Leanova” to see what changes.'
        : (manual === 0 ? 'No step is done by hand any more. People only make the decisions that matter.' : manual + ' step(s) still done by hand.');
      bToday.setAttribute('aria-pressed', mode === 'today');
      bWith.setAttribute('aria-pressed', mode !== 'today');
    }
    picks.addEventListener('click', function (e) {
      var b = e.target.closest('.d-pick'); if (!b) return;
      cur = +b.getAttribute('data-i'); mode = 'today';
      [].forEach.call(picks.children, function (x) { x.setAttribute('aria-pressed', x === b); });
      render(true);
    });
    bToday.addEventListener('click', function () { if (mode !== 'today') { mode = 'today'; render(true); } });
    bWith.addEventListener('click', function () { if (mode === 'today') { mode = 'with'; render(true); } });
    render(false);
  }

  /* Intro video: plays silently when on screen, sound on request. */
  var film = document.getElementById('film'), snd = document.getElementById('film-sound');
  if (film) {
    var tries = 0; film.addEventListener('error', function () { if (tries++ < 3) setTimeout(function () { var u = film.currentSrc || film.src; film.src = u.split('#')[0] + (u.indexOf('?') < 0 ? '?' : '&') + 'r=' + tries; film.load(); }, 800 * tries); });
    var userChose = false;
    if (!reduce && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (userChose) return;
          if (e.isIntersecting) { var p = film.play(); if (p && p.catch) p.catch(function () {}); } else { film.pause(); }
        });
      }, { threshold: 0.5 }).observe(film);
    }
    function syncBtn() { if (!snd) return; snd.setAttribute('aria-pressed', film.muted ? 'false' : 'true'); snd.innerHTML = film.muted ? '&#128264; Sound on' : '&#128263; Mute'; }
    if (snd) snd.addEventListener('click', function () {
      film.muted = !film.muted;
      if (!film.muted) { userChose = true; if (film.ended || film.currentTime > film.duration - 1) film.currentTime = 0; var p = film.play(); if (p && p.catch) p.catch(function () {}); }
      syncBtn();
    });
    film.addEventListener('volumechange', syncBtn);
  }

  if (reduce) return;

  /* Rotating word in the hero headline. */
  var WORDS = ['operations', 'workflows', 'factory', 'website', 'reports', 'supply chain', 'team'];
  var rot = document.getElementById('rot');
  var i = 0;
  if (rot) setInterval(function () {
    rot.classList.add('out');
    setTimeout(function () {
      i = (i + 1) % WORDS.length;
      rot.textContent = WORDS[i];
      rot.classList.remove('out');
    }, 380);
  }, 2400);

  /* The three steps light up in turn: improve, automate, add AI. */
  var rungs = document.querySelectorAll('#ladder .rung');
  var r = 0;
  if (rungs.length) {
    rungs[0].classList.add('on');
    setInterval(function () {
      rungs[r].classList.remove('on');
      r = (r + 1) % rungs.length;
      rungs[r].classList.add('on');
    }, 2600);
  }
})();
