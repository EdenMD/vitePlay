/**
 * config.nursing-ep1-verified.js
 * 
 * Zimbabwe Nurse Trainee Coaching — Episode 1
 * Platform: books.co.zw (16:9 Landscape Embed)
 * Fully compliant with APEX Engine v2.6+ / V3 source code
 */

module.exports = {
    output: {
        title:  'nurse-interview-ep1',
        format: 'landscape',
        width:  1920,
        height: 1080,
        fps:    30,
        crf:    20,
        preset: 'medium',
        // Freesound search with automatic mood-track fallback
        bgMusic: {
            search: 'hospital ambient room clinical',
            mood:   'documentary',
        },
        bgMusicVol: 0.15,
        postProcess: {
            vignette: true,
            vignetteStrength: 0.35,
            grain: true,
            grainStrength: 0.02,
        },
    },

    defaults: {
        voice:              'bf_emma',
        speed:              1.0,
        transition:         'fade',
        transitionDuration: 0.35,
    },

    scenes: [
        // ══ SCENE 1: THE HOOK WITH LIVE EKG SVG & SFX ══════════════════════
        {
            tts: {
                text: "The first question in your Zimbabwean nursing interview will determine if you get accepted or eliminated: Why do you want to become a registered nurse?",
                voice: 'bf_emma',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            transitionSfx: 'whoosh',
            sfx: 'dramatic',
            sfxAt: 0.1,
            sfxVol: 0.5,
            captions: true,
            layers: [
                {
                    type: 'gradient',
                    gradientType: 'radial',
                    colors: ['#0f2338', '#07111c', '#02060a'],
                    vignette: true,
                    vignetteStrength: 0.6,
                },
                {
                    type: 'particles',
                    particleType: 'dust',
                    count: 30,
                    color: 'rgba(56, 189, 248, 0.25)',
                    speed: 0.4,
                },
                // Animated real-time EKG cardiac monitor path
                {
                    type: 'svg-draw',
                    x: 160, y: 760,
                    scale: 1.5,
                    drawDur: 2.2,
                    stagger: 0.1,
                    fillAfter: false,
                    paths: [
                        {
                            d: "M 0 0 L 250 0 L 280 -15 L 300 15 L 320 -120 L 350 70 L 370 -20 L 390 0 L 700 0 L 730 -15 L 750 15 L 770 -120 L 800 70 L 820 -20 L 840 0 L 1100 0",
                            stroke: '#38bdf8',
                            strokeWidth: 4,
                            lineCap: 'round',
                        },
                    ],
                },
                // Animated Medical Cross
                {
                    type: 'svg-draw',
                    x: 960, y: 320,
                    scale: 1.2,
                    drawDur: 1.5,
                    fillAfter: true,
                    paths: [
                        {
                            d: "M -25 -75 L 25 -75 L 25 -25 L 75 -25 L 75 25 L 25 25 L 25 75 L -25 75 L -25 25 L -75 25 L -75 -25 L -25 -25 Z",
                            stroke: '#38bdf8',
                            strokeWidth: 3,
                            fill: 'rgba(56, 189, 248, 0.12)',
                        },
                    ],
                },
                {
                    type: 'text',
                    text: 'BOOKS.CO.ZW \u2022 MOHCC INTERVIEW COACHING',
                    x: 100, y: 80,
                    fontSize: 22,
                    fontFamily: 'Arial, sans-serif',
                    color: '#38bdf8',
                    align: 'left',
                },
                {
                    type: 'neon-text',
                    text: 'THE ELIMINATOR QUESTION',
                    x: 960, y: 470,
                    fontSize: 56,
                    color: '#e0f2fe',
                    align: 'center',
                    glowLayers: 4,
                    glowSpread: 14,
                },
                {
                    type: 'text',
                    text: '"Why do you want to be a Nurse?"',
                    x: 960, y: 560,
                    fontSize: 72,
                    fontFamily: 'Impact, Arial Black',
                    color: '#ffffff',
                    align: 'center',
                    stroke: true,
                    strokeColor: '#000000',
                    strokeWidth: 4,
                    animation: 'pop',
                    startT: 0.4, animDur: 0.5,
                },
            ],
        },

        // ══ SCENE 2: DOSSIER AUDIT EXPLAINER (BUILT-IN APEXCASING) ═════════
        {
            tts: {
                text: "Hospital matrons at Parirenyatwa, Sally Mugabe, and Mpilo hear hundreds of scripted applicants every single day.",
                voice: 'bf_emma',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            transitionSfx: 'wipe',
            sfx: 'tension',
            sfxAt: 0.2,
            sfxVol: 0.4,
            captions: true,
            layers: [
                {
                    type: 'html-record',
                    src: './ApexCasing/dossier-audit-explainer-landscape.html',
                    data: {
                        caseTitle: 'MOHCC APPLICANT AUDIT // FILE #2026-NURSE',
                        stamp: 'EVALUATED',
                        commands: [
                            { type: 'label', text: 'PANEL REPORT: COMMON REJECTIONS', x: 180, y: 160, font: 'label' },
                            { type: 'redact', x: 200, y: 280, width: 680, height: 44, color: '#b3242f', label: 'GENERIC "PASSION" CLICHE' },
                            { type: 'pin', x: 1200, y: 180, label: 'CENTRAL HOSPITALS AUDITED' },
                            { type: 'meter', label: 'CANDIDATE REJECTION RATE', value: 92, max: 100, x: 1100, y: 340, unit: '%' },
                            {
                                type: 'ledgerLine',
                                items: [
                                    { text: 'Parirenyatwa Group of Hospitals', status: 'OVER-SUBSCRIBED' },
                                    { text: 'Sally Mugabe Central Hospital', status: 'HIGH RESILIENCE FOCUS' },
                                    { text: 'Mpilo Central Hospital', status: 'WARD WORK CAPACITY' },
                                ],
                                x: 180, y: 460,
                            },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    duration: 6.8,
                    fps: 30,
                    viewport: { width: 1920, height: 1080 },
                    x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
                },
            ],
        },

        // ══ SCENE 3: VALID DATA-TABLE COMPARISON ═══════════════════════════
        {
            tts: {
                text: "Saying you 'love helping sick people' gets you penalized. The panel needs to know you understand night duty, acute ward stress, and clinical accountability.",
                voice: 'bf_emma',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            transitionSfx: 'wipe',
            sfx: 'error',
            sfxAt: 0.1,
            sfxVol: 0.45,
            captions: true,
            layers: [
                {
                    type: 'html-record',
                    src: './ApexCasing/data-table.html',
                    data: {
                        title: 'APPLICANT EVALUATION MATRIX',
                        columns: ['What Gets Rejected', 'What Passes the Panel'],
                        highlightColumn: 1,
                        rows: [
                            { label: 'Motivation', values: ['"Always loved helping people"', 'Concrete catalyst event'] },
                            { label: 'Ward Labor', values: ['Ignores physical reality', 'Ready for 12hr night shifts'] },
                            { label: 'Public Health', values: ['No awareness of MoHCC goals', 'Commitment to district care'] },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    duration: 6.5,
                    fps: 30,
                    viewport: { width: 1920, height: 1080 },
                    x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
                },
            ],
        },

        // ══ SCENE 4: 3-PILLAR RECAP BOARD ══════════════════════════════════
        {
            tts: {
                text: "When answering, use the three pillars: the catalyst that proved your interest, proof of your physical and emotional stamina, and your commitment to Zimbabwean public healthcare.",
                voice: 'bf_emma',
                pauseAfter: 0.6,
            },
            transition: 'fade',
            transitionSfx: 'zoom',
            sfx: 'success',
            sfxAt: 0.2,
            sfxVol: 0.4,
            captions: true,
            layers: [
                {
                    type: 'html-record',
                    src: './ApexCasing/recap-board.html',
                    data: {
                        title: 'THE 3-PILLAR WINNING FORMULA',
                        items: [
                            { rank: 1, name: 'The Catalyst', stat: 'A real personal event that tested your resolve to serve patients' },
                            { rank: 2, name: 'Stamina & Discipline', stat: 'Proof you can handle long shifts, night duty, and ward pressure' },
                            { rank: 3, name: 'National Service', stat: 'Dedication to public clinics, district centers, and patient safety' },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    duration: 7.0,
                    fps: 30,
                    viewport: { width: 1920, height: 1080 },
                    x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
                },
            ],
        },

        // ══ SCENE 5: OUTRO WITH DUAL SVG PULSE & AUDIO WAVEFORM ═════════════
        {
            tts: {
                text: "Download the complete word-for-word interview answers and sample scenario questions right now on books.co.zw.",
                voice: 'bf_emma',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            sfx: 'notification',
            sfxAt: 0.1,
            sfxVol: 0.45,
            captions: true,
            layers: [
                {
                    type: 'gradient',
                    gradientType: 'radial',
                    colors: ['#0f2338', '#07111c', '#000000'],
                    vignette: true,
                    vignetteStrength: 0.55,
                },
                // Animated SVG Medical Cross
                {
                    type: 'svg-draw',
                    x: 960, y: 340,
                    scale: 1.0,
                    drawDur: 1.2,
                    fillAfter: true,
                    paths: [
                        {
                            d: "M -20 -60 L 20 -60 L 20 -20 L 60 -20 L 60 20 L 20 20 L 20 60 L -20 60 L -20 20 L -60 20 L -60 -20 L -20 -20 Z",
                            stroke: '#38bdf8',
                            strokeWidth: 3,
                            fill: '#0284c7',
                        },
                    ],
                },
                {
                    type: 'text',
                    text: 'COMPLETE STUDY GUIDES & SCRIPTS',
                    x: 960, y: 460,
                    fontSize: 28,
                    fontFamily: 'Arial, sans-serif',
                    color: '#94a3b8',
                    align: 'center',
                },
                {
                    type: 'neon-text',
                    text: 'books.co.zw',
                    x: 960, y: 550,
                    fontSize: 90,
                    color: '#38bdf8',
                    align: 'center',
                    glowLayers: 5,
                    glowSpread: 22,
                },
                {
                    type: 'text',
                    text: 'Next Episode: "Handling Difficult Relatives & Ward Ethical Conflicts"',
                    x: 960, y: 660,
                    fontSize: 26,
                    fontFamily: 'Arial, sans-serif',
                    color: '#e2e8f0',
                    align: 'center',
                    animation: 'fade',
                    startT: 0.4, animDur: 0.4,
                },
                {
                    type: 'waveform',
                    vizStyle: 'bars',
                    x: 260, y: 880,
                    width: 1400,
                    height: 60,
                    bars: 70,
                    color: '#38bdf8',
                },
            ],
        },
    ],
};
