import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalDayNumber() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60 * 1000;
  return Math.floor((now.getTime() - offsetMs) / 86400000);
}

export function safeGetJSON<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function safeSetJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function isSizeMatching(s1: string, s2: string) {
   const normalize = (s: string) => s.toLowerCase().replace(/[^0-9x]/g, '');
   return normalize(s1) === normalize(s2);
}

export function isTypeMatching(t1: string, t2: string) {
   return t2.toLowerCase().includes(t1.toLowerCase());
}
