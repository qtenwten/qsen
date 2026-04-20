import { useLanguage } from '../contexts/LanguageContext'
import { useState } from 'react'
import SEO from '../components/SEO'
import RelatedTools from '../components/RelatedTools'
import ToolDescriptionSection, { ToolFaq } from '../components/ToolDescriptionSection'
import InlineSpinner from '../components/InlineSpinner'
import { ResultDetails, ResultNotice, ResultSection, ResultSummary } from '../components/ResultSection'
import ToolPageShell, { ToolControls, ToolHelp, ToolPageHero, ToolRelated } from '../components/ToolPageShell'
import { analyzeSEO } from '../utils/seoAudit'

function SEOAudit() {
  const { t, language } = useLanguage()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError(t('seoAudit.emptyUrl'))
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
      setError(t('seoAudit.analyzeError'))
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
        title={t('seo.seoAudit.title')}
        description={t('seo.seoAudit.description')}
        path={`/${language}/seo-audit`}
        keywords={t('seo.seoAudit.keywords')}
      />

      <ToolPageShell>
        <ToolPageHero title={t('seoAudit.title')} subtitle={t('seoAudit.subtitle')} />

        <ToolControls>
        <div className="field">
          <label htmlFor="url">{t('seoAudit.urlLabel')}</label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="https://example.com"
          />
        </div>

        {error && (
          <ResultNotice tone="error" title={`⚠️ ${t('seoAudit.limitation')}`} style={{ marginBottom: '1rem' }}>
            <p>{error}</p>
            <p>💡 <strong>{t('seoAudit.tip')}</strong> {t('seoAudit.corsTip')}</p>
          </ResultNotice>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{ width: '100%', marginBottom: '2rem' }}
        >
          {loading ? (
            <span className="button-spinner">
              <InlineSpinner label={t('seoAudit.analyzing')} />
            </span>
          ) : t('seoAudit.analyze')}
        </button>

        {result && (
          <>
            <ResultSection tone="success" style={{ marginBottom: '2rem' }}>
              <ResultSummary
                centered
                kicker={t('seoAudit.score')}
                score={result.score}
                scoreColor={getScoreColor(result.score)}
                description={
                  result.score >= 80 ? `✅ ${t('seoAudit.excellent')}` :
                  result.score >= 60 ? `⚠️ ${t('seoAudit.good')}` :
                  `❌ ${t('seoAudit.poor')}`
                }
              />
            </ResultSection>

            {result.issues.length > 0 && (
              <ResultDetails title={t('seoAudit.issues')} style={{ marginBottom: '2rem' }}>
                <div className="surface-panel surface-panel--subtle">
                  {result.issues.map((issue, index) => (
                    <div key={index} className="seo-audit-pro-list-item" style={{ borderBottom: index < result.issues.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span className="seo-audit-pro-list-icon">{getIssueIcon(issue.type)}</span>
                      <span className="seo-audit-pro-list-text">{issue.text}</span>
                    </div>
                  ))}
                </div>
              </ResultDetails>
            )}

            {result.suggestions.length > 0 && (
              <ResultDetails title={t('seoAudit.suggestions')} style={{ marginBottom: '2rem' }}>
                <div className="surface-panel surface-panel--subtle">
                  <ul className="seo-audit-pro-list">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </ResultDetails>
            )}

            <ResultDetails title={t('seoAudit.details')} style={{ marginBottom: '2rem' }}>
              <div className="surface-panel surface-panel--subtle">
                <div className="meta-grid">
                  <div className="meta-item">
                    <strong>Title:</strong>
                    <div className="meta-item-value">
                      {result.details.title ? `${result.details.title.substring(0, 50)}...` : t('seoAudit.missing')}
                    </div>
                  </div>
                  <div className="meta-item">
                    <strong>{t('seoAudit.h1')}:</strong>
                    <div className="meta-item-value">
                      {result.details.h1Count}
                    </div>
                  </div>
                  <div className="meta-item">
                    <strong>{t('seoAudit.h2')}:</strong>
                    <div className="meta-item-value">
                      {result.details.h2Count}
                    </div>
                  </div>
                  <div className="meta-item">
                    <strong>{t('seoAudit.images')}:</strong>
                    <div className="meta-item-value">
                      {result.details.imagesTotal} ({t('seoAudit.withoutAlt')}: {result.details.imagesWithoutAlt})
                    </div>
                  </div>
                  <div className="meta-item">
                    <strong>Open Graph:</strong>
                    <div className="meta-item-value">
                      {result.details.hasOG ? `✅ ${t('seoAudit.ogReady')}` : `❌ ${t('seoAudit.ogMissing')}`}
                    </div>
                  </div>
                  <div className="meta-item">
                    <strong>{t('seoAudit.structuredData')}:</strong>
                    <div className="meta-item-value">
                      {result.details.hasStructuredData ? `✅ ${t('seoAudit.structuredYes')}` : `❌ ${t('seoAudit.structuredNo')}`}
                    </div>
                  </div>
                </div>
              </div>
            </ResultDetails>
          </>
        )}

        </ToolControls>

        <ToolHelp>
        <ToolDescriptionSection>
          <div className="tool-help-prose">
          <h2 className="tool-help-heading">{t('seoAudit.infoTitle')}</h2>
          <p>
            {t('seoAudit.infoDescription')}
          </p>

          <h3 className="tool-help-subheading">{t('seoAudit.checksTitle')}</h3>
          <ul>
            <li key="titles">{t('seoAudit.checks.titles')}</li>
            <li key="headings">{t('seoAudit.checks.headings')}</li>
            <li key="images">{t('seoAudit.checks.images')}</li>
            <li key="og">{t('seoAudit.checks.og')}</li>
            <li key="structured">{t('seoAudit.checks.structured')}</li>
          </ul>

          <h3 className="tool-help-subheading">{t('seoAudit.limitsTitle')}</h3>
          <p>
            {t('seoAudit.limitsText')}
          </p>

          <h3 className="tool-help-subheading">{t('seoAudit.ratingTitle')}</h3>
          <ul>
            <li key="high">{t('seoAudit.rating.high')}</li>
            <li key="mid">{t('seoAudit.rating.mid')}</li>
            <li key="low">{t('seoAudit.rating.low')}</li>
          </ul>

          <ToolFaq title={t('seoAudit.faqTitle')} items={[
            { q: t('seoAudit.faq.q1'), a: t('seoAudit.faq.a1') },
            { q: t('seoAudit.faq.q2'), a: t('seoAudit.faq.a2') },
            { q: t('seoAudit.faq.q3'), a: t('seoAudit.faq.a3') },
            { q: t('seoAudit.faq.q4'), a: t('seoAudit.faq.a4') },
          ]} />
          </div>
        </ToolDescriptionSection>

        </ToolHelp>

        <ToolRelated>
          <RelatedTools currentPath={`/${language}/seo-audit`} />
        </ToolRelated>
      </ToolPageShell>
    </>
  )
}

export default SEOAudit
