import { Outlet } from "react-router";
import { AuthShell } from "@/components/features/auth/auth-shell";

export default function AuthLayout() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}
