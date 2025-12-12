import api from './api';

const inventoryService = {
  // Get all inventory items
  getAllInventory: async (params = {}) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  },

  // Get inventory by ID
  getInventoryById: async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  // Create inventory item
  createInventory: async (data) => {
    const response = await api.post('/inventory', data);
    return response.data;
  },

  // Update stock
  updateStock: async (id, data) => {
    const response = await api.put(`/inventory/${id}/stock`, data);
    return response.data;
  },

  // Update inventory
  updateInventory: async (id, data) => {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },

  // Delete inventory
  deleteInventory: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },

  // Get low stock items
  getLowStockItems: async (sellerId) => {
    const response = await api.get('/inventory/alerts/low-stock', { params: { sellerId } });
    return response.data;
  },

  // Bulk stock update
  bulkStockUpdate: async (updates) => {
    const response = await api.post('/inventory/bulk-update', { updates });
    return response.data;
  },
};

export default inventoryService;
