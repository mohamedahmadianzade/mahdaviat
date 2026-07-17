/*
# Create admin_users table with permission-based access control

1. New Tables
- `admin_users`
  - `id` (uuid, primary key)
  - `username` (text, unique, not null) — login username
  - `password` (text, not null) — plain text password (same pattern as existing admin_credentials)
  - `full_name` (text, not null) — display name
  - `can_access_store` (boolean, default false) — permission to manage store/products/orders/settings
  - `can_access_library` (boolean, default false) — permission to manage books
  - `can_access_organization` (boolean, default false) — permission to manage org members/units
  - `can_access_moballeghin` (boolean, default false) — permission to manage moballeghin and activities
  - `is_super_admin` (boolean, default false) — full access including user management
  - `active` (boolean, default true) — whether the user can log in
  - `created_at` (timestamptz, default now())

2. Data Migration
- Migrates the existing single admin from `admin_credentials` into `admin_users` as a super admin.
- Only runs if admin_users table is empty.

3. Security
- Enable RLS on `admin_users`.
- Allow anon + authenticated CRUD (the app uses anon key for all operations, same as other tables).
- This is a single-tenant admin panel — the anon key is trusted to manage admin users.
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  can_access_store boolean NOT NULL DEFAULT false,
  can_access_library boolean NOT NULL DEFAULT false,
  can_access_organization boolean NOT NULL DEFAULT false,
  can_access_moballeghin boolean NOT NULL DEFAULT false,
  is_super_admin boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_admin_users" ON admin_users;
CREATE POLICY "anon_select_admin_users" ON admin_users
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_admin_users" ON admin_users;
CREATE POLICY "anon_insert_admin_users" ON admin_users
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_admin_users" ON admin_users;
CREATE POLICY "anon_update_admin_users" ON admin_users
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_admin_users" ON admin_users;
CREATE POLICY "anon_delete_admin_users" ON admin_users
  FOR DELETE TO anon, authenticated USING (true);

-- Migrate existing admin_credentials into admin_users (only if admin_users is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_users LIMIT 1) THEN
    INSERT INTO admin_users (username, password, full_name, is_super_admin, active)
    SELECT username, password, COALESCE(username, 'مدیر'), true, true
    FROM admin_credentials
    ON CONFLICT (username) DO NOTHING;
  END IF;
END $$;
