import type { ReactNode } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  Flag,
  Pencil,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { CategoryIcon } from "@/components/features/tasks/category-icon";
import { CATEGORY_META, PRIORITY_META } from "@/components/features/tasks/meta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { dueLabel, formatShortDate } from "@/lib/date";
import type { Task } from "@/services/task-service";

type TaskDetailModalProps = {
  task: Task | null;
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskDetailModal({
  task,
  open,
  busy,
  onClose,
  onToggle,
  onEdit,
  onDelete,
}: TaskDetailModalProps) {
  if (!task) return null;

  const due = dueLabel(task.dueDate, task.completed);
  const priority = PRIORITY_META[task.priority];
  const category = CATEGORY_META[task.category];

  return (
    <Modal open={open} onClose={onClose} size="md" showClose={false}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Task details</h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="grid size-7 cursor-pointer place-items-center rounded-lg text-ink-3 hover:bg-slate-100 hover:text-ink"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <Badge tone={priority.tone} dot>
          {priority.label}
        </Badge>
        <Badge tone={task.completed ? "completed" : "pending"} dot>
          {task.completed ? "Completed" : "Pending"}
        </Badge>
        {task.isOverdue && !task.completed && (
          <Badge tone="overdue" dot>
            Overdue
          </Badge>
        )}
      </div>

      <h3 className="mt-4 text-xl font-bold text-ink">{task.title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-ink-2">
        {task.description || "No description provided."}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <InfoCard
          icon={<CategoryIcon category={task.category} className="size-4" />}
          label="Category"
          value={category.label}
        />
        <InfoCard
          icon={<Flag className="size-4" />}
          label="Priority"
          value={priority.label}
        />
        <InfoCard
          icon={<CalendarDays className="size-4" />}
          label="Due date"
          value={
            <span className={due.tone === "overdue" ? "text-red-500" : undefined}>
              {due.text === "No due date"
                ? formatShortDate(task.dueDate)
                : `${due.text} · ${formatShortDate(task.dueDate)}`}
            </span>
          }
        />
        <InfoCard
          icon={<Clock3 className="size-4" />}
          label="Created"
          value={formatShortDate(task.createdAt)}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <Button
          className="bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_12px_30px_-12px_rgba(16,185,129,0.8)]"
          isLoading={busy}
          onClick={() => onToggle(task)}
        >
          <Check className="size-4" />
          {task.completed ? "Mark as pending" : "Mark as complete"}
        </Button>
        <Button variant="soft" onClick={() => onEdit(task)}>
          <Pencil className="size-4" />
          Edit
        </Button>
        <Button
          variant="soft"
          className="text-red-500 hover:bg-red-50"
          onClick={() => onDelete(task)}
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>
    </Modal>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] text-ink-3 uppercase">
        <Tag className="size-3" />
        {label}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ink">
        <span className="text-ink-3">{icon}</span>
        {value}
      </p>
    </div>
  );
}
