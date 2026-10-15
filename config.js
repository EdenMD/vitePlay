// config.household-dangers.js
// "Top 5 Deadliest Things In Every Household Right Now" — ~2 min, 7 scenes.
// Voice: am_adam — casual, same register as config.weapons-backfired.js.
//
// RUN: VIDEO_CONFIG=config.household-dangers.js node engine-ci.js
//
// ARCHITECTURE: deliberately copied exactly from config.weapons-backfired.js
// per request — NO native stock-image-sequence / rotate-cw this time, just
// the same custom fetch infra + casingLayer/inlineLayer pattern. One custom
// hand-drawn SVG (the carbon monoxide "invisible gas" icon) for the one
// beat a photo genuinely can't capture — same reasoning as the Brazen Bull
// illustration in the weapons video.
//
// NO BACKGROUND MUSIC — output.bgMusic intentionally omitted, same as last time.
// IMAGES BIG — single dominant visual per beat. Gentle zoom only (1.15–1.25x).
//
// FACT-CHECK NOTES (real, not sensationalized):
//   - Falls (stairs especially) are a leading cause of home injury death,
//     disproportionately toddlers and older adults — well-established public
//     safety data (CDC/NFPA-type sources).
//   - Unattended cooking and open flames (candles) are the leading causes
//     of home structure fires.
//   - Mixing bleach with ammonia or vinegar produces toxic gas (chloramine
//     or chlorine respectively) — real, well-documented household hazard.
//   - Carbon monoxide is colorless/odorless and a genuine "silent killer" —
//     standard public health framing, not exaggeration.
//   - Bathrooms are statistically one of the most injury-prone rooms in a
//     home, largely due to falls on wet/hard surfaces — real safety data,
//     used here as the "twist" since it's less obviously dramatic than a
//     kitchen knife but statistically more dangerous.

const https  = require('https');
const http   = require('http');

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
        console.log(`[Household] SerpAPI cached: ${results.length} result(s) for "${query}"`);
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
            if (attempt > 0) console.log(`[Household]  ↻ serpapi retry [#${idx}] for "${query}"`);
            const { base64, contentType } = await downloadToBase64(candidateUrl);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            lastErr = e;
            console.warn(`[Household]  ⚠ serpapi [#${idx}] failed: ${e.message?.slice(0, 60)}`);
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
                console.log(`[Household] ✓ "${query}" #${imageIndex} via serpapi`);
                return uri;
            }
            const imageUrl = await searchSource(source, query, orientation, imageIndex);
            if (!imageUrl) continue;
            const { base64, contentType } = await downloadToBase64(imageUrl);
            console.log(`[Household] ✓ "${query}" via ${source}`);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            console.warn(`[Household]  ⚠ ${source} failed for "${query}": ${e.message?.slice(0, 60)}`);
        }
    }
    console.warn(`[Household]  ✗ ALL sources failed for "${query}"`);
    return null;
}

// ── Camera helper (same slot math as weapons-backfired) ──────────────────
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
    paper: '#efe6d3', ink: '#231b12',
    accent: '#b5402c', accent2: '#2c6b5a',
    shadow: 'rgba(20,16,10,0.4)',
};

// ── One custom illustration: carbon monoxide — invisible, so no photo can
// show it. Same reasoning as the Brazen Bull in config.weapons-backfired.js.
function coGasSVG() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240">
        <rect x="40" y="150" width="60" height="90" fill="#8a8a8a"/>
        <rect x="120" y="120" width="80" height="120" fill="#6e6e6e"/>
        <rect x="220" y="160" width="60" height="80" fill="#8a8a8a"/>
        <rect x="150" y="60" width="20" height="60" fill="#4a4a4a"/>
        <circle cx="120" cy="90" r="34" fill="#b5402c" opacity="0.18"/>
        <circle cx="160" cy="60" r="40" fill="#b5402c" opacity="0.22"/>
        <circle cx="205" cy="85" r="30" fill="#b5402c" opacity="0.18"/>
        <circle cx="140" cy="40" r="22" fill="#b5402c" opacity="0.15"/>
        <text x="160" y="95" font-family="Arial" font-size="34" font-weight="900"
              fill="#ffffff" text-anchor="middle">CO</text>
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

const BASE_CSS = `
  *{box-sizing:border-box}
  html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#efe6d3;
    font-family:Georgia,'Times New Roman',serif;color:#231b12}
  .wrap{position:absolute;inset:0;padding:150px 80px 300px;display:flex;flex-direction:column}
  .badge{align-self:flex-start;background:#2c6b5a;color:#fff;font:900 88px Impact,'Arial Black',sans-serif;
    padding:6px 34px;transform:rotate(-3deg);box-shadow:6px 6px 0 rgba(20,16,10,.4)}
  .badge.red{background:#b5402c}
  h1{font:900 84px/1.04 Impact,'Arial Black',sans-serif;margin:34px 0 10px;letter-spacing:.5px}
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

// ── Inline scene — CLOSE + CTA ───────────────────────────────────────────
const HTML_CLOSE = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_CSS}
  .card{border:5px solid #231b12;background:#f4ecdb;padding:32px 40px;box-shadow:8px 8px 0 rgba(20,16,10,.4);margin-top:28px;
    opacity:0;transform:translateY(14px);transition:opacity .35s ease,transform .35s ease}
  .card.on{opacity:1;transform:translateY(0)}
  .card p{font-size:40px;line-height:1.4;margin:0}
  .cta{margin-top:50px;align-self:center;text-align:center;background:#2c6b5a;color:#fff;border:5px solid #231b12;
    font:900 74px/1.05 Impact,'Arial Black',sans-serif;padding:20px 50px;transform:rotate(-1deg) scale(1.6);
    opacity:0;transition:transform .3s cubic-bezier(.2,1.4,.4,1),opacity .2s ease;box-shadow:8px 8px 0 rgba(20,16,10,.4)}
  .cta.on{opacity:1;transform:rotate(-1deg) scale(1)}
  .cta small{display:block;font:400 32px Georgia,serif;margin-top:10px;letter-spacing:0}
</style></head><body><div class="wrap">
  <div class="badge red">The Takeaway</div>
  <h1>No horror movie<br>needed</h1>
  <div class="card off" id="c1"><p>Your house is already doing the work — nice and quiet, no script required.</p></div>
  <div class="cta" id="cta">🔔 SUBSCRIBE<small>for facts nobody tells you</small></div>
</div><script>${REVEAL_JS}
  wire({quiet:'c1', subscribe:'cta'}, [['c1',6],['cta',13]]);
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

    console.log('[Household] Fetching photos sequentially (short, generic 2-word queries)...');

    const wanted = [
        ['stairs',   'home staircase',  { source: 'serpapi' }],
        ['candle',   'lit candle',      { source: 'serpapi' }],
        ['cleaning', 'cleaning bottles',{ source: 'serpapi' }],
        ['furnace',  'home furnace',    { source: 'serpapi' }],
        ['bathroom', 'bathroom tile',   { source: 'pexels'  }],
    ];
    const img = {};
    for (const [key, query, opts] of wanted) img[key] = await fetchImageRobust(query, opts);

    const art = { co: coGasSVG() };

    console.log('[Household] Building config...');

    return {
        output: {
            title: 'deadliest-things-in-every-household', format: 'portrait', fps: 30, crf: 23, preset: 'medium',
            // No background music, per the same rule as the weapons video.
        },
        defaults: { voice: 'am_adam', speed: 1.02, transition: 'fade', transitionDuration: 0.3 },

        scenes: [

            // ── Scene 0 — HOOK ───────────────────────────────────────────
            {
                tts: { text: "You know what's wild? The thing most likely to actually hurt you isn't some dramatic movie villain. It's sitting in your house right now. Here are the Top 5 deadliest things hiding in every home, and the real danger at number one is not what you think.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('hd-hook', 'HIDING IN PLAIN SIGHT', [
                        { id: 'hook1', type: 'sticker', text: 'IT\'S CLOSER\nTHAN YOU THINK', slot: 'banner-top', size: 54, color: '#231b12', stroke: '#ffffff', rotate: -1, trigger: { atSeconds: 0.1 } },
                        { id: 'img_s', type: 'photo', src: img.stairs, slot: 'mid-center', width: 760, height: 540, caption: 'YOUR OWN HOUSE', pinStyle: 'tape', trigger: { wordText: 'house', occurrence: 1 } },
                        { id: 'pz1', type: 'panZoom', ...zoomTo('mid-center', 1.15), duration: 1.0, trigger: { afterId: 'img_s', offset: 0.2 } },
                        { id: 'pz_out', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'pz1', offset: 0.6 } },
                        { id: 'hook2', type: 'sticker', text: 'TOP 5', slot: 'banner-bot', size: 70, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: 1, trigger: { wordText: 'five', occurrence: 1 } },
                        { id: 'sc_h', type: 'circle', target: 'hook2', color: '#b5402c', trigger: { afterId: 'hook2', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 1 — #5 STAIRS ───────────────────────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "Number five: stairs. Yeah — just, stairs. Falls are one of the single biggest causes of home injury death, especially for toddlers and older adults, and your staircase does not care how many times you've used it safely before.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('hd-s1', '#5 — THE STAIRS', [
                        { id: 'num', type: 'sticker', text: '#5', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_st', type: 'photo', src: img.stairs, slot: 'mid-center', width: 800, height: 560, caption: 'JUST... STAIRS', pinStyle: 'tape', trigger: { wordText: 'stairs', occurrence: 2 } },
                        { id: 'pz_st', type: 'panZoom', ...zoomTo('mid-center', 1.2), duration: 1.0, trigger: { afterId: 'img_st', offset: 0.2 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'pz_st', offset: 0.7 } },
                        { id: 's_tag', type: 'sticker', text: 'DOESN\'T CARE\nHOW CAREFUL YOU ARE', slot: 'banner-low', size: 42, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -1, trigger: { wordText: 'before', occurrence: 1 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#b5402c', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 2 — #4 CANDLES / UNATTENDED FIRE ────────────────────
            {
                transition: 'fade',
                tts: { text: "Number four: that candle you lit for 'ambiance.' Unattended cooking and open flames are the leading causes of house fires, and a fire can go from a small flicker to the whole room in under thirty seconds.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('hd-s2', '#4 — THE CANDLE', [
                        { id: 'num', type: 'sticker', text: '#4', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_c', type: 'photo', src: img.candle, slot: 'mid-center', width: 760, height: 540, caption: '"JUST FOR AMBIANCE"', pinStyle: 'tape', trigger: { wordText: 'ambiance', occurrence: 1 } },
                        { id: 'pz_c', type: 'panZoom', ...zoomTo('mid-center', 1.2), duration: 1.0, trigger: { afterId: 'img_c', offset: 0.2 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'pz_c', offset: 0.7 } },
                        { id: 's_tag', type: 'sticker', text: 'UNDER 30\nSECONDS', slot: 'banner-low', size: 52, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -1, trigger: { wordText: 'seconds', occurrence: 1 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#b5402c', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 3 — #3 MIXING CLEANING PRODUCTS ─────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "Number three: your cleaning cabinet. Mix bleach with ammonia, or bleach with vinegar, and you don't get a super-cleaner. You get toxic gas, in your own bathroom, with the door closed.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('hd-s3', '#3 — THE CLEANING CABINET', [
                        { id: 'num', type: 'sticker', text: '#3', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_cl', type: 'photo', src: img.cleaning, slot: 'mid-center', width: 760, height: 540, caption: 'NOT A SUPER-CLEANER', pinStyle: 'tape', trigger: { wordText: 'vinegar', occurrence: 1 } },
                        { id: 'pz_cl', type: 'panZoom', ...zoomTo('mid-center', 1.2), duration: 1.0, trigger: { afterId: 'img_cl', offset: 0.2 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'pz_cl', offset: 0.7 } },
                        { id: 's_tag', type: 'sticker', text: 'TOXIC GAS.\nDOOR CLOSED.', slot: 'banner-low', size: 48, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -1, trigger: { wordText: 'closed', occurrence: 1 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#b5402c', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 4 — #2 CARBON MONOXIDE ──────────────────────────────
            {
                transition: 'fade',
                tts: { text: "Number two: carbon monoxide. No smell, no color, no warning. A faulty heater or a running engine in a closed garage can fill a house with it while everyone's asleep, which is exactly why it's nicknamed the silent killer.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('hd-s4', '#2 — THE SILENT KILLER', [
                        { id: 'num', type: 'sticker', text: '#2', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_f', type: 'photo', src: img.furnace, slot: 'top-center', width: 560, height: 400, rotate: -2, pinStyle: 'tape', caption: 'A FAULTY HEATER', trigger: { wordText: 'heater', occurrence: 1 } },
                        { id: 'pz_f', type: 'panZoom', ...zoomTo('top-center', 1.15), duration: 1.0, trigger: { afterId: 'img_f', offset: 0.2 } },
                        { id: 'img_co', type: 'photo', src: art.co, slot: 'low-center', width: 420, height: 320, caption: 'NO SMELL. NO COLOR.', pinStyle: 'pins', trigger: { wordText: 'warning', occurrence: 1 } },
                        { id: 'pz_co', type: 'panZoom', ...zoomTo('low-center', 1.2), duration: 1.0, trigger: { afterId: 'img_co', offset: 0.2 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'pz_co', offset: 0.6 } },
                        { id: 's_tag', type: 'sticker', text: 'THE SILENT\nKILLER', slot: 'banner-low', size: 52, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -1, trigger: { wordText: 'killer', occurrence: 1 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#b5402c', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 5 — #1 THE BATHROOM (twist) ─────────────────────────
            {
                transition: 'wipe-up',
                tts: { text: "And number one: the bathroom. Not the kitchen with all the knives, the bathroom. Wet tile, a hard edge, a split second losing your footing. Statistically, it's one of the most dangerous rooms in your entire house.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('hd-s5', '#1 — THE BATHROOM', [
                        { id: 'num', type: 'sticker', text: '#1', slot: 'top-left', size: 90, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_b', type: 'photo', src: img.bathroom, slot: 'mid-center', width: 800, height: 560, caption: 'NOT THE KITCHEN', pinStyle: 'tape', trigger: { wordText: 'knives', occurrence: 1 } },
                        { id: 'pz_b', type: 'panZoom', ...zoomTo('mid-center', 1.2), duration: 1.0, trigger: { afterId: 'img_b', offset: 0.2 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'pz_b', offset: 0.7 } },
                        { id: 's_tag', type: 'sticker', text: 'MOST DANGEROUS\nROOM IN THE HOUSE', slot: 'banner-low', size: 42, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -1, trigger: { wordText: 'house', occurrence: 2 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#2c6b5a', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 6 — CLOSE + CTA (inline) ────────────────────────────
            {
                transition: 'fade',
                tts: { text: "So no, you don't need a horror movie. Your house is already doing the work, nice and quiet, no script required. Subscribe for more facts nobody tells you.", pauseAfter: 0.2 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    inlineLayer(HTML_CLOSE),
                ],
            },
        ],
    };
})();