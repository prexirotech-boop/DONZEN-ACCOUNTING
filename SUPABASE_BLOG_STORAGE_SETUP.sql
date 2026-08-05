-- ─── STEP 1: CREATE BLOG-ATTACHMENTS STORAGE BUCKET ──────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-attachments',
  'blog-attachments', 
  TRUE,
  5242880,  -- 5MB limit
  ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to blog attachments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public can read blog attachments'
  ) THEN
    CREATE POLICY "Public can read blog attachments"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'blog-attachments');
  END IF;
END $$;

-- Allow authenticated users (admins) to upload/insert blog attachments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can upload blog attachments'
  ) THEN
    CREATE POLICY "Admins can upload blog attachments"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'blog-attachments');
  END IF;
END $$;

-- Allow authenticated users (admins) to delete blog attachments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can delete blog attachments'
  ) THEN
    CREATE POLICY "Admins can delete blog attachments"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'blog-attachments');
  END IF;
END $$;

-- ─── STEP 2: ADD SEO FIELDS TO BLOG_POSTS TABLE ─────────────────────────────
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS focus_keyword TEXT;
