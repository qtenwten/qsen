// Генератор случайных чисел

export function generateRandomNumbers(min, max, count, unique = false) {
  const minNum = parseInt(min)
  const maxNum = parseInt(max)
  const countNum = parseInt(count)

  if (isNaN(minNum) || isNaN(maxNum) || isNaN(countNum)) {
    return { error: 'INVALID_PARAMS' }
  }

  if (minNum >= maxNum) {
    return { error: 'MIN_NOT_LESS_THAN_MAX' }
  }

  if (countNum < 1 || countNum > 10000) {
    return { error: 'COUNT_OUT_OF_RANGE' }
  }

  if (unique && countNum > (maxNum - minNum + 1)) {
    return { error: 'UNIQUE_COUNT_EXCEEDS_RANGE' }
  }

  const numbers = []

  if (unique) {
    const available = []
    for (let i = minNum; i <= maxNum; i++) {
      available.push(i)
    }

    for (let i = 0; i < countNum; i++) {
      const randomIndex = Math.floor(Math.random() * available.length)
      numbers.push(available[randomIndex])
      available.splice(randomIndex, 1)
    }
  } else {
    for (let i = 0; i < countNum; i++) {
      const randomNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum
      numbers.push(randomNum)
    }
  }

  return { numbers }
}
