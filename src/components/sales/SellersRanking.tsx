import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SellerRank {
  vendedor: string;
  vendas: number;
  faturamento: number;
}

interface SellersRankingProps {
  title: string;
  sellers: SellerRank[];
  showSalesCount?: boolean;
}

export const SellersRanking = ({ title, sellers, showSalesCount = false }: SellersRankingProps) => {
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
        <div className="space-y-3">
          {sellers.map((seller, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">#{index + 1}</span>
                <span className="font-medium uppercase">{seller.vendedor}</span>
              </div>
              <div className="text-right">
                {showSalesCount && (
                  <p className="text-sm text-muted-foreground">{seller.vendas} vendas</p>
                )}
                <p className="font-semibold">{formatCurrency(seller.faturamento)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
