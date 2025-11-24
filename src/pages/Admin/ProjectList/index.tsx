import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchAdminReviewProjects } from "../../../features/admin/api/adminProjectsService";
import type { AdminProjectReviewDTO } from "../../../features/admin/types";
import type {
  ProjectId,
  ProjectReviewStatus,
} from "../../../features/projects/types";
import { statusLabelMap } from "../../../shared/constants/projectStatus";

// 한글 설명: Admin용 프로젝트 목록 페이지. 심사 대기 중인 프로젝트들을 보여준다.
export const AdminProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");
  const [projects, setProjects] = React.useState<AdminProjectReviewDTO[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const refreshProjects = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminReviewProjects();
      setProjects(data);
    } catch (fetchError) {
      console.error("관리자 프로젝트 목록 조회 실패", fetchError);
      setError("프로젝트 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refreshProjects().catch(() => undefined);
  }, [refreshProjects]);

  const reviewProjects = React.useMemo(
    () =>
      projects.filter(
        (project) =>
          project.reviewStatus === "REVIEW" ||
          project.projectReviewStatus === "REVIEW"
      ),
    [projects]
  );

  const filteredProjects = React.useMemo(() => {
    if (statusFilter === "review") {
      return reviewProjects;
    }
    return projects;
  }, [projects, reviewProjects, statusFilter]);

  // 한글 설명: 프로젝트 ID 추출 헬퍼 (projectId 또는 project 필드 사용)
  const getProjectId = (project: AdminProjectReviewDTO): ProjectId => {
    return project.projectId ?? project.project ?? "";
  };

  // 한글 설명: 심사 상태 추출 헬퍼 (reviewStatus 또는 projectReviewStatus 필드 사용)
  const getReviewStatus = (
    project: AdminProjectReviewDTO
  ): ProjectReviewStatus => {
    return project.reviewStatus ?? project.projectReviewStatus ?? "NONE";
  };

  // 한글 설명: 요청일 포맷팅 헬퍼
  const formatRequestDate = (dateString: string | undefined): string => {
    if (!dateString) return "날짜 없음";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto min-h-[70vh] max-w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/admin"
                className="text-xs text-neutral-500 hover:text-neutral-900"
              >
                ← 관리자 대시보드
              </Link>
              <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
                프로젝트 관리
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                프로젝트를 심사하고 승인/반려할 수 있습니다.
              </p>
            </div>
          </div>

          {/* 필터 탭 */}
          <div className="flex gap-2 border-b border-neutral-200">
            <button
              onClick={() => navigate("/admin/projects?status=review")}
              className={`border-b-2 px-4 py-2 text-sm font-medium ${
                statusFilter === "review"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              심사 대기 ({reviewProjects.length})
            </button>
            <button
              onClick={() => navigate("/admin/projects")}
              className={`border-b-2 px-4 py-2 text-sm font-medium ${
                !statusFilter
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              전체 프로젝트 ({projects.length})
            </button>
          </div>

          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-neutral-200 p-12 text-center text-sm text-neutral-500">
              데이터를 불러오는 중입니다...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-200 p-12 text-center">
              <p className="text-sm text-neutral-500">
                {statusFilter === "review"
                  ? "심사 대기 중인 프로젝트가 없습니다."
                  : "프로젝트가 없습니다."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const projectId = getProjectId(project);
                const reviewStatus = getReviewStatus(project);
                return (
                  <Link
                    key={projectId}
                    to={`/admin/projects/${projectId}`}
                    className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-md"
                  >
                    {/* 프로젝트 제목 */}
                    <div className="mb-3">
                      <h3 className="line-clamp-2 text-base font-semibold text-neutral-900 group-hover:text-neutral-700">
                        {project.title || "제목 없음"}
                      </h3>
                    </div>

                    {/* 메이커 정보 */}
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xs text-neutral-500">메이커</span>
                      <span className="text-xs font-medium text-neutral-700">
                        {project.maker || "알 수 없음"}
                      </span>
                    </div>

                    {/* 리워드 정보 */}
                    {project.rewardNames && project.rewardNames.length > 0 ? (
                      <div className="mb-3">
                        <p className="mb-1 text-xs text-neutral-500">리워드</p>
                        <div className="flex flex-wrap gap-1">
                          {project.rewardNames.slice(0, 3).map((name, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-600"
                            >
                              {name}
                            </span>
                          ))}
                          {project.rewardNames.length > 3 && (
                            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-600">
                              +{project.rewardNames.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <p className="text-xs text-neutral-400">리워드 없음</p>
                      </div>
                    )}

                    {/* 요청일 */}
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xs text-neutral-500">요청일</span>
                      <span className="text-xs text-neutral-600">
                        {formatRequestDate(project.requestAt)}
                      </span>
                    </div>

                    {/* 하단 상태 배지 */}
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-neutral-100">
                      <span className="text-[10px] text-neutral-400">
                        ID: {projectId}
                      </span>
                      <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-medium text-yellow-800">
                        {statusLabelMap[reviewStatus] ?? reviewStatus}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
