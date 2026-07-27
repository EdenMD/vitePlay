// meme-03-empty-fridge.js
// Same silent 30s format as meme-01 — see that file's header for the
// verification notes. Not repeating them per file.
//
// Run with:  VIDEO_CONFIG=meme-03-empty-fridge.js node engine-ci.js

module.exports = {
    output: {
        title: 'meme-empty-fridge',
        format: 'portrait',
        fps: 30,
        crf: 23,
        preset: 'medium',
    },

    scenes: [
        {
            duration: 30,
            captions: false,
            layers: [
                {
                    type: 'stock-image',
                    query: 'open refrigerator empty fridge looking inside',
                    source: 'serpapi', fit: 'cover',
                    kenBurns: 'zoom-in', kenBurnsAmount: 0.18,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.15)' },
                {
                    type: 'text',
                    text: 'OPENING THE FRIDGE\nFOR THE 5TH TIME HOPING\nFOOD MAGICALLY APPEARED',
                    x: 540, y: 260,
                    fontSize: 52, fontFamily: 'Arial Black, sans-serif',
                    color: '#ffffff', align: 'center',
                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                },
                {
                    type: 'giphy',
                    query: 'confused disappointed looking reaction',
                    sticker: true,
                    resultIndex: 0,
                    x: 290, y: 1150, width: 500, height: 500,
                    fit: 'contain',
                },
            ],
        },
    ],
};