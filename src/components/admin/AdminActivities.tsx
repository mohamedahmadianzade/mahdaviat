import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  User,
  MapPin,
  Phone,
  Users as UsersIcon,
  BookOpen,
  UserCheck,
  Coins,
  Clock,
  GraduationCap,
  School,
} from 'lucide-react';
import type { Activity, Moballagh } from '../../types';
import { emptyActivity } from '../../types';
import {
  adminGetActivities,
  adminSaveActivity,
  adminDeleteActivity,
  newId,
} from '../../lib/activitiesApi';
import { adminGetMoballeghin } from '../../lib/moballeghinApi';

interface AdminActivitiesProps {
  initialMissionaryFilter?: string;
}

export default function AdminActivities({ initialMissionaryFilter }: AdminActivitiesProps) {
  const [list, setList] = useState<Activity[]>([]);
  const [moballeghin, setMoballeghin] = useState<Moballagh[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [missionaryFilter, setMissionaryFilter] = useState<string>(initialMissionaryFilter ?? '');
  const [editing, setEditing] = useState<Activity | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [acts, mobs] = await Promise.all([adminGetActivities(), adminGetMoballeghin()]);
      setList(acts);
      setMoballeghin(mobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    if (initialMissionaryFilter) setMissionaryFilter(initialMissionaryFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const missionaryName = (id: string) =>
    moballeghin.find((m) => m.id === id)?.fullName ?? '—';

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter((a) => {
      if (missionaryFilter && a.missionaryId !== missionaryFilter) return false;
      if (!q) return true;
      return (
        a.schoolName.toLowerCase().includes(q) ||
        a.schoolAddress.toLowerCase().includes(q) ||
        a.lectureTopic.toLowerCase().includes(q) ||
        a.contactPersonName.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q)
      );
    });
  }, [list, search, missionaryFilter]);

  const openAdd = () => {
    setEditing({
      ...emptyActivity(),
      id: newId(),
      missionaryId: missionaryFilter || '',
    });
  };

  const openEdit = (a: Activity) => {
    setEditing({ ...a });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await adminSaveActivity(editing);
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminDeleteActivity(deleteId);
    setDeleteId(null);
    await load();
  };

  const set = <K extends keyof Activity>(key: K, value: Activity[K]) => {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-soft text-emerald-deep">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-emerald-deep">فعالیت‌های تبلیغی</h3>
            <p className="text-xs text-muted">{filtered.length} فعالیت ثبت شده</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          افزودن فعالیت
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mutedLight" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو بر اساس نام مدرسه، موضوع سخنرانی، مکان..."
            className="input-field pr-12"
          />
        </div>
        <select
          value={missionaryFilter}
          onChange={(e) => setMissionaryFilter(e.target.value)}
          className="input-field sm:w-64"
        >
          <option value="">همه مبلغین</option>
          {moballeghin.map((m) => (
            <option key={m.id} value={m.id}>{m.fullName}</option>
          ))}
        </select>
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
            <CalendarDays className="h-8 w-8" />
          </div>
          <p className="text-sm text-muted">هیچ فعالیتی ثبت نشده است</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-emerald/10 bg-white shadow-soft">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-emerald/10 bg-emerald-soft/30 text-xs text-muted">
                <th className="px-4 py-3 font-medium">مبلغ</th>
                <th className="px-4 py-3 font-medium">نام مدرسه</th>
                <th className="px-4 py-3 font-medium">تاریخ برگزاری</th>
                <th className="px-4 py-3 font-medium">موضوع سخنرانی</th>
                <th className="px-4 py-3 font-medium">تعداد جلسات</th>
                <th className="px-4 py-3 font-medium">تعداد مخاطبین</th>
                <th className="px-4 py-3 font-medium">هزینه</th>
                <th className="px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-emerald/5 transition-colors hover:bg-emerald-soft/20">
                  <td className="px-4 py-3 font-medium text-emerald-deep">{missionaryName(a.missionaryId)}</td>
                  <td className="px-4 py-3 text-muted">{a.schoolName || '—'}</td>
                  <td className="px-4 py-3 text-muted">{a.eventDate || '—'}</td>
                  <td className="px-4 py-3 text-muted">{a.lectureTopic || '—'}</td>
                  <td className="px-4 py-3 text-muted">{a.sessionCount !== '' ? a.sessionCount : '—'}</td>
                  <td className="px-4 py-3 text-muted">{a.attendeeCount !== '' ? a.attendeeCount : '—'}</td>
                  <td className="px-4 py-3 text-muted">{a.cost !== '' ? Number(a.cost).toLocaleString('fa-IR') : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(a)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-emerald-soft hover:text-emerald-deep">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(a.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-rose-50 hover:text-rose-600">
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
              className="fixed inset-x-4 top-8 z-50 mx-auto max-h-[85vh] max-w-3xl overflow-y-auto rounded-3xl border border-emerald/10 bg-ivory p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-emerald-deep">
                  {editing.id && list.some((x) => x.id === editing.id) ? 'ویرایش فعالیت' : 'افزودن فعالیت'}
                </h3>
                <button onClick={() => setEditing(null)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-emerald-soft hover:text-emerald-deep">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* مبلغ */}
                <div>
                  <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-emerald-deep">
                    <User className="h-3.5 w-3.5" /> مبلغ
                  </h4>
                  <FormField label="انتخاب مبلغ">
                    <select
                      className="input-field"
                      value={editing.missionaryId}
                      onChange={(e) => set('missionaryId', e.target.value)}
                    >
                      <option value="">انتخاب کنید</option>
                      {moballeghin.map((m) => (
                        <option key={m.id} value={m.id}>{m.fullName}</option>
                      ))}
                    </select>
                  </FormField>
                </div>

                {/* اطلاعات مدرسه */}
                <div>
                  <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-emerald-deep">
                    <School className="h-3.5 w-3.5" /> اطلاعات مدرسه
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="نام مدرسه">
                      <input className="input-field" value={editing.schoolName} onChange={(e) => set('schoolName', e.target.value)} />
                    </FormField>
                    <FormField label="آدرس مدرسه">
                      <input className="input-field" value={editing.schoolAddress} onChange={(e) => set('schoolAddress', e.target.value)} />
                    </FormField>
                    <FormField label="نام شخص رابط">
                      <input className="input-field" value={editing.contactPersonName} onChange={(e) => set('contactPersonName', e.target.value)} />
                    </FormField>
                    <FormField label="شماره تماس رابط">
                      <input className="input-field" value={editing.contactPhoneNumber} onChange={(e) => set('contactPhoneNumber', e.target.value)} inputMode="tel" />
                    </FormField>
                  </div>
                </div>

                {/* اطلاعات برگزاری */}
                <div>
                  <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-emerald-deep">
                    <CalendarDays className="h-3.5 w-3.5" /> اطلاعات برگزاری
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="تاریخ برگزاری">
                      <input className="input-field" value={editing.eventDate} onChange={(e) => set('eventDate', e.target.value)} placeholder="مثال: ۱۴۰۳/۰۷/۱۵" />
                    </FormField>
                    <FormField label="تعداد جلسات">
                      <input className="input-field" type="number" min={0} value={editing.sessionCount} onChange={(e) => set('sessionCount', e.target.value === '' ? '' : Number(e.target.value))} inputMode="numeric" />
                    </FormField>
                    <FormField label="زمان‌بندی جلسات">
                      <input className="input-field" value={editing.sessionTiming} onChange={(e) => set('sessionTiming', e.target.value)} placeholder="مثال: هر هفته یک جلسه" />
                    </FormField>
                    <FormField label="مکان برگزاری">
                      <input className="input-field" value={editing.location} onChange={(e) => set('location', e.target.value)} />
                    </FormField>
                  </div>
                </div>

                {/* اطلاعات مخاطبین */}
                <div>
                  <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-emerald-deep">
                    <UsersIcon className="h-3.5 w-3.5" /> اطلاعات مخاطبین
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="بازه سنی مخاطبین">
                      <input className="input-field" value={editing.audienceAgeRange} onChange={(e) => set('audienceAgeRange', e.target.value)} placeholder="مثال: ۱۵ تا ۱۸ سال" />
                    </FormField>
                    <FormField label="سطح تحصیلات مخاطبین">
                      <input className="input-field" value={editing.audienceEducationLevel} onChange={(e) => set('audienceEducationLevel', e.target.value)} placeholder="مثال: دبیرستان" />
                    </FormField>
                    <FormField label="تعداد شرکت‌کنندگان">
                      <input className="input-field" type="number" min={0} value={editing.attendeeCount} onChange={(e) => set('attendeeCount', e.target.value === '' ? '' : Number(e.target.value))} inputMode="numeric" />
                    </FormField>
                  </div>
                </div>

                {/* اطلاعات سخنرانی */}
                <div>
                  <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-emerald-deep">
                    <BookOpen className="h-3.5 w-3.5" /> اطلاعات سخنرانی
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="موضوع سخنرانی">
                      <input className="input-field" value={editing.lectureTopic} onChange={(e) => set('lectureTopic', e.target.value)} />
                    </FormField>
                    <FormField label="همکار مسئول">
                      <input className="input-field" value={editing.responsibleCollaborator} onChange={(e) => set('responsibleCollaborator', e.target.value)} />
                    </FormField>
                    <FormField label="هزینه (تومان)">
                      <input className="input-field" type="number" min={0} value={editing.cost} onChange={(e) => set('cost', e.target.value === '' ? '' : Number(e.target.value))} inputMode="numeric" />
                    </FormField>
                  </div>
                </div>
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
              <h4 className="mb-2 font-display text-base font-bold text-ink">حذف فعالیت</h4>
              <p className="mb-5 text-sm text-muted">آیا از حذف این فعالیت اطمینان دارید؟</p>
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
