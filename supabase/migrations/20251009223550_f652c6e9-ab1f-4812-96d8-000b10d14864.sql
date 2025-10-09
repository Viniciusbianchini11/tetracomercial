-- Fix the security definer view issue by enabling security_invoker
-- This ensures the view respects RLS policies and runs with the permissions
-- of the querying user, not the view creator

ALTER VIEW public.vw_leads_daily_stage_counts SET (security_invoker = on);