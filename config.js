// config.gun-suppressor-irony.js
// Same exact blueprint/story-intent as the Gatling/Tommy Gun cuts, different
// weapon: the firearm suppressor ("silencer"). Real, documented: Hiram
// Percy Maxim — the same inventor behind the automobile muffler — patented
// it in 1909 as a hearing-safety device for hunters and sport shooters,
// sold openly through hardware stores and mail-order catalogs for decades.
// Then came the 1934 National Firearms Act, passed in the panic following
// Capone-era gangster violence — and suppressors got regulated exactly
// like machine guns, taxed at $200 (a huge sum at the time), despite real
// criminals almost never actually using them. Same irony arc as Gatling/
// Tommy Gun — a device meant to protect people got legally treated as one
// of the most dangerous things you could own.
//
// Rotate Ken Burns actually used this time (2 spots) — the old template's
// "image roll... pan + rotate combo" comment never matched its real
// kenBurns value (it was still 'zoom-out'). Fixed here for real.
//
// Run with:  VIDEO_CONFIG=config.gun-suppressor-irony.js node engine-ci.js

module.exports = {
    output: {
        title:  'the-safety-device-that-got-banned-like-a-machine-gun',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',
        postProcess: { grain: true, grainStrength: 0.02, vignette: true, vignetteStrength: 0.35 },
    },

    defaults: { voice: 'bm_george', transitionDuration: 0.35 },

    scenes: [
        // ══ OPEN — in medias res, no wind-up ══════════════════════════════
        {
            tts: { text: "So Hiram Percy Maxim had an idea. If baffles could quiet a car engine, the same trick could quiet a gunshot — and finally protect a hunter's hearing.", voice: 'bm_george', pauseAfter: 0.5 },
            transition: 'zoom-out',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'gun inventor workshop tools sketching', source: 'serpapi', orientation: 'portrait', kenBurns: 'zoom-out', kenBurnsAmount: 0.52, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
            ],
        },
        {
            tts: { text: "He called it common sense: sportsmen were going deaf one shot at a time, and a simple tube of baffles could stop it.", voice: 'bm_george', pauseAfter: 0.6 },
            transition: 'fade',
            captions: true,
            layers: [
                { type: 'gradient', gradientType: 'radial', colors: ['#1a0000', '#000000'], vignette: true, vignetteStrength: 0.45 },
                { type: 'quote-card', text: 'He believed a simple tube of steel could save a hunter\u2019s hearing.', x: 540, y: 860, width: 900, fontSize: 40, accentColor: '#ff3b5c', showCard: true, showLines: true, animDur: 0.6 },
            ],
        },
        {
            tts: { text: "By 1909 his patent was ready: a small steel cylinder that screwed onto the barrel and quieted a gunshot almost completely. He called it the Maxim Silencer.", voice: 'bm_george', pauseAfter: 0.4 },
            transition: 'iris',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'vintage gun silencer patent device closeup', source: 'serpapi', orientation: 'portrait', kenBurns: 'zoom-in', kenBurnsAmount: 0.56, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
            ],
        },

        // ══ NEW — added emotional beat ════════════════════════════════════
        {
            tts: { text: "Somewhere in hunting camps and shooting ranges across the country were sportsmen who had already spent years slowly losing their hearing, one unprotected shot at a time.", voice: 'bm_george', pauseAfter: 0.6 },
            transition: 'split-v',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'vintage hunter shooting rifle range 1900s', source: 'serpapi', orientation: 'portrait', kenBurns: 'rotate-ccw', kenBurnsAmount: 0.5, rotateDeg: 9, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
            ],
        },

        // ══ THE IRONY / TURN ══════════════════════════════════════════════
        {
            tts: { text: "Then came 1934 — a wave of gangster panic swept through Washington after Capone and the St. Valentine's Day Massacre. Congress decided to regulate his quiet little safety device exactly like a machine gun.", voice: 'bm_george', pauseAfter: 0.5 },
            transition: 'zoom-cut',
            captions: true,
            layers: [
                { type: 'stock-image', query: '1930s congress capitol building historic', source: 'serpapi', orientation: 'portrait', kenBurns: 'pan-left', kenBurnsAmount: 0.5, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
            ],
        },
        {
            // the "image roll" beat — now genuinely using the rotate Ken Burns, not just the transition name
            tts: { text: "Newspapers and pulp novels had spent a decade turning the silencer into the assassin's favorite tool — even though real criminals almost never actually used one.", voice: 'bm_george', pauseAfter: 0.5 },
            transition: 'rotate',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'vintage pulp crime novel gangster illustration', source: 'serpapi', orientation: 'portrait', kenBurns: 'rotate-cw', kenBurnsAmount: 0.55, rotateDeg: 9, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
            ],
        },
        {
            tts: { text: "A device built purely to protect hearing now required a two hundred dollar federal tax stamp — the exact same tax charged for owning a fully automatic machine gun.", voice: 'bm_george', pauseAfter: 0.6 },
            transition: 'split-h',
            captions: true,
            layers: [
                { type: 'gradient', gradientType: 'linear', colors: ['#12060a', '#050505'], angle: 150 },
                { type: 'stat-counter', value: 200, suffix: ' TAX', label: 'FEDERAL TAX ON A HEARING-SAFETY DEVICE',
                  x: 540, y: 900, fontSize: 130, labelFontSize: 30, color: '#ff3b5c', gradient: ['#ff3b5c', '#ffb703'],
                  glow: true, glowColor: '#ff3b5c', glowBlur: 28, animDur: 1.2 },
            ],
        },

        // ══ CLOSE — the emotional turn ════════════════════════════════════
        {
            tts: { text: "He spent his life trying to make a gunshot safer to hear. The law ended up treating his invention like the deadliest weapon in the room.", voice: 'bm_george', pauseAfter: 0.7 },
            transition: 'zoom-in',
            captions: true,
            layers: [
                { type: 'gradient', gradientType: 'radial', colors: ['#1a0000', '#000000'], vignette: true, vignetteStrength: 0.5 },
                { type: 'quote-card', text: 'He tried to invent a quieter gunshot. He invented one of the most heavily regulated objects in America instead.', x: 540, y: 860, width: 920, fontSize: 42, accentColor: '#ff3b5c', showCard: true, showLines: true, animDur: 0.6 },
            ],
        },

        // ══ SUBSCRIBE — big, centered Giphy sticker ══════════════════════
        {
            tts: { text: "Subscribe now — the next one might be even harder to believe.", voice: 'bm_george', pauseAfter: 0.4 },
            transition: 'zoom-cut',
            captions: true,
            layers: [
                { type: 'gradient', gradientType: 'radial', colors: ['#1a0000', '#0a0000', '#000000'], vignette: true, vignetteStrength: 0.5 },
                { type: 'giphy', query: 'subscribe button animated', sticker: true, x: 260, y: 680, width: 560, height: 560 },
            ],
        },
    ],
};