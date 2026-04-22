import { Component } from 'react'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      resetKey: 0,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    if (typeof window !== 'undefined' && window.__REPORT_ERROR__) {
      window.__REPORT_ERROR__(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.reset()
    window.location.reload()
  }

  handleGoHome = () => {
    this.reset()
    const lang = window.location.pathname.startsWith('/en') ? '/en' : '/ru'
    window.location.href = lang || '/'
  }

  reset = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      resetKey: prev.resetKey + 1,
    }))
  }

  render() {
    if (this.state.hasError) {
      const isEnglish = typeof window !== 'undefined' && window.location.pathname.startsWith('/en')

      return (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '4rem auto',
            minHeight: '50vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h1
            style={{
              fontSize: '1.75rem',
              marginBottom: '1rem',
              color: 'var(--error, #dc2626)',
            }}
          >
            {isEnglish ? 'Something went wrong' : 'Что-то пошло не так'}
          </h1>
          <p
            style={{
              marginBottom: '0.5rem',
              color: 'var(--text-secondary, #6b7280)',
              lineHeight: '1.6',
            }}
          >
            {isEnglish
              ? 'An error occurred while loading the page.'
              : 'Произошла ошибка при загрузке страницы.'}
          </p>
          {this.state.error?.message && (
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-tertiary, #9ca3af)',
                marginBottom: '2rem',
                fontFamily: 'monospace',
              }}
            >
              {this.state.error.message}
            </p>
          )}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={this.handleRetry}
              style={{
                padding: '0.875rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                background: 'var(--primary, #3b82f6)',
                color: 'white',
                transition: 'opacity 0.15s',
              }}
            >
              {isEnglish ? 'Try again' : 'Попробовать снова'}
            </button>
            <button
              onClick={this.handleGoHome}
              style={{
                padding: '0.875rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                border: '2px solid var(--border, #e5e7eb)',
                borderRadius: '8px',
                cursor: 'pointer',
                background: 'transparent',
                color: 'var(--text, #374151)',
                transition: 'background 0.15s',
              }}
            >
              {isEnglish ? 'Go to homepage' : 'На главную'}
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
