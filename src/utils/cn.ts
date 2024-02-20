// Pass conditional classes
import clsx from "clsx";
import { ClassValue } from "clsx";
// Merge tailwind classes
import { twMerge } from "tailwind-merge";

// className function - for occasions when we may or may not want a className as a property
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}