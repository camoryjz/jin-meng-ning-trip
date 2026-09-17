(() => {
  "use strict";

  function loadNavigationIntegration() {
    if (!document.querySelector('link[data-nav-itinerary-integration]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "navigation-itinerary-integration-20260918.css?v=20260918-3";
      link.dataset.navItineraryIntegration = "1";
      document.head.append(link);
    }
    if (!document.querySelector('script[data-nav-itinerary-integration]')) {
      const script = document.createElement("script");
      script.src = "navigation-itinerary-integration-20260918.js?v=20260918-3";
      script.defer = true;
      script.dataset.navItineraryIntegration = "1";
      document.head.append(script);
    }
  }

  function setThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", "#f7fbfa");
  }

  function promoteTripMode() {
    const topbar = document.querySelector("#topbar");
    const button = document.querySelector(".trip-mode-launch");
    if (!topbar || !button) return false;
    if (!button.classList.contains("trip-mode-launch--topbar")) {
      button.classList.add("trip-mode-launch--topbar");
      button.innerHTML = '<span class="trip-mode-launch__icon" aria-hidden="true">✦</span><span>旅行模式</span>';
      button.setAttribute("aria-label", "打开旅行模式");
      const wordmark = document.querySelector("#wordmark");
      topbar.insertBefore(button, wordmark || topbar.firstChild);
    }
    return true;
  }

  function improveHandbookMenu() {
    const details = document.querySelector("#travel-navigation");
    const summary = document.querySelector("#travel-navigation-trigger");
    const menu = document.querySelector(".travel-navigation-menu");
    if (!details || !summary || !menu) return false;

    const visibleLinks = [...menu.querySelectorAll("a")].filter((link) => !link.hidden);
    if (visibleLinks.length) details.hidden = false;

    if (!summary.dataset.readabilityRefresh) {
      summary.dataset.readabilityRefresh = "1";
      summary.innerHTML = '<span class="nav-summary-main">旅行手册</span><span class="nav-summary-sub">行程 · 总览 · 贴士</span><span class="nav-summary-chevron" aria-hidden="true">▾</span>';
      summary.setAttribute("aria-label", "展开旅行手册快速导航");
    }

    if (!menu.querySelector(".travel-navigation-menu__intro")) {
      const intro = document.createElement("div");
      intro.className = "travel-navigation-menu__intro";
      intro.setAttribute("role", "presentation");
      intro.innerHTML = "<strong>快速导航</strong><small>直接跳到你现在需要看的模块</small>";
      menu.prepend(intro);
    }

    if (!details.dataset.readabilityRefresh) {
      details.dataset.readabilityRefresh = "1";
      details.addEventListener("toggle", () => {
        summary.setAttribute("aria-expanded", String(details.open));
      });
    }
    return true;
  }

  function keepLayoutClear() {
    const itinerary = document.querySelector("#itinerary");
    const stays = document.querySelector("#stays-section");
    if (itinerary && stays && stays.previousElementSibling !== itinerary) {
      stays.parentElement?.insertBefore(itinerary, stays);
    }
  }

  function apply() {
    loadNavigationIntegration();
    setThemeColor();
    promoteTripMode();
    improveHandbookMenu();
    keepLayoutClear();
  }

  loadNavigationIntegration();
  [0, 80, 220, 500, 1000, 1800, 3200].forEach((delay) => window.setTimeout(apply, delay));
  document.addEventListener("travel-data-ready", apply);
  window.addEventListener("travel-view:shown", apply);
  window.addEventListener("load", apply, { once: true });
})();