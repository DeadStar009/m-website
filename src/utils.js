import { clsx } from 'clsx';

/**
 * Combines multiple class names into a single string, handling conditionals
 * @param {...string} inputs - Class names or conditional expressions
 * @returns {string} - Combined class names
 */
export function cn(...inputs) {
  return clsx(inputs);
}