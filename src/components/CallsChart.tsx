import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCallsData } from "@/hooks/useCallsData";
import { Skeleton } from "@/components/ui/skeleton";
import { CSVUpload } from "@/components/CSVUpload";

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

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ligações - tentativas x conexões</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Taxa de Conexão: {taxaConexao}%
            </p>
          </div>
          <CSVUpload onUploadSuccess={refetch} />
        </div>
      </CardHeader>
      <CardContent>
        {callsData.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-center">Tentativas</TableHead>
                  <TableHead className="text-center">Conexões</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callsData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nome_vendedor}</TableCell>
                    <TableCell className="text-center">{item.tentativas}</TableCell>
                    <TableCell className="text-center">{item.conexoes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Nenhum dado disponível. Faça upload de um CSV para visualizar.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
