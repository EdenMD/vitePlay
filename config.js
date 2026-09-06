// config.test-african-culture.js
// Quick test video — 2 pexels-video clips, Freesound search for African
// music (mood fallback if the search misses or FREESOUND_API_KEY isn't
// set, per src/audio-fetch.js), short TTS. Bare-bones on purpose, it's
// a test render.
//
// Run with:  VIDEO_CONFIG=config.test-african-culture.js node engine-ci.js

module.exports = {
    output: {
        title: 'test-african-culture',
        format: 'portrait',
        fps: 30,
        crf: 23,
        preset: 'medium',
        bgMusicVol: 0.15,
        bgMusic: { search: 'african drums', mood: 'upbeat' },
    },

    defaults: { voice: 'bf_lily', transition: 'fade', transitionDuration: 0.4 },

    scenes: [

        {
            tts: { text: "African culture might be the richest, most vibrant culture on the entire planet.", voice: 'bf_lily', pauseAfter: 0.3 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#ffd23f', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'pexels-video', query: 'african dance traditional', orientation: 'portrait', loop: true, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.25)' },
            ],
        },

        {
            tts: { text: "From music and dance to community and color, it carries a joy and depth the rest of the world is still catching up to.", voice: 'bf_lily', pauseAfter: 0.3 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#ffd23f', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'pexels-video', query: 'african culture festival', orientation: 'portrait', loop: true, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.25)' },
            ],
        },

    ],
};