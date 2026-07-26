// drop-XX-x37b-spaceplane.js  — rename XX to your next sequential drop number
// "The X-37B" — REVISED FORMAT (3 scenes, not 4):
//   Hook → Design Philosophy (large) → CTA
// The "Creator" scene is gone. Its screen time was folded into Design
// Philosophy instead of being cut outright — that scene now carries the
// launch vehicle, the autonomous landing, the solar panels, the aerobraking
// maneuver, and the mission history, back to back, rather than being a
// single quick beat.
//
// Subject choice is deliberate: the NB-36H drop used SerpAPI stills of a
// 1950s aircraft and the images came back soft/low-res — old machines don't
// have modern press photography behind them. The X-37B is the opposite
// case on purpose: Boeing/SpaceX/Space Force actively publish sharp,
// recent, high-res photos and footage of it (it launched its current,
// eighth mission in August 2025 and — per Boeing's own April 2026 feature,
// the most recent public status I could find — was still on orbit months
// later), so SerpAPI has current, well-lit source material to pull from.
// Going forward: pick subjects that are still flying/active/documented
// now, not historical ones, for exactly this reason.
//
// Facts checked against multiple independent, recent sources before
// writing (Wikipedia's OTV-6/7/8 mission pages, Boeing's own April 2026
// feature, Spaceflight Now, Air & Space Forces Magazine) rather than
// assumed:
//   - 908/909-day OTV-6 mission (closed, landed Nov 2022) — the record,
//     safe to state as a fixed historical fact.
//   - 29 ft length / ~15 ft wingspan, solar-powered, fully autonomous
//     landing, Falcon 9 / Atlas V / Falcon Heavy launch vehicles used
//     across its 8 missions — confirmed across sources.
//   - Aerobraking maneuver — confirmed as a genuine first, demonstrated
//     on OTV-7 (2024/2025).
//   - Eight missions since 2010, 4,200+ combined days in orbit before
//     OTV-8 even launched — confirmed.
//   - Current (8th) mission launched Aug 21, 2025, partially classified —
//     confirmed. I deliberately did NOT give a specific "currently X days
//     in orbit" figure, since that number ages the moment this script is
//     written — "it's still up there" is true without a number attached
//     to it going stale.
//
// Same subscribe-sticker pattern as the last CTA fix: `query` (not a
// guessed `id`), sticker:true, corner-badge position clear of both the
// headline text and the default caption band.
//
// Run with:  VIDEO_CONFIG=drop-XX-x37b-spaceplane.js node engine-ci.js

module.exports = {
    output: {
        title: 'x37b-spaceplane',
        format: 'portrait',
        fps: 30,
        crf: 23,
        preset: 'medium',
    },

    defaults: {
        voice: 'bm_george',
        transition: 'fade',
        transitionDuration: 0.3,
    },

    scenes: [
        // ── Scene 1 — Hook ──────────────────────────────────────
        {
            tts: {
                text: "Right now, there's a spacecraft in orbit that the U.S. government won't explain. It's called the X-37B, and one of its missions lasted over nine hundred days, longer than two years, and nobody outside a small circle knows exactly what it was doing up there.",
                voice: 'bm_george',
                pauseAfter: 0.4,
            },
            captions: {
                style: 'highlight', fontSize: 60, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'stock-image', query: 'X-37B space plane Space Force runway',
                    source: 'serpapi', fit: 'cover',
                    kenBurns: 'zoom-in', kenBurnsAmount: 0.34,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                {
                    type: 'text', text: 'THE SPACECRAFT\nNOBODY WILL\nEXPLAIN', x: 540, y: 260,
                    fontSize: 62, fontFamily: 'Arial Black, sans-serif',
                    color: '#f5c518', align: 'center', hookLayer: true,
                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                },
            ],
        },

        // ── Scene 2 — Design Philosophy (large — absorbs the old
        // Creator scene's runtime; launch, landing, power, and the
        // aerobraking maneuver, back to back) ────────────────────
        {
            tts: {
                text: "It looks like a shrunken space shuttle: just twenty nine feet long, with a wingspan under fifteen feet, small enough to launch inside a rocket. It goes up strapped to a Falcon nine or an Atlas five, but it comes home like an airplane, gliding down and landing on a runway completely on its own, with no pilot and no crew ever onboard. Solar panels unfold once it's in orbit, so it can keep running for months, or years, without ever refueling. On recent flights, it's been testing something called aerobraking: dipping into the edge of the atmosphere on purpose, to shift its orbit while burning almost no fuel at all, the kind of trick you'd only need if you were planning to stay up there a very long time. Across eight missions since twenty ten, it's logged more than four thousand days in orbit combined. The current one launched back in August twenty twenty five, and as of right now, it's still up there.",
                voice: 'bm_george',
                pauseAfter: 0.4,
            },
            captions: {
                style: 'highlight', fontSize: 60, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: [
                        'X-37B space plane full view',
                        'X-37B on runway Vandenberg',
                        'X-37B payload bay doors open',
                        'X-37B solar panel array deployed',
                        'Falcon 9 rocket launch Kennedy Space Center',
                        'X-37B heat shield tiles closeup',
                        'Boeing Space Force engineers X-37B',
                        'X-37B wing landing gear',
                        'Atlas V rocket launch X-37B',
                        'X-37B nose cone closeup',
                        'Space Force spaceplane hangar',
                        'X-37B landing sonic boom',
                        'X-37B orbital test vehicle illustration',
                        'Falcon Heavy rocket launch pad',
                        'X-37B spaceplane technicians inspection',
                    ],
                    source: 'serpapi',
                    fit: 'cover',
                    // cutEvery deliberately omitted — image-sequence defaults
                    // it to (real scene duration) / (slide count), so this
                    // divides evenly across however long the scene actually
                    // ends up being once TTS is generated, same as every
                    // other duration fix earlier in this build.
                    //
                    // Ken Burns alternates through every type on purpose —
                    // 'rotate-cw'/'rotate-ccw' are the two NEW ones (added
                    // for this request; images had never supported rotation
                    // before, only pan/zoom/drift), mixed in on roughly 1 in
                    // 3 slides rather than every slide, so the spin reads as
                    // a deliberate accent instead of the whole sequence
                    // spinning uniformly.
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',       kenBurnsAmount: 0.32 },
                        { kenBurns: 'rotate-cw',     kenBurnsAmount: 0.3, rotateDeg: 10 },
                        { kenBurns: 'pan-left',      kenBurnsAmount: 0.3 },
                        { kenBurns: 'rotate-ccw',    kenBurnsAmount: 0.3, rotateDeg: 10 },
                        { kenBurns: 'zoom-out',      kenBurnsAmount: 0.32 },
                        { kenBurns: 'pan-right',     kenBurnsAmount: 0.3 },
                        { kenBurns: 'rotate-cw',     kenBurnsAmount: 0.34, rotateDeg: 12 },
                        { kenBurns: 'zoom-in',       kenBurnsAmount: 0.3 },
                        { kenBurns: 'pan-up',        kenBurnsAmount: 0.3 },
                        { kenBurns: 'rotate-ccw',    kenBurnsAmount: 0.34, rotateDeg: 12 },
                        { kenBurns: 'drift',         kenBurnsAmount: 0.3 },
                        { kenBurns: 'zoom-out',      kenBurnsAmount: 0.3 },
                        { kenBurns: 'rotate-cw',     kenBurnsAmount: 0.3, rotateDeg: 10 },
                        { kenBurns: 'pan-down',      kenBurnsAmount: 0.3 },
                        { kenBurns: 'drift-reverse', kenBurnsAmount: 0.3 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.3)' },
                {
                    type: 'text', text: 'REUSABLE. AUTONOMOUS.\nNO PILOT, EVER.', x: 540, y: 1560,
                    fontSize: 52, fontFamily: 'Arial Black, sans-serif',
                    color: '#f5c518', align: 'center',
                    stroke: true, strokeColor: '#000', strokeWidth: 4,
                },
            ],
        },

        // ── Scene 3 — CTA (comment-bait framing + subscribe sticker) ──
        {
            tts: {
                text: "So here's the question. What do you think a robotic spaceplane needs over a year in orbit to actually do? Comment your theory below, and like and subscribe for more stories like this one.",
                voice: 'bm_george',
                pauseAfter: 0.3,
            },
            captions: {
                style: 'highlight', fontSize: 60, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'stock-image', query: 'X-37B space plane orbit illustration',
                    source: 'serpapi', fit: 'cover',
                    kenBurns: 'zoom-out', kenBurnsAmount: 0.3,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                {
                    type: 'text', text: 'WHAT IS IT\nREALLY DOING\nUP THERE?', x: 540, y: 900,
                    fontSize: 58, fontFamily: 'Arial Black, sans-serif',
                    color: '#ffffff', align: 'center',
                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                },
                // Same fix as the NB-36H CTA: `query`, not a guessed `id` —
                // I have no way to verify a specific Giphy asset ID from
                // here, so asserting one would be a fabricated lookup.
                // Corner badge, clear of the headline (y:900) and the
                // default caption band (baseY = H*0.83 ≈ y:1594).
                {
                    type: 'giphy',
                    query: 'like and subscribe',
                    sticker: true,
                    resultIndex: 0,
                    x: 740, y: 90, width: 300, height: 300,
                    fit: 'contain',
                },
            ],
        },
    ],
};