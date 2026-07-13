import { motion } from 'framer-motion';
import { ShoppingBag, Search, X } from 'lucide-react';
import type { ProductCategory, ProductSearchFilters } from '../types';

interface StoreSearchBarProps { filters: ProductSearchFilters; categories: ProductCategory[]; onFiltersChange: (f: ProductSearchFilters) => void; }

export default function StoreSearchBar({ filters, categories, onFiltersChange }: StoreSearchBarProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }} className="mx-auto w-full max-w-2xl">
      <div className="glass flex items-center gap-3 rounded-3xl px-5 py-3.5 shadow-card transition-all focus-within:shadow-card-hover focus-within:border-gold/40">
        <Search className="h-5 w-5 shrink-0 text-gold-deep" />
        <input type="text" value={filters.query} onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })} placeholder="نام محصول یا کلیدواژه جستجو کنید..." className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-mutedLight" />
        {filters.query && <button onClick={() => onFiltersChange({ ...filters, query: '' })} className="rounded-full p-1 text-mutedLight hover:text-gold-deep transition-colors"><X className="h-4 w-4" /></button>}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button onClick={() => onFiltersChange({ ...filters, categoryId: '' })} className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${!filters.categoryId ? 'border-emerald bg-emerald text-white shadow-soft' : 'border-emerald/20 bg-white/70 text-emerald-deep hover:border-emerald/40 hover:bg-emerald-soft'}`}>همه</button>
        {categories.map((cat) => (<button key={cat.id} onClick={() => onFiltersChange({ ...filters, categoryId: filters.categoryId === cat.id ? '' : cat.id })} className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${filters.categoryId === cat.id ? 'border-emerald bg-emerald text-white shadow-soft' : 'border-emerald/20 bg-white/70 text-emerald-deep hover:border-emerald/40 hover:bg-emerald-soft'}`}>{cat.name}</button>))}
      </div>
    </motion.div>
  );
}

export function StoreSectionHeader({ total, loading, storeName }: { total: number; loading: boolean; storeName: string }) {
  return (<div className="mb-8 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-white shadow-gold"><ShoppingBag className="h-6 w-6" /></div><h1 className="font-display text-2xl font-bold text-emerald-deep">{storeName}</h1>{!loading && <p className="mt-1 text-sm text-muted">{total} محصول موجود است</p>}</div>);
}
