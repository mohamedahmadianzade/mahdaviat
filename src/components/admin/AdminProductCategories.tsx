import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ProductCategory } from '../../types';
import { adminGetCategories, adminSaveCategory, adminDeleteCategory, newId } from '../../lib/storeApi';
import { Dialog, ConfirmDialog, FormField, StatusBadge, EmptyState, AdminSearchInput } from './AdminUI';

const emptyCategory: ProductCategory = { id: '', name: '', slug: '', description: '', order: 1, active: true };

export default function AdminProductCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProductCategory>(emptyCategory);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => adminGetCategories().then(setCategories);
  useEffect(() => { load(); }, []);

  const filtered = categories.filter((c) => c.name.includes(query) || c.slug.includes(query) || c.description.includes(query));
  const openAdd = () => { setEditing({ ...emptyCategory, id: newId() }); setDialogOpen(true); };
  const openEdit = (cat: ProductCategory) => { setEditing({ ...cat }); setDialogOpen(true); };
  const handleSave = async () => { if (!editing.name.trim()) return; setSaving(true); await adminSaveCategory(editing); setSaving(false); setDialogOpen(false); load(); };
  const handleDelete = async () => { if (!deleteId) return; await adminDeleteCategory(deleteId); setDeleteId(null); load(); };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="max-w-xs flex-1"><AdminSearchInput value={query} onChange={setQuery} placeholder="جستجوی دسته‌بندی..." /></div>
        <button onClick={openAdd} className="btn-primary shrink-0"><Plus className="h-4 w-4" />افزودن دسته</button>
      </div>
      {filtered.length === 0 ? (
        <EmptyState message="دسته‌بندی یافت نشد" icon={<FolderOpen className="h-6 w-6" />} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="border-b border-emerald/10 bg-emerald-soft/50"><tr>{['نام', 'شناسه', 'توضیح', 'ترتیب', 'وضعیت', 'عملیات'].map((h) => <th key={h} className="px-4 py-3 text-xs font-semibold text-emerald-deep">{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((cat, i) => (
                  <motion.tr key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-emerald/5 last:border-0 hover:bg-ivory/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-ink">{cat.name}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted" dir="ltr">{cat.slug}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-sm text-muted">{cat.description}</td>
                    <td className="px-4 py-3 text-sm text-muted">{cat.order}</td>
                    <td className="px-4 py-3"><StatusBadge active={cat.active} /></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2">
                      <button onClick={() => openEdit(cat)} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-emerald-soft hover:text-emerald"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteId(cat.id)} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Dialog open={dialogOpen} title={categories.some((c) => c.id === editing.id) ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی'} onClose={() => setDialogOpen(false)}>
        <div className="space-y-4">
          <FormField label="نام دسته" required><input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input-field" placeholder="نام دسته‌بندی" /></FormField>
          <FormField label="شناسه (Slug)" required><input type="text" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="input-field" placeholder="book, software, ..." dir="ltr" /></FormField>
          <FormField label="توضیحات"><textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input-field resize-none" rows={2} /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="ترتیب نمایش"><input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} className="input-field" min={1} /></FormField>
            <FormField label="وضعیت"><select value={editing.active ? 'true' : 'false'} onChange={(e) => setEditing({ ...editing, active: e.target.value === 'true' })} className="input-field cursor-pointer"><option value="true">فعال</option><option value="false">غیرفعال</option></select></FormField>
          </div>
          <div className="flex justify-end gap-3 pt-2"><button onClick={() => setDialogOpen(false)} className="btn-ghost">لغو</button><button onClick={handleSave} className="btn-primary" disabled={saving}>{saving ? 'در حال ذخیره...' : 'ذخیره'}</button></div>
        </div>
      </Dialog>
      <ConfirmDialog open={!!deleteId} message="آیا از حذف این دسته‌بندی مطمئن هستید؟ این عملیات قابل بازگشت نیست." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
