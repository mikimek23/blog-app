import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export const ProtectedRoute = () => {
  const { isInitialized, isAuthenticated } = useAuth()

  if (!isInitialized) {
    return (
      <div className='min-h-screen flex items-center justify-center ui-text-muted'>
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}
