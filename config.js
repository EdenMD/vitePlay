// drop-XX-su57-felon.js  — rename XX to your next sequential drop number
// "The Su-57 Felon" — same 3-scene weighting as the X-37B drop: Hook →
// Design Philosophy (large) → CTA. Manufacturer isn't cut entirely (Sukhoi
// gets one clause inside Design Philosophy) but it never gets its own
// scene — design philosophy is the whole point of this one, per this
// request.
//
// One deliberate change from the last two drops: NO NARA-footage attempt
// this time. That pattern (async fetch from catalog.archives.gov, fall
// back to a still) only makes sense for US aircraft — NARA is the US
// National Archives, it was never going to have Sukhoi footage, and
// keeping that call in would just be a wasted, guaranteed-to-fail API hit
// copied over out of habit rather than because it does anything here.
// Plain stock-image instead, same as everything that isn't Scene 3 in the
// last two drops.
//
// Facts checked against multiple recent, dated sources (19FortyFive x3,
// MiGFlug, Army Recognition, Defence Security Asia, Wikipedia) before
// writing, not assumed — and where sources gave conflicting specific
// numbers, I used the safely-overlapping description instead of picking
// one:
//   - "Stealth-plus-agility" is Sukhoi's own stated design approach, not
//     my characterization of it — confirmed directly.
//   - Thrust-vectoring engines, supermaneuverability, internal weapons
//     bays — confirmed.
//   - First Russian fighter built around full sensor fusion (radar +
//     IRST + EW) — confirmed.
//   - Intended to replace both the Su-27 and MiG-29 — confirmed.
//   - Independent analysts describe its stealth shaping as less refined
//     than Western fifth-gen jets — confirmed, stated as an outside
//     assessment, not as Russia's own position (sources don't establish
//     that Russia concedes this, so the script doesn't claim it does).
//   - Fleet size: sources gave different specific counts (~30 vs 42+
//     including prototypes) — used "low dozens," the framing that's
//     consistent across all of them, against "well over a thousand
//     F-35s" (1,000+ is well-established globally) rather than asserting
//     one disputed exact number.
//
// Run with:  VIDEO_CONFIG=drop-XX-su57-felon.js node engine-ci.js

module.exports = {
    output: {
        title: 'su57-felon',
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
                text: "This is the Su-57 Felon, Russia's first stealth fighter, and it was built on a completely different bet than the American jets it's meant to counter. Instead of chasing pure stealth, it was designed to out-turn and out-fight anything that gets close. Here's the philosophy behind it.",
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
                    type: 'stock-image', query: 'Su-57 Felon stealth fighter in flight',
                    source: 'serpapi', fit: 'cover',
                    kenBurns: 'zoom-in', kenBurnsAmount: 0.34,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                {
                    type: 'text', text: 'BUILT TO FIGHT,\nNOT JUST TO HIDE', x: 540, y: 260,
                    fontSize: 62, fontFamily: 'Arial Black, sans-serif',
                    color: '#f5c518', align: 'center', hookLayer: true,
                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                },
            ],
        },

        // ── Scene 2 — Design Philosophy (large — this IS the video) ──
        {
            tts: {
                text: "Where American stealth fighters are built to avoid a dogfight entirely, the Su-57 is built to win one if it happens anyway. Sukhoi calls it stealth-plus-agility: reduced radar visibility and internal weapons bays to keep missiles hidden, combined with thrust-vectoring engines that let it out-turn jets that shouldn't be able to out-turn it. Independent analysts widely say its stealth shaping is less refined than its American rivals. The tradeoff looks deliberate: it's not trying to disappear completely, it's built to survive being seen. It's also Russia's first fighter built around full sensor fusion, blending radar, infrared tracking, and electronic warfare into one picture for the pilot. And it's meant to eventually replace two aging designs at once, the Su-27 and the MiG-29, in a single airframe. The catch is production. Independent counts put the entire operational fleet somewhere in the low dozens, against well over a thousand F-35s worldwide.",
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
                    type: 'stock-image', query: 'Sukhoi Su-57 fighter jet weapons bay design',
                    source: 'serpapi', fit: 'cover',
                    // rotate-ccw — the new Ken Burns type, used here (not on
                    // Hook or CTA) because this is the scene that's actually
                    // carrying the video.
                    kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.3)' },
                {
                    type: 'text', text: 'STEALTH + AGILITY,\nNOT STEALTH ALONE', x: 540, y: 1560,
                    fontSize: 50, fontFamily: 'Arial Black, sans-serif',
                    color: '#f5c518', align: 'center',
                    stroke: true, strokeColor: '#000', strokeWidth: 4,
                },
            ],
        },

        // ── Scene 3 — CTA ────────────────────────────────────────
        {
            tts: {
                text: "So here's the question. Would you rather have a fighter that disappears completely, or one that can out-turn whatever finds it? Comment your pick below.",
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
                    type: 'stock-image', query: 'Su-57 vs F-35 stealth fighter comparison',
                    source: 'serpapi', fit: 'cover',
                    kenBurns: 'zoom-out', kenBurnsAmount: 0.3,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                {
                    type: 'text', text: 'HIDE, OR OUT-TURN?\nCOMMENT YOUR PICK', x: 540, y: 900,
                    fontSize: 56, fontFamily: 'Arial Black, sans-serif',
                    color: '#ffffff', align: 'center',
                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                },
            ],
        },
    ],
};