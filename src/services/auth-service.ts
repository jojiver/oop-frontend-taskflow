import { http } from "@/lib/axios";

export type User = {
  id: number;
  name: string;
  email: string;
  initials: string;
  createdAt?: string;
};

export type AuthResult = {
  user: User;
  token: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export async function loginService(
  email: string,
  password: string,
): Promise<AuthResult> {
  const response = await http.post("/auth/login", { email, password });
  return response.data.data as AuthResult;
}

export async function registerService(
  input: RegisterInput,
): Promise<AuthResult> {
  const response = await http.post("/auth/register", input);
  return response.data.data as AuthResult;
}

export async function meService(): Promise<User> {
  const response = await http.get("/auth/me");
  return response.data.data as User;
}

export async function logoutService(): Promise<void> {
  await http.post("/auth/logout");
}
