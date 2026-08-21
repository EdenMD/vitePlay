// config.what-do-you-owe-mercy.js
// "What do you owe an enemy who shows you mercy?" — poetic reflective
// short, same grandfather-narrator register as does-a-soldier-feel-guilt.
//
// GROUNDING STORY (real, well-documented — "A Higher Call" by Adam
// Makos): Dec 20, 1943. Luftwaffe pilot Franz Stigler found 2nd Lt.
// Charlie Brown's severely damaged, defenseless B-17 after a raid over
// Bremen. Regulations called for him to shoot it down. Instead he
// escorted it out of German airspace/flak range toward the North Sea
// and saluted before breaking off. Brown spent years searching for the
// pilot who spared him; they finally reconnected in 1990 and became
// close friends until they died within months of each other in 2008.
//
// VOICE: am_santa, per direct request this time (does-a-soldier-feel-
// guilt used am_eric instead) — "jolly, booming" per Voices.md, which
// is an odd tonal fit for reflective content, but that's the explicit
// ask, so it's used as-is rather than substituted.
//
// VISUALS: exactly ONE ai-image layer (scene 4), Pollinations flux-anime,
// face-only/generic/no-hands per instruction — avoids both the "hands"
// problem AI image generation commonly has AND depicting a specific
// real named person (Pollinations can't reliably render a real face
// anyway, and this isn't meant to claim to BE Charlie Brown or Stigler,
// just an anonymous reflective face). Every other scene is a real
// `stock-image` (serpapi) with rotate-cw/rotate-ccw Ken Burns,
// alternating direction scene to scene.
//
// Run with:  VIDEO_CONFIG=config.what-do-you-owe-mercy.js node engine-ci.js

module.exports = {
    output: {
        title:  'what-do-you-owe-mercy',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'medium',
        bgMusicVol: 0.08,
        bgMusic: { mood: 'calm' },
        postProcess: { grain: true, grainStrength: 0.025, vignette: true, vignetteStrength: 0.42 },
    },

    defaults: { voice: 'am_santa', transition: 'fade', transitionDuration: 0.7 },

    scenes: [

        // ── SCENE 1 — the question ───────────────────────────────────────
        {
            tts: { text: "Come here again, child. I have another question that once kept me awake at night — what do you owe the enemy who had you dead to rights... and chose mercy instead?", pauseAfter: 0.6 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 52, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'stock-image', query: 'fighter pilot cockpit WWII', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'rotate-cw', kenBurnsAmount: 0.28, rotateDeg: 8, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
            ],
        },

        // ── SCENE 2 — it happens more than history admits ───────────────
        {
            tts: { text: "It happens more in war than the history books ever admit. A soldier, finger on the trigger, looks at another human being through his sights — and simply... doesn't.", pauseAfter: 0.5 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 52, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'stock-image', query: 'WWII bomber plane sky', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'rotate-ccw', kenBurnsAmount: 0.28, rotateDeg: 8, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
            ],
        },

        // ── SCENE 3 — the real story begins ──────────────────────────────
        {
            tts: { text: "In December of 1943, a German fighter pilot named Franz Stigler found a crippled American bomber in his sights — barely limping home, half its crew wounded or dead. Regulations said shoot it down. Stigler flew alongside it instead, and escorted it safely toward the sea.", pauseAfter: 0.5 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'stock-image', query: 'damaged aircraft flying formation', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'rotate-cw', kenBurnsAmount: 0.3, rotateDeg: 9, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.5)' },
            ],
        },

        // ── SCENE 4 — the ONE ai-image, generic reflective face ──────────
        {
            tts: { text: "Somewhere inside that battered plane sat a young pilot named Charlie Brown, staring back at a man he expected to end his life — wondering, in that strange silent moment, what he now owed a stranger who had chosen not to.", pauseAfter: 0.6 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                {
                    type: 'ai-image',
                    prompt: 'young 1940s pilot face portrait, contemplative expression, leather flight cap, looking upward through window light, generic and anonymous, upper body and face only, hands not visible, soft cinematic lighting',
                    model: 'flux-anime', animeStyle: 'anime-portrait',
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
            ],
        },

        // ── SCENE 5 — the reunion, decades later ─────────────────────────
        {
            tts: { text: "Decades passed before Charlie ever found the man who spared him. When he finally did, in 1990, two old soldiers who had once stared at each other through gunsights became something history rarely allows enemies to become: friends, until the day they both passed.", pauseAfter: 0.6 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'stock-image', query: 'elderly veterans reunion embrace', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'rotate-ccw', kenBurnsAmount: 0.28, rotateDeg: 8, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
            ],
        },

        // ── SCENE 6 — the answer ─────────────────────────────────────────
        {
            tts: { text: "So, what do you owe a man like that? Not vengeance repaid. Not silence. You owe him the truth that mercy changes the one who receives it forever — and maybe, someday, the courage to offer that same mercy to someone else.", pauseAfter: 0.7 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 50, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'stock-image', query: 'sunset silhouette soldier reflection', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'rotate-cw', kenBurnsAmount: 0.3, rotateDeg: 9, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
            ],
        },

        // ── SCENE 7 — closing, gentle CTA ────────────────────────────────
        {
            tts: { text: "That's the debt this old heart still carries, child. If a story like this ever reaches you, don't let it end with you. Pass the mercy on. Subscribe if you want to hear the ones the history books forget.", pauseAfter: 0.4 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 52, color: '#f2e9d8', highlightColor: '#e3a83c', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,0.9)', strokeWidth: 4 },
            layers: [
                { type: 'stock-image', query: 'sunrise peaceful field', source: 'serpapi', orientation: 'portrait', fit: 'cover', kenBurns: 'rotate-ccw', kenBurnsAmount: 0.28, rotateDeg: 8, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
            ],
        },

    ],
};