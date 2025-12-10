import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const paymentService = {
  getAllPayments: async (params = {}) => {
    const response = await axios.get(`${API_URL}/payments`, { params });
    return response.data;
  },

  getPaymentById: async (id) => {
    const response = await axios.get(`${API_URL}/payments/${id}`);
    return response.data;
  },

  createPayment: async (data) => {
    const response = await axios.post(`${API_URL}/payments`, data);
    return response.data;
  },

  updatePaymentStatus: async (id, status) => {
    const response = await axios.put(`${API_URL}/payments/${id}/status`, { status });
    return response.data;
  },
};

export default paymentService;
