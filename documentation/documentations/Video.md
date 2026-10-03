# Video Layer — Feature Documentation

A `video` layer composites any video you already have a link or file for — a direct download URL from any API/archive (NARA, DVIDS, Internet Archive, your own CDN, wherever) or a local file path — into a scene, with full image-layer positioning/fit/compositing support. Same render path Pexels/Giphy use under the hood.

This is the generic counterpart to `pexels-video`: that layer *searches* Pexels for you; this one takes a video you (or your own config code) already resolved.

---

## Why This Exists Instead of Just Playing `<video>` in an ApexCasing

Worth understanding before using this, because the obvious-looking alternative doesn't work with this engine.

`html-record.js` captures frames by **pausing the page's clock** with CDP's `Emulation.setVirtualTimePolicy` and advancing it in fixed budgets between screenshots — that's what makes narration/beat-sync frame-accurate and deterministic. A live `<video>` element does **not** respect that virtual clock — video decode runs on Chrome's real media pipeline, independent of it. So a `<video>` tag inside an ApexCasing, screenshotted frame-by-frame under virtual time, produces an unsynced result: frozen on frame 0 for the whole scene, or jumping unpredictably, depending on the Chrome build. Making that path deterministic would mean switching to continuous real-time capture, which reintroduces the exact `captureScreenshot` hang class `html-record.js` already has a relaunch/circuit-breaker system to work around, and is slower.

Pre-extracting frames with FFmpeg (what this layer does) sidesteps the problem entirely — the video never touches the browser at all, so virtual time is never in the picture.

---

## How It Works

The engine resolves `video` layers in **Phase 1.05** — right after TTS, right before Pexels video resolution, before any frame is rendered. Like Pexels video, it runs *after* TTS specifically so it knows the scene's real, narration-computed duration rather than guessing one.

```
Phase 1.05 (after TTS, pre-render, runs once)
  1. If `url` is set: download it → work/video-source/<hash>/source.mp4
     If `path` is set: read the local file in place, no download
  2. Trim to `maxDuration` seconds (default: the scene's actual narration-
     computed duration) and extract PNG frames with FFmpeg at `fps`
     (default: source fps, capped 30)
  3. Mutate layer → type: 'image-sequence', srcs: [...], cutEvery: 1/fps

Render loop (per frame)
  drawImageSequence() picks the correct PNG for the current scene time
  → same canvas drawImage call as any other image layer
  → frame advances at the extracted fps, loops seamlessly if loop: true
```

Because the mutation target is `image-sequence`, a `video` layer gets **every image-layer property for free** — `x`, `y`, `width`, `height`, `fit`, `opacity`, `blend`, `borderRadius`, Ken Burns — with zero extra code. `drawImageSequence` just spreads the layer's own properties and calls the same `drawImage` path any static image uses.

---

## Layer Properties

```js
{
  type: 'video',

  // ── Source (exactly one required) ───────────────────────────────────────
  url:          'https://media.example.gov/clip.mp4',  // direct download link, any host
  // path:      './assets/broll/archival-clip.mp4',    // local file — skips download entirely

  // ── Trim / extraction ─────────────────────────────────────────────────
  maxDuration:  6,            // seconds of the clip to extract (default: scene's real duration)
  fps:          30,           // extraction frame rate, capped at 30 (default: source fps)
  loop:         true,         // loop the trimmed clip for the full scene (default: true)

  // ── Position & size ───────────────────────────────────────────────────
  x:            0,
  y:            0,
  width:        1080,
  height:       1920,
  fit:          'cover',      // 'contain' | 'cover' | 'fill'

  // ── Compositing ───────────────────────────────────────────────────────
  opacity:      1.0,
  blend:        'source-over',
  borderRadius: 0,
}
```

`url` and `path` are mutually exclusive — set one, not both. If both are set, `path` wins and a warning is logged.

---

## `url` vs `path`

**`url`** — any direct video download link, from any source. The engine doesn't care who served it — an API response, a static file host, a signed CDN link, whatever. It's downloaded once to `work/video-source/<hash>/source.mp4`, then extracted and cached by a hash of the URL, so re-resolving the same URL within a run (or a re-run with a warm cache dir) skips the download.

**`path`** — a video file already on disk (checked into the repo under `assets/`, or produced by an earlier build step). No network call at all — FFmpeg reads it in place. Cached by a hash of the resolved absolute path.

---

## Sourcing Video from an API/Archive (NARA, DVIDS, Internet Archive, etc.)

This layer intentionally does **not** integrate any specific archive's search API — it doesn't need to. APEX config already supports async functions, so resolve the direct file URL yourself, however that archive's API works, and hand the result straight to `url`:

```js
layers: [
  await (async () => {
    const res  = await fetch('https://api.example-archive.gov/search?q=apollo+11+launch');
    const data = await res.json();
    return {
      type: 'video',
      url:  data.items[0].downloadUrl,   // whatever field that API returns
      x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
    };
  })(),
]
```

This works the same way regardless of which archive you're calling — NARA's API, DVIDS' API, archive.org's API, or a private one. The `video` layer's only requirement is a direct, unauthenticated (or already-signed) download URL by the time it resolves. If an archive's API requires an auth header to actually download the file (not just to search), that has to be handled in your own fetch call before you hand off the URL — this layer does a plain download with no custom headers.

---

## maxDuration and fps — why trimming matters, and why the default changed

| | Cost |
|---|---|
| Untrimmed 30s clip @ 30fps | 900 PNG frames extracted, decoded, cached |
| Trimmed to a 4s scene @ 30fps | 120 PNG frames |

Same reasoning as `pexels-video`: `-t maxDuration` runs *before* the fps filter in FFmpeg, so the engine never decodes more of the source than requested. `maxDuration` defaults to the scene's actual narration-computed duration — resolved after TTS runs, at Phase 1.05 — so by default you extract exactly what the scene will show, no more, no less, and no manual tuning per scene. Set `maxDuration` explicitly only if you want something other than that: a short clip that loops on purpose for a stylistic repeating effect, or more headroom if the clip's motion needs to play out further before looping looks repetitive.

---

## No Audio

The source video's audio track is not extracted or mixed in. Two reasons:

1. Frame extraction loops the trimmed sequence (`loop: true`) to fill however long the scene runs. Real audio can't loop cleanly against that the way a silent visual loop can.
2. Mixing it into `encoder.js`'s `amix` filter_complex (which currently combines narration + background music) would need a per-scene `adelay` offset for every video layer, and correct level-matching against narration that's mixed to dominate.

Given these are narration/music-led shorts, source audio would usually get muted anyway. Left out deliberately rather than half-implemented — revisit only if a specific clip's audio genuinely matters for a scene.

---

## Caching

Extracted frames are written to `work/video-source/<hash>/` with a `manifest.json`. Within a single run, re-resolving the same `url` or `path` hits that cache instantly. Like `pexels-video`, this directory is **not yet wired into the GitHub Actions cache** — every fresh CI run re-downloads (for `url`) and re-extracts every `video` layer from scratch. See the same caching note in `Pexels.md`; the fix (an `actions/cache@v4` step targeting `work/video-source`) is identical and hasn't been added yet.

---

## Render Speed Impact

| Stage | Cost | Notes |
|---|---|---|
| Download (`url` only) | 1–5s | Depends on file size; skipped entirely for `path` |
| Frame extraction (FFmpeg) | 1–4s per clip | Scales with `maxDuration` × `fps` |
| Per-frame render | ~0ms | Just a `drawImage` call — same as a static image |

`path` layers are cheaper than `url` layers by however long the download would've taken — worth checking video files into the repo (or a build artifact step) instead of re-downloading the same b-roll every run, if it's reused across configs.

---

## Usage Examples

### Full-bleed portrait clip from a direct API link

```js
layers: [
  {
    type: 'video',
    url: 'https://media.example.gov/apollo11-launch.mp4',
    x: 0, y: 0, width: 1080, height: 1920,
    fit: 'cover',
  },
  { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
  { type: 'text', text: 'JULY 16, 1969', x: 540, y: 1700, fontSize: 70 },
]
```

### Local checked-in b-roll, longer trim

```js
{
  type: 'video',
  path: './assets/broll/soviet-radar-room.mp4',
  maxDuration: 8,
  x: 0, y: 0, width: 1080, height: 1920,
  fit: 'cover',
}
```

### Resolved dynamically from an archive's search API

```js
layers: [
  await (async () => {
    const res  = await fetch('https://api.dvidshub.net/search?q=carrier+flight+deck&type=video');
    const data = await res.json();
    return { type: 'video', url: data.results[0].url, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' };
  })(),
]
```

---

## Graceful Degradation

If neither `url` nor `path` is set, the download fails, the local file isn't found, or frame extraction fails, the layer silently becomes a plain dark `background` layer (`#111111`) — same fallback `pexels-video` and `giphy` use. The render completes normally, no crash, no missing frame. A warning is logged either way:

```
[VideoSource] ✗ video layer needs a "url" or "path" — skipping.
[VideoSource] ✗ Download failed: <reason>
[VideoSource] ✗ Frame extraction failed: <reason>
```

---

## Related

- `Pexels.md` — the same download → trim → extract → image-sequence pattern, but for Pexels' searchable stock library specifically. `video-source.js` reuses `pexels-video.js`'s extraction/download/mutation/caching helpers directly rather than duplicating them.
- `Giphy.md` — same render path (`image-sequence`), different resolution phase, GIF source instead of MP4.