(() => {
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "trip-terminal.css?v=20260916-1";
  document.head.append(stylesheet);

  const terminalScript = document.createElement("script");
  terminalScript.src = "trip-terminal.js?v=20260916-1";
  document.head.append(terminalScript);

  const mapEnhancements = document.createElement("script");
  mapEnhancements.src = "trip-map-enhancements.js?v=20260916-1";
  document.head.append(mapEnhancements);

  document.addEventListener("travel-data-ready", (event) => {
    const data = event.detail;
    if (!data || typeof data !== "object") return;

    if (data.metadata) {
      data.metadata.title = "晋蒙宁14天自驾旅行手册";
    }

    if (data.trip) {
      data.trip.heroTitle = "晋蒙宁14天自驾旅行手册";
      data.trip.heroEyebrow = "山西 · 内蒙古 · 宁夏";
    }
  });
})();
