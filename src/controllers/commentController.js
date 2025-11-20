import commentService from '../services/commentService'

const commentController = {
  getAll: async () => {
    try {
      const comments = await commentService.getAll()
      return {
        success: true,
        data: comments,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar comentarios',
      }
    }
  },

  getUserComments: async () => {
    try {
      const comments = await commentService.getUserComments()
      return {
        success: true,
        data: comments,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar comentarios del usuario',
      }
    }
  },

  getByProduct: async (productId) => {
    try {
      const comments = await commentService.getByProduct(productId)
      return {
        success: true,
        data: comments,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar comentarios del producto',
      }
    }
  },

  create: async (commentData) => {
    try {
      const comment = await commentService.create(commentData)
      return {
        success: true,
        data: comment,
        message: 'Comentario creado exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear comentario',
      }
    }
  },

  update: async (id, commentData) => {
    try {
      const comment = await commentService.update(id, commentData)
      return {
        success: true,
        data: comment,
        message: 'Comentario actualizado exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar comentario',
      }
    }
  },

  delete: async (id) => {
    try {
      await commentService.delete(id)
      return {
        success: true,
        message: 'Comentario eliminado exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar comentario',
      }
    }
  },

  validateCommentForm: (formData) => {
    const errors = {}

    if (!formData.comment || formData.comment.trim().length < 3) {
      errors.comment = 'El comentario debe tener al menos 3 caracteres'
    }

    if (formData.comment && formData.comment.length > 500) {
      errors.comment = 'El comentario no puede exceder 500 caracteres'
    }

    if (!formData.id_product) {
      errors.id_product = 'Debe seleccionar un producto'
    }

    if (!formData.id_user) {
      errors.id_user = 'Debe estar autenticado'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  },
}

export default commentController
