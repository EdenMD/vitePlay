// config.top3-expensive-guns.js
// "Top 3 Most Expensive Guns to Fire Per Minute"
// 4 scenes: #3 → #2 → #1 → FINAL CTA.
// REAL PHOTOS: Platform (destroyer/F-16/A-10), Gun, Luxury (Lambo/Ferrari/Jet).
// Voice: am_adam.
// Each visual appears, then fades/erases after a few seconds to keep the scene tidy.
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

    // ── Platform photos ──────────────────────────────────────────────────
    const [imgDestroyer, imgF16, imgA10Full] = await Promise.all([
        fetchImage('Arleigh Burke destroyer ship', 0),
        fetchImage('F-16 fighter jet flying', 0),
        fetchImage('A-10 Warthog aircraft', 0),
    ]);

    // ── Gun photos ──────────────────────────────────────────────────────
    const [imgPhalanx, imgVulcan, imgGau8] = await Promise.all([
        fetchImage('Phalanx CIWS firing ship', 0),
        fetchImage('M61 Vulcan cannon mounted', 0),
        fetchImage('A-10 Warthog GAU-8 firing', 0),
    ]);

    // ── Luxury photos ──────────────────────────────────────────────────
    const [imgLambo, imgFerrari, imgJet] = await Promise.all([
        fetchImage('Lamborghini Aventador front view', 0),
        fetchImage('Ferrari SF90 front view', 0),
        fetchImage('private jet landing', 0),
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
            voice: 'am_adam',
            transition: 'fade',
            transitionDuration: 0.35,
        },

        scenes: [

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
                                // ── STEP 1: Show DESTROYER (platform) ──
                                ...(imgDestroyer ? [{
                                    id: 'photo_destroyer',
                                    type: 'photo', src: imgDestroyer,
                                    x: 540, y: 480,
                                    width: 760, height: 400,
                                    rotate: -2, pinStyle: 'tape',
                                    caption: 'U.S. NAVY DESTROYER — PHALANX MOUNTED',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // ── Sticker: "NAVY'S LAST LINE" ──
                                {
                                    id: 's_platform1',
                                    type: 'sticker', text: 'NAVY CLOSE-IN WEAPON',
                                    x: 540, y: 180,
                                    size: 44,
                                    color: '#ffffff', stroke: '#1a5276', bg: '#1a5276',
                                    rotate: 0,
                                    trigger: { wordText: 'Navy', occurrence: 1 },
                                },

                                // ── Fade destroyer after 2 seconds ──
                                {
                                    id: 'fade_destroyer',
                                    type: 'fadeGroup',
                                    targets: ['photo_destroyer', 's_platform1'],
                                    opacity: 0,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_destroyer', offset: 2.0 },
                                },

                                // ── STEP 2: Show PHALANX GUN ──
                                ...(imgPhalanx ? [{
                                    id: 'photo_phalanx',
                                    type: 'photo', src: imgPhalanx,
                                    x: 540, y: 480,
                                    width: 760, height: 400,
                                    rotate: 1, pinStyle: 'pins',
                                    caption: 'PHALANX CIWS — 4,500 RPM',
                                    trigger: { afterId: 'fade_destroyer', offset: 0.2 },
                                }] : []),

                                // ── "$30/ROUND" sticker ──
                                {
                                    id: 's1',
                                    type: 'sticker', text: '$30 PER ROUND',
                                    x: 280, y: 180,
                                    size: 44,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -2,
                                    trigger: { wordText: 'thirty', occurrence: 1 },
                                },

                                // ── "4,500 RPM" sticker ──
                                {
                                    id: 's2',
                                    type: 'sticker', text: '4,500 RPM',
                                    x: 820, y: 190,
                                    size: 44,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 3,
                                    trigger: { wordText: 'thousand', occurrence: 1 },
                                },

                                // ── Fade Phalanx gun after 2 seconds ──
                                {
                                    id: 'fade_phalanx',
                                    type: 'fadeGroup',
                                    targets: ['photo_phalanx', 's1', 's2'],
                                    opacity: 0,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_phalanx', offset: 2.0 },
                                },

                                // ── STEP 3: Show LAMBORGHINI ──
                                ...(imgLambo ? [{
                                    id: 'photo_lambo',
                                    type: 'photo', src: imgLambo,
                                    x: 540, y: 480,
                                    width: 760, height: 400,
                                    rotate: 2, pinStyle: 'tape',
                                    caption: '1 LAMBORGHINI = $135,000',
                                    trigger: { afterId: 'fade_phalanx', offset: 0.2 },
                                }] : []),

                                // ── Cost sticker "$135k" ──
                                {
                                    id: 's3',
                                    type: 'sticker', text: '$135,000 / MIN',
                                    x: 540, y: 920,
                                    size: 48,
                                    color: '#ffffff', stroke: '#f1c40f', bg: '#f1c40f',
                                    rotate: 0,
                                    trigger: { afterId: 'photo_lambo', offset: 0.2 },
                                },

                                // ── Circle around the cost sticker ──
                                {
                                    id: 'sc1',
                                    type: 'circle', target: 's3', color: '#f1c40f',
                                    trigger: { afterId: 's3', offset: 0.2 },
                                },

                                // ── Fade Lamborghini and cost after 3s ──
                                {
                                    id: 'fade_lambo',
                                    type: 'fadeGroup',
                                    targets: ['photo_lambo', 's3', 'sc1'],
                                    opacity: 0,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_lambo', offset: 3.0 },
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
                                // ── STEP 1: Show F-16 (platform) ──
                                ...(imgF16 ? [{
                                    id: 'photo_f16',
                                    type: 'photo', src: imgF16,
                                    x: 540, y: 480,
                                    width: 760, height: 400,
                                    rotate: 2, pinStyle: 'tape',
                                    caption: 'F-16 FIGHTING FALCON — VULCAN MOUNTED',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // ── Sticker: "FIGHTER JET" ──
                                {
                                    id: 's_platform2',
                                    type: 'sticker', text: 'F-16 / F-22 / F-15',
                                    x: 540, y: 180,
                                    size: 40,
                                    color: '#ffffff', stroke: '#1a5276', bg: '#1a5276',
                                    rotate: 0,
                                    trigger: { wordText: 'F-16', occurrence: 1 },
                                },

                                // ── Fade F-16 after 2s ──
                                {
                                    id: 'fade_f16',
                                    type: 'fadeGroup',
                                    targets: ['photo_f16', 's_platform2'],
                                    opacity: 0,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_f16', offset: 2.0 },
                                },

                                // ── STEP 2: Show VULCAN GUN ──
                                ...(imgVulcan ? [{
                                    id: 'photo_vulcan',
                                    type: 'photo', src: imgVulcan,
                                    x: 540, y: 480,
                                    width: 760, height: 400,
                                    rotate: -1, pinStyle: 'pins',
                                    caption: 'M61 VULCAN — 6,000 RPM',
                                    trigger: { afterId: 'fade_f16', offset: 0.2 },
                                }] : []),

                                // ── "$30/ROUND" sticker ──
                                {
                                    id: 's5',
                                    type: 'sticker', text: '$30 PER ROUND',
                                    x: 280, y: 180,
                                    size: 44,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -2,
                                    trigger: { wordText: 'thirty-dollar', occurrence: 1 },
                                },

                                // ── "6,000 RPM" sticker ──
                                {
                                    id: 's6',
                                    type: 'sticker', text: '6,000 RPM',
                                    x: 820, y: 190,
                                    size: 44,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 3,
                                    trigger: { wordText: 'six thousand', occurrence: 1 },
                                },

                                // ── Fade Vulcan after 2s ──
                                {
                                    id: 'fade_vulcan',
                                    type: 'fadeGroup',
                                    targets: ['photo_vulcan', 's5', 's6'],
                                    opacity: 0,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_vulcan', offset: 2.0 },
                                },

                                // ── STEP 3: Show FERRARI ──
                                ...(imgFerrari ? [{
                                    id: 'photo_ferrari',
                                    type: 'photo', src: imgFerrari,
                                    x: 540, y: 480,
                                    width: 760, height: 400,
                                    rotate: 2, pinStyle: 'tape',
                                    caption: '1 FERRARI = $180,000',
                                    trigger: { afterId: 'fade_vulcan', offset: 0.2 },
                                }] : []),

                                // ── Cost sticker "$180k" ──
                                {
                                    id: 's7',
                                    type: 'sticker', text: '$180,000 / MIN',
                                    x: 540, y: 920,
                                    size: 48,
                                    color: '#ffffff', stroke: '#e74c3c', bg: '#e74c3c',
                                    rotate: 0,
                                    trigger: { afterId: 'photo_ferrari', offset: 0.2 },
                                },

                                // ── Circle ──
                                {
                                    id: 'sc2',
                                    type: 'circle', target: 's7', color: '#e74c3c',
                                    trigger: { afterId: 's7', offset: 0.2 },
                                },

                                // ── Fade Ferrari and cost after 3s ──
                                {
                                    id: 'fade_ferrari',
                                    type: 'fadeGroup',
                                    targets: ['photo_ferrari', 's7', 'sc2'],
                                    opacity: 0,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_ferrari', offset: 3.0 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 3 — #1: GAU-8 Avenger ($507k = Private Jet) ──────────
            {
                tts: {
                    text: "And number one: the GAU-8 Avenger. The A-10 Warthog's main gun. Fires three thousand nine hundred rounds per minute, each costing one hundred and thirty dollars. That's over five hundred thousand dollars per minute. That's a private jet. Literally burning money.",
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
                                // ── STEP 1: Show A-10 (platform) ──
                                ...(imgA10Full ? [{
                                    id: 'photo_a10',
                                    type: 'photo', src: imgA10Full,
                                    x: 540, y: 480,
                                    width: 760, height: 400,
                                    rotate: -1, pinStyle: 'tape',
                                    caption: 'A-10 WARTHOG — BUILT AROUND THE GUN',
                                    trigger: { atSeconds: 0.2 },
                                }] : []),

                                // ── Sticker: "A-10 WARTHOG" ──
                                {
                                    id: 's_platform3',
                                    type: 'sticker', text: 'A-10 WARTHOG',
                                    x: 540, y: 180,
                                    size: 44,
                                    color: '#ffffff', stroke: '#1a5276', bg: '#1a5276',
                                    rotate: 0,
                                    trigger: { wordText: 'A-10', occurrence: 1 },
                                },

                                // ── Fade A-10 after 2s ──
                                {
                                    id: 'fade_a10',
                                    type: 'fadeGroup',
                                    targets: ['photo_a10', 's_platform3'],
                                    opacity: 0,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_a10', offset: 2.0 },
                                },

                                // ── STEP 2: Show GAU-8 GUN ──
                                ...(imgGau8 ? [{
                                    id: 'photo_gau8',
                                    type: 'photo', src: imgGau8,
                                    x: 540, y: 480,
                                    width: 760, height: 400,
                                    rotate: 2, pinStyle: 'pins',
                                    caption: 'GAU-8 AVENGER — 3,900 RPM',
                                    trigger: { afterId: 'fade_a10', offset: 0.2 },
                                }] : []),

                                // ── "$130/ROUND" sticker ──
                                {
                                    id: 's9',
                                    type: 'sticker', text: '$130 PER ROUND',
                                    x: 280, y: 180,
                                    size: 44,
                                    color: '#ffffff', stroke: '#a93226', bg: '#a93226',
                                    rotate: -2,
                                    trigger: { wordText: 'hundred and thirty', occurrence: 1 },
                                },

                                // ── "3,900 RPM" sticker ──
                                {
                                    id: 's10',
                                    type: 'sticker', text: '3,900 RPM',
                                    x: 820, y: 190,
                                    size: 44,
                                    color: '#1a1a1a', stroke: '#ffffff',
                                    rotate: 3,
                                    trigger: { wordText: 'three thousand nine hundred', occurrence: 1 },
                                },

                                // ── "30mm depleted uranium" label ──
                                {
                                    id: 'l1',
                                    type: 'label', text: '30mm depleted uranium rounds',
                                    size: 30, x: 180, y: 400,
                                    color: '#1a5276', rotate: -2,
                                    trigger: { wordText: 'millimeter', occurrence: 1 },
                                },

                                // ── Fade GAU-8 after 2s ──
                                {
                                    id: 'fade_gau8',
                                    type: 'fadeGroup',
                                    targets: ['photo_gau8', 's9', 's10', 'l1'],
                                    opacity: 0,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_gau8', offset: 2.0 },
                                },

                                // ── STEP 3: Show PRIVATE JET PHOTO (BIGGER, LONGER) ──
                                ...(imgJet ? [{
                                    id: 'photo_jet',
                                    type: 'photo', src: imgJet,
                                    x: 540, y: 490,
                                    width: 840,
                                    height: 420,
                                    rotate: 1, pinStyle: 'tape',
                                    caption: '1 PRIVATE JET = $507,000',
                                    trigger: { afterId: 'fade_gau8', offset: 0.2 },
                                }] : []),

                                // ── Cost sticker — SMALLER, moved down ──
                                {
                                    id: 's11',
                                    type: 'sticker', text: '$507,000 / MIN',
                                    x: 540, y: 940,
                                    size: 42,
                                    color: '#ffffff', stroke: '#34495e', bg: '#34495e',
                                    rotate: 0,
                                    trigger: { afterId: 'photo_jet', offset: 0.2 },
                                },

                                // ── Circle around cost ──
                                {
                                    id: 'sc3',
                                    type: 'circle', target: 's11', color: '#34495e',
                                    trigger: { afterId: 's11', offset: 0.2 },
                                },

                                // ── Erase Private Jet AFTER 3.5 seconds ──
                                {
                                    id: 'erase_jet',
                                    type: 'erase',
                                    target: 'photo_jet',
                                    trigger: { afterId: 'photo_jet', offset: 3.5 },
                                },

                                // ── Erase cost sticker after jet is erased ──
                                {
                                    id: 'erase_cost3',
                                    type: 'erase',
                                    target: 's11',
                                    trigger: { afterId: 'erase_jet', offset: 0.2 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 4 — FINAL CTA SCENE ──────────────────────────────────────
            {
                tts: {
                    text: "Subscribe for more.",
                    voice: 'am_adam',
                    pauseAfter: 0.2,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=guns-cta',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'SUBSCRIBE',
                            theme: {
                                paper: '#e8dfcd',
                                ink: '#1a1a1a',
                                accent: '#a93226',
                                accent2: '#1a5276',
                                shadow: 'rgba(20,16,10,0.38)',
                            },
                            commands: [
                                // ── GIANT CTA STICKER ──
                                {
                                    id: 'cta_final',
                                    type: 'sticker', text: '🔔 SUBSCRIBE FOR MORE',
                                    x: 540, y: 820,
                                    size: 86,
                                    color: '#ffffff', stroke: '#1a5276', bg: '#1a5276',
                                    rotate: 0,
                                    trigger: { atSeconds: 0.1 },
                                },

                                // ── Circle scribble AROUND the CTA ──
                                {
                                    id: 'sc_cta_final',
                                    type: 'circle', target: 'cta_final', color: '#1a5276',
                                    trigger: { afterId: 'cta_final', offset: 0.3 },
                                },

                                // ── Bell icon RIGHT NEXT to the sticker ──
                                {
                                    id: 'bell_final',
                                    type: 'icon', icon: 'mdi:bell-ring', size: 110,
                                    x: 880, y: 820,
                                    bg: 'circle', color: '#1a5276',
                                    trigger: { afterId: 'cta_final', offset: 0.1 },
                                },

                                // ── Second circle around the bell ──
                                {
                                    id: 'sc_bell',
                                    type: 'circle', target: 'bell_final', color: '#1a5276',
                                    trigger: { afterId: 'bell_final', offset: 0.2 },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };
})();