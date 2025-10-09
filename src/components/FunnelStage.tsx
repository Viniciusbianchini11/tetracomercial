interface FunnelStageProps {
  label: string;
  count: number;
  percentage: number;
  totalEntries: number;
}

export const FunnelStage = ({ label, count, percentage, totalEntries }: FunnelStageProps) => {
  const widthPercentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0;
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-bold text-foreground">{count}</span>
      </div>
      <div className="relative w-full h-10 bg-[hsl(var(--funnel-bar-bg))] rounded-lg overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-[hsl(var(--funnel-bar))] flex items-center justify-center transition-all duration-500"
          style={{ width: `${widthPercentage}%` }}
        >
          {widthPercentage > 10 && (
            <span className="text-sm font-semibold text-primary-foreground">
              {percentage}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
