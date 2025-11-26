import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../features/auth/stores/authStore";

// 한글 설명: Admin 권한이 필요한 페이지를 보호하는 컴포넌트
export const RequireAdmin: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { user, isAuthenticated, loading } = useAuthStore();
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

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
