# DB context (multilingual articles)

## Overview
Articles are stored in **Cloudflare D1** and served through a separate **Cloudflare Worker API**.
This frontend repo consumes the API and renders:

- article hub pages: `/ru/articles`, `/en/articles`
- article detail pages: `/ru/articles/:slug`, `/en/articles/:slug`

The Worker source code is **not** stored in this repo.

## Multilingual model (required)
Each article must store:

- `language`: `ru` or `en`
- `translation_key`: stable shared identifier for a translation group

Slug may differ between languages. RU/EN pairing is done via `translation_key`.

Example:

- RU: `slug=skolko-dney-ya-zhivu`, `language=ru`, `translation_key=days-lived`
- EN: `slug=how-many-days-have-i-lived`, `language=en`, `translation_key=days-lived`

## Worker API (expected)
Public:

- `GET /articles` → list, includes `language`, `translation_key`
- `GET /articles/:slug` → detail, includes `language`, `translation_key`

Admin:

- `POST /admin/articles` accepts and stores `language`, `translation_key`
- `PATCH /admin/articles/:id` allows updating `language`, `translation_key`

## Local publishing workflow files (this repo)

- `BD/article.template.json` — JSON template
- `BD/content-staging/` — local draft JSON payloads (not committed)
- `BD/publish-article.ps1` — publish to Worker
- `BD/check-article.ps1` — fetch article by slug for verification

