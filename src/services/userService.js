import api from './api'

const userService = {
  getAll: async () => {
    const response = await api.get('/users')
    return response.data.usuarios || []
  },

  getActive: async () => {
    const response = await api.get('/users/active')
    return response.data.usuario
  },

  getById: async (id) => {
    const response = await api.get(`/users/id/${id}`)
    return response.data.usuario
  },

  getByEmail: async (email) => {
    const response = await api.post('/users/email', { email })
    return response.data.usuario || []
  },

  updateAddress: async (address) => {
    const response = await api.put('/users/', { address })
    return response.data.usuario
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data.usuario
  },
}

export default userService
