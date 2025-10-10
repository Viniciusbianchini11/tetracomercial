import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const GoalsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metas do Lançamento</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground py-8">
          Aguardando configuração de metas
        </p>
      </CardContent>
    </Card>
  );
};
