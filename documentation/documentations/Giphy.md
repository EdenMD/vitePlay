# Giphy Layer — Feature Documentation

Animated GIFs, stickers, and MP4 clips from the Giphy API, composited as live-animating layers inside any APEX scene.

---

## How It Works

The engine resolves `giphy` layers in **Phase -0.5** — before any frame is rendered.

```
Phase -0.5 (pre-render, runs once)
  1. Call Giphy API  →  get media URL
  2. Download GIF or MP4  →  work/giphy/<hash>/source.gif
  3. Decode frames  →  work/giphy/<hash>/frame_00000.png …
  4. Write manifest  →  work/giphy/<hash>/manifest.json
  5. Mutate layer  →  type: 'image-sequence', srcs: [...], cutEvery: 1/fps

Render loop (per frame)
  drawImageSequence() picks the correct PNG for the current scene time
  → same canvas drawImage call as any other image layer
  → frame advances at gif's native fps, loops seamlessly
```

On subsequent runs, the manifest is read from cache and steps 1–4 are skipped entirely — **zero API calls, zero downloads**.

---

## Required Secret

| Secret | Where to add |
|---|---|
| `GIPHY_API_KEY` | GitHub repo → Settings → Secrets → Actions |

Get your key at https://developers.giphy.com/dashboard. Apply for the **Production key** (free) to remove the Giphy watermark.

---

## Layer Properties

```js
{
  type: 'giphy',

  // ── Source (use one) ─────────────────────────────────────────────────
  query:        'mind blown',          // Search term — returns best match
  // id:        'xT9IgG50Lg7ezFfGQE', // Giphy GIF ID — deterministic, no randomness

  // ── Search options ────────────────────────────────────────────────────
  sticker:      false,    // true = sticker endpoint (transparent PNG frames)
  rating:       'g',      // 'g' | 'pg' | 'pg-13' | 'r'
  resultIndex:  0,        // which search result to use (0 = top result)
  preferMp4:    false,    // true = use MP4 rendition instead of GIF

  // ── Position & size ───────────────────────────────────────────────────
  x:            200,      // left edge of the layer on canvas
  y:            400,      // top edge of the layer on canvas
  width:        500,      // display width in pixels
  height:       500,      // display height in pixels
  fit:          'contain',// 'contain' | 'cover' | 'fill'

  // ── Animation ─────────────────────────────────────────────────────────
  loop:         true,     // loop GIF for full scene duration (default: true)

  // ── Compositing ───────────────────────────────────────────────────────
  opacity:      1.0,      // 0–1
  blend:        'source-over', // any canvas globalCompositeOperation
  borderRadius: 0,        // rounded corners (pixels)
}
```

---

## fit Modes

Controls how the GIF frame fills the declared `width` × `height` box — identical behaviour to the `image` layer.

| Value | Behaviour |
|---|---|
| `contain` | Fits entire GIF inside the box, preserving aspect ratio. Transparent areas show layers below. |
| `cover` | Fills the entire box, crops edges if needed. No empty space. |
| `fill` | Stretches to exactly `width` × `height`, ignores aspect ratio. |

---

## Query vs ID

**`query`** — searches Giphy and returns the top result (or `resultIndex` offset). Results can vary over time as Giphy's trending content changes.

**`id`** — fetches a specific GIF by its Giphy ID. Always returns the same GIF regardless of when you run. Use this for production videos where you want a specific clip.

To find a GIF's ID: open it on giphy.com — the ID is the string at the end of the URL, e.g. `https://giphy.com/gifs/mind-blown-xT9IgG50Lg7ezFfGQE` → ID is `xT9IgG50Lg7ezFfGQE`.

**`resultIndex`** — when using `query`, pick a different result from the same search without an extra API call. `0` is the top result, `1` is the second, up to `9`.

```js
// Same search, two different GIFs — only 1 API call fired
{ type: 'giphy', query: 'laughing', resultIndex: 0, x: 0,   y: 600, width: 540, height: 540 },
{ type: 'giphy', query: 'laughing', resultIndex: 1, x: 540, y: 600, width: 540, height: 540 },
```

---

## GIF vs Sticker vs MP4

| | GIF | Sticker | MP4 |
|---|---|---|---|
| `sticker` | `false` | `true` | `false` |
| `preferMp4` | `false` | `false` | `true` |
| Background | Opaque | **Transparent** | Opaque |
| Frame format | PNG | PNG (with alpha) | PNG |
| File size | Medium | Small | Large |
| Pre-render cost | Low | Low | Higher (FFmpeg extraction) |
| Best for | Background fills, reactions | Floating overlays on any BG | Smoother motion, longer clips |

**Stickers** are the most useful for overlaying on top of other content — their transparent background means whatever is below shows through.

---

## Loop Behaviour

`loop: true` (default) — the GIF frame index wraps with modulo, so a 1-second GIF plays 5 times in a 5-second scene with no gaps or freezing.

`loop: false` — the GIF plays once, then freezes on its last frame for the remainder of the scene.

---

## Caching

Decoded frames are cached in `work/giphy/<hash>/` and restored between GitHub Actions runs via `actions/cache@v4`. The cache key is derived from the query + rating + resultIndex (or the GIF ID), so:

- Same config → instant cache hit, no API call
- Changed query → new download and decode
- Changed `resultIndex` only → new cache entry but same API call (results are cached in memory per search)

---

## Render Speed Impact

| Stage | Cost | Notes |
|---|---|---|
| GIF download | 0.3–2s | Runs once, cached forever after |
| GIF frame decode (omggif) | 50–300ms | Depends on frame count |
| MP4 frame extraction (FFmpeg) | 2–10s | Only when `preferMp4: true` |
| Per-frame render | ~0ms | Just a `drawImage` call — same as a static image |

A video with 3 giphy layers adds roughly 2–5 seconds to the first render's pre-phase. All subsequent renders of the same config are unaffected.

---

## Usage Examples

### Sticker over gradient

```js
layers: [
  { type: 'gradient', colors: ['#0d0221', '#1a0035'], vignette: true },
  {
    type:    'giphy',
    query:   'fire',
    sticker: true,
    x: 290, y: 700,
    width: 500, height: 500,
    fit: 'contain',
  },
  { type: 'text', text: '🔥 GOING VIRAL', x: 540, y: 550, fontSize: 80 },
]
```

### Full-frame animated background

```js
layers: [
  {
    type:   'giphy',
    query:  'galaxy space',
    x: 0, y: 0,
    width: 1080, height: 1920,
    fit:  'cover',
  },
  { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
  { type: 'text', text: 'YOUR TITLE HERE', x: 540, y: 960, fontSize: 100 },
]
```

### Classic meme (top + bottom text)

```js
layers: [
  {
    type:   'giphy',
    query:  'surprised reaction',
    x: 0, y: 300,
    width: 1080, height: 1300,
    fit:  'cover',
  },
  {
    type: 'text', text: 'WHEN YOU FIND A BUG',
    x: 540, y: 160, fontSize: 96,
    fontFamily: 'Impact, Arial Black',
    color: '#fff', stroke: true, strokeColor: '#000', strokeWidth: 9,
    align: 'center', maxWidth: 1000,
  },
  {
    type: 'text', text: 'IN PRODUCTION',
    x: 540, y: 1720, fontSize: 96,
    fontFamily: 'Impact, Arial Black',
    color: '#fff', stroke: true, strokeColor: '#000', strokeWidth: 9,
    align: 'center', maxWidth: 1000,
  },
]
```

### Two stickers side by side

```js
layers: [
  { type: 'gradient', colors: ['#111', '#222'] },
  {
    type: 'giphy', query: 'thumbs up', sticker: true,
    x: 40, y: 800, width: 460, height: 460, fit: 'contain',
  },
  {
    type: 'giphy', query: 'thumbs down', sticker: true,
    x: 580, y: 800, width: 460, height: 460, fit: 'contain',
  },
  { type: 'text', text: 'LIKE', x: 270, y: 1320, fontSize: 72, color: '#57cc99', align: 'center' },
  { type: 'text', text: 'DISLIKE', x: 810, y: 1320, fontSize: 72, color: '#ff3b5c', align: 'center' },
]
```

### Specific GIF by ID (deterministic)

```js
{
  type:  'giphy',
  id:    'xT9IgG50Lg7ezFfGQE',   // exact Giphy ID — same GIF every render
  x: 0, y: 0,
  width: 1080, height: 1920,
  fit:  'cover',
}
```

---

## Test Config

A ready-to-run test config is at `config.giphy-test.js`. It covers all three major use cases in ~15 seconds:

```
Scene 1 — Sticker on gradient      (query + sticker: true + contain fit)
Scene 2 — Full-cover GIF background (query + cover fit)
Scene 3 — Meme format               (query + top/bottom Impact text)
```

Run it with:

```bash
VIDEO_CONFIG=config.giphy-test.js node engine-ci.js
```

Or in the GitHub Actions workflow dispatch input, set `config` to `config.giphy-test.js`.

---

## Graceful Degradation

If `GIPHY_API_KEY` is not set, every `giphy` layer silently becomes a plain dark `background` layer. The render completes normally — no crash, no missing frame. A warning is logged:

```
[Giphy] ✗ GIPHY_API_KEY is not set. Add it as a GitHub Actions secret.
[Giphy]   See REQUIREMENTS.md for setup instructions.
```

If a specific search returns no results or a download fails, that individual layer degrades the same way while all other layers render normally.