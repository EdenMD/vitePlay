// config.test-iconscout.js
// Fast test for IconScout: 3D, SVG Icons, and Lottie (html-record)

// ── KEYS (Insert yours here) ──────────────────────────────────────────
const ICONSCOUT_CLIENT_ID = "‎119061056901559";
const ICONSCOUT_CLIENT_SECRET = "fqxaM0QNN4a3xtwoyO6xyFRNtd1icxBDquvTaJS";

// Helper: Authenticate and get token
async function getAuthToken() {
    const authResponse = await fetch('https://api.iconscout.com/v3/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: ICONSCOUT_CLIENT_ID,
            client_secret: ICONSCOUT_CLIENT_SECRET,
            grant_type: 'client_credentials'
        })
    });
    if (!authResponse.ok) throw new Error(`Auth failed: ${authResponse.status}`);
    const authData = await authResponse.json();
    return authData.access_token;
}

// Helper: Search IconScout and return the asset data
async function fetchAsset(token, query, type) {
    const url = `https://api.iconscout.com/v3/search?query=${encodeURIComponent(query)}&asset=${type}&per_page=1`;
    const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) throw new Error(`Search failed for ${type}: ${response.status}`);
    const data = await response.json();
    
    if (data.response && data.response.items && data.response.items.length > 0) {
        return data.response.items[0];
    }
    return null;
}

module.exports = async () => {
    console.log("[IconScout] Authenticating for Test...");
    const token = await getAuthToken();

    // ── 1. Fetch 3D Asset ──────────────────────────────────────────────
    const item3d = await fetchAsset(token, 'rocket', '3d');
    const url3d = item3d?.assets?.png?.url || item3d?.assets?.svg?.url;
    console.log(`[IconScout] 3D Rocket: ${url3d ? 'FOUND' : 'FAILED'}`);

    // ── 2. Fetch SVG Icon ──────────────────────────────────────────────
    const itemSvg = await fetchAsset(token, 'lightning bolt', 'icon');
    const urlSvg = itemSvg?.assets?.svg?.url;
    console.log(`[IconScout] SVG Bolt: ${urlSvg ? 'FOUND' : 'FAILED'}`);

    // ── 3. Fetch Lottie Animation & its JSON ───────────────────────────
    const itemLottie = await fetchAsset(token, 'loading spinner', 'lottie');
    const urlLottieJson = itemLottie?.assets?.json?.url;
    
    let lottieDataString = "{}";
    if (urlLottieJson) {
        console.log(`[IconScout] Lottie JSON found. Fetching data for HTML injection...`);
        // Fetch the JSON in Node so we don't rely on Puppeteer's network during recording
        const lottieRes = await fetch(urlLottieJson);
        const lottieJson = await lottieRes.json();
        lottieDataString = JSON.stringify(lottieJson); 
    } else {
        console.log(`[IconScout] Lottie: FAILED`);
    }

    return {
        output: {
            title: 'iconscout-master-test',
            format: 'portrait',
            fps: 24,           // Low FPS for speed
            crf: 28,           // Low quality for speed
            preset: 'ultrafast',
        },
        defaults: { transition: 'fade', transitionDuration: 0.2 },
        scenes: [
            // ── SCENE 1: 3D Image Layer ───────────────────────────────
            {
                duration: 3,
                tts: { text: "First, a 3D rocket.", voice: 'am_michael', pauseAfter: 0.2 },
                captions: { style: 'highlight', position: 'bottom', fontSize: 50 },
                layers: [
                    { type: 'gradient', gradientType: 'radial', colors: ['#1a0a2e', '#000'] },
                    ...(url3d ? [{
                        type: 'image', src: url3d, x: 540, y: 600, width: 500, height: 500, fit: 'contain', animation: 'pop'
                    }] : [{ type: 'text', text: '3D FAILED', x: 540, y: 960, fontSize: 60 }]),
                    { type: 'text', text: '3D ASSET', x: 540, y: 1300, fontSize: 40, color: '#fff', align: 'center' }
                ]
            },

            // ── SCENE 2: SVG Icon Layer ───────────────────────────────
            {
                duration: 3,
                tts: { text: "Second, an SVG icon.", voice: 'am_michael', pauseAfter: 0.2 },
                captions: { style: 'highlight', position: 'bottom', fontSize: 50 },
                layers: [
                    { type: 'gradient', gradientType: 'radial', colors: ['#0a1a3a', '#000'] },
                    ...(urlSvg ? [{
                        type: 'image', src: urlSvg, x: 540, y: 600, width: 400, height: 400, fit: 'contain', animation: 'slide-up'
                    }] : [{ type: 'text', text: 'SVG FAILED', x: 540, y: 960, fontSize: 60 }]),
                    { type: 'text', text: 'SVG ICON', x: 540, y: 1200, fontSize: 40, color: '#fff', align: 'center' }
                ]
            },

            // ── SCENE 3: Lottie in html-record ────────────────────────
            {
                duration: 3,
                tts: { text: "And finally, a live Lottie animation.", voice: 'am_michael', pauseAfter: 0.2 },
                captions: { style: 'highlight', position: 'bottom', fontSize: 50 },
                layers: [
                    { type: 'gradient', gradientType: 'linear', colors: ['#0a1a0a', '#000'] },
                    {
                        type: 'html-record',
                        duration: 3,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        waitFor: '#ready',
                        html: `
                            <style>
                                body { margin: 0; background: transparent; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; }
                                #lottie-box { width: 500px; height: 500px; }
                                .label { color: #fff; font-size: 40px; margin-top: 40px; font-weight: bold; }
                            </style>
                            <!-- Load Lottie Web from CDN -->
                            <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>
                            
                            <div id="lottie-box"></div>
                            <div class="label">LOTTIE ANIMATION</div>
                            <div id="ready" style="display:none;">Ready</div>

                            <script>
                                // Inject the Lottie JSON directly from Node to avoid network wait
                                const animData = ${lottieDataString};
                                
                                if (Object.keys(animData).length > 0) {
                                    lottie.loadAnimation({
                                        container: document.getElementById('lottie-box'),
                                        renderer: 'svg',
                                        loop: true,
                                        autoplay: true,
                                        animationData: animData
                                    });
                                } else {
                                    document.getElementById('lottie-box').innerHTML = '<h1 style="color:red">Lottie Failed</h1>';
                                }
                                
                                // Signal to APEX that the animation is loaded
                                setTimeout(() => document.getElementById('ready').style.display = 'block', 100);
                            </script>
                        `
                    }
                ]
            }
        ]
    };
};