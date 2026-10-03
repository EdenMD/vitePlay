# ApexCasing — Reusable, Data-Driven `html-record` Templates

**ApexCasing** is the naming/organization convention for `html-record` HTML files that are built to receive their content from `config.js` via `layer.data` (`window.__APEX_DATA__`) instead of having it hardcoded. If a template's whole purpose is "render whatever data you hand me," it's an ApexCasing file, and it lives in the `ApexCasing/` folder.

This doc assumes you've already read `DataInjection.md` for the underlying mechanism (`window.__APEX_DATA__`, injection timing, the pre-nav fix). This doc is about the convention layered on top of that mechanism — naming, folder location, and how to build templates meant to be reused rather than one-off.

---

## What Makes A File "ApexCasing" vs Just Another `animations/` File

The engine doesn't enforce this distinction — `layer.data` works from any path, `ApexCasing/` isn't a special-cased directory anywhere in `src/html-record.js`. This is a convention for keeping the repo readable as it grows, not a technical requirement. The line:

| | `animations/` | `ApexCasing/` |
|---|---|---|
| Content source | Hardcoded in the HTML/JS itself | Entirely from `window.__APEX_DATA__` |
| Built for | One specific scene, one specific look | Any scene that hands it a matching data shape |
| Reused across configs? | Rarely — usually copy-and-edit if you want something similar | By design — same file, different `data` |
| Example | `dna_break.html`, `vault-bg.html`, `money-bg.html` — bespoke visuals with their own baked-in content | `recap-board.html` — a ranked-list renderer that doesn't know or care what's actually in the list |

Rule of thumb: if you find yourself about to copy an `animations/*.html` file and edit some hardcoded text/numbers/labels to reuse it in a different scene, that's the signal it should have been (or should become) an ApexCasing file instead — parameterize the varying part into a `data` shape, move it to `ApexCasing/`, and pass different `layer.data` per use instead of maintaining near-duplicate HTML files.

`audioSync` templates (`audiosync_orb.html` and similar) are a different axis entirely — they react to narration/beat timing, not structured config data — and stay in `animations/` regardless of how generic they are, unless a given one *also* takes `layer.data` for non-audio content.

---

## Folder Structure

```
ApexCasing/
    recap-board.html      ← current example — ranked list renderer
    (your templates here)
```

Reference one the same way as any other `html-record` `src`, just pointing at the new folder:

```js
{
    type: 'html-record',
    src:  './ApexCasing/recap-board.html',
    data: { title: 'RECAP', items: WEAPONS },
    waitFor: '[data-ready="1"]',
    duration: 6.5,
    fps: 30,
    viewport: { width: 1080, height: 1920 },
    x: 0, y: 0, width: 1080, height: 1920,
    fit: 'cover',
},
```

Nothing else about the layer config changes — `ApexCasing/` is just a path, resolved by the same local-file logic (or `http(s)`-hosted, per `AUDIOSYNC.md`/hosting discussion) as everything else.

---

## Can The Same ApexCasing File Be Reused, Config After Config, Scene After Scene?

**Yes — that's the entire point.** An ApexCasing file should contain zero content decisions; every piece of actual content (titles, list items, colors, counts, labels — whatever the template renders) comes in through `data`. The same `recap-board.html` works for a weapons countdown today and a completely different ranked list in a different config tomorrow, with zero HTML edits — only the `data` object passed from `config.js` changes.

```js
// config A
{ type: 'html-record', src: './ApexCasing/recap-board.html', data: { title: 'RECAP', items: WEAPONS } }

// config B — same template, totally different content, no HTML touched
{ type: 'html-record', src: './ApexCasing/recap-board.html', data: { title: 'TOP MOMENTS', items: highlights } }
```

### The one real gotcha: caching doesn't know about `data`

Per `DataInjection.md`'s caching section: the frame cache key is built from `src` + `duration` + `fps` (+ device/audioSync tags) — **`layer.data` is not part of it.** That means two different scenes using the exact same `src`/`duration`/`fps` but *different* `data` will collide on the same cache directory (`work/html-frames/<key>/`), and whichever one records first "wins" — the second will silently get the first one's cached frames instead of its own.

This matters more for ApexCasing files specifically, because reuse-with-different-data is the whole use case — it's not a rare edge case here, it's the default way you'd use one.

**Fix: give each distinct data payload its own cache key via a harmless query tag on `src`.** Query strings on local files are stripped before the filesystem lookup but kept in the raw `src` string used to build the cache key — so this is a supported, code-verified way to differentiate:

```js
// Scene 8 — weapons recap
{ src: './ApexCasing/recap-board.html?tag=weapons', data: { title: 'RECAP', items: WEAPONS } }

// Scene 14, later in the same config, or a different config entirely — different data
{ src: './ApexCasing/recap-board.html?tag=highlights', data: { title: 'TOP MOMENTS', items: highlights } }
```

Keep the tag short and put it right after the filename — the sanitized cache-key string is truncated at 80 characters, so a long path plus a long tag can theoretically collide if both get cut off at the same truncated prefix. A short `?tag=scene8` or `?v=2` is enough; it doesn't need to be unique in any global sense, just different from any other invocation of the same template that's carrying different `data`.

If you forget the tag and reuse a template with new data at the same `duration`/`fps`, the symptom is the classic "my new data isn't showing, it's still showing the old content" — check for this before assuming it's another injection-timing bug.

---

## How To Create Your Own ApexCasing File

**1. Design the data shape first**, independent of any specific config's content. For `recap-board.html` that's:

```js
{
    title: 'RECAP',
    items: [
        { rank: 5, name: 'Landmines', stat: 'still killing decades later' },
        // ...
    ],
}
```

Pick a shape general enough that a *different* config could plausibly reuse the template without needing a new field bolted on. If two fields will always vary together in practice, they usually belong in the same object; if a field is genuinely template-specific styling (not caller content), consider a sane default in the template instead of forcing every caller to specify it.

**2. Read with a fallback default**, so the file previews standalone (double-click, open in a browser tab) without the engine injecting anything:

```html
<script>
    const data = window.__APEX_DATA__ || {
        title: 'PREVIEW', items: [{ rank: 1, name: 'Sample Item', stat: 'sample stat' }],
    };
    // ...render from `data`, never from hardcoded values...
</script>
```

**3. Render everything from `data` — no hardcoded content.** Styling/layout/animation timing can live in the template's CSS as constants (that's not "content," that's the template's own design), but anything a caller might reasonably want to change between uses (text, counts, colors tied to meaning, labels) should come from `data`.

**4. Set a readiness flag once rendering is actually done**, and use it as `waitFor`:

```html
<script>
    // ...build all the DOM from data...
    document.body.setAttribute('data-ready', '1');
</script>
```

Don't set the ready flag before checking `data` is populated — that defeats the point of `waitFor` (see `DataInjection.md`'s critical-fix section for exactly what goes wrong when a page signals "ready" without regard to whether real data ever arrived — that was the original bug this whole feature had to get fixed for).

**5. Save it in `ApexCasing/`**, not `animations/`.

**6. Reference it with a `?tag=` if you expect to reuse it with different `data` at the same `duration`/`fps`** anywhere else — see the caching section above. Cheap insurance even on the first use, since "will this get reused" is easy to guess wrong about early on.

**7. Document the expected `data` shape in the file's own header comment** (see `recap-board.html` for the pattern) — the template is the only place that shape is enforced (nothing validates it engine-side), so it needs to be discoverable by reading the file, not just by reverse-engineering the one config that currently uses it.

---

## Full Example — Building A New ApexCasing Template

A minimal "stat card" template that shows a big number and a caption — the kind of thing a dozen different configs might want with completely different numbers:

```html
<!-- ApexCasing/stat-card.html
     Expected shape:
       window.__APEX_DATA__ = { value: '250,000+', caption: 'deaths per year', accent: '#ff2b2b' }
-->
<!DOCTYPE html>
<html>
<head>
<style>
    html, body { margin: 0; width: 1080px; height: 1920px; background: #060608; overflow: hidden; }
    .stage { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; font-family: Arial, sans-serif; }
    .value { font-size: 160px; font-weight: 900; opacity: 0; animation: fadeIn 0.6s ease forwards; }
    .caption { font-size: 40px; color: rgba(255,255,255,0.7); margin-top: 20px; opacity: 0; animation: fadeIn 0.6s ease 0.3s forwards; }
    @keyframes fadeIn { to { opacity: 1; } }
</style>
</head>
<body>
    <div class="stage">
        <div class="value" id="value"></div>
        <div class="caption" id="caption"></div>
    </div>
    <script>
        const data = window.__APEX_DATA__ || { value: '0', caption: 'preview', accent: '#ff2b2b' };
        const valueEl = document.getElementById('value');
        valueEl.textContent = data.value;
        valueEl.style.color = data.accent || '#ff2b2b';
        document.getElementById('caption').textContent = data.caption;
        document.body.setAttribute('data-ready', '1');
    </script>
</body>
</html>
```

```js
// Reused three times in the same config, three different scenes:
{ src: './ApexCasing/stat-card.html?tag=deaths',   data: { value: '250,000+', caption: 'deaths per year', accent: '#ff2b2b' } },
{ src: './ApexCasing/stat-card.html?tag=countries', data: { value: '106',      caption: 'countries affected', accent: '#ffd23c' } },
{ src: './ApexCasing/stat-card.html?tag=years',     data: { value: '70+',      caption: 'years in service',   accent: '#4dd0ff' } },
```

Three completely different-looking scenes, one HTML file, zero duplication.

---

## Relationship To Other Docs

- **`DataInjection.md`** — the underlying mechanism (`window.__APEX_DATA__`, injection timing, the ordering-bug fix). Read that first.
- **`AUDIOSYNC.md`** — a different, unrelated injection (`window.__APEX_AUDIO__` / `apexframe`) for narration/beat-reactive content. An ApexCasing file *can* also use audio sync if it makes sense for that template, but that's not what makes it an ApexCasing file.
- **`Html_timing.md`** / **`Html_recording_Interactions.md`** — general `html-record` mechanics (frame timing, scripted interactions), apply the same regardless of `ApexCasing/` vs `animations/`.