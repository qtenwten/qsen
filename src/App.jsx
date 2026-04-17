import { Suspense, useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Breadcrumbs from './components/Breadcrumbs'
import ErrorBoundary from './components/ErrorBoundary'
import RouteSkeleton from './components/RouteSkeleton'
import PageTransition from './components/PageTransition'
import { useLanguage } from './contexts/LanguageContext'
import './components/ToolPageShell.css'
import './pages/RandomNumber.css'
import { LEGACY_ROUTE_REDIRECTS, ROUTE_REGISTRY } from './config/routeRegistry'
import {
  Home,
  NumberToWords,
  VATCalculator,
  RandomNumber,
  Calculator,
  DateDifferenceCalculator,
  CompoundInterest,
  SEOAudit,
  MetaTagsGenerator,
  SEOAuditPro,
  QRCodeGenerator,
  URLShortener,
  Feedback,
  PasswordGenerator,
  ArticlesIndex,
  ArticlePage,
  NotFound,
  SearchResults,
  preloadLikelyRoutes,
} from './routes/lazyPages'

function normalizeLocalePath(pathname) {
  const normalizedPath = pathname.replace(/^\/(ru|en)(?=\/|$)/, '')
  return normalizedPath || '/'
}

function clampScrollPosition(scrollY) {
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  return Math.min(Math.max(scrollY, 0), maxScroll)
}

function ScrollManager() {
  const location = useLocation()
  const logicalPath = normalizeLocalePath(location.pathname)
  const previousLogicalPathRef = useRef(logicalPath)
  const previousPathnameRef = useRef(location.pathname)

  useEffect(() => {
    const isLocaleSwitch = location.state?.localeSwitch === true && previousLogicalPathRef.current === logicalPath
    const isHashNavigation = Boolean(location.hash)
    const isQueryOnlyChange = previousPathnameRef.current === location.pathname && previousLogicalPathRef.current === logicalPath
    let frameId = 0
    let cancelled = false

    const restoreLocaleScroll = (targetScrollY, attempt = 0) => {
      if (cancelled) return

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)

      if (maxScroll >= targetScrollY || attempt >= 12) {
        window.scrollTo(0, clampScrollPosition(targetScrollY))
        return
      }

      frameId = window.requestAnimationFrame(() => {
        restoreLocaleScroll(targetScrollY, attempt + 1)
      })
    }

    if (isLocaleSwitch) {
      const savedScrollY = typeof location.state?.scrollY === 'number' ? location.state.scrollY : window.scrollY

      restoreLocaleScroll(savedScrollY)
    } else if (isQueryOnlyChange) {
      // Keep scroll position stable for same-page query param updates (e.g. tool options in URL).
    } else if (!isHashNavigation) {
      window.scrollTo(0, 0)
    }

    previousLogicalPathRef.current = logicalPath
    previousPathnameRef.current = location.pathname

    return () => {
      cancelled = true

      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [location.key, location.hash, location.state, logicalPath])

  return null
}

function App() {
  const { language } = useLanguage()
  const [homeSearch, setHomeSearch] = useState('')
  const location = useLocation()
  const pageTransitionKey = normalizeLocalePath(location.pathname)
  const previousFocusLogicalPathRef = useRef(pageTransitionKey)
  const mainRef = useRef(null)
  const hasMountedRef = useRef(false)

  // DIAG: Log suspicious DOM values after first render
  useEffect(() => {
    const before = window.__QSEN_BEFORE_HYDRATION__ || {}
    const headerSearch = document.getElementById('header-search')
    const logoImg = document.querySelector('.logo-image')
    const themeSwitcher = document.querySelector('.theme-switcher')
    const langSwitcher = document.querySelector('.language-switcher')
    const bodyTheme = document.body?.getAttribute('data-theme')
    const htmlTheme = document.documentElement?.getAttribute('data-theme')
    const footerEl = document.querySelector('.footer')
    const skipLink = document.querySelector('.skip-link')
    const headerEl = document.querySelector('.header')
    const heroH1 = document.querySelector('.home-hero h1')
    const heroP = document.querySelector('.home-hero > p')

    const langSwitcherBefore = before.langSwitcherOuterHTML || null
    const langSwitcherAfter = langSwitcher?.outerHTML || null
    const langSwitcherEqual = langSwitcherBefore === langSwitcherAfter
    let langSwitcherDiff = null
    if (!langSwitcherEqual && langSwitcherBefore && langSwitcherAfter) {
      const minLen = Math.min(langSwitcherBefore.length, langSwitcherAfter.length)
      let diffIndex = 0
      while (diffIndex < minLen && langSwitcherBefore[diffIndex] === langSwitcherAfter[diffIndex]) diffIndex++
      langSwitcherDiff = {
        beforeLen: langSwitcherBefore.length,
        afterLen: langSwitcherAfter.length,
        firstDiffAt: diffIndex,
        beforeSnippet: langSwitcherBefore.slice(Math.max(0, diffIndex - 30), diffIndex + 60),
        afterSnippet: langSwitcherAfter.slice(Math.max(0, diffIndex - 30), diffIndex + 60),
      }
    }

    const footerBefore = before.footerOuterHTML || null
    const footerAfter = footerEl?.outerHTML || null
    const footerEqual = footerBefore === footerAfter
    let footerDiff = null
    if (!footerEqual && footerBefore && footerAfter) {
      const minLen = Math.min(footerBefore.length, footerAfter.length)
      let diffIndex = 0
      while (diffIndex < minLen && footerBefore[diffIndex] === footerAfter[diffIndex]) diffIndex++
      footerDiff = {
        beforeLen: footerBefore.length,
        afterLen: footerAfter.length,
        firstDiffAt: diffIndex,
        beforeSnippet: footerBefore.slice(Math.max(0, diffIndex - 30), diffIndex + 60),
        afterSnippet: footerAfter.slice(Math.max(0, diffIndex - 30), diffIndex + 60),
      }
    }

    const heroH1Before = before.heroH1Text || null
    const heroH1After = heroH1?.textContent || null
    const heroH1Equal = heroH1Before === heroH1After
    let heroH1Diff = null
    if (!heroH1Equal && heroH1Before && heroH1After) {
      const minLen = Math.min(heroH1Before.length, heroH1After.length)
      let diffIndex = 0
      while (diffIndex < minLen && heroH1Before[diffIndex] === heroH1After[diffIndex]) diffIndex++
      heroH1Diff = {
        beforeLen: heroH1Before.length,
        afterLen: heroH1After.length,
        firstDiffAt: diffIndex,
        beforeSnippet: heroH1Before.slice(Math.max(0, diffIndex - 30), diffIndex + 60),
        afterSnippet: heroH1After.slice(Math.max(0, diffIndex - 30), diffIndex + 60),
      }
    }

    const heroPBefore = before.heroPText || null
    const heroPAfter = heroP?.textContent || null
    const heroPEqual = heroPBefore === heroPAfter
    let heroPDiff = null
    if (!heroPEqual && heroPBefore && heroPAfter) {
      const minLen = Math.min(heroPBefore.length, heroPAfter.length)
      let diffIndex = 0
      while (diffIndex < minLen && heroPBefore[diffIndex] === heroPAfter[diffIndex]) diffIndex++
      heroPDiff = {
        beforeLen: heroPBefore.length,
        afterLen: heroPAfter.length,
        firstDiffAt: diffIndex,
        beforeSnippet: heroPBefore.slice(Math.max(0, diffIndex - 30), diffIndex + 60),
        afterSnippet: heroPAfter.slice(Math.max(0, diffIndex - 30), diffIndex + 60),
      }
    }

    console.log('🔍 [SHELL DIAG] After first render:', {
      'header-search value': headerSearch?.value,
      'header-search defaultValue': headerSearch?.defaultValue,
      'logo src': logoImg?.src,
      'body[data-theme]': bodyTheme,
      'html[data-theme]': htmlTheme,
      'theme-switcher outerHTML (full)': themeSwitcher?.outerHTML,
      'lang-switcher outerHTML (full)': langSwitcher?.outerHTML,
      'footer outerHTML (full)': footerEl?.outerHTML,
      'hero h1 text (full)': heroH1?.textContent,
      'hero p text (full)': heroP?.textContent,
      'footer exists': !!footerEl,
      'footer class': footerEl?.className,
      'skip-link text': skipLink?.textContent,
      'skip-link class': skipLink?.className,
      'header class': headerEl?.className,
    })

    console.log('🔍 [SHELL DIAG] === BEFORE/AFTER EQUALITY ===')
    console.log(`lang-switcher outerHTML equal: ${langSwitcherEqual}`)
    if (langSwitcherDiff) console.log('lang-switcher diff:', langSwitcherDiff)
    console.log(`footer outerHTML equal: ${footerEqual}`)
    if (footerDiff) console.log('footer diff:', footerDiff)
    console.log(`hero h1 textContent equal: ${heroH1Equal}`)
    if (heroH1Diff) console.log('hero h1 diff:', heroH1Diff)
    console.log(`hero p textContent equal: ${heroPEqual}`)
    if (heroPDiff) console.log('hero p diff:', heroPDiff)
  }, [])

  useEffect(() => {
    const preload = () => preloadLikelyRoutes()

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preload, { timeout: 1200 })
      return () => window.cancelIdleCallback(idleId)
    }

    const timeoutId = window.setTimeout(preload, 500)
    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    const isLocaleSwitch = location.state?.localeSwitch === true && previousFocusLogicalPathRef.current === pageTransitionKey

    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      previousFocusLogicalPathRef.current = pageTransitionKey
      return
    }

    if (!mainRef.current) return

    previousFocusLogicalPathRef.current = pageTransitionKey

    if (isLocaleSwitch) {
      return
    }

    window.requestAnimationFrame(() => {
      mainRef.current?.focus({ preventScroll: true })
    })
  }, [location.pathname, location.state, pageTransitionKey])

  const componentMap = {
    Home,
    NumberToWords,
    VATCalculator,
    RandomNumber,
    Calculator,
    DateDifferenceCalculator,
    CompoundInterest,
    SEOAudit,
    MetaTagsGenerator,
    SEOAuditPro,
    QRCodeGenerator,
    URLShortener,
    Feedback,
    PasswordGenerator,
    ArticlesIndex,
    SearchResults,
  }

  return (
    <ErrorBoundary>
      <a href="#main-content" className="skip-link">
        {language === 'en' ? 'Skip to content' : 'Перейти к содержимому'}
      </a>
      <Header searchValue={homeSearch} onSearchChange={setHomeSearch} />
      <ScrollManager />
      <main id="main-content" ref={mainRef} className="app-main" tabIndex="-1">
        <div className="container">
          <Breadcrumbs />
        </div>
        <Suspense fallback={<RouteSkeleton />}>
          <PageTransition key={pageTransitionKey}>
            <Routes location={location}>
              {/* Корень остаётся dev/runtime fallback, production redirect генерируется статически */}
              <Route path="/" element={<Home searchValue={homeSearch} onSearchChange={setHomeSearch} />} />

              {/* Home */}
              <Route path="/ru" element={<Home searchValue={homeSearch} onSearchChange={setHomeSearch} />} />
              <Route path="/ru/" element={<Home searchValue={homeSearch} onSearchChange={setHomeSearch} />} />
              <Route path="/en" element={<Home searchValue={homeSearch} onSearchChange={setHomeSearch} />} />
              <Route path="/en/" element={<Home searchValue={homeSearch} onSearchChange={setHomeSearch} />} />

              {ROUTE_REGISTRY.map((route) => {
                const Component = componentMap[route.componentKey]
                return (
                  <Route key={`ru-${route.path}`} path={`/ru${route.path}`} element={<Component />} />
                )
              })}

              {ROUTE_REGISTRY.map((route) => {
                const Component = componentMap[route.componentKey]
                return (
                  <Route key={`en-${route.path}`} path={`/en${route.path}`} element={<Component />} />
                )
              })}

              <Route path="/ru/articles/:slug" element={<ArticlePage />} />
              <Route path="/en/articles/:slug" element={<ArticlePage />} />

              {/* Редиректы со старых URL без языка на /ru */}
              {Object.entries(LEGACY_ROUTE_REDIRECTS).map(([fromPath, toPath]) => (
                <Route key={fromPath} path={fromPath} element={<Navigate to={toPath} replace />} />
              ))}

              <Route path="/articles/:slug" element={<LegacyArticleRedirect />} />

              <Route path="/ru/*" element={<NotFound />} />
              <Route path="/en/*" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </Suspense>
      </main>
      <Footer />
    </ErrorBoundary>
  )
}

function LegacyArticleRedirect() {
  const { slug = '' } = useParams()
  return <Navigate to={`/ru/articles/${slug}`} replace />
}

export default App
