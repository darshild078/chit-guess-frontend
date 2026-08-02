import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple classes into a single string using tailwind-merge and clsx.
 * This ensures that conflicting Tailwind classes are resolved properly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
