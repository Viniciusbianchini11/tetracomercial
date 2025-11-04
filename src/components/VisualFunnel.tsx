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
    "from-cyan-400 to-cyan-500",
    "from-teal-400 to-teal-500", 
    "from-blue-400 to-blue-500",
    "from-indigo-400 to-indigo-500",
    "from-purple-400 to-purple-500",
    "from-violet-400 to-violet-500",
  ];

  return (
    <div className="relative flex flex-col items-center justify-center py-6 px-4">
      {stages.map((stage, index) => {
        const width = 100 - (index * 12);
        const colorClass = colors[index % colors.length];
        
        return (
          <div
            key={index}
            className="relative flex flex-col items-center w-full group"
            style={{ marginBottom: index < stages.length - 1 ? '-8px' : '0' }}
          >
            <div
              className={`bg-gradient-to-br ${colorClass} rounded-2xl shadow-xl flex flex-col items-center justify-center py-5 px-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover-scale border border-white/20`}
              style={{
                width: `${width}%`,
                minWidth: '140px',
                height: '100px',
              }}
            >
              <span className="text-3xl font-bold text-white drop-shadow-lg animate-fade-in">
                {stage.count}
              </span>
              <span className="text-xs font-semibold text-white/95 mt-1 text-center uppercase tracking-wide">
                {stage.label}
              </span>
              {stage.percentage > 0 && (
                <span className="text-xs text-white/80 mt-1 font-medium">
                  {stage.percentage}%
                </span>
              )}
            </div>
          </div>
        );
      })}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent pointer-events-none" />
    </div>
  );
};
