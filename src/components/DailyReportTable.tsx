import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface DailySale {
  seller: string;
  quantity: number;
  value: number;
  percentage: number;
  boletoPercentage: number;
  cartaoPercentage: number;
}

interface DailyReport {
  date: string;
  sales: DailySale[];
  totalQuantity: number;
  totalValue: number;
  totalBoletoPercentage: number;
  totalCartaoPercentage: number;
}

interface DailyReportTableProps {
  report: DailyReport;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const DailyReportTable = ({ report }: DailyReportTableProps) => {
  const formatDate = (date: string) => {
    if (!date) return "-";
    try {
      return format(new Date(date + "T00:00:00"), "dd/MM/yyyy");
    } catch {
      return "-";
    }
  };
  
  const formattedDate = formatDate(report.date);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="bg-primary text-primary-foreground p-3 text-center font-bold">
          RESULTADO DIÁRIO
        </div>
        <div className="bg-primary/80 text-primary-foreground p-2 text-center font-semibold">
          {formattedDate}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">VENDEDOR</TableHead>
              <TableHead className="text-center">QUANTIDADE</TableHead>
              <TableHead className="text-center">VALOR</TableHead>
              <TableHead className="text-center">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.sales.map((sale) => (
              <TableRow key={sale.seller}>
                <TableCell className="text-center font-medium">{sale.seller}</TableCell>
                <TableCell className="text-center">{sale.quantity}</TableCell>
                <TableCell className="text-center">{formatCurrency(sale.value)}</TableCell>
                <TableCell className="text-center">{sale.percentage.toFixed(0)}%</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-bold">
              <TableCell className="text-center">Total geral</TableCell>
              <TableCell className="text-center">{report.totalQuantity}</TableCell>
              <TableCell className="text-center">{formatCurrency(report.totalValue)}</TableCell>
              <TableCell className="text-center">100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      <Card className="overflow-hidden">
        <div className="bg-primary/80 text-primary-foreground p-2 text-center font-semibold">
          {formattedDate}
        </div>
        <div className="bg-muted p-2 text-center font-semibold italic">
          FORMA DE PAGAMENTO
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center italic">VENDEDOR</TableHead>
              <TableHead className="text-center bg-primary/20">BOLETO</TableHead>
              <TableHead className="text-center bg-muted">CARTÃO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.sales.map((sale) => (
              <TableRow key={sale.seller}>
                <TableCell className="text-center font-medium">{sale.seller}</TableCell>
                <TableCell className="text-center bg-primary/5">
                  {sale.quantity > 0 && sale.boletoPercentage > 0 ? `${sale.boletoPercentage.toFixed(2)}%` : "-"}
                </TableCell>
                <TableCell className="text-center bg-muted/30">
                  {sale.quantity > 0 && sale.cartaoPercentage > 0 ? `${sale.cartaoPercentage.toFixed(2)}%` : "-"}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-bold">
              <TableCell className="text-center">Total geral</TableCell>
              <TableCell className="text-center">{report.totalBoletoPercentage.toFixed(2)}%</TableCell>
              <TableCell className="text-center">{report.totalCartaoPercentage.toFixed(2)}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
