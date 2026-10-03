# APEX Engine — Beat Generation System
## Complete Reference v1.0

---

## Overview

The beat system generates an original music track — drums, bass, and melody — directly inside the CI pipeline. No external music service, no API key, no copyright risk. Every video gets a unique beat matched to its mood, key, and tempo.

The beat also exports a **timeline of every drum event** (kick, snare, hihat — each timestamped to the millisecond) that the engine injects into every layer's render state each frame. This means visual layers can literally pulse and flash on the exact frame a drum hit lands.

---

## How The Pipeline Works

```
output.beat config
       │
       ▼  Phase 0.4 — before TTS, before images
beat-gen.py           ← Python: MIDI generation via midiutil
       │
       ▼
FluidSynth + SF2      ← MIDI → WAV using a GM SoundFont
       │
       ▼
FFmpeg mastering      ← EQ + compressor + loudnorm per genre
       │
       ├── beat.wav           → replaces bgMusic, mixed under TTS
       └── beat-timeline.json → injected into all layer state objects
```

The beat is generated once and **cached by config hash**. The same beat config does not regenerate on subsequent pushes unless you change a parameter.

---

## Minimal Config

```js
output: {
  title:  'my-video',
  format: 'portrait',
  fps:    30,
  crf:    20,
  preset: 'fast',

  beat: {
    bpm:   90,
    bars:  16,
    genre: 'lofi',
    key:   'Amin',
  },
  // Do NOT add bgMusic when using beat — beat replaces it automatically
}
```

---

## Full Parameter Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `bpm` | number | `140` | Beats per minute. 60–200 practical range. |
| `bars` | number | `8` | Bars to generate before loop repeats. More bars = more variation. |
| `genre` | string | `'hiphop'` | Sets drum pattern, swing, bass line, melody instrument, and EQ. |
| `key` | string | `'Cmin'` | Musical key — root note + scale type. |
| `layers` | array | all | Which instrument layers to include. |
| `swing` | number | genre default | `0` = straight, `0.30` = heavy shuffle. Overrides genre default. |
| `reverb` | number | `0.2` | Room reverb size. `0` = dry, `1` = very spacious. |
| `loop` | boolean | `true` | Loop beat to fill full video duration. |
| `vol` | number | `0.18` | Mix volume under TTS voice. Use `0.85`–`1.0` for music videos with no TTS. |
| `soundfont` | string | auto | Path to a custom `.sf2` file. Leave blank — engine installs one automatically. |

---

## Genres

| Genre | BPM Range | Swing | Sound | Best Content Use |
|-------|-----------|-------|-------|-----------------|
| `hiphop` | 80–100 | 0.12 | Laid-back kick, swung hats, sawtooth lead | Finance, motivation, documentary |
| `trap` | 130–160 | 0.00 | Double kick, 16th hats, square bass | Hype, dark content, drill |
| `lofi` | 70–90 | 0.20 | Sparse kick, jazzy hats, piano melody | Calm, study, relationship advice |
| `cinematic` | 55–80 | 0.00 | No hats, deep bass drone, string ensemble | Documentary, emotional reveals |
| `edm` | 120–140 | 0.00 | 4-on-the-floor, open hats, sawtooth | Countdown reveals, stats, energy |
| `afrobeats` | 95–115 | 0.08 | Syncopated kick, dense hats, guitar melody | Lifestyle, culture, viral hooks |
| `drill` | 138–150 | 0.00 | Sliding kick, aggressive bass, square lead | Dark psychology, confrontational hooks |

---

## Keys

**Format:** Root note + scale suffix

```
Root notes:  C  Db  D  Eb  E  F  Gb  G  Ab  A  Bb  B
             (use sharps too: C#  D#  F#  G#  A#)

Scale types: maj  min  dorian  phrygian  mixolydian  pentatonic
```

**Full examples:**

```js
key: 'Amin'        // A natural minor    — emotional, melancholic
key: 'Cmin'        // C minor            — dark, serious, dramatic
key: 'Dmin'        // D minor            — brooding, deep
key: 'Fmaj'        // F major            — uplifting, warm
key: 'Gmaj'        // G major            — bright, positive
key: 'Ebmin'       // Eb minor           — heavy, intense
key: 'Adorian'     // A dorian           — soulful, classic hip-hop
key: 'Ephrygian'   // E phrygian         — tense, cinematic
key: 'Gpentatonic' // G pentatonic minor — open, versatile
```

**Quick emotional reference:**
- Minor → serious, sad, tense, cinematic
- Major → happy, uplifting, motivational
- Dorian → soulful, nostalgic, warm
- Phrygian → intense, cinematic, unsettling

---

## Instrument Layers

```js
layers: ['kick', 'snare', 'hihat', 'bass', 'melody']
```

| Layer | Sound | Remove when you want... |
|-------|-------|------------------------|
| `kick` | Bass drum | Floating, drumless atmosphere |
| `snare` | Snare / clap (genre-dependent) | More ambient, less rhythmic |
| `hihat` | Closed + open hi-hats | Sparse cinematic feel |
| `bass` | Bass line (fingered bass) | Pure percussion only |
| `melody` | Piano / strings / lead (genre-dependent) | Providing your own melodic content |

**Examples:**

```js
// Drums only — no tonal content
layers: ['kick', 'snare', 'hihat']

// Atmosphere with no percussion
layers: ['bass', 'melody']

// Cinematic bed — deep and spacious
genre: 'cinematic',
layers: ['kick', 'bass', 'melody']
```

---

## Beat-Reactive Layers

When a beat is configured, every layer render receives these helpers in `state`:

| Helper | Returns | Use for |
|--------|---------|---------|
| `state.onKick()` | `0.0`–`1.0` (1 = just hit, decays quickly) | Border flash, text scale burst, colour pop |
| `state.onSnare()` | `0.0`–`1.0` | Secondary pulse, colour shift |
| `state.onBeat()` | `0.0`–`1.0` (any drum hit) | General intensity, ambient pulse |
| `state.beatPos` | `0.0`–`3.99` (position in 4/4 bar) | Driving cyclic visual animations |
| `state.beatT` | looped beat time in seconds | Syncing custom HTML animations to beat |
| `state.beatTimeline` | full timeline object | Advanced: access all raw timestamped events |

**Built-in layers that already use beat state:**
- `audio-reactive-border` — flashes on kick, pulses on snare, uses `kickColor` if set
- `lyrics-line` — word glow intensity scales with audio amplitude

**Adding `kickColor` to the border:**
```js
{
  type:      'audio-reactive-border',
  color:     '#e8c84a',
  color2:    '#ff3b5c',
  kickColor: '#ffffff',   // flashes pure white on every kick hit
  thickness: 16,
}
```

---

## Lyrics Video Pipeline

This is how the beat system and lyrics system work together for a full music video.

### Mode 1 — Lyrics over generated beat (no TTS)

The engine generates the beat, you provide lyrics. The engine estimates word timing from the audio amplitude envelope.

```js
// In the scene:
{
  audioSrc:           null,       // null = uses generated beat audio
  lyricsText:         `Line one of your lyrics here
Line two goes on this line
And the third line here`,
  lyricsWordsPerLine: 4,          // words shown per line at once
  duration:           14,         // seconds this scene lasts

  layers: [
    {
      type:     'image',
      src:      'https://picsum.photos/seed/bg/1080/1920',
      kenBurns: 'zoom-in',
      kenBurnsAmount: 0.08,
    },
    { type: 'overlay', color: 'rgba(0,0,0,0.48)' },
    {
      type:         'lyrics-line',
      position:     'bottom',       // 'top' | 'middle' | 'bottom'
      yOffset:      -80,            // move up from default position
      fontSize:     88,
      fontFamily:   'Impact, Arial Black, sans-serif',
      activeColor:  '#e8c84a',      // current word — glows this colour
      pendingColor: '#ffffff',      // upcoming words
      doneColor:    'rgba(255,255,255,0.30)', // spoken words fade out
      strokeColor:  'rgba(0,0,0,0.90)',
      strokeWidth:  7,
      glowColor:    '#e8c84a',
      glowBlur:     35,
      lineRevealDur: 0.18,          // how fast each new line slides in
    },
    {
      type:      'audio-reactive-border',
      color:     '#e8c84a',
      color2:    '#ff3b5c',
      kickColor: '#ffffff',
      thickness: 16,
    },
  ],
}
```

### Mode 2 — Custom music file with lyrics

Provide your own audio file (local or URL). The engine downloads it, aligns the lyrics to it, and renders the karaoke display.

```js
{
  audioSrc:           './my-song.mp3',    // local file path
  // or:
  audioSrc:           'https://example.com/track.mp3',  // URL

  lyricsText:         `Your lyrics here
word by word
each line reveals`,
  lyricsWordsPerLine: 4,
  duration:           210,   // length of your song in seconds
  lyricsTiming:       'auto', // 'auto' (syllable estimator) | 'precise' (WhisperX if installed)

  layers: [ /* same as Mode 1 */ ]
}
```

### Mode 3 — Manually timed lyrics (perfect sync)

Provide exact word timestamps yourself for perfect sync with any audio:

```js
{
  audioSrc:  './my-song.mp3',
  duration:  210,
  lyricsWords: [
    { word: 'Never',  start: 0.45, end: 0.85 },
    { word: 'gonna',  start: 0.85, end: 1.10 },
    { word: 'give',   start: 1.10, end: 1.35 },
    { word: 'you',    start: 1.35, end: 1.55 },
    { word: 'up',     start: 1.55, end: 2.10 },
    // ... continue for every word
  ],
  lyricsWordsPerLine: 4,

  layers: [ /* lyrics-line layer etc */ ]
}
```

---

## Lyrics-Line Layer — Full Parameter Reference

```js
{
  type:           'lyrics-line',

  // Position
  position:       'bottom',      // 'top' | 'middle' | 'bottom'
  yOffset:        -80,           // pixel offset from the position anchor

  // Typography
  fontSize:       88,            // base font size (auto-shrinks if line too wide)
  fontFamily:     'Impact, Arial Black, sans-serif',

  // Colours — three states for each word
  activeColor:    '#e8c84a',     // word currently being spoken — lights up
  pendingColor:   '#ffffff',     // words not yet spoken
  doneColor:      'rgba(255,255,255,0.30)', // words already spoken — fades back

  // Stroke (for legibility over any background)
  strokeColor:    'rgba(0,0,0,0.90)',
  strokeWidth:    7,

  // Glow on active word
  glowColor:      '#e8c84a',
  glowBlur:       35,

  // Animation timing
  lineRevealDur:  0.18,          // seconds for each new line to slide in
}
```

---

## Beat Quality Guide

Quality depends on the SoundFont. With `fluid-soundfont-gm` (auto-installed):

| Genre | Quality | Notes |
|-------|---------|-------|
| `lofi` | ★★★★☆ | Piano and soft drums sound natural and warm |
| `cinematic` | ★★★★☆ | String ensemble and sparse drums work very well |
| `hiphop` | ★★★☆☆ | Good for background music under voice |
| `afrobeats` | ★★★☆☆ | Nylon guitar gives a nice marimba-adjacent feel |
| `edm` | ★★☆☆☆ | Sawtooth lead is basic — works for background |
| `trap` | ★★☆☆☆ | GM fonts don't do 808s justice — acceptable for BG use |
| `drill` | ★★☆☆☆ | Same limitation as trap |

**To get better quality:** Replace `fluid-soundfont-gm` with `GeneralUser GS` or a genre-specific SF2. Point to it via `beat.soundfont: '/path/to/font.sf2'`. The mastering chain (EQ + compression + -14 LUFS normalisation) runs regardless and brings any SF2 to a consistent broadcast level.

---

## Caching Behaviour

The beat is cached by a hash of the full `beat` config object. Meaning:

- Same config on every push → **no regeneration**, uses cached `beat.wav`
- Change `bpm`, `genre`, `key`, anything → **regenerates automatically**
- Cache lives in `work/beat/` directory which is cleaned up between runs unless you commit it

---

## Full Working Examples

See `config.beat-emotional.js` for a complete emotional beat + lyrics sync example.