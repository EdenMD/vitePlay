// =============================================================================
// config.f35b-audit-v2.js — "F-35B: Brilliant, or Just Fragile?" (long-form)
// =============================================================================
//
// REVISION NOTES vs config.f35b-audit.js (kept for reference, not deleted):
//   - Landscape long-form dimensions (1920x1080) via dossier-audit-explainer.html's
//     new data.canvas support, not vertical shorts.
//   - Dark theme via data.theme.mode: 'dark' (also new in the template).
//   - Voice switched to am_santa ("Jolly, booming" — Voices.md) throughout.
//   - Narration rewritten to talk TO the viewer on every beat ("you", direct
//     address, rhetorical questions) instead of narrating facts in third
//     person, and restructured per the requested arc: cold open → "for
//     those of you who don't know" intro + VERY short mechanics explainer
//     → the bulk of the runtime on defects/problems → an explicit pivot
//     ("this plane ain't that bad, don't get me wrong") → a few real
//     advantages → close.
//   - Camera movement: panZoom used far more aggressively between beats
//     inside the dossier board (zoom toward whichever side of the frame
//     the next stat lands on, zoom back out to reveal), plus kenBurns on
//     every pexels-video cutaway.
//   - Native engine "data representations": a real `chart` layer (bar
//     type — src/layers.js's drawChart) for the mission-capable-rate
//     comparison, composited over the dossier board in scene 3, alongside
//     the dossier's own ledgerLine/stamp/meter elements. `chart` has no
//     word-trigger of its own (it always animates from its own scene's
//     t=0 over `animDur`) — placed in the readiness scene so it's already
//     fully grown and sitting there as supporting evidence by the time
//     the narrator gets to the actual numbers, same as how a real
//     documentary edit often pre-lays a graphic before the line that
//     references it, rather than trying to hit it frame-perfectly.
//   - Pexels stock video: exactly 3 short cutaway clips (generic aviation
//     b-roll — "fighter jet flying", "aircraft hangar", "jets formation" —
//     Pexels is contemporary stock footage, not an archive, so these are
//     mood/connective cutaways, not claimed to literally be F-35B footage;
//     see documentations/Pexels.md's accuracy section). Resolved natively
//     by the engine in Phase 1.1 — no manual fetch code needed here, just
//     `type: 'pexels-video'` layers. PEXELS_API_KEY must be set.
//
// DIMENSION FIX: output block now sets explicit width/height alongside
// format — same gap found and fixed on config.f35-conversational-landscape.js
// earlier ('format: landscape' alone, no explicit width/height). Every
// layer here already used the CANVAS constant (1920x1080) consistently
// for viewport/x/y/width/height, so — same as last time — this was the
// one real gap, not a scene-by-scene repositioning problem.
//
// STRUCTURE — 7 scenes: cold-open cutaway → dossier intro/mechanics →
// cutaway → dossier defects pt.1 (cost + readiness, native chart) →
// dossier defects pt.2 (ballast/radar, cooling, delivery delays) →
// cutaway → dossier pivot/advantages/close. ~556 words of dossier-scene
// narration + 3 short cutaway lines, ≈ 4.5-5 min at a measured pace.
//
// SOURCING: same public GAO reporting (GAO-26-108113, June 2026) and
// contemporaneous defense-press coverage as config.f35b-audit.js — see
// that file's header for the specific figures and their basis. This is
// documentary/encyclopedia-level public information, not operational or
// targeting detail.
//
// Run with:  VIDEO_CONFIG=config.f35b-audit-v2.js node engine-ci.js

'use strict';

const DOSSIER_SRC = './ApexCasing/dossier-audit-explainer.html';
const CANVAS = { width: 1920, height: 1080 };
const DARK_THEME = { mode: 'dark', paper: '#1c1a16', ink: '#efe7d2', accent: '#e2434f', accent2: '#e3a83c', shadow: 'rgba(0,0,0,0.6)' };
const VOICE = 'am_santa'; // "Jolly, booming" — deliberately incongruous with the skeptical content

function dossierLayer(tag, commands, opts = {}) {
  return {
    type: 'html-record', src: `${DOSSIER_SRC}?tag=${tag}`, audioSync: true,
    waitFor: '[data-ready="1"]', duration: opts.duration || 60, fps: 30, cursor: false,
    viewport: CANVAS, x: 0, y: 0, width: CANVAS.width, height: CANVAS.height, fit: 'cover',
    data: { title: opts.title || '', canvas: CANVAS, theme: DARK_THEME, commands },
  };
}

const CAPTIONS = {
  style: 'highlight', position: 'bottom', fontSize: 46, color: '#ffffff',
  highlightColor: '#ffd23f', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 3, maxWidth: 0.78,
};

// ── SCENE: cold open (pexels cutaway #1) ────────────────────────────────
const scene0 = {
  tts: { text: "This... is the F-35B.", voice: VOICE, emotion: 'neutral' },
  captions: CAPTIONS,
  layers: [
    { type: 'background', color: '#0a0a0a' },
    { type: 'pexels-video', query: 'fighter jet flying sky', orientation: 'landscape', resultIndex: 0,
      x: 0, y: 0, width: CANVAS.width, height: CANVAS.height, fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.1 },
  ],
};

// ── SCENE 1: dossier intro + very short mechanics ───────────────────────
const s1cmds = [
  { id: 's_title', type: 'sticker', text: 'F-35B', x: 960, y: 150, size: 110, rotate: -2, trigger: { atSeconds: 0 } },
  { id: 'lbl_sub', type: 'label', text: 'CASE FILE: LIGHTNING II (STOVL)', x: 960, y: 230, size: 26, trigger: { afterId: 's_title', offset: 0.2 } },
  { id: 'pan_in', type: 'panZoom', toScale: 1.08, toX: 0, toY: -30, duration: 1.4, trigger: { afterId: 'lbl_sub', offset: 0.2 } },
  { id: 'i_fan', type: 'icon', icon: 'mdi:fan', x: 650, y: 430, size: 130, bg: 'circle', color: DARK_THEME.accent2, trigger: { wordText: 'fan', occurrence: 1 } },
  { id: 'i_nozzle', type: 'icon', icon: 'mdi:rotate-3d-variant', x: 1270, y: 430, size: 130, bg: 'circle', color: DARK_THEME.accent, trigger: { wordText: 'nozzle', occurrence: 1 } },
  { id: 'i_vents', type: 'icon', icon: 'mdi:arrow-left-right-bold', x: 960, y: 600, size: 100, bg: 'square', trigger: { wordText: 'wings', occurrence: 1 } },
  { id: 'pan_out', type: 'panZoom', toScale: 1, toX: 0, toY: 0, duration: 1.2, trigger: { wordText: 'balanced', occurrence: 1 } },
  { id: 'lbl_pay', type: 'label', text: 'so, what are you actually paying for this?', x: 960, y: 780, size: 32, color: DARK_THEME.accent, trigger: { wordText: 'paying', occurrence: 1 } },
];

// ── SCENE: cutaway #2 ────────────────────────────────────────────────────
const scene2 = {
  tts: { text: "Because trust me, it gets expensive fast.", voice: VOICE, emotion: 'neutral' },
  captions: CAPTIONS,
  layers: [
    { type: 'background', color: '#0a0a0a' },
    { type: 'pexels-video', query: 'aircraft hangar maintenance', orientation: 'landscape', resultIndex: 0,
      x: 0, y: 0, width: CANVAS.width, height: CANVAS.height, fit: 'cover', kenBurns: 'pan-right', kenBurnsAmount: 0.09 },
  ],
};

// ── SCENE 3: defects pt.1 — cost + readiness (+ native chart layer) ─────
const s3cmds = [
  { id: 's_title3', type: 'sticker', text: 'THE COST', x: 960, y: 130, size: 72, rotate: -1, trigger: { atSeconds: 0 } },
  { id: 'pan_cost', type: 'panZoom', toScale: 1.12, toX: -260, toY: 20, duration: 1.3, trigger: { afterId: 's_title3', offset: 0.3 } },
  { id: 'led_start', type: 'ledgerLine', label: 'PROGRAM START', value: '1996', x: 560, y: 320, width: 520, size: 26, trigger: { wordText: '1996', occurrence: 1 } },
  { id: 'led_end', type: 'ledgerLine', label: 'PLANNED RETIREMENT', value: '2088', x: 560, y: 390, width: 520, size: 26, trigger: { wordText: '2088', occurrence: 1 } },
  { id: 'st_cost', type: 'stamp', text: '$2.1 TRILLION', x: 560, y: 540, size: 56, rotate: -4, trigger: { wordText: 'trillion', occurrence: 1 } },
  { id: 'lbl_costsub', type: 'label', text: 'most expensive weapons program ever built', x: 560, y: 630, size: 22, trigger: { afterId: 'st_cost', offset: 0.2 } },
  { id: 'pan_ready', type: 'panZoom', toScale: 1.12, toX: 260, toY: -40, duration: 1.3, trigger: { wordText: 'reliable', occurrence: 1 } },
  { id: 'lbl_readytitle', type: 'label', text: 'MISSION READINESS', x: 1400, y: 260, size: 24, trigger: { afterId: 'pan_ready', offset: 0.3 } },
  { id: 'st_onein4', type: 'stamp', text: 'ONE IN FOUR', x: 960, y: 820, size: 44, rotate: 3, color: DARK_THEME.accent, trigger: { wordText: 'four', occurrence: 1 } },
  { id: 'pan_hold', type: 'panZoom', toScale: 1, toX: 0, toY: 0, duration: 1.2, trigger: { wordText: 'accountable', occurrence: 1 } },
];

// ── SCENE 4: defects pt.2 — ballast/radar, cooling, delivery delays ─────
const s4cmds = [
  { id: 's_title4', type: 'sticker', text: 'THE PROBLEMS', x: 960, y: 130, size: 64, rotate: -1, trigger: { atSeconds: 0 } },
  { id: 'pan_radar', type: 'panZoom', toScale: 1.15, toX: -300, toY: 0, duration: 1.2, trigger: { afterId: 's_title4', offset: 0.3 } },
  { id: 'i_radar', type: 'icon', icon: 'mdi:radar', x: 520, y: 400, size: 130, bg: 'circle', trigger: { wordText: 'radar', occurrence: 1 } },
  { id: 're_radar', type: 'redact', target: 'i_radar', duration: 0.5, trigger: { afterId: 'i_radar', offset: 0.35 } },
  { id: 'lbl_ballast', type: 'label', text: 'ballast, not radar', x: 520, y: 520, size: 24, trigger: { wordText: 'ballast', occurrence: 1 } },
  { id: 'pan_cool', type: 'panZoom', toScale: 1.15, toX: 300, toY: 0, duration: 1.2, trigger: { wordText: 'worry', occurrence: 1 } },
  { id: 'led_cooling', type: 'ledgerLine', label: 'COOLING CAPACITY', value: '32 kW', x: 1400, y: 350, width: 420, size: 24, trigger: { wordText: 'kilowatts', occurrence: 1 } },
  { id: 'led_needed', type: 'ledgerLine', label: 'BLOCK 4 NEEDS', value: 'UP TO 80 kW', x: 1400, y: 420, width: 420, size: 24, color: DARK_THEME.accent, trigger: { wordText: 'eighty', occurrence: 1 } },
  { id: 'pan_center4', type: 'panZoom', toScale: 1, toX: 0, toY: 0, duration: 1.2, trigger: { wordText: '2031', occurrence: 1 } },
  { id: 'st_delay', type: 'stamp', text: 'BLOCK 4 \u2192 2031', x: 960, y: 600, size: 42, rotate: -6, color: DARK_THEME.accent, trigger: { afterId: 'pan_center4', offset: 0.2 } },
  { id: 'led_late', type: 'ledgerLine', label: 'AVG DELIVERY DELAY (2024)', value: '238 DAYS', x: 960, y: 760, width: 680, size: 26, trigger: { wordText: 'days', occurrence: 1 } },
  { id: 'lbl_final3', type: 'label', text: "you already paid. it still can't do its full job.", x: 960, y: 850, size: 26, color: DARK_THEME.accent, trigger: { wordText: 'job', occurrence: 1 } },
];

// ── SCENE: cutaway #3 ────────────────────────────────────────────────────
const scene5 = {
  tts: { text: "Alright, that's a lot to take in. But don't count this jet out just yet.", voice: VOICE, emotion: 'neutral' },
  captions: CAPTIONS,
  layers: [
    { type: 'background', color: '#0a0a0a' },
    { type: 'pexels-video', query: 'fighter jets formation flying', orientation: 'landscape', resultIndex: 0,
      x: 0, y: 0, width: CANVAS.width, height: CANVAS.height, fit: 'cover', kenBurns: 'zoom-out', kenBurnsAmount: 0.1 },
  ],
};

// ── SCENE 6: pivot + advantages + close ──────────────────────────────────
const s6cmds = [
  { id: 's_title6', type: 'sticker', text: 'THE VERDICT', x: 960, y: 140, size: 70, rotate: -1, trigger: { atSeconds: 0 } },
  { id: 'pan_wide6', type: 'panZoom', toScale: 1.1, toX: 0, toY: -20, duration: 1.3, trigger: { afterId: 's_title6', offset: 0.3 } },
  { id: 'st_notbad', type: 'stamp', text: 'NOT THAT BAD', x: 960, y: 330, size: 50, rotate: -3, color: DARK_THEME.accent2, trigger: { wordText: 'wrong', occurrence: 1 } },
  { id: 'i_stovl', type: 'icon', icon: 'mdi:arrow-down-bold-circle', x: 600, y: 500, size: 120, bg: 'circle', color: DARK_THEME.accent2, trigger: { wordText: 'runway', occurrence: 1 } },
  { id: 'lbl_stovl', type: 'label', text: 'no other jet in production can do this', x: 600, y: 610, size: 24, trigger: { afterId: 'i_stovl', offset: 0.2 } },
  { id: 'i_harrier', type: 'icon', icon: 'mdi:history', x: 1320, y: 500, size: 110, bg: 'circle', trigger: { wordText: 'harrier', occurrence: 1 } },
  { id: 'lbl_harrier', type: 'label', text: 'evolution of the Harrier idea', x: 1320, y: 600, size: 24, trigger: { afterId: 'i_harrier', offset: 0.2 } },
  { id: 'pan_qb', type: 'panZoom', toScale: 1.15, toX: 0, toY: 40, duration: 1.2, trigger: { wordText: 'quarterback', occurrence: 1 } },
  { id: 'i_qb', type: 'icon', icon: 'mdi:radar', x: 960, y: 730, size: 120, bg: 'circle', color: DARK_THEME.accent2, trigger: { afterId: 'pan_qb', offset: 0.2 } },
  { id: 'lbl_qb', type: 'label', text: 'shares data with everything nearby', x: 960, y: 840, size: 24, trigger: { afterId: 'i_qb', offset: 0.2 } },
  { id: 'pan_final6', type: 'panZoom', toScale: 1, toX: 0, toY: 0, duration: 1.4, trigger: { wordText: 'marines', occurrence: 1 } },
  { id: 'led_marines', type: 'ledgerLine', label: 'MARINE CORPS', value: 'OPERATES OFF SMALLER SHIPS', x: 960, y: 780, width: 760, size: 24, trigger: { afterId: 'pan_final6', offset: 0.3 } },
  { id: 'st_final', type: 'stamp', text: 'BRILLIANT AND FRAGILE', x: 960, y: 850, size: 44, rotate: 2, color: DARK_THEME.accent, trigger: { wordText: 'both', occurrence: 1 } },
];

module.exports = {
  output: {
    title: 'f35b-brilliant-or-fragile-longform', format: 'landscape',
    width: 1920, height: 1080,
    fps: 30, crf: 20, preset: 'medium',
    bgMusicVol: 0.07, bgMusic: { mood: 'dark' },
    postProcess: { grain: true, grainStrength: 0.02, vignette: false },
  },
  defaults: { voice: VOICE, speed: 1.0, transition: 'fade' },
  scenes: [
    scene0,
    { tts: { text: "Alright, for those of you who don't know, let me introduce you to the F-35B Lightning II. Look at this thing, this is the version of the F-35 that can take off in under two hundred feet, hover in midair like a helicopter, and set itself straight down on a ship or a road. How does it pull that off? Real quick: a fan behind the cockpit blows air straight down, the engine's rear nozzle swivels down too, and small vents in the wings keep it balanced. Three separate systems, working together, in real time. That's the setup. Now let's talk about what you're actually paying for.", voice: VOICE, emotion: 'neutral' },
      captions: CAPTIONS, layers: [ dossierLayer('f35b2-s1', s1cmds, { duration: 55, title: 'CASE FILE 01' }) ] },
    scene2,
    { tts: { text: "Here's where I have to be honest with you. This program has been running since 1996, and the Pentagon wants to keep flying these jets all the way until 2088. Add it all up, and you're looking at over two trillion dollars, the most expensive weapons program human beings have ever built. So, does that kind of money buy you a reliable jet? Not really. Back in 2021, sixty-seven percent of the fleet was mission capable. By 2025, that number had dropped to forty-four percent. And if you're only counting jets that can do everything they're supposed to do, you're down to twenty-five percent. That's one in four. You paid trillions, and three out of four jets can't fully do their job on any given day. And government auditors say the Pentagon hasn't even consistently held the manufacturer accountable for any of it.", voice: VOICE, emotion: 'neutral' },
      captions: CAPTIONS,
      layers: [
        dossierLayer('f35b2-s3', s3cmds, { duration: 65, title: 'CASE FILE 02' }),
        { type: 'chart', chartType: 'bar', x: 1150, y: 330, width: 600, height: 430, animDur: 1.4,
          data: [ { value: 67, label: 'MC \u201921' }, { value: 44, label: 'MC \u201925' }, { value: 25, label: 'FMC \u201925' } ],
          colors: [DARK_THEME.accent2, DARK_THEME.accent2, DARK_THEME.accent] },
      ] },
    { tts: { text: "It gets worse. In 2025, six brand new F-35Bs got delivered to the Marine Corps with ballast bolted in where the radar was supposed to go, because the software wasn't ready. Think about that, a brand new fighter jet, and you're handed one with weights instead of a radar. And here's the part that should really worry you: the cooling system on this jet is already maxed out at thirty-two kilowatts, but the electronics planned for the next decade need up to eighty. There's no room left to grow, engineers used it all up. So the next big upgrade, Block 4, just got pushed back to 2031. And in 2024, every single delivered jet showed up late, by an average of two hundred thirty-eight days. This is a jet you already paid for, sitting on the ground unable to do its full job.", voice: VOICE, emotion: 'neutral' },
      captions: CAPTIONS, layers: [ dossierLayer('f35b2-s4', s4cmds, { duration: 65, title: 'CASE FILE 03' }) ] },
    scene5,
    { tts: { text: "Now, however, and I want to be fair with you here, this plane ain't that bad. Don't get me wrong. Nothing else in production on Earth can do what this jet does: land vertically on a road or a small ship deck, no runway required. That's a real, working evolution of the old Harrier idea, and nobody else has matched it. It also shares what it sees with everything around it in real time, so it acts less like a lone fighter and more like a quarterback for the whole battlefield. And for the Marines, it means real air power off ships that aren't full aircraft carriers. So is it brilliant, or is it fragile? Judging by everything you just heard, I'd say it's both, and you deserve to know that before anyone tells you it's simple.", voice: VOICE, emotion: 'neutral' },
      captions: CAPTIONS, layers: [ dossierLayer('f35b2-s6', s6cmds, { duration: 65, title: 'CASE FILE 04' }) ] },
  ],
};