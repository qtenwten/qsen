import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import SEO from '../components/SEO'
import ToolPageShell from '../components/ToolPageShell'
import InlineSpinner from '../components/InlineSpinner'
import ArticleMarkdown from '../components/articles/ArticleMarkdown'
import {
  fetchArticles,
  fetchArticleBySlug,
  readCachedArticlesIndex,
  readCachedArticleDetail,
  readInitialArticlesIndex,
  readInitialArticleDetail,
  writeCachedArticlesIndex,
  writeCachedArticleDetail,
} from '../lib/articlesApi'
import { getLocalizedRouteUrl } from '../config/routeSeo'
import './Articles.css'

function pickCoverAlt(article, language, t) {
  if (article?.title) {
    return article.title
  }
  return language === 'en' ? 'Article cover' : t('articles.coverAlt')
}

function formatPublishedDate(value, language) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function ArticlePage() {
  const { slug = '' } = useParams()
  const { t, language } = useLanguage()
  const initialArticle = readInitialArticleDetail(slug)
  const cachedArticle = initialArticle || readCachedArticleDetail(slug)
  const [article, setArticle] = useState(cachedArticle)
  const [status, setStatus] = useState(cachedArticle ? 'success' : 'loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [relatedArticles, setRelatedArticles] = useState(() => {
    return readInitialArticlesIndex().length ? readInitialArticlesIndex() : readCachedArticlesIndex()
  })

  useEffect(() => {
    let cancelled = false
    let refreshTimerId = 0
    const seedArticle = readInitialArticleDetail(slug) || readCachedArticleDetail(slug)
    const hasVisibleArticle = Boolean((article && article.slug === slug) || seedArticle)

    setErrorMessage('')

    if (!hasVisibleArticle) {
      setArticle(null)
      setStatus('loading')
    } else if (seedArticle && (!article || article.slug !== slug)) {
      setArticle(seedArticle)
      setStatus('success')
    }

    const runRefresh = () => fetchArticleBySlug(slug)
      .then((data) => {
        if (cancelled) {
          return
        }

        setArticle(data)
        setStatus('success')
        writeCachedArticleDetail(data)
      })
      .catch((error) => {
        if (cancelled) {
          return
        }

        if (!hasVisibleArticle) {
          setStatus('error')
          setErrorMessage(
            error?.status === 404
              ? t('articles.errors.notFound')
              : t('articles.errors.single')
          )
        }
      })

    if (hasVisibleArticle) {
      refreshTimerId = window.setTimeout(runRefresh, 1800)
    } else {
      runRefresh()
    }

    return () => {
      cancelled = true
      window.clearTimeout(refreshTimerId)
    }
  }, [slug, t])

  useEffect(() => {
    let cancelled = false
    const seedArticles = readInitialArticlesIndex()

    if (seedArticles.length) {
      setRelatedArticles(seedArticles)
      writeCachedArticlesIndex(seedArticles)
      return () => {
        cancelled = true
      }
    }

    if (relatedArticles.length) {
      return () => {
        cancelled = true
      }
    }

    fetchArticles()
      .then((items) => {
        if (cancelled) {
          return
        }

        setRelatedArticles(items)
        writeCachedArticlesIndex(items)
      })
      .catch(() => {
        // keep article page usable without related items
      })

    return () => {
      cancelled = true
    }
  }, [relatedArticles.length])

  const canonicalPath = useMemo(() => `/${language}/articles/${slug}`, [language, slug])
  const canonicalUrl = useMemo(() => getLocalizedRouteUrl(language, `/articles/${slug}`), [language, slug])
  const ruUrl = useMemo(() => getLocalizedRouteUrl('ru', `/articles/${slug}`), [slug])
  const enUrl = useMemo(() => getLocalizedRouteUrl('en', `/articles/${slug}`), [slug])
  const articleTitle = article?.title || t('articles.detailFallbackTitle')
  const articleDescription = article?.seoDescription || article?.excerpt || t('articles.subtitle')
  const articleSeoTitle = article?.seoTitle || (status === 'success' ? `${articleTitle} | QSEN.RU` : t('articles.detailLoadingTitle'))
  const ogImage = article?.coverImage || 'https://qsen.ru/og-image.svg'
  const visibleRelatedArticles = relatedArticles
    .filter((item) => item.slug && item.slug !== slug)
    .slice(0, 3)
  const structuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleTitle,
    description: articleDescription,
    author: article?.author ? { '@type': 'Person', name: article.author } : undefined,
    datePublished: article?.publishedAt || undefined,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    image: article?.coverImage ? [article.coverImage] : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'QSEN.RU',
      url: 'https://qsen.ru',
    },
  }), [article?.author, article?.coverImage, article?.publishedAt, articleDescription, articleTitle, canonicalUrl])

  return (
    <>
      <SEO
        title={articleSeoTitle}
        description={articleDescription}
        keywords={t('seo.articles.keywords')}
        image={ogImage}
        ogType="article"
        path={canonicalPath}
        structuredData={structuredData}
      />

      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hreflang="ru" href={ruUrl} />
        <link rel="alternate" hreflang="en" href={enUrl} />
        <link rel="alternate" hreflang="x-default" href={ruUrl} />
      </Helmet>

      <ToolPageShell className="articles-page article-page">
        {status === 'loading' && (
          <section className="articles-list-state" role="status" aria-live="polite">
            <InlineSpinner label={t('articles.loadingArticle')} />
            <p>{t('articles.loadingArticle')}</p>
          </section>
        )}

        {status === 'error' && (
          <section className="articles-list-state articles-list-state--error" role="alert">
            <h1>{t('articles.errorTitle')}</h1>
            <p>{errorMessage}</p>
            <Link to={`/${language}/articles`} className="article-back-link">
              {t('articles.backToList')}
            </Link>
          </section>
        )}

        {status === 'success' && article && (
          <div className={`article-layout ${visibleRelatedArticles.length ? 'article-layout--with-related' : ''}`.trim()}>
            <div className="article-main-column">
              <article>
                <header className="article-header-card">
                  <div className="article-header-card__eyebrow">{t('articles.detailEyebrow')}</div>

                  {article.coverImage ? (
                    <div className="article-cover">
                      <img src={article.coverImage} alt={pickCoverAlt(article, language, t)} loading="eager" decoding="async" />
                    </div>
                  ) : null}

                  <h1>{article.title}</h1>
                  {article.excerpt ? <p className="article-header-card__excerpt">{article.excerpt}</p> : null}

                  <div className="article-header-card__meta">
                    <span>{article.author || t('articles.unknownAuthor')}</span>
                    {article.publishedAt ? <span>{formatPublishedDate(article.publishedAt, language)}</span> : null}
                  </div>

                  <Link to={`/${language}/articles`} className="article-back-link">
                    {t('articles.backToList')}
                  </Link>
                </header>
              </article>

              <section className="article-content-card">
                <ArticleMarkdown content={article.content} />
              </section>
            </div>

            {visibleRelatedArticles.length > 0 && (
              <aside className="articles-related-card">
                <div className="articles-section-card__eyebrow">{t('articles.relatedEyebrow')}</div>
                <h2>{t('articles.relatedTitle')}</h2>
                <div className="articles-related-list">
                  {visibleRelatedArticles.map((relatedArticle) => (
                    <article key={relatedArticle.id || relatedArticle.slug} className="articles-list-compact">
                      <div className="articles-list-compact__meta">
                        <span>{relatedArticle.author || t('articles.unknownAuthor')}</span>
                        {relatedArticle.publishedAt ? <span>{formatPublishedDate(relatedArticle.publishedAt, language)}</span> : null}
                      </div>
                      <h3 className="articles-list-compact__title">
                        <Link to={`/${language}/articles/${relatedArticle.slug}`}>{relatedArticle.title}</Link>
                      </h3>
                      {relatedArticle.excerpt ? <p className="articles-list-compact__excerpt">{relatedArticle.excerpt}</p> : null}
                    </article>
                  ))}
                </div>
              </aside>
            )}
          </div>
        )}
      </ToolPageShell>
    </>
  )
}

export default ArticlePage
