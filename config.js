// drop-XX-iowa-16inch.js  — rename XX to your next sequential drop number
// "The Iowa-Class 16-Inch Guns" — same locked 4-scene formula: Hook →
// Creator → Design Philosophy → CTA. bm_george voice, SerpAPI stills, no
// bg music, highlight captions (#f5c518, 60px, 3 words/chunk).
//
// Design Philosophy fallback is a rotate-accented stock-image-sequence,
// same pattern as the GAU-8 file. American subject, WWII-era — NARA has
// a genuinely decent shot here since it's older, declassified, and
// heavily photographed by the Navy at the time, unlike the modern jets.
//
// Run with:  VIDEO_CONFIG=drop-XX-iowa-16inch.js node engine-ci.js

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
        (await resolveNaraClip('Iowa class battleship 16 inch guns firing')) ||
        (await resolveNaraClip('USS Iowa battleship guns'));

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
                  'battleship 16 inch gun turret',
                  'battleship shell closeup',
                  'battleship gun crew loading',
                  'Iowa class battleship firing',
              ],
              source: 'serpapi',
              fit: 'cover',
              kenBurnsSequence: [
                  { kenBurns: 'zoom-in',    kenBurnsAmount: 0.32 },
                  { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10 },
                  { kenBurns: 'pan-right',  kenBurnsAmount: 0.3 },
                  { kenBurns: 'rotate-cw',  kenBurnsAmount: 0.3, rotateDeg: 10 },
              ],
              x: 0, y: 0, width: 1080, height: 1920,
          };

    return {
        output: {
            title: 'iowa-class-16inch-guns',
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
                    text: "These are the sixteen-inch guns of the Iowa-class battleships, and every shell they fired weighed almost as much as a small car, launched over twenty miles. Here's why the Navy still hasn't built anything that hits quite like this.",
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
                        type: 'stock-image', query: 'battleship 16 inch guns',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-in', kenBurnsAmount: 0.34,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                    {
                        type: 'text', text: 'A SHELL THE\nSIZE OF A\nSMALL CAR', x: 540, y: 260,
                        fontSize: 60, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center', hookLayer: true,
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },

            // ── Scene 2 — Creator ───────────────────────────────────
            {
                tts: {
                    text: "The US Navy built them in the early nineteen forties for the Iowa-class battleships, the final and most powerful battleships America ever built, right before aircraft carriers and missiles took over naval warfare for good.",
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
                        type: 'stock-image', query: 'shipyard battleship construction',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'pan-up', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                    {
                        type: 'text', text: 'US NAVY,\n1940s', x: 540, y: 1500,
                        fontSize: 52, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 3 — Design Philosophy (NARA footage likely, decent odds here) ──
            {
                tts: {
                    text: "Each turret held three barrels, each one capable of firing a shell weighing up to twenty-seven hundred pounds, at a muzzle velocity over twenty-five hundred feet per second. It took a crew of dozens working together inside one turret just to load and fire a single shot. This wasn't a weapon one person operated. It was a machine an entire ship was built to feed.",
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
                        type: 'text', text: 'A WEAPON A\nWHOLE SHIP\nWAS BUILT TO FEED', x: 540, y: 1560,
                        fontSize: 44, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 4 — CTA (provocative, comment-bait framing) ───
            {
                tts: {
                    text: "So here's the question. Even with modern missiles, is there something a sixteen-inch naval gun can still do that no missile ever really replaced? Comment your take below.",
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
                        type: 'stock-image', query: 'Iowa class battleship at sea',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'rotate-cw', kenBurnsAmount: 0.3, rotateDeg: 10,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                    {
                        type: 'text', text: 'STILL UNMATCHED?\nCOMMENT\nYOUR TAKE', x: 540, y: 900,
                        fontSize: 56, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },
        ],
    };
})();