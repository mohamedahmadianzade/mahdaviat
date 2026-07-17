import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Search, Table2, ArrowRight, Eye, X } from 'lucide-react';
import type { Activity, Moballagh } from '../types';
import { adminGetActivities } from '../lib/activitiesApi';
import { getMoballeghin } from '../lib/moballeghinApi';

interface ActivitiesSectionProps {
  onBack: () => void;
}

export default function ActivitiesSection({ onBack }: ActivitiesSectionProps) {
  const [list, setList] = useState<Activity[]>([]);
  const [moballeghin, setMoballeghin] = useState<Moballagh[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [missionaryFilter, setMissionaryFilter] = useState('');
  const [detailActivity, setDetailActivity] = useState<Activity | null>(null);

  useEffect(() => {
    Promise.all([adminGetActivities(), getMoballeghin()])
      .then(([acts, mobs]) => {
        setList(acts);
        setMoballeghin(mobs);
      })
      .catch(() => {
        setList([]);
        setMoballeghin([]);
      })
      .finally(() => setLoading(false));
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

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-soft text-emerald-deep">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-emerald-deep">فعالیت‌های تبلیغی</h2>
            <p className="text-xs text-muted">لیست فعالیت‌های تبلیغی مبلغین بنیاد مهدویت خراسان رضوی</p>
          </div>
        </div>
        <button onClick={onBack} className="btn-ghost text-xs">
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
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

      {/* Result count */}
      <p className="mb-4 text-xs text-muted">
        {filtered.length.toLocaleString('fa-IR')} فعالیت نمایش داده شده است
      </p>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-soft text-emerald">
            <Table2 className="h-8 w-8" />
          </div>
          <p className="text-sm text-muted">هیچ فعالیتی یافت نشد</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto rounded-2xl border border-emerald/10 bg-white shadow-soft"
        >
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-emerald/10 bg-emerald-soft/30 text-xs text-muted">
                <th className="px-4 py-3 font-medium">مبلغ</th>
                <th className="px-4 py-3 font-medium">نام مدرسه</th>
                <th className="px-4 py-3 font-medium">تاریخ برگزاری</th>
                <th className="px-4 py-3 font-medium">موضوع سخنرانی</th>
                <th className="px-4 py-3 font-medium">تعداد جلسات</th>
                <th className="px-4 py-3 font-medium">تعداد مخاطبین</th>
                <th className="px-4 py-3 font-medium">مکان</th>
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
                  <td className="px-4 py-3 text-muted">{a.location || '—'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDetailActivity(a)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-emerald-soft hover:text-emerald-deep"
                      title="مشاهده"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {detailActivity && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailActivity(null)}
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[85vh] max-w-lg -translate-y-1/2 overflow-y-auto rounded-2xl bg-white shadow-card"
            >
              <div className="sticky top-0 flex items-center justify-between border-b border-emerald/10 bg-white px-6 py-4">
                <h4 className="font-display text-lg font-bold text-emerald-deep">جزئیات فعالیت تبلیغی</h4>
                <button onClick={() => setDetailActivity(null)} className="rounded-lg p-2 text-muted transition-colors hover:bg-emerald-soft">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5 p-6">
                {/* Title card */}
                <div className="flex items-center gap-4 rounded-2xl border border-emerald/10 bg-emerald-soft/20 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-soft text-emerald-deep">
                    <CalendarDays className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-emerald-deep">{detailActivity.lectureTopic || 'فعالیت تبلیغی'}</h3>
                    <p className="text-xs text-muted">{missionaryName(detailActivity.missionaryId)}</p>
                  </div>
                </div>

                <DetailField label="نام مدرسه" value={detailActivity.schoolName} />
                <DetailField label="آدرس مدرسه" value={detailActivity.schoolAddress} />
                <DetailField label="تاریخ برگزاری" value={detailActivity.eventDate} />
                <DetailField label="تعداد جلسات" value={detailActivity.sessionCount !== '' ? String(detailActivity.sessionCount) : ''} />
                <DetailField label="زمان‌بندی جلسات" value={detailActivity.sessionTiming} />
                <DetailField label="محدوده سنی مخاطبین" value={detailActivity.audienceAgeRange} />
                <DetailField label="سطح تحصیلی مخاطبین" value={detailActivity.audienceEducationLevel} />
                <DetailField label="تعداد مخاطبین" value={detailActivity.attendeeCount !== '' ? String(detailActivity.attendeeCount) : ''} />
                <DetailField label="موضوع سخنرانی" value={detailActivity.lectureTopic} />
                <DetailField label="همکار مسئول" value={detailActivity.responsibleCollaborator} />
                <DetailField label="هزینه" value={detailActivity.cost !== '' ? Number(detailActivity.cost).toLocaleString('fa-IR') + ' تومان' : ''} />
                <DetailField label="مکان" value={detailActivity.location} />
                <DetailField label="نام فرد مسئول" value={detailActivity.contactPersonName} />
                <DetailField label="تلفن مسئول" value={detailActivity.contactPhoneNumber} ltr />
              </div>

              <div className="sticky bottom-0 flex items-center justify-end border-t border-emerald/10 bg-white px-6 py-4">
                <button onClick={() => setDetailActivity(null)} className="btn-ghost">بستن</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailField({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-emerald/5 pb-2">
      <span className="text-xs text-muted">{label}</span>
      <span className={`text-sm font-medium text-ink`} dir={ltr ? 'ltr' : 'rtl'}>{value || '—'}</span>
    </div>
  );
}
