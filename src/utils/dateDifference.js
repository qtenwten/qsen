// Калькулятор разницы между датами

export function calculateDateDifference(startDate, endDate) {
  if (!startDate || !endDate) {
    return null
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  // Проверка валидности дат
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return null
  }

  // Проверка: дата окончания должна быть >= даты начала
  if (end < start) {
    return { error: 'END_BEFORE_START' }
  }

  // Разница в миллисекундах
  const diffMs = end - start

  // Разница в днях
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  // Разница в неделях
  const diffWeeks = Math.floor(diffDays / 7)

  // Разница в месяцах (приблизительно)
  const diffMonths = Math.floor(diffDays / 30.44)

  // Разница в годах
  const diffYears = Math.floor(diffDays / 365.25)

  return {
    days: diffDays,
    weeks: diffWeeks,
    months: diffMonths,
    years: diffYears,
    startDate: start.toLocaleDateString('ru-RU'),
    endDate: end.toLocaleDateString('ru-RU')
  }
}

// Расчёт точной разницы с часами, минутами, секундами
export function calculateTimeDifference(startDateTime, endDateTime) {
  if (!startDateTime || !endDateTime) {
    return null
  }

  const start = new Date(startDateTime)
  const end = new Date(endDateTime)

  // Проверка валидности дат
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return null
  }

  // Проверка: дата окончания должна быть >= даты начала
  if (end < start) {
    return { error: 'END_BEFORE_START' }
  }

  // Разница в миллисекундах
  const diffMs = end - start

  // Разбиваем на компоненты
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: diffMs,
    startDate: start.toLocaleString('ru-RU'),
    endDate: end.toLocaleString('ru-RU')
  }
}

// Обратный отсчёт до события (от текущего момента)
export function calculateCountdown(targetDateTime) {
  if (!targetDateTime) {
    return null
  }

  const target = new Date(targetDateTime)
  const now = new Date()

  // Проверка валидности даты
  if (isNaN(target.getTime())) {
    return null
  }

  // Если событие в прошлом
  if (target < now) {
    return { error: 'EVENT_PASSED' }
  }

  // Разница в миллисекундах
  const diffMs = target - now

  // Разбиваем на компоненты
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: diffMs,
    targetDate: target.toLocaleString('ru-RU')
  }
}

export function formatDateDifference(diff, language = 'ru') {
  if (!diff || diff.error) {
    return null
  }

  const { days, weeks, months, years } = diff

  if (language === 'ru') {
    const parts = []

    if (years > 0) {
      parts.push(`${years} ${pluralize(years, 'год', 'года', 'лет')}`)
    }
    if (months > 0 && years === 0) {
      parts.push(`${months} ${pluralize(months, 'месяц', 'месяца', 'месяцев')}`)
    }
    if (weeks > 0 && months === 0 && years === 0) {
      parts.push(`${weeks} ${pluralize(weeks, 'неделя', 'недели', 'недель')}`)
    }

    parts.push(`${days} ${pluralize(days, 'день', 'дня', 'дней')}`)

    return parts.join(', ')
  } else {
    const parts = []

    if (years > 0) {
      parts.push(`${years} ${years === 1 ? 'year' : 'years'}`)
    }
    if (months > 0 && years === 0) {
      parts.push(`${months} ${months === 1 ? 'month' : 'months'}`)
    }
    if (weeks > 0 && months === 0 && years === 0) {
      parts.push(`${weeks} ${weeks === 1 ? 'week' : 'weeks'}`)
    }

    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`)

    return parts.join(', ')
  }
}

// Форматирование времени с часами/минутами/секундами
export function formatTimeDifference(diff, language = 'ru') {
  if (!diff || diff.error) {
    return null
  }

  const { days, hours, minutes, seconds } = diff

  if (language === 'ru') {
    const parts = []

    if (days > 0) {
      parts.push(`${days} ${pluralize(days, 'день', 'дня', 'дней')}`)
    }
    if (hours > 0) {
      parts.push(`${hours} ${pluralize(hours, 'час', 'часа', 'часов')}`)
    }
    if (minutes > 0) {
      parts.push(`${minutes} ${pluralize(minutes, 'минута', 'минуты', 'минут')}`)
    }
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds} ${pluralize(seconds, 'секунда', 'секунды', 'секунд')}`)
    }

    return parts.join(' ')
  } else {
    const parts = []

    if (days > 0) {
      parts.push(`${days} ${days === 1 ? 'day' : 'days'}`)
    }
    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`)
    }
    if (minutes > 0) {
      parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`)
    }
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`)
    }

    return parts.join(' ')
  }
}

function pluralize(number, one, few, many) {
  const mod10 = number % 10
  const mod100 = number % 100

  if (mod10 === 1 && mod100 !== 11) {
    return one
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return few
  }
  return many
}
