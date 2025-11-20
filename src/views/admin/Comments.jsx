import { useEffect, useState } from 'react';
import { MessageSquare, Trash2, Filter, CheckCircle, XCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import commentController from '../../controllers/commentController';
import Swal from 'sweetalert2';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedType, setSelectedType] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const productTypes = [
    { value: 'todos', label: 'Todos los productos' },
    { value: 'blusas', label: 'Blusas' },
    { value: 'pantalones', label: 'Pantalones' },
    { value: 'faldas', label: 'Faldas' },
    { value: 'medias', label: 'Medias' },
    { value: 'zapatillas', label: 'Zapatillas' },
    { value: 'accesorios', label: 'Accesorios' },
  ];

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const result = await commentController.getAll();
      if (result.success) {
        setComments(result.data);
        setFilteredComments(result.data);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setComments([]);
      setFilteredComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedType === 'todos') {
      setFilteredComments(comments);
    } else {
      const filtered = comments.filter(comment => 
        comment.product_tipe?.toLowerCase() === selectedType.toLowerCase()
      );
      setFilteredComments(filtered);
    }
    setCurrentPage(1); // Reset a la primera página al cambiar filtro
  }, [selectedType, comments]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComments = filteredComments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);

  const getCommentsByType = () => {
    const grouped = {};
    productTypes.forEach(type => {
      if (type.value !== 'todos') {
        grouped[type.value] = comments.filter(comment => 
          comment.product_tipe?.toLowerCase() === type.value.toLowerCase()
        ).length;
      }
    });
    return grouped;
  };

  const commentCounts = getCommentsByType();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar comentario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#ffffff',
      backdrop: 'rgba(0, 0, 0, 0.4)'
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await commentController.delete(id);
        if (deleteResult.success) {
          await Swal.fire({
            title: '¡Eliminado!',
            text: deleteResult.data?.mensaje || deleteResult.mensaje || 'Comentario eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#9333ea',
            timer: 2000,
            timerProgressBar: true
          });
          loadComments();
        } else {
          Swal.fire({
            title: 'Error',
            text: deleteResult.error || deleteResult.mensaje || 'Error al eliminar comentario',
            icon: 'error',
            confirmButtonColor: '#9333ea'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.mensaje || error.response?.data?.message || 'Error al eliminar comentario',
          icon: 'error',
          confirmButtonColor: '#9333ea'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 py-8 px-4">
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

      <div className="fixed top-20 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 float-animation"></div>
      <div className="fixed bottom-20 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 float-animation" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto relative z-10">
        <div className="slide-up flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-4 rounded-2xl shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Gestión de Comentarios
              </h1>
              <p className="text-slate-600 mt-1">Total: {comments.length} comentarios</p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`slide-up mb-6 p-4 rounded-xl shadow-lg flex items-center gap-3 ${
            message.includes('Error') 
              ? 'bg-red-50 border border-red-200 text-red-700' 
              : 'bg-green-50 border border-green-200 text-green-700'
          }`} style={{ animationDelay: '0.2s' }}>
            {message.includes('Error') ? (
              <XCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        {/* Filtros y estadísticas */}
        <div className="slide-up grid grid-cols-1 md:grid-cols-7 gap-4 mb-6" style={{ animationDelay: '0.3s' }}>
          {productTypes.map((type, index) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 shadow-lg ${
                selectedType === type.value
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700 shadow-purple-200'
                  : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-purple-100'
              }`}
              style={{ animationDelay: `${0.4 + index * 0.05}s` }}
            >
              <div className="text-sm font-semibold">{type.label}</div>
              <div className="text-3xl font-bold mt-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {type.value === 'todos' ? comments.length : (commentCounts[type.value] || 0)}
              </div>
            </button>
          ))}
        </div>

        {/* Selector de items por página */}
        <div className="slide-up mb-6 flex justify-between items-center bg-white rounded-xl shadow-lg p-4 border border-slate-200" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-slate-700">Mostrar:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border-2 border-purple-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gradient-to-r from-white to-purple-50"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={150}>150</option>
            </select>
            <span className="text-sm text-slate-600">comentarios por página</span>
          </div>
          <div className="text-sm font-medium text-slate-600 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-lg">
            Mostrando <span className="font-bold text-purple-700">{indexOfFirstItem + 1}</span> a <span className="font-bold text-purple-700">{Math.min(indexOfLastItem, filteredComments.length)}</span> de <span className="font-bold text-purple-700">{filteredComments.length}</span> comentarios
          </div>
        </div>

        <div className="slide-up bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200" style={{ animationDelay: '0.5s' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                    Comentario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {currentComments.map((comment) => (
                  <tr key={comment.id_comment} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      #{comment.id_comment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xs">
                          {comment.user_name ? comment.user_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span>
                          {comment.user_name && comment.user_lastname 
                            ? `${comment.user_name} ${comment.user_lastname}`
                            : `Usuario #${comment.id_user}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 max-w-xs">
                      <div className="truncate font-medium">{comment.product_name || `Producto #${comment.id_product}`}</div>
                      {comment.product_tipe && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                          {comment.product_tipe}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 max-w-md">
                      <div className="line-clamp-3">{comment.comment}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(comment.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(comment.id_comment)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 border border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredComments.length === 0 && (
          <div className="slide-up text-center py-16 bg-white rounded-2xl shadow-lg border border-slate-200" style={{ animationDelay: '0.5s' }}>
            <MessageSquare className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg font-medium">
              {comments.length === 0 
                ? 'No hay comentarios registrados' 
                : `No hay comentarios para ${productTypes.find(t => t.value === selectedType)?.label.toLowerCase()}`}
            </p>
          </div>
        )}

        {/* Paginación */}
        {filteredComments.length > 0 && totalPages > 1 && (
          <div className="slide-up mt-8 flex justify-center items-center gap-2" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 border-2 border-purple-300 rounded-lg text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md ${
                      currentPage === pageNumber
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white border-purple-600'
                        : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 border-2 border-purple-300 rounded-lg text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex justify-center gap-8 opacity-30 mt-12">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <Sparkles className="w-8 h-8 text-pink-400" />
          <Sparkles className="w-6 h-6 text-purple-400" />
        </div>
      </div>
    </div>
  );
};

export default AdminComments;
