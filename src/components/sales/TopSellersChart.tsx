import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopSeller {
  vendedor: string;
  vendas: number;
  faturamento: number;
}

interface TopSellersChartProps {
  sellers: TopSeller[];
}

export const TopSellersChart = ({ sellers }: TopSellersChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const podiumColors = [
    "bg-yellow-400",
    "bg-gray-300",
    "bg-orange-400",
  ];

  const podiumHeights = ["h-48", "h-40", "h-32"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 3 meses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-center gap-4 min-h-[300px]">
          {sellers.length >= 2 && (
            <div className="flex flex-col items-center">
              <div className="text-center mb-2">
                <p className="font-bold text-sm uppercase">{sellers[1].vendedor}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(sellers[1].faturamento)}</p>
              </div>
              <div className={`${podiumColors[1]} ${podiumHeights[1]} w-32 rounded-t-lg flex items-center justify-center`}>
                <span className="text-4xl font-bold">2</span>
              </div>
            </div>
          )}
          
          {sellers.length >= 1 && (
            <div className="flex flex-col items-center">
              <div className="text-center mb-2">
                <p className="font-bold text-sm uppercase">{sellers[0].vendedor}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(sellers[0].faturamento)}</p>
              </div>
              <div className={`${podiumColors[0]} ${podiumHeights[0]} w-32 rounded-t-lg flex items-center justify-center`}>
                <span className="text-4xl font-bold">1</span>
              </div>
            </div>
          )}
          
          {sellers.length >= 3 && (
            <div className="flex flex-col items-center">
              <div className="text-center mb-2">
                <p className="font-bold text-sm uppercase">{sellers[2].vendedor}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(sellers[2].faturamento)}</p>
              </div>
              <div className={`${podiumColors[2]} ${podiumHeights[2]} w-32 rounded-t-lg flex items-center justify-center`}>
                <span className="text-4xl font-bold">3</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
