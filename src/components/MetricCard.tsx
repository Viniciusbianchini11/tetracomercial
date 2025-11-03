import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export const MetricCard = ({ title, value, icon: Icon }: MetricCardProps) => {
  return (
    <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 group">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
      />
      <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-xl border-[0.75px] bg-card p-6 shadow-sm">
        <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
          <Icon className="h-4 w-4 text-foreground" />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
};
