import { useEffect, useState } from 'react';
import { BookOpen, ShoppingBag, FolderOpen, Tag, TrendingUp, Users, Network } from 'lucide-react';
import { adminGetStats } from '../../lib/storeApi';
import { adminGetOrgStats } from '../../lib/orgApi';
import booksData from '../../data/books';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ totalProducts: number; activeProducts: number; totalCategories: number; activeCategories: number } | null>(null);
  const [orgStats, setOrgStats] = useState<{ totalMembers: number; activeMembers: number; totalUnits: number; activeUnits: number } | null>(null);
  useEffect(() => { adminGetStats().then(setStats); adminGetOrgStats().then(setOrgStats); }, []);
  const statCards = [
    ...(stats ? [
      { label: 'تعداد کتاب‌ها', value: booksData.length, icon: <BookOpen className="h-5 w-5" />, color: 'bg-emerald text-white' },
      { label: 'محصولات فعال', value: stats.activeProducts, icon: <ShoppingBag className="h-5 w-5" />, color: 'bg-gold text-white' },
      { label: 'دسته‌های محصول', value: stats.totalCategories, icon: <Tag className="h-5 w-5" />, color: 'bg-teal text-white' },
      { label: 'کل محصولات', value: stats.totalProducts, icon: <FolderOpen className="h-5 w-5" />, color: 'bg-emerald-deep text-white' },
    ] : []),
    ...(orgStats ? [
      { label: 'اعضای سازمان', value: orgStats.totalMembers, icon: <Users className="h-5 w-5" />, color: 'bg-teal text-white' },
      { label: 'واحدهای سازمانی', value: orgStats.totalUnits, icon: <Network className="h-5 w-5" />, color: 'bg-gold-deep text-white' },
    ] : []),
  ];
  return (
    <div>
      <div className="mb-6 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-emerald" /><h2 className="font-display text-lg font-semibold text-emerald-deep">خلاصه وضعیت</h2></div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-emerald/10 bg-white p-5 shadow-soft">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-bold text-ink">{s.value}</p><p className="mt-0.5 text-xs text-muted">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-emerald/10 bg-white p-5 shadow-soft"><p className="text-sm text-muted">به پنل مدیریت خوش آمدید. از منوی کناری برای مدیریت کتاب‌ها، محصولات، ساختار سازمانی و تنظیمات سایت استفاده کنید.</p></div>
    </div>
  );
}
