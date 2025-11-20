import { useEffect, useState } from 'react';
import { Search, X, Users, Trash2, Shield, UserCheck, Sparkles, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import userController from '../../controllers/userController';
import Swal from 'sweetalert2';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
    setCurrentPage(1);
  }, [users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await userController.getAll();
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByEmail = async () => {
    if (!searchEmail.trim()) {
      setFilteredUsers(users);
      return;
    }

    try {
      setLoading(true);
      const result = await userController.getByEmail(searchEmail);
      if (result.success) {
        const usersData = Array.isArray(result.data) ? result.data : [result.data];
        setFilteredUsers(usersData);
        setCurrentPage(1);
        if (usersData.length === 0) {
          setMessage('No se encontraron usuarios con ese email');
          setTimeout(() => setMessage(''), 3000);
        }
      } else {
        setFilteredUsers([]);
        setMessage(result.error || 'No se encontraron usuarios');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setFilteredUsers([]);
      setMessage(error.response?.data?.mensaje || 'Error al buscar usuarios');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchEmail('');
    setFilteredUsers(users);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await userController.delete(id);
        if (deleteResult.success) {
          await Swal.fire({
            icon: 'success',
            title: '¡Usuario eliminado!',
            text: deleteResult.data?.mensaje || 'El usuario ha sido eliminado exitosamente',
            confirmButtonColor: '#9333ea',
            confirmButtonText: 'Aceptar',
            timer: 2000,
            timerProgressBar: true
          });
          loadUsers();
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error al eliminar',
            text: deleteResult.error || 'No se pudo eliminar el usuario',
            confirmButtonColor: '#9333ea',
            confirmButtonText: 'Entendido'
          });
        }
      } catch (error) {
        const backendMessage = error.response?.data?.mensaje || error.response?.data?.message;
        const errorMessage = backendMessage || 'Error al eliminar usuario';
        await Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: errorMessage,
          confirmButtonColor: '#9333ea',
          confirmButtonText: 'Entendido'
        });
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-slate-600 font-semibold">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-10 slide-up">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-2xl shadow-xl">
              <Users className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Gestión de Usuarios</h1>
          <p className="text-slate-600 text-lg">Administra los usuarios del sistema</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg shadow-lg flex items-center gap-3 scale-in ${
            message.includes('Error') || message.includes('No se') 
              ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200' 
              : 'bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200'
          }`}>
            {message.includes('Error') || message.includes('No se') ? (
              <XCircle className="w-6 h-6 text-red-600" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
            <p className={`font-semibold ${
              message.includes('Error') || message.includes('No se') ? 'text-red-700' : 'text-green-700'
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Buscar por Email
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchByEmail()}
                    placeholder="Ingresa email a buscar..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-slate-900 placeholder-slate-400"
                  />
                </div>
                <button
                  onClick={handleSearchByEmail}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                >
                  <Search size={18} />
                  Buscar
                </button>
                {searchEmail && (
                  <button
                    onClick={handleClearSearch}
                    className="px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all duration-300 font-semibold flex items-center gap-2"
                  >
                    <X size={18} />
                    Limpiar
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Usuarios por página
              </label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-slate-900 font-medium"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={150}>150</option>
              </select>
            </div>
          </div>

          <div className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <p className="text-sm font-semibold text-purple-700">
              Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredUsers.length)} de {filteredUsers.length} usuarios
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden slide-up" style={{animationDelay: '0.4s'}}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {currentUsers.map((user, index) => (
                  <tr key={user.id_user} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                      #{user.id_user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-2 rounded-lg">
                          <UserCheck className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">
                          {user.name} {user.lastname}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <span className="px-2 py-1 bg-slate-100 rounded-lg font-medium">
                        {user.document_type}
                      </span>
                      <span className="ml-1">{user.document_number}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      {user.phone_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-bold rounded-lg ${
                        user.role === 'Admin' 
                          ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-300' 
                          : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300'
                      }`}>
                        {user.role === 'Admin' && <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(user.id_user)}
                        className="inline-flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 font-semibold"
                        title="Eliminar usuario"
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

        {totalPages > 1 && (
          <div className="bg-white px-6 py-4 flex items-center justify-between rounded-2xl shadow-xl mt-6 slide-up" style={{animationDelay: '0.6s'}}>
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center gap-2 px-4 py-2 border-2 border-purple-300 text-sm font-semibold rounded-lg text-slate-700 bg-white hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center gap-2 px-4 py-2 border-2 border-purple-300 text-sm font-semibold rounded-lg text-slate-700 bg-white hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Página <span className="text-purple-600 font-bold">{currentPage}</span> de{' '}
                  <span className="text-purple-600 font-bold">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center gap-1 px-3 py-2 rounded-l-lg border-2 border-purple-300 bg-white text-sm font-semibold text-slate-700 hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border-2 text-sm font-bold transition-all duration-300 ${
                            currentPage === pageNumber
                              ? 'z-10 bg-gradient-to-r from-purple-600 to-purple-700 border-purple-600 text-white shadow-lg'
                              : 'bg-white border-purple-300 text-slate-700 hover:bg-purple-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 3 ||
                      pageNumber === currentPage + 3
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="relative inline-flex items-center px-4 py-2 border-2 border-purple-300 bg-white text-sm font-semibold text-slate-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center gap-1 px-3 py-2 rounded-r-lg border-2 border-purple-300 bg-white text-sm font-semibold text-slate-700 hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-xl slide-up">
            <div className="inline-block bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl mb-4">
              <Users className="w-20 h-20 text-purple-400" />
            </div>
            <p className="text-slate-500 text-xl font-semibold mb-2">No se encontraron usuarios</p>
            <p className="text-slate-400">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}

        <div className="flex justify-center gap-8 opacity-30 mt-12">
          <Sparkles className="w-6 h-6 text-purple-600 float-animation" />
          <Sparkles className="w-8 h-8 text-pink-500 float-animation" style={{animationDelay: '0.3s'}} />
          <Sparkles className="w-6 h-6 text-purple-600 float-animation" style={{animationDelay: '0.6s'}} />
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
