import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Helper to parse numbers that may come in Brazilian format (e.g., "1.234,56")
const parseNumberBR = (value: unknown): number => {
  if (typeof value === "number") return isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const cleaned = value
      .trim()
      .replace(/\./g, "")
      .replace(/,/g, ".")
      .replace(/[^\d.-]/g, "");
    const n = parseFloat(cleaned);
    return isFinite(n) ? n : 0;
  }
  return 0;
};

// Helper to pick a value from an object using multiple possible keys (PT/EN)
const pick = (obj: any, keys: string[]): any => {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return null;
};

// Helper to get a number from an object using multiple possible keys
const getNum = (obj: any, keys: string[]): number => {
  return parseNumberBR(pick(obj, keys));
};

// Helper to normalize date from various field names to YYYY-MM-DD
const normalizeDate = (obj: any): string => {
  const rawDate = String(pick(obj, ["Dia", "Day", "Data de Criação", "Date Created"]) ?? "").trim();
  
  // Check if it's already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return rawDate;
  }
  
  return "";
};

interface TrafficDataItem {
  [key: string]: any;
}

interface TrafficMetrics {
  valorGasto: number;
  alcance: number;
  frequencia: number;
  view3s: number;
  ctr: number;
  cpm: number;
  leads: number;
  cpl: number;
  impressoes: number;
  cliquesLink: number;
  txPageView: number;
  conversao: number;
  dailyData: Array<{
    date: string;
    amountSpent: number;
    leads: number;
    cpl: number;
  }>;
}

export const useTrafficData = () => {
  const [data, setData] = useState<TrafficMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTrafficData = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://n8n-hook.tetraeducacao.com.br/webhook/trafego");
      
      if (!response.ok) {
        throw new Error("Erro ao buscar dados de tráfego");
      }

      const rawData: TrafficDataItem[] = await response.json();

      // Calculate aggregated metrics
      const totals = rawData.reduce(
        (acc, item) => ({
          amount_spent: acc.amount_spent + getNum(item, ["Valor gasto", "Amount Spent"]),
          reach: acc.reach + getNum(item, ["Alcançar", "Reach"]),
          impressions: acc.impressions + getNum(item, ["Impressões", "Impressions"]),
          link_clicks: acc.link_clicks + getNum(item, ["Cliques em links", "Link Clicks"]),
          landing_page_views: acc.landing_page_views + getNum(item, ["Visualizações da página de destino", "Landing Page Views"]),
          video_views_3s: acc.video_views_3s + getNum(item, ["Visualizações de vídeo de 3 segundos", "3-Second Video Views"]),
          leads: acc.leads + getNum(item, ["Pistas", "Leads"]),
        }),
        {
          amount_spent: 0,
          reach: 0,
          impressions: 0,
          link_clicks: 0,
          landing_page_views: 0,
          video_views_3s: 0,
          leads: 0,
        }
      );

      // Calculate metrics
      const frequencia = totals.reach > 0 ? totals.impressions / totals.reach : 0;
      const view3s = totals.impressions > 0 ? totals.video_views_3s / totals.impressions : 0;
      const ctr = totals.impressions > 0 ? (totals.link_clicks / totals.impressions) * 100 : 0;
      const cpm = totals.impressions > 0 ? (totals.amount_spent / totals.impressions) * 1000 : 0;
      const cpl = totals.leads > 0 ? totals.amount_spent / totals.leads : 0;
      const txPageView = totals.link_clicks > 0 ? totals.landing_page_views / totals.link_clicks : 0;
      const conversao = totals.landing_page_views > 0 ? (totals.leads / totals.landing_page_views) * 100 : 0;

      // Prepare daily data for chart
      const dailyData = rawData
        .map((item) => {
          const amountSpent = getNum(item, ["Valor gasto", "Amount Spent"]);
          const leads = getNum(item, ["Pistas", "Leads"]);
          const date = normalizeDate(item);
          return {
            date,
            amountSpent,
            leads,
            cpl: leads > 0 ? amountSpent / leads : 0,
          };
        })
        .filter((d) => d.date);

      setData({
        valorGasto: totals.amount_spent,
        alcance: totals.reach,
        frequencia,
        view3s,
        ctr,
        cpm,
        leads: totals.leads,
        cpl,
        impressoes: totals.impressions,
        cliquesLink: totals.link_clicks,
        txPageView,
        conversao,
        dailyData,
      });

      toast({
        title: "Dados atualizados",
        description: "Os dados de tráfego foram atualizados com sucesso.",
      });
    } catch (error) {
      console.error("Error fetching traffic data:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível buscar os dados de tráfego.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetchTrafficData,
  };
};
