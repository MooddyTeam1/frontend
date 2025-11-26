// 한글 설명: 서포터 온보딩 관련 타입 정의

// 한글 설명: 온보딩 상태 (백엔드 OnboardingStatus enum과 매핑)
export type OnboardingStatus =
  | "NOT_STARTED" // 아직 시작 안 함
  | "IN_PROGRESS" // 진행 중
  | "COMPLETED" // 완료
  | "SKIPPED"; // 스킵됨

// 한글 설명: 프로젝트 카테고리 (백엔드 Category enum과 동일)
// 한글 설명: categoryMapper.ts의 CategoryEnum과 동일한 값 사용
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

// 한글 설명: 선호하는 프로젝트 스타일 (백엔드 ProjectStylePreference enum과 동일)
// 한글 설명: TODO: 백엔드 enum 값 확인 필요 (예시 값)
export type ProjectStylePreference =
  | "PRACTICAL" // 실용템 위주
  | "UNIQUE_GOODS" // 유니크한 굿즈
  | "FNB" // F&B(맛집·간편식)
  | "DIGITAL_SERVICE"; // 디지털·서비스

// 한글 설명: 예산 범위 (백엔드 BudgetRange enum과 동일)
// 한글 설명: TODO: 백엔드 enum 값 확인 필요 (예시 값)
export type BudgetRange =
  | "UNDER_50K" // 5만원 미만
  | "BETWEEN_50K_100K" // 5만원~10만원
  | "BETWEEN_100K_200K" // 10만원~20만원
  | "BETWEEN_200K_500K" // 20만원~50만원
  | "OVER_500K" // 50만원 이상
  | "NO_PREFERENCE"; // 선호 없음

// 한글 설명: 크라우드펀딩 후원 경험 (백엔드 FundingExperience enum과 동일)
// 한글 설명: TODO: 백엔드 enum 값 확인 필요 (예시 값)
export type FundingExperience = "YES" | "NO";

// 한글 설명: 유입 경로 (백엔드 AcquisitionChannel enum과 동일)
// 한글 설명: TODO: 백엔드 enum 값 확인 필요 (예시 값)
export type AcquisitionChannel =
  | "FRIEND" // 지인 추천
  | "INSTAGRAM" // 인스타
  | "YOUTUBE" // 유튜브
  | "BLOG" // 블로그/카페
  | "SEARCH" // 검색
  | "OTHER"; // 기타

// 한글 설명: 알림 설정 선호도 (백엔드 NotificationPreference enum과 동일)
// 한글 설명: TODO: 백엔드 enum 값 확인 필요 (예시 값)
export type NotificationPreference =
  | "ALL" // 모든 알림 받기
  | "IMPORTANT_ONLY" // 중요 알림만
  | "NONE"; // 알림 받지 않기

// 한글 설명: 서포터 온보딩 상태 응답 DTO
export interface SupporterOnboardingStatusResponse {
  onboardingStatus: OnboardingStatus;
  step1Completed: boolean; // 한글 설명: 관심 카테고리 입력 여부
  step2Completed: boolean; // 한글 설명: 예산/경험/유입/알림 중 하나 이상 입력되었는지 여부
  // 한글 설명: 백엔드에서 completed, skipped 필드를 직접 제공하는 경우 아래 필드 사용
  // completed?: boolean; // 한글 설명: 온보딩 전체 완료 여부
  // skipped?: boolean; // 한글 설명: "나중에 하기"로 스킵했는지 여부
}

// 한글 설명: 온보딩 상태를 UI에서 사용하기 쉽게 변환한 타입
export interface SupporterOnboardingStatus {
  completed: boolean; // 한글 설명: 온보딩 전체 완료 여부
  skipped: boolean; // 한글 설명: "나중에 하기"로 스킵했는지 여부
  step1Completed: boolean; // 한글 설명: Step1 완료 여부
  step2Completed: boolean; // 한글 설명: Step2 완료 여부
  onboardingStatus: OnboardingStatus; // 한글 설명: 원본 상태 값
}

// 한글 설명: 서포터 온보딩 데이터 응답 DTO (온보딩 정보 조회용)
export interface SupporterOnboardingDataResponse {
  interestCategories?: ProjectCategory[]; // 한글 설명: 관심 카테고리 목록
  preferredStyles?: ProjectStylePreference[]; // 한글 설명: 선호 스타일 목록
  budgetRange?: BudgetRange; // 한글 설명: 예산 범위
  fundingExperience?: FundingExperience; // 한글 설명: 후원 경험
  acquisitionChannel?: AcquisitionChannel; // 한글 설명: 유입 경로
  acquisitionChannelEtc?: string | null; // 한글 설명: 유입 경로 기타 입력값
  notificationPreference?: NotificationPreference; // 한글 설명: 알림 설정 (프로필 설정에서는 수정 불가)
}

// 한글 설명: Step1 요청 DTO
export interface SupporterOnboardingStep1Request {
  interestCategories: ProjectCategory[]; // 한글 설명: 필수, 1개 이상
  preferredStyles?: ProjectStylePreference[]; // 한글 설명: 선택
}

// 한글 설명: Step2 요청 DTO
export interface SupporterOnboardingStep2Request {
  budgetRange?: BudgetRange;
  fundingExperience?: FundingExperience;
  acquisitionChannel?: AcquisitionChannel;
  acquisitionChannelEtc?: string | null; // 한글 설명: 기타 선택 시 직접 입력
  notificationPreference?: NotificationPreference;
}

// 한글 설명: 화면 표시용 라벨 매핑 상수

// 한글 설명: 프로젝트 카테고리 라벨 (categoryMapper.ts의 CATEGORY_OPTIONS와 동일)
import {
  CATEGORY_OPTIONS,
  toCategoryEnum,
  toCategoryLabel,
} from "../../../shared/utils/categoryMapper";
import type {
  CategoryLabel,
  CategoryEnum,
} from "../../../shared/utils/categoryMapper";

// 한글 설명: 카테고리 옵션 (한글 라벨 배열)
export const CATEGORY_OPTIONS_FOR_ONBOARDING = CATEGORY_OPTIONS;

// 한글 설명: 한글 라벨을 백엔드 enum으로 변환하는 헬퍼
export const categoryLabelToEnum = (label: CategoryLabel): ProjectCategory => {
  return toCategoryEnum(label) as ProjectCategory;
};

// 한글 설명: 백엔드 enum을 한글 라벨로 변환하는 헬퍼
export const categoryEnumToLabel = (
  enumValue: ProjectCategory
): CategoryLabel => {
  return toCategoryLabel(enumValue as CategoryEnum);
};

// 한글 설명: 프로젝트 스타일 옵션 (라벨과 enum 값 매핑)
export const PROJECT_STYLE_OPTIONS: Array<{
  value: ProjectStylePreference;
  label: string;
}> = [
  { value: "PRACTICAL", label: "실용템 위주" },
  { value: "UNIQUE_GOODS", label: "유니크한 굿즈" },
  { value: "FNB", label: "F&B(맛집·간편식)" },
  { value: "DIGITAL_SERVICE", label: "디지털·서비스" },
];

// 한글 설명: 예산 범위 옵션
export const BUDGET_RANGE_OPTIONS: Array<{
  value: BudgetRange;
  label: string;
}> = [
  { value: "UNDER_50K", label: "5만원 미만" },
  { value: "BETWEEN_50K_100K", label: "5만원~10만원" },
  { value: "BETWEEN_100K_200K", label: "10만원~20만원" },
  { value: "BETWEEN_200K_500K", label: "20만원~50만원" },
  { value: "OVER_500K", label: "50만원 이상" },
  { value: "NO_PREFERENCE", label: "선호 없음" },
];

// 한글 설명: 후원 경험 옵션
export const FUNDING_EXPERIENCE_OPTIONS: Array<{
  value: FundingExperience;
  label: string;
}> = [
  { value: "YES", label: "네, 있어요" },
  { value: "NO", label: "아니요, 처음이에요" },
];

// 한글 설명: 유입 경로 옵션
export const ACQUISITION_CHANNEL_OPTIONS: Array<{
  value: AcquisitionChannel;
  label: string;
}> = [
  { value: "FRIEND", label: "지인 추천" },
  { value: "INSTAGRAM", label: "인스타" },
  { value: "YOUTUBE", label: "유튜브" },
  { value: "BLOG", label: "블로그/카페" },
  { value: "SEARCH", label: "검색" },
  { value: "OTHER", label: "기타" },
];

// 한글 설명: 알림 설정 옵션
export const NOTIFICATION_PREFERENCE_OPTIONS: Array<{
  value: NotificationPreference;
  label: string;
}> = [
  { value: "ALL", label: "모든 알림 받기" },
  { value: "IMPORTANT_ONLY", label: "중요 알림만" },
  { value: "NONE", label: "알림 받지 않기" },
];

