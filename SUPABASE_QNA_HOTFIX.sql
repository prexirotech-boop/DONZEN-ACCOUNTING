-- ═══════════════════════════════════════════════════════════════════════════
-- DONZEN ACCOUNTING — Q&A ANSWERS COLUMN HOTFIX
-- Run this script in your Supabase Dashboard → SQL Editor
-- This renames user_id to author_id on qna_answers to match frontend queries
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'qna_answers' 
      AND column_name = 'user_id'
  ) AND NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'qna_answers' 
      AND column_name = 'author_id'
  ) THEN
    ALTER TABLE public.qna_answers RENAME COLUMN user_id TO author_id;
  END IF;
END $$;
