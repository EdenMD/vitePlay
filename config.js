// =============================================================================
// APEX V3 — EPISODE 1: "Why Do You Want to Be a Registered General Nurse?"
// Masterclass: Zimbabwean MoHCC Nursing Intake Interview Coaching
// Format: 16:9 Landscape (1920x1080 @ 30 FPS) — Optimized for YouTube / books.co.zw
// Voice: bm_daniel (British Male — Measured, Professional & Authoritative)
// Visuals: 100% Inline HTML5/CSS3/JS via Apex V3 html-record Engine
// =============================================================================

module.exports = {
    output: {
        width: 1920,
        height: 1080,
        fps: 30,
        filename: 'rgn-interview-ep1-masterclass.mp4',
        bgMusic: {
            // Freesound ambient clinical/focus background drone
            search: 'ambient medical focus background slow piano electronic',
            volume: 0.12,
            fadeIn: 2.0,
            fadeOut: 3.0
        }
    },

    scenes: [
        // =====================================================================
        // SCENE 1: THE OPENING HOOK & THE SILENT FILTER
        // =====================================================================
        {
            name: 'Scene 1 - The Reality of the First Question',
            tts: {
                engine: 'kokoro',
                voice: 'bm_daniel',
                speed: 0.98,
                text: "Welcome to books.co.zw nursing masterclass. When you sit before a Ministry of Health interview panel at Parirenyatwa, Sally Mugabe, or Mpilo, their opening question is almost guaranteed: 'Why do you want to become a Registered General Nurse?' Most candidates treat this as an icebreaker. The panel, however, uses it as a ruthless elimination filter."
            },
            layers: [
                {
                    type: 'html-record',
                    x: 0, y: 0, width: 1920, height: 1080,
                    viewport: { width: 1920, height: 1080 },
                    audioSync: true,
                    html: `
                        <div class="screen-container">
                            <div class="glow-sphere"></div>
                            <header class="top-bar">
                                <div class="brand-tag">
                                    <span class="pulse-dot"></span>
                                    BOOKS.CO.ZW CLINICAL COACHING SERIES
                                </div>
                                <div class="badge">EPISODE 01 • INTAKE MASTERCLASS</div>
                            </header>

                            <main class="hero-content">
                                <div class="question-pill">CORE INTERVIEW QUESTION #01</div>
                                <h1 class="main-title">"Why Do You Want to Become a Registered Nurse?"</h1>
                                
                                <div class="stats-row">
                                    <div class="stat-card">
                                        <div class="stat-num">90%</div>
                                        <div class="stat-label">Of applicants give standard rehearsed answers</div>
                                    </div>
                                    <div class="stat-card alert">
                                        <div class="stat-num">#1</div>
                                        <div class="stat-label">Most common cause of immediate panel disengagement</div>
                                    </div>
                                    <div class="stat-card highlight">
                                        <div class="stat-num">3 min</div>
                                        <div class="stat-label">To prove emotional stamina and professional intent</div>
                                    </div>
                                </div>
                            </main>

                            <footer class="audio-reactive-strip">
                                <div class="eq-label">AUDIO SPECTRUM</div>
                                <div class="eq-bars">
                                    <span class="bar"></span><span class="bar"></span><span class="bar"></span><span class="bar"></span>
                                    <span class="bar"></span><span class="bar"></span><span class="bar"></span><span class="bar"></span>
                                </div>
                            </footer>
                        </div>

                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
                            * { margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans',sans-serif; }
                            .screen-container {
                                width:1920px; height:1080px; background:#060d17;
                                background-image: radial-gradient(circle at 50% 20%, #0d2847 0%, #050b14 100%);
                                color:#fff; padding:60px 80px; position:relative; overflow:hidden;
                                display:flex; flex-direction:column; justify-content:space-between;
                            }
                            .glow-sphere {
                                position:absolute; top:-150px; right:-150px; width:700px; height:700px;
                                background:radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%);
                                border-radius:50%; pointer-events:none;
                            }
                            .top-bar { display:flex; justify-content:space-between; align-items:center; }
                            .brand-tag {
                                display:flex; align-items:center; gap:12px; font-weight:700;
                                letter-spacing:2px; font-size:15px; color:#38bdf8;
                            }
                            .pulse-dot {
                                width:10px; height:10px; border-radius:50%; background:#38bdf8;
                                box-shadow:0 0 12px #38bdf8;
                            }
                            .badge {
                                background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12);
                                padding:8px 20px; border-radius:100px; font-size:14px; font-weight:600; color:#cbd5e1;
                            }
                            .hero-content { margin-top:40px; }
                            .question-pill {
                                display:inline-block; background:rgba(56,189,248,0.15); color:#38bdf8;
                                border:1px solid rgba(56,189,248,0.3); padding:8px 18px; border-radius:8px;
                                font-size:14px; font-weight:700; letter-spacing:1px; margin-bottom:24px;
                            }
                            .main-title {
                                font-size:62px; font-weight:800; line-height:1.18; color:#f8fafc;
                                max-width:1400px; margin-bottom:50px;
                                text-shadow:0 4px 24px rgba(0,0,0,0.4);
                            }
                            .stats-row { display:flex; gap:30px; }
                            .stat-card {
                                flex:1; background:rgba(15,23,42,0.65); border:1px solid rgba(255,255,255,0.08);
                                border-radius:20px; padding:32px; backdrop-filter:blur(10px);
                            }
                            .stat-card.alert { border-color:rgba(239,68,68,0.3); background:rgba(239,68,68,0.06); }
                            .stat-card.highlight { border-color:rgba(56,189,248,0.4); background:rgba(56,189,248,0.08); }
                            .stat-num { font-size:44px; font-weight:800; color:#38bdf8; margin-bottom:10px; }
                            .stat-card.alert .stat-num { color:#f87171; }
                            .stat-label { font-size:18px; color:#94a3b8; line-height:1.4; font-weight:500; }
                            .audio-reactive-strip {
                                display:flex; align-items:center; gap:20px;
                                background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06);
                                padding:16px 28px; border-radius:14px;
                            }
                            .eq-label { font-size:13px; font-weight:700; letter-spacing:1.5px; color:#64748b; }
                            .eq-bars { display:flex; align-items:center; gap:6px; height:24px; }
                            .bar { width:4px; height:8px; background:#38bdf8; border-radius:2px; }
                        </style>

                        <script>
                            window.addEventListener('apexframe', (e) => {
                                const { amplitude } = e.detail;
                                const bars = document.querySelectorAll('.bar');
                                bars.forEach((b, idx) => {
                                    const scale = Math.max(0.2, (amplitude * 2.5) * (1 - (idx * 0.08)));
                                    b.style.transform = 'scaleY(' + Math.min(scale * 3.5, 4.0) + ')';
                                    b.style.opacity = 0.4 + (amplitude * 0.6);
                                });
                            });
                        </script>
                    `
                }
            ]
        },

        // =====================================================================
        // SCENE 2: THE FATAL CLICHÉ VS WHAT THE BOARD SEES
        // =====================================================================
        {
            name: 'Scene 2 - The Cliché vs Panel Mindset',
            tts: {
                engine: 'kokoro',
                voice: 'bm_daniel',
                speed: 0.98,
                text: "Here is the critical mistake. Over eighty percent of interviewees respond with clichés like: 'I have a passion for helping the sick', or 'It has been my dream since childhood.' While noble, senior matrons and tutors have heard this ten thousand times. In our healthcare system, love for helping is assumed. What they need to know is whether you can handle fifty-bed wards, night emergency admissions, and severe supply constraints without breaking down."
            },
            layers: [
                {
                    type: 'html-record',
                    x: 0, y: 0, width: 1920, height: 1080,
                    viewport: { width: 1920, height: 1080 },
                    audioSync: true,
                    html: `
                        <div class="screen-container">
                            <header class="section-header">
                                <span class="tag">CRITICAL COMPARISON</span>
                                <h2>The Anatomy of Rejection vs What Panels Listen For</h2>
                            </header>

                            <div class="split-view">
                                <!-- Left Column: Rejection -->
                                <div class="column reject">
                                    <div class="col-badge bad">✕ THE FATAL CLICHÉ</div>
                                    <div class="quote-box">
                                        "Ever since I was young, I always had a deep passion to help the sick and wear the white uniform."
                                    </div>
                                    <div class="breakdown">
                                        <div class="point-item">
                                            <span class="icon">⚠️</span>
                                            <div>
                                                <strong>Generic & Rehearsed</strong>
                                                <p>Shows no individual depth or actual understanding of modern clinical practice.</p>
                                            </div>
                                        </div>
                                        <div class="point-item">
                                            <span class="icon">⚠️</span>
                                            <div>
                                                <strong>Romanticized Illusion</strong>
                                                <p>Ignores the gritty, stressful physical realities of hospital ward management.</p>
                                            </div>
                                        </div>
                                        <div class="point-item">
                                            <span class="icon">⚠️</span>
                                            <div>
                                                <strong>Zero Clinical Grounding</strong>
                                                <p>Fails to distinguish nursing from social work or volunteering.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Right Column: The Real Evaluation -->
                                <div class="column evaluate">
                                    <div class="col-badge good">✓ WHAT THE MATRONS EVALUATE</div>
                                    <div class="checklist">
                                        <div class="eval-card">
                                            <div class="eval-title">1. Emotional & Physical Stamina</div>
                                            <div class="eval-desc">Can you maintain clinical accuracy during prolonged 12-hour night duties?</div>
                                        </div>
                                        <div class="eval-card">
                                            <div class="eval-title">2. Resourcefulness in Shortage</div>
                                            <div class="eval-desc">How do you respond when supplies, linen, or diagnostics are delayed?</div>
                                        </div>
                                        <div class="eval-card">
                                            <div class="eval-title">3. Scientific Diligence</div>
                                            <div class="eval-desc">Understanding pharmacology, aseptic techniques, and patient vital monitoring.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
                            * { margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans',sans-serif; }
                            .screen-container {
                                width:1920px; height:1080px; background:#070e17;
                                color:#fff; padding:60px 80px; display:flex; flex-direction:column; gap:36px;
                            }
                            .tag { color:#38bdf8; font-size:14px; font-weight:800; letter-spacing:2px; text-transform:uppercase; }
                            h2 { font-size:38px; font-weight:800; color:#f1f5f9; margin-top:8px; }
                            .split-view { display:flex; gap:40px; flex:1; }
                            .column {
                                flex:1; border-radius:24px; padding:36px; display:flex; flex-direction:column;
                                background:rgba(15,23,42,0.7); border:1px solid rgba(255,255,255,0.08);
                            }
                            .column.reject { border-color:rgba(239,68,68,0.3); background:rgba(239,68,68,0.03); }
                            .column.evaluate { border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.03); }
                            .col-badge {
                                display:inline-block; font-size:13px; font-weight:800; letter-spacing:1.5px;
                                padding:6px 16px; border-radius:100px; margin-bottom:20px; align-self:flex-start;
                            }
                            .col-badge.bad { background:rgba(239,68,68,0.2); color:#f87171; }
                            .col-badge.good { background:rgba(16,185,129,0.2); color:#34d399; }
                            .quote-box {
                                background:rgba(0,0,0,0.4); border-left:4px solid #ef4444; padding:20px;
                                border-radius:8px; font-style:italic; font-size:20px; line-height:1.5; color:#fca5a5;
                                margin-bottom:24px;
                            }
                            .breakdown { display:flex; flex-direction:column; gap:18px; }
                            .point-item { display:flex; gap:16px; align-items:flex-start; }
                            .point-item .icon { font-size:20px; margin-top:2px; }
                            .point-item strong { display:block; font-size:17px; color:#f8fafc; margin-bottom:4px; }
                            .point-item p { font-size:15px; color:#94a3b8; line-height:1.4; margin:0; }
                            .checklist { display:flex; flex-direction:column; gap:16px; flex:1; justify-content:center; }
                            .eval-card {
                                background:rgba(15,23,42,0.85); border:1px solid rgba(16,185,129,0.25);
                                border-radius:14px; padding:22px;
                            }
                            .eval-title { font-size:18px; font-weight:700; color:#34d399; margin-bottom:6px; }
                            .eval-desc { font-size:15px; color:#cbd5e1; line-height:1.4; }
                        </style>
                    `
                }
            ]
        },

        // =====================================================================
        // SCENE 3: THE 3-PILLAR FORMULA
        // =====================================================================
        {
            name: 'Scene 3 - The 3 Pillar Answering Formula',
            tts: {
                engine: 'kokoro',
                voice: 'bm_daniel',
                speed: 0.98,
                text: "To construct an answer that scores in the top tier, use our three-pillar framework. Pillar one: The Catalyst. A specific event or observation that sparked your interest. Pillar two: The Realism. Demonstrating you understand the unglamorous, demanding reality of nursing. And Pillar three: The Professional Alignment. Explaining why you are committed to the public healthcare system in Zimbabwe."
            },
            layers: [
                {
                    type: 'html-record',
                    x: 0, y: 0, width: 1920, height: 1080,
                    viewport: { width: 1920, height: 1080 },
                    audioSync: true,
                    html: `
                        <div class="screen-container">
                            <header class="section-header">
                                <span class="tag">METHODOLOGY</span>
                                <h2>The 3-Pillar High-Scoring Formula</h2>
                                <p class="sub">How to structure your response in 90 seconds without rambling</p>
                            </header>

                            <div class="pillars-container">
                                <!-- Pillar 1 -->
                                <div class="pillar-card">
                                    <div class="step-num">01</div>
                                    <div class="pillar-name">The Specific Catalyst</div>
                                    <div class="pillar-summary">Ground your origin story in an authentic, concrete moment.</div>
                                    <div class="key-box">
                                        <div class="key-title">Do Not Say:</div>
                                        <div class="key-text">"I just feel born to do this."</div>
                                        <div class="key-title good-title">Say Instead:</div>
                                        <div class="key-text good-text">"Witnessing post-operative recovery where clinical diligence stabilized a fragile patient."</div>
                                    </div>
                                </div>

                                <!-- Pillar 2 -->
                                <div class="pillar-card active">
                                    <div class="step-num">02</div>
                                    <div class="pillar-name">Grounded Realism</div>
                                    <div class="pillar-summary">Prove you understand that nursing is demanding manual and intellectual labor.</div>
                                    <div class="key-box">
                                        <div class="key-title">Core Message:</div>
                                        <div class="key-text">Acknowledge long hours, aseptic discipline, vital-sign accuracy, and patient dignity.</div>
                                    </div>
                                </div>

                                <!-- Pillar 3 -->
                                <div class="pillar-card">
                                    <div class="step-num">03</div>
                                    <div class="pillar-name">System Commitment</div>
                                    <div class="pillar-summary">Align yourself with Zimbabwe's public healthcare vision and MoHCC values.</div>
                                    <div class="key-box">
                                        <div class="key-title">Core Message:</div>
                                        <div class="key-text">Demonstrating dedication to community wellness and learning under seasoned clinical tutors.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
                            * { margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans',sans-serif; }
                            .screen-container {
                                width:1920px; height:1080px; background:#070d18;
                                color:#fff; padding:60px 80px; display:flex; flex-direction:column; justify-content:space-between;
                            }
                            .tag { color:#38bdf8; font-size:14px; font-weight:800; letter-spacing:2px; }
                            h2 { font-size:42px; font-weight:800; color:#f8fafc; margin:6px 0 4px 0; }
                            .sub { font-size:18px; color:#94a3b8; }
                            .pillars-container { display:flex; gap:30px; margin-top:20px; }
                            .pillar-card {
                                flex:1; background:rgba(15,23,42,0.7); border:1px solid rgba(255,255,255,0.08);
                                border-radius:24px; padding:36px; display:flex; flex-direction:column;
                                position:relative; overflow:hidden;
                            }
                            .pillar-card.active { border-color:rgba(56,189,248,0.5); background:rgba(14,165,233,0.05); }
                            .step-num {
                                font-size:48px; font-weight:800; color:rgba(255,255,255,0.12);
                                line-height:1; margin-bottom:12px;
                            }
                            .pillar-card.active .step-num { color:rgba(56,189,248,0.4); }
                            .pillar-name { font-size:24px; font-weight:800; color:#f8fafc; margin-bottom:12px; }
                            .pillar-summary { font-size:16px; color:#94a3b8; line-height:1.5; margin-bottom:24px; }
                            .key-box {
                                background:rgba(0,0,0,0.3); border-radius:12px; padding:18px;
                                border:1px solid rgba(255,255,255,0.05);
                            }
                            .key-title { font-size:12px; font-weight:800; letter-spacing:1px; color:#ef4444; margin-bottom:4px; text-transform:uppercase; }
                            .key-title.good-title { color:#38bdf8; margin-top:10px; }
                            .key-text { font-size:14px; color:#cbd5e1; line-height:1.4; }
                            .key-text.good-text { color:#e2e8f0; font-weight:600; }
                        </style>
                    `
                }
            ]
        },

        // =====================================================================
        // SCENE 4: WORD-FOR-WORD BENCHMARK ANSWER
        // =====================================================================
        {
            name: 'Scene 4 - Model Candidate Response',
            tts: {
                engine: 'kokoro',
                voice: 'bm_daniel',
                speed: 0.96,
                text: "Let us assemble this into a complete benchmark answer you can deliver. Listen closely: 'During my family member's hospital stay, I observed that while doctors prescribed the clinical trajectory, it was the nurses whose continuous monitoring, fluid management, and rapid recognition of distress kept the patient alive. I am choosing nursing because I want a profession of disciplined clinical skill, science, and advocacy. I am fully aware of the workload and night duties in our central hospitals, and I have cultivated the physical discipline and focus required to train and serve under the Ministry of Health.'"
            },
            layers: [
                {
                    type: 'html-record',
                    x: 0, y: 0, width: 1920, height: 1080,
                    viewport: { width: 1920, height: 1080 },
                    audioSync: true,
                    html: `
                        <div class="screen-container">
                            <header class="section-header">
                                <span class="tag">VERBATIM BENCHMARK SCRIPT</span>
                                <h2>High-Scoring Candidate Model Answer</h2>
                            </header>

                            <div class="teleprompter-card">
                                <div class="script-body">
                                    <p class="section-one">
                                        <span class="label">CATALYST:</span>
                                        "During my family member's hospital stay, I observed that while doctors prescribed the clinical trajectory, it was the nurses whose continuous monitoring, fluid management, and rapid recognition of distress kept the patient alive."
                                    </p>
                                    <p class="section-two">
                                        <span class="label">REALISM:</span>
                                        "I am choosing nursing because I want a profession of disciplined clinical skill, science, and advocacy. I am fully aware of the workload and night duties in our central hospitals..."
                                    </p>
                                    <p class="section-three">
                                        <span class="label">COMMITMENT:</span>
                                        "...and I have cultivated the physical discipline and focus required to train and serve under the Ministry of Health."
                                    </p>
                                </div>

                                <div class="score-badge-row">
                                    <div class="badge-item">✓ Acknowledges 12h Night Shifts</div>
                                    <div class="badge-item">✓ Separates Medicine from Nursing</div>
                                    <div class="badge-item">✓ Demonstrates MoHCC Dedication</div>
                                </div>
                            </div>
                        </div>

                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
                            * { margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans',sans-serif; }
                            .screen-container {
                                width:1920px; height:1080px; background:#060d16;
                                color:#fff; padding:60px 80px; display:flex; flex-direction:column; gap:28px;
                            }
                            .tag { color:#38bdf8; font-size:14px; font-weight:800; letter-spacing:2px; }
                            h2 { font-size:40px; font-weight:800; color:#f8fafc; }
                            .teleprompter-card {
                                flex:1; background:rgba(15,23,42,0.85); border:2px solid rgba(56,189,248,0.3);
                                border-radius:24px; padding:48px; display:flex; flex-direction:column;
                                justify-content:space-between; box-shadow:0 24px 60px rgba(0,0,0,0.5);
                            }
                            .script-body { display:flex; flex-direction:column; gap:24px; }
                            p { font-size:26px; line-height:1.5; color:#e2e8f0; margin:0; }
                            .label {
                                font-weight:800; font-size:16px; letter-spacing:1.5px;
                                padding:4px 10px; border-radius:6px; margin-right:8px; vertical-align:middle;
                            }
                            .section-one .label { background:#0369a1; color:#e0f2fe; }
                            .section-two .label { background:#047857; color:#d1fae5; }
                            .section-three .label { background:#6d28d9; color:#ede9fe; }
                            .score-badge-row {
                                display:flex; gap:20px; padding-top:24px;
                                border-top:1px solid rgba(255,255,255,0.08);
                            }
                            .badge-item {
                                background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.3);
                                color:#7dd3fc; padding:10px 20px; border-radius:100px; font-size:16px; font-weight:700;
                            }
                        </style>
                    `
                }
            ]
        },

        // =====================================================================
        // SCENE 5: SUMMARY & ACTION STEPS (OUTRO)
        // =====================================================================
        {
            name: 'Scene 5 - Recap & Action Plan',
            tts: {
                engine: 'kokoro',
                voice: 'bm_daniel',
                speed: 0.98,
                text: "Practice this answer out loud. Avoid rehearsing word for word; instead, master your catalyst, your understanding of ward reality, and your commitment. In Episode Two, we will tackle the dreaded situational question: 'What would you do if you discovered a medication error during night duty?' Download the free interview checklist on books.co.zw, and prepare with confidence."
            },
            layers: [
                {
                    type: 'html-record',
                    x: 0, y: 0, width: 1920, height: 1080,
                    viewport: { width: 1920, height: 1080 },
                    audioSync: true,
                    html: `
                        <div class="screen-container">
                            <header class="section-header">
                                <span class="tag">KEY TAKEAWAYS</span>
                                <h2>Your Episode 1 Action Checklist</h2>
                            </header>

                            <div class="recap-grid">
                                <div class="recap-box">
                                    <div class="step-circle">1</div>
                                    <h3>Identify Your Catalyst</h3>
                                    <p>Find a true, specific medical observation rather than childhood fantasies.</p>
                                </div>
                                <div class="recap-box">
                                    <div class="step-circle">2</div>
                                    <h3>Acknowledge Duty Stress</h3>
                                    <p>Prove to the matrons that you know what ward pressure looks like.</p>
                                </div>
                                <div class="recap-box highlight">
                                    <div class="step-circle">3</div>
                                    <h3>Next Episode</h3>
                                    <p>Handling night shift medication errors and chain of command.</p>
                                </div>
                            </div>

                            <footer class="portal-cta">
                                <div class="cta-left">
                                    <div class="portal-title">FREE STUDY GUIDES & REVISION PAST PAPERS</div>
                                    <div class="portal-url">VISIT: WWW.BOOKS.CO.ZW</div>
                                </div>
                                <div class="channel-tag">SUBSCRIBE & PREPARE</div>
                            </footer>
                        </div>

                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
                            * { margin:0; padding:0; box-sizing:border-box; font-family:'Plus Jakarta Sans',sans-serif; }
                            .screen-container {
                                width:1920px; height:1080px; background:#060e19;
                                color:#fff; padding:60px 80px; display:flex; flex-direction:column; justify-content:space-between;
                            }
                            .tag { color:#38bdf8; font-size:14px; font-weight:800; letter-spacing:2px; }
                            h2 { font-size:42px; font-weight:800; color:#f8fafc; margin-top:6px; }
                            .recap-grid { display:flex; gap:30px; margin-top:20px; }
                            .recap-box {
                                flex:1; background:rgba(15,23,42,0.7); border:1px solid rgba(255,255,255,0.08);
                                border-radius:22px; padding:36px; display:flex; flex-direction:column;
                            }
                            .recap-box.highlight {
                                border-color:rgba(56,189,248,0.4); background:rgba(14,165,233,0.06);
                            }
                            .step-circle {
                                width:48px; height:48px; border-radius:50%; background:rgba(56,189,248,0.2);
                                color:#38bdf8; font-size:22px; font-weight:800; display:flex; align-items:center;
                                justify-content:center; margin-bottom:20px;
                            }
                            h3 { font-size:24px; font-weight:700; color:#f1f5f9; margin-bottom:12px; }
                            p { font-size:16px; color:#94a3b8; line-height:1.5; margin:0; }
                            .portal-cta {
                                background:linear-gradient(90deg, #0284c7 0%, #0369a1 100%);
                                border-radius:18px; padding:28px 40px; display:flex; justify-content:space-between;
                                align-items:center; box-shadow:0 12px 30px rgba(2,132,199,0.3);
                            }
                            .portal-title { font-size:14px; font-weight:800; letter-spacing:1.5px; color:#e0f2fe; margin-bottom:4px; }
                            .portal-url { font-size:28px; font-weight:800; color:#ffffff; }
                            .channel-tag {
                                background:#ffffff; color:#0369a1; padding:12px 28px; border-radius:100px;
                                font-weight:800; font-size:16px;
                            }
                        </style>
                    `
                }
            ]
        }
    ]
};
