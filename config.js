// config.humanoid-soldiers.js
// "Top 5 reasons humanoid soldiers are a dumb idea" — ~3 min, 7 scenes.
//
// RUN: VIDEO_CONFIG=config.humanoid-soldiers.js node engine-ci.js
//
// STRUCTURE
//   Scene 0  hook                       paper-sticker-explainer casing
//   Scene 1  #5 legs                    paper-sticker-explainer casing
//   Scene 2  #4 field test report       INLINE html-record (audioSync, word-triggered)
//   Scene 3  #3 cost exchange           INLINE html-record (audioSync, word-triggered)
//   Scene 4  #2 payload                 paper-sticker-explainer casing
//   Scene 5  #1 twist: the shape        paper-sticker-explainer casing
//   Scene 6  verdict + CTA              INLINE html-record (audioSync, word-triggered)
//
// IMAGES
//   Short, generic ~2-word queries. SerpAPI for robot/drone subjects, Pexels
//   for plain nouns. Same query + different imageIndex reuses ONE cached
//   SerpAPI search (no extra credit). Fetch chain/validation mirrors
//   src/image-api.js (serpapi -> unsplash -> pexels -> pixabay -> picsum).
//
// AUDIO
//   output.bgMusic uses your FreeSound setup (mood based; falls back to FMA).
//   If the mood pick is off, swap it for the generated beat — see the comment
//   on `output` below. No per-scene SFX are added.
//
// FACTS USED (kept hedged on purpose)
//   - Foundation's Phantom humanoid: ~44 lb max payload incl. weapons.
//   - Two Phantom units piloted in Ukraine in early 2026 for logistics;
//     reported gaps: waterproofing, payload, battery life.
//   - Cost comparison is deliberately qualitative ("tens of thousands or
//     more" vs "a few hundred"), not a precise figure.

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
        console.log(`[Humanoid] SerpAPI cached: ${results.length} result(s) for "${query}"`);
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

// Walks forward through the cached SerpAPI result list when a link is dead.
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
            if (attempt > 0) console.log(`[Humanoid]  ↻ serpapi retry [#${idx}] for "${query}"`);
            const { base64, contentType } = await downloadToBase64(candidateUrl);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            lastErr = e;
            console.warn(`[Humanoid]  ⚠ serpapi [#${idx}] failed: ${e.message?.slice(0, 60)}`);
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
                console.log(`[Humanoid] ✓ "${query}" #${imageIndex} via serpapi`);
                return uri;
            }
            const imageUrl = await searchSource(source, query, orientation, imageIndex);
            if (!imageUrl) continue;
            const { base64, contentType } = await downloadToBase64(imageUrl);
            console.log(`[Humanoid] ✓ "${query}" via ${source}`);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            console.warn(`[Humanoid]  ⚠ ${source} failed for "${query}": ${e.message?.slice(0, 60)}`);
        }
    }
    console.warn(`[Humanoid]  ✗ ALL sources failed for "${query}"`);
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

// ── Shared look: same paper palette as the sticker casing ───────────────
const THEME = {
    paper: '#e8dfcd', ink: '#1a1a1a',
    accent: '#a93226', accent2: '#1a5276',
    shadow: 'rgba(20,16,10,0.38)',
};

// Base CSS for the three inline scenes. Safe zone: ~150px top, ~300px bottom.
const BASE_CSS = `
  *{box-sizing:border-box}
  html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:#e8dfcd;
    font-family:Georgia,'Times New Roman',serif;color:#1a1a1a}
  .wrap{position:absolute;inset:0;padding:150px 80px 300px;display:flex;flex-direction:column}
  .badge{align-self:flex-start;background:#1a5276;color:#fff;font:900 96px Impact,'Arial Black',sans-serif;
    padding:6px 34px;transform:rotate(-3deg);box-shadow:6px 6px 0 rgba(20,16,10,.38)}
  .badge.red{background:#a93226}
  h1{font:900 92px/1.02 Impact,'Arial Black',sans-serif;margin:36px 0 12px;letter-spacing:.5px}
  .sub{font-size:38px;line-height:1.3;margin:0 0 36px;color:#3a3226;max-width:900px}
  .off{opacity:0;transition:opacity .35s ease}
  .on{opacity:1}
`;

// Inline reveal helper. Each scene reveals items when the narrator SAYS the
// trigger word (audioSync), with a late-time fallback so a missed word match
// can never leave an item hidden.
// Usage in scene scripts: reveal map {word: elementId}, fallbacks [[id, seconds]].
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
    document.body.setAttribute('data-ready', '1');   // listener attached FIRST, then ready
  }
`;

// ── Inline scene 2 — #4 field test report ───────────────────────────────
const HTML_FIELD_REPORT = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_CSS}
  .rows{display:flex;flex-direction:column;gap:30px}
  .row{display:flex;align-items:center;justify-content:space-between;border:5px solid #1a1a1a;
    background:#f4ecdb;padding:38px 46px;position:relative;box-shadow:8px 8px 0 rgba(20,16,10,.38)}
  .k{font:900 62px Impact,'Arial Black',sans-serif}
  .v{font-size:46px;font-style:italic;color:#3a3226}
  .stamp{position:absolute;right:34px;top:50%;margin-top:-42px;border:6px solid #a93226;color:#a93226;
    font:900 56px Impact,'Arial Black',sans-serif;padding:2px 22px;transform:rotate(-9deg) scale(2.2);
    opacity:0;transition:transform .28s cubic-bezier(.2,1.4,.4,1),opacity .2s ease;background:#f4ecdb}
  .row.on .stamp{transform:rotate(-9deg) scale(1);opacity:1}
  .row .v{margin-right:230px}
  .note{margin-top:46px;font-size:44px;line-height:1.35;border-left:10px solid #a93226;padding-left:28px}
  .note b{font-family:Impact,'Arial Black',sans-serif;font-weight:900;letter-spacing:.5px}
</style></head><body><div class="wrap">
  <div class="badge">#4</div>
  <h1>It can't handle<br>the field</h1>
  <p class="sub">Two humanoid robots hauling supplies in Ukraine, early 2026. What testers reported:</p>
  <div class="rows">
    <div class="row off" id="r1"><div class="k">Waterproofing</div><div class="v">Lacking</div><div class="stamp">FAIL</div></div>
    <div class="row off" id="r2"><div class="k">Payload</div><div class="v">Limited</div><div class="stamp">FAIL</div></div>
    <div class="row off" id="r3"><div class="k">Battery life</div><div class="v">Too short</div><div class="stamp">FAIL</div></div>
  </div>
  <div class="note off" id="note"><b>War zone:</b> mud, dust, rain, cold.<br><b>Built for:</b> clean factory floors.</div>
</div><script>${REVEAL_JS}
  wire({waterproofing:'r1', limited:'r2', battery:'r3', mud:'note'},
       [['r1',12],['r2',14],['r3',16],['note',20]]);
</script></body></html>`;

// ── Inline scene 3 — #3 cost exchange ───────────────────────────────────
const HTML_COST = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_CSS}
  .panel{border:5px solid #1a1a1a;background:#f4ecdb;padding:34px 40px;box-shadow:8px 8px 0 rgba(20,16,10,.38);margin-top:26px}
  .head{display:flex;align-items:center;gap:36px}
  .name{font:900 66px/1 Impact,'Arial Black',sans-serif}
  .price{font-size:42px;font-style:italic;color:#3a3226;margin-top:8px}
  svg.bot{width:120px;height:240px;flex:none}
  .grid{display:grid;grid-template-columns:repeat(8,1fr);gap:14px;margin-top:26px}
  .d{aspect-ratio:1;position:relative;opacity:0;transform:scale(.3);transition:opacity .2s ease,transform .25s cubic-bezier(.2,1.4,.4,1)}
  .d::before{content:"";position:absolute;inset:34%;background:#a93226;border-radius:2px}
  .d::after{content:"";position:absolute;inset:6%;border-radius:50%;
    background:radial-gradient(circle at 12% 12%,#1a1a1a 11%,transparent 12%),radial-gradient(circle at 88% 12%,#1a1a1a 11%,transparent 12%),
               radial-gradient(circle at 12% 88%,#1a1a1a 11%,transparent 12%),radial-gradient(circle at 88% 88%,#1a1a1a 11%,transparent 12%)}
  #pb.on .d{opacity:1;transform:scale(1)}
  .cap{font-size:36px;margin-top:20px;color:#3a3226}
  .trade{margin-top:34px;align-self:center;background:#a93226;color:#fff;border:5px solid #1a1a1a;
    font:900 70px Impact,'Arial Black',sans-serif;padding:8px 40px;transform:rotate(-2deg) scale(1.8);
    opacity:0;transition:transform .3s cubic-bezier(.2,1.4,.4,1),opacity .2s ease;box-shadow:8px 8px 0 rgba(20,16,10,.38)}
  .trade.on{opacity:1;transform:rotate(-2deg) scale(1)}
</style></head><body><div class="wrap">
  <div class="badge">#3</div>
  <h1>The math<br>doesn't work</h1>
  <div class="panel off" id="pa"><div class="head">
    <svg class="bot" viewBox="0 0 100 200" fill="none" stroke="#1a1a1a" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="50" cy="22" r="15"/><rect x="30" y="46" width="40" height="62" rx="8"/>
      <path d="M30 56 L10 100 M70 56 L90 100 M42 108 L36 186 M58 108 L64 186"/></svg>
    <div><div class="name">1 humanoid robot</div><div class="price">tens of thousands of dollars, or more</div></div>
  </div></div>
  <div class="panel off" id="pb"><div class="name">Small attack drone</div>
    <div class="price">a few hundred dollars</div><div class="grid" id="grid"></div>
    <div class="cap">Dozens of drones for the price of one robot.</div></div>
  <div class="trade" id="trade">A BAD TRADE</div>
</div><script>${REVEAL_JS}
  var g = document.getElementById('grid'), s = '';
  for (var i = 0; i < 40; i++) s += '<div class="d" style="transition-delay:' + (i * 0.03).toFixed(2) + 's"></div>';
  g.innerHTML = s;
  wire({tens:'pa', few:'pb', donating:'trade'}, [['pa',7],['pb',11],['trade',21]]);
</script></body></html>`;

// ── Inline scene 6 — verdict + CTA ──────────────────────────────────────
const HTML_VERDICT = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_CSS}
  .card{border:5px solid #1a1a1a;background:#f4ecdb;padding:36px 44px;box-shadow:8px 8px 0 rgba(20,16,10,.38);margin-top:30px}
  .card h2{font:900 64px Impact,'Arial Black',sans-serif;margin:0 0 14px}
  .card.yes h2{color:#1a5276}.card.no h2{color:#a93226}
  .card ul{margin:0;padding-left:34px;font-size:42px;line-height:1.45}
  .cta{margin-top:44px;align-self:center;text-align:center;background:#1a5276;color:#fff;border:5px solid #1a1a1a;
    font:900 78px/1.05 Impact,'Arial Black',sans-serif;padding:20px 54px;transform:rotate(-1deg) scale(1.6);
    opacity:0;transition:transform .3s cubic-bezier(.2,1.4,.4,1),opacity .2s ease;box-shadow:8px 8px 0 rgba(20,16,10,.38)}
  .cta.on{opacity:1;transform:rotate(-1deg) scale(1)}
  .cta small{display:block;font:400 34px Georgia,serif;margin-top:10px;letter-spacing:0}
</style></head><body><div class="wrap">
  <div class="badge red">Verdict</div>
  <h1>A solution to<br>a movie</h1>
  <div class="card yes off" id="yes"><h2>Maybe useful</h2>
    <ul><li>Hauling supplies</li><li>Going where people shouldn't</li><li>Working in spaces built for people</li></ul></div>
  <div class="card no off" id="no"><h2>Not worth it</h2>
    <ul><li>Front-line combat</li><li>Fighting cheap drones</li><li>Replacing the soldier</li></ul></div>
  <div class="cta" id="cta">🔔 SUBSCRIBE<small>for facts nobody tells you</small></div>
</div><script>${REVEAL_JS}
  wire({maybe:'yes', movie:'no', subscribe:'cta'}, [['yes',5],['no',13],['cta',19]]);
</script></body></html>`;

// Helper: an inline full-frame html-record layer.
const inlineLayer = (html) => ({
    type: 'html-record', html,
    audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
    viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
});

// Helper: a sticker-casing html-record layer.
const casingLayer = (tag, title, commands) => ({
    type: 'html-record', src: `./ApexCasing/paper-sticker-explainer.html?tag=${tag}`,
    audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
    viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
    data: { title, theme: THEME, commands },
});

module.exports = (async () => {

    console.log('[Humanoid] Fetching images sequentially...');

    // [key, query, opts]. Same query + different imageIndex = one SerpAPI search.
    const wanted = [
        ['humanoid0', 'humanoid robot',   { source: 'serpapi', imageIndex: 0 }],
        ['humanoid1', 'humanoid robot',   { source: 'serpapi', imageIndex: 1 }],
        ['soldier0',  'robot soldier',    { source: 'serpapi', imageIndex: 0 }],
        ['soldier1',  'robot soldier',    { source: 'serpapi', imageIndex: 1 }],
        ['fpv0',      'FPV drone',        { source: 'serpapi', imageIndex: 0 }],
        ['fpv1',      'FPV drone',        { source: 'serpapi', imageIndex: 1 }],
        ['falling',   'robot falling',    { source: 'serpapi' }],
        ['tracked',   'tracked robot',    { source: 'serpapi' }],
        ['bomb',      'bomb robot',       { source: 'serpapi' }],
        ['mud',       'muddy terrain',    { source: 'pexels'  }],
        ['backpack',  'soldier backpack', { source: 'pexels'  }],
    ];
    const img = {};
    for (const [key, query, opts] of wanted) img[key] = await fetchImageRobust(query, opts);

    console.log('[Humanoid] Images resolved. Building config...');

    return {
        output: {
            title: 'humanoid-soldiers-dumb', format: 'portrait', fps: 30, crf: 23, preset: 'medium',
            // FreeSound mood pick. If it's inaccurate, replace the next two lines with a generated beat
            // (no API, fully deterministic):
            //   beat: { bpm: 70, bars: 8, genre: 'cinematic', key: 'Ephrygian', vol: 0.16 },
            bgMusic: { mood: 'dark' }, bgMusicVol: 0.16,
        },
        defaults: { voice: 'am_adam', speed: 0.95, transition: 'fade', transitionDuration: 0.35 },

        scenes: [

            // ── Scene 0 — HOOK ───────────────────────────────────────────
            {
                tts: {
                    text: "Billions of dollars are flowing into humanoid robots, and now companies want to put them in uniform. Machines shaped like us, built to fight like us. But the robots actually changing today's battlefield look nothing like people. Here are the top five reasons humanoid soldiers are a dumb idea, and number one is not what you'd expect.",
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    casingLayer('hs-hook', 'HUMANOID SOLDIERS', [
                        { id: 'hook1', type: 'sticker', text: 'ROBOT SOLDIERS?\nREALLY?', slot: 'banner-top', size: 62, color: '#1a1a1a', stroke: '#ffffff', rotate: -1, trigger: { atSeconds: 0.1 } },
                        { id: 'img_h',  type: 'photo', src: img.humanoid0, slot: 'mid-left',   width: 320, height: 220, caption: 'HUMANOID',    pinStyle: 'tape', trigger: { wordText: 'billions', occurrence: 1 } },
                        { id: 'pz1',    type: 'panZoom', ...zoomTo('mid-left', 1.5),   duration: 0.9, trigger: { afterId: 'img_h', offset: 0.15 } },
                        { id: 'img_s',  type: 'photo', src: img.soldier0,  slot: 'mid-center', width: 320, height: 220, caption: 'IN UNIFORM',  pinStyle: 'tape', trigger: { wordText: 'uniform', occurrence: 1 } },
                        { id: 'pz2',    type: 'panZoom', ...zoomTo('mid-center', 1.5), duration: 0.9, trigger: { afterId: 'img_s', offset: 0.15 } },
                        { id: 'img_d',  type: 'photo', src: img.fpv0,      slot: 'mid-right',  width: 320, height: 220, caption: 'WHAT ACTUALLY WORKS', pinStyle: 'tape', trigger: { wordText: 'battlefield', occurrence: 1 } },
                        { id: 'pz3',    type: 'panZoom', ...zoomTo('mid-right', 1.5),  duration: 0.9, trigger: { afterId: 'img_d', offset: 0.15 } },
                        { id: 'pz_out', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'img_d', offset: 0.5 } },
                        { id: 'hook2',  type: 'sticker', text: 'TOP 5 REASONS', slot: 'banner-bot', size: 68, color: '#ffffff', stroke: '#a93226', bg: '#a93226', rotate: 1, trigger: { wordText: 'five', occurrence: 1 } },
                        { id: 'sc_h',   type: 'circle', target: 'hook2', color: '#a93226', trigger: { afterId: 'hook2', offset: 0.3 } },
                        { id: 'str1',   type: 'string', from: { target: 'img_h' }, to: { target: 'img_s' }, color: '#a93226', sag: 30, trigger: { afterId: 'img_s', offset: 0.3 } },
                        { id: 'str2',   type: 'string', from: { target: 'img_s' }, to: { target: 'img_d' }, color: '#a93226', sag: 30, trigger: { afterId: 'img_d', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 1 — #5 LEGS ────────────────────────────────────────
            {
                transition: 'wipe-left',
                tts: {
                    text: "Number five: legs. Walking on two feet is one of the hardest problems in robotics. Every step is a controlled fall, and one bad slip in mud, rubble or sand puts the machine on the ground. Wheels and tracks have moved heavy machines across rough terrain for a century, with far fewer parts that can break.",
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    casingLayer('hs-s1', '#5 — LEGS', [
                        { id: 'num', type: 'sticker', text: '#5', slot: 'top-left', size: 90, color: '#ffffff', stroke: '#1a5276', bg: '#1a5276', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 's_legs', type: 'sticker', text: 'TWO LEGS =\nTWO WAYS TO FALL', slot: 'mid-left', size: 40, color: '#1a1a1a', stroke: '#ffffff', rotate: -2, trigger: { wordText: 'legs', occurrence: 1 } },
                        { id: 'pz_l', type: 'panZoom', ...zoomTo('mid-left', 1.5), duration: 0.9, trigger: { afterId: 's_legs', offset: 0.15 } },
                        { id: 'img_f', type: 'photo', src: img.falling, slot: 'top-center', width: 580, height: 340, rotate: -2, pinStyle: 'tape', caption: 'EVERY STEP IS A CONTROLLED FALL', trigger: { wordText: 'fall', occurrence: 1 } },
                        { id: 'pz_f', type: 'panZoom', ...zoomTo('top-center', 1.4), duration: 1.0, trigger: { afterId: 'img_f', offset: 0.15 } },
                        { id: 'img_m', type: 'photo', src: img.mud, slot: 'mid-right', width: 300, height: 210, caption: 'MUD · RUBBLE · SAND', pinStyle: 'tape', trigger: { wordText: 'mud', occurrence: 1 } },
                        { id: 'pz_m', type: 'panZoom', ...zoomTo('mid-right', 1.6), duration: 0.9, trigger: { afterId: 'img_m', offset: 0.15 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'img_m', offset: 0.5 } },
                        { id: 'img_t', type: 'photo', src: img.tracked, slot: 'banner-low', width: 500, height: 280, caption: 'WHEELS + TRACKS: FEWER PARTS TO BREAK', pinStyle: 'pins', trigger: { wordText: 'tracks', occurrence: 1 } },
                        { id: 'pz_t', type: 'panZoom', ...zoomTo('banner-low', 1.4), duration: 1.0, trigger: { afterId: 'img_t', offset: 0.15 } },
                        { id: 'sc_t', type: 'circle', target: 'img_t', color: '#a93226', trigger: { afterId: 'pz_t', offset: 0.3 } },
                        { id: 'pz_o2', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'sc_t', offset: 0.4 } },
                    ]),
                ],
            },

            // ── Scene 2 — #4 FIELD TEST REPORT (inline html) ─────────────
            {
                transition: 'fade',
                tts: {
                    text: "Number four: it can't handle the field. When two humanoid robots were tested in Ukraine early this year, hauling supplies, the problems were clear. No waterproofing. Limited payload. Not enough battery life. A war zone is mud, dust, rain and cold, and most humanoid robots today are built for clean factory floors.",
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    inlineLayer(HTML_FIELD_REPORT),
                ],
            },

            // ── Scene 3 — #3 COST EXCHANGE (inline html) ─────────────────
            {
                transition: 'wipe-up',
                tts: {
                    text: "Number three: the math doesn't work. A capable humanoid robot costs tens of thousands of dollars, or more. A small attack drone costs a few hundred. When one cheap drone can wreck an expensive walking machine, you're not winning a war. You're donating money to the other side.",
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    inlineLayer(HTML_COST),
                ],
            },

            // ── Scene 4 — #2 PAYLOAD ─────────────────────────────────────
            {
                transition: 'wipe-left',
                tts: {
                    text: "Number two: it can't carry enough. The Phantom, one of the few humanoids built for the military, is designed to carry about forty-four pounds, weapons included. A soldier routinely hauls more than that, and a small tracked robot can carry several times as much. If your robot helper carries less than the soldier it's supposed to help, who is helping who?",
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    casingLayer('hs-s4', '#2 — PAYLOAD', [
                        { id: 'num', type: 'sticker', text: '#2', slot: 'top-left', size: 90, color: '#ffffff', stroke: '#1a5276', bg: '#1a5276', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_p', type: 'photo', src: img.humanoid1, slot: 'top-center', width: 580, height: 340, rotate: 2, pinStyle: 'tape', caption: 'PHANTOM: ~44 LB MAX, WEAPONS INCLUDED', trigger: { wordText: 'phantom', occurrence: 1 } },
                        { id: 'pz_p', type: 'panZoom', ...zoomTo('top-center', 1.4), duration: 1.0, trigger: { afterId: 'img_p', offset: 0.15 } },
                        { id: 's_lb', type: 'sticker', text: '44 LB\nTOTAL', slot: 'mid-left', size: 54, color: '#ffffff', stroke: '#a93226', bg: '#a93226', rotate: 2, trigger: { wordText: 'pounds', occurrence: 1 } },
                        { id: 'img_sol', type: 'photo', src: img.backpack, slot: 'mid-right', width: 300, height: 210, caption: 'SOLDIER: ROUTINELY MORE', pinStyle: 'tape', trigger: { wordText: 'soldier', occurrence: 1 } },
                        { id: 'pz_s', type: 'panZoom', ...zoomTo('mid-right', 1.6), duration: 0.9, trigger: { afterId: 'img_sol', offset: 0.15 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'img_sol', offset: 0.5 } },
                        { id: 'img_tr', type: 'photo', src: img.tracked, slot: 'banner-low', width: 500, height: 280, caption: 'TRACKED ROBOT: SEVERAL TIMES MORE', pinStyle: 'pins', trigger: { wordText: 'tracked', occurrence: 1 } },
                        { id: 'pz_tr', type: 'panZoom', ...zoomTo('banner-low', 1.4), duration: 1.0, trigger: { afterId: 'img_tr', offset: 0.15 } },
                        { id: 'pz_o2', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'pz_tr', offset: 0.5 } },
                        { id: 's_who', type: 'sticker', text: 'WHO IS HELPING WHO?', slot: 'banner-bot', size: 56, color: '#ffffff', stroke: '#1a5276', bg: '#1a5276', rotate: -1, trigger: { wordText: 'helping', occurrence: 1 } },
                        { id: 'sc_who', type: 'circle', target: 's_who', color: '#1a5276', trigger: { afterId: 's_who', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 5 — #1 THE SHAPE (twist) ───────────────────────────
            {
                transition: 'zoom-in',
                tts: {
                    text: "And number one: the human shape was never really an engineering choice. It came from movies. We copy the human body because we want a machine that feels like a soldier, not because war demands it. Meanwhile, the real robot soldiers are already here. They fly, they roll, they crawl, and not one of them has a face.",
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    casingLayer('hs-s5', '#1 — THE SHAPE', [
                        { id: 'num', type: 'sticker', text: '#1', slot: 'top-left', size: 90, color: '#ffffff', stroke: '#a93226', bg: '#a93226', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_mv', type: 'photo', src: img.soldier1, slot: 'top-center', width: 580, height: 340, rotate: -3, pinStyle: 'tape', caption: 'DESIGNED BY HOLLYWOOD', trigger: { wordText: 'movies', occurrence: 1 } },
                        { id: 'pz_mv', type: 'panZoom', ...zoomTo('top-center', 1.4), duration: 1.0, trigger: { afterId: 'img_mv', offset: 0.15 } },
                        { id: 's_feel', type: 'sticker', text: 'LOOKS RIGHT.\nWORKS WRONG.', slot: 'mid-center', size: 46, color: '#ffffff', stroke: '#a93226', bg: '#a93226', rotate: 2, trigger: { wordText: 'feels', occurrence: 1 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 's_feel', offset: 0.6 } },
                        { id: 'img_fly',   type: 'photo', src: img.fpv1,    slot: 'low-left',   width: 280, height: 200, caption: 'THEY FLY',   pinStyle: 'tape', trigger: { wordText: 'fly', occurrence: 1 } },
                        { id: 'pz_fly',    type: 'panZoom', ...zoomTo('low-left', 1.6),   duration: 0.9, trigger: { afterId: 'img_fly', offset: 0.15 } },
                        { id: 'img_roll',  type: 'photo', src: img.tracked, slot: 'low-center', width: 280, height: 200, caption: 'THEY ROLL',  pinStyle: 'tape', trigger: { wordText: 'roll', occurrence: 1 } },
                        { id: 'pz_roll',   type: 'panZoom', ...zoomTo('low-center', 1.6), duration: 0.9, trigger: { afterId: 'img_roll', offset: 0.15 } },
                        { id: 'img_crawl', type: 'photo', src: img.bomb,    slot: 'low-right',  width: 280, height: 200, caption: 'THEY CRAWL', pinStyle: 'tape', trigger: { wordText: 'crawl', occurrence: 1 } },
                        { id: 'pz_crawl',  type: 'panZoom', ...zoomTo('low-right', 1.6),  duration: 0.9, trigger: { afterId: 'img_crawl', offset: 0.15 } },
                        { id: 'pz_o2', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'img_crawl', offset: 0.5 } },
                        { id: 's_face', type: 'sticker', text: 'NOT ONE\nHAS A FACE', slot: 'banner-low', size: 64, color: '#ffffff', stroke: '#1a5276', bg: '#1a5276', rotate: -1, trigger: { wordText: 'face', occurrence: 1 } },
                        { id: 'sc_face', type: 'circle', target: 's_face', color: '#1a5276', trigger: { afterId: 's_face', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 6 — VERDICT + CTA (inline html) ────────────────────
            {
                transition: 'fade',
                tts: {
                    text: "Is there a place for humanoids in the military? Maybe. Hauling supplies, or going where it's too dangerous to send a person. But a robot soldier shaped like a soldier is a solution to a movie, not a battlefield. Subscribe for more facts nobody tells you.",
                    pauseAfter: 0.3,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    inlineLayer(HTML_VERDICT),
                ],
            },
        ],
    };
})();