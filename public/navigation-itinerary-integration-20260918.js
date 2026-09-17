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
    { day: 13, name: "中卫一叶星空酒店", nav: "中卫一叶星空酒店", status: "已确认 · 赠沙坡头票" },
    { day: 14, name: "银川最后一晚酒店", nav: "银川", status: "待订" }
  ];

  const NAV_ITEMS = [
    { label: "总览", href: "#route", icon: "⌖" },
    { label: "每日行程", href: "#itinerary", icon: "日" },
    { label: "预约与门票", href: "#reservations", icon: "票" },
    { label: "待办事项", href: "#todo", icon: "□" },
    { label: "旅行前准备", href: "#prep", icon: "备" },
    { label: "实用贴士", href: "#tips", icon: "i" },
    { label: "已确认预订", href: "#bookings", icon: "✓" }
  ];

  const TICKET_REMINDERS = [
    {
      key: "yungang",
      re: /云冈石窟/,
      label: "9月13日起",
      at: "2026-09-13T00:00:00+08:00",
      action: "立即完成实名预约",
      kind: "官方规则",
      detail: "9月28日参观。自2026年4月15日起可提前15日（不含当日）预约；所有游客，包括政策性免票人员，都需要提前实名预约。官方公告未写固定放票钟点。"
    },
    {
      key: "hanging-temple",
      re: /悬空寺/,
      label: "9月20日 07:20",
      at: "2026-09-20T07:20:00+08:00",
      action: "抢登临票",
      kind: "官方规则",
      detail: "9月27日参观。线上每日07:20—21:00可预订7日内登临票，数量严格限量。5人同行建议提前完成购票账号与人脸核验准备。"
    },
    {
      key: "shanxi-museum",
      re: /山西博物院/,
      label: "9月22日 20:00",
      at: "2026-09-22T20:00:00+08:00",
      action: "抢免费预约",
      kind: "官方规则",
      detail: "9月25日参观。新版预约系统在参观日前3天20:00放票；如果首轮未约到，参观当日08:00还有一轮预约机会。"
    },
    {
      key: "inner-mongolia-museum",
      re: /内蒙古博物院/,
      label: "9月23日 20:00",
      at: "2026-09-23T20:00:00+08:00",
      action: "预约9月30日入馆",
      kind: "官方规则",
      detail: "可提前7日预约；公开的2026预约规则显示每日20:00开放第七日名额。通过官网、微信公众号或“云游内博”小程序办理。"
    },
    {
      key: "iron-flower",
      re: /打铁花|忻州古城/,
      label: "现在起有票就锁",
      at: "2026-09-18T00:00:00+08:00",
      action: "优先确认20:30场",
      kind: "行程建议",
      detail: "演出场次和售票规则以忻州古城官方当天发布为准。9月25日正值假期客流期，建议不要等到现场再决定。"
    },
    {
      key: "tengger",
      re: /腾格里|五湖|六湖|沙漠/,
      label: "现在就确认",
      at: "2026-09-18T00:00:00+08:00",
      action: "锁定正规穿越运营方",
      kind: "行程建议",
      detail: "这不是景区固定放票时点。10月3日处于国庆高峰，建议尽快把集合点、运营车辆、司机、返程停车点和取消规则一次确认清楚。"
    },
    {
      key: "xixia",
      re: /西夏陵|西夏王陵/,
      label: "建议9月27日前",
      at: "2026-09-27T09:00:00+08:00",
      action: "完成门票/预约确认",
      kind: "行程建议",
      detail: "10月4日参观，国庆客流较高。当前公开信息未见固定放票钟点，因此这里给出的是行程锁定建议，不作为官方放票时刻。"
    },
    {
      key: "ningxia-museum",
      re: /宁夏博物馆/,
      label: "10月4日起",
      at: "2026-10-04T00:00:00+08:00",
      action: "实名预约10月7日",
      kind: "官方规则",
      detail: "宁夏博物馆公开规则为可提前3天在官方微信公众号实名预约，每天限量。公开公告未注明固定放票钟点，10月4日进入预约窗口后尽早处理。"
    }
  ];

  const D1_START = { name: "太原武宿国际机场T2（集合起点）", nav: "太原武宿国际机场 T2", status: "上海/南京汇合" };
  const esc = (value = "") => String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
  const amapSearch = (query) => `https://uri.amap.com/search?keyword=${encodeURIComponent(query)}&src=jin-meng-ning-trip&callnative=1`;
  const baiduSearch = (query) => `https://map.baidu.com/search/${encodeURIComponent(query)}`;

  function normalizeBookingIds() {
    const duplicates = [...document.querySelectorAll("section#bookings")];
    const reservation = duplicates.find((section) => /预约与门票/.test(section.querySelector("h2")?.textContent || ""))
      || document.querySelector("section.booking-section");
    const confirmed = duplicates.find((section) => /已确认预订/.test(section.querySelector("h2")?.textContent || ""));

    if (reservation) {
      reservation.id = "reservations";
      reservation.setAttribute("aria-labelledby", "reservations-title");
      const title = reservation.querySelector("h2");
      if (title) title.id = "reservations-title";
    }
    if (confirmed) confirmed.id = "bookings";
  }

  function splitTodoAndPrep() {
    const prep = document.querySelector("#prep");
    if (!prep) return;
    let todo = document.querySelector("#todo");
    const form = prep.querySelector("#todo-form");
    const list = prep.querySelector("#todo-list");
    const progress = prep.querySelector("#todo-progress");

    if (!todo && (form || list)) {
      todo = document.createElement("section");
      todo.className = "section todo-section smart-nav-section";
      todo.id = "todo";
      todo.setAttribute("aria-labelledby", "todo-title");
      todo.innerHTML = `
        <div class="section-heading">
          <div><p class="section-kicker">TO DO</p><h2 id="todo-title">待办事项</h2></div>
          <span class="soft-label" data-todo-progress-slot></span>
        </div>
        <p class="smart-section-intro">临出发前需要真正完成、打勾的事项集中放在这里。</p>
        <div class="todo-mount"></div>`;
      prep.parentElement?.insertBefore(todo, prep);
      const mount = todo.querySelector(".todo-mount");
      if (form) mount?.append(form);
      if (list) mount?.append(list);
      const slot = todo.querySelector("[data-todo-progress-slot]");
      if (progress && slot) slot.replaceWith(progress);
    }

    if (!prep.querySelector(".travel-prep-grid")) {
      const intro = document.createElement("div");
      intro.className = "travel-prep-grid";
      intro.innerHTML = `
        <article><b>证件与订单</b><p>身份证、驾驶证、租车订单、航班订单、酒店订单集中留一份离线截图；悬空寺、云冈、博物馆等预约凭证单独收藏。</p></article>
        <article><b>车辆与导航</b><p>每天出发前看油量、胎压提示和停车信息。高德为主、百度备用；山区、草原、沙漠段提前缓存关键地点。</p></article>
        <article><b>衣物与天气</b><p>晋北、草原和沙漠昼夜温差明显，按分层穿衣准备。防风外套、舒适步行鞋、防晒与补水用品放在随手可取的位置。</p></article>
        <article><b>多人协同</b><p>5人4司机建议每天明确主驾、替补驾和集合时间；门票、停车点、酒店地址统一在群里置顶，避免各自搜索到不同入口。</p></article>`;
      const heading = prep.querySelector(".section-heading");
      heading?.insertAdjacentElement("afterend", intro);
      const prepLabel = prep.querySelector(".soft-label");
      if (prepLabel && prepLabel.id !== "todo-progress") prepLabel.textContent = "CHECKLIST";
    }
  }

  function rebuildMenu() {
    const details = document.querySelector("#travel-navigation");
    const summary = document.querySelector("#travel-navigation-trigger");
    const menu = document.querySelector(".travel-navigation-menu");
    if (!details || !summary || !menu) return;

    details.hidden = false;
    summary.innerHTML = '<span class="nav-summary-main">旅行手册</span><span class="nav-summary-sub">快速导航 · 7项</span><span class="nav-summary-chevron" aria-hidden="true">▾</span>';
    summary.setAttribute("aria-label", "展开旅行手册快速导航");
    summary.setAttribute("aria-expanded", String(details.open));

    menu.innerHTML = `
      <div class="travel-navigation-menu__intro" role="presentation"><strong>快速导航</strong><small>按页面模块顺序直接跳转</small></div>
      ${NAV_ITEMS.map((item) => `<a href="${item.href}" role="menuitem" data-smart-nav="1"><span class="smart-nav-icon" aria-hidden="true">${item.icon}</span><span>${item.label}</span></a>`).join("")}`;
  }

  function stayForNight(day) {
    return STAYS.find((item) => item.day === Number(day)) || null;
  }

  function startForDay(day) {
    if (Number(day) === 1) return D1_START;
    return stayForNight(Number(day) - 1);
  }

  function stayRow(label, stay, extraClass = "") {
    if (!stay) return `
      <div class="day-stay-row ${extraClass}">
        <span class="day-stay-row__label">${esc(label)}</span>
        <div><strong>无住宿 · 当日返程</strong><small>完成还车后按各自航班返程</small></div>
      </div>`;
    return `
      <div class="day-stay-row ${extraClass}">
        <span class="day-stay-row__label">${esc(label)}</span>
        <div class="day-stay-row__copy"><strong>${esc(stay.name)}</strong><small>${esc(stay.status || "")}</small></div>
        <div class="day-stay-row__actions">
          <button type="button" data-stay-amap="${esc(stay.nav)}">高德</button>
          <button type="button" data-stay-baidu="${esc(stay.nav)}">百度</button>
        </div>
      </div>`;
  }

  function integrateStaysIntoDays() {
    document.querySelectorAll("#stays-section").forEach((section) => section.remove());

    document.querySelectorAll(".day-card[data-day]").forEach((card) => {
      const day = Number(card.dataset.day);
      const detail = card.querySelector(":scope > .day-detail");
      if (!day || !detail) return;
      const start = startForDay(day);
      const tonight = day <= 14 ? stayForNight(day) : null;

      let panel = detail.querySelector(":scope > .day-stay-integrated");
      if (!panel) {
        panel = document.createElement("div");
        panel.className = "day-stay-integrated";
        detail.prepend(panel);
      }
      panel.innerHTML = `${stayRow(day === 1 ? "今日集合起点" : "今日起点 · 昨晚住宿", start, "is-start")}${stayRow("今晚住宿", tonight, "is-night")}`;

      const routeDetails = card.querySelector(":scope > .daily-route-topper");
      if (routeDetails && routeDetails.parentElement !== detail) {
        panel.insertAdjacentElement("afterend", routeDetails);
      }

      const list = detail.querySelector(".daily-route-stops");
      if (list && start && !list.querySelector(".day-stay-route-start")) {
        const li = document.createElement("li");
        li.className = "daily-route-stop day-stay-route-start";
        li.innerHTML = `
          <span class="daily-route-stop__index">起</span>
          <button type="button" class="daily-route-stop__name" data-stay-amap="${esc(start.nav)}">${esc(start.name)}</button>
          <span class="daily-route-stop__status">每日行程起点</span>
          <div class="daily-route-stop__actions"><button type="button" data-stay-amap="${esc(start.nav)}">高德导航</button><button type="button" data-stay-baidu="${esc(start.nav)}">百度导航</button></div>`;
        list.prepend(li);
      }
      const routeNote = detail.querySelector(".daily-route-note");
      if (routeNote && !routeNote.dataset.stayStartNote) {
        routeNote.dataset.stayStartNote = "1";
        routeNote.textContent = `今日路线从${day === 1 ? "机场集合点" : "昨晚住宿酒店"}开始。${routeNote.textContent}`;
      }
    });
  }

  function reminderState(reminder) {
    const target = new Date(reminder.at).getTime();
    const now = Date.now();
    if (!Number.isFinite(target)) return "请尽快处理";
    if (now >= target) return reminder.kind === "官方规则" ? "窗口已开放" : "建议现在处理";
    const days = Math.floor((target - now) / 86400000);
    const hours = Math.floor(((target - now) % 86400000) / 3600000);
    if (days > 0) return `${days}天后提醒`;
    if (hours > 0) return `${hours}小时后提醒`;
    return "即将开始";
  }

  function reminderMarkup(reminder, compact = false) {
    return `
      <div class="ticket-order-reminder${compact ? " is-compact" : ""}" data-reminder-key="${esc(reminder.key)}">
        <div class="ticket-order-reminder__time"><span>${esc(reminder.label)}</span><small>${esc(reminderState(reminder))}</small></div>
        <div class="ticket-order-reminder__copy"><strong>${esc(reminder.action)}</strong>${compact ? "" : `<p>${esc(reminder.detail)}</p>`}</div>
        <em class="ticket-order-reminder__kind">${esc(reminder.kind)}</em>
      </div>`;
  }

  function enhanceReservations() {
    const section = document.querySelector("#reservations");
    if (!section) return;
    const cards = [...section.querySelectorAll(".booking-card")];
    const matched = [];

    cards.forEach((card) => {
      const text = card.textContent || "";
      const reminder = TICKET_REMINDERS.find((item) => item.re.test(text));
      card.classList.add("reservation-card--timed");
      card.querySelectorAll(":scope > .ticket-order-reminder").forEach((node) => node.remove());
      if (!reminder) return;
      matched.push(reminder);
      card.insertAdjacentHTML("beforeend", reminderMarkup(reminder));
    });

    let board = section.querySelector(".reservation-reminder-board");
    if (!board) {
      board = document.createElement("div");
      board.className = "reservation-reminder-board";
      const heading = section.querySelector(".section-heading");
      heading?.insertAdjacentElement("afterend", board);
    }

    const seen = new Set();
    const reminders = matched.filter((item) => !seen.has(item.key) && seen.add(item.key));
    const ordered = reminders.sort((a, b) => {
      const aOpen = Date.now() >= new Date(a.at).getTime() ? 0 : 1;
      const bOpen = Date.now() >= new Date(b.at).getTime() ? 0 : 1;
      if (aOpen !== bOpen) return aOpen - bOpen;
      return new Date(a.at) - new Date(b.at);
    });
    board.innerHTML = `
      <div class="reservation-reminder-board__head"><div><span>下单 / 抢票提醒</span><strong>先看时间，再处理门票</strong></div><small>按2026-09-18前可核实的公开规则整理；官方临时调整优先</small></div>
      <div class="reservation-reminder-board__grid">${ordered.slice(0, 4).map((item) => reminderMarkup(item, true)).join("")}</div>`;
  }

  function compactConfirmedBookings() {
    const section = document.querySelector("#bookings");
    if (!section || !/已确认预订/.test(section.querySelector("h2")?.textContent || "")) return;

    const cards = [...section.querySelectorAll(".booking-card")];
    let flightCount = 0;
    let rentalCount = 0;
    cards.forEach((card) => {
      const type = card.querySelector(".booking-card__top span")?.textContent?.trim() || "";
      card.classList.add("booking-card--compact");
      if (/酒店/.test(type)) {
        card.hidden = true;
        card.setAttribute("aria-hidden", "true");
      } else {
        card.hidden = false;
        card.removeAttribute("aria-hidden");
        if (/机票|航班/.test(type)) flightCount += 1;
        if (/租车/.test(type)) rentalCount += 1;
      }
    });

    let summary = section.querySelector(".confirmed-booking-summary");
    if (!summary) {
      summary = document.createElement("div");
      summary.className = "confirmed-booking-summary";
      section.querySelector(".section-heading")?.insertAdjacentElement("afterend", summary);
    }
    const confirmedNights = STAYS.filter((item) => item.status.startsWith("已确认")).length;
    const pendingNights = STAYS.filter((item) => item.status === "确认中").length;
    const openNights = STAYS.filter((item) => item.status === "待订").length;
    summary.innerHTML = `
      <div><span>交通</span><strong>${flightCount || 1}项航班已确认 · ${rentalCount || 1}项租车已确认</strong></div>
      <div><span>住宿</span><strong>${confirmedNights}晚已确认 · ${pendingNights}晚确认中 · ${openNights}晚待订</strong><small>酒店详细信息统一放在每日行程展开后查看</small></div>
      <div class="confirmed-booking-summary__pending"><span>待出票</span><strong>南京 MU2909</strong><small>当前仅为已选航班，不计入“已确认”</small></div>`;

    const selected = document.querySelector("#selected-transport");
    if (selected) {
      selected.hidden = true;
      selected.setAttribute("aria-hidden", "true");
    }
  }

  function reorderCoreSections() {
    const itinerary = document.querySelector("#itinerary");
    if (!itinerary) return;
    const sequence = [
      document.querySelector("#reservations"),
      document.querySelector("#todo"),
      document.querySelector("#prep"),
      document.querySelector("#tips"),
      document.querySelector("#bookings"),
      document.querySelector("#selected-transport"),
      document.querySelector("#enh-guide")
    ].filter(Boolean);
    let cursor = itinerary;
    sequence.forEach((section) => {
      if (section === cursor || cursor.nextElementSibling === section) {
        cursor = section;
        return;
      }
      cursor.insertAdjacentElement("afterend", section);
      cursor = section;
    });
  }

  function apply() {
    normalizeBookingIds();
    splitTodoAndPrep();
    rebuildMenu();
    integrateStaysIntoDays();
    enhanceReservations();
    compactConfirmedBookings();
    reorderCoreSections();
    document.documentElement.dataset.smartTravelNav = "2";
  }

  document.addEventListener("toggle", (event) => {
    if (event.target?.id === "travel-navigation") {
      document.querySelector("#travel-navigation-trigger")?.setAttribute("aria-expanded", String(event.target.open));
    }
  }, true);

  document.addEventListener("click", (event) => {
    const nav = event.target.closest?.(".travel-navigation-menu a[data-smart-nav]");
    if (nav) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const target = document.querySelector(nav.getAttribute("href"));
      document.querySelector("#travel-navigation")?.removeAttribute("open");
      if (target) {
        history.pushState({ view: "travel" }, "", nav.getAttribute("href"));
        window.requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "smooth" }));
      }
      return;
    }

    const amap = event.target.closest?.("[data-stay-amap]");
    if (amap) {
      event.preventDefault();
      window.open(amapSearch(amap.dataset.stayAmap || ""), "_blank", "noopener,noreferrer");
      return;
    }
    const baidu = event.target.closest?.("[data-stay-baidu]");
    if (baidu) {
      event.preventDefault();
      window.open(baiduSearch(baidu.dataset.stayBaidu || ""), "_blank", "noopener,noreferrer");
    }
  }, true);

  const scrollKnownHash = () => {
    const target = NAV_ITEMS.find((item) => item.href === location.hash);
    if (!target) return;
    window.setTimeout(() => document.querySelector(target.href)?.scrollIntoView({ block: "start" }), 80);
  };

  document.addEventListener("travel-data-ready", () => {
    apply();
    window.setTimeout(apply, 120);
    window.setTimeout(apply, 700);
  });
  window.addEventListener("travel-view:shown", apply);
  window.addEventListener("hashchange", scrollKnownHash);
  window.addEventListener("popstate", scrollKnownHash);
  window.addEventListener("load", () => {
    apply();
    scrollKnownHash();
  }, { once: true });
  [0, 80, 250, 700, 1500, 3000].forEach((delay) => window.setTimeout(apply, delay));
})();