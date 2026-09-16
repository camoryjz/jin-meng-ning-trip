(() => {
  "use strict";

  function ensureControls(focus, legacyFocus) {
    if (!focus || !legacyFocus) return;
    const heading = focus.querySelector(".terminal-focus__heading");
    if (!heading) return;

    let controls = heading.querySelector(".terminal-focus__controls");
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "terminal-focus__controls";
      heading.appendChild(controls);
    }

    const timezone = heading.querySelector(".timezone-pill");
    if (timezone && timezone.parentElement !== controls) controls.appendChild(timezone);

    const theme = legacyFocus.querySelector("#enh-theme-toggle");
    if (theme && theme.parentElement !== controls) controls.appendChild(theme);

    const clock = legacyFocus.querySelector(".cover-live-clock");
    if (clock && clock.parentElement !== controls) controls.appendChild(clock);
  }

  function applyHeaderLayout() {
    const main = document.querySelector("#main");
    if (!main) return;

    const hero = main.querySelector(".hero.cover-hero");
    const focus = main.querySelector(".terminal-focus");
    const legacyFocus = main.querySelector(".cover-focus-section");

    if (hero) {
      hero.hidden = false;
      hero.removeAttribute("hidden");
      hero.style.removeProperty("display");
    }

    if (focus && hero && focus.previousElementSibling !== hero) {
      hero.insertAdjacentElement("afterend", focus);
    }

    if (focus) {
      const repeatedTitle = focus.querySelector(".terminal-focus__trip");
      if (repeatedTitle) repeatedTitle.remove();
      const kicker = focus.querySelector(".section-kicker");
      if (kicker) kicker.textContent = "此刻关注 · NEXT";
      focus.setAttribute("aria-label", "此刻关注");
    }

    if (legacyFocus) {
      ensureControls(focus, legacyFocus);
      legacyFocus.hidden = true;
      legacyFocus.setAttribute("aria-hidden", "true");
      legacyFocus.style.display = "none";
    }
  }

  document.addEventListener("DOMContentLoaded", applyHeaderLayout, { once: true });
  document.addEventListener("travel-data-ready", () => {
    [0, 50, 250, 800, 1600].forEach((delay) => window.setTimeout(applyHeaderLayout, delay));
  }, { once: true });

  const observer = new MutationObserver(() => applyHeaderLayout());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 8000);
})();
