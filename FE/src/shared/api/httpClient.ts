export type ListResponse<T> = {
  items: T[];
  total: number;
};

export type ApiErrorBody = {
  message: string;
  status: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const fallback: ApiErrorBody = { message: response.statusText, status: response.status };
    throw fallback;
  }

  return response.json() as Promise<T>;
}
