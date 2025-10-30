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
      console.log('📊 Decisão de busca:', {
        hasDateFilter: !!(filters.startDate || filters.endDate),
        willUseSnapshots: !!(filters.startDate || filters.endDate),
        filters: {
          seller: filters.seller,
          origin: filters.origin,
          tag: filters.tag,
          startDate: filters.startDate?.toISOString().split('T')[0],
          endDate: filters.endDate?.toISOString().split('T')[0]
        }
      });
      
      // Se houver filtro de data, usar snapshots diários
      if (filters.startDate || filters.endDate) {
        console.log('🗄️ USANDO RESUMO_FILTROS (dados históricos agregados)');
        await fetchFromSnapshots();
      } else {
        console.log('⚡ USANDO TABELAS INDIVIDUAIS (dados em tempo real)');
        // Sem filtro de data, buscar dados em tempo real
        await fetchRealTimeData();
      }
    } catch (error) {
      console.error("Error fetching funnel data:", error);
      toast.error("Erro ao carregar dados do funil");
    }
  };

  const fetchFromSnapshots = async () => {
    // Helper para formatar data (YYYY-MM-DD)
    const formatDateOnly = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Tipagem explícita para a tabela resumo_funil
    interface ResumoFunil {
      entraram_no_funil: number;
      prospeccao: number;
      conexao: number;
      negociacao: number;
      agendado: number;
      fechado: number;
      ganho: number;
      perdido: number;
    }

    // Usar any para bypass do TypeScript já que a tabela não está nos tipos gerados
    const supabaseClient = supabase as any;
    let query = supabaseClient.from("resumo_filtros").select("*");

    // Filtrar por vendedor
    if (filters.seller !== "all") {
      // Vendedor específico selecionado
      const seller = filters.seller.toLowerCase();
      
      // Verificar se é um email (contém @)
      const isEmail = seller.includes("@");
      
      if (isEmail) {
        query = query.eq("dono_do_negocio", seller);
        console.log('🔍 Filtering by seller email:', seller);
      } else {
        // É um nome - normalizar para comparação (Title Case)
        const normalizedName = seller
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        query = query.eq("dono_do_negocio", normalizedName);
        console.log('🔍 Filtering by seller name (normalized):', normalizedName);
      }
    } else {
      // Todos os vendedores: buscar registros com dono_do_negocio = "GERAL"
      query = query.eq("dono_do_negocio", "GERAL");
      console.log('🔍 Filtering: GERAL (all sellers)');
    }

    // Determinar tipo_resumo baseado nos filtros aplicados
    let tipoResumo: string;
    if (filters.seller !== "all" && filters.origin !== "all") {
      // Cenário 1: Vendedor específico + Origem específica
      tipoResumo = "POR VENDEDOR (POR ORIGEM)";
      query = query.eq("tipo_resumo", tipoResumo);
      console.log('🔍 Using tipo_resumo: POR VENDEDOR (POR ORIGEM)');
    } else if (filters.seller !== "all" && filters.origin === "all") {
      // Cenário 2: Vendedor específico + Todas as Origens
      tipoResumo = "POR VENDEDOR";
      query = query.eq("tipo_resumo", tipoResumo);
      console.log('🔍 Using tipo_resumo: POR VENDEDOR');
    } else if (filters.seller === "all" && filters.origin !== "all") {
      // Cenário 3: Todos os vendedores + Origem específica
      tipoResumo = "GERAL";
      query = query.eq("tipo_resumo", tipoResumo);
      console.log('🔍 Using tipo_resumo: GERAL (specific origin)');
    } else {
      // Cenário 4: Todos os vendedores + Todas as Origens
      tipoResumo = "GERAL";
      query = query.eq("tipo_resumo", tipoResumo);
      console.log('🔍 Using tipo_resumo: GERAL (all origins)');
    }

    // Filtrar por origem
    if (filters.origin !== "all") {
      query = query.eq("origem", filters.origin);
      console.log('🔍 Filtering by origin:', filters.origin);
    } else {
      // "Todas as Origens" - Para agregados (GERAL/POR VENDEDOR), usar origem IS NULL
      if (tipoResumo === "GERAL" || tipoResumo === "POR VENDEDOR") {
        query = query.or("origem.is.null");
        console.log('🔍 Origin filter: IS NULL using .or()');
      }
    }

    // Filtro de data: comparação direta (data_resumo já é tipo date)
    if (filters.startDate && filters.endDate) {
      const start = formatDateOnly(filters.startDate);
      const end = formatDateOnly(filters.endDate);
      
      if (start === end) {
        // Um único dia: usar equality
        query = query.eq("data_resumo", start);
        console.log('🔍 Date filter (single day):', start);
      } else {
        // Intervalo: usar range (inclusivo em ambos os lados)
        query = query.gte("data_resumo", start).lte("data_resumo", end);
        console.log('🔍 Date range:', { start, end });
      }
    } else if (filters.startDate) {
      const start = formatDateOnly(filters.startDate);
      query = query.gte("data_resumo", start);
      console.log('🔍 Start date (open-ended):', start);
    } else if (filters.endDate) {
      const end = formatDateOnly(filters.endDate);
      query = query.lte("data_resumo", end);
      console.log('🔍 End date (until):', end);
    }
    
    console.log('📊 Final query filters:', {
      tipo_resumo: tipoResumo,
      dono_do_negocio: filters.seller === "all" ? "GERAL" : filters.seller,
      origem: filters.origin === "all" ? "NULL" : filters.origin,
      dateRange: filters.startDate && filters.endDate 
        ? `${formatDateOnly(filters.startDate)} to ${formatDateOnly(filters.endDate)}`
        : 'none'
    });

    let { data, error } = await query;

    console.log('📊 Query result:', {
      recordsFound: data?.length || 0,
      error: error?.message,
      sampleRecord: data?.[0]
    });

    if (error) {
      console.error("Error fetching resumo_filtros data:", error);
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

    // Agregar dados do período selecionado
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

    (data as ResumoFunil[])?.forEach((row) => {
      aggregated.entrouNoFunil += row.entraram_no_funil || 0;
      aggregated.prospeccao += row.prospeccao || 0;
      aggregated.conexao += row.conexao || 0;
      aggregated.negociacao += row.negociacao || 0;
      aggregated.agendado += row.agendado || 0;
      aggregated.fechado += row.fechado || 0;
      aggregated.ganho += row.ganho || 0;
      aggregated.perdido += row.perdido || 0;
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
