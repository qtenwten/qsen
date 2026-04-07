import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

function CopyButton({ text, className = '' }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Silently fail - clipboard API might not be available
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`copy-btn ${className}`}
      disabled={!text}
    >
      {copied ? (
        <>
          <span className="material-symbols-outlined" style={{verticalAlign: 'middle', marginRight: '0.25rem', fontSize: '1.2rem'}}>check</span>
          {t('common.copied')}
        </>
      ) : (
        <>
          <span className="material-symbols-outlined" style={{verticalAlign: 'middle', marginRight: '0.25rem', fontSize: '1.2rem'}}>content_copy</span>
          {t('common.copy')}
        </>
      )}
    </button>
  )
}

export default CopyButton
