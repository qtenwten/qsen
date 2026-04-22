/**
 * Безопасный генератор паролей с использованием crypto.getRandomValues
 */

const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

const SIMILAR_CHARS = '0Ool1I'

/**
 * Генерация криптографически безопасного случайного числа
 */
function getSecureRandomInt(max) {
  const randomBuffer = new Uint32Array(1)
  crypto.getRandomValues(randomBuffer)
  return randomBuffer[0] % max
}

/**
 * Перемешивание массива (Fisher-Yates shuffle)
 */
function shuffleArray(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Генерация пароля
 */
export function generatePassword(options) {
  const {
    length = 16,
    lowercase = true,
    uppercase = true,
    numbers = true,
    symbols = false,
    excludeSimilar = false,
    excludeChars = ''
  } = options

  // Собираем набор символов
  let charset = ''
  if (lowercase) charset += CHAR_SETS.lowercase
  if (uppercase) charset += CHAR_SETS.uppercase
  if (numbers) charset += CHAR_SETS.numbers
  if (symbols) charset += CHAR_SETS.symbols

  // Исключаем похожие символы
  if (excludeSimilar) {
    charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('')
  }

  // Исключаем пользовательские символы
  if (excludeChars) {
    charset = charset.split('').filter(char => !excludeChars.includes(char)).join('')
  }

  if (charset.length === 0) {
    return { error: 'NO_CHARSET_SELECTED' }
  }

  if (length < 6 || length > 64) {
    return { error: 'INVALID_LENGTH' }
  }

  // Генерируем пароль
  let password = ''
  const charArray = charset.split('')

  // Гарантируем наличие хотя бы одного символа каждого выбранного типа
  const requiredChars = []
  if (lowercase) requiredChars.push(CHAR_SETS.lowercase[getSecureRandomInt(CHAR_SETS.lowercase.length)])
  if (uppercase) requiredChars.push(CHAR_SETS.uppercase[getSecureRandomInt(CHAR_SETS.uppercase.length)])
  if (numbers) requiredChars.push(CHAR_SETS.numbers[getSecureRandomInt(CHAR_SETS.numbers.length)])
  if (symbols) requiredChars.push(CHAR_SETS.symbols[getSecureRandomInt(CHAR_SETS.symbols.length)])

  // Добавляем обязательные символы
  for (const char of requiredChars) {
    password += char
  }

  // Заполняем оставшуюся длину
  for (let i = password.length; i < length; i++) {
    const randomIndex = getSecureRandomInt(charArray.length)
    password += charArray[randomIndex]
  }

  // Перемешиваем символы
  password = shuffleArray(password.split('')).join('')

  return { password }
}

/**
 * Оценка силы пароля
 */
export function calculatePasswordStrength(password) {
  if (!password) return { score: 0, label: 'Very Weak', color: '#ef4444', reasons: [] }

  let score = 0
  const reasons = []

  // Длина
  if (password.length >= 8) {
    score += 1
    reasons.push({ factor: 'length8', passed: true, key: 'passwordGenerator.strengthFactors.length8' })
  } else {
    reasons.push({ factor: 'length8', passed: false, key: 'passwordGenerator.strengthFactors.length8' })
  }
  if (password.length >= 12) {
    score += 1
    reasons.push({ factor: 'length12', passed: true, key: 'passwordGenerator.strengthFactors.length12' })
  } else {
    reasons.push({ factor: 'length12', passed: false, key: 'passwordGenerator.strengthFactors.length12' })
  }
  if (password.length >= 16) {
    score += 1
    reasons.push({ factor: 'length16', passed: true, key: 'passwordGenerator.strengthFactors.length16' })
  }

  // Разнообразие символов
  if (/[a-z]/.test(password)) {
    score += 1
    reasons.push({ factor: 'lowercase', passed: true, key: 'passwordGenerator.strengthFactors.lowercase' })
  } else {
    reasons.push({ factor: 'lowercase', passed: false, key: 'passwordGenerator.strengthFactors.lowercase' })
  }
  if (/[A-Z]/.test(password)) {
    score += 1
    reasons.push({ factor: 'uppercase', passed: true, key: 'passwordGenerator.strengthFactors.uppercase' })
  } else {
    reasons.push({ factor: 'uppercase', passed: false, key: 'passwordGenerator.strengthFactors.uppercase' })
  }
  if (/[0-9]/.test(password)) {
    score += 1
    reasons.push({ factor: 'numbers', passed: true, key: 'passwordGenerator.strengthFactors.numbers' })
  } else {
    reasons.push({ factor: 'numbers', passed: false, key: 'passwordGenerator.strengthFactors.numbers' })
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1
    reasons.push({ factor: 'symbols', passed: true, key: 'passwordGenerator.strengthFactors.symbols' })
  } else {
    reasons.push({ factor: 'symbols', passed: false, key: 'passwordGenerator.strengthFactors.symbols' })
  }

  // Определяем уровень
  if (score <= 2) return { score: 1, label: 'Weak', color: '#ef4444', reasons }
  if (score <= 4) return { score: 2, label: 'Medium', color: '#f59e0b', reasons }
  if (score <= 6) return { score: 3, label: 'Strong', color: '#10b981', reasons }
  return { score: 4, label: 'Very Strong', color: '#059669', reasons }
}
