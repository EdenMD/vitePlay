// config.sr71-blackbird.js
// "SR-71 Blackbird" — the fastest air-breathing aircraft ever built.
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
//   - "SR-71 Blackbird flight"
//   - "SR-71 Blackbird cockpit"
//   - "SR-71 Blackbird refueling"
//   - "SR-71 Blackbird afterburner"
//
// Run with:  VIDEO_CONFIG=config.sr71-blackbird.js node engine-ci.js

const https = require('https');
const http = require('http');

// ── Fetch one image from SerpAPI, return as base64 data URI or null ──
async function fetchImage(query, index = 0) {
    const key = process.env.SERPAPI_API_KEY;
    if (!key) {
        console.warn('[SR71Config] SERPAPI_API_KEY not set — skipping photo:', query);
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

        console.log(`[SR71Config] Downloading: ${pick.original.slice(0, 70)}`);
        const b64 = await urlToBase64(pick.original);
        if (!b64) return null;

        const mime = b64.startsWith('/9j/') || b64.startsWith('iVBOR') ? 'image/jpeg' : 'image/jpeg';
        return `data:${mime};base64,${b64}`;
    } catch (e) {
        console.warn(`[SR71Config] fetchImage failed for "${query}":`, e.message?.slice(0, 80));
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

// ── Main async config ────────────────────────────────────────────────────
module.exports = (async () => {

    console.log('[SR71Config] Pre-fetching images from SerpAPI...');

    // ── OPTIMIZED QUERIES ── short, visual, under 125 chars ──────────────
    const [imgFlight, imgCockpit, imgRefuel, imgAfterburner] = await Promise.all([
        fetchImage('SR-71 Blackbird flight', 0),
        fetchImage('SR-71 Blackbird cockpit', 0),
        fetchImage('SR-71 Blackbird refueling', 0),
        fetchImage('SR-71 Blackbird afterburner', 0),
    ]);

    console.log('[SR71Config] Images ready. Building config...');

    return {
        output: {
            title: 'sr71-blackbird-documentary',
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

            // ── Scene 1 — Hook: the fastest aircraft ever ───────────────────
            {
                tts: {
                    text: "The SR-71 Blackbird is the fastest air-breathing aircraft ever built. It flies at Mach three point two. It leaks fuel on the ground because the skin expands six inches at speed. The titanium was bought in secret from the Soviet Union.",
                    voice: 'bm_george',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=sr71-s1',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'SR-71 BLACKBIRD',
                            theme: {
                                paper: '#e8dfcd',
                                ink: '#1a1a1a',
                                accent: '#a93226',
                                accent2: '#1a5276',
                                shadow: 'rgba(20,16,10,0.38)',
                            },
                            commands: [
                                // Main flight photo — center
                                ...(imgFlight ? [{
                                    id: 'photo1',
                                    type: 'photo', src: imgFlight,
                                    x: 540, y: 520,
                                    width: 800, height: 440,
                                    rotate: -2, pinStyle: 'tape',
                                    caption: 'SR-71 BLACKBIRD — MACH 3.2',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // "MACH 3.2" sticker — top left
                                {
                                    id: 's1',
                                    type: 'sticker', text: 'MACH 3.2',
                                    x: 280, y: 180,
                                    size: 68,
                                    color: '#ffffff', stroke: '#1a5276', bg: '#1a5276',
                                    rotate: -2,
                                    trigger: { wordText: 'mach', occurrence: 1 },
                                },

                                // "LEAKS FUEL" sticker — top right
                                {
                                    id: 's2',
                                    type: 'sticker', text: 'LEAKS FUEL',
                                    x: 800, y: 180,
                                    size: 58,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 3,
                                    trigger: { wordText: 'leaks', occurrence: 1 },
                                },

                                // Label: expands 6 inches
                                {
                                    id: 'l1',
                                    type: 'label', text: 'skin expands 6 inches at speed',
                                    size: 38, x: 540, y: 280,
                                    color: '#a93226', rotate: 1,
                                    trigger: { wordText: 'expands', occurrence: 1 },
                                },

                                // Thermometer icon — left side
                                {
                                    id: 'i1',
                                    type: 'icon', icon: 'mdi:thermometer', size: 110,
                                    x: 160, y: 600,
                                    bg: 'circle', color: '#e67e22',
                                    trigger: { wordText: 'speed', occurrence: 1 },
                                },

                                // "TITANIUM FROM THE USSR" sticker — bottom
                                {
                                    id: 's3',
                                    type: 'sticker', text: 'TITANIUM FROM THE USSR',
                                    x: 540, y: 1320,
                                    size: 62,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: 1,
                                    trigger: { wordText: 'titanium', occurrence: 1 },
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

            // ── Scene 2 — The Engineering (Heat + Pressure) ────────────────
            {
                tts: {
                    text: "The engineers had to design for extreme heat. The cockpit windows reach six hundred degrees. The crew wears pressure suits. It couldn't turn sharply at speed. It just flew straight and fast.",
                    voice: 'bm_george',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=sr71-s2',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'EXTREME ENGINEERING',
                            theme: {
                                paper: '#e8dfcd',
                                ink: '#1a1a1a',
                                accent: '#a93226',
                                accent2: '#1a5276',
                                shadow: 'rgba(20,16,10,0.38)',
                            },
                            commands: [
                                // Cockpit photo — center
                                ...(imgCockpit ? [{
                                    id: 'photo2',
                                    type: 'photo', src: imgCockpit,
                                    x: 540, y: 560,
                                    width: 780, height: 460,
                                    rotate: 2, pinStyle: 'pins',
                                    caption: 'COCKPIT — 600°F WINDOWS',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // "600°F" sticker — top center
                                {
                                    id: 's4',
                                    type: 'sticker', text: '600°F WINDOWS',
                                    x: 540, y: 190,
                                    size: 60,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -1,
                                    trigger: { wordText: 'degrees', occurrence: 1 },
                                },

                                // Pressure suit icon + label — left side
                                {
                                    id: 'i2',
                                    type: 'icon', icon: 'mdi:astronaut', size: 120,
                                    x: 160, y: 480,
                                    bg: 'circle', color: '#1a5276',
                                    trigger: { wordText: 'pressure', occurrence: 1 },
                                },
                                {
                                    id: 'l2',
                                    type: 'label', text: 'pressure suits',
                                    size: 38, x: 160, y: 620,
                                    color: '#1a5276', rotate: -2,
                                    trigger: { afterId: 'i2', offset: 0.2 },
                                },

                                // "STRAIGHT AND FAST" sticker — bottom
                                {
                                    id: 's5',
                                    type: 'sticker', text: 'STRAIGHT AND FAST',
                                    x: 540, y: 1340,
                                    size: 64,
                                    color: '#ffffff', stroke: '#1a5276', bg: '#1a5276',
                                    rotate: 1,
                                    trigger: { wordText: 'straight', occurrence: 1 },
                                },

                                // Arrow pointing from sticker to cockpit photo
                                {
                                    id: 'arr1',
                                    type: 'arrow',
                                    x1: 540, y1: 1280, x2: 540, y2: 1020,
                                    color: '#a93226', curve: 20,
                                    trigger: { afterId: 's5', offset: 0.2 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 3 — The Mission / Legacy ─────────────────────────────
            {
                tts: {
                    text: "It flew over North Vietnam, the Korean DMZ, and the Soviet coast. Not a single one was ever shot down. It retired in nineteen ninety-eight. But its legacy lives on.",
                    voice: 'bm_george',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=sr71-s3',
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
                                accent2: '#1a5276',
                                shadow: 'rgba(20,16,10,0.38)',
                            },
                            commands: [
                                // Refueling photo — center top
                                ...(imgRefuel ? [{
                                    id: 'photo3',
                                    type: 'photo', src: imgRefuel,
                                    x: 540, y: 540,
                                    width: 780, height: 440,
                                    rotate: -3, pinStyle: 'tape',
                                    caption: 'AIR-TO-AIR REFUELING',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // Afterburner photo — bottom right, smaller
                                ...(imgAfterburner ? [{
                                    id: 'photo4',
                                    type: 'photo', src: imgAfterburner,
                                    x: 740, y: 1080,
                                    width: 420, height: 280,
                                    rotate: 4, pinStyle: 'pins',
                                    caption: 'AFTERBURNER GLOW',
                                    trigger: { wordText: 'shot', occurrence: 1 },
                                }] : []),

                                // "NEVER SHOT DOWN" sticker — top left
                                {
                                    id: 's6',
                                    type: 'sticker', text: 'NEVER SHOT DOWN',
                                    x: 280, y: 180,
                                    size: 62,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -2,
                                    trigger: { wordText: 'shot', occurrence: 1 },
                                },

                                // "RETIRED 1998" sticker — top right
                                {
                                    id: 's7',
                                    type: 'sticker', text: 'RETIRED 1998',
                                    x: 820, y: 190,
                                    size: 54,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 3,
                                    trigger: { wordText: 'retired', occurrence: 1 },
                                },

                                // Radar icon — left side
                                {
                                    id: 'i3',
                                    type: 'icon', icon: 'mdi:radar', size: 110,
                                    x: 160, y: 600,
                                    bg: 'circle', color: '#1a5276',
                                    trigger: { wordText: 'vietnam', occurrence: 1 },
                                },

                                // Label: "Overflights"
                                {
                                    id: 'l3',
                                    type: 'label', text: 'overflights: Vietnam, DMZ, Soviet coast',
                                    size: 34, x: 180, y: 730,
                                    color: '#1a5276', rotate: -1,
                                    trigger: { afterId: 'i3', offset: 0.2 },
                                },

                                // String connecting the two photos
                                ...(imgRefuel && imgAfterburner ? [{
                                    id: 'str1',
                                    type: 'string',
                                    from: { target: 'photo3' },
                                    to: { target: 'photo4' },
                                    color: '#a93226', sag: 50,
                                    trigger: { afterId: 'photo4', offset: 0.3 },
                                }] : []),

                                // Subscribe icon — top right corner
                                {
                                    id: 'sub',
                                    type: 'icon', icon: 'mdi:bell-ring', size: 100,
                                    x: 940, y: 140,
                                    bg: 'circle', color: '#a93226',
                                    trigger: { wordText: 'legacy', occurrence: 1 },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };
})();