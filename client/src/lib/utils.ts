import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { matchPath } from "react-router-dom";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isRouteActive(path: string | string[], pathname: string): boolean {
  const patterns = Array.isArray(path) ? path : [path];
  return patterns.some((pattern) => matchPath(pattern, pathname) !== null);
}
