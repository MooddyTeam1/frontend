// 한글 설명: 서포터 온보딩 배너 컴포넌트
// 마이페이지 상단에 표시되는 온보딩 상태에 따른 카드 UI
// completed=true면 숨김, completed=false && skipped=false면 "아직 설정 안 함" 카드,
// skipped=true면 "나중에 하기 선택함" 카드 표시
import React from "react";
import { useNavigate } from "react-router-dom";
import { getSupporterOnboardingStatus } from "../api/supporterOnboardingApi";
import type { SupporterOnboardingStatusResponse } from "../types/supporterOnboarding";

// 한글 설명: 온보딩 상태를 UI에서 사용하기 쉽게 변환하는 헬퍼 함수
const convertStatus = (
  response: SupporterOnboardingStatusResponse
): {
  completed: boolean;
  skipped: boolean;
} => {
  // 한글 설명: onboardingStatus를 기반으로 completed, skipped 계산
  // 백엔드에서 직접 completed, skipped 필드를 제공하는 경우 해당 필드 사용
  const completed = response.onboardingStatus === "COMPLETED";
  const skipped = response.onboardingStatus === "SKIPPED";
  return { completed, skipped };
};

// 한글 설명: 서포터 온보딩 배너 컴포넌트 Props
type SupporterOnboardingBannerProps = {
  // 한글 설명: 온보딩 상태 정보 (선택적, 없으면 내부에서 조회)
  status?: SupporterOnboardingStatusResponse;
  // 한글 설명: 로딩 상태
  loading?: boolean;
};

// 한글 설명: 서포터 온보딩 배너 컴포넌트
export const SupporterOnboardingBanner: React.FC<
  SupporterOnboardingBannerProps
> = ({ status, loading = false }) => {
  const navigate = useNavigate();
  const [internalStatus, setInternalStatus] =
    React.useState<SupporterOnboardingStatusResponse | null>(null);
  const [internalLoading, setInternalLoading] = React.useState(false);

  // 한글 설명: status prop이 없으면 내부에서 조회
  React.useEffect(() => {
    if (status) {
      setInternalStatus(status);
      return;
    }

    const fetchStatus = async () => {
      try {
        setInternalLoading(true);
        const data = await getSupporterOnboardingStatus();
        setInternalStatus(data);
      } catch (error) {
        console.error("온보딩 상태 조회 실패", error);
        // 한글 설명: 에러 발생 시 배너를 숨김 (에러 상태는 표시하지 않음)
        setInternalStatus(null);
      } finally {
        setInternalLoading(false);
      }
    };

    fetchStatus();
  }, [status]);

  // 한글 설명: 현재 사용할 상태 결정 (prop 우선, 없으면 내부 상태)
  const currentStatus = status ?? internalStatus;
  const isLoading = loading || internalLoading;

  // 한글 설명: 상태가 없거나 로딩 중이면 렌더링하지 않음
  if (!currentStatus || isLoading) {
    return null;
  }

  const { completed, skipped } = convertStatus(currentStatus);

  // 한글 설명: completed=true면 배너 숨김
  if (completed) {
    return null;
  }

  // 한글 설명: "관심사 설정하기" 버튼 클릭 핸들러
  const handleStartOnboarding = () => {
    navigate("/supporter/onboarding");
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* 한글 설명: 배너 내용 영역 */}
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-semibold text-neutral-900">
            🎯 더 잘 맞는 프로젝트를 보고 싶나요?
          </h3>
          <p className="text-sm text-neutral-600">
            {skipped
              ? "나중에 하기를 선택했어요. 언제든 다시 설정할 수 있어요."
              : "아직 서포터 관심사 설정을 완료하지 않았어요. 관심 카테고리와 예산을 알려주시면 맞춤 추천을 보여드릴게요."}
          </p>
        </div>

        {/* 한글 설명: 액션 버튼 영역 */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleStartOnboarding}
            className="rounded-full border border-neutral-900 bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-95"
          >
            {skipped ? "다시 설정하기" : "관심사 설정하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

