// config.asmr-sleep-1min.js
// ~72s "fall asleep" ASMR short: whispered TTS narration over a synthesized
// rain+brushing ASMR bed (gently 8D-spatialized), just TWO Pexels stock
// clips (down from five — each clip's frames are extracted once, capped at
// maxDuration, then looped for the rest of its scene, instead of extracting
// a full-length clip per scene) for the narrated portion, then a closing
// scene that switches to the ApexCasing/asmr-visualizer.html reactive
// template — narration stops, only the breathing glow + soft ripples
// (still synced to the same asmr bed) carry the last few seconds.
//
// Demonstrates, together: whisper voiceFX, TTS volume + 8D voiceFX,
// output.asmr (rain/brushing combo bed) with a dedicated bgVolume, explicit
// `triggers` for a few deliberately-placed soft taps, TWO capped/looped
// pexels-video scenes, AND an ApexCasing scene.
//
// Run with:  VIDEO_CONFIG=config.asmr-sleep-1min.js node engine-ci.js
// (needs PEXELS_API_KEY set)

module.exports = {
    output: {
        title:  'asmr-fall-asleep',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',

        // Ambient bed for the whole video — soft rain + a very soft, slow
        // "brushing" texture, plus a handful of deliberately-placed, very
        // soft taps spread across the video (near each scene change, and
        // one more late in the closing casing scene). `duration` matches
        // the new total (72s) so the bed loops seamlessly across it.
        // `bgVolume` sets the final level once this bed becomes the
        // video's background audio — separate from vol above, which only
        // balances the layers against each other before that final mix.
        asmr: {
            type: 'combo',
            duration: 72,
            seed: 11,
            bgVolume: 0.32,
            layers: [
                { type: 'rain',     vol: 0.4  },
                { type: 'brushing', vol: 0.18 },
                { type: 'tapping',  vol: 0.12, triggers: [
                    { t: 14, intensity: 0.3  },
                    { t: 29, intensity: 0.25 },
                    { t: 44, intensity: 0.3  },
                    { t: 59, intensity: 0.25 },
                    { t: 68, intensity: 0.2  },
                ]},
            ],
            spatial8D: { rate: 0.05, depth: 0.6 },
        },
    },

    // Shared TTS voice styling for every narrated scene below — whispered,
    // slowed down, and turned down so it sits under the ambient bed
    // instead of fighting it. `whisper` preset already includes
    // volume: 0.6; nudging it a little further down here since the asmr
    // bed is also present (the preset's default assumes no separate bed
    // under it).
    defaults: {
        voice: 'af_heart',
        speed: 0.82,
        voiceFX: { whisper: true, volume: 0.45 },
        effectStrength: 1.1,
    },

    scenes: [
        // ── Scene 1 (0-30s) — ONE Pexels clip, capped + looped ──────────
        // maxDuration: 6 keeps frame extraction to ~6s worth of PNGs no
        // matter how long the scene runs; loop (default true) replays
        // that short window seamlessly for the full 30s.
        {
            duration: 30,
            tts: {
                text: "Let your eyes grow heavy... there's nowhere else you need to be. "
                    + "Every breath is slower than the last... soft, and warm, and safe.",
                pauseAfter: 1.4,
            },
            layers: [
                { type: 'pexels-video', query: 'rain on window night', orientation: 'portrait',
                  maxDuration: 6, loop: true,
                  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
            ],
        },

        // ── Scene 2 (30-60s) — the other Pexels clip ─────────────────────
        {
            duration: 30,
            tts: {
                text: "The world outside can wait until morning... just rest, right here. "
                    + "Above you, the stars are quiet too... watching, gentle, patient.",
                pauseAfter: 1.4,
            },
            layers: [
                { type: 'pexels-video', query: 'cozy blanket bed soft light', orientation: 'portrait',
                  maxDuration: 6, loop: true,
                  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
            ],
        },

        // ── Closing scene (60-72s) — ApexCasing, final line, then quiet ──
        // Narration finishes early in this scene; after that, only the
        // breathing amplitude-reactive glow and the soft ripple at t=68s
        // (from the asmr trigger above) carry the video to its end.
        {
            duration: 12,
            tts: { text: "Let go now... drift... you're already halfway to sleep.", pauseAfter: 0.6 },
            layers: [
                {
                    type: 'html-record',
                    src: 'ApexCasing/asmr-visualizer.html',
                    audioSync: true,
                    width: 1080, height: 1920,
                    data: { theme: 'water', label: '' },
                },
            ],
        },
    ],
};
