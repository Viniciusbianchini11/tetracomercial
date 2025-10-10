-- Adicionar política pública para leads_daily_snapshot
CREATE POLICY "Public can view leads_daily_snapshot"
ON public.leads_daily_snapshot
FOR SELECT
USING (true);