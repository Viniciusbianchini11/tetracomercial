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
        .select("*");

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

      setCallsData(data || []);
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
