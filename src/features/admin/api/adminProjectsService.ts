import api from "../../../services/api";
import type {
  AdminProjectDetailDTO,
  AdminProjectReviewDTO,
  AdminProjectStatusResponseDTO,
  AdminMakerProfileDTO,
} from "../types";

// 한글 설명: 관리자 프로젝트 심사 목록 조회 API
export const fetchAdminReviewProjects = async (): Promise<AdminProjectReviewDTO[]> => {
  console.log("[adminProjectsService] GET /admin/project/review 요청");
  const { data } = await api.get<AdminProjectReviewDTO[]>(
    "/admin/project/review"
  );
  console.log("[adminProjectsService] GET /admin/project/review 응답", data);
  return data;
};

// 한글 설명: 관리자 프로젝트 상세 조회 API
export const fetchAdminProjectDetail = async (
  projectId: string
): Promise<AdminProjectDetailDTO> => {
  console.log(
    "[adminProjectsService] GET /admin/project/review/{projectId} 요청",
    {
      projectId,
    }
  );
  const { data } = await api.get<AdminProjectDetailDTO>(
    `/admin/project/review/${projectId}`
  );
  console.log(
    "[adminProjectsService] GET /admin/project/review/{projectId} 응답",
    data
  );
  return data;
};

// 한글 설명: 관리자 프로젝트 승인 처리 API
export const approveAdminProject = async (
  projectId: string
): Promise<AdminProjectStatusResponseDTO> => {
  console.log(
    "[adminProjectsService] PATCH /admin/project/{projectId}/approve",
    { projectId }
  );
  const { data } = await api.patch<AdminProjectStatusResponseDTO>(
    `/admin/project/${projectId}/approve`
  );
  return data;
};

// 한글 설명: 관리자 프로젝트 반려 처리 API
// 한글 설명: 백엔드 RejectProjectRequest DTO와 일치: { reason: string }
export const rejectAdminProject = async (
  projectId: string,
  reason: string
): Promise<AdminProjectStatusResponseDTO> => {
  console.log(
    "[adminProjectsService] PATCH /admin/project/{projectId}/reject",
    { projectId, reason }
  );
  // 한글 설명: 백엔드 RejectProjectRequest DTO 형태로 전송: { reason: string }
  const { data } = await api.patch<AdminProjectStatusResponseDTO>(
    `/admin/project/${projectId}/reject`,
    { reason }
  );
  return data;
};

// 한글 설명: 관리자용 메이커 프로필 조회 API
// GET /admin/maker/{makerId}
export const fetchAdminMakerProfile = async (
  makerId: string
): Promise<AdminMakerProfileDTO> => {
  console.log(
    "[adminProjectsService] GET /admin/maker/{makerId} 요청",
    { makerId }
  );
  const { data } = await api.get<AdminMakerProfileDTO>(
    `/admin/maker/${makerId}`
  );
  console.log(
    "[adminProjectsService] GET /admin/maker/{makerId} 응답",
    data
  );
  return data;
};

// 한글 설명: 관리자 반려 사유 프리셋 조회 API
// GET /api/admin/project/reject-reason-presets
export interface RejectReasonPresetResponse {
  presets: string[];
}

export const fetchAdminRejectReasonPresets =
  async (): Promise<RejectReasonPresetResponse> => {
    console.log(
      "[adminProjectsService] GET /api/admin/project/reject-reason-presets 요청"
    );
    try {
      const { data } = await api.get<RejectReasonPresetResponse>(
        "/admin/project/reject-reason-presets"
      );
      console.log(
        "[adminProjectsService] GET /api/admin/project/reject-reason-presets 응답",
        data
      );
      return data;
    } catch (error) {
      // 한글 설명: 백엔드 API가 없을 경우 기본 프리셋 반환 (하위 호환성)
      console.warn(
        "[adminProjectsService] 반려 사유 프리셋 API 호출 실패, 기본값 반환",
        error
      );
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