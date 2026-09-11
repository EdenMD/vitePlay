// config.top5-jobs-zimbabwe.js
// "Top 5 Highest Paying Jobs in Zimbabwe"
// Voice: af_heart. Sound: corporate/success background.
// Uses stock-image-sequence per scene with kenBurnsSequence (rotate-cw/ccw
// mixed in). Layout system keeps text layers clean — no overlaps.
// 6 scenes: Hook → #5 → #4 → #3 → #2 → #1
//
// Salary figures sourced from Campus Cybercafe 2026 guide, MaxisHR 2026
// salary survey, and Quora benchmark data. USD figures used throughout
// since Zimbabwe's economy is USD-denominated at the top end.
//
// RUN: VIDEO_CONFIG=config.top5-jobs-zimbabwe.js node engine-ci.js

module.exports = {
    output: {
        title: 'top5-jobs-zimbabwe',
        format: 'portrait',
        fps: 30, crf: 23, preset: 'medium',
        bgMusic: { search: 'corporate success', mood: 'corporate' },
        bgMusicVol: 0.18,
    },

    defaults: {
        voice: 'bf_lily',
        transition: 'fade',
        transitionDuration: 0.3,
    },

    scenes: [

        // ── Scene 1 — Hook ────────────────────────────────────────────────
        {
            tts: {
                text: "Zimbabwe's job market is changing fast. But some careers have always paid top dollar, and most people have no idea which ones. Here are the top five highest paying jobs in Zimbabwe right now.",
                voice: 'bf_lily',
                pauseAfter: 0.4,
            },
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 5,
            },
            layers: [
                {
                    layout: { type: 'stack', x: 0, y: 0, w: 1080, h: 1920 },
                    layers: [
                        {
                            type: 'stock-image-sequence',
                            queries: [
                                'Harare Zimbabwe city skyline',
                                'Zimbabwe business district professionals',
                                'Africa corporate office meeting',
                            ],
                            source: 'serpapi', fit: 'cover',
                            kenBurnsSequence: [
                                { kenBurns: 'zoom-in',   kenBurnsAmount: 0.32 },
                                { kenBurns: 'rotate-cw', kenBurnsAmount: 0.3, rotateDeg: 10 },
                                { kenBurns: 'pan-up',    kenBurnsAmount: 0.3 },
                            ],
                            x: 0, y: 0, width: 1080, height: 1920,
                        },
                        { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
                        {
                            type: 'text',
                            text: 'TOP 5 HIGHEST\nPAYING JOBS\nIN ZIMBABWE',
                            x: 540, y: 320,
                            fontSize: 72, fontFamily: 'Arial Black, sans-serif',
                            color: '#f5c518', align: 'center', hookLayer: true,
                            stroke: true, strokeColor: '#000', strokeWidth: 6,
                        },
                        {
                            type: 'text', text: '🇿🇼 2026 SALARY GUIDE',
                            x: 540, y: 560,
                            fontSize: 38, fontFamily: 'Arial Black, sans-serif',
                            color: '#ffffff', align: 'center',
                            stroke: true, strokeColor: '#000', strokeWidth: 3,
                        },
                    ],
                },
            ],
        },

        // ── Scene 2 — #5: ICT Director ($2,500–$4,000/mo) ────────────────
        {
            tts: {
                text: "Number five: ICT Director. As Zimbabwe's tech sector grows, senior technology executives are commanding between two thousand five hundred and four thousand US dollars per month. Companies like Econet and major banks are driving this demand hard.",
                voice: 'bf_lily',
                pauseAfter: 0.35,
            },
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 5,
            },
            sfx: 'notification', sfxAt: 0.3,
            layers: [
                {
                    layout: { type: 'stack', x: 0, y: 0, w: 1080, h: 1920 },
                    layers: [
                        {
                            type: 'stock-image-sequence',
                            queries: [
                                'technology executive office server room',
                                'ICT director Africa tech company',
                                'software engineers Africa office',
                            ],
                            source: 'serpapi', fit: 'cover',
                            kenBurnsSequence: [
                                { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 9 },
                                { kenBurns: 'zoom-in',    kenBurnsAmount: 0.32 },
                                { kenBurns: 'pan-left',   kenBurnsAmount: 0.3 },
                            ],
                            x: 0, y: 0, width: 1080, height: 1920,
                        },
                        { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                        // Rank badge — top left
                        {
                            layout: {
                                type: 'anchor',
                                padding: [100, 40],
                            },
                            layers: [
                                {
                                    type: 'text', text: '#5',
                                    anchorPoint: 'top-left',
                                    fontSize: 90, fontFamily: 'Arial Black, sans-serif',
                                    color: '#f5c518',
                                    stroke: true, strokeColor: '#000', strokeWidth: 6,
                                },
                            ],
                        },
                        // Job title + salary card — bottom
                        {
                            layout: {
                                type: 'flex',
                                direction: 'column',
                                x: 80, y: 1340, w: 920, h: 260,
                                gap: 18, align: 'flex-start',
                            },
                            layers: [
                                {
                                    type: 'text', text: 'ICT DIRECTOR',
                                    fontSize: 68, fontFamily: 'Arial Black, sans-serif',
                                    color: '#ffffff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                                {
                                    type: 'text', text: '$2,500 – $4,000 / month',
                                    fontSize: 44, fontFamily: 'Arial Black, sans-serif',
                                    color: '#f5c518',
                                    stroke: true, strokeColor: '#000', strokeWidth: 3,
                                },
                                {
                                    type: 'text', text: 'Econet • CBZ • Stanbic • FBC',
                                    fontSize: 32, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(255,255,255,0.75)',
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        // ── Scene 3 — #4: Corporate Lawyer ($3,000–$5,000/mo) ────────────
        {
            tts: {
                text: "Number four: Corporate Lawyer. Zimbabwe's mining boom, foreign investment deals, and growing financial sector mean top corporate lawyers are earning between three thousand and five thousand dollars a month — sometimes even more in private practice.",
                voice: 'bf_lily',
                pauseAfter: 0.35,
            },
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 5,
            },
            sfx: 'notification', sfxAt: 0.3,
            layers: [
                {
                    layout: { type: 'stack', x: 0, y: 0, w: 1080, h: 1920 },
                    layers: [
                        {
                            type: 'stock-image-sequence',
                            queries: [
                                'corporate lawyer office suit Africa',
                                'legal documents courtroom professional',
                                'Zimbabwe law firm business meeting',
                            ],
                            source: 'serpapi', fit: 'cover',
                            kenBurnsSequence: [
                                { kenBurns: 'zoom-in',   kenBurnsAmount: 0.30 },
                                { kenBurns: 'rotate-cw', kenBurnsAmount: 0.3, rotateDeg: 8 },
                                { kenBurns: 'pan-right', kenBurnsAmount: 0.3 },
                            ],
                            x: 0, y: 0, width: 1080, height: 1920,
                        },
                        { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                        {
                            layout: { type: 'anchor', padding: [100, 40] },
                            layers: [
                                {
                                    type: 'text', text: '#4',
                                    anchorPoint: 'top-left',
                                    fontSize: 90, fontFamily: 'Arial Black, sans-serif',
                                    color: '#f5c518',
                                    stroke: true, strokeColor: '#000', strokeWidth: 6,
                                },
                            ],
                        },
                        {
                            layout: {
                                type: 'flex', direction: 'column',
                                x: 80, y: 1340, w: 920, h: 260,
                                gap: 18, align: 'flex-start',
                            },
                            layers: [
                                {
                                    type: 'text', text: 'CORPORATE LAWYER',
                                    fontSize: 60, fontFamily: 'Arial Black, sans-serif',
                                    color: '#ffffff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                                {
                                    type: 'text', text: '$3,000 – $5,000 / month',
                                    fontSize: 44, fontFamily: 'Arial Black, sans-serif',
                                    color: '#f5c518',
                                    stroke: true, strokeColor: '#000', strokeWidth: 3,
                                },
                                {
                                    type: 'text', text: 'Mining deals • M&A • Foreign investment',
                                    fontSize: 32, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(255,255,255,0.75)',
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        // ── Scene 4 — #3: Commercial Pilot ($4,000–$7,000/mo) ────────────
        {
            tts: {
                text: "Number three: Commercial Pilot. With Air Zimbabwe and regional carriers operating across Southern Africa, experienced pilots are earning between four thousand and seven thousand US dollars per month — one of the few careers where the dollar salary is non-negotiable.",
                voice: 'bf_lily',
                pauseAfter: 0.35,
            },
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 5,
            },
            sfx: 'rise', sfxAt: 0.2,
            layers: [
                {
                    layout: { type: 'stack', x: 0, y: 0, w: 1080, h: 1920 },
                    layers: [
                        {
                            type: 'stock-image-sequence',
                            queries: [
                                'commercial pilot cockpit aircraft',
                                'airplane flying Africa sky clouds',
                                'pilot uniform African airline',
                            ],
                            source: 'serpapi', fit: 'cover',
                            kenBurnsSequence: [
                                { kenBurns: 'pan-up',     kenBurnsAmount: 0.32 },
                                { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10 },
                                { kenBurns: 'zoom-out',   kenBurnsAmount: 0.30 },
                            ],
                            x: 0, y: 0, width: 1080, height: 1920,
                        },
                        { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                        {
                            layout: { type: 'anchor', padding: [100, 40] },
                            layers: [
                                {
                                    type: 'text', text: '#3',
                                    anchorPoint: 'top-left',
                                    fontSize: 90, fontFamily: 'Arial Black, sans-serif',
                                    color: '#f5c518',
                                    stroke: true, strokeColor: '#000', strokeWidth: 6,
                                },
                            ],
                        },
                        {
                            layout: {
                                type: 'flex', direction: 'column',
                                x: 80, y: 1340, w: 920, h: 260,
                                gap: 18, align: 'flex-start',
                            },
                            layers: [
                                {
                                    type: 'text', text: 'COMMERCIAL PILOT',
                                    fontSize: 60, fontFamily: 'Arial Black, sans-serif',
                                    color: '#ffffff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                                {
                                    type: 'text', text: '$4,000 – $7,000 / month',
                                    fontSize: 44, fontFamily: 'Arial Black, sans-serif',
                                    color: '#f5c518',
                                    stroke: true, strokeColor: '#000', strokeWidth: 3,
                                },
                                {
                                    type: 'text', text: 'Air Zimbabwe • Fastjet • Regional carriers',
                                    fontSize: 32, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(255,255,255,0.75)',
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        // ── Scene 5 — #2: Mining Engineer ($5,000–$10,000/mo) ────────────
        {
            tts: {
                text: "Number two: Mining Engineer. Zimbabwe sits on some of the world's largest lithium and platinum deposits. Mine managers and engineers working for companies like Zimplats, Bikita Minerals, and Caledonia are pulling between five thousand and ten thousand US dollars a month — often with housing on top.",
                voice: 'bf_lily',
                pauseAfter: 0.35,
            },
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 5,
            },
            sfx: 'impact', sfxAt: 0.3,
            layers: [
                {
                    layout: { type: 'stack', x: 0, y: 0, w: 1080, h: 1920 },
                    layers: [
                        {
                            type: 'stock-image-sequence',
                            queries: [
                                'Zimbabwe lithium platinum mine aerial',
                                'mining engineer Africa hard hat',
                                'gold mine underground workers',
                                'mining equipment open pit Africa',
                            ],
                            source: 'serpapi', fit: 'cover',
                            kenBurnsSequence: [
                                { kenBurns: 'rotate-cw',  kenBurnsAmount: 0.3, rotateDeg: 9 },
                                { kenBurns: 'zoom-in',    kenBurnsAmount: 0.32 },
                                { kenBurns: 'pan-down',   kenBurnsAmount: 0.3 },
                                { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 8 },
                            ],
                            x: 0, y: 0, width: 1080, height: 1920,
                        },
                        { type: 'overlay', color: 'rgba(0,0,0,0.42)' },
                        {
                            layout: { type: 'anchor', padding: [100, 40] },
                            layers: [
                                {
                                    type: 'text', text: '#2',
                                    anchorPoint: 'top-left',
                                    fontSize: 90, fontFamily: 'Arial Black, sans-serif',
                                    color: '#f5c518',
                                    stroke: true, strokeColor: '#000', strokeWidth: 6,
                                },
                            ],
                        },
                        {
                            layout: {
                                type: 'flex', direction: 'column',
                                x: 80, y: 1300, w: 920, h: 300,
                                gap: 16, align: 'flex-start',
                            },
                            layers: [
                                {
                                    type: 'text', text: 'MINING ENGINEER',
                                    fontSize: 62, fontFamily: 'Arial Black, sans-serif',
                                    color: '#ffffff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                                {
                                    type: 'text', text: '$5,000 – $10,000 / month',
                                    fontSize: 44, fontFamily: 'Arial Black, sans-serif',
                                    color: '#f5c518',
                                    stroke: true, strokeColor: '#000', strokeWidth: 3,
                                },
                                {
                                    type: 'text', text: 'Zimplats • Bikita Minerals • Caledonia',
                                    fontSize: 32, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(255,255,255,0.75)',
                                },
                                {
                                    type: 'text', text: 'Lithium • Platinum • Gold • Chrome',
                                    fontSize: 28, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(255,221,0,0.65)',
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        // ── Scene 6 — #1: Medical Specialist ($6,000–$15,000/mo) ─────────
        {
            tts: {
                text: "And number one: Medical Specialist. Surgeons, anaesthetists, and specialist physicians working in Zimbabwe's private hospitals are the highest paid professionals in the country. Top earners in private practice are making between six thousand and fifteen thousand US dollars a month. That's the number one spot. Like and subscribe for more.",
                voice: 'af_heart',
                pauseAfter: 0.5,
            },
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#f5c518', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 5,
            },
            sfx: 'success', sfxAt: 0.3,
            layers: [
                {
                    layout: { type: 'stack', x: 0, y: 0, w: 1080, h: 1920 },
                    layers: [
                        {
                            type: 'stock-image-sequence',
                            queries: [
                                'surgeon operating theater Africa hospital',
                                'doctor specialist medical professional Africa',
                                'private hospital Zimbabwe modern',
                                'medical team surgery anaesthetist',
                            ],
                            source: 'serpapi', fit: 'cover',
                            kenBurnsSequence: [
                                { kenBurns: 'zoom-in',   kenBurnsAmount: 0.32 },
                                { kenBurns: 'rotate-cw', kenBurnsAmount: 0.3, rotateDeg: 10 },
                                { kenBurns: 'pan-up',    kenBurnsAmount: 0.3 },
                                { kenBurns: 'zoom-out',  kenBurnsAmount: 0.30 },
                            ],
                            x: 0, y: 0, width: 1080, height: 1920,
                        },
                        { type: 'overlay', color: 'rgba(0,0,0,0.42)' },
                        {
                            layout: { type: 'anchor', padding: [100, 40] },
                            layers: [
                                {
                                    type: 'text', text: '#1 🏆',
                                    anchorPoint: 'top-left',
                                    fontSize: 80, fontFamily: 'Arial Black, sans-serif',
                                    color: '#f5c518',
                                    stroke: true, strokeColor: '#000', strokeWidth: 6,
                                },
                            ],
                        },
                        {
                            layout: {
                                type: 'flex', direction: 'column',
                                x: 80, y: 1260, w: 920, h: 340,
                                gap: 16, align: 'flex-start',
                            },
                            layers: [
                                {
                                    type: 'text', text: 'MEDICAL SPECIALIST',
                                    fontSize: 58, fontFamily: 'Arial Black, sans-serif',
                                    color: '#ffffff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                                {
                                    type: 'text', text: '$6,000 – $15,000 / month',
                                    fontSize: 44, fontFamily: 'Arial Black, sans-serif',
                                    color: '#f5c518',
                                    stroke: true, strokeColor: '#000', strokeWidth: 3,
                                },
                                {
                                    type: 'text', text: 'Surgeon • Anaesthetist • Specialist Physician',
                                    fontSize: 30, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(255,255,255,0.75)',
                                },
                                {
                                    type: 'text', text: 'Avenues • Parirenyatwa • Mount Pleasant',
                                    fontSize: 28, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(255,221,0,0.65)',
                                },
                            ],
                        },
                        // Giphy subscribe sticker
                        {
                            type: 'giphy',
                            query: 'like and subscribe',
                            sticker: true, resultIndex: 0,
                            x: 880, y: 120, width: 280, height: 280,
                            fit: 'contain',
                        },
                    ],
                },
            ],
        },

    ],
};