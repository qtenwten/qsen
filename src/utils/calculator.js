// Калькулятор выражений

export function calculate(expression) {
  if (!expression || typeof expression !== 'string') {
    return { error: 'Некорректное выражение' };
  }

  try {
    const sanitized = expression.replace(/[^0-9+\-*/.()%\sEDed]/g, '').trim();

    if (!sanitized) {
      return { error: 'Некорректное выражение' };
    }

    if (/[^0-9+\-*/.()%\sEDed]/.test(expression)) {
      return { error: 'Ошибка вычисления' };
    }

    const fn = new Function('"use strict"; return (' + sanitized + ')')
    const result = fn()

    if (result === undefined || result === null) {
      return { error: 'Ошибка вычисления' };
    }

    if (!Number.isFinite(result)) {
      if (result === Infinity || result === -Infinity) {
        const divisionByZeroRegex = /\/\s*0+(\.0*)?(?=\D|$)/
        if (divisionByZeroRegex.test(sanitized)) {
          return { error: 'Деление на ноль' };
        }
      }
      return { error: 'Результат вне допустимого диапазона' };
    }

    if (typeof result !== 'number' || Number.isNaN(result)) {
      return { error: 'Ошибка вычисления' };
    }

    return { result: parseFloat(result.toFixed(10)) };
  } catch (error) {
    return { error: 'Ошибка вычисления' };
  }
}

export function calculatePercentage(base, percent) {
  const baseNum = parseFloat(base);
  const percentNum = parseFloat(percent);

  if (isNaN(baseNum) || isNaN(percentNum)) {
    return { error: 'Некорректные числа' };
  }

  const result = (baseNum * percentNum) / 100;
  return { result: parseFloat(result.toFixed(10)) };
}
