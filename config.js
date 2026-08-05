// config.b2-spirit-documentary.js
// "The B-2 Spirit" — paper-sticker detective-board style, 3 scenes.
// bm_george voice, no avatar, no beat/music (add sound on TikTok/YT).
//
// HOW THE IMAGES WORK:
// The config runs as a Node.js async module BEFORE the engine starts any
// render — so it can call SerpAPI directly using the same
// process.env.SERPAPI_API_KEY secret the engine itself uses, download
// each image, and convert it to a base64 data: URI right here. The
// paper-sticker-explainer.html `photo` command takes that data: URI as
// `src`, so Puppeteer never has to reach out to any image host at
// recording time — it just reads an already-embedded string. Zero
// dependency on apex-casing-media.js (deleted), zero recording-time
// network calls for images.
//
// If SERPAPI_API_KEY isn't set (local dev without the secret), each
// fetchImage() call returns null, and the photo commands are cleanly
// omitted from the command list rather than crashing — the rest of the
// stickers, icons, arrows, and strings all still render fine.
//
// Run with:  VIDEO_CONFIG=config.b2-spirit-documentary.js node engine-ci.js

const https  = require('https');
const http   = require('http');

// ── Fetch one image from SerpAPI, return as base64 data URI or null ─────
async function fetchImage(query, index = 0) {
    const key = process.env.SERPAPI_API_KEY;
    if (!key) { console.warn('[B2Config] SERPAPI_API_KEY not set — skipping photo:', query); return null; }

    try {
        const searchUrl =
            `https://serpapi.com/search.json` +
            `?engine=google_images` +
            `&q=${encodeURIComponent(query)}` +
            `&ijn=0&num=30&safe=active` +
            `&api_key=${key}`;

        const data = await fetchJSON(searchUrl);
        const results = (data?.images_results || []).filter(r => r.original && !r.original.startsWith('x-raw-image'));
        if (!results.length) return null;

        const pick = results[index % results.length];
        if (!pick?.original) return null;

        console.log(`[B2Config] Downloading: ${pick.original.slice(0, 70)}`);
        const b64 = await urlToBase64(pick.original);
        if (!b64) return null;

        // Detect mime type from data; fall back to jpeg
        const mime = b64.startsWith('/9j/') || b64.startsWith('iVBOR') ? 'image/jpeg' : 'image/jpeg';
        return `data:${mime};base64,${b64}`;
    } catch (e) {
        console.warn(`[B2Config] fetchImage failed for "${query}":`, e.message?.slice(0, 80));
        return null;
    }
}

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        lib.get(url, { headers: { 'User-Agent': 'ApexEngine/2.0' } }, (res) => {
            let raw = '';
            res.on('data', d => raw += d);
            res.on('end', () => { try { resolve(JSON.parse(raw)); } catch (e) { reject(e); } });
        }).on('error', reject).setTimeout(15000, function() { this.destroy(); reject(new Error('Timeout')); });
    });
}

function urlToBase64(imageUrl) {
    return new Promise((resolve) => {
        const lib = imageUrl.startsWith('https') ? https : http;
        const req = lib.get(imageUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ApexEngine/2.0)', 'Accept': 'image/*' },
            timeout: 12000,
        }, (res) => {
            // Follow one redirect
            if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
                urlToBase64(res.headers.location).then(resolve);
                return;
            }
            if (res.statusCode !== 200) { resolve(null); return; }
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
        });
        req.on('error', () => resolve(null));
        req.on('timeout', () => { req.destroy(); resolve(null); });
    });
}

// ── Build commands, optionally with real photo data URIs ────────────────
// Photo commands are only added when the image resolved — if SerpAPI is
// unavailable the scene still renders cleanly with stickers and icons.
function addPhoto(commands, src, cmd) {
    if (!src) return;
    commands.push({ ...cmd, src });
}

// ── Main async config ────────────────────────────────────────────────────
module.exports = (async () => {

    // Pre-fetch all images before the engine starts
    // Generic queries that reliably return something useful for the B-2:
    // "stealth bomber" and "flying wing aircraft" are more reliable than
    // "B-2 Spirit" specifically on stock/press images.
    console.log('[B2Config] Pre-fetching images from SerpAPI...');
    const [imgTop, imgHangar, imgClose, imgFlight, imgCompare] = await Promise.all([
        fetchImage('B-2 Spirit bomber top view overhead',   0),
        fetchImage('B-2 Spirit stealth bomber hangar',       0),
        fetchImage('stealth bomber cockpit interior',        0),
        fetchImage('B-2 bomber flying wing in flight',       0),
        fetchImage('B-2 Spirit bomber formation flight',     0),
    ]);
    console.log('[B2Config] Images ready. Building config...');

    return {
        output: {
            title: 'b2-spirit-documentary',
            format: 'portrait',
            fps: 30,
            crf: 23,
            preset: 'medium',
        },

        defaults: {
            voice: 'bm_george',
            transition: 'fade',
            transitionDuration: 0.35,
        },

        scenes: [

            // ── Scene 1 — Hook: what IS this thing ──────────────────────
            {
                tts: {
                    text: "This is the B-2 Spirit. Only twenty one were ever built. Each one cost two point one billion dollars. That's more than its weight in gold. And it can carry nuclear weapons across any point on Earth without ever appearing on radar.",
                    voice: 'bm_george',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#f4ecdd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=b2-s1',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'CLASSIFIED',
                            theme: {
                                paper: '#f0e8d8',
                                ink: '#1a1a1a',
                                accent: '#c0392b',
                                accent2: '#2471a3',
                                shadow: 'rgba(0,0,0,0.32)',
                            },
                            commands: [
                                // B-2 overhead photo — tape pinned top-left, slanted
                                ...(imgTop ? [{
                                    id: 'photo1',
                                    type: 'photo', src: imgTop,
                                    x: 360, y: 620, width: 640, height: 400,
                                    rotate: -4, pinStyle: 'tape',
                                    caption: 'NORTHROP GRUMMAN B-2 SPIRIT',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // "ONLY 21 BUILT" sticker — bold red, slaps on over the photo
                                {
                                    id: 's1',
                                    type: 'sticker', text: 'ONLY 21 BUILT',
                                    x: 540, y: 280, size: 78,
                                    color: '#ffffff', stroke: '#c0392b', bg: '#c0392b',
                                    rotate: -2,
                                    trigger: { wordText: 'twenty', occurrence: 1 },
                                },

                                // "$2.1 BILLION EACH" — label annotation, handwritten style
                                {
                                    id: 'l1',
                                    type: 'label', text: '$2,100,000,000 per aircraft',
                                    x: 400, y: 1060, size: 38, color: '#c0392b', rotate: -1,
                                    trigger: { wordText: 'billion', occurrence: 1 },
                                },
                                // underline it
                                {
                                    id: 'ul1',
                                    type: 'underline', target: 'l1', color: '#c0392b',
                                    trigger: { afterId: 'l1', offset: 0.5 },
                                },

                                // weight-in-gold icon
                                {
                                    id: 'i1',
                                    type: 'icon', icon: 'mdi:gold', size: 110,
                                    x: 820, y: 1060, bg: 'circle', color: '#c8a200',
                                    trigger: { wordText: 'gold', occurrence: 1 },
                                },

                                // "UNDETECTABLE" sticker, bottom
                                {
                                    id: 's2',
                                    type: 'sticker', text: 'UNDETECTABLE',
                                    x: 540, y: 1200, size: 72,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 1,
                                    trigger: { wordText: 'radar', occurrence: 1 },
                                },

                                // draw a scribble circle around the undetectable sticker
                                {
                                    id: 'sc1',
                                    type: 'circle', target: 's2', color: '#c0392b',
                                    trigger: { afterId: 's2', offset: 0.4 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 2 — Why it costs so much / stealth design ─────────
            {
                tts: {
                    text: "The price comes from the shape. Every curve on the B-2 is designed to scatter radar energy away from its source. No straight edges, no flat surfaces, no vertical tail. The skin is made of radar-absorbing composite material, and the engines are buried deep inside the wing so their heat signature can't be seen from below.",
                    voice: 'bm_george',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#f4ecdd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=b2-s2',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'WHY IT COSTS SO MUCH',
                            theme: {
                                paper: '#f0e8d8',
                                ink: '#1a1a1a',
                                accent: '#c0392b',
                                accent2: '#2471a3',
                                shadow: 'rgba(0,0,0,0.32)',
                            },
                            commands: [
                                // Hangar/close-up photo, slightly rotated right
                                ...(imgHangar ? [{
                                    id: 'photo2',
                                    type: 'photo', src: imgHangar,
                                    x: 560, y: 560, width: 860, height: 500,
                                    rotate: 3, pinStyle: 'pins',
                                    caption: 'COMPOSITE STEALTH SKIN',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // Cockpit photo lower left, tape
                                ...(imgClose ? [{
                                    id: 'photo3',
                                    type: 'photo', src: imgClose,
                                    x: 260, y: 1080, width: 400, height: 280,
                                    rotate: -5, pinStyle: 'tape',
                                    caption: 'COCKPIT',
                                    trigger: { wordText: 'buried', occurrence: 1 },
                                }] : []),

                                // "THE SHAPE IS THE SECRET" sticker
                                {
                                    id: 's3',
                                    type: 'sticker', text: 'THE SHAPE IS THE SECRET',
                                    x: 540, y: 250, size: 62,
                                    color: '#ffffff', stroke: '#1a1a1a', bg: '#1a1a1a',
                                    rotate: -1,
                                    trigger: { wordText: 'shape', occurrence: 1 },
                                },

                                // Arrow pointing at the hangar photo from the sticker
                                {
                                    id: 'arr1',
                                    type: 'arrow',
                                    x1: 540, y1: 320, x2: 560, y2: 430,
                                    color: '#c0392b', curve: 40,
                                    trigger: { afterId: 's3', offset: 0.3 },
                                },

                                // "NO VERTICAL TAIL" label with icon
                                {
                                    id: 'i2',
                                    type: 'icon', icon: 'mdi:airplane', size: 120,
                                    x: 200, y: 420, bg: 'square', color: '#1a1a1a',
                                    rotate: -8,
                                    trigger: { wordText: 'vertical', occurrence: 1 },
                                },
                                {
                                    id: 'l2',
                                    type: 'label', text: 'NO VERTICAL TAIL', size: 42,
                                    x: 200, y: 560, color: '#c0392b', rotate: -2,
                                    trigger: { afterId: 'i2', offset: 0.15 },
                                },

                                // "ENGINES HIDDEN INSIDE" label
                                {
                                    id: 'l3',
                                    type: 'label', text: '→ engines buried inside wing',
                                    size: 36, x: 540, y: 1400, color: '#2471a3', rotate: 1,
                                    trigger: { wordText: 'buried', occurrence: 1 },
                                },

                                // Red string connecting the cockpit photo to the main hangar photo
                                ...(imgClose && imgHangar ? [{
                                    id: 'str1',
                                    type: 'string',
                                    from: { target: 'photo3' },
                                    to: { target: 'photo2' },
                                    color: '#c0392b', sag: 45,
                                    trigger: { afterId: 'photo3', offset: 0.5 },
                                }] : []),
                            ],
                        },
                    },
                ],
            },

            // ── Scene 3 — The mission / CTA ──────────────────────────────
            {
                tts: {
                    text: "The B-2 can fly from Missouri to anywhere on Earth, drop its weapons, and return. Non-stop. Twenty two hours in the air. Two pilots, two ejector seats, a tiny galley, and a fold-out toilet behind the cockpit. That's it. No escort needed. No one knows it's there. Subscribe for more.",
                    voice: 'bm_george',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#f4ecdd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=b2-s3',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'THE MISSION',
                            theme: {
                                paper: '#f0e8d8',
                                ink: '#1a1a1a',
                                accent: '#c0392b',
                                accent2: '#2471a3',
                                shadow: 'rgba(0,0,0,0.32)',
                            },
                            commands: [
                                // In-flight photo, top center
                                ...(imgFlight ? [{
                                    id: 'photo4',
                                    type: 'photo', src: imgFlight,
                                    x: 540, y: 550, width: 860, height: 480,
                                    rotate: 2, pinStyle: 'tape',
                                    caption: 'WHITEMAN AFB → ANY POINT ON EARTH',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // Formation photo lower right
                                ...(imgCompare ? [{
                                    id: 'photo5',
                                    type: 'photo', src: imgCompare,
                                    x: 730, y: 1160, width: 420, height: 280,
                                    rotate: 4, pinStyle: 'pins',
                                    caption: 'FORMATION',
                                    trigger: { wordText: 'escort', occurrence: 1 },
                                }] : []),

                                // "22 HOURS NON-STOP" sticker
                                {
                                    id: 's4',
                                    type: 'sticker', text: '22 HOURS NON-STOP',
                                    x: 540, y: 260, size: 70,
                                    color: '#ffffff', stroke: '#c0392b', bg: '#c0392b',
                                    rotate: -2,
                                    trigger: { wordText: 'twenty', occurrence: 1 },
                                },

                                // Missouri label + globe icon
                                {
                                    id: 'i3',
                                    type: 'icon', icon: 'mdi:earth', size: 120,
                                    x: 200, y: 380, bg: 'circle', color: '#2471a3',
                                    trigger: { wordText: 'missouri', occurrence: 1 },
                                },
                                {
                                    id: 'l4',
                                    type: 'label', text: 'Missouri → Anywhere',
                                    size: 38, x: 200, y: 500, color: '#2471a3', rotate: -3,
                                    trigger: { afterId: 'i3', offset: 0.2 },
                                },

                                // Arrow from globe to flight photo
                                ...(imgFlight ? [{
                                    id: 'arr2',
                                    type: 'arrow',
                                    x1: 260, y1: 440, x2: 540, y2: 560,
                                    color: '#c0392b', curve: 50,
                                    trigger: { afterId: 'i3', offset: 0.5 },
                                }] : []),

                                // "TWO PILOTS, ONE TOILET" label — the absurd detail
                                {
                                    id: 'l5',
                                    type: 'label', text: '2 pilots. 1 fold-out toilet.',
                                    size: 40, x: 300, y: 1060, color: '#1a1a1a', rotate: -2,
                                    trigger: { wordText: 'toilet', occurrence: 1 },
                                },
                                {
                                    id: 'i4',
                                    type: 'icon', icon: 'mdi:toilet', size: 90,
                                    x: 160, y: 1060, bg: 'none', color: '#1a1a1a',
                                    trigger: { afterId: 'l5', offset: 0 },
                                },

                                // "NO ONE KNOWS IT'S THERE" final sticker
                                {
                                    id: 's5',
                                    type: 'sticker', text: "NO ONE KNOWS IT'S THERE",
                                    x: 540, y: 1340, size: 58,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 1,
                                    trigger: { wordText: 'no', occurrence: 2 },
                                },
                                {
                                    id: 'sc2',
                                    type: 'circle', target: 's5', color: '#c0392b',
                                    trigger: { afterId: 's5', offset: 0.4 },
                                },

                                // Subscribe sticker
                                {
                                    id: 'sub',
                                    type: 'icon', icon: 'mdi:bell-ring', size: 110,
                                    x: 880, y: 120, bg: 'circle', color: '#c0392b',
                                    trigger: { wordText: 'subscribe', occurrence: 1 },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };
})();