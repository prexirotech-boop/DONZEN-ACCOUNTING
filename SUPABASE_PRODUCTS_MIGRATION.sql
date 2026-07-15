-- ═══════════════════════════════════════════════════════════════════════════
-- SUPABASE EBOOK AND PRODUCT IMAGES MIGRATION
-- Run this in your Supabase SQL Editor to support Ebook and Image uploads
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Add ebook and sales page columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ebook_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bonus_ebook_urls JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sales_page_path TEXT;

-- 2. Create the ebook-files storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('ebook-files', 'ebook-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Create the product-images storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Setup permissive storage policies for uploading ebooks and product images
DROP POLICY IF EXISTS "Anyone can upload ebook files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view ebook files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;

CREATE POLICY "Anyone can upload ebook files"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'ebook-files');

CREATE POLICY "Anyone can view ebook files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'ebook-files');

CREATE POLICY "Anyone can upload product images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
