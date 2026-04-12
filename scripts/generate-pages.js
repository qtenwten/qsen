import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../dist')

// Page metadata for all 26 routes (13 pages × 2 languages)
const pages = {
  // Home pages
  '/ru': {
    title: 'Онлайн калькуляторы и генераторы — НДС, QR, SEO | QSEN.RU',
    description: 'Бесплатные онлайн-инструменты: калькулятор НДС, сумма прописью, QR-коды, случайные числа, графический калькулятор, сокращатель ссылок и SEO-аудит сайта.',
    h1: 'Онлайн калькуляторы, генераторы и SEO-инструменты',
    keywords: 'онлайн калькуляторы, генераторы онлайн, калькулятор НДС, сумма прописью онлайн, генератор qr кода, seo аудит сайта'
  },
  '/en': {
    title: 'Free Online Calculators, Generators, and SEO Tools',
    description: 'Free online tools for VAT, QR codes, passwords, short links, random numbers, date calculations, and quick SEO checks.',
    h1: 'Free Online Calculators, Generators, and SEO Tools',
    keywords: 'free online tools, online calculators, qr code generator, vat calculator, password generator, seo audit tool'
  },

  // Number to Words
  '/ru/number-to-words': {
    title: 'Сумма прописью онлайн — число прописью для счетов и договоров',
    description: 'Сумма прописью онлайн в рублях, долларах, евро и других валютах. Перевод числа в текст для счетов, договоров, актов и документов, с НДС и без НДС.',
    h1: 'Сумма прописью онлайн',
    keywords: 'сумма прописью онлайн, число прописью, перевести сумму прописью, сумма прописью для договора, число прописью для счета'
  },
  '/en/number-to-words': {
    title: 'Number to Words Converter Online | Amount in Words',
    description: 'Convert numbers into words instantly for invoices, contracts, checks, and payment documents. Supports currencies, decimals, and tax-inclusive amounts.',
    h1: 'Number to Words Converter Online',
    keywords: 'number to words converter, amount in words, number to words online, number to text converter, amount in words generator'
  },

  // VAT Calculator
  '/ru/vat-calculator': {
    title: 'Калькулятор НДС онлайн — выделить и начислить НДС 22%, 20%, 10%',
    description: 'Калькулятор НДС онлайн для счетов, накладных и договоров. Помогает выделить НДС из суммы, начислить НДС сверху и быстро рассчитать налог по ставкам 5%, 10%, 18%, 19%, 20% и 22%.',
    h1: 'Калькулятор НДС онлайн',
    keywords: 'калькулятор ндс онлайн, выделить ндс из суммы, начислить ндс, расчет ндс 20 процентов, калькулятор ндс 22 процента'
  },
  '/en/vat-calculator': {
    title: 'VAT Calculator Online | Add, Remove, and Extract VAT',
    description: 'Use this free VAT calculator online to add VAT, remove VAT from a gross amount, or calculate tax instantly for invoices, quotes, and bookkeeping.',
    h1: 'Free VAT Calculator Online',
    keywords: 'vat calculator online, add vat, remove vat, extract vat, calculate vat, vat calculator free'
  },

  // Random Number
  '/ru/random-number': {
    title: 'Генератор случайных чисел онлайн — рандомайзер от 1 до 100',
    description: 'Генератор случайных чисел онлайн для розыгрышей, выборки, лотерей и игр. Задайте диапазон, количество чисел и режим без повторений.',
    h1: 'Генератор случайных чисел онлайн',
    keywords: 'генератор случайных чисел онлайн, рандомайзер, генератор чисел без повторений, случайное число от 1 до 100, генератор для розыгрыша'
  },
  '/en/random-number': {
    title: 'Random Number Generator Online | Free Number Picker',
    description: 'Generate random numbers online with custom ranges and optional no-repeat mode. Great for raffles, giveaways, games, and sampling.',
    h1: 'Free Random Number Generator',
    keywords: 'random number generator online, free number picker, randomizer, random number tool, no repeat number generator'
  },

  // Calculator
  '/ru/calculator': {
    title: 'Графический калькулятор онлайн — графики функций и формулы',
    description: 'Графический калькулятор онлайн для вычислений, функций и построения графиков. Поддерживает тригонометрию, логарифмы, степени, корни и историю расчетов.',
    h1: 'Графический калькулятор онлайн',
    keywords: 'графический калькулятор, графический калькулятор онлайн, калькулятор с графиком функции, инженерный калькулятор онлайн, построить график функции'
  },
  '/en/calculator': {
    title: 'Free Graphing Calculator Online | Plot Functions Fast',
    description: 'Use a graphing calculator online for formulas, functions, trigonometry, and quick plots. Solve expressions and visualize functions in real time.',
    h1: 'Free Graphing Calculator Online',
    keywords: 'free graphing calculator, graph calculator online, function grapher, scientific calculator online, plot functions'
  },

  // Date Difference Calculator
  '/ru/date-difference': {
    title: 'Калькулятор дней между датами онлайн — разница дат и отсчёт',
    description: 'Рассчитайте количество дней между датами, разницу по времени и обратный отсчет до события. Онлайн-калькулятор дат подходит для отпусков, дедлайнов и планирования.',
    h1: 'Калькулятор дней между датами',
    keywords: 'калькулятор дней между датами, сколько дней между датами, калькулятор дней онлайн, разница между датами, обратный отсчет до даты'
  },
  '/en/date-difference': {
    title: 'Date Difference Calculator | Days Between Dates Online',
    description: 'Calculate days between dates, compare date and time values, or run a live countdown. Great for planning, deadlines, and event timing.',
    h1: 'Date Difference Calculator',
    keywords: 'date difference calculator, days between dates online, date calculator, countdown calculator, date and time calculator'
  },

  // Compound Interest
  '/ru/compound-interest': {
    title: 'Калькулятор сложных процентов онлайн — с капитализацией и пополнением',
    description: 'Калькулятор сложных процентов для вклада, инвестиций и накоплений. Покажет итоговую сумму, доход, пополнения и график роста капитала.',
    h1: 'Калькулятор сложных процентов онлайн',
    keywords: 'калькулятор сложных процентов, сложные проценты онлайн, калькулятор сложных процентов с капитализацией, доходность вклада, рост капитала'
  },
  '/en/compound-interest': {
    title: 'Compound Interest Calculator | Investment Growth Tool',
    description: 'Estimate savings and investment growth with compounding and recurring contributions. See final value, total deposits, and earned interest.',
    h1: 'Compound Interest Calculator',
    keywords: 'compound interest calculator, investment growth calculator, savings calculator, compound interest tool, interest calculator online'
  },

  // SEO Audit
  '/ru/seo-audit': {
    title: 'Экспресс SEO-аудит страницы онлайн — проверить title, description и H1',
    description: 'Быстрая SEO-проверка страницы онлайн: title, description, H1-H3, alt и Open Graph. Экспресс-аудит базовых ошибок без установки сервисов.',
    h1: 'Экспресс SEO-аудит страницы',
    keywords: 'seo аудит онлайн, экспресс seo аудит, проверка meta тегов, проверка h1 страницы, аудит страницы онлайн'
  },
  '/en/seo-audit': {
    title: 'Free SEO Audit Tool | Check Titles, Headings, and Tags',
    description: 'Run a quick SEO audit online to check titles, meta descriptions, headings, image alt text, and Open Graph markup.',
    h1: 'Free SEO Audit Tool',
    keywords: 'free seo audit tool, seo audit online, meta tag checker, heading checker, on-page seo audit'
  },

  // Meta Tags Generator
  '/ru/meta-tags-generator': {
    title: 'Генератор мета-тегов для сайта — title, description, Open Graph',
    description: 'Генератор мета-тегов для сайта: title, description, keywords, Open Graph и Twitter Card. Помогает быстро подготовить SEO-теги для Яндекса и Google.',
    h1: 'Генератор мета-тегов онлайн',
    keywords: 'генератор мета тегов, генератор мета тегов для сайта, title description keywords, open graph генератор, meta description'
  },
  '/en/meta-tags-generator': {
    title: 'Meta Tags Generator | Create SEO Meta Tags Online',
    description: 'Create title tags, meta descriptions, Open Graph tags, and Twitter cards for any page. Fast, simple, and ready to copy into your site.',
    h1: 'Meta Tags Generator',
    keywords: 'meta tags generator, seo meta tags, title tag generator, meta description generator, open graph generator'
  },

  // SEO Audit Pro
  '/ru/seo-audit-pro': {
    title: 'SEO-аудит сайта онлайн — подробная проверка SEO страницы',
    description: 'Подробный SEO-аудит сайта онлайн: проверка title, description, H1-H3, alt, robots, Open Graph, keywords и структуры страницы. Подходит для технического анализа и быстрой проверки.',
    h1: 'SEO-аудит сайта PRO',
    keywords: 'seo аудит сайта, seo аудит сайта онлайн, проверка seo сайта, аудит сайта онлайн, анализ страницы'
  },
  '/en/seo-audit-pro': {
    title: 'SEO Audit Tool Online | Full On-Page SEO Checker',
    description: 'Run a full on-page SEO audit for any URL. Check titles, meta descriptions, headings, Open Graph tags, images, and page structure.',
    h1: 'SEO Audit Tool Online',
    keywords: 'seo audit tool, on-page seo checker, website seo audit, seo checker online, technical seo audit'
  },

  // QR Code Generator
  '/ru/qr-code-generator': {
    title: 'Генератор QR-кода онлайн — создать QR-код бесплатно',
    description: 'Создайте QR-код онлайн бесплатно для ссылки, Wi‑Fi, телефона, email, SMS или текста. Настройте размер и цвета, скачайте готовый QR-код в PNG.',
    h1: 'Генератор QR-кода онлайн',
    keywords: 'генератор qr кодов онлайн, создать qr код бесплатно, qr код для wifi, qr код для ссылки, генератор qr кода на русском'
  },
  '/en/qr-code-generator': {
    title: 'Free QR Code Generator Online | Create QR Codes Fast',
    description: 'Create QR codes online for links, Wi-Fi, email, phone numbers, and text. Download high-quality PNG QR codes with no registration.',
    h1: 'Free QR Code Generator',
    keywords: 'free qr code generator, qr code generator online, create qr code, qr code maker, qr code for wifi'
  },

  // URL Shortener
  '/ru/url-shortener': {
    title: 'Сократить ссылку онлайн — бесплатный сокращатель URL',
    description: 'Сократите длинную ссылку онлайн и получите короткий URL за несколько секунд. Удобно для соцсетей, мессенджеров, email-рассылок, рекламы и печатных материалов.',
    h1: 'Сокращатель ссылок онлайн',
    keywords: 'сократить ссылку онлайн, сокращатель ссылок, короткая ссылка, сократить url, создать короткую ссылку'
  },
  '/en/url-shortener': {
    title: 'Free URL Shortener Online | Create Short Links Fast',
    description: 'Shorten long URLs online in seconds. Create clean, shareable short links for social media, email, SMS, and printed materials.',
    h1: 'Free URL Shortener',
    keywords: 'free url shortener, shorten url online, short link generator, create short link, link shortener'
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
    title: 'Генератор паролей онлайн — создать надежный пароль бесплатно',
    description: 'Генератор надежных паролей онлайн с настройкой длины и набора символов. Создайте случайный пароль для почты, банков, Wi-Fi и социальных сетей.',
    h1: 'Генератор паролей',
    keywords: 'генератор паролей онлайн, создать надежный пароль, случайный пароль, сложный пароль, генератор пароля бесплатно'
  },
  '/en/password-generator': {
    title: 'Free Password Generator Online | Strong Password Tool',
    description: 'Create strong passwords online in seconds. Customize length, symbols, and exclusions, then copy a secure password with no registration.',
    h1: 'Free Password Generator',
    keywords: 'free password generator, password generator online, strong password generator, secure password tool, create password online'
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

    const pageUrl = `https://qsen.ru${route === '/ru' || route === '/en' ? `${route}/` : route}`
    const locale = route.startsWith('/en') ? 'en_US' : 'ru_RU'
    const image = 'https://qsen.ru/og-image.svg'

    // Inject meta tags and basic content
    let html = template
      // Update title
      .replace(/<title>.*?<\/title>/, `<title>${metadata.title}</title>`)
      // Update description
      .replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${metadata.description}"`)
      // Update keywords
      .replace(/<meta name="keywords" content=".*?"/, `<meta name="keywords" content="${metadata.keywords}"`)
      // Update Open Graph title
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${metadata.title}" />`)
      // Update Open Graph description
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${metadata.description}" />`)
      // Update Open Graph image
      .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${image}" />`)
      // Update Open Graph locale
      .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${locale}" />`)
      // Inject canonical
      .replace(/<meta name="keywords" content=".*?"/, `<meta name="keywords" content="${metadata.keywords}" />\n    <link rel="canonical" href="${pageUrl}"`)
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
