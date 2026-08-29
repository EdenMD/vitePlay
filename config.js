// =============================================================================
// config.composition-7-rules.js — "7 Secret Rules for Great Compositions"
// A short (~2 min) educational video using the new
// ApexCasing/lesson-rules-explainer.html template.
// =============================================================================
//
// VOICE: af_kore — "Crisp, articulate — Education, tutorials, step-by-step
// content" per Voices.md. Chosen specifically for "calm and easily
// understandable": it's clearer/more measured than the bright/energetic
// voices (af_bella, af_sky) and more naturally instructional than the
// documentary-weight voices (am_adam, bm_george) used in other configs
// this session.
//
// STRUCTURE: one scene, one continuous narration. Only ONE rule card is
// ever dominant on screen — each new rule's trigger fires both an `erase`
// on the previous rule's elements AND the next `ruleCard`/progress update
// at the same moment (multiple commands can share an identical trigger;
// the engine fires everything that's ready each frame), so the board
// reads like a clean slide deck advancing one card at a time rather than
// stacking up clutter.
//
// A small progress pill ("RULE X OF 7") is created once and updated in
// place via `replace` on every subsequent rule — see the template's
// header doc for how 'replace' understands a progress-kind target.
//
// Two rules (4 and 6 — the ones that most benefit from a concrete example
// rather than just being told the rule) get a `beforeAfter` card: a weak
// example sentence struck through, then a stronger rewrite revealed in
// green a beat later.
//
// CONTENT NOTE: the seven rules below are standard, widely-taught writing
// pedagogy (outline first, hook the reader, one idea per paragraph, show
// don't tell, vary sentence length, use strong verbs, proofread aloud) —
// original phrasing, not sourced from or quoting any specific textbook or
// curriculum.
//
// Run with:  VIDEO_CONFIG=config.composition-7-rules.js node engine-ci.js

'use strict';

const LESSON_SRC = './lesson-rules-explainer.html';
const VOICE = 'af_kore';

const NARRATION = "Great compositions don't happen by accident, they follow a few simple habits, and I'm going to show you seven of them right now. Rule one: plan before you write. Before your pen even touches the page, sketch a quick outline, a beginning, a middle, and an end. Five minutes of planning saves you from getting lost halfway through. Rule two: hook your reader immediately. Don't open by restating the topic. Open with a question, a surprising detail, or a moment of action, something that makes your reader want the next sentence. Rule three: one idea per paragraph. Give every paragraph a clear topic sentence, then support it with details. If a paragraph is doing two jobs, split it into two. Rule four: show, don't just tell. Instead of writing it was a nice day, try sunlight spilled through the window and warmed the old wooden floor. Specific details let your reader see it, not just read it. Rule five: vary your sentence length. A string of short sentences feels choppy. A string of long ones feels exhausting. Mix them, and your writing gets a natural rhythm. Rule six: use strong verbs. Instead of she was very happy, try she beamed. Cut words like very and really, and let one strong verb do the work of three weak ones. Rule seven: always proofread out loud. Reading your composition aloud catches run-on sentences, awkward phrasing, and mistakes your eyes skip right over on a silent read. Master these seven, and your compositions won't just be correct, they'll actually be worth reading.";

const commands = [];

// ── Rule 1 ────────────────────────────────────────────────────────────────
commands.push(
  { id: 'prog', type: 'progress', current: 1, total: 7, x: 540, y: 130, trigger: { wordText: 'plan', occurrence: 1 } },
  { id: 'r1', type: 'ruleCard', number: 1, title: 'Plan Before You Write', tip: 'Sketch a quick outline: a beginning, a middle, and an end.', x: 540, y: 760, trigger: { afterId: 'prog', offset: 0 } },
);

// ── Rule 2 ────────────────────────────────────────────────────────────────
commands.push(
  { id: 'erase_r1', type: 'erase', target: 'r1', trigger: { wordText: 'hook', occurrence: 1 } },
  { id: 'prog2', type: 'replace', target: 'prog', current: 2, trigger: { wordText: 'hook', occurrence: 1 } },
  { id: 'r2', type: 'ruleCard', number: 2, title: 'Hook Your Reader Immediately', tip: "Open with a question or a surprise, not a restated topic.", x: 540, y: 760, trigger: { wordText: 'hook', occurrence: 1 } },
);

// ── Rule 3 ────────────────────────────────────────────────────────────────
commands.push(
  { id: 'erase_r2', type: 'erase', target: 'r2', trigger: { wordText: 'paragraph', occurrence: 1 } },
  { id: 'prog3', type: 'replace', target: 'prog', current: 3, trigger: { wordText: 'paragraph', occurrence: 1 } },
  { id: 'r3', type: 'ruleCard', number: 3, title: 'One Idea Per Paragraph', tip: 'A clear topic sentence, then supporting details. That\u2019s it.', x: 540, y: 760, trigger: { wordText: 'paragraph', occurrence: 1 } },
  { id: 'i_split', type: 'icon', icon: 'mdi:call-split', x: 540, y: 1150, size: 90, bg: 'circle', color: '#2f6fed', trigger: { wordText: 'split', occurrence: 1 } },
  { id: 'erase_split', type: 'erase', target: 'i_split', trigger: { wordText: 'show', occurrence: 2 } },
);

// ── Rule 4 (with before/after example) ──────────────────────────────────
commands.push(
  { id: 'erase_r3', type: 'erase', target: 'r3', trigger: { wordText: 'show', occurrence: 2 } },
  { id: 'prog4', type: 'replace', target: 'prog', current: 4, trigger: { wordText: 'show', occurrence: 2 } },
  { id: 'r4', type: 'ruleCard', number: 4, title: "Show, Don't Just Tell", tip: 'Specific detail lets your reader see it, not just read it.', x: 540, y: 700, trigger: { wordText: 'show', occurrence: 2 } },
  { id: 'ba4', type: 'beforeAfter', before: 'It was a nice day.', after: 'Sunlight spilled through the window and warmed the old wooden floor.', x: 540, y: 1150, width: 820, afterDelay: 1.0, trigger: { afterId: 'r4', offset: 0.6 } },
);

// ── Rule 5 ────────────────────────────────────────────────────────────────
commands.push(
  { id: 'erase_r4', type: 'erase', target: 'r4', trigger: { wordText: 'vary', occurrence: 1 } },
  { id: 'erase_ba4', type: 'erase', target: 'ba4', trigger: { wordText: 'vary', occurrence: 1 } },
  { id: 'prog5', type: 'replace', target: 'prog', current: 5, trigger: { wordText: 'vary', occurrence: 1 } },
  { id: 'r5', type: 'ruleCard', number: 5, title: 'Vary Your Sentence Length', tip: 'Mix short and long sentences for a natural rhythm.', x: 540, y: 760, trigger: { wordText: 'vary', occurrence: 1 } },
  { id: 'i_choppy', type: 'icon', icon: 'mdi:waveform', x: 350, y: 1150, size: 90, bg: 'square', color: '#e2574c', trigger: { wordText: 'choppy', occurrence: 1 } },
  { id: 'i_rhythm', type: 'icon', icon: 'mdi:wave', x: 730, y: 1150, size: 90, bg: 'square', color: '#1f9d55', trigger: { wordText: 'rhythm', occurrence: 1 } },
  { id: 'erase_choppy', type: 'erase', target: 'i_choppy', trigger: { wordText: 'strong', occurrence: 1 } },
  { id: 'erase_rhythm', type: 'erase', target: 'i_rhythm', trigger: { wordText: 'strong', occurrence: 1 } },
);

// ── Rule 6 (with before/after example) ──────────────────────────────────
commands.push(
  { id: 'erase_r5', type: 'erase', target: 'r5', trigger: { wordText: 'strong', occurrence: 1 } },
  { id: 'prog6', type: 'replace', target: 'prog', current: 6, trigger: { wordText: 'strong', occurrence: 1 } },
  { id: 'r6', type: 'ruleCard', number: 6, title: 'Use Strong Verbs', tip: "Cut \u2018very\u2019 and \u2018really.\u2019 One strong verb beats three weak ones.", x: 540, y: 700, trigger: { wordText: 'strong', occurrence: 1 } },
  { id: 'ba6', type: 'beforeAfter', before: 'She was very happy.', after: 'She beamed.', x: 540, y: 1150, width: 820, afterDelay: 1.0, trigger: { afterId: 'r6', offset: 0.6 } },
);

// ── Rule 7 ────────────────────────────────────────────────────────────────
commands.push(
  { id: 'erase_r6', type: 'erase', target: 'r6', trigger: { wordText: 'proofread', occurrence: 1 } },
  { id: 'erase_ba6', type: 'erase', target: 'ba6', trigger: { wordText: 'proofread', occurrence: 1 } },
  { id: 'prog7', type: 'replace', target: 'prog', current: 7, trigger: { wordText: 'proofread', occurrence: 1 } },
  { id: 'r7', type: 'ruleCard', number: 7, title: 'Always Proofread Out Loud', tip: 'Catches run-ons and awkward phrasing your eyes skip over.', x: 540, y: 760, trigger: { wordText: 'proofread', occurrence: 1 } },
  { id: 'i_aloud', type: 'icon', icon: 'mdi:volume-high', x: 540, y: 1150, size: 90, bg: 'circle', color: '#2f6fed', trigger: { wordText: 'aloud', occurrence: 1 } },
);

// ── Close ─────────────────────────────────────────────────────────────────
commands.push(
  { id: 'erase_r7', type: 'erase', target: 'r7', trigger: { wordText: 'reading', occurrence: 1 } },
  { id: 'erase_aloud', type: 'erase', target: 'i_aloud', trigger: { wordText: 'reading', occurrence: 1 } },
  { id: 'erase_prog', type: 'erase', target: 'prog', trigger: { wordText: 'reading', occurrence: 1 } },
  { id: 'r_final', type: 'sticker', text: 'MASTER ALL 7', x: 540, y: 800, size: 62, rotate: -1, trigger: { wordText: 'reading', occurrence: 1 } },
  { id: 'lbl_final', type: 'label', text: 'and your writing will actually be worth reading.', x: 540, y: 900, size: 30, trigger: { afterId: 'r_final', offset: 0.3 } },
);

module.exports = {
  output: {
    title: 'composition-7-secret-rules', format: 'portrait', fps: 30, crf: 20, preset: 'medium',
    bgMusicVol: 0.06, bgMusic: { mood: 'calm' },
  },
  defaults: { voice: VOICE, speed: 1.0, transition: 'fade' },
  scenes: [
    {
      tts: { text: NARRATION, voice: VOICE, emotion: 'neutral' },
      captions: {
        style: 'highlight', position: 'bottom', fontSize: 52, color: '#1c2230',
        highlightColor: '#2f6fed', bgColor: 'rgba(255,255,255,0.85)', wordsPerChunk: 3, maxWidth: 0.88,
      },
      layers: [
        {
          type: 'html-record', src: `${LESSON_SRC}?tag=composition-7-rules-v1`, audioSync: true,
          waitFor: '[data-ready="1"]',  fps: 30,
          viewport: { width: 1080, height: 1920 }, x: 0, y: 0, width: 1080, height: 1920, fit: 'cover',
          data: { title: '7 SECRET RULES FOR GREAT COMPOSITIONS', commands },
        },
      ],
    },
  ],
};