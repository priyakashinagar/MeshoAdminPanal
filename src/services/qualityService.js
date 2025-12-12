import api from './api';

const qualityService = {
  // Get all quality metrics for a seller
  getQualityMetrics: async (sellerId) => {
    const response = await api.get('/quality', { params: { sellerId } });
    return response.data;
  },

  // Alias for getQualityMetrics
  getAllMetrics: async (sellerId) => {
    const response = await api.get('/quality', { params: { sellerId } });
    return response.data;
  },

  getQualityById: async (id) => {
    const response = await api.get(`/quality/${id}`);
    return response.data;
  },

  updateQualityMetrics: async (id, data) => {
    const response = await api.put(`/quality/${id}`, data);
    return response.data;
  },
};

export default qualityService;
