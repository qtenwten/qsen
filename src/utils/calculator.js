// Калькулятор выражений

export function calculate(expression) {
  try {
    // Безопасная оценка математического выражения
    const sanitized = expression.replace(/[^0-9+\-*/.()%\s]/g, '');

    if (!sanitized) {
      return { error: 'Некорректное выражение' };
    }

    // Проверка на деление на ноль
    if (/\/\s*0(?!\d)/.test(sanitized)) {
      return { error: 'Деление на ноль' };
    }

    // Используем Function вместо eval для безопасности
    const result = Function('"use strict"; return (' + sanitized + ')')();

    if (!isFinite(result)) {
      return { error: 'Результат вне допустимого диапазона' };
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
