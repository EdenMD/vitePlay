// config.booksco-library-ad.js
// books.co.zw LIBRARY ad — APEX Video Engine config (same architecture as the solar / baileys / booksco configs)
// Focus: the Library (search novels, question papers, marking schemes, study notes; share a paper to grow it).
// Voice-over avoids "ZIMSEC" (TTS can't pronounce it) -> says "question papers".
// Style: WhatsApp-ad look — cream gradients, flat vector, soft shadows, spring pop-ins + the ILLUSTRATION LIBRARY.
// v1.1: visuals slowed x1.5 (SLOW), voice af_heart @ 0.94, transition 0.25s.
// 5 scenes (~35s): hook -> search -> what's inside -> share a paper -> CTA

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
// The engine speeds visuals up when compiling to video, so every animation is slowed x1.5 here.
const SLOW = 1.5;
const ORG = { top: '50% 0%', bottom: '50% 100%', left: '0% 50%', right: '100% 50%', center: '50% 50%' };
function an(cls, d = 2, dl = 0, o = 'center', extra = '') {
    const org = Array.isArray(o)
        ? `transform-box:view-box;transform-origin:${o[0]}px ${o[1]}px;`
        : `transform-box:fill-box;transform-origin:${ORG[o] || o};`;
    return `class="a ${cls}" style="--d:${(d * SLOW).toFixed(2)}s;--dl:${(dl * SLOW).toFixed(2)}s;${org}${extra}"`;
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

// ── library additions (v2): shelves, search, upload, timer, notebook ──
function shelf(w = 860, rows = 2, seed = 3, gap = 0, rowH = 210) {
    const rnd = rng(seed), cols = [THEME.green2, THEME.coral, THEME.sky, THEME.sun, THEME.deep, THEME.green, '#b78cf0', '#ff9f68'];
    const H = rows * rowH + 24;
    let o = `<g filter="url(#sh)"><rect x="${-w / 2}" y="${-H / 2}" width="${w}" height="${H}" rx="28" fill="#f7e8c9"/></g><rect x="${-w / 2 + 8}" y="${-H / 2 + 8}" width="${w - 16}" height="${H - 16}" rx="22" fill="none" stroke="#dcb985" stroke-width="16"/>`;
    for (let r = 0; r < rows; r++) {
        const by = -H / 2 + 12 + (r + 1) * rowH;
        let x = -w / 2 + 34;
        for (;;) {
            const bw = 34 + Math.floor(rnd() * 28), bh = 100 + Math.floor(rnd() * (rowH - 150)), c = cols[Math.floor(rnd() * cols.length)];
            if (x + bw > w / 2 - 34 - gap) break;
            o += `<rect x="${x}" y="${by - bh}" width="${bw}" height="${bh}" rx="7" fill="${c}"/><rect x="${x}" y="${by - bh + 20}" width="${bw}" height="7" fill="#fff" opacity=".65"/><rect x="${x + bw * .25}" y="${by - bh + 44}" width="${bw * .5}" height="${Math.min(40, bh - 70)}" rx="4" fill="#fff" opacity=".25"/>`;
            x += bw + 7;
        }
        o += `<rect x="${-w / 2 + 14}" y="${by}" width="${w - 28}" height="16" rx="8" fill="#dcb985"/>`;
    }
    return o;
}
const MAGNIFIER = (col = '#fff') => `<circle cx="-5" cy="-5" r="15" fill="none" stroke="${col}" stroke-width="5"/><line x1="7" y1="7" x2="18" y2="18" stroke="${col}" stroke-width="6" stroke-linecap="round"/>`;
const CLOUD_UP = `<path d="M-70 36 Q-112 36 -112 -4 Q-112 -42 -72 -44 Q-60 -90 -8 -90 Q42 -90 54 -46 Q104 -46 106 -4 Q106 36 66 36Z" fill="#fff" filter="url(#sh)"/><path d="M0 18 V-38 M-24 -14 L0 -40 L24 -14" fill="none" stroke="${THEME.green2}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
const STOPWATCH = `<rect x="-11" y="-92" width="22" height="18" rx="6" fill="${THEME.green2}"/><circle r="62" fill="#fff" filter="url(#sh)"/><circle r="62" fill="none" stroke="${THEME.green2}" stroke-width="10"/>${[0, 90, 180, 270].map(a => `<line x1="0" y1="-50" x2="0" y2="-42" stroke="${THEME.muted}" stroke-width="5" stroke-linecap="round" transform="rotate(${a})"/>`).join('')}<g ${an('spin', 2, 0, [0, 0])}><line x1="0" y1="0" x2="0" y2="-38" stroke="${THEME.coral}" stroke-width="7" stroke-linecap="round"/></g><circle r="7" fill="${THEME.ink}"/>`;
const NOTEBOOK = `<rect x="-62" y="-82" width="124" height="164" rx="16" fill="${THEME.sun}" filter="url(#sh)"/>${[-56, -28, 0, 28, 56].map(y => `<circle cx="-62" cy="${y}" r="7" fill="${shade(THEME.sun, .25)}"/>`).join('')}<rect x="-36" y="-52" width="74" height="10" rx="5" fill="#fff" opacity=".9"/>${[-24, -2, 20, 42].map((y, i) => `<rect x="-36" y="${y}" width="${i % 2 ? 54 : 74}" height="8" rx="4" fill="#fff" opacity=".6"/>`).join('')}`;
const G_TICK = `<path d="M-12 0 l8 9 l16 -18" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

const ILLO = { person, desk, avatar, paper, book, MARK, OPENBOOK, laptopBack, BELL, ENVELOPE, AI_ORB, GL, dot, sparkle, checkBadge, card, pill, bubble, typing, shelf, MAGNIFIER, CLOUD_UP, STOPWATCH, NOTEBOOK };

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
  .shrinkx{animation-name:shrinkx;--n:1;--dir:normal;--e:steps(11,end)}
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
  @keyframes shrinkx{from{transform:scaleX(1)}to{transform:scaleX(0)}}
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
    const TSCALE = 1.02 / 0.94; // fallback times were written for speed 1.02
    const rm = {}, hm = {}, fb = [], hfb = [];
    groups.forEach(g => {
        if (g.always) return;
        if (g.w) (rm[g.w] = rm[g.w] || []).push(g.id);
        if (g.t !== undefined) fb.push([g.id, +(g.t * TSCALE).toFixed(2)]);
        if (g.hw) (hm[g.hw] = hm[g.hw] || []).push(g.id);
        if (g.ht !== undefined) hfb.push([g.id, +(g.ht * TSCALE).toFixed(2)]);
    });
    const bc = badgeColor || THEME.deep;
    const gh = groups.map(g => `<g transform="translate(${g.x || 0} ${g.y || 0})"><g transform="scale(${g.s || 1})"><g id="${g.id}" class="${g.always ? 'always' : 'revealgrp'}">${g.svg}</g></g></g>`).join('\n');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:1080px;height:1920px;overflow:hidden;${THEMES[theme]};font-family:${FI};color:${THEME.ink}}
  .badge{position:absolute;top:120px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:16px;background:#fff;color:${bc};
    font:800 44px ${FI};padding:16px 42px 16px 30px;border-radius:999px;box-shadow:0 12px 34px ${THEME.shadow};white-space:nowrap;z-index:10;opacity:0;transition:opacity .6s ease}
  .badge::before{content:'';width:20px;height:20px;border-radius:50%;background:${THEME.green}}
  .badge.on{opacity:1}
  svg#stage{position:absolute;left:40px;top:260px;width:1000px;height:1480px;overflow:visible}
  .revealgrp{opacity:0;transform:translateY(34px) scale(.86);transform-box:fill-box;transform-origin:center;transition:opacity .68s ease,transform .9s cubic-bezier(.2,1.5,.4,1)}
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

// ── 0 HOOK: everything in one place ─────────────────────────────
const P_CURIOUS = person({ skin: SKIN.deep, style: 'short', top: THEME.green2, mood: 'worry' });
const P_HAPPY = person({ skin: SKIN.deep, style: 'short', top: THEME.green2, mood: 'happy' });
const urlCard = (mk = .62, size = 72) => `${card(860, 150, '#fff', 50)}<g transform="translate(-340 0)">${MARK(mk)}</g>${T(-270, size * .36, 'books.co.zw', size, THEME.deep, 'start')}`;
S.push(scene(THEME.paper,
 "Need question papers, novels or study notes? They are all in one place. The books dot co dot zed double you library.",
 comicScene({ badge: 'The library', theme: 'cream', groups: [
  { id: 'bl', always: true, svg: blobs(3) },
  { id: 'avW', x: 500, y: 330, w: 'need', t: .2, hw: 'place', ht: 4.6, svg: avatar('ca', '#ffd9bf', P_CURIOUS) },
  { id: 'qm', x: 500, y: 330, w: 'need', t: .5, hw: 'place', ht: 4.6, svg: [[-170, -165, -10], [170, -150, 12]].map(([x, y, r], i) => `<g ${an('bob', 1 + i * .2, i * .25)}>${T(x, y, '?', 84, THEME.coral, 'middle', FI, `transform="rotate(${r} ${x} ${y})"`)}</g>`).join('') },
  { id: 'avH', x: 500, y: 330, w: 'place', t: 4.7, svg: avatar('cb', '#c9f2d0', P_HAPPY) },
  { id: 'qp', x: 150, y: 330, w: 'question', t: .8, svg: `<g transform="rotate(-10)"><g ${an('float', 2.4)}>${paper({ w: 150, h: 200, lines: 4, badge: 'PDF' })}</g></g>` },
  { id: 'nv', x: 850, y: 330, w: 'novels', t: 1.5, svg: `<g transform="rotate(10)"><g ${an('float', 2.6, .3)}>${book(THEME.coral, 120, 170)}</g></g>` },
  { id: 'sn', x: 500, y: 600, w: 'notes', t: 2.6, svg: `<g ${an('float', 2.2, .5)}><g transform="scale(.8)">${NOTEBOOK}</g></g>` },
  { id: 'sf', x: 500, y: 940, w: 'place', t: 4.7, svg: shelf(860, 2, 3) },
  { id: 'url', x: 500, y: 1285, w: 'books', t: 5.7, svg: urlCard() },
  { id: 'lib', x: 500, y: 1415, w: 'library', t: 8.4, svg: `<g transform="rotate(-3)"><g ${an('pulse', 1)}>${pill(400, 84, THEME.sun, 'The library', 46, INK)}</g></g>${sparks(-240, 0, 8, THEME.coral, 26, .6)}${sparks(240, 0, 8, THEME.green, 26, .6)}` }
 ]})));

// ── 1 SEARCH: subject, level, year ──────────────────────────────
const fchip = (id, w, t, x, label, color) => ({ id, x, y: 430, w, t, svg: `<rect x="-135" y="-42" width="270" height="84" rx="42" fill="#fff" filter="url(#sh)"/><circle cx="-92" cy="0" r="16" fill="${color}"/>${T(-62, 11, label, 32, INK, 'start')}<path d="M92 -5 L102 6 L112 -5" fill="none" stroke="${THEME.muted}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` });
const resRow = (id, w, t, y, title, sub, color, glyph) => ({ id, x: 500, y, w, t, svg: `${card(860, 150, '#fff', 40)}<rect x="-390" y="-45" width="90" height="90" rx="26" fill="${color}"/><g transform="translate(-345 0) scale(1.7)">${glyph}</g>${T(-275, -6, title, 38, INK, 'start')}${M(-275, 34, sub, 24, THEME.muted, 'start')}<g transform="translate(305 0)">${pill(150, 62, THEME.green, 'Open', 28)}</g>` });
S.push(scene(THEME.paper,
 "Just search by subject, level and year. Find the exact paper you need, in seconds.",
 comicScene({ badge: 'Search', theme: 'mint', groups: [
  { id: 'bl', always: true, svg: blobs(6) },
  { id: 'sb', x: 500, y: 260, w: 'search', t: .5, svg: `${card(860, 130, '#fff', 65)}<g transform="translate(-370 0)">${dot(THEME.green2, MAGNIFIER('#fff'), 40, 1.4)}</g>${T(-310, 16, 'Mathematics', 46, INK, 'start', FI, 'font-weight="700"')}<rect x="-312" y="-36" width="640" height="72" fill="#fff" ${an('shrinkx', 1.2, .4, 'right')}/><rect x="16" y="-28" width="5" height="56" rx="2" fill="${THEME.green2}" ${an('blink', .9, 1.7)}/>` },
  fchip('f1', 'subject', 1.3, 190, 'Subject', THEME.green2),
  fchip('f2', 'level', 1.8, 500, 'Level', THEME.coral),
  fchip('f3', 'year', 2.4, 810, 'Year', THEME.sky),
  resRow('r1', 'find', 3.2, 640, 'Mathematics Paper 1', 'O Level · PDF', THEME.green2, GL.qpaper),
  resRow('r2', 'exact', 3.8, 820, 'Mathematics Paper 2', 'O Level · PDF', THEME.coral, GL.qpaper),
  resRow('r3', 'paper', 4.3, 1000, 'Marking scheme', 'check your answers', THEME.deep, G_TICK),
  { id: 'sec', x: 500, y: 1270, w: 'seconds', t: 5.5, svg: `<g transform="translate(-200 0) scale(.9)">${STOPWATCH}</g>${T(-110, 22, 'In seconds', 80, THEME.deep, 'start')}` }
 ]})));

// ── 2 WHAT'S INSIDE ─────────────────────────────────────────────
const cat = (id, w, t, x, y, label, sub, ill) => ({ id, x, y, w, t, svg: `${card(400, 330, '#fff', 44)}<g transform="translate(0 -40)"><g ${an('float', 2.6, (x % 3) * .3)}>${ill}</g></g>${T(0, 100, label, 40)}${M(0, 142, sub, 22, THEME.muted)}` });
const I_NOV = `<g transform="translate(-62 22) rotate(-8)">${book(THEME.coral, 70, 110)}</g><g transform="translate(0 8)">${book(THEME.sky, 76, 128)}</g><g transform="translate(64 24) rotate(8)">${book(THEME.sun, 70, 106)}</g>`;
const I_QP = `<g transform="translate(-36 8) rotate(-7)">${paper({ w: 110, h: 150, lines: 3, badge: '', head: THEME.green2 })}</g><g transform="translate(36 0) rotate(7)">${paper({ w: 110, h: 150, lines: 3, badge: '', head: THEME.coral })}</g>`;
const I_MS = `${paper({ w: 120, h: 160, lines: 3, badge: '', tick: true, head: THEME.deep })}<g transform="translate(54 58)">${checkBadge(26)}</g>`;
const I_SN = `<g transform="scale(.9)">${NOTEBOOK}</g>`;
S.push(scene(THEME.paper,
 "Novels, question papers, marking schemes and study notes. All ready to read.",
 comicScene({ badge: "What's inside", theme: 'cream', groups: [
  { id: 'bl', always: true, svg: blobs(9) },
  cat('c1', 'novels', .3, 270, 330, 'Novels', 'ready to read', I_NOV),
  cat('c2', 'question', .9, 730, 330, 'Question papers', 'past papers', I_QP),
  cat('c3', 'marking', 1.8, 270, 700, 'Marking schemes', 'check your answers', I_MS),
  cat('c4', 'study', 2.9, 730, 700, 'Study notes', 'study material', I_SN),
  { id: 'sf', x: 500, y: 1130, w: 'all', t: 3.8, svg: shelf(860, 1, 5) },
  { id: 'rd', x: 500, y: 950, w: 'ready', t: 4.1, svg: `<g ${an('pulse', 1.1)}>${pill(440, 84, THEME.green, 'Ready to read', 42)}</g>` }
 ]})));

// ── 3 SHARE A PAPER → THE LIBRARY GROWS ─────────────────────────────
const mini = (id, bg, p) => `<g transform="scale(.42)">${avatar(id, bg, p)}</g>`;
S.push(scene(THEME.paper,
 "Got a paper or notes other students could use? Upload it and help the library grow.",
 comicScene({ badge: 'Share a paper', theme: 'mint', groups: [
  { id: 'bl', always: true, svg: blobs(11) },
  { id: 'me', x: 200, y: 330, w: 'got', t: .2, s: .75, svg: avatar('cpme', '#ffd9bf', P_HAPPY) },
  { id: 'pp', x: 470, y: 330, w: 'paper', t: .8, svg: `<g transform="rotate(8)"><g ${an('float', 2.4)}>${paper({ w: 150, h: 200, lines: 4, badge: 'PDF' })}</g></g>` },
  { id: 'nt', x: 690, y: 340, w: 'notes', t: 1.5, svg: `<g transform="rotate(-6)"><g ${an('float', 2.4, .4)}>${NOTEBOOK}</g></g>` },
  { id: 'st', x: 500, y: 540, w: 'students', t: 2.3, svg: [{ skin: SKIN.mid, style: 'short', top: THEME.coral }, { skin: SKIN.dark, style: 'afro', top: THEME.sky }, { skin: SKIN.deep, style: 'bun', top: THEME.green2 }].map((o, i) => `<g transform="translate(${[-110, 0, 110][i]} 0)">${mini('cps' + i, ['#c9f2d0', '#cfdcff', '#ffd9bf'][i], person(o))}</g>`).join('') + T(0, 108, 'other students', 34, THEME.deep) },
  { id: 'dz', x: 500, y: 790, w: 'upload', t: 3.9, svg: `${card(760, 210, '#fff', 44)}<rect x="-366" y="-96" width="732" height="192" rx="34" fill="none" stroke="${THEME.green}" stroke-width="5" ${an('flow dash', 1)}/><g transform="translate(-230 8) scale(.8)">${CLOUD_UP}</g>${T(-60, -4, 'Upload a paper', 46, INK, 'start')}${M(-60, 44, 'or notes, for everyone', 26, THEME.muted, 'start')}` },
  { id: 'ar', w: 'it', t: 4.3, svg: arrow(500, 912, 500, 972, THEME.green2, 10) },
  { id: 'shf', x: 500, y: 1100, w: 'help', t: 4.7, svg: shelf(860, 1, 7, 120) },
  { id: 'lb', x: 500, y: 1330, w: 'library', t: 5.1, svg: pill(420, 84, '#fff', 'The library', 40, THEME.deep) },
  { id: 'nb', x: 500, y: 1100, w: 'grow', t: 5.6, svg: `<g transform="translate(336 27)"><g ${an('pop', .6)}>${book(THEME.coral, 80, 156)}</g></g><g transform="translate(336 -150)"><g ${an('pop', .6, .15)}><circle r="32" fill="${THEME.green}"/>${T(0, 11, '+1', 30, '#fff')}</g></g><g transform="translate(396 -40)"><g ${an('twinkle', 1.1)}>${sparkle(THEME.sun, 1)}</g></g><g transform="translate(276 -60)"><g ${an('twinkle', 1.1, .4)}>${sparkle(THEME.coral, .7)}</g></g>` }
 ]})));

// ── 4 CTA ───────────────────────────────────────────────────────
S.push(scene(THEME.paper,
 "Open the library at books dot co dot zed double you. It is free.",
 comicScene({ badge: 'books.co.zw', theme: 'peach', groups: [
  { id: 'bl', always: true, svg: blobs(21) },
  { id: 'av', x: 500, y: 330, w: 'open', t: .2, svg: `${avatar('f1', '#c9f2d0', P_HAPPY)}<g transform="translate(-200 -110) rotate(-14) scale(.6)"><g ${an('float', 2.4)}>${book(THEME.coral)}</g></g><g transform="translate(205 -100) rotate(12) scale(.6)"><g ${an('float', 2.6, .3)}>${book(THEME.sky)}</g></g><g transform="translate(180 120)">${sparkle(THEME.sun, 1.1)}</g><g transform="translate(-190 110)">${sparkle(THEME.green, .8)}</g>` },
  { id: 'sf', x: 500, y: 1340, w: 'library', t: .9, svg: shelf(860, 1, 9) },
  { id: 'url', x: 500, y: 790, w: 'books', t: 1.7, svg: `<g ${an('float', 3)}>${urlCard(.7, 82)}</g>` },
  { id: 'cta', x: 500, y: 975, w: 'you', t: 4.1, svg: `<g ${an('pulse', .9)}>${pill(520, 100, THEME.green, 'Open the library', 48)}</g>${sparks(-320, 0, 8, THEME.sun, 28, .6)}${sparks(320, 0, 8, THEME.coral, 28, .6)}` },
  { id: 'free', x: 500, y: 1120, w: 'free', t: 5.2, svg: `<g transform="rotate(-4)"><g ${an('pulse', 1)}>${pill(300, 84, THEME.sun, 'Free', 50, INK)}</g></g>` }
 ]})));

// ── export ──────────────────────────────────────────────────────
const TRANS = ['fade', 'wipe-left', 'fade', 'wipe-up', 'fade'];
module.exports = {
    output: { title: 'books-co-zw-library-ad', format: 'portrait', fps: 30, crf: 23, preset: 'medium' },
    defaults: { voice: 'af_heart', speed: 0.94, transition: 'fade', transitionDuration: 0.25 },
    scenes: S.map((s, i) => Object.assign(s, { transition: TRANS[i] || 'fade' })),
};
Object.defineProperty(module.exports, '_illo', { value: ILLO, enumerable: false });