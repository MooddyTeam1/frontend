// 한글 설명: 온보딩 모달 팝업 컴포넌트 (첫 로그인 시)
import React, { useState, useEffect } from "react";
import { OnboardingWizard } from "./OnboardingWizard";
import {
  getOnboardingStatus,
  submitOnboarding,
  updateOnboardingStatus,
} from "../api/onboardingService";
import type { OnboardingRequestDTO } from "../types";

type OnboardingFullScreenProps = {
  onComplete: () => void;
  onSkip: () => void;
};

export const OnboardingFullScreen: React.FC<OnboardingFullScreenProps> = ({
  onComplete,
  onSkip,
}) => {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] =
    useState<Partial<OnboardingRequestDTO>>();

  useEffect(() => {
    // 한글 설명: 기존 온보딩 데이터가 있는지 확인
    const loadInitialData = async () => {
      try {
        const status = await getOnboardingStatus();
        if (status.data) {
          setInitialData(status.data);
        }
      } catch (error) {
        console.error("온보딩 상태 조회 실패", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // 한글 설명: 온보딩 완료 핸들러
  const handleComplete = async (data: OnboardingRequestDTO) => {
    try {
      setLoading(true);
      await submitOnboarding(data);
      onComplete();
    } catch (error) {
      console.error("온보딩 제출 실패", error);
      alert("온보딩 정보 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 한글 설명: 나중에 하기 핸들러
  const handleSkip = async () => {
    try {
      setLoading(true);
      await updateOnboardingStatus("SKIPPED_ONCE");
      onSkip();
    } catch (error) {
      console.error("온보딩 상태 업데이트 실패", error);
      // 한글 설명: 에러가 나도 일단 닫기
      onSkip();
    } finally {
      setLoading(false);
    }
  };

  // 한글 설명: 배경 클릭 시 닫기 방지 (온보딩은 완료 또는 나중에 하기로만 닫을 수 있음)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // 한글 설명: 배경 클릭은 무시 (명시적으로 닫기 버튼을 눌러야 함)
    }
  };

  if (loading && !initialData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 mx-auto" />
          <p className="text-sm text-neutral-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* 한글 설명: 닫기 버튼 (나중에 하기와 동일한 동작) */}
        <button
          type="button"
          onClick={handleSkip}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition"
          aria-label="닫기"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          <OnboardingWizard
            initialData={initialData}
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        </div>
      </div>
    </div>
  );
};
