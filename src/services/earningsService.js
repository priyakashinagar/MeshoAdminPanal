import api from './api';

const earningsService = {
  // Get earnings summary by month
  getEarningsSummary: async () => {
    const response = await api.get('/earnings/summary');
    return response.data;
  },

  // Get detailed earnings with orders
  getDetailedEarnings: async (params = {}) => {
    const response = await api.get('/earnings/detailed', { params });
    return response.data;
  },

  // Get earnings analytics
  getEarningsAnalytics: async () => {
    const response = await api.get('/earnings/analytics');
    return response.data;
  }
};

export default earningsService;
