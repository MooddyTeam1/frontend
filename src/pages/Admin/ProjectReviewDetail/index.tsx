import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { currencyKRW } from "../../../shared/utils/format";
import {
  approveAdminProject,
  fetchAdminProjectDetail,
  rejectAdminProject,
} from "../../../features/admin/api/adminProjectsService";
import type { AdminProjectDetailDTO } from "../../../features/admin/types";
import { statusLabelMap } from "../../../shared/constants/projectStatus";

// 한글 설명: Admin용 프로젝트 심사 상세 페이지. 프로젝트를 승인하거나 반려할 수 있다.
export const AdminProjectReviewDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"project" | "maker">("project");
  const [detail, setDetail] = useState<AdminProjectDetailDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    fetchAdminProjectDetail(projectId)
      .then((data) => {
        setDetail(data);
      })
      .catch((fetchError) => {
        console.error("관리자 프로젝트 상세 조회 실패", fetchError);
        setError("프로젝트 정보를 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId]);

  const project = detail;

  const makerInfo = useMemo(() => {
    if (!project) return null;
    return {
      name: project.makerName,
      contactEmail: project.isOwner ? "-" : null,
      makerId: project.makerId,
    };
  }, [project]);

  // 한글 설명: status와 projectReviewStatus 모두 확인 (백엔드 응답 구조에 따라 다를 수 있음)
  const status = project?.status ?? "DRAFT";
  // 한글 설명: projectReviewStatus 필드가 있으면 우선 사용 (타입 확장 필요 시 추가)
  const reviewStatus =
    (project as any)?.projectReviewStatus ??
    (project as any)?.reviewStatus ??
    status;
  // 한글 설명: REVIEW 상태인지 확인 (status가 REVIEW이거나 reviewStatus가 REVIEW인 경우)
  const isReviewStatus = status === "REVIEW" || reviewStatus === "REVIEW";

  const handleApprove = async () => {
    if (!projectId) return;
    if (!confirm("이 프로젝트를 승인하시겠습니까?")) return;

    setIsProcessing(true);
    try {
      await approveAdminProject(projectId);
      alert("프로젝트가 승인되었습니다.");
      navigate("/admin/projects");
    } catch (approveError) {
      alert("승인 처리 중 오류가 발생했습니다.");
      console.error(approveError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!projectId) return;
    if (!rejectReason.trim()) {
      alert("반려 사유를 입력해주세요.");
      return;
    }

    if (!confirm("이 프로젝트를 반려하시겠습니까?")) return;

    setIsProcessing(true);
    try {
      await rejectAdminProject(projectId, rejectReason.trim());
      alert("프로젝트가 반려되었습니다.");
      navigate("/admin/projects");
    } catch (rejectError) {
      alert("반려 처리 중 오류가 발생했습니다.");
      console.error(rejectError);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="mx-auto min-h-[70vh] max-w-full px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-sm text-neutral-500">
            프로젝트 정보를 불러오는 중입니다...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project || !projectId) {
    return (
      <div className="w-full">
        <div className="mx-auto min-h-[70vh] max-w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-sm text-neutral-500">
              {error ?? "프로젝트를 찾을 수 없습니다."}
            </p>
            <Link
              to="/admin/projects"
              className="mt-4 inline-block rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto min-h-[70vh] max-w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/admin/projects"
                className="text-xs text-neutral-500 hover:text-neutral-900"
              >
                ← 목록으로 돌아가기
              </Link>
              <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
                프로젝트 심사
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    isReviewStatus
                      ? "bg-yellow-100 text-yellow-800"
                      : status === "APPROVED" || reviewStatus === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : status === "REJECTED" || reviewStatus === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-neutral-100 text-neutral-800"
                  }`}
                >
                  {statusLabelMap[reviewStatus as any] ??
                    statusLabelMap[status as any] ??
                    status}
                </span>
                <span className="text-sm text-neutral-500">
                  프로젝트 ID: {project.id}
                </span>
              </div>
            </div>
            {isReviewStatus && (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isProcessing}
                  className="rounded-full border border-red-200 px-6 py-2 text-sm font-medium text-red-600 hover:border-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  반려
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="rounded-full border border-green-200 bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  승인
                </button>
              </div>
            )}
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex gap-2 border-b border-neutral-200">
            <button
              onClick={() => setActiveTab("project")}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "project"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              프로젝트 정보
            </button>
            <button
              onClick={() => setActiveTab("maker")}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "maker"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-900"
              }`}
            >
              메이커 정보
            </button>
          </div>

          {/* 탭 컨텐츠 */}
          {activeTab === "project" ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* 메인 콘텐츠 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 프로젝트 이미지 */}
                {(() => {
                  const allImages: string[] = [];
                  if (project.coverImageUrl) {
                    allImages.push(project.coverImageUrl);
                  }
                  if (
                    project.coverGallery &&
                    Array.isArray(project.coverGallery)
                  ) {
                    project.coverGallery.forEach((img) => {
                      if (img && !allImages.includes(img)) {
                        allImages.push(img);
                      }
                    });
                  }

                  if (allImages.length === 0) {
                    return (
                      <div className="rounded-3xl border border-dashed border-neutral-200 p-12 text-center">
                        <p className="text-sm text-neutral-500">
                          등록된 이미지가 없습니다.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {allImages.map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="overflow-hidden rounded-3xl"
                        >
                          <img
                            src={image}
                            alt={`프로젝트 이미지 ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  );
                })()}

                <section className="space-y-4 rounded-3xl border border-neutral-200 p-6">
                  <header>
                    <h2 className="text-lg font-semibold text-neutral-900">
                      프로젝트 개요
                    </h2>
                    <p className="text-xs text-neutral-500">
                      프로젝트의 기본 정보를 확인하세요.
                    </p>
                  </header>
                  <dl className="space-y-3 text-sm text-neutral-700">
                    <div>
                      <dt className="text-xs text-neutral-500">제목</dt>
                      <dd className="mt-1 text-neutral-900">{project.title}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-neutral-500">요약</dt>
                      <dd className="mt-1 whitespace-pre-line text-neutral-700">
                        {project.summary}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-neutral-500">카테고리</dt>
                      <dd className="mt-1 text-neutral-700">
                        {project.category}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-neutral-500">목표 금액</dt>
                      <dd className="mt-1 text-neutral-900">
                        {currencyKRW(project.goalAmount)}
                      </dd>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-neutral-500">시작일</dt>
                        <dd className="mt-1 text-neutral-700">
                          {project.startDate ?? "미정"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-neutral-500">종료일</dt>
                        <dd className="mt-1 text-neutral-700">
                          {project.endDate ?? "미정"}
                        </dd>
                      </div>
                    </div>
                    <div>
                      <dt className="text-xs text-neutral-500">태그</dt>
                      <dd className="mt-1 text-neutral-700">
                        {project.tags?.length ? project.tags.join(", ") : "-"}
                      </dd>
                    </div>
                  </dl>
                </section>

                <section className="space-y-4 rounded-3xl border border-neutral-200 p-6">
                  <header>
                    <h2 className="text-lg font-semibold text-neutral-900">
                      스토리
                    </h2>
                  </header>
                  <article className="prose max-w-none text-sm text-neutral-700">
                    {project.storyMarkdown || "스토리가 작성되지 않았습니다."}
                  </article>
                </section>

                <section className="space-y-4 rounded-3xl border border-neutral-200 p-6">
                  <header>
                    <h2 className="text-lg font-semibold text-neutral-900">
                      리워드 구성
                    </h2>
                  </header>
                  <div className="space-y-4">
                    {project.rewards.length === 0 ? (
                      <p className="text-sm text-neutral-500">
                        리워드가 등록되지 않았습니다.
                      </p>
                    ) : (
                      project.rewards.map((reward) => (
                        <div
                          key={reward.id}
                          className="rounded-2xl border border-neutral-200 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-neutral-900">
                              {reward.title}
                            </p>
                            <p className="text-sm text-neutral-700">
                              {currencyKRW(reward.price)}
                            </p>
                          </div>
                          {reward.description ? (
                            <p className="mt-2 text-xs text-neutral-500">
                              {reward.description}
                            </p>
                          ) : null}
                          <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
                            {reward.limitQty !== null && (
                              <span>수량 제한: {reward.limitQty}</span>
                            )}
                            {reward.estShippingMonth && (
                              <span>예상 배송: {reward.estShippingMonth}</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              {/* 사이드바 */}
              <aside className="space-y-4">
                <section className="space-y-3 rounded-3xl border border-neutral-200 p-6">
                  <header>
                    <h2 className="text-sm font-semibold text-neutral-900">
                      심사 메모
                    </h2>
                    <p className="text-xs text-neutral-500">
                      프로젝트 승인 여부를 결정하기 전에 확인 사항을
                      정리해보세요.
                    </p>
                  </header>
                  <textarea
                    rows={6}
                    className="w-full rounded-2xl border border-neutral-200 p-3 text-sm focus:border-neutral-900 focus:outline-none"
                    placeholder="심사 메모를 작성하세요."
                  />
                  <button
                    type="button"
                    className="w-full rounded-full border border-neutral-200 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  >
                    메모 저장 (준비중)
                  </button>
                </section>
              </aside>
            </div>
          ) : (
            <section className="space-y-6 rounded-3xl border border-neutral-200 p-6">
              <header>
                <h2 className="text-lg font-semibold text-neutral-900">
                  메이커 정보
                </h2>
              </header>
              {makerInfo ? (
                <div className="space-y-4 text-sm text-neutral-700">
                  <div>
                    <p className="text-xs text-neutral-500">메이커 이름</p>
                    <p className="mt-1 text-neutral-900">{makerInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">메이커 ID</p>
                    <p className="mt-1 text-neutral-700">{makerInfo.makerId}</p>
                  </div>
                  <p className="text-xs text-neutral-500">
                    상세 메이커 정보 API 연동이 필요합니다.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-neutral-500">
                  메이커 정보를 불러오지 못했습니다.
                </p>
              )}
            </section>
          )}
        </div>

        {/* 반려 모달 */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                프로젝트 반려
              </h2>
              <p className="text-sm text-neutral-500">
                반려 사유를 입력해 주세요. 입력한 내용은 메이커에게 전달됩니다.
              </p>
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                className="w-full rounded-2xl border border-neutral-200 p-3 text-sm focus:border-neutral-900 focus:outline-none"
                placeholder="반려 사유"
              />
              <div className="flex justify-end gap-2 text-sm">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="rounded-full border border-neutral-200 px-4 py-2 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                >
                  취소
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="rounded-full border border-red-200 bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  반려하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
