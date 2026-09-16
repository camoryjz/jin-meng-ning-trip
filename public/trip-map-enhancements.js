(() => {
  const STAYS = [
    { days: "D1", placeId: "taiyuan-city", label: "住太原" },
    { days: "D2", placeId: "xinzhou-ancient-city", label: "住忻州" },
    { days: "D3", placeId: "hunyuan", label: "住浑源" },
    { days: "D4–5", placeId: "datong", label: "住大同" },
    { days: "D6", placeId: "hohhot", label: "住呼和浩特" },
    { days: "D7", placeId: "xilamuren-grassland", label: "住希拉穆仁" },
    { days: "D8", placeId: "bayannur", label: "住巴彦淖尔" },
    { days: "D9–10", placeId: "tengger-desert", label: "住腾格里" },
    { days: "D11", placeId: "zhongwei", label: "住中卫" },
    { days: "D12–13", placeId: "yinchuan", label: "住银川" }
  ];

  let data = null;
  let observer = null;
  const NS = "http://www.w3.org/2000/svg";

  const esc = (value = "") => String(value).replace(/[&<>"']/g, (ch) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[ch]);

  function routeSource() {
    if (!data?.routeMap || typeof window.travelMapSource !== "function") return null;
    return window.travelMapSource(data.routeMap, data.routeMap.defaultRegionId);
  }

  function placeFor(id) {
    const source = routeSource();
    if (!source) return null;
    if (typeof window.placeLayersFor === "function") {
      return window.placeLayersFor(source).find((place) => place.id === id) || null;
    }
    return (source.places || []).find((place) => (place.id || place.placeId) === id) || null;
  }

  function amapUrl(place, label) {
    const geo = place?.geo;
    if (geo?.lng != null && geo?.lat != null) {
      const to = `${geo.lng},${geo.lat},${label}`;
      return `https://uri.amap.com/navigation?from=&to=${encodeURIComponent(to)}&mode=car&policy=1&src=jinmengning-trip&callnative=1`;
    }
    return `https://uri.amap.com/search?keyword=${encodeURIComponent(label)}&view=map&src=jinmengning-trip&callnative=1`;
  }

  function baiduAppUrl(place, label) {
    const geo = place?.geo;
    const destination = geo?.lat != null && geo?.lng != null ? `${geo.lat},${geo.lng}` : label;
    return `baidumap://map/direction?origin=${encodeURIComponent("我的位置")}&destination=${encodeURIComponent(destination)}&coord_type=gcj02&mode=driving&src=ios.camoryjz.jinmengning`;
  }

  function baiduWebUrl(label) {
    return `https://api.map.baidu.com/direction?origin=${encodeURIComponent("我的位置")}&destination=${encodeURIComponent(label)}&mode=driving&output=html&src=webapp.camoryjz.jinmengning`;
  }

  function openNavChoice(placeId) {
    const place = placeFor(placeId);
    if (!place) return;
    const label = place.lines?.[0] || place.name || place.label || placeId;
    let dialog = document.querySelector("#terminal-map-nav-dialog");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "terminal-map-nav-dialog";
      dialog.className = "terminal-nav-dialog";
      dialog.innerHTML = `
        <div class="terminal-nav-dialog__head">
          <div><span>地图导航</span><h2 id="terminal-map-nav-title"></h2></div>
          <button type="button" data-map-nav-close>关闭</button>
        </div>
        <div class="terminal-nav-dialog__actions" id="terminal-map-nav-actions"></div>
      `;
      document.body.append(dialog);
      dialog.addEventListener("click", (event) => {
        if (event.target.closest("[data-map-nav-close]")) dialog.close();
      });
    }
    dialog.querySelector("#terminal-map-nav-title").textContent = label;
    dialog.querySelector("#terminal-map-nav-actions").innerHTML = `
      <a class="nav-provider nav-provider--amap" href="${amapUrl(place, label)}" target="_blank" rel="noopener">高德地图导航</a>
      <a class="nav-provider nav-provider--baidu" href="${baiduAppUrl(place, label)}">百度地图导航</a>
      <a class="nav-provider nav-provider--web" href="${baiduWebUrl(label)}" target="_blank" rel="noopener">百度网页版</a>
    `;
    if (dialog.showModal) dialog.showModal(); else dialog.setAttribute("open", "");
  }

  function makeSvg(tag, attributes = {}) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  }

  function addStayPins() {
    const svg = document.querySelector("#route-explorer .travel-map-block.is-overview svg");
    if (!svg || svg.querySelector("#terminal-overnight-stays")) return;
    const group = makeSvg("g", { id: "terminal-overnight-stays", "aria-label": "每晚住宿地点" });
    STAYS.forEach((stay, index) => {
      const point = svg.querySelector(`#overview-point-${CSS.escape(stay.placeId)}`);
      if (!point) return;
      const x = Number(point.getAttribute("cx"));
      const y = Number(point.getAttribute("cy"));
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      const dx = index % 2 ? 15 : -15;
      const anchor = dx > 0 ? "start" : "end";
      const ring = makeSvg("circle", {
        cx: x, cy: y, r: 16, fill: "none", stroke: "#111b14", "stroke-width": 3, "stroke-dasharray": "3 3",
        "data-stay-place": stay.placeId
      });
      const text = makeSvg("text", {
        x: x + dx, y: y + 25, "text-anchor": anchor, fill: "#111b14", "font-size": 17, "font-weight": 800,
        "font-family": "system-ui, -apple-system, sans-serif", "data-stay-place": stay.placeId
      });
      text.textContent = `${stay.days} ${stay.label}`;
      group.append(ring, text);
    });
    svg.append(group);
  }

  function markOverviewClickable() {
    const svg = document.querySelector("#route-explorer .travel-map-block.is-overview svg");
    if (!svg) return;
    svg.querySelectorAll('[id^="overview-point-"], [id^="overview-label-"]').forEach((node) => {
      const id = node.id.replace(/^overview-(?:point|label)-/, "");
      node.dataset.navPlaceId = id;
      node.style.cursor = "pointer";
      node.setAttribute("role", "button");
      node.setAttribute("tabindex", "0");
    });
  }

  function insertDailyMaps() {
    if (!data || typeof window.travelMapSourceForDay !== "function" || typeof window.travelMapMarkup !== "function" || typeof window.mapRouteDefinitions !== "function") return;
    document.querySelectorAll(".day-card").forEach((card) => {
      const dayNumber = Number(card.dataset.day);
      const body = card.querySelector(".day-route-panel__body");
      if (!body || body.querySelector(".terminal-daily-map")) return;
      const source = window.travelMapSourceForDay(data.routeMap, dayNumber) || routeSource();
      if (!source) return;
      const route = window.mapRouteDefinitions(source).find((item) => Number(item.day) === dayNumber);
      if (!route) return;
      const holder = document.createElement("div");
      holder.className = "terminal-daily-map";
      holder.innerHTML = window.travelMapMarkup(source, route);
      body.prepend(holder);
    });
  }

  function enhance() {
    addStayPins();
    markOverviewClickable();
    insertDailyMaps();
  }

  function start(nextData) {
    data = nextData || window.TRAVEL_PLAN_DATA;
    if (!data) return;
    setTimeout(enhance, 120);
    setTimeout(enhance, 600);
    if (!observer) {
      observer = new MutationObserver(() => requestAnimationFrame(enhance));
      const target = document.querySelector("#main");
      if (target) observer.observe(target, { childList: true, subtree: true });
    }
  }

  document.addEventListener("travel-data-ready", (event) => start(event.detail), { once: true });
  if (window.TRAVEL_PLAN_DATA) start(window.TRAVEL_PLAN_DATA);

  document.addEventListener("click", (event) => {
    const svgNode = event.target.closest?.("[data-nav-place-id]");
    if (svgNode) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openNavChoice(svgNode.dataset.navPlaceId);
      return;
    }
    const dailyDot = event.target.closest?.(".terminal-daily-map [data-place-id]");
    if (dailyDot) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openNavChoice(dailyDot.dataset.placeId);
      return;
    }
    const stay = event.target.closest?.("[data-stay-place]");
    if (stay) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openNavChoice(stay.dataset.stayPlace);
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target?.dataset?.navPlaceId) {
      event.preventDefault();
      openNavChoice(event.target.dataset.navPlaceId);
    }
  });
})();
