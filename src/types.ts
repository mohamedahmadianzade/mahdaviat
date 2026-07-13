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
