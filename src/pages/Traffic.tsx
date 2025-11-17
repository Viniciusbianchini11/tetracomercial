import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useTrafficData } from "@/hooks/useTrafficData";
import { TrafficMetrics } from "@/components/traffic/TrafficMetrics";
import { TrafficFunnel } from "@/components/traffic/TrafficFunnel";
import { TrafficChart } from "@/components/traffic/TrafficChart";
import { Skeleton } from "@/components/ui/skeleton";

export const Traffic = () => {
  const { data, loading, fetchTrafficData } = useTrafficData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tráfego de Campanhas</h2>
        <Button onClick={fetchTrafficData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Atualizar Dados
        </Button>
      </div>

      {loading && !data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      ) : data ? (
        <>
          <TrafficMetrics
            valorGasto={data.valorGasto}
            alcance={data.alcance}
            frequencia={data.frequencia}
            view3s={data.view3s}
            ctr={data.ctr}
            cpm={data.cpm}
            leads={data.leads}
            cpl={data.cpl}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrafficFunnel
              impressoes={data.impressoes}
              cliquesLink={data.cliquesLink}
              txPageView={data.txPageView}
              conversao={data.conversao}
            />

            <TrafficChart data={data.dailyData} />
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          Clique em "Atualizar Dados" para carregar as informações de tráfego
        </div>
      )}
    </div>
  );
};
