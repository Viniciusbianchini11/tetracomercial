import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TopSeller {
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

  const getSellerPhoto = (name: string) => {
    return SELLER_PHOTOS[name.toLowerCase().trim()];
  };

  const getSellerInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
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
              <Avatar className="h-16 w-16 mb-2 border-4 border-gray-300">
                <AvatarImage src={getSellerPhoto(sellers[1].vendedor)} alt={sellers[1].vendedor} />
                <AvatarFallback>{getSellerInitials(sellers[1].vendedor)}</AvatarFallback>
              </Avatar>
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
              <Avatar className="h-20 w-20 mb-2 border-4 border-yellow-400">
                <AvatarImage src={getSellerPhoto(sellers[0].vendedor)} alt={sellers[0].vendedor} />
                <AvatarFallback>{getSellerInitials(sellers[0].vendedor)}</AvatarFallback>
              </Avatar>
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
              <Avatar className="h-14 w-14 mb-2 border-4 border-orange-400">
                <AvatarImage src={getSellerPhoto(sellers[2].vendedor)} alt={sellers[2].vendedor} />
                <AvatarFallback>{getSellerInitials(sellers[2].vendedor)}</AvatarFallback>
              </Avatar>
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
