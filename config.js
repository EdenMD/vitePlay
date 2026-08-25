// ============================================================
//  APEX Video Engine v2.4 — Anime Fairy Tale Config
//  "A THOUSAND MILES OF STARS" — Part 1
//  Format: Portrait — TikTok / Reels / Shorts
//  Duration: ~75 seconds
//
//  STORY:
//  Lena lives in a snow-covered northern village.
//  Kai lives on a warm southern island by the ocean.
//  They find each other through letters — slow, handwritten,
//  months apart. Part 1 ends the moment Lena reads his letter
//  and realises — he has never seen snow. And somehow, that
//  breaks her heart open.
//
//  VOICE: af_sarah — warm, intimate, fairy-tale narrator
//  AI IMAGES: all ai-image layers — anime portrait style
//  CAPTIONS: used only on narration-heavy scenes
//  NO html-record — pure native engine
//  NO list-reveal, NO particles, NO avatar
//  NO dissolve transition
// ============================================================

module.exports = {

  output: {
    title:      'thousand-miles-stars-pt1',
    format:     'portrait',
    fps:        30,
    crf:        22,
    preset:     'fast',
    bgMusic:    { mood: 'calm' },
    bgMusicVol: 0.11,
    cleanup:    true,
    postProcess: {
      grain:              true,
      grainStrength:      0.016,
      vignette:           true,
      vignetteStrength:   0.42,
      colorGrade:         '#020308',
      colorGradeStrength: 0.09,
    },
  },

  defaults: {
    voice:              'af_sarah',
    transition:         'fade',
    transitionDuration: 0.45,
  },

  scenes: [

    // ─────────────────────────────────────────────────────────
    // SCENE 1 — TITLE CARD
    // Fairy tale opening. Snow village. Sets the world.
    // Slow Ken Burns. No captions — title text carries it.
    // ─────────────────────────────────────────────────────────
    {
      tts: {
        text:       'Once upon a time — though not so long ago — there was a girl who had never left the snow. And a boy who had never felt cold. And somehow, impossibly, they found each other.',
        pauseAfter: 0.6,
      },
      transition:         'fade',
      transitionDuration:  0.55,
      layers: [
        {
          type:           'ai-image',
          prompt:         'snowy village at night, warm glowing windows, pine trees covered in snow, northern sky full of stars, soft magical atmosphere, wide cinematic landscape, anime style watercolor background art, no people, meinamix',
          model:          'meinamix',
          steps:          8,
          genWidth:       512,
          genHeight:      768,
          x: 0, y: 0, width: 1080, height: 1920,
          fit:            'cover',
          kenBurns:       'zoom-in',
          kenBurnsAmount: 0.14,
        },
        { type: 'overlay', color: 'rgba(0,0,8,0.35)' },

        // Series title — fairy tale style
        {
          type:       'text',
          text:       '✦ A Thousand Miles\nof Stars ✦',
          x:          540,
          y:          310,
          fontSize:   72,
          fontFamily: 'Georgia, Arial, sans-serif',
          color:      '#ffffff',
          align:      'center',
          maxWidth:   900,
          lineHeight: 1.20,
          shadow:     true,
          shadowBlur: 40,
          shadowColor:'rgba(100,150,255,0.60)',
          stroke:     true,
          strokeColor:'rgba(0,0,0,0.70)',
          strokeWidth: 4,
          animation:  'fade',
          animDur:    0.80,
          startT:     0.0,
        },

        // Part badge
        {
          type:       'text',
          text:       'PART ONE',
          x:          540,
          y:          468,
          fontSize:   30,
          fontFamily: 'Arial, sans-serif',
          color:      'rgba(200,220,255,0.65)',
          align:      'center',
          maxWidth:   400,
          animation:  'fade',
          animDur:    0.60,
          startT:     0.50,
        },

        // Opening narration — bottom of frame, italic fairy tale style
        {
          type:       'text',
          text:       '"Once upon a time —\nthough not so long ago."',
          x:          540,
          y:          1360,
          fontSize:   44,
          fontFamily: 'Georgia, Arial, sans-serif',
          color:      'rgba(255,255,255,0.88)',
          align:      'center',
          maxWidth:   880,
          lineHeight: 1.30,
          stroke:     true,
          strokeColor:'rgba(0,0,0,0.85)',
          strokeWidth: 5,
          shadow:     true,
          shadowBlur: 28,
          shadowColor:'rgba(0,0,0,0.95)',
          animation:  'slide-up',
          animDur:    0.55,
          startT:     0.60,
        },

        { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 5,
          color: '#aaccff', color2: '#6688cc',
          trackColor: 'rgba(255,255,255,0.06)' },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // SCENE 2 — LENA'S WORLD
    // Introduce the girl. Cold world. Beautiful but lonely.
    // Close portrait. Captions ON — her world needs words.
    // ─────────────────────────────────────────────────────────
    {
      tts: {
        text:       "Her name was Lena. She lived in a village so far north that the sun forgot it for three months every year. She had learned to love the dark. The silence. The way snow made everything feel hushed and safe. But sometimes, late at night, she wondered if the whole world was as quiet as hers.",
        pauseAfter: 0.50,
      },
      captions: {
        style:          'highlight',
        position:       'bottom',
        fontSize:        46,
        color:           '#ddeeff',
        highlightColor:  '#aaccff',
        bgColor:         'rgba(0,0,15,0.58)',
        wordsPerChunk:   3,
        fontFamily:      'Arial Black, Impact, sans-serif',
        padding:         18,
        borderRadius:    12,
        strokeColor:     'rgba(0,0,0,0.96)',
        strokeWidth:     5,
        yOffset:         -18,
      },
      transition:         'fade',
      transitionDuration:  0.45,
      layers: [
        {
          type:           'ai-image',
          prompt:         '1girl, pale skin, silver white hair, blue grey eyes, wearing thick knitted sweater, standing at frosted window watching snow fall outside, soft candlelight from behind, lonely beautiful expression, close-up portrait above shoulders, no hands, cozy cold northern atmosphere, watercolor anime style, anything-v5',
          model:          'anything-v5',
          steps:          8,
          genWidth:       512,
          genHeight:      768,
          x: 0, y: 0, width: 1080, height: 1920,
          fit:            'cover',
          kenBurns:       'zoom-in',
          kenBurnsAmount: 0.10,
        },
        { type: 'overlay', color: 'rgba(0,0,12,0.38)' },

        // Character name reveal
        {
          type:       'text',
          text:       'LENA',
          x:          540,
          y:          295,
          fontSize:   96,
          fontFamily: 'Georgia, Impact, sans-serif',
          color:      '#ffffff',
          align:      'center',
          maxWidth:   800,
          stroke:     true,
          strokeColor:'rgba(0,0,0,0.80)',
          strokeWidth: 6,
          shadow:     true,
          shadowBlur: 38,
          shadowColor:'rgba(100,140,255,0.55)',
          animation:  'fade',
          animDur:    0.65,
          startT:     0.0,
        },

        {
          type:       'text',
          text:       'The girl who lived in the snow.',
          x:          540,
          y:          415,
          fontSize:   34,
          fontFamily: 'Georgia, Arial, sans-serif',
          color:      'rgba(180,210,255,0.80)',
          align:      'center',
          maxWidth:   800,
          stroke:     true,
          strokeColor:'rgba(0,0,0,0.80)',
          strokeWidth: 3,
          animation:  'fade',
          animDur:    0.55,
          startT:     0.50,
        },

        { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 5,
          color: '#aaccff', color2: '#6688cc',
          trackColor: 'rgba(255,255,255,0.06)' },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // SCENE 3 — KAI'S WORLD
    // Introduce the boy. Warm ocean. Full of life.
    // Contrast with Scene 2 — warm palette vs cold palette.
    // ─────────────────────────────────────────────────────────
    {
      tts: {
        text:       "His name was Kai. He lived on a small island where it was always warm. Where the ocean was so blue it made you feel like crying. He had never worn a coat. Never seen his breath fog in the air. He wrote stories about places he had never been — and kept them in a drawer.",
        pauseAfter: 0.50,
      },
      captions: {
        style:          'highlight',
        position:       'bottom',
        fontSize:        46,
        color:           '#ffeedd',
        highlightColor:  '#ffcc88',
        bgColor:         'rgba(10,5,0,0.58)',
        wordsPerChunk:   3,
        fontFamily:      'Arial Black, Impact, sans-serif',
        padding:         18,
        borderRadius:    12,
        strokeColor:     'rgba(0,0,0,0.96)',
        strokeWidth:     5,
        yOffset:         -18,
      },
      transition:         'fade',
      transitionDuration:  0.45,
      layers: [
        {
          type:           'ai-image',
          prompt:         '1boy, warm dark skin, short curly black hair, bright warm brown eyes, wearing loose white shirt, standing on ocean cliff at golden hour, tropical island behind him, sea breeze in hair, gentle confident expression, close-up portrait above shoulders, no hands, warm golden light, anime style, meinamix',
          model:          'meinamix',
          steps:          8,
          genWidth:       512,
          genHeight:      768,
          x: 0, y: 0, width: 1080, height: 1920,
          fit:            'cover',
          kenBurns:       'pan-up',
          kenBurnsAmount: 0.10,
        },
        { type: 'overlay', color: 'rgba(5,2,0,0.32)' },

        {
          type:       'text',
          text:       'KAI',
          x:          540,
          y:          295,
          fontSize:   96,
          fontFamily: 'Georgia, Impact, sans-serif',
          color:      '#ffffff',
          align:      'center',
          maxWidth:   800,
          stroke:     true,
          strokeColor:'rgba(0,0,0,0.80)',
          strokeWidth: 6,
          shadow:     true,
          shadowBlur: 38,
          shadowColor:'rgba(255,180,80,0.55)',
          animation:  'fade',
          animDur:    0.65,
          startT:     0.0,
        },

        {
          type:       'text',
          text:       'The boy who lived in the warmth.',
          x:          540,
          y:          415,
          fontSize:   34,
          fontFamily: 'Georgia, Arial, sans-serif',
          color:      'rgba(255,220,160,0.82)',
          align:      'center',
          maxWidth:   800,
          stroke:     true,
          strokeColor:'rgba(0,0,0,0.80)',
          strokeWidth: 3,
          animation:  'fade',
          animDur:    0.55,
          startT:     0.50,
        },

        { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 5,
          color: '#ffcc88', color2: '#ff8844',
          trackColor: 'rgba(255,255,255,0.06)' },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // SCENE 4 — THE LETTER ARRIVES
    // How they found each other. A letter in a bottle.
    // Fairy tale logic — no explanation needed.
    // No captions — one strong text line carries the scene.
    // ─────────────────────────────────────────────────────────
    {
      tts: {
        text:       "One winter morning, Lena found a bottle on the frozen shore. Inside it — a single folded page. Written in handwriting she had never seen. It said — hello. I wrote this because I needed someone who has never met me to read it. I hope the sea chooses wisely.",
        pauseAfter: 0.55,
      },
      transition:         'zoom-in',
      transitionDuration:  0.40,
      layers: [
        {
          type:           'ai-image',
          prompt:         '1girl, pale skin, silver white hair, kneeling on frozen snowy beach, holding a glass bottle with paper inside, wide eyes full of wonder and disbelief, cold morning light, breath visible in cold air, close-up portrait above waist, no hands clearly detailed, magical realism anime style, anything-v5',
          model:          'anything-v5',
          steps:          8,
          genWidth:       512,
          genHeight:      768,
          x: 0, y: 0, width: 1080, height: 1920,
          fit:            'cover',
          kenBurns:       'zoom-in',
          kenBurnsAmount: 0.12,
        },
        { type: 'overlay', color: 'rgba(0,0,10,0.40)' },

        // The letter's opening line — the only text needed
        {
          type:       'text',
          text:       '"Hello.\nI hope the sea\nchooses wisely."',
          x:          540,
          y:          720,
          fontSize:   60,
          fontFamily: 'Georgia, Arial, sans-serif',
          color:      '#ffffff',
          align:      'center',
          maxWidth:   880,
          lineHeight: 1.30,
          stroke:     true,
          strokeColor:'rgba(0,0,0,0.90)',
          strokeWidth: 6,
          shadow:     true,
          shadowBlur: 36,
          shadowColor:'rgba(0,0,0,0.98)',
          animation:  'fade',
          animDur:    0.70,
          startT:     0.40,
        },

        { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 5,
          color: '#aaccff', color2: '#6688cc',
          trackColor: 'rgba(255,255,255,0.06)' },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // SCENE 5 — SHE WRITES BACK
    // Lena at her desk by candlelight. Writing.
    // Captions ON — this moment needs her voice.
    // ─────────────────────────────────────────────────────────
    {
      tts: {
        text:       "She sat at her small desk for three hours before she wrote a single word back. She did not know what to say to a stranger. She only knew she did not want to say nothing. So she wrote — the snow here is so loud when it falls that sometimes I think it is trying to tell me something. Can you hear it from where you are?",
        pauseAfter: 0.50,
      },
      captions: {
        style:          'highlight',
        position:       'bottom',
        fontSize:        46,
        color:           '#ddeeff',
        highlightColor:  '#aaccff',
        bgColor:         'rgba(0,0,15,0.58)',
        wordsPerChunk:   3,
        fontFamily:      'Arial Black, Impact, sans-serif',
        padding:         18,
        borderRadius:    12,
        strokeColor:     'rgba(0,0,0,0.96)',
        strokeWidth:     5,
        yOffset:         -18,
      },
      transition:         'fade',
      transitionDuration:  0.45,
      layers: [
        {
          type:           'ai-image',
          prompt:         '1girl, pale skin, silver white hair, sitting at wooden desk by candlelight late at night, writing a letter with a pen, soft warm candle glow on face, focused expression, snow visible outside small window, close-up portrait above shoulders, no hands on desk visible clearly, cozy intimate atmosphere, anime style, flux-anime',
          model:          'flux-anime',
          steps:          8,
          genWidth:       512,
          genHeight:      768,
          x: 0, y: 0, width: 1080, height: 1920,
          fit:            'cover',
          kenBurns:       'zoom-in',
          kenBurnsAmount: 0.08,
        },
        { type: 'overlay', color: 'rgba(0,0,8,0.36)' },

        // What she wrote — sits in upper third
        {
          type:       'text',
          text:       '"Can you hear the snow\nfrom where you are?"',
          x:          540,
          y:          308,
          fontSize:   52,
          fontFamily: 'Georgia, Arial, sans-serif',
          color:      '#ffffff',
          align:      'center',
          maxWidth:   880,
          lineHeight: 1.28,
          stroke:     true,
          strokeColor:'rgba(0,0,0,0.90)',
          strokeWidth: 6,
          shadow:     true,
          shadowBlur: 34,
          shadowColor:'rgba(0,0,0,0.98)',
          animation:  'fade',
          animDur:    0.65,
          startT:     0.0,
        },

        { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 5,
          color: '#aaccff', color2: '#6688cc',
          trackColor: 'rgba(255,255,255,0.06)' },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // SCENE 6 — HIS REPLY
    // Months later. The letter arrives.
    // Kai's warm world. His handwriting on the page.
    // No captions — his words are the only visual needed.
    // ─────────────────────────────────────────────────────────
    {
      tts: {
        text:       "Three months later — his letter arrived. She read it standing in the snow, not even bothering to go inside first. He wrote — I have never seen snow. I do not know its sound. But I have sat by the ocean in the dark and I think maybe it sounds the same as the waves at 3am. Like the world breathing. Is that close?",
        pauseAfter: 0.55,
      },
      transition:         'fade',
      transitionDuration:  0.45,
      postProcess: {
        grain:            true,
        grainStrength:    0.020,
        vignette:         true,
        vignetteStrength: 0.48,
        colorGrade:       '#050300',
        colorGradeStrength: 0.10,
      },
      layers: [
        {
          type:           'ai-image',
          prompt:         '1girl, pale skin, silver hair, standing outside in heavy snowfall reading a letter, coat dusted with snow, expression shifting from surprise to something tender, snowflakes settling on her eyelashes, close-up portrait, no hands clearly detailed, magical winter moment, emotional anime style, meinamix',
          model:          'meinamix',
          steps:          8,
          genWidth:       512,
          genHeight:      768,
          x: 0, y: 0, width: 1080, height: 1920,
          fit:            'cover',
          kenBurns:       'zoom-in',
          kenBurnsAmount: 0.10,
        },
        { type: 'overlay', color: 'rgba(0,0,10,0.42)' },

        // His words — the emotional peak of Part 1
        {
          type:       'text',
          text:       '"I have never seen snow.\nBut maybe it sounds\nlike waves at 3am.\nIs that close?"',
          x:          540,
          y:          650,
          fontSize:   50,
          fontFamily: 'Georgia, Arial, sans-serif',
          color:      '#ffffff',
          align:      'center',
          maxWidth:   900,
          lineHeight: 1.35,
          stroke:     true,
          strokeColor:'rgba(0,0,0,0.92)',
          strokeWidth: 6,
          shadow:     true,
          shadowBlur: 38,
          shadowColor:'rgba(0,0,0,0.98)',
          animation:  'fade',
          animDur:    0.75,
          startT:     0.30,
        },

        { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 5,
          color: '#ffcc88', color2: '#aaccff',
          trackColor: 'rgba(255,255,255,0.06)' },
      ],
    },

    // ─────────────────────────────────────────────────────────
    // SCENE 7 — THE CLIFFHANGER
    // She stands there in the snow. Something shifted.
    // The moment she realises she wants to meet him.
    // Image sequence — two characters, two worlds, side by side.
    // ─────────────────────────────────────────────────────────
    {
      tts: {
        text:       "She stood there until the letter was wet from the snow falling on it. She read it four more times. And then — for the first time in her life — she wished she lived somewhere else. Not because she hated her world. But because she wanted to show it to him. Part Two drops soon.",
        pauseAfter: 0.70,
      },
      transition:         'fade',
      transitionDuration:  0.55,
      postProcess: {
        grain:            true,
        grainStrength:    0.022,
        vignette:         true,
        vignetteStrength: 0.55,
        colorGrade:       '#030308',
        colorGradeStrength: 0.12,
      },
      layers: [
        // Image sequence — Lena cold, Kai warm, alternating
        {
          type:           'image-sequence',
          srcs: [
            'work/ai-images/scene-1-layer-0.png',
            'work/ai-images/scene-2-layer-0.png',
          ],
          cutEvery:       4.0,
          kenBurns:       'zoom-in',
          kenBurnsAmount: 0.10,
          fit:            'cover',
          x: 0, y: 0, width: 1080, height: 1920,
        },
        { type: 'overlay', color: 'rgba(0,0,0,0.50)' },

        // The emotional close
        {
          type:       'text',
          text:       'She wanted to\nshow it to him.',
          x:          540,
          y:          680,
          fontSize:   76,
          fontFamily: 'Georgia, Impact, sans-serif',
          color:      '#ffffff',
          align:      'center',
          maxWidth:   900,
          lineHeight: 1.18,
          stroke:     true,
          strokeColor:'rgba(0,0,0,0.90)',
          strokeWidth: 7,
          shadow:     true,
          shadowBlur: 44,
          shadowColor:'rgba(0,0,0,1.0)',
          animation:  'fade',
          animDur:    0.70,
          startT:     0.0,
        },

        // Part 2 teaser
        {
          type:       'text',
          text:       '✦  PART 2 COMING  ✦',
          x:          540,
          y:          1270,
          fontSize:   36,
          fontFamily: 'Georgia, Arial, sans-serif',
          color:      'rgba(200,210,255,0.85)',
          align:      'center',
          maxWidth:   700,
          stroke:     true,
          strokeColor:'rgba(0,0,0,0.80)',
          strokeWidth: 3,
          shadow:     true,
          shadowBlur: 20,
          animation:  'fade',
          animDur:    0.60,
          startT:     0.65,
        },

        // Comment bait
        {
          type:       'text',
          text:       'What do you think Lena writes back? 👇',
          x:          540,
          y:          1362,
          fontSize:   32,
          fontFamily: 'Arial Black, sans-serif',
          color:      'rgba(255,220,180,0.78)',
          align:      'center',
          maxWidth:   880,
          stroke:     true,
          strokeColor:'rgba(0,0,0,0.80)',
          strokeWidth: 3,
          animation:  'slide-up',
          animDur:    0.45,
          startT:     0.80,
        },

        // Ticker — story recap
        {
          type:       'ticker',
          text:       'A girl in the snow  •  A boy by the ocean  •  A letter in a bottle  •  "Can you hear the snow from where you are?"  •  Part 2 coming soon  •',
          y:          1758,
          height:     62,
          speed:      125,
          bgColor:    'rgba(0,0,0,0.90)',
          textColor:  '#ffffff',
          label:      'PART 1',
          labelBg:    '#334466',
          fontSize:   28,
          borderColor:'rgba(150,180,255,0.18)',
        },

        { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 5,
          color: '#aaccff', color2: '#ffcc88',
          trackColor: 'rgba(255,255,255,0.06)' },
      ],
    },

  ],

};
