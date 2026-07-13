import type { Product, ProductCategory, ProductSearchFilters, StoreSettings } from '../types';
import { defaultProducts, defaultCategories } from '../data/products';
import { defaultSettings } from '../types';

let _categories: ProductCategory[] = [...defaultCategories];
let _products: Product[] = [...defaultProducts];
let _settings: StoreSettings = { ...defaultSettings };

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const matches = (field: string | undefined, term: string) => !term || (!!field && normalize(field).includes(normalize(term)));
const matchesAny = (arr: string[] | undefined, term: string) => !term || (!!arr?.length && arr.some((k) => normalize(k).includes(normalize(term))));

export async function searchProducts(filters: ProductSearchFilters) {
  await delay(300);
  const results = _products.filter((p) => p.active).sort((a, b) => a.order - b.order).filter((p) => {
    if (filters.categoryId && p.categoryId !== filters.categoryId) return false;
    const q = filters.query.trim();
    if (!q) return true;
    return matches(p.name, q) || matches(p.shortDescription, q) || matches(p.description, q) || matchesAny(p.keywords, q);
  });
  return { products: results, total: results.length };
}

export async function getProductById(id: string): Promise<Product | null> { await delay(200); return _products.find((p) => p.id === id) ?? null; }
export async function getSimilarProducts(product: Product): Promise<Product[]> { return (product.similarIds ?? []).map((id) => _products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p)); }
export async function getCategories(): Promise<ProductCategory[]> { await delay(100); return [..._categories].sort((a, b) => a.order - b.order); }
export async function getActiveCategories(): Promise<ProductCategory[]> { await delay(100); return [..._categories].filter((c) => c.active).sort((a, b) => a.order - b.order); }
export async function getSettings(): Promise<StoreSettings> { return { ..._settings }; }

export async function adminGetCategories(): Promise<ProductCategory[]> { return [..._categories].sort((a, b) => a.order - b.order); }
export async function adminSaveCategory(cat: ProductCategory): Promise<ProductCategory> { const idx = _categories.findIndex((c) => c.id === cat.id); if (idx >= 0) _categories[idx] = cat; else _categories.push(cat); return { ...cat }; }
export async function adminDeleteCategory(id: string): Promise<void> { _categories = _categories.filter((c) => c.id !== id); }
export async function adminGetProducts(): Promise<Product[]> { return [..._products].sort((a, b) => a.order - b.order); }
export async function adminSaveProduct(product: Product): Promise<Product> { const idx = _products.findIndex((p) => p.id === product.id); if (idx >= 0) _products[idx] = product; else _products.push(product); return { ...product }; }
export async function adminDeleteProduct(id: string): Promise<void> { _products = _products.filter((p) => p.id !== id); }
export async function adminGetSettings(): Promise<StoreSettings> { return { ..._settings }; }
export async function adminSaveSettings(s: StoreSettings): Promise<StoreSettings> { _settings = { ...s }; return { ..._settings }; }
export async function adminGetStats() { return { totalProducts: _products.length, activeProducts: _products.filter((p) => p.active).length, totalCategories: _categories.length, activeCategories: _categories.filter((c) => c.active).length }; }
export function newId() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
