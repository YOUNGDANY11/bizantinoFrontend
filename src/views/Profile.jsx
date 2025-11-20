import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import userController from '../controllers/userController';
import Footer from '../components/Footer.jsx';
import { User, Mail, Phone, MapPin, FileText, Shield, Edit, Save, X, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const result = await userController.getActive();
      if (result.success) {
        setProfile(result.data);
        setAddress(result.data.address || '');
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const validation = userController.validateAddressForm(address);
    if (!validation.isValid) {
      setErrors(validation.errors);
      await Swal.fire({
        icon: 'warning',
        title: 'Dirección inválida',
        text: validation.errors.address || 'Por favor ingresa una dirección válida',
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    try {
      const result = await userController.updateAddress(address);
      if (result.success) {
        setProfile(result.data);
        setEditing(false);
        await Swal.fire({
          icon: 'success',
          title: '¡Dirección actualizada!',
          text: 'Tu información de dirección ha sido actualizada exitosamente',
          confirmButtonColor: '#9333ea',
          confirmButtonText: 'Perfecto',
          timer: 2500,
          timerProgressBar: true
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: result.error || 'No se pudo actualizar la dirección',
          confirmButtonColor: '#9333ea',
          confirmButtonText: 'Entendido'
        });
      }
    } catch (error) {
      const backendMessage = error.response?.data?.mensaje || error.response?.data?.message;
      const errorMessage = backendMessage || 'Error al actualizar dirección';
      await Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: errorMessage,
        confirmButtonColor: '#9333ea',
        confirmButtonText: 'Entendido'
      });
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
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

      <div className="flex-grow container mx-auto px-4 py-8 max-w-3xl relative z-10 pt-24">
        <div className="slide-up text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-4 rounded-2xl shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
            Mi Perfil
          </h1>
          <p className="text-slate-600 text-lg">Gestiona tu información personal</p>
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

        <div className="slide-up bg-white p-8 rounded-2xl shadow-2xl border border-slate-200" style={{ animationDelay: '0.3s' }}>
          {!editing ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-500">Nombre completo</label>
                  <p className="text-xl font-bold text-slate-900">{profile?.name} {profile?.lastname}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-500">Email</label>
                  <p className="text-lg text-slate-900">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-500">Documento</label>
                  <p className="text-lg text-slate-900">{profile?.document_type} {profile?.document_number}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-xl">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-500">Teléfono</label>
                  <p className="text-lg text-slate-900">{profile?.phone_number || 'No registrado'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-500">Ciudad</label>
                  <p className="text-lg text-slate-900">{profile?.city || 'No registrada'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-500">Dirección</label>
                  <p className="text-lg text-slate-900">{profile?.address || 'No registrada'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
                <div className="bg-gradient-to-br from-slate-500 to-slate-700 p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-500">Rol</label>
                  <div className="mt-1">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full text-sm font-bold shadow-lg">
                      {profile?.role}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Edit className="w-5 h-5" />
                Actualizar Dirección
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 p-5 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-500 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-yellow-900">
                      <strong>Nota:</strong> Solo puedes actualizar tu dirección. Para cambiar otros datos, contacta al administrador.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Dirección *
                </label>
                <textarea
                  name="address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors({});
                  }}
                  rows="4"
                  className={`w-full px-4 py-3 border-2 ${
                    errors.address ? 'border-red-300' : 'border-purple-200'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gradient-to-r from-white to-purple-50`}
                  placeholder="Ingresa tu dirección completa (calle, número, ciudad, código postal...)"
                />
                {errors.address && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="w-4 h-4" />
                    <p>{errors.address}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                  Guardar Dirección
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setAddress(profile.address || '');
                    setErrors({});
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-200 text-slate-700 py-3 rounded-xl hover:bg-slate-300 transition-all duration-300 font-bold"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="flex justify-center gap-8 opacity-30 mt-8">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <Sparkles className="w-8 h-8 text-pink-400" />
          <Sparkles className="w-6 h-6 text-purple-400" />
        </div>
      </div>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
