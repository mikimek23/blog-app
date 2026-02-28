export const THEME_OPTIONS = ['light', 'dark', 'system']
export const THEME_STORAGE_KEY = 'mblog-theme'
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)'

export const isValidTheme = (value) => THEME_OPTIONS.includes(value)

export const getSystemTheme = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia(THEME_MEDIA_QUERY).matches ? 'dark' : 'light'
}

export const resolveTheme = (theme) => {
  if (theme === 'light' || theme === 'dark') return theme
  return getSystemTheme()
}

export const readStoredTheme = () => {
  if (typeof window === 'undefined') return 'system'
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isValidTheme(value) ? value : 'system'
  } catch {
    return 'system'
  }
}

export const writeStoredTheme = (theme) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Ignore storage errors and keep in-memory theme state.
  }
}
