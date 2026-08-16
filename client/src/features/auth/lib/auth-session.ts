import type { AuthUser } from "../types";

const ACCESS_TOKEN_KEY = "fluxa-accessToken";
const USER_KEY = "fluxa-user";

export function saveSession(accessToken: string, user: AuthUser) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
