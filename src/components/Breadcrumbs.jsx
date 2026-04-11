import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'
import './Breadcrumbs.css'

function Breadcrumbs() {
  const location = useLocation()
  const { t, language } = useLanguage()
  const pathname = location.pathname

  // Убираем языковой префикс из pathname
  const cleanPath = pathname.replace(/^\/(ru|en)/, '') || '/'

  // Не показываем на главной
  if (cleanPath === '/') return null

  // Маппинг путей на ключи переводов
  const routeConfig = {
    '/number-to-words': {
      nameKey: 'tools.numberToWords.title',
      category: 'categories.converters',
      categorySlug: 'converters'
    },
    '/vat-calculator': {
      nameKey: 'tools.vatCalculator.title',
      category: 'categories.calculators',
      categorySlug: 'calculators'
    },
    '/calculator': {
      nameKey: 'tools.calculator.title',
      category: 'categories.calculators',
      categorySlug: 'calculators'
    },
    '/date-difference': {
      nameKey: 'tools.dateDifference.title',
      category: 'categories.calculators',
      categorySlug: 'calculators'
    },
    '/compound-interest': {
      nameKey: 'tools.compoundInterest.title',
      category: 'categories.calculators',
      categorySlug: 'calculators'
    },
    '/seo-audit': {
      nameKey: 'tools.seoAudit.title',
      category: 'categories.tools',
      categorySlug: 'tools'
    },
    '/seo-audit-pro': {
      nameKey: 'tools.seoAuditPro.title',
      category: 'categories.tools',
      categorySlug: 'tools'
    },
    '/meta-tags-generator': {
      nameKey: 'tools.metaTagsGenerator.title',
      category: 'categories.tools',
      categorySlug: 'tools'
    },
    '/random-number': {
      nameKey: 'tools.randomNumber.title',
      category: 'categories.generators',
      categorySlug: 'generators'
    },
    '/qr-code-generator': {
      nameKey: 'tools.qrCodeGenerator.title',
      category: 'categories.generators',
      categorySlug: 'generators'
    },
    '/url-shortener': {
      nameKey: 'tools.urlShortener.title',
      category: 'categories.generators',
      categorySlug: 'generators'
    },
    '/password-generator': {
      nameKey: 'tools.passwordGenerator.title',
      category: 'categories.generators',
      categorySlug: 'generators'
    },
    '/feedback': {
      nameKey: 'footer.writeUs',
      category: 'categories.tools',
      categorySlug: 'tools'
    }
  }

  const config = routeConfig[cleanPath]

  // Всегда рендерим контейнер для резервирования места
  if (!config) {
    return <nav className="breadcrumbs" aria-label={t('breadcrumbs.navigation')}></nav>
  }

  const breadcrumbs = [
    { name: t('breadcrumbs.home'), url: `https://qsen.ru/${language}`, path: `/${language}` },
    { name: t(config.category), url: `https://qsen.ru/${language}?category=${config.categorySlug}`, path: `/${language}?category=${config.categorySlug}` },
    { name: t(config.nameKey), url: `https://qsen.ru${pathname}`, path: null }
  ]

  // JSON-LD структурированные данные для SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.name,
      'item': crumb.url || undefined
    }))
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <nav className="breadcrumbs" aria-label={t('breadcrumbs.navigation')}>
        <ol className="breadcrumbs-list">
          <li className="breadcrumbs-item">
            <Link to={`/${language}`} className="breadcrumbs-link">{t('breadcrumbs.home')}</Link>
          </li>
          <li className="breadcrumbs-separator" aria-hidden="true">→</li>
          <li className="breadcrumbs-item">
            <Link to={`/${language}?category=${config.categorySlug}`} className="breadcrumbs-link">{t(config.category)}</Link>
          </li>
          <li className="breadcrumbs-separator" aria-hidden="true">→</li>
          <li className="breadcrumbs-item">
            <span className="breadcrumbs-current" aria-current="page">{t(config.nameKey)}</span>
          </li>
        </ol>
      </nav>
    </>
  )
}

export default Breadcrumbs
