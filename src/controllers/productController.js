import productService from '../services/productService'

const productController = {
  getAll: async () => {
    try {
      const products = await productService.getAll()
      return {
        success: true,
        data: products,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar productos',
      }
    }
  },

  getById: async (id) => {
    try {
      const product = await productService.getById(id)
      return {
        success: true,
        data: product,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar el producto',
      }
    }
  },

  search: async (searchTerm) => {
    try {
      const products = await productService.search(searchTerm)
      return {
        success: true,
        data: products,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al buscar productos',
      }
    }
  },

  getByType: async (type) => {
    try {
      const products = await productService.getByType(type)
      return {
        success: true,
        data: products,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al filtrar productos por tipo',
      }
    }
  },

  getBySize: async (size) => {
    try {
      const products = await productService.getBySize(size)
      return {
        success: true,
        data: products,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al filtrar productos por talla',
      }
    }
  },

  create: async (productData) => {
    try {
      const product = await productService.create(productData)
      return {
        success: true,
        data: product,
        message: 'Producto creado exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear producto',
      }
    }
  },

  update: async (id, productData) => {
    try {
      const product = await productService.update(id, productData)
      return {
        success: true,
        data: product,
        message: 'Producto actualizado exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar producto',
      }
    }
  },

  delete: async (id) => {
    try {
      await productService.delete(id)
      return {
        success: true,
        message: 'Producto eliminado exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar producto',
      }
    }
  },

  validateProductForm: (formData) => {
    const errors = {}

    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres'
    }

    if (!formData.description || formData.description.trim().length < 10) {
      errors.description = 'La descripción debe tener al menos 10 caracteres'
    }

    if (!formData.quantity || formData.quantity < 0) {
      errors.quantity = 'La cantidad no puede ser negativa'
    }

    if (!formData.price || formData.price <= 0) {
      errors.price = 'El precio debe ser mayor a 0'
    }

    if (!formData.size || formData.size.trim().length === 0) {
      errors.size = 'Debe especificar una talla'
    }

    if (!formData.tipe || formData.tipe.trim().length === 0) {
      errors.tipe = 'Debe seleccionar un tipo'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  },
}

export default productController
