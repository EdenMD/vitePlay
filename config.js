// config.asmr-sleep-1min.js
// 1-minute "fall asleep" ASMR short: whispered TTS narration over a
// synthesized rain+brushing ASMR bed (gently 8D-spatialized), with five
// Pexels stock clips cycling underneath as calming visuals.
//
// Demonstrates, together: whisper voiceFX, TTS volume + 8D voiceFX,
// output.asmr (rain/brushing combo bed), and multiple pexels-video scenes.
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
        // slow "brushing" texture underneath for a blanket-like warmth.
        // Gentle 8D orbit (slow — 0.05Hz ≈ 20s per pass) so it's immersive
        // on headphones without being disorienting for sleep content.
        asmr: {
            type: 'combo',
            duration: 60,          // matches total video length exactly
            seed: 11,
            layers: [
                { type: 'rain',     vol: 0.4  },
                { type: 'brushing', vol: 0.18 },
            ],
            spatial8D: { rate: 0.05, depth: 0.6 },
        },
    },

    // Shared TTS voice styling for every scene below — whispered, slowed
    // down, and turned down so it sits under the ambient bed instead of
    // fighting it. `whisper` preset already includes volume: 0.6; nudging
    // it a little further down here since the asmr bed is also present
    // (the preset's default assumes no separate bed under it).
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
    ],
};
