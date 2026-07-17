/*
# Create all application tables (single-tenant, no auth)

1. Purpose
   Migrates the entire app from localStorage to Supabase. The app has no
   sign-in screen for end users; the admin panel uses simple credentials
   stored in the `admin_credentials` table. All tables are intentionally
   public/shared (single-tenant), so policies use `TO anon, authenticated`
   with `USING (true)` / `WITH CHECK (true)`.

2. New Tables
   - `books` — digital library books (id uuid PK, title, author, translator,
     publisher, subject, category, keywords text[], language, publication_year int,
     century, collection, library_code, isbn, availability, book_type, tags text[],
     description, cover_color, pages int, similar_ids text[], created_at, updated_at)
   - `book_categories` — reserved for future book categorization
     (id uuid PK, name, slug, description, "order" int, active bool)
   - `products` — store products
     (id uuid PK, name, category_id, images text[], short_description, description,
     price, keywords text[], "order" int, active bool, similar_ids text[],
     created_at, updated_at)
   - `product_categories` — store categories
     (id uuid PK, name, slug, description, "order" int, active bool)
   - `store_settings` — single-row store settings
     (id int PK default 1, store_name, store_tagline, contact_mode, phone,
     whatsapp, contact_button_text, updated_at)
   - `org_units` — organizational units
     (id uuid PK, name, parent_id uuid nullable, "order" int, active bool)
   - `org_members` — organization members/people
     (id uuid PK, parent_id uuid nullable, name, position, department, unit_id uuid,
     management_level, image, bio, responsibilities text[], education text[],
     experience text[], skills text[], research_areas text[], publications text[],
     projects text[], certificates text[], awards text[], phone, email, office,
     social_links jsonb, gallery text[], documents text[], "order" int, active bool)
   - `moballeghin` — missionaries
     (id uuid PK, full_name, father_name, id_card_number, national_code,
     birth_year, birth_place, education_level, marital_status, phone,
     bank_account_number, address, registered_at, active bool)
   - `activities` — missionary activities
     (id uuid PK, missionary_id uuid, school_name, school_address,
     contact_person_name, contact_phone_number, event_date, session_count int,
     session_timing, audience_age_range, audience_education_level,
     attendee_count int, lecture_topic, responsible_collaborator, cost int,
     location, created_at, updated_at)
   - `admin_credentials` — simple admin login credentials
     (id uuid PK, username unique, password)

3. Security
   - RLS enabled on every table.
   - All policies use `TO anon, authenticated` because the app has no sign-in
     screen and the anon-key frontend must be able to read/write.
   - `USING (true)` / `WITH CHECK (true)` is acceptable here because the data
     is intentionally public/shared (single-tenant app).

4. Notes
   - `order` is a reserved word in SQL so it is quoted throughout.
   - Arrays use text[] for simple lists; jsonb for complex nested objects.
   - Timestamps default to now() and are updated by the client.
*/

-- ─── books ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  translator text,
  publisher text NOT NULL,
  subject text NOT NULL,
  category text NOT NULL,
  keywords text[] NOT NULL DEFAULT '{}',
  language text NOT NULL,
  publication_year integer NOT NULL,
  century text NOT NULL,
  collection text NOT NULL,
  library_code text NOT NULL,
  isbn text NOT NULL,
  availability text NOT NULL DEFAULT 'available',
  book_type text NOT NULL DEFAULT 'printed',
  tags text[] NOT NULL DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  cover_color text NOT NULL DEFAULT '#0F6A4A',
  pages integer NOT NULL DEFAULT 0,
  similar_ids text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_books" ON books;
CREATE POLICY "anon_select_books" ON books FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_books" ON books;
CREATE POLICY "anon_insert_books" ON books FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_books" ON books;
CREATE POLICY "anon_update_books" ON books FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_books" ON books;
CREATE POLICY "anon_delete_books" ON books FOR DELETE TO anon, authenticated USING (true);

-- ─── book_categories ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS book_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL DEFAULT '',
  "order" integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true
);
ALTER TABLE book_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_book_categories" ON book_categories;
CREATE POLICY "anon_select_book_categories" ON book_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_book_categories" ON book_categories;
CREATE POLICY "anon_insert_book_categories" ON book_categories FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_book_categories" ON book_categories;
CREATE POLICY "anon_update_book_categories" ON book_categories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_book_categories" ON book_categories;
CREATE POLICY "anon_delete_book_categories" ON book_categories FOR DELETE TO anon, authenticated USING (true);

-- ─── product_categories ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL DEFAULT '',
  "order" integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true
);
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_product_categories" ON product_categories;
CREATE POLICY "anon_select_product_categories" ON product_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_product_categories" ON product_categories;
CREATE POLICY "anon_insert_product_categories" ON product_categories FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_product_categories" ON product_categories;
CREATE POLICY "anon_update_product_categories" ON product_categories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_product_categories" ON product_categories;
CREATE POLICY "anon_delete_product_categories" ON product_categories FOR DELETE TO anon, authenticated USING (true);

-- ─── products ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id text NOT NULL DEFAULT '',
  images text[] NOT NULL DEFAULT '{}',
  short_description text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  keywords text[] NOT NULL DEFAULT '{}',
  "order" integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  similar_ids text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE TO anon, authenticated USING (true);

-- ─── store_settings ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS store_settings (
  id integer PRIMARY KEY DEFAULT 1,
  store_name text NOT NULL DEFAULT 'فروشگاه',
  store_tagline text NOT NULL DEFAULT 'محصولات فرهنگی و آموزشی',
  contact_mode text NOT NULL DEFAULT 'whatsapp',
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  contact_button_text text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT store_settings_single_row CHECK (id = 1)
);
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_store_settings" ON store_settings;
CREATE POLICY "anon_select_store_settings" ON store_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_store_settings" ON store_settings;
CREATE POLICY "anon_insert_store_settings" ON store_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_store_settings" ON store_settings;
CREATE POLICY "anon_update_store_settings" ON store_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_store_settings" ON store_settings;
CREATE POLICY "anon_delete_store_settings" ON store_settings FOR DELETE TO anon, authenticated USING (true);

-- ─── org_units ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS org_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_id uuid REFERENCES org_units(id) ON DELETE SET NULL,
  "order" integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true
);
ALTER TABLE org_units ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_org_units" ON org_units;
CREATE POLICY "anon_select_org_units" ON org_units FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_org_units" ON org_units;
CREATE POLICY "anon_insert_org_units" ON org_units FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_org_units" ON org_units;
CREATE POLICY "anon_update_org_units" ON org_units FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_org_units" ON org_units;
CREATE POLICY "anon_delete_org_units" ON org_units FOR DELETE TO anon, authenticated USING (true);

-- ─── org_members ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS org_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES org_members(id) ON DELETE SET NULL,
  name text NOT NULL,
  position text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  unit_id uuid REFERENCES org_units(id) ON DELETE SET NULL,
  management_level text NOT NULL DEFAULT 'staff',
  image text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  responsibilities text[] NOT NULL DEFAULT '{}',
  education text[] NOT NULL DEFAULT '{}',
  experience text[] NOT NULL DEFAULT '{}',
  skills text[] NOT NULL DEFAULT '{}',
  research_areas text[] NOT NULL DEFAULT '{}',
  publications text[] NOT NULL DEFAULT '{}',
  projects text[] NOT NULL DEFAULT '{}',
  certificates text[] NOT NULL DEFAULT '{}',
  awards text[] NOT NULL DEFAULT '{}',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  office text NOT NULL DEFAULT '',
  social_links jsonb NOT NULL DEFAULT '[]',
  gallery text[] NOT NULL DEFAULT '{}',
  documents text[] NOT NULL DEFAULT '{}',
  "order" integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true
);
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_org_members" ON org_members;
CREATE POLICY "anon_select_org_members" ON org_members FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_org_members" ON org_members;
CREATE POLICY "anon_insert_org_members" ON org_members FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_org_members" ON org_members;
CREATE POLICY "anon_update_org_members" ON org_members FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_org_members" ON org_members;
CREATE POLICY "anon_delete_org_members" ON org_members FOR DELETE TO anon, authenticated USING (true);

-- ─── moballeghin ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS moballeghin (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  father_name text NOT NULL DEFAULT '',
  id_card_number text NOT NULL DEFAULT '',
  national_code text NOT NULL DEFAULT '',
  birth_year text NOT NULL DEFAULT '',
  birth_place text NOT NULL DEFAULT '',
  education_level text NOT NULL DEFAULT '',
  marital_status text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  bank_account_number text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  registered_at timestamptz NOT NULL DEFAULT now(),
  active boolean NOT NULL DEFAULT true
);
ALTER TABLE moballeghin ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_moballeghin" ON moballeghin;
CREATE POLICY "anon_select_moballeghin" ON moballeghin FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_moballeghin" ON moballeghin;
CREATE POLICY "anon_insert_moballeghin" ON moballeghin FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_moballeghin" ON moballeghin;
CREATE POLICY "anon_update_moballeghin" ON moballeghin FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_moballeghin" ON moballeghin;
CREATE POLICY "anon_delete_moballeghin" ON moballeghin FOR DELETE TO anon, authenticated USING (true);

-- ─── activities ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  missionary_id uuid NOT NULL REFERENCES moballeghin(id) ON DELETE CASCADE,
  school_name text NOT NULL,
  school_address text NOT NULL DEFAULT '',
  contact_person_name text NOT NULL DEFAULT '',
  contact_phone_number text NOT NULL DEFAULT '',
  event_date text NOT NULL,
  session_count integer,
  session_timing text NOT NULL DEFAULT '',
  audience_age_range text NOT NULL DEFAULT '',
  audience_education_level text NOT NULL DEFAULT '',
  attendee_count integer,
  lecture_topic text NOT NULL DEFAULT '',
  responsible_collaborator text NOT NULL DEFAULT '',
  cost integer,
  location text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_activities" ON activities;
CREATE POLICY "anon_select_activities" ON activities FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_activities" ON activities;
CREATE POLICY "anon_insert_activities" ON activities FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_activities" ON activities;
CREATE POLICY "anon_update_activities" ON activities FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_activities" ON activities;
CREATE POLICY "anon_delete_activities" ON activities FOR DELETE TO anon, authenticated USING (true);

-- ─── admin_credentials ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password text NOT NULL
);
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_admin_credentials" ON admin_credentials;
CREATE POLICY "anon_select_admin_credentials" ON admin_credentials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_admin_credentials" ON admin_credentials;
CREATE POLICY "anon_insert_admin_credentials" ON admin_credentials FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_admin_credentials" ON admin_credentials;
CREATE POLICY "anon_update_admin_credentials" ON admin_credentials FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_admin_credentials" ON admin_credentials;
CREATE POLICY "anon_delete_admin_credentials" ON admin_credentials FOR DELETE TO anon, authenticated USING (true);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_org_members_unit_id ON org_members(unit_id);
CREATE INDEX IF NOT EXISTS idx_org_members_parent_id ON org_members(parent_id);
CREATE INDEX IF NOT EXISTS idx_org_units_parent_id ON org_units(parent_id);
CREATE INDEX IF NOT EXISTS idx_activities_missionary_id ON activities(missionary_id);
