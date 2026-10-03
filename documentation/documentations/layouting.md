# Layout System — Feature Documentation

A pre-render layout pass that computes `x`/`y` for layers automatically, using the same mental model as XML/Android layouts. No more manually calculating coordinates — declare how layers should relate to each other and the engine places them.

---

## Why This Exists

The old reflow system was a collision resolver — it moved layers *after* you placed them badly. The layout system is the opposite: you never place them manually at all. The engine measures each layer's natural size and assigns positions before a single frame is drawn.

The two systems coexist. Scenes without a `layout` declaration use reflow as before. Scenes with `layout` skip reflow entirely. You migrate scene by scene, at your own pace.

**Eight layout types now exist.** The first three (`linear`, `stack`, `relative`) were the original set. `grid` and `anchor` were added for common fixed-arrangement cases. `flex` and `css` were added most recently as general-purpose escape hatches — ported directly from CSS flexbox and CSS inset positioning — for anything the named presets don't cover cleanly. `absolute` is the no-op passthrough. Nothing has been removed; pick whichever fits the scene.

| Type | Use it for |
|---|---|
| `linear` | A simple vertical/horizontal stack of text blocks — the most common case |
| `stack` | Several layers sharing one anchor point (icon + label + badge) |
| `relative` | A chain where each layer's position depends on the previous one's actual size |
| `grid` | A fixed rows×cols arrangement — stat rows, icon rows, comparisons |
| `anchor` | Snapping labels to corners/edges — badges, watermark-style overlays |
| `flex` | Anything with an uneven item count, wrapping rows, or CSS-style space distribution |
| `css` | Literal per-child `top`/`left`/`right`/`bottom` insets — the true fallback when nothing named fits |
| `absolute` | Explicit hardcoded `x`/`y`, layout pass is a no-op |

---

## How It Works

```
engine-ci.js Phase -0.75 (pre-render, runs once)
  ↓
resolveLayout(scenes)
  → walks every scene that has a scene.layout declaration
  → measures each child layer's natural bounding box (text height, shape size, etc.)
  → assigns x/y to every child based on the layout type
  → marks scene.__layoutResolved = true

renderScene() → prepareScene()
  → sees __layoutResolved = true
  → skips reflow entirely for this scene
  → draws layers with already-resolved positions
```

Positions are mutated once and cached. The render loop sees fully resolved `x`/`y` on every layer — zero overhead per frame.

---

## The Eight Layout Types

### `linear` — Stack children along an axis

Children are arranged top-to-bottom (`column`) or left-to-right (`row`). The engine measures each child's natural height/width and advances a cursor, adding `gap` between them. No manual `y` coordinates needed on any child.

```js
// Scene with linear column layout
{
  layout: {
    type:      'linear',
    direction: 'column',   // 'column' (default) | 'row'
    x:         540,        // horizontal anchor for all children
    y:         320,        // top of first child
    gap:       36,         // pixels between children
    align:     'center',   // 'start' | 'center' | 'end'
    padding:   [48, 40],   // [top/bottom, left/right] inside container
  },
  layers: [
    { type: 'gradient', colors: ['#0d0221', '#1a1a3e'] }, // exempt — not positioned
    { type: 'text', text: 'THE TITLE',    fontSize: 88, color: '#fff'  }, // y computed
    { type: 'text', text: 'The subtitle', fontSize: 44, color: '#aaa'  }, // y computed
    { type: 'text', text: 'Body copy here', fontSize: 32, color: '#888' }, // y computed
  ],
}
```

**Row direction** works the same way horizontally — children are placed left to right with `gap` between them.

```js
layout: {
  type:      'linear',
  direction: 'row',
  x:         100,    // left edge of first child
  y:         960,    // vertical anchor for all children
  gap:       40,
  align:     'center',
}
```

---

### `stack` — All children share one anchor point

Every child gets the same `x`/`y`. Array order is z-order — first layer is at the bottom, last is on top. Use `stackOffsetX`/`stackOffsetY` on individual children to nudge them within the stack.

```js
{
  layout: {
    type:  'stack',
    x:     540,
    y:     960,
    align: 'center',
  },
  layers: [
    { type: 'shape',  ... },              // bottom — behind everything
    { type: 'image',  src: '...' },       // middle
    { type: 'text',   text: 'LABEL',
      stackOffsetY: 180 },                // top — nudged 180px down from centre
  ],
}
```

---

### `relative` — Each child anchors to a named sibling

Children declare `relativeTo: 'sibling-id'` and `anchor: 'below'` (or `above`, `right-of`, `left-of`, `center-of`). The engine resolves the dependency chain in topological order — each layer is placed only after its anchor layer is fully resolved.

```js
{
  layout: { type: 'relative' },
  layers: [
    { type: 'gradient', colors: ['#0a0a1a', '#0d1b2a'] },

    // Root — has explicit y, everything else hangs off it
    { id: 'badge',
      type: 'text', text: '👀 POV',
      x: 540, y: 148,
      fontSize: 44 },

    // Placed 48px below badge automatically
    { id: 'title',
      type: 'text', text: 'window seat.\nnobody asked you anything.',
      relativeTo: 'badge', anchor: 'below', offset: 48,
      fontSize: 82, align: 'center' },

    // Placed 60px below title automatically
    { id: 'subtitle',
      type: 'text', text: '(happens every time)',
      relativeTo: 'title', anchor: 'below', offset: 60,
      fontSize: 38, color: 'rgba(255,255,255,0.6)' },

    // Placed 80px below subtitle
    { id: 'cta',
      type: 'notification-card',
      relativeTo: 'subtitle', anchor: 'below', offset: 80,
      title: 'tag a window seat thinker', body: 'they know who they are' },
  ],
}
```

**Anchor values:**

| Value | Behaviour |
|---|---|
| `below` | child top edge = anchor bottom edge + offset |
| `above` | child bottom edge = anchor top edge − offset |
| `right-of` | child left edge = anchor right edge + offset |
| `left-of` | child right edge = anchor left edge − offset |
| `center-of` | child x/y = anchor x/y (same as stack, one pair) |

---

### `grid` — Fixed rows × cols arrangement

Children fill a grid left-to-right, top-to-bottom. No coordinate math — declare the grid shape once and every child just gets the next cell. Best for stat comparisons, icon rows, or any fixed-count item set.

```js
{
  layout: {
    type:  'grid',
    cols:  2, rows: 2,
    x:     540, y: 900,       // grid centre
    cellW: 460, cellH: 300,   // per-cell size
    gapX:  40,  gapY: 40,     // spacing between cells
  },
  layers: [
    { type: 'gradient', colors: ['#1a0010', '#000'] },
    { type: 'text', text: '92%',  fontSize: 90, color: '#ff3b5c' },
    { type: 'text', text: '4.8M', fontSize: 90, color: '#ff8c00' },
    { type: 'text', text: '17x',  fontSize: 90, color: '#3bd1ff' },
    { type: 'text', text: '#1',   fontSize: 90, color: '#7cff3b' },
  ],
}
```

`cols`/`rows` default to filling a roughly-square grid from the child count if omitted. `cellW`/`cellH` default to dividing the container evenly. If a cell's content is too tall for `cellH`, it fits/shrinks within that cell only — it never spills into a neighboring cell.

---

### `anchor` — Snap to one of 9 compass points

The fastest way to say "put this in the corner" without any coordinate math — the same mental model as CSS `object-position`.

```js
{
  layout: { type: 'anchor', padding: [140, 48] },  // [vertical, horizontal] inset from the edges
  layers: [
    { type: 'gradient', colors: ['#001a1a', '#000'] },
    { type: 'text', text: 'BREAKING',    anchorPoint: 'top-left',     fontSize: 40 },
    { type: 'text', text: '5.4M views',  anchorPoint: 'bottom-right', fontSize: 40 },
    { type: 'text', text: 'EPISODE 3',   anchorPoint: 'top-center',   fontSize: 40 },
    { type: 'text', text: 'SWIPE UP',    anchorPoint: 'bottom-center',fontSize: 40 },
    { type: 'text', text: 'LIVE NOW',    anchorPoint: 'center',       fontSize: 64 },
  ],
}
```

`anchorPoint` (set per-child): `top-left` \| `top-center` \| `top-right` \| `center-left` \| `center` \| `center-right` \| `bottom-left` \| `bottom-center` \| `bottom-right`. Any child without a recognized `anchorPoint` defaults to `center`.

---

### `flex` — CSS flexbox, ported directly

For anything with an uneven item count, rows that need to wrap, or CSS-style space distribution that `grid`/`anchor` are too rigid for. Same mental model as `display: flex` — `direction`, `wrap`, `justify` (main axis), `align` (cross axis), `gap`.

```js
{
  layout: {
    type:      'flex',
    direction: 'row',              // 'row' | 'column'
    wrap:      true,               // wrap onto a new line when the row fills up
    justify:   'space-between',    // 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
    align:     'center',           // cross-axis: 'start' | 'center' | 'end'
    gap:       20,
    x: 540, y: 900, width: 900, height: 400,  // container box
  },
  layers: [
    { type: 'gradient', colors: ['#0a0a1a', '#000'] },
    { type: 'text', text: '#comedy',   fontSize: 36 },
    { type: 'text', text: '#relatable',fontSize: 36 },
    { type: 'text', text: '#fyp',      fontSize: 36 },
    { type: 'text', text: '#viral',    fontSize: 36 },
    { type: 'text', text: '#trending', fontSize: 36 },
  ],
}
```

This is the layout to reach for the moment you find yourself hand-tuning `x`/`y` for a variable-length list — a hashtag row, a chip list, a row of avatars that might be 3 or might be 7. `wrap: true` handles overflow automatically instead of the row running off the safe zone.

---

### `css` — Literal CSS-style insets

The true fallback: when none of the named presets fit, position each child exactly the way you would in a stylesheet. `top`/`left`/`right`/`bottom` per child (pixels or `'NN%'` strings, percentage of the container), plus `translate: [xPct, yPct]` — a direct port of the classic `top:50%; left:50%; transform:translate(-50%,-50%)` centering trick, applied as a percentage of the child's *own* size.

```js
{
  layout: { type: 'css' },   // container defaults to the full safe zone
  layers: [
    { type: 'gradient', colors: ['#060010', '#000'] },

    // 40px from the top-left corner
    { type: 'text', text: 'TOP LEFT 40PX',
      css: { top: 40, left: 40 }, fontSize: 40 },

    // 5% in from the bottom-right corner
    { type: 'text', text: 'BOTTOM RIGHT 5%',
      css: { bottom: '5%', right: '5%' }, fontSize: 40 },

    // Dead center — the CSS centering trick, ported directly
    { type: 'text', text: 'DEAD CENTER',
      css: { top: '50%', left: '50%', translate: [-50, -50] }, fontSize: 64 },

    // Halfway down the left edge — only the y-axis needs translate
    { type: 'text', text: 'MID-LEFT',
      css: { top: '50%', left: 0, translate: [0, -50] }, fontSize: 40 },
  ],
}
```

If both `left` and `right` are given, `left` wins. If neither horizontal nor vertical inset is given, that axis centers in the container by default. `layout.width`/`layout.height`/`layout.x`/`layout.y` override the container box (defaults to the full safe zone).

---

### `absolute` — Explicit coordinates, layout is a no-op

This is the existing default behaviour. No `layout` key needed — just set `x`/`y` on every layer manually. If you do declare `layout: { type: 'absolute' }`, the pass runs but does nothing.

---

## Per-Child Options

These go on individual layer objects inside a layout scene:

| Property | Type | Default | Description |
|---|---|---|---|
| `id` | string | — | Identifier for `relativeTo` anchoring |
| `relativeTo` | string | — | ID of sibling to anchor to (relative layout only) |
| `anchor` | string | `'below'` | Which edge to anchor against |
| `offset` | number | `0` | Pixel gap from the anchor edge |
| `layoutAlign` | string | container's `align` | Per-child alignment override |
| `stackOffsetX` | number | `0` | X nudge within a stack |
| `stackOffsetY` | number | `0` | Y nudge within a stack |
| `noLayout` | boolean | `false` | Exempt this child from layout completely |

---

## Container Options

Universal options go on every `scene.layout` object:

| Property | Type | Default | Description |
|---|---|---|---|
| `type` | string | `'absolute'` | `'linear'` \| `'stack'` \| `'relative'` \| `'grid'` \| `'anchor'` \| `'flex'` \| `'css'` \| `'absolute'` |
| `x` | number | `540` | Horizontal anchor (centre of canvas by default) |
| `y` | number | `140` | Top of first child / vertical anchor |
| `padding` | number or `[v, h]` | `[0, 0]` | Inset from anchor point before placing first child |

Type-specific options:

| Property | Applies to | Default | Description |
|---|---|---|---|
| `direction` | `linear`, `flex` | `'column'` / `'row'` | `'column'` \| `'row'` |
| `gap` | `linear`, `flex` | `24` | Pixels between children |
| `align` | `linear`, `flex` | `'center'` | `linear`: `'start'`\|`'center'`\|`'end'` — `flex`: cross-axis alignment |
| `wrap` | `flex` | `false` | Wrap onto a new line when the container fills up |
| `justify` | `flex` | `'start'` | `'start'`\|`'center'`\|`'end'`\|`'space-between'`\|`'space-around'`\|`'space-evenly'` |
| `width`, `height` | `flex`, `css` | full safe zone | Container box size |
| `cols`, `rows` | `grid` | auto from child count | Grid shape |
| `cellW`, `cellH` | `grid` | container / cols / rows | Per-cell size |
| `gapX`, `gapY` | `grid` | `32` | Spacing between cells |
| `anchorPoint` | `anchor` (per-child) | `'center'` | One of the 9 compass points |
| `css` | `css` (per-child) | — | `{ top, left, right, bottom, translate: [x%, y%] }` |
| `minFontSize` | any (per-child) | `30` | Per-child override of the readable floor before shrink hits the hard floor |

---

## Layer Types That Are Layout-Exempt

These are full-frame elements with no meaningful height — the layout system always skips them regardless of `noLayout`:

`gradient`, `overlay`, `background`, `image`, `image-sequence`, `giphy`, `html-record`, `waveform`, `audio-reactive-border`, `scanlines`, `grid`, `particles`, `avatar`

They still render normally — they just don't participate in position calculation.

---

## Reflow vs Layout — When to Use Which

| Situation | Use |
|---|---|
| Existing scene that already works | Keep reflow — don't touch it |
| New scene with stacked text blocks | `linear` |
| Icon + label + badge combo | `stack` with `stackOffsetY` |
| Complex scene where layers depend on each other's size | `relative` |
| Fixed-count stat/icon comparison | `grid` |
| Corner badges, watermark-style labels | `anchor` |
| Variable-length list, wrapping hashtag/chip row | `flex` |
| Nothing named above fits | `css` |
| Scene where you need pixel-perfect placement | `absolute` (or no layout key at all) |
| Scene with only one or two text layers | Either — reflow handles it fine |

The key rule: **a scene uses one or the other, never both.** Declaring `scene.layout` switches off reflow for that scene completely.

---

## How Overflow Is Actually Handled (Reflow *and* Layout)

Both systems share the same underlying fit logic when a text block doesn't fit its box — whether that box came from reflow's collision detection or from a layout preset's cell/anchor/flex-line/inset. The order of operations, cheapest to most destructive:

1. **Reposition first.** Reflow tries sliding the block up (or, in `linear`/`stack`/`relative`/`grid`/`anchor`/`flex`/`css`, placing it correctly the first time) before touching size at all.
2. **Widen the box** toward the safe-zone width, if it isn't already there. Most text blocks default to near-full safe width already, so this step often has little room to work with — it's cheap when it applies, but it's not the main lever.
3. **Tighten line-height** from the 1.2 default down to a 1.0 floor. This is the step that actually recovers meaningful space for a multi-line block — roughly 15% less vertical height with no visible quality loss — and it now runs *before* font-size is touched at all.
4. **Shrink the font**, binary-searched down to a 30px readable floor (`minFontSize` on the layer overrides this per-child).
5. **Hard floor at 18px** — a true last resort, used only if steps 1–4 genuinely can't make it fit. This used to be where reflow landed by default any time a block was too tall; now it's the exception, not the rule.

If you see text still landing near 18px, that means the content genuinely doesn't fit even at max width and tightest line spacing — the actual fix at that point is shorter copy, not layout, since further engine cleverness would just make it correct-but-unreadable.

---

## Safe Zone

The layout system enforces the same safe zone as reflow:

```
SAFE_TOP    = 140px   — above this: series badge / hook label only
SAFE_BOTTOM = 1620px  — below this: caption track lives (±260px)
SAFE_LEFT   = 40px
SAFE_RIGHT  = 1040px
```

`SAFE_BOTTOM` shifts per-scene if that scene has `captions` configured with `position: 'top'` — the caption-aware boundary is computed from the actual caption zone for that scene, not a guessed constant.

Every resolved position is clamped to these bounds automatically. A `linear` column that would overflow the bottom of the safe zone gets clamped on its last child rather than going offscreen.

---

## Full Example — Linear Column Scene

```js
{
  layout: {
    type:      'linear',
    direction: 'column',
    x:         540,
    y:         280,
    gap:       44,
    align:     'center',
    padding:   [0, 60],
  },
  tts: { text: 'No one talks about this.', speed: 0.9 },
  captions: { style: 'highlight', position: 'bottom', fontSize: 60 },
  layers: [
    // Background — exempt from layout, always full frame
    { type: 'gradient', colors: ['#0a0a1a', '#0d1b2a'], vignette: true },

    // Hook badge — engine places this at y:280 (first child)
    {
      type: 'text', text: '👀 POV',
      fontSize: 44, color: '#fff',
      bgColor: 'rgba(255,59,92,0.85)', bgPadX: 32, bgPadY: 14,
      borderRadius: 60,
    },

    // Title — placed 44px below badge automatically
    {
      type: 'text', text: 'THE WINDOW\nSEAT EFFECT',
      fontSize: 88, color: '#ffffff',
      maxWidth: 900, lineHeight: 1.18,
      stroke: true, strokeColor: '#000', strokeWidth: 7,
      animation: 'pop', startT: 0.2, animDur: 0.4,
    },

    // Subtitle — placed 44px below title automatically
    {
      type: 'text', text: 'it happens to everyone',
      fontSize: 42, color: 'rgba(255,255,255,0.65)',
      animation: 'fade', startT: 0.5, animDur: 0.35,
    },

    // Sticker — has noLayout: true, positioned manually
    {
      type: 'giphy', query: 'thinking hmm', sticker: true,
      x: 700, y: 580, width: 320, height: 320,
      fit: 'contain', loop: true,
      noLayout: true,
    },
  ],
}
```

---

## Full Example — Relative Chain

```js
{
  layout: { type: 'relative' },
  layers: [
    { type: 'gradient', colors: ['#0d0221', '#0a1628'] },

    // Root — only one with explicit y
    { id: 'label',
      type: 'text', text: '🧠 your brain at 2am',
      x: 540, y: 380, fontSize: 38,
      color: 'rgba(255,255,255,0.6)', align: 'center' },

    // Hangs 52px below label
    { id: 'main',
      type: 'text', text: 'solving problems\nyou don\'t have yet',
      relativeTo: 'label', anchor: 'below', offset: 52,
      fontSize: 84, color: '#fff', align: 'center',
      maxWidth: 920, lineHeight: 1.15,
      stroke: true, strokeColor: '#000', strokeWidth: 7 },

    // Hangs 64px below main text
    { id: 'note',
      type: 'text', text: '(bus is 3 stops away)',
      relativeTo: 'main', anchor: 'below', offset: 64,
      fontSize: 36, color: '#ffd60a', align: 'center',
      animation: 'fade', startT: 1.0, animDur: 0.4 },

    // CTA card hangs 80px below note
    { id: 'cta',
      type: 'notification-card',
      relativeTo: 'note', anchor: 'below', offset: 80,
      title: '🪟 tag the window seat thinker',
      body: 'they know exactly who they are',
      borderColor: '#ff3b5c', titleColor: '#ff3b5c' },
  ],
}
```

---

## Full Example — Flex Hashtag Row

```js
{
  layout: {
    type: 'flex', direction: 'row', wrap: true,
    justify: 'center', align: 'center', gap: 24,
    x: 540, y: 1500, width: 960, height: 200,
  },
  layers: [
    { type: 'text', text: '#storytime',  fontSize: 40, color: '#fff',
      bgColor: 'rgba(255,255,255,0.12)', bgPadX: 24, bgPadY: 12, borderRadius: 40 },
    { type: 'text', text: '#truestory',  fontSize: 40, color: '#fff',
      bgColor: 'rgba(255,255,255,0.12)', bgPadX: 24, bgPadY: 12, borderRadius: 40 },
    { type: 'text', text: '#fyp',        fontSize: 40, color: '#fff',
      bgColor: 'rgba(255,255,255,0.12)', bgPadX: 24, bgPadY: 12, borderRadius: 40 },
  ],
}
```

---

## Full Example — CSS Corner Badges + Dead-Center Title

```js
{
  layout: { type: 'css' },
  layers: [
    { type: 'gradient', colors: ['#0a0010', '#000'], vignette: true },

    { type: 'text', text: 'EP. 04', css: { top: 60, left: 40 },
      fontSize: 36, color: 'rgba(255,255,255,0.6)' },

    { type: 'text', text: '2.1M 👁', css: { top: 60, right: 40 },
      fontSize: 36, color: 'rgba(255,255,255,0.6)' },

    { type: 'text', text: 'THE FALL OF\nROME', fontSize: 96,
      css: { top: '50%', left: '50%', translate: [-50, -50] },
      color: '#fff', align: 'center', maxWidth: 900,
      stroke: true, strokeColor: '#000', strokeWidth: 8 },

    { type: 'text', text: 'swipe up for part 2', css: { bottom: 5, left: '50%', translate: [-50, 0] },
      fontSize: 34, color: 'rgba(255,255,255,0.55)' },
  ],
}
```