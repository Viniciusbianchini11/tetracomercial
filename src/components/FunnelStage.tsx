interface FunnelStageProps {
  label: string;
  count: number;
}

export const FunnelStage = ({ label, count }: FunnelStageProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-3 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
      <span className="text-2xl font-bold text-foreground mb-1">{count}</span>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
};
