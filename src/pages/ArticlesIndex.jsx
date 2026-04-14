import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import SEO from '../components/SEO'
import ToolPageShell, { ToolPageHero } from '../components/ToolPageShell'
import InlineSpinner from '../components/InlineSpinner'
import {
  fetchArticles,
  readCachedArticlesIndex,
  readInitialArticlesIndex,
  writeCachedArticlesIndex,
} from '../lib/articlesApi'
import { filterArticlesForLanguage } from '../lib/articleLanguage'
import { preloadRoute } from '../routes/lazyPages'
import './Articles.css'

function normalizeForSearch(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/[\s\-_]+/g, ' ')
    .trim()
}

function getArticleHubTaxonomy(language) {
  const copy = language === 'en'
    ? {
        all: 'All',
        calculators: 'Calculators & numbers',
        docs: 'Documents & amounts',
        qr: 'QR codes & generators',
        seo: 'SEO & websites',
        guides: 'Guides',
      }
    : {
        all: 'Все',
        calculators: 'Калькуляторы и числа',
        docs: 'Документы и суммы',
        qr: 'QR-коды и генераторы',
        seo: 'SEO и сайты',
        guides: 'Полезные инструкции',
      }

  return [
    { id: 'all', label: copy.all },
    { id: 'docs', label: copy.docs },
    { id: 'calculators', label: copy.calculators },
    { id: 'qr', label: copy.qr },
    { id: 'seo', label: copy.seo },
    { id: 'guides', label: copy.guides },
  ]
}

function getArticleCategoryId(article = {}) {
  const key = article.translationKey || article.translation_key || ''
  const slug = article.slug || ''

  if (key === 'amount-in-words-documents' || slug.includes('summa-propisyu') || slug.includes('amount-in-words')) {
    return 'docs'
  }

  if (key === 'days-lived' || slug.includes('dney') || slug.includes('days-have-i-lived')) {
    return 'calculators'
  }

  if (key === 'qr-code-generator' || slug.includes('qr-code')) {
    return 'qr'
  }

  if (slug.includes('seo') || slug.includes('meta')) {
    return 'seo'
  }

  return 'guides'
}

function getArticleToolCta(article = {}, language) {
  const translationKey = article.translationKey || article.translation_key || ''
  const toolBase = language === 'en' ? '/en' : '/ru'

  if (translationKey === 'days-lived') {
    return {
      href: `${toolBase}/date-difference/?mode=days`,
      label: language === 'en' ? 'Open the days calculator' : 'Открыть калькулятор дней',
    }
  }

  if (translationKey === 'qr-code-generator') {
    return {
      href: `${toolBase}/qr-code-generator`,
      label: language === 'en' ? 'Open QR generator' : 'Открыть QR-генератор',
    }
  }

  if (translationKey === 'amount-in-words-documents') {
    return {
      href: `${toolBase}/number-to-words`,
      label: language === 'en' ? 'Open amount-in-words tool' : 'Открыть “Сумма прописью”',
    }
  }

  return null
}

function pickCoverAlt(article, language, t) {
  if (article?.title) {
    return article.title
  }
  return language === 'en' ? 'Article cover' : t('articles.coverAlt')
}

function ArticlesIndex() {
  const { t, language } = useLanguage()
  const copy = language === 'en'
    ? {
        searchLabel: 'Search articles',
        searchPlaceholder: 'Search by title, excerpt, or topic…',
        allArticles: 'All articles',
        viewAll: 'View all articles',
        showCurated: 'Show curated view',
        showing: (count) => `${count} article${count === 1 ? '' : 's'}`,
        emptyFilteredTitle: 'Nothing found',
        emptyFilteredText: 'Try a different query or category.',
      }
    : {
        searchLabel: 'Поиск по статьям',
        searchPlaceholder: 'Найти статью по названию или теме…',
        allArticles: 'Все статьи',
        viewAll: 'Показать все статьи',
        showCurated: 'Показать подборку',
        showing: (count) => `Статей: ${count}`,
        emptyFilteredTitle: 'Ничего не найдено',
        emptyFilteredText: 'Попробуйте другой запрос или категорию.',
      }

  const initialArticles = readInitialArticlesIndex(language)
  const cachedArticles = initialArticles.length ? [] : readCachedArticlesIndex(language)
  const bootstrapArticles = initialArticles.length ? initialArticles : cachedArticles
  const [articles, setArticles] = useState(() => {
    return bootstrapArticles
  })
  const [status, setStatus] = useState(() => (bootstrapArticles.length ? 'success' : 'loading'))
  const [errorMessage, setErrorMessage] = useState('')
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const visibleArticles = filterArticlesForLanguage(articles, language)

  useEffect(() => {
    let cancelled = false
    const hasVisibleData = visibleArticles.length > 0
    let refreshTimerId = 0

    if (!hasVisibleData) {
      setStatus('loading')
    }

    const runRefresh = () => fetchArticles(language)
      .then((items) => {
        if (cancelled) {
          return
        }

        setArticles(items)
        setStatus('success')
        writeCachedArticlesIndex(items)
      })
      .catch(() => {
        if (cancelled) {
          return
        }

        if (!hasVisibleData) {
          setStatus('error')
          setErrorMessage(t('articles.errors.list'))
        }
      })

    if (hasVisibleData) {
      refreshTimerId = window.setTimeout(runRefresh, 1800)
    } else {
      runRefresh()
    }

    return () => {
      cancelled = true
      window.clearTimeout(refreshTimerId)
    }
  }, [language, t, visibleArticles.length])

  const taxonomy = useMemo(() => getArticleHubTaxonomy(language), [language])
  const normalizedQuery = useMemo(() => normalizeForSearch(query), [query])
  const filteredArticles = useMemo(() => {
    const categoryFiltered = activeCategory === 'all'
      ? visibleArticles
      : visibleArticles.filter((article) => getArticleCategoryId(article) === activeCategory)

    if (!normalizedQuery) {
      return categoryFiltered
    }

    return categoryFiltered.filter((article) => {
      const searchable = normalizeForSearch([
        article.title,
        article.excerpt,
        article.seoTitle,
        article.seoDescription,
      ].join(' '))
      return searchable.includes(normalizedQuery)
    })
  }, [activeCategory, normalizedQuery, visibleArticles])

  const shouldShowListView = showAll || Boolean(normalizedQuery) || activeCategory !== 'all'
  const hubArticles = shouldShowListView ? filteredArticles : visibleArticles
  const showSkeleton = status === 'loading' && hubArticles.length === 0

  const groupedByCategory = useMemo(() => {
    const groups = new Map()
    hubArticles.forEach((article) => {
      const categoryId = getArticleCategoryId(article)
      if (!groups.has(categoryId)) {
        groups.set(categoryId, [])
      }
      groups.get(categoryId).push(article)
    })

    // Keep stable ordering as defined in taxonomy
    return taxonomy
      .filter((entry) => entry.id !== 'all')
      .map((entry) => ({ ...entry, items: groups.get(entry.id) || [] }))
      .filter((entry) => entry.items.length > 0)
  }, [hubArticles, taxonomy])

  return (
    <>
      <SEO
        title={t('seo.articles.title')}
        description={t('seo.articles.description')}
        keywords={t('seo.articles.keywords')}
        path={`/${language}/articles`}
      />

      <ToolPageShell className="articles-page">
        <ToolPageHero
          eyebrow={t('articles.eyebrow')}
          title={t('articles.title')}
          subtitle={t('articles.subtitle')}
          note={t('articles.note')}
          className="articles-hero"
        />

        <section className="articles-hub-controls" aria-label={copy.searchLabel}>
          <div className="articles-hub-controls__row">
            <div className="articles-hub-search">
              <label className="sr-only" htmlFor="articles-search">{copy.searchLabel}</label>
              <input
                id="articles-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
              />
            </div>
            <button
              type="button"
              className="articles-hub-cta"
              onClick={() => setShowAll((value) => !value)}
            >
              {shouldShowListView ? copy.showCurated : copy.viewAll}
            </button>
          </div>

          <div className="articles-hub-chips" role="tablist" aria-label={language === 'en' ? 'Article categories' : 'Категории статей'}>
            {taxonomy.map((category) => {
              const isActive = activeCategory === category.id
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`articles-chip ${isActive ? 'is-active' : ''}`.trim()}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                </button>
              )
            })}
          </div>

          <p className="articles-hub-meta">{copy.showing(filteredArticles.length)}</p>
        </section>

        {showSkeleton && (
          <section className="articles-grid articles-grid--skeleton" aria-label={t('articles.listAriaLabel')}>
            {Array.from({ length: 6 }).map((_, index) => (
              <article key={`skeleton-${index}`} className="article-card article-card--skeleton" aria-hidden="true">
                <div className="article-skeleton__media" />
                <div className="article-skeleton__meta" />
                <div className="article-skeleton__title" />
                <div className="article-skeleton__excerpt" />
              </article>
            ))}
          </section>
        )}

        {status === 'loading' && !showSkeleton && (
          <section className="articles-list-state" role="status" aria-live="polite">
            <InlineSpinner label={t('articles.loading')} />
            <p>{t('articles.loading')}</p>
          </section>
        )}

        {status === 'error' && (
          <section className="articles-list-state articles-list-state--error" role="alert">
            <h2>{t('articles.errorTitle')}</h2>
            <p>{errorMessage}</p>
          </section>
        )}

        {status === 'success' && visibleArticles.length === 0 && (
          <section className="articles-list-state">
            <h2>{t('articles.emptyTitle')}</h2>
            <p>{t('articles.emptyDescription')}</p>
          </section>
        )}

        {status === 'success' && filteredArticles.length === 0 && visibleArticles.length > 0 && (
          <section className="articles-list-state">
            <h2>{copy.emptyFilteredTitle}</h2>
            <p>{copy.emptyFilteredText}</p>
          </section>
        )}

        {filteredArticles.length > 0 && (
          <div className="articles-hub">
            {groupedByCategory.map((category) => (
              <section key={category.id} className="articles-category-section" aria-label={category.label}>
                <div className="articles-section-card__eyebrow">{category.label}</div>
                <div className="articles-category-grid">
                  {category.items.map((article) => {
                    const articlePath = `/${language}/articles/${article.slug}`
                    const toolCta = getArticleToolCta(article, language)

                    return (
                      <article key={article.id || article.slug} className="article-card">
                        {article.coverImage ? (
                          <Link
                            to={articlePath}
                            className="article-card__media"
                            aria-label={article.title}
                            onMouseEnter={() => preloadRoute('/articles')}
                            onFocus={() => preloadRoute('/articles')}
                            onTouchStart={() => preloadRoute('/articles')}
                          >
                            <img
                              src={article.coverImage}
                              alt={pickCoverAlt(article, language, t)}
                              loading="lazy"
                              decoding="async"
                            />
                          </Link>
                        ) : null}

                        <h2 className="article-card__title">
                          <Link
                            to={articlePath}
                            className="article-card__link"
                            onMouseEnter={() => preloadRoute('/articles')}
                            onFocus={() => preloadRoute('/articles')}
                            onTouchStart={() => preloadRoute('/articles')}
                          >
                            {article.title}
                          </Link>
                        </h2>

                        {article.excerpt ? <p className="article-card__excerpt">{article.excerpt}</p> : null}

                        <div className="article-card__actions">
                          <Link to={articlePath} className="article-card__read-more">
                            {t('articles.readMore')}
                          </Link>
                          {toolCta ? (
                            <a href={toolCta.href} className="article-card__tool-cta">
                              {toolCta.label}
                            </a>
                          ) : null}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            ))}

            <div className="articles-hub-footer">
              <button type="button" className="articles-hub-cta is-secondary" onClick={() => setShowAll(true)}>
                {copy.allArticles}
              </button>
            </div>
          </div>
        )}
      </ToolPageShell>
    </>
  )
}

export default ArticlesIndex
