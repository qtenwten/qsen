import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Utility Tools. Все права защищены.</p>
      </div>
    </footer>
  )
}

export default Footer
