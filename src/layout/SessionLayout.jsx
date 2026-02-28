import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { bootstrapSession, initializeApiAuthHandlers } from '../api/auth.js'
import { useAuth } from '../hooks/useAuth.js'

export const SessionLayout = () => {
  const didBootstrap = useRef(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isInitialized, isAuthenticated } = useAuth()

  const isAuthRoute =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/admin/login'
  const isAdminArea = location.pathname.startsWith('/admin')
  const isUserProtectedArea = location.pathname === '/profile'

  useEffect(() => {
    if (didBootstrap.current) return
    didBootstrap.current = true

    initializeApiAuthHandlers(() => {
      const target = window.location.pathname.startsWith('/admin')
        ? '/admin/login'
        : '/login'
      navigate(target, { replace: true })
    })
    bootstrapSession()
  }, [navigate])

  useEffect(() => {
    if (!isInitialized || isAuthenticated || isAuthRoute) return

    if (isAdminArea) {
      navigate('/admin/login', { replace: true })
      return
    }

    if (isUserProtectedArea) {
      navigate('/login', { replace: true })
    }
  }, [
    isAdminArea,
    isAuthRoute,
    isAuthenticated,
    isInitialized,
    isUserProtectedArea,
    navigate,
  ])

  if (!isInitialized && !isAuthRoute) {
    return (
      <div className='min-h-screen flex items-center justify-center ui-text-muted'>
        Restoring your session...
      </div>
    )
  }

  return <Outlet />
}
