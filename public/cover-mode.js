(() => {
  "use strict";
  const TARGET = new Date("2026-09-24T07:00:00+08:00");
  const $ = (selector) => document.querySelector(selector);
  const pad2 = (n) => String(Math.max(0, n)).padStart(2, "0");

  function setTitleBreak() {
    const title = $("#trip-title");
    if (!title) return;
    const text = (title.textContent || "").trim();
    if (text.startsWith("晋蒙宁") && !text.includes("\n")) {
      title.textContent = text.replace(/^晋蒙宁\s*/, "晋蒙宁\n");
    }
  }

  function tick() {
    const diff = TARGET.getTime() - Date.now();
    const done = diff <= 0;
    const safe = Math.max(0, diff);
    const days = Math.floor(safe / 86400000);
    const hours = Math.floor((safe % 86400000) / 3600000);
    const minutes = Math.floor((safe % 3600000) / 60000);
    const seconds = Math.floor((safe % 60000) / 1000);
    const values = { days, hours, minutes, seconds };
    Object.entries(values).forEach(([key, value]) => {
      const node = $(`#cover-countdown-${key}`);
      if (node) node.textContent = done && key === "days" ? "00" : pad2(value);
    });
    const label = $("#cover-focus-label");
    if (label && done) label.textContent = "旅程进行中";
  }

  function init() {
    setTitleBreak();
    tick();
    window.setInterval(tick, 1000);
    const observer = new MutationObserver(setTitleBreak);
    const title = $("#trip-title");
    if (title) observer.observe(title, { childList: true, characterData: true, subtree: true });
  }

  document.addEventListener("DOMContentLoaded", init, { once: true });
})();
