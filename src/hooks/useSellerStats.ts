import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth } from "date-fns";

interface SellerStats {
  faturamentoBruto: number;
  valorFinal: number;
  vendas: number;
  taxaConversao: number;
  tempoMedioConversao: number; // em dias
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
    tempoMedioConversao: 0,
  });
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (filters?.sellerEmail) {
      fetchSellerStats();
    }
  }, [filters?.sellerEmail, filters?.startDate, filters?.endDate, filters?.month, filters?.year, filters?.launch]);

  const getPhoneLast8Digits = (phone: string | null): string | null => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, ''); // Remove tudo que não é número
    return digits.slice(-8); // Pega os últimos 8 dígitos (DDD + número)
  };

  const calculateAverageConversionTime = async (
    sales: any[], 
    sellerEmail: string
  ): Promise<number> => {
    try {
      // Extrair o nome do vendedor do email
      const sellerName = sellerEmail.split('@')[0].split('.')[0].toUpperCase();
      
      // Buscar registros de entrounofunil do vendedor
      const { data: funnelEntries, error } = await supabase
        .from("entrounofunil")
        .select("data_de_entrada_na_etapa, nome, email, telefone, dono_do_negocio")
        .ilike("dono_do_negocio", `%${sellerName}%`);

      if (error) {
        console.error('Error fetching funnel entries:', error);
        return 0;
      }

      if (!funnelEntries || funnelEntries.length === 0) {
        console.log('No funnel entries found for seller');
        return 0;
      }

      console.log(`Found ${funnelEntries.length} funnel entries for seller`);
      console.log('Sample funnel entries:', funnelEntries.slice(0, 3));

      const conversionTimes: number[] = [];
      let matchStats = {
        byEmail: 0,
        byName: 0,
        byPhone: 0,
        noMatch: 0,
        negativeTime: 0
      };

      for (const sale of sales) {
        const saleEmail = sale["E-MAIL"]?.toLowerCase().trim();
        const saleName = sale["NOME"]?.toLowerCase().trim();
        const salePhone = getPhoneLast8Digits(sale["TELEFONE"]);
        const saleDate = new Date(sale["DATA"]);

        // Match se QUALQUER UM dos critérios for atendido (OU lógico)
        const matchedEntry = funnelEntries.find(entry => {
          const emailMatch = saleEmail && entry.email && 
            entry.email.toLowerCase().trim() === saleEmail;
          
          const nameMatch = saleName && entry.nome && 
            entry.nome.toLowerCase().trim() === saleName;
          
          const phoneMatch = salePhone && 
            getPhoneLast8Digits(entry.telefone) === salePhone;
          
          return emailMatch || nameMatch || phoneMatch;
        });

        // Se encontrou match, calcular tempo de conversão
        if (matchedEntry && matchedEntry.data_de_entrada_na_etapa) {
          const entryDate = new Date(matchedEntry.data_de_entrada_na_etapa);
          const diffTime = saleDate.getTime() - entryDate.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          
          if (diffDays < 0) {
            console.warn(`Venda antes da entrada no funil: ${diffDays.toFixed(1)} dias`);
            matchStats.negativeTime++;
            // Considerar como conversão imediata
            conversionTimes.push(0);
          } else {
            conversionTimes.push(diffDays);
          }

          // Identificar tipo de match para estatísticas
          if (saleEmail && matchedEntry.email?.toLowerCase().trim() === saleEmail) {
            matchStats.byEmail++;
          } else if (saleName && matchedEntry.nome?.toLowerCase().trim() === saleName) {
            matchStats.byName++;
          } else if (salePhone && getPhoneLast8Digits(matchedEntry.telefone) === salePhone) {
            matchStats.byPhone++;
          }
        } else {
          matchStats.noMatch++;
        }
      }

      console.log('Match statistics:', matchStats);
      console.log(`Conversion times found: ${conversionTimes.length}/${sales.length} sales`);

      // Calcular média
      if (conversionTimes.length === 0) {
        console.log('No conversion times calculated');
        return 0;
      }

      const average = conversionTimes.reduce((a, b) => a + b, 0) / conversionTimes.length;
      console.log(`Average conversion time: ${average.toFixed(1)} dias`);
      
      return Math.round(average); // Arredondar para dias inteiros
    } catch (error) {
      console.error('Error calculating average conversion time:', error);
      return 0;
    }
  };

  const fetchSellerStats = async () => {
    try {
      setLoading(true);

      // Extrair o nome do vendedor do email (primeira parte antes do ponto)
      const sellerName = filters?.sellerEmail?.split('@')[0].split('.')[0].toUpperCase();
      
      console.log('Fetching sales for seller:', sellerName, 'from email:', filters?.sellerEmail);

      // Construir query base com filtros comuns
      let query = supabase
        .from("relatorio_faturamento")
        .select('"VALOR FATURADO (CHEIO)", "VALOR FINAL", "MÊS/ANO", "E-MAIL", NOME, TELEFONE, DATA')
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

      // Calcular tempo médio de conversão
      const tempoMedioConversao = await calculateAverageConversionTime(
        data || [], 
        filters?.sellerEmail || ''
      );

      setStats({
        faturamentoBruto,
        valorFinal,
        vendas,
        taxaConversao,
        tempoMedioConversao,
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
