import { motion } from 'framer-motion';
import { BookMarked, Calendar, User } from 'lucide-react';
import type { Book } from '../types';
import { availabilityLabels, bookTypeLabels, availabilityStyles } from '../lib/api';
import BookCover from './BookCover';

interface BookCardProps { book: Book; index: number; onClick: () => void; }

export default function BookCard({ book, index, onClick }: BookCardProps) {
  return (
    <motion.button layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4), ease: 'easeOut' }} whileHover={{ y: -6 }} onClick={onClick} className="group flex w-full flex-col overflow-hidden rounded-2xl border border-emerald/10 bg-white p-4 text-right shadow-soft transition-shadow hover:shadow-card-hover">
      <div className="flex gap-4">
        <div className="shrink-0"><BookCover title={book.title} author={book.author} color={book.coverColor} size="sm" /></div>
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="line-clamp-2 font-semibold text-emerald-deep transition-colors group-hover:text-emerald">{book.title}</h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted"><User className="h-3 w-3" /><span className="truncate">{book.author}</span></div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted"><BookMarked className="h-3 w-3" /><span className="truncate">{book.publisher}</span></div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted"><Calendar className="h-3 w-3" /><span>{book.publicationYear}</span><span className="text-mutedLight">•</span><span className="truncate">{book.subject}</span></div>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">{book.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${availabilityStyles[book.availability]}`}>{availabilityLabels[book.availability]}</span>
        <span className="text-[11px] text-mutedLight">{bookTypeLabels[book.bookType]}</span>
      </div>
    </motion.button>
  );
}
