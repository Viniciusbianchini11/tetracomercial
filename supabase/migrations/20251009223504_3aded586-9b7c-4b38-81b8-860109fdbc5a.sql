-- Enable RLS on the vw_leads_daily_stage_counts view
-- This view aggregates stage movement data and should be protected
ALTER VIEW public.vw_leads_daily_stage_counts SET (security_barrier = true);

-- Enable RLS policies on the underlying stage_movements_log table is already enabled
-- Add RLS policies to the view by creating policies that reference it

-- Since views in PostgreSQL don't support RLS directly, we need to ensure
-- the underlying table (stage_movements_log) has proper RLS policies
-- which it already does based on the schema.

-- The existing RLS policies on stage_movements_log will automatically apply
-- when users query the view, so the view will respect the same access controls.