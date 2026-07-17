-- Change id columns from uuid to text for tables that use hardcoded string IDs.
-- This allows the app to keep its existing ID scheme (b1, c1, p1, m1, ou-root, etc.)
-- and insert sample data without remapping.
-- All foreign keys are updated to reference text columns.
-- Data is preserved (tables are empty at this point).

-- Drop FK constraints first
ALTER TABLE activities DROP CONSTRAINT IF EXISTS activities_missionary_id_fkey;
ALTER TABLE org_members DROP CONSTRAINT IF EXISTS org_members_unit_id_fkey;
ALTER TABLE org_members DROP CONSTRAINT IF EXISTS org_members_parent_id_fkey;
ALTER TABLE org_units DROP CONSTRAINT IF EXISTS org_units_parent_id_fkey;

-- Change id columns to text
ALTER TABLE books ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE product_categories ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE products ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE org_units ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE org_members ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE moballeghin ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE activities ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE admin_credentials ALTER COLUMN id TYPE text USING id::text;

-- Change FK reference columns to text
ALTER TABLE activities ALTER COLUMN missionary_id TYPE text USING missionary_id::text;
ALTER TABLE org_members ALTER COLUMN parent_id TYPE text USING parent_id::text;
ALTER TABLE org_members ALTER COLUMN unit_id TYPE text USING unit_id::text;
ALTER TABLE org_units ALTER COLUMN parent_id TYPE text USING parent_id::text;
ALTER TABLE products ALTER COLUMN category_id TYPE text USING category_id::text;

-- Re-add FK constraints
ALTER TABLE org_units
  ADD CONSTRAINT org_units_parent_id_fkey
  FOREIGN KEY (parent_id) REFERENCES org_units(id) ON DELETE SET NULL;

ALTER TABLE org_members
  ADD CONSTRAINT org_members_parent_id_fkey
  FOREIGN KEY (parent_id) REFERENCES org_members(id) ON DELETE SET NULL;

ALTER TABLE org_members
  ADD CONSTRAINT org_members_unit_id_fkey
  FOREIGN KEY (unit_id) REFERENCES org_units(id) ON DELETE SET NULL;

ALTER TABLE activities
  ADD CONSTRAINT activities_missionary_id_fkey
  FOREIGN KEY (missionary_id) REFERENCES moballeghin(id) ON DELETE CASCADE;

-- Drop the default gen_random_uuid() since we now use text IDs from the client
ALTER TABLE books ALTER COLUMN id DROP DEFAULT;
ALTER TABLE product_categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE products ALTER COLUMN id DROP DEFAULT;
ALTER TABLE org_units ALTER COLUMN id DROP DEFAULT;
ALTER TABLE org_members ALTER COLUMN id DROP DEFAULT;
ALTER TABLE moballeghin ALTER COLUMN id DROP DEFAULT;
ALTER TABLE activities ALTER COLUMN id DROP DEFAULT;
ALTER TABLE admin_credentials ALTER COLUMN id DROP DEFAULT;
