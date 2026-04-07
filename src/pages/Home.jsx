import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import SEO from '../components/SEO'
import './Home.css'

function Home() {
  const { t, language } = useLanguage()
  const [search, setSearch] = useState('')
  const [filteredTools, setFilteredTools] = useState([])
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category')

  const tools = [
    {
      id: 'number-to-words',
      path: '/number-to-words',
      icon: '🔢',
      titleKey: 'tools.numberToWords.title',
      descriptionKey: 'tools.numberToWords.description',
      category: 'converters'
    },
    {
      id: 'vat-calculator',
      path: '/vat-calculator',
      icon: '💰',
      titleKey: 'tools.vatCalculator.title',
      descriptionKey: 'tools.vatCalculator.description',
      category: 'calculators'
    },
    {
      id: 'compound-interest',
      path: '/compound-interest',
      icon: '📈',
      titleKey: 'tools.compoundInterest.title',
      descriptionKey: 'tools.compoundInterest.description',
      category: 'calculators'
    },
    {
      id: 'seo-audit-pro',
      path: '/seo-audit-pro',
      icon: '🚀',
      titleKey: 'tools.seoAuditPro.title',
      descriptionKey: 'tools.seoAuditPro.description',
      category: 'tools'
    },
    {
      id: 'qr-code-generator',
      path: '/qr-code-generator',
      icon: '📱',
      titleKey: 'tools.qrCodeGenerator.title',
      descriptionKey: 'tools.qrCodeGenerator.description',
      category: 'generators'
    },
    {
      id: 'url-shortener',
      path: '/url-shortener',
      icon: '🔗',
      titleKey: 'tools.urlShortener.title',
      descriptionKey: 'tools.urlShortener.description',
      category: 'generators'
    },
    {
      id: 'password-generator',
      path: '/password-generator',
      icon: '🔐',
      titleKey: 'tools.passwordGenerator.title',
      descriptionKey: 'tools.passwordGenerator.description',
      category: 'generators'
    },
    {
      id: 'meta-tags-generator',
      path: '/meta-tags-generator',
      icon: '🏷️',
      titleKey: 'tools.metaTagsGenerator.title',
      descriptionKey: 'tools.metaTagsGenerator.description',
      category: 'tools'
    },
    {
      id: 'random-number',
      path: '/random-number',
      icon: '🎲',
      titleKey: 'tools.randomNumber.title',
      descriptionKey: 'tools.randomNumber.description',
      category: 'generators'
    },
    {
      id: 'calculator',
      path: '/calculator',
      icon: '🧮',
      titleKey: 'tools.calculator.title',
      descriptionKey: 'tools.calculator.description',
      category: 'calculators'
    },
    {
      id: 'time-calculator',
      path: '/time-calculator',
      icon: '⏰',
      titleKey: 'tools.timeCalculator.title',
      descriptionKey: 'tools.timeCalculator.description',
      category: 'calculators'
    }
  ]

  useEffect(() => {
    let result = tools

    // Фильтр по категории из URL
    if (categoryFilter) {
      result = result.filter(tool => tool.category === categoryFilter)
    }

    // Фильтр по поиску
    if (search.trim() !== '') {
      const query = search.toLowerCase()
      result = result.filter(
        tool =>
          t(tool.titleKey).toLowerCase().includes(query) ||
          t(tool.descriptionKey).toLowerCase().includes(query)
      )
    }

    setFilteredTools(result)
  }, [search, categoryFilter, language])

  return (
    <>
      <SEO
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        path={`/${language}`}
        keywords={t('seo.home.keywords')}
      />

      <div className="home">
        <div className="container">
          <div className="hero">
            <h1>{t('home.title')}</h1>
            <p>{t('home.subtitle')}</p>

            <div className="search-box">
              <input
                type="text"
                placeholder={`🔍 ${t('common.search')}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="tools-grid">
            {filteredTools.length > 0 ? (
              filteredTools.map(tool => (
                <Link to={`/${language}${tool.path}`} key={tool.id} className="tool-card">
                  <div className="tool-icon">{tool.icon}</div>
                  <h2>{t(tool.titleKey)}</h2>
                  <p>{t(tool.descriptionKey)}</p>
                </Link>
              ))
            ) : (
              <div className="no-results">
                <p>{t('common.noResults')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
