// config.top3-expensive-guns.js
// "Top 3 Most Expensive Guns to Fire Per Minute"
// Countdown format: #3 Phalanx CIWS → #2 M61 Vulcan → #1 GAU-8 Avenger
// WITH ANALOGIES: Lamborghini, Ferrari, Private Jet.
// Voice: am_adam (finance/money authority voice).
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
//   - "Phalanx CIWS firing"
//   - "M61 Vulcan cannon"
//   - "A-10 Warthog GAU-8"
//
// Run with:  VIDEO_CONFIG=config.top3-expensive-guns.js node engine-ci.js

const https = require('https');
const http = require('http');

// ── Fetch one image from SerpAPI, return as base64 data URI or null ──
async function fetchImage(query, index = 0) {
    const key = process.env.SERPAPI_API_KEY;
    if (!key) {
        console.warn('[GunsConfig] SERPAPI_API_KEY not set — skipping photo:', query);
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

        console.log(`[GunsConfig] Downloading: ${pick.original.slice(0, 70)}`);
        const b64 = await urlToBase64(pick.original);
        if (!b64) return null;

        const mime = b64.startsWith('/9j/') || b64.startsWith('iVBOR') ? 'image/jpeg' : 'image/jpeg';
        return `data:${mime};base64,${b64}`;
    } catch (e) {
        console.warn(`[GunsConfig] fetchImage failed for "${query}":`, e.message?.slice(0, 80));
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

    console.log('[GunsConfig] Pre-fetching images from SerpAPI...');

    // ── OPTIMIZED QUERIES ── short, visual, under 125 chars ──────────────
    const [imgPhalanx, imgVulcan, imgA10] = await Promise.all([
        fetchImage('Phalanx CIWS firing', 0),
        fetchImage('M61 Vulcan cannon', 0),
        fetchImage('A-10 Warthog GAU-8', 0),
    ]);

    console.log('[GunsConfig] Images ready. Building config...');

    return {
        output: {
            title: 'top3-expensive-guns',
            format: 'portrait',
            fps: 30,
            crf: 23,
            preset: 'medium',
        },

        defaults: {
            voice: 'am_adam', // ← FINANCE / MONEY AUTHORITY VOICE
            transition: 'fade',
            transitionDuration: 0.35,
        },

        scenes: [

            // ── Scene 0 — HOOK: What if a gun costs more than a Lamborghini? ──
            {
                tts: {
                    text: "What if I told you a single minute of firing these guns could cost you a Lamborghini, a Ferrari, or even a private jet? Stay tuned for the top three most expensive weapons to fire.",
                    voice: 'am_adam',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=guns-hook',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'MONEY VS FIREPOWER',
                            theme: {
                                paper: '#e8dfcd',
                                ink: '#1a1a1a',
                                accent: '#a93226',
                                accent2: '#1a5276',
                                shadow: 'rgba(20,16,10,0.38)',
                            },
                            commands: [
                                // Big hook sticker — center
                                {
                                    id: 'hook1',
                                    type: 'sticker', text: 'WHAT IF A GUN COSTS MORE THAN A LAMBORGHINI?',
                                    x: 540, y: 400,
                                    size: 60,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: -1,
                                    trigger: { atSeconds: 0.1 },
                                },

                                // Lamborghini icon — left
                                {
                                    id: 'i_hook1',
                                    type: 'icon', icon: 'mdi:car-sports', size: 120,
                                    x: 200, y: 700,
                                    bg: 'circle', color: '#f1c40f',
                                    trigger: { wordText: 'Lamborghini', occurrence: 1 },
                                },

                                // Ferrari icon — center
                                {
                                    id: 'i_hook2',
                                    type: 'icon', icon: 'mdi:car-sports', size: 120,
                                    x: 540, y: 700,
                                    bg: 'circle', color: '#e74c3c',
                                    trigger: { wordText: 'Ferrari', occurrence: 1 },
                                },

                                // Private Jet icon — right
                                {
                                    id: 'i_hook3',
                                    type: 'icon', icon: 'mdi:airplane', size: 120,
                                    x: 880, y: 700,
                                    bg: 'circle', color: '#7f8c8d',
                                    trigger: { wordText: 'private jet', occurrence: 1 },
                                },

                                // Bottom sticker: "TOP 3 COUNTDOWN"
                                {
                                    id: 'hook2',
                                    type: 'sticker', text: 'TOP 3 COUNTDOWN',
                                    x: 540, y: 1100,
                                    size: 72,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: 1,
                                    trigger: { wordText: 'top', occurrence: 1 },
                                },
                                {
                                    id: 'sc_hook',
                                    type: 'circle', target: 'hook2', color: '#a93226',
                                    trigger: { afterId: 'hook2', offset: 0.3 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 1 — #3: Phalanx CIWS ($135k = Lamborghini) ──────────
            {
                tts: {
                    text: "Number three: the Phalanx CIWS. The Navy's last line of defense. It fires four thousand five hundred rounds per minute. Each round costs thirty dollars. That's one hundred and thirty-five thousand dollars per minute. That's the price of a brand new Lamborghini, burned in sixty seconds.",
                    voice: 'am_adam',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=guns-s1',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#3 — PHALANX CIWS',
                            theme: {
                                paper: '#e8dfcd',
                                ink: '#1a1a1a',
                                accent: '#a93226',
                                accent2: '#1a5276',
                                shadow: 'rgba(20,16,10,0.38)',
                            },
                            commands: [
                                // Main photo — center
                                ...(imgPhalanx ? [{
                                    id: 'photo1',
                                    type: 'photo', src: imgPhalanx,
                                    x: 540, y: 480,
                                    width: 760, height: 380,
                                    rotate: -2, pinStyle: 'tape',
                                    caption: 'PHALANX CIWS — NAVY CLOSE-IN WEAPON SYSTEM',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // Top sticker — "$30/ROUND"
                                {
                                    id: 's1',
                                    type: 'sticker', text: '$30 PER ROUND',
                                    x: 280, y: 180,
                                    size: 52,
                                    color: '#ffffff', stroke: '#1a5276', bg: '#1a5276',
                                    rotate: -2,
                                    trigger: { wordText: 'thirty', occurrence: 1 },
                                },

                                // Top right — "4,500 RPM"
                                {
                                    id: 's2',
                                    type: 'sticker', text: '4,500 RPM',
                                    x: 820, y: 190,
                                    size: 52,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 3,
                                    trigger: { wordText: 'thousand', occurrence: 1 },
                                },

                                // Cost sticker — $135,000 / MIN (left side of analogy row)
                                {
                                    id: 's3',
                                    type: 'sticker', text: '$135,000 / MIN',
                                    x: 220, y: 920,
                                    size: 54,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -2,
                                    trigger: { wordText: 'thirty-five', occurrence: 1 },
                                },

                                // Equals sign sticker
                                {
                                    id: 'eq1',
                                    type: 'sticker', text: '=',
                                    x: 420, y: 920,
                                    size: 54,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 0,
                                    trigger: { afterId: 's3', offset: 0.1 },
                                },

                                // Lamborghini analogy sticker
                                {
                                    id: 's4',
                                    type: 'sticker', text: '1 LAMBORGHINI',
                                    x: 620, y: 920,
                                    size: 50,
                                    color: '#ffffff', stroke: '#f1c40f', bg: '#f1c40f',
                                    rotate: 2,
                                    trigger: { wordText: 'Lamborghini', occurrence: 1 },
                                },

                                // Lamborghini icon
                                {
                                    id: 'i1',
                                    type: 'icon', icon: 'mdi:car-sports', size: 80,
                                    x: 860, y: 920,
                                    bg: 'circle', color: '#f1c40f',
                                    trigger: { afterId: 's4', offset: 0.1 },
                                },

                                // Circle around the cost row
                                {
                                    id: 'sc1',
                                    type: 'circle', target: 's3', color: '#a93226',
                                    trigger: { afterId: 's3', offset: 0.3 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 2 — #2: M61 Vulcan ($180k = Ferrari) ─────────────────
            {
                tts: {
                    text: "Number two: the M61 Vulcan. Found on the F-16 and F-22. It fires six thousand rounds per minute. One hundred and eighty thousand dollars per minute. That's a Ferrari. Gone in sixty seconds.",
                    voice: 'am_adam',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=guns-s2',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#2 — M61 VULCAN',
                            theme: {
                                paper: '#e8dfcd',
                                ink: '#1a1a1a',
                                accent: '#a93226',
                                accent2: '#1a5276',
                                shadow: 'rgba(20,16,10,0.38)',
                            },
                            commands: [
                                // Main photo — center
                                ...(imgVulcan ? [{
                                    id: 'photo2',
                                    type: 'photo', src: imgVulcan,
                                    x: 540, y: 480,
                                    width: 760, height: 380,
                                    rotate: 2, pinStyle: 'pins',
                                    caption: 'M61 VULCAN — 20mm GATLING CANNON',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // Top sticker — "$30/ROUND"
                                {
                                    id: 's5',
                                    type: 'sticker', text: '$30 PER ROUND',
                                    x: 280, y: 180,
                                    size: 52,
                                    color: '#ffffff', stroke: '#1a5276', bg: '#1a5276',
                                    rotate: -2,
                                    trigger: { wordText: 'thirty-dollar', occurrence: 1 },
                                },

                                // Top right — "6,000 RPM"
                                {
                                    id: 's6',
                                    type: 'sticker', text: '6,000 RPM',
                                    x: 820, y: 190,
                                    size: 52,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 3,
                                    trigger: { wordText: 'six thousand', occurrence: 1 },
                                },

                                // Cost sticker — $180,000 / MIN
                                {
                                    id: 's7',
                                    type: 'sticker', text: '$180,000 / MIN',
                                    x: 220, y: 920,
                                    size: 54,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -2,
                                    trigger: { wordText: 'eighty thousand', occurrence: 1 },
                                },

                                // Equals sign
                                {
                                    id: 'eq2',
                                    type: 'sticker', text: '=',
                                    x: 420, y: 920,
                                    size: 54,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 0,
                                    trigger: { afterId: 's7', offset: 0.1 },
                                },

                                // Ferrari analogy sticker
                                {
                                    id: 's8',
                                    type: 'sticker', text: '1 FERRARI',
                                    x: 620, y: 920,
                                    size: 50,
                                    color: '#ffffff', stroke: '#e74c3c', bg: '#e74c3c',
                                    rotate: 2,
                                    trigger: { wordText: 'Ferrari', occurrence: 1 },
                                },

                                // Ferrari icon (using sports car with red color)
                                {
                                    id: 'i2',
                                    type: 'icon', icon: 'mdi:car-sports', size: 80,
                                    x: 860, y: 920,
                                    bg: 'circle', color: '#e74c3c',
                                    trigger: { afterId: 's8', offset: 0.1 },
                                },

                                // Circle around cost row
                                {
                                    id: 'sc2',
                                    type: 'circle', target: 's7', color: '#a93226',
                                    trigger: { afterId: 's7', offset: 0.3 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 3 — #1: GAU-8 Avenger ($507k = Private Jet) ──────────
            {
                tts: {
                    text: "And number one: the GAU-8 Avenger. The A-10 Warthog's main gun. Fires three thousand nine hundred rounds per minute, each costing one hundred and thirty dollars. That's over five hundred thousand dollars per minute. That's a private jet. Literally burning money. Subscribe for more.",
                    voice: 'am_adam',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=guns-s3',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#1 — GAU-8 AVENGER',
                            theme: {
                                paper: '#e8dfcd',
                                ink: '#1a1a1a',
                                accent: '#a93226',
                                accent2: '#1a5276',
                                shadow: 'rgba(20,16,10,0.38)',
                            },
                            commands: [
                                // Main photo — center (slightly bigger)
                                ...(imgA10 ? [{
                                    id: 'photo3',
                                    type: 'photo', src: imgA10,
                                    x: 540, y: 460,
                                    width: 800, height: 400,
                                    rotate: -3, pinStyle: 'tape',
                                    caption: 'GAU-8 AVENGER — 30mm DEPLETED URANIUM',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // Top left — "$130/ROUND"
                                {
                                    id: 's9',
                                    type: 'sticker', text: '$130 PER ROUND',
                                    x: 280, y: 180,
                                    size: 54,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -2,
                                    trigger: { wordText: 'hundred and thirty', occurrence: 1 },
                                },

                                // Top right — "3,900 RPM"
                                {
                                    id: 's10',
                                    type: 'sticker', text: '3,900 RPM',
                                    x: 820, y: 190,
                                    size: 54,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 3,
                                    trigger: { wordText: 'three thousand nine hundred', occurrence: 1 },
                                },

                                // "30mm DEPLETED URANIUM" label
                                {
                                    id: 'l1',
                                    type: 'label', text: '30mm depleted uranium rounds',
                                    size: 34, x: 180, y: 400,
                                    color: '#1a5276', rotate: -2,
                                    trigger: { wordText: 'millimeter', occurrence: 1 },
                                },

                                // Cost sticker — $507,000 / MIN
                                {
                                    id: 's11',
                                    type: 'sticker', text: '$507,000 / MIN',
                                    x: 200, y: 920,
                                    size: 58,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -2,
                                    trigger: { wordText: 'five hundred thousand', occurrence: 1 },
                                },

                                // Equals sign
                                {
                                    id: 'eq3',
                                    type: 'sticker', text: '=',
                                    x: 430, y: 920,
                                    size: 58,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 0,
                                    trigger: { afterId: 's11', offset: 0.1 },
                                },

                                // Private Jet analogy sticker
                                {
                                    id: 's12',
                                    type: 'sticker', text: '1 PRIVATE JET',
                                    x: 650, y: 920,
                                    size: 52,
                                    color: '#ffffff', stroke: '#34495e', bg: '#34495e',
                                    rotate: 2,
                                    trigger: { wordText: 'private jet', occurrence: 1 },
                                },

                                // Private Jet icon
                                {
                                    id: 'i3',
                                    type: 'icon', icon: 'mdi:airplane', size: 85,
                                    x: 880, y: 920,
                                    bg: 'circle', color: '#7f8c8d',
                                    trigger: { afterId: 's12', offset: 0.1 },
                                },

                                // Circle around cost row
                                {
                                    id: 'sc3',
                                    type: 'circle', target: 's11', color: '#a93226',
                                    trigger: { afterId: 's11', offset: 0.3 },
                                },

                                // Subscribe icon — top right corner
                                {
                                    id: 'sub',
                                    type: 'icon', icon: 'mdi:bell-ring', size: 100,
                                    x: 940, y: 140,
                                    bg: 'circle', color: '#a93226',
                                    trigger: { wordText: 'subscribe', occurrence: 1 },
                                },

                                // Red string connecting photo to cost row
                                {
                                    id: 'str1',
                                    type: 'string',
                                    from: { target: 'photo3' },
                                    to: { target: 's11' },
                                    color: '#a93226', sag: 30,
                                    trigger: { afterId: 'photo3', offset: 0.5 },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };
})();