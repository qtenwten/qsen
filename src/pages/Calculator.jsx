import { useLanguage } from '../contexts/LanguageContext'
import { lazy, Suspense, useState, useEffect } from 'react'
import SEO from '../components/SEO'
import RelatedTools from '../components/RelatedTools'
import ModeSwitcher from '../components/calculator/ModeSwitcher'
import CalculatorPanel from '../components/calculator/CalculatorPanel'
import HistoryPanel from '../components/calculator/HistoryPanel'
import { safeGetItem, safeSetItem, safeRemoveItem, safeParseJSON } from '../utils/storage'
import '../styles/calculator.css'

const GraphPanel = lazy(() => import('../components/calculator/GraphPanel'))

function Calculator() {
  const { t, language } = useLanguage()
  const [mode, setMode] = useState('calculator')
  const [history, setHistory] = useState([])

  const copy = language === 'en'
    ? {
        seo: {
          title: 'Graph Calculator Online - Engineering Calculator with Function Graphs',
          description: 'Engineering calculator with graph plotting. Solve expressions, use trigonometry, logarithms, powers, and visualize functions in real time.',
          keywords: 'graph calculator, engineering calculator, function grapher, online graphing calculator, scientific calculator'
        },
        graphLoading: 'Loading graph tools...',
        infoTitle: 'Engineering calculator with graphing',
        infoDescription: 'Graph Calculator combines an engineering calculator with a function plotting tool. Perform advanced calculations and visualize mathematical functions in real time.',
        featuresTitle: 'Calculator features:',
        features: [
          'Basic operations: +, -, *, /, and parentheses',
          'Trigonometry: sin, cos, tan',
          'Logarithms: log (base 10), ln (natural log)',
          'Roots and powers: sqrt, ^',
          'Constants: π (pi), e',
          'Factorial: !',
          'Live result preview while typing'
        ],
        graphTitle: 'Graph plotting:',
        graphFeatures: [
          'Plot any function of x: x^2, sin(x), x^3 - 2*x + 1',
          'Adjust the X-axis range',
          'Automatic Y-axis scaling',
          'Smooth real-time updates',
          'Interactive chart with tooltips'
        ],
        modesTitle: 'Modes:',
        modes: [
          'Calculator - calculation mode with function buttons',
          'Graph - function graphing mode',
          'Both - calculator and graph side by side'
        ],
        examplesTitle: 'Examples:',
        calcExample: 'Calculations: sin(pi/2) = 1, sqrt(16) = 4, 2^3 = 8, log(100) = 2',
        graphExample: 'Graphs: enter x^2 for a parabola, sin(x) for a sine wave, or x^3 - 2*x + 1 for a cubic function'
      }
    : {
        seo: {
          title: 'Graph Calculator - Инженерный калькулятор с графиками функций',
          description: 'Современный онлайн калькулятор с построением графиков. Инженерные функции: sin, cos, tan, log, sqrt. Построение графиков функций в реальном времени.',
          keywords: 'калькулятор онлайн, инженерный калькулятор, график функции онлайн, построить график, калькулятор с графиками'
        },
        graphLoading: 'Загрузка графических инструментов...',
        infoTitle: 'Инженерный калькулятор с графиками',
        infoDescription: 'Graph Calculator - современный онлайн калькулятор, объединяющий функции инженерного калькулятора и построителя графиков функций. Выполняйте сложные вычисления и визуализируйте математические функции в реальном времени.',
        featuresTitle: 'Возможности калькулятора:',
        features: [
          'Базовые операции: +, -, *, /, скобки',
          'Тригонометрия: sin, cos, tan',
          'Логарифмы: log (десятичный), ln (натуральный)',
          'Корни и степени: sqrt, ^',
          'Константы: π (pi), e',
          'Факториал: !',
          'Live preview результата при вводе'
        ],
        graphTitle: 'Построение графиков:',
        graphFeatures: [
          'График любой функции от x: x^2, sin(x), x^3 - 2*x + 1',
          'Настройка диапазона по оси X',
          'Автоматическое масштабирование по Y',
          'Плавное обновление в реальном времени',
          'Интерактивный график с подсказками'
        ],
        modesTitle: 'Режимы работы:',
        modes: [
          'Калькулятор - режим вычислений с кнопками функций',
          'График - режим построения графиков функций',
          'Оба - одновременная работа с калькулятором и графиком'
        ],
        examplesTitle: 'Примеры использования:',
        calcExample: 'Вычисления: sin(pi/2) = 1, sqrt(16) = 4, 2^3 = 8, log(100) = 2',
        graphExample: 'Графики: введите x^2 для параболы, sin(x) для синусоиды, x^3 - 2*x + 1 для кубической функции'
      }

  useEffect(() => {
    const savedHistory = safeGetItem('calculator-history')
    if (savedHistory) {
      setHistory(safeParseJSON(savedHistory, []))
    }
  }, [])

  const handleHistoryAdd = (item) => {
    const newHistory = [item, ...history.slice(0, 19)]
    setHistory(newHistory)
    safeSetItem('calculator-history', JSON.stringify(newHistory))
  }

  const handleHistoryRestore = (item) => {
    console.log('Restore:', item)
  }

  const handleHistoryClear = () => {
    setHistory([])
    safeRemoveItem('calculator-history')
  }

  return (
    <>
      <SEO
        title={copy.seo.title}
        description={copy.seo.description}
        path={`/${language}/calculator`}
        keywords={copy.seo.keywords}
      />

      <div className="calculator-container">
        <div className="calc-header">
          <h1>{t('calculator.title')}</h1>
          <p>{t('calculator.subtitle')}</p>
        </div>

        <ModeSwitcher mode={mode} setMode={setMode} t={t} />

        <div className={`calc-workspace mode-${mode}`}>
          {(mode === 'calculator' || mode === 'split') && (
            <div className="calc-section">
              <CalculatorPanel onHistoryAdd={handleHistoryAdd} />
            </div>
          )}

          {(mode === 'graph' || mode === 'split') && (
            <div className="calc-section">
              <Suspense fallback={<div className="result-box">{copy.graphLoading}</div>}>
                <GraphPanel onHistoryAdd={handleHistoryAdd} />
              </Suspense>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <HistoryPanel
            history={history}
            onRestore={handleHistoryRestore}
            onClear={handleHistoryClear}
          />
        )}

        <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>{copy.infoTitle}</h2>
          <p style={{ marginBottom: '1rem', color: 'var(--text)', textAlign: 'center' }}>
            {copy.infoDescription}
          </p>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>{copy.featuresTitle}</h3>
          <ul style={{ marginLeft: '1.5rem', color: 'var(--text)', lineHeight: '1.8' }}>
            {copy.features.map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>{copy.graphTitle}</h3>
          <ul style={{ marginLeft: '1.5rem', color: 'var(--text)', lineHeight: '1.8' }}>
            {copy.graphFeatures.map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>{copy.modesTitle}</h3>
          <ul style={{ marginLeft: '1.5rem', color: 'var(--text)', lineHeight: '1.8' }}>
            {copy.modes.map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>{copy.examplesTitle}</h3>
          <p style={{ color: 'var(--text)', lineHeight: '1.8', textAlign: 'center' }}>
            {copy.calcExample}
          </p>
          <p style={{ color: 'var(--text)', lineHeight: '1.8', marginTop: '0.5rem', textAlign: 'center' }}>
            {copy.graphExample}
          </p>
        </div>

        <RelatedTools currentPath={`/${language}/calculator`} />
      </div>
    </>
  )
}

export default Calculator
