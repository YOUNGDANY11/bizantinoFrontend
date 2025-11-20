import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const data = await authService.login(credentials)
    if (data.token) {
      const tokenParts = data.token.split('.')
      const payload = JSON.parse(atob(tokenParts[1]))
      const userData = {
        id: payload.id,
        role: payload.role,
        email: payload.email,
        name: payload.name,
      }
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    }
    return data
  }

  const register = async (userData) => {
    try {
      const result = await authService.register(userData)
      return result
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al registrar usuario'
      }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const isAuthenticated = () => {
    return authService.isAuthenticated()
  }

  const isAdmin = () => {
    return user?.role === 'Admin'
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
