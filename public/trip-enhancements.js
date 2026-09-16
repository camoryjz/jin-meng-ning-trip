(() => {
  "use strict";

  const VERSION = "2026.09.16-v2";
  const TRIP_ID = "jin-meng-ning-roadtrip-20260924";
  const STORE_PREFIX = `jmn-enh:${TRIP_ID}:`;
  const AMAP_SEARCH = (query) => `https://uri.amap.com/search?keyword=${encodeURIComponent(query)}&callnative=1`;
  const BAIDU_SEARCH = (query) => `https://map.baidu.com/search/${encodeURIComponent(query)}`;
  const esc = (value = "") => String(value).replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));

  const NEW_PLACES = [
    { id: "yanmen-pass", nameZh: "雁门关", name: "雁门关", address: "山西省忻州市代县雁门关景区" },
    { id: "jingtu-temple", nameZh: "净土寺", name: "净土寺", address: "山西省朔州市应县" },
    { id: "yong-an-temple", nameZh: "永安寺", name: "永安寺", address: "山西省大同市浑源县" },
    { id: "yuanjue-temple", nameZh: "圆觉寺", name: "圆觉寺", address: "山西省大同市浑源县" },
    { id: "huayan-temple", nameZh: "华严寺", name: "华严寺", address: "山西省大同市平城区" },
    { id: "nine-dragon-screen", nameZh: "九龙壁", name: "九龙壁", address: "山西省大同市平城区" },
    { id: "shanhua-temple", nameZh: "善化寺", name: "善化寺", address: "山西省大同市平城区" },
    { id: "yinshan-rock-art", nameZh: "阴山岩画（磴口方向）", name: "阴山岩画", address: "内蒙古自治区巴彦淖尔市磴口县" },
    { id: "zhongwei-gaomiao", nameZh: "中卫高庙", name: "中卫高庙", address: "宁夏回族自治区中卫市沙坡头区" },
    { id: "lanshan-park", nameZh: "览山公园", name: "览山公园", address: "宁夏回族自治区银川市金凤区" },
    { id: "ningxia-museum", nameZh: "宁夏博物馆", name: "宁夏博物馆", address: "宁夏回族自治区银川市金凤区人民广场东街6号" },
    { id: "yinchuan-airport", nameZh: "银川河东国际机场", name: "银川河东国际机场", address: "宁夏回族自治区银川市灵武市" }
  ];

  const DAY_PATCHES = {
    2: {
      title: "太原→忻州｜山西博物院·忻州古城·打铁花",
      locations: ["山西博物院", "忻州古城", "打铁花"],
      schedule: [
        { id: "d2-museum", time: "09:00—12:00", type: "attraction", text: "参观山西博物院，重点看晋魂陈列。", placeId: "shanxi-museum" },
        { id: "d2-lunch", time: "12:00—13:00", type: "rest", text: "太原午餐后北上。" },
        { id: "d2-drive", time: "13:00—14:30", type: "drive", text: "太原自驾前往忻州，入住后休息。", placeIds: ["taiyuan-city", "xinzhou-ancient-city"] },
        { id: "d2-ancient", time: "16:30—18:20", type: "attraction", text: "忻州古城：秀容书院、古城街巷、日落与蓝调。", placeId: "xinzhou-ancient-city" },
        { id: "d2-dinner", time: "18:20—20:15", type: "restaurant", text: "古城晚餐与小吃，预留前往演出点的时间。", placeId: "xinzhou-ancient-city" },
        { id: "d2-iron-flower", time: "20:30—21:00（暂定）", type: "attraction", text: "观看忻州古城打铁花；优先第二场，出发当天再次核对演出公告和具体位置。", placeId: "xinzhou-ancient-city" }
      ]
    },
    3: {
      title: "忻州→雁门关→应县→浑源｜边塞·木构",
      locations: ["忻州", "雁门关", "应县木塔", "浑源"],
      schedule: [
        { id: "d3-depart", time: "07:30", type: "drive", text: "忻州酒店出发，北上雁门关。", placeIds: ["xinzhou-ancient-city", "yanmen-pass"] },
        { id: "d3-yanmen", time: "09:00—11:30", type: "attraction", text: "游览雁门关，主抓关城、古关道、核心长城段和边塞视野。", placeId: "yanmen-pass" },
        { id: "d3-drive-yingxian", time: "11:30—12:30", type: "drive", text: "雁门关前往应县。", placeIds: ["yanmen-pass", "yingxian-pagoda"] },
        { id: "d3-lunch", time: "12:30—13:30", type: "restaurant", text: "应县午餐，凉粉或面食。", placeId: "yingxian-pagoda" },
        { id: "d3-pagoda", time: "13:30—15:00", type: "attraction", text: "游览应县木塔。", placeId: "yingxian-pagoda" },
        { id: "d3-option-jingtu", time: "15:00后 · 可选", type: "attraction", text: "时间和体力充裕时短访净土寺；否则直接去浑源休息。", placeId: "jingtu-temple" },
        { id: "d3-to-hunyuan", time: "傍晚前", type: "drive", text: "前往浑源入住，为次日悬空寺留足休息。", placeId: "hunyuan" }
      ]
    },
    4: {
      title: "浑源→大同｜悬空寺·浑源古建备选",
      locations: ["悬空寺", "浑源古建（无登临票备选）", "大同"],
      schedule: [
        { id: "d4-hanging", time: "开园前后", type: "attraction", text: "主方案：持登临票游览悬空寺，建议预留2—2.5小时。", placeId: "hanging-temple" },
        { id: "d4-fallback", time: "无登临票时", type: "attraction", text: "备选：悬空寺外观/寺下观景＋MR数字体验；早晨第一轮线下票未果即止损，不等中午放票。", placeId: "hanging-temple" },
        { id: "d4-yongan", time: "备选继续", type: "attraction", text: "无登临票时继续永安寺，看元代壁画。", placeId: "yong-an-temple" },
        { id: "d4-yuanjue", time: "备选继续", type: "attraction", text: "圆觉寺看密檐砖塔与塔顶翔凤。", placeId: "yuanjue-temple" },
        { id: "d4-drive", time: "午后", type: "drive", text: "结束浑源段后前往大同，傍晚进入大同古城。", placeIds: ["hunyuan", "datong"] }
      ]
    },
    5: {
      title: "大同｜云冈石窟·华严寺·古城",
      locations: ["云冈石窟", "华严寺", "九龙壁", "善化寺", "大同古城"],
      schedule: [
        { id: "d5-yungang", time: "08:00—12:00", type: "attraction", text: "云冈石窟尽量第一时段入园，上午集中看核心洞窟。", placeId: "yungang-grottoes" },
        { id: "d5-huayan", time: "14:00—15:30", type: "attraction", text: "华严寺。", placeId: "huayan-temple" },
        { id: "d5-nine-dragon", time: "15:40—16:20", type: "attraction", text: "九龙壁短停。", placeId: "nine-dragon-screen" },
        { id: "d5-shanhua", time: "16:30—17:30", type: "attraction", text: "善化寺。", placeId: "shanhua-temple" },
        { id: "d5-ancient", time: "夜间", type: "attraction", text: "大同古城夜景与晚餐。", placeId: "datong-ancient-city" }
      ]
    },
    7: {
      title: "呼和浩特→阴山·大青山→希拉穆仁｜博物院·草原",
      locations: ["内蒙古博物院", "阴山·大青山", "希拉穆仁草原"],
      schedule: [
        { id: "d7-museum", time: "09:00—12:00", type: "attraction", text: "参观内蒙古博物院。", placeId: "inner-mongolia-museum" },
        { id: "d7-drive", time: "午后", type: "drive", text: "呼和浩特北上希拉穆仁，途中实际翻越阴山山系的大青山。", placeIds: ["hohhot", "xilamuren-grassland"] },
        { id: "d7-geo-note", time: "沿途提示", type: "note", text: "阴山·大青山地理提示：留意山南平原→山地→山北高原草原的地貌变化；只在正规停车区/观景点短停，不在公路或非开放区域停车拍照。" },
        { id: "d7-sunset", time: "日落", type: "attraction", text: "希拉穆仁草原看日落。", placeId: "xilamuren-grassland" },
        { id: "d7-stars", time: "夜间", type: "attraction", text: "天气允许时观星；9月底按金黄草甸与秋季温差准备，不按盛夏绿草原预期。", placeId: "xilamuren-grassland" }
      ]
    },
    9: {
      title: "巴彦淖尔→阴山岩画→乌海→腾格里",
      locations: ["巴彦淖尔", "阴山岩画（条件式）", "乌海补给", "腾格里沙漠"],
      schedule: [
        { id: "d9-drive1", time: "上午", type: "drive", text: "巴彦淖尔出发，前往磴口方向。", placeIds: ["bayannur", "yinshan-rock-art"] },
        { id: "d9-rock-art", time: "条件式重点", type: "attraction", text: "阴山岩画：仅在高德准确POI、道路状态和正规接待/向导确认后执行；不驾驶租赁SUV进入无人区、涉水或砂石越野路段。", placeId: "yinshan-rock-art" },
        { id: "d9-wuhai", time: "途中", type: "rest", text: "乌海作为补给与休息节点；若时间充裕可乌海湖短停约30分钟，否则直接继续。", placeId: "wuhai-lake" },
        { id: "d9-drive2", time: "下午", type: "drive", text: "继续前往腾格里沙漠营地/集合点（以运营方最终通知为准）。", placeId: "tengger-desert" },
        { id: "d9-sunset", time: "日落", type: "attraction", text: "优先保证准时到营地看第一晚日落。", placeId: "tengger-desert" }
      ]
    },
    10: {
      title: "腾格里沙漠｜五湖穿越·日落·观星",
      locations: ["腾格里沙漠", "五湖穿越区域", "乌兰湖（视当日线路）"],
      schedule: [
        { id: "d10-safety", time: "出发前", type: "note", text: "五湖穿越提示：租赁途昂Pro不进沙，使用正规运营方越野车与熟悉路线的司机；前一晚确认车辆、司机、路线、返程时间、饮水和天气。" },
        { id: "d10-offroad", time: "上午—下午", type: "attraction", text: "五湖穿越。湖泊和顺序不写死，以水位、风沙、道路及运营方安全判断为准；乌兰湖可作为重点目标但不强行集齐五湖。", placeId: "tengger-five-lakes" },
        { id: "d10-rest", time: "14:30左右", type: "rest", text: "回营地休息，避开中午强光和长时间暴晒。", placeId: "tengger-desert" },
        { id: "d10-sunset", time: "17:00后", type: "attraction", text: "沙丘/营地周边拍日落与蓝调。", placeId: "tengger-desert" },
        { id: "d10-stars", time: "夜间", type: "attraction", text: "天气允许时继续观星，傍晚及时加衣。", placeId: "tengger-desert" }
      ]
    },
    11: {
      title: "腾格里→中卫｜高庙·66号公路",
      locations: ["腾格里沙漠", "中卫高庙", "中卫66号公路"],
      schedule: [
        { id: "d11-exit", time: "上午", type: "drive", text: "离开腾格里沙漠前往中卫。", placeIds: ["tengger-desert", "zhongwei"] },
        { id: "d11-gaomiao", time: "中午前后", type: "attraction", text: "中卫高庙，安排约1小时。", placeId: "zhongwei-gaomiao" },
        { id: "d11-lunch", time: "午餐", type: "restaurant", text: "中卫蒿子面等本地午餐。", placeId: "zhongwei" },
        { id: "d11-route66", time: "下午", type: "attraction", text: "中卫66号公路；严禁站在车道中央拍照。", placeId: "zhongwei-route66" },
        { id: "d11-option", time: "可选", type: "attraction", text: "北长滩/黄河沿线视时间和体力决定，不作为必达点。", placeId: "zhongwei" }
      ]
    },
    12: {
      title: "中卫→吴忠→银川｜早茶·览山落日·怀远夜市",
      locations: ["中卫", "吴忠早茶", "银川", "览山公园", "怀远夜市"],
      schedule: [
        { id: "d12-drive1", time: "10:00左右", type: "drive", text: "中卫出发前往吴忠。", placeIds: ["zhongwei", "wuzhong"] },
        { id: "d12-breakfast", time: "11:30—13:00", type: "restaurant", text: "吴忠早茶作为午餐，具体店铺后续确认。", placeId: "wuzhong" },
        { id: "d12-drive2", time: "13:00—15:00", type: "drive", text: "继续前往银川，入住后休息。", placeId: "yinchuan" },
        { id: "d12-lanshan", time: "17:30—19:00", type: "attraction", text: "览山公园看贺兰山方向日落与蓝调；当天上午复核是否有赛事/活动临时封闭。", placeId: "lanshan-park" },
        { id: "d12-market", time: "19:00以后", type: "attraction", text: "银川晚餐/怀远夜市。", placeId: "huaiyuan-night-market" }
      ]
    },
    13: {
      title: "银川西线｜西夏陵博物馆·陵园·贺兰山岩画",
      locations: ["西夏陵博物馆", "西夏陵遗址", "贺兰山岩画", "银川"],
      schedule: [
        { id: "d13-depart", time: "07:15", type: "drive", text: "银川出发前往西夏陵。", placeIds: ["yinchuan", "xixia-tombs"] },
        { id: "d13-museum", time: "08:00—10:00", type: "attraction", text: "先看西夏陵博物馆，建立西夏历史、考古和陵寝制度背景。", placeId: "xixia-tombs" },
        { id: "d13-tombs", time: "10:00—12:00", type: "attraction", text: "进入西夏陵遗址区，先馆后陵。", placeId: "xixia-tombs" },
        { id: "d13-rock", time: "下午", type: "attraction", text: "贺兰山岩画；如国庆客流或体力不理想，保西夏陵、舍岩画，不追加镇北堡。", placeId: "helan-rock-art" },
        { id: "d13-return", time: "傍晚", type: "drive", text: "返回银川休息。", placeId: "yinchuan" }
      ]
    },
    14: {
      title: "银川→上海｜宁夏博物馆·晚班机主返程",
      locations: ["宁夏博物馆", "银川", "银川河东国际机场"],
      schedule: [
        { id: "d14-breakfast", time: "08:00—08:45", type: "rest", text: "早餐、整理行李，大件行李留酒店或装车。" },
        { id: "d14-museum", time: "09:00—11:45", type: "attraction", text: "宁夏博物馆，重点串联宁夏历史、西夏、岩画与丝路脉络。", placeId: "ningxia-museum" },
        { id: "d14-lunch", time: "11:45—13:00", type: "restaurant", text: "银川午餐，优先选择顺路且不排长队的餐厅。", placeId: "yinchuan" },
        { id: "d14-luggage", time: "13:00—14:00", type: "rest", text: "取行李，检查证件、充电设备、票据和购物物品。" },
        { id: "d14-return-car", time: "14:00后", type: "return", text: "加油、拍摄车身/轮毂/内饰/油表、检查ETC与停车费后前往河东机场还车；主方案需把现有10/8还车订单提前到10/7。", placeId: "yinchuan-airport" },
        { id: "d14-flight", time: "18:30以后 · 主方案", type: "flight", text: "银川晚班机返上海。若最终航班17:30—18:30，博物馆压缩至09:00—11:00；17:30以前则删除博物馆，不冒返程风险。" },
        { id: "d14-option", time: "备选 · 10/8返程", type: "free", text: "若改为10月8日返程：10月7日博物馆照常，下午自由休整并延住银川1晚；10月8日上午按原订单还车后返沪。", placeId: "yinchuan" }
      ]
    }
  };

  const DAY_EXTRAS = {
    1: { photo: "晋祠古建用24—35mm记录轴线与屋檐层次；植物园日落前拍温室建筑轮廓。", outfit: "太原昼夜温差开始明显，轻薄外层＋舒适步行鞋。", fallback: "航班或取车延误时优先保晋祠；植物园压缩为日落前短访。" },
    2: { photo: "山西博物院以建筑外观和晋魂重点展品为主；古城蓝调后再拍打铁花，手机开启连拍并避免过曝。", outfit: "古城夜间停留长，带轻薄防风外层。", fallback: "打铁花临时取消时，改为古城夜景与小吃，不跨城追演出。" },
    3: { photo: "雁门关拍关城纵深和长城线条；木塔尽量用中长焦减少广角畸变。", outfit: "关口风大，防风外套优先；鞋底要适合石阶。", fallback: "雁门关大风/管制时缩短为核心关城；净土寺自动取消。" },
    4: { photo: "悬空寺外观适合中长焦压缩山体与木构关系；浑源古建注意室内壁画禁闪光。", outfit: "早晨山谷偏冷，分层穿衣。", fallback: "无登临票：寺下观景＋MR→永安寺→圆觉寺→大同。" },
    5: { photo: "云冈洞窟遵守禁拍区域；古城傍晚利用城墙和屋檐形成层次。", outfit: "全天步行较多，软底鞋；洞窟内外温差带薄外套。", fallback: "云冈客流过大时压缩古城小景点，保云冈＋华严寺。" },
    6: { photo: "乌兰哈达用广角拍火山锥与公路尺度，风沙天保护镜头。", outfit: "火山区域风大、无遮挡：帽子、防风层、防晒。", fallback: "大风/沙尘/降雨时只保1个核心火山点后直去呼和浩特。" },
    7: { photo: "翻大青山时只在正规停车点记录山南—山北地貌变化；草原日落用低机位拍草甸层次。", outfit: "草原夜间明显降温，保暖层＋防风层。", fallback: "草原天气差时缩短户外，优先博物院与营地休息。" },
    8: { photo: "长转场日不追景，包头/河套沿线只做安全短停。", outfit: "车内外温差管理，方便穿脱的分层最实用。", fallback: "国庆首日拥堵明显时取消包头额外停留，只补给。" },
    9: { photo: "岩画如正规开放，使用中长焦记录纹样，不触摸岩面；腾格里第一晚优先沙丘日落。", outfit: "山沟与沙漠温差大，防风防晒并备头巾。", fallback: "阴山岩画道路/接待任一不确认就取消；乌海湖只做可选短停。" },
    10:{ photo: "上午拍湖色、沙丘线条与车辙，中午减少暴晒，17:00后拍日落蓝调。", outfit: "墨镜、帽/头巾、防晒、防风层、足量饮水随身。", fallback: "大风、沙尘、强降雨或运营方判断不宜深入时缩短线路，不以集齐五湖为目标。" },
    11:{ photo: "66号公路只在安全停车区域构图，绝不站车道中央；黄河沿线可用长焦拍层次。", outfit: "公路风大，轻便防风外层；鞋子以步行舒适为主。", fallback: "体力不足时取消北长滩/黄河沿线，只保高庙＋66号公路。" },
    12:{ photo: "览山公园17:30前后就位，拍贺兰山方向日落和蓝调；夜市用手机夜景模式。", outfit: "傍晚湖边/开阔地降温快，带薄羽绒或抓绒视天气决定。", fallback: "览山如因活动临时封闭，直接银川市区晚餐休息。" },
    13:{ photo: "西夏陵先馆后陵，遗址区用中长焦压缩陵塔与贺兰山；岩画禁触摸。", outfit: "西线日晒强且步行多，遮阳＋舒适鞋。", fallback: "国庆客流或体力不足时保西夏陵，舍贺兰山岩画。" },
    14:{ photo: "博物馆以展陈记录为主，机场日不再安排追光；把精力留给还车和返程。", outfit: "返程穿着以车内/机场舒适和方便安检为主。", fallback: "航班早于18:30按规则压缩博物馆；改10/8返程则下午完全留作休整。" }
  };

  const TICKETS = [
    { id: "ticket-hanging-temple", day: 4, name: "悬空寺登临票", requirement: "required", guidance: "最高优先级；线上未抢到则早晨第一轮尝试线下票，失败即执行备选方案。" },
    { id: "ticket-yungang", day: 5, name: "云冈石窟实名预约", requirement: "required", guidance: "按官方当前预约周期提前锁定第一时段。" },
    { id: "ticket-inner-mongolia-museum", day: 7, name: "内蒙古博物院预约", requirement: "recommended", guidance: "临近出行按当期规则预约。" },
    { id: "ticket-tengger", day: 10, name: "腾格里五湖穿越运营方", requirement: "required", guidance: "确认正规运营方、车辆、司机、集合点、路线和返程时间。" },
    { id: "ticket-xixia", day: 13, name: "西夏陵预约/门票", requirement: "recommended", guidance: "国庆期间建议提前预约并尽量第一时段。" },
    { id: "ticket-ningxia-museum", day: 14, name: "宁夏博物馆预约", requirement: "recommended", guidance: "按现行规则临近日期预约；当天如航班过早则取消。" }
  ];

  function upsertById(array, item) {
    const index = array.findIndex((entry) => entry.id === item.id);
    if (index >= 0) array[index] = { ...array[index], ...item };
    else array.push(item);
  }

  function patchMap(data) {
    const map = data.map;
    if (!map) return;
    const additions = [
      { id: "yanmen-pass", name: "雁门关", geo: { lat: 39.0, lng: 112.9 }, countryCode: "CN", approximate: true },
      { id: "yinshan-rock-art", name: "阴山岩画（磴口方向）", geo: { lat: 40.3, lng: 106.9 }, countryCode: "CN", approximate: true },
      { id: "zhongwei-gaomiao", name: "中卫高庙", geo: { lat: 37.5, lng: 105.19 }, countryCode: "CN", approximate: true },
      { id: "lanshan-park", name: "览山公园", geo: { lat: 38.5, lng: 106.2 }, countryCode: "CN", approximate: true },
      { id: "ningxia-museum", name: "宁夏博物馆", geo: { lat: 38.49, lng: 106.23 }, countryCode: "CN", approximate: true },
      { id: "yinchuan-airport", name: "银川河东国际机场", geo: { lat: 38.32, lng: 106.39 }, countryCode: "CN", approximate: true }
    ];
    additions.forEach((place) => upsertById(map.places || (map.places = []), place));
    const routeByDay = {
      3: ["xinzhou-ancient-city", "yanmen-pass", "yingxian-pagoda", "hunyuan"],
      9: ["bayannur", "yinshan-rock-art", "wuhai-lake", "tengger-desert"],
      11:["tengger-desert", "zhongwei-gaomiao", "zhongwei-route66", "zhongwei"],
      12:["zhongwei", "wuzhong", "yinchuan", "lanshan-park", "huaiyuan-night-market"],
      14:["yinchuan", "ningxia-museum", "yinchuan-airport"]
    };
    [map.routes, map.dailyRoutes].forEach((routes) => {
      if (!Array.isArray(routes)) return;
      Object.entries(routeByDay).forEach(([day, placeIds]) => {
        const number = Number(day);
        const found = routes.find((r) => r.day === number);
        if (found) found.placeIds = placeIds;
        else routes.push({ day: number, placeIds });
      });
    });
  }

  function patchFrozenRouteMap(data) {
    const source = data.routeMap?.regions?.[0];
    if (!source) return;
    const colorFor = (day) => ({3:"#618344",9:"#618344",11:"#8865a5",12:"#df6185",14:"#e77e22"}[day] || "#397dc1");
    const addPlace = (place) => upsertById(source.places || (source.places = []), place);
    addPlace({ id:"yanmen-pass", x:1147, y:565, color:colorFor(3), tx:1040, ty:560, size:24, anchor:"end", lines:["雁门关"], query:"雁门关 山西 忻州 代县", days:[3] });
    addPlace({ id:"yinshan-rock-art", x:710, y:442, color:colorFor(9), tx:600, ty:430, size:24, anchor:"end", lines:["阴山岩画","磴口方向"], query:"阴山岩画 磴口 巴彦淖尔", days:[9] });
    addPlace({ id:"zhongwei-gaomiao", x:618, y:736, color:colorFor(11), tx:650, ty:776, size:24, anchor:"start", lines:["中卫高庙"], query:"中卫高庙 宁夏", days:[11] });
    addPlace({ id:"lanshan-park", x:646, y:610, color:colorFor(12), tx:720, ty:650, size:24, anchor:"start", lines:["览山公园"], query:"览山公园 银川", days:[12] });
    addPlace({ id:"ningxia-museum", x:690, y:562, color:colorFor(14), tx:750, ty:535, size:24, anchor:"start", lines:["宁夏博物馆"], query:"宁夏博物馆 银川", days:[14] });
    addPlace({ id:"yinchuan-airport", x:735, y:650, color:colorFor(14), tx:790, ty:700, size:24, anchor:"start", lines:["银川河东","国际机场"], query:"银川河东国际机场", days:[14] });

    const updates = {
      3: { placeIds:["xinzhou-ancient-city","yanmen-pass","yingxian-pagoda","hunyuan"], paths:["M1146.41 618.87 C1148 600 1148 585 1147 565 C1147 548 1147 531 1147.86 516.52 C1184.9 514 1218.2 501.7 1246 480.23"], overviewPaths:["M1146.41 618.87 C1166.4 561.8 1200.3 514.6 1246 480.23"] },
      9: { placeIds:["bayannur","yinshan-rock-art","wuhai-lake","tengger-desert"], paths:["M727.57 392.13 C720 410 714 426 710 442 C704 462 694 480 682.54 496.69 C620.9 546.1 577.5 608.2 554.9 679.49"], overviewPaths:["M727.57 392.13 C694.6 505.3 635.9 603.0 554.9 679.49"] },
      11:{ placeIds:["tengger-desert","zhongwei-gaomiao","zhongwei-route66","zhongwei"], paths:["M554.9 679.49 C576 700 596 720 618 736 C598 744 574 751 551.21 751.29 C571.1 745.1 587.8 734.1 600.21 718.75"], overviewPaths:["M554.9 679.49 C574.2 688.3 589.6 701.7 600.21 718.75"] },
      12:{ placeIds:["zhongwei","wuzhong","yinchuan","lanshan-park","huaiyuan-night-market"], paths:["M600.21 718.75 C621.7 712.1 639.6 700.2 652.97 683.67 C650.5 647.4 658 613.4 675.02 583.54 C665 590 654 600 646 610 C622 608 600 610 577.8 614.8"], overviewPaths:["M600.21 718.75 C639.2 680.3 664.6 634.3 675.02 583.54 C645.1 603.9 612 614.5 577.8 614.8"] },
      14:{ placeIds:["yinchuan","ningxia-museum","yinchuan-airport"], paths:["M675.02 583.54 C680 574 684 568 690 562 C708 585 724 616 735 650"], overviewPaths:["M675.02 583.54 C696 600 716 623 735 650"] }
    };
    Object.entries(updates).forEach(([day, patch]) => {
      const number = Number(day);
      let route = source.routes.find((r) => r.day === number);
      if (!route) { route = { day:number, color:colorFor(number) }; source.routes.push(route); }
      Object.assign(route, patch, { color: route.color || colorFor(number) });
    });
    source.days = [...new Set([...(source.days || []),14])].sort((a,b)=>a-b);
    source.title = "山西·内蒙古·宁夏 · 14天自驾路线";
    source.ariaLabel = "山西·内蒙古·宁夏14天自驾路线总览";
    source.description = "上海飞太原取车，经山西晋北古建与边塞、内蒙古火山草原和阴山河套，再进入腾格里与宁夏，10月7日银川晚班机返沪，10月8日为备选。";
    source.disclaimer = "路线为行程示意；实时驾驶、拥堵与导航以高德地图为主，百度地图为备用。新增点位的示意位置只用于路线总览，不代表精确地图比例。";
  }

  function patchTripData(data) {
    if (!data || data.metadata?.tripId !== TRIP_ID) return;
    data.metadata.title = "晋蒙宁14天自驾旅行手册｜2026.09.24—10.07";
    data.trip.routeSummary = "上海飞太原取车，经晋祠—忻州古城/打铁花—雁门关—应县木塔—悬空寺/浑源古建—大同—乌兰哈达—翻越阴山·大青山—希拉穆仁—河套—阴山岩画—腾格里—中卫—吴忠—银川；10月7日晚班机返沪为主方案，10月8日返程为次选。";
    NEW_PLACES.forEach((place) => upsertById(data.places || (data.places=[]), place));
    Object.entries(DAY_PATCHES).forEach(([day, patch]) => {
      const target = data.days.find((item) => item.day === Number(day));
      if (target) Object.assign(target, patch);
    });
    data.ticketPlanning = data.ticketPlanning || { items: [] };
    data.ticketPlanning.items = TICKETS.map((ticket) => ({ ...ticket, title: ticket.name }));
    data.travelExtras = { version: VERSION, dayExtras: DAY_EXTRAS, mapProvider: "amap", fallbackMapProvider: "baidu" };
    patchMap(data);
    patchFrozenRouteMap(data);
    data.mapLinks = data.mapLinks || {};
    data.mapLinks.note = "导航默认使用高德地图；百度地图作为备用。路线总览为示意，实时路况与驾驶时间以当天高德导航为准。";
  }

  document.addEventListener("travel-data-ready", (event) => patchTripData(event.detail), { once: true });

  try { mapsSearch = AMAP_SEARCH; } catch {}

  function makeMapServiceActions(query, label) {
    const safeQuery = String(query || label || "").trim();
    return `<div class="cn-map-actions">
      <a class="map-primary" href="${esc(AMAP_SEARCH(safeQuery))}" target="_blank" rel="noopener noreferrer">高德地图 ↗</a>
      <a href="${esc(BAIDU_SEARCH(safeQuery))}" target="_blank" rel="noopener noreferrer">百度地图 ↗</a>
      <button type="button" data-copy-map-query="${esc(safeQuery)}">复制地点</button>
    </div><p class="cn-map-note">高德为主导航，百度为备用。路线时间以当天实时导航为准。</p>`;
  }

  try {
    setupPlaceMap = function setupPlaceMapCN() {
      const panel = document.querySelector("#place-map");
      if (!panel) return;
      const frame = document.querySelector("#place-map-frame");
      if (frame) frame.hidden = true;
      let actions = panel.querySelector(".cn-map-sheet-actions");
      if (!actions) {
        actions = document.createElement("div");
        actions.className = "cn-map-sheet-actions";
        frame?.insertAdjacentElement("afterend", actions);
      }
      const external = document.querySelector("#place-map-external");
      if (external) external.hidden = true;
      const note = panel.querySelector("footer p");
      if (note) note.textContent = "默认使用高德地图，百度地图为备用；需要联网。";
      let opener = null;
      let previousOverflow = "";
      const close = () => {
        panel.hidden = true;
        document.body.style.overflow = previousOverflow;
        opener?.focus();
      };
      document.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-map-query]");
        if (!button) return;
        event.preventDefault();
        opener = button;
        const query = button.dataset.mapQuery || button.dataset.mapLabel;
        document.querySelector("#place-map-title").textContent = button.dataset.mapLabel || query;
        actions.innerHTML = makeMapServiceActions(query, button.dataset.mapLabel);
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        panel.hidden = false;
        document.querySelector("#place-map-close")?.focus();
      });
      document.querySelector("#place-map-close").onclick = close;
      panel.addEventListener("click", (event) => { if (event.target === panel) close(); });
      panel.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
    };
  } catch {}

  function replaceRouteGooglePopover(popover) {
    if (!popover || popover.dataset.cnMaps === "1") return;
    const iframe = popover.querySelector("iframe");
    const ext = popover.querySelector("[data-popup-external]");
    const label = popover.querySelector("[data-popup-place-label]")?.textContent || "地点";
    let query = label;
    if (ext?.href) {
      try {
        const url = new URL(ext.href);
        query = url.searchParams.get("keyword") || url.searchParams.get("query") || label;
      } catch {}
    }
    if (iframe) iframe.replaceWith(Object.assign(document.createElement("div"), { className:"route-map-service-panel", innerHTML:makeMapServiceActions(query,label) }));
    if (ext) ext.remove();
    popover.setAttribute("aria-label", "地点导航");
    popover.dataset.cnMaps = "1";
  }

  const routeObserver = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches?.(".route-place-popover")) replaceRouteGooglePopover(node);
        node.querySelectorAll?.(".route-place-popover").forEach(replaceRouteGooglePopover);
      }
    }
  });
  routeObserver.observe(document.documentElement, { childList:true, subtree:true });

  const getLocalJson = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(STORE_PREFIX + key)) ?? fallback; } catch { return fallback; }
  };
  const setLocalJson = (key, value) => localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value));

  let cloudEditPin = sessionStorage.getItem(STORE_PREFIX + "edit-pin") || "";
  let cloudCheckins = new Set();
  let localCheckins = new Set(getLocalJson("checkins", []));
  let cloudAvailable = false;

  async function loadCloudEnhancements() {
    const tripId = window.TRAVEL_PLAN_DATA?.metadata?.tripId;
    if (!tripId || window.TRAVEL_PLAN_CONFIG?.persistence?.mode !== "d1") return;
    try {
      const response = await fetch(`/api/trip/${encodeURIComponent(tripId)}?collections=checkins,attachments`, { cache:"no-store" });
      if (!response.ok) return;
      const snapshot = await response.json();
      cloudCheckins = new Set((snapshot.checkins || []).filter((item) => item.completed !== false).map((item) => item.id));
      cloudAvailable = true;
      decorateTimeline();
      renderTripMode();
    } catch (error) { console.warn("Cloud enhancement state unavailable", error); }
  }

  async function cloudChange(collection, id, value, op = "upsert") {
    const tripId = window.TRAVEL_PLAN_DATA?.metadata?.tripId;
    if (!tripId || window.TRAVEL_PLAN_CONFIG?.persistence?.mode !== "d1") return false;
    if (!cloudEditPin) {
      cloudEditPin = window.prompt("输入同行共享编辑码（仅本次浏览器会话保存）") || "";
      if (!cloudEditPin) return false;
      sessionStorage.setItem(STORE_PREFIX + "edit-pin", cloudEditPin);
    }
    const response = await fetch(`/api/trip/${encodeURIComponent(tripId)}?collections=${collection}`, {
      method:"POST",
      headers:{ "content-type":"application/json", "x-edit-pin":cloudEditPin },
      body:JSON.stringify({ changes:[{ collection, id, op, value }] })
    });
    if (response.status === 401) {
      cloudEditPin = "";
      sessionStorage.removeItem(STORE_PREFIX + "edit-pin");
      alert("编辑码不正确，请重试。");
      return false;
    }
    if (!response.ok) throw new Error(`Cloud save failed: ${response.status}`);
    cloudAvailable = true;
    return true;
  }

  function isChecked(key) { return cloudCheckins.has(key) || localCheckins.has(key); }
  async function toggleCheckin(key, completed) {
    if (completed) localCheckins.add(key); else localCheckins.delete(key);
    setLocalJson("checkins", [...localCheckins]);
    decorateTimeline();
    renderTripMode();
    if (cloudAvailable || window.TRAVEL_PLAN_CONFIG?.persistence?.mode === "d1") {
      try {
        const ok = await cloudChange("checkins", key, { id:key, completed, updatedAt:new Date().toISOString() }, completed ? "upsert" : "delete");
        if (ok) { if (completed) cloudCheckins.add(key); else cloudCheckins.delete(key); }
      } catch (error) { console.warn(error); }
    }
  }

  function scheduleKey(day, item) { return `d${day.day}:${item.id || item.text}`; }

  function decorateTimeline() {
    const data = window.TRAVEL_PLAN_DATA;
    const timeline = document.querySelector("#timeline");
    if (!data || !timeline) return;
    timeline.querySelectorAll(".day-card").forEach((card) => {
      const day = data.days.find((item) => item.day === Number(card.dataset.day));
      if (!day) return;
      const items = [...card.querySelectorAll(".schedule-item")];
      items.forEach((element, index) => {
        const item = day.schedule[index];
        if (!item || !["attraction","restaurant"].includes(item.type)) return;
        const key = scheduleKey(day,item);
        let row = element.querySelector(".enh-stop-actions");
        if (!row) {
          row = document.createElement("div");
          row.className = "enh-stop-actions";
          element.querySelector(".schedule-content")?.append(row);
        }
        row.innerHTML = `<button type="button" class="checkin-btn${isChecked(key)?" is-done":""}" data-checkin-key="${esc(key)}">${isChecked(key)?"✓ 已去过":"○ 打卡"}</button><button type="button" class="attach-btn" data-attach-key="${esc(key)}" data-attach-label="${esc(item.text)}">＋ 资料</button>`;
      });
      let extra = card.querySelector(".day-extra-grid");
      const info = DAY_EXTRAS[day.day];
      if (info && !extra) {
        extra = document.createElement("div");
        extra.className = "day-extra-grid";
        extra.innerHTML = `<details><summary>📷 摄影提示</summary><p>${esc(info.photo)}</p></details><details><summary>🧥 穿搭</summary><p>${esc(info.outfit)}</p></details><details><summary>↪ 备选方案</summary><p>${esc(info.fallback)}</p></details>`;
        card.querySelector(".day-detail")?.append(extra);
      }
    });
  }

  function attachmentStore() { return getLocalJson("attachments", {}); }
  function saveAttachmentStore(value) { setLocalJson("attachments", value); }
  function openAttachmentSheet(key, label) {
    let dialog = document.querySelector("#enh-attachment-dialog");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "enh-attachment-dialog";
      dialog.className = "enh-dialog";
      document.body.append(dialog);
    }
    const all = attachmentStore();
    const items = all[key] || [];
    dialog.innerHTML = `<header><div><small>行程资料</small><h2>${esc(label)}</h2></div><button type="button" data-enh-close>关闭</button></header>
      <div class="attachment-list">${items.length ? items.map((item,index)=>`<div class="attachment-row"><a href="${esc(item.url)}" ${item.kind==="file"?"download":"target=\"_blank\" rel=\"noopener noreferrer\""}>${esc(item.label)}</a><button type="button" data-delete-attachment="${index}">删除</button></div>`).join("") : "<p class=\"muted-copy\">还没有保存资料。</p>"}</div>
      <form id="enh-link-form"><label>链接名称<input name="label" maxlength="40" required placeholder="例如：小红书攻略"></label><label>网页链接<input name="url" type="url" required placeholder="https://..."></label><button type="submit">保存链接</button></form>
      <label class="file-upload">保存本机 PDF / 图片（≤20MB）<input id="enh-file-input" type="file" accept="application/pdf,image/*"></label>
      <p class="enh-privacy-note">网页链接可云端共享；本机 PDF/图片当前只保存在此浏览器，暂不上传到云端。</p>`;
    dialog.querySelector("[data-enh-close]").onclick = () => dialog.close();
    dialog.querySelector("#enh-link-form").onsubmit = async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const item = { id:`a-${Date.now()}`, kind:"link", label:String(form.get("label")), url:String(form.get("url")), createdAt:new Date().toISOString() };
      const next = attachmentStore();
      next[key] = [...(next[key] || []), item];
      saveAttachmentStore(next);
      try { await cloudChange("attachments", `${key}:${item.id}`, { ...item, placeKey:key }); } catch (error) { console.warn(error); }
      openAttachmentSheet(key,label);
    };
    dialog.querySelector("#enh-file-input").onchange = (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > 20*1024*1024) { alert("单个文件不能超过20MB。"); return; }
      const reader = new FileReader();
      reader.onload = () => {
        const next = attachmentStore();
        next[key] = [...(next[key] || []), { id:`f-${Date.now()}`, kind:"file", label:file.name, url:reader.result, createdAt:new Date().toISOString() }];
        try { saveAttachmentStore(next); openAttachmentSheet(key,label); } catch { alert("浏览器本地空间不足，未能保存该文件。"); }
      };
      reader.readAsDataURL(file);
    };
    dialog.querySelectorAll("[data-delete-attachment]").forEach((button)=>button.onclick=()=>{
      const next = attachmentStore();
      next[key] = [...(next[key] || [])];
      next[key].splice(Number(button.dataset.deleteAttachment),1);
      saveAttachmentStore(next);
      openAttachmentSheet(key,label);
    });
    dialog.showModal();
  }

  function injectStatusBar() {
    if (document.querySelector("#enh-status-bar")) return;
    const hero = document.querySelector("#top");
    if (!hero) return;
    const bar = document.createElement("div");
    bar.id = "enh-status-bar";
    bar.className = "enh-status-bar";
    bar.innerHTML = `<div><span>距出发</span><strong id="enh-countdown">—</strong></div><div><span>北京时间</span><strong id="enh-clock">—</strong></div><button type="button" id="enh-theme-toggle" aria-label="切换深浅主题">◐ 主题</button>`;
    hero.append(bar);
    const theme = localStorage.getItem(STORE_PREFIX+"theme") || "light";
    document.documentElement.dataset.theme = theme;
    document.querySelector("#enh-theme-toggle").onclick = () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem(STORE_PREFIX+"theme",next);
    };
    const tick = () => {
      const target = new Date("2026-09-24T07:00:00+08:00");
      const diff = target - new Date();
      document.querySelector("#enh-countdown").textContent = diff <= 0 ? "旅程已开始" : `${Math.floor(diff/86400000)}天 ${String(Math.floor(diff%86400000/3600000)).padStart(2,"0")}:${String(Math.floor(diff%3600000/60000)).padStart(2,"0")}:${String(Math.floor(diff%60000/1000)).padStart(2,"0")}`;
      document.querySelector("#enh-clock").textContent = new Intl.DateTimeFormat("zh-CN",{timeZone:"Asia/Shanghai",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(new Date());
    };
    tick(); setInterval(tick,1000);
  }

  function injectGuideSections() {
    if (document.querySelector("#enh-guide")) return;
    const itinerary = document.querySelector("#itinerary");
    if (!itinerary) return;
    const section = document.createElement("section");
    section.className = "section enh-guide-section";
    section.id = "enh-guide";
    section.innerHTML = `<div class="section-heading"><div><p class="section-kicker">TRIP TOOLKIT</p><h2>旅行工具</h2></div><span class="soft-label">V2</span></div>
      <div class="tool-card-grid">
        <article><span>地图</span><h3>高德为主 · 百度备用</h3><p>所有地点和路线按钮默认跳转高德地图；百度作为备用入口。总览图保留当前页面的统一视觉。</p></article>
        <article><span>返程</span><h3>10/7 晚班机主方案</h3><p>10/7 宁夏博物馆后还车返沪；10/8为次选，前一日继续在银川休整。</p></article>
        <article><span>悬空寺</span><h3>无登临票不死等</h3><p>寺下观景＋MR→永安寺→圆觉寺→大同，保住晋北古建主线。</p></article>
        <article><span>沙漠</span><h3>五湖不写死</h3><p>正规运营方越野车；湖泊与顺序随水位、风沙和道路动态调整，租赁SUV不进沙。</p></article>
      </div>
      <details class="route-story"><summary>查看全程地理主线</summary><p>晋祠/晋文化 → 忻州古城与雁门关边塞 → 应县木塔、悬空寺、大同北魏与辽金古建 → 乌兰哈达火山 → 翻越阴山·大青山进入希拉穆仁 → 阴山南麓与河套 → 阴山岩画 → 腾格里 → 中卫黄河走廊 → 银川西夏与贺兰山 → 宁夏博物馆收尾。</p></details>`;
    itinerary.insertAdjacentElement("afterend", section);
  }

  let tripModeDay = 1;
  let tripModeTab = "schedule";
  function tripModeMarkup(day) {
    const extra = DAY_EXTRAS[day.day] || {};
    const tabButtons = `<nav class="trip-mode-tabs"><button data-tm-tab="schedule" aria-pressed="${tripModeTab==="schedule"}">行程</button><button data-tm-tab="map" aria-pressed="${tripModeTab==="map"}">路线</button><button data-tm-tab="photo" aria-pressed="${tripModeTab==="photo"}">摄影/穿搭</button><button data-tm-tab="ledger" aria-pressed="${tripModeTab==="ledger"}">记账</button></nav>`;
    let body = "";
    if (tripModeTab === "schedule") body = `<div class="tm-stops">${day.schedule.map((item)=>{const key=scheduleKey(day,item); return `<article><time>${esc(item.time)}</time><p>${esc(item.text)}</p>${["attraction","restaurant"].includes(item.type)?`<div><button data-checkin-key="${esc(key)}" class="checkin-btn${isChecked(key)?" is-done":""}">${isChecked(key)?"✓ 已去过":"○ 打卡"}</button><button data-attach-key="${esc(key)}" data-attach-label="${esc(item.text)}">＋ 资料</button></div>`:""}</article>`}).join("")}</div>`;
    if (tripModeTab === "map") body = `<div class="tm-route"><p>${esc(day.locations.join(" → "))}</p>${day.locations.map((name,index)=>`<div><b>${index+1}</b><span>${esc(name)}</span><a href="${esc(AMAP_SEARCH(name))}" target="_blank" rel="noopener noreferrer">高德</a><a href="${esc(BAIDU_SEARCH(name))}" target="_blank" rel="noopener noreferrer">百度</a></div>`).join("")}</div>`;
    if (tripModeTab === "photo") body = `<div class="tm-advice"><article><h3>摄影</h3><p>${esc(extra.photo||"按当天光线和现场规则调整。")}</p></article><article><h3>穿搭</h3><p>${esc(extra.outfit||"以舒适和天气适配为主。")}</p></article><article><h3>备选</h3><p>${esc(extra.fallback||"按当天路况和体力调整。")}</p></article></div>`;
    if (tripModeTab === "ledger") body = `<div class="tm-ledger"><p>多人记账、分摊和结算继续使用原网页的云端记账模块。</p><button type="button" data-open-ledger>打开记账</button></div>`;
    return `${tabButtons}${body}`;
  }

  function renderTripMode() {
    const dialog = document.querySelector("#trip-mode-dialog");
    const data = window.TRAVEL_PLAN_DATA;
    if (!dialog || !data) return;
    const day = data.days.find((item)=>item.day===tripModeDay) || data.days[0];
    dialog.querySelector(".trip-mode-day-tabs").innerHTML = data.days.map((item)=>`<button type="button" data-tm-day="${item.day}" aria-pressed="${item.day===day.day}">${item.date.slice(5).replace("-","/")}</button>`).join("");
    dialog.querySelector("#trip-mode-title").textContent = `DAY ${String(day.day).padStart(2,"0")} · ${day.title}`;
    dialog.querySelector(".trip-mode-body").innerHTML = tripModeMarkup(day);
  }

  function injectTripMode() {
    if (document.querySelector("#trip-mode-dialog")) return;
    const button = document.createElement("button");
    button.className = "trip-mode-launch";
    button.type = "button";
    button.textContent = "旅行模式";
    document.body.append(button);
    const dialog = document.createElement("dialog");
    dialog.id = "trip-mode-dialog";
    dialog.className = "trip-mode-dialog";
    dialog.innerHTML = `<div class="trip-mode-shell"><header><div><small>TRIP MODE</small><h2 id="trip-mode-title">旅行模式</h2></div><button type="button" data-trip-mode-close aria-label="关闭">×</button></header><div class="trip-mode-day-tabs"></div><div class="trip-mode-body"></div></div>`;
    document.body.append(dialog);
    button.onclick = () => { renderTripMode(); dialog.showModal(); };
    dialog.querySelector("[data-trip-mode-close]").onclick = () => dialog.close();
    dialog.addEventListener("click", (event) => {
      const dayButton = event.target.closest("[data-tm-day]");
      if (dayButton) { tripModeDay = Number(dayButton.dataset.tmDay); renderTripMode(); return; }
      const tab = event.target.closest("[data-tm-tab]");
      if (tab) { tripModeTab = tab.dataset.tmTab; renderTripMode(); return; }
      if (event.target.closest("[data-open-ledger]")) { dialog.close(); location.hash="#ledger"; window.dispatchEvent(new HashChangeEvent("hashchange")); }
      if (event.target === dialog) dialog.close();
    });
  }

  document.addEventListener("click", (event) => {
    const check = event.target.closest("[data-checkin-key]");
    if (check) { toggleCheckin(check.dataset.checkinKey, !isChecked(check.dataset.checkinKey)); return; }
    const attach = event.target.closest("[data-attach-key]");
    if (attach) { openAttachmentSheet(attach.dataset.attachKey, attach.dataset.attachLabel || "行程资料"); return; }
    const copy = event.target.closest("[data-copy-map-query]");
    if (copy) navigator.clipboard?.writeText(copy.dataset.copyMapQuery).then(()=>{copy.textContent="已复制"; setTimeout(()=>copy.textContent="复制地点",1200)}).catch(()=>{});
  });

  document.addEventListener("DOMContentLoaded", () => {
    injectStatusBar();
    injectTripMode();
    const wait = setInterval(() => {
      if (!window.TRAVEL_PLAN_DATA || !document.querySelector("#timeline")?.children.length) return;
      clearInterval(wait);
      injectGuideSections();
      decorateTimeline();
      loadCloudEnhancements();
    }, 120);
    setTimeout(()=>clearInterval(wait),10000);
  });
})();
