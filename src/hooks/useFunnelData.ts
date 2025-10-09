import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FunnelData {
  entrouNoFunil: number;
  prospeccao: number;
  conexao: number;
  negociacao: number;
  agendado: number;
  fechado: number;
  ganho: number;
  perdido: number;
}

interface Filters {
  seller: string;
  origin: string;
  tag: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

type TableName =
  | "entrounofunil"
  | "contato_prospeccao"
  | "contato_conexao"
  | "contato_negociacao"
  | "contato_agendado"
  | "contato_fechado"
  | "contato_status_ganho"
  | "contato_status_perdido";

export const useFunnelData = (filters: Filters) => {
  const [funnelData, setFunnelData] = useState<FunnelData>({
    entrouNoFunil: 0,
    prospeccao: 0,
    conexao: 0,
    negociacao: 0,
    agendado: 0,
    fechado: 0,
    ganho: 0,
    perdido: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunnelData();
  }, [filters]);

  const buildQuery = (tableName: TableName) => {
    let query = supabase.from(tableName).select("*", { count: "exact", head: true });

    if (filters.seller !== "all") {
      query = query.eq("dono_do_negocio", filters.seller);
    }

    if (filters.origin !== "all") {
      query = query.eq("origem", filters.origin);
    }

    if (filters.tag !== "all") {
      query = query.ilike("tags", `%${filters.tag}%`);
    }

    if (filters.startDate) {
      query = query.gte("data_de_criacao", filters.startDate.toISOString());
    }

    if (filters.endDate) {
      const endOfDay = new Date(filters.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      query = query.lte("data_de_criacao", endOfDay.toISOString());
    }

    return query;
  };

  const fetchFunnelData = async () => {
    try {
      setLoading(true);

      const [
        entrouNoFunilResult,
        prospeccaoResult,
        conexaoResult,
        negociacaoResult,
        agendadoResult,
        fechadoResult,
        ganhoResult,
        perdidoResult,
      ] = await Promise.all([
        buildQuery("entrounofunil"),
        buildQuery("contato_prospeccao"),
        buildQuery("contato_conexao"),
        buildQuery("contato_negociacao"),
        buildQuery("contato_agendado"),
        buildQuery("contato_fechado"),
        buildQuery("contato_status_ganho"),
        buildQuery("contato_status_perdido"),
      ]);

      setFunnelData({
        entrouNoFunil: entrouNoFunilResult.count || 0,
        prospeccao: prospeccaoResult.count || 0,
        conexao: conexaoResult.count || 0,
        negociacao: negociacaoResult.count || 0,
        agendado: agendadoResult.count || 0,
        fechado: fechadoResult.count || 0,
        ganho: ganhoResult.count || 0,
        perdido: perdidoResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching funnel data:", error);
      toast.error("Erro ao carregar dados do funil");
    } finally {
      setLoading(false);
    }
  };

  return { funnelData, loading };
};
