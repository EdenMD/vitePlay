// config.agent-orange-irony.js
// Same exact blueprint/story-intent as the other cuts, different subject:
// Agent Orange. Real, documented: the herbicide mixture (2,4-D + 2,4,5-T)
// was adapted from ordinary agricultural weed-killer chemistry already in
// civilian farm use. The US military sprayed roughly 20 million gallons of
// it across Vietnam under Operation Ranch Hand (1961-1971) purely to strip
// jungle cover and destroy crops used to feed and hide enemy forces — not
// designed as a weapon against people directly. A dioxin contaminant from
// the manufacturing process turned out to be one of the most toxic
// compounds ever studied, and its health effects on veterans, Vietnamese
// civilians, and children born years later are still documented today.
// Same irony arc as the others, heavier subject: something built to strip
// leaves off trees became one of the most consequential legacies of the
// entire war. Kept the framing historical/factual — no graphic imagery,
// no detail beyond what's publicly documented — same tone as any
// mainstream Vietnam War documentary would use.
//
// Run with:  VIDEO_CONFIG=config.agent-orange-irony.js node engine-ci.js

module.exports = {
    output: {
        title:  'the-weapon-that-was-never-built-to-kill-anyone',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',
        postProcess: { grain: true, grainStrength: 0.02, vignette: true, vignetteStrength: 0.35 },
    },

    defaults: { voice: 'bm_george', transitionDuration: 0.35 },

    scenes: [
        // ══ OPEN — hook lands the contradiction immediately ═══════════════
        {
            tts: { text: "There's a chemical that was never designed to kill a single person. It was built to kill plants. It became one of the most devastating legacies of the entire Vietnam War.", voice: 'bm_george', pauseAfter: 0.5 },
            transition: 'zoom-out',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'vietnam war helicopter spraying jungle defoliant', source: 'serpapi', orientation: 'portrait', kenBurns: 'zoom-out', kenBurnsAmount: 0.52, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
            ],
        },
        {
            tts: { text: "The chemistry behind it had already been in use for years — on ordinary American farms, clearing weeds from fields.", voice: 'bm_george', pauseAfter: 0.6 },
            transition: 'fade',
            captions: true,
            layers: [
                { type: 'gradient', gradientType: 'radial', colors: ['#1a1400', '#000000'], vignette: true, vignetteStrength: 0.45 },
                { type: 'quote-card', text: 'It started as an agricultural tool. It ended up defining a war.', x: 540, y: 860, width: 900, fontSize: 40, accentColor: '#ff9f1c', showCard: true, showLines: true, animDur: 0.6 },
            ],
        },
        {
            tts: { text: "In 1961, the US military began spraying it across the jungles of Vietnam under a program called Operation Ranch Hand — meant to strip away the jungle cover the enemy used to hide.", voice: 'bm_george', pauseAfter: 0.4 },
            transition: 'iris',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'vietnam war aircraft spraying defoliant jungle', source: 'serpapi', orientation: 'portrait', kenBurns: 'zoom-in', kenBurnsAmount: 0.56, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
            ],
        },

        // ══ NEW — added emotional beat ════════════════════════════════════
        {
            tts: { text: "Soldiers on the ground were told it was simply an herbicide — nothing more dangerous, they were assured, than what a farmer might spray on a cornfield back home.", voice: 'bm_george', pauseAfter: 0.6 },
            transition: 'split-v',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'vietnam war soldiers jungle patrol', source: 'serpapi', orientation: 'portrait', kenBurns: 'rotate-ccw', kenBurnsAmount: 0.5, rotateDeg: 9, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
            ],
        },

        // ══ THE IRONY / TURN ══════════════════════════════════════════════
        {
            tts: { text: "But buried inside the mixture was a contaminant nobody had fully accounted for — dioxin, a byproduct of the manufacturing process, and one of the most toxic compounds ever studied.", voice: 'bm_george', pauseAfter: 0.5 },
            transition: 'zoom-cut',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'chemical factory drums industrial barrels', source: 'serpapi', orientation: 'portrait', kenBurns: 'pan-left', kenBurnsAmount: 0.5, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
            ],
        },
        {
            // the "image roll" beat — rotate Ken Burns kept consistent with the last two
            tts: { text: "Decades later, the health effects were still surfacing — among the soldiers who sprayed it, the villages beneath it, and children born years after the war had already ended.", voice: 'bm_george', pauseAfter: 0.5 },
            transition: 'rotate',
            captions: true,
            layers: [
                { type: 'stock-image', query: 'vietnam veteran memorial wall reflection', source: 'serpapi', orientation: 'portrait', kenBurns: 'rotate-cw', kenBurnsAmount: 0.55, rotateDeg: 9, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
            ],
        },
        {
            tts: { text: "Across less than a decade, roughly twenty million gallons of it were sprayed across Vietnam — enough to reach millions of acres of jungle and farmland.", voice: 'bm_george', pauseAfter: 0.6 },
            transition: 'split-h',
            captions: true,
            layers: [
                { type: 'gradient', gradientType: 'linear', colors: ['#141006', '#050505'], angle: 150 },
                { type: 'stat-counter', value: 20, suffix: 'M GAL', label: 'SPRAYED ACROSS VIETNAM IN UNDER A DECADE',
                  x: 540, y: 900, fontSize: 130, labelFontSize: 28, color: '#ff9f1c', gradient: ['#ff9f1c', '#ff3b5c'],
                  glow: true, glowColor: '#ff9f1c', glowBlur: 28, animDur: 1.2 },
            ],
        },

        // ══ CLOSE — the emotional turn ════════════════════════════════════
        {
            tts: { text: "It was built to strip the leaves off a jungle canopy. It ended up leaving a mark on generations who were never anywhere near the war.", voice: 'bm_george', pauseAfter: 0.7 },
            transition: 'zoom-in',
            captions: true,
            layers: [
                { type: 'gradient', gradientType: 'radial', colors: ['#1a1400', '#000000'], vignette: true, vignetteStrength: 0.5 },
                { type: 'quote-card', text: 'It was never designed to hurt a person. It just never stopped.', x: 540, y: 860, width: 920, fontSize: 42, accentColor: '#ff9f1c', showCard: true, showLines: true, animDur: 0.6 },
            ],
        },

        // ══ SUBSCRIBE — big, centered Giphy sticker ══════════════════════
        {
            tts: { text: "Subscribe now — the next one might be even harder to believe.", voice: 'bm_george', pauseAfter: 0.4 },
            transition: 'zoom-cut',
            captions: true,
            layers: [
                { type: 'gradient', gradientType: 'radial', colors: ['#1a1400', '#0a0a00', '#000000'], vignette: true, vignetteStrength: 0.5 },
                { type: 'giphy', query: 'subscribe button animated', sticker: true, x: 260, y: 680, width: 560, height: 560 },
            ],
        },
    ],
};