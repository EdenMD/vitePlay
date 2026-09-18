/**
 * config.youtube-test.js — Smoke test for the youtube-video layer
 *
 * Topic: F-35 Lightning II disadvantages.
 * (Note: "F-35 Raptor" isn't a real jet — the F-35 is the Lightning II,
 * the Raptor is the F-22. Queries below use "F-35 Lightning II" so the
 * YouTube search actually returns F-35 footage instead of F-22 clips.)
 *
 * Exercises:
 *   - youtube-video search resolution (2 different queries, Phase 1.15)
 *   - Freesound-driven bgMusic (output.bgMusic.search — needs
 *     FREESOUND_API_KEY; falls back to the FMA 'dark' mood track if that
 *     secret isn't set, so this still runs either way)
 *
 * 2 short scenes on purpose — this is a smoke test for the new layer and
 * the workflow's yt-dlp step, not a real upload.
 *
 * Run:
 *   VIDEO_CONFIG=config.youtube-test.js node engine-ci.js
 * Or via workflow_dispatch input: config = config.youtube-test.js
 */

module.exports = {
    output: {
        title:  'f35-disadvantages-yttest',
        format: 'portrait',
        fps:    30,
        crf:    28,
        preset: 'fast',

        // { search: ... } hits Freesound if FREESOUND_API_KEY is set;
        // `mood` is the fallback FMA track if the search comes up empty
        // or the key isn't configured — see src/audio-fetch.js.
        bgMusic: {
            search: 'dark tense military drone ambience',
            mood:   'dark',
        },
    },

    defaults: {
        voice:      'am_adam',
        emotion:    'neutral',
        transition: 'fade',
    },

    scenes: [

        // ── Scene 1 — cost/complexity hook ──────────────────────────────
        {
            tts: {
                text:    "The F-35 is the most expensive weapons program in history. But it has real weaknesses.",
                voice:   'am_adam',
                emotion: 'neutral',
            },
            captions: true,
            layers: [
                {
                    type:        'youtube-video',
                    query:       'F-35 Lightning II flight test footage',
                    resultIndex: 0,
                    maxDuration: 6,
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                {
                    type:       'text',
                    text:       'F-35: THE PROBLEMS',
                    x: 540, y: 160,
                    fontSize:   64,
                    fontFamily: 'Impact, Arial Black',
                    color:      '#fff',
                    align:      'center',
                    stroke:     true, strokeColor: '#000', strokeWidth: 4,
                },
            ],
        },

        // ── Scene 2 — maintenance cost, different query/result ──────────
        {
            tts: {
                text:    "Maintenance runs over forty thousand dollars per flight hour, and readiness rates still lag behind older jets.",
                voice:   'am_adam',
                emotion: 'neutral',
            },
            captions: true,
            layers: [
                {
                    type:        'youtube-video',
                    query:       'F-35 maintenance hangar footage',
                    resultIndex: 0,
                    maxDuration: 5,
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                {
                    type:     'text',
                    text:     '$40K+ per flight hour',
                    x: 540, y: 1700,
                    fontSize: 54,
                    color:    '#ff3b5c',
                    align:    'center',
                },
            ],
        },
    ],
};
