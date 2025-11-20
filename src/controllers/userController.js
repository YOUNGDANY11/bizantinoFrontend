import userService from '../services/userService'

const userController = {
  getAll: async () => {
    try {
      const users = await userService.getAll()
      return {
        success: true,
        data: users,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar usuarios',
      }
    }
  },

  getActive: async () => {
    try {
      const user = await userService.getActive()
      return {
        success: true,
        data: user,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar perfil',
      }
    }
  },

  getById: async (id) => {
    try {
      const user = await userService.getById(id)
      return {
        success: true,
        data: user,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar usuario',
      }
    }
  },

  getByEmail: async (email) => {
    try {
      const users = await userService.getByEmail(email)
      return {
        success: true,
        data: users,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.mensaje || 'Error al buscar usuarios',
      }
    }
  },

  updateAddress: async (address) => {
    try {
      const user = await userService.updateAddress(address)
      return {
        success: true,
        data: user,
        message: 'Dirección actualizada exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.mensaje || 'Error al actualizar dirección',
      }
    }
  },

  delete: async (id) => {
    try {
      await userService.delete(id)
      return {
        success: true,
        message: 'Usuario eliminado exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar usuario',
      }
    }
  },

  validateAddressForm: (address) => {
    const errors = {}

    if (!address || address.trim().length < 5) {
      errors.address = 'La dirección debe tener al menos 5 caracteres'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  },
}

export default userController
