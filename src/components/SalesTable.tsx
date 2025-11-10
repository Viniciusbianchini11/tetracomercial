import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalesData } from "@/hooks/useSalesData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export const SalesTable = () => {
  const { salesData, loading } = useSalesData();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acompanhamento de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (salesData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acompanhamento de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Nenhuma venda encontrada
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number | null) => {
    if (!value) return "R$ 0,00";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "-";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acompanhamento de Vendas</CardTitle>
        <p className="text-sm text-muted-foreground">
          Últimas 100 vendas registradas
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Valor Faturado</TableHead>
                <TableHead className="text-right">Valor Ticket</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{formatDate(sale.DATA)}</TableCell>
                  <TableCell className="font-medium">{sale.NOME || "-"}</TableCell>
                  <TableCell>{sale["E-MAIL"] || "-"}</TableCell>
                  <TableCell>{sale.TELEFONE || "-"}</TableCell>
                  <TableCell>{sale.VENDEDOR || "-"}</TableCell>
                  <TableCell>{sale.PRODUTO || "-"}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(sale["VALOR FATURADO (CHEIO)"])}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(sale["VALOR FINAL"])}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
