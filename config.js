// config.apes-evolution-story.js
// "If Humans Evolved From Apes, Why Are There Still Apes?" — APEX Video Engine config
// A time-travel story: before Earth -> Earth -> life -> mammals -> apes -> the split -> the answer.
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
    VOICE: 'am_puck',            // Kokoro voice id. Try: 'am_adam', 'af_heart', 'bm_george', 'af_bella'
    SPEED: 0.8,                  // narration speed (1.0 = normal, lower = slower)
    PAUSE_AFTER: 1.6,            // seconds of silence after every scene (time to absorb)
    TRANSITION_SECONDS: 0.5,     // fade/wipe duration between scenes
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

// ── 0 THE QUESTION ──────────────────────────────────────────────
const N0 = "Here is a question millions of people ask. If humans came from apes, why are there still apes? Shouldn't the apes have vanished, or at least changed too? It seems like it makes no sense. But the answer is hiding in a very long story, one that begins long before there was even an Earth. Let us travel back, together.";
SCN(N0, 'WHY ARE THERE STILL APES?', [
    { id: 'bg', always: true, svg: `${bg([[0, '#140f3a'], [.4, '#5a2a6e'], [.72, '#ff8a4d'], [1, '#ffd08a']])}${stars2(50, 5, -260, 650)}${glow(500, 1130, 540, '#ffd08a', .9)}${hills(1190, '#3a2144', 70, 3)}${hills(1300, '#241532', 60, 4)}` },
    G(N0, 'hu', 'humans', { x: 770, y: 1320, svg: `<g transform="scale(1.8)">${humanSvg()}</g>${tag(0, -360, 'HUMANS', 38)}` }),
    G(N0, 'ap', 'apes', { x: 230, y: 1320, svg: `<g transform="scale(1.8)">${apeSvg()}</g>${tag(0, -360, 'APES', 38)}` }),
    G(N0, 'qm', 'vanished', { x: 500, y: 800, svg: `<g ${an('wobble', .6)}>${sfx(0, 0, '?!', -6, '#ffd23f', 240, '#2a1030')}</g>` }),
    G(N0, 'ea', 'earth', { x: 500, y: 300, svg: `${earthIcon(80)}${tag(0, 150, 'EARTH', 34)}` }),
    G(N0, 'tr', 'travel', { x: 500, y: 560, svg: sfx(0, 0, "LET'S TRAVEL BACK IN TIME", -2, '#fff', 48, '#2a1030') })
]);

// ── 1 BEFORE EARTH ──────────────────────────────────────────────
const N1 = "Imagine you are floating in darkness, about four and a half billion years ago. There is no Earth. There is no Sun. There is no ground to stand on. Just an enormous, slowly spinning cloud of gas and dust, left behind by stars that lived and died before. This cloud is the raw material of everything, including you.";
SCN(N1, '1 - BEFORE THERE WAS AN EARTH', [
    { id: 'bg', always: true, svg: `${bg([[0, '#02020a'], [1, '#0b0a24']])}${stars2(110, 9, -260, 1650)}` },
    G(N1, 'yo', 'floating', { x: 500, y: 1180, svg: `<g ${an('float', 2.6)}>${glow(0, 0, 70, '#fff6c0', .9)}<circle r="14" fill="#fff"/></g>${tag(0, 80, 'YOU', 36)}` }),
    G(N1, 'cl', 'cloud', { x: 0, y: 0, svg: `${glow(300, 480, 560, '#ff5fa2', .5)}${glow(720, 760, 600, '#3a7bff', .5)}${glow(500, 1050, 520, '#8a3cff', .5)}${glow(800, 300, 400, '#ffa04d', .35)}<g ${an('spin', 120, 0, [500, 700])}>${[300, 420, 540].map((r, i) => `<ellipse cx="500" cy="700" rx="${r}" ry="${r * .45}" fill="none" stroke="rgba(255,255,255,${.16 - i * .03})" stroke-width="${26 - i * 6}" transform="rotate(${i * 40} 500 700)"/>`).join('')}</g>${tag(500, 560, 'A GIANT CLOUD OF GAS AND DUST', 38)}` }),
    G(N1, 'no', 'sun', { x: 500, y: 300, svg: `<g transform="translate(-170 0)">${earthIcon(48)}<path d="M-60 -60 L60 60 M60 -60 L-60 60" stroke="#ff4d4d" stroke-width="10" stroke-linecap="round"/></g><g transform="translate(170 0)"><circle r="46" fill="#ffd23f"/><path d="M-60 -60 L60 60 M60 -60 L-60 60" stroke="#ff4d4d" stroke-width="10" stroke-linecap="round"/></g>${tag(0, 110, 'NO EARTH  ·  NO SUN', 34)}` }),
    G(N1, 'st', 'stars', { x: 500, y: 830, svg: `${[[-300, -40], [300, 30], [-80, 90], [180, -70]].map(([x, y], i) => `<g ${an('pulse', 1.4, i * .3)}><circle cx="${x}" cy="${y}" r="9" fill="#fff"/>${[0, 45, 90, 135].map(a => `<line x1="${x - 24}" y1="${y}" x2="${x + 24}" y2="${y}" stroke="#fff" stroke-width="3" transform="rotate(${a} ${x} ${y})"/>`).join('')}</g>`).join('')}${tag(0, 150, 'OLD STARS LEFT THEIR DUST BEHIND', 30)}` }),
    G(N1, 'ev', 'everything', { x: 500, y: 1370, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'THE RAW MATERIAL OF EVERYTHING', -2, '#ffd23f', 44, '#0b0a24')}</g>` })
]);

// ── 2 THE SUN AND THE DISK ──────────────────────────────────────
const N2 = "Gravity begins to pull the cloud inward. The center squeezes tighter and tighter, and gets hotter and hotter, until it ignites. The Sun is born. Around it spins a flat disk of leftover dust. Tiny grains stick to grains, grains become pebbles, and pebbles pile together into planets.";
SCN(N2, '2 - THE SUN IS BORN', [
    { id: 'bg', always: true, svg: `${bg([[0, '#02020a'], [1, '#120a2a']])}${stars2(90, 12, -260, 1650)}` },
    G(N2, 'gr', 'gravity', { x: 500, y: 700, svg: `${glow(0, 0, 520, '#8a3cff', .35)}${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<g transform="rotate(${a})"><path d="M420 0 H170" stroke="#9fb4ff" stroke-width="7" stroke-linecap="round" ${an('flow dash', 1)}/><path d="M190 -18 L160 0 L190 18" fill="none" stroke="#9fb4ff" stroke-width="7" stroke-linecap="round"/></g>`).join('')}${tag(0, -470, 'GRAVITY PULLS IT INWARD', 36)}` }),
    G(N2, 'ig', 'ignites', { x: 500, y: 700, svg: `${glow(0, 0, 360, '#ffb04d', .85)}<g ${an('spin', 30, 0, [0, 0])}>${Array.from({ length: 16 }, (_, i) => `<line x1="96" y1="0" x2="${i % 2 ? 150 : 190}" y2="0" stroke="#ffd23f" stroke-width="10" stroke-linecap="round" transform="rotate(${i * 22.5})"/>`).join('')}</g>${ball(0, 0, 90, '#fff6c0', '#ffc233', '#ff7a1a')}${sfx(0, 260, 'THE SUN IS BORN!', -2, '#ffd23f', 54, '#120a2a')}` }),
    G(N2, 'dk', 'disk', { x: 500, y: 700, svg: [210, 300, 390, 470].map((rx, i) => `<ellipse rx="${rx}" ry="${rx * .2}" fill="none" stroke="rgba(255,225,180,.55)" stroke-width="${10 - i}" stroke-dasharray="2 ${12 + i * 4}" ${an('flow', 3 + i, 0, 'center', '')}/>`).join('') + tag(0, 220, 'A FLAT DISK OF LEFTOVER DUST', 34) }),
    G(N2, 'pb', 'pebbles', { x: 500, y: 700, svg: [[-300, 50, 7], [-250, 70, 11], [-330, 90, 14], [300, -30, 8], [340, -50, 12], [270, -60, 16]].map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#b89a82" stroke="#6a5444" stroke-width="3" ${an('bob', 1.2, i * .2)}/>`).join('') }),
    G(N2, 'pl', 'planets', { x: 500, y: 700, svg: `${ball(-330, 80, 38, '#e8c8a8', '#b07a52', '#4a2a1a')}${ball(-180, 40, 26, '#d8d8d8', '#9a8f86', '#4a4440')}${ball(330, -50, 48, '#9fe0ff', '#2d7ac2', '#08285a')}${ball(210, -30, 30, '#ffb08a', '#d4603a', '#5a2010')}${sfx(0, 380, 'PLANETS FORM', -2, '#fff', 52, '#120a2a')}` })
]);

// ── 3 EARTH, MOLTEN ─────────────────────────────────────────────
const N3 = "One lump in that disk grows into our Earth, about four and a half billion years ago. It is not friendly. The surface is a glowing ocean of melted rock, and space rocks keep crashing down. Then a planet-sized rock smashes in, and the debris becomes our Moon.";
const cracks = (() => { const r = rng(31); let o = ''; for (let i = 0; i < 14; i++) { const x = 100 + r() * 800, y = 900 + r() * 700; o += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l${(r() * 120 - 60).toFixed(0)} ${(r() * 80).toFixed(0)} l${(r() * 100 - 50).toFixed(0)} ${(r() * 70).toFixed(0)} l${(r() * 80 - 40).toFixed(0)} ${(r() * 60).toFixed(0)}" stroke="#ffd23f" stroke-width="${3 + r() * 5}" fill="none" stroke-linecap="round" ${an('pulse', (1 + r() * 1.5).toFixed(1), r().toFixed(1))}/>`; } return o; })();
SCN(N3, '3 - A MOLTEN WORLD', [
    { id: 'bg', always: true, svg: `${bg([[0, '#02020a'], [1, '#1a0a14']])}${stars2(80, 17, -260, 900)}${glow(500, 1250, 760, '#ff5a1a', .5)}${ball(500, 1300, 640, '#ffb04d', '#d83a10', '#2a0a06')}${cracks}` },
    G(N3, 'ea', 'earth', { x: 500, y: 330, svg: `${tag(0, 0, 'EARTH, ABOUT 4.5 BILLION YEARS AGO', 36)}` }),
    G(N3, 'ml', 'melted', { x: 500, y: 980, svg: `<g ${an('pulse', 1)}>${sfx(0, 0, 'A SEA OF MELTED ROCK', -2, '#ffd23f', 54, '#2a0a06')}</g>` }),
    G(N3, 'cr', 'crashing', { x: 0, y: 0, svg: [[150, 80], [420, 40], [820, 100], [640, 10]].map(([x, y], i) => `<g ${an('move', 1.6 + i * .3, i * .4, 'center', '--dx:90px;--dy:420px;')}><path d="M${x} ${y} l-40 -70" stroke="#ffd23f" stroke-width="9" stroke-linecap="round" opacity=".7"/><circle cx="${x}" cy="${y}" r="22" fill="#6a4a3a" stroke="#ffa04d" stroke-width="6"/></g>`).join('') }),
    G(N3, 'sm', 'smashes', { x: 790, y: 780, svg: `<g ${an('pulse', .6)}>${glow(0, 0, 220, '#fff0b0', .95)}</g>${sfx(0, 0, 'CRASH!', 8, '#fff', 70, '#a02a06')}` }),
    G(N3, 'mo', 'moon', { x: 790, y: 380, svg: `${glow(0, 0, 150, '#ffffff', .35)}${ball(0, 0, 80, '#f0f0f0', '#a8a39c', '#4a4640')}<circle cx="-24" cy="-18" r="14" fill="#8a857e" opacity=".6"/><circle cx="26" cy="22" r="10" fill="#8a857e" opacity=".6"/>${tag(0, 130, 'THE MOON', 34)}` })
], '#a02a06');

// ── 4 OCEANS AND FIRST LIFE ─────────────────────────────────────
const N4 = "Slowly, Earth cools. Steam turns into rain, and the rain fills the first oceans. In warm water, perhaps near volcano vents, simple chemicals join up into something new: tiny living cells. No eyes, no legs, no brain. But they can copy themselves. This is the beginning of life, more than three and a half billion years ago.";
SCN(N4, '4 - THE FIRST OCEANS', [
    { id: 'bg', always: true, svg: `${bg([[0, '#2a2f4a'], [.3, '#5a6a8a']])}<rect x="${X0}" y="560" width="${X1 - X0}" height="${Y1 - 560}" fill="#0e6a8a"/>${bg([[0, 'rgba(14,106,138,0)'], [1, '#021a2a']]).replace(`y="${Y0}"`, 'y="560"').replace(`height="${Y1 - Y0}"`, `height="${Y1 - 560}"`)}${cloud(80, 120, 2.2, '#8a96ad', .9)}${cloud(620, 60, 2.6, '#7a86a0', .9)}${cloud(380, 260, 1.8, '#9aa6bd', .8)}<path d="M${X0} 560 q70 -34 140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 V620 H${X0}Z" fill="#1d8ab0" ${an('float', 3)}/>${[200, 520, 820].map((x, i) => `<path d="M${x - 70} 1700 L${x - 30} 1420 H${x + 30} L${x + 70} 1700Z" fill="#1a1a22"/><circle cx="${x}" cy="1420" r="46" fill="#ff7a1a" opacity=".5"/>`).join('')}` },
    G(N4, 'co', 'cools', { x: 500, y: 130, svg: tag(0, 0, 'EARTH COOLS', 40) }),
    G(N4, 'rn', 'rain', { x: 0, y: 0, svg: Array.from({ length: 30 }, (_, i) => `<line x1="${40 + i * 33}" y1="-60" x2="${20 + i * 33}" y2="10" stroke="#bfe3ff" stroke-width="4" stroke-linecap="round" ${an('move', .7, i * .05, 'center', '--dy:600px;--dir:normal;--e:linear;opacity:.7;')}/>`).join('') }),
    G(N4, 'oc', 'oceans', { x: 500, y: 640, svg: tag(0, 0, 'THE FIRST OCEANS', 40) }),
    G(N4, 'vt', 'vents', { x: 500, y: 1330, svg: `${tag(0, 0, 'WARM VOLCANIC VENTS', 36)}${[-300, 20, 320].map((x, i) => `<g ${an('rise', 2.4, i * .6, 'center', '--dy:-160px;--sc:1.6;')}><circle cx="${x}" cy="90" r="20" fill="rgba(255,200,120,.5)"/></g>`).join('')}` }),
    G(N4, 'ce', 'cells', { x: 500, y: 1050, svg: `${[[-260, 120, 22, '#6dff9c'], [-60, 20, 16, '#ffd23f'], [150, 110, 26, '#ff9ad0'], [300, -10, 18, '#7fe0ff'], [10, 190, 20, '#6dff9c']].map(([x, y, r, c], i) => `<g ${an('bob', 1.6 + i * .2, i * .3)}>${cell(x, y, r, c, '#fff')}</g>`).join('')}${tag(0, -120, 'TINY LIVING CELLS', 40)}` }),
    G(N4, 'cp', 'copy', { x: 500, y: 930, svg: `<g ${an('pulse', 1)}>${sfx(0, 0, 'THEY CAN COPY THEMSELVES!', -2, '#6dff9c', 48, '#021a2a')}</g>` })
], '#1d6a8a');

// ── 5 COPIES WITH MISTAKES ──────────────────────────────────────
const N5 = "Here is the secret behind all of evolution. When cells copy themselves, they do not copy perfectly. Now and then a tiny mistake slips in, like a typo when you copy a recipe by hand. Most mistakes do nothing. A few are harmful. A very few help. And nobody chooses which. The mistakes are random.";
SCN(N5, '5 - THE SECRET: TINY MISTAKES', [
    { id: 'bg', always: true, svg: `${bg([[0, '#ffe2a8'], [1, '#ffc7b0']])}${Array.from({ length: 26 }, (_, i) => `<circle cx="${(i * 197) % 1100 - 40}" cy="${(i * 331) % 1900 - 260}" r="${20 + (i % 4) * 14}" fill="rgba(255,255,255,.28)"/>`).join('')}` },
    G(N5, 'tt', 'secret', { x: 500, y: 130, svg: sfx(0, 0, 'THE SECRET OF EVOLUTION', -2, '#b5402c', 56, '#fff') }),
    G(N5, 'cp', 'copy', { x: 500, y: 420, svg: `${cell(-220, 0, 60, '#4aa3e8')}<path d="M-130 -10 H-40" stroke="#231b12" stroke-width="8" stroke-linecap="round"/><path d="M-60 -30 L-30 -10 L-60 10" fill="none" stroke="#231b12" stroke-width="8" stroke-linecap="round"/>${cell(40, -60, 44, '#4aa3e8')}${cell(40, 70, 44, '#4aa3e8')}${T(-220, 120, 'PARENT', 30, '#231b12')}${T(40, 160, 'COPIES', 30, '#231b12')}` }),
    G(N5, 'mk', 'mistake', { x: 500, y: 420, svg: `${cell(260, 70, 44, '#4aa3e8', '#ff7a1a')}<g ${an('pulse', .6)}>${sfx(300, -10, 'OOPS!', 8, '#e63946', 52, '#fff')}</g>${T(260, 160, 'A TINY CHANGE', 28, '#e63946')}` }),
    G(N5, 'ty', 'typo', { x: 500, y: 760, svg: `${box0(-250, 0, 400, 120)}${T(-250, 14, 'MIX 2 EGGS', 44, '#231b12')}${arrow(-30, 0, 40, 0, '#231b12', 8)}${box0(250, 0, 400, 120)}${T(250, 14, 'MIX ', 44, '#231b12', 'end')}${T(250, 14, '3', 54, '#e63946', 'start')}${T(300, 14, ' EGGS', 44, '#231b12', 'start')}<circle cx="262" cy="0" r="40" fill="none" stroke="#e63946" stroke-width="6"/>${T(0, 110, 'COPYING A RECIPE BY HAND: A TYPO', 30, '#b5402c')}` }),
    G(N5, 'o1', 'nothing', { x: 190, y: 1050, svg: `${box0(0, 0, 270, 150)}${T(0, -10, 'MOST', 40, '#231b12')}${T(0, 40, 'DO NOTHING', 32, '#5a6a8a')}` }),
    G(N5, 'o2', 'harmful', { x: 500, y: 1050, svg: `${box0(0, 0, 270, 150)}${T(0, -10, 'A FEW', 40, '#231b12')}${T(0, 40, 'HARM', 36, '#e63946')}` }),
    G(N5, 'o3', 'help', { x: 810, y: 1050, svg: `${box0(0, 0, 270, 150)}${T(0, -10, 'VERY FEW', 40, '#231b12')}${T(0, 40, 'HELP', 36, '#2c6b5a')}` }),
    G(N5, 'rd', 'random', { x: 500, y: 1300, svg: `<g ${an('wobble', .6)}><rect x="-300" y="-50" width="100" height="100" rx="18" fill="#fff" stroke="#231b12" stroke-width="6"/>${[[-20, -20], [20, 20], [-20, 20], [20, -20], [0, 0]].map(([x, y]) => `<circle cx="${-250 + x}" cy="${y}" r="9" fill="#231b12"/>`).join('')}</g>${sfx(60, 10, 'NOBODY CHOOSES: RANDOM!', -2, '#b5402c', 46, '#fff')}` })
], '#2c6b5a');
function box0(x, y, w, h) { return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="16" fill="#fff" stroke="#231b12" stroke-width="6"/>`; }

// ── 6 THE SIEVE ─────────────────────────────────────────────────
const N6 = "Now add the environment. Think of a sieve. All the different copies pour through it, but only those that suit that place come out the other side, survive, and have children. This is natural selection. It does not plan. It does not look ahead. It only filters what already exists.";
const bug = (x, y, r, c) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="${c}" stroke="#1a3a24" stroke-width="3"/><circle cx="${-r * .35}" cy="${-r * .2}" r="${r * .22}" fill="#fff"/><circle cx="${r * .35}" cy="${-r * .2}" r="${r * .22}" fill="#fff"/><circle cx="${-r * .3}" cy="${-r * .2}" r="${r * .1}" fill="#111"/><circle cx="${r * .4}" cy="${-r * .2}" r="${r * .1}" fill="#111"/></g>`;
const BUGC = ['#3aa655', '#ff8a3d', '#4aa3e8', '#a06ae0'];
SCN(N6, '6 - NATURAL SELECTION', [
    { id: 'bg', always: true, svg: `${bg([[0, '#d7f3c6'], [1, '#7fc48a']])}${glow(500, 100, 600, '#fffbd0', .8)}${hills(1400, '#4a9a5a', 50, 8)}` },
    G(N6, 'en', 'environment', { x: 500, y: 150, svg: `${box0(0, 0, 760, 110)}${T(0, 14, 'THE ENVIRONMENT: A GREEN FOREST', 40, '#2c6b5a')}` }),
    G(N6, 'po', 'copies', { x: 500, y: 400, svg: `<path d="M-300 -80 H300 L220 100 H-220Z" fill="rgba(255,255,255,.5)" stroke="#231b12" stroke-width="6" stroke-linejoin="round"/>${Array.from({ length: 12 }, (_, i) => bug(-230 + (i % 6) * 92, -30 + Math.floor(i / 6) * 70, 26, BUGC[(i * 7 + (i >> 1)) % 4])).join('')}${T(0, 160, 'ALL THE DIFFERENT COPIES', 32, '#231b12')}` }),
    G(N6, 'sv', 'sieve', { x: 500, y: 760, svg: `<rect x="-360" y="-18" width="720" height="38" rx="10" fill="#6a5a44" stroke="#231b12" stroke-width="5"/>${Array.from({ length: 11 }, (_, i) => `<circle cx="${-300 + i * 60}" cy="1" r="13" fill="#231b12" opacity=".75"/>`).join('')}${tag(0, 80, 'THE SIEVE', 40, '#fff', 'rgba(35,27,18,.7)')}` }),
    G(N6, 'su', 'suit', { x: 500, y: 760, svg: `${[-300, -60, 180].map((x, i) => `${bug(x, -48, 28, BUGC[1 + (i % 2)])}<path d="M${x - 22} -72 L${x + 22} -24 M${x + 22} -72 L${x - 22} -24" stroke="#e63946" stroke-width="7" stroke-linecap="round"/>`).join('')}${[-120, 120].map((x, i) => `<g ${an('move', 1.6, i * .5, 'center', '--dy:150px;')}>${bug(x, 20, 26, BUGC[0])}</g>`).join('')}${tag(-60, -130, 'DOES NOT SUIT', 28, '#fff', 'rgba(150,30,40,.75)')}${tag(0, 230, 'SUITS THE FOREST', 28, '#fff', 'rgba(30,110,60,.8)')}` }),
    G(N6, 'sr', 'survive', { x: 500, y: 1130, svg: `${Array.from({ length: 9 }, (_, i) => bug(-200 + (i % 5) * 100, (i < 5 ? 0 : 60), 30, BUGC[0])).join('')}${sfx(0, 150, 'SURVIVE + HAVE CHILDREN', -2, '#2c6b5a', 44, '#fff')}` }),
    G(N6, 'pl', 'plan', { x: 500, y: 1330, svg: `${tag(0, 0, 'NO PLAN  ·  NO LOOKING AHEAD', 36, '#fff', 'rgba(35,27,18,.7)')}` }),
    G(N6, 'fl', 'filters', { x: 500, y: 1410, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'IT ONLY FILTERS', -2, '#b5402c', 60, '#fff')}</g>` })
], '#2c6b5a');

// ── 7 LIFE GROWS ────────────────────────────────────────────────
const N7 = "Billions of years pass. Some cells learn to make food from sunlight, and fill the air with oxygen. Cells join together into bigger bodies. About five hundred million years ago, life explodes into fish, shells, and strange swimmers. Then some fish crawl onto the shore, and the land turns green.";
const trilo = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="46" ry="26" fill="#8a6a54" stroke="#3a2a20" stroke-width="3"/>${[-24, -8, 8, 24].map(k => `<path d="M${k} -24 Q${k + 4} 0 ${k} 24" stroke="#3a2a20" stroke-width="3" fill="none"/>`).join('')}<circle cx="-34" cy="-8" r="5" fill="#fff"/></g>`;
SCN(N7, '7 - LIFE GROWS UP', [
    { id: 'bg', always: true, svg: `${bg([[0, '#8fd3ff'], [1, '#e6f6ff']]).replace(`height="${Y1 - Y0}"`, `height="${520 - Y0}"`)}<rect x="${X0}" y="520" width="840" height="${Y1 - 520}" fill="#0b6f92"/>${bg([[0, 'rgba(11,111,146,0)'], [1, '#032a40']]).replace(`y="${Y0}"`, 'y="520"').replace(`height="${Y1 - Y0}"`, `height="${Y1 - 520}"`).replace(`width="${X1 - X0}"`, 'width="840"')}<path d="M760 520 Q800 800 860 1100 Q900 1400 1060 1700 V520Z" fill="#e8d6a0"/><path d="M${X0} 520 q60 -30 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 V560 H${X0}Z" fill="#3aa6cc" ${an('float', 3)}/>` },
    G(N7, 'tl', 'pass', { x: 500, y: 1560, svg: `${[[-390, '3.5 BYA: CELLS'], [-130, '2.4 BYA: OXYGEN'], [130, '540 MYA: ANIMALS'], [390, '375 MYA: LAND']].map(([x, t]) => tag(x, 0, t, 24)).join('')}` }),
    G(N7, 'sl', 'sunlight', { x: 150, y: 80, svg: `${glow(0, 0, 200, '#fff6c0', .9)}<circle r="52" fill="#ffd23f"/>${[0, 1, 2].map(i => `<path d="M${-30 + i * 30} 60 L${-90 + i * 90} 520" stroke="rgba(255,246,192,.35)" stroke-width="30"/>`).join('')}${[[-80, 700], [20, 780], [90, 640]].map(([x, y], i) => cell(x, y, 14, '#4ade80')).join('')}${tag(0, 880, 'FOOD FROM SUNLIGHT', 30)}` }),
    G(N7, 'ox', 'oxygen', { x: 400, y: 1100, svg: [[-120, 0], [-40, -90], [60, -40], [140, -140], [0, -200]].map(([x, y], i) => `<g ${an('rise', 3, i * .5, 'center', '--dy:-420px;--sc:1.2;')}><circle cx="${x}" cy="${y}" r="26" fill="rgba(200,240,255,.5)" stroke="#fff" stroke-width="3"/>${T(x, y + 9, 'O2', 22, '#fff')}</g>`).join('') + tag(0, 150, 'OXYGEN FILLS THE AIR', 34) }),
    G(N7, 'bd', 'bodies', { x: 220, y: 1180, svg: [[0, 0], [34, -20], [34, 20], [68, 0], [-34, -20], [-34, 20]].map(([x, y]) => cell(x, y, 20, '#ff9ad0')).join('') + tag(0, 90, 'CELLS JOIN UP', 30) }),
    G(N7, 'fi', 'fish', { x: 380, y: 880, svg: `${[[0, 0, 1.4, '#ffb04d'], [160, 120, 1, '#7fe0ff'], [-90, 160, .8, '#ff7aa8']].map(([x, y, s, c], i) => `<g ${an('float', 2 + i * .4, i * .3)}>${fish(x, y, s, c)}</g>`).join('')}${trilo(-120, 360, 1.2)}${trilo(80, 380, 1)}${tag(0, 470, 'FISH, SHELLS AND STRANGE SWIMMERS', 30)}` }),
    G(N7, 'sh', 'shore', { x: 820, y: 700, svg: `${[[0, 0, 1.2], [100, 160, 1], [-60, 300, 1.1]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 Q-30 -60 -70 -90 M0 0 Q0 -80 0 -120 M0 0 Q30 -60 70 -90" stroke="#2e9a4a" stroke-width="10" fill="none" stroke-linecap="round"/></g>`).join('')}<g transform="translate(-130 400) rotate(-18)">${fish(0, 0, 1.2, '#ffb04d')}</g>${tag(-20, 560, 'THE LAND TURNS GREEN', 30)}` })
], '#0b6f92');

// ── 8 DINOSAURS AND SMALL MAMMALS ───────────────────────────────
const N8 = "Then come the dinosaurs, ruling the Earth for over a hundred and fifty million years. Hiding in their shadows are tiny furry mammals, no bigger than mice. Then a giant rock from space strikes the Earth, sixty six million years ago. The great dinosaurs are gone, and the small mammals inherit a world of empty places.";
SCN(N8, '8 - THE AGE OF DINOSAURS', [
    { id: 'bg', always: true, svg: `${bg([[0, '#2a1030'], [.35, '#a2365a'], [.65, '#ff7a45'], [1, '#ffd08a']])}${glow(720, 1050, 520, '#ffe9a0', .9)}<circle cx="720" cy="1050" r="110" fill="#fff0b0"/>${hills(1130, '#3a1a2a', 50, 6, .85)}${hills(1300, '#1f0e1a', 60, 7)}` },
    G(N8, 'dn', 'dinosaurs', { x: 0, y: 0, hw: 'gone', ht: A(N8, 'gone'), svg: `${sauro(250, 1180, 1.7)}${sauro(660, 1230, 1.4)}${sauro(920, 1150, 1)}${tag(500, 380, 'DINOSAURS RULED FOR 150+ MILLION YEARS', 32)}` }),
    G(N8, 'ma', 'mammals', { x: 300, y: 1420, svg: `<g transform="scale(1.4)">${shrew(1)}</g>${tag(40, 70, 'TINY FURRY MAMMALS', 30)}` }),
    G(N8, 'rk', 'rock', { x: 0, y: 0, svg: `<g ${an('move', 2.4, 0, 'center', '--dx:560px;--dy:620px;--dir:normal;--e:ease-in;')}>${glow(120, 120, 160, '#ffd23f', .8)}<path d="M120 120 L-120 -140" stroke="#ff7a1a" stroke-width="40" stroke-linecap="round" opacity=".7"/><circle cx="120" cy="120" r="46" fill="#5a4a40" stroke="#ffa04d" stroke-width="8"/></g>${tag(500, 560, '66 MILLION YEARS AGO', 36)}` }),
    G(N8, 'go', 'gone', { x: 500, y: 700, svg: `<g ${an('pulse', .7)}>${glow(0, 200, 380, '#fff0b0', .5)}${sfx(0, 0, 'THE GREAT DINOSAURS ARE GONE', -2, '#fff', 44, '#2a1030')}</g>` }),
    G(N8, 'em', 'empty', { x: 500, y: 960, svg: sfx(0, 0, 'A WORLD OF EMPTY PLACES', -2, '#ffd23f', 52, '#2a1030') })
], '#a2365a');

// ── 9 PRIMATES AND APES ─────────────────────────────────────────
const N9 = "Mammals spread out and change to fit every place. One group takes to the trees, with grasping hands, forward-facing eyes, and clever brains for judging branches. These are the primates. About twenty five million years ago, the first apes appear. Apes are large, have no tails, and have strong arms made for swinging.";
SCN(N9, '9 - UP IN THE TREES', [
    { id: 'bg', always: true, svg: jungle(41) },
    G(N9, 'tr', 'trees', { x: 500, y: 190, svg: tag(0, 0, 'ONE GROUP TAKES TO THE TREES', 38) }),
    G(N9, 'pr', 'primates', { x: 500, y: 330, svg: `<g transform="translate(-200 0)"><circle r="34" fill="#d9a67a" stroke="#2a1a10" stroke-width="4"/>${[-22, -8, 8, 22].map(x => `<rect x="${x - 5}" y="-62" width="10" height="34" rx="5" fill="#d9a67a" stroke="#2a1a10" stroke-width="3"/>`).join('')}</g>${tag(-200, 90, 'GRASPING HANDS', 26)}<g transform="translate(100 0)"><ellipse rx="40" ry="26" fill="#fff" stroke="#2a1a10" stroke-width="4"/><ellipse cx="80" rx="40" ry="26" fill="#fff" stroke="#2a1a10" stroke-width="4"/><circle cx="6" cy="0" r="12" fill="#2a1a10"/><circle cx="86" cy="0" r="12" fill="#2a1a10"/></g>${tag(140, 90, 'FORWARD EYES', 26)}` }),
    G(N9, 'ap', 'apes', { x: 260, y: 1150, svg: `<path d="M-250 -150 Q0 -100 260 -150" stroke="#5a3b22" stroke-width="22" fill="none" stroke-linecap="round"/><g transform="translate(0 -92) scale(1.5)">${apeSvg()}</g>${tag(0, 70, 'APES  ·  ~25 MILLION YEARS AGO', 28)}` }),
    G(N9, 'ta', 'tails', { x: 500, y: 1270, svg: `${tag(0, 0, 'NO TAIL', 40, '#fff', 'rgba(120,30,40,.75)')}` }),
    G(N9, 'sw', 'swinging', { x: 760, y: -120, svg: `<g ${an('rot', 2.2, 0, [0, 0], '--r0:-24deg;--r1:24deg;')}><line x1="0" y1="0" x2="0" y2="760" stroke="#3a6a2a" stroke-width="12"/><g transform="translate(0 780) scale(1.5)">${apeSvg('#6a4a34', '#e0b48a')}</g></g>${sfx(-200, 980, 'WHEEE!', -8, '#ffd23f', 66, '#14502d')}` })
], '#2e8b4a');

// ── 10 THE COMMON ANCESTOR ──────────────────────────────────────
const N10 = "Now we reach the heart of your question. About six or seven million years ago, in Africa, lived an ancient ape. It was not a chimpanzee. It was not a human. It was something in between, and different from both. Scientists call it the common ancestor. Its descendants spread across a huge forested land.";
SCN(N10, '10 - THE COMMON ANCESTOR', [
    { id: 'bg', always: true, svg: `${bg([[0, '#ffcf8a'], [.5, '#ffe9b8'], [1, '#bfe0a0']])}${glow(500, 600, 600, '#fffbe0', .9)}${hills(1000, '#7fb86a', 60, 14, .9)}${[60, 260, 740, 940].map((x, i) => jt(x, 1150 + (i % 2) * 40, 1.6, '#2f7a45', '#4f9a5a')).join('')}${hills(1350, '#3a8a4a', 50, 15)}` },
    G(N10, 'af', 'africa', { x: 500, y: 180, svg: tag(0, 0, 'AFRICA  ·  ABOUT 6-7 MILLION YEARS AGO', 34) }),
    G(N10, 'an', 'ancestor', { x: 500, y: 1180, svg: `<g ${an('pulse', 1.6)}>${glow(0, -170, 300, '#fff6c0', .8)}</g><g transform="scale(2.6)">${apeSvg('#8a6a44', '#e6c08a')}</g>${tag(0, 80, 'THE COMMON ANCESTOR', 40, '#fff', 'rgba(120,70,20,.8)')}` }),
    G(N10, 'nt', 'chimpanzee', { x: 500, y: 540, svg: `<g transform="translate(-230 0)">${tag(0, 0, 'NOT A CHIMPANZEE', 30, '#fff', 'rgba(150,30,40,.75)')}</g><g transform="translate(230 0)">${tag(0, 0, 'NOT A HUMAN', 30, '#fff', 'rgba(150,30,40,.75)')}</g>` }),
    G(N10, 'ds', 'descendants', { x: 500, y: 900, svg: [[-380, 40], [-250, -30], [250, -20], [390, 50]].map(([x, y], i) => `<g transform="translate(${x} ${y}) scale(.7)" ${an('bob', 1.4, i * .2)}>${apeSvg('#8a6a44', '#e6c08a')}</g>`).join('') + [[-120, 60], [120, 60]].map(([x, y]) => `<path d="M${x} ${y} Q${x * 2} ${y - 80} ${x * 3} ${y - 20}" stroke="#fff" stroke-width="6" stroke-dasharray="10 8" fill="none" ${an('flow', 1)}/>`).join('') })
], '#c8702a');

// ── 11 THE COUSIN ANALOGY ───────────────────────────────────────
const N11 = "Think of your own family. You and your cousin share the same grandparents. You did not come from your cousin. Your cousin did not come from you. Yet both of you are alive today. Humans and chimpanzees are cousins in the same way. And that ancient ape is our shared grandparent.";
const lineP = (d) => `<path d="${d}" fill="none" stroke="#231b12" stroke-width="7" stroke-linecap="round"/>`;
SCN(N11, '11 - THINK OF COUSINS', [
    { id: 'bg', always: true, svg: paperBg() },
    G(N11, 'gp', 'grandparents', { x: 500, y: 420, hw: 'chimpanzees', ht: A(N11, 'chimpanzees'), svg: `<g transform="translate(-90 0)"><g transform="scale(1.1)">${humanSvg('#d9a67a', '#8a5a9a', '#d8d8d8')}</g></g><g transform="translate(90 0)"><g transform="scale(1.1)">${humanSvg('#c68642', '#c8702a', '#cfcfcf')}</g></g>${tag(0, 70, 'GRANDPARENTS', 34, '#fff', 'rgba(35,27,18,.8)')}` }),
    G(N11, 'cz', 'cousin', { x: 500, y: 0, hw: 'chimpanzees', ht: A(N11, 'chimpanzees'), svg: `${lineP('M440 350 V470 H260 V540 M560 350 V470 H740 V540')}<g transform="translate(260 650)"><g transform="scale(1.1)">${humanSvg('#d9a67a', '#2d5fb5')}</g></g><g transform="translate(740 650)"><g transform="scale(1.1)">${humanSvg('#8d5a3b', '#2c6b5a')}</g></g>${lineP('M260 670 V740 M740 670 V740')}<g transform="translate(260 940)"><g transform="scale(1.4)">${humanSvg('#d9a67a', '#2d5fb5')}</g></g><g transform="translate(740 940)"><g transform="scale(1.4)">${humanSvg('#8d5a3b', '#2c6b5a')}</g></g>${tag(260, 1010, 'YOU', 40, '#fff', 'rgba(45,95,181,.9)')}${tag(740, 1010, 'YOUR COUSIN', 36, '#fff', 'rgba(44,107,90,.9)')}` }),
    G(N11, 'x', 'did', { x: 500, y: 910, hw: 'chimpanzees', ht: A(N11, 'chimpanzees'), svg: `${arrow(300, 0, 440, 0, '#e63946', 10)}${arrow(700, 0, 560, 0, '#e63946', 10)}<path d="M-60 -60 L60 60 M60 -60 L-60 60" stroke="#e63946" stroke-width="14" stroke-linecap="round"/>${sfx(0, 130, 'NOT FROM EACH OTHER', -2, '#e63946', 38, '#fff')}` }),
    G(N11, 'al', 'alive', { x: 500, y: 1140, hw: 'chimpanzees', ht: A(N11, 'chimpanzees'), svg: sfx(0, 0, 'BOTH ALIVE TODAY!', -2, '#2c6b5a', 52, '#fff') }),
    G(N11, 'mp', 'chimpanzees', { x: 500, y: 0, svg: `<g transform="translate(500 440)"><g ${an('pulse', 1.6)}>${glow(0, -90, 200, '#fff6c0', .8)}</g><g transform="scale(1.4)">${apeSvg('#8a6a44', '#e6c08a')}</g></g>${lineP('M500 360 V470 H260 V560 M500 360 V470 H740 V560')}<g transform="translate(260 960)"><g transform="scale(1.6)">${humanSvg('#d9a67a', '#2d5fb5')}</g></g><g transform="translate(740 960)"><g transform="scale(1.6)">${apeSvg()}</g></g>${lineP('M260 700 V780 M740 700 V780')}${tag(260, 1030, 'HUMANS', 40, '#fff', 'rgba(45,95,181,.9)')}${tag(740, 1030, 'CHIMPANZEES', 36, '#fff', 'rgba(91,58,41,.9)')}` }),
    G(N11, 'gt', 'grandparent', { x: 500, y: 690, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'THE ANCIENT APE = SHARED GRANDPARENT', -2, '#b5402c', 36, '#fff')}</g>` })
], '#2c6b5a');

// ── 12 THE RIVER SPLITS ─────────────────────────────────────────
const N12 = "How does one group become two species? Picture a river that splits in two. The water before the split is the ancestor. After the split, each stream flows through different land. Scientists think Africa's climate shifted. In some places forests shrank and opened into woodland and grass. So the descendants found themselves living in different worlds.";
const rforest = (() => { const r = rng(51); let o = ''; for (let i = 0; i < 30; i++) { const x = X0 + r() * 470, y = 700 + r() * 800; o += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><circle r="${28 + r() * 22}" fill="${r() > .5 ? '#1f6b3a' : '#2e8b4a'}"/></g>`; } return o; })();
const rgrassy = (() => { const r = rng(61); let o = ''; for (let i = 0; i < 9; i++) o += acacia(560 + r() * 440, 800 + r() * 650, .5 + r() * .3); return o; })();
SCN(N12, '12 - ONE RIVER, TWO PATHS', [
    { id: 'bg', always: true, svg: `${bg([[0, '#8fbf6a'], [1, '#6aa050']])}<rect x="500" y="640" width="${X1 - 500}" height="${Y1 - 640}" fill="#d8c46a" opacity=".85"/><rect x="${X0}" y="640" width="560" height="${Y1 - 640}" fill="#2f7a45" opacity=".6"/>${rforest}${rgrassy}` },
    G(N12, 'rv', 'river', { x: 0, y: 0, svg: `<path d="M500 -200 C500 150 500 400 500 660" stroke="#2a7ab0" stroke-width="64" fill="none" stroke-linecap="round"/><path d="M500 -200 C500 150 500 400 500 660" stroke="#7fd0ff" stroke-width="36" fill="none" stroke-linecap="round" ${an('flow dash', 1.2)}/><g transform="translate(300 360)">${[-60, 0, 60].map((x, i) => `<g transform="translate(${x} ${i % 2 * 40}) scale(.5)">${apeSvg('#8a6a44', '#e6c08a')}</g>`).join('')}</g>${tag(260, 220, 'THE ANCESTOR POPULATION', 30)}` }),
    G(N12, 'sp', 'split', { x: 0, y: 0, svg: `<path d="M500 640 C500 820 310 900 300 1500" stroke="#2a7ab0" stroke-width="48" fill="none" stroke-linecap="round"/><path d="M500 640 C500 820 710 920 720 1500" stroke="#2a7ab0" stroke-width="48" fill="none" stroke-linecap="round"/><path d="M500 640 C500 820 310 900 300 1500" stroke="#7fd0ff" stroke-width="24" fill="none" ${an('flow dash', 1.2)}/><path d="M500 640 C500 820 710 920 720 1500" stroke="#7fd0ff" stroke-width="24" fill="none" ${an('flow dash', 1.2)}/>${sfx(500, 620, 'SPLIT!', -3, '#fff', 60, '#1a4a6a')}` }),
    G(N12, 'cl', 'climate', { x: 800, y: 170, svg: `${glow(0, 0, 160, '#ffd23f', .8)}<circle r="52" fill="#ffd23f"/>${tag(-80, 130, "AFRICA'S CLIMATE SHIFTS", 28)}` }),
    G(N12, 'fo', 'forests', { x: 500, y: 1000, svg: `${tag(-250, 0, 'DENSE FOREST', 34, '#fff', 'rgba(20,80,45,.85)')}${tag(250, 0, 'OPEN WOODLAND + GRASS', 30, '#fff', 'rgba(150,110,30,.85)')}` }),
    G(N12, 'wo', 'worlds', { x: 500, y: 1250, svg: `<g transform="translate(-260 80) scale(.9)">${apeSvg()}</g><g transform="translate(260 80) scale(.9)">${apeSvg('#8a6a44', '#e6c08a')}</g>${sfx(0, -40, 'DIFFERENT WORLDS', -2, '#fff', 54, '#14502d')}` })
], '#2a7ab0');

// ── 13 THE FOREST GROUP STAYS ───────────────────────────────────
const N13 = "Here is where the myth breaks. The forest group lived where fruit was plentiful and trees were safe. Their old way of life still worked. There was no pressure to become something new. When the sieve lets your design through, you stay almost the same. Evolution is not evolve or die. It is survive, and have children.";
const shark = `<path d="M-90 0 Q-20 -40 70 -10 L120 -50 L110 0 L120 40 L70 12 Q-20 40 -90 0Z" fill="#7a8a9a" stroke="#2a3a4a" stroke-width="4"/><path d="M-10 -22 L10 -70 L30 -18Z" fill="#7a8a9a" stroke="#2a3a4a" stroke-width="4"/><circle cx="-60" cy="-4" r="4" fill="#111"/>`;
const croc = `<path d="M-100 10 Q-100 -14 -60 -14 H60 L120 -4 L120 14 H60 Q40 30 -60 30 Q-100 30 -100 10Z" fill="#5a7a4a" stroke="#2a3a20" stroke-width="4"/><path d="M-100 10 L-150 0 L-100 22Z" fill="#5a7a4a"/><circle cx="90" cy="-8" r="5" fill="#ffd23f"/>${[-60, -20, 20].map(x => `<path d="M${x} 28 v22" stroke="#2a3a20" stroke-width="9" stroke-linecap="round"/>`).join('')}`;
SCN(N13, '13 - THE OLD WAY STILL WORKS', [
    { id: 'bg', always: true, svg: `${jungle(71)}${[[120, 1130], [880, 1100]].map(([x, y]) => `<g transform="translate(${x} ${y}) scale(1.5)">${[[-40, -170], [30, -190], [0, -130], [-70, -120], [60, -140]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="10" fill="#e63946" stroke="#7a1a22" stroke-width="2"/>`).join('')}</g>`).join('')}` },
    G(N13, 'pl', 'plentiful', { x: 500, y: 1180, svg: `${[-300, 0, 300].map((x, i) => `<g transform="translate(${x} 0) scale(1.3)" ${an('bob', 1.6, i * .3)}>${apeSvg()}</g>`).join('')}${tag(0, 80, 'FRUIT EVERYWHERE  ·  TREES ARE SAFE', 34)}` }),
    G(N13, 'pr', 'pressure', { x: 500, y: 330, svg: `<line x1="-250" y1="-80" x2="-250" y2="-10" stroke="#5a3b22" stroke-width="8"/><line x1="250" y1="-80" x2="250" y2="-10" stroke="#5a3b22" stroke-width="8"/><rect x="-330" y="-10" width="660" height="150" rx="14" fill="#a07848" stroke="#4a3220" stroke-width="8"/>${T(0, 50, 'THE OLD WAY', 54, '#fff')}${T(0, 112, 'STILL WORKS', 54, '#ffe9a0')}` }),
    G(N13, 'si', 'sieve', { x: 500, y: 640, svg: `${box0(0, 0, 860, 230).replace('fill="#fff"', 'fill="rgba(255,255,255,.88)"')}<g transform="translate(-300 20) scale(1.1)">${shark}</g><g transform="translate(-20 20) scale(.9)">${croc}</g><g transform="translate(250 -10)"><rect x="-60" y="-12" width="120" height="26" rx="6" fill="#6a5a44"/><circle cx="0" cy="42" r="22" fill="#3aa655"/><path d="M-16 42 l12 12 l22 -24" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/></g>${T(0, 100, 'SHARKS AND CROCODILES: STILL ALMOST THE SAME FOR AGES', 24, '#231b12')}` }),
    G(N13, 'ev', 'evolve', { x: 500, y: 880, svg: `<g ${an('wobble', .7)}>${sfx(0, 0, 'EVOLVE OR DIE?  NOT QUITE!', -2, '#ffd23f', 54, '#14502d')}</g>` }),
    G(N13, 'su', 'survive', { x: 500, y: 1420, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'SURVIVE + HAVE CHILDREN', -2, '#fff', 56, '#14502d')}</g>` })
], '#2e8b4a');

// ── 14 THE SAVANNA GROUP CHANGES ────────────────────────────────
const N14 = "The other group faced a different challenge. In open land, fruit trees were far apart, and tall grass hid danger. Scientists think that standing upright helped these apes see farther, and travel using less energy. Those who did this a little better survived more often, and passed on their bodies. Over millions of years, step by step, walking apes appeared.";
SCN(N14, '14 - LIFE IN THE OPEN LAND', [
    { id: 'bg', always: true, svg: `${savanna(81)}${acacia(180, 1180, 1.6)}${acacia(820, 1160, 1.3)}${grass(70, 5, 1180, 1500, '#8a6a2a')}` },
    G(N14, 'op', 'open', { x: 500, y: 200, svg: tag(0, 0, 'OPEN LAND  ·  TREES FAR APART', 36) }),
    G(N14, 'da', 'danger', { x: 500, y: 1330, svg: `${[[-300, 0], [-120, 30], [260, 0]].map(([x, y], i) => `<g ${an('blink', 1.6 + i * .4, i * .5, 'center', '--dir:normal;')}><circle cx="${x - 14}" cy="${y}" r="8" fill="#ffd23f"/><circle cx="${x + 14}" cy="${y}" r="8" fill="#ffd23f"/></g>`).join('')}${tag(0, -80, 'TALL GRASS HIDES DANGER', 34, '#fff', 'rgba(120,30,30,.8)')}` }),
    G(N14, 'up', 'upright', { x: 500, y: 1130, svg: `<g transform="scale(2.1)">${apeSvg('#8a6a44', '#e6c08a')}</g><path d="M60 -300 L560 -380 M60 -300 L560 -250" stroke="#fff" stroke-width="5" stroke-dasharray="12 10" opacity=".8"/>${tag(0, 70, 'STANDING UPRIGHT: SEE FARTHER', 32)}` }),
    G(N14, 'sv', 'survived', { x: 500, y: 330, svg: `${tag(0, 0, 'SURVIVED A LITTLE MORE OFTEN', 34, '#fff', 'rgba(30,110,60,.85)')}` }),
    G(N14, 'wk', 'walking', { x: 500, y: 460, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'WALKING APES APPEAR!', -2, '#b5402c', 56, '#fff')}</g>` })
], '#c8702a');

// ── 15 BOTH CHANGED (blueprint) ─────────────────────────────────
const N15 = "And remember, the forest group did not freeze in time. Chimpanzees and bonobos have been evolving for six million years too. They are not our ancestors. They are not the past. They are today's cousins, shaped by their own world, just as we were shaped by ours.";
SCN(N15, '15 - BOTH KEPT CHANGING', [
    { id: 'bg', always: true, svg: `${bpBg()}${dr('M20 20 H980 V1440 H20Z', 0, 2, 4)}${M(500, 130, 'FIG. 15 - TWO LINES, BOTH EVOLVING', 28, BH)}<circle cx="150" cy="780" r="44" fill="none" stroke="${BH}" stroke-width="7"/><g transform="translate(150 790) scale(.55)">${apeSvg('#8a6a44', '#e6c08a')}</g>${M(150, 870, 'ANCIENT APE', 24, '#fff')}${M(150, 900, '6-7 MYA', 22, BS)}<line x1="860" y1="320" x2="860" y2="1240" stroke="${BH}" stroke-width="4" stroke-dasharray="14 10"/>${M(860, 290, 'TODAY', 28, BH)}` },
    G(N15, 'ch', 'chimpanzees', { svg: `${dr('M195 770 C400 700 600 560 820 540', 0, 2.2, 8, '#ffb36b')}<g transform="translate(860 560) scale(.9)">${apeSvg()}</g>${tag(700, 400, 'CHIMPANZEES + BONOBOS', 28, '#fff', 'rgba(255,179,107,.35)')}` }),
    G(N15, 'ev', 'evolving', { svg: [[320, 722], [460, 662], [600, 592], [320, 840], [460, 900], [600, 960]].map(([x, y], i) => `<g ${an('pulse', 1.2, i * .2)}><circle cx="${x}" cy="${y}" r="16" fill="${BH}" stroke="${DB}" stroke-width="5"/></g>`).join('') + tag(500, 1160, 'BOTH EVOLVING FOR ~6 MILLION YEARS', 30, DB, BH) }),
    G(N15, 'an', 'ancestors', { x: 500, y: 330, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'NOT OUR ANCESTORS!', -3, '#ff9d9d', 56, DB)}</g>` }),
    G(N15, 'co', 'cousins', { x: 560, y: 470, svg: tag(0, 0, "TODAY'S COUSINS", 34, DB, '#6dff9c') }),
    G(N15, 'ou', 'ours', { svg: `${dr('M195 790 C400 880 600 1000 820 1040', 0, 2.2, 8, '#7fe0ff')}<g transform="translate(860 1060) scale(.9)">${humanSvg()}</g>${tag(700, 1230, 'HUMANS', 30, '#fff', 'rgba(127,224,255,.35)')}` })
], '#0f3d7a');

// ── 16 TREE, NOT LADDER (blueprint) ─────────────────────────────
const N16 = "So evolution is not a ladder, with apes at the bottom and humans at the top. It is a branching tree. Every living species sits at the tip of its own branch. Orangutans, gorillas, chimpanzees, bonobos and people are all great apes. Yes, you are an ape. You did not come from today's apes. You are one of them.";
const tipIcon = (x, kind) => `<g transform="translate(${x} 560) scale(.8)">${kind === 'h' ? humanSvg() : kind === 'o' ? apeSvg('#b5562a', '#e0a070') : kind === 'g' ? apeSvg('#2a2a2e', '#6a6a72') : apeSvg()}</g>`;
SCN(N16, '16 - A TREE, NOT A LADDER', [
    { id: 'bg', always: true, svg: `${bpBg()}${dr('M20 20 H980 V1440 H20Z', 0, 2, 4)}${M(500, 130, 'FIG. 16 - THE GREAT APE FAMILY TREE', 28, BH)}` },
    G(N16, 'ld', 'ladder', { hw: 'tree', ht: A(N16, 'tree'), svg: `<g transform="translate(500 760)"><rect x="-130" y="-380" width="14" height="760" fill="${BL}"/><rect x="116" y="-380" width="14" height="760" fill="${BL}"/>${Array.from({ length: 9 }, (_, i) => `<rect x="-116" y="${-340 + i * 85}" width="232" height="12" fill="${BL}"/>`).join('')}<g transform="translate(0 380) scale(.9)">${apeSvg()}</g><g transform="translate(0 -300) scale(.9)">${humanSvg()}</g><path d="M-190 -330 L190 330 M190 -330 L-190 330" stroke="#ff4d4d" stroke-width="18" stroke-linecap="round"/></g>${sfx(500, 1250, 'NOT A LADDER!', -2, '#ff9d9d', 70, DB)}` }),
    G(N16, 'tr', 'tree', { svg: `${dr('M500 1350 V1000', 0, 1.2, 12)}${dr('M500 1000 C400 940 130 900 130 590', .4, 1.6, 10)}${dr('M500 1000 V820', .4, 1, 12)}${dr('M500 820 C420 770 330 740 330 590', .8, 1.4, 10)}${dr('M500 820 V660', .8, .8, 12)}${dr('M500 660 C520 620 570 620 570 590', 1.2, 1, 10)}${dr('M500 660 C620 650 840 700 840 590', 1.2, 1.2, 10)}<circle cx="500" cy="660" r="20" fill="${BH}" stroke="${DB}" stroke-width="5"/>${M(500, 1400, '~15 MYA', 22, BS)}${M(430, 1010, '~13-16 MYA', 20, BS, 'end')}${M(400, 830, '~8-9 MYA', 20, BS, 'end')}${M(640, 690, '6-7 MYA', 22, BH, 'start')}` }),
    G(N16, 'o', 'orangutans', { svg: `${tipIcon(130, 'o')}${M(130, 640, 'ORANGUTANS', 22, '#fff')}` }),
    G(N16, 'g', 'gorillas', { svg: `${tipIcon(330, 'g')}${M(330, 640, 'GORILLAS', 22, '#fff')}` }),
    G(N16, 'c', 'chimpanzees', { svg: `${tipIcon(570, 'c')}${M(570, 640, 'CHIMPS + BONOBOS', 20, '#fff')}` }),
    G(N16, 'h', 'people', { svg: `${tipIcon(840, 'h')}${M(840, 640, 'HUMANS', 22, '#fff')}` }),
    G(N16, 'ap', 'ape', { x: 500, y: 1180, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'YOU ARE AN APE!', -2, '#ffd23f', 76, DB)}</g>${M(0, 70, 'a branch of the same family, not a descendant of the others', 22, '#fff')}` })
], '#0f3d7a');

// ── 17 THE EVIDENCE (blueprint) ─────────────────────────────────
const N17 = "How do we know? First, DNA. Humans and chimpanzees share about ninety eight percent of their DNA. Second, fossils, like Lucy, who walked upright about three million years ago, with a brain about the size of a chimpanzee's. Third, a clue hiding in our cells. Other apes have forty eight chromosomes. We have forty six, because two ape chromosomes fused into one, and the join is still visible.";
const helix = (() => { let a = '', b = '', r = ''; for (let y = -110; y <= 110; y += 6) { const x = Math.sin(y / 18) * 44; a += `${y === -110 ? 'M' : 'L'}${x.toFixed(1)} ${y} `; b += `${y === -110 ? 'M' : 'L'}${(-x).toFixed(1)} ${y} `; if (y % 24 === 0) r += `<line x1="${x.toFixed(1)}" y1="${y}" x2="${(-x).toFixed(1)}" y2="${y}" stroke="${BS}" stroke-width="4"/>`; } return `<path d="${a}" fill="none" stroke="#ff9d9d" stroke-width="7"/><path d="${b}" fill="none" stroke="#7fe0ff" stroke-width="7"/>${r}`; })();
const chromo = (x, y, h, c) => `<rect x="${x - 14}" y="${y - h / 2}" width="28" height="${h}" rx="14" fill="${c}" stroke="#fff" stroke-width="4"/><circle cx="${x}" cy="${y}" r="7" fill="#fff"/>`;
SCN(N17, '17 - HOW DO WE KNOW?', [
    { id: 'bg', always: true, svg: `${bpBg()}${dr('M20 20 H980 V1440 H20Z', 0, 2, 4)}${M(500, 130, 'FIG. 17 - THREE LINES OF EVIDENCE', 28, BH)}` },
    G(N17, 'e1', 'dna', { x: 500, y: 370, svg: `<rect x="-440" y="-130" width="880" height="260" rx="16" fill="rgba(255,255,255,.07)" stroke="${BS}" stroke-width="5"/><g transform="translate(-320 0)" ${an('pulse', 2)}>${helix}</g>${T(-190, -30, '1. DNA', 54, BH, 'start')}${M(-190, 30, 'humans + chimps share', 26, '#fff', 'start')}${sfx(250, 20, '~98%', -3, '#6dff9c', 90, DB)}` }),
    G(N17, 'e2', 'fossils', { x: 500, y: 790, svg: `<rect x="-440" y="-170" width="880" height="340" rx="16" fill="rgba(255,255,255,.07)" stroke="${BS}" stroke-width="5"/>${T(-410, -90, '2. FOSSILS', 46, BH, 'start')}${M(-410, -50, 'LUCY: 3.2 MILLION YEARS OLD', 24, '#fff', 'start')}<g transform="translate(-300 120) scale(.8)">${apeSvg('#d8c8a8', '#efe0c0')}</g>` }),
    G(N17, 'lu', 'lucy', { x: 500, y: 790, svg: `${M(110, -80, 'BRAIN SIZE (cc)', 24, BH)}${[['CHIMP', 400, '#ffb36b'], ['LUCY', 450, '#6dff9c'], ['HUMAN', 1350, '#7fe0ff']].map(([l, v, c], i) => `${M(-30, -30 + i * 64 + 8, l, 22, '#fff', 'end')}<g ${an('growx', 1.2, i * .3, 'left')}><rect x="-14" y="${-52 + i * 64}" width="${v / 4}" height="40" rx="8" fill="${c}"/></g>${M(-4 + v / 4 + 14, -22 + i * 64, String(v), 22, '#fff', 'start')}`).join('')}${M(110, 150, 'walked upright, ape-sized brain', 22, BS)}` }),
    G(N17, 'e3', 'clue', { x: 500, y: 1210, svg: `<rect x="-440" y="-170" width="880" height="340" rx="16" fill="rgba(255,255,255,.07)" stroke="${BS}" stroke-width="5"/>${T(-410, -90, '3. A CLUE IN OUR CELLS', 44, BH, 'start')}` }),
    G(N17, 'ch', 'chromosomes', { x: 500, y: 1240, svg: `${chromo(-230, -10, 90, '#ffb36b')}${chromo(-170, -10, 80, '#ffb36b')}${M(-200, 70, 'OTHER APES: 48', 22, '#fff')}${chromo(250, -10, 150, '#7fe0ff')}${M(250, 100, 'HUMANS: 46', 22, '#fff')}` }),
    G(N17, 'fu', 'fused', { x: 500, y: 1240, svg: `${arrow(-100, -20, 130, -20, BH, 8)}${sfx(10, -70, 'FUSED!', -4, '#6dff9c', 50, DB)}<g ${an('pulse', .9)}><circle cx="250" cy="-10" r="22" fill="none" stroke="${BH}" stroke-width="6"/></g>${M(380, -10, 'the join is visible', 20, BS, 'start')}` })
], '#0f3d7a');

// ── 18 THE ANSWER ───────────────────────────────────────────────
const N18 = "So, why are there still apes? Because humans did not come from today's apes. We share an ancestor, and that ancestor's family branched. One branch stayed in the forest, and kept thriving. Another changed in the open land. Evolution does not force everyone to change. It only filters. And two cousins can both survive.";
SCN(N18, '18 - THE ANSWER', [
    { id: 'bg', always: true, svg: `${bg([[0, '#2a3a5a'], [1, '#1a2a44']])}<rect x="${X0}" y="640" width="560" height="${Y1 - 640}" fill="#2f7a45"/><rect x="500" y="640" width="${X1 - 500}" height="${Y1 - 640}" fill="#d8b45a"/>${hills(900, '#1f5a35', 60, 91, .9).replace(`${X1} `, '500 ')}${[100, 300].map(x => jt(x, 1150, 1.2, '#14502d', '#1f6b3a')).join('')}${acacia(780, 1150, 1.1)}${acacia(930, 1200, .9)}` },
    G(N18, 'an', 'ancestor', { x: 500, y: 330, svg: `<g ${an('pulse', 1.6)}>${glow(0, -100, 240, '#fff6c0', .8)}</g><g transform="scale(1.3)">${apeSvg('#8a6a44', '#e6c08a')}</g>${tag(0, 70, 'COMMON ANCESTOR', 36)}` }),
    G(N18, 'br', 'branched', { svg: `<path d="M500 420 C500 520 300 540 280 700" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" ${an('flow dash', 1)}/><path d="M500 420 C500 520 720 540 740 700" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round" ${an('flow dash', 1)}/>` }),
    G(N18, 'fo', 'forest', { x: 250, y: 1150, svg: `<g transform="scale(1.5)">${apeSvg()}</g>${tag(0, 70, 'STAYED + THRIVED', 34, '#fff', 'rgba(20,80,45,.9)')}` }),
    G(N18, 'op', 'open', { x: 750, y: 1150, svg: `<g transform="scale(1.5)">${humanSvg()}</g>${tag(0, 70, 'CHANGED IN THE OPEN', 30, '#fff', 'rgba(150,110,30,.9)')}` }),
    G(N18, 'fi', 'filters', { x: 500, y: 880, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'EVOLUTION ONLY FILTERS', -2, '#ffd23f', 52, '#1a2a44')}</g>` }),
    G(N18, 'co', 'cousins', { x: 500, y: 1400, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'TWO COUSINS, BOTH ALIVE!', -2, '#fff', 58, '#1a2a44')}</g>` })
], '#2c6b5a');

// ── 19 YOUR FAMILY TREE ─────────────────────────────────────────
const N19 = "From a cloud of dust, to a planet, to oceans, to cells, to fish, to mammals, to apes, to you. Your family tree is four and a half billion years long. And remember: no one comes from their cousin. Subscribe for more stories of the Earth.";
const ZZ = [[220, 320], [740, 470], [260, 620], [740, 770], [260, 920], [740, 1070], [260, 1220], [740, 1370]];
const ico = [
    () => `${glow(0, 0, 70, '#ff5fa2', .7)}${glow(20, 10, 60, '#3a7bff', .6)}`,
    () => earthIcon(48),
    () => `<path d="M-50 -6 q16 -20 32 0 t32 0 t32 0 M-50 20 q16 -20 32 0 t32 0 t32 0" fill="none" stroke="#4dd0ff" stroke-width="8" stroke-linecap="round"/>`,
    () => cell(0, 0, 36, '#6dff9c', '#fff'),
    () => fish(0, 0, 1.1, '#ffb04d'),
    () => `<g transform="scale(.7) translate(10 20)">${shrew(1)}</g>`,
    () => `<g transform="scale(.5) translate(0 80)">${apeSvg()}</g>`,
    () => `<g transform="scale(.5) translate(0 80)">${humanSvg()}</g>`
];
const ZL = ['CLOUD', 'PLANET', 'OCEANS', 'CELLS', 'FISH', 'MAMMALS', 'APES', 'YOU'], ZW = ['cloud', 'planet', 'oceans', 'cells', 'fish', 'mammals', 'apes', 'you'];
SCN(N19, 'YOUR 4.5 BILLION YEAR FAMILY TREE', [
    { id: 'bg', always: true, svg: `${bg([[0, '#02020a'], [1, '#0f1a44']])}${stars2(100, 33, -260, 1600)}<path d="${ZZ.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="6" stroke-dasharray="12 12"/>` },
    ...ZZ.map(([x, y], i) => G(N19, 'z' + i, ZW[i], { x, y, svg: `<circle r="78" fill="rgba(255,255,255,.1)" stroke="#fff" stroke-width="5"/>${ico[i]()}${tag(0, 120, ZL[i], 30)}` })),
    G(N19, 'tr', 'tree', { x: 500, y: 1520, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'NO ONE COMES FROM THEIR COUSIN', -2, '#ffd23f', 40, '#0f1a44')}</g>` }),
    G(N19, 'sub', 'subscribe', { x: 500, y: 1620, svg: `<g ${an('pulse', .8)}><rect x="-210" y="-44" width="420" height="88" rx="18" fill="#b5402c" stroke="#fff" stroke-width="6"/>${T(0, 20, 'SUBSCRIBE', 54, '#fff')}</g>` })
], '#b5402c');

// ── export ──────────────────────────────────────────────────────
const TRANS = ['fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left', 'fade', 'fade'];
module.exports = {
    output: { title: 'why-are-there-still-apes', format: SETTINGS.FORMAT, fps: SETTINGS.FPS, crf: SETTINGS.CRF, preset: SETTINGS.PRESET },
    defaults: { voice: SETTINGS.VOICE, speed: SETTINGS.SPEED, transition: 'fade', transitionDuration: SETTINGS.TRANSITION_SECONDS },
    scenes: S.map((s, i) => Object.assign(s, { transition: TRANS[i] || 'fade' })),
};