// drop-XX-nb36h-nuclear-bomber.js  — rename XX to your next sequential drop number
// "The Convair NB-36H" — same locked 4-scene formula as the F-22 benchmark:
// Hook → Creator → Design Philosophy → CTA. bm_george voice, SerpAPI stills
// w/ Ken Burns 0.30-0.36, no bg music, highlight captions (#f5c518, 60px,
// 3 words/chunk).
//
// Why this one: a real Cold War bomber flew 47 test flights with a live,
// fully operational nuclear reactor behind the cockpit. Most people have
// never heard of it, the hook writes itself ("a plane flew with a nuclear
// reactor onboard"), and every fact below is checked against multiple
// sources (This Day in Aviation, USAF historical records, Wikipedia,
// Grokipedia) rather than assumed — the contested details (exact reactor
// wattage: sources split 1MW/3MW; exact program-cancellation year: sources
// split 1957/1958/1961) are deliberately left out of the narration rather
// than picking one and asserting it as fact.
//
// Same NARA-footage pattern as the F-22 benchmark's Scene 3, same
// fallback-to-still-image safety net if NARA has nothing usable for the
// query — copied structure, not reinvented, so it behaves identically to
// the proven benchmark.
//
// Run with:  VIDEO_CONFIG=drop-XX-nb36h-nuclear-bomber.js node engine-ci.js

const NARA_SEARCH = 'https://catalog.archives.gov/api/v2/records/search';

// Pulls the first NARA record that has an actual playable video file
// attached (not just a metadata/photo record), or returns null so the
// scene can fall back to a still image instead of failing the render.
async function resolveNaraClip(query) {
    try {
        const res = await fetch(
            `${NARA_SEARCH}?q=${encodeURIComponent(query)}&limit=20&resultTypes=video`
        );
        if (!res.ok) return null;
        const data = await res.json();
        const hits = data?.body?.hits?.hits || [];

        for (const hit of hits) {
            const record = hit?._source?.record;
            const objects = record?.digitalObjects || [];
            const videoObj = objects.find(o =>
                (o.objectType || '').toLowerCase().includes('video') ||
                (o.objectFilename || '').match(/\.(mp4|mov|mpg|mpeg)$/i)
            );
            if (videoObj?.objectUrl) {
                return videoObj.objectUrl;
            }
        }
        return null;
    } catch (err) {
        console.warn(`[NARA] lookup failed for "${query}":`, err.message);
        return null;
    }
}

module.exports = (async () => {
    // Try a couple of query variants — NARA's tagging is inconsistent,
    // so a narrower miss should still fall through to a broader one.
    const naraUrl =
        (await resolveNaraClip('NB-36H nuclear test aircraft')) ||
        (await resolveNaraClip('Convair B-36 nuclear reactor Carswell'));

    const designPhilosophyVisual = naraUrl
        ? {
              type: 'video',
              url: naraUrl,
              maxDuration: 6,
              fps: 30,
              loop: true,
              x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
          }
        : {
              type: 'stock-image',
              query: 'Convair NB-36H nuclear reactor shielded cockpit',
              source: 'serpapi',
              fit: 'cover',
              kenBurns: 'zoom-in',
              kenBurnsAmount: 0.32,
          };

    return {
        output: {
            title: 'nb36h-nuclear-bomber',
            format: 'portrait',
            fps: 30,
            crf: 23,
            preset: 'medium',
        },

        defaults: {
            voice: 'bm_george',
            transition: 'fade',
            transitionDuration: 0.3,
        },

        scenes: [
            // ── Scene 1 — Hook ──────────────────────────────────────
            {
                tts: {
                    text: "This plane flew forty seven real test flights with a live, fully operational nuclear reactor sitting right behind the cockpit. Not a mockup. Not a model. A working reactor, running, mid-air, over American soil.",
                    voice: 'bm_george',
                    pauseAfter: 0.4,
                },
                captions: {
                    style: 'highlight', fontSize: 60, color: '#ffffff',
                    highlightColor: '#f5c518', wordsPerChunk: 3,
                    strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
                },
                layers: [
                    {
                        type: 'stock-image', query: 'Convair NB-36H nuclear bomber',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-in', kenBurnsAmount: 0.34,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                    {
                        type: 'text', text: 'THE BOMBER THAT\nFLEW WITH A LIVE\nNUCLEAR REACTOR', x: 540, y: 260,
                        fontSize: 62, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center', hookLayer: true,
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },

            // ── Scene 2 — Creator ───────────────────────────────────
            {
                tts: {
                    text: "Convair converted a tornado-damaged B-36 bomber into the NB-36H for the Air Force's Nuclear Aircraft Propulsion program in the nineteen fifties, installing a thirty five thousand pound reactor built by Oak Ridge National Laboratory into its bomb bay, to find out if a plane could one day fly on atomic power alone.",
                    voice: 'bm_george',
                    pauseAfter: 0.4,
                },
                captions: {
                    style: 'highlight', fontSize: 60, color: '#ffffff',
                    highlightColor: '#f5c518', wordsPerChunk: 3,
                    strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
                },
                layers: [
                    {
                        type: 'stock-image', query: 'B-36 Peacemaker bomber Carswell Air Force Base 1950s',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'pan-up', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                    {
                        type: 'text', text: 'CONVAIR &\nOAK RIDGE NATIONAL LAB', x: 540, y: 1500,
                        fontSize: 50, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 3 — Design Philosophy (NARA footage) ──────────
            {
                tts: {
                    text: "Every inch of the crew compartment was rebuilt around one problem: radiation. Eleven tons of lead and rubber wrapped a brand new nose section, with windows over ten inches thick just so the pilots could see out. And on every single flight, a chase plane followed close behind, tracking radiation levels in case the unthinkable happened.",
                    voice: 'bm_george',
                    pauseAfter: 0.4,
                },
                captions: {
                    style: 'highlight', fontSize: 60, color: '#ffffff',
                    highlightColor: '#f5c518', wordsPerChunk: 3,
                    strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
                },
                layers: [
                    designPhilosophyVisual,
                    { type: 'overlay', color: 'rgba(0,0,0,0.25)' },
                    {
                        type: 'text', text: 'SHIELDED FIRST.\nPOWERED NEVER.', x: 540, y: 1560,
                        fontSize: 52, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 4 — CTA (provocative, comment-bait framing) ───
            {
                tts: {
                    text: "So here's the twist. In two hundred fifteen hours of flight, that reactor never once powered the plane. It was only ever there to prove a crew could survive flying next to it. Would you fly on a nuclear powered plane if one existed today? Comment your answer below, and like and subscribe for more stories like this one.",
                    voice: 'bm_george',
                    pauseAfter: 0.3,
                },
                captions: {
                    style: 'highlight', fontSize: 60, color: '#ffffff',
                    highlightColor: '#f5c518', wordsPerChunk: 3,
                    strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5,
                },
                layers: [
                    {
                        type: 'stock-image', query: 'NB-36H B-36 bomber nuclear test flight chase plane',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-out', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                    {
                        type: 'text', text: 'NUCLEAR PLANES:\nWOULD YOU FLY ONE?', x: 540, y: 900,
                        fontSize: 56, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                    // Subscribe sticker — `sticker: true` for a transparent
                    // background instead of a filled square sitting over the
                    // footage. Uses `query` + `resultIndex: 0` (top search hit)
                    // rather than a specific `id`: I can't fetch giphy.com from
                    // here to confirm a specific asset ID is real and looks
                    // right, so asserting one would've been a guess dressed up
                    // as a lookup. `query` is honest about that — it resolves
                    // to whatever Giphy actually returns at render time. Bump
                    // resultIndex (0-9) if the top hit isn't the right one once
                    // you see it render; switch to a specific `id` once you've
                    // picked a favorite from giphy.com, for a locked, repeatable
                    // result (see documentations/Giphy.md, "Query vs ID").
                    // Corner-badge size/position (top-right, y 90-390) is clear
                    // of both the headline (y:900) and the default highlight-
                    // caption band (baseY = H*0.83 ≈ y:1594 — see src/captions.js).
                    {
                        type: 'giphy',
                        query: 'like and subscribe',
                        sticker: true,
                        resultIndex: 0,
                        x: 740, y: 90, width: 300, height: 300,
                        fit: 'contain',
                    },
                ],
            },
        ],
    };
})();