(() => {
  "use strict";

  document.addEventListener("travel-data-ready", (event) => {
    const data = event.detail;
    const places = data?.map?.places;
    if (!Array.isArray(places)) return;
    places.forEach((place) => {
      if (!place?.approximate) return;
      delete place.geo;
      delete place.approximate;
    });
  }, { once: true });
})();
