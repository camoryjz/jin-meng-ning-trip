(() => {
  "use strict";

  const GUIDES = [
    {
      id: "jinci", name: "晋祠", aliases: ["晋祠博物馆"],
      overview: "晋祠是太原最有代表性的古建与园林组合之一，以晋国历史记忆为线索，把祠庙建筑、古树、泉水和历代碑刻集中在一处。这里不是单看一座殿，而是看中国古代建筑在不同年代不断叠加后的完整空间。",
      why: "这趟山西段会看很多古建筑，晋祠很适合作为第一站：先建立斗拱、殿堂、祠庙和山西古建的基本感觉，后面到应县、大同会更容易看懂。",
      highlights: ["圣母殿：晋祠最核心的古建筑之一", "鱼沼飞梁：很有辨识度的古代桥梁形制", "古树、泉水与祠庙院落形成的整体景观", "碑刻、匾额和建筑细节，适合慢慢看"],
      tips: ["景区范围比想象中大，别把时间全耗在外围公园", "古建内部光线偏暗，拍照注意禁闪光和现场规定", "D1还要去植物园，建议抓核心建筑，不追求每个院落都看完"]
    },
    {
      id: "taiyuan-botanical", name: "太原植物园", aliases: ["太原植物园"],
      overview: "太原植物园兼具植物展示和现代建筑观赏价值，温室穹顶、湖面和山地地形在日落前后特别有层次。它和前面的晋祠完全是两种气质，适合作为第一天的轻松收尾。",
      why: "不是为了把所有植物分类看一遍，而是看现代温室建筑、植物景观和日落蓝调，让第一天从古建切换到更轻松的城市景观。",
      highlights: ["大型温室建筑群及室内不同生态主题", "湖面与穹顶倒影", "日落前后的园区天际线", "适合轻松散步的景观轴线"],
      tips: ["D1航班和晋祠都可能产生延误，植物园不要卡太死", "温室和园区停止入场时间可能早于闭园时间，以当天公告为准", "夜间温差明显，九月底建议随身带薄外套"]
    },
    {
      id: "shanxi-museum", name: "山西博物院", aliases: ["山西博物馆"],
      overview: "山西博物院是理解整趟山西行程的知识入口。展览从史前、晋国与三晋文明一路延伸到佛教艺术、陶瓷、戏曲和古建筑，能把后面雁门关、云冈、大同古建放进完整的历史脉络。",
      why: "山西的看点很多，但如果没有历史框架容易只剩拍照。先看博物院，后面看到北魏石窟、辽金木构和边塞遗址时会更有感觉。",
      highlights: ["晋国与三晋相关青铜器", "山西古代文明主线陈列", "佛教造像、陶瓷与艺术专题", "古建筑相关展示，适合为后续古建之旅预热"],
      tips: ["建议给2.5—3小时，不要在单个展柜停留过久", "热门日期需提前预约，入馆安检也要预留时间", "如果时间有限，优先看与晋国、北朝和古建筑相关的展厅"]
    },
    {
      id: "xinzhou-ancient-city", name: "忻州古城", aliases: ["忻州古城"],
      overview: "忻州古城适合把它当作傍晚到夜间的城市漫游空间。这里既保留和恢复了古城街巷、书院等文化节点，也有大量餐饮和夜游内容，节奏比白天的博物馆轻松。",
      why: "D2白天信息量很大，晚上在古城散步、吃饭、看演出，可以让当天从知识型参观自然过渡到民俗体验。",
      highlights: ["秀容书院及古城街巷", "城内传统建筑和夜景", "地方小吃与夜间氛围", "打铁花等节庆或夜间演出"],
      tips: ["节假日夜间人流会明显增加，停车和步行时间要多留一点", "商业街不必每条都走，按演出时间倒推游逛范围", "打铁花场次与观看区域以当天出票页面和现场通知为准"]
    },
    {
      id: "iron-flower", name: "打铁花", aliases: ["打铁花"],
      overview: "打铁花是一种以高温铁水击打形成火花雨的传统民俗表演。真正的看点不是舞台剧情，而是铁花在夜空瞬间爆开的视觉冲击和传统技艺本身。",
      why: "它和山西古建、石窟是完全不同的体验，能给行程加入更鲜活的民俗记忆。",
      highlights: ["铁花爆开的瞬间和层次", "夜间火光与古城环境的组合", "表演者的节奏和配合"],
      tips: ["务必在规定观看区内停留，不越过安全线", "靠前区域可能有烟尘、火星和高温感，按现场要求保持距离", "演出时间可能因天气或活动调整，以当天公告为准"]
    },
    {
      id: "yanmen-pass", name: "雁门关", aliases: ["雁门关景区"],
      overview: "雁门关位于晋北重要山口，是理解山西边塞史、长城防御体系和南北交通的关键地点。这里的价值不只是一段城墙，而是山口地形、关城和古道共同构成的军事空间。",
      why: "从太原一路北上后，在这里能直观理解为什么晋北长期是中原与草原之间的重要通道，也为后面进入大同和内蒙古做好地理铺垫。",
      highlights: ["关城与城门", "古关道和山口地形", "长城及周边边塞景观", "站在高处观察关隘与山谷的关系"],
      tips: ["步行有一定坡度，鞋子要防滑舒适", "山口风通常比城市大，九月底体感可能偏冷", "D3后面还有应县木塔，不建议把所有支线全部走完"]
    },
    {
      id: "yingxian-pagoda", name: "应县木塔", aliases: ["佛宫寺释迦塔", "释迦塔"],
      overview: "应县木塔即佛宫寺释迦塔，是辽代木构建筑的代表。真正值得看的不是单纯的高度，而是多层木构、斗拱体系和千年保存状态带来的建筑震撼。",
      why: "如果想理解中国木构建筑为什么令人着迷，应县木塔是这趟路线上最直观的一站之一。",
      highlights: ["远看整塔比例和轮廓", "近看层层斗拱和木构细节", "塔内佛像与宗教空间，开放范围以现场为准", "不同角度观察塔身微妙的结构变化"],
      tips: ["内部开放区域和参观方式以当天现场规定为准", "不要只在正面拍照，绕行不同角度更容易看懂结构", "国庆前后客流较大，拍照后尽量快速让位"]
    },
    {
      id: "jingtu-temple", name: "净土寺", aliases: ["应县净土寺"],
      overview: "净土寺体量不大，但以精细的古代木构装饰和藻井闻名，是应县木塔之后很适合补充的一处小而精古建。",
      why: "它不是必须打卡的大景点，但如果你们对木构已经开始有兴趣，这里能看到和木塔完全不同的室内空间细节。",
      highlights: ["殿内藻井与天宫楼阁式木作", "古殿内部空间比例", "小尺度寺院的安静氛围"],
      tips: ["D3它是第一顺位可删项，遇到排队或时间不足直接放弃", "室内光线较暗，注意现场拍摄规定", "开放时间可能比大景区更灵活，出发前再确认"]
    },
    {
      id: "hanging-temple", name: "悬空寺", aliases: ["悬空寺景区"],
      overview: "悬空寺依崖壁修建，最吸引人的地方是建筑与山体之间近乎悬挂的关系。远看是整体奇观，登临后则能感受到狭窄栈道、木构支撑和小尺度殿宇如何嵌在崖壁上。",
      why: "它把山西古建从平地寺院带到极端地形，是整趟山西段辨识度最高的建筑体验之一。",
      highlights: ["崖壁上的整体建筑群", "登临后的狭窄栈道和层叠殿阁", "寺下仰视建筑与恒山峡谷的关系", "远近不同视角的结构感"],
      tips: ["登临票与普通景区票不是一回事，严格按预约和现场规则执行", "通道窄、台阶陡，有恐高或行动不便者不要勉强", "无登临票时按既定止损方案看外观/MR，不耗半天等待"]
    },
    {
      id: "yongan-temple", name: "永安寺", aliases: ["浑源永安寺"],
      overview: "永安寺是浑源古城里非常值得看的古寺，空间不大，却以古建筑、壁画和寺院格局见长。相比悬空寺的险，它更适合静下来看细节。",
      why: "如果悬空寺没有登临票，永安寺不是简单替补，而是能让当天仍然保有很高质量的古建和艺术内容。",
      highlights: ["主要殿宇的古建形制", "壁画与宗教艺术细节", "古城寺院相对安静的空间感"],
      tips: ["尊重宗教场所秩序，不使用闪光灯拍摄壁画", "小景点开放管理可能临时变化，现场确认最可靠", "和圆觉寺可以串联短访，不必停留过久"]
    },
    {
      id: "yuanjue-temple", name: "圆觉寺", aliases: ["浑源圆觉寺"],
      overview: "圆觉寺是浑源古城古建群的一部分，以古塔和寺院遗存为主要看点。它适合放在永安寺之后短停，用来补充浑源古城的历史层次。",
      why: "不是为了单独跑一趟，而是和永安寺、浑源古城一起看，形成比只去悬空寺更完整的浑源印象。",
      highlights: ["古塔轮廓", "寺院格局与周边古城环境", "适合快速观察砖石与木构并存的建筑语言"],
      tips: ["建议作为顺路短访点", "如果D4悬空寺耗时较长，可直接压缩或取消", "尊重现场宗教和文保管理要求"]
    },
    {
      id: "yungang-grottoes", name: "云冈石窟", aliases: ["云冈石窟景区"],
      overview: "云冈石窟是北魏时期大型佛教石窟群，能看到早期皇家石窟艺术如何把来自西域、中亚和中原的艺术元素融合在一起。洞窟从宏大的佛像到精细浮雕，信息量非常大。",
      why: "这是理解北魏大同和中国佛教艺术史的核心一站，也是整趟山西行程中最重要的世界级文化遗产体验之一。",
      highlights: ["昙曜五窟所代表的早期大型造像", "第5、6窟等大型洞窟的空间与雕刻", "第20窟露天大佛的经典形象", "洞窟中服饰、乐舞、建筑纹样等细节"],
      tips: ["尽量第一时段进入，越晚核心洞窟越拥挤", "洞窟内按规定拍摄，禁止闪光时务必遵守", "不要追求每一窟都读完，先抓核心洞窟再补充"]
    },
    {
      id: "huayan-temple", name: "华严寺", aliases: ["大同华严寺"],
      overview: "华严寺是大同辽金建筑的重要代表，寺院尺度开阔，建筑、彩塑和佛教空间都很有北方古都气质。",
      why: "云冈看的是北魏石窟，华严寺则把时间推进到辽金，让你们能连续看到大同不同历史时期的艺术和建筑。",
      highlights: ["大雄宝殿等大型古建空间", "薄伽教藏殿及殿内彩塑", "著名的合掌露齿菩萨形象", "寺院中轴和古城天际线"],
      tips: ["午后参观时注意体力分配，D5后面还有多个古城点", "殿内较暗，按现场规定拍摄", "如果时间压缩，优先保留主要古殿和彩塑"]
    },
    {
      id: "nine-dragon-screen", name: "九龙壁", aliases: ["大同九龙壁"],
      overview: "大同九龙壁是明代琉璃影壁的代表，体量不算大，但色彩、龙纹和琉璃烧制细节非常适合近距离观察。",
      why: "它是D5古城线路里的高效率短停点，用很少时间补上一段明代王府建筑装饰史。",
      highlights: ["九条龙的姿态与构图", "琉璃色彩和纹样细节", "整体影壁的比例与水面倒影视角"],
      tips: ["控制在20—30分钟即可", "人多时先看整体，再从侧面近看细节", "不要为了拍空镜耽误华严寺或善化寺"]
    },
    {
      id: "shanhua-temple", name: "善化寺", aliases: ["大同善化寺"],
      overview: "善化寺保留了重要的辽金古建筑，整体氛围比热门景点更安静。这里适合真正看屋顶、斗拱、殿堂尺度和院落关系。",
      why: "如果你们一路看下来已经开始分辨木构差异，善化寺会是非常有满足感的一站。",
      highlights: ["山门、三圣殿、大雄宝殿等古建", "屋顶和斗拱细节", "相对完整的寺院中轴空间"],
      tips: ["D5后半天体力下降时，宁可慢看一个殿也不要急跑", "注意闭门时间，尽量别卡最后入场", "殿内拍摄遵守文保要求"]
    },
    {
      id: "datong-ancient-city", name: "大同古城", aliases: ["大同古城夜游"],
      overview: "大同古城适合夜间散步，把白天零散的华严寺、九龙壁、善化寺等古迹放回一座城市的空间里理解。夜景照明和城墙轮廓也让古都氛围更直观。",
      why: "D5白天是高强度文化参观，晚上不再追知识点，只需要在古城里吃饭、散步、感受城市尺度。",
      highlights: ["古城街巷和城墙夜景", "钟楼、牌楼等城市节点", "山西面食和本地晚餐"],
      tips: ["不需要走完整个古城，选择一条顺路街区即可", "夜间停车后尽量步行，避免反复挪车", "商业化街区和真正古迹要区分看待"]
    },
    {
      id: "ulanhada-volcano", name: "乌兰哈达火山", aliases: ["乌兰哈达火山群", "乌兰哈达火山地质公园"],
      overview: "乌兰哈达是一片年轻火山地貌集中区，火山锥、熔岩和开阔草原共同构成非常少见的景观。重点是看地貌尺度，而不是追求把每一个火山点都打卡。",
      why: "从山西古建切换到内蒙古地貌，乌兰哈达是全程非常强烈的一次视觉转场。",
      highlights: ["完整火山锥轮廓", "熔岩和火山渣地貌", "草原与火山的组合视野", "高处观察多个火山体之间的空间关系"],
      tips: ["严格按现场交通组织和开放区域行驶", "风大、无遮阴，注意保暖、防晒和补水", "不要翻越围栏或进入生态修复区，也不要为了拍照把车开上非铺装危险路段"]
    },
    {
      id: "inner-mongolia-museum", name: "内蒙古博物院", aliases: ["内蒙古博物馆"],
      overview: "内蒙古博物院从自然地理、史前文明、草原民族到近现代文化，能把接下来草原、阴山和阿拉善段的地理与人文背景串起来。",
      why: "先在室内建立草原文明和北方民族历史框架，再真正进入希拉穆仁和阿拉善，体验会更有层次。",
      highlights: ["草原历史与北方民族相关展陈", "考古文物与区域交流史", "内蒙古自然生态与古生物内容", "与丝路、长城地带相关的历史线索"],
      tips: ["建议抓主线看2—2.5小时，不要上午拖太久", "当天还要去希拉穆仁，午餐后尽快离开市区", "预约和临时展览以当期官方信息为准"]
    },
    {
      id: "daqingshan", name: "阴山·大青山", aliases: ["阴山", "大青山"],
      overview: "大青山是阴山山脉的重要组成部分。你们从呼和浩特向北去希拉穆仁时，会经历山南城市平原、山地垭口到山北高原草原的明显地貌变化。",
      why: "这段路本身就是景观，不需要额外找景点。看懂地形变化，会更容易理解内蒙古中部为什么形成这样的城市、草原和交通格局。",
      highlights: ["山南平原向山地抬升的变化", "翻越山地后的视野突然打开", "山北高原草原与山南城市景观的对比"],
      tips: ["只在正规停车区或安全观景点停靠", "不要在弯道、坡顶或应急车道临时拍照", "这段以顺路观察为主，不为找观景点绕路"]
    },
    {
      id: "xilamuren-grassland", name: "希拉穆仁草原", aliases: ["希拉穆仁"],
      overview: "希拉穆仁属于内蒙古中部典型高原草原景观。九月底草色可能已经进入秋季状态，但开阔地平线、日落、风和夜空仍是最重要的体验。",
      why: "你们选择住一晚的意义，不在于白天匆匆拍照，而是把日落、晚餐、夜间和第二天清晨都留给草原。",
      highlights: ["开阔草原和远处低丘", "日落时的地平线", "天气好时的夜空与星星", "蒙古包、牧场等草原生活元素"],
      tips: ["九月底夜间可能很冷，保暖层必须带足", "骑马等项目先问清价格、时长和保险，不接受模糊报价", "租赁SUV不要为了风景擅自进入不明土路或草地"]
    },
    {
      id: "wuhai-lake", name: "乌海湖", aliases: ["乌海湖生态旅游区"],
      overview: "乌海湖依托黄河海勃湾水利枢纽形成，最特别的是湖水、城市、沙地和远山在同一视野里的反差。",
      why: "前一天是草原和长途转场，D9在乌海湖放慢节奏，可以让大家在五湖穿越前恢复体力。",
      highlights: ["湖面与沙地形成的水沙景观", "黄河与城市的关系", "傍晚光线和日落", "水位合适时的游船体验"],
      tips: ["游船和水上项目受水位、调度和天气影响，必须以当天运营为准", "如果游船停运，也不影响看湖景和沙海", "D10要早起去阿拉善，D9晚上不要安排得太晚"]
    },
    {
      id: "alxa-hero-park", name: "阿拉善英雄会梦想沙漠公园", aliases: ["阿拉善英雄会梦想公园", "阿拉善英雄会沙漠穿越大本营"],
      overview: "这里对你们而言主要是五湖/六湖穿越的集合与换乘节点，而不是需要花半天游览的传统景区。它承担的是进入阿拉善沙漠腹地前的停车、会合和车辆切换功能。",
      why: "把入口认清，比多看一个景点更重要：你们的租赁途昂只开到正规停车区，真正进入沙漠必须换运营方专业越野车。",
      highlights: ["沙漠活动和越野文化氛围", "大型沙地场地与开阔视野", "作为腾格里腹地线路的集散节点"],
      tips: ["10月3日具体集合点、停车位和出发批次以前一晚运营方确认为准", "租赁车绝不进入穿越线路", "出发前再次确认是否原点返回、司机电话和预计结束时间"]
    },
    {
      id: "tengger-five-lakes", name: "腾格里五湖/六湖穿越", aliases: ["腾格里五湖", "腾格里六湖", "五湖穿越", "六湖穿越"],
      overview: "五湖/六湖穿越的核心不是单一湖泊，而是在沙丘之间连续移动，看到沙漠、湖泊、盐碱地和不同颜色水体不断切换。",
      why: "这是全程最具体验感的一天之一：古建和博物馆是观看历史，沙漠穿越则是身体真正进入地貌。",
      highlights: ["连续沙丘起伏", "沙漠湖泊与水色变化", "越野车辆穿越沙地的过程", "天气和光线变化带来的大尺度景观"],
      tips: ["只选正规运营方和专业司机，绝不自驾租赁车进沙", "全程系好安全带，听从司机关于冲坡和下车区域的要求", "带足水、防晒、墨镜和防风装备；有晕车倾向提前准备", "具体湖泊顺序会因道路、天气和管控变化，不必执着固定路线"]
    },
    {
      id: "xixia-tombs", name: "西夏陵", aliases: ["西夏陵博物馆", "西夏王陵"],
      overview: "西夏陵是理解西夏王朝最直接的遗址。博物馆负责把党项、西夏文字、制度和考古讲清楚，陵区则让你看到夯土陵塔在贺兰山前形成的独特景观。",
      why: "银川如果只看城市会很难理解宁夏的历史辨识度，西夏陵正是把这部分补完整的核心地点。",
      highlights: ["西夏陵博物馆的历史与考古展陈", "陵区夯土遗址和陵塔轮廓", "贺兰山背景下的荒漠陵园景观", "西夏文字、文物和制度线索"],
      tips: ["先博物馆后陵区更容易看懂遗址", "户外无遮阴，国庆期间注意防晒、防风和补水", "D11如果时间被压缩，西夏陵优先级高于贺兰山岩画"]
    },
    {
      id: "helan-rock-art", name: "贺兰山岩画", aliases: ["贺兰山岩画景区"],
      overview: "贺兰山岩画把人的面孔、动物、狩猎和符号刻在山口岩石上，是理解北方先民生活和精神世界的一种非常直接的材料。",
      why: "在看完西夏陵之后再来这里，能把宁夏的历史视角从王朝和墓葬进一步拉回更早、更广阔的贺兰山人类活动。",
      highlights: ["人面像和动物纹样", "山口自然地貌", "岩画在原始环境中的位置关系", "博物馆或展示区对图像含义的辅助解释"],
      tips: ["需要户外步行，鞋底要防滑", "岩画不能触摸、描摹或靠得太近", "如果国庆堵车严重，按既定方案可以删除这一站"]
    },
    {
      id: "qingtongxia-canyon", name: "青铜峡黄河大峡谷＋108塔", aliases: ["青铜峡黄河大峡谷", "108塔", "一百零八塔"],
      overview: "青铜峡这一站把黄河峡谷、水利工程和古塔群放在同一段旅程里。108塔依山排列，是宁夏辨识度很高的佛塔景观；峡谷则让人直观看到黄河穿行于西北地貌中的力量。",
      why: "D12从银川去中卫，本来就沿黄河方向移动，把这里安排在转场途中，既顺路又能补足宁夏黄河文化这一条主线。",
      highlights: ["依山分层排列的108塔", "黄河峡谷与两岸山体", "水利枢纽及黄河工程景观", "水上线路运行时从河面观察峡谷"],
      tips: ["游船受水位、天气和当天调度影响，停航时直接改陆路参观", "108塔和峡谷属于同一旅游系统，不要按两个远距离景点理解", "D12最后还要开去中卫，下午别拖到太晚"]
    },
    {
      id: "zhongwei-gaomiao", name: "中卫高庙", aliases: ["高庙保安寺", "中卫高庙保安寺"],
      overview: "中卫高庙最大的特点是建筑密度高、层层抬升，在不大的基座上组织出楼阁、殿宇和通道，视觉上很有立体感。",
      why: "它是中卫市区里最值得用一两个小时看的传统建筑，和沙坡头、66号公路的自然风景形成很好的对比。",
      highlights: ["高台上的层叠楼阁", "密集的屋顶和廊道", "不同宗教文化共存留下的空间痕迹", "从不同高度回看中卫城市"],
      tips: ["台阶较多，慢走不要赶", "早上人相对少，更适合拍建筑层次", "D13核心仍是沙坡头，高庙不要无限延长停留"]
    },
    {
      id: "zhongwei-route66", name: "中卫66号公路", aliases: ["66号公路", "中卫66号公路"],
      overview: "所谓中卫66号公路的魅力来自公路、黄河峡谷和荒凉山地共同形成的西北公路电影感。它本质是一段道路景观，不是封闭式景区。",
      why: "适合快速拍到和古建、博物馆完全不同的公路旅行照片，同时也是你们自驾主题最直观的一段画面。",
      highlights: ["公路向远山延伸的纵深感", "黄河峡谷与荒漠山体", "适合用长焦或路边安全位置拍摄车辆与道路"],
      tips: ["绝对不要站在行车道中央拍照", "只在允许停车的安全区域停靠", "如果D13时间紧，66号公路可以压缩，不能因此挤占沙坡头"]
    },
    {
      id: "shapotou-scenic", name: "沙坡头", aliases: ["沙坡头旅游景区", "沙坡头景区"],
      overview: "沙坡头最经典的地方，是黄河、沙漠和绿洲在很短距离内同时出现。这里既能看腾格里沙漠边缘，也能看到黄河穿过中卫形成的绿洲景观。",
      why: "D10已经做了阿拉善五湖穿越，D13来沙坡头不是重复：五湖是深入沙漠的越野体验，沙坡头更适合看黄河与沙漠交界以及成熟景区的综合体验。",
      highlights: ["黄河与沙丘交汇的核心景观", "高处俯瞰黄河绿洲", "沙坡和治沙相关景观", "滑沙、索道、羊皮筏等项目是否体验按兴趣和票种决定"],
      tips: ["酒店赠票已确认入住当天和第二天可用，但具体包含哪些项目仍要现场确认", "建议留3—4小时，不把它压成快速打卡", "景区项目多为单独收费或组合票，先问清价格再决定", "沙地风大日晒强，墨镜、防晒和补水要准备好"]
    },
    {
      id: "ningxia-museum", name: "宁夏博物馆", aliases: ["宁夏回族自治区博物馆"],
      overview: "宁夏博物馆适合放在旅程后段做一次总结：从史前、丝路到西夏、贺兰山岩画和近现代宁夏，把前几天已经亲眼看到的遗址重新串起来。",
      why: "你们是在看完西夏陵、贺兰山岩画、黄河和中卫之后再来，所以它不是预习，而是一次复盘，会比刚到银川时更容易看懂。",
      highlights: ["西夏相关历史与文物", "丝绸之路和宁夏区域交流", "贺兰山岩画等区域文化线索", "宁夏自然与历史环境的整体脉络"],
      tips: ["D14国庆最后一天从中卫返回，给高速拥堵留足缓冲", "建议预留2—2.5小时，优先看西夏和区域历史主线", "预约、闭馆和临时展览以当期官方信息为准"]
    },
    {
      id: "lanshan-park", name: "览山公园", aliases: ["银川览山公园"],
      overview: "览山公园最有辨识度的是大台阶和开阔西向视野。天气通透时，夕阳会落向贺兰山方向，是银川非常适合看日落的城市公共空间。",
      why: "D14博物馆之后不再安排重景点，来这里坐着看日落，比继续跑文化景点更适合旅程收尾。",
      highlights: ["大型阶梯式看台", "贺兰山方向的日落", "湖面、城市与远山的层次", "蓝调时刻的城市灯光"],
      tips: ["日落前一小时左右到更从容", "国庆期间停车和台阶区域会拥挤，尽量轻装", "如果当天高速延误明显，览山可以缩短，怀远夜市仍可保留"]
    },
    {
      id: "huaiyuan-night-market", name: "怀远夜市", aliases: ["怀远市场", "怀远观光夜市"],
      overview: "怀远夜市是银川非常有代表性的夜间吃喝区域，重点不是逐摊打卡，而是用最后一晚集中体验宁夏和西北风味。",
      why: "这是全程最后一个正式夜晚，适合大家边吃边复盘旅行，不再安排需要门票或赶时间的内容。",
      highlights: ["羊肉、羊杂等宁夏常见风味", "辣糊糊等本地小吃", "八宝茶和各类西北饮品", "夜市人流与城市夜生活氛围"],
      tips: ["5个人可以分着买、共享吃，避免一开始就吃饱", "热门摊位排队长时不用执着，夜市同类选择很多", "第二天要早起还车，别吃得太晚，也注意肠胃承受能力"]
    }
  ];

  window.JMN_PLACE_GUIDES = GUIDES;

  const normalize = (value = "") => String(value)
    .replace(/[·•・]/g, "")
    .replace(/[（）()\s]/g, "")
    .replace(/[＋+]/g, "+")
    .toLowerCase();

  const LOOKUP = new Map();
  GUIDES.forEach((guide) => {
    [guide.name, ...(guide.aliases || [])].forEach((alias) => LOOKUP.set(normalize(alias), guide));
  });

  function findGuide(label) {
    const key = normalize(label);
    if (LOOKUP.has(key)) return LOOKUP.get(key);
    let best = null;
    LOOKUP.forEach((guide, alias) => {
      if (key.includes(alias) || alias.includes(key)) {
        if (!best || alias.length > best.aliasLength) best = { guide, aliasLength: alias.length };
      }
    });
    return best?.guide || null;
  }

  function esc(value = "") {
    return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  }

  function ensureDialog() {
    let dialog = document.querySelector("#place-guide-dialog");
    if (dialog) return dialog;
    dialog = document.createElement("dialog");
    dialog.id = "place-guide-dialog";
    dialog.className = "place-guide-dialog";
    dialog.setAttribute("aria-labelledby", "place-guide-title");
    dialog.innerHTML = `
      <div class="place-guide-shell">
        <header class="place-guide-head">
          <div><span>为什么来这里 · 看什么</span><h2 id="place-guide-title"></h2></div>
          <button type="button" class="place-guide-close" data-guide-close aria-label="关闭景点介绍">关闭</button>
        </header>
        <div class="place-guide-body" id="place-guide-body"></div>
        <footer class="place-guide-foot">介绍以理解景点和现场游览为目的；开放时间、票务、交通管制和具体项目以当天官方公告及现场为准。</footer>
      </div>`;
    document.body.append(dialog);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target.closest("[data-guide-close]")) dialog.close();
    });
    return dialog;
  }

  function openGuide(guide) {
    const dialog = ensureDialog();
    dialog.querySelector("#place-guide-title").textContent = guide.name;
    dialog.querySelector("#place-guide-body").innerHTML = `
      <p class="place-guide-overview">${esc(guide.overview)}</p>
      <section class="place-guide-section place-guide-why"><h3>为什么来这里</h3><p>${esc(guide.why)}</p></section>
      <section class="place-guide-section"><h3>来了重点看什么</h3><ul>${guide.highlights.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
      <section class="place-guide-section place-guide-tips"><h3>要注意什么</h3><ul>${guide.tips.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>`;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function makeGuideButton(guide) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "schedule-guide-name";
    button.dataset.placeGuide = guide.id;
    button.textContent = guide.name;
    button.setAttribute("aria-label", `查看${guide.name}的中文介绍`);
    return button;
  }

  function guideById(id) {
    return GUIDES.find((guide) => guide.id === id) || null;
  }

  function decorateScheduleLinks() {
    document.querySelectorAll(".schedule-map-link:not([data-guide-decorated])").forEach((mapButton) => {
      const label = mapButton.dataset.mapLabel || mapButton.textContent.replace(/^📍\s*/, "").trim();
      const guide = findGuide(label);
      mapButton.dataset.guideDecorated = "1";
      if (!guide) return;
      const group = mapButton.parentElement;
      const exists = group?.querySelector(`[data-place-guide="${guide.id}"]`);
      if (!exists) mapButton.before(makeGuideButton(guide));
      mapButton.textContent = "导航 ↗";
      mapButton.classList.add("schedule-map-link--compact");
      mapButton.setAttribute("aria-label", `导航到${guide.name}`);
    });

    document.querySelectorAll(".schedule-item").forEach((item) => {
      const text = item.querySelector(".schedule-text")?.textContent || "";
      if (!text) return;
      const links = item.querySelector(".schedule-map-links");
      if (!links) return;
      GUIDES.forEach((guide) => {
        const mentioned = [guide.name, ...(guide.aliases || [])].some((alias) => text.includes(alias));
        if (mentioned && !links.querySelector(`[data-place-guide="${guide.id}"]`)) {
          links.prepend(makeGuideButton(guide));
        }
      });
    });
  }

  function decorateRouteStops() {
    document.querySelectorAll(".day-route-stop:not([data-guide-stop-decorated])").forEach((stop) => {
      stop.dataset.guideStopDecorated = "1";
      const strong = stop.querySelector("strong");
      const guide = findGuide(strong?.textContent || "");
      if (!guide || !strong) return;
      const hint = document.createElement("span");
      hint.className = "route-guide-trigger";
      hint.dataset.placeGuide = guide.id;
      hint.textContent = "介绍";
      hint.setAttribute("role", "button");
      hint.setAttribute("tabindex", "0");
      hint.setAttribute("aria-label", `查看${guide.name}介绍`);
      strong.after(hint);
    });
  }

  function decorate() {
    decorateScheduleLinks();
    decorateRouteStops();
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-place-guide]");
    if (!trigger) return;
    const guide = guideById(trigger.dataset.placeGuide);
    if (!guide) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
    openGuide(guide);
  }, true);

  document.addEventListener("keydown", (event) => {
    const trigger = event.target.closest?.(".route-guide-trigger[data-place-guide]");
    if (!trigger || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    const guide = guideById(trigger.dataset.placeGuide);
    if (guide) openGuide(guide);
  }, true);

  document.addEventListener("travel-data-ready", () => {
    [0, 80, 250, 700, 1600].forEach((delay) => window.setTimeout(decorate, delay));
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest(".day-toggle")) window.setTimeout(decorate, 0);
  });
  window.addEventListener("load", () => decorate(), { once: true });

  window.TravelPlaceGuides = { open: (name) => { const guide = findGuide(name); if (guide) openGuide(guide); }, guides: GUIDES };
})();
