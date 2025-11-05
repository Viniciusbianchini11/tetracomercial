import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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

  const chartData = callsData.map(item => ({
    vendedor: item.nome_vendedor,
    tentativas: item.tentativas,
    conexoes: item.conexoes,
  }));

  const totalTentativas = callsData.reduce((sum, item) => sum + item.tentativas, 0);
  const totalConexoes = callsData.reduce((sum, item) => sum + item.conexoes, 0);
  const taxaConexao = totalTentativas > 0 ? ((totalConexoes / totalTentativas) * 100).toFixed(1) : "0";

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Ligações Diárias</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Taxa de Conexão: {taxaConexao}%
            </p>
          </div>
          <CSVUpload onUploadSuccess={refetch} />
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="vendedor" 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tentativas" fill="hsl(var(--primary))" name="Tentativas" />
              <Bar dataKey="conexoes" fill="hsl(var(--chart-2))" name="Conexões" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Nenhum dado disponível. Faça upload de um CSV para visualizar.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
