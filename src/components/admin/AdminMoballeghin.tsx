import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  CalendarDays,
} from 'lucide-react';
import type { Moballagh, MaritalStatus, EducationLevel } from '../../types';
import { maritalStatusLabels, educationLevelLabels, birthYears, emptyMoballagh } from '../../types';
import {
  adminGetMoballeghin,
  adminSaveMoballagh,
  adminDeleteMoballagh,
} from '../../lib/moballeghinApi';

type FormState = Moballagh;

interface AdminMoballeghinProps {
  onOpenActivities?: (missionaryId: string) => void;
}

export default function AdminMoballeghin({ onOpenActivities }: AdminMoballeghinProps) {
  const [list, setList] = useState<Moballagh[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setList(await adminGetMoballeghin());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = list.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      m.fullName.toLowerCase().includes(q) ||
      m.fatherName.toLowerCase().includes(q) ||
      m.nationalCode.includes(q) ||
      m.phone.includes(q)
    );
  });

  const openAdd = () => {
    setEditing({ ...emptyMoballagh(), id: '', registeredAt: new Date().toISOString() });
  };

  const openEdit = (m: Moballagh) => {
    setEditing({ ...m });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await adminSaveMoballagh(editing);
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminDeleteMoballagh(deleteId);
    setDeleteId(null);
    await load();
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setEditing((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-soft text-emerald-deep">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-emerald-deep">مبلغین</h3>
            <p className="text-xs text-muted">{list.length} نفر ثبت‌نام کرده‌اند</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          افزودن مبلغ
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mutedLight" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو بر اساس نام، کد ملی، تلفن..."
          className="input-field pr-12"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-soft text-emerald">
            <Mic className="h-8 w-8" />
          </div>
          <p className="text-sm text-muted">مبلغی ثبت‌نام نکرده است</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-emerald/10 bg-white shadow-soft">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-emerald/10 bg-emerald-soft/30 text-xs text-muted">
                <th className="px-4 py-3 font-medium">نام و نام خانوادگی</th>
                <th className="px-4 py-3 font-medium">نام پدر</th>
                <th className="px-4 py-3 font-medium">کد ملی</th>
                <th className="px-4 py-3 font-medium">تلفن</th>
                <th className="px-4 py-3 font-medium">سال تولد</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-emerald/5 transition-colors hover:bg-emerald-soft/20">
                  <td className="px-4 py-3 font-medium text-emerald-deep">{m.fullName || '—'}</td>
                  <td className="px-4 py-3 text-muted">{m.fatherName || '—'}</td>
                  <td className="px-4 py-3 text-muted">{m.nationalCode || '—'}</td>
                  <td className="px-4 py-3 text-muted">{m.phone || '—'}</td>
                  <td className="px-4 py-3 text-muted">{m.birthYear ? Number(m.birthYear).toLocaleString('fa-IR') : '—'}</td>
                  <td className="px-4 py-3">
                    {m.active ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2.5 py-1 text-xs text-emerald-deep">
                        <CheckCircle2 className="h-3 w-3" /> فعال
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs text-rose-600">
                        <XCircle className="h-3 w-3" /> غیرفعال
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenActivities?.(m.id)}
                        title="فعالیت‌های تبلیغی"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-emerald-soft hover:text-emerald-deep"
                      >
                        <CalendarDays className="h-4 w-4" />
                      </button>
                      <button onClick={() => openEdit(m)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-emerald-soft hover:text-emerald-deep">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(m.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-rose-50 hover:text-rose-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit/Add modal */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(null)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-x-4 top-8 z-50 mx-auto max-h-[85vh] max-w-2xl overflow-y-auto rounded-3xl border border-emerald/10 bg-ivory p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-emerald-deep">
                  {editing.id ? 'ویرایش مبلغ' : 'افزودن مبلغ'}
                </h3>
                <button onClick={() => setEditing(null)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-emerald-soft hover:text-emerald-deep">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* اطلاعات شخصی */}
                <div>
                  <h4 className="mb-3 text-xs font-bold text-emerald-deep">اطلاعات شخصی</h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="نام و نام خانوادگی">
                      <input className="input-field" value={editing.fullName} onChange={(e) => set('fullName', e.target.value)} />
                    </FormField>
                    <FormField label="نام پدر">
                      <input className="input-field" value={editing.fatherName} onChange={(e) => set('fatherName', e.target.value)} />
                    </FormField>
                    <FormField label="شماره شناسنامه">
                      <input className="input-field" value={editing.idCardNumber} onChange={(e) => set('idCardNumber', e.target.value)} inputMode="numeric" />
                    </FormField>
                    <FormField label="کد ملی">
                      <input className="input-field" value={editing.nationalCode} onChange={(e) => set('nationalCode', e.target.value)} inputMode="numeric" maxLength={10} />
                    </FormField>
                  </div>
                </div>

                {/* اطلاعات تکمیلی */}
                <div>
                  <h4 className="mb-3 text-xs font-bold text-emerald-deep">اطلاعات تکمیلی</h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="سال تولد">
                      <select className="input-field" value={editing.birthYear} onChange={(e) => set('birthYear', e.target.value)}>
                        <option value="">انتخاب کنید</option>
                        {birthYears.map((y) => (
                          <option key={y} value={String(y)}>{y.toLocaleString('fa-IR')}</option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="محل تولد">
                      <input className="input-field" value={editing.birthPlace} onChange={(e) => set('birthPlace', e.target.value)} />
                    </FormField>
                    <FormField label="سطح تحصیلات">
                      <select className="input-field" value={editing.educationLevel} onChange={(e) => set('educationLevel', e.target.value as EducationLevel | '')}>
                        <option value="">انتخاب کنید</option>
                        {(Object.keys(educationLevelLabels) as EducationLevel[]).map((k) => (
                          <option key={k} value={k}>{educationLevelLabels[k]}</option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="وضعیت تأهل">
                      <select className="input-field" value={editing.maritalStatus} onChange={(e) => set('maritalStatus', e.target.value as MaritalStatus | '')}>
                        <option value="">انتخاب کنید</option>
                        {(Object.keys(maritalStatusLabels) as MaritalStatus[]).map((k) => (
                          <option key={k} value={k}>{maritalStatusLabels[k]}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                </div>

                {/* اطلاعات تماس و بانکی */}
                <div>
                  <h4 className="mb-3 text-xs font-bold text-emerald-deep">اطلاعات تماس و بانکی</h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="تلفن همراه">
                      <input className="input-field" value={editing.phone} onChange={(e) => set('phone', e.target.value)} inputMode="tel" />
                    </FormField>
                    <FormField label="شماره حساب بانکی">
                      <input className="input-field" value={editing.bankAccountNumber} onChange={(e) => set('bankAccountNumber', e.target.value)} />
                    </FormField>
                    <div className="sm:col-span-2">
                      <FormField label="آدرس">
                        <textarea className="input-field min-h-[70px] resize-y" value={editing.address} onChange={(e) => set('address', e.target.value)} />
                      </FormField>
                    </div>
                  </div>
                </div>

                {/* Active toggle */}
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input type="checkbox" checked={editing.active} onChange={(e) => set('active', e.target.checked)} className="h-4 w-4 accent-emerald" />
                  فعال
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setEditing(null)} className="btn-ghost">انصراف</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'ذخیره'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-2xl border border-emerald/10 bg-white p-6 text-center shadow-2xl"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <Trash2 className="h-7 w-7" />
              </div>
              <h4 className="mb-2 font-display text-base font-bold text-ink">حذف مبلغ</h4>
              <p className="mb-5 text-sm text-muted">آیا از حذف این مبلغ اطمینان دارید؟</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-ghost">انصراف</button>
                <button onClick={handleDelete} className="btn-primary bg-rose-600 hover:bg-rose-700">حذف</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      {children}
    </div>
  );
}
