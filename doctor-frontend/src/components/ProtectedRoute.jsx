import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token"); // check if logged in
  const userRole = localStorage.getItem("role"); // check role

  // if not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // if a role is specified and doesn't match
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  // allowed to access
  return children;
}
