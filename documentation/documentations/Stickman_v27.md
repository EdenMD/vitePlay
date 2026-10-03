# APEX Stickman System v2.7 — Rico-Style Guide

## What changed from v2.6

| Feature | v2.6 (old) | v2.7 (new) |
|---|---|---|
| View | Side profile — invisible at rest | **Front-facing ¾** — all limbs always visible |
| Limbs | Thin `lineTo` strokes | **Thick capsule fills** with gradient shading |
| Joints | None | **Filled circles** with radial highlight |
| Head | Plain arc + flat face | **Large cartoony** with pupils, brows, ears, hair |
| Skin | Single color | **5 skin tones** + outfit system |
| Expressions | 10 | **14** (added laugh, wink, nervous, love) |
| Lip sync | No | **Yes** — amplitude-driven mouth open/close |
| Multi-char | No | **Yes** — `characters: [...]` array |
| Weather | No | **Yes** — rain/snow/clouds/lightning/fog/sunny/storm |
| 3D Assets | No | **Yes** — `asset-3d` layer type |
| Scene props | 3 (house/tree/road) | **8** (+ bench/lamp/sign/building/fence) |

---

## Single Character

```js
{
  type: 'stickman',
  x: 540, y: 1500,
  scale: 1.0,
  skin: 'medium',          // light | medium | tan | brown | dark | '#hex'
  outfit: {
    shirt: '#e63',
    pants: '#1a1a2e',
    shoes: '#222',
    hair:  '#1a1a1a',
  },
  action: { type: 'walk', style: 1, from: { x: 100 }, to: { x: 900 }, startAt: 0, duration: 3 },
  expression: 'happy',
  gesture: 'wave-right',
  lipSync: true,            // mouth syncs to TTS audio amplitude
  name: 'Alex',            // floating name label above head
  nameColor: '#fff',
  speechBubble: { text: 'Yo!', type: 'speech', startAt: 1, duration: 2 },
}
```

### Actions
`idle` `walk` `run` `jump` `moonwalk` `dance`

Walk/run styles 1–4. Dance styles 1–4 + `'hype'` `'floss'` `'wave'` `'bounce'`

### Expressions (14)
`neutral` `happy` `sad` `surprised` `talking` `thinking` `scratch-head`
`excited` `angry` `shout` `laugh` `wink` `nervous` `love`

### Gestures (9)
`point-right` `point-left` `thumbsup` `arms-up`
`wave-right` `wave-left` `facepalm` `crossed-arms` `shrug`

---

## Multi-Character Scene

```js
{
  type: 'stickman',
  characters: [
    {
      id: 'alex',
      x: 280, y: 1500,
      skin: 'light',
      outfit: { shirt: '#3a7bd5', pants: '#1a1a2e' },
      action: { type: 'idle' },
      expression: 'talking',
      lipSync: true,
      speechBubble: { text: 'Did you know?', type: 'speech', startAt: 0, duration: 3 },
    },
    {
      id: 'sam',
      x: 780, y: 1500,
      skin: 'brown',
      outfit: { shirt: '#2ecc71', pants: '#333' },
      facing: -1,          // face left (toward alex)
      action: { type: 'idle' },
      expression: 'surprised',
    },
  ]
}
```

---

## Lip Sync

```js
// Auto — syncs to live TTS amp from audio pipeline
lipSync: true

// Manual — pass a 0..1 number directly
lipSync: 0.8

// 'talking' expression also auto-animates even without lipSync:true
expression: 'talking'
```

---

## Weather Layer

```js
// Rain
{ type: 'weather', effect: 'rain', intensity: 0.7, wind: 0.3, color: '#88aaff' }

// Snow
{ type: 'weather', effect: 'snow', intensity: 0.5, wind: 0.1 }

// Clouds drifting
{ type: 'weather', effect: 'clouds', density: 0.6, speed: 0.4, cloudColor: 'rgba(220,230,255,0.88)' }

// Lightning (flashes semi-randomly)
{ type: 'weather', effect: 'lightning', intensity: 0.3 }

// Full storm (clouds + heavy rain + lightning)
{ type: 'weather', effect: 'storm' }

// Fog (ground level)
{ type: 'weather', effect: 'fog', density: 0.5 }

// Sunny with animated rays
{ type: 'weather', effect: 'sunny', intensity: 0.9, rays: true, sunX: 900, sunY: 180 }
```

---

## 3D Asset Layer

Drop any PNG/JPG as a grounded asset with perspective depth illusion.
For actual 3D models (GLB/OBJ), export a PNG sprite from Blender and use that.

```js
{
  type: 'asset-3d',
  src: 'assets/car.png',    // relative to project root
  x: 540, y: 1400,
  width: 340,               // render width
  height: 200,              // render height
  perspective: 0.2,         // 0 = flat, 0.3 = strong depth tilt
  shadow: true,             // drop shadow (default true)
  shadowBlur: 30,
  spin: false,              // slow horizontal spin
  spinSpeed: 0.4,
}
```

---

## Scene Props (8 types)

```js
{ type: 'scene-prop', propType: 'house',    x: 200, y: 1500, scale: 0.8 }
{ type: 'scene-prop', propType: 'tree',     x: 900, y: 1500, scale: 1.0 }
{ type: 'scene-prop', propType: 'road',     x: 540, y: 1600, length: 1080, scroll: true }
{ type: 'scene-prop', propType: 'bench',    x: 540, y: 1500 }
{ type: 'scene-prop', propType: 'lamp',     x: 800, y: 1500 }
{ type: 'scene-prop', propType: 'sign',     x: 540, y: 1500, text: 'STOP', fontSize: 28 }
{ type: 'scene-prop', propType: 'building', x: 200, y: 1500, width: 140, height: 320 }
{ type: 'scene-prop', propType: 'fence',    x: 540, y: 1600, length: 500 }
```

---

## Complete Scene Example

```js
{
  duration: 8,
  layers: [
    { type: 'gradient', colors: ['#87CEEB','#e0f4ff'], gradientType:'linear', angle:180 },
    { type: 'weather', effect: 'clouds', density: 0.4, speed: 0.3 },
    { type: 'scene-prop', propType: 'building', x: 150, y: 1520, scale: 0.9 },
    { type: 'scene-prop', propType: 'tree',     x: 950, y: 1520 },
    { type: 'scene-prop', propType: 'road',     x: 540, y: 1620, length: 1080, scroll: true },
    {
      type: 'stickman',
      characters: [
        { x: 300, y: 1520, skin: 'light', outfit:{ shirt:'#3a7bd5', pants:'#222' },
          sequence: [
            { t:0, action:'idle' },
            { t:2, action:'walk', toX:600, duration:2.5 },
            { t:4.5, action:'dance', style:'hype', duration:2 },
            { t:6.5, action:'excited' },
          ]
        },
        { x: 700, y: 1520, skin: 'brown', facing:-1,
          outfit:{ shirt:'#e74c3c', pants:'#333', hair:'#222' },
          action:{ type:'idle' }, expression:'happy',
          speechBubble:{ text:'Letsgooo!', type:'speech', startAt:6.5, duration:1.5 }
        },
      ]
    },
    { type: 'asset-3d', src:'assets/car.png', x:800, y:1500, width:280, perspective:0.15 },
  ]
}
```
