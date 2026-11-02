// config.cruel-rules-of-life.js
// "5 Cruel Rules of Life (that are kind of hilarious once you notice them)"

const THEME = {
    paper: '#efe6d3', ink: '#231b12',
    accent: '#b5402c', accent2: '#2c6b5a',
    shadow: 'rgba(20,16,10,0.4)',
    highlight: '#ffe08a'
};

// ── Stickman helpers ────────
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
    if (opts.pain) s += `<path d="M${x-30} ${sy} l-15 -10 M${x-35} ${sy+10} l-10 -5 M${x+30} ${sy} l15 -10" stroke="${THEME.accent}" stroke-width="3" stroke-linecap="round"/>`;
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
    if (slow) {
        s += `<text x="${cx + r + 10}" y="${cy + 12}" font-size="40" font-family="Impact,sans-serif" fill="${THEME.ink}">...</text>`;
    } else {
        for (let i = 0; i < 4; i++) {
            const a = (handAngleDeg - 40 - i * 15) * Math.PI / 180;
            s += `<line x1="${cx + Math.sin(a) * (r + 6)}" y1="${cy - Math.cos(a) * (r + 6)}"
                x2="${cx + Math.sin(a) * (r + 30)}" y2="${cy - Math.cos(a) * (r + 30)}"
                stroke="${THEME.accent}" stroke-width="4" stroke-linecap="round" opacity="${0.9 - i * 0.2}"/>`;
        }
    }
    return s;
}

function lightbulb(cx, cy, r) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${THEME.highlight}" stroke="${THEME.ink}" stroke-width="5"/>
        <rect x="${cx - r * 0.35}" y="${cy + r * 0.8}" width="${r * 0.7}" height="${r * 0.35}" fill="${THEME.ink}"/>
        ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
            const rad = a * Math.PI / 180;
            return `<line x1="${cx + Math.sin(rad) * (r + 8)}" y1="${cy - Math.cos(rad) * (r + 8)}"
                x2="${cx + Math.sin(rad) * (r + 26)}" y2="${cy - Math.cos(rad) * (r + 26)}"
                stroke="${THEME.accent}" stroke-width="4" stroke-linecap="round"/>`;
        }).join('')}`;
}

// Curved arrow to connect Left vs Right visuals
function arrow(x1, y1, x2, y2, color = THEME.ink) {
    const dx = x2 - x1, dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    const cx = x1 + dx / 2 - dy * 0.15;
    const cy = y1 + dy / 2 + dx * 0.15;
    const headSize = 16;
    return `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-dasharray="10 8"/>
            <line x1="${x2}" y1="${y2}" x2="${x2 - headSize * Math.cos(angle - 0.5)}" y2="${y2 - headSize * Math.sin(angle - 0.5)}" stroke="${color}" stroke-width="6" stroke-linecap="round"/>
            <line x1="${x2}" y1="${y2}" x2="${x2 - headSize * Math.cos(angle + 0.5)}" y2="${y2 - headSize * Math.sin(angle + 0.5)}" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`;
}

// ── Scene Wrapper (UPDATED: CSS Fill-box, Fade-outs, Scaling) ──────────────
const REVEAL_JS = `
  var seen = {};
  function show(id){ if (seen[id]) return; seen[id] = 1;
    var el = document.getElementById(id); if (el) el.classList.add('on'); }
  function hide(id){ var el = document.getElementById(id); if (el) { el.classList.remove('on'); el.classList.add('fadeout'); } }
  function wire(map, hideMap, fb, hideFb){
    window.addEventListener('apexframe', function(e){
      var d = e.detail, w = (d.word || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (map[w]) show(map[w]);
      if (hideMap && hideMap[w]) hide(hideMap[w]);
      for (var i = 0; i < fb.length; i++) if (d.t > fb[i][1]) show(fb[i][0]);
      if (hideFb) for (var i = 0; i < hideFb.length; i++) if (d.t > hideFb[i][1]) hide(hideFb[i][0]);
    });
    document.body.setAttribute('data-ready', '1');
  }
`;

function comicScene({ badge, badgeColor = THEME.accent, groups, revealMap, hideMap, fallbacks, hideFallbacks = [] }) {
    // Three nested groups: Translate -> Static Scale (for shrinking props) -> Animated Scale (CSS)
    const groupsHtml = groups.map(g =>
        `<g transform="translate(${g.x || 0} ${g.y || 0})">
            <g transform="scale(${g.s || 1})">
                <g id="${g.id}" class="revealgrp off">${g.svg}</g>
            </g>
         </g>`
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
  
  /* FIXED CSS: transform-box: fill-box makes scaling originate from the element's center, not screen center */
  .revealgrp{
    opacity:0;
    transform: scale(.8);
    transform-box: fill-box;
    transform-origin: center;
    transition: opacity .4s ease, transform .4s cubic-bezier(.2,1.4,.4,1);
  }
  .revealgrp.on{opacity:1;transform:scale(1)}
  .revealgrp.fadeout{opacity:0 !important;transform:scale(.7) !important;pointer-events:none}
</style></head><body>
  <div class="badge off" id="badge">${badge}</div>
  <svg id="stage" viewBox="0 0 1000 1480" xmlns="http://www.w3.org/2000/svg">
    ${groupsHtml}
  </svg>
<script>${REVEAL_JS}
  var map = ${JSON.stringify(revealMap || {})};
  var hideMap = ${JSON.stringify(hideMap || {})};
  wire(map, hideMap, ${JSON.stringify(fallbacks)}, ${JSON.stringify(hideFallbacks)});
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
    },
    defaults: { voice: 'am_adam', speed: 1.02, transition: 'fade', transitionDuration: 0.3 },

    scenes: [

        // ── Scene 0 — HOOK (Side-by-side) ──────────────────────────────
        {
            tts: { text: "Nobody hands you a rulebook when you're born, but life's got rules anyway. Brutal ones. Here are five of the cruelest, and honestly? Kind of hilarious once you notice them.", pauseAfter: 0.25 },
            captions: false,
            layers: [
                { type: 'background', color: '#efe6d3' },
                comicScene({
                    badge: 'NO RULEBOOK INCLUDED',
                    groups: [
                        { id: 'sm1', x: 300, y: 750, svg: stickman(0, 0, [-45, -45], [45, -45], { wide: true, sweat: true }) },
                        { id: 'book', x: 700, y: 750, svg: `
                            <rect x="-60" y="-80" width="120" height="160" rx="6" fill="#fff" stroke="${THEME.ink}" stroke-width="6"/>
                            <line x1="0" y1="-80" x2="0" y2="80" stroke="${THEME.ink}" stroke-width="4"/>
                            <text x="0" y="15" text-anchor="middle" font-size="60" fill="${THEME.accent}" font-family="Impact,sans-serif" font-weight="bold">?</text>
                        `},
                        { id: 'arrow1', x: 450, y: 720, svg: arrow(0, 0, 100, 0, THEME.accent) },
                    ],
                    revealMap: { rulebook: 'sm1', brutal: 'book', cruelest: 'arrow1' },
                    fallbacks: [['sm1', 1], ['book', 2], ['arrow1', 4]],
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
                        { id: 'bed', x: 280, y: 780, s: 0.7, svg: `
                            <rect x="-180" y="0" width="360" height="90" rx="10" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/>
                            <rect x="-180" y="-40" width="70" height="50" rx="10" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/>
                        `},
                        { id: 'sleeper', x: 260, y: 750, s: 0.7, svg: lyingStickman(0, 0) },
                        { id: 'arrow2', x: 420, y: 680, svg: arrow(0, 0, 80, -80, THEME.ink) },
                        { id: 'bubble', x: 720, y: 550, s: 0.8, svg: `
                            <ellipse cx="0" cy="0" rx="160" ry="100" fill="#fff" stroke="${THEME.ink}" stroke-width="5"/>
                            <circle cx="-140" cy="70" r="16" fill="#fff" stroke="${THEME.ink}" stroke-width="4"/>
                            <circle cx="-160" cy="100" r="10" fill="#fff" stroke="${THEME.ink}" stroke-width="4"/>
                            <text x="0" y="-10" text-anchor="middle" font-size="26" font-family="Georgia,serif" fill="${THEME.accent}">remember</text>
                            <text x="0" y="25" text-anchor="middle" font-size="32" font-family="Georgia,serif" font-weight="bold" fill="${THEME.accent}">2014??</text>
                        `},
                        { id: 'clock', x: 800, y: 850, s: 0.8, svg: `
                            <rect x="-50" y="-25" width="100" height="50" rx="6" fill="${THEME.ink}"/>
                            <text x="0" y="8" text-anchor="middle" font-size="28" font-family="Courier,monospace" fill="#00ff00">03:14</text>
                            <rect x="-8" y="25" width="16" height="25" fill="${THEME.ink}"/>
                        `},
                    ],
                    revealMap: { eyes: 'bed', awake: 'sleeper', brain: 'bubble', twenty: 'clock' },
                    fallbacks: [['bed', 1], ['sleeper', 1.5], ['clock', 3], ['bubble', 4], ['arrow2', 5]],
                }),
            ],
        },

        // ── Scene 2 — #4: invisible work vs applause (WITH FADE OUT) ───────
        {
            transition: 'fade',
            tts: { text: "Rule number four: nobody claps for the boring, hard, invisible work. Hours of prep, completely unnoticed. Then you get one lucky break, and suddenly everyone's clapping like you didn't basically get carried there by luck.", pauseAfter: 0.25 },
            captions: false,
            layers: [
                { type: 'background', color: '#efe6d3' },
                comicScene({
                    badge: '#4 — NOBODY CLAPS FOR PREP', badgeColor: THEME.accent2,
                    groups: [
                        { id: 'desk', x: 250, y: 800, s: 0.65, svg: `
                            <rect x="-120" y="0" width="240" height="20" fill="${THEME.ink}"/>
                            <rect x="-100" y="20" width="15" height="100" fill="${THEME.ink}"/>
                            <rect x="85" y="20" width="15" height="100" fill="${THEME.ink}"/>
                            <rect x="-80" y="-80" width="100" height="70" rx="5" fill="#fff" stroke="${THEME.ink}" stroke-width="4"/>
                            <path d="M-70 -10 L70 -10 L80 0 L-80 0 Z" fill="${THEME.ink}"/>
                        `},
                        { id: 'worker', x: 250, y: 720, s: 0.65, svg: stickman(0, 0, [-25, 30], [25, 30], { sweat: true, sad: true }) },
                        { id: 'label1', x: 250, y: 850, s: 0.8, svg: `<text x="0" y="0" text-anchor="middle" font-size="30" font-family="Impact,sans-serif" fill="${THEME.ink}">INVISIBLE WORK</text>` },
                        { id: 'arrow3', x: 450, y: 750, svg: arrow(0, 0, 100, 0, THEME.accent) },
                        
                        { id: 'spot', x: 750, y: 750, s: 0.8, svg: `
                            <polygon points="-150,-250 150,-250 250,100 -250,100" fill="${THEME.highlight}" opacity="0.4"/>
                            <ellipse cx="0" cy="100" rx="250" ry="60" fill="${THEME.highlight}" opacity="0.6"/>
                        `},
                        { id: 'winner', x: 750, y: 750, s: 0.8, svg: stickman(0, 0, [-45, -60], [45, -60], { wide: true }) },
                        { id: 'clap1', x: 600, y: 680, svg: sfx(0, 0, 'CLAP!', -15, THEME.accent, 34) },
                        { id: 'clap2', x: 900, y: 680, svg: sfx(0, 0, 'CLAP!', 12, THEME.accent2, 34) },
                        { id: 'label2', x: 750, y: 850, s: 0.8, svg: `<text x="0" y="0" text-anchor="middle" font-size="30" font-family="Impact,sans-serif" fill="${THEME.accent}">LUCKY BREAK</text>` },
                    ],
                    revealMap: { invisible: 'desk', unnoticed: 'label1', break: 'spot', clapping: 'clap1', luck: 'clap2' },
                    hideMap: { clapping: 'desk', luck: 'label1' }, // Fades out the boring side!
                    fallbacks: [['desk', 1], ['worker', 1.3], ['label1', 2.5], ['spot', 4.5], ['winner', 4.8], ['arrow3', 5], ['clap1', 5.5], ['clap2', 5.8], ['label2', 6.0]],
                    hideFallbacks: [['worker', 5.5], ['arrow3', 5.5]]
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
                        { id: 'clockslow', x: 250, y: 480, s: 0.8, svg: clockFace(0, 0, 80, 90, true) },
                        { id: 'meeting', x: 250, y: 750, s: 0.8, svg: `
                            <rect x="-40" y="-20" width="80" height="10" fill="${THEME.ink}"/>
                            <rect x="-35" y="-10" width="10" height="60" fill="${THEME.ink}"/>
                            <rect x="25" y="-10" width="10" height="60" fill="${THEME.ink}"/>
                            ${stickman(0, 0, [-15, 25], [15, 25], { sad: true, closedEyes: true })}
                        `},
                        { id: 'label1', x: 250, y: 880, s: 0.8, svg: `<text x="0" y="0" text-anchor="middle" font-size="28" font-family="Impact,sans-serif" fill="${THEME.ink}">THE MEETING</text>` },
                        
                        { id: 'arrow4', x: 450, y: 650, svg: arrow(0, 0, 100, 0, THEME.ink) },

                        { id: 'clockfast', x: 750, y: 480, s: 0.8, svg: clockFace(0, 0, 80, 200, false) },
                        { id: 'weekend', x: 750, y: 750, s: 0.8, svg: `
                            ${stickman(0, 0, [-50, -60], [40, -20], { wide: true })}
                            <rect x="-16" y="-138" width="12" height="8" fill="${THEME.ink}" rx="2"/>
                            <rect x="4" y="-138" width="12" height="8" fill="${THEME.ink}" rx="2"/>
                            <line x1="-4" y1="-134" x2="4" y2="-134" stroke="${THEME.ink}" stroke-width="2"/>
                        `},
                        { id: 'label2', x: 750, y: 880, s: 0.8, svg: `<text x="0" y="0" text-anchor="middle" font-size="28" font-family="Impact,sans-serif" fill="${THEME.accent}">THE WEEKEND</text>` },
                    ],
                    revealMap: { time: 'clockslow', meeting: 'meeting', hell: 'label1', weekend: 'clockfast', pants: 'arrow4' },
                    fallbacks: [['clockslow', 1], ['meeting', 1.3], ['label1', 2.5], ['clockfast', 3.8], ['weekend', 4.5], ['label2', 5.5], ['arrow4', 3.5]],
                }),
            ],
        },

        // ── Scene 4 — #2: recovering decades (Horizontal) ───────────────────
        {
            transition: 'fade',
            tts: { text: "Rule number two: you spend your twenties recovering from your childhood, and your thirties recovering from your twenties. At this rate, your eighties are just gonna be one long nap, and honestly, deserved.", pauseAfter: 0.25 },
            captions: false,
            layers: [
                { type: 'background', color: '#efe6d3' },
                comicScene({
                    badge: '#2 — RECOVERY, FOREVER', badgeColor: THEME.accent2,
                    groups: [
                        { id: 'kid', x: 200, y: 750, s: 0.75, svg: stickman(0, 0, [-20, -20], [20, -20], { wide: true }) },
                        { id: 'kidlbl', x: 200, y: 850, s: 0.8, svg: `<text x="0" y="0" text-anchor="middle" font-size="26" font-family="Impact,sans-serif" fill="${THEME.ink}">CHILDHOOD</text>` },
                        
                        { id: 'arrow5', x: 300, y: 700, svg: arrow(0, 0, 80, 0, THEME.ink) },

                        { id: 'twenties', x: 500, y: 750, s: 0.75, svg: `
                            ${stickman(0, 0, [-20, 10], [25, 10], { sweat: true })}
                            <rect x="-35" y="-90" width="20" height="40" rx="5" fill="${THEME.ink}"/>
                        `},
                        { id: 'twlbl', x: 500, y: 850, s: 0.8, svg: `<text x="0" y="0" text-anchor="middle" font-size="26" font-family="Impact,sans-serif" fill="${THEME.ink}">20s</text>` },
                        
                        { id: 'arrow6', x: 600, y: 700, svg: arrow(0, 0, 80, 0, THEME.ink) },

                        { id: 'thirties', x: 800, y: 750, s: 0.75, svg: `
                            ${stickman(0, 0, [-20, 15], [25, 15], { tired: true, sad: true, pain: true })}
                            <line x1="35" y1="-20" x2="60" y2="80" stroke="${THEME.ink}" stroke-width="6" stroke-linecap="round"/>
                            <path d="M35 -20 q15 0 15 10" fill="none" stroke="${THEME.ink}" stroke-width="6"/>
                        `},
                        { id: 'thlbl', x: 800, y: 850, s: 0.8, svg: `<text x="0" y="0" text-anchor="middle" font-size="26" font-family="Impact,sans-serif" fill="${THEME.accent}">30s</text>` },
                    ],
                    revealMap: { childhood: 'kid', twenties: 'twenties', thirties: 'thirties' },
                    fallbacks: [['kid', 1], ['kidlbl', 1.2], ['twenties', 3], ['twlbl', 3.2], ['thirties', 5], ['thlbl', 5.2], ['arrow5', 2.5], ['arrow6', 4.5]],
                }),
            ],
        },

        // ── Scene 5 — #1: test before lesson (WITH FADE OUT) ───────────────
        {
            transition: 'wipe-up',
            tts: { text: "And rule number one, the cruelest one: life gives you the test first, and the lesson after. You don't get the manual. You get the pop quiz, you fail it spectacularly, and THEN, only then, someone hands you the textbook.", pauseAfter: 0.25 },
            captions: false,
            layers: [
                { type: 'background', color: '#efe6d3' },
                comicScene({
                    badge: '#1 — TEST FIRST, LESSON LATER',
                    groups: [
                        { id: 'ground', x: 300, y: 800, svg: `<line x1="-150" y1="0" x2="150" y2="0" stroke="${THEME.ink}" stroke-width="6" stroke-linecap="round"/>` },
                        { id: 'hole', x: 300, y: 800, s: 0.8, svg: `
                            <ellipse cx="0" cy="0" rx="90" ry="25" fill="#1a1a1a"/>
                            <path d="M-90 0 Q-110 -20 -60 -15 M90 0 Q110 -20 60 -15" fill="none" stroke="${THEME.ink}" stroke-width="4"/>
                        `},
                        { id: 'walker', x: 150, y: 800, s: 0.75, svg: stickman(0, 0, [-30, -10], [30, -10], { wide: true }) },
                        { id: 'oof', x: 300, y: 720, svg: sfx(0, 0, 'OOF!', -10, THEME.accent, 48) },
                        { id: 'testpaper', x: 300, y: 850, s: 0.8, svg: `
                            <rect x="-25" y="-35" width="50" height="70" fill="#fff" stroke="${THEME.ink}" stroke-width="4"/>
                            <text x="0" y="15" text-anchor="middle" font-size="40" font-family="Impact,sans-serif" fill="${THEME.accent}">F</text>
                        `},
                        
                        { id: 'arrow7', x: 450, y: 750, svg: arrow(0, 0, 100, -100, THEME.accent2) },

                        { id: 'bulb', x: 750, y: 550, s: 0.8, svg: lightbulb(0, 0, 60) },
                        { id: 'book', x: 750, y: 750, s: 0.8, svg: `
                            <rect x="-60" y="-20" width="120" height="80" rx="6" fill="${THEME.accent2}" stroke="${THEME.ink}" stroke-width="5"/>
                            <rect x="-55" y="-15" width="110" height="70" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 4"/>
                            <text x="0" y="25" text-anchor="middle" font-size="24" font-family="Impact,sans-serif" fill="#fff">THE LESSON</text>
                        `},
                        { id: 'bulblbl', x: 750, y: 650, s: 0.8, svg: `<text x="0" y="0" text-anchor="middle" font-size="22" font-family="Georgia,serif" font-style="italic" fill="${THEME.ink}">(a bit late, but ok)</text>` },
                    ],
                    revealMap: { test: 'hole', test2: 'walker', spectacularly: 'oof', textbook: 'bulb' },
                    hideMap: { textbook: 'hole', hands: 'walker' }, // Fades out the pitfall side!
                    fallbacks: [['ground', 0.5], ['hole', 1], ['walker', 1.3], ['oof', 3.0], ['testpaper', 3.5], ['bulb', 6.5], ['book', 7.0], ['bulblbl', 7.5], ['arrow7', 6.2]],
                    hideFallbacks: [['oof', 7.0], ['testpaper', 7.0]]
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
                    badge: 'SUBSCRIBE', badgeColor: THEME.accent,
                    groups: [
                        { id: 'waver', x: 400, y: 750, s: 0.9, svg: stickman(0, 0, [-50, -70], [40, -10], { wide: true }) },
                        { id: 'bell', x: 750, y: 550, s: 0.8, svg: `
                            <path d="M-40 20 L-40 -20 Q-40 -60 0 -60 Q40 -60 40 -20 L40 20 Z" fill="${THEME.highlight}" stroke="${THEME.ink}" stroke-width="6"/>
                            <circle cx="0" cy="30" r="10" fill="${THEME.ink}"/>
                            <path d="M-60 -20 Q-60 -80 0 -80 M60 -20 Q60 -80 0 -80" fill="none" stroke="${THEME.ink}" stroke-width="4" stroke-dasharray="8 8"/>
                        `},
                        { id: 'subbtn', x: 600, y: 850, s: 0.9, svg: `
                            <rect x="-100" y="-30" width="200" height="60" rx="10" fill="${THEME.accent}"/>
                            <text x="0" y="10" text-anchor="middle" font-size="32" font-family="Impact,sans-serif" fill="#fff">SUBSCRIBE</text>
                        `},
                    ],
                    revealMap: { funny: 'waver', subscribe: 'subbtn' },
                    fallbacks: [['waver', 1], ['bell', 2], ['subbtn', 3]],
                }),
            ],
        },
    ],
};