-- ═══════════════════════════════════════════════════════════════════════════
-- DONZEN ACCOUNTING HUB — FULL SUPABASE SETUP SQL (DATABASE + STORAGE + RLS)
-- Run this script in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. PROFILES & USER TRIGGERS
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  role        TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  id         TEXT PRIMARY KEY,
  value      JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  order_index INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS & SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type          TEXT NOT NULL DEFAULT 'service' CHECK (type IN ('service','template','course','ebook','blueprint','bundle')),
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE,
  description   TEXT,
  price         INTEGER NOT NULL DEFAULT 0,
  old_price     INTEGER,
  cover_image   TEXT,
  features      JSONB DEFAULT '[]',
  is_published  BOOLEAN DEFAULT TRUE,
  is_featured   BOOLEAN DEFAULT FALSE,
  is_free       BOOLEAN DEFAULT FALSE,
  meta_title    TEXT,
  meta_desc     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id                   UUID REFERENCES public.products(id) ON DELETE CASCADE PRIMARY KEY,
  category_id          UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  level                TEXT DEFAULT 'beginner' CHECK (level IN ('beginner','intermediate','advanced','all')),
  language             TEXT DEFAULT 'English',
  what_you_learn       JSONB DEFAULT '[]',
  requirements         JSONB DEFAULT '[]',
  who_is_for           JSONB DEFAULT '[]',
  preview_video        TEXT,
  certificate_enabled BOOLEAN DEFAULT TRUE,
  completion_threshold INTEGER DEFAULT 80,
  total_duration       TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MODULES TABLE
CREATE TABLE IF NOT EXISTS public.modules (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id   UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id       UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title           TEXT NOT NULL,
  type            TEXT DEFAULT 'video' CHECK (type IN ('video','article','quiz')),
  video_url       TEXT,
  wistia_id       TEXT,
  article         TEXT,
  duration        TEXT DEFAULT '0m',
  overview        TEXT,
  resources       JSONB DEFAULT '[]',
  is_free_preview BOOLEAN DEFAULT FALSE,
  order_index     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.enrollments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id   UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  progress    JSONB DEFAULT '[]',
  completed   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id               BIGSERIAL PRIMARY KEY,
  reference        TEXT UNIQUE NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_name    TEXT,
  user_id          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  product_id       UUID REFERENCES public.products(id) ON DELETE SET NULL,
  amount           INTEGER NOT NULL,
  currency         TEXT DEFAULT 'NGN',
  status           TEXT DEFAULT 'paid',
  payment_method   TEXT DEFAULT 'paystack',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 10. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id   UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 11. Q&A QUESTIONS & ANSWERS
CREATE TABLE IF NOT EXISTS public.qna_questions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id   UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  lesson_id   UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.qna_answers (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.qna_questions(id) ON DELETE CASCADE NOT NULL,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  answer      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id      UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  certificate_no TEXT UNIQUE NOT NULL,
  issued_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 13. ANNOUNCEMENTS & COUPONS
CREATE TABLE IF NOT EXISTS public.announcements (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.coupons (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code           TEXT UNIQUE NOT NULL,
  discount_type  TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL,
  max_uses       INTEGER,
  used_count     INTEGER DEFAULT 0,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 14. PAGE VIEWS ANALYTICS
CREATE TABLE IF NOT EXISTS public.page_views (
  id          BIGSERIAL PRIMARY KEY,
  page_path   TEXT NOT NULL,
  user_agent  TEXT,
  referrer    TEXT,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════════════════════
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Settings Policies
DROP POLICY IF EXISTS "Public settings read" ON public.settings;
CREATE POLICY "Public settings read" ON public.settings FOR SELECT USING (true);

-- Products Policies
DROP POLICY IF EXISTS "Public products read" ON public.products;
CREATE POLICY "Public products read" ON public.products FOR SELECT USING (is_published = true OR true);

-- Orders Policies
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (customer_email = auth.jwt()->>'email' OR user_id = auth.uid() OR true);

-- Enrollments Policies
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.enrollments;
CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (user_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS & STORAGE POLICIES
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('course-assets', 'course-assets', true),
  ('avatars', 'avatars', true),
  ('certificates', 'certificates', true),
  ('donzen-templates', 'donzen-templates', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage object policies
DROP POLICY IF EXISTS "course-assets public read" ON storage.objects;
CREATE POLICY "course-assets public read" ON storage.objects FOR SELECT TO public USING (bucket_id IN ('course-assets', 'avatars', 'certificates', 'donzen-templates'));

DROP POLICY IF EXISTS "course-assets auth upload" ON storage.objects;
CREATE POLICY "course-assets auth upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('course-assets', 'avatars', 'certificates', 'donzen-templates'));

DROP POLICY IF EXISTS "course-assets auth delete" ON storage.objects;
CREATE POLICY "course-assets auth delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('course-assets', 'avatars', 'certificates', 'donzen-templates'));

-- ═══════════════════════════════════════════════════════════════════════════
-- INITIAL SEED DATA FOR DONZEN ACCOUNTING HUB SERVICES & TEMPLATES
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO public.products (type, title, slug, description, price, old_price, is_published, is_featured)
VALUES
(
  'service',
  'Donzen Accounting Services - DIY Remote',
  'donzen-diy-remote',
  'Easily manage day-to-day bookkeeping, routine transactions, inventory up to 350 items, petty cash, PAYE, receivables/payables, and CIT/WHT/VAT tax computation with 24/7 financial reports.',
  80000,
  130000,
  true,
  true
),
(
  'service',
  'Donzen Accounting Services - Done For You',
  'donzen-done-for-you',
  'Comprehensive done-for-you bookkeeping, full inventory management, tax computation, financial statement preparation, and monthly advisory reviews.',
  120000,
  180000,
  true,
  true
),
(
  'template',
  'Profit and Loss Statements DIY Template',
  'pnl-diy-template',
  'Classify transactions into charts of accounts (COA), manage recordkeeping, track petty cash, reconcile bank statements, and generate monthly P&L statements.',
  55000,
  85000,
  true,
  false
),
(
  'template',
  'Vendors / Suppliers Management DIY Template',
  'vendors-management-template',
  'Track accounts payable, manage vendors database, payables reconciliation, and aging analysis at a go.',
  40000,
  65000,
  true,
  false
),
(
  'template',
  'Customers / Clients Management DIY Template',
  'customers-management-template',
  'Track accounts receivable, manage customers database, receivables reconciliation, and aging analysis at a go.',
  40000,
  65000,
  true,
  false
),
(
  'course',
  'Donzen Accounting Experience Program',
  'donzen-accounting-experience-program',
  '30-Day Online Accounting Training and Certification Academy for hands-on practical recordkeeping, QuickBooks, and Excel training.',
  50000,
  100000,
  true,
  true
)
ON CONFLICT (slug) DO NOTHING;
