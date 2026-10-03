# SerpAPI Image Resolution — APEX Engine

This document covers the `stock-image` layer type and how it resolves real photos
from Google Images via SerpAPI, including the multi-image cache system, fallback
chain, and accuracy limitations you should know about before relying on it.

Implementation: `image-api.js`. Called automatically during **Phase -1: Image
Resolution**, before rendering starts.

---

## What this feature actually does

A `stock-image` layer is a placeholder. You give it a text `query` describing
what you want to see, and at build time the engine:

1. Sends that query to SerpAPI's Google Images endpoint
2. Gets back up to 100 real image results — actual photos and illustrations
   indexed by Google, not AI-generated images
3. Downloads one of them to disk
4. Mutates the layer in place: `type` becomes `'image'`, `src` becomes the
   local file path

By the time rendering starts, every `stock-image` layer has already become a
normal `image` layer pointing at a real file on disk. The renderer itself
never talks to SerpAPI — all of that happens upfront in Phase -1.

You can also drop a raw URL directly into a normal `image` layer's `src` —
that gets downloaded and cached the same way, just without the search step.

---

## Accuracy: what you're actually getting

This is the part worth being clear-eyed about.

**It is real photography/artwork, not AI generation.** Every image comes from
Google's image index — actual uploaded photos, museum scans, news photography,
stock library entries, fan art, etc. Nothing is synthesized.

**Relevance depends entirely on your query text.** SerpAPI doesn't understand
your video's intent — it runs the query through Google Images exactly like
typing it into the search bar yourself. A vague query ("warriors") returns a
grab-bag. A specific query ("Zulu warriors historical painting Shaka") returns
results clustered tightly around that subject, but you're still at the mercy
of what's actually indexed and how Google ranks it.

**Results 0 and 1 are usually the most relevant; results 50-99 drift.** Google
ranks by relevance, so low indexes tend to be on-topic and higher indexes
increasingly tangential, near-duplicate, or only loosely related. If you're
using `imageIndex` to pull multiple photos from one search, expect index 0-5
to be tightly on-theme and indexes climbing toward 50+ to be a gamble.

**No guarantee of historical or factual correctness.** For queries about real
historical figures or events, the top results are usually identifiable
portraits or scenes — but Google Images can and does surface mislabeled
photos, misattributed paintings, or unrelated images that merely share
keywords. The engine has no way to verify that an image of "Robert Mugabe"
is actually Robert Mugabe; it trusts whatever Google has indexed under that
search term. Spot-check anything where factual accuracy matters (e.g. a
specific named person, a specific historical event).

**Some links die.** A meaningful fraction of indexed image URLs are dead,
rate-limited, or behind hotlink protection by the time you actually try to
download them — Wikimedia, Facebook CDN links, and some stock-render sites
are common offenders. This doesn't affect what the *image content* would have
been, only whether that specific copy is currently reachable. See the
fallback section below for how this is handled.

**Bottom line:** treat SerpAPI results the way you'd treat the first page of
a Google Images search you did yourself — generally on-topic and usable, but
not a verified, curated, or fact-checked source. For anything sensitive or
high-stakes, look at the resolved image before publishing.

---

## How to Use

This section walks through using `stock-image` layers from the simplest
possible case to advanced multi-photo scenes, with complete, runnable
snippets at every step. Every example below is a full scene object you
could paste into a `scenes: [ ... ]` array as-is.

### Step 1 — The minimum required setup

The only field you must provide is `query`. Everything else has a default
or is optional.

```js
{
  layers: [
    {
      type:  'stock-image',
      query: 'African savanna golden hour',
    },
  ],
}
```

What happens here: at build time, `image-api.js` searches SerpAPI for
"African savanna golden hour", downloads the top result, and turns this
layer into a normal full-resolution image. Because no `x`/`y`/`width`/
`height` were given, you'll generally want to add those — see Step 2.

### Step 2 — A full-screen background photo (the most common case)

This is the pattern you'll use for almost every scene's background layer.

```js
{
  layers: [
    {
      type:           'stock-image',
      query:          'Zulu warriors historical painting Shaka Zulu impis battle',
      source:         'serpapi',
      orientation:    'portrait',
      x:              0,
      y:              0,
      width:          1080,
      height:         1920,
      fit:            'cover',
      kenBurns:       'zoom-in',
      kenBurnsAmount: 0.12,
    },
    {
      type:         'gradient',
      gradientType: 'linear',
      colors:       ['rgba(0,0,0,0.10)', 'rgba(0,0,0,0.82)'],
      angle:        180,
    },
    {
      type:       'text',
      text:       'ZULU KINGDOM',
      x:          540,
      y:          380,
      fontSize:   76,
      fontFamily: 'Impact, Arial Black, sans-serif',
      color:      '#ffffff',
      align:      'center',
    },
  ],
}
```

Walk through what each field is doing:

- `query` — the exact text sent to Google Images. Be specific: subject +
  style + context (e.g. "historical painting", "documentary photo",
  "illustration") gets you closer to what you actually want than a bare
  noun.
- `source: 'serpapi'` — explicitly picks SerpAPI as the source. This is
  optional; if omitted, SerpAPI is tried first automatically anyway. Set
  this only if you want to force a *different* source, e.g.
  `source: 'pexels'`.
- `orientation: 'portrait'` — tells the engine you want a vertical-friendly
  image. Matches the 1080×1920 canvas.
- `x, y, width, height, fit` — standard image-layer placement, used once
  the photo is downloaded. `fit: 'cover'` crops to fill the box without
  distortion, which is almost always what you want for backgrounds.
- `kenBurns` / `kenBurnsAmount` — optional slow zoom/pan animation applied
  to the resolved image, exactly like a normal `image` layer.
- The `gradient` and `text` layers afterward are unrelated to SerpAPI —
  they're just standard layers stacked on top so the photo doesn't crash
  into the headline text.

### Step 3 — Picking a specific result with `imageIndex`

By default you get result `0` — generally the single most relevant photo
SerpAPI/Google returned. If you don't like it, or if you're building a
multi-photo scene (next step), you can ask for a different result from the
same search.

```js
{
  type:        'stock-image',
  query:       'Nelson Mandela South Africa president portrait',
  imageIndex:  2,        // skip results 0 and 1, use the 3rd result instead
  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
}
```

This still only fires one SerpAPI search call — `imageIndex` just selects
which entry from that search's result list gets downloaded.

### Step 4 — Multiple photos from ONE search (photo grids, comparisons)

This is the most powerful use of the feature. If you want several different
photos of the same subject — say, three pictures of the Zulu Kingdom laid
out as a small gallery — give every layer the **same** `query` text and a
**different** `imageIndex`. Only the first one triggers a real API call;
the rest are free.

```js
{
  layers: [
    { type: 'background', color: '#ffffff' },

    // Large photo on top
    {
      type:        'stock-image',
      query:       'Zulu warriors historical painting',
      orientation: 'landscape',
      imageIndex:  0,
      x: 90, y: 240, width: 900, height: 520, fit: 'cover',
    },

    // Two smaller photos underneath — same query, different index,
    // same SerpAPI search reused, no extra cost
    {
      type:        'stock-image',
      query:       'Zulu warriors historical painting',
      orientation: 'landscape',
      imageIndex:  1,
      x: 90, y: 980, width: 420, height: 380, fit: 'cover',
    },
    {
      type:        'stock-image',
      query:       'Zulu warriors historical painting',
      orientation: 'landscape',
      imageIndex:  2,
      x: 570, y: 980, width: 420, height: 380, fit: 'cover',
    },
  ],
}
```

Rule of thumb: **same query text = same cached search.** It doesn't matter
how many layers use it, how far apart they are in the scene, or even
whether they're in the same scene at all — see Step 5.

### Step 5 — Reusing a search across different scenes

The cache lives for the entire build, not just one scene. If two scenes
later in the video both want a photo of the same subject, reuse the query
instead of writing a new one — it costs nothing extra.

```js
// Scene 3 — fires the real search
{
  layers: [
    {
      type: 'stock-image', query: 'Boer War commandos historical photo',
      imageIndex: 0,
      x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
    },
  ],
},

// Scene 7, much later in the video — reuses the Scene 3 search,
// just grabs a different photo from it
{
  layers: [
    {
      type: 'stock-image', query: 'Boer War commandos historical photo',
      imageIndex: 4,
      x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
    },
  ],
},
```

### Step 6 — Side-by-side comparisons (two different subjects)

For a comparison shot, use two `stock-image` layers with **different**
queries placed at different `x` coordinates. Each different query is its
own search.

```js
{
  layers: [
    { type: 'background', color: '#000000' },

    // Left half
    {
      type: 'stock-image',
      query: 'Zulu warrior historical illustration',
      x: 0, y: 300, width: 540, height: 900, fit: 'cover',
    },

    // Right half
    {
      type: 'stock-image',
      query: 'Boer War commando historical photo',
      x: 540, y: 300, width: 540, height: 900, fit: 'cover',
    },
  ],
}
```

### Step 7 — Floating inset photo over a background

A `stock-image` layer doesn't have to be full-screen. Stack a small, framed
photo on top of a different background layer by giving it a smaller
`width`/`height` and non-zero `x`/`y`.

```js
{
  layers: [
    // Full-screen background
    {
      type: 'stock-image',
      query: 'African savanna landscape',
      x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
    },
    // Small framed portrait floating in the top-right corner
    {
      type: 'stock-image',
      query: 'Shaka Zulu historical portrait',
      x: 700, y: 120, width: 340, height: 420, fit: 'cover',
      borderRadius: 8,
    },
  ],
}
```

### Step 8 — Forcing a non-SerpAPI source

If you want a layer to skip SerpAPI entirely and go straight to a
different provider — for example, because you have an Unsplash key
configured and want guaranteed curated photography for one specific shot —
set `source` explicitly:

```js
{
  type:   'stock-image',
  query:  'mountain sunrise',
  source: 'unsplash',     // skips SerpAPI for this one layer
  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
}
```

Note this requires `UNSPLASH_ACCESS_KEY` to be set in the environment, or
the layer falls through the rest of the chain (Pexels → Pixabay → Picsum)
exactly as if SerpAPI had failed.

### Step 9 — Using a known URL instead of searching

If you already have the exact image URL you want and don't need a search
at all, skip `stock-image` entirely and use a plain `image` layer:

```js
{
  type: 'image',
  src:  'https://example.com/photo.jpg',
  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
}
```

This still gets downloaded and cached to disk automatically, just without
any search or fallback chain behind it.

### Putting it together — a 2-scene mini example

A complete, two-scene config showing a full-screen hero shot followed by a
3-photo gallery scene reusing one search:

```js
module.exports = {
  output:   { title: 'demo', format: 'portrait', fps: 30, crf: 18, preset: 'medium' },
  defaults: { voice: 'bm_george', transition: 'fade', transitionDuration: 0.3 },
  scenes: [

    // Scene 1 — full-screen hero photo
    {
      tts: { text: 'The Zulu Kingdom was the most powerful army in the region.', voice: 'bm_george' },
      layers: [
        {
          type: 'stock-image',
          query: 'Zulu warriors historical painting',
          imageIndex: 0,
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
        },
        {
          type: 'text', text: 'ZULU KINGDOM', x: 540, y: 300,
          fontSize: 72, color: '#ffffff', align: 'center',
        },
      ],
    },

    // Scene 2 — gallery reusing the SAME search from Scene 1
    {
      tts: { text: 'Here are three more views of their warriors.', voice: 'bm_george' },
      layers: [
        { type: 'background', color: '#ffffff' },
        {
          type: 'stock-image', query: 'Zulu warriors historical painting',
          imageIndex: 1, x: 60,  y: 400, width: 460, height: 600, fit: 'cover',
        },
        {
          type: 'stock-image', query: 'Zulu warriors historical painting',
          imageIndex: 2, x: 560, y: 400, width: 460, height: 600, fit: 'cover',
        },
        {
          type: 'stock-image', query: 'Zulu warriors historical painting',
          imageIndex: 3, x: 60,  y: 1020, width: 460, height: 600, fit: 'cover',
        },
      ],
    },

  ],
};
```

This entire two-scene video fires exactly **one** SerpAPI search call, even
though it uses four different photographs across both scenes.

---

## Field reference

| Field | Required | Default | Notes |
|---|---|---|---|
| `query` | yes | — | Plain text search string sent to SerpAPI. Be specific: subject + style + context gets tighter results than a bare noun. |
| `source` | no | `'serpapi'` (first in chain) | Forces a specific API. Valid values: `'serpapi'`, `'unsplash'`, `'pexels'`, `'pixabay'`, `'picsum'`. |
| `orientation` | no | `'portrait'` | `'portrait'` (1080×1920), `'landscape'` (1920×1080), or `'squarish'`. Used in the cache key and by sources that support orientation filtering. |
| `imageIndex` | no | `0` | Which result from the cached search to download. Wraps around with modulo if it exceeds the result count. |
| `x`, `y` | no | — | Position of the layer's top-left corner once resolved. |
| `width`, `height` | no | — | Size of the layer once resolved. Omit for a layer that should fill the full canvas if your renderer defaults to that — otherwise always set explicitly. |
| `fit` | no | — | `'cover'` (crop to fill), `'contain'` (letterbox), `'fill'` (stretch), `'none'`. |
| `kenBurns`, `kenBurnsAmount` | no | — | Optional slow zoom/pan animation, same as standard `image` layers. |
| *(any other image-layer prop)* | no | — | `borderRadius`, `shadow`, etc. — anything a normal `image` layer accepts works here too, applied after resolution. |

---

## How the search cache works internally

Steps 4 and 5 above showed *how* to reuse a search. Here's *why* it works,
for reference:

- All `stock-image` layers using SerpAPI are grouped by a cache key of
  `query (lowercased, trimmed) + orientation`.
- The **first** layer with a given key triggers the real SerpAPI search and
  caches the full result list (up to 100 entries) in memory for the rest
  of the build process.
- **Every subsequent** layer with the same query + orientation reuses that
  cached list — no new API call, regardless of how many scenes or layers
  reference it, or how far apart they are in the video.
- `imageIndex` selects which entry from the cached list to download. If the
  index is larger than the result count, it wraps around (`index % length`),
  so it never errors out.

Watch the build logs to confirm caching is working as expected:

```
[ImageAPI] Searching serpapi: "Zulu warriors historical painting" [#0]
[ImageAPI]  SerpAPI search cached: 100 result(s) for "Zulu warriors historical painting"
[ImageAPI]  SerpAPI [#0] → https://...
[ImageAPI]  ✓ Downloaded from serpapi
[ImageAPI] Searching serpapi: "Zulu warriors historical painting" [#1]
[ImageAPI]  SerpAPI cache hit (100 results) for "Zulu warriors historical painting"
[ImageAPI]  SerpAPI [#1] → https://...
[ImageAPI]  ✓ Downloaded from serpapi
```

You should only ever see `SerpAPI search cached:` once per unique query
text in an entire build. Every other reference to that same query logs
`SerpAPI cache hit` instead. If `search cached` appears more times than you
have distinct query strings, something is bypassing the cache — usually a
typo or extra whitespace making two queries look different to the cache
key even though they read the same to you.

Each `imageIndex` for a given query also gets its own file on disk (the
cache filename hash includes the index), so re-running the same config
reuses previously downloaded files too — not just the in-memory search
results.

---

## Dead-link resilience — walking the result set before giving up

Not every URL Google has indexed is actually downloadable at request time.
Some are rate-limited (Wikimedia), some sit behind login walls (Facebook CDN
links), some return tiny error bodies disguised as 200 responses (broken
render links). Naively, this would force a fallback all the way down to
Picsum for a single broken link, even though 99 other usable results were
sitting in the same cached search.

Instead, when a SerpAPI image fails to download for any reason, the engine
automatically retries the **next** result in the same cached list, then the
next, cycling through the entire cached set (up to 100 entries) starting
from your requested `imageIndex` and wrapping around. This costs zero
additional SerpAPI search calls — it's all reusing the one cached result
list and just trying different download URLs from it.

```
[ImageAPI]  SerpAPI [#0] → https://render.fineartamerica.com/...
[ImageAPI]  ⚠ serpapi [#0] failed: File too small (68B) — likely error response
[ImageAPI]  ↻ serpapi retry [#1] → https://walthercollection.com/...
[ImageAPI]  ✓ Downloaded from serpapi (fallback #1)
```

Other sources (Unsplash, Pexels, Pixabay, Picsum) are only attempted if
**every single result** in the cached SerpAPI list fails to download — which
in practice essentially never happens for a real search term with 100
indexed results.

---

## Fallback chain

If `source` isn't specified, or if SerpAPI exhausts its entire cached result
set without a single working download, the chain falls through in this
order:

1. **SerpAPI** — real Google Images results, hardcoded key, ~100
   searches/month on the free tier (a *search* uses one credit; downloading
   different `imageIndex` values from the same cached search does not use
   additional credits)
2. **Unsplash** — needs `UNSPLASH_ACCESS_KEY` env var; curated, high-quality
   editorial photography; 25 req/hr free
3. **Pexels** — needs `PEXELS_API_KEY` env var; stock photography; 200
   req/hr free
4. **Pixabay** — needs `PIXABAY_API_KEY` env var; broad stock library; 100
   req/hr free
5. **Picsum** — no key required; random placeholder photography with no
   relevance to your query at all — this is a last-resort visual filler, not
   a content match

If every source in the chain fails outright (extremely rare — would require
network failure or all four+ services being unreachable), the layer
degrades to a flat dark background (`#0a0a12`) rather than breaking the
render.

---

## URL images (non-search)

If you already know the exact image URL you want, skip the search step
entirely and use a normal `image` layer with an `http(s)://` source:

```js
{
  type: 'image',
  src:  'https://example.com/photo.jpg',
  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
}
```

This gets downloaded and cached to `work/url-images/` the same way, but
with no search, no query matching, and no fallback chain — if that specific
URL is dead, the layer simply fails to resolve to that image (falls back to
the source chain isn't applicable here since there was no query to retry
with).

---

## Caching and disk behavior

- Resolved files live under `work/stock-images/` (search-based) or
  `work/url-images/` (direct URL).
- Filenames are MD5 hashes of `query + source + orientation + imageIndex`
  (or of the URL itself for direct images), so identical layer
  configurations reuse the same file across build runs without
  re-downloading.
- The in-memory SerpAPI results cache (`serpApiResultsCache`) only persists
  for the lifetime of one build process — it resets on the next CI run, at
  which point an unchanged query fires a fresh search but lands on the same
  cached disk files for any `imageIndex` already downloaded previously.

---

## Quick troubleshooting

| Symptom in logs | Likely cause |
|---|---|
| `serpapi failed: HTTP 401` | Bad or expired SerpAPI key — check the dashboard, the key may need refreshing |
| `serpapi failed: HTTP 429` | Rate limited by the *destination* image host (e.g. Wikimedia), not by SerpAPI itself — the walk-forward retry should route around it automatically |
| `Server returned HTML instead of image` | The image URL led to a login wall, expired token, or error page rendered as HTML — also auto-retried |
| `File too small (NNB)` | Downloaded body was a tiny error response, not a real image — also auto-retried |
| Multiple `SerpAPI search cached:` lines for the same query text | Query strings differ slightly (extra whitespace, different case beyond what `.toLowerCase().trim()` catches, or a typo) — check for exact text matches across layers |
| Layer becomes `type: 'background'`, flat dark color | Every source in the entire fallback chain failed — check network access and API key validity for all configured sources |