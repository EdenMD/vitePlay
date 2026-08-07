// config.ohio-class.js
// Submarine Class series, Episode 1: Ohio-class.
// Paper-sticker corkboard documentary, ApexCasing v2.1
// (paper-sticker-explainer.html). ONE file — everything inline, no
// separate modules. All image fetching happens here in config.js; the
// casing itself never calls an API, it only ever receives base64 `src`.
//
// Every analogy in the narration is paired with its own fetched photo —
// none are text-only. Older photo/sticker pairs get blurred + dimmed
// (not erased) as the board fills, so it never clumps, while still
// reading as a real accumulating case file rather than a wipe-and-replace
// slideshow. panZoom is used twice: a slow push-in as the dramatic
// firepower reveal lands, and a pull-back at the end to show the whole
// board before the CTA. Uses the casing's own slot system (top/mid/low/
// bot/deep/floor × left/center/right) to spread content across the full
// canvas instead of hand-picked coordinates — two elements per analogy
// beat land in the same row (photo + caption) so they read together.
//
// Voice: am_fenrir (deep, gravelly — matches the dry, deadpan delivery
// this script is written for).

const SERPAPI_KEY  = process.env.SERPAPI_API_KEY    || null;
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || null;
const PEXELS_KEY   = process.env.PEXELS_API_KEY      || null;
const PIXABAY_KEY  = process.env.PIXABAY_API_KEY     || null;

// Cache SerpAPI result lists per query+orientation so multiple images
// from the same search (different imageIndex) don't cost extra calls —
// same behavior as the engine's own src/image-api.js.
const serpApiResultsCache = new Map();

function getSourceChain() {
    const chain = [];
    if (SERPAPI_KEY)  chain.push('serpapi');
    if (UNSPLASH_KEY) chain.push('unsplash');
    if (PEXELS_KEY)   chain.push('pexels');
    if (PIXABAY_KEY)  chain.push('pixabay');
    chain.push('picsum'); // always available, no key needed — final resort
    return chain;
}

async function fetchJSON(url, headers = {}) {
    const res = await fetch(url, { headers: { 'User-Agent': 'APEX-Engine/2.0', ...headers } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// Same validation as the engine's downloadFile(): rejects HTML error
// pages and suspiciously-small responses. Returns a base64 data URI
// instead of writing to disk.
async function downloadAsDataUri(url) {
    const res = await fetch(url, { headers: { 'User-Agent': 'APEX-Engine/2.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get('content-type') || 'image/jpeg';
    if (ct.includes('text/html')) throw new Error('Server returned HTML instead of an image');
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1024) throw new Error(`File too small (${buf.length}B) — likely an error response`);
    return `data:${ct};base64,${buf.toString('base64')}`;
}

async function searchSerpApi(query, orientation, imageIndex) {
    if (!SERPAPI_KEY) throw new Error('SERPAPI_API_KEY not set');
    const cacheKey = `${query.toLowerCase().trim()}::${orientation}`;
    let results = serpApiResultsCache.get(cacheKey);
    if (!results) {
        const url =
            `https://serpapi.com/search.json?engine=google_images` +
            `&q=${encodeURIComponent(query)}&ijn=0&num=100&safe=active` +
            `&api_key=${SERPAPI_KEY}`;
        const data = await fetchJSON(url, { Authorization: `Bearer ${SERPAPI_KEY}` });
        const raw  = data?.images_results || [];
        if (!raw.length) throw new Error('No image results from SerpAPI');
        const usable = raw.filter(r => r.original && !r.original.startsWith('x-raw-image'));
        results = usable.length ? usable : raw;
        serpApiResultsCache.set(cacheKey, results);
    }
    return results;
}

async function searchUnsplash(query, orientation) {
    if (!UNSPLASH_KEY) throw new Error('No UNSPLASH_ACCESS_KEY');
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}` +
        `&orientation=${orientation}&content_filter=high&client_id=${UNSPLASH_KEY}`;
    const data = await fetchJSON(url);
    return data?.urls?.regular || data?.urls?.full || null;
}

async function searchPexels(query, orientation) {
    if (!PEXELS_KEY) throw new Error('No PEXELS_API_KEY');
    const orMap = { portrait: 'portrait', landscape: 'landscape', squarish: 'square' };
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}` +
        `&orientation=${orMap[orientation] || 'portrait'}&per_page=5&page=1`;
    const data = await fetchJSON(url, { Authorization: PEXELS_KEY });
    const photos = data?.photos;
    if (!photos?.length) return null;
    const photo = photos[Math.floor(Math.random() * photos.length)];
    return photo?.src?.large2x || photo?.src?.large || null;
}

async function searchPixabay(query, orientation) {
    if (!PIXABAY_KEY) throw new Error('No PIXABAY_API_KEY');
    const orMap = { portrait: 'vertical', landscape: 'horizontal', squarish: 'square' };
    const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}` +
        `&image_type=photo&orientation=${orMap[orientation] || 'vertical'}` +
        `&safesearch=true&per_page=5&min_width=1080`;
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

const PLACEHOLDER_SVG =
    'data:image/svg+xml;base64,' + Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">` +
        `<rect width="100%" height="100%" fill="#2a2a33"/>` +
        `<text x="50%" y="50%" fill="#888" font-size="42" text-anchor="middle" font-family="sans-serif">image unavailable</text>` +
        `</svg>`
    ).toString('base64');

// Same fallback order and same "retry every cached SerpAPI result before
// moving to the next provider" behavior as src/image-api.js.
async function fetchImageBase64(query, orientation = 'portrait', imageIndex = 0) {
    for (const source of getSourceChain()) {
        if (source === 'serpapi') {
            try {
                const results = await searchSerpApi(query, orientation, imageIndex);
                const total = results.length || 1;
                let lastErr = null;
                for (let attempt = 0; attempt < total; attempt++) {
                    const idx = (imageIndex + attempt) % total;
                    const candidateUrl = results[idx]?.original;
                    if (!candidateUrl) continue;
                    try { return await downloadAsDataUri(candidateUrl); }
                    catch (e) { lastErr = e; }
                }
                console.warn(`[image] serpapi exhausted all ${total} result(s) for "${query}": ${lastErr?.message || 'unknown'}`);
            } catch (e) {
                console.warn(`[image] serpapi failed for "${query}": ${e.message}`);
            }
            continue;
        }
        try {
            const url = await (
                source === 'unsplash' ? searchUnsplash(query, orientation) :
                source === 'pexels'   ? searchPexels(query, orientation) :
                source === 'pixabay'  ? searchPixabay(query, orientation) :
                getPicsum(orientation)
            );
            if (!url) continue;
            return await downloadAsDataUri(url);
        } catch (e) {
            console.warn(`[image] ${source} failed for "${query}": ${e.message}`);
        }
    }
    console.warn(`[image] ALL sources failed for "${query}" — using placeholder`);
    return PLACEHOLDER_SVG;
}

// ═══════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════

module.exports = async () => {
    const queries = {
        hero:      'submarine ocean',
        length:    'football field',
        weight:    'parking lot cars',
        crew:      'submarine crew interior',
        speed:     'speed limit sign',
        stealth:   'library interior',
        fuel:      'gas station pump',
        firepower: 'trident missile launch',
        fleet:     'aerial ocean',
    };

    const entries = Object.entries(queries);
    const fetched = await Promise.all(entries.map(([, q]) => fetchImageBase64(q, 'portrait', 0)));
    const img = {};
    entries.forEach(([key], i) => { img[key] = fetched[i]; });

    const narration =
        "There's a machine sitting in the Pacific right now that most people have never heard of, " +
        "and it could end a war before breakfast. It's called the Ohio class submarine, and everything " +
        "about it sounds made up. It's five hundred sixty feet long. That's two football fields, nose to " +
        "tail, with room to spare. Submerged, it weighs almost nineteen thousand tons, heavier than twelve " +
        "thousand cars, all crammed into one hull. Inside: a hundred fifty five people, zero sunlight, for " +
        "up to ninety days straight. It can outrun a school zone speed limit, completely underwater. And " +
        "somehow, it's quieter than a public library. Its nuclear reactor runs for over twenty years " +
        "without refueling, like buying one tank of gas in college and still driving on it at your " +
        "retirement party. And here's the part that actually stops people: a single one of these carries " +
        "more destructive power than every bomb dropped in the entire Second World War, combined. Eighteen " +
        "of them are active right now. Hiding. All at once. And nobody, not even most of the Navy, knows " +
        "exactly where. This is the Ohio class. Submarine one of this series. Subscribe, because next " +
        "week, we go even deeper.";

    return {
        output: {
            title:  'ohio-class-submarine-ep1',
            format: 'portrait',
            fps:    30,
            crf:    23,
            preset: 'fast',
            beat: {
                bpm: 90, bars: 16, genre: 'cinematic', key: 'Dmin',
                layers: ['kick', 'snare', 'bass', 'pad'],
                swing: 0.06, reverb: 0.3, loop: true, vol: 0.10,
            },
        },

        defaults: { voice: 'am_fenrir', transition: 'zoom-cut', transitionDuration: 0.45 },

        scenes: [
            {
                tts: { text: narration, pauseAfter: 0.6 },
                captions: { style: 'highlight', fontSize: 60, highlightColor: '#f5c518', wordsPerChunk: 3 },
                layers: [
                    { type: 'background', color: '#f4ecdd' },
                    {
                        type:      'html-record',
                        src:       './ApexCasing/paper-sticker-explainer.html?tag=ohio-class-ep1',
                        audioSync: true,
                        cursor:    false,
                        data: {
                            title: 'CASE FILE: SUBMARINE CLASS 01',
                            theme: { accent: '#ff5a3c', accent2: '#2f7cf6', ink: '#17181c' },
                            commands: [
                                // ── HERO — fires on the very first word, big and central ──
                                { id: 'hero', type: 'photo', src: img.hero,
                                  x: 540, y: 300, width: 760, height: 520, pinStyle: 'pins',
                                  kenBurns: 'zoom-in', kenBurnsAmount: 0.14,
                                  trigger: { wordText: 'theres', occurrence: 1 } },

                                // ── LENGTH — row 0 ──────────────────────────────────────
                                { id: 'lengthPhoto', type: 'photo', src: img.length,
                                  slot: 'top-left', width: 300, height: 220, pinStyle: 'tape',
                                  trigger: { wordText: 'feet', occurrence: 1 } },
                                { id: 'lengthSticker', type: 'sticker', text: '560 FT\n2 FOOTBALL FIELDS',
                                  slot: 'top-right', size: 42, rotate: -3,
                                  trigger: { wordText: 'football', occurrence: 1 } },

                                // ── WEIGHT — row 1 ──────────────────────────────────────
                                { id: 'weightPhoto', type: 'photo', src: img.weight,
                                  slot: 'mid-left', width: 300, height: 220, pinStyle: 'tape',
                                  trigger: { wordText: 'tons', occurrence: 1 } },
                                { id: 'weightSticker', type: 'sticker', text: '18,750 TONS\nSUBMERGED',
                                  slot: 'mid-right', size: 42, rotate: 2,
                                  trigger: { wordText: 'cars', occurrence: 1 } },

                                // ── CREW — row 2 ────────────────────────────────────────
                                { id: 'crewPhoto', type: 'photo', src: img.crew,
                                  slot: 'low-left', width: 300, height: 220, pinStyle: 'pins',
                                  trigger: { wordText: 'sunlight', occurrence: 1 } },
                                { id: 'crewSticker', type: 'sticker', text: '155 CREW\n90 DAYS, NO SUN',
                                  slot: 'low-right', size: 40, rotate: -2,
                                  trigger: { wordText: 'ninety', occurrence: 1 } },

                                // ── SPEED — row 3 ───────────────────────────────────────
                                { id: 'speedPhoto', type: 'photo', src: img.speed,
                                  slot: 'bot-left', width: 300, height: 220, pinStyle: 'tape',
                                  trigger: { wordText: 'speed', occurrence: 1 } },
                                { id: 'speedSticker', type: 'sticker', text: 'FASTER THAN\nA SCHOOL ZONE',
                                  slot: 'bot-right', size: 40, rotate: 3,
                                  trigger: { wordText: 'underwater', occurrence: 1 } },

                                // ── STEALTH — row 4 ─────────────────────────────────────
                                { id: 'stealthPhoto', type: 'photo', src: img.stealth,
                                  slot: 'deep-left', width: 300, height: 220, pinStyle: 'tape',
                                  trigger: { wordText: 'quieter', occurrence: 1 } },
                                { id: 'stealthSticker', type: 'sticker', text: 'QUIETER THAN\nA LIBRARY',
                                  slot: 'deep-right', size: 40, rotate: -3,
                                  trigger: { wordText: 'library', occurrence: 1 } },

                                // ── FUEL — row 5 (board is now full, top to floor) ──────
                                { id: 'fuelPhoto', type: 'photo', src: img.fuel,
                                  slot: 'floor-left', width: 300, height: 220, pinStyle: 'pins',
                                  trigger: { wordText: 'reactor', occurrence: 1 } },
                                { id: 'fuelSticker', type: 'sticker', text: '20+ YEARS\nONE TANK OF FUEL',
                                  slot: 'floor-right', size: 38, rotate: 2,
                                  trigger: { wordText: 'retirement', occurrence: 1 } },

                                // ── DECLUTTER — blur + dim the earliest two beats so the
                                // board doesn't clump once the big reveals land on top ──
                                { id: 'blurLength', type: 'blur', target: 'lengthPhoto', amount: 6, duration: 0.8,
                                  trigger: { wordText: 'stops', occurrence: 1 } },
                                { id: 'fadeLength', type: 'fadeGroup', targets: ['lengthPhoto', 'lengthSticker'],
                                  opacity: 0.30, duration: 0.8,
                                  trigger: { wordText: 'stops', occurrence: 1 } },
                                { id: 'blurWeight', type: 'blur', target: 'weightPhoto', amount: 6, duration: 0.8,
                                  trigger: { afterId: 'blurLength', offset: 0.15 } },
                                { id: 'fadeWeight', type: 'fadeGroup', targets: ['weightPhoto', 'weightSticker'],
                                  opacity: 0.30, duration: 0.8,
                                  trigger: { afterId: 'fadeLength', offset: 0.15 } },

                                // ── FIREPOWER — the big dramatic centerpiece, placed
                                // explicitly (not slotted) so it can sit large, front and
                                // center, over the now-blurred earlier rows ─────────────
                                { id: 'firepowerPhoto', type: 'photo', src: img.firepower,
                                  x: 540, y: 860, width: 620, height: 460, pinStyle: 'pins',
                                  trigger: { wordText: 'combined', occurrence: 1 } },
                                { id: 'firepowerSticker', type: 'sticker', text: 'MORE FIREPOWER THAN\nALL OF WWII COMBINED',
                                  x: 540, y: 1160, size: 46, rotate: -1, color: '#ff5a3c',
                                  trigger: { afterId: 'firepowerPhoto', offset: 0.3 } },
                                { id: 'zoomIn', type: 'panZoom', toScale: 1.12, toX: 0, toY: -80, duration: 1.4,
                                  trigger: { wordText: 'combined', occurrence: 1 } },

                                // ── declutter crew/speed rows before the fleet reveal ───
                                { id: 'blurCrew', type: 'blur', target: 'crewPhoto', amount: 6, duration: 0.7,
                                  trigger: { wordText: 'eighteen', occurrence: 1 } },
                                { id: 'fadeCrew', type: 'fadeGroup', targets: ['crewPhoto', 'crewSticker'],
                                  opacity: 0.30, duration: 0.7,
                                  trigger: { wordText: 'eighteen', occurrence: 1 } },
                                { id: 'blurSpeed', type: 'blur', target: 'speedPhoto', amount: 6, duration: 0.7,
                                  trigger: { afterId: 'blurCrew', offset: 0.15 } },
                                { id: 'fadeSpeed', type: 'fadeGroup', targets: ['speedPhoto', 'speedSticker'],
                                  opacity: 0.30, duration: 0.7,
                                  trigger: { afterId: 'fadeCrew', offset: 0.15 } },

                                // ── FLEET reveal — explicit placement, lower board ──────
                                { id: 'fleetPhoto', type: 'photo', src: img.fleet,
                                  x: 540, y: 1420, width: 640, height: 420, pinStyle: 'pins',
                                  trigger: { wordText: 'hiding', occurrence: 1 } },
                                { id: 'fleetSticker', type: 'sticker', text: '18 ACTIVE RIGHT NOW\nLOCATION: UNKNOWN',
                                  x: 540, y: 1660, size: 40, color: '#2f7cf6',
                                  trigger: { afterId: 'fleetPhoto', offset: 0.3 } },

                                // string connecting the hero shot to the fleet reveal —
                                // one deliberate detective-board connection, not ten
                                { id: 'caseString', type: 'string',
                                  from: { target: 'hero' }, to: { target: 'fleetPhoto' },
                                  color: '#c0392b', sag: 60,
                                  trigger: { wordText: 'nobody', occurrence: 1 } },

                                // pull back to reveal the whole board before the CTA
                                { id: 'zoomOut', type: 'panZoom', toScale: 0.86, toX: 0, toY: 40, duration: 1.6,
                                  trigger: { wordText: 'nobody', occurrence: 1 } },

                                // ── title + CTA ──────────────────────────────────────────
                                { id: 'titleSticker', type: 'sticker', text: 'OHIO-CLASS',
                                  x: 540, y: 1750, size: 84, bg: '#ffffff',
                                  trigger: { wordText: 'class', occurrence: 2 } },
                                { id: 'ctaSticker', type: 'sticker', text: 'SUBSCRIBE\nFOR EPISODE 2',
                                  x: 540, y: 1850, size: 50, color: '#ff5a3c',
                                  trigger: { wordText: 'subscribe', occurrence: 1 } },
                            ],
                        },
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                    },
                ],
            },
        ],
    };
};
