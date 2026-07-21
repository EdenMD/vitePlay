// config.divide-by-infinity.js  (v3 — fixed clash, added SerpAPI, cursor off)
// "Why infinite life erases meaning" — the study hook (people can't answer
// what they'd DO in heaven forever) into the math translation (value needs
// an edge; 70/∞ collapses because measurement itself needs a boundary).
//
// Changes from v2, per your last message:
//   - THE CLASH FIX: Scene 1 had `captions: true` (auto karaoke captions,
//     bottom-center by default) running AT THE SAME TIME as four manual
//     text layers already sitting in that same bottom half of the frame
//     (y: 820-1120). Two text systems drawing overlapping words in the
//     same region was the actual clash — not a spacing problem. Fixed by
//     turning off auto-captions in scene 1, since the hand-timed on-screen
//     text already does that job. Scene 2/3 never had this (captions:false
//     already), left alone.
//   - Manual y-guessing replaced with `layout: { type: 'linear' }` for the
//     stacked text group, title pinned separately via `noLayout: true` —
//     per src/layout.js's own documented pattern. No more hand-placed
//     y-values that can silently start overlapping the moment font size
//     or line count changes.
//   - stock-image (SerpAPI) added as the actual background in scenes 1 and
//     3, replacing the flat gradient-only look, with the gradient kept as
//     a legibility overlay on top of the photo rather than the whole
//     background.
//   - `cursor: false` added to the html-record layer in scene 2 — it was
//     missing entirely before.
//
// Run with:  VIDEO_CONFIG=config.divide-by-infinity.js node engine-ci.js

module.exports = {
    output: {
        title:  'divide-by-infinity',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',
        bgMusic:    { mood: 'calm' },
        bgMusicVol: 0.07,
        postProcess: { grain: true, grainStrength: 0.015, vignette: true, vignetteStrength: 0.35 },
    },

    defaults: { voice: 'am_michael', transition: 'fade', transitionDuration: 0.35 },

    scenes: [
        // ── Scene 1 — The study hook, no equation yet ────────────────
        {
            tts: {
                text: "Researchers once asked a hundred people what they wanted most out of life. The most common answer: live well, then go to heaven. But then they asked a follow up question. What will you actually do there, forever? Most people had no answer. That's the flaw hiding inside infinite paradise. Humans don't actually know how to enjoy something that never ends.",
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            captions: false,   // was `true` — this was the clash. Scene already
                                // has hand-timed on-screen text doing this job.
            layout: {
                type:    'linear',
                x:       540,
                y:       800,     // top of the first stacked child
                gap:     36,
                align:   'center',
                padding: [48, 60],
            },
            layers: [
                { type: 'stock-image', query: 'night sky stars', orientation: 'portrait',
                  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                  kenBurns: 'zoom-in', kenBurnsAmount: 0.14, noLayout: true },
                { type: 'gradient', gradientType: 'linear',
                  colors: ['rgba(10,4,16,0.55)', 'rgba(26,10,32,0.88)'], angle: 150, noLayout: true },

                // Pinned separately — not part of the auto-stacked group below
                {
                    type: 'text', text: 'WHY INFINITE LIFE ERASES MEANING',
                    x: 540, y: 190, fontSize: 36, noLayout: true,
                    fontFamily: 'Arial Black, sans-serif', color: '#c77dff', align: 'center', hookLayer: true,
                },

                // Auto-stacked — layout computes real y for each, no clash possible
                {
                    type: 'text', text: '100 PEOPLE ASKED:', fontSize: 34,
                    fontFamily: 'Arial, sans-serif', color: 'rgba(255,255,255,0.7)', align: 'center',
                },
                {
                    type: 'text', text: '"What will you do in\nheaven... forever?"', fontSize: 46,
                    fontFamily: 'Arial Black, sans-serif', color: '#ffffff', align: 'center',
                },
                {
                    type: 'text', text: 'Most had no answer.', fontSize: 38,
                    fontFamily: 'Arial, sans-serif', color: '#ff5555', align: 'center',
                },
            ],
        },

        // ── Scene 2 — The math: value needs an edge ──────────────────
        {
            tts: {
                text: "Here's the math behind that discomfort. Something only has value if it has an edge, a limit, an end. Take your seventy years and divide them by infinity. The fraction collapses toward zero. Not because your life is worthless, but because infinity has no edge to measure against. Endless time doesn't add meaning, it erases the need for it, because meaning is built from limits, from urgency, from the fact that it runs out.",
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            captions: false,
            layers: [
                { type: 'background', color: '#0a0a12', noise: true, noiseOpacity: 0.03 },
                {
                    type:      'html-record',
                    src:       './ApexCasing/math-latex-explainer.html?tag=div-inf-3v3',
                    audioSync: true,
                    cursor:    false,   // was missing — this stops the mouse
                                        // cursor from being baked into the recording
                    data: {
                        theme: { accent: '#ff5555', text: '#ffffff' },
                        commands: [
                            { id: 'eq1', type: 'write', latex: '\\dfrac{70}{\\infty}', x: 540, y: 720, size: 68,
                              trigger: { wordText: 'infinity', occurrence: 1 } },

                            { id: 'hl1', type: 'highlight', target: 'eq1',
                              trigger: { wordText: 'zero', occurrence: 1 } },

                            { id: 'eq2', type: 'write', latex: '\\dfrac{70}{\\infty} \\;\\longrightarrow\\; 0',
                              x: 540, y: 900, size: 56,
                              trigger: { afterId: 'hl1', offset: 0.4 } },

                            { id: 'hl2', type: 'highlight', target: 'eq2', holdSec: 1.2,
                              trigger: { wordText: 'worthless', occurrence: 1 } },

                            { id: 'clr', type: 'clearAll',
                              trigger: { afterId: 'hl2', offset: 1.3 } },

                            { id: 'final', type: 'write', latex: '\\text{no edge} \\;=\\; \\text{no meaning}',
                              x: 540, y: 900, size: 50,
                              trigger: { wordText: 'urgency', occurrence: 1 } },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    duration: 14,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },

        // ── Scene 3 — Subscribe CTA with a Giphy sticker ─────────────
        {
            tts: {
                text: "Subscribe and like this video for more.",
                voice: 'am_michael',
                pauseAfter: 0.4,
            },
            captions: false,
            layout: {
                type:    'linear',
                x:       540,
                y:       1420,
                gap:     20,
                align:   'center',
            },
            layers: [
                { type: 'stock-image', query: 'purple nebula', orientation: 'portrait',
                  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                  kenBurns: 'drift', kenBurnsAmount: 0.12, noLayout: true },
                { type: 'gradient', gradientType: 'linear',
                  colors: ['rgba(10,4,16,0.5)', 'rgba(26,10,32,0.85)'], angle: 150, noLayout: true },
                {
                    type:    'giphy',
                    query:   'subscribe animation',
                    sticker: true,
                    resultIndex: 0,
                    x: 190, y: 620,
                    width: 700, height: 700,
                    fit: 'contain',
                    noLayout: true,   // fixed hero position, not part of the CTA text stack
                },

                // Auto-stacked CTA text — no manual y-guessing
                {
                    type: 'text', text: 'SUBSCRIBE', fontSize: 64,
                    fontFamily: 'Arial Black, sans-serif', color: '#ffffff', align: 'center',
                },
                {
                    type: 'text', text: 'LIKE THIS VIDEO FOR MORE', fontSize: 34,
                    fontFamily: 'Arial, sans-serif', color: 'rgba(255,255,255,0.75)', align: 'center',
                },
            ],
        },
    ],
};