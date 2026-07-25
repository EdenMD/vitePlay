// config.multiply-by-11.js
// "Multiply any two-digit number by 11, in your head, instantly."
// 34 x 11: split into 3,4 -> add them (3+4=7) -> slide the 7 between -> 374.
// Second example shows the carry twist: 57 x 11 -> 5+7=12 -> only the 2
// fits in the middle, carry the 1 onto the 5 -> 627.
// One scene, pure LaTeX, every trigger is wordText, cursor disabled.

module.exports = {
    output: {
        title:  'multiply-by-11',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',
    },

    defaults: { voice: 'am_michael', transition: 'fade', transitionDuration: 0.35 },

    scenes: [
        {
            tts: {
                text: "Here's how to multiply any two digit number by eleven, in your head, instantly. Take thirty four. Split it: three, and four. Add them together: three plus four is seven. Slide that seven right between the two digits: three, seven, four. Three hundred seventy four. That's thirty four times eleven. One more, this one's got a twist: fifty seven. Five, and seven. Add them: five plus seven is twelve. Only the two fits in the middle, so drop the two, and add the one onto the five: five becomes six. Six, two, seven. Six hundred twenty seven. Any two digit number, times eleven, done in one second.",
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            captions: false,
            layers: [
                { type: 'background', color: '#0a0a12', noise: true, noiseOpacity: 0.03 },
                {
                    type:      'html-record',
                    src:       './ApexCasing/math-latex-explainer.html?tag=multiply-by-11',
                    audioSync: true,
                    cursor:    false,
                    data: {
                        title: 'Multiply By 11 Instantly',
                        theme: { accent: '#ffdd00', text: '#ffffff' },
                        commands: [
                            // ── example 1: 34 x 11 (no carry) ────────────────
                            { id: 'num1', type: 'write', latex: '34', x: 540, y: 380, size: 150,
                              trigger: { wordText: 'thirty', occurrence: 1 } },

                            { id: 'splitNum1', type: 'replace', target: 'num1',
                              latex: '\\textcolor{#4dd0ff}{3}\\textcolor{#ff9d4d}{4}',
                              trigger: { wordText: 'split', occurrence: 1 } },

                            { id: 'eqn1', type: 'write', latex: '3 + 4 = 7', x: 540, y: 560,
                              size: 70, color: '#ffdd00',
                              trigger: { wordText: 'seven', occurrence: 1 } },

                            { id: 'ans1', type: 'write', latex: '374', x: 540, y: 800, size: 150,
                              color: '#7dff8a',
                              trigger: { wordText: 'digits', occurrence: 1 } },

                            { id: 'hl1', type: 'highlight', target: 'ans1', holdSec: 0.7,
                              trigger: { wordText: 'eleven', occurrence: 2 } },

                            // wipe clean before the twist example
                            { id: 'clrMid', type: 'clearAll',
                              trigger: { wordText: 'twist', occurrence: 1 } },

                            // ── example 2: 57 x 11 (carry twist) ─────────────
                            { id: 'num2', type: 'write', latex: '57', x: 540, y: 380, size: 150,
                              trigger: { wordText: 'fifty', occurrence: 1 } },

                            { id: 'eqn2', type: 'write', latex: '5 + 7 = 12', x: 540, y: 560,
                              size: 70, color: '#ffdd00',
                              trigger: { wordText: 'twelve', occurrence: 1 } },

                            // the carry step — only the 2 fits, the 1 bumps the 5 up to 6
                            { id: 'carryEqn', type: 'write', latex: '5 + 1 = 6', x: 540, y: 680,
                              size: 60, color: '#ff9d4d',
                              trigger: { wordText: 'six', occurrence: 1 } },

                            { id: 'ans2', type: 'write', latex: '627', x: 540, y: 900, size: 150,
                              color: '#7dff8a',
                              trigger: { wordText: 'six', occurrence: 2 } },

                            { id: 'hl2', type: 'highlight', target: 'ans2', holdSec: 0.7,
                              trigger: { wordText: 'hundred', occurrence: 2 } },

                            // clean wipe on the last word
                            { id: 'clrEnd', type: 'clearAll',
                              trigger: { wordText: 'second', occurrence: 1 } },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    duration: 32,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },
    ],
};
