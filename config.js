// config.democracy-explainer.js
// "What is democracy — and when does it break?"  Portrait 1080x1920.
//
// Argument structure (so it teaches rather than preaches):
//   1 HOOK            inline-HTML board        — one person, one vote… uninformed? for sale?
//   2 WHAT IT IS      ApexCasing dossier-audit — demos + kratos, Athens vs today
//   3 CRITICS #1      ApexCasing dossier-audit — voter ignorance (Brennan / Caplan / Somin, jury analogy)
//   4 CRITICS #2      ApexCasing dossier-audit — money & incentives (vote buying rises with poverty)… and who's acting
//   5 CRITICS #3      ApexCasing recap-board   — competence: three proposed fixes
//   6 REPLIES 1/2     inline-HTML board        — literacy tests, Estlund's "who made you boss?", test designers
//   7 REPLIES 2/2     inline-HTML board        — Sen, poor != incapable (Malawi), defenders' fix, open question
//   8 VERDICT         inline-HTML board        — critics vs defenders, Churchill, "where do you land?"
//
// Casings used (data-injected via layer.data -> window.__APEX_DATA__, see documentations/ApexCasing.md):
//   ./ApexCasing/dossier-audit-explainer.html   (dark theme, word-triggered commands, needs audioSync:true)
//   ./ApexCasing/recap-board.html               (title + ranked rows)
// Each reuse of a casing gets its own ?tag= because the html-record cache key ignores `data`.
//
// Editorial note: the "critics" scenes present the epistocracy argument as its defenders make it; scenes 6-8
// give the strongest replies. "Broke" is treated as an incentives/institutions question (vote buying), not as a
// claim that poor people or people with mental illness are less capable — the cited research does not say that.
//
// Run: VIDEO_CONFIG=config.democracy-explainer.js node engine-ci.js

// ── palette (dark theme, mixed accents) ──────────────────────────────────
const TEAL = '#00e5a0', AMBER = '#ffcc33', BLUE = '#4dd0ff', PINK = '#ff7ac6', RED = '#ff5a5f', VIOLET = '#b08cff';
const INK = '#eaf0f7', PAPER = '#0c1118';

const dossierTheme = { mode: 'dark', paper: PAPER, ink: INK, accent: RED, accent2: BLUE, shadow: 'rgba(0,0,0,0.55)', paperGrain: 0.12 };

const CAPTIONS = { style: 'highlight', position: 'bottom', fontSize: 46, color: '#ffffff', highlightColor: AMBER, bgColor: 'rgba(0,0,0,0.72)', wordsPerChunk: 3, maxWidth: 0.9 };

// ── inline HTML board (beats revealed on their spoken sentence; Noto emoji from Iconify) ──
// All content comes from layer.data (window.__APEX_DATA__): { tag, title, hero, color, beats:[{say,h,d,emoji,c}] }.
function board() {
    var D = window.__APEX_DATA__ || { beats: [] }, $ = function (i) { return document.getElementById(i); };
    var COL = ['#00e5a0', '#ffcc33', '#4dd0ff', '#ff7ac6', '#b08cff', '#ff9d4d'];
    document.documentElement.style.setProperty('--c', D.color || '#00e5a0');
    $('chips').innerHTML = (D.tag ? '<span class="chip" style="--c:' + D.color + '">' + D.tag + '</span>' : '');
    $('title').textContent = D.title || '';
    if (D.beats.length >= 5) $('list').className = 'dense';
    var cache = {};
    function emoji(n) { if (!n) return Promise.resolve(''); if (cache[n]) return cache[n]; return cache[n] = fetch('https://api.iconify.design/noto/' + n + '.svg').then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) { return t.indexOf('<svg') >= 0 ? t : ''; }).catch(function () { return ''; }); }
    var nTok = 0, wis = D.beats.map(function (b) { var w = nTok; nTok += String(b.say || '').split(/\s+/).filter(Boolean).length; return w; });
    var els = [];
    Promise.all(D.beats.map(function (b) { return emoji(b.emoji); }).concat([emoji(D.hero)])).then(function (svgs) {
        $('hero').innerHTML = svgs[svgs.length - 1] || '';
        D.beats.forEach(function (b, i) {
            var el = document.createElement('div'); el.className = 'beat'; el.style.setProperty('--c', b.c || COL[i % COL.length]);
            el.innerHTML = (svgs[i] ? '<div class="em">' + svgs[i] + '</div>' : '<div class="num">' + (i + 1) + '</div>') + '<div><div class="h">' + (b.h || '') + '</div><div class="d">' + (b.d || '') + '</div></div>';
            $('list').appendChild(el); els.push(el);
        });
        document.body.setAttribute('data-ready', '1');
    });
    var inited = false;
    function init() {
        var A = window.__APEX_AUDIO__ || {}, ws = A.words || [], dur = A.duration || 10;
        els.forEach(function (el, i) { el.__t = ws.length ? ws[Math.min(ws.length - 1, Math.round(wis[i] * ws.length / Math.max(1, nTok)))].start : (i / Math.max(1, els.length)) * dur * 0.85; });
        inited = true;
    }
    window.addEventListener('apexframe', function (e) {
        if (!els.length) return; if (!inited) init();
        var t = e.detail.t || 0, last = -1;
        els.forEach(function (el, i) { if (t >= el.__t - 0.05) { el.classList.add('on'); last = i; } else el.classList.remove('on'); });
        els.forEach(function (el, i) { if (i === last) el.classList.add('cur'); else el.classList.remove('cur'); });
    });
}
const BOARD_CSS = '*{box-sizing:border-box;margin:0;padding:0}html,body{width:100%;height:100%;overflow:hidden;background:transparent;font-family:Arial,Helvetica,sans-serif;color:#fff}' +
    '#top{position:absolute;top:7.3%;left:5.5%;right:5.5%;text-align:center}.chips{display:flex;gap:14px;justify-content:center;margin-bottom:20px;flex-wrap:wrap}' +
    '.chip{padding:10px 26px;border-radius:999px;font-weight:900;letter-spacing:3px;font-size:27px;border:3px solid var(--c);color:var(--c);background:rgba(255,255,255,.05)}' +
    '#hero{width:170px;height:170px;margin:0 auto 12px}#hero svg,.em svg{width:100%;height:100%}#title{font-size:58px;font-weight:900;line-height:1.1}' +
    '#list{position:absolute;left:5.5%;right:5.5%;top:30%;height:44%;display:flex;flex-direction:column;gap:18px}' +
    '.beat{display:flex;align-items:center;gap:26px;padding:20px 28px;border-radius:30px;background:rgba(255,255,255,.07);border-left:12px solid var(--c);opacity:0;transform:translateY(40px) scale(.97);transition:opacity .45s ease,transform .5s cubic-bezier(.2,.9,.3,1.15),background .3s}' +
    '.beat.on{opacity:.5;transform:none}.beat.cur{opacity:1;background:rgba(255,255,255,.14);box-shadow:0 0 50px -14px var(--c)}' +
    '.em{width:100px;height:100px;flex:none}.num{width:100px;height:100px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:52px;font-weight:900;background:var(--c);color:#06121c}' +
    '.h{font-size:44px;font-weight:900;color:var(--c);line-height:1.1}.d{font-size:30px;color:#cfdce6;margin-top:6px}' +
    '.dense .beat{padding:12px 24px;gap:22px}.dense .em,.dense .num{width:82px;height:82px}.dense .h{font-size:40px}.dense .d{font-size:27px}';
const BOARD_HTML = '<style>' + BOARD_CSS + '</style><div id="top"><div class="chips" id="chips"></div><div id="hero"></div><div id="title"></div></div><div id="list"></div><script>(' + board.toString() + ')();<\/script>';

// scene = narration (beats joined) + inline board; beats are [say, heading, hint, noto-emoji-name]
function boardScene(o) {
    const beats = o.beats.map((b, i) => ({ say: b[0], h: b[1], d: b[2], emoji: b[3], c: [TEAL, AMBER, BLUE, PINK, VIOLET][i % 5] }));
    return {
        transition: o.transition || 'fade',
        tts: { text: beats.map(b => b.say).join(' '), voice: 'am_adam', pauseAfter: 0.5 },
        captions: CAPTIONS,
        layers: [
            { type: 'gradient', gradientType: 'linear', colors: [o.bgA || '#070b12', o.bgB || '#122033'], angle: 160 },
            { type: 'html-record', html: BOARD_HTML, audioSync: true, cursor: false, fps: 30,
              data: { tag: o.tag, title: o.title, hero: o.hero, color: o.color || TEAL, beats },
              viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', waitFor: '[data-ready="1"]' },
        ],
    };
}

// scene = narration + dossier-audit-explainer casing driven by word-triggered commands
function dossierScene(o) {
    return {
        transition: o.transition || 'wipe-up',
        tts: { text: o.say, voice: 'am_adam', pauseAfter: 0.5 },
        captions: CAPTIONS,
        layers: [
            { type: 'html-record', src: './ApexCasing/dossier-audit-explainer.html?tag=' + o.tag, audioSync: true, cursor: false, fps: 30,
              data: { title: o.title, theme: dossierTheme, captionSafe: true, commands: o.commands },
              viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', waitFor: '[data-ready="1"]' },
        ],
    };
}
const w = (word, occurrence) => ({ wordText: word, occurrence: occurrence || 1 });

module.exports = {
    output: {
        title: 'democracy-explained',
        format: 'portrait', fps: 30, crf: 23, preset: 'fast',
        bgMusic: { mood: 'documentary' }, bgMusicVol: 0.06,
        postProcess: { vignette: true, vignetteStrength: 0.35, grain: true, grainStrength: 0.012 },
    },
    defaults: { voice: 'am_adam', transition: 'fade', transitionDuration: 0.35 },

    scenes: [
        // ── 1. HOOK ────────────────────────────────────────────────────────
        boardScene({
            tag: 'DEMOCRACY', title: 'Who Gets To Decide?', hero: 'ballot-box-with-ballot', color: AMBER, transition: 'zoom-in',
            beats: [
                ['One person, one vote.', 'One person, one vote', 'It sounds perfectly fair', 'ballot-box-with-ballot'],
                ['But what happens when the vote is uninformed, or for sale?', 'Uninformed? For sale?', "The critics' worry", 'money-with-wings'],
                ["Let's look at what democracy is, and the strongest case against it.", 'The strongest case against', 'Then the strongest reply', 'balance-scale'],
            ],
        }),

        // ── 2. WHAT DEMOCRACY IS ───────────────────────────────────────────
        dossierScene({
            tag: 'dem-what', title: 'WHAT IS DEMOCRACY?',
            say: 'Democracy means rule by the people. The word comes from Greek: demos, the people, and kratos, power. In ancient Athens, citizens voted directly. Today most countries use representative democracy: you vote, and the people you elect make the decisions.',
            commands: [
                { id: 'a1', type: 'sticker', text: 'DEMOCRACY', x: 540, y: 330, size: 120, color: AMBER, stroke: PAPER, trigger: { atSeconds: 0.3 } },
                { id: 'a2', type: 'icon', icon: 'noto:ballot-box-with-ballot', x: 540, y: 640, size: 240, bg: 'circle', trigger: { afterId: 'a1', offset: 0.5 } },
                { id: 'a3', type: 'label', text: 'demos = the people', x: 310, y: 930, size: 46, color: TEAL, trigger: w('demos') },
                { id: 'a4', type: 'label', text: 'kratos = power', x: 780, y: 930, size: 46, color: PINK, trigger: w('kratos') },
                { id: 'a5', type: 'ledgerLine', label: 'ATHENS (5TH C. BCE)', value: 'DIRECT VOTE', x: 540, y: 1110, width: 940, size: 34, trigger: w('athens') },
                { id: 'a6', type: 'ledgerLine', label: 'TODAY (MOST COUNTRIES)', value: 'ELECTED REPS', x: 540, y: 1200, width: 940, size: 34, trigger: w('today') },
                { id: 'a7', type: 'sticker', text: 'YOU VOTE, THEY DECIDE', x: 540, y: 1420, size: 62, color: BLUE, stroke: PAPER, trigger: w('elect') },
            ],
        }),

        // ── 3. CRITICS #1: IGNORANCE ───────────────────────────────────────
        dossierScene({
            tag: 'dem-ignorance', title: 'THE CRITICS: IGNORANCE',
            say: 'Now the critics\' case. Philosophers and economists like Jason Brennan, Bryan Caplan and Ilya Somin argue that many voters know little about the policies they decide. And since one vote rarely changes the result, there is little reason to learn. Brennan compares it to a jury: you would not let a jury that ignored the trial decide a murder case.',
            commands: [
                { id: 'b1', type: 'sticker', text: "THE CRITICS' CASE", x: 540, y: 300, size: 84, color: AMBER, stroke: PAPER, trigger: { atSeconds: 0.3 } },
                { id: 'b2', type: 'stamp', text: 'UNINFORMED?', x: 540, y: 520, size: 74, rotate: -6, color: RED, trigger: w('little') },
                { id: 'b3', type: 'ledgerLine', label: 'BRENNAN 2016', value: 'AGAINST DEMOCRACY', x: 540, y: 730, width: 960, size: 32, trigger: w('brennan') },
                { id: 'b4', type: 'ledgerLine', label: 'CAPLAN 2007', value: 'THE MYTH OF THE RATIONAL VOTER', x: 540, y: 820, width: 960, size: 32, trigger: w('bryan') },
                { id: 'b5', type: 'ledgerLine', label: 'SOMIN 2013', value: 'DEMOCRACY & POLITICAL IGNORANCE', x: 540, y: 910, width: 960, size: 32, trigger: w('ilya') },
                { id: 'b6', type: 'icon', icon: 'noto:balance-scale', x: 540, y: 1190, size: 230, bg: 'circle', trigger: w('jury') },
                { id: 'b7', type: 'label', text: 'AN INATTENTIVE JURY, A REAL VERDICT?', x: 540, y: 1410, size: 44, color: PINK, trigger: w('murder') },
            ],
        }),

        // ── 4. CRITICS #2: MONEY & INCENTIVES ──────────────────────────────
        dossierScene({
            tag: 'dem-money', title: 'THE CRITICS: MONEY',
            say: 'A second worry is money. In studies from Colombia, vote buying rises with poverty, and in the Philippines campaigns target poorer voters with food or cash. Critics say financial desperation makes a vote easy to rent. But notice who is acting here: it is the politician\'s strategy, and in the Philippines only about two thirds of those who accepted a gift actually voted for the giver.',
            commands: [
                { id: 'c1', type: 'sticker', text: 'THE MONEY PROBLEM', x: 540, y: 300, size: 80, color: AMBER, stroke: PAPER, trigger: { atSeconds: 0.3 } },
                { id: 'c2', type: 'icon', icon: 'noto:money-bag', x: 540, y: 570, size: 220, bg: 'circle', trigger: w('money') },
                { id: 'c3', type: 'ledgerLine', label: 'COLOMBIA', value: 'VOTE BUYING RISES WITH POVERTY', x: 540, y: 810, width: 960, size: 31, trigger: w('colombia') },
                { id: 'c4', type: 'ledgerLine', label: 'PHILIPPINES', value: 'POORER VOTERS TARGETED', x: 540, y: 900, width: 960, size: 31, trigger: w('philippines') },
                { id: 'c5', type: 'meter', label: 'TOOK THE GIFT AND VOTED FOR THE GIVER (ABOUT 2 IN 3)', value: 67, x: 540, y: 1130, width: 880, color: AMBER, trigger: w('thirds') },
                { id: 'c6', type: 'stamp', text: "THE BUYER'S STRATEGY", x: 540, y: 1410, size: 60, rotate: -4, color: RED, trigger: w('politicians') },
            ],
        }),

        // ── 5. CRITICS #3: COMPETENCE — recap-board casing ──────────────────
        {
            transition: 'slide-left',
            tts: { text: 'The third argument is about competence. We license drivers, pilots and surgeons, so critics ask: why not require some competence from voters, or from people who hold office? They propose three fixes: a knowledge test to vote, extra votes for the well informed, or an elected government checked by a council of experts with a veto.', voice: 'am_adam', pauseAfter: 0.5 },
            captions: CAPTIONS,
            layers: [
                { type: 'html-record', src: './ApexCasing/recap-board.html?tag=dem-fixes', duration: 3, fps: 30,
                  data: { title: 'THREE PROPOSED FIXES', items: [
                      { rank: 1, name: 'A knowledge test to vote', stat: 'like a driving licence' },
                      { rank: 2, name: 'Extra votes for the informed', stat: "plural voting, an idea from J.S. Mill" },
                      { rank: 3, name: 'Elected, but checked by experts', stat: 'a council that can veto, not legislate' } ] },
                  viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', waitFor: '[data-ready="1"]' },
            ],
        },

        // ── 6. REPLIES 1/2 ─────────────────────────────────────────────────
        boardScene({
            tag: 'THE REPLIES  1/2', title: 'The Strongest Answers', hero: 'shield', color: BLUE, bgA: '#06101a', bgB: '#0e2a3d', transition: 'wipe-up',
            beats: [
                ['First, who writes the test? Literacy tests began in Connecticut in 1855, were used for political ends, and were banned outright only in 1975.', 'Who writes the test?', 'Literacy tests: 1855 to 1975', 'memo'],
                ['Second, educated voters are not neutral either, so excluding people can skew decisions. As philosopher David Estlund asked: who made you boss?', 'Educated is not neutral', 'Estlund: "who made you boss?"', 'thinking-face'],
                ['Third, critics warn that whoever designs the test can shape the electorate.', 'Test designers hold power', 'the selection-bias objection', 'locked'],
            ],
        }),

        // ── 7. REPLIES 2/2 ─────────────────────────────────────────────────
        boardScene({
            tag: 'THE REPLIES  2/2', title: 'Track Record And Poverty', hero: 'shield', color: TEAL, bgA: '#06130f', bgB: '#0d2c25', transition: 'fade',
            beats: [
                ['Fourth, track record. Economist Amartya Sen argued that no famine has ever struck a functioning democracy, because leaders must face voters.', 'Track record', 'Sen: no famine in a functioning democracy', 'bar-chart'],
                ['Fifth, being poor is not being incapable. In a Malawi study, poor respondents preferred candidates promising community goods over cash for votes.', 'Poor is not incapable', 'Malawi study: community goods preferred', 'busts-in-silhouette'],
                ['Defenders say the fix for vote buying is a secret ballot and enforcement, not taking votes away.', "Defenders' fix", 'Secret ballot + enforcement', 'locked'],
                ['Even Brennan has said whether epistocracy would work better is partly an empirical question.', 'Still an open question', 'Brennan: partly empirical', 'magnifying-glass-tilted-left'],
            ],
        }),

        // ── 8. VERDICT ─────────────────────────────────────────────────────
        boardScene({
            tag: 'YOUR CALL', title: 'So, Is Democracy The Problem?', hero: 'thinking-face', color: AMBER, bgA: '#0f0a1a', bgB: '#241a3d', transition: 'zoom-in',
            beats: [
                ['So is democracy bad when uninformed or desperate people vote?', 'The question', 'Uninformed or desperate voters', 'thinking-face'],
                ['Critics point to real problems: voter ignorance and vote buying.', 'Critics say', 'Ignorance + vote buying', 'warning'],
                ['Defenders answer: fix information, institutions and secrecy, not who gets to vote.', 'Defenders say', 'Better institutions, not fewer voters', 'shield'],
                ['Churchill is famous for calling democracy the worst form of government, except for all the others. Where do you land? Tell me below.', "Churchill's famous line", '"the worst, except all the others"', 'speech-balloon'],
            ],
        }),
    ],
};
