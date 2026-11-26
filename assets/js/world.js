/* Section 4 (version compacte, un écran) : 5 onglets + extraits vidéo officiels de 6 s qui s'enchaînent.
   - Ordinateur : la vidéo de l'onglet actif est lue, puis on passe au suivant à la fin.
   - Mobile, économie de données ou animations réduites : images fixes officielles, changement toutes les 6 s.
   - Rien ne tourne quand la section n'est pas à l'écran ; un clic sur un onglet reprend la main. */
(function () {
  var root = document.getElementById('world');
  if (!root) return;
  var bgs = [].slice.call(root.querySelectorAll('.ws-bg'));
  var steps = [].slice.call(root.querySelectorAll('.ws-step'));
  var tabs = [].slice.call(root.querySelectorAll('.ws-tab'));
  var n = tabs.length, cur = 1, inView = false, timer = null;
  var conn = navigator.connection || {};
  var useVideo = !conn.saveData && !/(^|-)(2g|3g)$/.test(conn.effectiveType || '') &&
    window.matchMedia('(min-width:901px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STEP_MS = 6000;

  function vid(i) { return bgs[i - 1].querySelector('video'); }

  function stopAll() {
    clearTimeout(timer);
    bgs.forEach(function (b) { var v = b.querySelector('video'); if (!v.paused) v.pause(); });
  }

  function run() {
    stopAll();
    if (!inView || document.hidden) return;
    if (useVideo) {
      var v = vid(cur);
      v.preload = 'auto';
      if (!v.getAttribute('src')) v.src = v.getAttribute('data-src');
      try { v.currentTime = 0; } catch (e) {}
      var p = v.play();
      if (p && p.catch) p.catch(function () { timer = setTimeout(next, STEP_MS); });
      var nv = vid(cur % n + 1);
      nv.preload = 'auto';
      if (!nv.getAttribute('src')) nv.src = nv.getAttribute('data-src');
    } else {
      timer = setTimeout(next, STEP_MS);
    }
  }

  function show(i) {
    cur = i;
    [bgs, steps, tabs].forEach(function (list) {
      list.forEach(function (el) { el.classList.toggle('is-on', +el.getAttribute('data-i') === i); });
    });
    tabs.forEach(function (b) { b.setAttribute('aria-pressed', +b.getAttribute('data-i') === i ? 'true' : 'false'); });
    root.classList.toggle('has-video', useVideo);
    run();
  }

  function next() { show(cur % n + 1); }

  bgs.forEach(function (b) {
    var v = b.querySelector('video');
    v.addEventListener('ended', function () { if (+b.getAttribute('data-i') === cur) next(); });
    v.addEventListener('playing', function () { b.classList.add('is-playing'); });
  });
  tabs.forEach(function (b) {
    b.addEventListener('click', function () { show(+b.getAttribute('data-i')); });
  });
  document.addEventListener('visibilitychange', run);
  new IntersectionObserver(function (es) {
    var was = inView;
    inView = es.some(function (e) { return e.isIntersecting; });
    if (inView !== was) run();
  }, { threshold: 0.35 }).observe(root);

  // Premier extrait mis en mémoire tampon avant d'arriver sur la section.
  if (useVideo) {
    new IntersectionObserver(function (es, o) {
      if (!es.some(function (e) { return e.isIntersecting; })) return;
      o.disconnect();
      var v = vid(1); v.preload = 'auto';
      if (!v.getAttribute('src')) v.src = v.getAttribute('data-src');
    }, { rootMargin: '1500px 0px' }).observe(root);
  }

  root.classList.toggle('has-video', useVideo);
})();
