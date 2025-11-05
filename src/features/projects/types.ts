// 한글 설명: 프로젝트 관련 도메인 타입 정의. 백엔드 Entity와 DTO 구조를 반영한다.

// ─────────────────────────
// Entity (DB 스키마 기반)
// ─────────────────────────

export type ProjectId = string;
export type MakerId = string;
export type RewardId = string;

export type ProjectStatus =
  | "DRAFT" // 작성 중 (초안)
  | "REVIEW" // 심사 중
  | "APPROVED" // 승인됨
  | "SCHEDULED" // 공개 예정
  | "LIVE" // 진행 중
  | "ENDED" // 종료
  | "REJECTED"; // 반려됨

export interface ProjectEntity {
  id: ProjectId;
  makerId: MakerId; // makers.id 참조
  slug: string; // URL-friendly 고유 식별자 (예: "my-awesome-project")
  title: string;
  summary: string; // 짧은 요약 설명
  category: string; // 카테고리 (테크, 디자인, 푸드 등)
  storyMarkdown: string; // 마크다운 형식의 스토리
  coverImageUrl: string | null;
  coverGallery: string[]; // JSON 배열로 저장 (다중 이미지)
  goalAmount: number; // 목표 모금액
  startDate: string | null; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
  status: ProjectStatus;
  tags: string[]; // JSON 배열로 저장
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  approvedAt: string | null; // 승인 일시
  rejectedAt: string | null; // 반려 일시
  rejectedReason: string | null; // 반려 사유
  liveStartedAt: string | null; // LIVE 시작 일시
  liveEndedAt: string | null; // LIVE 종료 일시
}

export interface RewardEntity {
  id: RewardId;
  projectId: ProjectId; // projects.id 참조
  title: string;
  description: string | null;
  price: number; // 리워드 가격
  limitQty: number | null; // 수량 제한 (null이면 무제한)
  estShippingMonth: string | null; // 예상 배송 월 (예: "2025-03")
  available: boolean; // 판매 가능 여부
  optionConfigJson: string | null; // JSON 문자열 (옵션 구성)
  displayOrder: number; // 표시 순서
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────
// Request DTO (API 요청)
// ─────────────────────────

/**
 * 프로젝트 생성 요청
 */
export interface CreateProjectRequestDTO {
  title: string;
  summary: string;
  category: string;
  storyMarkdown: string;
  coverImageUrl?: string;
  coverGallery?: string[];
  goalAmount: number;
  startDate?: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
  tags?: string[];
  rewards: CreateRewardRequestDTO[];
}

/**
 * 프로젝트 수정 요청
 */
export interface UpdateProjectRequestDTO {
  title?: string;
  summary?: string;
  category?: string;
  storyMarkdown?: string;
  coverImageUrl?: string;
  coverGallery?: string[];
  goalAmount?: number;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  rewards?: CreateRewardRequestDTO[]; // 전체 교체 시
}

/**
 * 리워드 생성/수정 요청
 */
export interface CreateRewardRequestDTO {
  title: string;
  description?: string;
  price: number;
  limitQty?: number;
  estShippingMonth?: string; // yyyy-mm
  available?: boolean;
  optionConfig?: RewardOptionConfigDTO;
  displayOrder?: number;
}

/**
 * 리워드 옵션 구성 DTO
 */
export interface RewardOptionConfigDTO {
  hasOptions: boolean;
  options?: Array<{
    name: string; // 옵션명 (예: "색상", "사이즈")
    type: "select" | "text"; // select: 드롭다운, text: 텍스트 입력
    required: boolean;
    choices?: string[]; // type이 "select"일 때 선택지
  }>;
}

/**
 * 프로젝트 상태 변경 요청 (심사 제출, 공개 요청 등)
 */
export interface ChangeProjectStatusRequestDTO {
  status: "REVIEW" | "SCHEDULED" | "LIVE"; // 변경할 상태
  scheduledStartDate?: string; // SCHEDULED일 때 예정일
}

// ─────────────────────────
// Response DTO (API 응답)
// ─────────────────────────

/**
 * 프로젝트 상세 응답
 */
export interface ProjectDetailResponseDTO {
  id: ProjectId;
  makerId: MakerId;
  makerName: string; // makers.name
  slug: string;
  title: string;
  summary: string;
  category: string;
  storyMarkdown: string;
  coverImageUrl: string | null;
  coverGallery: string[];
  goalAmount: number;
  raised: number; // 누적 모금액 (계산 필드)
  backerCount: number; // 후원자 수 (계산 필드)
  startDate: string | null;
  endDate: string;
  status: ProjectStatus;
  tags: string[];
  rewards: RewardResponseDTO[];
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectedReason: string | null;
  liveStartedAt: string | null;
  liveEndedAt: string | null;
  // 계산 필드
  progressPercent: number; // 진행률 (0-100)
  daysRemaining: number | null; // 남은 일수 (LIVE일 때만)
  isOwner: boolean; // 현재 로그인 유저가 소유자인지
}

/**
 * 프로젝트 목록 응답 (카드 형태)
 */
export interface ProjectCardResponseDTO {
  id: ProjectId;
  slug: string;
  title: string;
  summary: string;
  category: string;
  coverImageUrl: string | null;
  goalAmount: number;
  raised: number;
  backerCount: number;
  endDate: string;
  status: ProjectStatus;
  progressPercent: number;
  daysRemaining: number | null;
  makerName: string;
}

/**
 * 리워드 응답
 */
export interface RewardResponseDTO {
  id: RewardId;
  projectId: ProjectId;
  title: string;
  description: string | null;
  price: number;
  limitQty: number | null;
  remainingQty: number | null; // 남은 수량 (limitQty - 주문 수량)
  estShippingMonth: string | null;
  available: boolean;
  optionConfig: RewardOptionConfigDTO | null;
  displayOrder: number;
}

/**
 * 프로젝트 목록 조회 응답 (페이지네이션)
 */
export interface ProjectListResponseDTO {
  items: ProjectCardResponseDTO[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

/**
 * 프로젝트 초안 목록 응답 (메이커 대시보드용)
 */
export interface ProjectDraftListResponseDTO {
  items: Array<{
    id: ProjectId;
    title: string;
    summary: string;
    category: string;
    coverImageUrl: string | null;
    goalAmount: number;
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
}

// ─────────────────────────
// 유틸리티 타입
// ─────────────────────────

/**
 * 프로젝트 검색/필터링 쿼리 파라미터
 */
export interface ProjectQueryParams {
  category?: string;
  status?: ProjectStatus;
  search?: string; // 제목/요약 검색
  makerId?: MakerId;
  sortBy?: "newest" | "popular" | "endingSoon" | "goalAmount";
  page?: number;
  pageSize?: number;
}

