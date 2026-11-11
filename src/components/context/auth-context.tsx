import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "./auth-state";
import { tokenStore } from "@/lib/axios";
import {
  loginService,
  logoutService,
  meService,
  registerService,
} from "@/services/auth-service";
import type { RegisterInput, User } from "@/services/auth-service";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginService(email, password);
    tokenStore.set(result.token);
    setUser(result.user);
    setReady(true);
    return result.user;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const result = await registerService(input);
    tokenStore.set(result.token);
    setUser(result.user);
    setReady(true);
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutService();
    } catch {
      // Clear locally even if the API is unreachable.
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    function onUnauthorized() {
      setUser(null);
    }

    window.addEventListener("taskflow:unauthorized", onUnauthorized);

    async function restore() {
      if (!tokenStore.get()) {
        if (active) setReady(true);
        return;
      }

      try {
        const current = await meService();
        if (active) setUser(current);
      } catch {
        tokenStore.clear();
        if (active) setUser(null);
      } finally {
        if (active) setReady(true);
      }
    }

    restore();

    return () => {
      active = false;
      window.removeEventListener("taskflow:unauthorized", onUnauthorized);
    };
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
