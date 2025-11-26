import api from "../../../services/api";
import type {
  SettlementSummaryResponse,
  SettlementListItemResponse,
  SettlementResponse,
  PageResponse,
} from "../types";

// 한글 설명: 관리자 정산 요약 조회 API
// GET /api/admin/settlements/summary
export const fetchAdminSettlementSummary =
  async (): Promise<SettlementSummaryResponse> => {
    console.log("[adminSettlementService] GET /api/admin/settlements/summary 요청");
    const { data } = await api.get<SettlementSummaryResponse>(
      "/api/admin/settlements/summary"
    );
    console.log(
      "[adminSettlementService] GET /api/admin/settlements/summary 응답",
      data
    );
    return data;
  };

// 한글 설명: 관리자 정산 목록 조회 API (페이지네이션)
// GET /api/admin/settlements?page=0&size=20
export const fetchAdminSettlementList = async (
  page: number = 0,
  size: number = 20
): Promise<PageResponse<SettlementListItemResponse>> => {
  console.log(
    "[adminSettlementService] GET /api/admin/settlements 요청",
    { page, size }
  );
  const { data } = await api.get<PageResponse<SettlementListItemResponse>>(
    "/api/admin/settlements",
    {
      params: { page, size },
    }
  );
  console.log(
    "[adminSettlementService] GET /api/admin/settlements 응답",
    data
  );
  return data;
};

// 한글 설명: 관리자 정산 상세 조회 API
// GET /api/admin/settlements/{id}
export const fetchAdminSettlementDetail = async (
  settlementId: number
): Promise<SettlementResponse> => {
  console.log(
    "[adminSettlementService] GET /api/admin/settlements/{id} 요청",
    { settlementId }
  );
  const { data } = await api.get<SettlementResponse>(
    `/api/admin/settlements/${settlementId}`
  );
  console.log(
    "[adminSettlementService] GET /api/admin/settlements/{id} 응답",
    data
  );
  return data;
};

// 한글 설명: 정산 생성 API
// POST /api/admin/settlements/{projectId}
export const createSettlement = async (
  projectId: number
): Promise<SettlementResponse> => {
  console.log(
    "[adminSettlementService] POST /api/admin/settlements/{projectId} 요청",
    { projectId }
  );
  const { data } = await api.post<SettlementResponse>(
    `/api/admin/settlements/${projectId}`
  );
  console.log(
    "[adminSettlementService] POST /api/admin/settlements/{projectId} 응답",
    data
  );
  return data;
};

// 한글 설명: 선지급 처리 API
// POST /api/admin/settlements/{id}/first-payout
export const processFirstPayout = async (
  settlementId: number
): Promise<SettlementResponse> => {
  console.log(
    "[adminSettlementService] POST /api/admin/settlements/{id}/first-payout 요청",
    { settlementId }
  );
  const { data } = await api.post<SettlementResponse>(
    `/api/admin/settlements/${settlementId}/first-payout`
  );
  console.log(
    "[adminSettlementService] POST /api/admin/settlements/{id}/first-payout 응답",
    data
  );
  return data;
};

// 한글 설명: 잔금 준비 완료 처리 API
// POST /api/admin/settlements/{id}/final-ready
export const processFinalReady = async (
  settlementId: number
): Promise<SettlementResponse> => {
  console.log(
    "[adminSettlementService] POST /api/admin/settlements/{id}/final-ready 요청",
    { settlementId }
  );
  const { data } = await api.post<SettlementResponse>(
    `/api/admin/settlements/${settlementId}/final-ready`
  );
  console.log(
    "[adminSettlementService] POST /api/admin/settlements/{id}/final-ready 응답",
    data
  );
  return data;
};

// 한글 설명: 잔금 지급 처리 API
// POST /api/admin/settlements/{id}/final-payout
export const processFinalPayout = async (
  settlementId: number
): Promise<SettlementResponse> => {
  console.log(
    "[adminSettlementService] POST /api/admin/settlements/{id}/final-payout 요청",
    { settlementId }
  );
  const { data } = await api.post<SettlementResponse>(
    `/api/admin/settlements/${settlementId}/final-payout`
  );
  console.log(
    "[adminSettlementService] POST /api/admin/settlements/{id}/final-payout 응답",
    data
  );
  return data;
};

