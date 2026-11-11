import { ProgressBar } from "@/components/ui/progress-bar";

const ROWS = [
  { key: "high", label: "High", dot: "bg-red-500", bar: "bg-red-500" },
  { key: "medium", label: "Medium", dot: "bg-amber-500", bar: "bg-amber-500" },
  { key: "low", label: "Low", dot: "bg-emerald-500", bar: "bg-emerald-500" },
] as const;

export function PriorityMix({
  mix,
  total,
}: {
  mix: Record<"high" | "medium" | "low", number>;
  total: number;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.4)]">
      <p className="text-sm font-semibold text-ink">Priority mix</p>
      <p className="text-[11px] text-ink-3">Across all tasks</p>

      <ul className="mt-4 space-y-3">
        {ROWS.map((row) => {
          const count = mix[row.key] ?? 0;
          const percent = total === 0 ? 0 : (count / total) * 100;

          return (
            <li key={row.key}>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink-2">
                  <span className={`size-2 rounded-full ${row.dot}`} />
                  {row.label}
                </span>
                <span className="font-semibold text-ink-2">{count}</span>
              </div>
              <ProgressBar
                className="mt-1.5"
                value={percent}
                tone={row.key === "high" ? "high" : row.key === "medium" ? "medium" : "low"}
              />
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-[11px] text-ink-3">
        {(mix.high ?? 0) > 1
          ? "High priority needs attention."
          : "You are keeping priorities balanced."}
      </p>
    </div>
  );
}
