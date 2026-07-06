const BASE_URL = 'http://localhost:5001/api';

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('coso_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json().catch(() => ({}));
}

export const api = {
  // Auth
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (name, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/me');
  },

  updateProfile: async (profileData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  changePassword: async (oldPassword, newPassword) => {
    return apiRequest('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword })
    });
  },

  // Addresses
  saveAddress: async (address) => {
    return apiRequest('/auth/addresses', {
      method: 'POST',
      body: JSON.stringify(address)
    });
  },

  deleteAddress: async (id) => {
    return apiRequest(`/auth/addresses/${id}`, {
      method: 'DELETE'
    });
  },

  // Products
  getProducts: async () => {
    return apiRequest('/products');
  },

  getProduct: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  getReviews: async (productId) => {
    return apiRequest(`/products/${productId}/reviews`);
  },

  addReview: async (productId, reviewData) => {
    return apiRequest(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  },

  likeReview: async (productId, reviewId) => {
    return apiRequest(`/products/${productId}/reviews/${reviewId}/like`, {
      method: 'PUT'
    });
  },

  // Orders
  getOrders: async () => {
    return apiRequest('/orders');
  },

  createOrder: async (orderData) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  cancelOrder: async (orderId) => {
    return apiRequest(`/orders/${orderId}/cancel`, {
      method: 'PUT'
    });
  },

  // Coupon
  validateCoupon: async (code) => {
    return apiRequest('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  },

  // Admin APIs
  getAnalytics: async () => {
    return apiRequest('/admin/analytics');
  },

  getAdminOrders: async () => {
    return apiRequest('/admin/orders');
  },

  updateOrderStatus: async (orderId, status) => {
    return apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  createProduct: async (productData) => {
    return apiRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  updateProduct: async (productMongoId, productData) => {
    return apiRequest(`/admin/products/${productMongoId}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  },

  deleteProduct: async (productMongoId) => {
    return apiRequest(`/admin/products/${productMongoId}`, {
      method: 'DELETE'
    });
  },

  createCoupon: async (code, discountPercent) => {
    return apiRequest('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify({ code, discountPercent })
    });
  },

  deleteCoupon: async (couponMongoId) => {
    return apiRequest(`/admin/coupons/${couponMongoId}`, {
      method: 'DELETE'
    });
  }
};
