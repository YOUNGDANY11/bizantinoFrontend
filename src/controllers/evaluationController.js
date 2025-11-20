import evaluationService from '../services/evaluationService'

const evaluationController = {
  getAll: async () => {
    try {
      const evaluations = await evaluationService.getAll()
      return {
        success: true,
        data: evaluations,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar evaluaciones',
      }
    }
  },

  getUserEvaluations: async () => {
    try {
      const evaluations = await evaluationService.getUserEvaluations()
      return {
        success: true,
        data: evaluations,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar evaluaciones del usuario',
      }
    }
  },

  getByProduct: async (productId) => {
    try {
      const evaluations = await evaluationService.getByProduct(productId)
      return {
        success: true,
        data: evaluations,
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar evaluaciones del producto',
      }
    }
  },

  create: async (evaluationData) => {
    try {
      const evaluation = await evaluationService.create(evaluationData)
      return {
        success: true,
        data: evaluation,
        message: 'Evaluación creada exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear evaluación',
      }
    }
  },

  update: async (id, evaluationData) => {
    try {
      const evaluation = await evaluationService.update(id, evaluationData)
      return {
        success: true,
        data: evaluation,
        message: 'Evaluación actualizada exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar evaluación',
      }
    }
  },

  delete: async (id) => {
    try {
      await evaluationService.delete(id)
      return {
        success: true,
        message: 'Evaluación eliminada exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar evaluación',
      }
    }
  },

  calculateAverage: (evaluations) => {
    if (!evaluations || evaluations.length === 0) return 0
    
    const sum = evaluations.reduce((acc, evaluation) => acc + evaluation.assessment, 0)
    return (sum / evaluations.length).toFixed(1)
  },

  validateEvaluationForm: (formData) => {
    const errors = {}

    if (!formData.assessment || formData.assessment < 1 || formData.assessment > 5) {
      errors.assessment = 'La calificación debe ser entre 1 y 5'
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

export default evaluationController
