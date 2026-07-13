import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SearchFilters } from '../types';
import { getFilterOptions, availabilityLabels, bookTypeLabels } from '../lib/api';

interface SearchBoxProps { filters: SearchFilters; onFiltersChange: (f: SearchFilters) => void; onSearch: () => void; advancedOpen: boolean; onToggleAdvanced: () => void; }

const textFields: { key: keyof SearchFilters; label: string }[] = [
  { key: 'title', label: 'عنوان کتاب' }, { key: 'author', label: 'نویسنده' }, { key: 'translator', label: 'مترجم' },
  { key: 'publisher', label: 'ناشر' }, { key: 'keywords', label: 'کلیدواژه' }, { key: 'libraryCode', label: 'کد کتابخانه' },
  { key: 'isbn', label: 'شابک (ISBN)' }, { key: 'publicationYear', label: 'سال انتشار' },
];

export default function SearchBox({ filters, onFiltersChange, onSearch, advancedOpen, onToggleAdvanced }: SearchBoxProps) {
  const options = getFilterOptions();
  const update = (key: keyof SearchFilters, value: string) => onFiltersChange({ ...filters, [key]: value });
  const resetAdvanced = () => onFiltersChange({ ...filters, title: '', author: '', translator: '', publisher: '', subject: '', category: '', keywords: '', language: '', publicationYear: '', century: '', collection: '', libraryCode: '', isbn: '', availability: '', bookType: '', tags: '' });
  const selectFields: { key: keyof SearchFilters; label: string; opts: string[] }[] = [
    { key: 'subject', label: 'موضوع', opts: options.subjects }, { key: 'category', label: 'دسته', opts: options.categories },
    { key: 'language', label: 'زبان', opts: options.languages }, { key: 'century', label: 'قرن', opts: options.centuries },
    { key: 'collection', label: 'مجموعه', opts: options.collections }, { key: 'availability', label: 'وضعیت موجودی', opts: Object.keys(availabilityLabels) },
    { key: 'bookType', label: 'نوع کتاب', opts: Object.keys(bookTypeLabels) }, { key: 'tags', label: 'برچسب', opts: options.tags },
  ];

  return (
    <div className="w-full">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="group relative mx-auto max-w-2xl">
        <div className="glass flex items-center gap-3 rounded-3xl px-5 py-3.5 shadow-card transition-all focus-within:shadow-card-hover focus-within:border-emerald/40">
          <Search className="h-5 w-5 shrink-0 text-emerald" />
          <input type="text" value={filters.query} onChange={(e) => update('query', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSearch()} placeholder="نام کتاب، نویسنده، موضوع یا کلیدواژه را جستجو کنید..." className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-mutedLight" aria-label="جستجو" />
          {filters.query && <button onClick={() => update('query', '')} className="rounded-full p-1 text-mutedLight hover:text-emerald transition-colors" aria-label="پاک کردن"><X className="h-4 w-4" /></button>}
          <button onClick={onSearch} className="btn-primary !rounded-2xl !px-4 !py-2" aria-label="جستجو"><Search className="h-4 w-4" /><span className="hidden sm:inline">جستجو</span></button>
        </div>
      </motion.div>
      <div className="mt-4 flex justify-center">
        <button onClick={onToggleAdvanced} className="group inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-white/50 px-5 py-2 text-sm font-medium text-emerald-deep transition-all hover:bg-emerald-soft hover:border-emerald/40">
          <SlidersHorizontal className="h-4 w-4 transition-transform group-hover:rotate-12" />جستجوی پیشرفته
        </button>
      </div>
      <AnimatePresence>
        {advancedOpen && (
          <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 20 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <div className="glass mx-auto max-w-4xl rounded-3xl p-6 shadow-card">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold text-emerald-deep">فیلترهای پیشرفته</h3>
                <button onClick={resetAdvanced} className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-emerald transition-colors"><RotateCcw className="h-3.5 w-3.5" />پاک کردن فیلترها</button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {textFields.map((f) => (<div key={f.key}><label className="mb-1.5 block text-xs font-medium text-muted">{f.label}</label><input type="text" value={filters[f.key]} onChange={(e) => update(f.key, e.target.value)} placeholder={f.label} className="input-field" /></div>))}
                {selectFields.map((f) => (
                  <div key={f.key}>
                    <label className="mb-1.5 block text-xs font-medium text-muted">{f.label}</label>
                    <select value={filters[f.key]} onChange={(e) => update(f.key, e.target.value)} className="input-field cursor-pointer">
                      <option value="">همه</option>
                      {f.opts.map((o) => (<option key={o} value={o}>{f.key === 'availability' ? availabilityLabels[o] : f.key === 'bookType' ? bookTypeLabels[o] : o}</option>))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center"><button onClick={onSearch} className="btn-primary"><Search className="h-4 w-4" />اعمال فیلترها و جستجو</button></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
