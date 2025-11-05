import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/contexts/AuthContext";

export const RequireAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-neutral-500">
        인증 정보를 확인하고 있습니다...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
