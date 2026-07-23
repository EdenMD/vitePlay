// drop-XX-ah1-cobra.js  — rename XX to your next sequential drop number
// "The AH-1 Cobra" — locked 4-scene formula: Hook → Creator → Design
// Philosophy → CTA. bm_george voice, SerpAPI stills w/ Ken Burns 0.30-0.34,
// no bg music, highlight captions (#f5c518, 60px, 3 words/chunk).
//
// FIX FROM LAST DROP: resolveNaraClip() was using field names that don't
// exist in the real NARA v2 response (`objectType`, `resultTypes=video`).
// Corrected below to match the actual schema — a record's video/image
// files live under `record.digitalObjects[]`, each with `objectUrl` and
// `objectFilename` (there is no `objectType` field), and the correct
// query param for filtering by media type is `typeOfMaterials`, not
// `resultTypes`. Added console logging so a silent fallback is visible
// in your render logs instead of looking identical to a real miss.
//
// Run with:  VIDEO_CONFIG=drop-XX-ah1-cobra.js node engine-ci.js

const NARA_SEARCH = 'https://catalog.archives.gov/api/v2/records/search';

async function resolveNaraClip(query) {
    const url = `${NARA_SEARCH}?q=${encodeURIComponent(query)}` +
                `&typeOfMaterials=Moving%20Images&limit=20`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`[NARA] HTTP ${res.status} for "${query}"`);
            return null;
        }
        const data = await res.json();
        const hits = data?.body?.hits?.hits || [];
        console.log(`[NARA] "${query}" → ${hits.length} hits`);

        for (const hit of hits) {
            // Correct path: digitalObjects lives on the record itself,
            // not under a `record` wrapper key — and there is no
            // `objectType` field, so filter by filename extension.
            const record = hit?._source?.record || hit?._source;
            const objects = record?.digitalObjects || [];
            const videoObj = objects.find(o =>
                (o.objectFilename || '').match(/\.(mp4|mov|mpg|mpeg|avi)$/i)
            );
            if (videoObj?.objectUrl) {
                console.log(`[NARA] using clip: ${videoObj.objectUrl}`);
                return videoObj.objectUrl;
            }
        }
        console.warn(`[NARA] no usable video file among ${hits.length} hits for "${query}"`);
        return null;
    } catch (err) {
        console.warn(`[NARA] lookup failed for "${query}":`, err.message);
        return null;
    }
}

module.exports = (async () => {
    const naraUrl =
        (await resolveNaraClip('AH-1 Cobra attack helicopter')) ||
        (await resolveNaraClip('AH-1 Cobra Vietnam')) ||
        (await resolveNaraClip('Cobra helicopter gunship'));

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
              query: 'AH-1 Cobra attack helicopter',
              source: 'serpapi',
              fit: 'cover',
              kenBurns: 'zoom-in',
              kenBurnsAmount: 0.32,
          };

    return {
        output: {
            title: 'ah1-cobra',
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
                    text: "This is the AH-1 Cobra, the first helicopter ever built from scratch to hunt and kill. Before this, helicopters were just trucks with rotors. This one changed that forever.",
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
                        type: 'stock-image', query: 'AH-1 Cobra attack helicopter',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-in', kenBurnsAmount: 0.34,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                    {
                        type: 'text', text: 'THE FIRST TRUE\nATTACK\nHELICOPTER', x: 540, y: 260,
                        fontSize: 62, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center', hookLayer: true,
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },

            // ── Scene 2 — Creator ───────────────────────────────────
            {
                tts: {
                    text: "Bell Helicopter built the Cobra in nineteen sixty five, rushing it out for Vietnam after commanders realized armed Hueys just weren't fast or lethal enough to escort troops into a hot landing zone.",
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
                        type: 'stock-image', query: 'Bell Helicopter factory 1960s',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'pan-up', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                    {
                        type: 'text', text: 'BELL HELICOPTER\n1965', x: 540, y: 1500,
                        fontSize: 52, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 3 — Design Philosophy (NARA footage) ──────────
            {
                tts: {
                    text: "The Cobra's whole body is built around one idea: be a small target. A narrow two-foot-wide fuselage, pilot and gunner stacked front to back instead of side by side, and stub wings just to carry rockets. Every inch that could get you killed was cut away.",
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
                        type: 'text', text: 'NARROW BODY.\nSTACKED CREW.\nSMALLER TARGET.', x: 540, y: 1560,
                        fontSize: 46, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 4 — CTA (provocative, comment-bait framing) ───
            {
                tts: {
                    text: "So here's the question. Would the Cobra still survive on a modern battlefield with today's air defenses, or is it strictly a museum piece now? Comment your answer.",
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
                        type: 'stock-image', query: 'AH-1 Cobra helicopter modern',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-out', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                    {
                        type: 'text', text: 'STILL DEADLY OR\nMUSEUM PIECE?', x: 540, y: 900,
                        fontSize: 58, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },
        ],
    };
})();
