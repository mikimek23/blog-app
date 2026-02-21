import React, { useState } from 'react'
import { Button } from './Button'
import { Menu, User2Icon, X } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getAccessToken, subscribeToken } from '../hooks/tokenStore'
import { useSyncExternalStore } from 'react'
import { userLogOut } from '../api/auth'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [active, setActive] = useState('Home')
  const navigate = useNavigate
  const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/posts' },
    { label: 'Resources', href: '#' },
    { label: 'Community', href: '/posts' },
  ]
  const token = useSyncExternalStore(
    subscribeToken,
    getAccessToken,
    getAccessToken,
  )
  const handleLogout = async () => {
    try {
      await userLogOut()
      navigate('/login')
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo Section */}
          <div className='flex items-center gap-2 group cursor-pointer'>
            <div className='w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform'>
              <span className='text-white font-black text-xl'>M</span>
            </div>
            <span className='text-xl font-bold tracking-tight text-slate-800'>
              <span className='text-blue-600'>Blog</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-8'>
            <div className='flex items-center gap-6'>
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  end={link.href === '/'}
                  className={`text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors${active == link.label ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
                  onClick={() => setActive(link.label)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className='h-6 w-[1px] bg-slate-200 mx-2'></div>
            {token ? (
              <div className='flex items-center gap-3'>
                <Link
                  aria-label='Profile'
                  className='px-3 py-1.5 text-sm gap-1.5 inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  to='/user/profile'
                >
                  <User2Icon size={18} />
                  <span>Profile</span>
                </Link>
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
                  className=' inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl bg-transparent text-slate-600 hover:bg-indigo-50 px-3 py-1.5 text-sm gap-1.5'
                >
                  Log in
                </Link>
                <Link
                  to='/signup'
                  className='inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:shadow-indigo-500/30 px-3 py-1.5 text-sm gap-1.5'
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors'
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className='md:hidden bg-white border-b border-slate-100 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300'>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className='block text-lg font-medium text-slate-700 px-4 py-2 hover:bg-slate-50 rounded-lg'
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className='pt-4 border-t border-slate-100 flex flex-col gap-3'>
            {token ? (
              <div className='pt-4 border-t border-slate-100 flex flex-col gap-3'>
                <Link
                  aria-label='Profile'
                  className='px-3 py-1.5 text-sm gap-1.5 inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  to='/user/profile'
                >
                  <User2Icon size={18} />
                  <span>Profile</span>
                </Link>
                <Button
                  aria-label='Log out'
                  variant='destructive'
                  onClick={handleLogout}
                >
                  <span>Log Out</span>
                </Button>
              </div>
            ) : (
              <div className='pt-4 border-t border-slate-100 flex flex-col gap-3'>
                <Link
                  to='/login'
                  className=' inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl bg-transparent text-slate-600 hover:bg-indigo-50 px-3 py-1.5 text-sm gap-1.5'
                >
                  Log in
                </Link>
                <Link
                  to='/signup'
                  className='inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:shadow-indigo-500/30 px-3 py-1.5 text-sm gap-1.5'
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
