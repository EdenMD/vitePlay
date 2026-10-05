// config.nursing-interview.js
// "What Actually Happens in Your Nursing School Interview" — ~4 min, 21 scenes.
// Voice: am_michael — casual, friendly, measured (per your voice guide).
//
// RUN: VIDEO_CONFIG=config.nursing-interview.js node engine-ci.js
//
// DESIGN DECISIONS (per your feedback across this conversation):
//   - NO hand-illustrated stick figures / peeps. Real stock photos for every
//     human moment. Custom minimal line-icons ONLY for abstract beats
//     (a pause, a thought, a question) where no literal photo makes sense.
//   - Each "character" (the woman, the man in navy, the man by the window)
//     is fetched ONCE and the exact same resolved image is reused in every
//     scene they appear in — guarantees visual continuity instead of three
//     random different people each time a new photo is fetched.
//   - ONE big full-bleed image per scene, gentle Ken Burns zoom, no corkboard
//     clutter — this is flowing narration, not a countdown list.
//   - NATIVE word-synced highlight captions (captions: {style:'highlight'})
//     instead of hand-built text reveals — this is the actual mechanism the
//     "What If" / narration-simulation genre relies on for retention.
//   - No background music, per your earlier instruction on this project.
//
// ICON HONESTY NOTE: the 5 small icons (nervous hands, brain, stopwatch,
// speech bubble, mailbox) are hand-coded minimal line-art in the same
// visual language as Feather/Lucide — NOT literal files from those
// libraries (couldn't reliably fetch them). Swap in real Feather/Lucide
// SVGs the same way if you want the literal library — same data: URI slot.

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
        console.log(`[Nursing] SerpAPI cached: ${results.length} result(s) for "${query}"`);
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
            if (attempt > 0) console.log(`[Nursing]  ↻ serpapi retry [#${idx}] for "${query}"`);
            const { base64, contentType } = await downloadToBase64(candidateUrl);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            lastErr = e;
            console.warn(`[Nursing]  ⚠ serpapi [#${idx}] failed: ${e.message?.slice(0, 60)}`);
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
                console.log(`[Nursing] ✓ "${query}" #${imageIndex} via serpapi`);
                return uri;
            }
            const imageUrl = await searchSource(source, query, orientation, imageIndex);
            if (!imageUrl) continue;
            const { base64, contentType } = await downloadToBase64(imageUrl);
            console.log(`[Nursing] ✓ "${query}" via ${source}`);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            console.warn(`[Nursing]  ⚠ ${source} failed for "${query}": ${e.message?.slice(0, 60)}`);
        }
    }
    console.warn(`[Nursing]  ✗ ALL sources failed for "${query}"`);
    return null;
}

const THEME = { paper: '#efe9de', ink: '#201c16', accent: '#3a6b8a', accent2: '#8a5a3a' };

// ── Minimal hand-coded line icons (Feather/Lucide-spirited, not literal) ──
function icon(name) {
    const paths = {
        nervousHands: `<path d="M20 44 Q30 36 40 44 Q50 36 60 44" stroke-dasharray="4 5"/>
                       <path d="M20 54 Q30 46 40 54 Q50 46 60 54" stroke-dasharray="4 5"/>
                       <circle cx="40" cy="20" r="10"/>`,
        brain: `<path d="M30 14 Q16 14 16 28 Q10 30 10 40 Q10 50 20 52 Q18 60 26 64 Q32 68 40 64
                 Q48 68 54 64 Q62 60 60 52 Q70 50 70 40 Q70 30 64 28 Q64 14 50 14 Q44 10 40 14 Q36 10 30 14 Z"/>
                 <path d="M40 14 L40 64 M26 28 Q32 32 26 38 M54 28 Q48 32 54 38"/>`,
        stopwatch: `<circle cx="40" cy="46" r="26"/><path d="M40 46 L40 30 M40 46 L52 54"/>
                    <path d="M30 10 L50 10 M40 10 L40 18"/>`,
        speechBubble: `<path d="M12 18 H68 Q74 18 74 24 V50 Q74 56 68 56 H30 L16 70 V56 H12 Q6 56 6 50 V24 Q6 18 12 18 Z"/>
                       <path d="M24 32 H56 M24 42 H46"/>`,
        mailbox: `<rect x="14" y="26" width="52" height="38" rx="4"/><path d="M14 30 L40 50 L66 30"/>
                  <rect x="34" y="66" width="12" height="8"/>`,
    };
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none"
        stroke="${THEME.ink}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
        ${paths[name] || ''}
    </svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// ── Full-bleed photo scene: one big image, gentle Ken Burns zoom ─────────
const fullBleedLayer = (src) => ({
    type: 'html-record',
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;padding:0;box-sizing:border-box}
        html,body{width:1080px;height:1920px;overflow:hidden;background:#000}
        .frame{position:absolute;inset:0;overflow:hidden}
        img{width:100%;height:100%;object-fit:cover;
            animation:kb 7s ease-out forwards;transform-origin:center center}
        @keyframes kb{from{transform:scale(1.0)}to{transform:scale(1.12)}}
        .vignette{position:absolute;left:0;right:0;bottom:0;height:40%;
            background:linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,0));pointer-events:none}
    </style></head><body>
        <div class="frame"><img src="${src}"><div class="vignette"></div></div>
    </body></html>`,
    cursor: false, fps: 30,
    viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
});

// ── Icon-card scene: one centered icon on the paper theme, for abstract beats ─
const iconCardLayer = (iconSrc) => ({
    type: 'html-record',
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        *{margin:0;padding:0;box-sizing:border-box}
        html,body{width:1080px;height:1920px;overflow:hidden;background:${THEME.paper}}
        .wrap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
        img{width:300px;height:300px;opacity:0;transform:scale(.8);
            animation:pop .6s cubic-bezier(.2,1.3,.4,1) forwards}
        @keyframes pop{to{opacity:1;transform:scale(1)}}
    </style></head><body>
        <div class="wrap"><img src="${iconSrc}"></div>
    </body></html>`,
    cursor: false, fps: 30,
    viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
});

// Native word-synced captions — used on every scene instead of hand-built text.
const CAPTIONS = {
    style: 'highlight', position: 'bottom',
    highlightColor: '#f0c24b', textColor: '#ffffff',
};

module.exports = (async () => {

    console.log('[Nursing] Fetching character/scene photos — ONE fetch per character, reused across scenes...');

    const wanted = [
        ['panel0',     'interview panel',   { source: 'serpapi', imageIndex: 0 }],
        ['panel1',     'interview panel',   { source: 'serpapi', imageIndex: 1 }],
        ['blazer',     'blazer jacket',     { source: 'pexels' }],
        ['parkinglot', 'parking lot',       { source: 'pexels' }],
        ['door',       'office door',       { source: 'serpapi' }],
        ['window',     'office window',     { source: 'pexels' }],
        ['handshake1', 'business handshake',{ source: 'serpapi', imageIndex: 0 }],
        ['handshake2', 'business handshake',{ source: 'serpapi', imageIndex: 1 }],
        ['sitting',    'person sitting',    { source: 'pexels' }],
        ['woman',      'woman glasses',     { source: 'pexels' }],
        ['manNavy',    'man writing',       { source: 'pexels' }],
        ['manWindow',  'man thinking',      { source: 'pexels' }],
        ['smiling',    'man smiling',       { source: 'pexels' }],
        ['hallway',    'office hallway',    { source: 'serpapi' }],
    ];
    const img = {};
    for (const [key, query, opts] of wanted) img[key] = await fetchImageRobust(query, opts);

    console.log('[Nursing] Building config...');

    const beats = [
        // [tts text, visual layer]
        [ "The door opens, and three people are already sitting behind a table, folders open, already halfway through your file before you've even said a word — but to really understand this moment, you've got to go back twelve hours first.", fullBleedLayer(img.panel0) ],
        [ "Last night your blazer was already laid out on the bed, and this morning blurred past in the usual way — the mirror, fixing your collar, one long breath out before you even left the house.", fullBleedLayer(img.blazer) ],
        [ "Then the drive over, pulling into a parking lot that was already filling up with people dressed exactly like you.", fullBleedLayer(img.parkinglot) ],
        [ "And now here you are again, standing at that same door, except this time it's open, and for just a second your body simply refuses to move.", fullBleedLayer(img.door) ],
        [ "Past the panel, two tall windows let in thin stripes of afternoon light through half-closed blinds, and behind you a whiteboard still carries the ghost of whatever lecture used this room a few hours earlier.", fullBleedLayer(img.window) ],
        [ "The woman on the left is in a blazer the color of dried clay, her reading glasses pushed up into gray-streaked hair, while the man beside her, younger, in a navy jacket with no tie, already has a pen resting in his hand like he's used to writing fast — and the third one, by the window, hasn't looked up yet, still working through your file.", fullBleedLayer(img.panel1) ],
        [ "They each offer a hand in turn, the woman's grip warm but brief, the man in navy's quick, almost a formality, and it's only the third one, by the window, who finally looks up as he shakes yours, the only one who actually meets your eyes while he does it.", fullBleedLayer(img.handshake1) ],
        [ "You sit, and the chair is cold enough to feel through your trousers, your back straightening on its own like your spine already knew the rules before you did, while your hands slide flat onto your thighs, out of sight beneath the table.", fullBleedLayer(img.sitting) ],
        [ "Somewhere behind you a vent hums low, a pen clicks twice, and before the silence can settle, the woman in the clay-colored blazer leans in and asks it — so, why nursing — her eyes staying on you the whole time, steady, waiting.", fullBleedLayer(img.woman) ],
        [ "Your throat goes dry exactly when you need it least, so you swallow before the first word even makes it out, and under the table your knee starts a small bounce you're hoping nobody can see.", iconCardLayer(icon('nervousHands')) ],
        [ "Above the table, the woman gives a small nod that could mean almost anything, and the man in navy looks down and starts writing the second your sentence ends, that one second somehow feeling like a verdict all on its own.", fullBleedLayer(img.manNavy) ],
        [ "He doesn't even look up to ask the next one — a patient's family is upset with you, what do you do — his pen already moving before your mouth has finished opening.", fullBleedLayer(img.manNavy) ],
        [ "Your brain goes quiet for a beat, not empty, just working fast, flipping through every version of an answer at once.", iconCardLayer(icon('brain')) ],
        [ "The pause that follows feels enormous, long enough that the one by the window finally sets your file down and actually watches you now, waiting to see what you'll do with the silence instead of rushing to fill it.", iconCardLayer(icon('stopwatch')) ],
        [ "So you answer anyway, slower this time, and something in the room shifts — the woman's small nod turns into a real one, the kind that means she actually heard you.", fullBleedLayer(img.woman) ],
        [ "Then the one by the window speaks for the first time, his voice quieter than you expected — what does patient-centered care mean to you — and he's watching your face more than he's listening to the words.", fullBleedLayer(img.manWindow) ],
        [ "Any questions for us lands, and for the first time all three look at you together, at the exact same moment, like the room just shifted its weight onto your side of the table.", iconCardLayer(icon('speechBubble')) ],
        [ "You ask something real, not about schedules but about what the program actually feels like once you're inside it, and the man in navy smiles, just slightly, his pen finally going still.", fullBleedLayer(img.smiling) ],
        [ "Chairs push back, three more handshakes follow, looser this time because the hard part's behind you now, and even the woman's grip feels warmer than it did twenty minutes ago.", fullBleedLayer(img.handshake2) ],
        [ "You walk back out through the same hallway you came in through, already replaying every answer in your head, certain somewhere in there you said the wrong thing.", fullBleedLayer(img.hallway) ],
        [ "Here's the part nobody tells you though: nursing school interviews don't hand out same-day answers, so you wait, sometimes for weeks, and that silence isn't a verdict either. Subscribe for more of what's really happening, when nobody explains it.", iconCardLayer(icon('mailbox')) ],
    ];

    return {
        output: {
            title: 'nursing-interview-what-actually-happens', format: 'portrait', fps: 30, crf: 23, preset: 'medium',
            // No background music, per request — field omitted entirely.
        },
        defaults: { voice: 'am_michael', speed: 0.95, transition: 'fade', transitionDuration: 0.3 },

        scenes: beats.map(([text, layer]) => ({
            tts: { text, pauseAfter: 0.2 },
            captions: CAPTIONS,
            layers: [ layer ],
        })),
    };
})();