/*
# Storage bucket for product images

1. Storage
- Creates a public bucket named `product-images` (50MB file limit, web image mime types only).
- Public read: anyone can view product photos (required for the storefront).
- Admin-only upload: only signed-in users with a row in admin_roles may upload, replace or delete images.
- Uploads are namespaced under the admin user's own folder (auth.uid()/filename), enforced by policy.
- Strict mime-type and path validation blocks HTML/PHP-style payloads.

2. Notes
- Images are served through Supabase Storage's CDN with automatic WebP transformation support.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  52428800,
  ARRAY['image/jpeg','image/png','image/webp','image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/avif'];

DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins upload product images" ON storage.objects;
CREATE POLICY "Admins upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND has_admin_access()
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND (name ILIKE '%.jpg' OR name ILIKE '%.jpeg' OR name ILIKE '%.png' OR name ILIKE '%.webp' OR name ILIKE '%.avif')
  );

DROP POLICY IF EXISTS "Admins update product images" ON storage.objects;
CREATE POLICY "Admins update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND has_admin_access()
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Admins delete product images" ON storage.objects;
CREATE POLICY "Admins delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND has_admin_access()
    AND (storage.foldername(name))[1] = auth.uid()::text
  );