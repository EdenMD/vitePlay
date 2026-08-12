// =============================================================================
// config.glowchecka-phone-demo.js
// Silent phone-mockup walkthrough of https://glowchecka.netlify.app using
// the engine's animations/phone-frame.html — a real HTML/CSS device bezel
// with the live site loaded inside a real iframe (not a canvas screenshot
// composite), scripted to scroll down the page over the recording.
// =============================================================================
//
// HOW THIS WORKS (see animations/phone-frame.html's own header comment and
// documentations/Html_recording_Interactions.md for the full mechanics):
//   - `src` points at the wrapper file with the target URL as a query param.
//   - `iframeSelector: '#site-frame'` tells the engine to resolve every
//     `interactions` selector/scroll INSIDE that iframe, not the wrapper
//     shell — this is what lets `scroll` actually scroll the real site.
//   - `waitFor: '[data-ready="1"]'` — the wrapper only sets that attribute
//     once the FRAMED SITE has actually finished loading (see the iframe's
//     'load' listener in phone-frame.html), not just the empty shell.
//   - `cursor: false` — the wrapper draws its own glowing cursor via
//     `window.__apexSetCursor`; the engine's normal synthetic cursor isn't
//     needed (and would draw on the wrong layer/coordinate space) here.
//   - REQUIRES glowchecka.netlify.app to not send a restrictive
//     X-Frame-Options/CSP frame-ancestors header — if it blocks framing,
//     the iframe will fail to load and `waitFor` will time out. Netlify
//     sites usually don't set this by default, but there's no way to
//     confirm from here without actually running the recording pass.
//
// Four ascending `scroll` interactions give a smooth, continuous scroll
// down the page rather than one big jump — each targets an absolute Y
// (not a delta), increasing speed slightly deeper into the page since a
// scroll to a much larger Y at the same px/sec takes proportionally
// longer otherwise.
//
// No `tts` on this scene — it's a silent b-roll-style demo — so
// `scene.duration` is set explicitly (12s) and matches the layer's own
// `duration` so the recording isn't cut short or padded with a static
// last frame.
//
// Run with:  VIDEO_CONFIG=config.glowchecka-phone-demo.js node engine-ci.js

module.exports = {

  output: {
    title:  'glowchecka-phone-walkthrough',
    format: 'portrait',
    fps:    30,
    crf:    20,
    preset: 'medium',
  },

  scenes: [
    {
      duration: 12,   // no tts on this scene — silent demo, so this drives length

      layers: [
        // Simple dark gradient behind the phone mockup so it doesn't sit
        // on a flat/transparent background.
        {
          type: 'gradient',
          colors: ['#141821', '#05060a'],
          gradientType: 'radial',
        },
        {
          type:           'html-record',
          src:            './animations/phone-frame.html?url=' + encodeURIComponent('https://glowchecka.netlify.app'),
          iframeSelector: '#site-frame',
          waitFor:        '[data-ready="1"]',
          cursor:         false,
          duration:       12,
          fps:            30,
          viewport:       { width: 1080, height: 1920 },
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',

          interactions: [
            { at: 2.0,  action: 'scroll', y: 700,  speed: 220 },
            { at: 4.5,  action: 'scroll', y: 1500, speed: 260 },
            { at: 7.0,  action: 'scroll', y: 2400, speed: 300 },
            { at: 9.5,  action: 'scroll', y: 3400, speed: 340 },
          ],
        },
      ],
    },
  ],
};