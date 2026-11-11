import { ChevronRight } from "lucide-react";
import { CategoryIcon } from "@/components/features/tasks/category-icon";
import { CATEGORY_META } from "@/components/features/tasks/meta";
import { dueLabel } from "@/lib/date";
import type { Task } from "@/services/task-service";

export function NextUp({
  tasks,
  onOpen,
}: {
  tasks: Task[];
  onOpen: (task: Task) => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.4)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Next up</p>
        <span className="text-[11px] font-semibold text-brand">View all</span>
      </div>

      {tasks.length === 0 ? (
        <p className="mt-4 text-xs text-ink-3">Nothing scheduled ahead.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {tasks.map((task) => {
            const due = dueLabel(task.dueDate, task.completed);
            const meta = CATEGORY_META[task.category];

            return (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => onOpen(task)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-slate-50 p-2.5 text-left transition hover:bg-slate-100"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-ink-2 shadow-sm">
                    <CategoryIcon category={task.category} className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink">
                      {task.title}
                    </p>
                    <p className="truncate text-[10px] text-ink-3">
                      {meta.label} · {due.text}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-ink-3" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
