// config.active-recall-study-method.js
// "The Study Method Top Zimbabwean Students Swear By" (Active Recall)
// Same series style as the CV/interview videos: paper-sticker casing,
// icon/sticker/draw-driven, no photo fetching, bm_lewis voice, same
// THEME for brand consistency.
//
// Run with:  VIDEO_CONFIG=config.active-recall-study-method.js node engine-ci.js

const THEME = { paper: '#f7f5ef', ink: '#1c1c1e', accent: '#e74c3c', accent2: '#27ae60', shadow: 'rgba(20,16,10,0.3)' };
const CASING = './ApexCasing/paper-sticker-explainer.html';

function casingLayer(tag, title, commands) {
    return {
        type: 'html-record', src: `${CASING}?tag=${tag}`, audioSync: true, cursor: false,
        waitFor: '[data-ready="1"]', fps: 30,
        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
        data: { title, theme: THEME, commands },
    };
}

module.exports = {
    output: { title: 'active-recall-study-method', format: 'portrait', fps: 30, crf: 22, preset: 'medium' },
    defaults: { voice: 'bm_lewis', transition: 'fade', transitionDuration: 0.3 },

    scenes: [

        // ══ HOOK ═══════════════════════════════════════════════════════
        {
            tts: { text: "The study method top Zimbabwean students swear by.", voice: 'bm_lewis', pauseAfter: 0.4 },
            captions: false,
            layers: [
                { type: 'background', color: THEME.paper },
                casingLayer('recall-hook', 'THE STUDY METHOD', [
                    { id: 'hook_icon', type: 'icon', icon: 'mdi:head-cog-outline', slot: 'banner-top', size: 150, bg: 'circle', color: THEME.accent2, trigger: { atSeconds: 0.1 } },
                    { id: 'hook_title', type: 'sticker', text: 'THE METHOD TOP\nSTUDENTS SWEAR BY', slot: 'banner-mid', size: 54, trigger: { afterId: 'hook_icon', offset: 0.3 } },
                    { id: 'hook_pz', type: 'panZoom', toScale: 1.15, toX: 0, toY: -60, duration: 1.0, trigger: { afterId: 'hook_title', offset: 0.3 } },
                ]),
            ],
        },

        // ══ ACTIVE RECALL vs REREADING ═════════════════════════════════
        {
            tts: { text: "It's called active recall, and it beats rereading notes every time.", voice: 'bm_lewis', pauseAfter: 0.3 },
            captions: false,
            layers: [
                { type: 'background', color: THEME.paper },
                casingLayer('recall-s1', 'ACTIVE RECALL', [
                    { id: 'reread_icon', type: 'icon', icon: 'mdi:book-open-page-variant-outline', slot: 'mid-left', size: 180, color: THEME.accent, trigger: { wordText: 'rereading', occurrence: 1 } },
                    { id: 'reread_x', type: 'icon', icon: 'mdi:close-circle', slot: 'top-left', size: 70, color: THEME.accent, trigger: { afterId: 'reread_icon', offset: 0.1 } },
                    { id: 'arrow1', type: 'arrow', x1: 260, y1: 560, x2: 780, y2: 560, curve: -30, color: THEME.ink, trigger: { wordText: 'active', occurrence: 1 } },
                    { id: 'recall_icon', type: 'icon', icon: 'mdi:head-lightbulb-outline', slot: 'mid-right', size: 190, bg: 'circle', color: THEME.accent2, trigger: { afterId: 'arrow1', offset: 0.15 } },
                    { id: 'recall_check', type: 'icon', icon: 'mdi:check-circle', slot: 'top-right', size: 70, color: THEME.accent2, trigger: { afterId: 'recall_icon', offset: 0.1 } },
                    { id: 'label1', type: 'label', text: 'active recall beats\nrereading, every time', slot: 'low-center', size: 34, trigger: { wordText: 'time', occurrence: 1 } },
                    { id: 'pz_out1', type: 'panZoom', toScale: 1, toX: 0, toY: 0, duration: 1.0, trigger: { afterId: 'label1', offset: 0.3 } },
                ]),
            ],
        },

        // ══ THE TECHNIQUE — close the book, write, check the gap ════════
        {
            tts: { text: "Instead of reading a chapter over and over, close the book and try to write down everything you remember. Then check what you missed. That gap is exactly what you need to study next.", voice: 'bm_lewis', pauseAfter: 0.4 },
            captions: false,
            layers: [
                { type: 'background', color: THEME.paper },
                casingLayer('recall-s2', 'HOW IT WORKS', [
                    { id: 'book_icon', type: 'icon', icon: 'mdi:book-closed-variant', slot: 'mid-left', size: 180, color: THEME.ink, trigger: { wordText: 'book', occurrence: 1 } },
                    { id: 'pz1', type: 'panZoom', toScale: 1.4, toX: -30, toY: -30, duration: 0.9, trigger: { afterId: 'book_icon', offset: 0.15 } },
                    { id: 'write_icon', type: 'icon', icon: 'mdi:pencil-outline', slot: 'mid-right', size: 180, bg: 'circle', color: THEME.accent2, trigger: { wordText: 'write', occurrence: 1 } },
                    { id: 'pz2', type: 'panZoom', toScale: 1.4, toX: 30, toY: -30, duration: 0.9, trigger: { afterId: 'write_icon', offset: 0.15 } },
                    { id: 'gap_icon', type: 'icon', icon: 'mdi:magnify-scan', slot: 'low-center', size: 170, color: THEME.accent, trigger: { wordText: 'missed', occurrence: 1 } },
                    { id: 'gap_label', type: 'label', text: 'the gap is exactly what\nyou need to study next', slot: 'banner-low', size: 32, trigger: { afterId: 'gap_icon', offset: 0.2 } },
                    { id: 'pz_out2', type: 'panZoom', toScale: 1, toX: 0, toY: 0, duration: 1.1, trigger: { afterId: 'gap_label', offset: 0.3 } },
                ]),
            ],
        },

        // ══ SPACED REPETITION — mini timeline ═══════════════════════════
        {
            tts: { text: "Pair it with spaced repetition. Review a topic today, then again in three days, then again in a week. Your brain holds onto information far longer this way than cramming the night before.", voice: 'bm_lewis', pauseAfter: 0.4 },
            captions: false,
            layers: [
                { type: 'background', color: THEME.paper },
                casingLayer('recall-s3', 'SPACED REPETITION', [
                    { id: 'sr_icon', type: 'icon', icon: 'mdi:calendar-refresh-outline', slot: 'banner-top', size: 120, bg: 'circle', color: THEME.accent2, trigger: { atSeconds: 0 } },
                    { id: 'sr_title', type: 'sticker', text: 'SPACED REPETITION', slot: 'top-center', size: 42, trigger: { wordText: 'repetition', occurrence: 1 } },
                    { id: 't1', type: 'sticker', text: 'TODAY', slot: 'mid-left', size: 40, bg: '#ffffff', trigger: { wordText: 'today', occurrence: 1 } },
                    { id: 'arrow_t1', type: 'arrow', x1: 340, y1: 511, x2: 460, y2: 511, curve: 0, color: THEME.ink, trigger: { afterId: 't1', offset: 0.1 } },
                    { id: 't2', type: 'sticker', text: '+3 DAYS', slot: 'mid-center', size: 40, bg: '#ffffff', trigger: { wordText: 'three', occurrence: 1 } },
                    { id: 'arrow_t2', type: 'arrow', x1: 700, y1: 511, x2: 820, y2: 511, curve: 0, color: THEME.ink, trigger: { afterId: 't2', offset: 0.1 } },
                    { id: 't3', type: 'sticker', text: '+1 WEEK', slot: 'mid-right', size: 40, bg: '#ffffff', trigger: { wordText: 'week', occurrence: 1 } },
                    { id: 'brain_label', type: 'label', text: 'your brain holds on far longer\nthan cramming the night before', slot: 'banner-low', size: 32, trigger: { wordText: 'cramming', occurrence: 1 } },
                    { id: 'pz_out3', type: 'panZoom', toScale: 1.1, toX: 0, toY: -20, duration: 1.1, trigger: { afterId: 'brain_label', offset: 0.3 } },
                ]),
            ],
        },

        // ══ CLOSING — harder now, works better ═══════════════════════════
        {
            tts: { text: "It feels harder than passive reading. That's exactly why it works better.", voice: 'bm_lewis', pauseAfter: 0.4 },
            captions: false,
            layers: [
                { type: 'background', color: THEME.paper },
                casingLayer('recall-close', 'HARDER = BETTER', [
                    { id: 'hard_icon', type: 'icon', icon: 'mdi:weight-lifter', slot: 'mid-center', size: 220, bg: 'circle', color: THEME.accent2, trigger: { wordText: 'harder', occurrence: 1 } },
                    { id: 'hard_pz', type: 'panZoom', toScale: 1.4, toX: 0, toY: -30, duration: 1.0, trigger: { afterId: 'hard_icon', offset: 0.2 } },
                    { id: 'hard_label', type: 'sticker', text: 'HARDER NOW.\nBETTER LATER.', slot: 'low-center', size: 50, color: THEME.accent2, trigger: { wordText: 'better', occurrence: 1 } },
                    { id: 'pz_final', type: 'panZoom', toScale: 1, toX: 0, toY: 0, duration: 1.0, trigger: { afterId: 'hard_label', offset: 0.4 } },
                ]),
            ],
        },

    ],
};