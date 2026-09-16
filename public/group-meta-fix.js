(() => {
  "use strict";

  const NJ_JOURNEY_ID = "flight-outbound-nanjing";
  const NJ_FLIGHT_ID = "flight-outbound-nanjing-1";

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

  function apply(data) {
    if (!data || typeof data !== "object") return;
    if (data.trip) {
      data.trip.groupSize = 5;
      data.trip.routeSummary = "上海/南京分别出发，在太原汇合取车，沿山西—内蒙古—宁夏一路自驾至银川；主方案10月7日银川还车后返程，10月8日返程为次选。";
    }
    addNanjingFlight(data);
    patchDayOne(data);
  }

  document.addEventListener("travel-data-ready", (event) => apply(event.detail));
  if (window.TRAVEL_PLAN_DATA) apply(window.TRAVEL_PLAN_DATA);
})();
