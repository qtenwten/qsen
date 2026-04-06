// Утилита для фильтрации ввода только цифр и разделителей

export function filterNumberInput(value) {
  // Разрешаем только цифры, точку, запятую и минус
  return value.replace(/[^\d.,-]/g, '')
}

export function handleNumberKeyDown(e) {
  // Разрешаем: backspace, delete, tab, escape, enter
  if ([8, 9, 27, 13, 46].includes(e.keyCode)) {
    return
  }

  // Разрешаем: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
  if ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88].includes(e.keyCode)) {
    return
  }

  // Разрешаем: Home, End, стрелки
  if (e.keyCode >= 35 && e.keyCode <= 40) {
    return
  }

  // Запрещаем все, кроме цифр, точки, запятой и минуса
  const char = e.key
  if (!/[\d.,-]/.test(char)) {
    e.preventDefault()
  }
}
