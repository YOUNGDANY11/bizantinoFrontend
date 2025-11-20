import api from './api'

const imageService = {
  getByProductId: async (productId) => {
    const response = await api.get(`/images/product/${productId}`)
    return response.data.imagenes || []
  },

  uploadImage: async (productId, imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await api.post(`/images/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  deleteImage: async (imageId) => {
    const response = await api.delete(`/images/${imageId}`)
    return response.data
  },
}

export default imageService
