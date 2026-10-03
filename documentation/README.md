# APEX Video Engine v2.4 — Complete Reference Documentation

> Every feature, every property, every option. Written directly from the
> engine source — nothing assumed, nothing invented. Last updated: v2.4.

---

## Table of Contents

1. [Engine Overview](#1-engine-overview)
2. [Repo Structure](#2-repo-structure)
3. [GitHub Actions Workflow](#3-github-actions-workflow)
4. [Output Settings](#4-output-settings)
5. [Scene Structure](#5-scene-structure)
6. [TTS — Voice System](#6-tts--voice-system)
7. [Captions — Auto-Sync System](#7-captions--auto-sync-system)
8. [Transitions Between Scenes](#8-transitions-between-scenes)
9. [Post-Processing Effects](#9-post-processing-effects)
10. [Layer System — How It Works](#10-layer-system--how-it-works)
11. [Universal Layer Properties](#11-universal-layer-properties)
12. [Background Layers](#12-background-layers)
    - background
    - gradient
    - overlay
    - scanlines
    - grid
13. [Image Layers](#13-image-layers)
    - image (+ Ken Burns)
    - image-sequence
    - stock-image
14. [AI Image Generation](#14-ai-image-generation)
15. [Web Recording Layer](#15-web-recording-layer)
16. [Text Layers](#16-text-layers)
    - text
    - kinetic-text *(NOTE: currently non-functional)*
17. [Text Effect Layers](#17-text-effect-layers)
    - glitch-text
    - neon-text
    - split-reveal
    - typewriter-reveal
    - word-cloud
18. [Shape Layers](#18-shape-layers)
19. [Data Visualisation Layers](#19-data-visualisation-layers)
    - chart (bar / line / pie / donut / horizontal-bar)
    - stat-counter
    - comparison
    - meter
    - progress-bar
    - progress-ring
    - radial-bars
    - number-roll
    - leaderboard
    - score-card
    - bubble-chart
    - heatmap
    - icon-counter
    - flow-chart
    - countdown-reveal
20. [UI / Presentation Layers](#20-ui--presentation-layers)
    - split-screen
    - phone-mockup
    - fake-chat
    - poll-card
    - mockup (simple)
    - notification-card
    - ticker
    - countdown
    - divider
    - list-reveal
    - quote-card
    - timeline
    - map-callout
21. [Audio Reactive Layers](#21-audio-reactive-layers)
    - waveform
    - audio-reactive-border
22. [Lyrics / Subtitle Layers](#22-lyrics--subtitle-layers)
    - lyrics-line
23. [Avatar System](#23-avatar-system)
24. [Particle System](#24-particle-system)
25. [Hook Layer System](#25-hook-layer-system)
26. [SFX — Sound Effects System](#26-sfx--sound-effects-system)
27. [Background Music](#27-background-music)
28. [Auto-Reflow System](#28-auto-reflow-system)
29. [Text Animations Reference](#29-text-animations-reference)
30. [Ken Burns Reference](#30-ken-burns-reference)
31. [Layout & Safe Zones](#31-layout--safe-zones)
32. [Image Caching](#32-image-caching)
33. [Running Locally](#33-running-locally)
34. [Troubleshooting](#34-troubleshooting)

---

## 1. Engine Overview

APEX Video Engine takes a JavaScript config file and outputs a
production-ready MP4 video. It runs entirely on GitHub Actions free tier.
No cloud credits. No subscriptions.

**Processing pipeline per video:**

```
Phase 0    — AI Image Generation (Pollinations.AI HTTP API)
Phase 0.25 — HTML Recording (Puppeteer headless Chromium)
Phase 0.5  — Background Music Download
Phase 1    — TTS (Kokoro-82M neural TTS, espeak fallback)
           — Caption tracks built from TTS text + audio duration
Phase 1.5  — SFX + Audio Mix
Phase 2    — Rendering
             For every frame:
               background → layers (ordered) → captions → post-process
             Auto-reflow fixes overlapping text layers
             hookLayer forces content visible from frame 0
             Frames JPEG-compressed → streamed to FFmpeg via pipe
Phase 3    — Encoding
             FFmpeg mixes audio + video → H.264 MP4
             Upload chain: GoFile → transfer.sh → oshi.at → Filebin → Catbox
```

**GitHub Actions free tier specs used:**

| Resource | Available | Typical usage |
|---|---|---|
| RAM | 7 GB | 2–4 GB |
| Disk | ~50 GB (after free-disk-space step) | 5–15 GB |
| CPU | 2 vCPUs | 2 vCPUs |
| Time limit | 6 hours | 8–25 min typical |

---

## 2. Repo Structure

```
your-repo/
├── engine-ci.js                  ← Master orchestrator — do not rename
├── config.js                     ← Your main config (default)
├── package.json
├── .gitignore
│
├── src/
│   ├── tts-kokoro.js             ← TTS engine + 26 voices + silence generator
│   ├── captions.js               ← Auto-caption pipeline (syllable-weighted timing)
│   ├── layers.js                 ← 30+ core layer types + hookLayer system
│   ├── layers-extra.js           ← 16 extended layer types (data viz, UI, text FX)
│   ├── html-record.js            ← Web recording via Puppeteer (html-record layer)
│   ├── subtitle-burn.js          ← Word timing + lyrics track builder
│   ├── avatar.js                 ← Robot character renderer + lip sync
│   ├── particles.js              ← Particle emitter (8 types: confetti/fire/snow/etc)
│   ├── transitions.js            ← 16 scene transition effects
│   ├── encoder.js                ← FFmpeg wrapper + audio mix
│   ├── audio-fetch.js            ← Background music + SFX synthesiser
│   ├── image-gen.js              ← AI image orchestrator (JS side)
│   ├── generate_images.py        ← Pollinations.AI HTTP client (Python)
│   ├── image-api.js              ← Stock image + URL image resolver
│   └── easing.js                 ← Easing math utilities
│
├── .github/workflows/
│   └── generate-video.yml
│
└── work/                         ← Auto-created at runtime — never commit
    ├── *.mp4
    ├── tts/
    ├── ai-images/
    └── html-frames/
```

---

## 3. GitHub Actions Workflow

The workflow triggers on:
- Push to `main` branch touching `config.js`, `engine-ci.js`, or `src/**`
- Manual dispatch via **Actions → Generate Video → Run workflow**

**Manual dispatch lets you specify a config file:**
Enter `config.darkpsych.js` (or any file in repo root) in the config input.

**Secrets needed** (set in repo Settings → Secrets → Actions):

| Secret | Required | Purpose |
|---|---|---|
| `POLLINATIONS_API_KEY` | Optional | Faster image generation (hardcoded fallback exists) |
| `UNSPLASH_ACCESS_KEY` | Optional | Stock photos |
| `PEXELS_API_KEY` | Optional | Stock photos |
| `PIXABAY_API_KEY` | Optional | Stock photos |
| `FREESOUND_API_KEY` | Optional | Sound effects |

**After the video renders**, the logs for the **Upload video** step show
the download URL from whichever of the 5 platforms succeeded first.
If all fail, the video is saved as a GitHub Actions artifact for 5 days.

---

## 4. Output Settings

```js
output: {
    title:      'my-video',       // used in output filename
    format:     'portrait',       // 'portrait' | 'landscape' | 'square'
    fps:        30,               // 24 | 30 | 60
    crf:        24,               // quality: 18=cinema 23=good 26=test
    preset:     'ultrafast',      // ultrafast|fast|medium (speed vs size)
    bgMusic:    { mood: 'epic' }, // mood: 'epic'|'dark'|'upbeat'|'calm'
                                  // OR: './assets/music/bg.mp3'
    bgMusicVol: 0.18,             // 0.0–1.0
    cleanup:    true,             // delete temp frames after encoding
    postProcess: {
        grain:              true,
        grainStrength:      0.020,  // 0.01=subtle, 0.05=heavy
        vignette:           true,
        vignetteStrength:   0.40,   // 0.3=light, 0.5=heavy
    },
}
```

**Output dimensions by format:**

| format | Width | Height | Platform |
|---|---|---|---|
| `portrait` | 1080 | 1920 | TikTok, Reels, Shorts |
| `landscape` | 1920 | 1080 | YouTube, Twitter |
| `square` | 1080 | 1080 | Instagram feed |

---

## 5. Scene Structure

A video is an ordered array of scenes. Scene duration is driven by TTS
audio length plus `pauseAfter`. For scenes with no TTS, set `duration`
manually.

```js
scenes: [
    {
        // TTS (optional — omit for silent scene)
        tts: {
            text:        'Spoken narration goes here.',
            voice:       'bm_george',   // override default voice
            pauseAfter:  0.5,           // seconds of silence after speech
            pauseBefore: 0.0,           // seconds of silence before speech
            emotion:     'neutral',     // emotion preset key
            speed:       1.0,           // speech speed multiplier
        },

        // Manual duration (used only when no TTS)
        duration: 5.0,

        // Auto-captions (v2.3)
        captions: true,   // or full options object — see Section 7

        // Transition OUT of this scene
        transition:         'fade',
        transitionDuration: 0.35,

        // Per-scene post-process override
        postProcess: { grain: true, grainStrength: 0.03 },

        // Layers (rendered in order — first = bottom, last = top)
        layers: [ ... ],
    },
]
```

**Duration rules:**
- Has TTS: `duration = speechDuration + pauseBefore + pauseAfter`
- No TTS: `duration = scene.duration ?? 3.0`
- `pauseAfter > 1.0`: engine generates a silence WAV and concatenates it
  to the speech audio so FFmpeg receives audio that covers the full scene.
  This is what allows very long pauses (e.g. `pauseAfter: 30`) without
  the video being cut to the speech length.

---

## 6. TTS — Voice System

The engine uses **Kokoro-82M** — a neural TTS model that runs locally on
the GitHub Actions runner via Python. It is cached between runs. If Kokoro
fails, it falls back to `espeak-ng` automatically.

```js
tts: {
    text:        'Your narration text.',
    voice:       'bm_george',
    pauseAfter:  0.4,
    pauseBefore: 0.0,
    speed:       1.0,
    emotion:     'neutral',
}
```

**Available voices:**

| Key | Gender | Style | Best for |
|---|---|---|---|
| `bm_george` | Male (British) | Deep, commanding | Documentary, dark content |
| `bm_lewis` | Male (British) | Crisp, professional | News, corporate |
| `bf_emma` | Female (British) | Refined, articulate | Formal, education |
| `bf_isabella` | Female (British) | Warm, storytelling | Narrative, history |
| `am_adam` | Male (American) | Authoritative, deep | Finance, motivation |
| `am_michael` | Male (American) | Friendly, mid-range | Casual, tutorial |
| `af_heart` | Female (American) | Warm, expressive | Lifestyle, emotion |
| `af_bella` | Female (American) | Bright, clear | Upbeat, energy |
| `af_sarah` | Female (American) | Natural, conversational | Storytelling |
| `af_nicole` | Female (American) | Soft, gentle | Calm, meditation |
| `af_sky` | Female (American) | Energetic, youthful | Entertainment |

**Emotion presets** (currently affect speed; extend in `tts-kokoro.js`):
`neutral` `happy` `excited` `sad` `angry` `whisper` `dramatic`
`energetic` `calm` `sarcastic`

**Speed:** `0.75` = slow and deliberate. `1.0` = normal. `1.3` = fast.

**Default voice** is set in the `defaults` block:
```js
defaults: {
    voice:              'bm_george',
    transition:         'fade',
    transitionDuration: 0.35,
}
```

---

## 7. Captions — Auto-Sync System

The caption system builds word-level timing from the TTS text and audio
duration, groups words into chunks of 2–4, and renders them frame-accurately
on every frame. No manual timing required.

```js
// Minimal — use all defaults
captions: true

// Full options
captions: {
    style:          'highlight',   // see styles below
    position:       'bottom',      // 'bottom' | 'middle' | 'top'
    fontSize:       62,            // px
    color:          '#ffffff',     // base text color
    highlightColor: '#ffdd00',     // active word color (highlight style)
    bgColor:        'rgba(0,0,0,0.55)',
    wordsPerChunk:  3,             // 2–4 recommended
    fontFamily:     'Arial Black, Impact, sans-serif',
    padding:        28,
    borderRadius:   16,
    strokeColor:    'rgba(0,0,0,0.9)',
    strokeWidth:    6,
    yOffset:        0,             // fine-tune vertical position in px
}
```

**Caption styles:**

| Style | Description | Best for |
|---|---|---|
| `highlight` | Active word turns highlight color + glow | Dark content, stories |
| `fade` | Whole chunk fades in together | Clean, minimal |
| `typewriter` | Characters reveal left-to-right with cursor | Tech, tutorials |
| `pop` | Chunk elastically pops in | High energy, entertainment |

**Important:** When using captions, remove any `rect` + `text` layer
combinations that were carrying the spoken narration. Let captions handle
all voice-synced text. Use `text` layers only for titles, labels, and
permanent on-screen elements.

Keep text layers above `y: 1640` to avoid overlapping the caption zone.

---

## 8. Transitions Between Scenes

Set `transition` on the scene that is **leaving**:

```js
{
    transition:         'glitch',
    transitionDuration: 0.4,
    layers: [ ... ],
}
```

**Available transitions (16 total):**

| Transition | Description |
|---|---|
| `fade` | Cross-dissolve — universal default |
| `wipe-left` | Incoming scene wipes from right to left |
| `wipe-right` | Incoming scene wipes from left to right |
| `wipe-up` | Incoming scene wipes from bottom to top |
| `wipe-down` | Incoming scene wipes from top to bottom |
| `zoom-in` | Outgoing shrinks, incoming zooms in |
| `zoom-out` | Outgoing zooms out, incoming appears |
| `zoom-cut` | Hard cut with zoom snap — no blend |
| `slide-left` | Scenes slide left with shadow between |
| `slide-right` | Scenes slide right with shadow between |
| `glitch` | RGB split + horizontal slice glitch |
| `dissolve` | Pixel-by-pixel random dissolve |
| `iris` | Circular iris wipe from center |
| `split-h` | Top/bottom halves split apart |
| `split-v` | Left/right halves split apart |
| `rotate` | Full rotation transition |

`transitionDuration` is in seconds. `0.2–0.4` feels natural. Never exceed `0.8`.

---

## 9. Post-Processing Effects

Applied after all layers render. Set globally in `output.postProcess` or
per-scene in `scene.postProcess` (overrides global for that scene).

```js
postProcess: {
    grain:              true,
    grainStrength:      0.020,   // subtle: 0.01, moderate: 0.025, heavy: 0.05
    vignette:           true,
    vignetteStrength:   0.40,    // light: 0.25, normal: 0.4, dark: 0.55
}
```

**grain** — Adds film grain per frame. Makes AI-generated images look
cinematic and less "digital."

**vignette** — Darkens corners and edges. Focuses viewer attention to
center. Essential for portrait format social video.

---

## 10. Layer System — How It Works

Layers are rendered in array order — first layer is drawn first (bottom),
last layer is drawn last (top). Every layer is drawn on every frame unless
`enterAt`/`exitAt` visibility gates are active.

The render call order per frame is:
```
1. Each layer in order (background → image → text → UI → etc.)
2. Caption track (drawn after all layers)
3. Post-process effects (grain, vignette)
```

The engine resets canvas composite state between layers to prevent
bleed-through from glow/shadow effects.

---

## 11. Universal Layer Properties

These properties work on every layer type:

```js
{
    type:    'text',       // required — identifies the layer type
    opacity: 1.0,          // 0.0–1.0, applied to entire layer

    // Visibility gates — layer fades in/out at these scene times
    enterAt:  0.5,         // seconds — layer becomes visible
    exitAt:   8.0,         // seconds — layer starts fading out
    enterDur: 0.3,         // fade-in duration (seconds)
    exitDur:  0.25,        // fade-out duration (seconds)

    // Hook layer (v2.3) — force visible from frame 0
    hookLayer: true,       // see Section 24
}
```

`enterAt`/`exitAt` are scene-relative times, not global video times.
A layer with `enterAt: 2.0` becomes visible 2 seconds into its scene.

---

## 12. Background Layers

### background

Solid color fill with optional noise and vignette.

```js
{
    type:             'background',
    color:            '#000000',
    noise:            true,
    noiseOpacity:     0.04,
    vignette:         true,
    vignetteStrength: 0.45,
}
```

### gradient

Linear or radial gradient fill.

```js
{
    type:         'gradient',
    gradientType: 'linear',             // 'linear' | 'radial'
    colors:       ['#000010', '#001830', '#000000'],
    angle:        160,                  // degrees (linear only)
    animated:     false,                // slow rotation if true
    vignette:     true,
    vignetteStrength: 0.4,
}
```

For radial gradients the `angle` property is ignored. Colors go from
center outward.

### overlay

Semi-transparent color fill over all layers below it. Use to darken
images for text readability. Place it above image layers.

```js
{
    type:         'overlay',
    color:        'rgba(0,0,0,0.35)',
    grain:        true,
    grainOpacity: 0.04,
}
```

### scanlines

Horizontal CRT scan-line effect. Adds retro aesthetic.

```js
{
    type:    'scanlines',
    spacing: 4,     // pixels between scan lines (higher = fewer lines)
}
```

### grid

Debug grid for layout. Shows magenta grid with center crosshairs.
Remove from production configs.

```js
{
    type: 'grid',
    cols: 6,
    rows: 12,
}
```

---

## 13. Image Layers

### image

Renders a static image with optional Ken Burns camera motion.

```js
{
    type:   'image',
    src:    './assets/images/photo.png',  // relative to repo root
    x:      0,
    y:      0,
    width:  1080,
    height: 1920,
    fit:    'cover',                      // 'cover' | 'contain' | 'fill'

    // Ken Burns motion (applied over scene duration)
    kenBurns:       'zoom-in',
    kenBurnsAmount: 0.08,                 // 0.05=subtle, 0.15=dramatic

    borderRadius:   0,                    // clip to rounded rect
}
```

**Supported formats:** PNG, JPG/JPEG, GIF (first frame only)

**fit modes:**
- `cover` — scales to fill, crops excess. Use for backgrounds.
- `contain` — scales to fit entirely, letterboxes if needed.
- `fill` — stretches to exact dimensions, may distort.

### image-sequence

Cuts between multiple images within one scene on a timer. Each image
gets independent Ken Burns motion starting from the beginning of its slot.

```js
{
    type:           'image-sequence',
    srcs:           ['./img1.png', './img2.png', './img3.png'],
    cutEvery:       4,             // seconds per image (default: sceneDur/srcs.length)
    kenBurns:       'zoom-in',
    kenBurnsAmount: 0.07,
    fit:            'cover',
    x:              0,
    y:              0,
    width:          1080,
    height:         1920,
}
```

### stock-image

Fetches a free royalty-free stock photo via a seed-based URL from
`picsum.photos`. The image is downloaded once and cached in
`work/stock-images/`. Supports all the same `fit` and `kenBurns`
options as a regular `image` layer.

Use this instead of `ai-image` when you have no Pollinations API access
or want faster, deterministic results.

```js
{
    type:           'stock-image',
    // Pick any descriptive seed — same seed always gives same image
    src:            'https://picsum.photos/seed/your_seed_here/1080/1920',
    x:              0,
    y:              0,
    width:          1080,
    height:         1920,
    fit:            'cover',
    kenBurns:       'zoom-in',
    kenBurnsAmount: 0.10,
}
```

> **Note:** `stock-image` layers are resolved during **Phase -1** (before
> TTS), downloaded to `work/stock-images/`, and converted to regular
> `image` layers pointing to the local file. The engine logs
> `[Stock] Resolved N image(s)` when this runs.

---

## 14. AI Image Generation

The engine calls Pollinations.AI for each `ai-image` layer. No local model.
Each image is an HTTPS GET returning a PNG in ~15–20 seconds.

```js
{
    type:       'ai-image',
    prompt:     '1girl, anime warrior, golden armor, epic lighting',
    animeStyle: '',                  // optional style prefix
    model:      'meinamix',         // see model table below
    steps:      8,                  // inference steps (8 = fast, 20 = quality)
    genWidth:   512,
    genHeight:  512,

    // Compositing (same as image layer)
    x:              0,
    y:              0,
    width:          1080,
    height:         1920,
    fit:            'cover',
    kenBurns:       'zoom-in',
    kenBurnsAmount: 0.08,
}
```

**Available models:**

| Key | Style | RAM needed | Notes |
|---|---|---|---|
| `meinamix` | Anime — best for action/characters | ~2 GB | Default |
| `anything-v5` | Clean anime characters | ~2 GB | Good for portraits |
| `toonyou` | Vivid stylised anime | ~2 GB | Bold colors |
| `flux-anime` | Flux + anime LoRA | API only | High quality |
| `flux` | General purpose | API only | Best for non-anime |
| `flux-realism` | Photorealistic | API only | People/places |
| `dreamshaper` | Cinematic/story | ~2 GB | SD1.5 |
| `realistic` | Photorealistic SD | ~2 GB | SD1.5 |

**Prompt format for anime models (Danbooru tag style):**
```
1girl, dark skin, warrior, golden armor, fierce expression,
dramatic lighting, anime style, cinematic composition
```
Quality tags (`masterpiece, best quality`) are added automatically.
Do not add them manually.

**Caching:** Generated images are cached in GitHub Actions. If prompts
do not change between runs, images are reused instantly. Change the prompt
or bump the cache key to regenerate.

---

## 15. Web Recording Layer

Records any website or HTML file as a video layer using Puppeteer
headless Chromium. Full documentation in `v2.4-WebInter.md`.

```js
{
    type:     'html-record',
    src:      'https://yoursite.com',     // URL or './path/to/file.html'
    duration: 10,                          // seconds to record
    fps:      30,
    viewport: { width: 1080, height: 1920 },
    x:        0, y: 0,
    width:    1080, height: 1920,
    fit:      'cover',
    waitFor:  '.main-content',             // CSS selector to wait for
    waitMs:   800,                         // extra ms after load

    cursor: {
        style: 'ring',                     // 'dot'|'circle'|'ring'|'crosshair'|'spotlight'
        color: '#00cfff',
        size:  36,
        glow:  true,
    },

    interactions: [
        { at: 1.5,  action: 'scroll',     y: 600, speed: 80, easing: 'ease-in-out' },
        { at: 3.0,  action: 'mouse-move', x: 540, y: 400, speed: 150 },
        { at: 4.0,  action: 'click',      selector: '#btn' },
        { at: 6.0,  action: 'type',       selector: '#input', text: 'hello', speed: 80 },
        { at: 8.0,  action: 'hover',      selector: '.menu-item' },
        { at: 9.0,  action: 'swipe',      x1: 540, y1: 1400, x2: 540, y2: 400, duration: 0.5 },
        { at: 10.0, action: 'wait',       duration: 1.0 },
        { at: 11.0, action: 'evaluate',   fn: 'document.querySelector(".chart").classList.add("go")' },
    ],
}
```

**Scroll speeds:** 40–60 = very slow, 80–120 = cinematic (default 120),
200–300 = normal, 500+ = fast.

**Easing:** `ease-in-out` (default) `ease-in` `ease-out` `linear`

Recorded frames are cached in `work/html-frames/`. Second run reuses
frames if config hasn't changed.

---

## 16. Text Layers

### text

Fully-featured text renderer with word wrap, animations, gradients,
glow, stroke, and shadow.

```js
{
    type:        'text',
    text:        'YOUR TEXT\nSECOND LINE',  // \n for line breaks
    x:           540,
    y:           600,
    fontSize:    72,
    fontFamily:  'Arial Black, Impact, sans-serif',
    fontWeight:  'bold',
    color:       '#ffffff',
    align:       'center',              // 'left' | 'center' | 'right'
    baseline:    'middle',             // 'top' | 'middle' | 'bottom'
    maxWidth:    960,                  // wrap at this width
    lineHeight:  1.2,                  // line spacing multiplier

    // Shadow
    shadow:      true,
    shadowColor: 'rgba(0,0,0,0.7)',
    shadowBlur:  18,
    shadowOffsetX: 0,
    shadowOffsetY: 4,

    // Glow
    glow:       true,
    glowColor:  '#ffdd00',
    glowBlur:   30,

    // Stroke (outline)
    stroke:      true,
    strokeColor: '#000000',
    strokeWidth: 4,

    // Gradient fill (overrides color)
    gradient:   ['#ff3b5c', '#ff8c00'],  // array of colors

    // Animation
    animation:  'pop',
    animDur:    0.35,
    startT:     0.2,          // delay before animation starts (scene-relative)
}
```

### kinetic-text *(currently non-functional — do not use)*

> **⚠️ WARNING:** `kinetic-text` is implemented in `layers.js` but does
> not function correctly in the current build. Word timing, layout, and
> rendering are broken. **Do not use it in configs.** Use `text` layers
> with `enterAt`/`exitAt` timing instead to achieve a similar effect.

Word-by-word animated text. Each word animates independently as it is
"spoken" (distributed evenly across scene duration or by manual timing).

```js
{
    type:           'kinetic-text',
    text:           'Every word hits different when it matters',
    x:              540,
    y:              700,
    fontSize:       72,
    fontFamily:     'Impact, Arial Black, sans-serif',
    color:          '#ffffff',
    highlightColor: '#ffdd00',        // active word color
    kineticStyle:   'pop',            // 'pop' | 'fly' | 'glow' | 'stamp'
    wordsPerRow:    3,                // words per horizontal row

    // Optional: manual word timing array [[startSec, endSec], ...]
    wordTiming:     [[0,0.5],[0.5,1.0],[1.0,1.6]],
    minWordDur:     0.28,             // minimum seconds per word
}
```

**Kinetic styles:**

| Style | Description |
|---|---|
| `pop` | Word scales from zero with elastic bounce, active word glows |
| `fly` | Word flies in from below, fades in |
| `glow` | Word glows brightly when active, dimmed otherwise |
| `stamp` | Word stamps down from large scale, bold impact feel |

---

## 17. Text Effect Layers

### glitch-text

RGB chromatic aberration split. Red and blue channels offset randomly.
Includes horizontal slice glitches.

```js
{
    type:             'glitch-text',
    text:             'CORRUPTED',
    x:                540,
    y:                700,
    fontSize:         120,
    fontFamily:       'Impact, Arial Black, sans-serif',
    color:            '#ffffff',
    align:            'center',
    maxWidth:         W * 0.9,

    glitchIntensity:  0.6,   // 0.1=subtle, 1.0=heavy
    glitchFrequency:  10,    // flicker rate (higher = more frequent)

    // Optional
    gradient:         ['#ff3b5c', '#00cfff'],
    glow:             true,
    glowColor:        '#ff3b5c',
    glowBlur:         30,
}
```

### neon-text

Multi-layer pulsing neon sign effect with optional random flicker.
White core with colored glow built from multiple shadow layers.

```js
{
    type:        'neon-text',
    text:        'OPEN',
    x:           540,
    y:           400,
    fontSize:    130,
    fontFamily:  'Impact, Arial Black, sans-serif',
    color:       '#ff3b5c',
    align:       'center',
    glowLayers:  5,          // number of glow layers (3–7)
    glowSpread:  14,         // px blur per layer
    flicker:     true,       // random dimming/flicker effect
}
```

### split-reveal

Text halves slide apart dramatically then come together to reveal the full
word. Cinematic reveal effect.

```js
{
    type:      'split-reveal',
    text:      'REVEALED',
    x:         540,
    y:         700,
    fontSize:  120,
    fontFamily:'Impact, Arial Black, sans-serif',
    color:     '#ffffff',
    align:     'center',
    splitGap:  8,            // gap between halves at peak
    animDur:   0.55,

    gradient:  ['#ff3b5c', '#ff8c00'],
    shadow:    true,
    glow:      true,
    glowColor: '#ff3b5c',
    glowBlur:  25,
}
```

### word-cloud

Multiple words at varying sizes, positioned in a spiral, staggered fade-in.

```js
{
    type:         'word-cloud',
    words: [
        { text: 'Africa',    size: 1.0,  color: '#e8c84a', x: 540, y: 800 },
        { text: 'Gold',      size: 0.7,  color: '#ff8c00' },
        { text: 'Power',     size: 0.85, color: '#00cfff' },
        { text: 'History',   size: 0.5,  color: '#a855f7' },
    ],
    cx:           540,        // center of spiral layout
    cy:           960,
    baseFontSize: 60,         // size:1.0 = this size in px
    spread:       90,         // spiral spread distance
    fontFamily:   'Arial Black, sans-serif',
    animDur:      2.0,
}
```

If `x`/`y` are provided on a word, it uses those exact coordinates.
Otherwise auto-positioned in a golden-angle spiral around `cx`/`cy`.

### typewriter-reveal

Types lines onto screen character by character. Forces viewers to wait
for the sentence to complete — great for rules, lists of facts, or
dramatic reveals.

```js
{
    type:              'typewriter-reveal',
    lines:             ['Rule 1:', 'Never chase.', 'Build.'],
    y:                 680,               // Y of first line
    lineDelay:         0.5,               // seconds between lines starting
    charSpeed:         0.042,             // seconds per character
    fontSize:          72,
    fontFamily:        'Arial Black, Impact, sans-serif',
    color:             '#ffffff',
    highlightLastLine: '#e8c84a',         // last line uses this color
    showCursor:        true,
    cursorChar:        '|',
    cursorColor:       '#e8c84a',
    // bgColor is not used — this layer overlays on existing background
}
```

- Long lines auto-shrink in font size to fit within `W * 0.88`
- Cursor blinks at ~3 Hz while a line is still typing
- Cursor disappears once a line finishes
- `highlightLastLine` lets you colour the punchline differently

---

## 18. Shape Layers

Renders geometric shapes with optional animations.

```js
{
    type:        'shape',
    shape:       'rect',             // see shapes below
    x:           540,
    y:           400,
    width:       400,
    height:      120,
    color:       'rgba(0,0,0,0.7)',

    borderRadius: 16,               // rect only
    rotation:     0,                // initial rotation in radians
    spikes:       5,                // star only

    // Stroke
    stroke:      true,
    strokeColor: '#ffffff',
    strokeWidth: 3,

    // Shadow / glow
    shadow:      true,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowBlur:  20,
    glow:        true,
    glowColor:   '#ffdd00',
    glowBlur:    40,

    // Animation
    animation:  'spin',             // 'spin' | 'pulse' | 'breathe'
    speed:      1,                  // animation speed multiplier
}
```

**Available shapes:**

| Shape key | Description |
|---|---|
| `rect` / `rectangle` | Rectangle with optional borderRadius |
| `circle` | Circle using width as diameter |
| `triangle` | Equilateral triangle |
| `star` | N-pointed star (set `spikes` for point count) |
| `diamond` | Diamond (rotated square) |
| `line` | Horizontal line (`thickness` sets line width) |
| `arrow` | Arrow pointing right (`thickness` sets arrow width) |

**Shape animations:**

| Animation | Description |
|---|---|
| `spin` | Continuous rotation |
| `pulse` | Scales up/down rhythmically |
| `breathe` | Slow scale oscillation |

---

## 19. Data Visualisation Layers

### chart

Four chart types with animated builds.

```js
{
    type:      'chart',
    chartType: 'bar',               // 'bar' | 'line' | 'pie' | 'donut' | 'horizontal-bar'
    data: [
        { label: 'A', value: 400, color: '#e8c84a' },
        { label: 'B', value: 250, color: '#00cfff' },
        { label: 'C', value: 180, color: '#ff3b5c' },
    ],
    x:       60,
    y:        400,
    width:    960,
    height:   600,
    animDur:  1.5,

    // line chart only
    lineColor: '#00cfff',
    lineWidth: 4,

    // pie/donut only
    cx:      540,
    cy:      700,
    explode: false,    // offset slices slightly for emphasis

    // colors array (used when individual item.color not set)
    colors: ['#ff3b5c','#4ecdc4','#ffe66d','#a8e6cf','#ff8b94','#c77dff'],
}
```

**Chart type behaviours:**
- `bar` — vertical bars with gradient fill, grid lines, value labels above bars
- `line` — smooth line with area fill, dot markers, label annotations
- `pie` / `donut` — animated sweep with label callouts at 90% completion
- `horizontal-bar` — ranked bars with rank numbers, label left, value right

### stat-counter

Large animated number that counts up from 0 (or `startValue`) to `value`.

```js
{
    type:           'stat-counter',
    value:          400,
    startValue:     0,
    prefix:         '$',
    suffix:         'B',
    label:          'NET WORTH',
    sublabel:       'Adjusted for inflation',
    format:         'integer',        // 'integer' or omit for decimal
    decimals:       1,

    x:              540,
    y:              700,
    fontSize:       140,
    labelFontSize:  42,
    fontFamily:     'Impact, Arial Black, sans-serif',
    color:          '#e8c84a',
    labelColor:     'rgba(255,255,255,0.65)',
    gradient:       ['#e8c84a', '#ff8c00'],
    glow:           true,
    glowColor:      '#e8c84a',
    glowBlur:       35,
    animDur:        2.0,
}
```

### comparison

Labeled horizontal bars for comparing values side by side.

```js
{
    type:  'comparison',
    items: [
        { label: 'Mansa Musa',  value: 400, color: '#e8c84a', unit: 'B' },
        { label: 'Elon Musk',   value: 200, color: '#00cfff', unit: 'B' },
        { label: 'Jeff Bezos',  value: 150, color: '#a855f7', unit: 'B' },
    ],
    x:          60,
    y:          400,
    width:      960,
    barHeight:  70,
    gap:        1.6,            // row gap multiplier
    labelWidth: 0.30,           // fraction of width for labels
    fontSize:   34,
    showRank:   true,           // show #1 #2 #3 inside bars
    title:      'Net Worth',
    animDur:    1.5,
    unit:       'B',
}
```

### meter

Circular arc gauge. Counts from 0 to value.

```js
{
    type:        'meter',
    value:       85,             // 0–100
    cx:          540,
    cy:          700,
    radius:      220,
    thickness:   22,
    color:       '#00cfff',
    color2:      '#0066ff',      // arc end color (gradient)
    trackColor:  'rgba(255,255,255,0.1)',
    gradient:    ['#00cfff', '#0066ff'],
    label:       'ACCURACY',
    labelFontSize: 42,
    labelColor:  'rgba(255,255,255,0.55)',
    showValue:   true,
    valueFontSize: 100,
    unit:        '%',
    startAngle:  -210,           // degrees from top
    sweepAngle:  240,            // total sweep in degrees
    glowBlur:    20,
    animDur:     1.5,
}
```

### progress-bar

Horizontal progress bar. Fills based on scene time by default.

```js
{
    type:       'progress-bar',
    x:          54,
    y:          1855,
    width:      972,
    height:     7,
    color:      '#ff3b5c',
    color2:     '#ff8c00',
    trackColor: 'rgba(255,255,255,0.08)',
    progress:   0.75,           // fixed value 0–1 (omit to auto-fill with time)
    showLabel:  false,          // show percentage text
}
```

### progress-ring

Single large circular ring fill. Simpler than `meter` — no arc angle config.

```js
{
    type:        'progress-ring',
    value:       73,             // 0–100
    cx:          540,
    cy:          700,
    radius:      240,
    thickness:   28,
    color:       '#ff3b5c',
    color2:      '#ff8c00',
    trackColor:  'rgba(255,255,255,0.07)',
    showPercent: true,
    percentFontSize: 115,
    unit:        '%',
    label:       'Complete',
    labelFontSize: 40,
    labelColor:  'rgba(255,255,255,0.45)',
    animDur:     1.6,
}
```

### radial-bars

Multiple concentric rings — Apple Watch activity ring style.

```js
{
    type:          'radial-bars',
    rings: [
        { value: 85, color: '#ff3b5c', label: 'Steps' },
        { value: 62, color: '#57cc99', label: 'Calories' },
        { value: 91, color: '#00cfff', label: 'Sleep' },
    ],
    cx:            540,
    cy:            700,
    baseRadius:    100,          // radius of innermost ring
    ringThickness: 22,
    ringGap:       30,           // gap between rings
    labelFontSize: 26,
    animDur:       1.8,
}
```

### number-roll

Slot-machine style digit rolling animation. Each digit rolls from 0 to its
target value. Non-digit characters (commas, $) fade in.

```js
{
    type:      'number-roll',
    value:     '400,000,000,000',  // string or number
    x:         540,
    y:         700,
    fontSize:  100,
    fontFamily:'Impact, Arial Black, sans-serif',
    color:     '#e8c84a',
    prefix:    '$',
    suffix:    ' USD',
    gradient:  ['#e8c84a', '#ff8c00'],
    glowColor: '#e8c84a',
    glowBlur:  25,
    animDur:   1.6,
}
```

### leaderboard

Ranked list with animated score bars and medal emoji.

```js
{
    type:  'leaderboard',
    items: [
        { name: 'Mansa Musa',   score: 400, color: '#e8c84a', unit: 'B' },
        { name: 'John D. Rockefeller', score: 340, color: '#aaa' },
        { name: 'Elon Musk',    score: 200, color: '#00cfff' },
    ],
    x:           60,
    y:           300,
    width:       960,
    rowHeight:   90,
    medalEmoji:  true,           // show 🥇🥈🥉 for top 3
    fontFamily:  'Arial Black, sans-serif',
    animDur:     1.8,
}
```

### score-card

VS matchup card. Two sides slide in from opposite edges.

```js
{
    type:     'score-card',
    left:  { label: 'Before', value: '12%',  color: '#ff3b5c' },
    right: { label: 'After',  value: '94%',  color: '#57cc99' },
    vsText:   'VS',
    x:        540,
    y:        800,
    width:    940,
    height:   260,
    fontFamily: 'Impact, Arial Black, sans-serif',
    animDur:  0.7,
}
```

### bubble-chart

Value-sized circles arranged in a ring, floating gently.

```js
{
    type: 'bubble-chart',
    data: [
        { label: 'Africa',  value: 54,  color: '#e8c84a' },
        { label: 'Asia',    value: 49,  color: '#00cfff' },
        { label: 'Europe',  value: 44,  color: '#a855f7' },
    ],
    cx:        540,
    cy:        960,
    maxRadius: 160,
    spread:    260,         // distance from center
    floatAmount: 12,        // vertical float oscillation px
    animDur:   1.8,
}
```

### heatmap

Grid of cells colored by value intensity. Cells animate in staggered.

```js
{
    type: 'heatmap',
    data: [
        [1, 3, 5, 8, 2],
        [4, 9, 6, 1, 7],
        [2, 5, 8, 4, 3],
    ],
    x:           60,
    y:           300,
    cellSize:    80,
    gap:         6,
    colors:      ['#001830', '#0066ff', '#00cfff', '#ffffff'],
    rowLabels:   ['Mon', 'Tue', 'Wed'],
    colLabels:   ['9am', '12pm', '3pm', '6pm', '9pm'],
    showValues:  true,
    borderRadius:8,
    labelFontSize: 24,
    animDur:     1.8,
}
```

### icon-counter

Fills a grid of icons (emoji or symbols) one by one. "X out of Y" style.

```js
{
    type:         'icon-counter',
    total:        100,
    filled:       73,
    icon:         '●',         // filled icon
    emptyIcon:    '○',         // unfilled icon
    filledColor:  '#ff3b5c',
    emptyColor:   'rgba(255,255,255,0.15)',
    cols:         10,          // icons per row
    x:            60,
    y:            400,
    iconSize:     68,
    gap:          8,
    showLabel:    true,        // show "73 / 100" summary below
    label:        'Countries affected',
    labelFontSize:46,
    animDur:      2.0,
}
```

### flow-chart

Node boxes with animated connecting arrows.

```js
{
    type:  'flow-chart',
    nodes: [
        { id: 'a', label: 'Config',  x: 540, y: 300, color: '#0066ff' },
        { id: 'b', label: 'TTS',     x: 300, y: 600, color: '#57cc99' },
        { id: 'c', label: 'Render',  x: 780, y: 600, color: '#ff3b5c' },
        { id: 'd', label: 'Export',  x: 540, y: 900, color: '#e8c84a' },
    ],
    edges: [['a','b'], ['a','c'], ['b','d'], ['c','d']],
    boxWidth:  200,
    boxHeight: 70,
    boxRadius: 14,
    fontSize:  34,
    animDur:   2.0,
}
```

### countdown-reveal

A dramatic 3-2-1 countdown followed by an animated reveal of text. Each
digit pulses with a ring arc that fills as the count progresses. At zero a
white flash fires and the reveal text stamps in with elastic scale.

```js
{
    type:        'countdown-reveal',
    from:        3,                    // count down from this number
    label:       'THE ANSWER IS',      // small text above the reveal
    labelSize:   48,
    revealText:  '$1.3 TRILLION',      // the big reveal
    revealSize:  160,
    revealColor: '#00ff88',
    countColor:  '#ffffff',
    countSize:   220,
    flashColor:  'rgba(255,255,255,0.65)',
    animDur:     3.8,                  // total time including reveal
}
```

- One `countdown-reveal` per scene — it fills the full frame
- `animDur` should roughly equal `from + 0.8` seconds
- Best used as the only non-background layer in its scene

---

## 20. UI / Presentation Layers

### split-screen

The #1 most-shared format in short-form content. Splits the frame
vertically into two sides, each with its own image, tint, label, body
text, and emoji. Both sides slide in from their respective edges.

```js
{
    type:         'split-screen',
    split:        0.5,                  // 0–1 where divider sits (default: centre)
    dividerColor: '#ffffff',
    dividerWidth: 4,
    dividerGlow:  true,
    dividerIcon:  '⚡',                 // emoji shown in circle at divider centre
    animDur:      0.5,                  // slide-in duration

    left: {
        image:      'https://picsum.photos/seed/abc/1080/1920', // URL or omit for solid colour
        color:      '#0a0010',          // bg if no image
        tint:       'rgba(80,0,120,0.55)',
        label:      'WRONG',
        labelColor: '#ff3b5c',
        labelSize:  74,
        labelY:     310,                // Y position of label
        bodyText:   'Texts every\nhour.\nNo response.',
        bodyColor:  '#ffffff',
        bodySize:   40,
        bodyY:      490,
        emoji:      '😩',
        emojiSize:  105,
        emojiY:     800,
    },

    right: {
        image:      'https://picsum.photos/seed/xyz/1080/1920',
        color:      '#000a10',
        tint:       'rgba(0,60,100,0.55)',
        label:      'RIGHT',
        labelColor: '#00ff88',
        labelSize:  74,
        labelY:     310,
        bodyText:   'Sends once.\nLives his life.\nLets her wonder.',
        bodyColor:  '#ffffff',
        bodySize:   40,
        bodyY:      490,
        emoji:      '😌',
        emojiSize:  105,
        emojiY:     800,
    },
}
```

- Body text supports `\n` for manual line breaks
- Long body lines auto-shrink to fit within their column
- The emoji bounces continuously with a subtle sine animation
- No `progress-bar` or other layers needed — add them separately in the
  same scene `layers` array

### phone-mockup

A full-resolution realistic iPhone-style phone bezel with Dynamic Island,
side buttons, status bar, optional app header, and a home indicator. The
screen area can contain an image, a fake-chat conversation, or a solid
colour.

```js
{
    type:         'phone-mockup',
    x:            90,              // left edge of phone
    y:            180,             // top edge of phone
    phoneW:       900,             // outer width
    phoneH:       1560,            // outer height
    color:        '#1c1c1e',       // phone body colour
    screenBg:     '#000000',
    notchStyle:   'island',        // 'island' | 'notch' | 'none'
    showButtons:  true,
    animDur:      0.5,

    // Status bar
    carrier:      'Vodacom',
    time:         '9:41',
    batteryPct:   85,

    // Optional app header bar (iMessage style)
    appHeader: {
        name:   'Sarah ❤️',
        online: true,
    },

    // Optional: fill screen with an image
    src: 'https://picsum.photos/seed/screen/800/1400',

    // Optional: render a fake-chat conversation inside the phone
    // (same format as standalone fake-chat layer)
    chat: {
        messages: [
            { from: 'left',  text: 'Hey... you ok?',  delay: 0.0 },
            { from: 'right', text: 'Yeah. Just busy.', delay: 1.2, typing: 0.8 },
            { from: 'left',  text: 'Oh. ok 😐',        delay: 2.8 },
        ],
        leftColor:  '#e5e5ea',
        rightColor: '#0b84fe',
        fontSize:   28,
    },
}
```

- Phone slides up from below on entry (`animDur`)
- `phoneW` is clamped to `W - 40` automatically
- Font size inside `chat` auto-scales to `phoneW * 0.038` if not set
- Dynamic Island is a rounded pill; `notch` is a flat rectangle; `none`
  shows a clean full screen

### fake-chat

Animated iMessage-style chat bubbles that type in one by one. Messages
appear with typing-indicator dots before the text is revealed. Works
standalone or nested inside `phone-mockup.chat`.

```js
{
    type:       'fake-chat',
    x:          60,
    y:          300,
    width:      960,
    fontSize:   36,

    leftColor:  '#e5e5ea',    // left bubble background
    rightColor: '#0b84fe',    // right bubble background
    leftText:   '#000000',
    rightText:  '#ffffff',

    messages: [
        { from: 'left',  text: 'Hey... you ok?',         delay: 0.0 },
        { from: 'right', text: 'Yeah. Just busy.',        delay: 1.2, typing: 0.8 },
        { from: 'left',  text: 'Oh. ok 😐',               delay: 2.8 },
        { from: 'right', text: '',                         delay: 4.0, status: 'Read 9:41 AM' },
    ],
}
```

**Message properties:**

| Property | Type | Description |
|---|---|---|
| `from` | `'left'` \| `'right'` | Which side the bubble appears on |
| `text` | string | Message text. Empty string = no bubble (use with `status`) |
| `delay` | number | Seconds from scene start when this message appears |
| `typing` | number | Seconds of typing indicator before text reveals (default 0.6) |
| `status` | string | Small text below message (e.g. `'Read 9:41 AM'`) |

- Bubbles auto-word-wrap at `width * 0.72`
- Tail indicator on each bubble points to the correct side
- Status text fades in once `showP > 0.8`

### poll-card

A TikTok-style poll card with animated fill bars that reveal results after
a set delay. Drives comment engagement ("vote in the comments").

```js
{
    type:        'poll-card',
    question:    'Would you leave him?',
    optionA:     'YES 💔',
    optionB:     'NO 😤',
    colorA:      '#ff3b5c',
    colorB:      '#00cfff',
    percentA:    68,          // visual fill % for option A (0-100)
    animReveal:  2.0,         // seconds before results animate in
    animDur:     1.2,         // duration of fill animation
    y:           960,         // vertical centre of card
    width:       920,
    height:      380,
    questionSize: 42,
    optionSize:   36,
    borderRadius: 28,
}
```

- Results (fill bars + percentages) are hidden until `animReveal` seconds
- The card slides up on entry
- `percentB` is calculated automatically as `100 - percentA`
- A "Vote in the comments 👇" nudge appears below the options

### mockup (simple)

A simple phone or browser outline frame. No status bar, no chat, no buttons.
Use `phone-mockup` for the full realistic iPhone render.

```js
// Phone
{
    type:        'mockup',
    mockupType:  'phone',
    x:           540,
    y:           960,
    width:       340,
    height:      620,
    frameColor:  '#1a1a2e',
    screenBg:    '#0f0f0f',
    screenContent: true,    // fill screen area with screenBg
    animDur:     0.5,
}

// Browser
{
    type:        'mockup',
    mockupType:  'browser',
    url:         'apex-engine.dev',   // shown in address bar
    screenBg:    '#ffffff',
    width:       800,
    height:      500,
}
```

Combine with `html-record` to show a live recording inside the phone frame.

### notification-card

Phone notification that slides in from above.

```js
{
    type:      'notification-card',
    app:       'YouTube',
    title:     'New video just dropped',
    body:      '3.2M views in 24 hours',
    icon:      '▶',
    time:      'now',
    x:         540,
    y:         400,
    width:     860,
    height:    160,
    appColor:  '#ff0000',
    cardColor: 'rgba(28,28,32,0.96)',
    animDur:   0.5,
}
```

### ticker

Horizontally scrolling news ticker.

```js
{
    type:       'ticker',
    text:       'Breaking news text • More headlines here • Keep going',
    y:          1750,
    height:     72,
    bgColor:    'rgba(0,0,0,0.85)',
    textColor:  '#ffffff',
    label:      'BREAKING',        // badge on left
    labelBg:    '#e63946',
    speed:      180,               // px/second scroll speed
    fontSize:   34,
    borderColor:'rgba(255,255,255,0.15)',
}
```

### countdown

Number countdown from N to 1. Each digit pulses on tick.

```js
{
    type:     'countdown',
    from:     5,
    x:        540,
    y:        960,
    fontSize: 180,
    color:    '#ffffff',
}
```

### divider

Animated horizontal line that expands from center.

```js
{
    type:      'divider',
    y:         900,
    x1:        160,
    x2:        920,
    color:     'rgba(255,255,255,0.6)',
    thickness: 2,
    animDur:   0.4,
}
```

### list-reveal

Bullet list that reveals items one by one with staggered animation.

```js
{
    type:        'list-reveal',
    items: ['First point', 'Second point', 'Third point'],
    x:           80,
    y:           500,
    fontSize:    48,
    fontFamily:  'Arial Black, sans-serif',
    color:       '#ffffff',
    bullet:      '▸',
    bulletColor: '#e8c84a',
    maxWidth:    W * 0.78,
    lineHeight:  1.7,
    itemDur:     0.9,       // duration each item takes to appear
    stagger:     0.7,       // overlap multiplier (lower = more overlap)
    animStyle:   'slide-up', // 'slide-up'|'slide-left'|'fade'|'pop'
}
```

### quote-card

Styled pull quote with decorative quotation marks and optional accent lines.

```js
{
    type:         'quote-card',
    text:         'Generosity that broke economies.',
    attribution:  '— Historical Record, 1324',
    x:            540,
    y:            800,
    width:        900,
    fontSize:     54,
    fontFamily:   'Georgia, serif',
    color:        '#ffffff',
    accentColor:  '#e8c84a',
    cardColor:    'rgba(0,0,0,0.42)',
    showCard:     true,
    showLines:    true,
    animDur:      0.6,
}
```

### timeline

Vertical event timeline. Line draws down, dots pop in, cards slide right.

```js
{
    type:  'timeline',
    items: [
        { label: '1324', text: 'Begins the pilgrimage', color: '#e8c84a' },
        { label: '1325', text: 'Arrives in Cairo',       color: '#ff8c00' },
        { label: '1326', text: 'Reaches Mecca',          color: '#a855f7' },
    ],
    x:            120,
    y:            300,
    itemSpacing:  200,
    dotSize:      22,
    cardWidth:    680,
    lineWidth:    3,
    lineColor:    'rgba(255,255,255,0.15)',
    fontSize:     38,
    animDur:      2.5,
}
```

### map-callout

Geographic pin drops with callout cards. Simple equirectangular map
with latitude/longitude coordinates.

```js
{
    type:  'map-callout',
    points: [
        { label: 'Mali',  value: '$400B', lat: 12,  lng: -8,  color: '#e8c84a' },
        { label: 'Egypt', value: 'Crashed', lat: 26, lng: 30, color: '#ff3b5c' },
    ],
    cx:        540,
    cy:        800,
    mapRadius: 280,
    cardWidth: 220,
    animDur:   2.0,
}
```

---

## 21. Audio Reactive Layers

### waveform

Audio visualiser that reacts to the actual TTS audio amplitude in real time
on every frame.

```js
{
    type:     'waveform',
    vizStyle: 'bars',   // see styles below
    x:        0,
    y:        1700,
    width:    1080,
    height:   120,
    bars:     48,       // number of bars/dots/segments
    color:    '#ffffff',
    lineWidth:3,        // wave style only

    // circle style
    cx:       540,
    cy:       960,
    radius:   120,
}
```

**Visualiser styles:**

| Style | Description |
|---|---|
| `bars` | Vertical bars with gradient fill, rounded tops |
| `wave` | Smooth sine-wave line |
| `circle` | Radial bars emanating from a circle |
| `mirror` | Bars mirrored above and below center line |
| `dots` | Oscillating dot field |
| `spectrum` | Color-shifting hue-rotating bars |

The waveform reads the actual extracted amplitude envelope from the TTS
WAV file — it shows real audio activity, not fake animation.

### audio-reactive-border

A pulsing gradient border that breathes and glows in sync with the TTS
audio amplitude. The border thickness and glow intensity both scale with
`amp` (0–1). Perfect as a living frame on music or high-energy content.

```js
{
    type:         'audio-reactive-border',
    color:        '#e8c84a',              // gradient start colour
    color2:       '#ff3b5c',              // gradient end colour
    thickness:    12,                     // base px — scales up with amp
    glowBlur:     40,                     // base glow — scales up with amp
    minAlpha:     0.15,                   // alpha when amp = 0
    maxAlpha:     0.90,                   // alpha when amp = 1
    cornerRadius: 0,                      // set > 0 for rounded frame
}
```

- Gradient runs diagonally across the full frame border
- `thickness` and `glowBlur` both scale: `base * (0.7 + 0.3 * amp)`
- `alpha` interpolates: `minAlpha + (maxAlpha - minAlpha) * amp`
- Add one per scene alongside other layers — it draws on top of everything

---

## 22. Lyrics / Subtitle Layers

### lyrics-line

Word-by-word highlighted subtitle rendering — the "karaoke highlight" style
seen in music content. Each word lights up in `activeColor` as it is spoken,
with the previous word fading to `doneColor` and upcoming words showing in
`pendingColor`.

Requires the engine's lyric alignment system to be active. Set
`scene.lyrics: true` or `scene.lyricsText: 'your text'` in the scene root,
or use a custom audio source with `scene.audioSrc`.

```js
// In scene root:
{
    tts: { text: 'Every word you say will glow' },
    lyrics: true,            // enables word timing for this scene
    lyricsWordsPerLine: 5,   // words grouped per display line

    layers: [
        // ... background layers ...
        {
            type:         'lyrics-line',
            position:     'bottom',         // 'top' | 'middle' | 'bottom'
            yOffset:      -60,
            fontSize:     72,
            fontFamily:   'Impact, Arial Black, sans-serif',
            activeColor:  '#e8c84a',        // currently spoken word
            pendingColor: '#ffffff',        // upcoming words
            doneColor:    'rgba(255,255,255,0.38)', // already spoken
            strokeColor:  'rgba(0,0,0,0.90)',
            strokeWidth:  6,
            glowColor:    '#e8c84a',
            glowBlur:     30,
            lineRevealDur: 0.20,            // slide-up duration per line
        },
    ],
}
```

- Word timings are estimated from syllable counts — not WhisperX (no model)
- The system aligns purely from the TTS audio duration and text
- Showing up to 3 lines at once: previous (fading), current, next (dim)
- Audio-reactive: the active word scales slightly with `amp`

---

## 23. Avatar System

A procedurally drawn robot character that lip-syncs to audio amplitude.


```js
{
    type:       'avatar',
    x:          540,
    y:          1100,
    size:       240,                // diameter of avatar
    expression: 'excited',         // see expressions below
    motion:     'slide-in-left',   // see motions below
    enterDur:   0.55,              // entrance animation duration
    floatRange: 40,                // float motion amplitude (float style)
    shakeAmount:14,                // shake motion amplitude
    startX:     -60,               // walk-across start X (walk-across style)
    endX:       1140,              // walk-across end X

    // Cosmetic
    accentColor:'#00cfff',
    name:       'BOT',             // label above avatar
    nameColor:  '#00cfff',
}
```

**Expressions:**

`neutral` `happy` `excited` `sad` `angry` `surprised` `wink`

**Motion types:**

| Motion | Description |
|---|---|
| `slide-in-left` | Enters from left side |
| `slide-in-right` | Enters from right side |
| `slide-in-bottom` | Rises from bottom |
| `enter-center` | Drops slightly from above |
| `bounce` | Bounces from above |
| `float` | Oscillates side to side continuously |
| `walk-across` | Walks from `startX` to `endX` over scene duration |
| `shake` | Shakes horizontally (good with angry expression) |
| `exit-left` | Slides out to the left at 60% of scene duration |
| `exit-right` | Slides out to the right at 60% of scene duration |

**Custom position animation** using `fromX`/`fromY`:
```js
{ motion: undefined, fromX: -200, x: 540, fromY: 1000, y: 800, enterDur: 0.7 }
```

The avatar is always drawn above all other layers (drawn last regardless
of array position). Only one avatar per scene.

---

## 24. Particle System

Eight particle emitter types. Particles are drawn above all image layers
but below UI layers.

```js
{
    type:        'particles',
    particleType:'confetti',    // see types below
    x:           540,
    y:           0,
    count:       120,
    color:       '#e8c84a',
    colors:      ['#ff0', '#f0f', '#0ff'],  // multi-color (overrides color)
    size:        3,
    speed:       60,
    spread:      1080,
    opacity:     0.6,
    gravityY:    30,
    fadeOut:     true,
}
```

**Particle types:**

| Type | Description |
|---|---|
| `confetti` | Falling colored rectangles, random rotation |
| `fire` | Rising orange/red particles, fades up |
| `snow` | Falling white dots, gentle drift |
| `sparks` | Shooting bright lines from source point |
| `bubbles` | Rising circles with highlight |
| `matrix` | Falling green characters (Matrix style) |
| `dust` | Slow floating large translucent circles |
| `stars` | Twinkling star points |

---

## 25. Hook Layer System

Any layer with `hookLayer: true` is forced visible from frame 0 regardless
of other timing properties.

```js
{
    type:      'neon-text',
    text:      '🧠 DARK PSYCHOLOGY',
    x:         540,
    y:         140,
    fontSize:  44,
    color:     '#cc0000',
    hookLayer: true,      // ← forced from frame 0
    exitAt:    999,       // keep it on screen (default would be 3.0)
}
```

**What `hookLayer: true` automatically sets:**
- `enterAt: 0` — visible from the very first frame
- `startT: 0` — animation starts immediately
- `animDur: 0.2` — very fast animation
- `exitAt: 3.0` — exits at 3 seconds unless you override it

**Why it matters:** The algorithm on TikTok/Shorts/Reels checks swipe-away
rate at the 1-hour mark. If more than ~40% of viewers swipe away in the
first 3 seconds, distribution stops. The hook layer guarantees your most
important visual is visible before anyone can swipe.

Use `hookLayer: true` on **one layer per scene** only — the single most
important text or label.

---

## 26. SFX — Sound Effects System

The engine has a built-in SFX synthesiser that generates sound effects
using `ffmpeg` — no external audio files needed.

**Scene-level SFX** — plays once at `sfxAt` seconds into the scene:

```js
{
    tts: { text: '...' },
    sfx:   'whoosh',    // effect name
    sfxAt: 0.0,         // seconds from scene start (default 0)
    sfxVol: 0.6,        // volume 0–1 (default 0.6)
    layers: [ ... ],
}
```

**Layer-level SFX** — plays when that layer becomes visible:

```js
{
    type:   'text',
    text:   'BANG',
    sfx:    'impact',
    sfxVol: 0.7,
    // ... other layer props
}
```

**Available SFX:**

| Name | Description |
|---|---|
| `whoosh` | Rising air whoosh — good for text fly-ins |
| `swoosh` | Sharp swipe sound — transitions |
| `rise` | Slow tension build-up |
| `impact` | Deep thud — stat reveals, punches |
| `whomp` | Low bass drop |
| `pop` | Light pop — notification, icon |
| `chime` | Bright notification bell |
| `dramatic` | Low sine tone — cinematic tension |
| `tension` | Rising frequency — suspense build |
| `electric` | Crackling electric burst |
| `glitch` | Digital glitch noise |
| `tick` | Metronome click |

SFX events are collected from all scenes, synthesized in Phase 1.5, then
mixed into the final audio alongside background music. Volume is controlled
separately per effect via `sfxVol`.

---

## 27. Background Music

Background music is resolved in Phase 0.5. The engine supports two modes:

### Mood-based (no API key)

Uses royalty-free tracks from Incompetech and Internet Archive. Just set
a mood string:

```js
output: {
    bgMusic:    { mood: 'epic' },
    bgMusicVol: 0.10,
}
```

**Available moods:**

| Mood | Character |
|---|---|
| `epic` | Dramatic orchestral — motivational, documentaries |
| `calm` | Soft piano — meditation, advice, calm content |
| `upbeat` | Energetic — entertainment, lifestyle |
| `dark` | Brooding, tense — thriller, exposé |
| `documentary` | Measured, neutral — educational |

Each mood has a primary URL and a fallback URL. If both fail the engine
continues without music and logs a warning.

### Freesound search (requires API key)

Set the environment variable `FREESOUND_API_KEY` in your GitHub Actions
secrets, then use a search query:

```js
output: {
    bgMusic: { search: 'lofi hip hop chill', mood: 'calm' },
    bgMusicVol: 0.08,
}
```

`mood` acts as the fallback if the Freesound search fails or no key is set.

### Volume levels

`bgMusicVol` is a multiplier on the downloaded track. Recommended values:

| Content type | Suggested `bgMusicVol` |
|---|---|
| Motivational / dramatic TTS | `0.07–0.10` |
| Finance / education | `0.10–0.15` |
| Music / lyric content | `0.05` |
| Silent (no music) | omit `bgMusic` entirely |

---

## 28. Auto-Reflow System

The engine automatically detects and fixes overlapping `text` and
`kinetic-text` layers before rendering each scene.

**How it works:**
1. Measures each text layer's bounding box using `measureText()`
2. Sorts layers top-to-bottom by Y position
3. If any layer overlaps the one above, it is pushed down until there
   is a 24px gap
4. If pushing down would place the layer below `y: 1640` (caption safe
   zone), the font size is reduced first, then the layer is hard-clamped

**Design guidance:** Auto-reflow is a safety net for accidental overlaps.
Design clean layouts with proper Y spacing and let reflow handle edge
cases. Do not rely on it to fix fundamentally broken configs.

---

## 29. Text Animations Reference

Set on `text` or `shape` layers via `animation`, `animDur`, `startT`:

```js
{ animation: 'pop', animDur: 0.35, startT: 0.2 }
```

| Animation | Description |
|---|---|
| `fade` | Fades in from transparent |
| `pop` | Scales from 0 with elastic bounce |
| `slide-up` | Rises up while fading in |
| `slide-down` | Drops down while fading in |
| `slide-left` | Enters from right edge |
| `slide-right` | Enters from left edge |
| `bounce-in` | Bounces from above |
| `typewriter` | Characters reveal left to right |
| `pulse` | Continuously scales in/out (loops) |
| `shake` | Shakes with audio amplitude |

`startT` — seconds from scene start before animation begins.
`animDur` — seconds the animation takes to complete.

---

## 30. Ken Burns Reference

Ken Burns camera motion applies to `image` and `image-sequence` layers.
The motion runs over the full scene duration.

```js
{ kenBurns: 'zoom-in', kenBurnsAmount: 0.08 }
```

| Effect | Description |
|---|---|
| `zoom-in` | Camera slowly zooms into the image |
| `zoom-out` | Camera slowly zooms out from the image |
| `pan-left` | Camera pans left |
| `pan-right` | Camera pans right |
| `pan-up` | Camera pans upward |
| `pan-down` | Camera pans downward |
| `drift` | Diagonal drift with subtle zoom |
| `drift-reverse` | Diagonal drift in opposite direction |

`kenBurnsAmount`: `0.04–0.06` = subtle, `0.07–0.10` = normal (recommended),
`0.12–0.18` = dramatic.

All Ken Burns use ease-in-out interpolation for natural deceleration at
start and end.

---

## 31. Layout & Safe Zones

**Portrait canvas (1080×1920):**

| Zone | Y range | Purpose |
|---|---|---|
| Status bar safe | 0–120 | Avoid — phone UI overlaps |
| Title / label zone | 130–260 | Genre label, episode numbers, hook layer |
| Upper visual | 260–800 | Key image, big stat, hook text |
| Mid visual | 800–1300 | Body text, charts, sub-information |
| Lower visual | 1300–1640 | Secondary info, list items |
| Caption zone | 1640–1800 | Reserved for auto-captions |
| UI zone | 1800–1920 | Progress bar only — nothing else |

**Do not place text layers with `y` between 1640–1860** when using captions.

**Safe X range for text:** `x: 60` to `x: 1020` with `maxWidth: 960`.
Center-aligned text at `x: 540` with `maxWidth: 960` fills the safe area.

---

## 32. Image Caching

All loaded images are cached in memory for the duration of the render.
The same image path loaded by multiple layers only reads from disk once.
Cache is per-render, not persistent between runs.

**AI images:** Cached in `work/ai-images/` and persisted via GitHub
Actions cache between runs. Cache key includes a hash of `config.js`.
Changing a prompt invalidates only that image's cache — others are reused.

**HTML recordings:** Cached in `work/html-frames/` per source path.
Cache key includes a hash of `config.js`. Recordings are reused if
the config hasn't changed.

**TTS audio:** Cached in `work/tts/`. Re-generated on every run
(TTS generation is fast — ~5–15 seconds for a typical scene).

---

## 33. Running Locally

### macOS

```bash
brew install ffmpeg node python3
brew install pkg-config cairo pango libpng jpeg giflib librsvg

pip3 install "kokoro>=0.9.4" "misaki[en]" soundfile numpy Pillow

npm install
VIDEO_CONFIG=config.js \
NODE_OPTIONS='--max-old-space-size=6144' \
node engine-ci.js
```

### Ubuntu / Debian

```bash
sudo apt-get install -y \
    ffmpeg nodejs python3 python3-pip \
    libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev \
    librsvg2-dev build-essential pkg-config \
    espeak-ng espeak-ng-data libespeak-ng-dev \
    libsndfile1 libsndfile1-dev \
    chromium-browser libnss3 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libgbm1 libasound2t64

pip3 install "kokoro>=0.9.4" "misaki[en]" soundfile numpy Pillow

npm install
VIDEO_CONFIG=config.js \
NODE_OPTIONS='--max-old-space-size=6144' \
node engine-ci.js
```

---

## 34. Troubleshooting

### Video is 2 seconds long despite long pauseAfter

Check you have the v2.4 versions of `encoder.js` and `engine-ci.js`.
The fix for this was:
- `encoder.js`: changed `duration=first` → `duration=longest` in amix,
  added `apad` filter, removed `-shortest`
- `engine-ci.js`: when `pauseAfter > 1.0`, generates a silence WAV and
  concatenates it to the speech WAV before handing to FFmpeg

### Video renders but images are black

Pollinations API timed out or returned an error. Check the
`[ImageGen] ✗ Attempt` lines. Re-run — images that failed are
not cached and will re-generate.

### Captions not appearing

1. Check `src/captions.js` is committed to your repo
2. Check `engine-ci.js` is v2.3+ (contains `buildCaptionTrack`)
3. Check the scene has `captions: true` or a captions options object

### HTML recording shows black screen

`puppeteer` is not in your `npm install` step. Add it:
```yaml
run: npm install --save canvas fluent-ffmpeg fs-extra omggif puppeteer
```

### "Cannot find module './src/captions'"

`src/captions.js` is not in your repo. Commit it.

### Kokoro falls back to espeak

Kokoro model weights are downloading fresh. This happens when the Kokoro
cache is invalidated. Next run will use cached weights. Espeak quality is
lower but functional.

### Text overlaps captions

Move all text layers above `y: 1640`. The caption zone is `y: 1640–1860`.
Auto-reflow handles `text` and `kinetic-text` layers but not captions.

### FFmpeg audio duration error / silent video

Ensure you have the v2.4 `encoder.js`. The audio mix now uses
`duration=longest` and `apad` so video length drives output duration,
not audio length.

### hookLayer not working

Confirm `src/layers.js` is v2.3+ — it must contain the `hookLayer`
handling block before the `enterAt/exitAt` check.

### Scroll in html-record is too fast

Check `src/html-record.js` is v2.4. Default scroll speed is now `120`
(slow cinematic). Set `speed: 80` for very slow.

### "libasound2: no installation candidate"

Your runner is Ubuntu 24. Change `libasound2` to `libasound2t64` in
the workflow apt-get install step.

---

*APEX Video Engine v2.4*
*Engine file: `engine-ci.js` | Modules: `src/`*