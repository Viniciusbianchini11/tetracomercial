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

interface DailyCalls {
  seller: string;
  tentativas: number;
  conexoes: number;
}

interface DailyReport {
  date: string;
  sales: DailySale[];
  totalQuantity: number;
  totalValue: number;
  totalBoletoPercentage: number;
  totalCartaoPercentage: number;
  calls: DailyCalls[];
  totalTentativas: number;
  totalConexoes: number;
}

interface DailyReportCardProps {
  report: DailyReport;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const DailyReportCard = ({ report }: DailyReportCardProps) => {
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
    <div className="grid grid-cols-3 gap-3">
      {/* Card de Vendas */}
      <Card className="overflow-hidden">
        <div className="bg-primary text-primary-foreground px-3 py-1.5 text-center text-sm font-bold">
          RESULTADO DIÁRIO
        </div>
        <div className="bg-primary/80 text-primary-foreground px-3 py-1 text-center text-xs font-semibold">
          {formattedDate}
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="text-center text-xs py-2 h-auto">VENDEDOR</TableHead>
              <TableHead className="text-center text-xs py-2 h-auto">QTD</TableHead>
              <TableHead className="text-center text-xs py-2 h-auto">VALOR</TableHead>
              <TableHead className="text-center text-xs py-2 h-auto">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.sales.map((sale) => (
              <TableRow key={sale.seller} className="border-b">
                <TableCell className="text-center text-xs py-1.5 font-medium">{sale.seller}</TableCell>
                <TableCell className="text-center text-xs py-1.5">{sale.quantity}</TableCell>
                <TableCell className="text-center text-xs py-1.5">{formatCurrency(sale.value)}</TableCell>
                <TableCell className="text-center text-xs py-1.5">{sale.percentage.toFixed(0)}%</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-bold border-t">
              <TableCell className="text-center text-xs py-1.5">Total</TableCell>
              <TableCell className="text-center text-xs py-1.5">{report.totalQuantity}</TableCell>
              <TableCell className="text-center text-xs py-1.5">{formatCurrency(report.totalValue)}</TableCell>
              <TableCell className="text-center text-xs py-1.5">100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* Card de Forma de Pagamento */}
      <Card className="overflow-hidden">
        <div className="bg-primary/80 text-primary-foreground px-3 py-1 text-center text-xs font-semibold">
          {formattedDate}
        </div>
        <div className="bg-muted px-3 py-1 text-center text-xs font-semibold italic">
          FORMA DE PAGAMENTO
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="text-center text-xs py-2 h-auto italic">VENDEDOR</TableHead>
              <TableHead className="text-center text-xs py-2 h-auto bg-primary/20">BOLETO</TableHead>
              <TableHead className="text-center text-xs py-2 h-auto bg-muted">CARTÃO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.sales
              .filter(sale => sale.quantity > 0)
              .map((sale) => (
                <TableRow key={sale.seller} className="border-b">
                  <TableCell className="text-center text-xs py-1.5 font-medium">{sale.seller}</TableCell>
                  <TableCell className="text-center text-xs py-1.5 bg-primary/5">
                    {sale.boletoPercentage > 0 ? `${sale.boletoPercentage.toFixed(2)}%` : ""}
                  </TableCell>
                  <TableCell className="text-center text-xs py-1.5 bg-muted/30">
                    {sale.cartaoPercentage > 0 ? `${sale.cartaoPercentage.toFixed(2)}%` : ""}
                  </TableCell>
                </TableRow>
              ))}
            <TableRow className="bg-muted font-bold border-t">
              <TableCell className="text-center text-xs py-1.5">Total</TableCell>
              <TableCell className="text-center text-xs py-1.5">{report.totalBoletoPercentage.toFixed(2)}%</TableCell>
              <TableCell className="text-center text-xs py-1.5">{report.totalCartaoPercentage.toFixed(2)}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* Card de Ligações */}
      <Card className="overflow-hidden">
        <div className="bg-primary/80 text-primary-foreground px-3 py-1 text-center text-xs font-semibold">
          {formattedDate}
        </div>
        <div className="bg-muted px-3 py-1 text-center text-xs font-semibold italic">
          LIGAÇÕES DO DIA
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="text-center text-xs py-2 h-auto italic">VENDEDOR</TableHead>
              <TableHead className="text-center text-xs py-2 h-auto">TENTATIVAS</TableHead>
              <TableHead className="text-center text-xs py-2 h-auto">CONEXÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.calls.map((call) => (
              <TableRow key={call.seller} className="border-b">
                <TableCell className="text-center text-xs py-1.5 font-medium">{call.seller}</TableCell>
                <TableCell className="text-center text-xs py-1.5">{call.tentativas}</TableCell>
                <TableCell className="text-center text-xs py-1.5">{call.conexoes}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted font-bold border-t">
              <TableCell className="text-center text-xs py-1.5">Total</TableCell>
              <TableCell className="text-center text-xs py-1.5">{report.totalTentativas}</TableCell>
              <TableCell className="text-center text-xs py-1.5">{report.totalConexoes}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
