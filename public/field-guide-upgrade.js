(() => {
  "use strict";

  const FIELD_GUIDES = {
    "shanxi-museum": {
      name: "山西博物院",
      kicker: "现场导览版 · 约2.5—3小时",
      overview: "把这里当成整段山西行程的“总预习”。你们后面会连续看到晋国、北朝、佛教艺术和大量古建筑，所以不需要平均分配时间，而要优先建立一条能服务后续旅行的历史主线。",
      route: [
        { badge: "优先1", title: "文明摇篮", time: "20—25分钟", detail: "先把山西的史前文明和早期聚落放进时间轴。重点理解黄河中游为什么会成为中华文明重要发源区域；看到陶寺等考古线索时，先抓“时代—社会复杂化—早期国家”这条主线。" },
        { badge: "优先2", title: "夏商踪迹", time: "20—25分钟", detail: "重点看商代方国、青铜礼器和区域文化。这里不用记器物名称，先建立“山西并不是中原边缘，而是商周时期重要文化区域”的概念。" },
        { badge: "必看", title: "晋国霸业", time: "45—60分钟", detail: "当天最高优先级。重点看晋侯相关考古、青铜器和晋国由封国走向强国的过程。后面一路向北时，你会更清楚“晋”为什么成为山西最重要的历史标签之一。馆藏明星文物若当天在展，以现场展陈为准，不必为了找某一件展品打乱节奏。" },
        { badge: "优先3", title: "民族熔炉", time: "25—30分钟", detail: "这是为大同和云冈石窟做准备的一厅。重点看北朝时期多民族交流、服饰、墓葬和艺术风格的变化，理解北魏为什么既有草原文化背景，又迅速吸收中原制度与审美。" },
        { badge: "优先4", title: "佛风遗韵", time: "25—30分钟", detail: "重点观察佛教造像的面相、衣纹和风格变化。两天后到云冈石窟时，你会更容易看出佛教艺术从外来元素到中国化表达的过程。" },
        { badge: "有余力", title: "土木华章 / 天下晋商 / 其他艺术专题", time: "20—30分钟机动", detail: "如果前面推进顺利，优先补“土木华章”作为应县木塔、大同辽金古建的预习；如果大家对社会史更有兴趣，再看“天下晋商”。不要为了打卡12个展厅把核心五厅看成走马观花。" }
      ],
      mustSee: [
        "核心逻辑不是“把馆看完”，而是：史前文明 → 夏商 → 晋国 → 北朝民族交流 → 佛教艺术。",
        "真正需要慢看的，是晋国霸业；其他展厅用于给后续行程建立背景。",
        "如果只有2小时：文明摇篮快速过、夏商踪迹快速过，重点留给晋国霸业＋民族熔炉＋佛风遗韵。"
      ],
      stopLoss: "12:00左右就要结束参观并准备午餐、前往忻州。若入馆晚或排队多，直接舍弃艺术专题，不压缩晋国霸业、民族熔炉和佛风遗韵。",
      tips: [
        "基本陈列“晋魂”由多个历史与艺术专题组成，展厅或个别展品可能因借展、维护调整，以当天馆内指引为准。",
        "热门日期预约、安检和存包都可能耗时，建议第一批进馆后先去最重要的历史展厅。",
        "看青铜器时不用背器名，重点找铭文、礼制用途、器形变化和出土背景。",
        "全馆信息量很大，出现审美疲劳时宁可坐5分钟，也不要靠“快速扫柜”硬撑。"
      ]
    },
    "yungang-grottoes": {
      name: "云冈石窟",
      kicker: "现场导览版 · 精华约3—4小时",
      overview: "云冈最怕“45个主要洞窟一路编号扫过去，最后一个也记不住”。你们的目标应是看懂三个阶段：中期皇家大窟的华丽与叙事、五华洞一带的精细装饰、昙曜五窟的早期雄浑。时间有限时，抓住5、6、16—20窟，就已经掌握云冈最重要的骨架。",
      route: [
        { badge: "必看", title: "第5窟 · 大佛洞", time: "10—15分钟", detail: "先看体量。窟内主佛是云冈体量最大的造像之一，进入洞窟后先退到能看清整体比例的位置，再看佛像与洞窟空间如何共同制造压迫感和神圣感。不要只拍大佛正脸，顺便观察两侧造像与后世彩绘痕迹。" },
        { badge: "必看", title: "第6窟 · 释迦佛洞", time: "15—25分钟", detail: "这是最值得慢看的洞窟之一。核心不是一尊大佛，而是中心塔柱和四壁连续展开的佛传故事。进窟后围绕中心塔柱慢慢走，观察建筑式龛、人物、飞天和“连环画式”叙事。排队长也优先保它。" },
        { badge: "推荐", title: "第7、8窟 · 成对洞窟", time: "15—20分钟", detail: "如果人流允许，重点看二窟之间的呼应关系和来自不同文化传统的造像元素。第7窟可留意精细供养人形象，第8窟可留意多头多臂等强烈异域特征。它们非常适合观察“胡风汉韵”如何在云冈碰撞。" },
        { badge: "推荐", title: "第9—13窟 · 五华洞区域", time: "20—30分钟", detail: "这里的关键词是“华丽、密集、色彩和细节”。不必逐块读图，选一两窟重点看伎乐、飞天、建筑纹样和清代彩绘遗存，感受云冈从雄浑走向精致繁复的变化。" },
        { badge: "必看组", title: "第16—20窟 · 昙曜五窟", time: "30—45分钟", detail: "这是理解云冈早期皇家石窟的核心。不要只看第20窟；从16窟一路向20窟走，比较佛像面相、体量和洞窟空间。巨大的佛像与北魏皇权、国家佛教关系密切，整体气质比前面更雄健、简洁。" },
        { badge: "压轴", title: "第20窟 · 露天大佛", time: "10—15分钟", detail: "这是云冈最具辨识度的形象。先在近处看面部和衣纹，再后退到能把大佛、崖壁和天空放在同一画面的位置。它适合做全程视觉收束，而不是只拍一张正面照就走。" }
      ],
      mustSee: [
        "时间只够90分钟：第5窟 → 第6窟 → 直接去第16—20窟，最后第20窟。",
        "时间约3小时：5、6窟 → 7、8窟 → 9—13窟择重点 → 16—20窟。",
        "不要在1—4窟或外围景观区耗掉最好的早晨时段，核心石窟优先。"
      ],
      stopLoss: "D5下午还有华严寺、九龙壁、善化寺。原则上12:00左右结束石窟主区；若第5、6窟排队非常长，仍优先保第6窟和昙曜五窟，其他中间洞窟可跳过。",
      tips: [
        "洞窟会因保护、客流或维护临时调整开放，现场若有关闭或限流，以景区当日安排为准。",
        "洞窟内拍摄必须遵守现场规定；禁止闪光时不要尝试补光，保护彩绘和造像优先。",
        "第6窟适合慢走看叙事，不要被后方人流催得只抬头看一眼就离开。",
        "石窟内部明暗反差大，先让眼睛适应几秒再看细节，比立刻举手机更容易看清。"
      ]
    },
    "xixia-tombs": {
      name: "西夏陵",
      kicker: "现场导览版 · 建议2.5—3小时",
      overview: "西夏陵最容易出现的问题是“先到遗址，看见几个土台却不知道在看什么”。你们应该反过来：先用博物馆建立西夏历史和陵园结构，再去3号陵把展柜里的知识投射到真实地景。D11还要去贺兰山岩画，因此走精华线，不追求把所有开放陵区走完。",
      route: [
        { badge: "第1站", title: "西夏陵博物馆", time: "60—90分钟", detail: "先解决四个问题：党项从哪里来、西夏如何建国、西夏文字与制度有什么特点、陵园为什么这样布局。看文物时重点留意西夏文字、建筑构件、碑刻和陵区考古复原，不必在每一件器物前停留。" },
        { badge: "转换", title: "从博物馆去遗址区", time: "按景区交通组织", detail: "离开展馆前先把“陵台、献殿、碑亭、门阙、陵墙”等名词看懂。到遗址区后就不是看一个大土堆，而是在地面上辨认一整套帝陵礼制空间。接驳方式、线路和开放陵区以当天景区安排为准。" },
        { badge: "必看", title: "3号陵", time: "45—60分钟", detail: "3号陵是最重要的现场观察点，也是多条官方推荐线路共同包含的核心帝陵。先远看陵台与贺兰山的关系，再沿参观路径辨认陵园轴线、献殿及相关基址。重点感受夯土遗址在荒漠地景里的尺度，而不是只围着陵塔拍照。" },
        { badge: "有余力", title: "双陵 / 4号陵等开放区域", time: "30—45分钟机动", detail: "如果3号陵结束后时间充裕，再按当天开放线路继续。它们的价值是做“对比”：看不同帝陵规模、布局与保存状态的差别。若去贺兰山岩画的时间开始被压缩，这一段直接放弃。" }
      ],
      mustSee: [
        "精华顺序：博物馆 → 景区交通接驳 → 3号陵 → 有余力再看其他开放陵区。",
        "博物馆里先学会“看陵园平面图”，到了3号陵再找对应位置，体验会完全不同。",
        "现场最值得看的，是陵台与贺兰山、荒漠环境形成的整体关系。"
      ],
      stopLoss: "D11优先级固定为西夏陵高于贺兰山岩画，但西夏陵内部也要止损：博物馆＋3号陵完成后就已经达到核心目标。国庆人多时，不为多看一两个陵区把下午全部耗尽。",
      tips: [
        "官方推荐线路中，博物馆和3号陵都是非常核心的组成部分；具体接驳车、开放陵区和体验项目以当天景区公告为准。",
        "遗址区无遮阴、风大，国庆仍要准备防晒、帽子、饮水和防风外层。",
        "不要攀爬、触碰夯土遗址，也不要跨越参观边界。",
        "如果大家对影视、VR、XR体验兴趣一般，可优先把时间给博物馆实物和3号陵实地观察。"
      ]
    }
  };

  const esc = (value = "") => String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);

  function ensureDialog() {
    let dialog = document.querySelector("#field-guide-dialog");
    if (dialog) return dialog;
    dialog = document.createElement("dialog");
    dialog.id = "field-guide-dialog";
    dialog.className = "place-guide-dialog field-guide-dialog";
    dialog.setAttribute("aria-labelledby", "field-guide-title");
    dialog.innerHTML = `
      <div class="place-guide-shell field-guide-shell">
        <header class="place-guide-head field-guide-head">
          <div><span>现场导览 · 建议照着顺序看</span><h2 id="field-guide-title"></h2><p id="field-guide-kicker"></p></div>
          <button type="button" class="place-guide-close" data-field-guide-close aria-label="关闭现场导览">关闭</button>
        </header>
        <div class="place-guide-body field-guide-body" id="field-guide-body"></div>
        <footer class="place-guide-foot">导览顺序按本次15天行程做了取舍；洞窟、展厅、陵区开放以及接驳、预约、拍摄规则均以当天官方公告和现场管理为准。</footer>
      </div>`;
    document.body.append(dialog);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target.closest("[data-field-guide-close]")) dialog.close();
    });
    return dialog;
  }

  function routeMarkup(guide) {
    return guide.route.map((step, index) => `
      <li class="field-guide-step">
        <div class="field-guide-step__rail"><span>${index + 1}</span></div>
        <div class="field-guide-step__content">
          <div class="field-guide-step__top"><b>${esc(step.badge)}</b><strong>${esc(step.title)}</strong><em>${esc(step.time)}</em></div>
          <p>${esc(step.detail)}</p>
        </div>
      </li>`).join("");
  }

  function openFieldGuide(guide) {
    const dialog = ensureDialog();
    dialog.querySelector("#field-guide-title").textContent = guide.name;
    dialog.querySelector("#field-guide-kicker").textContent = guide.kicker;
    dialog.querySelector("#field-guide-body").innerHTML = `
      <p class="place-guide-overview field-guide-overview">${esc(guide.overview)}</p>
      <section class="field-guide-section">
        <div class="field-guide-section__heading"><span>ROUTE</span><h3>现场按这个顺序看</h3></div>
        <ol class="field-guide-steps">${routeMarkup(guide)}</ol>
      </section>
      <section class="field-guide-section field-guide-section--must">
        <div class="field-guide-section__heading"><span>PRIORITY</span><h3>时间不同时怎么取舍</h3></div>
        <ul>${guide.mustSee.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
      </section>
      <section class="field-guide-stop"><strong>止损线</strong><p>${esc(guide.stopLoss)}</p></section>
      <section class="field-guide-section field-guide-section--tips">
        <div class="field-guide-section__heading"><span>ON SITE</span><h3>现场注意</h3></div>
        <ul>${guide.tips.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
      </section>`;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function reorderItineraryAndStays() {
    const main = document.querySelector("#main[data-site-view='travel']") || document.querySelector("#main");
    const route = document.querySelector("#route");
    const itinerary = document.querySelector("#itinerary");
    const stayPanel = document.querySelector(".stay-panel");
    if (!main || !route || !itinerary || !stayPanel) return false;

    let staySection = document.querySelector("#stays-section");
    if (!staySection) {
      staySection = document.createElement("section");
      staySection.id = "stays-section";
      staySection.className = "section stays-section";
      staySection.setAttribute("aria-label", "每晚住宿地");
      stayPanel.replaceWith(staySection);
      staySection.append(stayPanel);
    } else if (stayPanel.parentElement !== staySection) {
      staySection.append(stayPanel);
    }

    route.after(itinerary);
    itinerary.after(staySection);
    document.documentElement.dataset.itineraryBeforeStays = "1";
    return true;
  }

  function scheduleLayout() {
    [0, 80, 250, 700, 1500, 3000].forEach((delay) => window.setTimeout(reorderItineraryAndStays, delay));
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest?.("[data-place-guide]");
    if (!trigger) return;
    const guide = FIELD_GUIDES[trigger.dataset.placeGuide];
    if (!guide) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
    openFieldGuide(guide);
  }, true);

  document.addEventListener("keydown", (event) => {
    const trigger = event.target.closest?.("[data-place-guide]");
    if (!trigger || !["Enter", " "].includes(event.key)) return;
    const guide = FIELD_GUIDES[trigger.dataset.placeGuide];
    if (!guide) return;
    event.preventDefault();
    event.stopPropagation();
    openFieldGuide(guide);
  }, true);

  document.addEventListener("travel-data-ready", scheduleLayout);
  window.addEventListener("load", scheduleLayout, { once: true });
  scheduleLayout();

  window.TravelFieldGuideUpgrade = { guides: FIELD_GUIDES, open: (id) => FIELD_GUIDES[id] && openFieldGuide(FIELD_GUIDES[id]), reorder: reorderItineraryAndStays };
})();
