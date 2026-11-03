// config.rocket-story.js
// "From Dirt to Landing: How a Rocket Is Made" — APEX Video Engine config
// 16 scenes: raw materials -> refining -> propellant -> blueprints -> tanks -> engines -> test -> stacking
//            -> rollout -> launch -> staging -> orbit -> booster return -> reuse loop.
// Every scene has continuous motion (CSS keyframes) + word-synced reveals (apexframe).

const THEME = {
    paper: '#efe6d3', ink: '#231b12', accent: '#b5402c', accent2: '#2c6b5a',
    shadow: 'rgba(20,16,10,0.4)', highlight: '#ffe08a',
    bpLine: '#dff0ff', bpSoft: '#8fbcff', bpHi: '#ffd23f',
    fire: '#ff7a1a', fireHi: '#ffd23f', cold: '#4dd0ff', metal: '#c9ced6'
};
const FI = "Impact,'Arial Black',sans-serif";
const FM = "'Courier New',Courier,monospace";

// ── tiny helpers ────────────────────────────────────────────────
function T(x, y, str, size = 30, fill = THEME.ink, anchor = 'middle', font = FI, extra = '') {
    return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${fill}" font-family="${font}" ${extra}>${str}</text>`;
}
const M = (x, y, str, size = 26, fill = THEME.bpLine, anchor = 'middle') =>
    T(x, y, str, size, fill, anchor, FM, 'font-weight="bold"');
const ORG = { top: '50% 0%', bottom: '50% 100%', left: '0% 50%', right: '100% 50%', center: '50% 50%' };
// animation attribute: class + timing vars. o = 'top'|'bottom'|... or [x,y] pivot in local coords
function an(cls, d = 2, dl = 0, o = 'center', extra = '') {
    const org = Array.isArray(o)
        ? `transform-box:view-box;transform-origin:${o[0]}px ${o[1]}px;`
        : `transform-box:fill-box;transform-origin:${ORG[o] || o};`;
    return `class="a ${cls}" style="--d:${d}s;--dl:${dl}s;${org}${extra}"`;
}
// blueprint line that "draws itself"
function dr(d, dl = 0, dur = 1.6, sw = 5, col = THEME.bpLine) {
    return `<path d="${d}" pathLength="1000" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${an('draw', dur, dl, 'center', '--n:1;')}/>`;
}

function stickman(x, groundY, leftArm, rightArm, opts = {}) {
    const color = opts.color || THEME.ink, hy = groundY - 128, sy = groundY - 98;
    let s = `<g stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <line x1="${x}" y1="${groundY - 110}" x2="${x}" y2="${groundY - 60}"/>
        <line x1="${x}" y1="${groundY - 60}" x2="${x - 18}" y2="${groundY}"/>
        <line x1="${x}" y1="${groundY - 60}" x2="${x + 18}" y2="${groundY}"/>
        <line x1="${x}" y1="${sy}" x2="${x + leftArm[0]}" y2="${sy + leftArm[1]}"/>
        ${opts.wave ? '' : `<line x1="${x}" y1="${sy}" x2="${x + rightArm[0]}" y2="${sy + rightArm[1]}"/>`}
    </g>`;
    if (opts.wave) s += `<g ${an('wave', .7, 0, [x, sy])}><line x1="${x}" y1="${sy}" x2="${x + rightArm[0]}" y2="${sy + rightArm[1]}" stroke="${color}" stroke-width="6" stroke-linecap="round"/></g>`;
    s += `<circle cx="${x}" cy="${hy}" r="18" fill="#fff" stroke="${color}" stroke-width="6"/>`;
    s += `<circle cx="${x - 6}" cy="${hy - 1}" r="2.5" fill="#231b12"/><circle cx="${x + 6}" cy="${hy - 1}" r="2.5" fill="#231b12"/>`;
    s += opts.sad ? `<path transform="translate(${x} ${hy})" d="M-7 8 Q0 3 7 8" stroke="#231b12" stroke-width="3" fill="none"/>`
        : `<path transform="translate(${x} ${hy})" d="${opts.wide ? 'M-8 4 Q0 14 8 4' : 'M-7 5 Q0 11 7 5'}" stroke="#231b12" stroke-width="3" fill="none"/>`;
    if (opts.hat) s += `<path d="M${x - 19} ${hy - 6} A19 17 0 0 1 ${x + 19} ${hy - 6} Z" fill="#ffcc00" stroke="#231b12" stroke-width="3"/><line x1="${x - 24}" y1="${hy - 6}" x2="${x + 24}" y2="${hy - 6}" stroke="#231b12" stroke-width="4"/>`;
    if (opts.ears) s += `<circle cx="${x - 19}" cy="${hy}" r="7" fill="#e63946" stroke="#231b12" stroke-width="2"/><circle cx="${x + 19}" cy="${hy}" r="7" fill="#e63946" stroke="#231b12" stroke-width="2"/>`;
    if (opts.sweat) s += `<path d="M${x + 22} ${hy - 14} q5 8 0 14 q-5 -6 0 -14" fill="#4dd0ff" opacity=".85"/>`;
    return `<g>${s}</g>`;
}
function sfx(x, y, text, rot, fill, fs = 40, stroke = THEME.ink) {
    return `<text x="${x}" y="${y}" transform="rotate(${rot} ${x} ${y})" font-size="${fs}" font-family="${FI}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" paint-order="stroke" font-style="italic" text-anchor="middle">${text}</text>`;
}
function arrow(x1, y1, x2, y2, color = THEME.ink, w = 8) {
    const dx = x2 - x1, dy = y2 - y1, ang = Math.atan2(dy, dx), cx = x1 + dx / 2 - dy * .15, cy = y1 + dy / 2 + dx * .15, h = 24;
    return `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" ${an('flow dash', 1)}/>
      <line x1="${x2}" y1="${y2}" x2="${x2 - h * Math.cos(ang - .5)}" y2="${y2 - h * Math.sin(ang - .5)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>
      <line x1="${x2}" y1="${y2}" x2="${x2 - h * Math.cos(ang + .5)}" y2="${y2 - h * Math.sin(ang + .5)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
}
function flameSvg(len = 100, w = 26, d = .16) {
    return `<g ${an('flicker', d, 0, 'top')}><path d="M${-w} 0 Q${-w * .8} ${len * .6} 0 ${len} Q${w * .8} ${len * .6} ${w} 0Z" fill="${THEME.fire}"/><path d="M${-w * .55} 0 Q${-w * .4} ${len * .4} 0 ${len * .62} Q${w * .4} ${len * .4} ${w * .55} 0Z" fill="${THEME.fireHi}"/></g>`;
}
// rocket drawn with base at y=0, centred on x=0, pointing up
function rocket(h = 320, w = 44, o = {}) {
    const c = o.color || '#f6f3ec', ink = o.ink || THEME.ink, sw = o.sw || 5; let s = '';
    if (o.fins !== false) s += `<path d="M${-w} ${-h * .18} L${-w * 1.9} 0 L${-w} 0Z M${w} ${-h * .18} L${w * 1.9} 0 L${w} 0Z" fill="${THEME.accent}" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    if (o.legs) s += `<path d="M${-w} ${-h * .12} L${-w * 2.1} 26 M${w} ${-h * .12} L${w * 2.1} 26" stroke="${ink}" stroke-width="${sw + 1}" stroke-linecap="round" fill="none"/>`;
    s += `<path d="M${-w} 0 V${-h * .8} Q${-w} ${-h * .95} 0 ${-h} Q${w} ${-h * .95} ${w} ${-h * .8} V0Z" fill="${c}" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    s += `<line x1="${-w}" y1="${-h * .42}" x2="${w}" y2="${-h * .42}" stroke="${ink}" stroke-width="${sw * .6}"/><line x1="${-w}" y1="${-h * .8}" x2="${w}" y2="${-h * .8}" stroke="${ink}" stroke-width="${sw * .6}"/>`;
    s += `<circle cx="0" cy="${-h * .62}" r="${w * .32}" fill="${THEME.cold}" stroke="${ink}" stroke-width="${sw * .7}"/>`;
    s += `<path d="M${-w * .55} 0 L${-w * .75} 22 H${w * .75} L${w * .55} 0Z" fill="#555" stroke="${ink}" stroke-width="${sw * .7}"/>`;
    if (o.flame) s += `<g transform="translate(0 22)">${flameSvg(o.flame, w * .6)}</g>`;
    return s;
}
function cloud(x, y, s = 1, col = '#fff', op = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})" fill="${col}" opacity="${op}"><circle r="30"/><circle cx="34" cy="-12" r="36"/><circle cx="72" cy="0" r="28"/><rect x="-30" y="0" width="130" height="28" rx="14"/></g>`;
}
function puff(x, y, r, dl = 0, dy = -260, d = 2.6, col = 'rgba(255,255,255,.6)') {
    return `<circle ${an('rise', d, dl, 'center', `--dy:${dy}px;--sc:2.2;`)} cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
}
function stars(n = 40, seed = 3) {
    let r = seed, o = ''; const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
    for (let i = 0; i < n; i++) {
        const x = Math.round(rnd() * 1080 - 40), y = Math.round(rnd() * 1900 - 260), s = 1.5 + rnd() * 2.5;
        o += `<circle ${an('twinkle', (1.2 + rnd() * 2.5).toFixed(1), (rnd() * 2).toFixed(1))} cx="${x}" cy="${y}" r="${s.toFixed(1)}" fill="#fff"/>`;
    }
    return o;
}
function sparks(x, y, n = 8, col = THEME.fireHi, len = 22, d = .5) {
    let o = '';
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + .3;
        o += `<line ${an('blink', d, i * .07)} x1="${x + Math.cos(a) * 8}" y1="${y + Math.sin(a) * 8}" x2="${x + Math.cos(a) * len}" y2="${y + Math.sin(a) * len}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
    }
    return o;
}

// ── scene wrapper ───────────────────────────────────────────────
const REVEAL_JS = `
  var seen = {};
  function show(id){ if (seen[id]) return; seen[id] = 1; var el = document.getElementById(id); if (el) el.classList.add('on'); }
  function hide(id){ var el = document.getElementById(id); if (el) { el.classList.remove('on'); el.classList.add('fadeout'); } }
  function wire(map, hideMap, fb, hideFb){
    window.addEventListener('apexframe', function(e){
      var d = e.detail, w = (d.word || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (map[w]) map[w].forEach(show);
      if (hideMap[w]) hideMap[w].forEach(hide);
      for (var i = 0; i < fb.length; i++) if (d.t > fb[i][1]) show(fb[i][0]);
      for (var j = 0; j < hideFb.length; j++) if (d.t > hideFb[j][1]) hide(hideFb[j][0]);
    });
    document.body.setAttribute('data-ready', '1');
  }
`;
const CSS_ANIM = `
  .a{animation-duration:var(--d,2s);animation-delay:var(--dl,0s);animation-iteration-count:var(--n,infinite);
     animation-direction:var(--dir,alternate);animation-timing-function:var(--e,ease-in-out);animation-fill-mode:var(--fm,both);animation-play-state:paused}
  .revealgrp.on .a,.always .a{animation-play-state:running}
  .float{animation-name:float}.bob{animation-name:bob}.pulse{animation-name:pulse}.shake{animation-name:shake;--e:linear}
  .spin{animation-name:spin;--dir:normal;--e:linear}.flicker{animation-name:flicker}
  .flow{animation-name:flow;--dir:normal;--e:linear}.dash{stroke-dasharray:16 12}
  .rise{animation-name:rise;--dir:normal;--e:ease-out}.drift{animation-name:drift;--dir:normal;--e:linear}
  .move{animation-name:move}.moveonce{animation-name:move;--n:1;--dir:normal}
  .grow{animation-name:grow;--n:1;--dir:normal;--e:cubic-bezier(.2,1.4,.4,1)}
  .growx{animation-name:growx;--n:1;--dir:normal}.growy{animation-name:growy;--n:1;--dir:normal}
  .draw{animation-name:draw;--n:1;--dir:normal;--e:ease-out;stroke-dasharray:1000;stroke-dashoffset:1000}
  .rot{animation-name:rot}.rotonce{animation-name:rot;--n:1;--dir:normal}
  .twinkle{animation-name:twinkle}.wobble{animation-name:wobble}.wave{animation-name:wave}
  .blink{animation-name:blink;--e:steps(1,end)}.ring{animation-name:ring;--dir:normal;--e:ease-out}
  .vanish{animation-name:vanish;--n:1;--dir:normal}.cnt{animation-name:cnt;--dir:normal;--e:linear;--fm:forwards}.fadein{animation-name:fadein;--n:1;--dir:normal}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.12);opacity:.85}}
  @keyframes shake{0%{transform:translate(0,0)}25%{transform:translate(-3px,2px)}50%{transform:translate(3px,-2px)}75%{transform:translate(-2px,-3px)}100%{transform:translate(2px,3px)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes flicker{0%{transform:scale(1,.85)}50%{transform:scale(1.07,1.15)}100%{transform:scale(.95,.92)}}
  @keyframes flow{to{stroke-dashoffset:-56}}
  @keyframes rise{0%{transform:translateY(0) scale(.6);opacity:0}15%{opacity:.9}100%{transform:translateY(var(--dy,-260px)) scale(var(--sc,1.8));opacity:0}}
  @keyframes drift{from{transform:translateX(0)}to{transform:translateX(var(--dx,200px))}}
  @keyframes move{from{transform:translate(0,0)}to{transform:translate(var(--dx,0px),var(--dy,0px))}}
  @keyframes grow{from{transform:scale(0)}to{transform:scale(1)}}
  @keyframes growx{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  @keyframes growy{from{transform:scaleY(0)}to{transform:scaleY(1)}}
  @keyframes draw{to{stroke-dashoffset:0}}
  @keyframes rot{from{transform:rotate(var(--r0,0deg))}to{transform:rotate(var(--r1,90deg))}}
  @keyframes twinkle{0%,100%{opacity:.2}50%{opacity:1}}
  @keyframes wobble{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
  @keyframes wave{0%,100%{transform:rotate(-20deg)}50%{transform:rotate(25deg)}}
  @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:.12}}
  @keyframes ring{0%{transform:scale(.2);opacity:.9}100%{transform:scale(2.8);opacity:0}}
  @keyframes cnt{0%{opacity:1}18%{opacity:1}20%,100%{opacity:0}}
  @keyframes fadein{from{opacity:0}to{opacity:1}}
  @keyframes vanish{from{opacity:1}to{opacity:0}}
`;
const THEMES = {
    paper: `background:${THEME.paper}`,
    night: `background:linear-gradient(#050818,#16224f 70%,#0b1233)`,
    sky: `background:linear-gradient(#7ec8f5,#cfeeff 70%,#f5e3b5)`,
    blue: `background-color:#0f3d7a;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.17) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.17) 2px,transparent 2px);background-size:24px 24px,24px 24px,120px 120px,120px 120px`
};
function comicScene({ badge, badgeColor, theme = 'paper', groups }) {
    const rm = {}, hm = {}, fb = [], hfb = [];
    groups.forEach(g => {
        if (g.always) return;
        if (g.w) (rm[g.w] = rm[g.w] || []).push(g.id);
        if (g.t !== undefined) fb.push([g.id, g.t]);
        if (g.hw) (hm[g.hw] = hm[g.hw] || []).push(g.id);
        if (g.ht !== undefined) hfb.push([g.id, g.ht]);
    });
    const bc = badgeColor || (theme === 'blue' ? THEME.bpHi : THEME.accent);
    const bt = theme === 'blue' ? '#0f3d7a' : '#fff';
    const gh = groups.map(g => `<g transform="translate(${g.x || 0} ${g.y || 0})"><g transform="scale(${g.s || 1})"><g id="${g.id}" class="${g.always ? 'always' : 'revealgrp'}">${g.svg}</g></g></g>`).join('\n');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:1080px;height:1920px;overflow:hidden;${THEMES[theme]};font-family:Georgia,'Times New Roman',serif;color:${THEME.ink}}
  .badge{position:absolute;top:120px;left:50%;transform:translateX(-50%) rotate(-2deg);background:${bc};color:${bt};
    font:900 54px Impact,'Arial Black',sans-serif;padding:4px 30px;box-shadow:6px 6px 0 ${THEME.shadow};white-space:nowrap;z-index:10;opacity:0;transition:opacity .4s ease}
  .badge.on{opacity:1}
  svg#stage{position:absolute;left:40px;top:260px;width:1000px;height:1480px;overflow:visible}
  .revealgrp{opacity:0;transform:scale(.85);transform-box:fill-box;transform-origin:center;transition:opacity .45s ease,transform .45s cubic-bezier(.2,1.4,.4,1)}
  .revealgrp.on{opacity:1;transform:scale(1)}
  .revealgrp.fadeout{opacity:0 !important;transform:scale(.7) !important;pointer-events:none}
  ${CSS_ANIM}
</style></head><body>
  <div class="badge" id="badge">${badge}</div>
  <svg id="stage" viewBox="0 0 1000 1480" xmlns="http://www.w3.org/2000/svg">
    ${gh}
  </svg>
<script>${REVEAL_JS}
  wire(${JSON.stringify(rm)}, ${JSON.stringify(hm)}, ${JSON.stringify(fb)}, ${JSON.stringify(hfb)});
  window.addEventListener('apexframe', function(){ document.getElementById('badge').classList.add('on'); }, { once: true });
</script></body></html>`;
    return {
        type: 'html-record', html, audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover'
    };
}
const scene = (bg, tts, layer, transition = 'fade') => ({
    transition, tts: { text: tts, pauseAfter: .25 }, captions: false,
    layers: [{ type: 'background', color: bg }, layer]
});

// ── building blocks for scenes ───────────────────────────────────
function tile(id, y, ore, metal, oc, mc, w, t) {
    return {
        id, x: 500, y, w, t, svg: `
  <rect x="-440" y="-62" width="880" height="124" rx="16" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/>
  <g transform="translate(-330 -6)"><g ${an('wobble', 1.4)}><polygon points="-46,22 -34,-26 4,-42 40,-18 48,22" fill="${oc}" stroke="${THEME.ink}" stroke-width="5" stroke-linejoin="round"/><polygon points="-10,-6 4,-22 22,-4" fill="#fff" opacity=".35"/></g></g>
  <g transform="translate(0 -6)"><line x1="-200" y1="0" x2="50" y2="0" stroke="${THEME.ink}" stroke-width="8" stroke-linecap="round" ${an('flow dash', 1)}/><path d="M50 -20 L88 0 L50 20" fill="none" stroke="${THEME.ink}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>
  <g transform="translate(310 -6)"><g ${an('pulse', 1.6)}><polygon points="-58,22 -42,-24 42,-24 58,22" fill="${mc}" stroke="${THEME.ink}" stroke-width="5" stroke-linejoin="round"/><polygon points="-30,-14 30,-14 24,-2 -24,-2" fill="#fff" opacity=".5"/></g></g>
  ${T(-330, 52, ore, 24)}${T(310, 52, metal, 28, THEME.accent)}`
    };
}
const flameUp = (x, y, len, w) => `<g transform="translate(${x} ${y}) scale(1 -1)">${flameSvg(len, w)}</g>`;
const barrelIcon = (x, y, c) => `<g transform="translate(${x} ${y})"><rect x="-26" y="-34" width="52" height="68" rx="10" fill="${c}" stroke="${THEME.ink}" stroke-width="5"/><line x1="-26" y1="-14" x2="26" y2="-14" stroke="${THEME.ink}" stroke-width="3"/><line x1="-26" y1="14" x2="26" y2="14" stroke="${THEME.ink}" stroke-width="3"/></g>`;

const S = [];

// ── 0 HOOK ───────────────────────────────────────────────────────
S.push(scene('#050818',
 "A rocket is a skyscraper of controlled fire, and it has to be built perfectly. One bad weld, and everything fails. So how do you build one? We start with dirt, and we end with a landing.",
 comicScene({ badge: 'FROM DIRT TO LANDING', theme: 'night', groups: [
  { id: 'stars', always: true, svg: stars(46) },
  { id: 'earth', always: true, svg: `<ellipse cx="500" cy="1590" rx="920" ry="360" fill="#1d4f7a"/><ellipse cx="500" cy="1590" rx="920" ry="360" fill="none" stroke="#6fc3ff" stroke-width="10" opacity=".6"/><g ${an('drift', 40, 0, 'center', '--dx:260px;')}>${cloud(60, 1400, 1.3, '#dfeaf5', .8)}${cloud(480, 1370, 1, '#dfeaf5', .8)}${cloud(780, 1410, 1.2, '#dfeaf5', .8)}</g>` },
  { id: 'rk', x: 500, y: 1020, s: 1.7, w: 'skyscraper', t: .6, svg: `<g ${an('float', 2.4)}><g ${an('shake', .08)}>${rocket(300, 44, { flame: 110 })}</g></g>` },
  { id: 'puffs', x: 500, y: 1240, w: 'fire', t: 1.6, svg: puff(-70, 0, 34, 0) + puff(0, 10, 40, .8) + puff(70, 0, 34, 1.6) + puff(0, 0, 30, 2.1) },
  { id: 'bad', x: 500, y: 820, w: 'weld', t: 5, svg: sparks(0, 0, 10, THEME.fireHi, 34, .4) + sfx(150, -40, 'FAIL!', 8, '#e63946', 62, '#fff') },
  { id: 'dirt', x: 170, y: 1170, w: 'dirt', t: 9, svg: `<path d="M-130 0 Q-90 -110 0 -120 Q90 -110 130 0Z" fill="#7a5230" stroke="#e9d9b8" stroke-width="6"/><g ${an('bob', 1.1)}><ellipse cx="-60" cy="-30" rx="18" ry="12" fill="#a07848"/></g><g ${an('bob', 1.5, .4)}><ellipse cx="40" cy="-60" rx="14" ry="10" fill="#a07848"/></g>${T(0, 76, 'DIRT', 46, '#fff')}` },
  { id: 'arr1', w: 'dirt', t: 9, svg: arrow(250, 1090, 365, 930, THEME.bpHi) },
  { id: 'land', x: 830, y: 1170, w: 'landing', t: 12, svg: `<rect x="-130" y="0" width="260" height="24" rx="6" fill="#8a8f96" stroke="#e9d9b8" stroke-width="5"/><g transform="translate(0 0) scale(.55)">${rocket(240, 40, { legs: true })}</g><g ${an('blink', .8)}><path d="M-40 12 H40" stroke="#ff4d4d" stroke-width="6"/></g>${T(0, 76, 'LANDING', 46, '#fff')}` },
  { id: 'arr2', w: 'landing', t: 12, svg: arrow(640, 930, 745, 1080, THEME.bpHi) }
 ]})));

// ── 1 RAW MATERIALS ─────────────────────────────────────────────
S.push(scene(THEME.paper,
 "Everything starts underground. Bauxite becomes aluminum. Iron ore becomes steel. Titanium hides in heavy sand, copper wires the whole machine, and even the computer chips begin as plain quartz.",
 comicScene({ badge: '1 — DIG IT UP', badgeColor: THEME.accent2, groups: [
  { id: 'mine', y: 40, w: 'underground', t: .3, svg: `
    <circle cx="880" cy="110" r="46" fill="${THEME.highlight}" ${an('pulse', 2)}/>
    <polygon points="40,420 250,130 410,290 570,170 780,420" fill="#8a7f6f" stroke="${THEME.ink}" stroke-width="6" stroke-linejoin="round"/>
    <polygon points="250,130 290,200 230,190" fill="#fff" opacity=".6"/>
    <path d="M340 420 V350 Q340 300 400 300 Q460 300 460 350 V420Z" fill="#1b1410" stroke="${THEME.ink}" stroke-width="6"/>
    <line x1="120" y1="420" x2="760" y2="420" stroke="${THEME.ink}" stroke-width="8"/>
    ${[140, 220, 300, 380, 460, 540, 620, 700].map(x => `<line x1="${x}" y1="410" x2="${x}" y2="432" stroke="#6b4423" stroke-width="7"/>`).join('')}
    <g transform="translate(240 390)"><g ${an('move', 3.2, 0, 'center', '--dx:300px;')}>
      <rect x="-36" y="-34" width="72" height="30" rx="4" fill="#6b4423" stroke="${THEME.ink}" stroke-width="5"/>
      <polygon points="-26,-34 -12,-52 6,-40 22,-54 30,-34" fill="#9a8a7a" stroke="${THEME.ink}" stroke-width="4"/>
      <circle cx="-20" cy="2" r="9" fill="#444" stroke="${THEME.ink}" stroke-width="3" ${an('spin', .6)}/><circle cx="20" cy="2" r="9" fill="#444" stroke="${THEME.ink}" stroke-width="3" ${an('spin', .6)}/></g></g>
    <g transform="translate(660 420)">${stickman(0, 0, [-30, -30], [48, -34], { hat: true, wave: true })}</g>
    <path d="M700 330 l30 -18 l12 14" stroke="#555" stroke-width="7" fill="none" stroke-linecap="round" ${an('wave', .7, 0, [700, 330])}/>` },
  tile('t1', 560, 'BAUXITE', 'ALUMINUM', '#b5651d', '#cfd6de', 'bauxite', 3),
  tile('t2', 700, 'IRON ORE', 'STEEL', '#6b3a2a', '#8a96a3', 'iron', 5.5),
  tile('t3', 840, 'RUTILE SAND', 'TITANIUM', '#3e3e4a', '#a9b4c2', 'titanium', 8),
  tile('t4', 980, 'COPPER ORE', 'COPPER WIRE', '#2f8f6b', '#c8702a', 'copper', 10.5),
  tile('t5', 1120, 'QUARTZ', 'SILICON CHIPS', '#e9e4da', '#2b3a55', 'quartz', 13),
  { id: 'belt', y: 1300, w: 'everything', t: .1, svg: `
    <rect x="60" y="0" width="880" height="34" rx="17" fill="#3a3a3a" stroke="${THEME.ink}" stroke-width="5"/>
    <line x1="90" y1="17" x2="910" y2="17" stroke="#aaa" stroke-width="6" ${an('flow dash', .6)}/>
    <circle cx="80" cy="17" r="24" fill="#777" stroke="${THEME.ink}" stroke-width="5" ${an('spin', 1)}/><circle cx="920" cy="17" r="24" fill="#777" stroke="${THEME.ink}" stroke-width="5" ${an('spin', 1)}/>
    ${[0, 2, 4].map(i => `<g transform="translate(100 -16)"><g ${an('drift', 6, i * -2, 'center', '--dx:760px;')}><polygon points="-16,16 -10,-8 8,-14 20,2 18,16" fill="${['#b5651d', '#6b3a2a', '#2f8f6b'][i / 2]}" stroke="${THEME.ink}" stroke-width="4"/></g></g>`).join('')}` }
 ]})));

// ── 2 REFINE & ROLL ─────────────────────────────────────────────
S.push(scene(THEME.paper,
 "Furnaces turn ore into metal. Molten aluminum is poured into molds, then rolled into long plates. Add a little lithium and other elements, and you get strong, light alloys, the perfect skin for fuel tanks.",
 comicScene({ badge: '2 — MELT, POUR, ROLL', badgeColor: THEME.accent2, groups: [
  { id: 'furn', x: 200, y: 430, w: 'furnaces', t: .4, svg: `
    <rect x="-130" y="-200" width="260" height="300" rx="18" fill="#9a4a2e" stroke="${THEME.ink}" stroke-width="6"/>
    ${[-150, -100, -50, 0, 50].map(y => `<line x1="-130" y1="${y}" x2="130" y2="${y}" stroke="rgba(0,0,0,.25)" stroke-width="3"/>`).join('')}
    <rect x="58" y="-330" width="54" height="132" fill="#7a3a22" stroke="${THEME.ink}" stroke-width="6"/>
    <path d="M-72 100 V10 Q-72 -50 0 -50 Q72 -50 72 10 V100Z" fill="#2a1208" stroke="${THEME.ink}" stroke-width="6"/>
    <g ${an('pulse', .9)}><path d="M-56 100 V20 Q-56 -30 0 -30 Q56 -30 56 20 V100Z" fill="${THEME.fire}"/></g>
    ${flameUp(0, 100, 100, 34)}${puff(85, -335, 26, 0, -230)}${puff(85, -335, 30, 1.1, -260)}${puff(85, -335, 24, 2, -240)}
    ${T(0, 160, 'FURNACE', 34)}` },
  { id: 'pour', x: 560, y: 250, w: 'molten', t: 3.2, svg: `
    <g ${an('rot', 2.6, 0, [90, -20], '--r0:-6deg;--r1:18deg;')}><path d="M-10 0 H120 Q108 74 54 80 Q0 74 -10 0Z" fill="#555" stroke="${THEME.ink}" stroke-width="6"/><rect x="118" y="-26" width="150" height="12" rx="6" fill="#333"/></g>
    <line x1="-4" y1="40" x2="-4" y2="262" stroke="${THEME.fire}" stroke-width="16" stroke-linecap="round" ${an('flow dash', .5)}/>
    <line x1="-4" y1="40" x2="-4" y2="262" stroke="${THEME.fireHi}" stroke-width="5" stroke-linecap="round"/>
    <g transform="translate(-60 262)"><path d="M-30 0 H100 L82 80 H-12Z" fill="#555" stroke="${THEME.ink}" stroke-width="6"/><g ${an('growy', 3, 1.2, 'bottom')}><rect x="-20" y="8" width="108" height="64" fill="${THEME.fire}"/></g></g>
    ${[170, 290, 410].map((x, i) => `<g transform="translate(${x} 330)"><g ${an('pulse', 1.8, i * .4)}><polygon points="-52,34 -38,-12 38,-12 52,34" fill="#cfd6de" stroke="${THEME.ink}" stroke-width="5" stroke-linejoin="round"/><polygon points="-26,-4 26,-4 20,8 -20,8" fill="#fff" opacity=".6"/></g></g>`).join('')}
    ${T(170, 410, 'INGOTS', 28)}` },
  { id: 'mill', x: 500, y: 830, w: 'rolled', t: 6.5, svg: `
    <rect x="-90" y="-120" width="180" height="240" rx="14" fill="#7d8791" stroke="${THEME.ink}" stroke-width="6"/>
    <circle cx="0" cy="-44" r="46" fill="#aab3bd" stroke="${THEME.ink}" stroke-width="6" ${an('spin', 1.4)}/><line x1="-34" y1="-44" x2="34" y2="-44" stroke="${THEME.ink}" stroke-width="5" ${an('spin', 1.4, 0, [0, -44])}/>
    <circle cx="0" cy="44" r="46" fill="#aab3bd" stroke="${THEME.ink}" stroke-width="6" ${an('spin', 1.4, 0, 'center', '--dir:reverse;')}/><line x1="-34" y1="44" x2="34" y2="44" stroke="${THEME.ink}" stroke-width="5" ${an('spin', 1.4, 0, [0, 44], '--dir:reverse;')}/>
    <rect x="-420" y="-8" width="330" height="16" fill="${THEME.fire}" stroke="${THEME.ink}" stroke-width="4"/>
    <line x1="-410" y1="0" x2="-100" y2="0" stroke="${THEME.fireHi}" stroke-width="4" ${an('flow dash', .5)}/>
    <rect x="90" y="-5" width="330" height="10" fill="#cfd6de" stroke="${THEME.ink}" stroke-width="4"/>
    <line x1="100" y1="0" x2="410" y2="0" stroke="#fff" stroke-width="4" ${an('flow dash', .5)}/>
    ${T(0, 190, 'ROLLING MILL', 34)}${T(-250, -40, 'HOT', 28, THEME.accent)}${T(250, -40, 'LONG PLATE', 28, THEME.ink)}` },
  { id: 'alloy', x: 500, y: 1210, w: 'lithium', t: 10.5, svg: `
    ${[['Al', '#cfd6de', -330], ['Li', '#d8b4f0', -190], ['Cu', '#c8702a', -50]].map(([a, c, x], i) => `<g transform="translate(${x} 0)"><g ${an('pulse', 1.4, i * .3)}><rect x="-52" y="-52" width="104" height="104" rx="12" fill="${c}" stroke="${THEME.ink}" stroke-width="6"/>${T(0, 18, a, 54)}</g></g>`).join('')}
    ${T(-260, 12, '+', 60)}${T(-120, 12, '+', 60)}
    <g transform="translate(40 0)"><line x1="0" y1="0" x2="110" y2="0" stroke="${THEME.ink}" stroke-width="8" stroke-linecap="round" ${an('flow dash', 1)}/><path d="M104 -20 L140 0 L104 20" fill="none" stroke="${THEME.ink}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>
    <g transform="translate(300 0)"><g ${an('float', 1.6)}><rect x="-110" y="-46" width="220" height="92" rx="10" fill="#eef2f6" stroke="${THEME.ink}" stroke-width="6"/><line x1="-90" y1="-20" x2="90" y2="-20" stroke="#aab3bd" stroke-width="4"/>${T(0, 22, 'Al-Li ALLOY', 30, THEME.accent2)}</g></g>${sparks(380, -50, 6, THEME.highlight, 22, .6)}` }
 ]})));

// ── 3 PROPELLANT ────────────────────────────────────────────────
S.push(scene(THEME.paper,
 "Now the propellant. Air is chilled to minus one eighty three degrees until its oxygen turns to liquid. Fuel comes from crude oil refined into kerosene, or natural gas, or hydrogen split out of plain water.",
 comicScene({ badge: '3 — MAKE THE FUEL', badgeColor: THEME.accent2, groups: [
  { id: 'air', x: 500, y: 330, w: 'air', t: .5, svg: `
    ${T(0, -170, 'AIR  →  LIQUID OXYGEN', 36, '#1565c0')}
    ${[-60, 0, 60].map((y, i) => `<path d="M-460 ${y} q40 -40 80 0 t80 0 t80 0" fill="none" stroke="#7fb2e5" stroke-width="7" stroke-linecap="round" ${an('flow dash', 1.2, i * .2)}/>`).join('')}
    <rect x="-130" y="-130" width="120" height="270" rx="14" fill="#dfeaf5" stroke="${THEME.ink}" stroke-width="6"/>
    ${[-90, -40, 10, 60, 100].map(y => `<line x1="-130" y1="${y}" x2="-10" y2="${y}" stroke="#9db8d4" stroke-width="3"/>`).join('')}
    ${[[-100, -100], [-40, -20], [-90, 50], [-30, 100]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff" ${an('twinkle', 1, i * .3)}/>`).join('')}
    <path d="M-10 40 H110" stroke="#4aa3e8" stroke-width="12" stroke-linecap="round" ${an('flow dash', .7)}/>
    <g transform="translate(240 20)"><circle r="104" fill="#cfeaff" stroke="${THEME.ink}" stroke-width="6"/><path d="M-96 18 Q-48 -6 0 18 T96 18 V30 Q60 90 0 104 Q-60 90 -96 30Z" fill="#4dd0ff" opacity=".7" ${an('bob', 1.4)}/>${T(0, -10, 'LOX', 44, '#0d47a1')}${T(0, 34, '-183 °C', 28, '#0d47a1')}</g>
    ${puff(200, -70, 20, 0, -110, 2.4, 'rgba(200,230,255,.8)')}${puff(280, -60, 18, 1.2, -100, 2.4, 'rgba(200,230,255,.8)')}` },
  { id: 'oil', x: 500, y: 790, w: 'oil', t: 5, svg: `
    ${T(0, -170, 'OIL  →  KEROSENE / METHANE', 36, THEME.accent)}
    <polygon points="-380,110 -300,110 -340,10" fill="#555" stroke="${THEME.ink}" stroke-width="5"/>
    <rect x="-460" y="110" width="200" height="16" fill="${THEME.ink}"/>
    <g ${an('rot', 1.4, 0, [-340, 10], '--r0:-10deg;--r1:10deg;')}><line x1="-440" y1="-4" x2="-250" y2="24" stroke="#c0392b" stroke-width="16" stroke-linecap="round"/><path d="M-250 8 q30 0 30 40" fill="none" stroke="#c0392b" stroke-width="10"/></g>
    <line x1="-228" y1="40" x2="-228" y2="118" stroke="#222" stroke-width="8" ${an('flow dash', .6)}/>
    <path d="M-228 118 H-70" stroke="#222" stroke-width="10" ${an('flow dash', .8)}/>
    ${[-40, 30, 100].map((x, i) => `<rect x="${x}" y="${-90 + i * 30}" width="48" height="${220 - i * 30}" rx="8" fill="#b8bec6" stroke="${THEME.ink}" stroke-width="5"/>`).join('')}
    <g transform="translate(150 -100)">${flameUp(0, 0, 70, 20)}</g>
    ${puff(30, -100, 22, 0, -120)}${puff(110, -85, 24, 1.1, -130)}
    <path d="M190 90 H260" stroke="#222" stroke-width="10" ${an('flow dash', .8)}/>
    ${barrelIcon(320, 60, '#2b2b2b')}${barrelIcon(400, 60, '#c8702a')}${T(320, 140, 'RP-1', 26)}${T(400, 140, 'CH4', 26)}` },
  { id: 'water', x: 500, y: 1230, w: 'water', t: 11, svg: `
    ${T(0, -170, 'WATER  →  HYDROGEN', 36, '#0d47a1')}
    <g transform="translate(-380 -40)"><g ${an('bob', 1.2)}><path d="M0 -60 Q50 20 0 40 Q-50 20 0 -60Z" fill="#4dd0ff" stroke="${THEME.ink}" stroke-width="6"/></g></g>
    <path d="M-310 -10 H-190" stroke="${THEME.ink}" stroke-width="8" stroke-linecap="round" ${an('flow dash', 1)}/>
    <rect x="-170" y="-110" width="220" height="220" rx="16" fill="#cfeaff" stroke="${THEME.ink}" stroke-width="6"/>
    <rect x="-166" y="-30" width="212" height="136" fill="#4dd0ff" opacity=".55"/>
    <line x1="-100" y1="-120" x2="-100" y2="60" stroke="#c0392b" stroke-width="10"/><line x1="-20" y1="-120" x2="-20" y2="60" stroke="#222" stroke-width="10"/>
    ${[0, .7, 1.4].map(d => `${puff(-100, 40, 9, d, -130, 2.1, '#fff')}${puff(-20, 40, 9, d + .35, -130, 2.1, '#ffd23f')}`).join('')}
    ${T(-100, 148, 'H2', 32)}${T(-20, 148, 'O2', 32)}
    <path d="M70 -10 H190" stroke="${THEME.ink}" stroke-width="8" stroke-linecap="round" ${an('flow dash', 1)}/>
    <g transform="translate(300 0)"><rect x="-80" y="-110" width="160" height="220" rx="60" fill="#ffe9f1" stroke="${THEME.ink}" stroke-width="6"/><path d="M-72 20 Q-36 0 0 20 T72 20 V90 Q72 100 60 100 H-60 Q-72 100 -72 90Z" fill="#ff9ec4" opacity=".8" ${an('bob', 1.5)}/>${T(0, -10, 'LH2', 44)}${T(0, 36, '-253 °C', 26)}</g>` }
 ]})));

// ── 4 BLUEPRINT ─────────────────────────────────────────────────
const BP = 500; // rocket centre x
S.push(scene('#0f3d7a',
 "Before any metal is cut, engineers draw it. The blueprint fixes every size. A payload fairing on top, an upper stage, the interstage, then the big first stage with its tanks and engines at the bottom.",
 comicScene({ badge: '4 — DRAW IT FIRST', theme: 'blue', groups: [
  { id: 'frame', w: 'blueprint', t: .3, svg: `
    ${dr('M20 20 H980 V1440 H20Z', 0, 2.5, 4)}${dr('M500 90 V1400', .5, 2.5, 2, THEME.bpSoft)}${dr('M60 700 H940', .5, 2.5, 2, THEME.bpSoft)}
    ${M(780, 1385, 'ROCKET - SHEET 01', 24)}${M(780, 1415, 'ALL DIMS APPROX.', 20, THEME.bpSoft)}
    <g transform="translate(150 1230)">${stickman(0, 0, [-35, 20], [55, -40], { color: THEME.bpLine, wave: true })}</g>` },
  { id: 'fair', w: 'fairing', t: 4.5, svg: `
    ${dr('M430 450 Q430 290 500 230 Q570 290 570 450 Z', 0, 1.6)}${dr('M500 330 V450', 1.2, 1, 3, THEME.bpSoft)}
    ${dr('M345 230 H365 M345 450 H365 M355 230 V450', .4, 1.2, 3)}${M(335, 350, '15 m', 24, THEME.bpLine, 'end')}
    ${dr('M570 340 H640', 1, .8, 3, THEME.bpHi)}${M(650, 348, 'PAYLOAD FAIRING', 26, THEME.bpHi, 'start')}` },
  { id: 'up', w: 'upper', t: 7, svg: `
    ${dr('M430 450 V710 H570 V450', 0, 1.6)}${dr('M470 520 H530 V640 H470 Z', .8, 1.2, 4, THEME.bpSoft)}
    ${dr('M345 450 H365 M345 710 H365 M355 450 V710', .4, 1.2, 3)}${M(335, 590, '18 m', 24, THEME.bpLine, 'end')}
    ${dr('M570 580 H640', 1, .8, 3, THEME.bpHi)}${M(650, 588, 'UPPER STAGE', 26, THEME.bpHi, 'start')}` },
  { id: 'inter', w: 'interstage', t: 9, svg: `
    ${dr('M430 710 V760 H570 V710', 0, 1.2)}${dr('M430 710 L470 760 M570 710 L530 760 M470 710 L430 760 M530 710 L570 760', .5, 1.2, 3, THEME.bpSoft)}
    ${dr('M570 735 H640', .8, .8, 3, THEME.bpHi)}${M(650, 743, 'INTERSTAGE', 26, THEME.bpHi, 'start')}` },
  { id: 'first', w: 'first', t: 10.5, svg: `
    ${dr('M430 760 V1170 H570 V760', 0, 2)}
    ${dr('M440 775 H560 V935 H440 Z', .9, 1.4, 4, '#7fe0ff')}${dr('M440 950 H560 V1155 H440 Z', 1.4, 1.4, 4, '#ffb36b')}
    ${M(500, 862, 'LOX', 26, '#7fe0ff')}${M(500, 1060, 'FUEL', 26, '#ffb36b')}
    ${[450, 500, 550].map((cx, i) => dr(`M${cx - 22} 1170 L${cx - 34} 1232 H${cx + 34} L${cx + 22} 1170 Z`, 2 + i * .2, 1, 4)).join('')}
    ${dr('M345 760 H365 M345 1232 H365 M355 760 V1232', .4, 1.4, 3)}${M(335, 1000, '29 m', 24, THEME.bpLine, 'end')}
    ${dr('M570 960 H640', 1, .8, 3, THEME.bpHi)}${M(650, 968, 'STAGE 1 TANKS', 26, THEME.bpHi, 'start')}
    ${dr('M590 1205 H640', 2.2, .8, 3, THEME.bpHi)}${M(650, 1213, 'ENGINES', 26, THEME.bpHi, 'start')}` },
  { id: 'scan', w: 'blueprint', t: 12, svg: `
    <g ${an('move', 5, 0, 'center', '--dy:1000px;')}><line x1="300" y1="230" x2="700" y2="230" stroke="${THEME.bpHi}" stroke-width="4" stroke-dasharray="14 10" opacity=".8"/></g>
    <g ${an('move', 5, 0, 'center', '--dx:140px;')}><circle cx="430" cy="1000" r="26" fill="none" stroke="${THEME.bpHi}" stroke-width="4"/><line x1="395" y1="1000" x2="465" y2="1000" stroke="${THEME.bpHi}" stroke-width="3"/><line x1="430" y1="965" x2="430" y2="1035" stroke="${THEME.bpHi}" stroke-width="3"/></g>` }
 ]})));

// ── 5 MOSTLY FUEL ───────────────────────────────────────────────
S.push(scene('#0f3d7a',
 "Here's the surprise. About ninety percent of a rocket is just propellant. The structure is paper thin, and the payload is only a sliver. Every extra kilogram of metal needs a lot more fuel to lift it, so engineers shave weight everywhere.",
 comicScene({ badge: '5 — MOSTLY FUEL', theme: 'blue', groups: [
  { id: 'bar', x: 170, y: 1260, w: 'ninety', t: 1.8, svg: `
    <rect x="-86" y="-810" width="172" height="810" fill="none" stroke="${THEME.bpLine}" stroke-width="5"/>
    <g ${an('growy', 1.8, 0, 'bottom')}><rect x="-80" y="-720" width="160" height="720" fill="#4dd0ff"/></g>
    <path d="M-80 -720 q20 -14 40 0 t40 0 t40 0 t40 0" fill="none" stroke="#fff" stroke-width="5" ${an('flow dash', .8)}/>
    <g ${an('growy', 1, 2.2, 'bottom')}><rect x="-80" y="-776" width="160" height="56" fill="#e8e8e8"/></g>
    <g ${an('growy', 1, 3.4, 'bottom')}><rect x="-80" y="-800" width="160" height="24" fill="${THEME.bpHi}"/></g>
    <g ${an('fadein', .6, 1.4, 'center', '--n:1;')}>${dr('M86 -360 H150', 0, .5, 3, '#4dd0ff')}${T(160, -348, 'PROPELLANT ~90%', 36, '#4dd0ff', 'start')}</g>
    <g ${an('fadein', .6, 2.6, 'center', '--n:1;')}>${dr('M86 -748 H150', 0, .5, 3)}${T(160, -738, 'STRUCTURE ~7%', 34, '#fff', 'start')}</g>
    <g ${an('fadein', .6, 3.8, 'center', '--n:1;')}>${dr('M86 -788 H150', 0, .5, 3, THEME.bpHi)}${T(160, -806, 'PAYLOAD ~3%', 34, THEME.bpHi, 'start')}</g>` },
  { id: 'saw', x: 690, y: 1090, w: 'kilogram', t: 9, svg: `
    <polygon points="0,0 -50,90 50,90" fill="#cfd6de" stroke="${THEME.bpLine}" stroke-width="5"/>
    <g ${an('rot', 2.4, 0, [0, 0], '--r0:-7deg;--r1:7deg;')}>
      <line x1="-280" y1="0" x2="280" y2="0" stroke="${THEME.bpLine}" stroke-width="12" stroke-linecap="round"/>
      <rect x="-300" y="-84" width="90" height="84" rx="8" fill="#c9ced6" stroke="${THEME.ink}" stroke-width="5"/>${T(-255, -28, '1 kg', 30)}
      ${[0, 1, 2].map(i => `<rect x="${150 + i * 40}" y="-70" width="34" height="70" rx="8" fill="#4dd0ff" stroke="${THEME.ink}" stroke-width="4"/>`).join('')}
      ${[0, 1].map(i => `<rect x="${170 + i * 40}" y="-138" width="34" height="68" rx="8" fill="#4dd0ff" stroke="${THEME.ink}" stroke-width="4"/>`).join('')}</g>
    ${T(0, 180, '+1 kg of dead weight', 34, '#fff')}${T(0, 226, '= MUCH MORE FUEL', 34, THEME.bpHi)}` },
  { id: 'shave', x: 740, y: 560, w: 'shave', t: 12, svg: `
    <g transform="translate(-60 0)">${stickman(0, 0, [-34, 12], [58, 30], { color: THEME.bpLine, wave: true, sweat: true })}</g>
    <rect x="30" y="-30" width="170" height="26" rx="6" fill="#cfd6de" stroke="${THEME.ink}" stroke-width="5"/>
    ${sparks(120, -34, 6, '#fff', 20, .35)}${T(110, 60, 'SHAVE WEIGHT', 30, THEME.bpHi)}` }
 ]})));

// ── 6 WELD THE TANKS ───────────────────────────────────────────
S.push(scene(THEME.paper,
 "Plates are rolled into barrels, then welded into tanks. Friction stir welding spins a tool through the seam, mixing the metal together without melting it. Then every weld is scanned for hidden cracks, because one flaw can be fatal.",
 comicScene({ badge: '6 — WELD THE TANKS', badgeColor: THEME.accent2, groups: [
  { id: 'plates', x: 250, y: 280, w: 'plates', t: .4, svg: `
    ${[-70, 0, 70].map((x, i) => `<circle cx="${x}" cy="${i === 1 ? -40 : 40}" r="34" fill="#aab3bd" stroke="${THEME.ink}" stroke-width="6" ${an('spin', 1.2, 0, 'center', i === 1 ? '--dir:reverse;' : '')}/><line x1="${x - 24}" y1="${i === 1 ? -40 : 40}" x2="${x + 24}" y2="${i === 1 ? -40 : 40}" stroke="${THEME.ink}" stroke-width="5" ${an('spin', 1.2, 0, [x, i === 1 ? -40 : 40], i === 1 ? '--dir:reverse;' : '')}/>`).join('')}
    <path d="M-230 0 H-80 Q60 0 130 -70 Q190 -140 120 -200" fill="none" stroke="#cfd6de" stroke-width="16" stroke-linecap="round"/>
    <path d="M-230 0 H-80 Q60 0 130 -70 Q190 -140 120 -200" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" ${an('flow dash', .8)}/>
    ${T(-10, 130, 'ROLL INTO BARRELS', 30)}` },
  { id: 'barrel', x: 500, y: 760, w: 'barrels', t: 2.6, svg: `
    <rect x="-380" y="-130" width="760" height="260" fill="#cfd6de" stroke="${THEME.ink}" stroke-width="6"/>
    <ellipse cx="-380" cy="0" rx="40" ry="130" fill="#aab3bd" stroke="${THEME.ink}" stroke-width="6"/><ellipse cx="380" cy="0" rx="40" ry="130" fill="#e9eef3" stroke="${THEME.ink}" stroke-width="6"/>
    ${[-250, -120, 120, 250].map((x, i) => `<line x1="${x}" y1="-124" x2="${x}" y2="124" stroke="#fff" stroke-width="7" opacity=".6" ${an('flow dash', 1.1, i * .15)}/>`).join('')}
    <line x1="0" y1="-130" x2="0" y2="130" stroke="#7a8794" stroke-width="10" stroke-dasharray="14 8"/>
    ${T(0, 190, 'FUEL TANK BARREL', 30)}` },
  { id: 'fsw', x: 500, y: 760, w: 'friction', t: 5.5, svg: `
    <g ${an('move', 2.8, 0, 'center', '--dy:210px;')}><g transform="translate(0 -110)">
      <rect x="-24" y="-90" width="48" height="70" rx="6" fill="#555" stroke="${THEME.ink}" stroke-width="5"/>
      <polygon points="-20,-20 20,-20 6,10 -6,10" fill="#8a929b" stroke="${THEME.ink}" stroke-width="5"/>
      <ellipse cx="0" cy="-8" rx="30" ry="9" fill="none" stroke="${THEME.accent}" stroke-width="5" ${an('spin', .35, 0, 'center', '--dir:normal;')}/>
      ${sparks(0, 14, 8, THEME.fireHi, 26, .3)}</g></g>
    ${T(0, -170, 'FRICTION STIR WELD', 32, THEME.accent)}` },
  { id: 'op', x: 100, y: 1110, t: 4, svg: stickman(0, 0, [34, -14], [58, -48], { hat: true, wave: true, sweat: true }) },
  { id: 'scan', x: 500, y: 1010, w: 'scanned', t: 9.5, svg: `
    <g ${an('move', 4, 0, 'center', '--dx:200px;')}><g transform="translate(-100 0)">
      <path d="M-70 -200 Q-70 -250 0 -250 Q70 -250 70 -200 V-40 H-70Z" fill="none" stroke="${THEME.accent2}" stroke-width="10" transform="translate(0 70)"/>
      <polygon points="0,-120 -80,70 80,70" fill="#7fe0ff" opacity=".28" ${an('pulse', .8)}/></g></g>
    <g transform="translate(250 260)"><rect x="-170" y="-90" width="340" height="190" rx="12" fill="#1c2630" stroke="${THEME.ink}" stroke-width="7"/>
      <polyline points="-150,20 -110,20 -90,-40 -60,50 -30,10 10,10 40,-30 70,40 100,10 150,10" fill="none" stroke="#6dff9c" stroke-width="5" stroke-linejoin="round" ${an('flow dash', .8)}/>
      <g ${an('blink', .9)}><circle cx="-130" cy="-60" r="10" fill="#ff4d4d"/>${T(-100, -50, 'CRACK?', 26, '#ff9d9d', 'start', FM, 'font-weight="bold"')}</g></g>` },
  { id: 'pass', x: 800, y: 1100, w: 'flaw', t: 12.5, svg: `<g ${an('grow', .6, 0, 'center')}>${sfx(0, 0, 'NO FLAWS ✓', -8, THEME.accent2, 60, '#fff')}</g>` }
 ]})));

// ── 7 ENGINE ───────────────────────────────────────────────────
const pump = (x, y, c) => `<g transform="translate(${x} ${y})"><circle r="58" fill="none" stroke="${THEME.bpLine}" stroke-width="5"/><g ${an('spin', .5, 0, 'center')}>${[0, 60, 120].map(a => `<line x1="0" y1="-46" x2="0" y2="46" stroke="${c}" stroke-width="8" stroke-linecap="round" transform="rotate(${a})"/>`).join('')}</g><circle r="9" fill="${THEME.bpLine}"/></g>`;
S.push(scene('#0f3d7a',
 "Now the heart: the engine. Turbopumps spin at tens of thousands of revolutions per minute, forcing fuel and oxygen into the chamber, where they burn at thousands of degrees. The fuel flows through the nozzle walls first, so the metal doesn't melt.",
 comicScene({ badge: '7 — BUILD THE ENGINE', theme: 'blue', groups: [
  { id: 'e0', w: 'engine', t: .2, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 150, 'ENGINE  SCHEMATIC', 34, THEME.bpHi)}` },
  { id: 'e1', w: 'fuel', t: 2.5, svg: `
    <circle cx="300" cy="300" r="80" fill="rgba(77,208,255,.25)" stroke="#7fe0ff" stroke-width="6"/><circle cx="700" cy="300" r="80" fill="rgba(255,150,60,.25)" stroke="#ffb36b" stroke-width="6"/>
    ${M(300, 310, 'OXYGEN', 26, '#7fe0ff')}${M(700, 310, 'FUEL', 26, '#ffb36b')}
    <path d="M300 380 V520" stroke="#7fe0ff" stroke-width="10" ${an('flow dash', .7)}/><path d="M700 380 V520" stroke="#ffb36b" stroke-width="10" ${an('flow dash', .7)}/>` },
  { id: 'e2', w: 'turbopumps', t: 5, svg: `
    ${pump(300, 580, '#7fe0ff')}${pump(700, 580, '#ffb36b')}
    ${M(150, 575, 'TURBO', 24, THEME.bpLine)}${M(150, 605, 'PUMP', 24, THEME.bpLine)}${M(850, 575, 'TURBO', 24, THEME.bpLine)}${M(850, 605, 'PUMP', 24, THEME.bpLine)}
    ${M(500, 480, '10,000s of rpm', 26, THEME.bpHi)}
    <path d="M300 640 V720 Q300 790 400 790 H440" fill="none" stroke="#7fe0ff" stroke-width="10" ${an('flow dash', .7)}/><path d="M700 640 V720 Q700 790 600 790 H560" fill="none" stroke="#ffb36b" stroke-width="10" ${an('flow dash', .7)}/>` },
  { id: 'e3', w: 'chamber', t: 8.5, svg: `
    <g ${an('pulse', .7)}><rect x="440" y="740" width="120" height="190" rx="30" fill="rgba(255,122,26,.55)" stroke="${THEME.bpLine}" stroke-width="6"/></g>
    <g ${an('blink', 1)}>${M(500, 842, '3000 °C+', 26, '#fff')}</g>
    ${dr('M600 830 H650', 0, .6, 3, THEME.bpHi)}${M(660, 838, 'COMBUSTION', 24, THEME.bpHi, 'start')}${M(660, 866, 'CHAMBER', 24, THEME.bpHi, 'start')}` },
  { id: 'e4', w: 'nozzle', t: 11.5, svg: `
    ${dr('M440 930 Q420 1100 340 1230 H660 Q580 1100 560 930', 0, 2, 6)}
    <path d="M452 940 Q434 1090 366 1212" fill="none" stroke="#ffb36b" stroke-width="7" ${an('flow dash', .6)}/><path d="M548 940 Q566 1090 634 1212" fill="none" stroke="#ffb36b" stroke-width="7" ${an('flow dash', .6)}/>
    <g transform="translate(500 1232)">${flameSvg(190, 100, .14)}</g>
    ${M(310, 1080, 'COOLED', 24, THEME.bpHi, 'end')}${M(310, 1110, 'NOZZLE', 24, THEME.bpHi, 'end')}${dr('M320 1095 H410', .5, .6, 3, THEME.bpHi)}` }
 ]})));

// ── 8 TEST FIRE ─────────────────────────────────────────────────
S.push(scene('#7ec8f5',
 "Every engine gets bolted to a test stand and fired on the ground first. If it passes, it goes into a rocket. If it doesn't, engineers learn why while everything is still safely on the ground.",
 comicScene({ badge: '8 — FIRE IT ON THE GROUND', theme: 'sky', groups: [
  { id: 'gnd', always: true, svg: `<rect x="-60" y="1180" width="1120" height="420" fill="#8a6a4a"/><rect x="-60" y="1180" width="1120" height="16" fill="#6b4f33"/>
     ${[0, 1, 2].map(i => `<g ${an('drift', 9, -i * 3, 'center', '--dx:1200px;')}><path d="M-120 ${170 + i * 60} q10 -16 22 0 q10 -16 22 0" fill="none" stroke="${THEME.ink}" stroke-width="4"/></g>`).join('')}
     ${cloud(120, 330, 1.2, '#fff', .9)}${cloud(700, 250, 1, '#fff', .9)}` },
  { id: 'stand', w: 'bolted', t: .8, svg: `
    <rect x="240" y="260" width="90" height="920" fill="none" stroke="${THEME.ink}" stroke-width="8"/>
    ${Array.from({ length: 11 }, (_, i) => `<line x1="240" y1="${260 + i * 84}" x2="330" y2="${344 + i * 84}" stroke="${THEME.ink}" stroke-width="5"/><line x1="330" y1="${260 + i * 84}" x2="240" y2="${344 + i * 84}" stroke="${THEME.ink}" stroke-width="5"/>`).join('')}
    <rect x="330" y="320" width="170" height="26" fill="#7d8791" stroke="${THEME.ink}" stroke-width="6"/>
    <g ${an('shake', .07)}><rect x="450" y="346" width="100" height="110" rx="14" fill="#9aa4ae" stroke="${THEME.ink}" stroke-width="6"/>
    <path d="M450 456 Q430 540 390 620 H610 Q570 540 550 456Z" fill="#b8bec6" stroke="${THEME.ink}" stroke-width="6"/></g>
    ${T(285, 220, 'TEST STAND', 34)}` },
  { id: 'fire', w: 'fired', t: 3.5, svg: `
    <g ${an('shake', .06)}><g transform="translate(500 620)">${flameSvg(560, 112, .1)}</g></g>
    ${[0, 1, 2].map(i => `<ellipse cx="500" cy="1186" rx="60" ry="14" fill="none" stroke="#fff" stroke-width="6" ${an('ring', 1.6, i * .5, 'center', '--dir:normal;')}/>`).join('')}
    ${[[280, 0], [380, .5], [620, .9], [720, 1.3], [450, 1.7], [550, .3]].map(([x, d]) => puff(x, 1160, 54, d, -90, 1.8, 'rgba(235,225,205,.85)')).join('')}
    <g ${an('pulse', .5)}>${sfx(180, 800, 'ROAR!', -10, THEME.accent, 100, '#fff')}</g>` },
  { id: 'pass', w: 'passes', t: 9, svg: `<g ${an('grow', .6, 0, 'center')}>${sfx(690, 520, 'PASS ✓', -10, THEME.accent2, 96, '#fff')}</g>` },
  { id: 'bunk', x: 820, y: 1180, w: 'safely', t: 12.5, svg: `
    <path d="M-130 0 V-110 Q-130 -170 -70 -170 H70 Q130 -170 130 -110 V0Z" fill="#9aa0a8" stroke="${THEME.ink}" stroke-width="7"/>
    <rect x="-80" y="-130" width="160" height="70" rx="8" fill="#bfe6ff" stroke="${THEME.ink}" stroke-width="6"/>
    <circle cx="0" cy="-92" r="26" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/><circle cx="-26" cy="-92" r="9" fill="#e63946" stroke="${THEME.ink}" stroke-width="3"/><circle cx="26" cy="-92" r="9" fill="#e63946" stroke="${THEME.ink}" stroke-width="3"/>
    <circle cx="-8" cy="-96" r="3" fill="${THEME.ink}"/><circle cx="8" cy="-96" r="3" fill="${THEME.ink}"/><path d="M-9 -82 Q0 -74 9 -82" stroke="${THEME.ink}" stroke-width="3" fill="none"/>
    <g ${an('wave', .8, 0, [60, -62])}><rect x="56" y="-80" width="22" height="30" rx="8" fill="#fff" stroke="${THEME.ink}" stroke-width="4"/></g>
    ${T(0, 60, 'CONTROL BUNKER', 28)}` }
 ]})));

// ── 9 STACK & WIRE ──────────────────────────────────────────────
S.push(scene(THEME.paper,
 "Next comes the brain. Flight computers, sensors and miles of wiring go in. Then the stages are stacked, the payload is craned into the fairing, and engineers check everything again, and again.",
 comicScene({ badge: '9 — STACK AND WIRE', badgeColor: THEME.accent2, groups: [
  { id: 'hall', always: true, svg: `<rect x="-60" y="1290" width="1120" height="300" fill="#b6bec7"/><rect x="-60" y="1284" width="1120" height="10" fill="#8a929b"/><line x1="-60" y1="420" x2="1060" y2="420" stroke="${THEME.ink}" stroke-width="14"/>` },
  { id: 'brain', x: 500, y: 250, w: 'computers', t: .8, svg: `
    ${T(0, -140, 'FLIGHT COMPUTER', 36)}
    <rect x="-270" y="-100" width="540" height="210" rx="16" fill="#2c6b5a" stroke="${THEME.ink}" stroke-width="7"/>
    ${[[-210, -50], [-80, -50], [60, -50], [-210, 30], [-20, 30]].map(([x, y]) => `<rect x="${x}" y="${y}" width="${x === -20 ? 140 : 100}" height="56" rx="6" fill="#1c2630" stroke="${THEME.ink}" stroke-width="4"/>${Array.from({ length: 5 }, (_, k) => `<line x1="${x + 10 + k * 18}" y1="${y - 8}" x2="${x + 10 + k * 18}" y2="${y}" stroke="#cfd6de" stroke-width="3"/>`).join('')}`).join('')}
    <polyline points="-270,-70 -230,-70 -230,-100" fill="none" stroke="#f3e2b3" stroke-width="4" ${an('flow dash', .8)}/>
    <polyline points="270,60 200,60 200,110" fill="none" stroke="#f3e2b3" stroke-width="4" ${an('flow dash', .8)}/>
    ${[0, 1, 2, 3].map(i => `<circle cx="${-150 + i * 80}" cy="84" r="9" fill="${['#ff4d4d', '#6dff9c', '#ffd23f', '#4dd0ff'][i]}" ${an('blink', .8 + i * .2, i * .15)}/>`).join('')}
    <path d="M270 10 H330 Q380 10 380 60 V130" fill="none" stroke="#c8702a" stroke-width="9" ${an('flow dash', .9)}/>${T(0, 170, 'SENSORS + MILES OF WIRING', 26, THEME.accent)}` },
  { id: 'stk', x: 500, y: 1010, w: 'stacked', t: 5.5, svg: `
    <rect x="-470" y="-62" width="400" height="124" fill="#f6f3ec" stroke="${THEME.ink}" stroke-width="6"/><path d="M-470 -30 L-496 -30 L-510 62 H-470Z" fill="#555" stroke="${THEME.ink}" stroke-width="5"/><text x="-270" y="14" text-anchor="middle" font-family="${FI}" font-size="40" fill="${THEME.accent}">STAGE 1</text>
    <g ${an('moveonce', 2.5, 0, 'center', '--dx:-70px;--e:ease-in-out;')}><g transform="translate(70 0)"><rect x="-40" y="-62" width="290" height="124" fill="#f6f3ec" stroke="${THEME.ink}" stroke-width="6"/><text x="105" y="14" text-anchor="middle" font-family="${FI}" font-size="40" fill="${THEME.accent2}">STAGE 2</text></g></g>
    <g ${an('moveonce', 2.5, .3, 'center', '--dx:-130px;--e:ease-in-out;')}><g transform="translate(130 0)"><path d="M290 -62 H320 Q460 -50 470 0 Q460 50 320 62 H290Z" fill="#f6f3ec" stroke="${THEME.ink}" stroke-width="6" transform="translate(-0 0)"/></g></g>
    ${[-330, 20, 260].map(x => `<polygon points="${x - 50},62 ${x + 50},62 ${x + 34},112 ${x - 34},112" fill="#7d8791" stroke="${THEME.ink}" stroke-width="5"/><circle cx="${x - 22}" cy="128" r="16" fill="#444" stroke="${THEME.ink}" stroke-width="4" ${an('spin', .9)}/><circle cx="${x + 22}" cy="128" r="16" fill="#444" stroke="${THEME.ink}" stroke-width="4" ${an('spin', .9)}/>`).join('')}` },
  { id: 'crane', w: 'payload', t: 8.5, svg: `
    <rect x="800" y="396" width="90" height="44" rx="8" fill="#ffd23f" stroke="${THEME.ink}" stroke-width="6"/>
    <circle cx="822" cy="446" r="12" fill="#444" stroke="${THEME.ink}" stroke-width="4" ${an('spin', .8)}/><circle cx="868" cy="446" r="12" fill="#444" stroke="${THEME.ink}" stroke-width="4" ${an('spin', .8)}/>
    <g ${an('growy', 4, .4, 'top')}><rect x="842" y="440" width="6" height="400" fill="${THEME.ink}"/></g>
    <g ${an('moveonce', 4, .4, 'center', '--dy:360px;--e:ease-in-out;')}><g transform="translate(845 470)"><rect x="-44" y="-8" width="88" height="70" rx="6" fill="#ffd23f" stroke="${THEME.ink}" stroke-width="6"/><rect x="-120" y="4" width="70" height="40" fill="#2d5fb5" stroke="${THEME.ink}" stroke-width="5"/><rect x="50" y="4" width="70" height="40" fill="#2d5fb5" stroke="${THEME.ink}" stroke-width="5"/></g></g>
    ${T(845, 340, 'PAYLOAD', 34)}` },
  { id: 'chk', w: 'again', t: 12, svg: `
    <g transform="translate(0 1290)"><g ${an('move', 6, 0, 'center', '--dx:520px;')}><g transform="translate(120 0)">${stickman(0, 0, [-26, -12], [40, -20], { hat: true, wave: true })}<rect x="30" y="-96" width="34" height="44" rx="4" fill="#fff" stroke="${THEME.ink}" stroke-width="4"/></g></g></g>
    <g transform="translate(0 1290)"><g ${an('move', 7, 0, 'center', '--dx:-520px;')}><g transform="translate(900 0)">${stickman(0, 0, [-44, -22], [30, -14], { hat: true })}<circle cx="-48" cy="-128" r="22" fill="none" stroke="${THEME.ink}" stroke-width="5"/></g></g></g>
    ${[[300, 1180], [520, 1160], [700, 1180]].map(([x, y], i) => `<g ${an('blink', 1.6, i * .5)}>${T(x, y, '✓', 70, THEME.accent2)}</g>`).join('')}` }
 ]})));

// ── 10 ROLLOUT & FUEL ───────────────────────────────────────────
S.push(scene('#7ec8f5',
 "On launch day the rocket rolls out to the pad and is raised upright. Then the super-cold propellant floods in, white vapor pouring off the frosty tanks, while the countdown ticks toward zero.",
 comicScene({ badge: '10 — ROLL OUT AND FUEL', theme: 'sky', groups: [
  { id: 'env', always: true, svg: `
    <circle cx="150" cy="1080" r="72" fill="#ffd23f" ${an('moveonce', 14, 0, 'center', '--dy:-620px;--e:linear;')}/>
    ${cloud(560, 260, 1.3, '#fff', .9)}${cloud(100, 420, 1, '#fff', .8)}
    <g ${an('drift', 30, 0, 'center', '--dx:200px;')}>${cloud(760, 540, 1.1, '#fff', .8)}</g>
    <rect x="-60" y="1250" width="1120" height="400" fill="#7d8b46"/><rect x="60" y="1236" width="820" height="30" rx="6" fill="#9aa0a8" stroke="${THEME.ink}" stroke-width="5"/>` },
  { id: 'tower', w: 'rolls', t: .4, svg: `
    <rect x="780" y="300" width="84" height="936" fill="none" stroke="${THEME.ink}" stroke-width="8"/>
    ${Array.from({ length: 11 }, (_, i) => `<line x1="780" y1="${300 + i * 85}" x2="864" y2="${385 + i * 85}" stroke="${THEME.ink}" stroke-width="5"/><line x1="864" y1="${300 + i * 85}" x2="780" y2="${385 + i * 85}" stroke="${THEME.ink}" stroke-width="5"/>`).join('')}
    <rect x="610" y="520" width="170" height="20" fill="#7d8791" stroke="${THEME.ink}" stroke-width="5"/><rect x="610" y="780" width="170" height="20" fill="#7d8791" stroke="${THEME.ink}" stroke-width="5"/>
    <circle cx="822" cy="290" r="14" fill="#ff4d4d" ${an('blink', .9)}/>` },
  { id: 'erect', w: 'rolls', t: .4, svg: `
    <rect x="70" y="1236" width="500" height="26" rx="6" fill="#555" stroke="${THEME.ink}" stroke-width="5"/>
    ${[110, 200, 290, 380, 470].map(x => `<circle cx="${x}" cy="1270" r="18" fill="#333" stroke="${THEME.ink}" stroke-width="4" ${an('spin', 1.4)}/>`).join('')}
    <g ${an('rotonce', 5, 2.6, [520, 1236], '--r0:-90deg;--r1:0deg;--e:ease-in-out;')}><g transform="translate(520 1236)">${rocket(520, 40, { fins: true })}</g></g>` },
  { id: 'vap', w: 'propellant', t: 9, svg: `
    ${[[470, 0], [575, .7], [470, 1.4], [575, 2.1], [520, .4], [520, 1.8]].map(([x, d], i) => puff(x, 900 + (i % 3) * 110, 26, d, -170, 2.2, 'rgba(255,255,255,.8)')).join('')}
    ${[[470, 760], [575, 830], [490, 1000], [560, 1090]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff" ${an('twinkle', .8, i * .3)}/>`).join('')}
    <circle cx="150" cy="1190" r="50" fill="#cfeaff" stroke="${THEME.ink}" stroke-width="6"/><circle cx="270" cy="1190" r="50" fill="#ffd9b0" stroke="${THEME.ink}" stroke-width="6"/>
    ${T(150, 1196, 'LOX', 28)}${T(270, 1196, 'RP-1', 28)}
    <path d="M150 1140 Q150 1060 440 1090" fill="none" stroke="#4aa3e8" stroke-width="9" ${an('flow dash', .6)}/><path d="M270 1140 Q270 1100 440 1130" fill="none" stroke="#e08a2c" stroke-width="9" ${an('flow dash', .6)}/>` },
  { id: 'cnt', w: 'countdown', t: 12.5, svg: ['5', '4', '3', '2', '1'].map((n, i) => T(250, 560, n, 260, THEME.accent, 'middle', FI, `${an('cnt', 5, i, 'center', 'opacity:0;')} stroke="#fff" stroke-width="8" paint-order="stroke"`)).join('') + T(250, 660, 'T-MINUS', 44, THEME.ink) }
 ]})));

// ── 11 LAUNCH ───────────────────────────────────────────────────
S.push(scene('#7ec8f5',
 "Ignition. The clamps release, and the rocket climbs. Around a minute in it hits max-Q, the moment of greatest air pressure, then the sky thins out and darkens as it accelerates toward almost eight kilometers every second.",
 comicScene({ badge: '11 — LIFTOFF', badgeColor: THEME.accent, theme: 'sky', groups: [
  { id: 'dark', always: true, svg: `<defs><linearGradient id="ng" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#02030c"/><stop offset="1" stop-color="#1b2a5e"/></linearGradient></defs>
    <rect x="-60" y="-300" width="1120" height="2000" fill="url(#ng)" ${an('fadein', 13, 2.5, 'center', '--n:1;--e:linear;')}/>
    <g ${an('fadein', 4, 10, 'center', '--n:1;')}>${stars(50, 11)}</g>` },
  { id: 'clouds', always: true, svg: [[80, 0], [620, 1.6], [330, 3.2], [800, 4.6], [180, 5.8]].map(([x, d], i) => `<g ${an('move', 5.5 + i * .4, -d, 'center', '--dy:1900px;--dir:normal;--e:linear;')}>${cloud(x, -200, 1.4, '#fff', .85)}</g>`).join('') },
  { id: 'lines', always: true, svg: [90, 200, 780, 900, 150, 840].map((x, i) => `<line x1="${x}" y1="-160" x2="${x}" y2="-40" stroke="#fff" stroke-width="5" stroke-linecap="round" ${an('move', .8, -i * .13, 'center', '--dy:1800px;--dir:normal;--e:linear;opacity:.4;')}/>`).join('') },
  { id: 'alt', always: true, svg: `<line x1="935" y1="-100" x2="935" y2="1560" stroke="#fff" stroke-width="34" stroke-dasharray="4 38" opacity=".7" ${an('flow', .7)}/>${M(880, 700, 'ALTITUDE', 28, '#fff', 'middle').replace('<text', `<text transform="rotate(-90 880 700)"`)}` },
  { id: 'pad', w: 'ignition', t: .3, svg: `
    <g ${an('moveonce', 8, 1.6, 'center', '--dy:1700px;--e:ease-in;')}>
      <rect x="-60" y="1300" width="1120" height="400" fill="#7d8b46"/><rect x="300" y="1286" width="420" height="30" rx="6" fill="#9aa0a8" stroke="${THEME.ink}" stroke-width="5"/>
      <rect x="720" y="760" width="70" height="540" fill="none" stroke="${THEME.ink}" stroke-width="8"/>
      ${Array.from({ length: 6 }, (_, i) => `<line x1="720" y1="${760 + i * 90}" x2="790" y2="${850 + i * 90}" stroke="${THEME.ink}" stroke-width="5"/>`).join('')}</g>
    <circle cx="510" cy="1290" r="60" fill="#fff3b0" ${an('ring', 1.6, 0, 'center', '--n:1;--fm:forwards;opacity:0;')}/>` },
  { id: 'rk', w: 'ignition', t: .3, svg: `
    <g ${an('moveonce', 9, 1.6, 'center', '--dy:-520px;--e:ease-in;')}><g transform="translate(510 1286) scale(1.4)"><g ${an('shake', .06)}>${rocket(320, 44, { flame: 230 })}</g></g></g>
    ${[0, .6, 1.2, 1.8].map((d, i) => puff(480 + (i % 2) * 60, 1390, 32, d, 260, 1.6, 'rgba(255,240,220,.7)')).join('')}` },
  { id: 'maxq', w: 'maxq', t: 8.5, svg: `
    <g transform="translate(240 560)">${[0, .5, 1].map(d => `<circle r="120" fill="none" stroke="${THEME.bpHi}" stroke-width="6" ${an('ring', 1.5, d, 'center', '--dir:normal;')}/>`).join('')}
    <g ${an('shake', .1)}>${sfx(0, 0, 'MAX-Q', -6, THEME.bpHi, 84, THEME.ink)}</g>${T(0, 60, 'PEAK AIR PRESSURE', 28, '#fff', 'middle', FM, 'font-weight="bold"')}</g>` },
  { id: 'spd', w: 'accelerates', t: 14.5, svg: `<g ${an('pulse', .9)}>${sfx(700, 240, '7.8 km/s', 6, '#fff', 86, THEME.ink)}</g>${M(700, 296, 'ORBITAL SPEED', 28, '#fff')}` }
 ]})));

// ── 12 STAGING ──────────────────────────────────────────────────
const sat = `<rect x="-26" y="-22" width="52" height="46" rx="5" fill="#ffd23f" stroke="#fff" stroke-width="4"/><rect x="-62" y="-12" width="34" height="24" fill="#2d5fb5"/><rect x="28" y="-12" width="34" height="24" fill="#2d5fb5"/>`;
S.push(scene('#050818',
 "About two and a half minutes up, the first stage runs dry and lets go. The upper stage lights its own engine, built for the vacuum. The fairing splits open and falls away, and the payload sees space for the first time.",
 comicScene({ badge: '12 — LET GO OF STAGE 1', theme: 'night', groups: [
  { id: 'sky', always: true, svg: stars(54, 5) + `<ellipse cx="500" cy="1700" rx="900" ry="300" fill="#1d4f7a" opacity=".6"/>` },
  { id: 'st1', x: 500, w: 'first', t: 1.2, svg: `
    <g ${an('moveonce', 4.5, 2.6, 'center', '--dy:430px;--e:ease-in;')}><g ${an('rotonce', 4.5, 2.6, 'center', '--r0:0deg;--r1:24deg;--e:ease-in;')}>
      <rect x="-50" y="700" width="100" height="400" fill="#f6f3ec" stroke="#fff" stroke-width="5"/>
      <line x1="-50" y1="760" x2="50" y2="760" stroke="${THEME.accent}" stroke-width="8"/>
      ${[-30, 0, 30].map(x => `<path d="M${x - 10} 1100 L${x - 14} 1130 H${x + 14} L${x + 10} 1100Z" fill="#777" stroke="#fff" stroke-width="3"/>`).join('')}</g></g>
    <ellipse cx="0" cy="700" rx="60" ry="20" fill="none" stroke="${THEME.bpHi}" stroke-width="7" ${an('ring', 1.2, 2.6, 'center', '--n:1;--fm:forwards;opacity:0;')}/>
    <g ${an('fadein', .6, 3.2, 'center', '--n:1;')}>${T(-250, 1000, 'STAGE 1', 40, '#fff')}${T(-250, 1044, 'DROPS AWAY', 40, THEME.bpHi)}</g>` },
  { id: 'st2', x: 500, w: 'first', t: 1.2, svg: `
    <rect x="-50" y="440" width="100" height="260" fill="#f6f3ec" stroke="#fff" stroke-width="5"/>
    <path d="M-50 700 L-60 730 H60 L50 700Z" fill="#777" stroke="#fff" stroke-width="4"/>
    <line x1="-50" y1="520" x2="50" y2="520" stroke="${THEME.accent}" stroke-width="8"/>` },
  { id: 'fc', x: 500, w: 'first', t: 1.2, hw: 'fairing', ht: 9.5, svg: `<path d="M-50 440 Q-50 320 0 260 Q50 320 50 440Z" fill="#f6f3ec" stroke="#fff" stroke-width="5"/>` },
  { id: 'ign', x: 500, w: 'upper', t: 6.5, svg: `<g transform="translate(0 730)">${flameSvg(190, 56, .14)}</g>${T(250, 800, 'VACUUM', 38, THEME.bpHi)}${T(250, 846, 'ENGINE', 38, THEME.bpHi)}` },
  { id: 'fo', x: 500, w: 'fairing', t: 9.5, svg: `
    <g transform="translate(0 380)"><g ${an('fadein', .8, 1.2, 'center', '--n:1;')}>${sat}</g></g>
    <g ${an('moveonce', 3.5, 1, 'center', '--dx:-260px;--dy:170px;--e:ease-in;')}><g ${an('rotonce', 1.4, 0, [-50, 440], '--r0:0deg;--r1:-48deg;')}><path d="M0 260 Q-40 320 -50 440 H0Z" fill="#f6f3ec" stroke="#fff" stroke-width="5"/></g></g>
    <g ${an('moveonce', 3.5, 1, 'center', '--dx:260px;--dy:170px;--e:ease-in;')}><g ${an('rotonce', 1.4, 0, [50, 440], '--r0:0deg;--r1:48deg;')}><path d="M0 260 Q40 320 50 440 H0Z" fill="#f6f3ec" stroke="#fff" stroke-width="5"/></g></g>
    ${T(-250, 330, 'FAIRING', 40, '#fff')}${T(-250, 374, 'JETTISON', 40, THEME.bpHi)}` }
 ]})));

// ── 13 ORBIT ────────────────────────────────────────────────────
const lights = (() => { let r = 9, o = ''; const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
    for (let i = 0; i < 34; i++) { const y = 1190 + rnd() * 330, dy = y - 1900, lim = Math.sqrt(760 * 760 - dy * dy) - 30, x = 500 + (rnd() * 2 - 1) * lim;
        o += `<circle ${an('twinkle', (.8 + rnd() * 1.6).toFixed(1), (rnd() * 2).toFixed(1))} cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="3" fill="#ffd23f"/>`; } return o; })();
S.push(scene('#050818',
 "At orbital speed the payload is released. Solar panels unfold, antennas pop out, and the satellite starts its job, circling the planet every hour and a half.",
 comicScene({ badge: '13 — DEPLOY', theme: 'night', groups: [
  { id: 'sky', always: true, svg: stars(60, 21) + `<circle cx="500" cy="1900" r="760" fill="#1d4f7a"/><circle cx="500" cy="1900" r="760" fill="none" stroke="#6fc3ff" stroke-width="12" opacity=".7"/>${lights}<g ${an('drift', 30, 0, 'center', '--dx:240px;')}>${cloud(120, 1260, 1.2, '#dfeaf5', .7)}${cloud(560, 1230, 1, '#dfeaf5', .7)}</g>` },
  { id: 'sat', x: 500, y: 560, w: 'released', t: 1, svg: `
    <rect x="-70" y="-60" width="140" height="120" rx="10" fill="#ffd23f" stroke="#fff" stroke-width="6"/>
    <rect x="-50" y="-40" width="100" height="30" fill="#e0a800"/><circle cx="0" cy="22" r="18" fill="#2d5fb5" stroke="#fff" stroke-width="4"/>
    ${T(0, 150, 'PAYLOAD FREE', 36, '#fff')}` },
  { id: 'pan', x: 500, y: 560, w: 'panels', t: 5, svg: `
    <g ${an('growx', 1.6, 0, 'right')}><rect x="-420" y="-46" width="346" height="92" fill="#2d5fb5" stroke="#fff" stroke-width="5"/>${[-346, -272, -198].map(x => `<line x1="${x - 74}" y1="-46" x2="${x - 74}" y2="46" stroke="#8fbcff" stroke-width="3"/>`).join('')}</g>
    <g ${an('growx', 1.6, 0, 'left')}><rect x="74" y="-46" width="346" height="92" fill="#2d5fb5" stroke="#fff" stroke-width="5"/>${[148, 222, 296].map(x => `<line x1="${x}" y1="-46" x2="${x}" y2="46" stroke="#8fbcff" stroke-width="3"/>`).join('')}</g>
    <g ${an('fadein', .6, 1.6, 'center', '--n:1;')}>${T(0, -110, 'SOLAR PANELS UNFOLD', 34, THEME.bpHi)}</g>` },
  { id: 'dish', x: 500, y: 560, w: 'antennas', t: 8, svg: `
    <line x1="0" y1="-60" x2="0" y2="-120" stroke="#fff" stroke-width="7"/>
    <g ${an('wobble', 1.4, 0, [0, -120])}><path d="M-46 -150 Q0 -100 46 -150" fill="#e8e8e8" stroke="#fff" stroke-width="5"/><line x1="0" y1="-126" x2="0" y2="-176" stroke="#fff" stroke-width="5"/></g>` },
  { id: 'sig', x: 500, y: 560, w: 'job', t: 10.5, svg: [0, .6, 1.2].map(d => `<circle cy="-150" r="70" fill="none" stroke="#7fe0ff" stroke-width="6" ${an('ring', 1.8, d, 'center', '--dir:normal;')}/>`).join('') },
  { id: 'orb', w: 'circling', t: 12.5, svg: `
    <circle cx="500" cy="1900" r="900" fill="none" stroke="#fff" stroke-width="6" opacity=".6" ${an('flow dash', 2)}/>
    <g ${an('spin', 16, 0, [500, 1900])}><circle cx="500" cy="1000" r="16" fill="#ffd23f" stroke="#fff" stroke-width="4"/></g>
    ${T(500, 930, 'ONE ORBIT ≈ 90 MIN', 40, '#fff')}` }
 ]})));

// ── 14 THE RETURN ───────────────────────────────────────────────
S.push(scene('#050818',
 "Meanwhile, the first stage is coming home. It flips around, relights its engines to slow down, steers with grid fins, unfolds its landing legs, and settles onto the pad on a column of flame.",
 comicScene({ badge: '14 — COME HOME', badgeColor: THEME.accent2, theme: 'night', groups: [
  { id: 'env', always: true, svg: stars(40, 8) + `<ellipse cx="500" cy="1480" rx="800" ry="260" fill="#ff7a1a" opacity=".28"/><rect x="-60" y="1255" width="1120" height="420" fill="#2d3a2a"/><rect x="250" y="1244" width="500" height="26" rx="6" fill="#9aa0a8" stroke="#fff" stroke-width="4"/>
     <g ${an('blink', .9)}><path d="M440 1236 L560 1236" stroke="#ff4d4d" stroke-width="7"/></g>${T(500, 1330, 'LANDING PAD', 34, '#fff')}` },
  { id: 'boost', x: 500, y: 100, w: 'meanwhile', t: .1, svg: `
    <g ${an('moveonce', 16, 0, 'center', '--dy:1136px;--e:cubic-bezier(.25,.6,.35,1);')}>
      <g ${an('rotonce', 2.2, 4.5, [0, -150], '--r0:180deg;--r1:0deg;')}>
        <g ${an('fadein', .8, 7.5, 'center', '--n:1;')}><g ${an('vanish', .5, 16.3, 'center')}><g transform="translate(0 22)">${flameSvg(170, 28, .12)}</g></g></g>
        ${rocket(300, 40, { fins: false })}
        <g ${an('rotonce', 1.2, 10, [-40, -250], '--r0:-90deg;--r1:0deg;')}><rect x="-80" y="-264" width="40" height="28" fill="#8a929b" stroke="#fff" stroke-width="4"/><line x1="-70" y1="-264" x2="-70" y2="-236" stroke="#fff" stroke-width="3"/><line x1="-60" y1="-264" x2="-60" y2="-236" stroke="#fff" stroke-width="3"/></g>
        <g ${an('rotonce', 1.2, 10, [40, -250], '--r0:90deg;--r1:0deg;')}><rect x="40" y="-264" width="40" height="28" fill="#8a929b" stroke="#fff" stroke-width="4"/><line x1="50" y1="-264" x2="50" y2="-236" stroke="#fff" stroke-width="3"/><line x1="60" y1="-264" x2="60" y2="-236" stroke="#fff" stroke-width="3"/></g>
        <g ${an('rotonce', 1.8, 12.5, [-40, -40], '--r0:0deg;--r1:45deg;')}><line x1="-40" y1="-40" x2="-40" y2="44" stroke="#fff" stroke-width="9" stroke-linecap="round"/><circle cx="-40" cy="46" r="9" fill="#fff"/></g>
        <g ${an('rotonce', 1.8, 12.5, [40, -40], '--r0:0deg;--r1:-45deg;')}><line x1="40" y1="-40" x2="40" y2="44" stroke="#fff" stroke-width="9" stroke-linecap="round"/><circle cx="40" cy="46" r="9" fill="#fff"/></g>
      </g></g>` },
  { id: 'lab', w: 'flips', t: 4.8, svg: `${T(250, 380, 'FLIP', 56, THEME.bpHi)}` },
  { id: 'lab2', w: 'relights', t: 7.8, svg: `${T(250, 470, 'RELIGHT', 56, THEME.fire)}` },
  { id: 'lab3', w: 'fins', t: 10.4, svg: `${T(250, 560, 'GRID FINS', 56, '#7fe0ff')}` },
  { id: 'lab4', w: 'legs', t: 13, svg: `${T(250, 650, 'LEGS OUT', 56, '#fff')}` },
  { id: 'dust', x: 500, y: 1244, w: 'settles', t: 15.8, svg: `
    ${[0, .35, .7].map(d => `<ellipse rx="70" ry="16" fill="none" stroke="#e9d9b8" stroke-width="8" ${an('ring', 1.8, d, 'center', '--n:1;--fm:forwards;opacity:0;')}/>`).join('')}
    ${[[-150, 0], [150, .2], [-80, .4], [90, .5], [-210, .7], [210, .8]].map(([x, d]) => puff(x, -10, 40, d, -60, 2, 'rgba(230,215,190,.85)')).join('')}` },
  { id: 'crowd', w: 'settles', t: 15.8, svg: `
    ${[760, 830, 900].map((x, i) => `<g transform="translate(${x} 1250)">${stickman(0, 0, [-34, -48], [34, -48], { hat: true, wave: true, wide: true })}</g>`).join('')}
    <g ${an('pulse', .7)}>${sfx(520, 1140, 'TOUCHDOWN!', -4, THEME.bpHi, 70, THEME.ink)}</g>` }
 ]})));

// ── 15 FLY AGAIN + CTA ──────────────────────────────────────────
const icon = (x, y, i, inner) => `<g transform="translate(${x} ${y})"><g ${an('pulse', 2.4, i * .4)}><circle r="62" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/>${inner}</g></g>`;
S.push(scene(THEME.paper,
 "Then it's inspected, refueled, and flown again. Dirt to orbit, and back to dirt, ready to go up once more. That's how a rocket is made, and how it comes home. Subscribe for more.",
 comicScene({ badge: 'FLY IT AGAIN', badgeColor: THEME.accent, groups: [
  { id: 'loop', x: 500, y: 640, w: 'inspected', t: .2, svg: `
    <circle r="330" fill="none" stroke="${THEME.accent}" stroke-width="10" ${an('flow dash', 1.4)}/>
    <g ${an('spin', 16, 0, [0, 0])}>${[0, 120, 240].map(a => `<polygon points="-20,-350 20,-330 -20,-310" fill="${THEME.accent}" transform="rotate(${a})"/>`).join('')}</g>
    ${icon(0, -330, 0, `<polygon points="-26,16 -16,-18 4,-26 24,-10 26,16" fill="#8a7f6f" stroke="${THEME.ink}" stroke-width="4"/>`)}
    ${icon(286, -165, 1, `<g transform="translate(0 20) scale(1 -1)">${flameSvg(50, 16)}</g>`)}
    ${icon(286, 165, 2, `<rect x="-26" y="-22" width="52" height="44" fill="#0f3d7a" stroke="${THEME.ink}" stroke-width="4"/><line x1="-16" y1="-8" x2="16" y2="-8" stroke="#fff" stroke-width="3"/><line x1="-16" y1="6" x2="10" y2="6" stroke="#fff" stroke-width="3"/>`)}
    ${icon(0, 330, 3, `<g transform="translate(0 28) scale(.2)">${rocket(300, 40, { fins: true })}</g>`)}
    ${icon(-286, 165, 4, `<circle r="8" fill="#ffd23f"/><ellipse rx="34" ry="14" fill="none" stroke="${THEME.ink}" stroke-width="4"/>`)}
    ${icon(-286, -165, 5, `<rect x="-24" y="14" width="48" height="8" fill="#8a8f96" stroke="${THEME.ink}" stroke-width="4"/><path d="M-12 14 V-12 H12 V14" fill="#f6f3ec" stroke="${THEME.ink}" stroke-width="4"/>`)}` },
  { id: 'booster', x: 500, y: 800, w: 'inspected', t: .4, svg: `
    <g ${an('float', 2.6)}>${rocket(300, 40, { fins: false, legs: true })}
    <g ${an('move', 3.4, 0, 'center', '--dx:70px;--dy:-170px;')}><circle cx="-40" cy="-40" r="34" fill="rgba(255,255,255,.4)" stroke="${THEME.ink}" stroke-width="6"/><line x1="-16" y1="-16" x2="14" y2="14" stroke="${THEME.ink}" stroke-width="8" stroke-linecap="round"/></g></g>` },
  { id: 'fuel', w: 'refueled', t: 3.8, svg: `
    <path d="M130 1000 Q250 1000 450 900" fill="none" stroke="#2d5fb5" stroke-width="12" ${an('flow dash', .6)}/>${puff(450, 900, 14, 0, -80, 1.6, 'rgba(180,220,255,.9)')}
    <rect x="70" y="960" width="80" height="80" rx="10" fill="#cfeaff" stroke="${THEME.ink}" stroke-width="6"/>${T(110, 1012, 'FUEL', 24)}` },
  { id: 'again', w: 'again', t: 6.2, svg: `<g transform="translate(500 822)">${flameSvg(120, 24, .14)}</g>${[0, .7, 1.4].map(d => puff(500, 960, 24, d, -40, 1.8)).join('')}` },
  { id: 'cyc', w: 'orbit', t: 8.5, svg: `<g ${an('pulse', 1.2)}>${sfx(500, 1090, 'DIRT → ORBIT → DIRT', -2, THEME.accent, 58, '#fff')}</g>` },
  { id: 'eng', x: 150, y: 1360, w: 'inspected', t: .6, svg: stickman(0, 0, [-30, 10], [56, -64], { hat: true, wave: true, wide: true }) },
  { id: 'sub', w: 'subscribe', t: 14, svg: `
    <g transform="translate(500 1240)"><g ${an('pulse', .8)}><rect x="-210" y="-48" width="420" height="96" rx="18" fill="${THEME.accent}" stroke="${THEME.ink}" stroke-width="7"/>${T(0, 20, 'SUBSCRIBE', 58, '#fff')}</g></g>
    <g transform="translate(850 1210)"><g ${an('wobble', .5, 0, [0, -60])}><path d="M-44 20 L-44 -20 Q-44 -64 0 -64 Q44 -64 44 -20 L44 20 Z" fill="${THEME.highlight}" stroke="${THEME.ink}" stroke-width="7"/><circle cx="0" cy="34" r="12" fill="${THEME.ink}"/></g></g>` }
 ]})));

// ── export ──────────────────────────────────────────────────────
const TRANS = ['fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left', 'fade', 'fade'];
module.exports = {
    output: { title: 'rocket-from-dirt-to-landing', format: 'portrait', fps: 30, crf: 23, preset: 'medium' },
    defaults: { voice: 'am_adam', speed: 1.02, transition: 'fade', transitionDuration: 0.3 },
    scenes: S.map((s, i) => Object.assign(s, { transition: TRANS[i] || 'fade' })),
};
