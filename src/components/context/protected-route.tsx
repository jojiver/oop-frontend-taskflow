import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/components/context/use-auth";

export function ProtectedRoute() {
  const { user, ready } = useAuth();

  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function GuestRoute() {
  const { user, ready } = useAuth();

  if (!ready) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
