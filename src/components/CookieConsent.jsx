import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import './CookieConsent.css'

const STORAGE_KEY = 'qsen_cookie_consent'

function CookieConsent() {
  const { t, language } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setVisible(true)
      return
    }
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    const isExpired = Date.now() - Number(stored) > thirtyDaysMs
    if (isExpired) {
      localStorage.removeItem(STORAGE_KEY)
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
    setVisible(false)
  }

  if (!visible) {
    return null
  }

  return (
    <div className="cookie-consent" role="dialog" aria-label={t('cookie.title')}>
      <div className="cookie-consent__container">
        <p className="cookie-consent__text">
          {t('cookie.message')}
          <span className="cookie-consent__links">
            <Link to={`/${language}/terms/`} className="cookie-consent__link" target="_blank" rel="noopener">
              {t('cookie.terms')}
            </Link>
            <span className="cookie-consent__separator">·</span>
            <Link to={`/${language}/privacy/`} className="cookie-consent__link" target="_blank" rel="noopener">
              {t('cookie.privacy')}
            </Link>
          </span>
        </p>
        <button className="cookie-consent__button" onClick={handleAccept}>
          {t('cookie.accept')}
        </button>
      </div>
    </div>
  )
}

export default CookieConsent
