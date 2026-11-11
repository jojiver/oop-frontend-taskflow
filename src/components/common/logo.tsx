import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

type LogoProps = {
  dark?: boolean;
  withSubtitle?: boolean;
  size?: "sm" | "md" | "lg";
};

const MARK_SIZES = {
  sm: "size-8 rounded-[10px]",
  md: "size-10 rounded-xl",
  lg: "size-12 rounded-2xl",
};

const TEXT_SIZES = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

export function Logo({ dark = false, withSubtitle = true, size = "md" }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "grid place-items-center bg-gradient-to-br from-[#60a5fa] to-[#4f46e5] text-white shadow-[0_8px_20px_-8px_rgba(59,130,246,0.9)]",
          MARK_SIZES[size],
        )}
      >
        <Check className={size === "lg" ? "size-6" : "size-5"} strokeWidth={3} />
      </span>

      <div className="leading-tight">
        <p
          className={cn(
            "font-bold tracking-tight",
            TEXT_SIZES[size],
            dark ? "text-white" : "text-ink",
          )}
        >
          TaskFlow
        </p>
        {withSubtitle && (
          <p className={cn("text-[11px]", dark ? "text-white/40" : "text-ink-3")}>
            Daily planner
          </p>
        )}
      </div>
    </div>
  );
}

export default Logo;
