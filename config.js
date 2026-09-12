// config.highest-paying-careers-zimbabwe-native.js — native-layer version (no HTML casing)
// "Highest-Paying Careers in Zimbabwe" — pexels-video + pexels-image (rotate Ken Burns) + native chart/stat-counter data layers.
// Voice: bf_lily | Music: freesound search 'inspiring corporate piano', mood fallback 'upbeat'

module.exports = {
    output: {
        title: "highest-paying-careers-zimbabwe-native", format: 'portrait', fps: 30, crf: 22, preset: 'medium',
        bgMusicVol: 0.1, bgMusic: { search: "inspiring corporate piano", mood: "upbeat" },
        postProcess: { grain: true, grainStrength: 0.02, vignette: true, vignetteStrength: 0.35 },
    },
    defaults: { voice: "bf_lily", transition: 'fade', transitionDuration: 0.35 },
    scenes: [
        {
            tts: { text: "What actually pays well in Zimbabwe, and which subjects get you there?", voice: "bf_lily", pauseAfter: 0.3 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 52, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5 },
            layers: [
                { type: 'pexels-video', query: "students graduation ceremony", orientation: 'portrait', loop: true, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                { type: 'text', text: "WHAT ACTUALLY\nPAYS WELL?", x: 540, y: 300, fontSize: 62, fontFamily: 'Arial Black, sans-serif', color: "#ffffff", align: 'center', maxWidth: 900, stroke: true, strokeColor: '#000', strokeWidth: 4 },
            ],
        },
        {
            tts: { text: "Careers in medicine, engineering, and accounting consistently top the list, and they all trace back to specific O Level and A Level subject choices made years earlier.", voice: "bf_lily", pauseAfter: 0.3 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 52, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5 },
            layers: [
                { type: 'stock-image', query: "doctor engineer accountant", source: 'pexels', orientation: 'portrait', fit: 'cover', kenBurns: "rotate-cw", kenBurnsAmount: 0.3, rotateDeg: 9, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
                { type: 'stat-counter', value: 3, suffix: " TOP FIELDS", label: "MEDICINE / ENGINEERING / ACCOUNTING", x: 540, y: 1500, fontSize: 100, labelSize: 28, color: "#f5c518", labelColor: '#ffffff', align: 'center', glow: true, glowColor: "#f5c518", glowBlur: 34, countDur: 1.2 },
            ],
        },
        {
            tts: { text: "Doctors need strong Combined Science and Chemistry. Engineers need Physics and Maths. Accountants need Maths and Commercials.", voice: "bf_lily", pauseAfter: 0.3 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 52, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5 },
            layers: [
                { type: 'stock-image', query: "science laboratory classroom", source: 'pexels', orientation: 'portrait', fit: 'cover', kenBurns: "rotate-ccw", kenBurnsAmount: 0.3, rotateDeg: 9, x: 0, y: 0, width: 1080, height: 1920 },
                { type: 'overlay', color: 'rgba(0,0,0,0.45)' },
                { type: 'text', text: "THE SUBJECTS DECIDE\nTHE DOORS THAT OPEN", x: 540, y: 1550, fontSize: 44, fontFamily: 'Arial Black, sans-serif', color: "#ffffff", align: 'center', maxWidth: 900, stroke: true, strokeColor: '#000', strokeWidth: 4 },
            ],
        },
        {
            tts: { text: "The subjects you pick at fourteen quietly decide which of these doors stay open at twenty-two. Read the full breakdown in the blog post linked below.", voice: "bf_lily", pauseAfter: 0.3 },
            captions: { style: 'highlight', position: 'bottom', fontSize: 52, color: '#ffffff', highlightColor: '#f5c518', wordsPerChunk: 3, strokeColor: 'rgba(0,0,0,1)', strokeWidth: 5 },
            layers: [
                { type: 'pexels-video', query: "graduation students celebration", orientation: 'portrait', loop: true, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover' },
                { type: 'overlay', color: 'rgba(0,0,0,0.4)' },
                { type: 'text', text: "READ THE FULL\nGUIDE BELOW", x: 540, y: 1600, fontSize: 46, fontFamily: 'Arial Black, sans-serif', color: "#f5c518", align: 'center', maxWidth: 900, stroke: true, strokeColor: '#000', strokeWidth: 4 },
            ],
        },
    ],
};
