import type { Priority } from "@/services/task-service";

export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export function daysFromToday(value: string | null | undefined): number | null {
  const date = parseDate(value);
  if (!date) return null;

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  return Math.round(
    (target.getTime() - startOfToday().getTime()) / 86_400_000,
  );
}

export function dueLabel(
  dueDate: string | null,
  completed: boolean,
): { text: string; tone: "overdue" | "today" | "soon" | "muted" } {
  if (completed) return { text: "Completed", tone: "muted" };

  const days = daysFromToday(dueDate);
  if (days === null) return { text: "No due date", tone: "muted" };
  if (days < 0) {
    const n = Math.abs(days);
    return { text: `Overdue by ${n} day${n === 1 ? "" : "s"}`, tone: "overdue" };
  }
  if (days === 0) return { text: "Today", tone: "today" };
  if (days === 1) return { text: "Tomorrow", tone: "soon" };
  return { text: `In ${days} days`, tone: "muted" };
}

export function formatLongDate(date = new Date()): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(value: string | null): string {
  const date = parseDate(value);
  if (!date) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function priorityWeight(priority: Priority): number {
  if (priority === "high") return 3;
  if (priority === "medium") return 2;
  return 1;
}
