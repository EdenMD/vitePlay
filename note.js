// =============================================================================
// config.f35-conversational-landscape.js — "The F-35: Brilliant or Fragile?"
// v3 — column layouts via the engine's native `layout` system, smaller
// text, more SerpAPI sequences with rotate Ken Burns, more Pexels
// cutaways. No paper-note.html — dropped per request.
// =============================================================================
//
// WHAT CHANGED FROM v2 (dimension-fix pass) AND WHY
// -----------------------------------------------------------------------------
// 1. COLUMN LAYOUT VIA THE ENGINE, NOT MANUAL COORDINATES. The four
//    "native" scenes (sensor fusion, readiness, cooling/delays, 19
//    nations) previously hardcoded x/y per text/stat-counter layer,
//    including side-by-side ROW arrangements (readiness had 3
//    stat-counters at x:420/960/1500). Per documentations/layouting.md,
//    that's exactly what `layout: { type: 'linear', direction: 'column' }`
//    exists to replace — declare the stack, let the engine measure each
//    child's real size and place it, including the same overflow ladder
//    (reposition → widen → tighten line-height → shrink font → 18px
//    floor) if something doesn't fit. All four native scenes below now
//    use it. `html-record` (the dossier scenes) is layout-EXEMPT per the
//    doc's own list, so those scenes are untouched here — the layout
//    system has no visibility into what's inside that HTML template.
//
// 2. SMALLER TEXT. Every native-scene fontSize came down (titles
//    62→46, stat-counters 84→60, subtext 42→30, readiness stat-counters
//    84→58) — this was the actual "clumsy" complaint: oversized text
//    fighting for space in a manually-positioned row. Smaller sizes +
//    column stacking fixes both at once.
//
// 3. MORE SERPAPI, MORE ROTATE. Hook scene upgraded from a single
//    `stock-image` to a `stock-image-sequence` (3 slides). All four
//    native scenes' plain gradient backgrounds swapped for a dark,
//    dimmed `stock-image-sequence` instead — real cinematic texture
//    behind the data instead of a flat gradient. Every sequence mixes in
//    1-2 `rotate-cw`/`rotate-ccw` slides per the "mix, don't
//    uniform-ize" guidance (never every slide).
//
// 4. MORE PEXELS-VIDEO. v2 only had ONE real pexels-video layer in the
//    whole file (scene 8's pivot). Two more added as connective cutaways
//    (before the cost dossier, before the closing verdict) — same role
//    the F-35B file already used this pattern for.
//
// 5. NO paper-note.html — reconsidered after the last pass. That chapter-
//    break scene is now a jet hero-shot cutaway instead: 3 close-in
//    F-35 angles, rotate mixed in, overlay dropped to 0.2 so the jet
//    itself carries the beat with no big text card competing for
//    attention.
//
// 6. MORE JET, LESS HAZE. All four native scenes' cinematic backgrounds
//    swapped from generic aviation queries ('military radar screen dark
//    room', 'aircraft maintenance hangar dark') to explicit F-35 queries,
//    and every overlay across those scenes came down (0.55-0.6 → 0.4-0.42)
//    so the jet stays visible behind the data instead of getting nearly
//    blacked out for text contrast. Text layers already carry
//    `stroke: true` for legibility, so the lighter overlay doesn't cost
//    readability.
//
// Run with:  VIDEO_CONFIG=config.f35-conversational-landscape.js node engine-ci.js

'use strict';

const DOSSIER_SRC = './ApexCasing/dossier-audit-explainer-landscape.html';
const THEME = { paper: '#e9e2ce', ink: '#201d16', accent: '#b3242f', accent2: '#c98a1c' };
const VOICE = 'am_santa';
const CANVAS = { width: 1920, height: 1080 };

function dossierLayer(tag, duration, title, commands) {
  return {
    type: 'html-record', src: `${DOSSIER_SRC}?tag=${tag}`, audioSync: true,
    waitFor: '[data-ready="1"]', duration, fps: 30, cursor: false,
    viewport: CANVAS, x: 0, y: 0, width: CANVAS.width, height: CANVAS.height, fit: 'cover',
    data: { title, theme: THEME, commands },
  };
}

const CAPTIONS = { style: 'highlight', position: 'bottom', fontSize: 46, color: '#ffffff', highlightColor: '#ffd23f', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 4, maxWidth: 0.78 };

// Reusable cinematic backdrop for native scenes — replaces the old flat
// gradient with a dimmed, slowly moving SerpAPI sequence.
function cinematicBg(queries, rotateFirst) {
  return {
    type: 'stock-image-sequence',
    queries, source: 'serpapi', orientation: 'landscape', fit: 'cover',
    kenBurnsSequence: rotateFirst
      ? [
          { kenBurns: 'rotate-cw', kenBurnsAmount: 0.24, rotateDeg: 7 },
          { kenBurns: 'zoom-in',   kenBurnsAmount: 0.26 },
          { kenBurns: 'pan-left',  kenBurnsAmount: 0.24 },
        ]
      : [
          { kenBurns: 'zoom-in',    kenBurnsAmount: 0.26 },
          { kenBurns: 'pan-right',  kenBurnsAmount: 0.24 },
          { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.24, rotateDeg: 7 },
        ],
    x: 0, y: 0, width: CANVAS.width, height: CANVAS.height,
  };
}

module.exports = () => ({
  output: {
    title: 'f35-brilliant-or-fragile-landscape', format: 'landscape',
    width: 1920, height: 1080,
    fps: 30, crf: 20, preset: 'medium',
    bgMusicVol: 0.07, bgMusic: { mood: 'dark' },
    postProcess: { grain: true, grainStrength: 0.02, vignette: true, vignetteStrength: 0.4 },
  },
  defaults: { voice: VOICE, speed: 1.0, transition: 'fade' },
  scenes: [

    // ── SCENE 1 — HOOK — SerpAPI sequence, 3 slides, rotate mixed in ────
    {
      tts: {
        text: "So for those of you who don't know — this is the F-35. Stealth fighter, sensor fusion, and honestly, the most expensive piece of military hardware humanity has ever built. Today we're going to talk about what it actually gets right, and what it's still getting very wrong.",
        voice: VOICE, emotion: 'neutral',
      },
      transition: 'fade', transitionDuration: 0.3,
      captions: CAPTIONS,
      layers: [
        cinematicBg(['F-35 Lightning II fighter jet', 'F-35 cockpit closeup', 'F-35 stealth fighter flying'], false),
        { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
      ],
    },

    // ── SCENE 2 — DOSSIER — mechanism pt.1: stealth (~30s) ──────────────
    {
      tts: {
        text: "Let's start simple. The whole idea behind the F-35 is that it's built to be almost invisible to radar. Its shape, its coating, even the way its panels line up — all of it is designed to scatter radar waves instead of reflecting them straight back. On paper, that means an enemy radar operator might never even know it's there until it's already too late.",
        voice: VOICE, emotion: 'neutral',
      },
      captions: CAPTIONS,
      layers: [ dossierLayer('f35-s2', 30, 'THE PITCH — STEALTH', [
        { id: 'i_stealth', type: 'icon', icon: 'mdi:radar', x: 650, y: 480, size: 170, bg: 'circle', trigger: { atSeconds: 0 } },
        { id: 'lbl_shape', type: 'label', text: 'shape + coating scatter radar waves', x: 1350, y: 440, size: 30, trigger: { wordText: 'coating', occurrence: 1 } },
        { id: 'i_invisible', type: 'icon', icon: 'mdi:eye-off', x: 650, y: 750, size: 140, bg: 'circle', color: THEME.accent2, trigger: { wordText: 'invisible', occurrence: 1 } },
        { id: 'lbl_late', type: 'label', text: 'too late by the time they see you', x: 1350, y: 720, size: 30, trigger: { wordText: 'late', occurrence: 1 } },
        { id: 'pz1', type: 'panZoom', toScale: 1.08, toX: -20, toY: 0, duration: 1.2, trigger: { afterId: 'lbl_late', offset: 0.2 } },
      ]) ],
    },

    // ── SCENE 3 — NATIVE — sensor fusion — COLUMN layout, smaller text ──
    {
      tts: {
        text: "But stealth is only half the pitch. Every F-35 in the sky is constantly sharing what it sees with every other one nearby. One jet spots a threat, and instantly, the entire formation knows exactly where it is. It's less like flying one fighter and more like flying one brain split across a dozen aircraft.",
        voice: VOICE, emotion: 'neutral',
      },
      transition: 'wipe-left', transitionDuration: 0.28,
      captions: CAPTIONS,
      layout: { type: 'linear', direction: 'column', x: 960, y: 260, gap: 34, align: 'center' },
      layers: [
        cinematicBg(['F-35 fighter jet formation flying', 'F-35 cockpit heads up display']),
        { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
        {
          type: 'text', text: 'ONE JET SEES. ALL OF THEM KNOW.', fontSize: 46,
          fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 1500,
          lineHeight: 1.1, gradient: ['#ffd23f', '#ff8c00'], stroke: true, strokeColor: '#000000', strokeWidth: 4,
          glow: true, glowColor: '#ffd23f', glowBlur: 20, animation: 'pop', animDur: 0.35, startT: 0.2,
        },
        {
          type: 'stat-counter', value: 1, suffix: ' SHARED PICTURE', label: 'SENSOR FUSION ACROSS THE FORMATION',
          fontSize: 60, labelSize: 24, color: '#ffd23f', labelColor: '#ffffff', align: 'center',
          glow: true, glowColor: '#ffd23f', glowBlur: 30, countDur: 1.4,
        },
        {
          type: 'text', text: 'One brain, split across a dozen aircraft.', fontSize: 30,
          fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 1200,
          lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 3, animation: 'fade', animDur: 0.35, startT: 1.6,
        },
      ],
    },

    // ── SCENE 4 — PEXELS-VIDEO CUTAWAY (NEW) — bridge into cost section ──
    {
      tts: { text: "Because trust me, it gets expensive fast.", voice: VOICE, emotion: 'neutral' },
      transition: 'zoom-cut', transitionDuration: 0.25,
      captions: CAPTIONS,
      layers: [
        { type: 'pexels-video', query: 'aircraft hangar maintenance', orientation: 'landscape', loop: true, x: 0, y: 0, width: 1920, height: 1080, fit: 'cover', kenBurns: 'pan-right', kenBurnsAmount: 0.1 },
        { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
      ],
    },

    // ── SCENE 5 — DOSSIER — defects pt.1: program cost (~40s) ───────────
    {
      tts: {
        text: "Now here's where things get messy. This program has been running since 1996. The Pentagon plans to keep flying these jets until 2088 — that's a ninety-four year commitment to one aircraft family. Total lifecycle cost: over two point one trillion dollars. That makes it, without argument, the single most expensive weapons program human beings have ever built.",
        voice: VOICE, emotion: 'neutral',
      },
      captions: CAPTIONS,
      layers: [ dossierLayer('f35-s5', 40, 'THE MONEY', [
        { id: 'led_start', type: 'ledgerLine', label: 'PROGRAM START', value: '1996', x: 560, y: 380, width: 620, size: 30, trigger: { wordText: '1996', occurrence: 1 } },
        { id: 'led_end', type: 'ledgerLine', label: 'PLANNED RETIREMENT', value: '2088', x: 560, y: 460, width: 620, size: 30, trigger: { wordText: '2088', occurrence: 1 } },
        { id: 'led_span', type: 'ledgerLine', label: 'COMMITMENT LENGTH', value: '94 YEARS', x: 560, y: 540, width: 620, size: 30, color: THEME.accent2, trigger: { wordText: 'family', occurrence: 1 } },
        { id: 'i_money', type: 'icon', icon: 'mdi:cash-multiple', x: 1400, y: 400, size: 130, bg: 'circle', color: THEME.accent, trigger: { wordText: 'cost', occurrence: 1 } },
        { id: 'st_cost', type: 'stamp', text: '$2.1 TRILLION', x: 1400, y: 620, size: 54, rotate: -4, trigger: { wordText: 'trillion', occurrence: 1 } },
        { id: 'lbl_cost', type: 'label', text: 'most expensive weapons program ever built', x: 1400, y: 720, size: 24, trigger: { afterId: 'st_cost', offset: 0.2 } },
        { id: 'pz2', type: 'panZoom', toScale: 1.1, toX: 20, toY: 0, duration: 1.0, trigger: { afterId: 'lbl_cost', offset: 0.3 } },
      ]) ],
    },

    // ── SCENE 6 — NATIVE — readiness — COLUMN layout, smaller text ──────
    {
      tts: {
        text: "So for two trillion dollars, you'd think these things would actually work when you need them. In 2021, sixty-seven percent of the fleet was mission capable. By 2025, that number had fallen to forty-four percent. And fully mission capable — meaning able to do everything it's designed to do — dropped to just twenty-five percent. One in four jets, ready for everything.",
        voice: VOICE, emotion: 'neutral',
      },
      transition: 'zoom-cut', transitionDuration: 0.25,
      captions: CAPTIONS,
      layout: { type: 'linear', direction: 'column', x: 960, y: 220, gap: 26, align: 'center' },
      layers: [
        cinematicBg(['F-35 fighter jet grounded runway', 'F-35 maintenance hangar'], true),
        { type: 'overlay', color: 'rgba(0,0,0,0.42)' },
        {
          type: 'text', text: 'TWO TRILLION DOLLARS. HOW WELL DOES IT WORK?', fontSize: 38,
          fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 1500,
          lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'pop', animDur: 0.35, startT: 0.1,
        },
        { type: 'stat-counter', value: 67, suffix: '%', label: 'MISSION CAPABLE — 2021', fontSize: 58, labelSize: 20, color: '#ffd23f', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#ffd23f', glowBlur: 26, countDur: 1.0 },
        { type: 'stat-counter', value: 44, suffix: '%', label: 'MISSION CAPABLE — 2025', fontSize: 58, labelSize: 20, color: '#ff8c00', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#ff8c00', glowBlur: 26, countDur: 1.0 },
        { type: 'stat-counter', value: 25, suffix: '%', label: 'FULLY CAPABLE — 1 IN 4', fontSize: 58, labelSize: 20, color: '#b3242f', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#b3242f', glowBlur: 26, countDur: 1.0 },
      ],
    },

    // ── SCENE 7 — DOSSIER — defects pt.2: ballast/radar gag (~35s) ──────
    {
      tts: {
        text: "It gets stranger. In 2025, six brand new F-35s were delivered to the Marine Corps with ballast bolted in exactly where the new radar was supposed to go — because the software running it wasn't finished yet. These jets could fly. They just couldn't fight.",
        voice: VOICE, emotion: 'neutral',
      },
      captions: CAPTIONS,
      layers: [ dossierLayer('f35-s7', 35, 'IT GETS STRANGER', [
        { id: 'led_six', type: 'ledgerLine', label: 'NEW JETS DELIVERED (2025)', value: '6 AIRCRAFT', x: 960, y: 230, width: 680, size: 28, trigger: { wordText: 'six', occurrence: 1 } },
        { id: 'i_radar', type: 'icon', icon: 'mdi:radar', x: 620, y: 500, size: 150, bg: 'circle', trigger: { wordText: 'radar', occurrence: 1 } },
        { id: 're_radar', type: 'redact', target: 'i_radar', duration: 0.5, trigger: { wordText: 'ballast', occurrence: 1 } },
        { id: 'lbl_ballast', type: 'label', text: 'ballast bolted in — not radar', x: 620, y: 650, size: 26, trigger: { afterId: 're_radar', offset: 0.2 } },
        { id: 'st_fight', type: 'stamp', text: 'COULD FLY. COULD NOT FIGHT.', x: 1350, y: 550, size: 38, rotate: -5, trigger: { wordText: 'fight', occurrence: 1 } },
        { id: 'pz3', type: 'panZoom', toScale: 1.08, toX: -10, toY: 0, duration: 1.0, trigger: { afterId: 'st_fight', offset: 0.2 } },
      ]) ],
    },

    // ── SCENE 8 — NATIVE — cooling/Block4/delays — COLUMN, more rotate ──
    {
      tts: {
        text: "And the problems keep stacking. The plane's cooling system is already maxed out at thirty-two kilowatts, but the electronics planned for the next decade need up to eighty. There's simply no room left inside a jet that's already been pushed to its limit. The next major software update, called Block 4, has already slipped to 2031. And in 2024 alone, every single F-35 delivered arrived late — by an average of two hundred and thirty-eight days each.",
        voice: VOICE, emotion: 'neutral',
      },
      transition: 'glitch', transitionDuration: 0.24,
      captions: CAPTIONS,
      layout: { type: 'linear', direction: 'column', x: 960, y: 180, gap: 30, align: 'center' },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: ['F-35 fighter jet cockpit', 'fighter jet electronics circuit board', 'F-35 fighter jet maintenance', 'aircraft radar dish closeup'],
          source: 'serpapi', fit: 'cover', orientation: 'landscape',
          kenBurnsSequence: [
            { kenBurns: 'zoom-in',    kenBurnsAmount: 0.28 },
            { kenBurns: 'rotate-cw',  kenBurnsAmount: 0.24, rotateDeg: 7 },
            { kenBurns: 'pan-left',   kenBurnsAmount: 0.24 },
            { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.24, rotateDeg: 7 },
          ],
          x: 0, y: 0, width: 1920, height: 1080,
        },
        { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
        { type: 'stat-counter', value: 32, suffix: ' kW', label: 'COOLING — ALREADY MAXED', fontSize: 54, labelSize: 18, color: '#ffd23f', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#ffd23f', glowBlur: 24, countDur: 1.0 },
        { type: 'stat-counter', value: 80, suffix: ' kW', label: 'NEEDED — FUTURE ELECTRONICS', fontSize: 54, labelSize: 18, color: '#b3242f', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#b3242f', glowBlur: 24, countDur: 1.0 },
        {
          type: 'text', text: 'BLOCK 4 → 2031', fontSize: 44,
          fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 700,
          gradient: ['#ffd23f', '#ff8c00'], stroke: true, strokeColor: '#000000', strokeWidth: 4,
          glow: true, glowColor: '#ffd23f', glowBlur: 18, animation: 'pop', animDur: 0.35, startT: 1.6,
        },
        { type: 'stat-counter', value: 238, suffix: ' DAYS', label: 'AVERAGE DELIVERY DELAY — 2024', fontSize: 54, labelSize: 20, color: '#ff8c00', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#ff8c00', glowBlur: 24, countDur: 1.0 },
      ],
    },

    // ── SCENE 9 — JET HERO-SHOT CUTAWAY (replaces paper-note) ───────────
    // Deliberately minimal graphics here — light overlay, no big text
    // card, just the jet itself across 3 dramatic angles with rotate
    // mixed in. The bridge line does the work; the visual's job is to
    // just let the F-35 fill the frame.
    {
      tts: { text: "Now — don't get me wrong. This jet isn't garbage. Not even close.", voice: VOICE, emotion: 'neutral' },
      transition: 'fade', transitionDuration: 0.5,
      captions: CAPTIONS,
      layers: [
        {
          type: 'stock-image-sequence',
          queries: ['F-35 fighter jet close up', 'F-35 fighter jet in flight', 'F-35 stealth fighter afterburner'],
          source: 'serpapi', fit: 'cover', orientation: 'landscape',
          kenBurnsSequence: [
            { kenBurns: 'zoom-in',   kenBurnsAmount: 0.3 },
            { kenBurns: 'rotate-cw', kenBurnsAmount: 0.24, rotateDeg: 7 },
            { kenBurns: 'pan-left',  kenBurnsAmount: 0.26 },
          ],
          x: 0, y: 0, width: 1920, height: 1080,
        },
        { type: 'overlay', color: 'rgba(0,0,0,0.2)' },
      ],
    },

    // ── SCENE 10 — PEXELS-VIDEO PIVOT (existing) ─────────────────────────
    {
      tts: { text: "This jet still does things nothing else in the sky can do.", voice: VOICE, emotion: 'neutral' },
      transition: 'zoom-cut', transitionDuration: 0.25,
      captions: CAPTIONS,
      layers: [
        { type: 'pexels-video', query: 'fighter jet flying clouds', orientation: 'landscape', loop: true, x: 0, y: 0, width: 1920, height: 1080, fit: 'cover', kenBurns: 'zoom-out', kenBurnsAmount: 0.1 },
        { type: 'overlay', color: 'rgba(0,0,0,0.3)' },
      ],
    },

    // ── SCENE 11 — DOSSIER — advantages pt.1 (~30s) ───────────────────────
    {
      tts: {
        text: "Nothing else flying today is built to be this hard to detect. In wargames against older fourth-generation fighters, F-35 pilots see the enemy and take the shot first, almost every single time — often before the other side even realizes they're in a fight.",
        voice: VOICE, emotion: 'neutral',
      },
      captions: CAPTIONS,
      layers: [ dossierLayer('f35-s11', 30, 'WHAT IT GETS RIGHT', [
        { id: 'i_stealth2', type: 'icon', icon: 'mdi:shield-check', x: 650, y: 500, size: 170, bg: 'circle', color: THEME.accent2, trigger: { atSeconds: 0 } },
        { id: 'lbl_hard', type: 'label', text: 'hardest jet in the sky to detect', x: 1350, y: 440, size: 28, trigger: { wordText: 'detect', occurrence: 1 } },
        { id: 'led_kill', type: 'ledgerLine', label: 'SEE & SHOOT FIRST', value: 'NEARLY EVERY TIME', x: 1350, y: 560, width: 620, size: 25, trigger: { wordText: 'time', occurrence: 1 } },
        { id: 'pz4', type: 'panZoom', toScale: 1.08, toX: 20, toY: 0, duration: 1.0, trigger: { afterId: 'led_kill', offset: 0.2 } },
        { id: 'lbl_fight', type: 'label', text: 'often before the enemy knows it\'s a fight', x: 1350, y: 660, size: 24, trigger: { wordText: 'fight', occurrence: 1 } },
      ]) ],
    },

    // ── SCENE 12 — NATIVE — 19 nations — COLUMN layout, smaller text ────
    {
      tts: {
        text: "And it's not just America betting on this jet. Nineteen different countries have signed on to fly it. When that many air forces commit that much money to one aircraft, that's its own kind of proof this thing works when it actually counts.",
        voice: VOICE, emotion: 'neutral',
      },
      transition: 'wipe-right', transitionDuration: 0.28,
      captions: CAPTIONS,
      layout: { type: 'linear', direction: 'column', x: 960, y: 340, gap: 40, align: 'center' },
      layers: [
        cinematicBg(['F-35 fighter jets multiple nations', 'F-35 international air force']),
        { type: 'overlay', color: 'rgba(0,0,0,0.42)' },
        { type: 'stat-counter', value: 19, suffix: ' NATIONS', label: 'FLY THE F-35', fontSize: 76, labelSize: 26, color: '#ffd23f', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#ffd23f', glowBlur: 34, countDur: 1.4 },
        {
          type: 'text', text: 'That much money, that many air forces — that\'s proof it works.', fontSize: 30,
          fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 1300,
          lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 3, animation: 'fade', animDur: 0.35, startT: 1.8,
        },
      ],
    },

    // ── SCENE 13 — PEXELS-VIDEO CUTAWAY (NEW) — bridge into the verdict ──
    {
      tts: { text: "So, brilliant, or fragile?", voice: VOICE, emotion: 'neutral' },
      transition: 'zoom-cut', transitionDuration: 0.25,
      captions: CAPTIONS,
      layers: [
        { type: 'pexels-video', query: 'fighter jets formation flying', orientation: 'landscape', loop: true, x: 0, y: 0, width: 1920, height: 1080, fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.1 },
        { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
      ],
    },

    // ── SCENE 14 — DOSSIER — verdict + CTA (~20s) ────────────────────────
    {
      tts: {
        text: "Honestly — both, at exactly the same time. Subscribe for more machines that are just as impressive as they are messy.",
        voice: VOICE, emotion: 'neutral',
      },
      captions: CAPTIONS,
      layers: [ dossierLayer('f35-s14', 20, 'THE VERDICT', [
        { id: 'st_final', type: 'stamp', text: 'BRILLIANT & FRAGILE', x: 960, y: 440, size: 54, rotate: -4, trigger: { wordText: 'time', occurrence: 1 } },
        { id: 'lbl_final', type: 'label', text: 'both, at exactly the same time', x: 960, y: 550, size: 26, trigger: { afterId: 'st_final', offset: 0.2 } },
        { id: 'lbl_sub', type: 'label', text: '🔔 Subscribe for more', x: 960, y: 720, size: 36, trigger: { wordText: 'subscribe', occurrence: 1 } },
        { id: 'pz5', type: 'panZoom', toScale: 1.05, duration: 0.9, trigger: { afterId: 'lbl_sub', offset: 0.2 } },
      ]) ],
    },
  ],
});