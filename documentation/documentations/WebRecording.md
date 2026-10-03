# APEX Engine v2.4 — Web Interaction & HTML Recording
## Complete Feature Documentation

---

## Table of Contents

1. [What Is Web Recording](#1-what-is-web-recording)
2. [How It Works Internally](#2-how-it-works-internally)
3. [Basic Layer Structure](#3-basic-layer-structure)
4. [Source Types — URL vs Local HTML](#4-source-types--url-vs-local-html)
5. [Viewport Configuration](#5-viewport-configuration)
6. [Page Load Control — waitFor and waitMs](#6-page-load-control--waitfor-and-waitms)
7. [Fit Modes — cover, contain, fill](#7-fit-modes--cover-contain-fill)
8. [Compositing Position and Size](#8-compositing-position-and-size)
9. [Cursor Styling — All 5 Styles](#9-cursor-styling--all-5-styles)
10. [Interaction System — Full Reference](#10-interaction-system--full-reference)
    - [scroll](#scroll)
    - [mouse-move](#mouse-move)
    - [click](#click)
    - [hover](#hover)
    - [type](#type)
    - [swipe](#swipe)
    - [wait](#wait)
    - [evaluate](#evaluate)
    - [focus](#focus)
    - [select](#select)
11. [Scroll Speed Reference](#11-scroll-speed-reference)
12. [Easing Functions](#12-easing-functions)
13. [Caching System](#13-caching-system)
14. [Combining With Other Layers](#14-combining-with-other-layers)
15. [Use Case Recipes](#15-use-case-recipes)
    - [Website Showcase](#recipe-1--website-showcase)
    - [Tutorial / How-To](#recipe-2--tutorial--how-to)
    - [HTML Art Animation](#recipe-3--html-art-animation)
    - [Live Data Dashboard](#recipe-4--live-data-dashboard)
    - [App Demo](#recipe-5--app-demo)
    - [Vercel / Deployed Site](#recipe-6--vercel--deployed-site)
16. [Performance and Timing](#16-performance-and-timing)
17. [What Sites Work and What Don't](#17-what-sites-work-and-what-dont)
18. [Troubleshooting](#18-troubleshooting)

---

## 1. What Is Web Recording

Web Recording is a v2.4 feature that lets you record any website or HTML
animation as a video layer and composite it directly into your scene —
exactly like an AI image or a stock photo, but instead of a static image,
it is a live recording of a real browser navigating, scrolling, clicking,
and interacting with content.

The engine launches a real headless Chromium browser inside the GitHub
Actions runner, navigates to your URL or local HTML file, executes your
scripted interactions frame-by-frame, captures every frame as a PNG, and
composites those frames into your video during render. No screen recording
software. No manual editing. All defined in your config file.

**What you can record:**

- Any public website — news sites, portfolios, tools, dashboards
- Your own deployed apps — `yourapp.vercel.app`, `yourdomain.com`
- Local HTML files committed to your repo — animations, art, infographics
- HTML pages built with Three.js, D3, p5.js, Lottie, GSAP, or plain CSS
- Multi-page navigations — click through pages as part of the recording

---

## 2. How It Works Internally

The recording runs in **Phase 0.25** — after AI image generation but before
TTS and rendering. This means all web recordings are completed before any
frame is drawn, so they are available as pre-cached PNG sequences during
the render phase.

```
Phase 0    — AI Image Generation (Pollinations)
Phase 0.25 — HTML Recording (Puppeteer)  ← HERE
Phase 0.5  — Background Music Download
Phase 1    — TTS
Phase 2    — Rendering (reads recorded frames)
Phase 3    — Encoding
```

The recording loop works like this:

1. Puppeteer launches headless Chromium
2. Viewport is set to match your config
3. Animations are paused while the page loads
4. The engine waits for your `waitFor` selector and `waitMs` delay
5. Animations are re-enabled
6. Your custom cursor is injected into the page
7. For each frame at your target FPS:
   - Any interactions due at this timestamp are fired
   - A full-page screenshot is taken
   - The browser advances time by one frame interval
8. All PNG frames are saved to `work/html-frames/`
9. A `frames.json` manifest is saved for caching
10. During render, `drawHTMLRecord()` reads the correct PNG for each frame
    and draws it onto the canvas

---

## 3. Basic Layer Structure

```js
{
    type:     'html-record',

    // REQUIRED
    src:      'https://yoursite.com',   // URL or local path
    duration: 5.0,                       // seconds to record

    // RECOMMENDED
    viewport: { width: 1080, height: 1920 },
    waitFor:  '.main-content',           // wait for this before recording
    waitMs:   500,                        // extra ms after load

    // COMPOSITING (where it appears on the canvas)
    x:        0,
    y:        0,
    width:    1080,
    height:   1920,
    fit:      'cover',

    // OPTIONAL
    fps:          30,
    cursor:       { style: 'ring', color: '#00cfff', size: 36, glow: true },
    interactions: [ ... ],
}
```

---

## 4. Source Types — URL vs Local HTML

### Live URL

Point `src` at any publicly accessible URL. The engine opens it in a real
browser — exactly as a user would see it.

```js
src: 'https://quotes.toscrape.com'
src: 'https://myapp.vercel.app'
src: 'https://myapp.vercel.app/dashboard'
src: 'https://news.ycombinator.com'
```

**Vercel sites:** Fully supported. Your engine runs on GitHub Actions and
visits the Vercel URL as a regular browser. Vercel has no reason to block
it. `yourapp.vercel.app` works exactly like any other public URL.

### Local HTML File

Commit an HTML file to your repo and point `src` at its path relative to
the repo root. The engine resolves it to a `file://` URL automatically.

```js
src: './animations/chart.html'
src: './animations/intro.html'
src: './html/countdown.html'
```

This is the most powerful use case — you write the HTML animation exactly
how you want it, commit it, and the engine records it perfectly every time.
Use this for Three.js scenes, D3 charts, CSS animations, p5.js art, Lottie
animations, or anything that requires the full web platform.

### Localhost Server

If your HTML depends on multiple files (images, fonts, JS modules) that
cannot be served via `file://`, spin up a local HTTP server in the workflow
before the engine runs and point `src` at `localhost`.

In `generate-video.yml` add a step before the generate step:
```yaml
- name: Serve HTML assets
  run: npx serve ./html-assets -p 3000 &
  # The & runs it in background. Engine starts after.
```

Then in your config:
```js
src: 'http://localhost:3000/animation.html'
```

---

## 5. Viewport Configuration

The viewport defines the size of the browser window Puppeteer opens. Set
it to match your output format so the recording fills the frame perfectly.

```js
viewport: { width: 1080, height: 1920 }  // portrait — TikTok/Reels/Shorts
viewport: { width: 1920, height: 1080 }  // landscape — YouTube
viewport: { width: 1080, height: 1080 }  // square — Instagram feed
```

If you want the recording to appear smaller than the full canvas (for
example, a phone mockup showing a website), keep the viewport at the
recording size and position it using `x`, `y`, `width`, `height` on the
layer itself. The `fit` mode handles the scaling.

**Default:** `{ width: 1080, height: 1920 }` if not specified.

---

## 6. Page Load Control — waitFor and waitMs

Sites load asynchronously. Without waiting, the engine may start recording
before the content has rendered. Two properties control this:

### waitFor

A CSS selector. The engine waits for this element to appear in the DOM
before recording starts. Use the most important visible element on the page.

```js
waitFor: '.quote'           // wait for quote cards
waitFor: '#app'             // wait for React app to mount
waitFor: '.chart-container' // wait for chart to render
waitFor: 'canvas'           // wait for canvas element
waitFor: 'h1'               // wait for any heading
```

If the selector is not found within 10 seconds, the engine logs a warning
and continues anyway — it never blocks indefinitely.

### waitMs

Additional milliseconds to wait after `waitFor` is satisfied. Use this to
allow CSS animations to initialise, fonts to load, or JavaScript to finish
setting up state.

```js
waitMs: 300    // minimal — good for simple pages
waitMs: 800    // recommended — allows fonts and transitions
waitMs: 1500   // heavy pages — SPAs, Three.js scenes
waitMs: 3000   // very heavy — pages that load remote data
```

**Default:** `300ms`

### Combined example

```js
waitFor: '#chart-ready',
waitMs:  1000,
```

This waits for an element with id `chart-ready` to appear (your animation
can add this element when it is done initialising), then waits an extra
second before starting to record.

---

## 7. Fit Modes — cover, contain, fill

Controls how the recorded browser content scales to fit your layer's
`width` and `height`.

### cover (default)

Scales the recording up to fill the layer completely. Content may be
cropped on the sides or top/bottom. Use for full-bleed backgrounds.

```js
fit: 'cover'
// viewport: 1080×1920, layer: 1080×1920 → no cropping
// viewport: 1920×1080, layer: 1080×1920 → sides cropped
```

### contain

Scales the recording down to fit entirely within the layer. Black bars
appear on sides or top/bottom if aspect ratios differ. Use when you need
to see the entire page.

```js
fit: 'contain'
```

### fill

Stretches the recording to exactly fill the layer — no cropping, no bars,
but aspect ratio may distort. Use only when viewport and layer are the
same dimensions.

```js
fit: 'fill'
```

---

## 8. Compositing Position and Size

The `html-record` layer is composited exactly like any other layer. Use
`x`, `y`, `width`, `height` to position and size it on the canvas.

### Full background

```js
x: 0, y: 0, width: 1080, height: 1920, fit: 'cover'
```

### Half screen (top half)

```js
x: 0, y: 0, width: 1080, height: 960, fit: 'cover'
```

### Picture-in-picture (bottom right corner)

```js
x: 680, y: 1400, width: 380, height: 460, fit: 'contain'
```

### Phone mockup inset

Record at phone dimensions, display inside a `mockup` layer:
```js
// Layer 1 — the recording at phone size
{ type: 'html-record', src: '...', viewport: { width: 340, height: 600 },
  x: 370, y: 660, width: 340, height: 600, fit: 'fill' }

// Layer 2 — phone mockup frame drawn over it
{ type: 'mockup', mockupType: 'phone', x: 540, y: 960, width: 340, height: 620 }
```

---

## 9. Cursor Styling — All 5 Styles

The engine injects a fully custom cursor into the recorded page. The
native OS cursor is hidden and replaced with your styled element. The
cursor responds to all mouse events — it moves, shrinks on click, and
follows the `mouse-move` interaction precisely.

```js
cursor: {
    style: 'ring',       // see styles below
    color: '#00cfff',    // any hex or rgba
    size:  36,           // diameter in pixels
    glow:  true,         // neon glow effect
}
```

Set `cursor: false` to disable entirely (no cursor shown in recording).
If `cursor` is not set at all, defaults to a glowing red dot.

### dot

Filled solid circle. Clean and simple. Good for tutorials.

```js
cursor: { style: 'dot', color: '#ff3b3b', size: 24, glow: true }
```

Appearance: ● (filled, glowing)

### circle

Hollow ring, no fill. Minimal. Good for clean design recordings.

```js
cursor: { style: 'circle', color: '#ffffff', size: 32, glow: false }
```

Appearance: ○ (border only)

### ring

Double ring — hollow outer ring with a small filled dot in the centre.
Professional look. Recommended for most recordings.

```js
cursor: { style: 'ring', color: '#00cfff', size: 36, glow: true }
```

Appearance: ⊙ (ring with center dot)

### crosshair

Full crosshair lines extending to the size boundary. Good for precision
demonstrations or a tech/targeting aesthetic.

```js
cursor: { style: 'crosshair', color: '#ff6600', size: 44, glow: true }
```

Appearance: ✛ (full cross lines)

### spotlight

Large radial gradient glow — a soft circle of light that follows the
cursor. Dramatic effect for cinematic recordings. Set `size` large (60–100)
for best results. The actual spotlight is 3× the `size` value.

```js
cursor: { style: 'spotlight', color: '#ffffff', size: 70, glow: false }
```

Appearance: soft glowing area around the cursor position

### Click behaviour

All cursor styles shrink to 75% scale on mousedown and spring back on
mouseup. This makes clicks visually clear in the recording — viewers can
see exactly when and where a click happens.

---

## 10. Interaction System — Full Reference

Interactions are defined as an array on the layer. Each interaction fires
at its `at` timestamp (seconds from the start of recording). They are
executed in order and are frame-accurate.

```js
interactions: [
    { at: 0.5,  action: 'mouse-move', x: 540, y: 400, speed: 200 },
    { at: 1.5,  action: 'scroll',     y: 600, speed: 80, easing: 'ease-in-out' },
    { at: 4.0,  action: 'click',      selector: '#btn' },
    { at: 6.0,  action: 'wait',       duration: 1.0 },
]
```

**Important:** Always add a `mouse-move` before a `click` or `hover` so
viewers can see the cursor travel to the target element naturally.

---

### scroll

Smoothly scrolls the page to a target Y (vertical) and/or X (horizontal)
position. Speed is pixels per second — lower is slower.

```js
{
    at:     1.5,
    action: 'scroll',
    y:      600,           // target vertical scroll position in px
    x:      0,             // target horizontal scroll position (optional)
    speed:  80,            // px/s — see speed reference below
    easing: 'ease-in-out', // animation curve — see easing section
}
```

`y` and `x` are **absolute positions** from the top/left of the page —
not relative amounts. To scroll 600px down from the current position you
need to know the current position and add 600.

**To scroll back to the top:**
```js
{ at: 8.0, action: 'scroll', y: 0, speed: 150, easing: 'ease-out' }
```

**To scroll horizontally:**
```js
{ at: 3.0, action: 'scroll', x: 400, y: 0, speed: 100 }
```

---

### mouse-move

Moves the cursor smoothly from its current position to `x, y`. Speed
is pixels per second. Always eases in-out automatically.

```js
{
    at:     0.5,
    action: 'mouse-move',
    x:      540,    // target X position in px (from left)
    y:      400,    // target Y position in px (from top)
    speed:  200,    // px/s — default 400
}
```

Use this to guide the viewer's eye before every click or hover. Without
`mouse-move`, clicks happen at whatever position the cursor was last moved
to — which may be off-screen.

**Coordinate reference for portrait 1080×1920:**
```
Top-center:     x: 540,  y: 100
Middle-center:  x: 540,  y: 960
Bottom-center:  x: 540,  y: 1800
Left side:      x: 100,  y: 960
Right side:     x: 980,  y: 960
```

---

### click

Clicks on a CSS selector. The element must exist and be visible at the
time the click fires. Optionally set a `delay` in ms between mousedown
and mouseup for a more natural feel.

```js
{
    at:       4.0,
    action:   'click',
    selector: '#submit-btn',
    delay:    50,              // ms between mousedown/mouseup (optional)
}
```

**Always pair with mouse-move first:**
```js
{ at: 3.5, action: 'mouse-move', x: 540, y: 1700, speed: 180 },
{ at: 4.0, action: 'click',      selector: '.next a' },
```

**Common selectors:**
```js
selector: '.next a'              // Next page link
selector: '#search-btn'          // Button by ID
selector: 'button[type="submit"]' // Submit button
selector: 'nav a:first-child'    // First nav link
selector: '.tab:nth-child(2)'    // Second tab
```

---

### hover

Moves the browser's pointer to the centre of the element, triggering
CSS `:hover` states and `mouseenter` events. Use this to show tooltips,
dropdown menus, or hover animations.

```js
{
    at:       3.0,
    action:   'hover',
    selector: '.menu-item:nth-child(3)',
}
```

**Note:** `hover` moves the Puppeteer pointer but does NOT update the
injected cursor element's visual position. Always chain a `mouse-move`
before `hover` to move the visible cursor to the element first.

```js
{ at: 2.8, action: 'mouse-move', x: 300, y: 500, speed: 200 },
{ at: 3.0, action: 'hover',      selector: '.dropdown-trigger' },
{ at: 3.5, action: 'wait',       duration: 1.0 },  // let dropdown show
```

---

### type

Clicks an input field and types text into it character by character.
`speed` is milliseconds between characters — lower is faster.

```js
{
    at:       5.0,
    action:   'type',
    selector: '#search-input',
    text:     'apex engine',
    speed:    80,    // ms per character — default 50
}
```

Speed reference:
- `30ms` — fast typist
- `80ms` — natural human typing speed (recommended for video)
- `150ms` — slow, deliberate
- `200ms+` — hunt-and-peck style

**Full search interaction sequence:**
```js
{ at: 4.5, action: 'mouse-move', x: 540, y: 300, speed: 200 },
{ at: 5.0, action: 'click',      selector: '#search-input' },
{ at: 5.3, action: 'type',       selector: '#search-input', text: 'dark psychology', speed: 80 },
{ at: 7.5, action: 'click',      selector: '#search-btn' },
```

---

### swipe

Simulates a touch swipe gesture — useful for mobile-style pages, carousels,
sliders, and swipe-based navigation. Dispatches real `TouchEvent` events.

```js
{
    at:       6.0,
    action:   'swipe',
    x1:       540,    // start X
    y1:       1400,   // start Y (swipe starts here)
    x2:       540,    // end X
    y2:       400,    // end Y (swipe ends here)
    duration: 0.6,    // seconds for the swipe to complete
}
```

**Swipe directions:**
```js
// Swipe up (scroll down on mobile)
{ x1: 540, y1: 1400, x2: 540, y2: 400, duration: 0.5 }

// Swipe down (scroll up on mobile)
{ x1: 540, y1: 400, x2: 540, y2: 1400, duration: 0.5 }

// Swipe left (next slide)
{ x1: 900, y1: 960, x2: 180, y2: 960, duration: 0.4 }

// Swipe right (previous slide)
{ x1: 180, y1: 960, x2: 900, y2: 960, duration: 0.4 }
```

`duration` controls swipe speed — `0.3` is fast, `0.8` is slow and
deliberate. For carousel slides, `0.4` feels natural.

---

### wait

Pauses interaction execution for a set duration. Use this to let
animations play, pages load after navigation, or content settle after
a click.

```js
{
    at:       7.0,
    action:   'wait',
    duration: 1.5,    // seconds to wait
}
```

**After a click that navigates to a new page:**
```js
{ at: 5.0, action: 'click', selector: '.next a' },
{ at: 5.1, action: 'wait',  duration: 2.0 },    // wait for new page to load
{ at: 7.2, action: 'scroll', y: 300, speed: 100 },
```

**After opening a dropdown:**
```js
{ at: 3.0, action: 'hover', selector: '.nav-menu' },
{ at: 3.1, action: 'wait',  duration: 0.5 },     // let dropdown animate open
```

---

### evaluate

Runs arbitrary JavaScript directly inside the page. This is the most
powerful interaction — anything JavaScript can do in a browser, `evaluate`
can do.

```js
{
    at:     2.0,
    action: 'evaluate',
    fn:     'document.querySelector(".chart").classList.add("animate")',
}
```

**Add a CSS class to trigger an animation:**
```js
{ at: 1.0, action: 'evaluate',
  fn: 'document.getElementById("graph").classList.add("visible")' }
```

**Change element text:**
```js
{ at: 3.0, action: 'evaluate',
  fn: 'document.querySelector("h1").textContent = "Updated Title"' }
```

**Trigger a custom event your animation listens for:**
```js
{ at: 2.0, action: 'evaluate',
  fn: 'window.dispatchEvent(new CustomEvent("apex-start"))' }
```

**Change CSS variables to retheme the page live:**
```js
{ at: 1.5, action: 'evaluate',
  fn: 'document.documentElement.style.setProperty("--accent", "#ff3b3b")' }
```

**Scroll using JavaScript (alternative to scroll action):**
```js
{ at: 2.0, action: 'evaluate',
  fn: 'window.scrollTo({ top: 800, behavior: "smooth" })' }
```

**Remove an element you don't want in the recording:**
```js
{ at: 0.1, action: 'evaluate',
  fn: 'document.querySelector(".cookie-banner")?.remove()' }
```

---

### focus

Focuses an input or interactive element without clicking it. Triggers
`:focus` CSS states and `focus` events. Useful for showing focused states
or preparing for `type`.

```js
{
    at:       4.0,
    action:   'focus',
    selector: '#email-input',
}
```

---

### select

Selects an option in a `<select>` dropdown element.

```js
{
    at:       5.0,
    action:   'select',
    selector: '#country-select',
    value:    'ZW',    // the option value attribute
}
```

---

## 11. Scroll Speed Reference

| Speed | Feel | Best for |
|---|---|---|
| `40` | Extremely slow, meditative | Art, atmosphere |
| `60` | Very slow | Reading-pace content |
| `80` | Slow, cinematic | **Default recommendation** |
| `120` | Gentle | Most tutorial use |
| `200` | Normal human scroll | General navigation |
| `300` | Slightly fast | Quick overview |
| `500` | Fast | Skimming |
| `800+` | Very fast | Quick cuts |

For commercial video and tutorials, **80–150** is the sweet spot. Viewers
need to read the content as it scrolls. Anything above 250 feels rushed.

---

## 12. Easing Functions

Easing controls the acceleration curve of scroll and mouse-move
interactions. Always set on the `scroll` action.

```js
{ action: 'scroll', y: 800, speed: 100, easing: 'ease-in-out' }
```

| Easing | Behaviour | Best for |
|---|---|---|
| `ease-in-out` | Starts slow, fast middle, ends slow | **Default — most natural** |
| `ease-in` | Starts slow, accelerates to end | Beginning of a section |
| `ease-out` | Fast start, decelerates to stop | Arriving at a destination |
| `linear` | Constant speed throughout | Technical/mechanical feel |

For cinematic video, always use `ease-in-out`. `linear` scrolling looks
mechanical and unnatural.

---

## 13. Caching System

Recorded frames are cached in `work/html-frames/` and persisted between
GitHub Actions runs via the `actions/cache` step in the workflow.

**How it works:**

When the engine records a layer it saves a `frames.json` manifest file
alongside the PNG frames. On the next run, before launching Chromium, the
engine checks for this manifest. If it exists and the first frame PNG is
still present, the recording is skipped entirely and the cached frames are
reused.

The cache key in the workflow is:
```
html-frames-{{ runner.os }}-{{ hashFiles('config.js') }}-v1
```

This means:
- If `config.js` does not change between runs → cache hit, no re-recording
- If you change any `html-record` layer in `config.js` → cache miss, re-records
- To force a re-record without changing the config, bump the key to `-v2`

**Recording time is only paid once per unique config.**

---

## 14. Combining With Other Layers

`html-record` is a standard layer and can be combined with any other layer
type. The recorded content is drawn first (or wherever you place it in the
layer order), and other layers composite on top.

### Full background with overlays and captions

```js
layers: [
    // Recording fills the entire background
    { type: 'html-record', src: 'https://site.com', duration: 10,
      x: 0, y: 0, width: 1080, height: 1920, fit: 'cover', ... },

    // Dark overlay for text readability
    { type: 'overlay', color: 'rgba(0,0,0,0.25)' },

    // Neon label at top (hookLayer visible from frame 0)
    { type: 'neon-text', text: '🌐 LIVE DEMO',
      x: 540, y: 140, fontSize: 42, color: '#00cfff',
      hookLayer: true, exitAt: 999 },

    // Progress bar at bottom
    { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 7,
      color: '#00cfff', color2: '#0044ff',
      trackColor: 'rgba(255,255,255,0.08)' },
]
// Plus captions: { style: 'highlight', ... } on the scene for spoken text
```

### Picture-in-picture — website in corner, AI image background

```js
layers: [
    // AI image fills background
    { type: 'ai-image', prompt: 'dark tech office anime', model: 'meinamix',
      steps: 8, genWidth: 512, genHeight: 512,
      x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },

    { type: 'overlay', color: 'rgba(0,0,0,0.40)' },

    // Website recording in bottom right corner
    { type: 'html-record', src: 'https://yourapp.vercel.app',
      duration: 8, viewport: { width: 400, height: 500 },
      x: 620, y: 1200, width: 420, height: 500, fit: 'cover',
      cursor: { style: 'ring', color: '#ffffff', size: 24, glow: true },
      interactions: [ ... ] },

    // Phone frame around the PIP
    { type: 'mockup', mockupType: 'phone', x: 830, y: 1450,
      width: 400, height: 520 },
]
```

### HTML art as background, canvas layers on top

```js
layers: [
    // Three.js / p5.js / CSS animation recorded at full size
    { type: 'html-record', src: './animations/particles.html',
      duration: 12, viewport: { width: 1080, height: 1920 },
      x: 0, y: 0, width: 1080, height: 1920, fit: 'fill',
      cursor: false,    // no cursor for pure art
      waitFor: 'canvas', waitMs: 1500 },

    // Canvas layers composite on top of the art
    { type: 'neon-text', text: 'YOUR TITLE',
      x: 540, y: 400, fontSize: 96, color: '#ffffff', flicker: true },

    { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 7 },
]
```

---

## 15. Use Case Recipes

---

### Recipe 1 — Website Showcase

Show off a website with slow cinematic scrolling and a branded cursor.

```js
{
    tts: { text: 'This is our new platform, built for creators.', pauseAfter: 0.5 },
    captions: { style: 'highlight', position: 'bottom', fontSize: 56,
                color: '#fff', highlightColor: '#00cfff',
                bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 3 },
    layers: [
        {
            type:     'html-record',
            src:      'https://yourapp.vercel.app',
            duration: 14,
            viewport: { width: 1080, height: 1920 },
            x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
            waitFor:  'main', waitMs: 1000,
            cursor:   { style: 'spotlight', color: '#00cfff', size: 60, glow: false },
            interactions: [
                { at: 1.0,  action: 'mouse-move', x: 540, y: 500, speed: 150 },
                { at: 2.0,  action: 'scroll',     y: 800,  speed: 80,  easing: 'ease-in-out' },
                { at: 6.0,  action: 'scroll',     y: 1800, speed: 90,  easing: 'ease-in-out' },
                { at: 10.0, action: 'scroll',     y: 0,    speed: 200, easing: 'ease-out' },
            ],
        },
        { type: 'overlay', color: 'rgba(0,0,0,0.18)' },
        { type: 'neon-text', text: '🌐 LIVE DEMO',
          x: 540, y: 140, fontSize: 40, color: '#00cfff',
          hookLayer: true, exitAt: 999 },
        { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 7,
          color: '#00cfff', color2: '#0044ff',
          trackColor: 'rgba(255,255,255,0.08)' },
    ],
}
```

---

### Recipe 2 — Tutorial / How-To

Walk viewers through using a website step by step. Move the cursor visibly
to each element before interacting. Type at human speed.

```js
{
    tts: { text: 'Go to the search bar, type your topic, and click Search.', pauseAfter: 0.5 },
    captions: { style: 'typewriter', position: 'bottom', fontSize: 54,
                color: '#ffffff', bgColor: 'rgba(0,0,0,0.65)', wordsPerChunk: 4 },
    layers: [
        {
            type:     'html-record',
            src:      'https://yoursite.com',
            duration: 16,
            viewport: { width: 1080, height: 1920 },
            x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
            waitFor:  '#search', waitMs: 800,
            cursor:   { style: 'ring', color: '#ffdd00', size: 32, glow: true },
            interactions: [
                // Establish cursor position
                { at: 0.5,  action: 'mouse-move', x: 540,  y: 960,  speed: 200 },
                // Move to search bar slowly
                { at: 1.5,  action: 'mouse-move', x: 540,  y: 320,  speed: 150 },
                // Click search bar
                { at: 2.5,  action: 'click',      selector: '#search' },
                // Type slowly so viewers can read
                { at: 3.0,  action: 'type',        selector: '#search',
                             text: 'dark psychology', speed: 100 },
                // Pause so viewers read what was typed
                { at: 6.0,  action: 'wait',        duration: 1.0 },
                // Move cursor to search button
                { at: 7.0,  action: 'mouse-move',  x: 800, y: 320, speed: 180 },
                // Click search
                { at: 7.8,  action: 'click',       selector: '#search-btn' },
                // Wait for results page
                { at: 8.0,  action: 'wait',        duration: 2.0 },
                // Scroll through results slowly
                { at: 10.0, action: 'scroll',      y: 600, speed: 80, easing: 'ease-in-out' },
            ],
        },
        { type: 'overlay', color: 'rgba(0,0,0,0.20)' },
        { type: 'neon-text', text: '📖 TUTORIAL',
          x: 540, y: 140, fontSize: 40, color: '#ffdd00',
          hookLayer: true, exitAt: 999 },
        { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 7,
          color: '#ffdd00', color2: '#ff8800',
          trackColor: 'rgba(255,255,255,0.08)' },
    ],
}
```

---

### Recipe 3 — HTML Art Animation

Record a custom HTML/CSS/JS animation as a full scene background.
No cursor needed. No interactions — just let it play.

```js
// Your file: ./animations/galaxy.html
// A Three.js galaxy that rotates and expands over 10 seconds
{
    tts: { text: 'Five hundred billion stars. One hundred billion galaxies. And somehow, you ended up here.', pauseAfter: 0.6 },
    captions: { style: 'fade', position: 'bottom', fontSize: 62,
                color: '#ffffff', bgColor: 'rgba(0,0,0,0.45)', wordsPerChunk: 4 },
    layers: [
        {
            type:     'html-record',
            src:      './animations/galaxy.html',
            duration: 14,
            viewport: { width: 1080, height: 1920 },
            x: 0, y: 0, width: 1080, height: 1920, fit: 'fill',
            waitFor:  'canvas',
            waitMs:   2000,       // Three.js needs time to initialise
            cursor:   false,      // no cursor — this is art
            interactions: [],     // no interactions — let animation play
        },
        { type: 'overlay', color: 'rgba(0,0,0,0.15)' },
        { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 7,
          color: '#ffffff', color2: '#8888ff',
          trackColor: 'rgba(255,255,255,0.08)' },
    ],
}
```

---

### Recipe 4 — Live Data Dashboard

Record a real-time data dashboard. The data shown is whatever was live
when the workflow ran.

```js
{
    tts: { text: 'These are the real numbers, pulled live this morning.', pauseAfter: 0.4 },
    captions: { style: 'highlight', position: 'bottom', fontSize: 54,
                color: '#fff', highlightColor: '#00ff88', wordsPerChunk: 3,
                bgColor: 'rgba(0,0,0,0.60)' },
    layers: [
        {
            type:     'html-record',
            src:      'https://yourdashboard.vercel.app',
            duration: 12,
            viewport: { width: 1080, height: 1920 },
            x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
            waitFor:  '.dashboard-loaded',
            waitMs:   2000,
            cursor:   { style: 'dot', color: '#00ff88', size: 20, glow: true },
            interactions: [
                // Slowly pan across the dashboard
                { at: 1.0,  action: 'mouse-move', x: 200,  y: 400, speed: 100 },
                { at: 3.0,  action: 'scroll',     y: 600,  speed: 70, easing: 'ease-in-out' },
                { at: 7.0,  action: 'scroll',     y: 1200, speed: 80, easing: 'ease-in-out' },
                { at: 10.0, action: 'scroll',     y: 0,    speed: 200, easing: 'ease-out' },
            ],
        },
        { type: 'overlay', color: 'rgba(0,0,0,0.22)' },
        { type: 'neon-text', text: '📊 LIVE DATA',
          x: 540, y: 140, fontSize: 40, color: '#00ff88',
          hookLayer: true, exitAt: 999 },
        { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 7,
          color: '#00ff88', color2: '#0088ff',
          trackColor: 'rgba(255,255,255,0.08)' },
    ],
}
```

---

### Recipe 5 — App Demo

Show a mobile app or web app being used. Combine with `mockup` layer for
a phone frame around the recording.

```js
{
    tts: { text: 'Here is how to create your first post in under thirty seconds.', pauseAfter: 0.4 },
    captions: { style: 'pop', position: 'bottom', fontSize: 52,
                color: '#ffffff', bgColor: 'rgba(0,0,0,0.55)', wordsPerChunk: 4 },
    layers: [
        // Dark background behind the phone mockup
        { type: 'gradient', gradientType: 'radial',
          colors: ['#0a0a1a', '#050510', '#000000'] },

        // App recording inside phone mockup dimensions
        {
            type:     'html-record',
            src:      'https://myapp.vercel.app',
            duration: 12,
            viewport: { width: 390, height: 844 },      // iPhone 14 dimensions
            x:        345, y: 538,                       // centered in canvas
            width:    390, height: 844,
            fit:      'fill',
            waitFor:  '#app-ready',
            waitMs:   1200,
            cursor:   { style: 'dot', color: '#ff3b3b', size: 18, glow: true },
            interactions: [
                { at: 1.0,  action: 'mouse-move', x: 195, y: 422, speed: 200 },
                { at: 2.0,  action: 'click',      selector: '.create-post-btn' },
                { at: 2.5,  action: 'wait',       duration: 0.8 },
                { at: 3.3,  action: 'type',        selector: '#post-input',
                             text: 'Dark psychology tip number one', speed: 90 },
                { at: 6.5,  action: 'mouse-move', x: 300, y: 700, speed: 180 },
                { at: 7.2,  action: 'click',      selector: '.publish-btn' },
                { at: 7.5,  action: 'wait',       duration: 1.5 },
            ],
        },

        // Phone frame over the recording
        { type: 'mockup', mockupType: 'phone',
          x: 540, y: 960, width: 420, height: 880,
          frameColor: '#1a1a2e', animDur: 0 },

        { type: 'progress-bar', x: 54, y: 1855, width: 972, height: 7,
          color: '#ff3b3b', color2: '#ff8800',
          trackColor: 'rgba(255,255,255,0.08)' },
    ],
}
```

---

### Recipe 6 — Vercel / Deployed Site

Works exactly like any other URL. No special setup needed.

```js
{
    type:     'html-record',
    src:      'https://king.vercel.app',
    duration: 10,
    viewport: { width: 1080, height: 1920 },
    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
    waitFor:  'main',
    waitMs:   1500,    // Vercel cold starts may need extra time
    cursor:   { style: 'ring', color: '#ffffff', size: 32, glow: true },
    interactions: [ ... ],
}
```

If the Vercel app has a cold start (first request takes longer), increase
`waitMs` to `2000–3000` to give it time to wake up before recording starts.

---

## 16. Performance and Timing

Recording is the most time-intensive phase in the engine. Plan accordingly.

**Time per second of recording:**
- Simple static page: ~3–5s of capture time per 1s of video
- Page with CSS animations: ~5–8s per 1s of video
- Page with heavy JS (Three.js, D3): ~8–15s per 1s of video

**Practical estimates for GitHub Actions (2 vCPU):**

| Recording duration | Page complexity | Approximate capture time |
|---|---|---|
| 5 seconds | Simple | ~25s |
| 10 seconds | Simple | ~50s |
| 10 seconds | Animated (CSS/JS) | ~80–120s |
| 15 seconds | Heavy (Three.js) | ~3–5 min |

**Recommendations:**

- Keep `html-record` scenes under 15 seconds for fast CI runs
- Use the cache — once recorded, subsequent runs reuse frames instantly
- Multiple `html-record` layers in the same video run sequentially —
  two 10-second recordings = double the capture time
- For long animations, pre-record them as MP4 and use `image-sequence`

---

## 17. What Sites Work and What Don't

### Works well ✅

- Your own sites and apps on Vercel, Netlify, GitHub Pages, or any host
- Bot-friendly sandboxes: `quotes.toscrape.com`, `books.toscrape.com`
- Documentation sites, landing pages, portfolios
- Any site without bot detection
- Local HTML files (always works)

### May have issues ⚠️

- Sites with aggressive bot detection (Cloudflare challenge)
- Sites requiring JavaScript challenges before rendering content
- Sites with lazy loading that only triggers on real scroll events
  (use `evaluate` to force-load content instead of `scroll`)
- Pages that poll external APIs (may timeout on `networkidle0`)

### Will not work ❌

- Login-protected pages (without injecting auth cookies)
- Sites blocked by Cloudflare or similar WAFs
- Pages that only render on specific devices or screen sizes
  (set the right `viewport` to match)

### Fixing bot-blocked sites

For sites that block headless Chromium, add this to your `evaluate`
interaction at `at: 0` to help pass basic detection:

```js
{ at: 0.0, action: 'evaluate', fn: `
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
` }
```

This masks the `navigator.webdriver` flag that basic bot detectors check.
It does not bypass sophisticated detectors like Cloudflare Turnstile.

---

## 18. Troubleshooting

### Dark black scene instead of recording

Puppeteer is not installed. Check that `puppeteer` is in your
`npm install` step in `generate-video.yml`:
```yaml
run: npm install --save canvas fluent-ffmpeg fs-extra omggif puppeteer
```

### Page loads but content is blank / white

Increase `waitMs` — the page needs more time to render.
Also check `waitFor` points to an element that actually exists.

### Recording shows loading spinner only

The site is making network requests that never complete in headless mode.
Change `waitUntil` behaviour by using `waitFor` to target content instead
of waiting for network idle. If the site uses long-polling, the
`networkidle0` wait will timeout — the engine falls back to
`domcontentloaded` which may fire before content renders.
Increase `waitMs` to compensate.

### Interactions not firing at the right time

All `at` times are relative to the start of the recording, not the scene.
If the recording `duration` is 10s but the scene TTS is 15s, interactions
fire correctly within the 10s recording window regardless of scene length.

### Scroll does not reach the target position

Some sites prevent scrolling via JavaScript or use virtual scrollers
(like React-Virtualized). Use `evaluate` instead:
```js
{ at: 2.0, action: 'evaluate',
  fn: 'window.scrollTo({ top: 800, behavior: "smooth" })' }
```

### Click does nothing

The element may not be visible or in the DOM at the time of the click.
Add a `wait` before the click to let content load, or use `evaluate`
to trigger the action directly:
```js
{ at: 4.0, action: 'evaluate',
  fn: 'document.querySelector(".btn").click()' }
```

### Cursor not visible in recording

Check that `cursor` is not set to `false`. Also confirm the `mouse-move`
interaction fires early (at `t=0.5`) so the cursor is positioned within
the viewport from the start.

### "Puppeteer not available" in logs

See the dark scene troubleshooting above. Also check `node_modules/puppeteer`
exists in your repo after the install step. The `[HTMLRec] Puppeteer loaded ✓`
message should appear near the top of the generate step logs if it installed
correctly.

---

*APEX Engine v2.4 — Web Interaction & HTML Recording*
*Module: `src/html-record.js`*