import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import commentController from '../controllers/commentController';
import evaluationController from '../controllers/evaluationController';
import Footer from '../components/Footer.jsx';
import { ShoppingCart, ArrowLeft, Star, StarHalf, MessageCircle, Send, Trash2, Package, Sparkles, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProduct, loading, fetchProductById } = useProduct();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [fromAdmin, setFromAdmin] = useState(false);
  const [showEvaluations, setShowEvaluations] = useState(false);

  useEffect(() => {
    fetchProductById(id);
    setSelectedImageIndex(0);
    if (location.state?.fromAdmin) {
      setFromAdmin(true);
    }
  }, [id]);

  const handleGoBack = () => {
    if (fromAdmin) {
      navigate('/admin/products');
    } else {
      navigate('/products');
    }
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      await Swal.fire({
        icon: 'warning',
        title: 'Sesión requerida',
        text: 'Debes iniciar sesión para agregar productos al carrito',
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'Ir a iniciar sesión',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    try {
      await addToCart(id, quantity);
      await Swal.fire({
        icon: 'success',
        title: '¡Producto agregado!',
        text: `Se agregaron ${quantity} unidad(es) a tu carrito`,
        timer: 1500,
        showConfirmButton: false,
        backdrop: `rgba(147, 51, 234, 0.1)`
      });
    } catch (error) {
      const backendMessage = error.response?.data?.mensaje || error.response?.data?.message;
      const errorMessage = backendMessage || error.message || 'Error al agregar al carrito';
      
      if (errorMessage.includes('ya está en el carrito')) {
        await Swal.fire({
          icon: 'info',
          title: 'Producto ya agregado',
          text: 'Este producto ya está en tu carrito. Puedes ajustar la cantidad desde el carrito.',
          confirmButtonColor: '#9333ea',
          confirmButtonText: 'Ver carrito',
          showCancelButton: true,
          cancelButtonText: 'Continuar comprando'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/cart');
          }
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Error al agregar',
          text: errorMessage,
          confirmButtonColor: '#9333ea',
          confirmButtonText: 'Entendido'
        });
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      await Swal.fire({
        icon: 'warning',
        title: 'Sesión requerida',
        text: 'Debes iniciar sesión para dejar un comentario',
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'Ir a iniciar sesión',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }
    try {
      await commentController.create({
        id_product: parseInt(id),
        id_user: user.id,
        comment: newComment,
      });
      setNewComment('');
      await Swal.fire({
        icon: 'success',
        title: '¡Gracias por tu comentario!',
        text: 'Tu opinión es muy valiosa para nosotros y para otros compradores',
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'Genial',
        timer: 3000,
        timerProgressBar: true
      });
      fetchProductById(id);
    } catch (error) {
      const backendMessage = error.response?.data?.mensaje || error.response?.data?.message;
      const errorMessage = backendMessage || 'Error al agregar comentario';
      await Swal.fire({
        icon: 'error',
        title: 'Error al comentar',
        text: errorMessage,
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'Entendido'
      });
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      await Swal.fire({
        icon: 'warning',
        title: 'Sesión requerida',
        text: 'Debes iniciar sesión para evaluar este producto',
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'Ir a iniciar sesión',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }
    try {
      await evaluationController.create({
        id_product: parseInt(id),
        id_user: user.id,
        assessment: newRating,
        comment: '' 
      });
      await Swal.fire({
        icon: 'success',
        title: '¡Gracias por tu valoración!',
        html: `Has calificado este producto con <strong>${newRating} estrella${newRating !== 1 ? 's' : ''}</strong>.<br>¡Tu opinión nos ayuda a mejorar!`,
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'Excelente',
        timer: 3000,
        timerProgressBar: true
      });
      setNewRating(5);
      fetchProductById(id);
    } catch (error) {
      const backendMessage = error.response?.data?.mensaje || error.response?.data?.message;
      const errorMessage = backendMessage || 'Error al agregar evaluación';
      await Swal.fire({
        icon: 'error',
        title: 'Error al evaluar',
        text: errorMessage,
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'Entendido'
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('¿Estás seguro de eliminar este comentario?')) {
      try {
        const result = await commentController.delete(commentId);
        if (result.success) {
          setMessage('Comentario eliminado exitosamente');
          setTimeout(() => setMessage(''), 3000);
          fetchProductById(id);
        } else {
          setMessage(result.error || 'Error al eliminar comentario');
          setTimeout(() => setMessage(''), 3000);
        }
      } catch (error) {
        setMessage('Error al eliminar comentario');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleDeleteEvaluation = async (evaluationId) => {
    if (window.confirm('¿Estás seguro de eliminar esta evaluación?')) {
      try {
        const result = await evaluationController.delete(evaluationId);
        if (result.success) {
          setMessage('Evaluación eliminada exitosamente');
          setTimeout(() => setMessage(''), 3000);
          fetchProductById(id);
        } else {
          setMessage(result.error || 'Error al eliminar evaluación');
          setTimeout(() => setMessage(''), 3000);
        }
      } catch (error) {
        setMessage('Error al eliminar evaluación');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.id : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-slate-600 font-semibold">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl">
          <Package className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <p className="text-xl font-semibold text-slate-600 mb-4">Producto no encontrado</p>
          <button onClick={handleGoBack} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-lg">
            <ArrowLeft className="w-5 h-5" />
            Volver a productos
          </button>
        </div>
      </div>
    );
  }

  const averageRating = currentProduct.evaluations && currentProduct.evaluations.length > 0
    ? Number(evaluationController.calculateAverage(currentProduct.evaluations)) || 0
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        .slide-up {
          animation: slideUp 0.6s ease-out;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-600 rounded-full float-animation"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-600 rounded-full float-animation" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <button onClick={handleGoBack} className="inline-flex items-center gap-2 mb-6 px-4 py-2 text-purple-600 hover:text-white hover:bg-purple-600 border-2 border-purple-600 rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg slide-up">
          <ArrowLeft className="w-5 h-5" />
          Volver a productos
        </button>

        {message && (
          <div className={`mb-6 p-4 rounded-lg shadow-lg flex items-center gap-3 scale-in ${
            message.includes('Error') || message.includes('Debes') 
              ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200' 
              : 'bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200'
          }`}>
            {message.includes('Error') || message.includes('Debes') ? (
              <XCircle className="w-6 h-6 text-red-600" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
            <p className={`font-semibold ${
              message.includes('Error') || message.includes('Debes') ? 'text-red-700' : 'text-green-700'
            }`}>
              {message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="w-full slide-up">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl w-full aspect-square flex items-center justify-center mb-4 overflow-hidden shadow-xl">
              {currentProduct.images && currentProduct.images.length > 0 ? (
                <img
                  src={`http://localhost:3000/${currentProduct.images[selectedImageIndex].image_url || currentProduct.images[selectedImageIndex].url}`}
                  alt={currentProduct.name}
                  className="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x600?text=Sin+imagen';
                  }}
                />
              ) : (
                <div className="text-center">
                  <Package className="w-24 h-24 text-slate-300 mx-auto mb-2" />
                  <span className="text-slate-400 font-medium">Sin imagen</span>
                </div>
              )}
            </div>

            {currentProduct?.images && currentProduct.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2">
                {currentProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg aspect-square overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedImageIndex === index
                        ? 'border-purple-600 ring-2 ring-purple-300 shadow-lg'
                        : 'border-slate-300 hover:border-purple-400'
                    }`}
                  >
                    <img
                      src={`http://localhost:3000/${image.image_url || image.url}`}
                      alt={`${currentProduct.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=Sin+imagen';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl p-6 lg:p-8 slide-up" style={{animationDelay: '0.2s'}}>
            <h1 className="text-2xl lg:text-4xl font-bold gradient-text mb-4">{currentProduct.name}</h1>
            
            <div className="flex items-center mb-6 p-4 rounded-lg border border-yellow-200">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 mr-2" />
              <span className="font-bold">{averageRating.toFixed(1)}</span>
              <span className="text-slate-600 ml-2">
                ({currentProduct.evaluations?.length || 0} {currentProduct.evaluations?.length === 1 ? 'evaluación' : 'evaluaciones'})
              </span>
            </div>

            <p className="text-slate-700 mb-6 text-lg leading-relaxed">{currentProduct.description}</p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg border border-purple-300">
                <span className="text-sm text-slate-600 font-medium">Talla: </span>
                <span className="text-sm font-bold text-purple-700">{currentProduct.size}</span>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-pink-100 to-pink-200 rounded-lg border border-pink-300">
                <span className="text-sm text-slate-600 font-medium">Tipo: </span>
                <span className="text-sm font-bold text-pink-700">{currentProduct.tipe}</span>
              </div>
              <div className={`px-4 py-2 rounded-lg border ${
                currentProduct.quantity > 0 
                  ? 'bg-gradient-to-r from-green-100 to-green-200 border-green-300' 
                  : 'bg-gradient-to-r from-red-100 to-red-200 border-red-300'
              }`}>
                <span className="text-sm text-slate-600 font-medium">Stock: </span>
                <span className={`text-sm font-bold ${currentProduct.quantity > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {currentProduct.quantity}
                </span>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl  border-slate-200">
              <span className="text-slate-600 text-sm font-medium block mb-1">Precio</span>
              <span className="font-bold gradient-text">
                ${currentProduct.price.toLocaleString()}
              </span>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                max={currentProduct.quantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-32 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-slate-900 font-semibold"
              />
            </div>

            <button
              onClick={handleAddToCart}
              disabled={currentProduct.quantity === 0}
              className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                currentProduct.quantity > 0
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {currentProduct.quantity > 0 ? 'Agregar al carrito' : 'Sin stock'}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl slide-up mb-8" style={{animationDelay: '0.4s'}}>
          <button 
            onClick={() => setShowEvaluations(!showEvaluations)}
            className="w-full flex items-center justify-between gap-3 mb-6 hover:bg-slate-50 p-3 rounded-xl transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold gradient-text">Valoraciones</h2>
            </div>
            <ChevronDown className={`w-6 h-6 text-slate-600 transition-transform duration-300 ${showEvaluations ? 'rotate-180' : ''}`} />
          </button>
          
          {showEvaluations && (
            <div className="space-y-6 animate-fadeIn">
              <form onSubmit={handleRatingSubmit} className="p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="font-semibold text-slate-700">Tu calificación:</label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(parseInt(e.target.value))}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-slate-900 font-medium"
              >
                <option value="5">★★★★★ (5)</option>
                <option value="4">★★★★☆ (4)</option>
                <option value="3">★★★☆☆ (3)</option>
                <option value="2">★★☆☆☆ (2)</option>
                <option value="1">★☆☆☆☆ (1)</option>
              </select>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Evaluar
              </button>
            </div>
          </form>

          {currentProduct.evaluations && currentProduct.evaluations.length > 0 ? (
            <div className="space-y-4">
              {currentProduct.evaluations.map((evaluation) => (
                <div key={evaluation.id_product_evaluation} className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-500 text-lg mr-2">
                          {'★'.repeat(evaluation.assessment)}{'☆'.repeat(5 - evaluation.assessment)}
                        </span>
                        <span className="text-sm text-slate-600 font-medium">
                          {evaluation.user_name} {evaluation.user_lastname}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">
                          • {new Date(evaluation.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {evaluation.comment && (
                        <p className="text-slate-700 text-sm">{evaluation.comment}</p>
                      )}
                    </div>
                    {getCurrentUserId() === evaluation.id_user && (
                      <button
                        onClick={() => handleDeleteEvaluation(evaluation.id_product_evaluation)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-16 h-16 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No hay evaluaciones todavía</p>
              <p className="text-slate-400 text-sm">Sé el primero en evaluar este producto</p>
            </div>
          )}
            </div>
          )}
        </div>

        <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl slide-up" style={{animationDelay: '0.6s'}}>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-3 rounded-xl">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold gradient-text">Comentarios</h2>
          </div>
          
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario sobre este producto..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-slate-900 placeholder-slate-400 resize-none"
              rows="4"
              required
            />
            <button
              type="submit"
              className="mt-3 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Send className="w-5 h-5" />
              Comentar
            </button>
          </form>

          {currentProduct.comments && currentProduct.comments.length > 0 ? (
            <div className="space-y-4">
              {currentProduct.comments.map((comment) => (
                <div key={comment.id_comment} className="p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-slate-800 mb-3 leading-relaxed">{comment.comment}</p>
                      <div className="flex items-center text-sm text-slate-600">
                        <span className="font-semibold">
                          {comment.user_name} {comment.user_lastname}
                        </span>
                        <span className="mx-2 text-slate-400">•</span>
                        <span className="text-slate-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {getCurrentUserId() === comment.id_user && (
                      <button
                        onClick={() => handleDeleteComment(comment.id_comment)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No hay comentarios todavía</p>
              <p className="text-slate-400 text-sm">Sé el primero en comentar</p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-8 opacity-30 mt-12">
          <Sparkles className="w-6 h-6 text-purple-600 float-animation" />
          <Sparkles className="w-8 h-8 text-pink-500 float-animation" style={{animationDelay: '0.3s'}} />
          <Sparkles className="w-6 h-6 text-purple-600 float-animation" style={{animationDelay: '0.6s'}} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
