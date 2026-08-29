// config.xuedizi-weapon.js
// "The Blood-Dripper — Ancient China's Most Terrifying Weapon"
// 5 scenes: Hook → The Weapon → How It Works → The Legend → CTA
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

    const [
        imgXuedizi,
        imgXuediziArt,
        imgXuediziModern,
        imgAncientWeapons,
        imgEmperor,
        imgFlyingClaw
    ] = await Promise.all([
        fetchImage('血滴子 ancient Chinese weapon', 0),
        fetchImage('血滴子 historical drawing', 0),
        fetchImage('血滴子 weapon replica', 0),
        fetchImage('ancient Chinese weapons collection', 0),
        fetchImage('Qing Dynasty emperor Yongzheng', 0),
        fetchImage('ancient Chinese flying claw weapon', 0),
    ]);

    console.log('[XuediziConfig] Images ready. Building config...');

    return {
        output: {
            title: 'xuedizi-weapon',
            format: 'portrait',
            fps: 30,
            crf: 23,
            preset: 'medium',
        },
        defaults: {
            voice: 'am_fenrir',
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
                    // ── FULL-CANVAS BACKGROUND ──
                    {
                        type: 'image',
                        src: imgXuedizi || imgXuediziArt,
                        x: 0,
                        y: 0,
                        width: 1080,
                        height: 1920,
                        fit: 'cover',
                        kenBurns: 'zoom-in',
                        kenBurnsAmount: 0.05,
                    },
                    // ── DARK OVERLAY ──
                    {
                        type: 'overlay',
                        color: 'rgba(0,0,0,0.55)',
                    },
                    // ── HOOK TEXT ──
                    {
                        type: 'text',
                        text: 'THE BLOOD-DRIPPER\nANCIENT CHINA\'S\nDEADLIEST SECRET',
                        x: 540,
                        y: 700,
                        fontSize: 72,
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        color: '#e8d5c4',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 8,
                        animation: 'pop',
                        startT: 0.2,
                        animDur: 0.5,
                    },
                    // ── FUNNY SUBTITLE ──
                    {
                        type: 'text',
                        text: '🐦 Bird cage of death 💀',
                        x: 540,
                        y: 1100,
                        fontSize: 48,
                        fontFamily: 'Arial, sans-serif',
                        color: '#c0392b',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 4,
                        animation: 'fade',
                        startT: 0.8,
                        animDur: 0.4,
                    },
                    // ── ENTER AT / EXIT AT (fade out before scene ends) ──
                    {
                        type: 'text',
                        text: '⚔️',
                        x: 540,
                        y: 1300,
                        fontSize: 60,
                        color: '#d4a017',
                        align: 'center',
                        animation: 'fade',
                        startT: 1.5,
                        animDur: 0.3,
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
                    // ── FULL-CANVAS WEAPON CLOSE-UP ──
                    {
                        type: 'image',
                        src: imgXuediziModern || imgXuedizi,
                        x: 0,
                        y: 0,
                        width: 1080,
                        height: 1920,
                        fit: 'cover',
                        kenBurns: 'zoom-out',
                        kenBurnsAmount: 0.06,
                    },
                    // ── DARK OVERLAY ──
                    {
                        type: 'overlay',
                        color: 'rgba(0,0,0,0.45)',
                    },
                    // ── TITLE ──
                    {
                        type: 'text',
                        text: 'THE BLOOD-DRIPPER\n(血滴子)',
                        x: 540,
                        y: 200,
                        fontSize: 64,
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        color: '#e8d5c4',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 6,
                        animation: 'pop',
                        startT: 0.1,
                        animDur: 0.4,
                    },
                    // ── "METAL CAGE + BLADES" ──
                    {
                        type: 'text',
                        text: '🔪 METAL CAGE\n⚔️ BLADES INSIDE',
                        x: 180,
                        y: 600,
                        fontSize: 40,
                        fontFamily: 'Arial Black, sans-serif',
                        color: '#c0392b',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 4,
                        animation: 'slide-up',
                        startT: 0.5,
                        animDur: 0.4,
                    },
                    // ── "THROW IT LIKE A FRISBEE" ──
                    {
                        type: 'text',
                        text: '= FRISBEE 🥏',
                        x: 880,
                        y: 600,
                        fontSize: 40,
                        fontFamily: 'Arial Black, sans-serif',
                        color: '#d4a017',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 4,
                        animation: 'slide-up',
                        startT: 0.7,
                        animDur: 0.4,
                    },
                    // ── "UBER EATS FOR HEADS" ──
                    {
                        type: 'text',
                        text: '🍽️ UBER EATS\nBUT FOR HEADS',
                        x: 540,
                        y: 1200,
                        fontSize: 52,
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        color: '#c0392b',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 6,
                        animation: 'pop',
                        startT: 1.0,
                        animDur: 0.5,
                    },
                    // ── CHAIN ICON ──
                    {
                        type: 'text',
                        text: '⛓️',
                        x: 540,
                        y: 1500,
                        fontSize: 80,
                        color: '#d4a017',
                        align: 'center',
                        animation: 'fade',
                        startT: 1.8,
                        animDur: 0.4,
                    },
                ],
            },

            // ── Scene 2 — HOW IT WORKS ────────────────────────────────────
            {
                tts: {
                    text: "The design is simple but genius. You throw the cage. It spins through the air. It lands on the target's head. A quick tug on the chain activates the blades. They slice through the neck like scissors through paper. The head drops into the cage. You pull it back. No evidence. No witness. Just... gone.",
                    voice: 'am_fenrir',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    // ── FULL-CANVAS WEAPON ART ──
                    {
                        type: 'image',
                        src: imgXuediziArt || imgXuedizi,
                        x: 0,
                        y: 0,
                        width: 1080,
                        height: 1920,
                        fit: 'cover',
                        kenBurns: 'pan-right',
                        kenBurnsAmount: 0.08,
                    },
                    // ── DARK OVERLAY ──
                    {
                        type: 'overlay',
                        color: 'rgba(0,0,0,0.50)',
                    },
                    // ── TITLE ──
                    {
                        type: 'text',
                        text: 'HOW IT WORKS',
                        x: 540,
                        y: 180,
                        fontSize: 56,
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        color: '#e8d5c4',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 6,
                        animation: 'pop',
                        startT: 0.1,
                        animDur: 0.4,
                    },
                    // ── STEP 1 ──
                    {
                        type: 'text',
                        text: '1️⃣ THROW THE CAGE',
                        x: 180,
                        y: 450,
                        fontSize: 36,
                        fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff',
                        align: 'left',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 4,
                        animation: 'slide-up',
                        startT: 0.3,
                        animDur: 0.3,
                    },
                    // ── STEP 2 ──
                    {
                        type: 'text',
                        text: '2️⃣ LANDS ON HEAD',
                        x: 180,
                        y: 620,
                        fontSize: 36,
                        fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff',
                        align: 'left',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 4,
                        animation: 'slide-up',
                        startT: 0.6,
                        animDur: 0.3,
                    },
                    // ── STEP 3 ──
                    {
                        type: 'text',
                        text: '3️⃣ PULL CHAIN',
                        x: 180,
                        y: 790,
                        fontSize: 36,
                        fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff',
                        align: 'left',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 4,
                        animation: 'slide-up',
                        startT: 0.9,
                        animDur: 0.3,
                    },
                    // ── STEP 4 ──
                    {
                        type: 'text',
                        text: '4️⃣ BLADES SNAP SHUT',
                        x: 180,
                        y: 960,
                        fontSize: 36,
                        fontFamily: 'Arial Black, sans-serif',
                        color: '#c0392b',
                        align: 'left',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 4,
                        animation: 'slide-up',
                        startT: 1.2,
                        animDur: 0.3,
                    },
                    // ── STEP 5 ──
                    {
                        type: 'text',
                        text: '5️⃣ HEAD = GONE 💀',
                        x: 180,
                        y: 1130,
                        fontSize: 40,
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        color: '#c0392b',
                        align: 'left',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 5,
                        animation: 'pop',
                        startT: 1.5,
                        animDur: 0.4,
                    },
                    // ── SCISSORS ANALOGY ──
                    {
                        type: 'text',
                        text: '✂️ = scissors through paper',
                        x: 880,
                        y: 1100,
                        fontSize: 32,
                        fontFamily: 'Arial, sans-serif',
                        color: '#d4a017',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 3,
                        animation: 'fade',
                        startT: 2.0,
                        animDur: 0.4,
                    },
                ],
            },

            // ── Scene 3 — THE LEGEND ──────────────────────────────────────
            {
                tts: {
                    text: "Now here's where it gets wild. The blood-dripper is linked to the Qing Dynasty. Emperor Yongzheng supposedly had a team of assassins who used it. Imagine being an official in the 1700s and seeing a bird cage fly toward your face. That's not a weapon. That's a psychological horror film.",
                    voice: 'am_fenrir',
                    pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    // ── FULL-CANVAS EMPEROR PHOTO ──
                    {
                        type: 'image',
                        src: imgEmperor || imgAncientWeapons,
                        x: 0,
                        y: 0,
                        width: 1080,
                        height: 1920,
                        fit: 'cover',
                        kenBurns: 'zoom-in',
                        kenBurnsAmount: 0.06,
                    },
                    // ── DARK OVERLAY ──
                    {
                        type: 'overlay',
                        color: 'rgba(0,0,0,0.55)',
                    },
                    // ── TITLE ──
                    {
                        type: 'text',
                        text: 'THE LEGEND',
                        x: 540,
                        y: 180,
                        fontSize: 56,
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        color: '#e8d5c4',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 6,
                        animation: 'pop',
                        startT: 0.1,
                        animDur: 0.4,
                    },
                    // ── EMPEROR YONGZHENG ──
                    {
                        type: 'text',
                        text: 'EMPEROR YONGZHENG\n👑 1722-1735',
                        x: 180,
                        y: 500,
                        fontSize: 40,
                        fontFamily: 'Arial Black, sans-serif',
                        color: '#d4a017',
                        align: 'left',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 4,
                        animation: 'slide-up',
                        startT: 0.3,
                        animDur: 0.4,
                    },
                    // ── ASSASSIN SQUAD ──
                    {
                        type: 'text',
                        text: '🗡️ ASSASSIN SQUAD',
                        x: 180,
                        y: 680,
                        fontSize: 38,
                        fontFamily: 'Arial Black, sans-serif',
                        color: '#c0392b',
                        align: 'left',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 4,
                        animation: 'slide-up',
                        startT: 0.6,
                        animDur: 0.4,
                    },
                    // ── "PSYCHOLOGICAL HORROR" ──
                    {
                        type: 'text',
                        text: '😱 = PSYCHOLOGICAL\nHORROR FILM',
                        x: 180,
                        y: 900,
                        fontSize: 38,
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        color: '#c0392b',
                        align: 'left',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 5,
                        animation: 'pop',
                        startT: 1.0,
                        animDur: 0.4,
                    },
                    // ── QING DYNASTY ──
                    {
                        type: 'text',
                        text: 'QING DYNASTY\n1644-1912',
                        x: 880,
                        y: 500,
                        fontSize: 34,
                        fontFamily: 'Arial, sans-serif',
                        color: '#e8d5c4',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 3,
                        animation: 'fade',
                        startT: 0.5,
                        animDur: 0.4,
                    },
                    // ── "BIRD CAGE" FUNNY ──
                    {
                        type: 'text',
                        text: '🐦 "Sir, that bird cage is flying toward us..."',
                        x: 540,
                        y: 1350,
                        fontSize: 30,
                        fontFamily: 'Arial, sans-serif',
                        color: '#ffffff',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 3,
                        animation: 'fade',
                        startT: 1.8,
                        animDur: 0.4,
                    },
                ],
            },

            // ── Scene 4 — FINAL CTA ────────────────────────────────────────
            {
                tts: {
                    text: "Was the blood-dripper real? Historians are still debating. But one thing's for sure: if you saw a bird cage flying toward your head in the 1700s, you weren't sticking around to ask questions. Subscribe for more ancient weird weapons. Next time: the flying claw.",
                    voice: 'am_fenrir',
                    pauseAfter: 0.2,
                },
                captions: false,
                layers: [
                    // ── FULL-CANVAS WEAPON COLLECTION ──
                    {
                        type: 'image',
                        src: imgAncientWeapons || imgXuedizi,
                        x: 0,
                        y: 0,
                        width: 1080,
                        height: 1920,
                        fit: 'cover',
                        kenBurns: 'zoom-out',
                        kenBurnsAmount: 0.05,
                    },
                    // ── DARK OVERLAY ──
                    {
                        type: 'overlay',
                        color: 'rgba(0,0,0,0.60)',
                    },
                    // ── GIANT CTA ──
                    {
                        type: 'text',
                        text: '🔔 SUBSCRIBE\nFOR MORE',
                        x: 540,
                        y: 700,
                        fontSize: 80,
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        color: '#e8d5c4',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 8,
                        animation: 'pop',
                        startT: 0.1,
                        animDur: 0.5,
                    },
                    // ── NEXT EPISODE TEASER ──
                    {
                        type: 'text',
                        text: '🦅 NEXT: THE FLYING CLAW',
                        x: 540,
                        y: 1100,
                        fontSize: 40,
                        fontFamily: 'Arial Black, sans-serif',
                        color: '#d4a017',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 4,
                        animation: 'fade',
                        startT: 0.8,
                        animDur: 0.4,
                    },
                    // ── BELL ICON ──
                    {
                        type: 'text',
                        text: '🔔',
                        x: 540,
                        y: 1400,
                        fontSize: 100,
                        color: '#d4a017',
                        align: 'center',
                        animation: 'pulse',
                        startT: 1.2,
                        animDur: 0.6,
                    },
                    // ── SUBTITLE ──
                    {
                        type: 'text',
                        text: 'Ancient weapons you\'ve never heard of',
                        x: 540,
                        y: 1650,
                        fontSize: 32,
                        fontFamily: 'Arial, sans-serif',
                        color: '#ffffff',
                        align: 'center',
                        stroke: true,
                        strokeColor: '#000000',
                        strokeWidth: 3,
                        animation: 'fade',
                        startT: 1.5,
                        animDur: 0.4,
                    },
                ],
            },
        ],
    };
})();