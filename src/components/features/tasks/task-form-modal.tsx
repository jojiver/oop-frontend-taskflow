import { useState } from "react";
import type { FormEvent } from "react";
import { CalendarDays, Info, Pencil, Plus, Trash2 } from "lucide-react";
import { CategoryIcon } from "@/components/features/tasks/category-icon";
import { CATEGORY_META } from "@/components/features/tasks/meta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { apiErrorMessage } from "@/lib/axios";
import { cn } from "@/lib/cn";
import type { Category, Priority, Task, TaskInput } from "@/services/task-service";

const PRIORITIES: Priority[] = ["low", "medium", "high"];
const CATEGORIES: Category[] = ["school", "personal", "work", "others"];

const PRIORITY_DOT: Record<Priority, string> = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-red-500",
};

type TaskFormModalProps = {
  open: boolean;
  initial: Task | null;
  onClose: () => void;
  onSubmit: (input: TaskInput) => Promise<void>;
  onDelete?: (task: Task) => void;
};

export function TaskFormModal({
  open,
  initial,
  onClose,
  onSubmit,
  onDelete,
}: TaskFormModalProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");
  const [category, setCategory] = useState<Category>(initial?.category ?? "school");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isEdit = initial !== null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setBusy(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate || null,
        priority,
        category,
      });
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#60a5fa] to-[#4f46e5] text-white shadow-[0_10px_24px_-10px_rgba(59,130,246,0.9)]">
          {isEdit ? <Pencil className="size-5" /> : <Plus className="size-5" />}
        </span>
        <div>
          <h2 className="text-xl font-bold text-ink">
            {isEdit ? "Edit task" : "Add new task"}
          </h2>
          <p className="mt-0.5 text-sm text-ink-2">
            {isEdit
              ? "Update the details and keep moving."
              : "Capture what needs to get done."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="task-title"
            className="mb-2 block text-[11px] font-semibold tracking-[0.08em] text-ink-2 uppercase"
          >
            Task title
          </label>
          <Input
            id="task-title"
            required
            placeholder="e.g. Finish calculus problem set"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="mb-2 block text-[11px] font-semibold tracking-[0.08em] text-ink-2 uppercase"
          >
            Description
          </label>
          <textarea
            id="task-description"
            rows={3}
            placeholder="Add notes, links, or context…"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full resize-y rounded-xl border border-line bg-[#f8fafc] px-3.5 py-3 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="task-due-date"
              className="mb-2 block text-[11px] font-semibold tracking-[0.08em] text-ink-2 uppercase"
            >
              Due date
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-3" />
              <Input
                id="task-due-date"
                type="date"
                className="pl-10"
                value={dueDate ?? ""}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 block text-[11px] font-semibold tracking-[0.08em] text-ink-2 uppercase">
              Priority
            </p>
            <div className="flex gap-1 rounded-xl border border-line bg-slate-50 p-1">
              {PRIORITIES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPriority(value)}
                  className={cn(
                    "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold capitalize transition",
                    priority === value
                      ? "bg-white text-ink shadow-sm ring-1 ring-line"
                      : "text-ink-3 hover:text-ink-2",
                  )}
                >
                  <span className={cn("size-1.5 rounded-full", PRIORITY_DOT[value])} />
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 block text-[11px] font-semibold tracking-[0.08em] text-ink-2 uppercase">
            Category
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CATEGORIES.map((value) => {
              const meta = CATEGORY_META[value];
              const active = category === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition",
                    active
                      ? "border-brand bg-blue-50 text-brand"
                      : "border-line bg-slate-50 text-ink-2 hover:bg-slate-100",
                  )}
                >
                  <CategoryIcon category={value} className="size-3.5" />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[#eef2ff] px-3 py-2.5 text-xs text-[#4f46e5]">
          <Info className="size-4 shrink-0" />
          Past due dates are saved as overdue tasks.
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          {isEdit && onDelete ? (
            <button
              type="button"
              onClick={() => initial && onDelete(initial)}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600"
            >
              <Trash2 className="size-3.5" />
              Delete task
            </button>
          ) : (
            <span />
          )}

          <div className="ml-auto flex items-center gap-2">
            <Button type="button" variant="soft" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={busy}>
              {isEdit ? "Save changes" : "Add task"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
