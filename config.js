// =============================================================================
// "The Machine That Flies It" — SHORT #2 (Scene 7 → Scene 8 cut)
// APEX Engine config — plain module.exports object, all values hardcoded
// =============================================================================
//
// URLS — using your real files this time
// -----------------------------------------------------------------------------
// Scene 7a's clip is the real catbox URL from your config
// (https://files.catbox.moe/v0y351.mp4) — matched by duration in your own
// build log ("8s trim"). One thing worth flagging: that log also shows its
// source resolution as 1280x720 (16:9 landscape), same as the other 3 clips.
// This short's canvas is 1080x1920 (9:16). `fit: 'cover'` will scale it up
// and crop the sides hard to fill a vertical frame — fine if the jet stays
// roughly centered in the shot, but worth a quick look once rendered in
// case anything important gets cropped off the edges.
//
// WHAT THIS IS
// -----------------------------------------------------------------------------
// Full, unedited narration of Scene 7 ("Pilot and Machine" — the "who's
// really flying it" question) straight through Scene 8 ("The Future of
// Flight" — the closer), then one line: "Watch the full video on my
// channel." No other CTA copy added — kept to exactly what you asked for.
//
// THE CATCH, HANDLED
// -----------------------------------------------------------------------------
// Only two visual sources this time: your AI 8s clip (same Scene 7 clip from
// the long-form config) and `pexels-video`. Zero stills, zero
// stock-image-sequence anywhere. Scene 7's own AI clip sub-scene is
// untouched from the long-form file. Everything that was a stock-image-
// sequence in the long-form cut (Scene 7's continuation, all of Scene 8) is
// now re-cut as pexels-video clips instead — split into a couple of shots
// each rather than one long static shot, same reasoning as before: real
// footage, but still varied instead of one held take for 20-30s straight.
//
// RUNTIME — grounded in your real log, not a guess
// -----------------------------------------------------------------------------
// This is the exact same narration as Scene 7 + Scene 8 in your long-form
// run, just re-cut into more/different sub-scenes. Your actual log measured
// those two scenes at 47.08s + 41.50s = 88.6s combined. Re-slicing the same
// text into more scene boundaries adds a bit of per-scene overhead, so
// expect this to land around 90-95s once rendered — longer than the first
// short, because you asked for the full scene text this time, not a
// condensed trailer edit.
// =============================================================================

module.exports = {

  output: {
    title:      'fighter-jet-short-scene7-8',
    format:     'portrait',
    width:      1080,
    height:     1920,
    fps:        30,
    crf:        18,
    preset:     'medium',
    bgMusicVol: 0.18,
    bgMusic:    { mood: 'epic' },
    postProcess: {
      grain:              true,
      grainStrength:      0.03,
      vignette:           true,
      vignetteStrength:   0.4,
      scanlines:          false,
      colorGrade:         '#1a2f3f',
      colorGradeStrength: 0.08,
    },
  },

  defaults: {
    voice:              'bm_george',
    speed:              1.0,
    transition:         'fade',
    transitionDuration:  0.4,
    effectStrength:      1.0,
  },

  scenes: [

    // =========================================================================
    // 7a — AI VIDEO (8s) — same clip/line as the long-form Scene 7 opener
    // =========================================================================
    {
      transition:         'zoom-in',
      transitionDuration: 0.5,
      tts: {
        text:  "With all this automation, you might wonder... is the computer flying the "
             + "jet instead of the pilot? Not quite.",
        emotion: 'serious',
        pauseAfter: 0.2,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 60,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'video',
          // Same AI clip as the long-form Scene 7a — confirmed 8s in your log
          url:  'https://files.catbox.moe/v0y351.mp4',
          maxDuration: 8,
          loop:  true,
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)'], angle: 180 },
      ],
    },

    // =========================================================================
    // 7b-i — Scene 7 continuation, part 1 — pexels-video
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "The pilot still makes every important decision—when to climb, turn, dive, or "
            + "avoid danger. But instead of moving the control surfaces directly, those "
            + "commands are interpreted by the flight-control computer. In an instant, it "
            + "calculates the best way to perform the maneuver, coordinating the wings, tail, "
            + "engine, and other control surfaces at the same time.",
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 56,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'fighter jet cockpit pilot flying',
          orientation: 'portrait',
          loop: true,
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.5)'], angle: 180 },
      ],
    },

    // =========================================================================
    // 7b-ii — Scene 7 continuation, part 2 — pexels-video
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "The result is a partnership. The pilot provides the judgment, experience, and "
            + "mission goals. The computer provides the speed, precision, and constant "
            + "corrections that no human could ever make alone. Together, they become one of "
            + "the most capable flying systems ever created.",
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
          type: 'pexels-video',
          query: 'fighter jets formation flying',
          orientation: 'portrait',
          loop: true,
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.5)'], angle: 180 },
      ],
    },

    // =========================================================================
    // 8a — Scene 8 opening — pexels-video
    // =========================================================================
    {
      transition:         'fade',
      transitionDuration: 0.6,
      tts: {
        text: "The next time you watch a fighter jet soar across the sky, remember—you're "
            + "not just seeing powerful engines or advanced aerodynamics. You're witnessing "
            + "millions of engineering decisions working together in perfect harmony.",
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 56,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'fighter jet flying sunset cinematic',
          orientation: 'portrait',
          loop: true,
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.5)'], angle: 180 },
      ],
    },

    // =========================================================================
    // 8b-i — Scene 8 continuation, part 1 — pexels-video
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "Modern fighter jets push the limits of what humans can control. Without "
            + "their flight computers, many would lose the precision and agility that define "
            + "them.",
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 56,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'advanced stealth fighter jet flying',
          orientation: 'portrait',
          loop: true,
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.5)'], angle: 180 },
      ],
    },

    // =========================================================================
    // 8b-ii — Scene 8 continuation, part 2 (closing line of the doc) — pexels-video
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "The pilot may sit in the cockpit, but every second, invisible computers are "
            + "working alongside them, making continuous corrections that keep the aircraft "
            + "stable. In the end, the greatest breakthrough wasn't just building a faster "
            + "fighter jet. It was teaching a machine how to fly it.",
        emotion: 'serious',
        pauseAfter: 0.5,
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 56,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'fighter jet flying clouds cinematic',
          orientation: 'portrait',
          loop: true,
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
        },
        { type: 'gradient', gradientType: 'linear',
          colors: ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)'], angle: 180 },
      ],
    },

    // =========================================================================
    // CTA — the one line you asked for, nothing more
    // =========================================================================
    {
      transition:         'zoom-cut',
      transitionDuration: 0.3,
      tts: {
        text: "Watch the full video on my channel.",
        emotion: 'serious',
      },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 60,
        color: '#ffffff', highlightColor: '#ffdd00',
        bgColor: 'rgba(0,0,0,0.60)', wordsPerChunk: 4, maxWidth: 0.82,
      },
      layers: [
        {
          type: 'pexels-video',
          query: 'fighter jets formation flying sky',
          orientation: 'portrait',
          loop: true,
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
        },
        { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
        {
          type: 'text',
          text: 'FULL VIDEO\nON MY CHANNEL',
          x: 540, y: 500,
          fontSize: 70, fontFamily: 'Arial Black, Impact, sans-serif',
          fontWeight: 'bold', color: '#ffffff', align: 'center',
          maxWidth: 900, lineHeight: 1.15,
          gradient: ['#ffdd00', '#ff8c00'],
          stroke: true, strokeColor: '#000000', strokeWidth: 5,
          glow: true, glowColor: '#ffdd00', glowBlur: 28,
          animation: 'pop', animDur: 0.4, startT: 0.1,
        },
      ],
    },

  ],
};