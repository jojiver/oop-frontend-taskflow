import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

const TOKEN_KEY = "taskflow_token";

export const tokenStore = {
  get() {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

export const http = axios.create({
  baseURL,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = tokenStore.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.clear();
      window.dispatchEvent(new Event("taskflow:unauthorized"));
    }

    return Promise.reject(error);
  },
);

type ApiError = {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
};

export function apiErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const data = (error as ApiError).response?.data;
    const firstError = data?.errors
      ? Object.values(data.errors).flat()[0]
      : undefined;

    if (firstError) return firstError;
    if (data?.message) return data.message;
  }

  if (error instanceof Error && error.message) return error.message;

  return "Something went wrong. Please try again.";
}
