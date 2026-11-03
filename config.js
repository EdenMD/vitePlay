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

// ════════════════════════════════════════════════════════════════
//  EDU SERIES — "RM Footwear" A-Level Business Studies, Paper 2 Section A
// ════════════════════════════════════════════════════════════════
THEMES.board = 'background:#1f3d33';
const CH = '#f5f1e6', CHY = '#ffe08a', GEO = 'Georgia,serif';
const SHOE_SIZES = [8, 5, 6, 5, 6, 7, 7, 7, 8, 9];

function qcard(lines, marks, o = {}) {
    const fill = o.fill || '#fff', ink = o.ink || THEME.ink, h = 36 + lines.length * 48;
    return `<rect x="10" y="0" width="980" height="${h}" rx="18" fill="${fill}" stroke="${ink}" stroke-width="6"/>` +
        lines.map((l, i) => T(500, 52 + i * 48, l, 36, ink, 'middle', GEO, 'font-weight="bold"')).join('') +
        `<rect x="850" y="-24" width="140" height="48" rx="24" fill="${THEME.accent}" stroke="${ink}" stroke-width="5"/>${T(920, 10, marks + (marks === 1 ? ' MARK' : ' MARKS'), 24, '#fff')}`;
}
function ansBox(y, title, items, o = {}) {
    const ink = o.ink || THEME.ink, fill = o.fill || '#fff', rowH = o.rowH || 88, h = 74 + items.length * rowH, col = o.col || THEME.accent2;
    let s = `<rect x="10" y="${y}" width="980" height="${h}" rx="18" fill="${fill}" stroke="${ink}" stroke-width="6"/><rect x="10" y="${y}" width="980" height="54" rx="18" fill="${col}" stroke="${ink}" stroke-width="6"/><rect x="16" y="${y + 30}" width="968" height="26" fill="${col}"/>` + T(40, y + 40, title, 32, '#fff', 'start');
    items.forEach(([txt, d], i) => {
        const yy = y + 78 + i * rowH, lines = Array.isArray(txt) ? txt : [txt];
        s += `<g ${an('fadein', .6, d, 'center', '--n:1;')}><circle cx="52" cy="${yy + 26}" r="19" fill="${THEME.accent}" stroke="${ink}" stroke-width="3"/>${T(52, yy + 36, String(i + 1), 26, '#fff')}` +
            lines.map((l, k) => T(88, yy + 30 + k * 36, l, 31, ink, 'start', GEO, 'font-weight="bold"')).join('') + '</g>';
    });
    return s;
}
const person = (x, y, c = THEME.ink, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><g stroke="${c}" stroke-width="5" stroke-linecap="round" fill="none"><line x1="0" y1="12" x2="0" y2="46"/><line x1="0" y1="46" x2="-13" y2="74"/><line x1="0" y1="46" x2="13" y2="74"/><line x1="-18" y1="26" x2="18" y2="26"/></g><circle cx="0" cy="0" r="12" fill="#fff" stroke="${c}" stroke-width="5"/></g>`;
const shoe = (x, y, s = 1, col = THEME.accent) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-50 0 V-48 H-24 Q-14 -50 -8 -34 L10 -26 Q58 -22 60 -4 V0Z" fill="${col}" stroke="${THEME.ink}" stroke-width="5" stroke-linejoin="round"/><rect x="-52" y="0" width="114" height="14" rx="7" fill="#333" stroke="${THEME.ink}" stroke-width="4"/><line x1="-6" y1="-30" x2="14" y2="-20" stroke="#fff" stroke-width="3"/></g>`;
const shop = (x, y, s = 1, sign = 'SHOP', col = THEME.accent) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-90" y="-110" width="180" height="110" fill="#f6efe0" stroke="${THEME.ink}" stroke-width="6"/><path d="M-102 -110 H102 L86 -152 H-86Z" fill="${col}" stroke="${THEME.ink}" stroke-width="6" stroke-linejoin="round"/>${[-60, -20, 20, 60].map(k => `<line x1="${k}" y1="-152" x2="${k * 1.18}" y2="-110" stroke="#fff" stroke-width="7"/>`).join('')}<rect x="-26" y="-70" width="52" height="70" fill="#7a4a2a" stroke="${THEME.ink}" stroke-width="5"/><rect x="-80" y="-92" width="40" height="34" fill="#bfe6ff" stroke="${THEME.ink}" stroke-width="4"/><rect x="40" y="-92" width="40" height="34" fill="#bfe6ff" stroke="${THEME.ink}" stroke-width="4"/>${T(0, -166, sign, 26)}</g>`;
function teacher(x, y, l1, l2, d = 0) {
    return `<g transform="translate(${x} ${y})">${stickman(0, 0, [-34, -8], [58, -62], { wave: true, wide: true })}` +
        `<g ${an('pulse', 2.2, d)}><ellipse cx="260" cy="-170" rx="230" ry="${l2 ? 62 : 48}" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/><polygon points="90,-120 40,-140 120,-150" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/><polygon points="94,-126 60,-138 118,-146" fill="#fff"/>` +
        T(260, l2 ? -178 : -160, l1, 30, THEME.ink, 'middle', GEO, 'font-weight="bold"') + (l2 ? T(260, -142, l2, 30, THEME.accent, 'middle', GEO, 'font-weight="bold"') : '') + '</g></g>';
}
const panelBg = (n, title, col) => `<rect width="470" height="420" rx="18" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/><circle cx="42" cy="42" r="24" fill="${col}" stroke="${THEME.ink}" stroke-width="4"/>${T(42, 52, String(n), 30, '#fff')}${T(82, 52, title, 32, THEME.ink, 'start')}`;
const cap = (t) => T(235, 398, t, 25, THEME.accent, 'middle', GEO, 'font-weight="bold"');
const ES = [];

// ── E0 INTRO ─────────────────────────────────────────────────────
ES.push(scene(THEME.paper,
 "Let's answer a real A-Level Business Studies paper, step by step. This is Paper 2, Section A, twenty-five marks, all about a shoe company called R M Footwear. We'll define, calculate, explain, and evaluate. Let's go.",
 comicScene({ badge: 'A-LEVEL BUSINESS STUDIES', badgeColor: THEME.accent2, groups: [
  { id: 'sheet', x: 500, y: 390, w: 'paper', t: .6, svg: `<g ${an('float', 3)}><g transform="rotate(-3)">
    <rect x="-330" y="-250" width="660" height="500" rx="14" fill="#fff" stroke="${THEME.ink}" stroke-width="8"/>
    ${T(0, -140, 'PAPER 2', 96)}${T(0, -70, 'SECTION A', 62, THEME.accent)}${T(0, -10, 'DATA RESPONSE  ·  25 MARKS', 36)}
    ${[40, 80, 120, 160, 200].map((y, i) => `<line x1="-270" y1="${y}" x2="${i === 4 ? 40 : 270}" y2="${y}" stroke="#bbb" stroke-width="6" stroke-linecap="round"/>`).join('')}
    <g ${an('move', 2.2, 0, 'center', '--dx:260px;')}><g transform="translate(-270 160) rotate(40)"><rect x="-6" y="-60" width="12" height="60" fill="#ffd23f" stroke="${THEME.ink}" stroke-width="4"/><polygon points="-6,0 6,0 0,16" fill="#f3d2a0" stroke="${THEME.ink}" stroke-width="3"/></g></g></g></g>` },
  { id: 'fac', x: 500, y: 1070, w: 'footwear', t: 6.5, svg: `
    <rect x="-300" y="-230" width="600" height="230" fill="#9a4a2e" stroke="${THEME.ink}" stroke-width="7"/>
    ${[-200, 0, 200].map(x => `<path d="M${x - 100} -230 L${x - 100} -300 L${x} -230 Z" fill="#7a3a22" stroke="${THEME.ink}" stroke-width="6" stroke-linejoin="round"/>`).join('')}
    <rect x="200" y="-380" width="60" height="150" fill="#7a3a22" stroke="${THEME.ink}" stroke-width="6"/>${puff(230, -385, 28, 0, -200)}${puff(230, -385, 34, 1.2, -230)}
    ${[-230, -120, 120, 230].map(x => `<rect x="${x - 34}" y="-190" width="68" height="60" fill="#ffd9a0" stroke="${THEME.ink}" stroke-width="5"/>`).join('')}
    <rect x="-110" y="-120" width="220" height="120" fill="#f6efe0" stroke="${THEME.ink}" stroke-width="6"/>${T(0, -62, 'RM FOOTWEAR', 38)}${T(0, -24, '(PVT) LTD', 28, THEME.accent)}
    <rect x="-340" y="22" width="680" height="30" rx="15" fill="#3a3a3a" stroke="${THEME.ink}" stroke-width="5"/><line x1="-320" y1="37" x2="320" y2="37" stroke="#aaa" stroke-width="5" ${an('flow dash', .6)}/>
    ${[0, 1, 2].map(i => `<g transform="translate(-300 18)"><g ${an('drift', 6, -i * 2, 'center', '--dx:560px;')}>${shoe(0, 0, .45, ['#b5402c', '#2c6b5a', '#2d5fb5'][i])}</g></g>`).join('')}` },
  ...['DEFINE', 'CALCULATE', 'EXPLAIN', 'EVALUATE'].map((c, i) => ({ id: 'c' + i, x: 125 + i * 250, y: 1340, w: c.toLowerCase(), t: 8.6 + i * .9,
     svg: `<g ${an('grow', .5, 0, 'center')}><rect x="-112" y="-40" width="224" height="80" rx="40" fill="${[THEME.accent, THEME.accent2, '#2d5fb5', '#b8860b'][i]}" stroke="${THEME.ink}" stroke-width="6"/>${T(0, 12, c, 32, '#fff')}</g>` })),
  { id: 'tch', x: 120, y: 1250, w: 'go', t: 14, svg: teacher(0, 0, 'Ready?', '', 0).replace(/<g transform="translate\(0 0\)">/, '<g>') }
 ]})));

// ── E1 THE CASE ──────────────────────────────────────────────────
ES.push(scene(THEME.paper,
 "Here's the story. R M Footwear makes school shoes and supplies retailers and wholesalers. It wants to grow by opening its own shop. But it has a stock problem: some sizes pile up, while others run out. So the directors order a survey of ten students, and plan a computer system to manage stock.",
 comicScene({ badge: 'THE CASE STUDY', badgeColor: THEME.accent2, groups: [
  { id: 'ops', w: 'school', t: 1.6, svg: `
    <g transform="translate(190 380)">
      <rect x="-110" y="-150" width="220" height="150" fill="#9a4a2e" stroke="${THEME.ink}" stroke-width="6"/><rect x="50" y="-220" width="40" height="80" fill="#7a3a22" stroke="${THEME.ink}" stroke-width="5"/>${puff(70, -225, 18, 0, -120)}${puff(70, -225, 22, 1.2, -140)}
      ${T(0, -70, 'RM', 54)}${T(0, 52, 'RM FOOTWEAR', 28)}</g>
    <g transform="translate(300 330)"><g ${an('drift', 3.2, 0, 'center', '--dx:260px;--dir:normal;')}><rect x="0" y="-26" width="76" height="40" fill="#2d5fb5" stroke="${THEME.ink}" stroke-width="5"/><rect x="76" y="-12" width="30" height="26" fill="#2d5fb5" stroke="${THEME.ink}" stroke-width="5"/><circle cx="20" cy="18" r="10" fill="#333" ${an('spin', .5)}/><circle cx="88" cy="18" r="10" fill="#333" ${an('spin', .5)}/></g></g>
    ${shop(780, 300, .7, 'RETAILERS')}${shop(780, 470, .7, 'WHOLESALERS', '#2d5fb5')}` },
  { id: 'newshop', w: 'shop', t: 7.5, svg: `
    <g transform="translate(190 780)"><g ${an('grow', .7, 0, 'bottom')}>${shop(0, 0, 1, 'NEW OUTLET', THEME.accent2)}</g></g>
    <g ${an('pulse', 1.2)}>${T(620, 700, 'GOAL: GROW INTERNALLY', 38, THEME.accent2)}</g>
    ${T(620, 756, 'open its own retail outlet', 32, THEME.ink, 'middle', GEO, 'font-weight="bold"')}${T(620, 806, 'to maximise returns on investment', 30, THEME.ink, 'middle', GEO)}` },
  { id: 'stock', w: 'pile', t: 12, svg: `
    <g transform="translate(260 1010)"><rect x="-170" y="0" width="340" height="12" fill="#6b4423" stroke="${THEME.ink}" stroke-width="4"/>${[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => `<rect x="${-150 + c * 76}" y="${-44 - r * 46}" width="68" height="40" fill="#f3e2b3" stroke="${THEME.ink}" stroke-width="3"/>`).join('')).join('')}${T(0, 52, 'OVERSTOCKED', 30, THEME.accent)}</g>
    <g transform="translate(740 1010)"><rect x="-170" y="0" width="340" height="12" fill="#6b4423" stroke="${THEME.ink}" stroke-width="4"/><g ${an('blink', .9)}><rect x="-110" y="-130" width="220" height="60" rx="10" fill="${THEME.accent}" stroke="${THEME.ink}" stroke-width="5"/>${T(0, -88, 'STOCK-OUT', 36, '#fff')}</g>${T(0, 52, 'RAN OUT', 30, THEME.accent)}</g>` },
  { id: 'surv', w: 'survey', t: 17.5, svg: `
    ${T(500, 1140, 'SURVEY: 10 RANDOM STUDENTS', 34)}
    ${SHOE_SIZES.map((n, i) => `<g ${an('fadein', .5, i * .55 + .3, 'center', '--n:1;')}>${person(100 + i * 88, 1180, THEME.ink, .85)}${T(100 + i * 88, 1170, String(n), 30, THEME.accent)}</g>`).join('')}` },
  { id: 'comp', w: 'computer', t: 25, svg: `
    <g transform="translate(150 1360)"><rect x="-70" y="-52" width="140" height="92" rx="8" fill="#1c2630" stroke="${THEME.ink}" stroke-width="6"/><rect x="-14" y="40" width="28" height="22" fill="#555"/><polyline points="-52,18 -26,-6 -4,6 22,-30 52,-12" fill="none" stroke="#6dff9c" stroke-width="5" stroke-linejoin="round" ${an('flow dash', .8)}/></g>
    <g ${an('pulse', 1.2)}>${T(620, 1352, 'COMPUTERISED STOCK SYSTEM', 36, THEME.accent2)}</g>${T(620, 1398, 'tills record sales + stock left', 30, THEME.ink, 'middle', GEO, 'font-weight="bold"')}` }
 ]})));

// ── E2 (a)(i) SAMPLE ─────────────────────────────────────────────
const CHOSEN = [3, 8, 12, 17, 21, 24, 29, 33, 36, 39];
ES.push(scene(THEME.paper,
 "Question a-i. Define sample. A sample is a small group chosen from the whole population to represent it, so a business can learn about everyone without asking everybody. In this passage, it's the ten students picked at random from one school.",
 comicScene({ badge: '(a)(i)  SAMPLE', badgeColor: THEME.accent, groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Define “sample” as used in the passage.'], 3) },
  { id: 'pop', w: 'sample', t: 1.8, svg: `${T(500, 210, 'POPULATION: ALL STUDENTS', 34, THEME.accent2)}<rect x="30" y="228" width="940" height="420" rx="16" fill="none" stroke="${THEME.ink}" stroke-width="5" stroke-dasharray="14 10"/>` +
     Array.from({ length: 40 }, (_, i) => person(90 + (i % 10) * 90, 258 + Math.floor(i / 10) * 100, '#8a8f96', .9)).join('') },
  { id: 'pick', w: 'ten', t: 14.5, svg: CHOSEN.map((k, i) => `<g ${an('bob', .9, i * .1)}>${person(90 + (k % 10) * 90, 258 + Math.floor(k / 10) * 100, THEME.accent, .9)}</g>`).join('') },
  { id: 'samp', w: 'ten', t: 14.5, svg: arrow(500, 660, 500, 718, THEME.accent) + `<rect x="150" y="730" width="700" height="130" rx="16" fill="#fff" stroke="${THEME.accent}" stroke-width="6"/>${T(500, 774, 'SAMPLE: 10 STUDENTS (RANDOM)', 30, THEME.accent)}` + CHOSEN.map((k, i) => person(215 + i * 63, 790, THEME.accent, .5)).join('') },
  { id: 'ans', w: 'small', t: 4.4, svg: ansBox(900, 'MODEL ANSWER', [['A small group selected from a larger population', 0], [['Used to represent the whole population', '(so everyone need not be asked)'], 5], [['In the passage: 10 students chosen at random', 'from one school'], 12]]) },
  { id: 'tch', x: 110, y: 1400, t: 22, svg: teacher(0, 0, 'Definition + context', '= full marks', 0) }
 ]})));

// ── E3 (a)(ii) INTERNAL GROWTH ───────────────────────────────────
ES.push(scene(THEME.paper,
 "Question a-ii. Define internal growth. Internal growth is when a business expands using its own resources and efforts, for example opening new branches, launching new products or entering new markets, rather than merging with, or taking over, another firm. In the passage, it's RM Footwear opening its own retail outlet.",
 comicScene({ badge: '(a)(ii)  INTERNAL GROWTH', badgeColor: THEME.accent, groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Define “internal growth” as used in the passage.'], 3) },
  { id: 'shops', w: 'internal', t: 2.4, svg: [200, 500, 800].map((x, i) => `<g transform="translate(${x} 470)"><g ${an('grow', .7, i * 1.3, 'bottom')}>${shop(0, 0, .8 + i * .18, i === 2 ? 'OUTLET' : 'SHOP', [THEME.accent2, THEME.accent2, THEME.accent][i])}</g></g>`).join('') + arrow(300, 420, 400, 420, THEME.ink) + arrow(600, 420, 700, 420, THEME.ink) + T(500, 205, 'OWN RESOURCES', 36, THEME.accent2) },
  { id: 'ex', w: 'example', t: 11, svg: ['NEW BRANCHES', 'NEW PRODUCTS', 'NEW MARKETS'].map((t, i) => `<g transform="translate(${170 + i * 330} 590)"><g ${an('grow', .5, i * 1.6)}><rect x="-150" y="-28" width="300" height="56" rx="28" fill="#fff" stroke="${THEME.accent2}" stroke-width="5"/>${T(0, 9, t, 26, THEME.accent2)}</g></g>`).join('') },
  { id: 'ext', w: 'merging', t: 18.5, svg: `<g transform="translate(500 740)"><rect x="-290" y="-36" width="110" height="72" rx="10" fill="#eee" stroke="#999" stroke-width="5"/>${T(-235, 10, 'FIRM A', 24, '#999')}<rect x="180" y="-36" width="110" height="72" rx="10" fill="#eee" stroke="#999" stroke-width="5"/>${T(235, 10, 'FIRM B', 24, '#999')}<path d="M-160 0 H160" stroke="#999" stroke-width="7" stroke-dasharray="14 10" ${an('flow', 1)}/>${T(0, -14, 'MERGER / TAKEOVER', 28, '#777')}<g ${an('blink', .9)}><path d="M-80 -44 L80 44 M80 -44 L-80 44" stroke="${THEME.accent}" stroke-width="10" stroke-linecap="round"/></g></g>${T(500, 810, 'that is EXTERNAL growth, not this', 28, '#777', 'middle', GEO, 'font-style="italic"')}` },
  { id: 'rm', w: 'outlet', t: 27, svg: `<g ${an('pulse', .9)}>${sfx(800, 250, "RM'S OWN OUTLET", -4, THEME.accent, 40, '#fff')}</g>` },
  { id: 'ans', w: 'expands', t: 6.6, svg: ansBox(860, 'MODEL ANSWER', [['Expansion using the firm’s own resources', 0], [['e.g. new branches, products or markets', '(not a merger or takeover)'], 5.5], [['In the passage: RM Footwear opening', 'its own retail outlet'], 20]]) },
 ]})));

// ── E4 (b)(i) MEAN ───────────────────────────────────────────────
let run = 0; const RUN = SHOE_SIZES.map(n => (run += n));
ES.push(scene('#1f3d33',
 "Question b-i. Calculate the mean shoe size. Add all ten sizes: eight plus five plus six plus five plus six plus seven plus seven plus seven plus eight plus nine, which equals sixty-eight. Now divide by the number of students, ten. Sixty-eight divided by ten gives a mean of six point eight.",
 comicScene({ badge: '(b)(i)  THE MEAN', badgeColor: '#b8860b', theme: 'board', groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Calculate the mean shoe size.'], 2, { fill: '#2a5446', ink: CH }).replace(/fill="#231b12"/g, '') .replace(/<text([^>]*)fill="#231b12"/g, '<text$1fill="' + CH + '"') },
  { id: 'chips', w: 'add', t: 4, svg: SHOE_SIZES.map((n, i) => {
      const x = 82 + i * 92;
      return `<g ${an('grow', .45, i * .78 + .3, 'center')}><circle cx="${x}" cy="400" r="36" fill="none" stroke="${CH}" stroke-width="5"/>${T(x, 414, String(n), 44, CH)}</g>` +
        (i < 9 ? `<g ${an('fadein', .3, i * .78 + .7, 'center', '--n:1;')}>${T(x + 46, 410, '+', 34, CHY)}</g>` : '') +
        `<g ${an('fadein', .4, i * .78 + .9, 'center', '--n:1;')}>${T(x, 500, String(RUN[i]), 34, CHY)}</g>`;
    }).join('') + T(500, 330, 'SHOE SIZES  (10 STUDENTS)', 34, CH) + T(500, 560, 'running total', 28, CHY, 'middle', GEO, 'font-style="italic"') },
  { id: 'tot', w: 'equals', t: 13, svg: `<g ${an('grow', .6, 0, 'center')}><rect x="250" y="620" width="500" height="110" rx="18" fill="none" stroke="${CHY}" stroke-width="6"/>${T(500, 696, 'TOTAL = 68', 70, CHY)}</g>` },
  { id: 'div', w: 'divide', t: 16.5, svg: `${T(500, 830, 'MEAN = TOTAL ÷ NUMBER OF VALUES', 40, CH)}<g ${an('fadein', .6, 1.6, 'center', '--n:1;')}>${T(500, 920, '= 68 ÷ 10', 72, CH)}</g>` },
  { id: 'ansm', w: 'point', t: 23.5, svg: `<g ${an('grow', .6, 0, 'center')}><rect x="250" y="990" width="500" height="150" rx="24" fill="${CHY}" stroke="${CH}" stroke-width="6"/>${T(500, 1096, '= 6.8', 110, '#1f3d33')}</g>${[0, .5].map(d => `<circle cx="500" cy="1065" r="190" fill="none" stroke="${CHY}" stroke-width="6" ${an('ring', 1.4, d, 'center', '--dir:normal;--n:2;')}/>`).join('')}${T(500, 1210, 'MEAN SHOE SIZE = 6.8', 40, CH)}` },
  { id: 'chalk', always: true, svg: stars(24, 4).replace(/#fff/g, CH) }
 ]})));

// ── E5 (b)(ii) MODE ──────────────────────────────────────────────
const FREQ = [[5, 2], [6, 2], [7, 3], [8, 2], [9, 1]];
ES.push(scene('#1f3d33',
 "Question b-ii. Determine the modal shoe size. The mode is the value that appears most often. Count each size: five appears twice, six twice, seven three times, eight twice, and nine once. Seven wins, so the modal shoe size is seven.",
 comicScene({ badge: '(b)(ii)  THE MODE', badgeColor: '#b8860b', theme: 'board', groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Determine the modal shoe size.'], 1, { fill: '#2a5446', ink: CH }).replace(/<text([^>]*)fill="#231b12"/g, '<text$1fill="' + CH + '"') },
  { id: 'def', w: 'mode', t: 6.2, svg: `<g ${an('grow', .5, 0, 'center')}><rect x="120" y="190" width="760" height="86" rx="16" fill="none" stroke="${CHY}" stroke-width="5"/>${T(500, 248, 'MODE = THE MOST FREQUENT VALUE', 40, CHY)}</g>` },
  { id: 'bars', w: 'count', t: 8.8, svg: `<line x1="60" y1="1100" x2="940" y2="1100" stroke="${CH}" stroke-width="6"/><line x1="60" y1="1100" x2="60" y2="440" stroke="${CH}" stroke-width="6"/>${T(500, 1180, 'SHOE SIZE', 34, CH)}${T(500, 410, 'FREQUENCY (how many students)', 30, CH)}` +
     FREQ.map(([s, f], i) => { const x = 170 + i * 175, h = f * 200;
       return `<g ${an('growy', .7, .4 + [0, 1.6, 3.3, 5.1, 6.9][i], 'bottom')}><rect x="${x - 60}" y="${1100 - h}" width="120" height="${h}" fill="${s === 7 ? CHY : '#7fb2e5'}" stroke="${CH}" stroke-width="5"/></g>` +
        `<g ${an('fadein', .4, 1.1 + [0, 1.6, 3.3, 5.1, 6.9][i], 'center', '--n:1;')}>${T(x, 1100 - h - 16, String(f), 44, CH)}</g>${T(x, 1150, String(s), 44, CHY)}`; }).join('') },
  { id: 'hi', w: 'wins', t: 22, svg: `<g transform="translate(520 600)"><g ${an('pulse', .8)}><polygon points="0,-120 30,-60 96,-52 48,-8 60,58 0,26 -60,58 -48,-8 -96,-52 -30,-60" fill="${CHY}" stroke="${CH}" stroke-width="5"/></g></g>${[0, .6].map(d => `<circle cx="520" cy="770" r="150" fill="none" stroke="${CHY}" stroke-width="6" ${an('ring', 1.5, d, 'center', '--dir:normal;--n:2;')}/>`).join('')}<g ${an('grow', .6, 0, 'center')}>${T(520, 360, 'MODE = 7', 80, CHY)}</g>` },
  { id: 'chalk', always: true, svg: stars(24, 9).replace(/#fff/g, CH) }
 ]})));

// ── E6 (b)(iii) COMMENT ──────────────────────────────────────────
const X = s => 100 + (s - 4) * 133.3;
ES.push(scene(THEME.paper,
 "Question b-iii. Comment on the result. The mode of seven tells RM Footwear which size sells most, so it should stock more size sevens, then sixes and eights. The mean of six point eight is close to the mode, so sizes cluster around seven. But be careful: this is only ten students from one school, so the sample is small and may not represent the whole market. A larger, wider survey would be more reliable.",
 comicScene({ badge: '(b)(iii)  COMMENT', badgeColor: THEME.accent, groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Comment on your result in (b)(ii).'], 2) },
  { id: 'dots', w: 'comment', t: 1.6, svg: `<line x1="70" y1="470" x2="930" y2="470" stroke="${THEME.ink}" stroke-width="6"/>` +
     [4, 5, 6, 7, 8, 9, 10].map(s => `<line x1="${X(s)}" y1="460" x2="${X(s)}" y2="482" stroke="${THEME.ink}" stroke-width="5"/>${T(X(s), 520, String(s), 32)}`).join('') +
     FREQ.map(([s, f]) => Array.from({ length: f }, (_, k) => `<g ${an('grow', .4, 1 + k * .15 + (s - 5) * .2, 'bottom')}><circle cx="${X(s)}" cy="${440 - k * 48}" r="21" fill="${s === 7 ? THEME.accent : '#8a8f96'}" stroke="${THEME.ink}" stroke-width="4"/></g>`).join('')).join('') },
  { id: 'stk', w: 'stock', t: 7.2, svg: `${T(500, 600, 'WHAT TO STOCK', 34, THEME.accent2)}` + [[6, 3], [7, 5], [8, 3]].map(([s, n], i) => `<g transform="translate(${250 + i * 250} 760)">${Array.from({ length: n }, (_, k) => `<g ${an('grow', .4, k * .25 + i * .3, 'bottom')}><rect x="-60" y="${-(k + 1) * 28}" width="120" height="26" fill="${s === 7 ? THEME.accent : '#f3e2b3'}" stroke="${THEME.ink}" stroke-width="4"/></g>`).join('')}${T(0, 46, 'SIZE ' + s, 30)}</g>`).join('') + `<g ${an('bob', .8)}>${T(500, 640, '▲ MORE SIZE 7 ▲', 34, THEME.accent)}</g>` },
  { id: 'mean', w: 'cluster', t: 17.8, svg: `<g transform="translate(${X(6.8)} 400)"><g ${an('bob', .8)}><polygon points="0,18 -18,-14 18,-14" fill="${THEME.accent2}" stroke="${THEME.ink}" stroke-width="4"/></g></g>${T(X(6.8) - 40, 620, 'MEAN 6.8', 28, THEME.accent2, 'end')}` },
  { id: 'warn', w: 'careful', t: 21.6, svg: `<g transform="translate(150 935)"><g ${an('blink', .9)}><polygon points="0,-70 70,56 -70,56" fill="#ffd23f" stroke="${THEME.ink}" stroke-width="7" stroke-linejoin="round"/>${T(0, 40, '!', 80)}</g></g>${T(600, 920, 'ONLY 10 STUDENTS', 40, THEME.accent)}${T(600, 970, 'FROM ONE SCHOOL', 40, THEME.accent)}${T(600, 1016, 'small sample = may not represent the market', 26, THEME.ink, 'middle', GEO, 'font-style="italic"')}` },
  { id: 'big', w: 'larger', t: 31, svg: Array.from({ length: 24 }, (_, i) => `<g ${an('fadein', .4, i * .08, 'center', '--n:1;')}>${person(100 + (i % 12) * 72, 1060 + Math.floor(i / 12) * 76, THEME.accent2, .7)}</g>`).join('') + T(500, 1236, 'BIGGER, WIDER SURVEY = MORE RELIABLE', 34, THEME.accent2) },
  { id: 'ans', w: 'comment', t: 1.6, svg: '' }
 ].filter(g => g.svg !== '').concat([{ id: 'ans2', w: 'mean', t: 17, svg: ansBox(1270, 'MODEL ANSWER (2 MARKS)', [[['Size 7 is most common: stock more of it. But 10 students', 'from one school is too small to be reliable'], 0]], { rowH: 90 }) }]) })));

// ── E7 (c) STOCK-OUTS ────────────────────────────────────────────
ES.push(scene(THEME.paper,
 "Question c. Explain the problems of stock-outs. First, lost sales: customers who want a size that isn't there can't buy it, so revenue falls. Second, customers switch to a competitor, and the firm's reputation and loyalty suffer. Third, retailers and wholesalers lose confidence in a supplier who can't deliver, and may look elsewhere. Fourth, emergency orders and overtime to catch up raise costs and cut profit.",
 comicScene({ badge: '(c)  STOCK-OUTS', badgeColor: THEME.accent, groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Explain the problems to the business of', 'experiencing stock-outs.'], 4) },
  { id: 'p1', x: 20, y: 190, w: 'sales', t: 4.6, svg: panelBg(1, 'LOST SALES', THEME.accent) +
     [150, 225, 300].map(y => `<rect x="40" y="${y}" width="250" height="10" fill="#6b4423" stroke="${THEME.ink}" stroke-width="3"/>`).join('') + [[60, 270], [160, 120], [210, 270]].map(([x, y]) => `<rect x="${x}" y="${y - 34}" width="60" height="32" fill="#f3e2b3" stroke="${THEME.ink}" stroke-width="3"/>`).join('') +
     `<g ${an('blink', .9)}><rect x="60" y="86" width="230" height="46" rx="8" fill="${THEME.accent}" stroke="${THEME.ink}" stroke-width="4"/>${T(175, 120, 'OUT OF STOCK', 28, '#fff')}</g>` +
     `<g transform="translate(390 350) scale(.75)">${stickman(0, 0, [-24, 20], [28, 12], { sad: true })}</g><g ${an('bob', 1)}>${T(385, 210, '£ ↓', 60, THEME.accent)}</g>` + cap('Cannot buy → revenue falls') },
  { id: 'p2', x: 510, y: 190, w: 'competitor', t: 12.4, svg: panelBg(2, 'LOST CUSTOMERS', THEME.accent) +
     shop(110, 290, .62, 'RM') + shop(370, 290, .62, 'RIVAL', '#2d5fb5') +
     `<g transform="translate(120 360)"><g ${an('move', 2.6, 0, 'center', '--dx:200px;')}><g transform="scale(.6)">${stickman(0, 0, [-20, 12], [24, 12], {})}</g></g></g><path d="M130 365 H350" stroke="${THEME.accent}" stroke-width="6" stroke-dasharray="14 10" ${an('flow', 1)}/>` +
     `<g ${an('pulse', 1.1)}>${T(235, 118, 'LOYALTY + REPUTATION ↓', 25, THEME.accent)}</g>` + cap('Customers switch to rivals') },
  { id: 'p3', x: 20, y: 640, w: 'retailers', t: 17.4, svg: panelBg(3, 'LOST TRUST', THEME.accent) +
     `<g transform="translate(120 360) scale(.8)">${stickman(0, 0, [-26, 20], [26, 20], { hat: true })}</g><g transform="translate(350 360) scale(.8)">${stickman(0, 0, [-26, 20], [26, 20], { sad: true })}</g>` +
     `<g ${an('pulse', 1.4)}><ellipse cx="125" cy="165" rx="95" ry="42" fill="#fff" stroke="${THEME.ink}" stroke-width="4"/>${T(125, 174, 'Late again!', 26)}</g><g ${an('pulse', 1.4, .5)}><ellipse cx="345" cy="165" rx="100" ry="42" fill="#fff" stroke="${THEME.ink}" stroke-width="4"/>${T(345, 174, 'New supplier?', 26)}</g>` + cap('Retailers lose confidence') },
  { id: 'p4', x: 510, y: 640, w: 'emergency', t: 24, svg: panelBg(4, 'EXTRA COSTS', THEME.accent) +
     `<g transform="translate(60 300)"><g ${an('drift', 2.4, 0, 'center', '--dx:150px;--dir:alternate;')}><rect x="0" y="-60" width="130" height="80" fill="#f6efe0" stroke="${THEME.ink}" stroke-width="5"/><rect x="130" y="-40" width="56" height="60" fill="#2d5fb5" stroke="${THEME.ink}" stroke-width="5"/><circle cx="34" cy="28" r="18" fill="#333" ${an('spin', .4)}/><circle cx="150" cy="28" r="18" fill="#333" ${an('spin', .4)}/>${T(65, -18, 'RUSH', 32, THEME.accent)}</g></g>` +
     `<circle cx="390" cy="140" r="42" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/><line x1="390" y1="140" x2="390" y2="106" stroke="${THEME.ink}" stroke-width="5" ${an('spin', 3, 0, [390, 140])}/>${T(390, 214, 'OVERTIME', 24, THEME.accent)}` +
     `<g transform="translate(400 350)">${[0, 1, 2, 3].map(k => `<g ${an('grow', .4, k * .5, 'bottom')}><ellipse cx="0" cy="${-k * 18}" rx="40" ry="10" fill="#ffd23f" stroke="${THEME.ink}" stroke-width="3"/></g>`).join('')}</g>` + cap('Emergency orders cut profit') },
  { id: 'tip', w: 'overtime', t: 30, svg: `<rect x="40" y="1110" width="920" height="150" rx="18" fill="#fff" stroke="${THEME.accent2}" stroke-width="6"/>${T(500, 1170, 'EXAM TIP: 4 MARKS = 4 POINTS', 38, THEME.accent2)}${T(500, 1222, 'each one: point + “which means...” (explain)', 30, THEME.ink, 'middle', GEO, 'font-weight="bold"')}` }
 ]})));

// ── E8 (d) BENEFITS ──────────────────────────────────────────────
ES.push(scene(THEME.paper,
 "Question d is worth ten marks, so we need both sides and a judgement. First, the benefits. Tills record every sale automatically and update stock instantly, so managers see exactly what is left. That prevents both overstocking and stock-outs, makes ordering and production planning more accurate, saves staff time and reduces human error, and gives data to forecast which sizes sell best in each outlet.",
 comicScene({ badge: '(d)  THE BENEFITS', badgeColor: THEME.accent2, groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Evaluate the significance of a computerised', 'stock system to RM Footwear (Pvt) Ltd.'], 10) },
  { id: 'flow', w: 'benefits', t: 7, svg: `
    <g transform="translate(150 400)"><rect x="-90" y="-70" width="180" height="110" rx="10" fill="#d8dde3" stroke="${THEME.ink}" stroke-width="6"/><rect x="-66" y="-52" width="132" height="42" fill="#1c2630"/>${T(0, -22, 'SOLD', 26, '#6dff9c', 'middle', FM)}<rect x="-60" y="10" width="120" height="14" fill="#9aa0a8"/>
      <g ${an('move', 1.4, 0, 'center', '--dx:56px;')}><rect x="-112" y="-96" width="52" height="34" fill="#f3e2b3" stroke="${THEME.ink}" stroke-width="4"/></g><circle cx="0" cy="-70" r="14" fill="none" stroke="#ff4d4d" stroke-width="5" ${an('ring', 1.4, 0, 'center', '--dir:normal;')}/>${T(0, 92, 'TILL', 30)}</g>
    ${arrow(270, 400, 410, 400, THEME.ink)}${[0, 1, 2].map(i => `<g transform="translate(290 392)"><g ${an('drift', 2, -i * .66, 'center', '--dx:110px;--dir:normal;--e:linear;')}><rect x="0" y="0" width="16" height="16" fill="${THEME.accent2}"/></g></g>`).join('')}
    <g transform="translate(540 400)"><rect x="-120" y="-84" width="240" height="160" rx="12" fill="#1c2630" stroke="${THEME.ink}" stroke-width="7"/>${[-80, -40, 0, 40, 80].map((x, i) => `<g ${an('pulse', 1.1 + i * .2, i * .25, 'bottom')}><rect x="${x - 14}" y="${50 - [60, 90, 40, 100, 70][i]}" width="28" height="${[60, 90, 40, 100, 70][i]}" fill="${['#6dff9c', '#ffd23f', '#4dd0ff', '#6dff9c', '#ffd23f'][i]}"/></g>`).join('')}${T(0, 110, 'STOCK SYSTEM', 30)}</g>
    ${arrow(680, 400, 790, 400, THEME.ink)}
    <g transform="translate(880 400)"><rect x="-50" y="-90" width="100" height="170" rx="14" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/><g ${an('blink', 1.2)}><path d="M-22 -10 L-6 8 L24 -34" fill="none" stroke="${THEME.accent2}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></g>${T(0, 110, 'MANAGER', 28)}</g>` },
  { id: 'list', w: 'tills', t: 9.4, svg: ansBox(620, 'BENEFITS (FOR)', [
     ['Real-time stock records from every sale', 1.2], ['Fewer overstocks and fewer stock-outs', 9], ['More accurate ordering and production planning', 13], ['Saves time, reduces human error', 17.5], ['Sales data to forecast popular sizes', 22]], { rowH: 96 }) },
  { id: 'tip', w: 'forecast', t: 33, svg: `<rect x="40" y="1250" width="920" height="110" rx="18" fill="#fff" stroke="${THEME.accent}" stroke-width="6"/>${T(500, 1318, 'APPLY IT: tills in RM’s NEW retail outlet', 34, THEME.accent)}` }
 ]})));

// ── E9 (d) DRAWBACKS ─────────────────────────────────────────────
ES.push(scene(THEME.paper,
 "Now the drawbacks. The system is expensive to buy and install, a big outlay for a growing firm. Staff need training, and some may resist the change. A power cut or system crash can stop sales and lose records. And the data must be protected from hackers and input errors.",
 comicScene({ badge: '(d)  THE DRAWBACKS', badgeColor: THEME.accent, groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Evaluate: weigh up the problems too.'], 10) },
  { id: 'p1', x: 20, y: 190, w: 'expensive', t: 3.8, svg: panelBg(1, 'HIGH COST', THEME.accent) +
     `<g transform="translate(235 230)"><g ${an('wobble', 1.6)}><polygon points="-110,0 -70,-60 110,-60 110,60 -70,60" fill="#ffd23f" stroke="${THEME.ink}" stroke-width="6" stroke-linejoin="round"/><circle cx="-70" cy="0" r="10" fill="#fff" stroke="${THEME.ink}" stroke-width="4"/>${T(20, 22, '$$$', 66)}</g></g>` +
     [0, .8, 1.6].map((d, i) => puff(150 + i * 80, 330, 16, d, -70, 2, '#ffd23f')).join('') + cap('Expensive to buy and install') },
  { id: 'p2', x: 510, y: 190, w: 'training', t: 10.5, svg: panelBg(2, 'TRAINING', THEME.accent) +
     `<rect x="40" y="110" width="150" height="110" rx="8" fill="#2c6b5a" stroke="${THEME.ink}" stroke-width="5"/>${T(115, 175, 'A + B', 40, '#fff')}<g transform="translate(120 360) scale(.8)">${stickman(0, 0, [-24, 18], [40, -40], { hat: true, wave: true })}</g>` +
     `<g transform="translate(330 360) scale(.8)">${stickman(0, 0, [-6, -40], [6, -40], { sad: true })}</g><g ${an('bob', .9)}>${T(330, 220, '?', 80, THEME.accent)}</g>${T(380, 140, 'NO!', 38, THEME.accent)}` + cap('Training needed, some resist') },
  { id: 'p3', x: 20, y: 640, w: 'power', t: 15.8, svg: panelBg(3, 'POWER CUTS', THEME.accent) +
     `<g transform="translate(150 240)"><rect x="-90" y="-60" width="180" height="120" rx="10" fill="#1c2630" stroke="${THEME.ink}" stroke-width="6"/><g ${an('blink', .8)}>${T(0, 12, 'ERROR', 44, '#ff4d4d', 'middle', FM)}</g></g>` +
     `<g transform="translate(360 220)"><g ${an('blink', .6)}><polygon points="10,-70 -30,10 -2,10 -14,70 36,-18 6,-18" fill="#ffd23f" stroke="${THEME.ink}" stroke-width="5" stroke-linejoin="round"/></g></g>` + cap('Crash stops sales, loses records') },
  { id: 'p4', x: 510, y: 640, w: 'protected', t: 21.6, svg: panelBg(4, 'DATA RISKS', THEME.accent) +
     `<g transform="translate(150 250)"><g ${an('pulse', 1.2)}><path d="M-34 0 V-34 A34 34 0 0 1 34 -34 V0" fill="none" stroke="${THEME.ink}" stroke-width="12"/><rect x="-60" y="0" width="120" height="96" rx="12" fill="#ffd23f" stroke="${THEME.ink}" stroke-width="7"/><circle cx="0" cy="40" r="12" fill="${THEME.ink}"/></g></g>` +
     `<g transform="translate(350 250)"><g ${an('wobble', .5)}><ellipse cx="0" cy="0" rx="36" ry="26" fill="#444" stroke="${THEME.ink}" stroke-width="5"/>${[-26, 0, 26].map(x => `<line x1="${x}" y1="22" x2="${x * 1.5}" y2="52" stroke="${THEME.ink}" stroke-width="5" stroke-linecap="round"/>`).join('')}</g></g>${T(350, 340, 'HACKERS + TYPOS', 24, THEME.accent)}` + cap('Data must be protected') },
  { id: 'tip', w: 'errors', t: 29, svg: `<rect x="40" y="1110" width="920" height="150" rx="18" fill="#fff" stroke="${THEME.accent2}" stroke-width="6"/>${T(500, 1170, 'APPLY IT: RM is still growing', 38, THEME.accent2)}${T(500, 1222, 'so a big outlay hurts more now', 30, THEME.ink, 'middle', GEO, 'font-weight="bold"')}` }
 ]})));

// ── E10 (d) JUDGEMENT ────────────────────────────────────────────
ES.push(scene(THEME.paper,
 "Finally, the judgement, because evaluate means weigh it up. Overall, a computerised system is very significant for RM Footwear. Its main problem is poor stock control, and opening a retail outlet makes accurate, live data even more important. The costs are real, but they are mostly one-off and manageable, compared with ongoing losses from stock-outs and overstocking. So yes, worthwhile, as long as it's affordable, staff are trained, and there's a backup for power cuts.",
 comicScene({ badge: '(d)  THE JUDGEMENT', badgeColor: '#b8860b', groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Evaluate = weigh up both sides, then decide.'], 10) },
  { id: 'scale', x: 500, y: 520, w: 'judgement', t: 3.5, svg: `
    <polygon points="0,0 -60,380 60,380" fill="#cfd6de" stroke="${THEME.ink}" stroke-width="6" stroke-linejoin="round"/><rect x="-140" y="380" width="280" height="28" rx="8" fill="#6b4423" stroke="${THEME.ink}" stroke-width="6"/>
    <g ${an('rotonce', 2, 6.4, [0, 0], '--r0:4deg;--r1:-9deg;--e:cubic-bezier(.3,1.5,.5,1);')}>
      <line x1="-340" y1="0" x2="340" y2="0" stroke="${THEME.ink}" stroke-width="14" stroke-linecap="round"/><circle cx="0" cy="0" r="22" fill="#ffd23f" stroke="${THEME.ink}" stroke-width="6"/>
      <g transform="translate(-300 0)"><line x1="0" y1="0" x2="-70" y2="170" stroke="${THEME.ink}" stroke-width="5"/><line x1="0" y1="0" x2="70" y2="170" stroke="${THEME.ink}" stroke-width="5"/><path d="M-100 170 H100 Q90 230 0 236 Q-90 230 -100 170Z" fill="${THEME.accent2}" stroke="${THEME.ink}" stroke-width="6"/>${[-50, 10].map(x => `<rect x="${x}" y="110" width="52" height="56" fill="#f3e2b3" stroke="${THEME.ink}" stroke-width="4"/>`).join('')}${T(0, 280, 'BENEFITS', 32, THEME.accent2)}</g>
      <g transform="translate(300 0)"><line x1="0" y1="0" x2="-70" y2="170" stroke="${THEME.ink}" stroke-width="5"/><line x1="0" y1="0" x2="70" y2="170" stroke="${THEME.ink}" stroke-width="5"/><path d="M-100 170 H100 Q90 230 0 236 Q-90 230 -100 170Z" fill="${THEME.accent}" stroke="${THEME.ink}" stroke-width="6"/><ellipse cx="0" cy="164" rx="40" ry="10" fill="#ffd23f" stroke="${THEME.ink}" stroke-width="4"/>${T(0, 280, 'COSTS', 32, THEME.accent)}</g>
    </g>` },
  { id: 'w1', w: 'problem', t: 13.6, svg: `<g ${an('grow', .5, 0, 'center')}><rect x="40" y="1000" width="920" height="68" rx="34" fill="#fff" stroke="${THEME.accent}" stroke-width="5"/>${T(500, 1046, 'MAIN PROBLEM = POOR STOCK CONTROL', 34, THEME.accent)}</g>` },
  { id: 'w2', w: 'important', t: 18.6, svg: `<g ${an('grow', .5, 0, 'center')}><rect x="40" y="1086" width="920" height="68" rx="34" fill="#fff" stroke="${THEME.accent2}" stroke-width="5"/>${T(500, 1132, 'NEW OUTLET NEEDS LIVE STOCK DATA', 34, THEME.accent2)}</g>` },
  { id: 'w3', w: 'manageable', t: 25, svg: `<g ${an('grow', .5, 0, 'center')}><rect x="40" y="1172" width="920" height="68" rx="34" fill="#fff" stroke="#b8860b" stroke-width="5"/>${T(500, 1218, 'COSTS: MOSTLY ONE-OFF + MANAGEABLE', 34, '#b8860b')}</g>` },
  { id: 'ver', w: 'worthwhile', t: 36, svg: `<g ${an('grow', .6, 0, 'center')}>${sfx(500, 1318, 'WORTHWHILE ✓', -3, THEME.accent2, 84, '#fff')}</g>` },
  ...['AFFORDABLE', 'TRAINED STAFF', 'POWER BACKUP'].map((c, i) => ({ id: 'k' + i, x: 170 + i * 330, y: 1400, w: ['affordable', 'trained', 'backup'][i], t: 38 + i * 1.5,
     svg: `<g ${an('grow', .5, 0, 'center')}><rect x="-150" y="-32" width="300" height="64" rx="32" fill="${THEME.accent2}" stroke="${THEME.ink}" stroke-width="5"/>${T(0, 10, c, 28, '#fff')}</g>` }))
 ]})));

// ── E11 RECAP + CTA ──────────────────────────────────────────────
const CMD = [['DEFINE', 'give the meaning, then link it to the passage', THEME.accent], ['CALCULATE', 'show your working, then the answer', THEME.accent2], ['EXPLAIN', 'make a point and say why it matters', '#2d5fb5'], ['EVALUATE', 'both sides, then a justified judgement', '#b8860b']];
ES.push(scene(THEME.paper,
 "Quick recap on how the marks work. Define: give the meaning, then link it to the passage. Calculate: show your working. Explain: make a point and say why it matters. Evaluate: weigh both sides, then give a justified judgement. And always apply your answer to RM Footwear. That's Section A done. Subscribe, and next we'll tackle the Section B essays.",
 comicScene({ badge: 'HOW TO WIN THE MARKS', badgeColor: THEME.accent2, groups: [
  ...CMD.map(([c, m, col], i) => ({ id: 'k' + i, x: 0, y: 20 + i * 215, w: c.toLowerCase(), t: 3.4 + i * 4.8,
     svg: `<g ${an('grow', .5, 0, 'left')}><rect x="20" y="0" width="960" height="190" rx="20" fill="#fff" stroke="${col}" stroke-width="8"/><rect x="20" y="0" width="330" height="190" rx="20" fill="${col}"/><rect x="330" y="0" width="30" height="190" fill="${col}"/>${T(185, 118, c, 52, '#fff')}${T(380, 82, m.split(', ')[0].split(' then ')[0], 30, THEME.ink, 'start', GEO, 'font-weight="bold"')}${T(380, 128, m.includes(' then ') ? 'then ' + m.split(' then ')[1] : (m.includes(', ') ? m.split(', ').slice(1).join(', ') : ''), 30, THEME.ink, 'start', GEO, 'font-weight="bold"')}</g>` })),
  { id: 'app', w: 'apply', t: 23, svg: `<g ${an('pulse', 1)}><rect x="20" y="900" width="960" height="130" rx="24" fill="${THEME.accent}" stroke="${THEME.ink}" stroke-width="7"/>${T(500, 984, 'ALWAYS APPLY IT TO RM FOOTWEAR', 50, '#fff')}</g>` },
  { id: 'tch', x: 130, y: 1330, w: 'done', t: 29, svg: stickman(0, 0, [-34, -8], [58, -62], { wave: true, wide: true }) },
  { id: 'sub', w: 'subscribe', t: 32, svg: `<g transform="translate(600 1250)"><g ${an('pulse', .8)}><rect x="-210" y="-48" width="420" height="96" rx="18" fill="${THEME.accent}" stroke="${THEME.ink}" stroke-width="7"/>${T(0, 20, 'SUBSCRIBE', 58, '#fff')}</g></g><g transform="translate(900 1210)"><g ${an('wobble', .5, 0, [0, -60])}><path d="M-44 20 L-44 -20 Q-44 -64 0 -64 Q44 -64 44 -20 L44 20 Z" fill="${THEME.highlight}" stroke="${THEME.ink}" stroke-width="7"/><circle cx="0" cy="34" r="12" fill="${THEME.ink}"/></g></g>` },
  { id: 'nxt', w: 'essays', t: 36, svg: `<g ${an('pulse', 1.1)}>${T(560, 1380, 'NEXT: SECTION B ESSAYS', 44, THEME.accent2)}</g>` }
 ]})));

// Re-time the timestamp fallbacks from the narration itself: each group is revealed at
// (position of its trigger word / speech rate), so fallbacks track the real script length.
function retime(s) {
    const words = s.tts.text.split(/\s+/).map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);
    const dur = words.length / 2.6;
    s.layers[1].html = s.layers[1].html.replace(/wire\((\{.*?\}), (\{.*?\}), (\[.*?\]), (\[.*?\])\);/s, (m0, rmS, hmS, fbS, hfbS) => {
        const rm = JSON.parse(rmS), hm = JSON.parse(hmS), fb = JSON.parse(fbS), hfb = JSON.parse(hfbS);
        const tShow = {}, tHide = {};
        Object.entries(rm).forEach(([w, ids]) => { const i = words.indexOf(w); if (i >= 0) ids.forEach(id => tShow[id] = i / 2.6 + .5); });
        Object.entries(hm).forEach(([w, ids]) => { const i = words.indexOf(w); if (i >= 0) ids.forEach(id => tHide[id] = i / 2.6 + .5); });
        const fix = (list, map) => list.map(([id, t]) => [id, +Math.min(map[id] !== undefined ? map[id] : t, Math.max(.2, dur - 2.5)).toFixed(1)]);
        return `wire(${rmS}, ${hmS}, ${JSON.stringify(fix(fb, tShow))}, ${JSON.stringify(fix(hfb, tHide))});`;
    });
    return s;
}

module.exports = {
    output: { title: 'rm-footwear-paper2-section-a', format: 'portrait', fps: 30, crf: 23, preset: 'medium' },
    defaults: { voice: 'am_adam', speed: 1.0, transition: 'fade', transitionDuration: 0.3 },
    scenes: ES.map(retime).map((s, i) => Object.assign(s, { transition: ['fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left', 'fade', 'fade'][i] })),
};
