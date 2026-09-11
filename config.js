// config.get-rich-no-experience.js
// "How to Get Rich With No Experience and Zero Education"
// Voice: af_heart. Upbeat/motivational sound.
// 6 scenes: Hook → Mindset → Skill stacking → Online income →
//           Real assets → CTA
//
// Deliberately avoids generic "hustle" advice — uses specific,
// verifiable paths (skill-stacking from Seth Godin/Scott Adams
// framework, real asset classes). No false promises — framed as
// "how people actually do it" not "guaranteed results".
//
// RUN: VIDEO_CONFIG=config.get-rich-no-experience.js node engine-ci.js

module.exports = {
    output: {
        title: 'get-rich-no-experience',
        format: 'portrait',
        fps: 30, crf: 23, preset: 'medium',
        bgMusic: { search: 'motivational upbeat', mood: 'upbeat' },
        bgMusicVol: 0.16,
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
                text: "Most of the richest people in the world never finished a degree. And a lot of them started with nothing. Here's the exact roadmap that actually works — no degree, no experience, no connections required.",
                voice: 'af_heart',
                pauseAfter: 0.4,
            },
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#00e5ff', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 5,
            },
            layers: [
                {
                    layout: { type: 'stack', x: 0, y: 0, w: 1080, h: 1920 },
                    layers: [
                        {
                            type: 'stock-image-sequence',
                            queries: [
                                'successful young entrepreneur laptop money',
                                'person counting cash money success',
                                'young millionaire luxury car apartment',
                            ],
                            source: 'serpapi', fit: 'cover',
                            kenBurnsSequence: [
                                { kenBurns: 'zoom-in',   kenBurnsAmount: 0.32 },
                                { kenBurns: 'rotate-cw', kenBurnsAmount: 0.28, rotateDeg: 9 },
                                { kenBurns: 'pan-up',    kenBurnsAmount: 0.3 },
                            ],
                            x: 0, y: 0, width: 1080, height: 1920,
                        },
                        { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                        {
                            type: 'text',
                            text: 'HOW TO GET RICH\nWITH ZERO\nEDUCATION',
                            x: 540, y: 300,
                            fontSize: 76, fontFamily: 'Arial Black, sans-serif',
                            color: '#00e5ff', align: 'center', hookLayer: true,
                            stroke: true, strokeColor: '#000', strokeWidth: 6,
                        },
                        {
                            type: 'text', text: 'THE REAL ROADMAP',
                            x: 540, y: 580,
                            fontSize: 38, fontFamily: 'Arial Black, sans-serif',
                            color: '#ffffff', align: 'center',
                            stroke: true, strokeColor: '#000', strokeWidth: 3,
                        },
                    ],
                },
            ],
        },

        // ── Scene 2 — Mindset: Stop trading time for money ───────────────
        {
            tts: {
                text: "Step one: understand why a salary alone will never make you rich. A salary pays you for your time. Time is capped at twenty four hours a day. Rich people don't sell their time — they build things that make money while they sleep. That's the first shift you need to make.",
                voice: 'bf_lily',
                pauseAfter: 0.35,
            },
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#00e5ff', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 5,
            },
            sfx: 'dramatic', sfxAt: 0.2,
            layers: [
                {
                    layout: { type: 'stack', x: 0, y: 0, w: 1080, h: 1920 },
                    layers: [
                        {
                            type: 'stock-image-sequence',
                            queries: [
                                'clock time office worker stressed',
                                'passive income money growing plant',
                                'laptop money online working freedom',
                            ],
                            source: 'serpapi', fit: 'cover',
                            kenBurnsSequence: [
                                { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.28, rotateDeg: 9 },
                                { kenBurns: 'zoom-in',    kenBurnsAmount: 0.30 },
                                { kenBurns: 'pan-right',  kenBurnsAmount: 0.3 },
                            ],
                            x: 0, y: 0, width: 1080, height: 1920,
                        },
                        { type: 'overlay', color: 'rgba(0,0,0,0.48)' },
                        // Step badge
                        {
                            layout: { type: 'anchor', padding: [100, 40] },
                            layers: [
                                {
                                    type: 'text', text: 'STEP 1',
                                    anchorPoint: 'top-left',
                                    fontSize: 54, fontFamily: 'Arial Black, sans-serif',
                                    color: '#00e5ff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                            ],
                        },
                        // Main point card
                        {
                            layout: {
                                type: 'flex', direction: 'column',
                                x: 80, y: 1280, w: 920, h: 320,
                                gap: 20, align: 'flex-start',
                            },
                            layers: [
                                {
                                    type: 'text', text: 'STOP SELLING TIME',
                                    fontSize: 64, fontFamily: 'Arial Black, sans-serif',
                                    color: '#ffffff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                                {
                                    type: 'text', text: 'Salary = capped at 24hrs/day',
                                    fontSize: 38, fontFamily: 'Arial Black, sans-serif',
                                    color: '#00e5ff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 3,
                                },
                                {
                                    type: 'text', text: 'Build things that earn while you sleep',
                                    fontSize: 30, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(255,255,255,0.8)',
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        // ── Scene 3 — Skill stacking ──────────────────────────────────────
        {
            tts: {
                text: "Step two: skill stack. You don't need one genius skill. You need to be pretty good at three or four things that rarely combine. Someone who understands sales, knows basic design, and can write clearly is rare. Stack those, and you become very hard to replace — and very easy to hire at a premium.",
                voice: 'bf_lily',
                pauseAfter: 0.35,
            },
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#00e5ff', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 5,
            },
            sfx: 'rise', sfxAt: 0.3,
            layers: [
                {
                    layout: { type: 'stack', x: 0, y: 0, w: 1080, h: 1920 },
                    layers: [
                        {
                            type: 'stock-image-sequence',
                            queries: [
                                'person learning skills online course',
                                'freelancer working skills design laptop',
                                'copywriting sales training person',
                            ],
                            source: 'serpapi', fit: 'cover',
                            kenBurnsSequence: [
                                { kenBurns: 'pan-left',  kenBurnsAmount: 0.30 },
                                { kenBurns: 'rotate-cw', kenBurnsAmount: 0.28, rotateDeg: 8 },
                                { kenBurns: 'zoom-out',  kenBurnsAmount: 0.30 },
                            ],
                            x: 0, y: 0, width: 1080, height: 1920,
                        },
                        { type: 'overlay', color: 'rgba(0,0,0,0.46)' },
                        {
                            layout: { type: 'anchor', padding: [100, 40] },
                            layers: [
                                {
                                    type: 'text', text: 'STEP 2',
                                    anchorPoint: 'top-left',
                                    fontSize: 54, fontFamily: 'Arial Black, sans-serif',
                                    color: '#00e5ff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                            ],
                        },
                        {
                            layout: {
                                type: 'flex', direction: 'column',
                                x: 80, y: 1240, w: 920, h: 360,
                                gap: 18, align: 'flex-start',
                            },
                            layers: [
                                {
                                    type: 'text', text: 'SKILL STACK',
                                    fontSize: 72, fontFamily: 'Arial Black, sans-serif',
                                    color: '#ffffff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                                {
                                    type: 'text', text: 'Sales + Design + Writing = Rare',
                                    fontSize: 38, fontFamily: 'Arial Black, sans-serif',
                                    color: '#00e5ff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 3,
                                },
                                {
                                    type: 'text', text: 'Top 10% × Top 10% × Top 10% = Top 1%',
                                    fontSize: 30, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(255,255,255,0.8)',
                                },
                                {
                                    type: 'text', text: 'Freelance • Consulting • Your own product',
                                    fontSize: 28, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(0,229,255,0.65)',
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        // ── Scene 4 — Online income ───────────────────────────────────────
        {
            tts: {
                text: "Step three: use the internet to scale. The internet means you can sell to a million people the same way you sell to one. Drop-shipping, digital products, content creation, freelancing on Upwork or Fiverr — none of these require a degree. They require consistency and a bit of patience.",
                voice: 'bf_lily',
                pauseAfter: 0.35,
            },
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#00e5ff', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 5,
            },
            sfx: 'chime', sfxAt: 0.4,
            layers: [
                {
                    layout: { type: 'stack', x: 0, y: 0, w: 1080, h: 1920 },
                    layers: [
                        {
                            type: 'stock-image-sequence',
                            queries: [
                                'Fiverr Upwork freelancer laptop money',
                                'digital product online store ecommerce',
                                'content creator YouTube studio setup',
                                'dropshipping online business laptop',
                            ],
                            source: 'serpapi', fit: 'cover',
                            kenBurnsSequence: [
                                { kenBurns: 'zoom-in',    kenBurnsAmount: 0.30 },
                                { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.28, rotateDeg: 8 },
                                { kenBurns: 'pan-up',     kenBurnsAmount: 0.30 },
                                { kenBurns: 'rotate-cw',  kenBurnsAmount: 0.28, rotateDeg: 9 },
                            ],
                            x: 0, y: 0, width: 1080, height: 1920,
                        },
                        { type: 'overlay', color: 'rgba(0,0,0,0.46)' },
                        {
                            layout: { type: 'anchor', padding: [100, 40] },
                            layers: [
                                {
                                    type: 'text', text: 'STEP 3',
                                    anchorPoint: 'top-left',
                                    fontSize: 54, fontFamily: 'Arial Black, sans-serif',
                                    color: '#00e5ff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                            ],
                        },
                        {
                            layout: {
                                type: 'flex', direction: 'column',
                                x: 80, y: 1220, w: 920, h: 380,
                                gap: 16, align: 'flex-start',
                            },
                            layers: [
                                {
                                    type: 'text', text: 'USE THE INTERNET',
                                    fontSize: 64, fontFamily: 'Arial Black, sans-serif',
                                    color: '#ffffff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                                {
                                    type: 'text', text: '1 product → 1,000,000 buyers',
                                    fontSize: 40, fontFamily: 'Arial Black, sans-serif',
                                    color: '#00e5ff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 3,
                                },
                                {
                                    type: 'text', text: 'Freelancing • Digital products • Content',
                                    fontSize: 30, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(255,255,255,0.8)',
                                },
                                {
                                    type: 'text', text: 'Upwork • Fiverr • Gumroad • YouTube',
                                    fontSize: 28, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(0,229,255,0.65)',
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        // ── Scene 5 — Real assets ─────────────────────────────────────────
        {
            tts: {
                text: "Step four: buy real assets as soon as you can. Rich people own things — property, stocks, businesses. Poor people own liabilities — cars, TVs, things that lose value. The moment you earn more than you need, put the difference into something that grows. Time in the market beats timing the market, every time.",
                voice: 'bf_lily',
                pauseAfter: 0.35,
            },
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#00e5ff', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 5,
            },
            sfx: 'success', sfxAt: 0.5,
            layers: [
                {
                    layout: { type: 'stack', x: 0, y: 0, w: 1080, h: 1920 },
                    layers: [
                        {
                            type: 'stock-image-sequence',
                            queries: [
                                'stock market investment growth chart',
                                'real estate property investment Africa',
                                'business ownership entrepreneur handshake',
                            ],
                            source: 'serpapi', fit: 'cover',
                            kenBurnsSequence: [
                                { kenBurns: 'zoom-in',   kenBurnsAmount: 0.30 },
                                { kenBurns: 'rotate-cw', kenBurnsAmount: 0.28, rotateDeg: 9 },
                                { kenBurns: 'pan-left',  kenBurnsAmount: 0.30 },
                            ],
                            x: 0, y: 0, width: 1080, height: 1920,
                        },
                        { type: 'overlay', color: 'rgba(0,0,0,0.46)' },
                        {
                            layout: { type: 'anchor', padding: [100, 40] },
                            layers: [
                                {
                                    type: 'text', text: 'STEP 4',
                                    anchorPoint: 'top-left',
                                    fontSize: 54, fontFamily: 'Arial Black, sans-serif',
                                    color: '#00e5ff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                            ],
                        },
                        {
                            layout: {
                                type: 'flex', direction: 'column',
                                x: 80, y: 1240, w: 920, h: 360,
                                gap: 18, align: 'flex-start',
                            },
                            layers: [
                                {
                                    type: 'text', text: 'BUY REAL ASSETS',
                                    fontSize: 64, fontFamily: 'Arial Black, sans-serif',
                                    color: '#ffffff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                                {
                                    type: 'text', text: 'Own things that GROW in value',
                                    fontSize: 38, fontFamily: 'Arial Black, sans-serif',
                                    color: '#00e5ff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 3,
                                },
                                {
                                    type: 'text', text: 'Stocks • Property • Business equity',
                                    fontSize: 30, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(255,255,255,0.8)',
                                },
                                {
                                    type: 'text', text: 'Not cars. Not TVs. Not shoes.',
                                    fontSize: 28, fontFamily: 'Arial, sans-serif',
                                    color: 'rgba(255,100,100,0.85)',
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        // ── Scene 6 — CTA ─────────────────────────────────────────────────
        {
            tts: {
                text: "Mindset shift. Skill stack. Online income. Real assets. Four steps. No degree needed, no experience required. Just start. Follow for more money moves like this.",
                voice: 'bf_lily',
                pauseAfter: 0.5,
            },
            captions: {
                style: 'highlight', fontSize: 58, color: '#ffffff',
                highlightColor: '#00e5ff', wordsPerChunk: 3,
                strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 5,
            },
            sfx: 'rise', sfxAt: 0.1,
            layers: [
                {
                    layout: { type: 'stack', x: 0, y: 0, w: 1080, h: 1920 },
                    layers: [
                        {
                            type: 'stock-image-sequence',
                            queries: [
                                'success celebration money achievement',
                                'financial freedom travel luxury lifestyle',
                            ],
                            source: 'serpapi', fit: 'cover',
                            kenBurnsSequence: [
                                { kenBurns: 'zoom-in',   kenBurnsAmount: 0.32 },
                                { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.28, rotateDeg: 10 },
                            ],
                            x: 0, y: 0, width: 1080, height: 1920,
                        },
                        { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                        // Summary — top area
                        {
                            layout: {
                                type: 'flex', direction: 'column',
                                x: 80, y: 200, w: 920, h: 700,
                                gap: 22, align: 'flex-start',
                            },
                            layers: [
                                {
                                    type: 'text', text: 'THE 4 STEPS',
                                    fontSize: 68, fontFamily: 'Arial Black, sans-serif',
                                    color: '#00e5ff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 5,
                                },
                                {
                                    type: 'text', text: '1. STOP SELLING TIME',
                                    fontSize: 44, fontFamily: 'Arial Black, sans-serif',
                                    color: '#ffffff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 3,
                                },
                                {
                                    type: 'text', text: '2. SKILL STACK',
                                    fontSize: 44, fontFamily: 'Arial Black, sans-serif',
                                    color: '#ffffff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 3,
                                },
                                {
                                    type: 'text', text: '3. USE THE INTERNET',
                                    fontSize: 44, fontFamily: 'Arial Black, sans-serif',
                                    color: '#ffffff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 3,
                                },
                                {
                                    type: 'text', text: '4. BUY REAL ASSETS',
                                    fontSize: 44, fontFamily: 'Arial Black, sans-serif',
                                    color: '#ffffff',
                                    stroke: true, strokeColor: '#000', strokeWidth: 3,
                                },
                            ],
                        },
                        // CTA bottom
                        {
                            type: 'text',
                            text: 'NO DEGREE. NO EXCUSE.\nJUST START.',
                            x: 540, y: 1380,
                            fontSize: 64, fontFamily: 'Arial Black, sans-serif',
                            color: '#00e5ff', align: 'center',
                            stroke: true, strokeColor: '#000', strokeWidth: 5,
                        },
                        // Subscribe sticker
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