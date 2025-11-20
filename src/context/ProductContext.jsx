import { createContext, useContext, useState } from 'react'
import productService from '../services/productService'

const ProductContext = createContext()

export const useProduct = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProduct debe ser usado dentro de un ProductProvider')
  }
  return context
}

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Error al cargar productos:', error)
      if (error.response?.status === 404) {
        setProducts([])
      } else {
        throw error
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchProductById = async (id) => {
    try {
      setLoading(true)
      const data = await productService.getById(id)
      setCurrentProduct(data)
      return data
    } catch (error) {
      console.error('Error al cargar producto:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const searchProducts = async (searchTerm) => {
    try {
      setLoading(true)
      const data = await productService.search(searchTerm)
      setProducts(data)
    } catch (error) {
      console.error('Error al buscar productos:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchProductsByType = async (type) => {
    try {
      setLoading(true)
      const data = await productService.getByType(type)
      setProducts(data)
    } catch (error) {
      console.error('Error al filtrar productos:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchProductsBySize = async (size) => {
    try {
      setLoading(true)
      const data = await productService.getBySize(size)
      setProducts(data)
    } catch (error) {
      console.error('Error al filtrar productos:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (productData) => {
    try {
      const data = await productService.create(productData)
      await fetchProducts()
      return data
    } catch (error) {
      console.error('Error al crear producto:', error)
      throw error
    }
  }

  const updateProduct = async (id, productData) => {
    try {
      const data = await productService.update(id, productData)
      await fetchProducts()
      return data
    } catch (error) {
      console.error('Error al actualizar producto:', error)
      throw error
    }
  }

  const deleteProduct = async (id) => {
    try {
      const result = await productService.delete(id)
      await fetchProducts()
      return result
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      throw error
    }
  }

  const value = {
    products,
    loading,
    currentProduct,
    fetchProducts,
    fetchProductById,
    searchProducts,
    fetchProductsByType,
    fetchProductsBySize,
    createProduct,
    updateProduct,
    deleteProduct,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export default ProductContext
