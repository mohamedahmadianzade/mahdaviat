/**
 * localStorage-backed persistence layer.
 * Acts like JSON files: admin writes, site reads, data survives refresh.
 */

const PREFIX = 'mahdaviat_';

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — silently fail
  }
}

export function resetKey(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

export const STORAGE_KEYS = {
  books: 'books',
  bookCategories: 'book_categories',
  products: 'products',
  productCategories: 'product_categories',
  storeSettings: 'store_settings',
  orgUnits: 'org_units',
  orgMembers: 'org_members',
} as const;
