-- ═══════════════════════════════════════════════════════════════════════════
-- HOTFIX: WISHLIST & Q&A SCHEMA CORRECTIONS
-- Run this in your Supabase SQL Editor (https://supabase.com -> SQL Editor)
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Create wishlist table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Create policy allowing users to manage their own wishlist
DROP POLICY IF EXISTS "Users manage their own wishlist" ON public.wishlist;
CREATE POLICY "Users manage their own wishlist"
  ON public.wishlist FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Add is_resolved column to qna_questions if it does not exist
ALTER TABLE public.qna_questions ADD COLUMN IF NOT EXISTS is_resolved BOOLEAN DEFAULT FALSE;

-- 3. Re-create or refresh get_admin_dashboard_stats() if needed to ensure the schema is cached
-- (This compiles the function with the newly added is_resolved column)
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
  users_count INT;
  total_orders INT;
  paid_orders_count INT;
  products_count INT;
  unresolved_qna INT;
  total_revenue INT;
  recent_orders JSONB;
  recent_users JSONB;
  course_stats JSONB;
BEGIN
  -- Count users
  SELECT COUNT(*) INTO users_count FROM profiles;
  
  -- Count total orders
  SELECT COUNT(*) INTO total_orders FROM orders;
  
  -- Count paid orders
  SELECT COUNT(*) INTO paid_orders_count FROM orders WHERE status = 'paid';
  
  -- Count products
  SELECT COUNT(*) INTO products_count FROM products;
  
  -- Count unresolved Q&A
  SELECT COUNT(*) INTO unresolved_qna FROM qna_questions WHERE is_resolved = false;
  
  -- Sum total revenue
  SELECT COALESCE(SUM(amount), 0) INTO total_revenue FROM orders WHERE status = 'paid';
  
  -- Get recent orders (last 5)
  SELECT COALESCE(json_agg(t), '[]'::json) INTO recent_orders
  FROM (
    SELECT o.id, o.reference, o.customer_email, o.customer_name, o.amount, o.status, o.created_at,
           (SELECT title FROM products p WHERE p.id = o.product_id) as product_title
    FROM orders o
    ORDER BY o.created_at DESC
    LIMIT 5
  ) t;
  
  -- Get recent users (last 5)
  SELECT COALESCE(json_agg(t), '[]'::json) INTO recent_users
  FROM (
    SELECT id, full_name, email, role, created_at
    FROM profiles
    ORDER BY created_at DESC
    LIMIT 5
  ) t;
  
  -- Course stats (enrollment counts)
  SELECT COALESCE(json_agg(t), '[]'::json) INTO course_stats
  FROM (
    SELECT c.id, c.level, p.title, 
           (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as enrollment_count
    FROM courses c
    JOIN products p ON c.id = p.id
    ORDER BY enrollment_count DESC
  ) t;
  
  RETURN jsonb_build_object(
    'users_count', users_count,
    'total_orders', total_orders,
    'paid_orders_count', paid_orders_count,
    'products_count', products_count,
    'unresolved_qna', unresolved_qna,
    'total_revenue', total_revenue,
    'recent_orders', recent_orders,
    'recent_users', recent_users,
    'course_stats', course_stats
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Add missing columns to products table if they don't exist
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bonus_ebook_urls JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ebook_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sales_page_path TEXT;

-- 5. Create storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('ebook-files', 'ebook-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. Setup permissive storage policies for uploads
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatar images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload ebook files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view ebook files" ON storage.objects;

-- Product Images policies
CREATE POLICY "Anyone can upload product images"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'product-images');

-- Avatars policies
CREATE POLICY "Anyone can upload avatar images"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can view avatar images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

-- Ebook Files policies
CREATE POLICY "Anyone can upload ebook files"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'ebook-files');

CREATE POLICY "Anyone can view ebook files"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'ebook-files');

-- 7. Add payment plan columns to products and orders tables
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS has_payment_plans BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS payment_plans JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS parent_reference TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_plan_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS installment_paid INTEGER DEFAULT 1;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_installments INTEGER DEFAULT 1;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_plan_next_due TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_plan_status TEXT CHECK (payment_plan_status IN ('active', 'completed', 'overdue', 'cancelled'));

CREATE INDEX IF NOT EXISTS orders_parent_ref_idx ON public.orders (parent_reference);
CREATE INDEX IF NOT EXISTS orders_plan_status_idx ON public.orders (payment_plan_status);

-- 8. Force PostgREST to reload its schema cache to reflect the columns and tables instantly
NOTIFY pgrst, 'reload schema';

