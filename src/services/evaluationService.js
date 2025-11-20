import api from './api'

const evaluationService = {
  getAll: async () => {
    const response = await api.get('/evaluations/')
    return response.data.data || []
  },

  getById: async (id) => {
    const response = await api.get(`/evaluations/id/${id}`)
    return response.data.data
  },

  delete: async (id) => {
    const response = await api.delete(`/evaluations/${id}`)
    return response.data
  },

  getUserEvaluations: async (userId) => {
    const response = await api.get(`/evaluations/user/${userId}`)
    return response.data.data || []
  },

  getByProduct: async (productId) => {
    const response = await api.get(`/evaluations/product/${productId}`)
    return response.data.data || []
  },

  create: async (evaluationData) => {
    const response = await api.post('/evaluations/', evaluationData)
    return response.data.data
  },

  update: async (id, evaluationData) => {
    const response = await api.put(`/evaluations/id/${id}`, evaluationData)
    return response.data
  },

  deleteOwn: async (id) => {
    const response = await api.delete(`/evaluations/id/${id}`)
    return response.data
  },
}

export default evaluationService
