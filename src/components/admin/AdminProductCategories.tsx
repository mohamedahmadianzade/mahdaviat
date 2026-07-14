import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { ProductCategory } from '../../types';
import {
  adminGetCategories,
  adminSaveCategory,
  adminDeleteCategory,
  newId,
} from '../../lib/storeApi';

const emptyCategory = (): ProductCategory => ({
  id: '',
  name: '',
  slug: '',
  description: '',
  order: 1,
  active: true,
});

export default function AdminProductCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminGetCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => setEditing({ ...emptyCategory(), id: newId() });
  const openEdit = (c: ProductCategory) => setEditing({ ...c });

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await adminSaveCategory(editing);
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await adminDeleteCategory(id);
    setConfirmDelete(null);
    await load();
  };

  const update = (field: keyof ProductCategory, value: string | number | boolean) => {
    setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-bold text-emerald-deep">دسته‌بندی محصولات</h3>
          <p className="mt-1 text-sm text-muted">{categories.length} دسته‌بندی ثبت شده است</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" />
          افزودن دسته‌بندی
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-emerald/10 bg-emerald-soft/50 text-xs text-muted">
                <th className="px-4 py-3 font-medium">نام</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">شناسه (Slug)</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">توضیحات</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">ترتیب</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-emerald/5">
                    <td className="px-4 py-3"><div className="skeleton h-5 w-32 rounded" /></td>
                    <td className="hidden px-4 py-3 md:table-cell"><div className="skeleton h-5 w-24 rounded" /></td>
                    <td className="hidden px-4 py-3 lg:table-cell"><div className="skeleton h-5 w-40 rounded" /></td>
                    <td className="hidden px-4 py-3 sm:table-cell"><div className="skeleton h-5 w-10 rounded" /></td>
                    <td className="px-4 py-3"><div className="skeleton h-5 w-16 rounded" /></td>
                    <td className="px-4 py-3"><div className="skeleton h-5 w-20 rounded" /></td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted">
                    <FolderTree className="mx-auto mb-3 h-10 w-10 text-mutedLight" />
                    دسته‌بندی‌ای یافت نشد
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="border-b border-emerald/5 transition-colors hover:bg-emerald-soft/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-soft">
                          <FolderTree className="h-4 w-4 text-gold-deep" />
                        </div>
                        <span className="font-medium text-ink">{c.name}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-muted md:table-cell">{c.slug || '—'}</td>
                    <td className="hidden max-w-xs px-4 py-3 text-muted lg:table-cell">
                      <span className="line-clamp-1">{c.description || '—'}</span>
                    </td>
                    <td className="hidden px-4 py-3 text-muted sm:table-cell">{c.order}</td>
                    <td className="px-4 py-3">
                      {c.active ? (
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
                        <button onClick={() => openEdit(c)} className="rounded-lg p-2 text-emerald transition-colors hover:bg-emerald-soft" title="ویرایش">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setConfirmDelete(c.id)} className="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50" title="حذف">
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
              className="w-full max-w-lg rounded-2xl bg-white shadow-card"
            >
              <div className="flex items-center justify-between border-b border-emerald/10 px-6 py-4">
                <h4 className="font-display text-lg font-bold text-emerald-deep">
                  {categories.some((c) => c.id === editing.id) ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}
                </h4>
                <button onClick={() => setEditing(null)} className="rounded-lg p-2 text-muted transition-colors hover:bg-emerald-soft">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 p-6">
                <Field label="نام" required>
                  <input className="input-field" value={editing.name} onChange={(e) => update('name', e.target.value)} placeholder="نام دسته‌بندی" />
                </Field>
                <Field label="شناسه (Slug)">
                  <input className="input-field" value={editing.slug} onChange={(e) => update('slug', e.target.value)} placeholder="category-slug" dir="ltr" />
                </Field>
                <Field label="توضیحات">
                  <textarea rows={3} className="input-field resize-none" value={editing.description} onChange={(e) => update('description', e.target.value)} />
                </Field>
                <Field label="ترتیب">
                  <input type="number" className="input-field" value={editing.order} onChange={(e) => update('order', Number(e.target.value))} />
                </Field>
                <label className="flex items-center gap-2.5 rounded-xl border border-emerald/15 bg-emerald-soft/30 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={editing.active}
                    onChange={(e) => update('active', e.target.checked)}
                    className="h-4 w-4 accent-emerald"
                  />
                  <span className="text-sm font-medium text-emerald-deep">دسته‌بندی فعال است</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-emerald/10 px-6 py-4">
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
              <h4 className="mb-2 font-display text-lg font-bold text-ink">حذف دسته‌بندی</h4>
              <p className="mb-6 text-sm text-muted">آیا از حذف این دسته‌بندی مطمئن هستید؟ این عملیات قابل بازگشت نیست.</p>
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
