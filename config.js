// trailer-jets-unstable-by-design.js
// Short "trailer" cut — teases the long-form video, CTA points to full video
// on channel. Built for max swipe-past-hook retention: tight TTS, real
// footage from the long-form video (not stills), punchy captions.
//
// All 4 clips are direct catbox.moe URLs you already used on the long
// version — these go straight into `type: 'video'` layers via the generic
// url/path path in src/video-source.js (Phase 1.05), no NARA/search lookup
// needed since you're supplying the exact source yourself this time.
//
// Run with:  VIDEO_CONFIG=trailer-jets-unstable-by-design.js node engine-ci.js

const CLIPS = {
    hookOne: 'https://files.catbox.moe/k9hznr.mp4',   // 4s — "For hookOne"
    jetCorrection: 'https://files.catbox.moe/7aus2m.mp4', // 8s — jet correction
    hookTwo: 'https://files.catbox.moe/kff6id.mp4',   // 4s — "For hook2"
    cockpitToExternal: 'https://files.catbox.moe/v0y351.mp4', // 3.1MB — cockpit → flight computer → smooth response
};

module.exports = {
    output: {
        title: 'jets-unstable-trailer',
        format: 'portrait',
        fps: 30,
        crf: 23,
        preset: 'medium',
    },

    defaults: {
        voice: 'bm_george',
        transition: 'fade',
        transitionDuration: 0.2,
    },

    scenes: [
        // ── Scene 1 — Hook (must win the swipe in <2s) ──────────────
        {
            tts: {
                text: "This fighter jet is designed to fall out of the sky. On purpose.",
                voice: 'bm_george',
                pauseAfter: 0.2,
            },
            captions: {
                style: 'highlight', fontSize: 62, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'video', url: CLIPS.hookOne,
                    loop: true, fps: 30,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.25)' },
                {
                    type: 'text', text: 'BUILT TO CRASH\nBY DESIGN', x: 540, y: 220,
                    fontSize: 68, fontFamily: 'Arial Black, sans-serif',
                    color: '#f5c518', align: 'center', hookLayer: true,
                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                },
            ],
        },

        // ── Scene 2 — Raise the stakes, withhold the mechanism ──────
        {
            tts: {
                text: "It's not a flaw. It's not a malfunction. It's on purpose — and there's only one thing standing between this jet and a crash.",
                voice: 'bm_george',
                pauseAfter: 0.2,
            },
            captions: {
                style: 'highlight', fontSize: 60, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'video', url: CLIPS.jetCorrection,
                    loop: true, fps: 30,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.2)' },
                {
                    type: 'text', text: 'ONE THING KEEPS\nIT IN THE AIR', x: 540, y: 1550,
                    fontSize: 54, fontFamily: 'Arial Black, sans-serif',
                    color: '#ffffff', align: 'center',
                    stroke: true, strokeColor: '#000', strokeWidth: 4,
                },
            ],
        },

        // ── Scene 3 — Deepen the cliffhanger, still no resolution ───
        {
            tts: {
                text: "Look inside the cockpit and you'll see it happening in real time. What's actually keeping this jet from tumbling out of the sky? Most pilots don't even fully explain it.",
                voice: 'bm_george',
                pauseAfter: 0.2,
            },
            captions: {
                style: 'highlight', fontSize: 60, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'video', url: CLIPS.cockpitToExternal,
                    loop: true, fps: 30,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.2)' },
                {
                    type: 'text', text: 'WATCH WHAT\nHAPPENS INSIDE', x: 540, y: 1520,
                    fontSize: 52, fontFamily: 'Arial Black, sans-serif',
                    color: '#f5c518', align: 'center',
                    stroke: true, strokeColor: '#000', strokeWidth: 4,
                },
            ],
        },

        // ── Scene 4 — CTA ────────────────────────────────────────────
        {
            tts: {
                text: "Watch the full video on my channel to see exactly how it works.",
                voice: 'bm_george',
                pauseAfter: 0.2,
            },
            captions: {
                style: 'highlight', fontSize: 60, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'video', url: CLIPS.hookTwo,
                    loop: true, fps: 30,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
                {
                    type: 'text', text: 'WATCH THE FULL\nVIDEO ON MY\nCHANNEL', x: 540, y: 900,
                    fontSize: 58, fontFamily: 'Arial Black, sans-serif',
                    color: '#ffffff', align: 'center',
                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                },
            ],
        },
    ],
};
