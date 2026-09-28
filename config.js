/**
 * config.inline-test.js — Minimal test for inline `html` in an html-record layer.
 * Usage: VIDEO_CONFIG=config.inline-test.js node engine-ci.js
 *
 * Expected: a purple/orange animated box and a live counter on screen.
 * If you see solid black, check the log for "[HTMLRec] ✗ Failed to record".
 */

module.exports = {
    output: { title: 'Inline HTML Test', format: 'portrait', fps: 30, crf: 23, preset: 'fast' },
    defaults: { voice: 'af_heart', emotion: 'neutral', transition: 'fade' },
    scenes: [
        {
            tts: { text: 'Testing inline HTML recording.', voice: 'af_heart', emotion: 'neutral' },
            layers: [
                {
                    type: 'html-record',
                    duration: 3,
                    fps: 30,
                    cursor: null,
                    viewport: { width: 1080, height: 1920 },
                    html: `
                        <div style="width:100%;height:100%;display:flex;flex-direction:column;
                                    align-items:center;justify-content:center;gap:40px;
                                    background:linear-gradient(135deg,#4b0082,#ff6a00);color:#fff;">
                            <div style="width:220px;height:220px;background:#fff;border-radius:32px;
                                        animation:spin 2s linear infinite;"></div>
                            <h1 style="font-size:96px;margin:0;">INLINE OK</h1>
                            <div id="n" style="font-size:72px;">0</div>
                        </div>
                        <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
                        <script>
                            let i = 0;
                            setInterval(() => { document.getElementById('n').textContent = ++i; }, 100);
                        </script>
                    `,
                },
            ],
        },
    ],
};