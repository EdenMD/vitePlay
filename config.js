/**
 * config.test-video.js — Video layer QA config
 *
 * Usage: VIDEO_CONFIG=config.test-video.js node engine-ci.js
 * Or in workflow inputs: config = config.test-video.js
 *
 * Sources used (both are long-standing, widely-used public test assets —
 * not niche/likely-to-vanish links):
 *   - Google's official public test video bucket (Big Buck Bunny, CC-BY
 *     3.0, Blender Foundation) — used in Google's own Shaka Player/Chromecast
 *     sample docs, still live as of writing.
 *   - archive.org — the direct test URL Internet Archive's own Help Center
 *     gives for confirming an mp4 streams/downloads correctly
 *     (https://help.archive.org/help/movies-and-videos-a-basic-guide/).
 *     Same URL pattern (archive.org/download/<item>/<file>.mp4) NARA/DVIDS-
 *     style archive links use, so this also sanity-checks that shape.
 *
 * What each scene is checking:
 *   1. url + SHORT scene   — maxDuration should auto-resolve to ~2-3s, not 6s
 *   2. url + LONGER scene  — maxDuration should auto-resolve to the longer
 *                            narration length, more frames, no premature loop
 *   3. path                — local file, zero download, confirms that branch
 *   4. explicit maxDuration + loop — deliberately shorter than the scene, so
 *                            you should SEE it visibly loop/repeat
 *   5. broken url          — confirms graceful degradation to dark background,
 *                            no crash, warning logged
 *
 * After running, check the console for [VideoSource] log lines — each scene
 * logs the extracted frame count, fps, and the maxDuration it actually used.
 * Compare that number against the scene's actual TTS audio length to confirm
 * it matches (that's the whole point of this test — see the durations
 * conversation before this config existed).
 *
 * For scene 3 (path), download a test file locally first:
 *   mkdir -p assets/test && curl -L -o assets/test/sample.mp4 \
 *     https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4
 */

module.exports = {
    output: {
        title:  'Video Layer QA',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',
    },
    defaults: {
        voice:      'af_heart',
        emotion:    'neutral',
        transition: 'fade',
    },
    scenes: [

        // ── 1. url source, SHORT scene ─────────────────────────────────────
        // Expect: [VideoSource] logs maxDuration close to this scene's TTS
        // length (a few seconds), not the old flat default.
        {
            tts: {
                text:    'Testing a short scene.',
                voice:   'af_heart',
                emotion: 'neutral',
            },
            layers: [
                {
                    type:  'video',
                    url:   'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                { type: 'text', text: 'TEST 1 — url, short scene', x: 540, y: 1700, fontSize: 50, align: 'center', maxWidth: 960 },
            ],
        },

        // ── 2. url source, LONGER scene ─────────────────────────────────────
        // Expect: noticeably more frames extracted than scene 1, matching this
        // longer narration's actual length.
        {
            tts: {
                text:    'This scene has a much longer narration line, specifically so the engine has to extract more seconds of source video than it did for the previous, much shorter scene.',
                voice:   'af_heart',
                emotion: 'neutral',
            },
            layers: [
                {
                    type:  'video',
                    url:   'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                { type: 'text', text: 'TEST 2 — url, long scene', x: 540, y: 1700, fontSize: 50, align: 'center', maxWidth: 960 },
            ],
        },

        // ── 3. path source (local file, no download) ─────────────────────────
        // Requires the curl step in the header comment above. Confirms the
        // path branch entirely skips downloadFile().
        {
            tts: {
                text:    'This clip is loaded from a local file path, not a URL.',
                voice:   'af_heart',
                emotion: 'neutral',
            },
            layers: [
                {
                    type:  'video',
                    path:  './assets/test/sample.mp4',
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                { type: 'text', text: 'TEST 3 — local path', x: 540, y: 1700, fontSize: 50, align: 'center', maxWidth: 960 },
            ],
        },

        // ── 4. explicit maxDuration override, forced visible loop ───────────
        // maxDuration is deliberately much shorter than this scene's narration,
        // so you should SEE the clip repeat mid-scene.
        {
            tts: {
                text:    'This clip is deliberately trimmed short and set to loop, so you should see it repeat while this longer narration line keeps playing.',
                voice:   'af_heart',
                emotion: 'neutral',
            },
            layers: [
                {
                    type:        'video',
                    url:         'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
                    maxDuration: 2,        // explicit override — should win over the scene's real duration
                    loop:        true,
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                { type: 'text', text: 'TEST 4 — forced 2s loop', x: 540, y: 1700, fontSize: 50, align: 'center', maxWidth: 960 },
            ],
        },

        // ── 5. archive.org source ──────────────────────────────────────────
        // Same URL pattern NARA/DVIDS results resolve to — validates the
        // "any archive, any host" claim, not just Google's bucket.
        {
            tts: {
                text:    'This clip comes directly from the Internet Archive, the same way a NARA or DVIDS result would.',
                voice:   'af_heart',
                emotion: 'neutral',
            },
            layers: [
                {
                    type:  'video',
                    url:   'https://archive.org/download/ArcherProductionsInc/DuckandC1951.mp4',
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
                { type: 'text', text: 'TEST 5 — archive.org', x: 540, y: 1700, fontSize: 50, align: 'center', maxWidth: 960 },
            ],
        },

        // ── 6. broken url — degradation path ─────────────────────────────────
        // Expect: [VideoSource] warns "Download failed", layer becomes a plain
        // #111111 background, render completes with no crash.
        {
            tts: {
                text:    'This scene intentionally uses a broken video link, to confirm the engine falls back safely.',
                voice:   'af_heart',
                emotion: 'neutral',
            },
            layers: [
                {
                    type: 'video',
                    url:  'https://example.invalid/does-not-exist.mp4',
                    x: 0, y: 0, width: 1080, height: 1920,
                    fit: 'cover',
                },
                { type: 'text', text: 'TEST 6 — broken url (should degrade, not crash)', x: 540, y: 960, fontSize: 46, align: 'center', maxWidth: 900 },
            ],
        },

    ],
};