// 한글 설명: 온보딩 관련 타입 정의

// 한글 설명: 온보딩 상태
export type OnboardingStatus =
  | "NOT_STARTED" // 아직 시작 안 함
  | "SKIPPED_ONCE" // 첫 로그인에서 "나중에 하기" 클릭
  | "DISMISSED" // 배너 닫기 클릭
  | "COMPLETED"; // 완료

// 한글 설명: 관심 카테고리 (프로젝트 카테고리와 동일)
export type InterestCategory =
  | "TECH"
  | "DESIGN"
  | "FOOD"
  | "FASHION"
  | "BEAUTY"
  | "HOME_LIVING"
  | "GAME"
  | "ART"
  | "PUBLISH";

// 한글 설명: 관심 카테고리 라벨
export const INTEREST_CATEGORY_LABELS: Record<InterestCategory, string> = {
  TECH: "테크·가전",
  DESIGN: "디자인",
  FOOD: "푸드",
  FASHION: "패션",
  BEAUTY: "뷰티",
  HOME_LIVING: "홈·리빙",
  GAME: "게임·굿즈",
  ART: "예술",
  PUBLISH: "출판",
};

// 한글 설명: 선호하는 프로젝트 스타일
export type ProjectStylePreference =
  | "PRACTICAL" // 실용템 위주
  | "UNIQUE_GOODS" // 유니크한 굿즈
  | "FNB" // F&B(맛집·간편식)
  | "DIGITAL_SERVICE"; // 디지털·서비스

// 한글 설명: 프로젝트 스타일 라벨
export const PROJECT_STYLE_LABELS: Record<ProjectStylePreference, string> = {
  PRACTICAL: "실용템 위주",
  UNIQUE_GOODS: "유니크한 굿즈",
  FNB: "F&B(맛집·간편식)",
  DIGITAL_SERVICE: "디지털·서비스",
};

// 한글 설명: 유입 경로
export type ReferralSource =
  | "FRIEND" // 지인 추천
  | "INSTAGRAM" // 인스타
  | "YOUTUBE" // 유튜브
  | "BLOG_CAFE" // 블로그/카페
  | "SEARCH" // 검색
  | "OTHER"; // 기타(직접 입력)

// 한글 설명: 유입 경로 라벨
export const REFERRAL_SOURCE_LABELS: Record<ReferralSource, string> = {
  FRIEND: "지인 추천",
  INSTAGRAM: "인스타",
  YOUTUBE: "유튜브",
  BLOG_CAFE: "블로그/카페",
  SEARCH: "검색",
  OTHER: "기타",
};

// 한글 설명: 예산 범위
export type BudgetRange =
  | "UNDER_50K" // 5만원 미만
  | "50K_100K" // 5만원~10만원
  | "100K_200K" // 10만원~20만원
  | "200K_500K" // 20만원~50만원
  | "OVER_500K" // 50만원 이상
  | "NO_PREFERENCE"; // 선호 없음

// 한글 설명: 예산 범위 라벨
export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  UNDER_50K: "5만원 미만",
  "50K_100K": "5만원~10만원",
  "100K_200K": "10만원~20만원",
  "200K_500K": "20만원~50만원",
  OVER_500K: "50만원 이상",
  NO_PREFERENCE: "선호 없음",
};

// 한글 설명: 알림 설정 선호도
export type NotificationPreference =
  | "ALL" // 모든 알림 받기
  | "IMPORTANT_ONLY" // 중요 알림만
  | "NONE"; // 알림 받지 않기

// 한글 설명: 알림 설정 라벨
export const NOTIFICATION_PREFERENCE_LABELS: Record<
  NotificationPreference,
  string
> = {
  ALL: "모든 알림 받기",
  IMPORTANT_ONLY: "중요 알림만",
  NONE: "알림 받지 않기",
};

// 한글 설명: 온보딩 데이터 요청 DTO
export interface OnboardingRequestDTO {
  interestCategories?: InterestCategory[]; // 관심 카테고리 (다중 선택)
  projectStylePreference?: ProjectStylePreference | null; // 선호하는 프로젝트 스타일
  referralSource?: ReferralSource | null; // 유입 경로
  referralSourceOther?: string | null; // 유입 경로 기타 (직접 입력)
  budgetRange?: BudgetRange | null; // 예산 범위
  hasBackingExperience?: boolean | null; // 후원 경험 여부
  notificationPreference?: NotificationPreference | null; // 알림 설정 선호도
}

// 한글 설명: 온보딩 상태 응답 DTO
export interface OnboardingStatusResponseDTO {
  status: OnboardingStatus;
  data?: OnboardingRequestDTO | null; // 완료된 경우 온보딩 데이터 포함
}

// 한글 설명: 온보딩 상태 업데이트 요청 DTO
export interface OnboardingStatusUpdateRequestDTO {
  status: "SKIPPED_ONCE" | "DISMISSED";
}

