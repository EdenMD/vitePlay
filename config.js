// =============================================================================
// "The Shell That Could Think" — WWII proximity (VT) fuze documentary
// APEX Engine config — plain module.exports object, all values hardcoded
// =============================================================================
//
// FORMAT NOTES
// -----------------------------------------------------------------------------
// - Long-form again, per your call: landscape 1920x1080, 8 scenes, ~700 words
//   of narration (matches your own 5-minute pacing formula from earlier).
// - Learned from the short's render failure: kept video count deliberately
//   LOW. Only 2 `pexels-video` layers in the whole file (the opening hook and
//   the mid-video payoff beat) — everything else is `stock-image-sequence`
//   stills. Stills carry zero per-frame-extraction cost regardless of scene
//   length, so this keeps total render weight far lower than the short that
//   choked on 5-6 video clips.
// - No AI-generated clips this time — none exist yet for this topic. If you
//   want 1-2 custom AI shots for the hook or the launch-forces scene later,
//   say the word and I'll slot them in the same way as the fighter jet file.
// - bgMusic mood set to 'documentary' (measured/educational) rather than
//   'epic' — this is a slower, unfold-the-mystery story, not a trailer.
// =============================================================================

module.exports = {

  output: {
    title:      'proximity-fuze-documentary',
    format:     'landscape',
    width:      1920,
    height:     1080,
    fps:        30,
    crf:        18,
    preset:     'medium',
    bgMusicVol: 0.16,
    bgMusic:    { mood: 'documentary' },
    postProcess: {
      grain:              true,
      grainStrength:      0.03,
      vignette:           true,
      vignetteStrength:   0.35,
      scanlines:          false,
      colorGrade:         '#2a2318',
      colorGradeStrength: 0.08,
    },
  },

  defaults: {
    voice:              'bm_george',
    speed:              1.0,
    transition:         'fade',
    transitionDuration:  0.6,
    effectStrength:      1.0,
  },

  scenes: [

    // =========================================================================
    // SCENE 1 — The Shell That Could Think — pexels-video (hook, one of only 2)
    // =========================================================================
    {
      transition:         'zoom-in',
      transitionDuration: 0.5,
      tts: {
        text: "In 1943, artillery crews fired thousands of shells into the sky and hit "
            + "almost nothing. Enemy aircraft were fast, and timing a shell to explode at "
            + "the right instant was nearly impossible to calculate in the middle of a "
            + "battle. Then engineers built something strange: a shell that didn't need a "
            + "human to time it at all. Inside its nose sat a tiny radio system, built to "
            + "sense when it was close to a target—and explode at exactly the right moment, "
            + "on its own. Decades before the transistor existed, a piece of artillery had "
            + "learned to make its own decision.",
        emotion: 'serious',
        pauseAfter: 0.4,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 58,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'artillery gun firing smoke',
          orientation: 'landscape',
          loop: true,
          x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.55)'], angle: 180 },
      ],
    },

    // =========================================================================
    // SCENE 2 — Why Shells Kept Missing — stills
    // =========================================================================
    {
      tts: {
        text: "Most anti-aircraft shells worked on timers. Gunners calculated a target's "
            + "speed and distance, then set a fuse to detonate after a fixed number of "
            + "seconds. But aircraft changed speed and direction constantly, and wind "
            + "shifted the math further. A shell only a few meters off in timing would "
            + "explode in empty air while the aircraft flew through untouched. Even "
            + "skilled crews were, in effect, guessing—and against fast-moving targets, "
            + "guessing rarely worked. What the military needed was a fuse that didn't "
            + "predict where a target would be, but could sense it directly, in real time.",
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 56,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'WWII anti-aircraft gun crew',
            'artillery shell explosion sky',
            'WWII fighter plane flying',
            'anti-aircraft artillery firing',
          ],
          source: 'pexels',
          orientation: 'landscape',
          fit: 'cover',
          kenBurnsSequence: [
            { kenBurns: 'zoom-in',   kenBurnsAmount: 0.3 },
            { kenBurns: 'pan-left',  kenBurnsAmount: 0.3 },
            { kenBurns: 'rotate-cw', kenBurnsAmount: 0.3, rotateDeg: 10 },
            { kenBurns: 'pan-right', kenBurnsAmount: 0.3 },
          ],
          x: 0, y: 0, width: 1920, height: 1080,
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180 },
      ],
    },

    // =========================================================================
    // SCENE 3 — A Radio Inside a Bullet — stills
    // =========================================================================
    {
      tts: {
        text: "The solution sounds almost impossible for its time: shrink a working radio "
            + "transmitter and receiver small enough to fit inside an artillery shell. This "
            + "tiny radio sent a continuous signal as the shell flew. When that signal "
            + "reflected off a nearby aircraft and bounced back, the shell sensed the change "
            + "and knew a target was close. No calculation, no timer—just a shell "
            + "constantly asking one question as it flew: how close am I right now? The "
            + "moment the answer crossed a threshold, the shell detonated itself, precisely "
            + "when it had the best chance of doing damage.",
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 56,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'vacuum tube radio closeup',
            'vintage electronics soldering',
            'radio antenna technology closeup',
            'artillery shell cutaway',
          ],
          source: 'pexels',
          orientation: 'landscape',
          fit: 'cover',
          kenBurnsSequence: [
            { kenBurns: 'zoom-in',    kenBurnsAmount: 0.3 },
            { kenBurns: 'pan-right',  kenBurnsAmount: 0.3 },
            { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10 },
            { kenBurns: 'pan-left',   kenBurnsAmount: 0.3 },
          ],
          x: 0, y: 0, width: 1920, height: 1080,
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180 },
      ],
    },

    // =========================================================================
    // SCENE 4 — Surviving Its Own Launch — stills
    // =========================================================================
    {
      tts: {
        text: "Building the radio was only half the problem. Surviving the shot was "
            + "almost as hard. When a shell fires from an artillery gun, it experiences "
            + "forces of nearly twenty thousand times gravity in a fraction of a "
            + "second—enough to crush ordinary electronics instantly. Engineers had to "
            + "design vacuum tubes, batteries, and wiring that could survive that violence, "
            + "then keep working while spinning through the air at high speed. They "
            + "succeeded. Inside a shell no larger than a bottle, a fragile radio endured a "
            + "launch that would destroy almost anything else, and kept working.",
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 56,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'artillery cannon firing',
            'artillery shell casing closeup',
            'military ammunition factory',
            'artillery gun barrel closeup',
          ],
          source: 'pexels',
          orientation: 'landscape',
          fit: 'cover',
          kenBurnsSequence: [
            { kenBurns: 'zoom-in',   kenBurnsAmount: 0.3 },
            { kenBurns: 'pan-left',  kenBurnsAmount: 0.3 },
            { kenBurns: 'rotate-cw', kenBurnsAmount: 0.3, rotateDeg: 10 },
            { kenBurns: 'pan-right', kenBurnsAmount: 0.3 },
          ],
          x: 0, y: 0, width: 1920, height: 1080,
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180 },
      ],
    },

    // =========================================================================
    // SCENE 5 — Fewer Shells, More Hits — pexels-video (2nd and last video)
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "Once deployed, the results were immediate. Anti-aircraft units needed far "
            + "fewer shells to bring down a single enemy aircraft. Later in the war, "
            + "against artillery shells fired at ground troops, the same fuse proved just "
            + "as effective—detonating directly above enemy formations at the exact height "
            + "that caused the most damage. For the first time, a weapon wasn't just aimed "
            + "by a person. It was making its own final decision about exactly when to act.",
        emotion: 'serious',
        pauseAfter: 0.2,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 56,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'artillery firing night explosion',
          orientation: 'landscape',
          loop: true,
          x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.55)'], angle: 180 },
      ],
    },

    // =========================================================================
    // SCENE 6 — A Closely Guarded Secret — stills
    // =========================================================================
    {
      transition:         'fade',
      transitionDuration: 0.6,
      tts: {
        text: "For most of the war, this fuse was treated as one of the most closely "
            + "guarded secrets on either side. Military leaders worried that if a single "
            + "dud shell was recovered intact, enemy engineers could study it and copy the "
            + "design. For years, it was used almost exclusively over water and "
            + "unpopulated areas, specifically so that any shell that failed to detonate "
            + "would sink or vanish rather than fall into enemy hands. Only later was it "
            + "cleared for full battlefield use, once the risk of losing the secret "
            + "mattered less than winning with it.",
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 56,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'WWII classified documents',
            'military intelligence briefing room',
            'naval ship ocean WWII',
            'vintage top secret stamp',
          ],
          source: 'pexels',
          orientation: 'landscape',
          fit: 'cover',
          kenBurnsSequence: [
            { kenBurns: 'zoom-in',    kenBurnsAmount: 0.3 },
            { kenBurns: 'pan-right',  kenBurnsAmount: 0.3 },
            { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10 },
            { kenBurns: 'pan-left',   kenBurnsAmount: 0.3 },
          ],
          x: 0, y: 0, width: 1920, height: 1080,
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180 },
      ],
    },

    // =========================================================================
    // SCENE 7 — The Blueprint for Every Smart Weapon After It — stills
    // =========================================================================
    {
      tts: {
        text: "The proximity fuse didn't just win battles. It introduced an idea that "
            + "never left weapons design again: sensing instead of calculating. Every "
            + "guided missile that adjusts its course mid-flight, every smart bomb that "
            + "corrects itself seconds before impact, traces back to the same principle "
            + "proven in that shell—letting a weapon sense its environment and react, "
            + "instead of simply following a fixed plan.",
        emotion: 'serious',
        pauseAfter: 0.3,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 56,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'guided missile launch',
            'modern missile flying sky',
            'precision guided bomb',
            'military control room technology',
          ],
          source: 'pexels',
          orientation: 'landscape',
          fit: 'cover',
          kenBurnsSequence: [
            { kenBurns: 'zoom-in',   kenBurnsAmount: 0.3 },
            { kenBurns: 'pan-left',  kenBurnsAmount: 0.3 },
            { kenBurns: 'rotate-cw', kenBurnsAmount: 0.3, rotateDeg: 10 },
            { kenBurns: 'pan-right', kenBurnsAmount: 0.3 },
          ],
          x: 0, y: 0, width: 1920, height: 1080,
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180 },
      ],
    },

    // =========================================================================
    // SCENE 8 — The Machine That Learned to Notice — stills (closer)
    // =========================================================================
    {
      transition:         'fade',
      transitionDuration: 0.7,
      tts: {
        text: "The next time you see a guided missile adjust its path in the final "
            + "second before impact, remember where that idea started. Not with a "
            + "computer chip, and not with artificial intelligence—but with a shell small "
            + "enough to hold in one hand, built to sense the world around it and act "
            + "without waiting for instructions. The greatest leap wasn't making weapons "
            + "more powerful. It was giving them the ability to notice what was happening "
            + "around them, and decide for themselves.",
        emotion: 'serious',
        pauseAfter: 0.6,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 56,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'missile flying sky sunset',
            'modern military technology',
            'advanced weapon system closeup',
            'military aircraft sunset silhouette',
          ],
          source: 'pexels',
          orientation: 'landscape',
          fit: 'cover',
          kenBurnsSequence: [
            { kenBurns: 'zoom-in',    kenBurnsAmount: 0.3 },
            { kenBurns: 'pan-right',  kenBurnsAmount: 0.3 },
            { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10 },
            { kenBurns: 'zoom-out',   kenBurnsAmount: 0.3 },
          ],
          x: 0, y: 0, width: 1920, height: 1080,
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.65)'], angle: 180 },
      ],
    },

  ],
};