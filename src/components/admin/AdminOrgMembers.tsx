import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
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
import type { OrgMember, OrgUnit, ManagementLevel } from '../../types';
import { managementLevelLabels } from '../../types';
import {
  adminGetOrgMembers,
  adminGetOrgUnits,
  adminSaveOrgMember,
  adminDeleteOrgMember,
  emptyOrgMember,
  newId,
} from '../../lib/orgApi';

export default function AdminOrgMembers() {
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [editing, setEditing] = useState<OrgMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [mems, uns] = await Promise.all([adminGetOrgMembers(), adminGetOrgUnits()]);
      setMembers(mems);
      setUnits(uns);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const unitName = (id: string) => units.find((u) => u.id === id)?.name ?? '—';
  const memberName = (id: string | null) => (id ? members.find((m) => m.id === id)?.name ?? '—' : '—');

  const filtered = members.filter((m) => {
    if (filterUnit && m.unitId !== filterUnit) return false;
    if (filterLevel && m.managementLevel !== filterLevel) return false;
    const q = query.trim();
    if (!q) return true;
    return m.name.includes(q) || m.position.includes(q) || m.department.includes(q);
  });

  const openNew = () => setEditing({ ...emptyOrgMember(), id: newId() });
  const openEdit = (m: OrgMember) => setEditing({ ...m });

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await adminSaveOrgMember(editing);
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await adminDeleteOrgMember(id);
    setConfirmDelete(null);
    await load();
  };

  const update = (field: keyof OrgMember, value: string | number | boolean | null) => {
    setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // Available parents: exclude self and descendants to prevent cycles
  const availableParents = (currentId: string) => {
    const descendants = new Set<string>();
    const collect = (pid: string) => {
      for (const m of members) {
        if (m.parentId === pid) {
          descendants.add(m.id);
          collect(m.id);
        }
      }
    };
    collect(currentId);
    return members.filter((m) => m.id !== currentId && !descendants.has(m.id));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-bold text-emerald-deep">اعضای سازمان</h3>
          <p className="mt-1 text-sm text-muted">{members.length} عضو ثبت شده است</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" />
          افزودن عضو
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
            placeholder="جستجو در نام، سمت، بخش..."
            className="input-field pr-12"
          />
        </div>
        <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} className="input-field max-w-[180px]">
          <option value="">همه واحدها</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="input-field max-w-[180px]">
          <option value="">همه سطوح</option>
          {(Object.keys(managementLevelLabels) as ManagementLevel[]).map((lvl) => (
            <option key={lvl} value={lvl}>{managementLevelLabels[lvl]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-emerald/10 bg-emerald-soft/50 text-xs text-muted">
                <th className="px-4 py-3 font-medium">نام</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">سمت</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">واحد</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">سطح مدیریت</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-emerald/5">
                    <td className="px-4 py-3"><div className="skeleton h-5 w-32 rounded" /></td>
                    <td className="hidden px-4 py-3 md:table-cell"><div className="skeleton h-5 w-24 rounded" /></td>
                    <td className="hidden px-4 py-3 lg:table-cell"><div className="skeleton h-5 w-20 rounded" /></td>
                    <td className="hidden px-4 py-3 lg:table-cell"><div className="skeleton h-5 w-20 rounded" /></td>
                    <td className="px-4 py-3"><div className="skeleton h-5 w-16 rounded" /></td>
                    <td className="px-4 py-3"><div className="skeleton h-5 w-20 rounded" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted">
                    <Users className="mx-auto mb-3 h-10 w-10 text-mutedLight" />
                    عضوی یافت نشد
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="border-b border-emerald/5 transition-colors hover:bg-emerald-soft/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {m.image ? (
                          <img src={m.image} alt={m.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10">
                            <Users className="h-5 w-5 text-teal" />
                          </div>
                        )}
                        <div>
                          <span className="block font-medium text-ink">{m.name}</span>
                          <span className="block text-xs text-mutedLight">{m.department || '—'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted md:table-cell">{m.position || '—'}</td>
                    <td className="hidden px-4 py-3 text-muted lg:table-cell">{unitName(m.unitId)}</td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <span className="rounded-lg bg-cream px-2 py-1 text-xs text-gold-deep">
                        {managementLevelLabels[m.managementLevel]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {m.active ? (
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
                        <button onClick={() => openEdit(m)} className="rounded-lg p-2 text-emerald transition-colors hover:bg-emerald-soft" title="ویرایش">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setConfirmDelete(m.id)} className="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50" title="حذف">
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
                  {members.some((m) => m.id === editing.id) ? 'ویرایش عضو' : 'عضو جدید'}
                </h4>
                <button onClick={() => setEditing(null)} className="rounded-lg p-2 text-muted transition-colors hover:bg-emerald-soft">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 p-6">
                {/* Image preview */}
                {editing.image && (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald/10 bg-emerald-soft/20 p-3">
                    <img src={editing.image} alt={editing.name} className="h-16 w-16 rounded-full object-cover" />
                    <span className="text-xs text-muted">تصویر فعلی عضو</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="نام و نام خانوادگی" required>
                    <input className="input-field" value={editing.name} onChange={(e) => update('name', e.target.value)} />
                  </Field>
                  <Field label="سمت">
                    <input className="input-field" value={editing.position} onChange={(e) => update('position', e.target.value)} />
                  </Field>
                  <Field label="بخش / واحد سازمانی">
                    <input className="input-field" value={editing.department} onChange={(e) => update('department', e.target.value)} />
                  </Field>
                  <Field label="واحد سازمانی">
                    <select className="input-field" value={editing.unitId} onChange={(e) => update('unitId', e.target.value)}>
                      <option value="">بدون واحد</option>
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="مدیر / والد (گزارش به)">
                    <select
                      className="input-field"
                      value={editing.parentId ?? ''}
                      onChange={(e) => update('parentId', e.target.value || null)}
                    >
                      <option value="">بدون مدیر (ریشه)</option>
                      {availableParents(editing.id).map((m) => (
                        <option key={m.id} value={m.id}>{m.name} — {m.position}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="سطح مدیریت">
                    <select
                      className="input-field"
                      value={editing.managementLevel}
                      onChange={(e) => update('managementLevel', e.target.value as ManagementLevel)}
                    >
                      {(Object.keys(managementLevelLabels) as ManagementLevel[]).map((lvl) => (
                        <option key={lvl} value={lvl}>{managementLevelLabels[lvl]}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="تصویر (URL)">
                    <input className="input-field" value={editing.image} onChange={(e) => update('image', e.target.value)} placeholder="https://..." dir="ltr" />
                  </Field>
                  <Field label="ترتیب">
                    <input type="number" className="input-field" value={editing.order} onChange={(e) => update('order', Number(e.target.value))} />
                  </Field>
                  <Field label="تلفن">
                    <input className="input-field" value={editing.phone} onChange={(e) => update('phone', e.target.value)} dir="ltr" />
                  </Field>
                  <Field label="ایمیل">
                    <input className="input-field" value={editing.email} onChange={(e) => update('email', e.target.value)} dir="ltr" />
                  </Field>
                </div>

                <Field label="دفتر / محل کار">
                  <input className="input-field" value={editing.office} onChange={(e) => update('office', e.target.value)} />
                </Field>

                <Field label="بیوگرافی">
                  <textarea rows={4} className="input-field resize-none" value={editing.bio} onChange={(e) => update('bio', e.target.value)} />
                </Field>

                <label className="flex items-center gap-2.5 rounded-xl border border-emerald/15 bg-emerald-soft/30 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={editing.active}
                    onChange={(e) => update('active', e.target.checked)}
                    className="h-4 w-4 accent-emerald"
                  />
                  <span className="text-sm font-medium text-emerald-deep">عضو فعال است</span>
                </label>

                {/* Parent info */}
                {editing.parentId && (
                  <div className="rounded-xl border border-emerald/10 bg-cream/40 px-4 py-3 text-xs text-muted">
                    مدیر مستقیم: <span className="font-medium text-emerald-deep">{memberName(editing.parentId)}</span>
                  </div>
                )}
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
              <h4 className="mb-2 font-display text-lg font-bold text-ink">حذف عضو سازمان</h4>
              <p className="mb-6 text-sm text-muted">
                آیا از حذف این عضو مطمئن هستید؟ زیرمجموعه‌های این عضو به «بدون مدیر» منتقل می‌شوند. این عملیات قابل بازگشت نیست.
              </p>
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
