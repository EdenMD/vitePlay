// config.tear-gas-irony.js
// Same exact blueprint/story-intent as the Tommy Gun / gun suppressor
// cuts, different weapon: tear gas. Real, documented: first used at scale
// as a chemical weapon in World War One (both sides fired
// tear-inducing gas shells to force soldiers out of cover). By 1925 the
// Geneva Protocol banned chemical weapons — including tear gas — as a
// method of warfare between nations. That treaty (and later the 1993
// Chemical Weapons Convention) never banned domestic use: governments
// remain free to use the exact same "too cruel for the battlefield"
// chemical on their own civilians in riot/crowd-control situations. Same
// irony arc as the others — a weapon judged too inhumane for soldiers,
// left completely legal for use on citizens.
//
// Hook made stronger per your note: opens directly on the contradiction
// itself in line one, instead of building up to it — no wind-up on the
// wind-up. Rotate Ken Burns kept in (2 spots), same as the suppressor cut.
//
// Run with:  VIDEO_CONFIG=config.tear-gas-irony.js node engine-ci.js

module.exports = {
    output: {
        title:  'the-weapon-too-cruel-for-war-legal-on-you',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',
        postProcess: { grain: true, grainStrength: 0.02, vignette: true, vignetteStrength: 0.35 },
    },

    defaults: { voice: 'bm_george', transitionDuration: 0.35 },

    scenes: [
        // ══ OPEN — stronger hook: the contradiction lands in line one ═════
        {
            tts: { text: "There's a chemical weapon so cruel that nearly every country on Earth agreed to ban it from war. Using it on enemy soldiers is illegal. Using it on you is not.", voice: 'bm_george', pauseAfter: 0.5 },
            transition: 'zoom-out',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'riot police tear gas smoke protest', source: 'serpapi', orientation: 'portrait', kenBurns: 'zoom-out', kenBurnsAmount: 0.52, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
            ],
        },
        {
            tts: { text: "Governments call it non-lethal. They just never agreed on who it was supposed to be used against.", voice: 'bm_george', pauseAfter: 0.6 },
            transition: 'fade',
            captions: true,
            layers: [
                { type: 'gradient', gradientType: 'radial', colors: ['#1a0000', '#000000'], vignette: true, vignetteStrength: 0.45 },
                { type: 'quote-card', text: 'The world banned it from battlefields. Then wrote an exception for its own streets.', x: 540, y: 860, width: 900, fontSize: 40, accentColor: '#ff3b5c', showCard: true, showLines: true, animDur: 0.6 },
            ],
        },
        {
            tts: { text: "In the trenches of World War One, both sides fired tear-inducing gas shells to force enemy soldiers out of cover — one of the first chemical weapons ever used at scale.", voice: 'bm_george', pauseAfter: 0.4 },
            transition: 'iris',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'WWI soldiers gas mask trench', source: 'serpapi', orientation: 'portrait', kenBurns: 'zoom-in', kenBurnsAmount: 0.56, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
            ],
        },

        // ══ NEW — added emotional beat ════════════════════════════════════
        {
            tts: { text: "Soldiers who survived those gas attacks came home describing something the public had never truly experienced — the panic of not being able to breathe on command.", voice: 'bm_george', pauseAfter: 0.6 },
            transition: 'split-v',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'WWI soldier gas mask closeup', source: 'serpapi', orientation: 'portrait', kenBurns: 'rotate-ccw', kenBurnsAmount: 0.5, rotateDeg: 9, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
            ],
        },

        // ══ THE IRONY / TURN ══════════════════════════════════════════════
        {
            tts: { text: "By 1925, the world agreed: chemical weapons like this were too cruel for war. The Geneva Protocol banned countries from using tear gas on each other's soldiers, permanently.", voice: 'bm_george', pauseAfter: 0.5 },
            transition: 'zoom-cut',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'geneva protocol 1925 diplomats signing treaty', source: 'serpapi', orientation: 'portrait', kenBurns: 'pan-left', kenBurnsAmount: 0.5, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
            ],
        },
        {
            // the "image roll" beat — rotate Ken Burns kept in from the last cut
            tts: { text: "But that same agreement left one door wide open. Nothing stopped a government from using it on its own people, in its own streets, whenever it wanted.", voice: 'bm_george', pauseAfter: 0.5 },
            transition: 'rotate',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'riot police tear gas crowd control street', source: 'serpapi', orientation: 'portrait', kenBurns: 'rotate-cw', kenBurnsAmount: 0.55, rotateDeg: 9, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
            ],
        },
        {
            tts: { text: "Nearly two hundred nations signed a treaty agreeing this chemical was too cruel to use on enemy soldiers — and every one of them kept the right to use it on their own citizens.", voice: 'bm_george', pauseAfter: 0.6 },
            transition: 'split-h',
            captions: true,
            layers: [
                { type: 'gradient', gradientType: 'linear', colors: ['#12060a', '#050505'], angle: 150 },
                { type: 'stat-counter', value: 193, suffix: ' NATIONS', label: 'BANNED IT FROM WAR \u2014 NOT FROM THEIR OWN STREETS',
                  x: 540, y: 900, fontSize: 120, labelFontSize: 28, color: '#ff3b5c', gradient: ['#ff3b5c', '#ffb703'],
                  glow: true, glowColor: '#ff3b5c', glowBlur: 28, animDur: 1.2 },
            ],
        },

        // ══ CLOSE — the emotional turn ════════════════════════════════════
        {
            tts: { text: "The world agreed it was too cruel for a soldier to face on the battlefield. Nobody ever extended that same mercy to a civilian in their own city.", voice: 'bm_george', pauseAfter: 0.7 },
            transition: 'zoom-in',
            captions: true,
            layers: [
                { type: 'gradient', gradientType: 'radial', colors: ['#1a0000', '#000000'], vignette: true, vignetteStrength: 0.5 },
                { type: 'quote-card', text: 'They banned it from the battlefield. They just never banned it from you.', x: 540, y: 860, width: 920, fontSize: 42, accentColor: '#ff3b5c', showCard: true, showLines: true, animDur: 0.6 },
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