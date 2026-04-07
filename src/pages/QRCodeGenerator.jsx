import { useState, useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import SEO from '../components/SEO'
import RelatedTools from '../components/RelatedTools'

function QRCodeGenerator() {
  const [qrType, setQrType] = useState('text')
  const [qrValue, setQrValue] = useState('')
  const [qrSize, setQrSize] = useState(256)
  const [qrStyle, setQrStyle] = useState('squares')
  const [qrColor, setQrColor] = useState('#000000')
  const [qrBgColor, setQrBgColor] = useState('#ffffff')
  const qrRef = useRef(null)
  const qrCodeRef = useRef(null)

  const qrTypes = [
    { id: 'text', label: 'Текст', placeholder: 'Введите текст' },
    { id: 'url', label: 'Ссылка', placeholder: 'https://example.com' },
    { id: 'email', label: 'Email', placeholder: 'example@mail.com' },
    { id: 'phone', label: 'Телефон', placeholder: '+7 (999) 123-45-67' },
    { id: 'sms', label: 'SMS', placeholder: '+7 (999) 123-45-67' },
    { id: 'wifi', label: 'WiFi', placeholder: 'SSID:password:WPA' }
  ]

  const qrStyles = [
    { id: 'squares', label: '⬛ Квадраты', icon: '⬛' },
    { id: 'dots', label: '⚫ Точки', icon: '⚫' },
    { id: 'rounded', label: '🔘 Скругленные', icon: '🔘' }
  ]

  const qrPresets = [
    { name: 'Классический', fg: '#000000', bg: '#ffffff' },
    { name: 'Синий', fg: '#2196F3', bg: '#E3F2FD' },
    { name: 'Зеленый', fg: '#4CAF50', bg: '#E8F5E9' },
    { name: 'Красный', fg: '#F44336', bg: '#FFEBEE' },
    { name: 'Фиолетовый', fg: '#9C27B0', bg: '#F3E5F5' },
    { name: 'Оранжевый', fg: '#FF9800', bg: '#FFF3E0' }
  ]

  useEffect(() => {
    if (!qrValue.trim()) return

    const dotsType = qrStyle === 'dots' ? 'dots' : qrStyle === 'rounded' ? 'rounded' : 'square'
    const cornersType = qrStyle === 'rounded' ? 'extra-rounded' : 'square'

    qrCodeRef.current = new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      data: formatValue(),
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'H'
      },
      dotsOptions: {
        color: qrColor,
        type: dotsType
      },
      backgroundOptions: {
        color: qrBgColor
      },
      cornersSquareOptions: {
        color: qrColor,
        type: cornersType
      },
      cornersDotOptions: {
        color: qrColor,
        type: dotsType
      }
    })

    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCodeRef.current.append(qrRef.current)
    }
  }, [qrValue, qrSize, qrStyle, qrColor, qrBgColor, qrType])

  // Показываем QR в реальном времени
  const shouldShowQR = qrValue.trim() !== ''

  const handleDownload = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({
        name: 'qrcode',
        extension: 'png'
      })
    }
  }

  const formatValue = () => {
    switch (qrType) {
      case 'email':
        return `mailto:${qrValue}`
      case 'phone':
        return `tel:${qrValue}`
      case 'sms':
        return `sms:${qrValue}`
      case 'wifi':
        const [ssid, password, security] = qrValue.split(':')
        return `WIFI:T:${security || 'WPA'};S:${ssid};P:${password};;`
      default:
        return qrValue
    }
  }

  return (
    <>
      <SEO
        title="Генератор QR-кодов онлайн - Бесплатно"
        description="Создайте QR-код для текста, ссылки, email, телефона или WiFi. Скачайте в PNG формате. Быстро и бесплатно."
        path="/qr-code-generator"
        keywords="генератор qr кода, создать qr код, qr код онлайн, qr code generator"
      />

      <div className="tool-container">
        <h1>Генератор QR-кодов</h1>
        <p>Создайте QR-код для любых данных</p>

        <div className="field">
          <label>Тип QR-кода</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
            {qrTypes.map(type => (
              <button
                key={type.id}
                className={qrType === type.id ? '' : 'secondary'}
                style={{ padding: '0.75rem', fontSize: '0.9rem' }}
                onClick={() => {
                  setQrType(type.id)
                  setQrValue('')
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="qrValue">Данные для QR-кода</label>
          <textarea
            id="qrValue"
            value={qrValue}
            onChange={(e) => setQrValue(e.target.value)}
            placeholder={qrTypes.find(t => t.id === qrType)?.placeholder}
            rows={qrType === 'text' ? 4 : 2}
            autoFocus
          />
          {qrType === 'wifi' && (
            <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
              Формат: SSID:пароль:тип_шифрования (WPA/WEP/nopass)
            </small>
          )}
        </div>

        <div className="field">
          <label htmlFor="qrSize">Размер: {qrSize}x{qrSize} px</label>
          <input
            id="qrSize"
            type="range"
            min="128"
            max="400"
            step="16"
            value={qrSize}
            onChange={(e) => setQrSize(Number(e.target.value))}
          />
        </div>

        <div className="field">
          <label>Стиль QR-кода</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {qrStyles.map(style => (
              <button
                key={style.id}
                className={qrStyle === style.id ? '' : 'secondary'}
                style={{ padding: '0.75rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}
                onClick={() => setQrStyle(style.id)}
              >
                <span style={{ fontSize: '1.5rem' }}>{style.icon}</span>
                <span>{style.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Цветовая схема</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
            {qrPresets.map((preset, idx) => (
              <button
                key={idx}
                className="secondary"
                style={{
                  background: preset.bg,
                  color: preset.fg,
                  border: `2px solid ${preset.fg}`,
                  padding: '0.75rem',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
                onClick={() => {
                  setQrColor(preset.fg)
                  setQrBgColor(preset.bg)
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="qrColor" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Цвет QR</label>
              <input
                id="qrColor"
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                style={{ width: '100%', height: '50px', cursor: 'pointer' }}
              />
            </div>
            <div>
              <label htmlFor="qrBgColor" style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Фон</label>
              <input
                id="qrBgColor"
                type="color"
                value={qrBgColor}
                onChange={(e) => setQrBgColor(e.target.value)}
                style={{ width: '100%', height: '50px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {shouldShowQR && (
          <>
            <div className="result-box success" style={{ textAlign: 'center' }}>
              <div ref={qrRef} style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}></div>
              <button onClick={handleDownload} style={{ width: '100%' }}>
                📥 Скачать PNG
              </button>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                Отсканируйте камерой телефона или скачайте изображение
              </p>
            </div>
          </>
        )}

        <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Возможности генератора</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎨</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Кастомизация</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>Выбирайте цвета и стили QR-кода</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔗</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Любые данные</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>Текст, ссылки, контакты, WiFi пароли</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Высокое качество</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>Векторная графика, четкое изображение</p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Мгновенно</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>Генерация за секунду, без регистрации</p>
            </div>
          </div>
        </div>

        <RelatedTools currentPath="/qr-code-generator" />
      </div>
    </>
  )
}

export default QRCodeGenerator
