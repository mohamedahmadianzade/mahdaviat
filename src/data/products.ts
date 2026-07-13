import type { ProductCategory, Product } from '../types';

export const defaultCategories: ProductCategory[] = [
  { id: 'c1', name: 'کتاب', slug: 'book', description: 'کتاب‌های چاپی و دیجیتال', order: 1, active: true },
  { id: 'c2', name: 'نرم‌افزار', slug: 'software', description: 'نرم‌افزارهای آموزشی و فرهنگی', order: 2, active: true },
  { id: 'c3', name: 'محصولات فرهنگی', slug: 'cultural', description: 'آثار فرهنگی و هنری', order: 3, active: true },
  { id: 'c4', name: 'لوازم آموزشی', slug: 'educational', description: 'تجهیزات و لوازم آموزشی', order: 4, active: true },
  { id: 'c5', name: 'فایل دانلودی', slug: 'download', description: 'فایل‌های دیجیتال قابل دانلود', order: 5, active: true },
  { id: 'c6', name: 'سایر', slug: 'other', description: 'سایر محصولات', order: 6, active: true },
];

const img = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`;

export const defaultProducts: Product[] = [
  { id: 'p1', name: 'قرآن کریم با ترجمه فارسی', categoryId: 'c1', images: [img(3646172), img(3646182), img(3646178)], shortDescription: 'قرآن کریم با ترجمه روان فارسی و خط نستعلیق زیبا', description: 'این نسخه از قرآن کریم با ترجمه‌ای روان به قلم مرحوم مهدی الهی قمشه‌ای چاپ شده است. خط نستعلیق اصیل، کاغذ کرم‌رنگ مرغوب و جلد گالینگور باکیفیت از ویژگی‌های این اثر است.', price: '۱۸۰,۰۰۰ تومان', keywords: ['قرآن', 'ترجمه', 'نستعلیق'], order: 1, active: true, similarIds: ['p2', 'p3'] },
  { id: 'p2', name: 'مفاتیح الجنان', categoryId: 'c1', images: [img(5765828), img(5765830)], shortDescription: 'مجموعه کامل ادعیه و زیارات با ترجمه فارسی', description: 'کامل‌ترین نسخه مفاتیح الجنان شیخ عباس قمی با ترجمه دقیق فارسی. شامل تمام ادعیه، زیارت‌نامه‌ها و اعمال ماه‌های قمری.', price: '۱۴۵,۰۰۰ تومان', keywords: ['دعا', 'زیارت', 'مفاتیح'], order: 2, active: true, similarIds: ['p1', 'p3'] },
  { id: 'p3', name: 'نرم‌افزار جامع کتابخانه اسلامی', categoryId: 'c2', images: [img(546819), img(574073), img(546820)], shortDescription: 'مجموعه‌ای از هزاران کتاب دیجیتال در حوزه علوم اسلامی', description: 'نرم‌افزار جامع کتابخانه اسلامی شامل بیش از ۵ هزار عنوان کتاب در موضوعات فقه، تفسیر، حدیث، کلام، عرفان و ادبیات اسلامی است.', price: '۳۵۰,۰۰۰ تومان', keywords: ['نرم‌افزار', 'کتاب دیجیتال', 'اسلامی'], order: 1, active: true, similarIds: ['p5', 'p6'] },
  { id: 'p4', name: 'تابلو خوشنویسی بسم‌الله', categoryId: 'c3', images: [img(6044266), img(6044199)], shortDescription: 'تابلو خوشنویسی دستی بسم‌الله الرحمن الرحیم', description: 'تابلو خوشنویسی اصیل با جوهر هندی روی کاغذ آهارمهره به خط ثلث. اثر استاد خوشنویس ایرانی. قاب‌شده با چوب گردو.', price: '۸۵۰,۰۰۰ تومان', keywords: ['خوشنویسی', 'تابلو', 'اسلامی', 'هنر'], order: 1, active: true, similarIds: ['p7'] },
  { id: 'p5', name: 'فلش‌کارت حفظ قرآن', categoryId: 'c4', images: [img(4144179)], shortDescription: 'مجموعه فلش‌کارت آموزشی برای حفظ قرآن کریم', description: 'مجموعه‌ای از ۳۶۰ فلش‌کارت برای کمک به حفظ آیات قرآن کریم. هر کارت حاوی آیه عربی، ترجمه فارسی و نکات تجویدی است.', price: '۶۵,۰۰۰ تومان', keywords: ['قرآن', 'حفظ', 'فلش‌کارت', 'آموزشی'], order: 1, active: true, similarIds: ['p6'] },
  { id: 'p6', name: 'پک تخصصی فراگیری زبان عربی', categoryId: 'c5', images: [img(6278771), img(6278775)], shortDescription: 'فایل‌های صوتی و تصویری آموزش زبان عربی تخصصی', description: 'این پک آموزشی شامل ۴۵ ساعت فایل صوتی و تصویری برای یادگیری زبان عربی در سه سطح مقدماتی، متوسط و پیشرفته است.', price: '۲۲۰,۰۰۰ تومان', keywords: ['عربی', 'آموزش', 'دانلود', 'زبان'], order: 1, active: true, similarIds: ['p3', 'p5'] },
  { id: 'p7', name: 'تسبیح عقیق یمنی', categoryId: 'c3', images: [img(6044282)], shortDescription: 'تسبیح اصیل با مهره‌های عقیق یمنی طبیعی', description: 'تسبیح دستساز با ۳۳ مهره عقیق یمنی طبیعی. رشته ابریشمی مستحکم با گره‌های سنتی. همراه با جعبه کادویی زیبا.', price: '۴۸۰,۰۰۰ تومان', keywords: ['تسبیح', 'عقیق', 'دستساز'], order: 2, active: true, similarIds: ['p4'] },
  { id: 'p8', name: 'تقویم اسلامی دیواری', categoryId: 'c6', images: [img(1028741)], shortDescription: 'تقویم دیواری ۱۴۰۴ با مناسبت‌های اسلامی', description: 'تقویم دیواری سال ۱۴۰۴ با طراحی اسلامی، شامل تمامی مناسبت‌های دینی، ملی و رویدادهای مهم.', price: '۴۵,۰۰۰ تومان', keywords: ['تقویم', 'اسلامی', 'مناسبت'], order: 1, active: true, similarIds: [] },
];
