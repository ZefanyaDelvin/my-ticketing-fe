import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${baseURL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("name", data.data.userName);
      localStorage.setItem("roleId", data.data.roleId);
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("userId", data.data.userId);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
              {error}
            </div>
          )}

          {/* Title/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Ticketing System
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Enter your password"
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition font-medium cursor-pointer"
            >
              Login
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              <button className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline bg-transparent border-none cursor-pointer">
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
