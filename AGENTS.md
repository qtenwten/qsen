# Project agent instructions

This project contains:
- the main frontend website
- a separate article publishing workflow
- article content stored in Cloudflare D1 and served through a separate Worker API

## Read first

If your task involves articles, database, publishing, translations, or article SEO, read these files first:

- `BD/ARTICLE_AUTHORING_GUIDE.md`
- `BD/DB_CONTEXT.md`
- `BD/ARTICLE_WORKFLOW.md`

If your task involves the QR Code Generator, be careful not to break the current polished UI/UX behavior.

## Important rules

- Do not commit secrets
- Do not commit `BD/article-publisher.env`
- Do not commit `BD/content-staging/`
- Do not break the existing article system
- Do not remove current routing, prerender, SEO, i18n, or article pages unless explicitly asked
- Do not assume Worker source code exists in this frontend repo
- Do not fake changes to D1 or Worker if they are not editable in the current repo; instead prepare exact instructions or patch text

## Article system overview

Articles are:
- stored in Cloudflare D1
- served through a separate Cloudflare Worker API
- rendered in the frontend via article pages

The site already includes:
- article list pages
- article detail pages
- prerender article index data
- prerender article detail pages
- sessionStorage cache fallback
- SEO integration
- sitemap integration
- related articles
- homepage latest articles block

## Multilingual article rules

For multilingual articles, every article must have:

- `language`
- `translation_key`

Rules:
- `language` must be `ru` or `en`
- RU and EN versions of the same article must share the same `translation_key`
- RU and EN slugs may differ
- language switching for article pages should use `translation_key`, not slug guessing

Do not create multilingual article pairs with different translation keys.

## Local article workflow

Use files in `BD/` for article publishing and checks.

Important files:
- `BD/article.template.json`
- `BD/publish-article.ps1`
- `BD/check-article.ps1`
- `BD/ARTICLE_AUTHORING_GUIDE.md`
- `BD/DB_CONTEXT.md`
- `BD/ARTICLE_WORKFLOW.md`

## If working on article content

Always:
- write useful, human-first content
- include correct CTA links to the actual tool
- use `/ru/...` tool links in RU articles
- use `/en/...` tool links in EN articles
- fill SEO fields
- set correct `language`
- set correct `translation_key`

Do not:
- publish junk drafts
- publish test placeholders
- mix RU article text with EN tool links
- mix EN article text with RU tool links

## If working on QR Code Generator

Do not break:
- live preview
- sticky preview behavior
- stable preview layout
- logo upload behavior
- metric card geometry
- responsive layout

The QR generator has already received multiple UI/UX fixes and should remain visually stable.

## Before making changes

Always inspect current files first and work on top of the existing implementation.

When changing article-related frontend code, preserve:
- prerender
- initial data injection
- sessionStorage cache fallback
- sitemap article routes
- related articles
- SEO title/description behavior
- multilingual article logic

## Git safety

These should generally be committed:
- `AGENTS.md`
- `BD/AGENTS.md`
- `BD/ARTICLE_AUTHORING_GUIDE.md`
- `BD/DB_CONTEXT.md`
- `BD/ARTICLE_WORKFLOW.md`

These must not be committed:
- `BD/article-publisher.env`
- `BD/content-staging/`
- any secret or local private token files