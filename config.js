// ============================================================
//  APEX VIDEO ENGINE — HEALTH SERIES — DRUGS IN EVERY HOUSEHOLD
//  Standalone educational video. No product tie-in of any kind.
//  Target: ~90 seconds | 5 scenes | am_adam voice
//  Framed for a Zimbabwean audience — common, widely available
//  OTC medications, not prescription-only drugs.
// ============================================================
const config = {
    output: {
        title:      'health-01-household-drugs-longterm',
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
                text:       'Three medicines sitting in almost every household right now — safe, effective, and completely legal — that carry a long-term risk most people have never been told about. This isn\'t about avoiding them. It\'s about knowing what "long-term" actually means.',
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
                    query:          'home medicine cabinet pills',
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
                    text:       '3 MEDICINES IN\nYOUR HOUSE —\nTHE LONG-TERM RISK',
                    x:          540,
                    y:          700,
                    fontSize:   64,
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

        // ── SCENE 2 — PARACETAMOL (~19 sec) ─────────────────────────
        {
            tts: {
                text:       'Paracetamol. Used correctly, it\'s one of the safest pain relievers there is — that\'s exactly why it\'s in almost every home. The risk isn\'t an occasional dose for a headache. It\'s regularly taking more than the daily limit, or combining it with other paracetamol-containing products without realizing it. That\'s the leading cause of sudden liver failure linked to a single drug, worldwide.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.3,
            },
            transition: 'wipe-left', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#ff8c42', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'paracetamol tablets bottle', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'pan-up', kenBurnsAmount: 0.16 },
                { type: 'overlay', color: 'rgba(0,0,0,0.55)' },
                { type: 'text', text: 'PARACETAMOL', x: 540, y: 380, fontSize: 68, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 920, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'Safe at the right dose.\nDangerous over the limit,\nregularly.', x: 540, y: 620, fontSize: 44, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 880, lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 0.5 },
                { type: 'text', text: 'LEADING CAUSE OF\nSUDDEN LIVER FAILURE', x: 540, y: 950, fontSize: 50, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ff8c42', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 4, glow: true, glowColor: '#ff8c42', glowBlur: 20, animation: 'slide-up', animDur: 0.3, startT: 1.6 },
            ],
        },

        // ── SCENE 3 — IBUPROFEN / NSAIDs (~19 sec) ──────────────────
        {
            tts: {
                text:       'Ibuprofen and similar painkillers. Fantastic for a short course — swelling, fever, period pain, a bad headache. But daily, long-term use — months or years, not days — is linked to real kidney damage and a higher risk of heart problems. It\'s built for short bursts, not as a daily habit.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.3,
            },
            transition: 'wipe-right', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#ff8c42', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'ibuprofen painkiller tablets', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'drift', kenBurnsAmount: 0.15 },
                { type: 'overlay', color: 'rgba(0,0,0,0.55)' },
                { type: 'text', text: 'IBUPROFEN &\nPAINKILLERS', x: 540, y: 380, fontSize: 60, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 920, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'Great for short bursts —\nswelling, fever, pain.', x: 540, y: 640, fontSize: 44, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 880, lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 0.5 },
                { type: 'text', text: 'DAILY, LONG-TERM USE:\nKIDNEY & HEART RISK', x: 540, y: 950, fontSize: 46, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ff8c42', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 4, glow: true, glowColor: '#ff8c42', glowBlur: 20, animation: 'slide-up', animDur: 0.3, startT: 1.6 },
            ],
        },

        // ── SCENE 4 — DIPHENHYDRAMINE / SLEEP-ALLERGY PILLS (~20 sec) ─
        {
            tts: {
                text:       'Diphenhydramine — the active ingredient in most over-the-counter sleep aids and allergy pills. Perfectly fine for occasional use, a bad allergy day, a rough night. The concern is years of regular, nightly use — large studies have linked that pattern to a higher long-term risk of memory and cognitive decline. Occasional use isn\'t the issue. Making it a permanent nightly habit is.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.35,
            },
            transition: 'glitch', transitionDuration: 0.2,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#ff8c42', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'sleep aid allergy pills bottle', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.15 },
                { type: 'overlay', color: 'rgba(0,0,0,0.55)' },
                { type: 'text', text: 'SLEEP AIDS &\nALLERGY PILLS', x: 540, y: 360, fontSize: 58, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 920, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'Fine occasionally.\nThe risk is making it a\nnightly habit, for years.', x: 540, y: 630, fontSize: 42, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 880, lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 0.6 },
                { type: 'text', text: 'LINKED TO LONG-TERM\nCOGNITIVE DECLINE RISK', x: 540, y: 970, fontSize: 44, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ff8c42', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 4, glow: true, glowColor: '#ff8c42', glowBlur: 20, animation: 'slide-up', animDur: 0.3, startT: 1.8 },
            ],
        },

        // ── SCENE 5 — CLOSING (~15 sec) — protective, no pivot ──────
        {
            tts: {
                text:       'None of this means throw these away — used properly, they\'re genuinely safe medicines that help millions of people every day. The rule that actually matters: know the dose, know the limit, and if you\'re taking any of these regularly for weeks or months, that\'s a conversation worth having with your pharmacist or doctor — not a reason to panic.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.4,
            },
            transition: 'zoom-cut', transitionDuration: 0.2,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#ff8c42', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'pharmacist consultation advice', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'zoom-out', kenBurnsAmount: 0.14 },
                { type: 'overlay', color: 'rgba(0,0,0,0.55)' },
                { type: 'text', text: 'KNOW THE DOSE.\nKNOW THE LIMIT.', x: 540, y: 460, fontSize: 62, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 920, lineHeight: 1.2, gradient: ['#ff8c42', '#ffb347'], stroke: true, strokeColor: '#000000', strokeWidth: 5, glow: true, glowColor: '#ff8c42', glowBlur: 24, animation: 'slide-up', animDur: 0.3, startT: 0.3 },
                { type: 'text', text: 'Ask your pharmacist —\nnot a reason to panic.', x: 540, y: 900, fontSize: 42, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 880, lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.5 },
            ],
        },
    ],
};

module.exports = config;
