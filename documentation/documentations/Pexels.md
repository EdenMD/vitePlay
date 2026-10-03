# Pexels Video Layer — Feature Documentation

Real shot stock footage (not GIFs, not AI-generated) from the Pexels Video API, composited as a layer inside any APEX scene — same render path Giphy uses under the hood.

---

## How It Works

The engine resolves `pexels-video` layers in **Phase 1.1** — right after TTS (and right after the generic `video` layer resolution), one step before Giphy, before any frame is rendered. It runs after TTS specifically so it knows the scene's real, narration-computed duration rather than guessing one (see `maxDuration` below).

```
Phase 1.1 (after TTS, pre-render, runs once)
  1. Search api.pexels.com/videos/search for the query (or fetch a specific
     video by id)
  2. Pick the best video_files rendition for the requested orientation,
     closest to 1080p so frame extraction stays fast
  3. Download the MP4 → work/pexels-video/<hash>/source.mp4
  4. Trim to `maxDuration` seconds (default: the scene's actual narration-
     computed duration) and extract PNG frames with FFmpeg at `fps`
     (default: source fps, capped 30)
  5. Mutate layer → type: 'image-sequence', srcs: [...], cutEvery: 1/fps

Render loop (per frame)
  drawImageSequence() picks the correct PNG for the current scene time
  → same canvas drawImage call as any other image layer
  → frame advances at the extracted fps, loops seamlessly if loop: true
```

Pexels clips are real shot video, not looping GIFs — that's why they get trimmed rather than played in full. Documentary b-roll on Pexels commonly runs 10–40 seconds at 24–60fps; extracting the whole thing would produce thousands of PNGs per clip for no benefit, since APEX scene lengths are driven by narration/TTS length (usually a few seconds) anyway. `maxDuration` now defaults to that real scene length automatically (resolved after TTS, not guessed beforehand) — no need to hand-tune it per scene. `loop: true` (default) still applies as a safety net for any rounding/edge case, and is both faster to extract and visually seamless for narration-paced edits.

---

## Required Secret

| Secret | Where to add |
|---|---|
| `PEXELS_API_KEY` | GitHub repo → Settings → Secrets → Actions |

Get a free key at https://www.pexels.com/api — 200 requests/hour, 20,000/month, no cost tier above that (rate-limited, not paywalled).

**Licensing:** all Pexels photos and videos are under the Pexels License — free for personal *and* commercial use, no attribution legally required (crediting the creator is appreciated, not mandatory). Pexels does **not** indemnify against third-party claims, so this isn't legal advice — review https://www.pexels.com/license before anything high-stakes (paid sponsorships, disputed footage, etc.).

---

## ⚠️ Accuracy — What You Will and Won't Actually Get

This is the part worth reading before building a scene around it, especially for a history/documentary channel.

**Pexels is entirely user-submitted contemporary stock footage.** Every clip was shot by a real videographer, recently, for stock libraries — weddings, drone shots, office b-roll, nature, everyday life. It is **not** an archive.

**What it's genuinely good for:**
- Generic nature/landscape b-roll (ocean, forest, mountains, weather)
- City/urban establishing shots, traffic, crowds
- Abstract textures, technology close-ups, business/office footage
- Lifestyle footage (people walking, working, eating, exercising)
- Animals, food, travel-style footage

**What it does NOT have, no matter how the query is phrased:**
- **Real archival/historical footage** — no actual WWII footage, no ancient Rome, no footage of any specific historical event or figure. A query like `"ancient rome"` or `"1940s soldiers"` will return *modern* reenactment-adjacent or thematically-close stock clips at best (people in vaguely old-looking settings, generic ruins, contemporary actors) — never real archival material. If a history channel needs real archival footage, that's a different source entirely (public domain archives, Internet Archive, National Archives — none of which this integration touches).
- **Named people, celebrities, or branded/copyrighted content** — Pexels' own submission terms exclude this.
- **Breaking news or event-specific footage** — it's not a news wire.
- **Anything hyper-specific** — "a red 1967 Mustang parked outside a diner in Ohio" will return generic car/diner footage at best, not that scene.

**Search accuracy in practice:** Pexels' search is keyword/tag-based, not semantic — a query like `"stormy ocean waves"` reliably returns relevant results because those are common, well-tagged stock subjects. A query like `"gladiators fighting in the colosseum"` will return whatever loosely matches individual words (colosseum tourism shots, unrelated fighting/sports clips) rather than anything resembling the actual query — stock footage libraries are built for corporate/marketing use cases, not narrative reenactment. **Always sanity-check the first few results for a new query** (or pin an exact clip with `id` once you've found one that works — see below) rather than trusting a descriptive query to return what you pictured.

**Orientation tagging is approximate.** The `orientation` filter uses Pexels' own metadata tag, which is occasionally wrong or missing for a clip (e.g. a clip tagged `landscape` that's actually closer to square). `fit: 'cover'` masks most of this by cropping to fill the box regardless of the source aspect ratio, so it's rarely visible in the final render — but it means the orientation filter narrows the *search*, not a guarantee about the *downloaded file's* exact dimensions.

**Bottom line for a documentary/history niche:** use Pexels for connective b-roll — cutaways, mood shots, generic scene-setting — between your actual narration and any real archival images/photos you source elsewhere. Don't rely on it to visually represent a specific historical claim.

---

## Layer Properties

```js
{
  type: 'pexels-video',

  // ── Source (use one) ─────────────────────────────────────────────────
  query:        'stormy ocean waves',   // Search term — returns best match
  // id:        855564,                // Exact Pexels video ID — deterministic, no search

  // ── Search options ────────────────────────────────────────────────────
  orientation:  'landscape',  // 'landscape' | 'portrait' | 'square'
  minWidth:     1280,         // minimum source width to accept
  resultIndex:  0,            // which search result to use (0 = top result)

  // ── Trim / extraction ─────────────────────────────────────────────────
  maxDuration:  6,            // seconds of the clip to extract (default: scene's real duration)
  fps:          30,           // extraction frame rate, capped at 30 (default: source fps)
  loop:         true,         // loop the trimmed clip for the full scene (default: true)

  // ── Position & size ───────────────────────────────────────────────────
  x:            0,
  y:            0,
  width:        1920,
  height:       1080,
  fit:          'cover',      // 'contain' | 'cover' | 'fill'

  // ── Compositing ───────────────────────────────────────────────────────
  opacity:      1.0,
  blend:        'source-over',
  borderRadius: 0,
}
```

---

## fit Modes

Identical behaviour to `image` and `giphy` layers.

| Value | Behaviour |
|---|---|
| `contain` | Fits entire frame inside the box, preserving aspect ratio. Empty areas show layers below. |
| `cover` | Fills the entire box, crops edges if needed. No empty space — the default, and what you want for full-bleed b-roll. |
| `fill` | Stretches to exactly `width` × `height`, ignores aspect ratio. |

---

## Query vs ID

**`query`** — searches Pexels and returns the top result (or `resultIndex` offset). Results can change over time as Pexels' catalog grows, so a query-based layer isn't guaranteed to return the exact same clip on every run.

**`id`** — fetches a specific video by its Pexels numeric ID, skipping search entirely. Always returns the same clip. Use this once you've found a clip via `query` that actually works for the scene, and want it locked in for production.

To find a clip's ID: open it on pexels.com — the ID is the numeric string in the URL, e.g. `https://www.pexels.com/video/aerial-view-of-ocean-waves-855564/` → ID is `855564`.

**`resultIndex`** — when using `query`, pick a different result from the same search without firing an extra API call (results are cached in memory per query+orientation for the run).

```js
// Same search, two different clips — only 1 API call fired
{ type: 'pexels-video', query: 'city traffic night', resultIndex: 0, x: 0, y: 0,   width: 1080, height: 960, fit: 'cover' },
{ type: 'pexels-video', query: 'city traffic night', resultIndex: 1, x: 0, y: 960, width: 1080, height: 960, fit: 'cover' },
```

---

## orientation and minWidth

`orientation` narrows the search to Pexels' own `landscape`/`portrait`/`square` tag — set this to match your canvas shape (`portrait` for the standard 1080×1920 vertical output).

`minWidth` filters out any result whose best available file is smaller than this — protects against upscaling a low-res clip. The engine then picks the *smallest* file that still clears `minWidth`, rather than the largest available, so you're not downloading 4K source footage just to composite it into a canvas layer and downsample it. If nothing clears `minWidth`, it falls back to the largest file available rather than failing the layer outright.

---

## maxDuration and fps — why trimming matters

| | Cost |
|---|---|
| Untrimmed 30s clip @ 30fps | 900 PNG frames extracted, decoded, cached |
| Trimmed to `maxDuration: 6` @ 30fps | 180 PNG frames |

The `-t maxDuration` flag runs *before* the fps filter in the FFmpeg command, so the engine never even decodes more of the source clip than requested — trimming isn't a post-extraction crop, it avoids the decode cost entirely. `maxDuration` defaults to the scene's actual narration-computed duration (resolved after TTS runs, at Phase 1.1), so by default you extract exactly as much as the scene will actually show — no more, no less, and no manual tuning needed. Set `maxDuration` explicitly only if you want something other than that: a shorter clip that loops for stylistic reason, or more headroom if the HTML/motion in the clip needs to play out further before looping looks repetitive.

---

## Caching — current gap, worth knowing

Extracted frames are written to `work/pexels-video/<hash>/` with a `manifest.json`, and **within a single run**, re-resolving the same layer (or a duplicate query+orientation+resultIndex) hits that cache instantly.

**Unlike Giphy, this directory is not yet wired into the GitHub Actions cache** (`.github/workflows/generate-video.yml` has a `Cache Giphy frames` step targeting `work/giphy`, but no equivalent for `work/pexels-video`). Practically: every fresh CI run re-downloads and re-extracts every `pexels-video` layer from scratch, even if the config hasn't changed. This is a real cost (download + FFmpeg extraction per clip, typically a few seconds each) that Giphy layers don't pay on a cache hit. Worth adding the equivalent `actions/cache@v4` step on `work/pexels-video` keyed the same way as Giphy's, if this layer type sees regular use — it's a small, mechanical fix, just not yet done.

---

## Render Speed Impact

| Stage | Cost | Notes |
|---|---|---|
| API search/fetch | 0.2–1s | Cached in-memory per query for the run |
| MP4 download | 1–5s | Depends on file size at the chosen resolution |
| Frame extraction (FFmpeg) | 1–4s per clip | Scales with `maxDuration` × `fps` |
| Per-frame render | ~0ms | Just a `drawImage` call — same as a static image |

A scene with 2–3 `pexels-video` layers adds roughly 5–15 seconds to a cold run's pre-phase, all of it currently paid on *every* CI run (see caching gap above).

---

## Usage Examples

### Full-bleed portrait b-roll (vertical/shorts)

```js
layers: [
  {
    type: 'pexels-video',
    query: 'walking through forest',
    orientation: 'portrait',
    x: 0, y: 0, width: 1080, height: 1920,
    fit: 'cover',
  },
  { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
  { type: 'text', text: 'THE PATH FORWARD', x: 540, y: 960, fontSize: 90 },
]
```

### Landscape cutaway behind a lower-third

```js
layers: [
  {
    type: 'pexels-video',
    query: 'stormy ocean waves',
    orientation: 'landscape',
    x: 0, y: 0, width: 1080, height: 1200,
    fit: 'cover',
  },
  { type: 'gradient', gradientType: 'linear', colors: ['transparent', '#000'], y: 1100, height: 300 },
  { type: 'text', text: 'THE STORM THAT CHANGED EVERYTHING', x: 540, y: 1350, fontSize: 60, align: 'center', maxWidth: 960 },
]
```

### Specific clip by ID (deterministic, for production)

```js
{
  type: 'pexels-video',
  id: 855564,
  x: 0, y: 0, width: 1080, height: 1920,
  fit: 'cover',
}
```

### Longer trim, alternate result from the same search

```js
{
  type: 'pexels-video',
  query: 'archival-style city street',
  resultIndex: 2,
  maxDuration: 10,
  x: 0, y: 0, width: 1080, height: 1920,
  fit: 'cover',
}
```

---

## Graceful Degradation

If `PEXELS_API_KEY` is not set, every `pexels-video` layer silently becomes a plain dark `background` layer (`#111111`). The render completes normally — no crash, no missing frame. A warning is logged:

```
[PexelsVideo] ✗ PEXELS_API_KEY is not set. Add it as a GitHub Actions secret.
[PexelsVideo]   Get a free key at https://www.pexels.com/api  (see Requirements.md)
```

The same fallback applies per-layer if a specific search returns no results, the download fails, or frame extraction fails — that individual layer degrades to the dark background while every other layer in the scene renders normally.