// 한글 설명: 메이커 프로젝트 관리 관련 타입 정의

// 한글 설명: 배송 관련 타입은 별도 파일에서 export
export type {
  ShipmentStatus,
  ShipmentDTO,
  ShipmentSummaryDTO,
  ShipmentFilter,
  ShipmentListResponseDTO,
  UpdateShipmentStatusRequestDTO,
  BulkUpdateShipmentStatusRequestDTO,
  UpdateTrackingInfoRequestDTO,
  BulkTrackingUploadRequestDTO,
  BulkTrackingUploadResponseDTO,
  UpdateShipmentMemoRequestDTO,
} from "./types/shipment";

export {
  SHIPMENT_STATUS_LABELS,
  SHIPMENT_STATUS_COLORS,
} from "./types/shipment";

// 한글 설명: 프로젝트 상태 (메이커 관리용)
export type MakerProjectStatus =
  | "DRAFT" // 작성중
  | "REVIEW" // 심사중
  | "APPROVED" // 승인됨
  | "SCHEDULED" // 공개예정
  | "LIVE" // 진행중
  | "ENDED_SUCCESS" // 달성 종료 (목표 달성)
  | "ENDED_FAILED" // 실패 종료 (목표 미달성)
  | "REJECTED"; // 반려됨

// 한글 설명: 프로젝트 목록 정렬 옵션
export type ProjectSortOption =
  | "recent" // 최신 수정순
  | "startDate" // 시작일 순
  | "raised" // 모금액 높은순
  | "deadline"; // D-Day 임박순

// 한글 설명: 프로젝트 목록 필터
export interface ProjectListFilter {
  status?: MakerProjectStatus | "ALL"; // 상태 필터
  sortBy?: ProjectSortOption; // 정렬 옵션
  page?: number; // 페이지 번호
  pageSize?: number; // 페이지 크기
}

// 한글 설명: 프로젝트 목록 항목 DTO
// GET /api/maker/projects 응답 필드와 일치
export interface MakerProjectListItemDTO {
  id: number;
  thumbnailUrl: string | null;
  title: string;
  category: string;
  status: MakerProjectStatus;
  progressPercent: number; // 진행률 (0-100)
  currentAmount: number; // 현재 모금 금액 (원)
  goalAmount: number; // 목표 금액 (원)
  daysLeft: number | null; // D-Day (null: 종료됨 또는 종료일 없음, 음수: 종료됨)
  supporterCount: number; // 서포터 수
  lastModifiedAt: string; // 마지막 수정일시 (ISO 8601 형식)
}

// 한글 설명: 프로젝트 목록 응답 DTO
export interface MakerProjectListResponseDTO {
  projects: MakerProjectListItemDTO[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 한글 설명: 프로젝트 통계 요약 DTO
// GET /api/maker/projects/stats/summary 응답 필드와 일치
export interface ProjectSummaryStatsDTO {
  totalProjects: number; // 전체 프로젝트 수 (모든 상태 포함)
  liveProjects: number; // 진행중 프로젝트 수 (status = LIVE)
  totalRaised: number; // 총 모금액 (원) - 모든 프로젝트의 currentAmount 합계
  newProjectsThisMonth: number; // 이번 달 신규 프로젝트 수 (이번 달에 생성된 프로젝트)
}

// 한글 설명: 프로젝트 상세 통계 DTO
export interface ProjectDetailStatsDTO {
  todayViews: number; // 오늘 방문수
  totalViews: number; // 전체 방문수
  totalRaised: number; // 전체 모금액
  goalAmount: number; // 목표 금액
  progressPercent: number; // 달성률
  supporterCount: number; // 서포터 수
  repeatSupporterRate: number; // 재후원자 비율
  averageSupportAmount: number; // 평균 후원 금액
  topReward: {
    // 가장 많이 선택된 리워드
    id: number;
    title: string;
    count: number;
  } | null;
}

// 한글 설명: 일별 통계 데이터
export interface DailyStatsDTO {
  date: string; // YYYY-MM-DD
  views: number;
  supporters: number;
  amount: number;
}

// 한글 설명: 채널별 유입 통계
export interface ChannelStatsDTO {
  channel: string; // 직접방문, 검색, 인스타, 블로그, 카카오톡 등
  count: number;
  percentage: number;
}

// 한글 설명: 리워드별 판매 통계
export interface RewardSalesStatsDTO {
  rewardId: number;
  rewardTitle: string;
  salesCount: number;
  totalAmount: number;
  percentage: number; // 전체 판매 대비 비율
}

// 한글 설명: 주문/후원 항목 DTO
export interface OrderItemDTO {
  orderId: number;
  orderCode: string;
  supporterName: string; // 서포터 이름 또는 닉네임
  supporterId: number;
  rewardTitle: string;
  rewardId: number;
  amount: number;
  paymentStatus: "SUCCESS" | "CANCELLED" | "REFUNDED" | "PENDING";
  deliveryStatus: "PREPARING" | "SHIPPED" | "DELIVERED" | "NONE";
  orderedAt: string;
  paidAt: string | null;
}

// 한글 설명: 공지/업데이트 DTO
export interface ProjectNoticeDTO {
  id: number;
  title: string;
  content: string; // Markdown
  isPublic: boolean; // 공개 여부
  notifySupporters: boolean; // 서포터에게 알림 발송 여부
  createdAt: string;
  updatedAt: string;
}

// 한글 설명: Q&A 항목 DTO
export interface ProjectQnADTO {
  id: number;
  questionerName: string;
  questionerId: number;
  question: string;
  answer: string | null;
  status: "PENDING" | "ANSWERED";
  createdAt: string;
  answeredAt: string | null;
}

// 한글 설명: 정산 정보 DTO
export interface SettlementInfoDTO {
  totalRaised: number; // 총 모금액
  platformFee: number; // 수수료
  pgFee: number; // PG비
  otherFees: number; // 기타 비용
  finalAmount: number; // 최종 정산 예상액
  paymentConfirmedAt: string | null; // 결제 확정일
  settlementScheduledAt: string | null; // 정산 예정일
  bankName: string | null; // 은행
  accountNumber: string | null; // 계좌번호
  accountHolder: string | null; // 예금주
}

// 한글 설명: 프로젝트 상세 관리 정보 DTO
export interface MakerProjectDetailDTO {
  // 기본 정보
  id: number;
  thumbnailUrl: string | null;
  title: string;
  summary: string;
  category: string;
  status: MakerProjectStatus;
  
  // 진행 정보
  goalAmount: number;
  currentAmount: number;
  progressPercent: number;
  supporterCount: number;
  daysLeft: number | null;
  startDate: string | null;
  endDate: string | null;
  
  // 통계
  stats: ProjectDetailStatsDTO;
  dailyStats: DailyStatsDTO[];
  channelStats: ChannelStatsDTO[];
  rewardSalesStats: RewardSalesStatsDTO[];
  
  // 리워드 목록 (간단 버전)
  rewards: Array<{
    id: number;
    title: string;
    price: number;
    salesCount: number;
    limitQty: number | null;
    available: boolean;
  }>;
  
  // 주문 목록 (최근 N개)
  recentOrders: OrderItemDTO[];
  
  // 공지 목록
  notices: ProjectNoticeDTO[];
  
  // Q&A 목록
  qnas: ProjectQnADTO[];
  
  // 정산 정보
  settlement: SettlementInfoDTO;
  
  // 메타 정보
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  rejectedReason: string | null; // 반려 사유
}

