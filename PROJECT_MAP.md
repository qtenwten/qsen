# Project Structure Map

## 1. Обзор проекта

React-based utility tools site (16 инструментов + статьи). Bilingual (RU/EN), pre-rendered static pages, Cloudflare D1 + Worker API для статей, Service Worker для кэширования.

**Tech stack**: React 18, React Router 6, Vite 5, Chart.js, mathjs, qrcode, jspdf, lucide-react

---

## 2. Основные директории

| Директория | Назначение |
|------------|------------|
| `src/` | React-приложение (frontend) |
| `src/pages/` | Страницы (16 tool-страниц + Home + статьи) |
| `src/components/` | Переиспользуемые UI-компоненты |
| `src/utils/` | Бизнес-логика (калькуляторы, генераторы) |
| `src/lib/` | API-клиенты (articlesApi) |
| `src/contexts/` | State management (LanguageContext, ThemeContext) |
| `src/routes/` | Lazy loading страниц |
| `src/config/` | Конфигурация маршрутов и SEO-данные |
| `src/locales/` | Переводы (ru.json, en.json) |
| `src/icons/` | Маппинг иконок |
| `src/styles/` | Глобальные стили |
| `src/hooks/` | Кастомные React-хуки |
| `api/` | Node.js-сервер для SEO-audit (proxy) |
| `BD/` | Паблишинг статей, скрипты, документация |
| `scripts/` | Pre-render генерация HTML |
| `public/` | Статические assets |
| `dist/` | Build output (pre-rendered HTML) |

---

## 3. Entry Points

| Файл | Роль |
|------|------|
| `index.html` | HTML-точка входа; inline-скрипты для темы/языка, регистрация SW, метрика |
| `src/main.jsx` | Инициализация React + Router + HelmetProvider |
| `src/App.jsx` | Router definition, scroll management, locale switching |
| `scripts/generate-pages.js` | Build-time генерация статических HTML |

---

## 4. Разделение по слоям

### Страницы (`src/pages/`)
Home, NumberToWords, VATCalculator, RandomNumber, Calculator, DateDifferenceCalculator, CompoundInterest, SEOAudit, SEOAuditPro, MetaTagsGenerator, QRCodeGenerator, URLShortener, PasswordGenerator, Feedback, ArticlesIndex, ArticlePage, SearchResults, NotFound

### UI-компоненты (`src/components/`)
- **Layout**: Header, Footer, Breadcrumbs, ToolPageShell
- **UI**: CustomSelect, CopyButton, InlineSpinner, PageTransition
- **SEO**: SEO
- **Темы/язык**: ThemeSwitcher, LanguageSwitcher
- **Tool-специфичные**: ToolDescriptionSection, RelatedTools, ResultSection
- **Ошибки**: ErrorBoundary, RouteSkeleton
- **Чарты**: LineChart
- **Иконки**: Icon
- **Калькулятор**: GraphPanel, HistoryPanel, CalculatorPanel, ModeSwitcher
- **Статьи**: ArticleMarkdown

### Бизнес-логика (`src/utils/`)
calculator, vatCalculator, numberToWords, randomGenerator, passwordGenerator, compoundInterest, dateDifference, mathParser, graphUtils, seoAudit, storage, apiCache, numberInput, errorMonitor

### API-слой (`src/lib/`)
- `articlesApi.js` — клиент для Cloudflare Worker API
- `articleLanguage.js` — определение языка статьи

### State Management
- LanguageContext — i18n, переключение языка, translation_key-aware навигация
- ThemeContext — dark/light тема

### Стили
- Глобальные: `src/styles/index.css`, `src/styles/calculator.css`
- Коллокированные CSS рядом с компонентами

### Конфиги
- `routeRegistry.js` — метаданные маршрутов
- `routeSeo.js` — SEO-данные per route
- `searchIndex.js` — поисковый индекс

---

## 5. Дублирование и смешение слоёв

### Дублирование normalizации статей
| Файл | Функции |
|------|---------|
| `src/lib/articlesApi.js` | `normalizeArticle()`, `normalizeArticleListItem()` |
| `scripts/generate-pages.js` | `normalizeArticleIndexItem()`, `normalizeArticleDetailItem()` |
| `src/lib/articleLanguage.js` | `detectArticleLanguage()`, `filterArticlesForLanguage()` |

### Дублирование SEO-метаданных
| Источник | Что содержит |
|----------|--------------|
| `src/config/routeSeo.js` | title, description, keywords, h1, og tags, sitemap |
| `scripts/generate-pages.js` | hero content, copy text |
| Отдельные страницы | `<SEO>` с `t()` переводами |

### `scripts/generate-pages.js` делает слишком много
- Fetchet статьи с API
- Нормализует данные (дублирует `articlesApi.js`)
- Генерирует HTML (смешивание view-логики)
- Содержит свой `ICON_SVG_MAP` (дублирует `src/icons/map.js`)

### `src/utils/seoAudit.js` содержит хардкод переводов
Русские/английские строки прямо в утилите вместо использования i18n-контекста.

---

## 6. Основные структурные проблемы

| # | Проблема | Серьёзность |
|---|----------|-------------|
| 1 | Дублирование normalizации статей в 3 местах | Средняя |
| 2 | `scripts/generate-pages.js` нарушает SRP | Средняя |
| 3 | SEO-данные размазаны по 3 местам | Средняя |
| 4 | `seoAudit.js` содержит хардкод переводов | Низкая |
| 5 | Icon mapping дублируется | Низкая |
| 6 | Build-time coupling между `scripts/` и `src/` | Низкая |
| 7 | Нечёткое разделение `utils/` и `lib/` | Низкая |

---

## 7. Краткие рекомендации

1. **Вынести нормализацию статей в одно место** — единый `normalizeArticle()` с флагами для типа возврата
2. **Разбить `generate-pages.js`** — отдельные модули для fetch, normalize, HTML generation
3. **Унифицировать SEO-источник** — единый конфиг с merge поведением (hardcode → routeSeo → page-specific)
4. **Вынести переводы из `seoAudit.js`** в `locales/`
5. **Убрать дублирующий `ICON_SVG_MAP`** — импортировать из `src/icons/map.js`
6. **Использовать `lib/` только для API**, `utils/` — для бизнес-логики
