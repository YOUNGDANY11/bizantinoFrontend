import api from './api'

const productService = {
  getAll: async () => {
    const response = await api.get('/products/')
    return response.data.productos || []
  },

  getById: async (id) => {
    const response = await api.get(`/products/id/${id}`)
    return response.data.producto
  },

  search: async (searchTerm) => {
    const response = await api.get('/products/name', { 
      params: { name: searchTerm },
      data: { name: searchTerm }
    })
    return response.data.producto || []
  },

  getByType: async (type) => {
    const response = await api.get('/products/tipe', { 
      params: { tipe: type },
      data: { tipe: type }
    })
    return response.data.producto || []
  },

  getBySize: async (size) => {
    const response = await api.get('/products/size', { 
      params: { size },
      data: { size }
    })
    return response.data.producto || []
  },

  create: async (productData) => {
    const response = await api.post('/products/', productData)
    return response.data
  },

  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data.producto
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
}

export default productService
