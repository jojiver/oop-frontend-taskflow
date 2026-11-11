import {
  CalendarDays,
  Check,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { CategoryIcon } from "@/components/features/tasks/category-icon";
import { CATEGORY_META, PRIORITY_META } from "@/components/features/tasks/meta";
import { dueLabel } from "@/lib/date";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/services/task-service";

type TaskRowProps = {
  task: Task;
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
};

export function TaskRow({ task, onOpen, onEdit, onDelete, onToggle }: TaskRowProps) {
  const due = dueLabel(task.dueDate, task.completed);
  const priority = PRIORITY_META[task.priority];
  const category = CATEGORY_META[task.category];

  const dueClass =
    due.tone === "overdue"
      ? "bg-red-50 text-red-600"
      : due.tone === "today"
        ? "bg-amber-50 text-amber-600"
        : "bg-slate-50 text-ink-3";

  return (
    <li
      className={cn(
        "relative flex items-start gap-3 rounded-2xl border border-line bg-white p-4 pl-5 shadow-[0_10px_30px_-26px_rgba(15,23,42,0.5)]",
        task.completed && "opacity-80",
      )}
    >
      <span
        className={cn(
          "absolute top-3 bottom-3 left-0 w-1 rounded-full",
          task.completed ? "bg-slate-200" : priority.bar,
        )}
      />

      <button
        type="button"
        aria-label={task.completed ? "Mark as pending" : "Mark as complete"}
        onClick={() => onToggle(task)}
        className={cn(
          "mt-0.5 grid size-5 shrink-0 cursor-pointer place-items-center rounded-full border transition",
          task.completed
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300 text-transparent hover:border-emerald-400",
        )}
      >
        <Check className="size-3" strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-semibold",
            task.completed ? "text-ink-3 line-through" : "text-ink",
          )}
        >
          {task.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-ink-3">
          {task.description || "No description"}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] text-ink-3">
            <span className={cn("size-1.5 rounded-full", category.dot)} />
            <CategoryIcon category={task.category} className="size-3" />
            {category.label}
          </span>

          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
              dueClass,
            )}
          >
            <CalendarDays className="size-3" />
            {due.text}
          </span>

          <Badge tone={task.completed ? "completed" : priority.tone}>
            {task.completed ? "Done" : priority.label}
          </Badge>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          aria-label="View task"
          onClick={() => onOpen(task)}
          className="grid size-8 cursor-pointer place-items-center rounded-lg text-ink-3 hover:bg-slate-100 hover:text-ink"
        >
          <Eye className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Edit task"
          onClick={() => onEdit(task)}
          className="grid size-8 cursor-pointer place-items-center rounded-lg text-ink-3 hover:bg-slate-100 hover:text-ink"
        >
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Delete task"
          onClick={() => onDelete(task)}
          className="grid size-8 cursor-pointer place-items-center rounded-lg text-ink-3 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
  );
}
