# APEX Config — Full Syntax & Structure Reference

Everything a config file (`config.js`, or whatever `$VIDEO_CONFIG` points to) can contain, with small examples for each part. For deep dives on specific systems, this doc links out to their dedicated docs rather than duplicating them.

---

## Top-Level Shape

```js
module.exports = {
    output:   { /* video-wide settings */ },
    defaults: { /* fallback values applied to every scene */ },
    scenes:   [ /* array of scene objects, rendered in order */ ],
};
```

Three keys, all optional except `scenes` (an empty video isn't a video). `output` and `defaults` fall back to sensible built-ins if omitted entirely.

### The four things `module.exports` can actually be

```js
module.exports = { output, scenes };                    // plain object — the classic form
module.exports = () => ({ output, scenes });             // sync function
module.exports = async () => ({ output, scenes });       // async function — fetch data first
module.exports = (async () => ({ output, scenes }))();   // pre-invoked Promise
```

All four resolve identically from the engine's point of view. See **"What Dynamic Config Opens Up"** near the end of this doc, and `DynamicConfig.md` for the full writeup — this is the newest capability and the one with the most leverage for your actual workflow.

---

## `output` — Video-Wide Settings

```js
output: {
    title:   'my-video',      // used to build the output filename
    format:  'portrait',      // 'portrait' | 'landscape' | 'square'
    fps:     30,
    crf:     18,              // lower = higher quality, bigger file. 18 default, 23-28 for fast test renders
    preset:  'medium',        // ffmpeg x264 preset: 'fast' for testing, 'medium'/'slow' for final
    width:   1080,            // auto-set from `format` if omitted
    height:  1920,            // auto-set from `format` if omitted
    bgMusicVol: 0.22,
    bgMusic:    { mood: 'dark' },   // downloads a mood-matched track — see Requirements.md
    beat:       { bpm: 96, bars: 4, genre: 'lofi', key: 'Amin', vol: 0.28 },  // generates one instead — see BeatGen.md
    postProcess: {
        grain: true, grainStrength: 0.04,
        vignette: true, vignetteStrength: 0.5,
        scanlines: false,
        colorGrade: '#ff6600', colorGradeStrength: 0.15,
    },
}
```

`bgMusic` and `beat` are mutually exclusive in practice — use a downloaded mood track OR a generated beat, not both (the generated one wins if both are set, since it overwrites `resolvedBgMusic`).

`format: 'square'` forces `1080×1080` regardless of `width`/`height`. `landscape` defaults to `1920×1080` if you don't override `width`/`height` yourself.

---

## `defaults` — Fallbacks Applied Per Scene

```js
defaults: {
    voice:          'af_heart',
    speed:          1.0,
    transition:     'fade',
    voiceFX:        'deep',
    effectStrength: 1.0,
}
```

Anything a scene's own `tts`/`transition` doesn't specify falls back to these. Skip this block entirely and every scene needs its own `voice`/`transition` set explicitly — fine for a one-off, tedious for a multi-scene video with one consistent narrator.

---

## `scenes` — The Array That Actually Matters

```js
scenes: [
    {
        duration:            4,          // only needed if there's no tts (silent/text-only scene)
        transition:          'zoom-in',  // how THIS scene enters — see transition list below
        transitionDuration:  0.6,        // seconds, clamped to ≤45% of scene duration
        tts:      { /* narration for this scene */ },
        captions: { /* burned-in caption styling for this scene */ },
        layout:   { /* layout preset — see layouting.md */ },
        layers:   [ /* the actual visual content, back to front */ ],
    },
    // ...more scenes
],
```

Scenes render in array order. Duration is normally implicit — determined by how long the TTS audio for that scene ends up being — `duration` is only needed when a scene has no `tts` at all (a title card, a silent b-roll beat).

### `tts`

```js
tts: {
    text:           'The actual narration line for this scene.',
    voice:          'am_adam',           // see Voices.md for the full list, ~50 voices across 9 languages
    emotion:        'serious',           // affects Kokoro's delivery — 'neutral'|'happy'|'sad'|'serious'|'excited'|...
    speed:          1.0,
    voiceFX:        'robot',             // preset name, or a custom { pitch, tempo, robot, echo } object
    effectStrength: 1.4,                 // 0.3–2.0, scales how far voiceFX pushes from neutral
    pauseBefore:    0.2,                 // seconds of silence prepended
    pauseAfter:     0.4,                 // seconds of silence appended (default 0.4)
}
```

`voiceFX` presets: `chipmunk`, `helium`, `deep`, `bass`, `demon`, `giant`, `robot`, `echo`, `fast`, `slow` — or hand-roll one with `{ pitch: 1.2, tempo: 0.9 }` etc. directly.

### `captions`

```js
captions: {
    style:          'highlight',    // word-highlight-as-spoken burned-in captions
    position:       'bottom',       // 'bottom' | 'top' | 'middle'
    fontSize:       64,
    color:          '#ffffff',
    highlightColor: '#ffdd00',
    bgColor:        'rgba(0,0,0,0.60)',
    wordsPerChunk:  3,               // how many words show on screen at once
    maxWidth:       0.88,            // fraction of frame width
}
```

Omit `captions` entirely for a scene with no burned-in captions. When present, `layout`/reflow both read the caption zone automatically to keep other text from overlapping it (see `layouting.md`'s note on the caption-aware safe-zone bound).

### `layout`

```js
layout: { type: 'grid', cols: 2, rows: 2, cellW: 460, cellH: 300, gapX: 40, gapY: 40 }
```

Eight types: `linear`, `stack`, `relative`, `grid`, `anchor`, `flex`, `css`, `absolute`. Full reference with examples for every type: **`layouting.md`**. Omit `layout` entirely and the scene uses the older reflow system instead (auto-fit/reposition based on collision detection) — both systems are still fully supported, a scene uses one or the other, never both.

### `transition`

One of: `fade`, `wipe-right`, `wipe-left`, `wipe-down`, `wipe-up`, `zoom-in`, `zoom-out`, `slide-left`, `slide-right`, `glitch`, `iris`, `split-h`, `split-v`, `rotate`, `zoom-cut`.

```js
{ transition: 'glitch', transitionDuration: 0.4 }
```

---

## `layers` — The Actual Content

Every layer is a plain object with a `type` field plus whatever properties that type uses. Layers draw back-to-front in array order (first layer = bottom).

### Properties common to most layers

```js
{
    type:     'text',           // required
    x: 540, y: 800,             // position — usually the element's CENTER, not top-left
    width: 900, height: 200,    // size (media/shape layers)
    opacity:  1,
    fit:      'cover',          // media layers: 'cover' | 'contain' | 'fill'
    animation:'pop',            // entrance animation — 'pop'|'fade'|'slide-*'|... (layer-type dependent)
    startT:   0.1,               // seconds into the scene before this layer starts animating in
    animDur:  0.5,
    borderRadius: 16,
}
```

Not every layer type uses every property — a `gradient` layer doesn't care about `fit`, a `text` layer doesn't care about `borderRadius` unless it has a background fill. Check the relevant dedicated doc (or the small example configs below) for what actually applies to a given type.

### Layer types at a glance

This engine has ~45 layer types. Grouping by category — most are self-explanatory from the name and a small example; the ones with real depth have their own doc, linked.

**Text & Data Display**
`text`, `kinetic-text`, `neon-text`, `glitch-text`, `typewriter-reveal`, `number-roll`, `stat-counter`, `countdown`, `countdown-reveal`, `quote-card`, `word-cloud`, `ticker`, `list-reveal`, `split-reveal`, `lyrics-line`

**Charts & Comparisons**
`chart`, `bubble-chart`, `flow-chart`, `heatmap`, `comparison`, `leaderboard`, `score-card`, `meter`, `radial-bars`, `progress-bar`, `progress-ring`, `timeline`, `map-callout`

**Social / UI Mockups**
`fake-chat`, `phone-mockup`, `mockup`, `notification-card`, `poll-card`, `icon-counter`

**Media**
`image`, `image-sequence`, `giphy`, `waveform`, `svg-draw`, `scene-prop`

**Shapes & Background**
`shape`, `gradient`, `background`, `overlay`, `divider`, `grid`, `scanlines`, `audio-reactive-border`

**Characters**
`stickman` (procedural, code-driven — see the engine's stickman system docs), `avatar` (resolved outside the main dispatcher, drawn directly)

**Weather / Misc**
`weather`

**HTML Recording**
`html-record` — the big one. Plain recording, `audioSync: true`, and `interactions: [...]` are all this one layer type. See **`AUDIOSYNC.md`**, **`HTMLInteractions.md`**, and **`HTMLRecordingTiming.md`**.

**Pre-resolved types** (write these in config; the engine mutates them into `image`/`image-sequence` before the render dispatcher ever sees them — so they don't appear in the dispatcher's own type list, that's expected)
`ai-image` (see **`PollinationsImageGen.md`**), `pexels-video` (see **`PexelsVideo.md`**), `giphy` (see **`Giphy.md`**), `stock-image`, `url-image`

### Small examples

```js
// Full-bleed background image
{ type: 'image', src: './assets/bg.jpg', x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' }

// Title text, centered, with entrance animation
{ type: 'text', text: 'THE FALL OF ROME', x: 540, y: 400, fontSize: 96,
  color: '#fff', align: 'center', animation: 'pop', startT: 0.2 }

// AI-generated background (Pollinations)
{ type: 'ai-image', prompt: 'ancient Roman forum at dusk', style: 'cinematic',
  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' }

// Real stock b-roll (Pexels)
{ type: 'pexels-video', query: 'stormy ocean waves', orientation: 'portrait',
  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' }

// A stat counter animating up to a value
{ type: 'stat-counter', value: 92, suffix: '%', label: 'approval rating',
  x: 540, y: 900, fontSize: 90 }

// Recorded HTML/CSS/JS animation
{ type: 'html-record', src: './animations/orb.html', duration: 5,
  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' }
```

---

## Full Minimal Example

```js
module.exports = {
    output:   { title: 'test', format: 'portrait', fps: 30, crf: 23, preset: 'fast' },
    defaults: { voice: 'af_heart', transition: 'fade' },
    scenes: [
        {
            tts: { text: 'This is a test video.', voice: 'af_heart', emotion: 'happy' },
            layers: [
                { type: 'gradient', gradientType: 'radial', colors: ['#1a0035', '#000'] },
                { type: 'text', text: 'HELLO', x: 540, y: 800, fontSize: 100, color: '#fff', animation: 'pop' },
            ],
        },
    ],
};
```

(`config.minimal.js` in the repo is exactly this, slightly expanded — good starting point to copy from.)

---

## What Dynamic Config Actually Opens Up

The object/function distinction sounds academic until you look at what it removes. Every one of these was previously "write a separate script that generates `config.js`, then run the engine" — now it's one file.

**Generate a whole batch from one API call**

```js
module.exports = async () => {
    const topics = await fetch('https://your-server.com/api/next-batch').then(r => r.json());
    return {
        output: { title: topics.seriesName, format: 'portrait' },
        defaults: { voice: 'bm_george', transition: 'fade' },
        scenes: topics.items.map(item => ({
            tts: { text: item.script },
            layers: [
                { type: 'ai-image', prompt: item.imagePrompt, style: 'documentary',
                  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'text', text: item.headline, y: 300, fontSize: 80, color: '#fff' },
            ],
        })),
    };
};
```

One API call, one config, an entire multi-scene video — instead of hand-writing `scenes` for each new script.

**Pull structured content from a spreadsheet/CMS instead of hardcoding it**

If your actual scripts/hooks/captions already live in a Google Sheet or a headless CMS (Notion API, Airtable, whatever), the config can go get them directly instead of you copy-pasting text into `config.js` by hand every time:

```js
module.exports = async () => {
    const rows = await fetch(process.env.SHEET_API_URL).then(r => r.json());
    return { output: {...}, scenes: rows.map(rowToScene) };
};
```

**Conditional scene assembly based on real data**

```js
module.exports = async () => {
    const stats = await fetch('https://your-server.com/api/stats').then(r => r.json());
    const scenes = [openingScene(stats)];
    if (stats.hasControversy) scenes.push(controversyScene(stats));  // only include if relevant
    scenes.push(closingScene(stats));
    return { output: {...}, scenes };
};
```

Previously this kind of branching had to happen in a wrapper script that wrote out a `config.js` file before the engine ran. Now it's just... the config.

**Environment-based variants from one config file**

```js
module.exports = async () => {
    const draft = process.env.RENDER_MODE === 'draft';
    return {
        output: { crf: draft ? 30 : 18, preset: draft ? 'ultrafast' : 'medium' },
        scenes: await buildScenes(draft),
    };
};
```

One file, one CI workflow input, two very different render profiles — fast/rough for iterating on a script, full quality for the real upload.

The common thread: anything that used to require a separate build step *before* `engine-ci.js` even ran can now live inside the config itself. See `DynamicConfig.md` for error-handling behavior and the caching caveat (async-fetched content that genuinely changes between runs will correctly cache-miss, same as if you'd hand-edited the file).