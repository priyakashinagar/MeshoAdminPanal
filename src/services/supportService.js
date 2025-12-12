import api from './api';

const supportService = {
  getAllTickets: async (params = {}) => {
    const response = await api.get('/support', { params });
    return response.data;
  },

  getTicketById: async (id) => {
    const response = await api.get(`/support/${id}`);
    return response.data;
  },

  createTicket: async (data) => {
    const response = await api.post('/support', data);
    return response.data;
  },

  addMessage: async (id, message, attachments = []) => {
    const response = await api.post(`/support/${id}/message`, { message, attachments });
    return response.data;
  },

  updateTicketStatus: async (id, status) => {
    const response = await api.put(`/support/${id}/status`, { status });
    return response.data;
  },
};

export default supportService;
