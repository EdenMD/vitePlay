// config.booksco-ad.js
// books.co.zw (ExamineAI) — APEX Video Engine config (same architecture as config.solar-story.js / config.baileys-ad.js)
// Style: WhatsApp-ad look — cream gradients, flat vector, no outlines, soft shadows, spring pop-ins.
// NEW: a small ILLUSTRATION LIBRARY (characters + props + icons) lives in the section below.
// 6 scenes (~45s): hook -> past papers -> AI agent -> CV templates -> job alerts -> CTA

const THEME = {
    paper: '#fbf6ea', ink: '#1d2b25', green: '#25d366', green2: '#128c7e', deep: '#075e54',
    mint: '#d9fdd3', white: '#ffffff', sand: '#efe3c8', peach: '#ffd9bf', sun: '#ffd166',
    coral: '#ff7a59', blue: '#53bdeb', sky: '#6c8cff', dark: '#0f2f28', muted: '#6b7a72',
    shadow: 'rgba(29,43,37,0.14)'
};
const SKIN = { deep: '#7a4a2e', dark: '#5a3622', mid: '#a06a45' };
const FI = "'Poppins','Nunito','Segoe UI','Helvetica Neue',Arial,sans-serif";
const FM = "'JetBrains Mono','SF Mono','Courier New',Courier,monospace";

// ── helpers ─────────────────────────────────────────────────────
function T(x, y, str, size = 30, fill = THEME.ink, anchor = 'middle', font = FI, extra = '') {
    const w = /font-weight/.test(extra) ? '' : 'font-weight="800" ';
    return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${fill}" font-family="${font}" ${w}${extra}>${str}</text>`;
}
const M = (x, y, str, size = 26, fill = THEME.ink, anchor = 'middle') =>
    T(x, y, str, size, fill, anchor, FM, 'font-weight="bold"');
const ORG = { top: '50% 0%', bottom: '50% 100%', left: '0% 50%', right: '100% 50%', center: '50% 50%' };
function an(cls, d = 2, dl = 0, o = 'center', extra = '') {
    const org = Array.isArray(o)
        ? `transform-box:view-box;transform-origin:${o[0]}px ${o[1]}px;`
        : `transform-box:fill-box;transform-origin:${ORG[o] || o};`;
    return `class="a ${cls}" style="--d:${d}s;--dl:${dl}s;${org}${extra}"`;
}
function arrow(x1, y1, x2, y2, color = THEME.green2, w = 8) {
    const dx = x2 - x1, dy = y2 - y1, ang = Math.atan2(dy, dx), cx = x1 + dx / 2 - dy * .15, cy = y1 + dy / 2 + dx * .15, h = 24;
    return `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" ${an('flow dash', 1)}/>
      <line x1="${x2}" y1="${y2}" x2="${x2 - h * Math.cos(ang - .5)}" y2="${y2 - h * Math.sin(ang - .5)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>
      <line x1="${x2}" y1="${y2}" x2="${x2 - h * Math.cos(ang + .5)}" y2="${y2 - h * Math.sin(ang + .5)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
}
const rng = (seed) => { let r = seed; return () => { r = (r * 9301 + 49297) % 233280; return r / 233280; }; };
function sparks(x, y, n = 8, col = THEME.sun, len = 22, d = .5) {
    let o = '';
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + .3;
        o += `<line ${an('blink', d, i * .07)} x1="${x + Math.cos(a) * 8}" y1="${y + Math.sin(a) * 8}" x2="${x + Math.cos(a) * len}" y2="${y + Math.sin(a) * len}" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`;
    }
    return o;
}
function blobs(seed = 1, n = 5) {
    const rnd = rng(seed), ids = ['blA', 'blB', 'blC']; let o = '';
    for (let i = 0; i < n; i++) {
        const r = 200 + rnd() * 220, x = Math.round(rnd() * 1000), y = Math.round(rnd() * 1480);
        o += `<circle ${an('float', (6 + rnd() * 5).toFixed(1), (rnd() * 3).toFixed(1))} cx="${x}" cy="${y}" r="${r.toFixed(0)}" fill="url(#${ids[i % 3]})"/>`;
    }
    return o;
}

// ══ ILLUSTRATION LIBRARY ════════════════════════════════════════
// Flat vector, no outlines, soft shadows. Every item is centred on 0,0 unless noted,
// returns an SVG string, and is safe to drop into any group's `svg`.
const mix = (a, b, t) => {
    const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), A = p(a), B = p(b);
    return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const shade = (c, t = .18) => mix(c, '#000000', t);
const tint = (c, t = .35) => mix(c, '#ffffff', t);

// UI blocks
function card(w, h, fill = '#fff', r = 36) {
    return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${r}" fill="${fill}" filter="url(#sh)"/>`;
}
function pill(w, h, fill, label, size = 34, col = '#fff') {
    return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" filter="url(#sh)"/>${T(0, size * .36, label, size, col)}`;
}
function bubble(w, h, fill, side = 'left') {
    const l = -w / 2, r = w / 2, b = h / 2;
    const tail = side === 'left'
        ? `<path d="M${l + 6} ${b - 36} L${l - 22} ${b + 6} Q${l + 8} ${b + 6} ${l + 38} ${b - 10}Z" fill="${fill}"/>`
        : `<path d="M${r - 6} ${b - 36} L${r + 22} ${b + 6} Q${r - 8} ${b + 6} ${r - 38} ${b - 10}Z" fill="${fill}"/>`;
    return `<g filter="url(#sh)"><rect x="${l}" y="${-h / 2}" width="${w}" height="${h}" rx="34" fill="${fill}"/>${tail}</g>`;
}
const typing = () => [-30, 0, 30].map((x, i) => `<circle cx="${x}" cy="0" r="10" fill="${THEME.muted}" ${an('bob', .7, i * .15)}/>`).join('');
const sparkle = (col = THEME.sun, s = 1) =>
    `<path transform="scale(${s})" d="M0 -24 Q4 -4 24 0 Q4 4 0 24 Q-4 4 -24 0 Q-4 -4 0 -24Z" fill="${col}"/>`;
const checkBadge = (r = 30) =>
    `<circle r="${r}" fill="${THEME.green}"/><path d="M${-r * .38} 0 l${r * .26} ${r * .28} l${r * .5} ${-r * .56}" fill="none" stroke="#fff" stroke-width="${r * .26}" stroke-linecap="round" stroke-linejoin="round"/>`;

// Characters — origin = neck base. head centre (0,-94). Use with desk() or inside an avatar() circle.
function person({ skin = SKIN.deep, hair = '#1a1411', style = 'short', top = THEME.green2, collar = '#fff', mood = 'happy', arms = 'none' } = {}) {
    const sk2 = shade(skin, .16), eye = '#24150e';
    const back = style === 'afro' ? `<circle cx="0" cy="-104" r="86" fill="${hair}"/>`
        : style === 'bun' ? `<circle cx="0" cy="-184" r="30" fill="${hair}"/>`
        : style === 'braids' ? [-62, -44, -26, 26, 44, 62].map(x => `<path d="M${x} -110 Q${x * 1.25} -40 ${x * 1.1} 20" stroke="${hair}" stroke-width="15" stroke-linecap="round" fill="none"/>`).join('') : '';
    const front = {
        short: `<path d="M-58 -98 Q-66 -172 0 -170 Q66 -172 58 -98 Q46 -132 0 -130 Q-46 -132 -58 -98Z" fill="${hair}"/>`,
        afro: `<path d="M-54 -108 Q-30 -146 0 -142 Q30 -146 54 -108 Q30 -128 0 -126 Q-30 -128 -54 -108Z" fill="${hair}"/>`,
        bun: `<path d="M-58 -98 Q-66 -166 0 -166 Q66 -166 58 -98 Q40 -140 0 -138 Q-40 -140 -58 -98Z" fill="${hair}"/>`
    };
    const armSvg = arms === 'desk'
        ? `<path d="M-100 78 Q-122 150 -66 168" stroke="${top}" stroke-width="46" fill="none" stroke-linecap="round"/><path d="M100 78 Q122 150 66 168" stroke="${top}" stroke-width="46" fill="none" stroke-linecap="round"/><circle cx="-62" cy="168" r="24" fill="${skin}"/><circle cx="62" cy="168" r="24" fill="${skin}"/>` : '';
    const brows = mood === 'worry'
        ? `<path d="M-34 -108 L-10 -118 M34 -108 L10 -118" stroke="${eye}" stroke-width="5" stroke-linecap="round"/>`
        : `<path d="M-32 -112 Q-21 -118 -10 -112 M10 -112 Q21 -118 32 -112" stroke="${eye}" stroke-width="5" stroke-linecap="round" fill="none"/>`;
    const mouth = mood === 'worry'
        ? `<path d="M-14 -60 Q0 -70 14 -60" stroke="${eye}" stroke-width="5" stroke-linecap="round" fill="none"/>`
        : `<path d="M-20 -68 Q0 -42 20 -68Z" fill="#3a1712"/><path d="M-12 -62 Q0 -52 12 -62Z" fill="#ff8a7a"/>`;
    return `<g>${back}
      <path d="M-112 240 V74 Q-112 -2 -46 -6 H46 Q112 -2 112 74 V240Z" fill="${top}"/>${armSvg}
      <path d="M-24 -50 H24 V-2 Q0 26 -24 -2Z" fill="${sk2}"/><path d="M-34 -6 L0 50 L34 -6Z" fill="${collar}"/>
      <ellipse cx="-57" cy="-88" rx="11" ry="15" fill="${skin}"/><ellipse cx="57" cy="-88" rx="11" ry="15" fill="${skin}"/>
      <ellipse cx="0" cy="-94" rx="56" ry="64" fill="${skin}"/>${front[style] || front.short}
      <ellipse cx="-21" cy="-92" rx="6.5" ry="8.5" fill="${eye}"/><ellipse cx="21" cy="-92" rx="6.5" ry="8.5" fill="${eye}"/>
      <circle cx="-19" cy="-95" r="2.4" fill="#fff"/><circle cx="23" cy="-95" r="2.4" fill="#fff"/>${brows}
      <path d="M-5 -80 Q0 -72 5 -80" stroke="${shade(skin, .3)}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="-34" cy="-70" rx="11" ry="7" fill="#ff7d6b" opacity=".22"/><ellipse cx="34" cy="-70" rx="11" ry="7" fill="#ff7d6b" opacity=".22"/>${mouth}</g>`;
}
const desk = (w = 780, y = 176) =>
    `<g filter="url(#sh)"><rect x="${-w / 2}" y="${y}" width="${w}" height="40" rx="14" fill="#f3d9b4"/></g><rect x="${-w / 2 + 30}" y="${y + 40}" width="${w - 60}" height="130" rx="10" fill="#e6c598"/><rect x="${-w / 2 + 8}" y="${y + 3}" width="${w - 16}" height="8" rx="4" fill="#fff" opacity=".4"/>`;
// round avatar: backdrop circle r150 + person cropped by the circle
const avatar = (id, bg, p) =>
    `<defs><clipPath id="${id}"><circle r="150"/></clipPath></defs><circle r="150" fill="${bg}" filter="url(#sh)"/><g clip-path="url(#${id})"><g transform="translate(0 58)">${p}</g></g>`;

// Props
function paper({ w = 150, h = 200, head = THEME.green2, lines = 5, badge = 'PDF', tick = false, title = '' } = {}) {
    let o = `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="14" fill="#fff" filter="url(#sh)"/>`;
    o += `<path d="M${-w / 2} ${-h / 2 + 14} Q${-w / 2} ${-h / 2} ${-w / 2 + 14} ${-h / 2} H${w / 2 - 14} Q${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + 14} V${-h / 2 + 46} H${-w / 2}Z" fill="${head}"/>`;
    o += title ? T(-w / 2 + 16, -h / 2 + 31, title, 16, '#fff', 'start') : `<rect x="${-w / 2 + 16}" y="${-h / 2 + 16}" width="${w * .42}" height="8" rx="4" fill="#fff" opacity=".9"/>`;
    for (let i = 0; i < lines; i++) {
        const y = -h / 2 + 70 + i * ((h - (badge ? 150 : 110)) / Math.max(1, lines - 1));
        o += `<rect x="${-w / 2 + 16}" y="${y}" width="${(i % 3 === 2 ? .5 : .8) * (w - (tick ? 76 : 32))}" height="8" rx="4" fill="#e3e8e4"/>`;
        if (tick) o += `<path d="M${w / 2 - 34} ${y + 4} l6 6 l13 -15" fill="none" stroke="${THEME.green}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    if (badge) o += `<rect x="${w / 2 - 62}" y="${h / 2 - 42}" width="48" height="26" rx="8" fill="${THEME.coral}"/>${T(w / 2 - 38, h / 2 - 23, badge, 15, '#fff')}`;
    return o;
}
function book(color = THEME.green2, w = 110, h = 150) {
    return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="12" fill="${color}" filter="url(#sh)"/><rect x="${-w / 2}" y="${-h / 2}" width="16" height="${h}" rx="8" fill="${shade(color, .2)}"/><rect x="${-w / 2 + 30}" y="${-h / 2 + 28}" width="${w - 60}" height="10" rx="5" fill="#fff" opacity=".85"/><rect x="${-w / 2 + 30}" y="${-h / 2 + 48}" width="${(w - 60) * .6}" height="8" rx="4" fill="#fff" opacity=".6"/>`;
}
const OPENBOOK = `<path d="M-62 -34 Q-31 -50 0 -30 Q31 -50 62 -34 V42 Q31 26 0 46 Q-31 26 -62 42Z" fill="#fff"/><path d="M0 -30 V46" stroke="${THEME.green2}" stroke-width="5"/><path d="M-44 -14 Q-28 -22 -12 -12 M12 -12 Q28 -22 44 -14 M-44 4 Q-28 -4 -12 6 M12 6 Q28 -4 44 4" stroke="${tint(THEME.green2, .6)}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
const MARK = (s = 1) => `<g transform="scale(${s})" filter="url(#sh)"><rect x="-70" y="-70" width="140" height="140" rx="40" fill="url(#gg)"/><g transform="translate(0 4) scale(.86)">${OPENBOOK}</g><g transform="translate(46 -46)">${sparkle('#fff', .45)}</g></g>`;
const laptopBack = (w = 300, h = 190) =>
    `<g filter="url(#sh)"><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="16" fill="${THEME.dark}"/></g><rect x="${-w / 2 + 10}" y="${-h + 10}" width="${w - 20}" height="${h - 20}" rx="10" fill="#17463b"/><g transform="translate(0 ${-h / 2}) scale(.5)"><circle r="40" fill="url(#gg)"/>${sparkle('#fff', 1)}</g><path d="M${-w / 2 - 24} 0 H${w / 2 + 24} L${w / 2 + 8} 16 H${-w / 2 - 8}Z" fill="#cfd8d2"/>`;
const BELL = `<path d="M0 -70 Q-56 -64 -56 0 V30 L-72 52 H72 L56 30 V0 Q56 -64 0 -70Z" fill="${THEME.sun}" filter="url(#sh)"/><circle cy="-76" r="10" fill="#e8ab1e"/><path d="M-20 60 Q0 86 20 60Z" fill="#e8ab1e"/><path d="M-34 -30 Q-40 -10 -40 10" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".5"/>`;
const ENVELOPE = `<rect x="-95" y="-65" width="190" height="130" rx="20" fill="#fff" filter="url(#sh)"/><path d="M-95 -45 Q-95 -65 -75 -65 H75 Q95 -65 95 -45 L0 14Z" fill="#dff3e6"/><path d="M-95 60 L-30 4 M95 60 L30 4" stroke="#e3e8e4" stroke-width="6" stroke-linecap="round"/>`;
const AI_ORB = `<circle r="70" fill="url(#gg)" filter="url(#sh)"/><g ${an('spin', 8, 0, [0, 0])}><circle r="94" fill="none" stroke="${THEME.green}" stroke-width="6" stroke-dasharray="4 24" stroke-linecap="round"/></g><g transform="scale(1.7)">${sparkle('#fff')}</g><g transform="translate(34 -36)">${sparkle('#fff', .6)}</g>`;

// Icon glyphs (≈ ±16, white, drawn on a coloured circle)
const GL = {
    maths: `<path d="M-11 0 H11 M0 -11 V11" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
    physics: [0, 60, 120].map(r => `<ellipse rx="16" ry="7" fill="none" stroke="#fff" stroke-width="3" transform="rotate(${r})"/>`).join('') + `<circle r="3.5" fill="#fff"/>`,
    chem: `<path d="M-5 -15 H5 V-4 L15 13 Q17 17 13 17 H-13 Q-17 17 -15 13 L-5 -4Z" fill="#fff"/>`,
    bio: `<path d="M-13 12 Q-15 -13 13 -15 Q15 13 -13 12Z" fill="#fff"/>`,
    acc: `<circle r="14" fill="none" stroke="#fff" stroke-width="3.5"/>${T(0, 7, '$', 18, '#fff')}`,
    more: [-11, 0, 11].map(x => `<circle cx="${x}" cy="0" r="3.8" fill="#fff"/>`).join(''),
    cap: `<path d="M0 -13 L26 -2 L0 9 L-26 -2Z" fill="#fff"/><path d="M-14 5 V16 Q0 24 14 16 V5 L0 11Z" fill="#fff" opacity=".85"/>`,
    bag: `<path d="M-14 -4 H14 L12 18 H-12Z" fill="#fff"/><path d="M-7 -4 V-9 Q0 -18 7 -9 V-4" stroke="#fff" stroke-width="3.5" fill="none"/>`,
    monitor: `<rect x="-16" y="-14" width="32" height="22" rx="4" fill="#fff"/><rect x="-8" y="11" width="16" height="4" rx="2" fill="#fff"/>`,
    wrench: `<g transform="rotate(-45)"><rect x="-4" y="-14" width="8" height="32" rx="3" fill="#fff"/><circle cy="-15" r="9" fill="#fff"/></g>`,
    qpaper: `<path d="M-11 -16 H4 L12 -8 V16 H-11Z" fill="#fff"/><path d="M-5 -2 H6 M-5 5 H6" stroke="rgba(0,0,0,.25)" stroke-width="3" stroke-linecap="round"/>`,
    notes: `<rect x="-13" y="-16" width="26" height="32" rx="5" fill="#fff"/><path d="M-6 -6 H7 M-6 1 H7 M-6 8 H2" stroke="rgba(0,0,0,.25)" stroke-width="3" stroke-linecap="round"/>`,
    plan: `<rect x="-15" y="-13" width="30" height="28" rx="5" fill="#fff"/><rect x="-15" y="-13" width="30" height="9" rx="4" fill="rgba(0,0,0,.25)"/><path d="M-8 3 H8 M-8 9 H2" stroke="rgba(0,0,0,.25)" stroke-width="3" stroke-linecap="round"/>`,
    txt: T(0, 9, 'Aa', 24, '#fff')
};
const dot = (color, glyph, r = 30, s = 1) => `<circle r="${r}" fill="${color}"/><g transform="scale(${s})">${glyph}</g>`;

// expose the library for preview sheets (non-enumerable: ignored by the engine)
const ILLO = { person, desk, avatar, paper, book, MARK, OPENBOOK, laptopBack, BELL, ENVELOPE, AI_ORB, GL, dot, sparkle, checkBadge, card, pill, bubble, typing };

// ── scene engine (identical to the solar/baileys config) ────────
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
  .pop{animation-name:pop;--n:1;--dir:normal;--e:cubic-bezier(.2,1.6,.4,1)}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.06);opacity:.92}}
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
  @keyframes wobble{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
  @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:.12}}
  @keyframes ring{0%{transform:scale(.2);opacity:.9}100%{transform:scale(2.8);opacity:0}}
  @keyframes fadein{from{opacity:0}to{opacity:1}}
  @keyframes pop{from{transform:scale(.4);opacity:0}to{transform:scale(1);opacity:1}}
`;
const THEMES = {
    cream: `background:radial-gradient(900px 700px at 12% 8%,rgba(255,214,170,.55),transparent 60%),radial-gradient(900px 800px at 92% 88%,rgba(197,240,205,.6),transparent 60%),linear-gradient(165deg,#fffaf1,#f7eedb)`,
    mint: `background:radial-gradient(900px 700px at 90% 6%,rgba(255,224,190,.6),transparent 60%),radial-gradient(900px 800px at 8% 92%,rgba(255,244,190,.5),transparent 60%),linear-gradient(170deg,#fbf7ec,#e1f5e3)`,
    peach: `background:radial-gradient(900px 800px at 10% 95%,rgba(205,242,212,.65),transparent 60%),radial-gradient(800px 600px at 90% 5%,rgba(255,236,170,.5),transparent 60%),linear-gradient(170deg,#fff7ec,#fde3cd)`
};
const DEFS = `<defs>
    <filter id="sh" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#1d2b25" flood-opacity=".14"/></filter>
    <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3be07f"/><stop offset="1" stop-color="#0f9d73"/></linearGradient>
    <radialGradient id="blA"><stop offset="0" stop-color="#ffd9b8" stop-opacity=".9"/><stop offset="1" stop-color="#ffd9b8" stop-opacity="0"/></radialGradient>
    <radialGradient id="blB"><stop offset="0" stop-color="#c9f2d0" stop-opacity=".9"/><stop offset="1" stop-color="#c9f2d0" stop-opacity="0"/></radialGradient>
    <radialGradient id="blC"><stop offset="0" stop-color="#fff0b3" stop-opacity=".9"/><stop offset="1" stop-color="#fff0b3" stop-opacity="0"/></radialGradient>
  </defs>`;
function comicScene({ badge, badgeColor, theme = 'cream', groups }) {
    const rm = {}, hm = {}, fb = [], hfb = [];
    groups.forEach(g => {
        if (g.always) return;
        if (g.w) (rm[g.w] = rm[g.w] || []).push(g.id);
        if (g.t !== undefined) fb.push([g.id, g.t]);
        if (g.hw) (hm[g.hw] = hm[g.hw] || []).push(g.id);
        if (g.ht !== undefined) hfb.push([g.id, g.ht]);
    });
    const bc = badgeColor || THEME.deep;
    const gh = groups.map(g => `<g transform="translate(${g.x || 0} ${g.y || 0})"><g transform="scale(${g.s || 1})"><g id="${g.id}" class="${g.always ? 'always' : 'revealgrp'}">${g.svg}</g></g></g>`).join('\n');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:1080px;height:1920px;overflow:hidden;${THEMES[theme]};font-family:${FI};color:${THEME.ink}}
  .badge{position:absolute;top:120px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:16px;background:#fff;color:${bc};
    font:800 44px ${FI};padding:16px 42px 16px 30px;border-radius:999px;box-shadow:0 12px 34px ${THEME.shadow};white-space:nowrap;z-index:10;opacity:0;transition:opacity .4s ease}
  .badge::before{content:'';width:20px;height:20px;border-radius:50%;background:${THEME.green}}
  .badge.on{opacity:1}
  svg#stage{position:absolute;left:40px;top:260px;width:1000px;height:1480px;overflow:visible}
  .revealgrp{opacity:0;transform:translateY(34px) scale(.86);transform-box:fill-box;transform-origin:center;transition:opacity .45s ease,transform .6s cubic-bezier(.2,1.5,.4,1)}
  .revealgrp.on{opacity:1;transform:none}
  .revealgrp.fadeout{opacity:0 !important;transform:translateY(-20px) scale(.9) !important;pointer-events:none}
  ${CSS_ANIM}
</style></head><body>
  <div class="badge" id="badge">${badge}</div>
  <svg id="stage" viewBox="0 0 1000 1480" xmlns="http://www.w3.org/2000/svg">
    ${DEFS}
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
const stuWorry = `${person({ skin: SKIN.deep, style: 'short', top: THEME.green2, mood: 'worry', arms: 'desk' })}${desk(780)}
  <g transform="translate(-250 98) rotate(-8) scale(.8)">${paper({ w: 150, h: 200, lines: 4, badge: '' })}</g>
  <g transform="translate(-160 112) rotate(6) scale(.7)">${paper({ w: 150, h: 200, head: THEME.coral, lines: 4, badge: '' })}</g>
  <g transform="translate(250 108) rotate(4)">${book(THEME.coral, 100, 130)}</g>`;
const stuHappy = `${person({ skin: SKIN.deep, style: 'short', top: THEME.green2, mood: 'happy', arms: 'desk' })}${desk(780)}
  <g transform="translate(-170 176)">${laptopBack(280, 170)}</g>
  <g transform="translate(250 108) rotate(4)">${book(THEME.sky, 100, 130)}</g>
  <g transform="translate(300 20)">${sparkle(THEME.sun, 1.2)}</g><g transform="translate(-300 -40)">${sparkle(THEME.green, .9)}</g>`;
S.push(scene(THEME.paper,
 "Studying for ZIMSEC? Stop hunting for past papers. Meet books dot co dot zed double you. And it is completely free.",
 comicScene({ badge: 'For ZIMSEC students', theme: 'cream', groups: [
  { id: 'bl', always: true, svg: blobs(2) },
  { id: 'stuW', x: 500, y: 480, s: 1.15, w: 'studying', t: .2, hw: 'meet', ht: 3.5, svg: stuWorry },
  { id: 'qm', x: 500, y: 480, s: 1.15, w: 'hunting', t: 1.9, hw: 'meet', ht: 3.5, svg: [[-190, -190, -10], [190, -170, 12], [20, -270, 0]].map(([x, y, r], i) => `<g ${an('bob', 1 + i * .2, i * .25)}>${T(x, y, '?', 100, THEME.coral, 'middle', FI, `transform="rotate(${r} ${x} ${y})"`)}</g>`).join('') },
  { id: 'fly', x: 500, y: 480, s: 1.15, w: 'past', t: 2.4, hw: 'meet', ht: 3.5, svg: [[-330, -40, -18, .7], [330, -10, 14, .7], [-290, 170, 8, .55]].map(([x, y, r, s], i) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><g ${an('float', 2 + i * .4, i * .3)}>${paper({ w: 150, h: 200, head: [THEME.green2, THEME.coral, THEME.sky][i], lines: 4, badge: '' })}</g></g>`).join('') },
  { id: 'stuH', x: 500, y: 480, s: 1.15, w: 'meet', t: 3.6, svg: stuHappy },
  { id: 'logo', x: 500, y: 985, w: 'books', t: 4.0, svg: `<g ${an('float', 3)}>${MARK(1.5)}</g>${T(0, 200, 'books.co.zw', 104, THEME.deep)}<g transform="translate(0 290)">${pill(560, 76, '#fff', 'Free study + career platform', 30, THEME.green2)}</g>` },
  { id: 'free', x: 500, y: 1400, w: 'free', t: 8.0, svg: `<g transform="rotate(-4)"><g ${an('pulse', 1)}>${pill(420, 96, THEME.sun, '100% free', 56, INK)}</g></g>${sparks(-250, -20, 8, THEME.coral, 26, .6)}${sparks(250, -20, 8, THEME.green, 26, .6)}` }
 ]})));

// ── 1 PAST PAPERS ───────────────────────────────────────────────
const lvl = (id, w, t, x, label, sub, color) => ({ id, x, y: 230, w, t, svg: `${card(400, 190, '#fff', 44)}<g transform="translate(-125 0)">${dot(color, GL.cap, 52, 1.5)}</g>${T(-55, -2, label, 54, INK, 'start')}${M(-55, 44, sub, 24, THEME.muted, 'start')}` });
const subj = (id, w, t, x, y, label, glyph, color) => ({ id, x, y, w, t, svg: `<rect x="-135" y="-45" width="270" height="90" rx="45" fill="#fff" filter="url(#sh)"/><g transform="translate(-90 0)">${dot(color, glyph)}</g>${T(-48, 11, label, 30, INK, 'start')}` });
S.push(scene(THEME.paper,
 "Download free O Level and A Level past papers, with marking schemes. Maths, sciences, accounts, and more.",
 comicScene({ badge: 'Past papers', theme: 'mint', groups: [
  { id: 'bl', always: true, svg: blobs(5) },
  lvl('ol', 'level', 1.6, 270, 'O Level', 'past papers', THEME.green2),
  lvl('al', 'a', 2.3, 730, 'A Level', 'past papers', THEME.coral),
  { id: 'dl', x: 330, y: 700, w: 'download', t: .2, svg: `<g transform="scale(1.5)">${paper({ w: 170, h: 230, head: THEME.green2, lines: 5, badge: 'PDF', title: 'Mathematics' })}</g><g transform="translate(125 170)"><g ${an('bob', .9)}><circle r="44" fill="url(#gg)" filter="url(#sh)"/><path d="M0 -16 V14 M-14 2 L0 16 L14 2" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></g>` },
  { id: 'ms', x: 670, y: 700, w: 'marking', t: 4.0, svg: `<g transform="scale(1.5)">${paper({ w: 170, h: 230, head: THEME.deep, lines: 5, badge: '', tick: true, title: 'Marking scheme' })}</g><g transform="translate(125 170)"><g ${an('pulse', 1)}>${checkBadge(44)}</g></g>` },
  { id: 'fr', x: 500, y: 1010, w: 'free', t: .9, svg: pill(520, 80, THEME.green, 'Free PDF downloads', 36) },
  subj('s1', 'maths', 5.2, 175, 1190, 'Maths', GL.maths, THEME.green2),
  subj('s2', 'sciences', 5.7, 500, 1190, 'Physics', GL.physics, THEME.sky),
  subj('s3', 'sciences', 5.7, 825, 1190, 'Chemistry', GL.chem, THEME.coral),
  subj('s4', 'sciences', 5.7, 175, 1310, 'Biology', GL.bio, THEME.green),
  subj('s5', 'accounts', 6.1, 500, 1310, 'Accounts', GL.acc, '#e8ab1e'),
  subj('s6', 'more', 6.6, 825, 1310, 'and more', GL.more, THEME.muted)
 ]})));

// ── 2 AI AGENT ──────────────────────────────────────────────────
const docCard = (id, w, t, y, color, title, sub, glyph) => ({ id, x: 500, y, w, t, svg: `${card(780, 170, '#fff', 40)}<rect x="-340" y="-55" width="110" height="110" rx="30" fill="${color}"/><g transform="translate(-285 0) scale(1.9)">${glyph}</g>${T(-200, -6, title, 44, INK, 'start')}${M(-200, 40, sub, 26, THEME.muted, 'start')}<g transform="translate(320 0)"><g ${an('pop', .5)}>${checkBadge(30)}</g></g>` });
S.push(scene(THEME.paper,
 "Need something new? Ask the AI agent to write a question paper, study notes, or a full lesson plan.",
 comicScene({ badge: 'AI agent', theme: 'peach', groups: [
  { id: 'bl', always: true, svg: blobs(8) },
  { id: 'u', x: 620, y: 270, w: 'ask', t: 1.6, svg: `${bubble(520, 120, THEME.mint, 'right')}${T(0, 14, 'Make me a Maths paper', 36)}` },
  { id: 'ai', x: 170, y: 480, w: 'ai', t: 2.2, svg: `<g ${an('float', 3)}>${AI_ORB}</g>` },
  { id: 'ag', x: 290, y: 492, w: 'agent', t: 2.7, svg: T(0, 0, 'AI agent', 56, THEME.deep, 'start') },
  { id: 'typ', x: 520, y: 650, w: 'write', t: 3.2, hw: 'question', ht: 3.8, svg: `${bubble(200, 100, '#fff', 'left')}${typing()}` },
  docCard('d1', 'question', 3.8, 800, THEME.green2, 'Question paper', 'with a marking scheme', GL.qpaper),
  docCard('d2', 'study', 4.9, 1000, THEME.coral, 'Study notes', 'any topic, any subject', GL.notes),
  docCard('d3', 'lesson', 6.4, 1200, THEME.sky, 'Lesson plan', 'objectives + activities', GL.plan),
  { id: 'tag', x: 500, y: 1390, w: 'plan', t: 7.2, svg: `<g ${an('pulse', 1.2)}>${T(0, 0, 'Just describe what you need.', 44, THEME.green2)}</g>` }
 ]})));

// ── 3 CV + TEMPLATES ────────────────────────────────────────────
const cvRows = [[-50, -232, 210, 16], [-50, -204, 140, 10], [-180, -118, 120, 14], [-180, -88, 340, 10], [-180, -64, 300, 10], [-180, -40, 220, 10],
                [-180, 20, 120, 14], [-180, 50, 340, 10], [-180, 74, 280, 10], [-180, 98, 320, 10], [-180, 160, 120, 14], [-180, 190, 340, 10], [-180, 214, 260, 10]];
const cvBase = `<defs><clipPath id="cvav"><circle cx="-120" cy="-215" r="48"/></clipPath></defs>
  <rect x="-210" y="-280" width="420" height="560" rx="26" fill="#fff" filter="url(#sh)"/>
  <path d="M-210 -254 Q-210 -280 -184 -280 H184 Q210 -280 210 -254 V-150 H-210Z" fill="${THEME.green2}"/>
  <circle cx="-120" cy="-215" r="52" fill="#fff"/><g clip-path="url(#cvav)"><circle cx="-120" cy="-215" r="48" fill="${THEME.mint}"/><circle cx="-120" cy="-228" r="20" fill="${SKIN.deep}"/><path d="M-160 -166 Q-160 -202 -120 -202 Q-80 -202 -80 -166Z" fill="${THEME.sky}"/></g>
  ${cvRows.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${y < -150 ? 'rgba(255,255,255,.35)' : '#e3e8e4'}"/>`).join('')}`;
const cvFill = cvRows.map(([x, y, w, h], i) => `<g ${an('growx', .45, i * .22, 'left')}><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${y < -150 ? '#fff' : (h > 12 ? THEME.green2 : '#9fb3a8')}"/></g>`).join('');
const thumb = (kind, color) => `${card(220, 280, '#fff', 26)}` + ({
    top: `<path d="M-110 -114 Q-110 -140 -84 -140 H84 Q110 -140 110 -114 V-60 H-110Z" fill="${color}"/>`,
    side: `<path d="M-110 -114 Q-110 -140 -84 -140 H-40 V140 H-84 Q-110 140 -110 114Z" fill="${color}"/>`,
    ring: `<circle cy="-80" r="36" fill="${color}"/>`
}[kind]) + [0, 1, 2, 3, 4].map(i => `<rect x="${kind === 'side' ? -22 : -86}" y="${kind === 'ring' ? -20 + i * 28 : -30 + i * 30}" width="${(i % 3 === 2 ? 70 : 108) * (kind === 'side' ? .8 : 1.1)}" height="9" rx="4.5" fill="#e3e8e4"/>`).join('');
S.push(scene(THEME.paper,
 "Building a CV? Pick a ready made template and just fill in the blanks. Cover letters too.",
 comicScene({ badge: 'CVs & templates', theme: 'cream', groups: [
  { id: 'bl', always: true, svg: blobs(12) },
  { id: 'cv', x: 340, y: 590, w: 'cv', t: 1.0, svg: cvBase },
  { id: 'fill', x: 340, y: 590, w: 'fill', t: 3.6, svg: cvFill },
  { id: 'tick', x: 560, y: 320, w: 'blanks', t: 4.6, svg: `<g ${an('pop', .6)}>${checkBadge(46)}</g><g transform="translate(62 -50)"><g ${an('twinkle', 1.2)}>${sparkle(THEME.sun, 1)}</g></g><g transform="translate(-66 52)"><g ${an('twinkle', 1.2, .4)}>${sparkle(THEME.coral, .7)}</g></g>` },
  { id: 'cl', x: 790, y: 660, w: 'cover', t: 5.4, svg: `<g transform="rotate(6)">${card(280, 380, '#fff', 24)}${M(-112, -140, 'Dear Hiring', 22, THEME.green2, 'start')}${M(-112, -112, 'Manager,', 22, THEME.green2, 'start')}${[0, 1, 2, 3, 4, 5].map(i => `<rect x="-112" y="${-70 + i * 30}" width="${i % 3 === 2 ? 130 : 224}" height="10" rx="5" fill="#e3e8e4"/>`).join('')}<g transform="translate(70 150)">${sparkle(THEME.sun, .9)}</g></g>${T(0, 250, 'Cover letters', 34, INK)}` },
  { id: 'pk', x: 500, y: 985, w: 'pick', t: 1.7, svg: T(0, 0, 'Pick a template', 50, THEME.deep) },
  { id: 'tp1', x: 200, y: 1200, w: 'template', t: 2.7, svg: `<g ${an('float', 2.6)}>${thumb('top', THEME.green2)}</g>` },
  { id: 'tp2', x: 500, y: 1200, w: 'template', t: 2.7, svg: `<g ${an('float', 2.6, .3)}>${thumb('side', THEME.coral)}<rect x="-118" y="-148" width="236" height="296" rx="30" fill="none" stroke="${THEME.green}" stroke-width="7"/></g>` },
  { id: 'tp3', x: 800, y: 1200, w: 'template', t: 2.7, svg: `<g ${an('float', 2.6, .6)}>${thumb('ring', THEME.sky)}</g>` }
 ]})));

// ── 4 JOB ALERTS ────────────────────────────────────────────────
const phoneSvg = `<g filter="url(#sh)"><rect x="-190" y="-380" width="380" height="760" rx="62" fill="${THEME.dark}"/></g><rect x="-172" y="-362" width="344" height="724" rx="48" fill="#f4fbf6"/><rect x="-50" y="-346" width="100" height="26" rx="13" fill="${THEME.dark}"/>${T(0, -270, 'Job alerts', 42, THEME.deep)}`;
const jobCard = (id, w, t, y, color, glyph, title) => ({ id, x: 500, y: 800 + y, w, t, svg: `${card(300, 112, '#fff', 30)}<g transform="translate(-100 0)">${dot(color, glyph, 34, 1.15)}</g>${T(-50, -2, title, 36, INK, 'start')}${M(-50, 32, 'hiring now', 20, THEME.muted, 'start')}` });
S.push(scene(THEME.paper,
 "And get free job alerts emailed straight to you. Teaching, retail, IT, trades, and more.",
 comicScene({ badge: 'Job alerts', theme: 'mint', groups: [
  { id: 'bl', always: true, svg: blobs(17) },
  { id: 'fr', x: 500, y: 175, w: 'free', t: .9, svg: pill(500, 80, THEME.green, 'Free job alerts', 40) },
  { id: 'ph', x: 500, y: 800, w: 'job', t: 1.1, svg: phoneSvg },
  { id: 'bell', x: 150, y: 350, w: 'alerts', t: 1.5, svg: `<g ${an('wobble', .7, 0, 'top')}><g transform="scale(1.1)">${BELL}</g></g><g transform="translate(52 -70)"><g ${an('pulse', .8)}><circle r="22" fill="${THEME.coral}"/>${T(0, 9, '1', 26, '#fff')}</g></g>` },
  { id: 'env', x: 850, y: 350, w: 'emailed', t: 2.2, svg: `<g ${an('float', 2.2)}><g transform="scale(.95)">${ENVELOPE}</g><g transform="translate(70 -58)">${checkBadge(26)}</g></g>${sparks(-110, -70, 6, THEME.sun, 26, .6)}` },
  jobCard('j1', 'teaching', 4.0, -170, THEME.sky, GL.cap, 'Teaching'),
  jobCard('j2', 'retail', 4.5, -40, THEME.coral, GL.bag, 'Retail'),
  jobCard('j3', 'it', 5.0, 90, THEME.green2, GL.monitor, 'IT'),
  jobCard('j4', 'trades', 5.4, 220, '#e8ab1e', GL.wrench, 'Trades'),
  { id: 'mo', x: 500, y: 1300, w: 'more', t: 6.0, svg: `<g ${an('pulse', 1.2)}>${pill(300, 80, '#fff', 'and more', 40, THEME.deep)}</g>` }
 ]})));

// ── 5 CTA ───────────────────────────────────────────────────────
const who = (id, w, t, x, bg, p, label, col) => ({ id, x, y: 640, w, t, svg: `${avatar('cp' + id, bg, p)}<g transform="translate(0 210)">${pill(label.length * 22 + 70, 64, col, label, 30)}</g>` });
S.push(scene(THEME.paper,
 "It's free for Zimbabwean students, teachers and job seekers. Visit books dot co dot zed double you, and start today.",
 comicScene({ badge: 'books.co.zw', theme: 'peach', groups: [
  { id: 'bl', always: true, svg: blobs(21) },
  { id: 'f1', x: 500, y: 190, w: 'free', t: .6, svg: T(0, 0, 'Free for', 70, INK) },
  { id: 'f2', x: 500, y: 290, w: 'zimbabwean', t: 1.3, svg: T(0, 0, 'Zimbabwe', 100, THEME.green2) },
  who('w1', 'students', 1.9, 190, '#c9f2d0', person({ skin: SKIN.deep, style: 'short', top: THEME.green2 }), 'Students', THEME.green2),
  who('w2', 'teachers', 2.4, 500, '#ffd9bf', person({ skin: SKIN.mid, style: 'bun', top: THEME.coral }), 'Teachers', THEME.coral),
  who('w3', 'seekers', 3.4, 810, '#cfdcff', person({ skin: SKIN.dark, style: 'afro', top: THEME.sky }), 'Job seekers', THEME.sky),
  { id: 'url', x: 500, y: 1040, w: 'books', t: 4.9, svg: `${card(860, 190, '#fff', 50)}<g transform="translate(-345 0)">${MARK(.95)}</g>${T(-250, 32, 'books.co.zw', 92, THEME.deep, 'start')}` },
  { id: 'cta', x: 500, y: 1290, w: 'start', t: 7.0, svg: `<g ${an('pulse', .9)}>${pill(460, 100, THEME.green, 'Start today', 52)}</g>${sparks(-290, 0, 8, THEME.sun, 28, .6)}${sparks(290, 0, 8, THEME.coral, 28, .6)}` }
 ]})));

// ── export ──────────────────────────────────────────────────────
const TRANS = ['fade', 'wipe-left', 'fade', 'wipe-up', 'fade', 'wipe-left'];
module.exports = {
    output: { title: 'books-co-zw-ad', format: 'portrait', fps: 30, crf: 23, preset: 'medium' },
    defaults: { voice: 'am_adam', speed: 1.02, transition: 'fade', transitionDuration: 0.3 },
    scenes: S.map((s, i) => Object.assign(s, { transition: TRANS[i] || 'fade' })),
};
Object.defineProperty(module.exports, '_illo', { value: ILLO, enumerable: false });