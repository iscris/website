/**
 * Brazil Data Commons — site header interactions
 *
 * Loaded on every page via base.html. Replaces the upstream React
 * HeaderApp (see build/cdc_services/Dockerfile stage 3 / base/main.ts).
 *
 * - Scroll-progress driven header (homepage only — transparent over the
 *   blue hero, fading to solid white as the user scrolls).
 * - Mobile nav panel + dropdowns (accordion below 768px).
 * - Desktop mega-menu (click to open, click again to close).
 * - Search form that redirects to /explore#q=<query>.
 */

(function () {
  "use strict";

  var header = document.querySelector(".site-header");

  // ------------------------------------------------------------
  // Header scroll progress (homepage only)
  //
  // Non-homepage pages have white content behind the header, so they
  // keep the solid-white "landed" look defined in header.css via the
  // html:not(#page-homepage) .site-header rules. We just don't run
  // the fade logic there.
  // ------------------------------------------------------------
  if (header && document.documentElement.id === "page-homepage") {
    var threshold = 120;
    var scrolledClassAt = 0.5;
    var ticking = false;

    function updateHeader() {
      var progress = Math.min(window.scrollY / threshold, 1);
      header.style.setProperty("--scroll-progress", progress.toFixed(3));
      if (progress > scrolledClassAt) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    updateHeader();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ------------------------------------------------------------
  // Mobile menu: hamburger toggle + backdrop + ESC to close
  // ------------------------------------------------------------
  var toggleBtn = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".site-nav");
  var backdrop = document.querySelector(".nav-backdrop");

  function setMenuOpen(open) {
    if (!nav || !toggleBtn) return;
    nav.classList.toggle("is-open", open);
    if (backdrop) backdrop.classList.toggle("is-visible", open);
    toggleBtn.setAttribute("aria-expanded", String(open));
    toggleBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", function () {
      setMenuOpen(!nav.classList.contains("is-open"));
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenuOpen(false);
      }
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () { setMenuOpen(false); });
    }

    nav.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (link && nav.classList.contains("is-open")) {
        setMenuOpen(false);
      }
    });
  }

  // ------------------------------------------------------------
  // Dropdown triggers: accordion on mobile, hover on desktop (CSS)
  // ------------------------------------------------------------
  var MOBILE_BREAKPOINT = 768;
  document.querySelectorAll(".has-dropdown > .menu-trigger").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        e.preventDefault();
        var li = btn.parentElement;
        var wasOpen = li.classList.contains("open");
        li.parentElement.querySelectorAll(".has-dropdown.open").forEach(function (s) {
          if (s !== li) {
            s.classList.remove("open");
            var sBtn = s.querySelector(".menu-trigger");
            if (sBtn) sBtn.setAttribute("aria-expanded", "false");
          }
        });
        li.classList.toggle("open", !wasOpen);
        btn.setAttribute("aria-expanded", String(!wasOpen));
      }
    });
  });

  // Close mobile menu + reset dropdowns on resize to desktop
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        setMenuOpen(false);
        document.querySelectorAll(".has-dropdown.open").forEach(function (li) {
          li.classList.remove("open");
          var b = li.querySelector(".menu-trigger");
          if (b) b.setAttribute("aria-expanded", "false");
        });
      }
    }, 120);
  });

  // ------------------------------------------------------------
  // Desktop mega-menu
  // Shared full-width panel below the header. Clicking a top-level
  // trigger toggles the panel open/closed; clicking a different
  // trigger swaps content without the panel closing.
  // ------------------------------------------------------------
  var megaMenu = document.getElementById("mega-menu");
  var megaTriggers = document.querySelectorAll(
    ".site-menu .menu-trigger[data-panel]"
  );
  var megaPanels = megaMenu
    ? megaMenu.querySelectorAll(".mega-panel")
    : [];

  function isDesktop() {
    return window.innerWidth >= MOBILE_BREAKPOINT;
  }

  if (megaMenu && megaTriggers.length) {
    var hidePanelsTimer = null;

    function setActivePanel(panelId) {
      megaPanels.forEach(function (p) {
        p.hidden = p.dataset.panel !== panelId;
      });
      megaTriggers.forEach(function (t) {
        t.setAttribute(
          "aria-expanded",
          t.dataset.panel === panelId ? "true" : "false"
        );
      });
    }

    function openMegaPanel(panelId) {
      if (!panelId) return;
      clearTimeout(hidePanelsTimer);
      setActivePanel(panelId);
      megaMenu.classList.add("is-open");
      megaMenu.setAttribute("aria-hidden", "false");
      if (header) header.classList.add("is-menu-open");
    }

    function closeMegaMenu() {
      megaMenu.classList.remove("is-open");
      megaMenu.setAttribute("aria-hidden", "true");
      if (header) header.classList.remove("is-menu-open");
      megaTriggers.forEach(function (t) {
        t.setAttribute("aria-expanded", "false");
      });
      hidePanelsTimer = setTimeout(function () {
        if (!megaMenu.classList.contains("is-open")) {
          megaPanels.forEach(function (p) { p.hidden = true; });
        }
      }, 350);
    }

    megaTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        if (!isDesktop()) return;
        e.preventDefault();
        var isOpenForThis =
          trigger.getAttribute("aria-expanded") === "true" &&
          megaMenu.classList.contains("is-open");
        if (isOpenForThis) {
          closeMegaMenu();
        } else {
          openMegaPanel(trigger.dataset.panel);
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (!megaMenu.classList.contains("is-open")) return;
      var activeTrigger = document.querySelector(
        ".menu-trigger[aria-expanded='true']"
      );
      closeMegaMenu();
      if (activeTrigger) activeTrigger.focus();
    });

    document.addEventListener("focusin", function (e) {
      if (!isDesktop()) return;
      if (!megaMenu.classList.contains("is-open")) return;
      if (header && header.contains(e.target)) return;
      closeMegaMenu();
    });

    document.addEventListener("click", function (e) {
      if (!megaMenu.classList.contains("is-open")) return;
      if (header && header.contains(e.target)) return;
      closeMegaMenu();
    });

    window.addEventListener("resize", function () {
      if (!isDesktop() && megaMenu.classList.contains("is-open")) {
        closeMegaMenu();
      }
    });
  }

  // ------------------------------------------------------------
  // Search: redirect to /explore#q=<query>
  // ------------------------------------------------------------
  var searchForm = document.querySelector('.site-search');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = searchForm.querySelector('input[name="q"]');
      var q = (input && input.value ? input.value : '').trim();
      if (!q) {
        if (input) input.focus();
        return;
      }
      window.location.href = '/explore#q=' + encodeURIComponent(q);
    });
  }
})();
