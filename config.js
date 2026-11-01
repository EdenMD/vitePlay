// config.procrastination-icons.js
// Same script/structure as config.procrastination.js, rebuilt to actually
// use the Iconify + Lottie pipeline from config.test-all-sources.js — the
// thing I skipped last time. ~2.5 min, 8 scenes. Voice: am_adam.
//
// RUN: VIDEO_CONFIG=config.procrastination-icons.js node engine-ci.js
//
// WHAT CHANGED FROM THE PHOTO VERSION:
//   - No real photos this time at all — every visual is an icon, heavily,
//     per the request. Two kinds:
//     1. Iconify Lucide line-icons (ISC license, keyless API, confirmed
//        working in your test config) — fetched live, recoloured via the
//        API's own ?color= param to the theme's ink/accent colors, then
//        dropped into the casing's normal `photo` slots like any image.
//        These get the casing's own pop/zoom reveal animation for motion.
//     2. TWO genuinely animated Lottie moments, for the two beats that
//        earn it most: the opening "deadline" siren and the closing
//        "finally done" checkmark — Noto animated emoji (CC BY 4.0, GitHub
//        raw, same codepoints already verified working in your test
//        config: 1f6a8 siren, 2705 check). These need inline HTML (the
//        casing can't run a Lottie player natively), so I built a small
//        template that reuses the exact paper theme — cream background,
//        Impact font badge, same ink/accent colors — so it doesn't look
//        like a different video. Audio-synced via apexframe, same
//        frame-locked playback pattern as your test config's lottieDoc.
//   - Everything else (ApexCasing, the winding road-mapper camera, no
//     background music, the actual script/facts) is unchanged from the
//     photo version.
//
// HONESTY NOTE: I can't verify from my sandbox that api.iconify.design or
// the GitHub-raw Lottie JSON are reachable from inside your CI runner at
// render time — your own test config is the actual verification for that,
// and it reported these sources as working. If either source is down when
// you render, the icon or animation for that one beat will be missing;
// nothing else in the video depends on it.

const ICON_CACHE  = new Map();
const LOTTIE_CACHE = new Map();

async function fetchText(url, timeoutMs = 15000) {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
}
async function fetchJson(url, timeoutMs = 15000) {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// ── Iconify — Lucide line-icons, recoloured to match the paper theme ─────
async function iconifyDataUri(name, color) {
    const key = `${name}::${color}`;
    if (ICON_CACHE.has(key)) return ICON_CACHE.get(key);
    try {
        const svg = await fetchText(`https://api.iconify.design/lucide/${name}.svg?color=${encodeURIComponent(color)}`);
        if (!svg.includes('<svg')) throw new Error('not an svg');
        const uri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
        ICON_CACHE.set(key, uri);
        console.log(`[Icons] ✓ lucide/${name} (${color})`);
        return uri;
    } catch (e) {
        console.warn(`[Icons] ⚠ lucide/${name} failed: ${e.message}`);
        ICON_CACHE.set(key, null);
        return null;
    }
}

// ── Noto animated Lottie — the two codepoints already verified in
// config.test-all-sources.js: 1f6a8 (siren) and 2705 (check mark).
const NOTO_RAW = (cp) => `https://raw.githubusercontent.com/rbozan/animated-emojis-rs/HEAD/static/noto_animated_emoji/lottie/${cp}/lottie.json`;
async function lottieJson(codepoint) {
    if (LOTTIE_CACHE.has(codepoint)) return LOTTIE_CACHE.get(codepoint);
    try {
        const j = await fetchJson(NOTO_RAW(codepoint));
        if (!j || !Array.isArray(j.layers)) throw new Error('not a lottie json');
        LOTTIE_CACHE.set(codepoint, j);
        console.log(`[Icons] ✓ Noto Lottie ${codepoint}`);
        return j;
    } catch (e) {
        console.warn(`[Icons] ⚠ Noto Lottie ${codepoint} failed: ${e.message}`);
        LOTTIE_CACHE.set(codepoint, null);
        return null;
    }
}

// ── Camera helper (same winding road-mapper as the last three configs) ───
const SLOT_CENTERS = {
    'top-left': [180, 270.5], 'top-center': [540, 270.5], 'top-right': [900, 270.5],
    'mid-left': [180, 511.5], 'mid-center': [540, 511.5], 'mid-right': [900, 511.5],
    'low-left': [180, 752.5], 'low-center': [540, 752.5], 'low-right': [900, 752.5],
    'bot-left': [180, 993.5], 'bot-center': [540, 993.5], 'bot-right': [900, 993.5],
    'deep-left': [180, 1234.5], 'deep-center': [540, 1234.5], 'deep-right': [900, 1234.5],
    'banner-top': [540, 270.5], 'banner-mid': [540, 752.5], 'banner-low': [540, 1234.5], 'banner-bot': [540, 1475.5],
};
function zoomTo(slot, scale) {
    const c = SLOT_CENTERS[slot] || [540, 960];
    return { toScale: scale, toX: -scale * (c[0] - 540), toY: -scale * (c[1] - 960) };
}
const ZOOM_OUT = { toScale: 1, toX: 0, toY: 0 };

const ROAD_TIERS = ['top', 'mid', 'low', 'bot', 'deep'];
const ROAD_X     = ['left', 'center', 'right'];
function randomRoadSlots(n) {
    const slots = [];
    let lastX = null;
    for (let i = 0; i < n && i < ROAD_TIERS.length; i++) {
        let x;
        do { x = ROAD_X[Math.floor(Math.random() * ROAD_X.length)]; } while (x === lastX);
        lastX = x;
        slots.push(`${ROAD_TIERS[i]}-${x}`);
    }
    return slots;
}

const THEME = {
    paper: '#efe6d3', ink: '#231b12',
    accent: '#b5402c', accent2: '#2c6b5a',
    shadow: 'rgba(20,16,10,0.4)',
};

const casingLayer = (tag, title, commands) => ({
    type: 'html-record', src: `./ApexCasing/paper-sticker-explainer.html?tag=${tag}`,
    audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
    viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
    data: { title, theme: THEME, commands },
});

function roadDown(images, zoomScale = 1.35) {
    const slots = randomRoadSlots(images.length);
    const cmds = [];
    let prevId = null;
    images.forEach((img, i) => {
        const slot = slots[i];
        const photoId = `${img.id}_photo`;
        const zoomId  = `${img.id}_zoom`;
        cmds.push({
            id: photoId, type: 'photo', src: img.src, slot,
            width: img.width || 340, height: img.height || 340,
            caption: img.caption, pinStyle: i % 2 === 0 ? 'tape' : 'pins',
            trigger: prevId
                ? { afterId: prevId, offset: 0.1 }
                : { wordText: img.triggerWord, occurrence: img.occurrence || 1 },
        });
        cmds.push({
            id: zoomId, type: 'panZoom', ...zoomTo(slot, img.scale || zoomScale),
            duration: 1.0, trigger: { afterId: photoId, offset: 0.15 },
        });
        prevId = zoomId;
    });
    cmds.push({ id: `road_out_${images[0]?.id || 'x'}`, type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: prevId, offset: 0.6 } });
    return cmds;
}

// ── Inline Lottie beat — paper-sticker themed, for the two true-animation
// moments. Audio-synced: apexframe drives playback so the animation is
// frame-locked to the narration, same mechanic as your test config.
function lottieBeat({ badge, label, json, size = 420 }) {
    const hasJson = !!json;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:1080px;height:1920px;overflow:hidden;background:${THEME.paper};
    font-family:Georgia,'Times New Roman',serif;color:${THEME.ink}}
  .wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .badge{position:absolute;top:150px;background:${THEME.accent};color:#fff;font:900 70px Impact,'Arial Black',sans-serif;
    padding:6px 34px;transform:rotate(-2deg);box-shadow:6px 6px 0 ${THEME.shadow};
    opacity:0;transition:opacity .4s ease,transform .4s cubic-bezier(.2,1.4,.4,1)}
  .badge.on{opacity:1;transform:rotate(-2deg) scale(1)}
  .box{width:${size}px;height:${size}px;opacity:0;transform:scale(.7);
    transition:opacity .4s ease,transform .4s cubic-bezier(.2,1.4,.4,1)}
  .box.on{opacity:1;transform:scale(1)}
  .lbl{margin-top:30px;font:900 52px Impact,'Arial Black',sans-serif;color:${THEME.ink};
    opacity:0;transition:opacity .4s ease}
  .lbl.on{opacity:1}
  #fail{position:absolute;bottom:180px;left:60px;right:60px;text-align:center;
    font-size:28px;color:${THEME.accent};font-weight:900;display:none}
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script></head><body>
  <div class="badge off" id="badge">${badge}</div>
  <div class="wrap">
    <div class="box off" id="box"></div>
    <div class="lbl off" id="lbl">${label}</div>
  </div>
  <div id="fail">(animation unavailable this render — falling back to label only)</div>
<script>
(function () {
  var json = ${hasJson ? JSON.stringify(json) : 'null'};
  var anim = null;
  function show(id){ var el = document.getElementById(id); if (el) el.classList.add('on'); }
  if (window.lottie && json) {
    try {
      anim = lottie.loadAnimation({
        container: document.getElementById('box'), renderer: 'svg',
        loop: true, autoplay: false, animationData: json,
      });
    } catch (e) { document.getElementById('fail').style.display = 'block'; }
  } else {
    document.getElementById('fail').style.display = 'block';
  }
  window.addEventListener('apexframe', function (e) {
    var t = (e.detail && e.detail.t) || 0;
    show('badge'); show('box'); show('lbl');
    if (anim && anim.totalFrames > 0) {
      var fr = anim.frameRate || 30;
      anim.goToAndStop(Math.floor((t * fr) % anim.totalFrames), true);
    }
  });
  document.body.setAttribute('data-ready', '1');
})();
</script>
</body></html>`;
    return {
        type: 'html-record', html,
        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
    };
}

module.exports = (async () => {

    console.log('[Icons] Fetching Lucide icons (recoloured to theme) + the two Lottie moments...');

    const INK = '#231b12', RED = '#b5402c', GREEN = '#2c6b5a';

    const icon = {};
    const iconWanted = [
        ['zap',          INK],    // adrenaline rush
        ['activity',     INK],    // cortisol spike
        ['target',       INK],    // focus narrows
        ['alert-triangle', RED],  // the pivot / surprise
        ['trending-down', RED],   // lower grades
        ['frown',         RED],   // "felt fine" mismatch
        ['calendar',      RED],   // more planning tools
        ['smartphone',    RED],   // more apps
        ['heart-crack',   RED],   // health cost
        ['moon',          RED],   // sleepless nights
        ['brain',         GREEN], // the real reason — emotion regulation
        ['shield-alert',  GREEN], // brain treats task as a threat
    ];
    for (const [name, color] of iconWanted) icon[name] = await iconifyDataUri(name, color);

    console.log('[Icons] Fetching the two Lottie moments (Noto animated emoji)...');
    const lottieSiren = await lottieJson('1f6a8'); // 🚨 siren — the deadline
    const lottieCheck = await lottieJson('2705');  // ✅ check — finally done

    console.log('[Icons] Building config...');

    return {
        output: {
            title: 'procrastination-dumb-idea-icons', format: 'portrait', fps: 30, crf: 23, preset: 'medium',
            // No background music, same rule as the last few videos.
        },
        defaults: { voice: 'am_adam', speed: 1.02, transition: 'fade', transitionDuration: 0.3 },

        scenes: [

            // ── Scene 0 — HOOK (Lottie siren) ─────────────────────────────
            {
                tts: { text: "You know that feeling right before a deadline? Pure adrenaline, laser focus, suddenly you're a machine. Procrastination basically feels like a cheat code. Wait till you hear why it's actually one of the worst things you can do to yourself.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    lottieBeat({ badge: 'THE DEADLINE', label: 'ADRENALINE. FOCUS. GO.', json: lottieSiren, size: 440 }),
                ],
            },

            // ── Scene 1 — why it feels real ────────────────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "And it's not just in your head. Pressure genuinely does something to your brain — cortisol spikes, focus narrows, you get this rush of 'I work better like this.' Millions of people have built their entire work style around exactly that feeling.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proci-s1', 'NOT JUST IN YOUR HEAD', [
                        ...roadDown([
                            { id: 'act', src: icon.activity, caption: 'CORTISOL SPIKES', triggerWord: 'cortisol', occurrence: 1 },
                            { id: 'tgt', src: icon.target, caption: 'FOCUS NARROWS', triggerWord: 'narrows', occurrence: 1 },
                            { id: 'zap', src: icon.zap, caption: '"I WORK BETTER LIKE THIS"', triggerWord: 'rush', occurrence: 1 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 2 — THE PIVOT ───────────────────────────────────────
            {
                transition: 'fade',
                tts: { text: "Except here's the surprise: it doesn't actually work the way it feels like it does. Let me show you what the research actually says.", pauseAfter: 0.3 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proci-s2', 'THE SURPRISE', [
                        { id: 'badge', type: 'sticker', text: 'BUT...', slot: 'banner-top', size: 70, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: 1, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'alert', src: icon['alert-triangle'], caption: 'WHAT THE RESEARCH SAYS', triggerWord: 'research', occurrence: 1, width: 400, height: 400, scale: 1.4 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 3 — REASON 1: quality suffers ───────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "Reason one: the work itself gets worse. Studies on procrastinators consistently show lower grades, lower performance ratings, even when the person swears they 'did fine.' Feeling fine and actually doing well are not the same thing.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proci-s3', 'REASON #1 — THE WORK SUFFERS', [
                        { id: 'num', type: 'sticker', text: '#1', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'td', src: icon['trending-down'], caption: 'LOWER GRADES', triggerWord: 'grades', occurrence: 1 },
                            { id: 'fr', src: icon.frown, caption: '"I DID FINE"', triggerWord: 'fine', occurrence: 1 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 4 — REASON 2: not a time problem ────────────────────
            {
                transition: 'fade',
                tts: { text: "Reason two: more planning tools, more calendar apps, more to-do lists — none of it fixes chronic procrastination, because the problem was never time management in the first place.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proci-s4', 'REASON #2 — NOT A TIME PROBLEM', [
                        { id: 'num', type: 'sticker', text: '#2', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'cal', src: icon.calendar, caption: 'MORE PLANNING TOOLS', triggerWord: 'calendar', occurrence: 1 },
                            { id: 'sp', src: icon.smartphone, caption: 'MORE APPS', triggerWord: 'apps', occurrence: 1 },
                        ]),
                        { id: 's_tag', type: 'sticker', text: 'NEVER A TIME\nPROBLEM', slot: 'banner-low', size: 46, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -1, trigger: { wordText: 'place', occurrence: 1 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#b5402c', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 5 — REASON 3: health cost ───────────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "Reason three: chronic procrastinators report more stress, more anxiety, even worse physical health over time. Pushing everything to the deadline doesn't just cost you a grade. It costs your body.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proci-s5', 'REASON #3 — THE HEALTH COST', [
                        { id: 'num', type: 'sticker', text: '#3', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'hc', src: icon['heart-crack'], caption: 'MORE STRESS. MORE ANXIETY.', triggerWord: 'anxiety', occurrence: 1 },
                            { id: 'mn', src: icon.moon, caption: 'COSTS YOUR BODY', triggerWord: 'body', occurrence: 1 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 6 — THE TWIST: emotion regulation ───────────────────
            {
                transition: 'wipe-up',
                tts: { text: "So if it's not laziness and it's not bad time management, what actually is it? Psychologists now call it an emotion regulation problem. Your brain treats a boring, stressful task like an actual threat, and procrastinating is just your brain buying a few minutes of relief from that feeling. You're not managing time badly. You're managing a feeling badly.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proci-s6', 'THE REAL REASON', [
                        { id: 'num', type: 'sticker', text: '#1', slot: 'top-left', size: 90, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -3, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'br', src: icon.brain, caption: 'AN EMOTION REGULATION PROBLEM', triggerWord: 'emotion', occurrence: 1, width: 400, height: 400, scale: 1.3 },
                            { id: 'sh', src: icon['shield-alert'], caption: 'YOUR BRAIN SEES A THREAT', triggerWord: 'threat', occurrence: 1 },
                        ]),
                        { id: 's_tag', type: 'sticker', text: 'MANAGING A FEELING,\nNOT A SCHEDULE', slot: 'banner-low', size: 40, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -1, trigger: { wordText: 'badly', occurrence: 2 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#2c6b5a', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 7 — CLOSE + CTA (Lottie checkmark) ──────────────────
            {
                transition: 'fade',
                tts: { text: "So next time you're pushing something to the last minute, it's not that you're lazy. It's that your brain just really, really wanted to feel better for five minutes. Subscribe for more of what's really happening, when nobody explains it.", pauseAfter: 0.2 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    lottieBeat({ badge: '🔔 SUBSCRIBE', label: 'FINALLY DONE.', json: lottieCheck, size: 420 }),
                ],
            },
        ],
    };
})();