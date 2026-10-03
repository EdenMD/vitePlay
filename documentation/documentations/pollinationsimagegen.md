# APEX Engine — AI Image Generation v5
## `ai-image` Layer Reference (Pollinations.AI backend)

The `ai-image` layer generates images from text prompts via the **Pollinations.AI** HTTP API — no local model, no GPU, no PyTorch, no per-run download. This replaced the old local Stable-Diffusion-on-CPU backend entirely (see "Local Generation Status" below).

---

## How It Works

```
config.js  (ai-image layers)
        │
        ▼  Phase 0 — Image Generation  (before TTS, before rendering)
        │  engine-ci.js finds all ai-image layers across all scenes
        │  Writes a manifest → spawns Python ONCE for the whole batch
        │  Python fires one HTTPS GET per image at image.pollinations.ai
        │  Each ai-image layer mutates → type: 'image', src: '<path>'
        │  From this point the renderer treats them as regular images
        │
        ▼  Phase 1 — TTS
        ▼  Phase 2 — Render  (generated PNGs used like any other image)
        ▼  Phase 3 — Encode
```

Generated images are saved to `work/ai-images/` and **cached between runs**. If `config.js` hasn't changed, images are reused instantly — Python never runs.

---

## Local Generation Status: **Retired, not just deprecated**

`generate_images.py` (v5) contains zero local-model code — no `torch`, no `diffusers`, no `import` of any ML inference library, no model download, no GPU/CPU inference step. Every image is a single `urllib.request` HTTPS GET. There is no local fallback path in the code if Pollinations is unreachable — the fallback on total failure is a flat placeholder PNG (see "Failure Behavior" below), not a local re-generation attempt.

Practical consequences of this compared to the old local-SD approach:

| | Old (local SD) | Now (Pollinations) |
|---|---|---|
| Model weights download | ~4GB, once, cached | None — nothing to download |
| RAM during Phase 0 | ~2.5–4.5GB | Negligible (just an HTTP client) |
| Compute cost | GitHub Actions CPU minutes | Pollinations' own servers |
| `steps` / `guidanceScale` config | Meaningfully changed output | **Accepted but silently ignored** — see below |
| Negative prompt | Auto-applied, fixed bad anatomy/watermarks | **Does not exist** — Pollinations' API has no negative-prompt parameter |
| Speed | ~25–75s per image (steps-dependent) | ~15–20s per image, roughly fixed regardless of model |
| Offline/self-hosted use | Possible | Not possible — hard dependency on Pollinations' API being up |

**`steps` and `guidanceScale` are dead config properties.** `image-gen.js` still reads them off the layer and writes them into the manifest (`task.steps`, `task.guidanceScale`), purely so old configs don't throw — but `generate_images.py`'s actual request builder never reads either field. Setting `steps: 30` today has **zero effect** on the output. They're kept in the property table below only so you know they're harmless to leave in old configs, not because they do anything.

---

## Do Generated Images Behave Like Regular Images?

**Yes, completely.** After Phase 0 runs, every `ai-image` layer is mutated in-place:

```js
// What you write in config.js:
{ type: 'ai-image', prompt: 'African savanna at golden hour', style: 'cinematic',
  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' }

// What the renderer actually sees by Phase 2:
{ type: 'image', src: './work/ai-images/s0_l0.png',
  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' }
```

Every image-layer feature works on generated images: `fit: cover/contain/fill`, `borderRadius`, `opacity`, `parallax`/`parallaxFactor`, `enterAt`/`exitAt`, Ken Burns zoom/pan. The engine has no idea the image was AI-generated — same code path as `./assets/photo.jpg`. All `ai-image`-only properties (`prompt`, `model`, `style`, `animeStyle`, `genWidth`, `genHeight`, `steps`, `guidanceScale`) are deleted from the layer object once resolved, so nothing leaks into the render step.

---

## Basic Usage

```js
{
    type:    'ai-image',
    prompt:  'A vast African savanna at golden hour, dramatic sky',
    style:   'cinematic',

    // Standard image layer props:
    x: 0, y: 0,
    width:   1080,
    height:  1920,
    fit:     'cover',
    opacity: 1,
}
```

---

## All Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `prompt` | string | `'scenic landscape'` | Your image description |
| `style` | string | none | Style preset — prepended to prompt, non-anime models only (see table below) |
| `animeStyle` | string | none | Style tag for anime models specifically — see Style Presets |
| `model` | string | `'dreamshaper'` | Which model key to use — maps to a real Pollinations backend (see table below) |
| `steps` | number | — | **Dead.** Accepted for config compatibility, never sent to Pollinations, no effect |
| `guidanceScale` | number | — | **Dead.** Same as above |
| `genWidth` | number | `768` (`512` for plain `flux`/`realistic`) | Generation width sent to Pollinations |
| `genHeight` | number | `768` (`512` for plain `flux`/`realistic`) | Generation height sent to Pollinations |
| `x` | number | `0` | X position on canvas |
| `y` | number | `0` | Y position on canvas |
| `width` | number | `1080` | Display width on canvas |
| `height` | number | `1920` | Display height on canvas |
| `fit` | string | `'cover'` | `cover` / `contain` / `fill` |
| `opacity` | number | `1` | Layer opacity 0–1 |

`genWidth`/`genHeight` defaults come from `getDefaultSize(modelKey)` in `image-gen.js`: anime-mapped keys (`meinamix`, `anything-v5`, `toonyou`) and `sdxl-turbo`/`dreamshaper-xl` default to `768`; plain `dreamshaper`/`realistic` default to `512`. There's no CPU cost reason to keep these low anymore (generation happens on Pollinations' servers, not the runner) — raise them freely if you want higher-resolution source images, e.g. for a hero shot that fills the full frame for several seconds.

---

## Model Selection

Every model key you set still exists as a config value, but all of them route to one of **four actual backends** on Pollinations — the SD-sounding names are aliases kept so existing configs don't break, not real separate checkpoints anymore.

| Model key (what you write) | Actual Pollinations backend | Best for |
|---|---|---|
| `dreamshaper` ⭐ (default) | `flux` (Flux Schnell) | General purpose, cinematic, storytelling — fast, high quality |
| `realistic` | `flux-realism` (Flux + realism LoRA) | Photorealistic, documentary, news |
| `flux` | `flux` | Same as `dreamshaper` — direct name |
| `flux-realism` | `flux-realism` | Same as `realistic` — direct name |
| `meinamix` / `anything-v5` / `toonyou` | `flux-anime` (Flux + anime LoRA) | Anime/stylized — all three old anime model names now point to the same backend |
| `flux-anime` | `flux-anime` | Same as above — direct name |
| `turbo` | SDXL Turbo mirror | Fastest, noticeably lower quality — use only when volume matters more than any single image |

Any model key not in this list falls back to `flux-anime` (Python's `DEFAULT_POLLINATIONS_MODEL`) — in practice this only happens if you typo a model key, since `image-gen.js` already defaults to `'dreamshaper'` before Python ever runs.

### ⚠️ One model per run, not per layer

`generate_images.py` reads the model key from the **first task in the batch** and applies it to every image generated that run:

```python
model_key = tasks[0].get('model', 'meinamix')
```

If scene 1 uses `model: 'flux-realism'` and scene 3 uses `model: 'flux-anime'`, **every image in that run generates with whatever scene 1's model resolved to** — the per-layer `model` value for scenes after the first is silently not respected. If you genuinely need mixed models in one video, that currently requires running the pipeline twice (once per model) and manually merging the outputs, or filing this as a real fix if it comes up often enough to be worth patching.

### Anime models get a quality prefix automatically

Any of the three anime-mapped keys get `'masterpiece, best quality, highly detailed, anime style, '` prepended automatically, plus your `animeStyle` tag if set, plus your prompt — you don't write this yourself.

---

## Style Presets

Styles add a quality-boosting prefix to your prompt (non-anime models — anime models use `animeStyle` instead, see below). These are plain text prepended to the prompt sent to Pollinations; unlike the old local-SD doc claimed, there's no negative prompt or model-specific fine-tuning happening — it's literally just prompt text, so how much they "carry weight" now depends entirely on how Flux responds to the phrasing, not on trained embeddings the way SD LoRAs/textual-inversions used to work.

| Style | Prefix added |
|---|---|
| `cinematic` | cinematic film still, dramatic lighting, shallow depth of field, anamorphic lens, 35mm film, |
| `documentary` | documentary photograph, photojournalism, natural lighting, Canon EOS, sharp focus, real world, |
| `illustration` | vibrant digital illustration, concept art, trending on ArtStation, highly detailed, sharp, |
| `anime` | anime key visual, Studio Ghibli inspired, detailed background, soft cel shading, beautiful, |
| `realistic` | RAW photo, DSLR, 8k uhd, photorealistic, natural lighting, ultra detailed, sharp focus, |
| `dark` | dark moody cinematic, dramatic shadows, rim lighting, atmospheric fog, noir style, |
| `bright` | golden hour photography, vibrant colors, warm sunlight, cheerful, high key lighting, |
| `news` | press photograph, photojournalism, candid, natural light, documentary style, |
| `portrait` | professional portrait, studio lighting, bokeh background, sharp eyes, film photography, |
| `aerial` | aerial drone photography, bird's eye view, wide angle, high altitude, epic landscape, |
| `abstract` | abstract digital art, geometric patterns, vibrant bold colors, motion blur, 4k, |
| `retro` | vintage photograph, 35mm film grain, kodachrome colors, 1970s style, faded tones, |
| `fantasy` | epic fantasy illustration, magical atmosphere, dramatic lighting, concept art, detailed, |
| `scifi` | science fiction concept art, futuristic, neon lighting, cyberpunk aesthetic, detailed, |
| `nature` | wildlife photography, National Geographic, natural light, ultra sharp, 4k nature, |

### Anime-specific style tags (`animeStyle`, anime models only)

| `animeStyle` | Tag added |
|---|---|
| `anime-fantasy` | epic fantasy, dramatic lighting, magic atmosphere, detailed background, |
| `anime-dark` | dark fantasy, ominous atmosphere, dramatic shadows, cinematic, |
| `anime-battle` | epic battle scene, dynamic action, dramatic lighting, motion blur, |
| `anime-portrait` | detailed face, expressive eyes, soft lighting, upper body, |
| `anime-landscape` | detailed background, scenic view, dramatic sky, atmospheric, |
| `anime-myth` | ancient mythology, divine atmosphere, glowing elements, epic scale, |
| `anime-history` | historical setting, detailed architecture, period accurate, epic scene, |

`style` is ignored for anime models (`animeStyle` is used instead) — setting both is harmless, only `animeStyle` takes effect.

---

## Authentication & Rate Limits

| | With `POLLINATIONS_API_KEY` | Without |
|---|---|---|
| Tier | "Seed" (authenticated) | Anonymous |
| Delay between requests | 6s | 16s |
| Watermark | None | **Possible** — anonymous requests may be watermarked at Pollinations' discretion, `nologo: true` is sent but isn't a guarantee |
| Failure mode if key is rejected | Auto-retries the same request anonymously (HTTP 402 handling) | N/A |

Get a free key at https://pollinations.ai. Missing the secret is not a hard failure — the pipeline runs anonymously and just gets slower and watermark-risked, unlike Pexels/Giphy where a missing key means no content.

### Real time budget — a 5-minute hard ceiling exists

`image-gen.js` spawns Python with `timeout: 5 * 60 * 1000` (5 minutes) for the **entire batch**, not per image. `generate_images.py` prints its own ETA estimate up front (`(20s + delay) × image count`) — use that math to sanity-check a large batch before it runs:

| Scenario | Per-image cost | Images before hitting the 5-min ceiling |
|---|---|---|
| With API key (6s delay) | ~26s | ~11 images |
| Without API key (16s delay) | ~36s | ~8 images |

A run with more `ai-image` layers than that will have `spawnSync` kill the Python process mid-batch — every image that hadn't finished yet gets the flat placeholder fallback (see below), not a queued retry on the next run. If you're generating for a long multi-scene video, budget accordingly or split image-heavy scenes across separate config runs.

---

## Prompt Writing Guide

**Be specific about composition:**
```
❌  'a city'
✅  'aerial view of a modern African city at night, lights reflecting on wet streets'
```

**Include lighting — still the single biggest quality factor, Flux included:**
```
❌  'a savanna'
✅  'African savanna at golden hour, dramatic storm clouds, foreground acacia tree'
```

**Match model to subject:**
```js
// Documentary / real world → realistic (flux-realism)
{ prompt: 'Busy street market in Harare, vendors, natural light', model: 'realistic' }

// Fantasy / story / cinematic → dreamshaper (flux) — the default
{ prompt: 'Ancient African kingdom at night, torchlight, stone walls', style: 'dark' }

// Anime / stylized → any of the three anime keys, all identical now
{ prompt: 'warrior standing on a cliff at dawn', model: 'flux-anime', animeStyle: 'anime-fantasy' }
```

**What it cannot do — avoid these regardless of model:**
- Specific named people or faces (will guess badly, sometimes uncannily)
- Readable text inside the image (use a `text` layer on top instead — Flux's text rendering is inconsistent at best)
- Specific brand logos or recognizable marks
- Anything requiring a negative prompt to suppress — there's no negative-prompt parameter in this pipeline, so if a prompt reliably produces an unwanted element, the only lever is rephrasing the positive prompt, not excluding a term

---

## Config Examples

### Documentary — real backend per scene

```js
{
    tts: { text: 'Zimbabwe has one of the youngest populations in the world.' },
    layers: [
        {
            type:    'ai-image',
            prompt:  'Busy African city street, young people walking, vibrant market stalls',
            style:   'documentary',
            model:   'realistic',
            x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
        },
        { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
        { type: 'text', text: 'YOUNGEST CONTINENT', y: 400,
          fontSize: 88, color: '#fff', align: 'center', animation: 'pop' },
    ],
},
```

### Storytelling — scene-by-scene narrative

```js
{
    tts: { text: 'In the beginning, there was nothing but darkness.' },
    layers: [
        { type: 'ai-image', prompt: 'Deep space, nebula, cosmic void, stars',
          style: 'dark', model: 'flux',
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
        { type: 'overlay', color: 'rgba(0,0,0,0.3)' },
        { type: 'text', text: 'CHAPTER ONE', y: 960,
          fontSize: 96, color: '#fff', align: 'center', animation: 'fade' },
    ],
},
{
    tts: { text: 'Then light broke through.' },
    layers: [
        { type: 'ai-image', prompt: 'Bright sunrise breaking over mountains, golden rays',
          style: 'cinematic', model: 'dreamshaper',
          x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
        { type: 'text', text: 'THE LIGHT', y: 960,
          fontSize: 96, color: '#fff', align: 'center', animation: 'pop' },
    ],
},
```

### Mixed — some AI, some gradient (faster overall, avoids the 5-min ceiling)

```js
// Scene 1: instant gradient — no API call at all
{
    tts: { text: 'Welcome.' },
    layers: [
        { type: 'gradient', colors: ['#0a0014', '#000008'], gradientType: 'radial' },
        { type: 'avatar', x: 540, y: 1100, size: 220, expression: 'happy' },
    ],
},
// Scene 2: AI background — only this scene fires a Pollinations request
{
    tts: { text: 'Today we look at the Sahara.' },
    layers: [
        { type: 'ai-image', prompt: 'Sahara desert dunes at sunset, vast empty landscape',
          style: 'aerial', x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
        { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
        { type: 'text', text: 'THE SAHARA', y: 350,
          fontSize: 110, color: '#fff', align: 'center' },
    ],
},
```

---

## Failure Behavior

Two independent fallback layers, in order:

1. **Per-image, inside Python:** 3 retries with increasing backoff (`delay × attempt`). If all 3 fail, `fallback_png()` writes a flat `#0a0a0a` placeholder PNG directly to that image's `outPath` via Pillow — the batch keeps going to the next image rather than aborting.
2. **Whole-batch, inside Node:** if `spawnSync` itself fails non-zero (crash, or the 5-minute timeout killing it mid-batch), `applyGeneratedImages()` checks each task's `outPath` — any that exist (including step-1 placeholders) become `image` layers as normal; any that were never written at all (Python never got to them) become a `background` layer with color `#0a0a12` instead.

Either way, a Pollinations outage or a too-large batch degrades gracefully to visibly-empty-looking scenes, not a failed render.

---

## Cache Behaviour

```yaml
# .github/workflows/generate-video.yml
- name: Cache AI generated images
  uses: actions/cache@v4
  with:
    path: work/ai-images
    key: ai-images-${{ runner.os }}-${{ hashFiles('config.js') }}-v3
```

| Scenario | Result |
|---|---|
| Same `config.js` pushed again | All images reused — Python skips entirely |
| Any prompt/style/model changed | Full cache miss — all images regenerate |
| Want to force regenerate everything | Bump `-v3` → `-v4` in the cache key |
| Only some images missing on disk | Only the missing ones generate — cached ones reused (checked per-file, not per-run) |

### ⚠️ The cache key hashes `config.js` literally, not `$VIDEO_CONFIG`

`hashFiles('config.js')` is a hardcoded filename — if you're actually running with a different file (e.g. `VIDEO_CONFIG=config.test-all.js`, as used for the July 2026 regression test config), this cache key does **not** reflect that file's content. It'll hit or miss based on whatever `config.js` happens to contain, unrelated to the config actually driving the run. Worth fixing to hash `${{ github.event.inputs.config || 'config.js' }}` if you're routinely testing with alternate config files — flagging it here rather than changing it, since this doc pass was scoped to the image-gen docs specifically.

---

## Files in Your Repo

```
src/
├── image-gen.js           ← Node orchestrator (called by engine-ci.js)
└── generate_images.py     ← Python Pollinations client (spawned by image-gen.js)
```

Do not rename these files — `image-gen.js` references `generate_images.py` by hardcoded relative path from `src/`.