import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Save,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { Product, ProductCategory } from '../../types';
import {
  adminGetProducts,
  adminSaveProduct,
  adminDeleteProduct,
  adminGetCategories,
  newId,
} from '../../lib/storeApi';

type ProductForm = Omit<Product, 'images' | 'keywords' | 'similarIds'> & {
  images: string;
  keywords: string;
  similarIds: string;
};

const emptyProduct = (): Product => ({
  id: '',
  name: '',
  categoryId: '',
  images: [],
  shortDescription: '',
  description: '',
  price: '',
  keywords: [],
  order: 1,
  active: true,
  similarIds: [],
});

const toForm = (p: Product): ProductForm => ({
  ...p,
  images: p.images.join(', '),
  keywords: p.keywords.join(', '),
  similarIds: (p.similarIds ?? []).join(', '),
});

const fromForm = (f: ProductForm): Product => ({
  ...f,
  images: f.images.split(',').map((s) => s.trim()).filter(Boolean),
  keywords: f.keywords.split(',').map((s) => s.trim()).filter(Boolean),
  similarIds: f.similarIds.split(',').map((s) => s.trim()).filter(Boolean),
});

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([adminGetProducts(), adminGetCategories()]);
      setProducts(prods);
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—';

  const filtered = products.filter((p) => {
    if (filterCat && p.categoryId !== filterCat) return false;
    const q = query.trim();
    if (!q) return true;
    return p.name.includes(q) || p.shortDescription.includes(q) || p.keywords.some((k) => k.includes(q));
  });

  const openNew = () => {
    setEditing(toForm({ ...emptyProduct(), id: newId(), categoryId: categories[0]?.id ?? '' }));
  };

  const openEdit = (p: Product) => setEditing(toForm(p));

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await adminSaveProduct(fromForm(editing));
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await adminDeleteProduct(id);
    setConfirmDelete(null);
    await load();
  };

  const update = (field: keyof ProductForm, value: string | number | boolean) => {
    setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-bold text-emerald-deep">مدیریت محصولات</h3>
          <p className="mt-1 text-sm text-muted">{products.length} محصول ثبت شده است</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" />
          افزودن محصول
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mutedLight" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در نام و توضیحات..."
            className="input-field pr-12"
          />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="input-field max-w-[200px]">
          <option value="">همه دسته‌ها</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-emerald/10 bg-emerald-soft/50 text-xs text-muted">
                <th className="px-4 py-3 font-medium">نام محصول</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">دسته‌بندی</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">قیمت</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">ترتیب</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-emerald/5">
                    <td className="px-4 py-3"><div className="skeleton h-5 w-40 rounded" /></td>
                    <td className="hidden px-4 py-3 md:table-cell"><div className="skeleton h-5 w-24 rounded" /></td>
                    <td className="hidden px-4 py-3 lg:table-cell"><div className="skeleton h-5 w-20 rounded" /></td>
                    <td className="hidden px-4 py-3 sm:table-cell"><div className="skeleton h-5 w-10 rounded" /></td>
                    <td className="px-4 py-3"><div className="skeleton h-5 w-16 rounded" /></td>
                    <td className="px-4 py-3"><div className="skeleton h-5 w-20 rounded" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted">
                    <Package className="mx-auto mb-3 h-10 w-10 text-mutedLight" />
                    محصولی یافت نشد
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-emerald/5 transition-colors hover:bg-emerald-soft/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-soft">
                            <Package className="h-5 w-5 text-gold-deep" />
                          </div>
                        )}
                        <span className="font-medium text-ink">{p.name}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted md:table-cell">{catName(p.categoryId)}</td>
                    <td className="hidden px-4 py-3 text-muted lg:table-cell">{p.price || '—'}</td>
                    <td className="hidden px-4 py-3 text-muted sm:table-cell">{p.order}</td>
                    <td className="px-4 py-3">
                      {p.active ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-soft px-2 py-1 text-xs text-emerald-deep">
                          <CheckCircle2 className="h-3.5 w-3.5" /> فعال
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-xs text-rose-500">
                          <XCircle className="h-3.5 w-3.5" /> غیرفعال
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-emerald transition-colors hover:bg-emerald-soft" title="ویرایش">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setConfirmDelete(p.id)} className="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50" title="حذف">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditing(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-card"
            >
              <div className="sticky top-0 flex items-center justify-between border-b border-emerald/10 bg-white px-6 py-4">
                <h4 className="font-display text-lg font-bold text-emerald-deep">
                  {products.some((p) => p.id === editing.id) ? 'ویرایش محصول' : 'محصول جدید'}
                </h4>
                <button onClick={() => setEditing(null)} className="rounded-lg p-2 text-muted transition-colors hover:bg-emerald-soft">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 p-6">
                <Field label="نام محصول" required>
                  <input className="input-field" value={editing.name} onChange={(e) => update('name', e.target.value)} />
                </Field>

                <Field label="دسته‌بندی">
                  <select className="input-field" value={editing.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
                    <option value="">بدون دسته</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </Field>

                <Field label="تصاویر (URL با ویرگول جدا کنید)">
                  <input className="input-field" value={editing.images} onChange={(e) => update('images', e.target.value)} placeholder="https://..., https://..." />
                </Field>

                <Field label="توضیح کوتاه">
                  <input className="input-field" value={editing.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} />
                </Field>

                <Field label="توضیحات کامل">
                  <textarea rows={4} className="input-field resize-none" value={editing.description} onChange={(e) => update('description', e.target.value)} />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="قیمت">
                    <input className="input-field" value={editing.price} onChange={(e) => update('price', e.target.value)} placeholder="مثال: ۱۵۰,۰۰۰ تومان" />
                  </Field>
                  <Field label="ترتیب">
                    <input type="number" className="input-field" value={editing.order} onChange={(e) => update('order', Number(e.target.value))} />
                  </Field>
                </div>

                <Field label="کلیدواژه‌ها (با ویرگول)">
                  <input className="input-field" value={editing.keywords} onChange={(e) => update('keywords', e.target.value)} placeholder="کلیدواژه۱, کلیدواژه۲" />
                </Field>

                <Field label="محصولات مشابه (شناسه‌ها با ویرگول)">
                  <input className="input-field" value={editing.similarIds} onChange={(e) => update('similarIds', e.target.value)} placeholder="id1, id2" />
                </Field>

                <label className="flex items-center gap-2.5 rounded-xl border border-emerald/15 bg-emerald-soft/30 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={editing.active}
                    onChange={(e) => update('active', e.target.checked)}
                    className="h-4 w-4 accent-emerald"
                  />
                  <span className="text-sm font-medium text-emerald-deep">محصول فعال است</span>
                </label>
              </div>

              <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-emerald/10 bg-white px-6 py-4">
                <button onClick={() => setEditing(null)} className="btn-ghost">انصراف</button>
                <button onClick={handleSave} disabled={saving || !editing.name} className="btn-primary">
                  <Save className="h-4 w-4" />
                  {saving ? 'در حال ذخیره...' : 'ذخیره'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-card"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
                <AlertCircle className="h-7 w-7 text-rose-500" />
              </div>
              <h4 className="mb-2 font-display text-lg font-bold text-ink">حذف محصول</h4>
              <p className="mb-6 text-sm text-muted">آیا از حذف این محصول مطمئن هستید؟ این عملیات قابل بازگشت نیست.</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setConfirmDelete(null)} className="btn-ghost">انصراف</button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-rose-600 active:scale-[0.98]"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}
