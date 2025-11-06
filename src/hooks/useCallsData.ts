import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CallsData {
  id: string;
  data_referencia: string;
  nome_vendedor: string;
  tentativas: number;
  conexoes: number;
}

interface CallsFilters {
  startDate?: Date;
  endDate?: Date;
}

export const useCallsData = (filters?: CallsFilters) => {
  const [callsData, setCallsData] = useState<CallsData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCallsData = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("ligacoes_diarias")
        .select("*")
        .not("nome_vendedor", "ilike", "%gerente comercial%");

      // Aplicar filtros de data se fornecidos
      if (filters?.startDate) {
        query = query.gte("data_referencia", filters.startDate.toISOString().split('T')[0]);
      }
      if (filters?.endDate) {
        query = query.lte("data_referencia", filters.endDate.toISOString().split('T')[0]);
      }

      const { data, error } = await query
        .order("data_referencia", { ascending: false });

      if (error) {
        console.error("Error fetching calls data:", error);
        toast.error("Erro ao carregar dados de ligações");
        setCallsData([]);
        return;
      }

      // Filtro extra no cliente (case-insensitive e espaços) para garantir remoção
      const filtered = (data || []).filter((item: any) => {
        const n = (item.nome_vendedor || "").trim().toLowerCase();
        return n !== "gerente comercial" && !n.includes("gerente comercial");
      });

      // Agregar dados por vendedor quando houver múltiplos dias
      const aggregatedData = filtered.reduce((acc: CallsData[], item: any) => {
        const existing = acc.find(x => x.nome_vendedor === item.nome_vendedor);
        if (existing) {
          existing.tentativas += item.tentativas;
          existing.conexoes += item.conexoes;
        } else {
          acc.push({
            id: item.id,
            nome_vendedor: item.nome_vendedor,
            tentativas: item.tentativas,
            conexoes: item.conexoes,
            data_referencia: item.data_referencia
          });
        }
        return acc;
      }, [] as CallsData[]);

      setCallsData(aggregatedData);
    } catch (error) {
      console.error("Error fetching calls data:", error);
      toast.error("Erro ao carregar dados de ligações");
      setCallsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallsData();
  }, [filters?.startDate, filters?.endDate]);

  return { callsData, loading, refetch: fetchCallsData };
};
