import type { Book, SearchFilters } from '../types';
import { defaultBooks } from '../data/books';
import { loadJSON, saveJSON, STORAGE_KEYS } from './storage';

export interface SearchResult { books: Book[]; total: number; }

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const matches = (field: string | undefined, term: string) => !term || (!!field && normalize(field).includes(normalize(term)));
const matchesAny = (arr: string[] | undefined, term: string) => !term || (!!arr?.length && arr.some((k) => normalize(k).includes(normalize(term))));
const matchesExact = (field: string | undefined, term: string) => !term || (!!field && normalize(field) === normalize(term));

function getBooks(): Book[] {
  return loadJSON<Book[]>(STORAGE_KEYS.books, defaultBooks);
}

export async function searchBooks(filters: SearchFilters): Promise<SearchResult> {
  await delay(300);
  const booksData = getBooks();
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
  await delay(200);
  return getBooks().find((b) => b.id === id) ?? null;
}

export async function getSimilarBooks(book: Book): Promise<Book[]> {
  const booksData = getBooks();
  return (book.similarIds ?? []).map((id) => booksData.find((b) => b.id === id)).filter((b): b is Book => Boolean(b));
}

export function getFilterOptions() {
  const booksData = getBooks();
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
  return [...getBooks()];
}

export async function adminSaveBook(book: Book): Promise<Book> {
  const books = getBooks();
  const idx = books.findIndex((b) => b.id === book.id);
  if (idx >= 0) books[idx] = book;
  else books.push(book);
  saveJSON(STORAGE_KEYS.books, books);
  return { ...book };
}

export async function adminDeleteBook(id: string): Promise<void> {
  const books = getBooks().filter((b) => b.id !== id);
  saveJSON(STORAGE_KEYS.books, books);
}

export async function adminGetBookStats() {
  const books = getBooks();
  return { totalBooks: books.length };
}

export function newId() { return 'b' + Math.random().toString(36).slice(2) + Date.now().toString(36); }

export const availabilityLabels: Record<string, string> = { available: 'موجود', borrowed: 'امانت رفته', reference: 'مرجع', restored: 'در حال مرمت' };
export const bookTypeLabels: Record<string, string> = { printed: 'چاپی', digital: 'دیجیتال', manuscript: 'نسخه خطی', lithographic: 'سنگی' };
export const availabilityStyles: Record<string, string> = { available: 'bg-emerald-soft text-emerald-deep', borrowed: 'bg-amber-100 text-amber-700', reference: 'bg-sky-100 text-sky-700', restored: 'bg-rose-100 text-rose-700' };
