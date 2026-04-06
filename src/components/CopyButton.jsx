import { useState } from 'react'

function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`copy-btn ${className}`}
      disabled={!text}
    >
      {copied ? '✓ Скопировано' : '📋 Копировать'}
    </button>
  )
}

export default CopyButton
