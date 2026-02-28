import { useState } from 'react'
import { Button } from './Button.jsx'
import { Menu, ShieldUser, User2, X } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { userLogOut } from '../api/auth.js'
import { useAuth } from '../hooks/useAuth.js'
import { ThemeToggle } from './theme/ThemeToggle.jsx'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/posts' },
  ]

  const handleLogout = async () => {
    try {
      await userLogOut()
      navigate('/login')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 border-b ui-border bg-[var(--backdrop-glass)] backdrop-blur-xl'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <Link to='/' className='flex items-center gap-2 group cursor-pointer'>
            <div className='w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6 bg-[var(--color-accent)]'>
              <span className='text-white font-black text-xl'>M</span>
            </div>
            <span className='text-xl font-bold tracking-tight ui-heading'>
              <span className='text-[var(--color-accent)]'>Blog</span>
            </span>
          </Link>

          <div className='hidden md:flex items-center gap-8'>
            <div className='flex items-center gap-6'>
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  end={link.href === '/'}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
                        : 'ui-text-muted hover:text-[var(--color-accent)]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <ThemeToggle />
            <div className='h-6 w-[1px] mx-1 bg-[var(--color-border)]'></div>
            {isAuthenticated ? (
              <div className='flex items-center gap-3'>
                <Link
                  className='ui-ring-focus px-3 py-1.5 text-sm gap-1.5 inline-flex items-center justify-center font-medium rounded-xl ui-chip'
                  to='/profile'
                >
                  <User2 size={16} />
                  Profile
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    className='ui-ring-focus px-3 py-1.5 text-sm gap-1.5 inline-flex items-center justify-center font-medium rounded-xl ui-chip'
                    to='/admin/dashboard'
                  >
                    <ShieldUser size={16} />
                    Admin
                  </Link>
                )}
                <Button
                  aria-label='Log out'
                  variant='destructive'
                  onClick={handleLogout}
                >
                  <span>Log Out</span>
                </Button>
              </div>
            ) : (
              <div className='flex items-center gap-3'>
                <Link
                  to='/login'
                  className='ui-ring-focus inline-flex items-center justify-center font-medium rounded-xl bg-transparent ui-text-muted hover:bg-[var(--color-surface-soft)] px-3 py-1.5 text-sm gap-1.5'
                >
                  Log in
                </Link>
                <Link
                  to='/signup'
                  className='ui-ring-focus inline-flex items-center justify-center font-medium rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-hover)] px-3 py-1.5 text-sm gap-1.5'
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <div className='md:hidden'>
            <button
              type='button'
              onClick={() => setIsOpen((value) => !value)}
              className='ui-ring-focus p-2 rounded-lg transition-colors ui-text-muted hover:bg-[var(--color-surface-soft)]'
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className='md:hidden px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300 border-t ui-border bg-[var(--color-surface)]'>
          <ThemeToggle className='w-fit' compact />
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className='ui-ring-focus block text-lg font-medium ui-text px-4 py-2 hover:bg-[var(--color-surface-soft)] rounded-lg'
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className='pt-4 border-t ui-border flex flex-col gap-3'>
            {isAuthenticated ? (
              <>
                <Link
                  to='/profile'
                  className='ui-ring-focus inline-flex items-center justify-center rounded-xl ui-chip px-3 py-1.5 text-sm gap-1.5'
                  onClick={() => setIsOpen(false)}
                >
                  <User2 size={16} />
                  Profile
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to='/admin/dashboard'
                    className='ui-ring-focus inline-flex items-center justify-center rounded-xl ui-chip px-3 py-1.5 text-sm gap-1.5'
                    onClick={() => setIsOpen(false)}
                  >
                    <ShieldUser size={16} />
                    Admin
                  </Link>
                )}
                <Button
                  aria-label='Log out'
                  variant='destructive'
                  onClick={() => {
                    setIsOpen(false)
                    handleLogout()
                  }}
                >
                  <span>Log Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='ui-ring-focus inline-flex items-center justify-center rounded-xl bg-transparent ui-text-muted hover:bg-[var(--color-surface-soft)] px-3 py-1.5 text-sm gap-1.5'
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to='/signup'
                  className='ui-ring-focus inline-flex items-center justify-center rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-contrast)] px-3 py-1.5 text-sm gap-1.5'
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
