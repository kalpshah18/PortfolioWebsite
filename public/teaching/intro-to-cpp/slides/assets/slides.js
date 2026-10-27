/* Tiny slide engine for Intro to C++. No dependencies.
 *
 * Keys: → / Space / PageDown next · ← / PageUp previous · Home / End · F fullscreen
 *       O overview grid · ? help · Esc leave overview.
 * The URL hash (#5) tracks the current slide, so you can share a link to a specific slide.
 * Add class "step" to any element to reveal it one click at a time.
 * Add class "cpp" to a <pre><code> block to get syntax highlighting.
 * Print the page (Ctrl+P → Save as PDF) to get a handout.
 */
(function () {
  var W = 1280, H = 720;
  var stage = document.getElementById('stage');
  var slides = Array.prototype.slice.call(stage.querySelectorAll('.slide'));
  var cur = 0;

  /* ---------- C++ syntax highlighting ---------- */
  var KW = 'alignas alignof auto bool break case catch char class const constexpr continue default delete do double else enum explicit false float for friend if inline int long namespace new noexcept nullptr operator private protected public return short signed sizeof static struct switch template this throw true try typedef typename unsigned using virtual void volatile while override final';
  var TYPES = 'string vector map set unordered_map unordered_set array pair size_t int8_t int16_t int32_t int64_t uint8_t uint16_t uint32_t uint64_t unique_ptr shared_ptr optional cout cin cerr endl';
  var kwSet = {}, typeSet = {};
  KW.split(' ').forEach(function (k) { kwSet[k] = 1; });
  TYPES.split(' ').forEach(function (k) { typeSet[k] = 1; });

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function highlight(src) {
    var re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(^[ \t]*#[ \t]*\w+(?:[ \t]*<[^>\n]*>)?)|(\b\d[\d.']*[fFuUlL]*\b)|([A-Za-z_]\w*)/gm;
    var out = '', last = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      var t = m[0];
      if (m[1]) out += '<span class="tok-com">' + esc(t) + '</span>';
      else if (m[2]) out += '<span class="tok-str">' + esc(t) + '</span>';
      else if (m[3]) out += '<span class="tok-pre">' + esc(t) + '</span>';
      else if (m[4]) out += '<span class="tok-num">' + esc(t) + '</span>';
      else if (kwSet[t]) out += '<span class="tok-kw">' + esc(t) + '</span>';
      else if (typeSet[t]) out += '<span class="tok-type">' + esc(t) + '</span>';
      else out += esc(t);
      last = m.index + t.length;
    }
    return out + esc(src.slice(last));
  }

  Array.prototype.forEach.call(document.querySelectorAll('code.cpp'), function (el) {
    // Trim the common leading newline/indent so authors can indent code inside the HTML.
    var lines = el.textContent.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
    var indent = Math.min.apply(null, lines.filter(function (l) { return l.trim(); }).map(function (l) { return l.match(/^ */)[0].length; }));
    el.innerHTML = highlight(lines.map(function (l) { return l.slice(indent); }).join('\n'));
  });

  /* ---------- Chrome ---------- */
  var bar = document.createElement('div'); bar.id = 'progress'; document.body.appendChild(bar);
  var counter = document.createElement('div'); counter.id = 'counter'; document.body.appendChild(counter);
  var home = document.createElement('a'); home.id = 'home'; home.href = '../'; home.textContent = '← Course page'; document.body.appendChild(home);
  var help = document.createElement('div'); help.id = 'help';
  help.innerHTML = '<div><b>Keyboard</b><br>→ Space PageDown : next<br>← PageUp : previous<br>Home / End : first / last<br>F : fullscreen<br>O : overview<br>? : this help<br><br>Ctrl+P : print / save as PDF handout</div>';
  help.onclick = function () { help.classList.remove('open'); };
  document.body.appendChild(help);

  /* ---------- Navigation ---------- */
  function steps(slide) { return Array.prototype.slice.call(slide.querySelectorAll('.step')); }

  function show(i, revealAll) {
    cur = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (s, idx) {
      s.classList.toggle('active', idx === cur);
      if (idx !== cur) return;
      steps(s).forEach(function (st) { st.classList.toggle('shown', !!revealAll); });
    });
    counter.textContent = (cur + 1) + ' / ' + slides.length;
    bar.style.width = ((cur + 1) / slides.length * 100) + '%';
    if (location.hash !== '#' + (cur + 1)) history.replaceState(null, '', '#' + (cur + 1));
  }

  function next() {
    var hidden = steps(slides[cur]).filter(function (s) { return !s.classList.contains('shown'); });
    if (hidden.length) hidden[0].classList.add('shown');
    else if (cur < slides.length - 1) show(cur + 1);
  }
  function prev() {
    var shown = steps(slides[cur]).filter(function (s) { return s.classList.contains('shown'); });
    if (shown.length) shown[shown.length - 1].classList.remove('shown');
    else if (cur > 0) show(cur - 1, true);
  }

  function setOverview(on) {
    document.body.classList.toggle('overview', on);
    if (!on) { fit(); show(cur); }
  }

  function fit() {
    var s = Math.min(window.innerWidth / W, window.innerHeight / H);
    stage.style.transform = 'translate(-50%, -50%) scale(' + s + ')';
  }

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter': e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': e.preventDefault(); prev(); break;
      case 'Home': show(0); break;
      case 'End': show(slides.length - 1, true); break;
      case 'f': case 'F':
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
        break;
      case 'o': case 'O': setOverview(!document.body.classList.contains('overview')); break;
      case 'Escape': if (document.body.classList.contains('overview')) setOverview(false); help.classList.remove('open'); break;
      case '?': help.classList.toggle('open'); break;
    }
  });

  slides.forEach(function (s, i) {
    s.addEventListener('click', function () {
      if (document.body.classList.contains('overview')) { cur = i; setOverview(false); }
    });
  });

  // Click right/left third of the screen, swipe on touch devices.
  document.addEventListener('click', function (e) {
    if (document.body.classList.contains('overview') || e.target.closest('a, #help')) return;
    if (e.clientX > window.innerWidth * 0.66) next();
    else if (e.clientX < window.innerWidth * 0.33) prev();
  });
  var tx = null;
  document.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
  });

  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', function () { var n = parseInt(location.hash.slice(1), 10); if (n && n - 1 !== cur) show(n - 1, true); });
  document.addEventListener('fullscreenchange', function () { document.body.classList.toggle('present', !!document.fullscreenElement); });

  fit();
  var start = parseInt(location.hash.slice(1), 10);
  // Arriving via a shared link to a specific slide: show it fully revealed.
  show(start ? start - 1 : 0, !!start);
})();
