import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type TaskTabKey = "all" | "today" | "upcoming" | "pending" | "completed";
export type SortKey = "due_date" | "priority";

const TABS: { key: TaskTabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
];

type TaskTabsProps = {
  value: TaskTabKey;
  counts: Record<TaskTabKey, number>;
  sort: SortKey;
  onChange: (value: TaskTabKey) => void;
  onSort: (value: SortKey) => void;
};

export function TaskTabs({ value, counts, sort, onChange, onSort }: TaskTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-line bg-white p-1">
        {TABS.map((tab) => {
          const active = tab.key === value;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition",
                active
                  ? "bg-white text-ink shadow-sm ring-1 ring-line"
                  : "text-ink-3 hover:text-ink-2",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "text-[10px]",
                  active ? "text-ink-3" : "text-ink-3/70",
                )}
              >
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onSort(sort === "due_date" ? "priority" : "due_date")}
        className="ml-auto flex cursor-pointer items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-xs font-medium text-ink-2 hover:bg-slate-50"
      >
        <ArrowUpDown className="size-3.5" />
        {sort === "due_date" ? "Due date" : "Priority"}
      </button>
    </div>
  );
}
