import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import './RelatedTools.css'

function RelatedTools({ currentPath }) {
  const { t, language } = useLanguage()
  const location = useLocation()

  // Убираем языковой префикс из currentPath
  const cleanCurrentPath = currentPath?.replace(/^\/(ru|en)/, '') || location.pathname.replace(/^\/(ru|en)/, '')

  const tools = [
    {
      path: '/number-to-words',
      icon: '🔢',
      titleKey: 'tools.numberToWords.title',
      descriptionKey: 'tools.numberToWords.description'
    },
    {
      path: '/vat-calculator',
      icon: '💰',
      titleKey: 'tools.vatCalculator.title',
      descriptionKey: 'tools.vatCalculator.description'
    },
    {
      path: '/compound-interest',
      icon: '📈',
      titleKey: 'tools.compoundInterest.title',
      descriptionKey: 'tools.compoundInterest.description'
    },
    {
      path: '/seo-audit-pro',
      icon: '🚀',
      titleKey: 'tools.seoAuditPro.title',
      descriptionKey: 'tools.seoAuditPro.description'
    },
    {
      path: '/qr-code-generator',
      icon: '📱',
      titleKey: 'tools.qrCodeGenerator.title',
      descriptionKey: 'tools.qrCodeGenerator.description'
    },
    {
      path: '/url-shortener',
      icon: '🔗',
      titleKey: 'tools.urlShortener.title',
      descriptionKey: 'tools.urlShortener.description'
    },
    {
      path: '/password-generator',
      icon: '🔐',
      titleKey: 'tools.passwordGenerator.title',
      descriptionKey: 'tools.passwordGenerator.description'
    },
    {
      path: '/meta-tags-generator',
      icon: '🏷️',
      titleKey: 'tools.metaTagsGenerator.title',
      descriptionKey: 'tools.metaTagsGenerator.description'
    },
    {
      path: '/random-number',
      icon: '🎲',
      titleKey: 'tools.randomNumber.title',
      descriptionKey: 'tools.randomNumber.description'
    },
    {
      path: '/calculator',
      icon: '🧮',
      titleKey: 'tools.calculator.title',
      descriptionKey: 'tools.calculator.description'
    },
    {
      path: '/time-calculator',
      icon: '⏰',
      titleKey: 'tools.timeCalculator.title',
      descriptionKey: 'tools.timeCalculator.description'
    }
  ]

  const otherTools = tools.filter(tool => tool.path !== cleanCurrentPath)

  return (
    <div className="related-tools">
      <h2>{t('home.relatedTools')}</h2>
      <div className="tools-grid">
        {otherTools.map(tool => (
          <Link key={tool.path} to={`/${language}${tool.path}`} className="tool-card">
            <div className="tool-icon">{tool.icon}</div>
            <h3>{t(tool.titleKey)}</h3>
            <p>{t(tool.descriptionKey)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RelatedTools