const https = require('https');
const http = require('http');

/* ============================================================
   APEX — PHYTOMED "WHY CHOOSE PHYTOMED?" 40s AD
   Paper Sticker Explainer
   ============================================================ */

const SERPAPI_KEY = process.env.SERPAPI_API_KEY || null;
const serpCache = new Map();

/* ============================================================
   HTTP HELPERS
   ============================================================ */

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 APEX Video Engine'
      }
    }, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return fetchJSON(res.headers.location)
            .then(resolve)
            .catch(reject);
        }

        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(
            new Error(`Invalid JSON response: HTTP ${res.statusCode}`)
          );
        }
      });
    });

    req.setTimeout(20000, () => {
      req.destroy();
      reject(new Error('JSON request timeout'));
    });

    req.on('error', reject);
  });
}


function downloadToBase64(url) {
  return new Promise((resolve, reject) => {

    if (!url || !/^https?:\/\//i.test(url)) {
      return reject(new Error('Invalid image URL'));
    }

    const client = url.startsWith('https') ? https : http;

    const req = client.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept':
          'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    }, res => {

      if (
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        return downloadToBase64(res.headers.location)
          .then(resolve)
          .catch(reject);
      }

      if (res.statusCode !== 200) {
        res.resume();
        return reject(
          new Error(`Image HTTP ${res.statusCode}`)
        );
      }

      const contentType =
        String(res.headers['content-type'] || '').toLowerCase();

      if (
        contentType.includes('text/html') ||
        contentType.includes('application/json')
      ) {
        res.resume();
        return reject(new Error('HTML/JSON returned instead of image'));
      }

      const chunks = [];

      res.on('data', chunk => chunks.push(chunk));

      res.on('end', () => {

        const buffer = Buffer.concat(chunks);

        if (buffer.length < 1024) {
          return reject(new Error('Image smaller than 1KB'));
        }

        let mime = contentType.split(';')[0].trim();

        if (!mime.startsWith('image/')) {

          const header =
            buffer.slice(0, 12).toString('hex');

          if (
            header.startsWith('89504e470d0a1a0a')
          ) {
            mime = 'image/png';

          } else if (
            buffer[0] === 0xff &&
            buffer[1] === 0xd8
          ) {
            mime = 'image/jpeg';

          } else if (
            buffer.slice(0, 4).toString() === 'RIFF'
          ) {
            mime = 'image/webp';

          } else {
            return reject(
              new Error('Unknown image format')
            );
          }
        }

        resolve(
          `data:${mime};base64,${buffer.toString('base64')}`
        );
      });
    });

    req.setTimeout(25000, () => {
      req.destroy();
      reject(new Error('Image download timeout'));
    });

    req.on('error', reject);
  });
}


/* ============================================================
   SERPAPI
   ============================================================ */

async function searchSerpApi(query) {

  if (!SERPAPI_KEY) {
    throw new Error(
      'SERPAPI_API_KEY is not configured'
    );
  }

  if (serpCache.has(query)) {
    return serpCache.get(query);
  }

  const params = new URLSearchParams({
    engine: 'google_images',
    q: query,
    api_key: SERPAPI_KEY,
    safe: 'active',
    num: '20'
  });

  const url =
    `https://serpapi.com/search.json?${params.toString()}`;

  const json = await fetchJSON(url);

  const results =
    Array.isArray(json.images_results)
      ? json.images_results
      : [];

  serpCache.set(query, results);

  return results;
}


/* ============================================================
   ROBUST IMAGE FETCH
   ============================================================ */

async function fetchSerpImage(primary, backup) {

  const queries = [primary];

  if (backup && backup !== primary) {
    queries.push(backup);
  }

  for (const query of queries) {

    try {

      const results =
        await searchSerpApi(query);

      for (const result of results) {

        const candidates = [
          result.original,
          result.thumbnail
        ].filter(Boolean);

        for (const imageUrl of candidates) {

          try {

            const image =
              await downloadToBase64(imageUrl);

            if (image) {
              console.log(
                `[APEX] Image loaded: ${query}`
              );

              return image;
            }

          } catch (err) {
            // Try the next image.
          }
        }
      }

    } catch (err) {

      console.log(
        `[APEX] Search failed: ${query} — ${err.message}`
      );
    }
  }

  console.log(
    `[APEX] No usable image found for: ${primary}`
  );

  return null;
}


/* ============================================================
   INVISIBLE SAFE FALLBACK
   ============================================================ */

function blankImage() {

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg"
       width="800"
       height="600">

    <rect width="800"
          height="600"
          fill="#f4ecdd"/>

  </svg>`;

  return (
    'data:image/svg+xml;base64,' +
    Buffer.from(svg).toString('base64')
  );
}


/* ============================================================
   SLOT CAMERA
   ============================================================ */

const SLOT_CENTERS = {

  'top-left': [180, 270.5],
  'top-center': [540, 270.5],
  'top-right': [900, 270.5],

  'mid-left': [180, 511.5],
  'mid-center': [540, 511.5],
  'mid-right': [900, 511.5],

  'low-left': [180, 752.5],
  'low-center': [540, 752.5],
  'low-right': [900, 752.5],

  'bot-left': [180, 993.5],
  'bot-center': [540, 993.5],
  'bot-right': [900, 993.5],

  'deep-left': [180, 1234.5],
  'deep-center': [540, 1234.5],
  'deep-right': [900, 1234.5],

  'floor-left': [180, 1475.5],
  'floor-center': [540, 1475.5],
  'floor-right': [900, 1475.5],

  'banner-top': [540, 270.5],
  'banner-mid': [540, 752.5],
  'banner-low': [540, 1234.5],
  'banner-bot': [540, 1475.5]
};


function zoomTo(slot, scale) {

  const c =
    SLOT_CENTERS[slot] || [540, 960];

  return {
    toScale: scale,
    toX: -scale * (c[0] - 540),
    toY: -scale * (c[1] - 960)
  };
}


const ZOOM_OUT = {
  toScale: 1,
  toX: 0,
  toY: 0
};


/* ============================================================
   CONFIG
   ============================================================ */

module.exports = (async () => {

  /*
   * IMPORTANT:
   * Images are intentionally fetched SEQUENTIALLY.
   * Do not replace this with Promise.all().
   */

  const phytoBalm = await fetchSerpImage(
    'Phytomed PhytoBalm official product',
    'Phytomed PhytoBalm herbal balm'
  );

  const phytoBlend = await fetchSerpImage(
    'Phytomed PhytoBlend official product',
    'Phytomed PhytoBlend herbal tea'
  );

  const phytoHair = await fetchSerpImage(
    'Phytomed Phyto Hair official product',
    'Phytomed Phyto Hair serum'
  );

  const phytoWash = await fetchSerpImage(
    'Phytomed Phyto Wash official product',
    'Phytomed Phyto Wash'
  );

  const phytoDeo = await fetchSerpImage(
    'Phytomed Phyto Deo official product',
    'Phytomed Phyto Deo'
  );

  const phytoDerm = await fetchSerpImage(
    'Phytomed PhytoDerm official product',
    'Phytomed PhytoDerm cream'
  );

  const balm = phytoBalm || blankImage();
  const blend = phytoBlend || blankImage();
  const hair = phytoHair || blankImage();
  const wash = phytoWash || blankImage();
  const deo = phytoDeo || blankImage();
  const derm = phytoDerm || blankImage();


  return {

    /* ========================================================
       OUTPUT
       ======================================================== */

    output: {

      title:
        'why-choose-phytomed-40s',

      format: 'portrait',

      width: 1080,
      height: 1920,

      fps: 30,

      crf: 22,

      preset: 'medium',

      bgMusicVol: 0.06,

      bgMusic: {
        mood: 'uplifting'
      },

      postProcess: {
        grain: true,
        grainStrength: 0.018,
        vignette: false
      }
    },


    /* ========================================================
       DEFAULTS
       ======================================================== */

    defaults: {

      voice: 'bm_george',

      speed: 1.0,

      transition: 'fade',

      transitionDuration: 0.25
    },


    /* ========================================================
       SCENES
       ======================================================== */

    scenes: [

      /* ======================================================
         SCENE 1 — THE QUESTION
         ~7 seconds
         ====================================================== */

      {

        tts: {

          text:
            "Why choose Phytomed? Because wellness is not just about one need. It's about caring for the whole you, every day.",

          voice: 'bm_george',

          speed: 1.0,

          pauseAfter: 0.2
        },

        captions: false,

        layers: [

          {
            type: 'background',
            color: '#f4ecdd'
          },

          {

            type: 'html-record',

            src:
              './ApexCasing/paper-sticker-explainer.html?tag=phytomed-why-01',

            audioSync: true,

            cursor: false,

            waitFor: '[data-ready="1"]',

            fps: 30,

            viewport: {
              width: 1080,
              height: 1920
            },

            x: 0,
            y: 0,

            width: 1080,
            height: 1920,

            fit: 'cover',

            data: {

              title: 'WHY PHYTOMED?',

              theme: {

                paper: '#f4ecdd',

                ink: '#17181c',

                accent: '#47734d',

                accent2: '#a94b38',

                shadow:
                  'rgba(20,16,10,0.35)'
              },

              commands: [

                {
                  id: 'question',

                  type: 'sticker',

                  text:
                    'WHY\\nPHYTOMED?',

                  slot: 'banner-mid',

                  size: 86,

                  color: '#ffffff',

                  stroke: '#47734d',

                  bg: '#47734d',

                  rotate: -1,

                  trigger: {
                    atSeconds: 0.2
                  }
                },

                {
                  id: 'whole_you',

                  type: 'label',

                  text:
                    'Wellness is more than one need.',

                  slot: 'banner-low',

                  size: 38,

                  trigger: {
                    afterId: 'question',
                    offset: 0.55
                  }
                },

                {
                  id: 'leaf',

                  type: 'icon',

                  icon: 'mdi:leaf',

                  size: 150,

                  slot: 'top-center',

                  bg: 'circle',

                  color: '#47734d',

                  trigger: {
                    afterId: 'question',
                    offset: 0.4
                  }
                },

                {
                  id: 'zoom',

                  type: 'panZoom',

                  ...zoomTo(
                    'banner-mid',
                    1.35
                  ),

                  duration: 0.8,

                  trigger: {
                    afterId: 'question',
                    offset: 0.8
                  }
                },

                {
                  id: 'zoomout',

                  type: 'panZoom',

                  ...ZOOM_OUT,

                  duration: 0.8,

                  trigger: {
                    afterId: 'zoom',
                    offset: 0.7
                  }
                }

              ]
            }
          }
        ]
      },


      /* ======================================================
         SCENE 2 — EVERYDAY NEEDS
         ~8 seconds
         ====================================================== */

      {

        tts: {

          text:
            "From everyday personal care to skin and hair care, Phytomed has products designed for different parts of your routine.",

          voice: 'bm_george',

          speed: 1.0,

          pauseAfter: 0.2
        },

        captions: false,

        layers: [

          {
            type: 'background',
            color: '#f4ecdd'
          },

          {

            type: 'html-record',

            src:
              './ApexCasing/paper-sticker-explainer.html?tag=phytomed-everyday-02',

            audioSync: true,

            cursor: false,

            waitFor: '[data-ready="1"]',

            fps: 30,

            viewport: {
              width: 1080,
              height: 1920
            },

            x: 0,
            y: 0,

            width: 1080,
            height: 1920,

            fit: 'cover',

            data: {

              title: 'EVERYDAY CARE',

              theme: {

                paper: '#f4ecdd',

                ink: '#17181c',

                accent: '#47734d',

                accent2: '#a94b38',

                shadow:
                  'rgba(20,16,10,0.35)'
              },

              commands: [

                {
                  id: 'wash',

                  type: 'photo',

                  src: wash,

                  slot: 'mid-left',

                  width: 500,

                  height: 390,

                  caption: 'PHYTO WASH',

                  pinStyle: 'tape',

                  rotate: -2,

                  trigger: {
                    atSeconds: 0.25
                  }
                },

                {
                  id: 'deo',

                  type: 'photo',

                  src: deo,

                  slot: 'mid-right',

                  width: 500,

                  height: 390,

                  caption: 'PHYTO DEO',

                  pinStyle: 'pins',

                  rotate: 2,

                  trigger: {
                    afterId: 'wash',
                    offset: 1.0
                  }
                },

                {
                  id: 'personal',

                  type: 'sticker',

                  text:
                    'PERSONAL\\nCARE',

                  slot: 'banner-low',

                  size: 62,

                  color: '#ffffff',

                  stroke: '#a94b38',

                  bg: '#a94b38',

                  rotate: -1,

                  trigger: {
                    afterId: 'deo',
                    offset: 0.6
                  }
                },

                {
                  id: 'hair',

                  type: 'photo',

                  src: hair,

                  slot: 'deep-center',

                  width: 520,

                  height: 390,

                  caption: 'PHYTO HAIR',

                  pinStyle: 'tape',

                  rotate: -1,

                  trigger: {
                    afterId: 'personal',
                    offset: 0.55
                  }
                },

                {
                  id: 'zoom',

                  type: 'panZoom',

                  ...zoomTo(
                    'mid-left',
                    1.45
                  ),

                  duration: 0.8,

                  trigger: {
                    afterId: 'wash',
                    offset: 0.7
                  }
                },

                {
                  id: 'zoomout',

                  type: 'panZoom',

                  ...ZOOM_OUT,

                  duration: 0.8,

                  trigger: {
                    afterId: 'zoom',
                    offset: 0.7
                  }
                }

              ]
            }
          }
        ]
      },


      /* ======================================================
         SCENE 3 — WHAT CAN THEY HELP WITH?
         ~9 seconds
         ====================================================== */

      {

        tts: {

          text:
            "PhytoBalm is marketed for everyday relief from body aches and congestion. PhytoBlend is a caffeine-free herbal tea, while PhytoDerm focuses on moisturising skin care.",

          voice: 'bm_george',

          speed: 1.0,

          pauseAfter: 0.2
        },

        captions: false,

        layers: [

          {
            type: 'background',
            color: '#f4ecdd'
          },

          {

            type: 'html-record',

            src:
              './ApexCasing/paper-sticker-explainer.html?tag=phytomed-help-03',

            audioSync: true,

            cursor: false,

            waitFor: '[data-ready="1"]',

            fps: 30,

            viewport: {
              width: 1080,
              height: 1920
            },

            x: 0,
            y: 0,

            width: 1080,
            height: 1920,

            fit: 'cover',

            data: {

              title: 'PRODUCT PURPOSES',

              theme: {

                paper: '#f4ecdd',

                ink: '#17181c',

                accent: '#a94b38',

                accent2: '#47734d',

                shadow:
                  'rgba(20,16,10,0.35)'
              },

              commands: [

                {
                  id: 'balm',

                  type: 'photo',

                  src: balm,

                  slot: 'top-left',

                  width: 440,

                  height: 350,

                  caption: 'PHYTOBALM',

                  pinStyle: 'tape',

                  rotate: -2,

                  trigger: {
                    atSeconds: 0.25
                  }
                },

                {
                  id: 'balm_text',

                  type: 'label',

                  text:
                    'Body care • congestion',

                  slot: 'top-right',

                  size: 29,

                  trigger: {
                    afterId: 'balm',
                    offset: 0.45
                  }
                },

                {
                  id: 'blend',

                  type: 'photo',

                  src: blend,

                  slot: 'mid-left',

                  width: 440,

                  height: 350,

                  caption: 'PHYTOBLEND',

                  pinStyle: 'pins',

                  rotate: 2,

                  trigger: {
                    afterId: 'balm_text',
                    offset: 0.7
                  }
                },

                {
                  id: 'blend_text',

                  type: 'label',

                  text:
                    'Herbal tea • caffeine free',

                  slot: 'mid-right',

                  size: 29,

                  trigger: {
                    afterId: 'blend',
                    offset: 0.45
                  }
                },

                {
                  id: 'derm',

                  type: 'photo',

                  src: derm,

                  slot: 'low-center',

                  width: 540,

                  height: 390,

                  caption: 'PHYTODERM',

                  pinStyle: 'tape',

                  rotate: -1,

                  trigger: {
                    afterId: 'blend_text',
                    offset: 0.7
                  }
                },

                {
                  id: 'derm_text',

                  type: 'label',

                  text:
                    'Moisturising skin care',

                  slot: 'banner-bot',

                  size: 34,

                  trigger: {
                    afterId: 'derm',
                    offset: 0.45
                  }
                },

                {
                  id: 'zoom',

                  type: 'panZoom',

                  ...zoomTo(
                    'low-center',
                    1.45
                  ),

                  duration: 0.8,

                  trigger: {
                    afterId: 'derm',
                    offset: 0.7
                  }
                },

                {
                  id: 'zoomout',

                  type: 'panZoom',

                  ...ZOOM_OUT,

                  duration: 0.8,

                  trigger: {
                    afterId: 'zoom',
                    offset: 0.7
                  }
                }

              ]
            }
          }
        ]
      },


      /* ======================================================
         SCENE 4 — WHY PEOPLE CHOOSE A RANGE
         ~8 seconds
         ====================================================== */

      {

        tts: {

          text:
            "The idea is simple: choose products according to your needs, follow the directions, and make informed choices about your wellbeing.",

          voice: 'bm_george',

          speed: 1.0,

          pauseAfter: 0.2
        },

        captions: false,

        layers: [

          {
            type: 'background',
            color: '#f4ecdd'
          },

          {

            type: 'html-record',

            src:
              './ApexCasing/paper-sticker-explainer.html?tag=phytomed-choice-04',

            audioSync: true,

            cursor: false,

            waitFor: '[data-ready="1"]',

            fps: 30,

            viewport: {
              width: 1080,
              height: 1920
            },

            x: 0,
            y: 0,

            width: 1080,
            height: 1920,

            fit: 'cover',

            data: {

              title: 'YOUR ROUTINE',

              theme: {

                paper: '#f4ecdd',

                ink: '#17181c',

                accent: '#47734d',

                accent2: '#a94b38',

                shadow:
                  'rgba(20,16,10,0.35)'
              },

              commands: [

                {
                  id: 'one',

                  type: 'sticker',

                  text:
                    '1. KNOW\\nYOUR NEED',

                  slot: 'top-left',

                  size: 52,

                  color: '#ffffff',

                  stroke: '#47734d',

                  bg: '#47734d',

                  rotate: -2,

                  trigger: {
                    atSeconds: 0.3
                  }
                },

                {
                  id: 'two',

                  type: 'sticker',

                  text:
                    '2. CHOOSE\\nWISELY',

                  slot: 'mid-center',

                  size: 52,

                  color: '#ffffff',

                  stroke: '#a94b38',

                  bg: '#a94b38',

                  rotate: 1,

                  trigger: {
                    afterId: 'one',
                    offset: 1.2
                  }
                },

                {
                  id: 'three',

                  type: 'sticker',

                  text:
                    '3. FOLLOW\\nDIRECTIONS',

                  slot: 'low-right',

                  size: 52,

                  color: '#ffffff',

                  stroke: '#47734d',

                  bg: '#47734d',

                  rotate: -1,

                  trigger: {
                    afterId: 'two',
                    offset: 1.2
                  }
                },

                {
                  id: 'check',

                  type: 'draw',

                  preset: 'check',

                  slot: 'banner-low',

                  scale: 1.5,

                  color: '#47734d',

                  trigger: {
                    afterId: 'three',
                    offset: 0.5
                  }
                },

                {
                  id: 'zoom',

                  type: 'panZoom',

                  ...zoomTo(
                    'mid-center',
                    1.4
                  ),

                  duration: 0.8,

                  trigger: {
                    afterId: 'two',
                    offset: 0.7
                  }
                },

                {
                  id: 'zoomout',

                  type: 'panZoom',

                  ...ZOOM_OUT,

                  duration: 0.8,

                  trigger: {
                    afterId: 'zoom',
                    offset: 0.8
                  }
                }

              ]
            }
          }
        ]
      },


      /* ======================================================
         SCENE 5 — CTA / WHATSAPP
         ~8 seconds
         ====================================================== */

      {

        tts: {

          text:
            "Want to learn more about Phytomed products? Join our WhatsApp community, ask questions, and discover the range. Your pathway to wellness starts with an informed choice.",

          voice: 'bm_george',

          speed: 1.0,

          pauseAfter: 0.4
        },

        captions: false,

        layers: [

          {
            type: 'background',
            color: '#f4ecdd'
          },

          {

            type: 'html-record',

            src:
              './ApexCasing/paper-sticker-explainer.html?tag=phytomed-cta-05',

            audioSync: true,

            cursor: false,

            waitFor: '[data-ready="1"]',

            fps: 30,

            viewport: {
              width: 1080,
              height: 1920
            },

            x: 0,
            y: 0,

            width: 1080,
            height: 1920,

            fit: 'cover',

            data: {

              title: 'JOIN US',

              theme: {

                paper: '#f4ecdd',

                ink: '#17181c',

                accent: '#47734d',

                accent2: '#a94b38',

                shadow:
                  'rgba(20,16,10,0.35)'
              },

              commands: [

                {
                  id: 'leaf',

                  type: 'icon',

                  icon: 'mdi:leaf-circle',

                  size: 170,

                  slot: 'top-center',

                  bg: 'circle',

                  color: '#47734d',

                  trigger: {
                    atSeconds: 0.2
                  }
                },

                {
                  id: 'brand',

                  type: 'sticker',

                  text:
                    'WHY\\nPHYTOMED?',

                  slot: 'mid-center',

                  size: 76,

                  color: '#ffffff',

                  stroke: '#47734d',

                  bg: '#47734d',

                  rotate: -1,

                  trigger: {
                    afterId: 'leaf',
                    offset: 0.45
                  }
                },

                {
                  id: 'community',

                  type: 'sticker',

                  text:
                    'JOIN OUR\\nWHATSAPP\\nCOMMUNITY',

                  slot: 'low-center',

                  size: 53,

                  color: '#ffffff',

                  stroke: '#a94b38',

                  bg: '#a94b38',

                  rotate: 1,

                  trigger: {
                    afterId: 'brand',
                    offset: 0.65
                  }
                },

                {
                  id: 'whatsapp',

                  type: 'icon',

                  icon: 'mdi:whatsapp',

                  size: 125,

                  slot: 'deep-center',

                  bg: 'circle',

                  color: '#47734d',

                  trigger: {
                    afterId: 'community',
                    offset: 0.5
                  }
                },

                {
                  id: 'cta',

                  type: 'label',

                  text:
                    'Ask • Learn • Discover',

                  slot: 'floor-center',

                  size: 34,

                  trigger: {
                    afterId: 'whatsapp',
                    offset: 0.4
                  }
                },

                {
                  id: 'zoom',

                  type: 'panZoom',

                  ...zoomTo(
                    'low-center',
                    1.3
                  ),

                  duration: 1.0,

                  trigger: {
                    afterId: 'community',
                    offset: 0.7
                  }
                },

                {
                  id: 'zoomout',

                  type: 'panZoom',

                  ...ZOOM_OUT,

                  duration: 0.8,

                  trigger: {
                    afterId: 'zoom',
                    offset: 0.8
                  }
                },

                {
                  id: 'disclaimer',

                  type: 'label',

                  text:
                    'Use products as directed. Consult a healthcare professional when appropriate.',

                  slot: 'floor-left',

                  size: 19,

                  trigger: {
                    afterId: 'cta',
                    offset: 0.5
                  }
                }

              ]
            }
          }
        ]
      }

    ]
  };

})();