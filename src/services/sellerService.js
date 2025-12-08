import api from './api';

/**
 * Seller Service for profile and seller-specific operations
 */
const sellerService = {
  /**
   * Get seller profile
   * @returns {Promise} Seller profile data
   */
  getProfile: async () => {
    try {
      const response = await api.get('/sellers/profile');
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Get seller profile error:', error);
      throw error.response?.data?.message || error.message || 'Failed to get profile';
    }
  },

  /**
   * Update seller profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Updated profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/sellers/profile', profileData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Update seller profile error:', error);
      throw error.response?.data?.message || error.message || 'Failed to update profile';
    }
  },

  /**
   * Create seller profile for user
   * @param {Object} sellerData - Seller profile data
   * @returns {Promise} Created seller profile
   */
  createProfile: async (sellerData) => {
    try {
      const response = await api.post('/sellers/profile', sellerData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Create seller profile error:', error);
      throw error.response?.data?.message || error.message || 'Failed to create profile';
    }
  },

  /**
   * Get seller dashboard stats
   * @returns {Promise} Dashboard statistics
   */
  getDashboard: async () => {
    try {
      const response = await api.get('/sellers/dashboard');
      return response.data;
    } catch (error) {
      console.error('❌ Get dashboard error:', error);
      throw error.response?.data?.message || error.message || 'Failed to get dashboard';
    }
  },

  /**
   * Get seller dashboard stats (legacy)
   * @returns {Promise} Dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get('/sellers/dashboard');
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Get dashboard stats error:', error);
      throw error.response?.data?.message || error.message || 'Failed to get stats';
    }
  },

  /**
   * Get seller orders
   * @param {Object} params - Query parameters
   * @returns {Promise} Orders list
   */
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/sellers/orders', { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Get seller orders error:', error);
      throw error.response?.data?.message || error.message || 'Failed to get orders';
    }
  },

  /**
   * Get seller products
   * @param {Object} params - Query parameters
   * @returns {Promise} Products list
   */
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/sellers/products', { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Get seller products error:', error);
      throw error.response?.data?.message || error.message || 'Failed to get products';
    }
  },

  /**
   * Update product
   * @param {string} productId - Product ID
   * @param {Object} productData - Product update data
   * @returns {Promise} Updated product
   */
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/sellers/products/${productId}`, productData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Update product error:', error);
      throw error.response?.data?.message || error.message || 'Failed to update product';
    }
  },

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise} Updated order
   */
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/sellers/orders/${orderId}/status`, { status });
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Update order status error:', error);
      throw error.response?.data?.message || error.message || 'Failed to update order';
    }
  },
  
  /**
   * Add bank details
   * @param {Object} bankData - Bank account details
   * @returns {Promise} Response
   */
  addBankDetails: async (bankData) => {
    try {
      const response = await api.post('/sellers/bank-details', bankData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Add bank details error:', error);
      throw error.response?.data?.message || error.message || 'Failed to add bank details';
    }
  },

  /**
   * Get seller returns
   * @param {Object} params - Query parameters
   * @returns {Promise} Returns list
   */
  getReturns: async (params = {}) => {
    try {
      const response = await api.get('/sellers/returns', { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Get seller returns error:', error);
      throw error.response?.data?.message || error.message || 'Failed to get returns';
    }
  },

  /**
   * Update return status
   * @param {string} orderId - Order ID
   * @param {Object} data - Status data
   * @returns {Promise} Updated return
   */
  updateReturnStatus: async (orderId, data) => {
    try {
      const response = await api.put(`/sellers/returns/${orderId}`, data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Update return status error:', error);
      throw error.response?.data?.message || error.message || 'Failed to update return';
    }
  },

  /**
   * Get seller wallet details
   * @returns {Promise} Wallet data
   */
  getWallet: async () => {
    try {
      const response = await api.get('/sellers/wallet');
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Get wallet error:', error);
      throw error.response?.data?.message || error.message || 'Failed to get wallet';
    }
  },

  /**
   * Get pending payouts
   * @returns {Promise} Pending payout orders
   */
  getPendingPayouts: async () => {
    try {
      const response = await api.get('/sellers/payouts/pending');
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Get pending payouts error:', error);
      throw error.response?.data?.message || error.message || 'Failed to get pending payouts';
    }
  },

  /**
   * Get payout history
   * @param {Object} params - Query parameters
   * @returns {Promise} Payout transactions
   */
  getPayoutHistory: async (params = {}) => {
    try {
      const response = await api.get('/sellers/payouts/history', { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Get payout history error:', error);
      throw error.response?.data?.message || error.message || 'Failed to get payout history';
    }
  },

  /**
   * Request payout
   * @param {Object} data - Payout request data
   * @returns {Promise} Payout transaction
   */
  requestPayout: async (data) => {
    try {
      const response = await api.post('/sellers/payouts/request', data);
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Request payout error:', error);
      throw error.response?.data?.message || error.message || 'Failed to request payout';
    }
  },

  /**
   * Get earnings breakdown
   * @param {Object} params - Query parameters (startDate, endDate)
   * @returns {Promise} Earnings breakdown
   */
  getEarningsBreakdown: async (params = {}) => {
    try {
      const response = await api.get('/sellers/earnings/breakdown', { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ Get earnings breakdown error:', error);
      throw error.response?.data?.message || error.message || 'Failed to get earnings breakdown';
    }
  },
};

export default sellerService;
