(function offlineGeoRuntime(){
  "use strict";
  const DATA=window.JMN_OFFLINE_MAP_DATA;
  if(!DATA)return;
  const {bounds:B,basemap,points:POINTS,routes:ROUTES,legs:LEGS}=DATA;
  let view={day:0,all:false};
  const CONTEXT_CITIES=[
    {name:"太原",lat:37.8706,lng:112.5489},{name:"忻州",lat:38.4167,lng:112.7333},
    {name:"大同",lat:40.0768,lng:113.3001},{name:"呼和浩特",lat:40.8426,lng:111.7492},
    {name:"包头",lat:40.6574,lng:109.8403},{name:"巴彦淖尔",lat:40.7432,lng:107.3877},
    {name:"乌海",lat:39.6550,lng:106.7940},{name:"银川",lat:38.4872,lng:106.2309},
    {name:"吴忠",lat:37.9976,lng:106.1988},{name:"中卫",lat:37.5002,lng:105.1968},
    {name:"阿拉善左旗",lat:38.8448,lng:105.6662}
  ];

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
  const pathForCoords=(coords)=>coords.map(([lng,lat],i)=>{const m=merc(lng,lat);return (i?"L":"M")+m.x.toFixed(1)+" "+m.y.toFixed(1);}).join(" ");
  const CLEAN_REGIONS=[
    {name:"山西",lng:112.25,lat:38.25},
    {name:"内蒙古",lng:109.75,lat:40.55},
    {name:"宁夏",lng:106.05,lat:37.75}
  ];
  const CLEAN_RIVERS=[
    {name:"黄河",coords:[[105.82,37.18],[105.99,37.88],[106.22,38.49],[106.72,39.58],[107.39,40.74],[109.84,40.66],[111.25,40.72],[111.72,40.82]]},
    {name:"汾河",coords:[[112.35,36.95],[112.47,37.45],[112.55,37.88],[112.62,38.45]]}
  ];
  function cleanBasemapLayer(vb,mini=false){
    const inView=(lng,lat)=>{const m=merc(lng,lat);return m.x>=vb.x-vb.w*.12&&m.x<=vb.x+vb.w*1.12&&m.y>=vb.y-vb.h*.12&&m.y<=vb.y+vb.h*1.12;};
    const regions=CLEAN_REGIONS.filter(r=>inView(r.lng,r.lat)).map(r=>{const m=merc(r.lng,r.lat);return '<text class="offline-clean-region" x="'+m.x.toFixed(1)+'" y="'+m.y.toFixed(1)+'" text-anchor="middle">'+esc(r.name)+'</text>';}).join("");
    const rivers=CLEAN_RIVERS.map(r=>'<path class="offline-clean-river" d="'+pathForCoords(r.coords)+'"/>').join("");
    const riverLabels=mini?"":CLEAN_RIVERS.map(r=>{const mid=r.coords[Math.floor(r.coords.length/2)],m=merc(mid[0],mid[1]);return inView(mid[0],mid[1])?'<text class="offline-clean-river-label" x="'+(m.x+4).toFixed(1)+'" y="'+(m.y-4).toFixed(1)+'">'+esc(r.name)+'</text>':"";}).join("");
    return '<g class="offline-clean-basemap"><rect x="'+vb.x+'" y="'+vb.y+'" width="'+vb.w+'" height="'+vb.h+'" rx="0"/><g class="offline-clean-relief"><ellipse cx="'+(vb.x+vb.w*.25)+'" cy="'+(vb.y+vb.h*.32)+'" rx="'+(vb.w*.24)+'" ry="'+(vb.h*.18)+'"/><ellipse cx="'+(vb.x+vb.w*.68)+'" cy="'+(vb.y+vb.h*.62)+'" rx="'+(vb.w*.28)+'" ry="'+(vb.h*.20)+'"/></g><g class="offline-clean-rivers">'+rivers+riverLabels+'</g><g class="offline-clean-regions">'+regions+'</g></g>';
  }

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
  // D3 is the visual reference: marker diameter stays constant relative to the
  // visible map width, so short city days do not get oversized numbered dots.
  const D3_MINI_REFERENCE_WIDTH=(ROUTES[3]?.length?boundsFor(ROUTES[3],1.55).w:431.29701375342387);
  const D3_DAY_REFERENCE_WIDTH=(ROUTES[3]?.length?boundsFor(ROUTES[3],1.62).w:450);
  const D3_MINI_MARKER_RADIUS_RATIO=6.2/D3_MINI_REFERENCE_WIDTH;
  const D3_MINI_MARKER_TEXT_RATIO=5.8/D3_MINI_REFERENCE_WIDTH;
  const D3_DAY_MARKER_RADIUS_RATIO=6.6/D3_DAY_REFERENCE_WIDTH;
  const D3_DAY_MARKER_TEXT_RATIO=5.8/D3_DAY_REFERENCE_WIDTH;
  function markerLayer(ids, numbered=false, vb=null, mini=false){
    const seen=new Map();
    // D3 is the visual reference for BOTH the day-tab map and the itinerary mini map.
    // Scale SVG marker geometry with each day's viewBox so its on-screen size remains
    // visually consistent with D3 even for short, tightly zoomed routes such as D1/D5/D15.
    const radiusRatio=mini?D3_MINI_MARKER_RADIUS_RATIO:D3_DAY_MARKER_RADIUS_RATIO;
    const textRatio=mini?D3_MINI_MARKER_TEXT_RATIO:D3_DAY_MARKER_TEXT_RATIO;
    const dynamicRadius=numbered&&vb?Math.max(.72,vb.w*radiusRatio):(mini?6.2:6.6);
    const dynamicText=numbered&&vb?Math.max(.66,vb.w*textRatio):5.8;
    return '<g class="offline-markers">'+ids.map((id,index)=>{
      const p=POINTS[id];if(!p)return"";
      const base=merc(p.lng,p.lat);
      const occurrence=seen.get(id)||0;seen.set(id,occurrence+1);
      const shift=numbered&&occurrence ? occurrence*Math.max(dynamicRadius*1.65,1.5) : 0;
      const x=base.x+shift,y=base.y-shift;
      const cls=/酒店/.test(p.category)?"hotel":/机场|车站/.test(p.category)?"transport":"poi";
      const inner=numbered
        ? '<circle r="'+dynamicRadius.toFixed(2)+'" style="r:'+dynamicRadius.toFixed(2)+'px!important"/><text class="offline-marker-number" style="font-size:'+dynamicText.toFixed(2)+'px!important" x="0" y="'+(dynamicText*.36).toFixed(2)+'" text-anchor="middle">'+(index+1)+'</text>'
        : '<circle r="'+(p.major?7:5)+'"/><text class="offline-marker-label" x="10" y="-8">'+esc(p.name)+'</text>';
      return '<g class="offline-marker '+cls+'" data-offline-point="'+id+'" transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+')" tabindex="0" role="button" aria-label="'+(index+1)+'. '+esc(p.name)+'">'+inner+'</g>';
    }).join("")+'</g>';
  }
  function routeLayer(day,mini=false){
    const days=day?[day]:Object.keys(ROUTES).map(Number);
    return '<g class="offline-routes">'+days.map(d=>{
      const path=lineFor(ROUTES[d]);
      const halo=mini?'<path class="route-day-halo route-day-'+d+'" d="'+path+'" aria-hidden="true"/>':'';
      return halo+'<path class="route-day route-day-'+d+'" d="'+path+'" data-day="'+d+'"/>';
    }).join("")+'</g>';
  }
  function localGrid(vb){
    const cols=7,rows=5;
    let out='<g class="offline-local-grid">';
    for(let i=1;i<cols;i++){const x=vb.x+vb.w*i/cols;out+='<line x1="'+x+'" y1="'+vb.y+'" x2="'+x+'" y2="'+(vb.y+vb.h)+'"/>';}
    for(let i=1;i<rows;i++){const y=vb.y+vb.h*i/rows;out+='<line x1="'+vb.x+'" y1="'+y+'" x2="'+(vb.x+vb.w)+'" y2="'+y+'"/>';}
    return out+'</g><text class="offline-north" x="'+(vb.x+vb.w-16)+'" y="'+(vb.y+18)+'">N ↑</text>';
  }
  function contextLayer(vb,currentIds,compact=false){
    const current=new Set(currentIds);
    const padX=vb.w*.28,padY=vb.h*.3;
    const inView=(p)=>{const m=merc(p.lng,p.lat);return m.x>=vb.x-padX&&m.x<=vb.x+vb.w+padX&&m.y>=vb.y-padY&&m.y<=vb.y+vb.h+padY;};
    const cityItems=CONTEXT_CITIES.filter(inView).slice(0,compact?4:CONTEXT_CITIES.length);
    const cities='<g class="offline-context-cities'+(compact?' offline-context-cities--mini':'')+'">'+cityItems.map(city=>{const m=merc(city.lng,city.lat);return '<g transform="translate('+m.x.toFixed(1)+' '+m.y.toFixed(1)+')"><circle r="2.8"/><text x="5" y="3">'+esc(city.name)+'</text></g>';}).join("")+'</g>';
    if(compact)return cities;
    const nearby=Object.entries(POINTS).filter(([id,p])=>!current.has(id)&&inView(p)).slice(0,12);
    const roadPaths=Object.values(ROUTES).map(ids=>'<path d="'+lineFor(ids)+'"/>').join("");
    const roadNet='<g class="offline-context-road-casing">'+roadPaths+'</g><g class="offline-context-routes">'+roadPaths+'</g>';
    const contextPts='<g class="offline-context-points">'+nearby.map(([id,p])=>{const m=merc(p.lng,p.lat);return '<g transform="translate('+m.x.toFixed(1)+' '+m.y.toFixed(1)+')"><circle r="2.4"/><text x="4.5" y="-3">'+esc(p.name)+'</text></g>';}).join("")+'</g>';
    const cx=vb.x+vb.w/2,cy=vb.y+vb.h/2;
    const contours='<g class="offline-terrain-contours">'+
      '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+(vb.w*.44)+'" ry="'+(vb.h*.32)+'"/>'+
      '<ellipse cx="'+(cx-vb.w*.12)+'" cy="'+(cy+vb.h*.08)+'" rx="'+(vb.w*.31)+'" ry="'+(vb.h*.22)+'"/>'+
      '<ellipse cx="'+(cx+vb.w*.16)+'" cy="'+(cy-vb.h*.11)+'" rx="'+(vb.w*.24)+'" ry="'+(vb.h*.18)+'"/>'+
      '</g>';
    return contours+roadNet+cities+contextPts;
  }
  function tileXToLng(x,z){return x/Math.pow(2,z)*360-180;}
  function tileYToLat(y,z){const n=Math.PI-2*Math.PI*y/Math.pow(2,z);return 180/Math.PI*Math.atan(.5*(Math.exp(n)-Math.exp(-n)));}
  function chooseTileZoom(vb){
    if(vb.w<58)return 13;
    if(vb.w<105)return 12;
    if(vb.w<190)return 11;
    if(vb.w<360)return 10;
    return 9;
  }
  function rasterTileLayer(vb){
    const z=chooseTileZoom(vb),n=Math.pow(2,z);
    const west=B.west+(vb.x/B.width)*(B.east-B.west);
    const east=B.west+((vb.x+vb.w)/B.width)*(B.east-B.west);
    const yS=Math.log(Math.tan(Math.PI/4+B.south*Math.PI/360));
    const yN=Math.log(Math.tan(Math.PI/4+B.north*Math.PI/360));
    const yTop=yN-(vb.y/B.height)*(yN-yS);
    const yBottom=yN-((vb.y+vb.h)/B.height)*(yN-yS);
    const north=(Math.atan(Math.exp(yTop))*360/Math.PI)-90;
    const south=(Math.atan(Math.exp(yBottom))*360/Math.PI)-90;
    const tx0=Math.max(0,Math.floor((west+180)/360*n));
    const tx1=Math.min(n-1,Math.floor((east+180)/360*n));
    const latToTy=(lat)=>Math.floor((1-Math.asinh(Math.tan(lat*Math.PI/180))/Math.PI)/2*n);
    const ty0=Math.max(0,latToTy(north)),ty1=Math.min(n-1,latToTy(south));
    let images='';
    let count=0;
    for(let x=tx0;x<=tx1;x++){
      for(let y=ty0;y<=ty1;y++){
        if(count++>24)break;
        const lng0=tileXToLng(x,z),lng1=tileXToLng(x+1,z);
        const lat0=tileYToLat(y,z),lat1=tileYToLat(y+1,z);
        const p0=merc(lng0,lat0),p1=merc(lng1,lat1);
        images+='<image class="online-osm-tile" href="https://tile.openstreetmap.org/'+z+'/'+x+'/'+y+'.png" x="'+p0.x.toFixed(2)+'" y="'+p0.y.toFixed(2)+'" width="'+(p1.x-p0.x).toFixed(2)+'" height="'+(p1.y-p0.y).toFixed(2)+'" preserveAspectRatio="none"/>';
      }
    }
    return '<g class="online-osm-tiles">'+images+'</g>';
  }
  function mapSvg(ids,day,mini){
    const ratio=mini?1.55:1.62;
    const vb=day?boundsFor(ids,ratio):{x:0,y:0,w:B.width,h:B.height};
    // All route maps now use a self-drawn vector basemap. It always fills the
    // viewport, carries no third-party watermark, and keeps the route readable.
    const base=cleanBasemapLayer(vb,mini);
    const local=day?contextLayer(vb,ids,mini)+(mini?'':localGrid(vb)):'';
    return '<svg class="'+(mini?'offline-mini-svg':'offline-overview-svg')+'" viewBox="'+vb.x+' '+vb.y+' '+vb.w+' '+vb.h+'" role="img" aria-label="'+(day?'第'+day+'天完整路线':'晋蒙宁15天行程总览')+'">'+
      base+local+routeLayer(day,mini)+markerLayer(ids,Boolean(day),vb,mini)+'</svg>';
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
      '<p class="offline-map-source">底图已改为自绘无水印简化矢量图；标点使用固定经纬度和 Web Mercator 投影。地图本身不再请求第三方瓦片，只有点击导航后才会打开高德/百度。</p>';
  }
  function miniMarkup(day){
    const ids=ROUTES[day]||[];
    if(!ids.length)return "";
    return '<div class="offline-daily-mini-map"><div class="offline-daily-mini-head"><strong>D'+day+' 当天小地图</strong><span>简化底图 · 编号即顺序</span></div><div class="offline-mini-canvas">'+mapSvg(ids,day,true)+'</div><div class="offline-mini-sequence">'+ids.map((id,index)=>'<button type="button" data-offline-point="'+id+'"><b>'+(index+1)+'</b>'+esc(POINTS[id]?.name||id)+'</button>').join("")+'</div></div>';
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
