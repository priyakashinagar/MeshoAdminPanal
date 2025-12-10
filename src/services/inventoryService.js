import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const inventoryService = {
  // Get all inventory items
  getAllInventory: async (params = {}) => {
    const response = await axios.get(`${API_URL}/inventory`, { params });
    return response.data;
  },

  // Get inventory by ID
  getInventoryById: async (id) => {
    const response = await axios.get(`${API_URL}/inventory/${id}`);
    return response.data;
  },

  // Create inventory item
  createInventory: async (data) => {
    const response = await axios.post(`${API_URL}/inventory`, data);
    return response.data;
  },

  // Update stock
  updateStock: async (id, data) => {
    const response = await axios.put(`${API_URL}/inventory/${id}/stock`, data);
    return response.data;
  },

  // Update inventory
  updateInventory: async (id, data) => {
    const response = await axios.put(`${API_URL}/inventory/${id}`, data);
    return response.data;
  },

  // Delete inventory
  deleteInventory: async (id) => {
    const response = await axios.delete(`${API_URL}/inventory/${id}`);
    return response.data;
  },

  // Get low stock items
  getLowStockItems: async (sellerId) => {
    const response = await axios.get(`${API_URL}/inventory/alerts/low-stock`, { params: { sellerId } });
    return response.data;
  },

  // Bulk stock update
  bulkStockUpdate: async (updates) => {
    const response = await axios.post(`${API_URL}/inventory/bulk-update`, { updates });
    return response.data;
  },
};

export default inventoryService;
