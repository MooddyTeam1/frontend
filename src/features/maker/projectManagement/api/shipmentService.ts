// 한글 설명: 배송 관리 API 서비스
import api from "../../../../services/api";
import type {
  ShipmentListResponseDTO,
  ShipmentFilter,
  ShipmentSummaryDTO,
  ShipmentDTO,
  UpdateShipmentStatusRequestDTO,
  BulkUpdateShipmentStatusRequestDTO,
  UpdateTrackingInfoRequestDTO,
  BulkTrackingUploadRequestDTO,
  BulkTrackingUploadResponseDTO,
  UpdateShipmentMemoRequestDTO,
} from "../types/shipment";

// 한글 설명: 배송 목록 조회
// GET /api/maker/projects/:projectId/shipments
export const fetchShipments = async (
  projectId: number,
  filter: ShipmentFilter = {}
): Promise<ShipmentListResponseDTO> => {
  const params = new URLSearchParams();
  if (filter.status && filter.status !== "ALL") {
    params.append("status", filter.status);
  }
  if (filter.rewardId) {
    params.append("rewardId", String(filter.rewardId));
  }
  if (filter.search) {
    params.append("search", filter.search);
  }
  if (filter.sortBy) {
    params.append("sortBy", filter.sortBy);
  }
  if (filter.sortOrder) {
    params.append("sortOrder", filter.sortOrder);
  }
  if (filter.page) {
    params.append("page", String(filter.page));
  }
  if (filter.pageSize) {
    params.append("pageSize", String(filter.pageSize));
  }

  console.log(
    "[shipmentService] GET /api/maker/projects/:projectId/shipments 요청",
    { projectId, filter }
  );
  const { data } = await api.get<ShipmentListResponseDTO>(
    `/api/maker/projects/${projectId}/shipments?${params.toString()}`
  );
  console.log(
    "[shipmentService] GET /api/maker/projects/:projectId/shipments 응답",
    data
  );
  return data;
};

// 한글 설명: 배송 요약 통계 조회
// GET /api/maker/projects/:projectId/shipments/summary
export const fetchShipmentSummary = async (
  projectId: number
): Promise<ShipmentSummaryDTO> => {
  console.log(
    "[shipmentService] GET /api/maker/projects/:projectId/shipments/summary 요청",
    { projectId }
  );
  const { data } = await api.get<ShipmentSummaryDTO>(
    `/api/maker/projects/${projectId}/shipments/summary`
  );
  console.log(
    "[shipmentService] GET /api/maker/projects/:projectId/shipments/summary 응답",
    data
  );
  return data;
};

// 한글 설명: 배송 상태 변경
// PATCH /api/maker/projects/:projectId/shipments/:shipmentId/status
export const updateShipmentStatus = async (
  projectId: number,
  shipmentId: number,
  request: UpdateShipmentStatusRequestDTO
): Promise<ShipmentDTO> => {
  console.log(
    "[shipmentService] PATCH /api/maker/projects/:projectId/shipments/:shipmentId/status 요청",
    { projectId, shipmentId, request }
  );
  const { data } = await api.patch<ShipmentDTO>(
    `/api/maker/projects/${projectId}/shipments/${shipmentId}/status`,
    request
  );
  console.log(
    "[shipmentService] PATCH /api/maker/projects/:projectId/shipments/:shipmentId/status 응답",
    data
  );
  return data;
};

// 한글 설명: 일괄 배송 상태 변경
// PATCH /api/maker/projects/:projectId/shipments/bulk-status
export const bulkUpdateShipmentStatus = async (
  projectId: number,
  request: BulkUpdateShipmentStatusRequestDTO
): Promise<{ updatedCount: number }> => {
  console.log(
    "[shipmentService] PATCH /api/maker/projects/:projectId/shipments/bulk-status 요청",
    { projectId, request }
  );
  const { data } = await api.patch<{ updatedCount: number }>(
    `/api/maker/projects/${projectId}/shipments/bulk-status`,
    request
  );
  console.log(
    "[shipmentService] PATCH /api/maker/projects/:projectId/shipments/bulk-status 응답",
    data
  );
  return data;
};

// 한글 설명: 송장 정보 업데이트
// PATCH /api/maker/projects/:projectId/shipments/:shipmentId/tracking
export const updateTrackingInfo = async (
  projectId: number,
  shipmentId: number,
  request: UpdateTrackingInfoRequestDTO
): Promise<ShipmentDTO> => {
  console.log(
    "[shipmentService] PATCH /api/maker/projects/:projectId/shipments/:shipmentId/tracking 요청",
    { projectId, shipmentId, request }
  );
  const { data } = await api.patch<ShipmentDTO>(
    `/api/maker/projects/${projectId}/shipments/${shipmentId}/tracking`,
    request
  );
  console.log(
    "[shipmentService] PATCH /api/maker/projects/:projectId/shipments/:shipmentId/tracking 응답",
    data
  );
  return data;
};

// 한글 설명: 일괄 송장 업로드 (엑셀)
// POST /api/maker/projects/:projectId/shipments/bulk-tracking
export const bulkUploadTracking = async (
  projectId: number,
  request: BulkTrackingUploadRequestDTO
): Promise<BulkTrackingUploadResponseDTO> => {
  console.log(
    "[shipmentService] POST /api/maker/projects/:projectId/shipments/bulk-tracking 요청",
    { projectId, request }
  );
  const { data } = await api.post<BulkTrackingUploadResponseDTO>(
    `/api/maker/projects/${projectId}/shipments/bulk-tracking`,
    request
  );
  console.log(
    "[shipmentService] POST /api/maker/projects/:projectId/shipments/bulk-tracking 응답",
    data
  );
  return data;
};

// 한글 설명: 배송 메모 업데이트
// PATCH /api/maker/projects/:projectId/shipments/:shipmentId/memo
export const updateShipmentMemo = async (
  projectId: number,
  shipmentId: number,
  request: UpdateShipmentMemoRequestDTO
): Promise<ShipmentDTO> => {
  console.log(
    "[shipmentService] PATCH /api/maker/projects/:projectId/shipments/:shipmentId/memo 요청",
    { projectId, shipmentId, request }
  );
  const { data } = await api.patch<ShipmentDTO>(
    `/api/maker/projects/${projectId}/shipments/${shipmentId}/memo`,
    request
  );
  console.log(
    "[shipmentService] PATCH /api/maker/projects/:projectId/shipments/:shipmentId/memo 응답",
    data
  );
  return data;
};

// 한글 설명: 배송 목록 엑셀 다운로드
// GET /api/maker/projects/:projectId/shipments/export
export const exportShipments = async (
  projectId: number,
  filter: ShipmentFilter = {},
  format: "csv" | "xlsx" = "xlsx"
): Promise<Blob> => {
  const params = new URLSearchParams();
  if (filter.status && filter.status !== "ALL") {
    params.append("status", filter.status);
  }
  if (filter.rewardId) {
    params.append("rewardId", String(filter.rewardId));
  }
  if (filter.search) {
    params.append("search", filter.search);
  }
  params.append("format", format);

  console.log(
    "[shipmentService] GET /api/maker/projects/:projectId/shipments/export 요청",
    { projectId, filter, format }
  );
  const { data } = await api.get(
    `/api/maker/projects/${projectId}/shipments/export?${params.toString()}`,
    {
      responseType: "blob",
    }
  );
  console.log(
    "[shipmentService] GET /api/maker/projects/:projectId/shipments/export 응답",
    "Blob"
  );
  return data;
};

