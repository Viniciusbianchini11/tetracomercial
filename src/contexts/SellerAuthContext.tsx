import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SellerUser {
  id: number;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  permissions: any;
}

interface SellerAuthContextType {
  user: SellerUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const SellerAuthContext = createContext<SellerAuthContextType | undefined>(undefined);

export const SellerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SellerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário no localStorage
    const storedUser = localStorage.getItem("seller_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke("seller-login", {
        body: { email, password },
      });

      if (error) {
        toast.error("Erro ao fazer login");
        return false;
      }

      if (data.error) {
        toast.error(data.error);
        return false;
      }

      if (data.user) {
        setUser(data.user);
        localStorage.setItem("seller_user", JSON.stringify(data.user));
        toast.success("Login realizado com sucesso!");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro ao fazer login");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("seller_user");
    toast.success("Logout realizado com sucesso!");
  };

  return (
    <SellerAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </SellerAuthContext.Provider>
  );
};

export const useSellerAuth = () => {
  const context = useContext(SellerAuthContext);
  if (context === undefined) {
    throw new Error("useSellerAuth must be used within a SellerAuthProvider");
  }
  return context;
};
