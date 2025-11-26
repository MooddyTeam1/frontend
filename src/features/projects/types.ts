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

// 한글 설명: 백오피스/메이커 전용 프로젝트 상태 구분값 (라이프사이클 기준)
export type ProjectLifecycleStatus =
  | "NONE" // 아직 공개 일정이 정해지지 않은 상태
  | "DRAFT" // 초안 상태 (임시 저장)
  | "SCHEDULED" // 공개 일정이 확정된 상태
  | "LIVE" // 실제로 공개되어 후원 진행 중
  | "ENDED" // 모금이 종료된 상태
  | "CANCELED"; // 취소됨

// 한글 설명: 심사 파이프라인 기준 프로젝트 상태
export type ProjectReviewStatus =
  | "DRAFT" // 작성 중
  | "NONE" // 심사 요청 준비 완료 (제출 대기)
  | "REVIEW" // 심사 진행 중
  | "REJECTED" // 반려됨
  | "APPROVED"; // 심사 완료 (승인)

// 한글 설명: 백엔드 Category enum과 1:1로 대응하는 프론트 카테고리 타입
export type ProjectCategory =
  | "TECH"
  | "DESIGN"
  | "FOOD"
  | "FASHION"
  | "BEAUTY"
  | "HOME_LIVING"
  | "GAME"
  | "ART"
  | "PUBLISH";

// 한글 설명: UI에서 사용할 한글 라벨 매핑
export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  TECH: "테크·가전",
  DESIGN: "디자인",
  FOOD: "푸드",
  FASHION: "패션",
  BEAUTY: "뷰티",
  HOME_LIVING: "홈·리빙",
  GAME: "게임",
  ART: "아트",
  PUBLISH: "출판",
};

// 한글 설명: 레거시 호환성을 위한 타입 별칭 (기존 코드와의 호환성 유지)
export type CategoryEnum = ProjectCategory;

// 한글 설명: 결과 상태 (성공/실패)
export type ResultStatus = "NONE" | "SUCCESS" | "FAILED" | null;

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
  rewards: CreateRewardRequestDTO[]; // 리워드 목록
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
  // 한글 설명: 리워드 정보고시 (전자상거래법에 따른 필수 정보)
  disclosure?: RewardDisclosureDTO;
}

/**
 * 리워드 정보고시 DTO (백엔드 연동용)
 * 프론트엔드의 RewardDisclosure 타입과 매핑됩니다.
 */
// 한글 설명: rewardDisclosure 타입 import (Windows 대소문자 문제 해결)
// @ts-ignore - Windows 파일 시스템 대소문자 구분 문제로 인한 임시 처리
import type { RewardDisclosure } from "../../creator/types/rewardDisclosure";
export type RewardDisclosureDTO = RewardDisclosure;

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
  category: CategoryLabel;
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
  // 한글 설명: 현재 로그인한 서포터 기준 찜 여부
  bookmarked: boolean;
  // 한글 설명: 이 프로젝트를 찜한 전체 서포터 수
  bookmarkCount: number;
}

/**
 * 프로젝트 목록 응답 (카드 형태) - 기존 타입
 */
export interface ProjectCardResponseDTO {
  id: ProjectId;
  slug: string;
  title: string;
  summary: string;
  category: CategoryLabel;
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
 * 지금 뜨는 프로젝트 응답 DTO (백엔드 TrendingProjectResponse 대응)
 * 기존 /trending API 사용 시
 */
export interface TrendingProjectResponseDTO {
  id: number;
  title: string;
  summary: string | null;
  coverImageUrl: string | null;
  category: CategoryEnum;
  lifecycleStatus: ProjectLifecycleStatus;
  bookmarkCount: number;
  startDate: string | null; // YYYY-MM-DD 형식
  endDate: string | null; // YYYY-MM-DD 형식
  daysLeft: number | null; // endDate 기준 오늘부터 남은 일수, 지났으면 0
  scheduled: boolean; // lifecycleStatus === "SCHEDULED"
  live: boolean; // lifecycleStatus === "LIVE"
}

/**
 * 지금 뜨는 프로젝트 응답 DTO (점수 기반, 백엔드 TrendingProjectScoreResponse 대응)
 * /trending-scored API 사용 시
 */
export interface TrendingProjectScoreResponseDTO {
  id?: number; // 한글 설명: 프로젝트 ID (하위 호환성)
  projectId?: number; // 한글 설명: 프로젝트 ID (백엔드 응답 필드명)
  title: string;
  summary: string | null;
  coverImageUrl: string | null;
  category: CategoryEnum;
  lifecycleStatus: ProjectLifecycleStatus;
  score: number; // 한글 설명: 트렌딩 점수
  startDate: string | null; // YYYY-MM-DD 형식
  endDate: string | null; // YYYY-MM-DD 형식
  daysLeft: number | null; // endDate 기준 오늘부터 남은 일수, 지났으면 0
  liveStartAt?: string | null; // 한글 설명: LIVE 시작 일시 (ISO 8601 형식)
  liveEndAt?: string | null; // 한글 설명: LIVE 종료 일시 (ISO 8601 형식)
  scheduled: boolean; // lifecycleStatus === "SCHEDULED"
  live: boolean; // lifecycleStatus === "LIVE"
}

/**
 * 지금 많이 보고 있는 프로젝트 응답 DTO (백엔드 MostViewedProjectResponse 대응)
 * /most-viewed API 사용 시
 */
export interface MostViewedProjectResponseDTO {
  id: number;
  title: string;
  summary: string | null;
  coverImageUrl: string | null;
  category: CategoryEnum;
  lifecycleStatus: ProjectLifecycleStatus;
  viewCount: number; // 한글 설명: 조회수
  windowLabel: string; // 한글 설명: 시간 윈도우 라벨 (예: "최근 1시간", "최근 60분")
  startDate: string | null; // YYYY-MM-DD 형식
  endDate: string | null; // YYYY-MM-DD 형식
  daysLeft: number | null; // endDate 기준 오늘부터 남은 일수, 지났으면 0
  scheduled: boolean; // lifecycleStatus === "SCHEDULED"
  live: boolean; // lifecycleStatus === "LIVE"
}

/**
 * 프로젝트 목록 응답 DTO (백엔드 ProjectListResponse 대응)
 * 홈 화면의 마감 임박, 신규 업로드, 성공 메이커, 첫 도전 메이커 섹션에서 사용
 */
export interface ProjectListResponseDTO {
  id: number;
  maker: string; // 메이커 이름
  title: string;
  summary: string | null;
  goalAmount: number | null;
  raised: number | null; // 한글 설명: 누적 모금액 (null 가능)
  backerCount: number | null; // 한글 설명: 후원자 수 (null 가능)
  startDate: string | null; // YYYY-MM-DD 형식
  endDate: string | null; // YYYY-MM-DD 형식
  category: CategoryEnum;
  coverImageUrl: string | null;
  coverGallery: string[] | null;
  resultStatus: ResultStatus;
  liveStartAt: string | null; // 한글 설명: 필요 시 상세에서 사용
  liveEndAt: string | null; // 한글 설명: 필요 시 상세에서 사용
  // 한글 설명: 뱃지 플래그들
  badgeNew: boolean; // "신규" 뱃지 여부
  badgeClosingSoon: boolean; // "마감 임박" 뱃지 여부
  badgeSuccessMaker: boolean; // "성공 메이커" 뱃지 여부
  badgeFirstChallengeMaker: boolean; // "첫 도전 메이커" 뱃지 여부
  // 한글 설명: 목표 달성에 가까운 프로젝트 섹션용 달성률 (0~100 정수 퍼센트, null 가능)
  achievementRate?: number | null;
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
  // 한글 설명: 리워드 정보고시 (전자상거래법에 따른 필수 정보)
  disclosure?: RewardDisclosureDTO | null;
}

/**
 * 페이지네이션된 프로젝트 목록 응답
 */
export interface ProjectListResponse {
  items: ProjectCardResponseDTO[];
  total: number; // 전체 항목 수
  page: number; // 현재 페이지
  pageSize: number; // 페이지 크기
  hasNext: boolean; // 다음 페이지 존재 여부
}

// 한글 설명: CategoryLabel은 shared/utils/categoryMapper에서 import
import type { CategoryLabel } from "../../shared/utils/categoryMapper";

// ─────────────────────────
// 임시 저장 및 프로젝트 관리 관련 DTO
// ─────────────────────────

/**
 * 임시 저장 프로젝트 요청 DTO
 */
export interface TempProjectRequestDTO {
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
}

/**
 * 임시 저장 프로젝트 응답 DTO
 */
export interface TempProjectResponseDTO {
  id: ProjectId;
  projectId?: ProjectId; // 한글 설명: 백엔드 응답에 projectId가 있을 경우 (id와 동일)
  title: string;
  summary: string;
  category: CategoryLabel;
  storyMarkdown: string;
  coverImageUrl: string | null;
  coverGallery: string[];
  goalAmount: number;
  startDate: string | null;
  endDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 프로젝트 생성 요청 응답 DTO
 */
export interface CreateProjectRequestResponseDTO {
  projectId: ProjectId;
  status: ProjectReviewStatus;
  message?: string;
}

/**
 * 프로젝트 상태 요약 응답 DTO
 */
export interface ProjectSummaryResponseDTO {
  total: number;
  byStatus?: Record<ProjectStatus, number>; // 한글 설명: 백엔드 응답 구조에 따라 선택적
  // 한글 설명: 또는 개별 카운트 필드 (백엔드 응답 구조에 따라)
  draftCount?: number;
  reviewCount?: number;
  approvedCount?: number;
  scheduledCount?: number;
  liveCount?: number;
  endCount?: number;
  rejectedCount?: number;
}

/**
 * 프로젝트 북마크 응답 DTO
 */
export interface ProjectBookmarkResponseDTO {
  projectId: ProjectId;
  bookmarked: boolean;
  bookmarkCount: number;
}

