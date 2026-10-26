// config.inequalities.js
// "The Math Behind Why The Rich Get Richer"
// Wealth inequality explained via Gini coefficient + compound growth math.
// Narrative hook → math visualization (audio-synced LaTeX) → real-world impact → CTA
// am_michael voice, dark aesthetic, no bgMusic (let the math speak).

module.exports = {
    output: {
        title: 'wealth-inequality-math',
        format: 'portrait',
        fps: 30,
        crf: 23,
        preset: 'fast',
        postProcess: {
            grain: true,
            grainStrength: 0.02,
            vignette: true,
            vignetteStrength: 0.4,
        },
    },

    defaults: {
        voice: 'am_michael',
        transition: 'fade',
        transitionDuration: 0.35,
    },

    scenes: [
        // ══ SCENE 1 — Hook: The Observation ════════════════════════════════
        {
            tts: {
                text: "There's a number hidden in every economy that explains why the rich get richer faster than anyone else can catch up. It's called the Gini coefficient, and it measures inequality in a single decimal. Most people have never heard of it. But it governs everything.",
                voice: 'am_michael',
                pauseAfter: 0.5,
            },
            captions: true,
            layers: [
                {
                    type: 'gradient',
                    gradientType: 'linear',
                    colors: ['#0f0f1e', '#1a0a2e', '#16213e'],
                    angle: 135,
                },
                {
                    type: 'text',
                    text: 'THE MATH BEHIND\nWEALTH INEQUALITY',
                    x: 540,
                    y: 240,
                    fontSize: 44,
                    fontFamily: 'Arial Black, sans-serif',
                    color: '#00d4ff',
                    align: 'center',
                    hookLayer: true,
                    stroke: true,
                    strokeColor: '#000080',
                    strokeWidth: 3,
                },
                {
                    type: 'text',
                    text: 'why the system is designed to fail most people',
                    x: 540,
                    y: 340,
                    fontSize: 28,
                    fontFamily: 'Arial, sans-serif',
                    color: 'rgba(255, 255, 255, 0.6)',
                    align: 'center',
                },
            ],
        },

        // ══ SCENE 2 — The Problem: Wealth Distribution ═════════════════════
        {
            tts: {
                text: "Right now, today, the richest one percent of people on Earth own more wealth than the entire middle class. Not most of it. More than all of it combined. That gap didn't happen by accident. It's math.",
                voice: 'am_michael',
                pauseAfter: 0.5,
            },
            captions: {
                style: 'highlight',
                fontSize: 56,
                color: '#ffffff',
                highlightColor: '#ff4444',
                wordsPerChunk: 2,
                strokeColor: 'rgba(0,0,0,1)',
                strokeWidth: 4,
            },
            layers: [
                {
                    type: 'background',
                    color: '#0a0a14',
                    noise: true,
                    noiseOpacity: 0.04,
                },
                {
                    type: 'text',
                    text: 'WEALTH DISTRIBUTION TODAY',
                    x: 540,
                    y: 180,
                    fontSize: 38,
                    fontFamily: 'Arial Black, sans-serif',
                    color: '#00d4ff',
                    align: 'center',
                },
                {
                    type: 'html-record',
                    src: './ApexCasing/chart.html?wealth-pie-1',
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0,
                    y: 0,
                    width: 1080,
                    height: 1920,
                    fit: 'cover',
                    waitFor: '[data-ready="1"]',
                    duration: 5,
                    cursor: false,
                    data: {
                        type: 'pie',
                        title: 'Global Wealth Distribution',
                        values: [
                            { label: 'Top 1%', value: 37 },
                            { label: 'Next 9%', value: 36 },
                            { label: 'Middle 40%', value: 23 },
                            { label: 'Bottom 50%', value: 4 },
                        ],
                        colors: ['#ff4444', '#ff9944', '#ffdd00', '#4444ff'],
                    },
                },
            ],
        },

        // ══ SCENE 3 — The Math: Compound Growth & The Gini Coefficient ═════
        {
            tts: {
                text: "When you have wealth, you don't just keep it. You invest it. And invested money grows at a fixed percentage every year. That's called compound growth. At six percent annual return, your money doubles in twelve years. At five percent, the doubling time is fourteen years. But here's the catch. The poor have no money to invest. They have zero. And no matter how many years pass, zero times any percentage is still zero.",
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            captions: false,
            layers: [
                {
                    type: 'background',
                    color: '#0a0a14',
                    noise: true,
                    noiseOpacity: 0.03,
                },
                {
                    type: 'html-record',
                    src: './ApexCasing/math-latex-explainer.html?gini-compound',
                    audioSync: true,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0,
                    y: 0,
                    width: 1080,
                    height: 1920,
                    fit: 'cover',
                    waitFor: '[data-ready="1"]',
                    duration: 14,
                    cursor: false,
                    data: {
                        theme: { accent: '#00ff88', text: '#ffffff', bg: 'transparent' },
                        commands: [
                            // "compound growth" — introduce the formula
                            {
                                id: 'eq1',
                                type: 'write',
                                latex: 'A(t) = P(1 + r)^t',
                                x: 540,
                                y: 400,
                                size: 64,
                                trigger: { wordText: 'compound growth', occurrence: 1 },
                            },

                            // "At six percent" — first number example
                            {
                                id: 'eq2',
                                type: 'write',
                                latex: '\\text{$1000 @ 6\\% = }',
                                x: 200,
                                y: 700,
                                size: 52,
                                trigger: { wordText: 'six percent', occurrence: 1 },
                            },

                            // "doubles in twelve years" — the result
                            {
                                id: 'eq3',
                                type: 'write',
                                latex: '\\text{$2000 in 12 years}',
                                x: 500,
                                y: 700,
                                size: 52,
                                trigger: { wordText: 'twelve', occurrence: 1 },
                            },

                            // "At five percent" — show slower growth
                            {
                                id: 'eq4',
                                type: 'write',
                                latex: '\\text{5\\% = doubles in 14 years}',
                                x: 200,
                                y: 900,
                                size: 48,
                                trigger: { wordText: 'five percent', occurrence: 1 },
                            },

                            // "zero times any percentage is still zero" — the trap
                            {
                                id: 'eq5',
                                type: 'write',
                                latex: '\\$0 \\times (1 + r)^t = \\$0',
                                x: 540,
                                y: 1200,
                                size: 72,
                                trigger: { wordText: 'zero', occurrence: 2 },
                                color: '#ff4444',
                            },

                            // Highlight the zero equation
                            {
                                id: 'hl1',
                                type: 'highlight',
                                target: 'eq5',
                                holdSec: 2.0,
                                trigger: { afterId: 'eq5', offset: 0.5 },
                            },
                        ],
                    },
                },
            ],
        },

        // ══ SCENE 4 — The Gini Coefficient: Measuring Inequality ════════════
        {
            tts: {
                text: "Economists use something called the Gini coefficient to measure inequality. Zero means perfect equality, everyone has the same. One means perfect inequality, one person has everything, everyone else has nothing. Most developed countries sit between zero point three and zero point four. That might sound small. It's not. Because the math compounds year after year.",
                voice: 'am_michael',
                pauseAfter: 0.5,
            },
            captions: {
                style: 'highlight',
                fontSize: 54,
                color: '#ffffff',
                highlightColor: '#00ff88',
                wordsPerChunk: 2,
                strokeColor: 'rgba(0,0,0,1)',
                strokeWidth: 4,
            },
            layers: [
                {
                    type: 'background',
                    color: '#0a0a14',
                    noise: true,
                    noiseOpacity: 0.03,
                },
                {
                    type: 'text',
                    text: 'THE GINI COEFFICIENT',
                    x: 540,
                    y: 180,
                    fontSize: 38,
                    fontFamily: 'Arial Black, sans-serif',
                    color: '#00d4ff',
                    align: 'center',
                },
                {
                    type: 'html-record',
                    src: './ApexCasing/data-table.html?gini-scale',
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0,
                    y: 0,
                    width: 1080,
                    height: 1920,
                    fit: 'cover',
                    waitFor: '[data-ready="1"]',
                    duration: 7,
                    cursor: false,
                    data: {
                        rows: [
                            { label: 'Perfect Equality', value: '0.00', color: '#00ff88' },
                            { label: 'Denmark (low)', value: '0.27', color: '#ffdd00' },
                            { label: 'USA (high)', value: '0.48', color: '#ff9944' },
                            { label: 'South Africa', value: '0.63', color: '#ff4444' },
                            { label: 'Perfect Inequality', value: '1.00', color: '#880000' },
                        ],
                    },
                },
            ],
        },

        // ══ SCENE 5 — The Compounding Effect Over Decades ═══════════════════
        {
            tts: {
                text: "One percent per year doesn't sound like much. But across three decades, someone with a million dollars turns it into two point something million. Someone with a billion turns it into two billion. The gap doesn't just stay the same. It multiplies. And because wealth buys influence, that influence buys policy. Policy that keeps the rich's returns high and everyone else's options limited.",
                voice: 'am_michael',
                pauseAfter: 0.5,
            },
            captions: false,
            layers: [
                {
                    type: 'background',
                    color: '#0a0a14',
                    noise: true,
                    noiseOpacity: 0.03,
                },
                {
                    type: 'html-record',
                    src: './ApexCasing/chart.html?wealth-growth',
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0,
                    y: 0,
                    width: 1080,
                    height: 1920,
                    fit: 'cover',
                    waitFor: '[data-ready="1"]',
                    duration: 8,
                    cursor: false,
                    data: {
                        type: 'line',
                        title: '30-Year Wealth Growth @ 5% Annual Return',
                        lines: [
                            {
                                label: '$1 Million → $4.3M',
                                values: [1, 1.05, 1.1, 1.16, 1.22, 1.28, 1.35, 1.42, 1.5, 1.58, 1.66, 1.76, 1.86, 1.97, 2.08, 2.2, 2.33, 2.46, 2.6, 2.75, 2.92, 3.09, 3.28, 3.49, 3.71, 3.93, 4.17, 4.32],
                                color: '#ffdd00',
                            },
                            {
                                label: '$1 Billion → $4.3B',
                                values: [1000, 1050, 1102, 1157, 1216, 1276, 1341, 1410, 1481, 1555, 1634, 1716, 1801, 1891, 1986, 2088, 2193, 2302, 2417, 2538, 2665, 2799, 2939, 3087, 3241, 3403, 3573, 3754],
                                color: '#ff4444',
                            },
                        ],
                    },
                },
            ],
        },

        // ══ SCENE 6 — The Closing: Why This Matters ════════════════════════
        {
            tts: {
                text: "This is not a flaw. This is a feature. The system is working exactly as designed. Wealth compounds. Poverty compounds too. Not wealth, but lack of opportunity. Lack of healthcare. Lack of time to learn. The math is rigged not because it's complicated, but because most people have never learned it.",
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            captions: true,
            layers: [
                {
                    type: 'gradient',
                    gradientType: 'radial',
                    colors: ['#1a0a2e', '#0f0f1e', '#000000'],
                    vignette: true,
                    vignetteStrength: 0.5,
                },
                {
                    type: 'quote-card',
                    text: 'Inequality isn\'t a bug. It\'s a feature designed by mathematics and protected by policy.',
                    x: 540,
                    y: 860,
                    width: 920,
                    fontSize: 42,
                    accentColor: '#ff4444',
                    showCard: true,
                    showLines: true,
                    animDur: 0.7,
                },
            ],
        },

        // ══ SCENE 7 — CTA: Subscribe ═══════════════════════════════════════
        {
            tts: {
                text: "Subscribe for more videos breaking down the hidden math behind how the world actually works. Economics, physics, history. All of it is just patterns waiting to be understood.",
                voice: 'am_michael',
                pauseAfter: 0.4,
            },
            captions: false,
            layers: [
                {
                    type: 'gradient',
                    gradientType: 'linear',
                    colors: ['#0f0f1e', '#1a0a2e'],
                    angle: 135,
                },
                {
                    type: 'notification-card',
                    appColor: '#00d4ff',
                    x: 540,
                    y: 900,
                    width: 900,
                    height: 180,
                },
                {
                    type: 'text',
                    text: 'MORE VIDEOS BREAKING\nDOWN HIDDEN SYSTEMS',
                    x: 540,
                    y: 1650,
                    fontSize: 32,
                    fontFamily: 'Arial, sans-serif',
                    color: 'rgba(255, 255, 255, 0.7)',
                    align: 'center',
                },
            ],
        },
    ],
};
