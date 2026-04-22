import './LoadingState.css'

export function LoadingState({
  status = 'idle',
  error = null,
  skeletonCount = 3,
  errorTitle,
  errorDescription,
  onRetry,
  children,
  className = '',
}) {
  if (status === 'loading') {
    return (
      <div className={`loading-state ${className}`}>
        <div className="loading-state__skeletons">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-card__media skeleton-shimmer" />
              <div className="skeleton-card__meta skeleton-shimmer" />
              <div className="skeleton-card__title skeleton-shimmer" />
              <div className="skeleton-card__excerpt skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (status === 'error' && error) {
    return (
      <div className={`loading-state loading-state--error ${className}`}>
        <div className="loading-state__error">
          <span className="loading-state__error-icon">⚠️</span>
          <h2 className="loading-state__error-title">
            {errorTitle || (typeof window !== 'undefined' && window.location.pathname.startsWith('/en')
              ? 'Could not load data'
              : 'Не удалось загрузить данные')}
          </h2>
          {errorDescription && (
            <p className="loading-state__error-description">{errorDescription}</p>
          )}
          {onRetry && (
            <button className="loading-state__retry-btn" onClick={onRetry}>
              {typeof window !== 'undefined' && window.location.pathname.startsWith('/en')
                ? 'Try again'
                : 'Попробовать снова'}
            </button>
          )}
        </div>
      </div>
    )
  }

  return children || null
}

export function LoadingSpinner({ label, size = 'medium' }) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`} role="status">
      <span className="loading-spinner__circle" aria-hidden="true" />
      {label && <span className="loading-spinner__label">{label}</span>}
    </div>
  )
}
