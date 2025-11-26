// 한글 설명: 서포터 온보딩 Step1 컴포넌트 (관심 카테고리 + 선호 스타일)
// 페이지 형태의 온보딩 플로우에서 사용되는 Step1 컴포넌트
// 관심 카테고리(필수)와 선호 스타일(선택)을 선택할 수 있는 UI 제공
import React, { useState } from "react";
import type {
  SupporterOnboardingStep1Request,
  ProjectCategory,
  ProjectStylePreference,
} from "../../../features/onboarding/types/supporterOnboarding";
import {
  CATEGORY_OPTIONS_FOR_ONBOARDING,
  categoryLabelToEnum,
  PROJECT_STYLE_OPTIONS,
} from "../../../features/onboarding/types/supporterOnboarding";
import type { CategoryLabel } from "../../../shared/utils/categorymapper";

// 한글 설명: Step1 컴포넌트 Props
type SupporterOnboardingStep1Props = {
  onNext: (payload: SupporterOnboardingStep1Request) => Promise<void>;
  onSkip: () => Promise<void>;
  isSubmitting: boolean;
};

// 한글 설명: 서포터 온보딩 Step1 컴포넌트
export const SupporterOnboardingStep1: React.FC<
  SupporterOnboardingStep1Props
> = ({ onNext, onSkip, isSubmitting }) => {
  // 한글 설명: 선택된 관심 카테고리 (한글 라벨로 관리)
  const [selectedCategories, setSelectedCategories] = useState<
    Set<CategoryLabel>
  >(new Set());
  // 한글 설명: 선택된 선호 스타일
  const [selectedStyles, setSelectedStyles] = useState<
    Set<ProjectStylePreference>
  >(new Set());
  // 한글 설명: 유효성 검사 에러 메시지
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 관심 카테고리 토글
  const toggleCategory = (label: CategoryLabel) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
    // 한글 설명: 선택 시 에러 메시지 제거
    if (error) {
      setError(null);
    }
  };

  // 한글 설명: 선호 스타일 토글
  const toggleStyle = (style: ProjectStylePreference) => {
    setSelectedStyles((prev) => {
      const next = new Set(prev);
      if (next.has(style)) {
        next.delete(style);
      } else {
        next.add(style);
      }
      return next;
    });
  };

  // 한글 설명: 다음 버튼 클릭 핸들러
  const handleNext = async () => {
    // 한글 설명: 유효성 검사 - 관심 카테고리는 최소 1개 이상 선택 필수
    if (selectedCategories.size === 0) {
      setError("관심 카테고리를 최소 1개 이상 선택해 주세요.");
      return;
    }

    setError(null);

    // 한글 설명: 한글 라벨을 백엔드 enum으로 변환
    const interestCategories: ProjectCategory[] = Array.from(
      selectedCategories
    ).map((label) => categoryLabelToEnum(label));

    const payload: SupporterOnboardingStep1Request = {
      interestCategories,
      preferredStyles:
        selectedStyles.size > 0 ? Array.from(selectedStyles) : undefined,
    };

    try {
      await onNext(payload);
    } catch (error) {
      console.error("Step1 제출 실패", error);
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
          기본 프로필 설정
        </h2>
        <p className="text-sm text-neutral-600">
          관심사와 선호도를 알려주시면 더 잘 맞는 프로젝트를 추천해드려요
        </p>
      </div>

      {/* 한글 설명: 에러 메시지 */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 한글 설명: 관심 카테고리 선택 */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-neutral-900">
          관심 카테고리 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS_FOR_ONBOARDING.map((label: CategoryLabel) => {
            const isSelected = selectedCategories.has(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleCategory(label)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-neutral-500">최소 1개 이상 선택해 주세요.</p>
      </div>

      {/* 한글 설명: 선호 스타일 선택 */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-neutral-900">
          선호하는 프로젝트 스타일 (선택)
        </label>
        <div className="flex flex-wrap gap-2">
          {PROJECT_STYLE_OPTIONS.map((option) => {
            const isSelected = selectedStyles.has(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleStyle(option.value)}
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
        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting || selectedCategories.size === 0}
          className="rounded-full border border-neutral-900 bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "저장 중..." : "다음"}
        </button>
      </div>
    </div>
  );
};

