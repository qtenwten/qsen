import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../contexts/LanguageContext'

function SEO({ title, description, path = '', keywords = '', image = 'https://qsen.ru/og-image.svg' }) {
  const { language } = useLanguage()

  const siteName = 'QSEN.RU'
  const defaultTitle = language === 'en'
    ? 'QSEN.RU - Online Calculators and SEO Tools'
    : 'QSEN.RU - Онлайн калькуляторы и SEO инструменты'
  const fullTitle = title || defaultTitle

  // Убираем языковой префикс из path для формирования URL
  const cleanPath = path.replace(/^\/(ru|en)/, '')
  const fullUrl = `https://qsen.ru/${language}${cleanPath}`
  const ruUrl = `https://qsen.ru/ru${cleanPath}`
  const enUrl = `https://qsen.ru/en${cleanPath}`

  const defaultKeywords = language === 'en'
    ? 'online calculator, VAT calculator, number to words, SEO audit, meta tags generator, compound interest'
    : 'калькулятор онлайн, НДС калькулятор, число прописью, SEO аудит, генератор мета-тегов, сложные проценты'
  const fullKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords
  const defaultDescription = language === 'en'
    ? 'Free online calculators, SEO tools, and business utilities.'
    : 'Бесплатные онлайн калькуляторы, SEO инструменты и утилиты для бизнеса'
  const fullDescription = description || defaultDescription

  const locale = language === 'ru' ? 'ru_RU' : 'en_US'

  // JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': siteName,
    'url': 'https://qsen.ru',
    'description': description || defaultDescription,
    'inLanguage': language,
    'publisher': {
      '@type': 'Organization',
      'name': siteName,
      'url': 'https://qsen.ru',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://qsen.ru/icon-512x512.png'
      }
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `https://qsen.ru/${language}/?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <link rel="canonical" href={fullUrl} />
      <html lang={language} />

      {/* Hreflang tags */}
      <link rel="alternate" hreflang="ru" href={ruUrl} />
      <link rel="alternate" hreflang="en" href={enUrl} />
      <link rel="alternate" hreflang="x-default" href={ruUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="yandex" content="index, follow" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  )
}

export default SEO
