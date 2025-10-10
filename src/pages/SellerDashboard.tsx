import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useSellerAuth } from "@/contexts/SellerAuthContext";
import { useSellerStats } from "@/hooks/useSellerStats";
import { useFunnelData } from "@/hooks/useFunnelData";
import { SalesFilterSection } from "@/components/SalesFilterSection";
import { FunnelStage } from "@/components/FunnelStage";
import { MetricCard } from "@/components/MetricCard";
import { DollarSign, TrendingUp, Target, CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFilterOptions } from "@/hooks/useFilterOptions";

const SellerDashboard = () => {
  const { user } = useSellerAuth();
  const { origins, tags } = useFilterOptions();
  
  // Filtros de vendas
  const [salesStartDate, setSalesStartDate] = useState<Date | undefined>(undefined);
  const [salesEndDate, setSalesEndDate] = useState<Date | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedLaunch, setSelectedLaunch] = useState("all");

  // Filtros do funil
  const [funnelStartDate, setFunnelStartDate] = useState<Date | undefined>(undefined);
  const [funnelEndDate, setFunnelEndDate] = useState<Date | undefined>(undefined);
  const [selectedOrigin, setSelectedOrigin] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  const { stats, monthlySales, loading: statsLoading } = useSellerStats({
    sellerEmail: user?.email || undefined,
    startDate: salesStartDate,
    endDate: salesEndDate,
    month: selectedMonth,
    year: selectedYear,
    launch: selectedLaunch,
  });

  const { funnelData } = useFunnelData({
    seller: user?.email || "all",
    origin: selectedOrigin,
    tag: selectedTag,
    startDate: funnelStartDate,
    endDate: funnelEndDate,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Meu Desempenho</h1>
          <p className="text-muted-foreground mt-2">
            Vendedor: {user?.email}
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">Funil de Vendas</h2>
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal bg-card",
                    !funnelStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {funnelStartDate ? format(funnelStartDate, "dd/MM/yyyy", { locale: ptBR }) : "Data Início"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={funnelStartDate}
                  onSelect={setFunnelStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal bg-card",
                    !funnelEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {funnelEndDate ? format(funnelEndDate, "dd/MM/yyyy", { locale: ptBR }) : "Data Fim"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={funnelEndDate}
                  onSelect={setFunnelEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
              <SelectTrigger className="w-[200px] bg-card">
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as origens</SelectItem>
                {origins.map((origin) => (
                  <SelectItem key={origin} value={origin}>
                    {origin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-[200px] bg-card">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as tags</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(funnelStartDate || funnelEndDate || selectedOrigin !== "all" || selectedTag !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFunnelStartDate(undefined);
                  setFunnelEndDate(undefined);
                  setSelectedOrigin("all");
                  setSelectedTag("all");
                }}
              >
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          <FunnelStage 
            label="Entrou no Funil" 
            count={funnelData.entrouNoFunil}
          />
          <FunnelStage 
            label="Prospecção" 
            count={funnelData.prospeccao}
          />
          <FunnelStage 
            label="Conexão" 
            count={funnelData.conexao}
          />
          <FunnelStage 
            label="Negociação" 
            count={funnelData.negociacao}
          />
          <FunnelStage 
            label="Agendado" 
            count={funnelData.agendado}
          />
          <FunnelStage 
            label="Fechado" 
            count={funnelData.fechado}
          />
          <FunnelStage 
            label="Ganho" 
            count={funnelData.ganho}
          />
          <FunnelStage 
            label="Perdido" 
            count={funnelData.perdido}
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Vendas</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <MetricCard
                title="Faturamento Bruto"
                value={formatCurrency(stats.faturamentoBruto)}
                icon={DollarSign}
              />
              <MetricCard
                title="Valor Líquido"
                value={formatCurrency(stats.valorFinal)}
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
