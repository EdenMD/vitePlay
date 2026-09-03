// config.3-cv-mistakes.js
// "3 CV Mistakes That Get You Rejected Instantly" — script used exactly
// as given, split into 5 scenes matching its own paragraph breaks.
//
// VISUALS: paper-sticker-explainer.html casing, icon/sticker/draw-driven
// — no photo fetching at all. A generic "bad selfie" or "good CV" stock
// photo wouldn't actually illustrate these specific points well, and
// this keeps the render fast and 100% reliable (nothing to fail to
// load) for a short, simple video that doesn't need it. Scene 4 (duties
// vs. results) uses a cross/check icon pair with an arrow between them,
// same comparison-beat pattern as the earlier humanoid-robots hands
// scene, since that's the one place a visual contrast genuinely helps.
//
// VOICE: bm_lewis — "crisp, professional," built for factual/advice
// content, not the documentary bm_george default used elsewhere.
//
// panZoom kept moderate (scale ~1.5-1.8) rather than the harder
// 2.2-2.6 zooms used in earlier configs — no prior convention to match
// here, and a career-advice explainer doesn't call for aggressive
// camera movement the way a dramatic reveal does.
//
// No bgMusic — the script doesn't call for one and this is a clean,
// professional tips format; easy to add a mood track later if wanted.
//
// Run with:  VIDEO_CONFIG=config.3-cv-mistakes.js node engine-ci.js

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
    output: { title: '3-cv-mistakes-rejected', format: 'portrait', fps: 30, crf: 22, preset: 'medium' },
    defaults: { voice: 'bm_lewis', transition: 'fade', transitionDuration: 0.3 },

    scenes: [

        // ══ HOOK ═══════════════════════════════════════════════════════
        {
            tts: { text: "3 CV mistakes that get you rejected instantly.", voice: 'bm_lewis', pauseAfter: 0.4 },
            captions: false,
            layers: [
                { type: 'background', color: THEME.paper },
                casingLayer('cv-hook', 'CV MISTAKES', [
                    { id: 'hook_num', type: 'sticker', text: '3', slot: 'banner-top', size: 160, color: THEME.accent, trigger: { atSeconds: 0.1 } },
                    { id: 'hook_title', type: 'sticker', text: 'CV MISTAKES THAT\nGET YOU REJECTED\nINSTANTLY', slot: 'banner-mid', size: 58, trigger: { afterId: 'hook_num', offset: 0.3 } },
                    { id: 'hook_pz', type: 'panZoom', toScale: 1.15, toX: 0, toY: -60, duration: 1.0, trigger: { afterId: 'hook_title', offset: 0.3 } },
                ]),
            ],
        },

        // ══ MISTAKE 1 — the photo ══════════════════════════════════════
        {
            tts: { text: "Number one. A photo that looks like it was taken for a school ID. Zimbabwean employers see hundreds of CVs a week. A blurry selfie tells them you didn't take this seriously.", voice: 'bm_lewis', pauseAfter: 0.3 },
            captions: false,
            layers: [
                { type: 'background', color: THEME.paper },
                casingLayer('cv-m1', 'MISTAKE #1', [
                    { id: 'm1_badge', type: 'sticker', text: '#1', slot: 'top-left', size: 70, color: '#ffffff', bg: THEME.accent, trigger: { atSeconds: 0.1 } },
                    { id: 'm1_icon', type: 'icon', icon: 'mdi:account-box-outline', slot: 'mid-center', size: 220, bg: 'circle', color: THEME.accent, trigger: { wordText: 'photo', occurrence: 1 } },
                    { id: 'm1_pz', type: 'panZoom', toScale: 1.6, toX: -30, toY: -40, duration: 0.9, trigger: { afterId: 'm1_icon', offset: 0.1 } },
                    { id: 'm1_x', type: 'icon', icon: 'mdi:close-circle', slot: 'mid-right', size: 90, color: THEME.accent, trigger: { wordText: 'school', occurrence: 1 } },
                    { id: 'm1_label', type: 'label', text: 'hundreds of CVs a week —\nfirst impressions matter', slot: 'low-center', size: 34, trigger: { wordText: 'hundreds', occurrence: 1 } },
                    { id: 'm1_pz_out', type: 'panZoom', toScale: 1, toX: 0, toY: 0, duration: 1.0, trigger: { wordText: 'seriously', occurrence: 1 } },
                ]),
            ],
        },

        // ══ MISTAKE 2 — no summary ═════════════════════════════════════
        {
            tts: { text: "Number two. No summary at the top. If a recruiter has to read your whole CV to figure out who you are, they've already moved on to the next one.", voice: 'bm_lewis', pauseAfter: 0.3 },
            captions: false,
            layers: [
                { type: 'background', color: THEME.paper },
                casingLayer('cv-m2', 'MISTAKE #2', [
                    { id: 'm2_badge', type: 'sticker', text: '#2', slot: 'top-left', size: 70, color: '#ffffff', bg: THEME.accent, trigger: { atSeconds: 0.1 } },
                    { id: 'm2_icon', type: 'icon', icon: 'mdi:file-document-remove-outline', slot: 'mid-center', size: 220, bg: 'circle', color: THEME.accent, trigger: { wordText: 'summary', occurrence: 1 } },
                    { id: 'm2_pz', type: 'panZoom', toScale: 1.6, toX: 30, toY: -40, duration: 0.9, trigger: { afterId: 'm2_icon', offset: 0.1 } },
                    { id: 'm2_label', type: 'label', text: 'no summary = the recruiter\nmoves on to the next CV', slot: 'low-center', size: 34, trigger: { wordText: 'recruiter', occurrence: 1 } },
                    { id: 'm2_pz_out', type: 'panZoom', toScale: 1, toX: 0, toY: 0, duration: 1.0, trigger: { wordText: 'one', occurrence: 1 } },
                ]),
            ],
        },

        // ══ MISTAKE 3 — duties vs. results ═════════════════════════════
        {
            tts: { text: "Number three. Listing duties instead of results. Don't say you were a cashier. Say you handled cash for a store that served two hundred customers a day without a single shortage.", voice: 'bm_lewis', pauseAfter: 0.3 },
            captions: false,
            layers: [
                { type: 'background', color: THEME.paper },
                casingLayer('cv-m3', 'MISTAKE #3', [
                    { id: 'm3_badge', type: 'sticker', text: '#3', slot: 'top-left', size: 70, color: '#ffffff', bg: THEME.accent, trigger: { atSeconds: 0.1 } },
                    { id: 'm3_duty_lbl', type: 'sticker', text: '"WAS A CASHIER"', slot: 'mid-left', size: 34, color: THEME.accent, stroke: '#ffffff', trigger: { wordText: 'cashier', occurrence: 1 } },
                    { id: 'm3_duty_x', type: 'icon', icon: 'mdi:close-circle', slot: 'top-right', size: 70, color: THEME.accent, trigger: { afterId: 'm3_duty_lbl', offset: 0.1 } },
                    { id: 'm3_arrow', type: 'arrow', x1: 260, y1: 550, x2: 780, y2: 750, curve: 30, color: THEME.ink, trigger: { wordText: 'handled', occurrence: 1 } },
                    { id: 'm3_result_lbl', type: 'sticker', text: '"HANDLED CASH FOR\n200 CUSTOMERS/DAY —\nZERO SHORTAGES"', slot: 'mid-right', size: 30, color: THEME.accent2, stroke: '#ffffff', trigger: { wordText: 'shortage', occurrence: 1 } },
                    { id: 'm3_result_check', type: 'icon', icon: 'mdi:check-circle', slot: 'low-right', size: 80, color: THEME.accent2, trigger: { afterId: 'm3_result_lbl', offset: 0.1 } },
                    { id: 'm3_pz', type: 'panZoom', toScale: 1.35, toX: 40, toY: -30, duration: 1.0, trigger: { afterId: 'm3_result_check', offset: 0.2 } },
                    { id: 'm3_pz_out', type: 'panZoom', toScale: 1, toX: 0, toY: 0, duration: 1.0, trigger: { afterId: 'm3_pz', offset: 1.0 } },
                ]),
            ],
        },

        // ══ CLOSING ════════════════════════════════════════════════════
        {
            tts: { text: "Small fixes. Big difference. Fix these three things and your CV stops looking like everyone else's.", voice: 'bm_lewis', pauseAfter: 0.4 },
            captions: false,
            layers: [
                { type: 'background', color: THEME.paper },
                casingLayer('cv-close', 'FIX IT', [
                    { id: 'close_check', type: 'icon', icon: 'mdi:check-decagram', slot: 'banner-top', size: 160, bg: 'circle', color: THEME.accent2, trigger: { atSeconds: 0.1 } },
                    { id: 'close_title', type: 'sticker', text: 'SMALL FIXES.\nBIG DIFFERENCE.', slot: 'banner-mid', size: 62, color: THEME.accent2, trigger: { wordText: 'difference', occurrence: 1 } },
                    { id: 'close_label', type: 'label', text: 'fix these three things —\nstand out from everyone else\'s CV', slot: 'low-center', size: 32, trigger: { wordText: 'else', occurrence: 1 } },
                    { id: 'close_pz', type: 'panZoom', toScale: 1.12, toX: 0, toY: -40, duration: 1.1, trigger: { afterId: 'close_label', offset: 0.3 } },
                ]),
            ],
        },

    ],
};