// drop-XX-yasen-class.js  — rename XX to your next sequential drop number
// "The Yasen-Class Submarine" — same locked 4-scene formula: Hook →
// Creator → Design Philosophy → CTA. bm_george voice, SerpAPI stills, no
// bg music, highlight captions (#f5c518, 60px, 3 words/chunk).
//
// Russian subject, modern — same NARA-miss expectation as the last two
// submarine files. Design Philosophy uses the same rotate-accented
// stock-image-sequence pattern.
//
// Run with:  VIDEO_CONFIG=drop-XX-yasen-class.js node engine-ci.js

const NARA_SEARCH = 'https://catalog.archives.gov/api/v2/records/search';

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
    const naraUrl =
        (await resolveNaraClip('Yasen class submarine Severodvinsk')) ||
        (await resolveNaraClip('Russian attack submarine'));

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
              type: 'stock-image-sequence',
              queries: [
                  'submarine torpedo tube',
                  'submarine cruise missile launch',
                  'submarine sonar array',
                  'Yasen class submarine surfaced',
              ],
              source: 'serpapi',
              fit: 'cover',
              kenBurnsSequence: [
                  { kenBurns: 'zoom-in',    kenBurnsAmount: 0.32 },
                  { kenBurns: 'rotate-cw',  kenBurnsAmount: 0.3, rotateDeg: 10 },
                  { kenBurns: 'pan-left',   kenBurnsAmount: 0.3 },
                  { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10 },
              ],
              x: 0, y: 0, width: 1080, height: 1920,
          };

    return {
        output: {
            title: 'yasen-class-submarine',
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
                    text: "This is the Yasen-class submarine, and Russian officials have called it one of the quietest submarines ever built — quiet enough that Western navies have reportedly struggled to track it at all. Here's what makes it different.",
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
                        type: 'stock-image', query: 'Yasen class submarine',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-in', kenBurnsAmount: 0.34,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                    {
                        type: 'text', text: 'THE SUBMARINE\nNOBODY CAN\nHEAR COMING', x: 540, y: 260,
                        fontSize: 58, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center', hookLayer: true,
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },

            // ── Scene 2 — Creator ───────────────────────────────────
            {
                tts: {
                    text: "Russia's Malachite Design Bureau built it. The lead submarine, Severodvinsk, was actually laid down in the late nineteen eighties, but wasn't finished until twenty thirteen, after Soviet collapse froze the project for over a decade.",
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
                        type: 'stock-image', query: 'Russian submarine shipyard',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'pan-up', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                    {
                        type: 'text', text: 'MALACHITE\nDESIGN BUREAU', x: 540, y: 1500,
                        fontSize: 48, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 3 — Design Philosophy (NARA fallback expected) ──
            {
                tts: {
                    text: "Cold War submarines split the job in two: one class hunted other submarines, a separate class carried cruise missiles. This one does both in a single hull, wrapped in advanced sound-dampening built to make it as close to silent as a nuclear submarine gets. It carries both torpedoes and long-range cruise missiles, including hypersonic weapons still being tested today.",
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
                        type: 'text', text: 'TWO SUBMARINES\nWORTH OF JOB.\nONE HULL.', x: 540, y: 1560,
                        fontSize: 46, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 4 — CTA (provocative, comment-bait framing) ───
            {
                tts: {
                    text: "So here's the question. Does combining an attack submarine and a missile submarine into one hull actually make it more dangerous, or just more expensive to lose? Comment your take below.",
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
                        type: 'stock-image', query: 'submarine deep water dark',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                    {
                        type: 'text', text: 'MORE DANGEROUS?\nOR JUST MORE\nEXPENSIVE TO LOSE?', x: 540, y: 900,
                        fontSize: 46, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },
        ],
    };
})();// drop-XX-yasen-class.js  — rename XX to your next sequential drop number
// "The Yasen-Class Submarine" — same locked 4-scene formula: Hook →
// Creator → Design Philosophy → CTA. bm_george voice, SerpAPI stills, no
// bg music, highlight captions (#f5c518, 60px, 3 words/chunk).
//
// Russian subject, modern — same NARA-miss expectation as the last two
// submarine files. Design Philosophy uses the same rotate-accented
// stock-image-sequence pattern.
//
// Run with:  VIDEO_CONFIG=drop-XX-yasen-class.js node engine-ci.js

const NARA_SEARCH = 'https://catalog.archives.gov/api/v2/records/search';

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
    const naraUrl =
        (await resolveNaraClip('Yasen class submarine Severodvinsk')) ||
        (await resolveNaraClip('Russian attack submarine'));

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
              type: 'stock-image-sequence',
              queries: [
                  'submarine torpedo tube',
                  'submarine cruise missile launch',
                  'submarine sonar array',
                  'Yasen class submarine surfaced',
              ],
              source: 'serpapi',
              fit: 'cover',
              kenBurnsSequence: [
                  { kenBurns: 'zoom-in',    kenBurnsAmount: 0.32 },
                  { kenBurns: 'rotate-cw',  kenBurnsAmount: 0.3, rotateDeg: 10 },
                  { kenBurns: 'pan-left',   kenBurnsAmount: 0.3 },
                  { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10 },
              ],
              x: 0, y: 0, width: 1080, height: 1920,
          };

    return {
        output: {
            title: 'yasen-class-submarine',
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
                    text: "This is the Yasen-class submarine, and Russian officials have called it one of the quietest submarines ever built — quiet enough that Western navies have reportedly struggled to track it at all. Here's what makes it different.",
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
                        type: 'stock-image', query: 'Yasen class submarine',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-in', kenBurnsAmount: 0.34,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                    {
                        type: 'text', text: 'THE SUBMARINE\nNOBODY CAN\nHEAR COMING', x: 540, y: 260,
                        fontSize: 58, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center', hookLayer: true,
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },

            // ── Scene 2 — Creator ───────────────────────────────────
            {
                tts: {
                    text: "Russia's Malachite Design Bureau built it. The lead submarine, Severodvinsk, was actually laid down in the late nineteen eighties, but wasn't finished until twenty thirteen, after Soviet collapse froze the project for over a decade.",
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
                        type: 'stock-image', query: 'Russian submarine shipyard',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'pan-up', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                    {
                        type: 'text', text: 'MALACHITE\nDESIGN BUREAU', x: 540, y: 1500,
                        fontSize: 48, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 3 — Design Philosophy (NARA fallback expected) ──
            {
                tts: {
                    text: "Cold War submarines split the job in two: one class hunted other submarines, a separate class carried cruise missiles. This one does both in a single hull, wrapped in advanced sound-dampening built to make it as close to silent as a nuclear submarine gets. It carries both torpedoes and long-range cruise missiles, including hypersonic weapons still being tested today.",
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
                        type: 'text', text: 'TWO SUBMARINES\nWORTH OF JOB.\nONE HULL.', x: 540, y: 1560,
                        fontSize: 46, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 4 — CTA (provocative, comment-bait framing) ───
            {
                tts: {
                    text: "So here's the question. Does combining an attack submarine and a missile submarine into one hull actually make it more dangerous, or just more expensive to lose? Comment your take below.",
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
                        type: 'stock-image', query: 'submarine deep water dark',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                    {
                        type: 'text', text: 'MORE DANGEROUS?\nOR JUST MORE\nEXPENSIVE TO LOSE?', x: 540, y: 900,
                        fontSize: 46, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },
        ],
    };
})();