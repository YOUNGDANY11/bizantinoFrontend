import api from './api'

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return {
        success: response.data.status === 'Success',
        data: response.data,
        message: response.data.mensaje
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.mensaje || error.message,
        data: null
      }
    }
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}

export default authService
