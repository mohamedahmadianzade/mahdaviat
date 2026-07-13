import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ShoppingBag, ImagePlus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product, ProductCategory } from '../../types';
import { adminGetProducts, adminGetCategories, adminSaveProduct, adminDeleteProduct, newId } from '../../lib/storeApi';
import { Dialog, ConfirmDialog, FormField, StatusBadge, EmptyState, AdminSearchInput } from './AdminUI';

const emptyProduct = (): Product => ({
  id: newId(), name: '', categoryId: '', images: [], shortDescription: '', description: '',
  price: '', keywords: [], order: 1, active: true, similarIds: [],
});

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product>(emptyProduct());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const load = () => { adminGetProducts().then(setProducts); adminGetCategories().then(setCategories); };
  useEffect(() => { load(); }, []);

  const catMap = new Map(categories.map((c) => [c.id, c]));
  const filtered = products.filter((p) => {
    if (filterCat && p.categoryId !== filterCat) return false;
    if (!query) return true;
    return p.name.includes(query) || p.shortDescription.includes(query) || p.keywords.some((k) => k.includes(query));
  });

  const openAdd = () => { setEditing(emptyProduct()); setNewImageUrl(''); setDialogOpen(true); };
  const openEdit = (p: Product) => { setEditing({ ...p, images: [...p.images], keywords: [...p.keywords] }); setNewImageUrl(''); setDialogOpen(true); };
  const handleSave = async () => { if (!editing.name.trim()) return; setSaving(true); await adminSaveProduct(editing); setSaving(false); setDialogOpen(false); load(); };
  const handleDelete = async () => { if (!deleteId) return; await adminDeleteProduct(deleteId); setDeleteId(null); load(); };
  const update = <K extends keyof Product>(key: K, value: Product[K]) => setEditing((prev) => ({ ...prev, [key]: value }));

  const addImage = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    update('images', [...editing.images, url]);
    setNewImageUrl('');
  };
  const removeImage = (index: number) => {
    update('images', editing.images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="max-w-xs flex-1"><AdminSearchInput value={query} onChange={setQuery} placeholder="جستجوی محصول..." /></div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="input-field w-auto cursor-pointer"><option value="">همه دسته‌ها</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <button onClick={openAdd} className="btn-primary shrink-0"><Plus className="h-4 w-4" />افزودن محصول</button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="محصولی یافت نشد" icon={<ShoppingBag className="h-6 w-6" />} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="border-b border-emerald/10 bg-emerald-soft/50"><tr>{['تصویر', 'نام محصول', 'دسته', 'قیمت', 'ترتیب', 'وضعیت', 'عملیات'].map((h) => <th key={h} className="px-4 py-3 text-xs font-semibold text-emerald-deep">{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-emerald/5 last:border-0 hover:bg-ivory/60 transition-colors">
                    <td className="px-4 py-3">{p.images[0] ? <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" /> : <div className="h-10 w-10 rounded-lg bg-emerald-soft" />}</td>
                    <td className="max-w-[180px] px-4 py-3"><p className="truncate font-medium text-ink">{p.name}</p><p className="truncate text-xs text-muted">{p.shortDescription}</p></td>
                    <td className="px-4 py-3 text-sm text-muted">{catMap.get(p.categoryId)?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gold-deep">{p.price || '—'}</td>
                    <td className="px-4 py-3 text-sm text-muted">{p.order}</td>
                    <td className="px-4 py-3"><StatusBadge active={p.active} /></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-emerald-soft hover:text-emerald"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteId(p.id)} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} title={products.some((p) => p.id === editing.id) ? 'ویرایش محصول' : 'افزودن محصول'} onClose={() => setDialogOpen(false)}>
        <div className="space-y-4">
          <FormField label="نام محصول" required><input type="text" value={editing.name} onChange={(e) => update('name', e.target.value)} className="input-field" /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="دسته‌بندی" required><select value={editing.categoryId} onChange={(e) => update('categoryId', e.target.value)} className="input-field cursor-pointer"><option value="">انتخاب دسته</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></FormField>
            <FormField label="قیمت"><input type="text" value={editing.price} onChange={(e) => update('price', e.target.value)} className="input-field" placeholder="مثلاً: ۱۵۰,۰۰۰ تومان" /></FormField>
          </div>

          {/* ─── Multi-image manager ─── */}
          <FormField label="تصاویر محصول">
            <div className="space-y-3">
              {/* Existing images */}
              {editing.images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {editing.images.map((img, i) => (
                    <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-emerald/15">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="حذف تصویر"
                      >
                        <X className="h-5 w-5 text-white" />
                      </button>
                      {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-emerald/80 py-0.5 text-center text-[9px] text-white">کاور</span>}
                    </div>
                  ))}
                </div>
              )}
              {/* Add new image */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                  className="input-field"
                  dir="ltr"
                  placeholder="لینک تصویر را وارد کنید"
                />
                <button onClick={addImage} type="button" className="btn-ghost shrink-0">
                  <ImagePlus className="h-4 w-4" />
                  افزودن
                </button>
              </div>
              {editing.images.length === 0 && <p className="text-xs text-mutedLight">حداقل یک تصویر اضافه کنید. تصویر اول به عنوان کاور استفاده می‌شود.</p>}
            </div>
          </FormField>

          <FormField label="توضیح کوتاه" required><textarea value={editing.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} className="input-field resize-none" rows={2} /></FormField>
          <FormField label="توضیح کامل"><textarea value={editing.description} onChange={(e) => update('description', e.target.value)} className="input-field resize-none" rows={4} /></FormField>
          <FormField label="کلیدواژه‌ها (با کاما جدا کنید)"><input type="text" value={editing.keywords.join(', ')} onChange={(e) => update('keywords', e.target.value.split(',').map((k) => k.trim()).filter(Boolean))} className="input-field" /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="ترتیب نمایش"><input type="number" value={editing.order} onChange={(e) => update('order', Number(e.target.value))} className="input-field" min={1} /></FormField>
            <FormField label="وضعیت"><select value={editing.active ? 'true' : 'false'} onChange={(e) => update('active', e.target.value === 'true')} className="input-field cursor-pointer"><option value="true">فعال</option><option value="false">غیرفعال</option></select></FormField>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3 border-t border-emerald/10 pt-4">
          <button onClick={() => setDialogOpen(false)} className="btn-ghost">لغو</button>
          <button onClick={handleSave} className="btn-primary" disabled={saving}>{saving ? 'در حال ذخیره...' : 'ذخیره'}</button>
        </div>
      </Dialog>

      <ConfirmDialog open={!!deleteId} message="آیا از حذف این محصول مطمئن هستید؟ این عملیات قابل بازگشت نیست." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
