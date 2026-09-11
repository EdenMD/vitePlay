// config.zimsec-grading-explained.js
// "ZIMSEC O Level Grading Explained" — auto-generated via generate_configs.py
// Voice: bf_lily | Music: freesound search 'documentary neutral piano', mood fallback 'documentary'
// Uses ApexCasing/paper-sticker-explainer.html, exact-mirrored image-api.js fetch chain.


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
                    if (buf.length < 1024) return reject(new Error(`File too small (${buf.length}B)`));
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
            const { base64, contentType } = await downloadToBase64(candidateUrl);
            return `data:${contentType};base64,${base64}`;
        } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('No working result found');
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
                console.log(`[Fetch] \u2713 "${query}" via serpapi`);
                return dataUri;
            } catch (e) { console.warn(`[Fetch]  \u26a0 serpapi exhausted for "${query}"`); }
            continue;
        }
        try {
            const imageUrl = await searchSource(source, query, orientation, imageIndex);
            if (!imageUrl) continue;
            const { base64, contentType } = await downloadToBase64(imageUrl);
            console.log(`[Fetch] \u2713 "${query}" via ${source}`);
            return `data:${contentType};base64,${base64}`;
        } catch (e) { console.warn(`[Fetch]  \u26a0 ${source} failed for "${query}"`); }
    }
    console.warn(`[Fetch]  \u2717 ALL sources failed for "${query}"`);
    return null;
}

const SLOT_CENTERS = {
    'top-left': [180, 270.5], 'top-center': [540, 270.5], 'top-right': [900, 270.5],
    'mid-left': [180, 511.5], 'mid-center': [540, 511.5], 'mid-right': [900, 511.5],
    'low-left': [180, 752.5], 'low-center': [540, 752.5], 'low-right': [900, 752.5],
    'bot-left': [180, 993.5], 'bot-center': [540, 993.5], 'bot-right': [900, 993.5],
    'banner-top': [540, 270.5], 'banner-mid': [540, 752.5], 'banner-low': [540, 1234.5], 'banner-bot': [540, 1475.5],
};
function zoomTo(slot, scale) {
    const c = SLOT_CENTERS[slot] || [540, 960];
    return { toScale: scale, toX: -scale * (c[0] - 540), toY: -scale * (c[1] - 960) };
}
const ZOOM_OUT = { toScale: 1, toX: 0, toY: 0 };


module.exports = (async () => {
    console.log('[zimsec-grading-explained] Fetching images sequentially...');
    const results = {};
    const queries = [
        ["report card grades", { source: "pexels" }],
        ["exam hall students writing", { source: "pexels" }],
        ["certificate diploma", { source: "pexels" }],
    ];
    for (const [q, opts] of queries) { results[q] = await fetchImageRobust(q, opts); }

    const commonTheme = {"paper": "#f2ede1", "ink": "#1c1c1e", "accent": "#1a5276", "accent2": "#27ae60", "shadow": "rgba(20,16,10,0.32)"};

    return {
        output: {
            title: "zimsec-grading-explained", format: 'portrait', fps: 30, crf: 22, preset: 'medium',
            bgMusicVol: 0.1, bgMusic: { search: "documentary neutral piano", mood: "documentary" },
        },
        defaults: { voice: "bf_lily", transition: 'fade', transitionDuration: 0.35 },
        scenes: [
            {
                tts: { text: "ZIMSEC O Level grades run from A, the highest, down to U, an ungraded fail. A through C are considered strong passes for most employers and colleges. D and E are still passes, but weaker ones some programs won't accept. Grades come from your total marks across coursework and final written papers. Five subjects at grade C or better is the actual benchmark most Zimbabwean employers look for, not just five passes at any grade. See the full grade-by-grade breakdown in the blog post linked below.", voice: "bf_lily", pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: commonTheme.paper },
                    {
                        type: 'html-record', src: './ApexCasing/paper-sticker-explainer.html?tag=zimsec-grading-explained',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
                        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: "ZIMSEC O LEVEL GRADING EXPLAINED", theme: commonTheme,
                            commands: [
                                { id: 'title', type: 'sticker', text: "ZIMSEC O LEVEL GRADING EXPLAINED", slot: 'banner-top', size: 50, color: '#1a1a1a', stroke: '#ffffff', rotate: -1, trigger: { atSeconds: 0.1 } },
                                { id: "v0", type: 'photo', src: results["report card grades"], slot: "mid-left", width: 300, height: 210, caption: "A TO U", pinStyle: 'tape', trigger: { wordText: "fail", occurrence: 1 } },
                                { id: "pz0", type: 'panZoom', ...zoomTo("mid-left", 1.55), duration: 0.9, trigger: { afterId: "v0", offset: 0.15 } },
                                { id: "v1", type: 'icon', icon: "mdi:check-decagram-outline", slot: "mid-right", size: 170, bg: 'circle', color: "#27ae60", trigger: { wordText: "passes", occurrence: 1 } },
                                { id: "pz1", type: 'panZoom', ...zoomTo("mid-right", 1.55), duration: 0.9, trigger: { afterId: "v1", offset: 0.15 } },
                                { id: "out1", type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: "pz1", offset: 0.5 } },
                                { id: "v2", type: 'photo', src: results["exam hall students writing"], slot: "low-left", width: 300, height: 210, caption: "FINAL PAPERS", pinStyle: 'tape', trigger: { wordText: "papers", occurrence: 1 } },
                                { id: "pz2", type: 'panZoom', ...zoomTo("low-left", 1.55), duration: 0.9, trigger: { afterId: "v2", offset: 0.15 } },
                                { id: "v3", type: 'photo', src: results["certificate diploma"], slot: "low-right", width: 300, height: 210, caption: "5 C's OR BETTER", pinStyle: 'tape', trigger: { wordText: "benchmark", occurrence: 1 } },
                                { id: "pz3", type: 'panZoom', ...zoomTo("low-right", 1.55), duration: 0.9, trigger: { afterId: "v3", offset: 0.15 } },
                                { id: "out3", type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: "pz3", offset: 0.5 } },
                                { id: 'final_out', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: "pz3", offset: 0.6 } }
                            ],
                        },
                    },
                ],
            },
        ],
    };
})();
