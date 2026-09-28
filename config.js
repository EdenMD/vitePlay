// =============================================================================
// APEX V3 — EPISODE 1: "Winning the MoHCC Nurse Intake Interview"
// Educational Masterclass: Zimbabwean Nursing Intake Coaching Series
// Voice: af_heart (Kokoro TTS — Warm, Articulate & Inspiring)
// Audio: Freesound 'corporate success' (2 words)
// Framework: Mayer's Multimedia Principles + Cognitive Progressive Disclosure
// Visual Engine: Apex V3 html-record with dynamic apexframe-driven transitions
// =============================================================================

module.exports = {
    output: {
        width: 1920,
        height: 1080,
        fps: 30,
        filename: 'rgn-interview-ep1-corporate-masterclass.mp4',
        bgMusic: {
            search: 'corporate success',
            volume: 0.14,
            fadeIn: 1.5,
            fadeOut: 2.5
        }
    },

    scenes: [
        // =====================================================================
        // SCENE 1: THE ELIMINATION FILTER & THE "ICEBREAKER" MYTH
        // Analogy: The Interview Panel as an Airport Triage Gate
        // =====================================================================
        {
            name: 'Scene 1 - The Elimination Filter',
            tts: {
                engine: 'kokoro',
                voice: 'af_heart',
                speed: 0.96,
                text: "Welcome to books.co.zw. When you sit before the Ministry of Health interview panel at Parirenyatwa, Sally Mugabe, or Mpilo, their opening question is almost always: 'Why do you want to become a Registered General Nurse?' Most candidates treat this as a gentle icebreaker. In reality, it is a high-speed elimination filter. Think of the interview panel not as friendly conversationalists, but as air traffic controllers testing whether your motivation has the structural wings to survive heavy turbulence."
            },
            layers: [
                {
                    type: 'html-record',
                    x: 0, y: 0, width: 1920, height: 1080,
                    viewport: { width: 1920, height: 1080 },
                    audioSync: true,
                    frameAccurate: true,
                    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        width: 1920px; height: 1080px;
        background: radial-gradient(circle at 20% 20%, #0d1b2a 0%, #08111e 60%, #03070d 100%);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
        color: #ffffff;
        overflow: hidden;
        position: relative;
    }

    /* Ambient animated corporate light glows */
    .glow-1 {
        position: absolute; width: 800px; height: 800px;
        top: -200px; left: -100px;
        background: radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, transparent 70%);
        border-radius: 50%;
        filter: blur(80px);
        animation: floatGlow 8s ease-in-out infinite alternate;
    }
    .glow-2 {
        position: absolute; width: 700px; height: 700px;
        bottom: -150px; right: -100px;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        filter: blur(90px);
        animation: floatGlow 10s ease-in-out infinite alternate-reverse;
    }
    @keyframes floatGlow {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(60px, 40px) scale(1.15); }
    }

    /* Top branding header */
    .header {
        position: absolute; top: 48px; left: 80px; right: 80px;
        display: flex; justify-content: space-between; align-items: center;
        z-index: 10;
    }
    .brand {
        display: flex; align-items: center; gap: 14px;
        background: rgba(255, 255, 255, 0.06);
        padding: 10px 22px; border-radius: 40px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);
    }
    .brand-dot {
        width: 12px; height: 12px; border-radius: 50%; background: #10b981;
        box-shadow: 0 0 16px #10b981;
        animation: pulseDot 2s infinite;
    }
    @keyframes pulseDot {
        0%, 100% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.4); opacity: 0.4; }
    }
    .brand-text { font-size: 15px; font-weight: 700; letter-spacing: 2px; color: #94a3b8; }
    .brand-accent { color: #38bdf8; font-weight: 800; }
    
    .episode-badge {
        font-size: 14px; font-weight: 700; letter-spacing: 1.5px;
        color: #38bdf8; background: rgba(56, 189, 248, 0.12);
        border: 1px solid rgba(56, 189, 248, 0.3);
        padding: 8px 20px; border-radius: 30px;
    }

    /* Main container */
    .stage {
        position: absolute; top: 160px; left: 80px; right: 80px; bottom: 80px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
    }

    /* Hero Question Pill */
    .pill {
        display: inline-flex; align-items: center; gap: 10px;
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(16, 185, 129, 0.2));
        border: 1px solid rgba(56, 189, 248, 0.4);
        padding: 10px 28px; border-radius: 50px;
        font-size: 16px; font-weight: 700; letter-spacing: 2.5px; color: #7dd3fc;
        margin-bottom: 24px;
        transform: translateY(0);
        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .headline {
        font-size: 54px; font-weight: 800; text-align: center; line-height: 1.2;
        max-width: 1400px; margin-bottom: 50px;
        background: linear-gradient(180deg, #ffffff 30%, #94a3b8 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    /* Dynamic Stages that appear & disappear based on speech timing */
    .content-card-deck {
        position: relative; width: 100%; max-width: 1400px; height: 380px;
    }

    .card-stage {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        display: flex; justify-content: center; gap: 40px;
        opacity: 0; pointer-events: none;
        transform: translateY(40px) scale(0.96);
        transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .card-stage.active {
        opacity: 1; pointer-events: auto;
        transform: translateY(0) scale(1);
    }
    .card-stage.exited {
        opacity: 0;
        transform: translateY(-40px) scale(0.96);
    }

    /* Cards */
    .glass-card {
        flex: 1; max-width: 620px;
        background: rgba(15, 23, 42, 0.75);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 24px; padding: 36px 44px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        display: flex; flex-direction: column; justify-content: center;
        position: relative; overflow: hidden;
    }
    .glass-card.danger {
        border-color: rgba(239, 68, 68, 0.4);
        background: linear-gradient(145deg, rgba(239, 68, 68, 0.08), rgba(15, 23, 42, 0.8));
    }
    .glass-card.success {
        border-color: rgba(16, 185, 129, 0.4);
        background: linear-gradient(145deg, rgba(16, 185, 129, 0.08), rgba(15, 23, 42, 0.8));
    }
    .glass-card.primary {
        border-color: rgba(56, 189, 248, 0.4);
        background: linear-gradient(145deg, rgba(56, 189, 248, 0.08), rgba(15, 23, 42, 0.8));
    }

    .card-tag {
        display: inline-block; font-size: 13px; font-weight: 800; letter-spacing: 1.8px;
        padding: 6px 14px; border-radius: 12px; margin-bottom: 16px;
        width: fit-content;
    }
    .card-tag.red { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .card-tag.green { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .card-tag.cyan { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }

    .card-title { font-size: 28px; font-weight: 700; color: #f8fafc; margin-bottom: 14px; line-height: 1.3; }
    .card-desc { font-size: 18px; color: #94a3b8; line-height: 1.6; }

    /* Visual Analogy Graphic */
    .analogy-box {
        display: flex; align-items: center; gap: 30px;
        width: 100%; max-width: 1000px;
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(56, 189, 248, 0.3);
        border-radius: 28px; padding: 40px 50px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    }
    .analogy-icon {
        width: 100px; height: 100px; border-radius: 24px;
        background: linear-gradient(135deg, #0284c7, #0f766e);
        display: flex; align-items: center; justify-content: center;
        font-size: 44px; flex-shrink: 0;
        box-shadow: 0 10px 25px rgba(2, 132, 199, 0.4);
    }
    .analogy-content { flex: 1; }
    .analogy-title { font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 10px; }
    .analogy-text { font-size: 19px; color: #cbd5e1; line-height: 1.6; }

    /* Audio reactive waveform bar at bottom */
    .waveform-bar {
        position: absolute; bottom: 20px; left: 80px; right: 80px; height: 4px;
        background: rgba(255, 255, 255, 0.08); border-radius: 2px;
        overflow: hidden;
    }
    .waveform-progress {
        height: 100%; width: 0%;
        background: linear-gradient(90deg, #38bdf8, #10b981);
        border-radius: 2px;
        transition: width 0.1s linear;
    }
</style>
</head>
<body>
    <div class="glow-1"></div>
    <div class="glow-2"></div>

    <header class="header">
        <div class="brand">
            <span class="brand-dot"></span>
            <span class="brand-text">BOOKS.CO.ZW <span class="brand-accent">ACADEMY</span></span>
        </div>
        <div class="episode-badge">RGN INTAKE COACHING • LESSON 01</div>
    </header>

    <div class="stage">
        <div class="pill">CRITICAL INTERVIEW STRATEGY</div>
        <h1 class="headline">"Why Do You Want to Become a Registered Nurse?"</h1>

        <div class="content-card-deck">
            <!-- Stage 1: The Trap vs The Reality (Seconds 0 - 13) -->
            <div class="card-stage active" id="stage1">
                <div class="glass-card danger">
                    <span class="card-tag red">WHAT 85% OF APPLICANTS DO</span>
                    <h3 class="card-title">The "Gentle Icebreaker" Trap</h3>
                    <p class="card-desc">Treating Question 1 as casual small talk. Giving generic clichés like <em>"I've always loved helping people since I was young."</em></p>
                </div>
                <div class="glass-card success">
                    <span class="card-tag green">HOW THE PANEL ACTUALLY EVALUATES</span>
                    <h3 class="card-title">The First Elimination Filter</h3>
                    <p class="card-desc">Testing emotional stamina, mental preparation, and whether your commitment can endure a 3-year demanding clinical rotation.</p>
                </div>
            </div>

            <!-- Stage 2: The Core Analogy (Seconds 13+) -->
            <div class="card-stage" id="stage2">
                <div class="analogy-box">
                    <div class="analogy-icon">✈️</div>
                    <div class="analogy-content">
                        <span class="card-tag cyan">CORE ANALOGY</span>
                        <div class="analogy-title">The Air Traffic Control Test</div>
                        <div class="analogy-text">
                            The panel is not looking for romantic enthusiasm. They are checking your structural wings. When high-volume patient wards hit heavy turbulence, will you remain grounded or lose altitude?
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="waveform-bar">
        <div class="waveform-progress" id="progressBar"></div>
    </div>

    <script>
        const stage1 = document.getElementById('stage1');
        const stage2 = document.getElementById('stage2');
        const progressBar = document.getElementById('progressBar');

        window.addEventListener('apexframe', (e) => {
            const { t, duration, amplitude } = e.detail;
            
            // Progress bar update
            if (duration && duration > 0) {
                progressBar.style.width = Math.min(100, (t / duration) * 100) + '%';
            }

            // Dynamic card sequencing: Transition at 13 seconds
            if (t >= 13.0) {
                stage1.classList.remove('active');
                stage1.classList.add('exited');
                stage2.classList.add('active');
            } else {
                stage1.classList.add('active');
                stage1.classList.remove('exited');
                stage2.classList.remove('active');
            }
        });
    </script>
</body>
</html>
                    `
                }
            ]
        },

        // =====================================================================
        // SCENE 2: THE FATAL CLICHÉ TRAP & WHY IT DISQUALIFIES
        // Analogy: The "House with No Foundation"
        // =====================================================================
        {
            name: 'Scene 2 - The Fatal Cliché Trap',
            tts: {
                engine: 'kokoro',
                voice: 'af_heart',
                speed: 0.96,
                text: "Here is the fatal mistake. When asked this question, eighty percent of applicants say: 'I have a passion for caring for the sick.' On paper, that sounds noble. But to an experienced nursing tutor or Matron, an answer built only on passion is like a house with a decorated roof and zero concrete foundation. The moment a busy ward is short-staffed or a patient crashes at two in the morning, vague passion collapses into burnout. The panel wants to hear professional judgment, not poetry."
            },
            layers: [
                {
                    type: 'html-record',
                    x: 0, y: 0, width: 1920, height: 1080,
                    viewport: { width: 1920, height: 1080 },
                    audioSync: true,
                    frameAccurate: true,
                    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        width: 1920px; height: 1080px;
        background: radial-gradient(circle at 80% 20%, #111827 0%, #0a0f1d 60%, #030712 100%);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
        color: #ffffff; overflow: hidden; position: relative;
    }
    .glow-bg {
        position: absolute; width: 850px; height: 850px; top: 100px; right: -200px;
        background: radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%);
        filter: blur(100px); border-radius: 50%;
    }
    .header {
        position: absolute; top: 48px; left: 80px; right: 80px;
        display: flex; justify-content: space-between; align-items: center;
    }
    .brand {
        display: flex; align-items: center; gap: 14px;
        background: rgba(255, 255, 255, 0.05); padding: 10px 22px; border-radius: 40px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .brand-dot { width: 12px; height: 12px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 16px #ef4444; }
    .brand-text { font-size: 15px; font-weight: 700; letter-spacing: 2px; color: #94a3b8; }
    .badge {
        font-size: 14px; font-weight: 700; letter-spacing: 1.5px;
        color: #f87171; background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.3); padding: 8px 20px; border-radius: 30px;
    }
    .stage {
        position: absolute; top: 150px; left: 80px; right: 80px; bottom: 80px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .pill {
        display: inline-flex; align-items: center; gap: 10px;
        background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.35);
        padding: 10px 28px; border-radius: 50px; font-size: 16px; font-weight: 700;
        letter-spacing: 2px; color: #fca5a5; margin-bottom: 20px;
    }
    .headline {
        font-size: 52px; font-weight: 800; text-align: center; line-height: 1.25;
        max-width: 1400px; margin-bottom: 45px;
        background: linear-gradient(180deg, #ffffff 40%, #cbd5e1 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .deck { position: relative; width: 100%; max-width: 1350px; height: 380px; }
    
    .panel-view {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        display: flex; justify-content: center; gap: 36px;
        opacity: 0; transform: translateY(35px) scale(0.97);
        transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .panel-view.active { opacity: 1; transform: translateY(0) scale(1); }
    .panel-view.exited { opacity: 0; transform: translateY(-35px) scale(0.97); }

    .card {
        flex: 1; max-width: 620px; border-radius: 24px; padding: 36px 42px;
        background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex; flex-direction: column; justify-content: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .card.weak {
        border-color: rgba(239, 68, 68, 0.4);
        background: linear-gradient(145deg, rgba(239, 68, 68, 0.1), rgba(17, 24, 39, 0.9));
    }
    .card.danger-alert {
        border-color: rgba(245, 158, 11, 0.4);
        background: linear-gradient(145deg, rgba(245, 158, 11, 0.1), rgba(17, 24, 39, 0.9));
    }
    .tag {
        font-size: 13px; font-weight: 800; letter-spacing: 1.5px;
        padding: 6px 14px; border-radius: 12px; margin-bottom: 14px; width: fit-content;
    }
    .tag.red { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.35); }
    .tag.amber { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.35); }
    .tag.cyan { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35); }

    .title { font-size: 26px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
    .body-txt { font-size: 18px; color: #94a3b8; line-height: 1.6; }

    /* The House Analogy Graphic */
    .house-analogy {
        width: 100%; max-width: 1100px;
        background: rgba(17, 24, 39, 0.85); border: 1px solid rgba(245, 158, 11, 0.35);
        border-radius: 28px; padding: 40px 50px; display: flex; align-items: center; gap: 40px;
        box-shadow: 0 25px 50px rgba(0,0,0,0.5);
    }
    .analogy-badge-icon {
        width: 110px; height: 110px; border-radius: 26px;
        background: linear-gradient(135deg, #b45309, #d97706);
        display: flex; align-items: center; justify-content: center; font-size: 48px;
        box-shadow: 0 12px 30px rgba(217, 119, 6, 0.4); flex-shrink: 0;
    }
</style>
</head>
<body>
    <div class="glow-bg"></div>
    <header class="header">
        <div class="brand">
            <span class="brand-dot"></span>
            <span class="brand-text">BOOKS.CO.ZW <span style="color:#ef4444">PITFALL AUDIT</span></span>
        </div>
        <div class="badge">DISQUALIFICATION FACTORS</div>
    </header>

    <div class="stage">
        <div class="pill">CRITICAL PITFALL TO AVOID</div>
        <h1 class="headline">The "Passion-Only" Trap That Disqualifies Candidates</h1>

        <div class="deck">
            <!-- Phase 1: Cliché Breakdown (Seconds 0 - 13.5) -->
            <div class="panel-view active" id="view1">
                <div class="card weak">
                    <span class="tag red">THE CLICHÉ PHRASE</span>
                    <h3 class="title">"I've always had a passion for caring."</h3>
                    <p class="body-txt">Told by 8 out of 10 candidates. Tells the interviewers zero information about your maturity, technical curiosity, or resilience.</p>
                </div>
                <div class="card danger-alert">
                    <span class="tag amber">THE PANEL'S CONCERN</span>
                    <h3 class="title">High Risk of Clinical Burnout</h3>
                    <p class="body-txt">Unanchored emotional passion without disciplined boundaries leads to rapid overwhelm when facing high mortality or severe shortages.</p>
                </div>
            </div>

            <!-- Phase 2: House Analogy (Seconds 13.5+) -->
            <div class="panel-view" id="view2">
                <div class="house-analogy">
                    <div class="analogy-badge-icon">🏛️</div>
                    <div style="flex:1">
                        <span class="tag amber">THE STRUCTURAL ANALOGY</span>
                        <div class="title" style="font-size:28px">The House Without a Foundation</div>
                        <p class="body-txt" style="font-size:19px; color:#e2e8f0">
                            Vague passion is like a beautifully painted roof suspended with no concrete foundation. The moment ward storms hit at 2:00 AM, the roof collapses. The MoHCC panel needs to see your reinforced pillars: <strong>emotional stamina, clinical curiosity, and team accountability.</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const v1 = document.getElementById('view1');
        const v2 = document.getElementById('view2');
        window.addEventListener('apexframe', (e) => {
            const { t } = e.detail;
            if (t >= 13.5) {
                v1.classList.remove('active');
                v1.classList.add('exited');
                v2.classList.add('active');
            } else {
                v1.classList.add('active');
                v1.classList.remove('exited');
                v2.classList.remove('active');
            }
        });
    </script>
</body>
</html>
                    `
                }
            ]
        },

        // =====================================================================
        // SCENE 3: THE 3-PILLAR WINNING FRAMEWORK
        // Analogy: The Medical Stool (Three legs that cannot wobble)
        // =====================================================================
        {
            name: 'Scene 3 - The Three Pillar Formula',
            tts: {
                engine: 'kokoro',
                voice: 'af_heart',
                speed: 0.96,
                text: "So how do you craft a response that earns full marks? At books.co.zw, we teach the Three-Pillar Framework. Think of it as a sturdy three-legged stool: if any leg is missing, the answer tips over. Pillar One is the Specific Spark: a real event or observation that sparked your interest, not a generic childhood dream. Pillar Two is Clinical Realism: demonstrating that you know nursing involves long night shifts, heavy documentation, and patient advocacy. Pillar Three is Long-Term Value: how you plan to contribute to Zimbabwe's public healthcare system over the next five years."
            },
            layers: [
                {
                    type: 'html-record',
                    x: 0, y: 0, width: 1920, height: 1080,
                    viewport: { width: 1920, height: 1080 },
                    audioSync: true,
                    frameAccurate: true,
                    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        width: 1920px; height: 1080px;
        background: radial-gradient(circle at 50% 10%, #0c1a2e 0%, #060e1a 60%, #02060d 100%);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
        color: #ffffff; overflow: hidden; position: relative;
    }
    .glow-teal {
        position: absolute; width: 900px; height: 500px; top: 0; left: 50%;
        transform: translateX(-50%);
        background: radial-gradient(ellipse, rgba(14, 165, 233, 0.15) 0%, transparent 70%);
        filter: blur(90px);
    }
    .header {
        position: absolute; top: 48px; left: 80px; right: 80px;
        display: flex; justify-content: space-between; align-items: center;
    }
    .brand {
        display: flex; align-items: center; gap: 14px;
        background: rgba(255, 255, 255, 0.05); padding: 10px 22px; border-radius: 40px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .brand-dot { width: 12px; height: 12px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 16px #38bdf8; }
    .brand-text { font-size: 15px; font-weight: 700; letter-spacing: 2px; color: #94a3b8; }
    .badge {
        font-size: 14px; font-weight: 700; letter-spacing: 1.5px;
        color: #38bdf8; background: rgba(56, 189, 248, 0.12);
        border: 1px solid rgba(56, 189, 248, 0.3); padding: 8px 20px; border-radius: 30px;
    }
    .stage {
        position: absolute; top: 140px; left: 80px; right: 80px; bottom: 60px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .pill {
        display: inline-flex; align-items: center; gap: 10px;
        background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.35);
        padding: 10px 28px; border-radius: 50px; font-size: 16px; font-weight: 700;
        letter-spacing: 2px; color: #7dd3fc; margin-bottom: 16px;
    }
    .headline {
        font-size: 48px; font-weight: 800; text-align: center; line-height: 1.2;
        margin-bottom: 40px;
        background: linear-gradient(180deg, #ffffff 40%, #94a3b8 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    /* Pillars Grid: Staggered Appearance driven by speech timing! */
    .pillars-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px;
        width: 100%; max-width: 1500px;
    }
    .pillar-card {
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 24px; padding: 36px 30px;
        display: flex; flex-direction: column;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        opacity: 0.15; transform: translateY(30px) scale(0.95);
        transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative; overflow: hidden;
    }
    .pillar-card.active {
        opacity: 1; transform: translateY(0) scale(1);
        border-color: rgba(56, 189, 248, 0.5);
        box-shadow: 0 25px 50px rgba(2, 132, 199, 0.25);
    }
    .pillar-card.highlight {
        border-color: #38bdf8;
        transform: translateY(-8px) scale(1.03);
    }

    .pillar-num {
        font-size: 14px; font-weight: 800; letter-spacing: 2px;
        padding: 6px 14px; border-radius: 10px; width: fit-content;
        margin-bottom: 20px;
    }
    .p1-badge { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .p2-badge { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .p3-badge { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }

    .pillar-title { font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 12px; line-height: 1.3; }
    .pillar-analogy { font-size: 14px; font-weight: 700; color: #38bdf8; margin-bottom: 14px; letter-spacing: 1px; }
    .pillar-desc { font-size: 16px; color: #94a3b8; line-height: 1.6; }

    /* Live audio indicator at bottom */
    .audio-cue {
        margin-top: 36px; display: flex; align-items: center; gap: 12px;
        font-size: 14px; font-weight: 700; letter-spacing: 1.5px; color: #64748b;
    }
    .signal-bars { display: flex; gap: 4px; align-items: center; height: 16px; }
    .sbar { width: 3px; height: 6px; background: #38bdf8; border-radius: 2px; }
</style>
</head>
<body>
    <div class="glow-teal"></div>
    <header class="header">
        <div class="brand">
            <span class="brand-dot"></span>
            <span class="brand-text">BOOKS.CO.ZW <span style="color:#38bdf8">BLUEPRINT</span></span>
        </div>
        <div class="badge">THE 3-PILLAR FORMULA</div>
    </header>

    <div class="stage">
        <div class="pill">THE WINNING ANSWER ARCHITECTURE</div>
        <h1 class="headline">The Three-Pillar Framework for Maximum Marks</h1>

        <div class="pillars-grid">
            <!-- Pillar 1: Specific Spark (Starts around ~7s) -->
            <div class="pillar-card" id="card1">
                <span class="pillar-num p1-badge">PILLAR 01</span>
                <div class="pillar-title">The Specific Spark</div>
                <div class="pillar-analogy">NOT: "Childhood Dream"</div>
                <p class="pillar-desc">A concrete event or medical observation that prompted your disciplined decision to pursue professional nursing science.</p>
            </div>

            <!-- Pillar 2: Clinical Realism (Starts around ~14s) -->
            <div class="pillar-card" id="card2">
                <span class="pillar-num p2-badge">PILLAR 02</span>
                <div class="pillar-title">Clinical Realism</div>
                <div class="pillar-analogy">NOT: "Romanticized Care"</div>
                <p class="pillar-desc">Demonstrating clear awareness of night shifts, vital charting, infection control, and emotional resilience under pressure.</p>
            </div>

            <!-- Pillar 3: Long-Term Value (Starts around ~21s) -->
            <div class="pillar-card" id="card3">
                <span class="pillar-num p3-badge">PILLAR 03</span>
                <div class="pillar-title">MoHCC Contribution</div>
                <div class="pillar-analogy">NOT: "A Stepping Stone"</div>
                <p class="pillar-desc">Articulating your 5-year dedication to serving public wards, community health clinics, or specialized maternal care in Zimbabwe.</p>
            </div>
        </div>

        <div class="audio-cue">
            <div class="signal-bars">
                <div class="sbar" id="b1"></div><div class="sbar" id="b2"></div><div class="sbar" id="b3"></div><div class="sbar" id="b4"></div>
            </div>
            <span>FRAMEWORK STAGES REVEAL SEQUENTIALLY</span>
        </div>
    </div>

    <script>
        const c1 = document.getElementById('card1');
        const c2 = document.getElementById('card2');
        const c3 = document.getElementById('card3');
        const b1 = document.getElementById('b1');
        const b2 = document.getElementById('b2');
        const b3 = document.getElementById('b3');
        const b4 = document.getElementById('b4');

        window.addEventListener('apexframe', (e) => {
            const { t, amplitude } = e.detail;

            // Audio reactive signal bars
            if (amplitude) {
                b1.style.height = (4 + amplitude * 18) + 'px';
                b2.style.height = (4 + amplitude * 24) + 'px';
                b3.style.height = (4 + amplitude * 16) + 'px';
                b4.style.height = (4 + amplitude * 20) + 'px';
            }

            // Staggered progressive disclosure:
            // 0 - 6s: All dim
            // 7s+: Pillar 1 lights up
            // 14s+: Pillar 2 lights up
            // 21s+: Pillar 3 lights up
            if (t >= 7.0)  c1.classList.add('active'); else c1.classList.remove('active');
            if (t >= 14.0) c2.classList.add('active'); else c2.classList.remove('active');
            if (t >= 21.0) c3.classList.add('active'); else c3.classList.remove('active');

            // Highlight current talking point
            if (t >= 7.0 && t < 14.0)  c1.classList.add('highlight'); else c1.classList.remove('highlight');
            if (t >= 14.0 && t < 21.0) c2.classList.add('highlight'); else c2.classList.remove('highlight');
            if (t >= 21.0)             c3.classList.add('highlight'); else c3.classList.remove('highlight');
        });
    </script>
</body>
</html>
                    `
                }
            ]
        },

        // =====================================================================
        // SCENE 4: WORD-FOR-WORD BENCHMARK MODEL ANSWER
        // Live Sentence Progression with Audio-Reactive Highlighting
        // =====================================================================
        {
            name: 'Scene 4 - The Benchmark Model Answer',
            tts: {
                engine: 'kokoro',
                voice: 'af_heart',
                speed: 0.94,
                text: "Now, let us listen to a top-tier model answer you can adapt in your own voice. Notice how each phrase matches our formula: 'My decision to pursue Registered General Nursing crystallized during a family member's hospital admission. I observed that while doctors diagnose, nurses are the vital engine maintaining patient stability, administering medication, and offering calm reassurance in crises. I am eager to undertake the intensive three-year clinical training because I have the emotional stamina and discipline required for night shifts, and my goal is to serve with dedication in our public provincial hospitals.'"
            },
            layers: [
                {
                    type: 'html-record',
                    x: 0, y: 0, width: 1920, height: 1080,
                    viewport: { width: 1920, height: 1080 },
                    audioSync: true,
                    frameAccurate: true,
                    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        width: 1920px; height: 1080px;
        background: radial-gradient(circle at 50% 50%, #0a1727 0%, #050b14 70%, #020509 100%);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
        color: #ffffff; overflow: hidden; position: relative;
    }
    .header {
        position: absolute; top: 48px; left: 80px; right: 80px;
        display: flex; justify-content: space-between; align-items: center;
    }
    .brand {
        display: flex; align-items: center; gap: 14px;
        background: rgba(255, 255, 255, 0.05); padding: 10px 22px; border-radius: 40px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .brand-dot { width: 12px; height: 12px; border-radius: 50%; background: #10b981; box-shadow: 0 0 16px #10b981; }
    .brand-text { font-size: 15px; font-weight: 700; letter-spacing: 2px; color: #94a3b8; }
    .badge {
        font-size: 14px; font-weight: 700; letter-spacing: 1.5px;
        color: #34d399; background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.3); padding: 8px 20px; border-radius: 30px;
    }
    .stage {
        position: absolute; top: 130px; left: 80px; right: 80px; bottom: 50px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .pill {
        display: inline-flex; align-items: center; gap: 10px;
        background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35);
        padding: 8px 26px; border-radius: 50px; font-size: 15px; font-weight: 700;
        letter-spacing: 2px; color: #6ee7b7; margin-bottom: 20px;
    }
    .headline {
        font-size: 42px; font-weight: 800; text-align: center; margin-bottom: 30px;
        background: linear-gradient(180deg, #ffffff 40%, #94a3b8 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    /* Scripted Model Answer Display with dynamic stepped card reveals */
    .answer-container {
        width: 100%; max-width: 1300px;
        display: flex; flex-direction: column; gap: 18px;
    }
    .phrase-card {
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 18px; padding: 22px 32px;
        display: flex; align-items: center; gap: 24px;
        opacity: 0.2; transform: translateX(-20px);
        transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .phrase-card.active {
        opacity: 1; transform: translateX(0);
        background: rgba(15, 23, 42, 0.95);
        border-color: rgba(56, 189, 248, 0.5);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .phrase-card.highlight {
        border-color: #10b981;
        background: linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.95));
        transform: scale(1.02);
    }

    .phrase-badge {
        font-size: 12px; font-weight: 800; letter-spacing: 1.5px;
        padding: 6px 14px; border-radius: 10px; flex-shrink: 0;
    }
    .b-spark { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); }
    .b-engine { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
    .b-commit { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }

    .phrase-text { font-size: 20px; line-height: 1.5; color: #e2e8f0; font-style: italic; }
    .phrase-text strong { color: #ffffff; font-style: normal; }
</style>
</head>
<body>
    <header class="header">
        <div class="brand">
            <span class="brand-dot"></span>
            <span class="brand-text">BOOKS.CO.ZW <span style="color:#10b981">MODEL REPOSITORY</span></span>
        </div>
        <div class="badge">95TH PERCENTILE BENCHMARK</div>
    </header>

    <div class="stage">
        <div class="pill">GOLD STANDARD TRANSCRIPT</div>
        <h1 class="headline">How a Winning Candidate Answers Question #01</h1>

        <div class="answer-container">
            <!-- Phrase 1: The Spark (Starts around ~7s) -->
            <div class="phrase-card" id="p1">
                <span class="phrase-badge b-spark">PART 1: SPARK</span>
                <div class="phrase-text">
                    "My decision to pursue Registered General Nursing crystallized during a family member's admission. <strong>I saw the decisive impact of clinical vigilance firsthand.</strong>"
                </div>
            </div>

            <!-- Phrase 2: The Vital Engine / Realism (Starts around ~14s) -->
            <div class="phrase-card" id="p2">
                <span class="phrase-badge b-engine">PART 2: REALISM</span>
                <div class="phrase-text">
                    "I observed that while doctors diagnose, <strong>nurses are the vital engine</strong> maintaining stability, administering medication, and providing calm leadership in critical hours."
                </div>
            </div>

            <!-- Phrase 3: Stamina & Public Service (Starts around ~22s) -->
            <div class="phrase-card" id="p3">
                <span class="phrase-badge b-commit">PART 3: COMMITMENT</span>
                <div class="phrase-text">
                    "I have the emotional stamina and discipline required for night shifts, and <strong>my ambition is to serve with dedication in our public provincial hospitals.</strong>"
                </div>
            </div>
        </div>
    </div>

    <script>
        const p1 = document.getElementById('p1');
        const p2 = document.getElementById('p2');
        const p3 = document.getElementById('p3');

        window.addEventListener('apexframe', (e) => {
            const { t } = e.detail;

            // Sequential entry based on narration timing
            if (t >= 7.0)  p1.classList.add('active'); else p1.classList.remove('active');
            if (t >= 14.5) p2.classList.add('active'); else p2.classList.remove('active');
            if (t >= 22.5) p3.classList.add('active'); else p3.classList.remove('active');

            // Active phrase highlighting
            if (t >= 7.0 && t < 14.5)  p1.classList.add('highlight'); else p1.classList.remove('highlight');
            if (t >= 14.5 && t < 22.5) p2.classList.add('highlight'); else p2.classList.remove('highlight');
            if (t >= 22.5)             p3.classList.add('highlight'); else p3.classList.remove('highlight');
        });
    </script>
</body>
</html>
                    `
                }
            ]
        },

        // =====================================================================
        // SCENE 5: ACTIONABLE SUMMARY & NEXT LESSON TEASER
        // =====================================================================
        {
            name: 'Scene 5 - Actionable Recap & Next Lesson',
            tts: {
                engine: 'kokoro',
                voice: 'af_heart',
                speed: 0.96,
                text: "Remember: never answer with vague passion alone. Anchor your response in a specific spark, clinical realism, and genuine dedication to Zimbabwe's public healthcare. In our next episode, we tackle the most dreaded situational scenario: 'How do you handle a short-staffed ward with three critical emergencies at once?' Visit books.co.zw for full downloadable interview guides and mock question drills. See you in Episode Two."
            },
            layers: [
                {
                    type: 'html-record',
                    x: 0, y: 0, width: 1920, height: 1080,
                    viewport: { width: 1920, height: 1080 },
                    audioSync: true,
                    frameAccurate: true,
                    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
        width: 1920px; height: 1080px;
        background: radial-gradient(circle at 50% 50%, #0a1424 0%, #050a12 70%, #010306 100%);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
        color: #ffffff; overflow: hidden; position: relative;
    }
    .header {
        position: absolute; top: 48px; left: 80px; right: 80px;
        display: flex; justify-content: space-between; align-items: center;
    }
    .brand {
        display: flex; align-items: center; gap: 14px;
        background: rgba(255, 255, 255, 0.05); padding: 10px 22px; border-radius: 40px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .brand-dot { width: 12px; height: 12px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 16px #38bdf8; }
    .brand-text { font-size: 15px; font-weight: 700; letter-spacing: 2px; color: #94a3b8; }
    .badge {
        font-size: 14px; font-weight: 700; letter-spacing: 1.5px;
        color: #38bdf8; background: rgba(56, 189, 248, 0.12);
        border: 1px solid rgba(56, 189, 248, 0.3); padding: 8px 20px; border-radius: 30px;
    }
    .stage {
        position: absolute; top: 140px; left: 80px; right: 80px; bottom: 60px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .deck { position: relative; width: 100%; max-width: 1250px; height: 420px; }
    .card-panel {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        opacity: 0; transform: translateY(30px) scale(0.97);
        transition: all 0.65s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .card-panel.active { opacity: 1; transform: translateY(0) scale(1); }
    .card-panel.exited { opacity: 0; transform: translateY(-30px) scale(0.97); }

    /* Summary Checklist */
    .summary-box {
        width: 100%; max-width: 1000px;
        background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(56, 189, 248, 0.35);
        border-radius: 28px; padding: 40px 50px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }
    .summary-title { font-size: 32px; font-weight: 800; color: #ffffff; margin-bottom: 24px; text-align: center; }
    .checklist { display: flex; flex-direction: column; gap: 16px; }
    .check-item {
        display: flex; align-items: center; gap: 18px;
        background: rgba(255, 255, 255, 0.04); padding: 14px 20px; border-radius: 14px;
        font-size: 19px; color: #e2e8f0; font-weight: 600;
    }
    .check-icon {
        width: 28px; height: 28px; border-radius: 50%; background: #10b981;
        display: flex; align-items: center; justify-content: center; font-size: 15px; color: #000;
        font-weight: 900; flex-shrink: 0;
    }

    /* Episode 2 Teaser Box */
    .teaser-box {
        width: 100%; max-width: 1050px;
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9));
        border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 28px; padding: 44px 50px;
        display: flex; align-items: center; gap: 36px;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
    }
    .teaser-icon {
        width: 110px; height: 110px; border-radius: 26px;
        background: linear-gradient(135deg, #059669, #10b981);
        display: flex; align-items: center; justify-content: center; font-size: 48px;
        box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4); flex-shrink: 0;
    }
    .cta-badge {
        display: inline-block; font-size: 13px; font-weight: 800; letter-spacing: 2px;
        background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.35);
        padding: 6px 14px; border-radius: 10px; margin-bottom: 12px;
    }
</style>
</head>
<body>
    <header class="header">
        <div class="brand">
            <span class="brand-dot"></span>
            <span class="brand-text">BOOKS.CO.ZW <span style="color:#38bdf8">PORTAL</span></span>
        </div>
        <div class="badge">EPISODE 01 COMPLETE</div>
    </header>

    <div class="stage">
        <div class="deck">
            <!-- Phase 1: Summary Checklist (Seconds 0 - 10) -->
            <div class="card-panel active" id="pRecap">
                <div class="summary-box">
                    <div class="summary-title">Key Takeaways for Question #01</div>
                    <div class="checklist">
                        <div class="check-item"><span class="check-icon">✓</span> Ditch generic clichés — passion alone is disqualifying</div>
                        <div class="check-item"><span class="check-icon">✓</span> Anchor your motivation in a concrete, observable spark</div>
                        <div class="check-item"><span class="check-icon">✓</span> Prove clinical realism: night shifts, vitals, stamina, and team ethics</div>
                        <div class="check-item"><span class="check-icon">✓</span> State long-term dedication to Zimbabwe's public healthcare system</div>
                    </div>
                </div>
            </div>

            <!-- Phase 2: Episode 2 Teaser (Seconds 10+) -->
            <div class="card-panel" id="pTeaser">
                <div class="teaser-box">
                    <div class="teaser-icon">🚨</div>
                    <div style="flex:1">
                        <span class="cta-badge">COMING UP NEXT • EPISODE 02</span>
                        <h2 style="font-size:32px; font-weight:800; color:#ffffff; margin-bottom:12px">
                            The Emergency Ward Triage Drill
                        </h2>
                        <p style="font-size:18px; color:#94a3b8; line-height:1.6; margin-bottom:16px">
                            <em>"How do you handle a short-staffed ward with three critical patient emergencies at once?"</em> Master the ABC prioritization formula that Ministry panels use to separate leaders from followers.
                        </p>
                        <div style="font-size:16px; font-weight:700; color:#38bdf8">
                            Visit books.co.zw to access the full question bank & mock guides.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const pRecap = document.getElementById('pRecap');
        const pTeaser = document.getElementById('pTeaser');
        window.addEventListener('apexframe', (e) => {
            const { t } = e.detail;
            if (t >= 10.0) {
                pRecap.classList.remove('active');
                pRecap.classList.add('exited');
                pTeaser.classList.add('active');
            } else {
                pRecap.classList.add('active');
                pRecap.classList.remove('exited');
                pTeaser.classList.remove('active');
            }
        });
    </script>
</body>
</html>
                    `
                }
            ]
        }
    ]
};
