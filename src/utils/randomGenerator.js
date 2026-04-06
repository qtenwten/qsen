// Генератор случайных чисел

export function generateRandomNumbers(min, max, count, unique = false) {
  const minNum = parseInt(min);
  const maxNum = parseInt(max);
  const countNum = parseInt(count);

  if (isNaN(minNum) || isNaN(maxNum) || isNaN(countNum)) {
    return { error: 'Некорректные параметры' };
  }

  if (minNum >= maxNum) {
    return { error: 'Минимум должен быть меньше максимума' };
  }

  if (countNum < 1 || countNum > 10000) {
    return { error: 'Количество должно быть от 1 до 10000' };
  }

  if (unique && countNum > (maxNum - minNum + 1)) {
    return { error: 'Невозможно сгенерировать столько уникальных чисел в заданном диапазоне' };
  }

  const numbers = [];

  if (unique) {
    const available = [];
    for (let i = minNum; i <= maxNum; i++) {
      available.push(i);
    }

    for (let i = 0; i < countNum; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      numbers.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }
  } else {
    for (let i = 0; i < countNum; i++) {
      const randomNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
      numbers.push(randomNum);
    }
  }

  return { numbers };
}
