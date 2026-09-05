// config.top3-weakest-militaries.js — v2
// Same script/facts as v1. Two real fixes this time:
//
// 1. IMAGE FETCHING NOW MIRRORS src/image-api.js EXACTLY — same 5-provider
//    chain in the same order (serpapi -> unsplash -> pexels -> pixabay ->
//    picsum), same SerpAPI cache-and-walk-forward-through-100-results
//    dead-link resilience (trySerpApiWithFallback), same download
//    validation (rejects HTML error pages, rejects sub-1KB files, follows
//    redirects). v1's fetchImage had NONE of this — one shot at one
//    SerpAPI result, no fallback to another provider, no walk-forward —
//    that's exactly why images were showing as broken "X" placeholders.
//    Also switched from Promise.all (concurrent) to a sequential for-loop,
//    matching how resolveStockImages actually processes tasks — hammering
//    SerpAPI with everything at once was almost certainly contributing to
//    both the slowness and the failures.
//
// 2. MORE VISUALS FOR NOUNS ALREADY IN THE SCRIPT. "schools", "hospitals",
//    "tanks", "fighter jets", "navy", "NATO", "neighbors", "treaties", and
//    "geography" were all already being spoken in v1's narration but never
//    illustrated. 10 new images added, all preferring Pexels (source:
//    'pexels' passed as `preferred`, per its more generous rate limit) —
//    SerpAPI stays reserved for the country-specific/analogy photos where
//    accuracy matters more than for a generic "hospital" or "world map".
//
// RUN: VIDEO_CONFIG=config.top3-weakest-militaries.js node engine-ci.js

const https  = require('https');
const http   = require('http');
const crypto = require('crypto');

// ── API keys — same env vars as the real engine ─────────────────────────
const SERPAPI_KEY  = process.env.SERPAPI_API_KEY     || null;
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || null;
const PEXELS_KEY   = process.env.PEXELS_API_KEY      || null;
const PIXABAY_KEY  = process.env.PIXABAY_API_KEY     || null;

const serpApiResultsCache = new Map();

// ── Source priority — exact copy of image-api.js's getSourceChain ───────
function getSourceChain(preferred) {
    const chain = [];
    if (preferred) chain.push(preferred);
    if (!chain.includes('serpapi')  && SERPAPI_KEY)   chain.push('serpapi');
    if (!chain.includes('unsplash') && UNSPLASH_KEY)  chain.push('unsplash');
    if (!chain.includes('pexels')   && PEXELS_KEY)    chain.push('pexels');
    if (!chain.includes('pixabay')  && PIXABAY_KEY)   chain.push('pixabay');
    if (!chain.includes('picsum'))                     chain.push('picsum');
    return chain;
}

function fetchJSON(url, headers = {}) {
    return new Promise((resolve, reject) => {
        const lib  = url.startsWith('https') ? https : http;
        const opts = { headers: { 'User-Agent': 'APEX-Engine/2.0', ...headers }, timeout: 10000 };
        lib.get(url, opts, res => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
                const nextUrl = new URL(res.headers.location, url).toString();
                return fetchJSON(nextUrl, headers).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('JSON parse error')); } });
        }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
    });
}

// downloadToBase64 — same validation as image-api.js's downloadFile
// (redirect-follow, HTML-page rejection, sub-1KB rejection), returns a
// base64 buffer instead of writing to disk, since the casing needs a
// data URI.
function downloadToBase64(fileUrl, headers = {}) {
    return new Promise((resolve, reject) => {
        const opts = { headers: { 'User-Agent': 'APEX-Engine/2.0', ...headers }, timeout: 30000 };
        const makeReq = (url) => {
            const proto = url.startsWith('https') ? https : http;
            proto.get(url, opts, res => {
                if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
                    res.resume();
                    const nextUrl = new URL(res.headers.location, url).toString();
                    return makeReq(nextUrl);
                }
                if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
                const ct = res.headers['content-type'] || '';
                if (ct.includes('text/html')) { res.resume(); return reject(new Error('Server returned HTML instead of image')); }
                const chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => {
                    const buf = Buffer.concat(chunks);
                    if (buf.length < 1024) return reject(new Error(`File too small (${buf.length}B) — likely error response`));
                    resolve({ base64: buf.toString('base64'), contentType: ct.split(';')[0] || 'image/jpeg' });
                });
            }).on('error', reject).on('timeout', () => reject(new Error('Download timeout')));
        };
        makeReq(fileUrl);
    });
}

// ── Per-provider search — exact copies of image-api.js's implementations ──
async function searchSerpApi(query, orientation, imageIndex = 0) {
    if (!SERPAPI_KEY) throw new Error('SERPAPI_API_KEY secret not set');
    const cacheKey = `${query.toLowerCase().trim()}::${orientation}`;
    let results = serpApiResultsCache.get(cacheKey);
    if (!results) {
        const url = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&ijn=0&num=100&safe=active&api_key=${SERPAPI_KEY}`;
        const data = await fetchJSON(url, { Authorization: `Bearer ${SERPAPI_KEY}` });
        results = data?.images_results || [];
        if (!results.length) throw new Error('No image results from SerpAPI');
        const usable = results.filter(r => r.original && !r.original.startsWith('x-raw-image'));
        serpApiResultsCache.set(cacheKey, usable.length ? usable : results);
        results = serpApiResultsCache.get(cacheKey);
        console.log(`[Weakest] SerpAPI cached: ${results.length} result(s) for "${query.slice(0, 40)}"`);
    }
    const safeIndex = results.length ? imageIndex % results.length : 0;
    const pick = results[safeIndex] || results[0];
    if (!pick?.original) throw new Error('No usable image URL in SerpAPI results');
    return pick.original;
}

async function searchUnsplash(query, orientation) {
    if (!UNSPLASH_KEY) throw new Error('No UNSPLASH_ACCESS_KEY');
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=${orientation}&content_filter=high&client_id=${UNSPLASH_KEY}`;
    const data = await fetchJSON(url);
    return data?.urls?.regular || data?.urls?.full || null;
}

async function searchPexels(query, orientation) {
    if (!PEXELS_KEY) throw new Error('No PEXELS_API_KEY');
    const orMap = { portrait: 'portrait', landscape: 'landscape', squarish: 'square' };
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=${orMap[orientation] || 'portrait'}&per_page=5&page=1`;
    const data = await fetchJSON(url, { Authorization: PEXELS_KEY });
    const photos = data?.photos;
    if (!photos?.length) return null;
    const photo = photos[Math.floor(Math.random() * photos.length)];
    return photo?.src?.large2x || photo?.src?.large || null;
}

async function searchPixabay(query, orientation) {
    if (!PIXABAY_KEY) throw new Error('No PIXABAY_API_KEY');
    const orMap = { portrait: 'vertical', landscape: 'horizontal', squarish: 'square' };
    const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=${orMap[orientation] || 'vertical'}&safesearch=true&per_page=5&min_width=1080`;
    const data = await fetchJSON(url);
    const hits = data?.hits;
    if (!hits?.length) return null;
    const hit = hits[Math.floor(Math.random() * hits.length)];
    return hit?.largeImageURL || hit?.webformatURL || null;
}

async function getPicsum(orientation) {
    const w = orientation === 'landscape' ? 1920 : 1080;
    const h = orientation === 'landscape' ? 1080 : 1920;
    const seed = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/${seed}/${w}/${h}`;
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

// ── SerpAPI dead-link resilience — exact mirror of trySerpApiWithFallback ──
async function trySerpApiWithFallback(query, orientation, startIndex) {
    const firstUrl = await searchSerpApi(query, orientation, startIndex);
    const cacheKey = `${query.toLowerCase().trim()}::${orientation}`;
    const results  = serpApiResultsCache.get(cacheKey) || [];
    const total    = results.length || 1;
    let lastErr = null;

    for (let attempt = 0; attempt < total; attempt++) {
        const idx = (startIndex + attempt) % total;
        const pick = results[idx];
        const candidateUrl = attempt === 0 ? firstUrl : pick?.original;
        if (!candidateUrl) continue;
        try {
            if (attempt > 0) console.log(`[Weakest]  ↻ serpapi retry [#${idx}] for "${query.slice(0, 40)}"`);
            const { base64, contentType } = await downloadToBase64(candidateUrl);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            lastErr = e;
            console.warn(`[Weakest]  ⚠ serpapi [#${idx}] failed: ${e.message?.slice(0, 60)}`);
        }
    }
    throw lastErr || new Error('No working result found across entire cached set');
}

// ── Top-level fetch, mirroring resolveStockLayer's chain-walk exactly ────
// Returns a base64 data URI. Realistically never returns null, since
// picsum (last in the chain, no key required) always resolves — same
// guarantee the real engine relies on.
async function fetchImageRobust(query, opts = {}) {
    const preferred   = opts.source || null;
    const orientation = opts.orientation || 'portrait';
    const imageIndex  = opts.imageIndex || 0;
    const chain = getSourceChain(preferred);

    for (const source of chain) {
        if (source === 'serpapi') {
            try {
                const dataUri = await trySerpApiWithFallback(query, orientation, imageIndex);
                console.log(`[Weakest] ✓ "${query}" via serpapi`);
                return dataUri;
            } catch (e) {
                console.warn(`[Weakest]  ⚠ serpapi exhausted for "${query}": ${e.message?.slice(0, 60)}`);
            }
            continue;
        }
        try {
            const imageUrl = await searchSource(source, query, orientation, imageIndex);
            if (!imageUrl) continue;
            const { base64, contentType } = await downloadToBase64(imageUrl);
            console.log(`[Weakest] ✓ "${query}" via ${source}`);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            console.warn(`[Weakest]  ⚠ ${source} failed for "${query}": ${e.message?.slice(0, 60)}`);
        }
    }
    console.warn(`[Weakest]  ✗ ALL sources failed for "${query}" — this should be extremely rare (picsum has no key requirement)`);
    return null;
}

// ── panZoom camera helper — mirrors the casing's own slotToXY math ─────────
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

module.exports = (async () => {

    console.log('[Weakest] Fetching images sequentially (same order the real engine processes tasks in)...');

    // Sequential, not Promise.all — matches resolveStockImages' own
    // for-loop, and gives each request time to complete before the next
    // one fires instead of hammering every provider at once.
    const queries = [
        // country + analogy photos — SerpAPI preferred (accuracy matters more)
        ['Costa Rica San Jose city', { source: 'serpapi' }],
        ['Liechtenstein Vaduz castle', { source: 'serpapi' }],
        ['Iceland Reykjavik landscape', { source: 'serpapi' }],
        ['SWAT team tactical officers', { source: 'serpapi' }],
        ['Costa Rica police public force', { source: 'serpapi' }],
        ['motorcycle club group riders', { source: 'serpapi' }],
        ['coast guard patrol boat', { source: 'serpapi' }],
        ['European police officers small town', { source: 'serpapi' }],
        ['private security team armed', { source: 'serpapi' }],
        // generic nouns already spoken but never illustrated — Pexels
        // preferred, per its more generous rate limit for simple subjects
        ['school classroom', { source: 'pexels' }],
        ['hospital building', { source: 'pexels' }],
        ['military tank', { source: 'pexels' }],
        ['fighter jet', { source: 'pexels' }],
        ['navy warship', { source: 'pexels' }],
        ['small aircraft airplane', { source: 'pexels' }],
        ['soldiers NATO uniform', { source: 'pexels' }],
        ['countries map borders', { source: 'pexels' }],
        ['signing document treaty', { source: 'pexels' }],
        ['world map geography', { source: 'pexels' }],
    ];

    const results = {};
    for (const [query, opts] of queries) {
        results[query] = await fetchImageRobust(query, opts);
    }

    const imgCostaRica          = results['Costa Rica San Jose city'];
    const imgLiechtenstein      = results['Liechtenstein Vaduz castle'];
    const imgIceland            = results['Iceland Reykjavik landscape'];
    const imgSwatGeneric        = results['SWAT team tactical officers'];
    const imgCostaRicaForce     = results['Costa Rica police public force'];
    const imgMotorcycleClub     = results['motorcycle club group riders'];
    const imgIcelandCoastGuard  = results['coast guard patrol boat'];
    const imgLiechtensteinPolice = results['European police officers small town'];
    const imgPrivateSecurity    = results['private security team armed'];
    const imgSchool             = results['school classroom'];
    const imgHospital           = results['hospital building'];
    const imgTank               = results['military tank'];
    const imgFighterJet         = results['fighter jet'];
    const imgNavyShip           = results['navy warship'];
    const imgSmallAircraft      = results['small aircraft airplane'];
    const imgNato               = results['soldiers NATO uniform'];
    const imgNeighbors          = results['countries map borders'];
    const imgTreaty             = results['signing document treaty'];
    const imgWorldMap           = results['world map geography'];

    console.log('[Weakest] All images resolved. Building config...');

    const commonTheme = {
        paper: '#e8dfcd', ink: '#1a1a1a',
        accent: '#a93226', accent2: '#1a5276',
        shadow: 'rgba(20,16,10,0.38)',
    };

    return {
        output: { title: 'top3-weakest-militaries', format: 'portrait', fps: 30, crf: 23, preset: 'medium' },
        defaults: { voice: 'am_adam', transition: 'fade', transitionDuration: 0.35 },

        scenes: [

            // ── Scene 0 — HOOK ────────────────────────────────────────────
            {
                tts: {
                    text: "What if I told you a single armed group could realistically take over an entire country's military, in an afternoon? Here are the top three weakest militaries on Earth — and yes, one of them has been unarmed since the eighteen sixties.",
                    voice: 'am_adam', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record', src: './ApexCasing/paper-sticker-explainer.html?tag=weak-hook',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
                        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'THE WEAKEST MILITARIES', theme: commonTheme,
                            commands: [
                                { id: 'hook1', type: 'sticker', text: 'A GANG COULD\nOVERPOWER THIS?', slot: 'banner-top', size: 62, color: '#1a1a1a', stroke: '#ffffff', rotate: -1, trigger: { atSeconds: 0.1 } },
                                { id: 'img_cr', type: 'photo', src: imgCostaRica, slot: 'mid-left', width: 320, height: 220, caption: 'COSTA RICA', pinStyle: 'tape', trigger: { wordText: 'group', occurrence: 1 } },
                                { id: 'pz1', type: 'panZoom', ...zoomTo('mid-left', 1.5), duration: 0.9, trigger: { afterId: 'img_cr', offset: 0.15 } },
                                { id: 'img_li', type: 'photo', src: imgLiechtenstein, slot: 'mid-center', width: 320, height: 220, caption: 'LIECHTENSTEIN', pinStyle: 'tape', trigger: { wordText: 'realistically', occurrence: 1 } },
                                { id: 'pz2', type: 'panZoom', ...zoomTo('mid-center', 1.5), duration: 0.9, trigger: { afterId: 'img_li', offset: 0.15 } },
                                { id: 'img_ic', type: 'photo', src: imgIceland, slot: 'mid-right', width: 320, height: 220, caption: 'ICELAND', pinStyle: 'tape', trigger: { wordText: 'afternoon', occurrence: 1 } },
                                { id: 'pz3', type: 'panZoom', ...zoomTo('mid-right', 1.5), duration: 0.9, trigger: { afterId: 'img_ic', offset: 0.15 } },
                                { id: 'pz_out0', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'img_ic', offset: 0.5 } },
                                { id: 'hook2', type: 'sticker', text: 'TOP 3 COUNTDOWN', slot: 'banner-bot', size: 68, color: '#ffffff', stroke: '#a93226', bg: '#a93226', rotate: 1, trigger: { wordText: 'top', occurrence: 1 } },
                                { id: 'sc_hook', type: 'circle', target: 'hook2', color: '#a93226', trigger: { afterId: 'hook2', offset: 0.3 } },
                                { id: 'str1', type: 'string', from: { target: 'img_cr' }, to: { target: 'img_li' }, color: '#a93226', sag: 30, trigger: { afterId: 'img_li', offset: 0.3 } },
                                { id: 'str2', type: 'string', from: { target: 'img_li' }, to: { target: 'img_ic' }, color: '#a93226', sag: 30, trigger: { afterId: 'img_ic', offset: 0.3 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 1 — #3: Costa Rica (now with schools/hospitals/tanks/jets/navy) ──
            {
                tts: {
                    text: "Number three: Costa Rica. In 1948, the country abolished its military entirely, and redirected that money into schools and hospitals instead. Today its only armed force is a roughly eight thousand person Public Force, essentially a national police department. No tanks. No fighter jets. No navy. A well-organized armed group with rifles and pickup trucks would already outgun most of what's left.",
                    voice: 'am_adam', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record', src: './ApexCasing/paper-sticker-explainer.html?tag=weak-s1',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
                        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#3 — COSTA RICA', theme: commonTheme,
                            commands: [
                                { id: 'num1', type: 'sticker', text: '#3', slot: 'top-left', size: 90, color: '#ffffff', stroke: '#1a5276', bg: '#1a5276', rotate: -3, trigger: { atSeconds: 0.1 } },
                                { id: 'photo1', type: 'photo', src: imgCostaRica, slot: 'top-center', width: 580, height: 340, rotate: -2, pinStyle: 'tape', caption: 'COSTA RICA', trigger: { wordText: '1948', occurrence: 1 } },
                                { id: 'pz_p1', type: 'panZoom', ...zoomTo('top-center', 1.4), duration: 1.0, trigger: { afterId: 'photo1', offset: 0.15 } },
                                { id: 'img_school', type: 'photo', src: imgSchool, slot: 'mid-left', width: 300, height: 210, caption: 'SCHOOLS', pinStyle: 'tape', trigger: { wordText: 'schools', occurrence: 1 } },
                                { id: 'pz_school', type: 'panZoom', ...zoomTo('mid-left', 1.6), duration: 0.9, trigger: { afterId: 'img_school', offset: 0.15 } },
                                { id: 'img_hospital', type: 'photo', src: imgHospital, slot: 'mid-right', width: 300, height: 210, caption: 'HOSPITALS', pinStyle: 'tape', trigger: { wordText: 'hospitals', occurrence: 1 } },
                                { id: 'pz_hospital', type: 'panZoom', ...zoomTo('mid-right', 1.6), duration: 0.9, trigger: { afterId: 'img_hospital', offset: 0.15 } },
                                { id: 'pz_out1a', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'img_hospital', offset: 0.4 } },
                                { id: 'img_force', type: 'photo', src: imgCostaRicaForce, slot: 'low-left', width: 280, height: 200, caption: '~8,500 PUBLIC FORCE', pinStyle: 'tape', trigger: { wordText: 'thousand', occurrence: 1 } },
                                { id: 'pz_force', type: 'panZoom', ...zoomTo('low-left', 1.6), duration: 0.9, trigger: { afterId: 'img_force', offset: 0.15 } },
                                { id: 'img_tank', type: 'photo', src: imgTank, slot: 'low-center', width: 260, height: 190, caption: 'NO TANKS', pinStyle: 'pins', trigger: { wordText: 'tanks', occurrence: 1 } },
                                { id: 'pz_tank', type: 'panZoom', ...zoomTo('low-center', 1.7), duration: 0.9, trigger: { afterId: 'img_tank', offset: 0.15 } },
                                { id: 'img_jet', type: 'photo', src: imgFighterJet, slot: 'low-right', width: 260, height: 190, caption: 'NO FIGHTER JETS', pinStyle: 'pins', trigger: { wordText: 'jets', occurrence: 1 } },
                                { id: 'pz_jet', type: 'panZoom', ...zoomTo('low-right', 1.7), duration: 0.9, trigger: { afterId: 'img_jet', offset: 0.15 } },
                                { id: 'img_navy', type: 'photo', src: imgNavyShip, slot: 'deep-center', width: 300, height: 200, caption: 'NO NAVY', pinStyle: 'pins', trigger: { wordText: 'navy', occurrence: 1 } },
                                { id: 'pz_navy', type: 'panZoom', ...zoomTo('deep-center', 1.6), duration: 0.9, trigger: { afterId: 'img_navy', offset: 0.15 } },
                                { id: 'pz_out1b', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'img_navy', offset: 0.5 } },
                                { id: 'arr1', type: 'arrow', x1: 300, y1: 1100, x2: 780, y2: 1100, color: '#a93226', curve: 30, trigger: { afterId: 'pz_out1b', offset: 0.1 } },
                                { id: 'img_mc', type: 'photo', src: imgMotorcycleClub, slot: 'banner-low', width: 500, height: 280, caption: 'ORGANIZED GROUP WITH RIFLES + TRUCKS', pinStyle: 'pins', trigger: { wordText: 'trucks', occurrence: 1 } },
                                { id: 'pz_mc', type: 'panZoom', ...zoomTo('banner-low', 1.4), duration: 1.0, trigger: { afterId: 'img_mc', offset: 0.15 } },
                                { id: 'sc1', type: 'circle', target: 'img_mc', color: '#a93226', trigger: { afterId: 'pz_mc', offset: 0.3 } },
                                { id: 'pz_out1c', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'sc1', offset: 0.4 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 2 — #2: Iceland (now with small aircraft + NATO photo) ──
            {
                tts: {
                    text: "Number two: Iceland. It has never had a standing army in its entire history. Its only armed personnel are a small coast guard, fewer than three hundred people, patrolling with a handful of vessels and a couple of aircraft. Iceland's actual defense depends almost entirely on NATO allies showing up if anything ever went wrong.",
                    voice: 'am_adam', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record', src: './ApexCasing/paper-sticker-explainer.html?tag=weak-s2',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
                        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#2 — ICELAND', theme: commonTheme,
                            commands: [
                                { id: 'num2', type: 'sticker', text: '#2', slot: 'top-left', size: 90, color: '#ffffff', stroke: '#1a5276', bg: '#1a5276', rotate: -3, trigger: { atSeconds: 0.1 } },
                                { id: 'photo2', type: 'photo', src: imgIceland, slot: 'top-center', width: 580, height: 340, rotate: 2, pinStyle: 'tape', caption: 'ICELAND', trigger: { wordText: 'history', occurrence: 1 } },
                                { id: 'pz_p2', type: 'panZoom', ...zoomTo('top-center', 1.4), duration: 1.0, trigger: { afterId: 'photo2', offset: 0.15 } },
                                { id: 'img_cg', type: 'photo', src: imgIcelandCoastGuard, slot: 'mid-left', width: 300, height: 210, caption: '< 300 COAST GUARD', pinStyle: 'tape', trigger: { wordText: 'hundred', occurrence: 1 } },
                                { id: 'pz_cg', type: 'panZoom', ...zoomTo('mid-left', 1.6), duration: 0.9, trigger: { afterId: 'img_cg', offset: 0.15 } },
                                { id: 'img_aircraft', type: 'photo', src: imgSmallAircraft, slot: 'mid-right', width: 300, height: 210, caption: 'A COUPLE OF AIRCRAFT', pinStyle: 'tape', trigger: { wordText: 'aircraft', occurrence: 1 } },
                                { id: 'pz_aircraft', type: 'panZoom', ...zoomTo('mid-right', 1.6), duration: 0.9, trigger: { afterId: 'img_aircraft', offset: 0.15 } },
                                { id: 'pz_out2a', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'img_aircraft', offset: 0.4 } },
                                { id: 'img_nato', type: 'photo', src: imgNato, slot: 'low-left', width: 300, height: 210, caption: 'NATO ALLIES', pinStyle: 'tape', trigger: { wordText: 'nato', occurrence: 1 } },
                                { id: 'pz_nato', type: 'panZoom', ...zoomTo('low-left', 1.6), duration: 0.9, trigger: { afterId: 'img_nato', offset: 0.15 } },
                                { id: 's5', type: 'sticker', text: 'DEFENSE =\nOTHER PEOPLE\'S ARMIES', slot: 'low-right', size: 34, color: '#1a1a1a', stroke: '#ffffff', rotate: -2, trigger: { afterId: 'img_nato', offset: 0.2 } },
                                { id: 'pz_s5', type: 'panZoom', ...zoomTo('low-right', 1.5), duration: 0.9, trigger: { afterId: 's5', offset: 0.15 } },
                                { id: 'pz_out2b', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 's5', offset: 0.5 } },
                                { id: 'img_swat', type: 'photo', src: imgSwatGeneric, slot: 'banner-low', width: 500, height: 280, caption: 'A SINGLE TACTICAL TEAM OUTNUMBERS THE NAVY', pinStyle: 'pins', trigger: { wordText: 'wrong', occurrence: 1 } },
                                { id: 'pz_swat', type: 'panZoom', ...zoomTo('banner-low', 1.4), duration: 1.0, trigger: { afterId: 'img_swat', offset: 0.15 } },
                                { id: 'sc2', type: 'circle', target: 'img_swat', color: '#a93226', trigger: { afterId: 'pz_swat', offset: 0.3 } },
                                { id: 'pz_out2c', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'sc2', offset: 0.4 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 3 — #1: Liechtenstein ───────────────────────────────
            {
                tts: {
                    text: "And number one: Liechtenstein. In 1868, it did something no other country has done quite so completely — it disbanded its entire army, and never rebuilt one. Today its only armed personnel are roughly ninety police officers, for the whole nation. A single well-organized armed group could realistically walk in completely unopposed.",
                    voice: 'am_adam', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record', src: './ApexCasing/paper-sticker-explainer.html?tag=weak-s3',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
                        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#1 — LIECHTENSTEIN', theme: commonTheme,
                            commands: [
                                { id: 'num3', type: 'sticker', text: '#1', slot: 'top-left', size: 90, color: '#ffffff', stroke: '#a93226', bg: '#a93226', rotate: -3, trigger: { atSeconds: 0.1 } },
                                { id: 'photo3', type: 'photo', src: imgLiechtenstein, slot: 'top-center', width: 600, height: 360, rotate: -3, pinStyle: 'tape', caption: 'LIECHTENSTEIN', trigger: { wordText: '1868', occurrence: 1 } },
                                { id: 'pz_p3', type: 'panZoom', ...zoomTo('top-center', 1.4), duration: 1.0, trigger: { afterId: 'photo3', offset: 0.15 } },
                                { id: 's7', type: 'sticker', text: 'DISBANDED ITS\nARMY. FOR GOOD.', slot: 'mid-left', size: 44, color: '#ffffff', stroke: '#a93226', bg: '#a93226', rotate: 2, trigger: { wordText: 'disbanded', occurrence: 1 } },
                                { id: 'pz_s7', type: 'panZoom', ...zoomTo('mid-left', 1.5), duration: 0.9, trigger: { afterId: 's7', offset: 0.15 } },
                                { id: 'img_pol', type: 'photo', src: imgLiechtensteinPolice, slot: 'mid-right', width: 300, height: 210, caption: '~90 POLICE FOR\nTHE WHOLE COUNTRY', pinStyle: 'tape', trigger: { wordText: 'ninety', occurrence: 1 } },
                                { id: 'pz_pol', type: 'panZoom', ...zoomTo('mid-right', 1.6), duration: 0.9, trigger: { afterId: 'img_pol', offset: 0.15 } },
                                { id: 'pz_out3', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'img_pol', offset: 0.6 } },
                                { id: 'img_sec', type: 'photo', src: imgPrivateSecurity, slot: 'banner-low', width: 500, height: 280, caption: 'ONE ORGANIZED GROUP. UNOPPOSED.', pinStyle: 'pins', trigger: { wordText: 'unopposed', occurrence: 1 } },
                                { id: 'pz_sec', type: 'panZoom', ...zoomTo('banner-low', 1.4), duration: 1.0, trigger: { afterId: 'img_sec', offset: 0.15 } },
                                { id: 'sc3', type: 'circle', target: 'img_sec', color: '#a93226', trigger: { afterId: 'pz_sec', offset: 0.3 } },
                                { id: 'pz_out3b', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'sc3', offset: 0.4 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 4 — CLOSING (now with neighbors/treaty/map photos) ──
            {
                tts: {
                    text: "None of this means these countries are unsafe. Most of them rely on neighbors, treaties, or simple geography instead of guns. But it does mean the next time someone says no country could ever be invaded, remember — some countries couldn't even stop a determined, organized group. Subscribe for more facts nobody tells you.",
                    voice: 'am_adam', pauseAfter: 0.3,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record', src: './ApexCasing/paper-sticker-explainer.html?tag=weak-cta',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
                        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'THE REAL PICTURE', theme: commonTheme,
                            commands: [
                                { id: 'note1', type: 'sticker', text: 'NOT UNSAFE.\nJUST UNARMED.', slot: 'banner-top', size: 56, color: '#1a1a1a', stroke: '#ffffff', trigger: { atSeconds: 0.1 } },
                                { id: 'img_neighbors', type: 'photo', src: imgNeighbors, slot: 'mid-left', width: 300, height: 210, caption: 'NEIGHBORS', pinStyle: 'tape', trigger: { wordText: 'neighbors', occurrence: 1 } },
                                { id: 'pz_neigh', type: 'panZoom', ...zoomTo('mid-left', 1.6), duration: 0.9, trigger: { afterId: 'img_neighbors', offset: 0.15 } },
                                { id: 'img_treaty', type: 'photo', src: imgTreaty, slot: 'mid-center', width: 300, height: 210, caption: 'TREATIES', pinStyle: 'tape', trigger: { wordText: 'treaties', occurrence: 1 } },
                                { id: 'pz_treaty', type: 'panZoom', ...zoomTo('mid-center', 1.6), duration: 0.9, trigger: { afterId: 'img_treaty', offset: 0.15 } },
                                { id: 'img_geo', type: 'photo', src: imgWorldMap, slot: 'mid-right', width: 300, height: 210, caption: 'GEOGRAPHY', pinStyle: 'tape', trigger: { wordText: 'geography', occurrence: 1 } },
                                { id: 'pz_geo', type: 'panZoom', ...zoomTo('mid-right', 1.6), duration: 0.9, trigger: { afterId: 'img_geo', offset: 0.15 } },
                                { id: 'pz_out_notes', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'img_geo', offset: 0.5 } },
                                { id: 'cta1', type: 'sticker', text: '🔔 SUBSCRIBE\nFOR MORE', slot: 'banner-bot', size: 78, color: '#ffffff', stroke: '#1a5276', bg: '#1a5276', rotate: 0, trigger: { wordText: 'subscribe', occurrence: 1 } },
                                { id: 'sc_cta', type: 'circle', target: 'cta1', color: '#1a5276', trigger: { afterId: 'cta1', offset: 0.3 } },
                                { id: 'pz_out_final', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'sc_cta', offset: 0.4 } },
                            ],
                        },
                    },
                ],
            },
        ],
    };
})();