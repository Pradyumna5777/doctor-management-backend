import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../axiosInstance";

export default function Account() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login");
    axiosInstance
      .get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user)
    return (
      <div className="text-center mt-20 text-blue-700 font-semibold animate-pulse">
        Loading your account...
      </div>
    );

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1
        className="text-3xl font-bold text-blue-700 mb-6 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        My Account
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar Navigation */}
        <motion.div
          className="w-full md:w-1/3 bg-blue-50 rounded-lg p-4"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="font-semibold text-lg mb-3 text-blue-800">Navigation</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="block hover:underline text-blue-700">
                Home
              </Link>
            </li>
            <li>
              <Link to="/doctors" className="block hover:underline text-blue-700">
                Doctors
              </Link>
            </li>
            <li>
              <Link to="/book" className="block hover:underline text-blue-700">
                Book Appointment
              </Link>
            </li>
            <li>
              <Link to="/contact" className="block hover:underline text-blue-700">
                Contact
              </Link>
            </li>
            {user.role === "admin" && (
              <li>
                <Link
                  to="/admin/dashboard"
                  className="block hover:underline text-blue-700"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
            {user.role === "doctor" && (
              <li>
                <Link
                  to="/doctor/dashboard"
                  className="block hover:underline text-blue-700"
                >
                  Doctor Dashboard
                </Link>
              </li>
            )}
            {user.role === "patient" && (
              <li>
                <Link
                  to="/patient/dashboard"
                  className="block hover:underline text-blue-700"
                >
                  Patient Dashboard
                </Link>
              </li>
            )}
            <li>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="w-full mt-4 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </motion.button>
            </li>
          </ul>
        </motion.div>

        {/* User Info */}
        <motion.div
          className="flex-1"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Profile Details
          </h2>
          <motion.div
            className="space-y-3 text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            
            <p>
              <strong>Member Since:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
