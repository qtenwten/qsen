import { useLanguage } from '../contexts/LanguageContext'
import './LanguageSwitcher.css'

function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()

  return (
    <div className="language-switcher">
      <button
        onClick={() => changeLanguage('ru')}
        className={`lang-btn ${language === 'ru' ? 'active' : ''}`}
        aria-label="Русский"
      >
        RU
      </button>
      <span className="lang-separator">|</span>
      <button
        onClick={() => changeLanguage('en')}
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  )
}

export default LanguageSwitcher
