import api from './api';

/**
 * Admin/Seller Authentication Service
 */
const authService = {
  /**
   * Check if phone number exists in database
   * @param {string} phone - Phone number (10 digits)
   * @returns {Promise} Check response with isExistingUser
   */
  checkPhone: async (phone) => {
    try {
      const response = await api.post('/auth/check-phone', { phone });
      console.log('📱 Check phone response:', response.data);
      return {
        isExistingUser: response.data.data?.isExistingUser || false,
        hasSellerProfile: response.data.data?.hasSellerProfile || false
      };
    } catch (error) {
      console.error('❌ Check phone error:', error);
      return { isExistingUser: false, hasSellerProfile: false };
    }
  },

  /**
   * Direct login for existing users (no OTP needed)
   * @param {string} phone - Phone number (10 digits)
   * @returns {Promise} Login response with token and user
   */
  directLogin: async (phone) => {
    try {
      const response = await api.post('/auth/direct-login', { phone });
      
      if (response.data.success) {
        const userData = response.data.data?.user;
        const token = response.data.data?.token;
        const requiresOnboarding = response.data.data?.requiresOnboarding || false;
        
        // Store token and user data
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        console.log('✅ Direct login successful:', userData.phone, 'requiresOnboarding:', requiresOnboarding);
        
        return {
          success: true,
          token,
          user: userData,
          requiresOnboarding
        };
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      console.error('❌ Direct login error:', error);
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  },

  /**
   * Send OTP to phone number
   * @param {string} phone - Phone number (10 digits)
   * @returns {Promise} OTP send response
   */
  sendOtp: async (phone) => {
    try {
      const response = await api.post('/auth/send-otp', { phone });
      
      if (response.data.success) {
        console.log('✅ OTP sent to:', phone, 'isExistingUser:', response.data.data?.isExistingUser);
        // Return with isExistingUser at top level for easy access
        return {
          success: true,
          isExistingUser: response.data.data?.isExistingUser || false,
          hasSellerProfile: response.data.data?.hasSellerProfile || false,
          message: response.data.message
        };
      }
      
      throw new Error(response.data.message || 'Failed to send OTP');
    } catch (error) {
      console.error('❌ Send OTP error:', error);
      throw error.response?.data?.message || error.message || 'Failed to send OTP';
    }
  },

  /**
   * Verify OTP and login
   * @param {string} phone - Phone number
   * @param {string} otp - 6-digit OTP
   * @returns {Promise} Verification response with token and user
   */
  verifyOtp: async (phone, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp });
      
      if (response.data.success) {
        // Backend returns: { success, message, token, user, requiresOnboarding }
        const { token, user, requiresOnboarding } = response.data;
        
        if (!user) {
          throw new Error('User data not received from server');
        }
        
        // Store token and user data
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        console.log('✅ OTP verified, user:', user.email || user.phone);
        
        return {
          success: true,
          token,
          user,
          requiresOnboarding: requiresOnboarding || false
        };
      }
      
      throw new Error(response.data.message || 'OTP verification failed');
    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      throw error.response?.data?.message || error.message || 'Invalid OTP';
    }
  },

  /**
   * Register a new seller
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration response
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        return response.data;
      }
      
      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Registration failed';
    }
  },

  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Login response
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('userEmail', response.data.data.user.email);
        
        return response.data;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  },

  /**
   * Logout user
   * @returns {Promise} Logout response
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
      
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
      
      return { success: true };
    } catch (error) {
      // Clear storage even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
      
      throw error.response?.data?.message || 'Logout failed';
    }
  },

  /**
   * Get current logged-in user
   * @returns {Promise} Current user data
   */
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        return response.data.data.user;
      }
      
      throw new Error('Failed to fetch user data');
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user';
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Is authenticated
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  /**
   * Get stored user data
   * @returns {Object|null} User data
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check user role
   * @param {string} role - Role to check (admin/seller)
   * @returns {boolean} Has role
   */
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user?.role === role;
  }
};

export default authService;
