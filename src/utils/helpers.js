// Formatear precio en pesos colombianos
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
};

// Formatear fecha
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Formatear fecha corta
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('es-CO');
};

// Validar email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Truncar texto
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Obtener iniciales de nombre
export const getInitials = (name, lastname = '') => {
  const firstInitial = name.charAt(0).toUpperCase();
  const lastInitial = lastname ? lastname.charAt(0).toUpperCase() : '';
  return firstInitial + lastInitial;
};

// Calcular descuento
export const calculateDiscount = (originalPrice, discountPercentage) => {
  return originalPrice - (originalPrice * discountPercentage) / 100;
};

// Generar color aleatorio para avatares
export const getRandomColor = () => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Debounce para búsquedas
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validar stock disponible
export const isInStock = (stock) => {
  return stock > 0;
};

// Obtener badge de stock
export const getStockBadge = (stock) => {
  if (stock === 0) {
    return { text: 'Agotado', color: 'bg-red-100 text-red-800' };
  } else if (stock < 5) {
    return { text: 'Últimas unidades', color: 'bg-yellow-100 text-yellow-800' };
  } else {
    return { text: 'Disponible', color: 'bg-green-100 text-green-800' };
  }
};

// Calcular tiempo transcurrido
export const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' años';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' meses';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' días';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' horas';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutos';
  
  return 'Hace un momento';
};

// Validar número de teléfono colombiano
export const isValidPhone = (phone) => {
  const regex = /^3\d{9}$/;
  return regex.test(phone.replace(/\s+/g, ''));
};

// Generar rating stars
export const generateStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars,
  };
};
