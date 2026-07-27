// meme-01-bright-morning.js
// Silent 30s meme template — no tts, no beat/bgMusic, sound added later on
// TikTok/YouTube from their own trending-sound library. That's the whole
// format: one relatable caption + one reaction sticker, held for 30s.
//
// Verified before building any of these three: no-tts scenes already fall
// back to `scene.duration` directly (generateAllTTS), beat/bgMusic are
// both opt-in (omitted here), and encoder.js has a dedicated silent-audio
// path (bounded anullsrc) for exactly this case — nothing improvised.
//
// Run with:  VIDEO_CONFIG=meme-01-bright-morning.js node engine-ci.js

module.exports = {
    output: {
        title: 'meme-bright-morning',
        format: 'portrait',
        fps: 30,
        crf: 23,
        preset: 'medium',
    },

    scenes: [
        {
            duration: 30,     // no `tts` key at all — this is what decides
                               // scene length instead
            captions: false,  // nothing to caption without narration
            layers: [
                {
                    type: 'stock-image',
                    query: 'extremely bright sunlight blinding morning window',
                    source: 'serpapi', fit: 'cover',
                    // slow, subtle over 30s — amt=0.18 means ~18% total
                    // zoom by the end, not a dramatic push
                    kenBurns: 'zoom-in', kenBurnsAmount: 0.18,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.15)' },
                {
                    type: 'text',
                    text: 'THAT ONE DAY YOU WAKE UP\nAND THE BRIGHTNESS IS\nHIGHER THAN USUAL',
                    x: 540, y: 260,
                    fontSize: 54, fontFamily: 'Arial Black, sans-serif',
                    color: '#ffffff', align: 'center',
                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                },
                {
                    type: 'giphy',
                    query: 'squinting eyes bright light reaction',
                    sticker: true,
                    resultIndex: 0,
                    x: 290, y: 1150, width: 500, height: 500,
                    fit: 'contain',
                },
            ],
        },
    ],
};