import { Card, CardContent } from "@/components/ui/card";
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

  const totalValue = data.sales.reduce((sum, s) => sum + s.value, 0);
  const totalQuantity = data.sales.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <Card className="h-full flex flex-col overflow-hidden border-2">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2.5 flex items-center justify-between">
        <span className="text-sm font-bold">RESUMO DO MÊS</span>
        <div className="flex gap-3 text-xs">
          <span className="font-semibold">{totalQuantity} vendas</span>
          <span className="font-semibold">{formatCurrency(totalValue)}</span>
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex-1 overflow-hidden p-3">
        <ScrollArea className="h-full">
          <div className="space-y-3 pr-2">
            {/* Resultado de Vendas */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-primary mb-2">📊 RESULTADO DE VENDAS</h3>
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-muted/50 grid grid-cols-4 gap-1 px-2 py-1.5 text-[10px] font-semibold">
                  <div>Vendedor</div>
                  <div className="text-center">Qtd</div>
                  <div className="text-right">Valor</div>
                  <div className="text-right">%</div>
                </div>
                <div className="divide-y">
                  {data.sales.map((sale, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-1 px-2 py-1.5 text-[10px] hover:bg-muted/30 transition-colors"
                    >
                      <div className="font-medium uppercase truncate">{sale.seller}</div>
                      <div className="text-center">{sale.quantity}</div>
                      <div className="text-right">{formatCurrency(sale.value)}</div>
                      <div className="text-right font-semibold text-primary">
                        {sale.percentage.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-primary/10 grid grid-cols-4 gap-1 px-2 py-1.5 text-[10px] font-bold border-t-2">
                  <div>TOTAL</div>
                  <div className="text-center">{totalQuantity}</div>
                  <div className="text-right">{formatCurrency(totalValue)}</div>
                  <div className="text-right">100%</div>
                </div>
              </div>
            </div>

            {/* Formas de Pagamento */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-green-600 mb-2">💳 FORMAS DE PAGAMENTO</h3>
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-muted/50 grid grid-cols-3 gap-1 px-2 py-1.5 text-[10px] font-semibold">
                  <div>Vendedor</div>
                  <div className="text-center">Boleto</div>
                  <div className="text-center">Cartão</div>
                </div>
                <div className="divide-y">
                  {data.sales.map((sale, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-1 px-2 py-1.5 text-[10px] hover:bg-muted/30 transition-colors"
                    >
                      <div className="font-medium uppercase truncate">{sale.seller}</div>
                      <div className="text-center font-semibold text-orange-600">
                        {sale.boletoPercentage.toFixed(1)}%
                      </div>
                      <div className="text-center font-semibold text-blue-600">
                        {sale.cartaoPercentage.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ligações */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-blue-600 mb-2">📞 LIGAÇÕES DO MÊS</h3>
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-muted/50 grid grid-cols-3 gap-1 px-2 py-1.5 text-[10px] font-semibold">
                  <div>Vendedor</div>
                  <div className="text-center">Tentativas</div>
                  <div className="text-center">Conexões</div>
                </div>
                <div className="divide-y">
                  {data.calls.map((call, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-1 px-2 py-1.5 text-[10px] hover:bg-muted/30 transition-colors"
                    >
                      <div className="font-medium uppercase truncate">{call.seller}</div>
                      <div className="text-center text-muted-foreground">{call.tentativas}</div>
                      <div className="text-center font-semibold text-blue-600">{call.conexoes}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
