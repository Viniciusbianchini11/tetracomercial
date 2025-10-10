import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DailySalesProps {
  title: string;
  vendas: number;
  faturamento: number;
}

export const DailySales = ({ title, vendas, faturamento }: DailySalesProps) => {
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
            <p className="text-sm text-muted-foreground mb-1">Faturamento</p>
            <p className="text-3xl font-bold">{formatCurrency(faturamento)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
