const RU = {
  units: ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'],
  teens: ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'],
  tens: ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'],
  hundreds: ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'],
  scales: [
    { value: 1000000000000, one: 'триллион', few: 'триллиона', many: 'триллионов', gender: 'm' },
    { value: 1000000000, one: 'миллиард', few: 'миллиарда', many: 'миллиардов', gender: 'm' },
    { value: 1000000, one: 'миллион', few: 'миллиона', many: 'миллионов', gender: 'm' },
    { value: 1000, one: 'тысяча', few: 'тысячи', many: 'тысяч', gender: 'f' }
  ],
  zero: 'ноль',
  minus: 'минус',
  taxLabels: {
    addVAT: 'НДС',
    removeVAT: 'НДС',
    NDFL: 'НДФЛ',
  },
  pluralize(number, one, few, many) {
    const mod10 = number % 10
    const mod100 = number % 100

    if (mod100 >= 11 && mod100 <= 19) return many
    if (mod10 === 1) return one
    if (mod10 >= 2 && mod10 <= 4) return few
    return many
  },
  convertThreeDigits(num, gender = 'm') {
    if (num === 0) return ''

    const h = Math.floor(num / 100)
    const t = Math.floor((num % 100) / 10)
    const u = num % 10
    const result = []

    if (h > 0) result.push(this.hundreds[h])

    if (t === 1) {
      result.push(this.teens[u])
    } else {
      if (t > 0) result.push(this.tens[t])
      if (u > 0) {
        if (gender === 'f') {
          if (u === 1) result.push('одна')
          else if (u === 2) result.push('две')
          else result.push(this.units[u])
        } else {
          result.push(this.units[u])
        }
      }
    }

    return result.join(' ')
  },
  currencies: {
    RUB: { one: 'рубль', few: 'рубля', many: 'рублей', minor: { one: 'копейка', few: 'копейки', many: 'копеек' } },
    EUR: { one: 'евро', few: 'евро', many: 'евро', minor: { one: 'цент', few: 'цента', many: 'центов' } },
    USD: { one: 'доллар', few: 'доллара', many: 'долларов', minor: { one: 'цент', few: 'цента', many: 'центов' } },
    KZT: { one: 'тенге', few: 'тенге', many: 'тенге', minor: { one: 'тиын', few: 'тиына', many: 'тиынов' } },
    CNY: { one: 'юань', few: 'юаня', many: 'юаней', minor: { one: 'фэнь', few: 'фэня', many: 'фэней' } },
    UAH: { one: 'гривна', few: 'гривны', many: 'гривен', minor: { one: 'копейка', few: 'копейки', many: 'копеек' } },
    BYN: { one: 'белорусский рубль', few: 'белорусских рубля', many: 'белорусских рублей', minor: { one: 'копейка', few: 'копейки', many: 'копеек' } },
    UZS: { one: 'сум', few: 'сума', many: 'сумов', minor: { one: 'тийин', few: 'тийина', many: 'тийинов' } }
  }
}

const EN = {
  units: ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
  teens: ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
  tens: ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
  hundreds: null,
  scales: [
    { value: 1000000000000, one: 'trillion', few: 'trillion', many: 'trillion', gender: 'm' },
    { value: 1000000000, one: 'billion', few: 'billion', many: 'billion', gender: 'm' },
    { value: 1000000, one: 'million', few: 'million', many: 'million', gender: 'm' },
    { value: 1000, one: 'thousand', few: 'thousand', many: 'thousand', gender: 'm' }
  ],
  zero: 'zero',
  minus: 'minus',
  taxLabels: {
    addVAT: 'VAT',
    removeVAT: 'VAT',
    NDFL: 'Income Tax',
  },
  pluralize(number, one, _few, many) {
    return Math.abs(number) === 1 ? one : many
  },
  convertThreeDigits(num) {
    if (num === 0) return ''

    const h = Math.floor(num / 100)
    const rest = num % 100
    const result = []

    if (h > 0) {
      result.push(`${this.units[h]} hundred`)
    }

    if (rest > 0) {
      if (rest < 10) {
        result.push(this.units[rest])
      } else if (rest < 20) {
        result.push(this.teens[rest - 10])
      } else {
        const t = Math.floor(rest / 10)
        const u = rest % 10
        result.push(u > 0 ? `${this.tens[t]}-${this.units[u]}` : this.tens[t])
      }
    }

    return result.join(' ')
  },
  currencies: {
    RUB: { one: 'ruble', few: 'rubles', many: 'rubles', minor: { one: 'kopeck', few: 'kopecks', many: 'kopecks' } },
    EUR: { one: 'euro', few: 'euros', many: 'euros', minor: { one: 'cent', few: 'cents', many: 'cents' } },
    USD: { one: 'dollar', few: 'dollars', many: 'dollars', minor: { one: 'cent', few: 'cents', many: 'cents' } },
    KZT: { one: 'tenge', few: 'tenge', many: 'tenge', minor: { one: 'tiyn', few: 'tiyns', many: 'tiyns' } },
    CNY: { one: 'yuan', few: 'yuan', many: 'yuan', minor: { one: 'fen', few: 'fen', many: 'fen' } },
    UAH: { one: 'hryvnia', few: 'hryvnias', many: 'hryvnias', minor: { one: 'kopeck', few: 'kopecks', many: 'kopecks' } },
    BYN: { one: 'Belarusian ruble', few: 'Belarusian rubles', many: 'Belarusian rubles', minor: { one: 'kopeck', few: 'kopecks', many: 'kopecks' } },
    UZS: { one: 'sum', few: 'sums', many: 'sums', minor: { one: 'tiyin', few: 'tiyins', many: 'tiyins' } }
  }
}

const LOCALES = {
  ru: RU,
  en: EN,
}

function convertNumberToWords(localeConfig, number, currency, withMinor) {
  const isNegative = number < 0
  const absNum = Math.abs(number)
  const integerPart = Math.floor(absNum)
  const minorPart = Math.round((absNum - integerPart) * 100)
  const result = []

  if (isNegative) result.push(localeConfig.minus)

  if (integerPart === 0) {
    result.push(localeConfig.zero)
  } else {
    let remaining = integerPart
    const parts = []

    for (const scale of localeConfig.scales) {
      if (remaining >= scale.value) {
        const scaleNum = Math.floor(remaining / scale.value)
        const scaleWords = localeConfig.convertThreeDigits(scaleNum, scale.gender)
        const scaleName = localeConfig.pluralize(scaleNum, scale.one, scale.few, scale.many)
        parts.push(`${scaleWords} ${scaleName}`)
        remaining %= scale.value
      }
    }

    if (remaining > 0) {
      parts.push(localeConfig.convertThreeDigits(remaining))
    }

    result.push(parts.join(' '))
  }

  const currencyForms = localeConfig.currencies[currency]
  const currencyName = localeConfig.pluralize(integerPart, currencyForms.one, currencyForms.few, currencyForms.many)
  result.push(currencyName)

  if (withMinor && minorPart > 0) {
    const minorWords = localeConfig.convertThreeDigits(minorPart, 'f')
    const minorName = localeConfig.pluralize(minorPart, currencyForms.minor.one, currencyForms.minor.few, currencyForms.minor.many)
    result.push(`${minorWords} ${minorName}`)
  }

  return result.join(' ').replace(/\s+/g, ' ').trim()
}

export function numberToWords(number, currency = 'RUB', withMinor = true, taxMode = 'none', taxRate = 0, language = 'ru') {
  if (isNaN(number) || number === '') return { text: '', details: null }

  const localeConfig = LOCALES[language] || RU
  const currencyConfig = localeConfig.currencies[currency] || localeConfig.currencies.RUB

  let num = parseFloat(number)
  if (num === 0) return { text: `${localeConfig.zero} ${currencyConfig.many}`, details: null }

  let originalAmount = num
  let taxAmount = 0
  let finalAmount = num
  let taxDetails = null
  const taxName = localeConfig.taxLabels[taxMode]

  if (taxMode === 'addVAT') {
    taxAmount = num * (taxRate / 100)
    finalAmount = num + taxAmount
    taxDetails = {
      original: num.toFixed(2),
      tax: taxAmount.toFixed(2),
      final: finalAmount.toFixed(2),
      label: `${taxName} ${taxRate}%`
    }
    num = finalAmount
  } else if (taxMode === 'removeVAT') {
    originalAmount = num / (1 + taxRate / 100)
    taxAmount = num - originalAmount
    finalAmount = originalAmount
    taxDetails = {
      original: originalAmount.toFixed(2),
      tax: taxAmount.toFixed(2),
      final: num.toFixed(2),
      label: `${taxName} ${taxRate}%`
    }
    num = originalAmount
  } else if (taxMode === 'NDFL') {
    taxAmount = num * (taxRate / 100)
    finalAmount = num - taxAmount
    taxDetails = {
      original: num.toFixed(2),
      tax: taxAmount.toFixed(2),
      final: finalAmount.toFixed(2),
      label: `${taxName} ${taxRate}%`
    }
  }

  return {
    text: convertNumberToWords(localeConfig, num, currency, withMinor),
    details: taxDetails
  }
}
