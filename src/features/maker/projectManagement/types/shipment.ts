// 한글 설명: 배송 관리 관련 타입 정의

// 한글 설명: 배송 상태
export type ShipmentStatus =
  | "READY" // 배송 준비 중
  | "SHIPPED" // 발송 완료
  | "DELIVERED" // 배송 완료
  | "ISSUE"; // 문제/보류

// 한글 설명: 배송 상태 라벨
export const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, string> = {
  READY: "배송 준비 중",
  SHIPPED: "발송 완료",
  DELIVERED: "배송 완료",
  ISSUE: "문제/보류",
};

// 한글 설명: 배송 상태 색상
export const SHIPMENT_STATUS_COLORS: Record<ShipmentStatus, string> = {
  READY: "bg-yellow-100 text-yellow-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  ISSUE: "bg-red-100 text-red-700",
};

// 한글 설명: 배송 정보 DTO
export interface ShipmentDTO {
  id: number;
  orderId: number;
  orderCode: string;
  supporterName: string; // 서포터 이름 또는 닉네임
  supporterId: number;
  supporterPhone?: string | null; // 연락처
  supporterEmail?: string | null; // 이메일
  address: {
    // 배송지 주소
    recipient: string; // 수령인
    phone: string; // 수령인 연락처
    postalCode: string; // 우편번호
    address1: string; // 기본 주소
    address2?: string | null; // 상세 주소
    fullAddress: string; // 전체 주소 (표시용)
  };
  reward: {
    id: number;
    title: string;
    options?: string | null; // 선택한 옵션 정보
    quantity: number; // 수량
  };
  amount: number; // 결제 금액
  paymentStatus: "SUCCESS" | "CANCELLED" | "REFUNDED" | "PENDING";
  shipmentStatus: ShipmentStatus; // 배송 상태
  courierName?: string | null; // 택배사 이름
  trackingNumber?: string | null; // 송장번호
  memo?: string | null; // 메이커 내부 메모
  shippedAt?: string | null; // 발송일
  deliveredAt?: string | null; // 배송 완료일
  issueReason?: string | null; // 문제 사유
  orderedAt: string; // 주문일
  paidAt?: string | null; // 결제일
  createdAt: string;
  updatedAt: string;
}

// 한글 설명: 배송 요약 통계 DTO
export interface ShipmentSummaryDTO {
  totalOrders: number; // 총 주문 수
  readyCount: number; // 배송 준비 중
  shippedCount: number; // 배송 중
  deliveredCount: number; // 배송 완료
  issueCount: number; // 배송 문제
  scheduledStartDate?: string | null; // 배송 시작 예정일
  targetEndDate?: string | null; // 배송 마감 목표일
}

// 한글 설명: 배송 필터 옵션
export interface ShipmentFilter {
  status?: ShipmentStatus | "ALL"; // 배송 상태 필터
  rewardId?: number; // 리워드 필터
  search?: string; // 검색어 (주문번호, 이름, 연락처, 주소)
  sortBy?: "orderDate" | "status" | "amount" | "deliveryDate"; // 정렬 옵션
  sortOrder?: "asc" | "desc"; // 정렬 방향
  page?: number;
  pageSize?: number;
}

// 한글 설명: 배송 목록 응답 DTO
export interface ShipmentListResponseDTO {
  shipments: ShipmentDTO[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: ShipmentSummaryDTO;
}

// 한글 설명: 배송 상태 변경 요청 DTO
export interface UpdateShipmentStatusRequestDTO {
  status: ShipmentStatus;
  issueReason?: string | null; // ISSUE 상태일 때만 필요
}

// 한글 설명: 일괄 배송 상태 변경 요청 DTO
export interface BulkUpdateShipmentStatusRequestDTO {
  shipmentIds: number[];
  status: ShipmentStatus;
  issueReason?: string | null;
}

// 한글 설명: 송장 정보 업데이트 요청 DTO
export interface UpdateTrackingInfoRequestDTO {
  courierName: string;
  trackingNumber: string;
}

// 한글 설명: 일괄 송장 업로드 요청 DTO (엑셀)
export interface BulkTrackingUploadRequestDTO {
  shipments: Array<{
    orderCode: string; // 주문번호로 매칭
    courierName: string;
    trackingNumber: string;
  }>;
}

// 한글 설명: 일괄 송장 업로드 응답 DTO
export interface BulkTrackingUploadResponseDTO {
  successCount: number;
  failureCount: number;
  failures: Array<{
    orderCode: string;
    reason: string;
  }>;
}

// 한글 설명: 배송 메모 업데이트 요청 DTO
export interface UpdateShipmentMemoRequestDTO {
  memo: string | null;
}

