import { MetricCard } from "@/components/MetricCard";
import { DollarSign, Target, TrendingUp, Percent, RefreshCw, AlertCircle } from "lucide-react";

interface SalesMetricsCardsProps {
  faturamentoBruto: number;
  pistas: number;
  vendas: number;
  taxaConversao: number;
  recorrentes: number;
  foraLancamento: number;
}

export const SalesMetricsCards = ({
  faturamentoBruto,
  pistas,
  vendas,
  taxaConversao,
  recorrentes,
  foraLancamento,
}: SalesMetricsCardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <li className="min-h-[14rem] list-none">
        <MetricCard
          title="Faturamento bruto"
          value={formatCurrency(faturamentoBruto)}
          icon={DollarSign}
        />
      </li>
      <li className="min-h-[14rem] list-none">
        <MetricCard
          title="Pistas"
          value={pistas}
          icon={Target}
        />
      </li>
      <li className="min-h-[14rem] list-none">
        <MetricCard
          title="Vendas"
          value={vendas}
          icon={TrendingUp}
        />
      </li>
      <li className="min-h-[14rem] list-none">
        <MetricCard
          title="Taxa de Conversão"
          value={`${taxaConversao.toFixed(1)}%`}
          icon={Percent}
        />
      </li>
      <li className="min-h-[14rem] list-none">
        <MetricCard
          title="Recorrentes"
          value={recorrentes || "-"}
          icon={RefreshCw}
        />
      </li>
      <li className="min-h-[14rem] list-none">
        <MetricCard
          title="Fora do Lançamento"
          value={foraLancamento}
          icon={AlertCircle}
        />
      </li>
    </ul>
  );
};
