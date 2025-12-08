import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Debug: Log all localStorage keys
    console.log('🔍 localStorage keys:', Object.keys(localStorage));
    console.log('🔍 authToken:', localStorage.getItem('authToken'));
    console.log('🔍 user:', localStorage.getItem('user'));
    console.log('🔍 isAuthenticated:', localStorage.getItem('isAuthenticated'));
    
    // Try multiple token storage keys (authToken, token, seller_token)
    let token = localStorage.getItem('authToken') || 
                localStorage.getItem('token') || 
                localStorage.getItem('seller_token');
    
    // Remove any "Bearer " prefix if already present
    if (token && token.startsWith('Bearer ')) {
      token = token.substring(7);
    }
    
    // Clean token - remove quotes if wrapped
    if (token && (token.startsWith('"') || token.startsWith("'"))) {
      token = token.slice(1, -1);
    }
    
    if (token && token.trim()) {
      config.headers.Authorization = `Bearer ${token.trim()}`;
      console.log('🔑 Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No valid token found in localStorage');
      console.warn('Please login first to get authentication token');
    }

    // If sending FormData, remove Content-Type to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    
    console.error('❌ API Error:', {
      url,
      status,
      message: error.response?.data?.message,
      data: error.response?.data
    });
    
    // Only redirect on 401 Unauthorized (not on 400 or 500)
    if (status === 401) {
      console.warn('⚠️ 401 Unauthorized - Token expired or invalid');
      console.warn('Clearing auth data and redirecting to login...');
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAuthenticated');
      
      // Use setTimeout to avoid interrupting current operation
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    } else {
      console.log('ℹ️ Non-401 error, not redirecting. Status:', status);
    }
    
    return Promise.reject(error);
  }
);

export default api;
