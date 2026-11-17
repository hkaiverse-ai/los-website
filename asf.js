(function () {
  /* Walkthrough of the ASF Analysis Workspace using fictional sample data. Nothing is uploaded. */
  var $ = function (id) { return document.getElementById(id); };
  var box = $('demo');
  if (!box) return;

  var screens = box.querySelectorAll('[data-screen]');
  var track = box.querySelectorAll('.ws-track li');
  var urls = ['https://abc-manufacturing.example/about'];
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(id) {
    screens.forEach(function (s) { s.hidden = s.getAttribute('data-screen') !== String(id); });
    var step = id === 'p' ? 3 : Number(id);
    track.forEach(function (li) {
      var n = Number(li.getAttribute('data-s'));
      li.classList.toggle('on', n === step);
      li.classList.toggle('done', n < step);
    });
  }

  function drawUrls() {
    var ul = $('ws-urls');
    ul.textContent = '';
    urls.forEach(function (u, i) {
      var li = document.createElement('li');
      var t = document.createElement('span'); t.textContent = u;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'link'; b.textContent = 'Remove';
      b.setAttribute('aria-label', 'Remove ' + u);
      b.addEventListener('click', function () { urls.splice(i, 1); drawUrls(); });
      li.appendChild(t); li.appendChild(b); ul.appendChild(li);
    });
  }

  function files() {
    return Array.prototype.map.call(box.querySelectorAll('[data-screen="1"] .src input:checked'), function (x) { return x.value; });
  }

  $('ws-signin').addEventListener('click', function () { show(1); $('ws-url').focus(); });

  $('ws-add-url').addEventListener('click', function () {
    var v = $('ws-url').value.trim();
    var ok = /^https:\/\/[^\s/]+\.[^\s/]+/i.test(v);
    $('ws-url-err').hidden = ok;
    if (!ok) return;
    if (urls.indexOf(v) === -1 && urls.length + files().length < 25) urls.push(v);
    $('ws-url').value = '';
    drawUrls();
  });

  $('ws-next1').addEventListener('click', function () {
    var none = !files().length && !urls.length;
    $('ws-src-err').hidden = !none;
    if (none) return;
    show(2); $('ws-ctx').focus();
  });

  box.querySelectorAll('.ws-back').forEach(function (b) {
    b.addEventListener('click', function () { show(b.getAttribute('data-to')); });
  });

  $('ws-analyze').addEventListener('click', function () {
    var short = $('ws-ctx').value.trim().length < 10;
    $('ws-ctx-err').hidden = !short;
    if (short) { $('ws-ctx').focus(); return; }
    show('p');
    var steps = box.querySelectorAll('[data-screen="p"] .work-step');
    steps.forEach(function (s) { s.classList.remove('on', 'done'); });
    var i = 0, gap = reduce ? 150 : 650;
    (function next() {
      if (i > 0) { steps[i - 1].classList.remove('on'); steps[i - 1].classList.add('done'); }
      if (i < steps.length) { steps[i].classList.add('on'); i++; setTimeout(next, gap); return; }
      var n = files().length + urls.length;
      var qs = $('ws-q').value.split('\n').filter(function (l) { return l.trim(); }).length;
      var style = $('ws-style').options[$('ws-style').selectedIndex].text;
      $('ws-rep-meta').textContent = n + (n === 1 ? ' source · ' : ' sources · ') + qs + (qs === 1 ? ' question · ' : ' questions · ') + style + ' style';
      $('ws-exp-msg').hidden = true;
      show(3);
      box.querySelector('[data-screen="3"]').focus();
    })();
  });

  box.querySelectorAll('.ws-dl .exp').forEach(function (b) {
    b.addEventListener('click', function () { $('ws-exp-msg').hidden = false; });
  });

  $('ws-again').addEventListener('click', function () { show(1); });

  drawUrls();
  show(0);
})();
