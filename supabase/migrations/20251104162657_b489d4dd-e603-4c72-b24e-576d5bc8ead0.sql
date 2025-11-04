-- Criar tabela para armazenar dados de ligações (tentativas e conexões)
CREATE TABLE IF NOT EXISTS public.ligacoes_diarias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data_referencia DATE NOT NULL,
  nome_vendedor TEXT NOT NULL,
  tentativas INTEGER NOT NULL DEFAULT 0,
  conexoes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(data_referencia, nome_vendedor)
);

-- Índice para busca rápida por data
CREATE INDEX IF NOT EXISTS idx_ligacoes_diarias_data ON public.ligacoes_diarias(data_referencia DESC);

-- Índice para busca por vendedor
CREATE INDEX IF NOT EXISTS idx_ligacoes_diarias_vendedor ON public.ligacoes_diarias(nome_vendedor);

-- Comentários
COMMENT ON TABLE public.ligacoes_diarias IS 'Armazena dados diários de tentativas e conexões por vendedor';
COMMENT ON COLUMN public.ligacoes_diarias.data_referencia IS 'Data de referência dos dados (sempre 1 dia antes do upload)';
COMMENT ON COLUMN public.ligacoes_diarias.tentativas IS 'Número de tentativas de ligação';
COMMENT ON COLUMN public.ligacoes_diarias.conexoes IS 'Número de conexões realizadas';