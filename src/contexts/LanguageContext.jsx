import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ruTranslations from '../locales/ru.json'
import enTranslations from '../locales/en.json'
import { safeGetItem, safeSetItem } from '../utils/storage'
import { fetchArticleBySlug, readCachedArticlesIndex } from '../lib/articlesApi'

const translations = {
  ru: ruTranslations,
  en: enTranslations
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [language, setLanguage] = useState('ru')

  // Определение языка из URL
  useEffect(() => {
    try {
      const pathLang = location.pathname.split('/')[1]
        if (pathLang === 'ru' || pathLang === 'en') {
          setLanguage(pathLang)
          safeSetItem('language', pathLang)
        } else {
          // Если язык не указан в URL, определяем из localStorage или браузера
          const savedLang = safeGetItem('language')

        if (savedLang && (savedLang === 'ru' || savedLang === 'en')) {
          setLanguage(savedLang)
        } else {
          // Определяем по языку браузера
          const browserLang = navigator.language.toLowerCase()
          const detectedLang = browserLang.startsWith('ru') ? 'ru' : 'en'
          setLanguage(detectedLang)
          safeSetItem('language', detectedLang)
        }
      }
    } catch (error) {
      console.error('Error in language detection:', error)
      // Fallback to Russian
      setLanguage('ru')
    }
  }, [location.pathname])

  // Функция для получения перевода по ключу
  const t = (key) => {
    if (typeof key !== 'string' || key.length === 0) {
      if (import.meta.env.DEV) {
        console.warn('t() called with invalid key:', key)
      }
      return ''
    }

    const keys = key.split('.')
    let value = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key // Возвращаем ключ, если перевод не найден
      }
    }

    return value || key
  }

  // Функция смены языка
  const changeLanguage = (newLang) => {
    try {
      if (newLang !== 'ru' && newLang !== 'en') return

      const currentPath = location.pathname
      const currentLang = currentPath.split('/')[1]

      if (currentLang === newLang) return

      const nextUrlState = {
        localeSwitch: true,
        scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
      }

      const applyLocalePrefix = (pathname) => {
        if (typeof pathname !== 'string' || pathname.length === 0) {
          return `/${newLang}/`
        }

        const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
        if (normalized === '/') {
          return `/${newLang}/`
        }

        if (normalized.startsWith('/ru/') || normalized.startsWith('/en/') || normalized === '/ru' || normalized === '/en') {
          const replaced = normalized.replace(/^\/(ru|en)(?=\/|$)/, `/${newLang}`)
          return replaced === `/${newLang}` ? `/${newLang}/` : replaced
        }

        return `/${newLang}${normalized}`
      }

      const navigateLocalized = (pathname) => {
        navigate(`${pathname}${location.search}${location.hash}`, { state: nextUrlState })
        safeSetItem('language', newLang)
      }

      // Article detail page needs a safer locale switch:
      // after language filtering, the same slug may not exist in the other locale.
      const articleMatch = currentPath.match(/^\/(ru|en)\/articles\/([^/?#]+)/)
      if (articleMatch) {
        const slug = decodeURIComponent(articleMatch[2] || '')
        const cachedDetailRaw = (() => {
          try {
            const raw = window.sessionStorage?.getItem(`qsen:articles:detail:${slug}`)
            if (!raw) return null
            const parsed = JSON.parse(raw)
            return parsed?.value || null
          } catch {
            return null
          }
        })()

        const translationKey = cachedDetailRaw?.translation_key || cachedDetailRaw?.translationKey || ''
        const cachedIndex = readCachedArticlesIndex(newLang)
        const translatedSlug = translationKey
          ? cachedIndex.find((item) => (item?.translationKey || item?.translation_key) === translationKey && item?.slug)?.slug
          : ''

        if (translatedSlug) {
          navigateLocalized(`/${newLang}/articles/${encodeURIComponent(translatedSlug)}`)
          return
        }

        const nextDetailPath = applyLocalePrefix(`/articles/${encodeURIComponent(slug)}`)

        fetchArticleBySlug(slug, newLang)
          .then(() => {
            navigateLocalized(nextDetailPath)
          })
          .catch(() => {
            navigateLocalized(`/${newLang}/articles`)
          })

        return
      }

      // Если текущий путь начинается с языка, заменяем его
      if (currentLang === 'ru' || currentLang === 'en') {
        const newPath = applyLocalePrefix(currentPath)
        navigateLocalized(newPath)
      } else {
        // Если языка нет в пути, добавляем новый язык
        const newPath = applyLocalePrefix(currentPath)
        navigateLocalized(newPath)
      }
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
