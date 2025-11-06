import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, User, LogOut } from "lucide-react";
import { useSellerAuth } from "@/contexts/SellerAuthContext";

export const Header = () => {
  const location = useLocation();
  const { user, logout } = useSellerAuth();

  return (
    <div className="border-b bg-background">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Dashboard Comercial</h1>
          <div className="flex gap-1.5">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
              >
                <LayoutDashboard className="mr-1.5 h-3 w-3" />
                Geral
              </Button>
            </Link>
            <Link to="/vendedor">
              <Button 
                variant={location.pathname === "/vendedor" ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
              >
                <User className="mr-1.5 h-3 w-3" />
                Vendedor
              </Button>
            </Link>
            {user && (
              <Button 
                variant="outline"
                size="sm"
                onClick={logout}
                className="h-8 text-xs"
              >
                <LogOut className="mr-1.5 h-3 w-3" />
                Sair
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
