import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, User, LogOut } from "lucide-react";
import { useSellerAuth } from "@/contexts/SellerAuthContext";

export const Header = () => {
  const location = useLocation();
  const { user, logout } = useSellerAuth();

  return (
    <div className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard Comercial</h1>
          <div className="flex gap-2">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "outline"}
                size="sm"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Geral
              </Button>
            </Link>
            <Link to="/vendedor">
              <Button 
                variant={location.pathname === "/vendedor" ? "default" : "outline"}
                size="sm"
              >
                <User className="mr-2 h-4 w-4" />
                Meu Desempenho
              </Button>
            </Link>
            {user && (
              <Button 
                variant="outline"
                size="sm"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
