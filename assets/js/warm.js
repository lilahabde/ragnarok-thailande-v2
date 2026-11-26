/* Préchargement (26/11/2026) : dès que la page d'accueil est affichée, les images et fonds
   des sections suivantes se chargent en arrière-plan, dans l'ordre de la page.
   Ainsi rien n'apparaît « en retard » quand le visiteur descend. Les vidéos ne sont pas concernées. */
(function () {
  var conn = navigator.connection || {};
  if (conn.saveData) return;
  function warm() {
    [].forEach.call(document.querySelectorAll('main > section'), function (s) {
      s.classList.add('ready');
      [].forEach.call(s.querySelectorAll('img[data-src]'), function (i) {
        i.src = i.getAttribute('data-src'); i.removeAttribute('data-src');
      });
      [].forEach.call(s.querySelectorAll('img[loading="lazy"]'), function (i) { i.loading = 'eager'; });
      [].forEach.call(s.querySelectorAll('[data-bg]'), function (el) {
        el.style.backgroundImage = 'url(' + el.getAttribute('data-bg') + ')';
      });
    });
  }
  function go() { setTimeout(warm, 600); }
  if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
})();
