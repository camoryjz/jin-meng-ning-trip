(() => {
  "use strict";

  const key = "jmn-enh:jin-meng-ning-roadtrip-20260924:theme";

  function initThemeStatus() {
    const bar = document.querySelector("#enh-status-bar");
    const toggle = document.querySelector("#enh-theme-toggle");
    const countdown = document.querySelector("#enh-countdown");
    const clock = document.querySelector("#enh-clock");
    if (!bar || !toggle || !countdown || !clock) return;

    let stored = "light";
    try { stored = localStorage.getItem(key) || "light"; } catch {}
    document.documentElement.dataset.theme = stored === "dark" ? "dark" : "light";

    if (!toggle.dataset.bound) {
      toggle.dataset.bound = "1";
      toggle.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem(key, next); } catch {}
      });
    }

    const tick = () => {
      const target = new Date("2026-09-24T07:00:00+08:00");
      const diff = target.getTime() - Date.now();
      if (diff <= 0) countdown.textContent = "旅程已开始";
      else {
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        countdown.textContent = `${days}天 ${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
      }
      clock.textContent = new Intl.DateTimeFormat("zh-CN", {
        timeZone: "Asia/Shanghai",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(new Date());
    };
    tick();
    window.setInterval(tick, 1000);
  }

  document.addEventListener("DOMContentLoaded", initThemeStatus, { once: true });
})();
