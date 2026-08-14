// config.cannae.js
// War Strategy series, Episode 1: the Battle of Cannae, 216 BC —
// Hannibal's double envelopment, still taught in military academies as
// the textbook example of the perfect tactical trap.
// Voice: am_michael. One scene, war-board-explainer casing, every
// trigger is wordText.

module.exports = {
    output: {
        title:  'battle-of-cannae',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',
    },

    defaults: { voice: 'am_michael', transition: 'zoom-cut', transitionDuration: 0.45 },

    scenes: [
        {
            tts: {
                text: "In two sixteen BC, Hannibal faced a Roman army twice the size of his own, and instead of running, he built a trap. He placed his weakest troops in the center, and let them bend backward on purpose, like a net sagging under weight. The Romans smelled victory, and pushed harder into the middle. That's exactly what Hannibal wanted. While the center bent inward, his cavalry crushed the Roman horsemen on both flanks, then turned around, and rode straight into the Roman army's back. In one afternoon, an entire army was sealed inside a ring of enemies on every single side. This is Cannae, still taught in military academies over two thousand years later, as the perfect trap.",
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            captions: { style: 'highlight', fontSize: 58, highlightColor: '#f5c518', wordsPerChunk: 3 },
            layers: [
                { type: 'background', color: '#dfe7d8' },
                {
                    type:      'html-record',
                    src:       './ApexCasing/war-board-explainer.html?tag=cannae',
                    audioSync: true,
                    cursor:    false,
                    data: {
                        title: 'Battle of Cannae — 216 BC',
                        theme: { land: '#c9d9a8', sea: '#8fb8d9', side1: '#c0392b', side2: '#2f5aa8' },
                        map: {
                            regions: [
                                { id: 'field', kind: 'land', points: [[80,700],[1000,700],[1000,1500],[80,1500]] },
                            ],
                        },
                        commands: [
                            // ── terrain, just enough to read as a real place ─────────
                            { id: 't1', type: 'terrain', terrainType: 'hill', x: 180, y: 760, scale: 1.1,
                              trigger: { wordText: 'hannibal', occurrence: 1 } },
                            { id: 't2', type: 'terrain', terrainType: 'hill', x: 900, y: 760, scale: 1.1,
                              trigger: { afterId: 't1', offset: 0.2 } },
                            { id: 't3', type: 'terrain', terrainType: 'tree', x: 140, y: 1440, scale: 0.9,
                              trigger: { afterId: 't2', offset: 0.2 } },
                            { id: 't4', type: 'terrain', terrainType: 'tree', x: 940, y: 1440, scale: 0.9,
                              trigger: { afterId: 't3', offset: 0.15 } },

                            // ── Carthaginian force (blue, side2) — introduced first ──
                            { id: 'carthCenter', type: 'unit', shape: 'army', side: 'side2',
                              x: 540, y: 950, label: 'Carthage — Center',
                              trigger: { wordText: 'hannibal', occurrence: 1 } },
                            { id: 'carthLeftCav', type: 'unit', shape: 'cavalry', side: 'side2',
                              x: 230, y: 950, label: 'Cavalry',
                              trigger: { afterId: 'carthCenter', offset: 0.2 } },
                            { id: 'carthRightCav', type: 'unit', shape: 'cavalry', side: 'side2',
                              x: 850, y: 950, label: 'Cavalry',
                              trigger: { afterId: 'carthLeftCav', offset: 0.15 } },

                            // ── Roman force (red, side1) ─────────────────────────────
                            { id: 'romanCenter', type: 'unit', shape: 'army', side: 'side1',
                              x: 540, y: 1280, label: 'Rome — Legions',
                              trigger: { wordText: 'roman', occurrence: 1 } },
                            { id: 'romanLeftCav', type: 'unit', shape: 'cavalry', side: 'side1',
                              x: 230, y: 1280, label: 'Cavalry',
                              trigger: { afterId: 'romanCenter', offset: 0.2 } },
                            { id: 'romanRightCav', type: 'unit', shape: 'cavalry', side: 'side1',
                              x: 850, y: 1280, label: 'Cavalry',
                              trigger: { afterId: 'romanLeftCav', offset: 0.15 } },

                            // ── the center bows backward (the bait) ──────────────────
                            { id: 'moveCenterBack', type: 'moveUnit', target: 'carthCenter',
                              x: 540, y: 1080, duration: 1.2,
                              trigger: { wordText: 'weakest', occurrence: 1 } },
                            { id: 'thoughtBait', type: 'thoughtBubble', target: 'carthCenter',
                              text: 'Bait.', holdSec: 1.8,
                              trigger: { wordText: 'bend', occurrence: 1 } },

                            // ── Romans push into the pocket ──────────────────────────
                            { id: 'moveRomanIn', type: 'moveUnit', target: 'romanCenter',
                              x: 540, y: 1140, duration: 1.4,
                              trigger: { wordText: 'middle', occurrence: 1 } },

                            // ── cavalry crushes the flanks ───────────────────────────
                            { id: 'moveCarthLeftCav', type: 'moveUnit', target: 'carthLeftCav',
                              x: 260, y: 1280, curve: -40, duration: 1.0,
                              trigger: { wordText: 'cavalry', occurrence: 1 } },
                            { id: 'moveCarthRightCav', type: 'moveUnit', target: 'carthRightCav',
                              x: 820, y: 1280, curve: 40, duration: 1.0,
                              trigger: { afterId: 'moveCarthLeftCav', offset: 0.1 } },
                            { id: 'elimLeftCav', type: 'eliminateUnit', target: 'romanLeftCav',
                              style: 'retreat', toward: [60, 1280], duration: 0.7,
                              trigger: { wordText: 'horsemen', occurrence: 1 } },
                            { id: 'elimRightCav', type: 'eliminateUnit', target: 'romanRightCav',
                              style: 'retreat', toward: [1020, 1280], duration: 0.7,
                              trigger: { afterId: 'elimLeftCav', offset: 0.15 } },

                            // ── cavalry wheels around to the Roman rear ──────────────
                            { id: 'sweepLeft', type: 'moveUnit', target: 'carthLeftCav',
                              x: 400, y: 1420, curve: -120, duration: 1.4,
                              trigger: { wordText: 'turned', occurrence: 1 } },
                            { id: 'sweepRight', type: 'moveUnit', target: 'carthRightCav',
                              x: 680, y: 1420, curve: 120, duration: 1.4,
                              trigger: { afterId: 'sweepLeft', offset: 0.1 } },
                            { id: 'arrowClose', type: 'arrow', x1: 260, y1: 1300, x2: 820, y2: 1300,
                              curve: 90, color: '#2f5aa8', strokeWidth: 12, duration: 1.0,
                              trigger: { wordText: 'back', occurrence: 1 } },

                            // ── the encirclement ──────────────────────────────────────
                            { id: 'frontRing', type: 'frontLine',
                              points: [[300,1180],[540,1140],[780,1180],[820,1420],[540,1470],[260,1420],[300,1180]],
                              color: '#c0392b', strokeWidth: 8, duration: 1.2,
                              trigger: { wordText: 'ring', occurrence: 1 } },
                            { id: 'labelEncircled', type: 'label', text: 'ENCIRCLED',
                              x: 540, y: 1300, size: 44, color: '#c0392b',
                              trigger: { afterId: 'frontRing', offset: 0.4 } },
                            { id: 'highlightRoman', type: 'highlight', target: 'romanCenter', holdSec: 0.8,
                              trigger: { afterId: 'labelEncircled', offset: 0.3 } },

                            // ── title + closing beat ──────────────────────────────────
                            { id: 'titleLabel', type: 'label', text: 'CANNAE, 216 BC',
                              x: 540, y: 250, size: 50, color: '#1a1a1a',
                              trigger: { wordText: 'cannae', occurrence: 1 } },
                            { id: 'thoughtGenius', type: 'thoughtBubble', target: 'carthCenter',
                              text: 'Still studied today.', holdSec: 2.5,
                              trigger: { wordText: 'perfect', occurrence: 1 } },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    duration: 45,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },
    ],
};