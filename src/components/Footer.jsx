import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-feedback">
          <p className="feedback-text">💡 Есть идеи или предложения?</p>
          <Link to="/feedback" className="feedback-button">Написать нам</Link>
        </div>
        <p className="footer-copyright">&copy; {new Date().getFullYear()} Utility Tools. Все права защищены.</p>
      </div>
    </footer>
  )
}

export default Footer
