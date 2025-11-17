import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TrafficDataItem {
  "Dia": string;
  "Valor gasto": number;
  "Alcançar": number;
  "Impressões": number;
  "Cliques em links": number;
  "Visualizações da página de destino": number;
  "Visualizações de vídeo de 3 segundos": number;
  "Pistas": number;
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
          amount_spent: acc.amount_spent + (Number(item["Valor gasto"]) || 0),
          reach: acc.reach + (Number(item["Alcançar"]) || 0),
          impressions: acc.impressions + (Number(item["Impressões"]) || 0),
          link_clicks: acc.link_clicks + (Number(item["Cliques em links"]) || 0),
          landing_page_views: acc.landing_page_views + (Number(item["Visualizações da página de destino"]) || 0),
          video_views_3s: acc.video_views_3s + (Number(item["Visualizações de vídeo de 3 segundos"]) || 0),
          leads: acc.leads + (Number(item["Pistas"]) || 0),
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
      const dailyData = rawData.map((item) => {
        const amountSpent = Number(item["Valor gasto"]) || 0;
        const leads = Number(item["Pistas"]) || 0;
        return {
          date: item["Dia"],
          amountSpent,
          leads,
          cpl: leads > 0 ? amountSpent / leads : 0,
        };
      });

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
