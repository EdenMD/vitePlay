// ============================================================
//  APEX VIDEO ENGINE — CAREER SERIES — TOP 10 HIGHEST PAYING
//  JOBS & BUSINESSES IN ZIMBABWE
//  Target: ~85-90 seconds | 12 scenes | no bgMusic
//  Sourced from cross-referenced 2026 Zimbabwe salary guides
//  (ibzim, Africarrieres, MaxisHR, Campus Cybercafe). Figures
//  presented as approximate USD/month ranges — real pay varies
//  by employer, sector, and region.
// ============================================================
const config = {
    output: {
        title:      'career-02-top10-highest-paying-zim',
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
        voice:              'bf_lily',
        transition:         'fade',
        transitionDuration: 0.24,
    },
    scenes: [

        // ── SCENE 1 — HOOK (~8 sec) ────────────────────────────────
        {
            tts: {
                text:       'The top ten highest paying jobs and businesses in Zimbabwe right now. Number one might surprise you.',
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
                    query:          'Harare Zimbabwe city skyline',
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
                    text:       'TOP 10\nHIGHEST PAYING\nJOBS IN ZIMBABWE',
                    x:          540,
                    y:          700,
                    fontSize:   66,
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
            ],
        },

        // ── SCENE 2 — #10: SENIOR PHARMACIST (~7 sec) ──────────────
        {
            tts: {
                text:       'Number ten. Senior pharmacist. Around one thousand two hundred to two thousand five hundred dollars a month, especially in private pharmacy chains.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.25,
            },
            transition: 'wipe-left', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'pharmacist pharmacy counter', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'pan-up', kenBurnsAmount: 0.16 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: '#10', x: 200, y: 260, fontSize: 130, fontFamily: 'Impact, Arial Black, sans-serif', color: '#2f7cf6', align: 'center', stroke: true, strokeColor: '#000000', strokeWidth: 6, glow: true, glowColor: '#2f7cf6', glowBlur: 26, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'SENIOR\nPHARMACIST', x: 540, y: 700, fontSize: 62, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'slide-up', animDur: 0.3, startT: 0.4 },
                { type: 'text', text: '$1,200 – $2,500 / month', x: 540, y: 900, fontSize: 46, fontFamily: 'Arial Black, Impact, sans-serif', color: '#4ade80', align: 'center', maxWidth: 880, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.1 },
            ],
        },

        // ── SCENE 3 — #9: UNIVERSITY PROFESSOR (~7 sec) ────────────
        {
            tts: {
                text:       'Number nine. Senior university professor. One thousand five hundred to three thousand dollars a month at the top institutions.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.25,
            },
            transition: 'wipe-right', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'university professor lecture hall', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'drift', kenBurnsAmount: 0.15 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: '#9', x: 200, y: 260, fontSize: 130, fontFamily: 'Impact, Arial Black, sans-serif', color: '#2f7cf6', align: 'center', stroke: true, strokeColor: '#000000', strokeWidth: 6, glow: true, glowColor: '#2f7cf6', glowBlur: 26, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'SENIOR\nPROFESSOR', x: 540, y: 700, fontSize: 62, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'slide-up', animDur: 0.3, startT: 0.4 },
                { type: 'text', text: '$1,500 – $3,000 / month', x: 540, y: 900, fontSize: 46, fontFamily: 'Arial Black, Impact, sans-serif', color: '#4ade80', align: 'center', maxWidth: 880, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.1 },
            ],
        },

        // ── SCENE 4 — #8: PETROLEUM/MINING ENGINEER (~7 sec) ───────
        {
            tts: {
                text:       'Number eight. Petroleum and mining engineers. Two thousand to four thousand dollars a month, driven by Zimbabwe\'s gold and lithium boom.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.25,
            },
            transition: 'wipe-left', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'mining engineer site helmet', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.15 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: '#8', x: 200, y: 260, fontSize: 130, fontFamily: 'Impact, Arial Black, sans-serif', color: '#2f7cf6', align: 'center', stroke: true, strokeColor: '#000000', strokeWidth: 6, glow: true, glowColor: '#2f7cf6', glowBlur: 26, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'MINING &\nPETROLEUM ENGINEER', x: 540, y: 680, fontSize: 52, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'slide-up', animDur: 0.3, startT: 0.4 },
                { type: 'text', text: '$2,000 – $4,000 / month', x: 540, y: 900, fontSize: 46, fontFamily: 'Arial Black, Impact, sans-serif', color: '#4ade80', align: 'center', maxWidth: 880, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.1 },
            ],
        },

        // ── SCENE 5 — #7: FINANCE DIRECTOR / BANKING (~7 sec) ──────
        {
            tts: {
                text:       'Number seven. Finance director or senior banking executive. Two thousand to four thousand dollars a month at major banks.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.25,
            },
            transition: 'wipe-right', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'bank executive office suit', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'pan-up', kenBurnsAmount: 0.15 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: '#7', x: 200, y: 260, fontSize: 130, fontFamily: 'Impact, Arial Black, sans-serif', color: '#2f7cf6', align: 'center', stroke: true, strokeColor: '#000000', strokeWidth: 6, glow: true, glowColor: '#2f7cf6', glowBlur: 26, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'FINANCE\nDIRECTOR', x: 540, y: 700, fontSize: 62, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'slide-up', animDur: 0.3, startT: 0.4 },
                { type: 'text', text: '$2,000 – $4,000 / month', x: 540, y: 900, fontSize: 46, fontFamily: 'Arial Black, Impact, sans-serif', color: '#4ade80', align: 'center', maxWidth: 880, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.1 },
            ],
        },

        // ── SCENE 6 — #6: ICT DIRECTOR / SENIOR SOFTWARE ENG (~7 sec) ─
        {
            tts: {
                text:       'Number six. ICT director or senior software engineer. Two thousand to four thousand five hundred dollars a month, and rising fast with fintech growth.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.25,
            },
            transition: 'wipe-left', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'software engineer office laptop', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'drift', kenBurnsAmount: 0.15 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: '#6', x: 200, y: 260, fontSize: 130, fontFamily: 'Impact, Arial Black, sans-serif', color: '#2f7cf6', align: 'center', stroke: true, strokeColor: '#000000', strokeWidth: 6, glow: true, glowColor: '#2f7cf6', glowBlur: 26, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'ICT DIRECTOR /\nSENIOR DEVELOPER', x: 540, y: 680, fontSize: 50, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'slide-up', animDur: 0.3, startT: 0.4 },
                { type: 'text', text: '$2,000 – $4,500 / month', x: 540, y: 900, fontSize: 46, fontFamily: 'Arial Black, Impact, sans-serif', color: '#4ade80', align: 'center', maxWidth: 880, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.1 },
            ],
        },

        // ── SCENE 7 — #5: PILOT (~7 sec) ────────────────────────────
        {
            tts: {
                text:       'Number five. Commercial pilot or aviation manager. Two thousand five hundred to five thousand dollars a month — a genuinely rare, high-value skill.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.25,
            },
            transition: 'wipe-right', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'airline pilot cockpit uniform', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.15 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: '#5', x: 200, y: 260, fontSize: 130, fontFamily: 'Impact, Arial Black, sans-serif', color: '#2f7cf6', align: 'center', stroke: true, strokeColor: '#000000', strokeWidth: 6, glow: true, glowColor: '#2f7cf6', glowBlur: 26, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'COMMERCIAL\nPILOT', x: 540, y: 700, fontSize: 62, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'slide-up', animDur: 0.3, startT: 0.4 },
                { type: 'text', text: '$2,500 – $5,000 / month', x: 540, y: 900, fontSize: 46, fontFamily: 'Arial Black, Impact, sans-serif', color: '#4ade80', align: 'center', maxWidth: 880, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.1 },
            ],
        },

        // ── SCENE 8 — #4: CORPORATE LAWYER (~7 sec) ─────────────────
        {
            tts: {
                text:       'Number four. Corporate lawyer. Two thousand five hundred to five thousand dollars a month, especially handling mining and international contracts.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.25,
            },
            transition: 'wipe-left', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'corporate lawyer office suit', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'pan-up', kenBurnsAmount: 0.15 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: '#4', x: 200, y: 260, fontSize: 130, fontFamily: 'Impact, Arial Black, sans-serif', color: '#2f7cf6', align: 'center', stroke: true, strokeColor: '#000000', strokeWidth: 6, glow: true, glowColor: '#2f7cf6', glowBlur: 26, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'CORPORATE\nLAWYER', x: 540, y: 700, fontSize: 62, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'slide-up', animDur: 0.3, startT: 0.4 },
                { type: 'text', text: '$2,500 – $5,000 / month', x: 540, y: 900, fontSize: 46, fontFamily: 'Arial Black, Impact, sans-serif', color: '#4ade80', align: 'center', maxWidth: 880, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.1 },
            ],
        },

        // ── SCENE 9 — #3: MEDICAL SPECIALIST (~7 sec) ───────────────
        {
            tts: {
                text:       'Number three. Medical specialists — surgeons, anaesthetists. Three thousand to six thousand dollars a month, mostly in private practice.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.25,
            },
            transition: 'wipe-right', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'surgeon private hospital operating', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.15 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: '#3', x: 200, y: 260, fontSize: 130, fontFamily: 'Impact, Arial Black, sans-serif', color: '#2f7cf6', align: 'center', stroke: true, strokeColor: '#000000', strokeWidth: 6, glow: true, glowColor: '#2f7cf6', glowBlur: 26, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'MEDICAL\nSPECIALIST', x: 540, y: 700, fontSize: 62, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'slide-up', animDur: 0.3, startT: 0.4 },
                { type: 'text', text: '$3,000 – $6,000 / month', x: 540, y: 900, fontSize: 46, fontFamily: 'Arial Black, Impact, sans-serif', color: '#4ade80', align: 'center', maxWidth: 880, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.1 },
            ],
        },

        // ── SCENE 10 — #2: MINING EXECUTIVE (~7 sec) ────────────────
        {
            tts: {
                text:       'Number two. Mining company executive. Three thousand to eight thousand dollars a month, thanks to Zimbabwe\'s gold and lithium exports.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.25,
            },
            transition: 'wipe-left', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'gold lithium mine Zimbabwe', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'drift', kenBurnsAmount: 0.16 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: '#2', x: 200, y: 260, fontSize: 130, fontFamily: 'Impact, Arial Black, sans-serif', color: '#2f7cf6', align: 'center', stroke: true, strokeColor: '#000000', strokeWidth: 6, glow: true, glowColor: '#2f7cf6', glowBlur: 26, animation: 'pop', animDur: 0.3, startT: 0.1 },
                { type: 'text', text: 'MINING\nEXECUTIVE', x: 540, y: 700, fontSize: 62, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'slide-up', animDur: 0.3, startT: 0.4 },
                { type: 'text', text: '$3,000 – $8,000 / month', x: 540, y: 900, fontSize: 46, fontFamily: 'Arial Black, Impact, sans-serif', color: '#4ade80', align: 'center', maxWidth: 880, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.1 },
            ],
        },

        // ── SCENE 11 — #1: OWNING YOUR OWN BUSINESS (~10 sec) ───────
        {
            tts: {
                text:       'And number one — nothing on this list, beats owning your own business. No salary cap, no ceiling, income entirely under your control. It\'s not easy, it takes capital and risk. But it\'s the only job on this list with unlimited upside.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.4,
            },
            transition: 'zoom-cut', transitionDuration: 0.22,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'successful entrepreneur business owner Africa', source: 'serpapi', orientation: 'portrait', imageIndex: 0, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.16 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: '#1', x: 200, y: 240, fontSize: 150, fontFamily: 'Impact, Arial Black, sans-serif', color: '#f5c518', align: 'center', stroke: true, strokeColor: '#000000', strokeWidth: 7, glow: true, glowColor: '#f5c518', glowBlur: 34, animation: 'pop', animDur: 0.32, startT: 0.1 },
                { type: 'text', text: 'YOUR OWN\nBUSINESS', x: 540, y: 700, fontSize: 68, fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.2, gradient: ['#f5c518', '#ff8c00'], stroke: true, strokeColor: '#000000', strokeWidth: 5, glow: true, glowColor: '#f5c518', glowBlur: 24, animation: 'slide-up', animDur: 0.32, startT: 0.4 },
                { type: 'text', text: 'NO SALARY CAP.', x: 540, y: 900, fontSize: 48, fontFamily: 'Arial Black, Impact, sans-serif', color: '#4ade80', align: 'center', maxWidth: 880, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.3, startT: 1.2 },
            ],
        },

        // ── SCENE 12 — CLOSING + CTA (~8 sec) ────────────────────────
        {
            tts: {
                text:       'Which one surprised you most? Follow for more career and business content built for Zimbabwe.',
                speed:      0.95, emotion: 'neutral', pauseAfter: 0.4,
            },
            transition: 'zoom-cut', transitionDuration: 0.2,
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#2f7cf6', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'Harare Zimbabwe city skyline', source: 'serpapi', orientation: 'portrait', imageIndex: 1, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', kenBurns: 'zoom-out', kenBurnsAmount: 0.14 },
                { type: 'overlay', color: 'rgba(0,0,0,0.55)' },
                { type: 'text', text: 'WHICH ONE\nSURPRISED YOU?', x: 540, y: 460, fontSize: 60, fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 920, lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.3, startT: 0.2 },
                {
                    type:        'notification-card',
                    x:           540,
                    y:           1370,
                    width:       860,
                    title:       '🔔 Follow for more',
                    body:        'Career & business content for Zimbabwe',
                    bgColor:     'rgba(47,124,246,0.14)',
                    borderColor: '#2f7cf6',
                    titleColor:  '#2f7cf6',
                    bodyColor:   '#ffffff',
                    fontSize:    32,
                    bodySize:    26,
                    borderRadius:18,
                    animation:   'slide-up',
                    animDur:     0.32,
                    startT:      1.2,
                },
            ],
        },
    ],
};

module.exports = config;
