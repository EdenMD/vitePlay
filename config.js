// config.cruel-rules-of-life.js
// "5 Cruel Rules of Life (that are kind of hilarious once you notice them)"
// ~2 min, 7 scenes. Voice: am_adam, casual/funny.
//
// RUN: VIDEO_CONFIG=config.cruel-rules-of-life.js node engine-ci.js
//
// NO network fetching at all this time — every visual is hand-drawn SVG,
// built with the stickman technique from the "Fast SVG Generation" playbook
// you shared: stroke-width 6 round-capped limbs, white-filled head with a
// black outline (reads on any background), simple dot eyes + curved mouth,
// minimal props. That's a deliberate return to stick figures for THIS
// topic specifically — these are abstract ironies, not literal objects, so
// hand-drawn actually beats stock photos here, unlike the car/weapons/
// household videos where real photos were the right call.
//
// STRUCTURE: word/sentence-synced reveals (audioSync + apexframe), same
// mechanic used throughout this whole project — each SVG group starts
// hidden and fades/scales in exactly when its trigger word is spoken.
// Visual density: most scenes show a BEFORE/AFTER pair of stick figures
// (the actual irony of each "rule"), not just one static drawing.
//
// TONE CHECK: kept these as wry, universal, "haha yeah that's annoying"
// observations — not despair or hopelessness. If any line reads as bleaker
// than intended once you hear it with the voice, flag it and I'll rewrite.

const THEME = {
    paper: '#efe6d3', ink: '#231b12',
    accent: '#b5402c', accent2: '#2c6b5a',
    shadow: 'rgba(20,16,10,0.4)',
};

// ── Stickman helpers, translated from the Python playbook into JS ────────
function stickman(x, groundY, leftArm, rightArm, opts = {}) {
    const color = opts.color || THEME.ink;
    const hy = groundY - 128, sy = groundY - 98;
    let s = `<g stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <line x1="${x}" y1="${groundY - 110}" x2="${x}" y2="${groundY - 60}"/>
        <line x1="${x}" y1="${groundY - 60}" x2="${x - 18}" y2="${groundY}"/>
        <line x1="${x}" y1="${groundY - 60}" x2="${x + 18}" y2="${groundY}"/>
        <line x1="${x}" y1="${sy}" x2="${x + leftArm[0]}" y2="${sy + leftArm[1]}"/>
        <line x1="${x}" y1="${sy}" x2="${x + rightArm[0]}" y2="${sy + rightArm[1]}"/>
    </g>`;
    s += `<circle cx="${x}" cy="${hy}" r="18" fill="#fff" stroke="${color}" stroke-width="6"/>`;
    const eyeDy = opts.tired ? 2 : -1;
    s += opts.closedEyes
        ? `<path d="M${x - 9} ${hy - 1} q3 3 6 0 M${x + 3} ${hy - 1} q3 3 6 0" stroke="${color}" stroke-width="2.5" fill="none"/>`
        : `<circle cx="${x - 6}" cy="${hy + eyeDy}" r="2.5" fill="${color}"/><circle cx="${x + 6}" cy="${hy + eyeDy}" r="2.5" fill="${color}"/>`;
    s += opts.sad
        ? `<path transform="translate(${x} ${hy})" d="M-7 8 Q0 3 7 8" stroke="${color}" stroke-width="3" fill="none"/>`
        : opts.wide
        ? `<path transform="translate(${x} ${hy})" d="M-8 4 Q0 14 8 4" stroke="${color}" stroke-width="3" fill="none"/>`
        : `<path transform="translate(${x} ${hy})" d="M-7 5 Q0 11 7 5" stroke="${color}" stroke-width="3" fill="none"/>`;
    if (opts.sweat) s += `<path d="M${x + 20} ${hy - 14} q5 8 0 14 q-5 -6 0 -14" fill="#4dd0ff" opacity="0.8"/>`;
    return `<g>${s}</g>`;
}

function lyingStickman(cx, cy, color = THEME.ink) {
    return `<g stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <line x1="${cx - 20}" y1="${cy}" x2="${cx + 70}" y2="${cy}"/>
        <line x1="${cx + 70}" y1="${cy}" x2="${cx + 95}" y2="${cy - 16}"/>
        <line x1="${cx + 70}" y1="${cy}" x2="${cx + 95}" y2="${cy + 16}"/>
        <line x1="${cx - 20}" y1="${cy}" x2="${cx - 44}" y2="${cy - 14}"/>
    </g>
    <circle cx="${cx - 46}" cy="${cy}" r="18" fill="#fff" stroke="${color}" stroke-width="6"/>
    <circle cx="${cx - 50}" cy="${cy - 5}" r="2.5" fill="${color}"/><circle cx="${cx - 50}" cy="${cy + 5}" r="2.5" fill="${color}"/>`;
}

function sfx(x, y, text, rotate, fill, fs = 40) {
    return `<text x="${x}" y="${y}" transform="rotate(${rotate} ${x} ${y})" font-size="${fs}"
        font-family="Impact,'Arial Black',sans-serif" fill="${fill}" stroke="${THEME.ink}" stroke-width="2.5"
        paint-order="stroke" font-style="italic">${text}</text>`;
}

function clockFace(cx, cy, r, handAngleDeg, slow) {
    const rad = (handAngleDeg * Math.PI) / 180;
    const hx = cx + Math.sin(rad) * r * 0.55, hy = cy - Math.cos(rad) * r * 0.55;
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/>`;
    s += `<line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="${THEME.ink}" stroke-width="4" stroke-linecap="round"/>`;
    s += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r * 0.3}" stroke="${THEME.ink}" stroke-width="4" stroke-linecap="round"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="4" fill="${THEME.ink}"/>`;
    if (slow) s += `<text x="${cx + r + 14}" y="${cy + 10}" font-size="30" font-family="Impact,sans-serif" fill="${THEME.ink}">...</text>`;
    else {
        for (let i = 0; i < 3; i++) {
            const a = (handAngleDeg - 30 - i * 14) * Math.PI / 180;
            s += `<line x1="${cx + Math.sin(a) * (r + 6)}" y1="${cy - Math.cos(a) * (r + 6)}"
                x2="${cx + Math.sin(a) * (r + 22)}" y2="${cy - Math.cos(a) * (r + 22)}"
                stroke="${THEME.accent}" stroke-width="4" stroke-linecap="round" opacity="${0.8 - i * 0.2}"/>`;
        }
    }
    return s;
}

function lightbulb(cx, cy, r) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffe08a" stroke="${THEME.ink}" stroke-width="5"/>
        <rect x="${cx - r * 0.35}" y="${cy + r * 0.8}" width="${r * 0.7}" height="${r * 0.35}" fill="${THEME.ink}"/>
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
            const rad = a * Math.PI / 180;
            return `<line x1="${cx + Math.sin(rad) * (r + 8)}" y1="${cy - Math.cos(rad) * (r + 8)}"
                x2="${cx + Math.sin(rad) * (r + 24)}" y2="${cy - Math.cos(rad) * (r + 24)}"
                stroke="${THEME.accent}" stroke-width="4" stroke-linecap="round"/>`;
        }).join('')}`;
}

function pitfallHole(cx, cy, w, h) {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${w}" ry="${h}" fill="#1a1a1a"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${w}" ry="${h}" fill="none" stroke="${THEME.ink}" stroke-width="5"/>`;
}

// ── Generic comic-scene wrapper: SVG groups fade/scale in on their word
// trigger, same REVEAL_JS mechanic used throughout this project.
const REVEAL_JS = `
  var seen = {};
  function show(id){ if (seen[id]) return; seen[id] = 1;
    var el = document.getElementById(id); if (el) el.classList.add('on'); }
  function wire(map, fb){
    window.addEventListener('apexframe', function(e){
      var d = e.detail, w = (d.word || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (map[w]) show(map[w]);
      for (var i = 0; i < fb.length; i++) if (d.t > fb[i][1]) show(fb[i][0]);
    });
    document.body.setAttribute('data-ready', '1');
  }
`;
function comicScene({ badge, badgeColor = THEME.accent, groups, revealMap, fallbacks }) {
    const groupsHtml = groups.map(g =>
        `<g id="${g.id}" class="revealgrp off" transform="translate(${g.x || 0} ${g.y || 0})">${g.svg}</g>`
    ).join('\n');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:1080px;height:1920px;overflow:hidden;background:${THEME.paper};
    font-family:Georgia,'Times New Roman',serif;color:${THEME.ink}}
  .badge{position:absolute;top:120px;left:50%;transform:translateX(-50%) rotate(-2deg);
    background:${badgeColor};color:#fff;font:900 56px Impact,'Arial Black',sans-serif;
    padding:4px 30px;box-shadow:6px 6px 0 ${THEME.shadow};white-space:nowrap;z-index:10;
    opacity:0;transition:opacity .4s ease}
  .badge.on{opacity:1}
  svg#stage{position:absolute;left:40px;top:260px;width:1000px;height:1480px}
  .revealgrp{opacity:0;transform:scale(.85);transform-origin:center;
    transition:opacity .4s ease,transform .4s cubic-bezier(.2,1.4,.4,1)}
  .revealgrp.on{opacity:1;transform:scale(1)}
</style></head><body>
  <div class="badge off" id="badge">${badge}</div>
  <svg id="stage" viewBox="0 0 1000 1480" xmlns="http://www.w3.org/2000/svg">
    ${groupsHtml}
  </svg>
<script>${REVEAL_JS}
  var map = ${JSON.stringify(revealMap)};
  wire(map, ${JSON.stringify(fallbacks)});
  // Show the badge immediately alongside the first reveal.
  window.addEventListener('apexframe', function(){ document.getElementById('badge').classList.add('on'); }, { once: true });
</script>
</body></html>`;
    return {
        type: 'html-record', html,
        audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
        viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
    };
}

module.exports = {
    output: {
        title: 'cruel-rules-of-life', format: 'portrait', fps: 30, crf: 23, preset: 'medium',
        // No background music, same rule as the last several videos.
    },
    defaults: { voice: 'am_adam', speed: 1.02, transition: 'fade', transitionDuration: 0.3 },

    scenes: [

        // ── Scene 0 — HOOK ───────────────────────────────────────────────
        {
            tts: { text: "Nobody hands you a rulebook when you're born, but life's got rules anyway. Brutal ones. Here are five of the cruelest, and honestly? Kind of hilarious once you notice them.", pauseAfter: 0.25 },
            captions: false,
            layers: [
                { type: 'background', color: '#efe6d3' },
                comicScene({
                    badge: 'NO RULEBOOK INCLUDED',
                    groups: [
                        { id: 'sm1', x: 400, y: 500, svg: stickman(100, 300, [-40, -40], [40, -40], { wide: true }) },
                        { id: 'book', x: 400, y: 500, svg: `<rect x="-30" y="340" width="60" height="44" rx="4" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/><line x1="0" y1="340" x2="0" y2="384" stroke="${THEME.ink}" stroke-width="3"/><text x="0" y="330" text-anchor="middle" font-size="30" fill="${THEME.accent}" font-family="Impact,sans-serif">?</text>` },
                    ],
                    revealMap: { rulebook: 'sm1', brutal: 'book' },
                    fallbacks: [['sm1', 1], ['book', 3]],
                }),
            ],
        },

        // ── Scene 1 — #5: sleep irony ──────────────────────────────────────
        {
            transition: 'wipe-left',
            tts: { text: "Rule number five: the harder you try to fall asleep, the more awake you somehow get. You close your eyes, your brain goes, 'hey, remember that embarrassing thing from twenty fourteen?' Thanks, brain. Love that for me.", pauseAfter: 0.25 },
            captions: false,
            layers: [
                { type: 'background', color: '#efe6d3' },
                comicScene({
                    badge: '#5 — THE SLEEP TRAP', badgeColor: THEME.accent2,
                    groups: [
                        { id: 'bed', x: 500, y: 600, svg: `<rect x="-180" y="0" width="360" height="90" rx="14" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/><rect x="-180" y="-30" width="70" height="50" rx="10" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/>` },
                        { id: 'sleeper', x: 430, y: 575, svg: lyingStickman(0, 0) },
                        { id: 'bubble', x: 700, y: 420, svg: `<ellipse cx="0" cy="0" rx="160" ry="100" fill="#fff" stroke="${THEME.ink}" stroke-width="4"/><circle cx="-140" cy="70" r="14" fill="#fff" stroke="${THEME.ink}" stroke-width="3"/><circle cx="-160" cy="95" r="8" fill="#fff" stroke="${THEME.ink}" stroke-width="3"/><text x="0" y="-10" text-anchor="middle" font-size="26" font-family="Georgia,serif" fill="${THEME.accent}">remember</text><text x="0" y="24" text-anchor="middle" font-size="26" font-family="Georgia,serif" fill="${THEME.accent}">2014??</text>` },
                    ],
                    revealMap: { eyes: 'bed', eyes2: 'sleeper', brain: 'bubble' },
                    fallbacks: [['bed', 1], ['sleeper', 1.5], ['bubble', 4]],
                }),
            ],
        },

        // ── Scene 2 — #4: invisible work vs applause ───────────────────────
        {
            transition: 'fade',
            tts: { text: "Rule number four: nobody claps for the boring, hard, invisible work. Hours of prep, completely unnoticed. Then you get one lucky break, and suddenly everyone's clapping like you didn't basically get carried there by luck.", pauseAfter: 0.25 },
            captions: false,
            layers: [
                { type: 'background', color: '#efe6d3' },
                comicScene({
                    badge: '#4 — NOBODY CLAPS FOR PREP', badgeColor: THEME.accent2,
                    groups: [
                        { id: 'desk', x: 260, y: 700, svg: `<rect x="-90" y="0" width="180" height="16" fill="${THEME.ink}"/><rect x="-80" y="16" width="14" height="80" fill="${THEME.ink}"/><rect x="66" y="16" width="14" height="80" fill="${THEME.ink}"/>` },
                        { id: 'worker', x: 260, y: 640, svg: stickman(0, 0, [-30, 10], [30, 10], { sweat: true, sad: true }) },
                        { id: 'label1', x: 260, y: 820, svg: `<text x="0" y="0" text-anchor="middle" font-size="30" font-family="Impact,sans-serif" fill="${THEME.ink}">INVISIBLE WORK</text>` },
                        { id: 'spot', x: 760, y: 640, svg: `<ellipse cx="0" cy="40" rx="140" ry="40" fill="#ffe08a" opacity="0.5"/>` },
                        { id: 'winner', x: 760, y: 640, svg: stickman(0, 0, [-40, -50], [40, -50], { wide: true }) },
                        { id: 'clap1', x: 650, y: 560, svg: sfx(0, 0, 'CLAP!', -10, THEME.accent, 34) },
                        { id: 'clap2', x: 870, y: 580, svg: sfx(0, 0, 'CLAP!', 8, THEME.accent2, 34) },
                        { id: 'label2', x: 760, y: 820, svg: `<text x="0" y="0" text-anchor="middle" font-size="30" font-family="Impact,sans-serif" fill="${THEME.accent}">ONE LUCKY BREAK</text>` },
                    ],
                    revealMap: { invisible: 'desk', invisible2: 'worker', unnoticed: 'label1', break: 'spot', break2: 'winner', clapping: 'clap1', luck: 'clap2' },
                    fallbacks: [['desk', 1], ['worker', 1.3], ['label1', 2.5], ['spot', 5], ['winner', 5.3], ['clap1', 6.5], ['clap2', 6.8], ['label2', 7.5]],
                }),
            ],
        },

        // ── Scene 3 — #3: time irony ────────────────────────────────────────
        {
            transition: 'wipe-left',
            tts: { text: "Rule number three: time crawls when you want it to speed up, and sprints when you want it to slow down. Work meeting? Each minute is its own personal hell. Weekend? Gone before you've even put your pants on.", pauseAfter: 0.25 },
            captions: false,
            layers: [
                { type: 'background', color: '#efe6d3' },
                comicScene({
                    badge: '#3 — TIME CHEATS', badgeColor: THEME.accent2,
                    groups: [
                        { id: 'clockslow', x: 260, y: 560, svg: clockFace(0, 0, 90, 90, true) },
                        { id: 'meeting', x: 260, y: 740, svg: stickman(0, 0, [-20, 20], [20, 20], { sad: true }) },
                        { id: 'label1', x: 260, y: 900, svg: `<text x="0" y="0" text-anchor="middle" font-size="28" font-family="Impact,sans-serif" fill="${THEME.ink}">THE MEETING</text>` },
                        { id: 'clockfast', x: 760, y: 560, svg: clockFace(0, 0, 90, 200, false) },
                        { id: 'weekend', x: 760, y: 740, svg: stickman(0, 0, [-40, -40], [40, -40], { wide: true }) },
                        { id: 'label2', x: 760, y: 900, svg: `<text x="0" y="0" text-anchor="middle" font-size="28" font-family="Impact,sans-serif" fill="${THEME.accent}">THE WEEKEND</text>` },
                    ],
                    revealMap: { meeting: 'clockslow', hell: 'meeting', weekend: 'clockfast', pants: 'weekend' },
                    fallbacks: [['clockslow', 1], ['meeting', 1.3], ['label1', 2.5], ['clockfast', 4], ['weekend', 4.3], ['label2', 5.5]],
                }),
            ],
        },

        // ── Scene 4 — #2: recovering decades ────────────────────────────────
        {
            transition: 'fade',
            tts: { text: "Rule number two: you spend your twenties recovering from your childhood, and your thirties recovering from your twenties. At this rate, your eighties are just gonna be one long nap, and honestly, deserved.", pauseAfter: 0.25 },
            captions: false,
            layers: [
                { type: 'background', color: '#efe6d3' },
                comicScene({
                    badge: '#2 — RECOVERY, FOREVER', badgeColor: THEME.accent2,
                    groups: [
                        { id: 'kid', x: 200, y: 650, svg: stickman(0, 0, [-25, -20], [25, -20], { wide: true }) },
                        { id: 'kidlbl', x: 200, y: 760, svg: `<text x="0" y="0" text-anchor="middle" font-size="26" font-family="Impact,sans-serif" fill="${THEME.ink}">CHILDHOOD</text>` },
                        { id: 'twenties', x: 500, y: 650, svg: stickman(0, 0, [-25, 10], [25, 10], { sweat: true }) },
                        { id: 'twlbl', x: 500, y: 760, svg: `<text x="0" y="0" text-anchor="middle" font-size="26" font-family="Impact,sans-serif" fill="${THEME.ink}">20s</text>` },
                        { id: 'thirties', x: 800, y: 650, svg: stickman(0, 0, [-25, 25], [25, 25], { tired: true, sad: true }) },
                        { id: 'thlbl', x: 800, y: 760, svg: `<text x="0" y="0" text-anchor="middle" font-size="26" font-family="Impact,sans-serif" fill="${THEME.accent}">30s</text>` },
                    ],
                    revealMap: { childhood: 'kid', twenties: 'twenties', thirties: 'thirties' },
                    fallbacks: [['kid', 1], ['kidlbl', 1.5], ['twenties', 3], ['twlbl', 3.5], ['thirties', 5], ['thlbl', 5.5]],
                }),
            ],
        },

        // ── Scene 5 — #1: test before lesson (the big twist) ───────────────
        {
            transition: 'wipe-up',
            tts: { text: "And rule number one, the cruelest one: life gives you the test first, and the lesson after. You don't get the manual. You get the pop quiz, you fail it spectacularly, and THEN, only then, someone hands you the textbook.", pauseAfter: 0.25 },
            captions: false,
            layers: [
                { type: 'background', color: '#efe6d3' },
                comicScene({
                    badge: '#1 — TEST FIRST, LESSON LATER',
                    groups: [
                        { id: 'hole', x: 400, y: 760, svg: pitfallHole(0, 0, 110, 40) },
                        { id: 'walker', x: 280, y: 700, svg: stickman(0, 0, [-30, 0], [30, 0], {}) },
                        { id: 'oof', x: 400, y: 680, svg: sfx(0, 0, 'OOF!', -8, THEME.accent, 52) },
                        { id: 'bulb', x: 700, y: 540, svg: lightbulb(0, 0, 60) },
                        { id: 'bulblbl', x: 700, y: 650, svg: `<text x="0" y="0" text-anchor="middle" font-size="26" font-family="Impact,sans-serif" fill="${THEME.accent2}">THE LESSON</text><text x="0" y="34" text-anchor="middle" font-size="22" font-family="Georgia,serif" fill="${THEME.ink}">(a bit late, but ok)</text>` },
                    ],
                    revealMap: { test: 'hole', test2: 'walker', spectacularly: 'oof', textbook: 'bulb' },
                    fallbacks: [['hole', 1], ['walker', 1.3], ['oof', 3.5], ['bulb', 6.5], ['bulblbl', 7]],
                }),
            ],
        },

        // ── Scene 6 — CLOSE + CTA ──────────────────────────────────────────
        {
            transition: 'fade',
            tts: { text: "So yeah. Life's rules are brutal, mostly unfair, and somehow still kind of funny. Subscribe for more of what's really happening, when nobody explains it.", pauseAfter: 0.2 },
            captions: false,
            layers: [
                { type: 'background', color: '#efe6d3' },
                comicScene({
                    badge: '🔔 SUBSCRIBE', badgeColor: THEME.accent2,
                    groups: [
                        { id: 'waver', x: 500, y: 650, svg: stickman(0, 0, [-50, -70], [40, -10], { wide: true }) },
                    ],
                    revealMap: { funny: 'waver' },
                    fallbacks: [['waver', 1]],
                }),
            ],
        },
    ],
};