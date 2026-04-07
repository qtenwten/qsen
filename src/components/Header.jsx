import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import './Header.css'

function Header() {
  const { language } = useLanguage()

  return (
    <header className="header">
      <div className="container header-content">
        <Link to={`/${language}`} className="logo">
          <span className="logo-icon">🛠️</span>
          <span className="logo-text">Utility Tools</span>
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  )
}

export default Header
