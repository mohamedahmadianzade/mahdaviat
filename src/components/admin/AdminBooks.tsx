import booksData from '../../data/books';
import { availabilityLabels, availabilityStyles, bookTypeLabels } from '../../lib/api';

export default function AdminBooks() {
  return (
    <div>
      <p className="mb-4 text-sm text-muted">کتاب‌های موجود در کتابخانه دیجیتال ({booksData.length} کتاب)</p>
      <div className="overflow-hidden rounded-2xl border border-emerald/10 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="border-b border-emerald/10 bg-emerald-soft/50"><tr>{['عنوان', 'نویسنده', 'دسته', 'موضوع', 'سال', 'وضعیت', 'نوع'].map((h) => <th key={h} className="px-4 py-3 text-xs font-semibold text-emerald-deep">{h}</th>)}</tr></thead>
            <tbody>
              {booksData.map((book) => (
                <tr key={book.id} className="border-b border-emerald/5 last:border-0 hover:bg-ivory/60">
                  <td className="max-w-[160px] px-4 py-3"><p className="truncate font-medium text-ink">{book.title}</p></td>
                  <td className="max-w-[120px] px-4 py-3 text-sm text-muted truncate">{book.author}</td>
                  <td className="px-4 py-3 text-sm text-muted">{book.category}</td>
                  <td className="px-4 py-3 text-sm text-muted">{book.subject}</td>
                  <td className="px-4 py-3 text-sm text-muted">{book.publicationYear}</td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${availabilityStyles[book.availability]}`}>{availabilityLabels[book.availability]}</span></td>
                  <td className="px-4 py-3 text-sm text-muted">{bookTypeLabels[book.bookType]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
