// ProtectedRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthApi } from "../auth/AuthApi";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("admin" | "user")[]; // roles yang boleh akses
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const token = localStorage.getItem("accesstoken");

  useEffect(() => {
    const fetchRole = async () => {
      if (!token) return;
      try {
        const res = await AuthApi.me();
        setRole(res.data.role);
      } catch (err) {
        console.error(err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [token]);

  if (!token) {
    return (
      <Navigate
        to="/"
        replace
        state={{ message: "Opss, harus login dulu bro!" }}
      />
    );
  }

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>; // skeleton / spinner bisa diganti
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // munculkan toast
    toast.error("Opss, kamu tidak punya akses ke halaman ini!");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
