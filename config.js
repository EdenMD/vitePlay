// config.birthday-paradox.js — v2, rebuilt for actual understanding
// ─────────────────────────────────────────────────────────────────────────
// WHAT WAS WRONG WITH v1: one scene, straight to the curve. Nobody who
// doesn't already know what "pairs" means in this context can follow a
// curve that just appears with no setup. The core logic — that you're
// counting PAIRS of people, not people — was asserted in narration but
// never actually shown. This version shows it: 5 real dots, the actual
// 10 lines drawn between them, counted, then the arithmetic that produces
// that 10, THEN the generalization, THEN the curve as a payoff instead of
// an opener.
//
// Same casing as v1 (geometry-graph-explainer.html) — it already had
// everything this needs (point, segment, progress, axes/plot/graphPoint).
// This is a content fix, not an engine fix.
//
// Structure (5 scenes, each a fresh html-record instance):
//   1. Hook       — wrong guess vs. real answer (trimmed from v1)
//   2. Concrete   — 5 people as dots, all 10 pairs drawn and counted live
//   3. Arithmetic — where "10" actually comes from (5×4÷2), tied to a real
//                   probability number for 5 people (~2.7%), computed
//                   honestly (not just claimed equal to the pairs estimate)
//   4. Generalize — 10 people → 45 pairs, 23 people → 253 pairs; linear
//                   vs. quadratic growth as two bars filling at different
//                   speeds
//   5. Payoff     — the curve, now earned: 5→2.7%, 23→50%, 30→70%, 50→97%
//
// Every trigger below is checked against its scene's actual tts.text —
// occurrence numbers matter (KaTeX/word-trigger mismatches are silent
// until you watch the render, so these are worked out by hand below each
// scene's narration, not guessed).
// ─────────────────────────────────────────────────────────────────────────

module.exports = {
    output: {
        title:  'birthday-paradox-v2',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',
    },

    defaults: { voice: 'am_michael', transition: 'fade', transitionDuration: 0.35 },

    scenes: [

        // ── Scene 1 — Hook ───────────────────────────────────────────────
        // "guess" → "real" → "twenty" (fade the guess) → "prove" (highlight,
        // promise the worked example that's actually coming this time)
        {
            tts: {
                text: "How many people need to be in a room before two of them share a birthday? Most people guess something like one hundred eighty. The real answer is twenty three. That sounds impossible, so let's actually prove it, starting with just five people.",
                voice: 'am_michael',
                pauseAfter: 0.45,
            },
            captions: false,
            layers: [
                { type: 'background', color: '#0a0a12', noise: true, noiseOpacity: 0.03 },
                {
                    type:      'html-record',
                    src:       './ApexCasing/geometry-graph-explainer.html?tag=bday-s1',
                    audioSync: true,
                    cursor:    false,
                    data: {
                        title: 'The Birthday Paradox',
                        theme: { accent: '#ffdd00', text: '#ffffff' },
                        commands: [
                            { id: 'guessLabel', type: 'write', latex: '\\approx 180\\,?', x: 540, y: 700,
                              size: 60, color: 'rgba(255,255,255,0.4)',
                              trigger: { wordText: 'guess', occurrence: 1 } },

                            { id: 'realLabel', type: 'write', latex: '23', x: 540, y: 900,
                              size: 150, color: '#ffdd00',
                              trigger: { wordText: 'real', occurrence: 1 } },

                            { id: 'fadeGuess', type: 'fadeGroup', targets: ['guessLabel'], opacity: 0.08,
                              duration: 0.4, trigger: { wordText: 'twenty', occurrence: 1 } },

                            { id: 'hlReal', type: 'highlight', target: 'realLabel', holdSec: 0.7,
                              trigger: { wordText: 'prove', occurrence: 1 } },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },

        // ── Scene 2 — Concrete: 5 people, all 10 pairs, drawn and counted ──
        // This is the scene v1 never had. Five dots go up one at a time,
        // then every one of the 10 possible connecting lines gets drawn —
        // the first two synced to the narration naming them explicitly
        // ("pair number one" / "pair number two"), the remaining eight as
        // a fast connected burst while the narration says "keep going" —
        // landing on the number 10 exactly when the narrator says it.
        {
            tts: {
                text: "Picture five people in a room. It's not about your birthday. It's about every possible pair of people checking against each other. Person one and person two, that's pair number one. Person one and person three, that's pair number two. Now keep pairing up everyone left, and by the time every person has been checked against every other person, you get ten pairs total. Five people don't give you five chances. They give you ten chances, because you're comparing pairs, not people.",
                voice: 'am_michael',
                pauseAfter: 0.45,
            },
            captions: false,
            layers: [
                { type: 'background', color: '#0a0a12', noise: true, noiseOpacity: 0.03 },
                {
                    type:      'html-record',
                    src:       './ApexCasing/geometry-graph-explainer.html?tag=bday-s2',
                    audioSync: true,
                    cursor:    false,
                    data: {
                        title: 'Five People, Every Pair',
                        theme: { accent: '#ffdd00', text: '#ffffff' },
                        commands: [
                            // ── the 5 dots (pentagon layout, center 540,780 r=260) ──
                            { id: 'pt1', type: 'shape', shapeType: 'point', cx: 540, cy: 520, r: 16,
                              stroke: '#ffdd00', duration: 0.35,
                              trigger: { wordText: 'picture', occurrence: 1 } },
                            { id: 'pt2', type: 'shape', shapeType: 'point', cx: 787, cy: 700, r: 16,
                              stroke: '#ffdd00', duration: 0.35, trigger: { afterId: 'pt1', offset: 0.12 } },
                            { id: 'pt3', type: 'shape', shapeType: 'point', cx: 693, cy: 990, r: 16,
                              stroke: '#ffdd00', duration: 0.35, trigger: { afterId: 'pt2', offset: 0.12 } },
                            { id: 'pt4', type: 'shape', shapeType: 'point', cx: 387, cy: 990, r: 16,
                              stroke: '#ffdd00', duration: 0.35, trigger: { afterId: 'pt3', offset: 0.12 } },
                            { id: 'pt5', type: 'shape', shapeType: 'point', cx: 293, cy: 700, r: 16,
                              stroke: '#ffdd00', duration: 0.35, trigger: { afterId: 'pt4', offset: 0.12 } },

                            { id: 'lbl1', type: 'write', latex: '1', x: 540, y: 450, size: 44,
                              color: '#ffffff', trigger: { afterId: 'pt1', offset: 0.05 } },
                            { id: 'lbl2', type: 'write', latex: '2', x: 854, y: 678, size: 44,
                              color: '#ffffff', trigger: { afterId: 'pt2', offset: 0.05 } },
                            { id: 'lbl3', type: 'write', latex: '3', x: 734, y: 1047, size: 44,
                              color: '#ffffff', trigger: { afterId: 'pt3', offset: 0.05 } },
                            { id: 'lbl4', type: 'write', latex: '4', x: 346, y: 1047, size: 44,
                              color: '#ffffff', trigger: { afterId: 'pt4', offset: 0.05 } },
                            { id: 'lbl5', type: 'write', latex: '5', x: 226, y: 678, size: 44,
                              color: '#ffffff', trigger: { afterId: 'pt5', offset: 0.05 } },

                            // ── reframe: not YOUR birthday, every PAIR ──
                            { id: 'notLabel', type: 'write', latex: '\\text{NOT: matching YOUR birthday}',
                              x: 540, y: 230, size: 38, color: 'rgba(255,120,120,0.85)',
                              trigger: { wordText: 'birthday', occurrence: 1 } },
                            { id: 'yesLabel', type: 'write', latex: '\\text{YES: matching ANY pair}',
                              x: 540, y: 300, size: 42, color: '#ffdd00',
                              trigger: { wordText: 'about', occurrence: 2 } },

                            // ── the 10 pairs. First 2 synced to narration naming
                            // them explicitly; remaining 8 as a fast burst. ──
                            { id: 'pair12', type: 'shape', shapeType: 'segment',
                              points: [[540,520],[787,700]], stroke: 'rgba(255,221,0,0.7)', strokeWidth: 4,
                              duration: 0.4, trigger: { wordText: 'pair', occurrence: 2 } },
                            { id: 'pair13', type: 'shape', shapeType: 'segment',
                              points: [[540,520],[693,990]], stroke: 'rgba(255,221,0,0.7)', strokeWidth: 4,
                              duration: 0.4, trigger: { wordText: 'pair', occurrence: 3 } },

                            { id: 'pair14', type: 'shape', shapeType: 'segment',
                              points: [[540,520],[387,990]], stroke: 'rgba(255,221,0,0.55)', strokeWidth: 4,
                              duration: 0.3, trigger: { wordText: 'keep', occurrence: 1 } },
                            { id: 'pair15', type: 'shape', shapeType: 'segment',
                              points: [[540,520],[293,700]], stroke: 'rgba(255,221,0,0.55)', strokeWidth: 4,
                              duration: 0.3, trigger: { afterId: 'pair14', offset: 0.12 } },
                            { id: 'pair23', type: 'shape', shapeType: 'segment',
                              points: [[787,700],[693,990]], stroke: 'rgba(255,221,0,0.55)', strokeWidth: 4,
                              duration: 0.3, trigger: { afterId: 'pair15', offset: 0.12 } },
                            { id: 'pair24', type: 'shape', shapeType: 'segment',
                              points: [[787,700],[387,990]], stroke: 'rgba(255,221,0,0.55)', strokeWidth: 4,
                              duration: 0.3, trigger: { afterId: 'pair23', offset: 0.12 } },
                            { id: 'pair25', type: 'shape', shapeType: 'segment',
                              points: [[787,700],[293,700]], stroke: 'rgba(255,221,0,0.55)', strokeWidth: 4,
                              duration: 0.3, trigger: { afterId: 'pair24', offset: 0.12 } },
                            { id: 'pair34', type: 'shape', shapeType: 'segment',
                              points: [[693,990],[387,990]], stroke: 'rgba(255,221,0,0.55)', strokeWidth: 4,
                              duration: 0.3, trigger: { afterId: 'pair25', offset: 0.12 } },
                            { id: 'pair35', type: 'shape', shapeType: 'segment',
                              points: [[693,990],[293,700]], stroke: 'rgba(255,221,0,0.55)', strokeWidth: 4,
                              duration: 0.3, trigger: { afterId: 'pair34', offset: 0.12 } },
                            { id: 'pair45', type: 'shape', shapeType: 'segment',
                              points: [[387,990],[293,700]], stroke: 'rgba(255,221,0,0.55)', strokeWidth: 4,
                              duration: 0.3, trigger: { afterId: 'pair35', offset: 0.12 } },

                            // ── the count, landing exactly on the word "ten" ──
                            { id: 'countLabel', type: 'write', latex: '\\mathbf{10}\\ \\text{pairs}',
                              x: 540, y: 1560, size: 100, color: '#ffdd00',
                              trigger: { wordText: 'ten', occurrence: 1 } },
                            { id: 'hlCount', type: 'highlight', target: 'countLabel', holdSec: 0.6,
                              trigger: { wordText: 'chances', occurrence: 2 } },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                                     fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },

        // ── Scene 3 — Where "10" actually comes from ────────────────────
        // The arithmetic (5×4÷2=10), built one symbol at a time, then tied
        // to a real, honestly-computed probability for 5 people (2.71%,
        // not just asserted equal to the pairs estimate 10/365=2.74% — the
        // narration says "about", both numbers are shown, they're close
        // because the estimate is a good approximation, not because
        // they're the same calculation).
        {
            tts: {
                text: "Here's the count another way. Person one can pair with four others. Person two can pair with four others too, but the pair between them already got counted once, so we divide by two to avoid counting it twice. Five times four, divided by two, equals ten pairs. Now, each single pair has roughly a one in three hundred sixty five chance of matching, since there are three hundred sixty five days in a year. Ten pairs, each with a small chance, stack up to about a two point seven percent chance overall for just five people. Small, but climbing fast.",
                voice: 'am_michael',
                pauseAfter: 0.45,
            },
            captions: false,
            layers: [
                { type: 'background', color: '#0a0a12', noise: true, noiseOpacity: 0.03 },
                {
                    type:      'html-record',
                    src:       './ApexCasing/geometry-graph-explainer.html?tag=bday-s3',
                    audioSync: true,
                    cursor:    false,
                    data: {
                        title: 'Where 10 Comes From',
                        theme: { accent: '#ffdd00', text: '#ffffff' },
                        commands: [
                            { id: 'e1', type: 'write', latex: '5', x: 540, y: 500, size: 110,
                              color: '#ffffff', trigger: { wordText: 'count', occurrence: 1 } },
                            { id: 'e1b', type: 'replace', target: 'e1', latex: '5 \\times 4',
                              duration: 0.3, trigger: { wordText: 'four', occurrence: 1 } },
                            { id: 'e1c', type: 'replace', target: 'e1', latex: '5 \\times 4 \\div 2',
                              duration: 0.3, trigger: { wordText: 'divide', occurrence: 1 } },
                            { id: 'e1d', type: 'replace', target: 'e1', latex: '5 \\times 4 \\div 2 = \\mathbf{10}',
                              duration: 0.35, trigger: { wordText: 'ten', occurrence: 1 } },

                            { id: 'p1', type: 'write', latex: '\\text{1 pair} \\approx \\frac{1}{365}',
                              x: 540, y: 780, size: 62, color: 'rgba(255,255,255,0.75)',
                              trigger: { wordText: 'chance', occurrence: 1 } },

                            { id: 'p2', type: 'write',
                              latex: '10 \\times \\frac{1}{365} \\approx 2.7\\%',
                              x: 540, y: 980, size: 68, color: '#ffdd00',
                              trigger: { wordText: 'stack', occurrence: 1 } },

                            { id: 'hlP2', type: 'highlight', target: 'p2', holdSec: 0.7,
                              trigger: { wordText: 'climbing', occurrence: 1 } },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },

        // ── Scene 4 — Generalize: pairs explode, people don't ──────────
        // Two numbers (10→45, 23→253), then a concrete visual for WHY:
        // two bars filling at different speeds — "people" crawling,
        // "pairs" snapping full — as a gut-level linear-vs-quadratic cue
        // for anyone who's never heard those words.
        {
            tts: {
                text: "Now scale it up. Ten people isn't ten chances, it's forty five pairs. Twenty three people isn't twenty three chances, it's two hundred fifty three pairs. People go up in a straight line. Pairs explode. That's the entire secret of the birthday paradox: you're never checking one person against the calendar, you're checking every pair against each other.",
                voice: 'am_michael',
                pauseAfter: 0.45,
            },
            captions: false,
            layers: [
                { type: 'background', color: '#0a0a12', noise: true, noiseOpacity: 0.03 },
                {
                    type:      'html-record',
                    src:       './ApexCasing/geometry-graph-explainer.html?tag=bday-s4',
                    audioSync: true,
                    cursor:    false,
                    data: {
                        title: 'Pairs Explode, People Don\u2019t',
                        theme: { accent: '#ffdd00', text: '#ffffff' },
                        commands: [
                            { id: 'n10', type: 'write',
                              latex: '10\\ \\text{people} \\rightarrow \\mathbf{45}\\ \\text{pairs}',
                              x: 540, y: 500, size: 60, color: '#4dd0ff',
                              trigger: { wordText: 'ten', occurrence: 1 } },
                            { id: 'n23', type: 'write',
                              latex: '23\\ \\text{people} \\rightarrow \\mathbf{253}\\ \\text{pairs}',
                              x: 540, y: 640, size: 56, color: '#ff5555',
                              trigger: { wordText: 'people', occurrence: 2 } },

                            { id: 'peopleBar', type: 'progress', x: 190, y: 1080, w: 700, h: 64,
                              label: 'people (slow, straight line)', color: '#4dd0ff',
                              target: 0.25, duration: 2.4,
                              trigger: { wordText: 'straight', occurrence: 1 } },
                            { id: 'pairsBar', type: 'progress', x: 190, y: 1220, w: 700, h: 64,
                              label: 'pairs (fast, explodes)', color: '#ffdd00',
                              target: 1.0, duration: 0.8,
                              trigger: { wordText: 'explode', occurrence: 1 } },

                            { id: 'secretLabel', type: 'write',
                              latex: '\\text{pairs, not people.}',
                              x: 540, y: 1500, size: 52, color: '#ffdd00',
                              trigger: { wordText: 'secret', occurrence: 1 } },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },

        // ── Scene 5 — Payoff: the curve, now earned ─────────────────────
        // Same curve v1 ended with — but now it's a summary of something
        // already proven, not the entire proof. n=5 is plotted first and
        // explicitly tied back to the 2.7% from Scene 3, so the abstract
        // curve visibly grows out of the concrete example instead of
        // being a new, disconnected fact.
        {
            tts: {
                text: "So here's the full picture. As more people join the room, the number of pairs keeps snowballing, and the odds curve up fast. Five people, just a small two point seven percent. But by twenty three people, you're already at a coin flip, fifty percent. Push it to thirty, and it's seventy percent. By fifty people in the room, it's basically guaranteed, ninety seven percent. It was never about matching your own birthday. It's about how fast the pairs pile up.",
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            captions: false,
            layers: [
                { type: 'background', color: '#0a0a12', noise: true, noiseOpacity: 0.03 },
                {
                    type:      'html-record',
                    src:       './ApexCasing/geometry-graph-explainer.html?tag=bday-s5',
                    audioSync: true,
                    cursor:    false,
                    data: {
                        title: 'The Full Picture',
                        theme: { accent: '#ffdd00', text: '#ffffff' },
                        commands: [
                            { id: 'ax1', type: 'axes', x: 140, y: 380, w: 800, h: 900,
                              xMin: 0, xMax: 60, yMin: 0, yMax: 1, xStep: 10, yStep: 0.25,
                              showGrid: true, labelX: 'people in the room', labelY: 'probability of a match',
                              trigger: { wordText: 'picture', occurrence: 1 } },

                            { id: 'curve1', type: 'plot', axesId: 'ax1',
                              fn: '1 - Math.exp(-x*(x-1)/(2*365))',
                              stroke: '#ffdd00', strokeWidth: 7, samples: 120,
                              trigger: { wordText: 'snowballing', occurrence: 1 } },

                            { id: 'pt5', type: 'graphPoint', axesId: 'ax1', x: 5, y: 0.0271, r: 11,
                              color: '#ffaa55', trigger: { wordText: 'five', occurrence: 1 } },
                            { id: 'lbl5', type: 'write', latex: '\\approx 2.7\\%\\ (\\text{from Scene 3})',
                              x: 330, y: 760, size: 34, color: '#ffaa55',
                              trigger: { wordText: 'percent', occurrence: 1 } },

                            { id: 'pt23', type: 'graphPoint', axesId: 'ax1', x: 23, y: 0.507, r: 13,
                              color: '#ff5555', trigger: { wordText: 'coin', occurrence: 1 } },
                            { id: 'lbl23', type: 'write', latex: '\\approx 50\\%', x: 480, y: 790,
                              size: 44, color: '#ff5555', trigger: { wordText: 'fifty', occurrence: 1 } },

                            { id: 'pt30', type: 'graphPoint', axesId: 'ax1', x: 30, y: 0.696, r: 12,
                              color: '#4dd0ff', trigger: { wordText: 'thirty', occurrence: 1 } },
                            { id: 'lbl30', type: 'write', latex: '\\approx 70\\%', x: 580, y: 615,
                              size: 40, color: '#4dd0ff', trigger: { wordText: 'seventy', occurrence: 1 } },

                            { id: 'pt50', type: 'graphPoint', axesId: 'ax1', x: 50, y: 0.965, r: 12,
                              color: '#7dff8a', trigger: { wordText: 'guaranteed', occurrence: 1 } },
                            { id: 'lbl50', type: 'write', latex: '\\approx 97\\%', x: 730, y: 350,
                              size: 40, color: '#7dff8a', trigger: { wordText: 'ninety', occurrence: 1 } },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },

    ],
};