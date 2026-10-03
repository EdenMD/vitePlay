# HTML Recording — Page Interactions

Scripted mouse, keyboard, scroll, and DOM actions that drive a real, live web page during recording — the same tool as `html-record`/`audioSync`, but instead of (or in addition to) reacting to audio, the page reacts to a scripted sequence of real user-like actions. This is what turns a static `html-record` layer into an actual **screen-recorded demo**.

---

## What This Actually Lets You Build

`html-record` can point at any real page — a local file, a live URL, or a localhost server spun up during CI. Combined with `interactions`, you're not recording an animation anymore, you're recording a **simulated user session** on a real, functioning website or web app. That's a fundamentally different, much wider category of video:

- **"How to use our website" tutorial ads** — script a walkthrough of your actual signup flow, dashboard, or checkout, narrated over it. This is a real recording of the real product, not a mockup — if the product changes, point it at the updated page and re-record, rather than re-animating a fake UI.
- **SaaS/app onboarding demos** — click through actual settings, type into actual search boxes, watch actual dropdowns open. Useful both as marketing (landing page hero video) and as literal user-facing onboarding content.
- **Feature announcement videos** — hover a new button, click it, watch the real UI respond, zoom in on the result. No screen-recording software, no manual mouse choreography — it's scripted, so it's exactly reproducible and easy to re-cut.
- **E-commerce "how to checkout" walkthroughs** — scroll through a real product page, click "add to cart," fill in a real (test) checkout form, submit. Genuinely useful as both an ad and as support documentation.
- **Mobile app / responsive site swipe demos** — `swipe` and touch-based scrolling for a portrait-oriented "here's the app" style video.
- **Competitive/comparison content** — script the same interaction sequence against two different sites/tools side by side.

The throughline: **anywhere you'd currently either screen-record yourself clicking through something, or hire someone to, this can do it instead** — scripted, repeatable, and re-runnable the moment the underlying page changes. It composites into the same scene system as everything else, so a real product demo can still get an APEX title card, captions, background music, and transitions around it.

---

## How It Works

`interactions` is an array on any `html-record` layer (works identically whether or not that layer also has `audioSync: true`). Each entry fires once, at the first recorded frame whose timestamp reaches its `at` value:

```js
{
  type: 'html-record',
  src:  'https://your-staging-site.com/dashboard',
  duration: 8.0,
  fps: 30,
  viewport: { width: 1080, height: 1920 },
  interactions: [
    { at: 0.5, action: 'click',  selector: '#nav-search' },
    { at: 1.0, action: 'type',   selector: '#search-input', text: 'invoices', speed: 60 },
    { at: 2.5, action: 'hover',  selector: '.search-result:first-child' },
    { at: 3.0, action: 'click',  selector: '.search-result:first-child' },
    { at: 4.0, action: 'scroll', y: 800, speed: 250 },
  ],
}
```

### ⚠️ Critical: list interactions in ascending `at` order

The recorder walks the array with a single forward pointer — it checks "has the *next* interaction's `at` time arrived yet," fires it if so, and advances. **It does not sort the array and does not look ahead or behind.** If two entries are out of order (a later array entry has an earlier `at` than the one before it), the out-of-order entry will fire immediately after the previous one instead of at its intended time — silently, with no warning. Always write `interactions` sorted by `at`, ascending.

### The cursor is visible by default

Every `html-record` layer draws a synthetic cursor by default (a small glowing red dot, tracking every mouse action) — this is what makes clicks/hovers/drags legible to a viewer, since Puppeteer's real cursor is invisible in a headless screenshot. **You don't need to add anything to get this** — it's on unless you turn it off:

```js
{ type: 'html-record', src: '...', cursor: false }  // hide it entirely
```

Or customize it:

```js
{
  type: 'html-record', src: '...',
  cursor: { style: 'ring', color: '#00e5ff', size: 36, glow: true },
}
```

| `style` | Look |
|---|---|
| `dot` (default) | Solid filled circle |
| `circle` | Outlined ring, transparent center |
| `crosshair` | Thin + shape |
| `spotlight` | Large soft radial glow, good for drawing attention without looking like a literal cursor |
| `ring` | Outlined ring with a small solid dot in the center |

For a tutorial-style video, `dot` or `ring` with a bright, on-brand color reads clearest. `spotlight` works well when you want to imply "look here" without it looking like a literal mouse pointer (e.g. narrating over a static screenshot-like moment).

---

## Full Action Reference

### Mouse

| Action | Params | Behavior |
|---|---|---|
| `click` | `selector`, `delay?` | Real Puppeteer click on the matched element. `delay` (ms) between mousedown/mouseup, default `0`. |
| `double-click` | `selector`, `delay?` | Same, `clickCount: 2`. Default `delay: 50`. |
| `right-click` | `selector`, `delay?` | Fires a real `contextmenu` event via `button: 'right'`. |
| `hover` | `selector` | Moves the (real) mouse over the element — triggers `:hover` CSS and any `mouseenter` listeners. |
| `mouse-move` | `x`, `y`, `speed?` | Smoothly animates the cursor to `(x, y)` using an ease-in-out curve. `speed` is px/sec (default `400`) — controls duration, not a literal per-frame speed. |
| `drag` | `fromSelector` \| `fromX`+`fromY`, `toSelector` \| `toX`+`toY`, `duration?`, `easing?` | Real mousedown → move → mouseup sequence. Either endpoint can be a selector (uses its bounding-box center) or explicit coordinates. `easing`: `linear`\|`ease-in`\|`ease-out`\|`ease-in-out` (default). `duration` in seconds, default `0.5`. |

### Keyboard

| Action | Params | Behavior |
|---|---|---|
| `type` | `selector`, `text`, `speed?` | Clicks the element first, then types character-by-character. `speed` is ms delay *between keystrokes* (default `50`) — this is what makes typing look human rather than pasted. |
| `key-press` | `key` **or** `keys: [...]` **or** `text` | `key`: single key (`'Enter'`, `'Escape'`, `'Tab'`...). `keys`: a combo — holds down all but the last, presses the last, releases in reverse (e.g. `['Control','a']` = Ctrl+A). `text`: types via the keyboard API directly (no click/selector needed) — different from `type`'s per-character human timing. |
| `clear` | `selector` | Triple-click (selects all text) then `Backspace`. The reliable way to clear a field regardless of its current content. |
| `set-value` | `selector`, `value` | Sets `.value` directly via the native setter (bypasses React/Vue's value tracking issues) and fires real `input`+`change` events — use this over `type` when you need an instant value change rather than a typing animation (e.g. simulating a value pasted or autofilled). |

### Scroll

| Action | Params | Behavior |
|---|---|---|
| `scroll` | `x?`, `y`, `speed?`, `easing?` | Smoothly scrolls the whole page to an absolute `(x, y)` scroll position — not a delta. `speed` is px/sec (default `120`), `easing` same 4 options as `drag`. |
| `scroll-into-view` | `selector`, `behavior?`, `block?` | Uses the browser's native `scrollIntoView` — `behavior: 'smooth'|'instant'` (default smooth), `block: 'start'|'center'|'end'` (default start). Waits `waitMs` (default 300) afterward for the scroll to settle. |
| `swipe` | `x1?`, `y1?`, `x2?`, `y2?`, `duration?` | Simulates a real touch swipe gesture (dispatches actual `TouchEvent`s) — use this instead of `scroll` for anything meant to look like a mobile/touch interaction. Defaults roughly to a bottom-to-top swipe on a 1080×1920 canvas. |

### DOM Manipulation

| Action | Params | Behavior |
|---|---|---|
| `add-class` / `remove-class` / `toggle-class` | `selector`, `className` | Applies to *every* element matching `selector` (uses `querySelectorAll`), not just the first. |
| `set-style` | `selector`, `styles: {prop: val}` | `Object.assign(el.style, styles)` on every match — use camelCase CSS properties (`backgroundColor`, not `background-color`). |
| `set-attr` | `selector`, `attr`, `value` | `setAttribute` on every match. |
| `inject-html` | `selector`, `html`, `mode?` | `mode: 'replace'` (default, sets `.innerHTML`) \| `'append'` \| `'prepend'`. Only affects the *first* match (`querySelector`, not `All`). |
| `remove-element` | `selector` | Removes every matching element from the DOM entirely. |
| `dispatch-event` | `selector`, `event`, `detail?`, `bubbles?` | Fires a `CustomEvent` on the first match — useful for triggering app-internal logic that listens for a custom event name, without needing a real user gesture to cause it. `bubbles` defaults to `true`. |

### Animation

| Action | Params | Behavior |
|---|---|---|
| `animate-element` | `selector`, `keyframes`, `duration?`, `easing?`, `fill?`, `iterations?`, `wait?` | Runs the real Web Animations API (`el.animate(...)`) — same keyframe format as `element.animate()` in any browser devtools console. `duration` in ms (default 400), `fill` default `'forwards'` (keeps the end state). Set `wait: true` to pause the recording until the animation finishes before the next interaction fires — otherwise it fires-and-forgets and keeps going immediately. |

### Page-Level

| Action | Params | Behavior |
|---|---|---|
| `zoom` | `level` | Sets CSS `zoom` on `<html>` — a real visual zoom of the whole page, not a canvas crop. |
| `local-storage` | `key`, `value` | Sets a `localStorage` entry directly — useful for simulating "already logged in" or a specific app state without scripting the actual login flow first. |
| `wait-for` | `selector`, `timeout?` | Pauses until a selector appears in the DOM (default timeout 5000ms) — use before an action that depends on something async (an API response, a lazy-loaded component) finishing first. Times out silently with a console warning rather than failing the whole recording. |
| `wait` | `duration` | Flat pause, in seconds — for beats where nothing should happen (letting narration catch up, letting a hover state be visible before moving on). |
| `focus` | `selector` | Puts keyboard focus on an element without clicking it (shows focus rings/styles without a click event). |
| `select` | `selector`, `value` | Sets a `<select>` dropdown's value (matches the `option`'s `value` attribute, not its visible label). |
| `evaluate` | `fn` | Runs arbitrary JS in the page (`new Function(fn)`) — the escape hatch for anything not covered above. No sandboxing beyond what Puppeteer itself provides — this is your own site's code, not user input, so treat it like any other script you'd paste into devtools. |

---

## Usage Examples

### Website feature tutorial ad

```js
{
  type: 'html-record',
  src: 'https://staging.yourapp.com/dashboard',
  duration: 10,
  viewport: { width: 1080, height: 1920 },
  x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
  cursor: { style: 'ring', color: '#6c5ce7', size: 32 },
  interactions: [
    { at: 0.3, action: 'wait-for',   selector: '.dashboard-loaded', timeout: 4000 },
    { at: 0.8, action: 'hover',      selector: '#new-report-btn' },
    { at: 1.5, action: 'click',      selector: '#new-report-btn' },
    { at: 2.2, action: 'wait-for',   selector: '.report-modal' },
    { at: 2.6, action: 'type',       selector: '#report-name', text: 'Q3 Revenue', speed: 55 },
    { at: 4.0, action: 'click',      selector: '.date-range-picker' },
    { at: 4.6, action: 'click',      selector: '[data-range="last-90-days"]' },
    { at: 5.4, action: 'click',      selector: '#generate-report' },
    { at: 6.0, action: 'wait-for',   selector: '.report-chart', timeout: 4000 },
    { at: 6.8, action: 'scroll-into-view', selector: '.report-summary', behavior: 'smooth' },
  ],
}
```

Narrate over this in the scene's `tts.text` and it becomes a genuine "here's how easy it is" product video — of the actual product.

### E-commerce checkout walkthrough

```js
{
  type: 'html-record',
  src: 'https://staging.yourstore.com/product/123',
  duration: 12,
  interactions: [
    { at: 0.5, action: 'scroll',      y: 400, speed: 300 },
    { at: 1.5, action: 'click',       selector: '.size-option[data-size="M"]' },
    { at: 2.0, action: 'click',       selector: '#add-to-cart' },
    { at: 2.8, action: 'wait-for',    selector: '.cart-drawer.open' },
    { at: 3.5, action: 'click',       selector: '#checkout-btn' },
    { at: 4.5, action: 'wait-for',    selector: '#checkout-form' },
    { at: 5.0, action: 'type',        selector: '#email',   text: 'demo@example.com', speed: 45 },
    { at: 6.5, action: 'set-value',   selector: '#zip',     value: '10001' },
    { at: 7.0, action: 'click',       selector: '#place-order-btn' },
    { at: 7.8, action: 'wait-for',    selector: '.order-confirmation' },
  ],
}
```

### Mobile swipe-through app demo

```js
{
  type: 'html-record',
  src: './animations/app-mockup.html',
  viewport: { width: 390, height: 844 },
  duration: 8,
  interactions: [
    { at: 1.0, action: 'swipe', x1: 195, y1: 700, x2: 195, y2: 200, duration: 0.4 },
    { at: 2.5, action: 'click', selector: '.feature-card:nth-child(2)' },
    { at: 3.5, action: 'swipe', x1: 195, y1: 700, x2: 195, y2: 200, duration: 0.4 },
  ],
}
```

### Simulating "already logged in" to skip straight to the interesting part

```js
{
  type: 'html-record',
  src: 'https://staging.yourapp.com/login',
  interactions: [
    { at: 0,   action: 'local-storage', key: 'auth_token', value: 'demo-session-token' },
    { at: 0.1, action: 'evaluate',      fn: 'window.location.href = "/dashboard"' },
    { at: 1.5, action: 'wait-for',      selector: '.dashboard-loaded', timeout: 5000 },
    { at: 2.0, action: 'hover',         selector: '.metric-card:first-child' },
  ],
}
```

---

## Combining With `audioSync`

Interactions and `audioSync: true` are independent features on the same layer type and can be used together — a scripted product demo *and* a beat-reactive or word-reactive overlay in the same recording. In practice this is less common (a real product UI usually has its own visual rhythm you don't want fighting with a pulsing overlay), but nothing prevents it. The more usual pairing is: interactions drive the page, and the *scene's* narration (`tts.text`) is written to match the timing of the `at` values — write the interaction timings first, then write narration that matches their pacing, since it's much easier to time narration to a fixed visual sequence than the reverse.

---

## Performance Note

Every interaction that involves a real animated movement (`mouse-move`, `drag`, `scroll`, `swipe`) runs in real time during recording — a `drag` with `duration: 2` genuinely takes 2 seconds of Puppeteer stepping frame-by-frame, because the whole point is a smooth, screenshot-able motion. A layer with a long sequence of these will take roughly as long to *record* as the interactions themselves take to play out, on top of normal frame-capture overhead. This is unrelated to final video render time (which is unaffected) — it only affects how long the pre-render phase takes for that layer.