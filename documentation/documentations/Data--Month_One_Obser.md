# APEX Content Strategy — Field Documentation
**Compiled from one month of live posting data**
**Last updated:** June 19, 2026

---

## 1. Posting Schedule

Based on observed performance across a month of posts:

| Day Type | Optimal Times (local/CAT) |
|---|---|
| Weekdays | 13:00 / 18:00 / 22:00 |
| Weekends | 09:00 / 15:00 / 22:00 |

**Why this likely works:** weekday slots line up with lunch break scrolling (13:00), commute/end-of-work wind-down (18:00), and pre-sleep scrolling (22:00). Weekend mornings (09:00) catch people before the day fills up, and 15:00 catches the early-afternoon lull. The 22:00 slot is consistent across both weekday and weekend — it's likely your most reliable anchor time.

---

## 2. Content Format Performance

### The core pattern: retention beats sentiment

The single biggest lesson from a month of data — **a video that holds attention to the end consistently outperforms a video that gets strong reactions but loses viewers early.** This shows up clearly when comparing quote/motivation content against ranked list content.

### Quotes / Motivation Content
- **Strong engagement, weak reach.** A quote video can pull 15 likes and still die at 182 views.
- Quotes don't trigger a dopamine/curiosity loop — there's no "I need to see what's next" pull, so the algorithm doesn't see the retention signal it rewards.
- **Keep quote videos under 35 seconds.** Longer quote content sees a drop-off; brevity matches the format's natural consumption pattern.
- Engagement (likes/comments per view) on quotes is genuinely good — the format works for the people who do watch, just fewer people make it through the funnel.

### Ranked / Rating Videos (Top 5 style)
- **Lower engagement rate, meaningfully higher view ceiling.** A rating video might pull only 7-8 likes but die at 234–389 views — roughly double the death point of a quote video.
- The countdown structure (5 → 1) creates a structural curiosity gap: viewers stay because they want to see what's ranked higher, especially when the format teases a surprising or counter-intuitive #1.
- **Scary reveal / twist-ending videos follow the same mechanic** — the payoff is withheld until the end, so completion rate stays high even when per-like engagement is lower.

### Documentary-Style Content
- Underperforms relative to other formats — averaging around 160 views regardless of topic quality.
- **Important nuance:** a documentary-style video that uses a **listing or rating structure** (e.g. "5 facts about X" framed documentary-style) performs noticeably better than a straight narrative documentary. The structural hook (numbered countdown) appears to matter more than the subject matter itself.

### Practical takeaway for content selection
When choosing a topic, the format matters as much as the subject. Prioritize:
1. Ranked/countdown structures (Top 5, Top 10)
2. Twist or reveal endings
3. Anything that creates a "wait for it" curiosity gap

Deprioritize, or use sparingly:
1. Pure quote/motivational content (good for engagement variety, not growth)
2. Straight narrative documentary with no ranking/list structure

---

## 3. View Growth Pattern — Account Maturity Curve

Observed staged growth, **heavily dependent on content format choice**:

| Stage | Videos Posted | Typical View Range (quotes/motivation) | Typical View Range (rating/list videos) |
|---|---|---|---|
| Stage 1 | First ~5 videos | 70–80 views (rarely above 150) | Higher baseline, format-dependent |
| Stage 2 | Next ~5 videos | 180–200 views | Continues climbing faster |

**Key insight:** quote/motivation content does not reward the algorithm with strong dopamine/completion signals, so the early growth curve is slower and flatter. Choosing rating/list videos from the start produces a steeper growth gradient — more views earlier, even though per-video engagement (likes) may be lower initially. Engagement on rating content tends to catch up and grow over time as the audience base grows, whereas the view ceiling on quote content stays comparatively capped regardless of audience size.

### The "death rate" target
A consistent **average death point of 300–400 views** appears to be a meaningful threshold — videos that consistently reach this range seem to train the algorithm to extend reach to more users over time. This isn't a hard rule but a pattern worth tracking: if your last several videos are dying in the 300–400 range, that's a sign of healthy algorithmic trust building, not a plateau to be worried about.

---

## 4. Distribution Channel Notes

- **Cross-posting video links to channels you control (e.g. a WhatsApp channel) measurably helps.** Even a small but warm audience clicking through early appears to give the algorithm an early positive signal, which compounds with organic discovery.
- This is a low-effort, repeatable habit worth building into the standard publishing checklist for every video.

---

## 5. AI Tooling — Config Generation Comparison

Field-tested performance of different AI assistants when given the APEX engine documentation and asked to generate video configs. Scored on: documentation comprehension, accuracy of generated config syntax, and (where relevant) UI/layout judgment for visual layers.

| Tool | Score | Notes |
|---|---|---|
| **Claude.ai (this assistant)** | 9.5/10, up to 10/10 with extended effort/research prompting | Best overall comprehension of the engine's full documentation set. When explicitly prompted to increase effort or research before generating, output quality reaches consistent 10/10 — correctly reasons about layer composition, caption sync, transition pacing, and SerpAPI/stock-image cache behavior without hand-holding. |
| **Gemini (Flash tier)** | 8/10, improves with Pro tier | Suffers specifically with **UI/layout handling** — struggles to reason about visual composition (text overlap, layer stacking order, safe zones) even when the engine's own reflow/overlap-prevention system is available to lean on. Strong on raw text/logic tasks, weaker on spatial/visual judgment. |
| **Replit Agent** | 9.8/10 | Strongest practical performance observed. Handles the engine's file structure and config generation reliably with very few corrections needed. |
| **ChatGPT** | 9/10 | Excellent at prompt-level reasoning and creative config writing, but **fails to ingest large documentation via repo URL** — needs documentation pasted/chunked manually rather than fetched and read in full context. |
| **Meta AI (WhatsApp)** | Low — usable only with heavy chunking | Cannot handle the full documentation in one pass; large docs must be split into small chunks. Even when chunked, it frequently **forgets earlier context and features** within the same conversation, leading to configs that omit or contradict established constraints (e.g. forgetting "no bgMusic" rules established earlier in chat). |

### Why this pattern shows up
The common thread across the weaker performers (Gemini Flash, Meta AI) is **context retention and spatial/visual reasoning** — both are harder problems than raw text generation. Tools that read the *entire* documentation set in one pass and retain it across a long conversation (rather than summarizing/forgetting) consistently produce configs that respect constraints set earlier (voice choices, no-bgMusic rules, transition restrictions, etc.).

### Suggested tools worth testing for UI-heavy work
Since layout/visual judgment is the most common failure point, the following are worth testing specifically for that strength, based on current model landscape (as of mid-2026):

- **Claude Opus (the larger tier above Sonnet)** — if available to you, Opus-tier models generally show stronger multi-step visual/spatial reasoning than Sonnet-tier, which could help further with complex multi-layer scene composition (e.g. dense stat-counter + text + image layouts where overlap avoidance matters).
- **Gemini 3 Pro (not Flash)** — independent comparisons suggest the Pro tier handles "screenshot-to-UI" and front-end-style visual layout tasks meaningfully better than Flash. If Gemini is part of your toolkit, it's worth testing Pro specifically for layout-heavy configs (e.g. multi-photo gallery scenes) rather than Flash.
- **GPT-5-class models (Codex variant)** — strong on structured output and agentic loops; worth testing if you need an alternative for batch config generation, though you'd still need to chunk/paste documentation manually based on current behavior.

**General recommendation:** for this engine specifically, since layer positioning, caption safe-zones, and overlap logic matter as much as raw syntax correctness, prioritize tools that (a) can ingest your full documentation set without chunking and (b) demonstrate strong spatial reasoning, not just code-completion ability. Test any new tool on a layout-dense config (multiple stat-counters, text blocks, and stock-image insets in one scene) before trusting it for production use — that's the scenario where weaker tools reveal themselves fastest.

---

## 6. Open Questions / Worth Tracking Next

- Does the 300–400 death-rate pattern hold as the account grows past Stage 2, or does the target threshold shift upward with audience size?
- Does combining a rating/list structure with a twist ending (e.g. "Top 5 — but #1 will shock you") outperform either format alone?
- Is the WhatsApp channel cross-post effect consistent, or does it taper off as organic reach grows?
- Worth a controlled side-by-side: same topic, same voice, one cut as straight documentary vs one cut as a numbered list — isolate whether it's the *topic* or the *structure* driving the documentary underperformance.

---

*This document reflects one month of observed posting data and should be treated as a working hypothesis, not a fixed rulebook. Patterns may shift as the account grows and the algorithm's behavior toward the account matures.*
