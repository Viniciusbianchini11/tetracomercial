import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SalesRecord {
  id: number;
  NOME: string | null;
  "E-MAIL": string | null;
  TELEFONE: string | null;
  VENDEDOR: string | null;
  PRODUTO: string | null;
  "VALOR RECEBIDO": number | null;
  "VALOR FATURADO": number | null;
  "VALOR FINAL": number | null;
  "VALOR BASE PREMIACAO": number | null;
  DATA: string | null;
  "MÊS/ANO": string | null;
}

export const useSalesData = () => {
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("relatorio_faturamento")
        .select("id, NOME, \"E-MAIL\", TELEFONE, VENDEDOR, PRODUTO, \"VALOR RECEBIDO\", \"VALOR FATURADO\", \"VALOR FINAL\", \"VALOR BASE PREMIACAO\", DATA, \"MÊS/ANO\", \"FORMA DE PAGAMENTO\"")
        .order("DATA", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching sales data:", error);
        if (error.message && error.message.length > 0) {
          toast.error(`Erro ao carregar vendas: ${error.message}`);
        }
        setSalesData([]);
        return;
      }

      setSalesData(data || []);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      toast.error("Erro ao carregar dados de vendas");
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  return { salesData, loading };
};
