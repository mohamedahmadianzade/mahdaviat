import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library, ShoppingBag, BookOpen, SearchX, Network } from 'lucide-react';
import type { Book, SearchFilters } from './types';
import { emptyFilters } from './types';
import { searchBooks, getBookById, getSimilarBooks } from './lib/api';
import type { AdminSection } from './components/admin/AdminLayout';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProductCategories from './components/admin/AdminProductCategories';
import AdminProducts from './components/admin/AdminProducts';
import AdminSettings from './components/admin/AdminSettings';
import AdminBookCategories from './components/admin/AdminBookCategories';
import AdminBooks from './components/admin/AdminBooks';
import AdminOrgUnits from './components/admin/AdminOrgUnits';
import AdminOrgMembers from './components/admin/AdminOrgMembers';
import LandingPage from './components/LandingPage';
import SearchBox from './components/SearchBox';
import BookCard from './components/BookCard';
import BookCardSkeleton from './components/BookCardSkeleton';
import BookDetails from './components/BookDetails';
import StoreSection from './components/StoreSection';
import OrgSection from './components/OrgSection';
import OrgPersonProfile from './components/org/OrgPersonProfile';
import LoginPage from './components/LoginPage';
import { getOrgMemberById, getActiveOrgUnits } from './lib/orgApi';
import type { OrgMember, OrgUnit } from './types';

type RootSection = 'landing' | 'library' | 'store' | 'organization' | 'org-person' | 'admin';
type LibraryView = 'home' | 'results' | 'details';

function useAdminRoute(): boolean { return window.location.pathname.startsWith('/admin'); }

function LibrarySection() {
  const [view, setView] = useState<LibraryView>('home');
  const [filters, setFilters] = useState<SearchFilters>(emptyFilters);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [results, setResults] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [similar, setSimilar] = useState<Book[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const runSearch = useCallback(async () => {
    setLoading(true); setHasSearched(true); setView('results');
    const res = await searchBooks(filters);
    setResults(res.books); setTotal(res.total); setLoading(false);
  }, [filters]);

  const openBook = useCallback(async (id: string) => {
    setView('details'); setDetailsLoading(true);
    const book = await getBookById(id);
    if (book) { setSelectedBook(book); setSimilar(await getSimilarBooks(book)); }
    setDetailsLoading(false); window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && view === 'details') setView('results'); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view]);

  return (
    <AnimatePresence mode="wait">
      {view === 'home' && (
        <motion.section key="lib-home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="flex min-h-[75vh] flex-col items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald text-white shadow-card"><BookOpen className="h-8 w-8" /></div>
            <h1 className="font-display text-3xl font-bold text-emerald-deep sm:text-4xl">جستجوی کتابخانه</h1>
            <p className="mt-3 max-w-md text-sm text-muted">گنجینه‌ای از کتاب‌های فقهی، عرفانی، ادبی و تفسیری را جستجو و کشف کنید</p>
          </motion.div>
          <div className="w-full"><SearchBox filters={filters} onFiltersChange={setFilters} onSearch={runSearch} advancedOpen={advancedOpen} onToggleAdvanced={() => setAdvancedOpen((v) => !v)} /></div>
        </motion.section>
      )}
      {view === 'results' && (
        <motion.section key="lib-results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="pt-8">
          <SearchBox filters={filters} onFiltersChange={setFilters} onSearch={runSearch} advancedOpen={advancedOpen} onToggleAdvanced={() => setAdvancedOpen((v) => !v)} />
          <div className="mt-8 mb-5 flex items-center justify-between"><h2 className="font-display text-lg font-semibold text-emerald-deep">{loading ? 'در حال جستجو...' : hasSearched ? `${total} نتیجه یافت شد` : 'همه کتاب‌ها'}</h2></div>
          {loading && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)}</div>}
          {!loading && results.length > 0 && (<motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"><AnimatePresence>{results.map((book, i) => <BookCard key={book.id} book={book} index={i} onClick={() => openBook(book.id)} />)}</AnimatePresence></motion.div>)}
          {!loading && hasSearched && results.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center rounded-3xl border border-emerald/10 bg-white/60 py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-soft text-emerald"><SearchX className="h-8 w-8" /></div>
              <h3 className="font-display text-lg font-semibold text-emerald-deep">نتیجه‌ای یافت نشد</h3>
              <p className="mt-2 max-w-sm text-sm text-muted">عبارت جستجو یا فیلترهای انتخابی را تغییر دهید</p>
            </motion.div>
          )}
        </motion.section>
      )}
      {view === 'details' && (
        <motion.section key="lib-details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="pt-8">
          {detailsLoading || !selectedBook ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr]"><div className="skeleton h-80 w-56 rounded-xl" /><div className="flex-1 space-y-4"><div className="skeleton h-8 w-2/3" /><div className="skeleton h-4 w-1/3" /><div className="skeleton h-24 w-full rounded-2xl" /><div className="grid grid-cols-2 gap-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div></div></div>
          ) : (<BookDetails book={selectedBook} similar={similar} onBack={() => setView('results')} onSimilarClick={openBook} />)}
        </motion.section>
      )}
    </AnimatePresence>
  );
}

function AdminShell({ onBackToSite }: { onBackToSite: () => void }) {
  const [section, setSection] = useState<AdminSection>('dashboard');
  const renderSection = () => {
    switch (section) {
      case 'dashboard': return <AdminDashboard />;
      case 'book-categories': return <AdminBookCategories />;
      case 'books': return <AdminBooks />;
      case 'product-categories': return <AdminProductCategories />;
      case 'products': return <AdminProducts />;
      case 'org-units': return <AdminOrgUnits />;
      case 'org-members': return <AdminOrgMembers />;
      case 'settings': return <AdminSettings />;
    }
  };
  return (<AdminLayout section={section} onSectionChange={setSection} onBackToSite={onBackToSite} onLogout={onBackToSite}>{renderSection()}</AdminLayout>);
}

export default function App() {
  const isAdmin = useAdminRoute();
  const [section, setSection] = useState<RootSection>(isAdmin ? 'admin' : 'landing');
  const [authed, setAuthed] = useState(false);
  const [orgPerson, setOrgPerson] = useState<OrgMember | null>(null);
  const [orgUnit, setOrgUnit] = useState<OrgUnit | undefined>(undefined);
  const [orgPersonLoading, setOrgPersonLoading] = useState(false);

  const backToSite = () => { history.pushState(null, '', '/'); setSection('landing'); setAuthed(false); };

  const openOrgPerson = useCallback(async (id: string) => {
    setSection('org-person');
    setOrgPersonLoading(true);
    const member = await getOrgMemberById(id);
    if (member) {
      setOrgPerson(member);
      const units = await getActiveOrgUnits();
      setOrgUnit(units.find((u) => u.id === member.unitId));
    }
    setOrgPersonLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const backToOrg = () => { setSection('organization'); setOrgPerson(null); };

  if (section === 'admin' && !authed) return <LoginPage onLogin={() => setAuthed(true)} onBack={backToSite} />;
  if (section === 'admin' && authed) return <AdminShell onBackToSite={backToSite} />;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundImage: 'url(https://mahdaviat.ir/static/mahdaviat-bg.png)', backgroundRepeat: 'repeat' }}
    >
      {/* Banner image */}
      <div className="w-full">
        <img
          src="https://mahdaviat.ir/static/header-mahdaviat.jpg"
          alt="بنیاد فرهنگی حضرت مهدی موعود"
          className="w-full object-cover"
          style={{ maxHeight: '180px', objectPosition: 'center' }}
        />
      </div>

      {/* Sticky nav */}
      <nav className="sticky top-0 z-30 border-b border-emerald/20 bg-white/95 shadow-soft backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 sm:gap-4 sm:px-6">
          {[
            { key: 'library' as const, label: 'کتابخانه دیجیتال', icon: <BookOpen className="h-4 w-4" /> },
            { key: 'store' as const, label: 'فروشگاه', icon: <ShoppingBag className="h-4 w-4" /> },
            { key: 'organization' as const, label: 'ساختار سازمانی', icon: <Network className="h-4 w-4" /> },
          ].map((item) => {
            const active = section === item.key || (item.key === 'organization' && section === 'org-person');
            return (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'bg-emerald text-white shadow-soft'
                    : 'border border-emerald/20 bg-white text-emerald-deep hover:bg-emerald-soft'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content card */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-3xl border border-white/40 bg-white/92 shadow-2xl backdrop-blur-sm">
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {section === 'landing' && (
                <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.35 }}>
                  <LandingPage onSelect={setSection} />
                </motion.div>
              )}
              {section === 'library' && (
                <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <LibrarySection />
                </motion.div>
              )}
              {section === 'store' && (
                <motion.div key="store" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <StoreSection onBack={() => setSection('landing')} />
                </motion.div>
              )}
              {section === 'organization' && (
                <motion.div key="organization" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <OrgSection onPersonClick={openOrgPerson} />
                </motion.div>
              )}
              {section === 'org-person' && (
                <motion.div key="org-person" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {orgPersonLoading || !orgPerson ? (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 pt-8">
                      <div className="skeleton h-48 w-full rounded-3xl lg:col-span-3" />
                      <div className="skeleton h-64 w-full rounded-2xl lg:col-span-2" />
                      <div className="skeleton h-64 w-full rounded-2xl" />
                    </div>
                  ) : (
                    <OrgPersonProfile member={orgPerson} unit={orgUnit} onBack={backToOrg} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
