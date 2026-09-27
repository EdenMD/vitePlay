// ============================================================
// APEX VIDEO ENGINE — HEALTH SERIES
// THE COLD & FLU MEDICINE MISTAKE THAT CAN CAUSE AN OVERDOSE
//
// Target: Zimbabwean audience
// Format: Vertical 9:16
// Style: Investigative / consumer health / high retention
// Target duration: ~75–80 seconds
//
// CORE HOOK:
// Different brands do NOT always mean different ingredients.
//
// IMPORTANT:
// Educational consumer-safety content.
// Do not imply that normal recommended use is dangerous.
// ============================================================

const config = {

    output: {
        title: 'health-03-cold-flu-medicine-overdose-zimbabwe',
        format: 'portrait',
        fps: 30,
        crf: 24,
        preset: 'ultrafast',
        cleanup: true,

        postProcess: {
            grain: true,
            grainStrength: 0.018,
            vignette: true,
            vignetteStrength: 0.38,
        },
    },

    defaults: {
        voice: 'am_adam',
        transition: 'fade',
        transitionDuration: 0.20,
    },

    scenes: [

        // ========================================================
        // SCENE 1 — THE HOOK
        // ~9 SEC
        // ========================================================
        {
            tts: {
                text:
                    'You take one medicine for flu. Then another for the headache. Then something else for the fever. But what if two of them contain the same medicine?',

                speed: 0.94,
                emotion: 'neutral',
                pauseAfter: 0.2,
            },

            transition: 'zoom-cut',
            transitionDuration: 0.15,

            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 54,
                color: '#ffffff',
                highlightColor: '#ff5a3c',
                wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)',
                strokeWidth: 6,
            },

            layers: [

                {
                    type: 'stock-image',
                    query:
                        'cold flu medicine tablets medicine boxes pharmacy',
                    source: 'serpapi',
                    orientation: 'portrait',
                    imageIndex: 0,

                    x: 0,
                    y: 0,
                    width: 1080,
                    height: 1920,

                    fit: 'cover',
                    kenBurns: 'zoom-in',
                    kenBurnsAmount: 0.18,
                },

                {
                    type: 'overlay',
                    color: 'rgba(0,0,0,0.60)',
                },

                {
                    type: 'text',
                    text:
                        'THREE MEDICINES.\nONE HIDDEN PROBLEM.',
                    x: 540,
                    y: 520,

                    fontSize: 68,
                    fontFamily: 'Arial Black, Impact, sans-serif',
                    fontWeight: 'bold',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 930,
                    lineHeight: 1.08,

                    gradient: [
                        '#ff5a3c',
                        '#ff8c42'
                    ],

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 5,

                    glow: true,
                    glowColor: '#ff5a3c',
                    glowBlur: 24,

                    animation: 'pop',
                    animDur: 0.30,
                    startT: 0.05,

                    hookLayer: true,
                },

                {
                    type: 'text',
                    text:
                        'DIFFERENT BRANDS ≠ DIFFERENT INGREDIENTS',
                    x: 540,
                    y: 950,

                    fontSize: 37,
                    fontFamily: 'Arial Black, Impact, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 920,

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 4,

                    animation: 'fade',
                    animDur: 0.25,
                    startT: 1.4,
                },
            ],
        },


        // ========================================================
        // SCENE 2 — EVERYDAY ZIMBABWEAN SCENARIO
        // ~11 SEC
        // ========================================================
        {
            tts: {
                text:
                    'Picture this. You've got a headache, a blocked nose and a fever. You buy one product for the flu and another for the headache. It feels like you're treating different problems. But the ingredients may overlap.',

                speed: 0.94,
                emotion: 'neutral',
                pauseAfter: 0.22,
            },

            transition: 'wipe-left',
            transitionDuration: 0.20,

            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 52,
                color: '#ffffff',
                highlightColor: '#ff5a3c',
                wordsPerChunk: 4,
                strokeColor: 'rgba(0,0,0,1)',
                strokeWidth: 6,
            },

            layers: [

                {
                    type: 'stock-image',
                    query:
                        'African pharmacy customer buying cold medicine pharmacist',
                    source: 'serpapi',
                    orientation: 'portrait',
                    imageIndex: 0,

                    x: 0,
                    y: 0,
                    width: 1080,
                    height: 1920,

                    fit: 'cover',
                    kenBurns: 'pan-right',
                    kenBurnsAmount: 0.15,
                },

                {
                    type: 'overlay',
                    color: 'rgba(0,0,0,0.57)',
                },

                {
                    type: 'text',
                    text:
                        'FLU.\nHEADACHE.\nFEVER.',
                    x: 540,
                    y: 430,

                    fontSize: 72,
                    fontFamily: 'Impact, Arial Black, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 850,
                    lineHeight: 1.08,

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 5,

                    animation: 'pop',
                    animDur: 0.30,
                    startT: 0.10,
                },

                {
                    type: 'text',
                    text:
                        'THREE SYMPTOMS.\nMULTIPLE PRODUCTS.',
                    x: 540,
                    y: 930,

                    fontSize: 45,
                    fontFamily: 'Arial Black, Impact, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 850,
                    lineHeight: 1.18,

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 4,

                    animation: 'slide-up',
                    animDur: 0.3,
                    startT: 1.4,
                },
            ],
        },


        // ========================================================
        // SCENE 3 — THE REVEAL
        // ~12 SEC
        // ========================================================
        {
            tts: {
                text:
                    'Here's the problem. Some cold and flu products contain paracetamol, the same medicine found in many products used for pain and fever. Taking multiple products with the same active ingredient can make it easier to accidentally take too much.',

                speed: 0.93,
                emotion: 'neutral',
                pauseAfter: 0.25,
            },

            transition: 'glitch',
            transitionDuration: 0.17,

            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 52,
                color: '#ffffff',
                highlightColor: '#ff5a3c',
                wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)',
                strokeWidth: 6,
            },

            layers: [

                {
                    type: 'stock-image',
                    query:
                        'paracetamol tablets medicine packaging close up',
                    source: 'serpapi',
                    orientation: 'portrait',
                    imageIndex: 0,

                    x: 0,
                    y: 0,
                    width: 1080,
                    height: 1920,

                    fit: 'cover',
                    kenBurns: 'zoom-in',
                    kenBurnsAmount: 0.17,
                },

                {
                    type: 'overlay',
                    color: 'rgba(0,0,0,0.62)',
                },

                {
                    type: 'text',
                    text:
                        'CHECK THE\nACTIVE INGREDIENTS',
                    x: 540,
                    y: 390,

                    fontSize: 62,
                    fontFamily: 'Impact, Arial Black, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 900,
                    lineHeight: 1.1,

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 5,

                    animation: 'pop',
                    animDur: 0.3,
                    startT: 0.10,
                },

                {
                    type: 'text',
                    text:
                        'PARACETAMOL',
                    x: 540,
                    y: 790,

                    fontSize: 70,
                    fontFamily: 'Arial Black, Impact, sans-serif',

                    color: '#ff5a3c',
                    align: 'center',

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 5,

                    glow: true,
                    glowColor: '#ff5a3c',
                    glowBlur: 28,

                    animation: 'pop',
                    animDur: 0.25,
                    startT: 1.1,
                },

                {
                    type: 'text',
                    text:
                        'ONE INGREDIENT\nCAN APPEAR IN MORE THAN ONE PRODUCT.',
                    x: 540,
                    y: 1050,

                    fontSize: 38,
                    fontFamily: 'Arial Black, Impact, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 900,
                    lineHeight: 1.25,

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 4,

                    animation: 'fade',
                    animDur: 0.3,
                    startT: 1.7,
                },
            ],
        },


        // ========================================================
        // SCENE 4 — WHY OVERDOSE IS SERIOUS
        // ~12 SEC
        // ========================================================
        {
            tts: {
                text:
                    'Too much paracetamol can cause serious liver damage. And that's what makes accidental overdose dangerous: early symptoms may not always seem severe. You may think you're simply dealing with the flu, while something much more serious is happening.',

                speed: 0.93,
                emotion: 'neutral',
                pauseAfter: 0.3,
            },

            transition: 'fade',
            transitionDuration: 0.20,

            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 52,
                color: '#ffffff',
                highlightColor: '#ff5a3c',
                wordsPerChunk: 4,
                strokeColor: 'rgba(0,0,0,1)',
                strokeWidth: 6,
            },

            layers: [

                {
                    type: 'stock-image',
                    query:
                        'liver medical illustration human anatomy',
                    source: 'serpapi',
                    orientation: 'portrait',
                    imageIndex: 0,

                    x: 0,
                    y: 0,
                    width: 1080,
                    height: 1920,

                    fit: 'cover',
                    kenBurns: 'drift',
                    kenBurnsAmount: 0.12,
                },

                {
                    type: 'overlay',
                    color: 'rgba(0,0,0,0.65)',
                },

                {
                    type: 'text',
                    text:
                        'TOO MUCH\nCAN BE DANGEROUS.',
                    x: 540,
                    y: 450,

                    fontSize: 67,
                    fontFamily: 'Impact, Arial Black, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 900,
                    lineHeight: 1.08,

                    gradient: [
                        '#ff5a3c',
                        '#ff8c42'
                    ],

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 5,

                    glow: true,
                    glowColor: '#ff5a3c',
                    glowBlur: 22,

                    animation: 'pop',
                    animDur: 0.3,
                    startT: 0.15,
                },

                {
                    type: 'text',
                    text:
                        'SERIOUS LIVER DAMAGE',
                    x: 540,
                    y: 900,

                    fontSize: 48,
                    fontFamily: 'Arial Black, Impact, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 900,

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 4,

                    animation: 'slide-up',
                    animDur: 0.3,
                    startT: 1.4,
                },

                {
                    type: 'text',
                    text:
                        'AND EARLY WARNING SIGNS\nMAY NOT SEEM SEVERE.',
                    x: 540,
                    y: 1100,

                    fontSize: 35,
                    fontFamily: 'Arial Black, Impact, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 850,
                    lineHeight: 1.25,

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 4,

                    animation: 'fade',
                    animDur: 0.25,
                    startT: 2.1,
                },
            ],
        },


        // ========================================================
        // SCENE 5 — ZIMBABWEAN PRACTICAL ANGLE
        // ~11 SEC
        // ========================================================
        {
            tts: {
                text:
                    'So when you're buying medicine for a cold or flu in Zimbabwe, don't only look at the brand name. Look at the active ingredients. And if you're taking more than one medicine, ask a pharmacist whether the ingredients overlap.',

                speed: 0.94,
                emotion: 'neutral',
                pauseAfter: 0.25,
            },

            transition: 'wipe-right',
            transitionDuration: 0.20,

            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 52,
                color: '#ffffff',
                highlightColor: '#ff8c42',
                wordsPerChunk: 4,
                strokeColor: 'rgba(0,0,0,1)',
                strokeWidth: 6,
            },

            layers: [

                {
                    type: 'stock-image',
                    query:
                        'African pharmacist customer pharmacy medicine',
                    source: 'serpapi',
                    orientation: 'portrait',
                    imageIndex: 0,

                    x: 0,
                    y: 0,
                    width: 1080,
                    height: 1920,

                    fit: 'cover',
                    kenBurns: 'zoom-out',
                    kenBurnsAmount: 0.13,
                },

                {
                    type: 'overlay',
                    color: 'rgba(0,0,0,0.53)',
                },

                {
                    type: 'text',
                    text:
                        'DON’T JUST CHECK\nTHE BRAND.',
                    x: 540,
                    y: 420,

                    fontSize: 67,
                    fontFamily: 'Impact, Arial Black, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 900,
                    lineHeight: 1.1,

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 5,

                    animation: 'pop',
                    animDur: 0.3,
                    startT: 0.1,
                },

                {
                    type: 'text',
                    text:
                        'CHECK THE\nACTIVE INGREDIENTS.',
                    x: 540,
                    y: 820,

                    fontSize: 55,
                    fontFamily: 'Arial Black, Impact, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 850,
                    lineHeight: 1.15,

                    gradient: [
                        '#ff5a3c',
                        '#ff8c42'
                    ],

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 5,

                    animation: 'slide-up',
                    animDur: 0.3,
                    startT: 1.3,
                },

                {
                    type: 'text',
                    text:
                        'WHEN IN DOUBT,\nASK A PHARMACIST.',
                    x: 540,
                    y: 1120,

                    fontSize: 38,
                    fontFamily: 'Arial Black, Impact, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 800,
                    lineHeight: 1.25,

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 4,

                    animation: 'fade',
                    animDur: 0.25,
                    startT: 2.0,
                },
            ],
        },


        // ========================================================
        // SCENE 6 — FINAL RETENTION / CTA
        // ~10 SEC
        // ========================================================
        {
            tts: {
                text:
                    'And if you think you've taken more medicine than recommended, don't wait for serious symptoms. Seek medical advice promptly. Before you take another cold medicine, check what's already in the one you took.',

                speed: 0.92,
                emotion: 'neutral',
                pauseAfter: 0.45,
            },

            transition: 'zoom-cut',
            transitionDuration: 0.18,

            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 52,
                color: '#ffffff',
                highlightColor: '#ff5a3c',
                wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)',
                strokeWidth: 6,
            },

            layers: [

                {
                    type: 'gradient',
                    gradientType: 'linear',

                    colors: [
                        '#050505',
                        '#180b0b',
                        '#050505'
                    ],

                    angle: 150,

                    vignette: true,
                    vignetteStrength: 0.45,
                },

                {
                    type: 'text',
                    text:
                        'BEFORE YOU\nTAKE ANOTHER ONE…',
                    x: 540,
                    y: 480,

                    fontSize: 68,
                    fontFamily: 'Impact, Arial Black, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 930,
                    lineHeight: 1.05,

                    animation: 'pop',
                    animDur: 0.3,
                    startT: 0.15,
                },

                {
                    type: 'text',
                    text:
                        'CHECK WHAT’S\nALREADY INSIDE.',
                    x: 540,
                    y: 820,

                    fontSize: 57,
                    fontFamily: 'Arial Black, Impact, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 850,
                    lineHeight: 1.1,

                    gradient: [
                        '#ff5a3c',
                        '#ff8c42'
                    ],

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 5,

                    glow: true,
                    glowColor: '#ff5a3c',
                    glowBlur: 25,

                    animation: 'slide-up',
                    animDur: 0.3,
                    startT: 1.1,
                },

                {
                    type: 'text',
                    text:
                        'DIFFERENT BRAND.\nSAME ACTIVE INGREDIENT.',
                    x: 540,
                    y: 1110,

                    fontSize: 35,
                    fontFamily: 'Arial Black, Impact, sans-serif',

                    color: '#ffffff',
                    align: 'center',
                    maxWidth: 850,
                    lineHeight: 1.25,

                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 4,

                    animation: 'fade',
                    animDur: 0.25,
                    startT: 2.0,
                },
            ],
        },
    ],
};

module.exports = config;