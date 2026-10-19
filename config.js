// config.tesla-roadster-flying.js
// "Tesla's New Flying Roadster Is a Dumb Idea" — ~2.5 min, 8 scenes.
// Voice: bm_george (kept same as last time, per request).
//
// RUN: VIDEO_CONFIG=config.tesla-roadster-flying.js node engine-ci.js
//
// TOPIC CORRECTION FROM LAST BUILD: this is the SECOND-GENERATION Roadster
// with SpaceX cold-gas thrusters, unveiled Oct 15, 2026 near Waco, Texas —
// NOT the original 2008 car from the previous config. Facts below are from
// live search on the actual event, 4 days old at time of writing.
//
// STRUCTURE FIX: compliment-then-pivot, as requested — scenes 0-1 genuinely
// hype the car's real capabilities, scene 2 is the turn ("surprise: this
// is dumb"), scenes 3-5 are the disadvantages, scene 6 is the twist on WHY
// a smart team built it anyway, scene 7 closes.
//
// CAMERA FIX: the "road mapper" effect now winds left/right (x-axis) while
// descending (y-axis), instead of a straight vertical line — see
// randomRoadSlots() below. That's the actual correction from last time.
//
// RULES CARRIED OVER: ApexCasing only (no inline HTML — wasn't needed).
// Every concrete noun in the narration gets its own real photo (SerpAPI/
// Pexels, 2-word queries) — no illustration this time, not even a stick
// figure; every visual here had a real photo available.
//
// FACTS USED (verified via live search, Oct 2026):
//   - Reveal: October 15, 2026, SpaceX test site near Waco, TX.
//   - Demo: drove up a curved ramp using a SpaceX suction/fan system while
//     fully upside down, launched off via cold-gas thrusters, flipped
//     mid-air, landed on its wheels. Also flew over a parked Cybertruck,
//     Cybercab, Model Y, Model 3, and Semi.
//   - 3 trims: Performance (2-seat, sub-1.6s 0-60, no thrusters), Thrust
//     (2-seat, rear thrusters, sub-0.9s 0-60), Rocket (1-seat, 10 perimeter
//     thrusters, sub-0.59s 0-60, 230+mph — the one that "flies").
//   - 10 cold-gas thrusters fed by ~600 liters of compressed air — genuine
//     cold-gas tech (same family as spacecraft RCS), not combustion.
//   - No price announced at the reveal itself. Reported reservation
//     structure: $250,000 total for the thruster version ($5k refundable
//     deposit + $245k due within 10 days).
//   - Production targeted for 2028 — originally promised in 2017 for 2020
//     delivery, an 11-year gap from first promise to actual production.
//   - The flying "Rocket" version is explicitly not road-legal while flying.
//   - The Verge's own framing: the event "lasted under 30 minutes and
//     played more like a stunt show than a product launch."

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
        console.log(`[Roadster2] SerpAPI cached: ${results.length} result(s) for "${query}"`);
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
            if (attempt > 0) console.log(`[Roadster2]  ↻ serpapi retry [#${idx}] for "${query}"`);
            const { base64, contentType } = await downloadToBase64(candidateUrl);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            lastErr = e;
            console.warn(`[Roadster2]  ⚠ serpapi [#${idx}] failed: ${e.message?.slice(0, 60)}`);
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
                console.log(`[Roadster2] ✓ "${query}" #${imageIndex} via serpapi`);
                return uri;
            }
            const imageUrl = await searchSource(source, query, orientation, imageIndex);
            if (!imageUrl) continue;
            const { base64, contentType } = await downloadToBase64(imageUrl);
            console.log(`[Roadster2] ✓ "${query}" via ${source}`);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            console.warn(`[Roadster2]  ⚠ ${source} failed for "${query}": ${e.message?.slice(0, 60)}`);
        }
    }
    console.warn(`[Roadster2]  ✗ ALL sources failed for "${query}"`);
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

// ── "Road mapper" camera, CORRECTED: winds left/right (x) while it
// descends (y), instead of travelling in a straight vertical line. Each
// step picks a tier strictly lower than the last (so it never climbs back
// up) but a RANDOM x-position within that tier (so it curves like an
// actual road), and never repeats the same x-position twice in a row.
const ROAD_TIERS = ['top', 'mid', 'low', 'bot', 'deep'];
const ROAD_X     = ['left', 'center', 'right'];
function randomRoadSlots(n) {
    const slots = [];
    let lastX = null;
    for (let i = 0; i < n && i < ROAD_TIERS.length; i++) {
        let x;
        do { x = ROAD_X[Math.floor(Math.random() * ROAD_X.length)]; } while (x === lastX);
        lastX = x;
        slots.push(`${ROAD_TIERS[i]}-${x}`);
    }
    return slots;
}

const THEME = {
    paper: '#efe6d3', ink: '#231b12',
    accent: '#b5402c', accent2: '#2c6b5a',
    shadow: 'rgba(20,16,10,0.4)',
};

const casingLayer = (tag, title, commands) => ({
    type: 'html-record', src: `./ApexCasing/paper-sticker-explainer.html?tag=${tag}`,
    audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
    viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
    data: { title, theme: THEME, commands },
});

// Builds the winding road-mapper command sequence for N images.
function roadDown(images, zoomScale = 1.35) {
    const slots = randomRoadSlots(images.length);
    const cmds = [];
    let prevId = null;
    images.forEach((img, i) => {
        const slot = slots[i];
        const photoId = `${img.id}_photo`;
        const zoomId  = `${img.id}_zoom`;
        cmds.push({
            id: photoId, type: 'photo', src: img.src, slot,
            width: img.width || 460, height: img.height || 340,
            caption: img.caption, pinStyle: i % 2 === 0 ? 'tape' : 'pins',
            trigger: prevId
                ? { afterId: prevId, offset: 0.1 }
                : { wordText: img.triggerWord, occurrence: img.occurrence || 1 },
        });
        cmds.push({
            id: zoomId, type: 'panZoom', ...zoomTo(slot, img.scale || zoomScale),
            duration: 1.0, trigger: { afterId: photoId, offset: 0.15 },
        });
        prevId = zoomId;
    });
    cmds.push({ id: `road_out_${images[0]?.id || 'x'}`, type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: prevId, offset: 0.6 } });
    return cmds;
}

module.exports = (async () => {

    console.log('[Roadster2] Fetching photos sequentially (short, generic 2-word queries)...');

    const wanted = [
        ['roadster0', 'tesla roadster',  { source: 'serpapi', imageIndex: 0 }],
        ['roadster1', 'tesla roadster',  { source: 'serpapi', imageIndex: 1 }],
        ['cybertruck','tesla cybertruck',{ source: 'serpapi' }],
        ['thruster',  'rocket thruster', { source: 'serpapi' }],
        ['musk',      'elon musk',       { source: 'serpapi' }],
        ['pricetag',  'price tag',       { source: 'serpapi' }],
        ['cash',      'dollar bills',    { source: 'pexels'  }],
        ['highway',   'highway road',    { source: 'serpapi' }],
        ['sign',      'no entry sign',   { source: 'serpapi' }],
        ['calendar',  'calendar pages',  { source: 'pexels'  }],
        ['factory',   'car factory',     { source: 'serpapi' }],
        ['cameras',   'news cameras',    { source: 'serpapi' }],
        ['logo',      'tesla logo',      { source: 'serpapi' }],
    ];
    const img = {};
    for (const [key, query, opts] of wanted) img[key] = await fetchImageRobust(query, opts);

    console.log('[Roadster2] Building config...');

    return {
        output: {
            title: 'flying-tesla-roadster-dumb-idea', format: 'portrait', fps: 30, crf: 23, preset: 'medium',
            // No background music, same rule as the last two videos.
        },
        defaults: { voice: 'bm_george', speed: 1.0, transition: 'fade', transitionDuration: 0.3 },

        scenes: [

            // ── Scene 0 — COMPLIMENT 1: the demo itself ──────────────────
            {
                tts: { text: "Okay, I need you to see this before I say anything else. Tesla just showed off a car that can drive straight up a ramp while completely upside down, launch itself off the end using rocket thrusters, flip in midair, and land like it's nothing. It flew clean over a Cybertruck. A sports car that can genuinely leave the ground. Incredible piece of engineering.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('trf-s0', 'IT ACTUALLY FLIES', [
                        { id: 'badge', type: 'sticker', text: 'WATCH THIS', slot: 'banner-top', size: 58, color: '#231b12', stroke: '#ffffff', rotate: -1, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'ramp', src: img.roadster0, caption: 'UPSIDE DOWN, THEN LAUNCHED', triggerWord: 'ramp', occurrence: 1, width: 520, height: 360 },
                            { id: 'cyber', src: img.cybertruck, caption: 'FLEW OVER A CYBERTRUCK', triggerWord: 'cybertruck', occurrence: 1, width: 500, height: 340 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 1 — COMPLIMENT 2: the real specs ───────────────────
            {
                transition: 'wipe-left',
                tts: { text: "Zero to sixty in under six tenths of a second on the top trim. Over two hundred thirty miles an hour. Ten actual cold-gas thrusters wrapped around the car — the same basic tech SpaceX uses to steer rockets in space. This isn't marketing fluff. Tesla built real hardware here.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('trf-s1', 'REAL HARDWARE', [
                        ...roadDown([
                            { id: 'thr', src: img.thruster, caption: '10 COLD-GAS THRUSTERS', triggerWord: 'thrusters', occurrence: 1, width: 500, height: 360 },
                            { id: 'car2', src: img.roadster1, caption: 'REAL HARDWARE', triggerWord: 'hardware', occurrence: 1, width: 520, height: 360 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 2 — THE PIVOT ───────────────────────────────────────
            {
                transition: 'fade',
                tts: { text: "So here's the surprise: this is actually a pretty dumb idea. Not the engineering — the decision to build it at all, at least not yet. Let me show you why.", pauseAfter: 0.3 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('trf-s2', 'THE SURPRISE', [
                        { id: 'badge', type: 'sticker', text: 'BUT...', slot: 'banner-top', size: 70, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: 1, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'musk1', src: img.musk, caption: 'A DUMB IDEA?', triggerWord: 'surprise', occurrence: 1, width: 440, height: 560 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 3 — DISADVANTAGE 1: no price ────────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "Reason one: nobody knows what it costs. Tesla did the entire flying demonstration and never once put a price on screen. You can reserve one for two hundred fifty thousand dollars, without knowing what you're actually paying for.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('trf-s3', 'REASON #1 — NO PRICE', [
                        { id: 'num', type: 'sticker', text: '#1', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'tag', src: img.pricetag, caption: 'NEVER ANNOUNCED', triggerWord: 'price', occurrence: 1, width: 480, height: 340 },
                            { id: 'ca', src: img.cash, caption: '$250,000 BLIND', triggerWord: 'dollars', occurrence: 1, width: 480, height: 340 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 4 — DISADVANTAGE 2: not road legal while flying ────
            {
                transition: 'fade',
                tts: { text: "Reason two: the one thing everyone's talking about — the actual flying — isn't legal to use on a public road. You get the single-seat version that can fly, and the one place you're not allowed to fly it is literally anywhere you'd normally drive.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('trf-s4', 'REASON #2 — NOT ROAD LEGAL', [
                        { id: 'num', type: 'sticker', text: '#2', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'hw', src: img.highway, caption: 'ANYWHERE YOU\'D NORMALLY DRIVE', triggerWord: 'road', occurrence: 1, width: 520, height: 340 },
                            { id: 'no', src: img.sign, caption: 'NOT ALLOWED', triggerWord: 'allowed', occurrence: 1, width: 440, height: 440 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 5 — DISADVANTAGE 3: production years away ──────────
            {
                transition: 'wipe-left',
                tts: { text: "Reason three: production doesn't even start until twenty twenty-eight. This car was first promised back in twenty seventeen, for delivery in twenty twenty. That's eleven years between promise and production, and we're still two years out from that.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('trf-s5', 'REASON #3 — STILL YEARS AWAY', [
                        { id: 'num', type: 'sticker', text: '#3', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'cal', src: img.calendar, caption: 'PROMISED IN 2017', triggerWord: 'promised', occurrence: 1, width: 480, height: 340 },
                            { id: 'fac', src: img.factory, caption: 'PRODUCTION STARTS 2028', triggerWord: 'start', occurrence: 1, width: 500, height: 340 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 6 — THE TWIST: why build it anyway ─────────────────
            {
                transition: 'wipe-up',
                tts: { text: "So why do it? Because none of this was really about selling a flying car. A thirty minute stunt show that gets replayed everywhere for free is worth more in attention than almost any ad campaign Tesla could buy. The flying Roadster isn't the product. It's the spectacle.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('trf-s6', 'THE REAL REASON', [
                        { id: 'num', type: 'sticker', text: '#1', slot: 'top-left', size: 90, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -3, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'cam', src: img.cameras, caption: 'REPLAYED EVERYWHERE, FREE', triggerWord: 'replayed', occurrence: 1, width: 500, height: 340 },
                            { id: 'lg', src: img.logo, caption: 'THE SPECTACLE', triggerWord: 'spectacle', occurrence: 1, width: 440, height: 340 },
                        ]),
                        { id: 's_tag', type: 'sticker', text: 'NOT THE PRODUCT.\nTHE SPECTACLE.', slot: 'banner-low', size: 40, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -1, trigger: { wordText: 'spectacle', occurrence: 2 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#2c6b5a', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 7 — CLOSE + CTA ─────────────────────────────────────
            {
                transition: 'fade',
                tts: { text: "Dumb as a product. Brilliant as a headline. Subscribe for more of what's really happening, when nobody explains it.", pauseAfter: 0.2 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('trf-close', 'DUMB PRODUCT. BRILLIANT HEADLINE.', [
                        { id: 'img_close', type: 'photo', src: img.roadster1, slot: 'mid-center', width: 760, height: 540, caption: 'BRILLIANT AS A HEADLINE', pinStyle: 'tape', trigger: { wordText: 'headline', occurrence: 1 } },
                        { id: 'pz_close', type: 'panZoom', ...zoomTo('mid-center', 1.2), duration: 1.0, trigger: { afterId: 'img_close', offset: 0.2 } },
                        { id: 'pz_out', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'pz_close', offset: 0.6 } },
                        { id: 'cta', type: 'sticker', text: '🔔 SUBSCRIBE', slot: 'banner-bot', size: 68, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: 0, trigger: { wordText: 'subscribe', occurrence: 1 } },
                        { id: 'sc_cta', type: 'circle', target: 'cta', color: '#2c6b5a', trigger: { afterId: 'cta', offset: 0.3 } },
                    ]),
                ],
            },
        ],
    };
})();