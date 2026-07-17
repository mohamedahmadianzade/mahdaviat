import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, User, Phone, CreditCard, MapPin, ArrowRight, Loader2, Search, Filter, Table2, Plus, X, Eye } from 'lucide-react';
import type { MaritalStatus, EducationLevel, Moballagh } from '../types';
import { maritalStatusLabels, educationLevelLabels, birthYears, emptyMoballagh } from '../types';
import { registerMoballagh, getMoballeghin } from '../lib/moballeghinApi';

interface MoballeghinSectionProps {
  onBack: () => void;
}

type FormState = Omit<Moballagh, 'id' | 'registeredAt'>;
type View = 'form' | 'list';

export default function MoballeghinSection({ onBack }: MoballeghinSectionProps) {
  const [view, setView] = useState<View>('list');
  const [form, setForm] = useState<FormState>(emptyMoballagh());
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [list, setList] = useState<Moballagh[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterEducation, setFilterEducation] = useState('');
  const [filterMarital, setFilterMarital] = useState('');
  const [filterBirthYear, setFilterBirthYear] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [detailMember, setDetailMember] = useState<Moballagh | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'نام و نام خانوادگی الزامی است';
    if (!form.fatherName.trim()) e.fatherName = 'نام پدر الزامی است';
    if (!form.nationalCode.trim()) e.nationalCode = 'کد ملی الزامی است';
    else if (!/^\d{10}$/.test(form.nationalCode.trim())) e.nationalCode = 'کد ملی باید ۱۰ رقم باشد';
    if (!form.phone.trim()) e.phone = 'تلفن همراه الزامی است';
    else if (!/^0?9\d{9}$/.test(form.phone.trim().replace(/[-\s]/g, ''))) e.phone = 'شماره تلفن همراه معتبر نیست';
    if (form.idCardNumber && !/^\d+$/.test(form.idCardNumber.trim())) e.idCardNumber = 'شماره شناسنامه باید عدد باشد';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const loadList = useCallback(async () => {
    setListLoading(true);
    try {
      const data = await getMoballeghin();
      setList(data);
    } catch {
      setList([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await registerMoballagh(form);
      setForm(emptyMoballagh());
      await loadList();
      setView('list');
    } catch {
      setErrors({ submit: 'خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.' });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (view === 'list' && list.length === 0) loadList();
  }, [view, list.length, loadList]);

  const filtered = list.filter((m) => {
    const q = search.trim().toLowerCase();
    if (q && !(m.fullName.toLowerCase().includes(q) || m.fatherName.toLowerCase().includes(q) || m.nationalCode.includes(q) || m.phone.includes(q) || m.birthPlace.toLowerCase().includes(q))) return false;
    if (filterEducation && m.educationLevel !== filterEducation) return false;
    if (filterMarital && m.maritalStatus !== filterMarital) return false;
    if (filterBirthYear && m.birthYear !== filterBirthYear) return false;
    return true;
  });

  const resetFilters = () => {
    setSearch(''); setFilterEducation(''); setFilterMarital(''); setFilterBirthYear('');
  };

  const activeFilterCount = [filterEducation, filterMarital, filterBirthYear].filter(Boolean).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-soft text-emerald-deep">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-emerald-deep">مبلغین</h2>
            <p className="text-xs text-muted">فرم ثبت‌نام مبلغین بنیاد مهدویت خراسان رضوی</p>
          </div>
        </div>
        <button onClick={onBack} className="btn-ghost text-xs">
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </button>
      </div>

      {/* View toggle */}
      <div className="mb-5 flex items-center justify-between gap-2">
        <button
          onClick={() => setView('list')}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
            view === 'list' ? 'bg-emerald text-white shadow-soft' : 'border border-emerald/20 bg-white text-emerald-deep hover:bg-emerald-soft'
          }`}
        >
          <Table2 className="h-4 w-4" />
          لیست مبلغین
          {list.length > 0 && (
            <span className="rounded-full bg-emerald-deep/20 px-1.5 py-0.5 text-[10px]">{list.length.toLocaleString('fa-IR')}</span>
          )}
        </button>
        <button
          onClick={() => setView('form')}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
            view === 'form' ? 'bg-emerald text-white shadow-soft' : 'border border-emerald/20 bg-white text-emerald-deep hover:bg-emerald-soft'
          }`}
        >
          <Plus className="h-4 w-4" />
          ثبت‌نام جدید
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Search & filter bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mutedLight" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو بر اساس نام، کد ملی، تلفن، محل تولد..."
                  className="input-field pr-12"
                />
              </div>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`btn-ghost whitespace-nowrap ${showFilters || activeFilterCount > 0 ? 'border-emerald bg-emerald-soft text-emerald-deep' : ''}`}
              >
                <Filter className="h-4 w-4" />
                فیلترها
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-emerald px-1.5 py-0.5 text-[10px] text-white">{activeFilterCount.toLocaleString('fa-IR')}</span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className="btn-ghost whitespace-nowrap text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-200">
                  <X className="h-4 w-4" />
                  پاک کردن
                </button>
              )}
            </div>

            {/* Expandable filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-3 rounded-2xl border border-emerald/10 bg-white/60 p-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted">سطح تحصیلات</label>
                      <select className="input-field" value={filterEducation} onChange={(e) => setFilterEducation(e.target.value)}>
                        <option value="">همه</option>
                        {(Object.keys(educationLevelLabels) as EducationLevel[]).map((k) => (
                          <option key={k} value={k}>{educationLevelLabels[k]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted">وضعیت تأهل</label>
                      <select className="input-field" value={filterMarital} onChange={(e) => setFilterMarital(e.target.value)}>
                        <option value="">همه</option>
                        {(Object.keys(maritalStatusLabels) as MaritalStatus[]).map((k) => (
                          <option key={k} value={k}>{maritalStatusLabels[k]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted">سال تولد</label>
                      <select className="input-field" value={filterBirthYear} onChange={(e) => setFilterBirthYear(e.target.value)}>
                        <option value="">همه</option>
                        {birthYears.map((y) => (
                          <option key={y} value={String(y)}>{y.toLocaleString('fa-IR')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result count */}
            <p className="text-xs text-muted">
              {filtered.length.toLocaleString('fa-IR')} مبلغ نمایش داده شده است
              {filtered.length !== list.length && ` (از مجموع ${list.length.toLocaleString('fa-IR')} نفر)`}
            </p>

            {/* Table */}
            {listLoading ? (
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
                <p className="text-sm text-muted">مبلغی یافت نشد</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-emerald/10 bg-white shadow-soft">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-emerald/10 bg-emerald-soft/30 text-xs text-muted">
                      <th className="px-4 py-3 font-medium">ردیف</th>
                      <th className="px-4 py-3 font-medium">نام و نام خانوادگی</th>
                      <th className="px-4 py-3 font-medium">نام پدر</th>
                      <th className="px-4 py-3 font-medium">کد ملی</th>
                      <th className="px-4 py-3 font-medium">تلفن</th>
                      <th className="px-4 py-3 font-medium">سال تولد</th>
                      <th className="px-4 py-3 font-medium">محل تولد</th>
                      <th className="px-4 py-3 font-medium">تحصیلات</th>
                      <th className="px-4 py-3 font-medium">تأهل</th>
                      <th className="px-4 py-3 font-medium">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((m, idx) => (
                      <tr key={m.id} className="border-b border-emerald/5 transition-colors hover:bg-emerald-soft/20">
                        <td className="px-4 py-3 text-mutedLight">{(idx + 1).toLocaleString('fa-IR')}</td>
                        <td className="px-4 py-3 font-medium text-emerald-deep">{m.fullName || '—'}</td>
                        <td className="px-4 py-3 text-muted">{m.fatherName || '—'}</td>
                        <td className="px-4 py-3 text-muted">{m.nationalCode || '—'}</td>
                        <td className="px-4 py-3 text-muted" dir="ltr">{m.phone || '—'}</td>
                        <td className="px-4 py-3 text-muted">{m.birthYear ? Number(m.birthYear).toLocaleString('fa-IR') : '—'}</td>
                        <td className="px-4 py-3 text-muted">{m.birthPlace || '—'}</td>
                        <td className="px-4 py-3 text-muted">{m.educationLevel ? educationLevelLabels[m.educationLevel as EducationLevel] : '—'}</td>
                        <td className="px-4 py-3 text-muted">{m.maritalStatus ? maritalStatusLabels[m.maritalStatus as MaritalStatus] : '—'}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setDetailMember(m)}
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
              </div>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* بخش ۱: اطلاعات شخصی */}
            <fieldset className="rounded-2xl border border-emerald/10 bg-white/60 p-5">
              <legend className="flex items-center gap-2 px-3 font-display text-sm font-bold text-emerald-deep">
                <User className="h-4 w-4" />
                اطلاعات شخصی
              </legend>
              <div className="grid grid-cols-1 gap-4 pt-3 sm:grid-cols-2">
                <Field label="نام و نام خانوادگی" required error={errors.fullName}>
                  <input className="input-field" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="مثال: علی رضایی" />
                </Field>
                <Field label="نام پدر" required error={errors.fatherName}>
                  <input className="input-field" value={form.fatherName} onChange={(e) => set('fatherName', e.target.value)} placeholder="مثال: محمد" />
                </Field>
                <Field label="شماره شناسنامه" error={errors.idCardNumber}>
                  <input className="input-field" value={form.idCardNumber} onChange={(e) => set('idCardNumber', e.target.value)} placeholder="مثال: ۱۲۳۴۵" inputMode="numeric" />
                </Field>
                <Field label="کد ملی" required error={errors.nationalCode}>
                  <input className="input-field" value={form.nationalCode} onChange={(e) => set('nationalCode', e.target.value)} placeholder="۱۰ رقم" inputMode="numeric" maxLength={10} />
                </Field>
              </div>
            </fieldset>

            {/* بخش ۲: اطلاعات تکمیلی */}
            <fieldset className="rounded-2xl border border-emerald/10 bg-white/60 p-5">
              <legend className="flex items-center gap-2 px-3 font-display text-sm font-bold text-emerald-deep">
                <User className="h-4 w-4" />
                اطلاعات تکمیلی
              </legend>
              <div className="grid grid-cols-1 gap-4 pt-3 sm:grid-cols-2">
                <Field label="سال تولد">
                  <select className="input-field" value={form.birthYear} onChange={(e) => set('birthYear', e.target.value)}>
                    <option value="">انتخاب کنید</option>
                    {birthYears.map((y) => (
                      <option key={y} value={String(y)}>{y.toLocaleString('fa-IR')}</option>
                    ))}
                  </select>
                </Field>
                <Field label="محل تولد">
                  <input className="input-field" value={form.birthPlace} onChange={(e) => set('birthPlace', e.target.value)} placeholder="مثال: مشهد" />
                </Field>
                <Field label="سطح تحصیلات">
                  <select className="input-field" value={form.educationLevel} onChange={(e) => set('educationLevel', e.target.value as EducationLevel | '')}>
                    <option value="">انتخاب کنید</option>
                    {(Object.keys(educationLevelLabels) as EducationLevel[]).map((k) => (
                      <option key={k} value={k}>{educationLevelLabels[k]}</option>
                    ))}
                  </select>
                </Field>
                <Field label="وضعیت تأهل">
                  <select className="input-field" value={form.maritalStatus} onChange={(e) => set('maritalStatus', e.target.value as MaritalStatus | '')}>
                    <option value="">انتخاب کنید</option>
                    {(Object.keys(maritalStatusLabels) as MaritalStatus[]).map((k) => (
                      <option key={k} value={k}>{maritalStatusLabels[k]}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </fieldset>

            {/* بخش ۳: اطلاعات تماس و بانکی */}
            <fieldset className="rounded-2xl border border-emerald/10 bg-white/60 p-5">
              <legend className="flex items-center gap-2 px-3 font-display text-sm font-bold text-emerald-deep">
                <Phone className="h-4 w-4" />
                اطلاعات تماس و بانکی
              </legend>
              <div className="grid grid-cols-1 gap-4 pt-3 sm:grid-cols-2">
                <Field label="تلفن همراه" required error={errors.phone}>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mutedLight" />
                    <input className="input-field pr-11" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="۰۹۱۲۳۴۵۶۷۸۹" inputMode="tel" />
                  </div>
                </Field>
                <Field label="شماره حساب بانکی">
                  <div className="relative">
                    <CreditCard className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mutedLight" />
                    <input className="input-field pr-11" value={form.bankAccountNumber} onChange={(e) => set('bankAccountNumber', e.target.value)} placeholder="شماره حساب" />
                  </div>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="آدرس">
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-mutedLight" />
                      <textarea className="input-field pr-11 min-h-[80px] resize-y" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="آدرس کامل پستی" />
                    </div>
                  </Field>
                </div>
              </div>
            </fieldset>

            {errors.submit && (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{errors.submit}</p>
            )}

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onBack} className="btn-ghost">انصراف</button>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال ثبت...
                  </>
                ) : (
                  'ثبت اطلاعات'
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Detail modal */}
      <AnimatePresence>
        {detailMember && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailMember(null)}
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
                <h4 className="font-display text-lg font-bold text-emerald-deep">جزئیات مبلغ</h4>
                <button onClick={() => setDetailMember(null)} className="rounded-lg p-2 text-muted transition-colors hover:bg-emerald-soft">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5 p-6">
                {/* Avatar + name */}
                <div className="flex items-center gap-4 rounded-2xl border border-emerald/10 bg-emerald-soft/20 p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-soft text-xl font-bold text-emerald-deep">
                    {detailMember.fullName.charAt(0) || '؟'}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-emerald-deep">{detailMember.fullName || 'بدون نام'}</h3>
                    <p className="text-xs text-muted">{detailMember.fatherName ? `فرزند ${detailMember.fatherName}` : ''}</p>
                    <span className={`mt-1 inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] ${detailMember.active ? 'bg-emerald-soft text-emerald-deep' : 'bg-rose-50 text-rose-500'}`}>
                      {detailMember.active ? 'فعال' : 'غیرفعال'}
                    </span>
                  </div>
                </div>

                <DetailField label="شماره شناسنامه" value={detailMember.idCardNumber} />
                <DetailField label="کد ملی" value={detailMember.nationalCode} ltr />
                <DetailField label="سال تولد" value={detailMember.birthYear ? Number(detailMember.birthYear).toLocaleString('fa-IR') : ''} />
                <DetailField label="محل تولد" value={detailMember.birthPlace} />
                <DetailField label="سطح تحصیلات" value={detailMember.educationLevel ? educationLevelLabels[detailMember.educationLevel as EducationLevel] : ''} />
                <DetailField label="وضعیت تأهل" value={detailMember.maritalStatus ? maritalStatusLabels[detailMember.maritalStatus as MaritalStatus] : ''} />
                <DetailField label="تلفن همراه" value={detailMember.phone} ltr />
                <DetailField label="شماره حساب بانکی" value={detailMember.bankAccountNumber} ltr />
                <DetailField label="آدرس" value={detailMember.address} />
                <DetailField label="تاریخ ثبت‌نام" value={detailMember.registeredAt ? new Date(detailMember.registeredAt).toLocaleDateString('fa-IR') : ''} />
              </div>

              <div className="sticky bottom-0 flex items-center justify-end border-t border-emerald/10 bg-white px-6 py-4">
                <button onClick={() => setDetailMember(null)} className="btn-ghost">بستن</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

function DetailField({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-emerald/5 pb-2">
      <span className="text-xs text-muted">{label}</span>
      <span className={`text-sm font-medium text-ink ${ltr ? 'dir-ltr' : ''}`} dir={ltr ? 'ltr' : 'rtl'}>{value || '—'}</span>
    </div>
  );
}
