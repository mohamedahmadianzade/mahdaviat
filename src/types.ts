// ─── Book types ──────────────────────────────────────────────────────────────

export interface Book {
  id: string;
  title: string;
  author: string;
  translator?: string;
  publisher: string;
  subject: string;
  category: string;
  keywords: string[];
  language: string;
  publicationYear: number;
  century: string;
  collection: string;
  libraryCode: string;
  isbn: string;
  availability: 'available' | 'borrowed' | 'reference' | 'restored';
  bookType: 'printed' | 'digital' | 'manuscript' | 'lithographic';
  tags: string[];
  description: string;
  coverColor: string;
  pages: number;
  similarIds?: string[];
}

export interface SearchFilters {
  query: string; title: string; author: string; translator: string; publisher: string;
  subject: string; category: string; keywords: string; language: string;
  publicationYear: string; century: string; collection: string; libraryCode: string;
  isbn: string; availability: string; bookType: string; tags: string;
}

export const emptyFilters: SearchFilters = {
  query: '', title: '', author: '', translator: '', publisher: '', subject: '',
  category: '', keywords: '', language: '', publicationYear: '', century: '',
  collection: '', libraryCode: '', isbn: '', availability: '', bookType: '', tags: '',
};

// ─── Store types ──────────────────────────────────────────────────────────────

export interface ProductCategory {
  id: string; name: string; slug: string; description: string; order: number; active: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  images: string[];
  shortDescription: string;
  description: string;
  price: string;
  keywords: string[];
  order: number;
  active: boolean;
  similarIds?: string[];
}

export interface ProductSearchFilters { query: string; categoryId: string; }
export const emptyProductFilters: ProductSearchFilters = { query: '', categoryId: '' };

// ─── Settings types ───────────────────────────────────────────────────────────

export type ContactMode = 'phone' | 'whatsapp';

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  contactMode: ContactMode;
  phone: string;
  whatsapp: string;
  contactButtonText: string;
}

export const defaultSettings: StoreSettings = {
  storeName: 'فروشگاه',
  storeTagline: 'محصولات فرهنگی و آموزشی',
  contactMode: 'whatsapp',
  phone: '021-12345678',
  whatsapp: '989123456789',
  contactButtonText: 'جهت خرید و استعلام موجودی تماس بگیرید',
};

// ─── Auth types ───────────────────────────────────────────────────────────────

export interface AdminCredentials { username: string; password: string; }

// ─── Organization types ──────────────────────────────────────────────────────

export type ManagementLevel = 'executive' | 'deputy' | 'department' | 'unit' | 'staff';

export interface OrgUnit {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
  active: boolean;
}

export interface OrgMember {
  id: string;
  parentId: string | null;
  name: string;
  position: string;
  department: string;
  unitId: string;
  managementLevel: ManagementLevel;
  image: string;
  bio: string;
  responsibilities: string[];
  education: string[];
  experience: string[];
  skills: string[];
  researchAreas: string[];
  publications: string[];
  projects: string[];
  certificates: string[];
  awards: string[];
  phone: string;
  email: string;
  office: string;
  socialLinks: { label: string; url: string }[];
  gallery: string[];
  documents: string[];
  order: number;
  active: boolean;
}

export interface OrgSearchFilters {
  query: string;
  department: string;
  managementLevel: string;
  unitId: string;
}

export const emptyOrgFilters: OrgSearchFilters = {
  query: '', department: '', managementLevel: '', unitId: '',
};

export const managementLevelLabels: Record<ManagementLevel, string> = {
  executive: 'مدیریت ارشد',
  deputy: 'معاونت',
  department: 'مدیریت بخش',
  unit: 'واحد',
  staff: 'کارکنان',
};

export const managementLevelStyles: Record<ManagementLevel, string> = {
  executive: 'bg-emerald text-white',
  deputy: 'bg-emerald-deep text-white',
  department: 'bg-teal text-white',
  unit: 'bg-gold text-white',
  staff: 'bg-gold-deep text-white',
};

export interface OrgTreeNode extends OrgMember {
  children: OrgTreeNode[];
}

// ─── Moballeghin (مبلغین) types ──────────────────────────────────────────────

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type EducationLevel = 'under_diploma' | 'diploma' | 'associate' | 'bachelor' | 'master' | 'doctoral' | 'hawzeh_1' | 'hawzeh_2' | 'hawzeh_3' | 'hawzeh_kharij';

export const maritalStatusLabels: Record<MaritalStatus, string> = {
  single: 'مجرد',
  married: 'متاهل',
  divorced: 'مطلقه',
  widowed: 'بیوه',
};

export const educationLevelLabels: Record<EducationLevel, string> = {
  under_diploma: 'زیر دیپلم',
  diploma: 'دیپلم',
  associate: 'فوق دیپلم',
  bachelor: 'کارشناسی',
  master: 'کارشناسی ارشد',
  doctoral: 'دکترا',
  hawzeh_1: 'حوزوی سطح ۱',
  hawzeh_2: 'حوزوی سطح ۲',
  hawzeh_3: 'حوزوی سطح ۳',
  hawzeh_kharij: 'حوزوی خارج',
};

export const birthYears: number[] = Array.from({ length: 80 }, (_, i) => 1400 - i);

export interface Moballagh {
  id: string;
  // اطلاعات شخصی
  fullName: string;
  fatherName: string;
  idCardNumber: string;
  nationalCode: string;
  // اطلاعات تکمیلی
  birthYear: string;
  birthPlace: string;
  educationLevel: EducationLevel | '';
  maritalStatus: MaritalStatus | '';
  // اطلاعات تماس و بانکی
  phone: string;
  bankAccountNumber: string;
  address: string;
  // metadata
  registeredAt: string;
  active: boolean;
}

export const emptyMoballagh = (): Omit<Moballagh, 'id' | 'registeredAt'> => ({
  fullName: '',
  fatherName: '',
  idCardNumber: '',
  nationalCode: '',
  birthYear: '',
  birthPlace: '',
  educationLevel: '',
  maritalStatus: '',
  phone: '',
  bankAccountNumber: '',
  address: '',
  active: true,
});

// ─── Activities (فعالیتهای تبلیغی) types ──────────────────────────────────────

export interface Activity {
  id: string;
  missionaryId: string;
  schoolName: string;
  schoolAddress: string;
  contactPersonName: string;
  contactPhoneNumber: string;
  eventDate: string;
  sessionCount: number | '';
  sessionTiming: string;
  audienceAgeRange: string;
  audienceEducationLevel: string;
  attendeeCount: number | '';
  lectureTopic: string;
  responsibleCollaborator: string;
  cost: number | '';
  location: string;
  createdAt: string;
  updatedAt: string;
}

export const emptyActivity = (): Activity => ({
  id: '',
  missionaryId: '',
  schoolName: '',
  schoolAddress: '',
  contactPersonName: '',
  contactPhoneNumber: '',
  eventDate: '',
  sessionCount: '',
  sessionTiming: '',
  audienceAgeRange: '',
  audienceEducationLevel: '',
  attendeeCount: '',
  lectureTopic: '',
  responsibleCollaborator: '',
  cost: '',
  location: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
