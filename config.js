// ============================================================
//  APEX VIDEO ENGINE — "BEFORE YOU'RE BORN, YOUR NAME'S PICKED"
//  Part 1 of Zulu warrior series | Cold open -> Mome Gorge tease
//  Voice: am_adam | speed 1.0 | 10 scenes | stock-image-sequence
//  throughout, 3 images/scene, mixed Ken Burns + rotate accents
// ============================================================
const config = {
    output: {
        title:      'zulu-warrior-part1-before-youre-born',
        format:     'portrait',
        fps:        30,
        crf:        23,
        preset:     'medium',
        cleanup:    true,
        postProcess: {
            grain:            true,
            grainStrength:    0.024,
            vignette:         true,
            vignetteStrength: 0.48,
        },
    },
    defaults: {
        voice:              'am_adam',
        speed:              1.0,
        transition:         'fade',
        transitionDuration: 0.3,
    },
    scenes: [

        // ── BEAT 0 — COLD OPEN: THE CHARGE ───────────────────────
        {
            tts: {
                text: "Okay, picture this — you're sprinting. Full sprint, straight at a gun that fires somewhere around five, six hundred bullets a minute. You hear the first one snap past your ear, close enough you swear you felt the heat off it. This is genuinely about to happen to you. But first — rewind. Because to understand why you're doing something this insane, we've gotta go all the way back. Before you were even born.",
                voice: 'am_adam', speed: 1.0, emotion: 'dramatic', pauseAfter: 0.4,
            },
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: ['Zulu warrior running spear shield', 'Maxim gun firing colonial era', 'battlefield dust chaos historical'],
                    source: 'serpapi', fit: 'cover',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',   kenBurnsAmount: 0.32 },
                        { kenBurns: 'rotate-cw', kenBurnsAmount: 0.26, rotateDeg: 9 },
                        { kenBurns: 'drift',     kenBurnsAmount: 0.28 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                {
                    type: 'text', text: 'BEFORE YOU WERE\nEVEN BORN.',
                    x: 540, y: 1550, fontSize: 56, fontFamily: 'Impact, Arial Black, sans-serif',
                    color: '#ffffff', align: 'center', maxWidth: 900, lineHeight: 1.2,
                    gradient: ['#f5c518', '#ff8c00'], stroke: true, strokeColor: '#000000', strokeWidth: 5,
                    glow: true, glowColor: '#f5c518', glowBlur: 22, animation: 'slide-up', animDur: 0.3, startT: 3.5,
                },
            ],
        },

        // ── BEAT 1 — NAME ALREADY PICKED ──────────────────────────
        {
            tts: {
                text: "Before you're born, your name's already picked. Nobody's standing around going 'let's see what fits' — your family's decided, and somewhere out there, your ancestors are apparently already watching, waiting on you to show up.",
                voice: 'am_adam', speed: 1.0, emotion: 'neutral', pauseAfter: 0.3,
            },
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: ['African homestead dusk traditional', 'Zulu family elders gathered', 'African night sky stars rural'],
                    source: 'serpapi', fit: 'cover',
                    kenBurnsSequence: [
                        { kenBurns: 'pan-left',   kenBurnsAmount: 0.26 },
                        { kenBurns: 'zoom-in',    kenBurnsAmount: 0.28 },
                        { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.24, rotateDeg: 8 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
            ],
        },

        // ── BEAT 2 — IMBELEKO CEREMONY ─────────────────────────────
        {
            tts: {
                text: "When you finally do show up, there's a goat involved. Not a joke. A goat gets slaughtered, an elder says your name out loud for the first time, and just like that, you're officially introduced to the ancestors. Welcome to the family, kid.",
                voice: 'am_adam', speed: 1.0, emotion: 'neutral', pauseAfter: 0.3,
            },
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: ['African traditional ceremony fire', 'Zulu elder ritual ceremony', 'African ceremonial gathering village'],
                    source: 'serpapi', fit: 'cover',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',   kenBurnsAmount: 0.3 },
                        { kenBurns: 'rotate-cw', kenBurnsAmount: 0.25, rotateDeg: 7 },
                        { kenBurns: 'pan-right', kenBurnsAmount: 0.26 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
            ],
        },

        // ── BEAT 3 — UMBILICAL CORD BURIED ────────────────────────
        {
            tts: {
                text: "Your umbilical cord gets buried right there, in the ground where you were born. For the rest of your life, that exact spot is basically your permanent home address — spiritually speaking.",
                voice: 'am_adam', speed: 1.0, emotion: 'neutral', pauseAfter: 0.3,
            },
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: ['hands burying earth soil ritual', 'African earth ground closeup red soil', 'traditional homestead entrance hut'],
                    source: 'serpapi', fit: 'cover',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',  kenBurnsAmount: 0.3 },
                        { kenBurns: 'drift',    kenBurnsAmount: 0.26 },
                        { kenBurns: 'pan-up',   kenBurnsAmount: 0.24 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
            ],
        },

        // ── BEAT 4 — CARRIED ON MOTHER'S BACK ─────────────────────
        {
            tts: {
                text: "Little did you know, by the way — you're about to grow up to be a Zulu warrior. But for now, you're just a kid, getting carried around on your mom's back.",
                voice: 'am_adam', speed: 1.0, emotion: 'neutral', pauseAfter: 0.3,
            },
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: ['African mother carrying baby back cloth', 'Zulu woman traditional dress child', 'African village daily life mother'],
                    source: 'serpapi', fit: 'cover',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',    kenBurnsAmount: 0.28 },
                        { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.22, rotateDeg: 6 },
                        { kenBurns: 'pan-left',   kenBurnsAmount: 0.26 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
            ],
        },

        // ── BEAT 5 — HERDING CATTLE AT SEVEN ──────────────────────
        {
            tts: {
                text: "By seven, you've got a job: herding cattle. Lose one, and you will hear about it. Cattle are basically the family bank account, and congrats, you're now the security guard.",
                voice: 'am_adam', speed: 1.0, emotion: 'neutral', pauseAfter: 0.3,
            },
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: ['African boy herding cattle rural', 'Zulu cattle herd traditional', 'African countryside cattle grazing'],
                    source: 'serpapi', fit: 'cover',
                    kenBurnsSequence: [
                        { kenBurns: 'pan-right', kenBurnsAmount: 0.28 },
                        { kenBurns: 'zoom-in',   kenBurnsAmount: 0.3 },
                        { kenBurns: 'rotate-cw', kenBurnsAmount: 0.22, rotateDeg: 6 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
            ],
        },

        // ── BEAT 6 — PLAY-FIGHTING WITH STICKS ────────────────────
        {
            tts: {
                text: "At night, you're play-fighting with sticks against the other boys, pretending to be the warriors you've been hearing stories about your whole short life. You have no idea you're basically already in training.",
                voice: 'am_adam', speed: 1.0, emotion: 'neutral', pauseAfter: 0.3,
            },
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: ['African boys stick fighting traditional', 'Zulu children playing dusk village', 'African boys playing outdoors evening'],
                    source: 'serpapi', fit: 'cover',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',   kenBurnsAmount: 0.3 },
                        { kenBurns: 'rotate-cw', kenBurnsAmount: 0.26, rotateDeg: 8 },
                        { kenBurns: 'drift',     kenBurnsAmount: 0.26 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
            ],
        },

        // ── BEAT 7 — TAKEN INTO THE ARMY ──────────────────────────
        {
            tts: {
                text: "Then one day, you're not a boy anymore. You get taken — enrolled into an ibutho, an age-regiment, shipped off to a military kraal with hundreds of guys exactly your age. Your mom's homestead? Not your home anymore.",
                voice: 'am_adam', speed: 1.0, emotion: 'dramatic', pauseAfter: 0.35,
            },
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: ['Zulu warriors gathered regiment historical', 'African military kraal historical photograph', 'Zulu age regiment historical gathering'],
                    source: 'serpapi', fit: 'cover',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',    kenBurnsAmount: 0.3 },
                        { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.26, rotateDeg: 8 },
                        { kenBurns: 'pan-left',   kenBurnsAmount: 0.26 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.42)' },
                {
                    type: 'text', text: 'NOT A BOY\nANYMORE.',
                    x: 540, y: 1550, fontSize: 54, fontFamily: 'Impact, Arial Black, sans-serif',
                    color: '#ffffff', align: 'center', maxWidth: 880, lineHeight: 1.2,
                    stroke: true, strokeColor: '#000000', strokeWidth: 5,
                    animation: 'slide-up', animDur: 0.3, startT: 2.2,
                },
            ],
        },

        // ── BEAT 8 — TRAINING: SHIELD AND SPEAR ───────────────────
        {
            tts: {
                text: "They hand you a shield and a short stabbing spear, and that's it — that's your whole kit. You drill, you train, you learn to move as one single unit with guys who are now basically your brothers.",
                voice: 'am_adam', speed: 1.0, emotion: 'neutral', pauseAfter: 0.3,
            },
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: ['Zulu shield spear traditional weapon', 'assegai spear shield closeup', 'Zulu warriors drilling formation historical'],
                    source: 'serpapi', fit: 'cover',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',   kenBurnsAmount: 0.3 },
                        { kenBurns: 'rotate-cw', kenBurnsAmount: 0.24, rotateDeg: 7 },
                        { kenBurns: 'pan-right', kenBurnsAmount: 0.26 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.35)' },
            ],
        },

        // ── BEAT 9 — CLOSE / HOOK TO PART 2 ───────────────────────
        {
            tts: {
                text: "So that's basically who you are by the time we get back to that gun. A kid who became a warrior, trained his whole life for exactly this moment — except nothing in that training prepared you for a weapon that doesn't need to reload for a full minute straight. That part's coming in Part Two.",
                voice: 'am_adam', speed: 1.0, emotion: 'dramatic', pauseAfter: 0.5,
            },
            captions: { style: 'highlight', position: 'bottom', fontSize: 54, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 4, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 6 },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: ['Zulu warrior silhouette sunset', 'African battlefield dusk historical', 'Zulu warrior portrait traditional historical'],
                    source: 'serpapi', fit: 'cover',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-out',  kenBurnsAmount: 0.26 },
                        { kenBurns: 'rotate-cw', kenBurnsAmount: 0.22, rotateDeg: 6 },
                        { kenBurns: 'drift',     kenBurnsAmount: 0.26 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920,
                },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
                {
                    type:        'notification-card',
                    x: 540, y: 1600, width: 880,
                    title: '⚔️ Part 2 coming',
                    body:  'What happens at Mome Gorge',
                    bgColor: 'rgba(245,197,24,0.14)', borderColor: '#f5c518',
                    titleColor: '#f5c518', bodyColor: '#ffffff',
                    fontSize: 34, bodySize: 27, borderRadius: 18,
                    animation: 'slide-up', animDur: 0.35, startT: 3.8,
                },
            ],
        },
    ],
};

module.exports = config;