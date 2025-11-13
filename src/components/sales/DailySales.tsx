import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailySalesProps {
  title?: string;
  vendas: number;
  faturamento: number;
  faturamentoFinal?: number;
  porVendedor: Array<{
    vendedor: string;
    vendas: number;
    faturamento: number;
    faturamentoFinal?: number;
  }>;
  yesterdayData?: {
    vendas: number;
    faturamento: number;
    porVendedor: Array<{
      vendedor: string;
      vendas: number;
      faturamento: number;
    }>;
  };
}

export const DailySales = ({ title, vendas, faturamento, faturamentoFinal, porVendedor, yesterdayData }: DailySalesProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title || "Vendas"}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-6">
          {/* Dia Anterior */}
          {yesterdayData && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Dia Anterior</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Vendas</p>
                  <p className="text-2xl font-bold">{yesterdayData.vendas}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Faturamento</p>
                  <p className="text-2xl font-bold">{formatCurrency(yesterdayData.faturamento)}</p>
                </div>
                {yesterdayData.porVendedor.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium mb-2">Por vendedor:</p>
                    <div className="space-y-1">
                      {yesterdayData.porVendedor.map((vendedor, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="font-medium uppercase">{vendedor.vendedor}</span>
                          <div className="text-right">
                            <p className="font-semibold">{vendedor.vendas} {vendedor.vendas === 1 ? 'venda' : 'vendas'}</p>
                            <p className="text-xs text-muted-foreground">{formatCurrency(vendedor.faturamento)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vendas do Dia */}
          <div className="space-y-3">
            {yesterdayData && <h3 className="text-sm font-semibold text-muted-foreground">Vendas do Dia</h3>}
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Vendas</p>
                <p className="text-2xl font-bold">{vendas}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Faturamento {faturamentoFinal ? '(Cheio)' : ''}</p>
                <p className="text-2xl font-bold">{formatCurrency(faturamento)}</p>
              </div>
              
              {faturamentoFinal !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Valor Final</p>
                  <p className="text-2xl font-bold">{formatCurrency(faturamentoFinal)}</p>
                </div>
              )}
              
              {porVendedor.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium mb-2">Por vendedor:</p>
                  <div className="space-y-1">
                    {porVendedor.map((vendedor, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="font-medium uppercase">{vendedor.vendedor}</span>
                        <div className="text-right">
                          <p className="font-semibold">{vendedor.vendas} {vendedor.vendas === 1 ? 'venda' : 'vendas'}</p>
                          {vendedor.faturamentoFinal !== undefined ? (
                            <>
                              <p className="text-xs text-muted-foreground">Cheio: {formatCurrency(vendedor.faturamento)}</p>
                              <p className="text-xs text-muted-foreground">Final: {formatCurrency(vendedor.faturamentoFinal)}</p>
                            </>
                          ) : (
                            <p className="text-xs text-muted-foreground">{formatCurrency(vendedor.faturamento)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
