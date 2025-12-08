import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendSellerOtp } from '../redux/slices/authSlice';
import { Phone, ArrowLeft, Store, TrendingUp, Package, Users } from 'lucide-react';

export default function SellerLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading, error } = useSelector(state => state.auth);
  
  const [phone, setPhone] = useState('');
  const [localError, setLocalError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'seller') {
        navigate('/seller', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setPhone(value);
      if (localError) setLocalError('');
    }
  };

  const validatePhone = () => {
    if (!phone) {
      setLocalError('Phone number is required');
      return false;
    }
    if (phone.length !== 10) {
      setLocalError('Phone number must be 10 digits');
      return false;
    }
    if (!/^[6-9]/.test(phone)) {
      setLocalError('Phone number must start with 6, 7, 8, or 9');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePhone()) return;

    console.log('SellerLogin: Sending OTP to phone:', phone);

    // Send OTP via Redux
    const resultAction = await dispatch(sendSellerOtp(phone));
    
    if (sendSellerOtp.fulfilled.match(resultAction)) {
      console.log('SellerLogin: OTP sent successfully, navigating to OTP verification');
      navigate('/seller-otp', { 
        state: { phone, isNewSeller: false }
      });
    } else {
      console.error('SellerLogin: Failed to send OTP:', resultAction.payload);
      setLocalError(resultAction.payload || 'Failed to send OTP');
    }
  };

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: '1 Crore+', label: 'Sellers' },
    { icon: <Package className="w-6 h-6" />, value: '14 Crore+', label: 'Products' },
    { icon: <TrendingUp className="w-6 h-6" />, value: '28000+', label: 'Pincodes' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            meesho
          </Link>
          <span className="text-sm text-gray-600">Seller Hub</span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
        {/* Left Side - Info */}
        <div className="lg:w-1/2 bg-gradient-to-br from-purple-600 to-pink-600 p-8 lg:p-12 text-white flex flex-col justify-center">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-3 mb-6">
              <Store className="w-10 h-10" />
              <h1 className="text-3xl lg:text-4xl font-bold">Sell on Meesho</h1>
            </div>
            
            <p className="text-lg lg:text-xl opacity-90 mb-8">
              Join India's fastest growing e-commerce platform and start your online business journey today!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="flex justify-center mb-2 opacity-90">{stat.icon}</div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-sm opacity-80">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
                <span>0% Commission for 1st month</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
                <span>Free shipping support to 28000+ pincodes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">✓</div>
                <span>7-day payment cycle</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
                <p className="text-gray-600 mt-2">Enter your mobile number to login</p>
              </div>

              {/* Error Message */}
              {(error || localError) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                  <p className="text-red-600 text-sm">{error || localError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Phone Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                      <span className="text-gray-500 font-medium">+91</span>
                      <div className="w-px h-6 bg-gray-300 mx-3"></div>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit number"
                      className="w-full pl-20 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-lg font-medium transition-colors"
                      maxLength="10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    We'll send an OTP to verify your number
                  </p>
                </div>

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={isLoading || phone.length !== 10}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending OTP...
                    </>
                  ) : (
                    'Get OTP'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-sm text-gray-500">New to Meesho?</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* Register Link */}
              <button
                onClick={() => navigate('/seller-register')}
                className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
              >
                Start Selling on Meesho
              </button>

              {/* Admin Login */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Are you an admin?{' '}
                  <button
                    onClick={() => navigate('/admin-login')}
                    className="text-purple-600 font-medium hover:underline"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </div>

            {/* Help */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Need help? Call us at <span className="font-medium">080-61799600</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
