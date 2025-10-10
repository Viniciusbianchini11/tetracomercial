import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useSellerProfile } from "@/hooks/useSellerProfile";
import { useSellerStats } from "@/hooks/useSellerStats";
import { SalesFilterSection } from "@/components/SalesFilterSection";
import { MetricCard } from "@/components/MetricCard";
import { DollarSign, TrendingUp, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SellerDashboard = () => {
  const { profile, loading: profileLoading } = useSellerProfile();
  const [salesStartDate, setSalesStartDate] = useState<Date | undefined>(undefined);
  const [salesEndDate, setSalesEndDate] = useState<Date | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedLaunch, setSelectedLaunch] = useState("all");

  const { stats, monthlySales, loading: statsLoading } = useSellerStats({
    sellerName: profile?.seller_name || undefined,
    startDate: salesStartDate,
    endDate: salesEndDate,
    month: selectedMonth,
    year: selectedYear,
    launch: selectedLaunch,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto p-8">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Meu Desempenho</h1>
          <p className="text-muted-foreground mt-2">
            Vendedor: {profile.seller_name}
          </p>
        </div>

        <SalesFilterSection
          startDate={salesStartDate}
          endDate={salesEndDate}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          selectedLaunch={selectedLaunch}
          onStartDateChange={setSalesStartDate}
          onEndDateChange={setSalesEndDate}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          onLaunchChange={setSelectedLaunch}
        />

        {statsLoading ? (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <MetricCard
                title="Faturamento Total"
                value={formatCurrency(stats.faturamentoBruto)}
                icon={DollarSign}
              />
              <MetricCard
                title="Total de Vendas"
                value={stats.vendas}
                icon={TrendingUp}
              />
              <MetricCard
                title="Taxa de Conversão"
                value={`${stats.taxaConversao.toFixed(1)}%`}
                icon={Target}
              />
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Vendas por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlySales.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma venda encontrada no período selecionado
                    </p>
                  ) : (
                    monthlySales.map((month, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{month.mes}</p>
                          <p className="text-sm text-muted-foreground">
                            {month.vendas} vendas
                          </p>
                        </div>
                        <p className="font-semibold">
                          {formatCurrency(month.faturamento)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
