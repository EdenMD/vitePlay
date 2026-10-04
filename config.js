// config.pirate-dream.js
// "Why Being a Pirate Was Every Kid's Dream" — ~5 min, 11 scenes.
// Voice: bm_george (history/documentary, per Voices.md's own mapping table).
//
// RUN: VIDEO_CONFIG=config.pirate-dream.js node engine-ci.js
//
// ASSUMPTION MADE (you only answered the length question): real historical
// photos (SerpAPI/Pexels, short 2-word queries) are MIXED with Open-Peeps-
// style character illustrations — photos carry the history, Peeps carry the
// "kid's dream" framing device. Say the word and I'll rebalance either way.
//
// OPEN PEEPS — IMPORTANT HONESTY NOTE
//   The real openpeeps.com asset library is a drag-and-drop picker (SVG/
//   Figma files) with no API, so it can't be fetched by a script the way
//   SerpAPI/Pexels can. What's below is a small PARAMETRIC GENERATOR
//   (`peep()`) built in the same spirit as Open Peeps — flat color blocks,
//   no gradients, swappable hair / accessory / pose — producing real SVG
//   at config-build time, encoded as a data: URI and dropped into the
//   casing's own `photo` command like any other image. It is NOT a
//   redistribution of Open Peeps' actual files. If you want the literal
//   Open Peeps assets instead, download SVGs from openpeeps.com and swap
//   them in for any `peep(...)` call below — same data: URI mechanism.
//
// STRUCTURE
//   Scene 0  hook — kid dreaming                  casing + peep
//   Scene 1  what a pirate even is / ancient roots casing + photo
//   Scene 2  privateers: legal pirates             casing + peep + photo
//   Scene 3  the golden age begins                 inline html (timeline)
//   Scene 4  Blackbeard                             casing + peep + photo
//   Scene 5  Anne Bonny & Mary Read                 casing + peep
//   Scene 6  the pirate code / Jolly Roger          inline html (articles list)
//   Scene 7  myth vs reality                        inline html (vs panel)
//   Scene 8  the crackdown / end of the golden age  casing + photo
//   Scene 9  how the dream was built (books/film)   casing + peep
//   Scene 10 verdict + CTA                          inline html

const https  = require('https');
const http   = require('http');

// ── API keys ─────────────────────────────────────────────────────────────
const SERPAPI_KEY  = process.env.SERPAPI_API_KEY     || null;
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || null;
const PEXELS_KEY   = process.env.PEXELS_API_KEY      || null;
const PIXABAY_KEY  = process.env.PIXABAY_API_KEY     || null;

const serpApiResultsCache = new Map();

function getSourceChain(preferred) {
    const chain = [];
    if (preferred) chain.push(preferred);
    if (!chain.includes('serpapi')  && SERPAPI_KEY)  chain.push('serpapi');
    if (!chain.includes('unsplash') && UNSPLASH_KEY) chain.push('unsplash');
    if (!chain.includes('pexels')   && PEXELS_KEY)   chain.push('pexels');
    if (!chain.includes('pixabay')  && PIXABAY_KEY)  chain.push('pixabay');
    if (!chain.includes('picsum'))                    chain.push('picsum');
    return chain;
}

function fetchJSON(url, headers = {}) {
    return new Promise((resolve, reject) => {
        const lib  = url.startsWith('https') ? https : http;
        const opts = { headers: { 'User-Agent': 'APEX-Engine/2.0', ...headers }, timeout: 10000 };
        lib.get(url, opts, res => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
                res.resume();
                return fetchJSON(new URL(res.headers.location, url).toString(), headers).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('JSON parse error')); } });
        }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
    });
}

function downloadToBase64(fileUrl, headers = {}) {
    return new Promise((resolve, reject) => {
        const opts = { headers: { 'User-Agent': 'APEX-Engine/2.0', ...headers }, timeout: 30000 };
        const makeReq = (url) => {
            const proto = url.startsWith('https') ? https : http;
            proto.get(url, opts, res => {
                if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
                    res.resume();
                    return makeReq(new URL(res.headers.location, url).toString());
                }
                if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
                const ct = res.headers['content-type'] || '';
                if (ct.includes('text/html')) { res.resume(); return reject(new Error('Server returned HTML instead of image')); }
                const chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => {
                    const buf = Buffer.concat(chunks);
                    if (buf.length < 1024) return reject(new Error(`File too small (${buf.length}B)`));
                    resolve({ base64: buf.toString('base64'), contentType: ct.split(';')[0] || 'image/jpeg' });
                });
            }).on('error', reject).on('timeout', () => reject(new Error('Download timeout')));
        };
        makeReq(fileUrl);
    });
}

async function searchSerpApi(query, orientation, imageIndex = 0) {
    if (!SERPAPI_KEY) throw new Error('SERPAPI_API_KEY not set');
    const cacheKey = `${query.toLowerCase().trim()}::${orientation}`;
    let results = serpApiResultsCache.get(cacheKey);
    if (!results) {
        const url = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&ijn=0&num=100&safe=active&api_key=${SERPAPI_KEY}`;
        const data = await fetchJSON(url, { Authorization: `Bearer ${SERPAPI_KEY}` });
        const all = data?.images_results || [];
        if (!all.length) throw new Error('No image results from SerpAPI');
        const usable = all.filter(r => r.original && !r.original.startsWith('x-raw-image'));
        results = usable.length ? usable : all;
        serpApiResultsCache.set(cacheKey, results);
        console.log(`[Pirate] SerpAPI cached: ${results.length} result(s) for "${query}"`);
    }
    const pick = results[imageIndex % results.length] || results[0];
    if (!pick?.original) throw new Error('No usable image URL');
    return pick.original;
}

async function searchUnsplash(query, orientation) {
    if (!UNSPLASH_KEY) throw new Error('No UNSPLASH_ACCESS_KEY');
    const data = await fetchJSON(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=${orientation}&content_filter=high&client_id=${UNSPLASH_KEY}`);
    return data?.urls?.regular || data?.urls?.full || null;
}

async function searchPexels(query, orientation) {
    if (!PEXELS_KEY) throw new Error('No PEXELS_API_KEY');
    const orMap = { portrait: 'portrait', landscape: 'landscape', squarish: 'square' };
    const data = await fetchJSON(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=${orMap[orientation] || 'portrait'}&per_page=5&page=1`,
        { Authorization: PEXELS_KEY });
    const photos = data?.photos;
    if (!photos?.length) return null;
    const p = photos[Math.floor(Math.random() * photos.length)];
    return p?.src?.large2x || p?.src?.large || null;
}

async function searchPixabay(query, orientation) {
    if (!PIXABAY_KEY) throw new Error('No PIXABAY_API_KEY');
    const orMap = { portrait: 'vertical', landscape: 'horizontal', squarish: 'square' };
    const data = await fetchJSON(
        `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=${orMap[orientation] || 'vertical'}&safesearch=true&per_page=5&min_width=1080`);
    const hits = data?.hits;
    if (!hits?.length) return null;
    const h = hits[Math.floor(Math.random() * hits.length)];
    return h?.largeImageURL || h?.webformatURL || null;
}

async function getPicsum(orientation) {
    const w = orientation === 'landscape' ? 1920 : 1080;
    const h = orientation === 'landscape' ? 1080 : 1920;
    return `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/${w}/${h}`;
}

async function searchSource(source, query, orientation, imageIndex) {
    switch (source) {
        case 'serpapi':  return searchSerpApi(query, orientation, imageIndex);
        case 'unsplash': return searchUnsplash(query, orientation);
        case 'pexels':   return searchPexels(query, orientation);
        case 'pixabay':  return searchPixabay(query, orientation);
        case 'picsum':   return getPicsum(orientation);
        default:         return null;
    }
}

async function trySerpApiWithFallback(query, orientation, startIndex) {
    const firstUrl = await searchSerpApi(query, orientation, startIndex);
    const results  = serpApiResultsCache.get(`${query.toLowerCase().trim()}::${orientation}`) || [];
    const total    = results.length || 1;
    let lastErr = null;
    for (let attempt = 0; attempt < total; attempt++) {
        const idx = (startIndex + attempt) % total;
        const candidateUrl = attempt === 0 ? firstUrl : results[idx]?.original;
        if (!candidateUrl) continue;
        try {
            if (attempt > 0) console.log(`[Pirate]  ↻ serpapi retry [#${idx}] for "${query}"`);
            const { base64, contentType } = await downloadToBase64(candidateUrl);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            lastErr = e;
            console.warn(`[Pirate]  ⚠ serpapi [#${idx}] failed: ${e.message?.slice(0, 60)}`);
        }
    }
    throw lastErr || new Error('No working result in cached set');
}

async function fetchImageRobust(query, opts = {}) {
    const orientation = opts.orientation || 'portrait';
    const imageIndex  = opts.imageIndex || 0;
    for (const source of getSourceChain(opts.source || null)) {
        try {
            if (source === 'serpapi') {
                const uri = await trySerpApiWithFallback(query, orientation, imageIndex);
                console.log(`[Pirate] ✓ "${query}" #${imageIndex} via serpapi`);
                return uri;
            }
            const imageUrl = await searchSource(source, query, orientation, imageIndex);
            if (!imageUrl) continue;
            const { base64, contentType } = await downloadToBase64(imageUrl);
            console.log(`[Pirate] ✓ "${query}" via ${source}`);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            console.warn(`[Pirate]  ⚠ ${source} failed for "${query}": ${e.message?.slice(0, 60)}`);
        }
    }
    console.warn(`[Pirate]  ✗ ALL sources failed for "${query}"`);
    return null;
}

// ── Camera helper (same slot math as the casing) ─────────────────────────
const SLOT_CENTERS = {
    'top-left': [180, 270.5], 'top-center': [540, 270.5], 'top-right': [900, 270.5],
    'mid-left': [180, 511.5], 'mid-center': [540, 511.5], 'mid-right': [900, 511.5],
    'low-left': [180, 752.5], 'low-center': [540, 752.5], 'low-right': [900, 752.5],
    'bot-left': [180, 993.5], 'bot-center': [540, 993.5], 'bot-right': [900, 993.5],
    'deep-left': [180, 1234.5], 'deep-center': [540, 1234.5], 'deep-right': [900, 1234.5],
    'banner-top': [540, 270.5], 'banner-mid': [540, 752.5], 'banner-low': [540, 1234.5], 'banner-bot': [540, 1475.5],
};
function zoomTo(slot, scale) {
    const c = SLOT_CENTERS[slot] || [540, 960];
    return { toScale: scale, toX: -scale * (c[0] - 540), toY: -scale * (c[1] - 960) };
}
const ZOOM_OUT = { toScale: 1, toX: 0, toY: 0 };

const THEME = {
    paper: '#ece0c4', ink: '#211a12',
    accent: '#8a2e2e', accent2: '#1f5c52',
    shadow: 'rgba(20,16,10,0.4)',
};

// ── peep() — a small Open-Peeps-spirited parametric character generator ──
// Flat color blocks, no gradients, swappable hair/accessory/pose — same
// idea as the real library's modular parts. Returns a data: URI (SVG),
// ready to drop straight into a casing `photo` command's `src`.
function peep({
    skin = '#caa07a', shirt = '#2d4f5e', pants = '#2b2420',
    hair = '#2a1e16', hairStyle = 'short',           // short | bun | bald | long
    accessory = 'none',                               // none | tricorn | bandana | bicorne | captainHat
    beard = false, dress = false, armsUp = false,
}) {
    const hairShape = {
        short: `<path d="M38 70 Q50 30 100 30 Q150 30 162 70 Q150 50 100 50 Q50 50 38 70 Z" fill="${hair}"/>`,
        bun:   `<path d="M40 66 Q52 32 100 32 Q148 32 160 66 Q148 48 100 48 Q52 48 40 66 Z" fill="${hair}"/><circle cx="100" cy="24" r="14" fill="${hair}"/>`,
        long:  `<path d="M36 64 Q50 28 100 28 Q150 28 164 64 L160 120 L150 118 L148 70 Q148 48 100 46 Q52 48 52 70 L50 118 L40 120 Z" fill="${hair}"/>`,
        bald:  '',
    }[hairStyle] || '';

    const accessoryShape = {
        none: '',
        tricorn: `<path d="M26 58 Q100 8 174 58 Q150 36 100 36 Q50 36 26 58 Z" fill="#1a1512"/>
                  <path d="M26 58 Q60 44 100 44 Q140 44 174 58 Q168 66 100 54 Q32 66 26 58 Z" fill="#1a1512"/>
                  <circle cx="100" cy="40" r="5" fill="#c9a24b"/>`,
        bicorne: `<path d="M32 56 Q100 14 100 14 Q100 14 168 56 Q134 30 100 30 Q66 30 32 56 Z" fill="#0f1a24"/>
                  <circle cx="100" cy="22" r="5" fill="#c9a24b"/>`,
        captainHat: `<path d="M24 60 Q100 4 176 60 Q148 34 100 34 Q52 34 24 60 Z" fill="#1a1512"/>
                     <path d="M24 60 Q60 46 100 46 Q140 46 176 60 Q168 70 100 56 Q32 70 24 60 Z" fill="#8a2e2e"/>
                     <rect x="86" y="18" width="28" height="10" fill="#c9a24b"/>`,
        bandana: `<path d="M34 54 Q100 26 166 54 L160 70 Q100 48 40 70 Z" fill="#8a2e2e"/>
                  <path d="M150 62 L178 78 L156 80 Z" fill="#8a2e2e"/>
                  <circle cx="90" cy="46" r="4" fill="#ece0c4"/><circle cx="110" cy="44" r="4" fill="#ece0c4"/>`,
    }[accessory] || '';

    const eyepatch = accessory === 'tricorn' || accessory === 'bandana'
        ? `<path d="M74 92 Q86 84 98 92 L96 102 Q86 96 76 102 Z" fill="#1a1512"/><path d="M96 92 L150 70" stroke="#1a1512" stroke-width="4"/>`
        : `<circle cx="80" cy="94" r="4" fill="#1a1512"/><circle cx="118" cy="94" r="4" fill="#1a1512"/>`;

    const beardShape = beard
        ? `<path d="M64 100 Q100 150 136 100 Q138 128 100 140 Q62 128 64 100 Z" fill="${hair}"/>`
        : '';

    const armL = armsUp
        ? `<path d="M74 150 Q40 120 34 80" stroke="${shirt}" stroke-width="22" stroke-linecap="round" fill="none"/>`
        : `<path d="M74 150 Q58 190 62 228" stroke="${shirt}" stroke-width="22" stroke-linecap="round" fill="none"/>`;
    const armR = armsUp
        ? `<path d="M126 150 Q160 120 166 80" stroke="${shirt}" stroke-width="22" stroke-linecap="round" fill="none"/>`
        : `<path d="M126 150 Q142 190 138 228" stroke="${shirt}" stroke-width="22" stroke-linecap="round" fill="none"/>`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260">
        <rect x="76" y="150" width="20" height="90" fill="${pants}"/>
        <rect x="104" y="150" width="20" height="90" fill="${pants}"/>
        ${armL}${armR}
        ${dress
            ? `<path d="M64 148 Q100 136 136 148 L150 236 Q100 252 50 236 Z" fill="${shirt}"/>`
            : `<rect x="64" y="144" width="72" height="80" rx="16" fill="${shirt}"/>`}
        <circle cx="100" cy="92" r="42" fill="${skin}"/>
        ${eyepatch}
        <path d="M86 112 Q100 120 114 112" stroke="#1a1512" stroke-width="3" fill="none" stroke-linecap="round"/>
        ${beardShape}
        ${hairShape}
        ${accessoryShape}
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// ── Reveal helper for inline/audioSync scenes ─────────────────────────────
const BASE_CSS = `
  *{box-sizing:border-box}
  html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#ece0c4;
    font-family:Georgia,'Times New Roman',serif;color:#211a12}
  .wrap{position:absolute;inset:0;padding:150px 80px 300px;display:flex;flex-direction:column}
  .badge{align-self:flex-start;background:#1f5c52;color:#fff;font:900 90px Impact,'Arial Black',sans-serif;
    padding:6px 34px;transform:rotate(-3deg);box-shadow:6px 6px 0 rgba(20,16,10,.4)}
  .badge.red{background:#8a2e2e}
  h1{font:900 86px/1.04 Impact,'Arial Black',sans-serif;margin:34px 0 10px;letter-spacing:.5px}
  .sub{font-size:36px;line-height:1.3;margin:0 0 30px;color:#3a3226;max-width:900px}
  .off{opacity:0;transition:opacity .35s ease}
  .on{opacity:1}
`;
const REVEAL_JS = `
  var seen = {};
  function show(id){ if (seen[id]) return; seen[id] = 1;
    var el = document.getElementById(id); if (el) el.classList.add('on'); }
  function wire(map, fb){
    window.addEventListener('apexframe', function(e){
      var d = e.detail, w = (d.word || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (map[w]) show(map[w]);
      for (var i = 0; i < fb.length; i++) if (d.t > fb[i][1]) show(fb[i][0]);
    });
    document.body.setAttribute('data-ready', '1');
  }
`;

// ── Inline scene 3 — the golden age begins (timeline) ─────────────────────
const HTML_TIMELINE = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_CSS}
  .line{position:relative;margin-top:50px;padding-left:46px;border-left:6px solid #211a12}
  .pt{position:relative;margin-bottom:64px;opacity:0;transform:translateX(-18px);
    transition:opacity .35s ease,transform .35s cubic-bezier(.2,1,.3,1)}
  .pt.on{opacity:1;transform:translateX(0)}
  .pt::before{content:"";position:absolute;left:-58px;top:6px;width:24px;height:24px;border-radius:50%;
    background:#8a2e2e;border:5px solid #ece0c4;box-shadow:0 0 0 4px #211a12}
  .yr{font:900 54px Impact,'Arial Black',sans-serif;color:#8a2e2e}
  .tx{font-size:38px;line-height:1.35;margin-top:6px;max-width:820px}
</style></head><body><div class="wrap">
  <div class="badge">1650s</div>
  <h1>The golden age<br>begins</h1>
  <p class="sub">After decades of legal raiding, the line between privateer and pirate started to blur.</p>
  <div class="line">
    <div class="pt off" id="p1"><div class="yr">1650s</div><div class="tx">Wars wind down. Governments stop hiring privateers, but the ships and crews don't disappear.</div></div>
    <div class="pt off" id="p2"><div class="yr">1660s</div><div class="tx">Unemployed sailors turn to the Caribbean, a maze of islands, hidden coves and weak colonial navies.</div></div>
    <div class="pt off" id="p3"><div class="yr">1690s</div><div class="tx">Piracy spreads from the Caribbean to the Atlantic coast and the Indian Ocean trade routes.</div></div>
    <div class="pt off" id="p4"><div class="yr">1715</div><div class="tx">A wrecked Spanish treasure fleet draws hundreds of opportunists, launching what we now call the Golden Age.</div></div>
  </div>
</div><script>${REVEAL_JS}
  wire({decades:'p1', caribbean:'p2', ocean:'p3', fleet:'p4'}, [['p1',6],['p2',12],['p3',18],['p4',24]]);
</script></body></html>`;

// ── Inline scene 6 — pirate code / Jolly Roger ─────────────────────────────
const HTML_CODE = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_CSS}
  .flag{align-self:center;margin:10px 0 36px;opacity:0;transform:scale(.6) rotate(-4deg);
    transition:opacity .4s ease,transform .4s cubic-bezier(.2,1.4,.4,1)}
  .flag.on{opacity:1;transform:scale(1) rotate(-4deg)}
  .art{display:flex;align-items:flex-start;gap:26px;border:5px solid #211a12;background:#f4ecdb;
    padding:28px 34px;margin-bottom:24px;box-shadow:8px 8px 0 rgba(20,16,10,.4);
    opacity:0;transform:translateY(16px);transition:opacity .3s ease,transform .3s cubic-bezier(.2,1,.3,1)}
  .art.on{opacity:1;transform:translateY(0)}
  .num{font:900 54px Impact,'Arial Black',sans-serif;color:#8a2e2e;flex:none;width:70px}
  .txt{font-size:36px;line-height:1.35}
</style></head><body><div class="wrap">
  <div class="badge red">The Code</div>
  <h1>A democracy,<br>not a mutiny</h1>
  <svg class="flag" id="flag" width="260" height="170" viewBox="0 0 260 170">
    <rect width="260" height="170" fill="#141210"/>
    <circle cx="130" cy="72" r="34" fill="#ece0c4"/>
    <circle cx="117" cy="66" r="5" fill="#141210"/><circle cx="143" cy="66" r="5" fill="#141210"/>
    <path d="M110 86 Q130 98 150 86" stroke="#141210" stroke-width="4" fill="none"/>
    <path d="M80 130 L130 100 L180 130" stroke="#ece0c4" stroke-width="7" fill="none"/>
  </svg>
  <div class="art off" id="a1"><div class="num">1</div><div class="txt">The captain is elected. Crews can vote a bad captain out.</div></div>
  <div class="art off" id="a2"><div class="num">2</div><div class="txt">Loot is split by fixed shares, written down, agreed in advance.</div></div>
  <div class="art off" id="a3"><div class="num">3</div><div class="txt">Injury pays compensation. Lose a leg, get an agreed sum.</div></div>
  <div class="art off" id="a4"><div class="num">4</div><div class="txt">The black flag is a warning, not a battle cry: surrender, and no one has to die.</div></div>
</div><script>${REVEAL_JS}
  wire({democracy:'flag', elected:'a1', shares:'a2', compensation:'a3', surrender:'a4'},
       [['flag',4],['a1',9],['a2',15],['a3',21],['a4',27]]);
</script></body></html>`;

// ── Inline scene 7 — myth vs reality ───────────────────────────────────────
const HTML_MYTH = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_CSS}
  .cols{display:flex;gap:24px;margin-top:20px}
  .col{flex:1;border:5px solid #211a12;padding:30px 26px;box-shadow:8px 8px 0 rgba(20,16,10,.4)}
  .col.myth{background:#e7d7bd}
  .col.real{background:#f4ecdb}
  .col h2{font:900 50px Impact,'Arial Black',sans-serif;margin:0 0 20px}
  .col.myth h2{color:#8a2e2e}.col.real h2{color:#1f5c52}
  .row{font-size:32px;line-height:1.3;margin-bottom:26px;opacity:0;transform:translateY(10px);
    transition:opacity .3s ease,transform .3s ease}
  .row.on{opacity:1;transform:translateY(0)}
</style></head><body><div class="wrap">
  <div class="badge">Myth vs Reality</div>
  <h1>What we<br>got wrong</h1>
  <div class="cols">
    <div class="col myth"><h2>The Myth</h2>
      <div class="row off" id="m1">Buried treasure maps</div>
      <div class="row off" id="m2">Walking the plank</div>
      <div class="row off" id="m3">Eyepatches for style</div>
      <div class="row off" id="m4">One-ship lone wolves</div></div>
    <div class="col real"><h2>The Reality</h2>
      <div class="row off" id="r1">Loot was spent fast, not buried</div>
      <div class="row off" id="r2">Marooning was the real punishment</div>
      <div class="row off" id="r3">Eyepatches kept one eye night-adapted</div>
      <div class="row off" id="r4">Pirates sailed in organized fleets</div></div>
  </div>
</div><script>${REVEAL_JS}
  wire({maps:'m1', plank:'m2', eyepatches:'m3', wolves:'m4',
        fast:'r1', marooning:'r2', night:'r3', fleets:'r4'},
       [['m1',4],['m2',8],['m3',12],['m4',16],['r1',20],['r2',24],['r3',28],['r4',32]]);
</script></body></html>`;

// ── Inline scene 10 — verdict + CTA ────────────────────────────────────────
const HTML_VERDICT = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_CSS}
  .card{border:5px solid #211a12;background:#f4ecdb;padding:34px 42px;box-shadow:8px 8px 0 rgba(20,16,10,.4);margin-top:28px}
  .card h2{font:900 58px Impact,'Arial Black',sans-serif;margin:0 0 12px;color:#8a2e2e}
  .card p{font-size:38px;line-height:1.4;margin:0}
  .cta{margin-top:46px;align-self:center;text-align:center;background:#1f5c52;color:#fff;border:5px solid #211a12;
    font:900 76px/1.05 Impact,'Arial Black',sans-serif;padding:20px 54px;transform:rotate(-1deg) scale(1.6);
    opacity:0;transition:transform .3s cubic-bezier(.2,1.4,.4,1),opacity .2s ease;box-shadow:8px 8px 0 rgba(20,16,10,.4)}
  .cta.on{opacity:1;transform:rotate(-1deg) scale(1)}
  .cta small{display:block;font:400 32px Georgia,serif;margin-top:10px;letter-spacing:0}
</style></head><body><div class="wrap">
  <div class="badge red">The Real Dream</div>
  <h1>Freedom, not<br>treasure</h1>
  <div class="card off" id="c1"><h2>What kids actually wanted</h2>
    <p>Not gold. A vote. A share. A world with no landlord, no king, no boss telling them what to do.</p></div>
  <div class="cta" id="cta">🔔 SUBSCRIBE<small>for facts nobody tells you</small></div>
</div><script>${REVEAL_JS}
  wire({vote:'c1', subscribe:'cta'}, [['c1',6],['cta',14]]);
</script></body></html>`;

const inlineLayer = (html) => ({
    type: 'html-record', html,
    audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
    viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
});
const casingLayer = (tag, title, commands) => ({
    type: 'html-record', src: `./ApexCasing/paper-sticker-explainer.html?tag=${tag}`,
    audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
    viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
    data: { title, theme: THEME, commands },
});

module.exports = (async () => {

    console.log('[Pirate] Fetching photos sequentially...');

    const wanted = [
        ['ship0',     'pirate ship',     { source: 'serpapi', imageIndex: 0 }],
        ['ship1',     'pirate ship',     { source: 'serpapi', imageIndex: 1 }],
        ['woodship',  'wooden ship',     { source: 'serpapi' }],
        ['jollyroger','jolly roger',     { source: 'serpapi' }],
        ['chest',     'treasure chest',  { source: 'serpapi' }],
        ['oldmap',    'old map',         { source: 'serpapi' }],
        ['cannon',    'naval cannon',    { source: 'serpapi' }],
        ['wreck',     'shipwreck ruins', { source: 'serpapi' }],
        ['island',    'tropical island', { source: 'pexels'  }],
        ['ocean',     'ocean waves',     { source: 'pexels'  }],
        ['deck',      'ship deck',       { source: 'pexels'  }],
    ];
    const img = {};
    for (const [key, query, opts] of wanted) img[key] = await fetchImageRobust(query, opts);

    console.log('[Pirate] Photos resolved. Building Peeps-style characters...');

    const peeps = {
        kid:        peep({ skin: '#e3b48c', shirt: '#4a7a8c', pants: '#2b4055', hairStyle: 'short', hair: '#4a2e1a' }),
        kidPirate:  peep({ skin: '#e3b48c', shirt: '#4a7a8c', pants: '#2b4055', hairStyle: 'short', hair: '#4a2e1a', accessory: 'bandana', armsUp: true }),
        privateer:  peep({ skin: '#c99165', shirt: '#1f3d5c', pants: '#111', hairStyle: 'short', accessory: 'bicorne' }),
        blackbeard: peep({ skin: '#b67b4f', shirt: '#2a2a2a', pants: '#111', hairStyle: 'short', accessory: 'tricorn', beard: true }),
        captain:    peep({ skin: '#caa07a', shirt: '#6b1f1f', pants: '#1a1512', hairStyle: 'long', accessory: 'captainHat', beard: true }),
        anneBonny:  peep({ skin: '#dba074', shirt: '#7a2d3d', pants: '#2b2420', hairStyle: 'long', accessory: 'bandana', dress: true }),
        maryRead:   peep({ skin: '#caa07a', shirt: '#2d4f3f', pants: '#1a1512', hairStyle: 'short', accessory: 'bandana' }),
        officer:    peep({ skin: '#e3c19c', shirt: '#1a2e4a', pants: '#111', hairStyle: 'short', accessory: 'bicorne' }),
        author:     peep({ skin: '#e3c19c', shirt: '#3a3a3a', pants: '#1a1512', hairStyle: 'short' }),
    };

    console.log('[Pirate] Building config...');

    return {
        output: {
            title: 'why-pirates-were-every-kids-dream', format: 'portrait', fps: 30, crf: 23, preset: 'medium',
            // FreeSound search ('pirate'); mood is just the fallback if the
            // search fails or FREESOUND_API_KEY isn't set.
            bgMusic: { search: 'pirate', mood: 'adventure' }, bgMusicVol: 0.08,
        },
        defaults: { voice: 'bm_george', speed: 0.95, transition: 'fade', transitionDuration: 0.35 },

        scenes: [

            // ── Scene 0 — HOOK ───────────────────────────────────────────
            {
                tts: { text: "Every kid who ever played pretend has stood on a couch with a wooden sword, shouting about buried treasure. For centuries, being a pirate was the dream. But almost everything that made it a dream was invented long after the pirates themselves were dead. Here's where that dream actually came from, and the real story underneath it.", pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: '#ece0c4' },
                    casingLayer('pir-hook', 'EVERY KID\'S DREAM', [
                        { id: 'hook1', type: 'sticker', text: 'WHY PIRATES?', slot: 'banner-top', size: 60, color: '#211a12', stroke: '#ffffff', rotate: -1, trigger: { atSeconds: 0.1 } },
                        { id: 'img_kid', type: 'photo', src: peeps.kidPirate, slot: 'mid-left', width: 464, height: 528, caption: 'EVERY KID', pinStyle: 'tape', trigger: { wordText: 'couch', occurrence: 1 } },
                        { id: 'pz1', type: 'panZoom', ...zoomTo('mid-left', 1.61), duration: 0.9, trigger: { afterId: 'img_kid', offset: 0.15 } },
                        { id: 'img_ship', type: 'photo', src: img.ship0, slot: 'mid-right', width: 496, height: 340, caption: 'THE DREAM', pinStyle: 'tape', trigger: { wordText: 'dream', occurrence: 1 } },
                        { id: 'pz2', type: 'panZoom', ...zoomTo('mid-right', 1.73), duration: 0.9, trigger: { afterId: 'img_ship', offset: 0.15 } },
                        { id: 'pz_out', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'img_ship', offset: 0.5 } },
                        { id: 'hook2', type: 'sticker', text: 'THE REAL STORY', slot: 'banner-bot', size: 64, color: '#ffffff', stroke: '#8a2e2e', bg: '#8a2e2e', rotate: 1, trigger: { wordText: 'story', occurrence: 1 } },
                        { id: 'sc_h', type: 'circle', target: 'hook2', color: '#8a2e2e', trigger: { afterId: 'hook2', offset: 0.3 } },
                        { id: 'str1', type: 'string', from: { target: 'img_kid' }, to: { target: 'img_ship' }, color: '#8a2e2e', sag: 30, trigger: { afterId: 'img_ship', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 1 — ANCIENT ROOTS ──────────────────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "Piracy isn't a pirate-ship invention. The word comes from Greek, meaning to attempt or to attack. As far back as the Mediterranean of three thousand years ago, raiders attacked merchant ships for cargo, and sometimes for people to sell. Rome itself lost so much grain to pirate raids that it eventually built a navy just to hunt them down.", pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: '#ece0c4' },
                    casingLayer('pir-s1', 'WHERE IT STARTS', [
                        { id: 'num', type: 'sticker', text: '3000 YRS AGO', slot: 'top-left', size: 48, color: '#ffffff', stroke: '#1f5c52', bg: '#1f5c52', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_o', type: 'photo', src: img.ocean, slot: 'top-center', width: 900, height: 496, rotate: -2, pinStyle: 'tape', caption: 'THE MEDITERRANEAN', trigger: { wordText: 'mediterranean', occurrence: 1 } },
                        { id: 'pz_o', type: 'panZoom', ...zoomTo('top-center', 1.61), duration: 1.0, trigger: { afterId: 'img_o', offset: 0.15 } },
                        { id: 'img_s', type: 'photo', src: img.woodship, slot: 'mid-left', width: 464, height: 326, caption: 'RAIDED FOR CARGO', pinStyle: 'tape', trigger: { wordText: 'cargo', occurrence: 1 } },
                        { id: 'pz_s', type: 'panZoom', ...zoomTo('mid-left', 1.84), duration: 0.9, trigger: { afterId: 'img_s', offset: 0.15 } },
                        { id: 'img_c', type: 'photo', src: img.cannon, slot: 'mid-right', width: 464, height: 326, caption: 'ROME BUILT A NAVY', pinStyle: 'tape', trigger: { wordText: 'navy', occurrence: 1 } },
                        { id: 'pz_c', type: 'panZoom', ...zoomTo('mid-right', 1.84), duration: 0.9, trigger: { afterId: 'img_c', offset: 0.15 } },
                        { id: 'pz_o2', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'img_c', offset: 0.5 } },
                    ]),
                ],
            },

            // ── Scene 2 — PRIVATEERS ─────────────────────────────────────
            {
                transition: 'fade',
                tts: { text: "For a long time, the fastest way to become a legal pirate was a piece of paper. Kings handed out letters of marque, permission to rob enemy ships and keep a cut. Sir Francis Drake raided Spanish treasure fleets with England's blessing, and came home a knight. The pirate and the national hero were often the exact same person, just with different paperwork.", pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: '#ece0c4' },
                    casingLayer('pir-s2', 'PIRATES WITH PAPERWORK', [
                        { id: 'num', type: 'sticker', text: 'PRIVATEERS', slot: 'top-left', size: 52, color: '#ffffff', stroke: '#1f5c52', bg: '#1f5c52', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_p', type: 'photo', src: peeps.privateer, slot: 'top-center', width: 496, height: 558, pinStyle: 'tape', caption: 'LICENSED TO RAID', trigger: { wordText: 'marque', occurrence: 1 } },
                        { id: 'pz_p', type: 'panZoom', ...zoomTo('top-center', 1.61), duration: 1.0, trigger: { afterId: 'img_p', offset: 0.15 } },
                        { id: 'img_sp', type: 'photo', src: img.ship1, slot: 'mid-right', width: 464, height: 326, caption: 'SPANISH TREASURE FLEETS', pinStyle: 'tape', trigger: { wordText: 'treasure', occurrence: 1 } },
                        { id: 'pz_sp', type: 'panZoom', ...zoomTo('mid-right', 1.84), duration: 0.9, trigger: { afterId: 'img_sp', offset: 0.15 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'img_sp', offset: 0.5 } },
                        { id: 's_paper', type: 'sticker', text: 'SAME PERSON.\nDIFFERENT PAPERWORK.', slot: 'banner-low', size: 48, color: '#ffffff', stroke: '#8a2e2e', bg: '#8a2e2e', rotate: -1, trigger: { wordText: 'paperwork', occurrence: 1 } },
                        { id: 'sc_pp', type: 'circle', target: 's_paper', color: '#8a2e2e', trigger: { afterId: 's_paper', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 3 — THE GOLDEN AGE BEGINS (inline timeline) ────────
            {
                transition: 'wipe-up',
                tts: { text: "Then came the turn everyone remembers. When wars ended, governments stopped hiring privateers, but thousands of trained sailors didn't just go home. They drifted to the Caribbean, a maze of islands with weak colonial navies. By the time a wrecked Spanish treasure fleet scattered gold along the coast in 1715, hundreds of opportunists showed up, and the Golden Age of Piracy had begun.", pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: '#ece0c4' },
                    inlineLayer(HTML_TIMELINE),
                ],
            },

            // ── Scene 4 — BLACKBEARD ─────────────────────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "No name defines the era like Blackbeard. Before battle, he reportedly tied lit fuses into his beard, wrapping himself in smoke so he looked like he'd walked out of hell itself. He never needed to actually fight much. Most ships surrendered the moment they saw him coming. His real weapon wasn't his cannons. It was his reputation.", pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: '#ece0c4' },
                    casingLayer('pir-s4', 'BLACKBEARD', [
                        { id: 'num', type: 'sticker', text: 'THE LEGEND', slot: 'top-left', size: 48, color: '#ffffff', stroke: '#8a2e2e', bg: '#8a2e2e', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_bb', type: 'photo', src: peeps.blackbeard, slot: 'top-center', width: 496, height: 558, pinStyle: 'tape', caption: 'SMOKE IN HIS BEARD', trigger: { wordText: 'beard', occurrence: 1 } },
                        { id: 'pz_bb', type: 'panZoom', ...zoomTo('top-center', 1.61), duration: 1.0, trigger: { afterId: 'img_bb', offset: 0.15 } },
                        { id: 'img_ship', type: 'photo', src: img.ship1, slot: 'mid-right', width: 464, height: 326, caption: 'MOST SHIPS JUST SURRENDERED', pinStyle: 'tape', trigger: { wordText: 'surrendered', occurrence: 1 } },
                        { id: 'pz_ship', type: 'panZoom', ...zoomTo('mid-right', 1.84), duration: 0.9, trigger: { afterId: 'img_ship', offset: 0.15 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'img_ship', offset: 0.5 } },
                        { id: 's_rep', type: 'sticker', text: 'REPUTATION\nWAS THE WEAPON', slot: 'banner-low', size: 48, color: '#ffffff', stroke: '#1f5c52', bg: '#1f5c52', rotate: -1, trigger: { wordText: 'reputation', occurrence: 1 } },
                        { id: 'sc_r', type: 'circle', target: 's_rep', color: '#1f5c52', trigger: { afterId: 's_rep', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 5 — ANNE BONNY & MARY READ ─────────────────────────
            {
                transition: 'fade',
                tts: { text: "Two of the most feared pirates of the era weren't men at all. Anne Bonny and Mary Read sailed together under Calico Jack Rackham, fighting in open combat while most of their crew hid below deck during their final battle. When Jack was captured and sentenced to hang, Anne reportedly told him that if he'd fought like a man, he wouldn't have to die like a dog.", pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: '#ece0c4' },
                    casingLayer('pir-s5', 'ANNE & MARY', [
                        { id: 'num', type: 'sticker', text: 'NOT MEN', slot: 'top-left', size: 52, color: '#ffffff', stroke: '#8a2e2e', bg: '#8a2e2e', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_ab', type: 'photo', src: peeps.anneBonny, slot: 'mid-left', width: 464, height: 528, caption: 'ANNE BONNY', pinStyle: 'tape', trigger: { wordText: 'bonny', occurrence: 1 } },
                        { id: 'pz_ab', type: 'panZoom', ...zoomTo('mid-left', 1.61), duration: 0.9, trigger: { afterId: 'img_ab', offset: 0.15 } },
                        { id: 'img_mr', type: 'photo', src: peeps.maryRead, slot: 'mid-right', width: 464, height: 528, caption: 'MARY READ', pinStyle: 'tape', trigger: { wordText: 'read', occurrence: 1 } },
                        { id: 'pz_mr', type: 'panZoom', ...zoomTo('mid-right', 1.61), duration: 0.9, trigger: { afterId: 'img_mr', offset: 0.15 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'img_mr', offset: 0.5 } },
                        { id: 's_quote', type: 'sticker', text: '"FOUGHT LIKE A MAN,\nOR DIE LIKE A DOG"', slot: 'banner-low', size: 42, color: '#ffffff', stroke: '#1f5c52', bg: '#1f5c52', rotate: -1, trigger: { wordText: 'dog', occurrence: 1 } },
                        { id: 'sc_q', type: 'circle', target: 's_quote', color: '#1f5c52', trigger: { afterId: 's_quote', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 6 — THE PIRATE CODE (inline) ───────────────────────
            {
                transition: 'wipe-up',
                tts: { text: "What made a pirate ship different wasn't the flag. It was the democracy. Crews voted their captain in, and could vote him out. Loot was split by fixed shares, agreed on paper before the voyage began. Lose a leg in battle, and the code promised you compensation. The black flag itself was a mercy, not a threat: surrender, and nobody had to die.", pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: '#ece0c4' },
                    inlineLayer(HTML_CODE),
                ],
            },

            // ── Scene 7 — MYTH VS REALITY (inline) ───────────────────────
            {
                transition: 'fade',
                tts: { text: "Most of what we picture is invention. There were no buried treasure maps, because loot was spent, not saved. Walking the plank almost never happened; marooning on an empty island was the real punishment. Even the eyepatch probably wasn't about missing an eye. It likely kept one eye adjusted to darkness for fighting below deck. And pirates rarely sailed alone. They moved in organized fleets.", pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: '#ece0c4' },
                    inlineLayer(HTML_MYTH),
                ],
            },

            // ── Scene 8 — THE CRACKDOWN ───────────────────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "The Golden Age ended because it had to. Pirates were costing empires too much gold, and navies that had once looked away started hunting them down. Public executions were held as warnings, bodies sometimes left hanging in cages at harbor entrances. Within a few decades, a world that once had thousands of pirates had almost none left sailing free.", pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: '#ece0c4' },
                    casingLayer('pir-s8', 'THE CRACKDOWN', [
                        { id: 'num', type: 'sticker', text: 'THE END', slot: 'top-left', size: 56, color: '#ffffff', stroke: '#8a2e2e', bg: '#8a2e2e', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_c', type: 'photo', src: img.cannon, slot: 'top-center', width: 900, height: 496, rotate: -2, pinStyle: 'tape', caption: 'NAVIES STARTED HUNTING', trigger: { wordText: 'hunting', occurrence: 1 } },
                        { id: 'pz_c', type: 'panZoom', ...zoomTo('top-center', 1.61), duration: 1.0, trigger: { afterId: 'img_c', offset: 0.15 } },
                        { id: 'img_o', type: 'photo', src: peeps.officer, slot: 'mid-left', width: 434, height: 496, caption: 'PUBLIC EXECUTIONS', pinStyle: 'tape', trigger: { wordText: 'executions', occurrence: 1 } },
                        { id: 'pz_off', type: 'panZoom', ...zoomTo('mid-left', 1.61), duration: 0.9, trigger: { afterId: 'img_o', offset: 0.15 } },
                        { id: 'img_w', type: 'photo', src: img.wreck, slot: 'mid-right', width: 464, height: 326, caption: 'ALMOST NONE LEFT', pinStyle: 'pins', trigger: { wordText: 'free', occurrence: 1 } },
                        { id: 'pz_w', type: 'panZoom', ...zoomTo('mid-right', 1.84), duration: 0.9, trigger: { afterId: 'img_w', offset: 0.15 } },
                        { id: 'pz_o2', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'img_w', offset: 0.5 } },
                    ]),
                ],
            },

            // ── Scene 9 — HOW THE DREAM WAS BUILT ────────────────────────
            {
                transition: 'fade',
                tts: { text: "So where did the dream actually come from? Mostly from books, decades after the real pirates were gone. Treasure Island gave us the map, the parrot, the one-legged sea cook. Peter Pan gave us Captain Hook. Hollywood gave us the swashbuckling hero. The version every kid fell in love with wasn't history. It was fiction, built on top of history, and it worked perfectly.", pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: '#ece0c4' },
                    casingLayer('pir-s9', 'BUILDING THE DREAM', [
                        { id: 'num', type: 'sticker', text: 'THE MYTHMAKERS', slot: 'top-left', size: 46, color: '#ffffff', stroke: '#1f5c52', bg: '#1f5c52', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_a', type: 'photo', src: peeps.author, slot: 'top-center', width: 464, height: 528, pinStyle: 'tape', caption: 'WRITTEN DECADES LATER', trigger: { wordText: 'books', occurrence: 1 } },
                        { id: 'pz_a', type: 'panZoom', ...zoomTo('top-center', 1.61), duration: 1.0, trigger: { afterId: 'img_a', offset: 0.15 } },
                        { id: 'img_m', type: 'photo', src: img.oldmap, slot: 'mid-left', width: 464, height: 326, caption: 'TREASURE ISLAND', pinStyle: 'tape', trigger: { wordText: 'map', occurrence: 1 } },
                        { id: 'pz_m', type: 'panZoom', ...zoomTo('mid-left', 1.84), duration: 0.9, trigger: { afterId: 'img_m', offset: 0.15 } },
                        { id: 'img_cap', type: 'photo', src: peeps.captain, slot: 'mid-right', width: 434, height: 496, caption: 'CAPTAIN HOOK', pinStyle: 'tape', trigger: { wordText: 'hook', occurrence: 1 } },
                        { id: 'pz_cap', type: 'panZoom', ...zoomTo('mid-right', 1.61), duration: 0.9, trigger: { afterId: 'img_cap', offset: 0.15 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'img_cap', offset: 0.5 } },
                        { id: 's_worked', type: 'sticker', text: 'AND IT WORKED\nPERFECTLY', slot: 'banner-low', size: 52, color: '#ffffff', stroke: '#8a2e2e', bg: '#8a2e2e', rotate: -1, trigger: { wordText: 'perfectly', occurrence: 1 } },
                        { id: 'sc_w', type: 'circle', target: 's_worked', color: '#8a2e2e', trigger: { afterId: 's_worked', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 10 — VERDICT + CTA (inline) ────────────────────────
            {
                transition: 'fade',
                tts: { text: "So why was being a pirate every kid's dream? Not the gold. Not the skull and crossbones. It was the vote, the fair share, a world with no landlord or king telling anyone what to do. That's the part fiction kept, because it's the part that was actually true. Subscribe for more facts nobody tells you.", pauseAfter: 0.3 },
                captions: false,
                layers: [
                    { type: 'background', color: '#ece0c4' },
                    inlineLayer(HTML_VERDICT),
                ],
            },
        ],
    };
})();