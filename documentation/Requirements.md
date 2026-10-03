# APEX Engine — Requirements Reference

Everything the engine needs to run: API keys, GitHub secrets, Node dependencies, system packages, and environment notes.

---

## GitHub Actions Secrets

All API keys are passed to the engine as GitHub Actions secrets. **Never hardcode a key in any source file.**

To add or update a secret: **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret Name            | Required | Free Tier                          | Used For                                      | Get Key At                                       |
|------------------------|----------|------------------------------------|-----------------------------------------------|--------------------------------------------------|
| `SERPAPI_API_KEY`      | ✅ Yes   | 100 searches/month                 | Stock image search (`stock-image` layers)     | https://serpapi.com                              |
| `GIPHY_API_KEY`        | ✅ Yes   | Unlimited (watermarked) / Production key free to apply | Animated GIFs, stickers, MP4s (`giphy` layers) | https://developers.giphy.com/dashboard          |
| `TIKTOK_SESSION_ID`    | ✅ Yes (for posting) | N/A — your account cookie | Auto-posting via `Auto/poster.py` | F12 → Application → Cookies → `sessionid` on tiktok.com |
| `POLLINATIONS_API_KEY` | Optional | Free                               | AI image generation (`ai-image` layers)       | https://pollinations.ai                          |
| `UNSPLASH_ACCESS_KEY`  | Optional | 25 requests/hour                   | Stock photo fallback                          | https://unsplash.com/developers                  |
| `PEXELS_API_KEY`       | Optional (Required for `pexels-video` layers) | 200 requests/hour, 20,000/month | Stock photo fallback + stock video b-roll (`pexels-video` layers) | https://www.pexels.com/api                       |
| `PIXABAY_API_KEY`      | Optional | 100 requests/hour                  | Stock photo fallback                          | https://pixabay.com/api/docs                     |
| `FREESOUND_API_KEY`    | Optional | Free                               | Background music search                       | https://freesound.org/apiv2/apply                |

### Priority Notes

**`SERPAPI_API_KEY`** — Primary stock image source. If not set, the engine falls back through Unsplash → Pexels → Pixabay → Picsum (random photos, no search). Picsum always works with no key but returns random images, not query-matched ones.

**`GIPHY_API_KEY`** — Required for any `{ type: 'giphy' }` layer. Without it, giphy layers degrade to a plain dark background and a warning is logged. Apply for a Production key at https://developers.giphy.com/dashboard — it removes the Giphy watermark and has much higher rate limits than the default key.

**`PEXELS_API_KEY`** — Also powers `{ type: 'pexels-video' }` layers (src/pexels-video.js), which pull real stock video footage for documentary-style b-roll and convert it into an image-sequence the render pipeline already understands. Without the key, `pexels-video` layers degrade to a plain dark background and a warning is logged — the same fallback behavior as Giphy. Licensing: Pexels video/photo content is under the Pexels License (free for personal + commercial use, no attribution legally required, cannot be resold standalone/unmodified). Pexels does not indemnify against third-party claims on the content — see https://www.pexels.com/license/ for the full terms.

**`POLLINATIONS_API_KEY`** — AI image generation. Without it, `ai-image` layers attempt unauthenticated Pollinations requests (may be rate-limited or fail under load).

**`FREESOUND_API_KEY`** — Background music search. Without it, bgMusic with `{ mood: '...' }` config falls back to FMA (Free Music Archive) mood-based tracks which always work but have limited selection.

---

## Node.js Dependencies

Declared in `package.json`. Installed via `npm install` in the workflow.

| Package         | Version    | Purpose                                                    |
|-----------------|------------|------------------------------------------------------------|
| `canvas`        | `^2.11.2`  | Node.js Canvas API — all frame drawing                    |
| `fluent-ffmpeg` | `^2.1.3`   | FFmpeg wrapper — audio mixing utilities                   |
| `fs-extra`      | `^11.2.0`  | Enhanced file system helpers                              |
| `omggif`        | `^1.0.10`  | Animated GIF decoder — used by `giphy-api.js` for frame extraction |
| `puppeteer`     | Latest     | Headless Chrome — required for `html-record` layers only  |

> **Note:** `puppeteer` is installed in the workflow's Node install step when `html-record` layers are used. It is not in `package.json` by default due to its size (~400MB Chromium download). Add it manually if needed: `npm install puppeteer`.

---

## System Dependencies (GitHub Actions runner — Ubuntu)

These are pre-installed on the GitHub Actions Ubuntu runner or installed by the workflow.

| Package       | How Installed           | Purpose                                                   |
|---------------|-------------------------|-----------------------------------------------------------|
| `ffmpeg`      | `apt-get` in workflow   | Video encoding, audio mixing, MP4 frame extraction        |
| `ffprobe`     | Bundled with `ffmpeg`   | Media probing (FPS detection for Giphy MP4s)             |
| `Python 3`    | Pre-installed           | Beat generation (`beat-gen.py`), AI image scripts        |
| `pip`         | Pre-installed           | Python package installer                                  |
| `node >= 18`  | Pre-installed           | Runtime for all engine JS files                          |

---

## Python Dependencies

Used by `src/beat-gen.py` and `src/generate_images.py`.

| Package        | Purpose                          |
|----------------|----------------------------------|
| `numpy`        | Audio/beat analysis              |
| `scipy`        | Signal processing                |
| `librosa`      | Beat detection                   |
| `soundfile`    | Audio file I/O                   |
| `requests`     | HTTP calls from Python scripts   |

Installed via `pip install` in the workflow where needed.

---

## Giphy API — Setup Details

### Getting Your Key

1. Go to https://developers.giphy.com/dashboard
2. Create an app → choose **API** (not SDK)
3. Copy the API Key shown on your app dashboard
4. Add it as GitHub secret `GIPHY_API_KEY`

### Free vs Production Key

| | Default / Beta Key | Production Key |
|---|---|---|
| Rate limit | 42 req/sec | Custom (much higher) |
| Watermark | Yes (Giphy logo overlay on GIFs) | No |
| Apply | Instant | Free — submit app description at https://developers.giphy.com/dashboard |

Apply for the Production key immediately — it is free and removes the watermark. Approval is usually same-day.

### Giphy Layer Usage

```js
// Animated GIF by search query
{
  type: 'giphy',
  query: 'mind blown',
  rating: 'g',              // 'g' | 'pg' | 'pg-13' | 'r'
  x: 200, y: 400,
  width: 500, height: 500,
  fit: 'contain',           // 'contain' | 'cover' | 'fill'
  loop: true,               // loop GIF for full scene duration
  opacity: 1.0,
}

// Animated GIF by exact Giphy ID (deterministic, no search)
{
  type: 'giphy',
  id: 'xT9IgG50Lg7ezFfGQE',
  x: 0, y: 0,
  width: 1080, height: 1920,
  fit: 'cover',
}

// Sticker (transparent background, PNG frames)
{
  type: 'giphy',
  query: 'fire',
  sticker: true,
  x: 300, y: 800,
  width: 480, height: 480,
  fit: 'contain',
}

// MP4 rendition (smoother motion, larger pre-render cost)
{
  type: 'giphy',
  query: 'explosion',
  preferMp4: true,
  x: 0, y: 0,
  width: 1080, height: 1920,
  fit: 'cover',
}

// Pick a specific result from a search (0-indexed)
{
  type: 'giphy',
  query: 'laughing',
  resultIndex: 2,           // use the 3rd search result
  x: 100, y: 600,
  width: 400, height: 400,
}
```

### Meme Format Example

```js
// Animated meme: Giphy base + top/bottom text
layers: [
  {
    type: 'giphy', query: 'surprised pikachu',
    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
  },
  { type: 'overlay', color: 'rgba(0,0,0,0.2)' },
  {
    type: 'text', text: 'WHEN THE CODE WORKS',
    x: 540, y: 200, fontSize: 88, color: '#ffffff',
    fontFamily: 'Impact, Arial Black',
    stroke: true, strokeColor: '#000000', strokeWidth: 8,
    align: 'center', maxWidth: 980,
  },
  {
    type: 'text', text: 'ON THE FIRST TRY',
    x: 540, y: 1720, fontSize: 88, color: '#ffffff',
    fontFamily: 'Impact, Arial Black',
    stroke: true, strokeColor: '#000000', strokeWidth: 8,
    align: 'center', maxWidth: 980,
  },
]
```

---

## Pexels Video API — Setup Details

Uses the same `PEXELS_API_KEY` as the stock-photo fallback in `image-api.js` — one key covers both. Confirmed against Pexels' own docs: all content (photos AND videos) is released under the **Pexels License**, free for personal and commercial use, no attribution legally required. The catch is Pexels offers no indemnification against third-party claims, and search relevance/filters are looser than a paid library like Storyblocks or Adobe Stock — fine for narration-paced documentary b-roll, worth spot-checking clips for anything sensitive/high-stakes.

### Getting Your Key

Same key as stock photos: https://www.pexels.com/api → sign up → instant key → add as GitHub secret `PEXELS_API_KEY`. Default limits are 200 req/hour and 20,000 req/month; Pexels will lift limits for free if you show attribution.

### Pexels Video Layer Usage

```js
// Landscape b-roll clip, full-bleed background
{
  type: 'pexels-video',
  query: 'stormy ocean waves',
  orientation: 'landscape',       // 'landscape' | 'portrait' | 'square'
  x: 0, y: 0,
  width: 1920, height: 1080,
  fit: 'cover',
  maxDuration: 6,                 // seconds of clip to extract (default 6)
  loop: true,                     // loop the trimmed clip for the scene's full length
}

// Portrait clip for vertical documentaries/shorts
{
  type: 'pexels-video',
  query: 'walking through forest',
  orientation: 'portrait',
  x: 0, y: 0,
  width: 1080, height: 1920,
  fit: 'cover',
}

// Exact clip by Pexels video id (deterministic, no search)
{
  type: 'pexels-video',
  id: 855564,
  x: 0, y: 0,
  width: 1920, height: 1080,
  fit: 'cover',
}

// A different result from the same search + a longer trim
{
  type: 'pexels-video',
  query: 'archival city street',
  resultIndex: 2,
  maxDuration: 10,
  x: 0, y: 0,
  width: 1920, height: 1080,
  fit: 'cover',
}
```

**How it works internally:** `src/pexels-video.js` searches the Pexels Video API, downloads the smallest rendition that still meets `minWidth` (default 1280px — avoids pulling 4K source for a 1080p canvas), trims it to `maxDuration` seconds with FFmpeg, and extracts a PNG frame sequence — mutating the layer to the engine's existing `image-sequence` type, the same mechanism Giphy uses. Clips are cached by query+orientation hash under `work/pexels-video/`, so re-runs and repeated queries don't re-download or re-extract. Trimming happens **before** frame extraction (`ffmpeg -t <maxDuration>`) so a 30-second source clip never gets fully decoded into thousands of PNGs — only what's needed.

Without `PEXELS_API_KEY`, `pexels-video` layers degrade to a plain dark background and a warning is logged, same as Giphy.

---

## SerpAPI — Migration Note

**The hardcoded SerpAPI key previously in `src/image-api.js` has been removed.** You must now add your key as a GitHub Actions secret named `SERPAPI_API_KEY`.

If you had the key hardcoded before, move it to: **Settings → Secrets and variables → Actions → `SERPAPI_API_KEY`**

Without it, stock image search falls back to Unsplash → Pexels → Pixabay → Picsum in that order based on which other keys are set.

---

## Work Directory Cache Structure

The engine caches all downloaded and processed assets under `./work/`:

```
work/
  tts/            — generated TTS WAV files
  ai-images/      — AI-generated images (Pollinations)
  stock-images/   — downloaded stock photos (SerpAPI / Unsplash / etc.)
  url-images/     — images downloaded from direct URLs
  giphy/          — decoded Giphy GIF/MP4 frame sequences
    <hash>/
      source.gif  — raw downloaded GIF
      manifest.json
      frame_00000.png
      frame_00001.png
      ...
  music/          — downloaded background music
  sfx/            — synthesized sound effects
  html-frames/    — Puppeteer-recorded HTML animation frames
```

All cache directories are preserved between GitHub Actions runs via `actions/cache@v4` steps. A cache hit skips re-downloading and re-decoding entirely — subsequent renders of the same config are significantly faster.

---

## Environment Variables Summary

All variables are passed via the `env:` block in `.github/workflows/generate-video.yml`. None are read from `.env` files or hardcoded in source.

```
SERPAPI_API_KEY         → src/image-api.js
GIPHY_API_KEY           → src/giphy-api.js
POLLINATIONS_API_KEY    → src/image-gen.js
UNSPLASH_ACCESS_KEY     → src/image-api.js
PEXELS_API_KEY          → src/image-api.js
PIXABAY_API_KEY         → src/image-api.js
FREESOUND_API_KEY       → src/audio-fetch.js
VIDEO_CONFIG            → engine-ci.js  (which config file to run)
NODE_OPTIONS            → Node.js heap size setting
```
