import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const supportService = {
  getAllTickets: async (params = {}) => {
    const response = await axios.get(`${API_URL}/support`, { params });
    return response.data;
  },

  getTicketById: async (id) => {
    const response = await axios.get(`${API_URL}/support/${id}`);
    return response.data;
  },

  createTicket: async (data) => {
    const response = await axios.post(`${API_URL}/support`, data);
    return response.data;
  },

  addMessage: async (id, message, attachments = []) => {
    const response = await axios.post(`${API_URL}/support/${id}/message`, { message, attachments });
    return response.data;
  },

  updateTicketStatus: async (id, status) => {
    const response = await axios.put(`${API_URL}/support/${id}/status`, { status });
    return response.data;
  },
};

export default supportService;
