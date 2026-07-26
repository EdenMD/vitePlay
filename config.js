// config.puckle-gun.js
// "The 1718 machine gun that fired different bullets depending on your
// enemy's religion." Long-form (~3min) documentary, hybrid architecture:
// native layers (stock-image/giphy/pexels-video + stat-counter/quote-card/
// comparison) carry almost the whole video — cheap, fast, no Puppeteer
// screenshots — with ONE html-record segment (scene 4) reserved for the
// mechanism reveal, the only place that actually needs word-synced build.
//
// Per instructions: no kinetic-text anywhere (plain 'text' + native accent
// layers only), no dissolve/fade transitions (zoom-cut throughout), and
// positioning goes through the layout system (type:'anchor' containers)
// instead of hand-picked x/y wherever there's more than a full-frame
// background/overlay to place — manual pixel coordinates are reserved for
// the html-record scene's internal canvas, where the casing's own trigger
// engine needs exact placement anyway.
//
// Requires the patched html-record.js (audioData.duration fallback) —
// the html-record layer below intentionally omits `duration` so it runs
// the real length of its narration rather than defaulting to 3s.
//
// All facts verified: James Puckle, 1718 patent (UK patent No. 418),
// tripod-mounted hand-cranked revolving-cylinder flintlock, demonstrated
// firing 63 shots in 7 minutes in 1722, patented with a round-bullet
// cylinder for Christian enemies and a square-bullet cylinder for Ottoman
// Turks ("would convince the Turks of the benefits of Christian
// civilization" — direct patent language), only ~2 units ever built
// (iron prototype + brass production model), never used in combat.
// Historians debate whether the square-bullet cylinder was ever actually
// manufactured versus only ever described on paper.

module.exports = {
    output: {
        title:  'puckle-gun-documentary',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',
        beat: {
            bpm:    88,
            bars:   16,
            genre:  'military',
            key:    'Dmin',
            layers: ['kick', 'snare', 'bass', 'pad'],
            swing:  0.08,
            reverb: 0.25,
            loop:   true,
            vol:    0.10,   // kept low — narration carries the video, beat is texture only
        },
    },

    defaults: {
        voice: 'am_michael',              // documentary/emotional register, per house convention
        transition: 'zoom-cut',           // no dissolve/fade anywhere in this video
        transitionDuration: 0.45,
    },

    scenes: [
        // ══════════════════════════════════════════════════════════════
        // SCENE 1 — HOOK
        // ══════════════════════════════════════════════════════════════
        {
            tts: {
                text: "In seventeen eighteen, a British lawyer patented a machine gun that loaded two completely different kinds of bullets. One was round. One was square. And which one you used depended entirely on your enemy's religion. If you think that's strange, wait until you hear why he thought that would actually work.",
                voice: 'am_michael',
                pauseAfter: 0.5,
            },
            captions: { style: 'highlight', fontSize: 60, highlightColor: '#f5c518', wordsPerChunk: 3 },
            layers: [
                { type: 'stock-image', query: 'flintlock cannon', imageIndex: 0,
                  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                  kenBurns: 'zoom-in', kenBurnsAmount: 0.32 },
                { type: 'overlay', color: 'rgba(0,0,0,0.50)' },
            ],
        },

        // ══════════════════════════════════════════════════════════════
        // SCENE 2 — THE INVENTOR
        // ══════════════════════════════════════════════════════════════
        {
            tts: {
                text: "His name was James Puckle. Not a soldier, not an engineer — a London lawyer, inventor, and part-time writer, with a patent office and, apparently, some very strong opinions about naval warfare and the Ottoman Turks.",
                voice: 'am_michael',
                pauseAfter: 0.5,
            },
            captions: { style: 'highlight', fontSize: 60, highlightColor: '#f5c518', wordsPerChunk: 3 },
            layers: [
                { type: 'stock-image', query: 'georgian era portrait', imageIndex: 0,
                  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                  kenBurns: 'pan-right', kenBurnsAmount: 0.30 },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
                {
                    layout: { type: 'anchor', padding: [90, 60] },
                    layers: [
                        { type: 'text', text: 'JAMES PUCKLE', anchorPoint: 'bottom-left',
                          fontSize: 46, fontWeight: '900', color: '#f5c518',
                          animation: 'slide-up', startT: 0.6, animDur: 0.5 },
                    ],
                },
            ],
        },

        // ══════════════════════════════════════════════════════════════
        // SCENE 3 — THE THREAT
        // ══════════════════════════════════════════════════════════════
        {
            tts: {
                text: "By the early seventeen hundreds, the Ottoman Empire controlled huge stretches of southeast Europe, North Africa, and the Mediterranean. Their fast raiding ships were tearing through British merchant shipping almost unchallenged, and a standard musket of the day could barely fire three shots a minute — nowhere near enough to fight off a boarding party.",
                voice: 'am_michael',
                pauseAfter: 0.5,
            },
            captions: { style: 'highlight', fontSize: 60, highlightColor: '#f5c518', wordsPerChunk: 3 },
            layers: [
                { type: 'stock-image', query: 'ottoman warship', imageIndex: 0,
                  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                  kenBurns: 'drift', kenBurnsAmount: 0.30 },
                { type: 'overlay', color: 'rgba(0,0,0,0.50)' },
                {
                    layout: { type: 'anchor', padding: [90, 60] },
                    layers: [
                        { id: 'musketStat', type: 'stat-counter', anchorPoint: 'bottom',
                          value: 3, suffix: '/min', label: 'STANDARD MUSKET',
                          fontSize: 100, labelFontSize: 32, color: '#ffffff',
                          startT: 6.5, animDur: 1.2 },
                    ],
                },
            ],
        },

        // ══════════════════════════════════════════════════════════════
        // SCENE 4 — THE MACHINE (html-record: the one segment that needs
        // word-synced build — round vs. square cylinder reveal + the
        // actual patent language)
        // ══════════════════════════════════════════════════════════════
        {
            tts: {
                text: "So Puckle built something completely different — a tripod mounted, hand cranked gun with a revolving cylinder. Load it, crank it, and it fires again and again: sixty three shots in seven minutes, at a real demonstration in seventeen twenty two. That's over twenty times faster than a musket. But here's the actual twist. Load the round cylinder, and it's set for use against fellow Christians. Swap in the second one, and it fires square bullets instead, reserved specifically for Ottoman Turks. His own patent claims the wounds from square bullets would, quote, convince the Turks of the benefits of Christian civilization.",
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            captions: { style: 'highlight', fontSize: 60, highlightColor: '#f5c518', wordsPerChunk: 3 },
            layers: [
                { type: 'background', color: '#0a0a12', noise: true, noiseOpacity: 0.03 },
                {
                    type:      'html-record',
                    src:       './ApexCasing/geometry-graph-explainer.html?tag=puckle-mechanism',
                    audioSync: true,
                    cursor:    false,
                    data: {
                        title: 'One Gun. Two Cylinders.',
                        theme: { accent: '#f5c518', text: '#ffffff' },
                        commands: [
                            // the stat — how fast this thing actually fired
                            { id: 'statLabel', type: 'write', latex: '\\text{63 shots / 7 min}',
                              x: 540, y: 300, size: 62, color: '#f5c518',
                              trigger: { wordText: 'seven', occurrence: 1 } },

                            // round bullet cylinder — for Christian enemies
                            { id: 'roundShape', type: 'shape', shapeType: 'circle',
                              cx: 380, cy: 700, r: 90, stroke: '#ffffff', strokeWidth: 6,
                              trigger: { wordText: 'cylinder', occurrence: 2 } },
                            { id: 'roundLabel', type: 'write', latex: '\\text{round} \\rightarrow \\text{Christians}',
                              x: 380, y: 850, size: 40,
                              trigger: { wordText: 'christians', occurrence: 1 } },

                            // square bullet cylinder — for the Ottoman Turks
                            { id: 'squareShape', type: 'shape', shapeType: 'polygon',
                              points: [[620, 620], [780, 620], [780, 780], [620, 780]],
                              stroke: '#ff5555', strokeWidth: 6,
                              trigger: { wordText: 'square', occurrence: 1 } },
                            { id: 'squareLabel', type: 'write', latex: '\\text{square} \\rightarrow \\text{Ottoman Turks}',
                              x: 700, y: 850, size: 40, color: '#ff5555',
                              trigger: { wordText: 'turks', occurrence: 1 } },

                            // the actual patent language
                            { id: 'quoteLabel', type: 'write',
                              latex: '\\text{``convince the Turks of the benefits}',
                              x: 540, y: 1080, size: 34,
                              trigger: { wordText: 'quote', occurrence: 1 } },
                            { id: 'quoteLabel2', type: 'write',
                              latex: '\\text{of Christian civilization."}',
                              x: 540, y: 1150, size: 34,
                              trigger: { wordText: 'quote', occurrence: 1 } },

                            { id: 'hlQuote', type: 'highlight', target: 'quoteLabel2', holdSec: 0.8,
                              trigger: { wordText: 'civilization', occurrence: 1 } },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },

        // ══════════════════════════════════════════════════════════════
        // SCENE 5 — NEVER BUILT PROPERLY
        // ══════════════════════════════════════════════════════════════
        {
            tts: {
                text: "And if you're picturing this thing winning battles, it didn't. Historians believe only two were ever actually built: one rough iron prototype, and a single brass production model. It never fired a single shot in anger — it just sat in museums instead.",
                voice: 'am_michael',
                pauseAfter: 0.5,
            },
            captions: { style: 'highlight', fontSize: 60, highlightColor: '#f5c518', wordsPerChunk: 3 },
            layers: [
                { type: 'stock-image', query: 'flintlock mechanism', imageIndex: 0,
                  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                  kenBurns: 'zoom-out', kenBurnsAmount: 0.30 },
                { type: 'overlay', color: 'rgba(0,0,0,0.50)' },
                {
                    layout: { type: 'stack', x: 540, y: 1550, align: 'center' },
                    layers: [
                        { type: 'shape', shapeType: 'diamond',
                          width: 260, height: 260, color: 'rgba(245,197,24,0.10)',
                          animation: 'spin', speed: 0.12 },
                        { id: 'builtStat', type: 'stat-counter',
                          value: 2, label: 'EVER BUILT', fontSize: 120, labelFontSize: 34,
                          color: '#f5c518', startT: 5.5, animDur: 1.2 },
                    ],
                },
            ],
        },

        // ══════════════════════════════════════════════════════════════
        // SCENE 6 — THE TWIST
        // ══════════════════════════════════════════════════════════════
        {
            tts: {
                text: "And here's the part that makes it even stranger. Some historians aren't even convinced the square bullet version was ever physically manufactured, only ever written into the patent. One observer at the time summed it up perfectly: its only real fault was being, quote, a weapon contrived to do too much.",
                voice: 'am_michael',
                pauseAfter: 0.5,
            },
            captions: { style: 'highlight', fontSize: 60, highlightColor: '#f5c518', wordsPerChunk: 3 },
            layers: [
                { type: 'stock-image', query: 'antique patent document', imageIndex: 0,
                  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                  kenBurns: 'pan-left', kenBurnsAmount: 0.30 },
                { type: 'overlay', color: 'rgba(0,0,0,0.52)' },
                { type: 'quote-card', text: 'a weapon contrived to do too much',
                  x: 540, y: 1250, width: 880, fontSize: 46,
                  cardColor: 'rgba(0,0,0,0.45)', accentColor: '#f5c518',
                  startT: 13.5, animDur: 0.6 },
            ],
        },

        // ══════════════════════════════════════════════════════════════
        // SCENE 7 — CTA
        // ══════════════════════════════════════════════════════════════
        {
            tts: {
                text: "This is exactly the kind of forgotten weapon nobody's covering, which is exactly why we do. If this blew your mind, hit subscribe, drop a like, and I'll dig up the next one nobody's ever told you about.",
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            captions: { style: 'highlight', fontSize: 60, highlightColor: '#f5c518', wordsPerChunk: 3 },
            layers: [
                { type: 'background', color: '#0a0a12' },
                { type: 'stock-image', query: 'flintlock cannon', imageIndex: 1,
                  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                  kenBurns: 'drift-reverse', kenBurnsAmount: 0.24 },
                { type: 'overlay', color: 'rgba(0,0,0,0.62)' },
                {
                    layout: { type: 'anchor', padding: [70, 60] },
                    layers: [
                        { id: 'ctaText', type: 'text', text: 'SUBSCRIBE FOR THE NEXT ONE',
                          anchorPoint: 'center', fontSize: 78, fontWeight: '900',
                          color: '#f5c518', animation: 'pop', startT: 0.4, animDur: 0.5 },
                    ],
                },
            ],
        },
    ],
};
