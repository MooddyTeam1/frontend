// 한글 설명: 메이커 프로젝트 관리 목록 페이지
import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../../../shared/components/Container";
import {
  getMakerProjects,
  getProjectSummaryStats,
} from "../../../features/maker/projectManagement/api/projectManagementService";
import type {
  MakerProjectStatus,
  ProjectSortOption,
  MakerProjectListItemDTO,
  ProjectSummaryStatsDTO,
} from "../../../features/maker/projectManagement/types";
// ============================================
// Mock 데이터 사용 중단 - 주석처리됨
// ============================================
// import {
//   mockProjectList,
//   mockSummaryStats,
// } from "../../../features/maker/projectManagement/mockData";
import { currencyKRW } from "../../../shared/utils/format";

// 한글 설명: Mock API 사용 여부 (개발 중 확인용)
// 실제 백엔드 API 연결 시 false로 설정
// ============================================
// Mock 데이터 사용 중단 - 주석처리됨
// ============================================
// const USE_MOCK_DATA = false;

// 한글 설명: 상태별 배지 색상 매핑
const STATUS_BADGE_COLORS: Record<MakerProjectStatus, string> = {
  DRAFT: "bg-neutral-200 text-neutral-700",
  REVIEW: "bg-blue-100 text-blue-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  SCHEDULED: "bg-purple-100 text-purple-700",
  LIVE: "bg-green-100 text-green-700",
  ENDED_SUCCESS: "bg-emerald-100 text-emerald-700",
  ENDED_FAILED: "bg-orange-100 text-orange-700",
  REJECTED: "bg-red-100 text-red-700",
};

// 한글 설명: 상태별 라벨
const STATUS_LABELS: Record<MakerProjectStatus, string> = {
  DRAFT: "작성중",
  REVIEW: "심사중",
  APPROVED: "승인됨",
  SCHEDULED: "공개예정",
  LIVE: "진행중",
  ENDED_SUCCESS: "달성 종료",
  ENDED_FAILED: "실패 종료",
  REJECTED: "반려됨",
};

export const MakerProjectManagementPage: React.FC = () => {
  const [projects, setProjects] = React.useState<MakerProjectListItemDTO[]>([]);
  const [stats, setStats] = React.useState<ProjectSummaryStatsDTO | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<
    MakerProjectStatus | "ALL"
  >("ALL");
  const [sortBy, setSortBy] = React.useState<ProjectSortOption>("recent");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  // 한글 설명: 프로젝트 목록 및 통계 조회
  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // ============================================
        // Mock 데이터 사용 중단 - 주석처리됨
        // ============================================
        // if (USE_MOCK_DATA) {
        //   // 한글 설명: Mock 데이터 사용
        //   await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션

        //   // 한글 설명: 필터링 및 정렬 적용
        //   let filteredProjects = [...mockProjectList];

        //   // 상태 필터
        //   if (statusFilter !== "ALL") {
        //     filteredProjects = filteredProjects.filter(
        //       (p) => p.status === statusFilter
        //     );
        //   }

        //   // 정렬
        //   filteredProjects.sort((a, b) => {
        //     switch (sortBy) {
        //       case "recent":
        //         return (
        //           new Date(b.lastModifiedAt).getTime() -
        //           new Date(a.lastModifiedAt).getTime()
        //         );
        //       case "startDate":
        //         return (a.daysLeft ?? 999) - (b.daysLeft ?? 999);
        //       case "raised":
        //         return b.currentAmount - a.currentAmount;
        //       case "deadline":
        //         return (a.daysLeft ?? 999) - (b.daysLeft ?? 999);
        //       default:
        //         return 0;
        //     }
        //   });

        //   // 페이지네이션
        //   const startIndex = (page - 1) * 12;
        //   const endIndex = startIndex + 12;
        //   const paginatedProjects = filteredProjects.slice(
        //     startIndex,
        //     endIndex
        //   );

        //   setProjects(paginatedProjects);
        //   setTotalPages(Math.ceil(filteredProjects.length / 12));
        //   setStats(mockSummaryStats);
        // } else {
        // 한글 설명: 실제 API 호출
        const [projectsData, statsData] = await Promise.all([
          getMakerProjects({
            status: statusFilter,
            sortBy,
            page,
            pageSize: 12,
          }),
          getProjectSummaryStats(),
        ]);
        setProjects(projectsData.projects);
        setTotalPages(projectsData.totalPages);
        setStats(statsData);
        // }
      } catch (error) {
        console.error("프로젝트 목록 조회 실패:", error);
        // 한글 설명: 에러 상세 정보 로깅
        if (error instanceof Error) {
          console.error("에러 상세:", error.message);
        }
        // 한글 설명: 사용자에게 친화적인 에러 메시지 표시
        const errorMessage =
          error instanceof Error
            ? error.message.includes("401")
              ? "인증이 필요합니다. 로그인해주세요."
              : error.message.includes("403")
              ? "권한이 없습니다."
              : error.message.includes("404")
              ? "API 엔드포인트를 찾을 수 없습니다."
              : error.message.includes("Network")
              ? "네트워크 연결을 확인해주세요."
              : `프로젝트 목록을 불러오는데 실패했습니다: ${error.message}`
            : "프로젝트 목록을 불러오는데 실패했습니다.";
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [statusFilter, sortBy, page]);

  // 한글 설명: D-Day 계산
  const getDDay = (daysLeft: number | null): string => {
    if (daysLeft === null) return "종료됨";
    if (daysLeft < 0) return "종료됨";
    if (daysLeft === 0) return "D-Day";
    return `D-${daysLeft}`;
  };

  return (
    <div className="bg-neutral-50 pb-16 pt-10">
      <Container>
        <div className="space-y-8">
          {/* 한글 설명: 헤더 */}
          <header className="space-y-3">
            <h1 className="text-2xl font-semibold text-neutral-900 md:text-3xl">
              내 프로젝트 관리
            </h1>
            <p className="text-sm text-neutral-600">
              프로젝트 상태, 정산, 통계를 한눈에 확인하고 관리하세요.
            </p>
          </header>

          {/* 한글 설명: 통계 요약 */}
          {stats && (
            <div className="grid gap-4 rounded-3xl border border-neutral-200 bg-white p-6 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-xs text-neutral-500">전체 프로젝트</p>
                <p className="text-2xl font-semibold text-neutral-900">
                  {stats.totalProjects}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-neutral-500">진행중 프로젝트</p>
                <p className="text-2xl font-semibold text-green-600">
                  {stats.liveProjects}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-neutral-500">총 모금액</p>
                <p className="text-2xl font-semibold text-neutral-900">
                  {currencyKRW(stats.totalRaised)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-neutral-500">이번 달 신규</p>
                <p className="text-2xl font-semibold text-neutral-900">
                  {stats.newProjectsThisMonth}개
                </p>
              </div>
            </div>
          )}

          {/* 한글 설명: 필터 및 정렬 */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
            {/* 한글 설명: 상태 필터 탭 */}
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "ALL",
                  "DRAFT",
                  "REVIEW",
                  "APPROVED",
                  "SCHEDULED",
                  "LIVE",
                  "ENDED_SUCCESS",
                  "ENDED_FAILED",
                  "REJECTED",
                ] as const
              ).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    statusFilter === status
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {status === "ALL" ? "전체" : STATUS_LABELS[status]}
                </button>
              ))}
            </div>

            {/* 한글 설명: 정렬 옵션 */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as ProjectSortOption);
                setPage(1);
              }}
              className="rounded border border-neutral-200 bg-white px-3 py-2 text-xs"
            >
              <option value="recent">최신 수정순</option>
              <option value="startDate">시작일 순</option>
              <option value="raised">모금액 높은순</option>
              <option value="deadline">D-Day 임박순</option>
            </select>
          </div>

          {/* 한글 설명: 프로젝트 리스트 */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-neutral-500">로딩 중...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-20">
              <p className="text-sm text-neutral-500">프로젝트가 없습니다.</p>
              <Link
                to="/creator/projects/new"
                className="mt-4 rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold !text-white hover:bg-neutral-800"
              >
                새 프로젝트 만들기
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:shadow-lg"
                  >
                    {/* 한글 설명: 썸네일 */}
                    <div className="relative aspect-video bg-neutral-100">
                      {project.thumbnailUrl ? (
                        <img
                          src={project.thumbnailUrl}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-neutral-400">
                          이미지 없음
                        </div>
                      )}
                      {/* 한글 설명: 상태 배지 */}
                      <div className="absolute right-2 top-2">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                            STATUS_BADGE_COLORS[project.status]
                          }`}
                        >
                          {STATUS_LABELS[project.status]}
                        </span>
                      </div>
                    </div>

                    {/* 한글 설명: 프로젝트 정보 */}
                    <div className="space-y-3 p-4">
                      <div>
                        <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-xs text-neutral-500">
                          {project.category}
                        </p>
                      </div>

                      {/* 한글 설명: 진행률 */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-500">진행률</span>
                          <span className="font-semibold text-neutral-900">
                            {project.progressPercent.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${project.progressPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span>
                            {currencyKRW(project.currentAmount)} /{" "}
                            {currencyKRW(project.goalAmount)}
                          </span>
                          <span>{getDDay(project.daysLeft)}</span>
                        </div>
                      </div>

                      {/* 한글 설명: 서포터 수 */}
                      <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-xs">
                        <span className="text-neutral-500">
                          서포터 {project.supporterCount}명
                        </span>
                        <span className="text-neutral-400">
                          {new Date(project.lastModifiedAt).toLocaleDateString(
                            "ko-KR"
                          )}
                        </span>
                      </div>

                      {/* 한글 설명: 액션 버튼 */}
                      <div className="flex gap-2">
                        <Link
                          to={`/maker/projects/${project.id}${
                            (project.status === "ENDED_SUCCESS" ||
                              project.status === "ENDED_FAILED")
                              ? "?tab=shipment"
                              : ""
                          }`}
                          className="flex-1 rounded border border-neutral-200 bg-white px-3 py-2 text-center text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                        >
                          {(project.status === "ENDED_SUCCESS" ||
                            project.status === "ENDED_FAILED")
                            ? "배송 관리"
                            : "관리"}
                        </Link>
                        {project.status === "DRAFT" && (
                          <Link
                            to={`/creator/projects/new/${project.id}`}
                            className="flex-1 rounded border border-neutral-200 bg-white px-3 py-2 text-center text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                          >
                            수정하기
                          </Link>
                        )}
                        {(project.status === "LIVE" ||
                          project.status === "ENDED_SUCCESS" ||
                          project.status === "ENDED_FAILED") && (
                          <a
                            href={`/projects/${project.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded border border-neutral-200 bg-white px-3 py-2 text-center text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                          >
                            공개페이지
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 한글 설명: 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded border border-neutral-200 bg-white px-3 py-2 text-xs disabled:opacity-50"
                  >
                    이전
                  </button>
                  <span className="text-xs text-neutral-500">
                    {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded border border-neutral-200 bg-white px-3 py-2 text-xs disabled:opacity-50"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
};
