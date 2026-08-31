// config.examineai-marketing.js
// ExamineAI (books.co.zw) — 45s portrait marketing/promo video
//
// This is the crossover piece: Apex Engine (video generation) selling
// ExamineAI (the document studio + video-lesson platform), using two
// content sources side by side —
//   1. Real product footage: 'html-record' layers pointing straight at
//      the LIVE site (https://books.co.zw/...), so the video shows the
//      actual app, not a mockup.
//   2. ApexCasing templates: 'glass-stat-card', 'data-table' and
//      'social-post-mockup' from ./ApexCasing/, fed with ExamineAI's own
//      numbers/copy via layer.data — no HTML edited, only data passed.
//
// Run with:  VIDEO_CONFIG=config.examineai-marketing.js node engine-ci.js
// (or set the `config` input to this filename in the GitHub Actions workflow)

module.exports = {
    output: {
        title:   'examineai-books-co-zw-promo',
        format:  'portrait',
        fps:     30,
        crf:     23,
        preset:  'medium',
        bgMusic:    { mood: 'upbeat' },
        bgMusicVol: 0.10,
        postProcess: {
            grain:            true,
            grainStrength:    0.015,
            vignette:         true,
            vignetteStrength: 0.30,
        },
    },

    defaults: {
        voice:              'af_bella',   // bright, clear — upbeat product energy
        transition:         'fade',
        transitionDuration: 0.3,
    },

    scenes: [
        // ── Scene 1 — Hook ──────────────────────────────────────────
        {
            tts: {
                text: "Stuck bouncing between ten different sites for past papers, book PDFs, and video lessons? There's one place for all of it now.",
                voice: 'af_bella',
                emotion: 'excited',
                pauseAfter: 0.3,
            },
            captions: { style: 'pop', position: 'bottom', wordsPerChunk: 3, fontSize: 60 },
            layers: [
                {
                    type: 'gradient', gradientType: 'radial',
                    colors: ['#1a2a6c', '#0d1230', '#050614'],
                    vignette: true,
                },
                {
                    type: 'text', text: 'ONE APP.\nEVERY SUBJECT.', x: 540, y: 320,
                    fontSize: 78, fontFamily: 'Arial Black, sans-serif',
                    color: '#F8FAFC', align: 'center', hookLayer: true,
                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                    animation: 'pop', startT: 0.1, animDur: 0.5,
                },
                {
                    type: 'avatar', x: 540, y: 1400, size: 260,
                    expression: 'excited', motion: 'slide-in-bottom', enterDur: 0.5,
                    accentColor: '#2563eb', name: 'ExamineAI', nameColor: '#2563eb',
                },
            ],
        },

        // ── Scene 2 — Live product tour: the home dashboard ─────────
        {
            tts: {
                text: "This is ExamineAI, live now at books dot co dot zed dot double-u. It's a library, an AI agent, and a template studio — all in one login.",
                voice: 'af_bella',
                pauseAfter: 0.3,
            },
            captions: { style: 'fade', position: 'bottom', wordsPerChunk: 3, fontSize: 56 },
            layers: [
                {
                    type: 'html-record',
                    src: 'https://books.co.zw/',
                    duration: 8,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit: 'cover',
                    waitFor: '.choice-grid',
                    waitMs: 600,
                    cursor: { style: 'ring', color: '#2563eb', size: 34, glow: true },
                    interactions: [
                        { at: 1.2, action: 'scroll', y: 500, speed: 100, easing: 'ease-in-out' },
                        { at: 3.5, action: 'scroll', y: 950, speed: 100, easing: 'ease-in-out' },
                        { at: 6.0, action: 'scroll', y: 300, speed: 120, easing: 'ease-in-out' },
                    ],
                },
                {
                    type: 'text', text: 'books.co.zw', x: 540, y: 1740,
                    fontSize: 40, fontFamily: 'Manrope, Arial, sans-serif',
                    color: '#F8FAFC', align: 'center',
                    stroke: true, strokeColor: '#000', strokeWidth: 4,
                    animation: 'fade', startT: 0.2, animDur: 0.4,
                },
            ],
        },

        // ── Scene 3 — Quick stat card (ApexCasing) ───────────────────
        {
            tts: {
                text: 'Three tools built for students, in one place.',
                voice: 'af_bella', emotion: 'happy', pauseAfter: 0.2,
            },
            captions: false,
            layers: [
                {
                    type: 'html-record',
                    src: './ApexCasing/glass-stat-card.html?tag=examineai-3in1',
                    duration: 3.5,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit: 'cover',
                    waitFor: '[data-ready="1"]',
                    data: {
                        value: '3-in-1',
                        caption: 'Library + AI Agent + Templates',
                        gradientA: '#2563eb',
                        gradientB: '#7c5cff',
                    },
                },
            ],
        },

        // ── Scene 4 — Live product tour: Video Lessons ───────────────
        // (the video-lesson sector — the specific crossover point requested)
        {
            tts: {
                text: "Need a video lesson instead of a wall of text? Video Lessons are organised by subject and topic — open a folder, tap a lesson, and it plays instantly.",
                voice: 'af_bella', pauseAfter: 0.3,
            },
            captions: { style: 'fade', position: 'bottom', wordsPerChunk: 3, fontSize: 56 },
            layers: [
                {
                    type: 'html-record',
                    src: 'https://books.co.zw/views/video-lessons.html',
                    duration: 8,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit: 'cover',
                    waitFor: '#vid-list',
                    waitMs: 700,
                    cursor: { style: 'ring', color: '#f5c518', size: 34, glow: true },
                    interactions: [
                        { at: 1.5, action: 'scroll', y: 400, speed: 90, easing: 'ease-in-out' },
                        { at: 4.0, action: 'scroll', y: 800, speed: 100, easing: 'ease-in-out' },
                        { at: 6.5, action: 'scroll', y: 200, speed: 120, easing: 'ease-in-out' },
                    ],
                },
            ],
        },

        // ── Scene 5 — Before / After comparison (ApexCasing) ─────────
        {
            tts: {
                text: "Before, finding the right past paper or lesson meant hours of searching. With ExamineAI, it's instant — and your assignments and CVs get generated for you.",
                voice: 'af_bella', pauseAfter: 0.3,
            },
            captions: false,
            layers: [
                {
                    type: 'html-record',
                    src: './ApexCasing/data-table.html?tag=examineai-before-after',
                    duration: 7,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit: 'cover',
                    waitFor: '[data-ready="1"]',
                    data: {
                        title: 'BEFORE vs WITH EXAMINEAI',
                        columns: ['Before', 'ExamineAI'],
                        highlightColumn: 1,
                        rows: [
                            { label: 'Past papers & books', values: ['Hours of searching', 'check'] },
                            { label: 'Video lessons by topic', values: ['Scattered links', 'check'] },
                            { label: 'Assignments & CVs', values: ['From scratch', 'check'] },
                        ],
                    },
                },
            ],
        },

        // ── Scene 6 — Social proof (ApexCasing) ───────────────────────
        // NOTE: placeholder testimonial — swap in a real student quote
        // before publishing.
        {
            tts: {
                text: 'Students are already using it to study smarter, not longer.',
                voice: 'af_bella', emotion: 'happy', pauseAfter: 0.2,
            },
            captions: false,
            layers: [
                {
                    type: 'gradient', gradientType: 'linear',
                    colors: ['#0d1230', '#050614'],
                },
                {
                    type: 'html-record',
                    src: './ApexCasing/social-post-mockup.html?tag=examineai-testimonial',
                    duration: 4.5,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 300, width: 1080, height: 1320,
                    fit: 'contain',
                    waitFor: '[data-ready="1"]',
                    data: {
                        name: 'Tinotenda M.',
                        handle: '@tino_studies',
                        verified: false,
                        avatarInitials: 'TM',
                        avatarColor: '#2563eb',
                        text: "Found my whole Combined Science paper AND the video lesson for the topic I was stuck on, same app. books.co.zw is actually useful.",
                        timestamp: '3h',
                        likes: '214', reposts: '38', replies: '12',
                    },
                },
            ],
        },

        // ── Scene 7 — CTA / outro ─────────────────────────────────────
        {
            tts: {
                text: 'Books dot co dot zed dot double-u. Bookmark it — your whole study toolkit lives there now.',
                voice: 'af_bella', emotion: 'excited', pauseAfter: 0.2,
            },
            captions: { style: 'pop', position: 'bottom', wordsPerChunk: 3, fontSize: 58 },
            layers: [
                {
                    type: 'gradient', gradientType: 'radial',
                    colors: ['#2563eb', '#0d1230', '#050614'],
                    vignette: true,
                },
                {
                    type: 'text', text: 'books.co.zw', x: 540, y: 780,
                    fontSize: 84, fontFamily: 'Arial Black, sans-serif',
                    color: '#F8FAFC', align: 'center', hookLayer: true,
                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                    animation: 'pop', startT: 0.1, animDur: 0.5,
                },
                {
                    type: 'text', text: 'Library · AI Agent · Templates · Video Lessons', x: 540, y: 900,
                    fontSize: 34, color: 'rgba(255,255,255,0.85)', align: 'center',
                    animation: 'fade', startT: 0.4, animDur: 0.4,
                },
                {
                    type: 'avatar', x: 540, y: 1350, size: 280,
                    expression: 'excited', motion: 'bounce', enterDur: 0.5,
                    accentColor: '#f5c518', name: 'ExamineAI', nameColor: '#f5c518',
                },
            ],
        },
    ],
};