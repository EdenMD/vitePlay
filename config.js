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
//  VOICE TEST — 3 Kokoro voices x 4 explanation styles (same topic, same script per style)
//  Target: <= 90 s.  Voices are labelled A/B/C on screen so the WhatsApp poll is blind.
//  RESULTS KEY (reveal after the poll closes):  A = af_heart, B = am_michael, C = bf_emma
//  Swap voices in VOICES below (other good ones: af_bella, af_nicole, bf_isabella, am_fenrir).
//  NOTE: assumes the engine reads tts.voice / tts.speed per scene (falls back to defaults).
// ════════════════════════════════════════════════════════════════
THEMES.board = 'background:#1f3d33';
const CH = '#f5f1e6', GEO = 'Georgia,serif';
const VOICES = [
    { id: 'A', kokoro: 'af_heart', col: '#b5402c' },
    { id: 'B', kokoro: 'am_michael', col: '#2c6b5a' },
    { id: 'C', kokoro: 'bf_emma', col: '#2d5fb5' },
];
const SPEED = 1.0;   // keep identical for all voices so the test is fair
const STYLES = [
    { name: 'FACTUAL', theme: 'blue', bg: '#0f3d7a', text: "Earth's axis is tilted. As it orbits the Sun, sunlight changes angle, creating the seasons." },
    { name: 'STORY', theme: 'paper', bg: THEME.paper, text: "Picture Earth as a traveller, circling the Sun. When she leans toward it, summer arrives." },
    { name: 'CASUAL', theme: 'sky', bg: '#7ec8f5', text: "Seasons? It's not distance, it's tilt! When your half leans toward the Sun, it's summer." },
    { name: 'STEPS', theme: 'board', bg: '#1f3d33', text: "Step one: tilt. Step two: orbit the Sun. Step three: sunlight angle changes. Result: seasons." },
];

// ── shared art ───────────────────────────────────────────────────
const earthIcon = (r = 44, face = false, ink = THEME.ink) => `<circle r="${r}" fill="#2d7fd1" stroke="${ink}" stroke-width="5"/><ellipse cx="${-r * .28}" cy="${-r * .18}" rx="${r * .32}" ry="${r * .2}" fill="#4caf50"/><ellipse cx="${r * .3}" cy="${r * .32}" rx="${r * .27}" ry="${r * .18}" fill="#4caf50"/>` +
    `<g transform="rotate(23.5)"><line x1="0" y1="${-r - 22}" x2="0" y2="${r + 22}" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cy="${-r - 22}" r="6" fill="#ffd23f"/></g>` +
    (face ? `<circle cx="${-r * .3}" cy="${-r * .05}" r="${r * .09}" fill="#fff"/><circle cx="${r * .3}" cy="${-r * .05}" r="${r * .09}" fill="#fff"/><path d="M${-r * .3} ${r * .3} Q0 ${r * .6} ${r * .3} ${r * .3}" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>` : '');
const sunSvg = (cx, cy, r = 78, ink = THEME.ink, face = false) => `<g ${an('spin', 14, 0, [cx, cy])}>${Array.from({ length: 12 }, (_, i) => `<line x1="${cx}" y1="${cy - r - 14}" x2="${cx}" y2="${cy - r - 40}" stroke="#ffb300" stroke-width="9" stroke-linecap="round" transform="rotate(${i * 30} ${cx} ${cy})"/>`).join('')}</g><g ${an('pulse', 1.6)}><circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffd23f" stroke="${ink}" stroke-width="6"/>${face ? `<circle cx="${cx - 26}" cy="${cy - 10}" r="7" fill="${ink}"/><circle cx="${cx + 26}" cy="${cy - 10}" r="7" fill="${ink}"/><path d="M${cx - 30} ${cy + 22} Q${cx} ${cy + 52} ${cx + 30} ${cy + 22}" stroke="${ink}" stroke-width="6" fill="none" stroke-linecap="round"/>` : ''}</g>`;
// Earth travelling on a circular orbit; counter-spin keeps the axis pointing the same way in space
const orbit = (cx, cy, R, per, earth, ring = '#fff') => `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${ring}" stroke-width="5" ${an('flow dash', 2)}/><g ${an('spin', per, 0, [cx, cy])}><g transform="translate(${cx} ${cy - R})"><g ${an('spin', per, 0, 'center', '--dir:reverse;')}>${earth}</g></g></g>`;
const viz = col => Array.from({ length: 27 }, (_, i) => { const h = 40 + ((i * 37) % 100); return `<g transform="translate(${60 + i * 32} 1440)"><g ${an('eq', (.45 + (i % 6) * .09).toFixed(2), ((i % 9) * .06).toFixed(2), 'bottom')}><rect x="-9" y="${-h - 10}" width="18" height="${h + 10}" rx="9" fill="${col}"/></g></g>`; }).join('');
const lower = (v, s, i) => `<g transform="translate(500 1190)"><rect x="-460" y="-70" width="920" height="140" rx="28" fill="#fff" stroke="${THEME.ink}" stroke-width="7"/><rect x="-460" y="-70" width="250" height="140" rx="28" fill="${v.col}"/><rect x="-236" y="-70" width="26" height="140" fill="${v.col}"/>${T(-335, -8, 'VOICE', 34, '#fff')}${T(-335, 50, v.id, 64, '#fff')}${T(-190, -6, 'STYLE ' + (i + 1), 30, v.col, 'start')}${T(-190, 46, s.name, 50, THEME.ink, 'start')}</g>`;

// ── style visuals (each returns groups; triggers are words in that style's script) ──
const STYLE_VIS = [
  // 1 FACTUAL (blueprint)
  () => [
    { id: 'ttl', always: true, svg: M(500, 160, 'TOP VIEW OF ORBIT', 28, THEME.bpLine) + sunSvg(500, 560, 78, '#0f3d7a') },
    { id: 'orb', w: 'orbits', t: 1, svg: orbit(500, 560, 300, 8, earthIcon(40, false, '#0f3d7a')) },
    { id: 'tilt', w: 'tilted', t: 1, svg: `<g transform="translate(180 330)"><circle r="56" fill="none" stroke="#fff" stroke-width="5"/><g transform="rotate(23.5)"><line x1="0" y1="-84" x2="0" y2="84" stroke="${THEME.bpHi}" stroke-width="6"/></g><line x1="0" y1="-84" x2="0" y2="84" stroke="#8fbcff" stroke-width="3" stroke-dasharray="8 8"/>${dr('M0 -60 A60 60 0 0 1 26 -54', 0, 1.2, 5, THEME.bpHi)}${M(86, -50, '23.5°', 30, THEME.bpHi, 'start')}</g>` },
    { id: 'ang', w: 'angle', t: 1, svg: `<g ${an('blink', .9)}>${M(500, 1050, 'SUNLIGHT ANGLE CHANGES', 30, THEME.bpHi)}</g>` + [-60, 0, 60].map((x, i) => `<line x1="${500 + x}" y1="980" x2="${500 + x * 1.7}" y2="1020" stroke="${THEME.bpHi}" stroke-width="5" stroke-linecap="round" ${an('flow dash', .7)}/>`).join('') },
    { id: 'sea', w: 'seasons', t: 1, svg: [['SPRING', 500, 215], ['SUMMER', 880, 560], ['AUTUMN', 500, 905], ['WINTER', 120, 560]].map(([t, x, y], i) => `<g transform="translate(${x} ${y})"><g ${an('grow', .5, i * .25, 'center')}><rect x="-100" y="-30" width="200" height="60" rx="30" fill="#0f3d7a" stroke="${THEME.bpHi}" stroke-width="5"/>${M(0, 10, t, 26, THEME.bpHi)}</g></g>`).join('') }],
  // 2 STORY (paper)
  () => [
    { id: 'sun', always: true, svg: sunSvg(500, 560, 78, THEME.ink, true) },
    { id: 'frm', w: 'picture', t: 1, svg: `<rect x="40" y="130" width="920" height="90" rx="14" fill="#fff8e6" stroke="${THEME.ink}" stroke-width="6" stroke-dasharray="14 8"/>${T(500, 190, 'Once upon a time…', 44, THEME.accent, 'middle', GEO, 'font-style="italic" font-weight="bold"')}` },
    { id: 'trv', w: 'traveller', t: 1, svg: orbit(500, 560, 300, 8, earthIcon(44, true), THEME.ink) },
    { id: 'lean', w: 'leans', t: 1, svg: arrow(210, 960, 380, 880, THEME.accent) + T(220, 1030, 'LEAN IN', 36, THEME.accent) },
    { id: 'sum', w: 'summer', t: 1, svg: `<g ${an('grow', .6, 0, 'center')}>${sfx(700, 960, 'SUMMER!', -6, THEME.accent, 96, '#fff')}</g>` + [0, 1, 2].map(i => puff(640 + i * 60, 1000, 14, i * .5, -90, 1.6, 'rgba(255,140,0,.7)')).join('') }],
  // 3 CASUAL (sky)
  () => [
    { id: 'sm', always: true, svg: `<g transform="translate(150 420)">${stickman(0, 0, [-36, -10], [56, -66], { wave: true, wide: true })}</g>` },
    { id: 'bub', w: 'seasons', t: 1, svg: `<g ${an('pulse', 1.4)}><ellipse cx="610" cy="300" rx="330" ry="90" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/><polygon points="300,320 250,380 360,350" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/><polygon points="304,322 276,360 350,342" fill="#fff"/>${T(610, 292, 'Seasons? Not about', 40, THEME.ink, 'middle', GEO, 'font-weight="bold"')}${T(610, 338, 'distance… it’s TILT!', 40, THEME.accent, 'middle', GEO, 'font-weight="bold"')}</g>` },
    { id: 'dist', w: 'distance', t: 1, svg: sunSvg(190, 640, 64, THEME.ink) + `<g transform="translate(790 640)">${earthIcon(48)}</g><line x1="290" y1="640" x2="720" y2="640" stroke="${THEME.ink}" stroke-width="8" stroke-dasharray="14 10" ${an('flow', 1)}/>${T(500, 616, 'DISTANCE', 34, THEME.ink)}<g ${an('blink', .8)}><path d="M420 590 L580 690 M580 590 L420 690" stroke="#c0392b" stroke-width="14" stroke-linecap="round"/></g>` },
    { id: 'tlt', w: 'tilt', t: 1, svg: `<g transform="translate(260 930)"><g ${an('wobble', 1.2)}>${earthIcon(86)}</g></g><g ${an('grow', .6, 0, 'center')}>${sfx(690, 960, 'TILT!', -8, THEME.accent, 120, '#fff')}</g><g ${an('blink', 1)}><path d="M410 850 l24 26 l50 -56" fill="none" stroke="#2c6b5a" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></g>` },
    { id: 'sum', w: 'summer', t: 1, svg: `<g ${an('pulse', .9)}><rect x="620" y="1020" width="340" height="70" rx="35" fill="#ffd23f" stroke="${THEME.ink}" stroke-width="6"/>${T(790, 1070, 'SUMMER ☀', 40, THEME.ink)}</g>` }],
  // 4 STEPS (board)
  () => {
    const row = (i, w, label, icon) => ({ id: 'r' + i, w, t: 1, svg: `<g transform="translate(0 ${170 + i * 235})"><g ${an('grow', .5, 0, 'left')}><rect x="40" y="0" width="920" height="205" rx="24" fill="none" stroke="${CH}" stroke-width="6"/><circle cx="130" cy="102" r="52" fill="none" stroke="#ffe08a" stroke-width="6"/>${T(130, 122, String(i + 1), 64, '#ffe08a')}${T(250, 124, label, 76, CH, 'start')}<g transform="translate(790 102)">${icon}</g></g></g>` });
    return [
      row(0, 'one', 'TILT', `<g ${an('wobble', 1.2)}>${earthIcon(52, false, CH)}</g>`),
      row(1, 'two', 'ORBIT', `<circle r="58" fill="none" stroke="${CH}" stroke-width="4" stroke-dasharray="8 8"/><circle r="16" fill="#ffd23f"/><g ${an('spin', 3, 0, [0, 0])}><circle cy="-58" r="12" fill="#2d7fd1" stroke="${CH}" stroke-width="3"/></g>`),
      row(2, 'three', 'ANGLE', `<line x1="-60" y1="30" x2="60" y2="-6" stroke="${CH}" stroke-width="8" stroke-linecap="round" ${an('wobble', 1.4, 0, 'center')}/>${[-40, -10, 20].map(x => `<line x1="${x}" y1="-70" x2="${x + 14}" y2="-22" stroke="#ffd23f" stroke-width="6" stroke-linecap="round" ${an('flow dash', .6)}/>`).join('')}`),
      row(3, 'result', 'SEASONS', `${[['#6dff9c', -34, -34], ['#ffd23f', 34, -34], ['#ff9d4d', -34, 34], ['#7fe0ff', 34, 34]].map(([c, x, y], k) => `<g ${an('pulse', 1.2, k * .3)}><circle cx="${x}" cy="${y}" r="24" fill="${c}"/></g>`).join('')}`)];
  },
];

function clip(si, vi) {
    const s = STYLES[si], v = VOICES[vi];
    const groups = [...STYLE_VIS[si](), { id: 'lt', always: true, svg: lower(v, s, si) + viz(v.col) }];
    return {
        transition: 'fade', transitionDuration: 0.2,
        tts: { text: s.text, voice: v.kokoro, speed: SPEED, pauseAfter: 0.1 }, captions: false,
        layers: [{ type: 'background', color: s.bg }, comicScene({ badge: `VOICE ${v.id}  ·  ${s.name}`, badgeColor: v.col, theme: s.theme, groups })],
    };
}

// ── intro + outro ────────────────────────────────────────────────
const INTRO = "Voice test! Three voices, four explanation styles, one topic: why we have seasons. Listen, then vote.";
const OUTRO = "Which voice sounded best: A, B, or C? And which style explained it best? Vote in the poll on my channel. Thanks!";
const intro = { transition: 'fade', transitionDuration: 0.2, tts: { text: INTRO, voice: VOICES[0].kokoro, speed: SPEED, pauseAfter: 0.15 }, captions: false,
  layers: [{ type: 'background', color: '#050818' }, comicScene({ badge: 'VOICE TEST', badgeColor: THEME.accent, theme: 'night', groups: [
    { id: 'st', always: true, svg: stars(40, 5) },
    { id: 'tt', w: 'voice', t: 1, svg: `<g ${an('pulse', 1.2)}>${T(500, 300, 'VOICE TEST', 130, '#fff')}</g>${T(500, 380, 'WHICH ONE WINS?', 44, THEME.fireHi)}` },
    ...VOICES.map((v, i) => ({ id: 'm' + i, w: 'three', t: 1, svg: `<g transform="translate(${170 + i * 330} 640)"><g ${an('bob', 1.1, i * .3)}><rect x="-130" y="-170" width="260" height="340" rx="30" fill="${v.col}" stroke="#fff" stroke-width="7"/><rect x="-26" y="-110" width="52" height="96" rx="26" fill="#fff"/><path d="M-50 -20 Q-50 40 0 40 Q50 40 50 -20" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/><line x1="0" y1="40" x2="0" y2="76" stroke="#fff" stroke-width="8"/>${T(0, 150, v.id, 84, '#fff')}</g></g>` })),
    { id: 'sty', w: 'four', t: 1, svg: STYLES.map((s, i) => `<g transform="translate(${255 + (i % 2) * 490} ${960 + Math.floor(i / 2) * 100})"><g ${an('grow', .5, i * .3, 'center')}><rect x="-225" y="-38" width="450" height="76" rx="38" fill="#fff" stroke="${VOICES[i % 3].col}" stroke-width="7"/>${T(0, 13, (i + 1) + '  ' + s.name, 38, THEME.ink)}</g></g>`).join('') },
    { id: 'top', w: 'seasons', t: 1, svg: `<g transform="translate(500 1240)"><rect x="-400" y="-50" width="800" height="100" rx="50" fill="none" stroke="${THEME.fireHi}" stroke-width="6" stroke-dasharray="14 10" ${an('flow', 1.4)}/>${T(0, 14, 'WHY DO WE HAVE SEASONS?', 42, THEME.fireHi)}</g>` },
    { id: 'vz', always: true, svg: viz('#fff') }]})] };
const outro = { transition: 'fade', transitionDuration: 0.2, tts: { text: OUTRO, voice: VOICES[0].kokoro, speed: SPEED, pauseAfter: 0.15 }, captions: false,
  layers: [{ type: 'background', color: '#050818' }, comicScene({ badge: 'VOTE NOW', badgeColor: '#25d366', theme: 'night', groups: [
    { id: 'st', always: true, svg: stars(40, 8) },
    { id: 'pv', w: 'voice', t: 1, svg: `<g ${an('grow', .6, 0, 'center')}><rect x="40" y="170" width="920" height="470" rx="30" fill="#fff" stroke="#25d366" stroke-width="9"/>${T(500, 250, 'WHICH VOICE?', 56, THEME.ink)}${VOICES.map((v, i) => `<g transform="translate(0 ${330 + i * 100})"><circle cx="120" cy="0" r="28" fill="none" stroke="${v.col}" stroke-width="7"/><g ${an('blink', 1.2, i * .5)}><circle cx="120" cy="0" r="14" fill="${v.col}"/></g><rect x="190" y="-34" width="700" height="68" rx="34" fill="${v.col}"/>${T(540, 16, 'VOICE ' + v.id, 44, '#fff')}</g>`).join('')}</g>` },
    { id: 'ps', w: 'style', t: 1, svg: `<g ${an('grow', .6, 0, 'center')}><rect x="40" y="700" width="920" height="400" rx="30" fill="#fff" stroke="#25d366" stroke-width="9"/>${T(500, 774, 'WHICH STYLE?', 56, THEME.ink)}${STYLES.map((s, i) => `<g transform="translate(${255 + (i % 2) * 490} ${860 + Math.floor(i / 2) * 110})"><rect x="-215" y="-40" width="430" height="80" rx="40" fill="#e9f7ee" stroke="#25d366" stroke-width="5"/>${T(0, 14, (i + 1) + '  ' + s.name, 40, THEME.ink)}</g>`).join('')}</g>` },
    { id: 'tap', w: 'poll', t: 1, svg: `<g transform="translate(700 520)"><g ${an('move', .8, 0, 'center', '--dx:-30px;--dy:-30px;')}><circle r="40" fill="rgba(255,255,255,.35)" stroke="#fff" stroke-width="6"/><circle r="14" fill="#fff"/></g></g>${T(500, 1190, 'POLL ON MY CHANNEL', 60, '#25d366')}` },
    { id: 'th', w: 'thanks', t: 1, svg: `<g ${an('pulse', .9)}>${T(500, 1320, 'THANKS!', 96, '#fff')}</g>` },
    { id: 'vz', always: true, svg: viz('#25d366') }]})] };

function retime(s) {
    const words = s.tts.text.split(/\s+/).map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);
    const dur = words.length / 2.6;
    s.layers[1].html = s.layers[1].html.replace(/wire\((\{.*?\}), (\{.*?\}), (\[.*?\]), (\[.*?\])\);/s, (m0, rmS, hmS, fbS, hfbS) => {
        const rm = JSON.parse(rmS), tShow = {};
        Object.entries(rm).forEach(([w, ids]) => { const i = words.indexOf(w); if (i >= 0) ids.forEach(id => tShow[id] = i / 2.6 + .4); });
        const fix = list => list.map(([id, t]) => [id, +Math.min(tShow[id] !== undefined ? tShow[id] : t, Math.max(.2, dur - 1.2)).toFixed(1)]);
        return `wire(${rmS}, ${hmS}, ${JSON.stringify(fix(JSON.parse(fbS)))}, ${hfbS});`;
    });
    return s;
}
const sceneList = [intro];
STYLES.forEach((s, si) => VOICES.forEach((v, vi) => sceneList.push(clip(si, vi))));
sceneList.push(outro);

module.exports = {
    output: { title: 'kokoro-voice-test', format: 'portrait', fps: 30, crf: 23, preset: 'medium' },
    defaults: { voice: VOICES[0].kokoro, speed: SPEED, transition: 'fade', transitionDuration: 0.2 },
    scenes: sceneList.map(retime),
};
