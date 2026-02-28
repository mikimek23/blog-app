import { useState } from 'react'
import { Button } from './Button.jsx'
import { Menu, ShieldUser, User2, X } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { userLogOut } from '../api/auth.js'
import { useAuth } from '../hooks/useAuth.js'

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
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <Link to='/' className='flex items-center gap-2 group cursor-pointer'>
            <div className='w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform'>
              <span className='text-white font-black text-xl'>M</span>
            </div>
            <span className='text-xl font-bold tracking-tight text-slate-800'>
              <span className='text-blue-600'>Blog</span>
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
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-600 hover:text-blue-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className='h-6 w-[1px] bg-slate-200 mx-2'></div>
            {isAuthenticated ? (
              <div className='flex items-center gap-3'>
                <Link
                  className='px-3 py-1.5 text-sm gap-1.5 inline-flex items-center justify-center font-medium rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  to='/profile'
                >
                  <User2 size={16} />
                  Profile
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    className='px-3 py-1.5 text-sm gap-1.5 inline-flex items-center justify-center font-medium rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
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
                  className='inline-flex items-center justify-center font-medium rounded-xl bg-transparent text-slate-600 hover:bg-indigo-50 px-3 py-1.5 text-sm gap-1.5'
                >
                  Log in
                </Link>
                <Link
                  to='/signup'
                  className='inline-flex items-center justify-center font-medium rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:shadow-indigo-500/30 px-3 py-1.5 text-sm gap-1.5'
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
              className='p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors'
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className='md:hidden bg-white border-b border-slate-100 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300'>
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className='block text-lg font-medium text-slate-700 px-4 py-2 hover:bg-slate-50 rounded-lg'
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className='pt-4 border-t border-slate-100 flex flex-col gap-3'>
            {isAuthenticated ? (
              <>
                <Link
                  to='/profile'
                  className='inline-flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 text-sm gap-1.5'
                  onClick={() => setIsOpen(false)}
                >
                  <User2 size={16} />
                  Profile
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to='/admin/dashboard'
                    className='inline-flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 text-sm gap-1.5'
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
                  className='inline-flex items-center justify-center rounded-xl bg-transparent text-slate-600 hover:bg-indigo-50 px-3 py-1.5 text-sm gap-1.5'
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to='/signup'
                  className='inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-3 py-1.5 text-sm gap-1.5'
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
