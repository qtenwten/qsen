# Deployment Notes

## Build

- Install: `npm install`
- Build: `npm run build`
- Output: `dist/`
- Dev server: `npm run dev`
- Preview: `npm run preview`

## Hosting Requirements

- Static frontend hosting for `dist/`
- SPA fallback to `index.html`
- Support for serverless functions if you use `api/telegram.js` or `api/seo-audit.js`
- Node.js 18+ for build and functions

## Environment Variables

Set these variables in the hosting platform before enabling the feedback form:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## Routing

- Main routes are language-prefixed: `/ru/...` and `/en/...`
- `/` redirects to `/ru`
- Legacy URLs without a language prefix redirect to the Russian version

## SEO Build Step

`npm run build` does two things:

1. Runs the Vite production build.
2. Generates route-specific HTML files via `scripts/generate-pages.js`.

## Recommended Checks After Deploy

1. Open `/ru` and `/en`.
2. Verify deep links like `/ru/seo-audit-pro` load directly.
3. Check that `canonical` and `hreflang` are correct.
4. Test `/api/telegram` through the feedback form.
5. Test `/api/seo-audit?url=example.com`.

## Security

- Do not store bot tokens, chat IDs, analytics secrets, or platform IDs in committed files.
- If a secret was previously committed, rotate it before the next deploy.
