(() => {
  "use strict";

  const STAYS = [
    { day: 1, name: "太原温德姆酒店（山西博物院店）", nav: "太原温德姆酒店 山西博物院店", status: "已确认" },
    { day: 2, name: "星程忻州古城北门酒店", nav: "星程忻州古城北门酒店", status: "已确认" },
    { day: 3, name: "恒山驿馆（浑源古城店）", nav: "恒山驿馆 浑源古城店", status: "已确认" },
    { day: 4, name: "大同东信广场城际酒店", nav: "大同东信广场城际酒店", status: "已确认" },
    { day: 5, name: "大同东信广场城际酒店", nav: "大同东信广场城际酒店", status: "已确认" },
    { day: 6, name: "呼和浩特东站内蒙古博物院城际酒店", nav: "呼和浩特东站内蒙古博物院城际酒店", status: "已确认" },
    { day: 7, name: "塞北驿站（希拉穆仁草原安答店）", nav: "塞北驿站 希拉穆仁草原安答店", status: "已确认" },
    { day: 8, name: "云栖酒店（摩尔城店）", nav: "巴彦淖尔 云栖酒店 摩尔城店", status: "已确认" },
    { day: 9, name: "乌海海勃湾区桔子水晶酒店", nav: "乌海海勃湾区桔子水晶酒店", status: "已确认" },
    { day: 10, name: "银川鼓楼喆啡锐品酒店", nav: "银川鼓楼喆啡锐品酒店", status: "确认中" },
    { day: 11, name: "银川鼓楼喆啡锐品酒店", nav: "银川鼓楼喆啡锐品酒店", status: "确认中" },
    { day: 12, name: "沙坡漫芸酒店（中卫鼓楼向阳步行街店）", nav: "沙坡漫芸酒店 中卫鼓楼向阳步行街店", status: "已确认" },
    { day: 13, name: "中卫一叶星空酒店", nav: "中卫一叶星空酒店", status: "已确认 · 3间 · 赠沙坡头票" },
    { day: 14, name: "银川最后一晚酒店", nav: "银川", status: "待订" }
  ];

  const DAY_DEPARTURES = {
    1: "10:30", 2: "08:30", 3: "07:30", 4: "06:45", 5: "07:30",
    6: "08:00", 7: "08:30", 8: "08:30", 9: "08:30", 10: "07:00",
    11: "08:00", 12: "07:30", 13: "08:30", 14: "08:30", 15: "07:30"
  };
  window.JMN_DAY_DEPARTURES = Object.freeze({ ...DAY_DEPARTURES });

  const CITY_ROUTE_IDS = new Set([
    "taiyuan-city", "hunyuan", "datong", "hohhot", "baotou", "bayannur",
    "wuhai", "yinchuan", "zhongwei", "wuzhong"
  ]);

  const D1_START = { name: "太原武宿国际机场T2", nav: "太原武宿国际机场 T2", status: "上海/南京汇合后取车" };
  const esc = (value = "") => String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);

  const stayForNight = (day) => STAYS.find((item) => item.day === Number(day)) || null;
  const startForDay = (day) => Number(day) === 1 ? D1_START : stayForNight(Number(day) - 1);

  function stayScheduleItem(day, stay, kind) {
    if (!stay) return "";
    const isStart = kind === "start";
    const time = isStart ? (DAY_DEPARTURES[day] || "出发前") : "今晚";
    const label = Number(day) === 1 && isStart ? "集合取车起点" : isStart ? "从住宿地出发" : "今晚入住";
    return `
      <li class="schedule-item schedule-item--stay schedule-item--stay-${kind}">
        <span class="schedule-time">${esc(time)}</span>
        <div class="schedule-content">
          <div class="schedule-text"><strong>${esc(label)}｜${esc(stay.name)}</strong><small>${esc(stay.status || "")}${isStart && Number(day) === 4 ? " · 悬空寺开园时间如调整，以当日公告为准" : ""}</small></div>
          <div class="schedule-map-links schedule-stay-actions">
            <button type="button" class="schedule-map-link" data-stay-amap="${esc(stay.nav)}">高德导航</button>
            <button type="button" class="schedule-map-link" data-stay-baidu="${esc(stay.nav)}">百度导航</button>
          </div>
        </div>
      </li>`;
  }

  function addDepartureAdvice(card, day) {
    const host = card.querySelector(":scope > .day-toggle > span:first-child");
    if (!host) return;
    let badge = host.querySelector(":scope > .day-departure-advice");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "day-departure-advice";
      host.append(badge);
    }
    badge.textContent = `建议出发 ${DAY_DEPARTURES[day] || "按当日行程"}`;
    if (day === 4) badge.title = "建议时间按当前路线设置；悬空寺最终开园时间以官方当日公告为准";
  }

  function integrateStayIntoSchedule(card, day) {
    const detail = card.querySelector(":scope > .day-detail");
    const schedule = detail?.querySelector(":scope .schedule");
    if (!detail || !schedule) return;

    detail.querySelectorAll(".day-stay-integrated").forEach((node) => node.remove());
    schedule.querySelectorAll(".schedule-item--stay").forEach((node) => node.remove());

    const start = startForDay(day);
    const tonight = day <= 14 ? stayForNight(day) : null;
    if (start) schedule.insertAdjacentHTML("afterbegin", stayScheduleItem(day, start, "start"));
    if (tonight) schedule.insertAdjacentHTML("beforeend", stayScheduleItem(day, tonight, "night"));
  }

  function routeHotelRow(stay, role) {
    if (!stay) return "";
    const label = role === "start" ? "住宿起点" : "今晚住宿";
    return `
      <li class="daily-route-stop daily-route-stop--hotel" data-route-hotel="${role}">
        <span class="daily-route-stop__index">${role === "start" ? "住" : "宿"}</span>
        <button type="button" class="daily-route-stop__name" data-stay-amap="${esc(stay.nav)}">${esc(stay.name)}</button>
        <span class="daily-route-stop__status">${label}</span>
        <div class="daily-route-stop__actions">
          <button type="button" data-stay-amap="${esc(stay.nav)}">高德导航</button>
          <button type="button" data-stay-baidu="${esc(stay.nav)}">百度导航</button>
        </div>
      </li>`;
  }

  function buildInlineRoute(card, day) {
    const detail = card.querySelector(":scope > .day-detail");
    const toggle = card.querySelector(":scope > .day-toggle");
    if (!detail || !toggle) return;

    const routeNodes = [...card.querySelectorAll(".daily-route-topper")];
    if (!routeNodes.length) return;

    let source = routeNodes.find((node) => node.parentElement === card) || routeNodes[0];
    routeNodes.forEach((node) => { if (node !== source) node.remove(); });
    if (source.parentElement !== card) toggle.insertAdjacentElement("afterend", source);
    source.classList.add("daily-route-source");

    const attractionRows = [...source.querySelectorAll(".daily-route-stop[data-route-stop]")]
      .filter((row) => !CITY_ROUTE_IDS.has(row.dataset.routeStop || ""))
      .map((row) => row.outerHTML)
      .join("");

    const start = startForDay(day);
    const tonight = day <= 14 ? stayForNight(day) : null;
    const startHotel = day === 1 ? "" : routeHotelRow(start, "start");
    const nightHotel = tonight ? routeHotelRow(tonight, "night") : "";
    const count = (startHotel ? 1 : 0) + (nightHotel ? 1 : 0) + [...source.querySelectorAll(".daily-route-stop[data-route-stop]")].filter((row) => !CITY_ROUTE_IDS.has(row.dataset.routeStop || "")).length;

    let quick = detail.querySelector(":scope > .daily-route-quicknav");
    if (!quick) {
      quick = document.createElement("div");
      quick.className = "daily-route-quicknav";
    }
    const sourceActions = source.querySelector(".daily-route-actions");
    quick.innerHTML = `
      <div class="daily-route-quicknav__copy"><strong>一键多点导航</strong><small>按全天路线顺序交给地图App，途中仍以实时路况为准</small></div>
      ${sourceActions ? sourceActions.outerHTML : ""}`;

    let inline = detail.querySelector(":scope > .daily-route-inline");
    if (!inline) {
      inline = document.createElement("details");
      inline.className = "daily-route-inline";
    }
    inline.innerHTML = `
      <summary><span><b>当日路线地图</b><small>${count}个有效节点 · 仅保留景点与住宿</small></span><span class="daily-route-topper__chevron">⌄</span></summary>
      <div class="daily-route-inline__body">
        <div class="offline-daily-mini-map-host" data-offline-mini-day="${day}"></div>
        <p class="daily-route-note">城市级导航节点已隐藏，避免干扰。住宿作为出发/收尾节点；景点保留逐点高德、百度导航。</p>
        <ol class="daily-route-stops">${startHotel}${attractionRows}${nightHotel}</ol>
      </div>`;

    const photoAnchor = [...detail.children].find((node) => node !== inline && node !== quick && /摄影提示/.test(node.textContent || ""));
    if (photoAnchor) {
      detail.insertBefore(quick, photoAnchor);
      detail.insertBefore(inline, photoAnchor);
    } else {
      detail.append(quick, inline);
    }
    window.JMN_OFFLINE_MAP_API?.hydrateDay?.(day, inline);
  }

  function normalizeTimes(card) {
    card.querySelectorAll(".schedule-item").forEach((item) => {
      let time = item.querySelector(":scope > .schedule-time");
      if (!time) {
        time = document.createElement("span");
        time.className = "schedule-time";
        time.textContent = "建议时段";
        item.prepend(time);
      } else if (!time.textContent.trim()) {
        time.textContent = "建议时段";
      }
    });
  }

  function fixDay(card) {
    const day = Number(card.dataset.day);
    if (!day) return;
    addDepartureAdvice(card, day);
    integrateStayIntoSchedule(card, day);
    normalizeTimes(card);
    buildInlineRoute(card, day);
  }

  function apply() {
    document.querySelectorAll("#stays-section").forEach((section) => section.remove());
    document.querySelectorAll(".day-card[data-day]").forEach(fixDay);
    document.documentElement.dataset.itineraryUxFix = "1";
  }

  document.addEventListener("travel-data-ready", () => {
    window.setTimeout(apply, 40);
    window.setTimeout(apply, 500);
    window.setTimeout(apply, 1400);
    window.setTimeout(apply, 3400);
  });
  window.addEventListener("travel-view:shown", () => window.setTimeout(apply, 40));
  window.addEventListener("load", () => window.setTimeout(apply, 200), { once: true });
  document.addEventListener("click", (event) => {
    if (event.target.closest?.(".day-toggle")) window.setTimeout(apply, 20);
  });
  [0, 120, 450, 900, 1700, 3300, 5200].forEach((delay) => window.setTimeout(apply, delay));
})();