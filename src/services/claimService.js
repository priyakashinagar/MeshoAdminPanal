import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const claimService = {
  getAllClaims: async (params = {}) => {
    const response = await axios.get(`${API_URL}/claims`, { params });
    return response.data;
  },

  getClaimById: async (id) => {
    const response = await axios.get(`${API_URL}/claims/${id}`);
    return response.data;
  },

  createClaim: async (data) => {
    const response = await axios.post(`${API_URL}/claims`, data);
    return response.data;
  },

  updateClaimStatus: async (id, status, comment) => {
    const response = await axios.put(`${API_URL}/claims/${id}/status`, { status, comment });
    return response.data;
  },
};

export default claimService;
