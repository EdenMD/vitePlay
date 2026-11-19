// config.human-mind-womb-to-memory.js
// "The Human Mind: From the Womb to Memory" — APEX Video Engine config (science explainer with analogies)
// Arc: hook -> neural tube -> neurogenesis -> migration -> wiring/synapses -> pruning -> senses in the womb
//   -> growth after birth -> how it READS (spikes) -> perception as prediction -> how it STORES (Hebb)
//   -> memory stages + sleep -> recall = rebuild -> lifelong plasticity.
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
const PINK = '#f7a8c0', PINKD = '#8a2f4a', CY = '#7fe0ff', GD = '#ffd23f', GR = '#6dff9c';
const brain = (s = 1, fill = PINK, line = PINKD) => `<g transform="scale(${s})"><path d="M-170 10 C-190 -90 -110 -150 -30 -140 C20 -170 120 -150 150 -90 C200 -70 200 20 160 50 C170 110 100 150 40 130 C0 160 -80 160 -110 120 C-170 120 -200 60 -170 10Z" fill="${fill}" stroke="${line}" stroke-width="6"/><path d="M-120 -60 Q-70 -90 -40 -50 M-20 -100 Q30 -120 50 -70 M60 -90 Q110 -90 120 -40 M-130 30 Q-80 0 -50 40 M-20 20 Q30 -10 70 30 M90 10 Q130 20 140 60 M-60 90 Q-20 70 20 100 M50 90 Q90 80 110 100" stroke="${line}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M60 130 Q70 178 104 184" stroke="${line}" stroke-width="12" fill="none" stroke-linecap="round"/></g>`;
const neuron = (sx = 1, sy = 1, col = CY, core = GD) => `<g transform="scale(${sx} ${sy})"><path d="M-20 -14 Q-70 -50 -100 -40 M-22 0 Q-80 6 -110 30 M-14 18 Q-40 70 -70 84 M-16 -22 Q-30 -80 -60 -96 M-100 -40 l-22 -14 M-100 -40 l-14 20 M-110 30 l-24 4 M-110 30 l-6 22 M-60 -96 l-20 -6 M-60 -96 l6 -22" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M24 0 Q120 -10 200 20 T360 0" stroke="${col}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M360 0 l24 -22 M360 0 l28 4 M360 0 l22 26" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round"/><circle r="28" fill="${col}" stroke="#fff" stroke-width="3"/><circle r="10" fill="${core}"/></g>`;
const bulb = () => `${glow(0, 0, 120, GD, .6)}<circle r="46" fill="#ffe08a" stroke="#fff" stroke-width="4"/><rect x="-20" y="44" width="40" height="30" rx="6" fill="#aab3bd"/><path d="M-12 14 L-4 -10 L4 14 L12 -10" stroke="#b5402c" stroke-width="4" fill="none"/>`;
const polaroid = (c) => `<rect x="-44" y="-44" width="88" height="96" rx="8" fill="#fff"/><rect x="-36" y="-36" width="72" height="62" fill="${c}"/><circle cx="-8" cy="-14" r="10" fill="#fff" opacity=".7"/><path d="M-36 26 L-10 -2 L10 16 L22 4 L36 26Z" fill="#fff" opacity=".45"/>`;
const heart = (r = 40, c = '#ff5d7a') => `<path d="M0 ${r} C${-r * 2} ${-r * .2} ${-r * .8} ${-r * 1.2} 0 ${-r * .4} C${r * .8} ${-r * 1.2} ${r * 2} ${-r * .2} 0 ${r}Z" fill="${c}" stroke="#fff" stroke-width="4"/>`;
const chip = (c) => `<rect x="-60" y="-60" width="120" height="120" rx="14" fill="${c}" stroke="#fff" stroke-width="5"/><rect x="-30" y="-30" width="60" height="60" rx="6" fill="#0b0e28"/>${[-36, 0, 36].map(v => `<path d="M${v} -60 V-84 M${v} 60 V84 M-60 ${v} H-84 M60 ${v} H84" stroke="#fff" stroke-width="6"/>`).join('')}`;
const code = () => `<rect x="-100" y="-66" width="200" height="132" rx="14" fill="#0b0e28" stroke="#fff" stroke-width="5"/><circle cx="-80" cy="-48" r="6" fill="#ff6b6b"/><circle cx="-60" cy="-48" r="6" fill="${GD}"/><circle cx="-40" cy="-48" r="6" fill="${GR}"/>${[[-80, -20, 90], [-60, 4, 120], [-80, 28, 70]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="10" rx="5" fill="${CY}"/>`).join('')}`;
// a jittered network of nodes + all links (for pruning / pattern scenes)
function net(seed, cols = 4, rows = 4) {
    const r = rng(seed), nodes = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) nodes.push([140 + i * (720 / (cols - 1)) + (r() - .5) * 110, 40 + j * 135 + (r() - .5) * 70]);
    const links = [];
    for (let a = 0; a < nodes.length; a++) for (let b = a + 1; b < nodes.length; b++) { const d = Math.hypot(nodes[a][0] - nodes[b][0], nodes[a][1] - nodes[b][1]); if (d < 360) links.push([a, b, r()]); }
    return { nodes, links };
}
const NW = net(21);
const lines = (n, pick, col, w, op = 1) => n.links.filter(pick).map(([a, b]) => `<line x1="${n.nodes[a][0].toFixed(0)}" y1="${n.nodes[a][1].toFixed(0)}" x2="${n.nodes[b][0].toFixed(0)}" y2="${n.nodes[b][1].toFixed(0)}" stroke="${col}" stroke-width="${w}" opacity="${op}" stroke-linecap="round"/>`).join('');
const dots = (n, col, r = 13) => n.nodes.map(([x, y]) => `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="${col}" stroke="#fff" stroke-width="3"/>`).join('');

// ── 0 THE HOOK ──────────────────────────────────────────────────
const N0 = "Right now, inside your head, sits roughly one point four kilograms of soft, pinkish jelly. It has no moving parts, yet it holds every memory you have ever made, runs on about as much power as a dim light bulb, and was built from a single cell. How? Let us follow the human mind from the first weeks in the womb, all the way to how it reads and stores everything you know.";
SCN(N0, 'THE HUMAN MIND: WOMB TO MEMORY', [
    { id: 'bg', always: true, svg: `${bg([[0, '#120a2e'], [.6, '#2b1a63'], [1, '#5a2a7a']])}${stars2(70, 11, -260, 900)}${glow(500, 640, 520, '#ff9ec7', .35)}` },
    G(N0, 'br', 'jelly', { x: 500, y: 640, svg: `<g ${an('pulse', 2.4)}>${brain(1.9)}</g>${tag(0, 400, '≈ 1.4 KG OF SOFT TISSUE', 34)}` }),
    G(N0, 'me', 'memory', { x: 0, y: 0, svg: [[130, 330, '#ff9d6b', -10], [880, 360, '#6bd0ff', 8], [110, 860, '#9dff8a', 6], [900, 880, '#ffd23f', -7]].map(([x, y, c, r], i) => `<g transform="translate(${x} ${y}) rotate(${r})"><g ${an('float', 2.6, i * .5)}>${polaroid(c)}</g></g>`).join('') + tag(500, 1130, 'EVERY MEMORY YOU HAVE EVER MADE', 30) }),
    G(N0, 'bu', 'bulb', { x: 250, y: 1230, svg: `${bulb()}${tag(0, 120, '≈ 20 WATTS', 30)}` }),
    G(N0, 'ce', 'cell', { x: 750, y: 1230, svg: `${cell(0, 0, 44, '#ffb3d1', '#8a2f4a')}${tag(0, 120, 'STARTED AS ONE CELL', 28)}` }),
    G(N0, 'wo', 'womb', { x: 500, y: 1470, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'FROM THE WOMB TO MEMORY', -2, GD, 46, '#120a2e')}</g>` })
], '#7a3fa0');

// ── 1 THE NEURAL TUBE ───────────────────────────────────────────
const N1 = "It begins around week three after conception. The brain starts as a flat strip of cells on the back of the embryo, called the neural plate. Imagine rolling a tortilla. The edges lift, fold toward each other, and meet to form a tube. By about week four, that neural tube has closed, and its front end will swell into the brain. This is why folic acid before and during early pregnancy matters, since it lowers the risk of the tube not closing fully.";
SCN(N1, '1 - THE NEURAL TUBE', [
    { id: 'bg', always: true, svg: `${bg([[0, '#2a0f2e'], [1, '#0f1b3a']])}${glow(500, 760, 600, '#ff9ec7', .25)}` },
    G(N1, 'fl', 'flat', { x: 500, y: 400, svg: `<path d="M-230 0 H230" stroke="#ffb3d1" stroke-width="34" stroke-linecap="round"/><path d="M-210 0 H210" stroke="#fff" stroke-width="5" stroke-dasharray="3 16" stroke-linecap="round"/>${tag(0, 90, 'NEURAL PLATE  ·  WEEK 3', 30)}` }),
    G(N1, 'to', 'tortilla', { x: 500, y: 1300, svg: `<g ${an('pulse', 1)}>${sfx(0, 0, 'LIKE ROLLING A TORTILLA', -2, GD, 50, '#0f1b3a')}</g>` }),
    G(N1, 'fo', 'fold', { x: 500, y: 760, svg: `${arrow(0, -250, 0, -110, '#fff', 8)}<path d="M-230 0 Q-140 0 -110 -50 Q-80 60 0 60 Q80 60 110 -50 Q140 0 230 0" stroke="#ffb3d1" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${tag(0, 150, 'EDGES LIFT AND FOLD', 30)}` }),
    G(N1, 'tu', 'tube', { x: 500, y: 1080, svg: `${arrow(0, -250, 0, -110, '#fff', 8)}<circle r="64" fill="#1b0f2e" stroke="#ffb3d1" stroke-width="32"/><circle r="26" fill="none" stroke="${CY}" stroke-width="4" stroke-dasharray="4 8"/>${tag(0, 140, 'NEURAL TUBE  ·  WEEK 4', 30, '#0f1b3a', GD)}` }),
    G(N1, 'fa', 'folic', { x: 500, y: 1430, svg: `${tag(0, 0, 'FOLIC ACID LOWERS THE RISK OF DEFECTS', 27, '#0f1b3a', GR)}` })
], '#a03a6a');

// ── 2 NEUROGENESIS: DOUBLING ────────────────────────────────────
const N2 = "Next comes an explosion of growth. Neural stem cells divide, and divide again, doubling at every step. Think of a seed that becomes two seeds, then four, then eight. At the peak, the developing brain makes hundreds of thousands of new neurons every minute, a commonly cited estimate is about two hundred and fifty thousand. By birth, a baby has most of the neurons it will ever have, roughly eighty six billion.";
const L3 = Array.from({ length: 8 }, (_, i) => 90 + i * 117), L2 = [0, 1, 2, 3].map(i => (L3[2 * i] + L3[2 * i + 1]) / 2), L1 = [0, 1].map(i => (L2[2 * i] + L2[2 * i + 1]) / 2), L0 = [(L1[0] + L1[1]) / 2];
const tl = (xs, y, ps, py, r, col) => xs.map((x, i) => `<line x1="${ps[i >> 1]}" y1="${py + 40}" x2="${x}" y2="${y - r}" stroke="#fff" stroke-width="4" opacity=".7"/>${cell(x, y, r, col, '#fff')}`).join('');
SCN(N2, '2 - THE BIG BANG OF NEURONS', [
    { id: 'bg', always: true, svg: `${bg([[0, '#0a2a2e'], [1, '#14173d']])}${glow(500, 600, 600, '#2ad0a0', .22)}` },
    G(N2, 'c0', 'seed', { svg: cell(L0[0], 250, 46, '#7fffd4', '#0a2a2e') + tag(500, 150, 'ONE STEM CELL', 30) }),
    G(N2, 'c1', 'two', { svg: tl(L1, 480, [L0[0], L0[0]], 250, 40, '#5fe3c0') }),
    G(N2, 'c2', 'four', { svg: tl(L2, 720, L1, 480, 34, '#4fc8d8') }),
    G(N2, 'c3', 'eight', { svg: tl(L3, 950, L2, 720, 28, '#6aa0ff') }),
    G(N2, 'pk', 'peak', { x: 500, y: 1180, svg: `<g ${an('pulse', .8)}>${sfx(0, 0, '≈ 250,000 NEW NEURONS / MINUTE', -2, GD, 44, '#0a2a2e')}</g>` }),
    G(N2, 'bi', 'billion', { x: 500, y: 1340, svg: `${tag(0, 0, 'BORN WITH ≈ 86 BILLION NEURONS', 34, '#0a2a2e', GR)}` })
], '#1f8f78');

// ── 3 MIGRATION: CLIMBING ROPES ─────────────────────────────────
const N3 = "But neurons are born deep inside the brain, far from where they will work. So they must travel. Special support cells stretch out like ropes, and the young neurons climb them, like fans climbing to find their seats in a stadium. The first arrivals settle in the deepest layers. Later arrivals climb past them to take the outer seats, building the cortex layer by layer, from the inside out.";
const ropesX = [150, 270, 390, 510, 630, 750, 870];
SCN(N3, '3 - THE GREAT MIGRATION', [
    { id: 'bg', always: true, svg: `${bg([[0, '#10163a'], [1, '#2b1650']])}${glow(500, 1280, 500, '#ff9ec7', .45)}<rect x="40" y="1250" width="920" height="120" rx="40" fill="#ff9ec7" opacity=".25"/>${M(500, 1330, 'BIRTH ZONE (DEEP INSIDE)', 26, '#fff')}` },
    G(N3, 'tr', 'travel', { x: 500, y: 150, svg: `${tag(0, 0, 'BORN DEEP... SO THEY MUST TRAVEL', 34)}` }),
    G(N3, 'ro', 'ropes', { svg: ropesX.map(x => `<path d="M${x} 1250 Q${x + 20} 900 ${x} 560" stroke="#8fd6ff" stroke-width="7" fill="none" opacity=".75" stroke-linecap="round" ${an('draw', 1.4, 0)}/>`).join('') }),
    G(N3, 'cl', 'climb', { svg: ropesX.map((x, i) => `<g ${an('rise', 3.6, i * .45, 'center', '--dy:-650px;--sc:1;')}>${cell(x, 1220, 22, GD, '#fff')}</g>`).join('') }),
    G(N3, 'se', 'seats', { svg: [[330, 'rgba(255,255,255,.12)'], [420, 'rgba(255,255,255,.12)'], [510, 'rgba(255,255,255,.12)']].map(([y, c]) => `<rect x="90" y="${y}" width="820" height="70" rx="14" fill="${c}" stroke="#8fbcff" stroke-width="3" stroke-dasharray="6 8"/>`).join('') + M(500, 300, 'CORTEX LAYERS = STADIUM SEATS', 26, '#fff') }),
    G(N3, 'f1', 'first', { svg: `<rect x="90" y="510" width="820" height="70" rx="14" fill="#ff7a8a" opacity=".85"/>${M(500, 557, '1ST ARRIVALS: DEEP LAYERS', 28, '#fff')}` }),
    G(N3, 'f2', 'past', { svg: `<rect x="90" y="420" width="820" height="70" rx="14" fill="#ffd23f" opacity=".9"/><rect x="90" y="330" width="820" height="70" rx="14" fill="#6dff9c" opacity=".9"/>${M(500, 467, 'LATER ARRIVALS CLIMB PAST', 28, '#14173d')}${M(500, 377, 'OUTER LAYERS: BUILT LAST', 28, '#14173d')}` })
], '#6a4ab0');

// ── 4 WIRING AND SYNAPSES ───────────────────────────────────────
const N4 = "Once in place, each neuron grows a long cable called an axon. At its tip sits a growth cone, which sniffs out chemical signposts, much like a GPS guiding it to the right address. When it arrives, it forms a connection called a synapse. Messages cross this tiny gap as chemical signals. An adult brain holds on the order of one hundred trillion of these connections.";
SCN(N4, '4 - WIRING THE BRAIN', [
    { id: 'bg', always: true, svg: `${bg([[0, '#071a33'], [1, '#14103a']])}${stars2(40, 31, -260, 1500)}` },
    G(N4, 'a1', 'axon', { svg: `<g transform="translate(130 330) scale(.9)">${neuron(1, 1)}</g><g transform="translate(620 720) scale(.9)">${neuron(1, 1, '#ff9ec7')}</g>${tag(300, 210, 'AXON = LONG CABLE', 28)}` }),
    G(N4, 'gr', 'growth', { svg: dr('M476 330 Q540 520 508 748', 0, 2.4, 6, GD) + `<g ${an('pulse', .8)}><circle cx="476" cy="330" r="14" fill="${GD}"/></g>${tag(250, 480, 'GROWTH CONE', 28, '#071a33', GD)}` }),
    G(N4, 'gp', 'gps', { svg: `<g transform="translate(790 440)"><path d="M0 60 C-60 -10 -40 -70 0 -70 C40 -70 60 -10 0 60Z" fill="#ff5d7a" stroke="#fff" stroke-width="5"/><circle cy="-30" r="14" fill="#fff"/></g>${tag(790, 600, 'CHEMICAL SIGNPOSTS = GPS', 26)}` }),
    G(N4, 'sy', 'synapse', { x: 500, y: 1150, svg: `<circle r="210" fill="rgba(255,255,255,.06)" stroke="#8fbcff" stroke-width="5"/><path d="M-210 -40 Q-150 -90 -60 -70 Q-30 0 -60 70 Q-150 90 -210 40Z" fill="${CY}" opacity=".9"/><path d="M210 -40 Q150 -90 60 -70 Q30 0 60 70 Q150 90 210 40Z" fill="#ff9ec7" opacity=".9"/>${tag(0, 250, 'THE SYNAPSE (MAGNIFIED)', 28, '#071a33', '#8fbcff')}` }),
    G(N4, 'ga', 'gap', { x: 500, y: 1150, svg: [-30, 0, 30].map((y, i) => `<g ${an('move', 1.2, i * .35, 'center', '--dx:84px;--dir:normal;--e:linear;')}><circle cx="-42" cy="${y}" r="9" fill="${GD}"/></g>`).join('') }),
    G(N4, 'tn', 'trillion', { x: 500, y: 1450, svg: `<g ${an('pulse', .8)}>${sfx(0, 0, '≈ 100 TRILLION CONNECTIONS', -2, GD, 46, '#071a33')}</g>` })
], '#2d5fb5');

// ── 5 PRUNING ───────────────────────────────────────────────────
const N5 = "Here is a surprise. The young brain makes far more connections than it needs. Then comes pruning. Connections that are used get stronger, while those that are not fade away. It is use it or lose it. Think of a gardener trimming a bush so it grows strong, or a shortcut across a lawn that stays visible only because people keep walking on it. Experience sculpts the brain.";
SCN(N5, '5 - USE IT OR LOSE IT', [
    { id: 'bg', always: true, svg: `${bg([[0, '#0f2a1f'], [1, '#14173d']])}` },
    { id: 'nd', always: true, x: 0, y: 260, svg: dots(NW, '#cfe9ff', 14) },
    G(N5, 'dn', 'surprise', { x: 0, y: 260, svg: lines(NW, () => true, '#8fbcff', 3, .45) + dots(NW, '#cfe9ff', 14) + `<g transform="translate(500 -60)">${tag(0, 0, 'TOO MANY CONNECTIONS...', 30)}</g>`, hw: 'fade' }),
    G(N5, 'pr', 'pruning', { x: 500, y: 880, svg: `<g ${an('wobble', .6)}><path d="M-60 -40 L60 40 M-60 40 L60 -40" stroke="#fff" stroke-width="10" stroke-linecap="round"/><circle cx="-70" cy="-50" r="20" fill="none" stroke="${GD}" stroke-width="8"/><circle cx="-70" cy="50" r="20" fill="none" stroke="${GD}" stroke-width="8"/></g>${tag(0, 130, 'PRUNING', 36, '#0f2a1f', GD)}` }),
    G(N5, 'st', 'used', { x: 0, y: 260, svg: lines(NW, l => l[2] > .8, GD, 9) + dots(NW, GD, 15) }),
    G(N5, 'ul', 'lose', { x: 500, y: 1112, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'USE IT OR LOSE IT', -2, GD, 54, '#0f2a1f')}</g>` }),
    G(N5, 'ga', 'gardener', { x: 260, y: 1230, svg: `<ellipse cy="40" rx="110" ry="24" fill="#5a3b22"/><circle cx="-50" cy="-30" r="56" fill="#2e8b4a"/><circle cx="40" cy="-40" r="64" fill="#1f6b3a"/><circle cx="0" cy="-80" r="50" fill="#2e8b4a"/><g ${an('wobble', .5)} style="transform-origin:130px 0px"><path d="M100 -60 L160 -20 M100 -20 L160 -60" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>${tag(0, 120, 'A GARDENER TRIMMING', 26)}` }),
    G(N5, 'la', 'lawn', { x: 740, y: 1230, svg: `<rect x="-200" y="-100" width="400" height="190" rx="20" fill="#2f7a45" stroke="#fff" stroke-width="4"/><path d="M-170 70 Q-40 -10 170 -70" stroke="#d9c08a" stroke-width="30" fill="none" stroke-linecap="round" opacity=".95"/>${tag(0, 150, 'THE SHORTCUT STAYS: PEOPLE WALK IT', 24)}` }),
    G(N5, 'sc', 'sculpts', { x: 500, y: 1450, svg: `${tag(0, 0, 'EXPERIENCE SCULPTS THE BRAIN', 34, '#0f2a1f', GR)}` })
], '#2a7a50');

// ── 6 SENSES IN THE WOMB ────────────────────────────────────────
const N6 = "Long before birth, the brain is already learning. By the second half of pregnancy, the baby can hear. Sound reaches the womb muffled, like listening to music through a wall, or from underwater. The baby tunes in to the heartbeat, and to the mother's voice. Newborns later prefer that voice, and even the rhythm of the language they heard. The baby can also taste flavors from the amniotic fluid, a first lesson in food.";
SCN(N6, '6 - LEARNING BEFORE BIRTH', [
    { id: 'bg', always: true, svg: `${bg([[0, '#2a1030'], [1, '#4a1f3a']])}${glow(500, 760, 560, '#ff9d9d', .3)}` },
    { id: 'wb', always: true, x: 500, y: 790, svg: `<ellipse rx="330" ry="420" fill="#f4a7a0" stroke="#fff" stroke-width="8"/><ellipse rx="290" ry="380" fill="#ffd9c8" opacity=".9"/><g transform="rotate(-18)"><path d="M-30 -20 C90 -10 150 70 110 150 C70 200 -20 180 -30 130Z" fill="#ffcfa8" stroke="#b5654a" stroke-width="5"/><circle cx="-60" cy="-80" r="62" fill="#ffcfa8" stroke="#b5654a" stroke-width="5"/><path d="M-84 -78 q14 10 28 0" stroke="#7a3f2a" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="30" cy="30" r="20" fill="#ffcfa8" stroke="#b5654a" stroke-width="5"/></g><path d="M20 120 Q150 200 200 300 T170 400" stroke="#d98a8a" stroke-width="10" fill="none" stroke-linecap="round"/>` },
    G(N6, 'he', 'hear', { svg: [0, .5, 1].map(d => `<circle ${an('ring', 1.8, d, 'center')} cx="930" cy="790" r="70" fill="none" stroke="${CY}" stroke-width="8"/>`).join('') + tag(800, 330, 'THE BABY CAN HEAR', 30) }),
    G(N6, 'wl', 'wall', { x: 500, y: 1330, svg: tag(0, 0, 'MUFFLED: MUSIC THROUGH A WALL', 30, '#2a1030', CY) }),
    G(N6, 'hb', 'heartbeat', { x: 300, y: 1010, svg: `<g ${an('pulse', .75)}>${heart(46)}</g>${tag(0, 110, 'HEARTBEAT', 28)}` }),
    G(N6, 'vo', 'voice', { svg: `<path d="${wavy(900, 560, 640, 650, 18, 9)}" stroke="${GD}" stroke-width="8" fill="none" stroke-linecap="round" ${an('flow dash', 1.2)}/>${tag(780, 480, "MOTHER'S VOICE", 28, '#2a1030', GD)}` }),
    G(N6, 'ta', 'taste', { x: 700, y: 1020, svg: `${[[-30, 0], [30, 30], [0, -40]].map(([x, y], i) => `<g ${an('bob', 1.4, i * .3)}><path d="M${x} ${y - 24} Q${x + 20} ${y + 6} ${x} ${y + 16} Q${x - 20} ${y + 6} ${x} ${y - 24}Z" fill="#8fe0ff" stroke="#fff" stroke-width="3"/></g>`).join('')}${tag(0, 100, 'FLAVORS IN THE FLUID', 26)}` })
], '#a03a6a');

// ── 7 GROWTH AFTER BIRTH ────────────────────────────────────────
const N7 = "At birth, the brain is only about a quarter of its adult size, but it is wired and ready to learn. In the first year it doubles. By age five it has reached about ninety percent of adult size. Think of the hardware arriving first. The software, language, skills, and habits, is installed through experience. Every smile, song, and word shapes the wiring.";
const barSvg = (x, pct, col, lab) => `<g transform="translate(${x} 1000)"><rect x="-70" y="${-pct * 6}" width="140" height="${pct * 6}" rx="12" fill="${col}" stroke="#fff" stroke-width="4" ${an('growy', 1, 0, 'bottom')}/>${M(0, -pct * 6 - 20, pct + '%', 34, '#fff')}${M(0, 50, lab, 26, '#fff')}</g>`;
SCN(N7, '7 - THE GROWING BRAIN', [
    { id: 'bg', always: true, svg: `${bg([[0, '#101a3a'], [1, '#2a1650']])}${[150, 420, 690, 900].map(x => `<rect x="${x - 70}" y="400" width="140" height="600" rx="12" fill="none" stroke="#8fbcff" stroke-width="3" stroke-dasharray="8 10" opacity=".5"/>`).join('')}${M(500, 330, 'SIZE COMPARED WITH THE ADULT BRAIN', 26, '#8fbcff')}` },
    G(N7, 'b0', 'quarter', { svg: barSvg(150, 25, '#ff7a8a', 'BIRTH') }),
    G(N7, 'b1', 'doubles', { svg: barSvg(420, 50, '#ffd23f', 'AGE 1') }),
    G(N7, 'b5', 'five', { svg: barSvg(690, 90, '#6dff9c', 'AGE 5') + barSvg(900, 100, '#6aa0ff', 'ADULT') }),
    G(N7, 'hw', 'hardware', { x: 270, y: 1260, svg: `${chip('#2d5fb5')}${tag(0, 130, 'HARDWARE SHIPS FIRST', 26)}` }),
    G(N7, 'sw', 'software', { x: 730, y: 1260, svg: `${code()}${tag(0, 130, 'SOFTWARE: INSTALLED BY LIFE', 26, '#101a3a', GD)}` })
], '#2d5fb5');

// ── 8 HOW IT READS: SIGNALS ─────────────────────────────────────
const N8 = "So how does the brain read the world? Your senses turn light, sound, and touch into tiny electrical signals. A neuron either fires or it does not, like a light switch. It cannot fire harder, so the message is carried by timing and rhythm, like Morse code. At the end of the line, chemical messengers called neurotransmitters carry the signal across the synapse to the next cell.";
const spike = (x0, y0) => { let d = `M${x0} ${y0} H${x0 + 40}`, x = x0 + 40; [60, 130, 40, 150, 80].forEach((g, i) => { d += ` L${x + 6} ${y0 - 90} L${x + 20} ${y0 + 40} L${x + 28} ${y0} H${x + 28 + g}`; x += 28 + g; }); return d; };
SCN(N8, '8 - HOW THE BRAIN READS', [
    { id: 'bg', always: true, svg: `${bpBg()}${dr('M20 20 H980 V1440 H20Z', 0, 2, 4)}${M(500, 130, 'FIG. 8 - SIGNALS IN THE NERVOUS SYSTEM', 28, BH)}` },
    G(N8, 'se', 'senses', { x: 0, y: 330, svg: `<g transform="translate(250 0)"><path d="M-60 0 Q0 -50 60 0 Q0 50 -60 0Z" fill="#fff"/><circle r="20" fill="#2d5fb5"/><circle r="8" fill="#111"/>${M(0, 90, 'LIGHT', 24, '#fff')}</g><g transform="translate(500 0)"><path d="M-10 -50 C40 -50 52 10 24 40 C12 58 16 70 -6 70" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/>${M(0, 110, 'SOUND', 24, '#fff')}</g><g transform="translate(750 0)"><rect x="-22" y="-60" width="44" height="90" rx="22" fill="#ffcfa8" stroke="#fff" stroke-width="4"/><circle cy="50" r="16" fill="none" stroke="${GD}" stroke-width="5" ${an('ring', 1.5, 0)}/>${M(0, 110, 'TOUCH', 24, '#fff')}</g>` }),
    G(N8, 'el', 'electrical', { x: 0, y: 640, svg: dr(spike(100, 0), 0, 2.4, 7, GD) + tag(500, 120, 'TINY ELECTRICAL SPIKES', 30, DB, BH) }),
    G(N8, 'sw', 'switch', { x: 250, y: 930, svg: `<rect x="-90" y="-44" width="180" height="88" rx="44" fill="${GR}" stroke="#fff" stroke-width="5"/><circle cx="46" r="34" fill="#fff"/>${tag(0, 110, 'FIRE OR NOT: ON / OFF', 26)}` }),
    G(N8, 'mo', 'morse', { x: 740, y: 930, svg: [[-160, 24], [-110, 24], [-60, 70], [30, 24], [80, 70], [170, 24]].map(([x, w]) => `<rect x="${x}" y="-12" width="${w}" height="24" rx="12" fill="${GD}"/>`).join('') + tag(0, 110, 'TIMING AND RHYTHM = THE CODE', 24, DB, BH) }),
    G(N8, 'nt', 'neurotransmitters', { x: 500, y: 1250, svg: `<path d="M-300 -50 Q-200 -90 -80 -70 Q-50 0 -80 70 Q-200 90 -300 50Z" fill="${CY}" opacity=".9"/><path d="M300 -50 Q200 -90 80 -70 Q50 0 80 70 Q200 90 300 50Z" fill="#ff9ec7" opacity=".9"/>${[-30, 0, 30].map((y, i) => `<g ${an('move', 1.2, i * .3, 'center', '--dx:120px;--dir:normal;--e:linear;')}><circle cx="-60" cy="${y}" r="10" fill="${GD}"/></g>`).join('')}${tag(0, 140, 'NEUROTRANSMITTERS CROSS THE GAP', 26)}` })
], '#0f3d7a');

// ── 9 PERCEPTION = PREDICTION ───────────────────────────────────
const N9 = "Here is the twist: the brain does not simply record the world like a camera. It builds a best guess. It takes rough signals, fills gaps with past experience, and predicts what it expects to see, like an editor assembling a film from raw footage. That is why optical illusions work. Look at these two lines. They are exactly the same length, yet your brain insists one is longer.";
const ml = (y, inward) => { const s = inward ? -1 : 1; return `<path d="M250 ${y} H750" stroke="#fff" stroke-width="9" stroke-linecap="round"/>` + [[250, 1], [750, -1]].map(([x, d]) => `<path d="M${x} ${y} l${45 * d * s} -42 M${x} ${y} l${45 * d * s} 42" stroke="#fff" stroke-width="9" stroke-linecap="round"/>`).join(''); };
SCN(N9, '9 - THE PREDICTIVE BRAIN', [
    { id: 'bg', always: true, svg: `${bg([[0, '#1a1236'], [1, '#0f2a4a']])}${stars2(30, 77, -260, 800)}` },
    G(N9, 'ca', 'camera', { x: 250, y: 330, svg: `<rect x="-70" y="-44" width="140" height="94" rx="14" fill="#cfd6de" stroke="#fff" stroke-width="4"/><circle r="30" fill="#14173d" stroke="#fff" stroke-width="5"/><path d="M-90 -80 L90 80 M90 -80 L-90 80" stroke="#ff4d4d" stroke-width="12" stroke-linecap="round"/>${tag(0, 120, 'NOT A CAMERA', 28)}` }),
    G(N9, 'gu', 'guess', { x: 750, y: 330, svg: `<g ${an('float', 2.4)}>${brain(.5)}</g>${T(0, -10, '?', 90, GD)}${tag(0, 120, 'A BEST GUESS', 28, '#14173d', GD)}` }),
    G(N9, 'ed', 'editor', { x: 500, y: 650, svg: `<rect x="-300" y="-50" width="600" height="100" rx="10" fill="#222" stroke="#fff" stroke-width="4"/>${[-250, -150, -50, 50, 150, 250].map((x, i) => `<rect x="${x - 36}" y="-36" width="72" height="72" fill="${['#ff9d6b', '#6bd0ff', '#9dff8a', '#ffd23f', '#ff9ec7', '#8fbcff'][i]}" opacity=".85"/>`).join('')}${tag(0, 110, 'RAW FOOTAGE  >  EDITED FILM', 28)}` }),
    G(N9, 'il', 'illusions', { x: 500, y: 850, svg: `${sfx(0, 0, 'OPTICAL ILLUSION', -2, GD, 48, '#14173d')}` }),
    G(N9, 'ln', 'lines', { svg: ml(1030, false) + ml(1250, true) }),
    G(N9, 'sm', 'same', { svg: `<path d="M250 960 V1320 M750 960 V1320" stroke="${GR}" stroke-width="5" stroke-dasharray="12 10"/>${tag(500, 1140, 'EXACTLY THE SAME LENGTH', 32, '#14173d', GR)}` }),
    G(N9, 'lo', 'longer', { x: 500, y: 1430, svg: `${tag(0, 0, 'YOUR BRAIN INSISTS OTHERWISE', 30)}` })
], '#5a4ab0');

// ── 10 HOW IT STORES: FIRE TOGETHER, WIRE TOGETHER ──────────────
const N10 = "Now, how does it store information? Not in one place, like a file on a hard drive. A memory is a pattern of connections. The rule is simple: cells that fire together wire together. Each time two neurons are active at the same moment, the link between them grows stronger. Think of a path through tall grass. Walk it once and it is faint. Walk it again and again, and it becomes a clear road.";
const PTH = 'M120 1380 C300 1250 400 1150 560 1100 S800 1000 900 930';
SCN(N10, '10 - HOW MEMORIES ARE STORED', [
    { id: 'bg', always: true, svg: `${bg([[0, '#0b1a3a'], [1, '#14103a']])}${stars2(40, 91, -260, 700)}` },
    { id: 'nd', always: true, x: 0, y: 200, svg: lines(NW, () => true, '#8fbcff', 2, .18) + dots(NW, '#6a7fa8', 12) },
    G(N10, 'pa', 'pattern', { x: 0, y: 200, svg: lines(NW, l => l[2] > .72, GD, 7) + NW.nodes.filter((_, i) => [0, 5, 6, 10, 15].includes(i)).map(([x, y]) => `<g ${an('pulse', 1)}><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="18" fill="${GD}" stroke="#fff" stroke-width="3"/></g>`).join('') + tag(500, 560, 'A MEMORY = A PATTERN, NOT A FILE', 30, '#0b1a3a', GD) }),
    G(N10, 'fi', 'fire', { x: 500, y: 910, svg: `<circle cx="-200" r="34" fill="${CY}" stroke="#fff" stroke-width="4"/><circle cx="200" r="34" fill="#ff9ec7" stroke="#fff" stroke-width="4"/><path d="M-166 0 H166" stroke="#fff" stroke-width="3"/>${sparks(-200, 0, 8, GD, 54, .5)}${sparks(200, 0, 8, GD, 54, .5)}` }),
    G(N10, 'sg', 'stronger', { x: 500, y: 910, svg: `<path d="M-166 0 H166" stroke="${GD}" stroke-width="18" stroke-linecap="round"/>${tag(0, 80, 'LINK GROWS STRONGER', 28, '#0b1a3a', GD)}` }),
    G(N10, 'gs', 'grass', { svg: `<rect x="40" y="1060" width="920" height="360" rx="26" fill="#1f6b3a" opacity=".9"/>${grass(70, 5, 1080, 1400, '#3fa95a')}` }),
    G(N10, 'fa', 'faint', { svg: `<path d="${PTH}" stroke="#d9c9a0" stroke-width="6" fill="none" stroke-dasharray="4 14" stroke-linecap="round"/>${tag(250, 1025, 'WALK IT ONCE: FAINT', 26)}` }),
    G(N10, 'rd', 'road', { svg: `<path d="${PTH}" stroke="#caa86a" stroke-width="44" fill="none" stroke-linecap="round" ${an('draw', 1.2, 0)}/>${tag(740, 1330, 'WALK IT OFTEN: A CLEAR ROAD', 26, '#0b1a3a', GD)}` })
], '#2d5fb5');

// ── 11 MEMORY STAGES + SLEEP ────────────────────────────────────
const N11 = "Memory moves through stages. First, a flash of sensory memory lasts only a moment. What you pay attention to goes to working memory, your mental desk, which holds only a handful of items for roughly twenty seconds. To keep something, the hippocampus acts like a librarian, indexing it for long term storage, a vast filing cabinet. And while you sleep, the night shift replays the day and files it away, which is why sleep is vital for learning.";
const mbox = (x, c, lab) => `<rect x="${x - 130}" y="430" width="260" height="300" rx="22" fill="rgba(255,255,255,.07)" stroke="${c}" stroke-width="6"/>${T(x, 790, lab, 30, '#fff', 'middle', FI)}`;
SCN(N11, '11 - FROM FLASH TO FILING CABINET', [
    { id: 'bg', always: true, svg: `${bg([[0, '#10163a'], [1, '#2b1650']])}${arrow(300, 580, 360, 580, '#fff', 8)}${arrow(640, 580, 710, 580, '#fff', 8)}` },
    G(N11, 'fl', 'flash', { svg: mbox(150, '#8fd6ff', 'SENSORY') + `<g ${an('blink', .5)}><polygon points="150,480 120,590 150,590 130,680 190,550 160,550" fill="${GD}"/></g>${tag(150, 860, 'A MOMENT', 26)}` }),
    G(N11, 'de', 'desk', { svg: mbox(500, GD, 'WORKING') + `<rect x="400" y="600" width="200" height="14" fill="#c8a060"/><rect x="415" y="614" width="10" height="70" fill="#c8a060"/><rect x="575" y="614" width="10" height="70" fill="#c8a060"/>${[420, 460, 500, 540, 570].map((x, i) => `<rect x="${x - 12}" y="${570 - (i % 2) * 14}" width="24" height="30" rx="4" fill="${['#ff7a8a', '#6bd0ff', '#9dff8a', '#ffd23f', '#ff9ec7'][i]}"/>`).join('')}${tag(500, 860, 'A HANDFUL · ~20 SEC', 26)}` }),
    G(N11, 'hi', 'hippocampus', { x: 680, y: 960, svg: `${brain(.28)}<path d="M-70 -60 Q-20 -20 -30 20" stroke="${GD}" stroke-width="8" fill="none"/>${tag(0, 90, 'HIPPOCAMPUS = LIBRARIAN', 26, '#10163a', GD)}` }),
    G(N11, 'fc', 'filing', { svg: mbox(850, GR, 'LONG-TERM') + [0, 1, 2].map(i => `<rect x="790" y="${470 + i * 70}" width="120" height="58" rx="6" fill="#aab3bd" stroke="#fff" stroke-width="3"/><rect x="835" y="${492 + i * 70}" width="30" height="10" rx="4" fill="#4a5a6a"/>`).join('') + tag(850, 860, 'FILING CABINET', 26) }),
    G(N11, 'sl', 'sleep', { x: 500, y: 1180, svg: `<path d="M-40 -60 A70 70 0 1 0 40 40 A56 56 0 1 1 -40 -60Z" fill="#ffe08a" stroke="#fff" stroke-width="4" transform="translate(-260 0)"/>${[[-170, -60], [-120, 30], [-190, 50]].map(([x, y], i) => `<circle ${an('twinkle', 1.5, i * .4)} cx="${x}" cy="${y}" r="6" fill="#fff"/>`).join('')}${tag(100, 0, 'NIGHT SHIFT: REPLAY + FILE', 30, '#10163a', '#8fd6ff')}` }),
    G(N11, 'sv', 'vital', { x: 500, y: 1420, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'SLEEP BUILDS MEMORY', -2, GD, 52, '#10163a')}</g>` })
], '#6a4ab0');

// ── 12 RECALL = REBUILD ─────────────────────────────────────────
const N12 = "And remembering is not like pressing play on a video. Each time you recall a memory, your brain rebuilds it from scattered pieces, then saves it again, sometimes with small edits. It is more like rewriting a document every time you open it. That is why memories can feel vivid yet still drift, and why two people can remember the same day differently.";
const PZ = [[0, 0, '#ff9d6b'], [1, 0, '#6bd0ff'], [2, 0, '#9dff8a'], [0, 1, '#ffd23f'], [1, 1, '#ff9ec7'], [2, 1, '#8fbcff']];
const pzOff = [[-300, -180], [260, -220], [330, 120], [-340, 160], [-60, 330], [160, -330]];
SCN(N12, '12 - REMEMBERING = REBUILDING', [
    { id: 'bg', always: true, svg: `${bg([[0, '#2a1030'], [1, '#101a3a']])}` },
    G(N12, 'vi', 'video', { x: 500, y: 300, svg: `<rect x="-140" y="-80" width="280" height="160" rx="20" fill="#222" stroke="#fff" stroke-width="5"/><polygon points="-30,-44 -30,44 50,0" fill="#fff"/><path d="M-170 -100 L170 100 M170 -100 L-170 100" stroke="#ff4d4d" stroke-width="12" stroke-linecap="round"/>${tag(0, 150, 'NOT A REPLAY', 30)}` }),
    G(N12, 'rb', 'rebuilds', { x: 500, y: 800, svg: PZ.map(([c, r, col], i) => `<g ${an('move', 1.8, i * .15, 'center', `--dx:${-pzOff[i][0]}px;--dy:${-pzOff[i][1]}px;--dir:normal;--e:ease-out;`)}><rect x="${(c - 1) * 130 - 60 + pzOff[i][0]}" y="${(r - .5) * 130 - 60 + pzOff[i][1]}" width="120" height="120" rx="16" fill="${col}" stroke="#fff" stroke-width="4"/></g>`).join('') }),
    G(N12, 'pc', 'pieces', { x: 500, y: 1090, svg: tag(0, 0, 'REBUILT FROM SCATTERED PIECES', 30) }),
    G(N12, 'ed', 'edits', { x: 500, y: 800, svg: `<rect x="70" y="5" width="120" height="120" rx="16" fill="${GD}" stroke="#fff" stroke-width="6"/>${tag(330, 70, 'SMALL EDIT', 26, '#101a3a', GD)}` }),
    G(N12, 'dc', 'document', { x: 500, y: 1260, svg: `<rect x="-90" y="-70" width="180" height="140" rx="10" fill="#fff"/>${[-40, -14, 12, 38].map((y, i) => `<rect x="-66" y="${y}" width="${[130, 110, 124, 70][i]}" height="10" rx="5" fill="#8fbcff"/>`).join('')}<g ${an('wobble', .6)}><path d="M60 40 L120 -20" stroke="${GD}" stroke-width="12" stroke-linecap="round"/></g>${tag(0, 120, 'LIKE REWRITING A DOCUMENT', 28)}` }),
    G(N12, 'dr', 'drift', { x: 500, y: 1440, svg: tag(0, 0, 'VIVID, BUT NOT ALWAYS ACCURATE', 30, '#101a3a', GR) })
], '#a03a6a');

// ── 13 LIFELONG PLASTICITY + CTA ────────────────────────────────
const N13 = "The story never stops. The brain keeps wiring itself into your twenties, with the prefrontal cortex, the planning centre, maturing last. Throughout life it stays plastic, like a muscle that grows with practice. Sleep, movement, good nutrition, curiosity, and strong relationships all help it thrive. And it starts with care in the womb. You are, quite literally, a work in progress. Subscribe for more.";
SCN(N13, 'THE MIND: ALWAYS BUILDING', [
    { id: 'bg', always: true, svg: `${bg([[0, '#120a2e'], [.6, '#2b1a63'], [1, '#14173d']])}${stars2(50, 13, -260, 1100)}` },
    G(N13, 'tw', 'twenties', { x: 0, y: 380, svg: `<path d="M100 0 H900" stroke="#fff" stroke-width="8" stroke-linecap="round"/>${[[100, 'WOMB'], [250, 'BIRTH'], [380, 'AGE 5'], [620, 'AGE 25'], [900, 'LIFE']].map(([x, l]) => `<circle cx="${x}" r="12" fill="#fff"/>${M(x, 50, l, 22, '#fff')}`).join('')}<g ${an('pulse', .8)}><circle cx="620" r="22" fill="${GD}" stroke="#fff" stroke-width="4"/></g>${tag(620, -70, 'PREFRONTAL CORTEX MATURES', 26, '#120a2e', GD)}` }),
    G(N13, 'mu', 'muscle', { x: 500, y: 760, svg: `${glow(0, 0, 300, '#ff9ec7', .4)}<g ${an('pulse', 1.6)}>${brain(1.1)}</g>${tag(0, 260, 'PLASTIC: IT CHANGES WITH PRACTICE', 28)}` }),
    G(N13, 'ch', 'sleep', { x: 500, y: 1130, svg: [[-220, 0, 'SLEEP'], [220, 0, 'MOVEMENT'], [-220, 80, 'NUTRITION'], [220, 80, 'CURIOSITY']].map(([x, y, t]) => tag(x, y, t, 28, '#120a2e', GR)).join('') }),
    G(N13, 'pg', 'progress', { x: 500, y: 1330, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'A WORK IN PROGRESS', -2, GD, 54, '#120a2e')}</g>` }),
    G(N13, 'sb', 'subscribe', { x: 500, y: 1440, svg: `<g ${an('pulse', .8)}><rect x="-190" y="-40" width="380" height="80" rx="18" fill="#b5402c" stroke="#fff" stroke-width="6"/>${T(0, 18, 'SUBSCRIBE', 48, '#fff')}</g>` })
], '#7a3fa0');

// ── export ──────────────────────────────────────────────────────
const TRANS = ['fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left', 'fade', 'fade'];
module.exports = {
    output: { title: 'human-mind-womb-to-memory', format: SETTINGS.FORMAT, fps: SETTINGS.FPS, crf: SETTINGS.CRF, preset: SETTINGS.PRESET },
    defaults: { voice: SETTINGS.VOICE, speed: SETTINGS.SPEED, transition: 'fade', transitionDuration: SETTINGS.TRANSITION_SECONDS },
    scenes: S.map((s, i) => Object.assign(s, { transition: TRANS[i] || 'fade' })),
};