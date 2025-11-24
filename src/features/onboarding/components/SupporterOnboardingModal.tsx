// 한글 설명: 서포터 온보딩 모달 컴포넌트
import React from "react";
import { useSupporterOnboardingStore } from "../stores/supporterOnboardingStore";
import { OnboardingStep1 } from "./OnboardingStep1";
import { OnboardingStep2 } from "./OnboardingStep2";

export const SupporterOnboardingModal: React.FC = () => {
  // 한글 설명: 스토어에서 상태 가져오기
  const {
    isModalOpen,
    currentStep,
    isSubmitting,
    goToStep,
    submitStep1,
    submitStep2,
    skip,
  } = useSupporterOnboardingStore();

  // 한글 설명: 모달이 닫혀있으면 렌더링하지 않음
  if (!isModalOpen) {
    return null;
  }

  // 한글 설명: 배경 클릭 시 닫기 방지 (명시적으로 닫기 버튼을 눌러야 함)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // 한글 설명: 배경 클릭은 무시
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* 한글 설명: 현재 단계에 따라 Step1 또는 Step2 렌더링 */}
        {currentStep === 1 ? (
          <OnboardingStep1
            onNext={submitStep1}
            onSkip={skip}
            isSubmitting={isSubmitting}
          />
        ) : (
          <OnboardingStep2
            onComplete={submitStep2}
            onSkip={skip}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};
