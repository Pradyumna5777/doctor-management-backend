import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Doctors from "./pages/Doctors";
import BookAppointment from "./pages/BookAppointment";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import './index.css'
import Contact from "./pages/Contact";
import Account from "./pages/Account";

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const hideNavFooter = ["/login", "/register"]; // paths to hide nav/footer
  const showNavFooter = !hideNavFooter.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop /> {/* <-- Add this here */}
      {showNavFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/book"
            element={
              <ProtectedRoute role="patient">
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route
  path="/account"
  element={
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  }
/>

          {/* Dashboards */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute role="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute role="patient">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {showNavFooter && <Footer />}
    </div>
  );
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  
  if (token) {
    const role = localStorage.getItem("role");
    switch (role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "doctor":
        return <Navigate to="/doctor/dashboard" replace />;
      case "patient":
        return <Navigate to="/patient/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  return children;
}
