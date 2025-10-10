import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const NoAccess = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Acesso Restrito</h1>
          <p className="text-muted-foreground mb-6">
            Seu perfil não está configurado como vendedor. Entre em contato com o administrador.
          </p>
          <Link to="/">
            <Button>Voltar para Dashboard Geral</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoAccess;
