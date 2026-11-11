import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-11 w-full rounded-xl border bg-[#f8fafc] px-3.5 text-sm text-ink outline-none placeholder:text-ink-3",
        "focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10",
        "disabled:cursor-not-allowed disabled:opacity-60",
        invalid ? "border-high" : "border-line",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";

export default Input;
