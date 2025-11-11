import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { normalizeSellerName, convertSalesDateFormat } from "@/lib/utils";

const ACTIVE_SELLERS = [
  "SABRINA",
  "BARBARA",
  "ALEXIA",
  "VLADMIR",
  "CELINA",
  "ELTON",
  "GEOVANNA",
  "THAYNARA",
  "WEMILLE",
  "KIMBERLY"
];

interface DailySale {
  seller: string;
  quantity: number;
  value: number;
  percentage: number;
  boletoPercentage: number;
  cartaoPercentage: number;
}

interface DailyCalls {
  seller: string;
  tentativas: number;
  conexoes: number;
}

interface DailyReport {
  date: string;
  sales: DailySale[];
  totalQuantity: number;
  totalValue: number;
  totalBoletoPercentage: number;
  totalCartaoPercentage: number;
  calls: DailyCalls[];
  totalTentativas: number;
  totalConexoes: number;
}

export const useDailyReports = () => {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyReports();
  }, []);

  const fetchDailyReports = async () => {
    try {
      setLoading(true);
      
      const { data: salesData, error } = await supabase
        .from("relatorio_faturamento")
        .select("DATA, VENDEDOR, PRODUTO, \"VALOR FINAL\", Plataforma")
        .not("DATA", "is", null)
        .not("VENDEDOR", "is", null)
        .order("DATA", { ascending: false });

      const { data: callsData } = await supabase
        .from("ligacoes_diarias")
        .select("data_referencia, nome_vendedor, tentativas, conexoes")
        .order("data_referencia", { ascending: false });

      if (error) {
        console.error("Error fetching sales data:", error);
        toast.error("Erro ao carregar relatórios");
        return;
      }

      console.info('[Reports] Exemplo venda mais recente', salesData?.[0]);
      console.info('[Reports] Exemplo ligação mais recente', callsData?.[0]);

      // Group by date
      const reportsByDate = new Map<string, DailyReport>();

      // Process calls data first to initialize dates
      callsData?.forEach((call) => {
        const date = call.data_referencia;
        
        if (!reportsByDate.has(date)) {
          reportsByDate.set(date, {
            date,
            sales: ACTIVE_SELLERS.map(s => ({
              seller: s,
              quantity: 0,
              value: 0,
              percentage: 0,
              boletoPercentage: 0,
              cartaoPercentage: 0
            })),
            totalQuantity: 0,
            totalValue: 0,
            totalBoletoPercentage: 0,
            totalCartaoPercentage: 0,
            calls: ACTIVE_SELLERS.map(s => ({
              seller: s,
              tentativas: 0,
              conexoes: 0
            })),
            totalTentativas: 0,
            totalConexoes: 0
          });
        }

        const report = reportsByDate.get(date)!;
        const seller = normalizeSellerName(call.nome_vendedor);
        const callIndex = report.calls.findIndex(c => c.seller === seller);

        // Always add to totals
        report.totalTentativas += call.tentativas || 0;
        report.totalConexoes += call.conexoes || 0;

        if (callIndex !== -1) {
          report.calls[callIndex].tentativas = call.tentativas || 0;
          report.calls[callIndex].conexoes = call.conexoes || 0;
        } else {
          console.debug('[Reports] Vendedor não mapeado em ligações:', call.nome_vendedor, '->', seller);
        }
      });

      salesData?.forEach((sale) => {
        const date = convertSalesDateFormat(sale.DATA);
        const seller = normalizeSellerName(sale.VENDEDOR);
        const value = Number(sale["VALOR FINAL"]) || 0;
        const isBoleto = sale.Plataforma?.toUpperCase() === "BOLETO";

        if (!reportsByDate.has(date)) {
          reportsByDate.set(date, {
            date,
            sales: ACTIVE_SELLERS.map(s => ({
              seller: s,
              quantity: 0,
              value: 0,
              percentage: 0,
              boletoPercentage: 0,
              cartaoPercentage: 0
            })),
            totalQuantity: 0,
            totalValue: 0,
            totalBoletoPercentage: 0,
            totalCartaoPercentage: 0,
            calls: ACTIVE_SELLERS.map(s => ({
              seller: s,
              tentativas: 0,
              conexoes: 0
            })),
            totalTentativas: 0,
            totalConexoes: 0
          });
        }

        const report = reportsByDate.get(date)!;
        const sellerIndex = report.sales.findIndex(s => s.seller === seller);

        if (sellerIndex !== -1) {
          report.sales[sellerIndex].quantity += 1;
          report.sales[sellerIndex].value += value;
          
          if (isBoleto) {
            report.sales[sellerIndex].boletoPercentage += value;
          } else {
            report.sales[sellerIndex].cartaoPercentage += value;
          }
        }

        report.totalQuantity += 1;
        report.totalValue += value;
      });

      // Calculate percentages
      reportsByDate.forEach((report) => {
        let totalBoleto = 0;
        let totalCartao = 0;

        report.sales.forEach((sale) => {
          if (report.totalValue > 0) {
            sale.percentage = (sale.value / report.totalValue) * 100;
            
            if (sale.value > 0) {
              sale.boletoPercentage = (sale.boletoPercentage / sale.value) * 100;
              sale.cartaoPercentage = (sale.cartaoPercentage / sale.value) * 100;
            }
          }
          
          totalBoleto += sale.boletoPercentage;
          totalCartao += sale.cartaoPercentage;
        });

        // Calculate total payment method percentages
        const activeSellersCount = report.sales.filter(s => s.quantity > 0).length;
        if (activeSellersCount > 0) {
          report.totalBoletoPercentage = totalBoleto / activeSellersCount;
          report.totalCartaoPercentage = totalCartao / activeSellersCount;
        }
      });

      setReports(Array.from(reportsByDate.values()));
    } catch (error) {
      console.error("Error fetching daily reports:", error);
      toast.error("Erro ao carregar relatórios");
    } finally {
      setLoading(false);
    }
  };

  return { reports, loading };
};
