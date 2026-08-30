-- ═══════════════════════════════════════════════════════════════════════════
-- DONZEN ACCOUNTING HUB — PRODUCT BUNDLING, BATCH ENROLLMENT & DURATION SETUP
-- Run this script in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. ENSURE 'bundle' IS ALLOWED IN PRODUCTS.TYPE
ALTER TABLE IF EXISTS public.products 
  DROP CONSTRAINT IF EXISTS products_type_check;

ALTER TABLE IF EXISTS public.products 
  ADD CONSTRAINT products_type_check 
  CHECK (type IN ('service','template','course','ebook','blueprint','bundle'));

-- 2. ADD BATCH & DURATION COLUMNS TO PRODUCTS
ALTER TABLE IF EXISTS public.products
  ADD COLUMN IF NOT EXISTS batch_enrollment_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS batch_start_date TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS batch_name TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS access_duration_type TEXT DEFAULT 'lifetime' CHECK (access_duration_type IN ('lifetime', '1_month', '3_months', '6_months', '1_year', 'custom')),
  ADD COLUMN IF NOT EXISTS access_duration_days INTEGER DEFAULT NULL;

-- 3. ADD BATCH & DURATION COLUMNS TO COURSES
ALTER TABLE IF EXISTS public.courses
  ADD COLUMN IF NOT EXISTS batch_enrollment_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS batch_start_date TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS batch_name TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS access_duration_type TEXT DEFAULT 'lifetime' CHECK (access_duration_type IN ('lifetime', '1_month', '3_months', '6_months', '1_year', 'custom')),
  ADD COLUMN IF NOT EXISTS access_duration_days INTEGER DEFAULT NULL;

-- 4. CREATE BUNDLE_ITEMS TABLE (Links a Bundle Product to Multiple Course Products)
CREATE TABLE IF NOT EXISTS public.bundle_items (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id   UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  course_id   UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bundle_id, course_id)
);

-- 5. UPDATE ENROLLMENTS TABLE FOR BATCH ACCESS & DURATION LIMITS
ALTER TABLE IF EXISTS public.enrollments
  ADD COLUMN IF NOT EXISTS access_starts_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS access_expires_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bundle_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_batch BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS batch_unlocked_notified BOOLEAN DEFAULT FALSE;

-- 6. CREATE IN-APP NOTIFICATIONS TABLE (For Batch Access, Reminders & Announcements)
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  link        TEXT,
  type        TEXT DEFAULT 'batch_unlock' CHECK (type IN ('batch_unlock', 'batch_reminder', 'announcement', 'reply', 'system')),
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 8. POLICIES FOR BUNDLE_ITEMS
-- Anyone can view bundle items for published bundles
DROP POLICY IF EXISTS "Public can view bundle items" ON public.bundle_items;
CREATE POLICY "Public can view bundle items"
  ON public.bundle_items FOR SELECT
  USING (true);

-- Admins can insert/update/delete bundle items
DROP POLICY IF EXISTS "Admins can manage bundle items" ON public.bundle_items;
CREATE POLICY "Admins can manage bundle items"
  ON public.bundle_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR auth.role() = 'service_role'
  );

-- 9. POLICIES FOR NOTIFICATIONS
-- Users can view their own notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Users can update (mark as read) their own notifications
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Admins and Service Role can insert notifications
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
CREATE POLICY "Admins can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR auth.role() = 'service_role'
  );

-- 10. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle ON public.bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_course ON public.bundle_items(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_access_starts ON public.enrollments(access_starts_at);
CREATE INDEX IF NOT EXISTS idx_enrollments_access_expires ON public.enrollments(access_expires_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
