import imageService from '../services/imageService'

const imageController = {
  getByProductId: async (productId) => {
    try {
      const images = await imageService.getByProductId(productId)
      return {
        success: true,
        data: images,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.mensaje || 'Error al obtener imágenes',
        data: [],
      }
    }
  },

  uploadImage: async (productId, imageFile) => {
    try {
      const result = await imageService.uploadImage(productId, imageFile)
      return {
        success: true,
        data: result,
        message: 'Imagen subida exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.mensaje || 'Error al subir imagen',
      }
    }
  },

  deleteImage: async (imageId) => {
    try {
      await imageService.deleteImage(imageId)
      return {
        success: true,
        message: 'Imagen eliminada exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.mensaje || 'Error al eliminar imagen',
      }
    }
  },

  validateImageFile: (file) => {
    const errors = []

    if (!file) {
      errors.push('Debe seleccionar un archivo')
      return { isValid: false, errors }
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      errors.push('El archivo debe ser una imagen (JPG, PNG, GIF, WEBP)')
    }

    const maxSize = 5 * 1024 * 1024 
    if (file.size > maxSize) {
      errors.push('La imagen no debe superar los 5MB')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },
}

export default imageController
