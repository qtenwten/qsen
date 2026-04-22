# Refactoring Plan

## Problem 1: Размазанность нормализации статей

**Почему проблема**: Логика нормализации статей живёт в 3 местах — `articlesApi.js`, `generate-pages.js`, `articleLanguage.js`. Нет единого источника истины.

**Риски**:
- При изменении схемы статьи придётся править в 3 местах
- Расхождение форматов приведёт к трудноуловимым багам
- Невозможно переиспользовать нормализацию в других местах

**Затронутые файлы**:
- `src/lib/articlesApi.js` → `src/api/articlesApi.js`
- `src/lib/articleLanguage.js` → `src/utils/articleLanguage.js`
- `scripts/generate-pages.js`

**Как исправлено**:
1. Создан `src/utils/articleNormalization.js` — единый модуль нормализации
2. `articlesApi.js` перенесён в `src/api/` и использует `articleNormalization.js`
3. `articleLanguage.js` перенесён в `src/utils/` (утилита, не API)
4. `generate-pages.js` импортирует нормализацию из `src/utils/articleNormalization.js`

**Impact**: Medium | **Effort**: Low | **Risk**: Low

---

## Problem 2: `scripts/generate-pages.js` нарушает SRP

**Почему проблема**: Скрипт делает fetch, normalize, HTML generation, содержит свой иконковый маппинг. Build-time coupling и смешивание ответственностей.

**Риски**:
- Изменение любого слоя затрагивает скрипт
- Невозможно тестировать бизнес-логику отдельно
- Иконковый маппинг расходится с `src/icons/map.js`

**Затронутые файлы**:
- `scripts/generate-pages.js`
- `src/icons/map.js`

**Как исправлено**:
1. Создан `src/utils/iconMap.js` — единый иконковый маппинг с `getIconSvg()`
2. `generate-pages.js` импортирует из `src/utils/iconMap.js`
3. Нормализация вынесена в `src/utils/articleNormalization.js`

**Impact**: Medium | **Effort**: Medium | **Risk**: Low

---

## Problem 3: SEO-данные размазаны по 3 местам

**Почему проблема**: `routeSeo.js`, `generate-pages.js`, страничные компоненты с `t()` — нет единого источника.

**Риски**:
- Дублирование h1, title, description — риск расхождения
- При редактировании SEO нужно править в нескольких местах

**Как исправлено**:
- SEO для страниц сконцентрирован в `routeSeo.js`
- Компоненты используют `<SEO>` с `t()` переводами — это делегирование в i18n, что является допустимым архитектурным решением
- `generate-pages.js` читает из `routeSeo.js` для статической генерации

**Impact**: High | **Effort**: Medium | **Risk**: Medium

---

## Problem 4: `seoAudit.js` содержит хардкод переводов

**Почему проблема**: Русские/английские строки захардкожены в утилите. Не использует i18n-контекст.

**Риски**:
- При добавлении языка придётся править файл
- Строки не синхронизированы с `locales/`

**Затронутые файлы**:
- `src/utils/seoAudit.js`
- `src/locales/ru.json`, `en.json`

**Как исправлено**:
1. Добавлены ключи `seoAudit.messages.*` в `ru.json` / `en.json`
2. Создан `createLanguageAwareSEOAnalyzer(language)` — фабрика с language-aware getMessage
3. Экспортирована `analyzeSEO(url, language)` как дефолтная функция с language-aware поведением
4. Строки из `seoAudit.messages.*` теперь читаются из locales

**Impact**: Low | **Effort**: Low | **Risk**: Low

---

## Problem 5: Нечёткое разделение `utils/` и `lib/`

**Почему проблема**: `lib/` содержит API-логику, `utils/` — утилиты и бизнес-логику. Граница размыта.

**Риски**:
- Новые файлы кладут не в то место
- Утилиты могут неявно зависеть от API

**Затронутые файлы**:
- `src/utils/` — все файлы
- `src/lib/` — articlesApi.js, articleLanguage.js

**Как исправлено**:
1. `lib/` → `api/` — только API-клиенты (`articlesApi.js`)
2. `articleLanguage.js` перенесён в `utils/` (чистая утилита, не сетевая логика)
3. Создан `src/api/` как хранилище для API-транспорта
4. Создан `src/utils/articleNormalization.js` для бизнес-логики нормализации

**Impact**: Low | **Effort**: Medium | **Risk**: Low

---

## Порядок внедрения

### Quick Wins (1-2 часа каждый)
| # | Задача | Effort |
|---|--------|--------|
| 4 | Переводы из `seoAudit.js` → `locales/` | Low |
| 5 | `lib/` → `api/`, `articleLanguage.js` в `utils/` | Low |

### Medium-lift (полдня-день каждый)
| # | Задача | Effort |
|---|--------|--------|
| 1 | Единая нормализация статей | Medium |
| 2 | Разбить `generate-pages.js` | Medium |

### Рекомендуемый порядок (все уже выполнены)
1. **5** → реструктуризация папок
2. **4** → переводы из `seoAudit.js`
3. **1** → единая нормализация
4. **2** → разбиение `generate-pages.js`
5. **3** → унификация SEO

---

## Что уже сделано

| # | Проблема | Статус |
|---|----------|--------|
| 1 | Размазанность нормализации статей | ✅ Создан `src/utils/articleNormalization.js` |
| 2 | `generate-pages.js` нарушает SRP | ✅ Иконковый маппинг вынесен в `src/utils/iconMap.js` |
| 3 | SEO-данные размазаны | ✅ SEO сконцентрирован в `routeSeo.js` |
| 4 | `seoAudit.js` хардкод переводов | ✅ Ключи добавлены в `locales/`, создана фабрика |
| 5 | Нечёткое разделение `utils/` и `lib/` | ✅ `lib/` → `api/`, `articleLanguage.js` → `utils/` |
