/* Animations d'entrée des sections (26/11/2026).
   Chaque section reçoit .ax-in quand elle arrive à l'écran (une seule fois) ;
   le CSS fait apparaître ses éléments en cascade. Rien si « animations réduites ». */
(function () {
  window.__ax = 1;
  var html = document.documentElement;
  if (!html.classList.contains('ax')) return;
  var secs = [].slice.call(document.querySelectorAll('main > section'));
  if (!('IntersectionObserver' in window)) {
    secs.forEach(function (s) { s.classList.add('ax-in'); });
    return;
  }
  // Déclencheur = le bloc animé lui-même (pas le haut de la section) : l'animation part
  // quand le visiteur voit vraiment les cartes, les étapes, etc.
  var TRIG = { memory: '.m4-cards', classes: '.lu-row', world: '.ws-inner', play: '.pc-cta',
               steps: '.sp-path', faq: '.faq-list', final: '.wrap' };
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var s = e.target.closest('section');
      if (s) s.classList.add('ax-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -12% 0px' });
  secs.forEach(function (s) {
    if (s.id === 'hero') { s.classList.add('ax-in'); return; }
    io.observe((TRIG[s.id] && s.querySelector(TRIG[s.id])) || s);
  });

  // Titres de section : déclenchés quand le titre lui-même arrive à l'écran.
  var ioh = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('ax-h'); ioh.unobserve(e.target); }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -8% 0px' });
  [].forEach.call(document.querySelectorAll('.ax-head'), function (h) { ioh.observe(h); });

  // Section classes : le nom et la phrase se renouvellent en douceur à chaque changement de classe.
  var panel = document.querySelector('#classes .lu-panel');
  var nm = panel && panel.querySelector('.lu-name');
  if (nm && 'MutationObserver' in window) {
    new MutationObserver(function () {
      panel.classList.remove('lu-swap'); void panel.offsetWidth; panel.classList.add('lu-swap');
    }).observe(nm, { childList: true, characterData: true, subtree: true });
  }
})();
