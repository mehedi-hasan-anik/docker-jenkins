import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date using Intl.DateTimeFormat.
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", options).format(d);
}

/**
 * Sleep helper, useful for mocked async flows.
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

export type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

export const APP_NAME = "Turborepo Next Stack";
export const DEFAULT_PAGE_SIZE = 20;
