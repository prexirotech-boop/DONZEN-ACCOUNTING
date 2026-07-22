-- ═══════════════════════════════════════════════════════════════════════════
-- SUPABASE PAYMENT PLANS (INSTALLMENTS) SETUP
-- Run this in your Supabase SQL Editor to support product installment payments
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Add payment plans columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS has_payment_plans BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS payment_plans JSONB DEFAULT '[]'::jsonb;

-- 2. Add installment tracking columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS parent_reference TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_plan_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS installment_paid INTEGER DEFAULT 1;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_installments INTEGER DEFAULT 1;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_plan_next_due TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_plan_status TEXT CHECK (payment_plan_status IN ('active', 'completed', 'overdue', 'cancelled'));

-- 3. Create indices for faster billing queries
CREATE INDEX IF NOT EXISTS orders_parent_ref_idx ON public.orders (parent_reference);
CREATE INDEX IF NOT EXISTS orders_plan_status_idx ON public.orders (payment_plan_status);
