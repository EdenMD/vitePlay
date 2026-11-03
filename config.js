// config.solar-story.js
// "How Solar Panels Work" — APEX Video Engine config (same architecture as config.rocket-story.js)
// 12 scenes: hook -> 1839 Becquerel -> selenium/Fritts -> Einstein -> Bell Labs 1954 -> silicon lattice
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

// ── 0 HOOK ──────────────────────────────────────────────────────
S.push(scene('#050818',
 "Every hour, enough sunlight hits the Earth to cover what humanity uses in a whole year. Solar panels are how we catch some of it. But how does a flat sheet of glass and sand turn light into electricity? Let's find out.",
 comicScene({ badge: 'LIGHT INTO POWER', theme: 'night', groups: [
  { id: 'stars', always: true, svg: stars(50) },
  { id: 'sun', x: 500, y: 240, w: 'hour', t: .3, svg: sunSvg(110, '#fff3b0', '#ffb300') },
  { id: 'beams', w: 'sunlight', t: 1, svg: [0, 1, 2, 3, 4].map(i => `<line x1="${420 + i * 40}" y1="400" x2="${200 + i * 150}" y2="1030" stroke="#ffd23f" stroke-width="8" stroke-linecap="round" opacity=".55" ${an('flow dash', .8, i * .1)}/>`).join('') },
  { id: 'earth', w: 'earth', t: 2.1, svg: `<ellipse cx="500" cy="1530" rx="900" ry="440" fill="#1d4f7a"/><ellipse cx="500" cy="1530" rx="900" ry="440" fill="none" stroke="#6fc3ff" stroke-width="10" opacity=".6"/><g ${an('drift', 40, 0, 'center', '--dx:260px;')}>${cloud(60, 1200, 1.3, '#dfeaf5', .6)}${cloud(560, 1170, 1, '#dfeaf5', .6)}</g>` },
  { id: 'yr', x: 500, y: 560, w: 'year', t: 5.2, svg: `${sfx(0, 0, '1 HOUR OF SUN', -3, '#ffd23f', 80, '#050818')}${M(0, 64, '= 1 YEAR OF HUMAN ENERGY USE', 28, '#fff')}` },
  { id: 'pnl', x: 500, y: 940, w: 'panels', t: 5.9, svg: `<line x1="-70" y1="60" x2="-70" y2="130" stroke="#c9ced6" stroke-width="10"/><line x1="70" y1="60" x2="70" y2="130" stroke="#c9ced6" stroke-width="10"/><g transform="rotate(-10)">${panel(320, 170, 6, 3)}</g>` },
  { id: 'q', x: 500, y: 1290, w: 'sand', t: 11.7, svg: `${T(0, 0, 'GLASS + SAND  =  ?', 58, '#fff')}` },
  { id: 'bolt', x: 500, y: 1390, w: 'electricity', t: 13.1, svg: `<g ${an('pulse', .6)}><polygon points="-150,-30 -170,10 -145,10 -160,45 -125,-5 -150,-5 -135,-30" fill="#ffd23f" stroke="#050818" stroke-width="3" transform="scale(1.4)"/>${T(60, 14, 'ELECTRICITY', 56, '#ffd23f')}</g>` }
 ]})));

// ── 1 BECQUEREL 1839 ────────────────────────────────────────────
S.push(scene(THEME.paper,
 "The story starts in Paris in eighteen thirty nine. A nineteen year old, Edmond Becquerel, was experimenting in his father's lab. He dipped two metal plates in liquid, shined light on them, and noticed the electric current grew stronger. He had discovered the photovoltaic effect.",
 comicScene({ badge: '1 - A TEENAGER IN PARIS', badgeColor: THEME.accent2, groups: [
  { id: 'paris', x: 500, y: 80, w: 'paris', t: 1.4, svg: sfx(0, 0, 'PARIS, 1839', -2, THEME.accent, 84, '#fff') },
  { id: 'age', x: 500, y: 190, w: 'nineteen', t: 3.4, svg: `${T(0, 0, 'EDMOND BECQUEREL', 40, INK)}${T(0, 68, 'AGE 19', 70, THEME.accent2)}` },
  { id: 'beaker', x: 500, y: 830, w: 'dipped', t: 7.6, svg: `
    <path d="M-90 -330 A90 90 0 0 1 90 -330Z" fill="#fff" stroke="${INK}" stroke-width="6"/>
    ${[-60, -30, 0, 30, 60].map(a => `<line x1="0" y1="-330" x2="${Math.sin(a * Math.PI / 180 * 1.5) * 74}" y2="${-330 - Math.cos(a * Math.PI / 180 * 1.5) * 74}" stroke="${INK}" stroke-width="3"/>`).join('')}
    <path d="M-78 -200 V-320 H-60 M78 -200 V-320 H60" fill="none" stroke="#c8702a" stroke-width="8"/>
    <rect x="-150" y="-120" width="300" height="300" rx="20" fill="rgba(255,255,255,.55)" stroke="${INK}" stroke-width="7"/>
    <rect x="-146" y="-20" width="292" height="196" rx="14" fill="#9fe0c8" opacity=".7" ${an('bob', 1.6)}/>
    <rect x="-90" y="-200" width="24" height="300" fill="#cfd6de" stroke="${INK}" stroke-width="5"/><rect x="66" y="-200" width="24" height="300" fill="#cfd6de" stroke="${INK}" stroke-width="5"/>
    ${T(0, 250, 'PLATES IN LIQUID', 34)}` },
  { id: 'sunl', x: 130, y: 520, w: 'light', t: 10, svg: `${sunSvg(46)}<line x1="60" y1="60" x2="250" y2="240" stroke="#ffb300" stroke-width="9" stroke-linecap="round" ${an('flow dash', .6)}/>` },
  { id: 'cur', x: 500, y: 500, w: 'current', t: 12.4, svg: `
    <g ${an('rot', 1.4, 0, [0, 0], '--r0:-55deg;--r1:30deg;--n:1;')}><line x1="0" y1="0" x2="0" y2="-76" stroke="${THEME.accent}" stroke-width="7" stroke-linecap="round"/></g>
    <circle r="10" fill="${INK}"/>${T(0, -150, 'CURRENT GROWS!', 44, THEME.accent)}` },
  { id: 'pv', x: 500, y: 1260, w: 'photovoltaic', t: 14.8, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'THE PHOTOVOLTAIC EFFECT', -2, THEME.accent2, 58, '#fff')}</g>${T(0, 70, 'photo = light   voltaic = voltage', 28, INK, 'middle', FM, 'font-weight="bold"')}` }
 ]})));

// ── 2 SELENIUM + FRITTS ─────────────────────────────────────────
const tile = (id, w, t, y, year, title, sub, icon) => ({ id, x: 500, y, w, t, svg: `
  <rect x="-440" y="-85" width="880" height="170" rx="14" fill="#fff" stroke="${INK}" stroke-width="5"/>
  ${year ? T(-320, 28, year, 82, THEME.accent) : ''}
  ${T(year ? -170 : -400, year ? -4 : 12, title, year ? 36 : 76, INK, 'start')}
  ${T(year ? -170 : -400, year ? 46 : 62, sub, 26, '#5a4a3a', 'start', FM, 'font-weight="bold"')}
  <g transform="translate(350 0)">${icon}</g>` });
S.push(scene(THEME.paper,
 "Then came selenium. In eighteen seventy three, engineers noticed it conducted better in light. A few years later, scientists saw it actually produce a current. In eighteen eighty three, Charles Fritts coated selenium with thin gold and built the first true solar cell. It turned only about one percent of sunlight into power.",
 comicScene({ badge: '2 - SELENIUM SPARKS', badgeColor: THEME.accent2, groups: [
  tile('a', 'selenium', .7, 190, '', 'SELENIUM', 'a light-sensitive element',
    `<rect x="-60" y="-30" width="120" height="60" rx="8" fill="#8a96a3" stroke="${INK}" stroke-width="5"/><rect x="-44" y="-18" width="60" height="14" fill="#fff" opacity=".4"/>`),
  tile('b', 'engineers', 2.4, 430, '1873', 'BETTER IN LIGHT', 'conducts more current',
    `<g transform="scale(.55) translate(0 -10)">${sunSvg(40)}</g>`),
  tile('c', 'scientists', 6.2, 670, '1876', 'LIGHT MAKES A CURRENT', 'Adams and Day',
    `<path d="M-50 20 A50 50 0 0 1 50 20Z" fill="#fff" stroke="${INK}" stroke-width="5"/><g ${an('rot', 1.2, 0, [0, 20], '--r0:-50deg;--r1:40deg;')}><line x1="0" y1="20" x2="0" y2="-26" stroke="${THEME.accent}" stroke-width="6" stroke-linecap="round"/></g>`),
  tile('d', 'fritts', 10.3, 910, '1883', 'CHARLES FRITTS', 'selenium + thin gold film',
    `<rect x="-62" y="-34" width="124" height="12" fill="#ffc83d" stroke="${INK}" stroke-width="3"/><rect x="-62" y="-22" width="124" height="48" fill="#8a96a3" stroke="${INK}" stroke-width="4"/><rect x="-62" y="26" width="124" height="10" fill="#555" stroke="${INK}" stroke-width="3"/>`),
  { id: 'first', x: 500, y: 1100, w: 'first', t: 13.4, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'FIRST TRUE SOLAR CELL', -2, THEME.accent2, 62, '#fff')}</g>` },
  { id: 'pct', x: 500, y: 1290, w: 'percent', t: 16.6, svg: `
    ${T(0, -60, 'ONLY ~1% OF SUNLIGHT BECAME POWER', 30)}
    <rect x="-350" y="-30" width="700" height="60" rx="10" fill="#fff" stroke="${INK}" stroke-width="5"/>
    <g ${an('growx', 1, .3, 'left')}><rect x="-346" y="-26" width="8" height="52" fill="${THEME.accent}"/></g>${T(340, 80, '100%', 26, INK, 'end', FM, 'font-weight="bold"')}` }
 ]})));

// ── 3 EINSTEIN 1905 ─────────────────────────────────────────────
S.push(scene('#050818',
 "But nobody knew why it worked, until nineteen oh five. Albert Einstein explained that light comes in tiny packets of energy, called photons. When a photon hits a material with enough energy, it knocks an electron loose. That idea won him the Nobel Prize.",
 comicScene({ badge: '3 - WHY IT WORKS', theme: 'night', groups: [
  { id: 'stars', always: true, svg: stars(50, 17) },
  { id: 'why', x: 500, y: 120, w: 'nobody', t: .3, svg: `<g ${an('wobble', .8)}>${sfx(0, 0, 'BUT WHY?', -3, '#ffd23f', 110, '#050818')}</g>` },
  { id: 'ein', x: 500, y: 250, w: 'einstein', t: 3.8, svg: `${T(0, 0, '1905  -  ALBERT EINSTEIN', 46, '#fff')}` },
  { id: 'slab', w: 'packets', t: 6.2, svg: `
    <rect x="640" y="520" width="300" height="600" rx="14" fill="#8a96a3" stroke="#fff" stroke-width="6"/>
    ${[0, 1, 2, 3, 4].map(r => [0, 1].map(c => `<circle cx="${710 + c * 150}" cy="${600 + r * 120}" r="26" fill="#aab3bd" stroke="#fff" stroke-width="4"/>`).join('')).join('')}
    ${T(790, 1180, 'METAL', 34, '#fff')}
    ${[620, 800, 980].map((y, i) => `<g transform="translate(0 ${y})"><g ${an('drift', 2.2, i * -.7, 'center', '--dx:330px;')}><path d="${wavy(120, 0, 220, 0, 12, 4)}" fill="none" stroke="#ffd23f" stroke-width="7" stroke-linecap="round"/><circle cx="232" cy="0" r="16" fill="#ffd23f"/></g></g>`).join('')}
    ${T(330, 1180, 'LIGHT = PACKETS OF ENERGY', 30, '#ffd23f', 'middle', FM, 'font-weight="bold"')}` },
  { id: 'ph', x: 400, y: 440, w: 'photons', t: 7.6, svg: `${T(0, 0, 'PHOTONS', 62, '#ffd23f')}` },
  { id: 'ko', w: 'knocks', t: 11.4, svg: `
    ${sparks(640, 850, 10, '#fff', 34, .4)}${sfx(560, 770, 'POP!', -10, '#4dd0ff', 76, '#050818')}
    ${[[0, -120], [60, 20], [0, 150]].map(([dy, _], i) => `<g ${an('moveonce', 1.6, i * .5, 'center', `--dx:-260px;--dy:${[-120, 20, 150][i]}px;--n:infinite;`)}><circle cx="620" cy="${[700, 860, 960][i]}" r="16" fill="#4dd0ff" stroke="#fff" stroke-width="3"/></g>`).join('')}
    ${T(330, 1250, 'ELECTRONS KNOCKED LOOSE', 34, '#4dd0ff')}` },
  { id: 'nob', x: 500, y: 1380, w: 'nobel', t: 14.5, svg: `<g ${an('pulse', .9)}><circle cx="-170" cy="0" r="62" fill="#ffd23f" stroke="#fff" stroke-width="6"/>${T(-170, 10, 'N', 70, '#050818')}${T(100, -4, 'NOBEL PRIZE', 52, '#ffd23f')}${T(100, 44, 'PHYSICS, 1921', 30, '#fff', 'middle', FM, 'font-weight="bold"')}</g>` }
 ]})));

// ── 4 BELL LABS 1954 ────────────────────────────────────────────
S.push(scene(THEME.paper,
 "The real breakthrough came in nineteen fifty four at Bell Labs. Using silicon, researchers built a cell that turned about six percent of sunlight into electricity. Four years later, a small satellite called Vanguard One carried solar cells into orbit, and they kept working for years.",
 comicScene({ badge: '4 - THE SILICON CELL', badgeColor: THEME.accent2, groups: [
  { id: 'y54', x: 500, y: 80, w: 'nineteen', t: 1.7, svg: sfx(0, 0, '1954  -  BELL LABS', -2, THEME.accent, 76, '#fff') },
  { id: 'si', x: 280, y: 430, w: 'silicon', t: 4.1, svg: `
    <rect x="-150" y="-150" width="300" height="300" rx="12" fill="#2b3a55" stroke="${INK}" stroke-width="7"/>
    ${[-75, 0, 75].map(x => `<line x1="${x}" y1="-146" x2="${x}" y2="146" stroke="#ffc83d" stroke-width="6"/>`).join('')}
    <line x1="-146" y1="0" x2="146" y2="0" stroke="#ffc83d" stroke-width="6"/>
    <polygon points="-140,-140 -40,-140 -140,-40" fill="#fff" opacity=".16"/>
    ${T(0, 220, 'SILICON CELL', 40)}` },
  { id: 'bars', x: 760, y: 560, w: 'six', t: 6.9, svg: `
    <rect x="-110" y="-30" width="80" height="30" fill="#8a96a3" stroke="${INK}" stroke-width="5"/>
    <g ${an('growy', 1.2, 0, 'bottom')}><rect x="20" y="-180" width="80" height="180" fill="${THEME.accent2}" stroke="${INK}" stroke-width="5"/></g>
    ${T(-70, -44, '1%', 38)}${T(60, -194, '6%', 52, THEME.accent2)}
    ${T(-70, 40, '1883', 26, INK, 'middle', FM, 'font-weight="bold"')}${T(60, 40, '1954', 26, INK, 'middle', FM, 'font-weight="bold"')}
    ${T(-5, 92, 'EFFICIENCY', 30)}` },
  { id: 'orb', x: 500, y: 1390, w: 'satellite', t: 10.7, svg: `
    <circle r="210" fill="#1d4f7a" stroke="#6fc3ff" stroke-width="8"/>
    <circle r="330" fill="none" stroke="${INK}" stroke-width="5" stroke-dasharray="14 12" ${an('flow', 1.4)}/>
    <g ${an('spin', 14, 0, [0, 0])}><g transform="translate(0 -330)"><circle r="26" fill="#cfd6de" stroke="${INK}" stroke-width="5"/>
      ${[0, 60, 120, 180, 240, 300].map(a => `<line x1="0" y1="-26" x2="0" y2="-56" stroke="${INK}" stroke-width="4" transform="rotate(${a})"/>`).join('')}
      <rect x="-8" y="-8" width="16" height="16" fill="#1b3a8a"/></g></g>
    ${T(0, -400, 'VANGUARD 1  -  1958', 40)}` },
  { id: 'sw', x: 500, y: 800, w: 'working', t: 14.8, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'KEPT WORKING FOR YEARS', -2, THEME.accent2, 54, '#fff')}</g>` }
 ]})));

// ── 5 SAND -> SILICON LATTICE ───────────────────────────────────
const lat = (() => {
    const xs = [-300, -150, 0, 150, 300], ys = [-225, -75, 75, 225]; let b = '', a = '', e = '';
    xs.forEach((x, i) => ys.forEach((y, j) => {
        if (i < 4) { b += `<line x1="${x}" y1="${y}" x2="${x + 150}" y2="${y}" stroke="${THEME.bpSoft}" stroke-width="6"/>`; e += `<circle cx="${x + 66}" cy="${y}" r="7" fill="#ffd23f" ${an('twinkle', 1.2, (i + j) * .2)}/><circle cx="${x + 84}" cy="${y}" r="7" fill="#ffd23f" ${an('twinkle', 1.2, (i + j) * .2 + .3)}/>`; }
        if (j < 3) { b += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 150}" stroke="${THEME.bpSoft}" stroke-width="6"/>`; e += `<circle cx="${x}" cy="${y + 66}" r="7" fill="#ffd23f" ${an('twinkle', 1.2, (i + j) * .2 + .15)}/><circle cx="${x}" cy="${y + 84}" r="7" fill="#ffd23f" ${an('twinkle', 1.2, (i + j) * .2 + .45)}/>`; }
        a += `<circle cx="${x}" cy="${y}" r="38" fill="#0f3d7a" stroke="${THEME.bpLine}" stroke-width="5"/>${M(x, y + 9, 'Si', 28)}`;
    }));
    return b + a + e;
})();
S.push(scene('#0f3d7a',
 "So how does a modern panel work? It starts with sand. Quartz is purified into silicon, where every atom shares electrons with four neighbors in a neat crystal lattice. In that rigid grid, there are no free electrons to carry current.",
 comicScene({ badge: '5 - START WITH SAND', theme: 'blue', groups: [
  { id: 'frame', w: 'work', t: .3, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.4, 4)}${M(500, 130, 'FIG. 3 - FROM SAND TO SILICON', 30, THEME.bpHi)}` },
  { id: 'sand', x: 500, y: 330, w: 'sand', t: 3.4, svg: `
    <polygon points="-340,40 -320,-40 -290,-70 -260,-40 -240,40" fill="rgba(223,240,255,.25)" stroke="${THEME.bpLine}" stroke-width="5" stroke-linejoin="round"/>
    <polygon points="-306,-30 -290,-54 -274,-30" fill="#fff" opacity=".5"/>
    ${dr('M-190 0 H80', 0, 1.2, 7)}${dr('M52 -24 L90 0 L52 24', 1, .5, 7)}
    <rect x="170" y="-45" width="170" height="90" rx="14" fill="#2b3a55" stroke="${THEME.bpLine}" stroke-width="5"/><polygon points="180,-38 260,-38 180,10" fill="#fff" opacity=".18"/>
    ${M(-290, 100, 'SAND (QUARTZ)', 24)}${M(255, 100, 'PURE SILICON', 24, THEME.bpHi)}` },
  { id: 'lat', x: 500, y: 830, w: 'atom', t: 6.2, svg: lat },
  { id: 'four', x: 500, y: 830, w: 'four', t: 7.6, svg: `<g ${an('pulse', .8)}><circle cx="0" cy="-75" r="60" fill="none" stroke="${THEME.bpHi}" stroke-width="7"/></g>${M(0, -310, 'EACH ATOM SHARES 4 BONDS', 28, THEME.bpHi)}` },
  { id: 'free', x: 500, y: 1230, w: 'free', t: 12.4, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'NO FREE ELECTRONS', -2, '#fff', 74, '#0f3d7a')}</g>${M(0, 64, '= NO CURRENT', 34, THEME.bpHi)}` }
 ]})));

// ── 6 THE P-N JUNCTION ──────────────────────────────────────────
const dotsN = (() => { const r = rng(5); let o = ''; for (let i = 0; i < 14; i++) o += `<circle cx="${160 + r() * 680}" cy="${340 + r() * 190}" r="13" fill="#ffd23f" stroke="#7a4a00" stroke-width="3" ${an('bob', 1 + r(), r())}/>`; return o; })();
const holesP = (() => { const r = rng(9); let o = ''; for (let i = 0; i < 12; i++) o += `<circle cx="${160 + r() * 680}" cy="${690 + r() * 190}" r="14" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="6 5" ${an('bob', 1 + r(), r())}/>`; return o; })();
S.push(scene('#0f3d7a',
 "To fix that, manufacturers dope the silicon. One layer gets a pinch of phosphorus, which adds extra electrons. The other gets boron, which leaves holes where electrons should be. Where the two layers meet, electrons spill across and build an electric field, a one way slope for electrons.",
 comicScene({ badge: '6 - DOPE THE SILICON', theme: 'blue', groups: [
  { id: 'frame', w: 'dope', t: 1.4, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.4, 4)}${M(500, 130, 'FIG. 4 - THE P-N JUNCTION', 30, THEME.bpHi)}${dr('M120 300 H880 V620 H120Z', .4, 1.6, 5)}${dr('M120 640 H880 V960 H120Z', .8, 1.6, 5)}` },
  { id: 'n', w: 'phosphorus', t: 4.5, svg: `<rect x="120" y="300" width="760" height="320" fill="rgba(255,120,110,.28)"/>${dotsN}${M(500, 270, 'N-TYPE: ADD PHOSPHORUS', 28, '#ff9d9d')}${M(500, 590, 'EXTRA ELECTRONS', 28, THEME.bpHi)}` },
  { id: 'p', w: 'boron', t: 7.2, svg: `<rect x="120" y="640" width="760" height="320" fill="rgba(120,160,255,.28)"/>${holesP}${M(500, 1000, 'P-TYPE: ADD BORON', 28, '#9dc0ff')}${M(500, 925, 'HOLES = MISSING ELECTRONS', 28, THEME.bpHi)}` },
  { id: 'jn', w: 'meet', t: 11.4, svg: `<line x1="120" y1="630" x2="880" y2="630" stroke="${THEME.bpHi}" stroke-width="7" ${an('flow dash', .7)}/>${[260, 500, 740].map((x, i) => `<g ${an('bob', 1, i * .2)}>${dr(`M${x} 560 V690`, 0, .8, 6, '#ff9d9d')}${dr(`M${x - 18} 668 L${x} 696 L${x + 18} 668`, .5, .4, 6, '#ff9d9d')}</g>`).join('')}` },
  { id: 'fld', w: 'field', t: 14.1, svg: `${[250, 500, 750].map((x, i) => `<g ${an('float', 1.2, i * .2)}>${dr(`M${x} 860 V740`, 0, .8, 12, THEME.bpHi)}${dr(`M${x - 24} 770 L${x} 735 L${x + 24} 770`, .5, .4, 12, THEME.bpHi)}</g>`).join('')}
    ${sfx(500, 1100, 'ELECTRIC FIELD', -2, THEME.bpHi, 76, '#0f3d7a')}${M(500, 1170, 'A ONE-WAY SLOPE: PUSHES ELECTRONS UP', 26, '#fff')}` }
 ]})));

// ── 7 LIGHT MAKES CURRENT ───────────────────────────────────────
const WIRE = 'M300 640 H150 V1050 H550 V815';
S.push(scene('#cfeeff',
 "Now add sunlight. A photon hits the cell and knocks an electron free. The electric field shoves it toward the top layer, and the electron can't go back, so it takes the only way around, through the wire, powering whatever is connected, before returning to the bottom layer. That flow is electricity.",
 comicScene({ badge: '7 - LIGHT MAKES CURRENT', badgeColor: THEME.accent, theme: 'sky', groups: [
  { id: 'cell', w: 'sunlight', t: .7, svg: `
    <g transform="translate(800 150)">${sunSvg(60)}</g>
    <rect x="300" y="560" width="500" height="30" fill="#bfe6ff" stroke="${INK}" stroke-width="5"/>
    <rect x="300" y="590" width="500" height="100" fill="#ffb3a7" stroke="${INK}" stroke-width="5"/>
    <rect x="300" y="690" width="500" height="100" fill="#a7c4ff" stroke="${INK}" stroke-width="5"/>
    <rect x="300" y="790" width="500" height="26" fill="#8a929b" stroke="${INK}" stroke-width="5"/>
    ${T(430, 652, 'N', 44)}${T(430, 752, 'P', 44)}${T(660, 582, 'GLASS', 22, INK, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'ph', w: 'photon', t: 1.4, svg: `<path d="${wavy(715, 215, 560, 690, 12, 12)}" fill="none" stroke="#ff9900" stroke-width="8" stroke-linecap="round" ${an('flow dash', .6)}/>${T(690, 400, 'PHOTON', 30, '#b36b00', 'start')}` },
  { id: 'kn', w: 'knocks', t: 3.1, svg: `${sparks(560, 690, 10, '#ffd23f', 36, .4)}<circle cx="560" cy="690" r="16" fill="#4dd0ff" stroke="${INK}" stroke-width="4"/>${T(560, 697, '-', 24, INK)}${sfx(450, 440, 'POP!', -8, THEME.accent, 60, '#fff')}` },
  { id: 'push', w: 'shoves', t: 5.5, svg: `${arrow(560, 676, 560, 612, '#0a7ea4', 10)}${T(300, 540, 'FIELD PUSHES IT UP', 30, '#0a7ea4', 'start')}` },
  { id: 'cant', w: 'cant', t: 8.6, svg: `<path d="M640 620 V700" stroke="${THEME.accent}" stroke-width="9" stroke-dasharray="12 8"/><line x1="610" y1="635" x2="670" y2="685" stroke="${THEME.accent}" stroke-width="10" stroke-linecap="round"/><line x1="670" y1="635" x2="610" y2="685" stroke="${THEME.accent}" stroke-width="10" stroke-linecap="round"/>${T(740, 668, 'NO WAY BACK', 28, THEME.accent, 'start')}` },
  { id: 'wire', w: 'wire', t: 12.8, svg: `<path d="${WIRE}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="${WIRE}" fill="none" stroke="#4dd0ff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" ${an('flow dash', .7)}/>` },
  { id: 'bulb', w: 'powering', t: 13.1, svg: `<g ${an('pulse', .6)}><circle cx="350" cy="1050" r="70" fill="#fff3a0" opacity=".6"/></g><circle cx="350" cy="1050" r="46" fill="#fff7c2" stroke="${INK}" stroke-width="6"/><path d="M325 1060 q12 -40 25 0 q12 -40 25 0" fill="none" stroke="${INK}" stroke-width="5"/>${sparks(350, 1050, 8, '#ffb300', 70, .8)}${T(350, 1160, 'LOAD', 32)}` },
  { id: 'el', x: 500, y: 1330, w: 'electricity', t: 17.6, svg: `<g ${an('pulse', .8)}>${sfx(0, 0, 'THAT FLOW IS ELECTRICITY!', -2, THEME.accent2, 54, '#fff')}</g>` }
 ]})));

// ── 8 PANEL -> INVERTER -> HOME ─────────────────────────────────
S.push(scene(THEME.paper,
 "One cell makes only about half a volt. So a panel wires dozens of them together, behind tough glass. The current is direct current, so an inverter converts it to the alternating current your home uses, and any extra can charge a battery or flow to the grid.",
 comicScene({ badge: '8 - FROM CELL TO HOME', badgeColor: THEME.accent2, groups: [
  { id: 'cell', x: 200, y: 230, w: 'cell', t: .3, svg: `<rect x="-65" y="-65" width="130" height="130" rx="6" fill="#1b3a8a" stroke="#c9ced6" stroke-width="7"/><line x1="-22" y1="-62" x2="-22" y2="62" stroke="#8fbcff" stroke-width="3"/><line x1="22" y1="-62" x2="22" y2="62" stroke="#8fbcff" stroke-width="3"/>${T(0, 118, '1 CELL', 34)}` },
  { id: 'volt', x: 200, y: 420, w: 'volt', t: 2.4, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, '~0.5 V', -4, THEME.accent, 64, '#fff')}</g>` },
  { id: 'pnl', x: 650, y: 310, w: 'panel', t: 3.4, svg: `${panel(380, 460, 6, 10)}${T(0, 300, 'DOZENS OF CELLS + TOUGH GLASS', 28, INK)}${arrow(-380, -90, -215, -40, INK)}` },
  { id: 'inv', x: 500, y: 800, w: 'inverter', t: 9, svg: `${arrow(150, -150, 40, -90, INK)}<rect x="-170" y="-80" width="340" height="160" rx="16" fill="#e8edf2" stroke="${INK}" stroke-width="7"/>${T(0, -10, 'INVERTER', 46)}${T(0, 48, 'DC  >  AC', 36, THEME.accent)}<circle cx="130" cy="-50" r="9" fill="#2e8b57" ${an('blink', .9)}/>` },
  { id: 'home', x: 500, y: 1190, w: 'home', t: 11.7, svg: `
    ${arrow(0, -300, 0, -228, INK)}
    <rect x="-160" y="-100" width="320" height="200" fill="#f6f3ec" stroke="${INK}" stroke-width="7"/>
    <polygon points="-190,-100 0,-210 190,-100" fill="${THEME.accent}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
    <polygon points="38,-188 161,-117 174,-138 50,-209" fill="#1b3a8a" stroke="#c9ced6" stroke-width="4"/>
    <g ${an('pulse', 1.4)}><rect x="-110" y="-50" width="80" height="70" fill="#ffe08a" stroke="${INK}" stroke-width="5"/></g>
    <rect x="40" y="-10" width="60" height="110" fill="#8a6a4a" stroke="${INK}" stroke-width="5"/>${T(0, 160, 'YOUR HOME', 34)}` },
  { id: 'bat', x: 860, y: 1190, w: 'battery', t: 14.5, svg: `
    ${arrow(-190, -380, -10, -118, INK)}
    <rect x="-34" y="-112" width="68" height="18" rx="4" fill="#555" stroke="${INK}" stroke-width="4"/>
    <rect x="-60" y="-96" width="120" height="180" rx="14" fill="#fff" stroke="${INK}" stroke-width="7"/>
    <g ${an('growy', 2, 0, 'bottom')}><rect x="-48" y="-84" width="96" height="156" rx="8" fill="#6dd36d"/></g>${T(0, 140, 'BATTERY', 30)}` },
  { id: 'grd', x: 110, y: 1170, w: 'grid', t: 16.2, svg: `
    ${arrow(200, 30, 70, 0, INK)}
    <path d="M-50 90 L0 -150 L50 90 M-30 -60 H30 M-42 -10 H42" fill="none" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
    <line x1="-90" y1="-110" x2="90" y2="-110" stroke="${INK}" stroke-width="8"/>${T(0, 150, 'THE GRID', 30)}` }
 ]})));

// ── cards for pros / cons ───────────────────────────────────────
const card = (icon, l1, l2, col) => `
  <rect x="-215" y="-150" width="430" height="300" rx="18" fill="#fff" stroke="${INK}" stroke-width="6"/>
  <g transform="translate(0 -50)">${icon}</g>${T(0, 72, l1, 38, col)}${T(0, 116, l2, 26, INK, 'middle', FM, 'font-weight="bold"')}`;
const gear = `<g ${an('spin', 6, 0, [0, 0])}>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="-8" y="-48" width="16" height="18" fill="#aab3bd" stroke="${INK}" stroke-width="3" transform="rotate(${a})"/>`).join('')}<circle r="34" fill="#aab3bd" stroke="${INK}" stroke-width="5"/><circle r="11" fill="#fff" stroke="${INK}" stroke-width="3"/></g>
  <line x1="-50" y1="-50" x2="50" y2="50" stroke="${THEME.accent}" stroke-width="10" stroke-linecap="round"/><line x1="50" y1="-50" x2="-50" y2="50" stroke="${THEME.accent}" stroke-width="10" stroke-linecap="round"/>`;
const ICON = {
    sun: `<g transform="scale(.6)">${sunSvg(40)}</g>`,
    leaf: `<path d="M-45 35 Q-55 -45 40 -55 Q55 25 -45 35Z" fill="#4caf50" stroke="${INK}" stroke-width="5" ${an('bob', 1.4)}/><path d="M-45 35 L22 -28" stroke="${INK}" stroke-width="4"/>`,
    gear,
    clock: `<circle r="48" fill="#fff" stroke="${INK}" stroke-width="6"/>${[0, 90, 180, 270].map(a => `<line x1="0" y1="-42" x2="0" y2="-34" stroke="${INK}" stroke-width="4" transform="rotate(${a})"/>`).join('')}<g ${an('spin', 8, 0, [0, 0])}><line x1="0" y1="0" x2="0" y2="-34" stroke="${THEME.accent}" stroke-width="6" stroke-linecap="round"/></g><circle r="6" fill="${INK}"/>`,
    fall: `<polyline points="-55,-40 -20,-5 5,-15 42,28" fill="none" stroke="#2e8b57" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><polygon points="55,42 22,38 46,12" fill="#2e8b57"/>`,
    scale: `<g transform="translate(-62 22) scale(.22)">${panel(200, 140, 3, 2)}</g><line x1="-36" y1="10" x2="4" y2="10" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><g transform="translate(46 0) scale(.5)">${panel(200, 140, 3, 2)}</g>`,
    moon: `<circle r="46" fill="#ffd23f" stroke="${INK}" stroke-width="5"/><circle cx="22" cy="-14" r="40" fill="#fff"/>${cloud(0, 18, .55, '#b8c4d0')}`,
    coin: `<g ${an('pulse', 1.2)}><circle r="46" fill="#ffd23f" stroke="${INK}" stroke-width="6"/>${T(0, 20, '$', 64, INK)}</g>`,
    space: `<rect x="-30" y="-30" width="60" height="60" fill="#1b3a8a" stroke="${INK}" stroke-width="5"/>${[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => `<line x1="${sx * 36}" y1="${sy * 36}" x2="${sx * 58}" y2="${sy * 58}" stroke="${THEME.accent}" stroke-width="7" stroke-linecap="round"/>`).join('')}`,
    heat: `<rect x="-12" y="-56" width="24" height="84" rx="12" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cy="36" r="24" fill="#e63946" stroke="${INK}" stroke-width="5"/><g ${an('growy', 2, 0, 'bottom')}><rect x="-6" y="-30" width="12" height="62" fill="#e63946"/></g>${[0, 1].map(i => `<path d="M40 ${-30 + i * 40} q10 -12 0 -22 q-10 -12 0 -22" fill="none" stroke="#ff7a1a" stroke-width="5" ${an('bob', 1, i * .3)}/>`).join('')}`,
    pct: `<circle r="48" fill="#cfd6de" stroke="${INK}" stroke-width="5"/><path d="M0 0 L0 -48 A48 48 0 0 1 45.6 -14.8Z" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>`,
    recycle: `<path d="M-34 14 A38 38 0 1 1 22 34" fill="none" stroke="#2e8b57" stroke-width="10" stroke-linecap="round"/><polygon points="22,34 42,8 4,8" fill="#2e8b57"/>${T(0, 16, '?', 44, THEME.accent)}`
};
const cardG = (id, w, t, x, y, icon, l1, l2, col) => ({ id, x, y, w, t, svg: card(icon, l1, l2, col) });
const XL = 250, XR = 750, Y1 = 290, Y2 = 710, Y3 = 1130;

// ── 9 ADVANTAGES ────────────────────────────────────────────────
S.push(scene(THEME.paper,
 "Solar has big advantages. The fuel is free, and it makes no emissions while running. There are almost no moving parts, so maintenance is low, and panels often last twenty five years or more. Costs have fallen dramatically, and you can scale from a calculator to a power plant.",
 comicScene({ badge: 'THE UPSIDE', badgeColor: THEME.accent2, groups: [
  cardG('p1', 'free', 2.4, XL, Y1, ICON.sun, 'FREE FUEL', 'sunlight costs nothing', THEME.accent2),
  cardG('p2', 'emissions', 4.1, XR, Y1, ICON.leaf, 'ZERO EMISSIONS', 'while generating power', THEME.accent2),
  cardG('p3', 'moving', 6.6, XL, Y2, ICON.gear, 'NO MOVING PARTS', 'low maintenance', THEME.accent2),
  cardG('p4', 'twenty', 10, XR, Y2, ICON.clock, '25+ YEAR LIFE', 'often 25 years or more', THEME.accent2),
  cardG('p5', 'costs', 11.7, XL, Y3, ICON.fall, 'FALLING COSTS', 'down sharply this decade', THEME.accent2),
  cardG('p6', 'scale', 14.1, XR, Y3, ICON.scale, 'SCALES ANYWHERE', 'from roof to power plant', THEME.accent2)
 ]})));

// ── 10 DISADVANTAGES ────────────────────────────────────────────
S.push(scene(THEME.paper,
 "But solar has downsides too. It only works when the sun shines, so nights and cloudy days need batteries or other power. Panels cost real money upfront, and they take up space. Heat lowers their efficiency, and most convert only about twenty percent of sunlight. Making them takes energy, and recycling old panels is still a challenge.",
 comicScene({ badge: 'THE DOWNSIDE', badgeColor: THEME.accent, groups: [
  cardG('c1', 'nights', 4.5, XL, Y1, ICON.moon, 'NO SUN, NO POWER', 'nights and cloudy days', THEME.accent),
  cardG('c2', 'upfront', 9, XR, Y1, ICON.coin, 'UPFRONT COST', 'pay first, save later', THEME.accent),
  cardG('c3', 'space', 10.7, XL, Y2, ICON.space, 'TAKES SPACE', 'roofs or land needed', THEME.accent),
  cardG('c4', 'heat', 11, XR, Y2, ICON.heat, 'HEAT HURTS', 'hot panels lose output', THEME.accent),
  cardG('c5', 'twenty', 14.1, XL, Y3, ICON.pct, '~20% EFFICIENT', 'most sunlight is lost', THEME.accent),
  cardG('c6', 'making', 15.5, XR, Y3, ICON.recycle, 'MAKING + RECYCLING', 'recycling still tricky', THEME.accent)
 ]})));

// ── 11 RECAP + CTA ──────────────────────────────────────────────
const timeNode = (id, x, year, name, t, w) => ({ id, x, y: 240, w, t, svg: `<circle r="20" fill="${THEME.accent}" stroke="${INK}" stroke-width="6"/>${T(0, -50, year, 40, THEME.accent)}${T(0, 66, name, 22, INK, 'middle', FM, 'font-weight="bold"')}` });
const stepIcon = (x, id, w, t, inner, l1, l2) => ({ id, x, y: 640, w, t, svg: `<g ${an('pulse', 2.2)}><circle r="95" fill="#fff" stroke="${INK}" stroke-width="7"/>${inner}</g>${T(0, 160, l1, 30, THEME.accent)}${T(0, 200, l2, 30, INK)}` });
S.push(scene(THEME.paper,
 "So that's solar power. Almost two centuries from a teenager's experiment to panels on millions of roofs. Light knocks electrons loose, a built in electric field steers them, and a wire carries them to work. No fire, no moving parts. Just sunlight. Subscribe for more.",
 comicScene({ badge: 'SUNLIGHT, SOLVED', badgeColor: THEME.accent, groups: [
  { id: 'line', x: 0, y: 240, w: 'almost', t: 1.4, svg: dr('M60 0 H940', 0, 1.6, 8, INK) },
  timeNode('d1', 100, '1839', 'BECQUEREL', 2.4),
  timeNode('d2', 290, '1883', 'FRITTS', 2.9),
  timeNode('d3', 500, '1905', 'EINSTEIN', 3.4),
  timeNode('d4', 710, '1954', 'BELL LABS', 3.9),
  timeNode('d5', 900, 'NOW', 'ON ROOFS', 5.5, 'roofs'),
  stepIcon(200, 's1', 'knocks', 6.2, `<path d="${wavy(-60, -55, -8, 0, 9, 5)}" fill="none" stroke="#ff9900" stroke-width="8" stroke-linecap="round"/><circle cx="26" cy="22" r="14" fill="#4dd0ff" stroke="${INK}" stroke-width="4"/>`, 'LIGHT KNOCKS', 'ELECTRONS LOOSE'),
  stepIcon(500, 's2', 'field', 8.6, [-30, 0, 30].map(x => `<line x1="${x}" y1="40" x2="${x}" y2="-34" stroke="${THEME.accent2}" stroke-width="9" stroke-linecap="round"/><polyline points="${x - 14},-18 ${x},-40 ${x + 14},-18" fill="none" stroke="${THEME.accent2}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`).join(''), 'FIELD STEERS', 'THEM ONE WAY'),
  stepIcon(800, 's3', 'wire', 10.3, `<rect x="-52" y="-40" width="104" height="80" rx="10" fill="none" stroke="${INK}" stroke-width="8"/><rect x="-52" y="-40" width="104" height="80" rx="10" fill="none" stroke="#4dd0ff" stroke-width="5" ${an('flow dash', .7)}/><circle cx="0" cy="40" r="17" fill="#fff7c2" stroke="${INK}" stroke-width="5"/>`, 'WIRE CARRIES', 'THEM TO WORK'),
  { id: 'nf', x: 500, y: 990, w: 'fire', t: 12.4, svg: `${sfx(0, 0, 'NO FIRE. NO MOVING PARTS.', -2, THEME.accent2, 54, '#fff')}` },
  { id: 'js', x: 500, y: 1090, w: 'sunlight', t: 14.1, svg: `<g ${an('pulse', .9)}>${T(0, 0, 'JUST SUNLIGHT.', 60, THEME.accent)}</g>` },
  { id: 'sub', x: 500, y: 1260, w: 'subscribe', t: 14.5, svg: `<g ${an('pulse', .8)}><rect x="-210" y="-48" width="420" height="96" rx="18" fill="${THEME.accent}" stroke="${INK}" stroke-width="7"/>${T(0, 20, 'SUBSCRIBE', 58, '#fff')}</g>` }
 ]})));

// ── export ──────────────────────────────────────────────────────
const TRANS = ['fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left', 'fade', 'wipe-left', 'wipe-up', 'fade'];
module.exports = {
    output: { title: 'how-solar-panels-work', format: 'portrait', fps: 30, crf: 23, preset: 'medium' },
    defaults: { voice: 'am_adam', speed: 1.02, transition: 'fade', transitionDuration: 0.3 },
    scenes: S.map((s, i) => Object.assign(s, { transition: TRANS[i] || 'fade' })),
};