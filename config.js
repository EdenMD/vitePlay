/**
 * config.stealth-fighter-paradox.js
 * 
 * Engine: APEX Video Engine v2.4 / V3
 * Format: 9:16 Portrait (1080x1920) for YouTube Shorts & TikTok
 * Topic: The F-117 Nighthawk & the math paper the US ignored
 * 
 * Run with: VIDEO_CONFIG=config.stealth-fighter-paradox.js node engine-ci.js
 */

module.exports = {
    output: {
        title:  'the-math-behind-stealth',
        format: 'portrait',
        fps:    30,
        crf:    22,
        preset: 'fast',
        postProcess: {
            grain: true,
            grainStrength: 0.025,
            vignette: true,
            vignetteStrength: 0.40,
        },
        beat: {
            bpm: 110,
            genre: 'dark-synth',
            bars: 8,
            key: 'Dmin',
            vol: 0.22,
        },
    },

    defaults: {
        voice:              'bm_george',    // Deep authoritative documentary tone
        speed:              1.0,
        transition:         'fade',
        transitionDuration: 0.35,
    },

    scenes: [
        // ══ 1. HOOK — IN MEDIAS RES ════════════════════════════════════════
        {
            tts: {
                text: "The most secret stealth jet in American history wasn't invented in the United States. It was discovered in an unclassified Soviet math paper.",
                voice: 'bm_george',
                pauseAfter: 0.4,
            },
            transition: 'zoom-out',
            captions: true,
            layers: [
                {
                    type: 'stock-image',
                    query: 'F-117 Nighthawk stealth aircraft dramatic night sky',
                    source: 'serpapi',
                    orientation: 'portrait',
                    kenBurns: 'zoom-in',
                    kenBurnsAmount: 0.52,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                {
                    type: 'overlay',
                    color: 'rgba(0, 0, 0, 0.45)',
                },
            ],
            sfx: 'sub-drop',
            sfxAt: 0.1,
        },

        // ══ 2. DRAMATIC TEXT HOOK ══════════════════════════════════════════
        {
            tts: {
                text: "Soviet scientists thought the math was completely useless. Lockheed used it to become invisible to radar.",
                voice: 'bm_george',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            captions: true,
            layers: [
                {
                    type: 'gradient',
                    gradientType: 'radial',
                    colors: ['#120800', '#050200', '#000000'],
                    vignette: true,
                    vignetteStrength: 0.5,
                },
                {
                    type: 'neon-text',
                    text: 'THE RADAR\nPARADOX',
                    x: 540, y: 880,
                    fontSize: 88,
                    color: '#ff8c00',
                    align: 'center',
                    glowLayers: 5,
                    glowSpread: 18,
                    flicker: true,
                    hookLayer: true,
                },
            ],
            sfx: 'dramatic-hit',
            sfxAt: 0.1,
        },

        // ══ 3. THE DISCOVERY & HISTORICAL EVIDENCE ═════════════════════════
        {
            tts: {
                text: "In 1964, physicist Pyotr Ufimtsev published a breakthrough formula calculating exactly how electromagnetic waves scatter off flat 2D surfaces.",
                voice: 'bm_george',
                pauseAfter: 0.4,
            },
            transition: 'slideLeft',
            captions: true,
            layers: [
                {
                    type: 'stock-image',
                    query: 'physics blackboard formulas mathematics equations dark room',
                    source: 'serpapi',
                    orientation: 'portrait',
                    kenBurns: 'pan-up',
                    kenBurnsAmount: 0.40,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                {
                    type: 'overlay',
                    color: 'rgba(0, 0, 0, 0.5)',
                },
            ],
        },

        // ══ 4. QUOTE CARD (CANON DOCUMENTATION) ════════════════════════════
        {
            tts: {
                text: "The Soviet Union allowed it to be published worldwide because military censors concluded it had zero weapon value.",
                voice: 'bm_george',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            captions: true,
            layers: [
                {
                    type: 'gradient',
                    gradientType: 'radial',
                    colors: ['#0f172a', '#020617'],
                    vignette: true,
                    vignetteStrength: 0.45,
                },
                {
                    type: 'quote-card',
                    text: '"The calculations are of purely academic interest with no direct military application." \u2014 Soviet Technical Review, 1964',
                    x: 540, y: 860,
                    width: 920,
                    fontSize: 36,
                    accentColor: '#38bdf8',
                    showCard: true,
                    showLines: true,
                    animDur: 0.6,
                },
            ],
        },

        // ══ 5. APEXCASING DATA-DRIVEN HTML COMPARISON ═══════════════════════
        {
            tts: {
                text: "Lockheed's Skunk Works translated it. By replacing smooth curved wings with angled flat facets, radar cross-sections collapsed overnight.",
                voice: 'bm_george',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            captions: true,
            layers: [
                {
                    type: 'html-record',
                    src: './ApexCasing/data-table.html',
                    data: {
                        title: 'RADAR SIGNATURE (RCS)',
                        columns: ['B-52', 'F-15', 'F-117 Stealth'],
                        highlightColumn: 2,
                        rows: [
                            { label: 'Radar Echo Area', values: ['100 m²', '25 m²', '0.001 m²'] },
                            { label: 'Radar Equivalent', values: ['Barn', 'Truck', 'Small Marble'] },
                            { label: 'Detection Range', values: ['250+ km', '160 km', '< 8 km'] },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    duration: 6.0,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },

        // ══ 6. APEXCASING RECAP & RANKING BOARD ════════════════════════════
        {
            tts: {
                text: "Here is the ultimate irony: the mathematics that gave the West total air dominance in Desert Storm came straight out of Moscow.",
                voice: 'bm_george',
                pauseAfter: 0.6,
            },
            transition: 'fade',
            captions: true,
            layers: [
                {
                    type: 'html-record',
                    src: './ApexCasing/recap-board.html',
                    data: {
                        title: 'STEALTH ORIGIN RECAP',
                        items: [
                            { rank: 3, name: 'Soviet Math Paper', stat: 'Ufimtsev (1964) ignored at home' },
                            { rank: 2, name: 'Skunk Works Overhaul', stat: 'Faceting computer model Echo 1' },
                            { rank: 1, name: 'The F-117 Nighthawk', stat: 'First operational stealth aircraft' },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    duration: 6.5,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },

        // ══ 7. RETENTION OUTRO & CALL TO ACTION ════════════════════════════
        {
            tts: {
                text: "Follow for more uncovered military history you weren't supposed to know.",
                voice: 'bm_george',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            captions: true,
            layers: [
                {
                    type: 'gradient',
                    gradientType: 'radial',
                    colors: ['#0f051d', '#000000'],
                    vignette: true,
                    vignetteStrength: 0.5,
                },
                {
                    type: 'waveform',
                    vizStyle: 'bars',
                    x: 90, y: 1550,
                    width: 900,
                    height: 80,
                    bars: 48,
                    color: '#ff8c00',
                },
                {
                    type: 'giphy',
                    query: 'subscribe button youtube sticker',
                    sticker: true,
                    x: 290, y: 800,
                    width: 500, height: 500,
                    fit: 'contain',
                },
            ],
        },
    ],
};
