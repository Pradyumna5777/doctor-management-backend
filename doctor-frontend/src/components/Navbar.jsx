import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Get user info from localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/images/original.png" // Replace with your logo path
            alt="Madhuri Nidan Kendra"
            className="w-10 h-10 object-cover"
          />
          <span className="font-bold text-2xl text-blue-700">
            Madhuri Nidan Kendra
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-700 transition">
            Home
          </Link>
          <Link to="/doctors" className="hover:text-blue-700 transition">
            Doctors
          </Link>
          <Link to="/book" className="hover:text-blue-700 transition">
            Appointment
          </Link>
          <Link to="/contact" className="hover:text-blue-700 transition">
            Contact
          </Link>
          <Link to="/about" className="hover:text-blue-700 transition">
            About
          </Link>
          <Link to="/account" className="hover:text-blue-700 transition">
            My Account
          </Link>

          {/* Auth Links */}
          {!token ? (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Admin
                </Link>
              )}
              {role === "doctor" && (
                <Link
                  to="/doctor/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Doctor
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow flex flex-col px-4 py-2 space-y-1">
          <Link
            to="/"
            className="block py-2 hover:bg-gray-100 rounded"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/doctors"
            className="block py-2 hover:bg-gray-100 rounded"
            onClick={() => setIsOpen(false)}
          >
            Doctors
          </Link>
          <Link
            to="/book"
            className="block py-2 hover:bg-gray-100 rounded"
            onClick={() => setIsOpen(false)}
          >
            Appointment
          </Link>
          <Link
            to="/contact"
            className="block py-2 hover:bg-gray-100 rounded"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/about"
            className="block py-2 hover:bg-gray-100 rounded"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
           <Link
            to="/account"
            className="block py-2 hover:bg-gray-100 rounded"
            onClick={() => setIsOpen(false)}
          >
            My Account
          </Link>
          {!token ? (
            <>
              <Link
                to="/login"
                className="block py-2 bg-blue-600 text-white rounded text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block py-2 border border-blue-600 text-blue-600 rounded text-center"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="block py-2 bg-blue-600 text-white rounded text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              )}
              {role === "doctor" && (
                <Link
                  to="/doctor/dashboard"
                  className="block py-2 bg-blue-600 text-white rounded text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Doctor
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block py-2 bg-red-600 text-white rounded text-center"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
