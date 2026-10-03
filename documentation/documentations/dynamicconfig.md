# Dynamic / Async Config Support

`config.js` (or whatever `$VIDEO_CONFIG` points to) can now be a function — including an async one — instead of only a plain object. This is what makes it possible to fetch data (your own server, a CMS, a spreadsheet, generated image URLs, whatever) and build the scene list dynamically, before the engine ever sees it.

---

## What Changed

`engine-ci.js` used to load config with a plain `require()` and use the result directly — meaning `module.exports` had to already *be* the finished config object, synchronously, at file-load time. There was no way to `await` anything in there.

Now, whatever `module.exports` is gets resolved through one extra step that understands four shapes:

```js
// 1. Plain object — exactly as before, zero changes needed to existing configs
module.exports = { output: {...}, scenes: [...] };

// 2. A function returning an object
module.exports = () => ({ output: {...}, scenes: [...] });

// 3. An async function — this is the new capability that actually matters
module.exports = async () => {
    const photos = await fetch('https://your-server.com/api/photos').then(r => r.json());
    return {
        output: { title: 'my-video' },
        scenes: photos.map(p => ({
            tts: { text: p.caption },
            layers: [{ type: 'image', src: p.url, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' }],
        })),
    };
};

// 4. A Promise, exported directly (equivalent to #3 but pre-invoked)
module.exports = (async () => {
    const data = await fetch('https://your-server.com/api/data').then(r => r.json());
    return buildConfigFrom(data);
})();
```

All four are handled identically from that point on — nothing else about the engine changed. Scenes, layers, layout, audioSync, everything downstream works exactly as before regardless of which shape produced the config object.

---

## Fully Backward Compatible

Every existing config using `module.exports = { ... }` continues to work completely unchanged — shape #1 above is exactly what you had before. This isn't a breaking change or a migration; it's a new *option*.

---

## Your Actual Use Case: Fetching From Your Own Server

```js
// config.js
module.exports = async () => {
    const res = await fetch('https://your-api.com/latest-content', {
        headers: { Authorization: `Bearer ${process.env.CONTENT_API_KEY}` },
    });
    if (!res.ok) throw new Error(`Content API returned ${res.status}`);
    const items = await res.json();

    return {
        output: { title: items.title, format: 'portrait', fps: 30 },
        defaults: { voice: 'am_adam' },
        scenes: items.slides.map(slide => ({
            tts: { text: slide.narration },
            layers: [
                { type: 'image', src: slide.imageUrl, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'text', text: slide.headline, y: 200, fontSize: 80, color: '#fff' },
            ],
        })),
    };
};
```

Standard Node 18+ has `fetch` globally — no extra dependency needed for a simple GET. Use `process.env` for any API keys/tokens the same way the rest of the pipeline already does (GitHub Actions secrets → env vars).

---

## Error Handling

If your config's function throws, or resolves to something that isn't a valid config object, the engine fails immediately with a clear message — before any TTS, image generation, or rendering starts:

```
[Engine] Config at /path/to/config.js did not resolve to an object (got string).
module.exports must be an object, a function returning one, an async
function returning one, or a Promise that resolves to one.
```

```
[Engine] Resolved config has no "scenes" array — check your config's return value.
```

This is deliberate: a config that fails to fetch its data should fail fast and loud, not silently proceed with `undefined` scenes and produce a confusing crash three phases later.

---

## Things Worth Knowing

- **`require()` itself is still synchronous** — that's a Node constraint, not something this fix changes. What changed is what happens to the *value* `require()` returns: if it's a function, it gets called and awaited; if it's already a Promise, it gets awaited directly.
- **No timeout is enforced on your async config function.** If your fetch hangs, the whole pipeline hangs waiting for it — same as any other unbounded `await`. Add your own timeout (`AbortController` + `fetch`'s `signal`) if the source you're calling isn't reliably fast.
- **This runs once, before any phase starts** — not per-scene, not per-frame. If you need per-scene dynamic data, fetch it all up front inside the one async config function and map it into the `scenes` array, rather than trying to make individual layer properties async (they aren't, and don't need to be — by the time the engine sees `config.scenes`, everything in it should already be a plain resolved value).
- **Caching (Pollinations images, Giphy, Pexels, etc.) still keys off the config's *content* hash** — if your async function fetches genuinely new data on every run (e.g. "latest 10 photos"), expect cache misses on anything that changed, exactly as if you'd hand-edited the config. That's correct behavior, not a bug: the cache doesn't know or care how the config was produced, only what's actually in it.