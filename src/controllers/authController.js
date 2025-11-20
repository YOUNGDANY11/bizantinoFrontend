import authService from '../services/authService'

const authController = {
  register: async (userData) => {
    try {
      const response = await authService.register(userData)
      return {
        success: true,
        data: response,
        message: 'Usuario registrado exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrar usuario',
      }
    }
  },

  login: async (credentials) => {
    try {
      const response = await authService.login(credentials)
      return {
        success: true,
        data: response,
        message: 'Inicio de sesión exitoso',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Credenciales inválidas',
      }
    }
  },

  logout: () => {
    authService.logout()
    return {
      success: true,
      message: 'Sesión cerrada exitosamente',
    }
  },

  validateRegisterForm: (formData) => {
    const errors = {}

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!formData.lastname || formData.lastname.trim().length < 2) {
      errors.lastname = 'El apellido debe tener al menos 2 caracteres'
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido'
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  },

  validateLoginForm: (formData) => {
    const errors = {}

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido'
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  },
}

export default authController
