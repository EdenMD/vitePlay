# `window.__APEX_DATA__` — Generic Data Injection for `html-record`

Pass any JSON-serializable value from `config.js` straight into a recorded HTML page, as `window.__APEX_DATA__`, before that page's own scripts ever run.

---

## The Gap This Fills

Before this, there were exactly two ways to get data from a config into an `html-record` page, and both had real limits:

- **`window.__APEX_AUDIO__`** (see `AUDIOSYNC.md`) — fixed shape, audio-timing only (words, beats, amplitudes). Not usable for anything else.
- **URL query params on `src`** (the `phone-frame.html` wrapper pattern, e.g. `./animations/phone-frame.html?url=...&w=760`) — string-only, and awkward the moment you need anything structured: a ranked list, a stats object, an array of items.

`layer.data` is the general-purpose version of the same mechanism `__APEX_AUDIO__` already used: set it to *anything* JSON-serializable — object, array, nested structure, whatever — and it shows up as `window.__APEX_DATA__` in the page. No shape is assumed or enforced by the engine; rendering it is entirely the page template's job.

---

## Layer Config

```js
{
    type:    'html-record',
    src:     './ApexCasing/recap-board.html',
    data:    { title: 'RECAP', items: WEAPONS },   // any JSON-serializable value
    waitFor: '[data-ready="1"]',
    duration: 6.5,
    fps:      30,
    viewport: { width: 1080, height: 1920 },
    x: 0, y: 0, width: 1080, height: 1920,
    fit: 'cover',
}
```

`data` is independent of `audioSync` — a layer can use `layer.data`, `audioSync: true`, both, or neither. They're additive injections; nothing about one affects the other.

---

## Reading It In The Page

```html
<script>
    const data = window.__APEX_DATA__ || { title: 'RECAP', items: [] };

    document.getElementById('title').textContent = data.title || 'RECAP';

    (data.items || []).forEach((item) => {
        // ...build DOM from item...
    });

    // Signal "fully populated" for waitFor — distinct from "page loaded"
    document.body.setAttribute('data-ready', '1');
</script>
```

Always code a fallback default (`window.__APEX_DATA__ || {...}`) — it keeps the page previewable standalone in a plain browser tab (double-click the `.html` file) without needing the engine to inject anything first, which is useful while iterating on a template.

---

## How It Works — Injection Timing

```
recordHTML()
  1. newPage() + viewport/device emulation
  2. Pause CSS animations (we control time manually)
  3. evaluateOnNewDocument(...) → window.__APEX_AUDIO__   (if audioData present)
  4. evaluateOnNewDocument(...) → window.__APEX_DATA__    (if layer.data present)
  5. page.goto(url)                                        ← page's own scripts run here
  6. waitFor selector / waitMs
  7. Re-enable animations
  8. Cursor injection, interactions, frame capture...
```

The injection happens via [`page.evaluateOnNewDocument()`](https://pptr.dev/api/puppeteer.page.evaluateonnewdocument) — a Puppeteer API that runs the given function **before any of the target document's own scripts**, on every subsequent navigation. This is what makes step 5 safe: by the time `page.goto()` starts parsing and running the page's HTML/JS, `window.__APEX_DATA__` is already sitting there waiting to be read, no matter how early the page reads it.

---

## Critical Fix (this pass) — Data Was Landing Too Late To Matter

The first real use of this feature (`ApexCasing/recap-board.html`, driven by `config.viral-top5-deadliest-weapons.js`'s final scene) shipped with a genuine ordering bug: injection used to run via a plain `page.evaluate()` call **after** `page.goto()` and `waitFor` had already resolved — i.e., after step 5/6 above, not before step 5.

That's too late for any page whose script reads `window.__APEX_DATA__` **synchronously at load**, which is the natural way to write a one-shot "render this list once" template (as opposed to an audioSync page, which reads its data lazily inside a recurring `apexframe` event handler — that pattern happened to mask the same underlying ordering issue). `recap-board.html`'s inline `<script>` runs as part of page parsing, during `page.goto()` itself — well before Puppeteer's post-navigation `page.evaluate()` call ever gets a chance to run. So the sequence was actually:

1. Page navigates, script runs immediately, reads `window.__APEX_DATA__` → `undefined`
2. Falls back to `{ title: 'RECAP', items: [] }` → renders only the title, no list
3. Sets `data-ready="1"` regardless (readiness was about "page loaded," not "data present")
4. `waitFor` resolves instantly — nothing was actually waited on
5. **Then** the engine injects the real data, into a page that already finished rendering and moved on

Symptom matched exactly: the recap board showed only the static "RECAP" heading, never the ranked list.

**Fix:** switched both the `__APEX_DATA__` and `__APEX_AUDIO__` injection calls from post-navigation `page.evaluate()` to pre-navigation `page.evaluateOnNewDocument()` (steps 3–4 above, now ahead of `page.goto()`). Any template that reads its injected data synchronously on load — not just ones using the `apexframe` frame-by-frame pattern — now sees real data on the very first read.

If you built a `layer.data`-driven template before this fix and it only ever showed default/empty state, that was this bug — no change needed on the template side, it was purely an injection-order issue in `src/html-record.js`.

---

## Failure Behavior

If `layer.data` isn't JSON-serializable (contains a function, a circular reference, etc.), the injection is wrapped in a `try/catch`: it logs a warning (`layer.data injection failed (...)`) and recording continues with `window.__APEX_DATA__` simply never set — the page's own `|| {...}` fallback (you did add one, per the note above) takes over instead of the whole render failing.

---

## Full Example — Ranked Recap List

```js
// config.js
{
    tts: { text: "Five weapons. One surprising winner...", emotion: 'excited' },
    layers: [
        {
            type:     'html-record',
            src:      './ApexCasing/recap-board.html',
            data:     { title: 'RECAP', items: WEAPONS },  // WEAPONS = [{rank, name, stat}, ...]
            waitFor:  '[data-ready="1"]',
            duration: 6.5,
            fps:      30,
            viewport: { width: 1080, height: 1920 },
            x: 0, y: 0, width: 1080, height: 1920,
            fit: 'cover',
        },
    ],
},
```

```html
<!-- ApexCasing/recap-board.html -->
<div class="stage">
    <div class="title" id="title">RECAP</div>
    <div class="list" id="list"></div>
</div>
<script>
    const data = window.__APEX_DATA__ || { title: 'RECAP', items: [] };
    document.getElementById('title').textContent = data.title || 'RECAP';

    const listEl = document.getElementById('list');
    (data.items || []).forEach((item, i) => {
        const row = document.createElement('div');
        row.className = 'row';
        row.dataset.rank = item.rank;
        row.style.animationDelay = (500 + i * 350) + 'ms';
        row.innerHTML = `
            <div class="rank">#${item.rank}</div>
            <div class="info">
                <div class="name">${item.name}</div>
                <div class="stat">${item.stat || ''}</div>
            </div>
        `;
        listEl.appendChild(row);
    });

    document.body.setAttribute('data-ready', '1');
</script>
```

See `ApexCasing/recap-board.html` for the full version with CSS stagger animations.

---

## Relationship To Other `html-record` Features

- **`AUDIOSYNC.md`** — `window.__APEX_AUDIO__` + `apexframe` events. A separate, fixed-shape injection for narration/beat-reactive pages. Combinable with `layer.data` in the same layer.
- **`Html_timing.md`** — CDP virtual-time frame capture. Unrelated to data injection, but shares the same `recordHTML()` pipeline.
- **`Html_recording_Interactions.md`** — scripted `interactions: [...]` (click, type, scroll, etc.). Also unrelated to data injection, also shares the same layer type.
- **Caching** — a plain (non-`audioSync`) `html-record` layer with `layer.data` set is cached the same way any other plain `html-record` layer is (see `AUDIOSYNC.md`'s caching section): by a key derived from `src`/`duration`/`fps`/etc., recorded once in Phase 0.25, reused on subsequent runs. **Changing `layer.data` alone does not currently bust that cache key** — if you change the data an existing layer passes in without changing `src`, `duration`, or another key-contributing field, you'll get stale frames from the previous data. Delete the relevant `work/html-frames/<cache-key>/` directory (or bump `duration` by a trivial amount) to force a re-record after a data-only change.
- **`ApexCasing/`** — data-driven templates like `recap-board.html` (any `.html` file built specifically to be reused across scenes/configs by varying only `layer.data`) live in their own `ApexCasing/` folder, with their own naming and cache-key-differentiation convention. See `ApexCasing.md`.