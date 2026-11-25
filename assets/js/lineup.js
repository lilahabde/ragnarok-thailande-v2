/* Section 3 : ligne d'équipe des 8 classes.
   Ordinateur : survol ou clic = la classe passe au premier plan.
   Mobile (rangée qui défile) : la classe au centre de l'écran est sélectionnée automatiquement. */
(function () {
  var root = document.getElementById('classes');
  if (!root) return;
  var duos = [].slice.call(root.querySelectorAll('.lu-duo'));
  var name = root.querySelector('.lu-name');
  var tag = root.querySelector('.lu-tag');
  var badge = root.querySelector('.lu-new');
  var row = root.querySelector('.lu-row');

  function txt(k) { try { return T[lang][k]; } catch (e) { return null; } }
  function scrolls() { return row.scrollWidth > row.clientWidth + 2; }

  function pick(d) {
    if (d.classList.contains('is-on')) return;
    var c = d.getAttribute('data-cls');
    duos.forEach(function (x) {
      var on = x === d;
      x.classList.toggle('is-on', on);
      x.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    name.textContent = d.querySelector('.lu-lbl').textContent;
    tag.setAttribute('data-i18n', 'ct_' + c);
    var t = txt('ct_' + c);
    if (t) tag.innerHTML = t;
    badge.hidden = c !== 'druid';
    var b = txt('clsNew'); if (b) badge.textContent = b;
  }

  function center(d, smooth) {
    var left = d.offsetLeft - (row.clientWidth - d.offsetWidth) / 2;
    row.scrollTo({ left: left, behavior: smooth ? 'smooth' : 'auto' });
  }

  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  duos.forEach(function (d) {
    d.addEventListener('click', function () {
      if (scrolls()) center(d, true); else pick(d);
    });
    d.addEventListener('mouseenter', function () { if (fine && !scrolls()) pick(d); });
    d.addEventListener('focus', function () { if (!scrolls()) pick(d); });
  });

  // Rangée défilante : sélectionne le duo le plus proche du centre.
  var raf = 0;
  row.addEventListener('scroll', function () {
    if (!scrolls()) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      var mid = row.scrollLeft + row.clientWidth / 2, best = null, dist = 1e9;
      duos.forEach(function (d) {
        var c = d.offsetLeft + d.offsetWidth / 2, k = Math.abs(c - mid);
        if (k < dist) { dist = k; best = d; }
      });
      if (best) pick(best);
    });
  }, { passive: true });

  function init() {
    if (!scrolls()) return;
    var on = root.querySelector('.lu-duo.is-on') || duos[0];
    center(on, false);
  }
  if (document.readyState === 'complete') init(); else window.addEventListener('load', init);
})();
