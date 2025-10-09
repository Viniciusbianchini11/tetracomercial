-- Enable public read access to sales data
CREATE POLICY "Public can view relatorio_faturamento"
ON public.relatorio_faturamento
FOR SELECT
TO anon
USING (true);