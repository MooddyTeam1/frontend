import React from "react";
import { useParams, Link } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import {
  useProjectStore,
  type ProjectStatus,
} from "../../features/creator/stores/projectStore";
import { useMyProjectsStore } from "../../features/projects/stores/myProjectsStore";
import type { MyProjectStatusItemDTO } from "../../features/projects/types";
import { statusLabel } from "./index";
import {
  deleteProjectApi,
  cancelReviewRequestApi,
  cancelScheduledProjectApi,
} from "../../features/projects/api/myProjectsService";

/* ===========================================================================================
// 한글 설명: 기존 mock 데이터 기반 유틸리티. 실제 API 연동에 따라 사용을 중단하고 주석 처리함.
// const mapMockProjectStateToStatus = ...
// const createMockProjectsByStatus = ...
=========================================================================================== */

export const ProjectStatusPage: React.FC = () => {
  // 한글 설명: 프로젝트 상태별 상세 페이지. 특정 상태의 프로젝트 목록을 카드 형태로 표시한다.
  const { status } = useParams<{ status: string }>();
  const drafts = useProjectStore((state) => state.drafts);
  const removeDraft = useProjectStore((state) => state.removeDraft);
  const fetchOverview = useMyProjectsStore((state) => state.fetchOverview);
  const fetchByStatus = useMyProjectsStore((state) => state.fetchByStatus);
  const loading = useMyProjectsStore((state) => state.loading);
  const error = useMyProjectsStore((state) => state.error);
  const resetError = useMyProjectsStore((state) => state.resetError);
  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set());
  const [cancelingReviewIds, setCancelingReviewIds] = React.useState<
    Set<string>
  >(new Set());
  const [cancelingScheduledIds, setCancelingScheduledIds] = React.useState<
    Set<string>
  >(new Set());
  const projects = useMyProjectsStore(
    React.useCallback(
      (state) =>
        status
          ? (state.projectsByStatus[status.toUpperCase() as ProjectStatus] ??
            [])
          : [],
      [status]
    )
  );

  // 한글 설명: 서버 응답이 없을 때 로컬 draft 데이터를 사용해 상태별 목록을 생성
  type StatusCardProject = MyProjectStatusItemDTO & {
    remoteId?: string;
    origin: "remote" | "local";
    localDraftId?: string;
  };

  const augmentedProjects = React.useMemo<StatusCardProject[]>(() => {
    const normalizedStatus = status?.toUpperCase() as ProjectStatus | undefined;
    if (!normalizedStatus) return [];

    if (projects.length > 0) {
      return projects.map((item) => ({
        ...item,
        remoteId: item.id,
        origin: "remote" as const,
      }));
    }

    const draftProjects = drafts
      .filter((draft) => draft.status === normalizedStatus)
      .map((draft) => ({
        id: draft.id,
        title: draft.title,
        summary: draft.summary,
        imgUrl: draft.coverImageUrl ?? null,
        projectLifecycleStatus: normalizedStatus,
        projectReviewStatus: normalizedStatus,
        remoteId: draft.remoteId,
        localDraftId: draft.id,
        origin: "local" as const,
      }));

    return draftProjects;
  }, [status, drafts, projects]);

  const normalizedStatus = status?.toUpperCase() as ProjectStatus | undefined;

  React.useEffect(() => {
    if (!normalizedStatus) {
      return;
    }
    resetError();
    fetchOverview().catch(() => undefined);
    fetchByStatus(normalizedStatus, { force: true }).catch(() => undefined);
  }, [normalizedStatus, fetchOverview, fetchByStatus, resetError]);

  // 한글 설명: status를 대문자로 변환하여 라벨 조회
  const statusTitle =
    normalizedStatus && normalizedStatus in statusLabel
      ? statusLabel[normalizedStatus]
      : "프로젝트";

  // 한글 설명: 프로젝트 삭제 핸들러 (DRAFT 상태에서만 가능)
  const handleDeleteProject = async (
    e: React.MouseEvent,
    project: StatusCardProject
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (normalizedStatus !== "DRAFT") {
      alert("작성중 상태의 프로젝트만 삭제할 수 있습니다.");
      return;
    }

    if (
      !window.confirm(
        `"${project.title || "제목 없음"}" 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      return;
    }

    const projectId = project.remoteId ?? project.id;
    setDeletingIds((prev) => new Set(prev).add(projectId));

    try {
      // 한글 설명: 원격 프로젝트인 경우 서버에서 삭제
      if (project.origin === "remote" && project.remoteId) {
        await deleteProjectApi(project.remoteId);
      }
      // 한글 설명: 로컬 draft인 경우 로컬 스토어에서 삭제
      if (project.origin === "local" && project.localDraftId) {
        removeDraft(project.localDraftId);
      }
      // 한글 설명: 목록 새로고침
      await fetchOverview();
      await fetchByStatus(normalizedStatus!, { force: true });
    } catch (err) {
      console.error("프로젝트 삭제 실패", err);
      alert(
        "프로젝트 삭제 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(projectId);
        return next;
      });
    }
  };

  // 한글 설명: 심사 요청 취소 핸들러 (REVIEW 상태에서만 가능)
  const handleCancelReview = async (
    e: React.MouseEvent,
    project: StatusCardProject
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !window.confirm(
        `"${project.title || "제목 없음"}" 프로젝트의 심사 요청을 취소하시겠습니까? 취소 후 다시 심사를 요청할 수 있습니다.`
      )
    ) {
      return;
    }

    const projectId = project.remoteId ?? project.id;
    setCancelingReviewIds((prev) => new Set(prev).add(projectId));

    try {
      if (project.origin === "remote" && project.remoteId) {
        await cancelReviewRequestApi(project.remoteId);
      }
      await fetchOverview();
      await fetchByStatus(normalizedStatus!, { force: true });
      alert("심사 요청이 취소되었습니다.");
    } catch (err) {
      console.error("심사 요청 취소 실패", err);
      alert(
        "심사 요청 취소 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setCancelingReviewIds((prev) => {
        const next = new Set(prev);
        next.delete(projectId);
        return next;
      });
    }
  };

  // 한글 설명: 공개 예정 취소 핸들러 (SCHEDULED 상태에서만 가능)
  const handleCancelScheduled = async (
    e: React.MouseEvent,
    project: StatusCardProject
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !window.confirm(
        `"${project.title || "제목 없음"}" 프로젝트의 공개 일정을 취소하시겠습니까? 프로젝트는 승인 상태로 돌아갑니다.`
      )
    ) {
      return;
    }

    const projectId = project.remoteId ?? project.id;
    setCancelingScheduledIds((prev) => new Set(prev).add(projectId));

    try {
      if (project.origin === "remote" && project.remoteId) {
        await cancelScheduledProjectApi(project.remoteId);
      }
      await fetchOverview();
      await fetchByStatus(normalizedStatus!, { force: true });
      alert("공개 일정이 취소되었습니다.");
    } catch (err) {
      console.error("공개 예정 취소 실패", err);
      alert(
        "공개 일정 취소 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setCancelingScheduledIds((prev) => {
        const next = new Set(prev);
        next.delete(projectId);
        return next;
      });
    }
  };

  return (
    <Container>
      <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col gap-6 py-16">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">
                {statusTitle}
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                {statusTitle} 상태의 프로젝트를 관리하고 확인하세요.
              </p>
            </div>
            <Link
              to="/profile/maker"
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              목록으로
            </Link>
          </div>
        </header>

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            <p className="font-semibold">
              {statusTitle} 프로젝트를 불러오는 중 문제가 발생했습니다.
            </p>
            <p className="mt-2 text-xs text-red-500">{error}</p>
          </div>
        ) : loading && projects.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 p-12 text-center text-sm text-neutral-500">
            데이터를 불러오는 중입니다...
          </div>
        ) : augmentedProjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-200 p-12 text-center text-sm text-neutral-500">
            {statusTitle} 상태의 프로젝트가 없습니다.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {augmentedProjects.map((project, index) => {
              // 한글 설명: DRAFT는 편집 페이지로, 나머지는 프로젝트 상세 페이지로 이동
              const destination =
                normalizedStatus === "DRAFT"
                  ? `/creator/projects/new/${project.remoteId ?? project.id}`
                  : `/projects/${project.id}`;

              const linkState =
                normalizedStatus === "DRAFT"
                  ? {
                      draftId: project.localDraftId ?? project.id,
                      remoteProjectId: project.remoteId ?? project.id,
                    }
                  : undefined;

              const projectId = project.remoteId ?? project.id;
              const isDeleting = deletingIds.has(projectId);
              const isCancelingReview = cancelingReviewIds.has(projectId);
              const isCancelingScheduled = cancelingScheduledIds.has(projectId);

              // 한글 설명: 상태별 버튼 표시 여부 및 핸들러 결정
              const canDelete = normalizedStatus === "DRAFT";
              const canCancelReview =
                normalizedStatus === "REVIEW" ||
                project.projectReviewStatus === "REVIEW";
              const canCancelScheduled =
                normalizedStatus === "SCHEDULED" ||
                project.projectLifecycleStatus === "SCHEDULED";
              const canEdit = normalizedStatus === "LIVE";

              return (
                <div
                  key={`${project.id ?? "project"}-${index}`}
                  className="flex flex-col gap-3"
                >
                  <Link
                    to={destination}
                    state={linkState}
                    className="group rounded-2xl border border-neutral-200 p-4 transition hover:-translate-y-0.5 hover:border-neutral-900"
                  >
                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-neutral-100">
                      {project.imgUrl ? (
                        <img
                          src={project.imgUrl}
                          alt={project.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                          이미지 없음
                        </div>
                      )}
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="line-clamp-2 text-sm font-medium text-neutral-900">
                        {project.title || "제목 없음"}
                      </p>
                      <p className="line-clamp-2 text-xs text-neutral-500">
                        {project.summary ||
                          `${statusTitle} 상태의 프로젝트입니다.`}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-neutral-500">
                        <span className="rounded-full border border-neutral-200 px-2 py-1">
                          심사: {project.projectReviewStatus}
                        </span>
                        <span className="rounded-full border border-neutral-200 px-2 py-1">
                          진행: {project.projectLifecycleStatus}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* 한글 설명: 상태별 액션 버튼 (카드 바깥쪽 아래) */}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteProject(e, project)}
                      disabled={isDeleting}
                      className="w-full rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isDeleting ? "삭제 중..." : "프로젝트 삭제"}
                    </button>
                  )}

                  {canCancelReview && (
                    <button
                      type="button"
                      onClick={(e) => handleCancelReview(e, project)}
                      disabled={isCancelingReview}
                      className="w-full rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600 transition hover:border-orange-300 hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCancelingReview
                        ? "취소 중..."
                        : "심사요청 취소하기"}
                    </button>
                  )}

                  {canCancelScheduled && (
                    <button
                      type="button"
                      onClick={(e) => handleCancelScheduled(e, project)}
                      disabled={isCancelingScheduled}
                      className="w-full rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600 transition hover:border-orange-300 hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCancelingScheduled ? "취소 중..." : "취소"}
                    </button>
                  )}

                  {canEdit && (
                    <Link
                      to={`/creator/projects/new/${project.remoteId ?? project.id}`}
                      state={{
                        draftId: project.localDraftId ?? project.id,
                        remoteProjectId: project.remoteId ?? project.id,
                      }}
                      className="w-full rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-center text-xs font-medium text-white transition hover:bg-neutral-800"
                    >
                      내용 수정
                    </Link>
                  )}

                  {/* ENDED 상태는 버튼 없음, 카드만 상세 페이지로 링크 */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
};
