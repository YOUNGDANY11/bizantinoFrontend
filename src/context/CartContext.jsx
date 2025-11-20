import { createContext, useContext, useState, useEffect } from 'react'
import cartService from '../services/cartService'
import productService from '../services/productService'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  const fetchCartItems = async () => {
    if (!isAuthenticated()) return
    
    try {
      setLoading(true)
      const cartData = await cartService.getCartItems()
 
      const itemsWithProductInfo = await Promise.all(
        cartData.map(async (item) => {
          try {
            const product = await productService.getById(item.id_product)
            return {
              ...item,
              product_name: product.name,
              price: product.price,
              size: product.size,
              tipe: product.tipe,
              stock: product.quantity,
            }
          } catch (error) {
            console.error(`Error al cargar producto ${item.id_product}:`, error)
            return item 
          }
        })
      )
      
      setCartItems(itemsWithProductInfo)
    } catch (error) {
      if (error.response?.status === 404) {
        setCartItems([])
      } else {
        console.error('Error al cargar el carrito:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartService.addToCart(productId, quantity)
      await fetchCartItems()
    } catch (error) {
      console.error('Error al agregar al carrito:', error)
      throw error
    }
  }

  const updateQuantity = async (id, quantity) => {
    try {
      await cartService.updateQuantity(id, quantity)
      await fetchCartItems()
    } catch (error) {
      console.error('Error al actualizar cantidad:', error)
      throw error
    }
  }

  const removeFromCart = async (id) => {
    try {
      await cartService.removeFromCart(id)
      await fetchCartItems()
    } catch (error) {
      console.error('Error al eliminar del carrito:', error)
      throw error
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + ((item.price || 0) * item.quantity)
    }, 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  useEffect(() => {
    fetchCartItems()
  }, [isAuthenticated])

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCartItems,
    getCartTotal,
    getCartItemsCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartContext
