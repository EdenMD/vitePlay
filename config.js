// config.black-box-story.js
// "Airplane Black Boxes: Why They Exist, What's Inside, How They Survive" — APEX Video Engine config
// Blueprint style (same engine as the solar / photonic configs). Voice: am_adam. No story character.
// 13 scenes: hook -> the problem -> invention -> FDR -> CVR -> loop memory -> together -> orange+tail -> construction
//            -> torture tests A -> tests B + beacon -> recovery -> future

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

// ── helpers for this video ──────────────────────────────────────
// trigger time is computed from the narration itself (index of the word / 2.9 words per sec); throws if the word is missing
const A = (txt, word) => { const ws = txt.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/); const i = ws.indexOf(word); if (i < 0) throw new Error('trigger "' + word + '" not in: ' + txt.slice(0, 40)); return +(i / 2.9).toFixed(1); };
const G = (txt, id, w, extra) => Object.assign({ id, w, t: A(txt, w) }, extra);
const BC = (w, h, x = 0, y = 0) => `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="14" fill="rgba(255,255,255,.07)" stroke="${THEME.bpSoft}" stroke-width="5"/>`;
const FR = (txt, w, title) => G(txt, 'fr', w, { svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 130, title, 28, THEME.bpHi)}` });
const ORANGE = '#ff7a1a';
const rec = (w, h) => `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="14" fill="${ORANGE}" stroke="#fff" stroke-width="6"/><rect x="${-w / 2 + 14}" y="${-h / 2}" width="16" height="${h}" fill="#fff" opacity=".85"/><rect x="${w / 2 - 30}" y="${-h / 2}" width="16" height="${h}" fill="#fff" opacity=".85"/>${T(0, h * .08, 'FLIGHT RECORDER', Math.round(w / 12), '#231b12')}`;
const PLANE = 'M-330 0 Q-330 -45 -250 -48 H230 L330 -110 H380 L350 -40 Q380 -20 380 0 Q380 25 340 38 H-250 Q-330 38 -330 0Z';
const WING = 'M-30 38 L90 140 H150 L70 38Z';
const planeBP = (dl = 0) => `${dr(PLANE, dl, 2, 5)}${dr(WING, dl + .4, 1.2, 5)}${[-250, -190, -130, -70, -10, 50, 110].map(x => `<circle cx="${x}" cy="-10" r="9" fill="none" stroke="${THEME.bpLine}" stroke-width="3"/>`).join('')}`;
const eq = (n, w, col, seed) => { const r = rng(seed); let o = ''; for (let i = 0; i < n; i++) { const a = 12 + r() * 18, b = 30 + r() * 50, c = 14 + r() * 40, d = (.7 + r() * .6).toFixed(2); o += `<rect x="${i * (w + 8)}" y="${-a / 2}" width="${w}" height="${a}" rx="3" fill="${col}"><animate attributeName="height" values="${a};${b};${c};${a}" dur="${d}s" repeatCount="indefinite"/><animate attributeName="y" values="${-a / 2};${-b / 2};${-c / 2};${-a / 2}" dur="${d}s" repeatCount="indefinite"/></rect>`; } return o; };
const flame = `<path d="M0 -50 Q40 -10 20 30 Q10 50 0 50 Q-30 50 -30 20 Q-30 0 -10 -20 Q-5 -5 0 -50Z" fill="${ORANGE}" stroke="#fff" stroke-width="4"/><path d="M0 -10 Q16 10 8 30 Q0 40 -8 30 Q-14 14 0 -10Z" fill="#ffd23f"/>`;
const wavesIcon = `<path d="M-60 -10 q20 -20 40 0 t40 0 t40 0 M-60 20 q20 -20 40 0 t40 0 t40 0" fill="none" stroke="#4dd0ff" stroke-width="8" stroke-linecap="round" ${an('flow dash', 1)}/>`;
const tcard = (icon, t1, t2, col = THEME.bpHi) => `${BC(880, 300)}<g transform="translate(-330 0)">${icon}</g>${T(-170, -20, t1, 46, col, 'start')}${M(-170, 40, t2, 26, '#fff', 'start')}`;

// ── 0 HOOK ──────────────────────────────────────────────────────
const N0 = "When a plane crashes, the wreckage cannot tell you what happened. But one small box can. It is not even black. It is bright orange, and it survives fire, crushing, and the deep sea. Here is why it exists, what is inside, and how it is built to outlive the crash.";
S.push(scene('#050818', N0, comicScene({ badge: 'THE BLACK BOX', theme: 'night', groups: [
  { id: 'stars', always: true, svg: stars(50, 71) },
  G(N0, 'pl', 'plane', { x: 500, y: 290, svg: `<path d="M-460 20 H-380 M-480 60 H-390" stroke="#fff" stroke-width="5" stroke-dasharray="14 12" opacity=".5" ${an('flow', .6)}/><g ${an('float', 2.4)}><g transform="scale(.7)"><path d="${PLANE}" fill="#fff" stroke="#8fbcff" stroke-width="6"/><path d="${WING}" fill="#cfd6de" stroke="#8fbcff" stroke-width="6"/></g></g>` }),
  G(N0, 'wr', 'wreckage', { x: 500, y: 540, svg: sfx(0, 0, "WRECKAGE CAN'T TALK", -2, '#ff9d9d', 58, '#050818') }),
  G(N0, 'bx', 'box', { x: 500, y: 820, svg: `<g ${an('pulse', 1)}><ellipse rx="200" ry="130" fill="rgba(255,122,26,.25)"/></g>${rec(270, 150)}` }),
  G(N0, 'nb', 'black', { x: 500, y: 1010, svg: sfx(0, 0, 'NOT BLACK!', -3, '#ffd23f', 88, '#050818') }),
  G(N0, 'f1', 'fire', { x: 200, y: 1210, svg: `${BC(240, 200)}<g transform="translate(0 -20)">${flame}</g>${T(0, 76, 'FIRE', 38, '#fff')}` }),
  G(N0, 'f2', 'crushing', { x: 500, y: 1210, svg: `${BC(240, 200)}<g transform="translate(0 -20)"><rect x="-44" y="-56" width="88" height="16" fill="#aab3bd"/><rect x="-44" y="40" width="88" height="16" fill="#aab3bd"/><rect x="-26" y="-22" width="52" height="40" rx="6" fill="${ORANGE}"/><path d="M0 -76 V-60 M-10 -68 L0 -58 L10 -68 M0 76 V60 M-10 68 L0 58 L10 68" stroke="#ffd23f" stroke-width="5" fill="none"/></g>${T(0, 76, 'CRUSHING', 34, '#fff')}` }),
  G(N0, 'f3', 'deep', { x: 800, y: 1210, svg: `${BC(240, 200)}<g transform="translate(0 -20)">${wavesIcon}<rect x="-20" y="26" width="40" height="22" rx="4" fill="${ORANGE}"/></g>${T(0, 76, 'DEEP SEA', 34, '#fff')}` }),
  G(N0, 'ex', 'exists', { x: 500, y: 1400, svg: T(0, 0, 'WHY IT EXISTS · WHAT IT HOLDS · HOW IT SURVIVES', 30, '#8fbcff') })
]})));

// ── 1 THE PROBLEM ───────────────────────────────────────────────
const N1 = "Before the nineteen fifties, an investigator had only twisted wreckage and what witnesses remembered. Then in nineteen fifty four, the Comet, the world's first jet airliner, suffered a series of crashes, with clues scattered across sea and land. Investigators needed the aircraft's own record of its last minutes.";
S.push(scene('#0f3d7a', N1, comicScene({ badge: '1 - WHY THEY WERE MADE', theme: 'blue', groups: [
  FR(N1, 'before', 'FIG. 1 - THE PROBLEM'),
  G(N1, 'wk', 'wreckage', { x: 300, y: 380, svg: `${dr('M-200 40 L-120 -40 L-60 20 L20 -70 L60 10 L140 -30 L200 50Z', 0, 1.6, 6)}${dr('M-160 70 H120 M-100 -40 L-60 -90', .6, 1, 5, THEME.bpSoft)}${M(0, 130, 'TWISTED WRECKAGE', 28, '#fff')}` }),
  G(N1, 'wt', 'witnesses', { x: 760, y: 400, svg: ['"I SAW SMOKE..."', '"A LOUD BANG?"', '"I THINK... MAYBE"'].map((t, i) => `<g transform="translate(${i % 2 ? 20 : -20} ${i * 80 - 60})">${BC(300, 60)}${M(0, 8, t, 22, '#fff')}</g>`).join('') + M(0, 190, 'WHAT WITNESSES REMEMBER', 26, THEME.bpHi) }),
  G(N1, 'cm', 'comet', { x: 500, y: 800, svg: `<g transform="scale(.55)">${planeBP(0)}</g>${sfx(0, 120, '1954: THE COMET', -2, THEME.bpHi, 56, '#0f3d7a')}${M(0, 170, 'first jet airliner, a series of crashes', 24, '#fff')}` }),
  G(N1, 'sc', 'scattered', { x: 500, y: 1120, svg: `<rect x="-380" y="-110" width="760" height="220" rx="14" fill="rgba(77,208,255,.18)" stroke="${THEME.bpSoft}" stroke-width="5"/><path d="M-380 -110 H-60 Q-120 -20 -200 10 Q-280 60 -380 40Z" fill="rgba(120,200,120,.25)" stroke="${THEME.bpLine}" stroke-width="4"/>${[[-280, -50], [-150, 0], [60, -40], [160, 40], [280, -10], [-60, 70], [250, 80]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="9" fill="#ff6b6b" ${an('twinkle', 1, i * .2)}/>`).join('')}${M(0, 150, 'CLUES SCATTERED ACROSS SEA AND LAND', 24, THEME.bpHi)}` }),
  G(N1, 'rc', 'record', { x: 500, y: 1370, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, "NEEDED: THE PLANE'S OWN RECORD", -2, '#fff', 44, '#0f3d7a')}</g>` })
]})));

// ── 2 THE INVENTION (timeline) ──────────────────────────────────
const N2 = "In the mid nineteen fifties, an Australian scientist named David Warren asked a simple question. What if a plane could record its own final moments? His prototype captured instrument readings and cockpit voices in one small crash proof unit. Over the following years, countries began requiring flight recorders on airliners.";
const node = (y, yr, d1, d2) => `<circle cx="200" cy="${y}" r="20" fill="${THEME.bpHi}" stroke="#0f3d7a" stroke-width="6"/>${M(260, y - 12, yr, 34, THEME.bpHi, 'start')}${M(260, y + 28, d1, 24, '#fff', 'start')}${d2 ? M(260, y + 60, d2, 24, THEME.bpSoft, 'start') : ''}`;
S.push(scene('#0f3d7a', N2, comicScene({ badge: '2 - THE INVENTION', theme: 'blue', groups: [
  FR(N2, 'mid', 'FIG. 2 - TIMELINE'),
  G(N2, 'ln', 'nineteen', { svg: dr('M200 260 V1260', 0, 2.6, 8, THEME.bpLine) }),
  G(N2, 'n1', 'fifties', { svg: node(300, '1954', 'THE COMET CRASHES', 'investigators have no record') }),
  G(N2, 'n2', 'warren', { svg: node(560, 'MID-1950s', 'DAVID WARREN, AUSTRALIAN SCIENTIST', '') }),
  G(N2, 'q', 'record', { x: 590, y: 700, svg: `${BC(640, 90)}${M(0, 10, '"WHAT IF THE PLANE RECORDED ITSELF?"', 26, THEME.bpHi)}` }),
  G(N2, 'n3', 'prototype', { svg: node(860, 'PROTOTYPE', 'DATA + COCKPIT VOICES', 'in one small crash-proof unit') + `<g transform="translate(800 880) scale(.5)">${rec(160, 90)}</g>` }),
  G(N2, 'n4', 'requiring', { svg: node(1120, '1950s - 1960s', 'COUNTRIES START REQUIRING', 'recorders on airliners') + `<path d="M820 1110 l24 28 l50 -60" fill="none" stroke="#6dff9c" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>` })
]})));

// ── 3 FLIGHT DATA RECORDER ──────────────────────────────────────
const N3 = "The flight data recorder is the plane's fitness tracker. Many times every second, it logs altitude, airspeed, heading, engine power, and every move the pilots make on the controls. Modern aircraft record hundreds to thousands of separate readings.";
const strip = (id, w, y, label, path, col) => G(N3, id, w, { x: 0, y, svg: `${BC(840, 110, 500, 0)}${M(70, 8, label, 24, col, 'start')}<g transform="translate(400 0)"><path d="${path}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" ${an('flow dash', .9)}/></g>` });
S.push(scene('#0f3d7a', N3, comicScene({ badge: '3 - THE DATA RECORDER', theme: 'blue', groups: [
  { id: 'fr', svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 130, 'FIG. 3 - FLIGHT DATA RECORDER (FDR)', 28, THEME.bpHi)}`, w: 'flight', t: .3 },
  G(N3, 'tr', 'tracker', { x: 500, y: 330, svg: `<rect x="-90" y="-45" width="180" height="90" rx="22" fill="#1c2630" stroke="${THEME.bpLine}" stroke-width="6"/><polyline points="-60,5 -35,5 -22,-25 -5,28 12,-8 24,5 60,5" fill="none" stroke="#ff6b6b" stroke-width="6" stroke-linejoin="round" ${an('flow dash', .7)}/>${M(0, 90, "THE PLANE'S FITNESS TRACKER", 28, THEME.bpHi)}` }),
  strip('s1', 'altitude', 520, 'ALTITUDE', 'M0 25 C120 25 160 -25 300 -25 S440 -25 520 -25', '#7fe0ff'),
  strip('s2', 'airspeed', 660, 'AIRSPEED', 'M0 15 C80 15 100 -20 200 -20 S300 20 360 0 S460 -20 520 -10', '#6dff9c'),
  strip('s3', 'heading', 800, 'HEADING', 'M0 25 H120 V0 H260 V-25 H400 V10 H520', THEME.bpHi),
  strip('s4', 'engine', 940, 'ENGINE POWER', 'M0 0 q30 -35 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0', '#ffb36b'),
  strip('s5', 'controls', 1080, 'PILOT CONTROLS', 'M0 20 L40 20 L55 -28 L70 28 L100 20 L180 20 L200 -28 L215 32 L260 20 H340 L360 -18 L380 28 L420 20 H520', '#ff9d9d'),
  G(N3, 'th', 'thousands', { x: 500, y: 1290, svg: `<g ${an('pulse', .8)}>${sfx(0, 0, '1,000s OF READINGS', -2, THEME.bpHi, 62, '#0f3d7a')}</g>${M(0, 60, 'many times every second', 26, '#fff')}` })
]})));

// ── 4 COCKPIT VOICE RECORDER ────────────────────────────────────
const N4 = "The cockpit voice recorder is the plane's voicemail. Microphones capture the pilots' voices, radio calls, alarms, and even engine sounds. Together, these reveal what the crew heard, said, and understood in the final minutes.";
const snd = (id, w, x, label, col, seed) => G(N4, id, w, { x, y: 1080, svg: `${BC(190, 200)}<g transform="translate(-72 -10)">${eq(8, 10, col, seed)}</g>${M(0, 70, label, 22, '#fff')}` });
S.push(scene('#0f3d7a', N4, comicScene({ badge: '4 - THE VOICE RECORDER', theme: 'blue', groups: [
  { id: 'fr', w: 'cockpit', t: .3, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 130, 'FIG. 4 - COCKPIT VOICE RECORDER (CVR)', 28, THEME.bpHi)}` },
  G(N4, 'vm', 'voicemail', { x: 500, y: 330, svg: `<rect x="-90" y="-55" width="180" height="110" rx="10" fill="rgba(255,255,255,.1)" stroke="${THEME.bpLine}" stroke-width="6"/><path d="M-90 -55 L0 15 L90 -55" fill="none" stroke="${THEME.bpLine}" stroke-width="6"/><circle cx="64" cy="48" r="26" fill="${THEME.bpHi}" stroke="#0f3d7a" stroke-width="5"/><polygon points="56,36 56,60 78,48" fill="#0f3d7a"/>${M(-120, 8, 'VOICEMAIL', 26, '#fff', 'end')}${M(120, 8, 'FROM THE COCKPIT', 24, THEME.bpHi, 'start')}` }),
  G(N4, 'ck', 'microphones', { x: 500, y: 670, svg: `${dr('M-300 100 L-240 -120 H240 L300 100Z', 0, 1.6, 6)}${[-130, 130].map(x => `<rect x="${x - 40}" y="10" width="80" height="70" rx="12" fill="none" stroke="${THEME.bpLine}" stroke-width="5"/>`).join('')}${[[-130, -20, 'CAPTAIN'], [130, -20, 'FIRST OFFICER'], [0, -170, 'AREA MIC']].map(([x, y, l]) => `<circle cx="${x}" cy="${y}" r="16" fill="${ORANGE}" stroke="#fff" stroke-width="4"/>${[26, 42].map(r => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${THEME.bpHi}" stroke-width="3" ${an('ring', 1.6, r / 40, 'center', '--dir:normal;')}/>`).join('')}${M(x, y + (y < -100 ? -60 : 130), l, 22, '#fff')}`).join('')}` }),
  snd('c1', 'voices', 150, 'VOICES', '#7fe0ff', 3),
  snd('c2', 'radio', 370, 'RADIO CALLS', '#6dff9c', 4),
  snd('c3', 'alarms', 590, 'ALARMS', '#ff9d9d', 5),
  snd('c4', 'engine', 810, 'ENGINE SOUND', '#ffb36b', 6),
  G(N4, 'fm', 'final', { x: 500, y: 1290, svg: sfx(0, 0, 'WHAT THE CREW HEARD AND SAID', -2, '#fff', 46, '#0f3d7a') })
]})));

// ── 5 THE LOOP (dashcam) ────────────────────────────────────────
const N5 = "Both recorders work like a dashcam on a loop. When the memory is full, the newest data overwrites the oldest. So the box always holds the most recent stretch of the flight: at least the last two hours of voice, and at least the last twenty five hours of flight data.";
S.push(scene('#0f3d7a', N5, comicScene({ badge: '5 - THE ENDLESS LOOP', theme: 'blue', groups: [
  { id: 'fr', w: 'both', t: .3, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 130, 'FIG. 5 - LOOP MEMORY', 28, THEME.bpHi)}` },
  G(N5, 'dc', 'dashcam', { x: 500, y: 300, svg: `<rect x="-60" y="-34" width="120" height="68" rx="12" fill="#1c2630" stroke="${THEME.bpLine}" stroke-width="6"/><circle cx="0" cy="0" r="20" fill="#0f3d7a" stroke="${THEME.bpLine}" stroke-width="5"/><circle cx="46" cy="-18" r="6" fill="#ff4d4d" ${an('blink', .9)}/>${M(-110, 8, 'LIKE A', 26, '#fff', 'end')}${M(110, 8, 'DASHCAM', 30, THEME.bpHi, 'start')}` }),
  G(N5, 'lp', 'loop', { x: 500, y: 760, svg: `<circle r="210" fill="none" stroke="${THEME.bpSoft}" stroke-width="30" opacity=".35"/><circle r="210" fill="none" stroke="#6dff9c" stroke-width="30" stroke-dasharray="720 600" transform="rotate(-90)"/><g ${an('spin', 9, 0, [0, 0])}><circle cx="0" cy="-210" r="22" fill="#fff" stroke="#0f3d7a" stroke-width="6"/></g>${M(0, -10, 'MEMORY', 36, '#fff')}${M(0, 36, 'RECORDING', 32, THEME.bpHi)}${M(0, 90, 'ON A LOOP', 26, THEME.bpSoft)}` }),
  G(N5, 'ow', 'overwrites', { x: 500, y: 1060, svg: `${M(-250, 0, 'NEWEST WRITES OVER', 24, '#6dff9c')}${M(250, 0, 'THE OLDEST', 24, '#ff9d9d')}` }),
  G(N5, 'h2', 'two', { x: 500, y: 1180, svg: `${M(-380, 0, 'VOICE: 2+ HOURS', 24, '#fff', 'start')}<g ${an('growx', 1, 0, 'left')}><rect x="-120" y="-18" width="56" height="36" rx="6" fill="#7fe0ff"/></g>` }),
  G(N5, 'h25', 'twenty', { x: 500, y: 1280, svg: `${M(-380, 0, 'DATA: 25+ HOURS', 24, '#fff', 'start')}<g ${an('growx', 1.4, 0, 'left')}><rect x="-120" y="-18" width="500" height="36" rx="6" fill="${THEME.bpHi}"/></g>` })
]})));

// ── 6 TOGETHER ──────────────────────────────────────────────────
const N6 = "Together they answer two questions. What did the plane do, and what was happening in the cockpit? Investigators line them up on one timeline, the way you sync a video with its soundtrack, and watch the final minutes unfold.";
S.push(scene('#0f3d7a', N6, comicScene({ badge: '6 - TWO BOXES, ONE STORY', theme: 'blue', groups: [
  { id: 'fr', w: 'together', t: .3, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 130, 'FIG. 6 - SYNCING THE TWO', 28, THEME.bpHi)}` },
  G(N6, 'fd', 'plane', { x: 500, y: 380, svg: `${BC(840, 220)}${M(-390, -75, 'WHAT THE PLANE DID (FDR)', 24, '#7fe0ff', 'start')}<path d="M-380 40 C-250 40 -200 -30 -60 -20 S120 -20 200 40 S300 90 390 90" fill="none" stroke="#7fe0ff" stroke-width="7" stroke-linecap="round"/>` }),
  G(N6, 'cv', 'cockpit', { x: 500, y: 700, svg: `${BC(840, 200)}${M(-390, -62, 'WHAT WAS SAID (CVR)', 24, '#ffb36b', 'start')}<g transform="translate(-380 0)">${eq(38, 10, '#ffb36b', 11)}</g>` }),
  G(N6, 'tl', 'timeline', { x: 500, y: 540, svg: `<g ${an('move', 5, 0, 'center', '--dx:640px;')}><line x1="-320" y1="-290" x2="-320" y2="290" stroke="${THEME.bpHi}" stroke-width="5" stroke-dasharray="12 8"/></g>${M(0, 340, 'ONE SHARED TIMELINE', 28, THEME.bpHi)}` }),
  G(N6, 'ev', 'line', { x: 500, y: 540, svg: `<g transform="translate(160 20)"><circle r="18" fill="#ff4d4d" ${an('pulse', .8)}/>${M(0, -34, 'ALARM!', 24, '#ff9d9d')}</g>` }),
  G(N6, 'sy', 'sync', { x: 500, y: 1100, svg: `<rect x="-300" y="-60" width="130" height="100" rx="8" fill="none" stroke="${THEME.bpLine}" stroke-width="6"/><polygon points="-260,-34 -260,14 -214,-10" fill="${THEME.bpLine}"/>${M(-235, 80, 'VIDEO', 24, '#fff')}${T(-100, 10, '+', 70, '#fff')}<path d="M80 30 V-40 L180 -60 V10" fill="none" stroke="${THEME.bpLine}" stroke-width="6"/><circle cx="60" cy="30" r="20" fill="${THEME.bpLine}"/><circle cx="160" cy="10" r="20" fill="${THEME.bpLine}"/>${M(120, 80, 'SOUNDTRACK', 24, '#fff')}` }),
  G(N6, 'un', 'unfold', { x: 500, y: 1330, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'THE FINAL MINUTES UNFOLD', -2, '#fff', 54, '#0f3d7a')}</g>` })
]})));

// ── 7 ORANGE, NOT BLACK ─────────────────────────────────────────
const N7 = "The boxes are painted bright orange with reflective stripes, so searchers can spot them in wreckage. They are usually mounted in the tail, often the part of the plane that suffers the least in an impact. Nobody is certain where the name black box came from. One theory is that engineers call any sealed device a black box, no matter its color.";
S.push(scene('#0f3d7a', N7, comicScene({ badge: '7 - ORANGE, NOT BLACK', theme: 'blue', groups: [
  { id: 'fr', w: 'boxes', t: .3, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 130, 'FIG. 7 - COLOUR AND LOCATION', 28, THEME.bpHi)}` },
  G(N7, 'or', 'orange', { x: 500, y: 400, svg: `<g ${an('pulse', 1.2)}><ellipse rx="230" ry="130" fill="rgba(255,122,26,.22)"/></g>${rec(320, 180)}` }),
  G(N7, 'st', 'stripes', { x: 500, y: 400, svg: `${dr('M-135 -50 L-250 -150', 0, .8, 4, THEME.bpHi)}${M(-250, -170, 'REFLECTIVE STRIPES', 24, THEME.bpHi, 'middle')}${dr('M60 90 L150 150', 0, .8, 4, THEME.bpHi)}${M(180, 180, 'BRIGHT ORANGE', 24, THEME.bpHi, 'middle')}` }),
  G(N7, 'tl', 'tail', { x: 500, y: 850, svg: `<g transform="scale(.9)">${planeBP(0)}<rect x="262" y="-28" width="62" height="40" rx="6" fill="${ORANGE}" stroke="#fff" stroke-width="4" ${an('pulse', .9)}/></g>${dr('M290 -60 V-160', .6, .8, 5, THEME.bpHi).replace('<path', '<path transform="scale(.9)"')}${M(260, -190, 'USUALLY IN THE TAIL', 26, THEME.bpHi)}` }),
  G(N7, 'ce', 'certain', { x: 500, y: 1180, svg: `<g ${an('wobble', .8)}>${sfx(0, 0, 'WHY "BLACK"? NOBODY IS SURE', -2, '#ffd23f', 50, '#0f3d7a')}</g>` }),
  G(N7, 'th', 'theory', { x: 500, y: 1330, svg: `${BC(820, 110)}${M(0, -8, 'ONE THEORY: ENGINEERS CALL ANY', 24, '#fff')}${M(0, 28, 'SEALED DEVICE A "BLACK BOX"', 24, '#fff')}` })
]})));

// ── 8 CONSTRUCTION ──────────────────────────────────────────────
const N8 = "Inside, modern recorders use solid state memory chips instead of tape. The chips sit in a small protected core. Think of a phone inside a thermos, inside a steel suitcase. A tough steel or titanium shell takes the impact, a layer of insulation blocks the heat, and an inner case holds the memory boards.";
const lead = (x1, y, label, col) => `${dr(`M${x1} ${y} H325`, 0, .6, 4, col)}${M(335, y + 8, label, 20, col, 'start')}`;
const ana = (id, w, x, icon, t1, t2) => G(N8, id, w, { x, y: 1200, svg: `${BC(260, 220)}<g transform="translate(0 -30)">${icon}</g>${T(0, 70, t1, 34, THEME.bpHi)}${M(0, 104, t2, 20, '#fff')}` });
S.push(scene('#0f3d7a', N8, comicScene({ badge: '8 - BUILT TO SURVIVE', theme: 'blue', groups: [
  { id: 'fr', w: 'inside', t: .3, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 130, 'FIG. 8 - CRASH-SURVIVABLE MEMORY UNIT', 28, THEME.bpHi)}` },
  G(N8, 'ch', 'chips', { x: 340, y: 600, svg: [-50, 0, 50].map((y, i) => `<rect x="-120" y="${y - 18}" width="240" height="30" rx="4" fill="#1c6b3a" stroke="${THEME.bpLine}" stroke-width="3" ${an('pulse', 1.4, i * .3)}/><rect x="-100" y="${y - 12}" width="40" height="18" fill="#222"/><rect x="-40" y="${y - 12}" width="40" height="18" fill="#222"/><rect x="20" y="${y - 12}" width="40" height="18" fill="#222"/>`).join('') + lead(122, 50, 'MEMORY CHIPS', '#6dff9c') }),
  ana('a1', 'phone', 170, `<rect x="-30" y="-60" width="60" height="110" rx="12" fill="#1c2630" stroke="${THEME.bpLine}" stroke-width="5"/><rect x="-22" y="-48" width="44" height="76" fill="#2d5fb5"/>`, 'PHONE', '= memory chips'),
  ana('a2', 'thermos', 500, `<rect x="-26" y="-60" width="52" height="116" rx="12" fill="#cfd6de" stroke="${THEME.bpLine}" stroke-width="5"/><rect x="-26" y="-74" width="52" height="20" rx="6" fill="#aa3a2a"/>`, 'THERMOS', '= insulation'),
  ana('a3', 'suitcase', 830, `<rect x="-60" y="-34" width="120" height="84" rx="10" fill="#8a929b" stroke="${THEME.bpLine}" stroke-width="5"/><path d="M-22 -34 V-56 H22 V-34" fill="none" stroke="${THEME.bpLine}" stroke-width="6"/>`, 'SUITCASE', '= steel shell'),
  G(N8, 'sh', 'shell', { x: 340, y: 600, svg: `${dr('M-280 -190 H280 V190 H-280Z', 0, 1.6, 8, '#cfd6de')}${lead(280, -170, 'STEEL / TITANIUM SHELL', '#cfd6de')}` }),
  G(N8, 'in', 'insulation', { x: 340, y: 600, svg: `<rect x="-240" y="-150" width="480" height="300" fill="rgba(255,210,63,.12)" stroke="${THEME.bpHi}" stroke-width="4" stroke-dasharray="10 8"/>${lead(240, -110, 'HEAT INSULATION', THEME.bpHi)}` }),
  G(N8, 'ic', 'inner', { x: 340, y: 600, svg: `${dr('M-190 -100 H190 V100 H-190Z', 0, 1.2, 6, '#7fe0ff')}${lead(190, -50, 'INNER CASE', '#7fe0ff')}` })
]})));

// ── 9 TORTURE TESTS A ───────────────────────────────────────────
const N9 = "To be certified, a recorder is tortured. First, an impact of three thousand four hundred times gravity, which would make a seventy kilogram person feel like two hundred tonnes. Then fire at eleven hundred degrees for an hour, far above the six hundred and sixty degrees where aluminium melts. Then a crushing load of five thousand pounds, like a heavy SUV parked on it.";
S.push(scene('#0f3d7a', N9, comicScene({ badge: '9 - THE TORTURE TEST', theme: 'blue', groups: [
  { id: 'fr', w: 'certified', t: .3, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 130, 'FIG. 9 - CERTIFICATION TESTS (1/2)', 28, THEME.bpHi)}` },
  G(N9, 'c1', 'impact', { x: 500, y: 360, svg: tcard(`<rect x="60" y="-60" width="24" height="120" fill="#8a929b"/><rect x="-60" y="-26" width="70" height="52" rx="6" fill="${ORANGE}" stroke="#fff" stroke-width="4"/>${sparks(48, 0, 8, '#ffd23f', 34, .4)}`, 'IMPACT: 3,400 g', '70 kg person feels 200+ tonnes') }),
  G(N9, 'c2', 'fire', { x: 500, y: 760, svg: tcard(`<g transform="scale(1.3)">${flame}</g>`, 'FIRE: 1,100 °C, 1 HOUR', 'aluminium melts at only 660 °C') }),
  G(N9, 'c3', 'crushing', { x: 500, y: 1160, svg: tcard(`<rect x="-60" y="-70" width="120" height="18" fill="#aab3bd"/><rect x="-60" y="52" width="120" height="18" fill="#aab3bd"/><rect x="-34" y="-32" width="68" height="64" rx="6" fill="${ORANGE}" stroke="#fff" stroke-width="4"/><path d="M0 -110 V-76 M-14 -92 L0 -76 L14 -92" stroke="#ffd23f" stroke-width="7" fill="none" stroke-linecap="round"/>`, 'CRUSH: 5,000 LB', 'like a heavy SUV parked on top') }),
  G(N9, 'sv', 'suv', { x: 500, y: 1370, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'AND IT STILL WORKS', -2, '#6dff9c', 56, '#0f3d7a')}</g>` })
]})));

// ── 10 TORTURE TESTS B + BEACON ─────────────────────────────────
const N10 = "Next, a heavy steel pin is dropped onto it to test penetration. Then it soaks in jet fuel and other fluids. Finally it sits in salt water at the pressure of twenty thousand feet down, for thirty days. If a recorder sinks, a small beacon switches on and pings every second, so searchers can hear it for about a month.";
const small = (icon, t1, t2) => `${BC(880, 200)}<g transform="translate(-340 0)">${icon}</g>${T(-190, -14, t1, 38, THEME.bpHi, 'start')}${M(-190, 36, t2, 24, '#fff', 'start')}`;
S.push(scene('#0f3d7a', N10, comicScene({ badge: '10 - TESTS AND THE PINGER', theme: 'blue', groups: [
  { id: 'fr', w: 'next', t: .3, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 130, 'FIG. 10 - CERTIFICATION TESTS (2/2)', 28, THEME.bpHi)}` },
  G(N10, 'p1', 'pin', { x: 500, y: 330, svg: small(`<polygon points="0,-70 -12,-20 12,-20" fill="#cfd6de" stroke="#fff" stroke-width="3"/><rect x="-14" y="-110" width="28" height="40" fill="#8a929b"/><rect x="-44" y="0" width="88" height="46" rx="6" fill="${ORANGE}" stroke="#fff" stroke-width="4"/>`, 'HEAVY PIN DROP', 'tests penetration') }),
  G(N10, 'p2', 'fluids', { x: 500, y: 570, svg: small(`<path d="M-40 -50 H40 L30 50 H-30Z" fill="rgba(255,210,63,.35)" stroke="#fff" stroke-width="4"/><rect x="-20" y="10" width="40" height="22" fill="${ORANGE}"/>`, 'JET FUEL + FLUIDS', 'soaked and still sealed') }),
  G(N10, 'p3', 'pressure', { x: 500, y: 810, svg: small(`${wavesIcon}<rect x="-20" y="26" width="40" height="22" rx="4" fill="${ORANGE}"/>`, 'DEEP SEA: 6,000 m, 30 DAYS', '~600x normal air pressure') }),
  G(N10, 'bc', 'beacon', { x: 250, y: 1130, svg: `<rect x="-24" y="-80" width="48" height="150" rx="14" fill="#cfd6de" stroke="#fff" stroke-width="5"/><rect x="-24" y="-80" width="48" height="26" rx="12" fill="#ff4d4d"/>${M(0, 120, 'UNDERWATER BEACON', 24, '#fff')}` }),
  G(N10, 'pg', 'pings', { x: 250, y: 1130, svg: [0, .6, 1.2].map(d => `<circle cy="-10" r="60" fill="none" stroke="#7fe0ff" stroke-width="6" ${an('ring', 1.8, d, 'center', '--dir:normal;')}/>`).join('') + M(230, -20, '37.5 kHz PING,', 28, THEME.bpHi, 'start') + M(230, 24, 'ONCE EVERY SECOND', 28, THEME.bpHi, 'start') }),
  G(N10, 'mo', 'month', { x: 500, y: 1370, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'HEARD FOR A MONTH OR MORE', -2, '#fff', 50, '#0f3d7a')}</g>` })
]})));

// ── 11 RECOVERY ─────────────────────────────────────────────────
const N11 = "After a crash, searchers follow the bright paint on land, or the beacon's ping underwater. Recorders pulled from the sea are kept in fresh water to stop corrosion, then taken to a lab, cleaned, and opened. Technicians download the memory and rebuild the flight. In two thousand eleven, the recorders of Air France four four seven were recovered from the bottom of the Atlantic after two years, and their data was still readable.";
S.push(scene('#0f3d7a', N11, comicScene({ badge: '11 - FINDING AND READING', theme: 'blue', groups: [
  { id: 'fr', w: 'after', t: .3, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 130, 'FIG. 11 - RECOVERY', 28, THEME.bpHi)}` },
  G(N11, 'pa', 'paint', { x: 260, y: 360, svg: `${BC(400, 300)}<rect x="-190" y="60" width="380" height="60" fill="rgba(120,200,120,.3)"/><g transform="translate(0 40)">${rec(150, 80)}</g>${M(0, -90, 'LAND: FOLLOW', 24, '#fff')}${M(0, -56, 'THE ORANGE', 24, ORANGE)}` }),
  G(N11, 'pi', 'ping', { x: 740, y: 360, svg: `${BC(400, 300)}<rect x="-190" y="-20" width="380" height="140" fill="rgba(77,208,255,.2)"/>${[0, .6, 1.2].map(d => `<circle cy="60" r="40" fill="none" stroke="#7fe0ff" stroke-width="5" ${an('ring', 1.8, d, 'center', '--dir:normal;')}/>`).join('')}<rect x="-30" y="84" width="60" height="30" rx="5" fill="${ORANGE}"/>${M(0, -90, 'SEA: FOLLOW', 24, '#fff')}${M(0, -56, 'THE PING', 24, '#7fe0ff')}` }),
  G(N11, 'lb', 'lab', { x: 500, y: 800, svg: `<rect x="-200" y="-110" width="400" height="220" rx="14" fill="#1c2630" stroke="${THEME.bpLine}" stroke-width="7"/><polyline points="-170,40 -130,40 -110,-30 -80,50 -50,10 -20,10 10,-50 40,40 70,10 170,10" fill="none" stroke="#6dff9c" stroke-width="6" stroke-linejoin="round" ${an('flow dash', .8)}/>${M(0, 160, 'LAB: CLEAN, OPEN, READ', 28, '#fff')}` }),
  G(N11, 'dl', 'download', { x: 500, y: 1010, svg: `${M(0, 0, 'DOWNLOAD THE MEMORY  >  REBUILD THE FLIGHT', 26, THEME.bpHi)}` }),
  G(N11, 'af', 'atlantic', { x: 500, y: 1200, svg: `${BC(840, 190)}${M(-380, -30, 'AIR FRANCE 447 (2011)', 30, THEME.bpHi, 'start')}${M(-380, 14, 'recovered from ~3,900 m deep', 26, '#fff', 'start')}${M(-380, 52, 'after about two years in the Atlantic', 26, '#fff', 'start')}<g transform="translate(330 0)"><path d="M-30 -70 V70" stroke="#7fe0ff" stroke-width="6"/><circle cy="70" r="14" fill="${ORANGE}"/></g>` }),
  G(N11, 'rd', 'readable', { x: 500, y: 1390, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'DATA STILL READABLE!', -2, '#6dff9c', 62, '#0f3d7a')}</g>` })
]})));

// ── 12 FUTURE + CTA ─────────────────────────────────────────────
const N12 = "They are not perfect. If a plane vanishes over deep ocean, the box may never be found. So engineers are working on longer lasting beacons, floating recorders that eject on impact, and live streaming of key data to the ground. Until then, this little orange box remains aviation's most important witness. Subscribe for more.";
const up = (id, w, y, icon, t1, t2) => G(N12, id, w, { x: 500, y, svg: `${BC(880, 170)}<g transform="translate(-340 0)">${icon}</g>${T(-190, -10, t1, 38, THEME.bpHi, 'start')}${M(-190, 36, t2, 24, '#fff', 'start')}` });
S.push(scene('#0f3d7a', N12, comicScene({ badge: '12 - WHAT COMES NEXT', theme: 'blue', groups: [
  { id: 'fr', w: 'they', t: .3, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 130, 'FIG. 12 - THE FUTURE', 28, THEME.bpHi)}` },
  G(N12, 'np', 'perfect', { x: 500, y: 250, svg: sfx(0, 0, 'NOT PERFECT', -2, '#ff9d9d', 80, '#0f3d7a') }),
  G(N12, 'oc', 'vanishes', { x: 500, y: 450, svg: `${BC(840, 200)}<rect x="-416" y="-20" width="832" height="106" fill="rgba(77,208,255,.2)"/>${wavesIcon.replace('M-60', 'M-300')}<g ${an('bob', 1.6)}><rect x="-40" y="10" width="80" height="44" rx="6" fill="${ORANGE}" stroke="#fff" stroke-width="4"/></g>${T(220, 20, '?', 90, '#fff')}${M(-380, -60, 'DEEP OCEAN: THE BOX MAY NEVER BE FOUND', 24, '#fff', 'start')}` }),
  up('u1', 'beacons', 760, `<rect x="-40" y="-30" width="80" height="60" rx="8" fill="none" stroke="#fff" stroke-width="5"/><rect x="-32" y="-22" width="48" height="44" fill="#6dff9c"/><rect x="40" y="-12" width="10" height="24" fill="#fff"/>`, 'LONGER-LASTING BEACONS', 'ping for far longer'),
  up('u2', 'floating', 960, `<g ${an('bob', 1.2)}><rect x="-36" y="-10" width="72" height="40" rx="6" fill="${ORANGE}" stroke="#fff" stroke-width="4"/></g>${wavesIcon.replace('M-60 -10', 'M-60 34').replace('M-60 20', 'M-60 54')}`, 'FLOATING RECORDERS', 'eject on impact and float'),
  up('u3', 'streaming', 1160, `<circle cx="0" cy="-10" r="14" fill="#cfd6de" stroke="#fff" stroke-width="4"/><rect x="-44" y="-18" width="26" height="16" fill="#2d5fb5"/><rect x="18" y="-18" width="26" height="16" fill="#2d5fb5"/>${[30, 50].map((r, i) => `<circle cx="0" cy="-10" r="${r}" fill="none" stroke="#7fe0ff" stroke-width="4" ${an('ring', 1.8, i * .5, 'center', '--dir:normal;')}/>`).join('')}`, 'LIVE DATA STREAMING', 'key data sent to the ground'),
  G(N12, 'wi', 'witness', { x: 500, y: 1325, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, "AVIATION'S MOST IMPORTANT WITNESS", -2, ORANGE, 34, '#0f3d7a')}</g>` }),
  G(N12, 'sub', 'subscribe', { x: 500, y: 1420, svg: `<g ${an('pulse', .8)}><rect x="-190" y="-40" width="380" height="80" rx="16" fill="${THEME.accent}" stroke="#fff" stroke-width="6"/>${T(0, 18, 'SUBSCRIBE', 52, '#fff')}</g>` })
]})));

// ── export ──────────────────────────────────────────────────────
const TRANS = ['fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade'];
module.exports = {
    output: { title: 'airplane-black-boxes', format: 'portrait', fps: 30, crf: 23, preset: 'medium' },
    defaults: { voice: 'am_adam', speed: 1.02, transition: 'fade', transitionDuration: 0.3 },
    scenes: S.map((s, i) => Object.assign(s, { transition: TRANS[i] || 'fade' })),
};