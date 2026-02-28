import { useEffect, useMemo, useState } from 'react'
import {
  THEME_MEDIA_QUERY,
  getSystemTheme,
  isValidTheme,
  readStoredTheme,
  resolveTheme,
  writeStoredTheme,
} from './theme.js'
import { ThemeContext } from './ThemeContext.js'

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => readStoredTheme())
  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme())

  const resolvedTheme = useMemo(() => {
    if (theme === 'system') return systemTheme
    return resolveTheme(theme)
  }, [systemTheme, theme])

  const setTheme = (nextTheme) => {
    if (!isValidTheme(nextTheme)) return
    setThemeState(nextTheme)
  }

  const toggleTheme = () => {
    setThemeState((currentTheme) => {
      const currentResolved = resolveTheme(currentTheme)
      return currentResolved === 'dark' ? 'light' : 'dark'
    })
  }

  useEffect(() => {
    writeStoredTheme(theme)
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.style.colorScheme = resolvedTheme
  }, [resolvedTheme, theme])

  useEffect(() => {
    if (theme !== 'system') return
    const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY)

    const handleSystemThemeChange = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [resolvedTheme, theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
