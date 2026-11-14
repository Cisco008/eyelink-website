/*
 * Eyelink Mitchells Plain Black Friday splash screen
 * Shows once per browser, then automatically expires on 1 December 2026.
 */
(function () {
  "use strict";

  var EXPIRY_DATE = "2026-12-01"; // Inclusive: no display from 1 December
  var STORAGE_KEY = "eyelink_black_friday_splash_seen_2026";
  var IMAGE_PATH = "/black-friday/eyelink-black-friday.jpg";
  var CSS_PATH = "/black-friday/black-friday-splash.css";
  var DISPLAY_MILLISECONDS = 8500;

  function localDateString() {
    var d = new Date();
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }

  // Expiry check runs on every page load, so the splash stops on 1 Dec 2026.
  if (localDateString() >= EXPIRY_DATE) return;

  try {
    if (window.localStorage.getItem(STORAGE_KEY) === "1") return;
  } catch (e) {
    // If storage is unavailable, continue; the splash may show on each visit.
  }

  // Load the stylesheet only when the splash is eligible to appear.
  if (!document.querySelector('link[data-eyelink-bf-css="1"]')) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = CSS_PATH;
    link.setAttribute("data-eyelink-bf-css", "1");
    document.head.appendChild(link);
  }

  function markSeen() {
    try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
  }

  function showSplash() {
    var overlay = document.createElement("div");
    overlay.id = "eyelink-bf-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Eyelink Mitchells Plain Black Friday offers");

    var artwork = document.createElement("div");
    artwork.className = "bf-artwork";

    var img = document.createElement("img");
    img.className = "bf-main-image";
    img.src = IMAGE_PATH;
    img.alt = "Eyelink Mitchells Plain Black Friday specials. WhatsApp 065 928 9823.";
    img.draggable = false;

    var fragments = document.createElement("div");
    fragments.className = "bf-fragments";
    fragments.setAttribute("aria-hidden", "true");

    artwork.appendChild(img);
    artwork.appendChild(fragments);
    overlay.appendChild(artwork);
    document.body.appendChild(overlay);

    // Mark as seen as soon as it is displayed, so it truly appears only once.
    markSeen();

    function buildFragments() {
      var cols = 9, rows = 6;
      var rect = artwork.getBoundingClientRect();
      var bgW = (cols * 100) + "%";
      var bgH = (rows * 100) + "%";

      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var piece = document.createElement("span");
          piece.className = "bf-fragment";
          piece.style.setProperty("--piece-w", (100 / cols) + "%");
          piece.style.setProperty("--piece-h", (100 / rows) + "%");
          piece.style.setProperty("--piece-x", ((x / cols) * 100) + "%");
          piece.style.setProperty("--piece-y", ((y / rows) * 100) + "%");
          piece.style.setProperty("--bg-w", bgW);
          piece.style.setProperty("--bg-h", bgH);
          piece.style.setProperty("--bg-x", (x / (cols - 1) * 100) + "%");
          piece.style.setProperty("--bg-y", (y / (rows - 1) * 100) + "%");
          piece.style.setProperty("--art-image", 'url("' + IMAGE_PATH + '")');

          var dx = (Math.random() - 0.5) * Math.max(260, rect.width * 0.9);
          var dy = (Math.random() - 0.5) * Math.max(220, rect.height * 1.1);
          var rot = (Math.random() - 0.5) * 100;
          var delay = Math.random() * 0.16;
          piece.style.setProperty("--dx", dx + "px");
          piece.style.setProperty("--dy", dy + "px");
          piece.style.setProperty("--rot", rot + "deg");
          piece.style.setProperty("--delay", delay + "s");
          fragments.appendChild(piece);
        }
      }
    }

    if (img.complete) buildFragments();
    else img.addEventListener("load", buildFragments, { once: true });

    // Allow a visitor to dismiss it early by clicking/tapping the artwork.
    overlay.addEventListener("click", function () {
      overlay.classList.add("is-exploding");
      window.setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 1500);
    }, { once: true });

    window.setTimeout(function () {
      if (!overlay.parentNode) return;
      overlay.classList.add("is-exploding");
      window.setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 1600);
    }, DISPLAY_MILLISECONDS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showSplash, { once: true });
  } else {
    showSplash();
  }
})();
