(() => {
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "trip-terminal.css?v=20260917-1";
  document.head.append(stylesheet);

  const terminalScript = document.createElement("script");
  terminalScript.src = "trip-terminal.js?v=20260917-1";
  document.head.append(terminalScript);

  // Daily route maps are rendered lazily by daily-route-tools.js when a day is expanded.
  // Do not load trip-map-enhancements.js here: it eagerly rendered all daily SVG maps and
  // kept a subtree MutationObserver alive, which caused severe mobile jank.

  const headerFix = document.createElement("script");
  headerFix.src = "header-order-fix.js?v=20260917-1";
  document.head.append(headerFix);

  document.addEventListener("travel-data-ready", (event) => {
    const data = event.detail;
    if (!data || typeof data !== "object") return;

    if (data.metadata) data.metadata.title = "晋蒙宁14天自驾旅行手册";
    if (data.trip) {
      data.trip.heroTitle = "晋蒙宁14天自驾旅行手册";
      data.trip.heroEyebrow = "山西 · 内蒙古 · 宁夏";
    }
  });
})();
