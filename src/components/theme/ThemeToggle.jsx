import { Laptop, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme.js'

const iconByTheme = {
  light: Sun,
  dark: Moon,
  system: Laptop,
}

export const ThemeToggle = ({ compact = false, className = '' }) => {
  const { theme, setTheme } = useTheme()
  const Icon = iconByTheme[theme] || Laptop

  return (
    <label
      className={`ui-chip inline-flex items-center gap-2 px-3 py-1.5 text-sm ${className}`}
    >
      <span className='sr-only'>Theme mode</span>
      <Icon size={16} />
      {!compact && <span className='hidden sm:inline'>Theme</span>}
      <select
        aria-label='Theme mode'
        value={theme}
        onChange={(event) => setTheme(event.target.value)}
        className='ui-theme-select'
      >
        <option value='light'>Light</option>
        <option value='dark'>Dark</option>
        <option value='system'>System</option>
      </select>
    </label>
  )
}
