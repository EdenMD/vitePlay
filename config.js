// drop-XX-ntw20.js  — rename XX to your next sequential drop number
// "The NTW-20" — same locked 4-scene formula as the F-22/KF-21/T-7A
// drops: Hook → Creator → Design Philosophy → CTA. bm_george voice,
// SerpAPI stills w/ Ken Burns 0.30-0.36, no bg music, highlight captions
// (#f5c518, 60px, 3 words/chunk).
//
// Not a jet this time — same formula applied to a weapon instead, per
// your ask. South African, so same NARA caveat as the KF-21 file: US
// National Archives almost certainly has nothing on it, so Scene 3 will
// fall back to the SerpAPI still every time. Fine, just setting
// expectations the same way as last time.
//
// Run with:  VIDEO_CONFIG=drop-XX-ntw20.js node engine-ci.js

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
    const naraUrl =
        (await resolveNaraClip('NTW-20 anti-materiel rifle')) ||
        (await resolveNaraClip('20mm anti-materiel rifle'));

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
              query: 'NTW-20 rifle',
              source: 'serpapi',
              fit: 'cover',
              kenBurns: 'zoom-in',
              kenBurnsAmount: 0.32,
          };

    return {
        output: {
            title: 'ntw20-anti-materiel-rifle',
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
                    text: "This is the NTW-20, and it doesn't fire a sniper bullet. It fires an actual anti-aircraft cannon shell. Here's why this might be the most powerful rifle ever built for a single person to carry into the field.",
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
                        type: 'stock-image', query: 'NTW-20 rifle',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-in', kenBurnsAmount: 0.34,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                    {
                        type: 'text', text: 'NOT A BULLET.\nA CANNON\nSHELL.', x: 540, y: 260,
                        fontSize: 66, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center', hookLayer: true,
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },

            // ── Scene 2 — Creator ───────────────────────────────────
            {
                tts: {
                    text: "South Africa built it in the nineteen nineties, originally under Mechem, later produced by Denel Land Systems. It wasn't designed to hunt people. It was designed to destroy equipment — parked aircraft, radar systems, light armored vehicles, from a distance most rifles can't touch.",
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
                        type: 'stock-image', query: 'Denel Land Systems factory',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'pan-up', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                    {
                        type: 'text', text: 'DENEL LAND\nSYSTEMS', x: 540, y: 1500,
                        fontSize: 52, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 3 — Design Philosophy (NARA footage, expect fallback) ──
            {
                tts: {
                    text: "It fires the same twenty millimeter rounds built for anti-aircraft guns, and the barrel can be swapped to fire a smaller round instead. It's too heavy and too violent to fire from a shoulder, so it's braced against the ground on folding legs. It even breaks down into two backpack-sized loads, so two soldiers can carry it into position and put it back together by hand.",
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
                        type: 'text', text: 'BUILT TO\nDESTROY MACHINES.\nNOT JUST MEN.', x: 540, y: 1560,
                        fontSize: 48, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 4 — CTA (provocative, comment-bait framing) ───
            {
                tts: {
                    text: "So here's the question. If a single rifle can knock out a parked helicopter from over a mile away, should something like this even still be called a rifle? Comment your take below.",
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
                        type: 'stock-image', query: 'anti-materiel rifle closeup',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-out', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                    {
                        type: 'text', text: 'STILL A RIFLE?\nCOMMENT\nYOUR TAKE', x: 540, y: 900,
                        fontSize: 58, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },
        ],
    };
})();