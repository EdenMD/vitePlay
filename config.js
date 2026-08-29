// config.xuedizi-weapon.js
// "The Blood-Dripper — Ancient China's Most Terrifying Weapon"
// 4 scenes: Hook → The Weapon → The Legend → CTA
// Full-canvas visuals, blur after 2.5 seconds, word triggers.
// Voice: am_fenrir (deep, dramatic, playful).
// ANALOGIES: "Bird cage of death", "Uber Eats but for heads", "Tinder swipe left = death".
//
// ROBUST IMAGE FETCHING: Automatically retries indices 0→1→2→3→4 until success.
//
// RUN: VIDEO_CONFIG=config.xuedizi-weapon.js node engine-ci.js

const https = require('https');
const http = require('http');

// ── Fetch image with fallback to higher indices ──────────────────────────
async function fetchImage(baseQuery, maxAttempts = 5) {
    const key = process.env.SERPAPI_API_KEY;
    if (!key) {
        console.warn('[XuediziConfig] SERPAPI_API_KEY not set — skipping photos');
        return null;
    }

    // Try different indices (0, 1, 2, 3, 4) until we get a working image
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const query = `${baseQuery}`;
            const searchUrl =
                `https://serpapi.com/search.json` +
                `?engine=google_images` +
                `&q=${encodeURIComponent(query)}` +
                `&ijn=${attempt}&num=20&safe=active` +
                `&api_key=${key}`;

            console.log(`[XuediziConfig] Searching: "${query}" (attempt ${attempt + 1})`);
            const data = await fetchJSON(searchUrl);
            const results = (data?.images_results || []).filter(r => r.original && !r.original.startsWith('x-raw-image'));
            if (!results.length) {
                console.log(`[XuediziConfig] No results for attempt ${attempt + 1}`);
                continue;
            }

            const pick = results[0];
            if (!pick?.original) {
                console.log(`[XuediziConfig] No original URL for attempt ${attempt + 1}`);
                continue;
            }

            console.log(`[XuediziConfig] Downloading: ${pick.original.slice(0, 70)}`);
            const b64 = await urlToBase64(pick.original);
            if (b64) {
                const mime = b64.startsWith('/9j/') || b64.startsWith('iVBOR') ? 'image/jpeg' : 'image/jpeg';
                console.log(`[XuediziConfig] ✅ Success on attempt ${attempt + 1}`);
                return `data:${mime};base64,${b64}`;
            }
            console.log(`[XuediziConfig] ❌ Failed to download attempt ${attempt + 1}, retrying...`);
        } catch (e) {
            console.warn(`[XuediziConfig] Attempt ${attempt + 1} failed:`, e.message?.slice(0, 60));
        }
    }

    console.warn(`[XuediziConfig] ❌ All ${maxAttempts} attempts failed for: "${baseQuery}"`);
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

    console.log('[XuediziConfig] Pre-fetching images from SerpAPI (with fallback)...');

    // ── Pre-fetch all images with fallback to higher indices ──────────────
    const [
        imgXuedizi,
        imgXuediziArt,
        imgXuediziModern,
        imgAncientWeapons,
        imgEmperor
    ] = await Promise.all([
        fetchImage('血滴子 ancient Chinese weapon', 0),
        fetchImage('血滴子 historical drawing', 0),
        fetchImage('血滴子 weapon replica modern', 0),
        fetchImage('ancient Chinese weapons collection', 0),
        fetchImage('Qing Dynasty emperor Yongzheng', 0),
    ]);

    console.log('[XuediziConfig] Images ready. Building config...');

    const commonTheme = {
        paper: '#2a1a1a',  // Dark red/paper background for ancient Chinese theme
        ink: '#e8d5c4',
        accent: '#c0392b',  // Blood red
        accent2: '#d4a017', // Gold
        shadow: 'rgba(0,0,0,0.7)',
    };

    return {
        output: {
            title: 'xuedizi-weapon',
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

            // ── Scene 0 — HOOK ──────────────────────────────────────────────
            {
                tts: {
                    text: "Imagine a weapon that looks like a bird cage. Now imagine that bird cage flies through the air, lands on someone's head, and... well, the head doesn't come back. That's the blood-dripper. The most terrifying weapon you've never heard of. Let's find out why.",
                    voice: 'am_fenrir',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#2a1a1a' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=xuedizi-hook',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '血滴子 — BLOOD DRIPPER',
                            theme: commonTheme,
                            commands: [
                                // ── FULL-CANVAS WEAPON PHOTO ──
                                {
                                    id: 'photo_hook',
                                    type: 'photo',
                                    src: imgXuedizi || imgXuediziArt,
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
                                    bg: 'rgba(0,0,0,0.55)',
                                    color: 'transparent',
                                    stroke: 'transparent',
                                    rotate: 0,
                                    trigger: { afterId: 'photo_hook', offset: 0.1 },
                                },
                                // ── HOOK TEXT ──
                                {
                                    id: 'hook_text',
                                    type: 'sticker',
                                    text: 'THE BLOOD-DRIPPER\nANCIENT CHINA\'S\nDEADLIEST SECRET',
                                    slot: 'banner-mid',
                                    size: 68,
                                    color: '#e8d5c4',
                                    stroke: '#2a1a1a',
                                    bg: 'rgba(42,26,26,0.65)',
                                    rotate: 0,
                                    trigger: { wordText: 'blood-dripper', occurrence: 1 },
                                },
                                // ── FUNNY SUBTITLE ──
                                {
                                    id: 'sub_text',
                                    type: 'label',
                                    text: 'Bird cage of death 🐦💀',
                                    slot: 'low-center',
                                    size: 44,
                                    color: '#c0392b',
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

            // ── Scene 1 — THE WEAPON ──────────────────────────────────────
            {
                tts: {
                    text: "So what is it? The blood-dripper, or xue di zi, is a metal cage with blades on the inside. You throw it like a frisbee. It lands on someone's head. Then you pull the chain. The blades snap shut. The head comes off. Clean. Fast. Terrifying. It's basically Uber Eats but for heads.",
                    voice: 'am_fenrir',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#2a1a1a' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=xuedizi-s1',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'THE WEAPON',
                            theme: commonTheme,
                            commands: [
                                // ── FULL-CANVAS WEAPON CLOSE-UP ──
                                {
                                    id: 'photo_weapon',
                                    type: 'photo',
                                    src: imgXuediziModern || imgXuedizi,
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
                                    trigger: { afterId: 'photo_weapon', offset: 0.1 },
                                },
                                // ── TITLE ──
                                {
                                    id: 's1',
                                    type: 'sticker',
                                    text: 'THE BLOOD-DRIPPER',
                                    slot: 'banner-top',
                                    size: 58,
                                    color: '#e8d5c4',
                                    stroke: '#2a1a1a',
                                    bg: 'rgba(42,26,26,0.6)',
                                    rotate: -1,
                                    trigger: { wordText: 'blood-dripper', occurrence: 1 },
                                },
                                // ── "METAL CAGE WITH BLADES" ──
                                {
                                    id: 'stat1',
                                    type: 'sticker',
                                    text: 'METAL CAGE\n+ BLADES',
                                    slot: 'mid-left',
                                    size: 44,
                                    color: '#c0392b',
                                    stroke: '#2a1a1a',
                                    bg: 'rgba(0,0,0,0.6)',
                                    rotate: -2,
                                    trigger: { wordText: 'cage', occurrence: 1 },
                                },
                                // ── "THROW IT LIKE A FRISBEE" ──
                                {
                                    id: 'analogy1',
                                    type: 'sticker',
                                    text: '= FRISBEE 🥏',
                                    slot: 'mid-right',
                                    size: 44,
                                    color: '#d4a017',
                                    stroke: '#2a1a1a',
                                    bg: 'rgba(0,0,0,0.6)',
                                    rotate: 2,
                                    trigger: { wordText: 'frisbee', occurrence: 1 },
                                },
                                // ── "UBER EATS FOR HEADS" ──
                                {
                                    id: 'analogy2',
                                    type: 'sticker',
                                    text: 'UBER EATS\nBUT FOR HEADS 🍽️',
                                    slot: 'low-center',
                                    size: 44,
                                    color: '#c0392b',
                                    stroke: '#2a1a1a',
                                    bg: 'rgba(0,0,0,0.65)',
                                    rotate: 0,
                                    trigger: { wordText: 'eats', occurrence: 1 },
                                },
                                // ── BLUR MAIN PHOTO after 2.5 seconds ──
                                {
                                    id: 'blur_weapon',
                                    type: 'blur',
                                    target: 'photo_weapon',
                                    amount: 8,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_weapon', offset: 2.5 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 2 — THE LEGEND ──────────────────────────────────────
            {
                tts: {
                    text: "Now here's where it gets wild. The blood-dripper is linked to the Qing Dynasty. Emperor Yongzheng supposedly had a team of assassins who used it. Imagine being an official in the 1700s and seeing a bird cage fly toward your face. That's not a weapon. That's a psychological horror film.",
                    voice: 'am_fenrir',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#2a1a1a' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=xuedizi-s2',
                        audioSync: true,
                        cursor: false,
                        waitFor: '[data-ready="1"]',
                        fps: 30,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'THE LEGEND',
                            theme: commonTheme,
                            commands: [
                                // ── FULL-CANVAS EMPEROR PHOTO ──
                                {
                                    id: 'photo_emperor',
                                    type: 'photo',
                                    src: imgEmperor || imgAncientWeapons,
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
                                    trigger: { afterId: 'photo_emperor', offset: 0.1 },
                                },
                                // ── TITLE ──
                                {
                                    id: 's4',
                                    type: 'sticker',
                                    text: 'QING DYNASTY\nSECRET WEAPON',
                                    slot: 'banner-top',
                                    size: 54,
                                    color: '#e8d5c4',
                                    stroke: '#2a1a1a',
                                    bg: 'rgba(42,26,26,0.6)',
                                    rotate: -1,
                                    trigger: { wordText: 'qing', occurrence: 1 },
                                },
                                // ── "EMPEROR YONGZHENG" ──
                                {
                                    id: 'stat4',
                                    type: 'sticker',
                                    text: 'EMPEROR YONGZHENG\n👑',
                                    slot: 'mid-left',
                                    size: 44,
                                    color: '#d4a017',
                                    stroke: '#2a1a1a',
                                    bg: 'rgba(0,0,0,0.6)',
                                    rotate: -2,
                                    trigger: { wordText: 'yongzheng', occurrence: 1 },
                                },
                                // ── "ASSASSIN SQUAD" ──
                                {
                                    id: 'stat5',
                                    type: 'sticker',
                                    text: 'ASSASSIN SQUAD\n🗡️',
                                    slot: 'mid-right',
                                    size: 44,
                                    color: '#c0392b',
                                    stroke: '#2a1a1a',
                                    bg: 'rgba(0,0,0,0.6)',
                                    rotate: 2,
                                    trigger: { wordText: 'assassins', occurrence: 1 },
                                },
                                // ── FUNNY ANALOGY ──
                                {
                                    id: 'analogy3',
                                    type: 'sticker',
                                    text: '= PSYCHOLOGICAL\nHORROR FILM 😱',
                                    slot: 'low-center',
                                    size: 44,
                                    color: '#c0392b',
                                    stroke: '#2a1a1a',
                                    bg: 'rgba(0,0,0,0.65)',
                                    rotate: 0,
                                    trigger: { wordText: 'horror', occurrence: 1 },
                                },
                                // ── BLUR MAIN PHOTO after 2.5 seconds ──
                                {
                                    id: 'blur_emperor',
                                    type: 'blur',
                                    target: 'photo_emperor',
                                    amount: 8,
                                    duration: 0.6,
                                    trigger: { afterId: 'photo_emperor', offset: 2.5 },
                                },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 3 — FINAL CTA ────────────────────────────────────────
            {
                tts: {
                    text: "Was the blood-dripper real? Historians are still debating. But one thing's for sure: if you saw a bird cage flying toward your head in the 1700s, you weren't sticking around to ask questions. Subscribe for more ancient weird weapons. Next time: the flying claw.",
                    voice: 'am_fenrir',
                    pauseAfter: 0.2,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#2a1a1a' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=xuedizi-cta',
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
                                // ── FULL-CANVAS WEAPON COLLECTION ──
                                {
                                    id: 'photo_cta',
                                    type: 'photo',
                                    src: imgAncientWeapons || imgXuedizi,
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
                                    color: '#e8d5c4',
                                    stroke: '#2a1a1a',
                                    bg: 'rgba(42,26,26,0.75)',
                                    rotate: 0,
                                    trigger: { wordText: 'subscribe', occurrence: 1 },
                                },
                                // ── CIRCLE AROUND CTA ──
                                {
                                    id: 'sc_cta',
                                    type: 'circle',
                                    target: 'cta_main',
                                    color: '#d4a017',
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
                                    color: '#d4a017',
                                    trigger: { afterId: 'cta_main', offset: 0.2 },
                                },
                                // ── NEXT EPISODE TEASER ──
                                {
                                    id: 'next_episode',
                                    type: 'label',
                                    text: 'Next: The Flying Claw 🦅',
                                    slot: 'bot-center',
                                    size: 34,
                                    color: '#c0392b',
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