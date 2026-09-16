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
