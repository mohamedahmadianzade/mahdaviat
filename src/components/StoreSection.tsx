import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Search,
  ShoppingBag,
  X,
  Phone,
  Tag,
  Package,
} from 'lucide-react';
import {
  searchProducts,
  getProductById,
  getSimilarProducts,
  getActiveCategories,
  getSettings,
} from '../lib/storeApi';
import type {
  Product,
  ProductCategory,
  ProductSearchFilters,
  StoreSettings,
} from '../types';
import { emptyProductFilters } from '../types';

interface StoreSectionProps {
  onBack: () => void;
}

export default function StoreSection({ onBack }: StoreSectionProps) {
  const [filters, setFilters] = useState<ProductSearchFilters>(emptyProductFilters);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Initial load
  useEffect(() => {
    (async () => {
      try {
        const [cats, sett] = await Promise.all([
          getActiveCategories(),
          getSettings(),
        ]);
        setCategories(cats);
        setSettings(sett);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  // Search products
  const doSearch = useCallback(async (f: ProductSearchFilters) => {
    setLoading(true);
    try {
      const res = await searchProducts(f);
      setProducts(res.products);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    doSearch(filters);
  }, [filters, doSearch]);

  // Open product detail
  const openProduct = useCallback(async (id: string) => {
    setLoadingDetail(true);
    setDrawerOpen(true);
    try {
      const product = await getProductById(id);
      setSelectedProduct(product);
      if (product) {
        const similar = await getSimilarProducts(product);
        setSimilarProducts(similar);
      }
    } catch {
      setSelectedProduct(null);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedProduct(null);
    setSimilarProducts([]);
  };

  const handleContact = () => {
    if (!settings?.phone) return;
    window.location.href = `tel:${settings.phone}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-soft text-gold-deep">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-emerald-deep">
              {settings?.storeName ?? 'فروشگاه'}
            </h2>
            <p className="text-xs text-muted">
              {settings?.storeTagline ?? 'محصولات فرهنگی و آموزشی'}
            </p>
          </div>
        </div>
        <button onClick={onBack} className="btn-ghost text-xs">
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </button>
      </div>

      {/* Search */}
      <div className="mb-5 relative">
        <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mutedLight" />
        <input
          type="text"
          value={filters.query}
          onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
          placeholder="جستجوی محصول..."
          className="input-field pr-12"
        />
      </div>

      {/* Category pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilters((prev) => ({ ...prev, categoryId: '' }))}
          className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
            !filters.categoryId
              ? 'bg-emerald text-white shadow-soft'
              : 'border border-emerald/20 bg-white text-emerald-deep hover:bg-emerald-soft'
          }`}
        >
          همه محصولات
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilters((prev) => ({ ...prev, categoryId: cat.id }))}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
              filters.categoryId === cat.id
                ? 'bg-emerald text-white shadow-soft'
                : 'border border-emerald/20 bg-white text-emerald-deep hover:bg-emerald-soft'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft">
              <div className="skeleton h-48 w-full rounded-none" />
              <div className="space-y-3 p-4">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-soft text-emerald">
            <Package className="h-8 w-8" />
          </div>
          <p className="text-sm text-muted">محصولی یافت نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <motion.button
              key={product.id}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={() => openProduct(product.id)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-emerald/10 bg-white text-right shadow-soft transition-shadow hover:shadow-card-hover"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-cream">
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-mutedLight">
                    <Package className="h-12 w-12" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 font-display text-sm font-bold text-emerald-deep">
                  {product.name}
                </h3>
                <p className="line-clamp-2 text-xs text-muted">{product.shortDescription}</p>
                <div className="mt-auto flex items-center gap-1.5 pt-2">
                  <Tag className="h-3.5 w-3.5 text-gold" />
                  <span className="text-sm font-bold text-gold-deep">{product.price}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Detail drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 flex w-full max-w-lg flex-col bg-ivory shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-emerald/10 bg-white px-5 py-4">
                <h3 className="font-display text-lg font-bold text-emerald-deep">جزئیات محصول</h3>
                <button
                  onClick={closeDrawer}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-emerald-soft hover:text-emerald-deep"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {loadingDetail || !selectedProduct ? (
                  <div className="space-y-4">
                    <div className="skeleton h-64 w-full rounded-2xl" />
                    <div className="skeleton h-6 w-3/4 rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-10 w-full rounded-xl" />
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Images */}
                    {selectedProduct.images.length > 0 && (
                      <div className="overflow-hidden rounded-2xl border border-emerald/10 bg-white">
                        <img
                          src={selectedProduct.images[0]}
                          alt={selectedProduct.name}
                          className="h-64 w-full object-cover"
                        />
                      </div>
                    )}

                    {/* Name & price */}
                    <div>
                      <h2 className="mb-2 font-display text-xl font-bold text-emerald-deep">
                        {selectedProduct.name}
                      </h2>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-4 py-2">
                        <Tag className="h-4 w-4 text-gold" />
                        <span className="text-lg font-bold text-gold-deep">{selectedProduct.price}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedProduct.description && (
                      <div>
                        <h4 className="mb-2 text-sm font-bold text-emerald-deep">توضیحات</h4>
                        <p className="text-sm leading-relaxed text-muted">{selectedProduct.description}</p>
                      </div>
                    )}

                    {/* Keywords */}
                    {selectedProduct.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="rounded-full border border-emerald/15 bg-emerald-soft/50 px-3 py-1 text-xs text-emerald-deep"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Contact button */}
                    {settings && (
                      <div className="rounded-2xl border border-emerald/15 bg-emerald-soft/50 p-4">
                        <p className="mb-2 text-center text-sm font-medium text-emerald-deep">{settings.contactButtonText}</p>
                        <div className="flex items-center justify-center gap-2.5">
                          <Phone className="h-5 w-5 text-emerald" />
                          <a href={`tel:${settings.phone}`} className="text-lg font-bold text-emerald-deep" dir="ltr">
                            {settings.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Similar products */}
                    {similarProducts.length > 0 && (
                      <div>
                        <h4 className="mb-3 text-sm font-bold text-emerald-deep">محصولات مرتبط</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {similarProducts.map((sp) => (
                            <button
                              key={sp.id}
                              onClick={() => openProduct(sp.id)}
                              className="flex flex-col overflow-hidden rounded-xl border border-emerald/10 bg-white text-right shadow-soft transition-shadow hover:shadow-card"
                            >
                              <div className="h-24 overflow-hidden bg-cream">
                                {sp.images[0] && (
                                  <img src={sp.images[0]} alt={sp.name} className="h-full w-full object-cover" />
                                )}
                              </div>
                              <div className="p-2">
                                <p className="line-clamp-1 text-xs font-medium text-emerald-deep">{sp.name}</p>
                                <p className="text-[10px] text-gold-deep">{sp.price}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
