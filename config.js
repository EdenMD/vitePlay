// config.top3-weakest-militaries.js
// "Top 3 Weakest Militaries in the World" — same slot system, pre-fetch,
// and sticker/photo/string/circle style as config.top3-expensive-guns.js,
// copied exactly. Camera movement added on top: moderate panZoom
// (scale ~1.3-1.7, not the harder 2.2-2.6 used on an earlier video —
// dialed back per later feedback that the harder zoom wasn't necessary).
//
// FACTS — real, well-documented, ranked by how total-absent their
// standing military actually is:
//   #3 Costa Rica — abolished its military in 1948, redirected the
//      budget to education/healthcare, ~8,500-person Public Force
//      (police), no army/navy/air force.
//   #2 Iceland — has never had a standing army in its history, ~250
//      armed coast guard personnel, defense depends on NATO allies.
//   #1 Liechtenstein — disbanded its entire army in 1868 and never
//      rebuilt one, ~90 police officers total for the whole country.
//
// Closing scene deliberately explains WHY this doesn't make them
// unsafe (treaties, geography, deliberate policy) rather than ending
// on pure mockery — same factual, even-handed tone as the rest of this
// channel's content, just applied to a "weakest" countdown instead of
// "most powerful."
//
// Analogy images fetched separately per scene (private security, a
// motorcycle club, a SWAT team) rather than reusing one generic "gang"
// photo three times, per the "lots of analogies, each with its own
// visual" instruction. Cartel/gang search terms deliberately avoided in
// favor of tamer equivalents (private security, motorcycle club, SWAT
// team) that carry the same "small organized armed group" idea without
// risking genuinely graphic search results.
//
// RUN: VIDEO_CONFIG=config.top3-weakest-militaries.js node engine-ci.js

const https = require('https');
const http = require('http');

// ── Fetch one image from SerpAPI, return as base64 data URI or null ──
async function fetchImage(query, index = 0) {
    const key = process.env.SERPAPI_API_KEY;
    if (!key) {
        console.warn('[WeakestConfig] SERPAPI_API_KEY not set — skipping photo:', query);
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

        console.log(`[WeakestConfig] Downloading: ${pick.original.slice(0, 70)}`);
        const b64 = await urlToBase64(pick.original);
        if (!b64) return null;

        const mime = b64.startsWith('/9j/') || b64.startsWith('iVBOR') ? 'image/jpeg' : 'image/jpeg';
        return `data:${mime};base64,${b64}`;
    } catch (e) {
        console.warn(`[WeakestConfig] fetchImage failed for "${query}":`, e.message?.slice(0, 80));
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

// ── panZoom camera helper — mirrors the casing's own slotToXY math ─────────
const SLOT_CENTERS = {
    'top-left': [180, 270.5], 'top-center': [540, 270.5], 'top-right': [900, 270.5],
    'mid-left': [180, 511.5], 'mid-center': [540, 511.5], 'mid-right': [900, 511.5],
    'low-left': [180, 752.5], 'low-center': [540, 752.5], 'low-right': [900, 752.5],
    'bot-left': [180, 993.5], 'bot-center': [540, 993.5], 'bot-right': [900, 993.5],
    'banner-top': [540, 270.5], 'banner-mid': [540, 752.5], 'banner-low': [540, 1234.5], 'banner-bot': [540, 1475.5],
};
function zoomTo(slot, scale) {
    const c = SLOT_CENTERS[slot] || [540, 960];
    return { toScale: scale, toX: -scale * (c[0] - 540), toY: -scale * (c[1] - 960) };
}
const ZOOM_OUT = { toScale: 1, toX: 0, toY: 0 };

// ── Main async config ────────────────────────────────────────────────────
module.exports = (async () => {

    console.log('[WeakestConfig] Pre-fetching images from SerpAPI...');

    const [
        imgCostaRica, imgLiechtenstein, imgIceland, imgSwatGeneric,
        imgCostaRicaForce, imgMotorcycleClub,
        imgIcelandCoastGuard,
        imgLiechtensteinPolice, imgPrivateSecurity,
    ] = await Promise.all([
        fetchImage('Costa Rica San Jose city', 0),
        fetchImage('Liechtenstein Vaduz castle', 0),
        fetchImage('Iceland Reykjavik landscape', 0),
        fetchImage('SWAT team tactical officers', 0),
        fetchImage('Costa Rica police public force', 0),
        fetchImage('motorcycle club group riders', 0),
        fetchImage('coast guard patrol boat', 0),
        fetchImage('European police officers small town', 0),
        fetchImage('private security team armed', 0),
    ]);

    console.log('[WeakestConfig] Images ready. Building config...');

    const commonTheme = {
        paper: '#e8dfcd', ink: '#1a1a1a',
        accent: '#a93226', accent2: '#1a5276',
        shadow: 'rgba(20,16,10,0.38)',
    };

    return {
        output: {
            title: 'top3-weakest-militaries',
            format: 'portrait',
            fps: 30, crf: 23, preset: 'medium',
        },
        defaults: { voice: 'am_adam', transition: 'fade', transitionDuration: 0.35 },

        scenes: [

            // ── Scene 0 — HOOK ────────────────────────────────────────────
            {
                tts: {
                    text: "What if I told you a single armed group could realistically take over an entire country's military, in an afternoon? Here are the top three weakest militaries on Earth — and yes, one of them has been unarmed since the eighteen sixties.",
                    voice: 'am_adam', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=weak-hook',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]',
                        fps: 30, viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'THE WEAKEST MILITARIES',
                            theme: commonTheme,
                            commands: [
                                { id: 'hook1', type: 'sticker', text: 'A GANG COULD\nOVERPOWER THIS?', slot: 'banner-top', size: 62, color: '#1a1a1a', stroke: '#ffffff', rotate: -1, trigger: { atSeconds: 0.1 } },
                                { id: 'img_cr', type: 'photo', src: imgCostaRica, slot: 'mid-left', width: 320, height: 220, caption: 'COSTA RICA', pinStyle: 'tape', trigger: { wordText: 'group', occurrence: 1 } },
                                { id: 'pz1', type: 'panZoom', ...zoomTo('mid-left', 1.5), duration: 0.9, trigger: { afterId: 'img_cr', offset: 0.15 } },
                                { id: 'img_li', type: 'photo', src: imgLiechtenstein, slot: 'mid-center', width: 320, height: 220, caption: 'LIECHTENSTEIN', pinStyle: 'tape', trigger: { wordText: 'realistically', occurrence: 1 } },
                                { id: 'pz2', type: 'panZoom', ...zoomTo('mid-center', 1.5), duration: 0.9, trigger: { afterId: 'img_li', offset: 0.15 } },
                                { id: 'img_ic', type: 'photo', src: imgIceland, slot: 'mid-right', width: 320, height: 220, caption: 'ICELAND', pinStyle: 'tape', trigger: { wordText: 'afternoon', occurrence: 1 } },
                                { id: 'pz3', type: 'panZoom', ...zoomTo('mid-right', 1.5), duration: 0.9, trigger: { afterId: 'img_ic', offset: 0.15 } },
                                { id: 'pz_out0', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'img_ic', offset: 0.5 } },
                                { id: 'hook2', type: 'sticker', text: 'TOP 3 COUNTDOWN', slot: 'banner-bot', size: 68, color: '#ffffff', stroke: '#a93226', bg: '#a93226', rotate: 1, trigger: { wordText: 'top', occurrence: 1 } },
                                { id: 'sc_hook', type: 'circle', target: 'hook2', color: '#a93226', trigger: { afterId: 'hook2', offset: 0.3 } },
                                { id: 'str1', type: 'string', from: { target: 'img_cr' }, to: { target: 'img_li' }, color: '#a93226', sag: 30, trigger: { afterId: 'img_li', offset: 0.3 } },
                                { id: 'str2', type: 'string', from: { target: 'img_li' }, to: { target: 'img_ic' }, color: '#a93226', sag: 30, trigger: { afterId: 'img_ic', offset: 0.3 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 1 — #3: Costa Rica ──────────────────────────────────
            {
                tts: {
                    text: "Number three: Costa Rica. In 1948, the country abolished its military entirely, and redirected that money into schools and hospitals instead. Today its only armed force is a roughly eight thousand person Public Force, essentially a national police department. No tanks. No fighter jets. No navy. A well-organized armed group with rifles and pickup trucks would already outgun most of what's left.",
                    voice: 'am_adam', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=weak-s1',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]',
                        fps: 30, viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#3 — COSTA RICA',
                            theme: commonTheme,
                            commands: [
                                { id: 'num1', type: 'sticker', text: '#3', slot: 'top-left', size: 90, color: '#ffffff', stroke: '#1a5276', bg: '#1a5276', rotate: -3, trigger: { atSeconds: 0.1 } },
                                { id: 'photo1', type: 'photo', src: imgCostaRica, slot: 'top-center', width: 580, height: 360, rotate: -2, pinStyle: 'tape', caption: 'COSTA RICA', trigger: { wordText: '1948', occurrence: 1 } },
                                { id: 'pz_p1', type: 'panZoom', ...zoomTo('top-center', 1.4), duration: 1.0, trigger: { afterId: 'photo1', offset: 0.15 } },
                                { id: 's1', type: 'sticker', text: 'NO ARMY.\nNO NAVY.\nNO AIR FORCE.', slot: 'mid-left', size: 44, color: '#ffffff', stroke: '#a93226', bg: '#a93226', rotate: -2, trigger: { wordText: 'navy', occurrence: 1 } },
                                { id: 'pz_s1', type: 'panZoom', ...zoomTo('mid-left', 1.5), duration: 0.9, trigger: { afterId: 's1', offset: 0.15 } },
                                { id: 'img_force', type: 'photo', src: imgCostaRicaForce, slot: 'mid-right', width: 320, height: 220, caption: '~8,500 PUBLIC FORCE', pinStyle: 'tape', trigger: { wordText: 'thousand', occurrence: 1 } },
                                { id: 'pz_force', type: 'panZoom', ...zoomTo('mid-right', 1.5), duration: 0.9, trigger: { afterId: 'img_force', offset: 0.15 } },
                                { id: 'pz_out1', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'img_force', offset: 0.6 } },
                                { id: 'arr1', type: 'arrow', x1: 300, y1: 820, x2: 780, y2: 820, color: '#a93226', curve: 30, trigger: { afterId: 'pz_out1', offset: 0.1 } },
                                { id: 'img_mc', type: 'photo', src: imgMotorcycleClub, slot: 'low-center', width: 400, height: 260, caption: 'ORGANIZED GROUP\nWITH RIFLES + TRUCKS', pinStyle: 'pins', trigger: { wordText: 'trucks', occurrence: 1 } },
                                { id: 'pz_mc', type: 'panZoom', ...zoomTo('low-center', 1.5), duration: 1.0, trigger: { afterId: 'img_mc', offset: 0.15 } },
                                { id: 'sc1', type: 'circle', target: 'img_mc', color: '#a93226', trigger: { afterId: 'pz_mc', offset: 0.3 } },
                                { id: 'pz_out1b', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'sc1', offset: 0.4 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 2 — #2: Iceland ─────────────────────────────────────
            {
                tts: {
                    text: "Number two: Iceland. It has never had a standing army in its entire history. Its only armed personnel are a small coast guard, fewer than three hundred people, patrolling with a handful of vessels. Iceland's actual defense depends almost entirely on NATO allies showing up if anything ever went wrong.",
                    voice: 'am_adam', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=weak-s2',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]',
                        fps: 30, viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#2 — ICELAND',
                            theme: commonTheme,
                            commands: [
                                { id: 'num2', type: 'sticker', text: '#2', slot: 'top-left', size: 90, color: '#ffffff', stroke: '#1a5276', bg: '#1a5276', rotate: -3, trigger: { atSeconds: 0.1 } },
                                { id: 'photo2', type: 'photo', src: imgIceland, slot: 'top-center', width: 580, height: 360, rotate: 2, pinStyle: 'tape', caption: 'ICELAND', trigger: { wordText: 'history', occurrence: 1 } },
                                { id: 'pz_p2', type: 'panZoom', ...zoomTo('top-center', 1.4), duration: 1.0, trigger: { afterId: 'photo2', offset: 0.15 } },
                                { id: 'img_cg', type: 'photo', src: imgIcelandCoastGuard, slot: 'mid-left', width: 320, height: 220, caption: '< 300 COAST GUARD', pinStyle: 'tape', trigger: { wordText: 'hundred', occurrence: 1 } },
                                { id: 'pz_cg', type: 'panZoom', ...zoomTo('mid-left', 1.6), duration: 0.9, trigger: { afterId: 'img_cg', offset: 0.15 } },
                                { id: 's5', type: 'sticker', text: 'DEFENSE =\nNATO ALLIES', slot: 'mid-right', size: 46, color: '#1a1a1a', stroke: '#ffffff', rotate: -2, trigger: { wordText: 'nato', occurrence: 1 } },
                                { id: 'pz_s5', type: 'panZoom', ...zoomTo('mid-right', 1.5), duration: 0.9, trigger: { afterId: 's5', offset: 0.15 } },
                                { id: 'pz_out2', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 's5', offset: 0.6 } },
                                { id: 'img_swat', type: 'photo', src: imgSwatGeneric, slot: 'low-center', width: 400, height: 260, caption: 'A SINGLE TACTICAL TEAM\nOUTNUMBERS THE NAVY', pinStyle: 'pins', trigger: { wordText: 'wrong', occurrence: 1 } },
                                { id: 'pz_swat', type: 'panZoom', ...zoomTo('low-center', 1.5), duration: 1.0, trigger: { afterId: 'img_swat', offset: 0.15 } },
                                { id: 'sc2', type: 'circle', target: 'img_swat', color: '#a93226', trigger: { afterId: 'pz_swat', offset: 0.3 } },
                                { id: 'pz_out2b', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'sc2', offset: 0.4 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 3 — #1: Liechtenstein ───────────────────────────────
            {
                tts: {
                    text: "And number one: Liechtenstein. In 1868, it did something no other country has done quite so completely — it disbanded its entire army, and never rebuilt one. Today its only armed personnel are roughly ninety police officers, for the whole nation. A single well-organized armed group could realistically walk in completely unopposed.",
                    voice: 'am_adam', pauseAfter: 0.4,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=weak-s3',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]',
                        fps: 30, viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: '#1 — LIECHTENSTEIN',
                            theme: commonTheme,
                            commands: [
                                { id: 'num3', type: 'sticker', text: '#1', slot: 'top-left', size: 90, color: '#ffffff', stroke: '#a93226', bg: '#a93226', rotate: -3, trigger: { atSeconds: 0.1 } },
                                { id: 'photo3', type: 'photo', src: imgLiechtenstein, slot: 'top-center', width: 600, height: 380, rotate: -3, pinStyle: 'tape', caption: 'LIECHTENSTEIN', trigger: { wordText: '1868', occurrence: 1 } },
                                { id: 'pz_p3', type: 'panZoom', ...zoomTo('top-center', 1.4), duration: 1.0, trigger: { afterId: 'photo3', offset: 0.15 } },
                                { id: 's7', type: 'sticker', text: 'DISBANDED ITS\nARMY. FOR GOOD.', slot: 'mid-left', size: 44, color: '#ffffff', stroke: '#a93226', bg: '#a93226', rotate: 2, trigger: { wordText: 'disbanded', occurrence: 1 } },
                                { id: 'pz_s7', type: 'panZoom', ...zoomTo('mid-left', 1.5), duration: 0.9, trigger: { afterId: 's7', offset: 0.15 } },
                                { id: 'img_pol', type: 'photo', src: imgLiechtensteinPolice, slot: 'mid-right', width: 320, height: 220, caption: '~90 POLICE\nFOR THE WHOLE COUNTRY', pinStyle: 'tape', trigger: { wordText: 'ninety', occurrence: 1 } },
                                { id: 'pz_pol', type: 'panZoom', ...zoomTo('mid-right', 1.6), duration: 0.9, trigger: { afterId: 'img_pol', offset: 0.15 } },
                                { id: 'pz_out3', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'img_pol', offset: 0.6 } },
                                { id: 'img_sec', type: 'photo', src: imgPrivateSecurity, slot: 'low-center', width: 400, height: 260, caption: 'ONE ORGANIZED GROUP.\nUNOPPOSED.', pinStyle: 'pins', trigger: { wordText: 'unopposed', occurrence: 1 } },
                                { id: 'pz_sec', type: 'panZoom', ...zoomTo('low-center', 1.5), duration: 1.0, trigger: { afterId: 'img_sec', offset: 0.15 } },
                                { id: 'sc3', type: 'circle', target: 'img_sec', color: '#a93226', trigger: { afterId: 'pz_sec', offset: 0.3 } },
                                { id: 'pz_out3b', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'sc3', offset: 0.4 } },
                            ],
                        },
                    },
                ],
            },

            // ── Scene 4 — CLOSING (even-handed, not just mockery) ────────
            {
                tts: {
                    text: "None of this means these countries are unsafe. Most of them rely on neighbors, treaties, or simple geography instead of guns. But it does mean the next time someone says no country could ever be invaded, remember — some countries couldn't even stop a determined, organized group. Subscribe for more facts nobody tells you.",
                    voice: 'am_adam', pauseAfter: 0.3,
                },
                captions: false,
                layers: [
                    { type: 'background', color: '#e8dfcd' },
                    {
                        type: 'html-record',
                        src: './ApexCasing/paper-sticker-explainer.html?tag=weak-cta',
                        audioSync: true, cursor: false, waitFor: '[data-ready="1"]',
                        fps: 30, viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        data: {
                            title: 'THE REAL PICTURE',
                            theme: commonTheme,
                            commands: [
                                { id: 'note1', type: 'sticker', text: 'NOT UNSAFE.\nJUST UNARMED.', slot: 'banner-top', size: 56, color: '#1a1a1a', stroke: '#ffffff', trigger: { atSeconds: 0.1 } },
                                { id: 'note2', type: 'label', text: 'treaties, neighbors, and geography\ndo the job guns usually would', slot: 'banner-mid', size: 34, trigger: { wordText: 'geography', occurrence: 1 } },
                                { id: 'pz_note', type: 'panZoom', toScale: 1.1, toX: 0, toY: -30, duration: 1.0, trigger: { afterId: 'note2', offset: 0.3 } },
                                { id: 'cta1', type: 'sticker', text: '🔔 SUBSCRIBE\nFOR MORE', slot: 'banner-bot', size: 78, color: '#ffffff', stroke: '#1a5276', bg: '#1a5276', rotate: 0, trigger: { wordText: 'subscribe', occurrence: 1 } },
                                { id: 'sc_cta', type: 'circle', target: 'cta1', color: '#1a5276', trigger: { afterId: 'cta1', offset: 0.3 } },
                                { id: 'pz_out_final', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'sc_cta', offset: 0.4 } },
                            ],
                        },
                    },
                ],
            },
        ],
    };
})();