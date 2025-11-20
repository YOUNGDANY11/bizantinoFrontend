import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authController from '../controllers/authController';
import Footer from '../components/Footer.jsx';
import { UserPlus, Eye, EyeOff, Sparkles, ShoppingBag } from 'lucide-react';
import Swal from 'sweetalert2';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    document_type: 'CC',
    document_number: '',
    phone_number: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const validation = authController.validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      
      let errorTitle = 'Formulario incompleto';
      let errorText = 'Por favor completa todos los campos correctamente';
      
      if (validation.errors.confirmPassword) {
        errorTitle = 'Las contraseñas no coinciden';
        errorText = 'Por favor verifica que ambas contraseñas sean iguales';
      } else if (validation.errors.password) {
        errorTitle = 'Contraseña inválida';
        errorText = validation.errors.password;
      } else if (validation.errors.email) {
        errorTitle = 'Email inválido';
        errorText = validation.errors.email;
      } else if (validation.errors.name || validation.errors.lastname) {
        errorTitle = 'Datos personales incompletos';
        errorText = 'Por favor completa tu nombre y apellido correctamente';
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
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      
      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: result.message || 'Tu cuenta ha sido creada. Redirigiendo al login...',
          timer: 2000,
          showConfirmButton: false,
          backdrop: `rgba(147, 51, 234, 0.1)`
        });
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 0);
      } else {
        const errorMessage = result.error || result.message || 'Error al registrar usuario';
        await Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: errorMessage,
          confirmButtonColor: '#9333ea',
          confirmButtonText: 'Intentar de nuevo'
        });
        setServerError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || 'Error inesperado al registrar usuario';
      
      await Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: errorMessage,
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'Intentar de nuevo'
      });
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md w-full bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-2xl border-2 border-green-200">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-2xl shadow-xl">
              <ShoppingBag className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">¡Registro exitoso!</h2>
          <p className="text-green-700 text-center text-lg">Redirigiendo al inicio de sesión...</p>
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

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-600 rounded-full float-animation"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-600 rounded-full float-animation" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/2 right-10 w-24 h-24 bg-pink-500 rounded-full float-animation" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-2xl w-full space-y-8 relative z-10">
          <div className="text-center slide-up">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-2xl shadow-2xl glow-animation">
                <UserPlus className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold gradient-text mb-2">
              Únete a Nosotros
            </h2>
            <p className="text-slate-600 text-lg">
              Crea tu cuenta en Bizantino Boutique
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 slide-up" style={{animationDelay: '0.2s'}}>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {serverError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 slide-up">
                  <p className="text-sm text-red-800 text-center">{serverError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className={`block w-full px-4 py-3 border ${
                      errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-purple-500 focus:border-purple-500'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 text-slate-900 placeholder-slate-400`}
                    placeholder="Juan"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="lastname" className="block text-sm font-semibold text-slate-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    className={`block w-full px-4 py-3 border ${
                      errors.lastname ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-purple-500 focus:border-purple-500'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 text-slate-900 placeholder-slate-400`}
                    placeholder="Pérez"
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                  {errors.lastname && <p className="mt-2 text-sm text-red-600">{errors.lastname}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Correo Electrónico *
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
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
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
                  <p className="mt-1 text-xs text-slate-500">Mínimo 6 caracteres</p>
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className={`block w-full px-4 py-3 pr-12 border ${
                        errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-purple-500 focus:border-purple-500'
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 text-slate-900 placeholder-slate-400`}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors duration-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                <div>
                  <label htmlFor="document_type" className="block text-sm font-semibold text-slate-700 mb-2">
                    Tipo de Documento
                  </label>
                  <select
                    id="document_type"
                    name="document_type"
                    className="block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-slate-900"
                    value={formData.document_type}
                    onChange={handleChange}
                  >
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PAS">Pasaporte</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="document_number" className="block text-sm font-semibold text-slate-700 mb-2">
                    Número de Documento *
                  </label>
                  <input
                    id="document_number"
                    name="document_number"
                    type="text"
                    required
                    className="block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-slate-900 placeholder-slate-400"
                    placeholder="123456789"
                    value={formData.document_number}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-sm font-semibold text-slate-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    required
                    className="block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-slate-900 placeholder-slate-400"
                    placeholder="3001234567"
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    className="block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-slate-900 placeholder-slate-400"
                    placeholder="Bogotá"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    className="block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-slate-900 placeholder-slate-400"
                    placeholder="Calle 123 # 45-67"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Registrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Crear Cuenta
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-slate-600">
                ¿Ya tienes una cuenta?{' '}
                <Link 
                  to="/login" 
                  className="font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-300"
                >
                  Inicia sesión aquí
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

export default Register;
