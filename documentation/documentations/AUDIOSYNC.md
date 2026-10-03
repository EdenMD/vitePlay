# Audio-Synced HTML Recording — Feature Documentation

Puppeteer-recorded HTML/CSS/JS animations that react, frame-accurately, to the actual TTS narration and beat track of the scene they're in — live words, beat hits, and volume, all pushed into the page before each frame is captured.

---

## What This Actually Lets You Build

Without this, an `html-record` layer is a fixed animation — it plays the same way every time, deaf to whatever narration or music ends up in that scene. `audioSync: true` removes that disconnect. The page gets told, frame by frame, exactly what's happening in the audio:

- **A waveform, EQ bar, or orb that visibly reacts to the narration's volume** — not a canned pulse loop, the actual amplitude of what's being said, frame-accurate.
- **On-screen word-by-word captions driven by real TTS timing**, rendered as native HTML/CSS instead of canvas-drawn text — lets you use real CSS animations, fonts, and effects on the caption itself.
- **Beat-synced visual hits** — a shape that flashes, scales, or shakes exactly on the kick/snare from the generated beat track, not a guessed interval.
- **Data visualizations that build in sync with narration** — a bar chart that fills in as the narrator counts up, a diagram that highlights the part currently being described.

The mental model: your HTML page is a normal web page that happens to also listen for one event (`apexframe`) and read one global (`window.__APEX_AUDIO__`). Everything else — CSS, canvas, SVG, whatever — works exactly like it would in a browser, because it's genuinely running in one (Puppeteer/Chrome) during recording.

---

## How It Works

```
Phase 0.25 (pre-render)     — plain html-record layers (audioSync: false) record here,
                               before TTS/beats exist, and get cached across runs.

Phase 1     (TTS)           — narration audio is generated per scene.
Phase 1.2   (word timings)  — per-word start/end times extracted from the TTS audio.
Phase 0.4   (beat gen)      — background beat track + event timeline generated, if configured.

Phase 1.6 (pre-render, AFTER the above)
  1. For each audioSync html-record layer, assemble that scene's audio data:
     word timings, beat events (re-baselined to this scene's own local time —
     see "Critical Fixes" below), TTS amplitude envelope, bg-music amplitude
     envelope, bpm, duration.
  2. Launch Puppeteer, load the page, wait for it to be ready.
  3. Inject window.__APEX_AUDIO__ once (the full data set, for pages that
     want to read ahead or pre-compute anything).
  4. For every frame: dispatch an 'apexframe' CustomEvent carrying just that
     frame's slice of data, THEN screenshot the page.
  5. Mutate the layer into an image-sequence, same render path as any other
     html-record or Giphy layer.
```

**Why deferred to Phase 1.6 specifically:** word timings don't exist until TTS has actually run, and beat events don't exist until the beat track has actually been generated. A plain (non-audioSync) `html-record` layer has no such dependency, so it records much earlier (Phase 0.25) and gets cached — see the caching note below for why that distinction matters.

---

## Layer Config

```js
{
  type:       'html-record',
  src:        './animations/waveform.html',
  audioSync:  true,             // enables everything in this document
  duration:   5.0,              // how many seconds of frames to record
  fps:        30,
  viewport:   { width: 1080, height: 1920 },
  x: 0, y: 0, width: 1080, height: 1920,
  fit:        'cover',
  waitFor:    '#ready',         // optional — wait for a selector before recording starts
  waitMs:     500,               // optional — flat wait after that, or instead of it
}
```

`waitFor`/`waitMs` matter more here than on a plain html-record layer: your page needs to have already set up its `apexframe` listener *before* the first frame is captured, or the first however-many frames get dispatched to nothing. A common pattern is to flip a hidden element visible (or set a JS flag polled by a tiny custom wait) once your listener is attached, and `waitFor` that selector.

---

## `window.__APEX_AUDIO__` — injected once, before recording starts

```js
const audio = window.__APEX_AUDIO__;
// audio.words        → [{word, start, end}, ...]   TTS word timings, scene-relative seconds
// audio.beats        → [{t, type, velocity}, ...]   beat events, scene-relative seconds
// audio.amplitudes   → number[]                     TTS RMS per frame (0–1), index = frame number
// audio.bgAmplitudes → number[]                      BG music/beat RMS per frame (0–1)
// audio.bpm          → number
// audio.duration     → number   (seconds, this scene's audio duration)
// audio.fps          → number   (the recording fps — index amplitudes/bgAmplitudes by frame, not by second)
```

Everything here is **scene-relative** — `t: 0` in `words`/`beats` means the start of this scene's own audio, not the start of the full video. You don't need to know or care where this scene falls in the overall timeline.

---

## `'apexframe'` — dispatched every frame, right before the screenshot

```js
window.addEventListener('apexframe', (e) => {
  const {
    t,           // current time in seconds, scene-relative
    f,           // frame index
    word,        // active TTS word string at this instant, or null
    wordData,    // full {word, start, end} object, or null
    beat,        // beat type string that fired THIS frame: 'kick'|'snare'|'hihat'|... or null
    beatData,    // full {t, type, velocity} object, or null
    amplitude,   // TTS RMS at this frame (0–1)
    bgAmplitude, // BG music/beat RMS at this frame (0–1)
    bpm,
  } = e.detail;

  if (word)            subtitle.textContent = word;
  if (beat === 'kick')  orb.classList.add('pulse');
  bar.style.height    = (amplitude * 300) + 'px';
  waveform.style.transform = `scaleY(${0.3 + amplitude * 1.4})`;
});
```

`beat`/`beatData` are only non-null on the exact frame(s) closest to a beat event's timestamp (within half a frame duration) — treat it as a one-shot trigger (e.g. `classList.add()` + a `setTimeout` to remove it), not a sustained state.

---

## Full Example — Beat-Reactive Orb + Live Word Display

```html
<div id="orb"></div>
<div id="word"></div>
<div id="ready-flag" style="display:none"></div>
<style>
  #orb {
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, #ff4400, #ff000055);
    transition: transform 0.05s ease-out;
  }
  #orb.kick { transform: scale(1.4); box-shadow: 0 0 60px #ff4400; }
</style>
<script>
  const orb  = document.getElementById('orb');
  const word = document.getElementById('word');

  window.addEventListener('apexframe', (e) => {
    const { amplitude, bgAmplitude, beat, word: w } = e.detail;

    // Combine narration + music energy for the base scale
    orb.style.transform = `scale(${0.8 + Math.max(amplitude, bgAmplitude * 0.6) * 0.6})`;

    if (beat === 'kick') {
      orb.classList.add('kick');
      setTimeout(() => orb.classList.remove('kick'), 80);
    }

    if (w) word.textContent = w;
  });

  // Signal readiness AFTER the listener above is attached
  document.getElementById('ready-flag').style.display = 'block';
</script>
```

```js
{
  type:      'html-record',
  src:       './animations/beat_orb.html',
  audioSync: true,
  duration:  6.0,
  fps:       30,
  viewport:  { width: 1080, height: 700 },
  waitFor:   '#ready-flag',
  waitMs:    200,
}
```

---

## Caching — audioSync layers are NOT cached, by design

Plain `html-record` layers (Phase 0.25) cache their extracted frames to `work/html-frames/` and restore instantly on a repeat run with the same config. **audioSync layers always re-record, every single run** — there's a comment directly in the code to this effect: the recording depends on that scene's actual TTS/beat audio, which can change between runs (different narration text, different beat seed) even if the layer's own config (`src`, `duration`, etc.) hasn't. Caching by layer config alone would silently serve stale visuals that no longer match the audio playing under them.

Practical implication: an audioSync layer's recording cost is paid on every render, not just the first. Keep `duration` as short as narration-length allows, and reach for a plain (non-audioSync) `html-record` layer instead if the animation genuinely doesn't need to react to anything.

---

## Frame-Hold Behavior

If a scene's actual duration ends up longer than the layer's `duration`, the last recorded frame simply holds for the remainder — it does not error, loop, or freeze the whole scene. Set `duration` to comfortably cover the scene's expected narration length; a little longer than necessary is harmless (just a few extra recorded frames), a lot shorter means several seconds of a static final frame.

---

## Critical Fixes (this pass)

Two real bugs existed in how per-scene audio data was assembled for Phase 1.6, both silent (no error, no warning — just wrong data reaching the page):

**1. `bgAmplitude` was hardcoded to zero, always.** Every audioSync page reacting to `bgAmplitude` was reading a flat `0` regardless of what background music or beat track was actually playing — that data feed did nothing. Fixed: the raw (pre-loop) background audio file is now sampled for its real amplitude envelope, then wrapped with modulo arithmetic into each scene's frame window — the same way the final render itself loops that file via ffmpeg, so the sampled values match what's actually audible at that point in the video.

**2. Beat events were matched against the wrong time reference for any scene after the first.** The beat timeline only contains events for a single loop cycle (e.g. ~10 seconds for a 4-bar pattern) — the actual background *audio* is what gets looped across the full video length, separately, via ffmpeg. The previous code handed every scene the same unmodified single-cycle event list and matched it against that scene's own local (0-to-duration) frame time, which only happens to line up for the very first scene. Any audioSync layer in scene 2 or later effectively never saw a real beat — `beat` was `null` the entire clip. Fixed: beat events are now reconstructed across every loop repetition that actually overlaps a given scene's position in the full timeline, then re-baselined to that scene's local time — so `beat`/`beatData` fire correctly no matter which scene the layer is in.

If you built or tested an audioSync scene before this fix and the beat-reactive parts looked inert past the first scene, or bg-music-reactive elements never moved at all — that's why. Both should now behave as documented above.

---

## Interaction Scripting (unrelated to audio sync, but shares the same layer type)

`html-record` layers of any kind — audioSync or not — support scripted page interactions via `interactions: [...]`, all firing at `at: <seconds>`. 29 action types across mouse, keyboard, scroll, DOM manipulation, animation, and page-level control (click, type, drag, scroll-into-view, add-class, set-style, animate-element, evaluate, and more). This is a separate feature from audio sync — see the layer's own inline documentation in `src/html-record.js` for the full action reference, since it applies regardless of whether `audioSync` is set.

---

## Phase Order

```
Phase -1    Image resolution
Phase -0.75 Layout resolution
Phase -0.6  Pexels video resolution
Phase -0.5  Giphy resolution
Phase 0     AI image generation
Phase 0.25  HTML recording (non-audioSync layers only — cached)
Phase 0.4   Beat generation
Phase 0.5   Background music setup
Phase 1     TTS
Phase 1.2   Word timings
Phase 1.6   Audio-synced HTML recording  ← this feature (never cached)
Phase 1.5   SFX & audio mix
Phase 2     Rendering
Phase 3     Encoding
```

Note the numbering isn't strictly sequential — Phase 1.6 genuinely runs before Phase 1.5 in execution order, since audio-synced recording needs to happen before the final mix but the phase was numbered after TTS/word-timing work that's conceptually "phase 1.x". Worth knowing so the numbers aren't mistaken for a typo.