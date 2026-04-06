// Калькулятор времени

function parseTime(timeStr) {
  const parts = timeStr.split(':').map(p => parseInt(p.trim()));

  if (parts.length === 2) {
    const [hours, minutes] = parts;
    if (isNaN(hours) || isNaN(minutes)) return null;
    return { hours, minutes, seconds: 0 };
  } else if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
    return { hours, minutes, seconds };
  }

  return null;
}

function formatTime(hours, minutes, seconds = 0) {
  const h = Math.floor(hours);
  const m = Math.floor(minutes);
  const s = Math.floor(seconds);

  if (s > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${h}:${m.toString().padStart(2, '0')}`;
}

export function addTime(time1, time2) {
  const t1 = parseTime(time1);
  const t2 = parseTime(time2);

  if (!t1 || !t2) {
    return { error: 'Некорректный формат времени (используйте ЧЧ:ММ или ЧЧ:ММ:СС)' };
  }

  let totalSeconds = (t1.hours * 3600 + t1.minutes * 60 + t1.seconds) +
                     (t2.hours * 3600 + t2.minutes * 60 + t2.seconds);

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { result: formatTime(hours, minutes, seconds) };
}

export function subtractTime(time1, time2) {
  const t1 = parseTime(time1);
  const t2 = parseTime(time2);

  if (!t1 || !t2) {
    return { error: 'Некорректный формат времени (используйте ЧЧ:ММ или ЧЧ:МM:СС)' };
  }

  let totalSeconds = (t1.hours * 3600 + t1.minutes * 60 + t1.seconds) -
                     (t2.hours * 3600 + t2.minutes * 60 + t2.seconds);

  if (totalSeconds < 0) {
    return { error: 'Результат отрицательный' };
  }

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { result: formatTime(hours, minutes, seconds) };
}

export function timeUntil(targetTime) {
  const target = parseTime(targetTime);

  if (!target) {
    return { error: 'Некорректный формат времени (используйте ЧЧ:ММ)' };
  }

  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();

  let targetSeconds = target.hours * 3600 + target.minutes * 60;
  let currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

  // Если целевое время уже прошло сегодня, считаем до завтра
  if (targetSeconds <= currentTotalSeconds) {
    targetSeconds += 24 * 3600;
  }

  let diffSeconds = targetSeconds - currentTotalSeconds;

  const hours = Math.floor(diffSeconds / 3600);
  diffSeconds %= 3600;
  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;

  return { result: formatTime(hours, minutes, seconds) };
}
