# Article prompt shortcuts

Use this file together with:
- `BD/ARTICLE_AUTHORING_GUIDE.md`
- `BD/DB_CONTEXT.md`
- `BD/ARTICLE_WORKFLOW.md`

These shortcuts are intended to reduce prompt size and keep article work consistent.

---

## Shortcut 1 — Create RU+EN article pair for a tool

Use this when the task is:
- write a new article for a tool
- create both Russian and English versions
- prepare both for publishing

Expected behavior:
- create RU article
- create EN article
- use one shared `translation_key`
- use correct RU tool URL in RU article
- use correct EN tool URL in EN article
- fill all required fields
- prepare JSON files in `BD/content-staging/`
- publish only if the article quality is good enough

---

## Shortcut 2 — Create only RU article

Use this when the user explicitly wants only a Russian article.

Expected behavior:
- create one RU article
- set `language = ru`
- assign a stable `translation_key`
- note that EN pair does not exist yet
- use correct RU tool URL
- prepare JSON in `BD/content-staging/`
- publish only if requested

---

## Shortcut 3 — Create only EN article

Use this when the user explicitly wants only an English article.

Expected behavior:
- create one EN article
- set `language = en`
- assign a stable `translation_key`
- note that RU pair does not exist yet
- use correct EN tool URL
- prepare JSON in `BD/content-staging/`
- publish only if requested

---

## Shortcut 4 — Translate existing RU article to EN

Use this when:
- a Russian article already exists
- an English version is missing

Expected behavior:
- read the existing RU article
- create a natural English article, not a raw literal translation
- preserve article intent
- use the same `translation_key`
- choose a natural English slug
- use the correct EN tool URL
- prepare JSON and publish if requested

---

## Shortcut 5 — Translate existing EN article to RU

Use this when:
- an English article already exists
- a Russian version is missing

Expected behavior:
- read the existing EN article
- create a natural Russian version
- preserve article intent
- use the same `translation_key`
- choose a natural Russian/transliterated slug
- use the correct RU tool URL
- prepare JSON and publish if requested

---

## Shortcut 6 — Publish prepared article JSON

Use this when:
- JSON article files already exist in `BD/content-staging/`
- the task is only to publish and verify

Expected behavior:
- validate required fields
- publish through `BD/publish-article.ps1`
- verify through `BD/check-article.ps1`
- report:
  - slug
  - title
  - public URL
  - JSON file path
  - publish result

---

## Shortcut 7 — Create SEO article for a tool

Use this when the task is:
- create a search-friendly article that brings users to a tool

Expected behavior:
- focus on real search intent
- make article useful, not keyword-stuffed
- include:
  - H1
  - useful intro
  - practical explanation
  - examples / mistakes / use cases
  - FAQ
  - CTA near top and bottom
- create strong:
  - `title`
  - `excerpt`
  - `seo_title`
  - `seo_description`

---

## Shortcut 8 — Create article from existing tool description

Use this when:
- the user provides existing marketing text or tool description
- the article should be built from that material

Expected behavior:
- transform raw text into article format
- preserve useful information
- remove duplication and fluff
- build proper article structure
- add SEO fields
- add CTA links to the correct tool language version

---

## Shortcut 9 — Update existing article

Use this when:
- article already exists
- the user wants edits, not a new article

Expected behavior:
- keep the same article identity
- preserve `translation_key`
- preserve language
- update only required fields
- if changes affect both RU and EN versions, mention that clearly
- prepare PATCH-ready payload if needed

---

## Shortcut 10 — Do not publish weak/test content

Use this when:
- the article is obviously a draft
- placeholder text
- low-value test content
- unfinished translation

Expected behavior:
- keep article as `draft`
- do not publish automatically
- explain briefly why it should remain draft
- do not create unnecessary public translations of junk/test articles

---

## Shortcut 11 — Link article to the correct tool version

Always follow this rule:
- RU article -> RU tool URL (`/ru/...`)
- EN article -> EN tool URL (`/en/...`)

Never mix languages in CTA links.

---

## Shortcut 12 — Choose translation_key correctly

Expected behavior:
- choose one stable shared key for RU/EN pair
- keep it short and readable

Good:
- `days-lived`
- `qr-code-generator`
- `amount-in-words-documents`

Bad:
- random strings
- full titles
- different keys for RU and EN versions of the same article

---

## Shortcut 13 — Report output clearly

After article work, always report:
1. `language`
2. `translation_key`
3. `slug`
4. `title`
5. `status`
6. tool URL used in CTA
7. article public URL
8. JSON file path
9. publish result if published

If both RU and EN versions are created, report both separately.

---

## Shortcut 14 — Default safe workflow

When unsure, follow this sequence:
1. identify the tool
2. identify RU and EN tool URLs
3. choose `translation_key`
4. create article content
5. validate SEO fields
6. validate CTA links
7. prepare JSON
8. publish only if quality is acceptable
9. verify result