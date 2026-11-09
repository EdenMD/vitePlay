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
  .eq{animation-name:eq;--e:ease-in-out}.vanish{animation-name:vanish;--n:1;--dir:normal}.cnt{animation-name:cnt;--dir:normal;--e:linear;--fm:forwards}.fadein{animation-name:fadein;--n:1;--dir:normal}
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
  @keyframes eq{0%,100%{transform:scaleY(.18)}50%{transform:scaleY(1)}}
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
// ════════════════════════════════════════════════════════════════
//  ZIMSEC O-LEVEL CHEMISTRY 4024/2  JUNE 2025  -  Questions 1-8 revision
//  Voice: am_adam, slowed to 0.85.  Style: blueprint + chalkboard, answer cards with highlighted key terms.
//  NOTE (data sheet): the paper's data sheet (p.17) prints the molar gas volume as 28 dm3 at r.t.p.
//  The video uses the value printed on the paper and shows the 24 dm3 alternative on screen (Q6b).
//  NOTE (Q7c i): the paper says "herbs"; it is almost certainly "herbicides", answered as such.
// ════════════════════════════════════════════════════════════════
const RATE = 2.2;                         // words/second at speed 0.85 (fallback timing only)
const cclean = w => w.toLowerCase().replace(/[^a-z0-9]/g, '');
const cwords = t => t.split(/\s+/).map(cclean).filter(Boolean);
const cat = (N, w) => { const i = cwords(N).indexOf(w); return i < 0 ? 0 : i / RATE; };
const cdly = (N, w, base) => Math.max(.2, +(cat(N, w) - cat(N, base)).toFixed(1));
const BL = '#dff0ff', YL = '#ffd23f', CY = '#7fe0ff', OR = '#ffb36b', GR = '#6dff9c', PK = '#ff8fb1', INKD = '#0b2447';

// ---- formula text: digits after a letter/')' = subscript, ^...; = superscript ----
function chemT(x, y, str, size = 40, fill = BL, anchor = 'middle', font = FM, extra = '') {
    const parts = []; let buf = '', i = 0;
    const flush = () => { if (buf) { parts.push([buf, 0]); buf = ''; } };
    while (i < str.length) {
        const ch = str[i];
        if (ch === '^') { flush(); let j = i + 1; while (j < str.length && str[j] !== ';') j++; parts.push([str.slice(i + 1, j), -.5]); i = j + 1; continue; }
        if (/[0-9]/.test(ch) && i > 0 && /[A-Za-z)]/.test(str[i - 1])) { flush(); let j = i; while (j < str.length && /[0-9]/.test(str[j])) j++; parts.push([str.slice(i, j), .28]); i = j; continue; }
        buf += ch; i++;
    }
    flush();
    let cur = 0, sp = '';
    parts.forEach(([t, off]) => { const dy = +(off - cur).toFixed(2); cur = off; sp += `<tspan${off ? ' font-size=".68em"' : ''}${dy ? ` dy="${dy}em"` : ''}>${t.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</tspan>`; });
    return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${fill}" font-family="${font}" font-weight="bold" xml:space="preserve" ${extra}>${sp}</text>`;
}
// ---- marker-highlighted text (**word**) ----
function parseMk(m) { const toks = []; let hl = false; m.split(/(\*\*)/).forEach(p => { if (p === '**') { hl = !hl; return; } if (!p) return; const ws = p.split(/\s+/).filter(Boolean); ws.forEach((w, k) => toks.push([w, hl, k === 0 ? (/^\s/.test(p) || !toks.length) : true])); }); return toks; }
function wrapMk(m, size, maxw, cw = .6) {
    const lines = []; let cur = [], cwid = 0;
    parseMk(m).forEach(([w, h, lead]) => { const ww = w.length * size * cw, sp = lead ? size * .3 : 0; if (cur.length && cwid + sp + ww > maxw) { lines.push(cur); cur = []; cwid = 0; lead = true; } cwid += (cur.length ? sp : 0) + ww; cur.push([w, h, lead]); });
    if (cur.length) lines.push(cur); return lines;
}
function mkText(x, y, m, size, maxw, fill = BL, hlFill = INKD, font = GEO, lh = 1.4) {
    const lines = wrapMk(m, size, maxw); let back = '', front = '';
    lines.forEach((l, i) => {
        let sb = '', sf = '';
        l.forEach(([w, h, lead], j) => { const t = w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + ((j < l.length - 1 && l[j + 1][2]) ? ' ' : '');
            sb += h ? `<tspan fill="${YL}" stroke="${YL}" stroke-width="${size * .5}" stroke-linejoin="round">${t}</tspan>` : `<tspan fill="none">${t}</tspan>`;
            sf += `<tspan fill="${h ? hlFill : fill}">${t}</tspan>`; });
        back += `<text x="${x}" y="${y + i * size * lh}" font-size="${size}" font-family="${font}" font-weight="bold" xml:space="preserve">${sb}</text>`;
        front += `<text x="${x}" y="${y + i * size * lh}" font-size="${size}" font-family="${font}" font-weight="bold" xml:space="preserve">${sf}</text>`;
    });
    return { svg: back + front, h: lines.length * size * lh };
}
// ---- question bar + answer card ----
function qb(label, lines, marks) {
    return `<rect x="20" y="4" width="960" height="${60 + lines.length * 40}" rx="16" fill="rgba(0,0,0,.38)" stroke="${BL}" stroke-width="4"/>${T(54, 66, label, 54, YL, 'start', FI)}` +
        lines.map((l, i) => T(250, 46 + i * 40, l, 27, '#fff', 'start', FM, 'font-weight="bold"')).join('') +
        `<rect x="820" y="-8" width="150" height="46" rx="23" fill="${YL}" stroke="${INKD}" stroke-width="4"/>${T(895, 25, marks + (marks === 1 ? ' MARK' : ' MARKS'), 22, INKD)}`;
}
function cAns(N, y, title, items, o = {}) {
    const w = o.w || 960, size = o.size || 30, col = o.col || YL, first = items[0][1], X0 = o.x || 20;
    const rows = items.map(([m, wd]) => { const lines = wrapMk(m, size, w - 120); return { m, wd, h: Math.max(1, lines.length) * size * 1.4 + 20 }; });
    const H = 76 + rows.reduce((a, r) => a + r.h, 0);
    let svg = `<rect x="${X0}" y="${y}" width="${w}" height="${H}" rx="18" fill="rgba(0,0,0,.42)" stroke="${col}" stroke-width="5"/>${T(X0 + 32, y + 46, title, o.tsize || 32, col, 'start', FI)}`;
    let yy = y + 82;
    rows.forEach((r, i) => { const d = i === 0 ? .3 : cdly(N, r.wd, first);
        svg += `<g ${an('fadein', .6, d, 'center', '--n:1;')}><circle cx="${X0 + 40}" cy="${yy - 8}" r="17" fill="${col}"/>${T(X0 + 40, yy + 2, String(i + 1), 24, INKD)}${mkText(X0 + 72, yy, r.m, size, w - 120).svg}</g>`; yy += r.h; });
    return { id: o.id || 'ans', w: first, t: 1, svg, h: H };
}
function smoothPath(pts) { let d = `M${pts[0][0]} ${pts[0][1]}`; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2; d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`; } return d; }
// ---- apparatus / drawing helpers (white line art) ----
const W5 = `stroke="${BL}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
const tubeP = (x, y, w, h) => `M${x} ${y} V${y + h - w / 2} A${w / 2} ${w / 2} 0 0 0 ${x + w} ${y + h - w / 2} V${y}`;
function tube(x, y, w, h, lvl = null, col = CY, op = .5) {
    let s = lvl !== null ? `<path d="M${x} ${lvl} H${x + w} V${y + h - w / 2} A${w / 2} ${w / 2} 0 0 1 ${x} ${y + h - w / 2} Z" fill="${col}" opacity="${op}"/>` : '';
    return s + `<path d="${tubeP(x, y, w, h)}" ${W5}/>`;
}
function beaker(x, y, w, h, lvl = null, col = CY, op = .45) {
    let s = lvl !== null ? `<rect x="${x + 2}" y="${lvl}" width="${w - 4}" height="${y + h - lvl - 2}" fill="${col}" opacity="${op}"/>` : '';
    return s + `<path d="M${x - 8} ${y - 6} L${x} ${y} V${y + h} H${x + w} V${y} L${x + w + 8} ${y - 6}" ${W5}/>`;
}
const bub = (x, y, dl = 0, dy = -120, r = 8, col = BL, d = 1.6) => `<circle ${an('rise', d, dl, 'center', `--dy:${dy}px;--sc:1.3;`)} cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="3"/>`;
const lab = (x, y, t, col = BL, size = 24, anchor = 'middle') => M(x, y, t, size, col, anchor);
const leader = (x1, y1, x2, y2, col = BL) => Ln(x1, y1, x2, y2, col, 3);
function Ln(x1, y1, x2, y2, col = BL, sw = 5, dash = '') { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`; }
function farrow(x1, y1, x2, y2, col = BL, sw = 6, flow = true) {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 20;
    return `<line x1="${x1}" y1="${y1}" x2="${x2 - Math.cos(a) * 8}" y2="${y2 - Math.sin(a) * 8}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" ${flow ? an('flow dash', 1) : ''}/>` +
        `<polygon points="${x2},${y2} ${x2 - h * Math.cos(a - .45)},${y2 - h * Math.sin(a - .45)} ${x2 - h * Math.cos(a + .45)},${y2 - h * Math.sin(a + .45)}" fill="${col}"/>`;
}
const pill = (x, y, w, txt, col = YL, size = 34, h = 70, fillTxt = INKD) => `<g transform="translate(${x} ${y})"><g ${an('grow', .5, 0, 'center')}><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${col}" stroke="${INKD}" stroke-width="4"/>${T(0, size * .36, txt, size, fillTxt)}</g></g>`;
const box = (x, y, w, h, col = BL, fill = 'rgba(0,0,0,.25)') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${col}" stroke-width="4"/>`;
function atom(cx, cy, shells, label, o = {}) {
    const r0 = o.r0 || 52, gap = o.gap || 38, col = o.col || BL, ecol = o.ecol || YL; let s = `<circle cx="${cx}" cy="${cy}" r="${o.nr || 26}" fill="rgba(255,255,255,.12)" stroke="${col}" stroke-width="4"/>${M(cx, cy + 9, label, 24, col)}`;
    shells.forEach((n, k) => { const r = r0 + k * gap; s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="2.5" stroke-dasharray="${n === 0 ? '8 8' : ''}"/>`;
        for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 - Math.PI / 2 + k * .4; s += `<circle ${an('twinkle', 1.4, (i * .12).toFixed(2))} cx="${cx + Math.cos(a) * r}" cy="${cy + Math.sin(a) * r}" r="7" fill="${ecol}"/>`; } });
    return s;
}
// graph: returns {svg, X, Y}
function graph(x0, y0, w, h, xmax, ymax, xs, ys, xl, yl) {
    const X = v => x0 + v / xmax * w, Y = v => y0 + h - v / ymax * h; let s = '';
    ys.forEach(v => { s += Ln(x0, Y(v), x0 + w, Y(v), 'rgba(223,240,255,.18)', 2) + M(x0 - 14, Y(v) + 8, String(v), 22, BL, 'end'); });
    xs.forEach(v => { s += Ln(X(v), y0, X(v), y0 + h, 'rgba(223,240,255,.18)', 2) + M(X(v), y0 + h + 32, String(v), 22, BL); });
    s += Ln(x0, y0 - 10, x0, y0 + h, BL, 5) + Ln(x0, y0 + h, x0 + w + 10, y0 + h, BL, 5) + M(x0 + w / 2, y0 + h + 76, xl, 26, YL) + `<text transform="rotate(-90 ${x0 - 66} ${y0 + h / 2})" x="${x0 - 66}" y="${y0 + h / 2}" font-size="26" text-anchor="middle" fill="${YL}" font-family="${FM}" font-weight="bold">${yl}</text>`;
    return { svg: s, X, Y };
}
// molecule drawing: atoms [[label,x,y]], bonds [[i,j,double?]]
function mol(ox, oy, atoms, bonds, o = {}) {
    const col = o.col || BL, size = o.size || 34; let s = '';
    bonds.forEach(([i, j, d]) => { const [, x1, y1] = atoms[i], [, x2, y2] = atoms[j], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, g = 24;
        const a = [ox + x1 + ux * g, oy + y1 + uy * g], b = [ox + x2 - ux * g, oy + y2 - uy * g];
        if (d) { const px = -uy * 5, py = ux * 5; s += Ln(a[0] + px, a[1] + py, b[0] + px, b[1] + py, col, 4) + Ln(a[0] - px, a[1] - py, b[0] - px, b[1] - py, col, 4); } else s += Ln(a[0], a[1], b[0], b[1], col, 4); });
    atoms.forEach(([l, x, y, c]) => { s += chemT(ox + x, oy + y + size * .34, l, size, c || col, 'middle', FM); });
    return s;
}
const scn = (bg, N, o) => { const s = scene(bg, N, comicScene({ badge: o.badge, badgeColor: o.badgeColor || YL, theme: o.theme || 'blue', groups: o.groups })); s.tts.voice = 'am_adam'; s.tts.speed = 0.85; s.tts.pauseAfter = 0.5; return s; };
const BG = { blue: '#0f3d7a', board: '#1f3d33' };
const qGroup = (label, lines, marks) => ({ id: 'q', y: 12, t: .1, svg: qb(label, lines, marks) });
function retimeC(s) {
    const words = cwords(s.tts.text), dur = words.length / RATE;
    s.layers[1].html = s.layers[1].html.replace(/wire\((\{.*?\}), (\{.*?\}), (\[.*?\]), (\[.*?\])\);/s, (m0, rmS, hmS, fbS, hfbS) => {
        const rm = JSON.parse(rmS), tShow = {};
        Object.entries(rm).forEach(([w, ids]) => { const i = words.indexOf(w); if (i >= 0) ids.forEach(id => tShow[id] = i / RATE + .4); });
        const fix = list => list.map(([id, t]) => [id, +Math.min(tShow[id] !== undefined ? tShow[id] : t, Math.max(.2, dur - 1.5)).toFixed(1)]);
        return `wire(${rmS}, ${hmS}, ${JSON.stringify(fix(JSON.parse(fbS)))}, ${hfbS});`;
    });
    return s;
}
const CS = [];
const gg = (id, w, svg, x = 0, y = 0) => ({ id, w, t: 1, x, y, svg });
const dArrow = (x, y1, y2, col) => farrow(x, (y1 + y2) / 2, x, y2, col, 6, false) + farrow(x, (y1 + y2) / 2, x, y1, col, 6, false);

// ── C0 INTRO ─────────────────────────────────────────────────────
const N0 = "ZIMSEC O-Level Chemistry, Paper 2, June 2025. In this video we will solve the first eight questions, slowly, one part at a time, so that every mark makes sense. Section A has five compulsory questions. Section B lets you choose four, and we will cover three of them. Grab your pencil, and let's begin.";
CS.push(scn(BG.blue, N0, { badge: 'ZIMSEC O-LEVEL CHEMISTRY', groups: [
  gg('card', 'chemistry', `<g ${an('float', 3)}><g transform="translate(500 330) rotate(-3)">${box(-330, -210, 660, 420, BL, 'rgba(255,255,255,.08)')}${T(0, -120, 'ZIMSEC', 64, '#fff')}${T(0, -30, 'CHEMISTRY 4024/2', 66, YL)}${M(0, 40, 'PAPER 2  ·  THEORY', 34)}${M(0, 92, 'JUNE 2025 SESSION', 34)}${M(0, 144, '2 HOURS', 34, CY)}</g></g>` +
    [['H', 110, 170], ['C', 890, 190], ['N', 90, 520], ['O', 910, 560], ['Cu', 780, 110]].map(([s, x, y], i) => `<g transform="translate(${x} ${y})"><g ${an('float', 2.4 + i * .3, i * .3)}><rect x="-44" y="-44" width="88" height="88" rx="10" fill="rgba(255,255,255,.1)" stroke="${BL}" stroke-width="4"/>${T(0, 16, s, 46, YL)}</g></g>`).join('')),
  gg('flask', 'section', `<g transform="translate(150 1010)"><path d="M-30 -120 V-50 L-92 70 Q-102 96 -76 102 H76 Q102 96 92 70 L30 -50 V-120" ${W5}/><path d="M-62 40 L62 40 L92 76 Q98 96 76 100 H-76 Q-98 96 -92 76Z" fill="${CY}" opacity=".5"/>${[-30, 0, 30].map((x, i) => bub(x, 20, i * .5, -120, 8, BL, 2)).join('')}</g>`),
  gg('secA', 'compulsory', pill(580, 800, 800, 'SECTION A:  Q1 – Q5  ALL COMPULSORY', YL, 32)),
  gg('secB', 'choose', pill(580, 900, 800, 'SECTION B:  Q6 – Q10  CHOOSE ANY 4', CY, 32)),
  gg('today', 'eight', pill(580, 1010, 800, 'TODAY:  Q1 – Q8', GR, 38)),
  gg('go', 'begin', `<g transform="translate(790 1330)">${stickman(0, 0, [-34, -8], [58, -62], { wave: true, wide: true, color: BL })}</g><g ${an('pulse', 1.6)}><ellipse cx="500" cy="1190" rx="270" ry="64" fill="#fff" stroke="${INKD}" stroke-width="5"/>${T(500, 1202, 'Let’s begin!', 40, INKD, 'middle', GEO, 'font-weight="bold"')}</g><polygon points="760,1230 700,1250 790,1280" fill="#fff" stroke="${INKD}" stroke-width="5"/>`)
]}));

// ── C1 Q1(a) SEPARATION ─────────────────────────────────────────
const N1 = "Question one, part a. Name the method used to separate each mixture. First, sand and salt solution. Sand does not dissolve in water, so it is left behind on the filter paper, while the salt solution passes through. The method is filtration. Next, ethanol and water. Both are liquids that mix completely, but they boil at different temperatures. Ethanol boils at seventy eight degrees, and water at one hundred. So we use fractional distillation. Ethanol boils off first, rises up the column, and is condensed and collected.";
CS.push(scn(BG.blue, N1, { badge: 'Q1(a)  SEPARATING MIXTURES', groups: [
  qGroup('Q1(a)', ['Name the method used to separate a mixture of', '1. sand and salt solution   2. ethanol solution and water'], 2),
  gg('filt', 'sand', `${lab(250, 330, 'SAND + SALT SOLUTION', YL, 22)}<path d="M150 360 L350 360 L275 500 V560 H225 V500 Z" ${W5}/><path d="M175 370 L325 370 L250 482Z" fill="none" stroke="${YL}" stroke-width="3" stroke-dasharray="8 6"/>${[[225, 450], [250, 462], [275, 448], [240, 440], [262, 438]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#c9a66b"/>`).join('')}${[0, .5, 1].map(d => `<circle ${an('rise', 1.4, d, 'center', '--dy:80px;--sc:.8;')} cx="250" cy="572" r="6" fill="${CY}"/>`).join('')}${beaker(170, 650, 160, 130, 720, CY, .4)}${lab(250, 830, 'SALT SOLUTION (filtrate)', CY, 20)}${leader(150, 450, 110, 470)}${lab(100, 490, 'SAND', '#c9a66b', 22, 'middle')}${lab(110, 440, 'FILTER PAPER', BL, 18, 'end').replace('text-anchor="end"', 'text-anchor="end"')}`),
  gg('fans', 'filtration', pill(250, 930, 400, '1. FILTRATION', YL, 38)),
  gg('dist', 'ethanol', `<circle cx="640" cy="800" r="82" ${W5}/><path d="M566 800 A74 74 0 0 0 714 800Z" fill="${CY}" opacity=".45"/><rect x="618" y="640" width="44" height="80" ${W5}/><rect x="606" y="520" width="68" height="130" ${W5}/>${[540, 565, 590, 615].map(y => `<path d="M610 ${y} l60 12" stroke="${BL}" stroke-width="2"/>`).join('')}<line x1="640" y1="470" x2="640" y2="560" stroke="${BL}" stroke-width="5"/><circle cx="640" cy="566" r="9" fill="#ff5a5a"/>` +
    `<path d="M674 545 L860 635" stroke="${BL}" stroke-width="22" stroke-linecap="round" opacity=".35"/><path d="M674 545 L860 635" ${W5}/><path d="M860 635 V690" ${W5}/>` +
    `${beaker(850, 700, 100, 100, 760, OR, .45)}${[0, .6].map(d => `<circle ${an('rise', 1.2, d, 'center', '--dy:40px;--sc:.8;')} cx="860" cy="650" r="6" fill="${OR}"/>`).join('')}<g transform="translate(640 905)">${flameSvg(60, 26, .14).replace('<g ', '<g ')}</g>` +
    `${[0, .5, 1, 1.5].map(d => bub(630 + (d * 12) % 20, 640, d, -100, 6, OR, 1.8)).join('')}${lab(520, 500, 'THERMOMETER', BL, 20, 'end')}${lab(560, 580, 'FRACTIONATING COLUMN', YL, 18, 'end')}${lab(800, 590, 'CONDENSER', BL, 20)}${lab(900, 840, 'ETHANOL', OR, 20)}`),
  gg('dans', 'distillation', pill(690, 1010, 640, '2. FRACTIONAL DISTILLATION', YL, 30)),
  gg('bp1', 'seventy', pill(260, 1130, 400, 'ETHANOL boils 78 °C', OR, 28, 60)),
  gg('bp2', 'hundred', pill(700, 1130, 400, 'WATER boils 100 °C', CY, 28, 60))
]}));

// ── C2 Q1(b) IONS TABLE ─────────────────────────────────────────
const N2 = "Part b. Complete the table for the nitride ion, N three minus, and the hydrogen ion, H plus. The number of protons is the atomic number, and it never changes. Nitrogen has atomic number seven, so N three minus has seven protons. The charge is three minus, so it has gained three electrons: seven plus three is ten electrons. Hydrogen has atomic number one, so one proton. H plus has lost its only electron: one minus one is zero electrons.";
CS.push(scn(BG.blue, N2, { badge: 'Q1(b)  IONS: PROTONS + ELECTRONS', groups: [
  qGroup('Q1(b)', ['Complete Table 1.1: protons and electrons in', 'the ions N^3-  and  H^+'].map(s => s.replace(/\^3-/, '³⁻').replace(/\^\+/, '⁺')), 4),
  gg('tbl', 'complete', `${box(80, 200, 840, 310, BL, 'rgba(0,0,0,.25)')}${Ln(80, 270, 920, 270, BL, 4)}${Ln(80, 390, 920, 390, BL, 4)}${Ln(350, 200, 350, 510, BL, 4)}${Ln(640, 200, 640, 510, BL, 4)}${M(215, 247, 'ion', 30, YL)}${M(495, 247, 'protons', 30, YL)}${M(780, 247, 'electrons', 30, YL)}${chemT(215, 345, 'N^3-;', 62, '#fff')}${chemT(215, 468, 'H^+;', 62, '#fff')}`),
  gg('p1', 'seven', `<g ${an('grow', .5, 0, 'center')}>${T(495, 350, '7', 72, YL)}</g>`),
  gg('e1', 'ten', `<g ${an('grow', .5, 0, 'center')}>${T(780, 350, '10', 72, GR)}</g>`),
  gg('p2', 'one', `<g ${an('grow', .5, 0, 'center')}>${T(495, 472, '1', 72, YL)}</g>`),
  gg('e2', 'zero', `<g ${an('grow', .5, 0, 'center')}>${T(780, 472, '0', 72, GR)}</g>`),
  gg('r1', 'atomic', pill(500, 600, 760, 'PROTONS = ATOMIC NUMBER (never changes)', YL, 28, 62)),
  gg('r2', 'charge', pill(500, 690, 760, 'ELECTRONS:  – charge gains,   + charge loses', CY, 28, 62)),
  gg('a1', 'nitrogen', `<g transform="translate(0 0)">${atom(290, 960, [2, 8], '7p', { r0: 62, gap: 42 })}${chemT(290, 1110, 'N^3-;', 40, '#fff')}${M(290, 1150, '7 p, 10 e', 26, GR)}</g>`),
  gg('a2', 'lost', `<g>${atom(720, 960, [0], '1p', { r0: 62 })}${chemT(720, 1110, 'H^+;', 40, '#fff')}${M(720, 1150, '1 p, 0 e', 26, GR)}</g>`)
]}));

// ── C3 Q1(c) NH3 DOT AND CROSS ─────────────────────────────────
const N3 = "Part c. Draw a dot and cross diagram for ammonia, N H three. Nitrogen has five outer electrons, shown as dots. Each hydrogen has one electron, shown as a cross. Nitrogen shares one pair with each of the three hydrogens, making three covalent bonds. That uses three of nitrogen's electrons, leaving two, which form a lone pair. Now nitrogen has eight outer electrons, and each hydrogen has two. Remember, draw only the outer shells.";
const NC = [500, 640], NR = 118, HC = [[345, 650], [655, 650], [500, 800]], HR2 = 78;
const lens = (c, rN, rH) => { const dx = c[0] - NC[0], dy = c[1] - NC[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L; const eN = [NC[0] + ux * rN, NC[1] + uy * rN], eH = [c[0] - ux * rH, c[1] - uy * rH]; return { m: [(eN[0] + eH[0]) / 2, (eN[1] + eH[1]) / 2], p: [-uy, ux] }; };
const LN = HC.map(c => lens(c, NR, HR2));
const xmark = (x, y, c = PK) => `<path d="M${x - 8} ${y - 8} L${x + 8} ${y + 8} M${x + 8} ${y - 8} L${x - 8} ${y + 8}" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
CS.push(scn(BG.blue, N3, { badge: 'Q1(c)  DOT AND CROSS: AMMONIA', groups: [
  qGroup('Q1(c)', ['Draw a dot and cross diagram to show the', 'bonding in ammonia.'], 2),
  gg('ns', 'nitrogen', `<circle cx="${NC[0]}" cy="${NC[1]}" r="${NR}" fill="rgba(127,224,255,.12)" stroke="${CY}" stroke-width="5"/>${T(NC[0], NC[1] - 28, 'N', 58, CY)}`),
  gg('nd', 'dots', LN.map(l => `<circle cx="${l.m[0] + l.p[0] * 15}" cy="${l.m[1] + l.p[1] * 15}" r="8" fill="#fff"/>`).join('') + `<circle cx="478" cy="526" r="8" fill="#fff"/><circle cx="522" cy="526" r="8" fill="#fff"/>`),
  gg('hs', 'hydrogen', HC.map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="${HR2}" fill="rgba(255,143,177,.12)" stroke="${PK}" stroke-width="5"/>`).join('') + T(285, 668, 'H', 48, PK) + T(715, 668, 'H', 48, PK) + T(500, 862, 'H', 48, PK)),
  gg('hx', 'cross', LN.map(l => xmark(l.m[0] - l.p[0] * 15, l.m[1] - l.p[1] * 15)).join('')),
  gg('sh', 'shares', LN.map(l => `<circle ${an('pulse', 1.1)} cx="${l.m[0]}" cy="${l.m[1]}" r="30" fill="none" stroke="${YL}" stroke-width="4" stroke-dasharray="6 5"/>`).join('') + lab(500, 930, '3 SHARED PAIRS = 3 COVALENT BONDS', YL, 26)),
  gg('lp', 'lone', `<g ${an('pulse', 1)}><ellipse cx="500" cy="526" rx="46" ry="24" fill="none" stroke="${GR}" stroke-width="5"/></g>${leader(546, 520, 640, 470, GR)}${lab(720, 470, 'LONE PAIR', GR, 28)}`),
  gg('ct', 'eight', pill(500, 1040, 800, 'N has 8 outer electrons   ·   each H has 2', GR, 30, 66)),
  gg('lg', 'outer', `<circle cx="300" cy="1150" r="9" fill="#fff"/>${M(330, 1158, '= electron from N', 24, BL, 'start')}${xmark(640, 1150)}${M(668, 1158, '= electron from H', 24, PK, 'start')}`)
]}));

// ── C4 Q2(a)(i) ZINC PLATE ─────────────────────────────────────
const N4 = "Question two, part a. Figure two point one shows a zinc plate placed in blue copper sulphate solution. After some time, a brown coating appears on the zinc plate, and the blue colour fades. Part i asks you to identify the brown solid. Zinc is more reactive than copper, so it pushes copper out of the solution. The brown solid is copper.";
CS.push(scn(BG.blue, N4, { badge: 'Q2(a)(i)  ZINC IN COPPER SULPHATE', groups: [
  qGroup('Q2(a)(i)', ['Fig 2.1: a zinc plate in copper sulphate solution.', 'Identify the brown solid deposited on the zinc plate.'], 1),
  gg('bk', 'zinc', `<rect x="355" y="372" width="290" height="300" fill="#2f7fd6" opacity=".75"/><g opacity=".9"><rect ${an('fadein', 9, 1, 'center', '--n:1;')} x="355" y="372" width="290" height="300" fill="#fff" opacity=".45"/></g>${beaker(350, 300, 300, 380)}<rect x="480" y="230" width="40" height="420" fill="#b9c2cc" stroke="${BL}" stroke-width="5"/>${Ln(350, 372, 650, 372, BL, 3, '10 8')}${lab(740, 262, 'ZINC PLATE', BL, 24, 'start')}${leader(530, 262, 730, 258)}${lab(670, 540, 'COPPER SULPHATE', BL, 22, 'start')}${lab(670, 570, 'SOLUTION (blue)', CY, 22, 'start')}`),
  gg('coat', 'brown', `<g ${an('growy', 5, 0, 'top', '--n:1;')}><rect x="462" y="380" width="18" height="250" fill="#b87333"/><rect x="520" y="380" width="18" height="250" fill="#b87333"/></g>${leader(538, 440, 700, 440, '#b87333')}${lab(710, 446, 'BROWN COATING', '#e3a26b', 24, 'start')}`),
  gg('rx', 'reactive', pill(500, 780, 880, 'ZINC IS MORE REACTIVE THAN COPPER', YL, 30, 64)),
  gg('push', 'pushes', `${farrow(500, 840, 500, 900, OR, 6)}${lab(500, 940, 'zinc pushes copper OUT of the solution', OR, 26)}`),
  cAns(N4, 1000, 'MODEL ANSWER', [['The brown solid is **copper** (Cu).', 'pushes']])
]}));

// ── C5 Q2(a)(ii)(iii) EQUATION + OXIDATION ────────────────────
const N5 = "Part ii. Write a balanced equation. Zinc reacts with copper sulphate to form zinc sulphate and copper. Zinc sulphate is Z n S O four. Copper sulphate is C u S O four. Count the atoms: one zinc, one copper, and one sulphate on each side. The equation is already balanced. Part iii. What type of reaction happens when zinc becomes zinc two plus ions? Zinc loses two electrons. Loss of electrons is oxidation.";
CS.push(scn(BG.blue, N5, { badge: 'Q2(a)(ii)(iii)  EQUATION + OXIDATION', groups: [
  qGroup('Q2(a)', ['(ii) Write a balanced equation for the changes.', '(iii) Type of reaction: Zn converted to Zn²⁺ ions.'], '2 + 1'),
  gg('we', 'zinc', M(500, 250, 'zinc + copper sulphate → zinc sulphate + copper', 26, CY)),
  gg('eq', 'balanced', `<g ${an('grow', .6, 0, 'center')}>${chemT(500, 340, 'Zn + CuSO4 → ZnSO4 + Cu', 60, '#fff')}${chemT(500, 396, 'Zn(s) + CuSO4(aq) → ZnSO4(aq) + Cu(s)', 32, YL)}</g>`),
  gg('cnt', 'count', `${box(250, 440, 500, 190, BL)}${M(500, 480, 'ATOMS:  LEFT  =  RIGHT', 26, YL)}${['Zn   1  =  1', 'Cu   1  =  1', 'SO4  1  =  1'].map((t, i) => `<g ${an('fadein', .5, i * 1.2 + .3, 'center', '--n:1;')}>${chemT(430, 540 + i * 36, t.replace('SO4', 'SO4'), 32, '#fff', 'middle', FM)}${T(640, 540 + i * 36, '✓', 34, GR)}</g>`).join('')}`),
  gg('ok', 'already', pill(500, 690, 520, 'BALANCED ✓', GR, 36, 64)),
  gg('half', 'loses', `${chemT(430, 800, 'Zn → Zn^2+; + 2e^-;', 54, YL)}${[0, .6].map(d => `<g transform="translate(700 ${770 + d * 20})"><g ${an('move', 1.4, d, 'center', '--dx:90px;--dir:normal;')}><circle r="10" fill="${YL}"/></g></g>`).join('')}${lab(500, 850, 'ZINC LOSES 2 ELECTRONS', OR, 26)}`),
  gg('ox', 'oxidation', pill(500, 930, 800, 'LOSS OF ELECTRONS = OXIDATION', YL, 34, 70)),
  cAns(N5, 1020, 'MODEL ANSWER', [['Zinc + copper sulphate → zinc sulphate + copper (**balanced**)', 'already'], ['Zinc → zinc ions: **oxidation** (loss of electrons)', 'oxidation']])
]}));

// ── C6 Q2(b)(i) HEATING CALCIUM CARBONATE ────────────────────
const N6 = "Part b. Figure two point two shows calcium carbonate being heated in a hard glass test tube. The gas given off is passed into limewater. Part i, describe what happens. When calcium carbonate is heated strongly, it breaks down. This is thermal decomposition. It forms calcium oxide, a white solid that stays in the tube, and carbon dioxide gas. The gas travels along the delivery tube and bubbles into the limewater, turning it milky. This is the test for carbon dioxide.";
CS.push(scn(BG.blue, N6, { badge: 'Q2(b)(i)  HEATING CALCIUM CARBONATE', groups: [
  qGroup('Q2(b)(i)', ['Fig 2.2: calcium carbonate is heated; the gas is', 'tested with limewater. Describe what happens.'], 3),
  gg('ap', 'calcium', `<path d="M170 520 L470 400 L500 460 L205 585 Q150 575 170 520Z" ${W5}/>${[[200, 535], [218, 548], [196, 556], [230, 528], [214, 520], [236, 548], [204, 570]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="rgba(255,255,255,.85)"/>`).join('')}<path d="M455 395 L490 408 L478 450 L445 436Z" fill="rgba(255,255,255,.4)" stroke="${BL}" stroke-width="4"/>` +
    `<path d="M470 420 L600 378 Q660 360 700 378 L735 400 V640" stroke="${BL}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M470 420 L600 378 Q660 360 700 378 L735 400 V640" stroke="#0f3d7a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `${tube(690, 430, 90, 300, 520, CY, .3)}${lab(190, 468, 'CALCIUM CARBONATE', YL, 20, 'middle')}${lab(330, 340, 'HARD GLASS TEST TUBE', BL, 20, 'middle')}${leader(330, 352, 330, 430)}${lab(735, 778, 'LIMEWATER', CY, 22)}`),
  gg('fl', 'heated', `<g transform="translate(190 700) scale(1 -1)">${flameSvg(80, 30, .14)}</g>${lab(190, 750, 'HEAT', OR, 26)}`),
  gg('gas', 'gas', `${[0, .6, 1.2].map(d => `<circle ${an('drift', 2.6, d, 'center', '--dx:190px;--dir:normal;--e:linear;')} cx="500" cy="410" r="6" fill="${CY}"/>`).join('')}${lab(640, 330, 'CO2 GAS', CY, 24)}`),
  gg('dc', 'decomposition', pill(500, 830, 700, 'THERMAL DECOMPOSITION', YL, 32, 62)),
  gg('mk', 'bubbles', `<g opacity=".75"><rect ${an('fadein', 6, 1, 'center', '--n:1;')} x="693" y="522" width="84" height="206" fill="#fff"/></g>${[0, .4, .8, 1.2].map(d => bub(735 + (d * 10) % 14 - 7, 640, d, -110, 7, '#fff', 1.6)).join('')}`),
  gg('eqn', 'oxide', `<g ${an('grow', .6, 0, 'center')}>${chemT(500, 920, 'CaCO3 → CaO + CO2', 54, '#fff')}</g>`),
  cAns(N6, 980, 'MODEL ANSWER', [['Calcium carbonate **breaks down** on heating (**thermal decomposition**)', 'heated'], ['Forms **calcium oxide** (white solid left) and **carbon dioxide** gas', 'oxide'], ['The gas turns **limewater milky**', 'milky']])
]}));

// ── C7 Q2(b)(ii) BASIC ─────────────────────────────────────────
const N7 = "Part ii. State the acid base nature of the product that remains in the test tube. The product left behind is calcium oxide. Calcium oxide is a metal oxide. Metal oxides are basic. They react with acids to form a salt and water. If you add water, calcium oxide forms calcium hydroxide, an alkali. So the answer is: basic.";
CS.push(scn(BG.blue, N7, { badge: 'Q2(b)(ii)  ACID OR BASE?', groups: [
  qGroup('Q2(b)(ii)', ['State the acid / base nature of the product', 'that remains in the hard glass test tube.'], 1),
  gg('ph', 'product', `<defs><linearGradient id="phg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e63946"/><stop offset=".25" stop-color="#ff9d4d"/><stop offset=".45" stop-color="#ffe14d"/><stop offset=".5" stop-color="#6dff9c"/><stop offset=".7" stop-color="#4aa3e8"/><stop offset="1" stop-color="#7b3fa0"/></linearGradient></defs><rect x="100" y="330" width="800" height="70" rx="12" fill="url(#phg)" stroke="${BL}" stroke-width="5"/>${Array.from({ length: 15 }, (_, i) => M(100 + i * 800 / 14, 440, String(i), 22)).join('')}${M(210, 300, 'ACID', 28, '#ff9d9d')}${M(500, 300, 'NEUTRAL', 28, GR)}${M(790, 300, 'ALKALI', 28, '#b9a0ff')}`),
  gg('mk', 'alkali', `<g transform="translate(786 470)"><g ${an('moveonce', 1.6, 0, 'center', '--dy:-60px;')}><polygon points="0,0 -20,-34 20,-34" fill="${YL}" stroke="${INKD}" stroke-width="3"/></g></g>${lab(786, 520, 'Ca(OH)2 solution ≈ pH 12', YL, 22)}`),
  gg('rule', 'metal', pill(500, 620, 760, 'METAL OXIDE  →  BASIC', CY, 34, 68)),
  gg('salt', 'salt', pill(500, 710, 760, 'BASE + ACID  →  SALT + WATER', OR, 30, 64)),
  gg('eq', 'hydroxide', `<g ${an('grow', .6, 0, 'center')}>${chemT(500, 820, 'CaO + H2O → Ca(OH)2', 54, '#fff')}</g>`),
  gg('ans', 'answer', pill(500, 930, 520, 'BASIC', YL, 52, 90))
]}));

// ── C8 Q3(a) REDUCTION ─────────────────────────────────────────
const N8 = "Question three, part a. Define reduction in terms of electron transfer, and in terms of oxidation number. Remember the memory trick: oil rig. Oxidation Is Loss, Reduction Is Gain of electrons. So reduction is the gain of electrons. In terms of oxidation number, reduction is a decrease in oxidation number. For example, copper two plus gains two electrons and becomes copper. Its oxidation number goes down, from plus two to zero.";
CS.push(scn(BG.blue, N8, { badge: 'Q3(a)  DEFINE REDUCTION', groups: [
  qGroup('Q3(a)', ['Define reduction in terms of', '1. electron transfer   2. oxidation number'], 2),
  gg('oil', 'oil', `${box(60, 200, 410, 150, YL)}${T(265, 270, 'OIL', 70, YL)}${M(265, 320, 'Oxidation Is Loss', 26, '#fff')}${box(530, 200, 410, 150, CY)}${T(735, 270, 'RIG', 70, CY)}${M(735, 320, 'Reduction Is Gain', 26, '#fff')}`),
  gg('cu', 'copper', `<circle cx="270" cy="520" r="64" fill="rgba(127,224,255,.15)" stroke="${CY}" stroke-width="5"/>${chemT(270, 535, 'Cu^2+;', 38, CY)}${[[110, 440], [110, 600]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><g ${an('move', 1.6, i * .5, 'center', `--dx:100px;--dy:${i ? -60 : 60}px;`)}><circle r="11" fill="${YL}"/></g></g>`).join('')}${M(110, 500, 'e⁻', 28, YL)}${farrow(360, 520, 540, 520, OR, 7)}<circle cx="700" cy="520" r="64" fill="rgba(255,179,107,.18)" stroke="${OR}" stroke-width="5"/>${T(700, 536, 'Cu', 44, OR)}${chemT(500, 650, 'Cu^2+; + 2e^- → Cu', 48, '#fff')}`),
  gg('num', 'decrease', `${Ln(150, 800, 850, 800, BL, 5)}${[[250, '-2'], [400, '0'], [550, '+1'], [700, '+2']].map(([x, t]) => Ln(x, 788, x, 812, BL, 4) + M(x, 850, t, 26, BL)).join('')}<g transform="translate(700 760)"><g ${an('moveonce', 2, .4, 'center', '--dx:-300px;--e:ease-in-out;')}><circle r="16" fill="${YL}"/></g></g>${M(550, 730, 'DECREASE  =  REDUCTION', 28, YL)}`),
  cAns(N8, 920, 'MODEL ANSWER', [['Reduction is the **gain of electrons**', 'gain'], ['Reduction is a **decrease in oxidation number**', 'decrease']])
]}));

// ── C9 Q3(b) ENERGY PROFILE ───────────────────────────────────
const N9 = "Part b. Figure three point one is an energy profile for converting A to B. Part i: name the type of energy shown by x and by y. The arrow x goes from the reactants up to the top of the hill. That is the activation energy, the minimum energy needed to start the reaction. The arrow y goes from A down to B. That is the energy change of the reaction, the enthalpy change. Part ii: is it endothermic or exothermic? The products are lower in energy than the reactants, so energy is released to the surroundings. The reaction is exothermic.";
CS.push(scn(BG.blue, N9, { badge: 'Q3(b)  ENERGY PROFILE', groups: [
  qGroup('Q3(b)', ['(i) Name the type of energy represented by x and y.', '(ii) Endothermic or exothermic? Give a reason.'], '2 + 2'),
  gg('ax', 'profile', `${Ln(150, 250, 150, 780, BL, 5)}${Ln(150, 780, 880, 780, BL, 5)}<text transform="rotate(-90 100 515)" x="100" y="515" font-size="26" text-anchor="middle" fill="${YL}" font-family="${FM}" font-weight="bold">Energy / kJ</text>${M(520, 830, 'Progress of reaction', 26, YL)}${dr('M170 520 H290 C360 520 400 360 480 360 C560 360 560 650 640 650 H850', 0, 3, 7, '#fff')}${lab(250, 495, 'A (reactant)', '#fff', 24)}${lab(760, 625, 'B (products)', '#fff', 24)}${Ln(170, 520, 560, 520, BL, 3, '10 8')}${Ln(170, 650, 640, 650, BL, 3, '10 8')}`),
  gg('x', 'activation', `${dArrow(520, 360, 520, 520, YL).replace(/stroke-dasharray="[^"]*"/g, '')}${lab(560, 450, 'x', YL, 40, 'start')}${lab(560, 336, 'ACTIVATION ENERGY', YL, 22, 'start')}`.replace('class="a flow dash"', '')),
  gg('y', 'enthalpy', `${dArrow(215, 520, 650, OR)}${lab(255, 595, 'y', OR, 40, 'start')}${lab(160, 700, 'ENERGY CHANGE (ΔH)', OR, 22, 'start')}`),
  gg('ex', 'surroundings', `${[0, .6, 1.2].map(d => puff(760 + d * 10, 600, 12, d, -90, 1.8, 'rgba(255,140,60,.8)')).join('')}${pill(500, 900, 700, 'EXOTHERMIC', YL, 44, 78)}`),
  cAns(N9, 970, 'MODEL ANSWER', [['**x = activation energy**', 'activation'], ['**y = enthalpy (energy) change** of the reaction', 'enthalpy'], ['**Exothermic**: products have **less energy** than reactants, so energy is released', 'lower']])
]}));

// ── C10 Q3(c) CALCIUM vs MAGNESIUM ──────────────────────────
const N10 = "Part c. Compare the reactivities of calcium and magnesium with water. Calcium reacts readily with cold water. You see steady fizzing as hydrogen gas is produced, and the water turns cloudy as calcium hydroxide forms. Magnesium reacts very slowly with cold water, with only a few tiny bubbles. Magnesium needs steam to react quickly. So calcium is more reactive than magnesium, because it is higher in the reactivity series.";
const SER = ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Cu'];
CS.push(scn(BG.blue, N10, { badge: 'Q3(c)  CALCIUM vs MAGNESIUM', groups: [
  qGroup('Q3(c)', ['Compare the reactivities of calcium and magnesium', 'with water.'], 2),
  gg('ca', 'calcium', `${tube(120, 300, 110, 330, 380, CY, .35)}<g opacity=".6"><rect ${an('fadein', 6, 1, 'center', '--n:1;')} x="122" y="380" width="106" height="236" fill="#fff"/></g><ellipse cx="175" cy="590" rx="30" ry="12" fill="#9aa0a8"/>${Array.from({ length: 9 }, (_, i) => bub(145 + (i * 17) % 60, 570, i * .25, -240, 7, '#fff', 1.4)).join('')}${lab(175, 270, 'CALCIUM + COLD WATER', YL, 18)}${lab(175, 680, 'FIZZING (H2)', GR, 22)}`),
  gg('mg', 'magnesium', `${tube(380, 300, 110, 330, 380, CY, .35)}<ellipse cx="435" cy="590" rx="30" ry="12" fill="#c9ced6"/>${bub(425, 570, 0, -200, 4, '#fff', 3.2)}${bub(450, 570, 1.6, -200, 4, '#fff', 3.2)}${lab(435, 270, 'MAGNESIUM + COLD WATER', YL, 18)}${lab(435, 680, 'VERY SLOW', OR, 22)}`),
  gg('sr', 'reactivity', `${SER.map((s, i) => `<g ${an('fadein', .4, i * .15, 'center', '--n:1;')}>${box(700, 250 + i * 54, 150, 46, s === 'Ca' || s === 'Mg' ? YL : BL, s === 'Ca' || s === 'Mg' ? 'rgba(255,210,63,.25)' : 'rgba(0,0,0,.25)')}${T(775, 284 + i * 54, s, 30, s === 'Ca' || s === 'Mg' ? YL : '#fff')}</g>`).join('')}${farrow(900, 640, 900, 260, OR, 6)}${lab(930, 450, 'MORE REACTIVE', OR, 18)}`),
  gg('eq', 'hydrogen', `<g ${an('grow', .6, 0, 'center')}>${chemT(440, 790, 'Ca + 2H2O → Ca(OH)2 + H2', 44, '#fff')}</g>`),
  cAns(N10, 860, 'MODEL ANSWER', [['Calcium reacts **readily** with cold water (fizzing, cloudy); magnesium reacts **very slowly**', 'readily'], ['Calcium is **more reactive**: higher in the **reactivity series**', 'reactivity']])
]}));

// ── C11 Q4(a)(i)(ii) DRY DISTILLATION ───────────────────────
const N11 = "Question four, part a. Figure four point one shows the dry distillation of coal. Coal is heated strongly, without air, in a hard glass tube. Coke is left behind in the tube. Gases and vapours pass along the delivery tube and into a collecting tube in cold water. Part i: name substance X. The black, sticky liquid that condenses is coal tar. Part ii: what is the role of the cold water? The cold water cools the vapours, so they condense into a liquid. Coal gas does not condense, so it is collected in the gas syringe.";
CS.push(scn(BG.blue, N11, { badge: 'Q4(a)(i)(ii)  DRY DISTILLATION OF COAL', groups: [
  qGroup('Q4(a)', ['Fig 4.1: dry distillation of coal.', '(i) Name substance X.   (ii) State the role of the cold water.'], '1 + 1'),
  gg('ap', 'distillation', `<path d="M120 470 L400 380 L425 440 L145 540 Q95 525 120 470Z" ${W5}/><path d="M395 372 L430 385 L420 430 L388 418Z" fill="rgba(255,255,255,.4)" stroke="${BL}" stroke-width="4"/>` +
    `<path d="M415 410 L470 392 H550 V700" stroke="${BL}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M415 410 L470 392 H550 V700" stroke="#0f3d7a" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `${beaker(450, 560, 250, 260, 620, '#4aa3e8', .4)}${tube(520, 470, 120, 330)}<rect x="515" y="462" width="130" height="26" fill="rgba(255,255,255,.4)" stroke="${BL}" stroke-width="4"/>` +
    `<path d="M620 470 V400 Q620 362 660 362 H760" stroke="${BL}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M620 470 V400 Q620 362 660 362 H760" stroke="#0f3d7a" stroke-width="5" fill="none" stroke-linecap="round"/>` +
    `<rect x="760" y="335" width="150" height="54" rx="6" ${W5}/><g ${an('move', 2.4, 0, 'center', '--dx:36px;')}><rect x="910" y="346" width="56" height="32" ${W5}/><line x1="966" y1="330" x2="966" y2="394" stroke="${BL}" stroke-width="8"/></g>${[0, 1, 2, 3, 4].map(i => Ln(790 + i * 26, 335, 790 + i * 26, 348, BL, 3)).join('')}` +
    `${lab(830, 305, 'COAL GAS (syringe)', GR, 22)}${lab(250, 440, 'COAL (heated)', BL, 22)}${lab(560, 850, 'COLD WATER', '#8cc8ff', 24)}`),
  gg('fl', 'heated', `<g transform="translate(135 660) scale(1 -1)">${flameSvg(80, 30, .14)}</g>${lab(135, 710, 'HEAT', OR, 26)}`),
  gg('ck', 'coke', `${[[155, 505], [175, 515], [152, 525], [185, 495], [170, 490]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#222" stroke="${BL}" stroke-width="2"/>`).join('')}${leader(155, 520, 100, 590)}${lab(100, 615, 'COKE', YL, 26)}`),
  gg('gs', 'gases', [0, .7, 1.4].map(d => `<circle ${an('drift', 2.4, d, 'center', '--dx:120px;--dir:normal;--e:linear;')} cx="430" cy="392" r="6" fill="${GR}"/>`).join('')),
  gg('tar', 'tar', `<g ${an('growy', 6, 0, 'bottom', '--n:1;')}><path d="M524 742 H636 V796 H524Z" fill="#141414" opacity=".92"/></g>${leader(580, 770, 740, 700, YL)}${lab(790, 700, 'SUBSTANCE X', YL, 26)}${lab(790, 735, '= COAL TAR', YL, 26)}`),
  gg('cw', 'cools', `${farrow(745, 580, 665, 640, '#8cc8ff', 6)}${lab(800, 575, 'CONDENSES', '#8cc8ff', 24)}`),
  cAns(N11, 920, 'MODEL ANSWER', [['**Substance X = coal tar**', 'tar'], ['Cold water **condenses** the vapours (cools them to a liquid)', 'cools']])
]}));

// ── C12 Q4(a)(iii) VALUE ADDITION ──────────────────────────
const N12 = "Part iii. Explain the industrial importance of this process in value addition and beneficiation of coal. Raw coal is bulky and has a low value. Dry distillation turns it into useful products, each worth more. Coke is used as a fuel, and to make iron and steel. Coal tar is a source of chemicals for dyes, plastics, medicines and road tar. Coal gas is used as a fuel. Beneficiation means processing a raw material at home, instead of exporting it as it is. This creates jobs, earns more money, and builds industries.";
const BR = [['COKE', 'fuel, iron + steel', 360], ['COAL TAR', 'dyes, plastics, medicines', 500], ['COAL GAS', 'fuel', 640]];
CS.push(scn(BG.blue, N12, { badge: 'Q4(a)(iii)  VALUE ADDITION', groups: [
  qGroup('Q4(a)(iii)', ['Explain the industrial importance of the process in', 'value addition and beneficiation of coal.'], 2),
  gg('raw', 'raw', `<polygon points="90,540 140,470 220,455 290,500 300,570 220,600 130,595" fill="#1a1a1a" stroke="${BL}" stroke-width="5" stroke-linejoin="round"/>${lab(190, 650, 'RAW COAL', YL, 26)}${lab(190, 685, 'low value  $', OR, 22)}`),
  ...BR.map(([t, u, y], i) => gg('b' + i, ['coke', 'tar', 'gas'][i] === 'coke' ? 'coke' : ['', 'tar', 'gas'][i], `${farrow(320, 530, 540, y + 55, CY, 5)}${box(550, y, 400, 110, YL, 'rgba(255,210,63,.1)')}${T(750, y + 46, t, 38, YL)}${M(750, y + 84, u, 22, '#fff')}${puff(920, y + 20, 10, i * .4, -50, 1.6, 'rgba(255,210,63,.8)')}${T(930, y + 40, '$$', 30, GR)}`)),
  gg('def', 'home', pill(500, 840, 880, 'BENEFICIATION = PROCESSING RAW MATERIAL LOCALLY', CY, 28, 64)),
  gg('j', 'jobs', pill(210, 930, 320, 'MORE JOBS', GR, 30, 62)),
  gg('m', 'money', pill(540, 930, 320, 'MORE INCOME', GR, 30, 62)),
  gg('i', 'industries', pill(850, 930, 280, 'INDUSTRIES', GR, 30, 62)),
  cAns(N12, 1010, 'MODEL ANSWER', [['Raw coal is **converted into valuable products**', 'turns'], ['**Coke, coal tar and coal gas** add value (steel, dyes, plastics, fuel)', 'coke'], ['**Beneficiation** at home creates **jobs and income**', 'jobs']])
]}));

// ── C13 Q4(b)(i) NAMING A AND B ────────────────────────────
const N13 = "Part b. Figure four point two shows the structural formulae of compounds A and B. Part i: name each compound. Look at compound A. It has three carbon atoms in a chain, all single bonds, and an O H group at the end. That is an alcohol. Three carbons is propane, so A is propanol. Now compound B. It has two carbons and the group C double bond O, O H. That is the carboxylic acid group. Two carbons gives ethanoic acid. So A is propanol and B is ethanoic acid.";
const MA = [['H', -80, 0], ['C', 0, 0], ['C', 80, 0], ['C', 160, 0], ['OH', 245, 0], ['H', 0, -70], ['H', 0, 70], ['H', 80, -70], ['H', 80, 70], ['H', 160, -70], ['H', 160, 70]];
const BA = [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [1, 6], [2, 7], [2, 8], [3, 9], [3, 10]];
const MB = [['H', -80, 0], ['C', 0, 0], ['C', 80, 0], ['O', 80, -70], ['OH', 165, 0], ['H', 0, -70], ['H', 0, 70]];
const BB = [[0, 1], [1, 2], [2, 3, 1], [2, 4], [1, 5], [1, 6]];
CS.push(scn(BG.blue, N13, { badge: 'Q4(b)(i)  NAME A AND B', groups: [
  qGroup('Q4(b)(i)', ['Fig 4.2 shows compounds A and B.', 'Name compound  1. A   2. B'], 2),
  gg('A', 'look', T(110, 440, 'A', 80, YL) + mol(350, 430, MA, BA)),
  gg('c3', 'three', ['1', '2', '3'].map((n, i) => `<g ${an('grow', .4, i * .4, 'center')}>${M(350 + i * 80, 330, 'C' + n, 24, CY)}</g>`).join('')),
  gg('oh', 'alcohol', `<g ${an('pulse', 1)}><ellipse cx="595" cy="430" rx="46" ry="34" fill="none" stroke="${YL}" stroke-width="5"/></g>${lab(700, 500, 'ALCOHOL  (–OH)', YL, 24)}${leader(630, 450, 690, 490, YL)}`),
  gg('pa', 'propanol', pill(500, 560, 700, 'A = PROPANOL', YL, 40, 70)),
  gg('B', 'now', T(110, 770, 'B', 80, YL) + mol(350, 760, MB, BB)),
  gg('cooh', 'carboxylic', `<g ${an('pulse', 1)}><ellipse cx="480" cy="735" rx="95" ry="64" fill="none" stroke="${YL}" stroke-width="5"/></g>${lab(700, 835, 'CARBOXYLIC ACID  (–COOH)', YL, 24)}${leader(560, 770, 690, 825, YL)}`),
  gg('pb', 'ethanoic', pill(500, 930, 700, 'B = ETHANOIC ACID', YL, 40, 70)),
  cAns(N13, 1020, 'MODEL ANSWER', [['A = **propanol** (propan-1-ol): alcohol with 3 carbons', 'propanol'], ['B = **ethanoic acid**: carboxylic acid with 2 carbons', 'ethanoic']])
]}));

// ── C14 Q4(b)(ii) TEST B vs C ─────────────────────────────
const N14 = "Part ii. A and B react to give compound C, shown in figure four point three. Compound C is an ester, propyl ethanoate. Describe a chemical test to distinguish B from C. Add sodium carbonate, or sodium hydrogencarbonate, to each. B is an acid, so it fizzes and gives off carbon dioxide, which turns limewater milky. C is an ester, so there is no fizzing, and no reaction. Another test: add universal indicator. B turns red or orange, but C stays green.";
CS.push(scn(BG.blue, N14, { badge: 'Q4(b)(ii)  DISTINGUISH B FROM C', groups: [
  qGroup('Q4(b)(ii)', ['A and B react to give compound C (Fig 4.3).', 'Describe a chemical test to distinguish B from C.'], 2),
  gg('rx', 'react', M(500, 250, 'propanol + ethanoic acid → ester C + water', 26, CY)),
  gg('tb', 'sodium', `${tube(240, 330, 110, 300, 420, CY, .35)}${lab(295, 300, 'B (acid)', YL, 26)}${[0, .5, 1].map(d => `<circle ${an('rise', 1.2, d, 'center', '--dy:70px;--sc:.8;')} cx="${280 + d * 20}" cy="340" r="6" fill="#fff"/>`).join('')}${lab(295, 670, '+ Na2CO3', '#fff', 24)}${tube(560, 330, 110, 300, 420, CY, .35)}${lab(615, 300, 'C (ester)', YL, 26)}${lab(615, 670, '+ Na2CO3', '#fff', 24)}`),
  gg('fz', 'fizzes', Array.from({ length: 10 }, (_, i) => bub(262 + (i * 13) % 70, 600, i * .2, -170, 7, '#fff', 1.2)).join('') + lab(295, 715, 'FIZZES: CO2', GR, 26) + `<g transform="translate(450 480)">${farrow(-30, 0, 40, 0, GR, 5)}</g>`),
  gg('no', 'reaction', lab(615, 715, 'NO REACTION', OR, 26)),
  gg('ui', 'universal', `${[['B', '#ff6a3d', 300], ['C', '#6dff9c', 700]].map(([t, c, x]) => `<g transform="translate(${x} 840)"><rect x="-45" y="-40" width="90" height="100" rx="30" fill="${c}" opacity=".8" stroke="${BL}" stroke-width="5"/>${T(0, 100, t, 30, YL)}</g>`).join('')}${lab(500, 780, 'UNIVERSAL INDICATOR', BL, 24)}${lab(500, 860, 'red/orange  vs  green', YL, 24)}`),
  cAns(N14, 990, 'MODEL ANSWER', [['Add **sodium carbonate** to each', 'sodium'], ['B **fizzes** (CO2, limewater milky); C: no reaction', 'fizzes'], ['Or **universal indicator**: B red/orange, C green', 'universal']], { size: 28 })
]}));

// ── C15 Q5(a)(i) AMPHOTERIC ────────────────────────────────
const N15 = "Question five, part a. Part i: define the term amphoteric. An amphoteric oxide is one that reacts with both acids and bases, forming a salt and water each time. Examples are zinc oxide and aluminium oxide. So amphoteric means it can act as a base, and as an acid.";
CS.push(scn(BG.blue, N15, { badge: 'Q5(a)(i)  AMPHOTERIC', groups: [
  qGroup('Q5(a)(i)', ['Define the term amphoteric.'], 1),
  gg('ox', 'amphoteric', `<g ${an('pulse', 1.4)}>${box(340, 360, 320, 150, YL, 'rgba(255,210,63,.12)')}${T(500, 430, 'ZnO', 56, YL)}${M(500, 480, 'or  Al2O3', 28, '#fff')}</g>`),
  gg('ac', 'acids', `${box(40, 360, 240, 150, '#ff9d9d')}${T(160, 425, 'ACID', 44, '#ff9d9d')}${M(160, 475, 'e.g. HCl', 26, '#fff')}${farrow(290, 435, 330, 435, '#ff9d9d', 6)}${M(160, 590, '→ SALT + WATER', 24, GR)}`),
  gg('ba', 'bases', `${box(720, 360, 240, 150, '#b9a0ff')}${T(840, 425, 'BASE', 44, '#b9a0ff')}${M(840, 475, 'e.g. NaOH', 26, '#fff')}${farrow(710, 435, 670, 435, '#b9a0ff', 6)}${M(840, 590, '→ SALT + WATER', 24, GR)}`),
  gg('bo', 'both', pill(500, 700, 880, 'REACTS WITH BOTH ACIDS AND BASES', YL, 32, 70)),
  cAns(N15, 800, 'MODEL ANSWER', [['An **oxide** that reacts with **both acids and bases** to form **salt and water**', 'both']])
]}));

// ── C16 Q5(a)(ii) MO and XO3 ──────────────────────────────
const N16 = "Part ii. Two oxides, X O three and M O, react with water. Identify the acid base nature of each. Look at M O first. It forms M two plus ions and hydroxide ions. Hydroxide ions mean an alkali, so M O is a basic oxide. Now X O three. It forms hydrogen ions, and X O four two minus ions. Hydrogen ions mean an acid, so X O three is an acidic oxide.";
CS.push(scn(BG.blue, N16, { badge: 'Q5(a)(ii)  BASIC OR ACIDIC OXIDE?', groups: [
  qGroup('Q5(a)(ii)', ['MO and XO3 react with water. Identify the', 'acid/base nature of  1. MO   2. XO3'], 2),
  gg('e1', 'first', `${chemT(500, 310, 'MO(s) + H2O(l) → M^2+;(aq) + 2OH^-;(aq)', 38, '#fff')}`),
  gg('c1', 'hydroxide', pill(500, 400, 560, 'OH⁻ ions  →  ALKALI', '#b9a0ff', 32, 64)),
  gg('a1', 'basic', pill(500, 490, 560, '1. MO  =  BASIC OXIDE', YL, 34, 66)),
  gg('e2', 'now', `${chemT(500, 640, 'XO3(g) + H2O(l) → 2H^+;(aq) + XO4^2-;(aq)', 36, '#fff')}`),
  gg('c2', 'hydrogen', pill(500, 730, 560, 'H⁺ ions  →  ACID', '#ff9d9d', 32, 64)),
  gg('a2', 'acidic', pill(500, 820, 560, '2. XO3  =  ACIDIC OXIDE', YL, 34, 66)),
  cAns(N16, 920, 'MODEL ANSWER', [['MO: **basic** oxide (forms hydroxide ions)', 'basic'], ['XO3: **acidic** oxide (forms hydrogen ions)', 'acidic']])
]}));

// ── C17 Q5(b)(i)(ii) TERYLENE ─────────────────────────────
const N17 = "Part b. Figure five point one shows a section of terylene. Part i: state the type of polymerisation. Terylene is made from two different monomers, a dicarboxylic acid and a diol. They join, and a small molecule, water, is lost each time. That is condensation polymerisation. Part ii: name the linkage. Look at the link between the carbon double bond oxygen, and the next oxygen. That group, C O O, is the ester linkage. Terylene is a polyester.";
CS.push(scn(BG.blue, N17, { badge: 'Q5(b)(i)(ii)  TERYLENE', groups: [
  qGroup('Q5(b)', ['Fig 5.1: a section of terylene.', '(i) Type of polymerisation   (ii) Name the linkage'], '1 + 1'),
  gg('ch', 'terylene', `${T(80, 470, '[', 150, BL, 'middle', FM)}${T(820, 470, ']', 150, BL, 'middle', FM)}${M(860, 530, 'n', 34, YL)}` +
    `${Ln(110, 450, 160, 450, BL, 4)}${chemT(180, 462, 'C', 40, '#fff')}${Ln(180, 410, 180, 360, BL, 4)}${chemT(180, 345, 'O', 38, '#fff')}${Ln(200, 450, 230, 450, BL, 4)}<rect x="230" y="425" width="110" height="50" rx="6" fill="none" stroke="${CY}" stroke-width="4"/>${M(285, 456, 'ring', 22, CY)}${Ln(340, 450, 370, 450, BL, 4)}` +
    `${chemT(390, 462, 'C', 40, '#fff')}${Ln(390, 410, 390, 360, BL, 4)}${chemT(390, 345, 'O', 38, '#fff')}${Ln(410, 450, 440, 450, BL, 4)}${chemT(460, 462, 'O', 40, '#fff')}${Ln(480, 450, 510, 450, BL, 4)}<rect x="510" y="425" width="130" height="50" rx="6" fill="none" stroke="${OR}" stroke-width="4" stroke-dasharray="8 6"/>${M(575, 456, 'CH2CH2', 22, OR)}${Ln(640, 450, 670, 450, BL, 4)}${chemT(690, 462, 'O', 40, '#fff')}${Ln(710, 450, 780, 450, BL, 4)}`),
  gg('cd', 'condensation', `${pill(500, 600, 760, 'DIACID + DIOL  →  POLYESTER + WATER', YL, 30, 64)}<g transform="translate(790 650)"><g ${an('move', 1.8, 0, 'center', '--dx:90px;--dy:50px;--dir:normal;')}><circle r="12" fill="${CY}"/></g></g>${lab(780, 720, 'H2O lost', CY, 22)}`),
  gg('es', 'linkage', `<g ${an('pulse', 1)}><rect x="355" y="320" width="150" height="170" rx="20" fill="none" stroke="${YL}" stroke-width="5" stroke-dasharray="10 6"/></g>${lab(430, 530, 'ESTER LINKAGE', YL, 26)}${chemT(430, 565, '–COO–', 34, YL)}`),
  cAns(N17, 700, 'MODEL ANSWER', [['**Condensation** polymerisation (water is lost each time)', 'condensation'], ['**Ester** linkage (–COO–): terylene is a polyester', 'ester']])
]}));

// ── C18 Q5(b)(iii)(iv) MONOMERS + USE ────────────────────
const N18 = "Part iii. Draw the structures of the monomers of terylene. To find the monomers, break the polymer at each ester linkage, and put back what water took away. Breaking the ester link gives a diacid and a diol. The diacid is benzene one four dicarboxylic acid: a benzene ring with a carboxylic acid group, C O O H, at each end. The diol is ethane one two diol: H O, C H two, C H two, O H. Part iv. State one use of terylene. Terylene is used to make clothing fabrics, ropes and sails.";
const hexa = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => `${cx + r * Math.cos(i * Math.PI / 3)},${cy + r * Math.sin(i * Math.PI / 3)}`).join(' ');
const MD = [['HO', -100, 0], ['C', -20, 0], ['C', 60, 0], ['OH', 140, 0], ['H', -20, -70], ['H', -20, 70], ['H', 60, -70], ['H', 60, 70]];
const BDD = [[0, 1], [1, 2], [2, 3], [1, 4], [1, 5], [2, 6], [2, 7]];
CS.push(scn(BG.blue, N18, { badge: 'Q5(b)(iii)(iv)  MONOMERS + USE', groups: [
  qGroup('Q5(b)', ['(iii) Draw the structures of the monomers of terylene.', '(iv) State any one use of terylene.'], '2 + 1'),
  gg('br', 'break', `${chemT(500, 260, 'break at each ester link  +  add H2O', 30, CY)}`),
  gg('m1', 'diacid', `<polygon points="${hexa(500, 430, 62)}" fill="none" stroke="${BL}" stroke-width="5"/><circle cx="500" cy="430" r="36" fill="none" stroke="${BL}" stroke-width="3"/>${Ln(438, 430, 400, 430, BL, 4)}${Ln(562, 430, 600, 430, BL, 4)}${chemT(340, 442, 'HOOC', 38, '#fff')}${chemT(660, 442, 'COOH', 38, '#fff')}${lab(500, 530, 'BENZENE-1,4-DICARBOXYLIC ACID', YL, 24)}`),
  gg('m2', 'diol', mol(400, 700, MD, BDD) + lab(500, 820, 'ETHANE-1,2-DIOL', YL, 24)),
  gg('u1', 'clothing', pill(200, 920, 340, 'CLOTHING FABRIC', GR, 28, 62)),
  gg('u2', 'ropes', pill(540, 920, 220, 'ROPES', GR, 28, 62)),
  gg('u3', 'sails', pill(800, 920, 220, 'SAILS', GR, 28, 62)),
  cAns(N18, 1000, 'MODEL ANSWER', [['Monomer 1: **benzene-1,4-dicarboxylic acid** (HOOC–C6H4–COOH)', 'diacid'], ['Monomer 2: **ethane-1,2-diol** (HO–CH2–CH2–OH)', 'diol'], ['Use: **clothing fabrics** (polyester), ropes, sails', 'clothing']], { size: 27 })
]}));

const gtube = (x, yt, w, h) => `M${x} ${yt + h} V${yt + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${yt + w / 2} V${yt + h}`;
// ── C19 Q6(a) ELECTROLYSIS OF WATER ──────────────────────
const N19 = "Question six is from Section B. Part a. In the electrolysis of acidified water, oxygen and hydrogen are produced. Part i: calculate the volume of hydrogen produced if fifty cubic centimetres of oxygen is produced. The equation is: two water gives two hydrogen plus one oxygen. Hydrogen and oxygen are formed in the ratio two to one. So the volume of hydrogen is two times fifty, which is one hundred cubic centimetres. Part ii: explain why electrolysis is an expensive way to make oxygen. It uses a large amount of electricity, and electrical energy costs a lot.";
CS.push(scn(BG.blue, N19, { badge: 'Q6(a)  ELECTROLYSIS OF WATER', groups: [
  qGroup('Q6(a)', ['(i) Volume of H2 when 50 cm³ of O2 is produced.', '(ii) Why is electrolysis an expensive way to make O2?'], '3 + 2'),
  gg('ap', 'electrolysis', `<rect x="200" y="650" width="600" height="110" ${W5}/><rect x="203" y="690" width="594" height="68" fill="${CY}" opacity=".35"/><path d="${gtube(330, 470, 90, 220)}" ${W5}/><path d="${gtube(590, 470, 90, 220)}" ${W5}/>${Ln(375, 520, 375, 740, '#fff', 6)}${Ln(635, 520, 635, 740, '#fff', 6)}${Ln(375, 740, 375, 830, BL, 4)}${Ln(635, 740, 635, 830, BL, 4)}${Ln(375, 830, 470, 830, BL, 4)}${Ln(635, 830, 530, 830, BL, 4)}${Ln(470, 805, 470, 855, BL, 6)}${Ln(530, 815, 530, 845, BL, 6)}${T(345, 810, '+', 44, '#ff9d9d')}${T(665, 810, '–', 44, '#9db8ff')}${lab(375, 440, 'O2', CY, 30)}${lab(635, 440, 'H2', YL, 30)}${lab(375, 880, 'ANODE (+)', BL, 20)}${lab(635, 880, 'CATHODE (–)', BL, 20)}`),
  gg('gas', 'oxygen', `<g ${an('growy', 4, 0, 'top', '--n:1;')}><rect x="334" y="474" width="82" height="75" fill="${CY}" opacity=".6"/></g><g ${an('growy', 4, 0, 'top', '--n:1;')}><rect x="594" y="474" width="82" height="150" fill="${YL}" opacity=".6"/></g>${Array.from({ length: 5 }, (_, i) => bub(375 + (i % 2) * 8 - 4, 700, i * .4, -150, 6, '#fff', 1.6)).join('')}${Array.from({ length: 8 }, (_, i) => bub(635 + (i % 2) * 8 - 4, 700, i * .25, -170, 6, '#fff', 1.4)).join('')}`),
  gg('ratio', 'ratio', `<g ${an('pulse', 1.2)}>${T(500, 350, 'H2 : O2  =  2 : 1', 54, YL)}</g>${lab(375, 575, '50 cm³', '#fff', 26)}${lab(635, 650, '100 cm³', '#fff', 26)}`),
  gg('eq', 'equation', `<g ${an('grow', .6, 0, 'center')}>${chemT(500, 930, '2H2O → 2H2 + O2', 48, '#fff')}</g>`),
  gg('cal', 'times', pill(500, 1010, 760, 'H2 = 2 × 50 = 100 cm³', GR, 36, 66)),
  gg('el', 'electricity', `<g ${an('blink', .9)}><polygon points="860,300 830,370 855,370 835,430 895,350 868,350 890,300" fill="${YL}" stroke="${INKD}" stroke-width="3"/></g>${lab(860, 470, 'ELECTRICITY', YL, 22)}${pill(500, 1100, 860, 'LARGE ELECTRICAL ENERGY = EXPENSIVE', OR, 30, 64)}`)
]}));

// ── C20 Q6(b)(i) MOLES (board) ────────────────────────────
const N20 = "Part b. Hydrogen is used to make copper from copper two oxide. The equation is: copper oxide plus hydrogen gives copper plus water. Part i: calculate the volume of hydrogen needed at room temperature and pressure to make one point six grams of copper. Step one: find the moles of copper. Moles equal mass divided by molar mass. Copper has a relative atomic mass of sixty four. One point six divided by sixty four is zero point zero two five moles. Step two: use the equation. One mole of hydrogen makes one mole of copper, so we need zero point zero two five moles of hydrogen.";
const bq = (label, lines, marks) => ({ id: 'q', y: 12, t: .1, svg: qb(label, lines, marks).replace(/rgba\(0,0,0,\.38\)/, 'rgba(0,0,0,.3)') });
CS.push(scn(BG.board, N20, { badge: 'Q6(b)(i)  MOLES AND GAS VOLUME', badgeColor: '#b8860b', theme: 'board', groups: [
  bq('Q6(b)(i)', ['Volume of H2 at r.t.p. needed to make 1.6 g of copper', 'CuO + H2 → Cu + H2O'], 3),
  gg('st', 'chalk', stars(24, 6).replace(/#fff/g, CH)),
  gg('eq', 'equation', `<g ${an('grow', .6, 0, 'center')}>${chemT(500, 290, 'CuO + H2 → Cu + H2O', 56, CH)}</g>`),
  gg('s1', 'moles', `${box(60, 340, 880, 220, CHY, 'rgba(0,0,0,.2)')}${T(100, 395, 'STEP 1', 38, CHY, 'start')}${M(300, 395, 'moles of copper', 30, CH, 'start')}`),
  gg('f1', 'mass', chemT(500, 450, 'moles = mass ÷ Mr', 42, CH)),
  gg('m1', 'sixty', M(500, 500, 'Mr of Cu = 64', 32, CHY)),
  gg('r1', 'zero', `<g ${an('grow', .5, 0, 'center')}>${chemT(500, 545, '1.6 ÷ 64 = 0.025 mol', 44, '#6dff9c')}</g>`),
  gg('s2', 'use', `${box(60, 600, 880, 190, CHY, 'rgba(0,0,0,.2)')}${T(100, 655, 'STEP 2', 38, CHY, 'start')}${M(300, 655, 'mole ratio from the equation', 30, CH, 'start')}`),
  gg('f2', 'makes', chemT(500, 715, '1 mol H2 : 1 mol Cu', 42, CH)),
  gg('r2', 'need', `<g ${an('grow', .5, 0, 'center')}>${chemT(500, 765, 'moles of H2 = 0.025 mol', 44, '#6dff9c')}</g>`),
  cAns(N20, 840, 'MODEL ANSWER (SO FAR)', [['moles of Cu = 1.6 ÷ 64 = **0.025 mol**', 'zero'], ['Ratio 1 : 1, so moles of H2 = **0.025 mol**', 'need']])
]}));

const N20b = "Step three: volume equals moles times the molar volume. This paper's data sheet, on page seventeen, gives twenty eight decimetres cubed per mole. Zero point zero two five times twenty eight is zero point seven decimetres cubed. That is seven hundred cubic centimetres. If your data sheet says twenty four, the answer is zero point six decimetres cubed, or six hundred cubic centimetres. Always use the value printed on your own paper.";
CS.push(scn(BG.board, N20b, { badge: 'Q6(b)(i)  STEP 3: THE VOLUME', badgeColor: '#b8860b', theme: 'board', groups: [
  bq('Q6(b)(i)', ['Volume of H2 at r.t.p. needed to make 1.6 g of copper', 'step 3: volume = moles × molar volume'], 3),
  gg('st', 'chalk', stars(24, 7).replace(/#fff/g, CH)),
  gg('f', 'volume', `${box(60, 240, 880, 150, CHY, 'rgba(0,0,0,.2)')}${T(100, 295, 'STEP 3', 38, CHY, 'start')}${chemT(500, 350, 'V = moles × molar volume', 46, CH)}`),
  gg('ds', 'sheet', `${box(160, 440, 680, 120, '#8fbcff', 'rgba(143,188,255,.12)')}${M(500, 485, 'DATA SHEET (page 17)', 26, '#8fbcff')}${M(500, 530, '1 mole of any gas = 28 dm³ at r.t.p.', 32, CH)}`),
  gg('c', 'times', `<g ${an('grow', .5, 0, 'center')}>${chemT(500, 640, '0.025 × 28 = 0.7 dm³', 56, '#6dff9c')}</g>`),
  gg('a', 'seven', `<g ${an('grow', .6, 0, 'center')}>${box(220, 690, 560, 110, CHY, 'rgba(255,224,138,.15)')}${chemT(500, 765, '0.7 dm³  =  700 cm³', 54, CHY)}</g>`),
  gg('alt', 'four', `${M(500, 870, 'if YOUR data sheet says 24 dm³:', 26, '#ff9d9d')}${chemT(500, 920, '0.025 × 24 = 0.6 dm³ = 600 cm³', 40, '#ff9d9d')}`),
  gg('al', 'always', pill(500, 1010, 780, 'ALWAYS USE THE VALUE ON YOUR PAPER', CHY, 30, 64))
]}));

// ── C21 Q6(b)(ii) ROLE OF HYDROGEN ───────────────────────
const N21 = "Part ii. State and explain the role of hydrogen in this reaction. Hydrogen removes oxygen from copper oxide, so copper oxide is reduced to copper. The hydrogen takes the oxygen and becomes water. So hydrogen is the reducing agent. It is oxidised, because it gains oxygen, and its oxidation number increases from zero to plus one.";
CS.push(scn(BG.blue, N21, { badge: 'Q6(b)(ii)  ROLE OF HYDROGEN', groups: [
  qGroup('Q6(b)(ii)', ['State and explain the role of hydrogen', 'in the reaction  CuO + H2 → Cu + H2O'], 2),
  gg('cuo', 'hydrogen', `<circle cx="200" cy="540" r="62" fill="rgba(255,179,107,.2)" stroke="${OR}" stroke-width="5"/>${T(200, 556, 'Cu', 46, OR)}<g ${an('moveonce', 2.4, 3.2, 'center', '--dx:260px;--e:ease-in-out;')}><circle cx="290" cy="540" r="36" fill="rgba(255,90,90,.25)" stroke="#ff7a7a" stroke-width="5"/>${T(290, 553, 'O', 38, '#ff9d9d')}</g><circle cx="620" cy="505" r="28" fill="rgba(127,224,255,.2)" stroke="${CY}" stroke-width="5"/>${T(620, 516, 'H', 30, CY)}<circle cx="620" cy="575" r="28" fill="rgba(127,224,255,.2)" stroke="${CY}" stroke-width="5"/>${T(620, 586, 'H', 30, CY)}${lab(200, 650, 'CuO', OR, 26)}${lab(620, 650, 'H2', CY, 26)}`),
  gg('rd', 'removes', `${lab(200, 440, 'CuO LOSES OXYGEN', '#ff9d9d', 24)}${lab(200, 475, '= REDUCED', YL, 28)}`),
  gg('ox', 'oxidised', `${lab(700, 440, 'H2 GAINS OXYGEN', CY, 24)}${lab(700, 475, '= OXIDISED', YL, 28)}${chemT(700, 740, '0  →  +1', 40, '#fff')}${lab(700, 780, 'oxidation number of H', BL, 22)}`),
  gg('ag', 'agent', pill(500, 870, 780, 'HYDROGEN = REDUCING AGENT', YL, 38, 74)),
  cAns(N21, 960, 'MODEL ANSWER', [['Hydrogen **removes oxygen** from CuO, so CuO is **reduced** to copper', 'removes'], ['Hydrogen is the **reducing agent** (it is oxidised: gains oxygen)', 'agent']])
]}));

// ── C22 Q6(c)(i) HARD WATER ──────────────────────────────
const N22 = "Part c. Water samples from sources A and B were heated. A gave a white precipitate, and B showed no change. Part i: suggest an explanation. Source A contains dissolved calcium hydrogencarbonate. This is temporary hard water. When heated, the calcium hydrogencarbonate breaks down, forming insoluble calcium carbonate, which is the white precipitate, plus water and carbon dioxide. Source B has no hydrogencarbonates, so it is soft water, and nothing happens.";
CS.push(scn(BG.blue, N22, { badge: 'Q6(c)(i)  HARD AND SOFT WATER', groups: [
  qGroup('Q6(c)(i)', ['Table 6.1: A gives a white precipitate when heated,', 'B shows no change. Suggest an explanation.'], 3),
  gg('a', 'samples', `${beaker(150, 380, 260, 270, 440, CY, .35)}${lab(280, 340, 'SOURCE A', YL, 28)}<g opacity=".75"><rect ${an('fadein', 8, 2, 'center', '--n:1;')} x="152" y="440" width="256" height="208" fill="#fff"/></g><g transform="translate(280 740) scale(1 -1)">${flameSvg(80, 36, .14)}</g>${[[210, 520], [330, 560], [260, 600], [360, 500]].map(([x, y], i) => `<g ${an('wobble', 1 + i * .2)}><circle cx="${x}" cy="${y}" r="11" fill="${YL}"/></g>`).join('')}`),
  gg('b', 'samples', `${beaker(590, 380, 260, 270, 440, CY, .35)}${lab(720, 340, 'SOURCE B', YL, 28)}<g transform="translate(720 740) scale(1 -1)">${flameSvg(80, 36, .14)}</g>${lab(720, 800, 'NO CHANGE', GR, 26)}`),
  gg('hd', 'dissolved', pill(280, 830, 420, 'TEMPORARY HARD WATER', OR, 26, 58)),
  gg('sf', 'soft', pill(720, 830, 380, 'SOFT WATER', CY, 26, 58)),
  gg('eq', 'insoluble', `<g ${an('grow', .6, 0, 'center')}>${chemT(500, 930, 'Ca(HCO3)2 → CaCO3 + H2O + CO2', 40, '#fff')}</g>${lab(500, 970, 'CaCO3 = insoluble white precipitate', YL, 24)}`),
  cAns(N22, 1020, 'MODEL ANSWER', [['A contains **calcium hydrogencarbonate** (temporary hard water)', 'dissolved'], ['On heating it forms **insoluble calcium carbonate** (white precipitate)', 'insoluble'], ['B has no hydrogencarbonates: **soft water**, no change', 'soft']], { size: 28 })
]}));

// ── C23 Q6(c)(ii) ADVANTAGES OF HARD WATER ──────────────
const N23 = "Part ii. State any two advantages of drinking water from source A. Source A is hard water, which contains calcium ions. First, calcium helps build strong bones and teeth. Second, hard water may reduce the risk of heart disease. Another advantage is that it forms a layer inside pipes, which stops lead from dissolving into the water. Any two of these earns full marks.";
const icon3 = (x, title, inner, w) => gg('ic' + x, w, `<g transform="translate(${x} 480)"><g ${an('grow', .5, 0, 'center')}><rect x="-150" y="-130" width="300" height="300" rx="20" fill="rgba(0,0,0,.25)" stroke="${BL}" stroke-width="5"/>${inner}${T(0, 140, title, 28, YL)}</g></g>`);
CS.push(scn(BG.blue, N23, { badge: 'Q6(c)(ii)  ADVANTAGES OF SOURCE A', groups: [
  qGroup('Q6(c)(ii)', ['State any two advantages of drinking water', 'from source A.'], 2),
  icon3(180, 'BONES + TEETH', `<path d="M-40 -60 Q-70 -40 -50 0 Q-40 60 -20 80 Q-10 90 0 70 Q10 90 20 80 Q40 60 50 0 Q70 -40 40 -60 Q0 -80 -40 -60Z" fill="rgba(255,255,255,.2)" stroke="${BL}" stroke-width="5"/><g ${an('twinkle', 1.2)}>${chemT(0, 10, 'Ca^2+;', 34, YL)}</g>`, 'bones'),
  icon3(500, 'HEART', `<g ${an('pulse', .9)}><path d="M0 60 C-90 -10 -60 -80 0 -30 C60 -80 90 -10 0 60Z" fill="rgba(255,100,130,.5)" stroke="#ff8fb1" stroke-width="5"/></g>`, 'heart'),
  icon3(820, 'COATS PIPES', `<circle r="62" fill="none" stroke="${BL}" stroke-width="8"/><circle r="48" fill="none" stroke="${YL}" stroke-width="6"/><circle r="30" fill="${CY}" opacity=".5"/>${lab(0, 110, 'blocks lead', GR, 20)}`, 'pipes'),
  cAns(N23, 780, 'MODEL ANSWER (ANY TWO)', [['**Calcium** gives strong **bones and teeth**', 'bones'], ['**May reduce** the risk of **heart disease**', 'heart'], ['**Coats pipes**, so lead cannot dissolve into the water', 'pipes']])
]}));

// ── C24 Q7(a)(i) MAGNESIUM CHLORIDE ──────────────────────
const N24 = "Question seven, part a. Part i: the electronic configuration of element Y is two, eight, two. Give the molecular formula of the compound formed when Y reacts with chlorine. Two plus eight plus two is twelve electrons, so Y has atomic number twelve. That is magnesium. It has two outer electrons, which it loses, to form Y two plus. Each chlorine atom needs one electron, to form chloride, Cl minus. So one magnesium atom gives one electron to each of two chlorine atoms. The formula is M g C l two.";
CS.push(scn(BG.blue, N24, { badge: 'Q7(a)(i)  ELEMENT Y + CHLORINE', groups: [
  qGroup('Q7(a)(i)', ['Y has electronic configuration 2.8.2.', 'Give the formula of the compound Y forms with chlorine.'], 1),
  gg('mg', 'electronic', atom(500, 560, [2, 8, 2], '12p', { r0: 46, gap: 34 }) + lab(500, 720, 'Y = 2.8.2', YL, 26)),
  gg('z', 'twelve', `<g ${an('grow', .5, 0, 'center')}>${pill(500, 810, 560, '12 electrons → atomic no. 12 = MAGNESIUM', YL, 26, 58)}</g>`),
  gg('cl', 'chlorine', atom(170, 560, [2, 8, 7], '17p', { r0: 36, gap: 28 }) + atom(830, 560, [2, 8, 7], '17p', { r0: 36, gap: 28 }) + lab(170, 690, 'Cl  (2.8.7)', OR, 24) + lab(830, 690, 'Cl  (2.8.7)', OR, 24)),
  gg('tr', 'loses', `<g transform="translate(614 560)"><g ${an('moveonce', 2.2, .5, 'center', '--dx:124px;--e:ease-in-out;')}><circle r="12" fill="${YL}" stroke="#fff" stroke-width="2"/></g></g><g transform="translate(386 560)"><g ${an('moveonce', 2.2, .5, 'center', '--dx:-124px;--e:ease-in-out;')}><circle r="12" fill="${YL}" stroke="#fff" stroke-width="2"/></g></g>${chemT(500, 430, 'Mg^2+;', 46, YL)}${chemT(170, 430, 'Cl^-;', 46, OR)}${chemT(830, 430, 'Cl^-;', 46, OR)}`),
  gg('f', 'formula', pill(500, 900, 520, 'FORMULA:  MgCl2', GR, 44, 80)),
  cAns(N24, 990, 'MODEL ANSWER', [['Y = **magnesium** (2.8.2): loses 2 electrons to form Y²⁺', 'twelve'], ['Each Cl gains 1 electron: formula **MgCl2**', 'formula']])
]}));

// ── C25 Q7(a)(ii) IONIC PROPERTIES ───────────────────────
const N25 = "Part ii. Explain why magnesium chloride conducts electricity when molten, has a high boiling point, and is soluble in water. One: it is an ionic compound, with a giant lattice of positive and negative ions. When molten, the ions are free to move, and they carry the electric charge, so it conducts. Two: there are strong electrostatic forces of attraction between the oppositely charged ions. A lot of heat energy is needed to break them, so the boiling point is high. Three: water molecules are polar. They attract the ions, pull them out of the lattice, and surround them, so the compound dissolves.";
const lattice = (x0, y0, bonds) => { let s = ''; for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { const x = x0 + c * 70, y = y0 + r * 70, pos = (r + c) % 2 === 0; if (bonds) { if (c < 3) s += Ln(x + 26, y, x + 44, y, YL, 3); if (r < 1) s += Ln(x, y + 26, x, y + 44, YL, 3); } s += `<g ${an('wobble', .5 + (r + c) * .05, 0)}><circle cx="${x}" cy="${y}" r="26" fill="${pos ? 'rgba(255,179,107,.25)' : 'rgba(127,224,255,.25)'}" stroke="${pos ? OR : CY}" stroke-width="4"/>${T(x, y + 10, pos ? '+' : '–', 30, pos ? OR : CY)}</g>`; } return s; };
const water = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})"><circle r="14" fill="rgba(255,90,90,.4)" stroke="#ff9d9d" stroke-width="3"/><circle cx="-15" cy="14" r="8" fill="${CY}"/><circle cx="15" cy="14" r="8" fill="${CY}"/></g>`;
CS.push(scn(BG.blue, N25, { badge: 'Q7(a)(ii)  PROPERTIES OF MgCl2', groups: [
  qGroup('Q7(a)(ii)', ['Explain why the compound formed (MgCl2)', '1. conducts when molten  2. high b.p.  3. soluble in water'], 3),
  gg('r1', 'molten', `${lattice(110, 300, false)}${Ln(340, 300, 420, 300, BL, 4)}${Ln(420, 300, 420, 360, BL, 4)}<g ${an('pulse', .9)}><circle cx="440" cy="380" r="30" fill="rgba(255,210,63,.5)" stroke="${YL}" stroke-width="5"/></g>${farrow(300, 440, 150, 440, GR, 5)}${lab(660, 330, '1. MOLTEN: IONS FREE', YL, 24)}${lab(660, 365, 'TO MOVE = CONDUCTS', YL, 24)}`),
  gg('r2', 'electrostatic', `${lattice(110, 550, true)}<g transform="translate(240 690) scale(1 -1)">${flameSvg(50, 24, .14)}</g>${lab(660, 580, '2. STRONG ELECTROSTATIC', YL, 24)}${lab(660, 615, 'ATTRACTION = HIGH b.p.', YL, 24)}`),
  gg('r3', 'polar', `<circle cx="270" cy="810" r="32" fill="rgba(255,179,107,.25)" stroke="${OR}" stroke-width="4"/>${T(270, 820, '+', 30, OR)}${[[190, 770, -40], [350, 770, 40], [190, 850, -140], [350, 850, 140], [270, 730, 0]].map(([x, y, a]) => `<g ${an('pulse', 1.4)}>${water(x, y, a)}</g>`).join('')}${lab(660, 790, '3. POLAR WATER MOLECULES', YL, 24)}${lab(660, 825, 'ATTRACT THE IONS', YL, 24)}`),
  cAns(N25, 930, 'MODEL ANSWER', [['Molten: **ions are free to move** and carry charge', 'free'], ['High b.p.: **strong electrostatic attraction**, much heat energy needed', 'heat'], ['Soluble: **polar water molecules attract the ions** out of the lattice', 'attract']], { size: 28 })
]}));

// ── C26 Q7(b) CONTACT PROCESS FLOW CHART ─────────────────
const N26 = "Part b. Figure seven point one shows the flow chart for making sulphuric acid, called the contact process. Sulphur dioxide and oxygen from air pass into the converter, at four hundred and fifty degrees Celsius, one atmosphere, with a vanadium oxide catalyst. They form sulphur trioxide. The sulphur trioxide is dissolved in concentrated sulphuric acid, to make oleum. The oleum is then diluted with water, to give concentrated sulphuric acid. The reaction in the converter is reversible, and exothermic.";
const fb = (x, y, w, h, lines, col = BL) => `${box(x, y, w, h, col, 'rgba(0,0,0,.3)')}${lines.map((l, i) => chemT(x + w / 2, y + 36 + i * 34, l, 28, '#fff')).join('')}`;
CS.push(scn(BG.blue, N26, { badge: 'Q7(b)  THE CONTACT PROCESS', groups: [
  qGroup('Q7(b)', ['Fig 7.1: flow chart for the production of sulphuric acid.', 'Explain why (i) 450 °C  (ii) SO3 not dissolved in water  (iii) 1 atm'], 5),
  gg('so2', 'dioxide', fb(60, 250, 220, 80, ['SO2'], CY) + fb(60, 400, 220, 80, ['O2 from air'], CY) + farrow(280, 290, 420, 330, CY, 5) + farrow(280, 440, 420, 420, CY, 5)),
  gg('cv', 'converter', `${box(420, 290, 240, 200, YL, 'rgba(255,210,63,.1)')}${T(540, 335, 'CONVERTER', 30, YL)}${chemT(540, 380, 'temp: 450 °C', 26, '#fff')}${chemT(540, 415, 'press: 1 atm', 26, '#fff')}${chemT(540, 450, 'catalyst V2O5', 26, '#fff')}`),
  gg('s3', 'trioxide', farrow(660, 380, 760, 380, OR, 5) + fb(760, 340, 180, 80, ['SO3'], OR)),
  gg('ol', 'oleum', farrow(850, 420, 850, 520, OR, 5) + fb(760, 520, 180, 80, ['oleum'], OR) + lab(870, 470, 'dissolve in', BL, 16, 'start') + lab(870, 490, 'conc H2SO4', BL, 16, 'start')),
  gg('ac', 'diluted', farrow(850, 600, 850, 700, GR, 5) + fb(720, 700, 240, 90, ['conc H2SO4'], GR) + lab(870, 650, 'dilute with', BL, 16, 'start') + lab(870, 668, 'water', BL, 16, 'start')),
  gg('eq', 'reversible', `<g ${an('grow', .6, 0, 'center')}>${chemT(400, 880, '2SO2 + O2 ⇌ 2SO3', 56, '#fff')}</g>${pill(400, 980, 600, 'REVERSIBLE  +  EXOTHERMIC', YL, 32, 66)}`)
]}));

// ── C27 Q7(b)(i) WHY 450 °C ─────────────────────────────
const N27 = "Part i. Explain why four hundred and fifty degrees is used in the converter. The forward reaction gives out heat, so it is exothermic. According to Le Chatelier, a low temperature favours the forward reaction, giving a high yield of sulphur trioxide. But at a low temperature the reaction is far too slow. A high temperature gives a fast rate, but a lower yield. So four hundred and fifty degrees is a compromise. It gives a fast enough rate, with a reasonable yield, and the vanadium oxide catalyst works well at this temperature.";
const GX = 170, GY = 290, GW = 660, GH = 360, GT = t => (t - 200) / 500;
const gr = graph(GX, GY, GW, GH, 700, 100, [200, 300, 400, 500, 600, 700], [0, 50, 100], 'Temperature (°C)', 'yield / rate');
const yPts = Array.from({ length: 21 }, (_, i) => { const t = 200 + i * 25; return [gr.X(t), gr.Y(98 - 68 * GT(t))]; });
const rPts = Array.from({ length: 21 }, (_, i) => { const t = 200 + i * 25; return [gr.X(t), gr.Y(5 + 90 * GT(t) * GT(t))]; });
CS.push(scn(BG.blue, N27, { badge: 'Q7(b)(i)  WHY 450 °C?', groups: [
  qGroup('Q7(b)(i)', ['Explain why a temperature of 450 °C is used', 'in the converter.'], 2),
  gg('gx', 'forward', gr.svg),
  gg('yl', 'yield', dr(smoothPath(yPts), 0, 2.5, 7, CY) + lab(gr.X(230), gr.Y(100) - 16, 'YIELD', CY, 28, 'start')),
  gg('rt', 'fast', dr(smoothPath(rPts), 0, 2.5, 7, OR) + lab(gr.X(640), gr.Y(100) - 16, 'RATE', OR, 28, 'end')),
  gg('cp', 'compromise', `${Ln(gr.X(450), GY, gr.X(450), GY + GH, YL, 5, '8 8')}${pill(gr.X(450), GY - 8, 420, 'COMPROMISE  450 °C', YL, 28, 56)}`),
  gg('ex', 'exothermic', lab(500, 760, 'forward reaction is EXOTHERMIC: low T favours high yield', CY, 24)),
  cAns(N27, 820, 'MODEL ANSWER', [['Forward reaction is **exothermic**: low temperature gives high yield but is **too slow**', 'exothermic'], ['High temperature gives a **fast rate** but a **lower yield**', 'fast'], ['**450 °C is a compromise**: reasonable rate and yield; catalyst works well', 'compromise']])
]}));

// ── C28 Q7(b)(ii)(iii) NOT IN WATER + 1 atm ─────────────
const N28 = "Part ii. Explain why sulphur trioxide is not dissolved directly in water. The reaction between sulphur trioxide and water is violently exothermic. It produces a fine, corrosive mist of sulphuric acid, which is hard to condense and dangerous. So the sulphur trioxide is dissolved in concentrated sulphuric acid first, to make oleum, which is then safely diluted. Part iii. Explain why a pressure of one atmosphere is used. Higher pressure would favour the forward reaction, because there are fewer gas molecules on the right. But the yield is already very high at one atmosphere. High pressure needs strong, expensive equipment, uses a lot of energy, and is dangerous. So one atmosphere is enough.";
CS.push(scn(BG.blue, N28, { badge: 'Q7(b)(ii)(iii)  SAFETY + PRESSURE', groups: [
  qGroup('Q7(b)', ['(ii) Why is SO3 not dissolved directly in water?', '(iii) Why is a pressure of 1 atmosphere used?'], '3 + 2'),
  gg('w', 'violently', `${beaker(110, 330, 240, 170, 390, CY, .35)}${lab(230, 300, 'SO3 + WATER', YL, 24)}${[0, .5, 1, 1.5, 2].map(d => puff(150 + d * 40, 360, 22, d, -110, 2, 'rgba(255,255,255,.7)')).join('')}<g ${an('blink', .8)}><polygon points="400,330 440,400 360,400" fill="${YL}" stroke="${INKD}" stroke-width="4"/>${T(400, 392, '!', 36, INKD)}</g>${lab(230, 540, 'FIERCE: ACID MIST', '#ff9d9d', 22)}`),
  gg('s', 'oleum', `${M(700, 330, 'SAFE ROUTE', 26, GR)}${fb(560, 350, 150, 70, ['SO3'], OR)}${farrow(710, 385, 780, 385, OR, 4)}${fb(780, 350, 170, 70, ['oleum'], OR)}${farrow(865, 420, 865, 470, GR, 4)}${fb(780, 470, 170, 70, ['H2SO4'], GR)}${lab(600, 450, 'in conc H2SO4', BL, 18)}${lab(600, 480, '+ water', BL, 18)}`),
  gg('p', 'pressure', `${[0, 1, 2].map(i => `<circle cx="${160 + i * 60}" cy="690" r="22" fill="rgba(127,224,255,.3)" stroke="${CY}" stroke-width="4"/>`).join('')}${farrow(360, 690, 450, 690, BL, 5)}${[0, 1].map(i => `<circle cx="${500 + i * 60}" cy="690" r="22" fill="rgba(255,179,107,.3)" stroke="${OR}" stroke-width="4"/>`).join('')}${lab(250, 750, '3 gas moles', CY, 22)}${lab(560, 750, '2 gas moles', OR, 22)}${pill(790, 690, 340, 'YIELD HIGH AT 1 atm', GR, 24, 56)}${lab(790, 750, 'high pressure = costly + dangerous', '#ff9d9d', 20)}`),
  cAns(N28, 820, 'MODEL ANSWER', [['Too **violently exothermic**: makes a corrosive **acid mist**, hard to condense', 'violently'], ['Dissolve in conc. sulphuric acid to make **oleum**, then dilute', 'oleum'], ['Yield already high at 1 atm; high pressure is **expensive and dangerous**', 'expensive']], { size: 28 })
]}));

// ── C29 Q7(c)(i) HERBICIDES ──────────────────────────────
const N29 = "Part c. Part i: give any two advantages and any two disadvantages of using herbs in agriculture. The paper says herbs, but it almost certainly means herbicides, the chemicals that kill weeds, so we will answer for herbicides. Advantages: they kill weeds, so crops get more water, light and nutrients, and yields increase. They also save time and labour compared with weeding by hand. Disadvantages: they can wash into rivers and soil and pollute them. They may harm useful organisms, like bees and soil life, and weeds can become resistant. They are also expensive to buy.";
CS.push(scn(BG.blue, N29, { badge: 'Q7(c)(i)  HERBICIDES IN FARMING', groups: [
  qGroup('Q7(c)(i)', ['Give any two advantages and any two disadvantages', 'of using herbs (herbicides) in agriculture.'], 2),
  gg('fd', 'herbicides', `${Ln(60, 520, 940, 520, BL, 5)}${[170, 330, 490, 650, 810].map(x => Ln(x, 520, x, 440, GR, 6) + `<path d="M${x} 480 q-30 -20 -40 -50 M${x} 470 q30 -20 40 -50" stroke="${GR}" stroke-width="5" fill="none"/>`).join('')}${[250, 410, 570, 730].map((x, i) => `<g ${an('vanish', 1.6, 5 + i * .5, 'center')}>${Ln(x, 520, x, 470, '#c97b4a', 5)}<path d="M${x - 20} 470 l20 -22 l20 22 M${x - 14} 490 l14 -18 l14 18" stroke="#c97b4a" stroke-width="5" fill="none"/></g>`).join('')}<g transform="translate(110 520)">${stickman(0, 0, [-30, 12], [58, -20], { color: BL })}</g>${[0, .4, .8, 1.2].map(d => `<circle ${an('drift', 1.6, d, 'center', '--dx:260px;--dir:normal;--e:linear;')} cx="200" cy="438" r="6" fill="${YL}"/>`).join('')}${lab(500, 590, 'WEEDS (brown) killed  ·  CROPS (green) protected', YL, 24)}`),
  { ...cAns(N29, 640, 'ADVANTAGES (ANY 2)', [['**Kills weeds**: crops get more water, light, nutrients → higher **yields**', 'yields'], ['**Saves time and labour** (no hand weeding)', 'labour']], { w: 470, size: 26, tsize: 28, id: 'adv' }) },
  { ...cAns(N29, 640, 'DISADVANTAGES (ANY 2)', [['**Pollutes** rivers and soil (run-off)', 'wash'], ['**Harms useful organisms** (bees, soil life)', 'harm'], ['Weeds become **resistant**; **expensive**', 'resistant']], { w: 470, size: 26, tsize: 28, x: 510, col: OR, id: 'dis' }) }
]}));

// ── C30 Q7(c)(ii)(iii) ENVIRONMENTAL PROBLEMS ────────────
const N30 = "Part ii. Outline three environmental problems linked to making sulphuric acid. And part iii, suggest how each can be minimised. Problem one: sulphur dioxide escapes into the air and causes acid rain, which damages plants, buildings and water life. To reduce this, use a double contact process, to convert more sulphur dioxide, and scrub the waste gases with lime, which absorbs the sulphur dioxide. Problem two: acidic waste water, which pollutes rivers. Neutralise it with lime before releasing it. Problem three: waste heat can cause thermal pollution. Use heat exchangers to recover the heat, and use it to make steam and electricity.";
CS.push(scn(BG.blue, N30, { badge: 'Q7(c)(ii)(iii)  ENVIRONMENT', groups: [
  qGroup('Q7(c)', ['(ii) Three environmental problems of making H2SO4.', '(iii) Suggest how each can be minimised.'], 4),
  gg('p1', 'rain', `<rect x="90" y="330" width="60" height="150" ${W5}/>${[0, .7, 1.4].map(d => puff(120, 330, 24, d, -90, 2.2, 'rgba(190,190,190,.7)')).join('')}<ellipse cx="330" cy="330" rx="80" ry="36" fill="rgba(200,200,200,.4)" stroke="${BL}" stroke-width="4"/>${[0, .4, .8].map(d => `<circle ${an('rise', 1.2, d, 'center', '--dy:90px;--sc:.8;')} cx="${300 + d * 40}" cy="370" r="6" fill="${CY}"/>`).join('')}${lab(220, 540, '1. SO2 → ACID RAIN', '#ff9d9d', 26)}`),
  gg('f1', 'scrub', `${farrow(420, 420, 520, 420, GR, 5)}${box(530, 370, 400, 100, GR, 'rgba(109,255,156,.1)')}${M(730, 410, 'double contact process', 22, '#fff')}${M(730, 445, '+ scrub gases with lime', 22, '#fff')}`),
  gg('p2', 'rivers', `<path d="M90 650 H260" stroke="${OR}" stroke-width="16" stroke-linecap="round"/><path d="M80 690 q30 -20 60 0 t60 0 t60 0 t60 0" stroke="${CY}" stroke-width="6" fill="none" ${an('flow dash', 1)}/>${lab(220, 780, '2. ACIDIC WASTE WATER', '#ff9d9d', 26)}`),
  gg('f2', 'neutralise', `${farrow(420, 680, 520, 680, GR, 5)}${box(530, 640, 400, 80, GR, 'rgba(109,255,156,.1)')}${M(730, 690, 'neutralise with lime', 24, '#fff')}`),
  gg('p3', 'heat', `${[0, .5, 1].map(d => `<circle ${an('rise', 1.8, d, 'center', '--dy:-90px;--sc:1.6;')} cx="${120 + d * 50}" cy="900" r="16" fill="rgba(255,140,60,.5)"/>`).join('')}${lab(220, 960, '3. WASTE HEAT', '#ff9d9d', 26)}`),
  gg('f3', 'exchangers', `${farrow(420, 890, 520, 890, GR, 5)}${box(530, 850, 400, 80, GR, 'rgba(109,255,156,.1)')}${M(730, 900, 'heat exchangers → steam', 24, '#fff')}`),
  cAns(N30, 1010, 'MODEL ANSWER', [['SO2 → **acid rain**: double contact + **scrub** gases with lime', 'rain'], ['**Acidic waste water**: **neutralise** with lime first', 'rivers'], ['**Waste heat**: recover it with **heat exchangers** (steam/power)', 'exchangers']], { size: 27 })
]}));

// ── C31 WRAP-UP ──────────────────────────────────────────
const N31 = "That brings us to the end of this test, questions one to seven of the June 2025 Chemistry Paper 2. Remember the patterns: name the method, give the reason, show every step of a calculation, and always include units. Question eight onwards is still waiting for you, so try it yourself, then check your work. Good luck.";
const TOPS = ['Q1  separation, ions, dot and cross', 'Q2  displacement, decomposition', 'Q3  redox, energy profile, reactivity', 'Q4  coal, organic compounds', 'Q5  oxides, terylene', 'Q6  gas volumes, moles, hard water', 'Q7  ionic bonding, contact process'];
CS.push(scn(BG.blue, N31, { badge: 'QUESTIONS 1 – 7 DONE', badgeColor: GR, groups: [
  ...TOPS.map((t, i) => gg('t' + i, ['questions', 'method', 'reason', 'step', 'units', 'eight', 'check'][i], `<g transform="translate(500 ${260 + i * 100})"><g ${an('grow', .5, 0, 'center')}><rect x="-440" y="-36" width="880" height="72" rx="36" fill="rgba(0,0,0,.3)" stroke="${[YL, CY, GR, OR, PK, YL, CY][i]}" stroke-width="5"/>${T(0, 12, t, 34, '#fff', 'middle', FM, 'font-weight="bold"')}</g></g>`)),
  gg('gl', 'luck', `<g transform="translate(790 1230)">${stickman(0, 0, [-34, -8], [58, -62], { wave: true, wide: true, color: BL })}</g><g ${an('pulse', 1.6)}><ellipse cx="400" cy="1110" rx="290" ry="70" fill="#fff" stroke="${INKD}" stroke-width="5"/>${T(400, 1124, 'Now try Q8 yourself!', 40, INKD, 'middle', GEO, 'font-weight="bold"')}</g>`)
]}));

module.exports = {
    output: { title: 'zimsec-chemistry-4024-2-june-2025-q1-7', format: 'portrait', fps: 30, crf: 23, preset: 'medium' },
    defaults: { voice: 'am_adam', speed: 0.85, transition: 'fade', transitionDuration: 0.3 },
    scenes: CS.map(retimeC).map((s, i) => Object.assign(s, { transition: ['fade', 'wipe-left', 'fade', 'wipe-up'][i % 4] })),
};
