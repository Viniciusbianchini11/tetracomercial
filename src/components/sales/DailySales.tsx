import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailySalesProps {
  title: string;
  vendas: number;
  faturamento: number;
  faturamentoFinal?: number;
  porVendedor: Array<{
    vendedor: string;
    vendas: number;
    faturamento: number;
    faturamentoFinal?: number;
  }>;
}

export const DailySales = ({ title, vendas, faturamento, faturamentoFinal, porVendedor }: DailySalesProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Vendas</p>
            <p className="text-3xl font-bold">{vendas}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Faturamento {faturamentoFinal ? '(Cheio)' : ''}</p>
            <p className="text-3xl font-bold">{formatCurrency(faturamento)}</p>
          </div>
          
          {faturamentoFinal !== undefined && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Valor Final</p>
              <p className="text-3xl font-bold">{formatCurrency(faturamentoFinal)}</p>
            </div>
          )}
          
          {porVendedor.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Por vendedor:</p>
              <div className="space-y-2">
                {porVendedor.map((vendedor, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
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
      </CardContent>
    </Card>
  );
};
