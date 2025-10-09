-- Fix remaining security issues

-- Add RLS policies for stage_movements_log
CREATE POLICY "Admins can view all stage_movements_log" 
  ON public.stage_movements_log FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view all stage_movements_log" 
  ON public.stage_movements_log FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Viewers can view all stage_movements_log" 
  ON public.stage_movements_log FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'viewer'));

-- Add RLS policies for leads_daily_snapshot
CREATE POLICY "Admins can view all leads_daily_snapshot" 
  ON public.leads_daily_snapshot FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can view all leads_daily_snapshot" 
  ON public.leads_daily_snapshot FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Viewers can view all leads_daily_snapshot" 
  ON public.leads_daily_snapshot FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'viewer'));

-- Fix remaining functions with mutable search paths
CREATE OR REPLACE FUNCTION public.populate_leads_daily_snapshot(p_date date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.leads_daily_snapshot(snapshot_date, stage_name, dono_do_negocio, action, cnt)
  SELECT p_date::date AS snapshot_date,
         COALESCE(s.stage_name, 'unknown') AS stage_name,
         l.dono_do_negocio,
         s.action,
         COUNT(*) AS cnt
  FROM public.stage_movements_log s
  LEFT JOIN public.leads l ON l.id = s.lead_id
  WHERE (s.created_at AT TIME ZONE 'UTC')::date = p_date
  GROUP BY COALESCE(s.stage_name, 'unknown'), l.dono_do_negocio, s.action
  ON CONFLICT (snapshot_date, stage_name, dono_do_negocio, action) DO UPDATE SET cnt = EXCLUDED.cnt, created_at = now();
END;
$function$;

CREATE OR REPLACE FUNCTION public.populate_leads_snapshot_yesterday()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT public.populate_leads_daily_snapshot((now() AT TIME ZONE 'UTC')::date - 1);
$function$;

CREATE OR REPLACE FUNCTION public.get_funnel_counts()
RETURNS TABLE(etapa text, quantidade bigint)
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 'entrounofunil'::TEXT AS etapa, COUNT(*) AS quantidade FROM public.entrounofunil
  UNION ALL
  SELECT 'prospecção'::TEXT, COUNT(*) FROM public.contato_prospeccao
  UNION ALL
  SELECT 'conexão'::TEXT, COUNT(*) FROM public.contato_conexao
  UNION ALL
  SELECT 'negociação'::TEXT, COUNT(*) FROM public.contato_negociacao
  UNION ALL
  SELECT 'agendado'::TEXT, COUNT(*) FROM public.contato_agendado
  UNION ALL
  SELECT 'fechado'::TEXT, COUNT(*) FROM public.contato_fechado
  UNION ALL
  SELECT 'ganho'::TEXT, COUNT(*) FROM public.contato_status_ganho
  UNION ALL
  SELECT 'perdido'::TEXT, COUNT(*) FROM public.contato_status_perdido;
END;
$function$;