import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import NumberToWords from './pages/NumberToWords'
import VATCalculator from './pages/VATCalculator'
import RandomNumber from './pages/RandomNumber'
import Calculator from './pages/Calculator'
import TimeCalculator from './pages/TimeCalculator'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/number-to-words" element={<NumberToWords />} />
        <Route path="/vat-calculator" element={<VATCalculator />} />
        <Route path="/random-number" element={<RandomNumber />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/time-calculator" element={<TimeCalculator />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
