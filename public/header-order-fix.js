(() => {
  "use strict";

  let observer = null;
  let framePending = false;

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
    if (!main) return false;

    const hero = main.querySelector(".hero.cover-hero");
    const focus = main.querySelector(".terminal-focus");
    const legacyFocus = main.querySelector(".cover-focus-section");

    if (hero) {
      hero.hidden = false;
      hero.removeAttribute("hidden");
      // trip-terminal.css hides .hero after terminal mode starts. Keep the handbook
      // cover explicitly visible so it remains a separate block above "此刻关注".
      hero.style.setProperty("display", "block", "important");
    }

    if (focus && hero && focus.previousElementSibling !== hero) {
      hero.insertAdjacentElement("afterend", focus);
    }

    if (focus) {
      const repeatedTitle = focus.querySelector(".terminal-focus__trip");
      if (repeatedTitle) repeatedTitle.remove();
      const kicker = focus.querySelector(".section-kicker");
      if (kicker && kicker.textContent !== "此刻关注 · NEXT") kicker.textContent = "此刻关注 · NEXT";
      if (focus.getAttribute("aria-label") !== "此刻关注") focus.setAttribute("aria-label", "此刻关注");
    }

    if (legacyFocus) {
      ensureControls(focus, legacyFocus);
      if (!legacyFocus.hidden) legacyFocus.hidden = true;
      if (legacyFocus.getAttribute("aria-hidden") !== "true") legacyFocus.setAttribute("aria-hidden", "true");
      if (legacyFocus.style.display !== "none") legacyFocus.style.display = "none";
    }

    return Boolean(focus && hero);
  }

  function scheduleApply() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(() => {
      framePending = false;
      const ready = applyHeaderLayout();
      if (ready && observer) {
        observer.disconnect();
        observer = null;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", scheduleApply, { once: true });
  document.addEventListener("travel-data-ready", () => {
    [0, 50, 200, 600].forEach((delay) => window.setTimeout(scheduleApply, delay));
  }, { once: true });

  observer = new MutationObserver(() => {
    if (document.querySelector("#main .terminal-focus")) scheduleApply();
  });
  const target = document.querySelector("#main") || document.documentElement;
  observer.observe(target, { childList: true, subtree: true });

  window.setTimeout(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    scheduleApply();
  }, 3000);
})();