import { useLanguage } from '../contexts/LanguageContext'
import { useState, useEffect, useRef } from 'react'
import SEO from '../components/SEO'
import CopyButton from '../components/CopyButton'
import RelatedTools from '../components/RelatedTools'
import { safeGetItem, safeSetItem, safeRemoveItem, safeParseJSON } from '../utils/storage'

function MetaTagsGenerator() {
  const { t, language } = useLanguage()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const saveTimeoutRef = useRef(null)

  const copy = language === 'en'
    ? {
        seo: {
          title: 'Meta Tags Generator for SEO - Yandex and Google',
          description: 'Create meta tags and keyword snippets for website promotion in Yandex and Google. Generate Open Graph and Twitter Card tags online.',
          keywords: 'meta tags generator, SEO meta tags, Open Graph generator, Twitter Cards, keywords generator'
        },
        title: 'Meta Tags Generator',
        subtitle: 'Create SEO meta tags for your website',
        titleLabel: 'Page Title',
        titlePlaceholder: 'Best online calculator - Free tools',
        titleHint: (length) => `Recommended: 50-60 characters. Current length: ${length}`,
        descriptionLabel: 'Description',
        descriptionPlaceholder: 'Free online calculators: VAT, number to words, random number generator. Fast calculations without registration.',
        descriptionHint: (length) => `Recommended: 150-160 characters. Current length: ${length}`,
        keywordsLabel: 'Keywords',
        keywordsPlaceholder: 'calculator, VAT, online, free',
        keywordsHint: 'Important for Yandex. Separate with commas.',
        authorLabel: 'Author (optional)',
        authorPlaceholder: 'Author or company name',
        urlLabel: 'Page URL',
        imageLabel: 'Social image URL',
        imageHint: 'Recommended size: 1200x630 pixels',
        previewTitle: 'Search preview',
        generatedTitle: 'Generated meta tags',
        clear: 'Clear',
        infoTitle: 'How to use the meta tags generator',
        infoDescription: 'This tool helps you create SEO meta tags for promotion in Yandex and Google. Fill in the fields and copy the generated code into the <head> section of your website.',
        basicTitle: 'Main meta tags:',
        basicItems: [
          'Title - page title (50-60 characters)',
          'Description - page description (150-160 characters)',
          'Keywords - keyword list (important for Yandex)',
          'Robots - instructions for search crawlers'
        ],
        ogTitle: 'Open Graph tags:',
        ogDescription: 'Open Graph tags define how your page looks when shared on social networks such as VK, Facebook, and Telegram. Be sure to specify an image sized 1200x630 pixels.',
        twitterTitle: 'Twitter Cards:',
        twitterDescription: 'Twitter Cards control how links appear on X/Twitter. This generator creates tags for a large-image card (summary_large_image).',
        tipsTitle: 'Optimization tips:',
        tips: [
          'Use unique title and description tags for each page',
          'Place important keywords near the beginning of the title',
          'Write descriptions that encourage clicks',
          'Fill in keywords if Yandex traffic matters to you',
          'Watch the length because long tags may be truncated'
        ]
      }
    : {
        seo: {
          title: 'Генератор мета-тегов для SEO - Яндекс и Google',
          description: 'Создавайте мета-теги и ключевые слова для продвижения сайта в Яндексе и Google. Генератор Open Graph и Twitter Cards.',
          keywords: 'генератор мета-тегов, мета-теги, SEO теги, Open Graph, Twitter Cards, keywords, description'
        },
        title: 'Генератор мета-тегов',
        subtitle: 'Создайте SEO мета-теги для вашего сайта',
        titleLabel: 'Заголовок страницы (Title)',
        titlePlaceholder: 'Лучший онлайн калькулятор - Бесплатные инструменты',
        titleHint: (length) => `Оптимально: 50-60 символов. Текущая длина: ${length}`,
        descriptionLabel: 'Описание (Description)',
        descriptionPlaceholder: 'Бесплатные онлайн калькуляторы: НДС, сумма прописью, генератор чисел. Быстрые расчеты без регистрации.',
        descriptionHint: (length) => `Оптимально: 150-160 символов. Текущая длина: ${length}`,
        keywordsLabel: 'Ключевые слова (Keywords)',
        keywordsPlaceholder: 'калькулятор, НДС, онлайн, бесплатно',
        keywordsHint: 'Важно для Яндекса. Разделяйте запятыми.',
        authorLabel: 'Автор (необязательно)',
        authorPlaceholder: 'Имя автора или компании',
        urlLabel: 'URL страницы',
        imageLabel: 'URL изображения для соцсетей',
        imageHint: 'Рекомендуемый размер: 1200x630 пикселей',
        previewTitle: 'Превью в поисковой выдаче',
        generatedTitle: 'Сгенерированные мета-теги',
        clear: 'Очистить',
        infoTitle: 'Как использовать генератор мета-тегов',
        infoDescription: 'Генератор мета-тегов помогает создать правильные SEO теги для продвижения сайта в Яндексе и Google. Заполните поля и скопируйте готовый код в секцию <head> вашего сайта.',
        basicTitle: 'Основные мета-теги:',
        basicItems: [
          'Title - заголовок страницы (50-60 символов)',
          'Description - описание страницы (150-160 символов)',
          'Keywords - ключевые слова (важно для Яндекса)',
          'Robots - инструкции для поисковых роботов'
        ],
        ogTitle: 'Open Graph теги:',
        ogDescription: 'Open Graph теги определяют, как ваша страница будет отображаться при публикации в социальных сетях (ВКонтакте, Facebook, Telegram). Обязательно укажите изображение размером 1200x630 пикселей.',
        twitterTitle: 'Twitter Cards:',
        twitterDescription: 'Twitter Cards управляют отображением ссылок в Twitter. Генератор создает теги для карточки с большим изображением (summary_large_image).',
        tipsTitle: 'Советы по оптимизации:',
        tips: [
          'Используйте уникальные title и description для каждой страницы',
          'Включайте ключевые слова в начало заголовка',
          'Пишите описания, которые побуждают к клику',
          'Для Яндекса обязательно заполняйте keywords',
          'Проверяйте длину текста - слишком длинные теги обрезаются'
        ]
      }

  useEffect(() => {
    const saved = safeGetItem('metaTagsGenerator')
    if (saved) {
      const data = safeParseJSON(saved, {})
      setTitle(data.title || '')
      setDescription(data.description || '')
      setKeywords(data.keywords || '')
      setAuthor(data.author || '')
      setUrl(data.url || '')
      setImage(data.image || '')
    }
  }, [])

  useEffect(() => {
    // Debounce localStorage saves to avoid excessive writes
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      safeSetItem('metaTagsGenerator', JSON.stringify({
        title,
        description,
        keywords,
        author,
        url,
        image
      }))
    }, 1000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [title, description, keywords, author, url, image])

  const generateMetaTags = () => {
    const tags = []

    // Basic HTML meta tags
    if (title) {
      tags.push(`<title>${title}</title>`)
    }
    if (description) {
      tags.push(`<meta name="description" content="${description}">`)
    }
    if (keywords) {
      tags.push(`<meta name="keywords" content="${keywords}">`)
    }
    if (author) {
      tags.push(`<meta name="author" content="${author}">`)
    }
    tags.push(`<meta name="robots" content="index, follow">`)
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`)
    tags.push(`<meta charset="UTF-8">`)

    // Open Graph tags
    if (title) {
      tags.push(`<meta property="og:title" content="${title}">`)
    }
    if (description) {
      tags.push(`<meta property="og:description" content="${description}">`)
    }
    if (url) {
      tags.push(`<meta property="og:url" content="${url}">`)
    }
    if (image) {
      tags.push(`<meta property="og:image" content="${image}">`)
    }
    tags.push(`<meta property="og:type" content="website">`)

    // Twitter Card tags
    tags.push(`<meta name="twitter:card" content="summary_large_image">`)
    if (title) {
      tags.push(`<meta name="twitter:title" content="${title}">`)
    }
    if (description) {
      tags.push(`<meta name="twitter:description" content="${description}">`)
    }
    if (image) {
      tags.push(`<meta name="twitter:image" content="${image}">`)
    }

    return tags.join('\n')
  }

  const handleClear = () => {
    setTitle('')
    setDescription('')
    setKeywords('')
    setAuthor('')
    setUrl('')
    setImage('')
    safeRemoveItem('metaTagsGenerator')
  }

  const metaTags = generateMetaTags()

  return (
    <>
      <SEO
        title={copy.seo.title}
        description={copy.seo.description}
        path={`/${language}/meta-tags-generator`}
        keywords={copy.seo.keywords}
      />

      <div className="tool-container">
        <h1>{copy.title}</h1>
        <p>{copy.subtitle}</p>

        <div className="field">
          <label htmlFor="title">{copy.titleLabel}</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={copy.titlePlaceholder}
            autoFocus
          />
          <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
            {copy.titleHint(title.length)}
          </small>
        </div>

        <div className="field">
          <label htmlFor="description">{copy.descriptionLabel}</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={copy.descriptionPlaceholder}
            rows="3"
          />
          <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
            {copy.descriptionHint(description.length)}
          </small>
        </div>

        <div className="field">
          <label htmlFor="keywords">{copy.keywordsLabel}</label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder={copy.keywordsPlaceholder}
          />
          <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
            {copy.keywordsHint}
          </small>
        </div>

        <div className="field">
          <label htmlFor="author">{copy.authorLabel}</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={copy.authorPlaceholder}
          />
        </div>

        <div className="field">
          <label htmlFor="url">{copy.urlLabel}</label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="field">
          <label htmlFor="image">{copy.imageLabel}</label>
          <input
            id="image"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
            {copy.imageHint}
          </small>
        </div>

        {title && description && (
          <>
            <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{copy.previewTitle}</h2>
              <div style={{
                background: 'var(--bg)',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                padding: '1.5rem',
                maxWidth: '600px'
              }}>
                <div style={{ color: '#1a0dab', fontSize: '1.125rem', marginBottom: '0.25rem', fontWeight: '500' }}>
                  {title}
                </div>
                <div style={{ color: '#006621', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {url || 'https://example.com'}
                </div>
                <div style={{ color: '#545454', fontSize: '0.875rem', lineHeight: '1.6' }}>
                  {description}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{copy.generatedTitle}</h2>
              <div style={{
                background: 'var(--bg-secondary)',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                padding: '1.5rem',
                position: 'relative'
              }}>
                <pre style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  color: 'var(--text)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  fontFamily: 'monospace'
                }}>
                  {metaTags}
                </pre>
                <div style={{ marginTop: '1rem' }}>
                  <CopyButton text={metaTags} />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="btn-group" style={{ marginTop: '1.5rem' }}>
          <button onClick={handleClear} className="secondary">
            {copy.clear}
          </button>
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{copy.infoTitle}</h2>
          <p style={{ marginBottom: '1rem', color: 'var(--text)' }}>
            {copy.infoDescription}
          </p>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{copy.basicTitle}</h3>
          <ul style={{ marginLeft: '1.5rem', color: 'var(--text)', lineHeight: '1.8' }}>
            {copy.basicItems.map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{copy.ogTitle}</h3>
          <p style={{ color: 'var(--text)', lineHeight: '1.8' }}>
            {copy.ogDescription}
          </p>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{copy.twitterTitle}</h3>
          <p style={{ color: 'var(--text)', lineHeight: '1.8' }}>
            {copy.twitterDescription}
          </p>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>{copy.tipsTitle}</h3>
          <ul style={{ marginLeft: '1.5rem', color: 'var(--text)', lineHeight: '1.8' }}>
            {copy.tips.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <RelatedTools currentPath={`/${language}/meta-tags-generator`} />
      </div>
    </>
  )
}

export default MetaTagsGenerator
