// config.zulu-warrior-part1.js
// "Before You're Born, Your Name's Already Picked" — Part 1 of the Zulu Warrior series
//
// POV: Second-person "you" narration — the viewer IS the Zulu son.
// Cold open → flash-forward to Bambatha Rebellion 1906, Mome Gorge, Maxim gun sprint.
// Then rewind all the way to birth and walk through childhood → enlistment.
// Hook closes on Part 2 tease.
//
// Voice: am_adam — casual discovery energy, NOT slow documentary
// No bgMusic — per instruction
// Visual mix: stock-image-sequence (with rotate-cw Ken Burns) + native data viz html-record panels
// Post: grain + vignette for that sepia-documentary feel
//
// Run with:  VIDEO_CONFIG=config.zulu-warrior-part1.js node engine-ci.js

module.exports = {
    output: {
        title:  'zulu-warrior-part1-born-with-a-name',
        format: 'portrait',
        fps:    30,
        crf:    22,
        preset: 'fast',
        postProcess: {
            grain: true,        grainStrength: 0.025,
            vignette: true,     vignetteStrength: 0.45,
            colorGrade: '#8B6914', colorGradeStrength: 0.08,   // warm sepia wash
        },
    },

    defaults: { voice: 'am_adam', transition: 'fade', transitionDuration: 0.35, speed: 1.0 },

    scenes: [

        // ══════════════════════════════════════════════════════════════════
        // SCENE 0 — COLD OPEN: the battlefield sprint
        // Visual: stock image sequence — smoke, dust, battlefield chaos
        // Native data viz panel: Maxim gun stat card drops in mid-sentence
        // ══════════════════════════════════════════════════════════════════
        {
            tts: {
                text: "Okay, picture this — you're sprinting. Full sprint, straight at a gun that fires somewhere around five, six hundred bullets a minute. You hear the first one snap past your ear, close enough you swear you felt the heat off it. This is genuinely about to happen to you. But first — rewind. Because to understand why you're doing something this insane, we've gotta go all the way back. Before you were even born.",
                voice: 'am_adam',
                pauseAfter: 0.6,
            },
            transition: 'zoom-cut',
            transitionDuration: 0.2,
            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 58,
                color: '#ffffff',
                highlightColor: '#ff3b5c',
                bgColor: 'rgba(0,0,0,0.65)',
                wordsPerChunk: 3,
            },
            layers: [
                // Full-bleed battlefield atmosphere — sequence of 5 images cutting through the scene
                {
                    type: 'stock-image-sequence',
                    queries: [
                        'african battlefield dust smoke historical',
                        'grassland savanna low angle dramatic sky south africa',
                        'colonial soldiers battle formation historical photograph',
                        'running figure motion blur dramatic silhouette',
                        'zulu war historical reenactment warriors',
                    ],
                    source: 'serpapi',
                    orientation: 'portrait',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',    kenBurnsAmount: 0.36 },
                        { kenBurns: 'rotate-cw',  kenBurnsAmount: 0.28, rotateDeg: 8 },
                        { kenBurns: 'pan-left',   kenBurnsAmount: 0.30 },
                        { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.28, rotateDeg: 8 },
                        { kenBurns: 'zoom-out',   kenBurnsAmount: 0.32 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                // Heavy dark overlay — sells the tension
                { type: 'overlay', color: 'rgba(10,5,0,0.52)' },

                // Red-tinted grain overlay for that archival war-photo feel
                { type: 'overlay', color: 'rgba(80,20,0,0.12)' },

                // HOOK title — appears immediately
                {
                    type: 'text',
                    text: 'YOU ARE SPRINTING',
                    x: 540, y: 280,
                    fontSize: 72,
                    fontFamily: 'Arial Black, sans-serif',
                    color: '#ff3b5c',
                    align: 'center',
                    animation: 'pop',
                    startT: 0.1,
                    animDur: 0.4,
                    hookLayer: true,
                },
                {
                    type: 'text',
                    text: 'JUNE 10, 1906',
                    x: 540, y: 375,
                    fontSize: 34,
                    fontFamily: 'Arial, sans-serif',
                    color: 'rgba(255,255,255,0.65)',
                    align: 'center',
                    animation: 'fade',
                    startT: 0.3,
                    animDur: 0.5,
                },
                {
                    type: 'text',
                    text: 'MOME GORGE · ZULULAND',
                    x: 540, y: 420,
                    fontSize: 28,
                    fontFamily: 'Arial, sans-serif',
                    color: 'rgba(255,180,50,0.80)',
                    align: 'center',
                    animation: 'fade',
                    startT: 0.5,
                    animDur: 0.5,
                    letterSpacing: 2,
                },

                // Maxim gun data card — drops in when "five, six hundred bullets" hits
                // Built as inline html-record so we get the styled stat panel
                {
                    type: 'html-record',
                    duration: 6,
                    fps: 30,
                    viewport: { width: 900, height: 340 },
                    x: 90, y: 700, width: 900, height: 340,
                    startT: 4.2,
                    animation: 'slide-up',
                    html: `
                        <div style="
                            background: rgba(10,5,0,0.88);
                            border: 2px solid #ff3b5c;
                            border-radius: 18px;
                            padding: 32px 40px;
                            font-family: Arial, sans-serif;
                            color: #ffffff;
                            box-shadow: 0 0 40px rgba(255,59,92,0.35), 0 8px 32px rgba(0,0,0,0.8);
                            display: flex;
                            align-items: center;
                            gap: 40px;
                        ">
                            <div style="flex:1;">
                                <div style="
                                    font-size: 13px;
                                    font-weight: 700;
                                    letter-spacing: 3px;
                                    color: #ff3b5c;
                                    text-transform: uppercase;
                                    margin-bottom: 8px;
                                ">MAXIM GUN · 1906</div>
                                <div style="
                                    font-size: 62px;
                                    font-weight: 900;
                                    line-height: 1;
                                    color: #ffffff;
                                    font-family: Arial Black, sans-serif;
                                ">~500–600</div>
                                <div style="
                                    font-size: 22px;
                                    color: rgba(255,255,255,0.65);
                                    margin-top: 6px;
                                ">rounds per minute</div>
                            </div>
                            <div style="
                                width: 2px;
                                height: 100px;
                                background: rgba(255,59,92,0.4);
                                flex-shrink: 0;
                            "></div>
                            <div style="flex:1; text-align:right;">
                                <div style="font-size:13px;font-weight:700;letter-spacing:2px;color:rgba(255,180,50,0.8);text-transform:uppercase;margin-bottom:8px;">YOUR WEAPON</div>
                                <div style="font-size:44px;font-weight:900;font-family:Arial Black,sans-serif;color:#fff;line-height:1;">Assegai</div>
                                <div style="font-size:20px;color:rgba(255,255,255,0.55);margin-top:6px;">stabbing spear + shield</div>
                            </div>
                        </div>
                    `,
                },
            ],
        },


        // ══════════════════════════════════════════════════════════════════
        // SCENE 1 — NAME ALREADY PICKED (birth)
        // Visual: Zulu homestead at dusk stock images + ancestry data viz
        // ══════════════════════════════════════════════════════════════════
        {
            tts: {
                text: "Before you're born, your name's already picked. Nobody's standing around going 'let's see what fits' — your family's decided, and somewhere out there, your ancestors are apparently already watching, waiting on you to show up.",
                voice: 'am_adam',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 58,
                color: '#ffffff',
                highlightColor: '#ffb703',
                bgColor: 'rgba(0,0,0,0.60)',
                wordsPerChunk: 3,
            },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: [
                        'zulu homestead traditional huts south africa dusk',
                        'african village huts golden hour landscape',
                        'south africa rural homestead sunset rolling hills',
                    ],
                    source: 'serpapi',
                    orientation: 'portrait',
                    kenBurnsSequence: [
                        { kenBurns: 'pan-up',     kenBurnsAmount: 0.28 },
                        { kenBurns: 'rotate-cw',  kenBurnsAmount: 0.22, rotateDeg: 6 },
                        { kenBurns: 'zoom-in',    kenBurnsAmount: 0.30 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(5,10,25,0.50)' },

                // Section label — rewind marker
                {
                    type: 'text',
                    text: '⟵  REWIND',
                    x: 540, y: 260,
                    fontSize: 28,
                    fontFamily: 'Arial, sans-serif',
                    color: 'rgba(255,183,3,0.75)',
                    align: 'center',
                    letterSpacing: 4,
                    animation: 'fade',
                    startT: 0.1,
                },
                {
                    type: 'text',
                    text: 'BEFORE YOU\nWERE BORN',
                    x: 540, y: 370,
                    fontSize: 80,
                    fontFamily: 'Arial Black, sans-serif',
                    color: '#ffffff',
                    align: 'center',
                    animation: 'slide-down',
                    startT: 0.2,
                    animDur: 0.5,
                },

                // Ancestor "network" — inline HTML data viz: ancestors are watching
                {
                    type: 'html-record',
                    duration: 8,
                    fps: 30,
                    viewport: { width: 1080, height: 560 },
                    x: 0, y: 900, width: 1080, height: 560,
                    startT: 1.8,
                    animation: 'fade',
                    animDur: 0.8,
                    html: `<!DOCTYPE html>
<html>
<head>
<style>
  html,body{margin:0;padding:0;width:1080px;height:560px;background:rgba(5,10,25,0.0);overflow:hidden;font-family:Arial,sans-serif;}
  #stage{position:relative;width:1080px;height:560px;}
  svg{position:absolute;top:0;left:0;}
  .node{position:absolute;transform:translate(-50%,-50%);}
  .node-circle{
    width:64px;height:64px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:26px;
    box-shadow:0 0 22px rgba(255,183,3,0.5);
  }
  .node-label{
    text-align:center;font-size:18px;font-weight:700;
    color:rgba(255,255,255,0.75);margin-top:6px;white-space:nowrap;
  }
  .you-circle{
    width:88px;height:88px;border-radius:50%;
    background:rgba(255,59,92,0.2);
    border:3px solid #ff3b5c;
    display:flex;align-items:center;justify-content:center;
    font-size:34px;
    box-shadow:0 0 30px rgba(255,59,92,0.6);
    animation:pulse 1.8s ease-in-out infinite;
  }
  @keyframes pulse{0%,100%{box-shadow:0 0 30px rgba(255,59,92,0.5);}50%{box-shadow:0 0 55px rgba(255,59,92,0.85);}}
  .header{
    position:absolute;top:18px;left:0;width:1080px;text-align:center;
    font-size:24px;font-weight:700;letter-spacing:3px;
    color:rgba(255,183,3,0.80);text-transform:uppercase;
  }
</style>
</head>
<body>
<div id="stage">
  <svg width="1080" height="560">
    <!-- lines from ancestors down to YOU -->
    <line x1="200" y1="160" x2="540" y2="400" stroke="rgba(255,183,3,0.30)" stroke-width="2" stroke-dasharray="8 6"/>
    <line x1="400" y1="130" x2="540" y2="400" stroke="rgba(255,183,3,0.30)" stroke-width="2" stroke-dasharray="8 6"/>
    <line x1="620" y1="150" x2="540" y2="400" stroke="rgba(255,183,3,0.30)" stroke-width="2" stroke-dasharray="8 6"/>
    <line x1="860" y1="140" x2="540" y2="400" stroke="rgba(255,183,3,0.30)" stroke-width="2" stroke-dasharray="8 6"/>
    <!-- parent tier -->
    <line x1="290" y1="300" x2="540" y2="400" stroke="rgba(255,183,3,0.20)" stroke-width="2" stroke-dasharray="6 5"/>
    <line x1="780" y1="300" x2="540" y2="400" stroke="rgba(255,183,3,0.20)" stroke-width="2" stroke-dasharray="6 5"/>
  </svg>
  <div class="header">YOUR ANCESTORS ARE ALREADY WATCHING</div>
  <!-- great-grandparent tier -->
  <div class="node" style="left:200px;top:160px;">
    <div class="node-circle" style="background:rgba(255,183,3,0.15);border:2px solid rgba(255,183,3,0.5);">👴</div>
    <div class="node-label">Great-grandfather</div>
  </div>
  <div class="node" style="left:400px;top:130px;">
    <div class="node-circle" style="background:rgba(255,183,3,0.15);border:2px solid rgba(255,183,3,0.5);">👵</div>
    <div class="node-label">Great-grandmother</div>
  </div>
  <div class="node" style="left:620px;top:150px;">
    <div class="node-circle" style="background:rgba(255,183,3,0.15);border:2px solid rgba(255,183,3,0.5);">👴</div>
    <div class="node-label">Ancestor</div>
  </div>
  <div class="node" style="left:860px;top:140px;">
    <div class="node-circle" style="background:rgba(255,183,3,0.15);border:2px solid rgba(255,183,3,0.5);">👵</div>
    <div class="node-label">Ancestor</div>
  </div>
  <!-- parent tier -->
  <div class="node" style="left:290px;top:300px;">
    <div class="node-circle" style="background:rgba(255,183,3,0.22);border:2px solid rgba(255,183,3,0.7);">👨</div>
    <div class="node-label">Father</div>
  </div>
  <div class="node" style="left:780px;top:300px;">
    <div class="node-circle" style="background:rgba(255,183,3,0.22);border:2px solid rgba(255,183,3,0.7);">👩</div>
    <div class="node-label">Mother</div>
  </div>
  <!-- YOU -->
  <div class="node" style="left:540px;top:440px;">
    <div class="you-circle">👶</div>
    <div class="node-label" style="color:#ff3b5c;font-size:22px;font-weight:900;">YOU</div>
  </div>
</div>
</body>
</html>`,
                },
            ],
        },


        // ══════════════════════════════════════════════════════════════════
        // SCENE 2 — IMBELEKO (the goat ceremony)
        // Visual: stock images of goats / ceremony + html ritual card
        // ══════════════════════════════════════════════════════════════════
        {
            tts: {
                text: "When you finally do show up, there's a goat involved. Not a joke. A goat gets slaughtered, an elder says your name out loud for the first time, and just like that, you're officially introduced to the ancestors. Welcome to the family, kid.",
                voice: 'am_adam',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 58,
                color: '#ffffff',
                highlightColor: '#ffb703',
                bgColor: 'rgba(0,0,0,0.60)',
                wordsPerChunk: 3,
            },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: [
                        'african goat herd rural south africa closeup',
                        'african elder ceremony traditional ritual',
                        'zulu traditional ceremony celebration south africa',
                    ],
                    source: 'serpapi',
                    orientation: 'portrait',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',    kenBurnsAmount: 0.32 },
                        { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.25, rotateDeg: 7 },
                        { kenBurns: 'pan-right',  kenBurnsAmount: 0.28 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(20,10,0,0.52)' },

                // Ceremony steps — inline HTML timeline card
                {
                    type: 'html-record',
                    duration: 9,
                    fps: 30,
                    viewport: { width: 960, height: 620 },
                    x: 60, y: 560, width: 960, height: 620,
                    startT: 0.6,
                    animation: 'slide-up',
                    animDur: 0.6,
                    html: `
                        <div style="
                            background:rgba(10,6,0,0.90);
                            border:2px solid rgba(255,183,3,0.5);
                            border-radius:20px;
                            padding:36px 44px 40px;
                            font-family:Arial,sans-serif;
                            color:#ffffff;
                            box-shadow:0 0 50px rgba(255,183,3,0.2),0 12px 40px rgba(0,0,0,0.9);
                        ">
                            <div style="
                                font-size:13px;font-weight:700;letter-spacing:4px;
                                color:rgba(255,183,3,0.85);text-transform:uppercase;
                                margin-bottom:24px;border-bottom:1px solid rgba(255,183,3,0.25);
                                padding-bottom:16px;
                            ">IMBELEKO · NAMING CEREMONY</div>
${[
    ['🐐', 'A goat is slaughtered', "The family's bond with ancestors is activated"],
    ['🔥', 'Fire lit at the homestead', 'Spiritual gateway opens — ancestors are notified'],
    ['🗣️', 'Elder speaks your name', "First time anyone says it aloud — it's real now"],
    ['👶', 'You are introduced', 'You enter the lineage. You exist in two worlds.'],
].map(([icon, title, sub], i) => `
    <div style="display:flex;align-items:flex-start;gap:22px;margin-bottom:${i < 3 ? '22px' : '0'};">
        <div style="
            width:52px;height:52px;border-radius:12px;
            background:rgba(255,183,3,0.15);
            border:1px solid rgba(255,183,3,0.4);
            display:flex;align-items:center;justify-content:center;
            font-size:26px;flex-shrink:0;
        ">${icon}</div>
        <div>
            <div style="font-size:22px;font-weight:800;line-height:1.2;">${title}</div>
            <div style="font-size:17px;color:rgba(255,255,255,0.55);margin-top:4px;">${sub}</div>
        </div>
    </div>
`).join('')}
                        </div>
                    `,
                },
            ],
        },


        // ══════════════════════════════════════════════════════════════════
        // SCENE 3 — UMBILICAL CORD BURIAL
        // Visual: earth/ground closeup images
        // ══════════════════════════════════════════════════════════════════
        {
            tts: {
                text: "Your umbilical cord gets buried right there, in the ground where you were born. For the rest of your life, that exact spot is basically your permanent home address — spiritually speaking.",
                voice: 'am_adam',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 58,
                color: '#ffffff',
                highlightColor: '#ffb703',
                bgColor: 'rgba(0,0,0,0.60)',
                wordsPerChunk: 3,
            },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: [
                        'african red earth soil closeup ground texture',
                        'hands holding earth soil africa',
                        'zulu homestead ground bare earth roots',
                    ],
                    source: 'serpapi',
                    orientation: 'portrait',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',    kenBurnsAmount: 0.38 },
                        { kenBurns: 'rotate-cw',  kenBurnsAmount: 0.25, rotateDeg: 6 },
                        { kenBurns: 'zoom-out',   kenBurnsAmount: 0.30 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(15,8,0,0.55)' },

                {
                    type: 'text',
                    text: 'YOUR PERMANENT\nHOME ADDRESS',
                    x: 540, y: 420,
                    fontSize: 72,
                    fontFamily: 'Arial Black, sans-serif',
                    color: '#ffffff',
                    align: 'center',
                    animation: 'pop',
                    startT: 0.3,
                    animDur: 0.5,
                },
                {
                    type: 'text',
                    text: '— spiritually speaking',
                    x: 540, y: 560,
                    fontSize: 32,
                    fontFamily: 'Arial, sans-serif',
                    color: 'rgba(255,183,3,0.75)',
                    align: 'center',
                    animation: 'fade',
                    startT: 0.7,
                    animDur: 0.5,
                },

                // Pin-drop style visualization
                {
                    type: 'html-record',
                    duration: 7,
                    fps: 30,
                    viewport: { width: 480, height: 480 },
                    x: 300, y: 820, width: 480, height: 480,
                    startT: 1.2,
                    animation: 'fade',
                    animDur: 0.7,
                    html: `
                        <div style="
                            width:480px;height:480px;
                            display:flex;align-items:center;justify-content:center;
                            font-family:Arial,sans-serif;
                        ">
                            <div style="position:relative;text-align:center;">
                                <!-- outer glow ring -->
                                <div style="
                                    width:260px;height:260px;border-radius:50%;
                                    background:rgba(139,69,19,0.12);
                                    border:2px solid rgba(255,183,3,0.25);
                                    position:absolute;
                                    top:50%;left:50%;transform:translate(-50%,-50%);
                                    animation:ripple 2.2s ease-out infinite;
                                "></div>
                                <!-- inner ring -->
                                <div style="
                                    width:160px;height:160px;border-radius:50%;
                                    background:rgba(139,69,19,0.22);
                                    border:2px solid rgba(255,183,3,0.45);
                                    position:absolute;
                                    top:50%;left:50%;transform:translate(-50%,-50%);
                                "></div>
                                <!-- center marker -->
                                <div style="
                                    width:80px;height:80px;border-radius:50%;
                                    background:rgba(255,183,3,0.85);
                                    border:3px solid #fff;
                                    display:flex;align-items:center;justify-content:center;
                                    font-size:36px;
                                    position:relative;z-index:2;
                                    box-shadow:0 0 30px rgba(255,183,3,0.7);
                                    margin:0 auto;
                                ">🌍</div>
                                <div style="
                                    margin-top:16px;font-size:22px;font-weight:800;
                                    color:#ffb703;letter-spacing:2px;
                                    text-transform:uppercase;
                                ">THIS SPOT. FOREVER.</div>
                            </div>
                            <style>
                                @keyframes ripple {
                                    0%{transform:translate(-50%,-50%) scale(1);opacity:0.6;}
                                    100%{transform:translate(-50%,-50%) scale(1.5);opacity:0;}
                                }
                            </style>
                        </div>
                    `,
                },
            ],
        },


        // ══════════════════════════════════════════════════════════════════
        // SCENE 4 — LITTLE DID YOU KNOW (foreshadow + baby on back)
        // ══════════════════════════════════════════════════════════════════
        {
            tts: {
                text: "Little did you know, by the way — you're about to grow up to be a Zulu warrior. But for now, you're just a kid, getting carried around on your mom's back.",
                voice: 'am_adam',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 58,
                color: '#ffffff',
                highlightColor: '#ff3b5c',
                bgColor: 'rgba(0,0,0,0.60)',
                wordsPerChunk: 3,
            },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: [
                        'african mother baby on back traditional wrap south africa',
                        'zulu woman traditional attire baby',
                        'african woman carrying child rural village',
                    ],
                    source: 'serpapi',
                    orientation: 'portrait',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',   kenBurnsAmount: 0.30 },
                        { kenBurns: 'pan-up',    kenBurnsAmount: 0.28 },
                        { kenBurns: 'rotate-cw', kenBurnsAmount: 0.20, rotateDeg: 5 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(5,10,20,0.48)' },

                // Two-destiny comparison card
                {
                    type: 'html-record',
                    duration: 7,
                    fps: 30,
                    viewport: { width: 960, height: 380 },
                    x: 60, y: 660, width: 960, height: 380,
                    startT: 0.8,
                    animation: 'slide-up',
                    animDur: 0.6,
                    html: `
                        <div style="
                            display:flex;gap:24px;
                            font-family:Arial,sans-serif;
                            height:380px;
                        ">
                            <div style="
                                flex:1;background:rgba(5,10,20,0.88);
                                border:2px solid rgba(255,255,255,0.15);
                                border-radius:18px;padding:32px 28px;
                                display:flex;flex-direction:column;justify-content:center;
                                align-items:center;text-align:center;
                            ">
                                <div style="font-size:56px;margin-bottom:12px;">👶</div>
                                <div style="font-size:28px;font-weight:800;color:#fff;line-height:1.2;">RIGHT NOW</div>
                                <div style="font-size:18px;color:rgba(255,255,255,0.55);margin-top:8px;">Absolutely clueless.<br>Getting carried everywhere.</div>
                            </div>
                            <div style="
                                flex:1;background:rgba(30,5,5,0.88);
                                border:2px solid rgba(255,59,92,0.45);
                                border-radius:18px;padding:32px 28px;
                                display:flex;flex-direction:column;justify-content:center;
                                align-items:center;text-align:center;
                                box-shadow:0 0 30px rgba(255,59,92,0.2);
                            ">
                                <div style="font-size:56px;margin-bottom:12px;">⚔️</div>
                                <div style="font-size:28px;font-weight:800;color:#ff3b5c;line-height:1.2;">DESTINY</div>
                                <div style="font-size:18px;color:rgba(255,255,255,0.55);margin-top:8px;">Zulu warrior.<br>One of the last.</div>
                            </div>
                        </div>
                    `,
                },
            ],
        },


        // ══════════════════════════════════════════════════════════════════
        // SCENE 5 — CHILDHOOD JOB: HERDING CATTLE
        // Visual: cattle stock images + cattle bank stat
        // ══════════════════════════════════════════════════════════════════
        {
            tts: {
                text: "By seven, you've got a job: herding cattle. Lose one, and you will hear about it. Cattle are basically the family bank account, and congrats, you're now the security guard.",
                voice: 'am_adam',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 58,
                color: '#ffffff',
                highlightColor: '#ffb703',
                bgColor: 'rgba(0,0,0,0.60)',
                wordsPerChunk: 3,
            },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: [
                        'nguni cattle herd south africa grassland',
                        'young boy herding cattle africa sunset',
                        'african cattle closeup horns nguni',
                        'boy walking cattle rural south africa',
                    ],
                    source: 'serpapi',
                    orientation: 'portrait',
                    kenBurnsSequence: [
                        { kenBurns: 'pan-left',   kenBurnsAmount: 0.30 },
                        { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.24, rotateDeg: 7 },
                        { kenBurns: 'zoom-in',    kenBurnsAmount: 0.34 },
                        { kenBurns: 'pan-right',  kenBurnsAmount: 0.28 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(10,8,0,0.50)' },

                // Age badge
                {
                    type: 'text',
                    text: 'AGE 7',
                    x: 540, y: 280,
                    fontSize: 44,
                    fontFamily: 'Arial Black, sans-serif',
                    color: '#ffb703',
                    align: 'center',
                    animation: 'pop',
                    startT: 0.2,
                    animDur: 0.4,
                },
                {
                    type: 'text',
                    text: 'YOUR FIRST JOB',
                    x: 540, y: 360,
                    fontSize: 64,
                    fontFamily: 'Arial Black, sans-serif',
                    color: '#ffffff',
                    align: 'center',
                    animation: 'slide-down',
                    startT: 0.3,
                    animDur: 0.5,
                },

                // Cattle = bank account visualization
                {
                    type: 'html-record',
                    duration: 7,
                    fps: 30,
                    viewport: { width: 960, height: 340 },
                    x: 60, y: 780, width: 960, height: 340,
                    startT: 1.5,
                    animation: 'slide-up',
                    animDur: 0.6,
                    html: `
                        <div style="
                            background:rgba(10,8,0,0.90);
                            border:2px solid rgba(255,183,3,0.5);
                            border-radius:18px;padding:32px 36px;
                            font-family:Arial,sans-serif;color:#fff;
                            box-shadow:0 0 40px rgba(255,183,3,0.18),0 10px 36px rgba(0,0,0,0.85);
                        ">
                            <div style="font-size:12px;font-weight:700;letter-spacing:4px;color:rgba(255,183,3,0.75);text-transform:uppercase;margin-bottom:20px;">CATTLE = CURRENCY</div>
                            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
                                ${[
                                    ['🐄', 'Bride price', 'Lobola paid in cattle'],
                                    ['⚖️', 'Dispute fines', 'Settled with cattle'],
                                    ['🏠', 'Family status', 'More cattle = higher standing'],
                                ].map(([icon,title,sub])=>`
                                    <div style="text-align:center;">
                                        <div style="font-size:38px;margin-bottom:10px;">${icon}</div>
                                        <div style="font-size:19px;font-weight:800;color:#fff;">${title}</div>
                                        <div style="font-size:15px;color:rgba(255,255,255,0.5);margin-top:4px;">${sub}</div>
                                    </div>
                                `).join('')}
                            </div>
                            <div style="
                                margin-top:22px;padding-top:18px;
                                border-top:1px solid rgba(255,183,3,0.2);
                                font-size:20px;font-weight:700;color:#ffb703;text-align:center;
                            ">You lose one → you answer for it.</div>
                        </div>
                    `,
                },
            ],
        },


        // ══════════════════════════════════════════════════════════════════
        // SCENE 6 — PLAY-FIGHTING (night training)
        // Visual: boys, sticks, warrior stories stock images
        // ══════════════════════════════════════════════════════════════════
        {
            tts: {
                text: "At night, you're play-fighting with sticks against the other boys, pretending to be the warriors you've been hearing stories about your whole short life. You have no idea you're basically already in training.",
                voice: 'am_adam',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 58,
                color: '#ffffff',
                highlightColor: '#ff3b5c',
                bgColor: 'rgba(0,0,0,0.60)',
                wordsPerChunk: 3,
            },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: [
                        'african boys playing sticks rural village night fire',
                        'children playing rural africa dusk silhouette',
                        'zulu stick fighting umshiza traditional sport',
                        'young boys firelight africa evening',
                    ],
                    source: 'serpapi',
                    orientation: 'portrait',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',    kenBurnsAmount: 0.36 },
                        { kenBurns: 'pan-left',   kenBurnsAmount: 0.30 },
                        { kenBurns: 'rotate-cw',  kenBurnsAmount: 0.26, rotateDeg: 8 },
                        { kenBurns: 'zoom-out',   kenBurnsAmount: 0.30 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(15,6,0,0.55)' },

                // "Already in training" realization card
                {
                    type: 'html-record',
                    duration: 8,
                    fps: 30,
                    viewport: { width: 920, height: 400 },
                    x: 80, y: 700, width: 920, height: 400,
                    startT: 2.0,
                    animation: 'fade',
                    animDur: 0.7,
                    html: `
                        <div style="
                            background:rgba(15,6,0,0.90);
                            border-left:5px solid #ff3b5c;
                            border-radius:0 18px 18px 0;
                            padding:36px 40px;
                            font-family:Arial,sans-serif;color:#fff;
                            box-shadow:0 8px 36px rgba(0,0,0,0.85);
                        ">
                            <div style="font-size:13px;font-weight:700;letter-spacing:4px;color:#ff3b5c;text-transform:uppercase;margin-bottom:18px;">WHAT YOU THINK YOU'RE DOING</div>
                            <div style="font-size:34px;font-weight:800;color:rgba(255,255,255,0.55);margin-bottom:24px;">Playing. Having fun. Being a kid.</div>

                            <div style="width:100%;height:2px;background:rgba(255,59,92,0.25);margin:20px 0;"></div>

                            <div style="font-size:13px;font-weight:700;letter-spacing:4px;color:rgba(255,183,3,0.85);text-transform:uppercase;margin-bottom:18px;">WHAT'S ACTUALLY HAPPENING</div>
                            <div style="font-size:34px;font-weight:800;color:#ffb703;">Footwork. Reflex. Distance. Combat instinct.</div>
                            <div style="font-size:20px;color:rgba(255,255,255,0.50);margin-top:10px;">The ibutho system starts earlier than you know.</div>
                        </div>
                    `,
                },
            ],
        },


        // ══════════════════════════════════════════════════════════════════
        // SCENE 7 — TAKEN INTO THE ARMY (ibutho enrollment)
        // Visual: groups/formation images + enlistment data card
        // ══════════════════════════════════════════════════════════════════
        {
            tts: {
                text: "Then one day, you're not a boy anymore. You get taken — enrolled into an ibutho, an age-regiment, shipped off to a military kraal with hundreds of guys exactly your age. Your mom's homestead? Not your home anymore.",
                voice: 'am_adam',
                pauseAfter: 0.5,
            },
            transition: 'glitch',
            transitionDuration: 0.3,
            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 58,
                color: '#ffffff',
                highlightColor: '#ff3b5c',
                bgColor: 'rgba(0,0,0,0.65)',
                wordsPerChunk: 3,
            },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: [
                        'zulu warriors group formation historical',
                        'african men regiment formation marching',
                        'young zulu men warriors traditional dress group',
                        'military kraal enclosure south africa historical',
                    ],
                    source: 'serpapi',
                    orientation: 'portrait',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-out',   kenBurnsAmount: 0.30 },
                        { kenBurns: 'pan-right',  kenBurnsAmount: 0.32 },
                        { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.24, rotateDeg: 6 },
                        { kenBurns: 'zoom-in',    kenBurnsAmount: 0.35 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(0,0,10,0.55)' },

                // ibutho regiment data card
                {
                    type: 'html-record',
                    duration: 9,
                    fps: 30,
                    viewport: { width: 960, height: 600 },
                    x: 60, y: 460, width: 960, height: 600,
                    startT: 0.5,
                    animation: 'slide-up',
                    animDur: 0.6,
                    html: `
                        <div style="
                            background:rgba(0,0,12,0.92);
                            border:2px solid rgba(255,59,92,0.5);
                            border-radius:20px;padding:36px 40px;
                            font-family:Arial,sans-serif;color:#fff;
                            box-shadow:0 0 50px rgba(255,59,92,0.18),0 12px 40px rgba(0,0,0,0.9);
                        ">
                            <div style="display:flex;align-items:center;gap:20px;margin-bottom:28px;padding-bottom:22px;border-bottom:1px solid rgba(255,59,92,0.2);">
                                <div style="font-size:50px;">⚔️</div>
                                <div>
                                    <div style="font-size:32px;font-weight:900;color:#ff3b5c;letter-spacing:1px;">IBUTHO</div>
                                    <div style="font-size:20px;color:rgba(255,255,255,0.55);margin-top:4px;">Zulu Age-Regiment System</div>
                                </div>
                            </div>
                            ${[
                                ['👥', 'Size', 'Hundreds to thousands of same-age men'],
                                ['🏠', 'Base', 'Royal military kraal — not your family homestead'],
                                ['🚫', 'Marriage', 'Forbidden until the king grants permission'],
                                ['🛡️', 'Identity', 'Your regiment IS your new family, your new name'],
                                ['👑', 'Loyalty', 'You answer to the king now. Not your father.'],
                            ].map(([icon,label,val])=>`
                                <div style="display:flex;align-items:center;gap:18px;margin-bottom:14px;">
                                    <div style="font-size:26px;width:44px;text-align:center;flex-shrink:0;">${icon}</div>
                                    <div style="font-size:16px;font-weight:700;color:rgba(255,183,3,0.8);width:130px;flex-shrink:0;text-transform:uppercase;letter-spacing:1px;">${label}</div>
                                    <div style="font-size:19px;color:rgba(255,255,255,0.75);">${val}</div>
                                </div>
                            `).join('')}
                        </div>
                    `,
                },
            ],
        },


        // ══════════════════════════════════════════════════════════════════
        // SCENE 8 — TRAINING (shield + spear)
        // Visual: shield and spear / warrior training images
        // ══════════════════════════════════════════════════════════════════
        {
            tts: {
                text: "They hand you a shield and a short stabbing spear, and that's it — that's your whole kit. You drill, you train, you learn to move as one single unit with guys who are now basically your brothers.",
                voice: 'am_adam',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 58,
                color: '#ffffff',
                highlightColor: '#ffb703',
                bgColor: 'rgba(0,0,0,0.60)',
                wordsPerChunk: 3,
            },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: [
                        'zulu warrior shield iklwa spear traditional',
                        'cowhide shield assegai spear closeup zululand',
                        'zulu warriors drilling marching formation regiment',
                        'traditional zulu warrior full regalia museum display',
                    ],
                    source: 'serpapi',
                    orientation: 'portrait',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',    kenBurnsAmount: 0.38 },
                        { kenBurns: 'rotate-cw',  kenBurnsAmount: 0.28, rotateDeg: 8 },
                        { kenBurns: 'pan-up',     kenBurnsAmount: 0.30 },
                        { kenBurns: 'zoom-out',   kenBurnsAmount: 0.32 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                { type: 'overlay', color: 'rgba(5,5,15,0.50)' },

                // Gear loadout card
                {
                    type: 'html-record',
                    duration: 8,
                    fps: 30,
                    viewport: { width: 960, height: 420 },
                    x: 60, y: 640, width: 960, height: 420,
                    startT: 1.0,
                    animation: 'slide-up',
                    animDur: 0.6,
                    html: `
                        <div style="
                            background:rgba(5,5,15,0.90);
                            border:2px solid rgba(255,183,3,0.45);
                            border-radius:18px;padding:32px 36px;
                            font-family:Arial,sans-serif;color:#fff;
                            box-shadow:0 0 40px rgba(255,183,3,0.15),0 10px 36px rgba(0,0,0,0.85);
                        ">
                            <div style="font-size:12px;font-weight:700;letter-spacing:4px;color:rgba(255,183,3,0.75);text-transform:uppercase;margin-bottom:22px;">YOUR COMPLETE LOADOUT</div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:22px;">
                                <div style="background:rgba(255,183,3,0.08);border:1px solid rgba(255,183,3,0.3);border-radius:14px;padding:24px;text-align:center;">
                                    <div style="font-size:48px;margin-bottom:10px;">🛡️</div>
                                    <div style="font-size:22px;font-weight:800;">Ishlangu</div>
                                    <div style="font-size:16px;color:rgba(255,255,255,0.50);margin-top:4px;">Cowhide war shield<br>Body length. Takes bullets? No.</div>
                                </div>
                                <div style="background:rgba(255,183,3,0.08);border:1px solid rgba(255,183,3,0.3);border-radius:14px;padding:24px;text-align:center;">
                                    <div style="font-size:48px;margin-bottom:10px;">🗡️</div>
                                    <div style="font-size:22px;font-weight:800;">Iklwa</div>
                                    <div style="font-size:16px;color:rgba(255,255,255,0.50);margin-top:4px;">Short stabbing spear<br>Close quarters. Terrifyingly effective.</div>
                                </div>
                            </div>
                            <div style="font-size:13px;font-weight:700;letter-spacing:3px;color:#ff3b5c;text-transform:uppercase;text-align:center;">That's it. That's everything you get.</div>
                        </div>
                    `,
                },
            ],
        },


        // ══════════════════════════════════════════════════════════════════
        // SCENE 9 — CLOSING / HOOK TO PART 2
        // Visual: battlefield silhouette fade + Maxim gun stat callback
        // ══════════════════════════════════════════════════════════════════
        {
            tts: {
                text: "So that's basically who you are by the time we get back to that gun. A kid who became a warrior, trained his whole life for exactly this moment — except nothing in that training prepared you for a weapon that doesn't need to reload for a full minute straight. That part's coming in Part Two.",
                voice: 'am_adam',
                pauseAfter: 0.7,
            },
            transition: 'fade',
            captions: {
                style: 'highlight',
                position: 'bottom',
                fontSize: 58,
                color: '#ffffff',
                highlightColor: '#ff3b5c',
                bgColor: 'rgba(0,0,0,0.65)',
                wordsPerChunk: 3,
            },
            layers: [
                {
                    type: 'stock-image-sequence',
                    queries: [
                        'silhouette warriors sunset dramatic backlit africa',
                        'zululand landscape sunset dramatic sky clouds',
                        'battlefield silhouette soldier dusk historical moody',
                    ],
                    source: 'serpapi',
                    orientation: 'portrait',
                    kenBurnsSequence: [
                        { kenBurns: 'zoom-in',    kenBurnsAmount: 0.26 },
                        { kenBurns: 'rotate-ccw', kenBurnsAmount: 0.20, rotateDeg: 5 },
                        { kenBurns: 'pan-up',     kenBurnsAmount: 0.25 },
                    ],
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
                // Heavier fade-to-dark for the close
                { type: 'overlay', color: 'rgba(0,0,0,0.62)' },

                // "Part Two" tease card
                {
                    type: 'html-record',
                    duration: 10,
                    fps: 30,
                    viewport: { width: 960, height: 520 },
                    x: 60, y: 540, width: 960, height: 520,
                    startT: 3.5,
                    animation: 'fade',
                    animDur: 0.9,
                    html: `
                        <div style="
                            background:rgba(0,0,0,0.88);
                            border:2px solid rgba(255,59,92,0.6);
                            border-radius:22px;padding:40px 44px;
                            font-family:Arial,sans-serif;color:#fff;
                            box-shadow:0 0 60px rgba(255,59,92,0.25),0 16px 48px rgba(0,0,0,0.95);
                        ">
                            <div style="font-size:14px;font-weight:700;letter-spacing:4px;color:rgba(255,59,92,0.85);text-transform:uppercase;margin-bottom:16px;">COMING IN PART TWO</div>
                            <div style="font-size:36px;font-weight:900;line-height:1.25;margin-bottom:22px;">
                                What no amount of spear training prepares you for...
                            </div>
                            <div style="display:flex;gap:20px;align-items:center;
                                border-top:1px solid rgba(255,59,92,0.2);padding-top:22px;">
                                <div>
                                    <div style="font-size:13px;color:rgba(255,183,3,0.75);font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">MAXIM MACHINE GUN · 1906</div>
                                    <div style="font-size:54px;font-weight:900;font-family:Arial Black,sans-serif;color:#ff3b5c;line-height:1;">500–600</div>
                                    <div style="font-size:20px;color:rgba(255,255,255,0.55);">rounds / minute · no reload needed</div>
                                </div>
                                <div style="font-size:72px;opacity:0.7;">💥</div>
                            </div>
                        </div>
                    `,
                },
            ],
        },

    ], // end scenes
};