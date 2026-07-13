import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Users, ImagePlus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { OrgMember, OrgUnit, ManagementLevel } from '../../types';
import { managementLevelLabels } from '../../types';
import { adminGetOrgMembers, adminSaveOrgMember, adminDeleteOrgMember, adminGetOrgUnits, emptyOrgMember } from '../../lib/orgApi';
import { Dialog, ConfirmDialog, FormField, StatusBadge, EmptyState, AdminSearchInput } from './AdminUI';

export default function AdminOrgMembers() {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [query, setQuery] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<OrgMember>(emptyOrgMember());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const load = () => {
    adminGetOrgMembers().then(setMembers);
    adminGetOrgUnits().then(setUnits);
  };
  useEffect(() => { load(); }, []);

  const memberMap = new Map(members.map((m) => [m.id, m]));
  const filtered = members.filter((m) => {
    if (filterUnit && m.unitId !== filterUnit) return false;
    if (!query) return true;
    return m.name.includes(query) || m.position.includes(query) || m.department.includes(query);
  });

  const openAdd = () => { setEditing(emptyOrgMember()); setNewImageUrl(''); setDialogOpen(true); };
  const openEdit = (m: OrgMember) => {
    setEditing({ ...m, responsibilities: [...m.responsibilities], education: [...m.education], experience: [...m.experience], skills: [...m.skills], researchAreas: [...m.researchAreas], publications: [...m.publications], projects: [...m.projects], certificates: [...m.certificates], awards: [...m.awards], socialLinks: [...m.socialLinks], gallery: [...m.gallery], documents: [...m.documents] });
    setNewImageUrl('');
    setDialogOpen(true);
  };
  const handleSave = async () => {
    if (!editing.name.trim()) return;
    setSaving(true);
    await adminSaveOrgMember(editing);
    setSaving(false);
    setDialogOpen(false);
    load();
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    await adminDeleteOrgMember(deleteId);
    setDeleteId(null);
    load();
  };

  const update = <K extends keyof OrgMember>(key: K, value: OrgMember[K]) => setEditing((prev) => ({ ...prev, [key]: value }));
  const updateList = (key: keyof OrgMember, value: string) => update(key, value.split('\n').map((s) => s.trim()).filter(Boolean) as never);

  const addImage = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    update('image', url);
    setNewImageUrl('');
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update('image', reader.result as string);
    reader.readAsDataURL(file);
  };

  const listFields: { key: keyof OrgMember; label: string }[] = [
    { key: 'responsibilities', label: 'مسئولیت‌ها (هر خط یک مورد)' },
    { key: 'education', label: 'تحصیلات (هر خط یک مورد)' },
    { key: 'experience', label: 'سوابق حرفه‌ای (هر خط یک مورد)' },
    { key: 'skills', label: 'مهارت‌ها (هر خط یک مورد)' },
    { key: 'researchAreas', label: 'حوزه‌های پژوهشی (هر خط یک مورد)' },
    { key: 'publications', label: 'انتشارات (هر خط یک مورد)' },
    { key: 'projects', label: 'پروژه‌ها (هر خط یک مورد)' },
    { key: 'certificates', label: 'گواهینامه‌ها (هر خط یک مورد)' },
    { key: 'awards', label: 'افتخارات (هر خط یک مورد)' },
  ];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="max-w-xs flex-1"><AdminSearchInput value={query} onChange={setQuery} placeholder="جستجوی عضو..." /></div>
        <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className="input-field w-auto cursor-pointer"><option value="">همه واحدها</option>{units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select>
        <button onClick={openAdd} className="btn-primary shrink-0"><Plus className="h-4 w-4" />افزودن عضو</button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="عضوی یافت نشد" icon={<Users className="h-6 w-6" />} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="border-b border-emerald/10 bg-emerald-soft/50">
                <tr>{['تصویر', 'نام', 'سمت', 'بخش', 'مدیر والد', 'ترتیب', 'وضعیت', 'عملیات'].map((h) => <th key={h} className="px-4 py-3 text-xs font-semibold text-emerald-deep">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-emerald/5 last:border-0 hover:bg-ivory/60 transition-colors">
                    <td className="px-4 py-3">{m.image ? <img src={m.image} alt={m.name} className="h-10 w-10 rounded-full object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-soft text-sm font-bold text-emerald">{m.name.charAt(0)}</div>}</td>
                    <td className="max-w-[140px] px-4 py-3"><p className="truncate font-medium text-ink">{m.name}</p><p className="truncate text-xs text-muted">{m.position}</p></td>
                    <td className="max-w-[120px] px-4 py-3 text-sm text-muted truncate">{m.position}</td>
                    <td className="px-4 py-3 text-sm text-muted">{m.department || '—'}</td>
                    <td className="px-4 py-3 text-sm text-muted">{m.parentId ? (memberMap.get(m.parentId)?.name ?? '—') : '—'}</td>
                    <td className="px-4 py-3 text-sm text-muted">{m.order}</td>
                    <td className="px-4 py-3"><StatusBadge active={m.active} /></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2">
                      <button onClick={() => openEdit(m)} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-emerald-soft hover:text-emerald"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => setDeleteId(m.id)} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} title={members.some((m) => m.id === editing.id) ? 'ویرایش عضو' : 'افزودن عضو'} onClose={() => setDialogOpen(false)}>
        <div className="space-y-4">
          {/* Photo */}
          <FormField label="تصویر پروفایل">
            <div className="flex items-center gap-3">
              {editing.image && (
                <div className="group relative h-16 w-16 overflow-hidden rounded-full border border-emerald/15">
                  <img src={editing.image} alt="" className="h-full w-full object-cover" />
                  <button onClick={() => update('image', '')} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"><X className="h-5 w-5 text-white" /></button>
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input type="url" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }} className="input-field" dir="ltr" placeholder="لینک تصویر" />
                  <button onClick={addImage} type="button" className="btn-ghost shrink-0"><ImagePlus className="h-4 w-4" /></button>
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-muted hover:text-emerald transition-colors">
                  <input type="file" accept="image/*" onChange={onFileUpload} className="hidden" />
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald/15 bg-emerald-soft/30 px-3 py-1.5">آپلود فایل</span>
                </label>
              </div>
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="نام و نام خانوادگی" required><input type="text" value={editing.name} onChange={(e) => update('name', e.target.value)} className="input-field" /></FormField>
            <FormField label="سمت" required><input type="text" value={editing.position} onChange={(e) => update('position', e.target.value)} className="input-field" /></FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="بخش"><input type="text" value={editing.department} onChange={(e) => update('department', e.target.value)} className="input-field" /></FormField>
            <FormField label="واحد سازمانی"><select value={editing.unitId} onChange={(e) => update('unitId', e.target.value)} className="input-field cursor-pointer"><option value="">انتخاب واحد</option>{units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="مدیر والد"><select value={editing.parentId ?? ''} onChange={(e) => update('parentId', e.target.value || null)} className="input-field cursor-pointer"><option value="">بدون والد (ریشه)</option>{members.filter((m) => m.id !== editing.id).map((m) => <option key={m.id} value={m.id}>{m.name} — {m.position}</option>)}</select></FormField>
            <FormField label="سطح مدیریت"><select value={editing.managementLevel} onChange={(e) => update('managementLevel', e.target.value as ManagementLevel)} className="input-field cursor-pointer">{(Object.keys(managementLevelLabels) as ManagementLevel[]).map((l) => <option key={l} value={l}>{managementLevelLabels[l]}</option>)}</select></FormField>
          </div>

          <FormField label="زندگی‌نامه"><textarea value={editing.bio} onChange={(e) => update('bio', e.target.value)} className="input-field resize-none" rows={3} /></FormField>

          {listFields.map((f) => (
            <FormField key={f.key} label={f.label}><textarea value={(editing[f.key] as string[]).join('\n')} onChange={(e) => updateList(f.key, e.target.value)} className="input-field resize-none" rows={3} /></FormField>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <FormField label="تلفن"><input type="text" value={editing.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" dir="ltr" /></FormField>
            <FormField label="ایمیل"><input type="email" value={editing.email} onChange={(e) => update('email', e.target.value)} className="input-field" dir="ltr" /></FormField>
          </div>
          <FormField label="موقعیت دفتر"><input type="text" value={editing.office} onChange={(e) => update('office', e.target.value)} className="input-field" /></FormField>

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

      <ConfirmDialog open={!!deleteId} message="آیا از حذف این عضو مطمئن هستید؟" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
