import api from './api';

const orderService = {
  // Get seller's orders
  getSellerOrders: async (params = {}) => {
    const response = await api.get('/orders/seller', { params });
    return response.data;
  },

  // Get all orders (Admin only)
  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders/admin', { params });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Update order status (Seller/Admin)
  updateOrderStatus: async (orderId, data) => {
    const response = await api.put(`/orders/update/${orderId}`, data);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId, reason = '') => {
    const response = await api.put(`/orders/cancel/${orderId}`, { reason });
    return response.data;
  }
};

export default orderService;
