import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import SEO from '../components/SEO'
import Icon from '../components/Icon'
import { buildSearchIndex, searchRoutes } from '../config/searchIndex'
import { fetchArticles, readCachedArticlesIndex, readInitialArticlesIndex, writeCachedArticlesIndex } from '../lib/articlesApi'
import { filterArticlesForLanguage } from '../lib/articleLanguage'
import { preloadRoute } from '../routes/lazyPages'
import ToolPageShell, { ToolPageHero, ToolResult } from '../components/ToolPageShell'
import './SearchResults.css'

function normalizeForSearch(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/[\s\-_]+/g, ' ')
    .trim()
}

function SearchResults() {
  const { language, t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const initialArticles = readInitialArticlesIndex(language)
  const cachedArticles = initialArticles.length ? [] : readCachedArticlesIndex(language)
  const [articles, setArticles] = useState(() => (initialArticles.length ? initialArticles : cachedArticles))

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const copy = language === 'en'
    ? {
        title: 'Search tools',
        subtitle: 'Find calculators, generators, and utilities by name, description, or intent.',
        inputLabel: 'Search tools',
        inputPlaceholder: 'Search calculators, generators, SEO tools...',
        submit: 'Search',
        emptyTitle: 'No tools found',
        emptyText: 'Try a broader phrase or search by task, such as “VAT”, “QR”, “password”, or “date”.',
        startTitle: 'Search the tool library',
        startText: 'Type a keyword to quickly find the right calculator, generator, or SEO tool.',
        results: (count, value) => `${count} result${count === 1 ? '' : 's'} for “${value}”`,
        allTools: (count) => `${count} available tools`,
        searchTip: 'Search by task, tool type, or a phrase you would normally type into a search box.',
        toolsHeading: 'Tools',
        articlesHeading: 'Articles',
        articlesEmpty: 'No matching articles found.',
      }
    : {
        title: 'Поиск по инструментам',
        subtitle: 'Найдите нужный калькулятор, генератор или SEO-инструмент по названию, описанию и задаче.',
        inputLabel: 'Поиск по инструментам',
        inputPlaceholder: 'Найти калькулятор, генератор, SEO-инструмент...',
        submit: 'Найти',
        emptyTitle: 'Ничего не найдено',
        emptyText: 'Попробуйте более общий запрос, например: НДС, QR, пароль, дата.',
        startTitle: 'Начните поиск',
        startText: 'Введите слово или задачу, чтобы быстро найти нужный инструмент.',
        results: (count, value) => `Результатов: ${count} — по запросу «${value}»`,
        allTools: (count) => `Доступно инструментов: ${count}`,
        searchTip: 'Ищите по задаче, названию инструмента или обычной поисковой фразе.',
        toolsHeading: 'Инструменты',
        articlesHeading: 'Статьи',
        articlesEmpty: 'По статьям совпадений нет.',
      }

  const searchIndex = useMemo(() => buildSearchIndex(language, t), [language, t])
  const trimmedQuery = query.trim()
  const results = useMemo(() => searchRoutes(searchIndex, trimmedQuery), [searchIndex, trimmedQuery])
  const normalizedQuery = useMemo(() => normalizeForSearch(trimmedQuery), [trimmedQuery])
  const visibleArticles = useMemo(() => filterArticlesForLanguage(articles, language), [articles, language])
  const articleResults = useMemo(() => {
    if (!normalizedQuery) return []
    return visibleArticles
      .filter((article) => {
        const searchable = normalizeForSearch([
          article.title,
          article.excerpt,
          article.seoTitle,
          article.seoDescription,
        ].join(' '))
        return searchable.includes(normalizedQuery)
      })
      .slice(0, 12)
  }, [normalizedQuery, visibleArticles])

  useEffect(() => {
    let cancelled = false

    if (visibleArticles.length > 0) {
      return () => {
        cancelled = true
      }
    }

    fetchArticles(language)
      .then((items) => {
        if (cancelled) return
        setArticles(items)
        writeCachedArticlesIndex(items)
      })
      .catch(() => {
        // search page stays usable without articles
      })

    return () => {
      cancelled = true
    }
  }, [language, visibleArticles.length])

  const handleSubmit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (trimmedQuery) {
      params.set('q', trimmedQuery)
    }
    setSearchParams(params, { replace: false })
  }

  return (
    <>
      <SEO
        title={copy.title}
        description={copy.subtitle}
        path={`/${language}/search`}
        robots="noindex,follow"
      />

      <ToolPageShell className="search-results-page">
        <ToolPageHero title={copy.title} subtitle={copy.subtitle} note={copy.searchTip} />

        <form onSubmit={handleSubmit} className="search-results-form surface-panel">
          <label htmlFor="search-page-input" className="search-results-label">{copy.inputLabel}</label>
          <div className="search-results-form-row">
            <input
              id="search-page-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.inputPlaceholder}
            />
            <button type="submit">{copy.submit}</button>
          </div>
        </form>

        {!trimmedQuery ? (
          <ToolResult className="surface-panel surface-panel--subtle search-results-empty">
            <h2>{copy.startTitle}</h2>
            <p>{copy.startText}</p>
            <p className="search-results-meta">{copy.allTools(searchIndex.length)}</p>
          </ToolResult>
        ) : results.length === 0 ? (
          <ToolResult className="surface-panel surface-panel--subtle search-results-empty">
            <h2>{copy.emptyTitle}</h2>
            <p>{copy.emptyText}</p>
          </ToolResult>
        ) : (
          <>
            <p className="search-results-meta">{copy.results(results.length + articleResults.length, trimmedQuery)}</p>

            <section className="search-results-section" aria-label={copy.toolsHeading}>
              <h2 className="search-results-section__title">{copy.toolsHeading}</h2>
              <div className="search-results-grid">
                {results.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className="search-results-card"
                    onMouseEnter={() => preloadRoute(item.routePath)}
                    onFocus={() => preloadRoute(item.routePath)}
                    onTouchStart={() => preloadRoute(item.routePath)}
                  >
                    <div className="search-results-card-header">
                      <Icon name={item.icon} className="search-results-icon" />
                      <div>
                        <h3>{item.title}</h3>
                        {item.category ? <span className="search-results-category">{item.category}</span> : null}
                      </div>
                    </div>
                    <p>{item.description}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="search-results-section" aria-label={copy.articlesHeading}>
              <h2 className="search-results-section__title">{copy.articlesHeading}</h2>
              {articleResults.length === 0 ? (
                <p className="search-results-meta">{copy.articlesEmpty}</p>
              ) : (
                <div className="search-results-grid">
                  {articleResults.map((article) => (
                    <Link
                      key={article.id || article.slug}
                      to={`/${language}/articles/${article.slug}`}
                      className="search-results-card search-results-card--article"
                      onMouseEnter={() => preloadRoute('/articles')}
                      onFocus={() => preloadRoute('/articles')}
                      onTouchStart={() => preloadRoute('/articles')}
                    >
                      <div className="search-results-card-header">
                        <Icon name="article" className="search-results-icon" />
                        <div>
                          <h3>{article.title}</h3>
                          <span className="search-results-category">{t('nav.articles')}</span>
                        </div>
                      </div>
                      <p>{article.excerpt || article.seoDescription || ''}</p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </ToolPageShell>
    </>
  )
}

export default SearchResults
