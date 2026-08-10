// config.girl-who-built-bombs.js
// "The Girl Who Built Bombs" — first entry in the new storytelling-short
// line, mostly Pexels generic video with only 2 Pollinations ai-image
// layers (both flux-anime — IMPORTANT: only one model resolves per whole
// batch run, so every ai-image layer here must share the same model key
// or later ones silently render with the first scene's model instead).
//
// The story is a fictionalized composite, not a specific named person —
// deliberate, both because Pollinations can't reliably render a specific
// real face, and because "canary girls" (TNT-exposed munitions workers)
// were a real, widespread WWII/WWI phenomenon best told as a composite
// rather than claiming to be one real named woman's biography.
//
// Tone note: gentle fades throughout, not the punchy zoom-cut/glitch
// transitions from the drop-template weapon videos — this one's meant to
// sit and breathe, not hook-and-slam.
//
// Est. runtime: ~197 words of narration, roughly 80-85s at this engine's
// measured pace — longer than your punchier shorts, intentionally, since
// it's a story rather than a hook-and-facts format.
//
// Run with:  VIDEO_CONFIG=config.girl-who-built-bombs.js node engine-ci.js

module.exports = {
    output: {
        title:  'the-girl-who-built-bombs',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'medium',
        postProcess: { grain: true, grainStrength: 0.025, vignette: true, vignetteStrength: 0.4 },
    },

    defaults: { voice: 'bm_george', transitionDuration: 0.6 },

    scenes: [
        // ══ SCENE 1 — anime portrait, the opening ══════════════════════
        {
            tts: { text: "Her name isn't in any history book. In 1943, she was one of nearly two million women who built the weapons of a war they'd never fight in person.", voice: 'bm_george', pauseAfter: 0.5 },
            transition: 'fade',
            captions: {
                style: 'highlight', fontSize: 60, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'ai-image',
                    prompt: 'young woman factory worker in 1940s coveralls and headscarf, standing at a factory gate at dawn, determined expression, soft morning light',
                    model: 'flux-anime', animeStyle: 'anime-portrait',
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                {
                    type: 'text', text: 'A STORY TOLD\nTHROUGH ONE', x: 540, y: 1650,
                    fontSize: 44, fontFamily: 'Arial Black, sans-serif',
                    color: '#f5c518', align: 'center',
                    stroke: true, strokeColor: '#000', strokeWidth: 4,
                },
            ],
        },

        // ══ SCENE 2 — pexels-video, the factory floor ══════════════════
        {
            tts: { text: "Inside, the air tasted like sulfur and metal. Row after row of empty shell casings waited to be filled, packed, and sealed — fast, and steady.", voice: 'bm_george', pauseAfter: 0.4 },
            transition: 'fade',
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'pexels-video', query: 'factory assembly line workers',
                    orientation: 'portrait', loop: true,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
            ],
        },

        // ══ SCENE 3 — pexels-video, the "canary girls" fact ═══════════
        {
            tts: { text: "The workers called themselves canaries. The TNT powder they handled every day stained their skin a pale yellow that never fully washed out.", voice: 'bm_george', pauseAfter: 0.5 },
            transition: 'fade',
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'pexels-video', query: 'hands working machinery closeup',
                    orientation: 'portrait', loop: true,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
            ],
        },

        // ══ SCENE 4 — pexels-video, her reason ═════════════════════════
        {
            tts: { text: "She never talked about why she came. A brother somewhere in the Pacific. Letters that had stopped arriving as often as they used to. This was the only part of the war she could actually touch.", voice: 'bm_george', pauseAfter: 0.5 },
            transition: 'fade',
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'pexels-video', query: 'vintage wartime letters photograph',
                    orientation: 'portrait', loop: true,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
            ],
        },

        // ══ SCENE 5 — pexels-video, the daily risk ═════════════════════
        {
            tts: { text: "One wrong spark, and an entire wing of the factory could go up in seconds. Nobody talked about it out loud. You just kept your hands steady, and got through the shift.", voice: 'bm_george', pauseAfter: 0.5 },
            transition: 'fade',
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'pexels-video', query: 'industrial factory machinery',
                    orientation: 'portrait', loop: true,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
            ],
        },

        // ══ SCENE 6 — anime portrait, the quiet moment ═════════════════
        {
            tts: { text: "At night, she'd sit outside the gates a moment before walking home, hands still faintly yellow under the streetlight, wondering if anyone would ever know her name.", voice: 'bm_george', pauseAfter: 0.6 },
            transition: 'fade',
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'ai-image',
                    prompt: 'young woman sitting alone outside a factory gate at night, streetlight glow, tired but thoughtful expression, hands resting in lap, quiet melancholy mood',
                    model: 'flux-anime', animeStyle: 'anime-portrait',
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.3)' },
            ],
        },

        // ══ SCENE 7 — pexels-video, the closing line ═══════════════════
        {
            tts: { text: "Nobody remembers her name. But somewhere, in a war she never set foot in, a shell she packed by hand might have made the difference for someone who did.", voice: 'bm_george', pauseAfter: 0.7 },
            transition: 'fade',
            transitionDuration: 0.8,
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
            },
            layers: [
                {
                    type: 'pexels-video', query: 'factory exterior sunset',
                    orientation: 'portrait', loop: true,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                {
                    type: 'text', text: 'THE STORIES\nHISTORY LEFT OUT', x: 540, y: 1650,
                    fontSize: 42, fontFamily: 'Arial Black, sans-serif',
                    color: '#f5c518', align: 'center',
                    stroke: true, strokeColor: '#000', strokeWidth: 4,
                },
            ],
        },
    ],
};