import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Calendar, Building2, Languages, Hash, Library, Tag, FileText, User, Bookmark } from 'lucide-react';
import type { Book } from '../types';
import { availabilityLabels, bookTypeLabels, availabilityStyles } from '../lib/api';
import BookCover from './BookCover';

interface BookDetailsProps { book: Book; similar: Book[]; onBack: () => void; onSimilarClick: (id: string) => void; }

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (<div className="flex items-start gap-3 rounded-xl border border-emerald/10 bg-white/60 p-3"><div className="mt-0.5 text-emerald">{icon}</div><div className="min-w-0"><p className="text-[11px] text-muted">{label}</p><p className="truncate text-sm font-medium text-ink">{value || '—'}</p></div></div>);
}

export default function BookDetails({ book, similar, onBack, onSimilarClick }: BookDetailsProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <button onClick={onBack} className="group mb-6 inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-white/60 px-4 py-2 text-sm text-emerald-deep transition-all hover:bg-emerald-soft"><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />بازگشت به نتایج</button>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.05 }} className="flex justify-center lg:justify-start"><div className="sticky top-6"><BookCover title={book.title} author={book.author} color={book.coverColor} size="lg" /></div></motion.div>
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="mb-2 flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${availabilityStyles[book.availability]}`}>{availabilityLabels[book.availability]}</span>
            <span className="inline-flex items-center rounded-full bg-emerald-soft px-3 py-1 text-xs font-medium text-emerald-deep">{bookTypeLabels[book.bookType]}</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-emerald-deep sm:text-3xl">{book.title}</h1>
          <p className="mt-2 text-sm text-muted">{book.author}{book.translator ? ` — ترجمه: ${book.translator}` : ''}</p>
          <div className="mt-5 rounded-2xl border border-emerald/10 bg-white/70 p-4"><h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-deep"><FileText className="h-4 w-4" />معرفی کتاب</h2><p className="text-sm leading-relaxed text-muted">{book.description}</p></div>
          <div className="mt-6">
            <h2 className="mb-3 text-sm font-semibold text-emerald-deep">اطلاعات کتابشناختی</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MetaItem icon={<User className="h-4 w-4" />} label="نویسنده" value={book.author} />
              {book.translator && <MetaItem icon={<User className="h-4 w-4" />} label="مترجم" value={book.translator} />}
              <MetaItem icon={<Building2 className="h-4 w-4" />} label="ناشر" value={book.publisher} />
              <MetaItem icon={<Calendar className="h-4 w-4" />} label="سال انتشار" value={book.publicationYear.toString()} />
              <MetaItem icon={<BookOpen className="h-4 w-4" />} label="موضوع" value={book.subject} />
              <MetaItem icon={<Bookmark className="h-4 w-4" />} label="دسته" value={book.category} />
              <MetaItem icon={<Languages className="h-4 w-4" />} label="زبان" value={book.language} />
              <MetaItem icon={<Calendar className="h-4 w-4" />} label="قرن" value={book.century} />
              <MetaItem icon={<Library className="h-4 w-4" />} label="مجموعه" value={book.collection} />
              <MetaItem icon={<Hash className="h-4 w-4" />} label="کد کتابخانه" value={book.libraryCode} />
              <MetaItem icon={<Hash className="h-4 w-4" />} label="شابک" value={book.isbn} />
              <MetaItem icon={<FileText className="h-4 w-4" />} label="تعداد صفحات" value={book.pages.toString()} />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {book.keywords.length > 0 && (<div><h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-deep"><Tag className="h-4 w-4" />کلیدواژه‌ها</h3><div className="flex flex-wrap gap-2">{book.keywords.map((k) => <span key={k} className="rounded-full border border-emerald/15 bg-emerald-soft/60 px-3 py-1 text-xs text-emerald-deep">{k}</span>)}</div></div>)}
            {book.tags.length > 0 && (<div><h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-deep"><Tag className="h-4 w-4" />برچسب‌ها</h3><div className="flex flex-wrap gap-2">{book.tags.map((t) => <span key={t} className="rounded-full border border-gold/30 bg-gold-soft/40 px-3 py-1 text-xs text-gold-deep">{t}</span>)}</div></div>)}
          </div>
        </motion.div>
      </div>
      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-emerald-deep"><BookOpen className="h-5 w-5 text-gold" />کتاب‌های مرتبط</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s, i) => (
              <motion.button key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.08 }} whileHover={{ y: -4 }} onClick={() => onSimilarClick(s.id)} className="group flex items-center gap-4 rounded-2xl border border-emerald/10 bg-white p-4 text-right shadow-soft transition-shadow hover:shadow-card-hover">
                <BookCover title={s.title} author={s.author} color={s.coverColor} size="sm" />
                <div className="min-w-0 flex-1"><h3 className="line-clamp-2 font-medium text-emerald-deep transition-colors group-hover:text-emerald">{s.title}</h3><p className="mt-1 truncate text-xs text-muted">{s.author}</p><p className="mt-1 truncate text-xs text-mutedLight">{s.subject}</p></div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
