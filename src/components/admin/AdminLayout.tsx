import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { LayoutDashboard, BookOpen, ShoppingBag, Settings, ChevronRight, Tag, Library, Menu, X, FolderOpen } from 'lucide-react';

export type AdminSection = 'dashboard' | 'book-categories' | 'books' | 'product-categories' | 'products' | 'settings';

interface AdminLayoutProps { section: AdminSection; onSectionChange: (s: AdminSection) => void; onBackToSite: () => void; onLogout: () => void; children: React.ReactNode; }

const navItems: { key: AdminSection; label: string; icon: React.ReactNode; group: string }[] = [
  { key: 'dashboard', label: 'داشبورد', icon: <LayoutDashboard className="h-4 w-4" />, group: 'کلی' },
  { key: 'book-categories', label: 'دسته‌بندی کتاب‌ها', icon: <FolderOpen className="h-4 w-4" />, group: 'کتابخانه' },
  { key: 'books', label: 'کتاب‌ها', icon: <BookOpen className="h-4 w-4" />, group: 'کتابخانه' },
  { key: 'product-categories', label: 'دسته‌بندی محصولات', icon: <Tag className="h-4 w-4" />, group: 'فروشگاه' },
  { key: 'products', label: 'محصولات', icon: <ShoppingBag className="h-4 w-4" />, group: 'فروشگاه' },
  { key: 'settings', label: 'تنظیمات', icon: <Settings className="h-4 w-4" />, group: 'سیستم' },
];
const groups = ['کلی', 'کتابخانه', 'فروشگاه', 'سیستم'];

function Sidebar({ section, onSectionChange, onBackToSite, onLogout, onClose }: { section: AdminSection; onSectionChange: (s: AdminSection) => void; onBackToSite: () => void; onLogout: () => void; onClose?: () => void; }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-emerald-dark">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15"><Library className="h-4 w-4 text-white" /></div><span className="text-sm font-bold text-white">پنل مدیریت</span></div>
        {onClose && <button onClick={onClose} className="text-white/60 hover:text-white lg:hidden"><X className="h-5 w-5" /></button>}
      </div>
      <nav className="flex-1 px-3 py-4">
        {groups.map((group) => {
          const items = navItems.filter((n) => n.group === group);
          if (!items.length) return null;
          return (
            <div key={group} className="mb-5">
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/35">{group}</p>
              {items.map((item) => (
                <button key={item.key} onClick={() => { onSectionChange(item.key); onClose?.(); }} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${section === item.key ? 'bg-white/15 text-white font-medium' : 'text-white/65 hover:bg-white/8 hover:text-white'}`}>
                  {item.icon}<span>{item.label}</span>{section === item.key && <ChevronRight className="mr-auto h-3.5 w-3.5 rotate-180" />}
                </button>
              ))}
            </div>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <button onClick={onBackToSite} className="mb-2 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/65 transition-all hover:bg-white/8 hover:text-white"><ChevronRight className="h-4 w-4" />بازگشت به سایت</button>
        <button onClick={onLogout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-rose-300/80 transition-all hover:bg-rose-500/15 hover:text-rose-200"><X className="h-4 w-4" />خروج</button>
      </div>
    </div>
  );
}

export default function AdminLayout({ section, onSectionChange, onBackToSite, onLogout, children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentLabel = navItems.find((n) => n.key === section)?.label ?? '';
  return (
    <div className="flex min-h-screen bg-ivory" dir="rtl">
      <aside className="hidden w-56 shrink-0 lg:block"><div className="sticky top-0 h-screen"><Sidebar section={section} onSectionChange={onSectionChange} onBackToSite={onBackToSite} onLogout={onLogout} /></div></aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed right-0 top-0 z-50 h-full w-56 lg:hidden"><Sidebar section={section} onSectionChange={onSectionChange} onBackToSite={onBackToSite} onLogout={onLogout} onClose={() => setMobileOpen(false)} /></motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-emerald/10 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="text-emerald-deep lg:hidden"><Menu className="h-5 w-5" /></button>
          <h1 className="font-display text-base font-semibold text-emerald-deep">{currentLabel}</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>{children}</motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
