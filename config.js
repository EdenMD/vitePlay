// config.nuclear-explosion-explained.js
// "How Does a Nuclear Explosion Work?" — APEX Video Engine config (science + history explainer)
// Conceptual level only: atom -> stored energy -> E=mc^2 -> fission -> chain reaction -> reactor vs bomb
//   -> why it is hard to make -> what an explosion does -> fusion -> history + prevention.
// ALL EASY-TO-CHANGE VARIABLES ARE IN THE `SETTINGS` BLOCK BELOW (voice, speed, pauses, quality).
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

// ═════════════════════════ SETTINGS: EDIT HERE ═════════════════════════
const SETTINGS = {
    VOICE: 'bm_george',            // Kokoro voice id. Try: 'am_adam', 'af_heart', 'bm_george', 'af_bella'
    SPEED: 0.94,                  // narration speed (1.0 = normal, lower = slower)
    PAUSE_AFTER: 0.25,            // seconds of silence after every scene (time to absorb)
    TRANSITION_SECONDS: 0.25,     // fade/wipe duration between scenes
    FPS: 30, CRF: 23, PRESET: 'medium', FORMAT: 'portrait',
    BASE_WORDS_PER_SEC: 2.75,    // fallback timing only: spoken words/sec at speed 1.0 (reveals normally follow the real spoken word)
};
const RATE = SETTINGS.BASE_WORDS_PER_SEC * SETTINGS.SPEED;
// ═══════════════════════════════════════════════════════════════════════

THEMES.scene = 'background:#000';
const X0 = -60, X1 = 1060, Y0 = -280, Y1 = 1700; let _g = 0;
const A = (txt, word) => { const ws = txt.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/); const i = ws.indexOf(word); if (i < 0) throw new Error('trigger "' + word + '" not in: ' + txt.slice(0, 40)); return +(i / RATE).toFixed(1); };
const G = (txt, id, w, extra) => Object.assign({ id, w, t: A(txt, w) }, extra);
const SCN = (txt, badge, groups, bc = '#b5402c') => { const s = scene('#000', txt, comicScene({ badge, badgeColor: bc, theme: 'scene', groups })); s.tts.pauseAfter = SETTINGS.PAUSE_AFTER; S.push(s); };

// ── scenery toolkit ─────────────────────────────────────────────
const bg = (stops, dir = 0) => { const id = 'lg' + (++_g); return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="${dir}" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient></defs><rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" fill="url(#${id})"/>`; };
const glow = (cx, cy, r, col, op = 1) => { const id = 'rg' + (++_g); return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${col}" stop-opacity="${op}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`; };
const ball = (cx, cy, r, c1, c2, c3) => { const id = 'rb' + (++_g); return `<defs><radialGradient id="${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${c1}"/><stop offset=".55" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></radialGradient></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`; };
const stars2 = (n, seed, y0, y1) => { const r = rng(seed); let o = ''; for (let i = 0; i < n; i++) o += `<circle ${an('twinkle', (1.2 + r() * 2.5).toFixed(1), (r() * 2).toFixed(1))} cx="${Math.round(X0 + r() * (X1 - X0))}" cy="${Math.round(y0 + r() * (y1 - y0))}" r="${(1.2 + r() * 2.4).toFixed(1)}" fill="#fff"/>`; return o; };
const hills = (y, col, amp, seed, op = 1) => { const r = rng(seed); let d = `M${X0} ${Y1} V${y}`; for (let x = X0; x < X1; x += 130) d += ` Q${x + 65} ${(y - amp * (.3 + r())).toFixed(0)} ${x + 130} ${(y + amp * (r() - .5)).toFixed(0)}`; return `<path d="${d} V${Y1}Z" fill="${col}" opacity="${op}"/>`; };
const jt = (x, y, s = 1, c = '#1f6b3a', c2 = '#2e8b4a') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-10" y="-130" width="20" height="130" fill="#5a3b22"/><circle cy="-165" r="62" fill="${c}"/><circle cx="-46" cy="-130" r="44" fill="${c2}"/><circle cx="46" cy="-135" r="46" fill="${c2}"/><circle cy="-205" r="42" fill="${c2}"/></g>`;
const acacia = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 0 L-4 -100 Q-30 -130 -62 -142 M4 -100 Q30 -130 72 -136" stroke="#4a3220" stroke-width="12" fill="none" stroke-linecap="round"/><ellipse cy="-152" rx="112" ry="26" fill="#6a8f3a"/><ellipse cx="-30" cy="-162" rx="70" ry="18" fill="#86b04a"/></g>`;
const sauro = (x, y, s = 1, c = '#1a1020') => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><ellipse cy="-60" rx="90" ry="38"/><path d="M60 -80 Q112 -150 122 -232 L142 -232 Q130 -140 92 -60Z"/><ellipse cx="148" cy="-234" rx="22" ry="11"/><path d="M-80 -60 Q-160 -40 -212 -8 Q-150 -42 -80 -30Z"/><rect x="-62" y="-40" width="22" height="46"/><rect x="-20" y="-40" width="22" height="46"/><rect x="25" y="-40" width="22" height="46"/><rect x="62" y="-40" width="22" height="46"/></g>`;
const fish = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="40" ry="20" fill="${c}"/><path d="M36 0 L68 -20 L68 20Z" fill="${c}"/><circle cx="-20" cy="-5" r="4.5" fill="#fff"/><circle cx="-21" cy="-5" r="2" fill="#111"/></g>`;
const shrew = (s = 1) => `<g transform="scale(${s})"><path d="M-40 -14 Q-92 -34 -112 -6" stroke="#7a5a44" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cy="-18" rx="42" ry="22" fill="#8a6a54"/><path d="M36 -28 L76 -14 L36 -6Z" fill="#8a6a54"/><circle cx="26" cy="-26" r="3.5" fill="#111"/><circle cx="12" cy="-38" r="8" fill="#a07a62"/><rect x="-24" y="-4" width="8" height="12" fill="#6a4a38"/><rect x="14" y="-4" width="8" height="12" fill="#6a4a38"/></g>`;
const cell = (x, y, r, col, spot) => `<g transform="translate(${x} ${y})"><circle r="${r * 1.5}" fill="${col}" opacity=".18"/><circle r="${r}" fill="${col}" stroke="#fff" stroke-width="${Math.max(2, r / 7)}" opacity=".95"/><circle cx="${-r * .3}" cy="${-r * .2}" r="${r * .28}" fill="#fff" opacity=".5"/><circle cx="${r * .25}" cy="${r * .25}" r="${r * .2}" fill="${spot || '#fff'}" opacity=".85"/></g>`;
const apeSvg = (fur = '#5b3a29', face = '#d9a67a') => `<path d="M-16 -50 L-20 0 M16 -50 L20 0" stroke="${fur}" stroke-width="16" stroke-linecap="round"/><ellipse cy="-84" rx="34" ry="44" fill="${fur}"/><ellipse cy="-76" rx="21" ry="30" fill="${face}" opacity=".55"/><path d="M-30 -112 Q-70 -70 -60 -14 M30 -112 Q70 -70 60 -14" stroke="${fur}" stroke-width="15" fill="none" stroke-linecap="round"/><circle cx="-62" cy="-10" r="9" fill="${fur}"/><circle cx="62" cy="-10" r="9" fill="${fur}"/><circle cy="-148" r="30" fill="${fur}"/><circle cx="-31" cy="-148" r="11" fill="${face}"/><circle cx="31" cy="-148" r="11" fill="${face}"/><ellipse cy="-142" rx="20" ry="19" fill="${face}"/><circle cx="-8" cy="-150" r="3.5" fill="#1a1210"/><circle cx="8" cy="-150" r="3.5" fill="#1a1210"/><ellipse cy="-138" rx="9" ry="5" fill="#b9825a"/><path d="M-7 -131 Q0 -126 7 -131" stroke="#1a1210" stroke-width="2.5" fill="none"/>`;
const humanSvg = (skin = '#c68642', shirt = '#2d5fb5', hair = '#2a1a10') => `<path d="M-9 -50 V0 M9 -50 V0" stroke="#33415c" stroke-width="13" stroke-linecap="round"/><rect x="-22" y="-112" width="44" height="64" rx="12" fill="${shirt}"/><path d="M-22 -104 L-34 -56 M22 -104 L34 -56" stroke="${skin}" stroke-width="11" stroke-linecap="round"/><circle cy="-134" r="22" fill="${skin}"/><path d="M-23 -138 A23 23 0 0 1 23 -138 Q0 -150 -23 -138Z" fill="${hair}"/><circle cx="-7" cy="-132" r="2.6" fill="#1a1210"/><circle cx="7" cy="-132" r="2.6" fill="#1a1210"/><path d="M-7 -123 Q0 -117 7 -123" stroke="#1a1210" stroke-width="2.5" fill="none"/>`;
const earthIcon = (r) => `${glow(0, 0, r * 1.5, '#6fc3ff', .45)}${ball(0, 0, r, '#9fe0ff', '#2d7ac2', '#08285a')}<path d="M${-r * .5} ${-r * .2} q${r * .3} ${-r * .4} ${r * .55} ${-r * .1} q${-r * .05} ${r * .35} ${-r * .3} ${r * .45} q${-r * .3} ${-r * .05} ${-r * .25} ${-r * .35}z M${r * .15} ${r * .25} q${r * .3} ${-r * .15} ${r * .4} ${r * .1} q${-r * .1} ${r * .3} ${-r * .35} ${r * .25}z" fill="#58b368"/>`;
const tag = (x, y, t, sz = 34, fill = '#fff', bgc = 'rgba(10,12,30,.62)') => { const w = t.length * sz * .56 + 36; return `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="${-sz * .85}" width="${w}" height="${sz * 1.35}" rx="${sz * .4}" fill="${bgc}"/>${T(0, sz * .18, t, sz, fill)}</g>`; };
const jungle = (a) => `${bg([[0, '#1d5a3c'], [.5, '#4f9a5a'], [1, '#c8e6a0']])}${glow(780, 180, 420, '#fff6c0', .7)}${hills(900, '#2f7a45', 80, a, .9)}${[60, 240, 760, 940].map((x, i) => jt(x, 1000 + (i % 2) * 40, 1.6 - i * .1, '#14502d', '#1f6b3a')).join('')}${hills(1250, '#1a5a30', 60, a + 1)}`;
const savanna = (a) => `${bg([[0, '#ffb35a'], [.45, '#ffd98a'], [1, '#f4e1a0']])}${glow(500, 880, 520, '#fff0b0', .85)}<circle cx="500" cy="860" r="120" fill="#ffe9a0"/>${hills(960, '#c9a24a', 40, a, .9)}${hills(1090, '#b08a35', 50, a + 1)}`;
const grass = (n, seed, y0, y1, col) => { const r = rng(seed); let o = ''; for (let i = 0; i < n; i++) { const x = X0 + r() * (X1 - X0), y = y0 + r() * (y1 - y0), h = 30 + r() * 40; o += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-8 ${h.toFixed(0)} M${x.toFixed(0)} ${y.toFixed(0)} l0 ${h.toFixed(0)} M${x.toFixed(0)} ${y.toFixed(0)} l8 ${h.toFixed(0)}" stroke="${col}" stroke-width="4" stroke-linecap="round" fill="none" transform="translate(0 ${-h})"/>`; } return o; };
// blueprint helpers (for diagram scenes)
const BL = THEME.bpLine, BH = THEME.bpHi, BS = THEME.bpSoft, DB = '#0f3d7a';
const bpBg = () => `<rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" fill="#0f3d7a"/><g stroke="rgba(255,255,255,.08)" stroke-width="1">${Array.from({ length: 46 }, (_, i) => `<line x1="${X0 + i * 24}" y1="${Y0}" x2="${X0 + i * 24}" y2="${Y1}"/>`).join('')}${Array.from({ length: 83 }, (_, i) => `<line x1="${X0}" y1="${Y0 + i * 24}" x2="${X1}" y2="${Y0 + i * 24}"/>`).join('')}</g><g stroke="rgba(255,255,255,.16)" stroke-width="2">${Array.from({ length: 10 }, (_, i) => `<line x1="${X0 + i * 120}" y1="${Y0}" x2="${X0 + i * 120}" y2="${Y1}"/>`).join('')}${Array.from({ length: 17 }, (_, i) => `<line x1="${X0}" y1="${Y0 + i * 120}" x2="${X1}" y2="${Y0 + i * 120}"/>`).join('')}</g>`;
const paperBg = () => `<rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" fill="#efe6d3"/>${glow(500, 700, 700, '#fff8e6', .7)}`;


function box0(x, y, w, h) { return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="16" fill="#fff" stroke="#231b12" stroke-width="6"/>`; }

// ── extra helpers for this video ────────────────────────────────
const nuc = (n, seed, rr, pr = 15) => { const r = rng(seed); let o = ''; for (let i = 0; i < n; i++) { const rad = rr * Math.sqrt((i + .5) / n), a = i * 2.399963, p = r() > .5; o += `<circle cx="${(Math.cos(a) * rad).toFixed(1)}" cy="${(Math.sin(a) * rad).toFixed(1)}" r="${pr}" fill="${p ? '#e63946' : '#aab3bd'}" stroke="#fff" stroke-width="2"/>`; } return o; };
const skyline = (y, seed, col, win) => { const r = rng(seed); let o = ''; for (let x = X0; x < X1; x += 60) { const h = 80 + r() * 260; o += `<rect x="${x}" y="${y - h}" width="54" height="${h}" fill="${col}"/>`; if (win) for (let k = 0; k < h / 40; k++) if (r() > .5) o += `<rect x="${x + 10}" y="${y - h + 14 + k * 36}" width="8" height="12" fill="${win}"/><rect x="${x + 30}" y="${y - h + 14 + k * 36}" width="8" height="12" fill="${win}"/>`; } return o; };
const trap = (x, y) => `<g transform="translate(${x} ${y})"><rect x="-44" y="-26" width="88" height="52" rx="6" fill="#c8a060" stroke="#4a3220" stroke-width="4"/><path d="M-30 -14 H30 M-30 14 H30" stroke="#6a4a2a" stroke-width="5"/><circle r="12" fill="#fff" stroke="#999" stroke-width="2"/></g>`;
const flyBalls = (cx, cy, n, seed) => { const r = rng(seed); let o = ''; for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = 160 + r() * 330; o += `<g ${an('move', (1.2 + r() * 1.4).toFixed(1), (r() * 1.2).toFixed(1), 'center', `--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d).toFixed(0)}px;--dir:normal;--e:ease-out;`)}><circle cx="${cx}" cy="${cy}" r="14" fill="#fff" stroke="#e63946" stroke-width="4"/></g>`; } return o; };
const chess = (x, y, s) => { let o = ''; for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) { o += `<rect x="${x + i * s}" y="${y + j * s}" width="${s}" height="${s}" fill="${(i + j) % 2 ? '#2a2a2e' : '#e8e0cc'}"/>`; const n = j * 8 + i; o += `<circle cx="${x + i * s + s / 2}" cy="${y + j * s + s / 2}" r="${Math.min(s * .46, 1.5 + n * .55).toFixed(1)}" fill="#fff6c0" stroke="#9a8a5a" stroke-width="1"/>`; } return o; };
const emc2 = (x, y, sz, fill) => `<text x="${x}" y="${y}" font-size="${sz}" text-anchor="middle" fill="${fill}" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-weight="bold">E = mc<tspan dy="-${(sz * .38).toFixed(0)}" font-size="${(sz * .6).toFixed(0)}">2</tspan></text>`;
const trefoil = (r, col, bgc) => `<circle r="${r}" fill="${bgc}" stroke="${col}" stroke-width="8"/>${[90, 210, 330].map(a => { const a1 = (a - 30) * Math.PI / 180, a2 = (a + 30) * Math.PI / 180; const R = r * .82; return `<path d="M0 0 L${(Math.cos(a1) * R).toFixed(1)} ${(Math.sin(a1) * R).toFixed(1)} A${R} ${R} 0 0 1 ${(Math.cos(a2) * R).toFixed(1)} ${(Math.sin(a2) * R).toFixed(1)}Z" fill="${col}"/>`; }).join('')}<circle r="${r * .16}" fill="${col}"/><circle r="${r * .1}" fill="${bgc}"/>`;
const mushroom = () => `${glow(0, 40, 360, '#ff7a1a', .6)}<ellipse cy="10" rx="230" ry="46" fill="#8a6a54" opacity=".9"/><path d="M-62 0 Q-34 -130 -78 -250 L78 -250 Q40 -130 66 0Z" fill="#7a5a48"/><path d="M-30 -10 Q-10 -130 -44 -240" stroke="#a08068" stroke-width="10" fill="none" opacity=".7"/>${[[0, -340, 120, '#ff8a3d'], [-120, -300, 90, '#e0602a'], [120, -300, 90, '#e0602a'], [-70, -410, 90, '#ffa04d'], [70, -410, 90, '#ffa04d'], [0, -470, 80, '#ffc060']].map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('')}${[[-170, -330, 70], [170, -330, 70], [0, -540, 64]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#6a5a54" opacity=".75"/>`).join('')}<ellipse cx="0" cy="-250" rx="130" ry="30" fill="#5a4a44" opacity=".8"/>`;

// ── 0 THE HOOK ──────────────────────────────────────────────────
const N0 = "One single bomb can flatten a city. So where does all that energy come from? Not from chemicals, like dynamite. It comes from something unimaginably smaller: the heart of the atom. Let us see how a nuclear explosion works, and why the world works so hard to prevent one.";
SCN(N0, 'HOW DOES A NUCLEAR EXPLOSION WORK?', [
    { id: 'bg', always: true, svg: `${bg([[0, '#050818'], [.55, '#2a1440'], [1, '#a0451e']])}${stars2(60, 5, -260, 800)}${glow(500, 1350, 600, '#ff8a3d', .5)}` },
    G(N0, 'en', 'energy', { x: 500, y: 270, svg: sfx(0, 0, 'WHERE DOES THE ENERGY COME FROM?', -2, '#ffd23f', 46, '#050818') }),
    G(N0, 'ct', 'city', { x: 0, y: 0, svg: `${skyline(1400, 7, '#0c0c18', '#ffd23f')}${tag(500, 1180, 'ONE BOMB CAN FLATTEN A CITY', 36)}` }),
    G(N0, 'ch', 'chemicals', { x: 250, y: 700, svg: `${[-40, 0, 40].map(x => `<rect x="${x - 14}" y="-70" width="28" height="140" rx="10" fill="#e63946" stroke="#7a1a22" stroke-width="4"/>`).join('')}<path d="M0 -70 Q10 -110 30 -100" stroke="#ffd23f" stroke-width="5" fill="none"/><path d="M-110 -110 L110 110 M110 -110 L-110 110" stroke="#ff4d4d" stroke-width="14" stroke-linecap="round"/>${tag(0, 160, 'NOT CHEMICALS', 34)}` }),
    G(N0, 'at', 'atom', { x: 710, y: 700, svg: `${glow(0, 0, 220, '#7fe0ff', .5)}<g ${an('spin', 8, 0, [0, 0])}>${[0, 60, 120].map(a => `<ellipse rx="150" ry="52" fill="none" stroke="#7fe0ff" stroke-width="4" transform="rotate(${a})"/>`).join('')}<circle cx="150" cy="0" r="11" fill="#fff"/></g>${nuc(9, 3, 34, 15)}${tag(0, 200, 'THE HEART OF THE ATOM', 32)}` }),
    G(N0, 'pr', 'prevent', { x: 500, y: 1470, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'AND WHY WE MUST PREVENT ONE', -2, '#fff', 44, '#2a1440')}</g>` })
], '#a0451e');

// ── 1 INSIDE THE ATOM (blueprint) ───────────────────────────────
const N1 = "Everything is made of atoms. At the center of every atom is a tiny nucleus, packed with protons and neutrons. Imagine an atom as a huge stadium. The nucleus would be a single grain of sand in the middle, yet almost all of the atom's weight sits in that grain.";
SCN(N1, '1 - INSIDE THE ATOM', [
    { id: 'bg', always: true, svg: `${bpBg()}${dr('M20 20 H980 V1440 H20Z', 0, 2, 4)}${M(500, 130, 'FIG. 1 - THE ATOM AND ITS NUCLEUS', 28, BH)}` },
    G(N1, 'nu', 'nucleus', { x: 500, y: 1080, svg: `${glow(0, 0, 260, '#ff9d9d', .35)}<g ${an('pulse', 2)}>${nuc(24, 5, 105, 26)}</g>${tag(0, 170, 'THE NUCLEUS (HUGELY ZOOMED IN)', 30, DB, BH)}` }),
    G(N1, 'pr', 'protons', { x: 500, y: 1330, svg: `<circle cx="-250" cy="0" r="16" fill="#e63946" stroke="#fff" stroke-width="3"/>${M(-225, 8, 'PROTONS', 24, '#fff', 'start')}<circle cx="90" cy="0" r="16" fill="#aab3bd" stroke="#fff" stroke-width="3"/>${M(115, 8, 'NEUTRONS', 24, '#fff', 'start')}` }),
    G(N1, 'st', 'stadium', { x: 500, y: 520, svg: `${[330, 290, 250].map((r, i) => `<ellipse rx="${r + 60}" ry="${r}" fill="${i === 2 ? '#2a7a3a' : 'rgba(255,255,255,.08)'}" stroke="${BL}" stroke-width="${6 - i}"/>`).join('')}<ellipse rx="190" ry="170" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 8"/>${tag(0, 400, 'AN ATOM AS A HUGE STADIUM', 32, DB, BH)}` }),
    G(N1, 'sa', 'sand', { x: 500, y: 520, svg: `<g ${an('pulse', .8)}><circle r="22" fill="none" stroke="${BH}" stroke-width="5"/></g><circle r="5" fill="#ffe08a"/>${dr('M10 20 C80 160 90 300 20 480', 0, 1.2, 4, BH)}${tag(190, 20, 'A GRAIN OF SAND', 28, DB, BH)}` })
], '#0f3d7a');

// ── 2 STORED ENERGY ─────────────────────────────────────────────
const N2 = "Protons all carry a positive charge, so they push each other apart. But a much stronger force, the strong nuclear force, glues the nucleus together. Think of a tightly wound spring, held shut by a strong latch. All that squeezed-in energy is waiting to be released.";
const spring = (n) => { let d = 'M-150 0 '; for (let i = 0; i < n; i++) d += `l${300 / n / 2} -34 l${300 / n} 68 l${300 / n / 2} -34 `; return `<path d="${d}" fill="none" stroke="#cfd6de" stroke-width="10" stroke-linejoin="round"/>`; };
SCN(N2, '2 - ENERGY LOCKED INSIDE', [
    { id: 'bg', always: true, svg: `${bg([[0, '#1a1f4a'], [1, '#0b0e28']])}${stars2(50, 41, -260, 1650)}` },
    G(N2, 'pu', 'push', { x: 500, y: 420, svg: `${glow(0, 0, 260, '#ff6b6b', .35)}<g ${an('pulse', 1.2)}>${nuc(16, 9, 78, 24)}</g>${[0, 60, 120, 180, 240, 300].map(a => `<g transform="rotate(${a})"><path d="M120 0 H190" stroke="#ff6b6b" stroke-width="8" stroke-linecap="round"/><path d="M174 -16 L196 0 L174 16" fill="none" stroke="#ff6b6b" stroke-width="8" stroke-linecap="round"/></g>`).join('')}${tag(0, 250, 'PROTONS PUSH EACH OTHER APART', 30)}` }),
    G(N2, 'st', 'strong', { x: 500, y: 420, svg: `<circle r="132" fill="none" stroke="#6dff9c" stroke-width="12" stroke-dasharray="4 14" ${an('flow', 1.5)}/>${tag(0, -200, 'THE STRONG NUCLEAR FORCE: GLUE', 30, '#0b0e28', '#6dff9c')}` }),
    G(N2, 'sp', 'spring', { x: 500, y: 1010, svg: `<rect x="-250" y="-90" width="500" height="180" rx="14" fill="rgba(255,255,255,.06)" stroke="#8fbcff" stroke-width="6"/>${spring(7)}<rect x="170" y="-60" width="24" height="120" rx="6" fill="#ffd23f" stroke="#fff" stroke-width="4"/>${tag(0, 160, 'A TIGHTLY WOUND SPRING, HELD BY A LATCH', 28)}` }),
    G(N2, 're', 'released', { x: 500, y: 1010, svg: `${glow(0, 0, 330, '#ffd23f', .6)}<g ${an('pulse', .5)}>${sfx(0, -150, 'ENERGY WAITING TO BE RELEASED!', -2, '#ffd23f', 38, '#0b0e28')}</g>` })
], '#2d5fb5');

// ── 3 E = mc2 ───────────────────────────────────────────────────
const N3 = "Where does the energy come from? Einstein's famous equation, E equals m c squared, says mass and energy are two forms of the same thing. When a nucleus splits, the pieces weigh a tiny bit less than the original. That missing mass has not vanished. It turned into energy. In the bomb used on Hiroshima, less than one gram of matter became energy, and the factor c squared is so huge that it was enough to destroy a city.";
SCN(N3, '3 - MASS BECOMES ENERGY', [
    { id: 'bg', always: true, svg: `${bg([[0, '#101a3a'], [1, '#050818']])}${stars2(40, 51, -260, 1650)}` },
    G(N3, 'eq', 'equation', { x: 500, y: 330, svg: `${glow(0, -30, 330, '#ffd23f', .4)}${emc2(0, 40, 150, '#ffd23f')}` }),
    G(N3, 'sc', 'splits', { x: 500, y: 900, svg: `<path d="M0 -20 V240 M-110 240 H110" stroke="#cfd6de" stroke-width="12" stroke-linecap="round"/><g ${an('rot', 2.6, 0, [0, -20], '--r0:-9deg;--r1:9deg;')}><path d="M-300 -20 H300" stroke="#cfd6de" stroke-width="12" stroke-linecap="round"/><path d="M-300 -20 L-340 120 H-260Z M300 -20 L260 120 H340Z" fill="none" stroke="#cfd6de" stroke-width="6"/><g transform="translate(-300 90)">${nuc(18, 4, 52, 15)}</g><g transform="translate(300 90)"><g transform="translate(-34 0)">${nuc(8, 6, 28, 13)}</g><g transform="translate(36 6)">${nuc(8, 8, 28, 13)}</g></g></g>${M(-300, 330, 'BEFORE', 28, '#fff')}${M(300, 330, 'AFTER: A BIT LIGHTER', 26, '#fff')}` }),
    G(N3, 'mi', 'missing', { x: 500, y: 1330, svg: `${tag(0, 0, 'THE MISSING MASS HAS NOT VANISHED...', 32)}` }),
    G(N3, 'gr', 'gram', { x: 500, y: 560, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'LESS THAN 1 GRAM!', -2, '#6dff9c', 62, '#050818')}</g>` }),
    G(N3, 'hu', 'huge', { x: 500, y: 1450, svg: `<g ${an('pulse', .7)}>${sfx(0, 0, 'c² IS HUGE: TINY MASS = ENORMOUS ENERGY', -2, '#ffd23f', 34, '#050818')}</g>` })
], '#2d5fb5');

// ── 4 FISSION: THE WATER DROP ───────────────────────────────────
const N4 = "The splitting is called fission. Some very heavy atoms, like uranium, are wobbly. Picture a big water drop that is barely holding together. Hit it with a small neutron, and it wobbles, stretches, and pinches in the middle, until it splits into two smaller drops, flinging out two or three more neutrons and a burst of energy.";
const blob = (x, y, rx, ry, col) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${col}" stroke="#fff" stroke-width="5" opacity=".95"/><ellipse cx="${x - rx * .3}" cy="${y - ry * .3}" rx="${rx * .22}" ry="${ry * .16}" fill="#fff" opacity=".5"/>`;
SCN(N4, '4 - FISSION: THE SPLITTING', [
    { id: 'bg', always: true, svg: `${bg([[0, '#0b2a4a'], [1, '#061224']])}${glow(500, 700, 700, '#2a7ab0', .3)}` },
    G(N4, 'ti', 'fission', { x: 500, y: 150, svg: sfx(0, 0, 'FISSION = SPLITTING', -2, '#ffd23f', 64, '#061224') }),
    G(N4, 'dr', 'drop', { x: 500, y: 520, svg: `${blob(-330, 0, 100, 100, '#4aa3e8')}${tag(-330, 170, 'A BIG WATER DROP', 28)}` }),
    G(N4, 'ne', 'neutron', { x: 500, y: 520, svg: `<g ${an('move', 1.4, 0, 'center', '--dx:140px;')}><circle cx="-540" cy="0" r="16" fill="#aab3bd" stroke="#fff" stroke-width="3"/></g>${tag(-470, -80, 'NEUTRON!', 28, '#061224', '#ffd23f')}` }),
    G(N4, 'wo', 'wobbles', { x: 500, y: 520, svg: `${blob(-110, 0, 128, 84, '#4aa3e8')}${arrow(-330, 0, -250, 0, '#fff', 6)}` }),
    G(N4, 'pi', 'pinches', { x: 500, y: 520, svg: `${blob(110, 0, 84, 70, '#4aa3e8')}${blob(180, 0, 70, 66, '#4aa3e8')}<rect x="150" y="-14" width="30" height="28" fill="#4aa3e8"/>${arrow(-110, 0, -30, 0, '#fff', 6)}` }),
    G(N4, 'fl', 'flinging', { x: 500, y: 520, svg: `${arrow(260, 0, 330, 0, '#fff', 6)}${blob(400, -60, 62, 60, '#4aa3e8')}${blob(400, 70, 62, 60, '#4aa3e8')}${[[470, -140], [510, 0], [470, 150]].map(([x, y], i) => `<g ${an('pulse', .6, i * .2)}><circle cx="${x}" cy="${y}" r="14" fill="#aab3bd" stroke="#fff" stroke-width="3"/></g>`).join('')}${glow(400, 0, 200, '#ffd23f', .55)}` }),
    G(N4, 'ur', 'uranium', { x: 500, y: 1130, svg: `${BC0(900, 250)}<g transform="translate(-340 -10)">${nuc(20, 12, 58, 16)}${M(0, 100, 'URANIUM', 24, '#fff')}</g>${T(-230, 16, '+', 60, '#fff')}<circle cx="-170" cy="0" r="16" fill="#aab3bd" stroke="#fff" stroke-width="3"/>${T(-100, 16, '>', 60, '#ffd23f')}<g transform="translate(40 -30)">${nuc(8, 3, 34, 14)}</g><g transform="translate(150 40)">${nuc(8, 5, 34, 14)}</g>${[[250, -50], [290, 0], [250, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="#aab3bd" stroke="#fff" stroke-width="3"/>`).join('')}${M(0, 130, 'ONE NEUTRON IN: TWO SMALLER ATOMS + 2-3 NEUTRONS + ENERGY', 22, '#fff')}` })
], '#2a7ab0');
function BC0(w, h) { return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="16" fill="rgba(255,255,255,.07)" stroke="#8fbcff" stroke-width="5"/>`; }

// ── 5 THE CHAIN REACTION: MOUSETRAPS ────────────────────────────
const N5 = "Here is the key idea. Those freed neutrons can hit other nuclei and split them too. It is like a room full of mousetraps, each one loaded with ping pong balls. Drop one ball, a trap snaps and throws more balls, which snap more traps, until the whole room is a storm of flying balls. This is a chain reaction.";
SCN(N5, '5 - THE CHAIN REACTION', [
    { id: 'bg', always: true, svg: `${bg([[0, '#fdebd0'], [1, '#e8c89a']])}${Array.from({ length: 22 }, (_, i) => `<circle cx="${(i * 211) % 1100 - 40}" cy="${(i * 347) % 1900 - 260}" r="${24 + (i % 4) * 14}" fill="rgba(255,255,255,.3)"/>`).join('')}` },
    G(N5, 'mt', 'mousetraps', { x: 500, y: 760, svg: Array.from({ length: 28 }, (_, i) => trap(-390 + (i % 7) * 130, -230 + Math.floor(i / 7) * 150)).join('') + T(0, -330, 'A ROOM FULL OF MOUSETRAPS', 44, '#b5402c') }),
    G(N5, 'dp', 'drop', { x: 500, y: 760, svg: `<g ${an('move', 1.2, 0, 'center', '--dy:250px;--dir:normal;--e:ease-in;')}><circle cx="-390" cy="-480" r="20" fill="#fff" stroke="#e63946" stroke-width="5"/></g>${tag(-330, -300, 'DROP ONE BALL', 28, '#fff', 'rgba(181,64,44,.9)')}` }),
    G(N5, 'sn', 'snaps', { x: 500, y: 760, svg: `${flyBalls(-390, -230, 12, 3)}${flyBalls(-130, -80, 12, 4)}${flyBalls(130, -230, 12, 5)}${flyBalls(390, 70, 12, 6)}<g ${an('wobble', .4)}>${sfx(-300, -280, 'SNAP!', -8, '#e63946', 64, '#fff')}</g>` }),
    G(N5, 'ch', 'chain', { x: 500, y: 1330, svg: `<g ${an('pulse', .8)}>${sfx(0, 0, 'A CHAIN REACTION!', -2, '#b5402c', 72, '#fff')}</g>${T(0, 70, 'each split frees neutrons that cause more splits', 28, '#231b12', 'middle', FM, 'font-weight="bold"')}` })
], '#b5402c');

// ── 6 DOUBLING: THE CHESSBOARD ──────────────────────────────────
const N6 = "A chain reaction grows by doubling. One split causes two, then four, then eight, then sixteen. Imagine a chessboard. Put one grain of rice on the first square, then double it on every square. By the end, the board holds about eighteen quintillion grains. In a bomb, that kind of doubling happens in millionths of a second.";
SCN(N6, '6 - DOUBLING FAST', [
    { id: 'bg', always: true, svg: `${bg([[0, '#2a1a3a'], [1, '#120a22']])}${stars2(50, 61, -260, 1650)}` },
    G(N6, 'db', 'doubling', { x: 500, y: 300, svg: [1, 2, 4, 8, 16].map((n, i) => `<g transform="translate(${-380 + i * 190} 0)">${Array.from({ length: n }, (_, k) => `<circle cx="${((k % 4) - Math.min(n, 4) / 2 + .5) * 24}" cy="${Math.floor(k / 4) * 24 - 10}" r="9" fill="#ffd23f" stroke="#fff" stroke-width="2"/>`).join('')}${T(0, 90, String(n), 40, '#fff')}</g>${i < 4 ? `<path d="M${-330 + i * 190 + 40} 0 H${-330 + i * 190 + 100}" stroke="#fff" stroke-width="6" stroke-linecap="round"/>` : ''}`).join('') + T(0, -100, 'ONE SPLIT > TWO > FOUR > EIGHT > SIXTEEN...', 30, '#ffd23f') }),
    G(N6, 'cb', 'chessboard', { x: 500, y: 960, svg: chess(-280, -280, 70) + `<rect x="-280" y="-280" width="560" height="560" fill="none" stroke="#fff" stroke-width="8"/>${tag(0, -330, 'GRAINS OF RICE ON A CHESSBOARD', 30)}` }),
    G(N6, 'qu', 'quintillion', { x: 500, y: 1380, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, '~18,000,000,000,000,000,000 GRAINS!', -2, '#6dff9c', 36, '#120a22')}</g>` }),
    G(N6, 'mi', 'millionths', { x: 500, y: 1460, svg: `<circle cx="-330" cy="-10" r="36" fill="none" stroke="#fff" stroke-width="6"/><g ${an('spin', .6, 0, [-330, -10])}><line x1="-330" y1="-10" x2="-330" y2="-36" stroke="#ffd23f" stroke-width="6" stroke-linecap="round"/></g>${tag(40, 0, 'IN MILLIONTHS OF A SECOND', 34, '#120a22', '#ffd23f')}` })
], '#7a3aa0');

// ── 7 REACTOR VS BOMB ───────────────────────────────────────────
const N7 = "A nuclear power plant uses the same chain reaction, but keeps it under control. Special rods soak up extra neutrons and act like brakes, so each split causes about one more split, not two. It is a steady campfire. A bomb has no brakes, so every split causes more, like a whole pile of fireworks lighting at once.";
const fire = (s) => `<g transform="scale(${s})"><path d="M0 -90 Q60 -20 36 40 Q18 80 0 80 Q-50 80 -50 30 Q-50 -10 -20 -50 Q-10 -20 0 -90Z" fill="#ff7a1a"/><path d="M0 -20 Q26 20 14 52 Q0 66 -14 52 Q-24 20 0 -20Z" fill="#ffd23f"/></g>`;
SCN(N7, '7 - REACTOR VS BOMB', [
    { id: 'bg', always: true, svg: `${bg([[0, '#101a3a'], [1, '#050818']])}<rect x="500" y="${Y0}" width="${X1 - 500}" height="${Y1 - Y0}" fill="#0a0a14"/>${stars2(50, 71, -260, 900)}<line x1="500" y1="-100" x2="500" y2="1500" stroke="#fff" stroke-width="4" stroke-dasharray="14 10" opacity=".5"/>` },
    G(N7, 'pw', 'power', { x: 250, y: 330, svg: `${tag(0, 0, 'POWER PLANT: UNDER CONTROL', 28, '#fff', 'rgba(44,107,90,.9)')}` }),
    G(N7, 'rd', 'rods', { x: 250, y: 800, svg: `${[-110, -40, 30, 100].map((x, i) => `<g ${an('bob', 1.6, i * .3)}><rect x="${x - 12}" y="-280" width="24" height="200" fill="#aab3bd" stroke="#fff" stroke-width="3"/></g>`).join('')}<rect x="-160" y="-80" width="320" height="140" rx="12" fill="rgba(255,150,60,.25)" stroke="#ffb36b" stroke-width="5"/>${tag(0, 120, 'RODS = BRAKES', 30, '#050818', '#6dff9c')}${M(0, 180, 'each split causes about ONE more', 22, '#fff')}` }),
    G(N7, 'cf', 'campfire', { x: 250, y: 1230, svg: `<g ${an('flicker', .2, 0, 'bottom')}>${fire(1.5)}</g><path d="M-90 90 L90 130 M90 90 L-90 130" stroke="#6a4a2a" stroke-width="18" stroke-linecap="round"/>${sfx(0, 190, 'A STEADY CAMPFIRE', -2, '#ffb36b', 44, '#050818')}` }),
    G(N7, 'fw', 'fireworks', { x: 750, y: 900, svg: [[0, 0, '#ff4d4d'], [-120, 200, '#ffd23f'], [120, -180, '#4dd0ff'], [-140, -220, '#6dff9c']].map(([x, y, c], i) => `<g transform="translate(${x} ${y})">${Array.from({ length: 14 }, (_, k) => `<line x1="30" y1="0" x2="${100 + (k % 3) * 20}" y2="0" stroke="${c}" stroke-width="7" stroke-linecap="round" transform="rotate(${k * 25.7})" ${an('blink', .5 + i * .1, k * .04)}/>`).join('')}</g>`).join('') + sfx(0, 380, 'FIREWORKS ALL AT ONCE', -2, '#ffd23f', 40, '#0a0a14') + tag(0, -330, 'NO BRAKES: EVERY SPLIT CAUSES MORE', 24, '#fff', 'rgba(150,30,40,.9)') })
], '#2c6b5a');

// ── 8 WHY IT IS HARD ────────────────────────────────────────────
const N8 = "Here is why nuclear bombs are not common. Only a rare kind of uranium will do this, less than one percent of natural uranium. Separating it from the common kind is slow, costly, and needs giant industrial plants. That difficulty is one big reason that very few countries have nuclear weapons.";
const marbles = (() => { const r = rng(81); let o = ''; for (let i = 0; i < 150; i++) { const x = -330 + r() * 660, y = -110 + r() * 220, red = r() > .985; o += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="14" fill="${red ? '#ff4d4d' : '#8a929b'}" stroke="${red ? '#fff' : '#5a626b'}" stroke-width="${red ? 4 : 2}"/>`; } return o; })();
SCN(N8, '8 - WHY IT IS SO HARD', [
    { id: 'bg', always: true, svg: `${bg([[0, '#2a3a5a'], [1, '#141c30']])}${glow(500, 600, 600, '#8fbcff', .25)}` },
    G(N8, 'ra', 'rare', { x: 500, y: 460, svg: `<rect x="-370" y="-140" width="740" height="280" rx="18" fill="rgba(255,255,255,.07)" stroke="#8fbcff" stroke-width="5"/>${marbles}${T(0, -170, 'ONLY A RARE KIND WILL DO: LESS THAN 1%', 32, '#ffd23f')}<g ${an('pulse', .9)}><circle cx="-60" cy="40" r="26" fill="none" stroke="#ff4d4d" stroke-width="5"/></g>` }),
    G(N8, 'se', 'separating', { x: 500, y: 900, svg: `<path d="M-250 -80 H250 L90 60 V150 H-90 V60Z" fill="rgba(255,255,255,.08)" stroke="#8fbcff" stroke-width="6" stroke-linejoin="round"/>${[-30, 10, 40].map((x, i) => `<g ${an('move', 1.8, i * .5, 'center', '--dy:120px;--dir:normal;')}><circle cx="${x}" cy="-20" r="12" fill="#8a929b"/></g>`).join('')}<g ${an('move', 1.8, .8, 'center', '--dx:-180px;--dy:120px;--dir:normal;')}><circle cx="0" cy="-20" r="12" fill="#ff4d4d"/></g>${tag(0, 220, 'SEPARATING THEM IS SLOW AND COSTLY', 30)}` }),
    G(N8, 'gi', 'giant', { x: 500, y: 1210, svg: `${[-260, -80, 100, 270].map((x, i) => `<g transform="translate(${x} 0)"><rect x="-50" y="-90" width="100" height="120" fill="#4a5a72" stroke="#8fbcff" stroke-width="4"/><rect x="-26" y="-130" width="22" height="50" fill="#4a5a72" stroke="#8fbcff" stroke-width="4"/>${[0, 1, 2].map(k => `<rect x="${-34 + k * 26}" y="-60" width="14" height="18" fill="#ffd23f"/>`).join('')}</g>`).join('')}${tag(0, 90, 'GIANT INDUSTRIAL PLANTS', 30)}` }),
    G(N8, 'fe', 'few', { x: 500, y: 1400, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'SO VERY FEW COUNTRIES HAVE THEM', -2, '#6dff9c', 42, '#141c30')}</g>` })
], '#2d5fb5');

// ── 9 THE EXPLOSION ─────────────────────────────────────────────
const N9 = "When the chain reaction runs away, a huge amount of energy is released in a flash. The material heats to millions of degrees, as hot as the center of the Sun, and glows as a fireball. Light and heat flash out first. Then the air is shoved outward as a powerful blast wave, like ripples from a stone, but far stronger.";
SCN(N9, '9 - WHAT THE EXPLOSION DOES', [
    { id: 'bg', always: true, svg: `${bg([[0, '#06060f'], [.6, '#241028'], [1, '#6a2a18']])}${stars2(40, 91, -260, 500)}${hills(1300, '#160c12', 40, 9)}` },
    G(N9, 'fl', 'flash', { x: 500, y: 900, svg: `<g ${an('pulse', .5)}>${glow(0, 0, 700, '#fff6c0', .95)}</g>${sfx(0, -400, 'FLASH!', -4, '#fff', 110, '#6a2a18')}` }),
    G(N9, 'mi', 'millions', { x: 500, y: 260, svg: tag(0, 0, 'MILLIONS OF DEGREES: AS HOT AS THE SUN\'S CENTER', 30, '#fff', 'rgba(150,40,20,.9)') }),
    G(N9, 'fb', 'fireball', { x: 500, y: 900, svg: `<g ${an('pulse', 1.4)}>${glow(0, 0, 380, '#ff7a1a', .8)}${ball(0, 0, 190, '#fff6c0', '#ffa04d', '#c0401a')}</g>${tag(0, 260, 'THE FIREBALL', 36)}` }),
    G(N9, 'bw', 'blast', { x: 500, y: 900, svg: [0, .8, 1.6].map(d => `<circle r="200" fill="none" stroke="#fff" stroke-width="10" ${an('ring', 2.6, d, 'center', '--dir:normal;')}/>`).join('') + tag(0, 480, 'THE BLAST WAVE PUSHES THE AIR OUTWARD', 28) }),
    G(N9, 'ri', 'ripples', { x: 500, y: 1380, svg: `${[40, 90, 150].map((r, i) => `<ellipse rx="${r}" ry="${r * .25}" fill="none" stroke="#8fd0ff" stroke-width="${6 - i}" ${an('pulse', 1.4, i * .3)}/>`).join('')}<circle r="10" fill="#8fd0ff"/>${tag(0, 110, 'LIKE RIPPLES FROM A STONE, BUT FAR STRONGER', 26)}` })
], '#a0451e');

// ── 10 THE MUSHROOM CLOUD ───────────────────────────────────────
const N10 = "Why the mushroom shape? The fireball is a giant bubble of very hot air, so it rises fast, just like a hot air balloon. As it climbs, it pulls dust and debris up behind it in a stem, then cools and spreads out into a cap. The mushroom cloud is simply hot air rising.";
SCN(N10, '10 - WHY A MUSHROOM?', [
    { id: 'bg', always: true, svg: `${bg([[0, '#1a2a5a'], [.6, '#6a5a8a'], [1, '#e08a5a']])}${hills(1330, '#2a1a1a', 40, 10)}` },
    G(N10, 'mu', 'mushroom', { x: 500, y: 1330, svg: `<g transform="scale(1.15)">${mushroom()}</g>${tag(0, 70, 'THE MUSHROOM CLOUD', 36)}` }),
    G(N10, 'ba', 'balloon', { x: 800, y: 330, svg: `<g ${an('float', 2.4)}><ellipse rx="70" ry="86" fill="#e63946" stroke="#7a1a22" stroke-width="5"/><path d="M-30 80 L-14 140 H14 L30 80" fill="#c8a060" stroke="#4a3220" stroke-width="4"/>${[-60, 0, 60].map(x => `<path d="M${x * .5} 0 Q${x} -50 ${x * .8} -70" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>`).join('')}</g>${arrow(0, 210, 0, 160, '#fff', 8)}${tag(0, 260, 'HOT AIR RISES', 30)}` }),
    G(N10, 'st', 'stem', { x: 140, y: 800, svg: `${arrow(0, 80, 0, -20, '#fff', 8)}${tag(0, 140, 'DUST PULLED UP IN A STEM', 26)}` }),
    G(N10, 'ca', 'cap', { x: 860, y: 760, svg: `${tag(0, 0, 'COOLS + SPREADS INTO A CAP', 26)}` })
], '#a0451e');

// ── 11 RADIATION AND FALLOUT ────────────────────────────────────
const N11 = "The explosion also releases invisible radiation. And the split atoms leave behind radioactive pieces, which mix with dust and fall back down as fallout, drifting with the wind. This is why nuclear weapons harm far beyond the blast, and for years afterward.";
SCN(N11, '11 - RADIATION AND FALLOUT', [
    { id: 'bg', always: true, svg: `${bg([[0, '#2a3a4a'], [.7, '#6a7a86'], [1, '#8a8a7a']])}${cloud(60, 160, 2.4, '#9aa6b0', .85)}${cloud(560, 300, 2.8, '#8a96a0', .85)}${hills(1380, '#4a4a3a', 40, 11)}` },
    G(N11, 'ra', 'radiation', { x: 500, y: 560, svg: `${glow(0, 0, 330, '#ffd23f', .35)}<g ${an('pulse', 1.4)}>${trefoil(150, '#1a1a1a', '#ffd23f')}</g>${tag(0, 230, 'INVISIBLE RADIATION', 38)}` }),
    G(N11, 'fo', 'fallout', { x: 0, y: 0, svg: Array.from({ length: 36 }, (_, i) => `<circle cx="${(i * 97) % 1000}" cy="-40" r="${4 + (i % 4) * 2}" fill="#d8c8a0" ${an('move', 4 + (i % 5) * .5, (i * .17) % 3, 'center', `--dx:${120 + (i % 5) * 30}px;--dy:1300px;--dir:normal;--e:linear;opacity:.8;`)}/>`).join('') + tag(500, 1000, 'RADIOACTIVE DUST FALLS BACK DOWN: FALLOUT', 30) }),
    G(N11, 'wi', 'wind', { x: 500, y: 1180, svg: `${[0, 1, 2].map(i => `<path d="M${-340 + i * 20} ${i * 36} q120 -30 240 0 t240 0 t200 0" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" ${an('flow dash', 1.2, i * .2)}/>`).join('')}${tag(0, 160, 'CARRIED FAR BY THE WIND, FOR YEARS', 30)}` })
], '#6a7a86');

// ── 12 FUSION ───────────────────────────────────────────────────
const N12 = "There is a second nuclear reaction, called fusion, where light atoms join together instead of splitting. It is what powers the Sun. Even more powerful weapons use fusion too. The lesson is the same: the atom holds frightening amounts of energy, and humans learned how to unlock it.";
SCN(N12, '12 - FUSION: THE SUN\'S POWER', [
    { id: 'bg', always: true, svg: `${bg([[0, '#1a0a2a'], [1, '#05020f']])}${stars2(60, 12, -260, 1650)}` },
    G(N12, 'fu', 'fusion', { x: 500, y: 520, svg: `${glow(0, 0, 300, '#ffd23f', .4)}<g ${an('move', 1.6, 0, 'center', '--dx:100px;')}><circle cx="-260" cy="0" r="40" fill="#e63946" stroke="#fff" stroke-width="4"/></g><g ${an('move', 1.6, 0, 'center', '--dx:-100px;')}><circle cx="260" cy="0" r="40" fill="#e63946" stroke="#fff" stroke-width="4"/></g><g ${an('pulse', 1.6)}><g transform="translate(0 0)">${nuc(4, 3, 24, 22)}</g></g>${tag(0, 150, 'FUSION: LIGHT ATOMS JOIN', 36, '#050818', '#6dff9c')}${tag(0, -150, 'FISSION: HEAVY ATOMS SPLIT', 30, '#fff', 'rgba(150,40,20,.9)')}` }),
    G(N12, 'su', 'sun', { x: 500, y: 1050, svg: `${glow(0, 0, 340, '#ffb04d', .8)}${ball(0, 0, 150, '#fff6c0', '#ffc233', '#ff7a1a')}${tag(0, 220, 'THE SUN RUNS ON FUSION', 34)}` }),
    G(N12, 'un', 'unlock', { x: 500, y: 1390, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'FRIGHTENING ENERGY, UNLOCKED BY HUMANS', -2, '#ffd23f', 36, '#05020f')}</g>` })
], '#7a3aa0');

// ── 13 HISTORY AND PREVENTION (blueprint) ───────────────────────
const N13 = "Scientists first split the atom in Germany, in nineteen thirty eight. In nineteen forty five, the first test explosion took place in a desert in New Mexico. Weeks later, two bombs were used on the Japanese cities of Hiroshima and Nagasaki, killing well over a hundred thousand people. Since then, no nuclear weapon has been used in war. Treaties, inspections, and testing bans exist to keep it that way.";
const tnode = (y, yr, a, b, col = BH) => `<circle cx="180" cy="${y}" r="20" fill="${col}" stroke="${DB}" stroke-width="6"/>${M(250, y - 8, yr, 36, col, 'start')}${M(250, y + 32, a, 24, '#fff', 'start')}${b ? M(250, y + 64, b, 22, BS, 'start') : ''}`;
SCN(N13, '13 - HISTORY AND PREVENTION', [
    { id: 'bg', always: true, svg: `${bpBg()}${dr('M20 20 H980 V1440 H20Z', 0, 2, 4)}${M(500, 130, 'FIG. 13 - FROM DISCOVERY TO PREVENTION', 28, BH)}${dr('M180 280 V1260', 0, 2.6, 8, BL)}` },
    G(N13, 'n1', 'germany', { svg: tnode(300, '1938', 'THE ATOM IS FIRST SPLIT', 'in Germany') }),
    G(N13, 'n2', 'desert', { svg: tnode(540, '1945', 'FIRST TEST EXPLOSION', 'a desert in New Mexico') }),
    G(N13, 'n3', 'hiroshima', { svg: tnode(790, 'AUGUST 1945', 'HIROSHIMA AND NAGASAKI', 'well over 100,000 people killed', '#ff9d9d') }),
    G(N13, 'n4', 'since', { svg: tnode(1030, 'SINCE THEN', 'NO NUCLEAR WEAPON USED IN WAR', '', '#6dff9c') }),
    G(N13, 'n5', 'treaties', { svg: tnode(1250, 'TODAY', 'TREATIES  ·  INSPECTIONS  ·  TEST BANS', 'working to keep it that way', '#6dff9c') })
], '#0f3d7a');

// ── 14 THE SAME PHYSICS, FOR GOOD + RECAP ───────────────────────
const N14 = "The same physics also powers nuclear plants, which make around ten percent of the world's electricity, and it is used in medicine and space probes. So a nuclear explosion is a runaway chain reaction, splitting atoms and turning a tiny bit of mass into enormous energy. Understanding how it works is the first step to making sure it is never used again. Subscribe for more.";
SCN(N14, 'THE SAME PHYSICS, USED FOR GOOD', [
    { id: 'bg', always: true, svg: `${bg([[0, '#7ec8f5'], [1, '#e8f4ff']])}${cloud(80, 200, 2, '#fff', .9)}${cloud(640, 120, 1.8, '#fff', .9)}${hills(1300, '#5aa060', 50, 14)}` },
    G(N14, 'el', 'electricity', { x: 330, y: 1010, svg: `${[-90, 90].map(x => `<path d="M${x - 60} 0 Q${x - 40} -120 ${x - 70} -230 H${x + 70} Q${x + 40} -120 ${x + 60} 0Z" fill="#cfd6de" stroke="#4a5a6a" stroke-width="5"/>`).join('')}${[-90, 90].map((x, i) => `<g ${an('rise', 3, i * 1.2, 'center', '--dy:-120px;--sc:1.6;')}><circle cx="${x}" cy="-250" r="26" fill="rgba(255,255,255,.8)"/></g>`).join('')}<polygon points="0,-130 -34,-30 -6,-30 -20,50 40,-50 8,-50 24,-130" fill="#ffd23f" stroke="#7a5a00" stroke-width="4"/>${tag(0, 110, 'ABOUT 10% OF WORLD ELECTRICITY', 26, '#fff', 'rgba(44,107,90,.9)')}` }),
    G(N14, 'me', 'medicine', { x: 760, y: 920, svg: `<rect x="-90" y="-90" width="180" height="180" rx="24" fill="#fff" stroke="#e63946" stroke-width="8"/><path d="M-20 -60 H20 V-20 H60 V20 H20 V60 H-20 V20 H-60 V-20 H-20Z" fill="#e63946"/>${tag(0, 150, 'MEDICINE + SPACE PROBES', 26, '#fff', 'rgba(150,30,40,.9)')}` }),
    G(N14, 'ch', 'chain', { x: 500, y: 420, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'RUNAWAY CHAIN REACTION', -2, '#b5402c', 54, '#fff')}</g>${tag(0, 90, 'SPLITS ATOMS  >  A LITTLE MASS  >  HUGE ENERGY', 26, '#fff', 'rgba(35,27,18,.8)')}` }),
    G(N14, 'sb', 'subscribe', { x: 500, y: 1420, svg: `<g ${an('pulse', .8)}><rect x="-210" y="-46" width="420" height="92" rx="18" fill="#b5402c" stroke="#fff" stroke-width="6"/>${T(0, 20, 'SUBSCRIBE', 56, '#fff')}</g>` })
], '#2c6b5a');

// ── export ──────────────────────────────────────────────────────
const TRANS = ['fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'fade', 'fade'];
module.exports = {
    output: { title: 'how-a-nuclear-explosion-works', format: SETTINGS.FORMAT, fps: SETTINGS.FPS, crf: SETTINGS.CRF, preset: SETTINGS.PRESET },
    defaults: { voice: SETTINGS.VOICE, speed: SETTINGS.SPEED, transition: 'fade', transitionDuration: SETTINGS.TRANSITION_SECONDS },
    scenes: S.map((s, i) => Object.assign(s, { transition: TRANS[i] || 'fade' })),
};
