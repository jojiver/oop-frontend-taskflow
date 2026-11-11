import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useAuth } from "@/components/context/use-auth";
import { apiErrorMessage } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      await login(email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-[28px] border border-white/60 bg-white p-7 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] sm:p-9">
      <header className="flex items-center gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#60a5fa] to-[#4f46e5] text-white shadow-[0_10px_24px_-10px_rgba(59,130,246,0.9)]">
          <LogIn className="size-5" strokeWidth={2.5} />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Welcome back
          </h1>
          <p className="mt-0.5 text-sm text-ink-2">
            Sign in to keep your day on track.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-[11px] font-semibold tracking-[0.08em] text-ink-2 uppercase"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-3" />
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@school.edu"
              className="pl-10"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-[11px] font-semibold tracking-[0.08em] text-ink-2 uppercase"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-3" />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className="pr-11 pl-10"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
              className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-ink-3 hover:bg-slate-100 hover:text-ink"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="size-4 rounded border-line accent-brand"
            />
            Remember me
          </label>
          <Link
            to="/login"
            className="text-sm font-semibold text-brand hover:text-brand-2"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" isLoading={busy}>
          Sign in
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-ink-2">
        New to TaskFlow?{" "}
        <Link
          to="/register"
          className="font-semibold text-brand hover:text-brand-2"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
