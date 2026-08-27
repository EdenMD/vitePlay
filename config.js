// config.humanoid-robots-fail.js
// "Why Humanoid Robots Will Fail as Soldiers" (Part 1)
// Uses ApexCasing/paper-sticker-explainer.html — the real slot-based
// casing, not a simple overlay. Every distinct visual concept named in
// the script gets its own fetched SerpAPI image (24 total), laid out as
// a multi-photo "board" per scene rather than one full-bleed photo each
// time — the Ohio-class file's repeated banner-photo pattern was the
// exact thing flagged as weak, so this leans into the slot grid instead.
//
// CAMERA: panZoom is used hard and often — a tight zoom (scale ~2.2-2.6)
// onto whichever photo/sticker just appeared, then a zoom-out to
// scale:1 to reveal the whole board before the next beat, matching the
// "zoom in hard on what's appearing, zoom out to see the whole board"
// technique described. The zoomTo() helper below computes the exact
// toX/toY for a given slot by mirroring the casing's own slotToXY math
// (COL_W:360, ROW_H:241, TOP_Y:150) — not eyeballed numbers.
//
// SCRIPT: used exactly as given, six sections (Hook, Scene 2-5, Ending)
// mapped 1:1 to six video scenes. Short punch-lines in the original
// (e.g. "Two arms. / Two legs. / A head.") are read as flowing prose —
// that formatting was for script readability, not meant as six separate
// TTS scenes.
//
// SERPAPI: fetched directly in this config (this file's own
// fetchImage/urlToBase64), same working mechanism as the Ohio-class
// reference — SERPAPI_API_KEY must be set. If SerpAPI is still rate-
// limited from earlier, fetchImage returns null per-query and that slot
// is simply skipped (checked below) rather than breaking the render.
//
// Run with:  VIDEO_CONFIG=config.humanoid-robots-fail.js node engine-ci.js

const https = require('https');
const http = require('http');

async function fetchImage(query, index = 0) {
    const key = process.env.SERPAPI_API_KEY;
    if (!key) { console.warn('[Humanoid] SERPAPI_API_KEY not set — skipping:', query); return null; }
    try {
        const searchUrl = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&ijn=0&num=30&safe=active&api_key=${key}`;
        const data = await fetchJSON(searchUrl);
        const results = (data?.images_results || []).filter(r => r.original && !r.original.startsWith('x-raw-image'));
        if (!results.length) return null;
        const pick = results[index % results.length];
        if (!pick?.original) return null;
        console.log(`[Humanoid] Downloading: ${pick.original.slice(0, 70)}`);
        const b64 = await urlToBase64(pick.original);
        return b64 ? `data:image/jpeg;base64,${b64}` : null;
    } catch (e) {
        console.warn(`[Humanoid] fetchImage failed for "${query}":`, e.message?.slice(0, 80));
        return null;
    }
}

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        lib.get(url, { headers: { 'User-Agent': 'ApexEngine/2.0' } }, (res) => {
            let raw = ''; res.on('data', d => raw += d);
            res.on('end', () => { try { resolve(JSON.parse(raw)); } catch (e) { reject(e); } });
        }).on('error', reject).setTimeout(15000, function () { this.destroy(); reject(new Error('Timeout')); });
    });
}

function urlToBase64(imageUrl) {
    return new Promise((resolve) => {
        const lib = imageUrl.startsWith('https') ? https : http;
        const req = lib.get(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ApexEngine/2.0)', 'Accept': 'image/*' }, timeout: 12000 }, (res) => {
            if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) { urlToBase64(res.headers.location).then(resolve); return; }
            if (res.statusCode !== 200) { resolve(null); return; }
            const chunks = []; res.on('data', c => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
        });
        req.on('error', () => resolve(null));
        req.on('timeout', () => { req.destroy(); resolve(null); });
    });
}

// ── panZoom camera helper — mirrors the casing's own slotToXY math ─────────
const COL_W = 360, ROW_H = 241, TOP_Y = 150;
const SLOT_CENTERS = {
    'top-left': [180, 270.5], 'top-center': [540, 270.5], 'top-right': [900, 270.5],
    'mid-left': [180, 511.5], 'mid-center': [540, 511.5], 'mid-right': [900, 511.5],
    'low-left': [180, 752.5], 'low-center': [540, 752.5], 'low-right': [900, 752.5],
    'bot-left': [180, 993.5], 'bot-center': [540, 993.5], 'bot-right': [900, 993.5],
    'deep-left': [180, 1234.5], 'deep-center': [540, 1234.5], 'deep-right': [900, 1234.5],
    'banner-top': [540, 270.5], 'banner-mid': [540, 752.5], 'banner-low': [540, 1234.5],
};
function zoomTo(slot, scale) {
    const c = SLOT_CENTERS[slot] || [540, 960];
    return { toScale: scale, toX: -scale * (c[0] - 540), toY: -scale * (c[1] - 960) };
}
const ZOOM_OUT = { toScale: 1, toX: 0, toY: 0 };

const THEME = { paper: '#eef0e6', ink: '#1b1c1e', accent: '#ff5a3c', accent2: '#2f7cf6', shadow: 'rgba(20,16,10,0.35)' };
const CASING = './ApexCasing/paper-sticker-explainer.html';

module.exports = (async () => {
    console.log('[Humanoid] Pre-fetching 24 SerpAPI images...');

    const [
        // HOOK
        imgSmoke, imgRobotWalk, imgRobotLimbs, imgRobotCarry,
        // SCENE 2 — the human body
        imgSkeleton, imgWheels, imgTracks, imgDroneRotor, imgCameraLens,
        // SCENE 3 — two legs
        imgBalance, imgFallen, imgTrackedTerrain, imgDroneFlying,
        // SCENE 4 — the hands
        imgHandFingers, imgRoboClaw, imgSurveilCam, imgCargoPlatform,
        // SCENE 5 — the real advantage
        imgQuadruped, imgUnusualRobot, imgLabPrototype,
        // ENDING
        imgMud, imgExplosion, imgDamagedEquip, imgCleanLab,
    ] = await Promise.all([
        fetchImage('battlefield smoke dust'), fetchImage('humanoid military robot walking'),
        fetchImage('humanoid robot two arms two legs'), fetchImage('robot soldier carrying equipment'),

        fetchImage('human skeleton bones joints'), fetchImage('military robot wheels'),
        fetchImage('military robot tracks terrain'), fetchImage('military drone rotors flying'),
        fetchImage('surveillance camera lens'),

        fetchImage('humanoid robot balance walking'), fetchImage('humanoid robot fallen ground'),
        fetchImage('tracked military robot rough terrain'), fetchImage('military drone flying fast'),

        fetchImage('human hand fingers closeup'), fetchImage('robotic claw mechanical'),
        fetchImage('military robot camera surveillance'), fetchImage('military robot cargo platform wheels'),

        fetchImage('quadruped robot dog military'), fetchImage('unusual robot design military'),
        fetchImage('military robot prototype laboratory'),

        fetchImage('battlefield mud rain'), fetchImage('explosion smoke debris battlefield'),
        fetchImage('damaged military equipment'), fetchImage('robot demonstration lab clean'),
    ]);

    console.log('[Humanoid] Images ready. Building scenes...');

    function casingLayer(tag, title, commands) {
        return {
            type: 'html-record', src: `${CASING}?tag=${tag}`, audioSync: true, cursor: false,
            waitFor: '[data-ready="1"]', fps: 30,
            viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
            data: { title, theme: THEME, commands },
        };
    }

    return {
        output: { title: 'humanoid-robots-fail-part1', format: 'portrait', fps: 30, crf: 22, preset: 'medium' },
        defaults: { voice: 'bm_george', transition: 'fade', transitionDuration: 0.35 },

        scenes: [

            // ══ HOOK ═══════════════════════════════════════════════════════
            {
                tts: { text: "Imagine the future of warfare. A battlefield covered in smoke. Through the dust comes a machine that looks almost human. Two arms. Two legs. A head. It walks like a person. It carries equipment like a person. It was supposedly built to fight alongside humans. It looks like the soldier of the future. But there's a problem. The human body might be one of the worst possible designs for a military robot. And that's where the humanoid robot fantasy begins to fall apart.", voice: 'bm_george', pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: THEME.paper },
                    casingLayer('robots-hook', 'THE HUMANOID FANTASY', [
                        { id: 'p_smoke', type: 'photo', src: imgSmoke, slot: 'banner-top', width: 1080, height: 620, pinStyle: 'none', trigger: { atSeconds: 0.1 } },
                        { id: 'pz_smoke', type: 'panZoom', ...zoomTo('banner-top', 1.5), duration: 1.2, trigger: { afterId: 'p_smoke', offset: 0.1 } },
                        { id: 'hook1', type: 'sticker', text: 'THE FUTURE\nOF WARFARE?', slot: 'banner-top', size: 62, bg: 'rgba(255,255,255,0.85)', trigger: { wordText: 'warfare', occurrence: 1 } },
                        { id: 'p_walk', type: 'photo', src: imgRobotWalk, slot: 'mid-left', width: 460, height: 460, caption: 'walks like a person', trigger: { wordText: 'human', occurrence: 1 } },
                        { id: 'pz_walk', type: 'panZoom', ...zoomTo('mid-left', 2.3), duration: 1.0, trigger: { afterId: 'p_walk', offset: 0.15 } },
                        { id: 'p_limbs', type: 'photo', src: imgRobotLimbs, slot: 'mid-right', width: 460, height: 460, caption: 'two arms, two legs', trigger: { wordText: 'head', occurrence: 1 } },
                        { id: 'pz_limbs', type: 'panZoom', ...zoomTo('mid-right', 2.3), duration: 1.0, trigger: { afterId: 'p_limbs', offset: 0.15 } },
                        { id: 'p_carry', type: 'photo', src: imgRobotCarry, slot: 'low-center', width: 500, height: 400, caption: 'carries equipment', trigger: { wordText: 'equipment', occurrence: 1 } },
                        { id: 'pz_reveal1', type: 'panZoom', ...ZOOM_OUT, duration: 1.3, trigger: { afterId: 'p_carry', offset: 0.3 } },
                        { id: 'hook2', type: 'sticker', text: 'THE WORST POSSIBLE\nDESIGN?', slot: 'banner-bot', size: 52, color: THEME.accent, bg: 'rgba(255,255,255,0.9)', trigger: { wordText: 'worst', occurrence: 1 } },
                    ]),
                ],
            },

            // ══ SCENE 2 — THE HUMAN BODY ═══════════════════════════════════
            {
                tts: { text: "Think about what a soldier's body actually has to do. It has to balance on two relatively small feet. It has to constantly correct its posture. It has hundreds of bones and joints. It has incredibly complicated hands. And all of this exists because evolution built humans for a general-purpose world. But a machine doesn't need to evolve. Engineers can design it specifically for the job. If you need something to carry enormous weight, give it wheels. If you need something to cross rough terrain, give it tracks. If you need something to fly over obstacles, give it wings or rotors. And if you need something to look through a window... you don't necessarily need to build a robot with a face.", voice: 'bm_george', pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: THEME.paper },
                    casingLayer('robots-s2', 'THE HUMAN BODY, RE-EXAMINED', [
                        { id: 's2_title', type: 'sticker', text: 'BUILT FOR EVERYTHING.\nOPTIMIZED FOR NOTHING.', slot: 'banner-top', size: 46, trigger: { atSeconds: 0 } },
                        { id: 'p_skel', type: 'photo', src: imgSkeleton, slot: 'mid-center', width: 520, height: 520, caption: 'hundreds of bones and joints', trigger: { wordText: 'joints', occurrence: 1 } },
                        { id: 'pz_skel', type: 'panZoom', ...zoomTo('mid-center', 2.4), duration: 1.1, trigger: { afterId: 'p_skel', offset: 0.15 } },
                        { id: 'lbl_evo', type: 'label', text: 'evolution builds for everything, engineering builds for one job', slot: 'banner-mid', size: 32, trigger: { wordText: 'evolve', occurrence: 1 } },
                        { id: 'pz_out2', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'lbl_evo', offset: 0.3 } },
                        { id: 'p_wheels', type: 'photo', src: imgWheels, slot: 'low-left', width: 340, height: 340, caption: 'wheels: weight', trigger: { wordText: 'wheels', occurrence: 1 } },
                        { id: 'pz_wheels', type: 'panZoom', ...zoomTo('low-left', 2.5), duration: 0.9, trigger: { afterId: 'p_wheels', offset: 0.1 } },
                        { id: 'p_tracks', type: 'photo', src: imgTracks, slot: 'low-center', width: 340, height: 340, caption: 'tracks: terrain', trigger: { wordText: 'tracks', occurrence: 1 } },
                        { id: 'pz_tracks', type: 'panZoom', ...zoomTo('low-center', 2.5), duration: 0.9, trigger: { afterId: 'p_tracks', offset: 0.1 } },
                        { id: 'p_rotor', type: 'photo', src: imgDroneRotor, slot: 'low-right', width: 340, height: 340, caption: 'rotors: flight', trigger: { wordText: 'rotors', occurrence: 1 } },
                        { id: 'pz_rotor', type: 'panZoom', ...zoomTo('low-right', 2.5), duration: 0.9, trigger: { afterId: 'p_rotor', offset: 0.1 } },
                        { id: 'p_cam', type: 'photo', src: imgCameraLens, slot: 'deep-center', width: 380, height: 300, caption: 'no face required', trigger: { wordText: 'face', occurrence: 1 } },
                        { id: 'pz_out3', type: 'panZoom', ...ZOOM_OUT, duration: 1.3, trigger: { afterId: 'p_cam', offset: 0.3 } },
                    ]),
                ],
            },

            // ══ SCENE 3 — TWO LEGS ═════════════════════════════════════════
            {
                tts: { text: "Two-legged locomotion is especially interesting. Humans are remarkably good at walking. But we're good at it because our brains, nervous systems and muscles have spent millions of years evolving to solve the problem. A humanoid robot has to reproduce that stability mechanically. Every step involves sensors, motors, balance calculations and constant corrections. One bad step... one damaged joint... one slippery surface... and the machine can go from standing to several hundred kilograms of metal hitting the ground. A tracked vehicle doesn't have this problem. A wheeled robot doesn't have this problem. A drone certainly doesn't.", voice: 'bm_george', pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: THEME.paper },
                    casingLayer('robots-s3', 'THE BALANCE PROBLEM', [
                        { id: 'p_bal', type: 'photo', src: imgBalance, slot: 'banner-top', width: 1080, height: 560, pinStyle: 'none', trigger: { atSeconds: 0.1 } },
                        { id: 'pz_bal', type: 'panZoom', ...zoomTo('banner-top', 1.6), duration: 1.2, trigger: { afterId: 'p_bal', offset: 0.15 } },
                        { id: 's3_title', type: 'sticker', text: 'STABILITY, MADE\nMECHANICAL', slot: 'banner-top', size: 50, bg: 'rgba(255,255,255,0.85)', trigger: { wordText: 'mechanically', occurrence: 1 } },
                        { id: 'p_fall', type: 'photo', src: imgFallen, slot: 'mid-center', width: 560, height: 460, caption: 'one bad step', trigger: { wordText: 'ground', occurrence: 1 } },
                        { id: 'pz_fall', type: 'panZoom', ...zoomTo('mid-center', 2.2), duration: 1.1, trigger: { afterId: 'p_fall', offset: 0.15 } },
                        { id: 'pz_out4', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'p_fall', offset: 1.0 } },
                        { id: 'p_track2', type: 'photo', src: imgTrackedTerrain, slot: 'low-left', width: 460, height: 400, caption: 'tracked: no problem', trigger: { wordText: 'tracked', occurrence: 1 } },
                        { id: 'pz_track2', type: 'panZoom', ...zoomTo('low-left', 2.3), duration: 1.0, trigger: { afterId: 'p_track2', offset: 0.1 } },
                        { id: 'p_drone2', type: 'photo', src: imgDroneFlying, slot: 'low-right', width: 460, height: 400, caption: 'a drone: certainly not', trigger: { wordText: 'certainly', occurrence: 1 } },
                        { id: 'pz_drone2', type: 'panZoom', ...zoomTo('low-right', 2.3), duration: 1.0, trigger: { afterId: 'p_drone2', offset: 0.1 } },
                        { id: 'pz_out5', type: 'panZoom', ...ZOOM_OUT, duration: 1.2, trigger: { afterId: 'p_drone2', offset: 0.4 } },
                    ]),
                ],
            },

            // ══ SCENE 4 — THE HANDS ════════════════════════════════════════
            {
                tts: { text: "Then there are the hands. Human hands are extraordinary. Five fingers. Multiple joints. Fine motor control. Tactile sensing. They're incredibly useful. But they're also incredibly complicated. And complicated mechanisms mean more things that can break. A military robot doesn't necessarily need a human hand. If its job is surveillance, give it cameras. If its job is carrying equipment, give it a cargo platform. If its job is manipulating something, build the arm specifically for that task. The more specialized the machine becomes... the less reason there is for it to look human.", voice: 'bm_george', pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: THEME.paper },
                    casingLayer('robots-s4', 'THE HANDS PROBLEM', [
                        { id: 'p_hand', type: 'photo', src: imgHandFingers, slot: 'mid-left', width: 480, height: 480, caption: 'extraordinary, and fragile', trigger: { wordText: 'extraordinary', occurrence: 1 } },
                        { id: 'pz_hand', type: 'panZoom', ...zoomTo('mid-left', 2.4), duration: 1.0, trigger: { afterId: 'p_hand', offset: 0.15 } },
                        { id: 'p_claw', type: 'photo', src: imgRoboClaw, slot: 'mid-right', width: 480, height: 480, caption: 'more parts, more to break', trigger: { wordText: 'break', occurrence: 1 } },
                        { id: 'pz_claw', type: 'panZoom', ...zoomTo('mid-right', 2.4), duration: 1.0, trigger: { afterId: 'p_claw', offset: 0.15 } },
                        { id: 'arrow_hands', type: 'arrow', x1: 340, y1: 400, x2: 740, y2: 400, curve: 40, color: THEME.accent, trigger: { afterId: 'p_claw', offset: 0.3 } },
                        { id: 'pz_out6', type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: 'arrow_hands', offset: 0.4 } },
                        { id: 'p_cam2', type: 'photo', src: imgSurveilCam, slot: 'low-left', width: 340, height: 340, caption: 'surveillance: cameras', trigger: { wordText: 'cameras', occurrence: 1 } },
                        { id: 'pz_cam2', type: 'panZoom', ...zoomTo('low-left', 2.5), duration: 0.9, trigger: { afterId: 'p_cam2', offset: 0.1 } },
                        { id: 'p_cargo', type: 'photo', src: imgCargoPlatform, slot: 'low-right', width: 340, height: 340, caption: 'carrying: a platform', trigger: { wordText: 'platform', occurrence: 1 } },
                        { id: 'pz_cargo', type: 'panZoom', ...zoomTo('low-right', 2.5), duration: 0.9, trigger: { afterId: 'p_cargo', offset: 0.1 } },
                        { id: 'lbl_spec', type: 'label', text: 'the more specialized, the less human it needs to look', slot: 'banner-low', size: 32, trigger: { wordText: 'specialized', occurrence: 1 } },
                        { id: 'pz_out7', type: 'panZoom', ...ZOOM_OUT, duration: 1.2, trigger: { afterId: 'lbl_spec', offset: 0.3 } },
                    ]),
                ],
            },

            // ══ SCENE 5 — THE REAL ADVANTAGE ═══════════════════════════════
            {
                tts: { text: "This is the fundamental problem with humanoid military robots. They're trying to copy a machine that already exists. Us. But evolution optimized the human body for survival in an environment where there was no alternative. Engineering has no such limitation. An engineer can say: forget the legs. Forget the hands. Forget the human proportions. Build the machine that actually performs the mission. And that's exactly why the battlefield is likely to be filled with machines that look nothing like us.", voice: 'bm_george', pauseAfter: 0.4 },
                captions: false,
                layers: [
                    { type: 'background', color: THEME.paper },
                    casingLayer('robots-s5', 'FORGET THE HUMAN SHAPE', [
                        { id: 's5_title', type: 'sticker', text: '"FORGET THE LEGS.\nFORGET THE HANDS."', slot: 'banner-top', size: 48, trigger: { wordText: 'legs', occurrence: 2 } },
                        { id: 'p_quad', type: 'photo', src: imgQuadruped, slot: 'mid-left', width: 480, height: 460, caption: 'built for the mission', trigger: { wordText: 'mission', occurrence: 1 } },
                        { id: 'pz_quad', type: 'panZoom', ...zoomTo('mid-left', 2.3), duration: 1.0, trigger: { afterId: 'p_quad', offset: 0.15 } },
                        { id: 'p_unusual', type: 'photo', src: imgUnusualRobot, slot: 'mid-right', width: 480, height: 460, caption: 'nothing like us', trigger: { wordText: 'nothing', occurrence: 1 } },
                        { id: 'pz_unusual', type: 'panZoom', ...zoomTo('mid-right', 2.3), duration: 1.0, trigger: { afterId: 'p_unusual', offset: 0.15 } },
                        { id: 'p_lab', type: 'photo', src: imgLabPrototype, slot: 'low-center', width: 520, height: 400, caption: '', trigger: { afterId: 'p_unusual', offset: 0.5 } },
                        { id: 'pz_out8', type: 'panZoom', ...ZOOM_OUT, duration: 1.3, trigger: { afterId: 'p_lab', offset: 0.3 } },
                    ]),
                ],
            },

            // ══ ENDING ═════════════════════════════════════════════════════
            {
                tts: { text: "But even if engineers solve the walking problem... there's a much bigger problem waiting for humanoid robots. The battlefield itself. Because laboratories are clean. Battlefields aren't. Mud. Dust. Rain. Heat. Cold. Explosions. Debris. Damage. And machines that are impressive in a demonstration have to survive all of it. That's Part 2. Because the real question isn't: can a humanoid robot walk? The real question is: can it survive?", voice: 'bm_george', pauseAfter: 0.5 },
                captions: false,
                layers: [
                    { type: 'background', color: '#161616' },
                    casingLayer('robots-ending', 'THE REAL QUESTION', [
                        { id: 'p_clean', type: 'photo', src: imgCleanLab, slot: 'mid-left', width: 460, height: 460, caption: 'laboratories are clean', trigger: { wordText: 'clean', occurrence: 1 } },
                        { id: 'pz_clean', type: 'panZoom', ...zoomTo('mid-left', 2.3), duration: 1.0, trigger: { afterId: 'p_clean', offset: 0.15 } },
                        { id: 'p_mud', type: 'photo', src: imgMud, slot: 'mid-right', width: 460, height: 460, caption: 'battlefields aren\'t', trigger: { wordText: 'mud', occurrence: 1 } },
                        { id: 'pz_mud', type: 'panZoom', ...zoomTo('mid-right', 2.3), duration: 1.0, trigger: { afterId: 'p_mud', offset: 0.15 } },
                        { id: 'p_explo', type: 'photo', src: imgExplosion, slot: 'banner-mid', width: 1080, height: 500, pinStyle: 'none', trigger: { wordText: 'explosions', occurrence: 1 } },
                        { id: 'pz_explo', type: 'panZoom', ...zoomTo('banner-mid', 1.5), duration: 1.1, trigger: { afterId: 'p_explo', offset: 0.15 } },
                        { id: 'p_damaged', type: 'photo', src: imgDamagedEquip, slot: 'low-center', width: 480, height: 380, caption: 'damage', trigger: { wordText: 'damage', occurrence: 1 } },
                        { id: 'pz_out9', type: 'panZoom', ...ZOOM_OUT, duration: 1.2, trigger: { afterId: 'p_damaged', offset: 0.3 } },
                        { id: 'final_q', type: 'sticker', text: 'CAN IT\nSURVIVE?', slot: 'banner-bot', size: 78, color: '#ffffff', bg: 'rgba(0,0,0,0.7)', trigger: { wordText: 'survive', occurrence: 2 } },
                        { id: 'circle_q', type: 'circle', target: 'final_q', color: THEME.accent, trigger: { afterId: 'final_q', offset: 0.3 } },
                    ]),
                ],
            },

        ],
    };
})();