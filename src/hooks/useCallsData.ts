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

export const useCallsData = () => {
  const [callsData, setCallsData] = useState<CallsData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCallsData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ligacoes_diarias")
        .select("*")
        .order("data_referencia", { ascending: false })
        .limit(10);

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
  }, []);

  return { callsData, loading, refetch: fetchCallsData };
};
