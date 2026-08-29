// config.divide-by-infinity.js  (v2 — corrected to support the theory, not debunk it)
// "Why infinite life erases meaning" — the study hook (people can't answer
// what they'd DO in heaven forever) into the math translation (value needs
// an edge; 70/∞ collapses because measurement itself needs a boundary).
// am_michael voice, math-latex-explainer for the equation scene only —
// scene 1 is plain text/hook layers since it's narrative, not equation-driven.
//
// Trigger words are matched against the EXACT tts.text below (normalized:
// lowercased, punctuation stripped). If you edit the narration, re-check
// occurrence counts match, or check render logs for "fallback-fired".
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
            captions: true,
            layers: [
                { type: 'gradient', gradientType: 'linear', colors: ['#0a0410', '#1a0a20'], angle: 150 },
                {
                    type: 'text', text: 'WHY INFINITE LIFE ERASES MEANING', x: 540, y: 190, fontSize: 36,
                    fontFamily: 'Arial Black, sans-serif', color: '#c77dff', align: 'center', hookLayer: true,
                },
                {
                    type: 'text', text: '100 PEOPLE ASKED:', x: 540, y: 820, fontSize: 34,
                    fontFamily: 'Arial, sans-serif', color: 'rgba(255,255,255,0.7)', align: 'center',
                },
                {
                    type: 'text', text: '"What will you do in\nheaven... forever?"', x: 540, y: 920, fontSize: 46,
                    fontFamily: 'Arial Black, sans-serif', color: '#ffffff', align: 'center',
                },
                {
                    type: 'text', text: 'Most had no answer.', x: 540, y: 1120, fontSize: 38,
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
                    src:       './ApexCasing/math-latex-explainer.html?tag=div-inf-2v2',
                    audioSync: true,
                    data: {
                        theme: { accent: '#ff5555', text: '#ffffff' },
                        commands: [
                            // "divide them by infinity" — 1st mention of "infinity"
                            { id: 'eq1', type: 'write', latex: '\\dfrac{70}{\\infty}', x: 540, y: 720, size: 68,
                              trigger: { wordText: 'infinity', occurrence: 1 } },

                            // "collapses toward zero" — the fraction resolves
                            { id: 'hl1', type: 'highlight', target: 'eq1',
                              trigger: { wordText: 'zero', occurrence: 1 } },

                            // chained off the highlight — show it actually landing at 0
                            { id: 'eq2', type: 'write', latex: '\\dfrac{70}{\\infty} \\;\\longrightarrow\\; 0',
                              x: 540, y: 900, size: 56,
                              trigger: { afterId: 'hl1', offset: 0.4 } },

                            // "not because your life is worthless" — glow right as the
                            // narration reassures, then subverts that reassurance
                            { id: 'hl2', type: 'highlight', target: 'eq2', holdSec: 1.2,
                              trigger: { wordText: 'worthless', occurrence: 1 } },

                            // clear before the closing statement
                            { id: 'clr', type: 'clearAll',
                              trigger: { afterId: 'hl2', offset: 1.3 } },

                            // "from urgency" — the closing line, ties limit = meaning together
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
            layers: [
                { type: 'gradient', gradientType: 'linear', colors: ['#0a0410', '#1a0a20'], angle: 150 },
                {
                    type:    'giphy',
                    query:   'subscribe animation',
                    sticker: true,                     // transparent background, floats over the gradient
                    resultIndex: 0,                     // top search result — bump to 1, 2, etc. to try alternates
                    x: 190, y: 620,
                    width: 700, height: 700,
                    fit: 'contain',
                },
                {
                    type: 'text', text: 'SUBSCRIBE', x: 540, y: 1420, fontSize: 64,
                    fontFamily: 'Arial Black, sans-serif', color: '#ffffff', align: 'center',
                },
                {
                    type: 'text', text: 'LIKE THIS VIDEO FOR MORE', x: 540, y: 1500, fontSize: 34,
                    fontFamily: 'Arial, sans-serif', color: 'rgba(255,255,255,0.75)', align: 'center',
                },
            ],
        },
    ],
};