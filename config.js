// config.asmr-test.js
// Minimal end-to-end test of the ASMR pipeline:
//   1. src/asmr-gen.js generates a 'combo' texture (rain bed + tapping),
//      8D-spatialized, and its wavPath becomes output.bgMusic automatically.
//   2. ApexCasing/asmr-visualizer.html listens for the same events via
//      window.__APEX_AUDIO__.asmrEvents / apexframe's e.detail.asmr and
//      draws a ripple for every tap, plus a continuous amplitude-reactive
//      glow for the rain bed.
//   3. A second scene shows keepAudio + audioVolume on a real Pexels clip,
//      for testing that path independently of the synthesized generator.
//
// Run with:  VIDEO_CONFIG=config.asmr-test.js node engine-ci.js

module.exports = {
    output: {
        title:  'asmr-test',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',

        // No TTS narration in this test — the ASMR audio IS the content,
        // so it becomes bgMusic automatically (see engine-ci.js Phase 0.45).
        asmr: {
            type: 'combo',
            duration: 20,
            seed: 7,
            layers: [
                { type: 'rain',    vol: 0.45 },
                { type: 'tapping', vol: 0.5, density: 0.6 },
            ],
            spatial8D: { rate: 0.12 }, // slow orbiting pan — wear headphones
        },
    },

    scenes: [
        // ── Scene 1 — synthesized ASMR audio driving the reference casing ──
        {
            duration: 20,
            layers: [
                {
                    type: 'html-record',
                    src: 'ApexCasing/asmr-visualizer.html',
                    audioSync: true,
                    width: 1080, height: 1920,
                    data: { theme: 'tap', label: 'ASMR TEST' },
                },
            ],
        },

        // ── Scene 2 — keepAudio test: a real stock clip's own sound, ──────
        // ── turned down with audioVolume so it doesn't overpower anything ──
        {
            duration: 8,
            layers: [
                {
                    type: 'pexels-video',
                    query: 'rain window close up',
                    orientation: 'portrait',
                    maxDuration: 8,
                    keepAudio: true,
                    audioVolume: 0.6,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },
    ],
};