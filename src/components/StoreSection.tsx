import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX } from 'lucide-react';
import type { Product, ProductCategory, ProductSearchFilters, StoreSettings } from '../types';
import { emptyProductFilters } from '../types';
import { searchProducts, getProductById, getSimilarProducts, getActiveCategories, getSettings } from '../lib/storeApi';
import StoreSearchBar, { StoreSectionHeader } from './StoreSearchBar';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import ProductDetails from './ProductDetails';

export default function StoreSection(_: { onBack: () => void }) {
  const [filters, setFilters] = useState<ProductSearchFilters>(emptyProductFilters);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [view, setView] = useState<'listing' | 'details'>('listing');

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const runSearch = useCallback(async (f: ProductSearchFilters) => {
    setLoading(true);
    const res = await searchProducts(f);
    setProducts(res.products);
    setTotal(res.total);
    setLoading(false);
  }, []);

  useEffect(() => { getActiveCategories().then(setCategories); getSettings().then(setSettings); runSearch(emptyProductFilters); }, [runSearch]);

  const handleFiltersChange = (f: ProductSearchFilters) => { setFilters(f); runSearch(f); };

  const openProduct = async (id: string) => {
    setView('details');
    setDetailsLoading(true);
    const product = await getProductById(id);
    if (product) { setSelectedProduct(product); setSimilar(await getSimilarProducts(product)); }
    setDetailsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!settings) return (<div className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>);

  return (
    <AnimatePresence mode="wait">
      {view === 'listing' && (
        <motion.div key="listing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="pt-8">
          <StoreSectionHeader total={total} loading={loading} storeName={settings.storeName} />
          <StoreSearchBar filters={filters} categories={categories} onFiltersChange={handleFiltersChange} />
          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>
            ) : products.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"><AnimatePresence>{products.map((p, i) => <ProductCard key={p.id} product={p} category={categoryMap.get(p.categoryId)} settings={settings} index={i} onClick={() => openProduct(p.id)} />)}</AnimatePresence></motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border border-emerald/10 bg-white/60 py-20 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-soft text-emerald"><SearchX className="h-7 w-7" /></div>
                <h3 className="font-display text-lg font-semibold text-emerald-deep">محصولی یافت نشد</h3>
                <p className="mt-2 max-w-sm text-sm text-muted">جستجو یا فیلتر انتخابی را تغییر دهید</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
      {view === 'details' && (
        <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="pt-8">
          {detailsLoading || !selectedProduct ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2"><div className="skeleton h-96 w-full rounded-2xl" /><div className="space-y-4"><div className="skeleton h-8 w-2/3" /><div className="skeleton h-4 w-1/3" /><div className="skeleton h-32 w-full rounded-2xl" /></div></div>
          ) : (
            <ProductDetails product={selectedProduct} category={categoryMap.get(selectedProduct.categoryId)} similar={similar} categoryMap={categoryMap} settings={settings} onBack={() => setView('listing')} onSimilarClick={openProduct} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
