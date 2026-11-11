import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Sparkles } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { useAuth } from "@/components/context/use-auth";
import { NextUp } from "@/components/features/dashboard/next-up";
import { PriorityMix } from "@/components/features/dashboard/priority-mix";
import { ProgressCard } from "@/components/features/dashboard/progress-card";
import { Sidebar } from "@/components/features/dashboard/sidebar";
import type { TaskCounts } from "@/components/features/dashboard/sidebar";
import { StatCards } from "@/components/features/dashboard/stat-cards";
import { DeleteTaskModal } from "@/components/features/tasks/delete-task-modal";
import { TaskDetailModal } from "@/components/features/tasks/task-detail-modal";
import { TaskFormModal } from "@/components/features/tasks/task-form-modal";
import { TaskRow } from "@/components/features/tasks/task-row";
import { TaskTabs } from "@/components/features/tasks/task-tabs";
import type { SortKey, TaskTabKey } from "@/components/features/tasks/task-tabs";
import { Button } from "@/components/ui/button";
import { apiErrorMessage } from "@/lib/axios";
import { daysFromToday, formatLongDate, priorityWeight } from "@/lib/date";
import type { DashboardData } from "@/services/dashboard-service";
import { getDashboardService } from "@/services/dashboard-service";
import {
  createTaskService,
  deleteTaskService,
  listTasksService,
  toggleTaskService,
  updateTaskService,
} from "@/services/task-service";
import type { Task, TaskInput } from "@/services/task-service";

export default function DashboardPage() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState<TaskTabKey>("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("due_date");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [detail, setDetail] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [modalBusy, setModalBusy] = useState(false);

  async function load() {
    const [dashboardData, taskList] = await Promise.all([
      getDashboardService(),
      listTasksService(),
    ]);

    setDashboard(dashboardData);
    setTasks(taskList);
  }

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        await load();
      } catch (requestError) {
        if (active) setError(apiErrorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo<TaskCounts>(() => {
    const result: TaskCounts = {
      all: tasks.length,
      today: 0,
      upcoming: 0,
      pending: 0,
      completed: 0,
      overdue: 0,
      categories: { school: 0, personal: 0, work: 0, others: 0 },
    };

    for (const task of tasks) {
      if (task.completed) {
        result.completed += 1;
      } else {
        result.pending += 1;
        const days = daysFromToday(task.dueDate);
        if (days === 0) result.today += 1;
        if (days !== null && days > 0) result.upcoming += 1;
        if (days !== null && days < 0) result.overdue += 1;
      }

      result.categories[task.category] = (result.categories[task.category] ?? 0) + 1;
    }

    return result;
  }, [tasks]);

  const filtered = useMemo(() => {
    const list = tasks.filter((task) => {
      if (category !== "all" && task.category !== category) return false;

      const days = daysFromToday(task.dueDate);

      if (status === "today" && (task.completed || days !== 0)) return false;
      if (status === "upcoming" && (task.completed || days === null || days <= 0))
        return false;
      if (status === "pending" && task.completed) return false;
      if (status === "completed" && !task.completed) return false;
      if (search && !task.title.toLowerCase().includes(search.toLowerCase()))
        return false;

      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "priority") {
        return priorityWeight(b.priority) - priorityWeight(a.priority);
      }

      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });
  }, [tasks, category, status, search, sort]);

  const summary = dashboard?.summary ?? {
    total: counts.all,
    completed: counts.completed,
    pending: counts.pending,
    overdue: counts.overdue,
    completionRate:
      counts.all === 0 ? 0 : Math.round((counts.completed / counts.all) * 100),
    categories: counts.categories,
  };

  const priorityMix = dashboard?.priorityMix ?? {
    high: tasks.filter((task) => task.priority === "high").length,
    medium: tasks.filter((task) => task.priority === "medium").length,
    low: tasks.filter((task) => task.priority === "low").length,
  };

  const nextUp =
    dashboard?.nextUp ??
    tasks
      .filter((task) => !task.completed)
      .sort((a, b) => {
        const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      })
      .slice(0, 3);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = user?.name.split(" ")[0] ?? "there";

  async function handleSubmit(input: TaskInput) {
    if (editing) {
      await updateTaskService(editing.id, input);
    } else {
      await createTaskService(input);
    }

    setFormOpen(false);
    setEditing(null);
    await load();
  }

  async function handleToggle(task: Task) {
    setModalBusy(true);
    setError("");

    try {
      await toggleTaskService(task.id);
      await load();
      setDetail((current) =>
        current && current.id === task.id
          ? { ...current, completed: !task.completed, isOverdue: false }
          : current,
      );
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setModalBusy(false);
    }
  }

  async function handleDelete(task: Task) {
    setModalBusy(true);
    setError("");

    try {
      await deleteTaskService(task.id);
      setDeleting(null);
      setDetail(null);
      await load();
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setModalBusy(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditing(task);
    setFormOpen(true);
  }

  function openDelete(task: Task) {
    setDeleting(task);
  }

  if (!user) return null;

  return (
    <div className="flex min-h-svh bg-[#eef4fb] text-ink">
      <Sidebar
        user={user}
        counts={counts}
        completionRate={summary.completionRate}
        activeStatus={status}
        activeCategory={category}
        onStatus={(value) => {
          setStatus(value as TaskTabKey);
          setCategory("all");
        }}
        onCategory={(value) => {
          setCategory(value);
          setStatus("all");
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="px-5 pt-6 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <Logo size="sm" withSubtitle={false} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  {greeting}, {firstName}
                </h1>
                <p className="text-xs text-ink-2 sm:text-sm">
                  {formatLongDate()} · You have {counts.today} task
                  {counts.today === 1 ? "" : "s"} due today.
                </p>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-3" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tasks by title…"
                  className="h-10 w-[240px] rounded-xl border border-line bg-white pr-3 pl-10 text-xs text-ink outline-none placeholder:text-ink-3 focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
              </div>

              <Button className="h-10 px-4" onClick={openCreate}>
                <Plus className="size-4" />
                Add task
              </Button>

              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#60a5fa] to-[#4f46e5] text-xs font-bold text-white">
                {user.initials}
              </span>
            </div>
          </div>

          <div className="relative mt-3 sm:hidden">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-3" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks by title…"
              className="h-10 w-full rounded-xl border border-line bg-white pr-3 pl-10 text-xs text-ink outline-none placeholder:text-ink-3 focus:border-brand focus:ring-4 focus:ring-brand/10"
            />
          </div>
        </header>

        <main className="flex-1 px-5 pt-5 pb-8 sm:px-7">
          {error && (
            <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <StatCards summary={summary} dueToday={counts.today} />

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-ink">My tasks</h2>
                <span className="text-xs text-ink-3">{filtered.length} tasks</span>
              </div>

              <div className="mt-3">
                <TaskTabs
                  value={status}
                  counts={{
                    all: counts.all,
                    today: counts.today,
                    upcoming: counts.upcoming,
                    pending: counts.pending,
                    completed: counts.completed,
                  }}
                  sort={sort}
                  onChange={(value) => {
                    setStatus(value);
                    setCategory("all");
                  }}
                  onSort={setSort}
                />
              </div>

              {loading ? (
                <div className="mt-4 space-y-3">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-2xl bg-white"
                    />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
                  <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-brand">
                    <Sparkles className="size-5" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-ink">
                    No tasks here yet
                  </h3>
                  <p className="mt-1 max-w-xs text-xs text-ink-3">
                    Adjust the filters or add a new task to get started.
                  </p>
                  <Button className="mt-4" size="sm" onClick={openCreate}>
                    <Plus className="size-3.5" />
                    Add task
                  </Button>
                </div>
              ) : (
                <ul className="mt-4 space-y-3">
                  {filtered.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onOpen={setDetail}
                      onEdit={openEdit}
                      onDelete={openDelete}
                      onToggle={handleToggle}
                    />
                  ))}
                </ul>
              )}
            </section>

            <aside className="space-y-4">
              <ProgressCard summary={summary} />
              <PriorityMix mix={priorityMix} total={summary.total} />
              <NextUp tasks={nextUp} onOpen={setDetail} />
            </aside>
          </div>
        </main>
      </div>

      <TaskFormModal
        key={`${editing?.id ?? "new"}-${formOpen ? "open" : "closed"}`}
        open={formOpen}
        initial={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        onDelete={(task) => {
          setFormOpen(false);
          setEditing(null);
          openDelete(task);
        }}
      />

      <TaskDetailModal
        open={detail !== null}
        task={detail}
        busy={modalBusy}
        onClose={() => setDetail(null)}
        onToggle={handleToggle}
        onEdit={(task) => {
          setDetail(null);
          openEdit(task);
        }}
        onDelete={(task) => {
          setDetail(null);
          openDelete(task);
        }}
      />

      <DeleteTaskModal
        open={deleting !== null}
        task={deleting}
        busy={modalBusy}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
