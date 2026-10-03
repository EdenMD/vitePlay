# APEX Engine — Voice Guide & Multi-Language Content
**Last updated:** June 21, 2026

---

## 1. Voice Catalogue — When to Use Each One

Kokoro-82M ships with voices across 9 languages. `lang_code` is auto-resolved from the first character of the voice name (`a`=American EN, `b`=British EN, `j`=Japanese, `z`=Mandarin, `e`=Spanish, `f`=French, `h`=Hindi, `i`=Italian, `p`=Portuguese). Below is what each is actually good for, based on voice character — not guesswork.

### American English

| Voice | Character | Best for |
|---|---|---|
| `af_heart` | Warm, expressive | Default/general-purpose female voice. Safe pick when you're unsure. |
| `af_bella` | Bright, clear | Upbeat lifestyle, product reveals, fun/positive content |
| `af_sarah` | Natural, conversational | Storytelling, personal narrative, vlogs |
| `af_nicole` | Soft, gentle | Calm topics, meditation, ASMR-adjacent, bedtime/wellness |
| `af_sky` | Energetic, youthful | Entertainment, Gen Z-targeted, fast-paced reveals |
| `af_aoede` | Melodic, smooth | Narrative/story-driven content, emotional arcs |
| `af_kore` | Crisp, articulate | Education, tutorials, step-by-step content |
| `af_nova` | Confident, modern | Tech, corporate, SaaS/product content |
| `af_river` | Calm, flowing | Documentary, nature, slow-paced reflective content |
| `am_adam` | Authoritative, deep | **Your current default for finance/discovery content** — documentary, money topics, "here's the real reason" reveals |
| `am_michael` | Friendly, mid-range | Casual explainers, tutorials, approachable how-to |
| `am_fenrir` | Deep, gravelly | Drama, thriller, dark/intense topics |
| `am_puck` | Light, playful | Comedy, lifestyle, lighthearted content |
| `am_echo` | Resonant, clear | News-style delivery, announcements |
| `am_eric` | Warm, trustworthy | Brand storytelling, explainer content |
| `am_liam` | Young, energetic | Sports, gaming, high-energy youth content |
| `am_onyx` | Smooth, velvety | Luxury, premium products, high-end aesthetic |
| `am_santa` | Jolly, booming | Festive/character content, seasonal |

### British English

| Voice | Character | Best for |
|---|---|---|
| `bf_emma` | Refined, articulate | Formal education, academic topics |
| `bf_isabella` | Warm, storytelling | History, narrative-driven content |
| `bf_alice` | Elegant, precise | Corporate, luxury brand content |
| `bf_lily` | Bright, charming | Lifestyle, travel content |
| `bm_george` | Deep, commanding | **Your current default for documentary/dark content** — history, "they never taught you this," weighty reveals |
| `bm_lewis` | Crisp, professional | News, finance-adjacent factual content |
| `bm_daniel` | Authoritative, measured | Politics, history, serious subject matter |
| `bm_fable` | Dramatic, theatrical | Storytelling with a performative edge — folklore, myths |
| `bm_will` | Casual, conversational | Vlog-style, podcast-style delivery |

### Other Languages

| Voice | Language | Character |
|---|---|---|
| `jf_alpha`, `jf_gongitsune`, `jf_nezumi`, `jf_tebukuro` | Japanese (female) | Soft/anime-style, storytelling, gentle |
| `jm_kumo` | Japanese (male) | Deep, dramatic |
| `zf_xiaobei`, `zf_xiaoni`, `zf_xiaoxiao`, `zf_xiaoyi` | Mandarin (female) | Warm to energetic range |
| `zm_yunxi`, `zm_yunxia`, `zm_yunyang` | Mandarin (male) | Authoritative to warm range |
| `ef_dora`, `em_alex`, `em_santa` | Spanish | Warm/expressive, authoritative, festive |
| `ff_siwis` | French (female) | Elegant, articulate |
| `hf_alpha`, `hf_beta`, `hm_omega`, `hm_psi` | Hindi | Warm to authoritative range |
| `if_sara`, `im_nicola` | Italian | Warm, authoritative |
| `pf_dora`, `pm_alex`, `pm_santa` | Portuguese | Warm, authoritative, festive |

### Practical picking rule
Match voice character to emotional register, not just gender. A "wait for it" reveal video wants `am_adam` or `bm_george` (authority + weight). A relatable everyday-curiosity video (like the tickle/dog-tilt configs) wants `am_adam` or `af_sarah` (warm, conversational) over something as heavy as `bm_george`.

---

## 2. Multi-Language Configs — Yes, Fully Supported

Since `lang_code` resolves automatically from the voice name, you can build configs in any of the 9 supported languages just by setting `defaults.voice` (or per-scene `tts.voice`) to a voice from that language. The engine doesn't need separate setup — same layer system, same captions system, same SerpAPI image resolution all work identically regardless of language.

**Two ways to structure a multi-language video:**

**A. Single-language config (most common)** — pick one voice, write `tts.text` in that language throughout. Captions will display whatever text you write in `tts.text`, so non-Latin scripts (Mandarin, Japanese, Hindi) render fine as long as the font family supports the character set — stick to system-default fonts for non-Latin scripts rather than `Impact`/`Arial Black`, which may not have full glyph coverage.

**B. Mixed-language config (language teaching specifically)** — alternate `tts.voice` scene by scene. Example structure for a "Spanish word of the day" video:
- Scene 1: `am_adam` (English) — hook, explains the word
- Scene 2: `ef_dora` (Spanish) — says the word/phrase itself, slowly
- Scene 3: `am_adam` (English) — breaks down usage/grammar
- Scene 4: `ef_dora` (Spanish) — example sentence
- Scene 5: `am_adam` (English) — recap + CTA

This pattern (native-language explanation + target-language audio) is the actual mechanism that makes language-learning short-form content work — see section 3.

**Caption sync caveat for language learning:** for language teaching specifically, set `subtitleBurn: 'whisperx'` on the scenes where the target-language phrase is spoken. Word-perfect timing matters more here than anywhere else — a caption that's a half-beat off undermines the entire pronunciation-matching value of the video.

---

## 3. How Language-Teaching Content Performs

Researched current data rather than assuming — here's what's actually happening with language content on short-form platforms right now.

### The category is strong, with real nuance

Educational content broadly is TikTok's strongest-performing category by engagement: **roughly 9.5% average engagement rate**, well above the platform's overall average. Within education specifically, smaller/newer accounts see the best relative engagement — accounts under 15,000 followers reach the highest engagement rates of any account size tier, meaning a new language-content account isn't at a structural disadvantage the way it might be in a saturated entertainment category.

There's also a real, measured learning outcome behind it — one academic study comparing TikTok-supplemented English learners against a traditional-classroom-only control group found the TikTok group improved nearly **3x more** on listening comprehension, pronunciation, and vocabulary post-tests. This isn't just engagement theater — short-form repetition genuinely seems to help acquisition, which is worth knowing if you're deciding whether this content pillar is worth committing to.

### What actually works in language content specifically

- **Micro-lessons (25–45 seconds)** focused on ONE specific thing — one grammar rule, one phrase set ("5 ways to say hello"), one common mistake — outperform broader lessons. This matches your engine's existing "Top 5" countdown format well.
- **Word-by-word highlighted captions** (karaoke-style) are explicitly called out as the format that drives retention and comprehension for language content — this is exactly what `subtitleBurn: 'whisperx'` + the `highlight` caption style gives you natively.
- **Hook in the first 2–3 seconds** is non-negotiable — a question, a common mistake, or a surprising fact. Same rule as your other content, language learning isn't exempt.
- **Common mistake/correction format** ("the difference between X and Y") performs specifically well as a sub-genre — this maps cleanly onto your "everybody does this but doesn't know why" content philosophy already proven in the dog-tilt/tickle configs.

### Honest comparison to your other formats

Based on what we've established works for your channel (rating/countdown format gets ~234–389 view death point vs ~182 for quotes), language content sits in an interesting middle position:
- It has genuinely higher *engagement rate* than almost anything else on the platform (the 9.5% figure)
- But it's a **search/intent-driven category** (#LearnOnTikTok pulls users actively looking to learn) rather than a pure-discovery/FYP category — meaning growth may be slower initially but more durable, since language learners tend to follow accounts and return repeatedly rather than watching once and scrolling on
- It likely will NOT replicate your rating-video view ceiling out of the gate, but the engagement quality (saves, follows, return viewers) could compound differently than viral-but-disposable rating content

### Recommendation
Worth testing as a **second content pillar**, not a replacement for your rating-video format. The two serve different goals: rating/reveal videos for reach and account growth, language micro-lessons for a stickier, more loyal sub-audience that returns and follows specifically because of the educational value. Given your audience is Africa/Zimbabwe-focused, a strong angle worth testing: English idiom/slang breakdowns, or teaching a regional language (Shona, Ndebele) to a global audience — this would be a genuinely underserved niche compared to the oversaturated Spanish/French language-learning space on TikTok.

---

## 4. Quick Reference — Voice + Use Case Cheat Sheet

| Content type | Recommended voice |
|---|---|
| Money/finance reveal | `am_adam` |
| History/dark documentary | `bm_george` |
| Everyday curiosity ("why does X happen") | `am_adam` or `af_sarah` |
| Animal/nature facts | `bm_george` (authority) or `am_adam` (warmth) depending on tone |
| Language teaching — English explainer side | `am_adam` or `bf_emma` (clear articulation) |
| Language teaching — target language audio | Match the language's native voice (e.g. `ef_dora` for Spanish) |
| Luxury/premium product content | `am_onyx` |
| Comedy/lighthearted | `am_puck` |
| Emotional/grief content (e.g. "The Last Text") | `bm_george` slowed down, or `af_river` for a softer take |

---

*This document should be revisited as more posting data comes in — particularly the multi-language and language-teaching hypothesis, which is untested on this specific account so far.*