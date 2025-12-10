import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const qualityService = {
  getQualityMetrics: async (sellerId) => {
    const response = await axios.get(`${API_URL}/quality`, { params: { sellerId } });
    return response.data;
  },

  getQualityById: async (id) => {
    const response = await axios.get(`${API_URL}/quality/${id}`);
    return response.data;
  },

  updateQualityMetrics: async (id, data) => {
    const response = await axios.put(`${API_URL}/quality/${id}`, data);
    return response.data;
  },
};

export default qualityService;
