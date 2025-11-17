interface TrafficFunnelProps {
  impressoes: number;
  cliquesLink: number;
  txPageView: number;
  conversao: number;
}

export const TrafficFunnel = ({
  impressoes,
  cliquesLink,
  txPageView,
  conversao,
}: TrafficFunnelProps) => {
  const formatNumber = (value: number) => {
    return value.toLocaleString("pt-BR");
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2).replace(".", ",")}%`;
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold mb-6">Funil de Captura</h3>
      
      <div className="flex flex-col items-center gap-3">
        <div className="w-full max-w-md bg-foreground text-background rounded-t-lg p-4 text-center relative"
             style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 5% 100%)" }}>
          <div className="text-xs mb-1">Impressões</div>
          <div className="text-2xl font-bold">{formatNumber(impressoes)}</div>
        </div>
        
        <div className="w-full max-w-sm bg-foreground text-background p-4 text-center relative"
             style={{ clipPath: "polygon(5% 0, 95% 0, 90% 100%, 10% 100%)" }}>
          <div className="text-xs mb-1">Cliques no Link</div>
          <div className="text-2xl font-bold">{formatNumber(cliquesLink)}</div>
        </div>
        
        <div className="w-full max-w-xs bg-foreground text-background p-4 text-center relative"
             style={{ clipPath: "polygon(10% 0, 90% 0, 85% 100%, 15% 100%)" }}>
          <div className="text-xs mb-1">Tx Page View</div>
          <div className="text-2xl font-bold">{formatPercentage(txPageView)}</div>
        </div>
        
        <div className="w-full max-w-[200px] bg-foreground text-background rounded-b-lg p-4 text-center relative"
             style={{ clipPath: "polygon(15% 0, 85% 0, 100% 100%, 0% 100%)" }}>
          <div className="text-xs mb-1">Conversão</div>
          <div className="text-2xl font-bold text-green-400">{formatPercentage(conversao / 100)}</div>
        </div>
      </div>
    </div>
  );
};
