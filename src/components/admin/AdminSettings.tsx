import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Save,
  CheckCircle2,
  Phone,
  MessageCircle,
  Store,
  Phone as PhoneIcon,
} from 'lucide-react';
import type { StoreSettings, ContactMode } from '../../types';
import { defaultSettings } from '../../types';
import { adminGetSettings, adminSaveSettings } from '../../lib/storeApi';

export default function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await adminGetSettings();
        if (active) setSettings(data);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const update = (field: keyof StoreSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminSaveSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div>
          <div className="skeleton h-8 w-48 rounded-lg" />
          <div className="skeleton mt-2 h-4 w-64 rounded" />
        </div>
        <div className="glass rounded-2xl p-6 shadow-soft">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="font-display text-2xl font-bold text-emerald-deep">تنظیمات فروشگاه</h3>
        <p className="mt-1 text-sm text-muted">پیکربندی نام فروشگاه و اطلاعات تماس</p>
      </div>

      {/* Form */}
      <div className="glass rounded-2xl p-6 shadow-soft">
        <div className="mb-6 flex items-center gap-2">
          <Store className="h-5 w-5 text-emerald" />
          <h4 className="font-display text-lg font-bold text-emerald-deep">اطلاعات فروشگاه</h4>
        </div>

        <div className="space-y-5">
          {/* Store name */}
          <Field label="نام فروشگاه">
            <input
              className="input-field"
              value={settings.storeName}
              onChange={(e) => update('storeName', e.target.value)}
              placeholder="نام فروشگاه"
            />
          </Field>

          {/* Store tagline */}
          <Field label="شعار فروشگاه">
            <input
              className="input-field"
              value={settings.storeTagline}
              onChange={(e) => update('storeTagline', e.target.value)}
              placeholder="شعار فروشگاه"
            />
          </Field>

          {/* Contact mode */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted">روش تماس</label>
            <div className="grid grid-cols-2 gap-3">
              <ContactModeOption
                value="phone"
                label="تلفن"
                icon={Phone}
                selected={settings.contactMode === 'phone'}
                onSelect={(v) => update('contactMode', v)}
              />
              <ContactModeOption
                value="whatsapp"
                label="واتساپ"
                icon={MessageCircle}
                selected={settings.contactMode === 'whatsapp'}
                onSelect={(v) => update('contactMode', v)}
              />
            </div>
          </div>

          {/* Phone */}
          <Field label="شماره تلفن">
            <div className="relative">
              <PhoneIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mutedLight" />
              <input
                className="input-field pr-12"
                value={settings.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="021-12345678"
                dir="ltr"
              />
            </div>
          </Field>

          {/* WhatsApp */}
          <Field label="شماره واتساپ (با کد کشور)">
            <div className="relative">
              <MessageCircle className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mutedLight" />
              <input
                className="input-field pr-12"
                value={settings.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value)}
                placeholder="989123456789"
                dir="ltr"
              />
            </div>
          </Field>

          {/* Contact button text */}
          <Field label="متن دکمه تماس">
            <input
              className="input-field"
              value={settings.contactButtonText}
              onChange={(e) => update('contactButtonText', e.target.value)}
              placeholder="متن دکمه تماس"
            />
          </Field>
        </div>

        {/* Save */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-1.5 text-sm font-medium text-emerald"
              >
                <CheckCircle2 className="h-5 w-5" />
                تنظیمات با موفقیت ذخیره شد
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            <Save className="h-4 w-4" />
            {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="glass rounded-2xl p-6 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-emerald" />
          <h4 className="font-display text-lg font-bold text-emerald-deep">پیش‌نمایش</h4>
        </div>
        <div className="rounded-xl border border-emerald/10 bg-white p-5">
          <h5 className="font-display text-xl font-bold text-emerald-deep">{settings.storeName}</h5>
          <p className="mt-1 text-sm text-muted">{settings.storeTagline}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-muted">
              <PhoneIcon className="h-4 w-4" />
              <span dir="ltr">{settings.phone}</span>
            </span>
            <span className="flex items-center gap-1.5 text-muted">
              <MessageCircle className="h-4 w-4" />
              <span dir="ltr">{settings.whatsapp}</span>
            </span>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center gap-2 rounded-xl bg-emerald px-5 py-2.5 text-sm font-medium text-white">
              {settings.contactMode === 'whatsapp' ? <MessageCircle className="h-4 w-4" /> : <PhoneIcon className="h-4 w-4" />}
              {settings.contactButtonText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      {children}
    </div>
  );
}

function ContactModeOption({
  value,
  label,
  icon: Icon,
  selected,
  onSelect,
}: {
  value: ContactMode;
  label: string;
  icon: typeof Phone;
  selected: boolean;
  onSelect: (v: ContactMode) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
        selected
          ? 'border-emerald bg-emerald-soft text-emerald-deep'
          : 'border-emerald/15 bg-white/60 text-muted hover:bg-emerald-soft/50'
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}
