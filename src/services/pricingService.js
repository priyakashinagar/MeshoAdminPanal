import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const pricingService = {
  getAllPricing: async (sellerId) => {
    const response = await axios.get(`${API_URL}/pricing`, { params: { sellerId } });
    return response.data;
  },

  getPricingById: async (id) => {
    const response = await axios.get(`${API_URL}/pricing/${id}`);
    return response.data;
  },

  createPricing: async (data) => {
    const response = await axios.post(`${API_URL}/pricing`, data);
    return response.data;
  },

  updatePricing: async (id, data) => {
    const response = await axios.put(`${API_URL}/pricing/${id}`, data);
    return response.data;
  },

  enableAutoPrice: async (id, data) => {
    const response = await axios.put(`${API_URL}/pricing/${id}/auto-price`, data);
    return response.data;
  },
};

export default pricingService;
