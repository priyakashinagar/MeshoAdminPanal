import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const kycService = {
  getKYCStatus: async (sellerId) => {
    const response = await axios.get(`${API_URL}/kyc`, { params: { sellerId } });
    return response.data;
  },

  updateKYC: async (data) => {
    const response = await axios.put(`${API_URL}/kyc`, data);
    return response.data;
  },

  submitKYC: async () => {
    const response = await axios.post(`${API_URL}/kyc/submit`);
    return response.data;
  },

  uploadDocument: async (type, url) => {
    const response = await axios.post(`${API_URL}/kyc/upload-document`, { type, url });
    return response.data;
  },
};

export default kycService;
