// 한글 설명: 온보딩 상태 관리 훅
import { useState, useEffect } from "react";
import { useAuthStore } from "../../auth/stores/authStore";
import { getOnboardingStatus } from "../api/onboardingService";
import type { OnboardingStatus } from "../types";

export const useOnboarding = () => {
  const { isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setStatus(null);
      setLoading(false);
      return;
    }

    // 한글 설명: 로그인된 경우 온보딩 상태 조회
    const loadStatus = async () => {
      try {
        setLoading(true);
        const response = await getOnboardingStatus();
        setStatus(response.status);
      } catch (error) {
        console.error("온보딩 상태 조회 실패", error);
        setStatus("NOT_STARTED"); // 한글 설명: 에러 시 기본값
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, [isAuthenticated]);

  // 한글 설명: 온보딩 풀스크린 표시 여부 (첫 로그인, NOT_STARTED 상태)
  const shouldShowFullScreen = isAuthenticated && status === "NOT_STARTED";

  // 한글 설명: 온보딩 배너 표시 여부 (SKIPPED_ONCE 상태)
  const shouldShowBanner = isAuthenticated && status === "SKIPPED_ONCE";

  // 한글 설명: 상태 새로고침
  const refreshStatus = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await getOnboardingStatus();
      setStatus(response.status);
    } catch (error) {
      console.error("온보딩 상태 조회 실패", error);
    }
  };

  return {
    status,
    loading,
    shouldShowFullScreen,
    shouldShowBanner,
    refreshStatus,
  };
};

