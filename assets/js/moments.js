/* Pellicule « moments » : les images (data-src) sont chargées par le script principal ~700 px avant la section.
   L'animation ne démarre qu'une fois les images prêtes, et se met en pause hors écran. */
(function () {
  var sec = document.getElementById('play');
  if (!sec) return;
  var track = sec.querySelector('.mo-track');
  var imgs = [].slice.call(sec.querySelectorAll('.mo-slide img'));
  var started = false;
  function ready() { if (!started) { started = true; sec.classList.add('mo-ready'); } }
  function check() {
    if (imgs.every(function (i) { return i.getAttribute('src') && i.complete && i.naturalWidth; })) ready();
  }
  imgs.forEach(function (i) { i.addEventListener('load', check); });
  new IntersectionObserver(function (es, o) {
    if (!es.some(function (e) { return e.isIntersecting; })) return;
    o.disconnect();
    imgs.forEach(function (i) { if (!i.getAttribute('src') && i.dataset.src) { i.src = i.dataset.src; i.removeAttribute('data-src'); } });
    check(); setTimeout(ready, 4000);
  }, { rootMargin: '700px 0px' }).observe(sec);
  new IntersectionObserver(function (es) {
    track.style.animationPlayState = es.some(function (e) { return e.isIntersecting; }) ? '' : 'paused';
  }).observe(sec);
})();
