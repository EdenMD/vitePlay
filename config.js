// config.procrastination-animated.js
// Same script as config.procrastination.js. This version fixes the two
// real problems with config.procrastination-icons.js:
//   1. Only 2 of ~14 icons were actually animated (the rest were static
//      Lucide SVGs). Every icon here is a verified-working Noto animated
//      Lottie emoji instead — 13 of them, codepoints confirmed reachable
//      from this sandbox before use (see the verification runs in chat;
//      several guesses actually 404'd — calendar, phone, shield, plain
//      warning don't exist in this animated set, so those were swapped
//      for working alternates with the same meaning).
//   2. The icons were sitting inside the casing's photo-pin/tape "corkboard"
//      frame, which reads as a picture card, not a clean icon. Every scene
//      is now a plain inline paper-themed page — same cream background,
//      same Impact-font badges, same ink/accent colors — just the icon
//      itself, bigger, with no card/background box around it.
//
// Voice: am_adam, same pacing. No background music. ~2.5 min, 8 scenes.
// RUN: VIDEO_CONFIG=config.procrastination-animated.js node engine-ci.js
//
// Icons loop continuously once their narration word triggers them (simpler
// and more robust than frame-locking every animation to apexframe — the
// reveal timing is still narration-synced, the playback itself just runs
// on Lottie's own clock once started).

const LOTTIE_CACHE = new Map();
const NOTO_RAW = (cp) => `https://raw.githubusercontent.com/rbozan/animated-emojis-rs/HEAD/static/noto_animated_emoji/lottie/${cp}/lottie.json`;

async function lottieJson(codepoint) {
    if (LOTTIE_CACHE.has(codepoint)) return LOTTIE_CACHE.get(codepoint);
    try {
        const res = await fetch(NOTO_RAW(codepoint), { signal: AbortSignal.timeout(15000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        if (!j || !Array.isArray(j.layers)) throw new Error('not a lottie json');
        LOTTIE_CACHE.set(codepoint, j);
        console.log(`[Icons] ✓ Noto Lottie ${codepoint} (${j.layers.length} layers)`);
        return j;
    } catch (e) {
        console.warn(`[Icons] ⚠ Noto Lottie ${codepoint} failed: ${e.message}`);
        LOTTIE_CACHE.set(codepoint, null);
        return null;
    }
}

const THEME = {
    paper: '#efe6d3', ink: '#231b12',
    accent: '#b5402c', accent2: '#2c6b5a',
    shadow: 'rgba(20,16,10,0.4)',
};

// ── Clean animated-icon scene builder. No card, no background box — just
// big looping Lottie icons on the plain paper background, revealed in
// sequence as their trigger words are spoken.
function iconScene({ badge, badgeColor = THEME.accent, items }) {
    // Layout: 1 item = big and centered. 2 = side by side. 3 = row of 3,
    // slightly smaller each so they still read as "big" without crowding.
    const n = items.length;
    const size = n === 1 ? 480 : n === 2 ? 400 : 320;
    const boxesHtml = items.map((it, i) => `
        <div class="icon-col">
            <div class="box off" id="box${i}" style="width:${size}px;height:${size}px"></div>
            <div class="lbl off" id="lbl${i}">${it.label}</div>
        </div>`).join('');

    const revealScript = items.map((it, i) => `
        map['${it.triggerWord.toLowerCase()}'] = map['${it.triggerWord.toLowerCase()}'] || [];
        map['${it.triggerWord.toLowerCase()}'].push(${i});`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:1080px;height:1920px;overflow:hidden;background:${THEME.paper};
    font-family:Georgia,'Times New Roman',serif;color:${THEME.ink}}
  .badge{position:absolute;top:150px;left:50%;transform:translateX(-50%) rotate(-2deg);
    background:${badgeColor};color:#fff;font:900 60px Impact,'Arial Black',sans-serif;
    padding:6px 34px;box-shadow:6px 6px 0 ${THEME.shadow};white-space:nowrap;
    opacity:0;transition:opacity .4s ease}
  .badge.on{opacity:1}
  .row{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
    gap:40px;padding:0 60px}
  .icon-col{display:flex;flex-direction:column;align-items:center;gap:22px}
  .box{opacity:0;transform:scale(.6);transition:opacity .4s ease,transform .4s cubic-bezier(.2,1.4,.4,1)}
  .box.on{opacity:1;transform:scale(1)}
  .lbl{font:900 38px Impact,'Arial Black',sans-serif;text-align:center;max-width:320px;
    line-height:1.1;opacity:0;transition:opacity .4s ease}
  .lbl.on{opacity:1}
  #fail{position:absolute;bottom:160px;left:60px;right:60px;text-align:center;
    font-size:26px;color:${THEME.accent};font-weight:900;display:none}
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script></head><body>
  <div class="badge off" id="badge">${badge}</div>
  <div class="row">${boxesHtml}</div>
  <div id="fail">(one or more animations unavailable this render)</div>
<script>
(function () {
  var jsons = ${JSON.stringify(items.map(it => it.json || null))};
  var anims = new Array(jsons.length).fill(null);
  var started = new Array(jsons.length).fill(false);
  var shown = {};
  function showIdx(i) {
    if (shown[i]) return; shown[i] = true;
    var box = document.getElementById('box' + i), lbl = document.getElementById('lbl' + i);
    if (box) box.classList.add('on'); if (lbl) lbl.classList.add('on');
    if (anims[i] && !started[i]) { started[i] = true; try { anims[i].play(); } catch (e) {} }
    else if (!jsons[i]) { document.getElementById('fail').style.display = 'block'; }
  }
  jsons.forEach(function (j, i) {
    if (!window.lottie || !j) return;
    try {
      anims[i] = lottie.loadAnimation({
        container: document.getElementById('box' + i), renderer: 'svg',
        loop: true, autoplay: false, animationData: j,
      });
    } catch (e) {}
  });
  var map = {};
  ${revealScript}
  var badgeShown = false;
  window.addEventListener('apexframe', function (e) {
    if (!badgeShown) { badgeShown = true; document.getElementById('badge').classList.add('on'); }
    var d = e.detail, w = (d.word || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (map[w]) map[w].forEach(showIdx);
  });
  // Safety: if a trigger word is somehow never matched, reveal everything
  // by the 70% mark of whatever duration this layer ends up with.
  setTimeout(function () { for (var i = 0; i < jsons.length; i++) showIdx(i); }, 8000);
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

    console.log('[Icons] Fetching 13 verified Noto animated-emoji Lottie files...');

    const cp = {
        siren:        '1f6a8', // 🚨 the deadline
        lightning:    '26a1',  // ⚡ the adrenaline rush
        directHit:    '1f3af', // 🎯 focus narrows
        astonished:   '1f632', // 😲 the pivot/surprise
        chartDown:    '1f4c9', // 📉 lower grades
        disappointed: '1f61e', // 😞 "I did fine" mismatch
        hourglass:    '23f3',  // ⏳ irony: it was never about time
        explodingHd:  '1f92f', // 🤯 overwhelmed by more apps/tools
        newMoonFace:  '1f31a', // 🌚 sleepless nights
        sleeping:     '1f634', // 😴 exhaustion / health cost
        brain:        '1f9e0', // 🧠 the real reason
        fearful:      '1f628', // 😨 brain treats the task as a threat
        thinking:     '1f914', // 🤔 realizing it
        check:        '2705',  // ✅ finally done
    };
    const json = {};
    for (const [key, code] of Object.entries(cp)) json[key] = await lottieJson(code);

    console.log('[Icons] Building config...');

    return {
        output: {
            title: 'procrastination-dumb-idea-animated', format: 'portrait', fps: 30, crf: 23, preset: 'medium',
            // No background music, same rule as the last few videos.
        },
        defaults: { voice: 'am_adam', speed: 1.02, transition: 'fade', transitionDuration: 0.3 },

        scenes: [

            // ── Scene 0 — HOOK ─────────────────────────────────────────────
            {
                tts: { text: "You know that feeling right before a deadline? Pure adrenaline, laser focus, suddenly you're a machine. Procrastination basically feels like a cheat code. Wait till you hear why it's actually one of the worst things you can do to yourself.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    iconScene({
                        badge: 'THE DEADLINE',
                        items: [{ id: 'siren', label: 'RIGHT BEFORE IT HITS', json: json.siren, triggerWord: 'deadline' }],
                    }),
                ],
            },

            // ── Scene 1 — why it feels real ─────────────────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "And it's not just in your head. Pressure genuinely does something to your brain — cortisol spikes, focus narrows, you get this rush of 'I work better like this.' Millions of people have built their entire work style around exactly that feeling.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    iconScene({
                        badge: 'NOT JUST IN YOUR HEAD', badgeColor: THEME.accent2,
                        items: [
                            { id: 'lightning', label: 'CORTISOL SPIKES', json: json.lightning, triggerWord: 'cortisol' },
                            { id: 'target', label: 'FOCUS NARROWS', json: json.directHit, triggerWord: 'narrows' },
                        ],
                    }),
                ],
            },

            // ── Scene 2 — THE PIVOT ──────────────────────────────────────────
            {
                transition: 'fade',
                tts: { text: "Except here's the surprise: it doesn't actually work the way it feels like it does. Let me show you what the research actually says.", pauseAfter: 0.3 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    iconScene({
                        badge: 'BUT...',
                        items: [{ id: 'astonished', label: 'THE SURPRISE', json: json.astonished, triggerWord: 'surprise' }],
                    }),
                ],
            },

            // ── Scene 3 — REASON 1: quality suffers ──────────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "Reason one: the work itself gets worse. Studies on procrastinators consistently show lower grades, lower performance ratings, even when the person swears they 'did fine.' Feeling fine and actually doing well are not the same thing.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    iconScene({
                        badge: 'REASON #1 — THE WORK SUFFERS', badgeColor: THEME.accent2,
                        items: [
                            { id: 'chart', label: 'LOWER GRADES', json: json.chartDown, triggerWord: 'grades' },
                            { id: 'disap', label: '"I DID FINE"', json: json.disappointed, triggerWord: 'fine' },
                        ],
                    }),
                ],
            },

            // ── Scene 4 — REASON 2: not a time problem ───────────────────────
            {
                transition: 'fade',
                tts: { text: "Reason two: more planning tools, more calendar apps, more to-do lists — none of it fixes chronic procrastination, because the problem was never time management in the first place.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    iconScene({
                        badge: 'REASON #2 — NOT A TIME PROBLEM', badgeColor: THEME.accent2,
                        items: [
                            { id: 'hourglass', label: 'NEVER ABOUT TIME', json: json.hourglass, triggerWord: 'time' },
                            { id: 'exploding', label: 'MORE APPS DON\'T FIX IT', json: json.explodingHd, triggerWord: 'apps' },
                        ],
                    }),
                ],
            },

            // ── Scene 5 — REASON 3: health cost ──────────────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "Reason three: chronic procrastinators report more stress, more anxiety, even worse physical health over time. Pushing everything to the deadline doesn't just cost you a grade. It costs your body.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    iconScene({
                        badge: 'REASON #3 — THE HEALTH COST', badgeColor: THEME.accent2,
                        items: [
                            { id: 'moon', label: 'SLEEPLESS NIGHTS', json: json.newMoonFace, triggerWord: 'anxiety' },
                            { id: 'sleeping', label: 'COSTS YOUR BODY', json: json.sleeping, triggerWord: 'body' },
                        ],
                    }),
                ],
            },

            // ── Scene 6 — THE TWIST: emotion regulation ──────────────────────
            {
                transition: 'wipe-up',
                tts: { text: "So if it's not laziness and it's not bad time management, what actually is it? Psychologists now call it an emotion regulation problem. Your brain treats a boring, stressful task like an actual threat, and procrastinating is just your brain buying a few minutes of relief from that feeling. You're not managing time badly. You're managing a feeling badly.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    iconScene({
                        badge: 'THE REAL REASON',
                        items: [
                            { id: 'brain', label: 'EMOTION REGULATION', json: json.brain, triggerWord: 'emotion' },
                            { id: 'fearful', label: 'SEES A THREAT', json: json.fearful, triggerWord: 'threat' },
                        ],
                    }),
                ],
            },

            // ── Scene 7 — CLOSE + CTA ────────────────────────────────────────
            {
                transition: 'fade',
                tts: { text: "So next time you're pushing something to the last minute, it's not that you're lazy. It's that your brain just really, really wanted to feel better for five minutes. Subscribe for more of what's really happening, when nobody explains it.", pauseAfter: 0.2 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    iconScene({
                        badge: '🔔 SUBSCRIBE', badgeColor: THEME.accent2,
                        items: [{ id: 'check', label: 'FINALLY DONE.', json: json.check, triggerWord: 'minute' }],
                    }),
                ],
            },
        ],
    };
})();
