// 한글 설명: 서포터 온보딩 요약 섹션 컴포넌트
// 프로필 설정 페이지 내 "관심사 & 추천 설정" 섹션
// 온보딩 완료 유저: 현재 설정 정보 요약 표시 + "다시 설정하기" 버튼
// 온보딩 미완료 유저: 안내 텍스트 + "지금 설정하기" 버튼
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  getSupporterOnboardingStatus,
  getSupporterOnboardingData,
} from "../api/supporterOnboardingApi";
import type {
  SupporterOnboardingStatusResponse,
  SupporterOnboardingDataResponse,
} from "../types/supporterOnboarding";
import {
  categoryEnumToLabel,
  PROJECT_STYLE_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  FUNDING_EXPERIENCE_OPTIONS,
  // ACQUISITION_CHANNEL_OPTIONS, // 한글 설명: 현재 미사용
} from "../types/supporterOnboarding";

// 한글 설명: 서포터 온보딩 요약 섹션 컴포넌트
export const SupporterOnboardingSummarySection: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] =
    React.useState<SupporterOnboardingStatusResponse | null>(null);
  const [data, setData] = React.useState<SupporterOnboardingDataResponse | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 한글 설명: 온보딩 상태 및 데이터 조회
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 한글 설명: 상태와 데이터를 병렬로 조회
        const [statusData, onboardingData] = await Promise.all([
          getSupporterOnboardingStatus(),
          getSupporterOnboardingData().catch(() => null), // 한글 설명: 데이터가 없을 수 있으므로 에러 무시
        ]);

        setStatus(statusData);
        setData(onboardingData);
      } catch (err) {
        console.error("온보딩 정보 조회 실패", err);
        setError("온보딩 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 한글 설명: 온보딩 설정 페이지로 이동
  const handleStartOnboarding = () => {
    navigate("/supporter/onboarding");
  };

  // 한글 설명: 로딩 중
  if (loading) {
    return (
      <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-neutral-900">
            관심사 & 추천 설정
          </h3>
          <p className="text-sm text-neutral-500">정보를 불러오는 중입니다...</p>
        </div>
      </section>
    );
  }

  // 한글 설명: 에러 발생 시
  if (error || !status) {
    return (
      <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-neutral-900">
            관심사 & 추천 설정
          </h3>
          <p className="text-sm text-red-600">{error ?? "정보를 불러올 수 없습니다."}</p>
        </div>
      </section>
    );
  }

  const isCompleted = status.onboardingStatus === "COMPLETED";

  return (
    <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">
            관심사 & 추천 설정
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            맞춤 추천을 위한 관심사와 선호도 정보를 관리합니다.
          </p>
        </div>

        {isCompleted && data ? (
          // 한글 설명: 온보딩 완료 유저 - 현재 설정 정보 요약 표시
          <div className="space-y-4">
            {/* 한글 설명: 현재 관심 카테고리 */}
            {data.interestCategories && data.interestCategories.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500">
                  현재 관심사
                </label>
                <div className="flex flex-wrap gap-2">
                  {data.interestCategories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700"
                    >
                      {categoryEnumToLabel(category)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 한글 설명: 추천에 활용되는 정보 요약 */}
            <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <label className="text-xs font-medium text-neutral-500">
                추천에 활용되는 정보
              </label>
              <div className="space-y-2 text-xs text-neutral-600">
                {/* 한글 설명: 프로젝트 선호 스타일 */}
                {data.preferredStyles && data.preferredStyles.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 font-medium">• 프로젝트 선호 스타일:</span>
                    <span>
                      {data.preferredStyles
                        .map(
                          (style) =>
                            PROJECT_STYLE_OPTIONS.find((opt) => opt.value === style)
                              ?.label
                        )
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}

                {/* 한글 설명: 펀딩 예산 범위 */}
                {data.budgetRange && (
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 font-medium">• 펀딩 예산 범위:</span>
                    <span>
                      {
                        BUDGET_RANGE_OPTIONS.find((opt) => opt.value === data.budgetRange)
                          ?.label
                      }
                    </span>
                  </div>
                )}

                {/* 한글 설명: 후원 경험 */}
                {data.fundingExperience && (
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 font-medium">• 크라우드펀딩 후원 경험:</span>
                    <span>
                      {
                        FUNDING_EXPERIENCE_OPTIONS.find(
                          (opt) => opt.value === data.fundingExperience
                        )?.label
                      }
                    </span>
                  </div>
                )}

                {/* 한글 설명: 알림 설정은 계정설정 페이지에서 관리 */}
              </div>
            </div>

            {/* 한글 설명: 다시 설정하기 버튼 */}
            <button
              type="button"
              onClick={handleStartOnboarding}
              className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              관심사·선호도 다시 설정하기
            </button>
          </div>
        ) : (
          // 한글 설명: 온보딩 미완료 유저 - 안내 텍스트 + 설정하기 버튼
          <div className="space-y-4">
            <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm text-neutral-600">
                아직 관심사 설정을 하지 않았어요. 지금 설정하면 나에게 맞는 프로젝트를
                먼저 보여드려요.
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartOnboarding}
              className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              지금 설정하기
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

