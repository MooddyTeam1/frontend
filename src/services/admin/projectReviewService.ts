// 한글 설명: 관리자 프로젝트 심사 관련 API 서비스 함수
import api from "../api";
import axios from "axios";
import type {
  AdminProjectReviewResponse,
  AdminProjectDetailResponse,
  ProjectStatusResponse,
  RejectProjectRequest,
  RejectReasonPresetResponse,
} from "../../types/admin/projectReview";

/**
 * 한글 설명: 심사 대기 프로젝트 목록 조회 API
 * 백엔드 엔드포인트: GET /api/admin/project/review
 */
export const getReviewProjects = async (): Promise<AdminProjectReviewResponse[]> => {
  console.log("[projectReviewService] GET /api/admin/project/review 요청");
  const { data } = await api.get<AdminProjectReviewResponse[]>(
    "/api/admin/project/review"
  );
  console.log("[projectReviewService] GET /api/admin/project/review 응답", data);
  return data;
};

/**
 * 한글 설명: 프로젝트 심사 상세 조회 API
 * 백엔드 엔드포인트: GET /api/admin/project/review/{projectId}
 */
export const getProjectDetail = async (
  projectId: number
): Promise<AdminProjectDetailResponse> => {
  console.log(
    "[projectReviewService] GET /api/admin/project/review/{projectId} 요청",
    { projectId }
  );
  const { data } = await api.get<AdminProjectDetailResponse>(
    `/api/admin/project/review/${projectId}`
  );
  console.log(
    "[projectReviewService] GET /api/admin/project/review/{projectId} 응답",
    data
  );
  return data;
};

/**
 * 한글 설명: 프로젝트 승인 API
 * 백엔드 엔드포인트: PATCH /api/admin/project/{projectId}/approve
 */
export const approveProject = async (
  projectId: number
): Promise<ProjectStatusResponse> => {
  console.log(
    "[projectReviewService] PATCH /api/admin/project/{projectId}/approve",
    { projectId }
  );
  const { data } = await api.patch<ProjectStatusResponse>(
    `/api/admin/project/${projectId}/approve`
  );
  return data;
};

/**
 * 한글 설명: 프로젝트 반려 API
 * 백엔드 엔드포인트: PATCH /api/admin/project/{projectId}/reject
 */
export const rejectProject = async (
  projectId: number,
  request: RejectProjectRequest
): Promise<ProjectStatusResponse> => {
  console.log(
    "[projectReviewService] PATCH /api/admin/project/{projectId}/reject",
    { projectId, reason: request.reason }
  );
  // 한글 설명: 백엔드 RejectProjectRequest DTO 형태로 전송: { reason: string }
  const { data } = await api.patch<ProjectStatusResponse>(
    `/api/admin/project/${projectId}/reject`,
    { reason: request.reason }
  );
  return data;
};

/**
 * 한글 설명: 반려 사유 프리셋 목록 조회 API
 * 백엔드 엔드포인트: GET /api/admin/project/reject-reason-presets
 */
export const getRejectReasonPresets = async (): Promise<RejectReasonPresetResponse> => {
  console.log(
    "[projectReviewService] GET /api/admin/project/reject-reason-presets 요청"
  );
  try {
    const { data } = await api.get<RejectReasonPresetResponse>(
      "/api/admin/project/reject-reason-presets"
    );
    console.log(
      "[projectReviewService] GET /api/admin/project/reject-reason-presets 응답",
      data
    );
    return data;
  } catch (error: unknown) {
    // 한글 설명: 백엔드 API가 없을 경우 기본 프리셋 반환 (하위 호환성)
    // 한글 설명: 404 에러 등은 조용히 처리하여 콘솔 에러 로그를 최소화
    const isNotFound = axios.isAxiosError(error) && error.response?.status === 404;

    if (!isNotFound) {
      // 한글 설명: 404가 아닌 다른 에러인 경우에만 경고 로그 출력
      console.warn(
        "[projectReviewService] 반려 사유 프리셋 API 호출 실패, 기본값 반환",
        error
      );
    } else {
      // 한글 설명: 404 에러는 예상된 상황이므로 디버그 레벨로만 로그
      console.log(
        "[projectReviewService] 반려 사유 프리셋 API (/api/admin/project/reject-reason-presets) 엔드포인트가 없습니다. 기본값을 사용합니다."
      );
    }

    // 한글 설명: 기본 프리셋 반환
    return {
      presets: [
        "근거 자료 부족(증빙/계약서/허가서)",
        "리워드/배송/환불 정책 미흡",
        "금지 콘텐츠/정책 위반 가능성",
        "상표권/저작권/초상권 우려",
        "메이커 신원/연락처 불명확",
        "위험물/규제 품목 포함 우려",
        "광고성/과장 표현 과다",
      ],
    };
  }
};

