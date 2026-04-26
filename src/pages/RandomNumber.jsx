import { useLanguage } from '../contexts/LanguageContext'
import { useState, useEffect } from 'react'
import SEO from '../components/SEO'
import CopyButton from '../components/CopyButton'
import RelatedTools from '../components/RelatedTools'
import Icon from '../components/Icon'
import ToolDescriptionSection, { ToolFaq } from '../components/ToolDescriptionSection'
import { generateRandomNumbers } from '../utils/randomGenerator'
import { filterNumberInput, handleNumberKeyDown } from '../utils/numberInput'
import { safeGetItem, safeSetItem, safeRemoveItem, safeParseJSON } from '../utils/storage'

function RandomNumber() {
  const { t, language } = useLanguage()
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [count, setCount] = useState('1')
  const [unique, setUnique] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = safeGetItem('randomNumber')
    if (saved) {
      const data = safeParseJSON(saved, {})
      setMin(data.min || '1')
      setMax(data.max || '100')
      setCount(data.count || '1')
      setUnique(data.unique || false)
    }
  }, [])

  const handleGenerate = () => {
    const res = generateRandomNumbers(min, max, count, unique)
    if (res.error) {
      setError(t('randomNumber.errors.' + res.error))
      setResult(null)
    } else {
      setError('')
      setResult(res.numbers)
      safeSetItem('randomNumber', JSON.stringify({ min, max, count, unique }))
    }
  }

  const handleClear = () => {
    setMin('1')
    setMax('100')
    setCount('1')
    setUnique(false)
    setResult(null)
    setError('')
    safeRemoveItem('randomNumber')
  }

  return (
    <>
      <SEO
        title={t('seo.randomNumber.title')}
        description={t('seo.randomNumber.description')}
        path={`/${language}/random-number`}
        keywords={t('seo.randomNumber.keywords')}
      />

      <div className="tool-container random-number-page">
        <section className="random-number-hero" aria-labelledby="random-number-heading">
          <h1 id="random-number-heading" className="random-number-hero__title">
            <span className="random-number-hero__title-wrap">
              <Icon name="casino" size={22} className="random-number-hero__icon" />
              <span className="random-number-hero__title-text">{t('randomNumber.title')}</span>
            </span>
          </h1>
          <p className="random-number-hero__subtitle">{t('randomNumber.subtitle')}</p>
        </section>

        <div className="field">
          <label htmlFor="min">{t('randomNumber.min')}</label>
          <input
            id="min"
            type="text"
            value={min}
            onChange={(e) => setMin(filterNumberInput(e.target.value))}
            onKeyDown={handleNumberKeyDown}
            placeholder="1"
          />
        </div>

        <div className="field">
          <label htmlFor="max">{t('randomNumber.max')}</label>
          <input
            id="max"
            type="text"
            value={max}
            onChange={(e) => setMax(filterNumberInput(e.target.value))}
            onKeyDown={handleNumberKeyDown}
            placeholder="100"
          />
        </div>

        <div className="field">
          <label htmlFor="count">{t('randomNumber.count')}</label>
          <input
            id="count"
            type="text"
            value={count}
            onChange={(e) => setCount(filterNumberInput(e.target.value))}
            onKeyDown={handleNumberKeyDown}
            placeholder="1"
            min="1"
            max="10000"
          />
        </div>

        <div className="field">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              id="unique"
              type="checkbox"
              checked={unique}
              onChange={(e) => setUnique(e.target.checked)}
            />
            {t('randomNumber.unique')}
          </label>
        </div>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result-box success">
            <div className="result-value">{result.join(', ')}</div>
            <CopyButton text={result.join(', ')} />
          </div>
        )}

        <div className="btn-group">
          <button onClick={handleGenerate}>
            {t('randomNumber.generate')}
          </button>
          <button onClick={handleClear} className="secondary">
            {t('randomNumber.clear')}
          </button>
        </div>

        <ToolDescriptionSection>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t('randomNumber.infoTitle')}</h2>
          <div className="tool-description-lead">
            <p style={{ marginBottom: '1rem', color: 'var(--text)' }}>
              {t('randomNumber.infoDescription')}
            </p>
          </div>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{t('randomNumber.featuresTitle')}</h3>
          <ul style={{ marginLeft: '1.5rem', color: 'var(--text)', lineHeight: '1.8' }}>
            <li key="range">{t('randomNumber.features.range')}</li>
            <li key="sets">{t('randomNumber.features.sets')}</li>
            <li key="noRepeat">{t('randomNumber.features.noRepeat')}</li>
            <li key="withRepeat">{t('randomNumber.features.withRepeat')}</li>
            <li key="persist">{t('randomNumber.features.persist')}</li>
          </ul>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{t('randomNumber.popularTitle')}</h3>
          <ul style={{ marginLeft: '1.5rem', color: 'var(--text)', lineHeight: '1.8' }}>
            <li key="oneToHundred">{t('randomNumber.popular.oneToHundred')}</li>
            <li key="randomizer">{t('randomNumber.popular.randomizer')}</li>
            <li key="unique">{t('randomNumber.popular.unique')}</li>
            <li key="oneToTen">{t('randomNumber.popular.oneToTen')}</li>
            <li key="noDuplicates">{t('randomNumber.popular.noDuplicates')}</li>
          </ul>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{t('randomNumber.examplesTitle')}</h3>
          <div className="tool-description-paragraph-stack">
            <p style={{ color: 'var(--text)', lineHeight: '1.8' }}>
              <strong>{t('randomNumber.lotteryLabel')}</strong> {t('randomNumber.lotteryText')}
            </p>
            <p style={{ color: 'var(--text)', lineHeight: '1.8', marginTop: '0.5rem' }}>
              <strong>{t('randomNumber.gamesLabel')}</strong> {t('randomNumber.gamesText')}
            </p>
            <p style={{ color: 'var(--text)', lineHeight: '1.8', marginTop: '0.5rem' }}>
              <strong>{t('randomNumber.sampleLabel')}</strong> {t('randomNumber.sampleText')}
            </p>
          </div>

          <ToolFaq title={t('randomNumber.faqTitle')} items={[
            { q: t('randomNumber.faq.q1'), a: t('randomNumber.faq.a1') },
            { q: t('randomNumber.faq.q2'), a: t('randomNumber.faq.a2') },
            { q: t('randomNumber.faq.q3'), a: t('randomNumber.faq.a3') },
            { q: t('randomNumber.faq.q4'), a: t('randomNumber.faq.a4') },
          ]} />
        </ToolDescriptionSection>

        <RelatedTools currentPath={`/${language}/random-number`} />
      </div>
    </>
  )
}

export default RandomNumber
