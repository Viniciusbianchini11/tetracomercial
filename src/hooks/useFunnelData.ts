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

  const buildQuery = (tableName: TableName, dateOverride?: { start?: Date; end?: Date }) => {
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

    // Use dateOverride se fornecido, caso contrário use filters
    const startToUse = dateOverride?.start || filters.startDate;
    const endToUse = dateOverride?.end || filters.endDate;

    if (startToUse) {
      const startOfDay = new Date(startToUse);
      startOfDay.setHours(0, 0, 0, 0);
      query = query.gte("data_de_criacao", startOfDay.toISOString());
    }

    if (endToUse) {
      const endOfDay = new Date(endToUse);
      endOfDay.setHours(23, 59, 59, 999);
      query = query.lte("data_de_criacao", endOfDay.toISOString());
    }

    return query;
  };

  const fetchFunnelData = async () => {
    try {
      // Normalização robusta das datas (aceita Date, string ISO, ou undefined)
      const normalizeDate = (d: any): Date | undefined => {
        if (!d) return undefined;
        const dd = d instanceof Date ? d : new Date(d);
        return isNaN(dd.getTime()) ? undefined : dd;
      };

      const startNorm = normalizeDate(filters.startDate as any);
      const endNorm = normalizeDate(filters.endDate as any);
      const startStr = startNorm ? startNorm.toISOString().slice(0, 10) : undefined;
      const endStr = endNorm ? endNorm.toISOString().slice(0, 10) : undefined;

      console.log('📊 Decisão de busca:', {
        hasDateFilter: !!(startNorm || endNorm),
        willUseSnapshots: !!(startNorm || endNorm),
        filters: {
          seller: filters.seller,
          origin: filters.origin,
          tag: filters.tag,
          startDate: startStr,
          endDate: endStr,
        },
      });

      // Se houver filtro de data (normalizado), usar snapshots agregados
      if (startNorm || endNorm) {
        console.log('🗄️ USANDO RESUMO_FILTROS (dados históricos agregados)');
        await fetchFromSnapshots(startNorm, endNorm);
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

  const fetchFromRawWithDateRange = async (startNorm?: Date, endNorm?: Date) => {
    console.log('🧮 Fallback: calculando ao vivo nas tabelas base');
    
    const dateOverride = { start: startNorm, end: endNorm };
    
    const [
      entrou, prosp, conex, negoc, agend, fech, ganho, perdido
    ] = await Promise.all([
      buildQuery('entrounofunil', dateOverride),
      buildQuery('contato_prospeccao', dateOverride),
      buildQuery('contato_conexao', dateOverride),
      buildQuery('contato_negociacao', dateOverride),
      buildQuery('contato_agendado', dateOverride),
      buildQuery('contato_fechado', dateOverride),
      buildQuery('contato_status_ganho', dateOverride),
      buildQuery('contato_status_perdido', dateOverride),
    ]);

    const results = [entrou, prosp, conex, negoc, agend, fech, ganho, perdido];
    const errorResult = results.find(r => r.error);
    
    if (errorResult?.error) {
      console.error('❌ Erro no fallback ao vivo:', errorResult.error);
      setFunnelData({
        entrouNoFunil: 0,
        prospeccao: 0,
        conexao: 0,
        negociacao: 0,
        agendado: 0,
        fechado: 0,
        ganho: 0,
        perdido: 0
      });
      return;
    }

    const calculatedData = {
      entrouNoFunil: entrou.count || 0,
      prospeccao: prosp.count || 0,
      conexao: conex.count || 0,
      negociacao: negoc.count || 0,
      agendado: agend.count || 0,
      fechado: fech.count || 0,
      ganho: ganho.count || 0,
      perdido: perdido.count || 0,
    };

    console.log('✅ Dados calculados ao vivo:', calculatedData);
    setFunnelData(calculatedData);
  };

  const fetchFromSnapshots = async (startNorm?: Date, endNorm?: Date) => {
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
        query = query.is("origem", null);
        console.log('🔍 Origin filter: IS NULL');
      }
    }

    // Filtro de data: usar cast para garantir comparação correta com tipo date
    if (startNorm && endNorm) {
      const start = formatDateOnly(startNorm);
      const end = formatDateOnly(endNorm);
      if (start === end) {
        query = query.eq("data_resumo::text", start);
        console.log('🔍 Date filter (single day):', start);
      } else {
        query = query.gte("data_resumo::text", start).lte("data_resumo::text", end);
        console.log('🔍 Date range:', { start, end });
      }
    } else if (startNorm) {
      const start = formatDateOnly(startNorm);
      query = query.gte("data_resumo::text", start);
      console.log('🔍 Start date (open-ended):', start);
    } else if (endNorm) {
      const end = formatDateOnly(endNorm);
      query = query.lte("data_resumo::text", end);
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

    const { data, error, count } = await query;

    console.log('📊 Query result (resumo_filtros):', {
      recordsFound: data?.length || 0,
      error: error?.message,
      sampleRecord: data?.[0],
      appliedFilters: {
        startDate: startNorm ? formatDateOnly(startNorm) : undefined,
        endDate: endNorm ? formatDateOnly(endNorm) : undefined,
      }
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

    // Se não houver dados no snapshot, calcular ao vivo
    if (!data || data.length === 0) {
      console.log('⚠️ Nenhum snapshot encontrado em resumo_filtros, calculando ao vivo...');
      await fetchFromRawWithDateRange(startNorm, endNorm);
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
      // Não usar ganho do snapshot - será buscado em tempo real
      aggregated.perdido += row.perdido || 0;
    });

    // Buscar ganho em tempo real da tabela contato_status_ganho
    const dateOverride = { start: startNorm, end: endNorm };
    const ganhoRealTimeResult = await buildQuery('contato_status_ganho', dateOverride);
    
    if (ganhoRealTimeResult.error) {
      console.error('❌ Erro ao buscar ganho em tempo real:', ganhoRealTimeResult.error);
    } else {
      aggregated.ganho = ganhoRealTimeResult.count || 0;
      console.log('✅ Ganho buscado em tempo real:', aggregated.ganho);
    }

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
