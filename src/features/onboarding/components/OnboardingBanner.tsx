// 한글 설명: 온보딩 배너 컴포넌트 (이후 로그인 시 상단 표시)
import React, { useState } from "react";
import { updateOnboardingStatus } from "../api/onboardingService";
import { OnboardingFullScreen } from "./OnboardingFullScreen";

type OnboardingBannerProps = {
  onComplete: () => void;
};

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({
  onComplete,
}) => {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  // 한글 설명: 배너 닫기 핸들러
  const handleDismiss = async () => {
    try {
      setIsDismissing(true);
      await updateOnboardingStatus("DISMISSED");
      onComplete();
    } catch (error) {
      console.error("온보딩 상태 업데이트 실패", error);
      // 한글 설명: 에러가 나도 일단 닫기
      onComplete();
    } finally {
      setIsDismissing(false);
    }
  };

  // 한글 설명: 지금 설정하기 클릭 핸들러
  const handleOpenOnboarding = () => {
    setShowFullScreen(true);
  };

  // 한글 설명: 풀스크린 온보딩 완료 핸들러
  const handleFullScreenComplete = () => {
    setShowFullScreen(false);
    onComplete();
  };

  // 한글 설명: 풀스크린 온보딩 스킵 핸들러
  const handleFullScreenSkip = () => {
    setShowFullScreen(false);
  };

  if (showFullScreen) {
    return (
      <OnboardingFullScreen
        onComplete={handleFullScreenComplete}
        onSkip={handleFullScreenSkip}
      />
    );
  }

  return (
    <div className="border-b border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-neutral-700">
            관심사를 설정하면 더 잘 맞는 프로젝트를 추천해 드려요
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenOnboarding}
              className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
            >
              지금 설정하기
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              disabled={isDismissing}
              className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-600 hover:border-neutral-400 disabled:opacity-50"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

