import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
} from 'lucide-react';
import type { OrgUnit } from '../../types';
import {
  adminGetOrgUnits,
  adminSaveOrgUnit,
  adminDeleteOrgUnit,
  emptyOrgUnit,
  newId,
} from '../../lib/orgApi';

interface UnitNode extends OrgUnit {
  children: UnitNode[];
}

function buildTree(units: OrgUnit[]): UnitNode[] {
  const byParent = new Map<string | null, OrgUnit[]>();
  for (const u of units) {
    const key = u.parentId;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(u);
  }
  const build = (parentId: string | null): UnitNode[] => {
    const children = byParent.get(parentId) ?? [];
    return children.sort((a, b) => a.order - b.order).map((u) => ({ ...u, children: build(u.id) }));
  };
  return build(null);
}

function flatten(nodes: UnitNode[]): { unit: UnitNode; depth: number }[] {
  const result: { unit: UnitNode; depth: number }[] = [];
  const walk = (list: UnitNode[], depth: number) => {
    for (const n of list) {
      result.push({ unit: n, depth });
      if (n.children.length) walk(n.children, depth + 1);
    }
  };
  walk(nodes, 0);
  return result;
}

export default function AdminOrgUnits() {
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<OrgUnit | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminGetOrgUnits();
      setUnits(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const tree = buildTree(units);
  const flat = flatten(tree);

  const openNew = () => setEditing({ ...emptyOrgUnit(), id: newId() });
  const openEdit = (u: OrgUnit) => setEditing({ ...u });

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await adminSaveOrgUnit(editing);
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await adminDeleteOrgUnit(id);
    setConfirmDelete(null);
    await load();
  };

  const update = (field: keyof OrgUnit, value: string | number | boolean | null) => {
    setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // For parent dropdown: exclude self and descendants
  const availableParents = (currentId: string) => {
    const descendants = new Set<string>();
    const collect = (pid: string) => {
      for (const u of units) {
        if (u.parentId === pid) {
          descendants.add(u.id);
          collect(u.id);
        }
      }
    };
    collect(currentId);
    return units.filter((u) => u.id !== currentId && !descendants.has(u.id));
  };

  const parentName = (parentId: string | null) =>
    parentId ? units.find((u) => u.id === parentId)?.name ?? '—' : 'بدون والد';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-bold text-emerald-deep">واحدهای سازمانی</h3>
          <p className="mt-1 text-sm text-muted">{units.length} واحد سازمانی ثبت شده است</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" />
          افزودن واحد
        </button>
      </div>

      {/* Tree list */}
      <div className="overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : flat.length === 0 ? (
          <div className="px-4 py-12 text-center text-muted">
            <Network className="mx-auto mb-3 h-10 w-10 text-mutedLight" />
            واحدی یافت نشد
          </div>
        ) : (
          <ul className="divide-y divide-emerald/5">
            {flat.map(({ unit, depth }) => (
              <li
                key={unit.id}
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-emerald-soft/30"
              >
                <div className="flex items-center gap-2" style={{ paddingRight: `${depth * 24}px` }}>
                  {depth > 0 && <ChevronLeft className="h-4 w-4 text-mutedLight" />}
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal/10">
                    <Network className="h-4 w-4 text-teal" />
                  </div>
                  <div>
                    <span className="font-medium text-ink">{unit.name}</span>
                    <span className="mr-2 text-xs text-mutedLight">
                      والد: {parentName(unit.parentId)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden text-xs text-mutedLight sm:inline">ترتیب: {unit.order}</span>
                  {unit.active ? (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-soft px-2 py-1 text-xs text-emerald-deep">
                      <CheckCircle2 className="h-3.5 w-3.5" /> فعال
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-xs text-rose-500">
                      <XCircle className="h-3.5 w-3.5" /> غیرفعال
                    </span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEdit(unit)} className="rounded-lg p-2 text-emerald transition-colors hover:bg-emerald-soft" title="ویرایش">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setConfirmDelete(unit.id)} className="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50" title="حذف">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
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
                  {units.some((u) => u.id === editing.id) ? 'ویرایش واحد سازمانی' : 'واحد سازمانی جدید'}
                </h4>
                <button onClick={() => setEditing(null)} className="rounded-lg p-2 text-muted transition-colors hover:bg-emerald-soft">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 p-6">
                <Field label="نام واحد" required>
                  <input className="input-field" value={editing.name} onChange={(e) => update('name', e.target.value)} placeholder="نام واحد سازمانی" />
                </Field>

                <Field label="واحد والد">
                  <select
                    className="input-field"
                    value={editing.parentId ?? ''}
                    onChange={(e) => update('parentId', e.target.value || null)}
                  >
                    <option value="">بدون والد (ریشه)</option>
                    {availableParents(editing.id).map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
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
                  <span className="text-sm font-medium text-emerald-deep">واحد فعال است</span>
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
              <h4 className="mb-2 font-display text-lg font-bold text-ink">حذف واحد سازمانی</h4>
              <p className="mb-6 text-sm text-muted">
                آیا از حذف این واحد مطمئن هستید؟ اعضای این واحد به «بدون واحد» منتقل می‌شوند. این عملیات قابل بازگشت نیست.
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
