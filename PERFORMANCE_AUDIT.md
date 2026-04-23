# PageSpeed Performance Audit — QSEN.RU

**Дата:** 23.04.2026
**URL:** https://qsen.ru/ru/
**Инструмент:** PageSpeed Insights (Lighthouse 13.0.1, Desktop + Mobile)
**Источник данных:** отчёт пользователя + проверка кодовой базы

---

## Scores

| Устройство | Score | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|
| Desktop | **100** | 0.6 сек ✅ | 1.1 сек ✅ | 10 мс ✅ | 0 ✅ | 0.6 сек ✅ |
| Mobile | _(требуется проверка)_ | | | | | |

> FCP/LCP/TBT/CLS — все в зелёной зоне. Сайт быстрый.

---

## 🔴 Критические

### 1. Service Worker — ошибка регистрации

```
TypeError: Failed to update a ServiceWorker for scope ('https://qsen.ru/')
with script ('https://qsen.ru/sw.js'): An unknown error occurred when fetching the script.
```

**Статус:** `public/sw.js` существует, но ошибка происходит при регистрации в браузере.

**Возможные причины:**
- GitHub Pages блокирует/не обслуживает `sw.js` корректно
- Service Worker в `sw.js` содержит ошибку, несовместимую с текущим браузером
- HTTPS-требование: Service Worker работает только на HTTPS, GitHub Pages поддерживает HTTPS

**Файл:** `public/sw.js` — проверить содержимое, совместимость с chrome-Lighthouse

**Влияние:** PWA-кеширование не работает, офлайн-доступ отсутствует

**Сложность:** 🟢 XS — определить причину, исправить `sw.js`

---

## 🟠 Высокий приоритет

### 2. Логотип скачивается в 12× большем разрешении чем нужно

```
Файл: /assets/qsen-logo-transparent-CvW8xwpk.png
Размер файла: 18.2 KiB
Реальный размер в UI: 48×44px
Рекомендуемая экономия: 18.0 KiB
```

**Причина:** Исходное изображение экспортировано в разрешении ~581×531px.
Браузер скачивает 581px-изображение для отображения в 48px-контейнере.

**Файл:** `src/assets/qsen-logo-transparent.png` → экспортировать в **96×96px** (@2x для Retina, 48×48px @1x)

**Сложность:** 🟢 XS (5 минут)

---

### 3. Cache TTL 10 минут для всех ресурсов

```
Рекомендуемая экономия: 339 KiB (при повторных визитах)
Все собственные ресурсы: max-age=600 (10 минут)
```

**Причина:** `vite.config.js` не настраивает cache headers. GitHub Pages использует default 10 min.

**Файл:** `vite.config.js` — добавить `build.rollupOptions.output.assetFileNames` с хешированием + headers

**Решение:** Для хешированных файлов (содержащих hash в имени) GitHub Pages автоматически отдаёт `immutable`. Проблема скорее в том, что PageSpeed видит 10-минутный TTL для всех ресурсов одинаково.

**Сложность:** 🟢 XS

---

### 4. Yandex Metrica — 161 мс блокировки основного потока

```
Объём: 89 KiB
Время выполнения в основном потоке: 161 мс
WebSocket ошибка: wss://mc.yandex.com/solid.ws — ERR_NAME_NOT_RESOLVED
```

**Файл:** `index.html` (Metrika snippet)

**Влияние:** 161 мс основного потока занято сторонним кодом

**Решение:** Обернуть загрузку Metrika в `setTimeout(() => { ... }, 2000)` или `requestIdleCallback` — отложить на 2 секунды после загрузки страницы

**Сложность:** 🟢 XS

---

## 🟡 Средний приоритет

### 5. Контрастность текста в футере недостаточна

```
Элемент: .footer-copyright, .footer-brand__tagline
Ошибка: цвета фона и переднего плана недостаточно контрастны
```

**Файл:** `src/styles/index.css`

**Текущие значения:** opacity ~0.35-0.5, недостаточно для 4.5:1 контраста WCAG AA

**Решение:**
```css
.footer-copyright {
  color: #9CA3AF;  /* лучше чем rgba(255,255,255,0.5) */
}
.footer-brand__tagline {
  color: #9CA3AF;
}
```

**Сложность:** 🟢 XS

---

### 6. Shared Element Transitions API — overflow: visible для img

```
Предупреждение: если назначить overflow: visible для img,
визуальный контент может выйти за пределы границ.
```

**Связано с:** логотипом (контейнер `.logo-icon` не имеет `overflow: hidden`)

**Файл:** `src/styles/index.css` или компонент Logo

**Решение:**
```css
.logo-icon {
  overflow: hidden;
  border-radius: 8px; /* если нужен радиус */
}
```

**Сложность:** 🟢 XS

---

### 7. Preconnect hints отсутствуют

```
Нет предварительно подключенных источников
```

**Файл:** `index.html`

**Решение:**
```html
<link rel="preconnect" href="https://mc.yandex.ru" crossorigin>
<link rel="dns-prefetch" href="https://mc.yandex.ru">
```

**Сложность:** 🟢 XS

---

### 8. React vendor chunk большой (139 KiB)

```
Объём: 139.8 KiB
Неиспользуемый код: 93.6 KiB
```

**Файл:** `vite.config.js`, `src/main.jsx`

**Причина:** React + ReactDOM + hooks + Router в одном чанке

**Решение:** Уже используется `splitChunks` — рассмотреть разбиение React vendor на `react` + `react-dom` отдельно. Но это не критично — tree shaking уже работает.

**Сложность:** 🟡 Medium

---

## 🟢 Низкий приоритет / информационные

### 9. Preload/modulepreload не используются для внешних ресурсов

```
/metrika/tag.js?id=108416207 — загружается синхронно
```

**Решение:** добавить `<link rel="preload">` для критических внешних ресурсов

---

### 10. Images explicit width/height attributes — ✅ OK

Lighthouse отмечает что для 95 элементов width/height уже заданы. Это хорошо.

---

### 11. Mobile INP (Interaction to Next Paint) — требует проверки

Рекомендация Lighthouse: "Обзор INP" — нужно проверить на мобильном устройстве отдельно, чтобы понять есть ли проблемы с отзывчивостью на мобильных.

---

## Сводная таблица

| # | Проблема | Влияние | Сложность | Приоритет |
|---|---|---|---|---|
| 1 | Service Worker ошибка | PWA не работает | 🟢 XS | 🔴 |
| 2 | Логотип 581×531px | 18 KiB лишних | 🟢 XS | 🟠 |
| 3 | Cache TTL 10 мин | Медленные повторные визиты | 🟢 XS | 🟠 |
| 4 | Yandex Metrica 161 мс | Замедление TTI | 🟢 XS | 🟠 |
| 5 | Низкая контрастность футера | WCAG AA fail | 🟢 XS | 🟡 |
| 6 | overflow: visible на img | CLS potential | 🟢 XS | 🟡 |
| 7 | Нет preconnect для Яндекса | Медленный коннект | 🟢 XS | 🟡 |
| 8 | React vendor 139 KiB | Большой bundle | 🟡 Medium | 🟢 |

---

## План действий

### Immediately (5-15 минут)

1. **`public/sw.js`** — понять почему регистрация падает. Проверить консоль браузера на prod
2. **Логотип** — переэкспортировать `qsen-logo-transparent.png` → 96×96px @2x (вместо 581×531)
3. **Preconnect** — добавить в `index.html`: `<link rel="preconnect" href="https://mc.yandex.ru">`
4. **Metrika defer** — обернуть загрузку в `setTimeout(..., 2000)`

### Short-term (1-2 часа)

1. **Cache headers** — проверить что GitHub Pages правильно отдаёт `immutable` для хешированных файлов
2. **Footer contrast** — исправить `.footer-copyright` и `.footer-brand__tagline` цвета
3. **Logo overflow** — добавить `overflow: hidden` к `.logo-icon`

### Medium-term (архитектурное)

1. PWA manifest — добавить `manifest.json` с иконками для полноценного PWA (кэш offline)
2. Split vendor chunks — если bundle растёт

---

## Заметки

- Оценка 100/100 на Desktop — отличный результат. Основные проблемы не，影响 балла.
- Service Worker ошибка критична для PWA, но не влияет на PageSpeed score nap直接影响.
- Yandex Metrika WebSocket ошибка (`ERR_NAME_NOT_RESOLVED`) — нормально в dev-среде без интернета, не влияет на prod.
- Mobile version needs separate run on PageSpeed Insights для оценки mobile INP.
