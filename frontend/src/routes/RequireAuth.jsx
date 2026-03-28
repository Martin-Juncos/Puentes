import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { useAuth } from '@/hooks/useAuth'

export const RequireAuth = () => {
  const { isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingScreen message="Recuperando sesión..." />
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}
