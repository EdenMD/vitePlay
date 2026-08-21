// config.asmr-sleep-1min.js
// ~72s "fall asleep" ASMR short: whispered TTS narration over a synthesized
// rain+brushing ASMR bed (gently 8D-spatialized), five Pexels stock clips
// for the narrated portion, then a closing scene that switches to the
// ApexCasing/asmr-visualizer.html reactive template — narration stops,
// and only the breathing glow + soft ripples (still synced to the same
// asmr bed) carry the last few seconds. Still comfortably "short" length.
//
// Demonstrates, together: whisper voiceFX, TTS volume + 8D voiceFX,
// output.asmr (rain/brushing combo bed) with a dedicated bgVolume so the
// bed's background level is set right in the asmr block (not the generic
// bgMusicVol default), explicit `triggers` for a few deliberately-placed
// soft taps timed to each scene change instead of continuous random
// tapping, multiple pexels-video scenes, AND an ApexCasing scene.
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

        // Ambient bed for the whole video — soft rain + a very soft,
        // slow "brushing" texture, plus a handful of deliberately-placed,
        // very soft taps: four at each Pexels scene change (11.5s, 23.5s,
        // 35.5s, 47.5s), and one more at 63s during the closing casing
        // scene, so the ApexCasing visualizer has something to react to
        // right before the video ends. `duration` matches the new total
        // (72s) so the bed loops seamlessly across the whole thing.
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
                    { t: 11.5, intensity: 0.3  },
                    { t: 23.5, intensity: 0.25 },
                    { t: 35.5, intensity: 0.3  },
                    { t: 47.5, intensity: 0.25 },
                    { t: 63,   intensity: 0.2  },
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
        {
            duration: 12,
            tts: { text: "Let your eyes grow heavy... there's nowhere else you need to be.", pauseAfter: 1.2 },
            layers: [
                { type: 'pexels-video', query: 'rain on window night', orientation: 'portrait',
                  maxDuration: 12, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
            ],
        },
        {
            duration: 12,
            tts: { text: "Every breath is slower than the last... soft, and warm, and safe.", pauseAfter: 1.2 },
            layers: [
                { type: 'pexels-video', query: 'candle flame close up slow motion', orientation: 'portrait',
                  maxDuration: 12, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
            ],
        },
        {
            duration: 12,
            tts: { text: "The world outside can wait until morning... just rest, right here.", pauseAfter: 1.2 },
            layers: [
                { type: 'pexels-video', query: 'cozy blanket bed soft light', orientation: 'portrait',
                  maxDuration: 12, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
            ],
        },
        {
            duration: 12,
            tts: { text: "Above you, the stars are quiet too... watching, gentle, patient.", pauseAfter: 1.2 },
            layers: [
                { type: 'pexels-video', query: 'night sky stars slow motion', orientation: 'portrait',
                  maxDuration: 12, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
            ],
        },
        {
            duration: 12,
            tts: { text: "Let go now... drift... you're already halfway to sleep.", pauseAfter: 0.8 },
            layers: [
                { type: 'pexels-video', query: 'soft clouds slow motion sky', orientation: 'portrait',
                  maxDuration: 12, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
            ],
        },

        // ── Closing scene — ApexCasing, no narration ────────────────────
        // Narration ends; only the breathing amplitude-reactive glow and
        // the soft ripple at t=63s (from the asmr trigger above) carry the
        // last 12 seconds, so the video itself goes quiet the way you'd
        // want the room to.
        {
            duration: 12,
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
