import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import imageController from '../controllers/imageController';
import Footer from '../components/Footer.jsx';
import { Search, ShoppingCart, Filter, Package, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const Products = () => {
  const navigate = useNavigate();
  const { products, loading, fetchProducts, searchProducts } = useProduct();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [message, setMessage] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productImages, setProductImages] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setAllProducts(products);
    setFilteredProducts(products);
    loadProductImages(products);
  }, [products]);

  const loadProductImages = async (productsList) => {
    const imagesMap = {};
    for (const product of productsList) {
      try {
        const result = await imageController.getByProductId(product.id_product);
        if (result.success && result.data.length > 0) {
          imagesMap[product.id_product] = result.data[0];
        }
      } catch (error) {
        console.error(`Error cargando imágenes del producto ${product.id_product}:`, error);
      }
    }
    setProductImages(imagesMap);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchProducts(searchTerm);
      setSelectedType('');
    } else {
      fetchProducts();
      setSelectedType('');
    }
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    
    if (type) {
      const filtered = allProducts.filter(product => 
        product.tipe.toLowerCase() === type.toLowerCase()
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  };

  const handleAddToCart = async (productId) => {
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
      await addToCart(productId, 1);
      await Swal.fire({
        icon: 'success',
        title: '¡Producto agregado!',
        text: 'El producto se agregó a tu carrito exitosamente',
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-slate-600 font-semibold">Cargando productos...</p>
        </div>
      </div>
    );
  }

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
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-pink-500 rounded-full float-animation" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-10 slide-up">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-2xl shadow-xl">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Nuestros Productos</h1>
          <p className="text-slate-600 text-lg">Descubre nuestra colección exclusiva</p>
        </div>

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

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 slide-up" style={{animationDelay: '0.1s'}}>
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-slate-900 placeholder-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                >
                  Buscar
                </button>
              </div>
            </form>

            <div className="relative md:w-64">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-slate-900 appearance-none bg-white cursor-pointer"
                value={selectedType}
                onChange={handleTypeChange}
              >
                <option value="">Todos los tipos</option>
                <option value="blusas">Blusas</option>
                <option value="pantalones">Pantalones</option>
                <option value="faldas">Faldas</option>
                <option value="medias">Medias</option>
                <option value="zapatillas">Zapatillas</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id_product} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 scale-in group"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <Link to={`/products/${product.id_product}`}>
                <div className="h-56 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden relative">
                  {productImages[product.id_product] ? (
                    <img
                      src={`http://localhost:3000/${productImages[product.id_product].image_url}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300?text=Sin+imagen';
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <Package className="w-16 h-16 text-slate-300 mx-auto mb-2" />
                      <span className="text-slate-400 font-medium">Sin imagen</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {product.tipe}
                  </div>
                </div>
              </Link>
              
              <div className="p-5">
                <Link to={`/products/${product.id_product}`}>
                  <h3 className="font-bold text-lg mb-2 text-slate-800 hover:text-purple-600 transition-colors duration-300 line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-slate-600 text-sm mb-3 line-clamp-2 h-10">
                  {product.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium">
                    Talla: {product.size}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 text-xs rounded-lg font-medium ${
                    product.quantity > 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    Stock: {product.quantity}
                  </span>
                </div>
                
                <div className="mb-4">
                  <span className="text-2xl font-bold gradient-text">
                    ${product.price.toLocaleString()}
                  </span>
                </div>
                
                <button
                  onClick={() => handleAddToCart(product.id_product)}
                  disabled={product.quantity === 0}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                    product.quantity > 0
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.quantity > 0 ? 'Agregar al carrito' : 'Sin stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-16 slide-up">
            <div className="inline-block bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl mb-4">
              <Package className="w-20 h-20 text-purple-400 mx-auto" />
            </div>
            <p className="text-slate-500 text-xl font-semibold mb-2">No se encontraron productos</p>
            <p className="text-slate-400">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
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

export default Products;
