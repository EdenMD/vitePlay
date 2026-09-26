// ============================================================
//  APEX VIDEO ENGINE — PHYTOMED HERBALS ADVERTISEMENT
//  AIDA structure: Hook -> Problem -> Brand -> Products (x3) ->
//  Why Choose Us -> CTA (repeated contact info)
//  Voice: am_eric (warm, trustworthy — matches brand storytelling)
//  Target: ~70-75 seconds | 6 scenes
//  Wellness framing only — no specific disease/medical claims.
// ============================================================
const config = {
    output: {
        title:      'phytomed-herbals-ad-01',
        format:     'portrait',
        fps:        30,
        crf:        23,
        preset:     'medium',
        cleanup:    true,
        postProcess: {
            grain:            true,
            grainStrength:    0.018,
            vignette:         true,
            vignetteStrength: 0.4,
        },
    },
    defaults: {
        voice:              'am_eric',
        transition:         'fade',
        transitionDuration: 0.3,
    },
    scenes: [

        // ── SCENE 1 — HOOK + PROBLEM (~14 sec) ──────────────────────
        {
            tts: {
                text:       'Busy days. Stress. Modern diets that leave your body running on empty. Your wellness deserves more than a quick fix — it deserves a daily routine rooted in generations of natural herbal tradition.',
                speed:      0.95,
                emotion:    'neutral',
                pauseAfter: 0.35,
            },
            transition:         'fade',
            transitionDuration: 0.3,
            captions: {
                style:          'highlight',
                position:       'bottom',
                fontSize:       54,
                color:          '#ffffff',
                highlightColor: '#7fbf5f',
                wordsPerChunk:  4,
                strokeColor:    'rgba(0,0,0,1)',
                strokeWidth:    6,
            },
            layers: [
                {
                    type:           'stock-image',
                    query:          'tired stressed person modern life',
                    source:         'serpapi',
                    orientation:    'portrait',
                    imageIndex:     0,
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit:            'cover',
                    kenBurns:       'zoom-in',
                    kenBurnsAmount: 0.14,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                {
                    type:       'text',
                    text:       'YOUR WELLNESS\nDESERVES MORE',
                    x:          540,
                    y:          700,
                    fontSize:   68,
                    fontFamily: 'Arial Black, Impact, sans-serif',
                    fontWeight: 'bold',
                    color:      '#ffffff',
                    align:      'center',
                    maxWidth:   940,
                    lineHeight: 1.15,
                    gradient:   ['#7fbf5f', '#c9a227'],
                    stroke:     true,
                    strokeColor:'#000000',
                    strokeWidth: 5,
                    glow:       true,
                    glowColor:  '#7fbf5f',
                    glowBlur:   28,
                    animation:  'pop',
                    animDur:    0.35,
                    startT:     0.2,
                    hookLayer:  true,
                },
            ],
        },

        // ── SCENE 2 — BRAND INTRO (~10 sec) ─────────────────────────
        {
            tts: {
                text:       'Introducing Phytomed Herbals — a range of natural herbal products rooted in traditional herbal knowledge, trusted by families across Southern Africa.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.3,
            },
            transition: 'wipe-left', transitionDuration: 0.24,
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#7fbf5f', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'natural herbal remedies ingredients', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'pan-up', kenBurnsAmount: 0.16 },
                { type: 'overlay', color: 'rgba(0,0,0,0.48)' },
                { type: 'text', text: 'PHYTOMED\nHERBALS', x: 540, y: 700, fontSize: 84, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 940, lineHeight: 1.1, gradient: ['#7fbf5f', '#c9a227'], stroke: true, strokeColor: '#000000', strokeWidth: 6, glow: true, glowColor: '#7fbf5f', glowBlur: 30, animation: 'pop', animDur: 0.35, startT: 0.15 },
                { type: 'text', text: 'Trusted traditional herbal knowledge.\nTrusted across Southern Africa.', x: 540, y: 1000, fontSize: 42, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 880, lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.2 },
            ],
        },

        // ── SCENE 3 — PRODUCT 1: HERBAL TONIC (~13 sec) ─────────────
        {
            tts: {
                text:       'The Phytomed Herbal Tonic. A daily herbal blend crafted to support your body\'s natural balance and everyday energy — part of a wellness routine passed down through generations.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.3,
            },
            transition: 'wipe-right', transitionDuration: 0.24,
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#7fbf5f', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'herbal tonic bottle natural', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'drift', kenBurnsAmount: 0.15 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: 'PHYTOMED\nHERBAL TONIC', x: 540, y: 400, fontSize: 62, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 920, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'Daily balance.\nEveryday energy.', x: 540, y: 950, fontSize: 50, fontFamily: 'Arial Black, Impact, sans-serif', color: '#7fbf5f', align: 'center', maxWidth: 880, lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, glow: true, glowColor: '#7fbf5f', glowBlur: 18, animation: 'slide-up', animDur: 0.3, startT: 1.4 },
            ],
        },

        // ── SCENE 4 — PRODUCT 2: TEA + PRODUCT 3: IMMUNE BOOSTER (~16 sec) ─
        {
            tts: {
                text:       'The Phytomed Tea — a soothing blend of Rooibos, Honeybush, Dandelion, and Milk Thistle, a gentle daily ritual. And the Phytomed Immune Booster, crafted to support your body\'s natural defenses, every single day.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.35,
            },
            transition: 'glitch', transitionDuration: 0.2,
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#7fbf5f', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                {
                    type:     'stock-image-sequence',
                    queries: ['rooibos tea cup natural', 'dried herbs dandelion milk thistle', 'immune support supplement natural'],
                    source:   'serpapi', fit: 'cover',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',  kenBurnsAmount: 0.28 },
                        { kenBurns: 'pan-left', kenBurnsAmount: 0.26 },
                        { kenBurns: 'zoom-in',  kenBurnsAmount: 0.26 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: 'PHYTOMED TEA', x: 540, y: 330, fontSize: 58, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'Rooibos • Honeybush\nDandelion • Milk Thistle', x: 540, y: 460, fontSize: 38, fontFamily: 'Arial Black, Impact, sans-serif', color: '#7fbf5f', align: 'center', maxWidth: 860, lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 0.4 },
                { type: 'text', text: 'IMMUNE BOOSTER', x: 540, y: 1300, fontSize: 58, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 1.6 },
                { type: 'text', text: 'Natural daily defense.', x: 540, y: 1420, fontSize: 42, fontFamily: 'Arial Black, Impact, sans-serif', color: '#7fbf5f', align: 'center', maxWidth: 860, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.9 },
            ],
        },

        // ── SCENE 5 — WHY CHOOSE PHYTOMED (~10 sec) ─────────────────
        {
            tts: {
                text:       'Why Phytomed? Trusted traditional herbal knowledge. One hundred percent natural ingredients. A brand families across Southern Africa choose, every single day.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.35,
            },
            transition: 'zoom-cut', transitionDuration: 0.2,
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#7fbf5f', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'happy family natural wellness', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'zoom-out', kenBurnsAmount: 0.16 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: 'WHY PHYTOMED?', x: 540, y: 380, fontSize: 62, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 920, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: '✔ Traditional herbal knowledge\n✔ 100% natural ingredients\n✔ Trusted across Southern Africa', x: 540, y: 700, fontSize: 42, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 880, lineHeight: 1.5, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 0.6 },
            ],
        },

        // ── SCENE 6 — CTA (~14 sec) — contact info repeated, large ─
        {
            tts: {
                text:       'Visit us today at the UBM Building, corner of Fifth Street and Sixth Avenue, opposite Spar 24-hour, right here in Bulawayo. Or call us now — zero seven one, six six seven, six two five nine. Phytomed Herbals — your wellness, our tradition.',
                speed:      0.92, emotion: 'neutral', pauseAfter: 0.4,
            },
            transition: 'fade', transitionDuration: 0.3,
            captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#ffffff', highlightColor: '#7fbf5f', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'Bulawayo Zimbabwe street shop', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.12 },
                { type: 'overlay', color: 'rgba(0,0,0,0.6)' },
                { type: 'text', text: 'PHYTOMED HERBALS', x: 540, y: 330, fontSize: 56, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 940, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 0.1 },
                {
                    type:        'notification-card',
                    x:           540,
                    y:           700,
                    width:       920,
                    title:       '📍 UBM Building',
                    body:        '5th St & 6th Ave — Opposite Spar 24hrs, Bulawayo',
                    bgColor:     'rgba(127,191,95,0.16)',
                    borderColor: '#7fbf5f',
                    titleColor:  '#7fbf5f',
                    bodyColor:   '#ffffff',
                    fontSize:    38,
                    bodySize:    30,
                    borderRadius:18,
                    animation:   'slide-up',
                    animDur:     0.32,
                    startT:      0.5,
                },
                {
                    type:        'notification-card',
                    x:           540,
                    y:           920,
                    width:       920,
                    title:       '📞 +263 71 667 6259',
                    body:        'Call or WhatsApp us today',
                    bgColor:     'rgba(201,162,39,0.18)',
                    borderColor: '#c9a227',
                    titleColor:  '#c9a227',
                    bodyColor:   '#ffffff',
                    fontSize:    42,
                    bodySize:    28,
                    borderRadius:18,
                    animation:   'slide-up',
                    animDur:     0.32,
                    startT:      1.6,
                },
                { type: 'text', text: 'YOUR WELLNESS.\nOUR TRADITION.', x: 540, y: 1550, fontSize: 44, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.25, gradient: ['#7fbf5f', '#c9a227'], stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 2.5 },
            ],
        },
    ],
};

module.exports = config;
