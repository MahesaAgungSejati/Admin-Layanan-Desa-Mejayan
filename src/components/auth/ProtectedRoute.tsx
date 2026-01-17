import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const userRole = user?.role || localStorage.getItem("user_type") || "";

  const location = useLocation();

  // ===============================
  // 🔐 AUTO LOGOUT BY TIME
  // ===============================
  const loginTime = localStorage.getItem("login_time");
  const MAX_SESSION = 3 * 24 * 60 * 60 * 1000; // 3 hari

  if (loginTime) {
    const now = Date.now();
    const diff = now - Number(loginTime);

    if (diff > MAX_SESSION) {
      // 🔥 hapus semua session
      localStorage.clear();

      return (
        <Navigate
          to="/signin"
          replace
          state={{ sessionExpired: true }}
        />
      );
    }
  }

  // ===============================
  // 1️⃣ BELUM LOGIN
  // ===============================
  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  // ===============================
  // 2️⃣ ROLE TIDAK SESUAI
  // ===============================
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
}
