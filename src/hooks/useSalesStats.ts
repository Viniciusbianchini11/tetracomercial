import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export const useSalesStats = (startDate?: Date | null, endDate?: Date | null) => {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesStats();
  }, [startDate, endDate]);

  const fetchSalesStats = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from("relatorio_faturamento").select("*");
      
      if (startDate) {
        query = query.gte("DATA", startDate.toISOString().split('T')[0]);
      }
      if (endDate) {
        query = query.lte("DATA", endDate.toISOString().split('T')[0]);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching sales stats:", error);
        toast.error("Erro ao carregar estatísticas");
        return;
      }

      if (!data) return;

      // Calcular estatísticas gerais
      const faturamentoBruto = data.reduce((sum, sale) => sum + (sale["VALOR FATURADO (CHEIO)"] || 0), 0);
      const vendas = data.length;
      
      // Contar pistas únicas (baseado em emails únicos)
      const uniqueEmails = new Set(data.map(sale => sale["E-MAIL"]).filter(Boolean));
      const pistas = uniqueEmails.size;
      
      // Taxa de conversão (vendas / pistas * 100)
      const taxaConversao = pistas > 0 ? (vendas / pistas) * 100 : 0;
      
      // Contar recorrentes (parcelas > 1)
      const recorrentes = data.filter(sale => {
        const parcela = sale.PARCELA;
        if (!parcela) return false;
        const num = parseInt(parcela.split('/')[0]);
        return num > 1;
      }).length;
      
      // Contar fora do lançamento
      const foraLancamento = data.filter(sale => sale.LANÇAMENTO !== "SIM").length;

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
      
      data.forEach(sale => {
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
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      
      const yesterdayData = data.filter(sale => sale.DATA === yesterdayStr);
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
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const todayData = data.filter(sale => sale.DATA === todayStr);
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
    loading,
  };
};
