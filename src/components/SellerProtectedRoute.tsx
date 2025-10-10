import { Navigate } from "react-router-dom";
import { useSellerAuth } from "@/contexts/SellerAuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export const SellerProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useSellerAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-8">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/vendedor/login" replace />;
  }

  return <>{children}</>;
};
