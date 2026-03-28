import { useEffect, useState } from 'react'

import { authService } from '@/services/authService'
import { AuthContext } from '@/features/auth/AuthContext'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const sessionUser = await authService.getCurrentUser()
        setUser(sessionUser)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    bootstrap()
  }, [])

  const login = async (credentials) => {
    const sessionUser = await authService.login(credentials)
    setUser(sessionUser)
    return sessionUser
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
