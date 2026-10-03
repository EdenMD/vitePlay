# HTML Recording — Frame Accuracy (Virtual Time)

Every `html-record` layer — audioSync or not, cached or not — now captures frames against a deterministic virtual clock instead of real wall-clock time. This fixes a real timing-drift bug that existed in the recorder from the start.

---

## Correction to prior guidance

Earlier discussion of this topic (in conversation, not previously written to a doc) claimed the frame-capture loop had **no pacing at all** — that it screenshotted as fast as possible with nothing controlling the interval between frames. That was wrong, and worth correcting plainly rather than leaving it uncorrected: the loop *did* pace itself, via a real-time wait after each screenshot (a `requestAnimationFrame` + `performance.now()` poll, racing a `setTimeout` backup, both targeting the frame's real millisecond duration).

The actual bug was subtler than "no pacing," and in the opposite direction from what was described: since that wait only covers the *target* frame duration and doesn't account for the real time spent on the screenshot itself, the `page.evaluate()` calls for interactions/audio dispatch, and Puppeteer's IPC round-trips, each loop iteration took slightly *longer* than one frame's worth of real time — not shorter. Over hundreds of frames, that per-frame overhead compounds: a page driven by its own real clock (native CSS `@keyframes`/transitions, or JS using `Date.now()`/`performance.now()`/`requestAnimationFrame` directly) would end up *further along* in its animation than the frame index implies, not behind. The recording was also never guaranteed reproducible run-to-run, since the overhead varies with CI machine load.

Same underlying conclusion as before (real-time-clock-driven content isn't frame-locked), different and more accurate mechanism. Documenting the correction here rather than leaving the earlier explanation as the record.

---

## The Fix — CDP Virtual Time

`recordHTML()` now takes over the page's actual internal clock via the Chrome DevTools Protocol's `Emulation.setVirtualTimePolicy`, rather than trying to pace real wall-clock waits accurately. This is a browser-engine-level clock override, not a JavaScript monkey-patch — which matters, because a JS-side override of `Date.now`/`performance.now`/`requestAnimationFrame` would have no effect on native CSS `@keyframes`/`transition` animations at all (those are driven by the compositor, a different part of the engine than the JS realm). CDP virtual time governs both uniformly.

```
1. Page loads, waitFor/waitMs/cursor injection happen normally (real time — one-time setup, doesn't need to be frame-locked).
2. Right before the frame loop: Emulation.setVirtualTimePolicy({ policy: 'pause' })
   → the page's clock freezes here, in whatever state it's in.
3. For each frame (after frame 0):
   Emulation.setVirtualTimePolicy({ policy: 'advance', budget: <one frame's ms> })
   → wait for the 'Emulation.virtualTimeBudgetExpired' event
   → the page's clock has now moved forward by EXACTLY one frame's worth of
     time, no more, no less, regardless of how long the real capture took.
4. Screenshot.
5. Repeat.
```

Frame 0 captures the page's initial state unadvanced (t=0), matching how `frameT = f / recordFps` is used everywhere else in the codebase.

### Why `'advance'` and not `'pauseIfNetworkFetchesPending'`

`'advance'` does not block on pending network activity — real `fetch`/XHR calls on a page (e.g. a live-URL product-demo scene from `HTMLInteractions.md`) keep resolving on their own real schedule, completely unaffected by the page's virtualized JS/CSS clock. `'pauseIfNetworkFetchesPending'` looked like the more "correct" choice at first glance (wait for network activity before advancing), but it's a long-documented source of unpredictable hangs in Chromium — sometimes firing immediately, sometimes waiting the full budget regardless of actual network state. `'advance'` is simpler and doesn't have that failure mode, and doesn't need it: the recorder isn't trying to synchronize with network timing, only with the page's own animation clock.

### What this fixes

- **Native CSS `@keyframes`/`transition` animations** — now genuinely frame-locked, not just approximately paced.
- **`requestAnimationFrame`-driven JS** — any library (GSAP, anime.js, Three.js's internal clock, hand-rolled rAF loops) now advances in lockstep with captured frames, regardless of how long each capture iteration actually takes in real time.
- **`setTimeout`/`setInterval`-based JS timers** — also governed by the same virtual clock.
- **The Web Animations API** (`el.animate(...)`, used by the `animate-element` interaction action) — timeline-driven, so also correctly frame-locked now.
- **Reproducibility** — the same config now produces the same recorded frames regardless of CI machine load, since real elapsed capture time no longer has any bearing on the page's animation state.

### What this does NOT change

- **Interaction (`interactions: [...]`) pacing itself** — actions like `drag`, `swipe`, and `mouse-move` use real `setTimeout`-based waits *in Node/Puppeteer's own process* to pace the gesture (e.g. stepping a drag over N real intervals). That's unrelated to the page's internal clock and is untouched by this fix — those still take real wall-clock time to execute, which is correct (they're literally simulating a real user's gesture speed).
- **`audioSync`'s caching behavior** — audioSync layers still never cache, for the same reason as before (the recording depends on that scene's actual audio, which can change between runs). This fix makes the *frames themselves* deterministic; it doesn't change what gets cached.
- **Recording wall-clock speed** — if anything, this should make recording *faster* in real time for content that used to rely on the old real-time wait, since virtual time advances as fast as the browser can process pending timer callbacks rather than genuinely waiting out the frame duration in real time.

---

## Opting Out

```js
{ type: 'html-record', src: '...', realTime: true }
```

Falls back to the old real-time capture path (with its known imprecision) entirely. There's essentially no good reason to set this for normal use — it exists as an escape hatch for a page that has some real dependency on wall-clock behavior (e.g. something displaying or polling an actual real-time clock, or timing itself against genuinely elapsed wall time rather than its own internal animation state). If CDP virtual time fails to initialize for any reason (older Chrome, an unexpected restriction), the recorder automatically falls back to this same real-time path and logs a warning — this isn't a hard dependency that can break a recording outright.

---

## Cost

Effectively free. No extra Puppeteer overhead beyond one `createCDPSession()` call per recording and one small CDP round-trip per frame (replacing the old real-time wait, not adding to it). No new dependencies — `Emulation.setVirtualTimePolicy` is a long-stable, widely-used CDP method (the same mechanism tools like Lighthouse use internally for reproducible timing).