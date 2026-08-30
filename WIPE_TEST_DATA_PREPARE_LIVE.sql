-- ═══════════════════════════════════════════════════════════════════════════
-- 🚀 DONZEN ACCOUNTING HUB — PREPARE FOR GO-LIVE (CLEAN TEST DATA)
-- ═══════════════════════════════════════════════════════════════════════════
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
--
-- ✅ PRESERVED:
--   1. All Admin Profiles & Admin Auth Accounts
--   2. All Products, Courses, Modules, Lessons, Videos, Quizzes & Resources
--   3. All Course Bundles & Bundle Items
--   4. All Categories, Settings, Bank Accounts & Payment Gateway Configs
--   5. All Coupons, Order Bumps & Blog Posts
--
-- 🗑️ WIPED (Test Data):
--   1. Orders, Transactions & Payment Receipts
--   2. Student Enrollments & Lesson Progress (non-admin)
--   3. Test Reviews & Wishlist items
--   4. Test Q&A Questions & Answers
--   5. Test Certificates & In-app Notifications
--   6. Test Affiliate Referrals, Clicks & Payouts
--   7. Test Analytics Events
--   8. Test Student Profiles & Auth Users (non-admins)
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- 1. Wipe test analytics & event logs (if table exists)
DO $CLEAN$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'analytics_events') THEN
    DELETE FROM public.analytics_events;
  END IF;
END $CLEAN$;

-- 2. Wipe test notifications (if table exists)
DO $CLEAN$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
    DELETE FROM public.notifications;
  END IF;
END $CLEAN$;

-- 3. Wipe test wishlist items (if table exists)
DO $CLEAN$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wishlist') THEN
    DELETE FROM public.wishlist;
  END IF;
END $CLEAN$;

-- 4. Wipe test reviews & ratings (if table exists)
DO $CLEAN$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reviews') THEN
    DELETE FROM public.reviews;
  END IF;
END $CLEAN$;

-- 5. Wipe test certificates issued to students (if table exists)
DO $CLEAN$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'certificates') THEN
    DELETE FROM public.certificates;
  END IF;
END $CLEAN$;

-- 6. Wipe test Q&A discussions (if tables exist)
DO $CLEAN$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'qna_answers') THEN
    DELETE FROM public.qna_answers;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'qna_questions') THEN
    DELETE FROM public.qna_questions;
  END IF;
END $CLEAN$;

-- 7. Wipe test affiliate referrals, payouts & clicks (if tables exist)
DO $CLEAN$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'affiliate_referrals') THEN
    DELETE FROM public.affiliate_referrals;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'affiliate_payouts') THEN
    DELETE FROM public.affiliate_payouts;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'affiliate_clicks') THEN
    DELETE FROM public.affiliate_clicks;
  END IF;
END $CLEAN$;

-- 8. Wipe test order items & order bump purchases (if tables exist)
DO $CLEAN$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'order_bump_purchases') THEN
    DELETE FROM public.order_bump_purchases;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'order_items') THEN
    DELETE FROM public.order_items;
  END IF;
END $CLEAN$;

-- 9. Wipe all test orders & payment transactions (if table exists)
DO $CLEAN$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
    DELETE FROM public.orders;
  END IF;
END $CLEAN$;

-- 10. Wipe non-admin enrollments & student lesson progress
-- (Preserves admin enrollments if any exist for course preview)
DO $CLEAN$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'enrollments') THEN
    DELETE FROM public.enrollments 
    WHERE user_id NOT IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    );
  END IF;
END $CLEAN$;

-- 11. Wipe non-admin student profiles (Preserves admin accounts)
DELETE FROM public.profiles 
WHERE role != 'admin' OR role IS NULL;

-- 12. Wipe non-admin auth.users accounts from Supabase Auth
DELETE FROM auth.users 
WHERE id NOT IN (
  SELECT id FROM public.profiles WHERE role = 'admin'
);

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════════
-- 🎉 Verification Query — Check Remaining Counts:
-- ═══════════════════════════════════════════════════════════════════════════
SELECT 
  (SELECT count(*) FROM auth.users) AS remaining_admins,
  (SELECT count(*) FROM public.products) AS total_products,
  (SELECT count(*) FROM public.courses) AS total_courses,
  (SELECT count(*) FROM public.modules) AS total_modules,
  (SELECT count(*) FROM public.lessons) AS total_lessons,
  (SELECT count(*) FROM public.orders) AS total_orders,
  (SELECT count(*) FROM public.enrollments) AS total_enrollments;