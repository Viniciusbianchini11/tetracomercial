import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth } from "date-fns";

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

const toNumber = (v: any) => {
  if (v === null || v === undefined) return 0;
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v).replace(',', '.'));
  return isNaN(n) ? 0 : n;
};

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

      // Construir query base com filtros comuns
      let query = supabase
        .from("relatorio_faturamento")
        .select('"VALOR FATURADO (CHEIO)", "VALOR FINAL", "MÊS/ANO"')
        .eq("VENDEDOR", sellerName); // Usar eq exato, não ilike

      // Se temos startDate e endDate, usar eles
      if (filters?.startDate && filters?.endDate) {
        query = query
          .gte("DATA", format(filters.startDate, 'yyyy-MM-dd'))
          .lte("DATA", format(filters.endDate, 'yyyy-MM-dd'));
      } 
      // Se temos mês e ano sem datas explícitas, calcular o intervalo do mês
      else if (filters?.month && filters.month !== "all" && filters?.year && filters.year !== "all") {
        const year = parseInt(filters.year);
        const month = parseInt(filters.month) - 1; // Month é 0-indexed no Date
        const start = startOfMonth(new Date(year, month));
        const end = endOfMonth(new Date(year, month));
        query = query
          .gte("DATA", format(start, 'yyyy-MM-dd'))
          .lte("DATA", format(end, 'yyyy-MM-dd'));
      }

      // Filtro de ano (se não usamos no intervalo de mês acima)
      if (filters?.year && filters.year !== "all" && (!filters?.month || filters.month === "all")) {
        query = query.eq("ANO", parseInt(filters.year));
      }

      // Filtro de lançamento
      if (filters?.launch && filters.launch !== "all") {
        query = query.eq("LANÇAMENTO", filters.launch);
      }

      console.log('Query filters applied:', {
        sellerName,
        startDate: filters?.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null,
        endDate: filters?.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null,
        month: filters?.month,
        year: filters?.year,
        launch: filters?.launch
      });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching sales:', error);
        throw error;
      }

      console.log('Database returned:', data?.length, 'records');

      // Calcular agregações a partir dos dados retornados
      const faturamentoBruto = (data || []).reduce(
        (sum, sale) => sum + toNumber(sale["VALOR FATURADO (CHEIO)"]),
        0
      );

      const valorFinal = (data || []).reduce(
        (sum, sale) => sum + toNumber(sale["VALOR FINAL"]),
        0
      );

      const vendas = data?.length || 0;

      console.log('Calculated totals:', { 
        faturamentoBruto, 
        valorFinal, 
        vendas,
        firstRecord: data?.[0]
      });

      // Buscar leads para taxa de conversão
      const totalLeads = await fetchTotalLeads();
      const taxaConversao = totalLeads > 0 ? (vendas / totalLeads) * 100 : 0;

      setStats({
        faturamentoBruto,
        valorFinal,
        vendas,
        taxaConversao,
      });

      // Agrupar vendas por mês
      const salesByMonth = (data || []).reduce((acc: any, sale) => {
        const mesAno = sale["MÊS/ANO"] || "Sem data";
        if (!acc[mesAno]) {
          acc[mesAno] = {
            mes: mesAno,
            vendas: 0,
            faturamento: 0,
          };
        }
        acc[mesAno].vendas++;
        acc[mesAno].faturamento += toNumber(sale["VALOR FINAL"]);
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
