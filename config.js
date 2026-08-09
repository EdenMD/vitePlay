// drop-XX-typhoon-class.js  — rename XX to your next sequential drop number
// "The Typhoon-Class Submarine" — same locked 4-scene formula: Hook →
// Creator → Design Philosophy → CTA. bm_george voice, SerpAPI stills, no
// bg music, highlight captions (#f5c518, 60px, 3 words/chunk).
//
// Russian/Soviet subject — same NARA caveat as the KF-21/NTW-20 files:
// US National Archives won't have Soviet submarine footage, expect the
// fallback sequence every time. Design Philosophy uses the rotate-
// accented stock-image-sequence pattern, same as the last two files.
//
// Run with:  VIDEO_CONFIG=drop-XX-typhoon-class.js node engine-ci.js

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
        (await resolveNaraClip('Typhoon class submarine')) ||
        (await resolveNaraClip('Soviet Akula submarine'));

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
                  'submarine hull cross section diagram',
                  'nuclear submarine interior',
                  'submarine missile hatch',
                  'Typhoon class submarine surfaced',
              ],
              source: 'serpapi',
              fit: 'cover',
              kenBurnsSequence: [
                  { kenBurns: 'zoom-in',   kenBurnsAmount: 0.32 },
                  { kenBurns: 'rotate-cw', kenBurnsAmount: 0.3, rotateDeg: 10 },
                  { kenBurns: 'pan-left',  kenBurnsAmount: 0.3 },
                  { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10 },
              ],
              x: 0, y: 0, width: 1080, height: 1920,
          };

    return {
        output: {
            title: 'typhoon-class-submarine',
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
                    text: "This is the Typhoon-class submarine, and it's still the largest submarine ever built by any country on Earth — big enough to carry its own sauna and swimming pool for the crew. Here's why the Soviet Union built something this massive.",
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
                        type: 'stock-image', query: 'Typhoon class submarine',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-in', kenBurnsAmount: 0.34,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                    {
                        type: 'text', text: 'THE LARGEST\nSUBMARINE\nEVER BUILT', x: 540, y: 260,
                        fontSize: 60, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center', hookLayer: true,
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },

            // ── Scene 2 — Creator ───────────────────────────────────
            {
                tts: {
                    text: "The Soviet Union's Rubin Design Bureau built it, entering service in the early nineteen eighties at the height of the Cold War, designed to hide beneath the Arctic ice and survive a first nuclear strike if one ever came.",
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
                        type: 'stock-image', query: 'Soviet submarine shipyard',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'pan-up', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                    {
                        type: 'text', text: 'RUBIN DESIGN\nBUREAU', x: 540, y: 1500,
                        fontSize: 50, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 3 — Design Philosophy (NARA fallback expected) ──
            {
                tts: {
                    text: "It was built with two separate pressure hulls side by side, wrapped inside one outer hull, giving the crew room the West's own submarines simply didn't have. Submerged, it displaced nearly three times the weight of an American Ohio-class submarine, while carrying twenty nuclear missiles built for months-long patrols under the ice, far from any port.",
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
                        type: 'text', text: 'TWO HULLS.\nONE MASSIVE\nSHIP.', x: 540, y: 1560,
                        fontSize: 48, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 4 — CTA (provocative, comment-bait framing) ───
            {
                tts: {
                    text: "So here's the question. Was building the largest submarine ever really about firepower, or about proving what Soviet engineering could pull off? Comment your take below.",
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
                        type: 'stock-image', query: 'submarine surfaced Arctic ice',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                    {
                        type: 'text', text: 'FIREPOWER OR\nENGINEERING FLEX?\nCOMMENT BELOW', x: 540, y: 900,
                        fontSize: 50, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },
        ],
    };
})();