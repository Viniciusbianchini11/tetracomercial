import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SellerStats {
  faturamentoBruto: number;
  valorFinal: number;
  vendas: number;
  taxaConversao: number;
}

interface MonthlySales {
  mes: string;
  vendas: number;
  faturamento: number;
}

interface SellerStatsFilters {
  sellerEmail?: string;
  startDate?: Date;
  endDate?: Date;
  month?: string;
  year?: string;
  launch?: string;
}

export const useSellerStats = (filters?: SellerStatsFilters) => {
  const [stats, setStats] = useState<SellerStats>({
    faturamentoBruto: 0,
    valorFinal: 0,
    vendas: 0,
    taxaConversao: 0,
  });
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (filters?.sellerEmail) {
      fetchSellerStats();
    }
  }, [filters?.sellerEmail, filters?.startDate, filters?.endDate, filters?.month, filters?.year, filters?.launch]);

  const fetchSellerStats = async () => {
    try {
      setLoading(true);

      // Extrair o nome do vendedor do email (primeira parte antes do ponto)
      const sellerName = filters?.sellerEmail?.split('@')[0].split('.')[0].toUpperCase();
      
      console.log('Fetching sales for seller:', sellerName, 'from email:', filters?.sellerEmail);

      let query = supabase
        .from("relatorio_faturamento")
        .select("*")
        .ilike("VENDEDOR", `%${sellerName}%`);

      if (filters?.startDate) {
        query = query.gte("DATA", filters.startDate.toISOString().split('T')[0]);
      }
      if (filters?.endDate) {
        query = query.lte("DATA", filters.endDate.toISOString().split('T')[0]);
      }
      if (filters?.year && filters.year !== "all") {
        query = query.eq("ANO", parseInt(filters.year));
      }
      if (filters?.launch && filters.launch !== "all") {
        query = query.eq("LANÇAMENTO", filters.launch);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching sales:', error);
        throw error;
      }
      
      console.log('Sales data fetched:', data?.length, 'records');
      
      if (!data) return;

      let filteredData = [...data];
      
      if (filters?.month && filters.month !== "all" && !filters?.startDate && !filters?.endDate) {
        filteredData = filteredData.filter(sale => {
          if (!sale.DATA) return false;
          const saleMonth = sale.DATA.split('-')[1];
          return saleMonth === filters.month;
        });
      }

      const faturamentoBruto = filteredData.reduce(
        (sum, sale) => sum + (sale["VALOR FATURADO (CHEIO)"] || 0),
        0
      );

      const valorFinal = filteredData.reduce(
        (sum, sale) => sum + (sale["VALOR FINAL"] || 0),
        0
      );

      const vendas = filteredData.length;

      const totalLeads = await fetchTotalLeads();
      const taxaConversao = totalLeads > 0 ? (vendas / totalLeads) * 100 : 0;

      console.log('Stats calculated:', { faturamentoBruto, valorFinal, vendas, taxaConversao, totalLeads });

      setStats({
        faturamentoBruto,
        valorFinal,
        vendas,
        taxaConversao,
      });

      // Agrupar vendas por mês
      const salesByMonth = filteredData.reduce((acc: any, sale) => {
        const mesAno = sale["MÊS/ANO"] || "Sem data";
        if (!acc[mesAno]) {
          acc[mesAno] = {
            mes: mesAno,
            vendas: 0,
            faturamento: 0,
          };
        }
        acc[mesAno].vendas++;
        acc[mesAno].faturamento += sale["VALOR FINAL"] || 0;
        return acc;
      }, {});

      setMonthlySales(Object.values(salesByMonth));
    } catch (error) {
      console.error("Error fetching seller stats:", error);
      toast.error("Erro ao carregar estatísticas do vendedor");
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalLeads = async () => {
    try {
      const { count } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("dono_do_negocio", filters?.sellerEmail);

      return count || 0;
    } catch (error) {
      console.error("Error fetching total leads:", error);
      return 0;
    }
  };

  return { stats, monthlySales, loading };
};
