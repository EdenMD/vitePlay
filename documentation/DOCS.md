# APEX Video Engine v2.0 — Complete Documentation

> **Everything you need to build, configure and publish social-media videos
> directly from GitHub Actions — no video editor required.**

---

## Table of Contents

1. [What the Engine Does](#1-what-the-engine-does)
2. [Repo Structure](#2-repo-structure)
3. [How to Set Up a New Repo](#3-how-to-set-up-a-new-repo)
4. [How Assets Work](#4-how-assets-work)
5. [Output Settings](#5-output-settings)
6. [TTS — Voice and Speech](#6-tts--voice-and-speech)
7. [Scene Structure](#7-scene-structure)
8. [Every Layer Type (Full Reference)](#8-every-layer-type-full-reference)
9. [Avatar — The Robot Character](#9-avatar--the-robot-character)
10. [Particle System](#10-particle-system)
11. [Transitions Between Scenes](#11-transitions-between-scenes)
12. [Animations on Text and Shapes](#12-animations-on-text-and-shapes)
13. [Charts and Data Visualisation](#13-charts-and-data-visualisation)
14. [Audio — Music and Waveforms](#14-audio--music-and-waveforms)
15. [Post-Processing Effects](#15-post-processing-effects)
16. [Layout Rules — How to Avoid Overlap](#16-layout-rules--how-to-avoid-overlap)
17. [Auto-Reflow System](#17-auto-reflow-system)
18. [Config Patterns — Best Practices](#18-config-patterns--best-practices)
19. [Running Locally](#19-running-locally)
20. [Troubleshooting](#20-troubleshooting)

---

## 1. What the Engine Does

The engine takes a JavaScript config file and turns it into a
production-ready MP4 video suitable for TikTok, YouTube Shorts, Instagram
Reels and Twitter/X.

**Processing order per video:**

```
config.js
  │
  ▼  Phase 1 — TTS
  │  Kokoro-82M neural TTS generates one WAV per scene
  │
  ▼  Phase 2 — Rendering
  │  Node-canvas draws every frame (background → layers → avatar → effects)
  │  Auto-reflow detects and fixes any overlapping text/elements
  │  Frames are JPEG-compressed and streamed to FFmpeg via pipe
  │
  ▼  Phase 3 — Encoding
     FFmpeg concatenates audio, encodes H.264 CRF-18, outputs MP4
```

**GitHub Actions free tier limits this engine respects:**
- RAM: 8 GB (engine uses ~2–5 GB)
- Disk: 14 GB SSD (temp files use ~1–3 GB)
- CPU: 2 vCPUs
- Time: 6 hours max (typical render: 5–20 min)

---

## 2. Repo Structure

```
your-repo/
│
├── engine-ci.js              ← Master orchestrator — do not rename
├── config.js                 ← YOUR main video config (edited per video)
│
├── src/                      ← Engine modules — only edit if customising
│   ├── tts-kokoro.js         ← Kokoro TTS wrapper + espeak fallback
│   ├── avatar.js             ← Robot character renderer
│   ├── layers.js             ← All layer types + auto-reflow system
│   ├── particles.js          ← Particle emitter system
│   ├── transitions.js        ← Scene transition effects
│   ├── encoder.js            ← FFmpeg wrapper
│   └── easing.js             ← Math utilities and easing functions
│
├── assets/                   ← YOUR images, music, fonts (see Section 4)
│   ├── music.mp3
│   ├── intro.png
│   └── logo.png
│
├── package.json
├── .gitignore
│
├── .github/
│   └── workflows/
│       └── generate-video.yml   ← CI workflow — must be in this exact path
│
└── work/                     ← Auto-created at runtime, never commit this
    └── *.mp4                 ← Output lives here after the run
```

**The `.github/workflows/` path is mandatory.** GitHub Actions will not
detect the workflow file if it is anywhere else.

---

## 3. How to Set Up a New Repo

### Step 1 — Create your GitHub repository

Create a new **private** repository on GitHub. Private is recommended
because your config files and assets will be visible otherwise.

### Step 2 — Copy the engine files

Upload or commit these files, maintaining the exact folder structure:

```
engine-ci.js          → repo root
src/                  → repo root/src/
package.json          → repo root
.gitignore            → repo root
generate-video.yml    → .github/workflows/generate-video.yml
```

### Step 3 — Create your config

Create `config.js` in the repo root. Start from `config.minimal.js`
as a template — it has one scene and renders in about 3 minutes.

### Step 4 — Push and watch

Push to `main`. Go to **Actions** tab in your repo. The workflow starts
automatically. When it finishes, click the run → **Artifacts** → download
your MP4.

### To trigger manually with a different config

Go to **Actions → Generate Video → Run workflow** and type the config
filename in the input box (e.g. `config.test.js`).

---

## 4. How Assets Work

### Where to put files

All asset files must be committed to the repo. The CI runner clones your
repo before running, so any file in the repo is available at its relative
path from the repo root.

```
assets/
├── music/
│   └── background.mp3      → reference as './assets/music/background.mp3'
├── images/
│   ├── thumbnail.png       → reference as './assets/images/thumbnail.png'
│   └── logo.png            → reference as './assets/images/logo.png'
└── fonts/                  → not yet supported (system fonts only)
```

### Supported image formats

`PNG`, `JPG/JPEG`, `GIF` (first frame only — animated GIFs are not played)

### Supported audio formats

`MP3`, `WAV`, `AAC`, `M4A` — anything FFmpeg can decode

### File size limits

GitHub has a **100 MB per file** hard limit and a **5 GB total repo** soft
limit. For background music, use compressed MP3 files (128–192 kbps).
For images, compress PNGs before committing.

### Background music from a URL

You can reference a URL directly in `bgMusic` — FFmpeg will download it
during the render. However this is fragile (URL may be unavailable or
rate-limited on CI). Committing an MP3 to the repo is far more reliable.

```js
// RELIABLE — file in repo
bgMusic: './assets/music/background.mp3'

// FRAGILE — external URL
bgMusic: 'https://example.com/music.mp3'
```

### Referencing images in layers

```js
{
    type: 'image',
    src:  './assets/images/logo.png',   // path relative to repo root
    x: 540, y: 300,
    width: 400, height: 200,
    fit: 'contain',
}
```

---

## 5. Output Settings

The `output` block at the top of your config controls the final video.

```js
output: {
    title:      'My Video',     // used in the output filename
    format:     'portrait',     // 'portrait' | 'landscape' | 'square'
    fps:        30,             // 24 | 30 | 60
    crf:        18,             // quality: 18=cinema, 23=good, 28=smaller
    preset:     'medium',       // ultrafast|fast|medium|slow
    bgMusic:    './assets/music/bg.mp3',
    bgMusicVol: 0.22,           // 0.0–1.0
    cleanup:    true,           // delete temp WAV files after render
    postProcess: { ... },       // global visual effects (see Section 15)
}
```

### Format dimensions

| `format`    | Width | Height | Use case                     |
|-------------|-------|--------|------------------------------|
| `portrait`  | 1080  | 1920   | TikTok, Reels, Shorts ✓ best |
| `landscape` | 1920  | 1080   | YouTube, Twitter             |
| `square`    | 1080  | 1080   | Instagram feed               |

You can also override manually:
```js
output: { width: 1080, height: 1350 }  // Instagram 4:5
```

### CRF quality guide

| CRF | Quality | File size (1 min) | Recommended for         |
|-----|---------|-------------------|-------------------------|
| 18  | Cinema  | ~60–90 MB         | Final publish            |
| 23  | Good    | ~30–50 MB         | Good balance             |
| 26  | Decent  | ~15–25 MB         | Testing (renders faster) |
| 28  | Low     | ~8–15 MB          | Quick drafts only        |

### Preset speed guide

| Preset      | Render time | Quality impact  |
|-------------|-------------|-----------------|
| `ultrafast` | Very fast   | Noticeable loss |
| `fast`      | Fast        | Minor loss      |
| `medium`    | Moderate    | None (default)  |
| `slow`      | Slow        | Slight gain     |

**Recommendation:** Use `crf: 26, preset: 'fast'` during testing.
Switch to `crf: 18, preset: 'medium'` for the final publish.

---

## 6. TTS — Voice and Speech

### How it works

The engine uses **Kokoro-82M**, a neural text-to-speech model that runs
locally on the CI runner. It produces natural-sounding speech without any
API key or internet connection (after the first run when it downloads).

On first run it downloads ~300 MB of model weights. These are cached by
GitHub Actions so subsequent runs are fast.

If Kokoro fails for any reason, the engine automatically falls back to
`espeak-ng` with an audio warmth filter applied.

### Adding TTS to a scene

```js
{
    tts: {
        text:        'Your spoken words go here.',
        voice:       'af_heart',
        pauseAfter:  0.4,    // silence added after speech ends (seconds)
        pauseBefore: 0.0,    // silence before speech starts
    },
    layers: [ ... ]
}
```

When `tts` is present, the scene duration is set automatically to match
the speech duration plus `pauseAfter`. You do not need to set `duration`.

### Available voices

| Voice ID      | Accent   | Gender | Character                     |
|---------------|----------|--------|-------------------------------|
| `af_heart`    | American | Female | Warm, expressive — best for most content |
| `af_bella`    | American | Female | Bright, energetic             |
| `af_sarah`    | American | Female | Natural, conversational       |
| `af_nicole`   | American | Female | Soft, intimate                |
| `af_sky`      | American | Female | Youthful, upbeat              |
| `am_adam`     | American | Male   | Authoritative, deep           |
| `am_michael`  | American | Male   | Friendly, clear               |
| `bf_emma`     | British  | Female | Refined, articulate           |
| `bf_isabella` | British  | Female | Warm, storytelling            |
| `bm_george`   | British  | Male   | Deep, commanding — great for documentary |
| `bm_lewis`    | British  | Male   | Crisp, professional           |

### Setting a default voice

```js
defaults: {
    voice: 'bm_george',   // applied to all scenes that don't specify one
}
```

### Setting voice per scene

```js
tts: {
    text:  'Hello from a different voice.',
    voice: 'af_bella',
}
```

### Controlling pacing

```js
tts: {
    text:        'This sentence has a pause at the end.',
    voice:       'af_heart',
    pauseAfter:  0.8,    // 0.8 seconds of silence after speaking
    pauseBefore: 0.2,    // 0.2 seconds before speaking starts
}
```

Use `pauseAfter: 0.4–0.6` for dramatic effect. Use `pauseAfter: 0.2` for
fast-paced content.

### Scene with no speech

If you want a scene with no voice (music only, or silent), simply omit the
`tts` block and set `duration` explicitly:

```js
{
    duration: 4.0,   // scene plays for 4 seconds with no voice
    layers: [ ... ]
}
```

---

## 7. Scene Structure

Each item in the `scenes` array is one scene. Scenes play sequentially.

```js
{
    // ── Duration ────────────────────────────────────────────────────────
    // Option A: driven by TTS (recommended when tts is present)
    tts: { text: '...', voice: 'af_heart' },
    // Option B: explicit — use this when there is no TTS
    duration: 5.0,

    // ── Transition ──────────────────────────────────────────────────────
    // Applied at the END of this scene (i.e. transition INTO the next)
    transition:         'fade',    // see Section 11 for all types
    transitionDuration: 0.5,       // seconds (default varies by type)

    // ── Per-scene post-processing ────────────────────────────────────────
    postProcess: {
        scanlines:    true,
        grain:        true,
        grainStrength: 0.06,
    },

    // ── Layers ──────────────────────────────────────────────────────────
    // Drawn bottom-to-top in the order listed.
    // Background must always be the FIRST layer.
    layers: [
        { type: 'gradient', ... },   // background first
        { type: 'text', ... },
        { type: 'shape', ... },
        { type: 'avatar', ... },
        { type: 'waveform', ... },
        { type: 'progress-bar', ... },
    ],
}
```

### Layer draw order

Layers are drawn in list order — each one paints on top of all previous ones.
The recommended order is:

```
1. background / gradient      ← fills the entire canvas
2. particles (background)     ← atmospheric, behind everything
3. images                     ← photos or background textures
4. shapes (decorative)        ← badges, boxes, dividers
5. charts                     ← data visualisations
6. text layers                ← main readable content
7. avatar                     ← character on top of content
8. particles (foreground)     ← confetti, sparks over everything
9. waveform                   ← audio visualiser
10. progress-bar              ← always last, very bottom
```

---

## 8. Every Layer Type (Full Reference)

### `background`

Solid colour fill. Covers the whole canvas.

```js
{
    type:             'background',
    color:            '#0a0c0f',
    vignette:         true,          // dark edges
    vignetteStrength: 0.5,           // 0–1
    noise:            false,         // subtle grain texture
    noiseOpacity:     0.04,
}
```

---

### `gradient`

Animated gradient fill. Covers the whole canvas.

```js
{
    type:         'gradient',
    gradientType: 'linear',          // 'linear' | 'radial'
    colors:       ['#1a0035', '#000020', '#000010'],
    angle:        170,               // degrees (linear only, 0=right 90=down 180=left)
    animated:     false,             // slowly rotates the angle over time
    vignette:     true,
    vignetteStrength: 0.45,
}
```

**Tip:** Use 3+ colour stops for richer gradients. The first colour is
the top/centre, the last is the bottom/edge.

---

### `image`

Draws an image from your assets folder.

```js
{
    type:         'image',
    src:          './assets/images/photo.jpg',
    x:            0,
    y:            0,
    width:        1080,
    height:       1920,
    fit:          'cover',           // 'cover' | 'contain' | 'fill'
    borderRadius: 0,                 // rounded corners in pixels
    opacity:      1,
}
```

| `fit` value | Behaviour |
|-------------|-----------|
| `cover`     | Fills the box, crops if needed (like CSS background-size: cover) |
| `contain`   | Fits inside the box, letterboxed if needed |
| `fill`      | Stretches to exactly fill — may distort |

---

### `text`

The most used layer. Draws text with optional animation.

```js
{
    type:       'text',
    text:       'YOUR TEXT HERE',
    x:          540,               // horizontal centre (for align: 'center')
    y:          960,               // vertical centre of the text block
    fontSize:   72,                // pixels
    fontFamily: 'Impact, Arial Black, sans-serif',
    fontWeight: 'bold',
    color:      '#ffffff',
    gradient:   ['#ff3b5c', '#ff8c00'],  // overrides color with a gradient
    align:      'center',          // 'left' | 'center' | 'right'
    maxWidth:   950,               // text wraps at this width
    lineHeight: 1.25,              // line spacing multiplier

    // Shadow
    shadow:      true,
    shadowColor: 'rgba(0,0,0,0.7)',
    shadowBlur:  18,
    shadowOffsetX: 0,
    shadowOffsetY: 4,

    // Glow
    glow:      true,
    glowColor: '#ff3b5c',
    glowBlur:  30,

    // Stroke (outline)
    stroke:      true,
    strokeColor: '#000000',
    strokeWidth: 4,

    // Animation (see Section 12)
    animation: 'slide-up',
    animDur:   0.5,                // how long the enter animation takes
    startT:    0.3,                // scene time (seconds) when animation begins

    // Layer visibility timing
    enterAt:  0.0,                 // scene time when this layer starts appearing
    enterDur: 0.3,                 // fade-in duration
    exitAt:   null,                // scene time when it starts disappearing (null = never)
    exitDur:  0.25,
}
```

**Multi-line text:** Use `\n` to force a line break:

```js
text: 'THE DATA\nDOES NOT LIE.'
```

**Long text:** Set `maxWidth` and the engine word-wraps automatically. The
`y` coordinate is always the vertical centre of the whole text block
regardless of how many lines it wraps to.

---

### `shape`

Draws geometric shapes — useful for badges, highlight boxes, dividers.

```js
{
    type:      'shape',
    shape:     'rect',             // 'rect' | 'circle' | 'triangle' | 'star' | 'diamond' | 'line' | 'arrow'
    x:         540,               // centre x
    y:         300,               // centre y
    width:     600,
    height:    80,
    color:     '#e63946',
    borderRadius: 40,             // rect only — rounded corners
    spikes:    5,                 // star only — number of points
    rotation:  0,                 // initial rotation in radians
    stroke:    false,
    strokeColor: '#fff',
    strokeWidth: 3,
    shadow:    true,
    shadowColor: 'rgba(230,57,70,0.4)',
    shadowBlur:  25,
    glow:      false,
    glowColor: '#e63946',
    glowBlur:  40,
    animation: 'pulse',           // see Section 12
    speed:     1.0,
    enterAt:   0.0,
    enterDur:  0.3,
}
```

**Pattern: header badge**

The most common use of `shape` is a coloured pill badge behind title text:

```js
// Badge background
{ type: 'shape', shape: 'rect', x: 540, y: 210, width: 520, height: 76,
  color: '#e63946', borderRadius: 38 },
// Text on top
{ type: 'text', text: 'MY TITLE', x: 540, y: 212,
  fontSize: 40, color: '#fff', align: 'center' },
```

The text `y` matches the badge `y` so they are vertically centred together.

---

### `divider`

A horizontal line with animated draw-in effect.

```js
{
    type:      'divider',
    y:         850,               // vertical position
    x1:        120,               // left edge
    x2:        960,               // right edge
    color:     'rgba(255,255,255,0.3)',
    thickness: 2,
    animDur:   0.5,               // how long the line draws in
}
```

---

### `waveform`

Audio visualiser driven by the TTS amplitude. Moves in sync with the voice.

```js
{
    type:     'waveform',
    vizStyle: 'bars',            // 'bars' | 'wave' | 'circle' | 'mirror'
    x:        54,                // left edge (for bars/wave/mirror)
    y:        1700,              // vertical position
    width:    972,
    height:   70,
    bars:     48,                // number of bars or segments
    color:    '#00cfff',
    opacity:  0.45,
    lineWidth: 3,                // wave style only

    // Circle style — uses cx/cy as centre instead of x/y
    cx:     540,
    cy:     1100,
    radius: 280,
}
```

**Always place waveform at `y: 1700`** to keep it in the fixed footer zone
and out of the way of content.

---

### `progress-bar`

Shows video progress. Fills from left to right as the scene plays.

```js
{
    type:       'progress-bar',
    x:          54,
    y:          1855,
    width:      972,
    height:     8,
    color:      '#ff3b5c',
    color2:     '#ff8c00',       // gradient end colour
    trackColor: 'rgba(255,255,255,0.1)',
    showLabel:  false,           // show percentage number
    progress:   null,            // null = auto (scene time / scene duration)
}
```

**Always place progress-bar at `y: 1855`** — this is the standard
position used across all configs.

---

### `overlay`

Full-screen colour tint. Useful for dramatic darkening or colour grading.

```js
{
    type:        'overlay',
    color:       'rgba(0,0,0,0.35)',
    grain:       true,
    grainOpacity: 0.05,
}
```

---

### `scanlines`

Retro CRT horizontal scanlines effect.

```js
{
    type:    'scanlines',
    spacing: 4,    // pixels between each line
}
```

---

### `countdown`

Large animated countdown number.

```js
{
    type:     'countdown',
    from:     5,              // count down from this number
    x:        540,
    y:        960,
    fontSize: 180,
    color:    '#ffffff',
}
```

---

### `mockup`

Phone or browser frame overlay.

```js
{
    type:        'mockup',
    mockupType:  'phone',         // 'phone' | 'browser'
    x:           540,
    y:           960,
    width:       380,
    height:      760,
    frameColor:  '#1a1a2e',
    screenBg:    '#0f0f1a',
    animDur:     0.6,
    url:         'your-site.com', // browser address bar text
}
```

---

## 9. Avatar — The Robot Character

The avatar is a cute white robot character that speaks in sync with the TTS.

### Basic usage

```js
{
    type:        'avatar',
    x:           540,          // horizontal centre
    y:           1350,         // vertical centre of the whole robot
    size:        220,          // base radius — controls overall scale
    expression:  'neutral',    // see expression table below
    name:        'BOT',        // label shown below robot (null to hide)
}
```

### All avatar properties

```js
{
    type:        'avatar',

    // Position and size
    x:           540,
    y:           1350,
    size:        220,          // increase for bigger robot, decrease for smaller

    // Appearance
    bodyColor:   '#f0f0f0',    // body colour (white by default)
    screenColor: '#1a1a1a',    // face screen colour (dark by default)
    accentColor: '#00cfff',    // eye glow, mouth, chest light colour

    // Expression — changes eye shape and mouth curve
    expression:  'happy',

    // Name tag below the robot
    name:        'BOT',        // set to null to hide

    // Motion — animates position within the scene
    motion:      'slide-in-left',
    enterDur:    0.55,
}
```

### Expression types

| Expression   | Eyes                    | Mouth              | Use when             |
|--------------|-------------------------|--------------------|----------------------|
| `neutral`    | Normal, round           | Slight smile       | Default, narration   |
| `happy`      | Slightly squinted       | Big smile          | Good news, reveals   |
| `excited`    | Wide open               | Big open smile     | Announcements, hooks |
| `sad`        | Drooping slightly       | Downward curve     | Bad news, warnings   |
| `angry`      | Narrowed                | Tight frown        | Emphasis, urgent     |
| `surprised`  | Very wide               | Small O shape      | Shocking stats       |
| `wink`       | Left normal, right wink | Smile              | Casual, friendly     |
| `thinking`   | One slightly raised     | Neutral            | Questions, analysis  |

### Changing the accent colour

The accent colour affects the eye glow, mouth bars, and chest light strip.
Match it to your scene palette:

```js
accentColor: '#ff3b5c'    // red — danger, urgency
accentColor: '#00cfff'    // cyan — tech, data
accentColor: '#57cc99'    // green — positive, success
accentColor: '#f4a261'    // orange — warning, attention
accentColor: '#a855f7'    // purple — premium, mystery
```

### Avatar motion paths

The avatar can animate its position within a scene using the `motion` property.

```js
{
    type:     'avatar',
    x:        540, y: 1100,
    motion:   'slide-in-left',    // enters from left
    enterDur: 0.6,                // how long the entrance takes
}
```

| Motion          | Description                                    |
|-----------------|------------------------------------------------|
| `slide-in-left` | Enters from off the left edge                  |
| `slide-in-right`| Enters from off the right edge                 |
| `slide-in-bottom`| Enters from below                             |
| `bounce`        | Drops from top and bounces                     |
| `float`         | Drifts side-to-side gently                     |
| `walk-across`   | Walks from left to right across the full scene |
| `shake`         | Shakes horizontally (good for excited scenes)  |
| `exit-left`     | Stays then slides out left in last 40% of scene|
| `exit-right`    | Stays then slides out right                    |
| `enter-center`  | Rises from below to centre position            |

**Walk-across custom range:**

```js
{
    type:    'avatar',
    y:       1100,
    motion:  'walk-across',
    startX:  -80,       // starting x (off left edge)
    endX:    1160,      // ending x (off right edge)
}
```

**Float range:**

```js
{
    type:       'avatar',
    x: 540, y: 1100,
    motion:     'float',
    floatRange: 40,     // how many pixels side-to-side
}
```

### Combining avatar with waveform (circle style)

The circle waveform around the avatar is a great visual. Place the
waveform's `cx`/`cy` at the same position as the avatar and set
`radius` to just outside the robot body:

```js
// Avatar at 540, 1100, size 220
{ type: 'avatar', x: 540, y: 1100, size: 220, expression: 'happy' },
// Circle waveform around it
{ type: 'waveform', vizStyle: 'circle', cx: 540, cy: 1100, radius: 290, bars: 36, color: '#00cfff44' },
```

The `44` at the end of the colour is hex opacity (27%). This keeps the
waveform subtle so it does not compete with the robot.

---

## 10. Particle System

Particles add life and energy to scenes. They are fully physics-simulated.

### Basic usage

```js
{
    type:         'particles',
    particleType: 'confetti',
    x:            540,           // emitter x position
    y:            -20,           // emitter y position (-20 = just above screen)
    spread:       800,           // horizontal spread of emission
    rate:         30,            // particles emitted per second
    colors:       ['#ff3b5c', '#ffe600', '#00cfff'],
}
```

### Particle types

| Type       | Description                              | Best position         |
|------------|------------------------------------------|-----------------------|
| `confetti` | Coloured rectangles that tumble down     | y: -20 (top)          |
| `fire`     | Radial gradient flames, rises upward     | y: 1920 (bottom)      |
| `sparks`   | Fast bright streaks in all directions    | any                   |
| `snow`     | Soft white circles drifting down         | y: -20 (top)          |
| `bubbles`  | Rising outlined circles                  | y: 1920 (bottom)      |
| `stars`    | Twinkling star shapes, stationary        | spread across screen  |
| `matrix`   | Falling green characters                 | y: 0 (top)            |
| `dust`     | Soft glowing motes, rises slowly         | any                   |

### Additional properties

```js
{
    type:         'particles',
    particleType: 'sparks',
    x:    540, y: 400,
    spread: 200,
    rate:   40,
    colors: ['#ffe600', '#ff8c00', '#fff'],
    gravity: 200,    // downward pull (px/s²) — override default
    wind:    0,      // horizontal drift (px/s)
}
```

### Using two particle layers

Put background particles before content, foreground particles after:

```js
layers: [
    { type: 'gradient', ... },
    { type: 'particles', particleType: 'stars', rate: 1 },  // background stars
    { type: 'text', ... },
    { type: 'particles', particleType: 'sparks', ... },      // foreground sparks
]
```

---

## 11. Transitions Between Scenes

The `transition` property on a scene controls how it transitions INTO
the **next** scene. The last scene in your array does not need a transition.

```js
{
    transition:         'glitch',
    transitionDuration: 0.6,       // seconds
    layers: [ ... ]
}
```

### All transition types

| Transition    | Duration | Character                              |
|---------------|----------|----------------------------------------|
| `fade`        | 0.5 s    | Classic crossfade — works everywhere   |
| `wipe-right`  | 0.45 s   | Horizontal wipe left→right             |
| `wipe-left`   | 0.45 s   | Horizontal wipe right→left             |
| `wipe-down`   | 0.45 s   | Vertical wipe top→bottom               |
| `wipe-up`     | 0.45 s   | Vertical wipe bottom→top               |
| `zoom-in`     | 0.5 s    | Zooms into next scene                  |
| `zoom-out`    | 0.5 s    | Pulls back to reveal next              |
| `slide-left`  | 0.4 s    | Both scenes slide horizontally         |
| `slide-right` | 0.4 s    | Both scenes slide right                |
| `glitch`      | 0.6 s    | RGB split + horizontal slice corruption|
| `dissolve`    | 0.55 s   | Pixel-tile checkerboard dissolve       |
| `iris`        | 0.55 s   | Circular iris opens from centre        |
| `split-h`     | 0.45 s   | Top and bottom halves split apart      |
| `split-v`     | 0.45 s   | Left and right halves split apart      |
| `rotate`      | 0.6 s    | Full 360° spin                         |

### Setting a default transition for all scenes

```js
defaults: {
    transition:         'fade',
    transitionDuration: 0.45,
}
```

Scenes can still override this individually.

---

## 12. Animations on Text and Shapes

### Text animations

Applied via `animation` on a text layer. Controls how the text enters.

```js
{
    type:      'text',
    text:      'Hello!',
    animation: 'slide-up',
    animDur:   0.5,          // seconds for the animation to complete
    startT:    0.3,          // scene time (seconds) when animation begins
}
```

| Animation    | Effect                                              |
|--------------|-----------------------------------------------------|
| `none`       | Appears instantly, no animation                     |
| `fade`       | Fades in from transparent                           |
| `slide-up`   | Slides up from 60px below + fades in               |
| `slide-down` | Slides down from 60px above + fades in             |
| `slide-left` | Slides in from the right + fades in                |
| `slide-right`| Slides in from the left + fades in                 |
| `pop`        | Elastic scale from 30% to 100%                     |
| `bounce-in`  | Bounces in from the top                            |
| `typewriter` | Types character by character                       |
| `pulse`      | Continuously oscillates scale (loop)               |
| `shake`      | Shakes when audio is loud                          |

**Staggering animations across multiple text layers:**

Use increasing `startT` values so each element arrives after the previous one:

```js
{ type: 'text', text: 'TITLE', y: 400, animation: 'pop',      startT: 0.0, animDur: 0.4 },
{ type: 'text', text: 'Sub',   y: 520, animation: 'slide-up', startT: 0.4, animDur: 0.4 },
{ type: 'text', text: 'Body',  y: 650, animation: 'fade',     startT: 0.8, animDur: 0.5 },
```

### Shape animations

```js
{
    type:      'shape',
    animation: 'pulse',
    speed:     1.5,          // how fast the loop runs
}
```

| Animation | Effect                              |
|-----------|-------------------------------------|
| `spin`    | Continuous rotation                 |
| `pulse`   | Scale oscillates in and out         |
| `breathe` | Slow, smooth scale breathe          |

---

## 13. Charts and Data Visualisation

### Bar chart

```js
{
    type:      'chart',
    chartType: 'bar',
    x:         60,           // left edge
    y:         310,          // top edge
    width:     960,
    height:    500,
    animDur:   1.5,          // seconds to animate bars growing
    enterAt:   0.3,          // scene time to start animating
    data: [
        { label: 'Jan', value: 42,  color: '#e63946' },
        { label: 'Feb', value: 68,  color: '#ff8c00' },
        { label: 'Mar', value: 115, color: '#ffe600' },
    ],
}
```

**Bar label length:** Keep labels short — 8 characters maximum. Long labels
overlap each other. Use abbreviations: `'Customer Service'` → `'CustServ'`.

### Line chart

```js
{
    type:      'chart',
    chartType: 'line',
    x:         60, y: 310,
    width:     960, height: 440,
    animDur:   1.6,
    lineColor: '#57cc99',
    lineWidth: 5,
    data: [
        { label: '2020', value: 134 },
        { label: '2021', value: 140 },
        { label: '2022', value: 148 },
    ],
}
```

### Pie chart

```js
{
    type:      'chart',
    chartType: 'pie',        // or 'donut'
    cx:        540,          // ABSOLUTE centre x — not top-left!
    cy:        700,          // ABSOLUTE centre y — not top-left!
    x:         540,          // must match cx
    y:         700,          // must match cy
    width:     560,
    height:    560,
    animDur:   1.8,
    explode:   true,         // offset slices slightly outward
    data: [
        { label: 'A', value: 63, color: '#00b4d8' },
        { label: 'B', value: 28, color: '#48cae4' },
        { label: 'C', value: 9,  color: '#2a2d3a' },
    ],
}
```

> **Important:** For pie and donut charts, `cx` and `cy` are the ABSOLUTE
> pixel coordinates of the chart centre on screen. This is different from
> bar and line charts where `x`/`y` is the top-left corner. Always set both
> `cx`/`cy` AND `x`/`y` to the same value for pie/donut.

---

## 14. Audio — Music and Waveforms

### Background music

```js
output: {
    bgMusic:    './assets/music/background.mp3',
    bgMusicVol: 0.22,    // 0.0–1.0 — keep below 0.3 so voice is clear
}
```

The background music loops for the full video duration and is mixed
under the TTS voice track.

### Waveform visualiser

The waveform animates in real-time with the voice amplitude. It works
automatically as long as a `tts` block is in the scene.

```js
{ type: 'waveform', vizStyle: 'bars', x: 54, y: 1700, width: 972, height: 70,
  bars: 48, color: '#00cfff', opacity: 0.4 }
```

The four `vizStyle` options:

| Style    | Description                              |
|----------|------------------------------------------|
| `bars`   | Vertical bars — classic equaliser look   |
| `wave`   | Continuous sine wave line                |
| `circle` | Bars radiating from a centre point       |
| `mirror` | Bars going both up and down symmetrically|

---

## 15. Post-Processing Effects

Applied after all layers render. Can be set globally in `output` or
per-scene.

```js
postProcess: {
    grain:              true,     // film grain noise
    grainStrength:      0.03,     // 0–1 (0.02–0.05 is natural)
    vignette:           true,     // dark edges
    vignetteStrength:   0.5,      // 0–1
    scanlines:          false,    // CRT horizontal lines
    colorGrade:         null,     // multiply tint color e.g. '#ff8800'
    colorGradeStrength: 0.15,     // 0–1
}
```

**Scene override:** A scene's `postProcess` merges with the global one.

```js
{
    postProcess: { scanlines: true, grainStrength: 0.065 },  // adds to global
    layers: [ ... ]
}
```

---

## 16. Layout Rules — How to Avoid Overlap

The engine has an **auto-reflow system** (see Section 17) that
automatically pushes overlapping elements apart. However, designing clean
layouts from the start produces better results than relying on reflow.

### The safe zones

```
y=0    ┌──────────────────────┐
       │  TOP PADDING         │  y=0–160  (avoid — black bars on some devices)
y=160  ├──────────────────────┤
       │                      │
       │  HEADER ZONE         │  y=160–280  (badges, titles)
       │                      │
y=280  ├──────────────────────┤
       │                      │
       │  CONTENT ZONE        │  y=280–1620  (everything else)
       │                      │
y=1620 ├──────────────────────┤
       │  WAVEFORM            │  y=1700, h=70
y=1700 ├──────────────────────┤
       │  BOTTOM PADDING      │  y=1770–1840
y=1840 ├──────────────────────┤
       │  PROGRESS BAR        │  y=1855, h=7
y=1870 ├──────────────────────┤
       │  DEVICE CHROME       │  y=1870–1920
y=1920 └──────────────────────┘
```

### Vertical spacing rules

1. **After a header badge** (h=76): next element starts at `y = badge_y + 100`
2. **After a chart**: next element starts at `y = chart_y + chart_height + 60`
3. **After single-line text** (fontSize=F): next element at `y += F * 1.4`
4. **After multi-line text** (N lines, fontSize=F, lineHeight=L):
   next element at `y += N * F * L + 40`
5. **Minimum gap between any two elements**: 24 px

### Standard header badge pattern

This is the safest, cleanest way to title a scene:

```js
// Badge at y=210 — constant across all scenes
{ type: 'shape', shape: 'rect', x: 540, y: 210, width: 560, height: 76,
  color: '#e63946', borderRadius: 38 },
// Text centred exactly on the badge
{ type: 'text', text: 'MY TITLE', x: 540, y: 212,
  fontSize: 40, fontFamily: 'Impact, sans-serif',
  color: '#fff', align: 'center' },
// First content element always starts at y=310
{ type: 'chart', ..., y: 310 },
```

---

## 17. Auto-Reflow System

The engine automatically detects and fixes overlapping text, shapes and
charts before rendering each scene.

### What it does

1. Measures the precise bounding box of every content layer using
   `measureText()` with the actual font settings
2. Sorts layers top-to-bottom by `y` position
3. Walks the list — if a layer overlaps the one above it, pushes it down
   until there is a 24 px gap
4. If a layer is pushed below `y=1640` (the safe bottom), it shrinks the
   font size first, then hard-clamps the position

### What it does NOT do

- It does not move backgrounds, gradients, particles, waveforms or
  progress bars — those are treated as fixed elements
- It does not split text across multiple layers
- It does not reorganise the horizontal layout — only vertical

### Relying on reflow vs designing clean layouts

Reflow is a safety net, not a design tool. Use it to catch accidental
overlaps. Do not design a config expecting reflow to fix everything — some
scenarios (very long text, very large fonts, many elements) may still
produce tight layouts even after reflow.

---

## 18. Config Patterns — Best Practices

### Pattern 1 — Documentary / data video

Good for factual content with statistics, charts and a commanding voice.

```js
defaults: { voice: 'bm_george', transition: 'fade' },
scenes: [
    // Hook — big number, no TTS, 4 seconds
    { duration: 4.0, transition: 'glitch', layers: [
        { type: 'background', color: '#000' },
        { type: 'text', text: '300M', fontSize: 480, gradient: ['#e63946','#c1121f'],
          animation: 'pop', y: 750 },
        { type: 'text', text: 'JOBS', fontSize: 96, color: '#fff',
          animation: 'slide-up', startT: 0.3, y: 1010 },
    ]},
    // Context — TTS with title
    { tts: { text: 'Here is what the report actually says...' },
      layers: [ ... ] },
    // Chart scene
    { tts: { text: 'The numbers are clear.' },
      layers: [
          { type: 'chart', chartType: 'bar', ... },
      ]},
    // CTA
    { tts: { text: 'Follow for more.' },
      layers: [ ... ] },
]
```

### Pattern 2 — Talking head (avatar-forward)

Good for educational or personal brand content.

```js
defaults: { voice: 'af_heart', transition: 'fade' },
scenes: [
    { tts: { text: 'Hey! Here is something you need to know.' },
      layers: [
          { type: 'gradient', colors: ['#001828', '#000508'] },
          { type: 'text', text: 'DID YOU KNOW?', y: 350, fontSize: 88,
            animation: 'pop', gradient: ['#00cfff','#0066ff'] },
          { type: 'avatar', x: 540, y: 1100, size: 240,
            expression: 'excited', motion: 'slide-in-left', name: 'BOT' },
          { type: 'waveform', vizStyle: 'circle', cx: 540, cy: 1100,
            radius: 290, bars: 36, color: '#00cfff33' },
          { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 8 },
      ]},
]
```

### Pattern 3 — Listicle / tips

Good for "Top 5 things" style content.

```js
scenes: [
    { tts: { text: 'Number one: always start with a hook.' },
      layers: [
          { type: 'gradient', ... },
          // Number badge
          { type: 'shape', shape: 'circle', x: 160, y: 300,
            width: 160, color: '#ff3b5c' },
          { type: 'text', text: '1', x: 160, y: 300, fontSize: 96,
            color: '#fff', align: 'center' },
          // Tip text
          { type: 'text', text: 'Start with a hook', x: 600, y: 300,
            fontSize: 64, color: '#fff', align: 'left', maxWidth: 800 },
          // Body text
          { type: 'text', text: 'The first 2 seconds determine if they stay.',
            x: 540, y: 600, fontSize: 46, color: 'rgba(255,255,255,0.75)',
            maxWidth: 920, animation: 'fade', startT: 0.5 },
      ]},
]
```

### What to avoid

**Do not** set `emotion` on TTS — it changes the speaking speed which
sounds unnatural. The voice character already carries emotion.

**Do not** use `fontSize` above 480 — anything larger clips or causes
layout issues.

**Do not** put `text` layers directly on top of `shape` layers at the
exact same `y` — while the reflow system prevents text-on-text collision,
a text inside a shape badge is intentional and the auto-reflow is designed
to allow it (it only separates layers that would be visually separate).

**Do not** use `\n` with very large fonts in tight vertical spaces — a two-line
Impact at fontSize 130 takes ~286px of vertical space. Plan for this.

---

## 19. Running Locally

You can run the engine on your own machine for faster iteration.

### Prerequisites

```bash
# macOS
brew install ffmpeg node python3
brew install pkg-config cairo pango libpng jpeg giflib librsvg
pip3 install "kokoro>=0.9.4" "misaki[en]" soundfile numpy

# Ubuntu / Debian
sudo apt-get install ffmpeg nodejs python3 python3-pip \
  libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev \
  librsvg2-dev espeak-ng espeak-ng-data libespeak-ng-dev
pip3 install "kokoro>=0.9.4" "misaki[en]" soundfile numpy
```

### Install Node deps

```bash
cd your-repo
npm install
```

### Run

```bash
VIDEO_CONFIG=config.js NODE_OPTIONS='--max-old-space-size=6144' node engine-ci.js
```

### Quick test run

```bash
VIDEO_CONFIG=config.minimal.js node engine-ci.js
```

### Output location

```
work/your-title-2026-05-14.mp4
```

---

## 20. Troubleshooting

### "Kokoro failed, falling back to espeak-ng"

The voice will sound robotic. This means Kokoro's Python package is not
installed correctly. Fix:

1. Bump the pip cache key in `generate-video.yml`:
   change `kokoro-pip-v5` → `kokoro-pip-v6`
2. Make sure the workflow installs in this exact order:
   `numpy` → `soundfile` → `misaki[en]` → `kokoro`
3. The verify step `python3 -c "from kokoro import KPipeline; print('Kokoro OK')"` 
   must print `Kokoro OK` before the engine runs

### "Only 1 scene in the video"

The audio tracks are being mixed in parallel instead of concatenated.
Make sure you have the latest `src/encoder.js` which uses `concat` filter.

### Text is overlapping

The auto-reflow system handles this automatically but large fonts in tight
spaces may still touch. Solutions:

1. Reduce `fontSize`
2. Increase vertical spacing in your config (move elements further apart)
3. Reduce `maxWidth` so text wraps into more lines and takes up less width
4. Remove elements that are not essential

### "Error: write EPIPE"

FFmpeg closed its stdin before Node finished writing frames. This usually
means FFmpeg encountered an error early. Check the `[FFmpeg]` lines in the
log for `Error` messages. The most common cause is an invalid `-vf` filter
or an audio file that does not exist.

### Video is very dark

Vignette strength is too high. Reduce `vignetteStrength` from `0.7` to `0.45`.

### Chart labels are cut off

Keep bar chart labels to 8 characters or fewer. Use abbreviations.
For pie/donut charts, labels are placed outside the ring — make sure there
is horizontal space around the chart (do not put the chart at `x=0`).

### Background music is too loud / too quiet

Adjust `bgMusicVol`. Values: `0.1` = very quiet, `0.2` = subtle,
`0.35` = noticeable, `0.5` = equal with voice (not recommended).

### Render is very slow

Switch to `preset: 'fast'` and `crf: 26` for testing. The GitHub Actions
runner has 2 vCPUs so `medium` takes about 2× longer than `fast`.

### "Cannot find module './src/layers'"

The `src/` folder is missing or the files were not committed. Make sure
all files from `src/` are in your repo at the path `src/filename.js`.

---

*APEX Video Engine v2.0 — Built for GitHub Actions free tier*
*Full source: engine-ci.js, src/, generate-video.yml*