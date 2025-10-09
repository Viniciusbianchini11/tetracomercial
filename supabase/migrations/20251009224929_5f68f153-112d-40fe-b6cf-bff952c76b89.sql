-- Enable public read access to all funnel tables
CREATE POLICY "Public can view entrounofunil"
ON public.entrounofunil
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public can view contato_prospeccao"
ON public.contato_prospeccao
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public can view contato_conexao"
ON public.contato_conexao
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public can view contato_negociacao"
ON public.contato_negociacao
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public can view contato_agendado"
ON public.contato_agendado
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public can view contato_fechado"
ON public.contato_fechado
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public can view contato_status_ganho"
ON public.contato_status_ganho
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public can view contato_status_perdido"
ON public.contato_status_perdido
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public can view leads"
ON public.leads
FOR SELECT
TO anon
USING (true);