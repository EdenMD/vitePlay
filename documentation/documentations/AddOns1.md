# APEX Engine — AddOns1.md
### v2.6 Feature Drop: Voice Editing · SVG Draw · Stickman System · Reflow/List-Reveal Fixes

---

## 1. Voice Editing (Chipmunk / Bass / Robot / Echo / Fast / Slow)

**What it does:** Applies an audio effect to generated TTS as a post-process step, independent of which TTS backend (Kokoro or espeak fallback) produced it.

**Usage:**
```js
scenes: [{
  tts: {
    text: 'This is a chipmunk talking!',
    voice: 'af_heart',
    voiceFX: 'chipmunk',          // preset string
    effectStrength: 1.0,           // 0.3–2.0, scales how intense the effect is
  }
}]
```
Custom effect instead of a preset:
```js
tts: { text: '...', voiceFX: { pitch: 1.35, preserveDuration: false } }
tts: { text: '...', voiceFX: { tempo: 1.4 } }                 // pure speed change
tts: { text: '...', voiceFX: { robot: true, echo: true } }    // combine effects
```
Presets available:
- Pitch family: `chipmunk`, `helium` (higher), `deep`, `bass`, `demon`, `giant` (lower)
- Tempo only (pitch stays natural): `fast`, `slow`
- Texture: `robot` (metallic/comb-filtered via flanger), `echo` (delayed-repeat tail via aecho)

`effectStrength` (0.3–2.0, default 1.0) scales every effect type — pushes pitch/tempo further from neutral, or increases robot/echo intensity. You can also set `config.defaults.voiceFX`/`effectStrength` to apply one effect to every scene that doesn't override it.

`preserveDuration: true` (pitch effects only) keeps speech length the same and shifts pitch only. Leave it `false` (default) for the classic chipmunk/demon effect, where speed changes along with pitch.

**When to use it:** comedic voiceover beats, character voices for skits, "narrator vs character" contrast in a single scene, kid/monster reveal gags, robotic-AI-narrator bits (`robot`), haunted/distant-voice moments (`echo`), meme-style content, pacing tricks (`fast`/`slow` without altering pitch).

**When NOT to use it:** factual/serious narration scenes — most of these effects are audibly artificial and will undercut credibility-driven content (e.g. history facts, stats explainers). `fast`/`slow` are the exception — used subtly (`effectStrength` ~1.1–1.2) they're closer to a pacing adjustment than a gag.

**Impact on the engine:** purely additive — `voiceFX`/`effectStrength` are optional and undefined by default, so every existing config renders byte-identical audio. It hooks in as a single ffmpeg post-process pass (one `-af` filter chain covering whichever dimensions are requested), so it costs one extra subprocess call only on scenes that opt in.

---

## 2. SVG Draw (`type: 'svg-draw'`)

**What it does:** Takes SVG path data — inline or loaded from an external `.svg` file — and either renders it statically or animates it "drawing itself" on screen over time, optionally filling once the stroke completes.

**Usage — inline paths:**
```js
{
  type: 'svg-draw',
  x: 540, y: 700,
  scale: 1,
  drawDur: 1.4,        // seconds to trace one path
  stagger: 0.15,        // delay between each path starting
  fillAfter: true,       // fill with stroke color once traced
  paths: [
    { d: 'M10 10 L90 10 L90 90 L10 90 Z', stroke: '#ffffff', strokeWidth: 6 },
    { d: 'M20 50 C 20 20, 80 20, 80 50', stroke: '#6deaf8', fill: '#1a1a3e' },
  ],
}
```

**Usage — external `.svg` file:**
```js
{ type: 'svg-draw', src: './assets/svg/house.svg', x: 200, y: 800,
  width: 400, height: 400 }                    // static render — default for `src`

{ type: 'svg-draw', src: './assets/svg/tree.svg', x: 600, y: 800,
  width: 250, height: 300, animate: true, animDur: 1.5 }   // draw-on animation
```
`width`/`height` fit the source file's `viewBox` into that box (uniform scale, aspect preserved). The file parser supports `<path>`, `<rect>`, `<circle>`, `<line>`, `<polyline>`, and `<polygon>` — a deliberate subset, not full SVG/CSS, but enough for hand-authored icon and scenery assets (see the bundled set in `assets/svg/`).

Supports path commands `M L H V C S Q Z` (covers the vast majority of generated/hand-drawn icon and logo paths). `A` (arc) is **not** supported — it falls back to a straight line to the arc's endpoint with a one-time console warning.

**When to use it:** logo reveals, icon-draw intros, signature/underline-style emphasis on text, hand-drawn diagram callouts, "connecting the dots" explainer beats, static scenery placement (house/tree/road/building/cloud) behind a stickman scene, custom shapes you don't already have as a built-in layer type.

**When NOT to use it:** complex multi-hundred-point traced illustrations in **animated** mode — every path is re-flattened and measured at full per-frame stroke length, so very dense paths cost more per frame than a static image layer would. Static mode (the default for `src`) doesn't have this cost. For background art, use `image` instead and save `svg-draw` for the moment something needs to feel hand-drawn or vector-placed.

**Impact on the engine:** brand-new layer type, zero effect on anything existing. Lazy-loaded the same way `layers-extra.js` types are, so scenes that never use `svg-draw` pay no load cost for it. The file loader caches per source path (shared across layers referencing the same asset), so reusing `house.svg` across many scenes only parses the file once.

---

## 3. Stickman Character System

**What it does:** A fully procedural stick-figure rig — locomotion, dance, facial expressions, discrete gestures, thought/speech bubbles, and a unified timeline API — plus a small scenery kit (house, tree, road, building, cloud) to put the character in a scene.

### 3a. The character — `type: 'stickman'`
```js
{
  type: 'stickman',
  x: 300, y: 1500,        // hip anchor (ground-x, hip-height-y)
  scale: 1,
  color: '#ffffff',
  lineWidth: 10,

  action: {
    type: 'walk',            // 'walk' | 'run' | 'jump' | 'moonwalk' | 'dance' | 'idle'
    style: 2,                  // 1-4, OR for dance also a name: 'hype'|'floss'|'wave'|'bounce'
    from: { x: 100 }, to: { x: 800 },
    startAt: 0, duration: 3,
  },

  expression: 'scratch-head',   // see list below
  gesture: 'point-right',        // see list below — independent of expression
  thoughtBubble: { text: 'Hmm, where am I?', startAt: 1, duration: 2.5 },
}
```

**Locomotion types:** `walk` (4 styles: `1` normal, `2` bouncy/cartoon, `3` sneaky crouch, `4` fast jog), `run` (faster cadence than walk style 4), `jump` (single parabolic hop over the action's duration — set `height` to control how high), `moonwalk` (stylized backward-glide approximation with leg slide + torso lean — not biomechanically literal, but reads as a moonwalk). All four accept `action.from`/`action.to` to move the character across the frame.

**Dance styles:** numbered `1`-`4` (`1` groove/wave, `2` disco point, `3` robot dance, `4` jump dance) **or** named styles as a string in `action.style`: `'hype'` (enthusiastic arm-pump + hop), `'floss'` (the floss — opposite-arm front/back swing + hip counter-swivel), `'wave'` (crowd-wave style overhead arm wave), `'bounce'` (simple loose vertical bounce). Set `action.loop: true` to repeat for the scene's duration.

**Expressions** (face + optional whole-gesture overlay): `neutral`, `happy`, `sad`, `surprised`, `talking` (animated mouth, sync to VO), `thinking`, `scratch-head`, `excited`, `angry`, `shout`.

**Gestures** (independent of expression — set both at once if you want a specific face + a specific arm pose): `point-right`, `point-left`, `thumbsup`, `arms-up`, `wave-right`, `wave-left`, `facepalm`, `scratch-head`. A gesture wins on whichever arm(s) it touches even if an expression also wanted to move that arm.

**Manual joint control** — for anything the canned actions don't cover, drive limbs directly with keyframes (overrides the action for that joint only):
```js
pose: {
  rightArm: [ { t: 0, angle: -20 }, { t: 1.2, angle: 90 } ],
  leftArm:  [ { t: 0, angle: 200 } ],
}
```
Angle `0` = limb pointing straight down from its socket; positive degrees rotate clockwise.

**Sequence timeline** — an alternative to setting `action`/`expression`/`gesture`/`thoughtBubble` directly: one array drives the whole performance, switching at each entry's `t`:
```js
sequence: [
  { t: 0,   action: 'idle' },
  { t: 1.5, action: 'walk', toX: 800, duration: 2.0, style: 1 },
  { t: 3.5, action: 'dance', style: 'hype', duration: 1.5 },
  { t: 5.0, action: 'surprised' },
  { t: 6.0, action: 'thought', text: 'wait what?', duration: 2 },
]
```
Each entry's `action` can be a locomotion/dance type, an expression name, a gesture name, or `'thought'`/`'speech'` (with `text`). The engine carries hip position forward automatically across `toX` moves, so `walk` -> `dance` -> `surprised` -> `thought` chains without manual coordinate bookkeeping. Note: expression/gesture/bubble segments hold an idle stance underneath — combining a face change *while* mid-walk in the same segment isn't supported by the sequence API (use `action`+`expression` directly on the layer for that, outside of `sequence`).

### 3b. Scenery — `type: 'scene-prop'`
```js
{ type: 'scene-prop', propType: 'house', x: 200, y: 1800, scale: 1.2, color: '#e8d8b8' }
{ type: 'scene-prop', propType: 'tree',  x: 700, y: 1800, scale: 1.0 }
{ type: 'scene-prop', propType: 'road',  x: 540, y: 1850, scroll: true, scrollSpeed: 200 }
```
For `building` and `cloud`, use the `svg-draw` layer with the bundled asset files instead (`assets/svg/building.svg`, `assets/svg/cloud.svg`) — see Section 2.

**When to use the stickman system:** explainer skits, "two characters talking" scenes, lightweight storytelling beats where a full avatar/illustration would be overkill, history/psychology narratives that benefit from a simple visual stand-in for a person, comedic reaction shots (paired with an expression/gesture + thought bubble), multi-beat mini-scenes via `sequence` (walk in -> react -> dance -> think).

**When NOT to use it:** anything needing a recognizable, detailed, or branded character — this is intentionally a minimal stick-figure, not a character-design tool. If the video needs a specific-looking host, use the existing `avatar` layer instead.

**Impact on the engine:** brand-new layer types (`stickman`, `scene-prop`), lazy-loaded, zero effect on existing scenes. Both types are registered as reflow/layout-exempt (`EXEMPT_TYPES` / `PASSTHROUGH_TYPES`) since they manage their own on-screen geometry — they will never be repositioned or resized by the text-reflow or layout systems, so they behave predictably wherever you place them.

---

## 4. Bug Fixes — Reflow / Caption-Zone & List-Reveal Overlap

These were existing engine bugs, fixed as part of this same update (no new config needed — fixes apply automatically).

### 4a. Text shrinking into nothing and sitting behind captions
**Root cause:** three different "safe bottom" boundaries existed across the engine and disagreed with each other and with where captions actually render — `layers.js` reflow used `1620`, `layout.js` used `1780`, the comparison-bar reflow used a separate `H*0.84` (≈1612.8), and the real caption box (computed from `captions.js`) sits around `1542–1645` for default settings. On top of that, the old reflow shrunk a layer's font *before* trying to move it, so a layer placed low on screen would collapse toward an 18px floor instead of simply sliding up.

**Fix:** added `getCaptionZone()` in `captions.js` as the single source of truth, computed per-scene from that scene's actual caption config (position/fontSize/yOffset). Both `layout.js` and `layers.js` now pull this real boundary instead of a guessed constant, and the reflow sweep now tries repositioning a layer up first, only shrinking the font as a last resort when there's genuinely no room left.

**Impact:** any scene with captions now keeps body text legible and clear of the caption track automatically. No more tiny, crushed text appearing to "hide" behind the caption bar — this was a correctness fix to the core text-safety system every scene relies on, not a cosmetic tweak.

### 4b. List-reveal items overlapping when an item wraps to two lines
**Root cause:** both the renderer (`drawListReveal`) and its reflow pass assumed every list item is exactly one line tall and positioned item N at `y + N * lineHeight`. Any item that actually wrapped to two lines pushed item N+1 to start on top of it.

**Fix:** added a shared `wrapTextToLines()` helper used by both the reflow measurement pass and the live renderer, so line counts always agree. A true cumulative cursor now tracks how many lines each prior item actually used before placing the next one.

**Impact:** `list-reveal` layers with longer bullet text (the common case for "3 things you didn't know about X" style videos) now render correctly every time instead of only working by luck when every item happened to fit on one line.

---

## 5. Files Changed / Added — Summary

| File | Status | What changed |
|---|---|---|
| `src/captions.js` | Changed | Added `getCaptionZone()` — the real per-scene caption bounding box, now the shared source of truth for caption-safe layout. |
| `src/layout.js` | Changed | Fixed `SAFE_BOTTOM` mismatch (1780 → 1620, now matches `layers.js`); `resolveLayout()`/`applyLayout()`/`applyLinear()`/`applyStack()`/`applyRelative()`/`clampToSafeZone()` now thread a per-scene caption-aware bound instead of one fixed constant; new types added to `PASSTHROUGH_TYPES`. |
| `src/layers.js` | Changed | Removed dead `CAPTION_TOP` constant; `reflowLayers()` now computes the real caption zone per scene and reorders the overflow sub-pass to reposition before shrinking; `reflowCompound()` (list-reveal, comparison, split-screen) now uses the unified boundary instead of three disagreeing constants; fixed list-reveal's line-counting bug in both reflow and `drawListReveal()`; added `wrapTextToLines()` helper; wired dispatcher cases for `svg-draw`, `stickman`, `scene-prop`; added those three types to `EXEMPT_TYPES`. |
| `src/tts-kokoro.js` | Changed | Added `VOICE_FX_PRESETS` (now incl. `robot`/`echo`/`fast`/`slow`), `resolveVoiceFX()` (now `strength`-aware), `applyVoiceFX()` (general dispatcher — pitch/tempo/robot/echo in one ffmpeg pass), `applyPitchShift()` (kept as a thin back-compat wrapper), `buildAtempoChain()`, `getAudioSampleRate()`; `generateTTS()` applies FX after either backend (Kokoro or espeak) produces audio. New exports: `applyVoiceFX`, `applyPitchShift`, `resolveVoiceFX`, `VOICE_FX_PRESETS`. |
| `engine-ci.js` | Changed | `generateAllTTS()` now passes `scene.tts.voiceFX` and `scene.tts.effectStrength` (or the `config.defaults` equivalents) through to `generateTTS()`. |
| `src/svg-draw.js` | Changed (new file, then extended) | SVG path parser/flattener (`M L H V C S Q Z`) + progressive stroke/fill renderer. Extended with `loadSvgFile()` / `extractShapesAsPaths()` / `parseViewBox()` for loading external `.svg` files (`<path>`/`<rect>`/`<circle>`/`<line>`/`<polyline>`/`<polygon>`), `width`/`height` viewBox-fit scaling, and a static (non-animated) render mode that's now the default for `src`-loaded files. |
| `src/stickman.js` | Changed (new file, then extended) | Procedural stickman rig. Extended with `run`/`jump`/`moonwalk` locomotion types, named dance styles (`hype`/`floss`/`wave`/`bounce`) alongside the original numbered 1-4 set, a `GESTURES` map (`point-right/left`, `thumbsup`, `arms-up`, `wave-right/left`, `facepalm`, `scratch-head`) independent of facial expressions, a `shout` expression, `torsoLean` support (used by moonwalk), and a `sequence: [{t, action, ...}]` unified timeline resolver (`getResolvedSequence()`/`findActiveSegment()`) as an alternative to setting `action`/`expression`/`gesture`/`thoughtBubble` directly. |
| `assets/svg/house.svg`, `tree.svg`, `road.svg`, `building.svg`, `cloud.svg` | **New** | Hand-authored scenery assets loadable via `svg-draw`'s new `src` option — closes the "SVG assets" gap from the original feature discussion (`building`/`cloud` are new on top of the original `scene-prop` house/tree/road). |
| `documentations/AddOns1.md` | New, then updated | This file — updated in the same pass to document every v2.6.1 gap-closing addition above. |

Nothing was removed from any public function signature — every change is additive or fixes incorrect output, so existing configs continue to work without modification.
