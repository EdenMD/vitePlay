// =============================================================================
// "The Shell That Could Think" — SHORT (50s target)
// APEX Engine config — plain module.exports object, all values hardcoded
// =============================================================================
//
// - 9:16 vertical, 1080x1920 — Shorts/Reels/TikTok dimensions.
// - Only 2 `pexels-video` layers in the whole file (hook + payoff beat) —
//   same lesson as the fixed fighter-jet short: keep real video clips few,
//   let `stock-image-sequence` stills carry most of the runtime since they
//   don't cost per-frame extraction the way video does.
// - No beat/bpm — bgMusic uses a mood track only, output.beat isn't set.
// - Closes with "the full story is on my channel" since the long-form cut
//   of this one hasn't been posted yet.
// =============================================================================

module.exports = {

  output: {
    title:      'proximity-fuze-short',
    format:     'portrait',
    width:      1080,
    height:     1920,
    fps:        30,
    crf:        18,
    preset:     'medium',
    bgMusicVol: 0.20,
    bgMusic:    { mood: 'epic' },   // valid mood, no beat/bpm anywhere
    postProcess: {
      grain:              true,
      grainStrength:      0.035,
      vignette:           true,
      vignetteStrength:   0.45,
      scanlines:          false,
      colorGrade:         '#2a2318',
      colorGradeStrength: 0.08,
    },
  },

  defaults: {
    voice:              'bm_george',
    speed:              1.05,
    transition:         'zoom-cut',
    transitionDuration:  0.25,
    effectStrength:      1.0,
  },

  scenes: [

    // =========================================================================
    // SCENE 1 — HOOK — pexels-video (1 of 2 videos total)
    // =========================================================================
    {
      transition:         'zoom-in',
      transitionDuration: 0.4,
      tts: {
        text: "In 1943, artillery crews were firing thousands of shells and hitting almost "
            + "nothing—until a shell learned to make its own decision, decades before the "
            + "transistor even existed.",
        emotion: 'dramatic',
        pauseAfter: 0.25,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 60,
        color: '#ffffff', highlightColor: '#f5c518',
        wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 7,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'artillery gun firing smoke',
          orientation: 'portrait',
          loop: true,
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
        },
        { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
        {
          type: 'text',
          text: 'A SHELL THAT\nLEARNED TO\nTHINK.',
          x: 540, y: 650,
          fontSize: 80, fontFamily: 'Arial Black, Impact, sans-serif',
          fontWeight: 'bold', color: '#ffffff', align: 'center',
          maxWidth: 940, lineHeight: 1.1,
          gradient: ['#f5c518', '#ff8c00'],
          stroke: true, strokeColor: '#000000', strokeWidth: 6,
          glow: true, glowColor: '#f5c518', glowBlur: 32,
          animation: 'pop', animDur: 0.4, startT: 0.15,
          hookLayer: true,
        },
      ],
    },

    // =========================================================================
    // SCENE 2 — stills
    // =========================================================================
    {
      tts: {
        text: "No timer. No calculation. Just a tiny radio, sensing exactly how close "
            + "it was to a target.",
        emotion: 'dramatic',
        pauseAfter: 0.15,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 60,
        color: '#ffffff', highlightColor: '#f5c518',
        wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 7,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'vacuum tube radio closeup',
            'WWII anti-aircraft gun crew',
          ],
          source: 'serpapi',
          orientation: 'portrait',
          fit: 'cover',
          kenBurnsSequence: [
            { kenBurns: 'zoom-in',   kenBurnsAmount: 0.3 },
            { kenBurns: 'rotate-cw', kenBurnsAmount: 0.3, rotateDeg: 10 },
          ],
          x: 0, y: 0, width: 1080, height: 1920,
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.5)'], angle: 180 },
      ],
    },

    // =========================================================================
    // SCENE 3 — stills
    // =========================================================================
    {
      tts: {
        text: "It had to survive twenty thousand times gravity at launch—then keep "
            + "working while spinning through the air.",
        emotion: 'dramatic',
        pauseAfter: 0.15,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 60,
        color: '#ffffff', highlightColor: '#f5c518',
        wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 7,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'artillery cannon firing',
            'artillery shell casing closeup',
          ],
          source: 'serpapi',
          orientation: 'portrait',
          fit: 'cover',
          kenBurnsSequence: [
            { kenBurns: 'zoom-in',    kenBurnsAmount: 0.3 },
            { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10 },
          ],
          x: 0, y: 0, width: 1080, height: 1920,
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.5)'], angle: 180 },
      ],
    },

    // =========================================================================
    // SCENE 4 — pexels-video (2nd and last video)
    // =========================================================================
    {
      transition:         'glitch',
      transitionDuration: 0.26,
      tts: {
        text: "Once deployed, anti-aircraft units needed far fewer shells to hit a "
            + "single target.",
        emotion: 'dramatic',
        pauseAfter: 0.15,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 60,
        color: '#ffffff', highlightColor: '#f5c518',
        wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 7,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'artillery firing night explosion',
          orientation: 'portrait',
          loop: true,
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)'], angle: 180 },
      ],
    },

    // =========================================================================
    // SCENE 5 — stills
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.2,
      tts: {
        text: "It was one of the most closely guarded secrets of the entire war.",
        emotion: 'dramatic',
        pauseAfter: 0.15,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 60,
        color: '#ffffff', highlightColor: '#f5c518',
        wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 7,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'WWII classified documents',
            'vintage top secret stamp',
          ],
          source: 'serpapi',
          orientation: 'portrait',
          fit: 'cover',
          kenBurnsSequence: [
            { kenBurns: 'zoom-in',   kenBurnsAmount: 0.3 },
            { kenBurns: 'pan-left',  kenBurnsAmount: 0.3 },
          ],
          x: 0, y: 0, width: 1080, height: 1920,
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.5)'], angle: 180 },
      ],
    },

    // =========================================================================
    // SCENE 6 — stills, the payoff line
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.2,
      tts: {
        text: "Every guided missile flying today, every smart bomb that corrects itself "
            + "mid-flight, still uses the same idea first proven inside that shell.",
        emotion: 'dramatic',
        pauseAfter: 0.3,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 60,
        color: '#ffffff', highlightColor: '#f5c518',
        wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 7,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'guided missile launch',
            'modern missile flying sky',
          ],
          source: 'serpapi',
          orientation: 'portrait',
          fit: 'cover',
          kenBurnsSequence: [
            { kenBurns: 'zoom-in',   kenBurnsAmount: 0.3 },
            { kenBurns: 'rotate-cw', kenBurnsAmount: 0.3, rotateDeg: 10 },
          ],
          x: 0, y: 0, width: 1080, height: 1920,
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180 },
      ],
    },

    // =========================================================================
    // CTA — single still, simple closer
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "The full story is dropping on my channel soon.",
        emotion: 'dramatic',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 60,
        color: '#ffffff', highlightColor: '#f5c518',
        wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 7,
      },
      layers: [
        {
          type: 'stock-image',
          query: 'missile flying sky sunset',
          source: 'serpapi',
          orientation: 'portrait',
          imageIndex: 0,
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
          kenBurns: 'zoom-in',
          kenBurnsAmount: 0.15,
        },
        { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
        {
          type: 'text',
          text: 'FULL STORY\nON MY CHANNEL',
          x: 540, y: 500,
          fontSize: 68, fontFamily: 'Arial Black, Impact, sans-serif',
          fontWeight: 'bold', color: '#ffffff', align: 'center',
          maxWidth: 900, lineHeight: 1.15,
          gradient: ['#f5c518', '#ff8c00'],
          stroke: true, strokeColor: '#000000', strokeWidth: 5,
          glow: true, glowColor: '#f5c518', glowBlur: 26,
          animation: 'pop', animDur: 0.4, startT: 0.1,
        },
      ],
    },

  ],
};