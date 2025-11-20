import cartService from '../services/cartService'

const cartController = {
  getCartItems: async () => {
    try {
      const items = await cartService.getCartItems()
      return {
        success: true,
        data: items,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar el carrito',
      }
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      await cartService.addToCart(productId, quantity)
      return {
        success: true,
        message: 'Producto agregado al carrito',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al agregar al carrito',
      }
    }
  },

  updateQuantity: async (id, quantity) => {
    try {
      await cartService.updateQuantity(id, quantity)
      return {
        success: true,
        message: 'Cantidad actualizada',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar cantidad',
      }
    }
  },

  removeFromCart: async (id) => {
    try {
      await cartService.removeFromCart(id)
      return {
        success: true,
        message: 'Producto eliminado del carrito',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar del carrito',
      }
    }
  },

  clearCart: async () => {
    try {
      await cartService.clearCart()
      return {
        success: true,
        message: 'Carrito vaciado',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al vaciar el carrito',
      }
    }
  },

  calculateTotal: (items) => {
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  },

  validateQuantity: (quantity, stock) => {
    const errors = {}

    if (!quantity || quantity <= 0) {
      errors.quantity = 'La cantidad debe ser mayor a 0'
    }

    if (quantity > stock) {
      errors.quantity = 'No hay suficiente stock disponible'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  },
}

export default cartController
