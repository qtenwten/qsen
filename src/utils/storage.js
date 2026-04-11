export function safeGetItem(key) {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.warn('localStorage getItem failed:', error)
    return null
  }
}

export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.warn('localStorage setItem failed:', error)
    return false
  }
}

export function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn('localStorage removeItem failed:', error)
    return false
  }
}

export function safeParseJSON(value, fallback = null) {
  if (!value) {
    return fallback
  }

  try {
    return JSON.parse(value)
  } catch (error) {
    console.warn('JSON parse failed:', error)
    return fallback
  }
}
