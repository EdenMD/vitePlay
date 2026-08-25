// ============================================================
//  CONFIG C — "Signs Someone Is Pretending To Be Your Friend"
//  Same exact formula as 710-views config
//  Fake friends = highest comment trigger topic universally
// ============================================================

module.exports = {
    output: {
        title:      'signs-fake-friend',
        format:     'portrait',
        fps:        30,
        crf:        24,
        preset:     'ultrafast',
        bgMusicVol: 0.18,
        bgMusic:    { mood: 'dark' },
        cleanup:    true,
        postProcess: {
            grain:            true,
            grainStrength:    0.022,
            vignette:         true,
            vignetteStrength: 0.38,
        },
    },

    defaults: {
        voice:              'bm_george',
        transition:         'fade',
        transitionDuration: 0.32,
    },

    scenes: [

        // SCENE 1 — HOOK
        {
            tts: { text: 'Your closest friend might not actually be your friend. Four signs that the loyalty is one-sided — and has been for a long time.', pauseAfter: 0.5 },
            layers: [
                {
                    type: 'ai-image',
                    prompt: '1girl, anime, two-faced woman, sweet in front hiding a knife behind back, fake friendship, dark psychology, betrayal energy, dramatic dark room lighting, sharp beautiful features, meinamix',
                    model: 'meinamix', steps: 8,
                    genWidth: 512, genHeight: 512,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                    kenBurns: 'zoom-in', kenBurnsAmount: 0.08,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.54)' },

                { type: 'text', text: '🧠 DARK PSYCHOLOGY',
                  x: 540, y: 160, fontSize: 42, color: '#cc0000',
                  align: 'center', shadow: true, shadowBlur: 12,
                  animation: 'fade', animDur: 0.25 },

                { type: 'shape', shape: 'rect',
                  x: 540, y: 790, width: 1080, height: 380,
                  color: 'rgba(0,0,0,0.76)' },

                { type: 'text', text: 'Your closest friend\nmight not actually\nbe your friend.',
                  x: 540, y: 800,
                  fontSize: 72, color: '#ffffff',
                  align: 'center', maxWidth: 980, lineHeight: 1.15,
                  shadow: true, shadowBlur: 24,
                  animation: 'pop', animDur: 0.3 },

                { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 7,
                  color: '#cc0000', color2: '#ff6600',
                  trackColor: 'rgba(255,255,255,0.08)' },
            ],
        },

        // SCENE 2 — SIGN 1
        {
            tts: { text: 'Sign one. They share your secrets. They call it "just venting" or "I was worried about you." But your private information keeps reaching people it should not reach. A real friend takes your secrets to the grave. Not to the group chat.', pauseAfter: 0.5 },
            layers: [
                {
                    type: 'ai-image',
                    prompt: '1girl, anime, whispering a secret to others behind someone\'s back, betrayal, dark gossip energy, dramatic moody lighting, close up portrait, anything-v5',
                    model: 'anything-v5', steps: 8,
                    genWidth: 512, genHeight: 512,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                    kenBurns: 'drift', kenBurnsAmount: 0.07,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.54)' },

                { type: 'text', text: 'SIGN #1',
                  x: 540, y: 160, fontSize: 48, color: '#cc0000',
                  align: 'center', animation: 'fade', animDur: 0.25 },

                { type: 'shape', shape: 'rect',
                  x: 540, y: 780, width: 1080, height: 420,
                  color: 'rgba(0,0,0,0.76)' },

                { type: 'text', text: 'Your secrets\nkeep reaching\npeople they should not.',
                  x: 540, y: 795,
                  fontSize: 68, color: '#ff4444',
                  align: 'center', maxWidth: 980, lineHeight: 1.18,
                  shadow: true, shadowBlur: 20,
                  animation: 'fade', animDur: 0.35 },

                { type: 'text', text: 'Real friends take\nyour secrets to the grave.',
                  x: 540, y: 1055,
                  fontSize: 52, color: '#ffffff',
                  align: 'center', maxWidth: 960,
                  animation: 'slide-up', animDur: 0.35, startT: 0.4 },

                { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 7,
                  color: '#cc0000', color2: '#ff6600',
                  trackColor: 'rgba(255,255,255,0.08)' },
            ],
        },

        // SCENE 3 — SIGN 2
        {
            tts: { text: 'Sign two. They are your friend in private but not in public. They do not post about you. They do not defend you when others talk about you. But in private they act like your closest ally. That is not friendship. That is convenience.', pauseAfter: 0.5 },
            layers: [
                {
                    type: 'ai-image',
                    prompt: '1girl, anime, ignoring friend in public, cold detachment in social setting, dark psychology, hidden disloyalty, dramatic moody lighting, toonyou',
                    model: 'toonyou', steps: 8,
                    genWidth: 512, genHeight: 512,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                    kenBurns: 'zoom-out', kenBurnsAmount: 0.07,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.52)' },

                { type: 'text', text: 'SIGN #2',
                  x: 540, y: 160, fontSize: 48, color: '#cc0000',
                  align: 'center', animation: 'fade', animDur: 0.25 },

                { type: 'shape', shape: 'rect',
                  x: 540, y: 760, width: 1080, height: 460,
                  color: 'rgba(0,0,0,0.76)' },

                { type: 'text', text: 'Your friend\nin private.',
                  x: 540, y: 785,
                  fontSize: 80, color: '#ffaa00',
                  align: 'center', maxWidth: 980, lineHeight: 1.15,
                  shadow: true, shadowBlur: 20,
                  animation: 'fade', animDur: 0.35 },

                { type: 'text', text: 'A stranger\nin public.',
                  x: 540, y: 1000,
                  fontSize: 80, color: '#ff4444',
                  align: 'center', maxWidth: 980, lineHeight: 1.15,
                  shadow: true, shadowBlur: 20,
                  animation: 'slide-up', animDur: 0.35, startT: 0.42 },

                { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 7,
                  color: '#cc0000', color2: '#ff6600',
                  trackColor: 'rgba(255,255,255,0.08)' },
            ],
        },

        // SCENE 4 — SIGN 3
        {
            tts: { text: 'Sign three. They compete with you instead of supporting you. Every time you win, something shifts in the energy. They cannot celebrate you fully because your success reminds them of what they have not achieved. Jealousy dressed up as friendship is still jealousy.', pauseAfter: 0.5 },
            layers: [
                {
                    type: 'ai-image',
                    prompt: '1girl, anime, forced celebration hiding competitive jealousy, dark psychology of fake friendship, dramatic portrait, moody interior, meinamix',
                    model: 'meinamix', steps: 8,
                    genWidth: 512, genHeight: 512,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                    kenBurns: 'zoom-in', kenBurnsAmount: 0.07,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.54)' },

                { type: 'text', text: 'SIGN #3',
                  x: 540, y: 160, fontSize: 48, color: '#cc0000',
                  align: 'center', animation: 'fade', animDur: 0.25 },

                { type: 'shape', shape: 'rect',
                  x: 540, y: 760, width: 1080, height: 460,
                  color: 'rgba(0,0,0,0.76)' },

                { type: 'text', text: 'They cannot\nfully celebrate\nyour wins.',
                  x: 540, y: 775,
                  fontSize: 74, color: '#ffffff',
                  align: 'center', maxWidth: 980, lineHeight: 1.18,
                  shadow: true, shadowBlur: 22,
                  animation: 'fade', animDur: 0.35 },

                { type: 'text', text: 'Jealousy dressed\nas friendship.',
                  x: 540, y: 1055,
                  fontSize: 60, color: '#ff4444',
                  align: 'center', maxWidth: 960,
                  glow: true, glowColor: '#8b0000', glowBlur: 16,
                  animation: 'pop', animDur: 0.3, startT: 0.5 },

                { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 7,
                  color: '#cc0000', color2: '#ff6600',
                  trackColor: 'rgba(255,255,255,0.08)' },
            ],
        },

        // SCENE 5 — SIGN 4
        {
            tts: { text: 'Sign four. When things get hard for you — they disappear. They are present for the good times. The celebrations. The outings. But the moment life gets heavy, you look around and they are gone. Fair weather friendship is not friendship. It is entertainment.', pauseAfter: 0.6 },
            layers: [
                {
                    type: 'ai-image',
                    prompt: '1girl, anime, walking away from friend in need, abandonment in times of difficulty, dark psychology, dramatic exit, cold heartless expression, flux-anime',
                    model: 'flux-anime', steps: 8,
                    genWidth: 512, genHeight: 512,
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                    kenBurns: 'pan-left', kenBurnsAmount: 0.07,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.54)' },

                { type: 'text', text: 'SIGN #4',
                  x: 540, y: 160, fontSize: 48, color: '#cc0000',
                  align: 'center', animation: 'fade', animDur: 0.25 },

                { type: 'shape', shape: 'rect',
                  x: 540, y: 760, width: 1080, height: 480,
                  color: 'rgba(0,0,0,0.76)' },

                { type: 'text', text: 'Good times: there.\nHard times:',
                  x: 540, y: 780,
                  fontSize: 74, color: '#ffffff',
                  align: 'center', maxWidth: 980, lineHeight: 1.18,
                  shadow: true, shadowBlur: 22,
                  animation: 'fade', animDur: 0.35 },

                { type: 'text', text: 'GONE.',
                  x: 540, y: 1040,
                  fontSize: 120, color: '#ff4444',
                  align: 'center',
                  glow: true, glowColor: '#8b0000', glowBlur: 30,
                  animation: 'pop', animDur: 0.28, startT: 0.48 },

                { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 7,
                  color: '#cc0000', color2: '#ff6600',
                  trackColor: 'rgba(255,255,255,0.08)' },
            ],
        },

        // SCENE 6 — CTA
        {
            tts: { text: 'One name came to mind the whole time. You already have your answer. Tag someone who needs to audit their circle today.', pauseAfter: 0.4 },
            layers: [
                { type: 'gradient',
                  gradientType: 'linear',
                  colors: ['#0d0005', '#080010', '#000000'],
                  angle: 160 },

                { type: 'text', text: '🧠',
                  x: 540, y: 300, fontSize: 130, align: 'center',
                  animation: 'pop', animDur: 0.3 },

                { type: 'text', text: 'One name came\nto mind the whole time.',
                  x: 540, y: 570,
                  fontSize: 76, color: '#ffffff',
                  align: 'center', maxWidth: 960, lineHeight: 1.18,
                  shadow: true, shadowBlur: 28,
                  animation: 'fade', animDur: 0.4, startT: 0.2 },

                { type: 'divider',
                  y: 858, x1: 140, x2: 940,
                  color: '#cc0000', thickness: 2, animDur: 0.4 },

                { type: 'text', text: 'Tag them.\nOr tag who needs\nto see this. 👇',
                  x: 540, y: 950,
                  fontSize: 66, color: '#ff4444',
                  align: 'center', maxWidth: 960, lineHeight: 1.3,
                  glow: true, glowColor: '#8b0000', glowBlur: 20,
                  animation: 'slide-up', animDur: 0.4, startT: 0.45 },

                { type: 'text', text: 'Follow for more dark psychology 🧠',
                  x: 540, y: 1350,
                  fontSize: 46, color: 'rgba(255,255,255,0.50)',
                  align: 'center', maxWidth: 900,
                  animation: 'fade', animDur: 0.4, startT: 0.7 },

                { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 7,
                  color: '#cc0000', color2: '#ff6600',
                  trackColor: 'rgba(255,255,255,0.08)' },
            ],
        },
    ],
};
