import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { DailyReportCard } from "@/components/DailyReportCard";
import { useDailyReports } from "@/hooks/useDailyReports";

export const Reports = () => {
  const { reports, loading } = useDailyReports();

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-8 p-4">
        {reports.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhum relatório encontrado
          </div>
        ) : (
          reports.map((report) => (
            <DailyReportCard key={report.date} report={report} />
          ))
        )}
      </div>
    </ScrollArea>
  );
};
