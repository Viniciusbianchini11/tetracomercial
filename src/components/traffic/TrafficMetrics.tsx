interface TrafficMetricsProps {
  valorGasto: number;
  alcance: number;
  frequencia: number;
  view3s: number;
  ctr: number;
  cpm: number;
  leads: number;
  cpl: number;
}

export const TrafficMetrics = ({
  valorGasto,
  alcance,
  frequencia,
  view3s,
  ctr,
  cpm,
  leads,
  cpl,
}: TrafficMetricsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals).replace(".", ",");
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="text-xs text-muted-foreground mb-1">Valor gasto</div>
        <div className="text-lg font-bold">{formatCurrency(valorGasto)}</div>
      </div>
      
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="text-xs text-muted-foreground mb-1">Alcance</div>
        <div className="text-lg font-bold">{alcance.toLocaleString("pt-BR")}</div>
      </div>
      
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="text-xs text-muted-foreground mb-1">Frequência</div>
        <div className="text-lg font-bold">{formatNumber(frequencia)}</div>
      </div>
      
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="text-xs text-muted-foreground mb-1">View 3s</div>
        <div className="text-lg font-bold">{formatNumber(view3s)}</div>
      </div>
      
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="text-xs text-muted-foreground mb-1">CTR</div>
        <div className="text-lg font-bold text-destructive">{formatNumber(ctr)}%</div>
      </div>
      
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="text-xs text-muted-foreground mb-1">CPM</div>
        <div className="text-lg font-bold">{formatNumber(cpm)}</div>
      </div>
      
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="text-xs text-muted-foreground mb-1">Leads</div>
        <div className="text-lg font-bold">{leads.toLocaleString("pt-BR")}</div>
      </div>
      
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="text-xs text-muted-foreground mb-1">CPL</div>
        <div className="text-lg font-bold text-destructive">{formatNumber(cpl)}</div>
      </div>
    </div>
  );
};
