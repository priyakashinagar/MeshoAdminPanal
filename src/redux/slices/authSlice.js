import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Async thunk for sending OTP to seller
export const sendSellerOtp = createAsyncThunk(
  'auth/sendSellerOtp',
  async (phone, { rejectWithValue }) => {
    try {
      const response = await authService.sendOtp(phone);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for verifying seller OTP
export const verifySellerOtp = createAsyncThunk(
  'auth/verifySellerOtp',
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(phone, otp);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Load auth state from localStorage on app startup
const loadAuthFromStorage = () => {
  try {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    console.log('🔍 Checking localStorage auth:', { 
      hasToken: !!token, 
      hasUser: !!userStr, 
      isAuth 
    });
    
    if (token && userStr && isAuth) {
      // Basic JWT format validation (header.payload.signature)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.warn('⚠️ Invalid token format in localStorage, clearing...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        return { user: null, token: null, isAuthenticated: false };
      }
      
      const user = JSON.parse(userStr);
      console.log('✅ Valid auth found in localStorage:', user.email);
      return {
        user,
        token,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('❌ Error loading auth from storage:', error);
    // Clear corrupted data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  }
  
  console.log('ℹ️ No valid auth in localStorage');
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const initialState = {
  ...loadAuthFromStorage(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      console.log('🔐 Login action payload:', action.payload);
      
      state.user = action.payload.user || action.payload;
      state.token = action.payload.token || localStorage.getItem('authToken');
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      
      console.log('💾 Saving to localStorage:', {
        user: state.user,
        token: state.token?.substring(0, 20) + '...',
        isAuthenticated: state.isAuthenticated
      });
      
      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('isAuthenticated', 'true');
      if (state.token) {
        localStorage.setItem('authToken', state.token);
        console.log('✅ Token saved to localStorage');
      } else {
        console.error('❌ No token to save!');
      }
      
      console.log('✅ Login successful, auth state persisted');
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      
      console.log('✅ Logout successful, storage cleared');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendSellerOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendSellerOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendSellerOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to send OTP';
      })
      // Verify OTP
      .addCase(verifySellerOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifySellerOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(verifySellerOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'OTP verification failed';
      });
  },
});

export const { login, logout, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;
