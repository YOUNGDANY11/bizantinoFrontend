import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer.jsx';
import imageController from '../controllers/imageController';
import { ShoppingCart, Trash2, Plus, Minus, Package, CreditCard, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, loading, fetchCartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [productImages, setProductImages] = useState({});

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      loadProductImages(cartItems);
    }
  }, [cartItems]);

  const loadProductImages = async (items) => {
    const imagesMap = {};
    for (const item of items) {
      if (item.id_product) {
        try {
          const result = await imageController.getByProductId(item.id_product);
          if (result.success && result.data.length > 0) {
            imagesMap[item.id_product] = result.data[0];
          }
        } catch (error) {
          console.error(`Error cargando imágenes del producto ${item.id_product}:`, error);
        }
      }
    }
    setProductImages(imagesMap);
  };

  const handleQuantityChange = async (id, newQuantity) => {
    const item = cartItems.find(i => i.id_cart_item === id);
    if (newQuantity > 0 && (!item?.stock || newQuantity <= item.stock)) {
      try {
        await updateQuantity(id, newQuantity);
      } catch (error) {
        console.error('Error al actualizar cantidad:', error);
      }
    } else if (item?.stock && newQuantity > item.stock) {
      alert(`Solo hay ${item.stock} unidades disponibles`);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-slate-600 font-semibold">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center p-8 lg:p-12 bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div className="inline-block bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl mb-6">
            <ShoppingCart className="w-20 h-20 text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-3">Tu carrito está vacío</h2>
          <p className="text-slate-600 mb-6">¡Descubre nuestra colección y encuentra algo especial!</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            Ver productos
          </Link>
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
      </div>

      <div className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-10 slide-up">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-2xl shadow-xl">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Carrito de Compras</h1>
          <p className="text-slate-600 text-lg">{cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div 
                key={item.id_cart_item} 
                className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 scale-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-28 h-28 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex-shrink-0 overflow-hidden group">
                    {productImages[item.id_product] ? (
                      <img
                        src={`http://localhost:3000/${productImages[item.id_product].image_url}`}
                        alt={item.product_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.id_product}`}
                      className="text-lg font-bold text-slate-800 hover:text-purple-600 transition-colors duration-300 block mb-2"
                    >
                      {item.product_name || `Producto #${item.id_product}`}
                    </Link>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.size && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium">
                          Talla: {item.size}
                        </span>
                      )}
                      {item.tipe && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg font-medium">
                          {item.tipe}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-2xl font-bold gradient-text">
                      ${item.price ? Number(item.price).toLocaleString() : '0'}
                    </p>
                  </div>

                  <div className="flex sm:flex-col justify-between sm:justify-between items-center sm:items-end gap-4">
                    <button
                      onClick={() => handleRemove(item.id_cart_item)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                      title="Eliminar del carrito"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(item.id_cart_item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-9 h-9 flex items-center justify-center border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      >
                        <Minus className="w-4 h-4 text-purple-600" />
                      </button>
                      <span className="w-12 text-center font-bold text-lg text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id_cart_item, item.quantity + 1)}
                        disabled={item.stock && item.quantity >= item.stock}
                        className="w-9 h-9 flex items-center justify-center border-2 border-purple-300 rounded-lg hover:bg-purple-50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      >
                        <Plus className="w-4 h-4 text-purple-600" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1">Subtotal</p>
                      <p className="text-xl font-bold gradient-text">
                        ${item.price ? (Number(item.price) * item.quantity).toLocaleString() : '0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl sticky top-4 slide-up" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-3 rounded-xl">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold gradient-text">Resumen</h2>
              </div>
              
              <div className="space-y-3 mb-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-800">${getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Envío</span>
                  <span className="font-bold text-slate-800">Por calcular</span>
                </div>
              </div>

              <div className="border-t-2 border-purple-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-700">Total</span>
                  <span className="text-3xl font-bold gradient-text">${getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
              >
                <CreditCard className="w-6 h-6" />
                Proceder al pago
              </button>

              <Link
                to="/products"
                className="flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-300"
              >
                Continuar comprando
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
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

export default Cart;
