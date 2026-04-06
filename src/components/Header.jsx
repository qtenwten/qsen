import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <span className="logo-icon">🛠️</span>
          <span className="logo-text">Utility Tools</span>
        </Link>
      </div>
    </header>
  )
}

export default Header
