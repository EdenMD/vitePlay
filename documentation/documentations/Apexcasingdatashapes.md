# ApexCasing — Data Shape Reference

Field-by-field schema for `window.__APEX_DATA__` / `layer.data` for every file in `ApexCasing/`. This is the lookup doc when you're writing a config and need to know exactly what keys a template expects — for the conceptual explanation (what ApexCasing is, folder convention, caching gotcha, how to build a new one) see `ApexCasing.md` instead. This doc is schemas only, kept easy to scan and easy to extend.

**Type notation:** `string`, `number`, `boolean`, `string[]`, `{...}[]` (array of objects — expanded in its own row below), `'a' | 'b'` (must be one of these literal values). **Req** = required for the template to render meaningfully; unset optional fields fall back to the default shown, or to the template's own hardcoded default if no default is listed.

---

## `recap-board.html`

Ranked list recap — titled heading + N rows (rank badge, name, stat line), staggered top-to-bottom reveal.

| Field | Type | Req | Default | Notes |
|---|---|---|---|---|
| `title` | `string` | no | `'RECAP'` | Heading text |
| `items` | `{...}[]` | yes | `[]` | Rendered in array order, top to bottom |
| `items[].rank` | `number \| string` | yes | — | Displayed as `#<rank>`; rank `1` gets a gold accent color automatically |
| `items[].name` | `string` | yes | — | |
| `items[].stat` | `string` | no | `''` | Secondary line under the name |

```js
data: {
    title: 'RECAP',
    items: [
        { rank: 5, name: 'Landmines', stat: 'Still killing decades later' },
        { rank: 1, name: 'The AK-47', stat: 'the twist ending' },
    ],
}
```

---

## `data-table.html`

Comparison / spec table — header row, N labeled rows, per-column value or ✓/✗ icon, optional highlighted "winner" column.

| Field | Type | Req | Default | Notes |
|---|---|---|---|---|
| `title` | `string` | no | `''` | Heading above the table |
| `columns` | `string[]` | yes | `[]` | Column headers, left to right |
| `highlightColumn` | `number` | no | `undefined` (none) | 0-indexed into `columns` — that column + its cells get the gold accent treatment |
| `rows` | `{...}[]` | yes | `[]` | |
| `rows[].label` | `string` | yes | — | Row header (left column) |
| `rows[].values` | `string[]` | yes | `[]` | One entry per column, same order as `columns`. Special values `'check'` and `'x'` render as ✓/✗ icons; anything else renders as plain text |

```js
data: {
    title: 'AK-47 vs M16',
    columns: ['AK-47', 'M16'],
    highlightColumn: 0,
    rows: [
        { label: 'Reliability', values: ['check', 'x'] },
        { label: 'Cost (USD)',  values: ['~$800', '~$1,200'] },
    ],
}
```

---

## `code-block.html`

Syntax-highlighted code snippet in a fake editor window (traffic-light dots, filename tab, language badge, line numbers).

| Field | Type | Req | Default | Notes |
|---|---|---|---|---|
| `filename` | `string` | no | `''` | Shown in the titlebar tab |
| `language` | `string` | no | `''` | Cosmetic badge only — doesn't change highlighting rules |
| `lines` | `string[]` | yes | `[]` | One array entry per line of code, rendered in order with line numbers |
| `highlightLines` | `number[]` | no | `[]` | 0-indexed line numbers to accent (left border + tinted background) |

```js
data: {
    filename: 'engine-ci.js',
    language: 'javascript',
    lines: [
        'async function generateAIImages(scenes, workDir) {',
        '  const aiDir = path.join(workDir, "ai-images");',
        '  // ...',
        '}',
    ],
    highlightLines: [1],
}
```

Highlighting is regex-based (keywords, strings, comments, numbers, function-call names) — good enough for a few seconds on screen, not a real parser. Very long lines will overflow the fixed-width window rather than wrap; keep lines short (under ~60 chars at default font size).

---

## `flip-countdown.html`

Mechanical split-flap character reveal (real 3D flip, not a slide) — one hinged card per character, staggered left to right.

| Field | Type | Req | Default | Notes |
|---|---|---|---|---|
| `value` | `string` | yes | `'404'` | Any characters — digits get the full flip-card treatment; non-digits (commas, `+`, letters) render as plain fading text in a narrower slot |
| `label` | `string` | no | `''` | Caption below the flip row |
| `accent` | `string` (CSS color) | no | `'#ff2b2b'` | Digit/label color |

```js
data: { value: '250,000+', label: 'DEATHS PER YEAR', accent: '#ff2b2b' }
```

Keep `value` to roughly 8–10 characters or fewer — each digit card is a fixed 110px wide and the row doesn't wrap, so a long string will run off the 1080px stage width.

---

## `social-post-mockup.html`

Realistic social post card — avatar, name + verified badge, handle, body text, timestamp, engagement row (replies/reposts/likes).

| Field | Type | Req | Default | Notes |
|---|---|---|---|---|
| `name` | `string` | yes | — | Display name |
| `handle` | `string` | no | `''` | e.g. `'@handle'` — no `@` is auto-added, include it yourself |
| `verified` | `boolean` | no | `false` | Shows the blue checkmark badge next to `name` if true |
| `avatarInitials` | `string` | no | `''` | 1–2 characters shown in the avatar circle |
| `avatarColor` | `string` (CSS color) | no | `'#7c5cff'` | Avatar circle background |
| `text` | `string` | yes | — | Post body — reflows naturally, no manual line breaks needed |
| `timestamp` | `string` | no | `''` | e.g. `'2h'`, `'Jul 12'` — freeform, not parsed |
| `replies` | `string \| number` | no | `'0'` | Displayed as-is — pass pre-formatted strings like `'12.4K'` |
| `reposts` | `string \| number` | no | `'0'` | |
| `likes` | `string \| number` | no | `'0'` | |

```js
data: {
    name: 'Dr. Sarah Chen', handle: '@drsarahchen', verified: true,
    avatarInitials: 'SC', avatarColor: '#7c5cff',
    text: 'This finding completely changes how we think about the topic...',
    likes: '12.4K', reposts: '3,201', replies: '842', timestamp: '2h',
}
```

Engagement counts are not formatted/abbreviated by the template — pass the exact string you want shown (`'12.4K'`, not `12400`).

---

## `glass-stat-card.html`

Frosted-glass (`backdrop-filter: blur`) card with a big value + caption, over an animated blurred gradient background.

| Field | Type | Req | Default | Notes |
|---|---|---|---|---|
| `value` | `string` | yes | — | The large headline text/number |
| `caption` | `string` | no | `''` | Smaller line beneath `value` |
| `gradientA` | `string` (CSS color) | no | `'#ff2b6e'` | Background gradient start color |
| `gradientB` | `string` (CSS color) | no | `'#4d7cff'` | Background gradient end color |

```js
data: { value: '$2.4M', caption: 'raised in the first 48 hours', gradientA: '#ff2b6e', gradientB: '#4d7cff' }
```

`value` isn't font-size-clamped to length — very long values (beyond ~10-12 characters at the default 130px size) will overflow the 780px-wide card. Keep it short and punchy; this template is built for one big number/phrase, not a sentence.

---

## `route-map.html`

Origin → destination journey visual — two labeled markers connected by an animated dashed arc over a dot-matrix globe motif.

| Field | Type | Req | Default | Notes |
|---|---|---|---|---|
| `fromLabel` | `string` | yes | — | Label at the origin marker |
| `toLabel` | `string` | yes | — | Label at the destination marker |
| `caption` | `string` | no | `''` | Line below the globe |
| `accent` | `string` (CSS color) | no | `'#ff2b2b'` | Route line, markers, and glow color |

```js
data: { fromLabel: 'MOSCOW', toLabel: 'STOCKHOLM', caption: 'Smuggled across the border in under 6 hours', accent: '#ff2b2b' }
```

Marker positions are fixed within the template (not derived from real coordinates) — this is intentionally an abstract "A to B" visual, not a geographically accurate map. See the template's own header comment for why no real map path data is bundled.

---

## Adding A New ApexCasing Template To This Doc

When you build a new file for `ApexCasing/`, add its schema here using the same format as the entries above, so this stays the single place to look up any template's expected `data` shape:

```markdown
## `your-template-name.html`

One-line description of what it renders.

| Field | Type | Req | Default | Notes |
|---|---|---|---|---|
| `fieldName` | `string` | yes | — | What it controls |

\`\`\`js
data: { fieldName: 'example value' }
\`\`\`

Any size limits, formatting expectations, or gotchas worth calling out (e.g. "keep under N characters," "pass pre-formatted strings, not raw numbers").
```

Keep each entry self-contained — someone should be able to read just one template's section and have everything they need to write a working `layer.data` object, without having to cross-reference other templates. For the *conceptual* side of adding a new template (folder convention, fallback-default pattern, `data-ready` timing, cache-key tagging for reuse) see `ApexCasing.md`'s "How To Create Your Own ApexCasing File" section — this doc intentionally doesn't repeat that, to avoid the two docs drifting out of sync with each other.