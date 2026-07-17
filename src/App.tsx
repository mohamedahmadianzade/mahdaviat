import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, BookOpen, SearchX, Network, Home } from 'lucide-react';
import type { Book, SearchFilters } from './types';
import { emptyFilters } from './types';
import { searchBooks, getBookById, getSimilarBooks, getFilterOptions, getFilterOptionsAsync, availabilityLabels, bookTypeLabels, availabilityStyles } from './lib/api';
import AdminLayout from './components/admin/AdminLayout';
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
import type { AdminPermissions } from './lib/adminUsersApi';

type RootSection = 'landing' | 'library' | 'store' | 'organization' | 'org-person' | 'admin';
type LibraryView = 'home' | 'results' | 'details';

function useAdminRoute(): boolean { return window.location.pathname.startsWith('/admin'); }

function LibrarySection() {
  const [view, setView] = useState<LibraryView>('home');
  const [filters, setFilters] = useState<SearchFilters>(emptyFilters);
  const [results, setResults] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [filterOptions, setFilterOptions] = useState(getFilterOptions());

  useEffect(() => { getFilterOptionsAsync().then(setFilterOptions).catch(() => {}); }, []);

  const handleSearch = useCallback(async (f: SearchFilters) => {
    setFilters(f); setView('results'); setLoading(true);
    try {
      const res = await searchBooks(f);
      setResults(res.books); setTotal(res.total);
    } catch { setResults([]); setTotal(0); }
    finally { setLoading(false); }
  }, []);

  const openBook = useCallback(async (id: string) => {
    setLoadingDetails(true); setView('details');
    try {
      const book = await getBookById(id);
      setSelectedBook(book);
      if (book) { const similar = await getSimilarBooks(book); setSimilarBooks(similar); }
    } catch { setSelectedBook(null); }
    finally { setLoadingDetails(false); }
  }, []);

  if (view === 'details') {
    return (
      <BookDetails
        book={selectedBook}
        loading={loadingDetails}
        onBack={() => setView('results')}
        similarBooks={similarBooks}
        onSelectBook={openBook}
        availabilityLabels={availabilityLabels}
        bookTypeLabels={bookTypeLabels}
        availabilityStyles={availabilityStyles}
      />
    );
  }

  if (view === 'results') {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-emerald-deep">نتایج جستجو</h2>
          <button onClick={() => setView('home')} className="btn-ghost text-xs">جستجوی جدید</button>
        </div>
        <p className="mb-4 text-sm text-muted">{total} کتاب یافت شد</p>
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-soft text-emerald"><SearchX className="h-8 w-8" /></div>
            <p className="text-sm text-muted">نتیجه‌ای یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((book) => <BookCard key={book.id} book={book} onClick={() => openBook(book.id)} availabilityLabels={availabilityLabels} bookTypeLabels={bookTypeLabels} availabilityStyles={availabilityStyles} />)}
          </div>
        )}
      </div>
    );
  }

  return <SearchBox filters={filters} onSearch={handleSearch} filterOptions={filterOptions} />;
}

export default function App() {
  const isAdmin = useAdminRoute();
  const [section, setSection] = useState<RootSection>(isAdmin ? 'admin' : 'landing');
  const [authed, setAuthed] = useState(false);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermissions | null>(null);
  const [orgPerson, setOrgPerson] = useState<OrgMember | null>(null);
  const [orgUnit, setOrgUnit] = useState<OrgUnit | null>(null);
  const [orgPersonLoading, setOrgPersonLoading] = useState(false);

  useEffect(() => {
    const onPop = () => setSection(window.location.pathname.startsWith('/admin') ? 'admin' : 'landing');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const backToSite = () => { history.pushState(null, '', '/'); setSection('landing'); setAuthed(false); setAdminPermissions(null); };

  const openOrgPerson = useCallback(async (id: string) => {
    setOrgPersonLoading(true); setSection('org-person');
    try {
      const member = await getOrgMemberById(id);
      setOrgPerson(member);
      if (member) {
        const units = await getActiveOrgUnits();
        const unit = units.find((u) => u.id === member.unitId) ?? null;
        setOrgUnit(unit);
      }
    } catch { setOrgPerson(null); }
    finally { setOrgPersonLoading(false); }
  }, []);

  const backToOrg = () => { setSection('organization'); setOrgPerson(null); setOrgUnit(null); };

  if (section === 'admin' && !authed) return <LoginPage onLogin={(perms) => { setAuthed(true); setAdminPermissions(perms); }} onBack={backToSite} />;
  if (section === 'admin' && authed) return <AdminLayout onBackToSite={backToSite} permissions={adminPermissions} />;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundImage: 'url(https://mahdaviat.ir/static/mahdaviat-bg.png)', backgroundRepeat: 'repeat' }}
    >
      {/* Sticky nav */}
      <nav className="sticky top-0 z-30 border-b border-emerald/20 bg-white/95 shadow-soft backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 sm:gap-4 sm:px-6">
          {[
            { key: 'landing' as const, label: 'صفحه اصلی', icon: <Home className="h-4 w-4" /> },
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
                  active ? 'bg-emerald text-white shadow-soft' : 'border border-emerald/20 bg-white text-emerald-deep hover:bg-emerald-soft'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Banner image (same width as content card) */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <img
          src="https://mahdaviat.ir/static/header-mahdaviat.jpg"
          alt="بنیاد فرهنگی حضرت مهدی موعود"
          className="w-full rounded-2xl object-cover shadow-soft"
          style={{ maxHeight: '180px', objectPosition: 'center' }}
        />
      </div>

      {/* Content card */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6">
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
