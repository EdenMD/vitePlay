// config.ai-math-story.js
// "How Can AI Do Math If It Only Predicts Words?" — APEX Video Engine config (same architecture as earlier configs)
// 13 scenes: puzzle -> neural net (mixing board) -> training (fill-in-the-blank) -> learning (hiker in fog)
//            -> prediction needs understanding -> math in the blank -> phone book vs recipe -> clock trick
//            -> two parallel paths -> chess master -> failures -> fixes -> verdict

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

// ── extra helpers ───────────────────────────────────────────────
const wideCard = (icon, title, a1, a2, col) => `<rect x="-440" y="-150" width="880" height="300" rx="18" fill="#fff" stroke="${INK}" stroke-width="6"/><g transform="translate(-300 0)">${icon}</g>${T(-170, -30, title, 42, col, 'start')}${T(-170, 28, a1, 28, INK, 'start', FM, 'font-weight="bold"')}${T(-170, 68, a2, 28, INK, 'start', FM, 'font-weight="bold"')}`;
const card = (x, y, w, h, fill = '#fff', stroke = INK, sw = 6) => `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="16" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const gearSvg = (r, teeth, dur, rev, fill = '#aab3bd') => `<g ${an('spin', dur, 0, [0, 0], rev ? '--dir:reverse;' : '')}>${Array.from({ length: teeth }, (_, i) => `<rect x="-${r * .14}" y="-${r * 1.32}" width="${r * .28}" height="${r * .4}" fill="${fill}" stroke="${INK}" stroke-width="4" transform="rotate(${i * 360 / teeth})"/>`).join('')}<circle r="${r}" fill="${fill}" stroke="${INK}" stroke-width="6"/><circle r="${r * .3}" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`;
const speech = (x, y, w, h, txt, fill, tx = 28, tail = 'left') => `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="26" fill="${fill}" stroke="${INK}" stroke-width="6"/><polygon points="${tail === 'left' ? `${-w / 2 + 40},${h / 2 - 2} ${-w / 2 + 20},${h / 2 + 40} ${-w / 2 + 80},${h / 2 - 2}` : `${w / 2 - 40},${h / 2 - 2} ${w / 2 - 20},${h / 2 + 40} ${w / 2 - 80},${h / 2 - 2}`}" fill="${fill}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>${T(0, tx / 3, txt, tx, INK)}</g>`;

// ── 0 THE PUZZLE ────────────────────────────────────────────────
S.push(scene('#050818',
 "Here is a puzzle. AI language models are trained to predict the next word. So how can one solve a math problem it has never seen? You cannot autocomplete your way to a correct answer, or can you? Let's build one from scratch and find out.",
 comicScene({ badge: 'CAN AI REALLY DO MATH?', theme: 'night', groups: [
  { id: 'stars', always: true, svg: stars(50, 52) },
  { id: 'pz', x: 500, y: 110, w: 'puzzle', t: 1, svg: sfx(0, 0, 'THE PUZZLE', -3, '#ffd23f', 96, '#050818') },
  { id: 'pr', x: 500, y: 450, w: 'predict', t: 3.4, svg: `${card(0, 0, 800, 220, '#fff', '#8fbcff')}${T(0, -20, 'the cat sat on the', 46, INK, 'middle', FM, 'font-weight="bold"')}<rect x="262" y="-52" width="14" height="52" fill="#2d5fb5" ${an('blink', .8)}/>${['mat', 'sofa', 'floor'].map((w, i) => `<g transform="translate(${-200 + i * 200} 60)"><rect x="-80" y="-28" width="160" height="56" rx="28" fill="#e8f1ff" stroke="#2d5fb5" stroke-width="4"/>${T(0, 12, w, 34, '#2d5fb5')}</g>`).join('')}${T(0, 170, 'PREDICT THE NEXT WORD', 36, '#8fbcff')}` },
  { id: 'mc', x: 500, y: 830, w: 'math', t: 6.9, svg: `${card(0, 0, 800, 220, '#fff', '#ffd23f')}${T(0, 28, '3,847 + 5,296 = ?', 82, INK)}${T(0, 170, 'A MATH PROBLEM IT HAS NEVER SEEN', 34, '#ffd23f')}` },
  { id: 'au', x: 500, y: 1110, w: 'autocomplete', t: 9.7, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'CAN AUTOCOMPLETE DO THIS?', -2, '#ff6b6b', 58, '#050818')}</g>` },
  { id: 'bd', x: 500, y: 1290, w: 'build', t: 13.4, svg: sfx(0, 0, "LET'S BUILD ONE FROM SCRATCH", -2, '#6dff9c', 54, '#050818') }
 ]})));

// ── 1 THE MIXING BOARD ──────────────────────────────────────────
const sliders = (() => { const r = rng(13); let o = ''; for (let i = 0; i < 12; i++) { const x = -360 + i * 65.5, y = -120 + r() * 240; o += `<line x1="${x}" y1="-150" x2="${x}" y2="150" stroke="#111" stroke-width="10" stroke-linecap="round"/><g transform="translate(${x} ${y.toFixed(0)})"><g ${an('bob', (.6 + r()).toFixed(2), r().toFixed(2))}><rect x="-20" y="-12" width="40" height="24" rx="6" fill="${['#ff6b6b', '#ffd23f', '#4dd0ff', '#6dff9c'][i % 4]}" stroke="#fff" stroke-width="3"/></g></g>`; } return o; })();
S.push(scene(THEME.paper,
 "Start with a neural network. Picture a giant mixing board with billions of dials. Words go in one side, and a guess comes out the other. At first every dial is set randomly, so the guess is pure gibberish.",
 comicScene({ badge: '1 - THE MIXING BOARD', badgeColor: THEME.accent2, groups: [
  { id: 'tt', x: 500, y: 120, w: 'network', t: 1.4, svg: `${sfx(0, 0, 'NEURAL NETWORK', -2, THEME.accent, 80, '#fff')}${T(0, 60, '= a giant mixing board', 36, INK, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'in', x: 500, y: 390, w: 'words', t: 4.8, svg: `${['CAT', 'SAT', 'ON'].map((w, i) => `<g transform="translate(${-150 + i * 150} 0)"><rect x="-60" y="-34" width="120" height="68" rx="12" fill="#fff" stroke="${INK}" stroke-width="5"/>${T(0, 13, w, 38)}</g>`).join('')}${arrow(0, 50, 0, 150, INK, 8)}${T(330, 10, 'WORDS IN', 30, THEME.accent2, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'bd', x: 500, y: 820, w: 'board', t: 3.1, svg: `<rect x="-420" y="-200" width="840" height="400" rx="22" fill="#2b3a55" stroke="${INK}" stroke-width="8"/>${sliders}` },
  { id: 'bl', x: 500, y: 590, w: 'billions', t: 3.8, svg: T(0, 0, 'BILLIONS OF DIALS', 40, THEME.accent) },
  { id: 'out', x: 500, y: 1130, w: 'guess', t: 7.2, svg: `${arrow(0, -90, 0, -20, INK, 8)}${card(0, 60, 420, 100)}${T(0, 74, 'GUESS: ???', 46, INK)}` },
  { id: 'rnd', x: 250, y: 1090, w: 'randomly', t: 11, svg: T(0, 0, 'ALL SET AT RANDOM', 28, THEME.accent) },
  { id: 'gib', x: 500, y: 1380, w: 'gibberish', t: 13.1, svg: `<g ${an('wobble', .4)}>${sfx(0, 0, 'ZXQ PLORB!?', -3, THEME.accent, 84, '#fff')}</g>` }
 ]})));

// ── 2 FILL IN THE BLANK ─────────────────────────────────────────
S.push(scene(THEME.paper,
 "Now the training. We show it huge amounts of text from books, websites and code, with the next word hidden. It is a giant fill in the blank test. The cat sat on the blank. The model guesses, and then we reveal the real answer.",
 comicScene({ badge: '2 - THE TRAINING GAME', badgeColor: THEME.accent2, groups: [
  { id: 'src', x: 500, y: 170, w: 'text', t: 3.1, svg: `${[[-300, 'BOOKS'], [0, 'WEBSITES'], [300, 'CODE']].map(([x, l], i) => `<g transform="translate(${x} 0)">${card(0, 0, 250, 140)}${i === 0 ? `<rect x="-40" y="-40" width="80" height="60" fill="#c8702a" stroke="${INK}" stroke-width="4"/><line x1="0" y1="-40" x2="0" y2="20" stroke="${INK}" stroke-width="4"/>` : i === 1 ? `<rect x="-60" y="-40" width="120" height="60" fill="#e8f1ff" stroke="${INK}" stroke-width="4"/><circle cx="-46" cy="-30" r="4" fill="#e63946"/>` : T(0, 12, '&lt;/&gt;', 54, '#2d5fb5', 'middle', FM, 'font-weight="bold"')}${T(0, 52, l, 28)}</g>`).join('')}` },
  { id: 'fl', x: 500, y: 400, w: 'fill', t: 8.3, svg: T(0, 0, 'A GIANT FILL-IN-THE-BLANK TEST', 38, THEME.accent2) },
  { id: 'sn', x: 500, y: 530, w: 'hidden', t: 6.6, svg: `${card(0, 0, 840, 130)}${T(-390, 16, 'THE CAT SAT ON THE', 44, INK, 'start', FM, 'font-weight="bold"')}<rect x="150" y="-40" width="200" height="80" rx="12" fill="#2b3a55"/>${T(250, 22, '?', 64, '#ffd23f')}` },
  { id: 'bars', x: 500, y: 830, w: 'guesses', t: 12.8, svg: `${T(0, -60, 'THE MODEL GUESSES', 36, INK)}${[['mat', 55], ['sofa', 25], ['rug', 12], ['moon', 1]].map(([w, p], i) => `<g transform="translate(0 ${i * 70})">${T(-300, 12, w, 32, INK, 'end')}<g ${an('growx', 1, i * .15, 'left')}><rect x="-270" y="-18" width="${Math.max(6, p * 8)}" height="40" rx="8" fill="${i === 0 ? THEME.accent2 : '#aab3bd'}" stroke="${INK}" stroke-width="4"/></g>${T(-270 + Math.max(6, p * 8) + 14, 12, p + '%', 30, INK, 'start')}</g>`).join('')}` },
  { id: 'rv', x: 500, y: 830, w: 'reveal', t: 14.1, svg: `<rect x="-370" y="-24" width="640" height="50" rx="12" fill="none" stroke="#ffd23f" stroke-width="8" ${an('pulse', .7)}/>${sfx(0, 380, 'REAL ANSWER: MAT', -2, THEME.accent, 66, '#fff')}` }
 ]})));

// ── 3 LEARNING = HIKER IN FOG ───────────────────────────────────
const TERR = 'M60 520 C180 470 260 800 420 780 C540 765 560 600 660 640 C740 680 740 980 830 980 C900 980 940 900 960 800';
S.push(scene('#cfeeff',
 "Every wrong guess shows the model how far off it was. Then a little math nudges every dial toward the right answer. Think of a hiker in thick fog, trying to reach a valley. They cannot see it, but they can feel which way is downhill, so they take a small step. Repeat that trillions of times, and the dials settle.",
 comicScene({ badge: '3 - HOW IT LEARNS', badgeColor: THEME.accent, theme: 'sky', groups: [
  { id: 'loss', x: 500, y: 120, w: 'wrong', t: .3, svg: `${sfx(0, 0, 'HOW WRONG? = LOSS', -2, THEME.accent, 70, '#fff')}${T(0, 52, 'lower is better', 30, INK, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'ng', w: 'nudges', t: 5.2, svg: `<circle cx="160" cy="1250" r="64" fill="#2b3a55" stroke="${INK}" stroke-width="7"/><g ${an('rot', .8, 0, [160, 1250], '--r0:-14deg;--r1:14deg;')}><line x1="160" y1="1250" x2="160" y2="1198" stroke="#ffd23f" stroke-width="9" stroke-linecap="round"/></g>${T(580, 1262, 'NUDGE EVERY DIAL A TINY BIT', 36)}` },
  { id: 'hill', w: 'hiker', t: 8.6, svg: `<path d="${TERR} V1100 H60Z" fill="#8a7f6f" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
    <g><circle cy="-24" r="24" fill="#e63946" stroke="${INK}" stroke-width="5"/><circle cx="-8" cy="-28" r="3.5" fill="#fff"/><circle cx="8" cy="-28" r="3.5" fill="#fff"/><animateMotion dur="9s" repeatCount="indefinite" path="${TERR}" calcMode="spline" keyTimes="0;1" keySplines=".3 0 .7 1"/></g>` },
  { id: 'fog', w: 'fog', t: 9.7, svg: `<g ${an('float', 3)}>${cloud(60, 700, 2.6, '#fff', .8)}${cloud(380, 780, 2.4, '#fff', .8)}${cloud(690, 820, 2.2, '#fff', .8)}</g>${T(500, 1170, 'FOG: YOU CANNOT SEE THE VALLEY', 30, INK, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'val', x: 720, y: 1040, w: 'valley', t: 11.4, svg: `${T(0, 0, 'VALLEY = FEWEST MISTAKES', 32, '#fff')}` },
  { id: 'dh', w: 'downhill', t: 15.5, svg: `${arrow(150, 470, 330, 700, THEME.accent2, 10)}${T(500, 410, 'FEEL THE SLOPE: STEP DOWNHILL', 28, THEME.accent2, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'tr', x: 500, y: 1390, w: 'trillions', t: 18.6, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'REPEAT x TRILLIONS', -2, THEME.accent, 66, '#fff')}</g>` }
 ]})));

// ── 4 PREDICTION NEEDS UNDERSTANDING ────────────────────────────
const note = (x, y, txt, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-120" y="-56" width="240" height="112" rx="6" fill="#fff8c8" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-48" r="9" fill="#e63946" stroke="${INK}" stroke-width="3"/>${T(0, 12, txt, 28)}</g>`;
S.push(scene(THEME.paper,
 "Here's the twist. To guess the next word well, the model must understand what came before. Imagine a mystery novel with the last line hidden. The killer is blank. To fill that in, you have to follow every clue in the whole story. Guessing the next word turns out to demand real understanding.",
 comicScene({ badge: '4 - THE BIG TWIST', badgeColor: THEME.accent, groups: [
  { id: 'tw', x: 500, y: 110, w: 'twist', t: .7, svg: sfx(0, 0, 'THE TWIST', -3, THEME.accent, 100, '#fff') },
  { id: 'un', x: 500, y: 230, w: 'understand', t: 4.1, svg: T(0, 0, 'GUESS WELL  =  UNDERSTAND FIRST', 40, THEME.accent2) },
  { id: 'bd', x: 500, y: 760, w: 'novel', t: 6.6, svg: `<rect x="-420" y="-300" width="840" height="600" rx="16" fill="#b98b55" stroke="${INK}" stroke-width="8"/>${note(-250, -190, 'MUDDY BOOTS', -3)}${note(250, -190, 'TORN LETTER', 3)}${note(-250, 190, 'STOPPED CLOCK', 2)}${note(250, 190, 'MISSING KEY', -2)}${T(0, -290 + 30, 'A MYSTERY NOVEL', 30, '#fff', 'middle', FM, 'font-weight="bold"')}` },
  { id: 'kl', x: 500, y: 760, w: 'killer', t: 9, svg: `${card(0, 0, 340, 130, '#fff', THEME.accent, 7)}${T(0, -4, 'THE KILLER IS', 34, INK)}${T(0, 44, '________', 38, THEME.accent)}` },
  { id: 'cl', x: 500, y: 760, w: 'clue', t: 13.1, svg: `${dr('M-250 -170 L-70 -40', 0, 1, 5, '#e63946').replace(THEME.bpLine, '#e63946')}${dr('M250 -170 L70 -40', .2, 1, 5, '#e63946')}${dr('M-250 170 L-70 40', .4, 1, 5, '#e63946')}${dr('M250 170 L70 40', .6, 1, 5, '#e63946')}` },
  { id: 'ud', x: 500, y: 1230, w: 'understanding', t: 17.9, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'GUESSING DEMANDS UNDERSTANDING', -2, THEME.accent2, 42, '#fff')}</g>` }
 ]})));

// ── 5 MATH IN THE BLANK ─────────────────────────────────────────
S.push(scene(THEME.paper,
 "Now put math in the blank. Twenty three plus forty eight equals blank. The training text is full of these. And no model can memorize every sum, because there are far too many numbers. To score well across millions of different problems, it has to find an actual method.",
 comicScene({ badge: '5 - MATH IN THE BLANK', badgeColor: THEME.accent2, groups: [
  { id: 'tt', x: 500, y: 110, w: 'math', t: .7, svg: sfx(0, 0, 'MATH IN THE BLANK', -2, THEME.accent, 84, '#fff') },
  { id: 'eq', x: 500, y: 330, w: 'twenty', t: 2.1, svg: `${card(0, 0, 700, 170)}${T(0, 34, '23 + 48 = ___', 92, INK)}` },
  { id: 'tx', x: 500, y: 560, w: 'text', t: 5.2, svg: `${T(0, -70, 'TRAINING TEXT IS FULL OF SUMS', 34, THEME.accent2)}${['7+5=12', '31+9=40', '56+17=73'].map((s, i) => `<g transform="translate(${-300 + i * 300} 10)">${card(0, 0, 250, 90)}${T(0, 14, s, 38, INK, 'middle', FM, 'font-weight="bold"')}</g>`).join('')}` },
  { id: 'mem', x: 500, y: 930, w: 'memorize', t: 8.3, svg: `${T(0, -210, 'MEMORIZE EVERY SUM?', 40, THEME.accent)}<rect x="-280" y="-170" width="560" height="340" rx="12" fill="#fff" stroke="${INK}" stroke-width="6"/><line x1="-230" y1="-170" x2="-230" y2="170" stroke="#e63946" stroke-width="3"/>${Array.from({ length: 8 }, (_, i) => `<line x1="-270" y1="${-130 + i * 40}" x2="270" y2="${-130 + i * 40}" stroke="#8fbcff" stroke-width="2"/>${T(-210, -118 + i * 40, `${11 + i * 7} + ${23 + i * 5} = ${34 + i * 12}`, 24, INK, 'start', FM, 'font-weight="bold"')}`).join('')}<g ${an('float', 1.6)}>${T(0, 215, '...AND ON, AND ON', 30, THEME.accent, 'middle', FM, 'font-weight="bold"')}</g>` },
  { id: 'many', x: 500, y: 1262, w: 'many', t: 11, svg: `${sfx(0, 0, '10 BILLION PAIRS', -2, THEME.accent, 70, '#fff')}${T(0, 52, 'just for 5-digit numbers', 30, INK, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'mt', x: 500, y: 1405, w: 'method', t: 16.6, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'IT MUST FIND A METHOD', -2, THEME.accent2, 60, '#fff')}</g>` }
 ]})));

// ── 6 PHONE BOOK VS RECIPE ──────────────────────────────────────
S.push(scene(THEME.paper,
 "It's like the difference between memorizing a phone book and learning a recipe. A phone book works only for the exact entries inside it. A recipe works for any ingredients you bring. During training, the dials slowly drift away from memorizing, and toward the recipe, because the recipe is a much smaller thing to store.",
 comicScene({ badge: '6 - MEMORIZE OR LEARN?', badgeColor: THEME.accent, groups: [
  { id: 'pb', x: 250, y: 540, w: 'phone', t: 2.4, svg: `<rect x="-150" y="-200" width="300" height="400" rx="10" fill="#f3e2b3" stroke="${INK}" stroke-width="7"/>${Array.from({ length: 9 }, (_, i) => `<line x1="-120" y1="${-150 + i * 36}" x2="120" y2="${-150 + i * 36}" stroke="#a07848" stroke-width="3"/>`).join('')}${T(0, -158, 'PHONE BOOK', 28, INK, 'middle', FM, 'font-weight="bold"')}${T(0, 250, 'MEMORIZING', 38, THEME.accent)}` },
  { id: 'rc', x: 750, y: 540, w: 'recipe', t: 4.1, svg: `<rect x="-130" y="-170" width="260" height="340" rx="12" fill="#fff" stroke="${INK}" stroke-width="7"/>${T(0, -110, 'RECIPE', 40, THEME.accent2)}${['1. MIX', '2. HEAT', '3. SERVE'].map((s, i) => T(-90, -40 + i * 60, s, 28, INK, 'start', FM, 'font-weight="bold"')).join('')}${T(0, 250, 'LEARNING', 38, THEME.accent2)}` },
  { id: 'ex', x: 250, y: 900, w: 'exact', t: 6.6, svg: `${T(0, 0, 'ONLY EXACT ENTRIES', 32, THEME.accent)}${T(0, 46, 'new name = no answer', 28, INK, 'middle', FM, 'font-weight="bold"')}<line x1="-60" y1="70" x2="60" y2="130" stroke="${THEME.accent}" stroke-width="9" stroke-linecap="round"/><line x1="60" y1="70" x2="-60" y2="130" stroke="${THEME.accent}" stroke-width="9" stroke-linecap="round"/>` },
  { id: 'ig', x: 750, y: 900, w: 'ingredients', t: 10, svg: `${T(0, 0, 'ANY INGREDIENTS WORK', 32, THEME.accent2)}${T(0, 46, 'new numbers = new answer', 28, INK, 'middle', FM, 'font-weight="bold"')}<circle cx="-60" cy="100" r="28" fill="#e63946" stroke="${INK}" stroke-width="4"/><circle cx="20" cy="100" r="28" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>${T(100, 112, '7', 44, INK)}<path d="M-24 150 l22 24 l50 -50" fill="none" stroke="${THEME.accent2}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>` },
  { id: 'dr', w: 'drift', t: 12.8, svg: `${arrow(410, 540, 590, 540, THEME.accent2, 10)}${T(500, 490, 'DIALS DRIFT', 24, THEME.accent2, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'sm', x: 500, y: 1250, w: 'smaller', t: 17.6, svg: `<rect x="-330" y="-60" width="300" height="120" rx="10" fill="#f3e2b3" stroke="${INK}" stroke-width="6"/><rect x="70" y="-24" width="90" height="48" rx="8" fill="#fff" stroke="${INK}" stroke-width="6"/>${T(-180, 100, 'BIG TO STORE', 28)}${T(115, 100, 'SMALL', 28, THEME.accent2)}${T(0, 190, 'RECIPE = MUCH SMALLER TO STORE', 34, THEME.accent2)}` }
 ]})));

// ── 7 THE CLOCK TRICK (blueprint) ───────────────────────────────
const clockNums = Array.from({ length: 12 }, (_, i) => { const n = i === 0 ? 12 : i, a = i * Math.PI / 6; return M((215 * Math.sin(a)).toFixed(0), (-215 * Math.cos(a) + 12).toFixed(0), String(n), 38, '#fff'); }).join('');
S.push(scene('#0f3d7a',
 "Scientists have opened up small networks and watched this happen. One learned to add by turning numbers into positions on a clock face. Adding became rotating the hand. Nine o'clock plus five hours lands on two, and the network found that trick all by itself.",
 comicScene({ badge: '7 - THE CLOCK TRICK', theme: 'blue', groups: [
  { id: 'fr', w: 'opened', t: .7, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 140, 'FIG. 1 - A SMALL NETWORK, OPENED UP', 28, THEME.bpHi)}${M(500, 200, '(adding numbers that wrap around)', 24, THEME.bpSoft)}` },
  { id: 'ck', x: 500, y: 700, w: 'clock', t: 7.2, svg: `${dr('M-260 0 a260 260 0 1 0 520 0 a260 260 0 1 0 -520 0', 0, 2, 6)}${clockNums}${M(0, 360, 'NUMBER  =  AN ANGLE', 34, THEME.bpHi)}<circle r="12" fill="#fff"/>` },
  { id: 'hd', x: 500, y: 700, w: 'rotating', t: 8.6, svg: `<line x1="0" y1="0" x2="0" y2="-170" stroke="${THEME.bpSoft}" stroke-width="8" stroke-linecap="round" opacity=".6" transform="rotate(-90)"/><g ${an('rot', 3, 0, [0, 0], '--r0:-90deg;--r1:60deg;--n:1;')}><line x1="0" y1="0" x2="0" y2="-170" stroke="${THEME.bpHi}" stroke-width="12" stroke-linecap="round"/></g>${M(0, 420, 'ADD  =  ROTATE THE HAND', 34, '#fff')}` },
  { id: 'nn', x: 500, y: 1260, w: 'nine', t: 9.7, svg: `${sfx(0, 0, '9 + 5 HOURS = 2', -2, THEME.bpHi, 70, '#0f3d7a')}` },
  { id: 'it', x: 500, y: 1390, w: 'itself', t: 15.2, svg: `<g ${an('pulse', .9)}>${sfx(0, 0, 'IT INVENTED THIS ITSELF', -2, '#6dff9c', 56, '#0f3d7a')}</g>` }
 ]})));

// ── 8 TWO PARALLEL PATHS (blueprint) ────────────────────────────
S.push(scene('#0f3d7a',
 "Inside a big model, researchers found something different. When adding, two paths run at the same time. One makes a rough estimate, like knowing the answer lands near seventy. The other nails the last digit exactly. It's like finding an address: one detective knows the neighborhood, the other knows the house number. Merge them, and out pops seventy one.",
 comicScene({ badge: '8 - TWO PATHS AT ONCE', theme: 'blue', groups: [
  { id: 'fr', w: 'adding', t: 3.1, svg: `${dr('M20 20 H980 V1440 H20Z', 0, 2.2, 4)}${M(500, 140, 'FIG. 2 - ADDING INSIDE A BIG MODEL', 28, THEME.bpHi)}${sfx(500, 270, '23 + 48', -2, '#fff', 90, '#0f3d7a')}` },
  { id: 'pt', w: 'paths', t: 3.8, svg: `${dr('M500 320 Q250 320 250 440 V820', 0, 1.6, 6)}${dr('M500 320 Q750 320 750 440 V820', 0, 1.6, 6)}` },
  { id: 'ro', x: 250, y: 610, w: 'rough', t: 6.9, svg: `<rect x="-165" y="-110" width="330" height="220" rx="14" fill="rgba(255,255,255,.08)" stroke="${THEME.bpLine}" stroke-width="5"/>${M(0, -66, 'ROUGH ESTIMATE', 26, THEME.bpHi)}<line x1="-130" y1="10" x2="130" y2="10" stroke="${THEME.bpLine}" stroke-width="5"/><rect x="-30" y="-14" width="90" height="48" rx="10" fill="${THEME.bpHi}" opacity=".4"/>${M(-130, 60, '40', 22, THEME.bpSoft)}${M(130, 60, '100', 22, THEME.bpSoft)}${M(15, 90, 'NEAR 70', 26, '#fff')}` },
  { id: 'ld', x: 750, y: 610, w: 'digit', t: 11.7, svg: `<rect x="-165" y="-110" width="330" height="220" rx="14" fill="rgba(255,255,255,.08)" stroke="${THEME.bpLine}" stroke-width="5"/>${M(0, -66, 'LAST DIGIT', 26, '#7fe0ff')}${Array.from({ length: 10 }, (_, i) => `<rect x="${-150 + i * 30}" y="-20" width="28" height="44" fill="${i === 1 ? '#7fe0ff' : 'none'}" stroke="${THEME.bpLine}" stroke-width="3"/>${M(-136 + i * 30, 12, String(i), 22, i === 1 ? '#0f3d7a' : '#fff')}`).join('')}${M(0, 70, '3 + 8 = 11', 24, THEME.bpSoft)}${M(0, 100, 'ENDS IN 1', 26, '#fff')}` },
  { id: 'nb', x: 250, y: 790, w: 'neighborhood', t: 15.5, svg: sfx(0, 0, 'NEIGHBORHOOD', -2, THEME.bpHi, 44, '#0f3d7a') },
  { id: 'hn', x: 750, y: 790, w: 'house', t: 17.2, svg: sfx(0, 0, 'HOUSE NUMBER', 2, '#7fe0ff', 44, '#0f3d7a') },
  { id: 'mg', w: 'merge', t: 17.9, svg: `${dr('M250 830 Q250 960 450 990', 0, 1, 6, THEME.bpHi)}${dr('M750 830 Q750 960 550 990', 0, 1, 6, '#7fe0ff')}` },
  { id: 'rs', x: 500, y: 1050, w: 'pops', t: 19.3, svg: `<g ${an('pulse', .8)}><circle r="80" fill="#fff" stroke="${THEME.bpHi}" stroke-width="8"/>${T(0, 28, '71', 84, '#0f3d7a')}</g>` },
  { id: 'ad', x: 500, y: 1240, w: 'address', t: 13.8, svg: sfx(0, 0, 'LIKE FINDING AN ADDRESS', -2, '#fff', 56, '#0f3d7a') },
  { id: 'nt', x: 500, y: 1380, w: 'pops', t: 19.8, svg: M(0, 0, 'REAL FINDING FROM INTERPRETABILITY RESEARCH', 22, THEME.bpSoft) }
 ]})));

// ── 9 THE CHESS MASTER ──────────────────────────────────────────
const board = (() => { let o = ''; for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) o += `<rect x="${-144 + i * 36}" y="${-144 + j * 36}" width="36" height="36" fill="${(i + j) % 2 ? '#8a5a1a' : '#f3e2b3'}"/>`; return o; })();
S.push(scene(THEME.paper,
 "Here is the funny part. Ask the model how it added, and it says it carried the one, like you learned in school. But that is not what happened inside. It's like a chess master who explains a move with textbook reasons, when really they just saw the board and felt the answer.",
 comicScene({ badge: '9 - THE FUNNY PART', badgeColor: THEME.accent, groups: [
  { id: 'fn', x: 500, y: 100, w: 'funny', t: 1, svg: sfx(0, 0, 'THE FUNNY PART', -3, THEME.accent, 90, '#fff') },
  { id: 'q', w: 'ask', t: 1.7, svg: speech(640, 320, 600, 130, 'HOW DID YOU ADD 23 + 48?', '#e8f1ff', 30, 'right') },
  { id: 'a', w: 'carried', t: 5.2, svg: speech(360, 560, 640, 130, 'I CARRIED THE ONE, LIKE IN SCHOOL!', '#fff8c8', 28, 'left') },
  { id: 'in', x: 500, y: 880, w: 'inside', t: 10, svg: `<rect x="-400" y="-110" width="800" height="220" rx="20" fill="#2b3a55" stroke="${INK}" stroke-width="7"/><g transform="translate(-250 0)">${gearSvg(34, 8, 4)}</g><g transform="translate(-170 -36) ">${gearSvg(26, 7, 3, true)}</g>${T(90, -10, 'ACTUALLY INSIDE:', 32, '#ffd23f', 'middle', FM, 'font-weight="bold"')}${T(90, 40, 'TWO PARALLEL SHORTCUTS', 36, '#fff')}` },
  { id: 'ch', x: 260, y: 1250, w: 'chess', t: 11.4, svg: `${board}<rect x="-144" y="-144" width="288" height="288" fill="none" stroke="${INK}" stroke-width="6"/><g ${an('pulse', .9)}><rect x="0" y="-72" width="36" height="36" fill="none" stroke="#ffd23f" stroke-width="6"/></g>${T(0, 200, 'A CHESS MASTER', 32)}` },
  { id: 'tb', x: 720, y: 1170, w: 'textbook', t: 13.8, svg: `${T(0, 0, 'EXPLAINS WITH', 30, INK, 'middle', FM, 'font-weight="bold"')}${T(0, 44, 'TEXTBOOK REASONS', 38, THEME.accent)}` },
  { id: 'ft', x: 720, y: 1320, w: 'felt', t: 17.2, svg: `<g ${an('pulse', .9)}>${T(0, 0, 'REALLY: JUST', 30, INK, 'middle', FM, 'font-weight="bold"')}${T(0, 44, 'FELT THE ANSWER', 38, THEME.accent2)}</g>` }
 ]})));

// ── 10 WHERE IT FAILS ───────────────────────────────────────────
S.push(scene(THEME.paper,
 "But this is a bag of tricks, not a perfect calculator. Big multiplications can go wrong, because the model answers in one breath, with a fixed amount of thinking per word. Numbers also get chopped into odd chunks, so the digits do not line up neatly.",
 comicScene({ badge: '10 - WHERE IT SLIPS', badgeColor: THEME.accent, groups: [
  { id: 'bg', x: 500, y: 200, w: 'bag', t: 1.4, svg: `<path d="M-90 -30 Q-120 130 0 150 Q120 130 90 -30Z" fill="#8a6a4a" stroke="${INK}" stroke-width="7"/><path d="M-40 -30 Q0 -90 40 -30" fill="none" stroke="${INK}" stroke-width="7"/>${[[-60, -50], [0, -70], [60, -50]].map(([x, y], i) => `<g ${an('bob', .9, i * .2)}><circle cx="${x}" cy="${y}" r="16" fill="${['#ffd23f', '#4dd0ff', '#6dff9c'][i]}" stroke="${INK}" stroke-width="4"/></g>`).join('')}${T(130, 20, 'A BAG OF TRICKS', 34, THEME.accent, 'start')}${T(130, 62, 'not a perfect calculator', 22, INK, 'start', FM, 'font-weight="bold"')}` },
  { id: 'mu', x: 500, y: 560, w: 'multiplications', t: 4.1, svg: `${card(0, 0, 820, 220)}${T(0, -30, '8,347 x 6,291', 70, INK)}${T(0, 40, 'MODEL SAYS: 52,509,977', 40, THEME.accent, 'middle', FM, 'font-weight="bold"')}${T(0, 84, 'TRUE ANSWER: 52,510,977', 34, THEME.accent2, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'wr', x: 780, y: 400, w: 'wrong', t: 5.2, svg: sfx(0, 0, 'OFF BY 1,000!', 6, THEME.accent, 56, '#fff') },
  { id: 'br', x: 270, y: 900, w: 'breath', t: 7.6, svg: `<circle r="72" fill="#fff" stroke="${INK}" stroke-width="7"/><line x1="0" y1="-72" x2="0" y2="-90" stroke="${INK}" stroke-width="8"/><g ${an('spin', 2, 0, [0, 0])}><line x1="0" y1="0" x2="0" y2="-52" stroke="${THEME.accent}" stroke-width="7" stroke-linecap="round"/></g><circle r="8" fill="${INK}"/>${T(0, 130, 'ONE BREATH', 40, THEME.accent)}` },
  { id: 'fx', x: 740, y: 880, w: 'fixed', t: 8.6, svg: `${[0, 1, 2].map(i => `<rect x="${-150 + i * 110}" y="-60" width="90" height="120" rx="10" fill="#cfd6de" stroke="${INK}" stroke-width="5"/>`).join('')}${T(0, 120, 'SAME THINKING PER WORD', 28, INK, 'middle', FM, 'font-weight="bold"')}${T(0, 154, 'easy sum or hard sum', 26, THEME.accent, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'tk', x: 500, y: 1245, w: 'chopped', t: 11.7, svg: `${T(0, -90, 'NUMBERS GET CHOPPED INTO CHUNKS', 34)}${[['123', -220], ['45', 0], ['67', 180]].map(([s, x]) => `<rect x="${x - 80}" y="-40" width="${s.length * 52 + 30}" height="80" rx="12" fill="#e8f1ff" stroke="#2d5fb5" stroke-width="5"/>${T(x - 80 + (s.length * 52 + 30) / 2, 16, s, 52, '#2d5fb5', 'middle', FM, 'font-weight="bold"')}`).join('')}${T(0, 90, 'example: 1234567', 26, INK, 'middle', FM, 'font-weight="bold"')}` },
  { id: 'dg', x: 500, y: 1405, w: 'digits', t: 13.8, svg: `<g ${an('wobble', .5)}>${sfx(0, 0, "DIGITS DON'T LINE UP", -2, THEME.accent, 58, '#fff')}</g>` }
 ]})));

// ── 11 THE FIXES ────────────────────────────────────────────────
S.push(scene(THEME.paper,
 "So we give it help. First, scratch paper: let it write out its steps before answering, so each step is small enough to get right. Second, a calculator: hand the big sums to real code. Third, practice with rewards: train it on math problems where only a correct answer earns points.",
 comicScene({ badge: '11 - THREE FIXES', badgeColor: THEME.accent2, groups: [
  { id: 's1', x: 500, y: 330, w: 'scratch', t: 2.1, svg: wideCard(`<rect x="-80" y="-100" width="160" height="200" rx="8" fill="#fff8c8" stroke="${INK}" stroke-width="6"/>${[-60, -20, 20, 60].map((y, i) => `<line x1="-56" y1="${y}" x2="${i === 3 ? 20 : 56}" y2="${y}" stroke="#2d5fb5" stroke-width="5" stroke-linecap="round"/>`).join('')}`, '1. SCRATCH PAPER', 'write the steps out first,', 'so each step is easy to get right', THEME.accent2) },
  { id: 's2', x: 500, y: 760, w: 'calculator', t: 9.3, svg: wideCard(`<rect x="-70" y="-100" width="140" height="200" rx="14" fill="#3a4654" stroke="${INK}" stroke-width="6"/><rect x="-54" y="-84" width="108" height="44" rx="6" fill="#bfe6ff"/>${[0, 1, 2].map(i => [0, 1, 2].map(j => `<rect x="${-52 + i * 38}" y="${-24 + j * 36}" width="28" height="26" rx="5" fill="#ffd23f"/>`).join('')).join('')}`, '2. A CALCULATOR', 'hand big sums to real code,', 'exact every single time', THEME.accent2) },
  { id: 's3', x: 500, y: 1190, w: 'rewards', t: 13.1, svg: wideCard(`<path d="M-60 -90 H60 V-20 Q60 40 0 50 Q-60 40 -60 -20Z" fill="#ffd23f" stroke="${INK}" stroke-width="6"/><path d="M-60 -70 H-96 Q-96 -10 -50 0 M60 -70 H96 Q96 -10 50 0" fill="none" stroke="${INK}" stroke-width="6"/><rect x="-14" y="50" width="28" height="30" fill="#c8a000" stroke="${INK}" stroke-width="5"/><rect x="-50" y="80" width="100" height="20" rx="6" fill="#8a6a4a" stroke="${INK}" stroke-width="5"/>`, '3. PRACTICE + REWARDS', 'only correct answers earn points,', 'so the model gets sharper', THEME.accent2) },
  { id: 'pt', x: 760, y: 1000, w: 'points', t: 17.2, svg: `<g ${an('pulse', .8)}>${sfx(0, 0, '+1 POINT!', 6, THEME.accent2, 64, '#fff')}</g>` }
 ]})));

// ── 12 VERDICT ──────────────────────────────────────────────────
const keys = Array.from({ length: 10 }, (_, i) => `<rect x="${-300 + i * 60}" y="-70" width="58" height="140" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join('') + [0, 1, 3, 4, 5, 7, 8].map(i => `<rect x="${-300 + i * 60 + 42}" y="-70" width="34" height="86" rx="3" fill="${INK}"/>`).join('');
S.push(scene('#050818',
 "So the puzzle is solved. Predicting the next word was only the training game. To win it on math, the network had to build real machinery inside. Like a pianist who practices scales and ends up playing music nobody taught them. It's not just autocomplete, and not a perfect calculator either. Subscribe for more.",
 comicScene({ badge: 'PUZZLE SOLVED', theme: 'night', groups: [
  { id: 'stars', always: true, svg: stars(50, 61) },
  { id: 'sv', x: 500, y: 110, w: 'solved', t: 1.4, svg: sfx(0, 0, 'PUZZLE SOLVED', -3, '#6dff9c', 96, '#050818') },
  { id: 'gm', x: 500, y: 330, w: 'game', t: 4.5, svg: `${card(0, 0, 800, 150, '#fff', '#ffd23f')}${T(0, -10, 'THE TRAINING GAME', 44, INK)}${T(0, 40, 'guess the next word', 32, '#2d5fb5', 'middle', FM, 'font-weight="bold"')}` },
  { id: 'mc', x: 500, y: 640, w: 'machinery', t: 8.6, svg: `<rect x="-400" y="-130" width="800" height="260" rx="20" fill="#2b3a55" stroke="#8fbcff" stroke-width="6"/><g transform="translate(-230 -10)">${gearSvg(54, 10, 5)}</g><g transform="translate(-100 40)">${gearSvg(38, 8, 4, true)}</g><g transform="translate(-40 -50)">${gearSvg(30, 7, 3)}</g>${T(180, -10, 'REAL MACHINERY', 36, '#ffd23f')}${T(180, 40, 'BUILT INSIDE', 36, '#fff')}` },
  { id: 'pn', x: 500, y: 980, w: 'pianist', t: 10, svg: `${keys}${T(0, 130, 'PRACTICE: SCALES', 34, '#8fbcff')}` },
  { id: 'mu', x: 500, y: 1180, w: 'music', t: 12.8, svg: `${[-200, -60, 80, 220].map((x, i) => `<circle ${an('rise', 2.2, i * .5, 'center', '--dy:-120px;--sc:1.3;')} cx="${x}" cy="-20" r="14" fill="#ffd23f"/>`).join('')}${sfx(0, 40, 'RESULT: MUSIC NOBODY TAUGHT', -2, '#ffd23f', 44, '#050818')}` },
  { id: 'n1', x: 500, y: 1265, w: 'autocomplete', t: 15.2, svg: `<rect x="-330" y="-32" width="660" height="64" rx="32" fill="#2e8b57" stroke="#fff" stroke-width="4"/>${T(0, 14, 'NOT JUST AUTOCOMPLETE', 38, '#fff')}` },
  { id: 'n2', x: 500, y: 1340, w: 'calculator', t: 16.9, svg: `<rect x="-330" y="-32" width="660" height="64" rx="32" fill="#b5402c" stroke="#fff" stroke-width="4"/>${T(0, 14, 'NOT A PERFECT CALCULATOR', 38, '#fff')}` },
  { id: 'sub', x: 500, y: 1430, w: 'subscribe', t: 17.6, svg: `<g ${an('pulse', .8)}><rect x="-170" y="-34" width="340" height="68" rx="16" fill="#b5402c" stroke="#fff" stroke-width="5"/>${T(0, 16, 'SUBSCRIBE', 44, '#fff')}</g>` }
 ]})));

// ── export ──────────────────────────────────────────────────────
const TRANS = ['fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left', 'fade', 'wipe-left', 'fade', 'wipe-up', 'fade'];
module.exports = {
    output: { title: 'how-ai-does-math', format: 'portrait', fps: 30, crf: 23, preset: 'medium' },
    defaults: { voice: 'am_adam', speed: 1.02, transition: 'fade', transitionDuration: 0.3 },
    scenes: S.map((s, i) => Object.assign(s, { transition: TRANS[i] || 'fade' })),
};