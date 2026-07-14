import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  User,
  Users,
  Building2,
  FolderTree,
  Tag,
  Languages,
  Calendar,
  Clock,
  Library,
  Hash,
  Barcode,
  CheckCircle2,
  BookType,
  FileText,
} from 'lucide-react';
import type { Book } from '../types';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';

interface BookDetailsProps {
  book: Book | null;
  loading: boolean;
  onBack: () => void;
  similarBooks: Book[];
  onSelectBook: (id: string) => void;
  availabilityLabels: Record<string, string>;
  bookTypeLabels: Record<string, string>;
  availabilityStyles: Record<string, string>;
}

interface MetaItemProps {
  icon: typeof User;
  label: string;
  value: string | undefined;
}

function MetaItem({ icon: Icon, label, value }: MetaItemProps) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-emerald/10 bg-cream/30 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-soft text-emerald">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-mutedLight">{label}</p>
        <p className="truncate text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

export default function BookDetails({
  book,
  loading,
  onBack,
  similarBooks,
  onSelectBook,
  availabilityLabels,
  bookTypeLabels,
  availabilityStyles,
}: BookDetailsProps) {
  if (loading || !book) {
    return (
      <div>
        <button onClick={onBack} className="btn-ghost mb-6">
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </button>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="skeleton h-80 w-full rounded-2xl" />
          <div className="space-y-4 lg:col-span-2">
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-16 w-full rounded-xl" />
              ))}
            </div>
            <div className="skeleton h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back button */}
      <button onClick={onBack} className="btn-ghost mb-6">
        <ArrowRight className="h-4 w-4" />
        بازگشت به نتایج
      </button>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cover */}
        <div className="lg:col-span-1">
          <div
            className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl p-6 shadow-card"
            style={{ background: book.coverColor }}
          >
            <BookOpen className="absolute -bottom-6 -left-6 h-40 w-40 text-white/15" />
            <p className="relative z-10 text-center font-display text-xl font-bold leading-snug text-white drop-shadow-lg">
              {book.title}
            </p>
          </div>

          {/* Badges below cover */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                availabilityStyles[book.availability] ?? 'bg-gray-100 text-gray-600'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {availabilityLabels[book.availability] ?? book.availability}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1.5 text-xs font-medium text-gold-deep">
              <BookType className="h-3.5 w-3.5" />
              {bookTypeLabels[book.bookType] ?? book.bookType}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          {/* Title & author */}
          <h1 className="mb-2 font-display text-2xl font-bold text-emerald-deep">
            {book.title}
          </h1>
          <p className="mb-6 text-sm text-muted">{book.author}</p>

          {/* Metadata grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <MetaItem icon={User} label="نویسنده" value={book.author} />
            <MetaItem icon={Users} label="مترجم" value={book.translator} />
            <MetaItem icon={Building2} label="ناشر" value={book.publisher} />
            <MetaItem icon={FolderTree} label="موضوع" value={book.subject} />
            <MetaItem icon={Tag} label="دسته‌بندی" value={book.category} />
            <MetaItem
              icon={Tag}
              label="کلیدواژه‌ها"
              value={book.keywords.length ? book.keywords.join('، ') : undefined}
            />
            <MetaItem icon={Languages} label="زبان" value={book.language} />
            <MetaItem
              icon={Calendar}
              label="سال نشر"
              value={book.publicationYear ? String(book.publicationYear) : undefined}
            />
            <MetaItem icon={Clock} label="قرن" value={book.century} />
            <MetaItem icon={Library} label="مجموعه" value={book.collection} />
            <MetaItem icon={Hash} label="کد کتابخانه" value={book.libraryCode} />
            <MetaItem icon={Barcode} label="شابک (ISBN)" value={book.isbn} />
            <MetaItem
              icon={FileText}
              label="تعداد صفحات"
              value={book.pages ? String(book.pages) : undefined}
            />
          </div>

          {/* Tags */}
          {book.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {book.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-emerald/15 bg-emerald-soft/50 px-3 py-1 text-xs text-emerald-deep"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {book.description && (
            <div className="mt-6">
              <h3 className="mb-2 font-display text-sm font-bold text-emerald-deep">
                توضیحات
              </h3>
              <p className="text-sm leading-relaxed text-muted">{book.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Similar books */}
      {similarBooks.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 font-display text-lg font-bold text-emerald-deep">
            کتاب‌های مرتبط
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similarBooks.map((sb) => (
              <BookCard
                key={sb.id}
                book={sb}
                onClick={() => onSelectBook(sb.id)}
                availabilityLabels={availabilityLabels}
                bookTypeLabels={bookTypeLabels}
                availabilityStyles={availabilityStyles}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
