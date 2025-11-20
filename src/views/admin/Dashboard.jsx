import { Link } from 'react-router-dom';
import { Users, Package, MessageSquare, Star, Sparkles, Shield, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
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
        .scale-in {
          animation: scaleIn 0.4s ease-out;
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

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12 slide-up">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-2xl shadow-xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Panel de Administración</h1>
          <p className="text-slate-600 text-lg">Gestiona tu tienda desde aquí</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/users"
            className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 scale-in group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Users size={32} className="text-purple-600" />
                </div>
                <ArrowRight className="w-6 h-6 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-purple-600 transition-colors duration-300">Usuarios</h2>
              <p className="text-slate-600">Gestionar usuarios del sistema</p>
            </div>
          </Link>

          <Link
            to="/admin/products"
            className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 scale-in group relative overflow-hidden"
            style={{animationDelay: '0.1s'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Package size={32} className="text-indigo-600" />
                </div>
                <ArrowRight className="w-6 h-6 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">Productos</h2>
              <p className="text-slate-600">Gestionar catálogo de productos</p>
            </div>
          </Link>

          <Link
            to="/admin/comments"
            className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 scale-in group relative overflow-hidden"
            style={{animationDelay: '0.2s'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare size={32} className="text-blue-600" />
                </div>
                <ArrowRight className="w-6 h-6 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-blue-600 transition-colors duration-300">Comentarios</h2>
              <p className="text-slate-600">Moderar comentarios de productos</p>
            </div>
          </Link>

          <Link
            to="/admin/evaluations"
            className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 scale-in group relative overflow-hidden"
            style={{animationDelay: '0.3s'}}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Star size={32} className="text-yellow-600" />
                </div>
                <ArrowRight className="w-6 h-6 text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-yellow-600 transition-colors duration-300">Evaluaciones</h2>
              <p className="text-slate-600">Ver evaluaciones de productos</p>
            </div>
          </Link>
        </div>

        <div className="flex justify-center gap-8 opacity-30 mt-12">
          <Sparkles className="w-6 h-6 text-purple-600 float-animation" />
          <Sparkles className="w-8 h-8 text-pink-500 float-animation" style={{animationDelay: '0.3s'}} />
          <Sparkles className="w-6 h-6 text-purple-600 float-animation" style={{animationDelay: '0.6s'}} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
