import { useEffect, useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StoreSettings, ContactMode } from '../../types';
import { adminGetSettings, adminSaveSettings } from '../../lib/storeApi';
import { FormField } from './AdminUI';

export default function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => { adminGetSettings().then(setSettings); }, []);
  if (!settings) return <div className="skeleton h-64 rounded-2xl" />;
  const update = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => { setSettings((s) => s ? ({ ...s, [key]: value }) : s); setSaved(false); };
  const handleSave = async () => { if (!settings) return; setSaving(true); await adminSaveSettings(settings); setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-2"><Settings className="h-5 w-5 text-emerald" /><h2 className="font-display text-lg font-semibold text-emerald-deep">تنظیمات فروشگاه</h2></div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 rounded-2xl border border-emerald/10 bg-white p-6 shadow-soft">
        <div>
          <h3 className="mb-4 border-b border-emerald/10 pb-2 text-sm font-semibold text-emerald-deep">هویت فروشگاه</h3>
          <div className="space-y-4">
            <FormField label="نام فروشگاه" required><input type="text" value={settings.storeName} onChange={(e) => update('storeName', e.target.value)} className="input-field" /></FormField>
            <FormField label="شعار فروشگاه"><input type="text" value={settings.storeTagline} onChange={(e) => update('storeTagline', e.target.value)} className="input-field" /></FormField>
          </div>
        </div>
        <div>
          <h3 className="mb-4 border-b border-emerald/10 pb-2 text-sm font-semibold text-emerald-deep">اطلاعات تماس</h3>
          <div className="space-y-4">
            <FormField label="روش ارتباط"><select value={settings.contactMode} onChange={(e) => update('contactMode', e.target.value as ContactMode)} className="input-field cursor-pointer"><option value="whatsapp">واتساپ</option><option value="phone">تلفن</option></select></FormField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="شماره تلفن"><input type="text" value={settings.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" dir="ltr" placeholder="021-12345678" /></FormField>
              <FormField label="شماره واتساپ (با کد کشور)"><input type="text" value={settings.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} className="input-field" dir="ltr" placeholder="989123456789" /></FormField>
            </div>
            <FormField label="متن دکمه تماس"><input type="text" value={settings.contactButtonText} onChange={(e) => update('contactButtonText', e.target.value)} className="input-field" /></FormField>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          {saved && <motion.p initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-sm text-emerald">تنظیمات با موفقیت ذخیره شد.</motion.p>}
          <div className="mr-auto"><button onClick={handleSave} className="btn-primary" disabled={saving}><Save className="h-4 w-4" />{saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}</button></div>
        </div>
      </motion.div>
    </div>
  );
}
