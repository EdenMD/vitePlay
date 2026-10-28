// config.test-all-sources.js
// Tries every free asset source in one portrait video and ends with a
// PASS/FAIL scoreboard (also printed in the CI log as "[Test] PASS/FAIL ...").
//
//  1. Iconify search API            (keyless)
//  2. Iconify UI sets               lucide(ISC) tabler(MIT) phosphor(MIT) mdi(Apache-2.0)
//  3. Iconify emoji sets            noto(Apache-2.0) fluent-emoji(MIT) twemoji(CC-BY) openmoji(CC-BY-SA)
//  4. Fluent Emoji 3D PNGs          GitHub raw, MIT -> downloaded -> native `image` layers
//  5. Noto animated emoji (Lottie)  GitHub raw JSON, CC BY 4.0 -> html-record + lottie-web
//  6. Noto animated via gstatic     official Google host (unverified from my sandbox)
//  7. LottieFiles                   paste direct .json URLs below (free = Lottie Simple License)
//
// Run: VIDEO_CONFIG=config.test-all-sources.js node engine-ci.js
// No keys needed. Nothing here is hardcoded secret.
//
// Credits to put in the video description if you ship any of these:
//   Noto animated emoji (c) Google, CC BY 4.0 | Twemoji CC BY 4.0 | OpenMoji CC BY-SA 4.0 (share-alike!)

const fs   = require('fs');
const path = require('path');

// Paste direct Lottie JSON URLs here (LottieFiles download -> "Lottie JSON"). Optional.
const LOTTIEFILES_URLS = [
    // 'https://assets-v2.lottiefiles.com/a/xxxx/yyyy.json',
];

const DIR = path.join(process.cwd(), 'assets', 'test-sources');
const TEAL = '#00e5a0', AMBER = '#ffcc33', RED = '#ff5a5f', BLUE = '#4dd0ff', GREY = '#8a99a6';

const results = [];
const rec = (name, lic, ok, note) => {
    results.push({ name, lic, ok, note });
    console.log(`[Test] ${ok === null ? 'SKIP' : ok ? 'PASS' : 'FAIL'}  ${name} (${lic}) — ${note}`);
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function get(url, kind) {
    const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    if (kind === 'buf')  return Buffer.from(await r.arrayBuffer());
    if (kind === 'json') return r.json();
    return r.text();
}

// ── Iconify ───────────────────────────────────────────────────────────────
async function iconSvg(prefix, name, color) {
    const q = color ? '?color=' + encodeURIComponent(color) : '';
    const svg = await get(`https://api.iconify.design/${prefix}/${name}.svg${q}`, 'text');
    if (!svg.includes('<svg')) throw new Error('not an svg');
    return svg;
}
async function iconSet(prefix, lic, names, color) {
    const out = await Promise.all(names.map(async (n) => {
        try { return { name: n, svg: await iconSvg(prefix, n, color) }; }
        catch (e) { return { name: n, svg: null, err: e.message }; }
    }));
    const bad = out.filter((o) => !o.svg);
    rec(`Iconify · ${prefix}`, lic, bad.length === 0,
        bad.length ? `${out.length - bad.length}/${out.length} ok (${bad[0].err})` : `${out.length}/${out.length} icons ok`);
    return out;
}

// ── Lottie ────────────────────────────────────────────────────────────────
async function lottieJson(url) {
    const j = await get(url, 'json');
    if (!j || !Array.isArray(j.layers)) throw new Error('not a lottie json');
    return j;
}
const NOTO_RAW = (cp) => `https://raw.githubusercontent.com/rbozan/animated-emojis-rs/HEAD/static/noto_animated_emoji/lottie/${cp}/lottie.json`;
const NOTO_GST = (cp) => `https://fonts.gstatic.com/s/e/notoemoji/latest/${cp}/lottie.json`;

// ── Shared HTML pieces ────────────────────────────────────────────────────
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:transparent;font-family:Arial,Helvetica,sans-serif;color:#fff}
.tag{position:absolute;top:150px;left:0;right:0;text-align:center}
.pill{display:inline-block;padding:16px 40px;border-radius:999px;font-weight:900;letter-spacing:4px;font-size:34px;border:3px solid var(--c);color:var(--c);background:rgba(255,255,255,.05)}
.grid{position:absolute;left:60px;right:60px;top:300px;display:grid;gap:26px}
.tile{display:flex;flex-direction:column;align-items:center;gap:10px;padding:26px 14px;border-radius:34px;background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.12)}
.ic{width:170px;height:170px}.ic svg{width:100%;height:100%}
.lbl{font-size:34px;font-weight:900;color:var(--c)}.sub{font-size:26px;color:#c8d6e0}
.pop{opacity:0;animation:pop .5s forwards;animation-delay:calc(var(--i)*.12s)}
@keyframes pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
.row{display:flex;align-items:center;gap:22px;padding:14px 26px;border-radius:26px;background:rgba(255,255,255,.06);margin-bottom:12px}
.dot{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:28px;color:#06121c}
.rn{font-size:32px;font-weight:900}.rs{font-size:24px;color:#c8d6e0}
`;
const tag = (t, c) => `<div class="tag"><span class="pill" style="--c:${c}">${t}</span></div>`;
const tile = (svg, label, sub, c, i, sz) =>
    `<div class="tile pop" style="--c:${c};--i:${i}"><div class="ic" ${sz ? `style="width:${sz}px;height:${sz}px"` : ''}>${svg || `<div style="color:${RED};font-size:40px;font-weight:900;padding-top:60px;text-align:center">FAILED</div>`}</div><div class="lbl">${label}</div><div class="sub">${sub}</div></div>`;
const htmlLayer = (html, extra) => Object.assign({
    type: 'html-record', html, fps: 24,
    viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
}, extra || {});
const bg = (a, b) => ({ type: 'gradient', gradientType: 'linear', colors: [a, b], angle: 160 });

module.exports = async () => {
    fs.mkdirSync(DIR, { recursive: true });

    // 1. Iconify search
    try {
        const s = await get('https://api.iconify.design/search?query=virus&limit=5', 'json');
        const n = (s.icons || []).length;
        rec('Iconify · search API', 'free', n > 0, `${n} results for "virus"`);
    } catch (e) { rec('Iconify · search API', 'free', false, e.message); }

    // 2. Iconify UI sets (recoloured to teal)
    const ui = [
        ['lucide', 'ISC',        ['shield-check', 'bug']],
        ['tabler', 'MIT',        ['virus', 'vaccine']],
        ['ph',     'MIT',        ['drop', 'hand-soap']],
        ['mdi',    'Apache-2.0', ['hospital-box', 'biohazard']],
    ];
    const uiRes = await Promise.all(ui.map(([p, l, n]) => iconSet(p, l, n, TEAL)));

    // 3. Iconify emoji sets (full colour, no recolour)
    const emo = [
        ['noto',         'Apache-2.0'],
        ['fluent-emoji', 'MIT'],
        ['twemoji',      'CC-BY-4.0'],
        ['openmoji',     'CC-BY-SA-4.0'],
    ];
    const emoNames = ['microbe', 'droplet', 'mosquito'];
    const emoRes = await Promise.all(emo.map(([p, l]) => iconSet(p, l, emoNames)));

    // 4. Fluent Emoji 3D PNGs from GitHub (MIT)
    const f3d = [['Microbe', 'microbe'], ['Droplet', 'droplet'], ['Hospital', 'hospital']];
    const f3dRes = await Promise.all(f3d.map(async ([folder, file]) => {
        try {
            const buf = await get(`https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${folder}/3D/${file}_3d.png`, 'buf');
            const out = path.join(DIR, `${file}_3d.png`);
            fs.writeFileSync(out, buf);
            return { label: folder, src: './' + path.relative(process.cwd(), out).split(path.sep).join('/') };
        } catch (e) { return { label: folder, src: null, err: e.message }; }
    }));
    const f3dBad = f3dRes.filter((x) => !x.src);
    rec('Fluent 3D PNG · GitHub raw', 'MIT', f3dBad.length === 0,
        f3dBad.length ? `${f3dRes.length - f3dBad.length}/${f3dRes.length} ok (${f3dBad[0].err})` : `${f3dRes.length}/${f3dRes.length} PNGs saved`);

    // 5/6/7. Lottie sources
    const tiles = [];
    const notoCodes = [['1f9a0', 'microbe'], ['1f99f', 'mosquito'], ['1f6a8', 'alarm'], ['2705', 'check']];
    for (const [cp, nm] of notoCodes) {
        try { tiles.push({ label: nm, sub: 'Noto · GitHub raw', json: await lottieJson(NOTO_RAW(cp)) }); }
        catch (e) { tiles.push({ label: nm, sub: 'Noto · GitHub raw', json: null, err: e.message }); }
    }
    const rawBad = tiles.filter((t) => !t.json);
    rec('Noto Lottie · GitHub raw', 'CC BY 4.0', rawBad.length === 0,
        rawBad.length ? `${tiles.length - rawBad.length}/${tiles.length} ok (${rawBad[0].err})` : `${tiles.length}/${tiles.length} animations ok`);

    try {
        tiles.push({ label: 'mask', sub: 'Noto · gstatic', json: await lottieJson(NOTO_GST('1f637')) });
        rec('Noto Lottie · fonts.gstatic', 'CC BY 4.0', true, 'official Google host ok');
    } catch (e) {
        tiles.push({ label: 'mask', sub: 'Noto · gstatic', json: null });
        rec('Noto Lottie · fonts.gstatic', 'CC BY 4.0', false, e.message);
    }

    if (LOTTIEFILES_URLS.length) {
        try {
            tiles.push({ label: 'your pick', sub: 'LottieFiles', json: await lottieJson(LOTTIEFILES_URLS[0]) });
            rec('LottieFiles · your URL', 'Lottie Simple', true, 'json ok');
        } catch (e) {
            tiles.push({ label: 'your pick', sub: 'LottieFiles', json: null });
            rec('LottieFiles · your URL', 'Lottie Simple', false, e.message);
        }
    } else {
        tiles.push({ label: 'your pick', sub: 'LottieFiles', json: null, skipped: true });
        rec('LottieFiles · your URL', 'Lottie Simple', null, 'no URL set in LOTTIEFILES_URLS');
    }

    // ── Scene HTML ────────────────────────────────────────────────────────
    const uiTiles = [];
    let i = 0;
    ui.forEach(([p, l], si) => uiRes[si].forEach((ic) => uiTiles.push(tile(ic.svg, p, l, TEAL, i++))));
    const S1 = `<style>${CSS}</style>${tag('ICONIFY · UI SETS', TEAL)}
<div class="grid" style="grid-template-columns:1fr 1fr">${uiTiles.join('')}</div>`;

    const emoRows = emo.map(([p, l], si) =>
        `<div class="row pop" style="--i:${si * 2};--c:${AMBER}"><div style="width:250px"><div class="rn" style="color:${AMBER}">${p}</div><div class="rs">${l}</div></div>` +
        emoRes[si].map((ic) => `<div class="ic" style="width:200px;height:200px">${ic.svg || `<span style="color:${RED};font-weight:900">FAILED</span>`}</div>`).join('') + `</div>`).join('');
    const S2 = `<style>${CSS}</style>${tag('ICONIFY · EMOJI SETS', AMBER)}
<div class="grid" style="grid-template-columns:1fr;gap:0">${emoRows}</div>`;

    const S5rows = results.map((r) => {
        const c = r.ok === null ? GREY : r.ok ? TEAL : RED;
        const m = r.ok === null ? '–' : r.ok ? '✓' : '✗';
        return `<div class="row"><div class="dot" style="background:${c}">${m}</div><div><div class="rn" style="color:${c}">${esc(r.name)}</div><div class="rs">${esc(r.lic)} · ${esc(r.note)}</div></div></div>`;
    }).join('');
    const S5 = `<style>${CSS}</style>${tag('SOURCE SCOREBOARD', BLUE)}<div class="grid" style="grid-template-columns:1fr;gap:0;top:270px">${S5rows}</div>`;

    // Lottie scene: full document so the CDN script loads; frame-locked via apexframe
    const lottieDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}
.abox{width:250px;height:250px}.st{font-size:26px;font-weight:900;padding:4px 18px;border-radius:14px}
.st.ok{background:${TEAL};color:#06121c}.st.bad{background:${RED};color:#06121c}.st.skip{background:${GREY};color:#06121c}
#warn{position:absolute;left:60px;right:60px;top:1560px;text-align:center;font-size:34px;font-weight:900;color:${RED}}
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script></head><body>
${tag('ANIMATED · LOTTIE', BLUE)}<div id="grid" class="grid" style="grid-template-columns:1fr 1fr;top:290px"></div><div id="warn"></div>
<script>
(function () {
  var D = window.__APEX_DATA__ || { tiles: [] };
  var grid = document.getElementById('grid'), anims = [];
  if (!window.lottie) document.getElementById('warn').textContent = 'lottie-web CDN FAILED TO LOAD';
  D.tiles.forEach(function (t) {
    var el = document.createElement('div'); el.className = 'tile'; el.style.setProperty('--c', '${BLUE}');
    var box = document.createElement('div'); box.className = 'abox';
    var lb = document.createElement('div'); lb.className = 'lbl'; lb.textContent = t.label;
    var sb = document.createElement('div'); sb.className = 'sub'; sb.textContent = t.sub;
    var st = document.createElement('div');
    st.className = 'st ' + (t.json ? 'ok' : (t.skipped ? 'skip' : 'bad'));
    st.textContent = t.json ? 'PASS' : (t.skipped ? 'SKIPPED' : 'FAILED');
    el.appendChild(box); el.appendChild(lb); el.appendChild(sb); el.appendChild(st); grid.appendChild(el);
    if (t.json && window.lottie) {
      try { anims.push(lottie.loadAnimation({ container: box, renderer: 'svg', loop: false, autoplay: false, animationData: t.json })); }
      catch (e) { box.textContent = 'ERR'; }
    }
  });
  window.addEventListener('apexframe', function (e) {
    var t = e.detail.t || 0;
    anims.forEach(function (a) {
      var tf = a.totalFrames, fr = a.frameRate || 30;
      if (tf > 0) a.goToAndStop(Math.floor((t * fr) % tf), true);
    });
  });
  document.body.setAttribute('data-ready', '1');
})();
</script></body></html>`;

    // ── Scenes ────────────────────────────────────────────────────────────
    const imgLayers = [];
    f3dRes.forEach((x, k) => {
        const bx = 75 + k * 315;
        imgLayers.push(x.src
            ? { type: 'image', src: x.src, x: bx, y: 760, width: 300, height: 300, fit: 'contain', animation: 'pop' }
            : { type: 'text', text: 'FAILED', x: bx + 150, y: 900, fontSize: 48, color: RED, align: 'center' });
        imgLayers.push({ type: 'text', text: x.label, x: bx + 150, y: 1120, fontSize: 40, color: '#ffffff', align: 'center' });
    });

    return {
        output: { title: 'sources-test', format: 'portrait', fps: 24, crf: 28, preset: 'ultrafast' },
        defaults: { voice: 'am_adam', transition: 'fade', transitionDuration: 0.25 },
        scenes: [
            {
                tts: { text: 'Source one. Iconify. Four open source icon sets. Free, no key.', pauseAfter: 0.8 },
                captions: false,
                layers: [bg('#04120f', '#08241f'), htmlLayer(S1, { duration: 6 })],
            },
            {
                tts: { text: 'Source two. Iconify emoji sets. Same emoji, four different styles.', pauseAfter: 0.8 },
                captions: false,
                layers: [bg('#140f04', '#241a08'), htmlLayer(S2, { duration: 6 })],
            },
            {
                tts: { text: 'Source three. Fluent three D emoji, downloaded from GitHub.', pauseAfter: 0.8 },
                captions: false,
                layers: [
                    bg('#0a0a1a', '#16163a'),
                    { type: 'text', text: 'FLUENT 3D · MIT', x: 540, y: 220, fontSize: 56, color: AMBER, align: 'center', fontFamily: 'Arial Black, sans-serif' },
                    ...imgLayers,
                ],
            },
            {
                tts: { text: 'Source four. Animated Noto emoji. Lottie files, driven frame by frame, from GitHub and Google, plus a LottieFiles slot.', pauseAfter: 1.0 },
                captions: false,
                layers: [bg('#04101a', '#0a1f33'), htmlLayer(lottieDoc, { audioSync: true, cursor: false, data: { tiles }, waitFor: '[data-ready="1"]' })],
            },
            {
                tts: { text: 'Test complete. Green means it works. Red means it failed.', pauseAfter: 1.0 },
                captions: false,
                layers: [bg('#050d14', '#0a2030'), htmlLayer(S5, { duration: 6 })],
            },
        ],
    };
};
