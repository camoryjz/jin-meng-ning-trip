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

  const ACCOMMODATIONS = [
    {
      id: "stay-d1-taiyuan-wyndham",
      name: "太原温德姆酒店（山西博物院店）",
      city: "太原",
      checkIn: "2026-09-24",
      checkOut: "2026-09-25",
      status: "confirmed",
      confirmed: true,
      address: "山西省太原市万柏林区文兴路33号",
      amountCNY: 1574,
      note: "订单已确认；截图显示预订成功后不可取消或修改。"
    },
    {
      id: "stay-d2-xinzhou-starway",
      name: "星程忻州古城北门酒店",
      city: "忻州",
      checkIn: "2026-09-25",
      checkOut: "2026-09-26",
      status: "confirmed",
      confirmed: true,
      address: "忻州古城北门附近·北关大街七贤巷",
      rooms: 3,
      amountCNY: 1079.43,
      note: "商务大床房3间；截图显示9月25日12:00前可免费取消。"
    },
    {
      id: "stay-d3-hunyuan-hengshan",
      name: "恒山驿馆（浑源古城店）",
      city: "浑源",
      checkIn: "2026-09-26",
      checkOut: "2026-09-27",
      status: "confirmed",
      confirmed: true,
      address: "山西省大同市浑源县永安镇西顺街钟楼北巷17号",
      rooms: 3,
      amountCNY: 936,
      note: "1晚3间；截图显示离店后付。"
    },
    {
      id: "stay-d4d5-datong-intercity",
      name: "大同东信广场城际酒店",
      city: "大同",
      checkIn: "2026-09-27",
      checkOut: "2026-09-29",
      status: "confirmed",
      confirmed: true,
      amountCNY: 2268.08,
      note: "连续入住2晚；截图显示9月27日18:00前可免费取消。"
    },
    {
      id: "stay-d6-hohhot-intercity",
      name: "呼和浩特东站内蒙古博物院城际酒店",
      city: "呼和浩特",
      checkIn: "2026-09-29",
      checkOut: "2026-09-30",
      status: "confirmed",
      confirmed: true,
      rooms: 3,
      amountCNY: 1163.37,
      note: "城际豪华双床房3间；次日上午衔接内蒙古博物院。"
    },
    {
      id: "stay-d7-xilamuren-saibei",
      name: "塞北驿站（希拉穆仁草原安答店）",
      city: "希拉穆仁",
      checkIn: "2026-09-30",
      checkOut: "2026-10-01",
      status: "confirmed",
      confirmed: true,
      address: "内蒙古自治区包头市达茂旗希拉穆仁镇巴彦淖尔嘎查塞北驿站",
      rooms: 3,
      note: "两笔组合订单合计按3间房记录。"
    },
    {
      id: "stay-d8-bayannur-yunqi",
      name: "云栖酒店（摩尔城店）",
      city: "巴彦淖尔",
      checkIn: "2026-10-01",
      checkOut: "2026-10-02",
      status: "confirmed",
      confirmed: true,
      address: "内蒙古自治区巴彦淖尔市临河区新华东街天正欢乐城A座1楼",
      rooms: 2,
      amountCNY: 566.42,
      note: "已确认是巴彦淖尔临河区店；酒店页面显示免费停车场。"
    },
    {
      id: "stay-d9-wuhai-orange",
      name: "乌海海勃湾区桔子水晶酒店",
      city: "乌海",
      checkIn: "2026-10-02",
      checkOut: "2026-10-03",
      status: "confirmed",
      confirmed: true,
      rooms: 3,
      amountCNY: 1847.54,
      note: "两笔订单合计3间房。"
    },
    {
      id: "stay-d10d11-yinchuan-joffre",
      name: "银川鼓楼喆啡锐品酒店",
      city: "银川",
      checkIn: "2026-10-03",
      checkOut: "2026-10-05",
      status: "pending",
      confirmed: false,
      address: "宁夏回族自治区银川市文化西街58号",
      rooms: 3,
      amountCNY: 2940,
      note: "当前订单页面仍显示确认中，待用户补充最新确认页。"
    },
    {
      id: "stay-d12-zhongwei-manyun",
      name: "沙坡漫芸酒店（中卫鼓楼向阳步行街店）",
      city: "中卫",
      checkIn: "2026-10-05",
      checkOut: "2026-10-06",
      status: "confirmed",
      confirmed: true,
      amountCNY: 1247,
      note: "截图显示10月5日18:00前可免费取消。"
    },
    {
      id: "stay-d13-zhongwei-starry",
      name: "中卫一叶星空酒店",
      city: "中卫",
      checkIn: "2026-10-06",
      checkOut: "2026-10-07",
      status: "confirmed",
      confirmed: true,
      address: "沙坡头景区时空之门向西881米",
      rooms: 3,
      note: "按用户确认记录为3间房；酒店赠送沙坡头景区门票，入住当天及第二天均可使用。"
    },
    {
      id: "stay-d14-yinchuan-tbd",
      name: "银川最后一晚酒店待订",
      city: "银川",
      checkIn: "2026-10-07",
      checkOut: "2026-10-08",
      status: "pending",
      confirmed: false,
      note: "尚未预订；需兼顾宁夏博物馆、览山公园以及10月8日早晨前往河东机场还车。"
    }
  ];

  const DAY13 = {
    day: 13,
    date: "2026-10-06",
    title: "中卫｜高庙·66号公路·沙坡头",
    locations: ["中卫高庙", "66号公路", "沙坡头旅游景区", "中卫"],
    schedule: [
      { id: "d13-gaomiao", time: "上午", type: "attraction", text: "中卫高庙，住市区可从容安排。", placeId: "zhongwei-gaomiao" },
      { id: "d13-route66", time: "上午—中午", type: "attraction", text: "中卫66号公路；只在合法、安全位置停车拍照，不站在车道中央。若前段耗时超预期，66号公路可压缩。", placeId: "zhongwei-route66" },
      { id: "d13-checkin", time: "午后", type: "rest", text: "前往中卫一叶星空酒店办理入住/领取赠送的沙坡头景区门票。酒店已确认赠票入住当天及第二天均可使用。", placeId: "zhongwei" },
      { id: "d13-shapotou", time: "下午 · 预留3—4小时", type: "attraction", text: "游览沙坡头旅游景区，优先黄河与沙漠交汇核心景观。赠票具体包含项目、实名/换票方式仍以酒店和景区现场确认为准。", placeId: "shapotou-scenic" },
      { id: "d13-return", time: "傍晚后", type: "drive", text: "结束沙坡头后返回酒店休息。北长滩不再作为固定项目，黄河沿线仅在时间和体力都充裕时顺路机动。", placeIds: ["shapotou-scenic", "zhongwei"] }
    ],
    notes: ["D13优先级：中卫高庙→沙坡头 > 66号公路 > 黄河沿线；北长滩不再作为必须完成项目。"]
  };

  const DAY14 = {
    day: 14,
    date: "2026-10-07",
    title: "中卫→银川｜宁夏博物馆·览山日落·怀远夜市",
    locations: ["中卫", "宁夏博物馆", "览山公园", "怀远夜市", "银川"],
    schedule: [
      { id: "d14-checkout", time: "08:00左右", type: "rest", text: "早餐、退房并装车；当天不再安排沙坡头。" },
      { id: "d14-drive", time: "上午", type: "drive", text: "中卫返回银川；国庆最后一天给高速返程车流留缓冲。", placeIds: ["zhongwei", "yinchuan"] },
      { id: "d14-lunch", time: "中午", type: "restaurant", text: "抵达银川后简单午餐，避免排长队。", placeId: "yinchuan" },
      { id: "d14-museum", time: "13:30—16:00", type: "attraction", text: "宁夏博物馆。重点串联宁夏历史、西夏、岩画与丝路脉络；按当期预约规则提前处理。", placeId: "ningxia-museum" },
      { id: "d14-hotel", time: "16:00后", type: "rest", text: "银川最后一晚酒店尚未预订；办理入住/放行李后短休。", placeId: "yinchuan" },
      { id: "d14-lanshan", time: "日落前", type: "attraction", text: "览山公园看贺兰山方向日落；如临时关闭或前段明显延误，直接进入晚餐/夜市。", placeId: "lanshan-park" },
      { id: "d14-market", time: "夜间", type: "attraction", text: "怀远夜市，作为最后一晚的轻松收尾。", placeId: "huaiyuan-night-market" }
    ],
    notes: ["10月7日核心顺序：中卫→银川→宁夏博物馆→览山日落→怀远夜市；银川最后一晚酒店仍待预订。"]
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
      { id: "d15-return-car", time: "当前订单10:30", type: "return", text: "银川河东机场服务点还车；宁夏博物馆已安排在10月7日，因此不再与当前还车时间冲突。", placeId: "yinchuan-airport" },
      { id: "d15-flight", time: "待确认", type: "flight", text: "银川飞返上海；航司、航班号与起降时间待确认。" }
    ]
  };

  const ROUTE_UPDATES = {
    13: ["zhongwei", "zhongwei-gaomiao", "zhongwei-route66", "shapotou-scenic", "zhongwei"],
    14: ["zhongwei", "yinchuan", "ningxia-museum", "yinchuan", "lanshan-park", "huaiyuan-night-market", "yinchuan"],
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
      color: "#397dc1",
      anchor: "end",
      size: 24,
      lines: ["沙坡头"],
      query: "沙坡头旅游景区 宁夏中卫",
      geo: SHAPOTOU.geo,
      days: [13]
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
      museum.guidance = "已安排在10月7日下午参观；按当期规则提前预约，并为中卫→银川转场和国庆返程车流预留缓冲。";
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

    data.accommodations = ACCOMMODATIONS.map((item) => ({ ...item }));

    replaceDay(data, DAY13);
    replaceDay(data, DAY14);
    replaceDay(data, DAY15);

    patchSimpleRoutes(data.map?.routes);
    patchSimpleRoutes(data.map?.dailyRoutes);
    patchRouteMap(data);
    patchTickets(data);

    if (data.trip) {
      data.trip.endDate = "2026-10-08";
      data.trip.dayCount = 15;
      data.trip.nightCountAway = 14;
      data.trip.routeSummary = "上海/南京分别出发，在太原汇合取车；经山西、内蒙古西行至乌海，10月3日从阿拉善英雄会梦想沙漠公园参加五湖/六湖穿越；10月5日经吴忠、青铜峡到中卫，10月6日利用一叶星空酒店赠票游沙坡头，10月7日返回银川参观宁夏博物馆、览山日落和怀远夜市，10月8日按现有10:30还车订单返程。";
    }

    data.issuesAndUncertainties = (data.issuesAndUncertainties || []).filter((item) => !["d15-museum-return-conflict", "shapotou-ticket-scope", "yinchuan-stay-pending", "yinchuan-joffre-pending"].includes(item.id));
    data.issuesAndUncertainties.push(
      {
        id: "shapotou-ticket-scope",
        status: "pending",
        text: "中卫一叶星空酒店赠送沙坡头景区门票，已确认入住当天及第二天均可使用；仍需入住时确认实名/换票方式以及赠票具体包含项目。"
      },
      {
        id: "yinchuan-joffre-pending",
        status: "pending",
        text: "10月3日—5日银川鼓楼喆啡锐品酒店当前订单页面仍显示确认中，待补充最新确认页。"
      },
      {
        id: "yinchuan-stay-pending",
        status: "pending",
        text: "10月7日晚银川最后一晚酒店尚未预订。"
      }
    );
  }

  window.applyItineraryUpdate20260918B = apply;
  document.addEventListener("travel-data-ready", (event) => apply(event.detail));
  if (window.TRAVEL_PLAN_DATA) apply(window.TRAVEL_PLAN_DATA);
})();
