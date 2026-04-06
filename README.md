# 🛠️ Utility Tools Site

Полноценный сайт с набором полезных онлайн инструментов для повседневных задач.

## 🎯 Возможности

- **Число прописью** - конвертация числа в текст (рубли, евро, доллары)
- **НДС калькулятор** - добавить, убрать или рассчитать НДС
- **Генератор случайных чисел** - генерация чисел в диапазоне
- **Калькулятор** - базовые операции, проценты, история
- **Калькулятор времени** - сложение, вычитание, разница времени

## 🚀 Технологии

- React 18
- React Router 6
- Vite
- React Helmet Async (SEO)

## 📦 Установка

```bash
npm install
```

## 🔧 Запуск локально

```bash
npm run dev
```

Сайт откроется на http://localhost:3001

## 🏗️ Сборка для продакшена

```bash
npm run build
```

## 🌐 Деплой на Vercel

### Способ 1: Через Vercel CLI

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Войдите в аккаунт:
```bash
vercel login
```

3. Задеплойте проект:
```bash
vercel
```

4. Для продакшен деплоя:
```bash
vercel --prod
```

### Способ 2: Через GitHub

1. Загрузите проект на GitHub
2. Зайдите на [vercel.com](https://vercel.com)
3. Нажмите "New Project"
4. Импортируйте ваш GitHub репозиторий
5. Vercel автоматически определит настройки (Vite)
6. Нажмите "Deploy"

### Настройки для Vercel

Создайте файл `vercel.json` в корне проекта (опционально):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

Это обеспечит правильную работу React Router на Vercel.

## 📁 Структура проекта

```
utility-tools-site/
├── src/
│   ├── components/       # Переиспользуемые компоненты
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── SEO.jsx
│   │   └── CopyButton.jsx
│   ├── pages/           # Страницы инструментов
│   │   ├── Home.jsx
│   │   ├── NumberToWords.jsx
│   │   ├── VATCalculator.jsx
│   │   ├── RandomNumber.jsx
│   │   ├── Calculator.jsx
│   │   └── TimeCalculator.jsx
│   ├── utils/           # Утилиты и логика
│   │   ├── numberToWords.js
│   │   ├── vatCalculator.js
│   │   ├── randomGenerator.js
│   │   ├── calculator.js
│   │   └── timeCalculator.js
│   ├── styles/          # Стили
│   │   └── index.css
│   ├── App.jsx          # Главный компонент с роутингом
│   └── main.jsx         # Точка входа
├── index.html
├── package.json
└── vite.config.js
```

## ✨ Особенности

### SEO оптимизация
- Уникальные title и description для каждой страницы
- Canonical URLs
- Open Graph meta tags
- Семантическая разметка

### UX
- Автосохранение в localStorage
- Автофокус на input полях
- Кнопка "Копировать" для всех результатов
- Валидация ввода
- Обработка ошибок
- Адаптивный дизайн

### Производительность
- Vite для быстрой сборки
- Минимальный bundle size
- Нет внешних зависимостей (кроме React)
- Все вычисления на клиенте

## 🎨 Кастомизация

### Изменение цветов

Отредактируйте CSS переменные в `src/styles/index.css`:

```css
:root {
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --bg: #ffffff;
  --text: #111827;
  /* ... */
}
```

### Добавление нового инструмента

1. Создайте утилиту в `src/utils/`
2. Создайте страницу в `src/pages/`
3. Добавьте роут в `src/App.jsx`
4. Добавьте карточку в `src/pages/Home.jsx`

## 📝 Лицензия

MIT

## 🤝 Контрибьюция

Pull requests приветствуются!

---

**Версия:** 1.0.0  
**Дата:** 2026
