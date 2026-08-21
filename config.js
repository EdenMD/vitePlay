// config.does-a-soldier-feel-guilt.js
// "Does a soldier feel guilt?" — poetic, reflective short, grandfather-
// narrator framing. Different register from the rest of this channel's
// content deliberately: no hook-and-facts pacing, no punchy rotate Ken
// Burns (reads as attention-grabbing, wrong tone here — slow zoom/pan/
// drift only), no aggressive caption styling.
//
// VOICE: no literal "grandfather" option exists in Kokoro's catalog —
// am_eric ("warm, trustworthy") is the closest fit and used throughout.
//
// THE QUOTE: one reflective line appears in quotes in scene 5. It is
// NOT attributed to any specific real named veteran — framed as an
// anonymous/composite voice ("a man who served... wrote...") rather
// than invented words put in a real person's mouth, which would be
// fabricating a quote and misinformation regardless of how true it feels.
//
// CONTENT NOTE: references a real historical debate (S.L.A. Marshall's
// WWII "ratio of fire" research, and the modern concept of moral
// injury) at the level of general public knowledge — hedged
// appropriately ("some studies suggested," not stated as settled fact),
// since Marshall's original methodology has been disputed by later
// historians. Nothing graphic; the focus stays on the psychological and
// historical question asked, not on combat detail.
//
// bgMusic: this is the one file in this project that deliberately
// breaks from the "no bgMusic" convention — mood: 'calm' at a very low
// volume, because a reflective piece like this genuinely benefits from
// a soft ambient bed. Drop bgMusic entirely if you want to stay
// consistent with everything else.
//
// Run with:  VIDEO_CONFIG=config.does-a-soldier-feel-guilt.js node engine-ci.js

module.exports = {
    output: {
        title:  'does-a-soldier-feel-guilt',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'medium',
        bgMusicVol: 0.09,
        bgMusic: { mood: 'calm' },
        postProcess: { grain: true, grainStrength: 0.025, vignette: true, vignetteStrength: 0.42 },
    },

    defaults: { voice: 'am_santa', transition: 'fade', transitionDuration: 0.7 },

    scenes: [

        // ── SCENE 1 — the invitation to sit and listen ──────────────────
        {
            tts: { text: "Come sit a while, child. I want to tell you something the movies never quite get right — about what it costs a man to pull a trigger, and keep on living after.", pauseAfter: 0.6 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 52, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'stock-image', query: 'lone soldier silhouette sunset', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.1, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
            ],
        },

        // ── SCENE 2 — the myth of the unshaken soldier ──────────────────
        {
            tts: { text: "We like to imagine the soldier as unshaken — stone-faced, steady-handed, untouched by what he's done. But a soldier is not stone. He is flesh, and memory, and a conscience that doesn't simply switch off because a uniform tells it to.", pauseAfter: 0.5 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 52, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'stock-image', query: 'soldier face closeup thoughtful', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'drift', kenBurnsAmount: 0.09, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
            ],
        },

        // ── SCENE 3 — the hesitation historians noted ───────────────────
        {
            tts: { text: "Historians have long noted something curious. In the chaos of battle, many soldiers — even trained, even ordered — found their hands unwilling. Some studies from the last century suggested only a fraction ever aimed to kill at all. Whatever the true number, the hesitation itself tells you something. Even in war, some part of a man resists.", pauseAfter: 0.5 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'stock-image', query: 'empty battlefield fog quiet', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'pan-left', kenBurnsAmount: 0.1, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
            ],
        },

        // ── SCENE 4 — moral injury, named ────────────────────────────────
        {
            tts: { text: "And for those who did carry it through — who came home and closed their eyes only to see it again — there is a name for that quiet, invisible wound. Doctors call it moral injury. Not a wound in the body. A wound in the part of a man that knows right from wrong.", pauseAfter: 0.6 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'stock-image', query: 'veteran sitting alone window', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'zoom-out', kenBurnsAmount: 0.09, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
            ],
        },

        // ── SCENE 5 — the quoted line (anonymous/composite, not fabricated to a real name) ──
        {
            tts: { text: "I once read the words of a man who served, long after the guns had gone silent. He wrote: \"I did not lose my life over there. I only lost the part of me that could forget.\" That, child, is the truest medal no army ever pins on a chest.", pauseAfter: 0.7 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'stock-image', query: 'old letter handwriting candlelight', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.08, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
            ],
        },

        // ── SCENE 6 — the answer, plainly ────────────────────────────────
        {
            tts: { text: "So yes — they feel it. The guilt, the grief, the nights that don't end quietly. Because being willing to survive a war does not mean a man was ever willing to stop being human.", pauseAfter: 0.6 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 52, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'stock-image', query: 'soldier boots memorial rain', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'drift', kenBurnsAmount: 0.1, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
            ],
        },

        // ── SCENE 7 — closing, gentle CTA ───────────────────────────────
        {
            tts: { text: "That's the story the parades don't tell. If it moved you, sit with it a while — and maybe pass it on. Someone else needs to hear it too.", pauseAfter: 0.5 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 52, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'stock-image', query: 'sunrise over quiet field', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'zoom-out', kenBurnsAmount: 0.1, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
            ],
        },

    ],
};