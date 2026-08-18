// =============================================================================
// config.f35-conversational-landscape.js — "The F-35: Brilliant or Fragile?"
// CORRECTED to true landscape (1920x1080). Uses dossier-audit-explainer-
// landscape.html (dimension-fixed casing) — NOT the portrait original.
// Every element below is repositioned for a wide frame (center 960/540,
// horizontal pairing instead of vertical stacking) — not just resized.
//
// Same 11-scene structure, same am_santa voice, same 2 pexels-video clips,
// same verified GAO figures as the portrait version.
//
// DIMENSION FIX: output block now sets explicit width/height alongside
// format — 'format: landscape' alone was the exact gap that caused
// silent portrait-default issues on an earlier long-form file in this
// project. Every layer's own x/y/width/height was already correctly
// converted to the 1920x1080 frame (checked line by line — nothing left
// over at portrait-style coordinates), so this was the one real gap.
//
// Run with:  VIDEO_CONFIG=config.f35-conversational-landscape.js node engine-ci.js

'use strict';

const DOSSIER_SRC = './ApexCasing/dossier-audit-explainer-landscape.html';
const THEME = { paper: '#e9e2ce', ink: '#201d16', accent: '#b3242f', accent2: '#c98a1c' };
const VOICE = 'am_santa';

function dossierLayer(tag, duration, title, commands) {
  return {
    type: 'html-record', src: `${DOSSIER_SRC}?tag=${tag}`, audioSync: true,
    waitFor: '[data-ready="1"]', duration, fps: 30,
    viewport: { width: 1920, height: 1080 }, x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
    data: { title, theme: THEME, commands },
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

    // ── SCENE 1 — HOOK (pexels-video, ~15s) ─────────────────────────────
    {
      tts: {
        text: "So for those of you who don't know — this is the F-35. Stealth fighter, sensor fusion, and honestly, the most expensive piece of military hardware humanity has ever built. Today we're going to talk about what it actually gets right, and what it's still getting very wrong.",
        voice: VOICE, emotion: 'neutral',
      },
      transition: 'fade', transitionDuration: 0.3,
      captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#ffffff', highlightColor: '#ffd23f', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 4, maxWidth: 0.8 },
      layers: [
        { type: 'stock-image', query: 'F-35 Lightning II fighter jet', source: 'serpapi', orientation: 'landscape', imageIndex: 0, x: 0, y: 0, width: 1920, height: 1080, fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.14 },
        { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
      ],
    },

    // ── SCENE 2 — DOSSIER — mechanism pt.1: stealth (~30s) ──────────────
    // Landscape layout: icon LEFT column, labels RIGHT column, side by side.
    {
      tts: {
        text: "Let's start simple. The whole idea behind the F-35 is that it's built to be almost invisible to radar. Its shape, its coating, even the way its panels line up — all of it is designed to scatter radar waves instead of reflecting them straight back. On paper, that means an enemy radar operator might never even know it's there until it's already too late.",
        voice: VOICE, emotion: 'neutral',
      },
      captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#ffffff', highlightColor: '#ffd23f', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 4, maxWidth: 0.8 },
      layers: [ dossierLayer('f35-s2', 30, 'THE PITCH — STEALTH', [
        { id: 'i_stealth', type: 'icon', icon: 'mdi:radar', x: 650, y: 480, size: 170, bg: 'circle', trigger: { atSeconds: 0 } },
        { id: 'lbl_shape', type: 'label', text: 'shape + coating scatter radar waves', x: 1350, y: 440, size: 30, trigger: { wordText: 'coating', occurrence: 1 } },
        { id: 'i_invisible', type: 'icon', icon: 'mdi:eye-off', x: 650, y: 750, size: 140, bg: 'circle', color: THEME.accent2, trigger: { wordText: 'invisible', occurrence: 1 } },
        { id: 'lbl_late', type: 'label', text: 'too late by the time they see you', x: 1350, y: 720, size: 30, trigger: { wordText: 'late', occurrence: 1 } },
        { id: 'pz1', type: 'panZoom', toScale: 1.08, toX: -20, toY: 0, duration: 1.2, trigger: { afterId: 'lbl_late', offset: 0.2 } },
      ]) ],
    },

    // ── SCENE 3 — NATIVE — mechanism pt.2: sensor fusion (~25s) ─────────
    {
      tts: {
        text: "But stealth is only half the pitch. Every F-35 in the sky is constantly sharing what it sees with every other one nearby. One jet spots a threat, and instantly, the entire formation knows exactly where it is. It's less like flying one fighter and more like flying one brain split across a dozen aircraft.",
        voice: VOICE, emotion: 'neutral',
      },
      transition: 'wipe-left', transitionDuration: 0.28,
      captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#ffffff', highlightColor: '#ffd23f', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 4, maxWidth: 0.8 },
      layers: [
        { type: 'gradient', gradientType: 'linear', colors: ['#050505', '#0d1a2e', '#050505'], angle: 110, vignette: true, vignetteStrength: 0.5 },
        {
          type: 'text', text: 'ONE JET SEES. ALL OF THEM KNOW.', x: 960, y: 220, fontSize: 62,
          fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 1600,
          lineHeight: 1.1, gradient: ['#ffd23f', '#ff8c00'], stroke: true, strokeColor: '#000000', strokeWidth: 5,
          glow: true, glowColor: '#ffd23f', glowBlur: 26, animation: 'pop', animDur: 0.35, startT: 0.2,
        },
        {
          type: 'stat-counter', value: 1, suffix: ' SHARED PICTURE', label: 'SENSOR FUSION ACROSS THE FORMATION',
          x: 960, y: 560, fontSize: 84, labelSize: 30, color: '#ffd23f', labelColor: '#ffffff', align: 'center',
          glow: true, glowColor: '#ffd23f', glowBlur: 40, countDur: 1.4,
        },
        {
          type: 'text', text: 'One brain, split across a dozen aircraft.', x: 960, y: 830, fontSize: 42,
          fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 1400,
          lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.35, startT: 1.6,
        },
      ],
    },

    // ── SCENE 4 — DOSSIER — defects pt.1: program cost (~40s) ───────────
    {
      tts: {
        text: "Now here's where things get messy. This program has been running since 1996. The Pentagon plans to keep flying these jets until 2088 — that's a ninety-four year commitment to one aircraft family. Total lifecycle cost: over two point one trillion dollars. That makes it, without argument, the single most expensive weapons program human beings have ever built.",
        voice: VOICE, emotion: 'neutral',
      },
      captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#ffffff', highlightColor: '#ffd23f', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 4, maxWidth: 0.8 },
      layers: [ dossierLayer('f35-s4', 40, 'THE MONEY', [
        { id: 'led_start', type: 'ledgerLine', label: 'PROGRAM START', value: '1996', x: 560, y: 380, width: 620, size: 30, trigger: { wordText: '1996', occurrence: 1 } },
        { id: 'led_end', type: 'ledgerLine', label: 'PLANNED RETIREMENT', value: '2088', x: 560, y: 460, width: 620, size: 30, trigger: { wordText: '2088', occurrence: 1 } },
        { id: 'led_span', type: 'ledgerLine', label: 'COMMITMENT LENGTH', value: '94 YEARS', x: 560, y: 540, width: 620, size: 30, color: THEME.accent2, trigger: { wordText: 'family', occurrence: 1 } },
        { id: 'i_money', type: 'icon', icon: 'mdi:cash-multiple', x: 1400, y: 400, size: 130, bg: 'circle', color: THEME.accent, trigger: { wordText: 'cost', occurrence: 1 } },
        { id: 'st_cost', type: 'stamp', text: '$2.1 TRILLION', x: 1400, y: 620, size: 54, rotate: -4, trigger: { wordText: 'trillion', occurrence: 1 } },
        { id: 'lbl_cost', type: 'label', text: 'most expensive weapons program ever built', x: 1400, y: 720, size: 24, trigger: { afterId: 'st_cost', offset: 0.2 } },
        { id: 'pz2', type: 'panZoom', toScale: 1.1, toX: 20, toY: 0, duration: 1.0, trigger: { afterId: 'lbl_cost', offset: 0.3 } },
      ]) ],
    },

    // ── SCENE 5 — NATIVE — defects pt.1b: readiness (~40s) ──────────────
    {
      tts: {
        text: "So for two trillion dollars, you'd think these things would actually work when you need them. In 2021, sixty-seven percent of the fleet was mission capable. By 2025, that number had fallen to forty-four percent. And fully mission capable — meaning able to do everything it's designed to do — dropped to just twenty-five percent. One in four jets, ready for everything.",
        voice: VOICE, emotion: 'neutral',
      },
      transition: 'zoom-cut', transitionDuration: 0.25,
      captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#ffffff', highlightColor: '#ffd23f', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 4, maxWidth: 0.8 },
      layers: [
        { type: 'gradient', gradientType: 'linear', colors: ['#050505', '#1a0d0d', '#050505'], angle: 110, vignette: true, vignetteStrength: 0.55 },
        {
          type: 'text', text: 'TWO TRILLION DOLLARS. HOW WELL DOES IT WORK?', x: 960, y: 190, fontSize: 46,
          fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 1700,
          lineHeight: 1.2, stroke: true, strokeColor: '#000000', strokeWidth: 5, animation: 'pop', animDur: 0.35, startT: 0.1,
        },
        { type: 'stat-counter', value: 67, suffix: '%', label: 'MISSION CAPABLE — 2021', x: 420, y: 620, fontSize: 84, labelSize: 24, color: '#ffd23f', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#ffd23f', glowBlur: 40, countDur: 1.0 },
        { type: 'stat-counter', value: 44, suffix: '%', label: 'MISSION CAPABLE — 2025', x: 960, y: 620, fontSize: 84, labelSize: 24, color: '#ff8c00', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#ff8c00', glowBlur: 40, countDur: 1.0 },
        { type: 'stat-counter', value: 25, suffix: '%', label: 'FULLY CAPABLE — 1 IN 4', x: 1500, y: 620, fontSize: 84, labelSize: 24, color: '#b3242f', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#b3242f', glowBlur: 40, countDur: 1.0 },
      ],
    },

    // ── SCENE 6 — DOSSIER — defects pt.2: ballast/radar gag (~35s) ──────
    {
      tts: {
        text: "It gets stranger. In 2025, six brand new F-35s were delivered to the Marine Corps with ballast bolted in exactly where the new radar was supposed to go — because the software running it wasn't finished yet. These jets could fly. They just couldn't fight.",
        voice: VOICE, emotion: 'neutral',
      },
      captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#ffffff', highlightColor: '#ffd23f', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 4, maxWidth: 0.8 },
      layers: [ dossierLayer('f35-s6', 35, 'IT GETS STRANGER', [
        { id: 'led_six', type: 'ledgerLine', label: 'NEW JETS DELIVERED (2025)', value: '6 AIRCRAFT', x: 960, y: 230, width: 680, size: 28, trigger: { wordText: 'six', occurrence: 1 } },
        { id: 'i_radar', type: 'icon', icon: 'mdi:radar', x: 620, y: 500, size: 150, bg: 'circle', trigger: { wordText: 'radar', occurrence: 1 } },
        { id: 're_radar', type: 'redact', target: 'i_radar', duration: 0.5, trigger: { wordText: 'ballast', occurrence: 1 } },
        { id: 'lbl_ballast', type: 'label', text: 'ballast bolted in — not radar', x: 620, y: 650, size: 26, trigger: { afterId: 're_radar', offset: 0.2 } },
        { id: 'st_fight', type: 'stamp', text: 'COULD FLY. COULD NOT FIGHT.', x: 1350, y: 550, size: 38, rotate: -5, trigger: { wordText: 'fight', occurrence: 1 } },
        { id: 'pz3', type: 'panZoom', toScale: 1.08, toX: -10, toY: 0, duration: 1.0, trigger: { afterId: 'st_fight', offset: 0.2 } },
      ]) ],
    },

    // ── SCENE 7 — NATIVE — defects pt.2b: cooling/Block4/delays (~40s) ──
    {
      tts: {
        text: "And the problems keep stacking. The plane's cooling system is already maxed out at thirty-two kilowatts, but the electronics planned for the next decade need up to eighty. There's simply no room left inside a jet that's already been pushed to its limit. The next major software update, called Block 4, has already slipped to 2031. And in 2024 alone, every single F-35 delivered arrived late — by an average of two hundred and thirty-eight days each.",
        voice: VOICE, emotion: 'neutral',
      },
      transition: 'glitch', transitionDuration: 0.24,
      captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#ffffff', highlightColor: '#ffd23f', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 4, maxWidth: 0.8 },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: ['fighter jet electronics circuit board', 'aircraft cockpit avionics panel', 'military aircraft maintenance hangar'],
          source: 'serpapi', fit: 'cover', orientation: 'landscape',
          kenBurnsSequence: [
            { kenBurns: 'zoom-in', kenBurnsAmount: 0.3 },
            { kenBurns: 'rotate-cw', kenBurnsAmount: 0.26, rotateDeg: 8 },
            { kenBurns: 'pan-left', kenBurnsAmount: 0.26 },
          ],
          x: 0, y: 0, width: 1920, height: 1080,
        },
        { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
        { type: 'stat-counter', value: 32, suffix: ' kW', label: 'COOLING — ALREADY MAXED', x: 560, y: 300, fontSize: 74, labelSize: 22, color: '#ffd23f', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#ffd23f', glowBlur: 36, countDur: 1.0 },
        { type: 'stat-counter', value: 80, suffix: ' kW', label: 'NEEDED — FUTURE ELECTRONICS', x: 1360, y: 300, fontSize: 74, labelSize: 22, color: '#b3242f', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#b3242f', glowBlur: 36, countDur: 1.0 },
        {
          type: 'text', text: 'BLOCK 4 → 2031', x: 960, y: 560, fontSize: 60,
          fontFamily: 'Impact, Arial Black, sans-serif', color: '#ffffff', align: 'center', maxWidth: 900,
          gradient: ['#ffd23f', '#ff8c00'], stroke: true, strokeColor: '#000000', strokeWidth: 5,
          glow: true, glowColor: '#ffd23f', glowBlur: 24, animation: 'pop', animDur: 0.35, startT: 1.6,
        },
        { type: 'stat-counter', value: 238, suffix: ' DAYS', label: 'AVERAGE DELIVERY DELAY — 2024', x: 960, y: 830, fontSize: 74, labelSize: 24, color: '#ff8c00', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#ff8c00', glowBlur: 36, countDur: 1.0 },
      ],
    },

    // ── SCENE 8 — PIVOT (pexels-video, ~10s) ─────────────────────────────
    {
      tts: {
        text: "Now — don't get me wrong. This jet isn't garbage. Not even close.",
        voice: VOICE, emotion: 'neutral',
      },
      transition: 'zoom-cut', transitionDuration: 0.25,
      captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#ffffff', highlightColor: '#ffd23f', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 4, maxWidth: 0.8 },
      layers: [
        { type: 'pexels-video', query: 'fighter jet flying clouds', orientation: 'landscape', loop: true, x: 0, y: 0, width: 1920, height: 1080, fit: 'cover' },
        { type: 'overlay', color: 'rgba(0,0,0,0.3)' },
      ],
    },

    // ── SCENE 9 — DOSSIER — advantages pt.1 (~30s) ───────────────────────
    {
      tts: {
        text: "Nothing else flying today is built to be this hard to detect. In wargames against older fourth-generation fighters, F-35 pilots see the enemy and take the shot first, almost every single time — often before the other side even realizes they're in a fight.",
        voice: VOICE, emotion: 'neutral',
      },
      captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#ffffff', highlightColor: '#ffd23f', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 4, maxWidth: 0.8 },
      layers: [ dossierLayer('f35-s9', 30, 'WHAT IT GETS RIGHT', [
        { id: 'i_stealth2', type: 'icon', icon: 'mdi:shield-check', x: 650, y: 500, size: 170, bg: 'circle', color: THEME.accent2, trigger: { atSeconds: 0 } },
        { id: 'lbl_hard', type: 'label', text: 'hardest jet in the sky to detect', x: 1350, y: 440, size: 28, trigger: { wordText: 'detect', occurrence: 1 } },
        { id: 'led_kill', type: 'ledgerLine', label: 'SEE & SHOOT FIRST', value: 'NEARLY EVERY TIME', x: 1350, y: 560, width: 620, size: 25, trigger: { wordText: 'time', occurrence: 1 } },
        { id: 'pz4', type: 'panZoom', toScale: 1.08, toX: 20, toY: 0, duration: 1.0, trigger: { afterId: 'led_kill', offset: 0.2 } },
        { id: 'lbl_fight', type: 'label', text: 'often before the enemy knows it\'s a fight', x: 1350, y: 660, size: 24, trigger: { wordText: 'fight', occurrence: 1 } },
      ]) ],
    },

    // ── SCENE 10 — NATIVE — advantages pt.2: 19 nations (~25s) ──────────
    {
      tts: {
        text: "And it's not just America betting on this jet. Nineteen different countries have signed on to fly it. When that many air forces commit that much money to one aircraft, that's its own kind of proof this thing works when it actually counts.",
        voice: VOICE, emotion: 'neutral',
      },
      transition: 'wipe-right', transitionDuration: 0.28,
      captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#ffffff', highlightColor: '#ffd23f', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 4, maxWidth: 0.8 },
      layers: [
        { type: 'gradient', gradientType: 'linear', colors: ['#050505', '#0d1a2e', '#050505'], angle: 110, vignette: true, vignetteStrength: 0.5 },
        { type: 'stat-counter', value: 19, suffix: ' NATIONS', label: 'FLY THE F-35', x: 960, y: 480, fontSize: 100, labelSize: 32, color: '#ffd23f', labelColor: '#ffffff', align: 'center', glow: true, glowColor: '#ffd23f', glowBlur: 46, countDur: 1.4 },
        {
          type: 'text', text: 'That much money, that many air forces — that\'s proof it works.', x: 960, y: 760, fontSize: 40,
          fontFamily: 'Arial Black, Impact, sans-serif', color: '#ffffff', align: 'center', maxWidth: 1500,
          lineHeight: 1.3, stroke: true, strokeColor: '#000000', strokeWidth: 4, animation: 'fade', animDur: 0.35, startT: 1.8,
        },
      ],
    },

    // ── SCENE 11 — DOSSIER — verdict + CTA (~20s) ────────────────────────
    {
      tts: {
        text: "So, brilliant, or fragile? Honestly — both, at exactly the same time. Subscribe for more machines that are just as impressive as they are messy.",
        voice: VOICE, emotion: 'neutral',
      },
      captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#ffffff', highlightColor: '#ffd23f', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 4, maxWidth: 0.8 },
      layers: [ dossierLayer('f35-s11', 20, 'THE VERDICT', [
        { id: 'st_final', type: 'stamp', text: 'BRILLIANT & FRAGILE', x: 960, y: 440, size: 54, rotate: -4, trigger: { wordText: 'time', occurrence: 1 } },
        { id: 'lbl_final', type: 'label', text: 'both, at exactly the same time', x: 960, y: 550, size: 26, trigger: { afterId: 'st_final', offset: 0.2 } },
        { id: 'lbl_sub', type: 'label', text: '🔔 Subscribe for more', x: 960, y: 720, size: 36, trigger: { wordText: 'subscribe', occurrence: 1 } },
        { id: 'pz5', type: 'panZoom', toScale: 1.05, duration: 0.9, trigger: { afterId: 'lbl_sub', offset: 0.2 } },
      ]) ],
    },
  ],
});