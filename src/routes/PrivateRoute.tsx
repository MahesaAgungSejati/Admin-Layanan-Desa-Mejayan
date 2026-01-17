import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("user_type");

  if (!token) {
    // 🔹 Kalau belum login dan pernah punya role user desa
    if (
      role === "super_admin" ||
      role === "kepala_desa" ||
      role === "perangkat_desa" ||
      role === "rt"
    ) {
      return <Navigate to="/signin/users" replace />;
    }

    // 🔹 Default: login masyarakat
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PrivateRoute;
