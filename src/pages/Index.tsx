import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { FunnelStage } from "@/components/FunnelStage";
import { FilterSection } from "@/components/FilterSection";
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
import { Clock, TrendingUp, Users, Target } from "lucide-react";

const Index = () => {
  const [selectedSeller, setSelectedSeller] = useState("all");
  const [selectedOrigin, setSelectedOrigin] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const { sellers, origins, tags } = useFilterOptions();
  const { funnelData } = useFunnelData({
    seller: selectedSeller,
    origin: selectedOrigin,
    tag: selectedTag,
    startDate,
    endDate,
  });

  const {
    stats,
    topSellers,
    monthlyRanking,
    yesterdaySales,
    todaySales,
    loading: statsLoading,
  } = useSalesStats({
    startDate,
    endDate,
    seller: selectedSeller,
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
              selectedSeller={selectedSeller}
              selectedOrigin={selectedOrigin}
              selectedTag={selectedTag}
              startDate={startDate}
              endDate={endDate}
              onSellerChange={setSelectedSeller}
              onOriginChange={setSelectedOrigin}
              onTagChange={setSelectedTag}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Tempo Médio de Conversão"
                value="42 dias"
                icon={Clock}
              />
              <MetricCard
                title="Taxa de Conversão"
                value={`${conversionRate}%`}
                icon={TrendingUp}
              />
              <MetricCard
                title="Total de Entradas"
                value={totalEntries}
                icon={Users}
              />
              <MetricCard
                title="Total de Ganhos"
                value={funnelData.ganho}
                icon={Target}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Funil de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    <FunnelStage
                      label="Entrou no Funil"
                      count={funnelData.entrouNoFunil}
                      percentage={100}
                      totalEntries={totalEntries}
                    />
                    <FunnelStage
                      label="Prospecção"
                      count={funnelData.prospeccao}
                      percentage={calculatePercentage(funnelData.prospeccao)}
                      totalEntries={totalEntries}
                    />
                    <FunnelStage
                      label="Conexão"
                      count={funnelData.conexao}
                      percentage={calculatePercentage(funnelData.conexao)}
                      totalEntries={totalEntries}
                    />
                    <FunnelStage
                      label="Negociação"
                      count={funnelData.negociacao}
                      percentage={calculatePercentage(funnelData.negociacao)}
                      totalEntries={totalEntries}
                    />
                    <FunnelStage
                      label="Agendado"
                      count={funnelData.agendado}
                      percentage={calculatePercentage(funnelData.agendado)}
                      totalEntries={totalEntries}
                    />
                    <FunnelStage
                      label="Fechado"
                      count={funnelData.fechado}
                      percentage={calculatePercentage(funnelData.fechado)}
                      totalEntries={totalEntries}
                    />

                    <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-foreground">{funnelData.ganho}</p>
                        <p className="text-sm text-muted-foreground mt-2">Ganho</p>
                      </div>
                      <div className="text-center">
                        <p className="text-4xl font-bold text-foreground">{funnelData.perdido}</p>
                        <p className="text-sm text-muted-foreground mt-2">Perdido</p>
                      </div>
                    </div>
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="acompanhamento" className="space-y-4">
            <FilterSection
              sellers={sellers}
              origins={origins}
              tags={tags}
              selectedSeller={selectedSeller}
              selectedOrigin={selectedOrigin}
              selectedTag={selectedTag}
              startDate={startDate}
              endDate={endDate}
              onSellerChange={setSelectedSeller}
              onOriginChange={setSelectedOrigin}
              onTagChange={setSelectedTag}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
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
