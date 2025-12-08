import api from './api';

const adminService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Users
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },

  // Sellers
  getAllSellers: async (params = {}) => {
    const response = await api.get('/admin/sellers', { params });
    return response.data;
  },

  getSellerById: async (sellerId) => {
    const response = await api.get(`/admin/sellers/${sellerId}`);
    return response.data;
  },

  verifySeller: async (sellerId, data) => {
    const response = await api.put(`/admin/sellers/${sellerId}/verify`, data);
    return response.data;
  },

  updateSellerStatus: async (sellerId, isActive) => {
    const response = await api.put(`/admin/sellers/${sellerId}/status`, { isActive });
    return response.data;
  },

  // Products
  getAllProducts: async (params = {}) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  deleteProduct: async (productId) => {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  },

  // Orders
  getAllOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  // Analytics
  getAnalytics: async (params = {}) => {
    const response = await api.get('/admin/analytics', { params });
    return response.data;
  },

  // Returns
  getReturns: async (params = {}) => {
    const response = await api.get('/admin/returns', { params });
    return response.data;
  },

  updateReturnStatus: async (orderId, data) => {
    const response = await api.put(`/admin/returns/${orderId}`, data);
    return response.data;
  },

  // Sales Reports
  getSalesReports: async (params = {}) => {
    const response = await api.get('/admin/reports/sales', { params });
    return response.data;
  },

  // Customers
  getCustomers: async (params = {}) => {
    const response = await api.get('/admin/customers', { params });
    return response.data;
  },

  // Payments
  getPayments: async (params = {}) => {
    const response = await api.get('/admin/payments', { params });
    return response.data;
  },

  // Earnings
  getEarnings: async (params = {}) => {
    const response = await api.get('/admin/earnings', { params });
    return response.data;
  },

  // Reviews
  getReviews: async (params = {}) => {
    const response = await api.get('/admin/reviews', { params });
    return response.data;
  },

  deleteReview: async (reviewId) => {
    const response = await api.delete(`/admin/reviews/${reviewId}`);
    return response.data;
  },

  // Shipping
  getShipments: async (params = {}) => {
    const response = await api.get('/admin/shipping', { params });
    return response.data;
  },

  updateShipment: async (orderId, data) => {
    const response = await api.put(`/admin/shipping/${orderId}`, data);
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await api.put('/admin/settings', data);
    return response.data;
  },

  // KYC
  getKYCSubmissions: async (params = {}) => {
    const response = await api.get('/admin/kyc', { params });
    return response.data;
  },

  // Seller Management
  getSellerManagement: async (params = {}) => {
    const response = await api.get('/admin/seller-management', { params });
    return response.data;
  },

  // Support
  submitSupportTicket: async (data) => {
    const response = await api.post('/admin/support', data);
    return response.data;
  }
};

export default adminService;
