// config.test-iconscout.js
// Test: IconScout 3D (PNG), icon (PNG), Lottie (JSON inlined into html-record).
// Assets are downloaded in Node during config resolution, saved under
// ./assets/iconscout/, then used as local files.
//
// Run: ICONSCOUT_CLIENT_ID=xxx ICONSCOUT_CLIENT_SECRET=yyy \
//      VIDEO_CONFIG=config.test-iconscout.js node engine-ci.js
// In CI: add both as repo secrets and pass them via env. Don't hardcode keys.
//
// Auth per IconScout v3: search + item details need header `Client-ID`;
// downloads (POST /v3/items/{uuid}/api-download?format=...) also need
// header `Client-Secret`. There is no OAuth token step.
// Raw responses are logged ([IconScout] RAW ...) so you can see the real
// shapes in the CI log if a field name differs from what's guessed here.

const fs   = require('fs');
const path = require('path');

const CLIENT_ID     = (process.env.ICONSCOUT_CLIENT_ID     || '119061056901559').replace(/[^\x20-\x7E]/g, '').trim();
const CLIENT_SECRET = (process.env.ICONSCOUT_CLIENT_SECRET || 'fqxaM0QNN4a3xtwoyO6xyFRNtd1icxBDquvTaJS').replace(/[^\x20-\x7E]/g, '').trim();
const API  = 'https://api.iconscout.com/v3';
const DIR  = path.join(process.cwd(), 'assets', 'iconscout');

const authHeaders = (withSecret) => ({
    'Client-ID': CLIENT_ID,
    ...(withSecret ? { 'Client-Secret': CLIENT_SECRET } : {}),
});

// Pull the first item out of whatever shape the search returns
async function search(query, asset) {
    const url = `${API}/search?query=${encodeURIComponent(query)}&product_type=item&asset=${asset}&per_page=1&page=1`;
    const res = await fetch(url, { headers: authHeaders(false) });
    const txt = await res.text();
    console.log(`[IconScout] RAW search ${asset} (${res.status}): ${txt.slice(0, 400)}`);
    if (!res.ok) throw new Error(`search ${asset} ${res.status}`);
    const items = JSON.parse(txt)?.response?.items;
    const list  = Array.isArray(items) ? items : (items?.data || items?.items || []);
    return list[0] || null;
}

// Ask for a signed download, return a URL string
async function getDownloadUrl(uuid, format) {
    const res = await fetch(`${API}/items/${uuid}/api-download?format=${format}`, {
        method: 'POST',
        headers: authHeaders(true),
    });
    const txt = await res.text();
    console.log(`[IconScout] RAW download ${format} (${res.status}): ${txt.slice(0, 400)}`);
    if (!res.ok) throw new Error(`download ${format} ${res.status}`);
    const d = JSON.parse(txt)?.response?.download || {};
    const direct = d.url || d.download_url || d.signed_url || d.link;
    if (direct) return direct;
    // Fallback: first http(s) string anywhere in the download object
    const found = JSON.stringify(d).match(/https?:\/\/[^"\\]+/);
    return found ? found[0] : null;
}

async function fetchAndSave(query, asset, format, filename) {
    try {
        const item = await search(query, asset);
        if (!item?.uuid) { console.log(`[IconScout] ${query}: no result`); return null; }
        const dl = await getDownloadUrl(item.uuid, format);
        if (!dl) { console.log(`[IconScout] ${query}: no download url`); return null; }
        const res = await fetch(dl);
        if (!res.ok) throw new Error(`file fetch ${res.status}`);
        fs.mkdirSync(DIR, { recursive: true });
        const out = path.join(DIR, filename);
        fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
        console.log(`[IconScout] ${query}: saved ${out}`);
        return out;
    } catch (e) {
        console.log(`[IconScout] ${query}: FAILED — ${e.message}`);
        return null;
    }
}

module.exports = async () => {
    if (!CLIENT_ID) console.log('[IconScout] ICONSCOUT_CLIENT_ID missing — every fetch will fail');

    const png3d   = await fetchAndSave('rocket',         '3d',     'png',  'rocket3d.png');
    const pngIcon = await fetchAndSave('lightning bolt', 'icon',   'png',  'bolt.png');
    const lottieF = await fetchAndSave('loading spinner','lottie', 'json', 'spinner.json');

    let lottieJson = '{}';
    if (lottieF) { try { lottieJson = fs.readFileSync(lottieF, 'utf8'); JSON.parse(lottieJson); } catch (_) { lottieJson = '{}'; } }

    const rel = (p) => './' + path.relative(process.cwd(), p).split(path.sep).join('/');
    const fail = (label) => ({ type: 'text', text: label + ' FAILED', x: 540, y: 900, fontSize: 60, color: '#ff5555', align: 'center' });

    return {
        output: { title: 'iconscout-test', format: 'portrait', fps: 24, crf: 28, preset: 'ultrafast' },
        defaults: { voice: 'am_adam', transition: 'fade', transitionDuration: 0.2 },
        scenes: [
            {
                tts: { text: 'First, a three D rocket.', pauseAfter: 0.3 },
                captions: { style: 'highlight', position: 'bottom', fontSize: 50 },
                layers: [
                    { type: 'gradient', gradientType: 'radial', colors: ['#1a0a2e', '#000'] },
                    png3d ? { type: 'image', src: rel(png3d), x: 290, y: 650, width: 500, height: 500, fit: 'contain', animation: 'pop' } : fail('3D'),
                    { type: 'text', text: '3D ASSET', x: 540, y: 1300, fontSize: 40, color: '#ffffff', align: 'center' },
                ],
            },
            {
                tts: { text: 'Second, an icon.', pauseAfter: 0.3 },
                captions: { style: 'highlight', position: 'bottom', fontSize: 50 },
                layers: [
                    { type: 'gradient', gradientType: 'radial', colors: ['#0a1a3a', '#000'] },
                    pngIcon ? { type: 'image', src: rel(pngIcon), x: 340, y: 700, width: 400, height: 400, fit: 'contain', animation: 'pop' } : fail('ICON'),
                    { type: 'text', text: 'ICON', x: 540, y: 1250, fontSize: 40, color: '#ffffff', align: 'center' },
                ],
            },
            {
                tts: { text: 'And finally, a live Lottie animation.', pauseAfter: 0.3 },
                captions: { style: 'highlight', position: 'bottom', fontSize: 50 },
                layers: [
                    { type: 'gradient', gradientType: 'linear', colors: ['#0a1a0a', '#000'] },
                    {
                        type: 'html-record',
                        duration: 4,
                        viewport: { width: 1080, height: 1920 },
                        x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                        waitFor: '#ready',
                        html: `
                            <style>
                                body { margin:0; background:transparent; display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; }
                                #box { width:500px; height:500px; }
                                .label { color:#fff; font-size:40px; margin-top:40px; font-weight:bold; }
                            </style>
                            <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"></script>
                            <div id="box"></div>
                            <div class="label">LOTTIE</div>
                            <div id="ready" style="display:none">ok</div>
                            <script>
                                const anim = ${lottieJson};
                                if (anim && anim.layers) {
                                    lottie.loadAnimation({ container: document.getElementById('box'), renderer: 'svg', loop: true, autoplay: true, animationData: anim });
                                } else {
                                    document.getElementById('box').innerHTML = '<h1 style="color:#f55">Lottie FAILED</h1>';
                                }
                                document.getElementById('ready').style.display = 'block';
                            </script>
                        `,
                    },
                ],
            },
        ],
    };
};
