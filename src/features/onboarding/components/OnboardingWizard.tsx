// 한글 설명: 온보딩 위저드 컴포넌트 (Step 1, Step 2)
import React, { useState } from "react";
import type {
  OnboardingRequestDTO,
  InterestCategory,
  ProjectStylePreference,
  ReferralSource,
  BudgetRange,
  NotificationPreference,
} from "../types";
import {
  INTEREST_CATEGORY_LABELS,
  PROJECT_STYLE_LABELS,
  REFERRAL_SOURCE_LABELS,
  BUDGET_RANGE_LABELS,
  NOTIFICATION_PREFERENCE_LABELS,
} from "../types";

type OnboardingWizardProps = {
  initialData?: Partial<OnboardingRequestDTO>;
  onComplete: (data: OnboardingRequestDTO) => void;
  onSkip: () => void;
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialData,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // 한글 설명: Step 1 데이터
  const [interestCategories, setInterestCategories] = useState<
    InterestCategory[]
  >(initialData?.interestCategories ?? []);
  const [projectStylePreference, setProjectStylePreference] = useState<
    ProjectStylePreference | null
  >(initialData?.projectStylePreference ?? null);

  // 한글 설명: Step 2 데이터
  const [referralSource, setReferralSource] = useState<ReferralSource | null>(
    initialData?.referralSource ?? null
  );
  const [referralSourceOther, setReferralSourceOther] = useState(
    initialData?.referralSourceOther ?? ""
  );
  const [budgetRange, setBudgetRange] = useState<BudgetRange | null>(
    initialData?.budgetRange ?? null
  );
  const [hasBackingExperience, setHasBackingExperience] = useState<
    boolean | null
  >(initialData?.hasBackingExperience ?? null);
  const [notificationPreference, setNotificationPreference] = useState<
    NotificationPreference | null
  >(initialData?.notificationPreference ?? null);

  // 한글 설명: 관심 카테고리 토글
  const toggleInterestCategory = (category: InterestCategory) => {
    setInterestCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // 한글 설명: Step 1 다음 버튼 핸들러
  const handleStep1Next = () => {
    if (interestCategories.length === 0) {
      alert("최소 1개 이상의 관심 카테고리를 선택해주세요.");
      return;
    }
    setStep(2);
  };

  // 한글 설명: 완료 버튼 핸들러
  const handleComplete = () => {
    const data: OnboardingRequestDTO = {
      interestCategories: interestCategories.length > 0 ? interestCategories : undefined,
      projectStylePreference: projectStylePreference ?? null,
      referralSource: referralSource ?? null,
      referralSourceOther:
        referralSource === "OTHER" && referralSourceOther.trim()
          ? referralSourceOther.trim()
          : null,
      budgetRange: budgetRange ?? null,
      hasBackingExperience: hasBackingExperience ?? null,
      notificationPreference: notificationPreference ?? null,
    };
    onComplete(data);
  };

  return (
    <div className="space-y-8">
      {/* 한글 설명: 진행 표시 */}
      <div className="flex items-center gap-2">
        <div
          className={`h-1 flex-1 rounded-full ${
            step === 1 ? "bg-neutral-900" : "bg-neutral-200"
          }`}
        />
        <div
          className={`h-1 flex-1 rounded-full ${
            step === 2 ? "bg-neutral-900" : "bg-neutral-200"
          }`}
        />
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">
              기본 프로필 설정
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              관심사와 선호도를 알려주시면 더 잘 맞는 프로젝트를 추천해드려요
            </p>
          </div>

          {/* 한글 설명: 관심 카테고리 선택 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-700">
              관심 카테고리 <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-neutral-500">
              관심 있는 카테고리를 선택해주세요 (복수 선택 가능)
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(
                Object.keys(INTEREST_CATEGORY_LABELS) as InterestCategory[]
              ).map((category) => {
                const isSelected = interestCategories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleInterestCategory(category)}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {INTEREST_CATEGORY_LABELS[category]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 한글 설명: 프로젝트 스타일 선호도 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-700">
              선호하는 프로젝트 스타일 (선택)
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                Object.keys(
                  PROJECT_STYLE_LABELS
                ) as ProjectStylePreference[]
              ).map((style) => {
                const isSelected = projectStylePreference === style;
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setProjectStylePreference(style)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {PROJECT_STYLE_LABELS[style]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 한글 설명: 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onSkip}
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 hover:border-neutral-400"
            >
              나중에 하기
            </button>
            <button
              type="button"
              onClick={handleStep1Next}
              className="flex-1 rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              다음
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">
              추가 정보 (선택)
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              더 나은 서비스를 제공하기 위한 정보입니다
            </p>
          </div>

          {/* 한글 설명: 유입 경로 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-700">
              MOA를 어떻게 알게 되셨나요? (선택)
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                Object.keys(REFERRAL_SOURCE_LABELS) as ReferralSource[]
              ).map((source) => {
                const isSelected = referralSource === source;
                return (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setReferralSource(source)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {REFERRAL_SOURCE_LABELS[source]}
                  </button>
                );
              })}
            </div>
            {referralSource === "OTHER" && (
              <input
                type="text"
                value={referralSourceOther}
                onChange={(e) => setReferralSourceOther(e.target.value)}
                placeholder="어떻게 알게 되셨나요?"
                maxLength={50}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-neutral-900 focus:outline-none"
              />
            )}
          </div>

          {/* 한글 설명: 예산 범위 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-700">
              평소 후원 예산 범위 (선택)
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                Object.keys(BUDGET_RANGE_LABELS) as BudgetRange[]
              ).map((range) => {
                const isSelected = budgetRange === range;
                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setBudgetRange(range)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {BUDGET_RANGE_LABELS[range]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 한글 설명: 후원 경험 여부 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-700">
              크라우드펀딩 후원 경험이 있으신가요? (선택)
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setHasBackingExperience(true)}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  hasBackingExperience === true
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                }`}
              >
                네, 있어요
              </button>
              <button
                type="button"
                onClick={() => setHasBackingExperience(false)}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  hasBackingExperience === false
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                }`}
              >
                아니요, 처음이에요
              </button>
            </div>
          </div>

          {/* 한글 설명: 알림 설정 선호도 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-700">
              알림 설정 (선택)
            </label>
            <div className="grid gap-2">
              {(
                Object.keys(
                  NOTIFICATION_PREFERENCE_LABELS
                ) as NotificationPreference[]
              ).map((pref) => {
                const isSelected = notificationPreference === pref;
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setNotificationPreference(pref)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {NOTIFICATION_PREFERENCE_LABELS[pref]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 한글 설명: 액션 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 hover:border-neutral-400"
            >
              이전
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className="flex-1 rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

