// config.project-pluto.js
// "Project Pluto" — the nuclear-powered cruise missile that irradiated everything underneath it.
// 3 scenes, bm_george voice, paper-sticker-detective-board style.
//
// HOW THE IMAGES WORK:
// The config runs as an async module BEFORE the engine starts rendering.
// It calls SerpAPI directly using process.env.SERPAPI_API_KEY, downloads
// each image, and converts it to a base64 data: URI. The paper-sticker
// template takes those as `src`, so Puppeteer has zero recording-time
// network calls for images.
//
// If SERPAPI_API_KEY isn't set, fetchImage() returns null and photo
// commands are omitted — stickers, icons, arrows, and strings still render.
//
// OPTIMIZED SEARCH QUERIES (short + visual, under 125 chars):
//   - "SLAM missile concept 1960s"
//   - "Tory-II reactor test stand"
//   - "SLAM missile test cart"
//   - "SLAM supersonic missile"
//
// Run with:  VIDEO_CONFIG=config.project-pluto.js node engine-ci.js

const https = require('https');
const http = require('http');

// ── Fetch one image from SerpAPI, return as base64 data URI or null ──
async function fetchImage(query, index = 0) {
    const key = process.env.SERPAPI_API_KEY;
    if (!key) {
        console.warn('[PlutoConfig] SERPAPI_API_KEY not set — skipping photo:', query);
        return null;
    }

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

        console.log(`[PlutoConfig] Downloading: ${pick.original.slice(0, 70)}`);
        const b64 = await urlToBase64(pick.original);
        if (!b64) return null;

        const mime = b64.startsWith('/9j/') || b64.startsWith('iVBOR') ? 'image/jpeg' : 'image/jpeg';
        return `data:${mime};base64,${b64}`;
    } catch (e) {
        console.warn(`[PlutoConfig] fetchImage failed for "${query}":`, e.message?.slice(0, 80));
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
        }).on('error', reject).setTimeout(15000, function () { this.destroy(); reject(new Error('Timeout')); });
    });
}

function urlToBase64(imageUrl) {
    return new Promise((resolve) => {
        const lib = imageUrl.startsWith('https') ? https : http;
        const req = lib.get(imageUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ApexEngine/2.0)', 'Accept': 'image/*' },
            timeout: 12000,
        }, (res) => {
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

// ── Helper: add a photo command only if src resolved ──
function addPhoto(commands, src, cmd) {
    if (!src) return;
    commands.push({ ...cmd, src });
}

// ── Main async config ────────────────────────────────────────────────────
module.exports = (async () => {

    console.log('[PlutoConfig] Pre-fetching images from SerpAPI...');

    // ── OPTIMIZED QUERIES ── short, visual, under 125 chars ──────────────
    const [imgMissile, imgReactor, imgTest, imgConcept] = await Promise.all([
        fetchImage('SLAM missile concept 1960s', 0),
        fetchImage('Tory-II reactor test stand', 0),
        fetchImage('SLAM missile test cart', 0),
        fetchImage('SLAM supersonic missile', 0),
    ]);

    console.log('[PlutoConfig] Images ready. Building config...');

    return {
        output: {
            title: 'project-pluto-documentary',
            format: 'portrait',
            fps: 30,
            crf: 23,
            preset: 'medium',
        },

        defaults: {
            voice: 'am_puck',
            transition: 'fade',
            transitionDuration: 0.35,
        },

        scenes: [

            // ── Scene 1 — Hook: what WAS Project Pluto ─────────────────────
            {
                tts: {
                    text: "In the 1950s, the US built a nuclear-powered cruise missile. It was called Project Pluto. It could fly at Mach three, for days, skimming the treetops. It left a trail of radiation everywhere it went. The Air Force called it an 'unmanned nuclear bomber.' The rest of the world called it insane.",
                    voice: 'bm_george',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=pluto-s1',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'PROJECT PLUTO',
                            theme: {
                                paper: '#e8dfcd',
                                ink: '#1a1a1a',
                                accent: '#a93226',
                                accent2: '#2e4053',
                                shadow: 'rgba(20,16,10,0.38)',
                            },
                            commands: [
                                // Main missile concept photo — center top
                                ...(imgMissile ? [{
                                    id: 'photo1',
                                    type: 'photo', src: imgMissile,
                                    x: 540, y: 520,
                                    width: 800, height: 440,
                                    rotate: -3, pinStyle: 'pins',
                                    caption: 'SLAM — SUPERSONIC LOW-ALTITUDE MISSILE',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // Hook sticker — "NUCLEAR CRUISE MISSILE" top left
                                {
                                    id: 's1',
                                    type: 'sticker', text: 'NUCLEAR CRUISE MISSILE',
                                    x: 280, y: 180,
                                    size: 62,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -2,
                                    trigger: { wordText: 'pluto', occurrence: 1 },
                                },

                                // "MACH 3" sticker — top right
                                {
                                    id: 's2',
                                    type: 'sticker', text: 'MACH 3',
                                    x: 800, y: 190,
                                    size: 58,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 3,
                                    trigger: { wordText: 'mach', occurrence: 1 },
                                },

                                // "FLY FOR DAYS" label — below the Mach sticker
                                {
                                    id: 'l1',
                                    type: 'label', text: 'flies for days, non-stop',
                                    size: 38, x: 800, y: 280,
                                    color: '#2e4053', rotate: 2,
                                    trigger: { afterId: 's2', offset: 0.3 },
                                },

                                // Radiation icon — left side, aligned with photo lower edge
                                {
                                    id: 'i1',
                                    type: 'icon', icon: 'mdi:radioactive', size: 130,
                                    x: 160, y: 600,
                                    bg: 'circle', color: '#e67e22',
                                    trigger: { wordText: 'radiation', occurrence: 1 },
                                },

                                // Label beside the radiation icon
                                {
                                    id: 'l2',
                                    type: 'label', text: 'irradiated everything underneath it',
                                    size: 36, x: 180, y: 740,
                                    color: '#a93226', rotate: -1,
                                    trigger: { afterId: 'i1', offset: 0.2 },
                                },

                                // Underline that label
                                {
                                    id: 'ul1',
                                    type: 'underline', target: 'l2', color: '#a93226',
                                    trigger: { afterId: 'l2', offset: 0.4 },
                                },

                                // Bottom sticker — "UNMANNED NUCLEAR BOMBER"
                                {
                                    id: 's3',
                                    type: 'sticker', text: 'UNMANNED NUCLEAR BOMBER',
                                    x: 540, y: 1320,
                                    size: 60,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 1,
                                    trigger: { wordText: 'unmanned', occurrence: 1 },
                                },

                                // Circle scribble around it
                                {
                                    id: 'sc1',
                                    type: 'circle', target: 's3', color: '#a93226',
                                    trigger: { afterId: 's3', offset: 0.4 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 2 — The Engine (Tory-II Reactor) ─────────────────────
            {
                tts: {
                    text: "The engine was a nuclear ramjet. Air passed through a massive unshielded reactor core, was heated to thousands of degrees, and expelled out the back at supersonic speeds. It was tested at the Nevada Test Site. The Tory-II reactor ran successfully — without melting — but the radiation emitted from the exhaust was so lethal it would have killed anything below the flight path.",
                    voice: 'bm_george',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=pluto-s2',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'THE ENGINE',
                            theme: {
                                paper: '#e8dfcd',
                                ink: '#1a1a1a',
                                accent: '#a93226',
                                accent2: '#2e4053',
                                shadow: 'rgba(20,16,10,0.38)',
                            },
                            commands: [
                                // Main photo: Tory-II reactor test stand
                                ...(imgReactor ? [{
                                    id: 'photo2',
                                    type: 'photo', src: imgReactor,
                                    x: 540, y: 560,
                                    width: 820, height: 460,
                                    rotate: 2, pinStyle: 'tape',
                                    caption: 'TORY-II — NUCLEAR RAMJET TEST STAND (NEVADA)',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // Top sticker: "NUCLEAR RAMJET"
                                {
                                    id: 's4',
                                    type: 'sticker', text: 'NUCLEAR RAMJET',
                                    x: 540, y: 190,
                                    size: 72,
                                    color: '#ffffff', stroke: '#2e4053', bg: '#2e4053',
                                    rotate: -2,
                                    trigger: { wordText: 'ramjet', occurrence: 1 },
                                },

                                // "UNSHIELDED REACTOR" — side label
                                {
                                    id: 'l3',
                                    type: 'label', text: 'UNSHIELDED CORE',
                                    size: 44, x: 200, y: 400,
                                    color: '#a93226', rotate: -4,
                                    trigger: { wordText: 'unshielded', occurrence: 1 },
                                },
                                {
                                    id: 'arr1',
                                    type: 'arrow',
                                    x1: 240, y1: 440, x2: 460, y2: 520,
                                    color: '#a93226', curve: 30,
                                    trigger: { afterId: 'l3', offset: 0.2 },
                                },

                                // "AIR IN → HEATED → EXHAUST" label chain
                                {
                                    id: 'l4',
                                    type: 'label', text: 'air in → heated to 2,000°C → supersonic exhaust',
                                    size: 34, x: 540, y: 1050,
                                    color: '#2e4053', rotate: 0,
                                    trigger: { wordText: 'heated', occurrence: 1 },
                                },

                                // Skull icon — indicating lethal exhaust
                                {
                                    id: 'i2',
                                    type: 'icon', icon: 'mdi:skull', size: 100,
                                    x: 880, y: 1050,
                                    bg: 'circle', color: '#a93226',
                                    trigger: { afterId: 'l4', offset: 0.1 },
                                },

                                // Bottom sticker — "LETHAL RADIATION WAKE"
                                {
                                    id: 's5',
                                    type: 'sticker', text: 'LETHAL RADIATION WAKE',
                                    x: 540, y: 1360,
                                    size: 60,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: 1,
                                    trigger: { wordText: 'lethal', occurrence: 1 },
                                },
                                // Circle it
                                {
                                    id: 'sc2',
                                    type: 'circle', target: 's5', color: '#a93226',
                                    trigger: { afterId: 's5', offset: 0.4 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 3 — The Mission / Cancellation ──────────────────────
            {
                tts: {
                    text: "The plan was insane. The missile would fly over the Soviet Union at low altitude, dropping hydrogen bombs as it went. When it ran out of bombs, it would crash into Moscow — still radioactive — and contaminate the rubble. The program was canceled in 1964. Intercontinental ballistic missiles made it obsolete. But also: it was just too horrifying to use.",
                    voice: 'bm_george',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=pluto-s3',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'THE MISSION',
                            theme: {
                                paper: '#e8dfcd',
                                ink: '#1a1a1a',
                                accent: '#a93226',
                                accent2: '#2e4053',
                                shadow: 'rgba(20,16,10,0.38)',
                            },
                            commands: [
                                // Main photo: missile on test cart or concept
                                ...(imgTest ? [{
                                    id: 'photo3',
                                    type: 'photo', src: imgTest,
                                    x: 540, y: 540,
                                    width: 760, height: 440,
                                    rotate: -3, pinStyle: 'pins',
                                    caption: 'SLAM PROTOTYPE ON GROUND CART',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // secondary concept photo — bottom right, smaller
                                ...(imgConcept ? [{
                                    id: 'photo4',
                                    type: 'photo', src: imgConcept,
                                    x: 740, y: 1100,
                                    width: 400, height: 260,
                                    rotate: 4, pinStyle: 'tape',
                                    caption: 'CONCEPT: DROPPING BOMBS EN ROUTE',
                                    trigger: { wordText: 'hydrogen', occurrence: 1 },
                                }] : []),

                                // Top sticker — "DROP BOMBS, THEN CRASH"
                                {
                                    id: 's6',
                                    type: 'sticker', text: 'DROP BOMBS THEN CRASH',
                                    x: 540, y: 190,
                                    size: 64,
                                    color: '#ffffff', stroke: '#1a1a1a', bg: '#1a1a1a',
                                    rotate: -2,
                                    trigger: { wordText: 'drop', occurrence: 1 },
                                },

                                // "CONTAMINATE THE RUBBLE" — label, left side
                                {
                                    id: 'l5',
                                    type: 'label', text: 'crash into Moscow → contaminate rubble',
                                    size: 36, x: 260, y: 440,
                                    color: '#a93226', rotate: -2,
                                    trigger: { wordText: 'contaminate', occurrence: 1 },
                                },

                                // Arrow from label to the main photo
                                {
                                    id: 'arr2',
                                    type: 'arrow',
                                    x1: 300, y1: 480, x2: 540, y2: 540,
                                    color: '#a93226', curve: 50,
                                    trigger: { afterId: 'l5', offset: 0.2 },
                                },

                                // "CANCELED 1964" sticker — bottom left
                                {
                                    id: 's7',
                                    type: 'sticker', text: 'CANCELED 1964',
                                    x: 280, y: 1380,
                                    size: 66,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -2,
                                    trigger: { wordText: 'canceled', occurrence: 1 },
                                },

                                // "TOO HORRIFYING" label — bottom right
                                {
                                    id: 'l6',
                                    type: 'label', text: 'too horrifying to use',
                                    size: 42, x: 800, y: 1390,
                                    color: '#2e4053', rotate: 2,
                                    trigger: { afterId: 's7', offset: 0.2 },
                                },
                                {
                                    id: 'ul2',
                                    type: 'underline', target: 'l6', color: '#2e4053',
                                    trigger: { afterId: 'l6', offset: 0.4 },
                                },

                                // Subscribe icon — top right
                                {
                                    id: 'sub',
                                    type: 'icon', icon: 'mdi:bell-ring', size: 100,
                                    x: 940, y: 140,
                                    bg: 'circle', color: '#a93226',
                                    trigger: { wordText: 'subscribe', occurrence: 1 },
                                },

                                // Red string connecting the two photos
                                ...(imgTest && imgConcept ? [{
                                    id: 'str1',
                                    type: 'string',
                                    from: { target: 'photo3' },
                                    to: { target: 'photo4' },
                                    color: '#a93226', sag: 50,
                                    trigger: { afterId: 'photo4', offset: 0.3 },
                                }] : []),
                            ],
                        },
                    },
                ],
            },
        ],
    };
})();