import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export const AdminRoute = () => {
  const { isInitialized, isAuthenticated, user } = useAuth()

  if (!isInitialized) {
    return (
      <div className='min-h-screen flex items-center justify-center ui-text-muted'>
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/admin/login' replace />
  }

  if (user?.role !== 'admin') {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}
