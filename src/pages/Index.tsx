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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto p-8">

        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="acompanhamento">Acompanhamento de vendas</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Visual Funnel */}
              <Card className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl">Funil de Vendas</CardTitle>
                </CardHeader>
                <CardContent>
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
              <div className="flex flex-col gap-6">
                {/* Taxa de Conversão e Entradas lado a lado */}
                <ul className="grid grid-cols-2 gap-4 list-none">
                  <li className="min-h-[14rem]">
                    <MetricCard
                      title="Taxa de Conversão"
                      value={`${conversionRate}%`}
                      icon={TrendingUp}
                    />
                  </li>
                  <li className="min-h-[14rem]">
                    <MetricCard
                      title="Total de Entradas"
                      value={totalEntries}
                      icon={Users}
                    />
                  </li>
                </ul>
                
                {/* Visualização de Ligações */}
                <CallsChart 
                  startDate={performanceFilters.startDate}
                  endDate={performanceFilters.endDate}
                />
                
                {/* Ganho e Perdido Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-3xl font-bold text-foreground">{funnelData.ganho}</p>
                        <p className="text-sm text-muted-foreground mt-2">Ganho</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-3xl font-bold text-foreground">{funnelData.perdido}</p>
                        <p className="text-sm text-muted-foreground mt-2">Perdido</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </TabsContent>

          <TabsContent value="acompanhamento" className="space-y-4">
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
                <Skeleton className="h-[400px]" />
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
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <TopSellersChart sellers={topSellers} />
                  <SellersRanking
                    title="Ranking Lançamento"
                    sellers={topSellers}
                    showSalesCount={true}
                  />
                  <GoalsCard />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

                <SalesTable />
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
