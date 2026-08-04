-- ═══════════════════════════════════════════════════════════════════════════
-- DONZEN ACCOUNTING — EMERGENCY SIGNUP HOTFIX
-- Run this script in your Supabase Dashboard → SQL Editor
-- This drops the broken affiliate triggers so that user signup works immediately
-- ═══════════════════════════════════════════════════════════════════════════

DROP TRIGGER IF EXISTS trigger_assign_affiliate_code ON public.profiles;
DROP TRIGGER IF EXISTS trigger_create_affiliate ON public.profiles;
DROP TRIGGER IF EXISTS trigger_affiliate_commission ON public.orders;
