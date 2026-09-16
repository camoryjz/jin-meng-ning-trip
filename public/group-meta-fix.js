(() => {
  "use strict";

  function apply(data) {
    if (!data || typeof data !== "object") return;
    if (data.trip) {
      data.trip.groupSize = 5;
      data.trip.routeSummary = "上海/南京出发，在太原汇合取车，沿山西—内蒙古—宁夏一路自驾至银川；主方案10月7日银川还车后返程，10月8日返程为次选。";
    }
  }

  document.addEventListener("travel-data-ready", (event) => apply(event.detail));
  if (window.TRAVEL_PLAN_DATA) apply(window.TRAVEL_PLAN_DATA);
})();
