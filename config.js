// =============================================================================
// "DocPilot" — AI Document Agent — 45–50s vertical marketing/ad video
// APEX Video Engine v2.4 config — drop this in your repo root (or push as
// config.docpilot-marketing.js) and run it via GitHub Actions manual dispatch,
// or locally per DOCS.md §19/33.
//
// Structure: Hook → Problem (split-screen) → Brand reveal → Live demo
//            (phone mockup + fake chat) → Features → Results (score-card +
//            stat) → Trust → CTA.
//
// Swap "DocPilot" for your real product name with a find/replace — every
// other value (colors, copy, timing) is ready to render as-is. Brand palette:
// near-black navy background, electric teal (#00e5b0) primary accent, violet
// (#7c5cff) secondary accent, red (#ff3b5c) only used for the "before" pain
// state in the split-screen.
// =============================================================================

module.exports = {

  output: {
    title:      'docpilot-ai-document-agent',
    format:     'portrait',        // 1080x1920 — TikTok / Reels / Shorts
    fps:        30,
    crf:        20,
    preset:     'medium',
    bgMusic:    { mood: 'upbeat' },
    bgMusicVol: 0.09,
    postProcess: {
      grain:            true,
      grainStrength:    0.015,
      vignette:         true,
      vignetteStrength: 0.30,
    },
  },

  defaults: {
    voice:              'am_eric',   // warm, trustworthy — brand/explainer
    speed:               1.0,
    transition:          'fade',
    transitionDuration:  0.4,
  },

  scenes: [

    // =========================================================================
    // SCENE 1 — HOOK (0–3.5s)
    // =========================================================================
    {
      transition:         'glitch',
      transitionDuration: 0.5,
      tts: {
        text:        'Still digging through PDFs for one paragraph?',
        voice:       'am_eric',
        emotion:     'serious',
        pauseAfter:  0.3,
      },
      captions: {
        style:          'highlight',
        position:       'bottom',
        fontSize:       60,
        color:          '#ffffff',
        highlightColor: '#00e5b0',
        bgColor:        'rgba(0,0,0,0.55)',
        wordsPerChunk:  3,
      },
      layers: [
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['#05070d', '#0d1524', '#05070d'], angle: 160,
          vignette: true, vignetteStrength: 0.35,
        },
        {
          type: 'particles', particleType: 'dust', x: 540, y: 0,
          count: 40, color: '#00e5b0', size: 4, speed: 20,
          spread: 1080, opacity: 0.20, gravityY: 4, fadeOut: false,
        },
        {
          type:        'text',
          text:        'BURIED IN\\nPDFs?',
          x:           540,
          y:           420,
          fontSize:    108,
          fontFamily:  'Arial Black, Impact, sans-serif',
          align:       'center',
          gradient:    ['#ffffff', '#00e5b0'],
          lineHeight:  1.1,
          stroke:      true,
          strokeColor: '#000000',
          strokeWidth: 3,
          glow:        true,
          glowColor:   '#00e5b0',
          glowBlur:    30,
          hookLayer:   true,
          exitAt:      999,
          animation:   'pop',
          animDur:     0.4,
        },
        {
          type:        'avatar',
          x:           540,
          y:           1420,
          size:        220,
          expression:  'surprised',
          motion:      'slide-in-bottom',
          enterDur:    0.5,
          accentColor: '#00e5b0',
          name:        'DOCPILOT',
          nameColor:   '#00e5b0',
        },
      ],
    },

    // =========================================================================
    // SCENE 2 — PROBLEM (before / after split-screen)
    // =========================================================================
    {
      transition:         'wipe-left',
      transitionDuration: 0.45,
      tts: {
        text:        "Contracts, reports, endless tabs. Manually hunting for one answer wastes hours every single week.",
        voice:       'am_eric',
        pauseAfter:  0.4,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 56,
        color: '#ffffff', highlightColor: '#00e5b0',
        bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 3,
      },
      layers: [
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['#0a0a0a', '#050505'], angle: 90,
        },
        {
          type:         'split-screen',
          split:        0.5,
          dividerColor: '#ffffff',
          dividerWidth: 4,
          dividerGlow:  true,
          dividerIcon:  '⚡',
          animDur:      0.5,
          left: {
            color:      '#170a10',
            tint:       'rgba(255,59,92,0.30)',
            label:      'BEFORE',
            labelColor: '#ff3b5c',
            labelSize:  68,
            labelY:     300,
            bodyText:   'Scrolling.\\nCtrl + F.\\nStill lost.',
            bodyColor:  '#ffffff',
            bodySize:   40,
            bodyY:      520,
            emoji:      '😩',
            emojiSize:  100,
            emojiY:     820,
          },
          right: {
            color:      '#08171a',
            tint:       'rgba(0,229,176,0.28)',
            label:      'AFTER',
            labelColor: '#00e5b0',
            labelSize:  68,
            labelY:     300,
            bodyText:   'Ask once.\\nGet the answer.\\nWith the source.',
            bodyColor:  '#ffffff',
            bodySize:   40,
            bodyY:      520,
            emoji:      '⚡',
            emojiSize:  100,
            emojiY:     820,
          },
        },
      ],
    },

    // =========================================================================
    // SCENE 3 — BRAND REVEAL
    // =========================================================================
    {
      transition:         'zoom-in',
      transitionDuration: 0.5,
      tts: {
        text:        'Meet DocPilot — the AI agent that actually reads your documents.',
        voice:       'am_eric',
        emotion:     'happy',
        pauseAfter:  0.4,
      },
      captions: {
        style: 'fade', position: 'bottom', fontSize: 56,
        color: '#ffffff', bgColor: 'rgba(0,0,0,0.5)', wordsPerChunk: 4,
      },
      layers: [
        {
          type: 'gradient', gradientType: 'radial',
          colors: ['#122032', '#05070d', '#000000'],
          vignette: true, vignetteStrength: 0.4,
        },
        {
          type:       'neon-text',
          text:       'DOCPILOT',
          x:          540,
          y:          760,
          fontSize:   140,
          fontFamily: 'Impact, Arial Black, sans-serif',
          color:      '#00e5b0',
          glowLayers: 6,
          glowSpread: 16,
          flicker:    true,
          hookLayer:  true,
          exitAt:     999,
        },
        {
          type:       'text',
          text:       'Your AI Document Agent',
          x:          540,
          y:          900,
          fontSize:   46,
          fontFamily: 'Arial, sans-serif',
          color:      'rgba(255,255,255,0.85)',
          align:      'center',
          animation:  'fade',
          startT:     0.3,
          animDur:    0.5,
        },
        {
          type:        'avatar',
          x:           540,
          y:           1420,
          size:        240,
          expression:  'happy',
          motion:      'enter-center',
          enterDur:    0.6,
          accentColor: '#00e5b0',
          name:        'DOCPILOT',
          nameColor:   '#00e5b0',
        },
      ],
    },

    // =========================================================================
    // SCENE 4 — LIVE DEMO (phone mockup + fake chat)
    // =========================================================================
    {
      transition:         'wipe-up',
      transitionDuration: 0.45,
      tts: {
        text:        'Upload any document, ask your question in plain English, and DocPilot answers instantly — with the exact page and clause cited.',
        voice:       'am_eric',
        pauseAfter:  1.0,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 54,
        color: '#ffffff', highlightColor: '#00e5b0',
        bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 3,
      },
      layers: [
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['#05070d', '#0d1524'], angle: 160,
        },
        {
          type:        'phone-mockup',
          x:           110,
          y:           220,
          phoneW:      860,
          phoneH:      1420,
          color:       '#1c1c1e',
          screenBg:    '#0b0f14',
          notchStyle:  'island',
          showButtons: true,
          animDur:     0.5,
          carrier:     'DocPilot',
          time:        '9:41',
          batteryPct:  92,
          appHeader: {
            name:   'DocPilot AI 🤖',
            online: true,
          },
          chat: {
            messages: [
              { from: 'left',  text: '📄 Q3_Vendor_Contract.pdf uploaded', delay: 0.0 },
              { from: 'right', text: "Got it — I've read all 42 pages.", delay: 1.1, typing: 0.8 },
              { from: 'left',  text: "What's the termination clause?", delay: 3.2 },
              { from: 'right', text: 'Either party may terminate with 30 days written notice — Section 4.2, page 11.', delay: 4.8, typing: 1.1 },
              { from: 'right', text: '', delay: 7.6, status: 'Answered in 1.2s ⚡' },
            ],
            leftColor:  '#e5e5ea',
            rightColor: '#0ea37a',
            fontSize:   28,
          },
        },
      ],
    },

    // =========================================================================
    // SCENE 5 — FEATURES
    // =========================================================================
    {
      transition:         'slide-left',
      transitionDuration: 0.4,
      tts: {
        text:        'It reads contracts, spreadsheets, and scanned PDFs. It cites every source. And it works across your entire document archive — not just one file.',
        voice:       'am_eric',
        pauseAfter:  0.6,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 54,
        color: '#ffffff', highlightColor: '#7c5cff',
        bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 3,
      },
      layers: [
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['#0a0a12', '#05070d'], angle: 160,
        },
        {
          type:  'text',
          text:  'WHAT IT DOES',
          x:     540,
          y:     300,
          fontSize:   44,
          fontFamily: 'Arial Black, sans-serif',
          color:      '#7c5cff',
          align:      'center',
          animation:  'fade',
          animDur:    0.3,
        },
        {
          type:        'shape',
          shape:       'rect',
          x:           540,
          y:           870,
          width:       960,
          height:      760,
          color:       'rgba(255,255,255,0.05)',
          borderRadius: 28,
          stroke:      true,
          strokeColor: 'rgba(124,92,255,0.35)',
          strokeWidth: 2,
        },
        {
          type:        'list-reveal',
          items: [
            'Reads PDFs, contracts, spreadsheets & scans',
            'Cites the exact source, every time',
            'Searches your entire document archive',
            'Understands natural follow-up questions',
          ],
          x:           110,
          y:           520,
          fontSize:    42,
          fontFamily:  'Arial Black, sans-serif',
          color:       '#ffffff',
          bullet:      '▸',
          bulletColor: '#00e5b0',
          maxWidth:    860,
          lineHeight:  1.8,
          itemDur:     0.8,
          stagger:     0.7,
          animStyle:   'slide-up',
        },
      ],
    },

    // =========================================================================
    // SCENE 6 — RESULTS (score-card + stat-counter)
    // =========================================================================
    {
      transition:         'dissolve',
      transitionDuration: 0.55,
      tts: {
        text:        'Teams using DocPilot cut document review time by eighty percent — from four hours down to twelve minutes.',
        voice:       'am_eric',
        emotion:     'happy',
        pauseAfter:  0.6,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 54,
        color: '#ffffff', highlightColor: '#00e5b0',
        bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 3,
      },
      layers: [
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['#05070d', '#0d1524'], angle: 160,
        },
        {
          type:  'score-card',
          left:  { label: 'Before', value: '4 hrs',  color: '#ff3b5c' },
          right: { label: 'After',  value: '12 min',  color: '#00e5b0' },
          vsText:     'VS',
          x:          540,
          y:          620,
          width:      940,
          height:     260,
          fontFamily: 'Impact, Arial Black, sans-serif',
          animDur:    0.7,
        },
        {
          type:          'stat-counter',
          value:         80,
          startValue:    0,
          suffix:        '%',
          label:         'FASTER DOCUMENT REVIEW',
          x:             540,
          y:             1220,
          fontSize:      150,
          labelFontSize: 38,
          fontFamily:    'Impact, Arial Black, sans-serif',
          color:         '#00e5b0',
          labelColor:    'rgba(255,255,255,0.7)',
          gradient:      ['#00e5b0', '#7c5cff'],
          glow:          true,
          glowColor:     '#00e5b0',
          glowBlur:      35,
          animDur:       1.6,
        },
      ],
    },

    // =========================================================================
    // SCENE 7 — TRUST
    // =========================================================================
    {
      transition:         'fade',
      transitionDuration: 0.4,
      tts: {
        text:        'Enterprise-grade encryption. SOC 2 compliant. Your documents are never used to train our models.',
        voice:       'am_eric',
        emotion:     'serious',
        pauseAfter:  0.4,
      },
      captions: {
        style: 'fade', position: 'bottom', fontSize: 54,
        color: '#ffffff', bgColor: 'rgba(0,0,0,0.5)', wordsPerChunk: 4,
      },
      layers: [
        {
          type: 'gradient', gradientType: 'radial',
          colors: ['#0d1524', '#05070d', '#000000'],
        },
        {
          type:          'meter',
          value:         100,
          cx:            540,
          cy:            820,
          radius:        220,
          thickness:     24,
          color:         '#00e5b0',
          color2:        '#7c5cff',
          trackColor:    'rgba(255,255,255,0.1)',
          gradient:      ['#00e5b0', '#7c5cff'],
          label:         'DATA PRIVACY',
          labelFontSize: 38,
          labelColor:    'rgba(255,255,255,0.6)',
          showValue:     true,
          valueFontSize: 96,
          unit:          '%',
          startAngle:    -210,
          sweepAngle:    240,
          glowBlur:      20,
          animDur:       1.5,
        },
        {
          type:       'text',
          text:       'SOC 2 Type II  •  AES-256 Encryption',
          x:          540,
          y:          1260,
          fontSize:   34,
          fontFamily: 'Arial, sans-serif',
          color:      'rgba(255,255,255,0.6)',
          align:      'center',
          animation:  'fade',
          startT:     0.8,
          animDur:    0.4,
        },
      ],
    },

    // =========================================================================
    // SCENE 8 — CTA (final scene — no transition needed)
    // =========================================================================
    {
      tts: {
        text:        'Stop searching. Start asking. Try DocPilot free today.',
        voice:       'am_eric',
        emotion:     'happy',
        pauseAfter:  0.8,
      },
      captions: {
        style: 'pop', position: 'top', fontSize: 54,
        color: '#ffffff', bgColor: 'rgba(0,0,0,0.0)', wordsPerChunk: 3,
      },
      layers: [
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['#05070d', '#0d1524', '#05070d'], angle: 160,
          vignette: true, vignetteStrength: 0.35,
        },
        {
          type:         'particles',
          particleType: 'confetti',
          x:            540, y: 0,
          count:        70,
          colors:       ['#00e5b0', '#7c5cff', '#ffffff'],
          size:         5,
          speed:        70,
          spread:       1080,
          opacity:      0.7,
          gravityY:     35,
          fadeOut:      true,
        },
        {
          type:         'shape',
          shape:        'rect',
          x:            540,
          y:            1000,
          width:        820,
          height:       160,
          color:        'rgba(0,229,176,0.12)',
          borderRadius: 80,
          stroke:       true,
          strokeColor:  '#00e5b0',
          strokeWidth:  3,
          glow:         true,
          glowColor:    '#00e5b0',
          glowBlur:     30,
          animation:    'pulse',
          speed:        0.8,
        },
        {
          type:        'text',
          text:        'TRY DOCPILOT FREE',
          x:           540,
          y:           1000,
          fontSize:    60,
          fontFamily:  'Arial Black, Impact, sans-serif',
          color:       '#ffffff',
          align:       'center',
          gradient:    ['#ffffff', '#00e5b0'],
          hookLayer:   true,
          exitAt:      999,
          animation:   'pop',
          animDur:     0.4,
        },
        {
          type:       'text',
          text:       'Link in bio  →  docpilot.ai',
          x:          540,
          y:          1160,
          fontSize:   36,
          fontFamily: 'Arial, sans-serif',
          color:      'rgba(255,255,255,0.75)',
          align:      'center',
          animation:  'fade',
          startT:     0.5,
          animDur:    0.4,
        },
        {
          type:        'avatar',
          x:           540,
          y:           1550,
          size:        240,
          expression:  'excited',
          motion:      'bounce',
          enterDur:    0.5,
          accentColor: '#00e5b0',
          name:        'DOCPILOT',
          nameColor:   '#00e5b0',
        },
      ],
    },

  ],
};