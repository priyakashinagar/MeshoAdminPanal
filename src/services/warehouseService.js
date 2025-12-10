import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const warehouseService = {
  getAllWarehouses: async (params = {}) => {
    const response = await axios.get(`${API_URL}/warehouses`, { params });
    return response.data;
  },

  getWarehouseById: async (id) => {
    const response = await axios.get(`${API_URL}/warehouses/${id}`);
    return response.data;
  },

  createWarehouse: async (data) => {
    const response = await axios.post(`${API_URL}/warehouses`, data);
    return response.data;
  },

  updateWarehouse: async (id, data) => {
    const response = await axios.put(`${API_URL}/warehouses/${id}`, data);
    return response.data;
  },

  deleteWarehouse: async (id) => {
    const response = await axios.delete(`${API_URL}/warehouses/${id}`);
    return response.data;
  },
};

export default warehouseService;
