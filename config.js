// config.photon-chip-story.js
// "Could Computers Run on Light?" — APEX Video Engine config (same architecture as the rocket/solar configs)
// 13 scenes, analogy-driven: tap -> logic gates -> stadium of bits -> heat -> thin wires -> leaks
//                            -> photons -> cool + many colors -> sunglasses math -> ripple math -> why not all light -> team-up
//            -> p-n junction -> light makes current -> panel to home -> advantages -> disadvantages -> recap

const THEME = {
    paper: '#efe6d3', ink: '#231b12', accent: '#b5402c', accent2: '#2c6b5a',
    shadow: 'rgba(20,16,10,0.4)', highlight: '#ffe08a',
    bpLine: '#dff0ff', bpSoft: '#8fbcff', bpHi: '#ffd23f', cold: '#4dd0ff', sun: '#ffd23f'
};
const FI = "Impact,'Arial Black',sans-serif";
const FM = "'Courier New',Courier,monospace";

// ── helpers ─────────────────────────────────────────────────────
function T(x, y, str, size = 30, fill = THEME.ink, anchor = 'middle', font = FI, extra = '') {
    return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${fill}" font-family="${font}" ${extra}>${str}</text>`;
}
const M = (x, y, str, size = 26, fill = THEME.bpLine, anchor = 'middle') =>
    T(x, y, str, size, fill, anchor, FM, 'font-weight="bold"');
const ORG = { top: '50% 0%', bottom: '50% 100%', left: '0% 50%', right: '100% 50%', center: '50% 50%' };
function an(cls, d = 2, dl = 0, o = 'center', extra = '') {
    const org = Array.isArray(o)
        ? `transform-box:view-box;transform-origin:${o[0]}px ${o[1]}px;`
        : `transform-box:fill-box;transform-origin:${ORG[o] || o};`;
    return `class="a ${cls}" style="--d:${d}s;--dl:${dl}s;${org}${extra}"`;
}
function dr(d, dl = 0, dur = 1.6, sw = 5, col = THEME.bpLine) {
    return `<path d="${d}" pathLength="1000" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${an('draw', dur, dl, 'center', '--n:1;')}/>`;
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
function cloud(x, y, s = 1, col = '#fff', op = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})" fill="${col}" opacity="${op}"><circle r="30"/><circle cx="34" cy="-12" r="36"/><circle cx="72" cy="0" r="28"/><rect x="-30" y="0" width="130" height="28" rx="14"/></g>`;
}
function puff(x, y, r, dl = 0, dy = -260, d = 2.6, col = 'rgba(255,255,255,.6)') {
    return `<circle ${an('rise', d, dl, 'center', `--dy:${dy}px;--sc:2.2;`)} cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
}
const rng = (seed) => { let r = seed; return () => { r = (r * 9301 + 49297) % 233280; return r / 233280; }; };
function stars(n = 40, seed = 3) {
    const rnd = rng(seed); let o = '';
    for (let i = 0; i < n; i++) {
        const x = Math.round(rnd() * 1080 - 40), y = Math.round(rnd() * 1900 - 260), s = 1.5 + rnd() * 2.5;
        o += `<circle ${an('twinkle', (1.2 + rnd() * 2.5).toFixed(1), (rnd() * 2).toFixed(1))} cx="${x}" cy="${y}" r="${s.toFixed(1)}" fill="#fff"/>`;
    }
    return o;
}
function sparks(x, y, n = 8, col = '#ffd23f', len = 22, d = .5) {
    let o = '';
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + .3;
        o += `<line ${an('blink', d, i * .07)} x1="${x + Math.cos(a) * 8}" y1="${y + Math.sin(a) * 8}" x2="${x + Math.cos(a) * len}" y2="${y + Math.sin(a) * len}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
    }
    return o;
}
// a wiggly line = a light wave / photon
function wavy(x1, y1, x2, y2, amp = 14, n = 8) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    let d = `M${x1} ${y1}`;
    for (let i = 0; i < n; i++) {
        const t1 = (i + .5) / n, t2 = (i + 1) / n, s = i % 2 ? -1 : 1;
        d += ` Q${(x1 + dx * t1 + nx * amp * s).toFixed(1)} ${(y1 + dy * t1 + ny * amp * s).toFixed(1)} ${(x1 + dx * t2).toFixed(1)} ${(y1 + dy * t2).toFixed(1)}`;
    }
    return d;
}
// sun with spinning rays, centred on 0,0
function sunSvg(r = 70, fill = THEME.sun, stroke = THEME.ink) {
    return `<g ${an('pulse', 2.4)}><circle r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="6"/></g>
    <g ${an('spin', 24, 0, [0, 0])}>${Array.from({ length: 12 }, (_, i) => `<line x1="${r + 14}" y1="0" x2="${r + (i % 2 ? 34 : 54)}" y2="0" stroke="#ffb300" stroke-width="9" stroke-linecap="round" transform="rotate(${i * 30})"/>`).join('')}</g>`;
}
// solar panel, centred on 0,0
function panel(w, h, cols, rows) {
    let s = `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="8" fill="#1b3a8a" stroke="#c9ced6" stroke-width="9"/>`;
    for (let i = 1; i < cols; i++) s += `<line x1="${-w / 2 + w * i / cols}" y1="${-h / 2}" x2="${-w / 2 + w * i / cols}" y2="${h / 2}" stroke="#8fbcff" stroke-width="2.5" opacity=".7"/>`;
    for (let j = 1; j < rows; j++) s += `<line x1="${-w / 2}" y1="${-h / 2 + h * j / rows}" x2="${w / 2}" y2="${-h / 2 + h * j / rows}" stroke="#8fbcff" stroke-width="2.5" opacity=".7"/>`;
    s += `<polygon points="${-w / 2 + 8},${-h / 2 + 8} ${-w / 2 + w * .35},${-h / 2 + 8} ${-w / 2 + 8},${-h / 2 + h * .35}" fill="#fff" opacity=".16"/>`;
    return s;
}

// ── scene engine (identical to the rocket config, plus growx) ───
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
  .float{animation-name:float}.bob{animation-name:bob}.pulse{animation-name:pulse}
  .spin{animation-name:spin;--dir:normal;--e:linear}
  .flow{animation-name:flow;--dir:normal;--e:linear}.dash{stroke-dasharray:16 12}
  .rise{animation-name:rise;--dir:normal;--e:ease-out}.drift{animation-name:drift;--dir:normal;--e:linear}
  .move{animation-name:move}.moveonce{animation-name:move;--n:1;--dir:normal}
  .growx{animation-name:growx;--n:1;--dir:normal}.growy{animation-name:growy;--n:1;--dir:normal}
  .draw{animation-name:draw;--n:1;--dir:normal;--e:ease-out;stroke-dasharray:1000;stroke-dashoffset:1000}
  .rot{animation-name:rot}.twinkle{animation-name:twinkle}.wobble{animation-name:wobble}
  .blink{animation-name:blink;--e:steps(1,end)}.ring{animation-name:ring;--dir:normal;--e:ease-out}
  .fadein{animation-name:fadein;--n:1;--dir:normal}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.12);opacity:.85}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes flow{to{stroke-dashoffset:-56}}
  @keyframes rise{0%{transform:translateY(0) scale(.6);opacity:0}15%{opacity:.9}100%{transform:translateY(var(--dy,-260px)) scale(var(--sc,1.8));opacity:0}}
  @keyframes drift{from{transform:translateX(0)}to{transform:translateX(var(--dx,200px))}}
  @keyframes move{from{transform:translate(0,0)}to{transform:translate(var(--dx,0px),var(--dy,0px))}}
  @keyframes growx{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  @keyframes growy{from{transform:scaleY(0)}to{transform:scaleY(1)}}
  @keyframes draw{to{stroke-dashoffset:0}}
  @keyframes rot{from{transform:rotate(var(--r0,0deg))}to{transform:rotate(var(--r1,90deg))}}
  @keyframes twinkle{0%,100%{opacity:.2}50%{opacity:1}}
  @keyframes wobble{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
  @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:.12}}
  @keyframes ring{0%{transform:scale(.2);opacity:.9}100%{transform:scale(2.8);opacity:0}}
  @keyframes fadein{from{opacity:0}to{opacity:1}}
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

const S = [];
const INK = THEME.ink;

// ── extra helpers for this video ────────────────────────────────
const pipe = (d, w = 50, fill = '#fff') => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w - 12}" stroke-linejoin="round"/>`;
const water = (d, w = 50, dl = 0) => `<path d="${d}" fill="none" stroke="#4dd0ff" stroke-width="${w - 12}" stroke-linejoin="round" opacity=".9"/><path d="${d}" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="14 12" ${an('flow', .5, dl)}/>`;
const valve = (x, y, open) => `<g transform="translate(${x} ${y})"><line x1="0" y1="-34" x2="0" y2="-80" stroke="${INK}" stroke-width="8"/><rect x="-34" y="-34" width="68" height="68" rx="10" fill="#8a929b" stroke="${INK}" stroke-width="5"/><rect x="-32" y="-102" width="64" height="22" rx="11" fill="${open ? '#2e8b57' : '#c0392b'}" stroke="${INK}" stroke-width="4"/></g>`;
const sinePts = (x0, x1, cy, amp, ph, per = 3) => { const o = [], n = Math.round((x1 - x0) / 6); for (let i = 0; i <= n; i++) { const x = x0 + i * 6; o.push(`${x},${(cy + amp * Math.sin((x - x0) / (x1 - x0) * per * 2 * Math.PI + ph)).toFixed(1)}`); } return o.join(' '); };
const wave = (cy, amp, ph, col, w = 6) => `<polyline points="${sinePts(-330, 330, cy, amp, ph)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const LANES = ['#ff4d4d', '#ff9d3d', '#ffe14d', '#4dff88', '#4dd0ff', '#c77dff'];
const chip = (w, label) => `<rect x="${-w / 2}" y="${-w / 2}" width="${w}" height="${w}" rx="16" fill="#2b3a55" stroke="#c9ced6" stroke-width="8"/>
  ${[-.3, -.1, .1, .3].map(k => `<line x1="${-w / 2 - 28}" y1="${k * w}" x2="${-w / 2}" y2="${k * w}" stroke="#c9ced6" stroke-width="8"/><line x1="${w / 2}" y1="${k * w}" x2="${w / 2 + 28}" y2="${k * w}" stroke="#c9ced6" stroke-width="8"/><line x1="${k * w}" y1="${-w / 2 - 28}" x2="${k * w}" y2="${-w / 2}" stroke="#c9ced6" stroke-width="8"/><line x1="${k * w}" y1="${w / 2}" x2="${k * w}" y2="${w / 2 + 28}" stroke="#c9ced6" stroke-width="8"/>`).join('')}
  <rect x="${-w * .32}" y="${-w * .32}" width="${w * .64}" height="${w * .64}" rx="8" fill="#1c2630" stroke="#8fbcff" stroke-width="3"/>
  ${[-.15, 0, .15].map((k, i) => `<polyline points="${-w * .28},${k * w} ${-w * .1},${k * w} ${-w * .05},${k * w + 16} ${w * .1},${k * w + 16} ${w * .28},${k * w}" fill="none" stroke="#4dd0ff" stroke-width="5" ${an('flow dash', .8, i * .2)}/>`).join('')}
  ${T(0, w * .45 - 6, label, 30, '#fff')}`;
const wideCard = (icon, title, a1, a2, col) => `<rect x="-440" y="-150" width="880" height="300" rx="18" fill="#fff" stroke="${INK}" stroke-width="6"/><g transform="translate(-300 0)">${icon}</g>${T(-170, -30, title, 42, col, 'start')}${T(-170, 28, a1, 28, INK, 'start', FM, 'font-weight="bold"')}${T(-170, 68, a2, 28, INK, 'start', FM, 'font-weight="bold"')}`;

// ── 0 HOOK ──────────────────────────────────────────────────────
S.push(scene('#050818',
 "Your phone chip does billions of calculations every second, and it runs hot. Light is the fastest thing in the universe. So could we compute with photons instead of electrons? The answer is yes, no, and a surprising maybe.",
 comicScene({ badge: 'LIGHT VS ELECTRONS', theme: 'night', groups: [
  { id: 'stars', always: true, svg: stars(50, 31) },
  { id: 'chip', x: 500, y: 430, w: 'chip', t: .7, svg: chip(300, 'CPU') },
  { id: 'hot', x: 500, y: 430, w: 'hot', t: 4.1, svg: `<g ${an('pulse', .9)}><ellipse rx="230" ry="200" fill="rgba(255,70,40,.25)"/></g>${[-90, 0, 90].map((x, i) => `<path d="M${x} -190 q18 -30 0 -60 q-18 -30 0 -60" fill="none" stroke="#ff7a1a" stroke-width="8" stroke-linecap="round" ${an('bob', 1, i * .3)}/>`).join('')}${sfx(0, 270, 'RUNS HOT', -3, '#ff7a1a', 70, '#050818')}` },
  { id: 'light', w: 'light', t: 4.5, svg: `<path d="${wavy(40, 850, 960, 850, 22, 18)}" fill="none" stroke="#ffd23f" stroke-width="9" stroke-linecap="round" ${an('flow dash', .5)}/>${T(500, 810, 'LIGHT: THE FASTEST THING THERE IS', 34, '#ffd23f')}` },
  { id: 'ph', x: 300, y: 1030, w: 'photons', t: 9, svg: `<g ${an('pulse', 1)}><circle r="46" fill="#ffd23f" stroke="#fff" stroke-width="6"/></g>${T(0, 100, 'PHOTONS', 40, '#ffd23f')}` },
  { id: 'vs', x: 500, y: 1050, w: 'photons', t: 9.5, svg: `${T(0, 0, 'VS', 56, '#fff')}` },
  { id: 'el', x: 700, y: 1030, w: 'electrons', t: 10, svg: `<g ${an('pulse', 1.2)}><circle r="46" fill="#4dd0ff" stroke="#fff" stroke-width="6"/>${T(0, 14, 'e-', 40, '#050818')}</g>${T(0, 100, 'ELECTRONS', 40, '#4dd0ff')}` },
  { id: 'yes', x: 190, y: 1300, w: 'yes', t: 11.4, svg: sfx(0, 0, 'YES', -4, '#6dff9c', 90, '#050818') },
  { id: 'no', x: 440, y: 1300, w: 'no', t: 11.7, svg: sfx(0, 0, 'NO', 3, '#ff6b6b', 90, '#050818') },
  { id: 'maybe', x: 780, y: 1300, w: 'maybe', t: 13.1, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'MAYBE', -3, '#ffd23f', 96, '#050818')}</g>` }
 ]})));

// ── 1 THE TRANSISTOR IS A TAP ───────────────────────────────────
S.push(scene(THEME.paper,
 "Inside every chip are tens of billions of tiny switches called transistors. Think of each one as a water tap. Turn the handle on, and water flows. That's a one. Turn it off, and nothing flows. That's a zero. The handle is a small voltage, and the water is electrons.",
 comicScene({ badge: '1 - THE CHIP IS A TAP', badgeColor: THEME.accent2, groups: [
  { id: 'bill', x: 500, y: 110, w: 'billions', t: 2.1, svg: `${sfx(0, 0, 'TENS OF BILLIONS', -2, THEME.accent, 72, '#fff')}${T(0, 56, 'of switches on one chip', 30, INK, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'tr', x: 500, y: 290, w: 'transistors', t: 3.8, svg: T(0, 0, 'TRANSISTOR = A TINY SWITCH', 42) },
  { id: 'tap', w: 'tap', t: 6.6, svg: `${pipe('M80 760 H920', 56)}<rect x="450" y="690" width="100" height="140" rx="14" fill="#8a929b" stroke="${INK}" stroke-width="6"/><line x1="500" y1="690" x2="500" y2="640" stroke="${INK}" stroke-width="12"/>${T(130, 700, 'IN', 30)}${T(870, 700, 'OUT', 30)}` },
  { id: 'on', w: 'on', t: 7.9, hw: 'off', ht: 11, svg: `${water('M90 760 H446', 56)}${water('M554 760 H910', 56, .2)}<line x1="500" y1="650" x2="590" y2="590" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><circle cx="596" cy="586" r="24" fill="#2e8b57" stroke="${INK}" stroke-width="6"/>${T(640, 570, 'OPEN', 36, THEME.accent2, 'start')}` },
  { id: 'off', w: 'off', t: 11, svg: `${water('M90 760 H446', 56)}<line x1="500" y1="650" x2="500" y2="580" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><circle cx="500" cy="566" r="24" fill="#c0392b" stroke="${INK}" stroke-width="6"/>${T(560, 570, 'CLOSED', 36, THEME.accent, 'start')}` },
  { id: 'b1', x: 500, y: 1070, w: 'flows', t: 9, hw: 'off', ht: 11, svg: `<circle r="90" fill="#fff" stroke="${INK}" stroke-width="7"/>${T(0, 38, '1', 120, THEME.accent2)}${T(0, 150, 'ON = ONE', 40)}` },
  { id: 'b0', x: 500, y: 1070, w: 'zero', t: 13.1, svg: `<circle r="90" fill="#fff" stroke="${INK}" stroke-width="7"/>${T(0, 38, '0', 120, THEME.accent)}${T(0, 150, 'OFF = ZERO', 40)}` },
  { id: 'vo', x: 230, y: 520, w: 'voltage', t: 15.2, svg: `${T(0, 0, 'HANDLE = VOLTAGE', 34, THEME.accent)}${arrow(110, 20, 230, 100, THEME.accent, 6)}` },
  { id: 'el', x: 500, y: 900, w: 'electrons', t: 16.9, svg: `${T(0, 0, 'WATER = ELECTRONS', 34, '#1565c0')}${arrow(-120, -30, -170, -90, '#1565c0', 6)}` }
 ]})));

// ── 2 TAPS BECOME LOGIC ─────────────────────────────────────────
const tileG = (id, w, t, x, label, fs = 40) => ({ id, x, y: 1260, w, t, svg: `<rect x="-110" y="-55" width="220" height="110" rx="14" fill="#fff" stroke="${INK}" stroke-width="6"/>${T(0, fs / 3, label, fs, THEME.accent2)}` });
S.push(scene(THEME.paper,
 "Connect two taps in a row, and water only reaches the end if both are open. That's an AND gate. Put them side by side, and water arrives if either one is open. That's an OR gate. Stack enough of these gates and you can add numbers, multiply them, and run your whole phone.",
 comicScene({ badge: '2 - TAPS BECOME LOGIC', badgeColor: THEME.accent2, groups: [
  { id: 'row', x: 500, y: 350, w: 'row', t: 1.7, svg: `${pipe('M-400 0 H400')}${valve(-120, 0, false)}${valve(120, 0, false)}${T(-370, 50, 'IN', 28)}${T(370, 50, 'OUT', 28)}` },
  { id: 'both', x: 500, y: 350, w: 'both', t: 4.5, svg: `${water('M-396 0 H-154')}${water('M-86 0 H86', 50, .2)}${water('M154 0 H396', 50, .4)}${valve(-120, 0, true)}${valve(120, 0, true)}${T(0, 110, 'OUT = 1', 48, THEME.accent2)}` },
  { id: 'and', x: 500, y: 170, w: 'gate', t: 6.6, svg: T(0, 0, 'AND GATE: BOTH TAPS OPEN', 38, THEME.accent2) },
  { id: 'side', x: 500, y: 830, w: 'side', t: 7.6, svg: `${pipe('M-400 0 H-250')}${pipe('M-250 0 V-90 H250 V0')}${pipe('M-250 0 V90 H250 V0')}${pipe('M250 0 H400')}${valve(0, -90, false)}${valve(0, 90, false)}${T(-370, 50, 'IN', 28)}${T(370, 50, 'OUT', 28)}` },
  { id: 'either', x: 500, y: 830, w: 'either', t: 10, svg: `${water('M-396 0 H-250 V-90 H-40')}${water('M40 -90 H250 V0 H396', 50, .2)}${valve(0, -90, true)}${T(0, 190, 'OUT = 1', 48, THEME.accent2)}` },
  { id: 'or', x: 500, y: 700, w: 'or', t: 12.1, svg: T(0, 0, 'OR GATE: EITHER TAP OPEN', 38, THEME.accent2) },
  { id: 'stk', x: 500, y: 1110, w: 'stack', t: 12.8, svg: sfx(0, 0, 'STACK BILLIONS OF GATES', -2, THEME.accent, 56, '#fff') },
  tileG('t1', 'add', 15.5, 160, 'ADD'),
  tileG('t2', 'multiply', 16.2, 500, 'MULTIPLY', 36),
  tileG('t3', 'phone', 18.3, 840, 'RUN A PHONE', 28)
 ]})));

// ── 3 THE STADIUM OF BITS ───────────────────────────────────────
const SMILE = ['....######....', '..##########..', '.############.', '####..##..####', '####..##..####', '##############', '##############', '##.########.##', '###.######.###', '.####....####.', '..##########..', '....######....', '..............', '..............'];
const gridBase = (() => { const r = rng(7); let o = ''; for (let j = 0; j < 14; j++) for (let i = 0; i < 14; i++) { const b = r() > .5; o += `<rect x="${-403 + i * 58}" y="${-403 + j * 58}" width="52" height="52" rx="6" fill="${b ? INK : '#fff'}" stroke="${INK}" stroke-width="3"/>`; } return o; })();
const gridFlip = (() => { const r = rng(7), q = rng(77); let o = ''; for (let j = 0; j < 14; j++) for (let i = 0; i < 14; i++) { const b = r() > .5; if (q() < .6) o += `<rect x="${-403 + i * 58}" y="${-403 + j * 58}" width="52" height="52" rx="6" fill="${b ? '#fff' : INK}" stroke="${INK}" stroke-width="3" ${an('blink', (.3 + q() * .6).toFixed(2), (q() * .5).toFixed(2), 'center', '--dir:normal;')}/>`; } return o; })();
const gridPic = SMILE.map((row, j) => row.split('').map((c, i) => `<rect x="${-403 + i * 58}" y="${-403 + j * 58}" width="52" height="52" rx="6" fill="${c === '#' ? '#ffd23f' : '#fff'}" stroke="${INK}" stroke-width="3"/>`).join('')).join('');
S.push(scene(THEME.paper,
 "A modern chip flips these taps billions of times every second. Picture a giant stadium where every person holds up a black or white card, and everyone flips at once, billions of times a second. The patterns they form are your video, your game, your message.",
 comicScene({ badge: '3 - THE STADIUM OF BITS', badgeColor: THEME.accent2, groups: [
  { id: 'clk', x: 500, y: 120, w: 'billions', t: 2.1, svg: `${sfx(0, 0, '~5 BILLION FLIPS', -2, THEME.accent, 72, '#fff')}${T(0, 58, 'EVERY SECOND', 36)}` },
  { id: 'grid', x: 500, y: 760, w: 'stadium', t: 4.8, svg: gridBase },
  { id: 'bw', x: 500, y: 1210, w: 'black', t: 7.2, svg: T(0, 0, 'BLACK CARD = 1    WHITE CARD = 0', 32, INK, 'middle', FM, 'font-weight="bold"') },
  { id: 'flip', x: 500, y: 760, w: 'once', t: 10, svg: gridFlip },
  { id: 'pic', x: 500, y: 760, w: 'patterns', t: 12.4, svg: gridPic },
  { id: 'p1', x: 190, y: 1330, w: 'video', t: 14.1, svg: `<rect x="-130" y="-40" width="260" height="80" rx="40" fill="${THEME.accent}" stroke="${INK}" stroke-width="5"/>${T(0, 14, 'VIDEO', 44, '#fff')}` },
  { id: 'p2', x: 500, y: 1330, w: 'game', t: 14.8, svg: `<rect x="-130" y="-40" width="260" height="80" rx="40" fill="${THEME.accent2}" stroke="${INK}" stroke-width="5"/>${T(0, 14, 'GAME', 44, '#fff')}` },
  { id: 'p3', x: 810, y: 1330, w: 'message', t: 15.5, svg: `<rect x="-130" y="-40" width="260" height="80" rx="40" fill="#2d5fb5" stroke="${INK}" stroke-width="5"/>${T(0, 14, 'MESSAGE', 44, '#fff')}` }
 ]})));

// ── 4 PROBLEM 1: HEAT ───────────────────────────────────────────
S.push(scene(THEME.paper,
 "But electrons have a problem. They carry charge and they crash into the atoms of the metal. Picture a crowd sprinting down a hallway full of furniture. Every bump wastes energy as heat. That is why your phone gets warm, and why data centers need giant cooling systems.",
 comicScene({ badge: '4 - PROBLEM: HEAT', badgeColor: THEME.accent, groups: [
  { id: 'prob', x: 500, y: 100, w: 'problem', t: 1.4, svg: sfx(0, 0, 'PROBLEM 1: HEAT', -2, THEME.accent, 72, '#fff') },
  { id: 'hall', w: 'atoms', t: 4.5, svg: `<rect x="60" y="190" width="880" height="16" fill="#8a7f6f" stroke="${INK}" stroke-width="4"/><rect x="60" y="590" width="880" height="16" fill="#8a7f6f" stroke="${INK}" stroke-width="4"/>
    ${[[200, 330], [340, 480], [480, 340], [620, 490], [760, 330], [260, 500], [560, 260], [860, 480]].map(([x, y], i) => `<g transform="translate(${x} ${y})"><g ${an('wobble', .4 + i * .05)}><circle r="32" fill="#c8702a" stroke="${INK}" stroke-width="5"/><circle cx="-8" cy="-8" r="8" fill="#fff" opacity=".4"/></g></g>`).join('')}${T(500, 650, 'A WIRE, UP CLOSE', 30, INK, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'crowd', w: 'crowd', t: 6.6, svg: [240, 300, 380, 440, 520, 560].map((y, i) => `<g transform="translate(70 ${y})"><g ${an('move', 2.2 + i * .25, i * .3, 'center', '--dx:820px;')}><g ${an('bob', .18, i * .05)}><circle r="14" fill="#4dd0ff" stroke="${INK}" stroke-width="3"/><text y="5" font-size="15" text-anchor="middle" font-family="${FI}" fill="${INK}">e</text></g></g></g>`).join('') },
  { id: 'furn', x: 500, y: 720, w: 'furniture', t: 9, svg: `${T(0, 0, 'ATOMS = FURNITURE', 36, '#8a5a1a')}${T(0, 48, 'ELECTRONS = THE CROWD', 36, '#1565c0')}` },
  { id: 'bump', w: 'bump', t: 9.7, svg: [[340, 480], [480, 340], [620, 490], [760, 330]].map(([x, y], i) => sparks(x, y, 6, '#ff7a1a', 46, .35 + i * .05)).join('') },
  { id: 'heat', w: 'heat', t: 11, svg: `<g ${an('pulse', .9)}><ellipse cx="500" cy="400" rx="470" ry="260" fill="rgba(230,60,40,.16)"/></g>${[200, 500, 800].map((x, i) => `<path d="M${x} 170 q20 -30 0 -60 q-20 -30 0 -60" fill="none" stroke="#e63946" stroke-width="8" stroke-linecap="round" ${an('bob', 1, i * .3)}/>`).join('')}${sfx(500, 800, 'WASTED AS HEAT', -2, '#e63946', 60, '#fff')}` },
  { id: 'ph', x: 250, y: 1100, w: 'phone', t: 12.8, svg: `<g ${an('pulse', 1)}><ellipse rx="130" ry="150" fill="rgba(230,60,40,.22)"/></g><rect x="-60" y="-110" width="120" height="220" rx="20" fill="#222" stroke="${INK}" stroke-width="6"/><rect x="-50" y="-90" width="100" height="170" rx="8" fill="#ff9d7a"/>${[-30, 10].map((x, i) => `<path d="M${x} -120 q10 -20 0 -36" fill="none" stroke="#e63946" stroke-width="6" stroke-linecap="round" ${an('bob', .8, i * .3)}/>`).join('')}${T(0, 170, 'WARM PHONE', 34)}` },
  { id: 'dc', x: 730, y: 1100, w: 'cooling', t: 15.9, svg: `${[-110, 0, 110].map((x, i) => `<rect x="${x - 45}" y="-110" width="90" height="230" rx="8" fill="#3a4654" stroke="${INK}" stroke-width="5"/>${[0, 1, 2, 3].map(k => `<circle cx="${x - 20}" cy="${-80 + k * 40}" r="6" fill="${['#6dff9c', '#ffd23f', '#ff4d4d', '#6dff9c'][k]}" ${an('blink', .8 + k * .2, i * .2)}/>`).join('')}`).join('')}
    <g transform="translate(0 -170)"><circle r="42" fill="#fff" stroke="${INK}" stroke-width="5"/><g ${an('spin', .8, 0, [0, 0])}>${[0, 90, 180, 270].map(a => `<ellipse cx="0" cy="-22" rx="9" ry="20" fill="#4dd0ff" stroke="${INK}" stroke-width="3" transform="rotate(${a})"/>`).join('')}</g></g>${T(0, 190, 'GIANT COOLING', 34)}` }
 ]})));

// ── 5 PROBLEM 2: WIRES ──────────────────────────────────────────
S.push(scene(THEME.paper,
 "The wires are an even bigger problem. As chips shrink, wires get thinner, like a garden hose squeezed down to a coffee straw. Pushing signals through gets slower and hotter. Today, moving data around a chip can cost more energy than the math itself.",
 comicScene({ badge: '5 - PROBLEM: WIRES', badgeColor: THEME.accent, groups: [
  { id: 'tt', x: 500, y: 100, w: 'wires', t: .3, svg: sfx(0, 0, 'PROBLEM 2: WIRES', -2, THEME.accent, 72, '#fff') },
  { id: 'fun', w: 'thinner', t: 4.1, svg: `<polygon points="80,200 520,318 920,318 920,354 520,354 80,460" fill="#cfd6de" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
    ${[0, 1, 2, 3].map(i => `<g transform="translate(110 ${250 + i * 50})"><g ${an('drift', 3, -i * .7, 'center', '--dx:330px;')}><circle r="14" fill="#4dd0ff" stroke="${INK}" stroke-width="3"/></g></g>`).join('')}` },
  { id: 'hose', x: 230, y: 160, w: 'hose', t: 5.5, svg: T(0, 0, 'GARDEN HOSE', 36, '#2e8b57') },
  { id: 'straw', x: 740, y: 280, w: 'straw', t: 7.6, svg: T(0, 0, 'COFFEE STRAW', 36, THEME.accent) },
  { id: 'jam', w: 'slower', t: 9.3, svg: `${[[430, 320], [450, 345], [425, 365], [470, 335], [455, 305], [400, 340]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="13" fill="#ff7a7a" stroke="${INK}" stroke-width="3" ${an('wobble', .3, i * .05)}/>`).join('')}${sfx(500, 520, 'TRAFFIC JAM', -3, THEME.accent, 56, '#fff')}` },
  { id: 'hot', w: 'hotter', t: 10, svg: `<g ${an('pulse', .8)}><ellipse cx="560" cy="336" rx="240" ry="70" fill="rgba(230,60,40,.28)"/></g>${[500, 580, 660].map((x, i) => `<path d="M${x} 290 q14 -22 0 -44 q-14 -22 0 -44" fill="none" stroke="#e63946" stroke-width="7" stroke-linecap="round" ${an('bob', .9, i * .3)}/>`).join('')}` },
  { id: 'bars', x: 500, y: 1330, w: 'energy', t: 13.4, svg: `${T(0, -440, 'ENERGY COST', 42, INK)}
    <rect x="-250" y="-340" width="180" height="340" fill="#e63946" stroke="${INK}" stroke-width="6"/><g ${an('growy', 1.2, 0, 'bottom')}><rect x="-250" y="-340" width="180" height="340" fill="#e63946" stroke="${INK}" stroke-width="6"/></g>
    <g ${an('growy', 1.2, .3, 'bottom')}><rect x="70" y="-90" width="180" height="90" fill="#2e8b57" stroke="${INK}" stroke-width="6"/></g>
    ${T(-160, 50, 'MOVING DATA', 30)}${T(160, 50, 'THE MATH', 30)}` }
 ]})));

// ── 6 PROBLEM 3: LEAKS (blueprint) ──────────────────────────────
S.push(scene('#0f3d7a',
 "And the switches themselves are nearly atom sized. The barrier inside a transistor is only a few atoms thick, so electrons sometimes slip straight through, like a ghost walking through a wall. Those leaks waste power, and clock speeds have been stuck around a few gigahertz for years.",
 comicScene({ badge: '6 - PROBLEM: LEAKS', theme: 'blue', groups: [
  { id: 'fr', x: 500, y: 380, w: 'switches', t: .7, svg: `${M(0, -280, 'PROBLEM 3: TINY SWITCHES', 32, THEME.bpHi)}
    ${dr('M-340 70 H340 V220 H-340Z', 0, 1.6)}${dr('M-340 70 V10 H-180 V70', .4, 1.2)}${dr('M340 70 V10 H180 V70', .4, 1.2)}${dr('M-140 52 V-30 H140 V52', .8, 1.2)}
    ${M(-260, -10, 'SOURCE', 24)}${M(260, -10, 'DRAIN', 24)}${M(0, -50, 'GATE (THE HANDLE)', 24, THEME.bpHi)}
    <line x1="-300" y1="120" x2="300" y2="120" stroke="#4dd0ff" stroke-width="6" ${an('flow dash', .7)}/>${M(0, 160, 'ELECTRONS FLOW HERE', 22, '#7fe0ff')}` },
  { id: 'bar', x: 500, y: 380, w: 'barrier', t: 3.1, svg: `<rect x="-130" y="52" width="260" height="16" fill="${THEME.bpHi}"/>${M(0, 270, 'BARRIER (INSULATOR)', 26, THEME.bpHi)}${dr('M0 258 V76', 0, .8, 4, THEME.bpHi)}` },
  { id: 'at', x: 500, y: 640, w: 'atoms', t: 5.9, svg: `${[-90, -30, 30, 90].map(x => `<circle cx="${x}" cy="0" r="24" fill="#2b3a55" stroke="${THEME.bpLine}" stroke-width="5"/>`).join('')}${M(0, 70, 'ONLY A FEW ATOMS THICK', 26, '#fff')}` },
  { id: 'gh', x: 500, y: 960, w: 'ghost', t: 9.3, svg: `<rect x="-40" y="-120" width="80" height="240" fill="#7d8791" stroke="${THEME.bpLine}" stroke-width="6"/>${M(0, 170, 'WALL', 28, '#fff')}
    <g transform="translate(-260 0)"><g ${an('move', 3, 0, 'center', '--dx:520px;')}><path d="M-34 30 V-6 A34 34 0 0 1 34 -6 V30 L22 18 L11 30 L0 18 L-11 30 L-22 18Z" fill="#fff" fill-opacity=".85" stroke="${THEME.bpLine}" stroke-width="4"/><circle cx="-11" cy="-8" r="5" fill="#0f3d7a"/><circle cx="11" cy="-8" r="5" fill="#0f3d7a"/></g></g>${M(-250, 90, 'ELECTRON = GHOST', 22, THEME.bpHi)}` },
  { id: 'lk', x: 500, y: 1130, w: 'leaks', t: 11.4, svg: `${sfx(0, 0, 'LEAKS WASTE POWER', -2, '#ff9d9d', 58, '#0f3d7a')}` },
  { id: 'ck', x: 500, y: 1330, w: 'clock', t: 12.8, svg: `${dr('M-330 0 V-160 M-330 0 H330', 0, 1, 4)}${dr('M-310 -10 L-220 -20 L-130 -80 L-40 -130 L40 -146 L130 -148 L230 -150 L320 -150', .5, 2.2, 8, THEME.bpHi)}${M(-330, 40, '1995', 22, THEME.bpSoft)}${M(0, 40, '2005', 22, THEME.bpSoft)}${M(330, 40, 'TODAY', 22, THEME.bpSoft)}${M(-370, -90, 'GHz', 24, '#fff')}` },
  { id: 'gz', x: 500, y: 1245, w: 'gigahertz', t: 15.5, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'STUCK AT A FEW GHz', -2, THEME.bpHi, 54, '#0f3d7a')}</g>` }
 ]})));

// ── 7 ENTER THE PHOTON ──────────────────────────────────────────
S.push(scene('#cfeeff',
 "Now meet the photon, a particle of light. It has no electric charge, and it travels at the top speed anything can go. Two electron streams crossing would collide, like cars at an intersection. But shine two flashlights across each other, and the beams pass straight through, no crash, no traffic jam.",
 comicScene({ badge: '7 - ENTER THE PHOTON', badgeColor: THEME.accent, theme: 'sky', groups: [
  { id: 'ph', x: 250, y: 220, w: 'photon', t: 1, svg: `<g ${an('pulse', 1)}><circle r="44" fill="#ffd23f" stroke="${INK}" stroke-width="6"/></g><path d="${wavy(-200, 0, -60, 0, 14, 6)}" fill="none" stroke="#ff9900" stroke-width="8" stroke-linecap="round" ${an('flow dash', .5)}/>${T(0, 110, 'A PHOTON', 40)}` },
  { id: 'chg', x: 730, y: 190, w: 'charge', t: 4.1, svg: sfx(0, 0, '0 CHARGE', -3, THEME.accent2, 64, '#fff') },
  { id: 'spd', x: 730, y: 300, w: 'speed', t: 6.6, svg: sfx(0, 0, 'TOP SPEED!', 3, THEME.accent, 64, '#fff') },
  { id: 'cars', x: 500, y: 720, w: 'collide', t: 9.7, svg: `${T(0, -230, 'ELECTRONS: CARS AT AN INTERSECTION', 32, '#1565c0')}
    <rect x="-380" y="-50" width="760" height="100" fill="#6b6b6b"/><rect x="-50" y="-170" width="100" height="340" fill="#6b6b6b"/>
    <line x1="-370" y1="0" x2="-60" y2="0" stroke="#ffd23f" stroke-width="5" stroke-dasharray="18 14"/><line x1="60" y1="0" x2="370" y2="0" stroke="#ffd23f" stroke-width="5" stroke-dasharray="18 14"/>
    <g transform="translate(-300 0)"><g ${an('move', 1.4, 0, 'center', '--dx:230px;')}><rect x="-40" y="-20" width="80" height="40" rx="8" fill="#2d5fb5" stroke="${INK}" stroke-width="4"/><rect x="-10" y="-14" width="30" height="28" fill="#bfe6ff"/></g></g>
    <g transform="translate(0 -150)"><g ${an('move', 1.4, 0, 'center', '--dy:120px;')}><rect x="-20" y="-40" width="40" height="80" rx="8" fill="#e63946" stroke="${INK}" stroke-width="4"/><rect x="-14" y="-10" width="28" height="30" fill="#bfe6ff"/></g></g>
    ${sparks(0, 0, 10, '#ff7a1a', 50, .35)}${sfx(120, -60, 'CRASH!', 8, THEME.accent, 64, '#fff')}` },
  { id: 'fl', x: 500, y: 1130, w: 'flashlights', t: 12.8, svg: `${T(0, -210, 'PHOTONS: TWO FLASHLIGHTS', 32, '#b36b00')}
    <polygon points="-330,-96 400,40 400,100" fill="rgba(255,210,60,.5)"/><polygon points="-330,96 400,-40 400,-100" fill="rgba(77,208,255,.45)"/>
    <line x1="-330" y1="-96" x2="400" y2="70" stroke="#ff9900" stroke-width="6" ${an('flow dash', .5)}/><line x1="-330" y1="96" x2="400" y2="-70" stroke="#0a7ea4" stroke-width="6" ${an('flow dash', .5)}/>
    <rect x="-430" y="-124" width="100" height="56" rx="10" fill="#555" stroke="${INK}" stroke-width="5"/><rect x="-430" y="68" width="100" height="56" rx="10" fill="#555" stroke="${INK}" stroke-width="5"/>` },
  { id: 'pt', x: 500, y: 1370, w: 'through', t: 15.9, svg: sfx(0, 0, 'THEY PASS THROUGH', -2, THEME.accent2, 60, '#fff') },
  { id: 'nj', x: 800, y: 1000, w: 'jam', t: 17.6, svg: `<g ${an('pulse', .8)}>${sfx(0, 0, 'NO JAM!', 4, THEME.accent2, 64, '#fff')}</g>` }
 ]})));

// ── 8 COOL AND MANY COLORS ──────────────────────────────────────
const therm = (x, h, col, label) => `<g transform="translate(${x} 0)"><rect x="-18" y="-130" width="36" height="200" rx="18" fill="#fff" stroke="#fff" stroke-width="5"/><circle cy="80" r="34" fill="${col}" stroke="#fff" stroke-width="5"/><g ${an('growy', 1.4, 0, 'bottom')}><rect x="-9" y="${70 - h}" width="18" height="${h}" fill="${col}"/></g>${T(0, 170, label, 32, '#fff')}</g>`;
S.push(scene('#050818',
 "Light inside a glass channel does not bump into atoms the way electrons do, so far less energy is lost as heat. And light can carry many colors at once, like a highway where every lane is a different color. One channel, many conversations, all at the same time.",
 comicScene({ badge: '8 - COOL AND PARALLEL', theme: 'night', groups: [
  { id: 'stars', always: true, svg: stars(40, 41) },
  { id: 'hw', x: 500, y: 150, w: 'highway', t: 11, svg: sfx(0, 0, 'LIKE A HIGHWAY', -2, '#ffd23f', 64, '#050818') },
  { id: 'tube', x: 500, y: 400, w: 'glass', t: 1, svg: `<rect x="-440" y="-140" width="880" height="280" rx="40" fill="rgba(160,210,255,.12)" stroke="#8fd0ff" stroke-width="7"/>${T(0, -170, 'GLASS CHANNEL (WAVEGUIDE)', 34, '#fff')}` },
  { id: 'beam', x: 500, y: 400, w: 'bump', t: 2.4, hw: 'colors', ht: 9.3, svg: `<line x1="-420" y1="0" x2="420" y2="0" stroke="#fff" stroke-width="16" stroke-dasharray="30 26" ${an('flow', .5)}/>${T(0, 200, 'ONE LIGHT PULSE, NO BUMPS', 30, '#8fd0ff')}` },
  { id: 'lanes', x: 500, y: 400, w: 'colors', t: 9.3, svg: LANES.map((c, i) => `<line x1="-420" y1="${-100 + i * 40}" x2="420" y2="${-100 + i * 40}" stroke="${c}" stroke-width="14" stroke-dasharray="30 26" ${an('flow', .5 + i * .06, i * .1)}/>`).join('') },
  { id: 'ln', x: 500, y: 610, w: 'lane', t: 12, svg: T(0, 0, 'EACH COLOR = ITS OWN LANE', 36, '#fff') },
  { id: 'cv', x: 500, y: 740, w: 'conversations', t: 14.8, svg: LANES.map((c, i) => `<g transform="translate(${-350 + i * 140} 0)"><g ${an('bob', .9, i * .15)}><rect x="-48" y="-30" width="96" height="60" rx="18" fill="${c}"/><polygon points="-18,28 -30,52 2,28" fill="${c}"/>${[-20, 0, 20].map(x => `<circle cx="${x}" cy="0" r="6" fill="#fff"/>`).join('')}</g></g>`).join('') },
  { id: 'cool', x: 500, y: 960, w: 'heat', t: 7.2, svg: `${therm(-220, 40, '#4dd0ff', 'PHOTONS: COOL')}${therm(220, 170, '#ff4d4d', 'ELECTRONS: HOT')}` },
  { id: 'tm', x: 500, y: 1300, w: 'time', t: 16.5, svg: `<g ${an('pulse', .8)}>${sfx(0, 0, 'ALL AT ONCE!', -3, '#ffd23f', 84, '#050818')}</g>` }
 ]})));

// ── 9 MATH WITH SUNGLASSES ──────────────────────────────────────
const LENS = [[520, .5, .5], [680, .8, .2], [840, .2, .8]];
S.push(scene(THEME.paper,
 "Light can even do math while it travels. Think of sunglasses. Light passing through tinted glass gets dimmed by a set amount, and that is multiplication. Merge several beams onto one sensor, and their brightness adds up. Multiply and add, that is most of what AI needs, done at the speed of light.",
 comicScene({ badge: '9 - MATH WITH SUNGLASSES', badgeColor: THEME.accent2, groups: [
  { id: 'tt', x: 500, y: 100, w: 'math', t: 1.4, svg: sfx(0, 0, 'MATH WITH LIGHT', -2, THEME.accent, 72, '#fff') },
  { id: 'sg', w: 'sunglasses', t: 3.4, svg: `<g transform="translate(500 270)"><ellipse cx="-70" rx="60" ry="42" fill="#222" stroke="${INK}" stroke-width="6"/><ellipse cx="70" rx="60" ry="42" fill="#222" stroke="${INK}" stroke-width="6"/><path d="M-12 -6 Q0 -18 12 -6" fill="none" stroke="${INK}" stroke-width="7"/><ellipse cx="-86" cy="-14" rx="16" ry="8" fill="#fff" opacity=".3"/></g>${T(500, 370, 'THINK: SUNGLASSES', 36)}
    ${LENS.map(([y, k, o]) => `<line x1="40" y1="${y}" x2="300" y2="${y}" stroke="#ffb300" stroke-width="24" stroke-linecap="round"/><line x1="40" y1="${y}" x2="300" y2="${y}" stroke="#fff" stroke-width="5" stroke-dasharray="14 12" ${an('flow', .5)}/><rect x="300" y="${y - 62}" width="60" height="124" rx="16" fill="rgba(20,20,20,${o})" stroke="${INK}" stroke-width="6"/>`).join('')}${T(170, 460, 'FULL BRIGHT IN', 28, INK, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'dim', w: 'dimmed', t: 5.9, svg: LENS.map(([y, k]) => `<line x1="360" y1="${y}" x2="460" y2="${y}" stroke="#ffb300" stroke-width="${Math.max(4, 24 * k)}" stroke-linecap="round"/>${T(330, y - 76, `x${k}`, 38, THEME.accent)}`).join('') },
  { id: 'mul', x: 500, y: 960, w: 'multiplication', t: 8.6, svg: T(0, 0, 'DIMMING = MULTIPLYING', 40, THEME.accent) },
  { id: 'mg', w: 'merge', t: 9, svg: LENS.map(([y, k]) => `<path d="M460 ${y} Q640 ${y} 750 680" fill="none" stroke="#ffb300" stroke-width="${Math.max(4, 24 * k)}" stroke-linecap="round" opacity=".9"/>`).join('') },
  { id: 'sn', x: 820, y: 680, w: 'sensor', t: 10.7, svg: `<g ${an('pulse', 1)}><circle r="72" fill="#1c2630" stroke="${INK}" stroke-width="7"/><circle r="40" fill="#ffe08a" opacity=".85"/></g>${T(0, 130, 'SENSOR', 30)}` },
  { id: 'sum', x: 820, y: 860, w: 'adds', t: 12.1, svg: `${T(0, 0, '0.5+0.8+0.2', 30, INK, 'middle', FM, 'font-weight="bold"')}${sfx(0, 56, '= 1.5', -3, THEME.accent2, 56, '#fff')}` },
  { id: 'mm', x: 500, y: 1090, w: 'multiply', t: 12.8, svg: T(0, 0, 'MULTIPLY + ADD = AI MATH', 48, THEME.accent2) },
  { id: 'sp', x: 500, y: 1260, w: 'speed', t: 17.2, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'AT THE SPEED OF LIGHT', -2, THEME.accent, 60, '#fff')}</g>` }
 ]})));

// ── 10 MATH WITH RIPPLES ────────────────────────────────────────
S.push(scene(THEME.paper,
 "Real photonic chips often use ripples instead. When two waves meet in step, they add into a bigger wave. When they meet opposite, they cancel to nothing, like a pond going flat. Tune the paths, and the way the ripples combine becomes the answer.",
 comicScene({ badge: '10 - MATH WITH RIPPLES', badgeColor: THEME.accent2, groups: [
  { id: 'rp', x: 500, y: 190, w: 'ripples', t: 1.7, svg: `${[0, .6, 1.2].map(d => `<circle r="40" fill="none" stroke="#2d5fb5" stroke-width="6" ${an('ring', 1.8, d, 'center', '--dir:normal;')}/>`).join('')}<circle r="10" fill="#2d5fb5"/>${T(0, 150, 'RIPPLES ON A POND', 36)}` },
  { id: 'A', x: 500, y: 600, w: 'step', t: 4.1, svg: `${T(0, -150, 'IN STEP: THEY ADD UP', 38, THEME.accent2)}${wave(-80, 26, 0, THEME.accent)}${wave(0, 26, 0, '#2d5fb5')}${wave(120, 52, 0, THEME.accent2, 8)}${T(-345, -74, 'WAVE 1', 22, INK, 'end', FM, 'font-weight="bold"')}${T(-345, 6, 'WAVE 2', 22, INK, 'end', FM, 'font-weight="bold"')}${T(-345, 126, 'SUM', 22, INK, 'end', FM, 'font-weight="bold"')}${T(0, 215, 'BIGGER WAVE', 32, THEME.accent2)}` },
  { id: 'B', x: 500, y: 1010, w: 'opposite', t: 7.6, svg: `${T(0, -150, 'OPPOSITE: THEY CANCEL', 38, THEME.accent)}${wave(-80, 26, 0, THEME.accent)}${wave(0, 26, Math.PI, '#2d5fb5')}<line x1="-330" y1="120" x2="330" y2="120" stroke="${THEME.accent}" stroke-width="8" stroke-linecap="round"/>${T(-345, -74, 'WAVE 1', 22, INK, 'end', FM, 'font-weight="bold"')}${T(-345, 6, 'WAVE 2', 22, INK, 'end', FM, 'font-weight="bold"')}${T(-345, 126, 'SUM', 22, INK, 'end', FM, 'font-weight="bold"')}` },
  { id: 'pd', x: 500, y: 1230, w: 'pond', t: 10, svg: T(0, 0, 'FLAT POND = ZERO', 36, THEME.accent) },
  { id: 'tune', x: 500, y: 1340, w: 'paths', t: 11.7, svg: `${pipe('M-330 0 H-220', 26)}${pipe('M-220 0 Q-140 -90 0 -90 Q140 -90 220 0', 26)}${pipe('M-220 0 H220', 26)}${pipe('M220 0 H330', 26)}<rect x="-40" y="-130" width="80" height="26" rx="6" fill="#e63946" stroke="${INK}" stroke-width="4"/>${T(0, -144, 'TUNE THE PATH', 28, THEME.accent)}` },
  { id: 'an', x: 500, y: 1445, w: 'answer', t: 14.8, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'THE PATTERN IS THE ANSWER', -2, THEME.accent2, 48, '#fff')}</g>` }
 ]})));

// ── 11 WHY NOT ALL LIGHT? ───────────────────────────────────────
S.push(scene(THEME.paper,
 "So why isn't your laptop made of light? Because photons are too polite. They ignore each other, so one beam cannot easily switch another on and off, and a computer needs exactly that. You also cannot park a photon, since light never stands still, so memory still needs electrons. And optical parts are huge, a dinner plate next to a transistor's grain of rice.",
 comicScene({ badge: '11 - WHY NOT ALL LIGHT?', badgeColor: THEME.accent, groups: [
  { id: 'why', x: 500, y: 110, w: 'why', t: .3, svg: sfx(0, 0, 'WHY NOT ALL LIGHT?', -2, THEME.accent, 70, '#fff') },
  { id: 'c1', x: 500, y: 400, w: 'polite', t: 4.1, svg: wideCard(`<line x1="-90" y1="-60" x2="90" y2="60" stroke="#ff9900" stroke-width="10" stroke-linecap="round"/><line x1="-90" y1="60" x2="90" y2="-60" stroke="#0a7ea4" stroke-width="10" stroke-linecap="round"/><circle r="16" fill="#fff" stroke="${INK}" stroke-width="4"/>${T(0, 58, '?', 44, THEME.accent)}`, 'LIGHT IGNORES LIGHT', 'beams pass through each other,', 'so one cannot flip another', THEME.accent) },
  { id: 'c2', x: 500, y: 800, w: 'park', t: 12.4, svg: wideCard(`<path d="M-90 -10 q30 -40 60 0 t60 0 t60 0" fill="none" stroke="#2d5fb5" stroke-width="10" stroke-linecap="round" ${an('flow dash', .8)}/><path d="M-90 40 q30 -40 60 0 t60 0 t60 0" fill="none" stroke="#2d5fb5" stroke-width="10" stroke-linecap="round" ${an('flow dash', .8, .2)}/><line x1="-80" y1="-70" x2="80" y2="80" stroke="${THEME.accent}" stroke-width="10" stroke-linecap="round"/>`, 'LIGHT CAN\'T BE PARKED', 'like a river you cannot pause:', 'storing it needs electrons', THEME.accent) },
  { id: 'c3', x: 500, y: 1200, w: 'huge', t: 18.3, svg: wideCard(`<circle r="88" fill="#fff" stroke="${INK}" stroke-width="7"/><circle r="60" fill="none" stroke="#aab3bd" stroke-width="5"/><ellipse cx="62" cy="62" rx="14" ry="7" fill="#f3e2b3" stroke="${INK}" stroke-width="3" transform="rotate(-30 62 62)"/>`, 'LIGHT PARTS ARE HUGE', 'a dinner plate beside a grain', 'of rice: optics vs transistors', THEME.accent) }
 ]})));

// ── 12 THE TEAM-UP ──────────────────────────────────────────────
S.push(scene(THEME.paper,
 "The realistic answer is a team. Electrons stay the thinkers. They make decisions and hold memory. Photons become the couriers, carrying data between chips at the speed of light, and doing the heavy math. Light and electrons, working together. Subscribe for more.",
 comicScene({ badge: 'THE TEAM-UP', badgeColor: THEME.accent2, groups: [
  { id: 'tm', x: 500, y: 100, w: 'team', t: 1.7, svg: sfx(0, 0, 'THE REALISTIC ANSWER:', -2, THEME.accent, 60, '#fff') + T(0, 64, 'A TEAM', 60, THEME.accent2) },
  { id: 'cL', x: 230, y: 560, w: 'thinkers', t: 3.1, svg: `<g transform="translate(0 0)">${chip(260, 'THINK')}</g>` },
  { id: 'cR', x: 770, y: 560, w: 'thinkers', t: 3.3, svg: chip(260, 'THINK') },
  { id: 'th', x: 500, y: 360, w: 'thinkers', t: 3.4, svg: T(0, 0, 'ELECTRONS = THE THINKERS', 40, '#1565c0') },
  { id: 'mem', x: 230, y: 790, w: 'memory', t: 5.2, svg: `${[0, 1, 2].map(i => [0, 1, 2].map(j => `<rect x="${-45 + i * 32}" y="${-30 + j * 24}" width="26" height="18" fill="#ffd23f" stroke="${INK}" stroke-width="3"/>`).join('')).join('')}${T(0, 70, 'MEMORY + DECISIONS', 28)}` },
  { id: 'br', w: 'couriers', t: 6.6, svg: `<rect x="372" y="520" width="256" height="80" rx="30" fill="rgba(160,210,255,.4)" stroke="#2d5fb5" stroke-width="6"/>${LANES.slice(0, 4).map((c, i) => `<line x1="384" y1="${534 + i * 18}" x2="616" y2="${534 + i * 18}" stroke="${c}" stroke-width="9" stroke-dasharray="26 22" ${an('flow', .5, i * .1)}/>`).join('')}${T(500, 650, 'PHOTONS = COURIERS', 36, THEME.accent)}${T(500, 696, 'data at the speed of light', 26, INK, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'eng', x: 500, y: 1030, w: 'math', t: 11.4, svg: `<rect x="-230" y="-110" width="460" height="220" rx="18" fill="#fff" stroke="${INK}" stroke-width="6"/>${[-60, 0, 60].map(y => `<line x1="-210" y1="${y}" x2="-80" y2="${y}" stroke="#ffb300" stroke-width="12" stroke-linecap="round"/><rect x="-80" y="${y - 22}" width="26" height="44" rx="8" fill="rgba(20,20,20,.55)" stroke="${INK}" stroke-width="4"/><path d="M-54 ${y} Q40 ${y} 120 0" fill="none" stroke="#ffb300" stroke-width="8"/>`).join('')}<circle cx="150" cy="0" r="36" fill="#1c2630" stroke="${INK}" stroke-width="5"/><circle cx="150" cy="0" r="18" fill="#ffe08a"/>${T(0, 160, 'PHOTONIC MATH ENGINE', 34, THEME.accent2)}` },
  { id: 'tg', x: 500, y: 1290, w: 'together', t: 13.1, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'LIGHT + ELECTRONS', -2, THEME.accent2, 66, '#fff')}</g>` },
  { id: 'sub', x: 500, y: 1400, w: 'subscribe', t: 13.4, svg: `<g ${an('pulse', .8)}><rect x="-210" y="-44" width="420" height="88" rx="18" fill="${THEME.accent}" stroke="${INK}" stroke-width="7"/>${T(0, 20, 'SUBSCRIBE', 54, '#fff')}</g>` }
 ]})));

// ── export ──────────────────────────────────────────────────────
const TRANS = ['fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade'];
module.exports = {
    output: { title: 'could-computers-run-on-light', format: 'portrait', fps: 30, crf: 23, preset: 'medium' },
    defaults: { voice: 'am_adam', speed: 1.02, transition: 'fade', transitionDuration: 0.3 },
    scenes: S.map((s, i) => Object.assign(s, { transition: TRANS[i] || 'fade' })),
};