import type { BadgeTone } from "@/components/ui/badge";
import type { Category, Priority } from "@/services/task-service";

export const CATEGORY_META: Record<
  Category,
  { label: string; dot: string; soft: string }
> = {
  school: { label: "School", dot: "bg-blue-500", soft: "bg-blue-50 text-blue-600" },
  personal: {
    label: "Personal",
    dot: "bg-violet-500",
    soft: "bg-violet-50 text-violet-600",
  },
  work: {
    label: "Work",
    dot: "bg-emerald-500",
    soft: "bg-emerald-50 text-emerald-600",
  },
  others: { label: "Others", dot: "bg-slate-400", soft: "bg-slate-100 text-slate-500" },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; tone: BadgeTone; bar: string; border: string }
> = {
  high: { label: "High", tone: "high", bar: "bg-red-500", border: "border-l-red-400" },
  medium: {
    label: "Medium",
    tone: "medium",
    bar: "bg-amber-500",
    border: "border-l-amber-400",
  },
  low: {
    label: "Low",
    tone: "low",
    bar: "bg-emerald-500",
    border: "border-l-emerald-400",
  },
};
