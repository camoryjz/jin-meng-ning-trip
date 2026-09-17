(() => {
  "use strict";

  const NJ_JOURNEY_ID = "flight-outbound-nanjing";
  const NJ_FLIGHT_ID = "flight-outbound-nanjing-1";
  const LATEST_STAYS = [
    [1, "太原"], [2, "忻州"], [3, "浑源"], [4, "大同"], [5, "大同"],
    [6, "呼和浩特"], [7, "希拉穆仁草原"], [8, "巴彦淖尔"], [9, "乌海"],
    [10, "银川"], [11, "银川"], [12, "中卫"], [13, "中卫"], [14, "银川"]
  ];
  let observer = null;

  const esc = (value = "") => String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);

  function addNanjingFlight(data) {
    data.flightJourneys ||= [];
    data.flights ||= [];

    if (!data.flightJourneys.some((item) => item.id === NJ_JOURNEY_ID)) {
      data.flightJourneys.splice(1, 0, {
        id: NJ_JOURNEY_ID,
        title: "9月24日｜南京禄口 → 太原",
        status: "selected",
        bookingStatus: "not-ticketed",
        note: "来自当前机票搜索截图，尚未提供出票/订单确认信息。"
      });
    }

    if (!data.flights.some((item) => item.id === NJ_FLIGHT_ID)) {
      data.flights.push({
        id: NJ_FLIGHT_ID,
        journeyId: NJ_JOURNEY_ID,
        sequence: 1,
        airline: {
          name: "China Eastern Airlines",
          nameZh: "中国东方航空"
        },
        flightNumber: "MU2909",
        departure: {
          airportCode: "NKG",
          city: "南京",
          airportName: "禄口国际机场",
          terminal: "T2",
          date: "2026-09-24",
          time: "07:40",
          utcOffset: "+08:00"
        },
        arrival: {
          airportCode: "TYN",
          city: "太原",
          airportName: "武宿国际机场",
          terminal: "T2",
          date: "2026-09-24",
          time: "09:40",
          utcOffset: "+08:00"
        },
        duration: "2小时",
        cabin: "经济舱",
        aircraft: "中机型",
        baggage: "托运行李额20KG",
        bookingStatus: "not-ticketed",
        fareReference: "截图参考：¥484起；中国东方航空官方直营截图价¥490；价格未锁定。",
        bookingNote: "截图中的¥484特价标注限1—3人可订；本行程5位成人，下单时需重新核验5人同订价格，必要时分单或改选其他价格。"
      });
    }
  }

  function patchDayOne(data) {
    const day = (data.days || []).find((item) => Number(item.day) === 1);
    if (!day) return;

    day.title = "上海/南京→太原｜晋祠·太原植物园";
    day.locations = ["太原武宿国际机场", "晋祠", "太原植物园"];

    const remaining = (day.schedule || []).filter((item) => !["d1-flight", "d1-flight-shanghai", "d1-flight-nanjing", "d1-meet"].includes(item.id));
    day.schedule = [
      {
        id: "d1-flight-shanghai",
        time: "07:00—09:10",
        type: "flight",
        text: "上海组｜FM9139 上海航空：07:00上海虹桥国际机场T2起飞，09:10抵达太原武宿国际机场T2。"
      },
      {
        id: "d1-flight-nanjing",
        time: "07:40—09:40",
        type: "flight",
        text: "南京组｜MU2909 中国东方航空：07:40南京禄口国际机场T2起飞，09:40抵达太原武宿国际机场T2；经济舱，托运行李额20KG。当前仅有选购截图，尚未标记为已出票。"
      },
      {
        id: "d1-meet",
        time: "09:40—10:30",
        type: "rest",
        text: "5人在太原武宿国际机场T2汇合，取行李后统一前往租车服务点。"
      },
      ...remaining
    ];
  }

  function candidateMarkup(data) {
    const journey = (data.flightJourneys || []).find((item) => item.id === NJ_JOURNEY_ID);
    const flight = (data.flights || []).find((item) => item.id === NJ_FLIGHT_ID);
    if (!journey || !flight) return "";
    return `
      <section class="section terminal-selected-flight" id="selected-transport">
        <div class="section-heading">
          <div><p class="section-kicker">SELECTED · NOT TICKETED</p><h2>南京出发机票</h2></div>
          <span class="soft-label">待购买</span>
        </div>
        <div class="booking-grid">
          <article class="booking-card">
            <div class="booking-card__top"><span>候选航班</span><b style="color:#9c6500;background:#fff4d9">待出票</b></div>
            <h3>${esc(`${flight.airline.nameZh} ${flight.flightNumber}`)}</h3>
            <div class="booking-row"><span>时间</span><strong>2026-09-24 07:40 → 09:40 · 北京时间</strong></div>
            <div class="booking-row"><span>航线</span><strong>南京禄口国际机场T2 → 太原武宿国际机场T2</strong></div>
            <div class="booking-row"><span>舱位</span><strong>${esc(`${flight.cabin} · ${flight.baggage} · ${flight.aircraft}`)}</strong></div>
            <div class="booking-row"><span>价格</span><strong>截图参考¥484起；东航官方直营截图价¥490，未锁价</strong></div>
            <p class="booking-note">截图中的¥484特价标注“限1—3人可订”。本次为5位成人，正式下单时需要重新核验5人同订价格；如该特价仍有限购，可能需要分单或改选其他价格。当前截图属于选购页面，不作为已出票凭证。</p>
          </article>
        </div>
      </section>
    `;
  }

  function mountCandidate(data) {
    if (document.querySelector("#selected-transport")) return true;
    const html = candidateMarkup(data);
    if (!html) return false;
    const bookings = document.querySelector("#bookings");
    const itinerary = document.querySelector("#itinerary");
    if (bookings) {
      bookings.insertAdjacentHTML("afterend", html);
      return true;
    }
    if (itinerary) {
      itinerary.insertAdjacentHTML("beforebegin", html);
      return true;
    }
    return false;
  }

  function ensureCandidateSection(data) {
    if (mountCandidate(data)) return;
    if (observer) observer.disconnect();
    observer = new MutationObserver(() => {
      if (mountCandidate(data)) {
        observer.disconnect();
        observer = null;
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => {
      if (observer) {
        mountCandidate(data);
        observer.disconnect();
        observer = null;
      }
    }, 4000);
  }

  function refreshStayPanel() {
    const panel = document.querySelector(".stay-panel");
    if (!panel) return false;
    const header = panel.querySelector(".stay-panel__header span");
    if (header) header.textContent = "14晚 · 酒店名称以已确认订单为准";
    const grid = panel.querySelector(".stay-grid");
    if (grid) {
      grid.innerHTML = LATEST_STAYS.map(([day, place]) => `
        <button type="button" class="stay-chip terminal-place-button" data-terminal-place="${esc(place)}">
          <span>D${day}</span><strong>${esc(place)}</strong>
        </button>
      `).join("");
    }
    return true;
  }

  function scheduleStayRefresh() {
    [50, 250, 700, 1500].forEach((delay) => window.setTimeout(refreshStayPanel, delay));
  }

  function apply(data) {
    if (!data || typeof data !== "object") return;

    if (typeof window.applyLatestItinerary20260918 === "function") {
      window.applyLatestItinerary20260918(data);
    }

    if (data.trip) {
      data.trip.groupSize = 5;
      data.trip.routeSummary = "上海/南京分别出发，在太原汇合取车；经山西、内蒙古西行至乌海，10月3日从阿拉善英雄会梦想沙漠公园参加五湖/六湖穿越，随后进入宁夏，10月8日在银川还车返程。";
    }
    addNanjingFlight(data);
    patchDayOne(data);
    setTimeout(() => ensureCandidateSection(data), 0);
    scheduleStayRefresh();
  }

  document.addEventListener("travel-data-ready", (event) => apply(event.detail));
  if (window.TRAVEL_PLAN_DATA) apply(window.TRAVEL_PLAN_DATA);
})();