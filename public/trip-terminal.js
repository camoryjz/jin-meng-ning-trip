(() => {
  const TZ = {
    iana: "Asia/Shanghai",
    offset: "+08:00",
    label: "北京时间 UTC+8"
  };

  const STAYS = [
    [1, "太原"], [2, "忻州"], [3, "浑源"], [4, "大同"], [5, "大同"],
    [6, "呼和浩特"], [7, "希拉穆仁草原"], [8, "巴彦淖尔"],
    [9, "腾格里沙漠"], [10, "腾格里沙漠"], [11, "中卫"],
    [12, "银川"], [13, "银川"]
  ];

  const RESERVATION_RULES = [
    { re: /山西博物院/, label: "免费预约", tone: "warn", note: "提前3日20:00放票；当日8:00也可预约" },
    { re: /悬空寺/, label: "高风险·提前抢", tone: "danger", note: "登临票严格限量，线上7日窗口并启用人脸核验" },
    { re: /云冈石窟/, label: "必须预约", tone: "danger", note: "提前15日（不含当日），免票人群也需实名预约" },
    { re: /内蒙古博物院/, label: "免费预约", tone: "warn", note: "可提前7日预约；周一闭馆（法定节假日除外）" },
    { re: /西夏王陵|西夏陵/, label: "建议提前订", tone: "warn", note: "国庆假期客流高，优先锁定上午时段" },
    { re: /贺兰山岩画/, label: "建议提前订", tone: "warn", note: "国庆假期客流高；与西夏陵同日时优先保证西夏陵" },
    { re: /太原植物园/, label: "实名购票", tone: "warn", note: "旺季9:00—19:00，18:00停止售检票" }
  ];

  const VERIFIED_TIPS = [
    {
      title: "太原植物园：完整夜景不现实",
      tone: "danger",
      body: "9月24日太原日落约18:24；植物园旺季19:00闭园、18:00停止售检票。可以看日落和蓝调，但不要把“夜景”当成可长期停留项目。"
    },
    {
      title: "山西博物院：9月25日可去，但要抢免费预约",
      tone: "warn",
      body: "9月25日是周五，不碰周一闭馆；免费参观。当前规则为参观日前3天（不含当日）20:00放票，当日8:00也会放票。"
    },
    {
      title: "悬空寺：全程最需要提前锁票的一站",
      tone: "danger",
      body: "9月27日正处中秋假期尾声。登临票严格限量，线上可预约7日内票；线上购票启用人脸识别，同一订单同行人员需完成核验。"
    },
    {
      title: "云冈石窟：预约窗口已经打开",
      tone: "danger",
      body: "9月28日参观。现行规则为提前15日（不含当日）预约，且所有游客、包括政策性免票人群，都需要提前实名预约。"
    },
    {
      title: "内蒙古博物院：9月30日不碰闭馆日",
      tone: "ok",
      body: "9月30日是周三。常态开放9:00—17:00、16:00停止入馆；周一闭馆（法定节假日除外），可提前7日预约。"
    },
    {
      title: "中秋 + 国庆两段客流高峰",
      tone: "warn",
      body: "2026年中秋假期为9月25—27日，国庆假期为10月1—7日。D2—D4以及D8—D14都要按假日客流预留停车、排队和高速拥堵缓冲。"
    },
    {
      title: "长途驾驶：D8、D9不要再加景点",
      tone: "warn",
      body: "10月1日希拉穆仁→包头→巴彦淖尔、10月2日巴彦淖尔→乌海湖→腾格里都处在国庆高峰。酒店和沙漠接驳点确认后，应重新按精确门址校核车程。"
    }
  ];

  let focusTimer = null;
  let initialized = false;

  const esc = (value = "") => String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);

  const fmtDate = (date) => new Intl.DateTimeFormat("zh-CN", {
    timeZone: TZ.iana,
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(date);

  function chinaDate(dateString, timeString) {
    const [h, m] = timeString.split(":").map(Number);
    return new Date(`${dateString}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00${TZ.offset}`);
  }

  function getRoutePlaces(data) {
    const regions = data?.routeMap?.regions || [];
    const placeRows = regions.flatMap((region) => region.places || []);
    const map = new Map();
    placeRows.forEach((place) => {
      if (!place?.id) return;
      map.set(place.id, place);
      if (place.lines?.[0]) map.set(place.lines[0], place);
    });
    return map;
  }

  function setupTheme() {
    const apply = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: TZ.iana,
        hour: "2-digit",
        hourCycle: "h23"
      }).formatToParts(new Date());
      const hour = Number(parts.find((part) => part.type === "hour")?.value || 12);
      document.documentElement.dataset.tripTheme = hour >= 6 && hour < 18 ? "day" : "night";
    };
    apply();
    setInterval(apply, 60_000);
  }

  function focusEvents(data) {
    const events = [];
    (data.flights || []).forEach((flight) => {
      const journey = (data.flightJourneys || []).find((item) => item.id === flight.journeyId);
      if (journey?.status !== "confirmed") return;
      const target = chinaDate(flight.departure.date, flight.departure.time);
      events.push({
        target,
        label: `${flight.airline?.nameZh || flight.airline?.name || ""} ${flight.flightNumber || ""} 起飞`.trim(),
        detail: `${flight.departure.city || ""}${flight.departure.airportName || ""}${flight.departure.terminal || ""} → ${flight.arrival.city || ""}${flight.arrival.airportName || ""}${flight.arrival.terminal || ""}`,
        place: flight.departure.airportName || flight.departure.city || ""
      });
    });

    (data.days || []).forEach((day) => {
      (day.schedule || []).forEach((item) => {
        if (item.type === "flight") return;
        const match = String(item.time || "").match(/^(\d{1,2}):(\d{2})/);
        if (!match) return;
        events.push({
          target: chinaDate(day.date, `${match[1].padStart(2, "0")}:${match[2]}`),
          label: item.text || day.title,
          detail: `DAY ${String(day.day).padStart(2, "0")} · ${day.title}`,
          placeId: item.placeId || item.placeIds?.[0] || ""
        });
      });
    });

    return events.sort((a, b) => a.target - b.target);
  }

  function nextEvent(data) {
    const now = Date.now();
    return focusEvents(data).find((event) => event.target.getTime() > now) || null;
  }

  function countdownParts(target) {
    const diff = Math.max(0, target.getTime() - Date.now());
    const total = Math.floor(diff / 1000);
    return {
      diff,
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60
    };
  }

  function buildFocus() {
    const section = document.createElement("section");
    section.className = "section terminal-focus";
    section.id = "focus";
    section.innerHTML = `
      <div class="terminal-focus__heading">
        <div>
          <p class="terminal-focus__trip">晋蒙宁14天自驾旅行手册</p>
          <p class="section-kicker">此刻关注 · NEXT</p>
        </div>
        <span class="timezone-pill">${TZ.label}</span>
      </div>
      <div class="terminal-focus__body">
        <div>
          <p class="terminal-focus__date" id="terminal-focus-date"></p>
          <h1 id="terminal-focus-title">正在计算下一个行程事件</h1>
          <p class="terminal-focus__detail" id="terminal-focus-detail"></p>
        </div>
        <div class="terminal-countdown" id="terminal-countdown" aria-live="polite">
          ${["天", "时", "分", "秒"].map((unit, index) => `
            <div><strong data-countdown-part="${["days","hours","minutes","seconds"][index]}">00</strong><span>${unit}</span></div>
          `).join("")}
        </div>
      </div>
    `;
    return section;
  }

  function updateFocus(data) {
    const event = nextEvent(data);
    const title = document.querySelector("#terminal-focus-title");
    const detail = document.querySelector("#terminal-focus-detail");
    const date = document.querySelector("#terminal-focus-date");
    if (!title || !detail || !date) return;

    if (!event) {
      title.textContent = "当前没有更晚的已确认时间点";
      detail.textContent = "待新的机票、酒店、门票或明确时刻加入后，这里会自动更新。";
      date.textContent = TZ.label;
      document.querySelectorAll("[data-countdown-part]").forEach((node) => node.textContent = "00");
      return;
    }

    title.textContent = event.label;
    detail.textContent = event.detail;
    date.textContent = `${fmtDate(event.target)} · ${new Intl.DateTimeFormat("zh-CN", {
      timeZone: TZ.iana, hour: "2-digit", minute: "2-digit", hour12: false
    }).format(event.target)} · ${TZ.label}`;

    const parts = countdownParts(event.target);
    const values = {
      days: String(parts.days).padStart(2, "0"),
      hours: String(parts.hours).padStart(2, "0"),
      minutes: String(parts.minutes).padStart(2, "0"),
      seconds: String(parts.seconds).padStart(2, "0")
    };
    Object.entries(values).forEach(([key, value]) => {
      const node = document.querySelector(`[data-countdown-part="${key}"]`);
      if (node) node.textContent = value;
    });
  }

  function detailRow(label, value) {
    return `<div class="booking-row"><span>${esc(label)}</span><strong>${esc(value || "未确认")}</strong></div>`;
  }

  function buildBookings(data) {
    const section = document.createElement("section");
    section.className = "section terminal-bookings";
    section.id = "bookings";
    const cards = [];

    (data.flightJourneys || []).filter((journey) => journey.status === "confirmed").forEach((journey) => {
      const flights = (data.flights || []).filter((flight) => flight.journeyId === journey.id);
      flights.forEach((flight) => {
        cards.push(`
          <article class="booking-card">
            <div class="booking-card__top"><span>机票</span><b>已确认</b></div>
            <h3>${esc(`${flight.airline?.nameZh || flight.airline?.name || ""} ${flight.flightNumber || ""}`.trim())}</h3>
            ${detailRow("时间", `${flight.departure.date} ${flight.departure.time} → ${flight.arrival.date} ${flight.arrival.time} · ${TZ.label}`)}
            ${detailRow("地址", `${flight.departure.airportName || ""}${flight.departure.terminal || ""} → ${flight.arrival.airportName || ""}${flight.arrival.terminal || ""}`)}
            ${detailRow("电话", "未从出票截图确认")}
            <p class="booking-note">${esc([flight.cabin, flight.aircraft, flight.meal].filter(Boolean).join(" · "))}</p>
          </article>
        `);
      });
    });

    const rental = data?.groundTransport?.rentalCar;
    if (rental?.pickup && rental?.dropoff) {
      cards.push(`
        <article class="booking-card">
          <div class="booking-card__top"><span>租车</span><b>已确认</b></div>
          <h3>${esc(rental.vehicle?.example || "租车订单")}</h3>
          ${detailRow("取车", `${rental.pickup.date} ${rental.pickup.time} · ${rental.pickup.location} · ${TZ.label}`)}
          ${detailRow("还车", `${rental.dropoff.date} ${rental.dropoff.time} · ${rental.dropoff.vehicleReturnPoint} · ${TZ.label}`)}
          ${detailRow("电话", "未从订单截图确认")}
          <p class="booking-note">${esc(rental.vehicle?.class || "")}</p>
        </article>
      `);
    }

    (data.accommodations || []).filter((item) => item.status === "confirmed" || item.confirmed === true).forEach((hotel) => {
      cards.push(`
        <article class="booking-card">
          <div class="booking-card__top"><span>酒店</span><b>已确认</b></div>
          <h3>${esc(hotel.name || hotel.hotelName || "酒店")}</h3>
          ${detailRow("时间", `${hotel.checkIn || ""}${hotel.checkOut ? ` → ${hotel.checkOut}` : ""} · ${TZ.label}`)}
          ${detailRow("地址", hotel.address || "未从截图确认")}
          ${detailRow("电话", hotel.phone || "未从截图确认")}
        </article>
      `);
    });

    (data.bookingsAndTickets || []).filter((item) => item.status === "confirmed" || item.confirmed === true).forEach((ticket) => {
      cards.push(`
        <article class="booking-card">
          <div class="booking-card__top"><span>门票</span><b>已确认</b></div>
          <h3>${esc(ticket.name || ticket.title || "门票")}</h3>
          ${detailRow("时间", `${ticket.time || ticket.date || "已确认"} · ${TZ.label}`)}
          ${detailRow("地址", ticket.address || ticket.location || "未从截图确认")}
          ${detailRow("电话", ticket.phone || "未从截图确认")}
        </article>
      `);
    });

    section.innerHTML = `
      <div class="section-heading">
        <div><p class="section-kicker">CONFIRMED</p><h2>已确认预订</h2></div>
        <span class="soft-label">${cards.length} 项</span>
      </div>
      <div class="booking-grid">${cards.join("")}</div>
    `;
    if (!cards.length) section.hidden = true;
    return section;
  }

  function buildTips() {
    const section = document.createElement("section");
    section.className = "section terminal-tips";
    section.id = "tips";
    section.innerHTML = `
      <div class="section-heading">
        <div><p class="section-kicker">USEFUL NOTES</p><h2>实用贴士</h2></div>
        <span class="soft-label">${TZ.label}</span>
      </div>
      <div class="tips-grid">
        ${VERIFIED_TIPS.map((tip) => `
          <article class="tip-card tip-card--${tip.tone}">
            <h3>${esc(tip.title)}</h3>
            <p>${esc(tip.body)}</p>
          </article>
        `).join("")}
      </div>
    `;
    return section;
  }

  function stayList() {
    return `
      <div class="stay-panel">
        <div class="stay-panel__header"><strong>每晚住宿地</strong><span>13晚 · 酒店名称以已确认订单为准</span></div>
        <div class="stay-grid">
          ${STAYS.map(([day, place]) => `
            <button type="button" class="stay-chip terminal-place-button" data-terminal-place="${esc(place)}">
              <span>D${day}</span><strong>${esc(place)}</strong>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function routeByDay(data, dayNumber) {
    const row = (data?.groundTransport?.dailyRoutes || data?.groundTransport?.routes || []).find((route) => Number(route.day) === Number(dayNumber));
    if (row?.placeIds?.length) return row.placeIds;
    const day = (data.days || []).find((item) => Number(item.day) === Number(dayNumber));
    return (day?.schedule || []).flatMap((item) => item.placeIds || (item.placeId ? [item.placeId] : []));
  }

  function routePlaces(data, dayNumber, placeMap) {
    const ids = routeByDay(data, dayNumber);
    return ids.map((id) => placeMap.get(id)).filter(Boolean);
  }

  function reservationMarkup(text) {
    const rule = RESERVATION_RULES.find((item) => item.re.test(text));
    if (!rule) return "";
    return `<span class="reservation-badge reservation-badge--${rule.tone}" title="${esc(rule.note)}">${esc(rule.label)}</span>`;
  }

  function decorateTimeline(data, placeMap) {
    document.querySelectorAll(".day-card").forEach((card) => {
      const dayNumber = Number(card.dataset.day);
      const day = (data.days || []).find((item) => Number(item.day) === dayNumber);
      if (!day) return;
      const detail = card.querySelector(".day-detail");
      if (detail && !detail.querySelector(".day-route-panel")) {
        const places = routePlaces(data, dayNumber, placeMap);
        if (places.length) {
          const panel = document.createElement("details");
          panel.className = "day-route-panel";
          panel.innerHTML = `
            <summary>当日路线地图与多点导航</summary>
            <div class="day-route-panel__body">
              <div class="day-route-track">
                ${places.map((place, index) => `
                  <button type="button" class="day-route-stop terminal-place-button" data-terminal-place="${esc(place.lines?.[0] || place.name || place.id)}">
                    <span>${index + 1}</span><strong>${esc(place.lines?.[0] || place.name || place.id)}</strong>
                  </button>
                `).join("")}
              </div>
              <button type="button" class="all-day-nav" data-all-day-nav="${dayNumber}">一键打开全天多点导航</button>
            </div>
          `;
          detail.prepend(panel);
        }
      }

      card.querySelectorAll(".schedule-item").forEach((itemNode, index) => {
        const item = day.schedule?.[index];
        if (!item) return;
        const time = itemNode.querySelector(".schedule-time");
        if (time && !time.querySelector(".time-zone-chip")) {
          time.insertAdjacentHTML("beforeend", `<small class="time-zone-chip">${TZ.label}</small>`);
        }
        const content = itemNode.querySelector(".schedule-content");
        if (content && !content.querySelector(".reservation-badge")) {
          content.insertAdjacentHTML("afterbegin", reservationMarkup(item.text || ""));
        }
      });
    });
  }

  function amapNavUrl(name, place) {
    const geo = place?.geo;
    if (geo?.lng != null && geo?.lat != null) {
      const to = `${geo.lng},${geo.lat},${name}`;
      return `https://uri.amap.com/navigation?from=&to=${encodeURIComponent(to)}&mode=car&policy=1&src=jinmengning-trip&callnative=1`;
    }
    return `https://uri.amap.com/search?keyword=${encodeURIComponent(name)}&view=map&src=jinmengning-trip&callnative=1`;
  }

  function baiduWebUrl(name) {
    return `https://api.map.baidu.com/place/search?query=${encodeURIComponent(name)}&region=${encodeURIComponent("全国")}&output=html&src=webapp.camoryjz.jinmengning`;
  }

  function ensureNavDialog() {
    let dialog = document.querySelector("#terminal-nav-dialog");
    if (dialog) return dialog;
    dialog = document.createElement("dialog");
    dialog.className = "terminal-nav-dialog";
    dialog.id = "terminal-nav-dialog";
    dialog.innerHTML = `
      <div class="terminal-nav-dialog__head">
        <div><span>导航到</span><h2 id="terminal-nav-title"></h2></div>
        <button type="button" data-terminal-nav-close>关闭</button>
      </div>
      <div class="terminal-nav-dialog__actions" id="terminal-nav-actions"></div>
    `;
    document.body.append(dialog);
    dialog.addEventListener("click", (event) => {
      if (event.target.closest("[data-terminal-nav-close]")) dialog.close();
    });
    return dialog;
  }

  function openPlaceNav(name, placeMap) {
    const place = placeMap.get(name) || [...placeMap.values()].find((item) => item.lines?.[0] === name);
    const dialog = ensureNavDialog();
    dialog.querySelector("#terminal-nav-title").textContent = name;
    const baiduScheme = place?.geo
      ? `baidumap://map/direction?origin=${encodeURIComponent("我的位置")}&destination=${place.geo.lat},${place.geo.lng}&coord_type=gcj02&mode=driving&src=ios.camoryjz.jinmengning`
      : `baidumap://map/direction?origin=${encodeURIComponent("我的位置")}&destination=${encodeURIComponent(name)}&mode=driving&src=ios.camoryjz.jinmengning`;
    dialog.querySelector("#terminal-nav-actions").innerHTML = `
      <a class="nav-provider nav-provider--amap" href="${amapNavUrl(name, place)}" target="_blank" rel="noopener">高德地图导航</a>
      <a class="nav-provider nav-provider--baidu" href="${baiduScheme}">百度地图导航</a>
      <a class="nav-provider nav-provider--web" href="${baiduWebUrl(name)}" target="_blank" rel="noopener">百度网页版</a>
    `;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function openAllDayNav(data, dayNumber, placeMap) {
    const places = routePlaces(data, dayNumber, placeMap);
    if (places.length < 2) return;
    const [origin, ...rest] = places;
    const destination = rest[rest.length - 1];
    const vias = rest.slice(0, -1).filter((place) => place.geo);
    const allHaveCoords = places.every((place) => place.geo?.lat != null && place.geo?.lng != null);

    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && allHaveCoords) {
      const viaPoints = encodeURIComponent(JSON.stringify({
        viaPoints: vias.map((place) => ({
          name: place.lines?.[0] || place.name || place.id,
          lat: place.geo.lat,
          lng: place.geo.lng
        }))
      }));
      const url = `baidumap://map/direction?origin=${origin.geo.lat},${origin.geo.lng}&destination=${destination.geo.lat},${destination.geo.lng}&coord_type=gcj02&mode=driving&viaPoints=${viaPoints}&src=ios.camoryjz.jinmengning`;
      window.location.href = url;
      return;
    }

    const dialog = ensureNavDialog();
    dialog.querySelector("#terminal-nav-title").textContent = `DAY ${dayNumber} 全天路线`;
    dialog.querySelector("#terminal-nav-actions").innerHTML = `
      <div class="all-day-route-list">
        ${places.map((place, index) => `<span><b>${index + 1}</b>${esc(place.lines?.[0] || place.name || place.id)}</span>`).join("")}
      </div>
      <p class="nav-dialog-note">手机端安装百度地图时，可直接调起含途经点的全天路线；桌面端按下方路段逐段打开。</p>
      ${places.slice(0, -1).map((place, index) => {
        const next = places[index + 1];
        const from = place.lines?.[0] || place.name || place.id;
        const to = next.lines?.[0] || next.name || next.id;
        const web = `https://api.map.baidu.com/direction?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&mode=driving&output=html&src=webapp.camoryjz.jinmengning`;
        return `<a class="nav-provider nav-provider--web" href="${web}" target="_blank" rel="noopener">${esc(from)} → ${esc(to)}</a>`;
      }).join("")}
    `;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function updateNavigation() {
    const menu = document.querySelector(".travel-navigation-menu");
    if (!menu) return;
    const links = [...menu.querySelectorAll("a")];
    const byModule = Object.fromEntries(links.map((link) => [link.dataset.module, link]));
    if (byModule.flights) {
      byModule.flights.href = "#bookings";
      byModule.flights.textContent = "已确认";
      byModule.flights.hidden = false;
    }
    if (byModule.overview) {
      byModule.overview.textContent = "总览";
      byModule.overview.hidden = false;
    }
    if (byModule.itinerary) {
      byModule.itinerary.textContent = "行程";
      byModule.itinerary.hidden = false;
    }
    if (byModule.driving) {
      byModule.driving.href = "#tips";
      byModule.driving.textContent = "贴士";
      byModule.driving.hidden = false;
    }
    if (byModule.todo) {
      byModule.todo.textContent = "待办";
      byModule.todo.hidden = false;
    }
    const trigger = document.querySelector("#travel-navigation-trigger");
    if (trigger) trigger.textContent = "旅行手册";
  }

  function init(data) {
    if (initialized || !data) return;
    initialized = true;
    document.documentElement.dataset.terminalTripReady = "1";
    setupTheme();

    const main = document.querySelector("#main");
    if (!main) return;
    const hero = main.querySelector(".hero");
    if (hero) hero.hidden = true;
    const flights = main.querySelector("#flights");
    if (flights) flights.hidden = true;
    const drive = main.querySelector("#drive");
    if (drive) drive.hidden = true;

    const placeMap = getRoutePlaces(data);
    const focus = buildFocus();
    main.prepend(focus);

    const route = main.querySelector("#route");
    if (route) {
      route.hidden = false;
      route.querySelector(".route-caption")?.replaceChildren(document.createTextNode("路线为行程示意；点击地点可直接用高德或百度导航。"));
      const explorer = route.querySelector("#route-explorer");
      if (explorer && !route.querySelector(".stay-panel")) explorer.insertAdjacentHTML("afterend", stayList());
    }

    const bookings = buildBookings(data);
    if (route) route.after(bookings);
    else focus.after(bookings);

    const itinerary = main.querySelector("#itinerary");
    if (itinerary) itinerary.hidden = false;

    const prep = main.querySelector("#prep");
    if (prep) prep.hidden = false;

    const tips = buildTips();
    const footer = main.querySelector(".footer");
    if (footer) footer.before(tips);
    else main.append(tips);

    updateNavigation();
    decorateTimeline(data, placeMap);
    updateFocus(data);
    focusTimer = setInterval(() => updateFocus(data), 1000);

    document.addEventListener("click", (event) => {
      const placeButton = event.target.closest(".schedule-map-link, .terminal-place-button");
      if (placeButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const name = placeButton.dataset.terminalPlace || placeButton.dataset.mapLabel || placeButton.textContent.replace(/^📍\s*/, "").trim();
        if (name) openPlaceNav(name, placeMap);
        return;
      }
      const allDayButton = event.target.closest("[data-all-day-nav]");
      if (allDayButton) {
        event.preventDefault();
        openAllDayNav(data, Number(allDayButton.dataset.allDayNav), placeMap);
      }
    }, true);
  }

  document.addEventListener("travel-data-ready", (event) => {
    setTimeout(() => init(event.detail), 0);
  }, { once: true });

  if (window.TRAVEL_PLAN_DATA) {
    setTimeout(() => init(window.TRAVEL_PLAN_DATA), 0);
  }

  window.addEventListener("beforeunload", () => {
    if (focusTimer) clearInterval(focusTimer);
  });
})();
