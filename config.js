// =============================================================================
// "Coffee vs Sleep — The Science" — single-scene test config for
// ApexCasing/paper-sticker-explainer.html
// =============================================================================
//
// PURPOSE: exercise every command type the new template supports in one
// real render — sticker, label, icon (Iconify), draw (preset + native SVG
// trace), tape/pin, arrow, circle, underline, highlightSwipe, moveTo,
// erase, fadeGroup, replace, panZoom — against real am_michael TTS timing.
//
// Trigger words below are matched against the EXACT tts.text string,
// normalized (lowercased, punctuation stripped). "adenosine" appears 6x,
// "receptors" 2x, "caffeine" 2x — occurrence counts in each command's
// trigger were counted directly off the narration (see word counts in
// the comment above each beat). If you edit the narration, recount, or
// just check the render log for "[PaperSticker] fallback-fired" — that's
// the safety net telling you a trigger word never matched.
//
// duration: 111 words at ~2.2-2.4 words/sec for am_michael ≈ 46-50s of
// actual narration; layer.duration set to 56s to comfortably cover it
// per AUDIOSYNC.md ("a little longer than necessary is harmless").
//
// Run with:  VIDEO_CONFIG=config.coffee-vs-sleep.js node engine-ci.js

module.exports = {

  output: {
    title:      'coffee-vs-sleep-the-science',
    format:     'portrait',
    fps:        30,
    crf:        20,
    preset:     'medium',
    bgMusicVol: 0.10,
    bgMusic:    { mood: 'calm' },
    postProcess: {
      grain:              true,
      grainStrength:      0.02,
      vignette:           false,   // template already has its own paper vignette
    },
  },

  defaults: {
    voice:      'am_michael',   // friendly/mid-range — casual explainer, per Voices.md
    speed:      1.0,
    transition: 'fade',
  },

  scenes: [
    {
      tts: {
        text: "Your brain makes a chemical called adenosine all day long. The more adenosine builds up, the sleepier you feel. Adenosine locks onto special receptors in your brain, like a key fitting a lock, and slows everything down. Coffee's real trick is not giving you energy. Caffeine is shaped almost exactly like adenosine. So it rushes in and jams itself into those same receptors first, blocking the sleepy signal from ever landing. Your brain still has just as much adenosine as before. It just cannot feel it anymore. Two hours later, when the caffeine wears off, all that blocked adenosine hits you at once. That crash is not random. It is payback.",
        voice:   'am_michael',
        emotion: 'neutral',
        pauseAfter: 0.4,
      },

      captions: {
        style: 'highlight', position: 'bottom', fontSize: 58,
        color: '#ffffff', highlightColor: '#ffd23f',
        bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 3, maxWidth: 0.88,
      },

      layers: [
        {
          type:      'html-record',
          src:       './ApexCasing/paper-sticker-explainer.html?tag=coffee-v1',
          audioSync: true,
          waitFor:   '[data-ready="1"]',
          duration:  56,
          fps:       30,
          viewport:  { width: 1080, height: 1920 },
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',

          data: {
            title: 'THE SCIENCE OF THE CRASH',
            theme: {
              paper:  '#f4ecdd',
              ink:    '#17181c',
              accent: '#ff5a3c',   // caffeine / crash / warm accent
              accent2:'#2f7cf6',   // receptor / highlight accent
            },

            commands: [

              // ── Beat A (0-3s) — establish: title sticker + cup/brain icons ──
              { id: 's_title', type: 'sticker', text: 'COFFEE VS SLEEP',
                x: 540, y: 300, size: 78, rotate: -2, stroke: '#ffffff',
                trigger: { atSeconds: 0 } },
              { id: 'tape_title', type: 'tape', target: 's_title', rotate: -8,
                trigger: { atSeconds: 0.1 } },
              { id: 'i_cup', type: 'icon', icon: 'mdi:coffee', x: 300, y: 470,
                size: 150, bg: 'circle', color: '#6f4518', rotate: -6,
                trigger: { afterId: 's_title', offset: 0.3 } },
              { id: 'i_brain', type: 'icon', icon: 'mdi:brain', x: 780, y: 470,
                size: 150, bg: 'circle', color: '#c1447e', rotate: 5,
                trigger: { afterId: 's_title', offset: 0.5 } },

              // ── Beat B — "called adenosine" (adenosine #1) ──────────────
              { id: 's_adeno', type: 'sticker', text: 'ADENOSINE', x: 300, y: 660,
                size: 46, color: '#c1447e', stroke: '#ffffff', rotate: -3,
                trigger: { wordText: 'adenosine', occurrence: 1 } },
              { id: 'i_adeno', type: 'icon', icon: 'mdi:molecule', x: 300, y: 800,
                size: 130, bg: 'circle', color: '#c1447e',
                trigger: { afterId: 's_adeno', offset: 0.2 } },

              // ── Beat C — "builds up" (adenosine #2) ─────────────────────
              { id: 'draw_up', type: 'draw', preset: 'arrowRight', x: 420, y: 800,
                scale: 0.4, rotate: -90, color: '#c1447e', drawDur: 0.5,
                trigger: { wordText: 'adenosine', occurrence: 2 } },
              { id: 'lbl_buildup', type: 'label', text: 'builds up...', x: 300, y: 910,
                size: 34, rotate: -4, color: '#17181c',
                trigger: { afterId: 'draw_up', offset: 0.15 } },

              // ── Beat D — "locks onto receptors... key... lock" (adenosine #3) ──
              { id: 'i_lock', type: 'icon', icon: 'mdi:lock', x: 540, y: 980,
                size: 140, bg: 'circle', color: '#17181c',
                trigger: { wordText: 'adenosine', occurrence: 3 } },
              { id: 'arr_adeno_lock', type: 'arrow', target: 'i_lock',
                x1: 340, y1: 830, color: '#c1447e', curve: 40,
                trigger: { wordText: 'lock', occurrence: 1 } },
              { id: 'circ_lock', type: 'circle', target: 'i_lock', color: '#17181c',
                trigger: { afterId: 'i_lock', offset: 0.5 } },

              // ── Beat E — "receptors" (#1) ────────────────────────────────
              { id: 'pin_receptor', type: 'pin', target: 'i_lock', color: '#ff5a3c',
                trigger: { wordText: 'receptors', occurrence: 1 } },
              { id: 'lbl_receptor', type: 'label', text: 'brain receptor', x: 540, y: 855,
                size: 32, rotate: 2,
                trigger: { afterId: 'pin_receptor', offset: 0.1 } },

              // ── Beat F — "Caffeine is shaped..." (caffeine #1) ──────────
              { id: 's_caff', type: 'sticker', text: 'CAFFEINE', x: 780, y: 660,
                size: 46, color: '#2f7cf6', stroke: '#ffffff', rotate: 3,
                trigger: { wordText: 'caffeine', occurrence: 1 } },
              { id: 'i_caff', type: 'icon', icon: 'mdi:coffee-outline', x: 780, y: 800,
                size: 130, bg: 'circle', color: '#2f7cf6',
                trigger: { afterId: 's_caff', offset: 0.2 } },

              // ── Beat G — "almost exactly like adenosine" (adenosine #4) —
              // circle BOTH molecule icons at once to sell "same shape" ────
              { id: 'circ_adeno_shape', type: 'circle', target: 'i_adeno', color: '#c1447e',
                trigger: { wordText: 'adenosine', occurrence: 4 } },
              { id: 'circ_caff_shape', type: 'circle', target: 'i_caff', color: '#2f7cf6',
                trigger: { wordText: 'adenosine', occurrence: 4 } },

              // ── Beat H — "jams itself into those same receptors" (receptors #2) ──
              { id: 'move_caff', type: 'moveTo', target: 'i_caff', x: 540, y: 980,
                duration: 0.6, trigger: { wordText: 'receptors', occurrence: 2 } },
              { id: 'hl_lock', type: 'highlightSwipe', target: 'i_lock', color: '#2f7cf6',
                trigger: { afterId: 'move_caff', offset: 0.5 } },

              // ── Beat I — "blocking the sleepy signal from ever landing" ──
              { id: 'draw_block', type: 'draw', preset: 'cross', x: 300, y: 800,
                scale: 0.55, color: '#17181c', drawDur: 0.5,
                trigger: { wordText: 'landing', occurrence: 1 } },
              { id: 'fade_adeno', type: 'fadeGroup', targets: ['i_adeno', 's_adeno'],
                opacity: 0.3, trigger: { afterId: 'draw_block', offset: 0.2 } },

              // ── Beat J — "just as much adenosine as before" (adenosine #5) ──
              { id: 'lbl_still', type: 'label', text: 'still full!', x: 300, y: 700,
                size: 30, color: '#c1447e', rotate: -6,
                trigger: { wordText: 'adenosine', occurrence: 5 } },

              // ── Beat K — "cannot feel it anymore" ────────────────────────
              { id: 's_cantfeel', type: 'sticker', text: "CAN'T FEEL IT", x: 540, y: 1160,
                size: 54, rotate: 3, stroke: '#ffffff',
                trigger: { wordText: 'anymore', occurrence: 1 } },

              // ── Beat L — "Two hours later" — time-skip: subtle camera
              // drift + declutter everything from the first half ───────────
              { id: 'pan_later', type: 'panZoom', toScale: 1.05, toX: -12, toY: -50,
                duration: 1.3, trigger: { wordText: 'later', occurrence: 1 } },
              { id: 'fade_all_1', type: 'fadeGroup',
                targets: ['i_cup', 'i_brain', 'i_lock', 'i_caff', 's_caff', 's_adeno',
                          'i_adeno', 'lbl_receptor', 'lbl_buildup', 'lbl_still', 's_title'],
                opacity: 0.16, duration: 0.6,
                trigger: { afterId: 'pan_later', offset: 0.2 } },

              // ── Beat M — "when the caffeine wears off" (caffeine #2) ─────
              { id: 's_wearsoff', type: 'sticker', text: 'WEARS OFF', x: 540, y: 1300,
                size: 58, rotate: -2, color: '#2f7cf6', stroke: '#ffffff',
                trigger: { wordText: 'caffeine', occurrence: 2 } },
              { id: 'ul_wearsoff', type: 'underline', target: 's_wearsoff', color: '#2f7cf6',
                trigger: { afterId: 's_wearsoff', offset: 0.35 } },
              { id: 'erase_caff', type: 'erase', target: 'i_caff',
                trigger: { afterId: 's_wearsoff', offset: 0.1 } },

              // ── Beat N — "blocked adenosine hits you at once" (adenosine #6) ──
              { id: 'draw_burst', type: 'draw', preset: 'burst', x: 540, y: 1420,
                scale: 1.1, color: '#ff5a3c', drawDur: 0.6,
                trigger: { wordText: 'adenosine', occurrence: 6 } },
              { id: 's_allatonce', type: 'sticker', text: 'ALL AT ONCE', x: 540, y: 1500,
                size: 50, rotate: -3, color: '#ff5a3c', stroke: '#ffffff',
                trigger: { wordText: 'once', occurrence: 1 } },

              // ── Beat O — "That crash is not random" ──────────────────────
              { id: 's_crash', type: 'sticker', text: 'THE CRASH', x: 540, y: 1560,
                size: 62, rotate: 2, color: '#ff5a3c', stroke: '#ffffff',
                trigger: { wordText: 'crash', occurrence: 1 } },

              // ── Beat P — "It is payback." — punchline swap, no new space needed ──
              { id: 'r_payback', type: 'replace', target: 's_crash', text: '= PAYBACK',
                trigger: { wordText: 'payback', occurrence: 1 } },
            ],
          },
        },
      ],
    },
  ],
};