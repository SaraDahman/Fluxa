import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
});

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data?.message) {
      return data.message;
    }
  }

  return fallback;
}
