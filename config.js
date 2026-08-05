'use strict';
/**
 * src/apex-casing-media.js — base64 media fetcher for ApexCasing configs
 * ─────────────────────────────────────────────────────────────────────────
 * html-record layers only ever see whatever plain JSON you put in
 * `layer.data` (see documentations/DataInjection.md) — the engine does
 * NOT recurse into it looking for `stock-image`/`giphy` layers the way it
 * does for `scene.layers` (src/image-api.js's resolveStockImages and
 * src/giphy-api.js's resolveGiphyLayers only walk the top-level layers
 * array). So an ApexCasing template can't just write `{ query: '...' }`
 * into its command data and expect an image to appear.
 *
 * This module closes that gap: call it from your CONFIG file (configs can
 * be async functions — see documentations/dynamicconfig.md, which run
 * once before rendering starts and have full access to process.env, i.e.
 * the same GitHub Actions secrets the rest of the engine uses) to fetch an
 * image/gif/video and get back a `data:` URI you can embed directly into
 * an ApexCasing `data.commands` entry (e.g. a `photo` command's `src`).
 * Data URIs need no further network access once the HTML is loaded, so
 * Puppeteer never has to hit serpapi.com/pexels.com/giphy.com itself
 * during the html-record recording pass — only your config's Node process
 * does, up front, over the same npm/pip-style outbound network the rest
 * of Phase 0-0.5 already uses.
 *
 * FALLBACK CHAIN — deliberately mirrors src/image-api.js exactly (same
 * priority order, same endpoints/params, same env vars), so "an image for
 * this query" behaves identically whether it ends up in a stock-image
 * canvas layer or a base64 string handed to an ApexCasing template:
 *   serpapi (SERPAPI_API_KEY) → unsplash (UNSPLASH_ACCESS_KEY) →
 *   pexels (PEXELS_API_KEY) → pixabay (PIXABAY_API_KEY) → picsum (no key)
 * `downloadFile`/`fetchJSON` are reused directly from image-api.js's
 * public exports rather than reimplemented, so retry/redirect/HTML-error-
 * page handling stays identical to the rest of the engine too.
 *
 * USAGE (inside an async config function):
 *   const { fetchStockImageBase64, fetchGiphyBase64 } = require('./src/apex-casing-media');
 *   const cockpit = await fetchStockImageBase64({ query: 'B-2 Spirit cockpit', orientation: 'portrait' });
 *   // cockpit => { dataUri: 'data:image/jpeg;base64,...', mime, source: 'serpapi' }
 *
 *   const explosion = await fetchGiphyBase64({ query: 'explosion', preferMp4: true });
 *   // explosion => { dataUri: 'data:video/mp4;base64,...', mime, source: 'giphy', mediaType: 'video' }
 *
 * Results are cached on disk under work/apex-casing-media/ keyed by a hash
 * of the request, same spirit as the engine's other caches — re-running
 * the same config doesn't re-download or re-spend API quota.
 */

const path   = require('path');
const fs     = require('fs');
const fse    = require('fs-extra');
const https  = require('https');
const http   = require('http');
const crypto = require('crypto');
const { downloadFile, fetchJSON } = require('./image-api');

const SERPAPI_KEY   = process.env.SERPAPI_API_KEY    || null;
const UNSPLASH_KEY  = process.env.UNSPLASH_ACCESS_KEY || null;
const PEXELS_KEY    = process.env.PEXELS_API_KEY      || null;
const PIXABAY_KEY   = process.env.PIXABAY_API_KEY     || null;
const GIPHY_KEY     = process.env.GIPHY_API_KEY        || null;

const CACHE_DIR = path.join(process.cwd(), 'work', 'apex-casing-media');
fse.ensureDirSync(CACHE_DIR);

const MIME_BY_EXT = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
    gif: 'image/gif', mp4: 'video/mp4',
};

function extFromUrl(url) {
    const clean = url.split('?')[0].split('#')[0];
    const ext   = clean.split('.').pop().toLowerCase();
    return MIME_BY_EXT[ext] ? ext : 'jpg';
}

function toDataUri(filePath, mime) {
    const buf = fs.readFileSync(filePath);
    return `data:${mime};base64,${buf.toString('base64')}`;
}

// ── Same priority chain as src/image-api.js's getSourceChain() ────────────
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

const serpApiResultsCache = new Map();

async function searchSerpApi(query, orientation, imageIndex = 0) {
    if (!SERPAPI_KEY) throw new Error('SERPAPI_API_KEY secret not set — skipping serpapi');
    const cacheKey = `${query.toLowerCase().trim()}::${orientation}`;
    let results = serpApiResultsCache.get(cacheKey);
    if (!results) {
        const url = `https://serpapi.com/search.json?engine=google_images` +
            `&q=${encodeURIComponent(query)}&ijn=0&num=100&safe=active&api_key=${SERPAPI_KEY}`;
        const data = await fetchJSON(url, { 'Authorization': `Bearer ${SERPAPI_KEY}` });
        results = data?.images_results || [];
        if (!results.length) throw new Error('No image results from SerpAPI');
        const usable = results.filter(r => r.original && !r.original.startsWith('x-raw-image'));
        serpApiResultsCache.set(cacheKey, usable.length ? usable : results);
        results = serpApiResultsCache.get(cacheKey);
    }
    const safeIndex = results.length ? imageIndex % results.length : 0;
    const pick = results[safeIndex] || results[0];
    if (!pick?.original) throw new Error('No usable image URL in SerpAPI results');
    return pick.original;
}

async function searchUnsplash(query, orientation) {
    if (!UNSPLASH_KEY) throw new Error('No UNSPLASH_ACCESS_KEY');
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}` +
        `&orientation=${orientation}&content_filter=high&client_id=${UNSPLASH_KEY}`;
    const data = await fetchJSON(url);
    return data?.urls?.regular || data?.urls?.full || null;
}

async function searchPexels(query, orientation) {
    if (!PEXELS_KEY) throw new Error('No PEXELS_API_KEY');
    const orMap = { portrait: 'portrait', landscape: 'landscape', squarish: 'square' };
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}` +
        `&orientation=${orMap[orientation] || 'portrait'}&per_page=5&page=1`;
    const data = await fetchJSON(url, { Authorization: PEXELS_KEY });
    const photos = data?.photos;
    if (!photos?.length) return null;
    const photo = photos[Math.floor(Math.random() * photos.length)];
    return photo?.src?.large2x || photo?.src?.large || null;
}

async function searchPixabay(query, orientation) {
    if (!PIXABAY_KEY) throw new Error('No PIXABAY_API_KEY');
    const orMap = { portrait: 'vertical', landscape: 'horizontal', squarish: 'square' };
    const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}` +
        `&image_type=photo&orientation=${orMap[orientation] || 'vertical'}&safesearch=true&per_page=5&min_width=1080`;
    const data = await fetchJSON(url);
    const hits = data?.hits;
    if (!hits?.length) return null;
    const hit = hits[Math.floor(Math.random() * hits.length)];
    return hit?.largeImageURL || hit?.webformatURL || null;
}

async function getPicsum(orientation) {
    const w = orientation === 'landscape' ? 1920 : 1080;
    const h = orientation === 'landscape' ? 1080 : 1920;
    const seed = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/${seed}/${w}/${h}`;
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

/**
 * Fetch one stock photo and return it as a base64 data URI.
 * @param {object} opts
 * @param {string} opts.query        search term (required)
 * @param {'portrait'|'landscape'|'squarish'} [opts.orientation='portrait']
 * @param {number} [opts.imageIndex=0]  which SerpAPI result to pick (0-9)
 * @param {string} [opts.source]        force a specific source, skip the chain
 * @returns {Promise<{dataUri:string, mime:string, source:string}|null>}
 *          null only if every source in the chain fails outright.
 */
async function fetchStockImageBase64(opts) {
    const query       = opts.query;
    const orientation = opts.orientation || 'portrait';
    const imageIndex  = opts.imageIndex || 0;
    if (!query) throw new Error('fetchStockImageBase64: opts.query is required');

    const cacheId  = crypto.createHash('md5')
        .update(`img::${query}::${orientation}::${imageIndex}::${opts.source || ''}`).digest('hex').slice(0, 16);
    const manifest = path.join(CACHE_DIR, `${cacheId}.json`);
    if (fs.existsSync(manifest)) {
        const meta = JSON.parse(fs.readFileSync(manifest, 'utf8'));
        if (fs.existsSync(meta.file)) {
            console.log(`[ApexCasingMedia] Cached image: "${query.slice(0, 40)}" (${meta.source})`);
            return { dataUri: toDataUri(meta.file, meta.mime), mime: meta.mime, source: meta.source };
        }
    }

    const chain = getSourceChain(opts.source);
    let lastErr = null;
    for (const source of chain) {
        try {
            const url = await searchSource(source, query, orientation, imageIndex);
            if (!url) continue;
            const ext  = extFromUrl(url);
            const mime = MIME_BY_EXT[ext] || 'image/jpeg';
            const file = path.join(CACHE_DIR, `${cacheId}.${ext}`);
            await downloadFile(url, file);
            fs.writeFileSync(manifest, JSON.stringify({ file, mime, source }));
            console.log(`[ApexCasingMedia]  ✓ "${query.slice(0, 40)}" via ${source}`);
            return { dataUri: toDataUri(file, mime), mime, source };
        } catch (e) {
            lastErr = e;
            console.warn(`[ApexCasingMedia]  ⚠ ${source} failed for "${query.slice(0, 40)}": ${e.message?.slice(0, 70)}`);
        }
    }
    console.warn(`[ApexCasingMedia]  ✗ every source failed for "${query}"${lastErr ? ': ' + lastErr.message : ''}`);
    return null;
}

// ── Giphy — mirrors src/giphy-api.js's endpoints/rendition-picking logic ──
const GIPHY_SEARCH_URL  = 'https://api.giphy.com/v1/gifs/search';
const GIPHY_STICKER_URL = 'https://api.giphy.com/v1/stickers/search';
const GIPHY_GET_URL     = 'https://api.giphy.com/v1/gifs/';
const giphyResultsCache = new Map();

async function fetchGiphyById(id) {
    const url  = `${GIPHY_GET_URL}${encodeURIComponent(id)}?api_key=${GIPHY_KEY}`;
    const data = await fetchJSON(url);
    return data?.data || null;
}

async function fetchGiphyByQuery(query, sticker, rating, resultIndex) {
    const endpoint = sticker ? GIPHY_STICKER_URL : GIPHY_SEARCH_URL;
    const cacheKey = `${query.toLowerCase().trim()}::${sticker}::${rating}`;
    if (!giphyResultsCache.has(cacheKey)) {
        const limit = Math.max(resultIndex + 1, 10);
        const url = `${endpoint}?api_key=${GIPHY_KEY}&q=${encodeURIComponent(query)}` +
            `&limit=${limit}&rating=${rating}&lang=en`;
        const data = await fetchJSON(url);
        giphyResultsCache.set(cacheKey, data?.data || []);
    }
    const results = giphyResultsCache.get(cacheKey) || [];
    if (!results.length) return null;
    return results[Math.min(resultIndex, results.length - 1)] || null;
}

/**
 * Fetch one Giphy GIF/sticker/MP4 and return it as a base64 data URI.
 * @param {object} opts
 * @param {string} [opts.query]        search term (or pass opts.id instead)
 * @param {string} [opts.id]           exact Giphy ID — skips search
 * @param {boolean}[opts.sticker=false]
 * @param {string} [opts.rating='g']
 * @param {number} [opts.resultIndex=0]
 * @param {boolean}[opts.preferMp4=false]  video/mp4 data URI instead of GIF
 * @returns {Promise<{dataUri:string, mime:string, source:'giphy', mediaType:'gif'|'video', title:string}|null>}
 */
async function fetchGiphyBase64(opts) {
    if (!GIPHY_KEY) { console.warn('[ApexCasingMedia] GIPHY_API_KEY not set — skipping giphy fetch'); return null; }
    const sticker     = opts.sticker ?? false;
    const rating      = opts.rating ?? 'g';
    const resultIndex = opts.resultIndex ?? 0;
    const preferMp4   = opts.preferMp4 ?? false;

    const cacheKeyRaw = opts.id ? `id::${opts.id}` :
        `q::${(opts.query || 'funny').toLowerCase().trim()}::${sticker}::${rating}::${resultIndex}::${preferMp4}`;
    const cacheId  = crypto.createHash('md5').update(cacheKeyRaw).digest('hex').slice(0, 16);
    const manifest = path.join(CACHE_DIR, `${cacheId}.json`);
    if (fs.existsSync(manifest)) {
        const meta = JSON.parse(fs.readFileSync(manifest, 'utf8'));
        if (fs.existsSync(meta.file)) {
            console.log(`[ApexCasingMedia] Cached giphy: "${(opts.query || opts.id || '').slice(0, 40)}"`);
            return { dataUri: toDataUri(meta.file, meta.mime), mime: meta.mime, source: 'giphy', mediaType: meta.mediaType, title: meta.title };
        }
    }

    let gifData;
    try {
        gifData = opts.id ? await fetchGiphyById(opts.id) : await fetchGiphyByQuery(opts.query || 'funny', sticker, rating, resultIndex);
    } catch (e) {
        console.warn(`[ApexCasingMedia]  ✗ giphy API fetch failed: ${e.message?.slice(0, 80)}`);
        return null;
    }
    if (!gifData) { console.warn(`[ApexCasingMedia]  ✗ no giphy results for "${opts.query || opts.id}"`); return null; }

    const renditions = gifData.images || {};
    let mediaUrl, mediaType;
    if (preferMp4) {
        mediaUrl  = renditions.original?.mp4 || renditions.looping?.mp4 || renditions.original?.url;
        mediaType = mediaUrl?.endsWith('.mp4') ? 'video' : 'gif';
    } else {
        mediaUrl  = renditions.original?.url;
        mediaType = 'gif';
    }
    if (!mediaUrl) { console.warn(`[ApexCasingMedia]  ✗ no usable rendition for giphy id ${gifData.id}`); return null; }

    const ext  = mediaType === 'video' ? 'mp4' : 'gif';
    const mime = MIME_BY_EXT[ext];
    const file = path.join(CACHE_DIR, `${cacheId}.${ext}`);
    try {
        await downloadFile(mediaUrl, file);
    } catch (e) {
        console.warn(`[ApexCasingMedia]  ✗ giphy download failed: ${e.message?.slice(0, 80)}`);
        return null;
    }
    const title = gifData.title || opts.query || '';
    fs.writeFileSync(manifest, JSON.stringify({ file, mime, mediaType, title }));
    console.log(`[ApexCasingMedia]  ✓ giphy "${title.slice(0, 40)}" (${mediaType})`);
    return { dataUri: toDataUri(file, mime), mime, source: 'giphy', mediaType, title };
}

module.exports = { fetchStockImageBase64, fetchGiphyBase64 };