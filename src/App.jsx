import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'

const NumberToWords = lazy(() => import('./pages/NumberToWords'))
const VATCalculator = lazy(() => import('./pages/VATCalculator'))
const RandomNumber = lazy(() => import('./pages/RandomNumber'))
const Calculator = lazy(() => import('./pages/Calculator'))
const TimeCalculator = lazy(() => import('./pages/TimeCalculator'))

function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Загрузка...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/number-to-words" element={<NumberToWords />} />
          <Route path="/vat-calculator" element={<VATCalculator />} />
          <Route path="/random-number" element={<RandomNumber />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/time-calculator" element={<TimeCalculator />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  )
}

export default App
