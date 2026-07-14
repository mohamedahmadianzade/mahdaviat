import type { Product, ProductCategory, ProductSearchFilters, StoreSettings } from '../types';
import { defaultProducts, defaultCategories } from '../data/products';
import { defaultSettings } from '../types';
import { loadJSON, saveJSON, STORAGE_KEYS } from './storage';

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const matches = (field: string | undefined, term: string) => !term || (!!field && normalize(field).includes(normalize(term)));
const matchesAny = (arr: string[] | undefined, term: string) => !term || (!!arr?.length && arr.some((k) => normalize(k).includes(normalize(term))));

function getProducts(): Product[] { return loadJSON<Product[]>(STORAGE_KEYS.products, defaultProducts); }
function getCategoriesData(): ProductCategory[] { return loadJSON<ProductCategory[]>(STORAGE_KEYS.productCategories, defaultCategories); }
function getSettingsData(): StoreSettings { return loadJSON<StoreSettings>(STORAGE_KEYS.storeSettings, defaultSettings); }

export async function searchProducts(filters: ProductSearchFilters) {
  await delay(300);
  const results = getProducts().filter((p) => p.active).sort((a, b) => a.order - b.order).filter((p) => {
    if (filters.categoryId && p.categoryId !== filters.categoryId) return false;
    const q = filters.query.trim();
    if (!q) return true;
    return matches(p.name, q) || matches(p.shortDescription, q) || matches(p.description, q) || matchesAny(p.keywords, q);
  });
  return { products: results, total: results.length };
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay(200);
  return getProducts().find((p) => p.id === id) ?? null;
}

export async function getSimilarProducts(product: Product): Promise<Product[]> {
  const products = getProducts();
  return (product.similarIds ?? []).map((id) => products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));
}

export async function getCategories(): Promise<ProductCategory[]> {
  await delay(100);
  return [...getCategoriesData()].sort((a, b) => a.order - b.order);
}

export async function getActiveCategories(): Promise<ProductCategory[]> {
  await delay(100);
  return [...getCategoriesData()].filter((c) => c.active).sort((a, b) => a.order - b.order);
}

export async function getSettings(): Promise<StoreSettings> { return { ...getSettingsData() }; }

// ─── Admin CRUD ──────────────────────────────────────────────────────────────

export async function adminGetCategories(): Promise<ProductCategory[]> {
  return [...getCategoriesData()].sort((a, b) => a.order - b.order);
}

export async function adminSaveCategory(cat: ProductCategory): Promise<ProductCategory> {
  const cats = getCategoriesData();
  const idx = cats.findIndex((c) => c.id === cat.id);
  if (idx >= 0) cats[idx] = cat; else cats.push(cat);
  saveJSON(STORAGE_KEYS.productCategories, cats);
  return { ...cat };
}

export async function adminDeleteCategory(id: string): Promise<void> {
  saveJSON(STORAGE_KEYS.productCategories, getCategoriesData().filter((c) => c.id !== id));
}

export async function adminGetProducts(): Promise<Product[]> {
  return [...getProducts()].sort((a, b) => a.order - b.order);
}

export async function adminSaveProduct(product: Product): Promise<Product> {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) products[idx] = product; else products.push(product);
  saveJSON(STORAGE_KEYS.products, products);
  return { ...product };
}

export async function adminDeleteProduct(id: string): Promise<void> {
  saveJSON(STORAGE_KEYS.products, getProducts().filter((p) => p.id !== id));
}

export async function adminGetSettings(): Promise<StoreSettings> { return { ...getSettingsData() }; }
export async function adminSaveSettings(s: StoreSettings): Promise<StoreSettings> { saveJSON(STORAGE_KEYS.storeSettings, s); return { ...s }; }

export async function adminGetStats() {
  const products = getProducts();
  const cats = getCategoriesData();
  return {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.active).length,
    totalCategories: cats.length,
    activeCategories: cats.filter((c) => c.active).length,
  };
}

export function newId() { return 'p' + Math.random().toString(36).slice(2) + Date.now().toString(36); }
