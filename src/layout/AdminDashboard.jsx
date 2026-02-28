import { useMemo, useState } from 'react'
import { Sidebar } from '../components/admin/Sidebar.jsx'
import { Menu } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { ThemeToggle } from '../components/theme/ThemeToggle.jsx'

export const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  const pageTitle = useMemo(() => {
    if (location.pathname.includes('/admin/posts')) return 'Posts Manager'
    if (location.pathname.includes('/admin/users')) return 'User Management'
    if (location.pathname.includes('/admin/moderation'))
      return 'Moderation Queue'
    return 'Dashboard Overview'
  }, [location.pathname])

  return (
    <div className='min-h-screen ui-app-bg flex'>
      {isSidebarOpen && (
        <button
          type='button'
          aria-label='Close sidebar overlay'
          className='fixed inset-0 z-40 bg-black/40 md:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      </aside>
      <div className='flex-1 flex flex-col h-screen overflow-hidden'>
        <header className='h-16 flex items-center justify-between px-4 sm:px-8 shrink-0 ui-surface-soft'>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className='md:hidden ui-text-muted hover:text-[var(--color-text-primary)]'
            >
              <Menu size={24} />
            </button>
            <h1 className='text-xl font-bold ui-heading capitalize hidden sm:block'>
              {pageTitle}
            </h1>
          </div>
          <div className='flex items-center gap-4'>
            <ThemeToggle compact />
            <div className='w-9 h-9 rounded-full flex items-center justify-center font-bold ui-surface-soft ui-text'>
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>
        <main className='flex-1 overflow-y-auto p-4 sm:p-8'>
          <div className='max-w-6xl mx-auto animate-in fade-in duration-500'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
