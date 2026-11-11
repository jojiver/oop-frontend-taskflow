import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ListTodo,
  type LucideIcon,
} from "lucide-react";
import type { DashboardSummary } from "@/services/dashboard-service";

const TONES: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
};

type Item = {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  tone: keyof typeof TONES;
};

export function StatCards({
  summary,
  dueToday,
}: {
  summary: DashboardSummary;
  dueToday: number;
}) {
  const items: Item[] = [
    {
      label: "Total tasks",
      value: summary.total,
      hint: "Across 4 categories",
      icon: ListTodo,
      tone: "blue",
    },
    {
      label: "Completed",
      value: summary.completed,
      hint: `${summary.completionRate}% completion`,
      icon: CheckCircle2,
      tone: "green",
    },
    {
      label: "Pending",
      value: summary.pending,
      hint: `${dueToday} due today`,
      icon: Clock3,
      tone: "amber",
    },
    {
      label: "Overdue",
      value: summary.overdue,
      hint: "Needs attention",
      icon: AlertTriangle,
      tone: "red",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.4)]"
          >
            <span
              className={`grid size-11 shrink-0 place-items-center rounded-xl ${TONES[item.tone]}`}
            >
              <Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-ink">{item.value}</p>
              <p className="text-[11px] font-medium text-ink-2">{item.label}</p>
              <p className="truncate text-[10px] text-ink-3">{item.hint}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
