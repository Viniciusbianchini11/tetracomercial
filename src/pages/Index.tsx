import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { FunnelStage } from "@/components/FunnelStage";
import { VisualFunnel } from "@/components/VisualFunnel";
import { FilterSection } from "@/components/FilterSection";
import { SalesFilterSection } from "@/components/SalesFilterSection";
import { SalesTable } from "@/components/SalesTable";
import { useSalesStats } from "@/hooks/useSalesStats";
import { SalesMetricsCards } from "@/components/sales/SalesMetricsCards";
import { TopSellersChart } from "@/components/sales/TopSellersChart";
import { SellersRanking } from "@/components/sales/SellersRanking";
import { DailySales } from "@/components/sales/DailySales";
import { GoalsCard } from "@/components/sales/GoalsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/Header";
import { useFunnelData } from "@/hooks/useFunnelData";
import { useFilterOptions } from "@/hooks/useFilterOptions";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { CallsChart } from "@/components/CallsChart";
import { Reports } from "./Reports";
import { TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";
interface PerformanceFilters {
  selectedSeller: string;
  selectedOrigin: string;
  selectedTag: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface SalesFilters {
  salesStartDate: Date | undefined;
  salesEndDate: Date | undefined;
  selectedMonth: string;
  selectedYear: string;
  selectedLaunch: string;
}

const Index = () => {
  // Filtros Performance com persistência
  const { filters: performanceFilters, setFilters: setPerformanceFilters, clearFilters: clearPerformanceFilters } = 
    usePersistedFilters<PerformanceFilters>({
      key: 'performance-filters',
      defaultValues: {
        selectedSeller: "all",
        selectedOrigin: "all",
        selectedTag: "all",
        startDate: undefined,
        endDate: undefined,
      },
    });

  // Filtros Acompanhamento de vendas com persistência
  const { filters: salesFilters, setFilters: setSalesFilters, clearFilters: clearSalesFilters } = 
    usePersistedFilters<SalesFilters>({
      key: 'sales-filters',
      defaultValues: {
        salesStartDate: undefined,
        salesEndDate: undefined,
        selectedMonth: "all",
        selectedYear: "all",
        selectedLaunch: "all",
      },
    });

  const { sellers, origins, tags } = useFilterOptions();
  const funnelFilters = useMemo(() => ({
    seller: performanceFilters.selectedSeller,
    origin: performanceFilters.selectedOrigin,
    tag: performanceFilters.selectedTag,
    startDate: performanceFilters.startDate,
    endDate: performanceFilters.endDate,
  }), [
    performanceFilters.selectedSeller,
    performanceFilters.selectedOrigin,
    performanceFilters.selectedTag,
    performanceFilters.startDate,
    performanceFilters.endDate,
  ]);
  const { funnelData } = useFunnelData(funnelFilters);

  const {
    stats,
    topSellers,
    monthlyRanking,
    yesterdaySales,
    todaySales,
    loading: statsLoading,
  } = useSalesStats({
    startDate: salesFilters.salesStartDate,
    endDate: salesFilters.salesEndDate,
    month: salesFilters.selectedMonth,
    year: salesFilters.selectedYear,
    launch: salesFilters.selectedLaunch,
  });

  const totalEntries = funnelData.entrouNoFunil;
  const conversionRate =
    totalEntries > 0 ? ((funnelData.ganho / totalEntries) * 100).toFixed(1) : "0.0";

  const calculatePercentage = (count: number) => {
    return totalEntries > 0 ? Math.round((count / totalEntries) * 100) : 0;
  };

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      <Header />
      <div className="flex-1 overflow-y-auto px-4">
        <Tabs defaultValue="performance" className="w-full h-full">
          <TabsList className="mb-3 h-9">
            <TabsTrigger value="performance" className="text-sm">Performance</TabsTrigger>
            <TabsTrigger value="acompanhamento" className="text-sm">Vendas</TabsTrigger>
            <TabsTrigger value="relatorios" className="text-sm">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-3 mt-0">
            <FilterSection
              sellers={sellers}
              origins={origins}
              tags={tags}
              selectedSeller={performanceFilters.selectedSeller}
              selectedOrigin={performanceFilters.selectedOrigin}
              selectedTag={performanceFilters.selectedTag}
              startDate={performanceFilters.startDate}
              endDate={performanceFilters.endDate}
              onSellerChange={(value) => setPerformanceFilters({ selectedSeller: value })}
              onOriginChange={(value) => setPerformanceFilters({ selectedOrigin: value })}
              onTagChange={(value) => setPerformanceFilters({ selectedTag: value })}
              onStartDateChange={(value) => setPerformanceFilters({ startDate: value })}
              onEndDateChange={(value) => setPerformanceFilters({ endDate: value })}
              onClearFilters={clearPerformanceFilters}
            />

            <div className="grid grid-cols-2 gap-3">
              {/* Left side - Visual Funnel */}
              <Card className="relative overflow-hidden">
                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="text-base">Funil de Vendas</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  <VisualFunnel
                    stages={[
                      {
                        label: "Entrou no Funil",
                        count: funnelData.entrouNoFunil,
                        percentage: calculatePercentage(funnelData.entrouNoFunil),
                      },
                      {
                        label: "Prospecção",
                        count: funnelData.prospeccao,
                        percentage: calculatePercentage(funnelData.prospeccao),
                      },
                      {
                        label: "Conexão",
                        count: funnelData.conexao,
                        percentage: calculatePercentage(funnelData.conexao),
                      },
                      {
                        label: "Negociação",
                        count: funnelData.negociacao,
                        percentage: calculatePercentage(funnelData.negociacao),
                      },
                      {
                        label: "Agendado",
                        count: funnelData.agendado,
                        percentage: calculatePercentage(funnelData.agendado),
                      },
                      {
                        label: "Fechado",
                        count: funnelData.fechado,
                        percentage: calculatePercentage(funnelData.fechado),
                      },
                    ]}
                  />
                </CardContent>
              </Card>

              {/* Right side - Metrics */}
              <div className="flex flex-col gap-3">
                {/* Taxa de Conversão e Entradas lado a lado */}
                <ul className="grid grid-cols-2 gap-2 list-none">
                  <li>
                    <Card className="h-full">
                      <CardContent className="p-3 flex flex-col items-center justify-center h-full">
                        <TrendingUp className="h-6 w-6 text-primary mb-1" />
                        <p className="text-2xl font-bold text-foreground">{conversionRate}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Taxa Conversão</p>
                      </CardContent>
                    </Card>
                  </li>
                  <li>
                    <Card className="h-full">
                      <CardContent className="p-3 flex flex-col items-center justify-center h-full">
                        <Users className="h-6 w-6 text-primary mb-1" />
                        <p className="text-2xl font-bold text-foreground">{totalEntries}</p>
                        <p className="text-xs text-muted-foreground mt-1">Total Entradas</p>
                      </CardContent>
                    </Card>
                  </li>
                </ul>
                
                {/* Ganho e Perdido Card */}
                <Card>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-foreground">{funnelData.ganho}</p>
                        <p className="text-xs text-muted-foreground mt-1">Ganho</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <p className="text-2xl font-bold text-foreground">{funnelData.perdido}</p>
                        <p className="text-xs text-muted-foreground mt-1">Perdido</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Visualização de Ligações */}
                <CallsChart 
                  startDate={performanceFilters.startDate}
                  endDate={performanceFilters.endDate}
                />
              </div>
            </div>

          </TabsContent>

          <TabsContent value="acompanhamento" className="mt-0 flex flex-col h-[calc(100vh-140px)]">
            <div className="space-y-3 flex-shrink-0">
              <SalesFilterSection
                startDate={salesFilters.salesStartDate}
                endDate={salesFilters.salesEndDate}
                selectedMonth={salesFilters.selectedMonth}
                selectedYear={salesFilters.selectedYear}
                selectedLaunch={salesFilters.selectedLaunch}
                onStartDateChange={(value) => setSalesFilters({ salesStartDate: value })}
                onEndDateChange={(value) => setSalesFilters({ salesEndDate: value })}
                onMonthChange={(value) => setSalesFilters({ selectedMonth: value })}
                onYearChange={(value) => setSalesFilters({ selectedYear: value })}
                onLaunchChange={(value) => setSalesFilters({ selectedLaunch: value })}
                onClearFilters={clearSalesFilters}
              />
              
              {statsLoading ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-6 gap-2">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                  <Skeleton className="h-[300px]" />
                </div>
              ) : (
                <>
                  <SalesMetricsCards
                    faturamentoBruto={stats.faturamentoBruto}
                    pistas={stats.pistas}
                    vendas={stats.vendas}
                    taxaConversao={stats.taxaConversao}
                    recorrentes={stats.recorrentes}
                    foraLancamento={stats.foraLancamento}
                  />
                  
                  <div className="grid grid-cols-3 gap-3">
                    <TopSellersChart sellers={topSellers} />
                    <SellersRanking
                      title="Ranking Lançamento"
                      sellers={topSellers}
                      showSalesCount={true}
                    />
                    <GoalsCard />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <SellersRanking
                      title="Classificação Mensal"
                      sellers={monthlyRanking}
                    />
                    <DailySales
                      title="Dia anterior"
                      vendas={yesterdaySales.vendas}
                      faturamento={yesterdaySales.faturamento}
                      porVendedor={yesterdaySales.porVendedor}
                    />
                    <DailySales
                      title="Vendas do dia"
                      vendas={todaySales.vendas}
                      faturamento={todaySales.faturamento}
                      faturamentoFinal={todaySales.faturamentoFinal}
                      porVendedor={todaySales.porVendedor}
                    />
                  </div>
                </>
              )}
            </div>

            {!statsLoading && (
              <div className="flex-1 min-h-0 mt-3">
                <SalesTable />
              </div>
            )}
          </TabsContent>

          <TabsContent value="relatorios" className="mt-0 p-0">
            <Reports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
