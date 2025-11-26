// 한글 설명: 서포터 온보딩 Step2 컴포넌트 (추가 정보)
// 페이지 형태의 온보딩 플로우에서 사용되는 Step2 컴포넌트
// 예산 범위, 후원 경험, 유입 경로 등을 선택할 수 있는 UI 제공
// 알림 설정은 계정설정 페이지에서 관리
import React, { useState } from "react";
import type {
  SupporterOnboardingStep2Request,
  BudgetRange,
  FundingExperience,
  AcquisitionChannel,
} from "../../../features/onboarding/types/supporterOnboarding";
import {
  BUDGET_RANGE_OPTIONS,
  FUNDING_EXPERIENCE_OPTIONS,
  ACQUISITION_CHANNEL_OPTIONS,
} from "../../../features/onboarding/types/supporterOnboarding";

// 한글 설명: Step2 컴포넌트 Props
type SupporterOnboardingStep2Props = {
  onComplete: (payload: SupporterOnboardingStep2Request) => Promise<void>;
  onPrevious: () => void;
  onSkip: () => Promise<void>;
  isSubmitting: boolean;
};

// 한글 설명: 서포터 온보딩 Step2 컴포넌트
export const SupporterOnboardingStep2: React.FC<
  SupporterOnboardingStep2Props
> = ({ onComplete, onPrevious, onSkip, isSubmitting }) => {
  // 한글 설명: 폼 상태 (모두 선택 사항)
  const [budgetRange, setBudgetRange] = useState<BudgetRange | undefined>();
  const [fundingExperience, setFundingExperience] = useState<
    FundingExperience | undefined
  >();
  const [acquisitionChannel, setAcquisitionChannel] = useState<
    AcquisitionChannel | undefined
  >();
  const [acquisitionChannelEtc, setAcquisitionChannelEtc] =
    useState<string>("");

  // 한글 설명: 완료 버튼 클릭 핸들러
  const handleComplete = async () => {
    const payload: SupporterOnboardingStep2Request = {
      budgetRange,
      fundingExperience,
      acquisitionChannel,
      acquisitionChannelEtc:
        acquisitionChannel === "OTHER" && acquisitionChannelEtc.trim()
          ? acquisitionChannelEtc.trim()
          : null,
      // 한글 설명: 알림 설정은 계정설정 페이지에서 관리하므로 제외
    };

    try {
      await onComplete(payload);
    } catch (error) {
      console.error("Step2 제출 실패", error);
      // 한글 설명: 에러는 상위 컴포넌트에서 처리하므로 여기서는 로그만 남김
    }
  };

  // 한글 설명: 나중에 하기 버튼 클릭 핸들러
  const handleSkip = async () => {
    try {
      await onSkip();
    } catch (error) {
      console.error("온보딩 스킵 실패", error);
      // 한글 설명: 에러는 상위 컴포넌트에서 처리하므로 여기서는 로그만 남김
    }
  };

  return (
    <div className="space-y-6">
      {/* 한글 설명: 헤더 */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-neutral-900">
          추가 정보 (선택)
        </h2>
        <p className="text-sm text-neutral-600">
          더 나은 서비스를 제공하기 위한 정보입니다
        </p>
      </div>

      <div className="space-y-6">
        {/* 한글 설명: 유입 경로 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-neutral-900">
            MOA를 어떻게 알게 되셨나요?
          </label>
          <div className="flex flex-wrap gap-2">
            {ACQUISITION_CHANNEL_OPTIONS.map((option) => {
              const isSelected = acquisitionChannel === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAcquisitionChannel(option.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {/* 한글 설명: 기타 선택 시 직접 입력 필드 */}
          {acquisitionChannel === "OTHER" && (
            <input
              type="text"
              className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
              placeholder="어떻게 알게 되셨는지 입력해 주세요"
              value={acquisitionChannelEtc}
              onChange={(e) => setAcquisitionChannelEtc(e.target.value)}
            />
          )}
        </div>

        {/* 한글 설명: 예산 범위 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-neutral-900">
            평소 후원 예산 범위
          </label>
          <div className="flex flex-wrap gap-2">
            {BUDGET_RANGE_OPTIONS.map((option) => {
              const isSelected = budgetRange === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setBudgetRange(option.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 한글 설명: 후원 경험 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-neutral-900">
            크라우드펀딩 후원 경험
          </label>
          <div className="flex flex-wrap gap-2">
            {FUNDING_EXPERIENCE_OPTIONS.map((option) => {
              const isSelected = fundingExperience === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFundingExperience(option.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 한글 설명: 액션 버튼 */}
      <div className="flex flex-wrap gap-3 pt-4">
        <button
          type="button"
          onClick={handleSkip}
          disabled={isSubmitting}
          className="rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          나중에 할게요
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          이전
        </button>
        <button
          type="button"
          onClick={handleComplete}
          disabled={isSubmitting}
          className="rounded-full border border-neutral-900 bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "저장 중..." : "완료"}
        </button>
      </div>
    </div>
  );
};

