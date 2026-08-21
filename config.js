// config.top5-deadliest-soldiers.js
// "Top 5 Deadliest Soldiers In History" — countdown short, 7 scenes.
// Voice: am_santa throughout, as requested. Rotate Ken Burns used
// generously (4 of 5 entries + hook) rather than sparingly this time —
// "multiple rotate images" was explicit, so this leans further into it
// than the usual "mix, don't uniform-ize" 1-in-4 ratio from other files.
//
// SOURCING — ranked strictly by widely-documented CONFIRMED kill counts,
// not disputed/claimed totals. A few commonly-cited names (e.g. Ivan
// Sidorenko's 500+ claim) were deliberately left off this list because
// their figures aren't as rigorously sourced as the five below:
//   1. Simo Häyhä (Finland, Winter War) — 505 confirmed, iron sights only
//   2. Vasily Zaytsev (USSR, Stalingrad) — 225 confirmed
//   3. Chris Kyle (US Navy SEAL, Iraq) — 160 confirmed, Pentagon-credited
//   4. Adelbert Waldron (US Army, Vietnam) — 109 confirmed, highest US
//      total of that war
//   5. Carlos Hathcock (USMC, Vietnam) — 93 confirmed
//
// Framed as historical/documentary record throughout, not glorification —
// same tone as the rest of this channel's weapons-history content.
//
// Run with:  VIDEO_CONFIG=config.top5-deadliest-soldiers.js node engine-ci.js

module.exports = {
    output: {
        title:  'top5-deadliest-soldiers',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'medium',
        postProcess: { grain: true, grainStrength: 0.02, vignette: true, vignetteStrength: 0.4 },
    },

    defaults: { voice: 'am_santa', transition: 'zoom-cut', transitionDuration: 0.3 },

    scenes: [

        // ── HOOK ──────────────────────────────────────────────────────
        {
            tts: { text: "These aren't fictional characters. These are five real soldiers, credited with more confirmed kills than entire platoons combined.", pauseAfter: 0.3 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 58, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'sniper rifle soldier silhouette', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'zoom-in', kenBurnsAmount: 0.34, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                { type: 'text', text: 'TOP 5 DEADLIEST\nSOLDIERS EVER', x: 540, y: 260, fontSize: 64, fontFamily: 'Arial Black, sans-serif', color: '#f5c518', align: 'center', stroke: true, strokeColor: '#000', strokeWidth: 5, hookLayer: true },
            ],
        },

        // ── #5 — Carlos Hathcock ─────────────────────────────────────
        {
            tts: { text: "Number five: Carlos Hathcock, United States Marine Corps, Vietnam. Ninety-three confirmed kills, including one shot fired from over a mile away that snipers still study today.", pauseAfter: 0.25 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'Vietnam War soldier jungle', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'rotate-cw', kenBurnsAmount: 0.32, rotateDeg: 9, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
                { type: 'text', text: '#5', x: 160, y: 220, fontSize: 110, fontFamily: 'Arial Black, sans-serif', color: '#f5c518', stroke: true, strokeColor: '#000', strokeWidth: 6 },
                { type: 'text', text: 'CARLOS HATHCOCK\n93 CONFIRMED', x: 540, y: 1650, fontSize: 44, fontFamily: 'Arial Black, sans-serif', color: '#ffffff', align: 'center', stroke: true, strokeColor: '#000', strokeWidth: 4 },
            ],
        },

        // ── #4 — Adelbert Waldron ────────────────────────────────────
        {
            tts: { text: "Number four: Adelbert Waldron, United States Army, Vietnam. One hundred nine confirmed kills — the highest total of any American sniper in that entire war.", pauseAfter: 0.25 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'soldier river boat patrol', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'rotate-ccw', kenBurnsAmount: 0.32, rotateDeg: 9, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
                { type: 'text', text: '#4', x: 160, y: 220, fontSize: 110, fontFamily: 'Arial Black, sans-serif', color: '#f5c518', stroke: true, strokeColor: '#000', strokeWidth: 6 },
                { type: 'text', text: 'ADELBERT WALDRON\n109 CONFIRMED', x: 540, y: 1650, fontSize: 44, fontFamily: 'Arial Black, sans-serif', color: '#ffffff', align: 'center', stroke: true, strokeColor: '#000', strokeWidth: 4 },
            ],
        },

        // ── #3 — Chris Kyle ──────────────────────────────────────────
        {
            tts: { text: "Number three: Chris Kyle, United States Navy SEAL, Iraq. One hundred sixty confirmed kills, officially credited by the Pentagon, later chronicled in his own bestselling memoir.", pauseAfter: 0.25 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'Navy SEAL desert operation', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'rotate-cw', kenBurnsAmount: 0.32, rotateDeg: 9, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
                { type: 'text', text: '#3', x: 160, y: 220, fontSize: 110, fontFamily: 'Arial Black, sans-serif', color: '#f5c518', stroke: true, strokeColor: '#000', strokeWidth: 6 },
                { type: 'text', text: 'CHRIS KYLE\n160 CONFIRMED', x: 540, y: 1650, fontSize: 44, fontFamily: 'Arial Black, sans-serif', color: '#ffffff', align: 'center', stroke: true, strokeColor: '#000', strokeWidth: 4 },
            ],
        },

        // ── #2 — Vasily Zaytsev ──────────────────────────────────────
        {
            tts: { text: "Number two: Vasily Zaytsev, Soviet Red Army, the Battle of Stalingrad. Two hundred twenty-five confirmed kills, in one of the deadliest battles in human history.", pauseAfter: 0.25 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'Stalingrad ruins WWII soldier', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'rotate-ccw', kenBurnsAmount: 0.34, rotateDeg: 10, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
                { type: 'text', text: '#2', x: 160, y: 220, fontSize: 110, fontFamily: 'Arial Black, sans-serif', color: '#f5c518', stroke: true, strokeColor: '#000', strokeWidth: 6 },
                { type: 'text', text: 'VASILY ZAYTSEV\n225 CONFIRMED', x: 540, y: 1650, fontSize: 44, fontFamily: 'Arial Black, sans-serif', color: '#ffffff', align: 'center', stroke: true, strokeColor: '#000', strokeWidth: 4 },
            ],
        },

        // ── #1 — Simo Häyhä ──────────────────────────────────────────
        {
            tts: { text: "Number one: Simo Häyhä, Finland, the Winter War. Five hundred five confirmed kills, using an iron-sighted rifle with no scope at all — the highest confirmed total ever recorded.", pauseAfter: 0.4 },
            transition: 'glitch',
            captions: { style: 'highlight', position: 'bottom', fontSize: 56, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'Finnish soldier winter snow', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'rotate-cw', kenBurnsAmount: 0.36, rotateDeg: 11, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                { type: 'text', text: '#1', x: 160, y: 220, fontSize: 130, fontFamily: 'Arial Black, sans-serif', color: '#f5c518', stroke: true, strokeColor: '#000', strokeWidth: 7 },
                { type: 'text', text: 'SIMO HÄYHÄ\n505 CONFIRMED', x: 540, y: 1620, fontSize: 48, fontFamily: 'Arial Black, sans-serif', color: '#ffffff', align: 'center', stroke: true, strokeColor: '#000', strokeWidth: 5 },
                { type: 'text', text: '"THE WHITE DEATH"', x: 540, y: 1720, fontSize: 30, fontFamily: 'Arial Black, sans-serif', color: '#f5c518', align: 'center', stroke: true, strokeColor: '#000', strokeWidth: 3 },
            ],
        },

        // ── CTA ───────────────────────────────────────────────────────
        {
            tts: { text: "Which one surprised you the most? Comment your pick below, and subscribe for more history most people never hear.", pauseAfter: 0.3 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 58, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                { type: 'stock-image', query: 'military history archive photos', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'zoom-out', kenBurnsAmount: 0.3, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                { type: 'text', text: 'WHO SURPRISED YOU?\nCOMMENT BELOW', x: 540, y: 900, fontSize: 54, fontFamily: 'Arial Black, sans-serif', color: '#ffffff', align: 'center', stroke: true, strokeColor: '#000', strokeWidth: 5 },
            ],
        },

    ],
};