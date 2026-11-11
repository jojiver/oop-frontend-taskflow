import { http } from "@/lib/axios";
import type { Task } from "@/services/task-service";
import type { User } from "@/services/auth-service";

export type DashboardSummary = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  categories: Record<string, number>;
};

export type DashboardData = {
  user: User;
  summary: DashboardSummary;
  priorityMix: Record<"high" | "medium" | "low", number>;
  nextUp: Task[];
};

export async function getDashboardService(): Promise<DashboardData> {
  const response = await http.get("/dashboard");
  return response.data.data as DashboardData;
}
