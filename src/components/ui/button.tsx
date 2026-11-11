import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "soft";
type Size = "sm" | "md" | "lg" | "icon";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  children?: ReactNode;
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] text-white shadow-[0_12px_30px_-12px_rgba(59,130,246,0.9)] hover:brightness-105 active:brightness-95",
  secondary:
    "border border-line bg-white text-ink hover:bg-slate-50 active:bg-slate-100",
  ghost: "text-ink-2 hover:bg-slate-100 hover:text-ink",
  danger:
    "bg-gradient-to-r from-[#fb7185] to-[#ef4444] text-white shadow-[0_12px_30px_-12px_rgba(239,68,68,0.8)] hover:brightness-105",
  soft: "bg-slate-100 text-ink-2 hover:bg-slate-200",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
  icon: "size-10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  ),
);

Button.displayName = "Button";

export default Button;
