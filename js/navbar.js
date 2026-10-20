(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // ── Hamburger toggle ──────────────────────────────────────────────────
    document.querySelectorAll('.navbar-toggler').forEach(function (toggler) {
      var targetId = toggler.getAttribute('aria-controls');
      var collapse = targetId
        ? document.getElementById(targetId)
        : toggler.closest('.navbar').querySelector('.navbar-collapse');
      if (!collapse) return;

      toggler.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = collapse.classList.toggle('nav-open');
        toggler.classList.toggle('is-open', isOpen);
        toggler.setAttribute('aria-expanded', String(isOpen));
        if (!isOpen) closeAllDropdowns();
      });
    });

    // ── Dropdown toggle (clic sur caret — mobile et tactile) ─────────────
    document.querySelectorAll('.nav-caret').forEach(function (caret) {
      caret.addEventListener('click', function (e) {
        e.stopPropagation();
        var item = caret.closest('.nav-item.dropdown');
        if (!item) return;
        var isOpen = item.classList.toggle('mobile-open');
        caret.setAttribute('aria-expanded', String(isOpen));
        var navbar = item.closest('.navbar');
        if (navbar) {
          navbar.querySelectorAll('.nav-item.dropdown').forEach(function (other) {
            if (other !== item) {
              other.classList.remove('mobile-open');
              var otherCaret = other.querySelector('.nav-caret');
              if (otherCaret) otherCaret.setAttribute('aria-expanded', 'false');
            }
          });
        }
      });
    });

    // ── Sous-menus : dépliage au clic (Expérience) ou ouverture mobile (autres) ──
    document.querySelectorAll('.has-submenu').forEach(function (link) {
      var submenu = link.closest('.dropdown-submenu');
      if (!submenu) return;
      var expanded = link.closest('.dropdown-expanded');

      if (expanded) link.setAttribute('aria-expanded', 'false');

      link.addEventListener('click', function (e) {
        if (expanded) {
          e.preventDefault();
          var unfolded = submenu.classList.toggle('is-unfolded');
          link.setAttribute('aria-expanded', String(unfolded));
        } else if (window.innerWidth <= 991) {
          e.preventDefault();
          submenu.classList.toggle('is-open');
        }
      });
    });

    // ── Fermeture au clic hors du navbar ─────────────────────────────────
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.navbar')) {
        closeAllNavCollapses();
        closeAllDropdowns();
      }
    });

    // ── Touche Échap ─────────────────────────────────────────────────────
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      closeAllNavCollapses();
      closeAllDropdowns();
    });

    // ── Fermer le menu mobile en cliquant un lien ─────────────────────────
    document.querySelectorAll('.navbar-collapse .nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        var collapse = link.closest('.navbar-collapse');
        if (collapse && window.innerWidth <= 991) {
          collapse.classList.remove('nav-open');
          var navbar = collapse.closest('.navbar');
          if (navbar) {
            var tog = navbar.querySelector('.navbar-toggler');
            if (tog) { tog.classList.remove('is-open'); tog.setAttribute('aria-expanded', 'false'); }
          }
        }
      });
    });

    // ── Hover desktop sur les dropdowns principaux (is-hovered) ──────────
    var isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)');
    document.querySelectorAll('.navbar .nav-item.dropdown').forEach(function (ddItem) {
      var t;
      ddItem.addEventListener('mouseenter', function () {
        if (isDesktop.matches) { clearTimeout(t); ddItem.classList.add('is-hovered'); }
      });
      ddItem.addEventListener('mouseleave', function () {
        if (isDesktop.matches) {
          t = setTimeout(function () { ddItem.classList.remove('is-hovered'); }, 200);
        }
      });
    });

    // ── Expérience : replier les sous-menus quand la souris quitte le menu ─
    document.querySelectorAll('.dropdown-expanded').forEach(function (dd) {
      dd.addEventListener('mouseleave', function () {
        if (!isDesktop.matches) return;
        dd.querySelectorAll('.dropdown-submenu.is-unfolded').forEach(function (s) {
          s.classList.remove('is-unfolded');
          var l = s.querySelector('.has-submenu');
          if (l) l.setAttribute('aria-expanded', 'false');
        });
      });
    });

    // ── Hover desktop sur les sous-menus (sauf Expérience : clic uniquement) ─
    document.querySelectorAll('.navbar .dropdown-submenu').forEach(function (sub) {
      if (sub.closest('.dropdown-expanded')) return;
      var t;
      sub.addEventListener('mouseenter', function () {
        if (isDesktop.matches) { clearTimeout(t); sub.classList.add('is-open'); }
      });
      sub.addEventListener('mouseleave', function () {
        if (isDesktop.matches) {
          t = setTimeout(function () { sub.classList.remove('is-open'); }, 200);
        }
      });
    });

    // ── Fermer dropdown + menu mobile quand on clique un item ─────────────
    document.querySelectorAll('.navbar .dropdown-item').forEach(function (item) {
      item.addEventListener('click', function (e) {
        // Les titres de groupe du menu Expérience ne ferment pas le menu
        if (item.classList.contains('has-submenu') && item.closest('.dropdown-expanded')) return;

        var ddParent = item.closest('.nav-item.dropdown');
        if (ddParent) ddParent.classList.remove('is-hovered');
        closeAllDropdowns();
        closeAllNavCollapses();

        // Ancre intra-page : scroll JS pour éviter le verrou natif du navigateur
        var href = item.getAttribute('href');
        if (href && href.charAt(0) === '#') {
          var target = document.getElementById(href.slice(1));
          if (target) {
            e.preventDefault();
            var padTop = parseInt(getComputedStyle(document.documentElement).scrollPaddingTop, 10) || 130;
            var top = target.getBoundingClientRect().top + window.pageYOffset - padTop;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
            history.pushState(null, '', href);
          }
        }
      });
    });

  });

  // ── Fonctions utilitaires ──────────────────────────────────────────────
  function closeAllNavCollapses() {
    document.querySelectorAll('.navbar-collapse.nav-open').forEach(function (c) {
      c.classList.remove('nav-open');
      var nb = c.closest('.navbar');
      if (nb) {
        var tog = nb.querySelector('.navbar-toggler');
        if (tog) { tog.classList.remove('is-open'); tog.setAttribute('aria-expanded', 'false'); }
      }
    });
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.nav-item.dropdown.mobile-open').forEach(function (item) {
      item.classList.remove('mobile-open');
      var caret = item.querySelector('.nav-caret');
      if (caret) caret.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.dropdown-submenu.is-open').forEach(function (sub) {
      sub.classList.remove('is-open');
    });
  }
})();