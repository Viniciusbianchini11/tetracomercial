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

export function convertSalesDateFormat(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  
  // Input: YYYY-DD-MM (from relatorio_faturamento)
  // Output: YYYY-MM-DD (ISO standard)
  const parts = dateStr.split('-');
  
  if (parts.length === 3) {
    const [year, day, month] = parts;
    return `${year}-${month}-${day}`;
  }
  
  return dateStr;
}
