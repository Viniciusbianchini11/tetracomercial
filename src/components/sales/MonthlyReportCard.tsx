import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MonthlyReportData {
  sales: Array<{
    seller: string;
    quantity: number;
    value: number;
    percentage: number;
    boletoPercentage: number;
    cartaoPercentage: number;
  }>;
  calls: Array<{
    seller: string;
    tentativas: number;
    conexoes: number;
  }>;
}

interface MonthlyReportCardProps {
  data: MonthlyReportData;
}

export const MonthlyReportCard = ({ data }: MonthlyReportCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Resumo do Mês</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-3 pt-0">
        <ScrollArea className="h-full">
          <div className="space-y-3 pr-3">
            {/* Mini Card 1: Resultado de Vendas */}
            <div className="rounded-lg border bg-card p-2">
              <h4 className="text-xs font-semibold mb-2">Resultado de Vendas</h4>
              <div className="space-y-1">
                {data.sales.map((seller, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="font-medium uppercase truncate">{seller.seller}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-muted-foreground">{seller.quantity}</span>
                      <span className="font-semibold min-w-[70px] text-right">{formatCurrency(seller.value)}</span>
                      <span className="text-green-600 min-w-[35px] text-right">{seller.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Card 2: Formas de Pagamento */}
            <div className="rounded-lg border bg-card p-2">
              <h4 className="text-xs font-semibold mb-2">Formas de Pagamento</h4>
              <div className="space-y-1">
                {data.sales.map((seller, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="font-medium uppercase truncate">{seller.seller}</span>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-orange-600 min-w-[40px] text-right">
                        Boleto: {seller.boletoPercentage.toFixed(1)}%
                      </span>
                      <span className="text-blue-600 min-w-[40px] text-right">
                        Cartão: {seller.cartaoPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Card 3: Ligações */}
            <div className="rounded-lg border bg-card p-2">
              <h4 className="text-xs font-semibold mb-2">Ligações do Mês</h4>
              <div className="space-y-1">
                {data.calls.map((call, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="font-medium uppercase truncate">{call.seller}</span>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-muted-foreground">
                        Tentativas: <span className="font-semibold">{call.tentativas}</span>
                      </span>
                      <span className="text-blue-600">
                        Conexões: <span className="font-semibold">{call.conexoes}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
