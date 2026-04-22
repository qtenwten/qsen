import { createContext, useContext, useState, useMemo, useCallback } from 'react'

const BreadcrumbsContext = createContext(null)

export function BreadcrumbsProvider({ children }) {
  const [articleTitle, setArticleTitle] = useState(null)

  const value = useMemo(() => ({
    articleTitle,
    setArticleTitle,
  }), [articleTitle])

  return (
    <BreadcrumbsContext.Provider value={value}>
      {children}
    </BreadcrumbsContext.Provider>
  )
}

export function useBreadcrumbs() {
  const context = useContext(BreadcrumbsContext)
  if (!context) {
    throw new Error('useBreadcrumbs must be used within BreadcrumbsProvider')
  }
  return context
}
