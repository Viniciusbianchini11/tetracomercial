-- Remover políticas existentes de INSERT para ligacoes_diarias
DROP POLICY IF EXISTS "Admins can insert ligacoes_diarias" ON public.ligacoes_diarias;

-- Permitir INSERT público (qualquer um pode fazer upload de dados de ligações)
CREATE POLICY "Public can insert ligacoes_diarias"
ON public.ligacoes_diarias
FOR INSERT
TO public
WITH CHECK (true);

-- Permitir UPDATE público
CREATE POLICY "Public can update ligacoes_diarias"
ON public.ligacoes_diarias
FOR UPDATE
TO public
USING (true);

-- Manter DELETE apenas para admins
DROP POLICY IF EXISTS "Admins can delete ligacoes_diarias" ON public.ligacoes_diarias;