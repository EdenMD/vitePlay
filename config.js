// drop-XX-metal-storm.js  — rename XX to your next sequential drop number
// "Metal Storm" — same locked 4-scene formula: Hook → Creator → Design
// Philosophy → CTA. bm_george voice, SerpAPI stills, no bg music,
// highlight captions (#f5c518, 60px, 3 words/chunk).
//
// Continuation of the NTW-20 "most powerful" thread — real, documented:
// Australian-invented electronic firearm system (Mike O'Dwyer, 1990s)
// with no moving parts at all — rounds stacked inside the barrel and
// fired electronically instead of by a mechanical action. Drew serious
// US military/DARPA interest for close-in defense applications, but the
// company behind it struggled financially and the tech never saw wide
// battlefield adoption — a good comment-bait contrast to build the CTA
// around.
//
// Australian subject — expect the same NARA-miss behavior as the
// Typhoon/Borei/Yasen files. Design Philosophy uses the same
// rotate-accented stock-image-sequence pattern as the last batch.
//
// Run with:  VIDEO_CONFIG=drop-XX-metal-storm.js node engine-ci.js

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
        (await resolveNaraClip('Metal Storm weapon system')) ||
        (await resolveNaraClip('electronic firearm rapid fire test'));

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
                  'stacked ammunition barrel cutaway',
                  'electronic circuit board closeup',
                  'rapid fire weapon test range',
                  'Metal Storm weapon system',
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
            title: 'metal-storm',
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
                    text: "This is Metal Storm — a gun with no bolt, no firing pin, and no moving parts at all. In testing, it was reportedly fired at a rate of over a million rounds a minute. Here's how a gun this fast almost never made it to war.",
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
                        type: 'stock-image', query: 'Metal Storm weapon system',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-in', kenBurnsAmount: 0.34,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                    {
                        type: 'text', text: 'A GUN WITH NO\nMOVING PARTS\nAT ALL', x: 540, y: 260,
                        fontSize: 58, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center', hookLayer: true,
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },

            // ── Scene 2 — Creator ───────────────────────────────────
            {
                tts: {
                    text: "An Australian engineer named Mike O'Dwyer invented it in the nineteen nineties. He didn't try to improve the traditional gun mechanism. He scrapped it entirely, and rebuilt the idea from scratch around electronics instead of moving metal.",
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
                        type: 'stock-image', query: 'engineer workshop electronics',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'pan-up', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                    {
                        type: 'text', text: 'MIKE O\u2019DWYER,\n1990s', x: 540, y: 1500,
                        fontSize: 50, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 3 — Design Philosophy (NARA fallback expected) ──
            {
                tts: {
                    text: "Every round sits stacked directly inside the barrel itself, one in front of the other, each one fired by its own electronic pulse instead of a mechanical firing pin. With no bolt cycling and nothing physically moving between shots, there's nothing left to jam. The US military and DARPA both took a serious look at it for close-in defense systems.",
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
                        type: 'text', text: 'NOTHING MOVES.\nNOTHING\nTO JAM.', x: 540, y: 1560,
                        fontSize: 48, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 4 — CTA (provocative, comment-bait framing) ───
            {
                tts: {
                    text: "So here's the question. If removing every moving part makes a gun fire faster than almost anything else ever built, why do you think this one never actually made it onto the battlefield? Comment your take below.",
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
                        type: 'stock-image', query: 'rapid fire weapon closeup',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'rotate-ccw', kenBurnsAmount: 0.3, rotateDeg: 10,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                    {
                        type: 'text', text: 'TOO GOOD TO\nMAKE IT TO WAR?\nCOMMENT BELOW', x: 540, y: 900,
                        fontSize: 50, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },
        ],
    };
})();