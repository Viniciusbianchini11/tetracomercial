import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TrafficChartProps {
  data: Array<{
    date: string;
    amountSpent: number;
    leads: number;
    cpl: number;
  }>;
}

export const TrafficChart = ({ data }: TrafficChartProps) => {
  const chartData = data.map((item) => ({
    date: format(new Date(item.date + "T00:00:00"), "dd 'de' MMM", { locale: ptBR }),
    "Amount Spent": item.amountSpent,
    "Leads": item.leads,
    "CPL": item.cpl,
  }));

  const chartConfig = {
    "Amount Spent": {
      label: "Investimento",
      color: "hsl(var(--chart-1))",
    },
    "Leads": {
      label: "Leads",
      color: "hsl(var(--chart-2))",
    },
    "CPL": {
      label: "CPL",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investimento e Leads Capturados por Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="Amount Spent" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Leads" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="CPL" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
