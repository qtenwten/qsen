import { useLanguage } from '../contexts/LanguageContext'
import { useState, useEffect } from 'react'
import SEO from '../components/SEO'
import CopyButton from '../components/CopyButton'
import RelatedTools from '../components/RelatedTools'
import LineChart from '../components/LineChart'
import ToolDescriptionSection, { ToolFaq } from '../components/ToolDescriptionSection'
import { calculateCompoundInterest, formatNumber } from '../utils/compoundInterest'
import { filterNumberInput, handleNumberKeyDown } from '../utils/numberInput'
import { safeGetItem, safeSetItem, safeRemoveItem, safeParseJSON } from '../utils/storage'

function CompoundInterest() {
  const { t, language } = useLanguage()
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('7')
  const [years, setYears] = useState('10')
  const [frequency, setFrequency] = useState('12')
  const [monthlyContribution, setMonthlyContribution] = useState('0')
  const [result, setResult] = useState(null)

  const locale = language === 'en' ? 'en-US' : 'ru-RU'

  useEffect(() => {
    const saved = safeGetItem('compoundInterest')
    if (saved) {
      const data = safeParseJSON(saved, {})
      setPrincipal(data.principal || '10000')
      setRate(data.rate || '7')
      setYears(data.years || '10')
      setFrequency(data.frequency || '12')
      setMonthlyContribution(data.monthlyContribution || '0')
    }
  }, [])

  useEffect(() => {
    if (principal && rate && years && frequency) {
      const res = calculateCompoundInterest(principal, rate, years, frequency, monthlyContribution)
      setResult(res)
      safeSetItem('compoundInterest', JSON.stringify({
        principal,
        rate,
        years,
        frequency,
        monthlyContribution
      }))
    } else {
      setResult(null)
    }
  }, [principal, rate, years, frequency, monthlyContribution])

  const handleClear = () => {
    setPrincipal('10000')
    setRate('7')
    setYears('10')
    setFrequency('12')
    setMonthlyContribution('0')
    setResult(null)
    safeRemoveItem('compoundInterest')
  }

  const copyText = language === 'en'
    ? `Final amount: ${formatNumber(result?.finalAmount, locale)} ₽\nInvested: ${formatNumber(result?.totalInvested, locale)} ₽\nEarned: ${formatNumber(result?.earnedInterest, locale)} ₽`
    : `Итоговая сумма: ${formatNumber(result?.finalAmount, locale)} ₽\nВложено: ${formatNumber(result?.totalInvested, locale)} ₽\nЗаработано: ${formatNumber(result?.earnedInterest, locale)} ₽`

  return (
    <>
      <SEO
        title={t('seo.compoundInterest.title')}
        description={t('seo.compoundInterest.description')}
        path={`/${language}/compound-interest`}
        keywords={t('seo.compoundInterest.keywords')}
      />

      <div className="tool-container">
        <h1>{t('compoundInterest.title')}</h1>
        <p>{t('compoundInterest.subtitle')}</p>

        <div className="field">
          <label htmlFor="principal">{t('compoundInterest.principal')}</label>
          <input
            id="principal"
            type="text"
            value={principal}
            onChange={(e) => setPrincipal(filterNumberInput(e.target.value))}
            onKeyDown={handleNumberKeyDown}
            placeholder="10000"
          />
        </div>

        <div className="field">
          <label htmlFor="rate">{t('compoundInterest.rate')}</label>
          <input
            id="rate"
            type="text"
            value={rate}
            onChange={(e) => setRate(filterNumberInput(e.target.value))}
            onKeyDown={handleNumberKeyDown}
            placeholder="7"
          />
        </div>

        <div className="field">
          <label htmlFor="years">{t('compoundInterest.years')}</label>
          <input
            id="years"
            type="text"
            value={years}
            onChange={(e) => setYears(filterNumberInput(e.target.value))}
            onKeyDown={handleNumberKeyDown}
            placeholder="10"
          />
        </div>

        <div className="field">
          <label htmlFor="frequency">{t('compoundInterest.frequency')}</label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="1">{t('compoundInterest.yearly')}</option>
            <option value="12">{t('compoundInterest.monthly')}</option>
            <option value="365">{t('compoundInterest.daily')}</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="monthlyContribution">{t('compoundInterest.monthlyContribution')}</label>
          <input
            id="monthlyContribution"
            type="text"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(filterNumberInput(e.target.value))}
            onKeyDown={handleNumberKeyDown}
            placeholder="0"
          />
        </div>

        {result && (
          <>
            <div className="result-box success" style={{ marginTop: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong>{t('compoundInterest.finalAmount')}</strong>
                <div className="result-value" style={{ fontSize: '1.75rem', color: 'var(--success)' }}>
                  {formatNumber(result.finalAmount, locale)} ₽
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <strong>{t('compoundInterest.totalInvested')}</strong>
                  <div style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>
                    {formatNumber(result.totalInvested, locale)} ₽
                  </div>
                </div>
                <div>
                  <strong>{t('compoundInterest.earned')}</strong>
                  <div style={{ fontSize: '1.25rem', marginTop: '0.25rem', color: 'var(--success)' }}>
                    {formatNumber(result.earnedInterest, locale)} ₽
                  </div>
                </div>
              </div>
              <CopyButton text={copyText} />
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                💡 {t('compoundInterest.chartNote')}
              </p>
            </div>

            <div style={{ marginTop: '2rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{t('compoundInterest.chartTitle')}</h2>
              <LineChart data={result.chartData} width={600} height={300} />
            </div>
          </>
        )}

        <div className="btn-group" style={{ marginTop: '1.5rem' }}>
          <button onClick={handleClear} className="secondary">
            {t('compoundInterest.reset')}
          </button>
        </div>

        <ToolDescriptionSection>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t('compoundInterest.infoTitle')}</h2>
          <div className="tool-description-lead">
            <p style={{ marginBottom: '1rem', color: 'var(--text)' }}>
              {t('compoundInterest.infoDescription')}
            </p>
          </div>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{t('compoundInterest.featuresTitle')}</h3>
          <ul style={{ marginLeft: '1.5rem', color: 'var(--text)', lineHeight: '1.8' }}>
            <li key="futureValue">{t('compoundInterest.features.futureValue')}</li>
            <li key="contributions">{t('compoundInterest.features.contributions')}</li>
            <li key="chart">{t('compoundInterest.features.chart')}</li>
            <li key="breakdown">{t('compoundInterest.features.breakdown')}</li>
            <li key="compare">{t('compoundInterest.features.compare')}</li>
          </ul>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{t('compoundInterest.formulaTitle')}</h3>
          <p style={{ color: 'var(--text)', lineHeight: '1.8' }}>
            {t('compoundInterest.formula')}
          </p>
          <ul style={{ marginLeft: '1.5rem', color: 'var(--text)', lineHeight: '1.8', marginTop: '0.5rem' }}>
            <li key="A">{t('compoundInterest.formulaItems.A')}</li>
            <li key="P">{t('compoundInterest.formulaItems.P')}</li>
            <li key="r">{t('compoundInterest.formulaItems.r')}</li>
            <li key="n">{t('compoundInterest.formulaItems.n')}</li>
            <li key="t">{t('compoundInterest.formulaItems.t')}</li>
          </ul>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{t('compoundInterest.examplesTitle')}</h3>
          <div className="tool-description-paragraph-stack">
            <p style={{ color: 'var(--text)', lineHeight: '1.8' }}>
              <strong>{t('compoundInterest.longTermLabel')}</strong> {t('compoundInterest.longTermText')}
            </p>
            <p style={{ color: 'var(--text)', lineHeight: '1.8', marginTop: '0.5rem' }}>
              <strong>{t('compoundInterest.recurringLabel')}</strong> {t('compoundInterest.recurringText')}
            </p>
            <p style={{ color: 'var(--text)', lineHeight: '1.8', marginTop: '0.5rem' }}>
              <strong>{t('compoundInterest.compareLabel')}</strong> {t('compoundInterest.compareText')}
            </p>
          </div>

          <ToolFaq title={t('compoundInterest.faqTitle')} items={[
            { q: t('compoundInterest.faq.q1'), a: t('compoundInterest.faq.a1') },
            { q: t('compoundInterest.faq.q2'), a: t('compoundInterest.faq.a2') },
            { q: t('compoundInterest.faq.q3'), a: t('compoundInterest.faq.a3') },
            { q: t('compoundInterest.faq.q4'), a: t('compoundInterest.faq.a4') },
          ]} />
        </ToolDescriptionSection>

        <RelatedTools currentPath={`/${language}/compound-interest`} />
      </div>
    </>
  )
}

export default CompoundInterest
