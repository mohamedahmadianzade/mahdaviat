import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, User, Phone, CreditCard, MapPin, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import type { MaritalStatus, EducationLevel, Moballagh } from '../types';
import { maritalStatusLabels, educationLevelLabels, birthYears, emptyMoballagh } from '../types';
import { registerMoballagh } from '../lib/moballeghinApi';

interface MoballeghinSectionProps {
  onBack: () => void;
}

type FormState = Omit<Moballagh, 'id' | 'registeredAt'>;

export default function MoballeghinSection({ onBack }: MoballeghinSectionProps) {
  const [form, setForm] = useState<FormState>(emptyMoballagh());
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await registerMoballagh(form);
      setSuccess(true);
      setForm(emptyMoballagh());
    } catch {
      setErrors({ submit: 'خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.' });
    } finally {
      setSubmitting(false);
    }
  };

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

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-soft text-emerald"
            >
              <CheckCircle2 className="h-10 w-10" />
            </motion.div>
            <h3 className="mb-2 font-display text-xl font-bold text-emerald-deep">اطلاعات شما با موفقیت ثبت شد</h3>
            <p className="mb-6 text-sm text-muted">به زودی با شما تماس خواهیم گرفت.</p>
            <button onClick={() => setSuccess(false)} className="btn-primary">
              ثبت درخواست جدید
            </button>
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
