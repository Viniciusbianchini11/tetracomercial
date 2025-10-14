-- Enable RLS on resumo_funil table
ALTER TABLE public.resumo_funil ENABLE ROW LEVEL SECURITY;

-- Create public SELECT policy for resumo_funil
DROP POLICY IF EXISTS "Public can view resumo_funil" ON public.resumo_funil;
CREATE POLICY "Public can view resumo_funil"
  ON public.resumo_funil
  FOR SELECT
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_resumo_funil_data 
  ON public.resumo_funil (data_resumo);
  
CREATE INDEX IF NOT EXISTS idx_resumo_funil_tipo_vendedor_data 
  ON public.resumo_funil (tipo_resumo, dono_do_negocio, data_resumo);