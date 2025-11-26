import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/stores/authStore";
import { useMyProjectsStore } from "../../../features/projects/stores/myProjectsStore";
import { makerService } from "../../../features/maker/api/makerService";
import type { MakerDTO } from "../../../features/maker/types";
import { stageMeta, statusLabel } from "../constants";
import type { ProjectDraft } from "../../../features/creator/stores/projectStore";
import { SettlementAccountModal } from "./SettlementAccountModal";

interface MakerViewProps {
  displayName: string;
}

// 한글 설명: 메이커 탭 뷰. 프로젝트 통계, 상태별 카드, 프로필 정보를 묶어 보여준다.
export const MakerView: React.FC<MakerViewProps> = ({ displayName }) => {
  const { user } = useAuthStore();
  // 한글 설명: URL 형식이 /makers/{id}/ 이므로 숫자만 사용
  const makerId = user?.id ? String(user.id) : undefined;
  const makerPageUrl = makerId ? `/makers/${makerId}` : undefined;

  // 한글 설명: 메이커 프로필 데이터 상태
  const [makerProfile, setMakerProfile] = React.useState<MakerDTO | null>(null);
  const [profileLoading, setProfileLoading] = React.useState(true);
  const [profileError, setProfileError] = React.useState<string | null>(null);

  // 한글 설명: 정산 계좌 모달 상태
  const [isSettlementModalOpen, setIsSettlementModalOpen] =
    React.useState(false);

  // 한글 설명: 메이커 프로필 조회
  React.useEffect(() => {
    const loadMakerProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError(null);
        const profile = await makerService.getMyProfile();
        setMakerProfile(profile);
      } catch (err) {
        console.error("메이커 프로필 조회 실패", err);
        setProfileError(
          err instanceof Error
            ? err.message
            : "메이커 프로필을 불러오지 못했습니다."
        );
      } finally {
        setProfileLoading(false);
      }
    };

    loadMakerProfile();
  }, []);

  const countsByStatus = useMyProjectsStore((state) => state.countsByStatus);
  const projectsLoading = useMyProjectsStore((state) => state.loading);
  const projectsError = useMyProjectsStore((state) => state.error);

  const stageCounts = React.useMemo(() => {
    const summaryCounts = {
      DRAFT: countsByStatus.DRAFT ?? 0,
      REVIEW: countsByStatus.REVIEW ?? 0,
      APPROVED: countsByStatus.APPROVED ?? 0,
      SCHEDULED: countsByStatus.SCHEDULED ?? 0,
      LIVE: countsByStatus.LIVE ?? 0,
      ENDED: countsByStatus.ENDED ?? 0,
      REJECTED: countsByStatus.REJECTED ?? 0,
    };
    return summaryCounts;
  }, [countsByStatus]);

  const liveCount = stageCounts.LIVE;
  const reviewCount = stageCounts.REVIEW;
  const endedCount = stageCounts.ENDED;
  const savedCount = stageCounts.DRAFT + stageCounts.APPROVED;

  const dashboardStats = [
    { label: "저장한 초안", value: savedCount.toLocaleString() },
    { label: "심사 중", value: reviewCount.toLocaleString() },
    { label: "진행 중 프로젝트", value: liveCount.toLocaleString() },
    { label: "종료된 프로젝트", value: endedCount.toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              메이커 대시보드
            </h2>
            <p className="text-xs text-neutral-500">
              저장한 프로젝트와 진행 상황을 한눈에 확인하세요.
            </p>
          </div>
          <Link
            to="/creator/dashboard"
            className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
          >
            대시보드 상세
          </Link>
        </header>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-neutral-100 p-4"
            >
              <p className="text-xs text-neutral-500">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-neutral-900">
                {projectsLoading ? "..." : item.value}
              </p>
            </div>
          ))}
        </div>
        {projectsError ? (
          <p className="mt-3 text-xs text-red-500">
            내 프로젝트 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : null}
      </section>

      <section className="space-y-3 rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
        <header className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            내 프로젝트
          </h2>
          <Link
            to="/creator/projects/new"
            className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
          >
            새 프로젝트 만들기
          </Link>
        </header>
        <p className="text-xs text-neutral-500">
          상태별로 프로젝트를 살펴보고 필요한 작업을 이어서 진행하세요.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {stageMeta.map((stage) => (
            <Link
              key={stage.status}
              to={stage.link}
              className="space-y-2 rounded-2xl border border-neutral-100 p-4 transition hover:-translate-y-0.5 hover:border-neutral-900"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-900">
                  {stage.title}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {projectsLoading
                    ? "..."
                    : (stageCounts[stage.status]?.toLocaleString?.() ?? 0)}
                </span>
              </div>
              <p className="text-xs text-neutral-500">{stage.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-neutral-200 p-6 text-sm text-neutral-700">
        <header className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            프로필 카드
          </h2>
          <div className="flex gap-2 text-xs">
            <Link
              to="/settings/maker"
              className="rounded-full border border-neutral-200 px-3 py-1 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              메이커 설정
            </Link>
            <Link
              to="/maker/projects"
              className="rounded-full border border-neutral-200 px-3 py-1 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              프로젝트 관리
            </Link>
            <button
              type="button"
              onClick={() => setIsSettlementModalOpen(true)}
              className="rounded-full border border-neutral-200 px-3 py-1 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              정산 계좌 관리
            </button>
          </div>
        </header>

        <div className="rounded-2xl border border-neutral-100 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            CREATOR
          </p>
          {profileLoading ? (
            <div className="mt-4">
              <p className="text-sm text-neutral-500">
                메이커 프로필을 불러오는 중...
              </p>
            </div>
          ) : profileError ? (
            <div className="mt-4">
              <p className="text-sm text-red-500">{profileError}</p>
              <button
                onClick={() => {
                  setProfileLoading(true);
                  makerService
                    .getMyProfile()
                    .then(setMakerProfile)
                    .catch((err) => {
                      setProfileError(
                        err instanceof Error
                          ? err.message
                          : "메이커 프로필을 불러오지 못했습니다."
                      );
                    })
                    .finally(() => setProfileLoading(false));
                }}
                className="mt-2 text-xs text-neutral-600 underline hover:text-neutral-900"
              >
                다시 시도
              </button>
            </div>
          ) : makerProfile ? (
            <>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                {makerProfile.name || displayName || "새로운 메이커"}
              </h3>
              {makerProfile.productIntro ? (
                <p className="mt-2 text-sm text-neutral-600 line-clamp-3">
                  {makerProfile.productIntro}
                </p>
              ) : (
                <p className="mt-2 text-sm text-neutral-600">
                  소개 글을 작성하면 후원자에게 더 많은 신뢰를 줄 수 있습니다.
                  제작 배경이나 목표를 간단히 적어 주세요.
                </p>
              )}
              <div className="mt-4 space-y-1 text-xs text-neutral-500">
                {makerProfile.contactEmail ? (
                  <p>이메일: {makerProfile.contactEmail}</p>
                ) : null}
                {makerProfile.contactPhone ? (
                  <p>연락처: {makerProfile.contactPhone}</p>
                ) : null}
                {makerProfile.location ? (
                  <p>소재지: {makerProfile.location}</p>
                ) : null}
                {makerProfile.establishedAt ? (
                  <p>설립일: {makerProfile.establishedAt}</p>
                ) : null}
                {makerProfile.makerType === "BUSINESS" &&
                makerProfile.businessName ? (
                  <p>사업자명: {makerProfile.businessName}</p>
                ) : null}
                <p>
                  상태별 프로젝트:{" "}
                  {Object.entries(stageCounts)
                    .filter(([, count]) => count > 0)
                    .map(
                      ([status, count]) =>
                        `${statusLabel[status as ProjectDraft["status"]]} ${count}개`
                    )
                    .join(", ") || "등록된 프로젝트가 없습니다."}
                </p>
              </div>
              {makerPageUrl ? (
                <Link
                  to={makerPageUrl}
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-neutral-900 px-4 py-2 text-xs font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
                >
                  메이커 페이지 보기
                </Link>
              ) : null}
            </>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-neutral-500">
                메이커 프로필이 없습니다. 메이커 설정에서 프로필을 생성해
                주세요.
              </p>
              <Link
                to="/settings/maker"
                className="mt-2 inline-block text-xs text-neutral-600 underline hover:text-neutral-900"
              >
                메이커 설정으로 이동
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 한글 설명: 정산 계좌 입력/수정 모달 */}
      <SettlementAccountModal
        isOpen={isSettlementModalOpen}
        onClose={() => setIsSettlementModalOpen(false)}
        onSuccess={() => {
          // 한글 설명: 저장 성공 시 추가 작업이 필요하면 여기에 작성
          console.log("정산 계좌 정보가 저장되었습니다.");
        }}
      />
    </div>
  );
};
