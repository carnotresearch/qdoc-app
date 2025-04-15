import React from "react";
import { Navigate } from "react-router-dom";

function isWithinExpiryTime(expiryTime) {
  const currentTime = Date.now();
  return currentTime <= parseInt(expiryTime);
}

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const expiryTime = sessionStorage.getItem("expiryTime");
  if (!token || !expiryTime || !isWithinExpiryTime(expiryTime)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
