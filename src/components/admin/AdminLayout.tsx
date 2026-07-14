import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Package,
  FolderTree,
  Settings,
  Network,
  Users,
  ArrowRight,
  Shield,
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminBooks from './AdminBooks';
import AdminProducts from './AdminProducts';
import AdminProductCategories from './AdminProductCategories';
import AdminSettings from './AdminSettings';
import AdminOrgUnits from './AdminOrgUnits';
import AdminOrgMembers from './AdminOrgMembers';

export type AdminSection =
  | 'dashboard'
  | 'books'
  | 'products'
  | 'categories'
  | 'settings'
  | 'org-units'
  | 'org-members';

interface AdminLayoutProps {
  onBackToSite: () => void;
}

interface SidebarItem {
  key: AdminSection;
  label: string;
  icon: typeof LayoutDashboard;
}

const sidebarItems: SidebarItem[] = [
  { key: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { key: 'books', label: 'کتاب‌ها', icon: BookOpen },
  { key: 'products', label: 'محصولات', icon: Package },
  { key: 'categories', label: 'دسته‌بندی محصولات', icon: FolderTree },
  { key: 'settings', label: 'تنظیمات فروشگاه', icon: Settings },
  { key: 'org-units', label: 'واحدهای سازمانی', icon: Network },
  { key: 'org-members', label: 'اعضای سازمان', icon: Users },
];

export default function AdminLayout({ onBackToSite }: AdminLayoutProps) {
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentItem = sidebarItems.find((i) => i.key === section);

  const selectSection = (s: AdminSection) => {
    setSection(s);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-ivory lg:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-emerald/10 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-emerald" />
          <span className="font-display font-bold text-emerald-deep">پنل مدیریت</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="btn-ghost px-3 py-2 text-xs"
        >
          منو
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-ink/30 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 right-0 z-40 w-72 transform border-l border-emerald/10 bg-white shadow-card transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex items-center gap-3 border-b border-emerald/10 px-6 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald to-emerald-deep shadow-soft">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold text-emerald-deep">پنل مدیریت</h1>
              <p className="text-xs text-muted">بنیاد مهدویت خراسان رضوی</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = section === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => selectSection(item.key)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    active
                      ? 'bg-emerald text-white shadow-soft'
                      : 'text-muted hover:bg-emerald-soft hover:text-emerald-deep'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Back to site */}
          <div className="border-t border-emerald/10 p-4">
            <button
              onClick={onBackToSite}
              className="btn-ghost w-full"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت به سایت
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-emerald/10 bg-white/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="font-display text-xl font-bold text-emerald-deep">
                {currentItem?.label ?? 'پنل مدیریت'}
              </h2>
              <p className="text-xs text-muted">بنیاد مهدویت خراسان رضوی — پنل مدیریت</p>
            </div>
            <button
              onClick={onBackToSite}
              className="btn-ghost hidden lg:inline-flex"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت به سایت
            </button>
          </div>
        </header>

        {/* Section content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {section === 'dashboard' && <AdminDashboard />}
              {section === 'books' && <AdminBooks />}
              {section === 'products' && <AdminProducts />}
              {section === 'categories' && <AdminProductCategories />}
              {section === 'settings' && <AdminSettings />}
              {section === 'org-units' && <AdminOrgUnits />}
              {section === 'org-members' && <AdminOrgMembers />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
