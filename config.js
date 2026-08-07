// drop-XX-kf21-boramae.js  — rename XX to your next sequential drop number
// "The KF-21 Boramae" — same locked 4-scene formula as the F-22 drop:
// Hook → Creator → Design Philosophy → CTA. bm_george voice, SerpAPI
// stills w/ Ken Burns 0.30-0.36, no bg music, highlight captions
// (#f5c518, 60px, 3 words/chunk).
//
// NOTE on Scene 3's NARA fetch: NARA is the US National Archives — it
// catalogs US government material, with real archival lag even for that.
// For a South Korean jet that first flew in 2022, this will almost
// certainly return null and fall straight to the SerpAPI still every
// time. That's fine — the fallback works exactly like the F-22 file —
// just don't expect real NARA footage to actually surface here; it
// won't, and likely wouldn't for most modern jets regardless of origin.
//
// Run with:  VIDEO_CONFIG=drop-XX-kf21-boramae.js node engine-ci.js

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
    // Try a couple of query variants — expect both to miss for this jet
    // (see note above), which is fine; the fallback below covers it.
    const naraUrl =
        (await resolveNaraClip('KF-21 Boramae fighter jet')) ||
        (await resolveNaraClip('South Korea Air Force fighter jet'));

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
              query: 'KF-21 Boramae fighter jet',
              source: 'serpapi',
              fit: 'cover',
              kenBurns: 'zoom-in',
              kenBurnsAmount: 0.32,
          };

    return {
        output: {
            title: 'kf21-boramae',
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
                    text: "This is the KF-21 Boramae, and it just made South Korea one of the only countries on Earth that can design and build its own supersonic fighter jet from scratch. Here's why almost nobody's talking about it.",
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
                        type: 'stock-image', query: 'KF-21 Boramae fighter jet',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-in', kenBurnsAmount: 0.34,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                    {
                        type: 'text', text: 'THE FIGHTER JET\nALMOST NOBODY\nIS TALKING ABOUT', x: 540, y: 260,
                        fontSize: 62, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center', hookLayer: true,
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },

            // ── Scene 2 — Creator ───────────────────────────────────
            {
                tts: {
                    text: "Korea Aerospace Industries built it, with Indonesia as a development partner, first flying in twenty twenty-two. The goal was simple: stop depending on other countries for fighter jets, and join the small handful of nations that can design a supersonic fighter of their own.",
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
                        type: 'stock-image', query: 'Korea Aerospace Industries factory',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'pan-up', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                    {
                        type: 'text', text: 'KOREA AEROSPACE\nINDUSTRIES', x: 540, y: 1500,
                        fontSize: 52, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 3 — Design Philosophy (NARA footage, expect fallback) ──
            {
                tts: {
                    text: "It's built as a bridge, not a full leap. A domestically-built radar, twin engines shared with jets like the Super Hornet, and a semi-stealth shape today, with an internal weapons bay planned for later upgrades. It's not trying to be the F-35 yet. It's trying to make sure Korea never needs to ask permission for one again.",
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
                        type: 'text', text: 'NOT STEALTH YET.\nBUT NOT\nDEPENDENT EITHER.', x: 540, y: 1560,
                        fontSize: 46, fontFamily: 'Arial Black, sans-serif',
                        color: '#f5c518', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 4,
                    },
                ],
            },

            // ── Scene 4 — CTA (provocative, comment-bait framing) ───
            {
                tts: {
                    text: "So here's the question. Is a semi-stealth jet built by a country that finally stopped depending on anyone else more impressive than a full-stealth jet that's imported? Comment your take below.",
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
                        type: 'stock-image', query: 'KF-21 Boramae vs F-35',
                        source: 'serpapi', fit: 'cover',
                        kenBurns: 'zoom-out', kenBurnsAmount: 0.3,
                    },
                    { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
                    {
                        type: 'text', text: 'INDEPENDENCE OR\nSTEALTH? COMMENT\nYOUR PICK', x: 540, y: 900,
                        fontSize: 54, fontFamily: 'Arial Black, sans-serif',
                        color: '#ffffff', align: 'center',
                        stroke: true, strokeColor: '#000', strokeWidth: 5,
                    },
                ],
            },
        ],
    };
})();