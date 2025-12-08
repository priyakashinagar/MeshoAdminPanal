import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import authService from "../services/authService";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { Shield, LogIn } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/', { replace: true });
      } else if (user.role === 'seller') {
        navigate('/seller', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        const userData = response.data.user;
        const token = response.token;
        
        // Only allow admin login here
        if (userData.role !== 'admin') {
          setError('Access denied. Only admin accounts can login here. Sellers please use seller login.');
          setIsLoading(false);
          return;
        }
        
        dispatch(login({ user: userData, token }));
        
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 300);
      }
    } catch (err) {
      setError(err || 'Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900 px-4">
      <Card className="w-full max-w-md p-8 shadow-2xl bg-white/95 backdrop-blur">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-4 rounded-xl shadow-lg">
            <Shield size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Admin Portal</h1>
        <p className="text-center text-gray-600 mb-8">
          Meesho E-commerce Admin Dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@meesho.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold text-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Login to Admin
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2 text-center">Demo Credentials:</p>
            <p className="text-sm text-gray-600 text-center">admin@meesho.com / Admin@123</p>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Are you a seller?</p>
            <Link
              to="/login"
              className="text-purple-600 font-semibold hover:underline"
            >
              Go to Seller Login →
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
