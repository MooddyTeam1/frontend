// 한글 설명: 관리자 프로젝트 심사 관련 타입 정의

// 한글 설명: 프로젝트 카테고리 Enum
export type Category = 
  | "TECH"
  | "DESIGN"
  | "FOOD"
  | "FASHION"
  | "BEAUTY"
  | "HOME_LIVING"
  | "GAME"
  | "ART"
  | "PUBLISH";

// 한글 설명: 프로젝트 심사 상태 Enum
export type ProjectReviewStatus = 
  | "NONE"      // 심사 요청 안함
  | "REVIEW"    // 심사 요청함 (=심사중)
  | "APPROVED"  // 승인됨
  | "REJECTED"; // 반려됨

// 한글 설명: 프로젝트 라이프사이클 상태 Enum
export type ProjectLifecycleStatus = 
  | "DRAFT"     // 심사 대기
  | "SCHEDULED" // 공개 예정
  | "LIVE"      // 진행중
  | "ENDED"     // 종료됨
  | "CANCELED"; // 취소함

// 한글 설명: 메이커 유형 Enum
export type MakerType = 
  | "INDIVIDUAL" // 개인 메이커
  | "BUSINESS";  // 사업자 메이커

// 한글 설명: 심사 대기 프로젝트 목록 항목 DTO
export interface AdminProjectReviewResponse {
  projectId: number;
  maker: string;              // 메이커 이름
  title: string;               // 프로젝트 제목
  requestAt: string;           // 심사 요청 시각 (ISO 8601 형식)
  reviewStatus: ProjectReviewStatus;
  rewardNames: string[];       // 리워드 이름 목록
}

// 한글 설명: 관리자용 메이커 프로필 DTO
export interface AdminMakerProfileResponse {
  // 공통 필드
  id: number;
  ownerUserId: number;
  makerType: MakerType;
  name: string;
  productIntro: string | null;
  coreCompetencies: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  createdAt: string;
  updatedAt: string;
  
  // 개인 메이커 전용 필드
  imageUrl: string | null;
  techStack: string[];
  keywords: string[];
  
  // 사업자 메이커 전용 필드
  businessNumber: string | null;
  businessName: string | null;
  businessItem: string | null;
  onlineSalesReportNumber: string | null;
  establishedAt: string | null;  // YYYY-MM-DD 형식
  industryType: string | null;
  representative: string | null;
  location: string | null;
}

// 한글 설명: 리워드 옵션 구성 DTO (추후 확장용)
export interface RewardOptionConfigResponse {
  hasOptions: boolean | null;
  options: RewardOptionItemResponse[] | null;
}

// 한글 설명: 리워드 옵션 항목 DTO
export interface RewardOptionItemResponse {
  name: string;
  type: string;
  required: boolean | null;
  choices: string[] | null;
}

// 한글 설명: 리워드 정보고시 DTO (추후 확장용)
export interface RewardDisclosureResponse {
  category: string | null;
  common: RewardCommonDisclosureResponse | null;
  categorySpecific: Record<string, unknown> | null;
}

// 한글 설명: 리워드 정보고시 공통 항목 DTO
export interface RewardCommonDisclosureResponse {
  manufacturer: string | null;
  importer: string | null;
  countryOfOrigin: string | null;
  manufacturingDate: string | null;
  releaseDate: string | null;
  expirationDate: string | null;
  qualityAssurance: string | null;
  asContactName: string | null;
  asContactPhone: string | null;
  shippingFee: number | null;
  installationFee: number | null;
  kcCertification: boolean | null;
  kcCertificationNumber: string | null;
  functionalCertification: boolean | null;
  importDeclaration: boolean | null;
}

// 한글 설명: 관리자용 리워드 응답 DTO
export interface RewardResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  limitQty: number | null;
  estShippingMonth: string | null;  // YYYY-MM-DD 형식
  available: boolean;
  optionConfig: RewardOptionConfigResponse | null;
  disclosure: RewardDisclosureResponse | null;
}

// 한글 설명: 관리자 프로젝트 심사 상세 DTO
export interface AdminProjectDetailResponse {
  // 기본 프로젝트 정보
  projectId: number;
  makerId: number;
  makerName: string;
  title: string;
  summary: string;
  category: Category;
  storyMarkdown: string;
  coverImageUrl: string | null;
  coverGallery: string[];
  goalAmount: number;
  startDate: string | null;  // YYYY-MM-DD 형식
  endDate: string | null;   // YYYY-MM-DD 형식
  
  // 메이커 프로필
  makerProfile: AdminMakerProfileResponse;
  
  // 상태 / 심사 관련 필드
  projectReviewStatus: ProjectReviewStatus;
  projectLifecycleStatus: ProjectLifecycleStatus;
  requestReviewAt: string | null;  // ISO 8601 형식
  approvedAt: string | null;       // ISO 8601 형식
  rejectedAt: string | null;       // ISO 8601 형식
  rejectedReason: string | null;
  
  // 리워드 / 메타 정보
  rewards: RewardResponse[];
  createdAt: string;
  updatedAt: string;
}

// 한글 설명: 프로젝트 상태 응답 DTO
export interface ProjectStatusResponse {
  id: number;
  lifecycleStatus: ProjectLifecycleStatus;
  reviewStatus: ProjectReviewStatus;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectedReason: string | null;
}

// 한글 설명: 프로젝트 반려 요청 DTO
export interface RejectProjectRequest {
  reason: string;  // 필수, 최대 1000자
}

// 한글 설명: 반려 사유 프리셋 응답 DTO
export interface RejectReasonPresetResponse {
  presets: string[];
}

