import api from './api'

const cartService = {
  getCartItems: async () => {
    const response = await api.get('/cart/')
    return response.data.carrito || []
  },

  addToCart: async (productId, quantity) => {
    const response = await api.post('/cart/', { id_product: productId, quantity })
    return response.data.item
  },

  updateQuantity: async (id, quantity) => {
    const response = await api.put(`/cart/${id}`, { quantity })
    return response.data.item
  },

  removeFromCart: async (id) => {
    const response = await api.delete(`/cart/${id}`)
    return response.data.item
  },
}

export default cartService
