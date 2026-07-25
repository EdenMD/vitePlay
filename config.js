// config.birthday-paradox.js
// "How many people need to be in a room before two share a birthday?"
// One scene, one idea, one graph. Every trigger is wordText — no
// atSeconds, no afterId — so the visuals ride the narration exactly.
// cursor: false — this isn't an interaction demo, no cursor needed.

module.exports = {
    output: {
        title:  'birthday-paradox',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',
    },

    defaults: { voice: 'am_michael', transition: 'fade', transitionDuration: 0.35 },

    scenes: [
        {
            tts: {
                text: "How many people need to be in a room before two of them share a birthday? Most people guess something like one hundred eighty. The real number is twenty three. Watch the curve. At twenty three people, you're already at a coin flip. Push it to thirty, and it's already seventy percent. By fifty, it's basically guaranteed. It was never about matching your birthday, it's about every pair you can make in that room, and pairs multiply faster than people do.",
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            captions: false,
            layers: [
                { type: 'background', color: '#0a0a12', noise: true, noiseOpacity: 0.03 },
                {
                    type:      'html-record',
                    src:       './ApexCasing/geometry-graph-explainer.html?tag=birthday-paradox',
                    audioSync: true,
                    cursor:    false,
                    data: {
                        title: 'The Birthday Paradox',
                        theme: { accent: '#ffdd00', text: '#ffffff' },
                        commands: [
                            // the axes — set up right as we frame the question
                            { id: 'ax1', type: 'axes', x: 140, y: 380, w: 800, h: 900,
                              xMin: 0, xMax: 60, yMin: 0, yMax: 1, xStep: 10, yStep: 0.25,
                              showGrid: true, labelX: 'people in the room', labelY: 'probability',
                              trigger: { wordText: 'room', occurrence: 1 } },

                            // the naive guess, faint — set up the trap
                            { id: 'guessLabel', type: 'write', latex: '\\approx 180\\,?', x: 540, y: 230,
                              size: 54, color: 'rgba(255,255,255,0.4)',
                              trigger: { wordText: 'guess', occurrence: 1 } },

                            // the real number, big and bold
                            { id: 'realLabel', type: 'write', latex: '23', x: 540, y: 320,
                              size: 140, color: '#ffdd00',
                              trigger: { wordText: 'real', occurrence: 1 } },

                            // the guess fades out the moment the real number lands
                            { id: 'fadeGuess', type: 'fadeGroup', targets: ['guessLabel'], opacity: 0.08,
                              duration: 0.4, trigger: { wordText: 'twenty', occurrence: 1 } },

                            // the curve — closed-form approximation, accurate enough to teach from:
                            // P(share) ≈ 1 - e^(-n(n-1)/(2·365))
                            { id: 'curve1', type: 'plot', axesId: 'ax1',
                              fn: '1 - Math.exp(-x*(x-1)/(2*365))',
                              stroke: '#ffdd00', strokeWidth: 7, samples: 120,
                              trigger: { wordText: 'curve', occurrence: 1 } },

                            // the three payoff points, each landing on its own number
                            { id: 'pt23', type: 'graphPoint', axesId: 'ax1', x: 23, y: 0.507, r: 13,
                              color: '#ff5555', trigger: { wordText: 'twenty', occurrence: 2 } },
                            { id: 'lbl23', type: 'write', latex: '\\approx 50\\%', x: 480, y: 790,
                              size: 44, color: '#ff5555', trigger: { wordText: 'coin', occurrence: 1 } },

                            { id: 'pt30', type: 'graphPoint', axesId: 'ax1', x: 30, y: 0.696, r: 12,
                              color: '#4dd0ff', trigger: { wordText: 'thirty', occurrence: 1 } },
                            { id: 'lbl30', type: 'write', latex: '\\approx 70\\%', x: 580, y: 615,
                              size: 40, color: '#4dd0ff', trigger: { wordText: 'seventy', occurrence: 1 } },

                            { id: 'pt50', type: 'graphPoint', axesId: 'ax1', x: 50, y: 0.965, r: 12,
                              color: '#7dff8a', trigger: { wordText: 'fifty', occurrence: 1 } },
                            { id: 'lbl50', type: 'write', latex: '\\approx 97\\%', x: 730, y: 350,
                              size: 40, color: '#7dff8a', trigger: { wordText: 'guaranteed', occurrence: 1 } },

                            // one last glow on "23" as the explanation lands
                            { id: 'hl23', type: 'highlight', target: 'realLabel', holdSec: 0.7,
                              trigger: { wordText: 'never', occurrence: 1 } },

                            // clean wipe on the last word
                            { id: 'clr1', type: 'clearAll',
                              trigger: { wordText: 'faster', occurrence: 1 } },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    duration: 30,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },
    ],
};
