(() => {
  "use strict";

  const SOURCE = "jin-meng-ning-trip";
  const BAIDU_SOURCE = "webapp.jmn.trip";
  const NO_SELF_DRIVE = new Set(["tengger-five-lakes"]);
  const CONDITIONAL_NO_NAV = new Set(["yinshan-rock-art"]);

  // GCJ-02 coordinates verified against the corresponding AMap POI pages.
  const TRUSTED_GCJ02 = {
    "yanmen-pass": { lat: 39.182243, lng: 112.878966, poiId: "B015E00DWA" },
    "yong-an-temple": { lat: 39.702219, lng: 113.692323, poiId: "B01600ML5Y" },
    "yuanjue-temple": { lat: 39.700843, lng: 113.692144, poiId: "B0FFIJSPCR" },
    "huayan-temple": { lat: 40.092531, lng: 113.295060, poiId: "B0160007IG" },
    "nine-dragon-screen": { lat: 40.093042, lng: 113.303979, poiId: "B0160005JK" },
    "shanhua-temple": { lat: 40.087041, lng: 113.300335, poiId: "B0160002S2" },
    "zhongwei-gaomiao": { lat: 37.518248, lng: 105.188766, poiId: "B07A1001E0" },
    "lanshan-park": { lat: 38.530068, lng: 106.215378, poiId: "B03B70PN5S" },
    "ningxia-museum": { lat: 38.484801, lng: 106.235128, poiId: "B03B703MJK" },
    "yinchuan-airport": { lat: 38.321759, lng: 106.393399, poiId: "B03B703LYQ" }
  };

  const esc = (value = "") => String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);

  let data = null;

  function pointName(placeId) {
    const place = data?.places?.find((item) => item.id === placeId);
    const mapPlace = data?.map?.places?.find((item) => item.id === placeId);
    return place?.nameZh || place?.name || mapPlace?.name || placeId;
  }

  function pointFor(placeId) {
    const place = data?.places?.find((item) => item.id === placeId) || {};
    const mapPlace = data?.map?.places?.find((item) => item.id === placeId) || {};
    const trusted = TRUSTED_GCJ02[placeId];
    const geo = trusted || (!mapPlace.approximate ? mapPlace.geo : null) || (!place.approximate ? place.geo : null);
    return {
      id: placeId,
      name: pointName(placeId),
      address: place.address || mapPlace.address || "",
      lat: Number(geo?.lat),
      lng: Number(geo?.lng),
      hasGeo: Number.isFinite(Number(geo?.lat)) && Number.isFinite(Number(geo?.lng)),
      poiId: trusted?.poiId || place?.amap?.poiId || ""
    };
  }

  function routeIds(dayNumber) {
    const route = data?.map?.dailyRoutes?.find((item) => Number(item.day) === Number(dayNumber))
      || data?.map?.routes?.find((item) => Number(item.day) === Number(dayNumber));
    let ids = Array.isArray(route?.placeIds) ? route.placeIds : [];
    if (!ids.length) {
      const day = data?.days?.find((item) => Number(item.day) === Number(dayNumber));
      ids = (day?.schedule || []).flatMap((item) => [
        ...(Array.isArray(item.placeIds) ? item.placeIds : []),
        ...(item.placeId ? [item.placeId] : [])
      ]);
    }
    return ids.filter((id, index, list) => id && (index === 0 || id !== list[index - 1]));
  }

  function routePoints(dayNumber) {
    return routeIds(dayNumber).map(pointFor);
  }

  function amapPointUrl(point) {
    if (!point.hasGeo) return `https://uri.amap.com/search?keyword=${encodeURIComponent(point.name)}&src=${SOURCE}&callnative=1`;
    const to = `${point.lng},${point.lat},${encodeURIComponent(point.name)}`;
    return `https://uri.amap.com/navigation?from=&to=${to}&mode=car&policy=0&src=${SOURCE}&callnative=1`;
  }

  function baiduPointFallback(point) {
    if (!point.hasGeo) return `https://map.baidu.com/search/${encodeURIComponent(point.name)}`;
    const destination = `name:${point.name}|latlng:${point.lat},${point.lng}`;
    const params = new URLSearchParams({
      origin: "我的位置",
      destination,
      mode: "driving",
      coord_type: "gcj02",
      output: "html",
      src: BAIDU_SOURCE
    });
    return `https://api.map.baidu.com/direction?${params.toString()}`;
  }

  function baiduPointScheme(point) {
    if (!point.hasGeo) return "";
    const params = new URLSearchParams({
      query: point.name,
      location: `${point.lat},${point.lng}`,
      coord_type: "gcj02",
      src: BAIDU_SOURCE
    });
    return `bdapp://map/navi?${params.toString()}`;
  }

  function amapMultiScheme(points) {
    if (points.length < 2 || points.some((point) => !point.hasGeo)) return "";
    const start = points[0];
    const end = points[points.length - 1];
    const vias = points.slice(1, -1);
    const params = new URLSearchParams({
      sourceApplication: "晋蒙宁旅行手册",
      slat: String(start.lat), slon: String(start.lng), sname: start.name,
      dlat: String(end.lat), dlon: String(end.lng), dname: end.name,
      dev: "0", t: "0", m: "0"
    });
    if (vias.length) {
      params.set("vian", String(vias.length));
      params.set("vialons", vias.map((point) => point.lng).join("|"));
      params.set("vialats", vias.map((point) => point.lat).join("|"));
      params.set("vianames", vias.map((point) => point.name).join("|"));
    }
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    return ios ? `iosamap://path?${params.toString()}` : `amapuri://route/plan/?${params.toString()}`;
  }

  function amapMultiFallback(points) {
    const valid = points.filter((point) => point.hasGeo).slice(0, 10);
    if (!valid.length) return "https://www.amap.com/dir";
    const markers = valid.map((point) => `${point.lng},${point.lat},${point.name}`).join("|");
    return `https://uri.amap.com/marker?markers=${encodeURIComponent(markers)}&src=${SOURCE}&callnative=0`;
  }

  function baiduMultiScheme(points) {
    if (points.length < 2 || points.some((point) => !point.hasGeo)) return "";
    const start = points[0];
    const end = points[points.length - 1];
    const vias = points.slice(1, -1).map((point) => ({ name: point.name, lat: point.lat, lng: point.lng }));
    const params = new URLSearchParams({
      origin: `name:${start.name}|latlng:${start.lat},${start.lng}`,
      destination: `name:${end.name}|latlng:${end.lat},${end.lng}`,
      coord_type: "gcj02",
      mode: "driving",
      src: BAIDU_SOURCE
    });
    if (vias.length) params.set("viaPoints", JSON.stringify({ viaPoints: vias }));
    return `bdapp://map/direction?${params.toString()}`;
  }

  function baiduMultiFallback(points) {
    const valid = points.filter((point) => point.hasGeo);
    if (valid.length < 2) return "https://map.baidu.com";
    const start = valid[0];
    const end = valid[valid.length - 1];
    const vias = valid.slice(1, -1).map((point) => ({ name: point.name, lat: point.lat, lng: point.lng }));
    const params = new URLSearchParams({
      origin: `name:${start.name}|latlng:${start.lat},${start.lng}`,
      destination: `name:${end.name}|latlng:${end.lat},${end.lng}`,
      coord_type: "gcj02",
      mode: "driving",
      output: "html",
      src: BAIDU_SOURCE
    });
    if (vias.length) params.set("viaPoints", JSON.stringify({ viaPoints: vias }));
    return `https://api.map.baidu.com/direction?${params.toString()}`;
  }

  function launchScheme(scheme, fallback) {
    if (!scheme) {
      window.open(fallback, "_blank", "noopener,noreferrer");
      return;
    }
    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible") window.open(fallback, "_blank", "noopener,noreferrer");
    }, 1400);
    const stop = () => window.clearTimeout(timer);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") stop();
    }, { once: true });
    window.location.href = scheme;
  }

  function routeMapMarkup(dayNumber) {
    try {
      if (typeof window.travelMapSource !== "function" || typeof window.mapRouteDefinitions !== "function" || typeof window.travelMapMarkup !== "function") return "";
      const source = window.travelMapSource(data.routeMap, data.routeMap?.defaultRegionId);
      const route = window.mapRouteDefinitions(source).find((item) => Number(item.day) === Number(dayNumber));
      return route ? window.travelMapMarkup(source, route) : "";
    } catch (error) {
      console.warn("Daily route map fallback used", error);
      return "";
    }
  }

  function stopRow(point, index, dayNumber) {
    const blocked = NO_SELF_DRIVE.has(point.id) || (CONDITIONAL_NO_NAV.has(point.id) && !point.hasGeo);
    const label = blocked ? "点位待确认" : point.hasGeo ? "直接导航" : "搜索地点";
    return `
      <li class="daily-route-stop" data-route-stop="${esc(point.id)}">
        <span class="daily-route-stop__index">${index + 1}</span>
        <button type="button" class="daily-route-stop__name" data-direct-amap="${esc(point.id)}" data-day="${dayNumber}" ${blocked ? "disabled" : ""}>${esc(point.name)}</button>
        <span class="daily-route-stop__status">${label}</span>
        <div class="daily-route-stop__actions">
          <button type="button" data-direct-amap="${esc(point.id)}" ${blocked ? "disabled" : ""}>高德导航</button>
          <button type="button" data-direct-baidu="${esc(point.id)}" ${blocked ? "disabled" : ""}>百度导航</button>
        </div>
      </li>`;
  }

  function routeToolsMarkup(dayNumber) {
    const points = routePoints(dayNumber);
    const missing = points.filter((point) => !point.hasGeo && !NO_SELF_DRIVE.has(point.id));
    const isDesertDay = dayNumber === 10;
    const canMulti = !isDesertDay && points.length >= 2 && !missing.length && !points.some((point) => NO_SELF_DRIVE.has(point.id));
    const note = isDesertDay
      ? "沙漠内部路线由正规运营方司机执行，租赁车辆不进入五湖穿越线路。"
      : missing.length
        ? `以下点位尚未锁定准确坐标：${missing.map((point) => point.name).join("、")}。全天多点导航会暂时停用，逐点高德搜索仍可使用。`
        : "全天路线按页面顺序写入地图App；景区停车入口、临时交通管制和实时路况仍以地图App当日结果为准。";
    return `
      <details class="daily-route-topper" data-daily-route="${dayNumber}">
        <summary>
          <span><b>当日路线地图</b><small>${points.length}个路线节点 · 点击展开</small></span>
          <span class="daily-route-topper__chevron">⌄</span>
        </summary>
        <div class="daily-route-topper__body">
          <div class="daily-route-actions">
            <button type="button" class="daily-route-actions__primary" data-day-amap="${dayNumber}" ${canMulti ? "" : "disabled"}>高德 · 一键打开全天多点导航</button>
            <button type="button" data-day-baidu="${dayNumber}" ${canMulti ? "" : "disabled"}>百度 · 备用多点路线</button>
          </div>
          <p class="daily-route-note">${esc(note)}</p>
          <div class="daily-route-map-slot" data-map-slot="${dayNumber}"></div>
          <ol class="daily-route-stops">${points.map((point, index) => stopRow(point, index, dayNumber)).join("")}</ol>
        </div>
      </details>`;
  }

  function hydrateDailyRoute(details) {
    if (details.dataset.hydrated === "1") return;
    details.dataset.hydrated = "1";
    const dayNumber = Number(details.dataset.dailyRoute);
    const slot = details.querySelector("[data-map-slot]");
    const mapMarkup = routeMapMarkup(dayNumber);
    if (slot) {
      slot.innerHTML = mapMarkup || `<div class="daily-route-fallback">${routePoints(dayNumber).map((point, index) => `<span><i>${index + 1}</i>${esc(point.name)}</span>`).join("<b>→</b>")}</div>`;
    }
  }

  function injectDailyRoutes() {
    document.querySelectorAll(".day-card").forEach((card) => {
      if (card.querySelector(":scope > .daily-route-topper")) return;
      const dayNumber = Number(card.dataset.day);
      const toggle = card.querySelector(":scope > .day-toggle");
      if (!toggle || !dayNumber) return;
      toggle.insertAdjacentHTML("afterend", routeToolsMarkup(dayNumber));
    });
  }

  function ticketStatus(ticketId) {
    return Boolean(document.querySelector(`.schedule-ticket input[value="${CSS.escape(ticketId)}"]`)?.checked);
  }

  function bookingCard(item) {
    const day = data?.days?.find((entry) => Number(entry.day) === Number(item.day));
    const checked = ticketStatus(item.id);
    const requirement = item.requirement === "required" ? "必须处理" : "建议预约";
    return `
      <article class="booking-card" data-booking-id="${esc(item.id)}">
        <label>
          <input type="checkbox" data-booking-toggle="${esc(item.id)}" ${checked ? "checked" : ""}>
          <span class="booking-card__check">✓</span>
          <span class="booking-card__copy"><small>${day ? `D${day.day} · ${day.date.slice(5).replace("-", "/")}` : "旅行预约"} · ${requirement}</small><b>${esc(item.name || item.title || "预约事项")}</b><em>${esc(item.guidance || "")}</em></span>
        </label>
        ${day ? `<button type="button" data-booking-day="${day.day}">查看当天</button>` : ""}
      </article>`;
  }

  function ensureBookings() {
    const items = data?.ticketPlanning?.items || [];
    if (!items.length) return;
    let section = document.querySelector("#bookings");
    if (!section) {
      const itinerary = document.querySelector("#itinerary");
      if (!itinerary) return;
      section = document.createElement("section");
      section.className = "section booking-section";
      section.id = "bookings";
      section.setAttribute("aria-labelledby", "bookings-title");
      section.innerHTML = `
        <div class="section-heading"><div><p class="section-kicker">RESERVATIONS</p><h2 id="bookings-title">预约与门票</h2></div><span class="soft-label" id="booking-progress">0 / 0</span></div>
        <p class="booking-intro">保留原有预约状态，并与每日行程里的门票/预约勾选同步。</p>
        <div class="booking-list" id="booking-list"></div>`;
      itinerary.insertAdjacentElement("afterend", section);
    }
    const list = section.querySelector("#booking-list");
    if (list) list.innerHTML = items.map(bookingCard).join("");
    syncBookingProgress();

    const menu = document.querySelector(".travel-navigation-menu");
    if (menu && !menu.querySelector('a[href="#bookings"]')) {
      const link = document.createElement("a");
      link.href = "#bookings";
      link.setAttribute("role", "menuitem");
      link.textContent = "预约";
      const prep = menu.querySelector('a[href="#prep"]');
      if (prep) prep.insertAdjacentElement("beforebegin", link); else menu.append(link);
    }
  }

  function syncBookingProgress() {
    const items = data?.ticketPlanning?.items || [];
    let done = 0;
    items.forEach((item) => {
      const checked = ticketStatus(item.id);
      const bookingToggle = document.querySelector(`[data-booking-toggle="${CSS.escape(item.id)}"]`);
      if (bookingToggle) bookingToggle.checked = checked;
      const card = document.querySelector(`[data-booking-id="${CSS.escape(item.id)}"]`);
      card?.classList.toggle("is-complete", checked);
      if (checked) done += 1;
    });
    const progress = document.querySelector("#booking-progress");
    if (progress) progress.textContent = `${done} / ${items.length}`;
  }

  function openDay(dayNumber) {
    const card = document.querySelector(`.day-card[data-day="${dayNumber}"]`);
    if (!card) return;
    const toggle = card.querySelector(".day-toggle");
    if (toggle?.getAttribute("aria-expanded") !== "true") toggle?.click();
    card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function bindEvents() {
    document.addEventListener("toggle", (event) => {
      const details = event.target.closest?.(".daily-route-topper");
      if (details?.open) hydrateDailyRoute(details);
    }, true);

    document.addEventListener("click", (event) => {
      const amapDay = event.target.closest("[data-day-amap]");
      if (amapDay) {
        const points = routePoints(Number(amapDay.dataset.dayAmap));
        launchScheme(amapMultiScheme(points), amapMultiFallback(points));
        return;
      }
      const baiduDay = event.target.closest("[data-day-baidu]");
      if (baiduDay) {
        const points = routePoints(Number(baiduDay.dataset.dayBaidu));
        launchScheme(baiduMultiScheme(points), baiduMultiFallback(points));
        return;
      }
      const amap = event.target.closest("[data-direct-amap]");
      if (amap) {
        const point = pointFor(amap.dataset.directAmap);
        if (NO_SELF_DRIVE.has(point.id) || (CONDITIONAL_NO_NAV.has(point.id) && !point.hasGeo)) return;
        window.open(amapPointUrl(point), "_blank", "noopener,noreferrer");
        return;
      }
      const baidu = event.target.closest("[data-direct-baidu]");
      if (baidu) {
        const point = pointFor(baidu.dataset.directBaidu);
        if (NO_SELF_DRIVE.has(point.id) || (CONDITIONAL_NO_NAV.has(point.id) && !point.hasGeo)) return;
        launchScheme(baiduPointScheme(point), baiduPointFallback(point));
        return;
      }
      const bookingDay = event.target.closest("[data-booking-day]");
      if (bookingDay) openDay(Number(bookingDay.dataset.bookingDay));
    });

    // Map dots inside the newly inserted daily map default to the primary map: AMap.
    document.addEventListener("click", (event) => {
      const pin = event.target.closest?.(".daily-route-topper .map-place-dot[data-place-id]");
      if (!pin) return;
      const point = pointFor(pin.dataset.placeId);
      if (NO_SELF_DRIVE.has(point.id) || (CONDITIONAL_NO_NAV.has(point.id) && !point.hasGeo)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.open(amapPointUrl(point), "_blank", "noopener,noreferrer");
    }, true);

    document.addEventListener("change", (event) => {
      const booking = event.target.closest?.("[data-booking-toggle]");
      if (booking) {
        const inline = document.querySelector(`.schedule-ticket input[value="${CSS.escape(booking.dataset.bookingToggle)}"]`);
        if (inline && inline.checked !== booking.checked) {
          inline.checked = booking.checked;
          inline.dispatchEvent(new Event("change", { bubbles: true }));
        }
        window.setTimeout(syncBookingProgress, 0);
        return;
      }
      if (event.target.closest?.(".schedule-ticket input[type='checkbox']")) window.setTimeout(syncBookingProgress, 0);
    });
  }

  function init() {
    data = window.TRAVEL_PLAN_DATA;
    if (!data) return;
    injectDailyRoutes();
    ensureBookings();
    bindEvents();

    // The original Todo section (#prep) is deliberately untouched and remains the canonical Todo UI.
    const timeline = document.querySelector("#timeline");
    if (timeline) {
      new MutationObserver(() => injectDailyRoutes()).observe(timeline, { childList: true, subtree: true });
    }
  }

  document.addEventListener("travel-data-ready", () => window.setTimeout(init, 0), { once: true });
})();
