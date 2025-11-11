import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeSellerName(name: string | null | undefined): string {
  if (!name) return '';
  
  // Remove accents
  const cleaned = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Trim, collapse multiple spaces, get first name
  const first = cleaned.trim().replace(/\s+/g, ' ').split(' ')[0];
  
  return first.toUpperCase();
}
