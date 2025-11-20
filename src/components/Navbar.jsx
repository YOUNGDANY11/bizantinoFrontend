import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isAdminRoute = () => {
    return location.pathname.startsWith('/admin');
  };

  const handleNavClick = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminNavClick = () => {
    setAdminMenuOpen(false);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" onClick={handleNavClick} className="flex items-center gap-2 group flex-shrink-0">
            <div className="float-animation">
              <div className="text-lg sm:text-xl font-bold text-slate-800">Bizantino</div>
              <div className="text-xs font-semibold text-purple-600">BOUTIQUE</div>
            </div>
          </Link>
          
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden btn-hover-scale p-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            {menuOpen ? <X size={24} className="text-purple-600" /> : <Menu size={24} className="text-purple-600" />}
          </button>
          
          <div className={`${menuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row gap-4 lg:gap-6 absolute lg:relative top-16 lg:top-0 left-0 right-0 bg-white lg:bg-transparent p-6 lg:p-0 shadow-lg lg:shadow-none slide-up items-stretch lg:items-center border-t lg:border-t-0 border-slate-200 max-h-[calc(100vh-4rem)] overflow-y-auto lg:overflow-visible`}>
          <Link 
            to="/"
            onClick={handleNavClick}
            className={`transition duration-300 font-medium relative group py-2 lg:py-0 px-3 lg:px-0 rounded-lg ${
              isActive('/') 
                ? 'text-purple-600 bg-purple-50 lg:bg-transparent font-bold' 
                : 'hover:text-purple-600 hover:bg-purple-50 lg:hover:bg-transparent'
            }`}
          >
            Inicio
            <span className={`hidden lg:block absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ${
              isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'
            }`}></span>
          </Link>
          
          <Link 
            to="/products"
            onClick={handleNavClick}
            className={`transition duration-300 font-medium relative group py-2 lg:py-0 px-3 lg:px-0 rounded-lg ${
              isActive('/products') 
                ? 'text-purple-600 bg-purple-50 lg:bg-transparent font-bold' 
                : 'hover:text-purple-600 hover:bg-purple-50 lg:hover:bg-transparent'
            }`}
          >
            Productos
            <span className={`hidden lg:block absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ${
              isActive('/products') ? 'w-full' : 'w-0 group-hover:w-full'
            }`}></span>
          </Link>

          {isAuthenticated() ? (
            <>
              {user?.role === 'Admin' && (
                <div className="relative w-full lg:w-auto">
                  <button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    className={`transition duration-300 font-medium flex items-center gap-2 py-2 lg:py-0 px-3 lg:px-0 rounded-lg w-full lg:w-auto justify-between lg:justify-start ${
                      isAdminRoute() 
                        ? 'text-purple-600 bg-purple-50 lg:bg-transparent font-bold' 
                        : 'hover:text-purple-600 hover:bg-purple-50 lg:hover:bg-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Settings size={18} />
                      <span>Admin</span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {adminMenuOpen && (
                    <div className="lg:absolute static lg:top-full lg:left-0 lg:mt-2 w-full lg:w-48 bg-white lg:rounded-lg lg:shadow-lg py-2 z-50 lg:border border-slate-200">
                      <Link
                        to="/admin"
                        onClick={handleAdminNavClick}
                        className={`block px-4 py-2 text-sm transition rounded-lg mx-2 lg:mx-0 ${
                          isActive('/admin') 
                            ? 'bg-purple-100 text-purple-700 font-bold' 
                            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                        }`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/users"
                        onClick={handleAdminNavClick}
                        className={`block px-4 py-2 text-sm transition rounded-lg mx-2 lg:mx-0 ${
                          isActive('/admin/users') 
                            ? 'bg-purple-100 text-purple-700 font-bold' 
                            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                        }`}
                      >
                        Usuarios
                      </Link>
                      <Link
                        to="/admin/products"
                        onClick={handleAdminNavClick}
                        className={`block px-4 py-2 text-sm transition rounded-lg mx-2 lg:mx-0 ${
                          isActive('/admin/products') 
                            ? 'bg-purple-100 text-purple-700 font-bold' 
                            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                        }`}
                      >
                        Productos
                      </Link>
                      <Link
                        to="/admin/comments"
                        onClick={handleAdminNavClick}
                        className={`block px-4 py-2 text-sm transition rounded-lg mx-2 lg:mx-0 ${
                          isActive('/admin/comments') 
                            ? 'bg-purple-100 text-purple-700 font-bold' 
                            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                        }`}
                      >
                        Comentarios
                      </Link>
                      <Link
                        to="/admin/evaluations"
                        onClick={handleAdminNavClick}
                        className={`block px-4 py-2 text-sm transition rounded-lg mx-2 lg:mx-0 ${
                          isActive('/admin/evaluations') 
                            ? 'bg-purple-100 text-purple-700 font-bold' 
                            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                        }`}
                      >
                        Evaluaciones
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <Link 
                to="/cart"
                onClick={handleNavClick}
                className={`transition duration-300 font-medium relative group flex items-center gap-2 py-2 lg:py-0 px-3 lg:px-0 rounded-lg ${
                  isActive('/cart') 
                    ? 'text-purple-600 bg-purple-50 lg:bg-transparent font-bold' 
                    : 'hover:text-purple-600 hover:bg-purple-50 lg:hover:bg-transparent'
                }`}
              >
                <ShoppingCart size={18} />
                <span>Carrito</span>
                {getCartItemsCount() > 0 && (
                  <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 ml-auto lg:ml-0">
                    {getCartItemsCount()}
                  </span>
                )}
                <span className={`hidden lg:block absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ${
                  isActive('/cart') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>

              <Link 
                to="/profile"
                onClick={handleNavClick}
                className={`transition duration-300 font-medium relative group flex items-center gap-2 py-2 lg:py-0 px-3 lg:px-0 rounded-lg ${
                  isActive('/profile') 
                    ? 'text-purple-600 bg-purple-50 lg:bg-transparent font-bold' 
                    : 'hover:text-purple-600 hover:bg-purple-50 lg:hover:bg-transparent'
                }`}
              >
                <User size={18} />
                <span className="truncate">{user?.name || 'Perfil'}</span>
                <span className={`hidden lg:block absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ${
                  isActive('/profile') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>

              <button
                onClick={handleLogout}
                className="hover:text-purple-600 transition duration-300 font-medium relative group flex items-center gap-2 py-2 lg:py-0 hover:bg-purple-50 lg:hover:bg-transparent px-3 lg:px-0 rounded-lg w-full lg:w-auto text-left lg:text-center"
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                onClick={handleNavClick}
                className={`transition duration-300 font-medium relative group py-2 lg:py-0 px-3 lg:px-0 rounded-lg text-center ${
                  isActive('/login') 
                    ? 'text-purple-600 bg-purple-50 lg:bg-transparent font-bold' 
                    : 'hover:text-purple-600 hover:bg-purple-50 lg:hover:bg-transparent'
                }`}
              >
                Iniciar Sesión
                <span className={`hidden lg:block absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ${
                  isActive('/login') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>

              <Link 
                to="/register"
                onClick={handleNavClick}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 lg:px-4 lg:py-2 rounded-lg hover:from-purple-700 hover:to-pink-600 transition duration-300 font-semibold text-center shadow-lg hover:shadow-xl"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
        </div>
      </div>
    </nav>
  );
}
