import type { ReactNode } from "react";
import { Logo } from "@/components/common/logo";
import { FocusPreview } from "./focus-preview";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#0a0f1c] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-40 -left-32 size-[420px] rounded-full bg-[#1d4ed8]/30 blur-[100px]" />
        <div className="pointer-events-none absolute right-[-120px] bottom-[-80px] size-[380px] rounded-full bg-[#4f46e5]/20 blur-[110px]" />

        <div className="relative">
          <Logo dark size="md" />
        </div>

        <div className="relative max-w-[470px]">
          <h1 className="text-[44px] leading-[1.1] font-bold tracking-tight">
            A calmer day
            <br />
            starts with a
            <br />
            clear list.
          </h1>
          <p className="mt-6 text-sm leading-6 text-white/50">
            Plan your tasks, protect your focus,
            <br />
            and finish what matters.
          </p>
        </div>

        <div className="relative max-w-[400px]">
          <FocusPreview />
        </div>

        <p className="relative text-[11px] text-white/25">
          Built for focused days.
        </p>
      </aside>

      <main className="relative flex items-center justify-center overflow-hidden bg-[#f7f9fc] px-5 py-10 sm:px-8">
        <div className="pointer-events-none absolute -top-40 right-0 size-[420px] rounded-full bg-blue-200/50 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 size-[360px] rounded-full bg-rose-200/40 blur-[120px]" />

        <div className="relative w-full max-w-[560px]">
          <div className="mb-6 lg:hidden">
            <Logo size="sm" />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

export default AuthShell;
