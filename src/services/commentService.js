import api from './api'

const commentService = {
  getAll: async () => {
    const response = await api.get('/comments/')
    return response.data.comentarios || []
  },

  getById: async (id) => {
    const response = await api.get(`/comments/id/${id}`)
    return response.data.comentario
  },

  delete: async (id) => {
    const response = await api.delete(`/comments/${id}`)
    return response.data
  },

  getUserComments: async (userId) => {
    const response = await api.get(`/comments/user/${userId}`)
    return response.data.comentarios || []
  },

  getByProduct: async (productId) => {
    const response = await api.get(`/comments/product/${productId}`)
    return response.data.comentarios || []
  },

  create: async (commentData) => {
    const response = await api.post('/comments/', commentData)
    return response.data.comentario
  },

  update: async (id, commentData) => {
    const response = await api.put(`/comments/id/${id}`, commentData)
    return response.data
  },

  deleteOwn: async (id) => {
    const response = await api.delete(`/comments/id/${id}`)
    return response.data
  },
}

export default commentService
