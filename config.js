// config.how-to-be-successful.js
// "5 Things Successful People Do Differently"
// Same robust image-fetch scaffold as the weakest-militaries reference
// (sequential fetching, exact 5-provider fallback chain, SerpAPI dead-link
// resilience) — reused verbatim since it's proven working code.
//
// FIX vs the reference: photo dimensions bumped significantly larger.
// Reference used 260-320px slot photos, 500x280 banner photos — genuinely
// too small on a 1080-wide canvas. This version: 440-560px slot photos,
// 620-680 x 400-440 banner photos.
//
// RUN: VIDEO_CONFIG=config.how-to-be-successful.js node engine-ci.js

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
        console.log(`[Success] SerpAPI cached: ${results.length} result(s) for "${query.slice(0, 40)}"`);
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
            if (attempt > 0) console.log(`[Success]  ↻ serpapi retry [#${idx}] for "${query.slice(0, 40)}"`);
            const { base64, contentType } = await downloadToBase64(candidateUrl);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            lastErr = e;
            console.warn(`[Success]  ⚠ serpapi [#${idx}] failed: ${e.message?.slice(0, 60)}`);
        }
    }
    throw lastErr || new Error('No working result found across entire cached set');
}

async function fetchImageRobust(query, opts = {}) {
    const preferred   = opts.source || null;
    const orientation = opts.orientation || 'portrait';
    const imageIndex  = opts.imageIndex || 0;
    const chain = getSourceChain(preferred);

    for (const source of chain) {
        if (source === 'serpapi') {
            try {
                const dataUri = await trySerpApiWithFallback(query, orientation, imageIndex);
                console.log(`[Success] ✓ "${query}" via serpapi`);
                return dataUri;
            } catch (e) {
                console.warn(`[Success]  ⚠ serpapi exhausted for "${query}": ${e.message?.slice(0, 60)}`);
            }
            continue;
        }
        try {
            const imageUrl = await searchSource(source, query, orientation, imageIndex);
            if (!imageUrl) continue;
            const { base64, contentType } = await downloadToBase64(imageUrl);
            console.log(`[Success] ✓ "${query}" via ${source}`);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            console.warn(`[Success]  ⚠ ${source} failed for "${query}": ${e.message?.slice(0, 60)}`);
        }
    }
    console.warn(`[Success]  ✗ ALL sources failed for "${query}" — extremely rare (picsum has no key requirement)`);
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

    console.log('[Success] Fetching images sequentially...');

    const queries = [
        ['person reaching mountain summit', { source: 'serpapi' }],
        ['city skyline sunrise ambition', { source: 'serpapi' }],
        ['person waking up sunrise window', { source: 'pexels' }],
        ['morning routine journal coffee', { source: 'pexels' }],
        ['person reading book focused', { source: 'pexels' }],
        ['home library bookshelf', { source: 'pexels' }],
        ['piggy bank savings coins', { source: 'pexels' }],
        ['stock market growth chart', { source: 'pexels' }],
        ['mentor mentee conversation office', { source: 'pexels' }],
        ['business people networking handshake', { source: 'pexels' }],
        ['person climbing rock determination', { source: 'pexels' }],
        ['comeback success celebration', { source: 'pexels' }],
        ['confident person city success', { source: 'serpapi' }],
    ];

    const results = {};
    for (const [query, opts] of queries) {
        results[query] = await fetchImageRobust(query, opts);
    }

    const imgSummit          = results['person reaching mountain summit'];
    const imgSkyline         = results['city skyline sunrise ambition'];
    const imgWakingUp        = results['person waking up sunrise window'];
    const imgMorningRoutine  = results['morning routine journal coffee'];
    const imgReading         = results['person reading book focused'];
    const imgLibrary         = results['home library bookshelf'];
    const imgPiggyBank       = results['piggy bank savings coins'];
    const imgStockChart      = results['stock market growth chart'];
    const imgMentor          = results['mentor mentee conversation office'];
    const imgNetworking      = results['business people networking handshake'];
    const imgClimbing        = results['person climbing rock determination'];
    const imgCelebration     = results['comeback success celebration'];
    const imgConfident       = results['confident person city success'];

    console.log('[Success] All images resolved. Building config...');

    const commonTheme = {
        paper: '#f3ecd8', ink: '#1a1a1a',
        accent: '#c9a227', accent2: '#1a7a4c',
        shadow: 'rgba(20,16,10,0.38)',
    };

    return {
        output: { title: 'how-to-be-successful-in-life', format: 'portrait', fps: 30, crf: 23, preset: 'medium' },
        defaults: { voice: 'am_eric', transition: 'fade', transitionDuration: 0.35 },

        scenes: [

            // ── Scene 0 — HOOK ────────────────────────────────────────────
            {
                tts: {
                    text: "What if success isn't about talent at all? Research on high achievers keeps pointing to the same five habits — not luck, not genius, just five things they do differently, every single day.",
                    voice: 'am_eric', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#f3ecd8' },
                    {
                        type: 'html-record', src: './ApexCasing/paper-sticker-explainer.html?tag=success-hook',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
                        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '5 HABITS OF SUCCESSFUL PEOPLE', theme: commonTheme,
                            commands: [
                                { id: 'hook1', type: 'sticker', text: 'NOT TALENT.\nNOT LUCK.', slot: 'banner-top', size: 64, color: '#1a1a1a', stroke: '#ffffff', rotate: -1, trigger: { atSeconds: 0.1 } },
                                { id: 'img_summit', type: 'photo', src: imgSummit, slot: 'mid-center', width: 620, height: 460, caption: 'HIGH ACHIEVERS', pinStyle: 'tape', trigger: { wordText: 'achievers', occurrence: 1 } },
                                { id: 'pz1', type: 'panZoom', ...zoomTo('mid-center', 1.35), duration: 1.0, trigger: { afterId: 'img_summit', offset: 0.15 } },
                                { id: 'pz_out0', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'img_summit', offset: 0.7 } },
                                { id: 'hook2', type: 'sticker', text: '5 HABITS THAT\nCHANGE EVERYTHING', slot: 'banner-bot', size: 52, color: '#ffffff', stroke: '#c9a227', bg: '#c9a227', rotate: 1, trigger: { wordText: 'day', occurrence: 1 } },
                                { id: 'sc_hook', type: 'circle', target: 'hook2', color: '#c9a227', trigger: { afterId: 'hook2', offset: 0.3 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 1 — #1: Wake up early / morning routine ─────────────
            {
                tts: {
                    text: "Number one. They own the first hour of the day. Before notifications, before other people's demands, successful people protect one uninterrupted hour — for planning, thinking, or moving their body. That single hour sets the tone for everything after it.",
                    voice: 'am_eric', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#f3ecd8' },
                    {
                        type: 'html-record', src: './ApexCasing/paper-sticker-explainer.html?tag=success-s1',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
                        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#1 — OWN THE FIRST HOUR', theme: commonTheme,
                            commands: [
                                { id: 'num1', type: 'sticker', text: '#1', slot: 'top-left', size: 100, color: '#ffffff', stroke: '#1a7a4c', bg: '#1a7a4c', rotate: -3, trigger: { atSeconds: 0.1 } },
                                { id: 'photo1', type: 'photo', src: imgWakingUp, slot: 'top-center', width: 660, height: 460, rotate: -2, pinStyle: 'tape', caption: 'THE FIRST HOUR', trigger: { wordText: 'hour', occurrence: 1 } },
                                { id: 'pz_p1', type: 'panZoom', ...zoomTo('top-center', 1.35), duration: 1.0, trigger: { afterId: 'photo1', offset: 0.15 } },
                                { id: 'pz_out1a', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'photo1', offset: 0.5 } },
                                { id: 'img_routine', type: 'photo', src: imgMorningRoutine, slot: 'mid-center', width: 560, height: 420, caption: 'PLANNING. THINKING. MOVING.', pinStyle: 'pins', trigger: { wordText: 'moving', occurrence: 1 } },
                                { id: 'pz_routine', type: 'panZoom', ...zoomTo('mid-center', 1.4), duration: 1.0, trigger: { afterId: 'img_routine', offset: 0.15 } },
                                { id: 'pz_out1b', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'img_routine', offset: 0.6 } },
                                { id: 'lbl1', type: 'sticker', text: 'SETS THE TONE\nFOR EVERYTHING', slot: 'banner-low', size: 46, color: '#1a1a1a', stroke: '#c9a227', bg: '#c9a227', trigger: { wordText: 'everything', occurrence: 1 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 2 — #2: Read constantly ─────────────────────────────
            {
                tts: {
                    text: "Number two. They read like it's their job. Warren Buffett, Bill Gates, dozens of top CEOs — all report reading for an hour or more a day. Not for entertainment. To absorb decades of other people's experience in a fraction of the time it took them to live it.",
                    voice: 'am_eric', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#f3ecd8' },
                    {
                        type: 'html-record', src: './ApexCasing/paper-sticker-explainer.html?tag=success-s2',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
                        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#2 — READ LIKE IT\'S THE JOB', theme: commonTheme,
                            commands: [
                                { id: 'num2', type: 'sticker', text: '#2', slot: 'top-left', size: 100, color: '#ffffff', stroke: '#1a7a4c', bg: '#1a7a4c', rotate: -3, trigger: { atSeconds: 0.1 } },
                                { id: 'photo2', type: 'photo', src: imgReading, slot: 'top-center', width: 660, height: 460, rotate: 2, pinStyle: 'tape', caption: 'READING, DAILY', trigger: { wordText: 'day', occurrence: 1 } },
                                { id: 'pz_p2', type: 'panZoom', ...zoomTo('top-center', 1.35), duration: 1.0, trigger: { afterId: 'photo2', offset: 0.15 } },
                                { id: 'pz_out2a', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'photo2', offset: 0.5 } },
                                { id: 'img_library', type: 'photo', src: imgLibrary, slot: 'mid-center', width: 560, height: 420, caption: 'DECADES OF EXPERIENCE, COMPRESSED', pinStyle: 'pins', trigger: { wordText: 'experience', occurrence: 1 } },
                                { id: 'pz_library', type: 'panZoom', ...zoomTo('mid-center', 1.4), duration: 1.0, trigger: { afterId: 'img_library', offset: 0.15 } },
                                { id: 'pz_out2b', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'img_library', offset: 0.6 } },
                                { id: 'lbl2', type: 'sticker', text: 'A SHORTCUT TO\nSOMEONE ELSE\'S YEARS', slot: 'banner-low', size: 42, color: '#1a1a1a', stroke: '#c9a227', bg: '#c9a227', trigger: { wordText: 'live', occurrence: 1 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 3 — #3: Save & invest before spending ───────────────
            {
                tts: {
                    text: "Number three. They pay themselves first. Before rent, before anything else, a fixed percentage moves into savings or investments the moment income arrives. It's not about how much you earn — it's about what you never let yourself touch.",
                    voice: 'am_eric', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#f3ecd8' },
                    {
                        type: 'html-record', src: './ApexCasing/paper-sticker-explainer.html?tag=success-s3',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
                        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#3 — PAY YOURSELF FIRST', theme: commonTheme,
                            commands: [
                                { id: 'num3', type: 'sticker', text: '#3', slot: 'top-left', size: 100, color: '#ffffff', stroke: '#1a7a4c', bg: '#1a7a4c', rotate: -3, trigger: { atSeconds: 0.1 } },
                                { id: 'photo3', type: 'photo', src: imgPiggyBank, slot: 'top-center', width: 660, height: 460, rotate: -2, pinStyle: 'tape', caption: 'SAVE FIRST', trigger: { wordText: 'savings', occurrence: 1 } },
                                { id: 'pz_p3', type: 'panZoom', ...zoomTo('top-center', 1.35), duration: 1.0, trigger: { afterId: 'photo3', offset: 0.15 } },
                                { id: 'pz_out3a', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'photo3', offset: 0.5 } },
                                { id: 'img_chart', type: 'photo', src: imgStockChart, slot: 'mid-center', width: 560, height: 420, caption: 'WHAT YOU NEVER TOUCH, GROWS', pinStyle: 'pins', trigger: { wordText: 'touch', occurrence: 1 } },
                                { id: 'pz_chart', type: 'panZoom', ...zoomTo('mid-center', 1.4), duration: 1.0, trigger: { afterId: 'img_chart', offset: 0.15 } },
                                { id: 'pz_out3b', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'img_chart', offset: 0.6 } },
                                { id: 'lbl3', type: 'sticker', text: 'NOT HOW MUCH.\nWHAT YOU KEEP.', slot: 'banner-low', size: 46, color: '#1a1a1a', stroke: '#c9a227', bg: '#c9a227', trigger: { wordText: 'earn', occurrence: 1 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 4 — #4: Surround yourself with the right people ─────
            {
                tts: {
                    text: "Number four. They choose their circle on purpose. You become the average of the five people you spend the most time with. Successful people actively seek out mentors and peers who are ahead of them — not to feel inferior, but to have a reason to catch up.",
                    voice: 'am_eric', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#f3ecd8' },
                    {
                        type: 'html-record', src: './ApexCasing/paper-sticker-explainer.html?tag=success-s4',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
                        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#4 — CHOOSE YOUR CIRCLE', theme: commonTheme,
                            commands: [
                                { id: 'num4', type: 'sticker', text: '#4', slot: 'top-left', size: 100, color: '#ffffff', stroke: '#1a7a4c', bg: '#1a7a4c', rotate: -3, trigger: { atSeconds: 0.1 } },
                                { id: 'photo4', type: 'photo', src: imgMentor, slot: 'top-center', width: 660, height: 460, rotate: 2, pinStyle: 'tape', caption: 'MENTORS, ON PURPOSE', trigger: { wordText: 'mentors', occurrence: 1 } },
                                { id: 'pz_p4', type: 'panZoom', ...zoomTo('top-center', 1.35), duration: 1.0, trigger: { afterId: 'photo4', offset: 0.15 } },
                                { id: 'pz_out4a', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'photo4', offset: 0.5 } },
                                { id: 'img_network', type: 'photo', src: imgNetworking, slot: 'mid-center', width: 560, height: 420, caption: 'THE AVERAGE OF YOUR FIVE', pinStyle: 'pins', trigger: { wordText: 'five', occurrence: 1 } },
                                { id: 'pz_network', type: 'panZoom', ...zoomTo('mid-center', 1.4), duration: 1.0, trigger: { afterId: 'img_network', offset: 0.15 } },
                                { id: 'pz_out4b', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'img_network', offset: 0.6 } },
                                { id: 'lbl4', type: 'sticker', text: 'A REASON\nTO CATCH UP', slot: 'banner-low', size: 48, color: '#1a1a1a', stroke: '#c9a227', bg: '#c9a227', trigger: { wordText: 'catch', occurrence: 1 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 5 — #5: Treat failure as data ────────────────────────
            {
                tts: {
                    text: "And number five. They treat failure as data, not defeat. Every setback gets one honest question: what does this tell me for next time? That single shift — from 'I failed' to 'here's what I learned' — is often the actual difference between people who quit and people who don't.",
                    voice: 'am_eric', pauseAfter: 0.5,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#f3ecd8' },
                    {
                        type: 'html-record', src: './ApexCasing/paper-sticker-explainer.html?tag=success-s5',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
                        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#5 — FAILURE IS DATA', theme: commonTheme,
                            commands: [
                                { id: 'num5', type: 'sticker', text: '#5', slot: 'top-left', size: 100, color: '#ffffff', stroke: '#c9a227', bg: '#c9a227', rotate: -3, trigger: { atSeconds: 0.1 } },
                                { id: 'photo5', type: 'photo', src: imgClimbing, slot: 'top-center', width: 660, height: 460, rotate: -2, pinStyle: 'tape', caption: 'NOT DEFEAT — DATA', trigger: { wordText: 'data', occurrence: 1 } },
                                { id: 'pz_p5', type: 'panZoom', ...zoomTo('top-center', 1.35), duration: 1.0, trigger: { afterId: 'photo5', offset: 0.15 } },
                                { id: 'pz_out5a', type: 'panZoom', ...ZOOM_OUT, duration: 0.9, trigger: { afterId: 'photo5', offset: 0.5 } },
                                { id: 'img_comeback', type: 'photo', src: imgCelebration, slot: 'mid-center', width: 560, height: 420, caption: '"WHAT DID THIS TEACH ME?"', pinStyle: 'pins', trigger: { wordText: 'learned', occurrence: 1 } },
                                { id: 'pz_comeback', type: 'panZoom', ...zoomTo('mid-center', 1.4), duration: 1.0, trigger: { afterId: 'img_comeback', offset: 0.15 } },
                                { id: 'pz_out5b', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'img_comeback', offset: 0.6 } },
                                { id: 'lbl5', type: 'sticker', text: 'THE ONES WHO\nDON\'T QUIT', slot: 'banner-low', size: 48, color: '#1a1a1a', stroke: '#c9a227', bg: '#c9a227', trigger: { wordText: 'quit', occurrence: 1 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 6 — CLOSING + CTA ─────────────────────────────────────
            {
                tts: {
                    text: "None of these five things require talent. They require deciding to do them, starting today. Which one are you weakest at right now? Subscribe for more, and go work on it.",
                    voice: 'am_eric', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#f3ecd8' },
                    {
                        type: 'html-record', src: './ApexCasing/paper-sticker-explainer.html?tag=success-cta',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
                        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'START TODAY', theme: commonTheme,
                            commands: [
                                { id: 'img_confident', type: 'photo', src: imgConfident, slot: 'banner-top', width: 680, height: 440, pinStyle: 'none', trigger: { atSeconds: 0.15 } },
                                { id: 'pz_conf', type: 'panZoom', ...zoomTo('banner-top', 1.3), duration: 1.1, trigger: { afterId: 'img_confident', offset: 0.15 } },
                                { id: 'pz_out_c1', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'img_confident', offset: 0.7 } },
                                { id: 'note1', type: 'sticker', text: 'NO TALENT\nREQUIRED.', slot: 'mid-center', size: 62, color: '#1a1a1a', stroke: '#ffffff', trigger: { wordText: 'talent', occurrence: 1 } },
                                { id: 'note2', type: 'sticker', text: 'JUST A\nDECISION.', slot: 'mid-center', size: 56, color: '#ffffff', stroke: '#1a7a4c', bg: '#1a7a4c', trigger: { wordText: 'today', occurrence: 1 } },
                                { id: 'cta1', type: 'sticker', text: '🔔 SUBSCRIBE\nFOR MORE', slot: 'banner-bot', size: 78, color: '#ffffff', stroke: '#c9a227', bg: '#c9a227', rotate: 0, trigger: { wordText: 'subscribe', occurrence: 1 } },
                                { id: 'sc_cta', type: 'circle', target: 'cta1', color: '#c9a227', trigger: { afterId: 'cta1', offset: 0.3 } },
                                { id: 'pz_out_final', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'sc_cta', offset: 0.4 } },
                            ],
                        },
                    },
                ],
            },
        ],
    };
})();
