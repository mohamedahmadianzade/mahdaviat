import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Package,
  CheckCircle2,
  FolderTree,
  Users,
  Network,
  Mic,
  TrendingUp,
} from 'lucide-react';
import { adminGetBookStats } from '../../lib/api';
import { adminGetStats } from '../../lib/storeApi';
import { adminGetOrgStats } from '../../lib/orgApi';
import { adminGetMoballeghinStats } from '../../lib/moballeghinApi';

interface DashboardStats {
  totalBooks: number;
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalOrgMembers: number;
  activeMembers: number;
  totalOrgUnits: number;
  totalMoballeghin: number;
  activeMoballeghin: number;
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: typeof BookOpen;
  gradient: string;
  iconBg: string;
  delay: number;
  loading: boolean;
}

function StatCard({ label, value, icon: Icon, gradient, iconBg, delay, loading }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`relative overflow-hidden rounded-2xl border border-emerald/10 bg-white p-5 shadow-soft ${gradient}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-2 text-xs font-medium text-muted">{label}</p>
          {loading ? (
            <div className="skeleton h-8 w-16 rounded-lg" />
          ) : (
            <p className="font-display text-3xl font-bold text-emerald-deep">{value}</p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [bookStats, storeStats, orgStats, mobStats] = await Promise.all([
          adminGetBookStats(),
          adminGetStats(),
          adminGetOrgStats(),
          adminGetMoballeghinStats(),
        ]);
        if (!active) return;
        setStats({
          totalBooks: bookStats.totalBooks,
          totalProducts: storeStats.totalProducts,
          activeProducts: storeStats.activeProducts,
          totalCategories: storeStats.totalCategories,
          totalOrgMembers: orgStats.totalMembers,
          activeMembers: orgStats.activeMembers,
          totalOrgUnits: orgStats.totalUnits,
          totalMoballeghin: mobStats.total,
          activeMoballeghin: mobStats.active,
        });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const cards: StatCardProps[] = [
    { label: 'کل کتاب‌ها', value: stats?.totalBooks ?? 0, icon: BookOpen, gradient: '', iconBg: 'bg-emerald-soft text-emerald-deep', delay: 0, loading },
    { label: 'کل محصولات', value: stats?.totalProducts ?? 0, icon: Package, gradient: '', iconBg: 'bg-gold-soft text-gold-deep', delay: 0.05, loading },
    { label: 'محصولات فعال', value: stats?.activeProducts ?? 0, icon: CheckCircle2, gradient: '', iconBg: 'bg-emerald-soft text-emerald', delay: 0.1, loading },
    { label: 'دسته‌بندی‌ها', value: stats?.totalCategories ?? 0, icon: FolderTree, gradient: '', iconBg: 'bg-cream text-gold-deep', delay: 0.15, loading },
    { label: 'اعضای سازمان', value: stats?.totalOrgMembers ?? 0, icon: Users, gradient: '', iconBg: 'bg-teal/10 text-teal', delay: 0.2, loading },
    { label: 'اعضای فعال', value: stats?.activeMembers ?? 0, icon: CheckCircle2, gradient: '', iconBg: 'bg-emerald-soft text-emerald-deep', delay: 0.25, loading },
    { label: 'واحدهای سازمانی', value: stats?.totalOrgUnits ?? 0, icon: Network, gradient: '', iconBg: 'bg-teal/10 text-teal-dark', delay: 0.3, loading },
    { label: 'مبلغین', value: stats?.totalMoballeghin ?? 0, icon: Mic, gradient: '', iconBg: 'bg-emerald-soft text-emerald', delay: 0.35, loading },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="font-display text-2xl font-bold text-emerald-deep">داشبورد</h3>
        <p className="mt-1 text-sm text-muted">نمای کلی از وضعیت کتابخانه، فروشگاه و سازمان</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Summary panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="glass rounded-2xl p-6 shadow-soft"
      >
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald" />
          <h4 className="font-display text-lg font-bold text-emerald-deep">خلاصه وضعیت</h4>
        </div>
        {loading ? (
          <div className="space-y-3">
            <div className="skeleton h-5 w-full rounded" />
            <div className="skeleton h-5 w-3/4 rounded" />
            <div className="skeleton h-5 w-5/6 rounded" />
          </div>
        ) : (
          <ul className="space-y-2 text-sm text-ink">
            <li className="flex items-center justify-between border-b border-emerald/5 pb-2">
              <span className="text-muted">کتابخانه دیجیتال</span>
              <span className="font-medium text-emerald-deep">{stats?.totalBooks ?? 0} کتاب ثبت شده</span>
            </li>
            <li className="flex items-center justify-between border-b border-emerald/5 pb-2">
              <span className="text-muted">فروشگاه</span>
              <span className="font-medium text-emerald-deep">
                {stats?.activeProducts ?? 0} محصول فعال از {stats?.totalProducts ?? 0} محصول
              </span>
            </li>
            <li className="flex items-center justify-between border-b border-emerald/5 pb-2">
              <span className="text-muted">دسته‌بندی محصولات</span>
              <span className="font-medium text-emerald-deep">{stats?.totalCategories ?? 0} دسته‌بندی</span>
            </li>
            <li className="flex items-center justify-between border-b border-emerald/5 pb-2">
              <span className="text-muted">ساختار سازمانی</span>
              <span className="font-medium text-emerald-deep">
                {stats?.activeMembers ?? 0} عضو فعال در {stats?.totalOrgUnits ?? 0} واحد
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted">مبلغین</span>
              <span className="font-medium text-emerald-deep">
                {stats?.totalMoballeghin ?? 0} مبلغ ثبت‌نام شده
              </span>
            </li>
          </ul>
        )}
      </motion.div>
    </div>
  );
}
