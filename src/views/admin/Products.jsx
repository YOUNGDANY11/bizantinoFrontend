import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../../context/ProductContext';
import productController from '../../controllers/productController';
import imageController from '../../controllers/imageController';
import { X, Upload, Plus, Eye, Package, Trash2, Edit, Search, Filter, Sparkles, CheckCircle, XCircle, ChevronLeft, ChevronRight, Image, FileText, Tag, ShoppingBag, Hash, DollarSign, Save, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, loading, fetchProducts, deleteProduct, searchProducts, fetchProductsByType } = useProduct();
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Formulario producto, 2: Subir imágenes
  const [createdProductId, setCreatedProductId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    size: '',
    tipe: '',
    quantity: 0,
    price: 0,
  });
  const [formErrors, setFormErrors] = useState({});
  const [imageCount, setImageCount] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentProductImages, setCurrentProductImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [productThumbnails, setProductThumbnails] = useState({});
  
  const [searchName, setSearchName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      loadAllProductThumbnails();
    }
  }, [products]);

  const loadAllProductThumbnails = async () => {
    const thumbnails = {};
    for (const product of products) {
      try {
        const result = await imageController.getByProductId(product.id_product);
        if (result.success && result.data.length > 0) {
          thumbnails[product.id_product] = result.data[0];
        }
      } catch (error) {
        console.error(`Error cargando miniatura del producto ${product.id_product}`);
      }
    }
    setProductThumbnails(thumbnails);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const isLastProduct = products.length === 1;
        await deleteProduct(id);
        await Swal.fire({
          title: '¡Eliminado!',
          text: 'Producto eliminado exitosamente',
          icon: 'success',
          confirmButtonColor: '#9333ea',
          timer: 2000,
          timerProgressBar: true
        });
        
        if (isLastProduct) {
          window.location.reload();
        } else {
          await fetchProducts();
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.mensaje || error.response?.data?.message || 'Error al eliminar producto',
          icon: 'error',
          confirmButtonColor: '#9333ea'
        });
      }
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setCurrentStep(1);
    setCreatedProductId(null);
    setIsEditing(false);
    setEditingProductId(null);
    setFormData({
      name: '',
      description: '',
      size: '',
      tipe: '',
      quantity: 0,
      price: 0,
    });
    setFormErrors({});
    setImageCount(1);
    setUploadedImages([]);
    setCurrentProductImages([]);
  };

  const loadProductImages = async (productId) => {
    setLoadingImages(true);
    try {
      const result = await imageController.getByProductId(productId);
      if (result.success) {
        setCurrentProductImages(result.data);
      } else {
        setCurrentProductImages([]);
      }
    } catch (error) {
      setCurrentProductImages([]);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleEdit = async (product) => {
    setIsEditing(true);
    setEditingProductId(product.id_product);
    setFormData({
      name: product.name,
      description: product.description,
      size: product.size,
      tipe: product.tipe,
      quantity: product.quantity,
      price: product.price,
    });
    setShowModal(true);
    setCurrentStep(1);
    await loadProductImages(product.id_product);
  };

  const handleDeleteImage = async (imageId) => {
    const result = await Swal.fire({
      title: '¿Eliminar imagen?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await imageController.deleteImage(imageId);
        if (deleteResult.success) {
          await Swal.fire({
            title: '¡Eliminada!',
            text: deleteResult.data?.mensaje || deleteResult.mensaje || 'Imagen eliminada exitosamente',
            icon: 'success',
            confirmButtonColor: '#9333ea',
            timer: 1500,
            timerProgressBar: true
          });
          await loadProductImages(editingProductId);
          await fetchProducts();
        } else {
          Swal.fire({
            title: 'Error',
            text: deleteResult.error || deleteResult.mensaje || 'Error al eliminar imagen',
            icon: 'error',
            confirmButtonColor: '#9333ea'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.mensaje || error.response?.data?.message || 'Error al eliminar imagen',
          icon: 'error',
          confirmButtonColor: '#9333ea'
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = productController.validateProductForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos requeridos',
        icon: 'warning',
        confirmButtonColor: '#9333ea'
      });
      return;
    }

    setFormErrors({});

    try {
      if (isEditing) {
        const result = await productController.update(editingProductId, formData);
        if (result.success) {
          await Swal.fire({
            title: '¡Actualizado!',
            text: result.data?.mensaje || result.mensaje || 'Producto actualizado exitosamente',
            icon: 'success',
            confirmButtonColor: '#9333ea',
            timer: 2000,
            timerProgressBar: true
          });
          await fetchProducts();
          resetModal();
        } else {
          Swal.fire({
            title: 'Error',
            text: result.error || result.mensaje || 'Error al actualizar producto',
            icon: 'error',
            confirmButtonColor: '#9333ea'
          });
        }
      } else {
        const result = await productController.create(formData);
        if (result.success) {
          await Swal.fire({
            title: '¡Creado!',
            text: result.data?.mensaje || result.mensaje || 'Producto creado exitosamente. Ahora puedes subir imágenes',
            icon: 'success',
            confirmButtonColor: '#9333ea',
            timer: 2000,
            timerProgressBar: true
          });
          setCreatedProductId(result.data.producto.id_product);
          setCurrentStep(2);
          await fetchProducts();
        } else {
          Swal.fire({
            title: 'Error',
            text: result.error || result.mensaje || 'Error al crear producto',
            icon: 'error',
            confirmButtonColor: '#9333ea'
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.mensaje || error.response?.data?.message || (isEditing ? 'Error al actualizar producto' : 'Error al crear producto'),
        icon: 'error',
        confirmButtonColor: '#9333ea'
      });
    }
  };

  const handleImageUpload = async (file, index) => {
    // Validar imagen
    const validation = imageController.validateImageFile(file);
    if (!validation.isValid) {
      Swal.fire({
        title: 'Imagen inválida',
        text: validation.errors.join(', '),
        icon: 'warning',
        confirmButtonColor: '#9333ea'
      });
      return;
    }

    setUploadingImage(true);

    try {
      const productId = isEditing ? editingProductId : createdProductId;
      const result = await imageController.uploadImage(productId, file);
      if (result.success) {
        setUploadedImages(prev => [...prev, { index, data: result.data }]);
        await Swal.fire({
          title: '¡Subida!',
          text: result.data?.mensaje || result.mensaje || `Imagen ${index + 1} subida exitosamente`,
          icon: 'success',
          confirmButtonColor: '#9333ea',
          timer: 1500,
          timerProgressBar: true
        });
        if (isEditing) {
          await loadProductImages(editingProductId);
        }
        await fetchProducts();
      } else {
        Swal.fire({
          title: 'Error',
          text: result.error || result.mensaje || 'Error al subir imagen',
          icon: 'error',
          confirmButtonColor: '#9333ea'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.mensaje || error.response?.data?.message || 'Error al subir imagen',
        icon: 'error',
        confirmButtonColor: '#9333ea'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageCountChange = (count) => {
    setImageCount(Math.max(1, Math.min(10, count))); // Entre 1 y 10 imágenes
  };

  // Buscar por nombre usando endpoint del backend
  const handleSearchByName = async () => {
    if (searchName.trim()) {
      await searchProducts(searchName);
      setSelectedType('');
      setCurrentPage(1);
    } else {
      await fetchProducts();
      setCurrentPage(1);
    }
  };

  // Filtrar por tipo usando endpoint del backend
  const handleFilterByType = async (type) => {
    setSelectedType(type);
    setSearchName('');
    setCurrentPage(1);
    
    if (type) {
      await fetchProductsByType(type);
    } else {
      await fetchProducts();
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 slide-up">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-3 rounded-xl shadow-xl">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold gradient-text">Gestión de Productos</h1>
            </div>
            <p className="text-slate-600 text-lg">Administra el catálogo de productos</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg shadow-lg flex items-center gap-3 scale-in ${
            message.includes('Error') || message.includes('error')
              ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200' 
              : 'bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200'
          }`}>
            {message.includes('Error') || message.includes('error') ? (
              <XCircle className="w-6 h-6 text-red-600" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-600" />
            )}
            <p className={`font-semibold ${
              message.includes('Error') || message.includes('error') ? 'text-red-700' : 'text-green-700'
            }`}>
              {message}
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 slide-up" style={{animationDelay: '0.2s'}}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Buscar por nombre
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Nombre del producto..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchByName();
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-slate-900 placeholder-slate-400"
                  />
                </div>
                <button
                  onClick={handleSearchByName}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Buscar
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Filtrar por tipo
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <select
                  value={selectedType}
                  onChange={(e) => handleFilterByType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-slate-900 appearance-none bg-white cursor-pointer font-medium"
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

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Productos por página
              </label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-slate-900 font-medium"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={150}>150</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="text-sm font-semibold text-purple-700">
              Mostrando {products.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, products.length)} de {products.length} productos
            </div>
            {(searchName || selectedType) && (
              <button
                onClick={() => {
                  setSearchName('');
                  setSelectedType('');
                  setCurrentPage(1);
                  fetchProducts();
                }}
                className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-300 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-2 sm:p-4 md:p-6 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-2xl w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:max-w-4xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto border-2 border-slate-200 scale-in">
            <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-pink-500 px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex justify-between items-center rounded-t-2xl shadow-lg">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                {isEditing ? (
                  <><Package className="animate-pulse" size={20} /> <span className="hidden sm:inline">Editar Producto</span><span className="sm:hidden">Editar</span></>
                ) : currentStep === 1 ? (
                  <><Package size={20} /> <span className="hidden sm:inline">Crear Nuevo Producto</span><span className="sm:hidden">Crear</span></>
                ) : (
                  <><Upload size={20} /> <span className="hidden md:inline">Subir Imágenes del Producto</span><span className="md:hidden">Imágenes</span></>
                )}
              </h2>
              <button
                onClick={resetModal}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-3 sm:p-4 md:p-6">
              {currentStep === 1 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Package size={16} className="text-purple-600" />
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 ${formErrors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'}`}
                      required
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <FileText size={16} className="text-purple-600" />
                      Descripción *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={`w-full px-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 resize-none ${formErrors.description ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'}`}
                      rows="4"
                      required
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Tag size={16} className="text-purple-600" />
                        Talla *
                      </label>
                      <input
                        type="text"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 ${formErrors.size ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'}`}
                        placeholder="Ej: S, M, L, XL"
                        required
                      />
                      {formErrors.size && (
                        <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.size}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <ShoppingBag size={16} className="text-purple-600" />
                        Tipo *
                      </label>
                      <select
                        value={formData.tipe}
                        onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 ${formErrors.tipe ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'} cursor-pointer`}
                        required
                      >
                        <option value="">Selecciona un tipo</option>
                        <option value="blusas">Blusas</option>
                        <option value="pantalones">Pantalones</option>
                        <option value="faldas">Faldas</option>
                        <option value="medias">Medias</option>
                        <option value="zapatillas">Zapatillas</option>
                        <option value="accesorios">Accesorios</option>
                      </select>
                      {formErrors.tipe && (
                        <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.tipe}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Hash size={16} className="text-purple-600" />
                        Cantidad *
                      </label>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 ${formErrors.quantity ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'}`}
                        min="0"
                        required
                      />
                      {formErrors.quantity && (
                        <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.quantity}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <DollarSign size={16} className="text-purple-600" />
                        Precio *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 ${formErrors.price ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100'}`}
                        min="0"
                        placeholder="0.00"
                        required
                      />
                      {formErrors.price && (
                        <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.price}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t-2 border-slate-200 mt-6">
                    <button
                      type="button"
                      onClick={resetModal}
                      className="w-full sm:w-auto px-4 sm:px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-100 transition-all duration-300 font-semibold text-slate-700 flex items-center justify-center gap-2 hover:scale-105"
                    >
                      <X size={18} />
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      {isEditing ? (
                        <><Save size={18} /> Actualizar</>
                      ) : (
                        <><Plus size={18} /> <span className="hidden sm:inline">Crear y Continuar</span><span className="sm:hidden">Crear</span></>
                      )}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-600 transition-all duration-300 font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <Image size={18} />
                        <span className="hidden sm:inline">Gestionar Imágenes</span><span className="sm:hidden">Imágenes</span>
                      </button>
                    )}
                  </div>
                </form>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-3 sm:p-4 md:p-5 shadow-lg">
                    <p className="text-green-800 font-bold text-base sm:text-lg flex items-center gap-2">
                      <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                      <span className="break-words">{isEditing ? 'Gestión de Imágenes' : `Producto creado exitosamente (ID: ${createdProductId})`}</span>
                    </p>
                    <p className="text-green-700 text-xs sm:text-sm mt-2 ml-0 sm:ml-8">
                      {isEditing ? 'Puedes eliminar imágenes existentes o subir nuevas' : 'Ahora puedes subir imágenes para este producto'}
                    </p>
                  </div>

                  {isEditing && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Image size={20} className="text-purple-600" />
                        Imágenes Actuales
                      </h3>
                      {loadingImages ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                            {currentProductImages.map((image) => (
                              <div key={image.id_image} className="relative group">
                                <img
                                  src={`http://localhost:3000/${image.image_url}`}
                                  alt="Producto"
                                  className="w-full h-24 sm:h-28 md:h-32 object-cover rounded-xl border-2 border-slate-300 shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150?text=Sin+imagen';
                                  }}
                                />
                                <button
                                  onClick={() => handleDeleteImage(image.id_image)}
                                  className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                                  title="Eliminar imagen"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                          {currentProductImages.length === 0 && (
                            <p className="text-gray-500 text-sm">No hay imágenes para este producto</p>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  <div className="border-t-2 border-slate-200 pt-6">
                    <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                      <Upload size={20} className="text-purple-600" />
                      {isEditing ? 'Agregar Nuevas Imágenes' : 'Subir Imágenes'}
                    </h3>
                    <div className="mb-6 bg-white/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border-2 border-slate-200">
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Hash size={16} className="text-purple-600 flex-shrink-0" />
                        <span>¿Cuántas imágenes deseas subir?</span>
                      </label>
                      <input
                        type="number"
                        value={imageCount}
                        onChange={(e) => handleImageCountChange(parseInt(e.target.value) || 1)}
                        className="w-24 sm:w-32 px-3 sm:px-4 py-2 sm:py-3 border-2 border-slate-300 rounded-xl bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 font-semibold text-sm sm:text-base"
                        min="1"
                        max="10"
                      />
                      <p className="text-sm text-slate-600 mt-2 font-medium">Entre 1 y 10 imágenes</p>
                    </div>
                  </div>

                    <div className="space-y-4">
                    {Array.from({ length: imageCount }).map((_, index) => {
                      const isUploaded = uploadedImages.some(img => img.index === index);
                      
                      return (
                        <div key={index} className="border-2 border-slate-300 rounded-xl p-3 sm:p-4 md:p-5 bg-white/50 backdrop-blur-sm hover:border-purple-400 transition-all duration-300">
                          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <label className="block text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2">
                              <Image size={16} className="text-purple-600 flex-shrink-0" />
                              Imagen {index + 1}
                            </label>
                            {isUploaded && (
                              <span className="text-green-600 text-xs sm:text-sm font-bold flex items-center gap-1 bg-green-50 px-2 sm:px-3 py-1 rounded-full">
                                <CheckCircle size={14} /> Subida
                              </span>
                            )}
                          </div>
                          
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                handleImageUpload(e.target.files[0], index);
                              }
                            }}
                            disabled={uploadingImage || isUploaded}
                            className="w-full text-xs sm:text-sm text-slate-600 file:mr-2 sm:file:mr-4 file:py-2 sm:file:py-3 file:px-3 sm:file:px-5 file:rounded-xl file:border-0 file:text-xs sm:file:text-sm file:font-bold file:bg-gradient-to-r file:from-purple-50 file:to-pink-50 file:text-purple-700 hover:file:from-purple-100 hover:file:to-pink-100 file:transition-all file:duration-300 disabled:opacity-50 file:cursor-pointer"
                          />
                          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1">
                            <FileText size={12} className="text-purple-600 flex-shrink-0" />
                            <span>JPG, PNG, GIF, WEBP (máx. 5MB)</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>                  {uploadingImage && (
                    <div className="flex items-center gap-2 sm:gap-3 text-purple-600 bg-purple-50 border-2 border-purple-300 rounded-xl p-3 sm:p-4 shadow-lg">
                      <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-3 border-purple-600 flex-shrink-0"></div>
                      <span className="font-bold text-sm sm:text-base">Subiendo imagen...</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-6 border-t-2 border-slate-200 mt-6">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-100 transition-all duration-300 font-semibold text-slate-700 flex items-center gap-2 hover:scale-105"
                      >
                        <ArrowLeft size={18} />
                        Volver al Formulario
                      </button>
                    )}
                    <button
                      onClick={resetModal}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <CheckCircle size={18} />
                      Finalizar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden slide-up" style={{animationDelay: '0.4s'}}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Imagen
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Talla
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {currentProducts.map((product) => (
                  <tr key={product.id_product} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center overflow-hidden group">
                        {productThumbnails[product.id_product] ? (
                          <img
                            src={`http://localhost:3000/${productThumbnails[product.id_product].image_url}`}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/64x64?text=Sin+imagen';
                            }}
                          />
                        ) : (
                          <Image className="w-8 h-8 text-slate-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-800">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {product.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-lg font-medium">
                        {product.size}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-lg font-medium">
                        {product.tipe}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-sm rounded-lg font-bold ${
                        product.quantity > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold gradient-text">
                        ${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/products/${product.id_product}`, { state: { fromAdmin: true } })}
                          className="inline-flex items-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 font-semibold"
                          title="Ver producto"
                        >
                          <Eye size={16} />
                          Ver
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300 font-semibold"
                          title="Editar"
                        >
                          <Edit size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id_product)}
                          className="inline-flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 font-semibold"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="bg-white px-6 py-4 flex items-center justify-between rounded-b-2xl">
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
                      // Mostrar solo algunas páginas
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
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
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber} className="relative inline-flex items-center px-4 py-2 border-2 border-purple-300 bg-white text-sm font-semibold text-slate-700">...</span>;
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

export default AdminProducts;
