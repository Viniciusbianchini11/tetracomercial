import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export const MetricCard = ({ title, value, icon: Icon }: MetricCardProps) => {
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <Icon className="h-5 w-5 text-[hsl(var(--metric-icon))]" />
        </div>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
};
