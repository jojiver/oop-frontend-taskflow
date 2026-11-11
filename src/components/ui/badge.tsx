import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeTone =
  | "high"
  | "medium"
  | "low"
  | "overdue"
  | "pending"
  | "completed"
  | "neutral";

const TONES: Record<BadgeTone, string> = {
  high: "bg-red-50 text-red-600 ring-1 ring-red-100",
  medium: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
  low: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
  overdue: "bg-red-50 text-red-600 ring-1 ring-red-100",
  pending: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
  completed: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
  neutral: "bg-slate-100 text-slate-600",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  dot?: boolean;
};

export function Badge({ className, tone = "neutral", dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        TONES[tone],
        className,
      )}
      {...props}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export type { BadgeTone };
export default Badge;
