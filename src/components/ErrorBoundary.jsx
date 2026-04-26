import { Component } from 'react'

function isChunkError(error) {
  const message = error?.message || ''
  const patterns = [
    /Failed to fetch dynamically imported module/i,
    /error loading dynamically imported module/i,
    /Importing a module script failed/i,
    /ChunkLoadError/i,
    /Loading chunk \d+ failed/i,
    /cannot be loaded in a prior warning/i,
  ]
  return patterns.some((p) => p.test(message))
}

async function clearAllCaches() {
  if ('caches' in window) {
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
  }
}

async function unregisterServiceWorkers() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map((reg) => reg.unregister()))
  }
}

async function performRecovery(reloadKey) {
  await clearAllCaches()
  await unregisterServiceWorkers()

  if (!sessionStorage.getItem(reloadKey)) {
    sessionStorage.setItem(reloadKey, '1')
    window.location.reload()
  }
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, isRecovering: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleRecovery = async () => {
    const reloadKey = 'qsen:chunk-recovery-reloaded'
    this.setState({ isRecovering: true })
    await performRecovery(reloadKey)
  }

  handleManualReload = () => {
    const reloadKey = 'qsen:chunk-recovery-reloaded'
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, '1')
      window.location.reload()
    } else {
      sessionStorage.removeItem(reloadKey)
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      const isEnglish = this.props.language === 'en'
      const isEnglishFallback = typeof window !== 'undefined' && window.location.pathname.startsWith('/en')
      const useEnglish = isEnglish !== undefined ? isEnglish : isEnglishFallback

      const isChunk = isChunkError(this.state.error)

      if (isChunk && !this.state.isRecovering) {
        const reloadKey = 'qsen:chunk-recovery-reloaded'
        const hasReloaded = sessionStorage.getItem(reloadKey)

        return (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '4rem auto'
          }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text)' }}>
              {useEnglish ? 'Updating site files' : 'Обновляем файлы сайта'}
            </h1>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              {useEnglish
                ? 'A new version of the site has been installed. Updating cached files...'
                : 'Установлена новая версия сайта. Обновляем кэшированные файлы...'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleRecovery}
                style={{
                  padding: '0.875rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: 'var(--primary)',
                  color: 'white'
                }}
              >
                {useEnglish ? 'Update now' : 'Обновить'}
              </button>
              {hasReloaded && (
                <button
                  onClick={() => {
                    sessionStorage.removeItem(reloadKey)
                    window.location.reload()
                  }}
                  style={{
                    padding: '0.875rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    border: '2px solid var(--border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text)'
                  }}
                >
                  {useEnglish ? 'Force reload' : 'Перезагрузить'}
                </button>
              )}
            </div>
          </div>
        )
      }

      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '4rem auto'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--error)' }}>
            {useEnglish ? 'Something went wrong' : 'Что-то пошло не так'}
          </h1>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            {useEnglish
              ? 'An error occurred while loading the page. Try refreshing it or go back to the homepage.'
              : 'Произошла ошибка при загрузке страницы. Попробуйте обновить страницу или вернуться на главную.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={this.handleManualReload}
              style={{
                padding: '0.875rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                background: 'var(--primary)',
                color: 'white'
              }}
            >
              {useEnglish ? 'Refresh page' : 'Обновить страницу'}
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '0.875rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
                background: 'var(--bg-secondary)',
                color: 'var(--text)'
              }}
            >
              {useEnglish ? 'Home' : 'На главную'}
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary