// 한글 설명: 메이커 관련 도메인 타입 정의. DB 스키마에 맞춘 DTO/타입 선언

export type MakerId = string;
export type UserId = string;

// 한글 설명: 메이커 유형 (개인/사업자)
export type MakerType = "INDIVIDUAL" | "BUSINESS";

export interface MakerDTO {
  id: MakerId;
  ownerUserId: UserId; // users.id, 1유저 1메이커
  makerType: MakerType; // 한글 설명: 개인 또는 사업자
  name: string; // 기본 생성 시 users.email을 기본값으로 사용 후 수정 가능
  businessNumber?: string | null; // 사업자등록번호 (사업자일 때 필수)
  businessName?: string | null; // 사업자 상호명 (사업자일 때)
  businessType?: string | null; // 업태 (사업자일 때)
  onlineSalesReportNumber?: string | null; // 통신판매업 신고번호 (사업자일 때)
  establishedAt: string | null; // yyyy-mm-dd
  industryType: string | null;
  representative: string | null;
  location: string | null;
  productIntro: string | null;
  coreCompetencies: string | null;
  imageUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  techStack: string[]; // tech_stack_json 파싱 결과
  keywords: number[]; // maker_keywords.id 목록
  createdAt?: string;
  updatedAt?: string;
}

export interface MakerKeywordDTO {
  id: number;
  name: string;
  createdAt?: string;
}

// 한글 설명: 메이커 정산 계좌 정보 DTO (백엔드 MakerSettlementProfile 엔티티와 매핑)
export interface MakerSettlementProfileDTO {
  id: number; // 한글 설명: 정산 계좌 프로필 ID
  makerId: string; // 한글 설명: 메이커 ID
  bankName: string | null; // 한글 설명: 은행명 (최대 50자)
  accountNumber: string | null; // 한글 설명: 계좌번호 (최대 50자)
  accountHolder: string | null; // 한글 설명: 예금주 (최대 100자)
  createdAt?: string; // 한글 설명: 생성일시 (ISO 8601 형식)
  updatedAt?: string; // 한글 설명: 수정일시 (ISO 8601 형식)
}

// 한글 설명: 정산 계좌 정보 업데이트 요청 DTO
export interface MakerSettlementProfileUpdateRequest {
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
}

// 한글 설명: 메이커 소식 타입 정의
export type MakerNewsId = string;

// 한글 설명: 메이커 소식 유형
export type MakerNewsType = "EVENT" | "NOTICE" | "NEW_PRODUCT";

// 한글 설명: 메이커 소식 생성 요청 DTO
export interface MakerNewsCreateRequest {
  title: string;
  contentMarkdown: string; // 한글 설명: 마크다운 형식의 소식 내용
  newsType: MakerNewsType; // 한글 설명: 소식 유형 (이벤트, 공지, 신제품 출시)
}

// 한글 설명: 메이커 소식 응답 DTO
export interface MakerNewsResponse {
  id: MakerNewsId;
  makerId: MakerId;
  title: string;
  contentMarkdown: string;
  newsType: MakerNewsType; // 한글 설명: 소식 유형
  createdAt: string; // ISO 8601 형식
  updatedAt: string; // ISO 8601 형식
}


