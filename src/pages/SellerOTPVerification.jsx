import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifySellerOtp, sendSellerOtp } from '../redux/slices/authSlice';
import { ArrowLeft, Shield, Phone } from 'lucide-react';

export default function SellerOTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  const phone = location.state?.phone || '';
  const isNewSeller = location.state?.isNewSeller || false;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [localError, setLocalError] = useState('');
  const inputRefs = useRef([]);

  // Redirect if no phone
  useEffect(() => {
    if (!phone) {
      navigate('/login', { replace: true });
    }
  }, [phone, navigate]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setLocalError('');

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split('').forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      
      // Focus last filled input or last input
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setLocalError('Please enter complete 6-digit OTP');
      return;
    }

    console.log('SellerOTP: Verifying OTP for phone:', phone);

    const resultAction = await dispatch(verifySellerOtp({ phone, otp: otpString }));
    
    if (verifySellerOtp.fulfilled.match(resultAction)) {
      console.log('SellerOTP: OTP verified successfully');
      const user = resultAction.payload?.user;
      
      // Check if seller profile is complete
      if (isNewSeller || !user?.sellerId) {
        // Navigate to onboarding to complete profile
        navigate('/seller-register', { 
          state: { phone, userId: user?._id, fromOtp: true }
        });
      } else {
        // Existing seller with complete profile - go to dashboard
        navigate('/seller', { replace: true });
      }
    } else {
      console.error('SellerOTP: Verification failed:', resultAction.payload);
      setLocalError(resultAction.payload || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    setLocalError('');

    const resultAction = await dispatch(sendSellerOtp(phone));
    
    if (!sendSellerOtp.fulfilled.match(resultAction)) {
      setLocalError(resultAction.payload || 'Failed to resend OTP');
    }
  };

  const formatPhone = (mobile) => {
    if (!mobile) return '';
    return mobile.replace(/(\d{5})(\d{5})/, '+91 $1 $2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            meesho
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
              <p className="text-gray-600">
                Enter the 6-digit code sent to<br />
                <span className="font-semibold text-gray-900">{formatPhone(phone)}</span>
              </p>
            </div>

            {/* Error Message */}
            {(error || localError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-red-600 text-sm">{error || localError}</p>
              </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors ${
                      digit 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Timer & Resend */}
              <div className="text-center mb-6">
                {!canResend ? (
                  <p className="text-gray-600">
                    Resend OTP in <span className="font-semibold text-purple-600">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-purple-600 font-semibold hover:underline disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Development hint */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-yellow-700 text-sm text-center">
                  💡 <strong>For testing:</strong> Use OTP <code className="bg-yellow-100 px-1 rounded">999000</code>
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </button>
            </form>

            {/* Change Number */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-purple-600 font-medium hover:underline"
              >
                Change mobile number
              </button>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-white/80 rounded-xl p-4 mt-6 border border-purple-100">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                Your security is our priority. Never share your OTP with anyone. 
                Meesho team will never ask for your OTP.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
