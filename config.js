// config.test-geometry-graph-full.js
// Full feature-coverage smoke test for ApexCasing/geometry-graph-explainer.html —
// NOT publish content. Every command type and shapeType the casing supports
// fires at least once so you can eyeball the render before building a real
// script around it. Coordinates are first-guess; expect to nudge x/y after
// the first render.
//
// Scene 1 — 2D core: rect, triangle, circle(fillAfter), polygon, point,
//           vector, arc(wedge + non-wedge), segment, rightAngle,
//           tick(mode:'segment'), tick(mode:'angle'), progress, plus
//           write/replace/moveTo/erase/highlight/circle-fx/line-fx/
//           fadeGroup/clearAll.
// Scene 2 — 2D graphing: axes, plot (fn), plot (raw points), graphPoint.
// Scene 3 — 3D: box/sphere/cylinder/cone/pyramid/plane, spin, label3d,
//           camera move, erase on a 3D mesh, fadeGroup on 3D meshes,
//           clearAll reaching into the 3D layer.
//
// Mixed trigger coverage on purpose: atSeconds, afterId chains, and two
// wordText triggers (one per narrated scene) so all three trigger paths
// get exercised, not just the deterministic ones.
//
// Run with:  VIDEO_CONFIG=config.test-geometry-graph-full.js node engine-ci.js

module.exports = {
    output: {
        title:  'test-geometry-graph-casing-full',
        format: 'portrait',
        fps:    30,
        crf:    23,
        preset: 'fast',
    },

    defaults: { voice: 'am_michael', transition: 'fade', transitionDuration: 0.35 },

    scenes: [
        // ── Scene 1 — 2D shape primitives + core engine verbs ───────────
        {
            tts: {
                text: "Picture a triangular garden plot. One side runs eighty feet along the ground, the other climbs sixty feet straight up, meeting at a corner. Mark each vertex, sketch the wind direction along the base, and look at that corner angle, it's exactly ninety degrees. Extend a line up from the base, mark the right angle properly, tick the sides that don't match, and match up the equal angles. Drop in a circular flower bed, a pentagon stepping stone, and a little progress bar for how much fencing you've got left. That's the whole plot, labeled, angled, and fenced.",
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            captions: false,
            layers: [
                { type: 'background', color: '#0a0a12', noise: true, noiseOpacity: 0.03 },
                {
                    type:      'html-record',
                    src:       './ApexCasing/geometry-graph-explainer.html?tag=test-2d-full',
                    audioSync: true,
                    data: {
                        title: 'Garden Plot',
                        theme: { accent: '#ffdd00', text: '#ffffff' },
                        commands: [
                            // rect — reference swatch, top-left
                            { id: 'r1', type: 'shape', shapeType: 'rect', x: 120, y: 260, w: 200, h: 130,
                              stroke: '#4dd0ff', trigger: { atSeconds: 0.4 } },

                            // triangle — the garden itself
                            { id: 'tri1', type: 'shape', shapeType: 'triangle',
                              points: [[240, 980], [880, 980], [240, 520]],
                              stroke: '#ffdd00', strokeWidth: 8,
                              trigger: { afterId: 'r1', offset: 0.6 } },

                            // point — the three vertices
                            { id: 'ptA', type: 'shape', shapeType: 'point', cx: 240, cy: 980, r: 10, stroke: '#ff5555',
                              trigger: { afterId: 'tri1', offset: 0.4 } },
                            { id: 'ptB', type: 'shape', shapeType: 'point', cx: 880, cy: 980, r: 10, stroke: '#ff5555',
                              trigger: { afterId: 'ptA', offset: 0.2 } },
                            { id: 'ptC', type: 'shape', shapeType: 'point', cx: 240, cy: 520, r: 10, stroke: '#ff5555',
                              trigger: { afterId: 'ptB', offset: 0.2 } },

                            // write — vertex labels
                            { id: 'labelA', type: 'write', latex: 'A', x: 190, y: 1020, size: 50,
                              trigger: { afterId: 'ptA', offset: 0.1 } },
                            { id: 'labelB', type: 'write', latex: 'B', x: 930, y: 1020, size: 50,
                              trigger: { afterId: 'ptB', offset: 0.1 } },
                            { id: 'labelC', type: 'write', latex: 'C', x: 190, y: 480, size: 50,
                              trigger: { afterId: 'ptC', offset: 0.1 } },

                            // vector — wind direction along the base
                            { id: 'vec1', type: 'shape', shapeType: 'vector',
                              points: [[300, 1060], [820, 1060]], stroke: '#7dff8a', strokeWidth: 7,
                              trigger: { afterId: 'labelC', offset: 0.5 } },

                            // arc (wedge) — the right angle at A, drawn as a filled wedge
                            { id: 'ang1', type: 'shape', shapeType: 'arc', cx: 240, cy: 980, r: 60,
                              startAngle: 0, endAngle: 90, wedge: true, stroke: '#ff9d4d', fillAfter: true,
                              trigger: { afterId: 'vec1', offset: 0.5 } },

                            // arc (non-wedge) — small decorative compass arc near the vector
                            { id: 'archNoWedge', type: 'shape', shapeType: 'arc', cx: 560, cy: 1060, r: 40,
                              startAngle: 0, endAngle: 180, wedge: false, stroke: '#7dff8a',
                              trigger: { afterId: 'ang1', offset: 0.3 } },

                            // write — angle label
                            { id: 'angLabel', type: 'write', latex: '90^\\circ', x: 330, y: 940, size: 46, color: '#ff9d4d',
                              trigger: { afterId: 'archNoWedge', offset: 0.3 } },

                            // circle shape — flower bed, with fillAfter to test the fill-once-traced path
                            { id: 'circleBed', type: 'shape', shapeType: 'circle', cx: 560, cy: 780, r: 70,
                              stroke: '#c77dff', fillAfter: true, fillColor: '#c77dff',
                              trigger: { afterId: 'angLabel', offset: 0.4 } },

                            // polygon — pentagon stepping stone
                            { id: 'polyBed', type: 'shape', shapeType: 'polygon',
                              points: [[700, 700], [740, 660], [780, 700], [764, 750], [716, 750]],
                              stroke: '#4dd0ff', strokeWidth: 5,
                              trigger: { afterId: 'circleBed', offset: 0.4 } },

                            // segment — plain line, no arrowhead: extend a reference line up from the base
                            { id: 'seg1', type: 'shape', shapeType: 'segment',
                              points: [[560, 980], [560, 700]], stroke: '#ffffff', strokeWidth: 4,
                              trigger: { afterId: 'polyBed', offset: 0.4 } },

                            // rightAngle — the proper corner-square marker at vertex A, alongside the wedge
                            { id: 'rightAngleA', type: 'shape', shapeType: 'rightAngle',
                              vertex: [240, 980], dir1: [640, 0], dir2: [0, -460], size: 30,
                              stroke: '#ffffff', strokeWidth: 5,
                              trigger: { afterId: 'seg1', offset: 0.4 } },

                            // tick (mode:'segment') — single mark on side AB
                            { id: 'tickAB', type: 'shape', shapeType: 'tick', mode: 'segment',
                              points: [[240, 980], [880, 980]], count: 1, length: 26, stroke: '#ff5555', strokeWidth: 6,
                              trigger: { afterId: 'rightAngleA', offset: 0.4 } },

                            // tick (mode:'segment') — double mark on the reference segment, showing it's a
                            // different length than AB (single vs double tick is the standard convention)
                            { id: 'tickSeg1', type: 'shape', shapeType: 'tick', mode: 'segment',
                              points: [[560, 980], [560, 700]], count: 2, length: 24, spacing: 14,
                              stroke: '#ff5555', strokeWidth: 6,
                              trigger: { afterId: 'tickAB', offset: 0.3 } },

                            // tick (mode:'angle') — double-arc equal-angle mark at vertex B
                            { id: 'tickAngleB', type: 'shape', shapeType: 'tick', mode: 'angle',
                              cx: 880, cy: 980, angle: 235, radius: 55, count: 2, length: 26, spacing: 14,
                              stroke: '#ff9d4d', strokeWidth: 6,
                              trigger: { afterId: 'tickSeg1', offset: 0.4 } },

                            // replace — swap labelA's text (fires on the wordText trigger, tests that channel)
                            { id: 'replaceA', type: 'replace', target: 'labelA', latex: '\\text{A (start)}',
                              trigger: { wordText: 'ninety', occurrence: 1 } },

                            // moveTo — reposition the angle label somewhere clearer
                            { id: 'moveAng', type: 'moveTo', target: 'angLabel', x: 420, y: 860,
                              trigger: { afterId: 'replaceA', offset: 0.5 } },

                            // progress — fencing material used
                            { id: 'prog1', type: 'progress', x: 140, y: 1150, w: 780, h: 50,
                              target: 0.82, color: '#ffdd00', label: 'fencing used',
                              trigger: { afterId: 'moveAng', offset: 0.4 } },

                            // highlight — LaTeX-only glow, on labelB
                            { id: 'hl1', type: 'highlight', target: 'labelB', holdSec: 0.6,
                              trigger: { afterId: 'prog1', offset: 0.5 } },

                            // circle fx — ring pulse around labelC
                            { id: 'circFx1', type: 'circle', target: 'labelC',
                              trigger: { afterId: 'hl1', offset: 0.4 } },

                            // line fx — underline-style stroke near labelB
                            { id: 'lineFx1', type: 'line', target: 'labelB',
                              trigger: { afterId: 'circFx1', offset: 0.4 } },

                            // fadeGroup — dim the vertex markers, vector, and both tick sets together
                            { id: 'fade1', type: 'fadeGroup',
                              targets: ['ptA', 'ptB', 'ptC', 'vec1', 'tickAB', 'tickSeg1', 'tickAngleB'], opacity: 0.15,
                              trigger: { afterId: 'lineFx1', offset: 0.4 } },

                            // erase — remove the reference segment + its right-angle marker on the way out
                            { id: 'eraseSeg', type: 'erase', target: 'seg1', duration: 0.4,
                              trigger: { afterId: 'fade1', offset: 0.4 } },
                            { id: 'eraseRA', type: 'erase', target: 'rightAngleA', duration: 0.4,
                              trigger: { afterId: 'eraseSeg', offset: 0.2 } },

                            // clearAll — wipe the whole scene before the transition
                            { id: 'clr1', type: 'clearAll',
                              trigger: { afterId: 'eraseRA', offset: 1.0 } },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    duration: 22,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },

        // ── Scene 2 — 2D graphing: axes, fn-plot, points-plot, graphPoint ─
        {
            tts: {
                text: "Now graph it. Height over time follows twenty t minus five t squared. Watch the curve rise, peak, then fall back down, the ball's actual measured heights trace almost the same path, just slightly noisy. The peak lands at two seconds, twenty meters up. That's the highest point in the throw.",
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            captions: false,
            layers: [
                { type: 'background', color: '#0a0a12', noise: true, noiseOpacity: 0.03 },
                {
                    type:      'html-record',
                    src:       './ApexCasing/geometry-graph-explainer.html?tag=test-graph',
                    audioSync: true,
                    data: {
                        title: 'Ball Throw',
                        theme: { accent: '#4dd0ff', text: '#ffffff' },
                        commands: [
                            // axes — the plot box
                            { id: 'ax1', type: 'axes', x: 140, y: 400, w: 800, h: 900,
                              xMin: 0, xMax: 4, yMin: 0, yMax: 22, xStep: 0.5, yStep: 2,
                              showGrid: true, labelX: 't (seconds)', labelY: 'height (m)',
                              trigger: { atSeconds: 0.4 } },

                            // plot via fn — the model curve h = 20t - 5t^2
                            { id: 'curve1', type: 'plot', axesId: 'ax1', fn: '20*x - 5*x*x',
                              stroke: '#4dd0ff', strokeWidth: 7, samples: 100,
                              trigger: { afterId: 'ax1', offset: 0.5 } },

                            // graphPoint — the peak, fired on the wordText trigger to test that channel
                            { id: 'peak', type: 'graphPoint', axesId: 'ax1', x: 2, y: 20, r: 13, color: '#ff5555',
                              trigger: { wordText: 'peak', occurrence: 1 } },

                            // write — peak coordinate label, hand-placed at the axes' pixel projection of (2,20)
                            { id: 'peakLabel', type: 'write', latex: '(2,\\ 20)', x: 540, y: 420, size: 44, color: '#ff5555',
                              trigger: { afterId: 'peak', offset: 0.3 } },

                            // plot via raw points — "actual measured" noisy data overlay
                            { id: 'curve2', type: 'plot', axesId: 'ax1',
                              points: [[0.5, 8.5], [1, 15], [1.5, 18.5], [2, 20], [2.5, 18.7], [3, 15.2], [3.5, 8.9]],
                              stroke: '#7dff8a', strokeWidth: 5,
                              trigger: { afterId: 'peakLabel', offset: 0.6 } },

                            { id: 'hl2', type: 'highlight', target: 'peakLabel', holdSec: 0.6,
                              trigger: { afterId: 'curve2', offset: 0.5 } },

                            // fadeGroup — dim the noisy overlay to re-emphasize the model curve
                            { id: 'fade2', type: 'fadeGroup', targets: ['curve2'], opacity: 0.3,
                              trigger: { afterId: 'hl2', offset: 0.6 } },

                            // erase — remove the data overlay entirely (tests erase on a graph-layer shape)
                            { id: 'erase2', type: 'erase', target: 'curve2',
                              trigger: { afterId: 'fade2', offset: 0.6 } },

                            { id: 'clr2', type: 'clearAll',
                              trigger: { afterId: 'erase2', offset: 1.0 } },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    duration: 16,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },

        // ── Scene 3 — 3D: solids, spin, label3d, camera move, erase/fade ─
        {
            tts: {
                text: "Same volume, five different shapes, a cube, a sphere, a cylinder, a cone, and a pyramid. Watch how much surface each one needs to wrap that same amount of stuff inside. Spin it around, pull the camera back, and compare them side by side. The sphere almost always wins, least surface for the volume it holds, which is exactly why bubbles and droplets default to that shape when nothing else is pushing them into a corner.",
                voice: 'am_michael',
                pauseAfter: 0.6,
            },
            captions: false,
            layers: [
                { type: 'background', color: '#05050a' },
                {
                    type:      'html-record',
                    src:       './ApexCasing/geometry-graph-explainer.html?tag=test-3d',
                    audioSync: true,
                    data: {
                        title: 'Same Volume, Five Shapes',
                        theme: { accent: '#c77dff', text: '#ffffff' },
                        camera: { position: [7, 6, 10], lookAt: [0, 0, 0] },
                        commands: [
                            // ground plane — wireframe, mostly for spatial context
                            { id: 'plane1', type: 'shape3d', solidType: 'plane',
                              position: [0, -2.2, 0], rotation: [-1.5708, 0, 0],
                              size: { width: 14, height: 6 }, color: '#333344',
                              wireframe: true, opacity: 0.5, duration: 0.6,
                              trigger: { atSeconds: 0.4 } },

                            { id: 'box1', type: 'shape3d', solidType: 'box',
                              position: [-6, 0, 0], size: 2, color: '#ffdd00', duration: 0.8,
                              trigger: { afterId: 'plane1', offset: 0.4 } },

                            // sphere — carries a continuous spin to test that path
                            { id: 'sphere1', type: 'shape3d', solidType: 'sphere',
                              position: [-2, 0, 0], size: 1.3, color: '#ff5555', duration: 0.8,
                              spin: { y: 0.6 },
                              trigger: { afterId: 'box1', offset: 0.5 } },

                            { id: 'cyl1', type: 'shape3d', solidType: 'cylinder',
                              position: [2, 0, 0], size: { radius: 1.1, height: 2.6 }, color: '#4dd0ff', duration: 0.8,
                              trigger: { afterId: 'sphere1', offset: 0.5 } },

                            { id: 'cone1', type: 'shape3d', solidType: 'cone',
                              position: [6, 0, 0], size: { radius: 1.3, height: 2.8 }, color: '#7dff8a', duration: 0.8,
                              trigger: { afterId: 'cyl1', offset: 0.5 } },

                            { id: 'pyr1', type: 'shape3d', solidType: 'pyramid',
                              position: [0, 3.4, 0], size: { radius: 1.5, height: 2.6 }, color: '#c77dff', duration: 0.8,
                              trigger: { afterId: 'cone1', offset: 0.5 } },

                            // label3d — pinned labels that track each mesh (including the spinning sphere)
                            { id: 'lblBox', type: 'label3d', anchor: 'box1', latex: '\\text{cube}',
                              offset: [0, -100], size: 40,
                              trigger: { afterId: 'box1', offset: 0.9 } },
                            { id: 'lblSphere', type: 'label3d', anchor: 'sphere1', latex: '\\text{sphere}',
                              offset: [0, -100], size: 40,
                              trigger: { afterId: 'sphere1', offset: 0.9 } },
                            { id: 'lblCyl', type: 'label3d', anchor: 'cyl1', latex: '\\text{cylinder}',
                              offset: [0, -120], size: 40,
                              trigger: { afterId: 'cyl1', offset: 0.9 } },
                            { id: 'lblCone', type: 'label3d', anchor: 'cone1', latex: '\\text{cone}',
                              offset: [0, -120], size: 40,
                              trigger: { afterId: 'cone1', offset: 0.9 } },
                            { id: 'lblPyr', type: 'label3d', anchor: 'pyr1', latex: '\\text{pyramid}',
                              offset: [0, -110], size: 40,
                              trigger: { afterId: 'pyr1', offset: 0.9 } },

                            // camera — pull back on the wordText trigger, tests wordText -> camera + a
                            // chain built on top of a wordText-fired command
                            { id: 'camMove1', type: 'camera', position: [0, 9, 15], lookAt: [0, 0, 0], duration: 2.2,
                              trigger: { wordText: 'back', occurrence: 1 } },

                            // erase — remove the cone (tests erase on a 3D mesh)
                            { id: 'eraseCone', type: 'erase', target: 'cone1', duration: 0.6,
                              trigger: { afterId: 'camMove1', offset: 1.4 } },

                            // fadeGroup — dim the cube + pyramid together (tests fadeGroup on 3D meshes)
                            { id: 'fade3', type: 'fadeGroup', targets: ['box1', 'pyr1'], opacity: 0.25,
                              trigger: { afterId: 'eraseCone', offset: 0.5 } },

                            // clearAll — wipes els/2D shapes/3D meshes together
                            { id: 'clr3', type: 'clearAll',
                              trigger: { afterId: 'fade3', offset: 1.0 } },
                        ],
                    },
                    waitFor: '[data-ready="1"]',
                    duration: 20,
                    fps: 30,
                    viewport: { width: 1080, height: 1920 },
                    x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
                },
            ],
        },
    ],
};
