import type { Book, SearchFilters } from '../types';
import { supabase } from './supabaseClient';

export interface SearchResult { books: Book[]; total: number; }

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const matches = (field: string | undefined, term: string) => !term || (!!field && normalize(field).includes(normalize(term)));
const matchesAny = (arr: string[] | undefined, term: string) => !term || (!!arr?.length && arr.some((k) => normalize(k).includes(normalize(term))));
const matchesExact = (field: string | undefined, term: string) => !term || (!!field && normalize(field) === normalize(term));

type BookRow = Omit<Book, 'publicationYear' | 'keywords' | 'tags' | 'similarIds'> & {
  publication_year: number;
  keywords: string[];
  tags: string[];
  similar_ids: string[];
  created_at: string;
  updated_at: string;
};

const fromRow = (r: BookRow): Book => ({
  id: r.id,
  title: r.title,
  author: r.author,
  translator: r.translator ?? '',
  publisher: r.publisher,
  subject: r.subject,
  category: r.category,
  keywords: r.keywords ?? [],
  language: r.language,
  publicationYear: r.publication_year,
  century: r.century,
  collection: r.collection,
  libraryCode: r.library_code,
  isbn: r.isbn,
  availability: r.availability as Book['availability'],
  bookType: r.book_type as Book['bookType'],
  tags: r.tags ?? [],
  description: r.description,
  coverColor: r.cover_color,
  pages: r.pages,
  similarIds: r.similar_ids ?? [],
});

const toRow = (b: Book): Omit<BookRow, 'created_at' | 'updated_at'> => ({
  id: b.id,
  title: b.title,
  author: b.author,
  translator: b.translator ?? '',
  publisher: b.publisher,
  subject: b.subject,
  category: b.category,
  keywords: b.keywords,
  language: b.language,
  publication_year: b.publicationYear,
  century: b.century,
  collection: b.collection,
  library_code: b.libraryCode,
  isbn: b.isbn,
  availability: b.availability,
  book_type: b.bookType,
  tags: b.tags,
  description: b.description,
  cover_color: b.coverColor,
  pages: b.pages,
  similar_ids: b.similarIds ?? [],
});

export async function searchBooks(filters: SearchFilters): Promise<SearchResult> {
  const { data, error } = await supabase.from('books').select('*');
  if (error) throw error;
  const booksData = (data as BookRow[]).map(fromRow);
  const results = booksData.filter((b) => {
    const q = filters.query.trim();
    if (q) {
      const inText = matches(b.title, q) || matches(b.author, q) || matches(b.subject, q) || matches(b.category, q) || matchesAny(b.keywords, q) || matchesAny(b.tags, q) || matches(b.isbn, q) || matches(b.libraryCode, q);
      if (!inText) return false;
    }
    return matches(b.title, filters.title) && matches(b.author, filters.author) && matches(b.translator, filters.translator) && matches(b.publisher, filters.publisher) && matches(b.subject, filters.subject) && matches(b.category, filters.category) && matchesAny(b.keywords, filters.keywords) && matchesExact(b.language, filters.language) && matches(b.publicationYear.toString(), filters.publicationYear) && matchesExact(b.century, filters.century) && matches(b.collection, filters.collection) && matches(b.libraryCode, filters.libraryCode) && matches(b.isbn, filters.isbn) && matchesExact(b.availability, filters.availability) && matchesExact(b.bookType, filters.bookType) && matchesAny(b.tags, filters.tags);
  });
  return { books: results, total: results.length };
}

export async function getBookById(id: string): Promise<Book | null> {
  const { data, error } = await supabase.from('books').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as BookRow) : null;
}

export async function getSimilarBooks(book: Book): Promise<Book[]> {
  const { data, error } = await supabase.from('books').select('*');
  if (error) throw error;
  const all = (data as BookRow[]).map(fromRow);
  return (book.similarIds ?? []).map((id) => all.find((b) => b.id === id)).filter((b): b is Book => Boolean(b));
}

export function getFilterOptions() {
  return { subjects: [] as string[], categories: [] as string[], languages: [] as string[], centuries: [] as string[], collections: [] as string[], publishers: [] as string[], tags: [] as string[] };
}

export async function getFilterOptionsAsync() {
  const { data, error } = await supabase.from('books').select('*');
  if (error) throw error;
  const booksData = (data as BookRow[]).map(fromRow);
  return {
    subjects: [...new Set(booksData.map((b) => b.subject))].sort(),
    categories: [...new Set(booksData.map((b) => b.category))].sort(),
    languages: [...new Set(booksData.map((b) => b.language))].sort(),
    centuries: [...new Set(booksData.map((b) => b.century))].sort(),
    collections: [...new Set(booksData.map((b) => b.collection))].sort(),
    publishers: [...new Set(booksData.map((b) => b.publisher))].sort(),
    tags: [...new Set(booksData.flatMap((b) => b.tags))].sort(),
  };
}

// ─── Admin CRUD ──────────────────────────────────────────────────────────────

export async function adminGetBooks(): Promise<Book[]> {
  const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as BookRow[]).map(fromRow);
}

export async function adminSaveBook(book: Book): Promise<Book> {
  const row = toRow(book);
  const { data, error } = await supabase.from('books').upsert(row).select('*').maybeSingle();
  if (error) throw error;
  return data ? fromRow(data as BookRow) : book;
}

export async function adminDeleteBook(id: string): Promise<void> {
  const { error } = await supabase.from('books').delete().eq('id', id);
  if (error) throw error;
}

export async function adminGetBookStats() {
  const { count, error } = await supabase.from('books').select('*', { count: 'exact', head: true });
  if (error) throw error;
  return { totalBooks: count ?? 0 };
}

export function newId() { return crypto.randomUUID(); }

export const availabilityLabels: Record<string, string> = { available: 'موجود', borrowed: 'امانت رفته', reference: 'مرجع', restored: 'در حال مرمت' };
export const bookTypeLabels: Record<string, string> = { printed: 'چاپی', digital: 'دیجیتال', manuscript: 'نسخه خطی', lithographic: 'سنگی' };
export const availabilityStyles: Record<string, string> = { available: 'bg-emerald-soft text-emerald-deep', borrowed: 'bg-amber-100 text-amber-700', reference: 'bg-sky-100 text-sky-700', restored: 'bg-rose-100 text-rose-700' };
