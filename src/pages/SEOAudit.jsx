import { useLanguage } from '../contexts/LanguageContext'
import { useState } from 'react'
import SEO from '../components/SEO'
import RelatedTools from '../components/RelatedTools'
import { analyzeSEO } from '../utils/seoAudit'

function SEOAudit() {
  const { t, language } = useLanguage()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const copy = language === 'en'
    ? {
        seo: {
          title: 'SEO Audit Online - Basic Website SEO Check',
          description: 'Free SEO audit tool for checking meta tags, headings, images, and Open Graph markup on a website.',
          keywords: 'SEO audit, website SEO check, meta tags audit, heading analysis, Open Graph checker'
        },
        title: 'SEO Audit',
        subtitle: 'Check the basic SEO quality of your website',
        urlLabel: 'Website URL',
        emptyUrl: 'Enter a URL to analyze',
        analyzeError: 'An error occurred during the analysis. Check the URL and try again.',
        limitation: 'Limitation:',
        tip: 'Tip:',
        corsTip: 'This tool works only for websites without CORS restrictions. For full analysis of external sites, use the server-side SEO audit tool.',
        analyze: 'Analyze',
        analyzing: 'Analyzing...',
        score: 'SEO Score',
        excellent: 'Excellent optimization',
        good: 'Good, but there is room to improve',
        poor: 'Optimization is needed',
        issues: 'Found issues',
        suggestions: 'Recommendations',
        details: 'Analysis details',
        missing: 'Missing',
        h1: 'H1 headings',
        h2: 'H2 headings',
        images: 'Images',
        withoutAlt: 'without alt',
        ogReady: 'Configured',
        ogMissing: 'Missing',
        structuredYes: 'Present',
        structuredNo: 'Missing',
        infoTitle: 'How to use the SEO audit',
        infoDescription: 'This tool quickly checks basic on-page SEO elements: meta tags, headings, images, and Open Graph markup.',
        checksTitle: 'What is checked:',
        checks: [
          'Title and meta description - presence and optimal length',
          'Heading structure: H1, H2, H3',
          'Image alt attributes',
          'Open Graph tags for social sharing',
          'Structured data (JSON-LD)'
        ],
        limitsTitle: 'Limitations:',
        limitsText: 'This version works in the browser and can analyze only websites without CORS restrictions. Use the server-side audit for external websites.',
        ratingTitle: 'Score guide:',
        rating: ['80-100 points - excellent SEO', '60-79 points - good, but can be improved', '0-59 points - serious optimization needed']
      }
    : {
        seo: {
          title: 'SEO Аудит сайта онлайн - Проверка SEO оптимизации',
          description: 'Бесплатный инструмент для SEO аудита сайта. Проверка meta-тегов, заголовков, изображений и Open Graph.',
          keywords: 'SEO аудит, проверка SEO сайта, аудит мета-тегов, анализ заголовков, Open Graph'
        },
        title: 'SEO Аудит сайта',
        subtitle: 'Проверьте SEO оптимизацию вашего сайта',
        urlLabel: 'URL сайта',
        emptyUrl: 'Введите URL для анализа',
        analyzeError: 'Ошибка при анализе сайта. Проверьте URL и попробуйте снова.',
        limitation: 'Ограничение:',
        tip: 'Совет:',
        corsTip: 'Этот инструмент работает только для сайтов без CORS ограничений. Для полного анализа внешних сайтов рекомендуем использовать серверный инструмент SEO-аудита.',
        analyze: 'Анализировать',
        analyzing: 'Анализ...',
        score: 'SEO Оценка',
        excellent: 'Отличная оптимизация',
        good: 'Хорошо, но есть что улучшить',
        poor: 'Требуется оптимизация',
        issues: 'Найденные проблемы',
        suggestions: 'Рекомендации',
        details: 'Детали анализа',
        missing: 'Отсутствует',
        h1: 'H1 заголовков',
        h2: 'H2 заголовков',
        images: 'Изображений',
        withoutAlt: 'без alt',
        ogReady: 'Настроен',
        ogMissing: 'Отсутствует',
        structuredYes: 'Есть',
        structuredNo: 'Нет',
        infoTitle: 'Как пользоваться SEO аудитом',
        infoDescription: 'Инструмент для быстрой проверки базовых SEO параметров сайта. Анализирует meta-теги, заголовки, изображения и Open Graph разметку.',
        checksTitle: 'Что проверяется:',
        checks: [
          'Title и meta description - наличие и оптимальная длина',
          'Структура заголовков H1, H2, H3',
          'Alt-атрибуты у изображений',
          'Open Graph теги для соцсетей',
          'Структурированные данные (JSON-LD)'
        ],
        limitsTitle: 'Ограничения:',
        limitsText: 'Инструмент работает на стороне клиента и может анализировать только сайты без CORS ограничений. Для полного анализа внешних сайтов используйте серверные инструменты SEO аудита.',
        ratingTitle: 'Оценка:',
        rating: ['80-100 баллов - отличная SEO оптимизация', '60-79 баллов - хорошо, но есть что улучшить', '0-59 баллов - требуется серьезная оптимизация']
      }

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError(copy.emptyUrl)
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const analysis = await analyzeSEO(url, language)

      if (analysis.error) {
        if (analysis.error === 'cors') {
          setError(analysis.message)
        } else {
          setError(analysis.error)
        }
      } else {
        setResult(analysis)
      }
    } catch (err) {
      setError(copy.analyzeError)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)'
    if (score >= 60) return '#f59e0b'
    return 'var(--error)'
  }

  const getIssueIcon = (type) => {
    if (type === 'error') return '🔴'
    if (type === 'warning') return '🟡'
    return '🔵'
  }

  return (
    <>
      <SEO
        title={copy.seo.title}
        description={copy.seo.description}
        path={`/${language}/seo-audit`}
        keywords={copy.seo.keywords}
      />

      <div className="tool-container">
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>

        <div className="field">
          <label htmlFor="url">{copy.urlLabel}</label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="https://example.com"
            autoFocus
          />
        </div>

        {error && (
          <div style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid var(--error)',
            borderRadius: '8px',
            marginBottom: '1rem',
            color: 'var(--text)'
          }}>
            <strong>⚠️ {copy.limitation}</strong>
            <p style={{ marginTop: '0.5rem', marginBottom: '0' }}>{error}</p>
            <p style={{ marginTop: '0.5rem', marginBottom: '0', fontSize: '0.9rem' }}>
              💡 <strong>{copy.tip}</strong> {copy.corsTip}
            </p>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{ width: '100%', marginBottom: '2rem' }}
        >
          {loading ? copy.analyzing : copy.analyze}
        </button>

        {result && (
          <>
            <div className="result-box success" style={{ marginBottom: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: getScoreColor(result.score) }}>
                  {result.score}
                </div>
                <div style={{ fontSize: '1.25rem', marginTop: '0.5rem' }}>
                  {copy.score}
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {result.score >= 80 && `✅ ${copy.excellent}`}
                  {result.score >= 60 && result.score < 80 && `⚠️ ${copy.good}`}
                  {result.score < 60 && `❌ ${copy.poor}`}
                </div>
              </div>
            </div>

            {result.issues.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{copy.issues}</h2>
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px' }}>
                  {result.issues.map((issue, index) => (
                    <div key={index} style={{
                      padding: '0.75rem 0',
                      borderBottom: index < result.issues.length - 1 ? '1px solid var(--border)' : 'none',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}>
                      <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{getIssueIcon(issue.type)}</span>
                      <span style={{ color: 'var(--text)' }}>{issue.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{copy.suggestions}</h2>
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px' }}>
                  <ul style={{ marginLeft: '1.5rem', color: 'var(--text)', lineHeight: '1.8' }}>
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{copy.details}</h2>
              <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <strong>Title:</strong>
                    <div style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {result.details.title ? `${result.details.title.substring(0, 50)}...` : copy.missing}
                    </div>
                  </div>
                  <div>
                    <strong>{copy.h1}:</strong>
                    <div style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {result.details.h1Count}
                    </div>
                  </div>
                  <div>
                    <strong>{copy.h2}:</strong>
                    <div style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {result.details.h2Count}
                    </div>
                  </div>
                  <div>
                    <strong>{copy.images}:</strong>
                    <div style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {result.details.imagesTotal} ({copy.withoutAlt}: {result.details.imagesWithoutAlt})
                    </div>
                  </div>
                  <div>
                    <strong>Open Graph:</strong>
                    <div style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {result.details.hasOG ? `✅ ${copy.ogReady}` : `❌ ${copy.ogMissing}`}
                    </div>
                  </div>
                  <div>
                    <strong>{language === 'en' ? 'Structured data' : 'Структурированные данные'}:</strong>
                    <div style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {result.details.hasStructuredData ? `✅ ${copy.structuredYes}` : `❌ ${copy.structuredNo}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{copy.infoTitle}</h2>
          <p style={{ marginBottom: '1rem', color: 'var(--text)' }}>
            {copy.infoDescription}
          </p>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{copy.checksTitle}</h3>
          <ul style={{ marginLeft: '1.5rem', color: 'var(--text)', lineHeight: '1.8' }}>
            {copy.checks.map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{copy.limitsTitle}</h3>
          <p style={{ color: 'var(--text)', lineHeight: '1.8' }}>
            {copy.limitsText}
          </p>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{copy.ratingTitle}</h3>
          <ul style={{ marginLeft: '1.5rem', color: 'var(--text)', lineHeight: '1.8' }}>
            {copy.rating.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <RelatedTools currentPath={`/${language}/seo-audit`} />
      </div>
    </>
  )
}

export default SEOAudit
