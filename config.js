// drop-XX-f22-raptor.js  — rename XX to your next sequential drop number
// "The F-22 Raptor" — locked 4-scene formula: Hook → Creator → Design
// Philosophy → CTA. bm_george voice, SerpAPI stills w/ Ken Burns 0.30-0.36,
// no bg music, highlight captions (#f5c518, 60px, 3 words/chunk).
//
// NEW: Scene 3 (Design Philosophy) uses the new `video` layer with real
// NARA footage instead of a still image — resolved live via an async IIFE
// that hits the Catalog API's public search endpoint (no key required for
// read-only search). Falls back to a still SerpAPI image automatically if
// NARA has no usable video asset for the query, so a render never breaks.
//
// Run with:  VIDEO_CONFIG=drop-XX-f22-raptor.js node engine-ci.js

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
        (await resolveNaraClip('F-22 Raptor flight demonstration')) ||
        (await resolveNaraClip('F-22 Raptor Air Force'));

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
              query: 'F-22 Raptor stealth fighter jet',
              source: 'serpapi',
              fit: 'cover',
              kenBurns: 'zoom-in',
              kenBurnsAmount: 0.32,
          };

    return {
        output: {
            title: 'f22-raptor',
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
                    text: "This is the F-22 Raptor, the fighter jet the US Air Force has never let another country buy. Not allies, not partners, nobody. Here's why they guard it so closely.",
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
                        type: 'stock-image', query: 'F-22 Raptor fighter jet',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-in', kenBurnsAmount: 0.34,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                    {
                        type: 'text', text: 'THE JET NO ONE\nELSE IS ALLOWED\nTO FLY', x: 540, y: 260,
                        fontSize: 66, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center', hookLayer: true,
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },

            // ── Scene 2 — Creator ───────────────────────────────────
            {
                tts: {
                    text: "Lockheed Martin built the Raptor with Boeing in the nineteen nineties, beating out Northrop's design in a fly-off competition. It was engineered from day one for one job: win air superiority before the enemy even sees you coming.",
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
                        type: 'stock-image', query: 'Lockheed Martin F-22 factory production',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'pan-up', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                    {
                        type: 'text', text: 'LOCKHEED MARTIN\n& BOEING', x: 540, y: 1500,
                        fontSize: 52, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 3 — Design Philosophy (NARA footage) ──────────
            {
                tts: {
                    text: "Every inch of the Raptor is built around stealth and speed. Radar-absorbing skin, internal weapons bays so nothing breaks its shape, and thrust-vectoring engines that let it out-turn jets that should out-turn it. It doesn't win by being seen first. It wins by never being seen at all.",
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
                        type: 'text', text: 'STEALTH FIRST.\nSPEED SECOND.\nSEEN NEVER.', x: 540, y: 1560,
                        fontSize: 50, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 4 — CTA (provocative, comment-bait framing) ───
            {
                tts: {
                    text: "So here's the question. In a straight one-on-one dogfight, would you trust the Raptor over a modern Eagle? Comment your pick below.",
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
                        type: 'stock-image', query: 'F-22 Raptor vs F-15 Eagle',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-out', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                    {
                        type: 'text', text: 'RAPTOR OR EAGLE?\nCOMMENT YOUR PICK', x: 540, y: 900,
                        fontSize: 58, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },
        ],
    };
})();
