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
      // Se houver filtro de data, usar snapshots diários
      if (filters.startDate || filters.endDate) {
        await fetchFromSnapshots();
      } else {
        // Sem filtro de data, buscar dados em tempo real
        await fetchRealTimeData();
      }
    } catch (error) {
      console.error("Error fetching funnel data:", error);
      toast.error("Erro ao carregar dados do funil");
    }
  };

  const fetchFromSnapshots = async () => {
    let query = supabase.from("leads_daily_snapshot").select("*");

    if (filters.startDate) {
      query = query.gte("snapshot_date", filters.startDate.toISOString().split('T')[0]);
    }
    if (filters.endDate) {
      query = query.lte("snapshot_date", filters.endDate.toISOString().split('T')[0]);
    }
    if (filters.seller !== "all") {
      query = query.eq("dono_do_negocio", filters.seller);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching snapshot data:", error);
      setFunnelData({
        entrouNoFunil: 0,
        prospeccao: 0,
        conexao: 0,
        negociacao: 0,
        agendado: 0,
        fechado: 0,
        ganho: 0,
        perdido: 0,
      });
      return;
    }

    // Agregar dados por estágio
    const aggregated = {
      entrouNoFunil: 0,
      prospeccao: 0,
      conexao: 0,
      negociacao: 0,
      agendado: 0,
      fechado: 0,
      ganho: 0,
      perdido: 0,
    };

    data?.forEach((row) => {
      if (row.action !== "entered") return;
      
      const stage = row.stage_name?.toLowerCase();
      const count = row.cnt || 0;

      if (stage === "entrounofunil") aggregated.entrouNoFunil += count;
      else if (stage === "prospecção" || stage === "prospeccao") aggregated.prospeccao += count;
      else if (stage === "conexão" || stage === "conexao") aggregated.conexao += count;
      else if (stage === "negociação" || stage === "negociacao") aggregated.negociacao += count;
      else if (stage === "agendado") aggregated.agendado += count;
      else if (stage === "fechado") aggregated.fechado += count;
      else if (stage === "ganho") aggregated.ganho += count;
      else if (stage === "perdido") aggregated.perdido += count;
    });

    setFunnelData(aggregated);
  };

  const fetchRealTimeData = async () => {
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

    const results = [
      entrouNoFunilResult,
      prospeccaoResult,
      conexaoResult,
      negociacaoResult,
      agendadoResult,
      fechadoResult,
      ganhoResult,
      perdidoResult,
    ];

    const errorResult = results.find((r) => r.error);
    if (errorResult?.error) {
      console.error("Error fetching funnel data:", errorResult.error);
      setFunnelData({
        entrouNoFunil: 0,
        prospeccao: 0,
        conexao: 0,
        negociacao: 0,
        agendado: 0,
        fechado: 0,
        ganho: 0,
        perdido: 0,
      });
      return;
    }

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
  };

  return { funnelData };
};
