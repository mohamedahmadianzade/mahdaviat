import { BookOpen } from 'lucide-react';
import booksData from '../../data/books';
import { EmptyState } from './AdminUI';

export default function AdminBookCategories() {
  const categories = [...new Set(booksData.map((b) => b.category))].sort();
  if (categories.length === 0) return <EmptyState message="دسته‌ای یافت نشد" icon={<BookOpen className="h-6 w-6" />} />;
  return (
    <div>
      <p className="mb-4 text-sm text-muted">دسته‌بندی‌های کتاب از داده‌های موجود استخراج شده‌اند.</p>
      <div className="overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft">
        <table className="w-full text-right">
          <thead className="border-b border-emerald/10 bg-emerald-soft/50"><tr>{['دسته‌بندی', 'تعداد کتاب'].map((h) => <th key={h} className="px-4 py-3 text-xs font-semibold text-emerald-deep">{h}</th>)}</tr></thead>
          <tbody>
            {categories.map((cat) => {
              const count = booksData.filter((b) => b.category === cat).length;
              return (<tr key={cat} className="border-b border-emerald/5 last:border-0 hover:bg-ivory/60"><td className="px-4 py-3 font-medium text-ink">{cat}</td><td className="px-4 py-3 text-sm text-muted">{count}</td></tr>);
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
