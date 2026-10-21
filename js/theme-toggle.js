/* ============================================================
   Gestion du thème clair / sombre (clair par défaut)
   ============================================================ */
(function () {
  const KEY  = 'portfolio-theme-v2';
  const html = document.documentElement;

  function getStored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function currentTheme() {
    return html.classList.contains('light-mode') ? 'light' : 'dark';
  }

  function applyTheme(theme, save) {
    html.classList.toggle('light-mode', theme === 'light');
    if (save) {
      try { localStorage.setItem(KEY, theme); } catch (e) {}
    }
    updateButtons(theme);
  }

  function updateButtons(theme) {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      var moon = btn.querySelector('.icon-moon');
      var sun  = btn.querySelector('.icon-sun');
      if (moon) moon.style.display = 'block';
      if (sun)  sun.style.display  = 'none';
      btn.setAttribute('aria-label', theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    /* Clair par défaut, sauf si le visiteur a choisi le sombre */
    applyTheme(getStored() === 'dark' ? 'dark' : 'light', false);

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyTheme(currentTheme() === 'light' ? 'dark' : 'light', true);
      });
    });
  });
})();