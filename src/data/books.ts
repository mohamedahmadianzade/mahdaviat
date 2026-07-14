import type { Book } from '../types';

const cover = (c: string) => `linear-gradient(135deg, ${c}, ${c}dd)`;

export const defaultBooks: Book[] = [
  {
    id: 'b1', title: 'مکیال المکارم فی فوائد الدعاء للقائم', author: 'سید محمدتقی موسوی اصفهانی',
    publisher: 'مؤسسه امام مهدی', subject: 'دعا و زیارات', category: 'مهدویت',
    keywords: ['دعا', 'زیارت', 'قائم', 'مهدی'], language: 'عربی', publicationYear: 1420,
    century: 'قرن ۱۵', collection: 'مجموعه مهدویت', libraryCode: 'MAJ-001', isbn: '978-964-1234-01-1',
    availability: 'available', bookType: 'printed', tags: ['دعا', 'زیارت', 'مهدویت'],
    description: 'یکی از مهم‌ترین کتاب‌ها در زمینه دعا و زیارات مخصوص حضرت مهدی (عج).', coverColor: cover('#0F6A4A'), pages: 320,
    similarIds: ['b2', 'b3'],
  },
  {
    id: 'b2', title: 'الإمام المهدی موجود', author: 'سید محمدباقر صدر',
    publisher: 'انتشارات اسلامی', subject: 'کلام و عقاید', category: 'مهدویت',
    keywords: ['امام مهدی', 'وجود', 'کلام'], language: 'عربی', publicationYear: 1395,
    century: 'قرن ۱۵', collection: 'مجموعه مهدویت', libraryCode: 'MAJ-002', isbn: '978-964-1234-02-8',
    availability: 'available', bookType: 'printed', tags: ['کلام', 'عقاید', 'مهدویت'],
    description: 'کتابی در اثبات وجود امام مهدی (عج) با استدلال‌های کلامی و عقلی.', coverColor: cover('#0B5454'), pages: 280,
    similarIds: ['b1', 'b4'],
  },
  {
    id: 'b3', title: 'دایره المعارف مهدویت', author: 'گروه مؤلفان',
    publisher: 'بنیاد فرهنگی مهدویت', subject: 'دایره المعارف', category: 'مهدویت',
    keywords: ['دایره المعارف', 'مهدویت', 'مرجع'], language: 'فارسی', publicationYear: 1402,
    century: 'قرن ۱۵', collection: 'مجموعه مهدویت', libraryCode: 'MAJ-003', isbn: '978-964-1234-03-5',
    availability: 'available', bookType: 'printed', tags: ['دایره المعارف', 'مهدویت', 'مرجع'],
    description: 'دایره المعارف جامع در موضوع مهدویت و علوم وابسته.', coverColor: cover('#C9A227'), pages: 650,
    similarIds: ['b1', 'b5'],
  },
  {
    id: 'b4', title: 'مهدویت در آینه احادیث', author: 'علی اصغر مروی',
    publisher: 'انتشارات امیر', subject: 'حدیث', category: 'مهدویت',
    keywords: ['حدیث', 'مهدویت', 'احادیث'], language: 'فارسی', publicationYear: 1398,
    century: 'قرن ۱۵', collection: 'مجموعه مهدویت', libraryCode: 'MAJ-004', isbn: '978-964-1234-04-2',
    availability: 'available', bookType: 'printed', tags: ['حدیث', 'مهدویت'],
    description: 'مجموعه‌ای از احادیث مرتبط با مهدویت و امام زمان (عج).', coverColor: cover('#1B8A66'), pages: 240,
    similarIds: ['b2', 'b5'],
  },
  {
    id: 'b5', title: 'انتظار در اندیشه اسلامی', author: 'محمدمهدی حسینی',
    publisher: 'انتشارات معارف', subject: 'انتظار', category: 'مهدویت',
    keywords: ['انتظار', 'اسلام', 'مهدویت'], language: 'فارسی', publicationYear: 1399,
    century: 'قرن ۱۵', collection: 'مجموعه مهدویت', libraryCode: 'MAJ-005', isbn: '978-964-1234-05-9',
    availability: 'available', bookType: 'digital', tags: ['انتظار', 'مهدویت'],
    description: 'بررسی مفهوم انتظار در اندیشه اسلامی و مکاتب مختلف.', coverColor: cover('#07382A'), pages: 180,
    similarIds: ['b3', 'b4'],
  },
];

export default defaultBooks;
