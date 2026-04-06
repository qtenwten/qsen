import { Helmet } from 'react-helmet-async'

function SEO({ title, description, path = '' }) {
  const fullTitle = title ? `${title} | Utility Tools` : 'Utility Tools - Полезные онлайн инструменты'
  const fullUrl = `https://utility-tools.vercel.app${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
    </Helmet>
  )
}

export default SEO
