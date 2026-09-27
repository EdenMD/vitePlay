// ============================================================
//  APEX VIDEO ENGINE — HEALTH SERIES — HOUSEHOLD PRODUCTS,
//  LONG-TERM RISKS (PART 2)
//  Standalone educational video. No product tie-in of any kind.
//  Target: ~90 seconds | 5 scenes | am_adam voice
//  Sourced from NIH Sister Study (2022/2025), PFAS/cookware
//  research (2025-2026). Framed as documented associations,
//  not proven single-cause claims — same as Part 1.
// ============================================================
const config = {
    output: {
        title:      'health-03-household-products-longterm',
        format:     'portrait',
        fps:        30,
        crf:        24,
        preset:     'ultrafast',
        cleanup:    true,
        postProcess: {
            grain:            true,
            grainStrength:    0.022,
            vignette:         true,
            vignetteStrength: 0.45,
        },
    },
    defaults: {
        voice:              'am_adam',
        transition:         'fade',
        transitionDuration: 0.26,
    },
    scenes: [

        // ── SCENE 1 — HOOK (~13 sec) ────────────────────────────────
        {
            tts: {
                text:       'Three things in almost every kitchen and bathroom right now — not medicine this time, just ordinary household items — with documented long-term risks that took decades of research to even notice. Same rule as always: this is about knowing the risk, not throwing everything away in a panic.',
                speed:      0.95,
                emotion:    'neutral',
                pauseAfter: 0.35,
            },
            transition:         'zoom-cut',
            transitionDuration: 0.2,
            captions: {
                style:          'highlight',
                position:       'bottom',
                fontSize:       56,
                color:          '#ffffff',
                highlightColor: '#ff8c42',
                wordsPerChunk:  4,
                strokeColor:    'rgba(0,0,0,1)',
                strokeWidth:    6,
            },
            layers: [
                {
                    type:           'stock-image',
                    query:          'kitchen bathroom household items',
                    source:         'serpapi',
                    orientation:    'portrait',
                    imageIndex:     0,
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit:            'cover',
                    kenBurns:       'zoom-in',
                    kenBurnsAmount: 0.14,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.55)' },
                {
                    type:       'text',
                    text:       '3 HOUSEHOLD ITEMS.\nDECADES TO\nNOTICE THE RISK.',
                    x:          540,
                    y:          700,
                    fontSize:   60,
                    fontFamily: 'Arial Black, Impact, sans-serif',
                    fontWeight: 'bold',
                    color:      '#ffffff',
                    align:      'center',
                    maxWidth:   940,
                    lineHeight: 1.15,
                    gradient:   ['#ff8c42', '#ffb347'],
                    stroke:     true,
                    strokeColor:'#000000',
                    strokeWidth: 5,
                    glow:       true,
                    glowColor:  '#ff8c42',
                    glowBlur:   30,
                    animation:  'pop',
                    animDur:    0.35,
                    startT:     0.15,
                    hookLayer:  true,
                },
            ],
        },

        // ── SCENE 2 — NON-STICK COOKWARE / PFAS (~20 sec) ───────────
        {
            tts: {
                text:       'Non-stick pans. The coating that stops food from sticking is made using PFAS chemicals — often called "forever chemicals" because they barely break down, in the environment or in your body. The real risk isn\'t normal cooking. It\'s overheating an empty or old pan past its coating\'s limit — that\'s when it can release fumes linked to kidney and other cancers in research studies.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.3,
            },
            transition: 'wipe-left', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#ff8c42', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'nonstick frying pan kitchen', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'pan-up', kenBurnsAmount: 0.16 },
                { type: 'overlay', color: 'rgba(0,0,0,0.55)' },
                { type: 'text', text: 'NON-STICK\nCOOKWARE', x: 540, y: 380, fontSize: 62, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 920, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: '"Forever chemicals" —\nfine in normal use.', x: 540, y: 620, fontSize: 44, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 880, lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 0.5 },
                { type: 'text', text: 'RISK: OVERHEATING AN\nEMPTY OR DAMAGED PAN', x: 540, y: 950, fontSize: 46, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ff8c42', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 4, glow: true, glowColor: '#ff8c42', glowBlur: 20, animation: 'slide-up', animDur: 0.3, startT: 1.6 },
            ],
        },

        // ── SCENE 3 — CHEMICAL HAIR RELAXERS (~21 sec) ──────────────
        {
            tts: {
                text:       'Chemical hair relaxers and straighteners. A major U.S. government study tracking over thirty thousand women found that frequent users — more than four times a year — were roughly twice as likely to develop uterine cancer over their lifetime. To be fair, this is an association from observational data, not confirmed proof that the product alone causes it. But it\'s a strong enough signal that researchers say it\'s worth taking seriously, especially for frequent, long-term use.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.35,
            },
            transition: 'glitch', transitionDuration: 0.2,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#ff8c42', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'hair relaxer salon product', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.15 },
                { type: 'overlay', color: 'rgba(0,0,0,0.55)' },
                { type: 'text', text: 'HAIR RELAXERS &\nSTRAIGHTENERS', x: 540, y: 360, fontSize: 56, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 920, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'Frequent use (4+ times/year)\nlinked to roughly 2x\nuterine cancer risk.', x: 540, y: 620, fontSize: 42, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 880, lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 0.6 },
                { type: 'text', text: 'AN ASSOCIATION —\nNOT CONFIRMED SINGLE CAUSE', x: 540, y: 980, fontSize: 40, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ff8c42', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 4, glow: true, glowColor: '#ff8c42', glowBlur: 18, animation: 'slide-up', animDur: 0.3, startT: 1.9 },
            ],
        },

        // ── SCENE 4 — TALCUM POWDER (~17 sec) ───────────────────────
        {
            tts: {
                text:       'Talcum powder. Used for generations on babies and for personal hygiene. Multiple studies and years of litigation have raised concerns about long-term genital use and a possible link to ovarian cancer — the research is genuinely contested, but it\'s exactly why many manufacturers have already quietly switched to cornstarch-based alternatives.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.35,
            },
            transition: 'wipe-right', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#ff8c42', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'talcum powder bottle bathroom', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'drift', kenBurnsAmount: 0.15 },
                { type: 'overlay', color: 'rgba(0,0,0,0.55)' },
                { type: 'text', text: 'TALCUM POWDER', x: 540, y: 400, fontSize: 60, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 920, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'Contested research —\nbut manufacturers are already\nswitching to cornstarch.', x: 540, y: 660, fontSize: 42, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 880, lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 0.6 },
            ],
        },

        // ── SCENE 5 — CLOSING (~15 sec) — protective, no product pivot ─
        {
            tts: {
                text:       'None of this means panic. Most of these risks are tied to frequent, repeated, long-term exposure — not a one-off. Check for cornstarch-based alternatives where they exist, retire damaged non-stick pans, and if you use chemical hair products regularly, that\'s a reasonable thing to bring up with your doctor. Small, informed swaps — that\'s the whole point.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.4,
            },
            transition: 'zoom-cut', transitionDuration: 0.2,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#ff8c42', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'kitchen healthy home lifestyle', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'zoom-out', kenBurnsAmount: 0.14 },
                { type: 'overlay', color: 'rgba(0,0,0,0.55)' },
                { type: 'text', text: 'SMALL, INFORMED\nSWAPS.', x: 540, y: 460, fontSize: 62, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 920, lineHeight: 1.2, gradient: ['#ff8c42', '#ffb347'], stroke: true, strokeColor: '#000000', strokeWidth: 5, glow: true, glowColor: '#ff8c42', glowBlur: 24, animation: 'slide-up', animDur: 0.3, startT: 0.3 },
                { type: 'text', text: 'Not panic. Just awareness.', x: 540, y: 900, fontSize: 42, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 880, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.5 },
            ],
        },
    ],
};

module.exports = config;
