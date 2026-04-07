import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import './Footer.css'

function Footer() {
  const { t, language } = useLanguage()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-feedback">
          <p className="feedback-text">💡 {t('footer.feedback')}</p>
          <Link to={`/${language}/feedback`} className="feedback-button">{t('footer.writeUs')}</Link>
        </div>
        <p className="footer-copyright">&copy; {new Date().getFullYear()} Utility Tools. {t('footer.copyright')}</p>
      </div>
    </footer>
  )
}

export default Footer
