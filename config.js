// config.ohio-class-submarine.js
// "Ohio Class — The Most Overpowered Underwater Hotel Ever Built"
// 4 scenes: Hook → The Submarine → The Missiles → CTA
// Full-canvas visuals, blur after 2.5 seconds, word triggers.
// Voice: am_fenrir (deep, dramatic, playful).
// ANALOGIES: Submarine = 2 skyscrapers, 18,000 tons = 18 million goldfish, etc.
//
// ROBUST IMAGE FETCHING: If a query fails, automatically retry with different
// indices (0→1→2→3→4) until one succeeds. Uses short, generic queries.
//
// SLOT SYSTEM: 3×6 grid + banners (full-canvas images use 'banner' slots).
//
// RUN: VIDEO_CONFIG=config.ohio-class-submarine.js node engine-ci.js

const https = require('https');
const http = require('http');

// ── Fetch image with fallback to higher indices ──────────────────────────
async function fetchImage(baseQuery, maxAttempts = 5) {
    const key = process.env.SERPAPI_API_KEY;
    if (!key) {
        console.warn('[OhioConfig] SERPAPI_API_KEY not set — skipping photos');
        return null;
    }

    // Try different indices (0, 1, 2, 3, 4) until we get a working image
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const query = `${baseQuery}`; // Keep it short and generic
            const searchUrl =
                `https://serpapi.com/search.json` +
                `?engine=google_images` +
                `&q=${encodeURIComponent(query)}` +
                `&ijn=${attempt}&num=20&safe=active` +
                `&api_key=${key}`;

            console.log(`[OhioConfig] Searching: "${query}" (attempt ${attempt + 1})`);
            const data = await fetchJSON(searchUrl);
            const results = (data?.images_results || []).filter(r => r.original && !r.original.startsWith('x-raw-image'));
            if (!results.length) {
                console.log(`[OhioConfig] No results for attempt ${attempt + 1}`);
                continue;
            }

            const pick = results[0];
            if (!pick?.original) {
                console.log(`[OhioConfig] No original URL for attempt ${attempt + 1}`);
                continue;
            }

            console.log(`[OhioConfig] Downloading: ${pick.original.slice(0, 70)}`);
            const b64 = await urlToBase64(pick.original);
            if (b64) {
                const mime = b64.startsWith('/9j/') || b64.startsWith('iVBOR') ? 'image/jpeg' : 'image/jpeg';
                console.log(`[OhioConfig] ✅ Success on attempt ${attempt + 1}`);
                return `data:${mime};base64,${b64}`;
            }
            console.log(`[OhioConfig] ❌ Failed to download attempt ${attempt + 1}, retrying...`);
        } catch (e) {
            console.warn(`[OhioConfig] Attempt ${attempt + 1} failed:`, e.message?.slice(0, 60));
        }
    }

    console.warn(`[OhioConfig] ❌ All ${maxAttempts} attempts failed for: "${baseQuery}"`);
    return null;
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

    console.log('[OhioConfig] Pre-fetching images from SerpAPI (with fallback)...');

    // ── Pre-fetch all images with fallback to higher indices ──────────────
    const [
        imgOhioFull,
        imgOhioSide,
        imgCrew,
        imgSubmerged,
        imgLaunch,
        imgTrident
    ] = await Promise.all([
        fetchImage('Ohio class submarine surfaced', 0),
        fetchImage('Ohio class submarine side view', 0),
        fetchImage('US Navy submarine crew', 0),
        fetchImage('Ohio class submarine submerged', 0),
        fetchImage('Trident missile launch submarine', 0),
        fetchImage('Trident II D5 missile', 0),
    ]);

    console.log('[OhioConfig] Images ready. Building config...');

    const commonTheme = {
        paper: '#1a1a2e',  // Dark paper for submarine content
        ink: '#e8e8e8',
        accent: '#ffd700',
        accent2: '#4fc3f7',
        shadow: 'rgba(0,0,0,0.7)',
    };

    return {
        output: {
            title: 'ohio-class-submarine',
            format: 'portrait',
            fps: 30,
            crf: 23,
            preset: 'medium',
        },
        defaults: {
            voice: 'am_fenrir',  // Deep, dramatic, playful
            transition: 'fade',
            transitionDuration: 0.35,
        },

        scenes: [

            // ── Scene 0 — HOOK (Playful) ──────────────────────────────────
            {
                tts: {
                    text: "Imagine you're a fish. You're minding your own business. Then a skyscraper the size of two football fields silently glides past you, carrying more explosives than every war in history combined. That's the Ohio-class submarine. And it's been doing this since the 1980s. Time to see what's inside.",
                    voice: 'am_fenrir',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#1a1a2e' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=ohio-hook',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'OHIO CLASS — SSBN',
                            theme: commonTheme,
                            commands: [
                                // ── FULL-CANVAS SUBMARINE PHOTO ──
                                {
                                    id: 'photo_hook',
                                    type: 'photo',
                                    src: imgOhioFull,
                                    slot: 'banner-top',
                                    width: 1080,
                                    height: 1920,
                                    rotate: 0,
                                    pinStyle: 'none',
                                    caption: '',
                                    trigger: { atSeconds: 0.1 },
                                },
                                // ── DARK OVERLAY ──
                                {
                                    id: 'overlay1',
                                    type: 'sticker',
                                    text: '',
                                    slot: 'banner-top',
                                    size: 1,
                                    bg: 'rgba(0,0,0,0.50)',
                                    color: 'transparent',
                                    stroke: 'transparent',
                                    rotate: 0,
                                    trigger: { afterId: 'photo_hook', offset: 0.1 },
                                },
                                // ── HOOK TEXT ── "UNDERWATER SKYSCRAPER" ──
                                {
                                    id: 'hook_text',
                                    type: 'sticker',
                                    text: 'UNDERWATER\nSKYSCRAPER',
                                    slot: 'banner-mid',
                                    size: 76,
                                    color: '#ffffff',
                                    stroke: '#1a1a2e',
                                    bg: 'rgba(0,0,0,0.55)',
                                    rotate: -1,
                                    trigger: { wordText: 'skyscraper', occurrence: 1 },
                                },
                                // ── FUNNY SUBTITLE ──
                                {
                                    id: 'sub_text',
                                    type: 'label',
                                    text: 'Fish: 👁️👄👁️',
                                    slot: 'low-center',
                                    size: 42,
                                    color: '#ffd700',
                                    rotate: 0,
                                    trigger: { afterId: 'hook_text', offset: 0.4 },
                                },
                                // ── BLUR THE HOOK PHOTO after 2.5 seconds ──
                                {
                                    id: 'blur_hook',
                                    type: 'blur',
                                    target: 'photo_hook',
                                    amount: 8,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_hook', offset: 2.5 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 1 — THE SUBMARINE (Funny Stats) ─────────────────────
            {
                tts: {
                    text: "This thing is 560 feet long. That's the height of a 50-story building, lying on its side, underwater. It weighs 18,000 tons. That's 18 million goldfish. If you laid them end to end, you'd have 18 million goldfish. But the crew? Only 155 people. That's less than a high school football team with all the parents watching. And they live underwater for months.",
                    voice: 'am_fenrir',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#1a1a2e' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=ohio-s1',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'THE SUBMARINE',
                            theme: commonTheme,
                            commands: [
                                // ── FULL-CANVAS SIDE VIEW ──
                                {
                                    id: 'photo_side',
                                    type: 'photo',
                                    src: imgOhioSide,
                                    slot: 'banner-top',
                                    width: 1080,
                                    height: 1920,
                                    rotate: 0,
                                    pinStyle: 'none',
                                    caption: '',
                                    trigger: { atSeconds: 0.1 },
                                },
                                // ── OVERLAY ──
                                {
                                    id: 'overlay2',
                                    type: 'sticker',
                                    text: '',
                                    slot: 'banner-top',
                                    size: 1,
                                    bg: 'rgba(0,0,0,0.45)',
                                    color: 'transparent',
                                    stroke: 'transparent',
                                    rotate: 0,
                                    trigger: { afterId: 'photo_side', offset: 0.1 },
                                },
                                // ── TITLE ──
                                {
                                    id: 's1',
                                    type: 'sticker',
                                    text: '560 FT LONG',
                                    slot: 'banner-top',
                                    size: 60,
                                    color: '#ffffff',
                                    stroke: '#1a1a2e',
                                    bg: 'rgba(0,0,0,0.5)',
                                    rotate: -1,
                                    trigger: { wordText: 'five hundred', occurrence: 1 },
                                },
                                // ── FUNNY ANALOGY: "50-STORY BUILDING" ──
                                {
                                    id: 'analogy1',
                                    type: 'sticker',
                                    text: '= 50-STORY BUILDING',
                                    slot: 'mid-left',
                                    size: 40,
                                    color: '#ffd700',
                                    stroke: '#1a1a2e',
                                    bg: 'rgba(0,0,0,0.6)',
                                    rotate: -2,
                                    trigger: { wordText: 'fifty', occurrence: 1 },
                                },
                                // ── WEIGHT: "18,000 TONS" ──
                                {
                                    id: 'stat2',
                                    type: 'sticker',
                                    text: '18,000 TONS',
                                    slot: 'mid-right',
                                    size: 48,
                                    color: '#4fc3f7',
                                    stroke: '#1a1a2e',
                                    bg: 'rgba(0,0,0,0.6)',
                                    rotate: 2,
                                    trigger: { wordText: 'eighteen', occurrence: 1 },
                                },
                                // ── FUNNY ANALOGY: "18M GOLDFISH" ──
                                {
                                    id: 'analogy2',
                                    type: 'sticker',
                                    text: '= 18M GOLDFISH',
                                    slot: 'bot-left',
                                    size: 38,
                                    color: '#ffd700',
                                    stroke: '#1a1a2e',
                                    bg: 'rgba(0,0,0,0.6)',
                                    rotate: -1,
                                    trigger: { wordText: 'goldfish', occurrence: 1 },
                                },
                                // ── CREW: "155 PEOPLE" ──
                                {
                                    id: 'stat3',
                                    type: 'sticker',
                                    text: '155 CREW',
                                    slot: 'low-center',
                                    size: 44,
                                    color: '#ffffff',
                                    stroke: '#1a1a2e',
                                    bg: 'rgba(0,0,0,0.6)',
                                    rotate: 0,
                                    trigger: { wordText: 'hundred and fifty', occurrence: 1 },
                                },
                                // ── FUNNY ANALOGY: "LESS THAN A SCHOOL" ──
                                {
                                    id: 'analogy3',
                                    type: 'label',
                                    text: 'Less than a high school football crowd 🏈',
                                    slot: 'bot-right',
                                    size: 30,
                                    color: '#4fc3f7',
                                    rotate: 1,
                                    trigger: { wordText: 'school', occurrence: 1 },
                                },
                                // ── CREW PHOTO ── small inset ──
                                {
                                    id: 'photo_crew',
                                    type: 'photo',
                                    src: imgCrew,
                                    slot: 'deep-left',
                                    width: 240,
                                    height: 170,
                                    rotate: 2,
                                    pinStyle: 'tape',
                                    caption: '155 PEOPLE = 155 FRIENDS',
                                    trigger: { wordText: 'crew', occurrence: 1 },
                                },
                                // ── BLUR MAIN PHOTO after 2.5 seconds ──
                                {
                                    id: 'blur_side',
                                    type: 'blur',
                                    target: 'photo_side',
                                    amount: 8,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_side', offset: 2.5 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 2 — THE MISSILES (Funny Firepower) ──────────────────
            {
                tts: {
                    text: "Now the good part. Each Ohio carries 24 Trident missiles. Each missile has up to 8 warheads. That's 192 warheads per submarine. Multiply that by 14 submarines. You get 2,688 warheads. That's enough to turn every major city on Earth into a swimming pool. But in a bad way. It's the most expensive, terrifying, and over-engineered \"don't you dare\" button ever built.",
                    voice: 'am_fenrir',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#1a1a2e' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=ohio-s2',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'THE MISSILES',
                            theme: commonTheme,
                            commands: [
                                // ── FULL-CANVAS MISSILE LAUNCH ──
                                {
                                    id: 'photo_missile',
                                    type: 'photo',
                                    src: imgLaunch || imgTrident,
                                    slot: 'banner-top',
                                    width: 1080,
                                    height: 1920,
                                    rotate: 0,
                                    pinStyle: 'none',
                                    caption: '',
                                    trigger: { atSeconds: 0.1 },
                                },
                                // ── OVERLAY ──
                                {
                                    id: 'overlay3',
                                    type: 'sticker',
                                    text: '',
                                    slot: 'banner-top',
                                    size: 1,
                                    bg: 'rgba(0,0,0,0.50)',
                                    color: 'transparent',
                                    stroke: 'transparent',
                                    rotate: 0,
                                    trigger: { afterId: 'photo_missile', offset: 0.1 },
                                },
                                // ── TITLE ──
                                {
                                    id: 's4',
                                    type: 'sticker',
                                    text: '24 TRIDENT\nMISSILES',
                                    slot: 'banner-top',
                                    size: 56,
                                    color: '#ffffff',
                                    stroke: '#1a1a2e',
                                    bg: 'rgba(0,0,0,0.5)',
                                    rotate: -1,
                                    trigger: { wordText: 'trident', occurrence: 1 },
                                },
                                // ── STAT: "8 WARHEADS" ──
                                {
                                    id: 'stat4',
                                    type: 'sticker',
                                    text: '8 WARHEADS\nEACH',
                                    slot: 'mid-left',
                                    size: 44,
                                    color: '#ffd700',
                                    stroke: '#1a1a2e',
                                    bg: 'rgba(0,0,0,0.6)',
                                    rotate: -2,
                                    trigger: { wordText: 'eight', occurrence: 1 },
                                },
                                // ── STAT: "192 PER SUB" ──
                                {
                                    id: 'stat5',
                                    type: 'sticker',
                                    text: '192 WARHEADS\nPER SUBMARINE',
                                    slot: 'mid-right',
                                    size: 44,
                                    color: '#4fc3f7',
                                    stroke: '#1a1a2e',
                                    bg: 'rgba(0,0,0,0.6)',
                                    rotate: 2,
                                    trigger: { wordText: 'hundred and ninety', occurrence: 1 },
                                },
                                // ── FUNNY ANALOGY: "2,688 = SWIMMING POOL" ──
                                {
                                    id: 'analogy4',
                                    type: 'sticker',
                                    text: '2,688 WARHEADS\n= EVERY CITY → SWIMMING POOL 💀',
                                    slot: 'low-center',
                                    size: 42,
                                    color: '#ffd700',
                                    stroke: '#1a1a2e',
                                    bg: 'rgba(0,0,0,0.65)',
                                    rotate: 0,
                                    trigger: { wordText: 'twenty six', occurrence: 1 },
                                },
                                // ── FUNNY LABEL ──
                                {
                                    id: 'analogy5',
                                    type: 'label',
                                    text: 'The world\'s most expensive "don\'t you dare" button 🔴',
                                    slot: 'bot-center',
                                    size: 32,
                                    color: '#ffd700',
                                    rotate: 1,
                                    trigger: { wordText: 'dare', occurrence: 1 },
                                },
                                // ── BLUR MAIN PHOTO after 2.5 seconds ──
                                {
                                    id: 'blur_missile',
                                    type: 'blur',
                                    target: 'photo_missile',
                                    amount: 8,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_missile', offset: 2.5 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 3 — FINAL CTA ────────────────────────────────────────
            {
                tts: {
                    text: "The Ohio class has been on patrol since nineteen eighty one. It will continue until the Columbia class takes over. Until then, it's just a very expensive, very quiet, very angry skyscraper underwater. Subscribe for more. And don't worry, we'll do the Columbia next.",
                    voice: 'am_fenrir',
                    pauseAfter: 0.2,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#1a1a2e' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=ohio-cta',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'SUBSCRIBE',
                            theme: commonTheme,
                            commands: [
                                // ── FULL-CANVAS SUBMERGED PHOTO ──
                                {
                                    id: 'photo_cta',
                                    type: 'photo',
                                    src: imgSubmerged || imgOhioFull,
                                    slot: 'banner-top',
                                    width: 1080,
                                    height: 1920,
                                    rotate: 0,
                                    pinStyle: 'none',
                                    caption: '',
                                    trigger: { atSeconds: 0.1 },
                                },
                                // ── OVERLAY ──
                                {
                                    id: 'overlay4',
                                    type: 'sticker',
                                    text: '',
                                    slot: 'banner-top',
                                    size: 1,
                                    bg: 'rgba(0,0,0,0.55)',
                                    color: 'transparent',
                                    stroke: 'transparent',
                                    rotate: 0,
                                    trigger: { afterId: 'photo_cta', offset: 0.1 },
                                },
                                // ── GIANT CTA ──
                                {
                                    id: 'cta_main',
                                    type: 'sticker',
                                    text: '🔔 SUBSCRIBE\nFOR MORE',
                                    slot: 'banner-mid',
                                    size: 80,
                                    color: '#ffffff',
                                    stroke: '#1a1a2e',
                                    bg: 'rgba(26,26,46,0.75)',
                                    rotate: 0,
                                    trigger: { wordText: 'subscribe', occurrence: 1 },
                                },
                                // ── CIRCLE AROUND CTA ──
                                {
                                    id: 'sc_cta',
                                    type: 'circle',
                                    target: 'cta_main',
                                    color: '#ffd700',
                                    trigger: { afterId: 'cta_main', offset: 0.3 },
                                },
                                // ── BELL ICON ──
                                {
                                    id: 'bell_cta',
                                    type: 'icon',
                                    icon: 'mdi:bell-ring',
                                    size: 120,
                                    slot: 'low-center',
                                    bg: 'circle',
                                    color: '#ffd700',
                                    trigger: { afterId: 'cta_main', offset: 0.2 },
                                },
                                // ── FUNNY LABEL ──
                                {
                                    id: 'funny_cta',
                                    type: 'label',
                                    text: 'Next: Columbia class (bigger, scarier) 🚀',
                                    slot: 'bot-center',
                                    size: 32,
                                    color: '#4fc3f7',
                                    rotate: 0,
                                    trigger: { afterId: 'cta_main', offset: 0.5 },
                                },
                                // ── BLUR MAIN PHOTO after 2.5 seconds ──
                                {
                                    id: 'blur_cta',
                                    type: 'blur',
                                    target: 'photo_cta',
                                    amount: 8,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_cta', offset: 2.5 },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };
})();