import type { Product, ProductCategory, ProductSearchFilters, StoreSettings } from '../types';
import { defaultSettings } from '../types';
import { supabase } from './supabaseClient';

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const matches = (field: string | undefined, term: string) => !term || (!!field && normalize(field).includes(normalize(term)));
const matchesAny = (arr: string[] | undefined, term: string) => !term || (!!arr?.length && arr.some((k) => normalize(k).includes(normalize(term))));

type ProductRow = Omit<Product, 'images' | 'keywords' | 'similarIds' | 'categoryId'> & {
  category_id: string;
  images: string[];
  keywords: string[];
  similar_ids: string[];
  created_at: string;
  updated_at: string;
};

const fromProductRow = (r: ProductRow): Product => ({
  id: r.id,
  name: r.name,
  categoryId: r.category_id,
  images: r.images ?? [],
  shortDescription: r.short_description,
  description: r.description,
  price: r.price,
  keywords: r.keywords ?? [],
  order: r.order,
  active: r.active,
  similarIds: r.similar_ids ?? [],
});

const toProductRow = (p: Product): Omit<ProductRow, 'created_at' | 'updated_at'> => ({
  id: p.id,
  name: p.name,
  category_id: p.categoryId,
  images: p.images,
  short_description: p.shortDescription,
  description: p.description,
  price: p.price,
  keywords: p.keywords,
  order: p.order,
  active: p.active,
  similar_ids: p.similarIds ?? [],
});

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  active: boolean;
};

const fromCategoryRow = (r: CategoryRow): ProductCategory => ({
  id: r.id, name: r.name, slug: r.slug, description: r.description, order: r.order, active: r.active,
});

const toCategoryRow = (c: ProductCategory) => ({
  id: c.id, name: c.name, slug: c.slug, description: c.description, order: c.order, active: c.active,
});

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return (data as ProductRow[]).map(fromProductRow);
}

async function getCategoriesData(): Promise<ProductCategory[]> {
  const { data, error } = await supabase.from('product_categories').select('*');
  if (error) throw error;
  return (data as CategoryRow[]).map(fromCategoryRow);
}

export async function searchProducts(filters: ProductSearchFilters) {
  const all = await getProducts();
  const results = all.filter((p) => p.active).sort((a, b) => a.order - b.order).filter((p) => {
    if (filters.categoryId && p.categoryId !== filters.categoryId) return false;
    const q = filters.query.trim();
    if (!q) return true;
    return matches(p.name, q) || matches(p.shortDescription, q) || matches(p.description, q) || matchesAny(p.keywords, q);
  });
  return { products: results, total: results.length };
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? fromProductRow(data as ProductRow) : null;
}

export async function getSimilarProducts(product: Product): Promise<Product[]> {
  const all = await getProducts();
  return (product.similarIds ?? []).map((id) => all.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));
}

export async function getCategories(): Promise<ProductCategory[]> {
  const cats = await getCategoriesData();
  return [...cats].sort((a, b) => a.order - b.order);
}

export async function getActiveCategories(): Promise<ProductCategory[]> {
  const cats = await getCategoriesData();
  return [...cats].filter((c) => c.active).sort((a, b) => a.order - b.order);
}

export async function getSettings(): Promise<StoreSettings> {
  const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  if (!data) return { ...defaultSettings };
  const r = data as Partial<StoreSettings>;
  return {
    storeName: r.store_name ?? defaultSettings.storeName,
    storeTagline: r.store_tagline ?? defaultSettings.storeTagline,
    contactMode: (r.contact_mode as StoreSettings['contactMode']) ?? defaultSettings.contactMode,
    phone: r.phone ?? defaultSettings.phone,
    whatsapp: r.whatsapp ?? defaultSettings.whatsapp,
    contactButtonText: r.contact_button_text ?? defaultSettings.contactButtonText,
  };
}

// ─── Admin CRUD ──────────────────────────────────────────────────────────────

export async function adminGetCategories(): Promise<ProductCategory[]> {
  const cats = await getCategoriesData();
  return [...cats].sort((a, b) => a.order - b.order);
}

export async function adminSaveCategory(cat: ProductCategory): Promise<ProductCategory> {
  const { data, error } = await supabase.from('product_categories').upsert(toCategoryRow(cat)).select('*').maybeSingle();
  if (error) throw error;
  return data ? fromCategoryRow(data as CategoryRow) : cat;
}

export async function adminDeleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('product_categories').delete().eq('id', id);
  if (error) throw error;
}

export async function adminGetProducts(): Promise<Product[]> {
  const all = await getProducts();
  return [...all].sort((a, b) => a.order - b.order);
}

export async function adminSaveProduct(product: Product): Promise<Product> {
  const { data, error } = await supabase.from('products').upsert(toProductRow(product)).select('*').maybeSingle();
  if (error) throw error;
  return data ? fromProductRow(data as ProductRow) : product;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function adminGetSettings(): Promise<StoreSettings> { return getSettings(); }

export async function adminSaveSettings(s: StoreSettings): Promise<StoreSettings> {
  const row = {
    id: 1,
    store_name: s.storeName,
    store_tagline: s.storeTagline,
    contact_mode: s.contactMode,
    phone: s.phone,
    whatsapp: s.whatsapp,
    contact_button_text: s.contactButtonText,
  };
  const { error } = await supabase.from('store_settings').upsert(row);
  if (error) throw error;
  return { ...s };
}

export async function adminGetStats() {
  const [products, cats] = await Promise.all([getProducts(), getCategoriesData()]);
  return {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.active).length,
    totalCategories: cats.length,
    activeCategories: cats.filter((c) => c.active).length,
  };
}

export function newId() { return crypto.randomUUID(); }
