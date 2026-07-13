import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { OrgUnit } from '../../types';
import { adminGetOrgUnits, adminSaveOrgUnit, adminDeleteOrgUnit, emptyOrgUnit, newId } from '../../lib/orgApi';
import { Dialog, ConfirmDialog, FormField, StatusBadge, EmptyState, AdminSearchInput } from './AdminUI';

export default function AdminOrgUnits() {
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<OrgUnit>(emptyOrgUnit());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => adminGetOrgUnits().then(setUnits);
  useEffect(() => { load(); }, []);

  const unitMap = new Map(units.map((u) => [u.id, u]));
  const filtered = units.filter((u) => u.name.includes(query));

  const openAdd = () => { setEditing({ ...emptyOrgUnit(), id: newId() }); setDialogOpen(true); };
  const openEdit = (u: OrgUnit) => { setEditing({ ...u }); setDialogOpen(true); };
  const handleSave = async () => {
    if (!editing.name.trim()) return;
    setSaving(true);
    await adminSaveOrgUnit(editing);
    setSaving(false);
    setDialogOpen(false);
    load();
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    await adminDeleteOrgUnit(deleteId);
    setDeleteId(null);
    load();
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="max-w-xs flex-1"><AdminSearchInput value={query} onChange={setQuery} placeholder="جستجوی واحد..." /></div>
        <button onClick={openAdd} className="btn-primary shrink-0"><Plus className="h-4 w-4" />افزودن واحد</button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="واحد سازمانی یافت نشد" icon={<Building2 className="h-6 w-6" />} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="border-b border-emerald/10 bg-emerald-soft/50">
                <tr>{['نام واحد', 'واحد والد', 'ترتیب', 'وضعیت', 'عملیات'].map((h) => <th key={h} className="px-4 py-3 text-xs font-semibold text-emerald-deep">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-emerald/5 last:border-0 hover:bg-ivory/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-muted">{u.parentId ? (unitMap.get(u.parentId)?.name ?? '—') : 'بدون والد'}</td>
                    <td className="px-4 py-3 text-sm text-muted">{u.order}</td>
                    <td className="px-4 py-3"><StatusBadge active={u.active} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(u)} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-emerald-soft hover:text-emerald"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setDeleteId(u.id)} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} title={units.some((u) => u.id === editing.id) ? 'ویرایش واحد' : 'افزودن واحد'} onClose={() => setDialogOpen(false)}>
        <div className="space-y-4">
          <FormField label="نام واحد" required><input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input-field" /></FormField>
          <FormField label="واحد والد"><select value={editing.parentId ?? ''} onChange={(e) => setEditing({ ...editing, parentId: e.target.value || null })} className="input-field cursor-pointer"><option value="">بدون والد (ریشه)</option>{units.filter((u) => u.id !== editing.id).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="ترتیب نمایش"><input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} className="input-field" min={1} /></FormField>
            <FormField label="وضعیت"><select value={editing.active ? 'true' : 'false'} onChange={(e) => setEditing({ ...editing, active: e.target.value === 'true' })} className="input-field cursor-pointer"><option value="true">فعال</option><option value="false">غیرفعال</option></select></FormField>
          </div>
          <div className="flex justify-end gap-3 pt-2"><button onClick={() => setDialogOpen(false)} className="btn-ghost">لغو</button><button onClick={handleSave} className="btn-primary" disabled={saving}>{saving ? 'در حال ذخیره...' : 'ذخیره'}</button></div>
        </div>
      </Dialog>

      <ConfirmDialog open={!!deleteId} message="آیا از حذف این واحد سازمانی مطمئن هستید؟" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
