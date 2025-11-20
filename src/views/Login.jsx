import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authController from '../controllers/authController';
import Footer from '../components/Footer.jsx';
import { ShoppingBag, Eye, EyeOff, Sparkles, LogIn } from 'lucide-react';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validation = authController.validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      
      let errorTitle = 'Formulario incompleto';
      let errorText = 'Por favor completa todos los campos correctamente';
      
      if (validation.errors.password) {
        errorTitle = 'Contraseña requerida';
        errorText = validation.errors.password;
      } else if (validation.errors.email) {
        errorTitle = 'Email requerido';
        errorText = validation.errors.email;
      }
      
      await Swal.fire({
        icon: 'warning',
        title: errorTitle,
        text: errorText,
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await login(formData);
      
      if (result.success !== false) {
        await Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión exitosamente',
          timer: 1500,
          showConfirmButton: false,
          backdrop: `rgba(147, 51, 234, 0.1)`
        });
        navigate('/');
      }
    } catch (error) {
      const backendMessage = error.response?.data?.mensaje || error.response?.data?.message;
      const errorMessage = backendMessage || error.message || 'Error al iniciar sesión';
      
      await Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: errorMessage,
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'Intentar de nuevo'
      });
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-600 rounded-full float-animation"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-600 rounded-full float-animation" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/2 right-10 w-24 h-24 bg-pink-500 rounded-full float-animation" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center slide-up">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-2xl shadow-2xl glow-animation">
                <ShoppingBag className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold gradient-text mb-2">
              Bienvenido de Nuevo
            </h2>
            <p className="text-slate-600 text-lg">
              Inicia sesión en Bizantino Boutique
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 slide-up" style={{animationDelay: '0.2s'}}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {serverError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 slide-up">
                  <p className="text-sm text-red-800 text-center">{serverError}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`block w-full px-4 py-3 border ${
                    errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-purple-500 focus:border-purple-500'
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 text-slate-900 placeholder-slate-400`}
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className={`block w-full px-4 py-3 pr-12 border ${
                      errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-purple-500 focus:border-purple-500'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 text-slate-900 placeholder-slate-400`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-slate-600">
                ¿No tienes una cuenta?{' '}
                <Link 
                  to="/register" 
                  className="font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-300"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-8 opacity-30">
            <Sparkles className="w-6 h-6 text-purple-600 float-animation" />
            <Sparkles className="w-8 h-8 text-pink-500 float-animation" style={{animationDelay: '0.3s'}} />
            <Sparkles className="w-6 h-6 text-purple-600 float-animation" style={{animationDelay: '0.6s'}} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
