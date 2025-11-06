import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCallsData } from "@/hooks/useCallsData";
import { Skeleton } from "@/components/ui/skeleton";
import { CSVUpload } from "@/components/CSVUpload";
import { Phone, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CallsChartProps {
  startDate?: Date;
  endDate?: Date;
}

export const CallsChart = ({ startDate, endDate }: CallsChartProps) => {
  const { callsData, loading, refetch } = useCallsData({ startDate, endDate });

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  const totalTentativas = callsData.reduce((sum, item) => sum + item.tentativas, 0);
  const totalConexoes = callsData.reduce((sum, item) => sum + item.conexoes, 0);
  const taxaConexao = totalTentativas > 0 ? ((totalConexoes / totalTentativas) * 100).toFixed(1) : "0";

  // Ordenar por conexões (maior para menor)
  const sortedData = [...callsData].sort((a, b) => b.conexoes - a.conexoes);

  const getPerformanceBadge = (taxa: number) => {
    if (taxa >= 50) return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Excelente</Badge>;
    if (taxa >= 30) return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">Bom</Badge>;
    if (taxa >= 15) return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Regular</Badge>;
    return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Baixo</Badge>;
  };

  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="border-b bg-muted/20">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Performance de Ligações</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold text-primary">{taxaConexao}%</span>
              </div>
              <span className="text-sm text-muted-foreground">Taxa média de conexão</span>
            </div>
          </div>
          <CSVUpload onUploadSuccess={refetch} />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {sortedData.length > 0 ? (
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">Vendedor</TableHead>
                  <TableHead className="text-center font-semibold">Tentativas</TableHead>
                  <TableHead className="text-center font-semibold">Conexões</TableHead>
                  <TableHead className="text-center font-semibold">Taxa</TableHead>
                  <TableHead className="text-center font-semibold">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item, index) => {
                  const taxa = item.tentativas > 0 
                    ? ((item.conexoes / item.tentativas) * 100).toFixed(1)
                    : "0";
                  
                  return (
                    <TableRow 
                      key={item.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-normal">
                            #{index + 1}
                          </span>
                          <span>{item.nome_vendedor}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-muted/50 text-sm font-medium">
                          {item.tentativas}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                          {item.conexoes}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm font-semibold">{taxa}%</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {getPerformanceBadge(Number(taxa))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground gap-3">
            <Phone className="h-12 w-12 opacity-20" />
            <div className="text-center">
              <p className="font-medium">Nenhum dado disponível</p>
              <p className="text-sm">Faça upload de um CSV para visualizar</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
