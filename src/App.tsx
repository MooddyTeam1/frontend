import React, { useEffect } from "react";
import { AppRoutes } from "./router";
import { Header } from "./shared/components/layout/Header";
import { Footer } from "./shared/components/layout/Footer";
import { SupporterOnboardingModal } from "./features/onboarding/components/SupporterOnboardingModal";
import { useSupporterOnboardingStore } from "./features/onboarding/stores/supporterOnboardingStore";
import { useAuthStore } from "./features/auth/stores/authStore";
import { useSseNotification } from "./features/notifications/hooks/useSseNotification";

export const App: React.FC = () => {
  // 한글 설명: 서포터 온보딩 스토어
  const { openIfNeeded } = useSupporterOnboardingStore();
  const { isAuthenticated } = useAuthStore();

  // 한글 설명: SSE를 사용한 실시간 알림 구독
  useSseNotification();

  // 한글 설명: 로그인 후 서포터 온보딩 모달 자동 노출 체크
  useEffect(() => {
    if (isAuthenticated) {
      // 한글 설명: 로그인 직후 온보딩 모달이 필요한지 확인
      openIfNeeded().catch((error) => {
        console.error("온보딩 모달 열기 실패", error);
      });
    }
  }, [isAuthenticated, openIfNeeded]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
      {/* 한글 설명: 서포터 온보딩 모달 (로그인 후 자동 노출) */}
      <SupporterOnboardingModal />
    </div>
  );
};
