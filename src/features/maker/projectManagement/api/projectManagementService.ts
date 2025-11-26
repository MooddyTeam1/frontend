// 한글 설명: 메이커 프로젝트 관리 API 서비스
import api from "../../../../services/api";
import type {
  MakerProjectListResponseDTO,
  ProjectListFilter,
  ProjectSummaryStatsDTO,
  MakerProjectDetailDTO,
  OrderItemDTO,
  ProjectNoticeDTO,
  ProjectQnADTO,
} from "../types";

// 한글 설명: 프로젝트 목록 조회
// GET /api/maker/projects
// API 명세: MAKER_PROJECT_LIST_API.md
export const getMakerProjects = async (
  filter: ProjectListFilter = {}
): Promise<MakerProjectListResponseDTO> => {
  const params = new URLSearchParams();
  
  // 한글 설명: status 파라미터 (기본값: "ALL")
  const status = filter.status || "ALL";
  if (status !== "ALL") {
    params.append("status", status);
  }
  
  // 한글 설명: sortBy 파라미터 (기본값: "recent")
  if (filter.sortBy) {
    params.append("sortBy", filter.sortBy);
  }
  
  // 한글 설명: page 파라미터 (기본값: 1)
  const page = filter.page || 1;
  params.append("page", String(page));
  
  // 한글 설명: pageSize 파라미터 (기본값: 12)
  const pageSize = filter.pageSize || 12;
  params.append("pageSize", String(pageSize));

  console.log(
    "[projectManagementService] GET /api/maker/projects 요청",
    { filter, queryString: params.toString() }
  );
  const { data } = await api.get<MakerProjectListResponseDTO>(
    `/api/maker/projects?${params.toString()}`
  );
  console.log(
    "[projectManagementService] GET /api/maker/projects 응답",
    data
  );
  return data;
};

// 한글 설명: 프로젝트 통계 요약 조회
// GET /api/maker/projects/stats/summary
// API 명세: MAKER_PROJECT_LIST_API.md
export const getProjectSummaryStats =
  async (): Promise<ProjectSummaryStatsDTO> => {
    console.log(
      "[projectManagementService] GET /api/maker/projects/stats/summary 요청"
    );
    const { data } = await api.get<ProjectSummaryStatsDTO>(
      "/api/maker/projects/stats/summary"
    );
    console.log(
      "[projectManagementService] GET /api/maker/projects/stats/summary 응답",
      data
    );
    return data;
  };

// 한글 설명: 프로젝트 상세 관리 정보 조회
// GET /api/maker/projects/:projectId
// API 명세: MAKER_PROJECT_DETAIL_API.md
export const getMakerProjectDetail = async (
  projectId: number
): Promise<MakerProjectDetailDTO> => {
  console.log(
    "[projectManagementService] GET /api/maker/projects/:projectId 요청",
    { projectId }
  );
  const { data } = await api.get<MakerProjectDetailDTO>(
    `/api/maker/projects/${projectId}`
  );
  console.log(
    "[projectManagementService] GET /api/maker/projects/:projectId 응답",
    data
  );
  console.log(
    "[projectManagementService] 리워드 개수:",
    data.rewards?.length || 0
  );
  return data;
};

// 한글 설명: 주문 목록 조회
// GET /api/maker/projects/:projectId/orders
export const getProjectOrders = async (
  projectId: number,
  params?: {
    rewardId?: number;
    paymentStatus?: string;
    deliveryStatus?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<{ orders: OrderItemDTO[]; totalCount: number }> => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
  }

  const { data } = await api.get<{ orders: OrderItemDTO[]; totalCount: number }>(
    `/api/maker/projects/${projectId}/orders?${queryParams.toString()}`
  );
  return data;
};

// 한글 설명: 주문 목록 엑셀 다운로드
// GET /api/maker/projects/:projectId/orders/export
export const exportProjectOrders = async (
  projectId: number,
  format: "csv" | "xlsx" = "xlsx"
): Promise<Blob> => {
  const { data } = await api.get(`/api/maker/projects/${projectId}/orders/export?format=${format}`, {
    responseType: "blob",
  });
  return data;
};

// 한글 설명: 공지 목록 조회 (메이커용, 페이지네이션)
// GET /api/maker/projects/:projectId/news
export const getProjectNotices = async (
  projectId: number,
  params?: {
    page?: number;
    size?: number;
    keyword?: string;
    from?: string; // YYYY-MM-DD
    to?: string; // YYYY-MM-DD
  }
): Promise<{
  content: ProjectNoticeDTO[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}> => {
  const queryParams = new URLSearchParams();
  if (params) {
    if (params.page !== undefined) {
      queryParams.append("page", String(params.page));
    }
    if (params.size !== undefined) {
      queryParams.append("size", String(params.size));
    }
    if (params.keyword) {
      queryParams.append("keyword", params.keyword);
    }
    if (params.from) {
      queryParams.append("from", params.from);
    }
    if (params.to) {
      queryParams.append("to", params.to);
    }
  }

  const { data } = await api.get<{
    content: ProjectNoticeDTO[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
  }>(`/api/maker/projects/${projectId}/news?${queryParams.toString()}`);
  return data;
};

// 한글 설명: 공지 생성
// POST /api/maker/projects/:projectId/news
export const createProjectNotice = async (
  projectId: number,
  notice: {
    title: string;
    content: string;
    isPublic: boolean;
    notifySupporters: boolean;
  }
): Promise<ProjectNoticeDTO> => {
  const { data } = await api.post<ProjectNoticeDTO>(
    `/api/maker/projects/${projectId}/news`,
    notice
  );
  return data;
};

// 한글 설명: 공지 수정
// PUT /api/maker/projects/:projectId/news/:newsId
export const updateProjectNotice = async (
  projectId: number,
  noticeId: number,
  notice: Partial<{
    title: string;
    content: string;
    isPublic: boolean;
    notifySupporters: boolean;
  }>
): Promise<ProjectNoticeDTO> => {
  const { data } = await api.put<ProjectNoticeDTO>(
    `/api/maker/projects/${projectId}/news/${noticeId}`,
    notice
  );
  return data;
};

// 한글 설명: 공지 삭제
// DELETE /api/maker/projects/:projectId/news/:newsId
export const deleteProjectNotice = async (
  projectId: number,
  noticeId: number
): Promise<void> => {
  await api.delete(`/api/maker/projects/${projectId}/news/${noticeId}`);
};

// 한글 설명: Q&A 답변 작성
// POST /api/maker/projects/:projectId/qnas/:qnaId/answer
export const answerProjectQnA = async (
  projectId: number,
  qnaId: number,
  answer: string
): Promise<ProjectQnADTO> => {
  const { data } = await api.post<ProjectQnADTO>(
    `/api/maker/projects/${projectId}/qnas/${qnaId}/answer`,
    { answer }
  );
  return data;
};

// 한글 설명: 프로젝트 일정 변경 요청
// POST /api/maker/projects/:projectId/schedule-change
export const requestScheduleChange = async (
  projectId: number,
  schedule: {
    startDate?: string;
    endDate?: string;
    reason: string;
  }
): Promise<void> => {
  await api.post(`/api/maker/projects/${projectId}/schedule-change`, schedule);
};

// 한글 설명: 프로젝트 중단/조기종료 요청
// POST /api/maker/projects/:projectId/early-termination
export const requestEarlyTermination = async (
  projectId: number,
  reason: string
): Promise<void> => {
  await api.post(`/api/maker/projects/${projectId}/early-termination`, {
    reason,
  });
};

