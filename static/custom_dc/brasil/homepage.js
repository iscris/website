/**
 * Brazil Data Commons — homepage-only script
 *
 * Initializes particles.js inside the Brazil clip-path on the hero.
 * Header interactions live in /custom_dc/brasil/header.js (loaded
 * site-wide from base.html).
 */

(function () {
  "use strict";

  function initParticles() {
    if (!window.particlesJS) return;
    if (!document.getElementById("particles-js")) return;
    window.particlesJS("particles-js", {
      particles: {
        number: { value: 500, density: { enable: true, value_area: 1000 } },
        color: { value: "#ffffff" },
        shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
        opacity: {
          value: 0.5, random: false,
          anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
        },
        size: {
          value: 3, random: true,
          anim: { enable: false, speed: 20, size_min: 0.1, sync: false }
        },
        line_linked: {
          enable: true, distance: 100, color: "#ffffff", opacity: 1, width: 1
        },
        move: {
          enable: true, speed: 3, direction: "none", random: false,
          straight: false, out_mode: "out", bounce: false,
          attract: { enable: false, rotateX: 600, rotateY: 1200 }
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          grab: { distance: 150, line_linked: { opacity: 1 } },
          bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
          repulse: { distance: 200, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 }
        }
      },
      retina_detect: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initParticles);
  } else {
    initParticles();
  }
})();
