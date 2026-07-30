// =============================================================================
// "The Machine That Flies It" — Fighter jet flight-computer documentary
// APEX Engine config — plain module.exports object, all values hardcoded
// (per this project's config convention: no JS variables, no async exports)
// =============================================================================
//
// CHANGES FROM V1 — WHY
// -----------------------------------------------------------------------------
// 1. FORMAT: landscape 1920x1080 (16:9), not portrait — YouTube long-form.
//    All layer x/y/width/height below are sized for that canvas.
//
// 2. SOURCING: Pexels is now the default for BOTH stills and video.
//    Root cause of "SerpAPI never resolved" — src/image-api.js requires a
//    real `SERPAPI_API_KEY` env secret (`if (!SERPAPI_KEY) throw ...`),
//    despite README.md's "hardcoded key" claim. No key → every serpapi call
//    throws immediately and falls through the source chain (Unsplash →
//    Pexels → Pixabay → Picsum). If nothing else was configured either, it
//    lands on Picsum random filler or a flat background — which is exactly
//    what "nothing ever resolved" looks like. Since PEXELS_API_KEY is
//    confirmed working, every stock-image-sequence below sets
//    `source: 'pexels'` explicitly rather than leaving SerpAPI first in
//    the default chain. SerpAPI is used ZERO times below — per your note
//    it's pricier and rougher-looking, so it's left out entirely rather
//    than sprinkled in; swap `source: 'pexels'` → `'serpapi'` on any one
//    layer later if a specific shot needs Google-Images-level accuracy.
//
// 3. MORE VIDEO CLIPS, LONGER: every scene that was stills-only in v1
//    (2, 3, 5, 6, 8) opens with a `pexels-video` establishing shot before
//    settling into its stock-image-sequence. `maxDuration` is NOT hardcoded
//    to 6s anymore — Pexels.md confirms documentary b-roll on Pexels
//    commonly runs 10-40s, so capping at 6 was needlessly short. Instead,
//    each of these video sub-scenes now carries a bigger chunk of that
//    scene's narration (roughly 12-18s worth), and `maxDuration` is left
//    OMITTED so it defaults to that sub-scene's real TTS-computed length
//    (per Pexels.md — "no need to hand-tune it per scene"). `loop: true`
//    stays on purely as a safety net for whatever edge case undershoots.
//    Same anti-looping principle as the AI clips either way: each video
//    only ever has to cover its OWN sub-scene, never the full ~45s scene.
//
// 4. Your 4 AI-generated clips stay exactly where they were (scenes 1/4/7),
//    just re-sized to 1920x1080 — those keep their explicit maxDuration
//    (4/8) since those are fixed-length placeholder files, not searched
//    footage with room to extract more from.
//
// No beat/bpm music — bgMusic uses a downloaded mood track, output.beat is
// intentionally omitted. Ken Burns on every still uses rotate-cw/rotate-ccw
// at 0.3 mixed with zoom/pan (one rotate per ~4 slides, per the "mix, don't
// uniform-ize" guidance in New_Features_documentation.md).
// =============================================================================

module.exports = {

  output: {
    title:      'fighter-jet-flight-computers',
    format:     'landscape',
    width:      1920,
    height:     1080,
    fps:        30,
    crf:        18,
    preset:     'medium',
    bgMusicVol: 0.18,
    bgMusic:    { mood: 'cinematic' },   // downloaded mood track — NOT output.beat (no beat, as requested)
    postProcess: {
      grain:              true,
      grainStrength:      0.03,
      vignette:           true,
      vignetteStrength:   0.35,
      scanlines:          false,
      colorGrade:         '#1a2f3f',
      colorGradeStrength: 0.08,
    },
  },

  defaults: {
    voice:          'bm_george',   // deep/commanding — documentary/dark-content default per Voices.md
    speed:          1.0,
    transition:     'fade',
    effectStrength: 1.0,
  },

  scenes: [

    // =========================================================================
    // SCENE 1a — Hook, part 1 — AI VIDEO #1 (4s) — its own small scene
    // =========================================================================
    {
      transition:         'zoom-in',
      transitionDuration: 0.5,
      tts: {
        text:  'Take a look at this fighter jet.',
        voice: 'bm_george',
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
          type: 'video',
          // PLACEHOLDER — AI video 1 of 4 — 4 second hook clip, 16:9 export
          url:  'https://files.catbox.moe/k9hznr.mp4',
          maxDuration: 4,
          loop:  true,
          x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
        },
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 1b — Hook, part 2 — AI VIDEO #2 (4s) — its own small scene
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text:  "It slices through the sky with incredible precision.",
        voice: 'bm_george',
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
          type: 'video',
          // PLACEHOLDER — AI video 2 of 4 — 4 second hook clip, 16:9 export
          url:  'https://files.catbox.moe/kff6id.mp4',
          maxDuration: 4,
          loop:  true,
          x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
        },
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 1c — Hook, continuation — Pexels stills (rest of Scene 1 script)
    // =========================================================================
    {
      transition:         'fade',
      transitionDuration: 0.5,
      tts: {
        text: "pulling off turns that seem to defy physics. But here's the strange part. "
            + "Many modern fighter jets aren't designed to be naturally stable. If their flight "
            + "computers suddenly stopped working, some would become extremely difficult for a "
            + "pilot to control as intended. Why would engineers build an aircraft that doesn't "
            + "want to fly on its own? The answer is surprisingly simple. Stability makes an "
            + "aircraft easier to fly—but instability makes it far more agile. And in the world "
            + "of fighter jets, agility can make all the difference. So if these aircraft are "
            + "intentionally unstable, what's really keeping them in the sky? The answer isn't "
            + "just the pilot... it's an invisible computer making constant corrections every second.",
        voice: 'bm_george',
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 52,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'fighter jet sharp turn sky',
            'military jet flying fast',
            'fighter jet cockpit closeup',
            'fighter jet on runway',
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
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 2a — The Fighter That Wants to Crash, opening — Pexels video (~6s)
    // =========================================================================
    {
      transition:         'fade',
      transitionDuration: 0.5,
      tts: {
        text: "To understand why modern fighter jets need computers, we first need to "
            + "understand stability. Think about throwing a dart. It naturally points forward "
            + "and corrects itself as it flies. That's what engineers call a stable design.",
        voice: 'bm_george',
        emotion: 'serious',
        pauseAfter: 0.15,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 54,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'fighter jet flying',
          orientation: 'landscape',
          // maxDuration omitted — defaults to this sub-scene's real TTS
          // length (~14-16s here); Pexels b-roll commonly runs 10-40s so
          // this rarely needs to loop at all.
          loop: true,
          x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
        },
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 2b — The Fighter That Wants to Crash, continuation — Pexels stills
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "Now imagine trying to "
            + "balance a pencil on your fingertip. The slightest movement sends it falling unless "
            + "you make constant corrections. Many modern fighter jets are designed to behave "
            + "more like that pencil than the dart. Why? Because an unstable aircraft can change "
            + "direction much faster. It doesn't resist turning—it almost wants to turn. That "
            + "gives pilots incredible maneuverability, but it also creates a problem. A human "
            + "simply can't react fast enough to keep an unstable aircraft under control. That's "
            + "why every movement of a modern fighter jet depends on something working silently "
            + "in the background... a flight computer that never stops thinking.",
        voice: 'bm_george',
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 52,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'dart throwing macro',
            'pencil balancing finger',
            'fighter jet high g turn',
            'jet aircraft maneuver sky',
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
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 3a — The Four Forces of Flight, opening — Pexels video (~6s)
    // =========================================================================
    {
      transition:         'fade',
      transitionDuration: 0.5,
      tts: {
        text: "So, what actually keeps a fighter jet in the air? Like every aircraft, it "
            + "relies on four fundamental forces: lift, weight, thrust, and drag.",
        voice: 'bm_george',
        emotion: 'serious',
        pauseAfter: 0.15,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 54,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'airplane flying clouds',
          orientation: 'landscape',
          // maxDuration omitted — defaults to this sub-scene's real TTS length
          loop: true,
          x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
        },
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 3b — The Four Forces of Flight, continuation — Pexels stills
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "Lift pushes the aircraft upward. Weight pulls it back toward "
            + "Earth. Thrust from the engines drives it forward, while drag constantly tries to "
            + "slow it down. For steady flight, these forces must remain in balance. But in a "
            + "modern fighter jet, that balance is constantly changing. Every turn, every climb, "
            + "every gust of wind shifts the forces acting on the aircraft. The pilot can't "
            + "calculate those changes in real time. Instead, onboard computers monitor the "
            + "aircraft continuously, making tiny adjustments to the control surfaces to keep "
            + "everything balanced—often before the pilot even notices anything has changed. "
            + "Without those invisible corrections, flying a modern fighter jet would be far more "
            + "difficult than it appears.",
        voice: 'bm_george',
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 52,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'airplane wing flying',
            'jet contrail sky',
            'aircraft flying through clouds',
            'aircraft control surfaces closeup',
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
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 4a — The Invisible Hands, opening — AI VIDEO #3 (8s) — its own small scene
    // =========================================================================
    {
      transition:         'fade',
      transitionDuration: 0.5,
      tts: {
        text:  "Imagine trying to balance that pencil again—but this time, it's traveling "
             + "at hundreds of kilometers per hour.",
        voice: 'bm_george',
        emotion: 'serious',
        pauseAfter: 0.2,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 54,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'video',
          // PLACEHOLDER — AI video 3 of 4 — 8 second clip, 16:9 export (Scene 4)
          url:  'https://files.catbox.moe/7aus2m.mp4',
          maxDuration: 8,
          loop:  true,
          x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
        },
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 4b — The Invisible Hands, continuation — Pexels stills
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "through constantly changing air. That's the challenge a modern fighter jet "
            + "faces every second. Even when the aircraft appears perfectly smooth from the "
            + "outside, its control surfaces are making tiny, rapid movements almost "
            + "continuously. They're responding to changing airflow, turbulence, speed, and the "
            + "pilot's commands. These adjustments happen far faster than any human could react. "
            + "In reality, the aircraft is never sitting perfectly still. It's being gently and "
            + "continuously corrected by an invisible digital system working in the background. "
            + "The jet may look effortless, but behind every perfectly controlled turn is a "
            + "computer making thousands of tiny decisions to keep the aircraft exactly where it "
            + "should be.",
        voice: 'bm_george',
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 52,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'aircraft control surface closeup',
            'fighter jet wing flap flying',
            'jet flying through turbulence',
            'circuit board closeup technology',
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
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 5a — The Digital Pilot, opening — Pexels video (~6s)
    // =========================================================================
    {
      transition:         'fade',
      transitionDuration: 0.5,
      tts: {
        text: "So what is this invisible system? It's called fly-by-wire. In older aircraft, "
            + "moving the control stick was connected directly to the control surfaces through "
            + "mechanical cables and hydraulic systems.",
        voice: 'bm_george',
        emotion: 'serious',
        pauseAfter: 0.15,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 54,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'airplane cockpit pilot flying',
          orientation: 'landscape',
          // maxDuration omitted — defaults to this sub-scene's real TTS length
          loop: true,
          x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
        },
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 5b — The Digital Pilot, continuation — Pexels stills
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "In a modern "
            + "fighter jet, the pilot's input is first sent to powerful flight-control "
            + "computers. These computers receive information from dozens of sensors measuring "
            + "speed, altitude, acceleration, angle of attack, and the aircraft's position in "
            + "space. In just fractions of a second, they calculate the safest and most "
            + "effective response, then command multiple control surfaces to move together with "
            + "incredible precision. The pilot decides where the aircraft should go. The flight "
            + "computer decides how to get it there.",
        voice: 'bm_george',
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 52,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'cockpit instruments closeup',
            'pilot flying aircraft',
            'aviation control panel closeup',
            'aircraft dashboard closeup',
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
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 6a — The Engine That Thinks, opening — Pexels video (~6s)
    // =========================================================================
    {
      transition:         'fade',
      transitionDuration: 0.5,
      tts: {
        text: "The flight computer isn't the only intelligent system onboard. Even the "
            + "engines have their own digital brain. Modern fighter jets use advanced "
            + "engine-control computers that constantly monitor fuel flow, air pressure, "
            + "temperature, and engine speed.",
        voice: 'bm_george',
        emotion: 'serious',
        pauseAfter: 0.15,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 54,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'jet engine closeup',
          orientation: 'landscape',
          // maxDuration omitted — defaults to this sub-scene's real TTS length
          loop: true,
          x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
        },
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 6b — The Engine That Thinks, continuation — Pexels stills
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "Every second, they make tiny adjustments "
            + "to keep the engine producing maximum performance while preventing damage. Push "
            + "the throttle forward, and the engine doesn't simply respond with more power. The "
            + "computer calculates exactly how much fuel and airflow are needed, ensuring the "
            + "engine delivers smooth, reliable thrust. While one computer keeps the aircraft "
            + "stable, another keeps its engines operating at peak performance. Together, they "
            + "transform raw power into controlled flight.",
        voice: 'bm_george',
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 52,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'jet engine turbine blades',
            'aircraft engine closeup',
            'jet engine afterburner fire',
            'airplane exhaust closeup',
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
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 7a — Pilot and Machine, opening — AI VIDEO #4 (8s) — its own small scene
    // =========================================================================
    {
      transition:         'fade',
      transitionDuration: 0.5,
      tts: {
        text:  "With all this automation, you might wonder... is the computer flying the "
             + "jet instead of the pilot? Not quite.",
        voice: 'bm_george',
        emotion: 'serious',
        pauseAfter: 0.2,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 54,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'video',
          // PLACEHOLDER — AI video 4 of 4 — 8 second clip, 16:9 export (Scene 7)
          url:  'https://files.catbox.moe/v0y351.mp4',
          maxDuration: 8,
          loop:  true,
          x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
        },
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 7b — Pilot and Machine, continuation — Pexels stills
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "The pilot still makes every important decision—when to climb, turn, dive, or "
            + "avoid danger. But instead of moving the control surfaces directly, those "
            + "commands are interpreted by the flight-control computer. In an instant, it "
            + "calculates the best way to perform the maneuver, coordinating the wings, tail, "
            + "engine, and other control surfaces at the same time. The result is a "
            + "partnership. The pilot provides the judgment, experience, and mission goals. "
            + "The computer provides the speed, precision, and constant corrections that no "
            + "human could ever make alone. Together, they become one of the most capable "
            + "flying systems ever created.",
        voice: 'bm_george',
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 52,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'fighter pilot cockpit view',
            'pilot flying aircraft portrait',
            'server hardware closeup technology',
            'fighter jets formation flying',
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
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 8a — The Future of Flight, opening — Pexels video (~6s)
    // =========================================================================
    {
      transition:         'fade',
      transitionDuration: 0.5,
      tts: {
        text: "The next time you watch a fighter jet soar across the sky, remember—you're "
            + "not just seeing powerful engines or advanced aerodynamics. You're witnessing "
            + "millions of engineering decisions working together in perfect harmony.",
        voice: 'bm_george',
        emotion: 'serious',
        pauseAfter: 0.1,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 54,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'fighter jet flying sunset',
          orientation: 'landscape',
          // maxDuration omitted — defaults to this sub-scene's real TTS length
          loop: true,
          x: 0, y: 0, width: 1920, height: 1080, fit: 'cover',
        },
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'], angle: 180,
        },
      ],
    },

    // =========================================================================
    // SCENE 8b — The Future of Flight, continuation — Pexels stills (closing montage)
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "Modern fighter jets push the limits of what humans can control. Without "
            + "their flight computers, many would lose the precision and agility that define "
            + "them. The pilot may sit in the cockpit, but every second, invisible computers are "
            + "working alongside them, making continuous corrections that keep the aircraft "
            + "stable. In the end, the greatest breakthrough wasn't just building a faster "
            + "fighter jet. It was teaching a machine how to fly it.",
        voice: 'bm_george',
        emotion: 'serious',
        pauseAfter: 0.6,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 52,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'stock-image-sequence',
          queries: [
            'fighter jets formation sky',
            'airplane silhouette sunset',
            'fighter jet clouds flying',
            'advanced stealth aircraft flying',
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
        {
          type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.65)'], angle: 180,
        },
      ],
    },

  ],
};