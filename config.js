// drop-XX-gau8-avenger.js  — rename XX to your next sequential drop number
// "The GAU-8 Avenger" — same locked 4-scene formula: Hook → Creator →
// Design Philosophy → CTA. bm_george voice, SerpAPI stills, no bg music,
// highlight captions (#f5c518, 60px, 3 words/chunk).
//
// NEW this batch: Design Philosophy's fallback is now a
// stock-image-sequence (4 slides) with a mixed kenBurnsSequence — 2 of
// the 4 slides use the new rotate-cw/rotate-ccw Ken Burns type, the
// other 2 stay zoom/pan, per the "mix, don't uniform-ize" guidance.
// Fixes the exact "long static scene reads as dead air" problem —
// Design Philosophy is always this template's longest scene.
//
// American subject, so same odds as the T-7A file: NARA *might* have
// something, but don't expect it — falls straight to the sequence below
// either way.
//
// Run with:  VIDEO_CONFIG=drop-XX-gau8-avenger.js node engine-ci.js

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
        (await resolveNaraClip('GAU-8 Avenger A-10 cannon')) ||
        (await resolveNaraClip('A-10 Warthog gun firing'));

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
                  'GAU-8 Avenger cannon closeup',
                  'A-10 Warthog nose gun',
                  '30mm depleted uranium round',
                  'A-10 Warthog firing gun',
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
            title: 'gau8-avenger',
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
                    text: "This is the GAU-8 Avenger, the rotary cannon built into the A-10 Warthog, and it fires so hard that the recoil alone can measurably slow the whole aircraft down mid-flight. Here's how a gun got powerful enough to fight its own airplane.",
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
                        type: 'stock-image', query: 'GAU-8 Avenger cannon',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-in', kenBurnsAmount: 0.34,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                    {
                        type: 'text', text: 'THE GUN THAT\nFIGHTS ITS OWN\nAIRPLANE', x: 540, y: 260,
                        fontSize: 60, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center', hookLayer: true,
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },

            // ── Scene 2 — Creator ───────────────────────────────────
            {
                tts: {
                    text: "General Electric built it in the nineteen seventies, and it wasn't designed to fit an existing plane. The A-10 Warthog was designed around the gun instead — the entire aircraft built as a platform for one job: killing tanks.",
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
                        type: 'stock-image', query: 'General Electric factory',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'pan-up', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                    {
                        type: 'text', text: 'GENERAL\nELECTRIC', x: 540, y: 1500,
                        fontSize: 52, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 3 — Design Philosophy (NARA footage, expect fallback sequence) ──
            {
                tts: {
                    text: "Seven rotating barrels fire depleted-uranium rounds at nearly four thousand rounds a minute, fast enough to shred a tank's armor in under two seconds. The gun is mounted slightly off-center from the plane's nose, engineered specifically to counter the sideways force of its own recoil. The Warthog wasn't just built to carry this weapon. It was built to survive firing it.",
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
                        type: 'text', text: 'BUILT AROUND\nTHE GUN.\nNOT THE OTHER\nWAY AROUND.', x: 540, y: 1560,
                        fontSize: 42, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 4 — CTA (provocative, comment-bait framing) ───
            {
                tts: {
                    text: "So here's the question. When an entire airplane gets built around its gun instead of the other way around, is it still fair to call it a fighter jet? Comment your take below.",
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
                        type: 'stock-image', query: 'A-10 Warthog flying',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                    {
                        type: 'text', text: 'STILL A JET?\nOR JUST\nA FLYING GUN?', x: 540, y: 900,
                        fontSize: 54, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },
        ],
    };
})();