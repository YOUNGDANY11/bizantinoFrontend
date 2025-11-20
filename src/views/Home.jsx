
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Phone, MapPin, Clock, Instagram, ChevronDown, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (idx) => {
    setFavorites(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        .glow-animation {
          animation: glow 2s ease-in-out infinite;
        }
        .slide-left {
          animation: slideInLeft 0.8s ease-out;
        }
        .slide-right {
          animation: slideInRight 0.8s ease-out;
        }
        .slide-up {
          animation: slideUp 0.6s ease-out;
        }
        .pulse-scale-animation {
          animation: pulse-scale 2s ease-in-out infinite;
        }
        .btn-hover-scale {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .btn-hover-scale:hover {
          transform: scale(1.1) translateY(-3px);
        }
        .btn-hover-glow {
          transition: all 0.3s ease;
        }
        .btn-hover-glow:hover {
          box-shadow: 0 10px 40px rgba(168, 85, 247, 0.4);
        }
        .product-card-hover {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .product-card-hover:hover {
          transform: translateY(-15px) rotateX(5deg);
        }
        .icon-bounce {
          transition: all 0.3s ease;
        }
        .icon-bounce:hover {
          animation: pulse-scale 0.6s ease-in-out;
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
        }
        .gradient-text {
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

    

      <section id="inicio" className="pt-32 pb-20 px-4 text-center bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full float-animation"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full float-animation" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="slide-left mb-6">
            <Sparkles className="w-16 h-16 mx-auto mb-4 animate-spin" style={{animationDuration: '3s'}} />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 slide-up">
            Bizantino Boutique
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-95 slide-right">
            Descubre una colección exclusiva de moda diseñada para realzar tu estilo personal. Estilo, elegancia y comodidad en cada prenda.
          </p>
          <Link to="/products" className="bg-white text-purple-600 font-bold py-4 px-10 rounded-full transition duration-300 btn-hover-scale btn-hover-glow inline-flex items-center gap-2 text-lg">
            Explorar Colección
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </Link>
        </div>
      </section>

      <section id="sobrenosotros" className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="slide-left">
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl h-96 flex items-center justify-center shadow-2xl glow-animation">
              <div className="text-white text-center">
                <ShoppingBag className="w-32 h-32 mx-auto mb-4 opacity-80 float-animation" />
                <p className="text-lg font-semibold">Moda Exclusiva</p>
              </div>
            </div>
          </div>
          
          <div className="slide-right">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 gradient-text">Sobre Bizantino Boutique</h2>
            <p className="text-slate-700 mb-4 text-lg leading-relaxed">
              En Bizantino Boutique nos dedicamos a ofrecer prendas de alta calidad que combinan elegancia, comodidad y estilo contemporáneo.
            </p>
            <p className="text-slate-700 mb-6 text-lg leading-relaxed">
              Cada pieza de nuestra colección es cuidadosamente seleccionada para asegurar que nuestros clientes luzcan impecables en cualquier ocasión.
            </p>
            <div className="space-y-4">
              {[
                'Prendas de alta calidad',
                'Diseños exclusivos y modernos',
                'Atención personalizada',
                'Variedad de estilos para todos'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 group cursor-pointer hover:translate-x-2 transition-transform">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform">✓</span>
                  <span className="text-slate-700 font-medium group-hover:text-purple-600 transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

<section id="productos" className="max-w-6xl mx-auto px-4 py-20">
  <div className="text-center mb-12 slide-up">
    <h2 className="text-4xl font-bold text-slate-900 mb-4 gradient-text">Nuestras Colecciones</h2>
    <p className="text-slate-600 text-lg">Explora nuestras categorías exclusivas</p>
  </div>
  
  <div className="grid md:grid-cols-3 gap-8">
    {[
      { 
        name: 'Casual Chic', 
        desc: 'Prendas cómodas para el día',
        color: 'from-blue-400 to-blue-600',
        icon: '👔',
        image: '/img/chaqueta.jpeg' 
      },
      { 
        name: 'Elegancia Formal', 
        desc: 'Diseños sofisticados',
        color: 'from-purple-400 to-purple-600',
        icon: '✨',
        image: '/img/falda de jean.png'
      },
      { 
        name: 'Premium Collection', 
        desc: 'Edición limitada exclusiva',
        color: 'from-pink-400 to-red-600',
        icon: '👑',
        image: '/img/faldas.jpeg'
      },
    ].map((product, idx) => (
      <div 
        key={idx} 
        className="bg-white rounded-2xl overflow-hidden shadow-lg product-card-hover hover:shadow-2xl cursor-pointer relative group"
        onMouseEnter={() => setHoveredProduct(idx)}
        onMouseLeave={() => setHoveredProduct(null)}
      >
        
        <div className="relative h-64 overflow-hidden">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className={`bg-gradient-to-br ${product.color} h-full flex items-center justify-center`}>
              <div className="text-6xl opacity-50 float-animation">{product.icon}</div>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">{product.name}</h3>
          <p className="text-slate-600 mb-4 text-sm">{product.desc}</p>

          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 hover:scale-125 transition-transform" />
            ))}
          </div>

          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg transition font-semibold btn-hover-scale shadow-lg relative overflow-hidden group/btn">
            <span className="relative z-10">Ver Detalles</span>
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
          </button>
        </div>
      </div>
    ))}
  </div>
</section>


      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-12 slide-up gradient-text">¿Por Qué Elegirnos?</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: 'Calidad Premium', desc: 'Materiales finos y duraderos', emoji: '💎' },
            { title: 'Diseños Exclusivos', desc: 'Colecciones únicas', emoji: '🎨' },
            { title: 'Atención Personal', desc: 'Servicio al cliente excepcional', emoji: '🤝' },
            { title: 'Ubicaciones Estratégicas', desc: 'Fácil acceso en Soacha', emoji: '📍' },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer border-2 border-transparent hover:border-purple-400"
            >
              <div className="text-5xl font-bold text-purple-600 mb-4 group-hover:scale-125 transition-transform duration-300 icon-bounce">{item.emoji}</div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg group-hover:text-purple-600 transition-colors">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="locales" className="max-w-6xl mx-auto px-4 py-20">
  <h2 className="text-4xl font-bold text-center text-slate-900 mb-12 slide-up gradient-text">
    Ubícanos
  </h2>

  <div className="grid md:grid-cols-2 gap-8">

    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 group slide-left">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <ShoppingBag className="w-32 h-32 float-animation" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} />
        </div>
        <h3 className="text-2xl font-bold mb-2 relative z-10">Local 1</h3>
        <p className="opacity-90 relative z-10">Centro</p>
      </div>

      <div className="p-8 space-y-6">

        <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
          <div className="p-3 bg-purple-100 rounded-lg group-hover/item:bg-purple-200 transition-colors">
            <MapPin className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Dirección</p>
            <p className="text-slate-700">Carrera 7ma # 15 - 18</p>
          </div>
        </div>

        <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
          <div className="p-3 bg-purple-100 rounded-lg group-hover/item:bg-purple-200 transition-colors">
            <Phone className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Teléfono</p>
            <p className="text-slate-700">3214141192</p>
          </div>
        </div>

        <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
          <div className="p-3 bg-purple-100 rounded-lg group-hover/item:bg-purple-200 transition-colors">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Horario</p>
            <p className="text-slate-700">Lunes a Domingo</p>
            <p className="text-slate-700">9:00 AM - 8:00 PM</p>
          </div>
        </div>

        <button
          onClick={() =>
            window.open(
              "https://www.google.com/maps/search/?api=1&query=Carrera+7+15-18+Centro",
              "_blank"
            )
          }
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg transition font-semibold btn-hover-scale shadow-lg relative overflow-hidden group/btn"
        >
          <span className="relative z-10">Obtener Indicaciones</span>
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
        </button>

      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 group slide-right">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <ShoppingBag className="w-32 h-32 float-animation" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animationDelay: '0.5s'}} />
        </div>
        <h3 className="text-2xl font-bold mb-2 relative z-10">Local 2</h3>
        <p className="opacity-90 relative z-10">CC Soacha Plaza</p>
      </div>

      <div className="p-8 space-y-6">

        <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
          <div className="p-3 bg-purple-100 rounded-lg group-hover/item:bg-purple-200 transition-colors">
            <MapPin className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Dirección</p>
            <p className="text-slate-700">CC Soacha Plaza</p>
            <p className="text-slate-700">Calle 13 # 6 03 Local 108</p>
          </div>
        </div>

        <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
          <div className="p-3 bg-purple-100 rounded-lg group-hover/item:bg-purple-200 transition-colors">
            <Phone className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Teléfono</p>
            <p className="text-slate-700">3214141192</p>
          </div>
        </div>

        <div className="flex items-start gap-4 group/item hover:translate-x-2 transition-transform">
          <div className="p-3 bg-purple-100 rounded-lg group-hover/item:bg-purple-200 transition-colors">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Horario</p>
            <p className="text-slate-700">Lunes a Domingo</p>
            <p className="text-slate-700">10:00 AM - 9:00 PM</p>
          </div>
        </div>

        <button
          onClick={() =>
            window.open(
              "https://www.google.com/maps/search/?api=1&query=Calle+13+6-03+Soacha+Plaza+Local+108",
              "_blank"
            )
          }
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg transition font-semibold btn-hover-scale shadow-lg relative overflow-hidden group/btn"
        >
          <span className="relative z-10">Obtener Indicaciones</span>
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500"></div>
        </button>

      </div>
    </div>

  </div>
</section>


<section id="contacto" className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white py-20 px-4 relative overflow-hidden">
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full float-animation"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full float-animation" style={{animationDelay: '0.7s'}}></div>
  </div>
  
  <div className="max-w-6xl mx-auto text-center relative z-10">
    <h2 className="text-4xl md:text-5xl font-bold mb-6 slide-up">¿Listo para Lucir Bien?</h2>
    <p className="text-lg mb-10 opacity-90 slide-down max-w-2xl mx-auto">
      Visítanos en cualquiera de nuestros locales o contáctanos para más información. ¡Te estamos esperando!
    </p>

    <div className="flex flex-col md:flex-row gap-6 justify-center slide-up">
      
      <button 
        onClick={() => window.location.href = 'tel:3214141192'}
        className="bg-white text-purple-600 font-bold py-4 px-8 rounded-full hover:bg-slate-100 transition flex items-center justify-center gap-3 btn-hover-scale btn-hover-glow text-lg shadow-xl"
      >
        <Phone className="w-6 h-6" />
        Llamar: 3214141192
      </button>

      <a
        href="https://wa.me/573214141192"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white font-bold py-4 px-8 rounded-full hover:bg-green-600 transition flex items-center justify-center gap-3 btn-hover-scale btn-hover-glow text-lg shadow-xl"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-6 h-6" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.62 0 .34 5.28.34 11.77a11.7 11.7 0 0 0 1.58 5.87L0 24l6.54-1.71a11.93 11.93 0 0 0 5.5 1.37h.01c6.43 0 11.7-5.28 11.7-11.77a11.65 11.65 0 0 0-3.23-8.41zM12.05 21.3a9.53 9.53 0 0 1-4.85-1.32l-.35-.21-3.88 1.02 1.04-3.78-.23-.39a9.45 9.45 0 0 1-1.42-5c0-5.24 4.27-9.5 9.5-9.5a9.46 9.46 0 0 1 6.73 2.78 9.4 9.4 0 0 1 2.78 6.72c0 5.24-4.26 9.5-9.5 9.5zm5.54-7.12c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.47-1.74-1.64-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.59-.91-2.18-.24-.58-.49-.5-.66-.51l-.56-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.1 4.49.71.31 1.27.5 1.7.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.31.17-1.42-.08-.12-.27-.2-.57-.35z"/>
        </svg>
        WhatsApp
      </a>

      <a 
        href="https://www.instagram.com/bizantino_boutique?igsh=cjVhZTZvYnVhZWxu" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="border-3 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-purple-500 transition flex items-center justify-center gap-3 btn-hover-scale btn-hover-glow text-lg shadow-xl"
      >
        <Instagram className="w-6 h-6" />
        Síguenos en Instagram
      </a>

    </div>
  </div>
</section>


      <Footer />
    </div>
  );
}