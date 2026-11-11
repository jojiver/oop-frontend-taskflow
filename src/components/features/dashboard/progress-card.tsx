import { Target } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { DashboardSummary } from "@/services/dashboard-service";

export function ProgressCard({ summary }: { summary: DashboardSummary }) {
  const dots = Math.min(summary.total, 12);

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.4)]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-[0.12em] text-ink-3 uppercase">
          Overall progress
        </p>
        <Target className="size-4 text-ink-3" />
      </div>

      <p className="mt-2 text-3xl font-bold text-ink">{summary.completionRate}%</p>
      <p className="text-xs text-ink-3">
        {summary.completed} of {summary.total} tasks completed
      </p>

      <ProgressBar className="mt-3" value={summary.completionRate} />

      <div className="mt-4 flex items-center gap-1.5">
        {Array.from({ length: dots }).map((_, index) => (
          <span
            key={index}
            className={
              index < summary.completed
                ? "size-1.5 rounded-full bg-emerald-500"
                : "size-1.5 rounded-full bg-slate-200"
            }
          />
        ))}
      </div>

      <p className="mt-3 text-[11px] text-ink-3">
        {summary.completed === 0
          ? "Complete your first task to start the streak."
          : `One more task to reach ${Math.min(100, summary.completionRate + 14)}%.`}
      </p>
    </div>
  );
}
