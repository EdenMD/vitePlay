
// config.parcelpilot-ad.js
// "Deliver More. Worry Less." — ParcelPilot commercial
// APEX Video Engine
//
// 5 scenes: The problem -> The discovery -> The platform ->
//           The transformation -> Brand reveal + CTA
//
// Visual system:
// - Original inline SVG illustrations
// - Layered characters with independently animated limbs
// - Animated logistics dashboard, map, van and parcels
// - Vanilla JS + CSS only
// - Word-synced apexframe reveals + timed fallbacks
//
// No external images, frameworks or browser dependencies.

const C = {
  paper: '#FFF8ED',
  ink: '#24332F',
  muted: '#75827A',
  orange: '#FF8157',
  orange2: '#F05C35',
  teal: '#159D89',
  tealDark: '#087765',
  mint: '#DDF5E8',
  yellow: '#FFD16C',
  blue: '#80BFEF',
  cream: '#F6E9D3',
  white: '#FFFFFF',
  dark: '#1D3530',
  lavender: '#C8B8EF',
  shadow: 'rgba(36,51,47,.13)'
};

const FONT = "'Poppins','Nunito','Segoe UI',Arial,sans-serif";
const MONO = "'JetBrains Mono','Courier New',monospace";

function text(x,y,s,size=36,color=C.ink,anchor='middle',weight=800) {
  return `<text x="${x}" y="${y}" fill="${color}" font-size="${size}"
    font-family="${FONT}" font-weight="${weight}"
    text-anchor="${anchor}">${s}</text>`;
}

function mono(x,y,s,size=25,color=C.white) {
  return `<text x="${x}" y="${y}" fill="${color}" font-size="${size}"
    font-family="${MONO}" font-weight="700">${s}</text>`;
}

function rect(x,y,w,h,r,fill,extra='') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}"
    rx="${r}" fill="${fill}" ${extra}/>`;
}

function circle(x,y,r,fill,extra='') {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
}

function path(d,fill,extra='') {
  return `<path d="${d}" fill="${fill}" ${extra}/>`;
}

function line(x1,y1,x2,y2,color=C.ink,width=8,extra='') {
  return `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none"
    stroke="${color}" stroke-width="${width}"
    stroke-linecap="round" ${extra}/>`;
}

function group(id, content, cls='revealgrp') {
  return `<g id="${id}" class="${cls}">${content}</g>`;
}

function animate(cls,d=2,delay=0,extra='') {
  return `class="a ${cls}" style="--d:${d}s;--dl:${delay}s;${extra}"`;
}

function shadowRect(x,y,w,h,r,fill) {
  return rect(x,y,w,h,r,fill,
    'filter="url(#shadow)"');
}

function bubble(x,y,w,h,fill,side='left') {
  const tail = side === 'left'
    ? `M${x+45} ${y+h-25} l-30 38 l65 -35`
    : `M${x+w-45} ${y+h-25} l30 38 l-65 -35`;

  return `<g filter="url(#shadow)">
    ${rect(x,y,w,h,34,fill)}
    <path d="${tail}" fill="${fill}"/>
  </g>`;
}

// ------------------------------------------------------------
// ORIGINAL ILLUSTRATED CHARACTERS
// Coordinates are relative to each character's local origin.
// ------------------------------------------------------------

function person({skin='#C98259',shirt=C.teal,pants=C.dark,
  hair='#34251F',pose='stand',expression='smile'}={}) {

  const arms = pose === 'phone'
    ? `
      <g id="leftArm">
        ${path('M-27 -120 Q-75 -95 -65 -45 L-34 -10',
          'none',`stroke="${skin}" stroke-width="24"
          stroke-linecap="round"`)}
      </g>
      <g id="rightArm" transform="rotate(-35 28 -115)">
        ${path('M28 -115 Q65 -90 58 -40 L30 -12',
          'none',`stroke="${skin}" stroke-width="24"
          stroke-linecap="round"`)}
      </g>`
    : `
      <g id="leftArm">
        ${path('M-28 -120 Q-90 -80 -75 -20',
          'none',`stroke="${skin}" stroke-width="25"
          stroke-linecap="round"`)}
        ${circle(-76,-15,13,skin)}
      </g>
      <g id="rightArm">
        ${path('M28 -120 Q85 -90 75 -30',
          'none',`stroke="${skin}" stroke-width="25"
          stroke-linecap="round"`)}
        ${circle(75,-25,13,skin)}
      </g>`;

  const face = expression === 'worried'
    ? `
      ${path('M-22 18 Q-10 4 0 18 M8 18 Q20 4 30 18',
        'none',`stroke="#50352B" stroke-width="5"
        stroke-linecap="round"`)}
      ${path('M-13 53 Q0 40 15 53',
        'none',`stroke="#50352B" stroke-width="5"
        stroke-linecap="round"`)}`
    : `
      ${circle(-16,16,4,'#34251F')}
      ${circle(16,16,4,'#34251F')}
      ${path('M-15 42 Q0 60 17 42',
        'none',`stroke="#803F35" stroke-width="5"
        stroke-linecap="round"`)}`;

  return `
    <g id="body">
      <g id="legs">
        <path d="M-23 -12 L-30 72" stroke="${pants}"
          stroke-width="29" stroke-linecap="round"/>
        <path d="M23 -12 L30 72" stroke="${pants}"
          stroke-width="29" stroke-linecap="round"/>
        <path d="M-30 72 L-55 78 M30 72 L55 78"
          stroke="${C.ink}" stroke-width="22"
          stroke-linecap="round"/>
      </g>

      <g id="torso">
        ${path('M-34 -150 Q0 -170 34 -150 L43 -24 Q0 -5 -43 -24Z',
          shirt)}
        ${arms}
      </g>

      <g id="head">
        ${circle(0,-192,47,skin)}
        ${path('M-47 -202 Q-55 -258 0 -255 Q53 -256 47 -198
          Q27 -226 7 -225 Q-20 -219 -47 -202Z',hair)}
        ${face}
      </g>
    </g>`;
}

// Phone held beside a character.
function phone(x,y,scale=1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})"
    filter="url(#shadow)">
    ${rect(-52,-100,104,190,22,C.dark)}
    ${rect(-45,-89,90,166,15,C.white)}
    ${circle(0,83,5,C.muted)}
    ${circle(-25,-63,9,C.teal)}
    ${rect(-9,-70,40,9,5,C.cream)}
    ${rect(-30,-32,65,38,12,C.mint)}
    ${rect(-18,16,50,35,12,C.blue)}
    ${circle(30,-55,4,C.orange)}
  </g>`;
}

// Parcel illustration.
function parcel(x,y,s=1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${path('M-85 -42 L0 -88 L85 -42 L0 8Z','#EAB96D')}
    ${path('M-85 -42 V58 L0 105 V8Z','#D99A52')}
    ${path('M85 -42 V58 L0 105 V8Z','#F4C77E')}
    ${path('M-17 -78 L-17 63', 'none',
      'stroke="#C47D3D" stroke-width="14"')}
    ${path('M-17 -78 L0 -88 L17 -78 L17 68 L0 77',
      'none','stroke="#C47D3D" stroke-width="12"')}
    ${rect(-50,20,37,28,5,C.white)}
  </g>`;
}

// Delivery van.
function van(x,y,s=1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${rect(-190,-75,255,130,25,C.teal)}
    ${path('M65 -75 H120 Q145 -75 160 -45 L190 0 V55 H65Z',
      C.orange)}
    ${path('M105 -59 H125 Q140 -59 151 -37 L170 -7 H105Z',
      '#C9E7F7')}
    ${rect(-150,-42,120,65,12,'#FFFFFF')}
    ${text(-90,1,'PP',39,C.tealDark)}
    ${circle(-115,63,35,C.dark)}
    ${circle(125,63,35,C.dark)}
    ${circle(-115,63,15,'#E8E5DA')}
    ${circle(125,63,15,'#E8E5DA')}
    ${rect(-187,37,20,12,5,C.yellow)}
  </g>`;
}

// ------------------------------------------------------------
// BACKGROUNDS AND SCENE ENGINE
// ------------------------------------------------------------

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;
 font-family:${FONT};color:${C.ink}}
svg{overflow:visible}
#stage{position:absolute;top:250px;left:40px;
 width:1000px;height:1500px}
.badge{position:absolute;top:105px;left:50%;
 transform:translateX(-50%);padding:18px 40px;
 background:white;border-radius:100px;
 box-shadow:0 10px 35px ${C.shadow};
 font-size:36px;font-weight:900;white-space:nowrap;
 opacity:0;transition:opacity .5s}
.badge.on{opacity:1}
.revealgrp{opacity:0;transform:translateY(45px) scale(.92);
 transform-box:fill-box;transform-origin:center;
 transition:opacity .5s ease,transform .65s cubic-bezier(.2,1.4,.4,1)}
.revealgrp.on{opacity:1;transform:none}
.revealgrp.fadeout{opacity:0!important;
 transform:translateY(-35px) scale(.9)!important}
.a{animation-duration:var(--d,2s);
 animation-delay:var(--dl,0s);
 animation-iteration-count:var(--n,infinite);
 animation-direction:var(--dir,alternate);
 animation-timing-function:var(--e,ease-in-out);
 animation-fill-mode:both;animation-play-state:paused}
.revealgrp.on .a,.always .a{animation-play-state:running}
.float{animation-name:float}
.bob{animation-name:bob}
.pulse{animation-name:pulse}
.pop{animation-name:pop;--n:1;--dir:normal;
 --e:cubic-bezier(.2,1.5,.4,1)}
.move{animation-name:move;--dir:normal}
.spin{animation-name:spin;--dir:normal;--e:linear}
.wiggle{animation-name:wiggle}
.draw{animation-name:draw;--n:1;--dir:normal;
 stroke-dasharray:1000;stroke-dashoffset:1000}
@keyframes float{0%,100%{transform:translateY(0)}
 50%{transform:translateY(-22px)}}
@keyframes bob{0%,100%{transform:translateY(0)}
 50%{transform:translateY(-10px)}}
@keyframes pulse{0%,100%{transform:scale(1)}
 50%{transform:scale(1.07)}}
@keyframes pop{from{transform:scale(.4);opacity:0}
 to{transform:scale(1);opacity:1}}
@keyframes move{to{transform:translate(var(--dx,100px),
 var(--dy,0px))}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes wiggle{0%,100%{transform:rotate(-5deg)}
 50%{transform:rotate(5deg)}}
@keyframes draw{to{stroke-dashoffset:0}}
`;

const DEFS = `
<defs>
 <filter id="shadow" x="-40%" y="-40%" width="180%" height="190%">
  <feDropShadow dx="0" dy="12" stdDeviation="13"
    flood-color="#24332F" flood-opacity=".15"/>
 </filter>
 <linearGradient id="sunset" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#FFE2B8"/>
  <stop offset="1" stop-color="#FFD1B9"/>
 </linearGradient>
 <linearGradient id="green" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#32C6A3"/>
  <stop offset="1" stop-color="#087765"/>
 </linearGradient>
</defs>`;

function makeScene({badge,background,groups}) {
  const reveal = {};
  const timed = [];

  groups.forEach(g=>{
    if(g.always)return;
    if(g.word){
      reveal[g.word.toLowerCase().replace(/[^a-z0-9]/g,'')] =
        [...(reveal[g.word.toLowerCase().replace(/[^a-z0-9]/g,'')]||[]),g.id];
    }
    if(g.time!==undefined) timed.push([g.id,g.time]);
  });

  const layers = groups.map(g=>`
    <g transform="translate(${g.x||0} ${g.y||0})">
      <g transform="scale(${g.scale||1})">
        ${group(g.id,g.svg,g.always?'always':'revealgrp')}
      </g>
    </g>`).join('');

  const html = `<!DOCTYPE html><html><head>
<meta charset="utf-8"><style>
${CSS}
body{background:${background}}
</style></head><body>
<div class="badge" id="badge">${badge}</div>
<svg id="stage" viewBox="0 0 1000 1500"
 xmlns="http://www.w3.org/2000/svg">
${DEFS}${layers}
</svg>
<script>
(function(){
 const map=${JSON.stringify(reveal)};
 const times=${JSON.stringify(timed)};
 const seen={};

 function show(id){
  if(seen[id])return;
  seen[id]=true;
  const el=document.getElementById(id);
  if(el)el.classList.add('on');
 }

 function frame(e){
  const d=e.detail||{};
  const w=(d.word||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  (map[w]||[]).forEach(show);
  times.forEach(([id,t])=>{if(d.t>t)show(id)});
  document.getElementById('badge').classList.add('on');
 }

 window.addEventListener('apexframe',frame);
 document.body.setAttribute('data-ready','1');
})();
</script></body></html>`;

  return {
    type:'html-record',
    html,
    audioSync:true,
    cursor:false,
    waitFor:'[data-ready="1"]',
    fps:30,
    viewport:{width:1080,height:1920},
    x:0,y:0,width:1080,height:1920,
    fit:'cover'
  };
}

function scene(tts,layer,transition='fade'){
  return {
    transition,
    tts:{text:tts,pauseAfter:.3},
    captions:false,
    layers:[
      {type:'background',color:C.paper},
      layer
    ]
  };
}

const S=[];

// ============================================================
// SCENE 1 — THE PROBLEM
// A small business owner is overwhelmed by deliveries.
// ============================================================

S.push(scene(
 "Running a business is hard enough. But when deliveries get messy, customers get frustrated, and your day turns into one big chase.",
 makeScene({
  badge:'Every delivery tells a story',
  background:'#FFF5E8',
  groups:[
   {id:'sun',always:true,svg:`
    <circle cx="500" cy="610" r="340" fill="url(#sunset)" opacity=".6"/>
    <circle cx="130" cy="170" r="95" fill="#FFE3AD" opacity=".7"/>
   `},
   {id:'owner',word:'business',x:360,y:690,scale:1.25,time:1,
    svg:`
      <g ${animate('bob',2.5)}>
       ${person({skin:'#A9674E',shirt:C.orange,
         hair:'#29201E',expression:'worried'})}
      </g>
      ${phone(95,-110,.85)}
    `},
   {id:'box1',word:'deliveries',x:750,y:940,time:3,
    svg:`<g ${animate('float',2.4)}>${parcel(0,0,.8)}</g>`},
   {id:'bubble1',word:'frustrated',x:690,y:400,time:5,
    svg:`
      ${bubble(-180,-80,380,135,C.white,'right')}
      ${text(10,-2,'Where is my order?',31,C.ink)}
      ${text(10,38,'Still waiting...',24,C.muted, 'middle',600)}
    `},
   {id:'alert',word:'messy',x:190,y:1130,time:7,
    svg:`
      <g ${animate('wiggle',.8)}>
       ${circle(0,0,53,C.orange)}
       ${text(0,20,'!',70,C.white)}
      </g>
      ${text(0,110,'Too many problems',29,C.orange)}
    `},
   {id:'title',word:'chase',x:500,y:1350,time:9,
    svg:`
      ${text(0,0,'Lost in the',74,C.ink)}
      ${text(0,88,'delivery chaos?',83,C.orange2)}
    `}
  ]
 })
));

// ============================================================
// SCENE 2 — DISCOVERY
// The solution arrives. The owner discovers ParcelPilot.
// ============================================================

S.push(scene(
 "What if every order, driver, and customer update lived in one place? Meet ParcelPilot. The smarter way to manage deliveries.",
 makeScene({
  badge:'Meet ParcelPilot',
  background:'#EAF7EC',
  groups:[
   {id:'halo',always:true,svg:`
    <circle cx="500" cy="700" r="390" fill="#CDEFE0" opacity=".65"/>
    <circle cx="500" cy="700" r="275" fill="#DFF6E9"/>
   `},
   {id:'phone',word:'what',x:500,y:680,time:1,
    svg:`
     <g ${animate('float',3)}>
      ${shadowRect(-155,-250,310,500,42,C.dark)}
      ${rect(-139,-232,278,462,30,C.white)}
      ${circle(0,-210,8,C.muted)}
      ${text(0,-165,'ParcelPilot',30,C.tealDark)}
      ${rect(-110,-130,220,90,20,C.mint)}
      ${circle(-75,-85,19,C.teal)}
      ${text(0,-75,'Orders',23,C.ink)}
      ${rect(-110,-20,220,90,20,'#FFF0D9')}
      ${circle(-75,25,19,C.orange)}
      ${text(0,33,'Drivers',23,C.ink)}
      ${rect(-110,90,220,90,20,'#E8E9FF')}
      ${circle(-75,135,19,C.lavender)}
      ${text(0,143,'Tracking',23,C.ink)}
     </g>
    `},
   {id:'spark',word:'meet',x:500,y:340,time:2,
    svg:`
     ${circle(0,0,100,C.white,'filter="url(#shadow)"')}
     <g ${animate('pulse',1.4)}>
      ${path('M-42 -24 L0 -55 L42 -24 L42 22 L0 52 L-42 22Z',
       'url(#green)')}
      ${path('M-22 0 L-5 18 L27 -19','none',
       'stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"')}
     </g>
    `},
   {id:'brand',word:'parcelpilot',x:500,y:1130,time:5,
    svg:`
     ${text(0,0,'Parcel',88,C.ink)}
     ${text(0,95,'Pilot',105,C.teal)}
     ${text(0,165,'DELIVERY MANAGEMENT',24,C.muted)}
    `},
   {id:'tag',word:'smarter',x:500,y:1360,time:8,
    svg:`
     ${rect(-260,-40,520,80,40,C.white,'filter="url(#shadow)"')}
     ${text(0,13,'Deliver more. Worry less.',34,C.tealDark)}
    `}
  ]
 })
));

// ============================================================
// SCENE 3 — THE PRODUCT
// Show actual features in an animated dashboard composition.
// ============================================================

S.push(scene(
 "Create orders in seconds. Assign drivers with a tap. Track every delivery on a live map, and keep customers updated automatically.",
 makeScene({
  badge:'Everything in one dashboard',
  background:'#FFF7E9',
  groups:[
   {id:'dashboard',word:'orders',x:500,y:650,time:1,
    svg:`
     ${shadowRect(-420,-265,840,530,40,C.white)}
     ${rect(-420,-265,840,75,40,C.dark)}
     ${rect(-420,-220,840,30,0,C.dark)}
     ${circle(-375,-228,9,C.orange)}
     ${circle(-345,-228,9,C.yellow)}
     ${circle(-315,-228,9,C.teal)}
     ${text(-270,-215,'ParcelPilot',27,C.white,'start')}
     ${text(-355,-130,'Today at a glance',30,C.ink,'start')}
     ${rect(-360,-85,215,100,18,C.mint)}
     ${text(-250,-30,'128',43,C.tealDark)}
     ${text(-250,0,'Orders',20,C.muted)}
     ${rect(-110,-85,215,100,18,'#FFF0D9')}
     ${text(0,-30,'96',43,C.orange2)}
     ${text(0,0,'Delivered',20,C.muted)}
     ${rect(140,-85,215,100,18,'#ECE9FF')}
     ${text(250,-30,'12',43,'#7864C6')}
     ${text(250,0,'In transit',20,C.muted)}
     ${text(-350,90,'Recent deliveries',24,C.ink,'start')}
     ${[0,1,2].map((v)=>`
       ${circle(-335,145+v*48,12,v===0?C.teal:C.orange)}
       ${rect(-300,134+v*48,300,13,7,'#E8EAE4')}
       ${rect(160,134+v*48,155,13,7,C.mint)}
     `).join('')}
    `},
   {id:'map',word:'map',x:500,y:1160,time:4,
    svg:`
     ${shadowRect(-405,-190,810,380,35,'#E8F2E9')}
     <path d="M-370 -120 L-160 -170 L-10 -80 L150 -160 L370 -95
       L340 145 L160 175 L-40 90 L-220 160 L-370 80Z"
       fill="#D1E8D4"/>
     <path d="M-340 -100 L-200 0 L-40 -70 L100 65 L300 -50"
       fill="none" stroke="#FFFFFF" stroke-width="24"
       stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M-340 -100 Q-180 130 0 20 T300 -50"
       fill="none" stroke="${C.orange}" stroke-width="10"
       stroke-dasharray="18 15" stroke-linecap="round"/>
     <g ${animate('bob',1.4)}>
      ${circle(-340,-100,28,C.teal)}
      ${text(-340,-90,'1',24,C.white)}
     </g>
     <g ${animate('bob',1.4,.3)}>
      ${circle(300,-50,28,C.orange)}
      ${text(300,-40,'2',24,C.white)}
     </g>
     ${circle(0,20,30,C.white,'filter="url(#shadow)"')}
     ${circle(0,20,17,C.teal)}
    `},
   {id:'feature',word:'automatically',x:500,y:1440,time:8,
    svg:`
     ${rect(-350,-45,700,90,45,C.teal)}
     ${text(0,14,'Live tracking. Instant updates.',30,C.white)}
    `}
  ]
 })
));

// ============================================================
// SCENE 4 — TRANSFORMATION
// Owner is relaxed. Driver and customer are connected.
// ============================================================

S.push(scene(
 "No more endless phone calls. No more guessing. Your team knows where every package is, and your customers know exactly when to expect it.",
 makeScene({
  badge:'A better delivery experience',
  background:'#EAF7EF',
  groups:[
   {id:'sun',always:true,svg:`
    <circle cx="500" cy="650" r="380" fill="#D5F0DE"/>
   `},
   {id:'owner',word:'guessing',x:230,y:770,scale:1.05,time:1,
    svg:`
     <g ${animate('float',3)}>
      ${person({skin:'#A9674E',shirt:C.teal,
        hair:'#29201E',expression:'smile'})}
     </g>
     ${circle(0,-280,45,C.yellow,'filter="url(#shadow)"')}
     ${text(0,-263,'✓',48,C.tealDark)}
    `},
   {id:'driver',word:'team',x:770,y:770,scale:1.05,time:2,
    svg:`
     <g ${animate('bob',2)}>
      ${person({skin:'#D99D75',shirt:C.orange,
        hair:'#4A3028',expression:'smile'})}
     </g>
     ${parcel(0,110,.35)}
    `},
   {id:'van',word:'package',x:500,y:1080,time:3,
    svg:`<g ${animate('move',2,0,'--dx:24px')}>
     ${van(0,0,.85)}
    </g>`},
   {id:'connection',word:'customers',x:500,y:510,time:5,
    svg:`
     <path d="M-230 0 Q0 -140 230 0" fill="none"
       stroke="${C.teal}" stroke-width="8"
       stroke-dasharray="12 14"/>
     ${circle(-230,0,26,C.orange)}
     ${circle(230,0,26,C.teal)}
     <g ${animate('pulse',1.5)}>
      ${circle(0,-65,50,C.white,'filter="url(#shadow)"')}
      ${text(0,-48,'✓',55,C.teal)}
     </g>
    `},
   {id:'happy',word:'expect',x:500,y:1370,time:8,
    svg:`
     ${text(0,0,'Everyone stays',64,C.ink)}
     ${text(0,75,'in the loop.',78,C.teal)}
    `}
  ]
 })
));

// ============================================================
// SCENE 5 — BRAND REVEAL AND CALL TO ACTION
// ============================================================

S.push(scene(
 "Whether you're delivering ten orders or ten thousand, make every delivery count. ParcelPilot. Deliver more. Worry less. Visit ParcelPilot dot example today.",
 makeScene({
  badge:'Your business. Moving forward.',
  background:'#FFF4E6',
  groups:[
   {id:'halo',always:true,svg:`
    <circle cx="500" cy="680" r="410" fill="#FFE3C4"/>
    <circle cx="500" cy="680" r="300" fill="#FDEDD8"/>
   `},
   {id:'van',word:'delivering',x:500,y:530,time:1,
    svg:`
     <g ${animate('float',2.5)}>
      ${van(0,0,1.15)}
     </g>
    `},
   {id:'boxes',word:'count',x:230,y:900,time:3,
    svg:`<g ${animate('bob',2)}>${parcel(0,0,.7)}</g>`},
   {id:'brand',word:'parcelpilot',x:500,y:1100,time:4,
    svg:`
     ${circle(0,-30,80,C.teal)}
     ${path('M-35 -35 L0 -60 L35 -35 L35 30 L0 55 L-35 30Z',
       C.white)}
     ${path('M-18 0 L-3 16 L23 -15','none',
       'stroke="#159D89" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"')}
     ${text(0,130,'ParcelPilot',100,C.ink)}
     ${text(0,195,'DELIVER MORE. WORRY LESS.',26,C.tealDark)}
    `},
   {id:'cta',word:'visit',x:500,y:1390,time:8,
    svg:`
     <g ${animate('pulse',1.3)}>
      ${rect(-290,-52,580,104,52,C.orange)}
      ${text(0,16,'GET STARTED TODAY',34,C.white)}
     </g>
     ${text(0,112,'parcelpilot.example',29,C.muted)}
    `},
   {id:'credit',word:'example',x:500,y:1480,time:11,
    svg:text(0,0,'An illustrative fictional brand concept',19,C.muted,'middle',500)}
  ]
 })
));

// ------------------------------------------------------------
// EXPORT
// ------------------------------------------------------------

const TRANSITIONS = [
 'fade',
 'wipe-left',
 'wipe-up',
 'fade',
 'zoom'
];

module.exports = {
 output:{
  title:'parcelpilot-brand-advertisement',
  format:'portrait',
  fps:30,
  crf:22,
  preset:'medium'
 },
 defaults:{
  voice:'am_adam',
  speed:1.02,
  transition:'fade',
  transitionDuration:.45
 },
 scenes:S.map((s,i)=>Object.assign(s,{
  transition:TRANSITIONS[i]||'fade'
 }))
};
