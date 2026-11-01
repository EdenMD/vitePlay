// config.procrastination.js
// "Why Procrastination Is a Dumb Idea (and why literally everyone does it
// anyway)" — ~2.5 min, 8 scenes. Voice: am_adam, casual, normal pace.
//
// RUN: VIDEO_CONFIG=config.procrastination.js node engine-ci.js
//
// Same production rules as the last two Tesla configs: ApexCasing only (no
// inline HTML), the winding "road mapper" panZoom camera, every concrete
// noun in the narration gets its own real photo, no background music.
//
// STRUCTURE: compliment (why the deadline rush genuinely feels good) ->
// pivot ("but here's the surprise") -> 3 real disadvantages -> twist (the
// actual psychological reason, backed by real research) -> close/CTA.
//
// FACTS USED (verified via live search):
//   - Dr. Tim Pychyl (Carleton University, Procrastination Research Group):
//     "Procrastination is an emotion regulation problem, not a time
//     management problem" — the central, most-cited finding in modern
//     procrastination research.
//   - Temporal discounting / present bias: people systematically value
//     immediate relief over larger future rewards — well-established in
//     behavioral economics and procrastination research.
//   - Procrastinators show lower academic/work performance on average,
//     even when they self-report feeling fine about their output — a
//     repeated finding across the literature (Sirois, Pychyl, Steel et al.).
//   - Chronic procrastination correlates with higher reported stress,
//     anxiety, and worse physical health over time — consistent finding
//     across multiple studies cited by Sirois and colleagues.
//   - Roughly 80-95% of college students report problematic procrastination;
//     15-20% of adults are classified as chronic procrastinators.

const https  = require('https');
const http   = require('http');

const SERPAPI_KEY  = process.env.SERPAPI_API_KEY     || null;
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || null;
const PEXELS_KEY   = process.env.PEXELS_API_KEY      || null;
const PIXABAY_KEY  = process.env.PIXABAY_API_KEY     || null;

const serpApiResultsCache = new Map();

function getSourceChain(preferred) {
    const chain = [];
    if (preferred) chain.push(preferred);
    if (!chain.includes('serpapi')  && SERPAPI_KEY)  chain.push('serpapi');
    if (!chain.includes('unsplash') && UNSPLASH_KEY) chain.push('unsplash');
    if (!chain.includes('pexels')   && PEXELS_KEY)   chain.push('pexels');
    if (!chain.includes('pixabay')  && PIXABAY_KEY)  chain.push('pixabay');
    if (!chain.includes('picsum'))                    chain.push('picsum');
    return chain;
}

function fetchJSON(url, headers = {}) {
    return new Promise((resolve, reject) => {
        const lib  = url.startsWith('https') ? https : http;
        const opts = { headers: { 'User-Agent': 'APEX-Engine/2.0', ...headers }, timeout: 10000 };
        lib.get(url, opts, res => {
            if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
                res.resume();
                return fetchJSON(new URL(res.headers.location, url).toString(), headers).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('JSON parse error')); } });
        }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
    });
}

function downloadToBase64(fileUrl, headers = {}) {
    return new Promise((resolve, reject) => {
        const opts = { headers: { 'User-Agent': 'APEX-Engine/2.0', ...headers }, timeout: 30000 };
        const makeReq = (url) => {
            const proto = url.startsWith('https') ? https : http;
            proto.get(url, opts, res => {
                if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
                    res.resume();
                    return makeReq(new URL(res.headers.location, url).toString());
                }
                if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
                const ct = res.headers['content-type'] || '';
                if (ct.includes('text/html')) { res.resume(); return reject(new Error('Server returned HTML instead of image')); }
                const chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => {
                    const buf = Buffer.concat(chunks);
                    if (buf.length < 1024) return reject(new Error(`File too small (${buf.length}B)`));
                    resolve({ base64: buf.toString('base64'), contentType: ct.split(';')[0] || 'image/jpeg' });
                });
            }).on('error', reject).on('timeout', () => reject(new Error('Download timeout')));
        };
        makeReq(fileUrl);
    });
}

async function searchSerpApi(query, orientation, imageIndex = 0) {
    if (!SERPAPI_KEY) throw new Error('SERPAPI_API_KEY not set');
    const cacheKey = `${query.toLowerCase().trim()}::${orientation}`;
    let results = serpApiResultsCache.get(cacheKey);
    if (!results) {
        const url = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(query)}&ijn=0&num=100&safe=active&api_key=${SERPAPI_KEY}`;
        const data = await fetchJSON(url, { Authorization: `Bearer ${SERPAPI_KEY}` });
        const all = data?.images_results || [];
        if (!all.length) throw new Error('No image results from SerpAPI');
        const usable = all.filter(r => r.original && !r.original.startsWith('x-raw-image'));
        results = usable.length ? usable : all;
        serpApiResultsCache.set(cacheKey, results);
        console.log(`[Procrastination] SerpAPI cached: ${results.length} result(s) for "${query}"`);
    }
    const pick = results[imageIndex % results.length] || results[0];
    if (!pick?.original) throw new Error('No usable image URL');
    return pick.original;
}

async function searchUnsplash(query, orientation) {
    if (!UNSPLASH_KEY) throw new Error('No UNSPLASH_ACCESS_KEY');
    const data = await fetchJSON(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=${orientation}&content_filter=high&client_id=${UNSPLASH_KEY}`);
    return data?.urls?.regular || data?.urls?.full || null;
}

async function searchPexels(query, orientation) {
    if (!PEXELS_KEY) throw new Error('No PEXELS_API_KEY');
    const orMap = { portrait: 'portrait', landscape: 'landscape', squarish: 'square' };
    const data = await fetchJSON(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=${orMap[orientation] || 'portrait'}&per_page=5&page=1`,
        { Authorization: PEXELS_KEY });
    const photos = data?.photos;
    if (!photos?.length) return null;
    const p = photos[Math.floor(Math.random() * photos.length)];
    return p?.src?.large2x || p?.src?.large || null;
}

async function searchPixabay(query, orientation) {
    if (!PIXABAY_KEY) throw new Error('No PIXABAY_API_KEY');
    const orMap = { portrait: 'vertical', landscape: 'horizontal', squarish: 'square' };
    const data = await fetchJSON(
        `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=${orMap[orientation] || 'vertical'}&safesearch=true&per_page=5&min_width=1080`);
    const hits = data?.hits;
    if (!hits?.length) return null;
    const h = hits[Math.floor(Math.random() * hits.length)];
    return h?.largeImageURL || h?.webformatURL || null;
}

async function getPicsum(orientation) {
    const w = orientation === 'landscape' ? 1920 : 1080;
    const h = orientation === 'landscape' ? 1080 : 1920;
    return `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/${w}/${h}`;
}

async function searchSource(source, query, orientation, imageIndex) {
    switch (source) {
        case 'serpapi':  return searchSerpApi(query, orientation, imageIndex);
        case 'unsplash': return searchUnsplash(query, orientation);
        case 'pexels':   return searchPexels(query, orientation);
        case 'pixabay':  return searchPixabay(query, orientation);
        case 'picsum':   return getPicsum(orientation);
        default:         return null;
    }
}

async function trySerpApiWithFallback(query, orientation, startIndex) {
    const firstUrl = await searchSerpApi(query, orientation, startIndex);
    const results  = serpApiResultsCache.get(`${query.toLowerCase().trim()}::${orientation}`) || [];
    const total    = results.length || 1;
    let lastErr = null;
    for (let attempt = 0; attempt < total; attempt++) {
        const idx = (startIndex + attempt) % total;
        const candidateUrl = attempt === 0 ? firstUrl : results[idx]?.original;
        if (!candidateUrl) continue;
        try {
            if (attempt > 0) console.log(`[Procrastination]  ↻ serpapi retry [#${idx}] for "${query}"`);
            const { base64, contentType } = await downloadToBase64(candidateUrl);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            lastErr = e;
            console.warn(`[Procrastination]  ⚠ serpapi [#${idx}] failed: ${e.message?.slice(0, 60)}`);
        }
    }
    throw lastErr || new Error('No working result in cached set');
}

async function fetchImageRobust(query, opts = {}) {
    const orientation = opts.orientation || 'portrait';
    const imageIndex  = opts.imageIndex || 0;
    for (const source of getSourceChain(opts.source || null)) {
        try {
            if (source === 'serpapi') {
                const uri = await trySerpApiWithFallback(query, orientation, imageIndex);
                console.log(`[Procrastination] ✓ "${query}" #${imageIndex} via serpapi`);
                return uri;
            }
            const imageUrl = await searchSource(source, query, orientation, imageIndex);
            if (!imageUrl) continue;
            const { base64, contentType } = await downloadToBase64(imageUrl);
            console.log(`[Procrastination] ✓ "${query}" via ${source}`);
            return `data:${contentType};base64,${base64}`;
        } catch (e) {
            console.warn(`[Procrastination]  ⚠ ${source} failed for "${query}": ${e.message?.slice(0, 60)}`);
        }
    }
    console.warn(`[Procrastination]  ✗ ALL sources failed for "${query}"`);
    return null;
}

// ── Camera helper (same winding road-mapper as the last two configs) ─────
const SLOT_CENTERS = {
    'top-left': [180, 270.5], 'top-center': [540, 270.5], 'top-right': [900, 270.5],
    'mid-left': [180, 511.5], 'mid-center': [540, 511.5], 'mid-right': [900, 511.5],
    'low-left': [180, 752.5], 'low-center': [540, 752.5], 'low-right': [900, 752.5],
    'bot-left': [180, 993.5], 'bot-center': [540, 993.5], 'bot-right': [900, 993.5],
    'deep-left': [180, 1234.5], 'deep-center': [540, 1234.5], 'deep-right': [900, 1234.5],
    'banner-top': [540, 270.5], 'banner-mid': [540, 752.5], 'banner-low': [540, 1234.5], 'banner-bot': [540, 1475.5],
};
function zoomTo(slot, scale) {
    const c = SLOT_CENTERS[slot] || [540, 960];
    return { toScale: scale, toX: -scale * (c[0] - 540), toY: -scale * (c[1] - 960) };
}
const ZOOM_OUT = { toScale: 1, toX: 0, toY: 0 };

const ROAD_TIERS = ['top', 'mid', 'low', 'bot', 'deep'];
const ROAD_X     = ['left', 'center', 'right'];
function randomRoadSlots(n) {
    const slots = [];
    let lastX = null;
    for (let i = 0; i < n && i < ROAD_TIERS.length; i++) {
        let x;
        do { x = ROAD_X[Math.floor(Math.random() * ROAD_X.length)]; } while (x === lastX);
        lastX = x;
        slots.push(`${ROAD_TIERS[i]}-${x}`);
    }
    return slots;
}

const THEME = {
    paper: '#efe6d3', ink: '#231b12',
    accent: '#b5402c', accent2: '#2c6b5a',
    shadow: 'rgba(20,16,10,0.4)',
};

const casingLayer = (tag, title, commands) => ({
    type: 'html-record', src: `./ApexCasing/paper-sticker-explainer.html?tag=${tag}`,
    audioSync: true, cursor: false, waitFor: '[data-ready="1"]', fps: 30,
    viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
    data: { title, theme: THEME, commands },
});

function roadDown(images, zoomScale = 1.35) {
    const slots = randomRoadSlots(images.length);
    const cmds = [];
    let prevId = null;
    images.forEach((img, i) => {
        const slot = slots[i];
        const photoId = `${img.id}_photo`;
        const zoomId  = `${img.id}_zoom`;
        cmds.push({
            id: photoId, type: 'photo', src: img.src, slot,
            width: img.width || 460, height: img.height || 340,
            caption: img.caption, pinStyle: i % 2 === 0 ? 'tape' : 'pins',
            trigger: prevId
                ? { afterId: prevId, offset: 0.1 }
                : { wordText: img.triggerWord, occurrence: img.occurrence || 1 },
        });
        cmds.push({
            id: zoomId, type: 'panZoom', ...zoomTo(slot, img.scale || zoomScale),
            duration: 1.0, trigger: { afterId: photoId, offset: 0.15 },
        });
        prevId = zoomId;
    });
    cmds.push({ id: `road_out_${images[0]?.id || 'x'}`, type: 'panZoom', ...ZOOM_OUT, duration: 1.1, trigger: { afterId: prevId, offset: 0.6 } });
    return cmds;
}

module.exports = (async () => {

    console.log('[Procrastination] Fetching photos sequentially (short, generic 2-word queries)...');

    const wanted = [
        ['clock',    'alarm clock',     { source: 'serpapi' }],
        ['laptop',   'stressed laptop', { source: 'serpapi' }],
        ['coffee',   'coffee cup',      { source: 'pexels'  }],
        ['grade',    'bad grade',       { source: 'serpapi' }],
        ['study',    'student studying',{ source: 'serpapi' }],
        ['planner',  'calendar planner',{ source: 'pexels'  }],
        ['apps',     'phone apps',      { source: 'pexels'  }],
        ['stressed', 'stressed person', { source: 'serpapi' }],
        ['sleepless','sleepless night', { source: 'serpapi' }],
        ['brain',    'human brain',     { source: 'serpapi' }],
        ['scrolling','phone scrolling', { source: 'pexels'  }],
    ];
    const img = {};
    for (const [key, query, opts] of wanted) img[key] = await fetchImageRobust(query, opts);

    console.log('[Procrastination] Building config...');

    return {
        output: {
            title: 'procrastination-dumb-idea', format: 'portrait', fps: 30, crf: 23, preset: 'medium',
            // No background music, same rule as the last few videos.
        },
        defaults: { voice: 'am_adam', speed: 1.02, transition: 'fade', transitionDuration: 0.3 },

        scenes: [

            // ── Scene 0 — COMPLIMENT 1: the rush ──────────────────────────
            {
                tts: { text: "You know that feeling right before a deadline? Pure adrenaline, laser focus, suddenly you're a machine. Procrastination basically feels like a cheat code. Wait till you hear why it's actually one of the worst things you can do to yourself.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proc-s0', 'THE DEADLINE RUSH', [
                        { id: 'badge', type: 'sticker', text: 'THE CHEAT CODE', slot: 'banner-top', size: 54, color: '#231b12', stroke: '#ffffff', rotate: -1, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'c1', src: img.clock, caption: 'RIGHT BEFORE THE DEADLINE', triggerWord: 'deadline', occurrence: 1, width: 500, height: 340 },
                            { id: 'l1', src: img.laptop, caption: 'SUDDENLY A MACHINE', triggerWord: 'machine', occurrence: 1, width: 500, height: 360 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 1 — COMPLIMENT 2: why it feels real ─────────────────
            {
                transition: 'wipe-left',
                tts: { text: "And it's not just in your head. Pressure genuinely does something to your brain — cortisol spikes, focus narrows, you get this rush of 'I work better like this.' Millions of people have built their entire work style around exactly that feeling.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proc-s1', 'NOT JUST IN YOUR HEAD', [
                        ...roadDown([
                            { id: 'cof', src: img.coffee, caption: 'THE LATE-NIGHT GRIND', triggerWord: 'cortisol', occurrence: 1, width: 480, height: 340 },
                            { id: 'c2', src: img.clock, caption: '"I WORK BETTER LIKE THIS"', triggerWord: 'rush', occurrence: 1, width: 500, height: 340 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 2 — THE PIVOT ───────────────────────────────────────
            {
                transition: 'fade',
                tts: { text: "Except here's the surprise: it doesn't actually work the way it feels like it does. Let me show you what the research actually says.", pauseAfter: 0.3 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proc-s2', 'THE SURPRISE', [
                        { id: 'badge', type: 'sticker', text: 'BUT...', slot: 'banner-top', size: 70, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: 1, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'st1', src: img.study, caption: 'WHAT THE RESEARCH SAYS', triggerWord: 'research', occurrence: 1, width: 460, height: 560 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 3 — REASON 1: quality suffers ───────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "Reason one: the work itself gets worse. Studies on procrastinators consistently show lower grades, lower performance ratings, even when the person swears they 'did fine.' Feeling fine and actually doing well are not the same thing.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proc-s3', 'REASON #1 — THE WORK SUFFERS', [
                        { id: 'num', type: 'sticker', text: '#1', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'gr', src: img.grade, caption: 'LOWER GRADES', triggerWord: 'grades', occurrence: 1, width: 500, height: 340 },
                            { id: 'st2', src: img.study, caption: '"I DID FINE"', triggerWord: 'fine', occurrence: 1, width: 440, height: 540 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 4 — REASON 2: not a time problem ────────────────────
            {
                transition: 'fade',
                tts: { text: "Reason two: more planning tools, more calendar apps, more to-do lists — none of it fixes chronic procrastination, because the problem was never time management in the first place.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proc-s4', 'REASON #2 — NOT A TIME PROBLEM', [
                        { id: 'num', type: 'sticker', text: '#2', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'pl', src: img.planner, caption: 'MORE PLANNING TOOLS', triggerWord: 'calendar', occurrence: 1, width: 500, height: 340 },
                            { id: 'ap', src: img.apps, caption: 'MORE APPS', triggerWord: 'apps', occurrence: 1, width: 460, height: 560 },
                        ]),
                        { id: 's_tag', type: 'sticker', text: 'NEVER A TIME\nPROBLEM', slot: 'banner-low', size: 46, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -1, trigger: { wordText: 'place', occurrence: 1 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#b5402c', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 5 — REASON 3: health cost ───────────────────────────
            {
                transition: 'wipe-left',
                tts: { text: "Reason three: chronic procrastinators report more stress, more anxiety, even worse physical health over time. Pushing everything to the deadline doesn't just cost you a grade. It costs your body.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proc-s5', 'REASON #3 — THE HEALTH COST', [
                        { id: 'num', type: 'sticker', text: '#3', slot: 'top-left', size: 86, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -3, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'sp', src: img.stressed, caption: 'MORE STRESS. MORE ANXIETY.', triggerWord: 'anxiety', occurrence: 1, width: 440, height: 560 },
                            { id: 'sl', src: img.sleepless, caption: 'COSTS YOUR BODY', triggerWord: 'body', occurrence: 1, width: 500, height: 340 },
                        ]),
                    ]),
                ],
            },

            // ── Scene 6 — THE TWIST: emotion regulation ───────────────────
            {
                transition: 'wipe-up',
                tts: { text: "So if it's not laziness and it's not bad time management, what actually is it? Psychologists now call it an emotion regulation problem. Your brain treats a boring, stressful task like an actual threat, and procrastinating is just your brain buying a few minutes of relief from that feeling. You're not managing time badly. You're managing a feeling badly.", pauseAfter: 0.25 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proc-s6', 'THE REAL REASON', [
                        { id: 'num', type: 'sticker', text: '#1', slot: 'top-left', size: 90, color: '#ffffff', stroke: '#b5402c', bg: '#b5402c', rotate: -3, trigger: { atSeconds: 0.1 } },
                        ...roadDown([
                            { id: 'br', src: img.brain, caption: 'AN EMOTION REGULATION PROBLEM', triggerWord: 'emotion', occurrence: 1, width: 500, height: 360 },
                            { id: 'sc', src: img.scrolling, caption: 'A FEW MINUTES OF RELIEF', triggerWord: 'relief', occurrence: 1, width: 460, height: 560 },
                        ]),
                        { id: 's_tag', type: 'sticker', text: 'MANAGING A FEELING,\nNOT A SCHEDULE', slot: 'banner-low', size: 40, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: -1, trigger: { wordText: 'badly', occurrence: 2 } },
                        { id: 'sc_t', type: 'circle', target: 's_tag', color: '#2c6b5a', trigger: { afterId: 's_tag', offset: 0.3 } },
                    ]),
                ],
            },

            // ── Scene 7 — CLOSE + CTA ─────────────────────────────────────
            {
                transition: 'fade',
                tts: { text: "So next time you're pushing something to the last minute, it's not that you're lazy. It's that your brain just really, really wanted to feel better for five minutes. Subscribe for more of what's really happening, when nobody explains it.", pauseAfter: 0.2 },
                captions: false,
                layers: [
                    { type: 'background', color: '#efe6d3' },
                    casingLayer('proc-close', 'FIVE MINUTES OF RELIEF', [
                        { id: 'img_close', type: 'photo', src: img.clock, slot: 'mid-center', width: 760, height: 540, caption: 'THE LAST MINUTE', pinStyle: 'tape', trigger: { wordText: 'minute', occurrence: 1 } },
                        { id: 'pz_close', type: 'panZoom', ...zoomTo('mid-center', 1.2), duration: 1.0, trigger: { afterId: 'img_close', offset: 0.2 } },
                        { id: 'pz_out', type: 'panZoom', ...ZOOM_OUT, duration: 1.0, trigger: { afterId: 'pz_close', offset: 0.6 } },
                        { id: 'cta', type: 'sticker', text: '🔔 SUBSCRIBE', slot: 'banner-bot', size: 68, color: '#ffffff', stroke: '#2c6b5a', bg: '#2c6b5a', rotate: 0, trigger: { wordText: 'subscribe', occurrence: 1 } },
                        { id: 'sc_cta', type: 'circle', target: 'cta', color: '#2c6b5a', trigger: { afterId: 'cta', offset: 0.3 } },
                    ]),
                ],
            },
        ],
    };
})();