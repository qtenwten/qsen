import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../dist')

// Page metadata for all 26 routes (13 pages × 2 languages)
const pages = {
  // Home pages
  '/ru': {
    title: 'QSEN.RU - Онлайн калькуляторы и SEO инструменты',
    description: 'Бесплатные онлайн калькуляторы, SEO инструменты и утилиты для бизнеса. Калькулятор НДС, число прописью, генератор QR-кодов и другие полезные инструменты.',
    h1: 'Полезные онлайн инструменты',
    keywords: 'калькулятор онлайн, НДС калькулятор, число прописью, SEO аудит, генератор мета-тегов'
  },
  '/en': {
    title: 'QSEN.RU - Online Calculators and SEO Tools',
    description: 'Free online calculators, SEO tools and business utilities. VAT calculator, number to words, QR code generator and other useful tools.',
    h1: 'Useful Online Tools',
    keywords: 'online calculator, VAT calculator, number to words, SEO audit, meta tags generator'
  },

  // Number to Words
  '/ru/number-to-words': {
    title: 'Число прописью онлайн - Сумма прописью с НДС',
    description: 'Конвертер числа в текст прописью. Сумма прописью с НДС для договоров и документов. Поддержка рублей, долларов, евро.',
    h1: 'Число прописью онлайн',
    keywords: 'число прописью, сумма прописью, число прописью с НДС, конвертер числа в текст'
  },
  '/en/number-to-words': {
    title: 'Number to Words Online - Amount in Words with VAT',
    description: 'Convert numbers to words. Amount in words with VAT for contracts and documents. Support for rubles, dollars, euros.',
    h1: 'Number to Words Online',
    keywords: 'number to words, amount in words, number converter, text converter'
  },

  // VAT Calculator
  '/ru/vat-calculator': {
    title: 'НДС калькулятор онлайн - Выделить и начислить НДС',
    description: 'Калькулятор НДС онлайн. Выделить НДС из суммы, начислить НДС, рассчитать сумму НДС. Ставки 20%, 10%, 0%.',
    h1: 'НДС калькулятор онлайн',
    keywords: 'НДС калькулятор, выделить НДС, начислить НДС, калькулятор НДС онлайн'
  },
  '/en/vat-calculator': {
    title: 'VAT Calculator Online - Add and Remove VAT',
    description: 'Online VAT calculator. Remove VAT from amount, add VAT, calculate VAT amount. Rates 20%, 10%, 0%.',
    h1: 'VAT Calculator Online',
    keywords: 'VAT calculator, remove VAT, add VAT, online VAT calculator'
  },

  // Random Number
  '/ru/random-number': {
    title: 'Генератор случайных чисел от 1 до 100 - Рандомайзер онлайн',
    description: 'Генератор случайных чисел от 1 до 100, от 1 до 1000. Уникальные числа без повторений. Рандомайзер для лотереи и розыгрышей.',
    h1: 'Генератор случайных чисел',
    keywords: 'генератор случайных чисел, рандомайзер, случайное число, random number generator'
  },
  '/en/random-number': {
    title: 'Random Number Generator 1 to 100 - Online Randomizer',
    description: 'Random number generator from 1 to 100, 1 to 1000. Unique numbers without repetition. Randomizer for lottery and giveaways.',
    h1: 'Random Number Generator',
    keywords: 'random number generator, randomizer, random number, number generator'
  },

  // Calculator
  '/ru/calculator': {
    title: 'Graph Calculator - Инженерный калькулятор с графиками функций',
    description: 'Современный онлайн калькулятор с построением графиков. Инженерные функции: sin, cos, tan, log, sqrt. Построение графиков функций в реальном времени.',
    h1: 'Графический калькулятор',
    keywords: 'калькулятор онлайн, инженерный калькулятор, график функции онлайн, построить график'
  },
  '/en/calculator': {
    title: 'Graph Calculator - Engineering Calculator with Function Graphs',
    description: 'Modern online calculator with graphing. Engineering functions: sin, cos, tan, log, sqrt. Real-time function graphing.',
    h1: 'Graph Calculator',
    keywords: 'online calculator, engineering calculator, function graph, graph calculator'
  },

  // Date Difference Calculator
  '/ru/date-difference': {
    title: 'Калькулятор даты и времени онлайн - Разница дат и обратный отсчет',
    description: 'Калькулятор разницы между датами и временем онлайн. Считайте дни, время между событиями и запускайте обратный отсчет.',
    h1: 'Калькулятор даты и времени',
    keywords: 'разница дат, калькулятор даты, разница времени, обратный отсчет онлайн'
  },
  '/en/date-difference': {
    title: 'Date and Time Calculator Online - Date Difference and Countdown',
    description: 'Online date and time difference calculator. Measure days, compare date times and run a live countdown.',
    h1: 'Date and Time Calculator',
    keywords: 'date difference calculator, time difference, countdown timer, date calculator'
  },

  // Compound Interest
  '/ru/compound-interest': {
    title: 'Калькулятор сложных процентов - Расчет доходности инвестиций',
    description: 'Калькулятор сложных процентов с капитализацией. Расчет доходности инвестиций, вкладов, депозитов. График роста капитала.',
    h1: 'Калькулятор сложных процентов',
    keywords: 'сложные проценты, калькулятор инвестиций, доходность вклада, капитализация процентов'
  },
  '/en/compound-interest': {
    title: 'Compound Interest Calculator - Investment Return Calculator',
    description: 'Compound interest calculator with capitalization. Calculate investment returns, deposits. Capital growth chart.',
    h1: 'Compound Interest Calculator',
    keywords: 'compound interest, investment calculator, deposit return, interest capitalization'
  },

  // SEO Audit
  '/ru/seo-audit': {
    title: 'SEO аудит сайта онлайн бесплатно - Проверка SEO',
    description: 'Бесплатный SEO аудит сайта онлайн. Проверка мета-тегов, заголовков, скорости загрузки. Анализ SEO оптимизации.',
    h1: 'SEO аудит сайта',
    keywords: 'SEO аудит, проверка SEO, анализ сайта, SEO оптимизация'
  },
  '/en/seo-audit': {
    title: 'Free Online SEO Audit - Website SEO Check',
    description: 'Free online SEO audit. Check meta tags, headings, loading speed. SEO optimization analysis.',
    h1: 'SEO Audit',
    keywords: 'SEO audit, SEO check, website analysis, SEO optimization'
  },

  // Meta Tags Generator
  '/ru/meta-tags-generator': {
    title: 'Генератор мета-тегов - Создать meta tags для сайта',
    description: 'Генератор мета-тегов для сайта. Создать title, description, keywords, Open Graph, Twitter Card. Оптимизация для SEO.',
    h1: 'Генератор мета-тегов',
    keywords: 'генератор мета-тегов, meta tags, Open Graph, Twitter Card, SEO теги'
  },
  '/en/meta-tags-generator': {
    title: 'Meta Tags Generator - Create Meta Tags for Website',
    description: 'Meta tags generator for website. Create title, description, keywords, Open Graph, Twitter Card. SEO optimization.',
    h1: 'Meta Tags Generator',
    keywords: 'meta tags generator, meta tags, Open Graph, Twitter Card, SEO tags'
  },

  // SEO Audit Pro
  '/ru/seo-audit-pro': {
    title: 'SEO Аудит PRO - Профессиональный анализ сайта',
    description: 'Профессиональный SEO аудит сайта. Глубокий анализ технического SEO, контента, юзабилити. Детальный отчет с рекомендациями.',
    h1: 'SEO Аудит PRO',
    keywords: 'SEO аудит PRO, профессиональный SEO анализ, технический SEO, SEO отчет'
  },
  '/en/seo-audit-pro': {
    title: 'SEO Audit PRO - Professional Website Analysis',
    description: 'Professional SEO website audit. Deep analysis of technical SEO, content, usability. Detailed report with recommendations.',
    h1: 'SEO Audit PRO',
    keywords: 'SEO audit PRO, professional SEO analysis, technical SEO, SEO report'
  },

  // QR Code Generator
  '/ru/qr-code-generator': {
    title: 'Генератор QR-кодов онлайн бесплатно - Создать QR код',
    description: 'Бесплатный генератор QR-кодов онлайн. Создайте QR-код для ссылки, текста, email, телефона, WiFi. Настройка цвета и стиля.',
    h1: 'Генератор QR-кодов',
    keywords: 'генератор qr кода, создать qr код онлайн, qr code generator, генератор qr кодов'
  },
  '/en/qr-code-generator': {
    title: 'Free Online QR Code Generator - Create QR Code',
    description: 'Free online QR code generator. Create QR code for link, text, email, phone, WiFi. Customize color and style.',
    h1: 'QR Code Generator',
    keywords: 'qr code generator, create qr code online, qr generator, free qr code'
  },

  // URL Shortener
  '/ru/url-shortener': {
    title: 'Сокращатель ссылок онлайн - Короткие ссылки бесплатно',
    description: 'Бесплатный сокращатель ссылок онлайн. Создайте короткую ссылку за секунду. Сокращение URL без регистрации.',
    h1: 'Сокращатель ссылок',
    keywords: 'сокращатель ссылок, короткие ссылки, сократить ссылку, url shortener'
  },
  '/en/url-shortener': {
    title: 'URL Shortener Online - Free Short Links',
    description: 'Free online URL shortener. Create short link in seconds. Shorten URL without registration.',
    h1: 'URL Shortener',
    keywords: 'url shortener, short links, shorten url, link shortener'
  },

  // Feedback
  '/ru/feedback': {
    title: 'Обратная связь - Связаться с нами',
    description: 'Свяжитесь с нами. Отправьте ваши предложения, вопросы или сообщения об ошибках. Мы ответим в ближайшее время.',
    h1: 'Обратная связь',
    keywords: 'обратная связь, связаться с нами, контакты, написать нам'
  },
  '/en/feedback': {
    title: 'Feedback - Contact Us',
    description: 'Contact us. Send your suggestions, questions or bug reports. We will respond as soon as possible.',
    h1: 'Feedback',
    keywords: 'feedback, contact us, contacts, write to us'
  },

  // Password Generator
  '/ru/password-generator': {
    title: 'Генератор паролей онлайн - Создать надежный пароль',
    description: 'Генератор надежных паролей онлайн. Создайте сложный пароль с цифрами, буквами и символами. Настройка длины и сложности.',
    h1: 'Генератор паролей',
    keywords: 'генератор паролей, создать пароль, надежный пароль, password generator'
  },
  '/en/password-generator': {
    title: 'Password Generator Online - Create Strong Password',
    description: 'Strong password generator online. Create complex password with numbers, letters and symbols. Customize length and complexity.',
    h1: 'Password Generator',
    keywords: 'password generator, create password, strong password, secure password'
  }
}

function generatePage(route, metadata) {
  try {
    const templatePath = path.join(distPath, 'index.html')

    if (!fs.existsSync(templatePath)) {
      console.error(`❌ Template not found: ${templatePath}`)
      console.error('   Run "npm run build" first to generate dist/index.html')
      return
    }

    const template = fs.readFileSync(templatePath, 'utf-8')

    // Inject meta tags and basic content
    let html = template
      // Update title
      .replace(/<title>.*?<\/title>/, `<title>${metadata.title}</title>`)
      // Update description
      .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${metadata.description}"`)
      // Update keywords
      .replace(/<meta name="keywords" content=".*?"/, `<meta name="keywords" content="${metadata.keywords}"`)
      // Inject basic content into root div for SEO
      .replace(
        /<div id="root"><\/div>/,
        `<div id="root"><div style="display:none"><h1>${metadata.h1}</h1><p>${metadata.description}</p></div></div>`
      )

    // Determine output path
    const routePath = route === '/ru' || route === '/en'
      ? path.join(distPath, route, 'index.html')
      : path.join(distPath, route, 'index.html')

    // Create directory if needed
    fs.mkdirSync(path.dirname(routePath), { recursive: true })

    // Write file
    fs.writeFileSync(routePath, html, 'utf-8')

    console.log(`✓ Generated: ${route}`)
  } catch (error) {
    console.error(`❌ Error generating ${route}:`, error.message)
  }
}

function main() {
  console.log('🚀 Starting pre-render generation...\n')

  // Check if dist exists
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist/ folder not found!')
    console.error('   Run "npm run build" first\n')
    process.exit(1)
  }

  // Generate all pages
  let successCount = 0
  Object.entries(pages).forEach(([route, metadata]) => {
    generatePage(route, metadata)
    successCount++
  })

  console.log(`\n✅ Successfully generated ${successCount}/${Object.keys(pages).length} pages`)
  console.log('📁 Output: dist/ folder with pre-rendered HTML\n')
}

main()
