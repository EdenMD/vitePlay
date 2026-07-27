// drop-XX-su57-felon.js  — rename XX to your next sequential drop number
// "The Su-57 Felon" — same 3-scene weighting as the X-37B drop: Hook →
// Design Philosophy (large) → CTA. Manufacturer isn't cut entirely (Sukhoi
// gets one clause inside Design Philosophy) but it never gets its own
// scene — design philosophy is the whole point of this one, per this
// request.
//
// v2: trimmed to hit a ~45s TOTAL runtime (all 3 scenes combined), not
// just Design Philosophy — the first cut only shortened that one scene
// and still left the whole video at ~67s. Cut order: Design Philosophy
// dropped its stealth-shaping caveat, the Su-27/MiG-29 replacement line,
// and the fleet-size comparison to get from 108 words to 61; Hook and CTA
// were trimmed too, since a short video needs every scene short, not just
// the long one. CTA also picked up "like and subscribe" in the narration
// plus a subscribe sticker (query-based, not a guessed id — same fix as
// the NB-36H/X-37B CTAs). Current total: ~114 words, ~42s estimated.
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
// writing, not assumed. Facts actually still IN the v2 script:
//   - "Stealth-plus-agility" is Sukhoi's own stated design approach, not
//     my characterization of it — confirmed directly.
//   - Thrust-vectoring engines, internal weapons bays — confirmed.
//   - First Russian fighter built around full sensor fusion (radar +
//     IRST + EW) — confirmed.
// Cut from the script for length but were checked at the time: the
// stealth-shaping-trails-Western-jets caveat (an outside analyst
// assessment, not Russia's stated position), the Su-27/MiG-29
// replacement claim, and the fleet-size-vs-F-35s comparison — all
// confirmed accurate, just no longer in the narration.
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
                text: "This is the Su-57 Felon, Russia's first stealth fighter, and it was built on a completely different bet than the American jets it's meant to counter.",
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
                    type: 'stock-image', query: 'Su-57 Felon fighter jet nose closeup',
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

        // ── Scene 2 — Design Philosophy (large — this IS the video —
        // but capped near 45s and split across 4 close-up images instead
        // of holding one shot the whole time) ──────────────────────
        {
            tts: {
                text: "Where American jets try to avoid a fight, the Su-57 is built to win one. Sukhoi calls it stealth plus agility: weapons bays keep missiles hidden, while thrust vectoring lets it out-turn jets that shouldn't be able to out-turn it. It's also Russia's first fighter with full sensor fusion, blending radar, infrared, and electronic warfare into one picture for the pilot.",
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
                    // 4 close-up/detail shots, not repeats of the same wide
                    // "in flight" angle — this is the fix for a long scene
                    // holding one static image.
                    queries: [
                        'Su-57 Felon internal weapons bay open',
                        'Su-57 Felon engine nozzle thrust vectoring closeup',
                        'Su-57 Felon cockpit avionics panel',
                        'Su-57 Felon radar nose cone closeup',
                    ],
                    source: 'serpapi',
                    fit: 'cover',
                    // cutEvery omitted on purpose — auto-divides across
                    // however long this scene's real TTS audio turns out to
                    // be (≈4 slides × ~10s each at the ~40s this narration
                    // targets), same fix as everywhere else this session.
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',    kenBurnsAmount: 0.32 },
                        { kenBurns: 'rotate-cw',  kenBurnsAmount: 0.3, rotateDeg: 10 },
                        { kenBurns: 'pan-left',   kenBurnsAmount: 0.3 },
                        { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920,
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
                text: "So, would you rather have a jet that disappears completely, or one that can out-turn whatever finds it? Comment your pick, and like and subscribe for more.",
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
                    type: 'stock-image', query: 'Su-57 Felon cockpit canopy closeup',
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
                // query-based, not a guessed id — same reasoning as the
                // NB-36H/X-37B CTA fix earlier.
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