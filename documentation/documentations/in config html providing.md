# Inline HTML Recording in Apex Engine V3

## Overview

Starting with this update, `html-record` layers support inline HTML markup directly in the layer configuration via the `html` property, removing the requirement to commit standalone `.html` files under `ApexCasing/` or `animations/` for custom components.

The engine detects inline markup, hashes its contents into a deterministic cache key, writes it to a temporary environment under `workDir/inline-html/`, and loads it via Chromium with full support for:
- Frame caching and cache invalidation based on markup hash
- Pre-navigation data injection (`window.__APEX_DATA__`)
- Audio synchronization (`window.__APEX_AUDIO__` and `apexframe` events)
- DOM scripting and interaction timelines
- Automatic renderer crash/freeze recovery

---

## Configuration API

| Field | Type | Description |
|---|---|---|
| `type` | `string` | Must be `'html-record'`. |
| `html` | `string` | Raw HTML/CSS/JS string. Can be an HTML snippet or a full `<!DOCTYPE html>` document. |
| `src` | `string` | *(Alternative)* Path to local `.html` file or remote URL. Ignored if `html` is provided. |
| `duration` | `number` | Recording length in seconds (defaults to scene/TTS duration or 3.0s). |
| `fps` | `number` | Recording frame rate (defaults to video FPS or 30). |
| `viewport` | `object` | `{ width: number, height: number }` for the browser render target. |
| `audioSync` | `boolean` | If `true`, defers rendering to Phase 1.6 and fires `apexframe` events each frame. |
| `interactions` | `array` | Optional list of timed DOM actions (clicks, typing, scroll, style mutations). |
| `data` | `any` | JSON-serializable payload injected into `window.__APEX_DATA__` pre-navigation. |

---

## Automatic Template Wrapping

If `html` does not include `<!DOCTYPE html>` or `<html>` root tags, the engine automatically wraps the snippet in a transparent, zero-margin, responsive canvas:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
  </style>
</head>
<body>
  <!-- Your snippet is injected here -->
</body>
</html>
```

If you provide a complete `<!DOCTYPE html>` document, your markup, external script tags (e.g., CDN links for Tailwind, Three.js, Lucide, KaTeX), and custom styles are preserved verbatim.

---

## Usage Examples

### 1. Simple Card Overlay with Scoped Styles

```javascript
{
  type: 'html-record',
  duration: 4.0,
  viewport: { width: 1920, height: 1080 },
  x: 120, y: 160, width: 1680, height: 760,
  html: `
    <div class="card">
      <span class="pill">Clinical Rule</span>
      <h1>Triage Prioritization: Airway, Breathing, Circulation</h1>
      <p>Always assess airway patency before proceeding with systemic vitals.</p>
    </div>
    <style>
      .card {
        background: rgba(15, 23, 42, 0.92);
        border: 2px solid #0284c7;
        border-radius: 20px;
        padding: 40px;
        color: #f8fafc;
        box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      }
      .pill {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 9999px;
        background: #0284c7;
        color: #fff;
        font-weight: 700;
        font-size: 14px;
        text-transform: uppercase;
        margin-bottom: 16px;
      }
      h1 { font-size: 36px; margin: 0 0 12px 0; color: #38bdf8; }
      p { font-size: 22px; line-height: 1.5; color: #cbd5e1; margin: 0; }
    </style>
  `
}
```

---

### 2. Audio-Synced Reactive Element

When `audioSync: true` is configured, your inline `<script>` can listen for `apexframe` events:

```javascript
{
  type: 'html-record',
  duration: 5.0,
  viewport: { width: 1920, height: 1080 },
  audioSync: true,
  html: `
    <div id="container">
      <div id="meter">
        <div id="fill"></div>
      </div>
      <div id="word">Waiting...</div>
    </div>
    <style>
      #container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
      #meter { width: 600px; height: 24px; background: rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; }
      #fill { width: 0%; height: 100%; background: #38bdf8; transition: width 0.05s ease; }
      #word { margin-top: 24px; font-size: 42px; font-weight: 800; color: #ffffff; }
    </style>
    <script>
      window.addEventListener('apexframe', (e) => {
        const { amplitude, word } = e.detail;
        const fill = document.getElementById('fill');
        const wordEl = document.getElementById('word');
        if (fill) fill.style.width = (amplitude * 100) + '%';
        if (word && wordEl) wordEl.textContent = word;
      });
    </script>
  `
}
```

---

### 3. Full Document with External CDN Libraries

```javascript
{
  type: 'html-record',
  duration: 4.0,
  viewport: { width: 1920, height: 1080 },
  html: `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-transparent flex items-center justify-center min-h-screen">
  <div class="bg-slate-900/90 border border-emerald-500/40 p-8 rounded-2xl text-white shadow-2xl">
    <div class="text-xs uppercase font-bold text-emerald-400 tracking-wider">Pass Criteria</div>
    <div class="text-2xl font-bold mt-2">Active Listening & Empathetic Communication</div>
  </div>
</body>
</html>`
}
```

---

## Technical Details

1. **Deterministic Cache Hashing**: The markup string is hashed using MD5. If the HTML has not changed between render runs, cached PNG frames from `html-frames/inline_<hash>...` are reused, avoiding unnecessary browser headless launches.
2. **Crash Resilience**: When Chrome relaunches under CI memory pressure, the file path generated in `workDir/inline-html/` is re-navigated without loss of context.
3. **No Breaking Changes**: `src: './path/to/file.html'` and remote `src: 'https://...'` remain fully supported.
