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
    return <Skeleton className="h-[280px] w-full" />;
  }

  const totalTentativas = callsData.reduce((sum, item) => sum + item.tentativas, 0);
  const totalConexoes = callsData.reduce((sum, item) => sum + item.conexoes, 0);
  const taxaConexao = totalTentativas > 0 ? ((totalConexoes / totalTentativas) * 100).toFixed(1) : "0";

  // Ordenar por conexões (maior para menor)
  const sortedData = [...callsData].sort((a, b) => b.conexoes - a.conexoes);

  const getPerformanceBadge = (taxa: number) => {
    if (taxa >= 50) return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs px-1 py-0">Excelente</Badge>;
    if (taxa >= 30) return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-xs px-1 py-0">Bom</Badge>;
    if (taxa >= 15) return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 text-xs px-1 py-0">Regular</Badge>;
    return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs px-1 py-0">Baixo</Badge>;
  };

  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="border-b bg-muted/20 pb-2 pt-3 px-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Performance Ligações</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-lg font-bold text-primary">{taxaConexao}%</span>
              <span className="text-xs text-muted-foreground">taxa conexão</span>
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
                <TableRow className="bg-muted/30 hover:bg-muted/30 h-8">
                  <TableHead className="font-semibold text-xs py-1">Vendedor</TableHead>
                  <TableHead className="text-center font-semibold text-xs py-1">Tent.</TableHead>
                  <TableHead className="text-center font-semibold text-xs py-1">Conex.</TableHead>
                  <TableHead className="text-center font-semibold text-xs py-1">Taxa</TableHead>
                  <TableHead className="text-center font-semibold text-xs py-1">Perf.</TableHead>
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
                      className="hover:bg-muted/50 transition-colors h-9"
                    >
                      <TableCell className="font-medium text-xs py-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground font-normal">
                            #{index + 1}
                          </span>
                          <span className="truncate max-w-[120px]">{item.nome_vendedor}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-1">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-muted/50 text-xs font-medium">
                          {item.tentativas}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-1">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          {item.conexoes}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-1">
                        <span className="text-xs font-semibold">{taxa}%</span>
                      </TableCell>
                      <TableCell className="text-center py-1">
                        {getPerformanceBadge(Number(taxa))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground gap-2">
            <Phone className="h-8 w-8 opacity-20" />
            <div className="text-center">
              <p className="font-medium text-xs">Nenhum dado disponível</p>
              <p className="text-xs">Faça upload de um CSV</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
