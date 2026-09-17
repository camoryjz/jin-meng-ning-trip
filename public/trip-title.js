(() => {
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "trip-terminal.css?v=20260917-1";
  document.head.append(stylesheet);

  const terminalScript = document.createElement("script");
  terminalScript.src = "trip-terminal.js?v=20260917-1";
  document.head.append(terminalScript);

  // Daily route maps are rendered lazily by daily-route-tools.js when a day is expanded.
  // Do not load trip-map-enhancements.js here: it eagerly rendered all daily SVG maps and
  // kept a subtree MutationObserver alive, which caused severe mobile jank.

  const headerFix = document.createElement("script");
  headerFix.src = "header-order-fix.js?v=20260917-2";
  document.head.append(headerFix);

  const ROUTES = [
    { day: 1, placeIds: ["taiyuan-airport", "jinci", "taiyuan-botanical", "taiyuan-city"] },
    { day: 2, placeIds: ["taiyuan-city", "shanxi-museum", "xinzhou-ancient-city"] },
    { day: 3, placeIds: ["xinzhou-ancient-city", "yanmen-pass", "yingxian-pagoda", "hunyuan"] },
    { day: 4, placeIds: ["hunyuan", "hanging-temple", "yong-an-temple", "yuanjue-temple", "datong"] },
    { day: 5, placeIds: ["datong", "yungang-grottoes", "huayan-temple", "nine-dragon-screen", "shanhua-temple", "datong-ancient-city"] },
    { day: 6, placeIds: ["datong", "ulanhada-volcano", "hohhot"] },
    { day: 7, placeIds: ["hohhot", "inner-mongolia-museum", "xilamuren-grassland"] },
    { day: 8, placeIds: ["xilamuren-grassland", "baotou", "bayannur"] },
    { day: 9, placeIds: ["bayannur", "wuhai-lake"] },
    { day: 10, placeIds: ["wuhai-lake", "alxa-hero-park", "tengger-five-lakes", "alxa-hero-park", "yinchuan"] },
    { day: 11, placeIds: ["yinchuan", "xixia-tombs", "helan-rock-art", "yinchuan"] },
    { day: 12, placeIds: ["yinchuan", "wuzhong", "qingtongxia-canyon", "zhongwei"] },
    { day: 13, placeIds: ["zhongwei", "zhongwei-gaomiao", "zhongwei-route66", "zhongwei"] },
    { day: 14, placeIds: ["zhongwei", "yinchuan", "lanshan-park", "huaiyuan-night-market", "yinchuan"] },
    { day: 15, placeIds: ["yinchuan", "ningxia-museum", "yinchuan-airport"] }
  ];

  const LATEST_DAYS = [
    {
      day: 1, date: "2026-09-24", title: "上海/南京→太原｜晋祠·太原植物园",
      locations: ["太原武宿国际机场", "晋祠", "太原植物园"],
      schedule: [
        { id: "d1-flight", time: "07:00—09:10", type: "flight", text: "上海组｜FM9139 上海航空：07:00上海虹桥国际机场T2起飞，09:10抵达太原武宿国际机场T2。" },
        { id: "d1-pickup", time: "10:30", type: "drive", text: "太原武宿机场服务点取车，5人汇合后开始自驾。", placeId: "taiyuan-airport" },
        { id: "d1-jinci", time: "午后", type: "attraction", text: "游览晋祠；控制停留时间，为植物园日落留足余量。", placeId: "jinci" },
        { id: "d1-botanical", time: "日落前后", type: "attraction", text: "太原植物园看日落与蓝调；不把完整夜景作为必须完成项目。", placeId: "taiyuan-botanical" }
      ]
    },
    {
      day: 2, date: "2026-09-25", title: "太原→忻州｜山西博物院·忻州古城·打铁花",
      locations: ["山西博物院", "忻州古城", "打铁花"],
      schedule: [
        { id: "d2-museum", time: "09:00—12:00", type: "attraction", text: "参观山西博物院，重点看晋魂陈列。", placeId: "shanxi-museum" },
        { id: "d2-lunch", time: "12:00—13:00", type: "rest", text: "太原午餐后北上。" },
        { id: "d2-drive", time: "13:00—14:30", type: "drive", text: "太原自驾前往忻州，入住后休息。", placeIds: ["taiyuan-city", "xinzhou-ancient-city"] },
        { id: "d2-ancient", time: "16:30—18:20", type: "attraction", text: "忻州古城：秀容书院、古城街巷、日落与蓝调。", placeId: "xinzhou-ancient-city" },
        { id: "d2-dinner", time: "18:20—20:15", type: "restaurant", text: "古城晚餐与小吃，预留前往演出点的时间。", placeId: "xinzhou-ancient-city" },
        { id: "d2-iron-flower", time: "20:30场优先", type: "attraction", text: "观看忻州古城打铁花；需提前购票并锁定场次，最终时间与观看区域以出票页和当天公告为准。", placeId: "xinzhou-ancient-city" }
      ]
    },
    {
      day: 3, date: "2026-09-26", title: "忻州→雁门关→应县→浑源｜边塞·木构",
      locations: ["忻州", "雁门关", "应县木塔", "净土寺（可选）", "浑源"],
      schedule: [
        { id: "d3-depart", time: "07:30", type: "drive", text: "忻州酒店出发，北上雁门关。", placeIds: ["xinzhou-ancient-city", "yanmen-pass"] },
        { id: "d3-yanmen", time: "09:00—11:30", type: "attraction", text: "游览雁门关，主抓关城、古关道、核心长城段和边塞视野。", placeId: "yanmen-pass" },
        { id: "d3-drive-yingxian", time: "11:30—12:30", type: "drive", text: "雁门关前往应县。", placeIds: ["yanmen-pass", "yingxian-pagoda"] },
        { id: "d3-lunch", time: "12:30—13:30", type: "restaurant", text: "应县午餐。", placeId: "yingxian-pagoda" },
        { id: "d3-pagoda", time: "13:30—15:00", type: "attraction", text: "游览应县木塔。", placeId: "yingxian-pagoda" },
        { id: "d3-option-jingtu", time: "15:00后 · 可选", type: "attraction", text: "时间和体力充裕时短访净土寺；若排队或时间不足则直接取消。", placeId: "jingtu-temple" },
        { id: "d3-to-hunyuan", time: "傍晚前", type: "drive", text: "前往浑源入住，为次日悬空寺留足休息。", placeId: "hunyuan" }
      ]
    },
    {
      day: 4, date: "2026-09-27", title: "浑源→大同｜悬空寺·浑源古建备选",
      locations: ["悬空寺", "永安寺", "圆觉寺", "大同"],
      schedule: [
        { id: "d4-hanging", time: "开园前后", type: "attraction", text: "主方案：持登临票游览悬空寺，尽量第一时段。", placeId: "hanging-temple" },
        { id: "d4-fallback", time: "无登临票时", type: "attraction", text: "早晨第一轮补票未果即止损：悬空寺外观/寺下观景＋MR数字体验，不耗半天等待。", placeId: "hanging-temple" },
        { id: "d4-yongan", time: "备选继续", type: "attraction", text: "无登临票时继续永安寺。", placeId: "yong-an-temple" },
        { id: "d4-yuanjue", time: "备选继续", type: "attraction", text: "圆觉寺短访。", placeId: "yuanjue-temple" },
        { id: "d4-drive", time: "午后", type: "drive", text: "结束浑源段后前往大同，傍晚进入古城。", placeIds: ["hunyuan", "datong"] }
      ]
    },
    {
      day: 5, date: "2026-09-28", title: "大同｜云冈石窟·华严寺·古城",
      locations: ["云冈石窟", "华严寺", "九龙壁", "善化寺", "大同古城"],
      schedule: [
        { id: "d5-yungang", time: "08:00—12:00", type: "attraction", text: "云冈石窟尽量第一时段入园，上午集中看核心洞窟。", placeId: "yungang-grottoes" },
        { id: "d5-huayan", time: "14:00—15:30", type: "attraction", text: "华严寺。", placeId: "huayan-temple" },
        { id: "d5-nine-dragon", time: "15:40—16:20", type: "attraction", text: "九龙壁短停。", placeId: "nine-dragon-screen" },
        { id: "d5-shanhua", time: "16:30—17:30", type: "attraction", text: "善化寺。", placeId: "shanhua-temple" },
        { id: "d5-ancient", time: "夜间", type: "attraction", text: "大同古城夜景与晚餐。", placeId: "datong-ancient-city" }
      ]
    },
    {
      day: 6, date: "2026-09-29", title: "大同→乌兰哈达火山→呼和浩特",
      locations: ["大同", "乌兰哈达火山", "呼和浩特"],
      schedule: [
        { id: "d6-drive1", time: "上午", type: "drive", text: "大同出发，自驾前往乌兰哈达火山；按出发前最新交通组织导航进入游客中心。", placeIds: ["datong", "ulanhada-volcano"] },
        { id: "d6-volcano", time: "中午—下午", type: "attraction", text: "游玩乌兰哈达火山，按开放区域与现场交通管制调整火山点位。", placeId: "ulanhada-volcano" },
        { id: "d6-drive2", time: "下午", type: "drive", text: "继续自驾前往呼和浩特，入住休息。", placeId: "hohhot" }
      ]
    },
    {
      day: 7, date: "2026-09-30", title: "呼和浩特→阴山·大青山→希拉穆仁｜博物院·草原",
      locations: ["内蒙古博物院", "阴山·大青山", "希拉穆仁草原"],
      schedule: [
        { id: "d7-museum", time: "09:00—11:30", type: "attraction", text: "参观内蒙古博物院。", placeId: "inner-mongolia-museum" },
        { id: "d7-lunch", time: "11:30—12:30", type: "rest", text: "午餐后离开呼和浩特。" },
        { id: "d7-drive", time: "13:00左右", type: "drive", text: "北上希拉穆仁，途中翻越阴山山系大青山。", placeIds: ["hohhot", "xilamuren-grassland"] },
        { id: "d7-geo-note", time: "沿途提示", type: "note", text: "观察山南平原→山地→山北高原草原的地貌变化；只在正规停车区/观景点短停。" },
        { id: "d7-sunset", time: "日落", type: "attraction", text: "希拉穆仁草原看日落。", placeId: "xilamuren-grassland" },
        { id: "d7-stars", time: "夜间", type: "attraction", text: "天气允许时观星；当晚住宿希拉穆仁。", placeId: "xilamuren-grassland" }
      ]
    },
    {
      day: 8, date: "2026-10-01", title: "希拉穆仁→包头→巴彦淖尔｜转场补给",
      locations: ["希拉穆仁草原", "包头", "巴彦淖尔"],
      schedule: [
        { id: "d8-drive1", time: "09:00前后", type: "drive", text: "从希拉穆仁出发前往包头。", placeIds: ["xilamuren-grassland", "baotou"] },
        { id: "d8-rest", time: "午间", type: "rest", text: "包头午餐、补水、加油和简单补给，不增加额外景点。", placeId: "baotou" },
        { id: "d8-drive2", time: "下午", type: "drive", text: "继续前往巴彦淖尔，国庆首日给高速拥堵留缓冲。", placeId: "bayannur" }
      ]
    },
    {
      day: 9, date: "2026-10-02", title: "巴彦淖尔→乌海｜乌海湖",
      locations: ["巴彦淖尔", "乌海湖", "乌海"],
      schedule: [
        { id: "d9-drive", time: "上午", type: "drive", text: "巴彦淖尔出发，直接前往乌海；取消阴山岩画支线。", placeIds: ["bayannur", "wuhai-lake"] },
        { id: "d9-wuhai-lake", time: "下午", type: "attraction", text: "游览乌海湖；游船是否恢复以当天景区运营公告为准，若停航则以湖岸、陆路与沙海景观为主。", placeId: "wuhai-lake" },
        { id: "d9-stay", time: "夜间", type: "rest", text: "住乌海市区，早休息，为次日五湖穿越留体力。" }
      ]
    },
    {
      day: 10, date: "2026-10-03", title: "乌海→阿拉善英雄会→五湖穿越→银川",
      locations: ["乌海", "阿拉善英雄会梦想沙漠公园", "腾格里五湖/六湖穿越", "银川"],
      schedule: [
        { id: "d10-depart", time: "06:30左右", type: "drive", text: "乌海早出发，前往阿拉善英雄会梦想沙漠公园/运营方指定集合点。", placeIds: ["wuhai-lake", "alxa-hero-park"] },
        { id: "d10-safety", time: "集合后", type: "note", text: "租赁途昂Pro只开到正规停车区，不进入沙漠；五湖线路使用正规运营方专业越野车和司机。" },
        { id: "d10-offroad", time: "上午—下午", type: "attraction", text: "腾格里五湖/六湖穿越；湖泊与顺序不写死，以运营方、天气、风沙和道路条件为准。", placeId: "tengger-five-lakes" },
        { id: "d10-return-parking", time: "穿越结束", type: "transfer", text: "返回同一集合/停车点取租赁车；预订时必须确认是否原点返回。", placeId: "alxa-hero-park" },
        { id: "d10-to-yinchuan", time: "下午—傍晚", type: "drive", text: "取车后直接前往银川入住；当天不再增加正式景点。", placeIds: ["alxa-hero-park", "yinchuan"] }
      ],
      notes: ["10月3日必须提前锁定上午场、集合点、停车点、运营车辆/司机与结束时间。"]
    },
    {
      day: 11, date: "2026-10-04", title: "银川西线｜西夏陵·贺兰山岩画",
      locations: ["西夏陵博物馆", "西夏陵陵园", "贺兰山岩画", "银川"],
      schedule: [
        { id: "d11-xixia-museum", time: "上午", type: "attraction", text: "先参观西夏陵博物馆，再进入陵园。", placeId: "xixia-tombs" },
        { id: "d11-xixia-site", time: "中午前后", type: "attraction", text: "西夏陵陵园；这一天优先保证西夏陵完整参观。", placeId: "xixia-tombs" },
        { id: "d11-helan", time: "下午", type: "attraction", text: "贺兰山岩画；若国庆客流、堵车或体力超预期，可删此项。", placeId: "helan-rock-art" },
        { id: "d11-return", time: "傍晚", type: "drive", text: "返回银川休息。", placeId: "yinchuan" }
      ]
    },
    {
      day: 12, date: "2026-10-05", title: "银川→吴忠→青铜峡→中卫｜黄河线",
      locations: ["吴忠早茶", "青铜峡黄河大峡谷", "108塔", "中卫"],
      schedule: [
        { id: "d12-drive-wuzhong", time: "上午", type: "drive", text: "银川退房后前往吴忠。", placeIds: ["yinchuan", "wuzhong"] },
        { id: "d12-brunch", time: "10:00—11:30", type: "restaurant", text: "吴忠早茶/早午餐，具体店铺出发前再定。", placeId: "wuzhong" },
        { id: "d12-qingtongxia", time: "中午—下午", type: "attraction", text: "青铜峡黄河大峡谷＋108塔；若水上项目停运，则改走陆路参观，不因此改变后续住宿。", placeId: "qingtongxia-canyon" },
        { id: "d12-to-zhongwei", time: "下午", type: "drive", text: "游览结束后前往中卫入住，当天不再叠加高庙。", placeIds: ["qingtongxia-canyon", "zhongwei"] }
      ]
    },
    {
      day: 13, date: "2026-10-06", title: "中卫｜高庙·66号公路·黄河沿线",
      locations: ["中卫高庙", "66号公路", "黄河沿线", "北长滩（可选）"],
      schedule: [
        { id: "d13-gaomiao", time: "上午", type: "attraction", text: "中卫高庙，住市区可从容安排。", placeId: "zhongwei-gaomiao" },
        { id: "d13-route66", time: "中午—下午", type: "attraction", text: "中卫66号公路；只在合法、安全位置停车拍照，不站在车道中央。", placeId: "zhongwei-route66" },
        { id: "d13-yellow-river", time: "下午", type: "free", text: "沿黄河方向机动游览；北长滩只在道路、时间与体力都允许时前往。" },
        { id: "d13-return", time: "傍晚", type: "drive", text: "返回中卫市区，继续住同一家酒店。", placeId: "zhongwei" }
      ]
    },
    {
      day: 14, date: "2026-10-07", title: "中卫→银川｜览山日落·怀远夜市",
      locations: ["中卫", "银川", "览山公园", "怀远夜市"],
      schedule: [
        { id: "d14-drive", time: "上午", type: "drive", text: "中卫退房后返回银川；国庆最后一天给高速返程车流留缓冲。", placeIds: ["zhongwei", "yinchuan"] },
        { id: "d14-rest", time: "午后", type: "rest", text: "银川入住、午餐和休息；若次日仍维持10:30还车且想看宁夏博物馆，可把博物馆优先挪到今天中午。", placeId: "yinchuan" },
        { id: "d14-lanshan", time: "日落前", type: "attraction", text: "览山公园看日落；如临时关闭则直接进入晚餐/夜市。", placeId: "lanshan-park" },
        { id: "d14-market", time: "夜间", type: "attraction", text: "怀远夜市。", placeId: "huaiyuan-night-market" }
      ]
    },
    {
      day: 15, date: "2026-10-08", title: "银川｜宁夏博物馆（条件式）·还车·返程",
      locations: ["宁夏博物馆（条件式）", "银川河东国际机场"],
      schedule: [
        { id: "d15-museum", time: "条件式", type: "attraction", text: "宁夏博物馆仅在返程航班较晚且租车还车时间从当前10:30成功延后时安排；否则移到D14中午或取消。", placeId: "ningxia-museum" },
        { id: "d15-luggage", time: "按航班倒推", type: "rest", text: "午餐/取行李，检查随身物品与车辆。" },
        { id: "d15-fuel", time: "还车前", type: "drive", text: "按租车规则补足燃油并前往银川河东机场服务点。", placeId: "yinchuan-airport" },
        { id: "d15-return-car", time: "当前订单10:30", type: "return", text: "银川河东机场服务点还车。若计划上午参观宁夏博物馆，需要先修改还车时间。", placeId: "yinchuan-airport" },
        { id: "d15-flight", time: "待确认", type: "flight", text: "银川飞返上海；航司、航班号与起降时间待确认。" }
      ],
      notes: ["当前租车订单10月8日10:30还车，与上午参观宁夏博物馆存在时间冲突，需二选一或延后还车时间。"]
    }
  ];

  const EXTRA_PLACES = [
    { id: "alxa-hero-park", nameZh: "阿拉善英雄会沙漠穿越大本营", name: "阿拉善英雄会沙漠穿越大本营", address: "内蒙古自治区阿拉善盟阿拉善左旗315省道英雄会梦想公园内", geo: { lat: 38.665225, lng: 105.149725 }, amap: { poiId: "B0FFHCW8T2" } },
    { id: "qingtongxia-canyon", nameZh: "青铜峡黄河大峡谷＋108塔", name: "青铜峡黄河大峡谷旅游区", address: "宁夏回族自治区吴忠市青铜峡市青铜峡镇游客中心", geo: { lat: 37.883645, lng: 105.991775 }, amap: { poiId: "B03B90M3BZ" } },
    { id: "zhongwei-gaomiao", nameZh: "中卫高庙", name: "中卫高庙", address: "宁夏回族自治区中卫市沙坡头区鼓楼北街高庙保安寺", geo: { lat: 37.518248, lng: 105.188766 }, amap: { poiId: "B07A1001E0" } },
    { id: "lanshan-park", nameZh: "览山公园", name: "览山公园", address: "宁夏回族自治区银川市金凤区亲水大街与沈阳路交叉口向西300米", geo: { lat: 38.530068, lng: 106.215378 }, amap: { poiId: "B03B70PN5S" } },
    { id: "ningxia-museum", nameZh: "宁夏博物馆", name: "宁夏博物馆", address: "宁夏回族自治区银川市金凤区人民广场东街6号", geo: { lat: 38.484801, lng: 106.235128 }, amap: { poiId: "B03B703MJK" } },
    { id: "yinchuan-airport", nameZh: "银川河东国际机场", name: "银川河东国际机场", address: "宁夏回族自治区银川市灵武市空港大道", geo: { lat: 38.321759, lng: 106.393399 }, amap: { poiId: "B03B703LYQ" } }
  ];

  function upsert(list, item) {
    if (!Array.isArray(list)) return;
    const index = list.findIndex((entry) => entry?.id === item.id);
    if (index >= 0) list[index] = { ...list[index], ...item };
    else list.push(item);
  }

  function patchRouteMap(data) {
    const region = data?.routeMap?.regions?.find((item) => item.id === data.routeMap.defaultRegionId) || data?.routeMap?.regions?.[0];
    if (!region) return;

    region.days = Array.from({ length: 15 }, (_, index) => index + 1);
    region.description = "2026年9月24日至10月8日，太原取车后经山西北上内蒙古，西行至乌海后从阿拉善英雄会进入腾格里五湖，再经银川、青铜峡、中卫返回银川还车返程。";
    region.ariaLabel = "山西·内蒙古·宁夏模板化旅行路线示意图，共15天";

    const schematic = [
      { id: "alxa-hero-park", x: 620, y: 570, tx: 474, ty: 548, color: "#209aaa", lines: ["阿拉善英雄会梦想公园"], days: [10] },
      { id: "qingtongxia-canyon", x: 634, y: 676, tx: 772, ty: 700, color: "#df6185", lines: ["青铜峡黄河大峡谷＋108塔"], days: [12] },
      { id: "zhongwei-gaomiao", x: 612, y: 733, tx: 750, ty: 757, color: "#397dc1", lines: ["中卫高庙"], days: [13] },
      { id: "lanshan-park", x: 661, y: 565, tx: 523, ty: 533, color: "#e77e22", lines: ["览山公园"], days: [14] },
      { id: "ningxia-museum", x: 690, y: 578, tx: 722, ty: 628, color: "#618344", lines: ["宁夏博物馆"], days: [15] },
      { id: "yinchuan-airport", x: 721, y: 612, tx: 753, ty: 662, color: "#618344", lines: ["银川河东国际机场"], days: [15] }
    ];

    schematic.forEach((entry) => {
      const extra = EXTRA_PLACES.find((place) => place.id === entry.id);
      const place = {
        ...entry,
        anchor: "start",
        size: 24,
        query: `${entry.lines[0]} 山西·内蒙古·宁夏`,
        geo: extra?.geo
      };
      upsert(region.places, place);
    });

    const keep = (region.routes || []).filter((route) => Number(route.day) <= 8);
    const routePlace = (id) => region.places?.find((place) => place.id === id);
    const xy = (id) => {
      const place = routePlace(id);
      return place ? `${place.x} ${place.y}` : "0 0";
    };
    const newRoute = (day, color, ids) => ({
      day,
      color,
      placeIds: ids,
      paths: [`M${ids.map((id) => xy(id)).join(" L")}`],
      overviewPaths: [`M${ids.map((id) => xy(id)).join(" L")}`]
    });
    region.routes = [
      ...keep,
      newRoute(9, "#618344", ["bayannur", "wuhai-lake"]),
      newRoute(10, "#209aaa", ["wuhai-lake", "alxa-hero-park", "tengger-five-lakes", "alxa-hero-park", "yinchuan"]),
      newRoute(11, "#8865a5", ["yinchuan", "xixia-tombs", "helan-rock-art", "yinchuan"]),
      newRoute(12, "#df6185", ["yinchuan", "wuzhong", "qingtongxia-canyon", "zhongwei"]),
      newRoute(13, "#397dc1", ["zhongwei", "zhongwei-gaomiao", "zhongwei-route66", "zhongwei"]),
      newRoute(14, "#e77e22", ["zhongwei", "yinchuan", "lanshan-park", "huaiyuan-night-market", "yinchuan"]),
      newRoute(15, "#618344", ["yinchuan", "ningxia-museum", "yinchuan-airport"])
    ];
    region.overviewPlaceIds = ["taiyuan-city", "xinzhou-ancient-city", "hunyuan", "datong", "hohhot", "xilamuren-grassland", "bayannur", "wuhai-lake", "alxa-hero-park", "yinchuan", "zhongwei", "yinchuan-airport"];
  }

  function patchTickets(data) {
    const items = data?.ticketPlanning?.items;
    if (!Array.isArray(items)) return;
    items.forEach((item) => {
      const name = `${item.name || ""}${item.title || ""}`;
      if (/西夏/.test(name)) item.day = 11;
      if (/宁夏博物馆/.test(name)) item.day = 15;
      if (/腾格里|五湖|六湖/.test(name)) item.day = 10;
      if (/内蒙古博物院/.test(name)) item.day = 7;
    });
  }

  function applyLatestItinerary(data) {
    if (!data || typeof data !== "object") return;

    data.metadata ||= {};
    data.metadata.title = "晋蒙宁15天自驾旅行手册｜2026.09.24—10.08";

    data.trip ||= {};
    data.trip.startDate = "2026-09-24";
    data.trip.endDate = "2026-10-08";
    data.trip.dayCount = 15;
    data.trip.nightCountAway = 14;
    data.trip.groupSize = 5;
    data.trip.heroTitle = "晋蒙宁15天自驾旅行手册";
    data.trip.heroEyebrow = "山西 · 内蒙古 · 宁夏";
    data.trip.routeSummary = "上海/南京分别出发，在太原汇合取车；经山西、内蒙古西行至乌海，10月3日从阿拉善英雄会梦想沙漠公园参加五湖/六湖穿越，随后进入宁夏，10月8日在银川还车返程。";

    data.days = LATEST_DAYS.map((day) => ({ ...day, schedule: day.schedule.map((item) => ({ ...item })) }));

    data.places ||= [];
    data.map ||= {};
    data.map.places ||= [];
    EXTRA_PLACES.forEach((place) => {
      upsert(data.places, place);
      upsert(data.map.places, { id: place.id, name: place.nameZh || place.name, address: place.address, geo: place.geo, amap: place.amap });
    });
    data.map.routes = ROUTES.map((route) => ({ ...route, placeIds: [...route.placeIds] }));
    data.map.dailyRoutes = ROUTES.map((route) => ({ ...route, placeIds: [...route.placeIds] }));
    if (data.map.region) data.map.region.description = "2026年9月24日至10月8日，太原取车后经山西、内蒙古、乌海与阿拉善腾格里五湖，再进入宁夏并最终在银川还车返程。";
    patchRouteMap(data);

    data.flightJourneys ||= [];
    data.flightJourneys = data.flightJourneys.filter((journey) => journey.id !== "flight-return-option");
    const returnJourney = data.flightJourneys.find((journey) => journey.id === "flight-return-primary");
    if (returnJourney) {
      returnJourney.title = "主方案｜10月8日 银川 → 上海";
      returnJourney.status = "pending";
      returnJourney.placeholder = true;
    }

    const rental = data?.groundTransport?.rentalCar;
    if (rental?.dropoff) {
      rental.dropoff.date = "2026-10-08";
      rental.dropoff.time = rental.dropoff.time || "10:30";
      rental.dropoff.deadlineWarning = "当前订单为10月8日10:30在银川河东机场服务点还车，与主返程日期一致；若想在10月8日上午参观宁夏博物馆，需要先把还车时间延后。";
    }
    if (Array.isArray(data?.groundTransport?.rentalChecklist)) {
      data.groundTransport.rentalChecklist = [
        "9月24日10:30在太原武宿机场服务点取车。",
        "车型：大众途昂Pro，2.0T自动，SUV 7座，车龄1年内；车牌待定。",
        "10月8日在银川河东机场服务点还车；当前订单时间为10:30。",
        "如10月8日上午安排宁夏博物馆，需要先与租车平台确认延后还车时间。"
      ];
    }
    if (Array.isArray(data?.groundTransport?.drivingNotes)) {
      const notes = data.groundTransport.drivingNotes.filter((note) => !String(note).includes("腾格里沙漠五湖穿越"));
      notes.push("10月3日五湖/六湖穿越从阿拉善英雄会梦想沙漠公园/运营方指定集合点进入；租赁途昂只到正规停车区，沙漠内部由正规运营方越野车和司机执行。");
      data.groundTransport.drivingNotes = notes;
    }

    if (data.mapLinks) data.mapLinks.note = "地图为路线示意；10月3日五湖穿越集合点以阿拉善英雄会梦想沙漠公园/运营方最终通知为准，租赁车不进入沙漠内部线路。";

    data.issuesAndUncertainties = (data.issuesAndUncertainties || [])
      .filter((item) => !["return-primary-pending", "return-option-oct8", "desert-pending", "stay-pending"].includes(item.id));
    data.issuesAndUncertainties.push(
      { id: "return-oct8-pending", status: "pending", text: "主方案已改为10月8日银川返上海，返程航司、航班号及起降时间待确认。" },
      { id: "desert-operator-pending", status: "pending", text: "10月3日五湖/六湖穿越需确认上午场、梦想沙漠公园具体集合/停车点、运营车辆与司机、是否原点返回以及结束时间。" },
      { id: "d15-museum-return-conflict", status: "pending", text: "当前租车订单10月8日10:30还车；如要当天上午参观宁夏博物馆，需要延后还车时间，或把博物馆移至10月7日。" }
    );

    patchTickets(data);
  }

  window.applyLatestItinerary20260918 = applyLatestItinerary;

  document.addEventListener("travel-data-ready", (event) => {
    const data = event.detail;
    applyLatestItinerary(data);
  });

  if (window.TRAVEL_PLAN_DATA) applyLatestItinerary(window.TRAVEL_PLAN_DATA);
})();