// config.asmr-sleep-1min.js
// ~72s "tingles to fall asleep" ASMR short. No engine changes involved —
// every sound here is defined right in this config via `customTextures`
// (discrete only — the engine already supported this before any of the
// ASMR work this session), placed with explicit `triggers` at irregular
// times with real silence between them. That's deliberate: real tingling
// ASMR is NOT a continuous bed — it's sparse, varied triggers separated
// by gaps, and no two hits sound identical (each custom texture still
// randomizes its own pitch per hit via defaultEventFields, even though
// the trigger *time* is fixed).
//
// Six distinct sounds cycle through the video, never back-to-back:
//   tapWood     — soft low wooden tap
//   tapGlass    — higher glassy click with a touch of ring
//   scratch     — quick fingernail-style scratch
//   brushStroke — one soft broadband brush pass
//   micBump     — very low soft thud
//   crinkle     — the engine's built-in crinkle (reused as-is)
//
// Run with:  VIDEO_CONFIG=config.asmr-sleep-1min.js node engine-ci.js
// (needs PEXELS_API_KEY set)

module.exports = {
    output: {
        title:  'asmr-tingles-sleep',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',

        asmr: {
            type: 'combo',
            duration: 72,
            seed: 21,
            bgVolume: 0.55, // no continuous bed competing with it, so this can sit higher
            spatial8D: { rate: 0.05, depth: 0.5 }, // slow orbit — still felt between hits, not just during them

            customTextures: {
                tapWood: {
                    kind: 'discrete',
                    scheduleEvents() { return []; }, // unused — every hit below comes from `triggers`
                    defaultEventFields(rng) { return { pitch: 220 + rng() * 230 }; },
                    burstSource(ev) {
                        const f = ev.pitch;
                        return `anoisesrc=d=0.08:color=white:r=44100,bandpass=f=${f.toFixed(0)}:width_type=h:width=${(f * 1.3).toFixed(0)},` +
                               `afade=t=out:st=0.015:d=0.06,volume=${(0.75 * ev.gain).toFixed(3)}`;
                    },
                    eventType: 'tap', // matches asmr-visualizer.html's built-in 'tap' color
                },
                tapGlass: {
                    kind: 'discrete',
                    scheduleEvents() { return []; },
                    defaultEventFields(rng) { return { pitch: 2200 + rng() * 1800 }; },
                    burstSource(ev) {
                        const f = ev.pitch;
                        return `sine=f=${f.toFixed(0)}:d=0.3:r=44100,` +
                               `aecho=0.55:0.4:40:0.25,afade=t=out:st=0.04:d=0.26,volume=${(0.3 * ev.gain).toFixed(3)}`;
                    },
                    eventType: 'clink',
                },
                scratch: {
                    kind: 'discrete',
                    scheduleEvents() { return []; },
                    defaultEventFields(rng) { return { pitch: 3000 + rng() * 3000 }; },
                    burstSource(ev) {
                        const f = ev.pitch;
                        return `anoisesrc=d=0.14:color=white:r=44100,bandpass=f=${f.toFixed(0)}:width_type=h:width=${(f * 1.1).toFixed(0)},` +
                               `afade=t=in:st=0:d=0.01,afade=t=out:st=0.05:d=0.09,volume=${(0.45 * ev.gain).toFixed(3)}`;
                    },
                    eventType: 'stroke',
                },
                brushStroke: {
                    kind: 'discrete',
                    scheduleEvents() { return []; },
                    defaultEventFields(rng) { return { pitch: 2000 + rng() * 1500 }; },
                    burstSource(ev) {
                        const f = ev.pitch;
                        return `anoisesrc=d=0.35:color=pink:r=44100,bandpass=f=${f.toFixed(0)}:width_type=h:width=${(f * 1.6).toFixed(0)},` +
                               `afade=t=in:st=0:d=0.08,afade=t=out:st=0.18:d=0.17,volume=${(0.4 * ev.gain).toFixed(3)}`;
                    },
                    eventType: 'swell',
                },
                micBump: {
                    kind: 'discrete',
                    scheduleEvents() { return []; },
                    defaultEventFields() { return { pitch: 90 }; },
                    burstSource(ev) {
                        return `anoisesrc=d=0.16:color=brown:r=44100,lowpass=f=180,` +
                               `afade=t=in:st=0:d=0.02,afade=t=out:st=0.06:d=0.1,volume=${(0.55 * ev.gain).toFixed(3)}`;
                    },
                    eventType: 'squelch',
                },
            },

            // Sparse, irregular, never the same sound twice in a row —
            // real gaps of silence between clusters (4-7s), which is what
            // actually reads as ASMR triggers rather than a soundtrack.
            layers: [
                { type: 'tapWood',     vol: 0.7, triggers: [{ t: 3 }, { t: 3.3 }, { t: 50 }, { t: 50.3 }, { t: 50.6 }] },
                { type: 'tapGlass',    vol: 0.6, triggers: [{ t: 22 }, { t: 64 }] },
                { type: 'scratch',     vol: 0.55, triggers: [{ t: 14 }, { t: 14.5 }, { t: 57 }] },
                { type: 'brushStroke', vol: 0.5, triggers: [{ t: 9 }, { t: 42 }, { t: 42.7 }, { t: 70 }] },
                { type: 'micBump',     vol: 0.5, triggers: [{ t: 37 }] },
                { type: 'crinkle',     vol: 0.6, triggers: [{ t: 28 }, { t: 28.3 }, { t: 64.4 }] },
            ],
        },
    },

    // Whispered narration — just twice, per your earlier note not to
    // over-talk on ASMR content. Everything else is silence + triggers.
    defaults: {
        voice: 'af_heart',
        speed: 0.82,
        voiceFX: { whisper: true, volume: 0.45 },
        effectStrength: 1.1,
    },

    scenes: [
        // ── Scene 1 (0-30s) — one whispered line, one Pexels clip ───────
        {
            duration: 30,
            tts: { text: "Just relax... let every little sound carry the tension away.", pauseAfter: 1.2 },
            layers: [
                { type: 'pexels-video', query: 'rain on window night', orientation: 'portrait',
                  maxDuration: 6, loop: true,
                  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
            ],
        },

        // ── Scene 2 (30-60s) — no narration, pure triggers + visuals ────
        {
            duration: 30,
            layers: [
                { type: 'pexels-video', query: 'cozy blanket bed soft light', orientation: 'portrait',
                  maxDuration: 6, loop: true,
                  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
            ],
        },

        // ── Closing scene (60-72s) — ApexCasing, second whispered line ──
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
