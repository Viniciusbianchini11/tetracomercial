interface FunnelStageData {
  label: string;
  count: number;
  percentage: number;
}

interface VisualFunnelProps {
  stages: FunnelStageData[];
}

export const VisualFunnel = ({ stages }: VisualFunnelProps) => {
  const colors = [
    "bg-[hsl(180,60%,70%)]", // Light teal
    "bg-[hsl(200,25%,60%)]", // Light gray-blue
    "bg-[hsl(180,50%,65%)]", // Medium teal
    "bg-[hsl(200,20%,55%)]", // Medium gray
  ];

  return (
    <div className="relative flex flex-col items-center justify-center py-8 px-4">
      {stages.map((stage, index) => {
        const width = 100 - (index * 15); // Decrease width for funnel effect
        const colorClass = colors[index % colors.length];
        
        return (
          <div
            key={index}
            className="relative flex flex-col items-center"
            style={{ width: '100%', marginBottom: index < stages.length - 1 ? '-10px' : '0' }}
          >
            <div
              className={`${colorClass} rounded-3xl shadow-lg flex flex-col items-center justify-center py-6 px-4 transition-all hover:scale-105`}
              style={{
                width: `${width}%`,
                minWidth: '120px',
                height: index === stages.length - 1 ? '100px' : '120px',
                clipPath: index === stages.length - 1 
                  ? 'polygon(20% 0%, 80% 0%, 50% 100%)' 
                  : 'ellipse(100% 100% at 50% 50%)',
              }}
            >
              <span className="text-3xl font-bold text-white drop-shadow-lg">
                {stage.count}
              </span>
              <span className="text-sm font-medium text-white/90 mt-1 text-center">
                {stage.label}
              </span>
              <span className="text-xs text-white/80 mt-0.5">
                {stage.percentage}%
              </span>
            </div>
          </div>
        );
      })}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-gradient-to-b from-primary/20 to-transparent" />
    </div>
  );
};
