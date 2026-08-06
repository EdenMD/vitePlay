// config.top3-expensive-guns.js  — v2 (pre-fetch all images)
// Uses the new slot system (no overlap) and photo commands with pre‑fetched
// base64 images. All SerpAPI calls happen here, not inside the template.
// Voice: am_adam. No beat/bgMusic.
//
// SLOT GRID REMINDER (3 cols × 6 rows):
//   top-left   top-center   top-right
//   mid-left   mid-center   mid-right
//   low-left   low-center   low-right
//   bot-left   bot-center   bot-right
//   deep-left  deep-center  deep-right
//   floor-left floor-center floor-right
//   + banner-top / banner-mid / banner-low / banner-bot (full-width)
//
// Each element owns one slot. Clash = auto-bumped to nearest free slot.
//
// RUN: VIDEO_CONFIG=config.top3-expensive-guns.js node engine-ci.js

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

    // Pre‑fetch all unique images (reused across scenes)
    const [
        imgPhalanx,
        imgVulcan,
        imgGau8,
        imgLambo,
        imgFerrari,
        imgJet,
        imgF16,
        imgF22,
        imgA10,
    ] = await Promise.all([
        fetchImage('Phalanx CIWS weapon system ship', 0),
        fetchImage('M61 Vulcan Gatling cannon 20mm', 0),
        fetchImage('A-10 Warthog GAU-8 Avenger cannon firing', 0),
        fetchImage('Lamborghini Huracan supercar yellow', 0),
        fetchImage('Ferrari 488 red sports car', 0),
        fetchImage('luxury private jet aircraft Gulfstream', 0),
        fetchImage('F-16 Fighting Falcon fighter jet', 0),
        fetchImage('F-22 Raptor stealth fighter jet', 0),
        fetchImage('A-10 Warthog attack aircraft', 0),
    ]);

    console.log('[GunsConfig] Images ready. Building config...');

    const commonTheme = {
        paper: '#e8dfcd', ink: '#1a1a1a',
        accent: '#a93226', accent2: '#1a5276',
        shadow: 'rgba(20,16,10,0.38)',
    };

    return {
        output: {
            title: 'top3-expensive-guns',
            format: 'portrait',
            fps: 30, crf: 23, preset: 'medium',
        },
        defaults: { voice: 'am_adam', transition: 'fade', transitionDuration: 0.35 },

        scenes: [

            // ── Scene 0 — HOOK ────────────────────────────────────────────
            {
                tts: {
                    text: "What if I told you firing these guns for one minute costs more than a Lamborghini, a Ferrari, or even a private jet? Here are the top three most expensive weapons to fire per minute.",
                    voice: 'am_adam', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=guns-hook',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]',
                        fps: 30, viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'MONEY VS FIREPOWER',
                            theme: commonTheme,
                            commands: [
                                // Hook sticker — full-width banner top
                                {
                                    id: 'hook1', type: 'sticker',
                                    text: 'COSTS MORE THAN\nA SUPERCAR?',
                                    slot: 'banner-top', size: 70,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: -1, trigger: { atSeconds: 0.1 },
                                },
                                // Lamborghini image — mid left, fires when narrator says it
                                {
                                    id: 'img_lambo', type: 'photo',
                                    src: imgLambo,
                                    slot: 'mid-left', width: 320, height: 220,
                                    caption: 'LAMBORGHINI', pinStyle: 'tape',
                                    trigger: { wordText: 'lamborghini', occurrence: 1 },
                                },
                                // Ferrari image — mid center
                                {
                                    id: 'img_ferrari', type: 'photo',
                                    src: imgFerrari,
                                    slot: 'mid-center', width: 320, height: 220,
                                    caption: 'FERRARI', pinStyle: 'tape',
                                    trigger: { wordText: 'ferrari', occurrence: 1 },
                                },
                                // Private jet image — mid right
                                {
                                    id: 'img_jet', type: 'photo',
                                    src: imgJet,
                                    slot: 'mid-right', width: 320, height: 220,
                                    caption: 'PRIVATE JET', pinStyle: 'tape',
                                    trigger: { wordText: 'private', occurrence: 1 },
                                },
                                // "TOP 3" sticker — bottom banner
                                {
                                    id: 'hook2', type: 'sticker', text: 'TOP 3 COUNTDOWN',
                                    slot: 'banner-bot', size: 72,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: 1,
                                    trigger: { wordText: 'top', occurrence: 1 },
                                },
                                {
                                    id: 'sc_hook', type: 'circle', target: 'hook2',
                                    color: '#a93226',
                                    trigger: { afterId: 'hook2', offset: 0.3 },
                                },
                                // Strings connecting the three car images
                                {
                                    id: 'str1', type: 'string',
                                    from: { target: 'img_lambo' }, to: { target: 'img_ferrari' },
                                    color: '#a93226', sag: 30,
                                    trigger: { afterId: 'img_ferrari', offset: 0.3 },
                                },
                                {
                                    id: 'str2', type: 'string',
                                    from: { target: 'img_ferrari' }, to: { target: 'img_jet' },
                                    color: '#a93226', sag: 30,
                                    trigger: { afterId: 'img_jet', offset: 0.3 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 1 — #3: Phalanx CIWS ($135k = Lamborghini) ─────────
            {
                tts: {
                    text: "Number three: the Phalanx CIWS. The Navy's last line of defense. Four thousand five hundred rounds per minute. Thirty dollars a round. One hundred and thirty-five thousand dollars per minute. The price of a Lamborghini, gone in sixty seconds.",
                    voice: 'am_adam', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=guns-s1',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]',
                        fps: 30, viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#3 — PHALANX CIWS',
                            theme: commonTheme,
                            commands: [
                                // Scene number — top left
                                {
                                    id: 'num1', type: 'sticker', text: '#3',
                                    slot: 'top-left', size: 90,
                                    color: '#ffffff', stroke: '#1a5276', bg: '#1a5276',
                                    rotate: -3, trigger: { atSeconds: 0.1 },
                                },
                                // Phalanx photo — top center/right
                                {
                                    id: 'photo1', type: 'photo',
                                    src: imgPhalanx,
                                    slot: 'top-center', width: 580, height: 360,
                                    rotate: -2, pinStyle: 'tape',
                                    caption: 'PHALANX CIWS',
                                    trigger: { wordText: 'phalanx', occurrence: 1 },
                                },
                                // "$30 per round" — mid left
                                {
                                    id: 's1', type: 'sticker', text: '$30\nPER ROUND',
                                    slot: 'mid-left', size: 56,
                                    color: '#ffffff', stroke: '#1a5276', bg: '#1a5276',
                                    rotate: -2,
                                    trigger: { wordText: 'thirty', occurrence: 1 },
                                },
                                // "4,500 RPM" — mid right
                                {
                                    id: 's2', type: 'sticker', text: '4,500\nRPM',
                                    slot: 'mid-right', size: 56,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 3,
                                    trigger: { wordText: 'thousand', occurrence: 1 },
                                },
                                // Arrow from round-cost to RPM (connecting the math)
                                {
                                    id: 'arr1', type: 'arrow',
                                    x1: 300, y1: 820, x2: 780, y2: 820,
                                    color: '#a93226', curve: 30,
                                    trigger: { afterId: 's2', offset: 0.2 },
                                },
                                // "= $135,000/MIN" — low center, big reveal
                                {
                                    id: 's3', type: 'sticker', text: '$135,000\nPER MINUTE',
                                    slot: 'low-center', size: 64,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -1,
                                    trigger: { wordText: 'thirty-five', occurrence: 1 },
                                },
                                {
                                    id: 'sc1', type: 'circle', target: 's3',
                                    color: '#a93226',
                                    trigger: { afterId: 's3', offset: 0.3 },
                                },
                                // Lamborghini image — bot left
                                {
                                    id: 'img_lambo1', type: 'photo',
                                    src: imgLambo,
                                    slot: 'bot-left', width: 340, height: 220,
                                    caption: '= 1 LAMBORGHINI', pinStyle: 'pins',
                                    trigger: { wordText: 'lamborghini', occurrence: 1 },
                                },
                                // String from cost sticker to car image
                                {
                                    id: 'str3', type: 'string',
                                    from: { target: 's3' }, to: { target: 'img_lambo1' },
                                    color: '#a93226', sag: 40,
                                    trigger: { afterId: 'img_lambo1', offset: 0.2 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 2 — #2: M61 Vulcan ($180k = Ferrari) ───────────────
            {
                tts: {
                    text: "Number two: the M61 Vulcan. The cannon on the F-16 and the F-22. Six thousand rounds per minute. One hundred and eighty thousand dollars per minute. A Ferrari. Sixty seconds. Gone.",
                    voice: 'am_adam', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=guns-s2',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]',
                        fps: 30, viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#2 — M61 VULCAN',
                            theme: commonTheme,
                            commands: [
                                // Scene number
                                {
                                    id: 'num2', type: 'sticker', text: '#2',
                                    slot: 'top-left', size: 90,
                                    color: '#ffffff', stroke: '#1a5276', bg: '#1a5276',
                                    rotate: -3, trigger: { atSeconds: 0.1 },
                                },
                                // Vulcan cannon photo — top center
                                {
                                    id: 'photo2', type: 'photo',
                                    src: imgVulcan,
                                    slot: 'top-center', width: 580, height: 360,
                                    rotate: 2, pinStyle: 'tape',
                                    caption: 'M61 VULCAN — 20mm GATLING',
                                    trigger: { wordText: 'vulcan', occurrence: 1 },
                                },
                                // F-16 image — fires when narrator says "F-16"
                                {
                                    id: 'img_f16', type: 'photo',
                                    src: imgF16,
                                    slot: 'mid-left', width: 320, height: 220,
                                    caption: 'F-16', pinStyle: 'tape',
                                    trigger: { wordText: 'f16', occurrence: 1 },
                                },
                                // F-22 image — fires when narrator says "F-22"
                                {
                                    id: 'img_f22', type: 'photo',
                                    src: imgF22,
                                    slot: 'mid-right', width: 320, height: 220,
                                    caption: 'F-22', pinStyle: 'tape',
                                    trigger: { wordText: 'f22', occurrence: 1 },
                                },
                                // String connecting the two jets
                                {
                                    id: 'str4', type: 'string',
                                    from: { target: 'img_f16' }, to: { target: 'img_f22' },
                                    color: '#1a5276', sag: 25,
                                    trigger: { afterId: 'img_f22', offset: 0.3 },
                                },
                                // 6000 RPM sticker
                                {
                                    id: 's5', type: 'sticker', text: '6,000 RPM',
                                    slot: 'low-left', size: 56,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: -2,
                                    trigger: { wordText: 'six', occurrence: 1 },
                                },
                                // Cost reveal
                                {
                                    id: 's6', type: 'sticker', text: '$180,000\nPER MINUTE',
                                    slot: 'low-center', size: 62,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -1,
                                    trigger: { wordText: 'eighty', occurrence: 1 },
                                },
                                {
                                    id: 'sc2', type: 'circle', target: 's6',
                                    color: '#a93226',
                                    trigger: { afterId: 's6', offset: 0.3 },
                                },
                                // Ferrari image — bot left
                                {
                                    id: 'img_ferrari1', type: 'photo',
                                    src: imgFerrari,
                                    slot: 'bot-left', width: 340, height: 220,
                                    caption: '= 1 FERRARI', pinStyle: 'pins',
                                    trigger: { wordText: 'ferrari', occurrence: 1 },
                                },
                                {
                                    id: 'str5', type: 'string',
                                    from: { target: 's6' }, to: { target: 'img_ferrari1' },
                                    color: '#a93226', sag: 35,
                                    trigger: { afterId: 'img_ferrari1', offset: 0.2 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 3 — #1: GAU-8 Avenger ($507k = Private Jet) ────────
            {
                tts: {
                    text: "And number one: the GAU-8 Avenger. The A-10 Warthog's main gun. Three thousand nine hundred rounds per minute, each round costing one hundred and thirty dollars. Over five hundred thousand dollars per minute. That's a private jet. Literally burning money.",
                    voice: 'am_adam', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=guns-s3',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]',
                        fps: 30, viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#1 — GAU-8 AVENGER',
                            theme: commonTheme,
                            commands: [
                                // Scene number
                                {
                                    id: 'num3', type: 'sticker', text: '#1',
                                    slot: 'top-left', size: 90,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -3, trigger: { atSeconds: 0.1 },
                                },
                                // GAU-8 / A-10 photo — top center
                                {
                                    id: 'photo3', type: 'photo',
                                    src: imgGau8,
                                    slot: 'top-center', width: 600, height: 380,
                                    rotate: -3, pinStyle: 'tape',
                                    caption: 'GAU-8 AVENGER — 30mm',
                                    trigger: { wordText: 'avenger', occurrence: 1 },
                                },
                                // A-10 image — fires when narrator says A-10 Warthog
                                {
                                    id: 'img_a10', type: 'photo',
                                    src: imgA10,
                                    slot: 'mid-left', width: 320, height: 200,
                                    caption: 'A-10 WARTHOG', pinStyle: 'tape',
                                    trigger: { wordText: 'warthog', occurrence: 1 },
                                },
                                // "$130/round" sticker
                                {
                                    id: 's7', type: 'sticker', text: '$130\nPER ROUND',
                                    slot: 'mid-right', size: 56,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: 2,
                                    trigger: { wordText: 'hundred and thirty', occurrence: 1 },
                                },
                                // "3,900 RPM"
                                {
                                    id: 's8', type: 'sticker', text: '3,900 RPM',
                                    slot: 'low-left', size: 54,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: -2,
                                    trigger: { wordText: 'three thousand', occurrence: 1 },
                                },
                                // Cost reveal — low center
                                {
                                    id: 's9', type: 'sticker', text: '$507,000\nPER MINUTE',
                                    slot: 'low-center', size: 62,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -1,
                                    trigger: { wordText: 'five hundred', occurrence: 1 },
                                },
                                {
                                    id: 'sc3', type: 'circle', target: 's9',
                                    color: '#a93226',
                                    trigger: { afterId: 's9', offset: 0.3 },
                                },
                                // Private jet image — bot left
                                {
                                    id: 'img_pjet', type: 'photo',
                                    src: imgJet,
                                    slot: 'bot-left', width: 340, height: 220,
                                    caption: '= 1 PRIVATE JET', pinStyle: 'pins',
                                    trigger: { wordText: 'private', occurrence: 1 },
                                },
                                {
                                    id: 'str6', type: 'string',
                                    from: { target: 's9' }, to: { target: 'img_pjet' },
                                    color: '#a93226', sag: 38,
                                    trigger: { afterId: 'img_pjet', offset: 0.2 },
                                },
                                // "LITERALLY BURNING MONEY" draw preset — bot right
                                {
                                    id: 'fire1', type: 'draw', preset: 'moneyBurn',
                                    slot: 'bot-right', scale: 1.2, color: '#e67e22',
                                    fillAfter: true,
                                    trigger: { wordText: 'burning', occurrence: 1 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 4 — CTA ─────────────────────────────────────────────
            {
                tts: {
                    text: "Subscribe for more.",
                    voice: 'am_adam', pauseAfter: 0.2,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=guns-cta',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]',
                        fps: 30, viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'SUBSCRIBE',
                            theme: commonTheme,
                            commands: [
                                {
                                    id: 'cta1', type: 'sticker', text: '🔔 SUBSCRIBE\nFOR MORE',
                                    slot: 'banner-mid', size: 88,
                                    color: '#ffffff', stroke: '#1a5276', bg: '#1a5276',
                                    rotate: 0, trigger: { atSeconds: 0.1 },
                                },
                                {
                                    id: 'sc_cta', type: 'circle', target: 'cta1',
                                    color: '#1a5276',
                                    trigger: { afterId: 'cta1', offset: 0.3 },
                                },
                                {
                                    id: 'bell1', type: 'icon', icon: 'mdi:bell-ring',
                                    size: 130, slot: 'low-center',
                                    bg: 'circle', color: '#1a5276',
                                    trigger: { afterId: 'cta1', offset: 0.2 },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };
})();