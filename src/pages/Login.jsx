import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Dummy login logic for admin and seller
    let user = null;
    if (email === "admin@example.com" && password === "password") {
      user = { email, role: "admin" };
    } else if (email === "seller@example.com" && password === "password") {
      user = { email, role: "seller" };
    }
    if (user) {
      localStorage.setItem("authToken", "demo_token_" + Date.now());
      localStorage.setItem("userEmail", email);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(login(user));
      setTimeout(() => {
        if (user.role === "seller") {
          navigate("/seller");
        } else {
          navigate("/");
        }
      }, 300);
    } else {
      setError("Invalid credentials. Use admin@example.com or seller@example.com / password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-purple-50 dark:from-slate-950 dark:to-purple-950 px-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-3 rounded-lg">
            <LogIn size={28} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">meesho Admin</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          E-commerce Dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border border-purple-200 dark:border-purple-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-purple-200 dark:border-purple-800 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-purple-200 dark:border-purple-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="font-medium mb-2">Demo Credentials:</p>
          <p>Admin: admin@example.com / password</p>
          <p>Seller: seller@example.com / password</p>
        </div>
      </Card>
    </div>
  );
}
