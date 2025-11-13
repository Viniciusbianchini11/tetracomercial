import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Helper functions para trabalhar com datas independente do formato
const parseDbDate = (dateStr: string): Date => {
  const [y, d, m] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const isSameLocalDate = (dateStr: string | null, target: Date): boolean => {
  if (!dateStr) return false;
  const dbDate = parseDbDate(dateStr);
  return (
    dbDate.getFullYear() === target.getFullYear() &&
    dbDate.getMonth() === target.getMonth() &&
    dbDate.getDate() === target.getDate()
  );
};

const getMonthFromDbDate = (dateStr: string): string => {
  const date = parseDbDate(dateStr);
  return String(date.getMonth() + 1).padStart(2, '0');
};

interface SalesStats {
  faturamentoBruto: number;
  pistas: number;
  vendas: number;
  taxaConversao: number;
  recorrentes: number;
  foraLancamento: number;
}

interface SellerRanking {
  vendedor: string;
  vendas: number;
  faturamento: number;
}

interface DailySales {
  vendas: number;
  faturamento: number;
  faturamentoFinal?: number;
  porVendedor: Array<{
    vendedor: string;
    vendas: number;
    faturamento: number;
    faturamentoFinal?: number;
  }>;
}

interface MonthlyReportData {
  sales: Array<{
    seller: string;
    quantity: number;
    value: number;
    percentage: number;
    boletoPercentage: number;
    cartaoPercentage: number;
  }>;
  calls: Array<{
    seller: string;
    tentativas: number;
    conexoes: number;
  }>;
}

interface SalesStatsFilters {
  startDate?: Date | null;
  endDate?: Date | null;
  month?: string;
  year?: string;
  launch?: string;
}

export const useSalesStats = (filters?: SalesStatsFilters) => {
  const [stats, setStats] = useState<SalesStats>({
    faturamentoBruto: 0,
    pistas: 0,
    vendas: 0,
    taxaConversao: 0,
    recorrentes: 0,
    foraLancamento: 0,
  });
  const [topSellers, setTopSellers] = useState<SellerRanking[]>([]);
  const [monthlyRanking, setMonthlyRanking] = useState<SellerRanking[]>([]);
  const [yesterdaySales, setYesterdaySales] = useState<DailySales>({ vendas: 0, faturamento: 0, porVendedor: [] });
  const [todaySales, setTodaySales] = useState<DailySales>({ vendas: 0, faturamento: 0, porVendedor: [] });
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReportData>({ sales: [], calls: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesStats();
  }, [filters?.startDate, filters?.endDate, filters?.month, filters?.year, filters?.launch]);

  const fetchSalesStats = async () => {
    try {
      setLoading(true);
      
      // Buscar pistas da tabela entrounofunil
      let pistasQuery = supabase
        .from("entrounofunil")
        .select("*", { count: 'exact', head: true });

      // Aplicar os mesmos filtros de data para pistas
      if (filters?.startDate) {
        pistasQuery = pistasQuery.gte("data_de_criacao", filters.startDate.toISOString().split('T')[0]);
      }
      if (filters?.endDate) {
        pistasQuery = pistasQuery.lte("data_de_criacao", filters.endDate.toISOString().split('T')[0]);
      }

      const { count: pistasCount } = await pistasQuery;
      
      // Query simples - buscar tudo
      let query = supabase.from("relatorio_faturamento").select("*");
      
      // Aplicar filtros se existirem
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
        console.error("Error fetching sales stats:", error);
        toast.error("Erro ao carregar vendas");
        setLoading(false);
        return;
      }

      if (!data) {
        setLoading(false);
        return;
      }

      // Filtro de mês (apenas se especificado)
      let filteredData = data;
      if (filters?.month && filters.month !== "all") {
        filteredData = data.filter(sale => {
          if (!sale.DATA) return false;
          const saleMonth = getMonthFromDbDate(sale.DATA);
          return saleMonth === filters.month;
        });
      }

      // Calcular estatísticas gerais
      const faturamentoBruto = filteredData.reduce((sum, sale) => sum + (sale["VALOR FATURADO (CHEIO)"] || 0), 0);
      const vendas = filteredData.length;
      
      // Usar pistas da tabela entrounofunil
      const pistas = pistasCount || 0;
      
      // Taxa de conversão (vendas / pistas * 100)
      const taxaConversao = pistas > 0 ? (vendas / pistas) * 100 : 0;
      
      // Contar recorrentes (parcelas > 1)
      const recorrentes = filteredData.filter(sale => {
        const parcela = sale.PARCELA;
        if (!parcela) return false;
        const num = parseInt(parcela.split('/')[0]);
        return num > 1;
      }).length;
      
      // Contar fora do lançamento
      const foraLancamento = filteredData.filter(sale => 
        sale.LANÇAMENTO && sale.LANÇAMENTO.toUpperCase() === "FORA LANÇAMENTO"
      ).length;

      setStats({
        faturamentoBruto,
        pistas,
        vendas,
        taxaConversao,
        recorrentes,
        foraLancamento,
      });

      // Calcular ranking de vendedores (usando VALOR FIINAL)
      const sellerMap = new Map<string, { vendas: number; faturamento: number }>();
      
      filteredData.forEach(sale => {
        const vendedor = sale.VENDEDOR || "Sem vendedor";
        const valorFinal = sale["VALOR FIINAL"] || sale["VALOR FINAL"] || 0;
        const current = sellerMap.get(vendedor) || { vendas: 0, faturamento: 0 };
        sellerMap.set(vendedor, {
          vendas: current.vendas + 1,
          faturamento: current.faturamento + valorFinal,
        });
      });

      const ranking = Array.from(sellerMap.entries())
        .map(([vendedor, stats]) => ({
          vendedor,
          vendas: stats.vendas,
          faturamento: stats.faturamento,
        }))
        .sort((a, b) => b.faturamento - a.faturamento);

      setTopSellers(ranking.slice(0, 3));
      setMonthlyRanking(ranking.slice(0, 10));

      // Calcular vendas de ontem (usando data local)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const yesterdayData = filteredData.filter(sale => sale.DATA && isSameLocalDate(sale.DATA, yesterday));
      const yesterdayByVendedor = new Map<string, { vendas: number; faturamento: number }>();
      
      yesterdayData.forEach(sale => {
        const vendedor = sale.VENDEDOR || "Sem vendedor";
        const valorFinal = sale["VALOR FIINAL"] || sale["VALOR FINAL"] || 0;
        const current = yesterdayByVendedor.get(vendedor) || { vendas: 0, faturamento: 0 };
        yesterdayByVendedor.set(vendedor, {
          vendas: current.vendas + 1,
          faturamento: current.faturamento + valorFinal,
        });
      });

      setYesterdaySales({
        vendas: yesterdayData.length,
        faturamento: yesterdayData.reduce((sum, sale) => sum + (sale["VALOR FIINAL"] || sale["VALOR FINAL"] || 0), 0),
        porVendedor: Array.from(yesterdayByVendedor.entries())
          .map(([vendedor, stats]) => ({
            vendedor,
            vendas: stats.vendas,
            faturamento: stats.faturamento,
          }))
          .sort((a, b) => b.vendas - a.vendas),
      });

      // Calcular vendas de hoje (VALOR FATURADO (CHEIO) + VALOR FIINAL) - usando data local
      const today = new Date();
      const todayData = filteredData.filter(sale => sale.DATA && isSameLocalDate(sale.DATA, today));
      const todayByVendedor = new Map<string, { vendas: number; faturamento: number; faturamentoFinal: number }>();
      
      todayData.forEach(sale => {
        const vendedor = sale.VENDEDOR || "Sem vendedor";
        const valorFinal = sale["VALOR FIINAL"] || sale["VALOR FINAL"] || 0;
        const current = todayByVendedor.get(vendedor) || { vendas: 0, faturamento: 0, faturamentoFinal: 0 };
        todayByVendedor.set(vendedor, {
          vendas: current.vendas + 1,
          faturamento: current.faturamento + (sale["VALOR FATURADO (CHEIO)"] || 0),
          faturamentoFinal: current.faturamentoFinal + valorFinal,
        });
      });

      setTodaySales({
        vendas: todayData.length,
        faturamento: todayData.reduce((sum, sale) => sum + (sale["VALOR FATURADO (CHEIO)"] || 0), 0),
        faturamentoFinal: todayData.reduce((sum, sale) => sum + (sale["VALOR FIINAL"] || sale["VALOR FINAL"] || 0), 0),
        porVendedor: Array.from(todayByVendedor.entries())
          .map(([vendedor, stats]) => ({
            vendedor,
            vendas: stats.vendas,
            faturamento: stats.faturamento,
            faturamentoFinal: stats.faturamentoFinal,
          }))
          .sort((a, b) => b.vendas - a.vendas),
      });

      // Calcular dados do mês atual
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const monthlyData = data.filter(sale => {
        if (!sale.DATA) return false;
        const saleDate = parseDbDate(sale.DATA);
        return saleDate.getMonth() + 1 === currentMonth && saleDate.getFullYear() === currentYear;
      });

      // Agrupar vendas por vendedor
      const monthlySellerMap = new Map<string, {
        quantity: number;
        value: number;
        boleto: number;
        cartao: number;
        total: number;
      }>();

      monthlyData.forEach(sale => {
        const vendedor = sale.VENDEDOR || "Sem vendedor";
        const valorFinal = sale["VALOR FIINAL"] || sale["VALOR FINAL"] || 0;
        const plataforma = sale.Plataforma?.toUpperCase() || "";
        
        const current = monthlySellerMap.get(vendedor) || {
          quantity: 0,
          value: 0,
          boleto: 0,
          cartao: 0,
          total: 0,
        };

        monthlySellerMap.set(vendedor, {
          quantity: current.quantity + 1,
          value: current.value + valorFinal,
          boleto: current.boleto + (plataforma.includes("BOLETO") ? 1 : 0),
          cartao: current.cartao + (plataforma.includes("CARTÃO") || plataforma.includes("CARTAO") ? 1 : 0),
          total: current.total + 1,
        });
      });

      const totalMonthlyValue = Array.from(monthlySellerMap.values()).reduce((sum, s) => sum + s.value, 0);

      // Buscar ligações do mês
      const { data: callsData } = await supabase
        .from("ligacoes_diarias")
        .select("*")
        .gte("data_referencia", `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`)
        .lt("data_referencia", `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`);

      const callsMap = new Map<string, { tentativas: number; conexoes: number }>();
      
      callsData?.forEach(call => {
        const seller = call.nome_vendedor || "Sem vendedor";
        const current = callsMap.get(seller) || { tentativas: 0, conexoes: 0 };
        callsMap.set(seller, {
          tentativas: current.tentativas + (call.tentativas || 0),
          conexoes: current.conexoes + (call.conexoes || 0),
        });
      });

      // Combinar dados de vendas e ligações
      const allSellers = new Set([
        ...Array.from(monthlySellerMap.keys()),
        ...Array.from(callsMap.keys())
      ]);

      const monthlySalesData = Array.from(allSellers).map(seller => {
        const salesInfo = monthlySellerMap.get(seller) || { quantity: 0, value: 0, boleto: 0, cartao: 0, total: 0 };
        const boletoPercentage = salesInfo.total > 0 ? (salesInfo.boleto / salesInfo.total) * 100 : 0;
        const cartaoPercentage = salesInfo.total > 0 ? (salesInfo.cartao / salesInfo.total) * 100 : 0;
        
        return {
          seller,
          quantity: salesInfo.quantity,
          value: salesInfo.value,
          percentage: totalMonthlyValue > 0 ? (salesInfo.value / totalMonthlyValue) * 100 : 0,
          boletoPercentage,
          cartaoPercentage,
        };
      }).sort((a, b) => b.value - a.value);

      const monthlyCallsData = Array.from(allSellers).map(seller => {
        const callsInfo = callsMap.get(seller) || { tentativas: 0, conexoes: 0 };
        return {
          seller,
          tentativas: callsInfo.tentativas,
          conexoes: callsInfo.conexoes,
        };
      }).sort((a, b) => b.conexoes - a.conexoes);

      setMonthlyReport({
        sales: monthlySalesData,
        calls: monthlyCallsData,
      });

    } catch (error) {
      console.error("Error fetching sales stats:", error);
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    topSellers,
    monthlyRanking,
    yesterdaySales,
    todaySales,
    monthlyReport,
    loading,
  };
};
