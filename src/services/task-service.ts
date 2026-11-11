import { http } from "@/lib/axios";

export type Priority = "low" | "medium" | "high";
export type Category = "school" | "personal" | "work" | "others";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: Priority;
  category: Category;
  completed: boolean;
  completedAt: string | null;
  createdAt: string | null;
  isOverdue: boolean;
};

export type TaskInput = {
  title: string;
  description: string | null;
  due_date: string | null;
  priority: Priority;
  category: Category;
};

export type TaskFilters = {
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
  sort?: string;
};

export async function listTasksService(
  filters: TaskFilters = {},
): Promise<Task[]> {
  const response = await http.get("/tasks", { params: filters });
  return response.data.data as Task[];
}

export async function createTaskService(input: TaskInput): Promise<Task> {
  const response = await http.post("/tasks", input);
  return response.data.data as Task;
}

export async function updateTaskService(
  id: number,
  input: Partial<TaskInput>,
): Promise<Task> {
  const response = await http.put(`/tasks/${id}`, input);
  return response.data.data as Task;
}

export async function toggleTaskService(id: number): Promise<Task> {
  const response = await http.post(`/tasks/${id}/toggle`);
  return response.data.data as Task;
}

export async function deleteTaskService(id: number): Promise<void> {
  await http.delete(`/tasks/${id}`);
}

export const CATEGORY_LABEL: Record<Category, string> = {
  school: "School",
  personal: "Personal",
  work: "Work",
  others: "Others",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
