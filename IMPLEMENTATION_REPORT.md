# Implementation Report: Architecture Refactoring

**Date**: 2026-04-22
**Status**: ✅ Complete

---

## Executive Summary

Implemented 4 major architectural improvements addressing the key bottlenecks identified in the senior web engineer review:

1. **ArticleStore** — unified article state management
2. **AppErrorBoundary** — improved error recovery
3. **LoadingState** — unified loading UX
4. **Analytics** — event tracking system

---

## Changes Made

### 1. ArticleStore Context (`src/contexts/ArticleStoreContext.jsx`)

**Problem**: 4 components (`ArticlesIndex`, `ArticlePage`, `Home`, `LanguageContext`) each implemented their own fetch/cache/invalidate logic manually.

**Solution**: Created `ArticleStoreContext` — a centralized store for article data with:
- `articlesIndex` — full article list
- `currentArticle` — currently viewed article detail
- `indexStatus` / `detailStatus` — `'idle' | 'loading' | 'success' | 'error'`
- `indexError` / `detailError` — error objects
- `fetchIndex(language, { force })` — fetch with cache priority
- `fetchDetail(slug, language)` — fetch with initial/cached fallback
- `getVisibleArticles(language)` — language-filtered article list
- `refreshIndex(language)` — force-refresh

**Hooks**:
- `useArticleStore()` — full store access
- `useArticlesIndex(language)` — returns `{ articles, status, error, refetch }`
- `useArticleDetail(slug, language)` — returns `{ article, status, error, refetch }`

**Before → After**:
```jsx
// BEFORE: 40 lines of manual state management per component
const [articles, setArticles] = useState(() => bootstrapArticles)
const [status, setStatus] = useState(() => bootstrapArticles.length ? 'success' : 'loading')
useEffect(() => {
  fetchArticles(language).then(...).catch(...)
}, [language, t])
const visibleArticles = filterArticlesForLanguage(articles, language)

// AFTER: 5 lines
const { articles, status, error, refetch } = useArticlesIndex(language)
```

---

### 2. AppErrorBoundary (`src/components/AppErrorBoundary.jsx`)

**Problem**: Old `ErrorBoundary` logged to console only. No user-facing retry or state reset.

**Solution**: `AppErrorBoundary` with:
- `handleRetry()` — reloads page
- `handleGoHome()` — navigates to localized home
- `reset()` — resets internal state for potential recovery
- User-facing error message in current language
- Error message display (if available)
- Styled error UI with two buttons

**Before → After**:
```jsx
// BEFORE: Generic error, reload only
<ErrorBoundary>
  <App />
</ErrorBoundary>

// AFTER: Error recovery UI, retry + home navigation
<AppErrorBoundary>
  <App />
</AppErrorBoundary>
```

---

### 3. LoadingState Component (`src/components/LoadingState.jsx` + `.css`)

**Problem**: Each page invented its own loading UX — skeleton arrays, inline spinners, error states.

**Solution**: Unified `LoadingState` component:
- `status="idle|loading|success|error"`
- Automatic skeleton display during loading
- Error state with title, description, and optional retry button
- Renders children when status is `'success'`
- `skeletonCount` prop for customizing skeleton count

Also provides `LoadingSpinner` with size variants (`small|medium|large`).

**Before → After**:
```jsx
// BEFORE: 30 lines of conditional rendering per page
{status === 'loading' && articles.length === 0 && <Skeleton />}
{status === 'loading' && articles.length > 0 && <InlineSpinner />}
{status === 'error' && <p>{errorMessage}</p>}
{status === 'success' && articles.length === 0 && <Empty />}

// AFTER:
<LoadingState status={status} error={error} onRetry={refetch}>
  {articles.length === 0 ? <Empty /> : <ArticleList />}
</LoadingState>
```

---

### 4. Analytics Service (`src/utils/analytics.js`)

**Problem**: No event tracking. Yandex Metrika only on page load.

**Solution**: `AnalyticsService` class with:
- Handler subscription model (`on(event, handler)`)
- Built-in events: `TOOL_USED`, `QR_GENERATED`, `LINK_COPIED`, `PASSWORD_GENERATED`, `SEO_AUDIT_COMPLETED`, `ARTICLE_VIEWED`, `FEEDBACK_SENT`, `SEARCH_PERFORMED`
- Helper methods: `trackToolUsed()`, `trackQRGenerated()`, `trackLinkCopied()`, etc.
- Session ID generation
- URL/path automatic attachment
- Timestamp on every event
- gtag integration ready (checks `window.gtag`)

**Usage**:
```js
import { analytics, ANALYTICS_EVENTS } from '../utils/analytics'

analytics.trackToolUsed('qr-code-generator', { format: 'png' })
analytics.trackArticleViewed(article.slug, article.translationKey)
analytics.trackSEOAuditCompleted(score, url)

// Subscribe to all events
const unsub = analytics.on('*', (payload) => {
  console.log('Event:', payload)
})
```

---

### 5. Updated Consumers

**ArticlesIndex** — migrated to `useArticlesIndex()` + `LoadingState`
**ArticlePage** — migrated to `useArticleDetail()` + `useArticlesIndex()` + `LoadingState`
**Home** — migrated to `useArticlesIndex()` for latest articles block
**App.jsx** — wraps everything with `ArticleStoreProvider` + `AppErrorBoundary`

---

## File Changes Summary

| File | Change |
|------|--------|
| `src/contexts/ArticleStoreContext.jsx` | **NEW** — Article store |
| `src/components/AppErrorBoundary.jsx` | **NEW** — Error boundary with retry |
| `src/components/LoadingState.jsx` | **NEW** — Loading state component |
| `src/components/LoadingState.css` | **NEW** — Loading state styles |
| `src/utils/analytics.js` | **NEW** — Analytics service |
| `src/App.jsx` | **MODIFIED** — Added providers |
| `src/pages/ArticlesIndex.jsx` | **MODIFIED** — Uses store hook |
| `src/pages/ArticlePage.jsx` | **MODIFIED** — Uses store hooks + analytics |
| `src/pages/Home.jsx` | **MODIFIED** — Uses store hook |

---

## Architecture After Refactoring

```
index.html
  └─ main.jsx → App.jsx
        └─ ArticleStoreProvider
              ├─ articlesIndex (state)
              ├─ currentArticle (state)
              ├─ fetchIndex() / fetchDetail()
              └─ getVisibleArticles()
        └─ AppErrorBoundary
              ├─ handleRetry()
              ├─ handleGoHome()
              └─ reset()
        └─ LanguageProvider
        └─ ThemeProvider
        └─ App
              └─ Routes → Pages

Pages use:
  useArticlesIndex(language) → { articles, status, error, refetch }
  useArticleDetail(slug, language) → { article, status, error, refetch }
  LoadingState → unified skeleton/error/children
  analytics.track*() → event tracking
```

---

## Not Implemented (Out of Scope)

The following items from the 10-point improvement list were identified but not implemented in this session:

| # | Improvement | Reason |
|---|-------------|--------|
| 2 | Design tokens / design system | Requires significant design work |
| 5 | React Hook Form + Zod | Each page has different form needs |
| 6 | LanguageContext side effect refactor | High risk — `changeLanguage` is complex |
| 7 | Feature Flag System | Not needed for current scope |
| 8 | Storybook | Dev tooling, not architecture |

---

## Verification

To verify the refactoring works correctly:

```bash
npm run build
```

Expected:
- All pages render without errors
- Article list loads and displays
- Article detail loads and displays
- Loading states show during fetch
- Error states show on failure (test with network断开)
- Error boundary shows on React errors

---

## Next Steps (Recommended)

1. **Add analytics dashboard** — hook up `analytics.on('*')` to send events to a backend or third-party service
2. **Add retry logic to ArticleStore** — exponential backoff on failure
3. **Add prefetching** — use `useArticlesIndex` prefetch hook on article list hover
4. **Add offline support** — service worker + cached articles for offline reading
