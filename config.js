// ============================================================
//  APEX VIDEO ENGINE — CAREER SERIES — "TELL US ABOUT YOURSELF"
//  What interviewers actually want you to say
//  Target: ~65-70 seconds | 6 scenes | af_kore voice
// ============================================================
const config = {
    output: {
        title:      'career-03-tell-us-about-yourself',
        format:     'portrait',
        fps:        30,
        crf:        24,
        preset:     'ultrafast',
        cleanup:    true,
        postProcess: {
            grain:            true,
            grainStrength:    0.022,
            vignette:         true,
            vignetteStrength: 0.45,
        },
    },
    defaults: {
        voice:              'af_kore',
        transition:         'fade',
        transitionDuration: 0.26,
    },
    scenes: [

        // ── SCENE 1 — HOOK (~9 sec) ────────────────────────────────
        {
            tts: {
                text:       '"Tell us about yourself." The most common interview question — and the one most people answer completely wrong.',
                speed:      0.95,
                emotion:    'neutral',
                pauseAfter: 0.3,
            },
            transition:         'zoom-cut',
            transitionDuration: 0.2,
            captions: {
                style:          'highlight',
                position:       'bottom',
                fontSize:       56,
                color:          '#ffffff',
                highlightColor: '#2f7cf6',
                wordsPerChunk:  4,
                strokeColor:    'rgba(0,0,0,1)',
                strokeWidth:    6,
            },
            layers: [
                {
                    type:           'stock-image',
                    query:          'job interview handshake office',
                    source:         'serpapi',
                    orientation:    'portrait',
                    imageIndex:     0,
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit:            'cover',
                    kenBurns:       'zoom-in',
                    kenBurnsAmount: 0.14,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.52)' },
                {
                    type:       'text',
                    text:       '"TELL US ABOUT\nYOURSELF"',
                    x:          540,
                    y:          680,
                    fontSize:   68,
                    fontFamily: 'Arial Black, Impact, sans-serif',
                    fontWeight: 'bold',
                    color:      '#ffffff',
                    align:      'center',
                    maxWidth:   940,
                    lineHeight: 1.15,
                    gradient:   ['#2f7cf6', '#5aa9ff'],
                    stroke:     true,
                    strokeColor:'#000000',
                    strokeWidth: 5,
                    glow:       true,
                    glowColor:  '#2f7cf6',
                    glowBlur:   30,
                    animation:  'pop',
                    animDur:    0.35,
                    startT:     0.15,
                    hookLayer:  true,
                },
                {
                    type:       'text',
                    text:       'Most people get this wrong.',
                    x:          540,
                    y:          900,
                    fontSize:   42,
                    fontFamily: 'Arial Black, Impact, sans-serif',
                    color:      '#ffffff',
                    align:      'center',
                    maxWidth:   880,
                    stroke:     true,
                    strokeColor:'#000000',
                    strokeWidth: 4,
                    animation:  'fade',
                    animDur:    0.3,
                    startT:     1.2,
                },
            ],
        },

        // ── SCENE 2 — WHAT THEY'RE NOT ASKING (~11 sec) ─────────────
        {
            tts: {
                text:       'They are not asking for your life story. Not your childhood, not your hobbies, not a walk through your entire CV. If you start with "I was born in..." — you\'ve already lost them.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.3,
            },
            transition: 'wipe-left', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'bored interviewer listening', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'pan-up', kenBurnsAmount: 0.16 },
                { type: 'overlay', color: 'rgba(0,0,0,0.55)' },
                { type: 'text', text: 'NOT YOUR\nLIFE STORY.', x: 540, y: 420, fontSize: 64, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 920, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: '❌ "I was born in..."\n❌ Your childhood\n❌ Your hobbies', x: 540, y: 700, fontSize: 44, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ff6b6b', align: 'center', maxWidth: 880, lineHeight: 1.5, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 0.5 },
                { type: 'text', text: 'Say this and you\'ve\nalready lost them.', x: 540, y: 1050, fontSize: 40, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 880, lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.9 },
            ],
        },

        // ── SCENE 3 — WHAT THEY ACTUALLY WANT (~13 sec) ─────────────
        {
            tts: {
                text:       'What they\'re actually testing is simple: can you summarize yourself clearly, and do you understand why you\'re relevant to this specific role. That\'s it. It\'s not a biography question — it\'s a focus question.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.3,
            },
            transition: 'wipe-right', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'gradient', gradientType: 'linear', colors: ['#050505', '#0d1a2e', '#050505'], angle: 160, vignette: true, vignetteStrength: 0.5 },
                { type: 'text', text: 'WHAT THEY\'RE\nACTUALLY TESTING', x: 540, y: 340, fontSize: 58, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 920, lineHeight: 1.2, gradient: ['#2f7cf6', '#5aa9ff'], stroke: true, strokeColor: '#000000', strokeWidth: 5, glow: true, glowColor: '#2f7cf6', glowBlur: 24, animation: 'pop', animDur: 0.35, startT: 0.1 },
                { type: 'text', text: '1. Can you summarize\n   yourself clearly?\n\n2. Do you know why you\'re\n   relevant to THIS role?', x: 540, y: 780, fontSize: 44, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.5, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 0.6 },
                { type: 'text', text: 'A focus question.\nNot a biography question.', x: 540, y: 1280, fontSize: 40, fontFamily: 'Arial Black, Impact, sans-serif', color: '#7fbf5f', align: 'center', maxWidth: 880, lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.9 },
            ],
        },

        // ── SCENE 4 — THE FORMULA (~18 sec) ─────────────────────────
        {
            tts: {
                text:       'Use this formula: Present, Past, Future. Present — what you do right now, in one sentence. Past — the one or two experiences that actually led you here. Future — why this exact role is the logical next step for you. Under ninety seconds. Every time.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.35,
            },
            transition: 'glitch', transitionDuration: 0.2,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'gradient', gradientType: 'linear', colors: ['#050505', '#1a1a2e', '#050505'], angle: 160, vignette: true, vignetteStrength: 0.5 },
                { type: 'text', text: 'THE FORMULA', x: 540, y: 280, fontSize: 54, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'PRESENT', x: 540, y: 460, fontSize: 62, fontFamily: 'Arial Black, Impact, sans-serif', color: '#2f7cf6', align: 'center', maxWidth: 900, glow: true, glowColor: '#2f7cf6', glowBlur: 20, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'slide-up', animDur: 0.3, startT: 0.5 },
                { type: 'text', text: 'What you do right now.', x: 540, y: 550, fontSize: 36, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 800, stroke: true, strokeColor: '#000000', strokeWidth: 3, animation: 'fade', animDur: 0.25, startT: 0.7 },
                { type: 'text', text: 'PAST', x: 540, y: 720, fontSize: 62, fontFamily: 'Arial Black, Impact, sans-serif', color: '#2f7cf6', align: 'center', maxWidth: 900, glow: true, glowColor: '#2f7cf6', glowBlur: 20, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'slide-up', animDur: 0.3, startT: 1.1 },
                { type: 'text', text: 'The 1-2 experiences\nthat led you here.', x: 540, y: 830, fontSize: 36, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 800, lineHeight: 1.25, stroke: true, strokeColor: '#000000', strokeWidth: 3, animation: 'fade', animDur: 0.25, startT: 1.3 },
                { type: 'text', text: 'FUTURE', x: 540, y: 1010, fontSize: 62, fontFamily: 'Arial Black, Impact, sans-serif', color: '#2f7cf6', align: 'center', maxWidth: 900, glow: true, glowColor: '#2f7cf6', glowBlur: 20, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'slide-up', animDur: 0.3, startT: 1.7 },
                { type: 'text', text: 'Why THIS role is\nyour logical next step.', x: 540, y: 1120, fontSize: 36, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 800, lineHeight: 1.25, stroke: true, strokeColor: '#000000', strokeWidth: 3, animation: 'fade', animDur: 0.25, startT: 1.9 },
                { type: 'stat-counter', value: 90, suffix: ' SEC', label: 'MAX LENGTH — EVERY TIME', x: 540, y: 1420, fontSize: 80, labelSize: 26, color: '#7fbf5f', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#7fbf5f', glowBlur: 30, countDur: 1.0 },
            ],
        },

        // ── SCENE 5 — EXAMPLE (~12 sec) ─────────────────────────────
        {
            tts: {
                text:       'For example: "I currently manage inventory for a busy retail store. Before that, I spent two years in customer service, which taught me how to stay calm under pressure. I\'m looking to move into a role like this one, where I can use both skills together."',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.35,
            },
            transition: 'wipe-left', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 52, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'confident job candidate interview', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.14 },
                { type: 'overlay', color: 'rgba(0,0,0,0.58)' },
                {
                    type:        'notification-card',
                    x:           540,
                    y:           850,
                    width:       920,
                    title:       '💬 EXAMPLE ANSWER',
                    body:        '"I currently manage inventory for a busy retail store. Before that, two years in customer service — taught me to stay calm under pressure. I\'m looking for a role like this one, to use both skills together."',
                    bgColor:     'rgba(47,124,246,0.16)',
                    borderColor: '#2f7cf6',
                    titleColor:  '#2f7cf6',
                    bodyColor:   '#ffffff',
                    fontSize:    34,
                    bodySize:    26,
                    borderRadius:18,
                    animation:   'pop',
                    animDur:     0.35,
                    startT:      0.3,
                },
            ],
        },

        // ── SCENE 6 — CLOSING + CTA (~8 sec) ─────────────────────────
        {
            tts: {
                text:       'Present. Past. Future. Practice it out loud until it feels natural. Follow for more interview tips that actually work.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.4,
            },
            transition: 'zoom-cut', transitionDuration: 0.2,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'successful interview handshake smile', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'zoom-out', kenBurnsAmount: 0.14 },
                { type: 'overlay', color: 'rgba(0,0,0,0.55)' },
                { type: 'text', text: 'PRESENT.\nPAST.\nFUTURE.', x: 540, y: 460, fontSize: 66, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.2, gradient: ['#2f7cf6', '#5aa9ff'], stroke: true, strokeColor: '#000000', strokeWidth: 5, glow: true, glowColor: '#2f7cf6', glowBlur: 26, animation: 'slide-up', animDur: 0.3, startT: 0.3 },
                {
                    type:        'notification-card',
                    x:           540,
                    y:           1370,
                    width:       860,
                    title:       '🔔 Follow for more',
                    body:        'Interview tips that actually work',
                    bgColor:     'rgba(47,124,246,0.14)',
                    borderColor: '#2f7cf6',
                    titleColor:  '#2f7cf6',
                    bodyColor:   '#ffffff',
                    fontSize:    32,
                    bodySize:    26,
                    borderRadius:18,
                    animation:   'slide-up',
                    animDur:     0.32,
                    startT:      1.5,
                },
            ],
        },
    ],
};

module.exports = config;
