// config.weapons-backfired.js
// "Top 5 Weapons That Backfired on Their Own Inventors" — ~2 min, 7 scenes.
// Voice: am_adam — this one's casual/jokey, not documentary, so Adam fits
// better than George even though the subject is history.
//
// RUN: VIDEO_CONFIG=config.weapons-backfired.js node engine-ci.js
//
// NO BACKGROUND MUSIC — output.bgMusic intentionally omitted.
// IMAGES BIG — single dominant visual per beat, not 3-across (lesson from
//   the pirate config: small photos = can't see them). Zoom kept gentle
//   (1.1–1.3x) per your last note not to overdo it.
// FACT-CHECK NOTES (kept honest, not sensationalized):
//   - Perillos/Brazen Bull: ancient account (Pliny, Diodorus), semi-legendary,
//     not independently verified — framed as "the story goes," not fact.
//   - Henry Shrapnel: real, died in genuine financial hardship despite his
//     shell's widespread military adoption.
//   - Richard Gatling: his own stated reasoning (reduce army sizes to reduce
//     deaths) is documented; the irony is real and widely cited.
//   - Kalashnikov: his late-life letter expressing anguish over the AK-47's
//     death toll is documented (reported via Russian press/church sources).
//   - Alfred Nobel: the mistaken obituary ("merchant of death," misprinted
//     after his brother Ludvig died) prompting his will change is the
//     widely accepted account of the Nobel Prize's origin.

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
        console.log(`[Backfired] SerpAPI cached: ${results.length} result(s) for "${query}"`);
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
            if (attempt > 0) console.log(`[Backfired]  ↻ serpapi retry [#${idx}] for "${query}"`);
            const { base64, contentType } = await downloadToBase64(candidateUrl);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            lastErr = e;
            console.warn(`[Backfired]  ⚠ serpapi [#${idx}] failed: ${e.message?.slice(0, 60)}`);
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
                console.log(`[Backfired] ✓ "${query}" #${imageIndex} via serpapi`);
                return uri;
            }
            const imageUrl = await searchSource(source, query, orientation, imageIndex);
            if (!imageUrl) continue;
            const { base64, contentType } = await downloadToBase64(imageUrl);
            console.log(`[Backfired] ✓ "${query}" via ${source}`);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            console.warn(`[Backfired]  ⚠ ${source} failed for "${query}": ${e.message?.slice(0, 60)}`);
        }
    }
    console.warn(`[Backfired]  ✗ ALL sources failed for "${query}"`);
    return null;
}

// ── Camera helper ──────────────────────────────────────────────────────
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

// ── peep() — same parametric character generator used in the pirate video ─
function peep({
    skin = '#caa07a', shirt = '#2d4f5e', pants = '#2b2420',
    hair = '#2a1e16', hairStyle = 'short',
    accessory = 'none', beard = false, dress = false, armsUp = false,
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
        toga: `<path d="M50 118 Q100 100 150 118 L150 150 Q100 136 50 150 Z" fill="#ece0c4"/>`,
        crown: `<path d="M44 60 L60 30 L80 56 L100 24 L120 56 L140 30 L156 60 Z" fill="#c9a24b" stroke="#8a6a2a" stroke-width="3"/>`,
    }[accessory] || '';

    const eyepatch = `<circle cx="80" cy="94" r="4" fill="#1a1512"/><circle cx="118" cy="94" r="4" fill="#1a1512"/>`;

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

// ── small custom illustration: the Brazen Bull ─────────────────────────
function bullSVG() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240">
        <ellipse cx="160" cy="130" rx="118" ry="62" fill="#a17136"/>
        <rect x="46" y="162" width="20" height="62" fill="#7c5425"/>
        <rect x="98" y="162" width="20" height="62" fill="#7c5425"/>
        <rect x="200" y="162" width="20" height="62" fill="#7c5425"/>
        <rect x="252" y="162" width="20" height="62" fill="#7c5425"/>
        <ellipse cx="268" cy="100" rx="42" ry="36" fill="#a17136"/>
        <path d="M242 72 L220 38" stroke="#5a3a18" stroke-width="9" stroke-linecap="round"/>
        <path d="M264 66 L258 28" stroke="#5a3a18" stroke-width="9" stroke-linecap="round"/>
        <circle cx="284" cy="96" r="5" fill="#1a1512"/>
        <rect x="136" y="100" width="52" height="38" rx="5" fill="#5a3a18" stroke="#2a1a08" stroke-width="3"/>
        <circle cx="162" cy="119" r="4" fill="#c9a24b"/>
        <path d="M60 224 L82 190 M108 224 L130 190 M198 224 L220 190 M250 224 L272 190"
              stroke="#d4703a" stroke-width="7" stroke-linecap="round"/>
        <path d="M70 224 L72 200 M118 224 L120 200" stroke="#f0a04a" stroke-width="5" stroke-linecap="round"/>
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

// ── Inline scene — #1 NOBEL (newspaper mix-up → Peace Prize) ───────────
const HTML_NOBEL = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_CSS}
  .clip{border:5px solid #231b12;background:#e7dcc3;padding:30px 34px;margin-top:20px;
    box-shadow:8px 8px 0 rgba(20,16,10,.4);font-family:Georgia,serif;position:relative;
    opacity:0;transform:translateY(14px);transition:opacity .35s ease,transform .35s ease}
  .clip.on{opacity:1;transform:translateY(0)}
  .clip .kicker{font-size:22px;letter-spacing:3px;color:#5a4f3a}
  .clip h2{font:900 46px Impact,'Arial Black',sans-serif;margin:8px 0;color:#1a1512}
  .stamp{position:absolute;right:30px;top:30px;border:6px solid #b5402c;color:#b5402c;
    font:900 42px Impact,'Arial Black',sans-serif;padding:2px 16px;transform:rotate(-8deg) scale(1.6);
    opacity:0;transition:transform .3s cubic-bezier(.2,1.4,.4,1),opacity .2s ease}
  .stamp.on{opacity:1;transform:rotate(-8deg) scale(1)}
  .medal{align-self:center;margin-top:50px;opacity:0;transform:scale(.6);
    transition:opacity .4s ease,transform .4s cubic-bezier(.2,1.4,.4,1)}
  .medal.on{opacity:1;transform:scale(1)}
  .cap{text-align:center;font-size:36px;margin-top:20px;max-width:820px;align-self:center}
</style></head><body><div class="wrap">
  <div class="badge red">#1</div>
  <h1>The paper got<br>it wrong</h1>
  <div class="clip off" id="paper">
    <div class="kicker">OBITUARIES</div>
    <h2>"LE MARCHAND DE LA MORT EST MORT"</h2>
    <div class="kicker">THE MERCHANT OF DEATH IS DEAD</div>
    <div class="stamp" id="stamp">WRONG BROTHER</div>
  </div>
  <svg class="medal" id="medal" width="260" height="260" viewBox="0 0 260 260">
    <circle cx="130" cy="130" r="100" fill="#d9ac4e" stroke="#9c7a2e" stroke-width="8"/>
    <circle cx="130" cy="130" r="74" fill="none" stroke="#9c7a2e" stroke-width="4"/>
    <path d="M90 150 Q130 190 170 150" stroke="#9c7a2e" stroke-width="6" fill="none"/>
    <path d="M60 60 L40 10 M200 60 L220 10" stroke="#5a7a4a" stroke-width="10" stroke-linecap="round"/>
  </svg>
  <p class="cap off" id="cap">So he rewrote his will. That's how the Nobel Prize was born.</p>
</div><script>${REVEAL_JS}
  wire({newspaper:'paper', merchant:'stamp', will:'medal', prize:'cap'},
       [['paper',6],['stamp',11],['medal',18],['cap',22]]);
</script></body></html>`;

// ── Inline scene — closing / CTA ────────────────────────────────────────
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
  <div class="badge">The Takeaway</div>
  <h1>Karma's got<br>jokes</h1>
  <div class="card off" id="c1"><p>Build something powerful enough, and eventually, it finds its way back to you.</p></div>
  <div class="cta" id="cta">🔔 SUBSCRIBE<small>for stories nobody tells you</small></div>
</div><script>${REVEAL_JS}
  wire({powerful:'c1', subscribe:'cta'}, [['c1',6],['cta',13]]);
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

    console.log('[Backfired] Fetching photos sequentially (short, generic 2-word queries)...');

    const wanted = [
        ['shells',   'artillery shell', { source: 'serpapi' }],
        ['gatling',  'gatling gun',     { source: 'serpapi' }],
        ['ak47',     'AK 47',          { source: 'serpapi' }],
        ['dynamite', 'dynamite stick', { source: 'serpapi' }],
    ];
    const img = {};
    for (const [key, query, opts] of wanted) img[key] = await fetchImageRobust(query, opts);

    console.log('[Backfired] Building illustrations...');

    const art = {
        bull:       bullSVG(),
        perillos:   peep({ skin: '#caa07a', shirt: '#9c8a6a', pants: '#6a5a3a', hairStyle: 'short', accessory: 'toga' }),
        king:       peep({ skin: '#dba074', shirt: '#7a2d3d', pants: '#5a1f2a', hairStyle: 'short', accessory: 'crown' }),
        shrapnel:   peep({ skin: '#e3c19c', shirt: '#7a1f1f', pants: '#1a1512', hairStyle: 'short', accessory: 'bicorne' }),
        gatling:    peep({ skin: '#caa07a', shirt: '#2a2a2a', pants: '#1a1512', hairStyle: 'short', beard: true }),
        kalashnikov:peep({ skin: '#caa07a', shirt: '#3a4a3a', pants: '#1a1512', hairStyle: 'bald' }),
        nobel:      peep({ skin: '#e3c19c', shirt: '#2a2a2a', pants: '#1a1512', hairStyle: 'short', beard: true }),
    };

    console.log('[Backfired] Building config...');

    return {
        output: {
            title: 'weapons-that-backfired', format: 'portrait', fps: 30, crf: 23, preset: 'medium',
            // No background music, per request — field omitted entirely.
        },
        defaults: { voice: 'am_adam', speed: 1.05, transition: 'fade', transitionDuration: 0.3 },

        scenes: [

            // ── Scene 0 — HOOK ───────────────────────────────────────────
            {
                tts: { text: "Ever build something so good it basically came back to bite you? These five inventors found out the hard way, literally. This is Top 5 Weapons That Backfired On Their Own Inventors, and number one is almost too ironic to be real.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('wb-hook', 'IT CAME BACK AROUND', [
                        { id: 'hook1', type: 'sticker', text: 'OOPS.', slot: 'banner-top', size: 72, color: '#231b12', stroke: '#ffffff', rotate: -1, trigger: { atSeconds: 0.1 } },
                        { id: 'img_bull', type: 'photo', src: art.bull, slot: 'mid-center', width: 760, height: 540, caption: 'STORY TIME', pinStyle: 'tape', trigger: { wordText: 'build', occurrence: 1 } },
                        { id: 'pz1', type: 'panZoom', ...zoomTo('mid-center', 1.15), duration: 1.0, trigger: { afterId: 'img_bull', offset: 0.2 } },
                        { id: 'pz_out', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'pz1', offset: 0.6 } },
                        { id: 'hook2', type: 'sticker', text: 'TOP 5', slot: 'banner-bot', size: 70, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: 1, trigger: { wordText: 'five', occurrence: 1 } },
                        { id: 'sc_h', type: 'circle', target: 'hook2', color: '#b5402c', trigger: { afterId: 'hook2', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 1 — #5 PERILLOS & THE BRAZEN BULL ──────────────────
            {
                transition: 'wipe-left',
                tts: { text: "Number five: the Brazen Bull. As the story goes, ancient engineer Perillos designed a hollow bronze bull for a tyrant king. Lock someone inside, light a fire underneath, and their screams come out sounding like a bull roaring. Creative. Also horrifying. So the king decided the best way to test it... was on Perillos himself. Poetic justice much?", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('wb-s1', '#5 — THE BRAZEN BULL', [
                        { id: 'num', type: 'sticker', text: '#5', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_b', type: 'photo', src: art.bull, slot: 'mid-center', width: 800, height: 560, caption: 'THE BRAZEN BULL', pinStyle: 'tape', trigger: { wordText: 'bronze', occurrence: 1 } },
                        { id: 'pz_b', type: 'panZoom', ...zoomTo('mid-center', 1.2), duration: 1.0, trigger: { afterId: 'img_b', offset: 0.2 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'pz_b', offset: 0.7 } },
                        { id: 'img_p', type: 'photo', src: art.perillos, slot: 'low-center', width: 420, height: 546, caption: 'PERILLOS, THE DESIGNER', pinStyle: 'pins', trigger: { wordText: 'perillos', occurrence: 2 } },
                        { id: 'pz_p', type: 'panZoom', ...zoomTo('low-center', 1.25), duration: 1.0, trigger: { afterId: 'img_p', offset: 0.2 } },
                        { id: 's_tag', type: 'sticker', text: 'TESTED ON\nTHE INVENTOR', slot: 'banner-low', size: 46, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -1, trigger: { wordText: 'justice', occurrence: 1 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#b5402c', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 2 — #4 HENRY SHRAPNEL ───────────────────────────────
            {
                transition: 'fade',
                tts: { text: "Number four: Henry Shrapnel. He poured his own fortune into developing an exploding artillery shell that sprayed metal fragments across the battlefield. Brutally effective, and armies used it for over a century. The British military loved the shell. They just never got around to properly paying the guy who invented it. He died broke. His name didn't.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('wb-s2', '#4 — HENRY SHRAPNEL', [
                        { id: 'num', type: 'sticker', text: '#4', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_sh', type: 'photo', src: img.shells, slot: 'mid-center', width: 760, height: 540, caption: 'HIS EXPLODING SHELL', pinStyle: 'tape', trigger: { wordText: 'shell', occurrence: 1 } },
                        { id: 'pz_sh', type: 'panZoom', ...zoomTo('mid-center', 1.2), duration: 1.0, trigger: { afterId: 'img_sh', offset: 0.2 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'pz_sh', offset: 0.7 } },
                        { id: 'img_hs', type: 'photo', src: art.shrapnel, slot: 'low-center', width: 420, height: 546, caption: 'HENRY SHRAPNEL', pinStyle: 'pins', trigger: { wordText: 'loved', occurrence: 1 } },
                        { id: 'pz_hs', type: 'panZoom', ...zoomTo('low-center', 1.25), duration: 1.0, trigger: { afterId: 'img_hs', offset: 0.2 } },
                        { id: 's_tag', type: 'sticker', text: 'DIED BROKE.\nHIS NAME DIDN\'T.', slot: 'banner-low', size: 42, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -1, trigger: { wordText: 'broke', occurrence: 1 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#b5402c', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 3 — #3 RICHARD GATLING ──────────────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "Number three: Richard Gatling. Here's the twist. He actually thought a rapid-fire gun would make war LESS deadly. His logic? Fewer soldiers needed on the field means fewer soldiers dying. Genius idea, terrible math. Instead of shrinking battlefields, the Gatling gun became one of the deadliest weapons of its century. Turns out, making killing more efficient is not a great anti-war strategy.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('wb-s3', '#3 — RICHARD GATLING', [
                        { id: 'num', type: 'sticker', text: '#3', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_g', type: 'photo', src: img.gatling, slot: 'mid-center', width: 760, height: 540, caption: 'THE GATLING GUN', pinStyle: 'tape', trigger: { wordText: 'gun', occurrence: 1 } },
                        { id: 'pz_g', type: 'panZoom', ...zoomTo('mid-center', 1.2), duration: 1.0, trigger: { afterId: 'img_g', offset: 0.2 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'pz_g', offset: 0.7 } },
                        { id: 'img_rg', type: 'photo', src: art.gatling, slot: 'low-center', width: 420, height: 546, caption: 'RICHARD GATLING', pinStyle: 'pins', trigger: { wordText: 'logic', occurrence: 1 } },
                        { id: 'pz_rg', type: 'panZoom', ...zoomTo('low-center', 1.25), duration: 1.0, trigger: { afterId: 'img_rg', offset: 0.2 } },
                        { id: 's_tag', type: 'sticker', text: 'TERRIBLE\nMATH.', slot: 'banner-low', size: 54, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -1, trigger: { wordText: 'math', occurrence: 1 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#b5402c', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 4 — #2 MIKHAIL KALASHNIKOV ──────────────────────────
            {
                transition: 'fade',
                tts: { text: "Number two: Mikhail Kalashnikov. He built the AK-47 to defend his homeland. By the end of his life, it had become the most widely used weapon on Earth, armies, gangs, child soldiers, basically everyone, everywhere. Late in life, he reportedly wrote to his church, tormented, asking if he was spiritually responsible for every death it caused. That's not a legacy. That's a haunting.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('wb-s4', '#2 — MIKHAIL KALASHNIKOV', [
                        { id: 'num', type: 'sticker', text: '#2', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        { id: 'img_ak', type: 'photo', src: img.ak47, slot: 'mid-center', width: 760, height: 540, caption: 'THE AK-47', pinStyle: 'tape', trigger: { wordText: 'defend', occurrence: 1 } },
                        { id: 'pz_ak', type: 'panZoom', ...zoomTo('mid-center', 1.2), duration: 1.0, trigger: { afterId: 'img_ak', offset: 0.2 } },
                        { id: 'pz_o1', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'pz_ak', offset: 0.7 } },
                        { id: 'img_mk', type: 'photo', src: art.kalashnikov, slot: 'low-center', width: 420, height: 546, caption: 'MIKHAIL KALASHNIKOV', pinStyle: 'pins', trigger: { wordText: 'tormented', occurrence: 1 } },
                        { id: 'pz_mk', type: 'panZoom', ...zoomTo('low-center', 1.25), duration: 1.0, trigger: { afterId: 'img_mk', offset: 0.2 } },
                        { id: 's_tag', type: 'sticker', text: 'A HAUNTING,\nNOT A LEGACY', slot: 'banner-low', size: 42, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -1, trigger: { wordText: 'haunting', occurrence: 1 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#b5402c', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 5 — #1 ALFRED NOBEL (inline, the twist) ─────────────
            {
                transition: 'wipe-up',
                tts: { text: "And number one: Alfred Nobel. He invented dynamite, meant for mining and construction, but armies loved it too. Then one day, a newspaper got confused, printed his obituary by mistake while his brother had actually died, and called him the merchant of death. Nobel read his own death notice. Horrified by how he'd be remembered, he rewrote his will on the spot, and funded what we now call the Nobel Prize.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    inlineLayer(HTML_NOBEL),
                ],
            },

            // ── Scene 6 — CLOSING + CTA (inline) ──────────────────────────
            {
                transition: 'fade',
                tts: { text: "The guy who helped blow things up accidentally invented the Peace Prize. So maybe the universe really does have a sense of humor. Build something powerful enough, and eventually, it finds its way back to you. Subscribe for more stories nobody tells you.", pauseAfter: 0.2 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    inlineLayer(HTML_CLOSE),
                ],
            },
        ],
    };
})();