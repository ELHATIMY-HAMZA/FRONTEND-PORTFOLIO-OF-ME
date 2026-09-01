import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditional className merge. Required by Magic UI / Aceternity UI
 * component patterns and used throughout this project.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
