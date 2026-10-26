// config.eht-paper.js
// Environmental Health Technician (EHT) Exam Paper REVISION GUIDE
// Ministry of Health and Child Care, Zimbabwe
// Dynamic async config — playful, detailed explanations with images & analogies
// Landscape format (1920x1080), long-form educational pacing, revision focus

module.exports = async () => {
    // Question data — pulled from the exam paper
    // Each question now has: narration (playful explanation), image (SerpAPI), and detailed answer breakdown
    const questions = [
        {
            id: 1,
            number: 1,
            topic: 'Professional Conduct',
            question: 'State any 5 code of conduct for Trainee EHT',
            marks: 5,
            image: 'professional healthcare worker integrity ethics',
            narration: 'Think of yourself as a health guardian. Just like a security guard doesn\'t just show up and do whatever they want, an Environmental Health Technician has rules of the game. These aren\'t suggestions — they\'re the backbone of trust. When you handle someone\'s health information, you\'re holding their most private secrets. When you inspect a restaurant\'s kitchen, you\'re protecting an entire community.',
            answer: [
                '✓ Maintain professional integrity at all times',
                '✓ Respect confidentiality of health information',
                '✓ Treat all clients with dignity and respect',
                '✓ Adhere to health and safety regulations',
                '✓ Keep accurate records and reports',
                '✓ Practice within scope of authority',
                '✓ Engage in continuous professional development',
            ],
        },
        {
            id: 2,
            number: 2,
            topic: 'Notifiable Diseases',
            question: 'What are notifiable diseases according to PHA CAP 15: 17 section 46?',
            marks: 7,
            subQ: 'State 5 examples',
            image: 'disease outbreak epidemic health alert',
            narration: 'Notifiable diseases are like fire alarms. When a fire breaks out, you don\'t just put it out quietly — you ring the alarm so everyone knows and can evacuate safely. Same with these diseases. The moment a doctor suspects one, they MUST report it. Because if one person has cholera, and nobody knows, suddenly the whole neighborhood drinks contaminated water. Now it\'s not one person — it\'s hundreds.',
            answer: [
                'What they are:',
                'Notifiable diseases = infectious diseases that MUST be reported to health authorities immediately',
                '',
                'Why? Because they spread fast and hurt many people.',
                '',
                'Real examples from Zimbabwe:',
                '✓ Cholera — spreads through water',
                '✓ Typhoid fever — food and water',
                '✓ Measles — airborne, super contagious',
                '✓ Tuberculosis — spreads through coughs',
                '✓ Polio — mostly children',
                '✓ Yellow fever — mosquito-borne',
                '✓ Plague — rare but deadly',
            ],
        },
        {
            id: 3,
            number: 3,
            topic: 'Disease Prevention at School',
            question: 'How would you prevent and control chicken pox at a local primary school?',
            marks: 5,
            image: 'school classroom children students health',
            narration: 'Chicken pox is the perfect example of why you matter as an EHT. Imagine 800 kids in one school. One gets chicken pox. Without intervention, within three weeks, half the school could be itching like crazy. But if you act FAST — isolation, vaccination, hygiene — you stop it dead. You\'re not just fixing a problem, you\'re protecting kids from missing weeks of education.',
            answer: [
                'YOUR ACTION PLAN:',
                '',
                '1️⃣ VACCINATION',
                '   → Immunize all susceptible children',
                '   → Check who hasn\'t been vaccinated',
                '',
                '2️⃣ ISOLATION',
                '   → Keep infected kids home for 7 days',
                '   → Prevent them from sharing desks/toys',
                '',
                '3️⃣ HYGIENE EDUCATION',
                '   → Teach hand washing with soap',
                '   → Teach respiratory etiquette (cover mouth)',
                '',
                '4️⃣ HEALTH EDUCATION',
                '   → Tell parents how it spreads',
                '   → Explain why isolation is temporary',
                '',
                '5️⃣ ENVIRONMENTAL CONTROL',
                '   → Disinfect desks, door handles, shared items',
                '   → Clean bathrooms thoroughly',
                '',
                '6️⃣ SURVEILLANCE',
                '   → Check daily for new cases',
                '   → Report trends to health office',
                '',
                '7️⃣ VENTILATION',
                '   → Open windows in classrooms',
                '   → Fresh air kills the virus faster',
            ],
        },
        {
            id: 4,
            number: 6,
            topic: 'Disease Surveillance',
            question: 'Define disease surveillance',
            marks: 5,
            image: 'medical surveillance monitoring health data analysis',
            narration: 'Disease surveillance is you becoming a health detective. Imagine you\'re watching a neighborhood 24/7 with a camera. You\'re not waiting for someone to tell you a disease is spreading — you\'re catching it BEFORE it becomes an epidemic. Every clinic report, every lab result, every patient who shows up with similar symptoms — that\'s data. And you\'re the one connecting the dots.',
            answer: [
                'DEFINITION:',
                'Disease Surveillance = ongoing systematic collection, analysis & interpretation of health data',
                '',
                'In English: You keep watching, keep collecting info, keep analyzing patterns',
                '',
                'WHY IT MATTERS:',
                '✓ Catch outbreaks early (before 1000 people get sick)',
                '✓ Identify disease patterns (why is TB high in winter?)',
                '✓ Guide prevention measures (what actually works)',
                '✓ Evaluate your interventions (are we winning?)',
                '',
                'EXAMPLE:',
                'You notice 5 cases of diarrhea in Ward 3 in one week.',
                'That\'s normal. But 15 cases? Red flag.',
                'You investigate → find contaminated water → fix it → problem solved.',
            ],
        },
        {
            id: 5,
            number: 7,
            topic: 'Disease Investigation',
            question: 'Define disease investigation',
            marks: 5,
            image: 'medical investigation case study health research',
            narration: 'If surveillance is watching the neighborhood, investigation is CSI: Health Edition. Someone got sick. Now you become a detective. Where did they go? Who did they touch? What did they eat? When did symptoms start? You\'re retracing their steps to find the source and make sure nobody else gets infected.',
            answer: [
                'DEFINITION:',
                'Disease Investigation = detective work on confirmed disease cases',
                '',
                'YOU ARE ASKING:',
                '❓ WHO got the disease?',
                '❓ WHERE do they live/work?',
                '❓ WHEN did symptoms start?',
                '❓ WHAT did they eat/drink?',
                '❓ WHO else did they touch?',
                '',
                'YOUR STEPS:',
                '1. Confirm the diagnosis (test results)',
                '2. Interview the patient (detailed history)',
                '3. Identify contacts (people they infected)',
                '4. Find the source (where it came from)',
                '5. Assess risk factors (why them?)',
                '6. Control measures (isolation, treatment, notification)',
                '',
                'REAL EXAMPLE:',
                'Cholera outbreak → investigate patient → find they ate seafood from polluted market → close market → test water → fix contamination',
            ],
        },
        {
            id: 6,
            number: 10,
            topic: 'WASHM Framework',
            question: 'What does WASHM stand for?',
            marks: 5,
            image: 'water sanitation hygiene facilities clean village',
            narration: 'WASHM is your golden ticket. Remember this acronym like you remember your own name. Because without WASHM, nothing works. You can have the best doctors, the best hospitals, but if people are drinking dirty water and have no toilets? You lose.',
            answer: [
                'WASHM = The Foundation of Public Health',
                '',
                '🌊 W = WATER',
                '   Safe drinking water supply',
                '   Clean, testable, accessible',
                '',
                '🚽 A = SANITATION',
                '   Proper toilets & waste disposal',
                '   Prevents contamination',
                '',
                '🧼 S = HYGIENE',
                '   Hand washing, personal cleanliness',
                '   Breaks disease transmission chains',
                '',
                '📊 M = MONITORING',
                '   Test water quality regularly',
                '   Track sanitation compliance',
                '   Measure hygiene improvements',
                '',
                'THE TRUTH:',
                'Communities with WASHM = low disease rates',
                'Communities without WASHM = high disease rates',
                'It\'s that simple. It\'s that powerful.',
            ],
        },
        {
            id: 7,
            number: 13,
            topic: 'Personal Hygiene',
            question: 'What is personal Hygiene?',
            marks: 5,
            image: 'personal hygiene hand washing clean healthy',
            narration: 'Personal hygiene isn\'t just about not being gross. It\'s about being a shield. Every time you wash your hands with soap, you\'re stopping 99.9% of germs from getting into your body. Every time you shower, you\'re washing away bacteria that could cause infection. You\'re literally protecting yourself and everyone around you.',
            answer: [
                'DEFINITION:',
                'Personal Hygiene = daily practices & habits that keep you clean, healthy & disease-free',
                '',
                'THE 7 PILLARS OF PERSONAL HYGIENE:',
                '',
                '1️⃣ HAND WASHING',
                '   → With soap and water for 20 seconds',
                '   → After toilet, before eating',
                '   → Prevents 30% of disease transmission',
                '',
                '2️⃣ BATHING/SHOWERING',
                '   → Regularly (daily or every 2 days)',
                '   → Removes dirt, sweat, bacteria',
                '',
                '3️⃣ DENTAL CARE',
                '   → Brush twice daily with fluoride toothpaste',
                '   → Prevents decay & infections',
                '',
                '4️⃣ NAIL CARE',
                '   → Keep short & clean',
                '   → Long nails harbor bacteria',
                '',
                '5️⃣ SKIN CARE',
                '   → Moisturize, prevent cracks',
                '   → Avoid skin infections',
                '',
                '6️⃣ MENSTRUAL HYGIENE (for women)',
                '   → Change pads/tampons regularly',
                '   → Prevents UTIs & infections',
                '',
                '7️⃣ FOOD HANDLING',
                '   → Wash hands before cooking',
                '   → Keep food containers clean',
                '   → Prevents foodborne illness',
            ],
        },
    ];

    // Build scenes dynamically
    const scenes = [];

    // ══ OPENING SCENE — Set the tone for REVISION ═════════════════════════════
    scenes.push({
        tts: {
            text: 'This is a REVISION GUIDE, not a quiz. Think of me as your study buddy who actually knows the material. We are going through the Environmental Health Technician exam paper from the Ministry of Health and Child Care, Zimbabwe. But we are not just reading questions and answers. We are breaking them down, explaining them with stories and analogies, so when you sit for the real exam, you do not just know the answers — you understand WHY they matter. This is your time to learn. Let us go.',
            voice: 'am_michael',
            pauseAfter: 0.8,
        },
        transition: 'fade',
        transitionDuration: 0.5,
        captions: true,
        layers: [
            {
                type: 'gradient',
                gradientType: 'linear',
                colors: ['#0f1419', '#1a2332', '#0f1419'],
                angle: 135,
            },
            {
                type: 'text',
                text: 'EHT EXAM PAPER\nREVISION GUIDE',
                x: 960,
                y: 300,
                fontSize: 76,
                fontFamily: 'Arial Black, sans-serif',
                color: '#00ff88',
                align: 'center',
                hookLayer: true,
                stroke: true,
                strokeColor: '#004400',
                strokeWidth: 4,
            },
            {
                type: 'text',
                text: '🎯 Not a Quiz. A Learning Experience.',
                x: 960,
                y: 450,
                fontSize: 36,
                fontFamily: 'Arial, sans-serif',
                color: '#00ff88',
                align: 'center',
            },
            {
                type: 'text',
                text: 'Ministry of Health and Child Care, Zimbabwe',
                x: 960,
                y: 550,
                fontSize: 28,
                fontFamily: 'Arial, sans-serif',
                color: 'rgba(255, 255, 255, 0.7)',
                align: 'center',
            },
            {
                type: 'text',
                text: 'Understand WHY, not just WHAT',
                x: 960,
                y: 650,
                fontSize: 26,
                fontFamily: 'Arial, sans-serif',
                color: '#38bdf8',
                align: 'center',
            },
        ],
    });

    // ══ GENERATE DETAILED QUESTION SCENES ══════════════════════════════════════
    questions.forEach((q, idx) => {
        // SCENE 1: Question intro with context image
        scenes.push({
            tts: {
                text: `Question ${q.number}: ${q.question}. Worth ${q.marks} marks. This is about ${q.topic}.`,
                voice: 'am_michael',
                pauseAfter: 0.3,
            },
            transition: 'fade',
            transitionDuration: 0.3,
            captions: true,
            layers: [
                {
                    type: 'stock-image',
                    query: q.image,
                    source: 'serpapi',
                    orientation: 'landscape',
                    kenBurns: 'zoom-in',
                    kenBurnsAmount: 0.08,
                    x: 0,
                    y: 0,
                    width: 1920,
                    height: 1080,
                    fit: 'cover',
                },
                {
                    type: 'overlay',
                    color: 'rgba(15, 20, 25, 0.65)',
                },
                {
                    type: 'text',
                    text: `Q${q.number}: ${q.topic}`,
                    x: 960,
                    y: 200,
                    fontSize: 48,
                    fontFamily: 'Arial Black, sans-serif',
                    color: '#00ff88',
                    align: 'center',
                    stroke: true,
                    strokeColor: '#000',
                    strokeWidth: 3,
                },
                {
                    type: 'text',
                    text: `[${q.marks} marks]`,
                    x: 960,
                    y: 280,
                    fontSize: 32,
                    fontFamily: 'Arial, sans-serif',
                    color: '#38bdf8',
                    align: 'center',
                },
            ],
        });

        // SCENE 2: The actual question text
        scenes.push({
            tts: {
                text: `The question is: ${q.question}${q.subQ ? '. ' + q.subQ : ''}`,
                voice: 'am_michael',
                pauseAfter: 0.4,
            },
            transition: 'fade',
            transitionDuration: 0.3,
            captions: false,
            layers: [
                {
                    type: 'background',
                    color: '#0a0a14',
                    noise: true,
                    noiseOpacity: 0.04,
                },
                {
                    type: 'html-record',
                    duration: 5,
                    fps: 30,
                    viewport: { width: 1920, height: 1080 },
                    x: 0,
                    y: 0,
                    width: 1920,
                    height: 1080,
                    fit: 'cover',
                    html: `
                        <div class="container">
                            <div class="question-card">
                                <div class="q-number">QUESTION ${q.number}</div>
                                <div class="q-text">${q.question}</div>
                                ${q.subQ ? `<div class="q-sub">${q.subQ}</div>` : ''}
                                <div class="q-marks">[ ${q.marks} marks ]</div>
                            </div>
                        </div>
                        <style>
                            .container { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
                            .question-card { background: linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(0, 255, 136, 0.08) 100%); border: 3px solid #0284c7; border-radius: 20px; padding: 70px; max-width: 1700px; box-shadow: 0 25px 70px rgba(0,0,0,0.5); animation: slideUp 0.6s ease; }
                            .q-number { font-size: 22px; font-weight: 700; color: #00ff88; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 20px; }
                            .q-text { font-size: 52px; font-weight: 700; color: #ffffff; line-height: 1.4; margin-bottom: 24px; }
                            .q-sub { font-size: 32px; color: #38bdf8; font-style: italic; margin-bottom: 28px; font-weight: 600; }
                            .q-marks { font-size: 26px; color: #94a3b8; font-weight: 600; margin-top: 36px; }
                            @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
                        </style>
                    `,
                    waitFor: 'body',
                },
            ],
        });

        // SCENE 3: The playful explanation with analogy
        scenes.push({
            tts: {
                text: q.narration,
                voice: 'am_michael',
                pauseAfter: 0.5,
            },
            transition: 'fade',
            transitionDuration: 0.3,
            captions: true,
            layers: [
                {
                    type: 'gradient',
                    gradientType: 'linear',
                    colors: ['#1a0a2e', '#16213e', '#0f1419'],
                    angle: 135,
                },
                {
                    type: 'html-record',
                    duration: 8,
                    fps: 30,
                    viewport: { width: 1920, height: 1080 },
                    x: 0,
                    y: 0,
                    width: 1920,
                    height: 1080,
                    fit: 'cover',
                    html: `
                        <div class="container">
                            <div class="explanation-card">
                                <div class="icon">💡</div>
                                <div class="title">WHY THIS MATTERS</div>
                                <div class="content">${q.narration}</div>
                            </div>
                        </div>
                        <style>
                            .container { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 60px; }
                            .explanation-card { background: rgba(0, 255, 136, 0.06); border: 2px solid #00ff88; border-radius: 24px; padding: 60px; max-width: 1700px; text-align: center; }
                            .icon { font-size: 80px; margin-bottom: 20px; animation: bounce 2s infinite; }
                            .title { font-size: 40px; font-weight: 700; color: #00ff88; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px; }
                            .content { font-size: 28px; color: #e0f2fe; line-height: 1.8; }
                            @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                        </style>
                    `,
                    waitFor: 'body',
                },
            ],
        });

        // SCENE 4: The detailed answer breakdown
        scenes.push({
            tts: {
                text: q.answer
                    .join(' ')
                    .split(/[0-9️⃣]/)[0]
                    .substring(0, 400),
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            transition: 'fade',
            transitionDuration: 0.3,
            captions: false,
            layers: [
                {
                    type: 'background',
                    color: '#0a0a14',
                    noise: true,
                    noiseOpacity: 0.03,
                },
                {
                    type: 'html-record',
                    duration: 8,
                    fps: 30,
                    viewport: { width: 1920, height: 1080 },
                    x: 0,
                    y: 0,
                    width: 1920,
                    height: 1080,
                    fit: 'cover',
                    data: { answer: q.answer },
                    html: `
                        <div class="container">
                            <div class="answer-card">
                                <div class="answer-title">✓ THE ANSWER BREAKDOWN</div>
                                <div class="answer-content" id="content"></div>
                            </div>
                        </div>
                        <style>
                            .container { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 50px; }
                            .answer-card { background: linear-gradient(135deg, rgba(0, 255, 136, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%); border: 3px solid #00ff88; border-radius: 20px; padding: 60px; max-width: 1700px; max-height: 950px; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
                            .answer-title { font-size: 32px; font-weight: 700; color: #00ff88; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 32px; }
                            .answer-content { font-size: 24px; color: #f0f9ff; line-height: 2.0; }
                            .answer-content div { margin-bottom: 16px; }
                            .answer-content div:empty { height: 12px; }
                            @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                            .answer-card { animation: fadeIn 0.6s ease; }
                            .answer-content div:first-child { font-weight: 700; color: #00ff88; font-size: 26px; }
                        </style>
                        <script>
                            const data = window.__APEX_DATA__ || { answer: [] };
                            const content = document.getElementById('content');
                            (data.answer || []).forEach((line, i) => {
                                const div = document.createElement('div');
                                div.textContent = line;
                                div.style.animationDelay = (i * 50) + 'ms';
                                div.style.animation = 'fadeIn 0.5s ease forwards';
                                div.style.opacity = '0';
                                content.appendChild(div);
                            });
                        </script>
                    `,
                    waitFor: 'body',
                },
            ],
        });

        // Separator scene between questions
        if (idx < questions.length - 1) {
            scenes.push({
                duration: 1.5,
                transition: 'fade',
                transitionDuration: 0.3,
                layers: [
                    {
                        type: 'background',
                        color: '#0a0a14',
                    },
                    {
                        type: 'text',
                        text: `✓ Question ${q.number} Complete`,
                        x: 960,
                        y: 500,
                        fontSize: 44,
                        fontFamily: 'Arial, sans-serif',
                        color: '#00ff88',
                        align: 'center',
                    },
                ],
            });
        }
    });

    // ══ CLOSING SCENE — Encouragement ═════════════════════════════════════════
    scenes.push({
        tts: {
            text: 'You have just worked through seven key exam topics. This is not all twenty questions, but these are the CORE concepts. Master these, and the rest will fall into place. Disease surveillance, food safety, water quality, personal hygiene — these are not just exam topics. These are your life\'s work as an Environmental Health Technician. You are the guardian of community health. Now go and study the remaining questions with the same depth. You have got this.',
            voice: 'am_michael',
            pauseAfter: 0.7,
        },
        transition: 'fade',
        transitionDuration: 0.5,
        captions: false,
        layers: [
            {
                type: 'gradient',
                gradientType: 'radial',
                colors: ['#00ff88', '#0f1419', '#000000'],
                vignette: true,
                vignetteStrength: 0.6,
            },
            {
                type: 'text',
                text: '✓ REVISION COMPLETE',
                x: 960,
                y: 350,
                fontSize: 60,
                fontFamily: 'Arial Black, sans-serif',
                color: '#00ff88',
                align: 'center',
                stroke: true,
                strokeColor: '#004400',
                strokeWidth: 3,
            },
            {
                type: 'text',
                text: '7 Key Topics Mastered',
                x: 960,
                y: 500,
                fontSize: 40,
                fontFamily: 'Arial, sans-serif',
                color: '#38bdf8',
                align: 'center',
            },
            {
                type: 'text',
                text: 'Next Step: Review questions 16–20 on your own\nThen practice past papers under timed conditions',
                x: 960,
                y: 650,
                fontSize: 28,
                fontFamily: 'Arial, sans-serif',
                color: 'rgba(255, 255, 255, 0.8)',
                align: 'center',
                maxWidth: 1700,
            },
            {
                type: 'text',
                text: 'You are a future guardian of public health. Act like it.',
                x: 960,
                y: 850,
                fontSize: 32,
                fontFamily: 'Arial Black, sans-serif',
                color: '#00ff88',
                align: 'center',
                stroke: true,
                strokeColor: '#004400',
                strokeWidth: 2,
            },
        ],
    });

    // Return final config
    return {
        output: {
            title: 'eht-exam-paper-walkthrough',
            format: 'landscape',
            fps: 30,
            crf: 23,
            preset: 'fast',
            postProcess: {
                grain: true,
                grainStrength: 0.015,
                vignette: true,
                vignetteStrength: 0.35,
            },
        },

        defaults: {
            voice: 'am_michael',
            transition: 'fade',
            transitionDuration: 0.35,
        },

        scenes,
    };
};
