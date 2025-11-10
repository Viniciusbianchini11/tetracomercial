import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SellerRank {
  vendedor: string;
  vendas: number;
  faturamento: number;
}

const SELLER_PHOTOS: Record<string, string> = {
  "barbara": "https://tetraeducacao.com.br/barbara.png",
  "sabrina": "https://tetraeducacao.com.br/sabrina1.png",
  "vladmir": "https://tetraeducacao.com.br/vladimir.png",
  "alexia": "https://tetraeducacao.com.br/alexia.png",
  "kimberly": "https://tetraeducacao.com.br/kimberly.png",
  "thaynara": "https://tetraeducacao.com.br/thaynara.png",
  "wemille": "https://tetraeducacao.com.br/WEMILLE.png",
  "geovanna": "https://tetraeducacao.com.br/geovanna.png",
  "elton": "https://tetraeducacao.com.br/elton.png",
  "celina": "https://tetraeducacao.com.br/celina.png",
};

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

  const getSellerPhoto = (name: string) => {
    return SELLER_PHOTOS[name.toLowerCase().trim()];
  };

  const getSellerInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
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
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getSellerPhoto(seller.vendedor)} alt={seller.vendedor} />
                  <AvatarFallback>{getSellerInitials(seller.vendedor)}</AvatarFallback>
                </Avatar>
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
