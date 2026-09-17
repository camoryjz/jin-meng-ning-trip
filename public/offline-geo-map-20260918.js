(function offlineGeoRuntime(){
  "use strict";
  const DATA=window.JMN_OFFLINE_MAP_DATA;
  if(!DATA)return;
  const {bounds:B,basemap,points:POINTS,routes:ROUTES,legs:LEGS}=DATA;
  let view={day:0,all:false};

  const esc=(v="")=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const merc=(lng,lat)=>{
    const y=Math.log(Math.tan(Math.PI/4+lat*Math.PI/360));
    const yS=Math.log(Math.tan(Math.PI/4+B.south*Math.PI/360));
    const yN=Math.log(Math.tan(Math.PI/4+B.north*Math.PI/360));
    return {x:(lng-B.west)/(B.east-B.west)*B.width,y:(yN-y)/(yN-yS)*B.height};
  };
  const boundsFor=(ids)=>{
    const pts=ids.map(id=>POINTS[id]).filter(Boolean).map(p=>merc(p.lng,p.lat));
    if(!pts.length)return {x:0,y:0,w:B.width,h:B.height};
    let minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x)),minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y));
    const px=Math.max(60,(maxX-minX)*.18),py=Math.max(55,(maxY-minY)*.28);
    minX-=px;maxX+=px;minY-=py;maxY+=py;
    return {x:minX,y:minY,w:Math.max(190,maxX-minX),h:Math.max(150,maxY-minY)};
  };
  const lineFor=(ids)=>ids.map((id,i)=>{const p=POINTS[id];if(!p)return"";const m=merc(p.lng,p.lat);return (i?"L":"M")+m.x.toFixed(1)+" "+m.y.toFixed(1);}).filter(Boolean).join(" ");

  const EXPERIENCE={
    "博物馆":["先看核心展厅，再按体力补充","建议使用讲解或语音导览","控制停留时间，给后续转场留余量"],
    "古建":["先看整体轴线和体量","再观察斗拱、壁画或结构细节","遵守文保区域拍摄与触摸限制"],
    "古城":["先走核心街区，再补小巷","傍晚到蓝调时段更有氛围","停车后尽量步行，减少反复挪车"],
    "酒店":["抵达先处理停车和入住","确认早餐、退房和第二天出发时间","把次日需要的物品提前整理好"],
    "机场":["预留值机、安检和还车缓冲","核对航站楼与集合点","重要证件和充电设备随身携带"]
  };
  function guideFor(id,p){
    const guides=window.JMN_PLACE_GUIDES||[];
    const guide=guides.find(g=>g.id===id||[g.name,...(g.aliases||[])].some(n=>p.name.includes(n)||n.includes(p.name)));
    const experience=EXPERIENCE[p.category]||(/酒店/.test(p.category)?EXPERIENCE.酒店:/机场/.test(p.category)?EXPERIENCE.机场:["先看整体，再看细节","按当天时间和体力决定深度","优先安全、开放与天气条件"]);
    return {
      reason:guide?.why||(p.category==="酒店"?"这是当天路线的住宿锚点，决定第二天实际出发位置与节奏。":"它位于当天路线主线上，是理解这一段地域特征的重要节点。"),
      must:(guide?.highlights||[p.name,"周边环境","与当天路线的空间关系"]).slice(0,3),
      experience,
      tips:(guide?.tips||["开放、停车和现场管制以当天实际为准","节假日预留排队与停车缓冲","导航以高德为主，百度为备用"]).slice(0,3)
    };
  }
  function ensureDialog(){
    let d=document.querySelector("#offline-map-place-dialog");
    if(d)return d;
    d=document.createElement("dialog");
    d.id="offline-map-place-dialog";d.className="offline-map-place-dialog";
    d.innerHTML='<div class="offline-map-place-shell"><header><div><small>地点介绍</small><h2></h2></div><button type="button" data-offline-close aria-label="关闭地点介绍">×</button></header><div class="offline-map-place-body"></div></div>';
    document.body.append(d);
    d.addEventListener("click",e=>{if(e.target===d||e.target.closest("[data-offline-close]"))d.close();});
    return d;
  }
  function openPoint(id){
    const p=POINTS[id];if(!p)return;
    const g=guideFor(id,p),d=ensureDialog();
    d.querySelector("h2").textContent=p.name;
    d.querySelector(".offline-map-place-body").innerHTML=
      '<div class="offline-place-meta"><span>'+esc(p.category)+'</span><span>'+p.lat.toFixed(6)+', '+p.lng.toFixed(6)+'</span></div>'+
      '<dl><dt>地图关键词</dt><dd>'+esc(p.keyword)+'</dd><dt>推荐理由</dt><dd>'+esc(g.reason)+'</dd></dl>'+
      '<section><h3>必看点</h3><ol>'+g.must.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol></section>'+
      '<section><h3>体验建议</h3><ol>'+g.experience.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol></section>'+
      '<section><h3>实用提示</h3><ul>'+g.tips.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></section>'+
      '<div class="offline-place-nav"><a href="https://uri.amap.com/search?keyword='+encodeURIComponent(p.keyword)+'&callnative=1" target="_blank" rel="noopener">高德导航 ↗</a><a href="https://map.baidu.com/search/'+encodeURIComponent(p.keyword)+'" target="_blank" rel="noopener">百度导航 ↗</a></div>';
    d.showModal?.();
  }
  function markerLayer(ids){
    return '<g class="offline-markers">'+ids.map(id=>{
      const p=POINTS[id];if(!p)return"";
      const m=merc(p.lng,p.lat);
      const cls=/酒店/.test(p.category)?"hotel":/机场|车站/.test(p.category)?"transport":"poi";
      return '<g class="offline-marker '+cls+'" data-offline-point="'+id+'" transform="translate('+m.x.toFixed(1)+' '+m.y.toFixed(1)+')" tabindex="0" role="button" aria-label="'+esc(p.name)+'"><circle r="'+(p.major?7:5)+'"/><text x="10" y="-8">'+esc(p.name)+'</text></g>';
    }).join("")+'</g>';
  }
  function routeLayer(day){
    const days=day?[day]:Object.keys(ROUTES).map(Number);
    return '<g class="offline-routes">'+days.map(d=>'<path class="route-day route-day-'+d+'" d="'+lineFor(ROUTES[d])+'" data-day="'+d+'"/>').join("")+'</g>';
  }
  function mapSvg(ids,day,mini){
    const vb=day?boundsFor(ids):{x:0,y:0,w:B.width,h:B.height};
    return '<svg class="'+(mini?'offline-mini-svg':'offline-overview-svg')+'" viewBox="'+vb.x+' '+vb.y+' '+vb.w+' '+vb.h+'" role="img" aria-label="'+(day?'第'+day+'天完整路线':'晋蒙宁15天行程总览')+'">'+
      '<image href="'+basemap+'" x="0" y="0" width="'+B.width+'" height="'+B.height+'" preserveAspectRatio="none"/>'+routeLayer(day)+markerLayer(ids)+'</svg>';
  }
  function renderOverview(){
    const root=document.querySelector("#route-explorer");if(!root)return;
    const day=view.day;
    const ids=day?(ROUTES[day]||[]):view.all?[...new Set(Object.values(ROUTES).flat())]:Object.keys(POINTS).filter(id=>POINTS[id].major);
    root.innerHTML=
      '<div class="offline-map-toolbar"><div class="offline-map-days"><button data-offline-day="0" aria-pressed="'+(!day)+'">总览</button>'+
      Object.keys(ROUTES).map(d=>'<button data-offline-day="'+d+'" aria-pressed="'+(Number(d)===day)+'">D'+d+'</button>').join("")+
      '</div><button class="offline-map-all" data-offline-all aria-pressed="'+view.all+'">'+(view.all?'收起全部地点':'显示全部地点')+'</button></div>'+
      '<div class="offline-overview-shell '+(day?'is-day-zoom':'')+'">'+mapSvg(ids,day,false)+'</div>'+
      '<div class="offline-map-legend"><span>● 主要地标</span><span class="hotel">● 酒店</span><span class="transport">● 机场/交通</span><small>'+(day?'D'+day+'：只显示当天完整路线，并自动放大':view.all?'显示全部路线与景点':'默认只显示机场、酒店和主要地标')+'</small></div>'+
      '<p class="offline-map-source">离线底图已内嵌；标点使用固定经纬度和 Web Mercator 投影。地图展示运行时零外部瓦片请求，只有点击导航后才会打开高德/百度。</p>';
  }
  function enhanceDailyMaps(){
    document.querySelectorAll(".day-card[data-day]").forEach(card=>{
      const day=Number(card.dataset.day),ids=ROUTES[day];if(!ids)return;
      const body=card.querySelector(".daily-route-inline__body");if(!body)return;
      body.querySelector(".offline-daily-mini-map")?.remove();
      const box=document.createElement("div");box.className="offline-daily-mini-map";
      box.innerHTML='<div class="offline-daily-mini-head"><strong>D'+day+' 当天小地图</strong><span>Web Mercator · 离线</span></div>'+mapSvg(ids,day,true);
      body.prepend(box);
    });
  }
  function enhanceLegCapsules(){
    document.querySelectorAll(".day-card[data-day]").forEach(card=>{
      const day=Number(card.dataset.day),list=LEGS[day]||[],schedule=card.querySelector(".schedule");if(!schedule)return;
      schedule.querySelectorAll(".route-leg-capsule").forEach(n=>n.remove());
      const items=[...schedule.querySelectorAll(".schedule-item")];
      list.forEach(([match,label,duration])=>{
        const target=items.find(item=>(item.textContent||"").replace(/\s+/g,"").includes(String(match).replace(/\s+/g,"")));
        if(!target)return;
        const li=document.createElement("li");li.className="route-leg-capsule";
        li.innerHTML='<span>'+esc(label)+'</span><b>🚗 '+esc(duration)+'</b>';
        target.before(li);
      });
    });
  }
  function apply(){renderOverview();enhanceDailyMaps();enhanceLegCapsules();document.documentElement.dataset.offlineGeoMap="1";}
  document.addEventListener("click",e=>{
    const dayBtn=e.target.closest("[data-offline-day]");
    if(dayBtn){view.day=Number(dayBtn.dataset.offlineDay);view.all=false;renderOverview();return;}
    if(e.target.closest("[data-offline-all]")){view.day=0;view.all=!view.all;renderOverview();return;}
    const point=e.target.closest("[data-offline-point]");if(point)openPoint(point.dataset.offlinePoint);
  });
  document.addEventListener("keydown",e=>{const point=e.target.closest?.("[data-offline-point]");if(point&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openPoint(point.dataset.offlinePoint);}});
  document.addEventListener("travel-data-ready",()=>[120,650,1700,3400].forEach(t=>setTimeout(apply,t)));
  window.addEventListener("travel-view:shown",()=>setTimeout(apply,100));
  window.addEventListener("load",()=>setTimeout(apply,500),{once:true});
  [900,2200,4800].forEach(t=>setTimeout(apply,t));
})();
