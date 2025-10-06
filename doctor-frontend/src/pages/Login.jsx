import { useState, useEffect, useRef } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const role = localStorage.getItem("role");
      switch (role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "doctor":
          navigate("/doctor/dashboard");
          break;
        case "patient":
          navigate("/patient/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", form);

      // Store token & user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("email", res.data.user.email);

      setMessage("Login successful!");

      // Redirect based on role
      if (res.data.user.role === "admin") navigate("/admin/dashboard");
      else if (res.data.user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Login failed");
    }
    setLoading(false);
  };

  // Google OAuth handler
  const handleGoogleLogin = async (response) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/google-login", {
        token: response.credential,
      });

      // Store token & user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("email", res.data.user.email);

      setMessage("Google login successful!");

      // Redirect based on role
      if (res.data.user.role === "admin") navigate("/admin/dashboard");
      else if (res.data.user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");

    } catch (err) {
      console.error("Google login error:", err);
      setMessage(err.response?.data?.error || "Google login failed");
    }
    setLoading(false);
  };

  // Load Google OAuth script
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        // Use the actual Google Client ID directly for now
        const clientId = "205532721629-tugpn95tfi42kc4dfeomnkq71af3n79p.apps.googleusercontent.com"; // Replace with your actual Client ID
        
        if (!clientId || clientId === "your_actual_google_client_id_here") {
          console.error("Please set your Google Client ID in the Login component");
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleLogin,
        });
        
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { 
            theme: "outline", 
            size: "large",
            width: "100%",
            text: "continue_with",
            type: "standard"
          }
        );

        // Optional: Also display the One Tap prompt
        // window.google.accounts.id.prompt();
      }
    };

    // Check if script is already loaded
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Load Google OAuth script
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      script.onerror = () => console.error("Failed to load Google OAuth script");
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Login
        </h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes("successful") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? "Logging in..." : "Login with Email"}
          </button>
        </form>

        {/* Google Sign In Button */}
        <div className="mt-6">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-600 text-sm">or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div ref={googleButtonRef} className="mt-4 flex justify-center"></div>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}