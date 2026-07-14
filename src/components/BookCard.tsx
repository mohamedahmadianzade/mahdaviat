import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick: () => void;
  availabilityLabels: Record<string, string>;
  bookTypeLabels: Record<string, string>;
  availabilityStyles: Record<string, string>;
}

export default function BookCard({
  book,
  onClick,
  availabilityLabels,
  bookTypeLabels,
  availabilityStyles,
}: BookCardProps) {
  return (
    <motion.button
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-emerald/10 bg-white text-right shadow-soft transition-shadow hover:shadow-card-hover"
    >
      {/* Cover */}
      <div
        className="relative flex h-52 items-center justify-center overflow-hidden p-4"
        style={{ background: book.coverColor }}
      >
        <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30">
          <BookOpen className="absolute -bottom-4 -left-4 h-32 w-32 text-white" />
        </div>
        <p className="relative z-10 line-clamp-4 text-center font-display text-base font-bold leading-snug text-white drop-shadow-md">
          {book.title}
        </p>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Title */}
        <h3 className="line-clamp-2 font-display text-sm font-bold text-emerald-deep">
          {book.title}
        </h3>

        {/* Author */}
        <p className="line-clamp-1 text-xs text-muted">{book.author}</p>

        {/* Publisher */}
        <p className="line-clamp-1 text-xs text-mutedLight">{book.publisher}</p>

        {/* Badges */}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
              availabilityStyles[book.availability] ?? 'bg-gray-100 text-gray-600'
            }`}
          >
            {availabilityLabels[book.availability] ?? book.availability}
          </span>
          <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[10px] font-medium text-gold-deep">
            {bookTypeLabels[book.bookType] ?? book.bookType}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
