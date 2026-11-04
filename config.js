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
const ES = [];// Re-time the timestamp fallbacks from the narration itself: each group is revealed at
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


// ════════════════════════════════════════════════════════════════
//  EHT INTERVIEW SERIES — Environmental Health Technician (Zimbabwe)
//  Source: ExamineAI community paper "Environmental health technician past interview
//  questions" (2023, 4 pages). Questions + model-answer points follow that paper.
//  Q4 text on the page is cut off after 4 points; the 5th point (ventilation +
//  contact screening) is standard TB household advice added to complete the 5 marks.
//  Verify names, section numbers and details against the Act and your syllabus.
// ════════════════════════════════════════════════════════════════
const clean = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
const at = (txt, w) => { const a = txt.split(/\s+/).map(clean).filter(Boolean), i = a.indexOf(w); return i < 0 ? 0 : i / 2.6; };
const dly = (txt, w, base) => Math.max(.2, +(at(txt, w) - at(txt, base)).toFixed(1));
const EC = ['#b5402c', '#2c6b5a', '#2d5fb5', '#b8860b', '#7b3fa0', '#c0392b'];

// ── E0 INTRO ─────────────────────────────────────────────────────
const N0 = "Let's practise for an Environmental Health Technician interview, using a real Provincial Medical Director's question paper. Twenty questions, from codes of conduct and notifiable diseases, to water monitoring, meat inspection and a four-week work plan. We'll answer them one by one, in a clear exam style. Ready? Let's go.";
const topic = (i, y, t, col, w, icon) => ({ id: 'tp' + i, y, w, svg: `<g ${an('grow', .5, 0, 'left')}><rect x="40" y="0" width="920" height="96" rx="48" fill="#fff" stroke="${col}" stroke-width="7"/><circle cx="96" cy="48" r="38" fill="${col}"/>${icon}${T(172, 62, t, 40, THEME.ink, 'start')}</g>` });
ES.push(scene(THEME.paper, N0,
 comicScene({ badge: 'EHT INTERVIEW PRACTICE', badgeColor: THEME.accent2, groups: [
  { id: 'sign', w: 'interview', t: .8, svg: `<g ${an('float', 3)}><rect x="130" y="40" width="740" height="150" rx="20" fill="#2c6b5a" stroke="${THEME.ink}" stroke-width="8"/>${T(500, 110, 'ENVIRONMENTAL HEALTH', 52, '#fff')}${T(500, 166, 'TECHNICIAN  ·  PAST QUESTIONS', 38, THEME.highlight)}</g>` },
  { id: 'panel', w: 'practise', t: 1.6, svg: `
    ${[560, 700, 840].map((x, i) => `<g ${an('bob', 1.4, i * .4)}>${stickman(x, 480, [-22, 18], [22, 18], { hat: i === 1 })}</g>`).join('')}
    <rect x="470" y="440" width="440" height="60" rx="8" fill="#8b5a2b" stroke="${THEME.ink}" stroke-width="6"/>
    <g transform="translate(150 480)"><g ${an('move', 2.4, 0, 'center', '--dx:90px;')}>${stickman(0, 0, [-34, 10], [48, -50], { hat: true, wave: true, wide: true })}<rect x="30" y="-70" width="34" height="46" rx="4" fill="#fff" stroke="${THEME.ink}" stroke-width="4"/></g></g>
    ${[0, 1, 2].map(i => puff(300 + i * 40, 330, 12, i * .8, -90, 2.4, 'rgba(77,208,255,.8)')).join('')}` },
  topic(0, 620, 'PROFESSIONAL  (Q1, Q19, Q20)', EC[0], 'conduct', `${T(96, 60, '1', 40, '#fff')}`),
  topic(1, 740, 'DISEASE CONTROL  (Q2 – Q9)', EC[1], 'notifiable', `${T(96, 60, '2', 40, '#fff')}`),
  topic(2, 860, 'WATER + HYGIENE  (Q10 – Q14)', EC[2], 'water', `${T(96, 60, '3', 40, '#fff')}`),
  topic(3, 980, 'INSPECTION, FOOD + PLAN  (Q15 – Q18)', EC[3], 'plan', `${T(96, 60, '4', 40, '#fff')}`),
  { id: 'go', x: 150, y: 1360, w: 'go', t: 11, svg: teacher(0, 0, 'Let’s begin!', '', 0) }
 ]})));

// ── E1 Q1 CODES OF CONDUCT ───────────────────────────────────────
const N1 = "Question one. Give five codes of conduct for a trainee E H T. First, integrity and honesty: never accept bribes or favours for overlooking violations. Second, confidentiality: keep patient and client information private. Third, respect and professionalism towards the public and colleagues, with proper dress and behaviour. Fourth, impartiality: apply the law equally to everyone, whatever their status, religion or politics. Fifth, punctuality, diligence and accountability: be on time, keep accurate records, and use resources properly.";
const W = '#fff';
const ICONS = [
  `<g ${an('move', 1.1, 0, 'center', '--dx:30px;')}><circle cx="-16" cy="0" r="22" fill="#ffd23f" stroke="${W}" stroke-width="5"/></g><circle r="62" fill="none" stroke="${W}" stroke-width="9"/><g ${an('blink', .8)}><line x1="-44" y1="-44" x2="44" y2="44" stroke="${W}" stroke-width="9"/></g>`,
  `<g ${an('pulse', 1.2)}><path d="M-28 -6 V-30 A28 28 0 0 1 28 -30 V-6" fill="none" stroke="${W}" stroke-width="11"/><rect x="-46" y="-8" width="92" height="74" rx="10" fill="${W}"/><circle cx="0" cy="24" r="10" fill="#2c6b5a"/></g>`,
  `<g ${an('bob', .9)}>${person(-34, -44, W, 1)}</g><g ${an('bob', .9, .45)}>${person(34, -44, W, 1)}</g><line x1="-20" y1="22" x2="20" y2="22" stroke="${W}" stroke-width="7" stroke-linecap="round"/>`,
  `<g ${an('rot', 1.6, 0, [0, -24], '--r0:-6deg;--r1:6deg;')}><line x1="-60" y1="-24" x2="60" y2="-24" stroke="${W}" stroke-width="8" stroke-linecap="round"/><path d="M-60 -24 L-76 24 H-44Z M60 -24 L44 24 H76Z" fill="none" stroke="${W}" stroke-width="6" stroke-linejoin="round"/></g><polygon points="0,-24 -14,50 14,50" fill="${W}"/>`,
  `<circle r="52" fill="none" stroke="${W}" stroke-width="8"/><line x1="0" y1="-52" x2="0" y2="-40" stroke="${W}" stroke-width="6"/><line x1="0" y1="52" x2="0" y2="40" stroke="${W}" stroke-width="6"/><line x1="0" y1="0" x2="0" y2="-34" stroke="${W}" stroke-width="7" stroke-linecap="round" ${an('spin', 3, 0, [0, 0])}/><line x1="0" y1="0" x2="22" y2="0" stroke="${W}" stroke-width="7" stroke-linecap="round"/>`];
const CODES = [['INTEGRITY + HONESTY', 'Never accept bribes or favours for', 'overlooking violations', 'integrity'], ['CONFIDENTIALITY', 'Keep patient and client information', 'private', 'confidentiality'], ['RESPECT + PROFESSIONALISM', 'Courtesy to public and colleagues;', 'dress and behave appropriately', 'respect'], ['IMPARTIALITY', 'Apply the law equally, whatever the', 'person’s status, religion or politics', 'impartiality'], ['PUNCTUALITY + ACCOUNTABILITY', 'Be on time, keep accurate records,', 'use resources properly', 'punctuality']];
ES.push(scene(THEME.paper, N1,
 comicScene({ badge: 'Q1  CODES OF CONDUCT', badgeColor: THEME.accent, groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['State any 5 codes of conduct for a Trainee EHT'], 5) },
  ...CODES.map(([t, l1, l2, w], i) => ({ id: 'r' + i, y: 150 + i * 228, w, t: 3 + i * 4,
    svg: `<g ${an('grow', .5, 0, 'left')}><rect x="20" y="0" width="960" height="212" rx="20" fill="#fff" stroke="${EC[i]}" stroke-width="8"/><rect x="20" y="0" width="210" height="212" rx="20" fill="${EC[i]}"/><rect x="210" y="0" width="20" height="212" fill="${EC[i]}"/><g transform="translate(125 112)">${ICONS[i]}</g><circle cx="54" cy="36" r="22" fill="#fff"/>${T(54, 47, String(i + 1), 30, EC[i])}${T(260, 84, t, 40, EC[i], 'start')}${T(260, 134, l1, 28, THEME.ink, 'start', GEO, 'font-weight="bold"')}${T(260, 172, l2, 28, THEME.ink, 'start', GEO, 'font-weight="bold"')}</g>` })),
  { id: 'tip', w: 'properly', t: 30, svg: `<rect x="20" y="1300" width="960" height="130" rx="20" fill="#fff" stroke="${THEME.accent2}" stroke-width="6"/>${T(500, 1356, 'ALSO ACCEPTABLE', 36, THEME.accent2)}${T(500, 1404, 'work within your training, supervised by a qualified EHO', 28, THEME.ink, 'middle', GEO, 'font-weight="bold"')}` }
 ]})));

// ── E2 Q2 NOTIFIABLE DISEASES ────────────────────────────────────
const N2 = "Question two. What are notifiable diseases according to the Public Health Act, Chapter 15:17, section 46? Give five examples. Notifiable diseases are infectious diseases of public health importance that the law requires you to report to the health authority, the D M O or E H O, within a set time, so that control action can start quickly. Five examples: cholera, typhoid fever, anthrax, measles and plague. Others include Ebola, polio, T B, meningitis and rabies.";
const node = (x, col, inner, label) => `<g transform="translate(${x} 330)"><circle r="68" fill="${col}" stroke="${THEME.ink}" stroke-width="7"/>${inner}${T(0, 112, label, 28, THEME.ink)}</g>`;
const chip = (x, y, col, name, icon, w, t) => ({ id: 'ch' + name, w, t, svg: `<g transform="translate(${x} ${y})"><g ${an('grow', .5, 0, 'left')}><rect x="0" y="0" width="440" height="100" rx="50" fill="#fff" stroke="${col}" stroke-width="7"/><circle cx="56" cy="50" r="38" fill="${col}"/><g transform="translate(56 50)">${icon}</g>${T(122, 64, name, 38, THEME.ink, 'start')}</g></g>` });
ES.push(scene(THEME.paper, N2,
 comicScene({ badge: 'Q2  NOTIFIABLE DISEASES', badgeColor: THEME.accent, groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['What are notifiable diseases (PHA Cap 15:17,', 'section 46)? State 5 examples.'], '2 + 5') },
  { id: 'flow', w: 'infectious', t: 8, svg: `${T(500, 232, 'MUST BE REPORTED WITHIN A SET TIME', 36, THEME.accent)}` +
     node(125, '#c0392b', `${person(0, -34, '#fff', .95)}`, 'CASE') + node(375, '#2d5fb5', `<rect x="-26" y="-36" width="52" height="68" rx="6" fill="#fff"/><line x1="-14" y1="-14" x2="14" y2="-14" stroke="#2d5fb5" stroke-width="5"/><line x1="-14" y1="2" x2="14" y2="2" stroke="#2d5fb5" stroke-width="5"/><line x1="-14" y1="18" x2="4" y2="18" stroke="#2d5fb5" stroke-width="5"/>`, 'REPORT') +
     node(625, '#2c6b5a', `<rect x="-34" y="-20" width="68" height="52" fill="#fff"/><polygon points="-42,-20 0,-48 42,-20" fill="#fff"/><rect x="-10" y="4" width="20" height="28" fill="#2c6b5a"/>`, 'DMO / EHO') + node(875, '#b8860b', `<path d="M0 -42 L36 -26 V6 Q36 32 0 46 Q-36 32 -36 6 V-26Z" fill="#fff"/><path d="M-14 4 L-4 16 L16 -12" fill="none" stroke="#b8860b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`, 'CONTROL') +
     [[200, 300], [450, 300], [700, 300]].map(([x]) => `<line x1="${x}" y1="330" x2="${x + 50}" y2="330" stroke="${THEME.ink}" stroke-width="8" stroke-linecap="round" ${an('flow dash', .8)}/>`).join('') +
     `<g transform="translate(180 276)"><g ${an('drift', 3.6, 0, 'center', '--dx:640px;--dir:normal;--e:linear;')}><rect x="-20" y="-14" width="40" height="28" rx="3" fill="#fff" stroke="${THEME.ink}" stroke-width="4"/><path d="M-20 -14 L0 4 L20 -14" fill="none" stroke="${THEME.ink}" stroke-width="4"/></g></g>` },
  { id: 'def', w: 'infectious', t: 8, svg: ['Infectious diseases of public health importance', 'that the law requires to be reported, so that', 'control action can start quickly'].map((l, i) => `<g ${an('fadein', .6, i * 1.6 + .6, 'center', '--n:1;')}>${T(500, 520 + i * 44, l, 31, THEME.ink, 'middle', GEO, 'font-weight="bold"')}</g>`).join('') },
  { id: 'h5', w: 'cholera', t: 18, svg: `${T(500, 690, '5 EXAMPLES', 40, THEME.accent2)}` },
  chip(40, 730, EC[2], 'CHOLERA', `<path d="M0 -26 Q22 4 0 22 Q-22 4 0 -26Z" fill="#fff"/>`, 'cholera', 18),
  chip(520, 730, EC[0], 'TYPHOID', `<rect x="-5" y="-28" width="10" height="38" rx="5" fill="#fff"/><circle cx="0" cy="16" r="11" fill="#fff"/>`, 'typhoid', 20),
  chip(40, 850, EC[3], 'ANTHRAX', `${[[-12, -8], [10, -10], [0, 12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff"/>`).join('')}`, 'anthrax', 22),
  chip(520, 850, EC[4], 'MEASLES', `<circle r="26" fill="#fff"/>${[[-10, -8], [8, -12], [12, 8], [-8, 12], [0, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#c0392b"/>`).join('')}`, 'measles', 24),
  chip(40, 970, EC[1], 'PLAGUE', `<g ${an('wobble', .5)}><ellipse rx="22" ry="16" fill="#fff"/>${[-14, 0, 14].map(x => `<line x1="${x}" y1="12" x2="${x * 1.6}" y2="28" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`, 'plague', 26),
  { id: 'more', w: 'ebola', t: 28, svg: `<g transform="translate(520 970)"><g ${an('pulse', 1.4)}><rect x="0" y="0" width="440" height="140" rx="24" fill="#fff" stroke="${THEME.ink}" stroke-width="6" stroke-dasharray="14 8"/>${T(220, 40, 'OTHERS INCLUDE', 28, THEME.accent)}${T(220, 76, 'EBOLA · POLIO (AFP) · TB', 26)}${T(220, 108, 'MENINGITIS · RABIES · COVID-19', 26)}</g></g>` },
  { id: 'tip', w: 'rabies', t: 32, svg: `<rect x="40" y="1160" width="920" height="130" rx="20" fill="#fff" stroke="${THEME.accent2}" stroke-width="6"/>${T(500, 1216, 'EXAM TIP: DEFINE FIRST, THEN LIST FIVE', 36, THEME.accent2)}${T(500, 1262, 'name the DMO / EHO and say WHY reporting matters', 28, THEME.ink, 'middle', GEO, 'font-weight="bold"')}` }
 ]})));

// ── E3 Q3 CHICKENPOX AT SCHOOL ───────────────────────────────────
const N3 = "Question three. How would you prevent and control chickenpox at a primary school? Step one: detect early and report to the D M O or E H O, and inform the school head. Step two: isolate cases. Send affected learners home until all the blisters have crusted, about five to seven days after the rash appears. Step three: health education for teachers, learners and parents on the signs, hand washing, covering coughs, and not sharing items. Step four: protect contacts, with vaccination for susceptible learners where it is available. Step five: environmental measures, like good ventilation, cleaning shared surfaces, and safe disposal of used tissues. And finally, follow up contacts with daily screening, and keep a line list.";
const mini = (n, x, y, title, l1, l2, col, icon, w) => ({ id: 'm' + n, x, y, w, svg: `<g ${an('grow', .5, 0, 'center')}><rect width="470" height="205" rx="18" fill="#fff" stroke="${col}" stroke-width="7"/><circle cx="40" cy="40" r="24" fill="${col}"/>${T(40, 50, String(n), 28, '#fff')}${T(80, 52, title, 30, col, 'start')}${T(30, 112, l1, 25, THEME.ink, 'start', GEO, 'font-weight="bold"')}${T(30, 148, l2, 25, THEME.ink, 'start', GEO, 'font-weight="bold"')}<g transform="translate(405 130)">${icon}</g></g>` });
ES.push(scene(THEME.paper, N3,
 comicScene({ badge: 'Q3  CHICKENPOX AT SCHOOL', badgeColor: THEME.accent, groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Prevent and control chickenpox at a local', 'primary school in your ward'], 5) },
  { id: 'school', w: 'primary', t: 2.4, svg: `
    <rect x="50" y="330" width="320" height="190" fill="#f3e2b3" stroke="${THEME.ink}" stroke-width="7"/><polygon points="30,330 210,250 390,330" fill="${THEME.accent}" stroke="${THEME.ink}" stroke-width="7" stroke-linejoin="round"/>
    ${[90, 170, 250].map(x => `<rect x="${x}" y="360" width="50" height="50" fill="#bfe6ff" stroke="${THEME.ink}" stroke-width="5"/>`).join('')}<rect x="180" y="440" width="60" height="80" fill="#7a4a2a" stroke="${THEME.ink}" stroke-width="5"/>
    <line x1="210" y1="250" x2="210" y2="190" stroke="${THEME.ink}" stroke-width="5"/><g ${an('wobble', .8, 0, [210, 190])}><path d="M210 190 H270 L256 210 L270 230 H210Z" fill="${THEME.accent2}" stroke="${THEME.ink}" stroke-width="4"/></g>${T(210, 560, 'PRIMARY SCHOOL', 28)}
    <g transform="translate(850 520)"><polygon points="-100,-90 0,-170 100,-90" fill="#2d5fb5" stroke="${THEME.ink}" stroke-width="6" stroke-linejoin="round"/><rect x="-80" y="-90" width="160" height="90" fill="#fff3d6" stroke="${THEME.ink}" stroke-width="6"/><rect x="-16" y="-52" width="32" height="52" fill="#7a4a2a"/>${T(0, 40, 'HOME', 28)}</g>` },
  { id: 'sick', w: 'isolate', t: 9, svg: `<g transform="translate(300 450)"><g ${an('moveonce', 4.5, .5, 'center', '--dx:420px;')}>${person(0, 0, THEME.ink, 1)}${[[-5, -4], [4, 2], [-2, 6], [6, -6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#c0392b"/>`).join('')}</g></g>${T(600, 300, 'HOME UNTIL BLISTERS CRUST', 30, THEME.accent)}${T(600, 340, '(about 5–7 days after rash)', 26, THEME.ink, 'middle', GEO, 'font-style="italic"')}` },
  { id: 'ring', x: 210, y: 300, w: 'detect', t: 3.6, svg: [0, .6, 1.2].map(d => `<circle r="50" fill="none" stroke="${THEME.accent}" stroke-width="6" ${an('ring', 1.8, d, 'center', '--dir:normal;')}/>`).join('') },
  mini(1, 20, 600, 'DETECT + REPORT', 'Tell the DMO / EHO and', 'inform the school head', EC[0], `<g ${an('pulse', 1)}><rect x="-14" y="-30" width="28" height="56" rx="6" fill="#fff" stroke="${EC[0]}" stroke-width="5"/></g>`, 'detect'),
  mini(2, 510, 600, 'ISOLATE CASES', 'Send home until blisters', 'crust (about 5-7 days)', EC[1], `<polygon points="-30,0 0,-28 30,0" fill="${EC[1]}"/><rect x="-22" y="0" width="44" height="30" fill="#fff" stroke="${EC[1]}" stroke-width="4"/>`, 'isolate'),
  mini(3, 20, 825, 'HEALTH EDUCATION', 'Signs, hand washing,', 'cover coughs, no sharing', EC[2], `<rect x="-24" y="-6" width="48" height="26" rx="6" fill="#fff" stroke="${EC[2]}" stroke-width="4"/>${[0, 1].map(i => puff(-8 + i * 16, -8, 6, i * .6, -34, 1.6, '#4dd0ff')).join('')}`, 'education'),
  mini(4, 510, 825, 'PROTECT CONTACTS', 'Vaccinate susceptible', 'learners where available', EC[3], `<g ${an('move', 1, 0, 'center', '--dx:-12px;')}><rect x="-8" y="-24" width="40" height="14" rx="4" fill="#fff" stroke="${EC[3]}" stroke-width="4" transform="rotate(-30)"/><line x1="-30" y1="14" x2="-10" y2="2" stroke="${EC[3]}" stroke-width="4" stroke-linecap="round"/></g>`, 'vaccination'),
  mini(5, 20, 1050, 'ENVIRONMENT', 'Ventilate, clean shared', 'surfaces, bin tissues', EC[4], `<rect x="-26" y="-26" width="52" height="52" fill="#fff" stroke="${EC[4]}" stroke-width="4"/><line x1="-40" y1="0" x2="40" y2="0" stroke="${EC[4]}" stroke-width="4" ${an('flow dash', .7)}/>`, 'ventilation'),
  mini(6, 510, 1050, 'FOLLOW UP', 'Daily screening of', 'contacts; keep a line list', EC[5], `<rect x="-22" y="-30" width="44" height="58" rx="5" fill="#fff" stroke="${EC[5]}" stroke-width="4"/><g ${an('blink', 1)}><path d="M-12 -4 L-3 6 L12 -16" fill="none" stroke="${EC[5]}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`, 'screening'),
  { id: 'tip', w: 'list', t: 56, svg: `<rect x="20" y="1280" width="960" height="120" rx="20" fill="#fff" stroke="${THEME.accent2}" stroke-width="6"/>${T(500, 1336, 'DETECT → ISOLATE → EDUCATE → PROTECT → CLEAN → FOLLOW UP', 28, THEME.accent2)}${T(500, 1380, 'six clear measures cover the 5 marks', 26, THEME.ink, 'middle', GEO, 'font-weight="bold"')}` }
 ]})));

// ── E4 Q4 TB EDUCATION ───────────────────────────────────────────
const N4 = "Question four. Give health education on T B prevention and control at household level. One: explain the cause and spread. T B is caused by a bacterium, and spreads through the air when someone with active T B coughs or sneezes. Two: know the signs, a cough of two weeks or more, night sweats, weight loss, fever, or blood in the sputum. Go to the clinic for free testing. Three: finish the full course of treatment, under D O T S. It is free, and it cures T B. Four: cough etiquette. Cover your mouth, and spit into a container with disinfectant, never on the ground. Five: keep rooms ventilated, and screen everyone in the household who was in contact.";
const sicon = (x, y, label, inner, w) => ({ id: 'si' + label, x, y, w, svg: `<g ${an('grow', .5, 0, 'center')}><circle r="52" fill="#fff" stroke="${THEME.accent2}" stroke-width="6"/>${inner}${T(0, 92, label, 26, THEME.accent2)}</g>` });
ES.push(scene(THEME.paper, N4,
 comicScene({ badge: 'Q4  TB AT HOME', badgeColor: THEME.accent, groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Health education on TB: prevention and control', 'at household level in your ward'], 5) },
  { id: 'house', w: 'cause', t: 7, svg: `
    <polygon points="110,330 500,200 890,330" fill="#2d5fb5" stroke="${THEME.ink}" stroke-width="7" stroke-linejoin="round"/><rect x="140" y="330" width="720" height="300" fill="#fff3d6" stroke="${THEME.ink}" stroke-width="7"/><line x1="500" y1="330" x2="500" y2="630" stroke="${THEME.ink}" stroke-width="5"/>
    <g transform="translate(300 630) scale(.85)">${stickman(0, 0, [-20, 18], [20, 18], { sad: true })}</g>
    ${[0, 1, 2, 3, 4].map(i => `<circle ${an('rise', 2.4, i * .5, 'center', `--dy:${-40 - (i % 3) * 20}px;--sc:2;`)} cx="${330 + i * 14}" cy="${470 + (i % 2) * 8}" r="${6 + (i % 2) * 3}" fill="#7bc96f"/>`).join('')}
    ${[0, 1, 2].map(i => `<g transform="translate(340 480)"><g ${an('drift', 3, -i, 'center', '--dx:150px;--dir:normal;--e:linear;')}><circle r="7" fill="#7bc96f" stroke="#2f6b2f" stroke-width="2"/></g></g>`).join('')}
    <g transform="translate(700 630) scale(.85)">${stickman(0, 0, [-20, 18], [20, 18], { hat: false })}</g>${T(500, 270, 'GERMS SPREAD IN THE AIR', 30, '#fff')}` },
  { id: 'vent', w: 'ventilated', t: 44, svg: `<rect x="128" y="400" width="24" height="96" fill="#bfe6ff" stroke="${THEME.ink}" stroke-width="4"/><rect x="848" y="400" width="24" height="96" fill="#bfe6ff" stroke="${THEME.ink}" stroke-width="4"/><path d="M40 448 H960" stroke="#4aa3e8" stroke-width="9" ${an('flow dash', .7)}/><circle cx="900" cy="200" r="36" fill="#ffd23f" ${an('pulse', 1.2)}/>` },
  sicon(125, 740, 'TEST', `<rect x="-8" y="-36" width="16" height="56" rx="8" fill="#fff" stroke="${THEME.accent2}" stroke-width="5"/><rect x="-8" y="-6" width="16" height="26" rx="8" fill="#c0392b" ${an('pulse', 1)}/>`, 'signs'),
  sicon(375, 740, 'DOTS', `<rect x="-30" y="-28" width="60" height="56" rx="6" fill="#fff" stroke="${THEME.accent2}" stroke-width="5"/>${[[-14, -10], [4, -10], [-14, 8], [4, 8]].map(([x, y], i) => `<g ${an('blink', 1.4, i * .35)}><circle cx="${x + 5}" cy="${y + 4}" r="6" fill="${THEME.accent2}"/></g>`).join('')}`, 'finish'),
  sicon(625, 740, 'COVER', `<g transform="translate(0 -4) scale(.5)">${person(0, -20, THEME.ink, 1.4)}</g><g ${an('bob', .8)}><rect x="-14" y="-6" width="28" height="12" rx="5" fill="#2d5fb5" stroke="${THEME.ink}" stroke-width="3"/></g>`, 'etiquette'),
  sicon(875, 740, 'SCREEN', `${[-22, 0, 22].map((x, i) => `<g ${an('bob', .9, i * .3)}>${person(x, -24, THEME.accent2, .45)}</g>`).join('')}`, 'screen'),
  { id: 'ans', w: 'cause', t: 7, svg: ansBox(860, 'MODEL ANSWER (5 MARKS)', [
    [['Cause + spread: TB bacterium; spreads through the air', 'when a person with active TB coughs or sneezes'], .3],
    [['Signs: cough 2+ weeks, night sweats, weight loss,', 'fever, blood in sputum. Get tested at the clinic (free)'], dly(N4, 'signs', 'cause')],
    [['Finish the full DOTS course: it is free and cures TB', ''], dly(N4, 'finish', 'cause')],
    [['Cough etiquette: cover mouth; spit into a container', 'with disinfectant, never on the ground'], dly(N4, 'etiquette', 'cause')],
    [['Keep rooms ventilated; screen household contacts', ''], dly(N4, 'ventilated', 'cause')]], { rowH: 84 }) }
 ]})));


// ════════════════════════════════════════════════════════════════
//  Q5 – Q20  (from the Provincial Medical Director's question paper, image upload)
// ════════════════════════════════════════════════════════════════
const drop = (x, y, dl = 0, dy = 90, col = '#4aa3e8', r = 7) => `<circle ${an('rise', 1.2, dl, 'center', `--dy:${dy}px;--sc:.9;`)} cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
const G = (id, w, x, y, svg) => ({ id, w, t: 1, x, y, svg });
function qaScene({ badge, col = THEME.accent, N, q, marks, vis, items, boxY, rowH = 84, tip }) {
    const first = items[0][1];
    const groups = [{ id: 'q', y: 10, t: .1, svg: qcard(q, marks) }, ...vis,
        { id: 'ans', w: first, t: 1, svg: ansBox(boxY, `MODEL ANSWER  (${marks} MARKS)`, items.map(([l, w], i) => [l, i === 0 ? .3 : dly(N, w, first)]), { rowH }) }];
    if (tip) groups.push({ id: 'tip', w: tip.w, t: 1, svg: `<rect x="20" y="${tip.y}" width="960" height="${tip.h || 110}" rx="20" fill="#fff" stroke="${THEME.accent2}" stroke-width="6"/>${T(500, tip.y + 52, tip.a, 34, THEME.accent2)}${T(500, tip.y + 92, tip.b, 27, THEME.ink, 'middle', GEO, 'font-weight="bold"')}` });
    return scene(THEME.paper, N, comicScene({ badge, badgeColor: col, groups }));
}
const pill = (x, y, w, h, col, txt, size = 28) => `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="#fff" stroke="${col}" stroke-width="6"/>${T(0, size * .36, txt, size, col)}</g>`;

// ── Q5 SCABIES ───────────────────────────────────────────────────
const N5s = "Question five. How would you prevent and control scabies? First, find and treat cases. Scabies is caused by a tiny mite that burrows in the skin, so apply a scabicide such as permethrin or benzyl benzoate over the whole body. Second, treat all close contacts at the same time: family members, classmates, and anyone sharing a bed, or the infection returns. Third, wash clothes and bedding in hot water and dry them in the sun, or iron them. Fourth, give health education on personal hygiene, not sharing clothes or bedding, and avoiding overcrowding. Fifth, report outbreaks to the D M O, and keep affected learners away from school until treated.";
ES.push(qaScene({ badge: 'Q5  SCABIES', N: N5s, q: ['How would you prevent and control scabies?'], marks: 5, boxY: 900,
 vis: [
  G('mite', 'mite', 240, 400, `<circle r="130" fill="#fff" stroke="${THEME.ink}" stroke-width="8"/><g ${an('wobble', .7)}><ellipse rx="50" ry="40" fill="#d9b38c" stroke="${THEME.ink}" stroke-width="5"/><circle cx="-28" cy="-10" r="4" fill="${THEME.ink}"/><circle cx="-12" cy="-14" r="4" fill="${THEME.ink}"/>${[-34, -12, 12, 34].map(x => `<line x1="${x}" y1="30" x2="${x * 1.5}" y2="62" stroke="${THEME.ink}" stroke-width="5" stroke-linecap="round"/><line x1="${x}" y1="-30" x2="${x * 1.5}" y2="-62" stroke="${THEME.ink}" stroke-width="5" stroke-linecap="round"/>`).join('')}</g><line x1="92" y1="92" x2="160" y2="160" stroke="${THEME.ink}" stroke-width="18" stroke-linecap="round"/>${T(0, 190, 'SCABIES MITE', 30)}`),
  G('skin', 'burrows', 720, 400, `<rect x="-190" y="-120" width="380" height="240" rx="30" fill="#f3c9a5" stroke="${THEME.ink}" stroke-width="7"/>${[[-100, -40], [20, 20], [90, -50], [-40, 60]].map(([x, y]) => `<path d="M${x} ${y} q20 -18 40 0 t40 0" fill="none" stroke="#b5402c" stroke-width="5" stroke-linecap="round"/>`).join('')}${[[-120, 40], [-20, -70], [110, 50], [50, -10], [140, -80]].map(([x, y], i) => `<g ${an('blink', 1 + i * .15, i * .2)}><circle cx="${x}" cy="${y}" r="9" fill="#c0392b"/></g>`).join('')}${T(0, 170, 'BURROWS + ITCH', 30, THEME.accent)}`),
  G('wash', 'wash', 500, 700, `<line x1="-420" y1="-100" x2="420" y2="-100" stroke="${THEME.ink}" stroke-width="6"/>${[-300, -150, 0, 150, 300].map((x, i) => `<g transform="translate(${x} -100)"><g ${an('wobble', 1.5 + i * .15, i * .2, 'top')}><path d="M-34 0 H34 L52 20 L40 34 L30 26 V80 H-30 V26 L-40 34 L-52 20Z" fill="${['#2d5fb5', '#fff', '#b5402c', '#2c6b5a', '#ffd23f'][i]}" stroke="${THEME.ink}" stroke-width="4" stroke-linejoin="round"/></g></g>`).join('')}<circle cx="430" cy="-170" r="46" fill="#ffd23f" ${an('pulse', 1.4)}/><path d="M-400 70 H-250 L-270 120 H-380Z" fill="#8a929b" stroke="${THEME.ink}" stroke-width="5"/>${[0, .7, 1.4].map(d => puff(-330 + d * 30, 60, 14, d, -80, 2, 'rgba(255,255,255,.9)')).join('')}${T(0, 150, 'HOT WASH  +  SUN DRY', 34, THEME.accent2)}`)],
 items: [[['Find + treat cases: scabicide (permethrin or', 'benzyl benzoate) applied to the whole body'], 'find'], [['Treat ALL close contacts at the same time', '(family, classmates, anyone sharing a bed)'], 'contacts'], [['Wash clothes + bedding in hot water; dry in', 'the sun or iron them'], 'wash'], [['Health education: personal hygiene, no sharing', 'of clothes or bedding, avoid overcrowding'], 'education'], [['Report outbreaks to the DMO; keep learners', 'out of school until treated'], 'report']] }));

// ── Q6 SURVEILLANCE ──────────────────────────────────────────────
const N6 = "Question six. Define disease surveillance. Disease surveillance is the continuous, systematic collection, analysis and interpretation of health data, followed by timely feedback to those who need it, so that action can be taken to prevent and control disease. It can be passive, where facilities routinely report cases, or active, where health workers go out looking for cases. Its purposes include early warning of outbreaks, tracking disease trends, and guiding planning.";
const cyc = [[500, 330, 'COLLECT', 'collection', '#b5402c'], [730, 540, 'ANALYSE', 'analysis', '#2d5fb5'], [500, 750, 'INTERPRET', 'interpretation', '#2c6b5a'], [270, 540, 'ACT', 'feedback', '#b8860b']];
ES.push(qaScene({ badge: 'Q6  SURVEILLANCE', col: THEME.accent2, N: N6, q: ['Define disease surveillance'], marks: 5, boxY: 900, rowH: 88,
 vis: [
  G('cyc', 'surveillance', 500, 540, `<circle r="210" fill="none" stroke="${THEME.ink}" stroke-width="7" ${an('flow dash', 1.6)}/><g ${an('pulse', 1.4)}><ellipse rx="86" ry="52" fill="#fff" stroke="${THEME.ink}" stroke-width="7"/><circle r="30" fill="${THEME.accent2}" stroke="${THEME.ink}" stroke-width="5"/><circle cx="-8" cy="-8" r="8" fill="#fff"/></g>${T(0, 100, 'SURVEILLANCE', 30)}`),
  ...cyc.map(([x, y, t, w, c], i) => ({ id: 'n' + i, w, t: 1, svg: `<g transform="translate(${x} ${y})"><g ${an('grow', .5, 0, 'center')}><circle r="70" fill="${c}" stroke="${THEME.ink}" stroke-width="7"/>${T(0, 9, t, 24, '#fff')}</g></g>` }))],
 items: [[['Continuous, systematic collection, analysis and', 'interpretation of health data'], 'continuous'], [['Timely feedback so that action can be taken', 'to prevent and control disease'], 'feedback'], [['Passive (routine reports) or active (go looking', 'for cases)'], 'passive'], [['Purposes: early warning, disease trends, planning'], 'purposes']] }));

// ── Q7 INVESTIGATION ─────────────────────────────────────────────
const N7 = "Question seven. Define disease investigation. Disease investigation is the systematic process of finding out the cause, source and spread of a disease or outbreak, so that the right control measures can be put in place. The steps are: verify the diagnosis, confirm that there is an outbreak, set a case definition and find cases, list them and study who, where and when, collect samples, then apply control measures and report.";
const STEPS = [['VERIFY', 'verify'], ['CONFIRM', 'confirm'], ['CASES', 'definition'], ['LIST', 'list'], ['SAMPLES', 'samples'], ['CONTROL', 'apply']];
ES.push(qaScene({ badge: 'Q7  INVESTIGATION', col: THEME.accent2, N: N7, q: ['Define disease investigation'], marks: 5, boxY: 840, rowH: 88,
 vis: [
  G('map', 'investigation', 500, 360, `<rect x="-400" y="-170" width="800" height="340" rx="20" fill="#e8f0d9" stroke="${THEME.ink}" stroke-width="7"/><path d="M-400 20 H400 M-120 -170 V170 M200 -170 V170" stroke="#c9b98f" stroke-width="12"/>${[[-300, -90], [-250, -100], [-270, -50], [-60, 60], [-20, 90], [-90, 100], [260, -60], [300, 80]].map(([x, y], i) => `<g ${an('bob', .9, i * .15)}><circle cx="${x}" cy="${y}" r="13" fill="#c0392b" stroke="${THEME.ink}" stroke-width="3"/></g>`).join('')}<g ${an('move', 3.6, 0, 'center', '--dx:420px;--dy:60px;')}><circle cx="-320" cy="-100" r="46" fill="rgba(255,255,255,.45)" stroke="${THEME.ink}" stroke-width="8"/><line x1="-286" y1="-66" x2="-250" y2="-30" stroke="${THEME.ink}" stroke-width="12" stroke-linecap="round"/></g>${T(0, 215, 'WHO  ·  WHERE  ·  WHEN', 32, THEME.accent)}`),
  ...STEPS.map(([t, w], i) => ({ id: 'st' + i, w, t: 1, svg: `<g transform="translate(${110 + i * 156} 650)"><g ${an('grow', .5, 0, 'center')}><circle r="44" fill="${EC[i % 6]}" stroke="${THEME.ink}" stroke-width="6"/>${T(0, 14, String(i + 1), 40, '#fff')}${T(0, 82, t, 22, THEME.ink)}</g></g>` }))],
 items: [[['Systematic process of finding the cause, source and', 'spread of a disease or outbreak'], 'systematic'], [['Verify the diagnosis; confirm that there is an outbreak'], 'verify'], [['Case definition; find cases; line list (who, where, when)'], 'definition'], [['Collect samples; apply control measures; report'], 'samples']] }));

// ── Q8 PARASITES + PESTS ─────────────────────────────────────────
const N8 = "Question eight. Name any three parasites and three pests of public health importance. Parasites: Plasmodium, which causes malaria; Schistosoma, which causes bilharzia; and Ascaris, the roundworm. Pests: the Anopheles mosquito, which spreads malaria; the housefly, which carries diarrhoeal diseases; and the rat, which spreads plague and leptospirosis. Other pests include cockroaches, fleas, lice, ticks and tsetse flies.";
const pcard = (x, y, col, name, dis, icon, w) => ({ id: 'pc' + name.replace(/\W/g, ''), x, y, w, t: 1, svg: `<g ${an('grow', .5, 0, 'center')}><rect width="470" height="180" rx="18" fill="#fff" stroke="${col}" stroke-width="7"/><circle cx="92" cy="90" r="62" fill="${col}"/><g transform="translate(92 90)">${icon}</g>${T(176, 84, name, 34, col, 'start')}${T(176, 128, dis, 26, THEME.ink, 'start', GEO, 'font-weight="bold"')}</g>` });
const WS = '#fff';
ES.push(scene(THEME.paper, N8, comicScene({ badge: 'Q8  PARASITES + PESTS', badgeColor: THEME.accent, groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Name any 3 parasites and 3 pests of', 'public health importance'], 6) },
  { id: 'h1', w: 'parasites', t: 1, svg: T(255, 232, 'PARASITES', 40, THEME.accent2) + T(745, 232, 'PESTS', 40, THEME.accent) },
  pcard(20, 260, EC[0], 'PLASMODIUM', 'causes MALARIA', `<circle r="34" fill="none" stroke="${WS}" stroke-width="6"/><g ${an('wobble', .8)}><circle cx="8" cy="-4" r="12" fill="none" stroke="${WS}" stroke-width="5"/></g>`, 'plasmodium'),
  pcard(20, 460, EC[2], 'SCHISTOSOMA', 'causes BILHARZIA', `<g ${an('wobble', .7)}><path d="M-34 -18 q16 -22 34 0 t34 0" fill="none" stroke="${WS}" stroke-width="7" stroke-linecap="round"/><path d="M-34 14 q16 -22 34 0 t34 0" fill="none" stroke="${WS}" stroke-width="7" stroke-linecap="round"/></g>`, 'schistosoma'),
  pcard(20, 660, EC[3], 'ASCARIS', 'the ROUNDWORM', `<g ${an('spin', 6)}><path d="M0 -4 q10 -24 24 -6 q12 22 -12 28 q-30 4 -34 -28 q-2 -30 34 -34" fill="none" stroke="${WS}" stroke-width="7" stroke-linecap="round"/></g>`, 'ascaris'),
  pcard(510, 260, EC[1], 'ANOPHELES', 'mosquito: spreads MALARIA', `<ellipse rx="26" ry="10" fill="${WS}"/><g ${an('wobble', .15)}><ellipse cx="-4" cy="-22" rx="22" ry="9" fill="none" stroke="${WS}" stroke-width="4"/></g><line x1="26" y1="0" x2="48" y2="8" stroke="${WS}" stroke-width="4" stroke-linecap="round"/>${[-14, 0, 14].map(x => `<line x1="${x}" y1="8" x2="${x - 6}" y2="30" stroke="${WS}" stroke-width="4" stroke-linecap="round"/>`).join('')}`, 'anopheles'),
  pcard(510, 460, EC[4], 'HOUSEFLY', 'carries DIARRHOEAL diseases', `<ellipse rx="20" ry="14" fill="${WS}"/><circle cx="22" cy="-4" r="9" fill="${WS}"/><g ${an('wobble', .12)}><ellipse cx="-6" cy="-24" rx="18" ry="10" fill="none" stroke="${WS}" stroke-width="4"/></g>`, 'housefly'),
  pcard(510, 660, EC[5], 'RAT', 'spreads PLAGUE, leptospirosis', `<ellipse rx="30" ry="18" fill="${WS}"/><circle cx="32" cy="-4" r="13" fill="${WS}"/><g ${an('wobble', .5, 0, 'left')}><path d="M-30 4 q-24 10 -34 -6 q-8 -14 -26 -4" fill="none" stroke="${WS}" stroke-width="5" stroke-linecap="round"/></g>`, 'rat'),
  { id: 'tip', w: 'cockroaches', t: 1, svg: `<rect x="20" y="890" width="960" height="150" rx="20" fill="#fff" stroke="${THEME.accent2}" stroke-width="6"/>${T(500, 944, 'ALSO PESTS OF PUBLIC HEALTH IMPORTANCE', 32, THEME.accent2)}${T(500, 992, 'cockroaches · fleas · lice · ticks · tsetse flies', 30, THEME.ink, 'middle', GEO, 'font-weight="bold"')}` },
  { id: 'six', w: 'rat', t: 1, svg: `<g ${an('pulse', 1.2)}>${T(500, 1130, '3 PARASITES + 3 PESTS = 6 MARKS', 44, THEME.accent)}</g>` }
]})));

// ── Q9 DISEASE TRENDS ────────────────────────────────────────────
const N9 = "Question nine. How do you monitor disease trends at a health facility? First, record every case daily in the outpatient register and tally sheets. Second, compile the weekly and monthly reports, like the weekly disease surveillance report, and send them to the district. Third, plot the numbers on graphs, such as a line graph or epidemic curve. Fourth, compare with previous weeks and years, and with alert and action thresholds, to spot unusual rises. Fifth, share feedback, investigate rises early, and act.";
const CASES = [12, 10, 14, 13, 18, 26, 41, 63], cx9 = i => 140 + i * 110, cy9 = v => 790 - v * 8;
ES.push(qaScene({ badge: 'Q9  DISEASE TRENDS', N: N9, q: ['How do you monitor disease trends at a', 'health facility?'], marks: 5, boxY: 880, rowH: 82,
 vis: [
  G('chart', 'plot', 0, 0, `<rect x="90" y="190" width="840" height="640" rx="16" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/><line x1="110" y1="800" x2="910" y2="800" stroke="${THEME.ink}" stroke-width="5"/><line x1="110" y1="800" x2="110" y2="220" stroke="${THEME.ink}" stroke-width="5"/>${CASES.map((v, i) => T(cx9(i), 836, 'W' + (i + 1), 24)).join('')}${T(500, 238, 'WEEKLY CASES', 30, THEME.accent2)}<line x1="110" y1="${cy9(30)}" x2="910" y2="${cy9(30)}" stroke="#c0392b" stroke-width="5" stroke-dasharray="14 10"/>${T(900, cy9(30) - 12, 'ACTION THRESHOLD', 22, '#c0392b', 'end')}${dr('M' + CASES.map((v, i) => `${cx9(i)} ${cy9(v)}`).join(' L'), 0, 3.2, 7, THEME.accent)}${CASES.map((v, i) => `<g ${an('grow', .4, .3 + i * .4, 'center')}><circle cx="${cx9(i)}" cy="${cy9(v)}" r="11" fill="${v > 30 ? '#c0392b' : THEME.accent2}" stroke="${THEME.ink}" stroke-width="3"/></g>`).join('')}`),
  G('alert', 'unusual', 760, 300, `<g ${an('blink', .7)}><rect x="-110" y="-34" width="220" height="68" rx="34" fill="#c0392b" stroke="${THEME.ink}" stroke-width="6"/>${T(0, 14, 'ALERT!', 40, '#fff')}</g>`)],
 items: [[['Record every case daily: OPD register + tally sheets'], 'record'], [['Compile weekly + monthly reports (e.g. weekly', 'surveillance report) and send to the district'], 'compile'], [['Plot the numbers: line graph or epidemic curve'], 'plot'], [['Compare with past weeks/years + alert and action', 'thresholds to spot unusual rises'], 'compare'], [['Share feedback, investigate early, and act'], 'feedback']] }));

// ── Q10 WASHM ────────────────────────────────────────────────────
// NOTE: WASHM is expanded here as WASH + Management ("Water, Sanitation and Hygiene Management").
// This expansion could not be confirmed from a source; confirm it with your department/lecturer.
const N10 = "Question ten. What does WASHM stand for? WASHM stands for Water, Sanitation and Hygiene Management. Water: a safe, adequate supply. Sanitation: safe disposal of human waste and a clean environment. Hygiene: practices such as handwashing that prevent disease. And management: planning, monitoring and maintaining these services, with communities and local authorities, so they last.";
const wt = (i, letter, word, w, icon) => ({ id: 'wt' + i, w, t: 1, svg: `<g transform="translate(${140 + i * 240} 440)"><g ${an('grow', .6, 0, 'center')}><rect x="-110" y="-190" width="220" height="380" rx="24" fill="#fff" stroke="${EC[i]}" stroke-width="8"/><rect x="-110" y="-190" width="220" height="120" rx="24" fill="${EC[i]}"/><rect x="-110" y="-110" width="220" height="40" fill="${EC[i]}"/>${T(0, -92, letter, 110, '#fff')}<g transform="translate(0 20)">${icon}</g>${T(0, 150, word, 28, EC[i])}</g></g>` });
ES.push(qaScene({ badge: 'Q10  WASHM', col: THEME.accent2, N: N10, q: ['What does WASHM stand for?'], marks: 5, boxY: 700, rowH: 90,
 vis: [
  G('hd', 'washm', 500, 220, `<g ${an('pulse', 1.2)}>${T(0, 0, 'WASH + M = WASHM', 62, THEME.accent)}</g>`),
  wt(0, 'W', 'WATER', 'water', `<g ${an('bob', 1)}><path d="M0 -50 Q38 6 0 40 Q-38 6 0 -50Z" fill="#4aa3e8" stroke="${THEME.ink}" stroke-width="6"/></g>`),
  wt(1, 'S', 'SANITATION', 'sanitation', `<rect x="-34" y="-40" width="68" height="30" rx="6" fill="#eee" stroke="${THEME.ink}" stroke-width="5"/><path d="M-40 -10 H40 Q40 40 0 46 Q-40 40 -40 -10Z" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/>${[0, 1].map(i => drop(0, 10, i * .6, 40)).join('')}`),
  wt(2, 'H', 'HYGIENE', 'hygiene', `<rect x="-44" y="-4" width="88" height="40" rx="10" fill="#f3c9a5" stroke="${THEME.ink}" stroke-width="5"/>${[0, 1, 2].map(i => puff(-24 + i * 24, -10, 10, i * .5, -60, 1.8, 'rgba(120,190,255,.8)')).join('')}`),
  wt(3, 'M', 'MANAGEMENT', 'management', `<g ${an('spin', 5)}><circle r="30" fill="none" stroke="${THEME.ink}" stroke-width="10"/>${[0, 45, 90, 135].map(a => `<line x1="0" y1="-46" x2="0" y2="46" stroke="${THEME.ink}" stroke-width="10" transform="rotate(${a})"/>`).join('')}</g>`)],
 items: [[['WATER: a safe, adequate supply'], 'safe'], [['SANITATION: safe disposal of human waste,', 'a clean environment'], 'disposal'], [['HYGIENE: practices such as handwashing'], 'handwashing'], [['MANAGEMENT: planning, monitoring, maintaining', 'the services with communities + councils'], 'planning']],
 tip: { w: 'last', y: 1130, a: 'CHECK THIS ONE', b: 'WASHM = WASH + M (confirm the expansion locally)' } }));

// ── Q11 WATER SUPPLY MONITORING ──────────────────────────────────
const N11 = "Question eleven. How do you monitor water supply facilities in a ward? First, keep a register of every water point, boreholes, wells, springs and piped schemes, and map them. Second, inspect them regularly using a sanitary inspection checklist: check the pump, the apron, drainage, fencing, and nearby latrines or animal pens. Third, check that they are working and that people can get enough water. Fourth, work with water point committees to repair breakdowns quickly, and report major faults to the district. Fifth, record findings and give health education on keeping the source clean.";
ES.push(qaScene({ badge: 'Q11  WATER SUPPLY', col: THEME.accent2, N: N11, q: ['How do you monitor water supply', 'facilities in a ward?'], marks: 5, boxY: 900, rowH: 84,
 vis: [
  G('bh', 'water', 230, 720, `<rect x="-150" y="-20" width="300" height="22" rx="6" fill="#9aa0a8" stroke="${THEME.ink}" stroke-width="5"/><rect x="-14" y="-190" width="28" height="170" fill="#2d5fb5" stroke="${THEME.ink}" stroke-width="5"/><g ${an('rot', 1.2, 0, [0, -170], '--r0:-18deg;--r1:14deg;')}><line x1="-110" y1="-170" x2="16" y2="-170" stroke="${THEME.ink}" stroke-width="12" stroke-linecap="round"/></g><path d="M14 -140 H70 V-120" fill="none" stroke="#2d5fb5" stroke-width="12"/>${[0, .4, .8].map(d => drop(70, -118, d, 100)).join('')}<rect x="52" y="-40" width="40" height="38" fill="#c9ced6" stroke="${THEME.ink}" stroke-width="4"/>${[-170, 170].map(x => `<line x1="${x}" y1="-80" x2="${x}" y2="0" stroke="#6b4423" stroke-width="8"/>`).join('')}<line x1="-170" y1="-60" x2="170" y2="-60" stroke="#6b4423" stroke-width="4"/>${T(0, -230, 'BOREHOLE', 32)}`),
  G('chk', 'checklist', 720, 400, `<rect x="-210" y="-170" width="420" height="340" rx="18" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/>${T(0, -122, 'SANITARY INSPECTION', 28, THEME.accent2)}${[['Pump works', 1], ['Apron + drainage clean', 1], ['Fence in place', 1], ['Latrine / animals near', 0]].map(([t, ok], i) => `${T(-170, -50 + i * 60, t, 26, THEME.ink, 'start', GEO, 'font-weight="bold"')}<g ${an('blink', 1.2, i * .3)}>${ok ? `<path d="M140 ${-62 + i * 60} l14 14 l28 -30" fill="none" stroke="${THEME.accent2}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>` : `<path d="M140 ${-72 + i * 60} l36 36 M176 ${-72 + i * 60} l-36 36" stroke="#c0392b" stroke-width="9" stroke-linecap="round"/>`}</g>`).join('')}`),
  G('comm', 'committees', 720, 720, `${[-110, 0, 110].map((x, i) => `<g ${an('bob', .9, i * .3)}>${person(x, -80, EC[i], 1.1)}</g>`).join('')}<g ${an('wobble', .6)}><rect x="140" y="-40" width="60" height="14" rx="6" fill="#8a929b" stroke="${THEME.ink}" stroke-width="4" transform="rotate(-30 170 -33)"/></g>${T(0, 40, 'WATER POINT COMMITTEE REPAIRS', 26, THEME.accent2)}`)],
 items: [[['Keep a register of every water point and map them'], 'register'], [['Inspect regularly with a sanitary inspection checklist', '(pump, apron, drainage, fence, latrines, animals)'], 'inspect'], [['Check they are working and people get enough water'], 'working'], [['Work with water point committees to repair; report', 'major faults to the district'], 'committees'], [['Record findings; health education on source hygiene'], 'record']] }));

// ── Q12 WATER QUALITY ────────────────────────────────────────────
const N12 = "Question twelve. How do you monitor water quality in a ward? First, do sanitary surveys of each source to find contamination risks. Second, collect samples in clean, sterile bottles, from the source and from the point of use. Third, test on site for chlorine, pH and turbidity, and send samples to the laboratory for bacteriological tests, like E coli. Fourth, compare results with national and W H O standards, for example, free chlorine of at least zero point two milligrams per litre at the tap. Fifth, act on poor results: chlorinate, protect the source, and educate users.";
ES.push(qaScene({ badge: 'Q12  WATER QUALITY', col: THEME.accent2, N: N12, q: ['How do you monitor water quality in a ward?'], marks: 5, boxY: 900, rowH: 84,
 vis: [
  G('tap', 'samples', 200, 440, `<path d="M-30 -190 H50 V-150" fill="none" stroke="#8a929b" stroke-width="18"/>${[0, .5, 1].map(d => drop(50, -146, d, 150)).join('')}<path d="M-34 0 V-50 H34 V0 Q34 90 0 90 Q-34 90 -34 0Z" transform="translate(50 60)" fill="#e9f5ff" stroke="${THEME.ink}" stroke-width="6"/><g transform="translate(50 60)"><g ${an('growy', 3, 0, 'bottom', '--n:1;')}><path d="M-28 0 V30 Q-28 82 0 82 Q28 82 28 30 V0Z" fill="#4aa3e8"/></g><rect x="-14" y="-62" width="28" height="14" fill="${THEME.accent}" stroke="${THEME.ink}" stroke-width="4"/></g>${T(50, 230, 'STERILE BOTTLE', 28)}`),
  G('tubes', 'chlorine', 700, 440, `${[['Cl', '#f7a8c4'], ['pH', '#b6e08a'], ['NTU', '#e6dcc0']].map(([t, c], i) => `<g transform="translate(${-130 + i * 130} 0)"><rect x="-26" y="-130" width="52" height="220" rx="24" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/><g ${an('pulse', 1.6, i * .4, 'bottom')}><rect x="-22" y="-20" width="44" height="106" rx="20" fill="${c}"/></g>${T(0, 130, t, 30)}</g>`).join('')}${T(0, -190, 'TEST ON SITE', 32, THEME.accent2)}`),
  G('petri', 'bacteriological', 250, 770, `<ellipse rx="130" ry="70" fill="#f1f7e6" stroke="${THEME.ink}" stroke-width="7"/><ellipse rx="130" ry="70" cy="14" fill="none" stroke="#b9c9a0" stroke-width="5"/>${[[-60, -10], [10, 10], [50, -18], [-20, 28], [80, 16]].map(([x, y], i) => `<g ${an('wobble', .6 + i * .1, i * .1)}><ellipse cx="${x}" cy="${y}" rx="14" ry="6" fill="#c0392b"/></g>`).join('')}${T(0, 120, 'LAB: E. coli TEST', 28, THEME.accent)}`),
  G('chlor', 'zero', 720, 770, `<g ${an('pulse', 1.2)}><rect x="-230" y="-60" width="460" height="120" rx="60" fill="#fff" stroke="${THEME.accent2}" stroke-width="7"/>${T(0, -6, 'FREE CHLORINE AT TAP', 28, THEME.accent2)}${T(0, 40, 'at least 0.2 mg/L', 36, THEME.ink, 'middle', GEO, 'font-weight="bold"')}</g>`)],
 items: [[['Sanitary surveys of every source (contamination risks)'], 'surveys'], [['Collect samples in sterile bottles: source + point of use'], 'samples'], [['Test on site (chlorine, pH, turbidity); lab tests', '(bacteriological, e.g. E. coli)'], 'test'], [['Compare with national + WHO standards'], 'compare'], [['Act on poor results: chlorinate, protect source, educate'], 'act']] }));

// ── Q13 PERSONAL HYGIENE ─────────────────────────────────────────
const N13 = "Question thirteen. What is personal hygiene? Personal hygiene is the set of practices a person follows to keep the body clean and healthy, and so prevent disease and stop it spreading to others. It includes bathing regularly, washing hands with soap at critical times, such as after the toilet and before eating or preparing food, brushing teeth, keeping hair and nails clean, wearing clean clothes, and managing menstrual hygiene properly.";
const hcard = (i, x, w, title, inner) => ({ id: 'hc' + i, x, y: 190, w, t: 1, svg: `<g ${an('grow', .5, 0, 'center')}><rect width="300" height="330" rx="20" fill="#fff" stroke="${EC[i]}" stroke-width="7"/><g transform="translate(150 150)">${inner}</g>${T(150, 300, title, 32, EC[i])}</g>` });
ES.push(qaScene({ badge: 'Q13  PERSONAL HYGIENE', N: N13, q: ['What is personal hygiene?'], marks: 5, boxY: 830, rowH: 86,
 vis: [
  hcard(0, 20, 'bathing', 'BATHING', `<rect x="-60" y="-110" width="100" height="16" rx="8" fill="#8a929b" stroke="${THEME.ink}" stroke-width="4"/>${[-40, -10, 20].map((x, i) => drop(x, -90, i * .3, 110)).join('')}<g transform="translate(-10 90) scale(.6)">${stickman(0, 0, [-24, -30], [24, -30], { wide: true })}</g>`),
  hcard(1, 350, 'soap', 'SOAP + WATER', `<rect x="-62" y="-6" width="124" height="60" rx="14" fill="#f3c9a5" stroke="${THEME.ink}" stroke-width="5"/>${[0, 1, 2, 3].map(i => puff(-48 + i * 32, -10, 12, i * .45, -90, 1.8, 'rgba(120,190,255,.85)')).join('')}<rect x="-24" y="-60" width="48" height="26" rx="6" fill="#fff" stroke="${THEME.accent}" stroke-width="5"/>`),
  hcard(2, 680, 'brushing', 'TEETH + BODY', `<rect x="-50" y="-30" width="100" height="70" rx="26" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/><g ${an('move', .5, 0, 'center', '--dx:30px;')}><rect x="-70" y="-84" width="80" height="16" rx="8" fill="#2d5fb5" stroke="${THEME.ink}" stroke-width="4"/><rect x="-62" y="-104" width="50" height="20" rx="4" fill="#fff" stroke="${THEME.ink}" stroke-width="3"/></g>${sparks(54, -34, 6, THEME.accent2, 20, .5)}`),
  { id: 'crit', w: 'critical', t: 1, svg: T(500, 580, 'WASH HANDS AT CRITICAL TIMES', 36, THEME.accent2) + ['AFTER THE TOILET', 'BEFORE EATING', 'BEFORE FOOD PREP'].map((t, i) => `<g transform="translate(${170 + i * 330} 670)"><g ${an('grow', .5, i * .9, 'center')}><rect x="-150" y="-48" width="300" height="96" rx="48" fill="#fff" stroke="${EC[i + 1]}" stroke-width="7"/><circle cx="-100" cy="0" r="26" fill="none" stroke="${EC[i + 1]}" stroke-width="5"/><line x1="-100" y1="0" x2="-100" y2="-16" stroke="${EC[i + 1]}" stroke-width="5" stroke-linecap="round" ${an('spin', 3, 0, [-100, 0])}/>${T(24, 9, t, 24, EC[i + 1])}</g></g>`).join('') }],
 items: [[['Practices a person follows to keep the body clean', 'and healthy, preventing disease spread'], 'practices'], [['Handwashing with soap at critical times (after toilet,', 'before eating, before preparing food)'], 'soap'], [['Bathing, clean clothes, hair + nail care, oral hygiene'], 'brushing'], [['Menstrual hygiene managed properly'], 'menstrual']] }));

// ── Q14 HYGIENE-ENABLING FACILITIES ──────────────────────────────
const N14 = "Question fourteen. State any five hygiene-enabling facilities at a health centre. One: handwashing facilities with water and soap or alcohol rub at points of care. Two: a safe, adequate water supply. Three: toilets, separate for men and women, and accessible to people with disabilities. Four: waste management facilities, such as colour-coded bins, sharps boxes, an incinerator and a placenta pit. Five: cleaning supplies and a laundry or sluice area, with showers or changing rooms for staff.";
const fcard = (i, cx, y, title, inner, w) => ({ id: 'fc' + i, x: cx - 150, y, w, t: 1, svg: `<g ${an('grow', .5, 0, 'center')}><rect width="300" height="236" rx="20" fill="#fff" stroke="${EC[i]}" stroke-width="7"/><g transform="translate(150 100)">${inner}</g>${T(150, 212, title, 28, EC[i])}</g>` });
ES.push(qaScene({ badge: 'Q14  HYGIENE FACILITIES', N: N14, q: ['State any 5 hygiene-enabling facilities', 'at a health centre'], marks: 5, boxY: 700, rowH: 84,
 vis: [
  fcard(0, 170, 190, 'HANDWASHING', `<path d="M-60 20 H60 L42 56 H-42Z" fill="#bfe6ff" stroke="${THEME.ink}" stroke-width="5"/><path d="M-10 -30 H30 V-6" fill="none" stroke="#8a929b" stroke-width="10"/>${[0, .4, .8].map(d => drop(30, -4, d, 40)).join('')}`, 'handwashing'),
  fcard(1, 500, 190, 'SAFE WATER', `<rect x="-44" y="-52" width="88" height="110" rx="10" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/><g ${an('bob', 1.2)}><path d="M-38 0 Q-19 -12 0 0 T38 0 V52 H-38Z" fill="#4aa3e8"/></g>`, 'adequate'),
  fcard(2, 830, 190, 'TOILETS M / F', `<rect x="-64" y="-52" width="128" height="104" rx="10" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/><line x1="0" y1="-52" x2="0" y2="52" stroke="${THEME.ink}" stroke-width="5"/>${T(-32, 22, 'M', 54)}${T(32, 22, 'F', 54)}`, 'toilets'),
  fcard(3, 335, 445, 'WASTE BINS', `${[['#f4b400', -50], ['#c0392b', 0], ['#333', 50]].map(([c, x], i) => `<g ${an('wobble', 1.2, i * .3, 'bottom')}><rect x="${x - 18}" y="-30" width="36" height="76" rx="6" fill="${c}" stroke="${THEME.ink}" stroke-width="4"/><rect x="${x - 22}" y="-40" width="44" height="12" rx="5" fill="${c}" stroke="${THEME.ink}" stroke-width="4"/></g>`).join('')}`, 'waste'),
  fcard(4, 665, 445, 'CLEANING', `<g ${an('rot', .8, 0, [0, -50], '--r0:-14deg;--r1:14deg;')}><line x1="0" y1="-60" x2="0" y2="34" stroke="#6b4423" stroke-width="8" stroke-linecap="round"/><path d="M-30 34 H30 L38 56 H-38Z" fill="#c9ced6" stroke="${THEME.ink}" stroke-width="5"/></g>`, 'cleaning')],
 items: [[['Handwashing facilities: water + soap or alcohol rub'], 'handwashing'], [['Safe, adequate water supply'], 'adequate'], [['Toilets: separate for men + women, accessible to all'], 'toilets'], [['Waste management: colour-coded bins, sharps boxes,', 'incinerator, placenta pit'], 'waste'], [['Cleaning supplies, laundry/sluice area, staff showers'], 'cleaning']] }));

// ── Q15 PREMISES INSPECTION ──────────────────────────────────────
const N15 = "Question fifteen. Why is it important to carry out premises inspection? To make sure owners comply with the Public Health Act and council by-laws. To find and remove health hazards before they cause disease. To prevent outbreaks and protect customers, workers and the wider community. To educate owners and staff on hygiene and give advice. To issue notices, enforce standards, and keep records, which are needed for licensing and follow-up.";
ES.push(qaScene({ badge: 'Q15  PREMISES INSPECTION', N: N15, q: ['Why is it important to carry out', 'premises inspection?'], marks: 5, boxY: 900, rowH: 84,
 vis: [
  G('shopv', 'premises', 270, 600, `${shop(0, 0, 1.45, 'FOOD SHOP', THEME.accent2).replace(/<g transform="translate\(0 0\)/, '<g transform="translate(0 0)')}`),
  G('insp', 'inspection', 90, 620, `<g ${an('move', 2.6, 0, 'center', '--dx:110px;')}>${stickman(0, 0, [-22, 12], [42, -30], { hat: true })}<rect x="30" y="-84" width="34" height="46" rx="4" fill="#fff" stroke="${THEME.ink}" stroke-width="4"/></g>`),
  G('ck', 'comply', 760, 400, `<rect x="-200" y="-190" width="400" height="360" rx="18" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/>${T(0, -144, 'INSPECTION CHECKLIST', 28, THEME.accent2)}${[['Licence displayed', 1], ['Clean kitchen', 1], ['Waste bin covered', 0], ['Handwash station', 0]].map(([t, ok], i) => `${T(-170, -70 + i * 66, t, 26, THEME.ink, 'start', GEO, 'font-weight="bold"')}<g ${an('blink', 1.2, i * .3)}>${ok ? `<path d="M130 ${-82 + i * 66} l14 14 l28 -30" fill="none" stroke="${THEME.accent2}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>` : `<path d="M130 ${-92 + i * 66} l36 36 M166 ${-92 + i * 66} l-36 36" stroke="#c0392b" stroke-width="9" stroke-linecap="round"/>`}</g>`).join('')}`),
  G('nt', 'notices', 770, 760, `<g ${an('grow', .6, 0, 'center')}><rect x="-120" y="-70" width="240" height="140" rx="8" fill="#fffbe8" stroke="${THEME.ink}" stroke-width="6" transform="rotate(-4)"/>${T(0, -10, 'NOTICE', 44, '#c0392b')}${T(0, 36, 'fix within 7 days', 26)}</g>`)],
 items: [[['Check owners comply with the Public Health Act + by-laws'], 'comply'], [['Find and remove health hazards before disease occurs'], 'hazards'], [['Prevent outbreaks; protect customers, workers, community'], 'prevent'], [['Educate owners + staff on hygiene; give advice'], 'educate'], [['Issue notices, enforce standards, keep records'], 'notices']] }));

// ── Q16 FOUR-WEEK WORK PLAN (20 marks) ───────────────────────────
const N16 = "Question sixteen, worth twenty marks: design a four-week work plan. Start with a title, objectives, and the ward situation. Week one: orientation, meet the community leaders, update the ward profile and map premises, water points and sanitation. Week two: inspect food premises, schools and clinics, and monitor water supply and quality. Week three: run health education and community outreach, follow up disease surveillance, and carry out vector control. Week four: monitor and evaluate, compile the report, review challenges, and plan the next month. Include responsible persons, resources, and indicators for each activity.";
const GR = [['Orientation + ward profile', 1, 1, 'orientation'], ['Meet community leaders', 1, 1, 'leaders'], ['Map premises + water points', 1, 1, 'map'], ['Inspect food premises + schools', 2, 2, 'inspect'], ['Monitor water supply + quality', 2, 2, 'monitor'], ['Health education + outreach', 3, 3, 'education'], ['Disease surveillance follow-up', 1, 4, 'surveillance'], ['Vector control', 3, 3, 'vector'], ['Evaluate + compile report', 4, 4, 'evaluate'], ['Review + plan next month', 4, 4, 'review']];
ES.push(qaScene({ badge: 'Q16  4-WEEK WORK PLAN', col: '#b8860b', N: N16, q: ['Design a work plan for a period of 4 weeks'], marks: 20, boxY: 1010, rowH: 100,
 vis: [
  G('hdr', 'plan', 0, 0, `<rect x="20" y="170" width="960" height="760" rx="18" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/>${['WEEK 1', 'WEEK 2', 'WEEK 3', 'WEEK 4'].map((w, i) => `<rect x="${500 + i * 120}" y="190" width="116" height="56" rx="10" fill="${EC[i]}"/>${T(558 + i * 120, 228, w, 24, '#fff')}`).join('')}${T(40, 228, 'ACTIVITY', 28, THEME.accent2, 'start')}${[0, 1, 2, 3, 4].map(i => `<line x1="${496 + i * 120}" y1="256" x2="${496 + i * 120}" y2="910" stroke="#d9d2c0" stroke-width="3"/>`).join('')}`),
  ...GR.map(([t, a, b, w], i) => ({ id: 'g' + i, w, t: 1, svg: `<g ${an('fadein', .5, 0, 'center', '--n:1;')}>${T(40, 308 + i * 62, t, 25, THEME.ink, 'start', GEO, 'font-weight="bold"')}<g ${an('growx', .8, .2, 'left')}><rect x="${504 + (a - 1) * 120}" y="${280 + i * 62}" width="${(b - a + 1) * 120 - 12}" height="36" rx="10" fill="${EC[a - 1]}" stroke="${THEME.ink}" stroke-width="3"/></g></g>` }))],
 items: [[['RESPONSIBLE persons: EHT, EHO, village health workers,', 'community leaders'], 'responsible'], [['RESOURCES: transport, forms, test kits, IEC materials'], 'resources'], [['INDICATORS: % premises inspected, water points', 'functional, outreach sessions held'], 'indicators']] }));

// ── Q17 FOOD QUALITY MONITORING ──────────────────────────────────
const N17 = "Question seventeen. In food safety monitoring, what is food quality monitoring? Give any three food-borne illnesses. Food quality monitoring is checking food, and the places where it is produced, stored, transported, prepared and sold, to make sure it is safe, wholesome and meets standards. This includes inspecting premises, checking temperatures, labels and expiry dates, examining food handlers, and sampling food for laboratory testing. Examples of food-borne illnesses: typhoid fever, cholera, and salmonellosis. Dysentery and hepatitis A are others.";
const CHAIN = [['PRODUCE', 'produced', `<path d="M0 22 Q-24 -6 0 -30 Q24 -6 0 22Z" fill="#fff"/>`], ['STORE', 'stored', `<rect x="-18" y="-28" width="36" height="52" rx="4" fill="#fff"/><line x1="-18" y1="-6" x2="18" y2="-6" stroke="${EC[0]}" stroke-width="4"/>`], ['TRANSPORT', 'transported', `<rect x="-28" y="-14" width="34" height="26" fill="#fff"/><rect x="6" y="-4" width="22" height="16" fill="#fff"/><circle cx="-14" cy="16" r="6" fill="#fff"/><circle cx="18" cy="16" r="6" fill="#fff"/>`], ['PREPARE', 'prepared', `<path d="M-24 -6 H24 V14 Q24 24 14 24 H-14 Q-24 24 -24 14Z" fill="#fff"/><line x1="-28" y1="-6" x2="28" y2="-6" stroke="#fff" stroke-width="5"/>`], ['SELL', 'sold', `<circle r="24" fill="#fff"/><text x="0" y="12" font-size="34" text-anchor="middle" font-family="Impact,sans-serif" fill="${EC[4]}">$</text>`]];
ES.push(qaScene({ badge: 'Q17  FOOD QUALITY', col: THEME.accent2, N: N17, q: ['What is food quality monitoring? Give any 3', 'food-borne illnesses.'], marks: 3, boxY: 880, rowH: 96,
 vis: [
  ...CHAIN.map(([t, w, ic], i) => ({ id: 'c' + i, w, t: 1, svg: `<g transform="translate(${110 + i * 195} 290)"><g ${an('grow', .5, 0, 'center')}><circle r="62" fill="${EC[i]}" stroke="${THEME.ink}" stroke-width="7"/>${ic}${T(0, 104, t, 24, THEME.ink)}</g></g>${i < 4 ? `<line x1="${180 + i * 195}" y1="290" x2="${236 + i * 195}" y2="290" stroke="${THEME.ink}" stroke-width="7" stroke-linecap="round" ${an('flow dash', .8)}/>` : ''}` })),
  G('mag', 'inspecting', 110, 470, `<g ${an('move', 4, 0, 'center', '--dx:780px;')}><circle r="40" fill="rgba(255,255,255,.55)" stroke="${THEME.ink}" stroke-width="8"/><line x1="28" y1="28" x2="62" y2="62" stroke="${THEME.ink}" stroke-width="12" stroke-linecap="round"/></g>`),
  G('th', 'temperatures', 160, 700, `<rect x="-14" y="-110" width="28" height="170" rx="14" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/><circle cx="0" cy="66" r="26" fill="#c0392b" stroke="${THEME.ink}" stroke-width="6"/><g ${an('growy', 2, 0, 'bottom', '--n:1;')}><rect x="-7" y="-70" width="14" height="130" fill="#c0392b"/></g>${T(150, -30, 'COLD &lt; 5°C', 30, '#2d5fb5', 'start')}${T(150, 24, 'HOT &gt; 60°C', 30, '#c0392b', 'start')}`),
  ...['TYPHOID', 'CHOLERA', 'SALMONELLOSIS'].map((t, i) => ({ id: 'il' + i, w: ['typhoid', 'cholera', 'salmonellosis'][i], t: 1, svg: `<g transform="translate(${500 + (i === 0 ? 0 : 0)} 0)"></g><g transform="translate(${i === 0 ? 650 : i === 1 ? 650 : 650} ${640 + i * 76})"><g ${an('grow', .5, 0, 'center')}><rect x="-180" y="-30" width="360" height="60" rx="30" fill="#fff" stroke="${EC[i + 2]}" stroke-width="6"/>${T(0, 11, t, 30, EC[i + 2])}</g></g>` }))],
 items: [[['Checking food + places where it is produced, stored,', 'transported, prepared + sold: safe and to standard'], 'checking'], [['Inspect premises; check temperatures, labels, expiry', 'dates; examine food handlers; sample for lab tests'], 'inspecting'], [['Food-borne illnesses: typhoid, cholera, salmonellosis', '(also dysentery, hepatitis A)'], 'typhoid']] }));

// ── Q18 MEAT INSPECTION ──────────────────────────────────────────
const N18 = "Question eighteen. What is the importance of carrying out meat inspection? To make sure meat is safe and wholesome, and free from disease. To detect zoonotic diseases such as anthrax, tuberculosis, cysticercosis and brucellosis before they reach people. To check slaughter hygiene and condemn unfit meat. To support animal disease surveillance and control. And to protect consumers and the meat trade, through proper certification and stamping.";
ES.push(qaScene({ badge: 'Q18  MEAT INSPECTION', N: N18, q: ['What is the importance of carrying out', 'meat inspection?'], marks: 5, boxY: 860, rowH: 84,
 vis: [
  G('rail', 'meat', 280, 220, `<line x1="-260" y1="0" x2="260" y2="0" stroke="${THEME.ink}" stroke-width="10"/><g ${an('wobble', 2.2, 0, 'top')}><line x1="0" y1="0" x2="0" y2="50" stroke="${THEME.ink}" stroke-width="7"/><path d="M-60 60 Q-70 140 -40 220 Q0 250 40 220 Q70 140 60 60 Q0 40 -60 60Z" fill="#c0392b" stroke="${THEME.ink}" stroke-width="7"/>${[[-20, 100, 20, 120], [-10, 150, 30, 170], [-26, 190, 10, 200]].map(([a, b, c, d]) => `<path d="M${a} ${b} L${c} ${d}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".75"/>`).join('')}</g>${T(0, 300, 'MEAT INSPECTION', 30)}`),
  G('stamp', 'certification', 760, 400, `<g ${an('grow', .6, 0, 'center')}><g transform="rotate(-10)"><circle r="130" fill="none" stroke="#2c6b5a" stroke-width="10"/><circle r="108" fill="none" stroke="#2c6b5a" stroke-width="4"/>${T(0, 18, 'PASSED', 66, '#2c6b5a')}${T(0, -48, 'FIT FOR', 28, '#2c6b5a')}${T(0, 66, 'CONSUMPTION', 28, '#2c6b5a')}</g></g>`),
  ...['ANTHRAX', 'TB', 'CYSTICERCOSIS', 'BRUCELLOSIS'].map((t, i) => ({ id: 'z' + i, w: i === 0 ? 'zoonotic' : ['', 'tuberculosis', 'cysticercosis', 'brucellosis'][i], t: 1, svg: `<g transform="translate(${135 + i * 243} 700)"><g ${an('grow', .5, 0, 'center')}><rect x="-115" y="-34" width="230" height="68" rx="34" fill="#fff" stroke="${EC[i]}" stroke-width="6"/>${T(0, 10, t, 25, EC[i])}</g></g>` })),
  { id: 'zt', w: 'zoonotic', t: 1, svg: T(500, 650, 'ZOONOTIC DISEASES TO CATCH', 30, THEME.accent) }],
 items: [[['Make sure meat is safe + wholesome, free from disease'], 'safe'], [['Detect zoonoses (anthrax, TB, cysticercosis,', 'brucellosis) before they reach people'], 'zoonotic'], [['Check slaughter hygiene; condemn unfit meat'], 'hygiene'], [['Support animal disease surveillance + control'], 'surveillance'], [['Protect consumers + meat trade: certification, stamping'], 'certification']] }));

// ── Q19 ORGANOGRAM ───────────────────────────────────────────────
// Typical district-level structure; confirm exact titles with your province.
const N19 = "Question nineteen. Draw the organogram of environmental health at district level. At the top is the Provincial Medical Director, who oversees the province. Below is the District Medical Officer, who heads health services in the district. The District Environmental Health Officer reports to the D M O, and leads the environmental health team. Under the D E H O are the Environmental Health Officers, then the Environmental Health Technicians at ward and facility level. At community level are health assistants, village health workers and community groups.";
const obox = (x, y, w, t, c, size = 28) => `<g transform="translate(${x} ${y})"><g ${an('grow', .5, 0, 'center')}><rect x="${-w / 2}" y="-40" width="${w}" height="80" rx="16" fill="${c}" stroke="${THEME.ink}" stroke-width="6"/>${T(0, size * .36, t, size, '#fff')}</g></g>`;
ES.push(scene(THEME.paper, N19, comicScene({ badge: 'Q19  ORGANOGRAM', badgeColor: THEME.accent2, groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Draw the organogram of environmental', 'health at district level'], 5) },
  { id: 'l1', w: 'provincial', t: 1, svg: obox(500, 250, 600, 'PROVINCIAL MEDICAL DIRECTOR', EC[0]) },
  { id: 'l2', w: 'heads', t: 1, svg: dr('M500 290 V350', 0, .6, 6, THEME.ink) + obox(500, 390, 600, 'DISTRICT MEDICAL OFFICER (DMO)', EC[2]) },
  { id: 'l3', w: 'reports', t: 1, svg: dr('M500 430 V490', 0, .6, 6, THEME.ink) + obox(500, 530, 600, 'DISTRICT ENV. HEALTH OFFICER', EC[1]) },
  { id: 'l4', w: 'under', t: 1, svg: dr('M500 570 V630', 0, .6, 6, THEME.ink) + obox(500, 670, 600, 'ENVIRONMENTAL HEALTH OFFICERS', EC[3]) },
  { id: 'l5', w: 'technicians', t: 1, svg: dr('M500 710 V765 M190 765 H810 M190 765 V810 M500 765 V810 M810 765 V810', 0, 1.2, 6, THEME.ink) + obox(190, 850, 300, 'EHT: WARD 1', EC[4], 26) + obox(500, 850, 300, 'EHT: WARD 2', EC[4], 26) + obox(810, 850, 300, 'EHT: FACILITY', EC[4], 26) },
  { id: 'l6', w: 'community', t: 1, svg: dr('M500 890 V945 M190 945 H810 M190 945 V990 M500 945 V990 M810 945 V990', 0, 1.2, 6, THEME.ink) + obox(190, 1030, 300, 'HEALTH ASSISTANTS', EC[5], 24) + obox(500, 1030, 300, 'VILLAGE HEALTH WORKERS', EC[5], 22) + obox(810, 1030, 300, 'COMMUNITY GROUPS', EC[5], 24) },
  { id: 'ra', w: 'under', t: 1, svg: `<line x1="940" y1="1060" x2="940" y2="240" stroke="${THEME.accent}" stroke-width="8" stroke-linecap="round" ${an('flow dash', 1.2)}/><polygon points="940,200 916,246 964,246" fill="${THEME.accent}"/>${T(968, 700, 'REPORTS UP', 24, THEME.accent, 'middle', FI, `transform="rotate(90 968 700)"`)}` },
  { id: 'nt', w: 'groups', t: 1, svg: `<rect x="20" y="1130" width="960" height="110" rx="20" fill="#fff" stroke="${THEME.accent2}" stroke-width="6"/>${T(500, 1180, 'TYPICAL STRUCTURE', 34, THEME.accent2)}${T(500, 1220, 'confirm exact titles + reporting lines with your province', 26, THEME.ink, 'middle', GEO, 'font-weight="bold"')}` }
]})));

// ── Q20 + OUTRO ──────────────────────────────────────────────────
const N20 = "Question twenty, the last one. Explain the abbreviations E H T and E H O. E H T stands for Environmental Health Technician. E H O stands for Environmental Health Officer. That's all twenty questions. To score well in the interview, make a point, explain it, and give an example from the field. Use the right terms, link your answers to the law and your community, and practise out loud. Good luck, and subscribe for more interview practice.";
ES.push(scene(THEME.paper, N20, comicScene({ badge: 'Q20  ABBREVIATIONS', badgeColor: THEME.accent2, groups: [
  { id: 'q', y: 10, t: .1, svg: qcard(['Explain the abbreviations: EHT, EHO'], 2) },
  { id: 'ta', x: 270, y: 330, w: 'environmental', t: 1, svg: `<g ${an('grow', .6, 0, 'center')}><rect x="-240" y="-120" width="480" height="260" rx="24" fill="#fff" stroke="${EC[1]}" stroke-width="8"/><rect x="-240" y="-120" width="480" height="120" rx="24" fill="${EC[1]}"/><rect x="-240" y="-40" width="480" height="40" fill="${EC[1]}"/>${T(0, -22, 'EHT', 100, '#fff')}${T(0, 52, 'ENVIRONMENTAL', 34, EC[1])}${T(0, 96, 'HEALTH TECHNICIAN', 34, EC[1])}</g>` },
  { id: 'tb', x: 730, y: 330, w: 'officer', t: 1, svg: `<g ${an('grow', .6, 0, 'center')}><rect x="-240" y="-120" width="480" height="260" rx="24" fill="#fff" stroke="${EC[2]}" stroke-width="8"/><rect x="-240" y="-120" width="480" height="120" rx="24" fill="${EC[2]}"/><rect x="-240" y="-40" width="480" height="40" fill="${EC[2]}"/>${T(0, -22, 'EHO', 100, '#fff')}${T(0, 52, 'ENVIRONMENTAL', 34, EC[2])}${T(0, 96, 'HEALTH OFFICER', 34, EC[2])}</g>` },
  { id: 'pee', w: 'point', t: 1, svg: T(500, 600, 'INTERVIEW TECHNIQUE', 40, THEME.accent) + ['POINT', 'EXPLAIN', 'EXAMPLE'].map((c, i) => `<g transform="translate(${170 + i * 330} 710)"><g ${an('grow', .5, i * 1.6, 'center')}><rect x="-150" y="-56" width="300" height="112" rx="24" fill="${EC[i]}" stroke="${THEME.ink}" stroke-width="7"/>${T(0, 16, c, 48, '#fff')}</g></g>`).join('') },
  { id: 'terms', w: 'terms', t: 1, svg: ['NOTIFIABLE', 'ISOLATION', 'DMO / EHO', 'PHA CAP 15:17'].map((c, i) => `<g transform="translate(${255 + (i % 2) * 490} ${900 + Math.floor(i / 2) * 100})"><g ${an('grow', .5, i * .5, 'center')}><rect x="-225" y="-36" width="450" height="72" rx="36" fill="#fff" stroke="${EC[i + 1]}" stroke-width="7"/>${T(0, 12, c, 34, EC[i + 1])}</g></g>`).join('') + T(500, 850, 'USE THE RIGHT TERMS', 34, THEME.ink) },
  { id: 'prac', w: 'practise', t: 1, svg: `<g transform="translate(200 1370)">${stickman(0, 0, [-34, -10], [40, -40], { hat: true, wave: true, wide: true })}</g><g ${an('pulse', 1.2)}><ellipse cx="640" cy="1190" rx="280" ry="70" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/>${T(640, 1202, 'Say your answers OUT LOUD', 32, THEME.accent, 'middle', GEO, 'font-weight="bold"')}</g><polygon points="330,1240 280,1290 380,1290" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/>` },
  { id: 'sub', w: 'subscribe', t: 1, svg: `<g transform="translate(640 1350)"><g ${an('pulse', .8)}><rect x="-210" y="-48" width="420" height="96" rx="18" fill="${THEME.accent}" stroke="${THEME.ink}" stroke-width="7"/>${T(0, 20, 'SUBSCRIBE', 58, '#fff')}</g></g><g transform="translate(910 1320)"><g ${an('wobble', .5, 0, [0, -60])}><path d="M-44 20 L-44 -20 Q-44 -64 0 -64 Q44 -64 44 -20 L44 20 Z" fill="${THEME.highlight}" stroke="${THEME.ink}" stroke-width="7"/><circle cx="0" cy="34" r="12" fill="${THEME.ink}"/></g></g>` }
]})));

module.exports = {
    output: { title: 'eht-interview-past-paper-20-questions', format: 'portrait', fps: 30, crf: 23, preset: 'medium' },
    defaults: { voice: 'am_adam', speed: 1.0, transition: 'fade', transitionDuration: 0.3 },
    scenes: ES.map(retime).map((s, i) => Object.assign(s, { transition: ['fade', 'wipe-left', 'fade', 'wipe-up'][i % 4] })),
};
