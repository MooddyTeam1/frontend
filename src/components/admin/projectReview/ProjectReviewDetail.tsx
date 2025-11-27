// 한글 설명: 프로젝트 심사 상세 컴포넌트
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjectDetail,
  approveProject,
  rejectProject,
  getRejectReasonPresets,
} from "../../../services/admin/projectReviewService";
import type {
  AdminProjectDetailResponse,
  RejectReasonPresetResponse,
} from "../../../types/admin/projectReview";
import { StoryViewer } from "../../../shared/components/StoryViewer";

// 한글 설명: 날짜만 포맷팅 (YYYY-MM-DD 형식)
const formatDateOnly = (dateString: string | null): string => {
  if (!dateString) return "-";
  return dateString;
};

/**
 * 한글 설명: 프로젝트 심사 상세 컴포넌트
 * 
 * React Query를 사용하려면:
 * 1. npm install @tanstack/react-query 실행
 * 2. useProjectDetail, useApproveProject, useRejectProject, useRejectReasonPresets 훅을 사용하도록 수정
 */
export const ProjectReviewDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");

  // 한글 설명: 프로젝트 상세 데이터 상태
  const [project, setProject] = useState<AdminProjectDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 프리셋 데이터 상태
  const [presets, setPresets] = useState<RejectReasonPresetResponse | null>(null);

  // 한글 설명: 승인/반려 처리 상태
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // 한글 설명: 프로젝트 상세 데이터 로드
  useEffect(() => {
    if (!projectId) return;
    
    setIsLoading(true);
    setError(null);
    getProjectDetail(parseInt(projectId))
      .then((data) => {
        setProject(data);
      })
      .catch((fetchError) => {
        console.error("프로젝트 상세 조회 실패", fetchError);
        setError("프로젝트를 불러오는 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [projectId]);

  // 한글 설명: 프리셋 데이터 로드
  // 한글 설명: 백엔드 API가 없어도 서비스 함수에서 기본값을 반환하므로 항상 데이터가 있음
  useEffect(() => {
    getRejectReasonPresets()
      .then((data) => {
        setPresets(data);
      })
      .catch((error) => {
        // 한글 설명: 예상치 못한 에러인 경우에만 로그 출력
        // 한글 설명: 일반적으로는 서비스 함수에서 기본값을 반환하므로 이 catch는 실행되지 않음
        console.warn("프리셋 조회 중 예상치 못한 에러 발생", error);
        // 한글 설명: 기본 프리셋 설정
        setPresets({
          presets: [
            "근거 자료 부족(증빙/계약서/허가서)",
            "리워드/배송/환불 정책 미흡",
            "금지 콘텐츠/정책 위반 가능성",
            "상표권/저작권/초상권 우려",
            "메이커 신원/연락처 불명확",
            "위험물/규제 품목 포함 우려",
            "광고성/과장 표현 과다",
          ],
        });
      });
  }, []);

  // 한글 설명: 프로젝트 승인 처리
  const handleApprove = async () => {
    if (!projectId) return;

    if (!confirm("이 프로젝트를 승인하시겠습니까?")) {
      return;
    }

    setIsApproving(true);
    try {
      await approveProject(parseInt(projectId));
      alert("프로젝트가 승인되었습니다.");
      navigate("/admin/project/review");
    } catch (error) {
      alert(`승인 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    } finally {
      setIsApproving(false);
    }
  };

  // 한글 설명: 프로젝트 반려 처리
  const handleReject = async () => {
    if (!projectId || !rejectReason.trim()) {
      alert("반려 사유를 입력해주세요.");
      return;
    }

    if (!confirm("이 프로젝트를 반려하시겠습니까?")) {
      return;
    }

    setIsRejecting(true);
    try {
      await rejectProject(parseInt(projectId), { reason: rejectReason });
      alert("프로젝트가 반려되었습니다.");
      navigate("/admin/project/review");
    } catch (error) {
      alert(`반려 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    } finally {
      setIsRejecting(false);
    }
  };

  // 한글 설명: 프리셋 선택 처리
  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    setRejectReason(preset);
  };

  // 한글 설명: 로딩 상태 UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // 한글 설명: 에러 상태 UI
  if (error || !project) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">{error || "프로젝트를 불러오는 중 오류가 발생했습니다."}</div>
      </div>
    );
  }

  // 한글 설명: 승인/반려 가능 여부 확인
  const canReview = project.projectReviewStatus === "REVIEW";

  return (
    <div className="space-y-6">
      {/* 한글 설명: 헤더 영역 */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/admin/project/review")}
            className="text-xs text-gray-500 hover:text-gray-900 mb-2"
          >
            ← 목록으로 돌아가기
          </button>
          <h1 className="text-2xl font-bold">프로젝트 심사 상세</h1>
        </div>
        {canReview && (
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isApproving ? "승인 중..." : "승인"}
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              반려
            </button>
          </div>
        )}
      </div>

      {/* 한글 설명: 프로젝트 기본 정보 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">프로젝트 정보</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">제목</label>
            <p className="mt-1 text-gray-900">{project.title}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">메이커</label>
            <p className="mt-1 text-gray-900">{project.makerName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">카테고리</label>
            <p className="mt-1 text-gray-900">{project.category}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">목표 금액</label>
            <p className="mt-1 text-gray-900">
              {project.goalAmount?.toLocaleString()}원
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">시작일</label>
            <p className="mt-1 text-gray-900">
              {formatDateOnly(project.startDate)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">종료일</label>
            <p className="mt-1 text-gray-900">
              {formatDateOnly(project.endDate)}
            </p>
          </div>
        </div>

        {project.coverImageUrl && (
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-500">대표 이미지</label>
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="mt-2 max-w-md rounded-lg"
            />
          </div>
        )}

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-500">요약</label>
          <p className="mt-1 text-gray-900">{project.summary}</p>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-500">스토리</label>
          <div className="mt-2">
            <StoryViewer markdown={project.storyMarkdown || ""} />
          </div>
        </div>
      </div>

      {/* 한글 설명: 메이커 프로필 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">메이커 정보</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">메이커 유형</label>
            <p className="mt-1 text-gray-900">
              {project.makerProfile.makerType === "INDIVIDUAL" ? "개인" : "사업자"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">이름</label>
            <p className="mt-1 text-gray-900">{project.makerProfile.name}</p>
          </div>
          {project.makerProfile.makerType === "BUSINESS" && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-500">사업자번호</label>
                <p className="mt-1 text-gray-900">
                  {project.makerProfile.businessNumber || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">대표자명</label>
                <p className="mt-1 text-gray-900">
                  {project.makerProfile.representative || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">사업자명</label>
                <p className="mt-1 text-gray-900">
                  {project.makerProfile.businessName || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">업종</label>
                <p className="mt-1 text-gray-900">
                  {project.makerProfile.industryType || "-"}
                </p>
              </div>
            </>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">연락 이메일</label>
            <p className="mt-1 text-gray-900">
              {project.makerProfile.contactEmail || "-"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">연락 전화번호</label>
            <p className="mt-1 text-gray-900">
              {project.makerProfile.contactPhone || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* 한글 설명: 리워드 목록 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">리워드 목록</h2>
        <div className="space-y-4">
          {project.rewards.length === 0 ? (
            <p className="text-sm text-gray-500">리워드가 없습니다.</p>
          ) : (
            project.rewards.map((reward) => (
              <div key={reward.id} className="border rounded-lg p-4">
                <h3 className="font-medium text-lg">{reward.title}</h3>
                <p className="text-gray-600 mt-1">{reward.description}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <span>가격: {reward.price.toLocaleString()}원</span>
                  {reward.limitQty && <span>수량: {reward.limitQty}개</span>}
                  {reward.estShippingMonth && (
                    <span>배송 예정: {reward.estShippingMonth}</span>
                  )}
                  <span className={reward.available ? "text-green-600" : "text-red-600"}>
                    {reward.available ? "판매중" : "품절"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 한글 설명: 반려 모달 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">프로젝트 반려</h3>

            {presets && presets.presets.length > 0 && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-500 mb-2 block">
                  반려 사유 프리셋
                </label>
                <div className="flex flex-wrap gap-2">
                  {presets.presets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePresetSelect(preset)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedPreset === preset
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                반려 사유 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                  setSelectedPreset("");
                }}
                placeholder="반려 사유를 입력해주세요 (최대 1000자)"
                maxLength={1000}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {rejectReason.length} / 1000자
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedPreset("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || isRejecting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isRejecting ? "반려 중..." : "반려하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

