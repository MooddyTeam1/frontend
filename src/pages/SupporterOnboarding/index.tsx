// 한글 설명: 서포터 온보딩 페이지
// 온보딩 플로우를 관리하는 루트 페이지 컴포넌트
// Step1(관심 카테고리 + 선호 스타일)과 Step2(추가 정보 + 알림 설정)를 순차적으로 진행
import React from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import {
  getSupporterOnboardingStatus,
  saveSupporterOnboardingStep1,
  saveSupporterOnboardingStep2,
  skipSupporterOnboarding,
} from "../../features/onboarding/api/supporterOnboardingApi";
import type {
  SupporterOnboardingStatusResponse,
  SupporterOnboardingStep1Request,
  SupporterOnboardingStep2Request,
} from "../../features/onboarding/types/supporterOnboarding";
import { SupporterOnboardingStep1 } from "./components/SupporterOnboardingStep1";
import { SupporterOnboardingStep2 } from "./components/SupporterOnboardingStep2";

// 한글 설명: 온보딩 완료 화면 컴포넌트
const OnboardingCompleteView: React.FC<{
  onGoHome: () => void;
  onGoProfile: () => void;
}> = ({ onGoHome, onGoProfile }) => {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-12 text-center">
      <div className="space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="h-10 w-10 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-neutral-900">
          설정이 완료되었습니다! 🎉
        </h2>
        <p className="text-sm text-neutral-600">
          관심사와 선호도를 반영한 맞춤 프로젝트를 추천해드릴게요.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-4">
        <button
          type="button"
          onClick={onGoHome}
          className="rounded-full border border-neutral-900 bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          맞춤 프로젝트 보러가기
        </button>
        <button
          type="button"
          onClick={onGoProfile}
          className="rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
        >
          내 프로필로 이동
        </button>
      </div>
    </div>
  );
};

// 한글 설명: 서포터 온보딩 페이지 메인 컴포넌트
export const SupporterOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] =
    React.useState<SupporterOnboardingStatusResponse | null>(null);
  const [currentStep, setCurrentStep] = React.useState<1 | 2>(1);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // 한글 설명: 페이지 진입 시 온보딩 상태 조회
  React.useEffect(() => {
    const loadStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSupporterOnboardingStatus();

        // 한글 설명: 이미 완료된 경우 완료 화면 표시
        if (data.onboardingStatus === "COMPLETED") {
          // 한글 설명: 완료 화면은 표시하되, "다시 설정하기" 옵션 제공
          setStatus(data);
          setCurrentStep(1); // 한글 설명: 다시 설정 시 Step1부터 시작
          setLoading(false);
          return;
        }

        // 한글 설명: Step1 완료 + Step2 미완료면 Step2로 이동
        if (data.step1Completed && !data.step2Completed) {
          setCurrentStep(2);
        } else {
          setCurrentStep(1);
        }

        setStatus(data);
      } catch (err) {
        console.error("온보딩 상태 조회 실패", err);
        setError("온보딩 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, []);

  // 한글 설명: Step1 제출 핸들러
  const handleStep1Submit = async (payload: SupporterOnboardingStep1Request) => {
    try {
      setSubmitting(true);
      setError(null);
      await saveSupporterOnboardingStep1(payload);

      // 한글 설명: 성공 시 Step2로 이동
      setCurrentStep(2);
      setStatus((prev) =>
        prev
          ? {
              ...prev,
              step1Completed: true,
              onboardingStatus: "IN_PROGRESS",
            }
          : null
      );
    } catch (err) {
      console.error("Step1 제출 실패", err);
      setError(
        err instanceof Error
          ? err.message
          : "저장에 실패했습니다. 다시 시도해 주세요."
      );
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // 한글 설명: Step2 제출 핸들러
  const handleStep2Submit = async (payload: SupporterOnboardingStep2Request) => {
    try {
      setSubmitting(true);
      setError(null);
      await saveSupporterOnboardingStep2(payload);

      // 한글 설명: 성공 시 완료 화면 표시
      setCompleted(true);
      setStatus((prev) =>
        prev
          ? {
              ...prev,
              step2Completed: true,
              onboardingStatus: "COMPLETED",
            }
          : null
      );
    } catch (err) {
      console.error("Step2 제출 실패", err);
      setError(
        err instanceof Error
          ? err.message
          : "저장에 실패했습니다. 다시 시도해 주세요."
      );
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // 한글 설명: 스킵 핸들러
  const handleSkip = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await skipSupporterOnboarding();

      // 한글 설명: 스킵 성공 시 홈으로 이동 (토스트 메시지는 나중에 추가 가능)
      navigate("/");
    } catch (err) {
      console.error("온보딩 스킵 실패", err);
      setError(
        err instanceof Error
          ? err.message
          : "처리에 실패했습니다. 다시 시도해 주세요."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // 한글 설명: 이전 단계로 이동
  const handlePrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // 한글 설명: 홈으로 이동
  const handleGoHome = () => {
    navigate("/");
  };

  // 한글 설명: 프로필로 이동
  const handleGoProfile = () => {
    navigate("/profile/supporter");
  };

  // 한글 설명: 로딩 중
  if (loading) {
    return (
      <Container>
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center py-16">
          <div className="text-center">
            <p className="text-sm text-neutral-500">온보딩 정보를 불러오는 중입니다...</p>
          </div>
        </div>
      </Container>
    );
  }

  // 한글 설명: 에러 발생 시
  if (error && !status) {
    return (
      <Container>
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center py-16">
          <div className="space-y-4 text-center">
            <p className="text-sm font-medium text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              다시 시도
            </button>
          </div>
        </div>
      </Container>
    );
  }

  // 한글 설명: 완료 화면 표시
  if (completed) {
    return (
      <Container>
        <OnboardingCompleteView
          onGoHome={handleGoHome}
          onGoProfile={handleGoProfile}
        />
      </Container>
    );
  }

  // 한글 설명: 이미 완료된 경우 안내 메시지와 함께 다시 설정 옵션 제공
  const isAlreadyCompleted = status?.onboardingStatus === "COMPLETED";

  return (
    <Container>
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col gap-6 py-16">
        {/* 한글 설명: 헤더 영역 */}
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900">
            서포터 프로필 설정
          </h1>
          <p className="text-sm text-neutral-500">
            관심사와 선호도를 알려주시면 더 잘 맞는 프로젝트를 추천해드려요.
          </p>
        </header>

        {/* 한글 설명: Step Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
              currentStep >= 1
                ? "bg-neutral-900 text-white"
                : "bg-neutral-200 text-neutral-500"
            }`}
          >
            1
          </div>
          <div
            className={`h-1 flex-1 ${
              currentStep >= 2 ? "bg-neutral-900" : "bg-neutral-200"
            }`}
          />
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
              currentStep >= 2
                ? "bg-neutral-900 text-white"
                : "bg-neutral-200 text-neutral-500"
            }`}
          >
            2
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className={currentStep === 1 ? "font-medium text-neutral-900" : ""}>
            Step 1 · 관심사 선택
          </span>
          <span className="flex-1" />
          <span className={currentStep === 2 ? "font-medium text-neutral-900" : ""}>
            Step 2 · 예산 & 추가 정보
          </span>
        </div>

        {/* 한글 설명: 이미 완료된 경우 안내 메시지 */}
        {isAlreadyCompleted && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-900">
              이미 온보딩을 완료하셨습니다. 아래에서 다시 설정할 수 있어요.
            </p>
          </div>
        )}

        {/* 한글 설명: 에러 메시지 */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 한글 설명: Step 컴포넌트 렌더링 */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">
          {currentStep === 1 ? (
            <SupporterOnboardingStep1
              onNext={handleStep1Submit}
              onSkip={handleSkip}
              isSubmitting={submitting}
            />
          ) : (
            <SupporterOnboardingStep2
              onComplete={handleStep2Submit}
              onPrevious={handlePrevious}
              onSkip={handleSkip}
              isSubmitting={submitting}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

