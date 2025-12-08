import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import authService from "../services/authService";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Form states
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('input'); // 'input', 'otp', 'adminLogin'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [hasSellerProfile, setHasSellerProfile] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  
  const otpRefs = useRef([]);

  // Handle authenticated users visiting login page
  useEffect(() => {
    if (isAuthenticated && user) {
      // If seller with complete profile, redirect to dashboard
      if (user.role === 'seller' && user.sellerId) {
        console.log('✅ Complete seller, redirecting to dashboard');
        navigate('/seller', { replace: true });
        return;
      }
      // If admin, redirect to admin dashboard
      if (user.role === 'admin') {
        console.log('✅ Admin, redirecting to dashboard');
        navigate('/', { replace: true });
        return;
      }
      // If incomplete seller, stay on login page - show logout option
      // User can continue registration or logout
      console.log('ℹ️ Incomplete seller on login page');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Auto-focus first OTP input
  useEffect(() => {
    if (step === 'otp' && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setInputValue(value);
    setError('');
    setIsExistingUser(false);
    setHasSellerProfile(false);
  };

  // Handle email input for admin login
  const handleEmailChange = (e) => {
    setInputValue(e.target.value);
    setError('');
  };

  // Check phone number in database when 10 digits entered
  useEffect(() => {
    const checkPhoneInDatabase = async () => {
      if (inputValue.length === 10 && /^[6-9]/.test(inputValue)) {
        setIsCheckingPhone(true);
        try {
          const response = await authService.checkPhone(inputValue);
          console.log('📱 Phone check result:', response);
          setIsExistingUser(response.isExistingUser === true);
          setHasSellerProfile(response.hasSellerProfile === true);
        } catch (err) {
          console.log('Phone check error:', err);
          setIsExistingUser(false);
          setHasSellerProfile(false);
        } finally {
          setIsCheckingPhone(false);
        }
      } else {
        setIsExistingUser(false);
        setHasSellerProfile(false);
      }
    };

    const debounceTimer = setTimeout(checkPhoneInDatabase, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  // Handle existing user direct login (no OTP needed)
  const handleExistingUserLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Direct login for existing user
      const response = await authService.directLogin(inputValue);
      console.log('✅ Direct login:', response);
      
      if (response.success) {
        dispatch(login({ user: response.user, token: response.token }));
        
        // Check if onboarding is required (profile incomplete)
        setTimeout(() => {
          if (response.requiresOnboarding) {
            console.log('ℹ️ Seller profile incomplete, going to onboarding');
            navigate('/seller-register', { replace: true });
          } else if (response.user?.sellerId) {
            console.log('✅ Seller has complete profile, going to dashboard');
            navigate('/seller', { replace: true });
          } else {
            console.log('ℹ️ No seller profile, going to onboarding');
            navigate('/seller-register', { replace: true });
          }
        }, 300);
      }
    } catch (err) {
      setError(err || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate phone number
    if (!/^\d{10}$/.test(inputValue)) {
      if (inputValue.length !== 10) {
        setError('Mobile number must be 10 digits');
      } else {
        setError('Please enter a valid mobile number');
      }
      return;
    }
    if (!/^[6-9]/.test(inputValue)) {
      setError('Mobile number must start with 6, 7, 8, or 9');
      return;
    }

    // Send OTP for NEW users only
    setIsLoading(true);
    try {
      const response = await authService.sendOtp(inputValue);
      console.log('📱 OTP sent:', response);
      setStep('otp');
      setTimer(30);
    } catch (err) {
      setError(err || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split('').forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.verifyOtp(inputValue, otpString);
      console.log('✅ OTP verified:', response);
      
      if (response.success) {
        const userData = response.user;
        const token = response.token;
        
        dispatch(login({ user: userData, token }));
        
        // Check if onboarding is required
        setTimeout(() => {
          if (response.requiresOnboarding) {
            console.log('ℹ️ Seller profile incomplete, going to onboarding');
            navigate('/seller-register', { replace: true });
          } else if (userData.sellerId) {
            console.log('✅ Seller has complete profile, going to dashboard');
            navigate('/seller', { replace: true });
          } else {
            console.log('ℹ️ New seller, going to onboarding');
            navigate('/seller-register', { replace: true });
          }
        }, 300);
      }
    } catch (err) {
      setError(err || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    if (!inputValue || !password) {
      setError('Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(inputValue, password);
      console.log('✅ Admin login:', response);
      
      if (response.success) {
        const userData = response.data.user;
        const token = response.token;
        
        if (userData.role !== 'admin') {
          setError('This email is not registered as admin.');
          setIsLoading(false);
          return;
        }
        
        dispatch(login({ user: userData, token }));
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 300);
      }
    } catch (err) {
      setError(err || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    setIsLoading(true);
    setOtp(['', '', '', '', '', '']);
    try {
      await authService.sendOtp(inputValue);
      setTimer(30);
      setError('');
    } catch (err) {
      setError(err || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('input');
    setOtp(['', '', '', '', '', '']);
    setPassword('');
    setError('');
    setTimer(0);
    setIsExistingUser(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-purple-50 px-2 sm:px-4">
      <Card className="w-full max-w-sm sm:max-w-md p-4 sm:p-8 shadow-lg">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-3 rounded-lg">
            <LogIn size={28} />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">meesho</h1>
        <p className="text-center text-gray-600 mb-6 sm:mb-8">
          E-commerce Dashboard
        </p>

        {/* Show continue registration banner for incomplete sellers */}
        {isAuthenticated && user?.role === 'seller' && !user?.sellerId && step === 'input' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm mb-3">
              👋 Welcome back! Your registration is incomplete.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigate('/seller-register', { replace: true })}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700"
              >
                Continue Registration →
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full text-gray-500 py-2 text-sm hover:underline"
              >
                Use Different Number
              </button>
            </div>
          </div>
        )}

        {step === 'input' && !(isAuthenticated && user?.role === 'seller' && !user?.sellerId) && (
          <form onSubmit={handleContinue} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Mobile Number</label>
              <input
                type="tel"
                inputMode="numeric"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-4 py-2 border border-purple-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                maxLength={10}
              />
              {isCheckingPhone && (
                <p className="text-xs text-gray-500 mt-1">Checking...</p>
              )}
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            {/* Show "Click here to Login" if user exists in database */}
            {isExistingUser && !isCheckingPhone && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-green-700 text-sm mb-2">
                  ✓ This number is already registered
                </p>
                <button
                  type="button"
                  onClick={handleExistingUserLogin}
                  disabled={isLoading}
                  className="text-purple-600 font-semibold hover:underline"
                >
                  {isLoading ? "Logging in..." : "Click here to Login →"}
                </button>
              </div>
            )}

            {/* Show Register button if user doesn't exist */}
            {!isExistingUser && !isCheckingPhone && inputValue.length === 10 && (
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {isLoading ? "Sending OTP..." : "Register & Continue"}
              </Button>
            )}

            {/* Show Continue button when number is incomplete */}
            {inputValue.length < 10 && (
              <Button
                type="submit"
                disabled={true}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-not-allowed"
              >
                Continue
              </Button>
            )}
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-center">Enter OTP sent to +91 {inputValue}</label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className={`w-10 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      digit ? 'border-purple-500 bg-purple-50' : 'border-purple-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                {timer > 0 ? (
                  <>Resend OTP in <span className="text-purple-600 font-medium">{timer}s</span></>
                ) : (
                  <button type="button" onClick={handleResendOTP} className="text-purple-600 font-medium hover:underline">
                    Resend OTP
                  </button>
                )}
              </p>
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isLoading ? "Verifying..." : (isExistingUser ? "Login" : "Register & Continue")}
            </Button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full text-gray-500 text-sm hover:underline"
            >
              ← Change number
            </button>
          </form>
        )}

        {step === 'adminLogin' && (
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={inputValue}
                onChange={handleEmailChange}
                placeholder="Enter admin email"
                className="w-full px-4 py-2 border border-purple-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-purple-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading || !password || !inputValue}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full text-gray-500 text-sm hover:underline"
            >
              ← Back
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-purple-200 text-center text-sm text-gray-600">
          <p className="font-medium mb-2">Test Credentials:</p>
          <p>Seller OTP: 999000</p>
          <p>Admin: admin@meesho.com / Admin@123</p>
          
          {step !== 'adminLogin' && (
            <div className="mt-4 pt-4 border-t border-purple-100">
              <button
                type="button"
                onClick={() => { setStep('adminLogin'); setInputValue(''); setPassword(''); setError(''); }}
                className="text-purple-600 font-semibold hover:underline"
              >
                Admin Login →
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
