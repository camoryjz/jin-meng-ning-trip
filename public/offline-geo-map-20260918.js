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
  const boundsFor=(ids,aspect=1.62)=>{
    const pts=ids.map(id=>POINTS[id]).filter(Boolean).map(p=>merc(p.lng,p.lat));
    if(!pts.length)return {x:0,y:0,w:B.width,h:B.height};
    let minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x)),minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y));
    let w=Math.max(42,maxX-minX),h=Math.max(28,maxY-minY);
    const cx=(minX+maxX)/2,cy=(minY+maxY)/2;
    w*=1.34;h*=1.42;
    if(w/h<aspect)w=h*aspect;else h=w/aspect;
    return {x:cx-w/2,y:cy-h/2,w,h};
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
  function markerLayer(ids, numbered=false){
    const seen=new Map();
    return '<g class="offline-markers">'+ids.map((id,index)=>{
      const p=POINTS[id];if(!p)return"";
      const base=merc(p.lng,p.lat);
      const occurrence=seen.get(id)||0;seen.set(id,occurrence+1);
      const shift=numbered&&occurrence ? occurrence*10 : 0;
      const x=base.x+shift,y=base.y-shift;
      const cls=/酒店/.test(p.category)?"hotel":/机场|车站/.test(p.category)?"transport":"poi";
      const inner=numbered
        ? '<circle r="10"/><text class="offline-marker-number" x="0" y="3.5" text-anchor="middle">'+(index+1)+'</text>'
        : '<circle r="'+(p.major?7:5)+'"/><text class="offline-marker-label" x="10" y="-8">'+esc(p.name)+'</text>';
      return '<g class="offline-marker '+cls+'" data-offline-point="'+id+'" transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+')" tabindex="0" role="button" aria-label="'+(index+1)+'. '+esc(p.name)+'">'+inner+'</g>';
    }).join("")+'</g>';
  }
  function routeLayer(day){
    const days=day?[day]:Object.keys(ROUTES).map(Number);
    return '<g class="offline-routes">'+days.map(d=>'<path class="route-day route-day-'+d+'" d="'+lineFor(ROUTES[d])+'" data-day="'+d+'"/>').join("")+'</g>';
  }
  function localGrid(vb){
    const cols=7,rows=5;
    let out='<g class="offline-local-grid">';
    for(let i=1;i<cols;i++){const x=vb.x+vb.w*i/cols;out+='<line x1="'+x+'" y1="'+vb.y+'" x2="'+x+'" y2="'+(vb.y+vb.h)+'"/>';}
    for(let i=1;i<rows;i++){const y=vb.y+vb.h*i/rows;out+='<line x1="'+vb.x+'" y1="'+y+'" x2="'+(vb.x+vb.w)+'" y2="'+y+'"/>';}
    return out+'</g><text class="offline-north" x="'+(vb.x+vb.w-16)+'" y="'+(vb.y+18)+'">N ↑</text>';
  }
  function contextLayer(vb,currentIds){
    const current=new Set(currentIds);
    const padX=vb.w*.18,padY=vb.h*.22;
    const inView=(p)=>{const m=merc(p.lng,p.lat);return m.x>=vb.x-padX&&m.x<=vb.x+vb.w+padX&&m.y>=vb.y-padY&&m.y<=vb.y+vb.h+padY;};
    const nearby=Object.entries(POINTS).filter(([id,p])=>!current.has(id)&&inView(p)).slice(0,10);
    const roadNet='<g class="offline-context-routes">'+Object.values(ROUTES).map(ids=>'<path d="'+lineFor(ids)+'"/>').join("")+'</g>';
    const contextPts='<g class="offline-context-points">'+nearby.map(([id,p])=>{const m=merc(p.lng,p.lat);return '<g transform="translate('+m.x.toFixed(1)+' '+m.y.toFixed(1)+')"><circle r="2.2"/><text x="4" y="-3">'+esc(p.name)+'</text></g>';}).join("")+'</g>';
    return roadNet+contextPts;
  }
  function mapSvg(ids,day,mini){
    const ratio=mini?1.55:1.62;
    const vb=day?boundsFor(ids,ratio):{x:0,y:0,w:B.width,h:B.height};
    const base='<image class="offline-basemap-image" href="'+basemap+'" x="0" y="0" width="'+B.width+'" height="'+B.height+'" preserveAspectRatio="none"/>';
    const local=day?'<rect class="offline-local-wash" x="'+vb.x+'" y="'+vb.y+'" width="'+vb.w+'" height="'+vb.h+'"/>'+contextLayer(vb,ids)+localGrid(vb):'';
    return '<svg class="'+(mini?'offline-mini-svg':'offline-overview-svg')+'" viewBox="'+vb.x+' '+vb.y+' '+vb.w+' '+vb.h+'" role="img" aria-label="'+(day?'第'+day+'天完整路线':'晋蒙宁15天行程总览')+'">'+
      base+local+routeLayer(day)+markerLayer(ids,Boolean(day))+'</svg>';
  }
  function dayPointList(ids){
    return '<div class="offline-day-points">'+ids.map((id,index)=>{
      const p=POINTS[id];if(!p)return"";
      return '<button type="button" data-offline-point="'+id+'"><b>'+(index+1)+'</b><span><strong>'+esc(p.name)+'</strong><small>'+esc(p.category)+' · 点击查看介绍</small></span><i>›</i></button>';
    }).join("")+'</div>';
  }
  function renderOverview(){
    const root=document.querySelector("#route-explorer");if(!root)return;
    const day=view.day;
    const ids=day?(ROUTES[day]||[]):view.all?[...new Set(Object.values(ROUTES).flat())]:Object.keys(POINTS).filter(id=>POINTS[id].major);
    const mapContent=day
      ? '<div class="offline-day-map-layout"><div class="offline-day-map-canvas">'+mapSvg(ids,day,false)+'</div><aside><div class="offline-day-map-title"><small>D'+day+' · '+ids.length+'站</small><strong>当天完整路线</strong><span>编号与地图圆点一致；点击地点查看介绍</span></div>'+dayPointList(ids)+'</aside></div>'
      : mapSvg(ids,0,false);
    root.innerHTML=
      '<div class="offline-map-toolbar"><div class="offline-map-days"><button data-offline-day="0" aria-pressed="'+(!day)+'">总览</button>'+
      Object.keys(ROUTES).map(d=>'<button data-offline-day="'+d+'" aria-pressed="'+(Number(d)===day)+'">D'+d+'</button>').join("")+
      '</div><button class="offline-map-all" data-offline-all aria-pressed="'+view.all+'">'+(view.all?'收起全部地点':'显示全部地点')+'</button></div>'+
      '<div class="offline-overview-shell '+(day?'is-day-zoom':'')+'">'+mapContent+'</div>'+
      '<div class="offline-map-legend"><span>● 主要地标</span><span class="hotel">● 酒店</span><span class="transport">● 机场/交通</span><small>'+(day?'D'+day+'：真实方位放大视图 · 编号表示行程顺序':view.all?'显示全部路线与景点':'默认只显示机场、酒店和主要地标')+'</small></div>'+
      '<p class="offline-map-source">离线底图已内嵌；标点使用固定经纬度和 Web Mercator 投影。地图展示运行时零外部瓦片请求，只有点击导航后才会打开高德/百度。</p>';
  }
  function miniMarkup(day){
    const ids=ROUTES[day]||[];
    if(!ids.length)return "";
    return '<div class="offline-daily-mini-map"><div class="offline-daily-mini-head"><strong>D'+day+' 当天小地图</strong><span>真实方位 · 编号即顺序</span></div><div class="offline-mini-canvas">'+mapSvg(ids,day,true)+'</div><div class="offline-mini-sequence">'+ids.map((id,index)=>'<button type="button" data-offline-point="'+id+'"><b>'+(index+1)+'</b>'+esc(POINTS[id]?.name||id)+'</button>').join("")+'</div></div>';
  }
  function hydrateDay(day,root){
    const host=root?.querySelector?.('.offline-daily-mini-map-host')||document.querySelector('.day-card[data-day="'+day+'"] .offline-daily-mini-map-host');
    if(!host)return;
    host.innerHTML=miniMarkup(day);
  }
  function enhanceDailyMaps(){
    document.querySelectorAll(".day-card[data-day]").forEach(card=>{
      const day=Number(card.dataset.day),ids=ROUTES[day];if(!ids)return;
      const body=card.querySelector(".daily-route-inline__body");if(!body)return;
      let host=body.querySelector(".offline-daily-mini-map-host");
      if(!host){host=document.createElement("div");host.className="offline-daily-mini-map-host";host.dataset.offlineMiniDay=day;body.prepend(host);}
      host.innerHTML=miniMarkup(day);
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
  window.JMN_OFFLINE_MAP_API={miniMarkup,hydrateDay,openPoint,renderOverview};
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
