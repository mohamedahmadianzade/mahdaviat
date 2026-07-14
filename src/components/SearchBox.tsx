import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import type { SearchFilters } from '../types';
import { emptyFilters } from '../types';

interface FilterOptions {
  subjects: string[];
  categories: string[];
  languages: string[];
  centuries: string[];
  collections: string[];
  publishers: string[];
  tags: string[];
}

interface SearchBoxProps {
  filters: SearchFilters;
  onSearch: (f: SearchFilters) => void;
  filterOptions: FilterOptions;
}

export default function SearchBox({ filters, onSearch, filterOptions }: SearchBoxProps) {
  const [local, setLocal] = useState<SearchFilters>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (field: keyof SearchFilters, value: string) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(local);
  };

  const handleReset = () => {
    setLocal(emptyFilters);
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Heading */}
      <div className="mb-6 text-center">
        <h2 className="mb-2 font-display text-2xl font-bold text-emerald-deep">
          کتابخانه دیجیتال
        </h2>
        <p className="text-sm text-muted">
          جستجوی پیشرفته در میان کتاب‌ها، نسخه‌های خطی و منابع علمی
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main search */}
        <div className="relative">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mutedLight" />
          <input
            type="text"
            value={local.query}
            onChange={(e) => update('query', e.target.value)}
            placeholder="عنوان، نویسنده، موضوع یا کلیدواژه..."
            className="input-field pr-12 text-base"
          />
        </div>

        {/* Advanced toggle */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald transition-colors hover:text-emerald-deep"
          >
            <SlidersHorizontal className="h-4 w-4" />
            جستجوی پیشرفته
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            />
          </button>
          {showAdvanced && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-emerald-deep"
            >
              <X className="h-3.5 w-3.5" />
              پاک کردن فیلترها
            </button>
          )}
        </div>

        {/* Advanced filters */}
        <AnimatePresence initial={false}>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl border border-emerald/10 bg-cream/40 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Title */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">عنوان کتاب</label>
                    <input
                      type="text"
                      value={local.title}
                      onChange={(e) => update('title', e.target.value)}
                      placeholder="عنوان..."
                      className="input-field"
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">نویسنده</label>
                    <input
                      type="text"
                      value={local.author}
                      onChange={(e) => update('author', e.target.value)}
                      placeholder="نام نویسنده..."
                      className="input-field"
                    />
                  </div>

                  {/* Translator */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">مترجم</label>
                    <input
                      type="text"
                      value={local.translator}
                      onChange={(e) => update('translator', e.target.value)}
                      placeholder="نام مترجم..."
                      className="input-field"
                    />
                  </div>

                  {/* Publisher */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">ناشر</label>
                    <input
                      type="text"
                      value={local.publisher}
                      onChange={(e) => update('publisher', e.target.value)}
                      placeholder="ناشر..."
                      className="input-field"
                    />
                  </div>

                  {/* Subject dropdown */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">موضوع</label>
                    <select
                      value={local.subject}
                      onChange={(e) => update('subject', e.target.value)}
                      className="input-field"
                    >
                      <option value="">همه موضوعات</option>
                      {filterOptions.subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category dropdown */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">دسته‌بندی</label>
                    <select
                      value={local.category}
                      onChange={(e) => update('category', e.target.value)}
                      className="input-field"
                    >
                      <option value="">همه دسته‌ها</option>
                      {filterOptions.categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">کلیدواژه‌ها</label>
                    <input
                      type="text"
                      value={local.keywords}
                      onChange={(e) => update('keywords', e.target.value)}
                      placeholder="کلیدواژه..."
                      className="input-field"
                    />
                  </div>

                  {/* Language dropdown */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">زبان</label>
                    <select
                      value={local.language}
                      onChange={(e) => update('language', e.target.value)}
                      className="input-field"
                    >
                      <option value="">همه زبان‌ها</option>
                      {filterOptions.languages.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  {/* Publication year */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">سال نشر</label>
                    <input
                      type="text"
                      value={local.publicationYear}
                      onChange={(e) => update('publicationYear', e.target.value)}
                      placeholder="مثال: 1402"
                      className="input-field"
                    />
                  </div>

                  {/* Century dropdown */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">قرن</label>
                    <select
                      value={local.century}
                      onChange={(e) => update('century', e.target.value)}
                      className="input-field"
                    >
                      <option value="">همه قرن‌ها</option>
                      {filterOptions.centuries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Collection dropdown */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">مجموعه</label>
                    <select
                      value={local.collection}
                      onChange={(e) => update('collection', e.target.value)}
                      className="input-field"
                    >
                      <option value="">همه مجموعه‌ها</option>
                      {filterOptions.collections.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Library code */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">کد کتابخانه</label>
                    <input
                      type="text"
                      value={local.libraryCode}
                      onChange={(e) => update('libraryCode', e.target.value)}
                      placeholder="کد..."
                      className="input-field"
                    />
                  </div>

                  {/* ISBN */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">شابک (ISBN)</label>
                    <input
                      type="text"
                      value={local.isbn}
                      onChange={(e) => update('isbn', e.target.value)}
                      placeholder="شابک..."
                      className="input-field"
                    />
                  </div>

                  {/* Availability dropdown */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">وضعیت موجودی</label>
                    <select
                      value={local.availability}
                      onChange={(e) => update('availability', e.target.value)}
                      className="input-field"
                    >
                      <option value="">همه وضعیت‌ها</option>
                      <option value="available">موجود</option>
                      <option value="borrowed">امانت رفته</option>
                      <option value="reference">مرجع</option>
                      <option value="restored">در حال مرمت</option>
                    </select>
                  </div>

                  {/* Book type dropdown */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">نوع کتاب</label>
                    <select
                      value={local.bookType}
                      onChange={(e) => update('bookType', e.target.value)}
                      className="input-field"
                    >
                      <option value="">همه انواع</option>
                      <option value="printed">چاپی</option>
                      <option value="digital">دیجیتال</option>
                      <option value="manuscript">نسخه خطی</option>
                      <option value="lithographic">سنگی</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">برچسب‌ها</label>
                    <select
                      value={local.tags}
                      onChange={(e) => update('tags', e.target.value)}
                      className="input-field"
                    >
                      <option value="">همه برچسب‌ها</option>
                      {filterOptions.tags.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search button */}
        <div className="flex justify-center pt-2">
          <button type="submit" className="btn-primary min-w-[200px]">
            <Search className="h-5 w-5" />
            جستجو
          </button>
        </div>
      </form>
    </div>
  );
}
