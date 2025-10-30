-- Enable RLS on resumo_filtros
ALTER TABLE public.resumo_filtros ENABLE ROW LEVEL SECURITY;

-- Create public SELECT policy
DROP POLICY IF EXISTS "Public can view resumo_filtros" ON public.resumo_filtros;

CREATE POLICY "Public can view resumo_filtros"
ON public.resumo_filtros
FOR SELECT
USING (true);