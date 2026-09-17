(() => {
  "use strict";

  const SHAPOTOU = {
    id: "shapotou-scenic",
    nameZh: "沙坡头旅游景区",
    name: "沙坡头旅游景区",
    address: "宁夏回族自治区中卫市沙坡头区腾格里沙漠南缘",
    geo: { lat: 37.531873, lng: 104.991480 },
    amap: { poiId: "B07A10048L" }
  };

  const DAY13 = {
    day: 13,
    date: "2026-10-06",
    title: "中卫｜高庙·66号公路·黄河沿线",
    locations: ["中卫高庙", "66号公路", "黄河沿线", "北长滩（可选）", "沙坡头赠票确认"],
    schedule: [
      { id: "d13-gaomiao", time: "上午", type: "attraction", text: "中卫高庙，住市区可从容安排。", placeId: "zhongwei-gaomiao" },
      { id: "d13-route66", time: "中午—下午", type: "attraction", text: "中卫66号公路；只在合法、安全位置停车拍照，不站在车道中央。", placeId: "zhongwei-route66" },
      { id: "d13-yellow-river", time: "下午", type: "free", text: "沿黄河方向机动游览；北长滩只在道路、时间与体力都允许时前往。" },
      { id: "d13-return", time: "傍晚前", type: "drive", text: "返回中卫入住，尽量不要拖到太晚，为次日沙坡头早场留体力。", placeId: "zhongwei" },
      { id: "d13-shapotou-ticket", time: "入住后", type: "note", text: "10月6日晚住宿酒店赠送沙坡头景区门票。计划10月7日早晨使用；入住时确认赠票适用日期、实名/换票方式，以及是否仅含景区首道门票，景区内体验项目是否另付费。" }
    ]
  };

  const DAY14 = {
    day: 14,
    date: "2026-10-07",
    title: "中卫→沙坡头→银川｜宁夏博物馆·览山日落",
    locations: ["沙坡头旅游景区", "宁夏博物馆", "览山公园", "怀远夜市", "银川"],
    schedule: [
      { id: "d14-checkout", time: "07:15左右", type: "rest", text: "早餐、退房，把行李装车；使用酒店赠送的沙坡头景区门票。" },
      { id: "d14-shapotou", time: "08:00—10:30", type: "attraction", text: "沙坡头旅游景区。优先黄河与沙漠交汇核心景观，10:30左右止损离园，避免挤压银川下午行程；具体赠票权益和国庆末日项目运营以前一晚确认结果为准。", placeId: "shapotou-scenic" },
      { id: "d14-drive", time: "10:30—13:15左右", type: "drive", text: "沙坡头出发返回银川，途中简单午餐；国庆最后一天给高速返程车流留缓冲。", placeIds: ["shapotou-scenic", "ningxia-museum"] },
      { id: "d14-museum", time: "13:30—16:00", type: "attraction", text: "宁夏博物馆已从10月8日移到今天中午后。重点串联宁夏历史、西夏、岩画与丝路脉络；如沙坡头或高速延误，优先保证在闭馆前留出完整参观时间。", placeId: "ningxia-museum" },
      { id: "d14-hotel", time: "16:00—16:40", type: "rest", text: "银川入住/放行李，短暂休息。", placeId: "yinchuan" },
      { id: "d14-lanshan", time: "日落前", type: "attraction", text: "览山公园看贺兰山方向日落；如临时关闭或前段明显延误，直接进入晚餐/夜市。", placeId: "lanshan-park" },
      { id: "d14-market", time: "夜间", type: "attraction", text: "怀远夜市，作为最后一晚的轻松收尾。", placeId: "huaiyuan-night-market" }
    ],
    notes: ["10月7日的核心顺序固定为：沙坡头早场→宁夏博物馆→览山日落；沙坡头10:30左右离园是保护后半天行程的关键止损点。"]
  };

  const DAY15 = {
    day: 15,
    date: "2026-10-08",
    title: "银川｜还车·返程",
    locations: ["银川", "银川河东国际机场"],
    schedule: [
      { id: "d15-breakfast", time: "07:30—08:30", type: "rest", text: "早餐、整理行李并检查证件、充电设备和随身物品。" },
      { id: "d15-fuel", time: "08:30—09:30", type: "drive", text: "按租车规则补足燃油，检查车身、轮毂、内饰、油表、ETC和停车费。", placeId: "yinchuan" },
      { id: "d15-airport", time: "09:30左右", type: "drive", text: "前往银川河东机场服务点，为10:30还车预留缓冲。", placeIds: ["yinchuan", "yinchuan-airport"] },
      { id: "d15-return-car", time: "当前订单10:30", type: "return", text: "银川河东机场服务点还车；宁夏博物馆已移至10月7日，因此不再与当前还车时间冲突。", placeId: "yinchuan-airport" },
      { id: "d15-flight", time: "待确认", type: "flight", text: "银川飞返上海；航司、航班号与起降时间待确认。" }
    ]
  };

  const ROUTE_UPDATES = {
    13: ["zhongwei", "zhongwei-gaomiao", "zhongwei-route66", "zhongwei"],
    14: ["zhongwei", "shapotou-scenic", "ningxia-museum", "yinchuan", "lanshan-park", "huaiyuan-night-market", "yinchuan"],
    15: ["yinchuan", "yinchuan-airport"]
  };

  function upsert(list, item) {
    if (!Array.isArray(list)) return;
    const index = list.findIndex((entry) => entry?.id === item.id);
    if (index >= 0) list[index] = { ...list[index], ...item };
    else list.push(item);
  }

  function replaceDay(data, replacement) {
    if (!Array.isArray(data.days)) return;
    const index = data.days.findIndex((day) => Number(day.day) === replacement.day);
    if (index >= 0) data.days[index] = { ...data.days[index], ...replacement };
    else data.days.push(replacement);
  }

  function patchSimpleRoutes(list) {
    if (!Array.isArray(list)) return;
    Object.entries(ROUTE_UPDATES).forEach(([day, placeIds]) => {
      const dayNumber = Number(day);
      const index = list.findIndex((route) => Number(route.day) === dayNumber);
      const route = { day: dayNumber, placeIds: [...placeIds] };
      if (index >= 0) list[index] = { ...list[index], ...route };
      else list.push(route);
    });
    list.sort((a, b) => Number(a.day) - Number(b.day));
  }

  function patchRouteMap(data) {
    const region = data?.routeMap?.regions?.find((item) => item.id === data.routeMap?.defaultRegionId) || data?.routeMap?.regions?.[0];
    if (!region) return;

    const existing = region.places?.find((place) => place.id === SHAPOTOU.id);
    const schematic = {
      id: SHAPOTOU.id,
      x: 555,
      y: 748,
      tx: 417,
      ty: 790,
      color: "#e77e22",
      anchor: "end",
      size: 24,
      lines: ["沙坡头"],
      query: "沙坡头旅游景区 宁夏中卫",
      geo: SHAPOTOU.geo,
      days: [14]
    };
    if (existing) Object.assign(existing, schematic);
    else (region.places ||= []).push(schematic);

    const museum = region.places?.find((place) => place.id === "ningxia-museum");
    if (museum) museum.days = [14];
    const airport = region.places?.find((place) => place.id === "yinchuan-airport");
    if (airport) airport.days = [15];

    Object.entries(ROUTE_UPDATES).forEach(([day, placeIds]) => {
      const dayNumber = Number(day);
      const index = (region.routes || []).findIndex((route) => Number(route.day) === dayNumber);
      if (index >= 0) region.routes[index] = { ...region.routes[index], placeIds: [...placeIds] };
    });
  }

  function patchTickets(data) {
    const items = data?.ticketPlanning?.items;
    if (!Array.isArray(items)) return;
    const museum = items.find((item) => item.id === "ticket-ningxia-museum");
    if (museum) {
      museum.day = 14;
      museum.guidance = "已移至10月7日中午后参观；按当期规则提前预约，并给沙坡头→银川转场留足国庆返程缓冲。";
    }
  }

  function apply(data) {
    if (!data || typeof data !== "object") return;

    data.places ||= [];
    upsert(data.places, SHAPOTOU);
    if (data.map) {
      data.map.places ||= [];
      upsert(data.map.places, { ...SHAPOTOU, countryCode: "CN" });
    }

    replaceDay(data, DAY13);
    replaceDay(data, DAY14);
    replaceDay(data, DAY15);

    patchSimpleRoutes(data.map?.routes);
    patchSimpleRoutes(data.map?.dailyRoutes);
    patchRouteMap(data);
    patchTickets(data);

    if (data.trip) {
      data.trip.routeSummary = "上海/南京分别出发，在太原汇合取车；经山西、内蒙古西行至乌海，10月3日从阿拉善英雄会梦想沙漠公园参加五湖/六湖穿越；10月6日晚住中卫并使用酒店赠送的沙坡头门票规划10月7日早场，随后回银川参观宁夏博物馆、览山日落，10月8日按现有10:30还车订单返程。";
    }

    data.issuesAndUncertainties = (data.issuesAndUncertainties || []).filter((item) => item.id !== "d15-museum-return-conflict" && item.id !== "shapotou-ticket-scope");
    data.issuesAndUncertainties.push({
      id: "shapotou-ticket-scope",
      status: "pending",
      text: "10月6日晚住宿酒店已赠送沙坡头景区门票；入住时仍需确认赠票适用日期、实名/换票方式，以及是否仅含景区首道门票和10月7日项目运营情况。"
    });
  }

  window.applyItineraryUpdate20260918B = apply;
  document.addEventListener("travel-data-ready", (event) => apply(event.detail));
  if (window.TRAVEL_PLAN_DATA) apply(window.TRAVEL_PLAN_DATA);
})();
