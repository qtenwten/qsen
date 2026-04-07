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
      icon: 'text_fields',
      titleKey: 'tools.numberToWords.title',
      descriptionKey: 'tools.numberToWords.description',
      category: 'converters'
    },
    {
      id: 'vat-calculator',
      path: '/vat-calculator',
      icon: 'payments',
      titleKey: 'tools.vatCalculator.title',
      descriptionKey: 'tools.vatCalculator.description',
      category: 'calculators'
    },
    {
      id: 'compound-interest',
      path: '/compound-interest',
      icon: 'trending_up',
      titleKey: 'tools.compoundInterest.title',
      descriptionKey: 'tools.compoundInterest.description',
      category: 'calculators'
    },
    {
      id: 'seo-audit-pro',
      path: '/seo-audit-pro',
      icon: 'rocket_launch',
      titleKey: 'tools.seoAuditPro.title',
      descriptionKey: 'tools.seoAuditPro.description',
      category: 'tools'
    },
    {
      id: 'qr-code-generator',
      path: '/qr-code-generator',
      icon: 'qr_code',
      titleKey: 'tools.qrCodeGenerator.title',
      descriptionKey: 'tools.qrCodeGenerator.description',
      category: 'generators'
    },
    {
      id: 'url-shortener',
      path: '/url-shortener',
      icon: 'link',
      titleKey: 'tools.urlShortener.title',
      descriptionKey: 'tools.urlShortener.description',
      category: 'generators'
    },
    {
      id: 'password-generator',
      path: '/password-generator',
      icon: 'lock',
      titleKey: 'tools.passwordGenerator.title',
      descriptionKey: 'tools.passwordGenerator.description',
      category: 'generators'
    },
    {
      id: 'meta-tags-generator',
      path: '/meta-tags-generator',
      icon: 'label',
      titleKey: 'tools.metaTagsGenerator.title',
      descriptionKey: 'tools.metaTagsGenerator.description',
      category: 'tools'
    },
    {
      id: 'random-number',
      path: '/random-number',
      icon: 'casino',
      titleKey: 'tools.randomNumber.title',
      descriptionKey: 'tools.randomNumber.description',
      category: 'generators'
    },
    {
      id: 'calculator',
      path: '/calculator',
      icon: 'calculate',
      titleKey: 'tools.calculator.title',
      descriptionKey: 'tools.calculator.description',
      category: 'calculators'
    },
    {
      id: 'time-calculator',
      path: '/time-calculator',
      icon: 'schedule',
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
                placeholder={t('common.search')}
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
                  <span className="material-symbols-outlined tool-icon">{tool.icon}</span>
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
