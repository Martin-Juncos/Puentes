import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

export const RoleGate = ({ allowedRoles }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate replace to="/login" />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate replace to="/app/dashboard" />
  }

  return <Outlet />
}
