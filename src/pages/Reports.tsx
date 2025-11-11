import { Skeleton } from "@/components/ui/skeleton";
import { useDailyReports } from "@/hooks/useDailyReports";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const Reports = () => {
  const { reports, loading } = useDailyReports();

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3 px-4 pt-0">
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[600px] col-span-3" />
      </div>
    );
  }

  // Calculate summary stats
  const totalSales = reports.reduce((sum, r) => sum + r.totalQuantity, 0);
  const totalRevenue = reports.reduce((sum, r) => sum + r.totalValue, 0);
  const totalCalls = reports.reduce((sum, r) => sum + r.totalTentativas, 0);
  const avgDailySales = reports.length > 0 ? totalSales / reports.length : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3 px-4 pt-0 pb-3">
        <Card className="p-4 border-l-4 border-l-primary bg-gradient-to-br from-background to-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total de Vendas</p>
              <p className="text-2xl font-bold">{totalSales}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-green-500 bg-gradient-to-br from-background to-green-500/5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Faturamento Total</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-500 bg-gradient-to-br from-background to-blue-500/5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total de Ligações</p>
              <p className="text-2xl font-bold">{totalCalls}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-orange-500 bg-gradient-to-br from-background to-orange-500/5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Média Diária</p>
              <p className="text-2xl font-bold">{avgDailySales.toFixed(1)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reports List */}
      <div className="flex-1 min-h-0 px-4 pb-4">
        <ScrollArea className="h-full">
          {reports.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum relatório encontrado</p>
            </div>
          ) : (
            <div className="space-y-6 pr-4">
              {reports.map((report) => (
                <Card key={report.date} className="overflow-hidden border-2 hover:shadow-lg transition-shadow">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5" />
                      <span className="text-lg font-bold">
                        {format(new Date(report.date + "T00:00:00"), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <span className="font-semibold">{report.totalQuantity} vendas</span>
                      <span className="font-semibold">{formatCurrency(report.totalValue)}</span>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-3 gap-4 p-6">
                    {/* Sales Table */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-primary mb-3">📊 RESULTADO DE VENDAS</h3>
                      <div className="rounded-lg border overflow-hidden">
                        <div className="bg-muted/50 grid grid-cols-4 gap-2 px-3 py-2 text-xs font-semibold">
                          <div>Vendedor</div>
                          <div className="text-center">Qtd</div>
                          <div className="text-right">Valor</div>
                          <div className="text-right">%</div>
                        </div>
                        <div className="divide-y">
                          {report.sales
                            .filter(s => s.quantity > 0)
                            .sort((a, b) => b.value - a.value)
                            .map((sale) => (
                              <div key={sale.seller} className="grid grid-cols-4 gap-2 px-3 py-2 text-xs hover:bg-muted/30 transition-colors">
                                <div className="font-medium">{sale.seller}</div>
                                <div className="text-center">{sale.quantity}</div>
                                <div className="text-right">{formatCurrency(sale.value)}</div>
                                <div className="text-right font-semibold text-primary">{sale.percentage.toFixed(1)}%</div>
                              </div>
                            ))}
                        </div>
                        <div className="bg-primary/10 grid grid-cols-4 gap-2 px-3 py-2 text-xs font-bold border-t-2">
                          <div>TOTAL</div>
                          <div className="text-center">{report.totalQuantity}</div>
                          <div className="text-right">{formatCurrency(report.totalValue)}</div>
                          <div className="text-right">100%</div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-green-600 mb-3">💳 FORMAS DE PAGAMENTO</h3>
                      <div className="rounded-lg border overflow-hidden">
                        <div className="bg-muted/50 grid grid-cols-3 gap-2 px-3 py-2 text-xs font-semibold">
                          <div>Vendedor</div>
                          <div className="text-center">Boleto</div>
                          <div className="text-center">Cartão</div>
                        </div>
                        <div className="divide-y">
                          {report.sales
                            .filter(s => s.quantity > 0)
                            .sort((a, b) => b.value - a.value)
                            .map((sale) => (
                              <div key={sale.seller} className="grid grid-cols-3 gap-2 px-3 py-2 text-xs hover:bg-muted/30 transition-colors">
                                <div className="font-medium">{sale.seller}</div>
                                <div className="text-center bg-orange-50 dark:bg-orange-950/20 py-1 rounded">
                                  {sale.boletoPercentage > 0 ? `${sale.boletoPercentage.toFixed(1)}%` : "-"}
                                </div>
                                <div className="text-center bg-blue-50 dark:bg-blue-950/20 py-1 rounded">
                                  {sale.cartaoPercentage > 0 ? `${sale.cartaoPercentage.toFixed(1)}%` : "-"}
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className="bg-green-600/10 grid grid-cols-3 gap-2 px-3 py-2 text-xs font-bold border-t-2">
                          <div>MÉDIA</div>
                          <div className="text-center">{report.totalBoletoPercentage.toFixed(1)}%</div>
                          <div className="text-center">{report.totalCartaoPercentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>

                    {/* Calls Table */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-blue-600 mb-3">📞 LIGAÇÕES DO DIA</h3>
                      <div className="rounded-lg border overflow-hidden">
                        <div className="bg-muted/50 grid grid-cols-3 gap-2 px-3 py-2 text-xs font-semibold">
                          <div>Vendedor</div>
                          <div className="text-center">Tentativas</div>
                          <div className="text-center">Conexões</div>
                        </div>
                        <div className="divide-y">
                          {report.calls
                            .filter(c => c.tentativas > 0)
                            .sort((a, b) => b.tentativas - a.tentativas)
                            .map((call) => (
                              <div key={call.seller} className="grid grid-cols-3 gap-2 px-3 py-2 text-xs hover:bg-muted/30 transition-colors">
                                <div className="font-medium">{call.seller}</div>
                                <div className="text-center">{call.tentativas}</div>
                                <div className="text-center font-semibold text-blue-600">{call.conexoes}</div>
                              </div>
                            ))}
                        </div>
                        <div className="bg-blue-600/10 grid grid-cols-3 gap-2 px-3 py-2 text-xs font-bold border-t-2">
                          <div>TOTAL</div>
                          <div className="text-center">{report.totalTentativas}</div>
                          <div className="text-center">{report.totalConexoes}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
