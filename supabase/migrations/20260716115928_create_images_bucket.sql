-- Create images storage bucket
-- Public bucket for product images, org member photos, etc.
-- Images are compressed client-side before upload to keep sizes small.
-- Public bucket: anyone can read via the public URL.
-- CRUD policies allow anon + authenticated to manage files (single-tenant, no sign-in).

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name,
      public = EXCLUDED.public;

DROP POLICY IF EXISTS "anon_read_images" ON storage.objects;
CREATE POLICY "anon_read_images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "anon_insert_images" ON storage.objects;
CREATE POLICY "anon_insert_images" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "anon_update_images" ON storage.objects;
CREATE POLICY "anon_update_images" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "anon_delete_images" ON storage.objects;
CREATE POLICY "anon_delete_images" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'images');
